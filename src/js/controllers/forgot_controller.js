'use strict';

angular
	.module('InfoBox')
	.controller('ForgotController', ForgotController);

	function ForgotController($rootScope, $scope, API, AppFunc) {
		$rootScope.loading = false;
		$scope.Forgot = {
			informations: {
				name: "infobox",
				mail: "",
				phone: "x",
				message: ""
			},
			sendMail: function() {
				$rootScope.loading = true;
				API.Mail.save($scope.Forgot.informations, $scope.Forgot.success, $scope.Forgot.error);
			},
			success: function(resp) {
				console.log(resp);
				AppFunc.toast("Mensagem enviada com sucesso");
				$scope.Forgot.informations.message = "";
				$rootScope.loading = false;
			},
			error: function(err) {
				console.log(err);
				AppFunc.toast("Erro ao enviar mensagem");
				$rootScope.loading = false;
			}
		}
	}
