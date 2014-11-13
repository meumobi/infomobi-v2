'use strict';

angular.module('infoboxApp.controllers.Login', ['meumobi.api'])

.controller('LoginController', function($rootScope, $scope, $location, Login){

	$rootScope.loading = false;


	$scope.Login = {
		signin : function(){
			if($scope.Login.username!="" && $scope.Login.password!=""){//MOCK
				$rootScope.go('/list')
			}else{
				var msg = "Usuário e/ou Senha inválido(s)!";
				if (window.plugins && window.plugins.toast) {
					window.plugins.toast.showLongBottom(msg, 
						function(a){
							console.log('toast success: ' + a)
						},
						function(b){
							console.log('toast error: ' + b)
						}
					);
				} else {
					alert(msg);
				}
			}
		},
		username : "",
		password : ""
	}
	$scope.Teste = Login;
});

 