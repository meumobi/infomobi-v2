(function() {
	'use strict';
	
	angular
	.module('meumobi.Polls')
	.directive('poll', poll);

	function poll($rootScope, translateFilter, Poll, $timeout, UtilsService, $log) {
		var directive = {
			restrict: 'E',
			scope: {
				poll: '=data'
			},
			template: "<ng-include src=\"'polls/' + poll.status + '.html'\" />",
			link: link
		};
		return directive;
		
		function link(scope, element, attrs) {
			scope.poll = Poll.get(scope.poll);
			
			scope.vote = function () {
				Poll.vote(scope.poll);
			}
		}
	}
})();