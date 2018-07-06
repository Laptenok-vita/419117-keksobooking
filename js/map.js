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

var HOUSES_CHARACTERS = {
  'type': {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  },
  'cost': {
    'palace': 10000,
    'flat': 1000,
    'house': 5000,
    'bungalo': 0
  }
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


var adOnMap;
var pinList;

var adForm = document.querySelector('.ad-form');
var adFormSubmitButton = document.querySelector('.ad-form');
var resetButton = document.querySelector('.ad-form__reset');
var adFields = adForm.querySelectorAll('fieldset');
var pinMain = document.querySelector('.map__pin--main'); // Пироженко
var initPinMainCoord = {
  initPinMainLeft: (parseInt(pinMain.style.left, 10) + Math.floor(PIN_MAIN_WIDTH / 2)),
  initPinMainTop: (parseInt(pinMain.style.top, 10) + PIN_MAIN_HEIGHT)
};

var inputAdressValue = adForm.querySelector('input[name=address]');
var allInput = adForm.querySelectorAll('input');
var mapToggle = document.querySelector('.map');
var selectedHouseType = adForm.elements.type;
var minCost = adForm.querySelector('#price');
var timeIn = adForm.elements.timein;
var timeOut = adForm.elements.timeout;

// Куда буду добавлять новые Пины в разметке
var blockContainAllPins = document.querySelector('.map__pins');

// Находит кнопку с классом '.map__pin' в шаблоне template
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var pinBefore = document.querySelector('.map__filters-container');

// Куда буду добавлять новое объявление в разметке
var blockMap = document.querySelector('.map');
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

// Функция создания массива объявлений
var createAds = function () {
  var ads = [];
  for (var i = 0; i < ADS_AMOUNT; i++) {
    ads[i] = createAd(i);
  }
  return ads;
};

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
  mapCard.querySelector('.popup__type').textContent = HOUSES_CHARACTERS.type[ad.offer.type];
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
  photosBlock.innerHTML = '';
  for (var j = 0; j < ad.offer.photos.length; j++) {
    var photoElement = photoTemplate.cloneNode(true);
    photoElement.src = ad.offer.photos[j];
    photosBlock.appendChild(photoElement);
  }

  mapCard.querySelector('img').src = ad.author.avatar;

  return mapCard;
};

// Создаю массив объявлений
var ads = createAds();

// Функция отрисовки Пинов на карте
var renderPins = function () {
  var fragmentPin = document.createDocumentFragment();
  for (var i = 0; i < ADS_AMOUNT; i++) {
    pinTemplate.setAttribute('id', i);
    fragmentPin.appendChild(renderPin(ads[i]));
  }
  var newPins = blockContainAllPins.appendChild(fragmentPin);
  return newPins;
};

renderPins();

// Создаю карточку объявления
var addNewAd = function addNewAd() {
  if (!blockMap.querySelector('.map__card')) {
    var fragmentMapAd = document.createDocumentFragment();
    fragmentMapAd.appendChild(adTemplate.cloneNode(true));
    blockMap.insertBefore(fragmentMapAd, pinBefore);
  }
};

addNewAd();

adOnMap = blockMap.querySelector('.map__card');
pinList = blockContainAllPins.querySelectorAll('.map__pins button:not(.map__pin--main)');

// Удаляю класс hidden с Пинов при нажатии на Пироженко
var pinMainDisplayNewPinsOnMapHandler = function () {
  pinList.forEach(function (elem) {
    elem.classList.remove('hidden');
  });
};

// Обработчик событий на каждый Пин
var pinMainOpenAdModalHandler = function () {
  pinList.forEach(function (elem) {
    elem.addEventListener('click', function () {
      adOnMap.classList.remove('hidden');

      var id = elem.getAttribute('id');
      return renderAd(ads[id]);
    });
  });
};

