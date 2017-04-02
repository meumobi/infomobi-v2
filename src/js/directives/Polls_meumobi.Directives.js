(function() {
	'use strict';
	
	angular
	.module('meumobi.Polls')
	.directive('poll', poll);

	function poll($rootScope, translateFilter, Poll, $timeout, UtilsService, $log, $exceptionHandler, meuCordova) {
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
      scope.isLoading = false;
			
			scope.vote = function () {
        $log.debug('Vote Poll');
        scope.isLoading = true;
				Poll.vote(scope.poll)
        .then(function(){
				  scope.isLoading = false;
				})
        .catch(function(e) {
          scope.isLoading = false;
					var msg = translateFilter("poll.vote.Error");
					if (e && e.errors) {
						msg += ": " + translateFilter("[API]: " + e.errors[0]);
					} else {
						msg += ": " + translateFilter("default.network.Error");
					}
					meuCordova.dialogs.toast(msg);
          $exceptionHandler(e);
        })
			}
		}
	}
})();