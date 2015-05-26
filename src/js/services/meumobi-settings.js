'use strict';

angular
.module('meumobi.settings', [])

.constant("APP", @@APP)
.constant("CONFIG", @@CONFIG)
//.constant("PUSH", {})
//.constant("WELCOME", @@WELCOME)
//.constant("STYLE", @@STYLE)
.constant('MEDIAS', {
	'application/pdf': {
		class: 'fa-file-pdf-o',
		label: 'View',
		extension: 'pdf',
		download: true
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
	}
})
