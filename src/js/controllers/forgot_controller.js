'use strict';

angular
	.module('InfoBox')
	.controller('ForgotController', ForgotController);

	function ForgotController($rootScope, $scope, API, AppFunc) {
		$rootScope.NavBarTop = true;

		$scope.Forgot = {
			informations: {
				name: "infobox",
				mail: "",
				phone: "",
				message: ""
			},
			sendMail: function() {
				var message = "[Esqueci minha senha]: ";
				message += $scope.Forgot.informations.message;
				$scope.Forgot.informations.message = message;
				API.Mail.save($scope.Forgot.informations, $scope.Forgot.success, $scope.Forgot.error);
			},
			success: function(resp) {
				AppFunc.toast("Mensagem enviada com sucesso");
				$scope.Forgot.informations.message = "";
				$rootScope.go('/login', 'slideRight');
			},
			error: function(err) {
				AppFunc.toast("Erro ao enviar mensagem");
			}
		}
		$rootScope.$on('loading:show', function() {
			$rootScope.loading = true;
		})

		$rootScope.$on('loading:hide', function() {
			$rootScope.loading = false;
		})
	}
