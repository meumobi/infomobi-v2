'use strict';

angular
.module('infoMobi')
.controller('WelcomeController', WelcomeController);

function WelcomeController($rootScope, $scope, WELCOME) {
	$scope.item = WELCOME;
}
