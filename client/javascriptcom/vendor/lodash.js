angular.module('javascriptcom').factory('_', ['$window',
  function lodash($window) {
    return $window._;
  }
]);
