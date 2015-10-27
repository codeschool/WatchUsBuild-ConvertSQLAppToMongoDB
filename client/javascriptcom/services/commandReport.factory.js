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
