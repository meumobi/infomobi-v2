'use strict';

angular
	.module('infoMobi')
	.controller('ContactController', ContactController)

	function ContactController($rootScope, $scope, $log, API, UtilsService, CONFIG, translateFilter) {
		
    var vm = this;
    vm.sendMail = sendMail;
    vm.title = "Chat with the Internal Communication";
		vm.informations = {
			name: CONFIG.name,
			mail: $rootScope.visitor ? $rootScope.visitor.email : '',
			phone: "",
			message: ""
		};
    
		var cb_mail = {
			save: {
				success: function(response) {
					var msg = translateFilter("contact.mail.Success");
					UtilsService.toast(msg);
					vm.informations.message = "";
				},
				error: function(response) {
					var msg = translateFilter("contact.mail.Error");
					if (response.data && response.data.error)
						msg += ": " + translateFilter(response.data.error);
					UtilsService.toast(msg);
				}
			}
		};
      
		function sendMail() {
			API.Mail.save(vm.informations, cb_mail.save.success, cb_mail.save.error);
		};
    
    try {
      $log.debug(vm.informations);
      vm.title = $rootScope.performance.site.theme.tokens.contact_screen_title
    } catch (e) {
      $log.debug("Screen title not available, use default")
      $log.debug(e); 
    }
}
