'use strict';

angular.module('infoboxApp.controllers.List', [])

.controller('ListController', function($rootScope, $scope, Items) {

	$rootScope.$on("$routeChangeStart", function(){
		$rootScope.loading = true;
	});

	$rootScope.$on("$routeChangeSuccess", function(){
		//$rootScope.loading = false;
	});

	//$scope.items = Items.latest();
	Items.latest(
		function(data) {
			$rootScope.loading = false;
			$scope.items = data;
		},
		function(error, status) {
			$rootScope.loading = false;
			// TODO: Display an error msg and invite to retry
			console.log(status);
			console.log("Failed to retrieve items due to:" + error);
		}
	);
	//console.log(Items.get({id: '1'}));
	
});

 