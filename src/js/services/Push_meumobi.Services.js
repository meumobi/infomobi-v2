(function() {
	'use strict';

	angular
	.module('meumobi.services.Push', [])
	
	.service('PushwooshiOSImpl', PushwooshiOSImpl)
	.service('PushwooshAndroidImpl', PushwooshAndroidImpl)
	.factory('PushService', PushService);
	
	function PushwooshiOSImpl($log) {

		var applicationCode;
	
		this.config = function(g, a) {
			applicationCode = a;
		}

		this.handler = function(action, trigger) {
			//set push notification callback before we initialize the plugin
			document.addEventListener('push-notification', function(event) {
				action(event.notification);
				//clear the app badge
				alert(event.notification.aps.alert);
				pushNotification.setApplicationIconBadgeNumber(0);
			});
		}

		this.register = function(success, error) {
			// var pushNotification = (typeof cordova !== 'undefined') && cordova.require("pushwoosh-cordova-plugin.PushNotification");
			var pushNotification = (typeof cordova !== 'undefined') && cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");

			if (pushNotification) {
				$log.info("Plugin pushNotification loaded");

				//initialize the plugin
				pushNotification.onDeviceReady({
					pw_appid: applicationCode
				});

				//register for push notifications
				pushNotification.registerDevice(
					function(status) {
						var deviceToken = status['deviceToken'];
						$log.info('registerDevice: ' + deviceToken);
						//callback when pushwoosh is ready
						success(deviceToken);
					}, error
				);
	
				//reset badges on start
				pushNotification.setApplicationIconBadgeNumber(0);
			} else {
				$log.info("Plugin pushNotification NOT loaded");
			}
		}
	}
	
	function PushwooshAndroidImpl($log) {

		var googleProjectNumber;
		var applicationCode;
	
		this.config = function(g, a) {
			googleProjectNumber = g;
			applicationCode = a;
		}

		this.handler = function(action, trigger) {
			//set push notification callback before we initialize the plugin
			document.addEventListener('push-notification', function(event) {
				if (event.notification[trigger]) {
					action(event.notification);
				}
				//clear the app badge
				pushNotification.setApplicationIconBadgeNumber(0);
			});
		}

		this.register = function(success, error) {
			
			// var pushNotification = (typeof cordova !== 'undefined') && cordova.require("pushwoosh-cordova-plugin.PushNotification");
			var pushNotification = (typeof cordova !== 'undefined') && cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");

			if (pushNotification) {
				$log.info("Plugin pushNotification loaded");

				pushNotification.onDeviceReady({ 
					projectid: googleProjectNumber,
					pw_appid: applicationCode}
				);

				//register for push notifications
				pushNotification.registerDevice(success, error);
				//clear the app badge
				pushNotification.setApplicationIconBadgeNumber(0);
			} else {
				$log.info("Plugin pushNotification NOT loaded");
			}
		}
	}
	
	function PushService($injector, $log) {

		var platform = window.cordova && window.cordova.platformId;

		$log.debug("Platform: " + platform);
		if (platform == "android") {
			return $injector.get('PushwooshAndroidImpl');
		} else {
			return $injector.get('PushwooshiOSImpl');
		}
	}
})();