'use strict';

(function () {
  var ADS_AMOUNT = 8;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var blockContainAllPins = document.querySelector('.map__pins');

  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  // Функция отрисовки Пинов на карте
  var ads = [];
  var onSuccess = function (info) {
    ads = info;
    renderPins();

    return ads;
  };

  var renderPin = function (info) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.style.left = info.location.x + 'px';
    pinElement.style.top = info.location.y + 'px';
    pinElement.querySelector('img').src = info.author.avatar;
    pinElement.querySelector('img').alt = info.offer.title;

    return pinElement;
  };

  var renderPins = function () {
    var fragmentPin = document.createDocumentFragment();
    for (var i = 0; i < ads.length; i++) {
      pinTemplate.setAttribute('id', i);
      fragmentPin.appendChild(renderPin(ads[i]));
    }
    var newPins = blockContainAllPins.appendChild(fragmentPin);
    return newPins;
  };

  var onError = function (er) {

    window.map.adForm.classList.add('ad-form--disabled');

    var unsuccesMessage = document.createElement('div');
    unsuccesMessage.classList.add('error-message');
    unsuccesMessage.textContent = 'Упс, ' + er + '. Повторите действие позднее';
    window.map.blockMap.appendChild(unsuccesMessage);
  };

  window.backend.downLoadData(onSuccess, onError);

  /* Открываю объявление по нажатию на Пин*/
  var pinMainOpenAdModalHandler = function () {
    blockContainAllPins.querySelectorAll('.map__pins button:not(.map__pin--main)').forEach(function (elem) {
      elem.addEventListener('click', function () {
        window.map.showAd();

        var id = elem.getAttribute('id');
        return window.ad.renderAd(ads[id]);
      });
    });
  };

  window.pin = {
    pinTemplate: pinTemplate,
    PIN_WIDTH: PIN_WIDTH,
    PIN_HEIGHT: PIN_HEIGHT,
    ads: ads,
    pinMainOpenAdModalHandler: pinMainOpenAdModalHandler
  };
})();

