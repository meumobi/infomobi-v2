'use strict';

angular
	.module('InfoBox')
	.controller('WelcomeController', WelcomeController);

	function WelcomeController($rootScope, $scope, $routeParams, WelcomeImages) {
		$rootScope.loading = false;
		$scope.item = WelcomeImages.get();
		$scope.swipeNews = function(direction) {
			if (direction == 'right' && $routeParams.id > 0) {
				$rootScope.go('/show/' + (parseInt($routeParams.id) - 1), 'slideRight');
			} else if (direction == 'left' && $routeParams.id < $rootScope.newsList.length) {
				$rootScope.go('/show/' + (parseInt($routeParams.id) + 1), 'slideLeft');
			}
		}
	}
