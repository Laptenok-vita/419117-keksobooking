'use strict';

(function () {
  var HOUSES_DICT = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  // Функция создания массива объявлений
  var createAds = function () {
    var ads = [];
    for (var i = 0; i < window.data.ADS_AMOUNT; i++) {
      ads[i] = window.data.createAd(i);
    }
    return ads;
  };

    // Создаю массив объявлений
  var ads = createAds();

  // Функция создания объявления на карте
  var renderAd = function (ad) {
    var mapCard = document.querySelector('.popup');
    mapCard.querySelector('.popup__title').textContent = ad.offer.title;
    mapCard.querySelector('.popup__text--address').textContent = ad.offer.address;
    mapCard.querySelector('.popup__text--price').textContent = ad.offer.price + ' ₽/ночь';
    mapCard.querySelector('.popup__type').textContent = HOUSES_DICT[ad.offer.type];
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

  window.ad = {
    ads: ads,
    renderAd: renderAd,
  };
})();
