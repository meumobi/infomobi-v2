'use strict';

angular
	.module('infoMobi')
	.controller('ContactController', ContactController)

	function ContactController($rootScope, $scope, $log, API, UtilsService, CONFIG, translateFilter) {
		$scope.Contact = {
			informations: {
				name: CONFIG.name,
				mail: $rootScope.visitor ? $rootScope.visitor.email : 'default@siemens.com',
				phone: "",
				message: ""
			},
			sendMail: function() {
				API.Mail.save($scope.Contact.informations, $scope.Contact.success, $scope.Contact.error);
			},
			success: function(response) {
				var msg = translateFilter("contact.mail.Success");
				UtilsService.toast(msg);
				$scope.Contact.informations.message = "";
			},
			error: function(response) {
				var msg = translateFilter("contact.mail.Error");
				if (response.data && response.data.error)
					msg += ": " + translateFilter(response.data.error);
				UtilsService.toast(msg);
			}
		}
	}
