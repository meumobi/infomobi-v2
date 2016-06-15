'use strict';

angular
	.module('infoMobi')
	.controller('ForgotController', ForgotController);

	function ForgotController($rootScope, $scope, API, UtilsService, $log, translateFilter) {
		
		var cb_login = {
			reset: {
				success: function(response){
					var msg = translateFilter("forgot.reset.Success");
					UtilsService.toast(msg);
					$rootScope.flip('#/login');
				},
				error: function(response){
					var msg = translateFilter("forgot.reset.Error");
					if (response.data && response.data.error)
						msg += ": " + translateFilter(response.data.error);
					UtilsService.toast(msg);
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
					UtilsService.toast('Erro de validação');
				}
				else {
					$scope.Forgot.sendMail();
				}
			},
			sendMail: function() {
				var payload = $scope.Forgot.informations;

				API.Login.reset(payload, cb_login.reset.success, cb_login.reset.error);
			}
		}
	}
