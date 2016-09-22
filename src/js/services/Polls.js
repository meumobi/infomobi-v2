(function() {
	'use strict';

	angular
	.module('ngMeumobi.Items.polls', [])
  .factory('PollsService', PollsService)
	.directive('pollsHeadline', pollsHeadline)

  function PollsService($log) {
    
		var service = {};

		return service;
  };
    
	function pollsHeadline($rootScope, PollsService) {
		return {
			restrict: 'E',
			scope: {
				item: '=',
				category: '='
			},
			templateUrl: 'polls/_headline.html',
			link: function(scope, element, attrs) {
        scope.getImage = $rootScope.getImage;
			}
		};
	};
})();