var component = require('./lib/component'),
    runner = require('./lib/runner.js'),
    stuff = component('adamfortuna-stuff.js'),
    emitter = component('component-emitter'),
    Promise = component('then-promise'),
    extend = component('segmentio-extend');

function Abecedary(iframeUrl, template, options) {
  var generateElement = function() {
    var element = document.createElement('div');
    element.style.cssText = 'display:none;';
    document.body.appendChild(element);
    return element;
  }

  this.options = options || {};
  this.iframeUrl = iframeUrl;
  this.template = template;
  this.options = extend({ ui: "bdd", bail: true, ignoreLeaks: true }, this.options);
  this.element = this.options.element || generateElement()
  delete(this.options.element);

  this.sandbox = new Promise(function (resolve, reject) {
    stuff(this.iframeUrl, { el: this.element }, function (context) {
      // Whenever we run tests in the sandbox, call runComplete
      context.on('finished', runComplete.bind(this));
      context.on('loaded', loaded.bind(this, { resolve: resolve, reject: reject }));
      context.on('error', error.bind(this));

      // Contains the initial HTML and libraries needed to run tests,
      // as well as the tests themselves, but not the code
      context.load(this.template);

      this.context = context;
    }.bind(this));
  }.bind(this));

  //  Publicize the run is done
  var runComplete = function(report) {
    this.emit('complete', report);
  };

  // Setup Mocha upon completion
  var loaded = function(promise, report) {
    this.context.evaljs('mocha.setup('+ JSON.stringify(this.options) +');');
    promise.resolve(this.context);
  };

  // Emit the error
  var error = function(error) {
    this.emit('error', error, this);
  };
}
emitter(Abecedary.prototype);

// Public API to run tests against code
// Doesn't return anything, but emit a `complete` event when finished
Abecedary.prototype.run = function(code, tests) {
  var _this = this;

  //lineNumber || columnNumber 
  this.sandbox.then(function(context) {
    try {
      context.evaljs(runner(code, tests || _this.tests));
    } catch(e) {
      _this.emit('error', e);
    }
  });
}

// Public
//   Removes any iFrames that are lingering around
Abecedary.prototype.close = function(data) {
  this.element.parentElement.removeChild(this.element);
}

module.exports = Abecedary;
