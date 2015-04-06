'use strict';

angular
	.module('InfoBox')
	.controller('MainController', MainController);

	function MainController($rootScope, $scope, $location, AuthService) {
		$scope.userAgent = navigator.userAgent;

		$scope.mailto = function(e) {
			if (window.plugins && window.plugins.emailComposer) {
				window.plugins.emailComposer.showEmailComposerWithCallback(console.log("Email callback " + e),
				"Want to know more about infoBox...", "Please send me more details.", ["infobox@siemens.com.br"], null, null, false, null, null);
			} else {
				location.href = 'mailto:infobox@siemens.com.br?subject=Question about media infoBox&body=';
			}
		}

		$scope.logout = function() {
			AuthService.clearCredentials();
			$rootScope.go('/login');
		}
		
		var restrictedPage = $location.path().indexOf('login') == -1;

		$rootScope.NavBarBottom = restrictedPage ? true : false;
		$rootScope.NavBarTop = true;
	}
