(function() {
	'use strict';

	angular
	.module('ngMeumobi.Entities.items', [])
  .factory('Items', Items)

  function Items($log, meuCordova) {
    
		var service = {};
    
    service.share = share;

		return service;
    
    function share(item) {
      meuCordova.socialSharing.shareItem(item)
        .then(
          function (result){
            meuCordova.analytics.trackEvent("Social Network", "Share", item.title);
            $log.debug(result);
            $log.debug("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
            $log.debug("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
          }, 
          function (msg) {
            $log.debug(msg);
            $log.debug("Sharing failed with message: " + msg);
          }
        );
    }
  };
})();