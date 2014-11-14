'use strict';

angular.module('meumobi.settings', [])

.constant('DOMAIN', "infobox.int-meumobi.com")
.constant('API_URL', "http://int-meumobi.com/api/")
.constant('TIMEOUT', 3000)
.constant('ITEMS_PER_PAGE', 10)



angular.module('meumobi.api', ['ngResource', 'meumobi.settings'])

.factory('Categories', function($resource, API_URL, DOMAIN, TIMEOUT) {
	return $resource(API_URL+DOMAIN+'/categories/:id', {},{
		get : {
			headers: {'X-Visitor-Token': localStorage['userToken']}
		}
	});
})
	
.factory('Items', 
	function($resource, API_URL, DOMAIN, TIMEOUT, ITEMS_PER_PAGE) {
		return $resource(API_URL+DOMAIN+'/items/:id', {id: '@_id'}, {
			latest: {
				method: 'GET',
				url: API_URL+DOMAIN+'/items/latest', 
				timeout: TIMEOUT,
				//cache: true,
				params: {
					limit: ITEMS_PER_PAGE
				},
				headers: {'X-Visitor-Token': localStorage['userToken']}
			},
			get: {
				//cache : true,
				headers: {'X-Visitor-Token': localStorage['userToken']}
			}
		});
	})

.factory('Login', function($resource, API_URL, DOMAIN, TIMEOUT){
	return $resource(API_URL+DOMAIN+'/visitors/:id', {id: '@_id'},{
		signin : {
			method : 'POST',
			url: API_URL+DOMAIN+'/visitors/login',
			timeout: TIMEOUT,
			cache: true
		},
		get : {
			cache : true,
			headers: {'X-Visitor-Token': localStorage['userToken']}
		}
	});
});