(function() {
	'use strict';

	angular
	.module('meumobi.services.Device', ['meumobi.services.Cordova'])
	.factory('DeviceService', DeviceService);
		
	function DeviceService(deviceReady, $rootScope, API, $log, $exceptionHandler) {
		var service = {};
			
		service.save = save;
		service.getUniqueDeviceID = getUniqueDeviceID;
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

		function getUniqueDeviceID(success, fail) {
			try {
				deviceReady(function() {
					var uniqueDeviceID = window.plugins && window.plugins.uniqueDeviceID;
					if (uniqueDeviceID) {
						var cb_uniqueDeviceID = {
							get: {
								success: function(uuid) {
									success(uuid);
								},
								error: function() {
									$rootScope.$apply(function(){
										throw new Error('Unable to retrieve uuid');
									});
								}
							}
						}
						uniqueDeviceID.get(cb_uniqueDeviceID.get.success, cb_uniqueDeviceID.get.error);
					} else {
						throw new Error('Missing uniqueDeviceID plugin');
					}
				});
			} catch (error) {
				fail();
				$exceptionHandler(error);
			}
		}
		
		function save(pushIds) {
			try {
				var config = getDeviceConfig();
        if (pushIds && pushIds.token)
            config.push_id = pushIds.token;
        if (pushIds && pushIds.uuid)
            config.player_id = pushIds.uuid;
				/*
					Save it to identify first connection: if localStorage.device NOT exists then 1st connection is true
				*/
				localStorage.device = JSON.stringify(config);
				var cb_devices = {
					save: {
						success: function(response) {
							$log.debug("Device successfully saved");
							$log.debug(response);
						},
						error: function(response) {
							$rootScope.$apply(function(){
								throw new Error("Device NOT saved");
							});
							$log.debug(reponse);
						}
					}
				}
				var cb_uniqueDeviceID = {
					get: {
						success: function(uuid) {
							config.uuid = uuid;
							$log.debug(config);
							API.Devices.save(config, cb_devices.save.success, cb_devices.save.error);
						},
						error: function() {}
					}
				}
				getUniqueDeviceID(cb_uniqueDeviceID.get.success, cb_uniqueDeviceID.get.error)
			} catch (error) {
				$exceptionHandler(error);
			}
		}

		function getDeviceConfig() {
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

			return deviceConfig;
		}
	}
})();
