(function() {
	'use strict';

	angular
	.module('meumobi.services.Device', ['meumobi.Cordova', 'meumobi.utils'])
	.factory('DeviceService', DeviceService);
		
	function DeviceService(deviceReady, AppUtils, $rootScope) {
		var service = {};
			
		service.setSignature = setSignature;
		service.clearSignature = clearSignature;
 
		return service;

		function clearSignature() {
			$rootScope.device = {};
			localStorage.removeItem("device");
		}
		
		function setSignature() {
			deviceReady(function() {
				if (window.cordova) {
					$rootScope.device = {
						"model": device.model,
						"platform": device.platform,
						"version": device.version,
						"uuid": ""
					};
					uniqueDeviceID(function(uuid) {
						$rootScope.device.uuid = uuid;
						localStorage.device = JSON.stringify($rootScope.device);
						console.log("uniqueDeviceID" + $rootScope.device);
					});
				}
			});
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