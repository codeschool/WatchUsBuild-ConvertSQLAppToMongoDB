angular.module('javascriptcom').directive('jsChallenge', function() {
  return {
    templateUrl: 'templates/challenge.html',
    replace: true,
    scope: {
      challenge: '='
    },
    bindToController: true,
    controllerAs: 'ctrl',
    controller: function jsChallengeController() {
    }
  };
});
