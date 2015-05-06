'use strict';

angular
.module('infoMobi')
.controller('LoginController', LoginController);

function LoginController($rootScope, $http, $scope, $location, API, AppFunc, APP, DeviceService, AuthService) {

	//this should not be scope available, and may be put inside a more reusable place, like a service
	var authenticateUser = function() {
		AppFunc.initPushwoosh();
		DeviceService.getSignature();
		$rootScope.go('/list');
	};

	$scope.credentials = {
		email: "",
		password: ""
	};

	$scope.Login = {
		submitForm: function(isValid) {
			$scope.submitted = true;
			if (!isValid) {
				AppFunc.toast('Erro de validação');
			}
			else {
        $scope.Login.loading = true;
				$scope.Login.signin($scope.credentials);
			}
		},
		signin: function(credentials) {
			AuthService.login(credentials, $scope.Login.loginSuccess, $scope.Login.loginError)
		},

		changePassword: function() {
			console.log($scope.Login.new_password);
			API.Login.save({
				current_password: $scope.Login.password,
				password: $scope.Login.new_password
			}, function(resp) {
				AuthService.loadAuthToken(resp.token);
				$rootScope.toggle('change-password-overlay', 'off');
				authenticateUser();
			}, function() {
				$rootScope.authToken = null;
			});
		},
		loginSuccess: function(resp) {
			//show modal if need change password, otherwise authenticate
			if (resp.error && resp.error == "password expired") {
				$rootScope.toggle('change-password-overlay', 'on');
			} else {
				authenticateUser();
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
