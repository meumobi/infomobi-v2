(function() {
	'use strict';

	angular
	.module('meumobi.directives.Headline', [])
	.directive('headline', headline)

	function headline($rootScope, $log, meuCloud, $filter, $injector) {
		return {
			restrict: 'E',
			scope: {
				item: '='
			},
			controller: function($scope, $element, $rootScope) {
			  $scope.getTemplateUrl = function() {
          var path = '';
          if ($scope.category && $scope.category.type) {
            path = $scope.category.type + '/_headline.html'
          }
          return path;
			  }
			},
			template: '<ng-include src="getTemplateUrl()" />',
			link: function(scope, element, attrs) {
        scope.getImage = meuCloud.getAssetUrl;
        scope.category = meuCloud.getCategory(scope.item.parent_id);        
        scope.Item = $injector.get($filter('capitalize')(scope.category.type));
			}
		};
	}
})();