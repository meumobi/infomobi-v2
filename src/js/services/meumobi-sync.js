'use strict';

angular
  .module('meumobi.sync', ['meumobi.api', 'meumobi.appInfo', 'meumobi.utils', 'meumobi.settings'])
  .factory('SyncNews', SyncNews);

  function SyncNews(API, AppInfo, AppUtils, $rootScope, APP, AppFunc) {

    var app = {
      get: function(callback) {
        if (window.navigator.onLine) {
          console.log("Device is online.");
          app.list(callback); // Online API Request
        } else {
          console.log("Device is offline.");
          callback({
            error: "Não foi possível sincronizar a lista de notícias. Verifique suas conexões e tente novamente."
          }, false);
        }
        AppFunc.eraseNotifications();
      },
      list: function(callback) {
        API.Items.latest(
          function(data, status, getResponseHeaders) {
            var headers = getResponseHeaders();
            app.setETag(headers.etag);
            var news = data.items;
            var imagesUrls = app.getImagesFromNews(news);
            app.deleteImages();
            app.saveAllImages(imagesUrls, function() {
              localStorage['newsList'] = JSON.stringify(news);
              $rootScope.newsList = news;
              callback(news, true);
            });
          },
          function(errorResponse, status) {
            console.log(status);
            console.log("Request Failed:" + errorResponse);
            switch (status) {
              case 304:
                callback({
                  error: "304"
                }, false); //No changes in the list
                break;
              case 401:
                delete localStorage.user;
                $rootScope.go('/login');
                break;
              default:
                if (errorResponse == null) {
                  errorResponse = "Houve um problema ao sincronizar. Tente novamente.";
                }
                callback({
                  error: status + " - " + errorResponse
                }, false);
                break;
            }
            //$rootScope.loading = false;
          }
        );
      },
      getImagesFromNews: function(news) {
        var images = [],
          newsLength = news.length;
        while (newsLength--) {
          var atualNews = news[newsLength];
          for (var i = 0, totalImages = atualNews.images.length; i < totalImages; i++) {
            var img = atualNews.images[i];
            images.push({
              url: APP.cdnUrl + img.path,
              id: img.id
            });
          }
        }
        return images;
      },
      saveImage: function(image, callback) {
        console.log(AppUtils)
        AppUtils.CanvasImg.createBase64Image(image.url, function(img64) {
          localStorage['image_' + image.id] = img64;
          callback('image_' + image.id, img64);
        });
      },
      saveAllImages: function(imagesUrls, callback) {
        var imagesToSave = imagesUrls.length,
          totalImages = imagesToSave - 1;
        while (imagesToSave--) {
          //can't save all the images. the 5MB limit has been exceeded
          //app.saveImage(imagesUrls[imagesToSave],function(imageId, img64){
          //totalImages--;
          //if(imagesToSave == totalImages){
          callback();
          //}
          //});
        }
      },
      deleteImages: function() {
        for (prop in localStorage) {
          if (prop.indexOf('image_') != -1) {
            delete localStorage[prop];
          }
        }
      },
      setETag: function(etag) {
        localStorage['ETag'] = etag;
      }
    };
    return app;
  }
