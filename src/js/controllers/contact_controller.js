'use strict';

angular
	.module('infoMobi')
	.controller('ContactController', ContactController)

	function ContactController($rootScope, $scope, API, UtilsService) {
		$scope.Contact = {
			informations: {
				name: "infobox",
				mail: $rootScope.visitor ? $rootScope.visitor.email : 'default@siemens.com',
				phone: "",
				message: ""
			},
			sendMail: function() {
				API.Mail.save($scope.Contact.informations, $scope.Contact.success, $scope.Contact.error);
			},
			success: function(resp) {
				console.log(resp);
				UtilsService.toast("Mensagem enviada com sucesso");
				$scope.Contact.informations.message = "";
			},
			error: function(err) {
				console.log(err);
				UtilsService.toast("Erro ao enviar mensagem");
			}
		}
	}
