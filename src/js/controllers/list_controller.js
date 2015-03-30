'use strict';

angular.module('infoboxApp.controllers.List', [])

.controller('ListController', function($rootScope, $scope, API, AppFunc, $timeout, SITE, SyncNews) {

  $scope.items = $rootScope.newsList;
  $scope.hideLoadingDiv = true;

  $scope.listItems = function() {
    SyncNews.get(function(resp, success) {
      $timeout(function() {
        $rootScope.loading = false;
      }, 300);
      if (success) {
        $scope.items = resp;
      } else {
        if (resp.error != "304") {
          AppFunc.toast(resp.error);
        }
        $scope.items = localStorage.hasOwnProperty('newsList') ? JSON.parse(localStorage['newsList']) : [];
      }
    });
  }

  $scope.getImage = function(path) {
    /*if(localStorage["image_"+id]){
			return localStorage["image_"+id];
		}*/
    return SITE.SRC_URL + path;
  }

  $scope.listItems();

  $scope.syncItems = function() {
    $scope.hideLoadingDiv = false;
    $scope.listItems();
    $scope.hideLoadingDiv = true;
  }

});
