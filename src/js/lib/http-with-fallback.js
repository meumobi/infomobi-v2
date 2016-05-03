(function(global) {
  'use strict';

  angular.module('http-with-fallback', [])
    .factory('httpWithFallback', ['$http', '$q', function($http, $q) {


      // Constructor function, using $http as prototype
      function HttpWithFallback() { }
      HttpWithFallback.prototype = $http;
      HttpWithFallback.prototype.constructor = HttpWithFallback;

      var httpWithFallback = new HttpWithFallback(),
          localStorage = global.localStorage;

      var prepareStoredResponse = function(storedResponse) {
        // Data was successfully retrieved from local storage, resolve with status 200
        storedResponse = JSON.parse(storedResponse);
        var headers = storedResponse.headers;
        storedResponse.headers = function() { return headers; };
        return storedResponse;
      }

      var makeRequest = function(url, config, deferred) {
        $http.get(url, config)
        .then(
          function(response) {
            // Store in local storage when status === 200
            if (!response.config.dontStoreFallback && response.status === 200) {
              localStorage.setItem(url, JSON.stringify({
                                          data: response.data,
                                          status: response.status,
                                          config: response.config,
                                          headers: response.headers(),
                                          isFallback: true
                                        }));
            }
            // Resolve with original response
            deferred.resolve(response);
          },
          function(response) {
            // Try to retrieve from local storage
            var storedResponse = localStorage.getItem(url);
            if (storedResponse) {
              return deferred.resolve(prepareStoredResponse(storedResponse));
            }

            // Try config.fallback
            if (response.config.fallback) {
              return deferred.resolve({
                data: config.fallback,
                status: 200,
                headers: response.headers,
                config: response.config,
                isFallback: true
              });
            }

            // Reject with original error response
            return deferred.reject(response);
          }
        );

        // Decorate promise with success and error functions to be compatible with the promise returned by $http.get
        var promise = deferred.promise;

        promise.success = function(fn) {
          promise.then(function(response) {
            fn(response.data, response.status, response.headers, config, response.isFallback);
          });
          return promise;
        };

        promise.error = function(fn) {
          promise.then(null, function(response) {
            fn(response.data, response.status, response.headers, config);
          });
          return promise;
        };

        return promise;
      };
      /**
       * Override $http.get to catch the promise.error
       */
      httpWithFallback.get = function(url, config) {
        // Client doesn't support local storage
        if (!global.localStorage) {
          // If no fallback defined, just just $http.get
          if (!config.fallback) {
            return $http.get(url, config);
          }
          // Local storage won't be used
          config.dontStoreFallback = true;
        }

        // Delegate get to $http
        var deferred = $q.defer();
        var storedResponse = localStorage.getItem(url);

        if (storedResponse) {
          //second promise to update data after request
          var deferredRequest = $q.defer();
          storedResponse = prepareStoredResponse(storedResponse);
          storedResponse.promise = makeRequest(url, config, deferredRequest);
          deferred.resolve(storedResponse);
          return deferred.promise;
        }
        //don't have local, continue to request
        return makeRequest(url, config, deferred);
      };

      return httpWithFallback;
    }]);
}(this));
