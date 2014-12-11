'use strict';

angular.module('infoboxApp.controllers.List', ['meumobi.api','meumobi.settings'])

.controller('ListController', function($rootScope, $scope, Items, SyncNews, AppFunc, $timeout, SRC_URL) {
	
	$scope.items = $rootScope.newsList;
	
	// Use it if Stub
	//Items.latest();
	//$rootScope.loading = false;
	
	Items.latest(
		function(data) {
			$rootScope.loading = false;
      $scope.items = data.items;
      $rootScope.newsList = data.items;
			localStorage['newsList'] = JSON.stringify(data.items);	
		},
		function(error, status) {
			//$rootScope.go('login');
			// TODO: Display an error msg and invite to retry
			// error and status come empty. Should investigate
			console.log(status);
			console.log("Request Failed:" + error);
		}
	);
/*
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
	}*/

	$scope.getImage = function(path){
		/*if(localStorage["image_"+id]){
			return localStorage["image_"+id];
		}*/
		return SRC_URL+path;
	}

	//$scope.listItems();
	
});

 