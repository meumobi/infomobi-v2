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
})();