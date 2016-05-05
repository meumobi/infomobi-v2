(function() {
	'use strict';

	angular
	.module('meumobi.services.Settings', [])
	
	.constant("APP", @@APP)
	
	.constant('LOCALES', {
		'locales': {
			'pt_BR': 'Português',
			'en_US': 'English'
		},
		'preferredLocale': 'pt_BR'
	})
	
	.constant("CONFIG", @@CONFIG)

	.constant('MEDIAS', {
		'application/pdf': {
			class: 'fa-file-pdf-o',
			label: 'View',
			extension: 'pdf',
			download: true
		},
		'text/html': {
			class: 'fa-rss',
			label: 'Open',
			extension: 'html',
			download: false
		},
		'application/vnd.ms-excel': {
			class: 'fa-file-excel-o',
			label: 'View',
			extension: 'xls',
			download: true
		},
		'audio/mpeg': {
			class: 'fa-file-audio-o',
			label: 'Play',
			extension: 'mp3',
			download: true
		},
		'application/vnd.ms-powerpoint': {
			class: 'fa-file-powerpoint-o',
			label: 'View',
			extension: 'ppt',
			download: true,
		},
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
			class: 'fa-file-excel-o',
			label: 'View',
			extension: 'xls',
			download: true
		}
	})
})();