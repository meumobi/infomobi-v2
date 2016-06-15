(function() {
	'use strict';

	angular
	.module('meumobi.Cloud', [])
	.provider('MeumobiCloud', MeumobiCloudProvider);
	
	function MeumobiCloudProvider() {

		var data = {}

		this.Settings = {
			"cdnUrl": "",
			"apiUrl": "",
			"domains": "",
			"language": "pt",
			"httpTimeout": "1000"
		};

		this.$get = MeumobiCloud;
		
		function MeumobiCloud($exceptionHandler, $q, $rootScope, UtilsService, $log, httpWithFallback, $http) {
			
			var that = this;
			
			/**
			* Api methods, available only on the inside the service
			*/
			var api = {};
			
			api.getSiteBuilderApiUrl = getSiteBuilderApiUrl;
			api.getPerformance = getPerformance;
			api.getDomain = getDomain;
			
			function getLanguage() {
				return that.Settings.language;
			}
			
			function getDomain() {
				try {
					var domain = $rootScope.visitor && $rootScope.visitor.site;
					if (!domain) {
						domain = that.Settings.domains[getLanguage()];
					}
					return domain;
					
				} catch (error) {
					$exceptionHandler(error);
				}
			}

			function getSiteBuilderApiUrl(path) {
				return that.Settings.apiUrl + getDomain() + path;
			}

			function getPerformance() {
				// return $http.get(getSiteBuilderApiUrl("/performance"), {timeout: that.Settings.httpTimeout})
				return httpWithFallback.get(
					getSiteBuilderApiUrl("/performance")
				);
			}

			function fulfill(response, success) {
				success(response);
				// if we have a promise, we will use the same current function when it is fulfilled
				if (response.promise) {
					response.promise
					.then(function(response) {
						fulfill(response, success);
					});
				}
			}

			/**
			* Service methods, that are public and available for any resource
			*/
			var service = {}

			service.syncPerformance = syncPerformance;

			return service;

			function syncPerformance(success, error) {
				api.getPerformance()
				.then(function(response) {
					fulfill(response, success);
				})
				.catch(function(data) {
					error(data);
				})
			}
		}
	}
})();
