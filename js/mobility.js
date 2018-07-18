'use strict';

(function () {
  var PIN_MAIN_SHANK = 22;

  var pinMain = document.querySelector('.map__pin--main'); // Пироженко
  var inputAdressValue = window.map.adForm.querySelector('input[name=address]');

  var initPinMainCoord = {
    x: parseInt(pinMain.style.left, 10),
    y: parseInt(pinMain.style.top, 10)
  };

  inputAdressValue.value = (initPinMainCoord.x + Math.floor(window.data.PIN_MAIN_WIDTH / 2)) + ', ' + (initPinMainCoord.y + Math.floor(window.data.PIN_MAIN_HEIGHT / 2));

  pinMain.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    window.map.pinMainActivateMapHandler();
    window.map.pinMainDisplayNewPinsOnMapHandler();
    window.map.pinMainOpenAdModalHandler();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var draggablePinMain = pinMain.querySelector('img');
    draggablePinMain.draggable = 'false';

    var getLimitOfMovement = function (coord, min, max) {
      if (coord < min) {
        coord = min;
      } else if (coord > max) {
        coord = max;
      }
      return coord;
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      draggablePinMain.draggable = 'true';

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var currentX = (pinMain.offsetLeft - shift.x);
      var currentY = (pinMain.offsetTop - shift.y);

      currentX = getLimitOfMovement(currentX, window.data.MIN_X, window.data.MAX_X);
      currentY = getLimitOfMovement(currentY, window.data.MIN_Y, window.data.MAX_Y);

      pinMain.style.left = currentX + 'px';
      pinMain.style.top = currentY + 'px';

      inputAdressValue.value = (currentX + Math.floor(window.data.PIN_MAIN_WIDTH / 2)) + ', ' + (currentY + window.data.PIN_MAIN_HEIGHT + PIN_MAIN_SHANK);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
