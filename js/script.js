$('document').ready(function(){
	$('.main_slider_actions').slick({
		responsive: [
		    {
		      breakpoint: 767,
		      settings: {
		        arrows: false,
				autoplay: true,
		      }
			}
		],
	});

	$('.slider_new_products').slick({
		slidesToShow: 4,
		responsive: [
		    {
		      breakpoint: 1000,
		      settings: {
		        slidesToShow: 3,
		      }
			},
			{
				breakpoint: 750,
				settings: {
				  slidesToShow: 2,
				  autoplay: false,
				}
			},
			{
				breakpoint: 550,
				settings: {
				  slidesToShow: 1,
				  autoplay: false,
				}
			},
		],
	});

	$('.slider_blogs').slick({
		responsive: [
		    {
		      breakpoint: 1170,
		      settings: {
		        arrows: false,
				autoplay: true,
				pauseOnFocus: true,
				pauseOnHover: true,
		      }
			}
		],
	});

	$('.slider_catalogue').slick({
		slidesToShow: 9,
		responsive: [
		    {
		      breakpoint: 1200,
		      settings: {
				slidesToShow: 8,
		      }
			},
			{
				breakpoint: 1080,
				settings: {
				  slidesToShow: 7,
				}
			},
			{
				breakpoint: 900,
				settings: {
				  slidesToShow: 6,
				}
			},
			{
				breakpoint: 780,
				settings: {
				  slidesToShow: 5,
				}
			},
			{
				breakpoint: 650,
				settings: {
				  slidesToShow: 4,
				}
			},
			{
				breakpoint: 520,
				settings: {
				  slidesToShow: 3,
				}
			},
			{
				breakpoint: 370,
				settings: {
				  slidesToShow: 2,
				}
			},
		],
	});

	$('.slider_gallery_image_product').slick({
		dots: true,
		/*adaptiveHeight: true,*/
	});
});

//Для выподающего под-меню

"use strict"

