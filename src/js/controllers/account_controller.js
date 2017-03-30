(function() {
	'use strict';

	angular
	.module('infoMobi')
	.controller('AccountController', AccountController);

	function AccountController($rootScope, $scope, $location, AuthService, UtilsService, $log, translateFilter, meuCordova, meuCloud) {
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
					AuthService.loadVisitor(response.data.visitor);
					meuCordova.dialogs.toast(translateFilter("password.save.Success"));
					$scope.user = defaultUser;
          $scope.Save.isLoading = false;
				},
				error: function(response) {
					var msg = translateFilter("password.save.Error");
					if (response.data && response.data.error) {
						msg += ": " + translateFilter("[API]: " + response.data.error);
					} else {
						msg += ": " + translateFilter("default.network.Error");
					}
					meuCordova.dialogs.toast(msg);
          $scope.Save.isLoading = false;
				}
			}
		}

  	$scope.Save = {
  		submitForm: function() {
  			UtilsService.isOnline(function(online) {
  				if (online) {
  					if (isPasswordValid()) {
  						var payload = {
  							current_password: $scope.user.password,
  							password: $scope.user.newPassword
  						};
              $scope.Save.isLoading = true;
  						meuCloud.API.Login.save(payload)
              .then(cb_login.save.success)
              .catch(cb_login.save.error);
  					} else {
  						meuCordova.dialogs.toast("Erro ao confirmar senha");
  					}
  				} else {
  					meuCordova.dialogs.toast("Verifique sua conexão");
  				}
  			})
  		}
  	};
	}
})();
