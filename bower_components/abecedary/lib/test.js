// This runs the code in the stuff.js iframe
// There is some error handling in here in case the tests themselves throw an erorr

module.exports = function(code, tests) {
  return [
    'try {',
    'window.code = JSON.parse('+JSON.stringify(JSON.stringify(code))+');',
    'mocha.suite.suites.shift()',
    tests,
    'window.mocha.run();',
    '} catch(e) {',
    '  var tests = '+JSON.stringify(JSON.stringify(tests))+';',
    '  if(window[e.name]) {',
    '    var error = new window[e.name](e.message);',
    '    error.type = e.type',
    '    error["arguments"] = e["arguments"];',

    //   Firefox
    '    if(e.lineNumber) { error.lineNumber = e.lineNumber - 4; }',
    '    if(e.columnNumber) { error.columnNumber = e.columnNumber; }',

    //   Others
    '    if(!e.lineNumber || !e.lineNumber) {',
    '      var errorPosition = e.stack.split("\\n")[1].match(/(\d+):(\d+)\\)$/);',
    '      error.lineNumber = errorPosition[1] - 4;',
    '      error.columnNumber = errorPosition[2];',
    '    }',

    '    if(error.lineNumber) { ',
    '      error.stack = "This is a test";',
    '    }',

    // '    var errorPosition = e.stack.split("\n")[1].match(/(\d+):(\d+)\)$/);',
    // '    if(errorPosition) {',
    // '      var lineNumber = errorPosition[1] - 4, // account for abecedary code',
    // '          character = errorPosition[2];',
    // '      error.stack = [',
    // '        "" + e.name + ": "+ e.message,',
    // '        "  at line " + lineNumber + ":" + character,',
    // '        "",',
    // '        ""+[lineNumber-1]": " + tests[lineNumber-1],',
    // '        ""+[lineNumber-2]": " + tests[lineNumber-1],',
    // '        ""+[lineNumber-3]": " + tests[lineNumber-1]',
    // '      ].join("\n")',
    // '    }',
    '  }',
    '  window.parent.stuffEmit("error", error || e);',
    '}',
    true
  ].join('\n');
}