const isMobile = {
	Android: function() {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function() {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function() {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function() {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function() {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function() {
		return (
			isMobile.Android() || 
			isMobile.BlackBerry() || 
			isMobile.iOS() || 
			isMobile.Opera() || 
			isMobile.Windows());
	}
};

//if(isMobile.iOS()) {
// Любые манипуляции при определении мобильного устройства на операционной системе от Apple: iOS
//}

//if(isMobile.any()) {
// Любые манипуляции при определении айфона
// Доступны следующие условия для операционных систем
// isMobile.Android() - устройство на Андроиде
// isMobile.BlackBerry() - устройство на BlackBerry
// isMobile.iOS() - устройство на iOS
// isMobile.Opera() - устройство, использующее Opera Mini
// isMobile.Windows() - устройство на Windows
// isMobile.any() - устройство на любой мобильной платформе
//}

//Выподающее под-меню

if (isMobile.any()) {
	document.body.classList.add('_touch');

	//Первым делом собираю в переменную все наши стрелочки - их может быть не 1
	let menuArrows = document.querySelectorAll('.menu_arrow');

	//Проверяю есть ли у нас вообще эти стрелочки в массиве
	if (menuArrows.length > 0) {
		//Если такие стрелки у нас есть, то я запускаю цыкл и прохожусь по всем этим стрелочкам
		for (let index = 0; index < menuArrows.length; index++) {
			const menuArrow = menuArrows[index];
			//Далее мы на каждую стрелочку навешиваем событие клик
			menuArrow.addEventListener("click", function (e) {
				//И при клике на стрелочку мы присваиваем класс _active родителю этой стрелочки
				menuArrow.parentElement.classList.toggle('_active');
			});
		}
	}

} else {
	document.body.classList.add('_pc');
}

//Меню бургер
const iconMenu = document.querySelector('.menu_icon');
const menuBody = document.querySelector('.menu_body');
const blockBenefit = document.querySelector('.block_benefit');
if(iconMenu) {
	iconMenu.addEventListener("click", function(e) {
		document.body.classList.toggle('_lock');
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
		blockBenefit.classList.toggle('_active');
	});
}



/**
 * @typedef {Object} dNode
 * @property {HTMLElement} parent
 * @property {HTMLElement} element
 * @property {HTMLElement} to
 * @property {string} breakpoint
 * @property {string} order
 * @property {number} index
 */

/**
 * @typedef {Object} dMediaQuery
 * @property {string} query
 * @property {number} breakpoint
 */

/**
 * @param {'min' | 'max'} type
 */
function useDynamicAdapt(type = 'max') {
    const className = '_dynamic_adapt_'
    const attrName = 'data-da'
  
    /** @type {dNode[]} */
    const dNodes = getDNodes()
  
    /** @type {dMediaQuery[]} */
    const dMediaQueries = getDMediaQueries(dNodes)
  
    dMediaQueries.forEach((dMediaQuery) => {
      const matchMedia = window.matchMedia(dMediaQuery.query)
      // массив объектов с подходящим брейкпоинтом
      const filteredDNodes = dNodes.filter(({ breakpoint }) => breakpoint === dMediaQuery.breakpoint)
      const mediaHandler = getMediaHandler(matchMedia, filteredDNodes)
      matchMedia.addEventListener('change', mediaHandler)
  
      mediaHandler()
    })
  
    function getDNodes() {
      const result = []
      const elements = [...document.querySelectorAll(`[${attrName}]`)]
  
      elements.forEach((element) => {
        const attr = element.getAttribute(attrName)
        const [toSelector, breakpoint, order] = attr.split(',').map((val) => val.trim())
  
        const to = document.querySelector(toSelector)
  
        if (to) {
          result.push({
            parent: element.parentElement,
            element,
            to,
            breakpoint: breakpoint ?? '767',
            order: order !== undefined ? (isNumber(order) ? Number(order) : order) : 'last',
            index: -1,
          })
        }
      })
  
      return sortDNodes(result)
    }
  
    /**
     * @param {dNode} items
     * @returns {dMediaQuery[]}
     */
    function getDMediaQueries(items) {
      const uniqItems = [...new Set(items.map(({ breakpoint }) => `(${type}-width: ${breakpoint}px),${breakpoint}`))]
  
      return uniqItems.map((item) => {
        const [query, breakpoint] = item.split(',')
  
        return { query, breakpoint }
      })
    }
  
    /**
     * @param {MediaQueryList} matchMedia
     * @param {dNodes} items
     */
    function getMediaHandler(matchMedia, items) {
      return function mediaHandler() {
        if (matchMedia.matches) {
          items.forEach((item) => {
            moveTo(item)
          })
  
          items.reverse()
        } else {
          items.forEach((item) => {
            if (item.element.classList.contains(className)) {
              moveBack(item)
            }
          })
  
          items.reverse()
        }
      }
    }
  
    /**
     * @param {dNode} dNode
     */
    function moveTo(dNode) {
      const { to, element, order } = dNode
      dNode.index = getIndexInParent(dNode.element, dNode.element.parentElement)
      element.classList.add(className)
  
      if (order === 'last' || order >= to.children.length) {
        to.append(element)
  
        return
      }
  
      if (order === 'first') {
        to.prepend(element)
  
        return
      }
  
      to.children[order].before(element)
    }
  
    /**
     * @param {dNode} dNode
     */
    function moveBack(dNode) {
      const { parent, element, index } = dNode
      element.classList.remove(className)
  
      if (index >= 0 && parent.children[index]) {
        parent.children[index].before(element)
      } else {
        parent.append(element)
      }
    }
  
    /**
     * @param {HTMLElement} element
     * @param {HTMLElement} parent
     */
    function getIndexInParent(element, parent) {
      return [...parent.children].indexOf(element)
    }
  
    /**
     * Функция сортировки массива по breakpoint и order
     * по возрастанию для type = min
     * по убыванию для type = max
     *
     * @param {dNode[]} items
     */
    function sortDNodes(items) {
      const isMin = type === 'min' ? 1 : 0
  
      return [...items].sort((a, b) => {
        if (a.breakpoint === b.breakpoint) {
          if (a.order === b.order) {
            return 0
          }
  
          if (a.order === 'first' || b.order === 'last') {
            return -1 * isMin
          }
  
          if (a.order === 'last' || b.order === 'first') {
            return 1 * isMin
          }
  
          return 0
        }
  
        return (a.breakpoint - b.breakpoint) * isMin
      })
    }
  
    function isNumber(value) {
      return !isNaN(value)
    }
  }
  
useDynamicAdapt();



/*popups_js*/
/*Получаю все объекты с классом popup_link */
const popupLinks = document.querySelectorAll('.popup_link');
/*Получаю body для того чтобы блокировать его скролл */
const body = document.querySelector('body');
/*Получаю все объекты с классом lock-padding этот класс я присваиваю всем объектам которые у меня фиксированные, например шапке*/
const lockPadding = document.querySelectorAll('.lock-padding');

/*Эта переменная нужна для того чтобы не было двойных нажатий*/
let unlock = true;

/*timeout = 800 миллисекунд это то, что указано у нас в свойстве transition*/
const timeout = 800;

/*Проверяю есть ли вообще у нас такие ссылки*/
if (popupLinks.length > 0) {
	/*Бегаю по всем этим ссылкам*/
	for (let index = 0; index < popupLinks.length; index++) {
		/*Получаю каждую в переменную popupLink и на неё вешаю событие click*/
		const popupLink = popupLinks[index];
		popupLink.addEventListener("click", function (e) {
			
			/*При клике я беру атрибут href и убираю из нео #*/
			const popupName = popupLink.getAttribute('href').replace('#', '');
			const curentPopup = document.getElementById(popupName);
			popupOpen(curentPopup);
			e.preventDefault();
		});
	}
}

/*Класс close-popup нужно прописывать ссылке которая закрывает попап в нашем случае крестику*/
const popupCloseIcon = document.querySelectorAll('.close-popup');
if (popupCloseIcon.length > 0) {
	for (let index = 0; index < popupCloseIcon.length; index++) {
		const el = popupCloseIcon[index];
		el.addEventListener('click', function (e) {
			popupClose(el.closest('.popup'));
			e.preventDefault();
		});
	}
}

function popupOpen(curentPopup) {
	if (curentPopup && unlock) {
		const popupActive = document.querySelector('.popup.open');
		if (popupActive) {
			popupClose(popupActive, false);
		} else {
			bodyLock();
		}
		curentPopup.classList.add('open');
		curentPopup.addEventListener("click", function (e) {
			if (!e.target.closest('.popup_content')) {
				popupClose(e.target.closest('.popup'));
			}
		});
	}
}
function popupClose(popupActive, doUnlock = true) {
	if (unlock) {
		popupActive.classList.remove('open');
		if (doUnlock) {
			bodyUnLock();
		}
	}
}

function bodyLock() {
	const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

	if (lockPadding.length > 0) {
		for(let index = 0; index < lockPadding.length; index++) {
			const el = lockPadding[index];
			el.style.paddingRight = lockPaddingValue;
		}
	}
	body.style.paddingRight = lockPaddingValue;
	/*по классу lock блокируется скролл - overflow: hidden;*/
	body.classList.add('lock');

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

function bodyUnLock() {
	setTimeout(function () {
		if (lockPadding.length > 0) {
			for (let index = 0; index < lockPadding.length; index++) {
				const el = lockPadding[index];
				el.style.paddingRight = '0px';
			}
		}
		body.style.paddingRight = '0px';
		body.classList.remove('lock');
	}, timeout);

	unlock = false;
	setTimeout(function () {
		unlock = true;
	}, timeout);
}

document.addEventListener('keydown', function (e) {
	if (e.which === 27) {
		const popupActive = document.querySelector('.popup.open');
		popupClose(popupActive);
	}
});



/*Для поддержки старых браузеров!
Полефилы для свойств closest и matches я их нашол в интернете*/

(function () {
	// проверяем поддержку
	if (!Element.prototype.closest) {
		// реализуем
		Element.prototype.closest = function (css) {
			var node = this;
			while (node) {
				if (node.matches(css)) return node;
				else node = node.parentElement;
			}
			return null;
		};
	}
})();
(function () {
	// проверям поддержку
	if (!Element.prototype.matches) {
		// определяем свойство
		Element.prototype.matches = Element.prototype.matchesSelector ||
			Element.prototype.webkitMetchesSelector ||
			Element.prototype.mozMetchesSelector ||
			Element.prototype.msMetchesSelector
	}
})();





/*script_steps-------------------*/
/*elem.closest('.lesson_list')*/
const menuBodySteps = document.querySelectorAll('.container_pharameter_step');
document.addEventListener("click", steps);

	function steps(event) {
			if (event.target.closest('.pharameter_step')) {
				for(var menuBodyStep of menuBodySteps){
					menuBodyStep.classList.remove('_active');
					menuBodyStep.closest('.step_item').classList.remove('_active');
				}
				event.target.closest('.pharameter_step').parentElement.classList.toggle('_active');
				event.target.closest('.pharameter_step').closest('.step_item').classList.toggle('_active');
			}

			if (!event.target.closest('.container_pharameter_step')) {
				for(var menuBodyStep of menuBodySteps){
					menuBodyStep.classList.remove('_active');
					menuBodyStep.closest('.step_item').classList.remove('_active');
				}
			}
	}



/*script_button_show_hide_filtr-------------------------------*/


const buttonShowHideFiltr = document.querySelector('.container_button_shov_hide_filtr');
const containerFilters = document.querySelector('.container_filters');

if(buttonShowHideFiltr) {
	buttonShowHideFiltr.addEventListener("click", menu);
}

function menu(event) {
	
	if (event.target.closest('.button_show_hide_filtr')) {
		buttonShowHideFiltr.classList.toggle('_active');
		containerFilters.classList.toggle('_show');
	}
	
}

/*script_spoller*/

$('document').ready(function(){
	$('.head_button_main_filtr').click(function(event) {
		if($('.button_main_filtr').hasClass('one')) {
			$('.head_button_main_filtr').not($(this)).removeClass('active');
			$('.container_bar_button_main_filtr').not($(this).next()).slideUp(300);
		}
		$(this).toggleClass('active').next().slideToggle(300);
	});
});



/*script_slider_price----------------------*/


const titleMin = document.getElementById('title-min');
const titleMax = document.getElementById('title-max');

const inputLeft = document.getElementById('input-left');
const inputRight = document.getElementById('input-right');

const dotLeft = document.getElementById('dot-left');
const dotRight = document.getElementById('dot-right');

const sliderRange = document.getElementById('slider-range');


function setLeftValue() {
    let value = this.value;
    let min = parseInt(this.min);
    let max = parseInt(this.max);

    value = Math.min(parseInt(value),
        parseInt(inputRight.value) - 1);

    let percent = ((value - min) / (max - min)) * 100;

    sliderRange.style.left = percent + "%";
    dotLeft.style.left = percent + "%";
    titleMin.innerText = value;
}

function setRightValue() {
    let value = this.value;
    let min = parseInt(this.min);
    let max = parseInt(this.max);

    value = Math.max(parseInt(value),
        parseInt(inputLeft.value) + 1);

    let percent = ((value - min) / (max - min)) * 100;

    sliderRange.style.right = (100 - percent) + "%";
    dotRight.style.right = (100 - percent) + "%";
    titleMax.innerText = value;
}
if(inputLeft) {
	inputLeft.addEventListener('input', setLeftValue);
}	
if(inputRight) {
	inputRight.addEventListener('input', setRightValue);
}

/*script_adaptiv-spollers-----------------------*/
//SPOLLERS
//Получаем коллекцию всех объектов у которых есть атрибут data-spollers
const spollersArray = document.querySelectorAll('[data-spollers]');
//Проверяем их наличие
if (spollersArray.length > 0) {
	//В рамках JS нам нужно разделить всю коллекцию на 2 массива. Один будет с простыми споллерами, а другой с теми которые работают по определённому брейкпоинту
	const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
		//Проверяем отсутствие параметров у атрибута data-spollers
		return !item.dataset.spollers.split(",")[0];
	});
	//Проверяем есть ли они
	if (spollersRegular.length > 0) {
		initSpollers(spollersRegular);
	}

	//Получаем объекты с параметрами и которые будут работать в зависимости от ширины экрана
	const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
		//Проверяем наличие параметров у атрибута data-spollers
		return item.dataset.spollers.split(",")[0];
	});
	
	//Далее нам нужно инициализировать споллеры с медиа запросом +
	if (spollersMedia.length > 0) {
		const breakpointsArray = [];
		spollersMedia.forEach(item => {
			const params = item.dataset.spollers;
			const breakpoint = {};
			const paramsArray = params.split(",");
			breakpoint.value = paramsArray[0];
			breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
			breakpoint.item = item;
			breakpointsArray.push(breakpoint);
		});

		//Получаем уникальные брейкпоинты +
		let mediaQueries = breakpointsArray.map(function (item) {
			return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
		});
		mediaQueries = mediaQueries.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});

		//Работаем с каждым брейкпоинтом +
			mediaQueries.forEach(breakpoint => {
			const paramsArray = breakpoint.split(",");
			const mediaBreakpoint = paramsArray[1];
			const mediaType = paramsArray[2];
			const matchMedia = window.matchMedia(paramsArray[0]);

			//Обекты с нужными условиями +
			const spollersArray = breakpointsArray.filter(function (item) {
				if (item.value === mediaBreakpoint && item.type === mediaType) {
					return true;
				}
			});

			//Событие +
			matchMedia.addListener(function () {
				initSpollers(spollersArray, matchMedia);
			});
			initSpollers(spollersArray, matchMedia);
		});
	}
	//Инициализация
	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach(spollersBlock => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener("click", setSpollerAction);
			} else {
				spollersBlock.classList.remove('_init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener("click", setSpollerAction);
			}
		});
	}
	//Работа с контентом +
	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
		if (spollerTitles.length > 0) {
			spollerTitles.forEach(spollerTitle => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.setAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}

	function setSpollerAction(e) {
		const el = e.target;
		if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
			const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_active')) {
					hideSpollersBody(spollersBlock);
				}
				spollerTitle.classList.toggle('_active');
				_slideToggle(spollerTitle.nextElementSibling, 500);
			}
			e.preventDefault();
		}
	}
	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_active');
			_slideUp(spollerActiveTitle.nextElementSibling, 500);
		}
	}
}


