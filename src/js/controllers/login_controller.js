'use strict';

angular.module('infoboxApp.controllers.Login', [])

.controller('LoginController', function($rootScope, $scope, $location, API, AppInfo, AppFunc, INFOBOXAPP, SITE){

  if (localStorage.hasOwnProperty('userToken')) {
    $rootScope.go('/list');
  }

  $rootScope.loading = false;
  //display the welcome overlay
  if (AppInfo.service.Device.isFirstConnection()) {
    $rootScope.welcome_message = SITE.WELCOME_MESSAGE;
    $rootScope.toggle('welcomeOverlay', 'on');
  }

  //this shoud not be scope available, and may be put inside a more reusable place, like a service
  var authenticateUser = function(mail, token) {
    localStorage['userToken'] = token;
    localStorage.mail = mail;
    $rootScope.go('/list');
    AppFunc.initPushwoosh();
    $scope.Login.saveDeviceInformation();
  };

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
    changePassword: function() {
      console.log($scope.Login.new_password);
      API.Login.save({
        current_password: $scope.Login.password,
        password: $scope.Login.new_password
      }, function() {
        $rootScope.toggle('changePasswordOverlay', 'off');
        authenticateUser($scope.Login.username, $rootScope.userToken);
      }, function() {
        $rootScope.userToken = null;
      });
    },
    loginSuccess : function(resp){
      $rootScope.userToken = resp['token'];
      //show modal if need change password, otherwise authenticate
      if (resp.visitor.should_renew_password) {
        $rootScope.toggle('changePasswordOverlay', 'on');
      } else {
        authenticateUser($scope.Login.username, $rootScope.userToken);
      }
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
					"push_id": localStorage['push_id'],
					"app_version" : INFOBOXAPP.VERSION
				}
				localStorage['deviceInformations'] = JSON.stringify(device);
				
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

 
