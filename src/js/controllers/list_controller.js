'use strict';

angular.module('infoboxApp.controllers.List', ['meumobi.api'])

.controller('ListController', function($rootScope, $scope, Items, SyncNews) {
	
	$rootScope.loading = true;
	$scope.items = [];
	
	// Use it if Stub
	//$scope.items = Items.latest();
	//$rootScope.loading = false;
	
	/*Items.latest(
		function(data) {
			$rootScope.loading = false;
			localStorage['newsList'] = JSON.stringify(data.items);
			$scope.items = data.items;
		},
		function(error, status) {
			$rootScope.loading = false;
			// TODO: Display an error msg and invite to retry
			// error and status come empty. Should investigate
			console.log(status);
			console.log("Request Failed:" + error);
		}
	);*/

	SyncNews.get(function(resp, success){
		if(success){
			$scope.items = resp;
		}
		$rootScope.loading = false;
	});

	
});

 