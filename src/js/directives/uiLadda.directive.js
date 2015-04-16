(function() {
  angular
  .module('meumobi.utils')
  .directive('uiLadda', uiLadda);

  function uiLadda() {
    return {
      link: function(scope, element, attrs) {
        var Ladda = window.Ladda;
        ladda = Ladda.create(element[0]);
        // Watching login.loading for change
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
