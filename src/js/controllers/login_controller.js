'use strict';

angular
.module('infoMobi')
.controller('LoginController', LoginController);

function LoginController(DeviceService, PushService, $rootScope, $http, $scope, $location, API, UtilsService, APP, AuthService, $log) {

	//this should not be scope available, and may be put inside a more reusable place, like a service
	var authenticateUser = function() {
		$rootScope.go('/list');
		PushService.register(
			function(token) {
				$log.info("Device token: " + token);
				DeviceService.save(token);
			}, function(status) {
				DeviceService.save(null);
				$log.warn('failed to register : ' + JSON.stringify(status));
			}
		);
	};

	$scope.credentials = {
		email: "",
		password: ""
	};

	$scope.Login = {
		submitForm: function(isValid) {
			$scope.submitted = true;
			if (!isValid) {
				UtilsService.toast('Erro de validação');
			}
			else {
        // Login.loading used by Ladda on submit button
				$scope.Login.loading = true;
				$scope.Login.signin($scope.credentials);
			}
		},
		signin: function(credentials) {
			AuthService.login(credentials, $scope.Login.loginSuccess, $scope.Login.loginError)
		},

		changePassword: function() {
			API.Login.save({
				current_password: $scope.credentials.password,
				password: $scope.Login.new_password
			}, function(resp) {
				AuthService.loadAuthToken(resp.token);
				$rootScope.Ui.turnOff('modal1');
				//$rootScope.toggle('change-password-overlay', 'off');
				authenticateUser();
			}, function() {
				UtilsService.toast("Erro ao alterar sua senha. Confere sua conexão e tente novamente.");
				AuthService.logout();
			});
		},
		loginSuccess: function(resp) {
			$scope.Login.loading = false;
			//show modal if need change password, otherwise authenticate
			if (resp.error && resp.error == "password expired") {
				$scope.visitor = resp.visitor;
				//$rootScope.toggle('change-password-overlay', 'on');
				$rootScope.Ui.turnOn('modal1');
			} else {
				authenticateUser();
			}
		},
		loginError: function(resp) {
			var msg;
			if (resp && resp.error) {
				if (resp.error == "Invalid visitor")
					msg = "Usuário e/ou Senha inválido(s)!";
				else
					msg = resp.error;
			} else {
				msg = "Erro ao realizar login. Confere sua conexão e tente novamente.";
			}
			$scope.Login.loading = false;
			UtilsService.toast(msg);
		}
	}
}
