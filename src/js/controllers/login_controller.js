'use strict';

angular.module('infoboxApp.controllers.Login', [])

.controller('LoginController', function($rootScope, $scope, $location){

	$rootScope.loading = false;


	$scope.Login = {
		signin : function(){
			if($scope.Login.username!="" && $scope.Login.password!=""){//MOCK
				$rootScope.go('/list')
			}else{
				window.plugins.toast.showLongBottom('Usuário e/ou Senha inválido(s)!', 
					function(a){
						console.log('toast success: ' + a)
					},
					function(b){
						console.log('toast error: ' + b)
					}
				)
			}
		},
		username : "",
		password : ""
	}

});

 