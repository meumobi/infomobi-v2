(function() {
	'use strict';

	angular
	.module('meumobi.filters.DownloadFiles', ['ngSanitize' ])
	.filter('mediaClickLabel', mediaClickLabel)
	.filter('mediaIconClass', mediaIconClass)
	.filter('bytesToSize', bytesToSize)
	.filter('hrefToJS', hrefToJS)

	function mediaClickLabel(MEDIAS) {
		return function(type) {
			return MEDIAS[type] ? MEDIAS[type].label : 'Open';
		};
	}
	
	function mediaIconClass(MEDIAS) {
		return function(type) {
			return MEDIAS[type] ? MEDIAS[type].class : 'fa-external-link';
		};
	}
	
	function bytesToSize() {
		return function(bytes) {
			bytes = bytes * 1000;
			if (bytes == 0) return '0 Byte';
			var k = 1000;
			var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
			var i = Math.floor(Math.log(bytes) / Math.log(k));
			return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
		}
	}

	function hrefToJS ($sce, $sanitize) {
		return function(text) {
			var regex = /href="([\S]+)"/g;
			var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_blank', 'location=yes')\"");
			return $sce.trustAsHtml(newString);
		}
	}

})();