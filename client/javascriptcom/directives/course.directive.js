angular.module('javascriptcom').directive('jsCourse', ['jsCourseChallengeResource', 'jsChallengeProgress', '$cookies', 'jsCourseState', 'jsExecutor', function(jsCourseChallengeResource, jsChallengeProgress, $cookies, jsCourseState, jsExecutor) {
  return {
    replace: true,
    templateUrl: 'templates/course.html',
    scope: {
      course: '@'
    },
    bindToController: true,
    controllerAs: 'ctrl',
    controller: function jsCourseDirective(jsCourseChallengeResource, jsChallengeProgress, jsCourseState) {
      var _this = this;

      this.challenges        = jsCourseChallengeResource.query({ course: this.course });
      this.challengeProgress = jsChallengeProgress;

      this.challenges.$promise.then(function() {
        var cookieCourseState    = $cookies.getObject('course_state'),
            cookieChallengeState = $cookies.get('course_challenge_state'),
            tryName              = $cookies.get('try_name');

        _this.challengeProgress.setChallenges(_this.challenges);
        jsCourseState.update(cookieCourseState || (tryName ? { username: tryName } : {}));

        if (cookieChallengeState || tryName) {
          _this.challengeProgress.fastForward(cookieChallengeState || 1);
        }
      });

      this.activateChallenge = function activateChallenge(_challenge) {
        this.challengeProgress.activate(_challenge)
        this.challenge = _challenge;
      }

      this.onWrapupPage = function onWrapupPage() {
        return jsChallengeProgress.activeChallenge() ? false : true;
      }

      // This will kind of "pre-load" abecedary.
      jsExecutor.run('0', '');
    }
  };
}]);
