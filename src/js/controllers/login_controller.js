'use strict';

angular
.module('infoMobi')
.controller('LoginController', LoginController);

function LoginController($rootScope, $http, $scope, $location, API, AppFunc, APP, DeviceService, AuthService) {

	//this should not be scope available, and may be put inside a more reusable place, like a service
	var authenticateUser = function(mail, token) {
		//AuthService.setCredentials(mail, token);
		AppFunc.initPushwoosh();
		DeviceService.getSignature();
		$rootScope.go('/list');
	};

	$scope.Login = {
		submitForm: function(isValid) {
			$scope.submitted = true;
			if (!isValid) {
				AppFunc.toast('Erro de validação');
			}
			else {
        $scope.Login.loading = true;
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
			}, function(resp) {
				AuthService.loadAuthToken(resp.token);
				$rootScope.toggle('change-password-overlay', 'off');
				authenticateUser($scope.Login.username, $rootScope.authToken);
			}, function() {
				$rootScope.authToken = null;
			});
		},
		loginSuccess: function(resp) {
			//$rootScope.userToken = resp['token'];
			if(APP.halSupport) {
				localStorage['site'] = $rootScope.site = resp['site'];
			}
			//show modal if need change password, otherwise authenticate
			AuthService.loadVisitor(resp.visitor);
			AuthService.loadAuthToken(resp.token);
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
			$scope.Login.loading = false;
			AppFunc.toast(msg);
		}
	}
}
