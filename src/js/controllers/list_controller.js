'use strict';

angular.module('infoboxApp.controllers.List', ['meumobi.api'])

.controller('ListController', function($rootScope, $scope, Items) {

	$rootScope.$on("$routeChangeStart", function(){
		$rootScope.loading = true;
	});

	$rootScope.$on("$routeChangeSuccess", function(){
		$rootScope.loading = false;
	});
	
	Items.latest(
		function(data) {
			$rootScope.loading = false;
			$scope.items = data.items;
		},
		function(error, status) {
			$rootScope.loading = false;
			// TODO: Display an error msg and invite to retry
			// error and status come empty. Should investigate
			console.log(status);
			console.log("Request Failed:" + error);
		}
	);
});

 