'use strict';

angular
	.module('InfoBox')
	.controller('WelcomeController', WelcomeController);

	function WelcomeController($rootScope, $scope, $routeParams, WelcomeImages) {
		$rootScope.loading = false;
		$scope.item = WelcomeImages.get();

	}
