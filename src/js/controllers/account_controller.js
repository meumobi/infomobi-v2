(function() {
	'use strict';

	angular
	.module('infoMobi')
	.controller('AccountController', AccountController);

	function AccountController($rootScope, $scope, $location, API, AuthService, UtilsService) {
		var defaultUser = {
			mail: $rootScope.visitor ? $rootScope.visitor.email : 'default@siemens.com',
			password: '',
			newPassword: '',
			confirmNewPassword: ''
		};
		
		$scope.user = defaultUser;

		function isPasswordValid() {
			return ($scope.user.newPassword == $scope.user.confirmNewPassword);
		}
		
		function success(data, status) {
			AuthService.loadAuthToken(data.token);
			UtilsService.toast("Senha alterada com sucesso");
			$scope.user = defaultUser;
		}

		function error(data, status) {
			var msg = "";
			if (status == 403) {
				msg = "Senha Inválida";
			} else if (status == 401) {
				$location.path('login');
				return false;
			} else if (status == 0) {
				msg = "Verifique sua conexão";
			} else {
				msg = data.statusText;
			}
			UtilsService.toast(msg);
		}
		
		$scope.change = function () {
			UtilsService.isOnline(function(online) {
				if (online) {
					if (isPasswordValid()) {
						var payload = {
							current_password: $scope.user.password,
							password: $scope.user.newPassword
						};
						API.Login.save(payload, success, error);
					} else {
						UtilsService.toast("Erro ao confirmar senha");
					}
				} else {
					UtilsService.toast("Verifique sua conexão");
				}
			})
		}
	}
})();
