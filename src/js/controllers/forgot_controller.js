'use strict';

angular
	.module('infoMobi')
	.controller('ForgotController', ForgotController);

	function ForgotController($rootScope, $scope, API, UtilsService, $log) {
		
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
			success: function(resp) {
				UtilsService.toast("Senha resetada com sucesso. Confere sua caixa de email.");
				$rootScope.flip('#/login');
			},
			error: function(err) {
				UtilsService.toast("Email não encontrado.");
				$log.debug("Email não encontrado.");
			}
		}
	}
