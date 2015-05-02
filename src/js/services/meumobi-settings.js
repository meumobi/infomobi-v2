'use strict';

angular
.module('meumobi.settings', [])
.constant("APP", @@APP)
.constant("SITE", {
	"DOMAIN": "infobox.meumobi.com",
	"SRC_URL": "http://infobox.meumobilesite.com/",
	"API_URL": "http://infobox.meumobilesite.com/api/",
	"HAL_SUPPORT": false,
	"TIMEOUT": "5000",
	"ITEMS_PER_PAGE": "10",
	/*"DOMAIN": "infobox.int-meumobi.com",
	"SRC_URL": "http://int-meumobi.com/",
	"API_URL": "http://int-meumobi.com/api/",*/
	"WELCOME_MESSAGE": "O InfoBox é o novo aplicativo de comunicação interna da Siemens. Fica conectado no feed de noticias da Siemens no seu celular."
})
.constant("ANALYTICS", @@ANALYTICS)
.constant("PUSH", {
	
})
.constant("API", {
	"url": "@@apiUrl",
	"limit": "@@apiLimit",
	"timeout": "@@apiTimeout",
	"halSupport": "@@apiHalSupport"
})

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
.constant("INFOBOXAPP", {
	"VERSION": "1.1.0"
});

