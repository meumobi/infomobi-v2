(function() {
	'use strict';

	angular
	.module('meumobi.services.Bootstrap', ['meumobi.services.Cordova'])
	.factory('BootstrapService', BootstrapService);

	function BootstrapService($log, $q, deviceReady, $rootScope, UtilsService, CONFIG, AuthService, meuAnalytics, meuSocialSharing, meuDialogs, $locale, $injector, Devices) {
		var service = {};

		service.startApp = startApp;

		return service;

		function appRate() {
			deviceReady(function() {
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
			// UtilsService.spinner.show();
      /*
        MeuAPI.init(function() {
          $log.debug("Init MeuMobi API Handler");
        }, function() {
          $log.debug("ERROR: Init MeuMobi API Handler");
        });        
      */
			UtilsService.statusBar();
			UtilsService.hideSplashScreen();
      $log.debug($locale);

			deviceReady(function() {
        meuSocialSharing.setOption("postfix", CONFIG.TOKENS.sharingSuffix);
				document.addEventListener("online", $rootScope.toggleCon, false);
				document.addEventListener("offline", $rootScope.toggleCon, false);
        
        meuAnalytics.startTrackerWithId(CONFIG.ANALYTICS.trackId);
        localStorage.notifications_count = 0;

        ImgCache.options.cacheClearSize = 10;
				ImgCache.$init();
        
				$log.debug("is Cordova ?: " + ImgCache.helpers.isCordova());
				if (CONFIG.OPTIONS.appRate && ImgCache.helpers.isCordova()) 
					appRate();
				if (ImgCache.helpers.isCordova() && AuthService.isAuthenticated()) {
          AuthService.registerPush();	
				} else {
					$log.info("Authentication failed");
				}
			});
		}
	}
})();