angular.module('javascriptcom').factory('jsCourseResource', function($resource) {
  return $resource('/courses/:course.json', {}, {});
});
