(function() {
	'use strict';

	angular
	.module('meumobi.services.Device', ['meumobi.services.Cordova'])
	.factory('DeviceService', DeviceService);
		
	function DeviceService(deviceReady, $rootScope, API, $log, $exceptionHandler) {
		var service = {};
			
		service.save = save;
		service.clearSignature = clearSignature;
		service.loadDevice = loadDevice;
		service.getDownloadDir = getDownloadDir;
 
		return service;

		function getDownloadDir(done) {
			try {
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
			} catch (error) {
				$exceptionHandler(error);
			}
		}

		function clearSignature() {
			$rootScope.device = {};
			localStorage.removeItem("device");
		}

		function save(token, success) {
			try {
				var device = getSignature();
			
				deviceReady(function() {
					var uniqueDeviceID = window.plugins && window.plugins.uniqueDeviceID;
				
					if (uniqueDeviceID) {
						uniqueDeviceID.get(
							function(uuid){
								// device = getSignature();
								device.push_id = token;
								device.uuid = uuid;
								success(device);
							}, function(error){
								$rootScope.$apply(function(){
									throw new Error('Unable to retrieve uuid');
								});
							}
						);
					} else {
						success(device);
						throw new Error('Missing uniqueDeviceID plugin');
					}
				});
			} catch (error) {
				$exceptionHandler(error);
			}
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
			/*
				Devices Callbacks
			*/
			var cb_devices = {
				save: {
					success: function(response) {
						$log.debug("[DeviceService:updateSignature]: success ");
						$log.debug(response);
					},
					error: function(response) {
						var msg = translateFilter("devices.save.Error");
						if (response.data && response.data.error) {
							msg += translateFilter("[API]: " + response.data.error);
						} else {
							msg += translateFilter("default.network.Error");
						}
						// UtilsService.toast(msg);
						$log.debug(msg)
					}
				}
			};
			
			deviceReady(function() {
				var uniqueDeviceID = window.plugins && window.plugins.uniqueDeviceID;
				
				if (uniqueDeviceID) {
					uniqueDeviceID.get(
						function(uuid){
							if (token != 'undefined')
								deviceSignature.push_id = token;
							deviceSignature.uuid = uuid;
							$log.debug(deviceSignature);
							API.Devices.save(deviceSignature, cb_devices.save.success, cb_devices.save.error);
							loadDevice(deviceSignature);
						}, function(error){
							$rootScope.$apply(function(){
								throw new Error('Unable to retrieve uuid');
							});
						}
					);
				} else {
					$log.debug("uniqueDeviceID Not loaded");
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
