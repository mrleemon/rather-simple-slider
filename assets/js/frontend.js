(function () {

	document.addEventListener('DOMContentLoaded', function (e) {

		document.querySelectorAll('.swiper').forEach(function (item) {

			var settings = JSON.parse(item.dataset.swiper);
			var swiper = new Swiper(item, {
				loop: true,
				effect: settings.fx,
				fadeEffect: {
					crossFade: true
				},
				centeredSlides: false,
				autoHeight: false,
				observer: true,
				autoplay: settings.auto ? {
					delay: 3000,
					disableOnInteraction: false,
					pauseOnMouseEnter: true,
				} : false,
				navigation: {
					nextEl: '.swiper .slider-navigation .slider-next',
					prevEl: '.swiper .slider-navigation .slider-prev',
				}
			});

			var elText = item.querySelector('.slider-switch .toggle-text');
			var elMedia = item.querySelector('.slider-switch .toggle-media');

			if (elText) {
				elText.addEventListener('click', function (e) {
					e.preventDefault();
					elText.classList.toggle('toggled-on');
					elMedia.classList.toggle('toggled-on');
					item.querySelector('.slider-text, .swiper-wrapper').classList.toggle('toggled-on');
					item.querySelector('.swiper-wrapper').classList.toggle('toggled-on');
				});
			}

			if (elMedia) {
				elMedia.addEventListener('click', function (e) {
					e.preventDefault();
					elText.classList.toggle('toggled-on');
					elMedia.classList.toggle('toggled-on');
					item.querySelector('.slider-text, .swiper-wrapper').classList.toggle('toggled-on');
					item.querySelector('.swiper-wrapper').classList.toggle('toggled-on');
				});
			}

		});

	});

})();