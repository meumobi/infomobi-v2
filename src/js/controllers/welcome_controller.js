'use strict';

angular
.module('infoMobi')
.controller('WelcomeController', WelcomeController);

function WelcomeController($rootScope, $scope, CONFIG) {
	$scope.item = CONFIG.WELCOME;
}
