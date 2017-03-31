(function() {
  angular
  .module('meumobi.directives.uiLadda', [])
  .directive('uiLadda', uiLadda);

  function uiLadda() {
    return {
      link: function(scope, element, attrs) {
        var Ladda = window.Ladda;
        ladda = Ladda.create(element[0]);
        /*
        Watching Login.isLoading for change
				<button data-ui-ladda="Login.isLoading" class="btn btn-primary btn-block" data-style="expand-right">
					<span class="ladda-label">{{"Sign In" | translate}}</span>
				</button>
        */ 
        scope.$watch(attrs.uiLadda, function(newVal, oldVal) {
          // if true show loading indicator
          if (newVal) {
            ladda.start();
          } else {
            ladda.stop();
          }
        });
      }
    };
  }
})();
