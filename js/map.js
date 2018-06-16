'use strict';

var ADS_AMOUNT = 8;

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

var getRandomNumberInRange = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};

var getRandomValueFromArray = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

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

var getRandomValuesFromArray = function (array) {
  var cloneArray = shuffleArray(array);
  cloneArray.length = getRandomNumberInRange(1, cloneArray.length);
  return cloneArray;
};

var mapToggle = document.querySelector('.map');
mapToggle.classList.remove('map--faded');

var mapPins = document.querySelector('.map__pins');
var pinTemplate = document.querySelector('template')
  .content
  .querySelector('.map__pin');
var pinBefore = document.querySelector('.map__filters-container');

var mapAd = document.querySelector('.map');
var AdTemplate = document.querySelector('template')
  .content
  .querySelector('.map__card');

var createAd = function (i) {
  var x = getRandomNumberInRange(300, 900) - (PIN_WIDTH / 2);
  var y = getRandomNumberInRange(130, 630) - PIN_HEIGHT;

  var rentAd = {
    'author': {
      'avatar': 'img/avatars/user0' + (i + 1) + '.png'
    },
    'offer': {
      'title': AD_TITLES[i + 1],
      'address': x + ', ' + y,
      'price': getRandomNumberInRange(1000, 1000000),
      'type': HOUSES_TYPES[getRandomNumberInRange(0, HOUSES_TYPES.length)],
      'rooms': getRandomNumberInRange(1, 5),
      'guests': getRandomNumberInRange(1, 100),
      'checkin': getRandomValueFromArray(CHECKIN_DATES),
      'checkout': getRandomValueFromArray(CHECKOUT_DATES),
      'features': getRandomValuesFromArray(FEATURES),
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

var renderAd = function (ad) {
  var mapCard = AdTemplate.cloneNode(true);

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
  photosBlock.removeChild(photoTemplate);
  for (i = 0; i < ad.offer.photos.length; i++) {
    var photoElement = photoTemplate.cloneNode(true);
    photoElement.src = ad.offer.photos[i];
    photosBlock.appendChild(photoElement);
  }

  mapCard.querySelector('img').src = ad.author.avatar;

  return mapCard;
};

var fragmentMapAd = document.createDocumentFragment();

var renderPins = function () {
  var fragmentPin = document.createDocumentFragment();
  for (var i = 0; i < ADS_AMOUNT; i++) {
    fragmentPin.appendChild(renderMapPin(ads[i]));
  }
  return fragmentPin;
};

fragmentMapAd.appendChild(renderAd(ads[0]));

mapPins.appendChild(renderPins());
mapAd.insertBefore(fragmentMapAd, pinBefore);
