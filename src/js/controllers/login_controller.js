'use strict';

angular.module('infoboxApp.controllers.Login', ['meumobi.api', 'meumobi.app'])

.controller('LoginController', function($rootScope, $scope, $location, Login, AppInfo, AppFunc){

	if (localStorage.hasOwnProperty('userToken')) {
	  $rootScope.go('/list');
    }	
  
  $rootScope.loading = false;

	

	$scope.Login = {
		signin : function(){

			$rootScope.loading = true;

			if($scope.Login.username!="" && $scope.Login.password!=""){//MOCK
				var info = AppInfo.service.Device.information();
				var user = {
					"email" : $scope.Login.username,
					"password" : $scope.Login.password,
					"device" : {
						"uuid" : info.uuid,
						"pushId" : "", 
						"model" : info.model
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
      AppFunc.initPushwoosh();
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
		},
		saveDeviceInformation : function(){
			var info = AppInfo.service.Device.information();
			var device = {
				"uuid" : info.uuid,
				"model" : info.model
			}
			
			Login.device(device,
				function(resp){
					console.log(resp);
				},
				function(err){
					console.log(err);
				}
			);
		}
	}

});

 