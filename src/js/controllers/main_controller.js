'use strict';

angular
.module('infoMobi')
.controller('MainController', MainController);

function MainController($rootScope, $scope, $location, AuthService, UtilsService, $log, APP, MeumobiCloud, meuAnalytics, deviceReady, API) {

	$scope.userAgent = navigator.userAgent;

	$scope.mailto = function(e) {
		if (window.plugins && window.plugins.emailComposer) {
			window.plugins.emailComposer.showEmailComposerWithCallback(console.log("Email callback " + e),
			"Want to know more about infoBox...", "Please send me more details.", ["infobox@siemens.com.br"], null, null, false, null, null);
		} else {
			location.href = 'mailto:infobox@siemens.com.br?subject=Question about media infoBox&body=';
		}
	}

	$scope.logout = function() {
		AuthService.logout();
		$rootScope.flip('#/login');
	}
  
  /*
    Track current page
  */
	$rootScope.$on('$routeChangeSuccess', function(e, current, prev) {
    if (current.$$route)
      deviceReady(function(){
        
        /*
          TODO: Replace by Global service and getCurrentItem, getCurrentCategory methods
        */
        var title = current.$$route.title || $rootScope.items[current.params.id].title || "Screen title missing";
        
        meuAnalytics.trackView(title);
      });
	});

	if (AuthService.isAuthenticated()) {
		var data = {};
		var defaultLogo = "images/header-color.png";
    var query = {
      type: "contacts"
    }
    API.Items.search(
      query, 
      function(response) {
        $log.debug('API search')
        $rootScope.contacts = response.data.items && response.data.items.contacts;
        $log.debug($rootScope.contacts);
      }, 
      function(e) {
        $log.debug('Search error');
        $log.debug(e);
      }
    );
    
		MeumobiCloud.syncPerformance(
			function(response) {
				var data = response.data;
				data.logo = data.site.hasOwnProperty("logo") && data.site.logo != "" ? APP.cdnUrl + data.site.logo : defaultLogo;
				$rootScope.performance = data;
        if (data.site && data.site.analytics_token) {
          meuAnalytics.startTrackerWithId(data.site.analytics_token);   
          $log.debug("Own Project Analytics token: " + data.site.analytics_token);       
        } else {
          $log.debug("Infomobi Analytics token");
        }
        MeuAPI.setCategories($rootScope.performance.categories);
			}, function(error) {
				$log.debug("MeumobiCloud.syncPerformance ERROR");
				$log.debug(error);
			}
		)
	}
}
