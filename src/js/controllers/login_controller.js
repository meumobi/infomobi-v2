'use strict';

angular
.module('InfoBox')
.controller('LoginController', LoginController);

function LoginController($rootScope, $http, $scope, $location, API, AppInfo, AppFunc, INFOBOXAPP, SITE, AuthService) {

	//this should not be scope available, and may be put inside a more reusable place, like a service
	var authenticateUser = function(mail, token) {
		//AuthService.setCredentials(mail, token);
		AppFunc.initPushwoosh();
		$rootScope.go('/list');
	};

	$scope.Login = {
		submitForm: function(isValid) {
			$scope.submitted = true;
			if (!isValid) {
				AppFunc.toast('Erro de validação');
			}
			else {
				$scope.Login.signin();
			}
		},
		signin: function() {
			var user = {
				"email": $scope.Login.username,
				"password": $scope.Login.password,
				"device": $rootScope.device,
			}
			API.Login.signin(user, $scope.Login.loginSuccess, $scope.Login.loginError);
		},
		username: "",
		password: "",
		changePassword: function() {
			console.log($scope.Login.new_password);
			API.Login.save({
				current_password: $scope.Login.password,
				password: $scope.Login.new_password
			}, function() {
				$rootScope.toggle('change-password-overlay', 'off');
				authenticateUser($scope.Login.username, $rootScope.userToken);
			}, function() {
				$rootScope.userToken = null;
			});
		},
		loginSuccess: function(resp) {
			//$rootScope.userToken = resp['token'];
			if(SITE.HAL_SUPPORT) {
				localStorage['site'] = $rootScope.site = resp['site'];
			}
			//show modal if need change password, otherwise authenticate
			AuthService.setCredentials(resp.visitor, resp.token);
			if (resp.error && resp.error == "password expired") {
				$rootScope.toggle('change-password-overlay', 'on');
			} else {
				authenticateUser($scope.Login.username, resp.token);
			}
		},
		loginError: function(resp) {
			var msg;
			if (resp.error) {
				if (resp.error == "Invalid visitor")
					msg = "Usuário e/ou Senha inválido(s)!";
				else
					msg = resp.error;
			} else {
				msg = "Erro ao realizar login. Tente novamente.";
			}
			AppFunc.toast(msg);
		}
	}
}
