(function() {
	'use strict';

	angular
	.module('ngMeumobi.Entities.site', [])
  .factory('Site', Site);

  function Site($log, $rootScope, $exceptionHandler, meuCloud, meuUtils, meuCordova) {
    
		var service = {};
    
    service.updateAnalytics = updateAnalytics;
    
    return service;
    
    function updateAnalytics() {
      var gaId = meuCloud.getSiteProperty('analytics_token');
      if (gaId != "")
        meuUtils.deviceReady(function() {
          meuCordova.analytics.startTrackerWithId(gaId);
        });
    }
  }
})();