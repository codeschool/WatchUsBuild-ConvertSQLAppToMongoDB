tests = `
var js = require('/courses/helper/index.js');

describe('set_name', function() {
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
      output: message,
      state: {
        username: message
      }
    };
  });

  js.verify(code);

  it('f_no_name', function() {
    js.assert(typeof(message) === 'string');
  });

  it('f_empty_string', function() {
    js.assert(message.length > 0);
  });

  details('state', function() {
    js.state.username = message;
    return {
      username: message
    };
  });
});
`

failures = {
  "f_error": {
    "message": "Uh oh, it looks like your code won't run. Here's the error message we're getting"
  },
  "f_no_name": {
    "message": "Uh oh, it looks like you didn\'t create a string with your first name.",
    "hint": "Here's an example that you can type in: `\"Gregg\";`"
  },
  "f_empty_string": {
    "message": "You have the quotes, but you need to put your name inside them.",
    "hint": "Here's an example that you can type in: `\"Gregg\";`"
  }
}

module.exports = {
  "id": 1,
  "title": "Strings",
  "instructions": "Start learning JavaScript with us by typing in your *first name* surrounded by quotation marks, and ending with a semicolon. For example, you could type a name like this:\n\n<code class=\"inlineCode inlineCode--btn\"><svg class=\"icon inlineCode-icon\" width=\"16\" height=\"16\"><use xlink:href=\"#icon-submit\"/></svg>\"{{username || 'Gregg'}}\";</code>",
  "tests": tests,
  "failures": failures,
  "answer": "\"Gregg\""
}
