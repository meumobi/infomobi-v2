'use strict';

angular
.module('InfoBox')
.controller('WelcomeController', WelcomeController);

function WelcomeController($rootScope, $scope, WelcomeImages) {
	$scope.item = WelcomeImages.get();
}
