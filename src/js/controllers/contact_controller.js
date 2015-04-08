'use strict';

angular
	.module('InfoBox')
	.controller('ContactController', ContactController)

	function ContactController($rootScope, $scope, API, AppFunc) {
		$scope.Contact = {
			informations: {
				name: "infobox",
				mail: $rootScope.user ? $rootScope.user.visitor.email : 'default@siemens.com',
				phone: "",
				message: ""
			},
			sendMail: function() {
				API.Mail.save($scope.Contact.informations, $scope.Contact.success, $scope.Contact.error);
			},
			success: function(resp) {
				console.log(resp);
				AppFunc.toast("Mensagem enviada com sucesso");
				$scope.Contact.informations.message = "";
			},
			error: function(err) {
				console.log(err);
				AppFunc.toast("Erro ao enviar mensagem");
			}
		}
	}
