angular.module('javascriptcom').directive('jsSafeHtml', ['$sce', function($sce) {
  return {
    restrict: 'A',
    scope: {
      jsSafeHtml: "@"
    },
    template: "<div ng-bind-html='safeHtml'></div>",
    link: function(scope, element, attrs) {
      var unregister = scope.$watch('jsSafeHtml', setHtml);

      function setHtml(value) {
        if(!value) { return; }
        scope.safeHtml = $sce.trustAsHtml(value.replace(/^\s+|\s+$/g, ''));
        unregister();
      }
    }
  };
}]);
