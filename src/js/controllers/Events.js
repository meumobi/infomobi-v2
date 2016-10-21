(function() {
	'use strict';

	angular
	.module('infoMobi')
	.controller('EventsShowController', EventsShowController)

  function EventsShowController($rootScope, $log, $routeParams, Events) {
    
    var vm = this;
    
    vm.item = $rootScope.items[$routeParams.id];
    vm.addEvent = Events.addEvent;
  };
})();