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
