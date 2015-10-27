var iframeTemplate = require('./iframe'); 
var code = require('./code');
var tests = require('./tests');
var answer = require('./answer');

module.exports = {
  name: "Sample JavaScript Challenge With Logging",
  iframe: iframeTemplate,
  code: code,
  tests: tests,
  answer: answer,
  syntax: 'javascript',
  question: "Log the message `Hello, World!` to the console.",
  options: {
    bail: true
  }
}