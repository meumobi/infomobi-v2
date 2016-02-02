(function() {
	'use strict';

	angular
	.module('meumobi.appInfo', ['meumobi.services.Cordova'])
	.factory('AppInfo', AppInfo)
	
	function AppInfo(deviceReady, $rootScope) {
		var service = {};
		
		service.isOnline = isOnline;
		service.clearRestrictedDatas = clearRestrictedDatas;
		
		return service;
		
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

		function clearRestrictedDatas() {
			// Maybe we should clear rootScope and localstorage
			// To achieve it we should have a function to restore defaults config
			//$rootScope.authToken = {};
			localStorage.removeItem("visitor");
			localStorage.removeItem("authToken");
			delete $rootScope.news;
			delete $rootScope.authToken;
			delete $rootScope.visitor;
			localStorage.removeItem("news");
			localStorage.removeItem("files");
		}
	}
	
	angular
	.module('meumobi.appFunc', ['meumobi.services.Cordova', 'meumobi.settings', 'meumobi.services.Push'])
	.factory('AppFunc', AppFunc);

	function AppFunc(deviceReady, PushService, $rootScope, $location, $window, $route, APP, API, CONFIG, $log) {
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

				confirm: function(message, callback, title) {
					title = (title != undefined) ? title : 'Confirm';
					var callbacker = function (buttonIndex){
						var val = (buttonIndex == 1);
						callback(val);
					}
					if (navigator.notification) {
						
						navigator.notification.confirm(
							message,
							callbacker, //callback method...
							title
							//buttonLabels: Array of strings specifying button labels. (Array) (Optional, defaults to [OK,Cancel])
						);
					} else {
						var r = confirm(title);
						callback(r);
					}
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
				getImage: function(path){
					/*
					if(localStorage["image_"+id]){
					return localStorage["image_"+id];
					}
					*/
					return APP.cdnUrl + path;
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
							PushService.config( CONFIG.PUSHWOOSH.googleProjectNumber, CONFIG.PUSHWOOSH.applicationCode);
							PushService.register(
								function(token) {
									$log.info("Device token: " + token);
									that.saveDevice(token);
								}, function(status) {
									$log.warn('failed to register : ' + JSON.stringify(status));
								}
							);
							that.statusBar();
							that.hideSplashScreen();
						});
						// that.receiveNotification();
						that.backButton();
					},
						backButton: function() {
							document.addEventListener("backbutton", onBackKeyDown, false);

							function onBackKeyDown() {
								// alert("Back");
								$rootScope.go(window.history.back(), 'slide-right');
							}
						},
						saveDevice: function(token) {
							deviceReady(function() {
								var uniqueDeviceID = window.plugins && window.plugins.uniqueDeviceID;
								if (uniqueDeviceID) {
									uniqueDeviceID.get(
										function(uuid) {
											$log.info("UUID : " + uuid);
											$log.info("Device token : " + token);
											API.Devices.save({"push_id": token, "uuid": uuid }, 
											function(response) {
												$log.info(response);
											}, function(error) {
												$log.error(error);
											});
										}, function(error) {
											$log.warn(error)
										}
									);
								}
							});
						},
						hideSplashScreen: function() {
							if (navigator.splashscreen) {
								navigator.splashscreen.hide();
							}
						},
						statusBar: function() {
							if (typeof StatusBar !== 'undefined') {
								StatusBar.overlaysWebView(false);
								StatusBar.styleLightContent();
								StatusBar.backgroundColorByName("black");	
							}
						},
						receiveNotification: function() {
							document.addEventListener('push-notification', function(event) {
								$route.reload();
							});
						}
					}
				};
				return app;
			}
		})();

