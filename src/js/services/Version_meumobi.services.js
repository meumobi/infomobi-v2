(function() {
	'use strict';

	angular
	.module('meumobi.services.Version', ['meumobi.services.Cordova'])
	.factory('VersionService', VersionService);
		
	function VersionService(deviceReady, $rootScope, $http, CONFIG, UtilsService) {
		var service = {};
		var config = {
			path: "infomobi/app.apk"
		};

		var url = "https://build.phonegap.com";
		var platforms = {};
		platforms["Android"] = "android";
		platforms["iOS"] = "ios";
		platforms["winCE"] = "winphone";

		service.getLatestAppSignature = getLatestAppSignature;
		//service.promptIfNewVersion = promptIfNewVersion;

		return service;

		function buildUrl() {
			var path = "/api/v1/apps/" + CONFIG.BUILD.id;
			return url + path + "?auth_token=" + CONFIG.BUILD.auth_token + "&callback=JSON_CALLBACK";
		}

		function promptForUpdateAndroid(entry) {
			//cordova.plugins.fileOpener2.open(
			//	entry.toURL(), 
			//	'application/vnd.android.package-archive');
			window.plugins.webintent.startActivity({
				action: window.plugins.webintent.ACTION_VIEW,
				url: entry.toURL(),
				type: 'application/vnd.android.package-archive'
			}, function () {
			}, function () {
				UtilsService.toast("Install Failed: try again later");
				console.log("Failed to open URL via Android Intent. URL: " + entry.toURL);
			});
		}

		function promptForInstall(version) {
			UtilsService.confirm("Uma nova versão disponivel: " + version, updateAndroidAPK);
		}

		function downloadLatestAndroidBuild(url) {
			var downloadAPK = {
				success: function(entry) {
					UtilsService.confirm("Uma nova versão esta disponivel, deseja atualizar agora ?", 
					function(confirmed) {
						if (confirmed) {
							console.log("Install Confirmed");
							promptForUpdateAndroid(entry)
						}
						else {
							console.log("Install Rejected");
							$rootScope.versionServiceIsEnabled = false;
						}
					});
				},
				error: function(error) {
					console.log("download error source: " + error.source);
					console.log("download error target: " + error.target);
					console.log("download error message: " + JSON.parse(error.body).error);
				}
			}
			
			console.log("Download Initiate path: " + url);
			var fileTransfer = new FileTransfer();
			fileTransfer.download(
				encodeURI(url),
				cordova.file.externalRootDirectory + config.path,
				downloadAPK.success, 
				downloadAPK.error,
				true
			);
				
        fileTransfer.onprogress = function(progressEvent) {
          	$rootScope.$emit('version.progress', progressEvent);
        };
		}
		
		function downloadLatestIOSBuild(url) {
			
			UtilsService.confirm("Uma nova versão esta disponivel, deseja atualizar agora ?", 
			function(confirmed) {
				if (confirmed) {
					console.log("Install Confirmed");
					window.open(url, '_system');
				}
				else {
					console.log("Install Rejected");
					$rootScope.versionServiceIsEnabled = false;
				}
			});
		}
		
		function versionIsNew(version) {
			// return (AppVersion.version != version);
			return ($rootScope.app_version.toLowerCase() != version.toLowerCase());
		}

		function getLatestAppSignature() {
			deviceReady(function(){
				if (typeof(device) != "undefined" && device != null && typeof AppVersion !== 'undefined') {
					$rootScope.app_version = AppVersion.version;
				
					console.log("[VersionService]: calling PhoneGap Build API - " + buildUrl());
					$http.jsonp(buildUrl())
					.success(success)
					.error(error);
				}
			});
		}

		function success(data, status) {
			console.log("[VersionService:getLatestAppVersion]: success");
			console.log(data);
			var platform = platforms[device.platform];
			// var platform = platforms["Android"];
			console.log("Platform: " + platform);
			var path = data.download[platform];
			var downloadUrl = url + path + "?auth_token=" + CONFIG.BUILD.auth_token;
			if (versionIsNew(data.version) && path && platform === "android") {
				downloadLatestAndroidBuild(downloadUrl);
			} else if (versionIsNew(data.version) && platform === "ios") {
				console.log("[VersionService]: is iOS");
				var installUrl = url + "/apps/" + CONFIG.BUILD.id + "/install";
				downloadLatestIOSBuild(installUrl);
			}
		}
		
		function error(data, status) {
			console.log("VersionService:getLatestAppVersion]: error " + data.error);
		}
	}
})();