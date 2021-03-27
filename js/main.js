'use strict';
const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// cart

const buttonCart = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close');

const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const showAcsessories = document.querySelectorAll('.show-acsessories');
const showClothing = document.querySelectorAll('.show-clothing');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cardTableTotal = document.querySelector('.card-table__total');
const cartCount = document.querySelector('.cart-count');
const btnClear = document.querySelector('.btn-clear');


// первый способ
// const getGoods = async function () { // получаем данные с сервера
// 	const result = await fetch('db/db.json');
// 	if (!result.ok) {
// 		throw 'Ошибочка вышла ' + result.status;		
// 	}
// 	return await result.json();
// };

// Второй способ с проверкой, были ли ранее получены данные с сервера
const checkGoods = () => {
	const data = [];
	return  async function () { // получаем данные с сервера
		if(data.length) return data;

		const result = await fetch('db/db.json');
		if (!result.ok) {
			throw 'Ошибочка вышла ' + result.status;		
		}
		data.push(...( await result.json()));
		return data;
	};
}

const getGoods = checkGoods();


const cart = {
	cartGoods: [],
	clearCart() {
		this.cartGoods.length = 0;
		this.countQuantity();
		this.renderCart();
		closeModal();
	},
	renderCart(){ // выводи товары в DOM
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({id, name, price, count}) =>{
			const trGood =document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;

			trGood.innerHTML = `
				<td>${name}</td>
				<td>${price} $</td>
				<td><button class="cart-btn-minus" data-id="${id}">-</button></td>
				<td>${count}</td>
				<td><button class="cart-btn-plus" data-id="${id}">+</button></td>
				<td>${price * count} $</td>
				<td><button class="cart-btn-delete" data-id="${id}">x</button></td>
			`;
			cartTableGoods.append(trGood);
		});
		const totalPrice = this.cartGoods.reduce((sum, item, index, arr) => { // перебираем массив товаров и суммируем итоговую сумму
			return sum + item.price * item.count;
		}, 0);
		cardTableTotal.textContent = totalPrice +' $';
	},
	deleteGoog(id){ // удаляем товары из корзины
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
		this.countQuantity();
	},
	minusGood(id){ // уменьшаем кол-во товаров в корзине
		for (const item of this.cartGoods) {
			if(item.id === id) {
				if (item.count <= 1) {
					// console.log('222');
					this.deleteGoog(id);
				} else {
					item.count--;
				}
				break;
			}
		}
		this.renderCart();
		this.countQuantity();
	},
	plusGood(id){ // увеличиваем кол-во товаров в корзине
		for (const item of this.cartGoods) {
			if(item.id === id) {
				item.count++;
				break;
			}
		}
		this.renderCart();
		this.countQuantity();
	},
	addCartGoods(id){ // добавляем товары в корзину
		const goodItem = this.cartGoods.find( item => item.id === id);
		if (goodItem) { // если товар уже есть в корзине, то увеличиваем его количество
			this.plusGood(id);
		} else { // если товара нет в корзине, делаем запрос к базе и добавляем новый товар 
			getGoods()
				.then(data => data.find( item => item.id === id))
				.then(({id, price, name}) => {
					this.cartGoods.push({
						id,
						name,
						price,
						count: 1
					});
					this.countQuantity();
				});
		}
	},
	countQuantity() {
		const countQuntity = this.cartGoods.reduce( (sum, item) => {
			return sum + item.count;
		}, 0)
		cartCount.textContent = countQuntity ? countQuntity : "";		
	}
};
btnClear.addEventListener('click', cart.clearCart.bind(cart)) // очищаем корзину вызвав метод clearCart и привязываем контекст вызова
document.body.addEventListener('click', (event) => {
	const addToCart = event.target.closest('.add-to-cart');
	if (addToCart) {
		cart.addCartGoods(addToCart.dataset.id);
	}
});

