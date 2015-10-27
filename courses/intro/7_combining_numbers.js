tests = `
var js = require('/courses/helper/index.js');

describe('set_a_var', function(){
  var message, errorMessage;

  before(function() {
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

  it('f_no_math_operators', function() {
    js.assert(code.match(new RegExp('\\\\+|\\\\*|\\\\/|-')));
  });

  it('f_no_number_result', function() {
    js.assert(typeof message === 'number');
  });
});
`

failures = {
  "f_error": {
    "message": "Uh oh, it looks like your code won't run. Here's the error message we're getting"
  },
  'f_no_math_operators': {
    'message': "Try adding two numbers together, like 14 and 42"
  },
  'f_no_number_result': {
    'message': "Huh, the result wasn't a number. Try adding two numbers together."
  }
};

module.exports = {
  'id': 7,
  'title': 'Combining Numbers',
  'instructions': `We can also do math in JavaScript! Combine any 2 numbers like so:

<code class=\"inlineCode inlineCode--btn\"><svg class=\"icon inlineCode-icon\" width=\"16\" height=\"16\"><use xlink:href=\"#icon-submit\"/></svg>14 + 28;</code>`,
  'tests': tests,
  'failures': failures,
  'answer': "14 + 28;"
};
