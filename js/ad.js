'use strict';

(function () {
  var HOUSES_DICT = {
    'palace': 'Дворец',
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало'
  };

  var renderAd = function (ad) {
    var mapCard = document.querySelector('.popup');
    mapCard.querySelector('img').src = ad.author.avatar;

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
      if (photoTemplate) {
        var photoElement = photoTemplate.cloneNode(true);
      } else {
        photoElement = window.map.adTemplate.querySelector('.popup__photo').cloneNode(true);
      }
      photoElement.src = ad.offer.photos[j];
      photosBlock.appendChild(photoElement);
    }

    return mapCard;
  };

  window.ad = {
    renderAd: renderAd,
  };
})();
