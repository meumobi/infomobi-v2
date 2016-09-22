(function() {
	'use strict';

	angular
	.module('infoMobi')
	.controller('EventsShowController', EventsShowController)

  function EventsShowController($rootScope, UtilsService, translateFilter, $log, $scope, $routeParams, Events) {
    
    var vm = this;
    
    vm.item = $rootScope.items[$routeParams.id];
    vm.addEvent = Events.addEvent;
  };
})();