angular.module('javascriptcom').factory('jsChallengeProgress', ['_', '$cookies', 'jsCourseState', function(_, $cookies, jsCourseState) {
  var state = {
    courseCompleted: false,
    challenges: [],
    console: null,
    setChallenges: function setChallenge(challenges) {
      this.challenges = challenges;
    },
    next: function() {
      var challengeIndex = _.findIndex(this.challenges, { active: true });

      this.setCookies(challengeIndex);

      if(challengeIndex+1 == this.challenges.length) {
        this.courseCompleted                   = true;
        this.challenges[challengeIndex].active = false;

        return true;
      }

      this.challenges[challengeIndex].active      = false;
      this.challenges[challengeIndex + 1].active  = true;
      this.challenges[challengeIndex + 1].started = true;
    },

    setCookies: function(challengeIndex) {
      $cookies.putObject('course_state', jsCourseState.state);

      var cookieChallengeState = $cookies.get('course_challenge_state');

      if (cookieChallengeState <= challengeIndex + 1 || cookieChallengeState === undefined) {
        $cookies.put('course_challenge_state', challengeIndex + 1);
      }
    },

    fastForward: function(challengeIndex) {
      var _this = this;

      _.times(challengeIndex, function(n) {
        _this.challenges[n].completed = true;
        _this.challenges[n].active    = false;
        _this.challenges[n].started   = true;
      });

      if (parseInt(challengeIndex) === this.challenges.length) {
        this.challenges[challengeIndex - 1].active = false;
        this.courseCompleted                       = true;
      } else {
        this.challenges[challengeIndex].active  = true;
        this.challenges[challengeIndex].started = true;
      }
    },

    activate: function(challenge) {
      if(this.activeChallenge() == challenge) {
        return true;
      }

      this.deactivateAll();
      if(challenge && !challenge.active) {
        challenge.active = true;
        challenge.started = true;
      }
    },

    deactivateAll: function() {
      _.each(this.challenges, function(challenge) {
        challenge.active = false;
      })
    },

    activeChallenge: function() {
      return _.find(this.challenges, { active: true });
    }
  }

  return state;
}]);
