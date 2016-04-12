'use strict';

angular
	.module('infoMobi')
	.controller('ForgotController', ForgotController);

	function ForgotController($rootScope, $scope, API, UtilsService) {
		
		$scope.Forgot = {
			informations: {
				name: "infobox",
				mail: "",
				phone: "",
				message: ""
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
				var message = "[Esqueci minha senha]: ";
				payload.message = message + payload.message;
				API.Mail.save(payload, $scope.Forgot.success, $scope.Forgot.error);
			},
			success: function(resp) {
				UtilsService.toast("Mensagem enviada com sucesso");
				//$scope.Forgot.informations.message = "";
				$rootScope.flip('#/login');
			},
			error: function(err) {
				UtilsService.toast("Erro ao enviar mensagem");
			}
		}
	}
