var dom = require('dom');
var debounce = require('debounce');
var extend = require('extend');
var Abcedary = require('abecedary');
var CodeMirror = require('codemirror');
require('codemirror-mode-javascript')(CodeMirror);


var example, sandbox, editor, tests, runWrapper,
    options = {
      indentUnit: 2,
      tabSize: 2,
      theme: 'vibrant-ink',
      lineNumbers: true,
      lineWrapping: true,
      gutters: ["CodeMirror-foldgutter"]
    }

// Control the tabs for code/tests
dom('.nav-tabs a').on('click', function (e) {
  e.preventDefault();

  dom('.active').removeClass('active')
  dom(this).parent().addClass('active')
  dom('#' + dom(this).attr('data-loc')).addClass('active');

  editor.refresh();
  tests.refresh();
  answer.refresh();
})

function teardown() {
  if(typeof(example) !== 'undefined') { 
    sandbox.close();
    editor.off('change', runWrapper);
    tests.off('change', runWrapper);
    dom('.CodeMirror').remove();
  }
}

function formatDetails(details) {
  var results = details;
  if(details instanceof Array) {
    results = dom("<ul></ul>");
    for(var detail in details) {
      results.append("<li>" + details[detail] + "</li>");
    }
  }
  return results;
}

function setup(subexample) {
  teardown();
  example = require(subexample);

  // Change the interface up for this new question
  dom('#question h3').text(example.name);
  dom('#question .instructions').text(example.question);

  // Ideally, this iFrame would be on a different domain.
  var iframeUrl = window.location.toString() + "../dist/iframe.html";

  // Add all the needed content
  editor = new CodeMirror(dom('.editor')[0], extend({ value: example.code, syntax: example.syntax }, options));
  tests = new CodeMirror(dom('.tests')[0], extend({ value: example.tests, syntax: example.syntax }, options)),
  answer = new CodeMirror(dom('.answer')[0], extend({ value: example.answer, syntax: example.syntax }, options));

  runWrapper = debounce(function () {
    console.log("Running tests for: " + example.name);
    sandbox = new Abcedary(iframeUrl, example.iframe, example.options);
    sandbox.run(editor.getValue(), tests.getValue());

    sandbox.on('error', function(error) {
      console.log('An Error Occured running the tests:' );
      console.log(error.stack);
      sandbox.close();
    });

    // Run whenever a test run completes
    sandbox.on('complete', function(results) {
      sandbox.close();
      console.log('sandbox run complete: ');
      console.log(results);

      dom('#content .stats').text("Passing: " + results.stats.passes + " / failures: " + results.stats.failures + " / duration: " + results.stats.duration);

      var list = dom('.tasks')
      list.empty()

      for(var test in results.passes) {
        list.append("<li class='success'>"+results.passes[test].title+"</li>");
      }
      var message;
      for(var test in results.failures) {
        message = results.failures[test].err.reason ? ("<p>" + results.failures[test].err.reason + "</p>") : "";
        list.append("<li class='failure'><p>"+results.failures[test].title+"</p>"+message+"</li>");
      }

      // Output the details if there are any:
      var details = dom('.details ul')
      details.empty()
      for(var detail in results.details) {
        li = dom("<li>" + detail + ": <div></div></li>");
        li.find("div").append(formatDetails(results.details[detail]));
        details.append(li);
      }
    });
  }, 250);

  editor.on('change', runWrapper);
  tests.on('change', runWrapper);

  // Run the tests once to start things off.
  runWrapper();
}

setup('javascript');

dom('#examples a').on('click', function(e) {
  e.preventDefault();
  setup(dom(this).attr('data-example'));
});
