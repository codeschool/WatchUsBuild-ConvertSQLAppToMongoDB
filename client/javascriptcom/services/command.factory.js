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
