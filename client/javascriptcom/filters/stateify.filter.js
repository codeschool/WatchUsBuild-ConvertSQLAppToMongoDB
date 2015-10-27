angular.module('javascriptcom').filter('stateify', ['$interpolate', function($interpolate) {
  return function(text, scope) {
    return $interpolate(text)(scope);
  };
}]);
