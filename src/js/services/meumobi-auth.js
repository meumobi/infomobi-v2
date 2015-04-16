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
		service.updateAuthToken = updateAuthToken;
 
		return service;

		function clearCredentials() {
			// Maybe we should clear rootScope and localstorage
			// To achieve it we should have a function to restore defaults config
			$rootScope.user = {};
			localStorage.removeItem("user");
			$rootScope.news = {};
			localStorage.removeItem("news");
			localStorage.removeItem("files");
			delete $http.defaults.headers.common['X-Visitor-Token']
		}
		
		function updateAuthToken(token) {
			$rootScope.user.token = token;
			localStorage.user = JSON.stringify($rootScope.user);
			$http.defaults.headers.common['X-Visitor-Token'] = token;
		}

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