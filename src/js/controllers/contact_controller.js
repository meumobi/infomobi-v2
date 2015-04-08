'use strict';

angular
	.module('InfoBox')
	.controller('ContactController', ContactController)

	function ContactController($rootScope, $scope, API, AppFunc) {
		$rootScope.loading = false;
		$scope.Contact = {
			informations: {
				name: "infobox",
				mail: $rootScope.user ? $rootScope.user.visitor.email : 'default@siemens.com',
				phone: "",
				message: ""
			},
			sendMail: function() {
				$rootScope.loading = true;
				API.Mail.save($scope.Contact.informations, $scope.Contact.success, $scope.Contact.error);
			},
			success: function(resp) {
				console.log(resp);
				AppFunc.toast("Mensagem enviada com sucesso");
				$scope.Contact.informations.message = "";
				$rootScope.loading = false;
			},
			error: function(err) {
				console.log(err);
				AppFunc.toast("Erro ao enviar mensagem");
				$rootScope.loading = false;
			}
		}
	}
