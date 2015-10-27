angular.module('javascriptcom', ['ngResource', 'ngAnimate', 'ngCookies'])
  .config(['$httpProvider', function config($httpProvider) {
    $httpProvider.defaults.cache = true;
  }]);

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

angular.module('javascriptcom').directive('jsConsole', ['CSConsole', 'jsCommand', 'jsChallengeProgress', 'jsSuccessCloud', function(CSConsole, jsCommand, jsChallengeProgress, jsSuccessCloud) {
  return {
    templateUrl: 'templates/console.html',
    replace: true,
    scope: true,
    bindToController: true,
    controllerAs: 'ctrl',
    require: '^jsCourse',
    link: function(scope, element, attrs, ctrl) {
      element.on('click', function() {
        jsChallengeProgress.console.focus();
      });

      var onSuccess = function onSuccess(challenge) {
        if (!challenge) { return; }

        console.log('successful challenge!');

        challenge.completed = true;

        jsSuccessCloud.trigger();
        jsChallengeProgress.next();
      }

      var onFailure = function onFailure(challenge) {
        console.log('failed challenge!');
      }

      var command = new jsCommand(onSuccess, onFailure);
      var el = $(element).find('.console-ui')[0];

      jsChallengeProgress.console = new CSConsole(el, {
        prompt: '> ',
        syntax: 'javascript',
        autoFocus: true,
        welcomeMessage: $('<p>Press <code>enter</code> to submit commands</p>')[0],
        commandValidate: command.validate,
        commandHandle: command.handler
      });
    }
  };
}]);

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

angular.module('javascriptcom').directive('jsInstructions', ['jsChallengeProgress', 'jsCourseState', function(jsChallengeProgress, jsCourseState) {
  return {
    templateUrl: 'templates/instructions.html',
    replace: true,
    scope: true,
    bindToController: true,
    controllerAs: 'ctrl',
    require: '^jsChallenge',
    link: function(scope, element, attrs, ctrl) {
      ctrl.state = jsCourseState.state;

      $(element).on('click', 'code', function(e) {
        if(!jsChallengeProgress.console) { return true; }

        var csConsole = jsChallengeProgress.console,
            text      = $(this).text().split(''),
            timer     = (text.length > 15 ? 70 / 2 : 70),
            count     = 0;

        if($(this).text() === csConsole.getValue()) {
          csConsole.focus();

          return;
        }

        if (!ctrl.ticker) {
          csConsole.setValue('');

          ctrl.ticker = setInterval(function() {
            var letter = text[count];

            count += 1;

            if (letter) {
              csConsole.appendToInput(letter);
            } else {
              clearInterval(ctrl.ticker);
              ctrl.ticker = false;
            }
          }, timer);
        }

        csConsole.focus();
      });
    }
  };
}]);

angular.module('javascriptcom').directive('jsSafeHtml', ['$sce', function($sce) {
  return {
    restrict: 'A',
    scope: {
      jsSafeHtml: "@"
    },
    template: "<div ng-bind-html='safeHtml'></div>",
    link: function(scope, element, attrs) {
      var unregister = scope.$watch('jsSafeHtml', setHtml);

      function setHtml(value) {
        if(!value) { return; }
        scope.safeHtml = $sce.trustAsHtml(value.replace(/^\s+|\s+$/g, ''));
        unregister();
      }
    }
  };
}]);

angular.module('javascriptcom').directive('tooltip', function() {
  return {
    restrict: 'A',
    scope: {
      tooltip: '@'
    },
    link: function(scope, element, attrs) {
      $(element).tooltip({
        animation: false,
        container: 'body',
        trigger:   'hover',
        placement: 'bottom',
        title:     function() {
          return scope.tooltip;
        },
        viewport:  {
          selector: 'body',
          padding: 10
        }
      });
    }
  };
});

angular.module('javascriptcom').filter('markdown', ['marked', function(marked) {
  return function(text) {
    return marked(text);
  };
}]);

angular.module('javascriptcom').filter('stateify', ['$interpolate', function($interpolate) {
  return function(text, scope) {
    return $interpolate(text)(scope);
  };
}]);

angular.module('javascriptcom').factory('jsCommand', ['_', 'jsCommandFactory', 'jsChallengeProgress', '$filter', function(_, jsCommandFactory, jsChallengeProgress, $filter) {
  return function(successCallback, errorCallback) {
    var vm = this;

    function filterMessage(content) {
      var marked = $filter('markdown')(content.textContent);
      $(content).html(marked)[0];

      return { content: content };
    }

    function jsReportAdapter(content) {
      var messages = [];

      if (_.isArray(content)) {
        _.each(content, function(obj) {
          if (obj.content.textContent !== 'undefined') {
            messages.push(filterMessage(obj.content));
          }
        });
      } else {
        content = _.isObject(content) && content['content'] ? filterMessage(content['content']) : filterMessage(content);
        messages.push(content);
      }

      return messages;
    }

    vm.handler = function parseCommand(line, report) {
      var command = jsCommandFactory(line);

      var challenge = jsChallengeProgress.activeChallenge();

      command(challenge, line).then(function(content) {
        report(jsReportAdapter(content));
        successCallback(challenge);
      }, function(content) {
        report(jsReportAdapter(content));
        errorCallback(challenge);
      });
    }

    vm.validate = function validate(line) {
      return line.length > 0
    };
  };
}]);

// Maps a specific command to a specific handler.
// If none are found, runs as JavaScript.

