(function() {
	'use strict';

	angular
	.module('ngMeumobi.Items.events', [])
  .factory('Events', Events)
	.directive('eventsHeadline', eventsHeadline)

  function Events(meuCalendar, $log, $locale, moment) {
    
		var service = {};

		service.addEvent = addEvent;
		service.addSchedule = addSchedule;

		return service;
    
    function addEvent(item) {
      $log.debug("Add Event to device calendar");
      var options = {
        title: item.title,
        address: item.address,
        description: item.description,
        start_date: item.start_date,
        end_date: item.end_date
      };
			meuCalendar.createEventInteractively(options)
        .then(function() {
          //meuAnalytics.trackEvent('Events', 'create', item.title, 1);
        });
		};  
    
    function addSchedule(event) {
      var startDate = new Date(event.start_date * 1000);
      var endDate  = new Date(event.end_date * 1000);
  
      /*
      If start and end_date equal 00:00 then the event occurs all day long
      */
        
      if (startDate.toTimeString($locale.id, {hour:'numeric', minute:'numeric'}) == endDate.toTimeString($locale.id, {hour:'numeric', minute:'numeric'})) {
        event.dayLong = true;
      } else {
        event.dayLong = false;
        //vm.global.timezone = moment.tz(moment.tz.guess()).format('z');
      }

      return event;
    } 
  }

	function eventsHeadline($rootScope, Events, $log) {
		return {
			restrict: 'E',
			scope: {
				item: '=',
				category: '='
			},
			templateUrl: 'events/_headline.html',
			link: function(scope, element, attrs) {
        scope.addEvent = Events.addEvent;
				scope.goToItem = $rootScope.goToItem;
        scope.item = Events.addSchedule(scope.item);
        $log.debug(scope.item);
			}
		};
	}
})();