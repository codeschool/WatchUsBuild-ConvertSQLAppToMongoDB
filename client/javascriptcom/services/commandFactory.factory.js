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
