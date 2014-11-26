'use strict';

angular.module('meumobi.app', [])

.factory('AppInfo', function() {
	
	var app = {
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
			}
		}
	}
	return app;
})

.factory('AppFunc', function(){
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
		}
	}
	return app;
})