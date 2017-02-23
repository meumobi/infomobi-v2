(function() {
	'use strict';
 
  var contacts = {
    templateUrl: 'contacts/list.html',
    controller: function (SharedState, API, $log, meuPhoneCall, meuAnalytics) {
      var query = {
        type: "contacts"
      };
      var vm = this;
      
      vm.call = callNumber;
      
      
      function callNumber(number) {
         meuPhoneCall.call(number)
          .then(function() {
            meuAnalytics.trackEvent("Contacts", "Call Number", number);
            $log.debug('Resolve call Number');
          })
          .catch(function() {
            $log.debug('Reject call Number');
          });
      }
      
      var cb_search = {
        success: function(response) {
          fulfill(response);
        }, 
        fail: function(e) {
          $log.debug(e);
        }
      };
      
      activate();
      
      function activate() {
        API.Items.search(
          query, 
          cb_search.success, 
          cb_search.fail
        );
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
      
      function fulfill(response) {
        if (!response.unchanged)
          updateDatas(response);
        // if we have a promise, we will use the same current function when it is fulfilled
        if (response.promise) {
          response.promise
          .then(function(response) {
            fulfill(response);
          })
          .catch(function(response) {
          })
        }
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
