(function() {
	'use strict';

	angular
	.module('infoMobi')
	.controller('EventsShowController', EventsShowController)

<<<<<<< HEAD
  function EventsShowController($rootScope, $log, $routeParams, Events) {
=======
  function EventsShowController($rootScope, UtilsService, translateFilter, $log, $scope, $routeParams, Events) {
>>>>>>> bf340e587201d86445db3640421736150bf22395
    
    var vm = this;
    
    vm.item = $rootScope.items[$routeParams.id];
    vm.addEvent = Events.addEvent;
  };
})();