var iframeTemplate = require('./iframe'); 
var code = require('./code');
var tests = require('./tests');
var answer = require('./answer');

module.exports = {
  name: "Sample JavaScript Challenge",
  iframe: iframeTemplate,
  code: code,
  tests: tests,
  answer: answer,
  syntax: 'javascript',
  question: "Write an add function that adds two numbers and returns the result.",
  options: {
    bail: true
  }
}