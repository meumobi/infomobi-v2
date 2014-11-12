angular.module('services.Analytics', [])

.service('analytics', ['$rootScope', '$window', '$location', 
	function($rootScope, $window, $location) {
		var send = function(evt, data) {
		  ga('send', evt, data);
		}
	}]);