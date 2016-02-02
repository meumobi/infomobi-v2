(function() {
	'use strict';
	
	angular
	.module('meumobi.services.Cordova', [])
	.factory('deviceReady', deviceReady);
	
	function deviceReady() {
		return function(done) {
			if (typeof window.cordova === 'object') {
				document.addEventListener('deviceready', function() {
					done();
				}, false);
			} else {
				done();
			}
		};
	}
})();
