angular.module('javascriptcom').directive('tooltip', function() {
  return {
    restrict: 'A',
    scope: {
      tooltip: '@'
    },
    link: function(scope, element, attrs) {
      $(element).tooltip({
        animation: false,
        container: 'body',
        trigger:   'hover',
        placement: 'bottom',
        title:     function() {
          return scope.tooltip;
        },
        viewport:  {
          selector: 'body',
          padding: 10
        }
      });
    }
  };
});
