tests = `
var js = require('/courses/helper/index.js');

describe('set_a_var', function(){
  var message, errorMessage;

  before(function() {
    js.restoreName();

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

  js.verify(code);

  it('f_null', function(){
    js.assert(message != null);
  });

  it('f_not_username', function(){
    js.assert(message == js.state.username);
  });
});
`

failures = {
  "f_error": {
    "message": "Uh oh, it looks like your code won't run. Here's the error message we're getting"
  },
  'f_null': {
    'message': 'Nope. This variable does not have any value assigned to it.',
  },
  'f_not_username': {
    'message': 'That is not your name. Make sure to use the variable that you stored your name in.',
  }
};

module.exports = {
  'id': 5,
  'title': 'Variable Value',
  'instructions': `Now we have a variable called \`firstName\` that has a string stored inside of it. Output it to see what it looks like.

<code class=\"inlineCode inlineCode--btn\"><svg class=\"icon inlineCode-icon\" width=\"16\" height=\"16\"><use xlink:href=\"#icon-submit\"/></svg>firstName;</code>`,
  'tests': tests,
  'failures': failures,
  'answer': "test;"
};
