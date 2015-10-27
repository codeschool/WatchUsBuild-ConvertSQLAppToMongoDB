var assert  = require('chai').assert,
    Sandbox = require('javascript-sandbox'),
    jshint  = require('jshint').JSHINT;

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

function verify(code) {
  if (!jshint('/* jshint asi:true */' + code)) {
    var error = jshint.errors[0];

    if (!error.message) {
      error.message = 'Looks like there is a syntax error in your code: ' + error.reason || error.raw;
    }

    if (error.message.match(/Missing semicolon/)) return;
    if (error.message.match(/Expected an assignment or function call and instead saw an expression/)) return;

    it('f_jshint_error', function() {
      assert(false, error.message);
    });
  }
}

var state = {};

// getOwnPropertyNames doesn't work in IE 8 and below.
if (Object.getOwnPropertyNames(state).length === 0) {
  var courseState = readCookie('course_state'),
      tryName     = readCookie('try_name');

  if (courseState) {
    state = JSON.parse(decodeURIComponent(courseState));
  } else if (tryName) {
    state.username = tryName;
  }
}

module.exports = {
  assert: assert,
  verify: verify,
  Sandbox: Sandbox,
  activeSandbox: new Sandbox(),
  state: state,
  evaluate: function(code) {
    return this.activeSandbox.evaluate(code);
  },
  restoreName: function() {
    try {
      this.evaluate('firstName;');
    } catch(e) {
      this.evaluate('var firstName = "' + this.state.username + '";');
    }
  }
};
