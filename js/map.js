'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFields = adForm.querySelectorAll('fieldset');
  var blockMap = document.querySelector('.map');
  var adTemplate = document.querySelector('template')
  .content
  .querySelector('.map__card');
  var blockContainAllPins = document.querySelector('.map__pins');
  var pinBefore = document.querySelector('.map__filters-container');

  var ESC_KEYCODE = 27;

  var addNewAd = function () {
    if (!blockMap.querySelector('.map__card')) {
      var fragmentMapAd = document.createDocumentFragment();
      fragmentMapAd.appendChild(adTemplate.cloneNode(true));
      blockMap.insertBefore(fragmentMapAd, pinBefore);
    }
  };
  addNewAd();

  var adOnMap = blockMap.querySelector('.map__card');

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

  var adCloseButton = document.querySelector('.popup__close');

  document.addEventListener('keydown', PopupEscPressHandler);
  adCloseButton.addEventListener('click', closeAd);

  var pinMainActivateMapHandler = function () {
    document.querySelector('.map').classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    for (var i = 0; i < adFields.length; i++) {
      adFields[i].disabled = false;
    }
  };

  /* Удаляю класс hidden с каждого Пина*/
  var pinMainDisplayNewPinsOnMapHandler = function () {
    blockContainAllPins.querySelectorAll('.map__pins button:not(.map__pin--main)').forEach(function (elem) {
      elem.classList.remove('hidden');
    });
  };

  /* Делаю Карту неактивной*/
  var pinMainDeactivateMapHandler = function () {
    document.querySelector('.map').classList.add('map--faded');
    adForm.classList.add('ad-form--disabled');

    for (var i = 0; i < adFields.length; i++) {
      blockContainAllPins.querySelectorAll('.map__pins button:not(.map__pin--main)')[i].classList.add('hidden');
      adFields[i].disabled = true;
    }
  };

  window.map = {
    ESC_KEYCODE: ESC_KEYCODE,
    adForm: adForm,
    blockMap: blockMap,
    adFields: adFields,
    blockContainAllPins: blockContainAllPins,
    closeAd: closeAd,
    PopupEscPressHandler: PopupEscPressHandler,
    pinMainDisplayNewPinsOnMapHandler: pinMainDisplayNewPinsOnMapHandler,
    pinMainActivateMapHandler: pinMainActivateMapHandler,
    pinMainDeactivateMapHandler: pinMainDeactivateMapHandler,
    showAd: showAd,
    adTemplate: adTemplate
  };
})();
