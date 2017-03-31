(function() {
	'use strict';

	angular
	.module('meumobi.services.Bootstrap', [])
	.factory('BootstrapService', BootstrapService);

	function BootstrapService($log, $q, $rootScope, UtilsService, CONFIG, AuthService, meuCordova, meuUtils, $locale, Devices) {
		var service = {};

		service.startApp = startApp;

		return service;

		function appRate() {
			meuUtils.deviceReady(function() {
				try {
					AppRate.preferences.storeAppURL.ios = CONFIG.ITUNES.id;
					AppRate.preferences.storeAppURL.android = 'market://details?id=' + CONFIG.id;
					AppRate.preferences.usesUntilPrompt = 10;
					AppRate.preferences.useLanguage = 'pt';
					AppRate.preferences.displayAppName = CONFIG.name;
					AppRate.promptForRating(false);
				} catch (e) {
					$log.debug(e);
				}
			});
		}

		function startApp() {
			UtilsService.statusBar();
      $log.debug($locale);

			meuUtils.deviceReady(function() {
        meuCordova.splashscreen.hide();
        meuCordova.socialSharing.setOption("postfix", CONFIG.TOKENS.sharingSuffix);
				document.addEventListener("online", $rootScope.toggleCon, false);
				document.addEventListener("offline", $rootScope.toggleCon, false);
        
        meuCordova.analytics.startTrackerWithId(CONFIG.ANALYTICS.trackId);
        localStorage.notifications_count = 0;

        ImgCache.options.cacheClearSize = 10;
				ImgCache.$init();
        
				$log.debug("is Cordova ?: " + ImgCache.helpers.isCordova());
				if (CONFIG.OPTIONS.appRate && ImgCache.helpers.isCordova()) 
					appRate();
				if (ImgCache.helpers.isCordova() && AuthService.isAuthenticated()) {
          AuthService.registerPush();	
				}
			});
		}
	}
})();