//====================================================================================================================
//SlideToggle +
let _slideUp = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = target.offsetHeight + 'px';
		target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;


		window.setTimeout(() => {
			target.hidden = true;
			target.style.removeProperty('height');
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');			
		}, duration);
	}
}
let _slideDown = (target, duration = 500) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide');
		if (target.hidden) {
			target.hidden = false;
		}
		let height = target.offsetHeight;
		target.style.overflow = 'hidden';
		target.style.height = 0;
		target.style.paddingTop = 0;
		target.style.paddingBottom = 0;
		target.style.marginTop = 0;
		target.style.marginBottom = 0;
		target.offsetHeight;
		target.style.transitionProperty = 'height, margin, padding';
		target.style.transitionDuration = duration + 'ms';
		target.style.height = height + 'px';
		
		window.setTimeout(() => {
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');

			target.style.removeProperty('height');
			target.style.removeProperty('overflow');
			target.style.removeProperty('transition-duration');
			target.style.removeProperty('transition-property');
			target.classList.remove('_slide');
		}, duration);
	}
}

let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration);
	} else {
		return _slideUp(target, duration);
	}
}

//=================================================================================================================
/*Инструкция
Для родителя спойлеров пишем атрибут data-spollers
Для заголовков спойлеров пишем атрибут data-spoller
Если нужно включать/выключать работу спойлеров на разных размерах экранов
пишем параметры ширины и тапа брейкпойнта.
Например
data-spollers="992,max" - спойлеры будут работать только на экранах меньше или равно 992px
data-spollers="768,min" - спойлеры будут работать только на экранах больше или равно 768px

Если нужно чтобы в блоке открывался только 1 спойлер добавляем атрибут data-one-spoller для родителя спойлеров
и получится аккордеон
Если нужно чтобы спойлер был изначально открытым, то для заголовка спойлера добавляем технический класс _active*/




