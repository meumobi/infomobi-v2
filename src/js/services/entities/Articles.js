(function() {
	'use strict';

	angular
	.module('ngMeumobi.Entities.articles', [])
  .factory('Articles', Articles)
	.directive('articlesHeadline', articlesHeadline)

  function Articles($log, $rootScope) {
    
		var service = {};
    
		return service;
  };
    
	function articlesHeadline($rootScope, Articles) {
		return {
			restrict: 'E',
			scope: {
				item: '='
			},
			templateUrl: 'articles/_headline.html',
			link: function(scope, element, attrs) {
        scope.getImage = $rootScope.getImage;
        scope.category = MeuAPI.getCategory(scope.item.parent_id);
			}
		};
	};
})();