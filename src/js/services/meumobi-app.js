'use strict';

angular.module('meumobi.app', ['infoboxApp.services.Cordova','meumobi.utils'])

.factory('AppInfo', function(deviceReady, AppUtils, $rootScope) {
	var app = {
		service : {
			Device : {
				isOnline : function(){return false;},
				information: function(){return "none";}
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
					information : function(){
						var informations;console.log('heyyy') 
						if(window.cordova){
							informations = {
								"uuid" : device.uuid,
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
						return informations;
					}
				}
			}
		});
		
	});

	return app;
})

.factory('AppFunc', function(deviceReady){
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
  }
};

	return app;
})