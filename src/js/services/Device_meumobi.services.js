(function() {
	'use strict';

	angular
	.module('meumobi.services.Device', ['meumobi.Cordova', 'meumobi.utils', 'meumobi.settings'])
	.factory('DeviceService', DeviceService);
		
	function DeviceService(deviceReady, AppUtils, $rootScope, API, APP) {
		var service = {};
			
		service.getSignature = getSignature;
		service.clearSignature = clearSignature;
		service.loadDevice = loadDevice;
 
		return service;

		function clearSignature() {
			$rootScope.device = {};
			localStorage.removeItem("device");
		}
		
		function success(data, status) {
			console.log("API.Login.device - success: " + data);
		}
		
		function error(data, status) {
			console.log("API.Login.device - error: " + data);
		}
				
		function getSignature(key) {
			var deviceConfig = {
				"model": null,
				"platform": null,
				"version": null,
				"app_version": APP.version,
				"push_id": null,
				"uuid": null
			};
			
			deviceReady(function() {
				if (window.cordova) {
					console.log("set Device Signature: [BEGIN]");
					deviceConfig.model = device.model;
					deviceConfig.platform = device.platform;
					deviceConfig.version = device.version;
					deviceConfig.push_id = localStorage.hasOwnProperty('push_id') ? localStorage['push_id'] : null;

					// uuid is the primary key of Device, so if not available no need to PUT it on API
					uniqueDeviceID(function(uuid) {
						deviceConfig.uuid = uuid;

						// if 1st connection then POST (device) else PUT (update)
						if (!localStorage.hasOwnProperty("device")) {
							API.Login.device(deviceConfig, success, error);
						} else {
							API.Login.update(deviceConfig, success, error);
						}
						loadDevice(deviceConfig);
					});
					console.log("set Device Signature: [END]");
				} else {
					loadDevice(deviceConfig);
				}
			});
		}
		
		function loadDevice(device) {
			$rootScope.device = device;
			localStorage.device = JSON.stringify(device);
		}
		
		function uniqueDeviceID(done) {
			deviceReady(function() {
				if (window.plugins && window.plugins.uniqueDeviceID) {
					window.plugins.uniqueDeviceID.get(function(uuid){
						$rootScope.$apply(function(){
							done(uuid);
						});
					}, function(error){
						$rootScope.$apply(function(){
							throw new Error('Unable to retrieve uuid');
						});
					});
				}
			});
		}
	}
})();