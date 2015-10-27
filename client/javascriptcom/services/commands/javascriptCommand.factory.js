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
