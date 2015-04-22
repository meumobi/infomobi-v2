(function() {
	'use strict';

	angular
	.module('meumobi.auth', [])
	.factory('AuthService', AuthService);
		
	function AuthService($http, $rootScope, API) {
		var service = {};

		service.loadAuthToken = loadAuthToken;
		service.loadVisitor = loadVisitor;
		service.getVisitor = getVisitor;
 
		return service;


		
		function login() {
			
		}
		
		function success() {
			
		}
		
		function error() {
			
		}
		
		function loadAuthToken(token) {
			$rootScope.authToken = token;
			localStorage.authToken = token;
			$http.defaults.headers.common['X-Visitor-Token'] = token;
		}

		function loadVisitor(visitor) {
			$rootScope.visitor = visitor;
			localStorage.visitor = JSON.stringify(visitor);
		}

		function getVisitor() {
			API.Login.get(
				function(data, status) {
					console.log("Update credentials: ");
					console.log(data);
					loadVisitor(data);
				},
				function(data, status) {
					if (localStorage.hasOwnProperty("visitor")) {
						$rootScope.visitor = loadVisitor(localStorage.visitor);
					}
				}
			);
		}
	}
})();