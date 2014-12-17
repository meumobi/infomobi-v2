'use strict';

angular.module('meumobi.api', ['ngResource', 'meumobi.settings'])

.factory('Categories', function($resource, SITE, $rootScope) {
	return $resource(SITE.API_URL+SITE.DOMAIN+'/categories/:id', {id: '@_id'},{
		query : {
			isArray:true,
			headers: {'X-Visitor-Token': $rootScope.userToken},
			cache: false
		}
	});
})
	
.factory('Items', 
	function($resource, SITE, $rootScope) {
		return $resource(SITE.API_URL+SITE.DOMAIN+'/items/:id', {id: '@_id'}, {
			latest: {
				method: 'GET',
				url: SITE.API_URL+SITE.DOMAIN+'/items/latest', 
				timeout: SITE.TIMEOUT,
				cache: false,
				params: {
					limit: SITE.ITEMS_PER_PAGE
				},
				headers: {
							'X-Visitor-Token': $rootScope.userToken,
							//'If-None-Match' : localStorage['ETag']
						 }
			},
			get: {
				//cache : true,
				headers: {'X-Visitor-Token': $rootScope.userToken}
			}
		});
	})
  
.factory('Login', function($resource, SITE, $rootScope){
	return $resource(SITE.API_URL+SITE.DOMAIN+'/visitors/:id', {id: '@_id'},{
		signin : {
			method : 'POST',
			url: SITE.API_URL+SITE.DOMAIN+'/visitors/login',
			timeout: SITE.TIMEOUT,
			//cache: true
		},
		get : {
			cache : true,
			headers: {'X-Visitor-Token': $rootScope.userToken}
		},
		save : {
			method: 'POST',
			headers: {'X-Visitor-Token': $rootScope.userToken}
		},
		device : {
			method: 'POST',
			headers: {'X-Visitor-Token': $rootScope.userToken},
			url: SITE.API_URL+SITE.DOMAIN+'/visitors/devices',
			timeout: SITE.TIMEOUT
		}
	});
})

// Simple Authentication for Angular.js App: http://beletsky.net/2013/11/simple-authentication-in-angular-dot-js-app.html

.factory('errorInterceptor', ['$q', '$rootScope', '$location',
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
                  delete localStorage.mail;
                }
                if (response && response.status >= 500) {
                }
                return $q.reject(response);
            }
        };
}])

.factory('Mail', function($resource, SITE, $rootScope){
	return $resource(SITE.API_URL+SITE.DOMAIN+'/mail/:id', {id: '@_id'},{
		save : {
			method: 'POST',
			headers: {'X-Visitor-Token': $rootScope.userToken},
      //headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}
		}
	});
})