/*script_ratings------------------------*/
const ratings = document.querySelectorAll('.rating');

if (ratings.length > 0) {
	initRatings();
}

//Основеая функция
function initRatings() {
	let ratingActive, ratingValue;
	//Бегаем по всем рейтингам на странице
	for (let index = 0; index < ratings.length; index++) {
		const rating = ratings[index];
		initRating(rating);
	}

	//Инициализируем конкретный рейтинг
	function initRating(rating) {
		initRatingVars(rating);

		setRatingActiveWidth();

		if (rating.classList.contains('rating_set')) {
			setRating(rating);
		}
	}

	//Инициализация переменных
	function initRatingVars(rating) {
		ratingActive = rating.querySelector('.rating_active');
		ratingValue = rating.querySelector('.rating_value');
	}
	//Изменяем ширину активных звёзд
	function setRatingActiveWidth(index = ratingValue.innerHTML) {
		const ratingActiveWidth = index / 0.05;
		ratingActive.style.width = `${ratingActiveWidth}%`;
	}
	//Возможность указать оценку
	function setRating(rating) {
		const ratingItems = rating.querySelectorAll('.rating_item');
		for (let index = 0; index < ratingItems.length; index++) {
			const ratingItem = ratingItems[index];
			ratingItem.addEventListener("mouseenter", function (e) {
				// Обновление переменных
				initRatingVars(rating);
				// Обновление активных звёзд
				setRatingActiveWidth(ratingItem.value);
			});
			ratingItem.addEventListener("mouseleave", function (e) {
				// Обновление активных звёзд
				setRatingActiveWidth();
			});

			ratingItem.addEventListener("click", function (e) {
				//Обновление переменных
				initRatingVars(rating);

				if (rating.dataset.ajax) {
					//Отправить на сервер
					setRatingValue(ratingItem.value, rating);
				} else {
					//Отобразить указанную оценку
					ratingValue.innerHTML = index + 1;
					setRatingActiveWidth();
				}
			});
		}
	}
}


