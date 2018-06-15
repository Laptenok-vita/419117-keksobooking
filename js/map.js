'use strict';

var ADS_AMOUNT = 8;

var TITLES = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var TYPES_HOUSES =
{
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

var createNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var getRandomValueFromArray = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var shuffleArray = function (array) {
  for (var i = array.length - 1; i >= 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

var getRandomLength = function (array) {
  var cloneArray = array.slice();
  cloneArray.length = Math.round(Math.random() * array.length);
  return cloneArray;
};

var getRandomIndex = function (array) {
  for (var i = array.length - 1; i >= 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = i;
    i = j;
    j = temp;
  }
  return temp;
};

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

for (var key in TYPES_HOUSES) {
  var houseType = TYPES_HOUSES[key];
}

var createAd = function (i) {
  var x = createNumber(300, 900) - PIN_WIDTH;
  var y = createNumber(130, 630) - PIN_HEIGHT;

  var rentAd = {
    'author': {
      'avatar': 'img/avatars/user0' + (i + 1) + '.png'
    },
    'offer': {
      'title': TITLES[getRandomIndex(TITLES)],
      'address': x + ', ' + y,
      'price': createNumber(1000, 1000000),
      'type': houseType,
      'rooms': createNumber(1, 5),
      'guests': createNumber(1, 100),
      'checkin': getRandomValueFromArray(CHECKIN_DATES),
      'checkout': getRandomValueFromArray(CHECKOUT_DATES),
      'features': getRandomLength(FEATURES),
      'description': '',
      'photos': shuffleArray(PHOTOS)
    },
    'location': {
      'x': x,
      'y': y
    }
  };
  return rentAd;
};

var createAds = function () {
  var ads = [];
  for (var i = 0; i < ADS_AMOUNT; i++) {
    ads[i] = createAd(i);
  }
  return ads;
};

var ads = createAds();

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
  mapCard.querySelector('.popup__type').textContent = mapAdArray.offer.type;
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

var fragmentPin = document.createDocumentFragment();
var fragmentMapAd = document.createDocumentFragment();

for (var i = 0; i < ADS_AMOUNT; i++) {
  fragmentPin.appendChild(renderMapPin(ads[i]));
}

fragmentMapAd.appendChild(renderMapAd(ads[0]));

mapPins.appendChild(fragmentPin);
mapAd.insertBefore(fragmentMapAd, pinBefore);
