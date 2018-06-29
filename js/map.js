'use strict';

var AD_TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var HOUSES_TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var HOUSES_TYPES_DICT = {
  'palace': 'Дворец',
  'flat': 'Квартира',
  'house': 'Дом',
  'bungalo': 'Бунгало'
};

var CHECKIN_DATES = [
  '12:00',
  '13:00',
  '14:00'
];

var CHECKOUT_DATES = [
  '12:00',
  '13:00',
  '14:00'
];

var AD_FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var AD_PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var ADS_AMOUNT = 8;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MIN_X = 300;
var MAX_X = 900;
var MIN_Y = 130;
var MAX_Y = 630;
var PIN_MAIN_WIDTH = 65;
var PIN_MAIN_HEIGHT = 87;
var ESC_KEYCODE = 27;

var adForm = document.querySelector('.ad-form');
var adFields = adForm.querySelectorAll('fieldset');
var pinMain = document.querySelector('.map__pin--main');
var inputAdressValue = adForm.querySelector('input[name=address]');
var mapToggle = document.querySelector('.map');

// Функция удаления класса деактивации карты
var activateMap = function () {
  mapToggle.classList.remove('map--faded');
};

// Куда буду добавлять новые Пины в разметке
var newPinsOnMap = document.querySelector('.map__pins');

// Находит кнопку с классом '.map__pin' в шаблоне template
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var pinBefore = document.querySelector('.map__filters-container');

// Куда буду добавлять новое объявление в разметке
var newAdOnMap = document.querySelector('.map');
// Находит секцию с классом '.map__card' в шаблоне template
var adTemplate = document.querySelector('template')
  .content
  .querySelector('.map__card');

// Функция возвращает случайное значение между мин и макс
var getRandomNumberInRange = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

// Функция возвращает случайный элемент из массива
var getRandomValueFromArray = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

// Функция перемешивания клонированного массива
var shuffleArray = function (array) {
  var cloneArray = array.slice();
  for (var i = cloneArray.length - 1; i >= 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = cloneArray[i];
    cloneArray[i] = cloneArray[j];
    cloneArray[j] = temp;
  }
  return cloneArray;
};

// Функция возвращает массив случайной длины
var getRandomValuesFromArray = function (array) {
  var cloneArray = shuffleArray(array);
  cloneArray.length = getRandomNumberInRange(1, cloneArray.length);
  return cloneArray;
};

// Функция создания шаблонного объявления
var createAd = function (i) {
  var x = getRandomNumberInRange((MIN_X - PIN_WIDTH / 2), (MAX_X - PIN_WIDTH / 2)) + PIN_WIDTH / 2;
  var y = getRandomNumberInRange((MIN_Y - PIN_HEIGHT), (MAX_Y - PIN_HEIGHT)) + PIN_HEIGHT;

  var rentAd = {
    'author': {
      'avatar': 'img/avatars/user0' + (i + 1) + '.png'
    },
    'offer': {
      'title': AD_TITLES[i + 1], //  Проблема с заголовком в объявлении №8. Заголовка нет.
      'address': x + ', ' + y,
      'price': getRandomNumberInRange(1000, 1000000),
      'type': getRandomValueFromArray(HOUSES_TYPES),
      'rooms': getRandomNumberInRange(1, 5),
      'guests': getRandomNumberInRange(1, 100),
      'checkin': getRandomValueFromArray(CHECKIN_DATES),
      'checkout': getRandomValueFromArray(CHECKOUT_DATES),
      'features': getRandomValuesFromArray(AD_FEATURES),
      'description': '',
      'photos': shuffleArray(AD_PHOTOS)
    },
    'location': {
      'x': x,
      'y': y
    }
  };
  return rentAd;
};

// Функция создания массива объявлений
var createAds = function () {
  var ads = [];
  for (var i = 0; i < ADS_AMOUNT; i++) {
    ads[i] = createAd(i);
  }
  return ads;
};

// Создаю массив объявлений
var ads = createAds();

// Функция отрисовки Пина на карте
var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.style.left = pin.location.x + 'px';
  pinElement.style.top = pin.location.y + 'px';
  pinElement.querySelector('img').src = pin.author.avatar;
  pinElement.querySelector('img').alt = pin.offer.title;

  return pinElement;
};

