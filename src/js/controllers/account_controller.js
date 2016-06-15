(function() {
	'use strict';

	angular
	.module('infoMobi')
	.controller('AccountController', AccountController);

	function AccountController($rootScope, $scope, $location, API, AuthService, UtilsService, $log, translateFilter) {
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

		var cb_login = {
			save: {
				success: function(response) {
					AuthService.loadAuthToken(response.data.token);
					$log.debug(response);
					AuthService.loadVisitor(response.data.visitor);
					UtilsService.toast(translateFilter("password.save.Success"));
					$scope.user = defaultUser;
				},
				error: function(response) {
					var msg = translateFilter("password.save.Error");
					if (response.data && response.data.error) {
						msg += ": " + translateFilter("[API]: " + response.data.error);
					} else {
						msg += ": " + translateFilter("default.network.Error");
					}
					UtilsService.toast(msg);
				}
			}
		}

		$scope.change = function () {
			UtilsService.isOnline(function(online) {
				if (online) {
					if (isPasswordValid()) {
						var payload = {
							current_password: $scope.user.password,
							password: $scope.user.newPassword
						};
						API.Login.save(payload, cb_login.save.success, cb_login.save.error);
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
