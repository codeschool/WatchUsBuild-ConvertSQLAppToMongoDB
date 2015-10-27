tests = `
var js = require('/courses/helper/index.js');

describe('alert example', function() {
  var message, errorMessage;

  before(function() {
    var setup = "var _alertCalled = false; var _alert = alert; alert = function(val) { _alertCalled = true; return _alert(val); };";
    js.evaluate(setup);

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

  it('f_no_alert', function() {
    var alertWasCalled = js.evaluate('_alertCalled');
    js.assert(alertWasCalled);
  });
});
`

failures = {
  "f_error": {
    "message": "Uh oh, it looks like your code won't run. Here's the error message we're getting"
  },
  'f_no_alert': {
    'message': "You didn't call the alert function! Try typing `alert();` in the console.",
    'hint':    'Call the alert function by typing the following: `alert();`'
  }
};

module.exports = {
  'id': 2,
  'title': 'Functions',
  'instructions': `Great job, {{username}}! In JavaScript, when we surround a word with quotes it's called a *string*, and when we're done with a line of code we finish it with a semicolon.

JavaScript also has built-in features, called *functions*. In order to call a function, we simply write its name (this time without quotes) and end it with a set of parentheses. Try calling the \`alert\` function as you see below.

Don't be afraid when a box pops up &mdash; that's your code working, {{username}}!

<code class=\"inlineCode inlineCode--btn\"><svg class=\"icon inlineCode-icon\" width=\"16\" height=\"16\"><use xlink:href=\"#icon-submit\"/></svg>alert();</code>`,
  'hints': [
    'Call the alert function by typing the following: `alert();`'
  ],
  'tests': tests,
  'failures': failures,
  'answer': 'alert();'
};
