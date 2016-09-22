(function() {
	'use strict';

	angular
	.module('ngMeumobi.Items.articles', [])
  .factory('Articles', Articles)
	.directive('articlesHeadline', articlesHeadline)

  function Articles($log) {
    
		var service = {};

		return service;
  };
    
	function articlesHeadline($rootScope, Articles) {
		return {
			restrict: 'E',
			scope: {
				item: '=',
				category: '='
			},
			templateUrl: 'articles/_headline.html',
			link: function(scope, element, attrs) {
        scope.getImage = $rootScope.getImage;
			}
		};
	};
})();