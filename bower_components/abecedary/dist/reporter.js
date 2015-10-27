// This file should be included in the iFrame is running your mocha tests
// Include it after Mocha

if(!eval && execScript) {
  execScript("null");
}

window.onerror = function(error) {
  window.parent.stuffEmit("error", error);
}

function rethrow(e, tests, offset) {
  error = e;
  try {
    if(window[e.name]) {
      var error = new window[e.name](e.message);
      error.type = e.type;
      error["arguments"] = e["arguments"];

      // Firefox
      if(e.lineNumber) { error.lineNumber = e.lineNumber - offset; }
      if(e.columnNumber) { error.columnNumber = e.columnNumber; }

      // Others
      if(!e.lineNumber || !e.lineNumber) {
        var errorPosition = e.stack.split("\n")[1].match(/(\d+):(\d+)\)$/);
        error.lineNumber = errorPosition[1] - offset;
        error.columnNumber = +errorPosition[2];
      }

      if(error.lineNumber) {
        error.stack = generateStackstrace(error, tests);
      }
    }
  } catch(error) {
    error = e;
  } finally {
    window.parent.stuffEmit("error", error);
  }
}

function generateStackstrace(error, code) {
  var lines = code.split("\n");
  return [
    "" + error.name + ": "+ error.message,
    "  at line " + error.lineNumber+1 + ":" + error.columnNumber,
    "",
    ""+[error.lineNumber-1]+" : " + lines[error.lineNumber-2],
    ""+[error.lineNumber]+" : " + lines[error.lineNumber-1],
    ""+[error.lineNumber+1]+">: " + lines[error.lineNumber],
    ""+[error.lineNumber+2]+" : " + lines[error.lineNumber+1],
    ""+[error.lineNumber+3]+" : " + lines[error.lineNumber+2]
  ].join("\n");
}


// Deep clone that only grabs strings and numbers
function cleanObject(error, depth) {
  if(!error || depth > 5) { return null; }

  depth = depth || 0;

  var response = {};
  for(var key in error) {
    try {
      if(key[0] == "_" || key[0] == "$" || key == 'ctx' || key == 'parent') {
        // Skip underscored variables
      } else if(typeof(error[key]) == 'string' || typeof(error[key]) == 'number') {
        response[key] = error[key];
      } else if(typeof(error[key]) == 'object') {
        response[key] = cleanObject(error[key], depth + 1)
      }
    } catch(e) {
      response[key] = 'Unable to process this result.'
    }
  };

  return response;
}

function AbecedaryReporter(runner) {
  var self = this;
  Mocha.reporters.Base.call(this, runner);
  var tests = [], failures = [], passes = [], details = {};

  runner.on('details', function(test, results){
    try {
      if(test.title) {
        details[test.title] = results;
      } else if(results) {
        for(var result in results) {
          details[result] = results[result];
        }
      }
    } catch(e) { }
  });

  runner.on('test end', function(test){
    tests.push(test);
  });

  runner.on('pass', function(test){
    passes.push(test);
  });

  runner.on('fail', function(test){
    failures.push(test);
  });

  runner.on('end', function(){
    var data = {
        stats: self.stats, 
        tests: tests.map(cleanObject),
        failures: failures.map(cleanObject),
        passes: passes.map(cleanObject),
        details: details
    };
    window.parent.stuffEmit('finished', data);
  });
}
function F(){};
F.prototype =  Mocha.reporters.Base.prototype;
AbecedaryReporter.prototype = new F;
AbecedaryReporter.prototype.constructor = AbecedaryReporter

// Abecedary: Custom type for details
Mocha.Details = function(title, fn) {
  Mocha.Runnable.call(this, title, fn);
  this.pending = !fn;
  this.type = 'details';
}
Mocha.Details.prototype.__proto__ = Mocha.Runnable.prototype;



// Abecedary: Custom interface based on BDD with additional `details`.
function AbecedaryInterface(suite) {
  var Suite = Mocha.Suite,
      Test = Mocha.Test,
      utils = Mocha.utils;

  var suites = [suite];

  suite.on('pre-require', function(context, file, mocha){
    /**
     * Execute before running tests.
     */

    context.before = function(fn){
      suites[0].beforeAll(fn);
    };

    /**
     * Execute after running tests.
     */

    context.after = function(fn){
      suites[0].afterAll(fn);
    };

    /**
     * Execute before each test case.
     */

    context.beforeEach = function(fn){
      suites[0].beforeEach(fn);
    };

    /**
     * Execute after each test case.
     */

    context.afterEach = function(fn){
      suites[0].afterEach(fn);
    };

    /**
     * Describe a "suite" with the given `title`
     * and callback `fn` containing nested suites
     * and/or tests.
     */

    context.describe = context.context = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suites.unshift(suite);
      fn.call(suite);
      suites.shift();
      return suite;
    };

    /**
     * Pending describe.
     */

    context.xdescribe =
    context.xcontext =
    context.describe.skip = function(title, fn){
      var suite = Suite.create(suites[0], title);
      suite.pending = true;
      suites.unshift(suite);
      fn.call(suite);
      suites.shift();
    };

    /**
     * Exclusive suite.
     */

    context.describe.only = function(title, fn){
      var suite = context.describe(title, fn);
      mocha.grep(suite.fullTitle());
      return suite;
    };

    /**
     * Describe a specification or test-case
     * with the given `title` and callback `fn`
     * acting as a thunk.
     */

    context.it = context.specify = function(title, fn){
      var suite = suites[0];
      if (suite.pending) var fn = null;
      var test = new Test(title, fn);
      suite.addTest(test);
      return test;
    };

    /** 
      Passes details up to the finalized report object 
      with the given info key.
    */
    context.details = function(title, fn) {
      var suite = suites[0];
      suite = suite && suite.suites && suite.suites.length > 0 ? suite.suites[0] : suite;
      if (suite.pending) var fn = null;
      if (!fn) {
        fn = title;
        title = null;
      }
      var test = new Mocha.Details(title, fn);
      suite.addTest(test);
      return test;
    }

    /**
     * Exclusive test-case.
     */

    context.it.only = function(title, fn){
      var test = context.it(title, fn);
      var reString = '^' + utils.escapeRegexp(test.fullTitle()) + '$';
      mocha.grep(new RegExp(reString));
      return test;
    };

    /**
     * Pending test case.
     */

    context.xit =
    context.xspecify =
    context.it.skip = function(title){
      context.it(title);
    };
  });
}

