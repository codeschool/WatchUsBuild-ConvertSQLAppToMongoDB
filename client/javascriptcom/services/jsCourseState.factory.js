angular.module('javascriptcom').factory('jsCourseState', ['_', function(_) {
  return {
    state: {},
    update: function(newState) {
      this.state = _.merge(this.state, newState)
    }
  };
}]);
