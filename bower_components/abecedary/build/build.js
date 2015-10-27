
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-emitter/index.js", function(exports, require, module){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

});
require.register("johntron-asap/asap.js", function(exports, require, module){
"use strict";

// Use the fastest possible means to execute a task in a future turn
// of the event loop.

// linked list of tasks (single, with head node)
var head = {task: void 0, next: null};
var tail = head;
var flushing = false;
var requestFlush = void 0;
var hasSetImmediate = typeof setImmediate === "function";
var domain;

if (typeof global != 'undefined') {
	// Avoid shims from browserify.
	// The existence of `global` in browsers is guaranteed by browserify.
	var process = global.process;
}

// Note that some fake-Node environments,
// like the Mocha test runner, introduce a `process` global.
var isNodeJS = !!process && ({}).toString.call(process) === "[object process]";

function flush() {
    /* jshint loopfunc: true */

    while (head.next) {
        head = head.next;
        var task = head.task;
        head.task = void 0;

        try {
            task();

        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them to interrupt flushing!

                // Ensure continuation if an uncaught exception is suppressed
                // listening process.on("uncaughtException") or domain("error").
                requestFlush();

                throw e;

            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }
    }

    flushing = false;
}

if (isNodeJS) {
    // Node.js
    requestFlush = function () {
        // Ensure flushing is not bound to any domain.
        var currentDomain = process.domain;
        if (currentDomain) {
            domain = domain || (1,require)("domain");
            domain.active = process.domain = null;
        }

        // Avoid tick recursion - use setImmediate if it exists.
        if (flushing && hasSetImmediate) {
            setImmediate(flush);
        } else {
            process.nextTick(flush);
        }

        if (currentDomain) {
            domain.active = process.domain = currentDomain;
        }
    };

} else if (hasSetImmediate) {
    // In IE10, or https://github.com/NobleJS/setImmediate
    requestFlush = function () {
        setImmediate(flush);
    };

} else if (typeof MessageChannel !== "undefined") {
    // modern browsers
    // http://www.nonblocking.io/2011/06/windownexttick.html
    var channel = new MessageChannel();
    // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
    // working message ports the first time a page loads.
    channel.port1.onmessage = function () {
        requestFlush = requestPortFlush;
        channel.port1.onmessage = flush;
        flush();
    };
    var requestPortFlush = function () {
        // Opera requires us to provide a message payload, regardless of
        // whether we use it.
        channel.port2.postMessage(0);
    };
    requestFlush = function () {
        setTimeout(flush, 0);
        requestPortFlush();
    };

} else {
    // old browsers
    requestFlush = function () {
        setTimeout(flush, 0);
    };
}

function asap(task) {
    if (isNodeJS && process.domain) {
        task = process.domain.bind(task);
    }

    tail = tail.next = {task: task, next: null};

    if (!flushing) {
        requestFlush();
        flushing = true;
    }
};

module.exports = asap;

});
require.register("then-promise/index.js", function(exports, require, module){
'use strict';

//This file contains then/promise specific extensions to the core promise API

var Promise = require('./core.js')
var asap = require('asap')

module.exports = Promise

/* Static Functions */

function ValuePromise(value) {
  this.then = function (onFulfilled) {
    if (typeof onFulfilled !== 'function') return this
    return new Promise(function (resolve, reject) {
      asap(function () {
        try {
          resolve(onFulfilled(value))
        } catch (ex) {
          reject(ex);
        }
      })
    })
  }
}
ValuePromise.prototype = Object.create(Promise.prototype)

var TRUE = new ValuePromise(true)
var FALSE = new ValuePromise(false)
var NULL = new ValuePromise(null)
var UNDEFINED = new ValuePromise(undefined)
var ZERO = new ValuePromise(0)
var EMPTYSTRING = new ValuePromise('')

Promise.from = Promise.cast = function (value) {
  if (value instanceof Promise) return value

  if (value === null) return NULL
  if (value === undefined) return UNDEFINED
  if (value === true) return TRUE
  if (value === false) return FALSE
  if (value === 0) return ZERO
  if (value === '') return EMPTYSTRING

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then
      if (typeof then === 'function') {
        return new Promise(then.bind(value))
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex)
      })
    }
  }

  return new ValuePromise(value)
}
Promise.denodeify = function (fn, argumentCount) {
  argumentCount = argumentCount || Infinity
  return function () {
    var self = this
    var args = Array.prototype.slice.call(arguments)
    return new Promise(function (resolve, reject) {
      while (args.length && args.length > argumentCount) {
        args.pop()
      }
      args.push(function (err, res) {
        if (err) reject(err)
        else resolve(res)
      })
      fn.apply(self, args)
    })
  }
}
Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments)
    var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null
    try {
      return fn.apply(this, arguments).nodeify(callback)
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) { reject(ex) })
      } else {
        asap(function () {
          callback(ex)
        })
      }
    }
  }
}