// Need to override this to be able to set a ui type by name
Mocha.prototype.ui = function(name){
  if(typeof(name) == 'function') {
    this._ui = name(this.suite);
  } else {
    name = name || 'bdd';
    this._ui = Mocha.interfaces[name](this.suite);
  }
  return this;
};


// Abecedary: Override `run` to pass function result to the callback
Mocha.Runnable.prototype.run = function(fn){
  var self = this
    , ms = this.timeout()
    , start = new Date
    , ctx = this.ctx
    , finished
    , emitted
    , result;

  if (ctx) {
    result = ctx.runnable(this);
  }

  // timeout
  if (this.async) {
    if (ms) {
      this.timer = setTimeout(function(){
        done(new Error('timeout of ' + ms + 'ms exceeded'));
        self.timedOut = true;
      }, ms);
    }
  }

  // called multiple times
  function multiple(err) {
    if (emitted) return;
    emitted = true;
    self.emit('error', err || new Error('done() called multiple times'));
  }

  // finished
  function done(err) {
    if (self.timedOut) return;
    if (finished) return multiple(err);
    self.clearTimeout();
    self.duration = new Date - start;
    finished = true;
    fn(err);
  }

  // for .resetTimeout()
  this.callback = done;

  // async
  if (this.async) {
    try {
      this.fn.call(ctx, function(err){
        if (err instanceof Error || toString.call(err) === "[object Error]") return done(err);
        if (null != err) return done(new Error('done() invoked with non-Error: ' + err));
        done();
      }, result);
    } catch (err) {
      done(err);
    }
    return;
  }

  if (this.asyncOnly) {
    return done(new Error('--async-only option in use without declaring `done()`'));
  }

  // sync
  try {
    if (!this.pending) { result = this.fn.call(ctx); }
    this.duration = new Date - start;
    fn(null, result);
  } catch (err) {
    fn(err);
  }
};


// Updated code bits are commented. Most of this function remains the same.
Mocha.Runner.prototype.runTests = function(suite, fn){
  var self = this
    , tests = suite.tests.slice()
    , test;


  function hookErr(err, errSuite, after) {
    // before/after Each hook for errSuite failed:
    var orig = self.suite;

    // for failed 'after each' hook start from errSuite parent,
    // otherwise start from errSuite itself
    self.suite = after ? errSuite.parent : errSuite;

    if (self.suite) {
      // call hookUp afterEach
      self.hookUp('afterEach', function(err2, errSuite2) {
        self.suite = orig;
        // some hooks may fail even now
        if (err2) return hookErr(err2, errSuite2, true);
        // report error suite
        fn(errSuite);
      });
    } else {
      // there is no need calling other 'after each' hooks
      self.suite = orig;
      fn(errSuite);
    }
  }

  function next(err, errSuite) {
    // if we bail after first err
    if (self.failures && suite._bail) return fn();

    if (self._abort) return fn();

    if (err) return hookErr(err, errSuite, true);

    // next test
    test = tests.shift();

    // all done
    if (!test) return fn();

    // grep
    var match = self._grep.test(test.fullTitle());
    if (self._invert) match = !match;
    if (!match) return next();

    // pending
    if (test.pending) {
      self.emit('pending', test);
      self.emit('test end', test);
      return next();
    }

    // execute test and hook(s)
    self.emit('test', self.test = test);
    self.hookDown('beforeEach', function(err, errSuite){

      if (err) return hookErr(err, errSuite, false);

      self.currentRunnable = self.test;
      self.runTest(function(err, results){ // Abecedary: Added results for details
        test = self.test;

        if (err) {
          self.fail(test, err);
          self.emit('test end', test);
          return self.hookUp('afterEach', next);
        }

        test.state = 'passed';
        if(test.type === 'details') { // Abecedary: Added details block
          self.emit('details', test, results);
        } else {
          self.emit('pass', test);
        }
        self.emit('test end', test);
        self.hookUp('afterEach', next);
      });
    });
  }

  this.next = next;
  next();
};

mocha.globals(['code']);
window.parent.stuffEmit('loaded');
this.mocha.setup({ reporter: AbecedaryReporter, ui: AbecedaryInterface });
