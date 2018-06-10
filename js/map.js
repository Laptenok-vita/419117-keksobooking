'use strict';

var AVATAR_AMOUNT = ['01', '02', '03', '04', '05', '06', '07', '08'];
var TITLE = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var TYPES_HOUSES = ['palace', 'flat', 'house', 'bungalo'];
var TIME_CHECKIN = ['12:00', '13:00', '14:00'];
var TIME_CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

// Функция генерирует случайное число в заданом диапазоне
var ARRAY_NUMBERS =
  {
    createNumber: function (min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    }
  };

  // Функция перебирает массив и возвращает случайное значение
var getRandomNumber = function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return temp;
};

var similarRentAds = [];

var mapToggle = document.querySelector('.map');
mapToggle.classList.remove('map--faded');

// Нахожу элемент, куда буду вставлять разметку
var similarListElement = document.querySelector('.map__pins');
// Нахожу тег template в разметке
var similarMapElementTemplate = document.querySelector('template')
// Нахожу (с помощью дом-узла DocumentFragment, который называется content) тег, который мне надо скопировать
    .content
    .querySelector('.map__pin');

// Нахожу элемент, куда буду вставлять разметку
similarListElement = document.querySelector('.map');
// Нахожу тег template в разметке
similarMapElementTemplate = document.querySelector('template')
// Нахожу (с помощью дом-узла DocumentFragment, который называется content) тег, который мне надо скопировать
    .content
    .querySelector('.map__card');

var renderMapElement = function (mapArray) {
  var MapElement = similarMapElementTemplate.cloneNode(true);

  // MapElement.querySelector('.map__pin').style = 'left: ' + mapArray.location.x + 'px';
  // MapElement.querySelector('.map__pin').style = 'top: ' + mapArray.location.y + 'px';
  MapElement.querySelector('img').src = mapArray.author.avatar;
  MapElement.querySelector('img').alt = mapArray.offer.title;

  MapElement.querySelector('.popup__title').textContent = mapArray.offer.title;
  MapElement.querySelector('.popup__text--address').textContent = mapArray.offer.address;
  MapElement.querySelector('.popup__text--price').textContent = mapArray.offer.price + ' ₽/ночь';
  MapElement.querySelector('.popup__type').textContent = mapArray.offer.type;
  MapElement.querySelector('.popup__text--capacity').textContent = mapArray.offer.rooms + ' комнаты для ' + mapArray.offer.guests + ' гостей';
  MapElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + mapArray.offer.checkin + ', выезд до ' + mapArray.offer.checkout;
  MapElement.querySelector('.popup__features').textContent = mapArray.offer.features;
  MapElement.querySelector('.popup__description').textContent = mapArray.offer.description;
  MapElement.querySelector('.popup__photos').src = mapArray.offer.photos;
  MapElement.querySelector('.popup__avatar').textContent = mapArray.author.avatar;

  return MapElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < 8; i++) {
  similarRentAds[i] = {
    'author': {
      avatar: 'img/avatars/user' + getRandomNumber(AVATAR_AMOUNT) + '.png'
    },
    'offer': {
      'title': getRandomNumber(TITLE),
      'address': ARRAY_NUMBERS.createNumber(300, 900) + ', ' + ARRAY_NUMBERS.createNumber(130, 630),
      'price': ARRAY_NUMBERS.createNumber(1000, 1000000),
      'type': getRandomNumber(TYPES_HOUSES),
      'rooms': ARRAY_NUMBERS.createNumber(1, 5),
      'guests': ARRAY_NUMBERS.createNumber(1, 100),
      'checkin': getRandomNumber(TIME_CHECKIN),
      'checkout': getRandomNumber(TIME_CHECKOUT),
      'features': getRandomNumber(FEATURES),
      'description': '',
      'photos': getRandomNumber(PHOTOS)
    },
    'location': {
      'x': ARRAY_NUMBERS.createNumber(300, 900),
      'y': ARRAY_NUMBERS.createNumber(130, 630)
    }
  };

  fragment.appendChild(renderMapElement(similarRentAds[i]));
}

similarListElement.appendChild(fragment);
