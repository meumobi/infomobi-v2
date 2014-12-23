'use strict';

angular.module('infoboxApp.controllers.Login', [])

.controller('LoginController', function($rootScope, $scope, $location, API, AppInfo, AppFunc){

	if (localStorage.hasOwnProperty('userToken')) {
	  $rootScope.go('/list');
    }	
  
  $rootScope.loading = false;

	

	$scope.Login = {
		signin : function(){

			$rootScope.loading = true;

			if($scope.Login.username!="" && $scope.Login.password!=""){//MOCK
				AppInfo.service.Device.information(function(informations){
					var user = {
						"email" : $scope.Login.username,
						"password" : $scope.Login.password,
						"device" : {
							"uuid" : informations.uuid,
							"pushId" : "", 
							"model" : informations.model
						}
					}
					API.Login.signin(user, $scope.Login.loginSuccess, $scope.Login.loginError);

				});
			}else{
				$scope.Login.loginError();
			}
		},
		username : "",
		password : "",
		loginSuccess : function(resp){
			localStorage['userToken'] = resp.token;
      		$rootScope.userToken = resp.token;
      		localStorage.mail = $scope.Login.username;
			$rootScope.go('/list');
      		AppFunc.initPushwoosh();

      		$scope.Login.saveDeviceInformation();
		},
		loginError : function(resp){
			$rootScope.loading = false;
			var msg;

			if(resp.error && resp.error=="Invalid visitor"){
				msg = "Usuário e/ou Senha inválido(s)!";
			}else{
				msg = "Erro ao realizar login. Tente novamente.";
			}

			AppFunc.toast(msg);
		},
		saveDeviceInformation : function(){
			AppInfo.service.Device.information(function(informations){
				var device = {
					"uuid" : informations.uuid,
					"model" : informations.model,
					"push_id": ""
				}
				
				API.Login.update(device,
					function(resp){
						console.log(resp);
					},
					function(err){
						console.log(err);
					}
				);
			});
		}
	}

});

 