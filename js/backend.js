'use strict';

(function () {
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking';
  var URL_DOWNLOAD = 'https://js.dump.academy/keksobooking/data';

  var REQUEST_TIMEOUT = 10000;
  var REQUEST_STATUS_OK = 200;

  var createRequest = function (onLoad, onError) {

    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';
    xhr.timeout = REQUEST_TIMEOUT;

    xhr.addEventListener('load', function () {
      if (xhr.status === REQUEST_STATUS_OK) {
        onLoad(xhr.response);
      } else {
        onError('ошибка! Статус ответа: ' + xhr.status + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    return xhr;
  };

  var downLoadData = function (onLoad, onError) {
    var xhr = createRequest(onLoad, onError);

    xhr.open('GET', URL_DOWNLOAD);
    xhr.send();
  };

  var upLoadData = function (data, onLoad, onError) {
    var xhr = createRequest(onLoad, onError);

    xhr.open('POST', URL_UPLOAD);
    xhr.send(data);
  };

  window.backend = {
    downLoadData: downLoadData,
    upLoadData: upLoadData
  };
})();
