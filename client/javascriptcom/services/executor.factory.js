angular.module('javascriptcom').factory('jsExecutor', ['Abecedary', function(Abecedary) {
  var iframeTemplate = [
    '<!DOCTYPE html>',
    '<html>',
    '  <head>',
    '    <title>Abecedary Tests</title>',
    '  </head>',
    '  <body>',
    '    <script src="/javascripts/abecedary-javascript-com.js"></script>',
    '  </body>',
    '</html>'
  ].join('\n');
  var sandbox = new Abecedary('/iframe.html', iframeTemplate);
  return sandbox;
}]);
