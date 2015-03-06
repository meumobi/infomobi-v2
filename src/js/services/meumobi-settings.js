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
  "WELCOME_MESSAGE": "Lorem ipsum dolor sit amet, consectetur adipisicing elit."
})

.constant("INFOBOXAPP", {
  "VERSION" : "1.0.0"
});
