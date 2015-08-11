(function() {
	'use strict';

	angular
	.module('meumobi.services.Device', ['meumobi.Cordova', 'meumobi.utils'])
	.factory('DeviceService', DeviceService);
		
	function DeviceService(deviceReady, AppUtils, $rootScope, API) {
		var service = {};
			
		service.updateSignature = updateSignature;
		service.clearSignature = clearSignature;
		service.loadDevice = loadDevice;
 
		return service;

		function clearSignature() {
			$rootScope.device = {};
			localStorage.removeItem("device");
		}
		
		function success(data, status) {
			console.log("[DeviceService:updateSignature]: success " + data);
		}
		
		function error(data, status) {
			console.log("[DeviceService:updateSignature]: error " + data.error);
		}
		
		function getSignature() {
			var deviceConfig = {};
			// Only save device from App, not webapp, because we use uuid as primary key
			if (typeof(device) != "undefined" && device != null && typeof(window.plugins) != "undefined" && window.plugins.uniqueDeviceID) {
				deviceConfig.model = device.model;
				deviceConfig.platform = device.platform;
				deviceConfig.version = device.version;
				deviceConfig.app_version = AppVersion.version;
				deviceConfig.app_build = AppVersion.build;
				deviceConfig.push_id = localStorage.hasOwnProperty('push_id') ? localStorage['push_id'] : null;
			}
			return deviceConfig;
		}
		
		function updateSignature() {
			deviceReady(function() {
				
				var signature = getSignature();
				console.log("Updating Signature");
				
				// uuid is the primary key of Device, so if not available no need to PUT it on API
				if (typeof(window.plugins) != "undefined" && window.plugins.uniqueDeviceID)
				{
					window.plugins.uniqueDeviceID.get(
						function(uuid){

							signature.uuid = uuid;
							// if 1st connection then POST (device) else PUT (update)
							if (!localStorage.hasOwnProperty("device")) {
								API.Login.device(signature, success, error);
							} else {
								API.Login.update(signature, success, error);
							}

							//API.Login.update(signature, success, error);
							loadDevice(signature);
						}, function(error){
							$rootScope.$apply(function(){
								throw new Error('Unable to retrieve uuid');
							});
						}
					);
				} else {
					signature.uuid = null;
					loadDevice(signature);
				}	
			});
		}
		
		function loadDevice(device) {
			$rootScope.device = device;
			localStorage.device = JSON.stringify(device);
		}
	}
})();