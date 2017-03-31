(function() {
	'use strict';

	angular
	.module('meumobi.services.Utils', ['meumobi.services.Cordova', 'ngMeumobi.Utils.filters'])
	.factory('UtilsService', ['deviceReady', 'striptagsFilter', 'br2nlFilter', 'translateFilter', '$log', '$location', UtilsService]);

	function UtilsService(deviceReady, striptags, br2nl, translate, $log, $location) {
		var service = {};
		
		service.isOnline = isOnline;
		service.statusBar = statusBar;
		service.openInAppBrowser = openInAppBrowser;
		service.nativeFlipTransition = nativeFlipTransition;
		service.isCordovaApp = isCordovaApp;
 
		return service;

		/* TODO: use a dynamic var for name of transition */
		
		function nativeFlipTransition(path) {
			var options = {
				"direction" : "right", // 'left|right|up|down', default 'left' (which is like 'next')
				"duration" : 350, // in milliseconds (ms), default 400
				"href" : path,
				"slowdownfactor": 3,
				"fixedPixelsTop": 50,
				"fixedPixelsBottom": 50,
			};

			deviceReady(function() {
				var nativepagetransitions = window.plugins && window.plugins.nativepagetransitions;
				if (nativepagetransitions) {
					nativepagetransitions.flip(options,
						function(msg) {
							$log.info("[nativeFlipTransition] Success: " + msg) // called when the animation has finished
						},
						function(msg) {
							$log.debug("[nativeFlipTransition]  Error: " + msg) // called in case you pass in weird values
						}
					);
				} else {
					$location.path(options.href.slice(1));
				}
			});
		}
		
		function openInAppBrowser(url, target, options) {
			deviceReady(function() {
				if (typeof cordova !== "undefined") {
					var iab = cordova && cordova.InAppBrowser.open;
					if (iab) {
						window.open = iab;
					}
				}
        $log.debug(url);
				/*
					The target in which to load the URL:
					_self: Opens in the Cordova WebView if the URL is in the white list, otherwise it opens in the InAppBrowser.
					_blank: Opens in the InAppBrowser.
					_system: Opens in the system's web browser.
				*/
				target = ImgCache.helpers.isCordovaIOS() ? "_blank" : "_system";
				options = options || "location=yes,enableViewportScale=yes";
				var ref = window.open(url, target, options);
				ref.addEventListener('loadstart', 
					function() {
						/* 
							Exists a default spinner on iOS but not for Android
							See: https://github.com/apache/cordova-plugin-inappbrowser/pull/89
						*/
						spinner.show();
					}, false);
				ref.addEventListener('loadstop', 
					function() {
						spinner.hide();
					}, false);
			})
		};
		
		function statusBar() {
			deviceReady(function() {
				if (typeof StatusBar !== 'undefined') {
					StatusBar.overlaysWebView(false);
					StatusBar.styleLightContent();
					StatusBar.backgroundColorByName("black");	
				}
			});
		}
		
		function networkState() {
			var networkState = navigator.connection.type;
			
			var states = {};
			
			states[Connection.UNKNOWN] = false;
			states[Connection.ETHERNET] = true;
			states[Connection.WIFI] = true;
			states[Connection.CELL_2G] = true;
			states[Connection.CELL_3G] = true;
			states[Connection.CELL_4G] = true;
			states[Connection.CELL] = true;
			states[Connection.NONE] = false;
			
			return states[networkState];
		}

		function isOnline(done) {
			deviceReady(function() {
				var connection = navigator.connection && navigator.connection.type;
				if (connection) {
					console.log("navigator.connection");
					done(networkState());
				} else {
					console.log("navigator.onLine");
					done(navigator.onLine);
				}
			})
		}
	
		/*
			http://damien.antipa.at/blog/2014/02/08/3-ways-to-detect-that-your-application-is-running-in-cordova-slash-phonegap/
		*/
		function isCordovaApp() {
			var isCordovaApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
			$log.debug("isCordovaApp ? " + isCordovaApp);
			return isCordovaApp;
		}
	}
})();