// Функция отрисовки объявления на карте
var renderAd = function (ad) {
  var mapCard = document.querySelector('.popup');

  mapCard.querySelector('.popup__title').textContent = ad.offer.title;
  mapCard.querySelector('.popup__text--address').textContent = ad.offer.address;
  mapCard.querySelector('.popup__text--price').textContent = ad.offer.price + ' ₽/ночь';
  mapCard.querySelector('.popup__type').textContent = HOUSES_TYPES_DICT[ad.offer.type];
  mapCard.querySelector('.popup__text--capacity').textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
  mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + ad.offer.checkin + ', выезд до ' + ad.offer.checkout;

  var featuresBlock = mapCard.querySelector('.popup__features');
  featuresBlock.innerHTML = '';
  for (var i = 0; i < ad.offer.features.length; i++) {
    featuresBlock.innerHTML += '<li class="popup__feature popup__feature--' + ad.offer.features[i] + '"></li>';
  }

  mapCard.querySelector('.popup__description').textContent = ad.offer.description;

  var photosBlock = mapCard.querySelector('.popup__photos');
  var photoTemplate = photosBlock.querySelector('.popup__photo');
  photosBlock.removeChild(photoTemplate); //  Не удаляется блок фотографий с предыдущего объявления, фото накапливаются
  for (i = 0; i < ad.offer.photos.length; i++) {

    var photoElement = photoTemplate.cloneNode(true);
    photoElement.src = ad.offer.photos[i];
    photosBlock.appendChild(photoElement);
  }

  mapCard.querySelector('img').src = ad.author.avatar;

  return mapCard;
};

// Функция отрисовки Пинов на карте
var renderPins = function () {
  var fragmentPin = document.createDocumentFragment();
  for (var i = 0; i < ADS_AMOUNT; i++) {
    pinTemplate.setAttribute('id', i);
    fragmentPin.appendChild(renderPin(ads[i]));
  }
  return fragmentPin;
};

// Функция удаления атрибута "неактивный" с полей формы
var activateForm = function () {
  adForm.classList.remove('ad-form--disabled');
  for (var i = 0; i < adFields.length; i++) {
    adFields[i].disabled = false;
  }
};

// Функция отрисовки Пинов на экране
var addNewPinsOnMap = function () {
  pinMain.removeEventListener('mouseup', addNewPinsOnMap);
  var newPins = newPinsOnMap.appendChild(renderPins());
  return newPins;
};

// Функция вычисления координаты главного пина
inputAdressValue.value = parseInt(pinMain.style.left.substr(0, pinMain.style.left.length - 2), 10) + parseInt(PIN_MAIN_WIDTH / 2, 10) + ', ' + (parseInt(pinMain.style.top.substr(0, pinMain.style.top.length - 2), 10) + parseInt(PIN_MAIN_HEIGHT, 10));

var OnPinMainMouseUpInputAdressValue = function () {
  if (inputAdressValue.mouseup) {
    inputAdressValue.value = createAd().location.x + ', ' + createAd().location.y;
  }
};

// Создаю карточку объявления
var addNewAd = function () {
  var fragmentMapAd = document.createDocumentFragment();
  fragmentMapAd.appendChild(adTemplate.cloneNode(true));
  newAdOnMap.insertBefore(fragmentMapAd, pinBefore);
  pinMain.removeEventListener('mouseup', addNewAd);

  // Функция закрытия объявления
  var closeAd = function () {
    var adOnMap = document.querySelector('.map__card'); //  Ищу один и тот же элемент локально, глобально не ищется, т.к. при инициализации страницы объявления нет на карте и класс .map__card в разметке не находится. Возможно стоит искать в template, на сколько корректно заполнение класса до вставки блока на страницу?
    adOnMap.classList.add('hidden');
  };

  var onPopupEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeAd();
    }
  };

  var adCloseButton = document.querySelector('.popup__close');

  document.addEventListener('keydown', onPopupEscPress);
  adCloseButton.addEventListener('click', closeAd);
};

var openAdModal = function () {
  var mapPin = document.querySelectorAll('.map__pins button:not(.map__pin--main)');

  mapPin.forEach(function (elem) {
    elem.addEventListener('click', function () {
      var adOnMap = document.querySelector('.map__card'); //  Ищу один и тот же элемент локально, глобально не ищется, т.к. при инициализации страницы объявления нет на карте и класс .map__card в разметке не находится. Возможно стоит искать в template, на сколько корректно заполнение класса до вставки блока на страницу?
      adOnMap.classList.remove('hidden');

      var id = elem.getAttribute('id');
      return renderAd(ads[id]);
    });
  });
};

// Событие, по которому удаляется класс деактивации карты
pinMain.addEventListener('mouseup', activateMap);
pinMain.addEventListener('mouseup', activateForm);
pinMain.addEventListener('mouseup', OnPinMainMouseUpInputAdressValue);
pinMain.addEventListener('mouseup', addNewPinsOnMap);

pinMain.addEventListener('mouseup', openAdModal);

pinMain.addEventListener('mouseup', addNewAd);