/*Небольшая инструкция:
Если мне нужно вывести рейтинг с возможностью поставить оценку, 
то мне нужно поставить класс модификатор rating_set для родителя рейтинга.
Но если мне нужно просто где-то вывести рейтинг, то мне нужно этот класс убрать!*/


/*tabs-------------------------------*/
/*const tabsTitle = document.querySelectorAll('.tabs_item');
const tabsContent = document.querySelectorAll('.tabs_block');

if (tabsTitle.length > 0 || tabsContent.length > 0) {
	tabsTitle.forEach(item => item.addEventListener("click", event => {

		const tabsTitleTarget = event.target.getAttribute('data-tab');

		tabsTitle.forEach(element => element.classList.remove('active-tab'));

		tabsContent.forEach(element => element.classList.add('hidden-tab-content'));

		item.classList.add('active-tab');

		document.getElementById(tabsTitleTarget).classList.remove('hidden-tab-content');
		
	}));

	document.querySelector('[data-tab="tab-1"]').classList.add('active-tab');
	document.querySelector('#tab-1').classList.remove('hidden-tab-content');
}*/


/*tabs_mods---------------------------------------------------------*/
const tabsTitle = document.querySelectorAll('.tabs_item');
const tabsContent = document.querySelectorAll('.tabs_block');

