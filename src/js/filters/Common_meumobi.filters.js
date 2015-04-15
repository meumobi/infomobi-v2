(function() {
	'use strict';

	angular
	.module('meumobi.filters.Common', [])
	.filter('isEmpty', isEmpty)
		
	function isEmpty() {
		return function (obj) {
			return (Object.keys(obj).length === 0);
		};
	}
})();