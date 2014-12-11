'use strict';

angular.module('meumobi.settings', [])

.constant('DOMAIN', "infobox.ipanemax.com")
.constant('API_URL', "http://infobox.meumobilesite.com/api/")
.constant('TIMEOUT', 5000)
.constant('ITEMS_PER_PAGE', 10)



angular.module('meumobi.api', ['ngResource', 'meumobi.settings'])

.factory('Categories', function($resource, API_URL, DOMAIN, TIMEOUT) {
	return $resource(API_URL+DOMAIN+'/categories/:id', {id: '@_id'},{
		query : {
			isArray:true,
			headers: {'X-Visitor-Token': localStorage['userToken']},
			cache: false
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
				cache: false,
				params: {
					limit: ITEMS_PER_PAGE
				},
				headers: {
							'X-Visitor-Token': localStorage['userToken'],
							//'If-None-Match' : localStorage['ETag']
						 }
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
			//cache: true
		},
		get : {
			cache : true,
			headers: {'X-Visitor-Token': localStorage['userToken']}
		},
		save : {
			method: 'POST',
			headers: {'X-Visitor-Token': localStorage['userToken']}
		},
		device : {
			method: 'POST',
			headers: {'X-Visitor-Token': localStorage['userToken']},
			url: API_URL+DOMAIN+'/visitors/devices',
			timeout: TIMEOUT
		}
	});
})

// Simple Authentication for Angular.js App: http://beletsky.net/2013/11/simple-authentication-in-angular-dot-js-app.html

.factory('errorInterceptor', ['$q', '$location',
    function ($q, $rootScope, $location) {
        return {
            request: function (config) {
                return config || $q.when(config);
            },
            requestError: function(request){
                return $q.reject(request);
            },
            response: function (response) {
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (response && response.status === 404) {
                }
                if (response && response.status === 401) {
                  delete localStorage.userToken;
                }
                if (response && response.status >= 500) {
                }
                return $q.reject(response);
            }
        };
}])

.factory('Mail', function($resource, API_URL, DOMAIN, TIMEOUT){
	return $resource(API_URL+DOMAIN+'/mail/:id', {id: '@_id'},{
		save : {
			method: 'POST',
			headers: {'X-Visitor-Token': localStorage['userToken']},
      //headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
		}
	});
});
