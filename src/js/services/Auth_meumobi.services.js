(function() {
	'use strict';

	angular
	.module('meumobi.services.Auth', ['meumobi.api', 'meumobi.services.Settings'])
	.factory('AuthService', AuthService);
		
	function AuthService($http, $rootScope, API, APP, $log) {
		var service = {};

		service.loadAuthToken = loadAuthToken;
		service.loadVisitor = loadVisitor;
		service.getVisitor = getVisitor;
		service.login = login;
		service.isAuthenticated = isAuthenticated;
		service.logout = logout;
 
		return service;

		function login(user, success, error) {
			var req = {
				success: function(data, status) {
					if (data.error && data.error == "password expired") {
						$http.defaults.headers.common['X-Visitor-Token'] = data.token;
					} else {
						loadAuthToken(data.token);
					}
					loadVisitor(data.visitor);
					console.log(data);
					success(data);
				},
				error: function(data, status) {
					error(data);
				}
			};

			API.Login.signin(user, req.success, req.error);
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
			var req = {
				success: function(data, status) {
					loadVisitor(data);
				},
				error: function(data, status) {
				} 
			};
			
			API.Login.get(req.success, req.error);
		}
	}
})();