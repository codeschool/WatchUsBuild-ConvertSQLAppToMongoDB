tests = `
var js = require('/courses/helper/index.js');

describe('set_a_var', function(){
  var message, errorMessage;

  before(function() {
    var setup = "var _alertCalled = false, _alertVal, _alert = alert; alert = function(val) { _alertVal = val; _alertCalled = true; return _alert(val); };";
    js.evaluate(setup);

    try {
      message = js.evaluate(code);
    } catch(e) {
      errorMessage = e.message;
    }
  });

  details(function() {
    return {
      output: message
    };
  });

  after(function() {
    js.evaluate("alert = _alert");
  });

  js.verify(code);

  it('f_no_alert', function(){
    var alertWasCalled = js.evaluate('_alertCalled');
    js.assert(alertWasCalled);
  });
  it('f_no_alert_val', function(){
    var alertWasCalled = js.evaluate('_alertVal');

    if (alertWasCalled === 0) { alertWasCalled = true };

    js.assert(alertWasCalled);
  });
  it('f_alert_not_int', function(){
    var alertVal = js.evaluate('_alertVal');
    js.assert(typeof alertVal === 'number');
  });
});
`

failures = {
  'f_no_alert': {
    "message": "You didn't call the alert function! Try typing `alert();` in the console."
  },
  'f_no_alert_val': {
    'message': "Here's a sample name to see how it works: `alert(42);`"
  },
  'f_alert_not_int': {
    'message': "You want your alert to be a number, so try something like 42."
  }
};

module.exports = {
  'id': 6,
  'title': 'Numbers',
  'instructions': `Great! Notice how your name printed out on the screen below, showing you the value inside the variable.

So far we have only worked with 1 value type (strings), but JavaScript has many! Another example of a value type is a number. Pass any number of your choosing into the alert function. Just like a function, a number does not get quotations.

<code class=\"inlineCode inlineCode--btn\"><svg class=\"icon inlineCode-icon\" width=\"16\" height=\"16\"><use xlink:href=\"#icon-submit\"/></svg>alert(42);</code>`,
  'tests': tests,
  'failures': failures,
  'answer': "alert(42);"
};
