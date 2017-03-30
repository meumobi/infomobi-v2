(function() {
  'use strict';

  angular
  .module('infoMobi')
  .controller('ContactController', ContactController)

  function ContactController($rootScope, $log, UtilsService, CONFIG, translateFilter, meuCordova, meuCloud) {
		
    var vm = this;
    vm.isLoading = false;
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
          vm.isLoading = false;
          var msg = translateFilter("contact.mail.Success");
          meuCordova.dialogs.toast(msg);
          vm.informations.message = "";
        },
        error: function(response) {
          vm.isLoading = false;
          var msg = translateFilter("contact.mail.Error");
          if (response.data && response.data.error)
            msg += ": " + translateFilter(response.data.error);
          meuCordova.dialogs.toast(msg);
        }
      }
    };
      
    function sendMail() {
      vm.isLoading = true;
      meuCloud.API.Mail.save(vm.informations)
      .then(cb_mail.save.success)
      .catch(cb_mail.save.error);
    };
    
    try {
      $log.debug(vm.informations);
      var tokens = $rootScope.performance.site.theme.tokens;
      if (tokens.contact_screen_title != "")
        vm.title = tokens.contact_screen_title;
    } catch (e) {
      $log.debug("Screen title not available, use default")
      $log.debug(e); 
    }
  }
})();
