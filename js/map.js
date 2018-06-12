'use strict';

var AVATAR_AMOUNT = [
  'img/avatars/user01.png',
  'img/avatars/user02.png',
  'img/avatars/user03.png',
  'img/avatars/user04.png',
  'img/avatars/user05.png',
  'img/avatars/user06.png',
  'img/avatars/user07.png',
  'img/avatars/user08.png'
];

var TITLE = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var TYPES_HOUSES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var TYPES_HOUSES_RUS = [
  'Дворец',
  'Квартира',
  'Дом',
  'Бунгало'
];

var TIME_CHECKIN = [
  '12:00',
  '13:00',
  '14:00'
];

var TIME_CHECKOUT = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;

var mapToggle = document.querySelector('.map');
mapToggle.classList.remove('map--faded');

var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('template')
  .content
  .querySelector('.map__pin');
var pinBefore = document.querySelector('.map__filters-container');

var mapAd = document.querySelector('.map');
var mapAdTemplate = document.querySelector('template')
  .content
  .querySelector('.map__card');

var createNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var shuffleArray = function (array) {
  for (var i = array.length - 1; i >= 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return temp;
};

var unshuffleArray = function (array) {
  var i = Math.floor(Math.random() * array.length);
  return array[i];
};

var getRandomLength = function (array) {
  var cloneArray = array.slice();
  cloneArray.length = Math.round(Math.random() * array.length);
  return cloneArray;
};

var getRandomPhotos = function (array) {
  var cloneArray = array.slice();
  for (var i = cloneArray.length - 1; i >= 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = cloneArray[i];
    cloneArray[i] = cloneArray[j];
    cloneArray[j] = temp;
  }
  return cloneArray;
};

var renderMapPin = function (pinArray) {
  var pin = pinTemplate.cloneNode(true);

  pin.style.left = pinArray.location.x + 'px';
  pin.style.top = pinArray.location.y + 'px';
  pin.querySelector('img').src = pinArray.author.avatar;
  pin.querySelector('img').alt = pinArray.offer.title;

  return pin;
};

var renderMapAd = function (mapAdArray) {
  var mapCard = mapAdTemplate.cloneNode(true);

  mapCard.querySelector('.popup__title').textContent = mapAdArray.offer.title;
  mapCard.querySelector('.popup__text--address').textContent = mapAdArray.offer.address;
  mapCard.querySelector('.popup__text--price').textContent = mapAdArray.offer.price + ' ₽/ночь';
  mapCard.querySelector('.popup__type').textContent = TYPES_HOUSES_RUS[TYPES_HOUSES.indexOf(mapAdArray.offer.type)];
  mapCard.querySelector('.popup__text--capacity').textContent = mapAdArray.offer.rooms + ' комнаты для ' + mapAdArray.offer.guests + ' гостей';
  mapCard.querySelector('.popup__text--time').textContent = 'Заезд после ' + mapAdArray.offer.checkin + ', выезд до ' + mapAdArray.offer.checkout;
  mapCard.querySelector('.popup__features').textContent = mapAdArray.offer.features;
  mapCard.querySelector('.popup__description').textContent = mapAdArray.offer.description;
  mapCard.querySelector('.popup__photo').src = mapAdArray.offer.photos[0];
  mapCard.appendChild(mapCard.querySelector('.popup__photo').cloneNode(true)).src = mapAdArray.offer.photos[1];
  mapCard.appendChild(mapCard.querySelector('.popup__photo').cloneNode(true)).src = mapAdArray.offer.photos[2];
  mapCard.querySelector('img').src = mapAdArray.author.avatar;

  return mapCard;
};

var adsArray = [];
var fragmentPin = document.createDocumentFragment();
var fragmentMapAd = document.createDocumentFragment();

for (var i = 0; i < 8; i++) {
  var CoordinateX = createNumber(300, 900) - PIN_WIDTH;
  var CoordinateY = createNumber(130, 630) - PIN_HEIGHT;

  var rentAd = {
    'author': {
      'avatar': shuffleArray(AVATAR_AMOUNT)
    },
    'offer': {
      'title': shuffleArray(TITLE),
      'address': CoordinateX + ', ' + CoordinateY,
      'price': createNumber(1000, 1000000),
      'type': unshuffleArray(TYPES_HOUSES),
      'rooms': createNumber(1, 5),
      'guests': createNumber(1, 100),
      'checkin': shuffleArray(TIME_CHECKIN),
      'checkout': shuffleArray(TIME_CHECKOUT),
      'features': getRandomLength(FEATURES),
      'description': '',
      'photos': getRandomPhotos(PHOTOS)
    },
    'location': {
      'x': CoordinateX,
      'y': CoordinateY
    }
  };

  adsArray.push(rentAd);

  fragmentPin.appendChild(renderMapPin(adsArray[i]));
}

fragmentMapAd.appendChild(renderMapAd(adsArray[0]));

mapPins.appendChild(fragmentPin);
mapAd.insertBefore(fragmentMapAd, pinBefore);
