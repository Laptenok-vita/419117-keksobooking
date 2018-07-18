'use strict';

(function () {
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

  var PIN_MAIN_WIDTH = 65;
  var PIN_MAIN_HEIGHT = 65;
  var MIN_X = 0;
  var MAX_X = 1200 - PIN_MAIN_WIDTH;
  var MIN_Y = 130;
  var MAX_Y = 630;

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
    var x = getRandomNumberInRange((MIN_X - window.pin.PIN_WIDTH / 2), (MAX_X - window.pin.PIN_WIDTH / 2)) + window.pin.PIN_WIDTH / 2;
    var y = getRandomNumberInRange((MIN_Y - window.pin.PIN_HEIGHT), (MAX_Y - window.pin.PIN_HEIGHT)) + window.pin.PIN_HEIGHT;

    var rentAd = {
      'author': {
        'avatar': 'img/avatars/user0' + (i + 1) + '.png'
      },
      'offer': {
        'title': AD_TITLES[i],
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

  window.data = {
    ADS_AMOUNT: ADS_AMOUNT,
    PIN_MAIN_WIDTH: PIN_MAIN_WIDTH,
    PIN_MAIN_HEIGHT: PIN_MAIN_HEIGHT,
    MIN_X: MIN_X,
    MAX_X: MAX_X,
    MIN_Y: MIN_Y,
    MAX_Y: MAX_Y,
    createAd: createAd
  };
})();
