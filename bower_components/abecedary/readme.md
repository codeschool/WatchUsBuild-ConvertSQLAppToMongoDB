_This project is still being developed, so some of the following won't work until we actually implement it. This warning will be removed once the project is safe to actually use._

# abecedary

abecedary is a client side JavaScript executor API that allows for non-opinionated testing within the sandbox. The test should decide how to interpret the input, which is up to the client to provide.

> abecedary
> n.  1.  A primer; the first principle or rudiment of anything.

To see an example project using abecedary, check out [abecedary-example](http://codeschool.github.io/abecedary/example/).

## Example

abecedary uses [Mocha](https://github.com/visionmedia/mocha) for running all tests, with the ability to extend it with any CommonJS style modules.

```javascript
var iframeTemplate = [
  '<!DOCTYPE html>',
  '<html>',
  '  <head>',
  '    <title>Abecedary Tests</title>',
  '  </head>',
  '  <body>',
  '    <script src="/dependencies.js"></script>',
  '  </body>',
  '</html>'
].join('\n');
var sandbox = new Abcedary('http://somewhere.amazon.s3.com/iframe.html', iframeTemplate);

sandbox.on('complete', function(results) {
  console.log('Run Complete!');
  console.log(results);
});

var code = [
  'function add(first, second) {',
  '  return first + second;',
  '}'
].join('\n');

var tests = [
var assert = require('chai').assert;
var Sandbox = require('javascript-sandbox');

describe('add', function() {
  before(function() {
    var sandbox = new Sandbox(code);
  });
  it('Be sure to define a function named `add`.', function() {
    assert(sandbox.run(function() {
      return typeof(add) === 'function';
    });
  });
  it('Your `add` function should take in two arguments.', function() {
    assert(sandbox.run(function() {
      return add.length == 2;
    });
  });
  it('`add` should return the result of adding the two arguments.', function() {
    assert(sandbox.run(function() {
      return (add(4, 8) == 12) && (add(1, 2) == 3)
    });
  });
});
].join('\n');

sandbox.run(editor, tests)
```

This example sets up a [stuff.js](https://github.com/Codecademy/stuff.js) iFrame on S3, with a given template as the sub-iFrame. This sub-iFrame is where the Mocha tests are run. The actual Mocha tests should not evaluate JavaScript, but rather defer that to another iFrame in order to prevent contamination of other tests. This page includes the `dependencies.js` file which then contains a number of things:

* [Mocha](https://github.com/visionmedia/mocha)
* A custom Mocha reporter to get feedback.
* [Chai](https://github.com/chaijs/chai)
* Another NPM module, `javascript-sandbox` used for running JavaScript quietly (no `alerts`, preventing infinite loops).

This file can be packaged up to include whatever you need for testing the given code. Mocha and the custom reporter are the only required dependencies -- anything else is up to you to use.

## Installation

This library is designed to be used in combination with other CommonJS style libraries, but a packaged version is also available. Here are the potential ways to use this library:

Grab the packaged file from `./dist/abecedary.js`. This includes all dependencies and should be used if you just want to set it up on a page without worrying about CommonJS.

You can use it with [Component](https://github.com/component/component).

```
$ component install codeschool/abecedary
```

Or with npm:

```
$ npm install codeschool/abecedary
```

You'll also need to copy the `dist/iframe.html` file to be available -- preferably on a different domain than your application.

## Building

This is a work in progress. You can use the grunt task to build out a distribution file to use per project.

## API

### new Abecedary(iframeUrl, iframeContent)

Will create a new [stuff.js](https://github.com/Codecademy/stuff.js) iFrame at the given URL with the given content. This content should include a compiled version of all requirements (Mocha, custom runner and any dependencies for your application).

This will attempt to create a new iFrame right away to be used when run.

## Abecedary#run(code, tests)

Will run the given tests passing in the code. Code can be a string, a hash or array. This allows you to pass in arbitrary code to use in your tests if you need to. For example, you might want something like:

```
{
  setup: 'var message = "Hello, World"',
  code: 'console.log(message)'
}
```

Where the user might have just entered the code `console.log(message)`, but you also want the code in `setup` to be available in the tests.

## Abecedary#on('complete', callback)

Will run the `callback` function after running tests.

## Abecedary#close

Will remove all [stuff.js](https://github.com/Codecademy/stuff.js) iFrames.


# Building

Until split, the out the build step is somewhat confusing here due to the number of assets.

This will pull down and build `build/*.[js,css]` assets that are used outside of the iFrame for the demo application.

```
$ component install
$ component build
```

To build the JavaScript used within the iFrame (which contains mocha, sinon and a number of other testing libraries), you'll need to do a few more steps

```
$ npm install
$ browserify -r sinon -r chai -r jquery-browserify -r esprima-jquery-map -o build/sandbox_vendor.js
$ grunt
```

This will pull down all external dependencies, build the `build/sandbox_vendor.js` file with all of these scripts able to be `require`'s at a high level, and then use `grunt` to concatenate this file with mocha and the mocha custom reporter.

# Running

Install the `serve` gem, and run serve to serve this directory on port 4000.

```
$ gem install serve
$ serve
```

Open up [http://localhost:4000](http://localhost:4000) and you should see 2 CodeMirror panes up and running!
