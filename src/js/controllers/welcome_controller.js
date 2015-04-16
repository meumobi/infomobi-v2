'use strict';

angular
.module('InfoBox')
.controller('WelcomeController', WelcomeController);

function WelcomeController($rootScope, $scope, AppInfo, WelcomeImages) {
	$scope.item = WelcomeImages.get();
}
