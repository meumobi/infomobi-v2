'use strict';

angular
	.module('infoMobi')
	.controller('ForgotController', ForgotController);

	function ForgotController($rootScope, $scope, meuCloud, UtilsService, $log, translateFilter, meuCordova) {
		
		var cb_login = {
			reset: {
				success: function(response){
					var msg = translateFilter("forgot.reset.Success");
					meuCordova.dialogs.toast(msg);
          $scope.Forgot.isLoading = false;
					$rootScope.flip('#/login');
				},
				error: function(response){
					var msg = translateFilter("forgot.reset.Error");
					if (response.data && response.data.error)
						msg += ": " + translateFilter(response.data.error);
					meuCordova.dialogs.toast(msg);
          $scope.Forgot.isLoading = false;
				}
			}
		}
		
		$scope.Forgot = {
			informations: {
				name: "infomobi",
				email: "",
			},
			submitForm: function(isValid) {
				$scope.submitted = true;
				if (!isValid) {
					meuCordova.dialogs.toast('Erro de validação');
				}
				else {
          $scope.Forgot.isLoading = true;
					$scope.Forgot.sendMail();
				}
			},
			sendMail: function() {
				var payload = $scope.Forgot.informations;

				meuCloud.API.Login.reset(payload)
        .then(cb_login.reset.success)
        .catch(cb_login.reset.error);
			}
		}
	}
