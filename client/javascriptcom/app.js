angular.module('javascriptcom', ['ngResource', 'ngAnimate', 'ngCookies'])
  .config(['$httpProvider', function config($httpProvider) {
    $httpProvider.defaults.cache = true;
  }]);
