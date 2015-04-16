(function() {
	'use strict';

	angular
	.module('meumobi.appInfo', ['meumobi.Cordova'])
	.factory('AppInfo', AppInfo)
	
	function AppInfo(deviceReady, $rootScope) {
		var services = {};
		
		services.isOnline = isOnline;
		
		return services;
		
		function isConnectionOnline(type) {
			var states = {};
			states[Connection.UNKNOWN] = false;
			states[Connection.ETHERNET] = true;
			states[Connection.WIFI] = true;
			states[Connection.CELL_2G] = true;
			states[Connection.CELL_3G] = true;
			states[Connection.CELL_4G] = true;
			states[Connection.CELL] = true;
			states[Connection.NONE] = false;
			var connection = states[type] ? true : false;	
			
			return connection;
		}
		
		function isOnline(done) {
			deviceReady(function() {
				var connection = false;
				if (navigator.connection) {
					console.log("navigator.connection: [BEGIN]" );
					var networkState = navigator.connection.type;
					connection = isConnectionOnline(networkState);
					console.log("navigator.connection: " + connection);
					done(connection);
				} else {
					connection = navigator.onLine;
					done(connection);
				}
			});
		}
	}
	
	angular
	.module('meumobi.appFunc', ['meumobi.Cordova'])
	.factory('AppFunc', AppFunc);

	function AppFunc(deviceReady, $rootScope, $location, $window, $route, SITE, API, INFOBOXAPP) {
		var app = {
			isOnline: function() {
				deviceReady(function() {
					var connection = false;
					if (navigator.connection) {
						var networkState = navigator.connection.type;
						return true;
					} else {
						console.log("navigator.onLine: " + navigator.onLine);
						connection = navigator.onLine;
					}
					return connection;
				});
			},
			toast: function(message, success, fail) {
				deviceReady(function() {
					if (window.plugins && window.plugins.toast) {
						window.plugins.toast.showLongBottom(message,
							function(resp) {
								if (success) {
									success(resp);
								}
							},
							function(err) {
								if (fail) {
									fail(err);
								}
							}
						);
					} else {
						alert(message);
					}
				});
			},
			transition: function(path, pageAnimationClass) {
				if (typeof(pageAnimationClass) === undefined) { // Use a default, your choice
					$rootScope.pageAnimationClass = 'crossFade';
				} else { // Use the specified animation
					$rootScope.pageAnimationClass = pageAnimationClass;
				}
				$location.path(path);
			},
			getImage: function(path){
				/*
				if(localStorage["image_"+id]){
				return localStorage["image_"+id];
				}
				*/
				return SITE.SRC_URL + path;
			},
			initPushwoosh: function() {
				deviceReady(function() {
					if (window.plugins && window.plugins.pushNotification) {
						if (device.platform == "Android") {
							registerPushwooshAndroid();
						}
						if (device.platform == "iPhone" || device.platform == "iOS") {
							registerPushwooshIOS();
						}
					}
				});
			},
			eraseNotifications: function() {
				deviceReady(function() {
					if (window.plugins && window.plugins.pushNotification) {
						var push = window.plugins.pushNotification;
						push.setApplicationIconBadgeNumber(0);
					} else {
						console.log("There are no notification support.");
					}
				});
			},
			startApp: {
				executeAll: function() {
					var that = this;
					//that.backButton();
					deviceReady(function() {
						that.hideSplashScreen();
						app.initPushwoosh();
						that.verifyVersion();
					});
					that.receiveNotification();
					//that.backButton();
				},
				/*			backButton: function() {
					document.addEventListener("backbutton", function() {
					alert("Back");
					$window.history.back();
					//$rootScope.go(window.history.back(), 'slideRight');
					}, false);
					},*/
					hideSplashScreen: function() {
						if (navigator.splashscreen) {
							console.log('Hide splash screen');
							navigator.splashscreen.hide();
						}
					},
					receiveNotification: function() {
						document.addEventListener('push-notification', function(event) {
							$route.reload();
						});
					},
					verifyVersion: function() {
						var device = localStorage.device ? JSON.parse(localStorage['device']) : false;
						if (device && device.app_version != INFOBOXAPP.VERSION) {
							device.app_version = INFOBOXAPP.VERSION;
							localStorage['device'] = JSON.stringify(device);
							API.Login.update(device,
								function(resp) {
									console.log(resp);
								},
								function(err) {
									console.log(err);
								}
							);
						}
					}
				}
			};
			return app;
		}
	})();

