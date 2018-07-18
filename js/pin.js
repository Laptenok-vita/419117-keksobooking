'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;

  // Находит кнопку с классом '.map__pin' в шаблоне template
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  // Функция отрисовки Пина на карте
  var renderPin = function (pin) {
    var pinElement = pinTemplate.cloneNode(true);

    pinElement.style.left = pin.location.x + 'px';
    pinElement.style.top = pin.location.y + 'px';
    pinElement.querySelector('img').src = pin.author.avatar;
    pinElement.querySelector('img').alt = pin.offer.title;

    return pinElement;
  };

  window.pin = {
    pinTemplate: pinTemplate,
    PIN_WIDTH: PIN_WIDTH,
    PIN_HEIGHT: PIN_HEIGHT,
    renderPin: renderPin
  };
})();
