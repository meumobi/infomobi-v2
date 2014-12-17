'use strict';

angular.module('infoboxApp.controllers.List', ['meumobi.api','meumobi.settings'])

.controller('ListController', function($rootScope, $scope, Items, SyncNews, AppFunc, $timeout, SITE) {
	
	$scope.items = $rootScope.newsList;
		
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

	$scope.getImage = function(path){
		/*if(localStorage["image_"+id]){
			return localStorage["image_"+id];
		}*/
		return SITE.SRC_URL+path;
	}

	
});

 