'use strict';

angular.module('infoboxApp.controllers.Login', ['meumobi.api'])

.controller('LoginController', function($rootScope, $scope, $location, Login){

	$rootScope.loading = false;


	$scope.Login = {
		signin : function(){

			$rootScope.loading = true;

			if($scope.Login.username!="" && $scope.Login.password!=""){//MOCK

				var user = {
					"email" : $scope.Login.username,
					"password" : $scope.Login.password,
					"device" : {
						"uuid" : "123",
						"pushId" : "", 
						"model" : "galaxy note3"
					}
				}

				Login.signin(user, $scope.Login.loginSuccess, $scope.Login.loginError);

			}else{
				$scope.Login.loginError();
			}
		},
		username : "",
		password : "",
		loginSuccess : function(resp){
			localStorage['userToken'] = resp.token;
			$rootScope.go('/list');
		},
		loginError : function(){
			$rootScope.loading = false;

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
	}

	/*Login.signin({
	  "email" : "visitor@mail.com",
	  "password" : "123456",
	  "device" : {
	    "id" : "123",
	    "model" : "galaxy note3"
	  },
	}).success(function(resp){
	    console.log(resp)
	})*/
});

 