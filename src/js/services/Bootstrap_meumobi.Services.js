(function() {
	'use strict';

	angular
	.module('meumobi.services.Bootstrap', ['meumobi.services.Cordova', 'meumobi.services.Push'])
	.factory('BootstrapService', BootstrapService);

	function BootstrapService($log, deviceReady, PushService, $rootScope, UtilsService, CONFIG, ImgCache, DeviceService, API, AuthService) {
		var service = {};

		service.startApp = startApp;
		service.appRate = appRate;

		return service;

		function appRate() {
			deviceReady(function() {
				try {
					AppRate.preferences.storeAppURL.ios = CONFIG.ITUNES.id;
					AppRate.preferences.storeAppURL.android = 'market://details?id=' + CONFIG.id;
					AppRate.preferences.usesUntilPrompt = 3;
					AppRate.promptForRating();
				} catch (e) {
					$log.error(e);
				}
			});
		}

		function startApp() {
			// UtilsService.spinner.show();
			UtilsService.statusBar();
			UtilsService.hideSplashScreen();
			deviceReady(function() {
				document.addEventListener("online", $rootScope.toggleCon, false);
				document.addEventListener("offline", $rootScope.toggleCon, false);
				ImgCache.$init();
				PushService.config(CONFIG.PUSHWOOSH.googleProjectNumber, CONFIG.PUSHWOOSH.applicationCode);
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
				DeviceService.save();
				if (AuthService.isAuthenticated()) {
					PushService.register(
						function(token) {
							$log.info("Device token: " + token);
							DeviceService.save(token);
						}, function(status) {
							$log.warn('failed to register : ' + JSON.stringify(status));
						}
					);	
				} else {
					$log.info("Authentication failed");
				}
			});
		}
	}
})();