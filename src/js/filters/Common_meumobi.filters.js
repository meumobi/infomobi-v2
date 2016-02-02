(function() {
	'use strict';

	angular
	.module('meumobi.filters.Common', [])
	.filter('isEmpty', isEmpty)
	.filter('br2nl', br2nl)
	.filter('striptags', striptags)
		
	function isEmpty() {
		return function (obj) {
			return (Object.keys(obj).length === 0);
		};
	}
	
	function br2nl() {
		return function(text) {
			return text.replace(/<br\s*[\/]?>/gi, "\n");
		};
	}
	
	function striptags() {
		return function(text) {
			return angular.element('<div/>').html(text).text();
		};
	}
})();