(function() {
  'use strict';

  angular
  .module('infoMobi')
  .controller('MainController', MainController);

  function MainController($rootScope, AuthService, $log, meuCordova, meuUtils, meuCloud, Site) {
  
    $rootScope.logout = function() {
      AuthService.logout();
      $rootScope.flip('#/login');
    }
  
    /*
    Track current page
    */
    $rootScope.$on('$routeChangeSuccess', function(e, current, prev) {
      if (current.$$route)
      meuUtils.deviceReady(function(){
        
        /*
        TODO: Replace by Global service and getCurrentItem, getCurrentCategory methods
        */
        var title = current.$$route.title || $rootScope.items[current.params.id].title || "Screen title missing";
        
        meuCordova.analytics.trackView(title);
      });
    });

    var activate = function() {
      meuCloud.API.Site.performance()
      .then(function(response) {
        updateDatas(response);
        if (response.promise)
          return response.promise;
      })
      // If response contains a promise, means is from cache and promise will sync w/ Server
      .then(function(response) {
        updateDatas(response)
      })
      .catch(function(e) {
        $exceptionHandler(e);
      })
    };
    
    var updateDatas = function(response) {
      var data = response.data;

      meuCloud.syncPerformance(data)
      .then(function(data) {
        Site.updateAnalytics();
        
        data.logo = meuCloud.getSiteLogoUrl();
        $rootScope.performance = data;
      });
    };
    
    if (AuthService.isAuthenticated()) {
      var defaultLogo = "images/header-color.png";
  
      activate();
    }
  };
})();