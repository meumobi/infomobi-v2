(function() {
	'use strict';

	angular
	.module('meumobi.auth', [])
	.factory('AuthService', AuthService);
		
	function AuthService($http, $rootScope) {
		var service = {};
			
		//service.Login = Login;
		service.setCredentials = setCredentials;
		service.clearCredentials = clearCredentials;
 
		return service;

		function clearCredentials() {
			$rootScope.user = {};
			localStorage.removeItem("user");
			delete $http.defaults.headers.common['X-Visitor-Token']
		};
		
		function setCredentials(visitor, token) {
			$rootScope.user = {
				"visitor": visitor,
				"token": token
			};
			localStorage.user = JSON.stringify($rootScope.user);
			$http.defaults.headers.common['X-Visitor-Token'] = token;
		}
	}
})();