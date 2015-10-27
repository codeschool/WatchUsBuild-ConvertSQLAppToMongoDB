var fs   = require('fs');
var path = require('path');

challenges = [
  '1_string',
  '2_functions',
  '3_string_function_parameter',
  '4_variables',
  '5_variable_value',
  '6_numbers',
  '7_combining_numbers',
  '8_combining_strings'
];

module.exports = challenges.map(function(challenge) {
  return require(path.join(__dirname, challenge + '.js'));
});
