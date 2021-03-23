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
	const scrollLink = document.querySelectorAll('a.scroll-link');
	for (let i = 0; i < scrollLink.length; i++) {
		scrollLink[i].addEventListener('click', function (e) {
			e.preventDefault();
			const id = scrollLink[i].getAttribute('href')
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		});
	}
})();

const openModal = function () {
	modalCart.classList.add('show');
}
const closeModal = function () {
	modalCart.classList.remove('show');
}
buttonCart.addEventListener('click', openModal);
// modalClose.addEventListener('click', closeModal);

modalCart.addEventListener('click', (e) => {
	const target = e.target;
	if (target.classList.contains('overlay') || target.classList.contains('modalClose')) {
		closeModal();
	}
});