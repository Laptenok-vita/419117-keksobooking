'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFields = adForm.querySelectorAll('fieldset');
  var blockMap = document.querySelector('.map');

  var ESC_KEYCODE = 27;

  // Находит секцию с классом '.map__card' в шаблоне template
  var adTemplate = document.querySelector('template')
  .content
  .querySelector('.map__card');

  // Куда буду добавлять новые Пины в разметке
  var blockContainAllPins = document.querySelector('.map__pins');

  // Куда буду добавлять новое объявление в разметке
  var pinBefore = document.querySelector('.map__filters-container');

  // Функция отрисовки Пинов на карте
  var renderPins = function () {
    var fragmentPin = document.createDocumentFragment();
    for (var i = 0; i < window.data.ADS_AMOUNT; i++) {
      window.pin.pinTemplate.setAttribute('id', i);
      fragmentPin.appendChild(window.pin.renderPin(window.ad.ads[i]));
    }
    var newPins = blockContainAllPins.appendChild(fragmentPin);
    return newPins;
  };
  renderPins();

  // Создаю карточку объявления
  var addNewAd = function () {
    if (!blockMap.querySelector('.map__card')) {
      var fragmentMapAd = document.createDocumentFragment();
      fragmentMapAd.appendChild(adTemplate.cloneNode(true));
      blockMap.insertBefore(fragmentMapAd, pinBefore);
    }
  };
  addNewAd();

  var adOnMap = blockMap.querySelector('.map__card');
  var pinList = blockContainAllPins.querySelectorAll('.map__pins button:not(.map__pin--main)');

  var showAd = function () {
    adOnMap.classList.remove('hidden');
  };

  var closeAd = function () {
    adOnMap.classList.add('hidden');
  };

  var PopupEscPressHandler = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeAd();
    }
  };

  // Обработчик событий на каждый Пин
  var pinMainOpenAdModalHandler = function () {
    pinList.forEach(function (elem) {
      elem.addEventListener('click', function () {
        showAd();

        var id = elem.getAttribute('id');
        return window.ad.renderAd(window.ad.ads[id]);
      });
    });
  };


  var adCloseButton = document.querySelector('.popup__close');
  // Закрываю объявление
  document.addEventListener('keydown', PopupEscPressHandler);
  adCloseButton.addEventListener('click', closeAd);

  // Функция активации карты
  var pinMainActivateMapHandler = function () {
    document.querySelector('.map').classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    for (var i = 0; i < adFields.length; i++) {
      adFields[i].disabled = false;
    }
  };

  // Удаляю класс hidden с Пинов при нажатии на Пироженко
  var pinMainDisplayNewPinsOnMapHandler = function () {
    pinList.forEach(function (elem) {
      elem.classList.remove('hidden');
    });
  };

  // Функция деактивации карты
  var pinMainDeactivateMapHandler = function () {
    document.querySelector('.map').classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');

    for (var i = 0; i < adFields.length; i++) {
      pinList[i].classList.add('hidden');
      adFields[i].disabled = true;
    }
  };

  window.map = {
    adForm: adForm,
    adFields: adFields,
    pinList: pinList,
    closeAd: closeAd,
    PopupEscPressHandler: PopupEscPressHandler,
    pinMainDisplayNewPinsOnMapHandler: pinMainDisplayNewPinsOnMapHandler,
    pinMainOpenAdModalHandler: pinMainOpenAdModalHandler,
    pinMainActivateMapHandler: pinMainActivateMapHandler,
    pinMainDeactivateMapHandler: pinMainDeactivateMapHandler
  };
})();
