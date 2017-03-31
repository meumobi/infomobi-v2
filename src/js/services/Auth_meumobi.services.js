(function() {
	'use strict';

	angular
	.module('meumobi.services.Auth', ['meumobi.services.Settings'])
	.factory('AuthService', AuthService);
		
	function AuthService($http, $rootScope, APP, $log, translateFilter, $injector, Devices, CONFIG, meuCloud, $exceptionHandler, $q) {
		var service = {};

		service.loadAuthToken = loadAuthToken;
		service.loadVisitor = loadVisitor;
		service.getVisitor = getVisitor;
		service.login = login;
		service.isAuthenticated = isAuthenticated;
		service.logout = logout;
    service.registerPush = registerPush;
 
		return service;
    
    function registerPush() {
      var push = $injector.get(CONFIG.PUSH.provider);
  		push.config(CONFIG.PUSH.googleProjectNumber, CONFIG.PUSH.appId);
    
  		var cb_push = {
  			register: {
  				success: function(pushIds){
  					$log.debug("Push Ids: " + angular.toJson(pushIds));

            if (pushIds && pushIds.token)
              Devices.setProperty('push_id', pushIds.token);
            if (pushIds && pushIds.uuid)
              Devices.setProperty('player_id', pushIds.uuid);
            
            push.sendTag('domain', $rootScope.visitor.site);
  				},
  				fail: function(){}
  			}
  		};
		
  		push.register(cb_push.register.success, cb_push.register.fail);
      Devices.save();
    }

		function login(user) {
      return $q(function(resolve, reject) {
        try {
    			var cb_login = {
    				signin: {
    					success: function(response){
    						if (response.data.error && response.data.error == "password expired") {
    							$http.defaults.headers.common['X-Visitor-Token'] = response.data.token;
    						} else {
    							loadAuthToken(response.data.token);
    						}
    						loadVisitor(response.data.visitor);
    						resolve(response);
    					},
    					error: function(response){
    						reject(response);
    					}
    				}
    			};

    			meuCloud.API.Login.signin(user)
          .then(cb_login.signin.success)
          .catch(cb_login.signin.error);
        } catch (e) {
          $exceptionHandler(e);
          reject(e);
        };
      });
		}
		
		function logout() {
			// Maybe we should clear rootScope and localstorage
			// To achieve it we should have a function to restore defaults config
			//$rootScope.authToken = {};

			/*
			for(var i=0; i < localStorage.length; i++){
				var propertyName = localStorage.key(i);
				$log.debug(  i + " : " + propertyName + " = " +
				localStorage.getItem(propertyName).substring(0, 10));
			}
			*/
			
			localStorage.removeItem("visitor");
			localStorage.removeItem("authToken");
			localStorage.removeItem("files");
			localStorage.removeItem("polls");
			localStorage.removeItem("performance");
			
			delete $rootScope.authToken;
			delete $rootScope.visitor;
			delete $rootScope.performance;
			delete $http.defaults.headers.common['X-Visitor-Token'];
      meuCloud.API.Config.setProperty('domain', null);
      var push = $injector.get(CONFIG.PUSH.provider);
      push.setSubscription(false);
		}
		
		function isAuthenticated() {
			var site = localStorage.hasOwnProperty("visitor") ? localStorage.visitor.site : null;
			return (localStorage.hasOwnProperty("authToken") || site)
		}

		function loadAuthToken(token) {
			$rootScope.authToken = token;
			localStorage.authToken = token;
			$http.defaults.headers.common['X-Visitor-Token'] = token;
		}

		function loadVisitor(visitor) {
			// TODO: How visitor could have not site property ?
			if (!visitor.hasOwnProperty("site")) {
				visitor.site = APP.DOMAINS["pt"];
			}
			$rootScope.visitor = visitor;
      meuCloud.API.Config.setProperty('domain', visitor.site);
			localStorage.visitor = JSON.stringify(visitor);
		}

		function getVisitor() {
			// If offline I'll use localStorage datas
			
			if (localStorage.hasOwnProperty("visitor")) {
				loadVisitor(JSON.parse(localStorage.visitor));
			}

			var cb_login = {
				get: {
					success: function(response) {
						loadVisitor(response.data);
					},
					error: function(response) {
						var msg = translateFilter("auth.get.Error");
						if (response.data && response.data.error) {
							msg += ": " + translateFilter("[API]: " + response.data.error);
						} else {
							msg += ": " + translateFilter("default.network.Error");
						}
						$log.debug(msg);
						$log.debug(response);
					} 
				}
			};
			
			meuCloud.API.Login.get()
      .then(cb_login.get.success)
      .catch(cb_login.get.error);
		}
	}
})();