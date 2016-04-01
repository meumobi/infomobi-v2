(function() {
	'use strict';

	angular
	.module('meumobi.services.Device', ['meumobi.services.Cordova'])
	.factory('DeviceService', DeviceService);
		
	function DeviceService(deviceReady, $rootScope, API, $log) {
		var service = {};
			
		service.save = save;
		service.clearSignature = clearSignature;
		service.loadDevice = loadDevice;
		service.getDownloadDir = getDownloadDir;
 
		return service;

		function getDownloadDir(done) {
			deviceReady(function() {
				var directory = null;
				if (device.platform == "Android") {
					directory = cordova.file.externalDataDirectory;
					$log.debug("[Android] Set download dir: " + directory)
				} else {
	        directory = cordova.file.dataDirectory;
					$log.debug("[iOS] Set download dir: " + directory);
				}
				done(directory);
			})
		}

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
			if (typeof(window.plugins) != "undefined") {
				if (typeof(AppVersion) !== 'undefined' && AppVersion != null) {
					deviceConfig.app_version = AppVersion.version;
					deviceConfig.app_build = AppVersion.build;
				}
			
				if (typeof(device) != "undefined" && device != null) {
					deviceConfig.model = device.model;
					deviceConfig.platform = device.platform;
					deviceConfig.platform_version = device.version;
					deviceConfig.manufacturer = device.manufacturer;
				}
			} else {
				// Running on Web Browser
				deviceConfig.model = navigator.userAgent;
			}
			
			$log.debug("Device Signature");
			$log.debug(deviceConfig);
			return deviceConfig;
		}
		
		function save(token) {
			$log.debug("DeviceService.save");
			var deviceSignature = getSignature();
			
			deviceReady(function() {
				var uniqueDeviceID = window.plugins && window.plugins.uniqueDeviceID;
				
				if (uniqueDeviceID) {
					uniqueDeviceID.get(
						function(uuid){
							deviceSignature.push_id = token;
							deviceSignature.uuid = uuid;
							$log.debug(deviceSignature);
							API.Devices.save(deviceSignature, success, error);
							loadDevice(deviceSignature);
						}, function(error){
							$rootScope.$apply(function(){
								throw new Error('Unable to retrieve uuid');
							});
						}
					);
				} else {
					loadDevice(deviceSignature);
				}	
			});
		}

		function loadDevice(device) {
			$rootScope.device = device;
			localStorage.device = JSON.stringify(device);
		}
	}
})();