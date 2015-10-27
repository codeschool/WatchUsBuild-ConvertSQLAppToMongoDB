tests = `
var js = require('/courses/helper/index.js')

describe('console.log example', function() {
  var message, errorMessage;

  before(function() {
    var setup = "var _alertCalled = false; var _alertVal; var _alert = alert;";
    setup += "alert = function(val) { _alertVal = val; _alertCalled = true; return _alertVal === '__wrong__' ? false : _alert(val); };";
    js.evaluate(setup);

    var setupNames = "var " + js.state.username + " = '__wrong__';";
    setupNames += "var " + js.state.username.toLowerCase() + " = '__wrong__';";

    try {
      js.evaluate(setupNames);
    } catch(e) {}

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

  it('f_no_alert_val', function() {
    var alertWasCalled = js.evaluate('_alertVal');
    js.assert(alertWasCalled);
  });

  it('f_non_string_name', function() {
    var alertWasCalled = js.evaluate('_alertVal');
    js.assert(alertWasCalled !== '__wrong__');
  });

  it('f_string_not_passed', function() {
    var alertWasCalled = js.evaluate('_alertVal');
    js.assert(typeof alertWasCalled === 'string');
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
    'message': "Here's a sample name to see how it works: `alert(\"Taylor\");`"
  },
  'f_non_string_name': {
    'message': "You passed your name, but you didn't pass it as a string. Try adding quotes around it, like this: `\"Johnny\"`"
  },
  'f_string_not_passed': {
    'message': 'Make sure you pass a string, like `"Johnny"`, into the `alert` function.'
  }
};

module.exports = {
  'id': 3,
  'title': 'String Function Parameter',
  'instructions': `Nice pop-up box, {{username}}, but there wasn't much in it. How can we get that box to show your name?

Well, many functions (like the \`alert\` function) can take instructions, which we call *parameters*. By sending a string into the \`alert\` function, we can put text on the pop-up box. Try it!

<code class=\"inlineCode inlineCode--btn\"><svg class=\"icon inlineCode-icon\" width=\"16\" height=\"16\"><use xlink:href=\"#icon-submit\"/></svg>alert("{{username}}");</code>`,
  'hints': [
    "Type in your first name surrounded by double quotes inside the alert function: `alert(\"{{username}}\");`"
  ],
  'tests': tests,
  'failures': failures,
  'answer': "`alert(\"name\");`"
};
