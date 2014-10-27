angular.module('infoboxApp.controllers.Account', ['infoboxApp.controllers.Main'])

.controller('AccountCtrl', function($scope){
	$scope.user = {mail:'victor.dias@siemens.com.br', password:''};
});