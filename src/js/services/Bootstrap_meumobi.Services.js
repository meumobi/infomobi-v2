(function() {
	'use strict';

	angular
	.module('meumobi.services.Bootstrap', ['meumobi.services.Cordova', 'meumobi.services.Push'])
	.factory('BootstrapService', BootstrapService);

	function BootstrapService($log, deviceReady, PushService, $rootScope, UtilsService, CONFIG, DeviceService, AuthService, meuAnalytics, meuSocialSharing, $locale) {
		var service = {};

		service.startApp = startApp;

		return service;

		function appRate() {
			deviceReady(function() {
				try {
					AppRate.preferences.storeAppURL.ios = CONFIG.ITUNES.id;
					AppRate.preferences.storeAppURL.android = 'market://details?id=' + CONFIG.id;
					AppRate.preferences.usesUntilPrompt = 3;
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

        ImgCache.options.cacheClearSize = 10;
				ImgCache.$init();
        
				$log.debug("is Cordova ?: " + ImgCache.helpers.isCordova())
				if (CONFIG.OPTIONS.appRate && ImgCache.helpers.isCordova()) 
					appRate();
				
				PushService.config(CONFIG.PUSH.googleProjectNumber, CONFIG.PUSH.appId);
				/*
				PushService.handler(
					function(notification) {
						$log.info("foreground Handler");
						$log.info(notification);
						// alert(notification.title);
						meumobiSite.setSelectedItem(JSON.parse(notification.u));
						$location.path('/items/565609feb5a5088b7a8b4567');
						//$rootScope.goToItem(JSON.parse(notification.u));
				}, "foreground");
				PushService.handler(
					function(notification) {
						$log.info("onStart Handler");
						$log.info(notification);
						alert(notification.title);
				}, "onStart");
				*/

				var cb_push = {
					register: {
						success: function(token){
							$log.debug("Device token: " + token);
							DeviceService.save(token);
						},
						error: function(){
							DeviceService.save(null);
						}
					}
				};
				
				if (AuthService.isAuthenticated()) {
					PushService.register(cb_push.register.success, cb_push.register.error);	
				} else {
					$log.info("Authentication failed");
				}
			});
		}
	}
})();