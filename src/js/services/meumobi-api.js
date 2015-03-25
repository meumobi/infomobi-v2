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
							'If-None-Match' : localStorage['ETag']
						 }
			},
			get: {
				//cache : true,
				headers: {
							'X-Visitor-Token': $rootScope.userToken
						}
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
                  $rootScope.go('/login');
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

.factory('API', function ($http, SITE, $rootScope) {
    var api = (function(){
        return{
            get : function(endp,success,error){
                $http({
                    method: 'GET',
                    url: SITE.API_URL+SITE.DOMAIN+endp,
                    responseType: 'json',
                    headers: {
                        'X-Visitor-Token': $rootScope.userToken
                    }
                })
                .success(success)
                .error(error);
            },
            post : function(endp,obj,success,error){
                $http({
                    method: 'POST',
                    url: SITE.API_URL+SITE.DOMAIN+endp,
                    data: JSON.stringify(obj),
                    responseType : 'json',
                    headers: {
                        "Content-Type": "application/json",
                        'X-Visitor-Token': $rootScope.userToken
                    }
                })
                .success(success)
                .error(error);
            },
            put : function(endp, obj, success, error){
                $http({
                    method: 'PUT',
                    url: SITE.API_URL+SITE.DOMAIN+endp,
                    data: JSON.stringify(obj),
                    responseType : 'json',
                    headers: {
                        "Content-Type": "application/json",
                        'X-Visitor-Token': $rootScope.userToken
                    }
                })
                .success(success)
                .error(error);
            },
            del : function(endp, id, success, error){
                $http({
                    method: 'DELETE',
                    url: SITE.API_URL+SITE.DOMAIN+endp,
                    responseType: 'json',
                    'X-Visitor-Token': $rootScope.userToken
                })
                .success(success)
                .error(error);
            }
        }
    })();

    var app = {
        Categories : (function(){
        	var path = '/categories/';
            return{
        		query: function(success, error){
        			api.get(path, success, error);
        		}
            }
        })(),
        Items : (function(){
        	var path = '/items/';
        	return{
	        	latest: function(success, error){
	        		api.get(path + 'latest', success, error);
	        	}
        	}
        })(),
        Login: (function(){
        	var path = '/visitors/';
        	return{
        		signin: function(obj, success, error){
        			api.post(path + 'login', obj, success, error);
        		},
        		get: function(success, error){
        			api.get(path,success, error);
        		},
        		save: function(obj, success, error){
        			api.put(path, obj, success, error);
        		},
        		device: function(obj, success, error){
        			api.post(path + 'devices', obj, success, error);
        		},
                update: function(obj, success, error){
                    api.put(path + 'devices/' + obj.uuid, obj, success, error);
                }
        	}
        })(),
        Mail: (function(){
        	var path = '/mail/';
        	return{
        		save: function(obj, success, error){
        			api.post(path, obj, success, error);
        		}
        	}
        })()
    }
    TESTE = app;
	return app;
});
