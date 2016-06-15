'use strict';

angular
.module('infoMobi')
.controller('LoginController', LoginController);

function LoginController(DeviceService, PushService, $rootScope, $http, $scope, $location, API, UtilsService, APP, AuthService, $log, MeumobiCloud) {

	//this should not be scope available, and may be put inside a more reusable place, like a service
	var authenticateUser = function() {
		$rootScope.go('/list');
		MeumobiCloud.syncPerformance(
			function(response) {
				var data = response.data;
				data.logo = data.site.hasOwnProperty("logo") && data.site.logo != "" ? APP.cdnUrl + data.site.logo : defaultLogo;
				$rootScope.performance = data;
			}, function(error) {
				$log.debug("MeumobiCloud.syncPerformance ERROR");
				$log.debug(error);
			}
		)
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
				AuthService.loadAuthToken(resp.data.token);
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
			if (resp.data && resp.data.error && resp.data.error == "password expired") {
				$scope.visitor = resp.visitor;
				//$rootScope.toggle('change-password-overlay', 'on');
				$rootScope.Ui.turnOn('modal1');
			} else {
				authenticateUser();
			}
		},
		loginError: function(resp) {
			var msg;
			if (resp.data && resp.data.error) {
				if (resp.data.error == "Invalid visitor")
					msg = "Usuário e/ou Senha inválido(s)!";
				else
					msg = resp.data.error;
			} else {
				msg = "Erro ao realizar login. Confere sua conexão e tente novamente.";
			}
			$scope.Login.loading = false;
			UtilsService.toast(msg);
		}
	}
}