// Функция закрытия объявления
var closeAd = function () {
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

// Функция удаления класса деактивации карты
var pinMainActivateMapHandler = function () {
  mapToggle.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  for (var i = 0; i < adFields.length; i++) {
    adFields[i].disabled = false;
  }
};

// Значение Пироженка при инициализации страницы
inputAdressValue.value = (parseInt(pinMain.style.left, 10) + Math.floor(PIN_MAIN_WIDTH / 2)) + ', ' + (parseInt(pinMain.style.top, 10) + PIN_MAIN_HEIGHT);

// Функция вычисления координаты Пироженка
var pinMainSetAdressHandler = function () {
  pinMain.style.left = getRandomNumberInRange((MIN_X - Math.floor(PIN_MAIN_WIDTH / 2)), (MAX_X - PIN_MAIN_WIDTH / 2)) + Math.floor(PIN_MAIN_WIDTH / 2) + 'px';
  pinMain.style.top = getRandomNumberInRange((MIN_Y - PIN_MAIN_HEIGHT), (MAX_Y - PIN_MAIN_HEIGHT)) + PIN_MAIN_HEIGHT + 'px';
  inputAdressValue.value = parseInt(pinMain.style.left, 10) + ', ' + parseInt(pinMain.style.top, 10);
  return inputAdressValue.value;
};

var addErrorClass = function (elem) {
  elem.target.classList.add('error');
};

var formButtonResetMapHandler = function () {
  for (var i = 0; i < allInput.length; i++) {
    if (allInput.innerHTML !== '') {
      allInput[i].value = '';
      allInput[i].classList.remove('error');
    }
  }

  mapToggle.classList.add('map--faded');
  adForm.classList.add('ad-form--disabled');
  for (i = 0; i < adFields.length; i++) {
    adFields[i].disabled = true;
  }

  inputAdressValue.value = initPinMainCoord.initPinMainLeft + ', ' + initPinMainCoord.initPinMainTop;
  pinMain.style.left = initPinMainCoord.initPinMainLeft - Math.floor(PIN_MAIN_WIDTH / 2) + 'px';
  pinMain.style.top = initPinMainCoord.initPinMainTop - PIN_MAIN_HEIGHT + 'px';

  for (i = 0; i < pinList.length; i++) {
    pinList[i].classList.add('hidden');
  }

  closeAd();
};

var formButtonShowSuccesMessage = function (elem) {
  elem.preventDefault();

  var successMessage = document.querySelector('.success');
  successMessage.classList.remove('hidden');

  var closeSuccessMessage = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      successMessage.classList.add('hidden');
    }
  };
  document.addEventListener('keydown', closeSuccessMessage);
};

var setMinCostFromHousesType = function () {
  minCost.setAttribute('placeholder', HOUSES_CHARACTERS.cost[selectedHouseType.value]);
  minCost.setAttribute('min', HOUSES_CHARACTERS.cost[selectedHouseType.value]);
};

var setCheckOutFromCheckIn = function () {
  timeOut.selectedIndex = timeIn.selectedIndex;
};

var setCheckInFromCheckOut = function () {
  timeIn.selectedIndex = timeOut.selectedIndex;
};

var roomsAmount = adForm.elements.rooms;
var capacity = adForm.elements.capacity;

var setCapacityFromRooms = function () {
  var roomsValue = roomsAmount.value;
  var capacityValue = capacity.value;
  if (roomsValue !== '100' && roomsValue < capacityValue) {
    capacity.setCustomValidity('Количество гостей не должно превышать ' + roomsValue);
  } else if (roomsValue === '100' && capacityValue !== '0') {
    capacity.setCustomValidity('Комната не для гостей');
  } else {
    capacity.setCustomValidity('');
  }
};

// События
pinMain.addEventListener('mouseup', function () {
  pinMainActivateMapHandler();
  pinMainSetAdressHandler();
  pinMainDisplayNewPinsOnMapHandler();
  pinMainOpenAdModalHandler();
});

adForm.addEventListener('invalid', addErrorClass, true);
adForm.addEventListener('submit', formButtonShowSuccesMessage);
adFormSubmitButton.addEventListener('submit', formButtonResetMapHandler);
resetButton.addEventListener('click', formButtonResetMapHandler);

selectedHouseType.addEventListener('change', setMinCostFromHousesType);
timeIn.addEventListener('change', setCheckOutFromCheckIn);
timeOut.addEventListener('change', setCheckInFromCheckOut);
roomsAmount.addEventListener('change', setCapacityFromRooms);
capacity.addEventListener('change', setCapacityFromRooms);
