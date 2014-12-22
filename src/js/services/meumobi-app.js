'use strict';

angular.module('meumobi.appInfo', ['infoboxApp.services.Cordova','meumobi.utils'])

.factory('AppInfo', function(deviceReady, AppUtils, $rootScope) {
	var app = {
		service : {
			Device : {
				isOnline : function(){return false;},
				information: function(){return "none";},
				uniqueDeviceID:function(a){a()}
			}
		}
	};
	
	deviceReady(function(){
		AppUtils.safeApply($rootScope, function(){
			app.service = {
				Device : {
					isOnline : function(){
						var connection = false;
						if(navigator.connection){
							var networkState = navigator.connection.type;

						    var states = {};
						    states[Connection.UNKNOWN]  = false;
						    states[Connection.ETHERNET] = true;
						    states[Connection.WIFI]     = true;
						    states[Connection.CELL_2G]  = true;
						    states[Connection.CELL_3G]  = true;
						    states[Connection.CELL_4G]  = true;
						    states[Connection.CELL]     = true;
						    states[Connection.NONE]     = false;

						    connection = states[networkState] ? true : false;
						}else{
							connection = navigator.onLine;
						}
						return connection;
					},
					information : function(callback){
						var informations; 
						app.service.Device.uniqueDeviceID(
							function(uuid){
								if(window.cordova){
									informations = {
										"uuid" : uuid,
										"model" : device.model,
										"platform" : device.platform,
										"version" : device.version
									}
								}else{
									informations = {
										"uuid" : "1234567890",
										"model" : "Galaxy S5",
										"platform" : "Android",
										"version" : "4.4"
									}
								}
								callback(informations);
							},
							function(error){
								callback({});
								console.log(error);
							}
						);
						
					},
					uniqueDeviceID : function(success, error){
						if(window.plugins && window.plugins.uniqueDeviceID){
							window.plugins.uniqueDeviceID.get(success, error);
						}else{
							success("1234567890");
						}
					}
				}
			}
		});
		
	});

	return app;
});


angular.module('meumobi.appFunc', ['infoboxApp.services.Cordova'])
.factory('AppFunc', function(deviceReady, $rootScope, $location, $window, $route){
	var app = {
		toast : function(message, success, fail){
			if (window.plugins && window.plugins.toast) {
				window.plugins.toast.showLongBottom(message, 
					function(resp){
						if(success){
							success(resp);
						}
					},
					function(err){
						if(fail){
							fail(err);
						}
					}
				);
			} else {
				alert(message);
			}
		},
		transition : function (path, pageAnimationClass) {
	        if (typeof(pageAnimationClass) === undefined) { // Use a default, your choice
	            $rootScope.pageAnimationClass = 'crossFade';
	        }else { // Use the specified animation
	            $rootScope.pageAnimationClass = pageAnimationClass;
	        }

	        if (path === 'back') { // Allow a 'back' keyword to go to previous page
	            $window.history.back();
	        }else { // Go to the specified path
	            $location.path(path);
	        }

	    },
	  	initPushwoosh: function() {
		    deviceReady(function(){
		      if (window.plugins && window.plugins.pushNotification){
		      	if(device.platform == "Android") {
		      		registerPushwooshAndroid();
		      	}
		        if (device.platform == "iPhone" || device.platform == "iOS") {
		          registerPushwooshIOS();
		        }
		      }
		    });
	  	},
	  	startApp : {
	  		executeAll : function(){
	  			var that = this;
  		  		deviceReady(function(){
  		  			that.receiveNotification();
  		  			that.hideSplashScreen();
  		  			console.log("cordova app started");
  		  		});
  		  		that.backButton();
  		  	},
  		  	backButton : function(){
				document.addEventListener("backbutton", function(){
			    	if($location.url().indexof("/show")!=-1){
			    		$rootScope.go('back','slideRight');		
			    	}
			    }, false);
  		  	},
  		  	hideSplashScreen : function(){
  		  		if(navigator.splashScreen){
  		  			navigator.splashscreen.hide();
  		  		}
  		  	},
  		  	receiveNotification: function(){
  		  		document.addEventListener('push-notification', function(event) {
				 
				    //alert(JSON.stringify(event.notification));
				    $route.reload();
			    	///TODO:  Sync news
				});
  		  	}
		}
	};


	return app;
});