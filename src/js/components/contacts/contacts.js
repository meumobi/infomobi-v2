(function() {
	'use strict';
 
  var contacts = {
    templateUrl: 'contacts/list.html',
    controller: function (SharedState, meuCloud, $log, meuCordova) {
      var query = {
        type: "contacts"
      };
      var vm = this;
      
      vm.call = callNumber;
      
      
      function callNumber(number) {
         meuCordova.callNumber(number)
          .then(function() {
            meuCordova.analytics.trackEvent("Contacts", "Call Number", number);
            $log.debug('Resolve call Number');
          })
          .catch(function() {
            $log.debug('Reject call Number');
          });
      }
      
      activate();
      
      function activate() {
        meuCloud.API.Items.search(query)
        .then(function(response) {
          updateDatas(response);
          if (response.promise)
            return response.promise;
        })
        // If response contains a promise, means is from cache and promise will sync w/ Server
        .then(function(response) {
          updateDatas(response)
        })
        .catch(function(e) {
          $exceptionHandler(e);
        })
      };
       
      function decorateItem(item, index, items) {
        /*
          If phone number use "ramal" then hide prefix on link label
          "Ramal" is setted within []. ie phone='[+55212472]7309' => <a href="tel:+552124727309">7309</a>
        */
        // Remove string within []
        item.label = item.phone.replace(/\s*\[.*?\]\s*/g, '');
        // Remove non numeric or + characters
        item.phone = item.phone.replace(/[^0-9\+]/g,'');    
      
        return item;
      }
      
      function updateDatas(response) {
        if (response.data.items && response.data.items.contacts) {
          var items = response.data.items && response.data.items.contacts;
          vm.contacts = items.map(function(e, index, arr) {
            return decorateItem(e, index, arr);
          });
        }
      }
    }
  };
  
	angular
	.module('infoMobi')
	.component('contactsSidebarRight', contacts);
})();
