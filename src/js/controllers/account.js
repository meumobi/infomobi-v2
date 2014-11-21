angular.module('infoboxApp.controllers.Account', ['infoboxApp.controllers.Main'])

.controller('AccountCtrl', function($scope, $location){
	$scope.user = {mail:'victor.dias@siemens.com.br', password:''};

	$scope.logout = function(){
		//MOCK
		delete localStorage.userToken;
		$location.url('/login');
	}

});