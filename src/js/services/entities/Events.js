(function() {
	'use strict';

	angular
	.module('ngMeumobi.Entities.events', [])
  .factory('Events', Events)

  function Events(meuCordova, $log, $locale, moment) {
    
		var service = {};

		service.addEvent = addEvent;
		service.addSchedule = addSchedule;

		return service;
    
    function addEvent(item) {
      var options = {
        title: item.title,
        address: item.address,
        description: item.description,
        start_date: item.start_date,
        end_date: item.end_date
      };
			meuCordova.calendar.createEventInteractively(options)
        .then(function() {
          meuCordova.analytics.trackEvent('Events', 'Add to Calendar', item.title);
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
})();