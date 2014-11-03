'use strict';

angular.module('infoboxApp.controllers.Main', [])

.controller('MainController', function($rootScope, $scope, analytics, $location){

	$rootScope.$on("$routeChangeStart", function(){
		$rootScope.loading = true;
	});

	$rootScope.$on("$routeChangeSuccess", function(){
		$rootScope.loading = false;
	});

	$scope.userAgent =  navigator.userAgent;
	
	$scope.mailto = function(e) {
		if (window.plugins && window.plugins.emailComposer) {
			window.plugins.emailComposer.showEmailComposerWithCallback(console.log("Email callback " + e), "Want to know more about infoBox...", "Please send me more details.", ["infobox@siemens.com.br"], null, null, false, null, null);
		} else {
			location.href = 'mailto:infobox@siemens.com.br?subject=Question about media infoBox&body=';
		}
	}

	$scope.NavBars = {
		visibility : function(){console.log($location.url())
			if($location.url() != "/login"){
				return true;
			}
			return false;
		}
	}
	
});

