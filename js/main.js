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

// sccroll smooth
(function () {
	const scrollLinks = document.querySelectorAll('a.scroll-link');
	for (const scrollLink of scrollLinks) {
		scrollLink.addEventListener('click', function (e) {
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

const openModal = function () {
	modalCart.classList.add('show');
};
const closeModal = function () {
	modalCart.classList.remove('show');
};
buttonCart.addEventListener('click', openModal);
// modalClose.addEventListener('click', closeModal);

modalCart.addEventListener('click', (e) => {
	const target = e.target;
	if (target.classList.contains('overlay') || target.classList.contains('modalClose')) {
		closeModal();
	}
});

const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');

const getGoods = async function () { // получаем данные с сервера
	const result = await fetch('/db/db.json');
	if (!result.ok) {
		throw 'Ошибочка вышла ' + result.status;		
	}
	return await result.json();
};



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


// getGoods().then(renderCards);  

more.addEventListener('click', function (e) { // выводим товары при клике на ссылку View All
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
	getGoods().then(function (data) {
		const filteredGoods = data.filter( function (good) {			
			return good[field] === value;
		});
		return filteredGoods;
	}).then(renderCards);
};

navigationLink.forEach(function (link) { // по клику на ссылке товара, выводим отфильтрованные элементы
	link.addEventListener('click', function (event) {
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