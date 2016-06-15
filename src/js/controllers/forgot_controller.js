'use strict';

angular
	.module('infoMobi')
	.controller('ForgotController', ForgotController);

	function ForgotController($rootScope, $scope, API, UtilsService, $log, translateFilter) {
		
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

				API.Login.reset(payload, $scope.Forgot.success, $scope.Forgot.error);
			},
			success: function(response) {
				var msg = translateFilter("forgot.reset.Success");
				UtilsService.toast(msg);
				$rootScope.flip('#/login');
			},
			error: function(response) {
				var msg = translateFilter("forgot.reset.Error");
				if (response.data && response.data.error)
					msg += ": " + translateFilter(response.data.error);
				UtilsService.toast(msg);
			}
		}
	}
