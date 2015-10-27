angular.module('javascriptcom').factory('$', ['$window',
  function jQuery($window) {
    return $window.$;
  }
]);