Promise.all = function () {
  var args = Array.prototype.slice.call(arguments.length === 1 && Array.isArray(arguments[0]) ? arguments[0] : arguments)

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([])
    var remaining = args.length
    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          var then = val.then
          if (typeof then === 'function') {
            then.call(val, function (val) { res(i, val) }, reject)
            return
          }
        }
        args[i] = val
        if (--remaining === 0) {
          resolve(args);
        }
      } catch (ex) {
        reject(ex)
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i])
    }
  })
}

/* Prototype Methods */

Promise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this
  self.then(null, function (err) {
    asap(function () {
      throw err
    })
  })
}

Promise.prototype.nodeify = function (callback) {
  if (callback === null || typeof callback == 'undefined') return this

  this.then(function (value) {
    asap(function () {
      callback(null, value)
    })
  }, function (err) {
    asap(function () {
      callback(err)
    })
  })
}

Promise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected);
}


Promise.resolve = function (value) {
  return new Promise(function (resolve) { 
    resolve(value);
  });
}

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) { 
    reject(value);
  });
}

Promise.race = function (values) {
  return new Promise(function (resolve, reject) { 
    values.map(function(value){
      Promise.cast(value).then(resolve, reject);
    })
  });
}

});
require.register("then-promise/core.js", function(exports, require, module){
'use strict';

var asap = require('asap')

module.exports = Promise
function Promise(fn) {
  if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new')
  if (typeof fn !== 'function') throw new TypeError('not a function')
  var state = null
  var value = null
  var deferreds = []
  var self = this

  this.then = function(onFulfilled, onRejected) {
    return new Promise(function(resolve, reject) {
      handle(new Handler(onFulfilled, onRejected, resolve, reject))
    })
  }

  function handle(deferred) {
    if (state === null) {
      deferreds.push(deferred)
      return
    }
    asap(function() {
      var cb = state ? deferred.onFulfilled : deferred.onRejected
      if (cb === null) {
        (state ? deferred.resolve : deferred.reject)(value)
        return
      }
      var ret
      try {
        ret = cb(value)
      }
      catch (e) {
        deferred.reject(e)
        return
      }
      deferred.resolve(ret)
    })
  }

  function resolve(newValue) {
    try { //Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.')
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then
        if (typeof then === 'function') {
          doResolve(then.bind(newValue), resolve, reject)
          return
        }
      }
      state = true
      value = newValue
      finale()
    } catch (e) { reject(e) }
  }

  function reject(newValue) {
    state = false
    value = newValue
    finale()
  }

  function finale() {
    for (var i = 0, len = deferreds.length; i < len; i++)
      handle(deferreds[i])
    deferreds = null
  }

  doResolve(fn, resolve, reject)
}


function Handler(onFulfilled, onRejected, resolve, reject){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null
  this.onRejected = typeof onRejected === 'function' ? onRejected : null
  this.resolve = resolve
  this.reject = reject
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, onFulfilled, onRejected) {
  var done = false;
  try {
    fn(function (value) {
      if (done) return
      done = true
      onFulfilled(value)
    }, function (reason) {
      if (done) return
      done = true
      onRejected(reason)
    })
  } catch (ex) {
    if (done) return
    done = true
    onRejected(ex)
  }
}

});
require.register("segmentio-extend/index.js", function(exports, require, module){

module.exports = function extend (object) {
    // Takes an unlimited number of extenders.
    var args = Array.prototype.slice.call(arguments, 1);

    // For each extender, copy their properties on our object.
    for (var i = 0, source; source = args[i]; i++) {
        if (!source) continue;
        for (var property in source) {
            object[property] = source[property];
        }
    }

    return object;
};
});
require.register("adamfortuna-stuff.js/lib/stuff.js", function(exports, require, module){
// **stuff.js** provides a secure and convinient way to sandbox untrusted
// html/js/css code in an iframe.

;(function (global) {
  'use strict';

  // Setup
  // -----

  // Keep a reference to all created iframe elements.
  var iframes = []
    , noop    = function () {};


  // stuff
  // -----

  // Creates a new `Context` with a runner iframe on preferably a different
  // origin and calls the callback with the new `Context` object that is
  // ready for interaction. The iframe is appended to `el` if specified
  // otherwise it's added to the body element.
  function stuff (url, options, cb) {
    if (typeof options === 'function') {
      cb = options;
      options = {};
    }
    if (!cb) cb = noop;
    var el = (options && options.nodeType === 1) 
           ? options : options.el || document.querySelector('body');
    options.el = null;

    var iframe  = document.createElement('iframe')
      , context = new Context(iframe, options);

    // We will be communicating with iframe using the window messaging API. 
    global.addEventListener(
      'message', context.messageHandler.bind(context), false
    );

    iframes.push(iframe);
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('src', url);

    // Listen to the load events of the iframe. It fires the first time we add
    // it to the body, but also could fire if the iframe was moved around. We
    // call `cb` only once as the context objects doesn't change, we just rehandshake.
    var once = false;
    function init () {
      context.handshake();
      if (!once) {
        cb(context);
        once = true;
      }
    }
    iframe.addEventListener('load', init, false);

    // Finally append the iframe to the body to get going.
    el.appendChild(iframe);
  }

  // Remove all our iframes from the page.
  stuff.clear = function () {
    iframes.forEach(function (iframe) {
      var parent = iframe.parentElement;
      if (parent) parent.removeChild(iframe);
    });
    iframes = [];
  };

  // Context
  // -------

  // Creates a wrapper around the iframe that takes care of communication
  // with the secure `iframe` and gives us a nice API to interact with.
  function Context (iframe, options) {
    this.iframe    = iframe;
    this.callbacks = {};
    this.eventQ    = { load   : []
                     , evaljs : []
                     , html   : [] };

    if (options.sandbox === true) {
      this.sandbox = 'allow-scripts allow-same-origin';
    } else if (typeof options.sandbox === 'string') {
      var sandbox = options.sandbox;
      if (sandbox.indexOf('allow-scripts') === -1) sandbox += ' allow-scripts';
      if (sandbox.indexOf('allow-same-origin') === -1) sandbox += ' allow-same-origin';
      this.sandbox = sandbox;
    } else {
      this.sandbox = null;
    }

    // A large enough random number that is used as a secret for between
    // top and child iframe.
    this.secret = Math.ceil(Math.random() * 999999999) + 1;
  }

  Context.prototype.handle = function (type, data) {
    var that = this
      , callbacks;
    if (type === 'custom') {
      var msg = data;
      callbacks = this.callbacks[msg.type] || [];
      callbacks.forEach(function (cb) {
        if (typeof cb === 'function') cb.call(cb.thisArg || that, msg.data);
      });
    } else {
      callbacks = this.eventQ[type];
      if (!callbacks) return;
      var cb = callbacks.shift();
      if (typeof cb === 'function') cb.call(cb.thisArg || that, data);  
    }
  };

  // Parse and react to messages.
  Context.prototype.messageHandler = function (e) {
    var msg;
    try {
      msg = JSON.parse(e.data);
    } catch (err) {

      // If the message is not valid JSON then it's definitely not ours.
      return;
    }

    // Message secret doesn't match. Maybe for a different Context or
    // just something else.
    if (msg.secret !== this.secret) return;

    var data = msg.data
      , type = msg.type;

    this.handle(type, data);
  };

  // Sends messages to the secure iframe.
  Context.prototype.post = function (type, data) {
    this.iframe.contentWindow.postMessage(JSON.stringify({
      type   : type
    , data   : data
    , secret : this.secret
    }), '*');
  };

  // Evals JS code in the secure iframe.
  Context.prototype.evaljs = function (js, cb, thisArg) {
    var callback = function (d) {
      var e     = d.error
        , error = e 
        , Type;

      // Try to reconstruct the error into a native one using the info we have.
      if (e && (Type = global[e.__errorType__])) {
        error       = new Type(e.message);
        error.stack = e.stack;
        error.type  = e.type;

        // `arguments` as a reserved keyword in jshint.
        error['arguments'] = e['arguments'];  
      }
      (cb || noop).call(this, error, d.result);
    };
    callback.thisArg = thisArg;
    this.eventQ.evaljs.push(callback);
    this.post('evaljs', js);
  };

  // Load HTML.
  Context.prototype.load = function (html, cb, thisArg) {
    cb = cb || noop;
    cb.thisArg = thisArg;
    this.eventQ.load.push(cb);
    this.post('load', html);
  };

  // Get current iframe HTML.
  Context.prototype.html = function (cb, thisArg) {
    cb = cb || noop;
    cb.thisArg = thisArg;
    this.eventQ.html.push(cb);
    this.post('html', null);
  };

  // Sends the secret to the iframe.
  Context.prototype.handshake = function () {
    this.post('handshake', this.sandbox);
  };

  // Listen on custom events.
  Context.prototype.on = function (event, cb, thisArg) {
    cb = cb || noop;
    cb.thisArg = thisArg;
    if (this.callbacks[event]) {
      this.callbacks[event].push(cb);
    } else {
      this.callbacks[event] = [cb];
    }
  };

  // Remove `callback` from the custom event listeners.
  Context.prototype.off = function (event, cb) {
    var callbacks = this.callbacks[event];
    if (callbacks) {
      var i = callbacks.indexOf(cb);
      if (i !== -1) callbacks.splice(i, 1);
    } else {
      this.callbacks[event] = [];
    }
  };

  // Export `stuff` and expose the `Context` class on it.
  stuff.Context  = Context;
  global.stuff   = stuff;
  module.exports = stuff;

})(this);

});
require.register("abecedary/index.js", function(exports, require, module){
var stuff = require('stuff.js'),
    emitter = require('emitter'),
    Promise = require('promise'),
    extend = require('extend');

function Abecedary(iframeUrl, template, options) {
  this.options = options || {};
  this.iframeUrl = iframeUrl;
  this.template = template;
  this.options = extend({ ui: "bdd", bail: true, ignoreLeaks: true }, this.options);
  this.createSandbox();
}
emitter(Abecedary.prototype);

// Public API to run tests against code
// Doesn't return anything, but emit a `complete` event when finished
Abecedary.prototype.run = function(code, tests) {
  var _this = this;

  this.sandbox.then(function(context) {
    console.log('running code')
    var runner = [
      'window.code = JSON.parse('+JSON.stringify(JSON.stringify(code))+');',
      'mocha.suite.suites.shift()',
      tests || _this.tests,
      'window.mocha.run();',
      true
    ].join('\n');

    try {
      context.evaljs(runner);
    } catch(e) {
      _this.emit('error', e);
    }
  });
}

// Public
//   Removes any iFrames that are lingering around
Abecedary.prototype.close = function(data) {
  stuff.clear();
}

// Private
//   Creates the stuff.js sandbox and returns a promise
Abecedary.prototype.createSandbox = function() {
  var _this = this;
  this.sandbox = new Promise(function (resolve, reject) {
    stuff(_this.iframeUrl, function (context) {
      // Whenever we run tests in the sandbox, call runComplete
      context.on('finished', runComplete.bind(_this));
      context.on('loaded', loaded.bind(_this, { resolve: resolve, reject: reject }));

      // Contains the initial HTML and libraries needed to run tests,
      // as well as the tests themselves, but not the code
      context.load(_this.template);

      _this.context = context;
    });
  });
  return this.sandbox;
}

//  Publicize the run is done
var runComplete = function(report) {
  this.emit('complete', report);
}

// Setup Mocha upon completion
var loaded = function(promise, report) {
  this.context.evaljs('mocha.setup('+ JSON.stringify(this.options) +');');
  promise.resolve(this.context);
}


module.exports = Abecedary;

});








require.alias("component-emitter/index.js", "abecedary/deps/emitter/index.js");
require.alias("component-emitter/index.js", "emitter/index.js");

require.alias("then-promise/index.js", "abecedary/deps/promise/index.js");
require.alias("then-promise/core.js", "abecedary/deps/promise/core.js");
require.alias("then-promise/index.js", "promise/index.js");
require.alias("johntron-asap/asap.js", "then-promise/deps/asap/asap.js");
require.alias("johntron-asap/asap.js", "then-promise/deps/asap/index.js");
require.alias("johntron-asap/asap.js", "johntron-asap/index.js");
require.alias("segmentio-extend/index.js", "abecedary/deps/extend/index.js");
require.alias("segmentio-extend/index.js", "extend/index.js");

require.alias("adamfortuna-stuff.js/lib/stuff.js", "abecedary/deps/stuff.js/lib/stuff.js");
require.alias("adamfortuna-stuff.js/lib/stuff.js", "abecedary/deps/stuff.js/index.js");
require.alias("adamfortuna-stuff.js/lib/stuff.js", "stuff.js/index.js");
require.alias("adamfortuna-stuff.js/lib/stuff.js", "adamfortuna-stuff.js/index.js");
require.alias("abecedary/index.js", "abecedary/index.js");