if (tabsTitle.length > 0 || tabsContent.length > 0) {
	tabsTitle.forEach(item => item.addEventListener("click", event => {

		const tabsTitleTarget = event.target.getAttribute('data-tab');

		tabsTitle.forEach(element => element.classList.remove('active-tab'));

		tabsContent.forEach(element => element.classList.add('hidden-tab-content'));

		item.classList.add('active-tab');

		
		const tabsTitles = document.querySelectorAll(`#${tabsTitleTarget}`);
		for (let tabsTitle of tabsTitles) {
			tabsTitle.classList.remove('hidden-tab-content');
		}
	}));

	const tabsTitlesStart = document.querySelectorAll('[data-tab="tab-1"]');
	for (let tabsTitleStart of tabsTitlesStart) {
		tabsTitleStart.classList.add('active-tab');
	}

	const tabsContentsStart = document.querySelectorAll('#tab-1');
	for (let tabsContentStart of tabsContentsStart) {
		tabsContentStart.classList.remove('hidden-tab-content');
	}
}



const tabsTitlePreview = document.querySelectorAll('.container_item_tabs_images_product_review');
const tabsContentPreview = document.querySelectorAll('.link_popup_image_product_review');

if (tabsTitlePreview.length > 0 || tabsContentPreview.length > 0) {
	tabsTitlePreview.forEach(item => item.addEventListener("click", event => {

		const tabsTitlePreviewTarget = event.target.getAttribute('data-tab');

		tabsTitlePreview.forEach(element => element.classList.remove('active-tab'));

		tabsContentPreview.forEach(element => element.classList.add('hidden-tab-content'));

		item.classList.add('active-tab');

		
		const tabsTitlePreviews = document.querySelectorAll(`#${tabsTitlePreviewTarget}`);
		for (let tabsTitlePreview of tabsTitlePreviews) {
			tabsTitlePreview.classList.remove('hidden-tab-content');
		}
	}));

	const tabsTitlePreviewsStart = document.querySelectorAll('[data-tab="tab_preview_1"]');
	for (let tabsTitlePreviewStart of tabsTitlePreviewsStart) {
		tabsTitlePreviewStart.classList.add('active-tab');
	}

	const tabsContentPreviewsStart = document.querySelectorAll('#tab_preview_1');
	for (let tabsContentPreviewStart of tabsContentPreviewsStart) {
		tabsContentPreviewStart.classList.remove('hidden-tab-content');
	}
}