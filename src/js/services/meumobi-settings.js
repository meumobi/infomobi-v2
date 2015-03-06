'use strict';

angular.module('meumobi.settings', [])

.constant("SITE", {
  /*"DOMAIN": "infobox.meumobi.com",
  "SRC_URL": "http://infobox.meumobilesite.com/",
  "API_URL": "http://infobox.meumobilesite.com/api/",*/
  "TIMEOUT": "5000",
  "ITEMS_PER_PAGE": "10",
  "DOMAIN": "infobox.int-meumobi.com",
  "SRC_URL": "http://int-meumobi.com/",
  "API_URL": "http://int-meumobi.com/api/",
  "WELCOME_MESSAGE": "O InfoBox é o novo aplicativo de comunicação interna da Siemens. Fica conectado no feed de noticias da Siemens no seu celular."
})

.constant("INFOBOXAPP", {
  "VERSION" : "1.0.0"
});
