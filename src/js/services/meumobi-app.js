(function() {
	'use strict';

	angular
	.module('meumobi.appFunc', ['meumobi.services.Cordova', 'meumobi.settings', 'meumobi.services.Push'])
	.factory('AppFunc', AppFunc);

	function AppFunc(deviceReady, PushService, $rootScope, $location, $window, $route, APP, API, CONFIG, $log, AuthService) {
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
						if (AuthService.isAuthenticated()) {
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
							});
						}
						that.statusBar();
						that.hideSplashScreen();
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

