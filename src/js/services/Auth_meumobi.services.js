(function() {
	'use strict';

	angular
	.module('meumobi.services.Auth', ['meumobi.api', 'meumobi.services.Settings'])
	.factory('AuthService', AuthService);
		
	function AuthService($http, $rootScope, API, APP, $log, translateFilter, $injector, DeviceService, CONFIG) {
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
  					DeviceService.save(pushIds);
  				},
  				error: function(){
  					DeviceService.save(null);
  				}
  			}
  		};
		
  		push.register(cb_push.register.success, cb_push.register.error);
    }

		function login(user, success, error) {
			var cb_login = {
				signin: {
					success: function(response){
						if (response.data.error && response.data.error == "password expired") {
							$http.defaults.headers.common['X-Visitor-Token'] = response.data.token;
						} else {
							loadAuthToken(response.data.token);
						}
						loadVisitor(response.data.visitor);
						success(response);
					},
					error: function(response){
						error(response);
					}
				}
			};

			API.Login.signin(user, cb_login.signin.success, cb_login.signin.error);
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
			localStorage.removeItem("news");
			localStorage.removeItem("files");
			localStorage.removeItem("polls");
			localStorage.removeItem("performance");
			
			delete $rootScope.news;
			delete $rootScope.authToken;
			delete $rootScope.visitor;
			delete $rootScope.performance;
			delete $http.defaults.headers.common['X-Visitor-Token'];
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
			
			API.Login.get(cb_login.get.success, cb_login.get.error);
		}
	}
})();