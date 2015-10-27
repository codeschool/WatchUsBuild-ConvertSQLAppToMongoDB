angular.module('javascriptcom').factory('jsCourseChallengeResource', function($resource) {
  return $resource('/courses/:course/challenges.json', {}, {});
});
