(function() {
  'use strict';

  angular
  .module('infoMobi')
  .controller('MainController', MainController);

  function MainController($rootScope, $location, AuthService, UtilsService, $log, APP, meuAnalytics, deviceReady, API) {
  
    var vm = this;

    vm.logout = function() {
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
  
      activate();
 
      function activate() {
        API.Site.performance(
          function(response) {
            fulfill(response);
          },
          function(response) {}
        );
      };
  
      function fulfill(response) {
        updateDatas(response);
        // if we have a promise, we will use the same current function when it is fulfilled
        if (response.promise) {
          response.promise
          .then(function(response) {
            fulfill(response);
          })
          .catch(function(response) {
          })
        }
      }
  
      function updateDatas(response) {
        var data = response.data;

        MeuAPI.setCategories(data.categories);
        if (data.site && data.site.analytics_token) {
          deviceReady(function(){
            meuAnalytics.startTrackerWithId(data.site.analytics_token);
          });
          $log.debug("Own Project Analytics token: " + data.site.analytics_token);       
        } else {
          $log.debug("Infomobi Analytics token");
        }
        data.logo = data.site.hasOwnProperty("logo") && data.site.logo != "" ? APP.cdnUrl + data.site.logo : defaultLogo;
        $rootScope.performance = data;
    
        angular.copy(data, vm.site);
      }
    }
  };
})();