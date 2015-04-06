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
			localStorage.clear("user");
			delete $http.defaults.headers.common['X-Visitor-Token']
		};
		
		function setCredentials(mail, token) {
			$rootScope.user = {
				"mail": mail,
				"token": token
			};
			localStorage.user = $rootScope.user;
			$http.defaults.headers.common['X-Visitor-Token'] = token;
		}
	}
})();