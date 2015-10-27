angular.module('javascriptcom').filter('markdown', ['marked', function(marked) {
  return function(text) {
    return marked(text);
  };
}]);
