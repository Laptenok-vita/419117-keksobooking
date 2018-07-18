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
  var adFormSubmitButton = document.querySelector('.ad-form__submit');

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

    // RESET FORM
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

    for (i = 0; i < window.map.pinList.length; i++) {
      window.map.pinList[i].classList.add('hidden');
    }
    window.map.closeAd();
  };

  // SUBMIT FORM
  var formButtonShowSuccesMessage = function (elem) {
    elem.preventDefault();

    var successMessage = document.querySelector('.success');
    successMessage.classList.remove('hidden');

    var closeSuccessMessage = function () { // Изменила функцию, проверить
      if (window.map.PopupEscPressHandler) {
        successMessage.classList.add('hidden');
      }
    };
    document.addEventListener('keydown', closeSuccessMessage);
  };

  // EVENTS
  window.map.adForm.addEventListener('invalid', addErrorClass, true);
  window.map.adForm.addEventListener('submit', formButtonShowSuccesMessage);

  selectedHouseType.addEventListener('change', setMinCostFromHousesType);
  timeIn.addEventListener('change', setCheckOutFromCheckIn);
  timeOut.addEventListener('change', setCheckInFromCheckOut);
  roomsAmount.addEventListener('change', setCapacityFromRooms);
  capacity.addEventListener('change', setCapacityFromRooms);

  adFormSubmitButton.addEventListener('submit', formButtonResetMapHandler);
  resetButton.addEventListener('click', formButtonResetMapHandler);
})();
