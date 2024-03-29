(function() {
	'use strict';
 
  var categories = {
    templateUrl: 'sidebar-left.html',
    bindings: {
      categories: '<'
    },
    controller: function(meuUtils, meuCordova) {
      var vm = this;
      
      meuUtils.deviceReady(function() {
        meuCordova.device.getAppVersion().then(function(version) {
          vm.app_version = AppVersion.version;
        })
      });
    }
  };
  
  var selectTypes = function($log) {
    return function (categories) { 

      var selected = []
      var types = ['articles', 'polls', 'events'];
      
      for (var i = 0; i < categories.length; i++) {
        if (types.indexOf(categories[i].type) > -1)
          selected.push(categories[i]);
      }
      
      return selected;
    }; 
  };
  
	angular
	.module('infoMobi')
  .filter('selectTypes', selectTypes)
	.component('categoriesSidebarLeft', categories);  
})();