cartTableGoods.addEventListener("click", (e) => {
	e.preventDefault();
	const target = e.target;
	if (target.tagName === "BUTTON") {
		const id = target.closest('.cart-item').dataset.id;
		if (target.classList.contains('cart-btn-delete')) {
			cart.deleteGoog(id);
		}
		if (target.classList.contains('cart-btn-minus')) {
			cart.minusGood(id);
		}
		if (target.classList.contains('cart-btn-plus')) {
			cart.plusGood(id);
		}
	}
});
// sccroll smooth
(function () {
	const scrollLinks = document.querySelectorAll('a.scroll-link');
	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', (e) => {
			e.preventDefault();
			const id = scrollLink.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		});
	}
	// for (let i = 0; i < scrollLink.length; i++) {
	// 	scrollLinks[i].addEventListener('click', function (e) {
	// 		e.preventDefault();
	// 		const id = scrollLinks[i].getAttribute('href');
	// 		document.querySelector(id).scrollIntoView({
	// 			behavior: 'smooth',
	// 			block: 'start',
	// 		});
	// 	});
	// }
})();

const openModal = () => {
	cart.renderCart();
	modalCart.classList.add('show');
};
const closeModal = () => {
	modalCart.classList.remove('show');
};
buttonCart.addEventListener('click', openModal);
// modalClose.addEventListener('click', closeModal);

modalCart.addEventListener('click', (e) => {
	const target = e.target;
	if (target.classList.contains('overlay') || target.classList.contains('modal-close')) {
		closeModal();
	}
});


const createCard = function ({ label, name, img, description, id, price }) { // функция генерации карточки товаров
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';

	//const {label, name, img, description, id, price } = objCard; // деструктуризация объекта первый способ

	card.innerHTML = `
			<div class="goods-card">			
				${label ? `<span class="label">${label}</span>` : ""}
				<img src="db/${img}" alt="${name}" class="goods-image">
				<h3 class="goods-title">${name}</h3>				
				<p class="goods-description">${description}</p>				
				<button class="button goods-card-btn add-to-cart" data-id="${id}">
					<span class="button-price">$${price}</span>
				</button>
			</div>
	`;	
	return card;
};

const renderCards = function (data) {
	longGoodsList.textContent = '';
	const cards = data.map( createCard ); // обрабатывает массив с данными методом map() и в этот метод передаём функцию createCard (создания карточек с товаром)
	document.body.classList.add('show-goods');
	longGoodsList.append(...cards) // вывод карточек с товарами с помощью спред оператора
	// cards.forEach(function (card) { // традиционный способ вывода карточек с товаром 
	// 	longGoodsList.append(card);
	// });
}

more.addEventListener('click', (e) => { // выводим товары при клике на ссылку View All
	e.preventDefault();
	getGoods().then(renderCards);  

	setTimeout( function () { 
		document.querySelector('#body').scrollIntoView({ // скролим к началу документа
			behavior: 'smooth', 
			block: 'start',
		});
	}, 200);
})

const filterCards = function (field, value) { // фильтруем товары
	getGoods()
		.then( (data) => data.filter( (good) => good[field] === value ))
		.then(renderCards);
};

navigationLink.forEach(function (link) { // по клику на ссылке товара, выводим отфильтрованные элементы
	link.addEventListener('click', (event) => {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		if (field && value) {
			filterCards(field, value);			
		} else {
			getGoods().then(renderCards);
		}
	});
});

showAcsessories.forEach(function (item) {
	item.addEventListener('click', function (event) {
		event.preventDefault();
		filterCards('category', 'Accessories')
	})	
})
showClothing.forEach(function (item) {
	item.addEventListener('click', function (event) {
		event.preventDefault();
		filterCards('category', 'Clothing')
	})
})
 

const modalForm = document.querySelector('.modal-form');
const postData = dataUser => fetch('server.php', {
	method: 'POST',
	body: dataUser,
})
modalForm.addEventListener('submit', (event) => {
	event.preventDefault();
	const formData = new FormData(modalForm);
	formData.append('cart', JSON.stringify(cart.cartGoods));
	postData(formData)
	.then(response => {
		if(!response.ok) {
			throw new Error(response.status);
		}
		alert('Ваш заказ отправлен, с вами свяжутся в ближайшее время');
		console.log(response.statusText);
	})
	.catch( err => {
		alert('Ошибка отправки, повторите попытку позже')
		console.error(err);
	})
	.finally(() => {
		closeModal();
		modalForm.reset();
		cart.cartGoods.length = 0;
	});
})