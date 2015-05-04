'use strict';

angular
	.module('infoMobi')
	.controller('ForgotController', ForgotController);

	function ForgotController($rootScope, $scope, API, AppFunc) {
		
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
					AppFunc.toast('Erro de validação');
				}
				else {
					$scope.Forgot.sendMail();
				}
			},
			sendMail: function() {
				var message = "[Esqueci minha senha]: ";
				API.Mail.save(message+$scope.Forgot.informations, $scope.Forgot.success, $scope.Forgot.error);
			},
			success: function(resp) {
				AppFunc.toast("Mensagem enviada com sucesso");
				//$scope.Forgot.informations.message = "";
				$rootScope.go('/login', 'slideRight');
			},
			error: function(err) {
				AppFunc.toast("Erro ao enviar mensagem");
			}
		}
	}
