'use strict';

angular
.module('infoMobi')
.controller('MainController', MainController);

function MainController($rootScope, $scope, $location, AuthService, UtilsService, $log, APP, MeumobiCloud) {

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
		AuthService.logout();
		$rootScope.flip('#/login');
	}

	if (AuthService.isAuthenticated()) {
		var data = {};
		var defaultLogo = "images/header-color.png";
		MeumobiCloud.syncPerformance(
			function(response) {
				var data = response.data;
				data.logo = data.site.hasOwnProperty("logo") && data.site.logo != "" ? APP.cdnUrl + data.site.logo : defaultLogo;
				$rootScope.performance = data;
			}, function(error) {
				$log.debug("MeumobiCloud.syncPerformance ERROR");
				$log.debug(error);
			}
		)
	}
}
