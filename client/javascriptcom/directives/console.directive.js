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
