'use strict';

angular

  .module('meumobi.utils', [])
  .factory('AppUtils', AppUtils);

  function AppUtils() {
    var app = {
      CanvasImg: {
        createBase64Image: function(url, callback) {
          var img = new Image;
          img.setAttribute('crossOrigin', 'anonymous');
          img.onload = function() {
            app.CanvasImg.imgToBase64(img, callback);
          }
          img.src = url;
        },
        imgToBase64: function(img, callback) {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          console.log(img.width, img.height)
          canvas.getContext("2d").drawImage(img, 0, 0);
          var base64 = canvas.toDataURL('image/png');
          if (callback) {
            callback(base64);
          } else {
            return base64;
          }
        }
      },
      safeApply: function(scope, fn) {
        var phase = scope.$root.$$phase;
        if (phase == '$apply' || phase == '$digest') {
          if (fn && (typeof(fn) === 'function')) {
            fn();
          }
        } else {
          scope.$apply(fn);
        }
      }
    };
    return app;
  }
