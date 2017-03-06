(function() {
	'use strict';

	angular
	.module('meumobi.api', ['ngResource', 'meumobi.services.Settings'])
// Simple Authentication for Angular.js App: http://beletsky.net/2013/11/simple-authentication-in-angular-dot-js-app.html
	.factory('errorInterceptor', errorInterceptor)
	.factory('API', API)

function errorInterceptor($q, $rootScope, $location, APP, $log) {
	return {
		request: function(config) {
			config.requestTimestamp = new Date().getTime();
			config.timeout = 10000;
			return config || $q.when(config);
		},
		requestError: function(request) {
			return $q.reject(request);
		},
		response: function(response) {
			response.config.responseTimestamp = new Date().getTime();
			return response || $q.when(response);
		},
		responseError: function(response) {
			// See w3.org for Status code definitions: https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html			
			if (response && response.status === 0) {} // network offline or CORS error
			if (response && response.status === 404) {}
			if (response && response.status === 401) {
				$log.debug("[API:errorInterceptor]: response.status == 401");
				$log.debug("The request requires user authentication.  If the request already included Authorization credentials, then the 401 response indicates that authorization has been refused for those credentials.")
				$rootScope.$emit("logout");
			}
			if (response && response.status === 404) {
				$log.debug("[API:errorInterceptor]: response.status == " + response.status);
				$log.debug("The requested resource could not be found.");
			}
			if (response && response.status === 408) {
				$log.debug("[API:errorInterceptor]: response.status == " + response.status);
				$log.debug("The server timed out waiting for the request.");
			}
			if (response && response.status >= 500) {}
			return $q.reject(response);
		}
	};
}

function API($http, APP, $rootScope, $log, httpWithFallback) {
  
  function convertJsonAsUriParameters(data) {
    var url = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&');
    $log.debug(url);
    
    return url;
  };

	function buildUrl(endp) {
		// Temporary fix because /visitors/forgot_password not exists yet, we need to force site on url to call /mail unlogged
		var site = ""; //(endp.indexOf("login") != -1) ? "" : APP.domain;
		if ($rootScope.visitor && $rootScope.visitor.site) {
			site = $rootScope.visitor.site;
		}
		return APP.apiUrl + site + endp;
	}

var api = (function() {
	return {
		get: function(endp, config, success, error) {
      var url = buildUrl(endp);
      var cache = JSON.parse(localStorage.getItem(url));
      if (cache && cache.headers)
        config['If-None-Match'] = cache.headers.etag;
			httpWithFallback.get(url, config)
			.then(success, error);
		},
		post: function(endp, obj, success, error) {
			$http({
				method: 'POST',
				url: buildUrl(endp),
				data: JSON.stringify(obj),
				responseType: 'json',
				headers: {
					"Content-Type": "application/json",
				}
			})
			.then(success, error);
		},
		put: function(endp, obj, success, error) {
			$http({
				method: 'PUT',
				url: buildUrl(endp),
				data: JSON.stringify(obj),
				responseType: 'json',
				headers: {
					"Content-Type": "application/json",
				}
			})
			.then(success, error);
		},
		del: function(endp, id, success, error) {
			$http({
				method: 'DELETE',
				url: buildUrl(endp),
				responseType: 'json',
			})
			.then(success, error);
		}
	}
})();

var app = {
	Categories: (function() {
		var path = '/categories/';
		return {
			query: function(success, error) {
				api.get(path, {}, success, error);
			},
			items: function(category_id, config, success, error) {
				api.get(path + category_id + '/items', config, success, error);
			}
		}
	})(),
	Items: (function() {
		var path = '/items/';
		return {
			latest: function(success, error) {
				api.get(path + 'latest', {}, success, error);
			},
      search: function(obj, success, error) {
        var url = path + 'search?' + convertJsonAsUriParameters(obj);
        $log.debug(url);
        api.get(url, {}, success, error);
      }
		}
	})(),
	Site: (function() {
		var path = '/performance';
		return {
			performance: function(success, error) {
				api.get(path, {}, success, error);
			}
		}
	})(),
	Login: (function() {
		var path = '/visitors/';
		return {
			signin: function(obj, success, error) {
				api.post(path + 'login', obj, success, error);
			},
			get: function(success, error) {
				api.get(path, {}, success, error);
			},
			save: function(obj, success, error) {
				api.put(path, obj, success, error);
			},
			device: function(obj, success, error) {
				api.post(path + 'devices', obj, success, error);
			},
			update: function(obj, success, error) {
				api.put(path + 'devices/' + obj.uuid, obj, success, error);
			},
			reset: function(obj, success, error) {
				api.post(path + 'forgot_password', obj, success, error);
			}
		}
	})(),
	Devices: (function() {
		var path = '/devices/';
		return {
			save: function(obj, success, error) {
				api.put(path + obj.uuid, obj, success, error);
			} 
		}
	})(),
	Poll: (function() {
		var path = '/items/';
		return {
			submit: function(obj, success, error) {
				api.post(path + obj.id + '/poll', obj.params, success, error);
			}
		}
	})(),
	Mail: (function() {
		var path = '/mail/';
		return {
			save: function(obj, success, error) {
				api.post(path, obj, success, error);
			}
		}
	})()
}
return app;
}
})();
