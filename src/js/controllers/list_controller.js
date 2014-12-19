'use strict';

angular.module('infoboxApp.controllers.List', [])

.controller('ListController', function($rootScope, $scope, API, AppFunc, $timeout, SITE, SyncNews) {
	
	$scope.items = $rootScope.newsList;
	
	$scope.listItems = function(){
		SyncNews.get(function(resp, success){
			$timeout(function(){
				$rootScope.loading = false;
			},300);
			if(success){
				$scope.items = resp;
			}else{
				AppFunc.toast("Erro ao sincronizar notícias");
				$scope.items = localStorage.hasOwnProperty('newsList') ? JSON.parse(localStorage['newsList']) : [];
			}
		});
	}

	$scope.getImage = function(path){
		/*if(localStorage["image_"+id]){
			return localStorage["image_"+id];
		}*/
		return SITE.SRC_URL+path;
	}

	$scope.listItems();

	
});

 