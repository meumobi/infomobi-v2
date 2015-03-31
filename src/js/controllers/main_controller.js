'use strict';

angular
  .module('infoboxApp.controllers.Main', [])
  .controller('MainController', MainController);

  function MainController($rootScope, $scope, $location) {

    $scope.userAgent = navigator.userAgent;

    $scope.mailto = function(e) {
      if (window.plugins && window.plugins.emailComposer) {
        window.plugins.emailComposer.showEmailComposerWithCallback(console.log("Email callback " + e),
          "Want to know more about infoBox...", "Please send me more details.", ["infobox@siemens.com.br"], null, null, false, null, null);
      } else {
        location.href = 'mailto:infobox@siemens.com.br?subject=Question about media infoBox&body=';
      }
    }

    $scope.NavBars = {
      visibility: function() {
        if ($location.url() != "/login" && $location.url() != "/forgot") {
          return true;
        }
        return false;
      },
      canBack: function() {
        if ($location.url().indexOf("/show") != -1) {
          return true;
        }
        if ($location.url().indexOf("/files") != -1) {
          return true;
        }
        return false;
      }
    }



  }