angular.module('javascriptcom').factory('jsCommandFactory', ['_', 'jsJavaScriptCommand', function(_, jsJavaScriptCommand) {
  var matchers = [
    {
      pattern: /[.|\s]*/,
      handler: jsJavaScriptCommand
    }
  ];

  function jsCommandFactory(command) {
    return _.find(matchers, function(m) {
      return command.match(m.pattern);
    }).handler;
  }

  return jsCommandFactory;
}]);

// Represents a Mocha report object with a better interface

angular.module('javascriptcom').factory('jsCommandReport', ['_', function(_) {
  function jsCommandReport(challenge, report) {
    this.challenge = challenge;
    this.report = report;

    this.isSuccess = function() {
      return this.report.failures.length == 0;
    }

    this.state = function() {
      return this.report.details.state;
    }

    this.successMessage = function() {
      return "Correct!";
    }

    this.failureMessage = function() {
      return this.failure() ?
        _.compact([this.failure().message, this.errorMessage()]).join(': ') :
        this.errorMessage();
    }

    this.output = function() {
      return this.report.details.output;
    }

    this.failure = function() {
      return this.challenge.failures[this.failureName()];
    }

    this.failureName = function() {
      return this.report.failures[0].title;
    }

    this.errorMessage = function() {
      if(this.isSuccess()) { return null; }

      var message = (this.report.failures[0]['err']) ? this.report.failures[0]['err'].message : null;

      if(message && message.match(/Unspecified AssertionError/)) {
        return null;
      } else {
        return message;
      }
    }
  }

  return jsCommandReport;
}]);

angular.module('javascriptcom').factory('jsExecutor', ['Abecedary', function(Abecedary) {
  var iframeTemplate = [
    '<!DOCTYPE html>',
    '<html>',
    '  <head>',
    '    <title>Abecedary Tests</title>',
    '  </head>',
    '  <body>',
    '    <script src="/javascripts/abecedary-javascript-com.js"></script>',
    '  </body>',
    '</html>'
  ].join('\n');
  var sandbox = new Abecedary('/iframe.html', iframeTemplate);
  return sandbox;
}]);

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

angular.module('javascriptcom').factory('jsCourseState', ['_', function(_) {
  return {
    state: {},
    update: function(newState) {
      this.state = _.merge(this.state, newState)
    }
  };
}]);

angular.module('javascriptcom').factory('jsSuccessCloud', ['jsChallengeProgress', function(jsChallengeProgress) {
  return {
    trigger: function() {
      var iconMarkup = '', delay,scale, xOffset, zIndex;

      for (var i = 0; i < 12; i++) {
        xOffset = _.random(18, 82)
        scale = _.random(0.5, 1.4)
        zIndex = scale < 1 ? -1 : 1;
        delay = _.random(0, 0.5)

        iconMarkup += "<div class='message-icon' style='left: " + xOffset + "vw; transform: scale(" + scale + "); z-index: " + zIndex + "'><div class='message-icon-item has-handle tci' style='animation-delay: " + delay + "s'><svg width='70' height='70' class='handle icon'><use xlink:href='#icon-check'></use></svg></div></div>";
      }

      $('body').append("<div class='message js-message'><p class='message-text'>Success!</p>" + iconMarkup + "</div>");

      setTimeout(function() {
        $('.js-message').remove();
      }, 2000);
    }
  }
}]);

angular.module('javascriptcom').factory('jsCourseChallengeResource', function($resource) {
  return $resource('/courses/:course/challenges.json', {}, {});
});

angular.module('javascriptcom').factory('jsCourseResource', function($resource) {
  return $resource('/courses/:course.json', {}, {});
});

angular.module('javascriptcom').factory('Abecedary', ['$window',
  function Abecedary($window) {
    return $window.Abecedary;
  }
]);

angular.module('javascriptcom').factory('CSConsole', ['$window',
  function CSConsole($window) {
    return $window.CSConsole;
  }
]);

angular.module('javascriptcom').factory('$', ['$window',
  function jQuery($window) {
    return $window.$;
  }
]);

angular.module('javascriptcom').factory('_', ['$window',
  function lodash($window) {
    return $window._;
  }
]);

angular.module('javascriptcom').factory('marked', ['$window',
  function marked($window) {
    return $window.marked;
  }
]);

angular.module('javascriptcom').factory('jsJavaScriptCommand', ['$', '$q', 'jsExecutor', 'jsCourseState', 'jsCommandReport', function($, $q, jsExecutor, jsCourseState, jsCommandReport) {
  function generateResponse(content, className) {
    return { content: $("<div class='console-msg "+(className ? 'console-msg--'+className : '')+"'>"+content+"</div>")[0] };
  }

  function runJavaScriptCommand(challenge, line) {
    var deferred = $q.defer();

    function onComplete(results) {
      var response = [],
          result = new jsCommandReport(challenge, results),
          output = result.output();

      jsCourseState.update(result.state());

      response.push(generateResponse(output));

      if(result.isSuccess()) {
        jsExecutor.off('complete', onComplete);

        deferred.resolve(response);
      } else {
        response.push(generateResponse(result.failureMessage(), 'error'));
        deferred.reject(response);
      }
    }

    jsExecutor.on('complete', onComplete);

    noTest = "\
      var js = require('/courses/helper/index.js'); \
      describe('no tests', function() { \
        var message;\
        before(function() { \
          try { message = js.evaluate(code); } catch(e) {}; \
        }); \
        details(function() { \
          return { output: message } \
        }); \
      }); \
    ";

    var run = challenge ? challenge.tests : noTest;
    jsExecutor.run(line, run);

    return deferred.promise;
  }

  return runJavaScriptCommand;
}]);
