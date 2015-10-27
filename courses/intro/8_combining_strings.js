tests = `
var js = require('/courses/helper/index.js');

describe('set_a_var', function(){
  var message, errorMessage;

  before(function() {
    var setup = "var _alertCalled = false, _alertVal, _alert = alert; alert = function(val) { _alertVal = val; _alertCalled = true; return _alert(val); };";
    js.evaluate(setup);
    js.restoreName();

    try {
      message = js.evaluate(code);
    } catch(e) {
      errorMessage = e.message;
    }
  });

  after(function() {
    js.evaluate("alert = _alert");
  });

  details(function() {
    return {
      output: message
    };
  });

  js.verify(code);

  it('f_no_alert', function(){
    var alertWasCalled = js.evaluate('_alertCalled');
    js.assert(alertWasCalled);
  });
  it('f_no_alert_val', function(){
    var alertWasCalled = js.evaluate('_alertVal');
    js.assert(alertWasCalled);
  });
  it('f_missing_space', function() {
    var alertWasCalled = js.evaluate('_alertVal');
    js.assert(alertWasCalled !== js.state.username + "is awesome!");
  });
  it('f_didnt_use_firstName', function() {
    var alertWasCalled = js.evaluate('_alertVal');
    js.assert(alertWasCalled.match(js.state.username));
  });
  it('f_wrong_message', function() {
    var alertWasCalled = js.evaluate('_alertVal');
    js.assert(alertWasCalled === js.state.username + " is awesome!");
  });
});
`

failures = {
  "f_error": {
    "message": "Uh oh, it looks like your code won't run. Here's the error message we're getting"
  },
  'f_no_alert': {
    'message': 'You can call the alert function like this: `alert();`'
  },
  'f_no_alert_val': {
    'message': "Your alert message should look like this: `alert(firstName + \" is awesome!\");`"
  },
  'f_missing_space': {
    'message': 'In order for the sentence to make sense, you can add a space at the beginning of the string to look like this: `" is awesome!"`.'
  },
  'f_didnt_use_firstName': {
    'message': "Don't forget to use the `firstName` variable in the beginning of your alert."
  },
  'f_wrong_message': {
    'message': "Almost there, but make sure what you're passing to `alert` looks like this: `firstName + \" is awesome!\"`"
  }
};

module.exports = {
  'id': 8,
  'title': 'Combining Strings',
  'instructions': `Great math skills! JavaScript not only can combine numbers &mdash; it can combine strings as well!

Create an alert that combines both your name and a string, like below:

<code class=\"inlineCode inlineCode--btn\"><svg class=\"icon inlineCode-icon\" width=\"16\" height=\"16\"><use xlink:href=\"#icon-submit\"/></svg>alert(firstName + " is awesome!");</code>`,
  'tests': tests,
  'failures': failures,
  'answer': "alert(firstName + \" is awesome!\");"
};
