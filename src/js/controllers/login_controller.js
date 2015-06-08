'use strict';

angular
.module('infoMobi')
.controller('LoginController', LoginController);

function LoginController($rootScope, $http, $scope, $location, API, AppFunc, AppInfo, APP, DeviceService, AuthService) {

	//this should not be scope available, and may be put inside a more reusable place, like a service
	var authenticateUser = function() {
		AppFunc.initPushwoosh();
		DeviceService.updateSignature();
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
				$rootScope.toggle('change-password-overlay', 'off');
				authenticateUser();
			}, function() {
				AppInfo.clearRestrictedDatas();
			});
		},
		loginSuccess: function(resp) {
			$scope.Login.loading = false;
			//show modal if need change password, otherwise authenticate
			if (resp.error && resp.error == "password expired") {
				$scope.visitor = resp.visitor;
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
