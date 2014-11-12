'use strict';

angular.module('infoboxApp.controllers.Login', [])

.controller('LoginController', function($rootScope, $scope, $location){

	$rootScope.loading = false;


	$scope.Login = {
		signin : function(){
			if($scope.Login.username!="" && $scope.Login.password!=""){//MOCK
				$rootScope.go('/list')
			}else{

			}
		},
		username : "",
		password : ""
	}

});

 