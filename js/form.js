'use strict';

(function () {
  var HOUSES_COST = {
    'palace': 10000,
    'flat': 1000,
    'house': 5000,
    'bungalo': 0
  };

  var allInput = window.map.adForm.querySelectorAll('input');
  var resetButton = document.querySelector('.ad-form__reset');
  var adFormSubmitButton = window.map.adForm.querySelector('.ad-form__submit');

  var selectedHouseType = window.map.adForm.elements.type;
  var minCost = window.map.adForm.elements.price;
  var timeIn = window.map.adForm.elements.timein;
  var timeOut = window.map.adForm.elements.timeout;
  var roomsAmount = window.map.adForm.elements.rooms;
  var capacity = window.map.adForm.elements.capacity;
  var option = document.createElement('option');

  var addErrorClass = function (elem) {
    elem.target.classList.add('error');
  };

  var setMinCostFromHousesType = function () {
    minCost.setAttribute('placeholder', HOUSES_COST[selectedHouseType.value]);
    minCost.setAttribute('min', HOUSES_COST[selectedHouseType.value]);
  };

  var setCheckOutFromCheckIn = function () {
    timeOut.selectedIndex = timeIn.selectedIndex;
  };

  var setCheckInFromCheckOut = function () {
    timeIn.selectedIndex = timeOut.selectedIndex;
  };

  capacity.innerHTML = '';
  option.text = 'для 1 гостя';
  capacity.add(option);

  var setCapacityFromRooms = function () {
    capacity.innerHTML = '';
    if (roomsAmount.selectedIndex < 3) {
      var ended = '';
      for (var i = 0; i <= roomsAmount.selectedIndex; i++) {
        option = document.createElement('option');
        if (i < 1) {
          ended = 'я';
        } else {
          ended = 'ей';
        }
        option.text = 'для ' + (i + 1) + ' гост' + ended;
        capacity.add(option);
      }
    } else {
      option = document.createElement('option');
      option.text = 'Не для гостей';
      capacity.add(option);
    }
  };

  var formButtonShowSuccesMessage = function () {
    var successMessage = document.querySelector('.success');
    successMessage.classList.remove('hidden');

    var closeSuccessMessage = function (evt) {
      if (evt.keyCode === window.map.ESC_KEYCODE) {
        successMessage.classList.add('hidden');
        document.removeEventListener('keydown', closeSuccessMessage);
      }
    };
    document.addEventListener('keydown', closeSuccessMessage);

    setTimeout(function () {
      successMessage.classList.add('hidden');
    }, 10000);
  };

  var formButtonResetMapHandler = function () {
    for (var i = 0; i < allInput.length; i++) {
      if (allInput.innerHTML !== '') {
        allInput[i].value = '';
        allInput[i].classList.remove('error');
      }
    }

    document.querySelector('.map').classList.add('map--faded');
    window.map.adForm.classList.add('ad-form--disabled');
    for (i = 0; i < window.map.adFields.length; i++) {
      window.map.adFields[i].disabled = true;
    }
    for (i = 0; i < window.map.blockContainAllPins.querySelectorAll('.map__pins button:not(.map__pin--main)').length; i++) {
      window.map.blockContainAllPins.querySelectorAll('.map__pins button:not(.map__pin--main)')[i].classList.add('hidden');
    }
    window.map.closeAd();
  };

  var formButtonShowSuccessMessage = function () {
    formButtonShowSuccesMessage();
    formButtonResetMapHandler();
  };

  var formButtonShowUnsuccesMessage = function (er) {
    formButtonResetMapHandler();
    window.map.adForm.classList.add('ad-form--disabled');

    var unsuccesMessage = document.createElement('div');
    unsuccesMessage.classList.add('error-message');
    unsuccesMessage.textContent = 'Упс, ' + er + '. Повторите действие позднее';
    window.map.blockMap.appendChild(unsuccesMessage);

    setTimeout(function () {
      unsuccesMessage.remove('div');
    }, 10000);
  };

  var onSubmitBtnClick = function (evt) {
    evt.preventDefault();
    if (window.map.adForm.checkValidity()) {
      console.log(new FormData(window.map.adForm));
      window.backend.upLoadData(new FormData(window.map.adForm), formButtonShowSuccessMessage, formButtonShowUnsuccesMessage);
    } else {
      var fields = window.map.adForm.querySelectorAll('input, select, textarea');

      fields.forEach(function (item) {
        if (!item.validity.valid) {
          item.classList.add('invalid');
        }
      });
    }
  };

  window.map.adForm.addEventListener('invalid', addErrorClass, true);
  // adFormSubmitButton.addEventListener('click', formButtonResetMapHandler);

  adFormSubmitButton.addEventListener('click', onSubmitBtnClick);

  resetButton.addEventListener('click', formButtonResetMapHandler);

  selectedHouseType.addEventListener('change', setMinCostFromHousesType);
  timeIn.addEventListener('change', setCheckOutFromCheckIn);
  timeOut.addEventListener('change', setCheckInFromCheckOut);
  roomsAmount.addEventListener('change', setCapacityFromRooms);
  capacity.addEventListener('change', setCapacityFromRooms);
})();
