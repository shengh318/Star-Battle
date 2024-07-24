(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (global){(function (){
'use strict';

var objectAssign = require('object-assign');

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:
// NB: The URL to the CommonJS spec is kept just for tradition.
//     node-assert has evolved a lot since then, both in API and behavior.

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

// Expose a strict only variant of assert
function strict(value, message) {
  if (!value) fail(value, true, message, '==', strict);
}
assert.strict = objectAssign(strict, assert, {
  equal: assert.strictEqual,
  deepEqual: assert.deepStrictEqual,
  notEqual: assert.notStrictEqual,
  notDeepEqual: assert.notDeepStrictEqual
});
assert.strict.strict = assert.strict;

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"object-assign":6,"util/":4}],2:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],3:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],4:[function(require,module,exports){
(function (process,global){(function (){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":3,"_process":15,"inherits":2}],5:[function(require,module,exports){

},{}],6:[function(require,module,exports){
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],7:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compile = exports.makeNonterminalConverters = void 0;
const types_1 = require("./types");
const assert_1 = __importDefault(require("assert"));
const parser_1 = require("./parser");
/**
 * Converts string to nonterminal.
 * @param <NT> nonterminal enumeration
 * @param nonterminals required to be the runtime object for the <NT> type parameter
 * @return a pair of converters { nonterminalToString, stringToNonterminal }
 *              one takes a string (any alphabetic case) and returns the nonterminal it names
 *              the other takes a nonterminal and returns its string name, using the Typescript source capitalization.
 *         Both converters throw GrammarError if the conversion can't be done.
 * @throws GrammarError if NT has a name collision (two nonterminal names that differ only in capitalization,
 *       e.g. ROOT and root).
 */
function makeNonterminalConverters(nonterminals) {
    // "canonical name" is a case-independent name (canonicalized to lowercase)
    // "source name" is the name capitalized as in the Typescript source definition of NT
    const nonterminalForCanonicalName = new Map();
    const sourceNameForNonterminal = new Map();
    for (const key of Object.keys(nonterminals)) {
        // in Typescript, the nonterminals object combines both a NT->name mapping and name->NT mapping.
        // https://www.typescriptlang.org/docs/handbook/enums.html#enums-at-runtime
        // So filter just to keys that are valid Parserlib nonterminal names
        if (/^[a-zA-Z_][a-zA-Z_0-9]*$/.test(key)) {
            const sourceName = key;
            const canonicalName = key.toLowerCase();
            const nt = nonterminals[sourceName];
            if (nonterminalForCanonicalName.has(canonicalName)) {
                throw new types_1.GrammarError('name collision in nonterminal enumeration: '
                    + sourceNameForNonterminal.get(nonterminalForCanonicalName.get(canonicalName))
                    + ' and ' + sourceName
                    + ' are the same when compared case-insensitively');
            }
            nonterminalForCanonicalName.set(canonicalName, nt);
            sourceNameForNonterminal.set(nt, sourceName);
        }
    }
    //console.error(sourceNameForNonterminal);
    function stringToNonterminal(name) {
        const canonicalName = name.toLowerCase();
        if (!nonterminalForCanonicalName.has(canonicalName)) {
            throw new types_1.GrammarError('grammar uses nonterminal ' + name + ', which is not found in the nonterminal enumeration passed to compile()');
        }
        return nonterminalForCanonicalName.get(canonicalName);
    }
    function nonterminalToString(nt) {
        if (!sourceNameForNonterminal.has(nt)) {
            throw new types_1.GrammarError('nonterminal ' + nt + ' is not found in the nonterminal enumeration passed to compile()');
        }
        return sourceNameForNonterminal.get(nt);
    }
    return { stringToNonterminal, nonterminalToString };
}
exports.makeNonterminalConverters = makeNonterminalConverters;
var GrammarNT;
(function (GrammarNT) {
    GrammarNT[GrammarNT["GRAMMAR"] = 0] = "GRAMMAR";
    GrammarNT[GrammarNT["PRODUCTION"] = 1] = "PRODUCTION";
    GrammarNT[GrammarNT["SKIPBLOCK"] = 2] = "SKIPBLOCK";
    GrammarNT[GrammarNT["UNION"] = 3] = "UNION";
    GrammarNT[GrammarNT["CONCATENATION"] = 4] = "CONCATENATION";
    GrammarNT[GrammarNT["REPETITION"] = 5] = "REPETITION";
    GrammarNT[GrammarNT["REPEATOPERATOR"] = 6] = "REPEATOPERATOR";
    GrammarNT[GrammarNT["UNIT"] = 7] = "UNIT";
    GrammarNT[GrammarNT["NONTERMINAL"] = 8] = "NONTERMINAL";
    GrammarNT[GrammarNT["TERMINAL"] = 9] = "TERMINAL";
    GrammarNT[GrammarNT["QUOTEDSTRING"] = 10] = "QUOTEDSTRING";
    GrammarNT[GrammarNT["NUMBER"] = 11] = "NUMBER";
    GrammarNT[GrammarNT["RANGE"] = 12] = "RANGE";
    GrammarNT[GrammarNT["UPPERBOUND"] = 13] = "UPPERBOUND";
    GrammarNT[GrammarNT["LOWERBOUND"] = 14] = "LOWERBOUND";
    GrammarNT[GrammarNT["CHARACTERSET"] = 15] = "CHARACTERSET";
    GrammarNT[GrammarNT["ANYCHAR"] = 16] = "ANYCHAR";
    GrammarNT[GrammarNT["CHARACTERCLASS"] = 17] = "CHARACTERCLASS";
    GrammarNT[GrammarNT["WHITESPACE"] = 18] = "WHITESPACE";
    GrammarNT[GrammarNT["ONELINECOMMENT"] = 19] = "ONELINECOMMENT";
    GrammarNT[GrammarNT["BLOCKCOMMENT"] = 20] = "BLOCKCOMMENT";
    GrammarNT[GrammarNT["SKIP"] = 21] = "SKIP";
})(GrammarNT || (GrammarNT = {}));
;
function ntt(nonterminal) {
    return (0, parser_1.nt)(nonterminal, GrammarNT[nonterminal]);
}
const grammarGrammar = new Map();
// grammar ::= ( production | skipBlock )+
grammarGrammar.set(GrammarNT.GRAMMAR, (0, parser_1.cat)(ntt(GrammarNT.SKIP), (0, parser_1.star)((0, parser_1.cat)((0, parser_1.or)(ntt(GrammarNT.PRODUCTION), ntt(GrammarNT.SKIPBLOCK)), ntt(GrammarNT.SKIP)))));
// skipBlock ::= '@skip' nonterminal '{' production* '}'
grammarGrammar.set(GrammarNT.SKIPBLOCK, (0, parser_1.cat)((0, parser_1.str)("@skip"), ntt(GrammarNT.SKIP), (0, parser_1.failfast)(ntt(GrammarNT.NONTERMINAL)), ntt(GrammarNT.SKIP), (0, parser_1.str)('{'), (0, parser_1.failfast)((0, parser_1.cat)(ntt(GrammarNT.SKIP), (0, parser_1.star)((0, parser_1.cat)(ntt(GrammarNT.PRODUCTION), ntt(GrammarNT.SKIP))), (0, parser_1.str)('}')))));
// production ::= nonterminal '::=' union ';'
grammarGrammar.set(GrammarNT.PRODUCTION, (0, parser_1.cat)(ntt(GrammarNT.NONTERMINAL), ntt(GrammarNT.SKIP), (0, parser_1.str)("::="), (0, parser_1.failfast)((0, parser_1.cat)(ntt(GrammarNT.SKIP), ntt(GrammarNT.UNION), ntt(GrammarNT.SKIP), (0, parser_1.str)(';')))));
// union :: = concatenation ('|' concatenation)*
grammarGrammar.set(GrammarNT.UNION, (0, parser_1.cat)(ntt(GrammarNT.CONCATENATION), (0, parser_1.star)((0, parser_1.cat)(ntt(GrammarNT.SKIP), (0, parser_1.str)('|'), ntt(GrammarNT.SKIP), ntt(GrammarNT.CONCATENATION)))));
// concatenation :: = repetition* 
grammarGrammar.set(GrammarNT.CONCATENATION, (0, parser_1.star)((0, parser_1.cat)(ntt(GrammarNT.REPETITION), ntt(GrammarNT.SKIP))));
// repetition ::= unit repeatOperator?
grammarGrammar.set(GrammarNT.REPETITION, (0, parser_1.cat)(ntt(GrammarNT.UNIT), ntt(GrammarNT.SKIP), (0, parser_1.option)(ntt(GrammarNT.REPEATOPERATOR))));
// repeatOperator ::= [*+?] | '{' ( number | range | upperBound | lowerBound ) '}'
grammarGrammar.set(GrammarNT.REPEATOPERATOR, (0, parser_1.or)((0, parser_1.regex)("[*+?]"), (0, parser_1.cat)((0, parser_1.str)("{"), (0, parser_1.or)(ntt(GrammarNT.NUMBER), ntt(GrammarNT.RANGE), ntt(GrammarNT.UPPERBOUND), ntt(GrammarNT.LOWERBOUND)), (0, parser_1.str)("}"))));
// number ::= [0-9]+
grammarGrammar.set(GrammarNT.NUMBER, (0, parser_1.plus)((0, parser_1.regex)("[0-9]")));
// range ::= number ',' number
grammarGrammar.set(GrammarNT.RANGE, (0, parser_1.cat)(ntt(GrammarNT.NUMBER), (0, parser_1.str)(","), ntt(GrammarNT.NUMBER)));
// upperBound ::= ',' number
grammarGrammar.set(GrammarNT.UPPERBOUND, (0, parser_1.cat)((0, parser_1.str)(","), ntt(GrammarNT.NUMBER)));
// lowerBound ::= number ','
grammarGrammar.set(GrammarNT.LOWERBOUND, (0, parser_1.cat)(ntt(GrammarNT.NUMBER), (0, parser_1.str)(",")));
// unit ::= nonterminal | terminal | '(' union ')'
grammarGrammar.set(GrammarNT.UNIT, (0, parser_1.or)(ntt(GrammarNT.NONTERMINAL), ntt(GrammarNT.TERMINAL), (0, parser_1.cat)((0, parser_1.str)('('), ntt(GrammarNT.SKIP), ntt(GrammarNT.UNION), ntt(GrammarNT.SKIP), (0, parser_1.str)(')'))));
// nonterminal ::= [a-zA-Z_][a-zA-Z_0-9]*
grammarGrammar.set(GrammarNT.NONTERMINAL, (0, parser_1.cat)((0, parser_1.regex)("[a-zA-Z_]"), (0, parser_1.star)((0, parser_1.regex)("[a-zA-Z_0-9]"))));
// terminal ::= quotedString | characterSet | anyChar | characterClass
grammarGrammar.set(GrammarNT.TERMINAL, (0, parser_1.or)(ntt(GrammarNT.QUOTEDSTRING), ntt(GrammarNT.CHARACTERSET), ntt(GrammarNT.ANYCHAR), ntt(GrammarNT.CHARACTERCLASS)));
// quotedString ::= "'" ([^'\r\n\\] | '\\' . )* "'" | '"' ([^"\r\n\\] | '\\' . )* '"'
grammarGrammar.set(GrammarNT.QUOTEDSTRING, (0, parser_1.or)((0, parser_1.cat)((0, parser_1.str)("'"), (0, parser_1.failfast)((0, parser_1.star)((0, parser_1.or)((0, parser_1.regex)("[^'\r\n\\\\]"), (0, parser_1.cat)((0, parser_1.str)('\\'), (0, parser_1.regex)("."))))), (0, parser_1.str)("'")), (0, parser_1.cat)((0, parser_1.str)('"'), (0, parser_1.failfast)((0, parser_1.star)((0, parser_1.or)((0, parser_1.regex)('[^"\r\n\\\\]'), (0, parser_1.cat)((0, parser_1.str)('\\'), (0, parser_1.regex)("."))))), (0, parser_1.str)('"'))));
// characterSet ::= '[' ([^\]\r\n\\] | '\\' . )+ ']'
grammarGrammar.set(GrammarNT.CHARACTERSET, (0, parser_1.cat)((0, parser_1.str)('['), (0, parser_1.failfast)((0, parser_1.cat)((0, parser_1.plus)((0, parser_1.or)((0, parser_1.regex)("[^\\]\r\n\\\\]"), (0, parser_1.cat)((0, parser_1.str)('\\'), (0, parser_1.regex)(".")))))), (0, parser_1.str)(']')));
// anyChar ::= '.'
grammarGrammar.set(GrammarNT.ANYCHAR, (0, parser_1.str)('.'));
// characterClass ::= '\\' [dsw]
grammarGrammar.set(GrammarNT.CHARACTERCLASS, (0, parser_1.cat)((0, parser_1.str)('\\'), (0, parser_1.failfast)((0, parser_1.regex)("[dsw]"))));
// whitespace ::= [ \t\r\n]
grammarGrammar.set(GrammarNT.WHITESPACE, (0, parser_1.regex)("[ \t\r\n]"));
grammarGrammar.set(GrammarNT.ONELINECOMMENT, (0, parser_1.cat)((0, parser_1.str)("//"), (0, parser_1.star)((0, parser_1.regex)("[^\r\n]")), (0, parser_1.or)((0, parser_1.str)("\r\n"), (0, parser_1.str)('\n'), (0, parser_1.str)('\r'))));
grammarGrammar.set(GrammarNT.BLOCKCOMMENT, (0, parser_1.cat)((0, parser_1.str)("/*"), (0, parser_1.cat)((0, parser_1.star)((0, parser_1.regex)("[^*]")), (0, parser_1.str)('*')), (0, parser_1.star)((0, parser_1.cat)((0, parser_1.regex)("[^/]"), (0, parser_1.star)((0, parser_1.regex)("[^*]")), (0, parser_1.str)('*'))), (0, parser_1.str)('/')));
grammarGrammar.set(GrammarNT.SKIP, (0, parser_1.star)((0, parser_1.or)(ntt(GrammarNT.WHITESPACE), ntt(GrammarNT.ONELINECOMMENT), ntt(GrammarNT.BLOCKCOMMENT))));
const grammarParser = new parser_1.InternalParser(grammarGrammar, ntt(GrammarNT.GRAMMAR), (nt) => GrammarNT[nt]);
/**
 * Compile a Parser from a grammar represented as a string.
 * @param <NT> a Typescript Enum with one symbol for each nonterminal used in the grammar,
 *        matching the nonterminals when compared case-insensitively (so ROOT and Root and root are the same).
 * @param grammar the grammar to use
 * @param nonterminals the runtime object of the nonterminals enum. For example, if
 *             enum Nonterminals { root, a, b, c };
 *        then Nonterminals must be explicitly passed as this runtime parameter
 *              compile(grammar, Nonterminals, Nonterminals.root);
 *        (in addition to being implicitly used for the type parameter NT)
 * @param rootNonterminal the desired root nonterminal in the grammar
 * @return a parser for the given grammar that will start parsing at rootNonterminal.
 * @throws ParseError if the grammar has a syntax error
 */
function compile(grammar, nonterminals, rootNonterminal) {
    const { stringToNonterminal, nonterminalToString } = makeNonterminalConverters(nonterminals);
    const grammarTree = (() => {
        try {
            return grammarParser.parse(grammar);
        }
        catch (e) {
            throw (e instanceof types_1.InternalParseError) ? new types_1.GrammarError("grammar doesn't compile", e) : e;
        }
    })();
    const definitions = new Map();
    const nonterminalsDefined = new Set(); // on lefthand-side of some production
    const nonterminalsUsed = new Set(); // on righthand-side of some production
    // productions outside @skip blocks
    makeProductions(grammarTree.childrenByName(GrammarNT.PRODUCTION), null);
    // productions inside @skip blocks
    for (const skipBlock of grammarTree.childrenByName(GrammarNT.SKIPBLOCK)) {
        makeSkipBlock(skipBlock);
    }
    for (const nt of nonterminalsUsed) {
        if (!nonterminalsDefined.has(nt)) {
            throw new types_1.GrammarError("grammar is missing a definition for " + nonterminalToString(nt));
        }
    }
    if (!nonterminalsDefined.has(rootNonterminal)) {
        throw new types_1.GrammarError("grammar is missing a definition for the root nonterminal " + nonterminalToString(rootNonterminal));
    }
    return new parser_1.InternalParser(definitions, (0, parser_1.nt)(rootNonterminal, nonterminalToString(rootNonterminal)), nonterminalToString);
    function makeProductions(productions, skip) {
        for (const production of productions) {
            const nonterminalName = production.childrenByName(GrammarNT.NONTERMINAL)[0].text;
            const nonterminal = stringToNonterminal(nonterminalName);
            nonterminalsDefined.add(nonterminal);
            let expression = makeGrammarTerm(production.childrenByName(GrammarNT.UNION)[0], skip);
            if (skip)
                expression = (0, parser_1.cat)(skip, expression, skip);
            if (definitions.has(nonterminal)) {
                // grammar already has a production for this nonterminal; or expression onto it
                definitions.set(nonterminal, (0, parser_1.or)(definitions.get(nonterminal), expression));
            }
            else {
                definitions.set(nonterminal, expression);
            }
        }
    }
    function makeSkipBlock(skipBlock) {
        const nonterminalName = skipBlock.childrenByName(GrammarNT.NONTERMINAL)[0].text;
        const nonterminal = stringToNonterminal(nonterminalName);
        nonterminalsUsed.add(nonterminal);
        const skipTerm = (0, parser_1.skip)((0, parser_1.nt)(nonterminal, nonterminalName));
        makeProductions(skipBlock.childrenByName(GrammarNT.PRODUCTION), skipTerm);
    }
    function makeGrammarTerm(tree, skip) {
        switch (tree.name) {
            case GrammarNT.UNION: {
                const childexprs = tree.childrenByName(GrammarNT.CONCATENATION).map(child => makeGrammarTerm(child, skip));
                return childexprs.length == 1 ? childexprs[0] : (0, parser_1.or)(...childexprs);
            }
            case GrammarNT.CONCATENATION: {
                let childexprs = tree.childrenByName(GrammarNT.REPETITION).map(child => makeGrammarTerm(child, skip));
                if (skip) {
                    // insert skip between each pair of children
                    let childrenWithSkips = [];
                    for (const child of childexprs) {
                        if (childrenWithSkips.length > 0)
                            childrenWithSkips.push(skip);
                        childrenWithSkips.push(child);
                    }
                    childexprs = childrenWithSkips;
                }
                return (childexprs.length == 1) ? childexprs[0] : (0, parser_1.cat)(...childexprs);
            }
            case GrammarNT.REPETITION: {
                const unit = makeGrammarTerm(tree.childrenByName(GrammarNT.UNIT)[0], skip);
                const op = tree.childrenByName(GrammarNT.REPEATOPERATOR)[0];
                if (!op) {
                    return unit;
                }
                else {
                    const unitWithSkip = skip ? (0, parser_1.cat)(unit, skip) : unit;
                    //console.log('op is', op);
                    switch (op.text) {
                        case '*': return (0, parser_1.star)(unitWithSkip);
                        case '+': return (0, parser_1.plus)(unitWithSkip);
                        case '?': return (0, parser_1.option)(unitWithSkip);
                        default: {
                            // op is {n,m} or one of its variants
                            const range = op.children[0];
                            switch (range.name) {
                                case GrammarNT.NUMBER: {
                                    const n = parseInt(range.text);
                                    return (0, parser_1.repeat)(unitWithSkip, new parser_1.Between(n, n));
                                    break;
                                }
                                case GrammarNT.RANGE: {
                                    const n = parseInt(range.children[0].text);
                                    const m = parseInt(range.children[1].text);
                                    return (0, parser_1.repeat)(unitWithSkip, new parser_1.Between(n, m));
                                    break;
                                }
                                case GrammarNT.UPPERBOUND: {
                                    const m = parseInt(range.children[0].text);
                                    return (0, parser_1.repeat)(unitWithSkip, new parser_1.Between(0, m));
                                    break;
                                }
                                case GrammarNT.LOWERBOUND: {
                                    const n = parseInt(range.children[0].text);
                                    return (0, parser_1.repeat)(unitWithSkip, new parser_1.AtLeast(n));
                                    break;
                                }
                                default:
                                    throw new Error('internal error: unknown range: ' + range.name);
                            }
                        }
                    }
                }
            }
            case GrammarNT.UNIT:
                return makeGrammarTerm(tree.childrenByName(GrammarNT.NONTERMINAL)[0]
                    || tree.childrenByName(GrammarNT.TERMINAL)[0]
                    || tree.childrenByName(GrammarNT.UNION)[0], skip);
            case GrammarNT.NONTERMINAL: {
                const nonterminal = stringToNonterminal(tree.text);
                nonterminalsUsed.add(nonterminal);
                return (0, parser_1.nt)(nonterminal, tree.text);
            }
            case GrammarNT.TERMINAL:
                switch (tree.children[0].name) {
                    case GrammarNT.QUOTEDSTRING:
                        return (0, parser_1.str)(stripQuotesAndReplaceEscapeSequences(tree.text));
                    case GrammarNT.CHARACTERSET: // e.g. [abc]
                    case GrammarNT.ANYCHAR: // e.g.  .
                    case GrammarNT.CHARACTERCLASS: // e.g.  \d  \s  \w
                        return (0, parser_1.regex)(tree.text);
                    default:
                        throw new Error('internal error: unknown literal: ' + tree.children[0]);
                }
            default:
                throw new Error('internal error: unknown grammar rule: ' + tree.name);
        }
    }
    /**
     * Strip starting and ending quotes.
     * Replace \t, \r, \n with their character codes.
     * Replaces all other \x with literal x.
     */
    function stripQuotesAndReplaceEscapeSequences(s) {
        (0, assert_1.default)(s[0] == '"' || s[0] == "'");
        s = s.substring(1, s.length - 1);
        s = s.replace(/\\(.)/g, (match, escapedChar) => {
            switch (escapedChar) {
                case 't': return '\t';
                case 'r': return '\r';
                case 'n': return '\n';
                default: return escapedChar;
            }
        });
        return s;
    }
}
exports.compile = compile;

},{"./parser":9,"./types":11,"assert":1}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indent = exports.snippet = exports.escapeForReading = exports.toColumn = exports.toLine = exports.describeLocation = exports.makeErrorMessage = void 0;
/**
 * Make a human-readable error message explaining a parse error and where it was found in the input.
 * @param message brief message stating what error occurred
 * @param nonterminalName name of deepest nonterminal that parser was trying to match when parse failed
 * @param expectedText human-readable description of what string literals the parser was expecting there;
 *            e.g. ";", "[ \r\n\t]", "1|2|3"
 * @param stringBeingParsed original input to parse()
 * @param pos offset in stringBeingParsed where error occurred
 * @param nameOfStringBeingParsed human-readable description of where stringBeingParsed came from;
 *             e.g. "grammar" if stringBeingParsed was the input to Parser.compile(),
 *             or "string being parsed" if stringBeingParsed was the input to Parser.parse()
 * @return a multiline human-readable message that states the error, its location in the input,
 *         what text was expected and what text was actually found.
 */
function makeErrorMessage(message, nonterminalName, expectedText, stringBeingParsed, pos, nameOfStringBeingParsed) {
    let result = message;
    if (result.length > 0)
        result += "\n";
    result +=
        "Error at " + describeLocation(stringBeingParsed, pos) + " of " + nameOfStringBeingParsed + "\n"
            + "  trying to match " + nonterminalName.toUpperCase() + "\n"
            + "  expected " + escapeForReading(expectedText, "")
            + ((stringBeingParsed.length > 0)
                ? "\n   but saw " + snippet(stringBeingParsed, pos)
                : "");
    return result;
}
exports.makeErrorMessage = makeErrorMessage;
/**
 * @param string to describe
 * @param pos offset in string, 0<=pos<string.length()
 * @return a human-readable description of the location of the character at offset pos in string
 * (using offset and/or line/column if appropriate)
 */
function describeLocation(s, pos) {
    let result = "offset " + pos;
    if (s.indexOf('\n') != -1) {
        result += " (line " + toLine(s, pos) + " column " + toColumn(s, pos) + ")";
    }
    return result;
}
exports.describeLocation = describeLocation;
/**
 * Translates a string offset into a line number.
 * @param string in which offset occurs
 * @param pos offset in string, 0<=pos<string.length()
 * @return the 1-based line number of the character at offset pos in string,
 * as if string were being viewed in a text editor
 */
function toLine(s, pos) {
    let lineCount = 1;
    for (let newline = s.indexOf('\n'); newline != -1 && newline < pos; newline = s.indexOf('\n', newline + 1)) {
        ++lineCount;
    }
    return lineCount;
}
exports.toLine = toLine;
/**
 * Translates a string offset into a column number.
 * @param string in which offset occurs
 * @param pos offset in string, 0<=pos<string.length()
 * @return the 1-based column number of the character at offset pos in string,
 * as if string were being viewed in a text editor with tab size 1 (i.e. a tab is treated like a space)
 */
function toColumn(s, pos) {
    const lastNewlineBeforePos = s.lastIndexOf('\n', pos - 1);
    const totalSizeOfPrecedingLines = (lastNewlineBeforePos != -1) ? lastNewlineBeforePos + 1 : 0;
    return pos - totalSizeOfPrecedingLines + 1;
}
exports.toColumn = toColumn;
/**
* Replace common unprintable characters by their escape codes, for human reading.
* Should be idempotent, i.e. if x = escapeForReading(y), then x.equals(escapeForReading(x)).
* @param string to escape
* @param quote quotes to put around string, or "" if no quotes required
* @return string with escape codes replaced, preceded and followed by quote, with a human-readable legend appended to the end
*         explaining what the replacement characters mean.
*/
function escapeForReading(s, quote) {
    let result = s;
    const legend = [];
    for (const { unprintableChar, humanReadableVersion, description } of ESCAPES) {
        if (result.includes(unprintableChar)) {
            result = result.replace(unprintableChar, humanReadableVersion);
            legend.push(humanReadableVersion + " means " + description);
        }
    }
    result = quote + result + quote;
    if (legend.length > 0) {
        result += " (where " + legend.join(", ") + ")";
    }
    return result;
}
exports.escapeForReading = escapeForReading;
const ESCAPES = [
    {
        unprintableChar: "\n",
        humanReadableVersion: "\u2424",
        description: "newline"
    },
    {
        unprintableChar: "\r",
        humanReadableVersion: "\u240D",
        description: "carriage return"
    },
    {
        unprintableChar: "\t",
        humanReadableVersion: "\u21E5",
        description: "tab"
    },
];
/**
 * @param string to shorten
 * @param pos offset in string, 0<=pos<string.length()
 * @return a short snippet of the part of string starting at offset pos,
 * in human-readable form
 */
function snippet(s, pos) {
    const maxCharsToShow = 10;
    const end = Math.min(pos + maxCharsToShow, s.length);
    let result = s.substring(pos, end) + (end < s.length ? "..." : "");
    if (result.length == 0)
        result = "end of string";
    return escapeForReading(result, "");
}
exports.snippet = snippet;
/**
 * Indent a multi-line string by preceding each line with prefix.
 * @param string string to indent
 * @param prefix prefix to use for indenting
 * @return string with prefix inserted at the start of each line
 */
function indent(s, prefix) {
    let result = "";
    let charsCopied = 0;
    do {
        const newline = s.indexOf('\n', charsCopied);
        const endOfLine = newline != -1 ? newline + 1 : s.length;
        result += prefix + s.substring(charsCopied, endOfLine);
        charsCopied = endOfLine;
    } while (charsCopied < s.length);
    return result;
}
exports.indent = indent;

},{}],9:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParserState = exports.FailedParse = exports.SuccessfulParse = exports.InternalParser = exports.failfast = exports.skip = exports.option = exports.plus = exports.star = exports.repeat = exports.ZERO_OR_ONE = exports.ONE_OR_MORE = exports.ZERO_OR_MORE = exports.Between = exports.AtLeast = exports.or = exports.cat = exports.str = exports.regex = exports.nt = void 0;
const assert_1 = __importDefault(require("assert"));
const types_1 = require("./types");
const parsetree_1 = require("./parsetree");
function nt(nonterminal, nonterminalName) {
    return {
        parse(s, pos, definitions, state) {
            const gt = definitions.get(nonterminal);
            if (gt === undefined)
                throw new types_1.GrammarError("nonterminal has no definition: " + nonterminalName);
            // console.error("entering", nonterminalName);
            state.enter(pos, nonterminal);
            let pr = gt.parse(s, pos, definitions, state);
            state.leave(nonterminal);
            // console.error("leaving", nonterminalName, "with result", pr);
            if (!pr.failed && !state.isEmpty()) {
                const tree = pr.tree;
                const newTree = state.makeParseTree(tree.start, tree.text, [tree]);
                pr = pr.replaceTree(newTree);
            }
            return pr;
        },
        toString() {
            return nonterminalName;
        }
    };
}
exports.nt = nt;
function regex(regexSource) {
    let regex = new RegExp('^' + regexSource + '$', 's');
    return {
        parse(s, pos, definitions, state) {
            if (pos >= s.length) {
                return state.makeFailedParse(pos, regexSource);
            }
            const l = s.substring(pos, pos + 1);
            if (regex.test(l)) {
                return state.makeSuccessfulParse(pos, pos + 1, l);
            }
            return state.makeFailedParse(pos, regexSource);
        },
        toString() {
            return regexSource;
        }
    };
}
exports.regex = regex;
function str(str) {
    return {
        parse(s, pos, definitions, state) {
            const newpos = pos + str.length;
            if (newpos > s.length) {
                return state.makeFailedParse(pos, str);
            }
            const l = s.substring(pos, newpos);
            if (l === str) {
                return state.makeSuccessfulParse(pos, newpos, l);
            }
            return state.makeFailedParse(pos, str);
        },
        toString() {
            return "'" + str.replace(/'\r\n\t\\/, "\\$&") + "'";
        }
    };
}
exports.str = str;
function cat(...terms) {
    return {
        parse(s, pos, definitions, state) {
            let prout = state.makeSuccessfulParse(pos, pos);
            for (const gt of terms) {
                const pr = gt.parse(s, pos, definitions, state);
                if (pr.failed)
                    return pr;
                pos = pr.pos;
                prout = prout.mergeResult(pr);
            }
            return prout;
        },
        toString() {
            return "(" + terms.map(term => term.toString()).join(" ") + ")";
        }
    };
}
exports.cat = cat;
/**
 * @param choices must be nonempty
 */
function or(...choices) {
    (0, assert_1.default)(choices.length > 0);
    return {
        parse(s, pos, definitions, state) {
            const successes = [];
            const failures = [];
            choices.forEach((choice) => {
                const result = choice.parse(s, pos, definitions, state);
                if (result.failed) {
                    failures.push(result);
                }
                else {
                    successes.push(result);
                }
            });
            if (successes.length > 0) {
                const longestSuccesses = longestResults(successes);
                (0, assert_1.default)(longestSuccesses.length > 0);
                return longestSuccesses[0];
            }
            const longestFailures = longestResults(failures);
            (0, assert_1.default)(longestFailures.length > 0);
            return state.makeFailedParse(longestFailures[0].pos, longestFailures.map((result) => result.expectedText).join("|"));
        },
        toString() {
            return "(" + choices.map(choice => choice.toString()).join("|") + ")";
        }
    };
}
exports.or = or;
class AtLeast {
    constructor(min) {
        this.min = min;
    }
    tooLow(n) { return n < this.min; }
    tooHigh(n) { return false; }
    toString() {
        switch (this.min) {
            case 0: return "*";
            case 1: return "+";
            default: return "{" + this.min + ",}";
        }
    }
}
exports.AtLeast = AtLeast;
class Between {
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }
    tooLow(n) { return n < this.min; }
    tooHigh(n) { return n > this.max; }
    toString() {
        if (this.min == 0) {
            return (this.max == 1) ? "?" : "{," + this.max + "}";
        }
        else {
            return "{" + this.min + "," + this.max + "}";
        }
    }
}
exports.Between = Between;
exports.ZERO_OR_MORE = new AtLeast(0);
exports.ONE_OR_MORE = new AtLeast(1);
exports.ZERO_OR_ONE = new Between(0, 1);
function repeat(gt, howmany) {
    return {
        parse(s, pos, definitions, state) {
            let prout = state.makeSuccessfulParse(pos, pos);
            for (let timesMatched = 0; howmany.tooLow(timesMatched) || !howmany.tooHigh(timesMatched + 1); ++timesMatched) {
                const pr = gt.parse(s, pos, definitions, state);
                if (pr.failed) {
                    // no match
                    if (howmany.tooLow(timesMatched)) {
                        return pr;
                    }
                    return prout.addLastFailure(pr);
                }
                else {
                    if (pr.pos == pos) {
                        // matched the empty string, and we already have enough.
                        // we may get into an infinite loop if howmany.tooHigh() never returns false,
                        // so return successful match at this point
                        return prout;
                    }
                    // otherwise advance the position and merge pr into prout
                    pos = pr.pos;
                    prout = prout.mergeResult(pr);
                }
            }
            return prout;
        },
        toString() {
            return gt.toString() + howmany.toString();
        }
    };
}
exports.repeat = repeat;
function star(gt) {
    return repeat(gt, exports.ZERO_OR_MORE);
}
exports.star = star;
function plus(gt) {
    return repeat(gt, exports.ONE_OR_MORE);
}
exports.plus = plus;
function option(gt) {
    return repeat(gt, exports.ZERO_OR_ONE);
}
exports.option = option;
function skip(nonterminal) {
    const repetition = star(nonterminal);
    return {
        parse(s, pos, definitions, state) {
            state.enterSkip();
            let pr = repetition.parse(s, pos, definitions, state);
            state.leaveSkip();
            if (pr.failed) {
                // succeed anyway
                pr = state.makeSuccessfulParse(pos, pos);
            }
            return pr;
        },
        toString() {
            return "(?<skip>" + repetition + ")";
        }
    };
}
exports.skip = skip;
function failfast(gt) {
    return {
        parse(s, pos, definitions, state) {
            let pr = gt.parse(s, pos, definitions, state);
            if (pr.failed)
                throw new types_1.InternalParseError("", pr.nonterminalName, pr.expectedText, "", pr.pos);
            return pr;
        },
        toString() {
            return 'failfast(' + gt + ')';
        }
    };
}
exports.failfast = failfast;
class InternalParser {
    constructor(definitions, start, nonterminalToString) {
        this.definitions = definitions;
        this.start = start;
        this.nonterminalToString = nonterminalToString;
        this.checkRep();
    }
    checkRep() {
    }
    parse(textToParse) {
        let pr = (() => {
            try {
                return this.start.parse(textToParse, 0, this.definitions, new ParserState(this.nonterminalToString));
            }
            catch (e) {
                if (e instanceof types_1.InternalParseError) {
                    // rethrow the exception, augmented by the original text, so that the error message is better
                    throw new types_1.InternalParseError("string does not match grammar", e.nonterminalName, e.expectedText, textToParse, e.pos);
                }
                else {
                    throw e;
                }
            }
        })();
        if (pr.failed) {
            throw new types_1.InternalParseError("string does not match grammar", pr.nonterminalName, pr.expectedText, textToParse, pr.pos);
        }
        if (pr.pos < textToParse.length) {
            const message = "only part of the string matches the grammar; the rest did not parse";
            throw (pr.lastFailure
                ? new types_1.InternalParseError(message, pr.lastFailure.nonterminalName, pr.lastFailure.expectedText, textToParse, pr.lastFailure.pos)
                : new types_1.InternalParseError(message, this.start.toString(), "end of string", textToParse, pr.pos));
        }
        return pr.tree;
    }
    ;
    toString() {
        return Array.from(this.definitions, ([nonterminal, rule]) => this.nonterminalToString(nonterminal) + '::=' + rule + ';').join("\n");
    }
}
exports.InternalParser = InternalParser;
class SuccessfulParse {
    constructor(pos, tree, lastFailure) {
        this.pos = pos;
        this.tree = tree;
        this.lastFailure = lastFailure;
        this.failed = false;
    }
    replaceTree(tree) {
        return new SuccessfulParse(this.pos, tree, this.lastFailure);
    }
    mergeResult(that) {
        (0, assert_1.default)(!that.failed);
        //console.log('merging', this, 'with', that);
        return new SuccessfulParse(that.pos, this.tree.concat(that.tree), laterResult(this.lastFailure, that.lastFailure));
    }
    /**
     * Keep track of a failing parse result that prevented this tree from matching more of the input string.
     * This deeper failure is usually more informative to the user, so we'll display it in the error message.
     * @param newLastFailure a failing ParseResult<NT> that stopped this tree's parse (but didn't prevent this from succeeding)
     * @return a new ParseResult<NT> identical to this one but with lastFailure added to it
     */
    addLastFailure(newLastFailure) {
        (0, assert_1.default)(newLastFailure.failed);
        return new SuccessfulParse(this.pos, this.tree, laterResult(this.lastFailure, newLastFailure));
    }
}
exports.SuccessfulParse = SuccessfulParse;
class FailedParse {
    constructor(pos, nonterminalName, expectedText) {
        this.pos = pos;
        this.nonterminalName = nonterminalName;
        this.expectedText = expectedText;
        this.failed = true;
    }
}
exports.FailedParse = FailedParse;
/**
 * @param result1
 * @param result2
 * @return whichever of result1 or result2 has the mximum position, or undefined if both are undefined
 */
function laterResult(result1, result2) {
    if (result1 && result2)
        return result1.pos >= result2.pos ? result1 : result2;
    else
        return result1 || result2;
}
/**
 * @param results
 * @return the results in the list with maximum pos.  Empty if list is empty.
 */
function longestResults(results) {
    return results.reduce((longestResultsSoFar, result) => {
        if (longestResultsSoFar.length == 0 || result.pos > longestResultsSoFar[0].pos) {
            // result wins
            return [result];
        }
        else if (result.pos == longestResultsSoFar[0].pos) {
            // result is tied
            longestResultsSoFar.push(result);
            return longestResultsSoFar;
        }
        else {
            // result loses
            return longestResultsSoFar;
        }
    }, []);
}
class ParserState {
    constructor(nonterminalToString) {
        this.nonterminalToString = nonterminalToString;
        this.stack = [];
        this.first = new Map();
        this.skipDepth = 0;
    }
    enter(pos, nonterminal) {
        if (!this.first.has(nonterminal)) {
            this.first.set(nonterminal, []);
        }
        const s = this.first.get(nonterminal);
        if (s.length > 0 && s[s.length - 1] == pos) {
            throw new types_1.GrammarError("detected left recursion in rule for " + this.nonterminalToString(nonterminal));
        }
        s.push(pos);
        this.stack.push(nonterminal);
    }
    leave(nonterminal) {
        (0, assert_1.default)(this.first.has(nonterminal) && this.first.get(nonterminal).length > 0);
        this.first.get(nonterminal).pop();
        const last = this.stack.pop();
        (0, assert_1.default)(last === nonterminal);
    }
    enterSkip() {
        //console.error('entering skip');
        ++this.skipDepth;
    }
    leaveSkip() {
        //console.error('leaving skip');
        --this.skipDepth;
        (0, assert_1.default)(this.skipDepth >= 0);
    }
    isEmpty() {
        return this.stack.length == 0;
    }
    get currentNonterminal() {
        return this.stack[this.stack.length - 1];
    }
    get currentNonterminalName() {
        return this.currentNonterminal !== undefined ? this.nonterminalToString(this.currentNonterminal) : undefined;
    }
    // requires: !isEmpty()
    makeParseTree(pos, text = '', children = []) {
        (0, assert_1.default)(!this.isEmpty());
        return new parsetree_1.InternalParseTree(this.currentNonterminal, this.currentNonterminalName, pos, text, children, this.skipDepth > 0);
    }
    // requires !isEmpty()
    makeSuccessfulParse(fromPos, toPos, text = '', children = []) {
        (0, assert_1.default)(!this.isEmpty());
        return new SuccessfulParse(toPos, this.makeParseTree(fromPos, text, children));
    }
    // requires !isEmpty()
    makeFailedParse(atPos, expectedText) {
        (0, assert_1.default)(!this.isEmpty());
        return new FailedParse(atPos, this.currentNonterminalName, expectedText);
    }
}
exports.ParserState = ParserState;

},{"./parsetree":10,"./types":11,"assert":1}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalParseTree = void 0;
const display_1 = require("./display");
class InternalParseTree {
    constructor(name, nonterminalName, start, text, allChildren, isSkipped) {
        this.name = name;
        this.nonterminalName = nonterminalName;
        this.start = start;
        this.text = text;
        this.allChildren = allChildren;
        this.isSkipped = isSkipped;
        this.checkRep();
        Object.freeze(this.allChildren);
        // can't freeze(this) because of beneficent mutation delayed computation-with-caching for children() and childrenByName()
    }
    checkRep() {
        // FIXME
    }
    get end() {
        return this.start + this.text.length;
    }
    childrenByName(name) {
        if (!this._childrenByName) {
            this._childrenByName = new Map();
            for (const child of this.allChildren) {
                if (!this._childrenByName.has(child.name)) {
                    this._childrenByName.set(child.name, []);
                }
                this._childrenByName.get(child.name).push(child);
            }
            for (const childList of this._childrenByName.values()) {
                Object.freeze(childList);
            }
        }
        this.checkRep();
        return this._childrenByName.get(name) || [];
    }
    get children() {
        if (!this._children) {
            this._children = this.allChildren.filter(child => !child.isSkipped);
            Object.freeze(this._children);
        }
        this.checkRep();
        return this._children;
    }
    concat(that) {
        return new InternalParseTree(this.name, this.nonterminalName, this.start, this.text + that.text, this.allChildren.concat(that.allChildren), this.isSkipped && that.isSkipped);
    }
    toString() {
        let s = (this.isSkipped ? "@skip " : "") + this.nonterminalName;
        if (this.children.length == 0) {
            s += ":" + (0, display_1.escapeForReading)(this.text, "\"");
        }
        else {
            let t = "";
            let offsetReachedSoFar = this.start;
            for (const pt of this.allChildren) {
                if (offsetReachedSoFar < pt.start) {
                    // previous child and current child have a gap between them that must have been matched as a terminal
                    // in the rule for this node.  Insert it as a quoted string.
                    const terminal = this.text.substring(offsetReachedSoFar - this.start, pt.start - this.start);
                    t += "\n" + (0, display_1.escapeForReading)(terminal, "\"");
                }
                t += "\n" + pt;
                offsetReachedSoFar = pt.end;
            }
            if (offsetReachedSoFar < this.end) {
                // final child and end of this node have a gap -- treat it the same as above.
                const terminal = this.text.substring(offsetReachedSoFar - this.start);
                t += "\n" + (0, display_1.escapeForReading)(terminal, "\"");
            }
            const smallEnoughForOneLine = 50;
            if (t.length <= smallEnoughForOneLine) {
                s += " { " + t.substring(1) // remove initial newline
                    .replace("\n", ", ")
                    + " }";
            }
            else {
                s += " {" + (0, display_1.indent)(t, "  ") + "\n}";
            }
        }
        return s;
    }
}
exports.InternalParseTree = InternalParseTree;

},{"./display":8}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrammarError = exports.InternalParseError = exports.ParseError = void 0;
const display_1 = require("./display");
/**
 * Exception thrown when a sequence of characters doesn't match a grammar
 */
class ParseError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.ParseError = ParseError;
class InternalParseError extends ParseError {
    constructor(message, nonterminalName, expectedText, textBeingParsed, pos) {
        super((0, display_1.makeErrorMessage)(message, nonterminalName, expectedText, textBeingParsed, pos, "string being parsed"));
        this.nonterminalName = nonterminalName;
        this.expectedText = expectedText;
        this.textBeingParsed = textBeingParsed;
        this.pos = pos;
    }
}
exports.InternalParseError = InternalParseError;
class GrammarError extends ParseError {
    constructor(message, e) {
        super(e ? (0, display_1.makeErrorMessage)(message, e.nonterminalName, e.expectedText, e.textBeingParsed, e.pos, "grammar")
            : message);
    }
}
exports.GrammarError = GrammarError;

},{"./display":8}],12:[function(require,module,exports){
(function (__dirname){(function (){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.visualizeAsHtml = exports.visualizeAsUrl = void 0;
const compiler_1 = require("./compiler");
const parserlib_1 = require("../parserlib");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function emptyIterator() {
    return {
        next() { return { done: true }; }
    };
}
function getIterator(list) {
    return list[Symbol.iterator]();
}
const MAX_URL_LENGTH_FOR_DESKTOP_BROWSE = 2020;
/**
 * Visualizes a parse tree using a URL that can be pasted into your web browser.
 * @param parseTree tree to visualize
 * @param <NT> the enumeration of symbols in the parse tree's grammar
 * @return url that shows a visualization of the parse tree
 */
function visualizeAsUrl(parseTree, nonterminals) {
    const base = "http://web.mit.edu/6.031/www/parserlib/" + parserlib_1.VERSION + "/visualizer.html";
    const code = expressionForDisplay(parseTree, nonterminals);
    const url = base + '?code=' + fixedEncodeURIComponent(code);
    if (url.length > MAX_URL_LENGTH_FOR_DESKTOP_BROWSE) {
        // display alternate instructions to the console
        console.error('Visualization URL is too long for web browser and/or web server.\n'
            + 'Instead, go to ' + base + '\n'
            + 'and copy and paste this code into the textbox:\n'
            + code);
    }
    return url;
}
exports.visualizeAsUrl = visualizeAsUrl;
const visualizerHtmlFile = path_1.default.resolve(__dirname, '../../src/visualizer.html');
/**
 * Visualizes a parse tree as a string of HTML that can be displayed in a web browser.
 * @param parseTree tree to visualize
 * @param <NT> the enumeration of symbols in the parse tree's grammar
 * @return string of HTML that shows a visualization of the parse tree
 */
function visualizeAsHtml(parseTree, nonterminals) {
    const html = fs_1.default.readFileSync(visualizerHtmlFile, 'utf8');
    const code = expressionForDisplay(parseTree, nonterminals);
    const result = html.replace(/\/\/CODEHERE/, "return '" + fixedEncodeURIComponent(code) + "';");
    return result;
}
exports.visualizeAsHtml = visualizeAsHtml;
function expressionForDisplay(parseTree, nonterminals) {
    const { nonterminalToString } = (0, compiler_1.makeNonterminalConverters)(nonterminals);
    return forDisplay(parseTree, [], parseTree);
    function forDisplay(node, siblings, parent) {
        const name = nonterminalToString(node.name).toLowerCase();
        let s = "nd(";
        if (node.children.length == 0) {
            s += "\"" + name + "\",nd(\"'" + cleanString(node.text) + "'\"),";
        }
        else {
            s += "\"" + name + "\",";
            const children = node.allChildren.slice(); // make a copy for shifting
            const firstChild = children.shift();
            let childrenExpression = forDisplay(firstChild, children, node);
            if (node.start < firstChild.start) {
                // node and its first child have a gap between them that must have been matched as a terminal
                // in the rule for node.  Insert it as a quoted string.
                childrenExpression = precedeByTerminal(node.text.substring(0, firstChild.start - node.start), childrenExpression);
            }
            s += childrenExpression + ",";
        }
        if (siblings.length > 0) {
            const sibling = siblings.shift();
            let siblingExpression = forDisplay(sibling, siblings, parent);
            if (node.end < sibling.start) {
                // node and its sibling have a gap between them that must have been matched as a terminal
                // in the rule for parent.  Insert it as a quoted string.
                siblingExpression = precedeByTerminal(parent.text.substring(node.end - parent.start, sibling.start - parent.start), siblingExpression);
            }
            s += siblingExpression;
        }
        else {
            let siblingExpression = "uu";
            if (node.end < parent.end) {
                // There's a gap between the end of node and the end of its parent, which must be a terminal matched by parent.
                // Insert it as a quoted string.
                siblingExpression = precedeByTerminal(parent.text.substring(node.end - parent.start), siblingExpression);
            }
            s += siblingExpression;
        }
        if (node.isSkipped) {
            s += ",true";
        }
        s += ")";
        return s;
    }
    function precedeByTerminal(terminal, expression) {
        return "nd(\"'" + cleanString(terminal) + "'\", uu, " + expression + ")";
    }
    function cleanString(s) {
        let rvalue = s.replace(/\\/g, "\\\\");
        rvalue = rvalue.replace(/"/g, "\\\"");
        rvalue = rvalue.replace(/\n/g, "\\n");
        rvalue = rvalue.replace(/\r/g, "\\r");
        return rvalue;
    }
}
// from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
function fixedEncodeURIComponent(s) {
    return encodeURIComponent(s).replace(/[!'()*]/g, c => '%' + c.charCodeAt(0).toString(16));
}

}).call(this)}).call(this,"/node_modules/parserlib/internal")

},{"../parserlib":13,"./compiler":7,"fs":5,"path":14}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.visualizeAsHtml = exports.visualizeAsUrl = exports.compile = exports.ParseError = exports.VERSION = void 0;
exports.VERSION = "3.2.3";
var types_1 = require("./internal/types");
Object.defineProperty(exports, "ParseError", { enumerable: true, get: function () { return types_1.ParseError; } });
;
var compiler_1 = require("./internal/compiler");
Object.defineProperty(exports, "compile", { enumerable: true, get: function () { return compiler_1.compile; } });
var visualizer_1 = require("./internal/visualizer");
Object.defineProperty(exports, "visualizeAsUrl", { enumerable: true, get: function () { return visualizer_1.visualizeAsUrl; } });
Object.defineProperty(exports, "visualizeAsHtml", { enumerable: true, get: function () { return visualizer_1.visualizeAsHtml; } });

},{"./internal/compiler":7,"./internal/types":11,"./internal/visualizer":12}],14:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))

},{"_process":15}],15:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],16:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const parserlib_1 = require("parserlib");
const Puzzle_1 = require("./Puzzle");
const assert_1 = __importDefault(require("assert"));
const grammar = `
@skip whitespace {
    starBattle ::= (comment newLine)* sizeExpression newLine ((region | comment) newLine)*;
    sizeExpression ::= number 'x' number comment?;
    region ::= (coordStar)* '|' (coord)* comment?;
    coordStar ::= number ',' number;
    coord ::= number ',' number;
    comment ::= '#' [^\\n]*;
}
number ::= [0-9]+;
whitespace ::= [ \\t\\r]+;
newLine ::= [\\n]+;
`;
var StarBattleSymbols;
(function (StarBattleSymbols) {
    StarBattleSymbols[StarBattleSymbols["StarBattle"] = 0] = "StarBattle";
    StarBattleSymbols[StarBattleSymbols["Comment"] = 1] = "Comment";
    StarBattleSymbols[StarBattleSymbols["SizeExpression"] = 2] = "SizeExpression";
    StarBattleSymbols[StarBattleSymbols["Region"] = 3] = "Region";
    StarBattleSymbols[StarBattleSymbols["CoordStar"] = 4] = "CoordStar";
    StarBattleSymbols[StarBattleSymbols["Coord"] = 5] = "Coord";
    StarBattleSymbols[StarBattleSymbols["Number"] = 6] = "Number";
    StarBattleSymbols[StarBattleSymbols["Whitespace"] = 7] = "Whitespace";
    StarBattleSymbols[StarBattleSymbols["NewLine"] = 8] = "NewLine";
})(StarBattleSymbols || (StarBattleSymbols = {}));
const parser = (0, parserlib_1.compile)(grammar, StarBattleSymbols, StarBattleSymbols.StarBattle);
/**
 * Parse a string into a StarBattlePuzzle.
 *
 * @param input string to parse
 * @returns StarBattlePuzzle parsed from the string
 * @throws Error if the string doesn't match the Star Battle grammar.
 */
function parse(input) {
    const parseTree = parser.parse(input + '\n');
    const sizeExpression = parseTree.childrenByName(StarBattleSymbols.SizeExpression).at(0) ?? assert_1.default.fail();
    // get the dimensions
    const dims = sizeExpression
        .childrenByName(StarBattleSymbols.Number)
        .map(node => node.text)
        .map(num => parseInt(num));
    // get the positions of the stars
    const stars = parseTree
        .childrenByName(StarBattleSymbols.Region)
        .flatMap(region => region.childrenByName(StarBattleSymbols.CoordStar));
    // get each individual regions as Array<Array<Position>>
    const regions = parseTree
        .childrenByName(StarBattleSymbols.Region)
        .map(region => region.children.filter(child => {
        return child.name === StarBattleSymbols.Coord
            || child.name === StarBattleSymbols.CoordStar;
    }))
        .map(extractPositions);
    const [rows, cols] = dims;
    (0, assert_1.default)(rows !== undefined);
    (0, assert_1.default)(cols !== undefined);
    // create an empty board
    const board = new Array(rows).fill(0).map(row => new Array(cols).fill(0).map(col => {
        return {
            containsStar: false,
            regionId: 0
        };
    }));
    // puts stars on the empty board
    extractPositions(stars).map(position => {
        const boardRow = board[position.row - 1] ?? assert_1.default.fail();
        const boardCell = boardRow[position.col - 1] ?? assert_1.default.fail();
        boardCell.containsStar = true;
    });
    // assign regions on the empty board
    regions.map((region, i) => {
        region.map(position => {
            const boardRow = board[position.row - 1] ?? assert_1.default.fail();
            const boardCell = boardRow[position.col - 1] ?? assert_1.default.fail();
            boardCell.regionId = i;
        });
    });
    return new Puzzle_1.Puzzle(rows, cols, board);
}
exports.parse = parse;
/**
 * From an array of Coord or CoordStar nodes, extracts all positions of the coordinates
 * and returns them as an array of Position objects
 *
 * @param line the array of Coord or CoordStar nodes representing the coordinates for a particular region
 * @returns an array of Position objects that represents the same coordinates as line
 */
function extractPositions(line) {
    return line.map(coord => coord.childrenByName(StarBattleSymbols.Number))
        .map(node => node.map(number => parseInt(number.text)))
        .map(numbers => {
        return {
            row: numbers[0] ?? assert_1.default.fail(),
            col: numbers[1] ?? assert_1.default.fail()
        };
    });
}

},{"./Puzzle":17,"assert":1,"parserlib":13}],17:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Puzzle = void 0;
const assert_1 = __importDefault(require("assert"));
class Puzzle {
    /**
     * Returns a Puzzle object
     *
     * @param rows the number of rows the board has
     * @param cols the number of cols the board has
     * @param board the current state of the board
     */
    constructor(rows, cols, board) {
        this.rows = rows;
        this.cols = cols;
        this.boardState = this.deepCopyBoard(board);
        this.checkRep();
    }
    /**
     * Returns the total number of cells with the specific regID
     *
     * @param regID the regionID that you want to get the area
     * @returns the total number of cells with that specific regID
     */
    getRegionArea(regID) {
        const count = this.boardState.reduce((totalCount, currRow) => {
            const rowCount = currRow.reduce((currCount, cell) => {
                if (cell.regionId === regID) {
                    return currCount + 1;
                }
                return currCount;
            }, 0);
            return totalCount + rowCount;
        }, 0);
        return count;
    }
    /**
     * Returns a position on the board of the cell that has the specific regID or undefined
     * if no cells with that regID has been found in the current board state.
     *
     * @param regID the regionID you want to get a position at
     * @returns described above.
     */
    getRegIDPos(regID) {
        for (let row = 0; row < this.rows; row++) {
            const currRow = this.boardState[row] ?? assert_1.default.fail("Invalid row!");
            for (let col = 0; col < this.cols; col++) {
                const currCell = currRow[col] ?? assert_1.default.fail("Invalid Col!");
                if (currCell.regionId === regID) {
                    return { row: row, col: col };
                }
            }
        }
        return undefined;
    }
    /**
     * Given a regID and a staring cell with at regID, run the floodfill alg to see
     * how many cells the floodfill can cover by going left, right, up, and down.
     *
     * @param regID the specific regID that we are running floodfill on
     * @param startingCell the starting cell that should be a valid cell on the board and
     *        startingCell.regionID === regID
     *
     * @returns the number of tiles that can be floodfilled from the startingCell by going
     *          left, right, up, down to other cells that also contains the same regID
     *
     */
    floodFill(regID, startingCell) {
        let cellCount = 0;
        const directions = [
            [1, 0],
            [-1, 0],
            [0, +1],
            [0, -1],
        ];
        const seen = [startingCell];
        const queue = [startingCell];
        while (queue.length !== 0) {
            const currCell = queue.shift() ?? assert_1.default.fail("There are no items in the queue!");
            cellCount += 1;
            const neighbors = this.getNeighbors(currCell, directions);
            for (const neighbor of neighbors) {
                const neighborCell = this.getCell(neighbor);
                if (!this.posInArray(seen, neighbor) &&
                    neighborCell.regionId === regID) {
                    seen.push(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        return cellCount;
    }
    /**
     * Checks to make sure that the currPosition is a valid position inside of the 2D board.
     *
     * @param currPosition the position that you want to check
     * @returns true if the currPosition is a valid position inside of the 2D board
     *          false otherwise
     */
    isValidPosition(currPosition) {
        const goodX = 0 <= currPosition.row && currPosition.row < this.rows;
        const goodY = 0 <= currPosition.col && currPosition.col < this.cols;
        return goodX && goodY;
    }
    /**
     * Given a position, return the 4 neighbors up, down, left, and right that are
     * valid within the dimensions of the board.
     *
     * @param currPosition the current position that you want to get the neighbors
     * @param directions all the directions that the neighbor can be from
     * @returns a list of valid neighbors for that current position for this.boardState
     */
    getNeighbors(currPosition, directions) {
        const neighbors = [];
        for (const direction of directions) {
            const deltaX = direction[0] ?? assert_1.default.fail("Directions needs a delta X");
            const deltaY = direction[1] ?? assert_1.default.fail("Directions needs a delta Y");
            const newPos = {
                row: currPosition.row + deltaX,
                col: currPosition.col + deltaY,
            };
            if (this.isValidPosition(newPos)) {
                neighbors.push(newPos);
            }
        }
        return neighbors;
    }
    /**
     * Given an array of positions, check to see if checkPosition is already in the array.
     *
     * @param array the array to check
     * @param checkPosition the position to check to see if this position already appears inside of the array
     * @returns true if checkPosition in array. False otherwise.
     */
    posInArray(array, checkPosition) {
        for (const pos of array) {
            const sameX = checkPosition.row === pos.row;
            const sameY = checkPosition.col === pos.col;
            if (sameX && sameY) {
                return true;
            }
        }
        return false;
    }
    /**
     * Checks to make sure all regions inside of the board are contigious.
     *
     * @throws error if they are not contigious as described in the rep invariant
     */
    checkContigiousRegion() {
        const allRegions = [...this.getAllRegionID()];
        for (const region of allRegions) {
            //get the region area
            const regionArea = this.getRegionArea(region);
            //run flood fill to see how much area flood fill can cover
            const randomStartCell = this.getRegIDPos(region) ??
                assert_1.default.fail(`There are no cells with region id ${region}!`);
            const floodFillCount = this.floodFill(region, randomStartCell);
            //compare results
            (0, assert_1.default)(regionArea === floodFillCount, `The region ${region} is not contigious!`);
        }
    }
    /**
     * Checks to make sure that all regions have <= 2 stars
     *
     * @throws error if any regions violates the rep invariant of having > 2 stars.
     */
    regionCheck() {
        const allRegions = [...this.getAllRegionID()];
        for (const region of allRegions) {
            const currStarCount = this.regionStarCount(region);
            (0, assert_1.default)(currStarCount <= 2, `Region ${region} have ${currStarCount} stars!`);
        }
    }
    /**
     * Checks to make sure that all rows have <= 2 stars
     *
     * @throws error if any rows violates the rep invariant of having > 2 stars.
     */
    rowCheck() {
        for (let i = 0; i < this.rows; i++) {
            const starCount = this.rowStarCount(i);
            (0, assert_1.default)(starCount <= 2, `Row ${i} have ${starCount} stars!`);
        }
    }
    /**
     * Checks to make sure that all cols have <= 2 stars
     *
     * @throws error if any cols violates the rep invariant of having > 2 stars.
     */
    colCheck() {
        for (let i = 0; i < this.cols; i++) {
            const starCount = this.colStarCount(i);
            (0, assert_1.default)(starCount <= 2, `Col ${i} have ${starCount} stars!`);
        }
    }
    /**
     * Make sure that the rep invariant is being followed
     */
    checkRep() {
        (0, assert_1.default)(this.rows === this.cols, "The board must be a square!");
        (0, assert_1.default)(this.rows === this.boardState.length, `The board must have ${this.rows} # of rows!`);
        for (const row of this.boardState) {
            (0, assert_1.default)(this.cols === row.length, `Each row must have ${this.cols} # of cols!`);
        }
        const regionCount = this.getAllRegionID().size;
        (0, assert_1.default)(regionCount === this.rows, `There must be ${this.rows} different regions! Got ${regionCount}`);
        //check contigious region
        this.checkContigiousRegion();
    }
    /**
     * Returns an array of position where all positions are valid positions in the board
     * that contains stars
     *
     * @returns as described above.
     */
    getStarPosArray() {
        const starPos = [];
        for (let row = 0; row < this.rows; row++) {
            const currRow = this.boardState[row] ?? assert_1.default.fail("Invalid row!");
            for (let col = 0; col < this.cols; col++) {
                const currCell = currRow[col] ?? assert_1.default.fail("Invalid Col!");
                if (currCell.containsStar) {
                    const newPos = { row: row, col: col };
                    starPos.push(newPos);
                }
            }
        }
        return starPos;
    }
    /**
     * Checks to make sure that any cell that contains a star does not touch any other cell
     * that contains a star up, down, left, right, or diagonally
     *
     * @throws error if a star violates the condition described above.
     */
    surroundCheckRep() {
        //get the directions of the neighbors
        const directions = [];
        for (let deltaX = -1; deltaX <= 1; deltaX++) {
            for (let deltaY = -1; deltaY <= 1; deltaY++) {
                const currDir = [deltaX, deltaY];
                if (deltaX !== 0 || deltaY !== 0) {
                    directions.push(currDir);
                }
            }
        }
        //get the positions that contains stars
        const starPoses = this.getStarPosArray();
        for (const pos of starPoses) {
            const neighbors = this.getNeighbors(pos, directions);
            for (const neighbor of neighbors) {
                const neighborCell = this.getCell(neighbor);
                (0, assert_1.default)(!neighborCell.containsStar, `Neighbor at (${neighbor.row}, ${neighbor.col}) contains a star!`);
            }
        }
    }
    /**
     * Checks the surrounding 3x3 area of (x,y) with (x,y) as its center to make sure that
     * the star that is going to be added at this position doesn't violate the rep invariant
     *
     * @param pos where
     *              pos.x is value of the position, from the left. Must be a non-negative integer.
     *              pos.y is value of the position, from the top. Must be a non-negative integer.
     * @throws error if any of the position surrounding the cell contains stars.
     */
    checkSurround(pos) {
        const beginRow = pos.row - 1;
        const endRow = pos.row + 2;
        const beginCol = pos.col - 1;
        const endCol = pos.col + 2;
        for (let i = beginRow; i < endRow; i++) {
            const currRow = this.boardState[i];
            if (currRow === undefined) {
                continue;
            }
            for (let j = beginCol; j < endCol; j++) {
                const currCell = currRow[j];
                if (currCell !== undefined && i !== pos.row && j !== pos.col) {
                    (0, assert_1.default)(!currCell.containsStar, `(${i}, ${j}) contains a star!`);
                }
            }
        }
    }
    /**
     * Returns the number of stars with the regionID that is in the current state of the board.
     *
     * @param regionID a specific regionID
     * @returns as described above
     */
    regionStarCount(regionID) {
        const starCount = this.boardState.reduce((totalPrevCount, row) => {
            return (totalPrevCount +
                row.reduce((rowPrevCount, cell) => {
                    if (cell.containsStar && cell.regionId === regionID) {
                        return rowPrevCount + 1;
                    }
                    return rowPrevCount;
                }, 0));
        }, 0);
        return starCount;
    }
    /**
     * Counts the number of stars in the given row
     *
     * @param row the row that you are checking
     * @returns the number of stars that row has
     */
    rowStarCount(row) {
        const currRow = this.boardState[row] ?? assert_1.default.fail("Invalid row!");
        const starCount = currRow.reduce((prevCount, cell) => {
            if (cell.containsStar) {
                return prevCount + 1;
            }
            return prevCount;
        }, 0);
        return starCount;
    }
    /**
     * Counts the number of stars in the given col
     *
     * @param col the col that you are checking
     * @returns the number of stars that col has
     */
    colStarCount(col) {
        const currCol = this.boardState.map((row) => {
            const colCell = row[col] ?? assert_1.default.fail("Invalid col!");
            return colCell;
        });
        const starCount = currCol.reduce((prevCount, cell) => {
            if (cell.containsStar) {
                return prevCount + 1;
            }
            return prevCount;
        }, 0);
        return starCount;
    }
    /**
     * @inheritdoc
     */
    flip(pos) {
        const currCell = this.getCell(pos);
        let flipToStar = false;
        //if the cell trying to flip over is not star, then flip it over with check
        if (!currCell.containsStar) {
            // //check the surround to make sure that it's not touching adjacent stars
            // this.checkSurround(pos);
            // //check the region so that it doesn't already contain 2 stars
            // assert(
            //     this.regionStarCount(currCell.regionId) < 2,
            //     `Region ${currCell.regionId} already contains 2 stars!`
            // );
            // //check the row to make sure that it doesn't already contain 2 stars
            // assert(
            //     this.rowStarCount(pos.x) < 2,
            //     `Row ${pos.x} already contains 2 stars!`
            // );
            // //check the col to make sure that it doesn't already contain 2 stars
            // assert(
            //     this.colStarCount(pos.y) < 2,
            //     `Col ${pos.y} already contains 2 stars!`
            // );
            flipToStar = true;
        }
        else {
            flipToStar = false;
        }
        //create the new cell
        const newCell = {
            containsStar: flipToStar,
            regionId: currCell.regionId,
        };
        //create the new board
        const copiedBoard = this.deepCopyBoard(this.boardState);
        const changeRow = copiedBoard[pos.row] ?? assert_1.default.fail("Invalid row!");
        //add the new cell into the new board
        if (changeRow[pos.col] !== undefined) {
            changeRow[pos.col] = newCell;
        }
        else {
            throw new Error("Invalid Col!");
        }
        return new Puzzle(this.rows, this.cols, copiedBoard);
    }
    /**
     * Returns all the regionID found in the current state of the board as a set.
     *
     * @returns as described above.
     */
    getAllRegionID() {
        const regIDSet = this.boardState.reduce((totalPrevSet, currRow) => {
            //reduce each row to a set of regID that only appear in that row
            const rowSet = currRow.reduce((rowPrevSet, cell) => {
                rowPrevSet = new Set([...rowPrevSet, cell.regionId]);
                return rowPrevSet;
            }, new Set());
            //add each regID of each row into the totalPrevSet
            totalPrevSet = new Set([...totalPrevSet, ...rowSet]);
            return totalPrevSet;
        }, new Set());
        return regIDSet;
    }
    /**
     * Checks all the region of the board to make sure all regions have exactly 2 stars.
     *
     * @returns true if all regions have exactly 2 stars. False otherwise.
     */
    checkAllRegion() {
        const allRegions = [...this.getAllRegionID()];
        for (const regID of allRegions) {
            const currStarCount = this.regionStarCount(regID);
            if (currStarCount !== 2) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks all the rows of the board to make sure all regions have exactly 2 stars.
     *
     * @returns true if all rows have exactly 2 stars. False otherwise.
     */
    checkAllRows() {
        for (let i = 0; i < this.rows; i++) {
            const starCount = this.rowStarCount(i);
            if (starCount !== 2) {
                return false;
            }
        }
        return true;
    }
    /**
     * Checks all the cols of the board to make sure all regions have exactly 2 stars.
     *
     * @returns true if all cols have exactly 2 stars. False otherwise.
     */
    checkAllCols() {
        for (let i = 0; i < this.cols; i++) {
            const starCount = this.colStarCount(i);
            if (starCount !== 2) {
                return false;
            }
        }
        return true;
    }
    /**
     * @inheritdoc
     */
    isSolved() {
        //check to make sure that all regions contain 2 stars
        const allRegionGood = this.checkAllRegion();
        //check to make sure that all rows contain 2 stars
        const allRowGood = this.checkAllRows();
        //check to make sure that all cols contain 2 stars
        const allColsGood = this.checkAllCols();
        return allRegionGood && allColsGood && allRowGood;
    }
    /**
     * @inheritdoc
     */
    getCell(pos) {
        const cellRow = this.boardState[pos.row] ?? assert_1.default.fail("Invalid x!");
        const cell = cellRow[pos.col] ?? assert_1.default.fail("Invalid Y!");
        return cell;
    }
    /**
     * @inheritdoc
     */
    getBoard() {
        const copyBoard = this.deepCopyBoard(this.boardState);
        return copyBoard;
    }
    /**
     * Returns
     *      an array of Positions where each position represents a star inside of that specific region,
     *      and an array of positions where each position do not contain a star inside of that specific region
     *
     * @param regID the regionID that you want to look for the star coordinates
     * @returns as described above
     */
    findStarCoord(regID) {
        const starCoords = [];
        const noStarCoords = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const currPosition = { row: row, col: col };
                const currCell = this.getCell(currPosition);
                if (currCell.regionId === regID) {
                    if (currCell.containsStar) {
                        starCoords.push(currPosition);
                    }
                    else {
                        noStarCoords.push(currPosition);
                    }
                }
            }
        }
        return { star: starCoords, noStar: noStarCoords };
    }
    /**
     * @inheritdoc
     */
    toString() {
        let parsableString = `${this.rows}x${this.cols}\n`;
        //get all regions sorted
        const allRegions = [...this.getAllRegionID()].sort((a, b) => a - b);
        for (const regID of allRegions) {
            //find all stars and no star coords
            const regCoords = this.findStarCoord(regID);
            const starCoords = regCoords.star;
            const noStarCoords = regCoords.noStar;
            //then create a string for each region
            const starString = starCoords.reduce((currString, currPosition) => {
                return currString + `${currPosition.row + 1},${currPosition.col + 1}  `;
            }, "");
            //create no star string for each region
            const noStarString = noStarCoords.reduce((currString, currPosition) => {
                return currString + `${currPosition.row + 1},${currPosition.col + 1} `;
            }, "");
            //add the strings onto the parsable string
            parsableString += `${starString}| ${noStarString}\n`;
        }
        return parsableString;
    }
    /**
     * @inheritdoc
     */
    clearBoard() {
        const clearBoard = this.boardState.map((row) => row.map((cell) => {
            const noStar = {
                containsStar: false,
                regionId: cell.regionId,
            };
            return noStar;
        }));
        return new Puzzle(this.rows, this.cols, clearBoard);
    }
    /**
     * @inheritdoc
     */
    equalValue(other) {
        const sameRows = this.rows === other.rows;
        const sameCols = this.cols === other.cols;
        if (!sameRows || !sameCols) {
            return false;
        }
        //check the entire board
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const currPosition = { row: row, col: col };
                const thisCell = this.getCell(currPosition);
                const otherCell = other.getCell(currPosition);
                const sameRegID = thisCell.regionId === otherCell.regionId;
                const sameStar = thisCell.containsStar === otherCell.containsStar;
                if (!sameRegID || !sameStar) {
                    console.log(thisCell, otherCell, currPosition);
                    return false;
                }
            }
        }
        return true;
    }
    /**
     * Returns a deep copy version of the board passed in.
     *
     * @param board the board that you want to create a deep copy from
     * @returns a deep copy version of board
     */
    deepCopyBoard(board) {
        const copyBoard = board.map((row) => row.map((cell) => cell));
        return copyBoard;
    }
}
exports.Puzzle = Puzzle;

},{"assert":1}],18:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.drawPuzzleStars = exports.drawPuzzleRegionBorders = exports.drawPuzzleRegionBackgrounds = exports.drawPuzzleGrid = exports.drawPuzzle = void 0;
const assert_1 = __importDefault(require("assert"));
/**
 * Draws the state of a puzzle onto a canvas, using the canvas's width and height.
 * The grid is drawn with 1px grey border on the closest pixel position on the canvas
 * to make the grid lines evenly spaced.
 * Each region is drawn with a random color of background.
 * Each star is drawn within each cell.
 *
 * @param canvas the canvas to be drawn upon.
 * @param puzzle the puzzle to be drawn.
 */
function drawPuzzle(canvas, puzzle) {
    // just glue code, no need to test
    drawPuzzleRegionBackgrounds(canvas, puzzle);
    drawPuzzleGrid(canvas, puzzle);
    drawPuzzleStars(canvas, puzzle);
    drawPuzzleRegionBorders(canvas, puzzle);
}
exports.drawPuzzle = drawPuzzle;
/**
 * Draws a grid of the puzzle onto a canvas, using the canvas's width and height.
 * More precisely, the grid is drawn with 1px grey (#555555) border on the closest pixel position
 * on the canvas to make the grid lines evenly spaced.
 *
 * @param canvas the canvas to be drawn upon.
 * @param puzzle the puzzle to be drawn.
 */
function drawPuzzleGrid(canvas, puzzle) {
    const FILL_COLOR = "#555555";
    const context = canvas.getContext("2d") ?? assert_1.default.fail("null context");
    context.fillStyle = FILL_COLOR;
    for (let x = 0; x <= puzzle.cols; x += 1) {
        const canvasX = Math.round((canvas.width - 1) * x / puzzle.cols);
        context.fillRect(canvasX, 0, 1, canvas.height);
    }
    for (let y = 0; y <= puzzle.rows; y += 1) {
        const canvasY = Math.round((canvas.height - 1) * y / puzzle.rows);
        context.fillRect(0, canvasY, canvas.width, 1);
    }
}
exports.drawPuzzleGrid = drawPuzzleGrid;
/**
 * Draws the regions of the puzzle onto a canvas, using the canvas's width and height.
 * Each region is assigned a random color with 75% lightness,
 * and the backgrounds of each square cell in each region are colored this color.
 * The bounds of the square cells are determined to make each square cell have as close to identical
 * width and height as possible.
 *
 * @param canvas the canvas to be drawn upon.
 * @param puzzle the puzzle to be drawn.
 */
function drawPuzzleRegionBackgrounds(canvas, puzzle) {
    /**
     * @returns hex string of a random HSL color.
     */
    function getRandomColor() {
        const degrees = 360;
        const lightness = 75;
        const percent = 100;
        return `hsl(${Math.floor(Math.random() * 360)}, ${Math.floor(Math.random() * 100)}%, ${lightness}%)`;
    }
    const context = canvas.getContext("2d") ?? assert_1.default.fail("null context");
    const regionColors = new Map();
    for (let x = 0; x < puzzle.cols; x += 1) {
        for (let y = 0; y < puzzle.rows; y += 1) {
            const squareLeft = Math.round((canvas.width) * x / puzzle.cols);
            const squareRight = Math.round((canvas.width) * (x + 1) / puzzle.cols);
            const squareTop = Math.round((canvas.height) * y / puzzle.rows);
            const squareBottom = Math.round((canvas.height) * (y + 1) / puzzle.rows);
            const regionId = puzzle.getCell({ col: x, row: y }).regionId;
            const regionColor = regionColors.get(regionId) ?? getRandomColor();
            regionColors.set(regionId, regionColor);
            context.fillStyle = regionColor;
            context.fillRect(squareLeft, squareTop, squareRight - squareLeft, squareBottom - squareTop);
        }
    }
}
exports.drawPuzzleRegionBackgrounds = drawPuzzleRegionBackgrounds;
/**
 * Draws border around the regions of the puzzle.
 * Each border is 3 units wide and black in color.
 *
 * @param canvas the canvas to be drawn upon.
 * @param puzzle the puzzle to be drawn.
 */
function drawPuzzleRegionBorders(canvas, puzzle) {
    const context = canvas.getContext('2d') ?? assert_1.default.fail('null context');
    context.save();
    context.strokeStyle = 'black';
    context.lineWidth = 3;
    context.beginPath();
    // check the cells (i, j) and (i - 1, j), if they are not 
    // from the same region, then add a horizontal border between them
    for (let i = 1; i < puzzle.rows; i++) {
        for (let j = 0; j < puzzle.cols; j++) {
            const startX = j * canvas.width / puzzle.cols;
            const endX = (j + 1) * canvas.width / puzzle.cols;
            const y = i * canvas.height / puzzle.rows;
            if (puzzle.getCell({ row: i - 1, col: j }).regionId !== puzzle.getCell({ row: i, col: j }).regionId) {
                context.moveTo(startX, y);
                context.lineTo(endX, y);
            }
        }
    }
    // check the cells (i, j) and (i, j - 1), if they are not 
    // from the same region, then add a vertical border between them
    for (let i = 0; i < puzzle.rows; i++) {
        for (let j = 1; j < puzzle.cols; j++) {
            const x = j * canvas.width / puzzle.cols;
            const startY = i * canvas.height / puzzle.rows;
            const endY = (i + 1) * canvas.height / puzzle.rows;
            if (puzzle.getCell({ row: i, col: j - 1 }).regionId !== puzzle.getCell({ row: i, col: j }).regionId) {
                context.moveTo(x, startY);
                context.lineTo(x, endY);
            }
        }
    }
    // add borders around the whole puzzle
    context.moveTo(0, 0);
    context.lineTo(0, canvas.height);
    context.lineTo(canvas.width, canvas.height);
    context.lineTo(canvas.width, 0);
    context.lineTo(0, 0);
    context.stroke();
    context.restore();
}
exports.drawPuzzleRegionBorders = drawPuzzleRegionBorders;
/**
 * Draws the stars of the puzzle onto a canvas, using canvas's width and height.
 * The star icon is drawn with black color and will cover the center pixel of each square cell.
 *
 * @param canvas the canvas to be drawn upon.
 * @param puzzle the puzzle to be drawn upon.
 */
function drawPuzzleStars(canvas, puzzle) {
    const context = canvas.getContext("2d") ?? assert_1.default.fail("null context");
    context.fillStyle = "#000000";
    /**
     * Draws a star symbol at the specified location and with the specified size.
     *
     * @param left the left bound of the star symbol, positive integer
     * @param top the top bound of the star symbol, positive integer
     * @param width the width the star symbol occupies, positive integer
     * @param height the height the star symbol occupies, positive integer
     */
    function drawStar(left, top, width, height) {
        const MIDDLE = 0.5;
        const MAJOR_LENGTH = 0.4;
        const MINOR_LENGTH = 0.15;
        const starPaths = [
            [[MIDDLE, MIDDLE - MAJOR_LENGTH], [MIDDLE - MINOR_LENGTH, MIDDLE]],
            [[MIDDLE + MAJOR_LENGTH, MIDDLE], [MIDDLE, MIDDLE - MINOR_LENGTH]],
            [[MIDDLE, MIDDLE + MAJOR_LENGTH], [MIDDLE + MINOR_LENGTH, MIDDLE]],
            [[MIDDLE - MAJOR_LENGTH, MIDDLE], [MIDDLE, MIDDLE + MINOR_LENGTH]],
        ];
        const relativeToAbsoluteX = (x) => Math.round(left + width * x);
        const relativeToAbsoluteY = (y) => Math.round(top + height * y);
        for (const polygon of starPaths) {
            context.beginPath();
            context.moveTo(relativeToAbsoluteX(MIDDLE), relativeToAbsoluteY(MIDDLE));
            for (const position of polygon) {
                context.lineTo(relativeToAbsoluteX(position[0]), relativeToAbsoluteY(position[1]));
            }
            context.closePath();
            context.fill();
        }
    }
    for (let x = 0; x < puzzle.cols; x += 1) {
        for (let y = 0; y < puzzle.rows; y += 1) {
            const squareLeft = Math.round((canvas.width) * x / puzzle.cols);
            const squareRight = Math.round((canvas.width) * (x + 1) / puzzle.cols);
            const squareTop = Math.round((canvas.height) * y / puzzle.rows);
            const squareBottom = Math.round((canvas.height) * (y + 1) / puzzle.rows);
            if (puzzle.getCell({ col: x, row: y }).containsStar) {
                drawStar(squareLeft, squareTop, squareRight - squareLeft, squareBottom - squareTop);
            }
        }
    }
}
exports.drawPuzzleStars = drawPuzzleStars;

},{"assert":1}],19:[function(require,module,exports){
"use strict";
/* Copyright (c) 2021-23 MIT 6.102/6.031 course staff, all rights reserved.
 * Redistribution of original or derived work requires permission of course staff.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// This code is loaded into starb-client.html, see the `npm compile` and
//   `npm watchify-client` scripts.
// Remember that you will *not* be able to use Node APIs like `fs` in the web browser.
const assert_1 = __importDefault(require("assert"));
const WebClient_1 = require("./WebClient");
/**
 * Puzzle to request and play.
 * Project instructions: this constant is a [for now] requirement in the project spec.
 */
const PUZZLE = "kd-6-31-6";
// const PUZZLE = "kd-1-1-1";
// see ExamplePage.ts for an example of an interactive web page
/**
 * Clear the text from the html textArea Element and display the new message
 *
 * @param message the message that you want to display on the html page
 * @param textArea the HTML element that the message will be displayed on
 */
function displayMessage(message, textArea) {
    textArea.innerText = message;
}
/**
 * Begins the client and the game on the canvas
 */
async function main() {
    const canvas = document.getElementById('canvas') ?? assert_1.default.fail();
    //get a text area that informs the user when the game is finished
    const outputArea = document.getElementById('outputArea') ?? assert_1.default.fail('missing output area');
    const winningMessage = "The Board has been solved!!";
    const startingDirection = "Click on any area on the board to place a star!";
    const webclient = await WebClient_1.WebClient.request(PUZZLE, canvas);
    //check to see if the board is already a solved board
    if (webclient.isBoardSolved()) {
        console.log("is solved!");
        displayMessage(winningMessage, outputArea);
    }
    else {
        displayMessage(startingDirection, outputArea);
    }
    canvas.addEventListener('click', (e) => {
        webclient.click(e.offsetX, e.offsetY);
        console.log(webclient.isBoardSolved());
        if (webclient.isBoardSolved()) {
            console.log("is solved!");
            displayMessage(winningMessage, outputArea);
        }
        else {
            displayMessage("", outputArea);
        }
    });
}
void main();

},{"./WebClient":20,"assert":1}],20:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebClient = void 0;
const Parser_1 = require("./Parser");
const assert_1 = __importDefault(require("assert"));
const PuzzleDrawer_1 = require("./PuzzleDrawer");
/**
 * ADT representing the state of the web client of the Star Battle puzzle web interface.
 */
class WebClient {
    /**
     * Abstraction Function: puzzle represents the Star Battle puzzle the user is interacting with, and
     * the canvas object to draw the puzzle
     *
     * Rep invariant: canvas must have positive width and height
     *
     * Exposure: Puzzle is a immutable object, so there is no problem even if it's aliased.
     *           canvas is mutable and can be aliased. However, the drawImage function rerenders
     *           canvas object at each step, so our implementation still works if it's aliased by
     *           the client.
     */
    /**
     * Creates a new web client object
     *
     * @param puzzle puzzle object that the client is playing
     * @param canvas canvas object that renders the puzzle drawing
     */
    constructor(puzzle, canvas) {
        this.puzzle = puzzle;
        this.canvas = canvas;
        this.checkRep();
        this.drawPuzzle();
    }
    checkRep() {
        (0, assert_1.default)(this.canvas.width > 0);
        (0, assert_1.default)(this.canvas.height > 0);
    }
    /**
     * Creates a WebClient object that
     *
     * @param filename name of the file to load the puzzle from
     * @param canvas canvas object that draws the game
     * @returns a web client object that the client can interact with
     */
    static async request(filename, canvas) {
        const url = `http://localhost:8789/puzzles?name=${filename}`;
        return fetch(url, { method: 'get', mode: 'cors' })
            .then(response => response.text())
            .then(text => {
            console.log(text);
            return new WebClient((0, Parser_1.parse)(text), canvas);
        });
    }
    /**
     * Calculates the height of each row in the canvas drawing
     *
     * @returns the height of each row
     */
    get rowHeight() {
        return this.canvas.height / this.puzzle.rows;
    }
    /**
     * Calculates the width of each column in the canvas drawing
     *
     * @returns the width of each column
     */
    get colWidth() {
        return this.canvas.width / this.puzzle.cols;
    }
    /**
     * Returns true if the board that the client is playing with is solved.
     * False otherwise
     *
     * @returns as described above.
     */
    isBoardSolved() {
        return this.puzzle.isSolved();
    }
    /**
     * Adds or removes a star from the cell that was clicked
     *
     * @param offsetX x coordinate of the point that was clicked
     * @param offsetY y coordinate of the point that was clicked
     */
    click(offsetX, offsetY) {
        const position = {
            col: Math.floor(offsetX / this.colWidth),
            row: Math.floor(offsetY / this.rowHeight)
        };
        console.log(position.col, position.row);
        this.puzzle = this.puzzle.flip(position);
        this.drawPuzzle();
    }
    /**
     * draws this.puzzle to this.canvas
     */
    drawPuzzle() {
        (0, PuzzleDrawer_1.drawPuzzle)(this.canvas, this.puzzle);
    }
}
exports.WebClient = WebClient;

},{"./Parser":16,"./PuzzleDrawer":18,"assert":1}]},{},[19])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXNzZXJ0L2Fzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9hc3NlcnQvbm9kZV9tb2R1bGVzL2luaGVyaXRzL2luaGVyaXRzX2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvYXNzZXJ0L25vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2Fzc2VydC9ub2RlX21vZHVsZXMvdXRpbC91dGlsLmpzIiwibm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbGliL19lbXB0eS5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3BhcnNlcmxpYi9pbnRlcm5hbC9jb21waWxlci5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZXJsaWIvaW50ZXJuYWwvZGlzcGxheS5qcyIsIm5vZGVfbW9kdWxlcy9wYXJzZXJsaWIvaW50ZXJuYWwvcGFyc2VyLmpzIiwibm9kZV9tb2R1bGVzL3BhcnNlcmxpYi9pbnRlcm5hbC9wYXJzZXRyZWUuanMiLCJub2RlX21vZHVsZXMvcGFyc2VybGliL2ludGVybmFsL3R5cGVzLmpzIiwibm9kZV9tb2R1bGVzL3BhcnNlcmxpYi9pbnRlcm5hbC92aXN1YWxpemVyLmpzIiwibm9kZV9tb2R1bGVzL3BhcnNlcmxpYi9wYXJzZXJsaWIuanMiLCJub2RlX21vZHVsZXMvcGF0aC1icm93c2VyaWZ5L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qcyIsInNyYy9QYXJzZXIudHMiLCJzcmMvUHV6emxlLnRzIiwic3JjL1B1enpsZURyYXdlci50cyIsInNyYy9TdGFyYkNsaWVudC50cyIsInNyYy9XZWJDbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMWZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDMWtCQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDamhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ3hMQSx5Q0FBcUQ7QUFDckQscUNBQTREO0FBQzVELG9EQUE0QjtBQUU1QixNQUFNLE9BQU8sR0FBRzs7Ozs7Ozs7Ozs7O0NBWWYsQ0FBQztBQUVGLElBQUssaUJBVUo7QUFWRCxX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QUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2pELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBWSxRQUFRO1FBQ2hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDL0MsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksYUFBYTtRQUNoQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksS0FBSyxDQUFDLE9BQWdCLEVBQUUsT0FBZ0I7UUFDM0MsTUFBTSxRQUFRLEdBQUc7WUFDYixHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUN4QyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztTQUM1QyxDQUFDO1FBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRUQ7O09BRUc7SUFDSyxVQUFVO1FBQ2QsSUFBQSx5QkFBVSxFQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pDLENBQUM7Q0FDSjtBQWhHRCw4QkFnR0MiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIndXNlIHN0cmljdCc7XG5cbnZhciBvYmplY3RBc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbi8vIGNvbXBhcmUgYW5kIGlzQnVmZmVyIHRha2VuIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvYmxvYi82ODBlOWU1ZTQ4OGYyMmFhYzI3NTk5YTU3ZGM4NDRhNjMxNTkyOGRkL2luZGV4LmpzXG4vLyBvcmlnaW5hbCBub3RpY2U6XG5cbi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmUoYSwgYikge1xuICBpZiAoYSA9PT0gYikge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgdmFyIHggPSBhLmxlbmd0aDtcbiAgdmFyIHkgPSBiLmxlbmd0aDtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gTWF0aC5taW4oeCwgeSk7IGkgPCBsZW47ICsraSkge1xuICAgIGlmIChhW2ldICE9PSBiW2ldKSB7XG4gICAgICB4ID0gYVtpXTtcbiAgICAgIHkgPSBiW2ldO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIGlmICh5IDwgeCkge1xuICAgIHJldHVybiAxO1xuICB9XG4gIHJldHVybiAwO1xufVxuZnVuY3Rpb24gaXNCdWZmZXIoYikge1xuICBpZiAoZ2xvYmFsLkJ1ZmZlciAmJiB0eXBlb2YgZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBnbG9iYWwuQnVmZmVyLmlzQnVmZmVyKGIpO1xuICB9XG4gIHJldHVybiAhIShiICE9IG51bGwgJiYgYi5faXNCdWZmZXIpO1xufVxuXG4vLyBiYXNlZCBvbiBub2RlIGFzc2VydCwgb3JpZ2luYWwgbm90aWNlOlxuLy8gTkI6IFRoZSBVUkwgdG8gdGhlIENvbW1vbkpTIHNwZWMgaXMga2VwdCBqdXN0IGZvciB0cmFkaXRpb24uXG4vLyAgICAgbm9kZS1hc3NlcnQgaGFzIGV2b2x2ZWQgYSBsb3Qgc2luY2UgdGhlbiwgYm90aCBpbiBBUEkgYW5kIGJlaGF2aW9yLlxuXG4vLyBodHRwOi8vd2lraS5jb21tb25qcy5vcmcvd2lraS9Vbml0X1Rlc3RpbmcvMS4wXG4vL1xuLy8gVEhJUyBJUyBOT1QgVEVTVEVEIE5PUiBMSUtFTFkgVE8gV09SSyBPVVRTSURFIFY4IVxuLy9cbi8vIE9yaWdpbmFsbHkgZnJvbSBuYXJ3aGFsLmpzIChodHRwOi8vbmFyd2hhbGpzLm9yZylcbi8vIENvcHlyaWdodCAoYykgMjAwOSBUaG9tYXMgUm9iaW5zb24gPDI4MG5vcnRoLmNvbT5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSAnU29mdHdhcmUnKSwgdG9cbi8vIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlXG4vLyByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Jcbi8vIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG4vLyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG4vLyBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgJ0FTIElTJywgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOXG4vLyBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OXG4vLyBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsLycpO1xudmFyIGhhc093biA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcFNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIGZ1bmN0aW9uc0hhdmVOYW1lcyA9IChmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmb28oKSB7fS5uYW1lID09PSAnZm9vJztcbn0oKSk7XG5mdW5jdGlvbiBwVG9TdHJpbmcgKG9iaikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaik7XG59XG5mdW5jdGlvbiBpc1ZpZXcoYXJyYnVmKSB7XG4gIGlmIChpc0J1ZmZlcihhcnJidWYpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh0eXBlb2YgZ2xvYmFsLkFycmF5QnVmZmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICh0eXBlb2YgQXJyYXlCdWZmZXIuaXNWaWV3ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIEFycmF5QnVmZmVyLmlzVmlldyhhcnJidWYpO1xuICB9XG4gIGlmICghYXJyYnVmKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChhcnJidWYgaW5zdGFuY2VvZiBEYXRhVmlldykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmIChhcnJidWYuYnVmZmVyICYmIGFycmJ1Zi5idWZmZXIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cbi8vIDEuIFRoZSBhc3NlcnQgbW9kdWxlIHByb3ZpZGVzIGZ1bmN0aW9ucyB0aGF0IHRocm93XG4vLyBBc3NlcnRpb25FcnJvcidzIHdoZW4gcGFydGljdWxhciBjb25kaXRpb25zIGFyZSBub3QgbWV0LiBUaGVcbi8vIGFzc2VydCBtb2R1bGUgbXVzdCBjb25mb3JtIHRvIHRoZSBmb2xsb3dpbmcgaW50ZXJmYWNlLlxuXG52YXIgYXNzZXJ0ID0gbW9kdWxlLmV4cG9ydHMgPSBvaztcblxuLy8gMi4gVGhlIEFzc2VydGlvbkVycm9yIGlzIGRlZmluZWQgaW4gYXNzZXJ0LlxuLy8gbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7IG1lc3NhZ2U6IG1lc3NhZ2UsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0dWFsOiBhY3R1YWwsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0ZWQ6IGV4cGVjdGVkIH0pXG5cbnZhciByZWdleCA9IC9cXHMqZnVuY3Rpb25cXHMrKFteXFwoXFxzXSopXFxzKi87XG4vLyBiYXNlZCBvbiBodHRwczovL2dpdGh1Yi5jb20vbGpoYXJiL2Z1bmN0aW9uLnByb3RvdHlwZS5uYW1lL2Jsb2IvYWRlZWVlYzhiZmNjNjA2OGIxODdkN2Q5ZmIzZDViYjFkM2EzMDg5OS9pbXBsZW1lbnRhdGlvbi5qc1xuZnVuY3Rpb24gZ2V0TmFtZShmdW5jKSB7XG4gIGlmICghdXRpbC5pc0Z1bmN0aW9uKGZ1bmMpKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChmdW5jdGlvbnNIYXZlTmFtZXMpIHtcbiAgICByZXR1cm4gZnVuYy5uYW1lO1xuICB9XG4gIHZhciBzdHIgPSBmdW5jLnRvU3RyaW5nKCk7XG4gIHZhciBtYXRjaCA9IHN0ci5tYXRjaChyZWdleCk7XG4gIHJldHVybiBtYXRjaCAmJiBtYXRjaFsxXTtcbn1cbmFzc2VydC5Bc3NlcnRpb25FcnJvciA9IGZ1bmN0aW9uIEFzc2VydGlvbkVycm9yKG9wdGlvbnMpIHtcbiAgdGhpcy5uYW1lID0gJ0Fzc2VydGlvbkVycm9yJztcbiAgdGhpcy5hY3R1YWwgPSBvcHRpb25zLmFjdHVhbDtcbiAgdGhpcy5leHBlY3RlZCA9IG9wdGlvbnMuZXhwZWN0ZWQ7XG4gIHRoaXMub3BlcmF0b3IgPSBvcHRpb25zLm9wZXJhdG9yO1xuICBpZiAob3B0aW9ucy5tZXNzYWdlKSB7XG4gICAgdGhpcy5tZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlO1xuICAgIHRoaXMuZ2VuZXJhdGVkTWVzc2FnZSA9IGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubWVzc2FnZSA9IGdldE1lc3NhZ2UodGhpcyk7XG4gICAgdGhpcy5nZW5lcmF0ZWRNZXNzYWdlID0gdHJ1ZTtcbiAgfVxuICB2YXIgc3RhY2tTdGFydEZ1bmN0aW9uID0gb3B0aW9ucy5zdGFja1N0YXJ0RnVuY3Rpb24gfHwgZmFpbDtcbiAgaWYgKEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKSB7XG4gICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgc3RhY2tTdGFydEZ1bmN0aW9uKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBub24gdjggYnJvd3NlcnMgc28gd2UgY2FuIGhhdmUgYSBzdGFja3RyYWNlXG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcigpO1xuICAgIGlmIChlcnIuc3RhY2spIHtcbiAgICAgIHZhciBvdXQgPSBlcnIuc3RhY2s7XG5cbiAgICAgIC8vIHRyeSB0byBzdHJpcCB1c2VsZXNzIGZyYW1lc1xuICAgICAgdmFyIGZuX25hbWUgPSBnZXROYW1lKHN0YWNrU3RhcnRGdW5jdGlvbik7XG4gICAgICB2YXIgaWR4ID0gb3V0LmluZGV4T2YoJ1xcbicgKyBmbl9uYW1lKTtcbiAgICAgIGlmIChpZHggPj0gMCkge1xuICAgICAgICAvLyBvbmNlIHdlIGhhdmUgbG9jYXRlZCB0aGUgZnVuY3Rpb24gZnJhbWVcbiAgICAgICAgLy8gd2UgbmVlZCB0byBzdHJpcCBvdXQgZXZlcnl0aGluZyBiZWZvcmUgaXQgKGFuZCBpdHMgbGluZSlcbiAgICAgICAgdmFyIG5leHRfbGluZSA9IG91dC5pbmRleE9mKCdcXG4nLCBpZHggKyAxKTtcbiAgICAgICAgb3V0ID0gb3V0LnN1YnN0cmluZyhuZXh0X2xpbmUgKyAxKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zdGFjayA9IG91dDtcbiAgICB9XG4gIH1cbn07XG5cbi8vIGFzc2VydC5Bc3NlcnRpb25FcnJvciBpbnN0YW5jZW9mIEVycm9yXG51dGlsLmluaGVyaXRzKGFzc2VydC5Bc3NlcnRpb25FcnJvciwgRXJyb3IpO1xuXG5mdW5jdGlvbiB0cnVuY2F0ZShzLCBuKSB7XG4gIGlmICh0eXBlb2YgcyA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gcy5sZW5ndGggPCBuID8gcyA6IHMuc2xpY2UoMCwgbik7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHM7XG4gIH1cbn1cbmZ1bmN0aW9uIGluc3BlY3Qoc29tZXRoaW5nKSB7XG4gIGlmIChmdW5jdGlvbnNIYXZlTmFtZXMgfHwgIXV0aWwuaXNGdW5jdGlvbihzb21ldGhpbmcpKSB7XG4gICAgcmV0dXJuIHV0aWwuaW5zcGVjdChzb21ldGhpbmcpO1xuICB9XG4gIHZhciByYXduYW1lID0gZ2V0TmFtZShzb21ldGhpbmcpO1xuICB2YXIgbmFtZSA9IHJhd25hbWUgPyAnOiAnICsgcmF3bmFtZSA6ICcnO1xuICByZXR1cm4gJ1tGdW5jdGlvbicgKyAgbmFtZSArICddJztcbn1cbmZ1bmN0aW9uIGdldE1lc3NhZ2Uoc2VsZikge1xuICByZXR1cm4gdHJ1bmNhdGUoaW5zcGVjdChzZWxmLmFjdHVhbCksIDEyOCkgKyAnICcgK1xuICAgICAgICAgc2VsZi5vcGVyYXRvciArICcgJyArXG4gICAgICAgICB0cnVuY2F0ZShpbnNwZWN0KHNlbGYuZXhwZWN0ZWQpLCAxMjgpO1xufVxuXG4vLyBBdCBwcmVzZW50IG9ubHkgdGhlIHRocmVlIGtleXMgbWVudGlvbmVkIGFib3ZlIGFyZSB1c2VkIGFuZFxuLy8gdW5kZXJzdG9vZCBieSB0aGUgc3BlYy4gSW1wbGVtZW50YXRpb25zIG9yIHN1YiBtb2R1bGVzIGNhbiBwYXNzXG4vLyBvdGhlciBrZXlzIHRvIHRoZSBBc3NlcnRpb25FcnJvcidzIGNvbnN0cnVjdG9yIC0gdGhleSB3aWxsIGJlXG4vLyBpZ25vcmVkLlxuXG4vLyAzLiBBbGwgb2YgdGhlIGZvbGxvd2luZyBmdW5jdGlvbnMgbXVzdCB0aHJvdyBhbiBBc3NlcnRpb25FcnJvclxuLy8gd2hlbiBhIGNvcnJlc3BvbmRpbmcgY29uZGl0aW9uIGlzIG5vdCBtZXQsIHdpdGggYSBtZXNzYWdlIHRoYXRcbi8vIG1heSBiZSB1bmRlZmluZWQgaWYgbm90IHByb3ZpZGVkLiAgQWxsIGFzc2VydGlvbiBtZXRob2RzIHByb3ZpZGVcbi8vIGJvdGggdGhlIGFjdHVhbCBhbmQgZXhwZWN0ZWQgdmFsdWVzIHRvIHRoZSBhc3NlcnRpb24gZXJyb3IgZm9yXG4vLyBkaXNwbGF5IHB1cnBvc2VzLlxuXG5mdW5jdGlvbiBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsIG9wZXJhdG9yLCBzdGFja1N0YXJ0RnVuY3Rpb24pIHtcbiAgdGhyb3cgbmV3IGFzc2VydC5Bc3NlcnRpb25FcnJvcih7XG4gICAgbWVzc2FnZTogbWVzc2FnZSxcbiAgICBhY3R1YWw6IGFjdHVhbCxcbiAgICBleHBlY3RlZDogZXhwZWN0ZWQsXG4gICAgb3BlcmF0b3I6IG9wZXJhdG9yLFxuICAgIHN0YWNrU3RhcnRGdW5jdGlvbjogc3RhY2tTdGFydEZ1bmN0aW9uXG4gIH0pO1xufVxuXG4vLyBFWFRFTlNJT04hIGFsbG93cyBmb3Igd2VsbCBiZWhhdmVkIGVycm9ycyBkZWZpbmVkIGVsc2V3aGVyZS5cbmFzc2VydC5mYWlsID0gZmFpbDtcblxuLy8gNC4gUHVyZSBhc3NlcnRpb24gdGVzdHMgd2hldGhlciBhIHZhbHVlIGlzIHRydXRoeSwgYXMgZGV0ZXJtaW5lZFxuLy8gYnkgISFndWFyZC5cbi8vIGFzc2VydC5vayhndWFyZCwgbWVzc2FnZV9vcHQpO1xuLy8gVGhpcyBzdGF0ZW1lbnQgaXMgZXF1aXZhbGVudCB0byBhc3NlcnQuZXF1YWwodHJ1ZSwgISFndWFyZCxcbi8vIG1lc3NhZ2Vfb3B0KTsuIFRvIHRlc3Qgc3RyaWN0bHkgZm9yIHRoZSB2YWx1ZSB0cnVlLCB1c2Vcbi8vIGFzc2VydC5zdHJpY3RFcXVhbCh0cnVlLCBndWFyZCwgbWVzc2FnZV9vcHQpOy5cblxuZnVuY3Rpb24gb2sodmFsdWUsIG1lc3NhZ2UpIHtcbiAgaWYgKCF2YWx1ZSkgZmFpbCh2YWx1ZSwgdHJ1ZSwgbWVzc2FnZSwgJz09JywgYXNzZXJ0Lm9rKTtcbn1cbmFzc2VydC5vayA9IG9rO1xuXG4vLyA1LiBUaGUgZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIHNoYWxsb3csIGNvZXJjaXZlIGVxdWFsaXR5IHdpdGhcbi8vID09LlxuLy8gYXNzZXJ0LmVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LmVxdWFsID0gZnVuY3Rpb24gZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9IGV4cGVjdGVkKSBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5lcXVhbCk7XG59O1xuXG4vLyA2LiBUaGUgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igd2hldGhlciB0d28gb2JqZWN0cyBhcmUgbm90IGVxdWFsXG4vLyB3aXRoICE9IGFzc2VydC5ub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3RFcXVhbCA9IGZ1bmN0aW9uIG5vdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9JywgYXNzZXJ0Lm5vdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gNy4gVGhlIGVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBhIGRlZXAgZXF1YWxpdHkgcmVsYXRpb24uXG4vLyBhc3NlcnQuZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LmRlZXBFcXVhbCA9IGZ1bmN0aW9uIGRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmICghX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBmYWxzZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdkZWVwRXF1YWwnLCBhc3NlcnQuZGVlcEVxdWFsKTtcbiAgfVxufTtcblxuYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIGRlZXBTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmICghX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCB0cnVlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ2RlZXBTdHJpY3RFcXVhbCcsIGFzc2VydC5kZWVwU3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIHN0cmljdCwgbWVtb3MpIHtcbiAgLy8gNy4xLiBBbGwgaWRlbnRpY2FsIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgYXMgZGV0ZXJtaW5lZCBieSA9PT0uXG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gZWxzZSBpZiAoaXNCdWZmZXIoYWN0dWFsKSAmJiBpc0J1ZmZlcihleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gY29tcGFyZShhY3R1YWwsIGV4cGVjdGVkKSA9PT0gMDtcblxuICAvLyA3LjIuIElmIHRoZSBleHBlY3RlZCB2YWx1ZSBpcyBhIERhdGUgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIERhdGUgb2JqZWN0IHRoYXQgcmVmZXJzIHRvIHRoZSBzYW1lIHRpbWUuXG4gIH0gZWxzZSBpZiAodXRpbC5pc0RhdGUoYWN0dWFsKSAmJiB1dGlsLmlzRGF0ZShleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLmdldFRpbWUoKSA9PT0gZXhwZWN0ZWQuZ2V0VGltZSgpO1xuXG4gIC8vIDcuMyBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBSZWdFeHAgb2JqZWN0LCB0aGUgYWN0dWFsIHZhbHVlIGlzXG4gIC8vIGVxdWl2YWxlbnQgaWYgaXQgaXMgYWxzbyBhIFJlZ0V4cCBvYmplY3Qgd2l0aCB0aGUgc2FtZSBzb3VyY2UgYW5kXG4gIC8vIHByb3BlcnRpZXMgKGBnbG9iYWxgLCBgbXVsdGlsaW5lYCwgYGxhc3RJbmRleGAsIGBpZ25vcmVDYXNlYCkuXG4gIH0gZWxzZSBpZiAodXRpbC5pc1JlZ0V4cChhY3R1YWwpICYmIHV0aWwuaXNSZWdFeHAoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5zb3VyY2UgPT09IGV4cGVjdGVkLnNvdXJjZSAmJlxuICAgICAgICAgICBhY3R1YWwuZ2xvYmFsID09PSBleHBlY3RlZC5nbG9iYWwgJiZcbiAgICAgICAgICAgYWN0dWFsLm11bHRpbGluZSA9PT0gZXhwZWN0ZWQubXVsdGlsaW5lICYmXG4gICAgICAgICAgIGFjdHVhbC5sYXN0SW5kZXggPT09IGV4cGVjdGVkLmxhc3RJbmRleCAmJlxuICAgICAgICAgICBhY3R1YWwuaWdub3JlQ2FzZSA9PT0gZXhwZWN0ZWQuaWdub3JlQ2FzZTtcblxuICAvLyA3LjQuIE90aGVyIHBhaXJzIHRoYXQgZG8gbm90IGJvdGggcGFzcyB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCcsXG4gIC8vIGVxdWl2YWxlbmNlIGlzIGRldGVybWluZWQgYnkgPT0uXG4gIH0gZWxzZSBpZiAoKGFjdHVhbCA9PT0gbnVsbCB8fCB0eXBlb2YgYWN0dWFsICE9PSAnb2JqZWN0JykgJiZcbiAgICAgICAgICAgICAoZXhwZWN0ZWQgPT09IG51bGwgfHwgdHlwZW9mIGV4cGVjdGVkICE9PSAnb2JqZWN0JykpIHtcbiAgICByZXR1cm4gc3RyaWN0ID8gYWN0dWFsID09PSBleHBlY3RlZCA6IGFjdHVhbCA9PSBleHBlY3RlZDtcblxuICAvLyBJZiBib3RoIHZhbHVlcyBhcmUgaW5zdGFuY2VzIG9mIHR5cGVkIGFycmF5cywgd3JhcCB0aGVpciB1bmRlcmx5aW5nXG4gIC8vIEFycmF5QnVmZmVycyBpbiBhIEJ1ZmZlciBlYWNoIHRvIGluY3JlYXNlIHBlcmZvcm1hbmNlXG4gIC8vIFRoaXMgb3B0aW1pemF0aW9uIHJlcXVpcmVzIHRoZSBhcnJheXMgdG8gaGF2ZSB0aGUgc2FtZSB0eXBlIGFzIGNoZWNrZWQgYnlcbiAgLy8gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyAoYWthIHBUb1N0cmluZykuIE5ldmVyIHBlcmZvcm0gYmluYXJ5XG4gIC8vIGNvbXBhcmlzb25zIGZvciBGbG9hdCpBcnJheXMsIHRob3VnaCwgc2luY2UgZS5nLiArMCA9PT0gLTAgYnV0IHRoZWlyXG4gIC8vIGJpdCBwYXR0ZXJucyBhcmUgbm90IGlkZW50aWNhbC5cbiAgfSBlbHNlIGlmIChpc1ZpZXcoYWN0dWFsKSAmJiBpc1ZpZXcoZXhwZWN0ZWQpICYmXG4gICAgICAgICAgICAgcFRvU3RyaW5nKGFjdHVhbCkgPT09IHBUb1N0cmluZyhleHBlY3RlZCkgJiZcbiAgICAgICAgICAgICAhKGFjdHVhbCBpbnN0YW5jZW9mIEZsb2F0MzJBcnJheSB8fFxuICAgICAgICAgICAgICAgYWN0dWFsIGluc3RhbmNlb2YgRmxvYXQ2NEFycmF5KSkge1xuICAgIHJldHVybiBjb21wYXJlKG5ldyBVaW50OEFycmF5KGFjdHVhbC5idWZmZXIpLFxuICAgICAgICAgICAgICAgICAgIG5ldyBVaW50OEFycmF5KGV4cGVjdGVkLmJ1ZmZlcikpID09PSAwO1xuXG4gIC8vIDcuNSBGb3IgYWxsIG90aGVyIE9iamVjdCBwYWlycywgaW5jbHVkaW5nIEFycmF5IG9iamVjdHMsIGVxdWl2YWxlbmNlIGlzXG4gIC8vIGRldGVybWluZWQgYnkgaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChhcyB2ZXJpZmllZFxuICAvLyB3aXRoIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCksIHRoZSBzYW1lIHNldCBvZiBrZXlzXG4gIC8vIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLCBlcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnlcbiAgLy8gY29ycmVzcG9uZGluZyBrZXksIGFuZCBhbiBpZGVudGljYWwgJ3Byb3RvdHlwZScgcHJvcGVydHkuIE5vdGU6IHRoaXNcbiAgLy8gYWNjb3VudHMgZm9yIGJvdGggbmFtZWQgYW5kIGluZGV4ZWQgcHJvcGVydGllcyBvbiBBcnJheXMuXG4gIH0gZWxzZSBpZiAoaXNCdWZmZXIoYWN0dWFsKSAhPT0gaXNCdWZmZXIoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIG1lbW9zID0gbWVtb3MgfHwge2FjdHVhbDogW10sIGV4cGVjdGVkOiBbXX07XG5cbiAgICB2YXIgYWN0dWFsSW5kZXggPSBtZW1vcy5hY3R1YWwuaW5kZXhPZihhY3R1YWwpO1xuICAgIGlmIChhY3R1YWxJbmRleCAhPT0gLTEpIHtcbiAgICAgIGlmIChhY3R1YWxJbmRleCA9PT0gbWVtb3MuZXhwZWN0ZWQuaW5kZXhPZihleHBlY3RlZCkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbWVtb3MuYWN0dWFsLnB1c2goYWN0dWFsKTtcbiAgICBtZW1vcy5leHBlY3RlZC5wdXNoKGV4cGVjdGVkKTtcblxuICAgIHJldHVybiBvYmpFcXVpdihhY3R1YWwsIGV4cGVjdGVkLCBzdHJpY3QsIG1lbW9zKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyhvYmplY3QpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmplY3QpID09ICdbb2JqZWN0IEFyZ3VtZW50c10nO1xufVxuXG5mdW5jdGlvbiBvYmpFcXVpdihhLCBiLCBzdHJpY3QsIGFjdHVhbFZpc2l0ZWRPYmplY3RzKSB7XG4gIGlmIChhID09PSBudWxsIHx8IGEgPT09IHVuZGVmaW5lZCB8fCBiID09PSBudWxsIHx8IGIgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vIGlmIG9uZSBpcyBhIHByaW1pdGl2ZSwgdGhlIG90aGVyIG11c3QgYmUgc2FtZVxuICBpZiAodXRpbC5pc1ByaW1pdGl2ZShhKSB8fCB1dGlsLmlzUHJpbWl0aXZlKGIpKVxuICAgIHJldHVybiBhID09PSBiO1xuICBpZiAoc3RyaWN0ICYmIE9iamVjdC5nZXRQcm90b3R5cGVPZihhKSAhPT0gT2JqZWN0LmdldFByb3RvdHlwZU9mKGIpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgdmFyIGFJc0FyZ3MgPSBpc0FyZ3VtZW50cyhhKTtcbiAgdmFyIGJJc0FyZ3MgPSBpc0FyZ3VtZW50cyhiKTtcbiAgaWYgKChhSXNBcmdzICYmICFiSXNBcmdzKSB8fCAoIWFJc0FyZ3MgJiYgYklzQXJncykpXG4gICAgcmV0dXJuIGZhbHNlO1xuICBpZiAoYUlzQXJncykge1xuICAgIGEgPSBwU2xpY2UuY2FsbChhKTtcbiAgICBiID0gcFNsaWNlLmNhbGwoYik7XG4gICAgcmV0dXJuIF9kZWVwRXF1YWwoYSwgYiwgc3RyaWN0KTtcbiAgfVxuICB2YXIga2EgPSBvYmplY3RLZXlzKGEpO1xuICB2YXIga2IgPSBvYmplY3RLZXlzKGIpO1xuICB2YXIga2V5LCBpO1xuICAvLyBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGtleXMgaW5jb3Jwb3JhdGVzXG4gIC8vIGhhc093blByb3BlcnR5KVxuICBpZiAoa2EubGVuZ3RoICE9PSBrYi5sZW5ndGgpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvL3RoZSBzYW1lIHNldCBvZiBrZXlzIChhbHRob3VnaCBub3QgbmVjZXNzYXJpbHkgdGhlIHNhbWUgb3JkZXIpLFxuICBrYS5zb3J0KCk7XG4gIGtiLnNvcnQoKTtcbiAgLy9+fn5jaGVhcCBrZXkgdGVzdFxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGlmIChrYVtpXSAhPT0ga2JbaV0pXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgLy9lcXVpdmFsZW50IHZhbHVlcyBmb3IgZXZlcnkgY29ycmVzcG9uZGluZyBrZXksIGFuZFxuICAvL35+fnBvc3NpYmx5IGV4cGVuc2l2ZSBkZWVwIHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBrZXkgPSBrYVtpXTtcbiAgICBpZiAoIV9kZWVwRXF1YWwoYVtrZXldLCBiW2tleV0sIHN0cmljdCwgYWN0dWFsVmlzaXRlZE9iamVjdHMpKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyA4LiBUaGUgbm9uLWVxdWl2YWxlbmNlIGFzc2VydGlvbiB0ZXN0cyBmb3IgYW55IGRlZXAgaW5lcXVhbGl0eS5cbi8vIGFzc2VydC5ub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RGVlcEVxdWFsID0gZnVuY3Rpb24gbm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgZmFsc2UpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnbm90RGVlcEVxdWFsJywgYXNzZXJ0Lm5vdERlZXBFcXVhbCk7XG4gIH1cbn07XG5cbmFzc2VydC5ub3REZWVwU3RyaWN0RXF1YWwgPSBub3REZWVwU3RyaWN0RXF1YWw7XG5mdW5jdGlvbiBub3REZWVwU3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCB0cnVlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ25vdERlZXBTdHJpY3RFcXVhbCcsIG5vdERlZXBTdHJpY3RFcXVhbCk7XG4gIH1cbn1cblxuXG4vLyA5LiBUaGUgc3RyaWN0IGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzdHJpY3QgZXF1YWxpdHksIGFzIGRldGVybWluZWQgYnkgPT09LlxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnN0cmljdEVxdWFsID0gZnVuY3Rpb24gc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsICE9PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09PScsIGFzc2VydC5zdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDEwLiBUaGUgc3RyaWN0IG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHN0cmljdCBpbmVxdWFsaXR5LCBhc1xuLy8gZGV0ZXJtaW5lZCBieSAhPT0uICBhc3NlcnQubm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90U3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT09JywgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkge1xuICBpZiAoIWFjdHVhbCB8fCAhZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGV4cGVjdGVkKSA9PSAnW29iamVjdCBSZWdFeHBdJykge1xuICAgIHJldHVybiBleHBlY3RlZC50ZXN0KGFjdHVhbCk7XG4gIH1cblxuICB0cnkge1xuICAgIGlmIChhY3R1YWwgaW5zdGFuY2VvZiBleHBlY3RlZCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gSWdub3JlLiAgVGhlIGluc3RhbmNlb2YgY2hlY2sgZG9lc24ndCB3b3JrIGZvciBhcnJvdyBmdW5jdGlvbnMuXG4gIH1cblxuICBpZiAoRXJyb3IuaXNQcm90b3R5cGVPZihleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gZXhwZWN0ZWQuY2FsbCh7fSwgYWN0dWFsKSA9PT0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gX3RyeUJsb2NrKGJsb2NrKSB7XG4gIHZhciBlcnJvcjtcbiAgdHJ5IHtcbiAgICBibG9jaygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgZXJyb3IgPSBlO1xuICB9XG4gIHJldHVybiBlcnJvcjtcbn1cblxuZnVuY3Rpb24gX3Rocm93cyhzaG91bGRUaHJvdywgYmxvY2ssIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIHZhciBhY3R1YWw7XG5cbiAgaWYgKHR5cGVvZiBibG9jayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYmxvY2tcIiBhcmd1bWVudCBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgZXhwZWN0ZWQgPT09ICdzdHJpbmcnKSB7XG4gICAgbWVzc2FnZSA9IGV4cGVjdGVkO1xuICAgIGV4cGVjdGVkID0gbnVsbDtcbiAgfVxuXG4gIGFjdHVhbCA9IF90cnlCbG9jayhibG9jayk7XG5cbiAgbWVzc2FnZSA9IChleHBlY3RlZCAmJiBleHBlY3RlZC5uYW1lID8gJyAoJyArIGV4cGVjdGVkLm5hbWUgKyAnKS4nIDogJy4nKSArXG4gICAgICAgICAgICAobWVzc2FnZSA/ICcgJyArIG1lc3NhZ2UgOiAnLicpO1xuXG4gIGlmIChzaG91bGRUaHJvdyAmJiAhYWN0dWFsKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnTWlzc2luZyBleHBlY3RlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICB2YXIgdXNlclByb3ZpZGVkTWVzc2FnZSA9IHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJztcbiAgdmFyIGlzVW53YW50ZWRFeGNlcHRpb24gPSAhc2hvdWxkVGhyb3cgJiYgdXRpbC5pc0Vycm9yKGFjdHVhbCk7XG4gIHZhciBpc1VuZXhwZWN0ZWRFeGNlcHRpb24gPSAhc2hvdWxkVGhyb3cgJiYgYWN0dWFsICYmICFleHBlY3RlZDtcblxuICBpZiAoKGlzVW53YW50ZWRFeGNlcHRpb24gJiZcbiAgICAgIHVzZXJQcm92aWRlZE1lc3NhZ2UgJiZcbiAgICAgIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB8fFxuICAgICAgaXNVbmV4cGVjdGVkRXhjZXB0aW9uKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCAnR290IHVud2FudGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIGlmICgoc2hvdWxkVGhyb3cgJiYgYWN0dWFsICYmIGV4cGVjdGVkICYmXG4gICAgICAhZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHx8ICghc2hvdWxkVGhyb3cgJiYgYWN0dWFsKSkge1xuICAgIHRocm93IGFjdHVhbDtcbiAgfVxufVxuXG4vLyAxMS4gRXhwZWN0ZWQgdG8gdGhyb3cgYW4gZXJyb3I6XG4vLyBhc3NlcnQudGhyb3dzKGJsb2NrLCBFcnJvcl9vcHQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0LnRocm93cyA9IGZ1bmN0aW9uKGJsb2NrLCAvKm9wdGlvbmFsKi9lcnJvciwgLypvcHRpb25hbCovbWVzc2FnZSkge1xuICBfdGhyb3dzKHRydWUsIGJsb2NrLCBlcnJvciwgbWVzc2FnZSk7XG59O1xuXG4vLyBFWFRFTlNJT04hIFRoaXMgaXMgYW5ub3lpbmcgdG8gd3JpdGUgb3V0c2lkZSB0aGlzIG1vZHVsZS5cbmFzc2VydC5kb2VzTm90VGhyb3cgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovZXJyb3IsIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cyhmYWxzZSwgYmxvY2ssIGVycm9yLCBtZXNzYWdlKTtcbn07XG5cbmFzc2VydC5pZkVycm9yID0gZnVuY3Rpb24oZXJyKSB7IGlmIChlcnIpIHRocm93IGVycjsgfTtcblxuLy8gRXhwb3NlIGEgc3RyaWN0IG9ubHkgdmFyaWFudCBvZiBhc3NlcnRcbmZ1bmN0aW9uIHN0cmljdCh2YWx1ZSwgbWVzc2FnZSkge1xuICBpZiAoIXZhbHVlKSBmYWlsKHZhbHVlLCB0cnVlLCBtZXNzYWdlLCAnPT0nLCBzdHJpY3QpO1xufVxuYXNzZXJ0LnN0cmljdCA9IG9iamVjdEFzc2lnbihzdHJpY3QsIGFzc2VydCwge1xuICBlcXVhbDogYXNzZXJ0LnN0cmljdEVxdWFsLFxuICBkZWVwRXF1YWw6IGFzc2VydC5kZWVwU3RyaWN0RXF1YWwsXG4gIG5vdEVxdWFsOiBhc3NlcnQubm90U3RyaWN0RXF1YWwsXG4gIG5vdERlZXBFcXVhbDogYXNzZXJ0Lm5vdERlZXBTdHJpY3RFcXVhbFxufSk7XG5hc3NlcnQuc3RyaWN0LnN0cmljdCA9IGFzc2VydC5zdHJpY3Q7XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhc093bi5jYWxsKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIGtleXM7XG59O1xuIiwiaWYgKHR5cGVvZiBPYmplY3QuY3JlYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gIC8vIGltcGxlbWVudGF0aW9uIGZyb20gc3RhbmRhcmQgbm9kZS5qcyAndXRpbCcgbW9kdWxlXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICBjdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDdG9yLnByb3RvdHlwZSwge1xuICAgICAgY29uc3RydWN0b3I6IHtcbiAgICAgICAgdmFsdWU6IGN0b3IsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59IGVsc2Uge1xuICAvLyBvbGQgc2Nob29sIHNoaW0gZm9yIG9sZCBicm93c2Vyc1xuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgdmFyIFRlbXBDdG9yID0gZnVuY3Rpb24gKCkge31cbiAgICBUZW1wQ3Rvci5wcm90b3R5cGUgPSBzdXBlckN0b3IucHJvdG90eXBlXG4gICAgY3Rvci5wcm90b3R5cGUgPSBuZXcgVGVtcEN0b3IoKVxuICAgIGN0b3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gY3RvclxuICB9XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGlzQnVmZmVyKGFyZykge1xuICByZXR1cm4gYXJnICYmIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnXG4gICAgJiYgdHlwZW9mIGFyZy5jb3B5ID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5maWxsID09PSAnZnVuY3Rpb24nXG4gICAgJiYgdHlwZW9mIGFyZy5yZWFkVUludDggPT09ICdmdW5jdGlvbic7XG59IiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciBmb3JtYXRSZWdFeHAgPSAvJVtzZGolXS9nO1xuZXhwb3J0cy5mb3JtYXQgPSBmdW5jdGlvbihmKSB7XG4gIGlmICghaXNTdHJpbmcoZikpIHtcbiAgICB2YXIgb2JqZWN0cyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBvYmplY3RzLnB1c2goaW5zcGVjdChhcmd1bWVudHNbaV0pKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdHMuam9pbignICcpO1xuICB9XG5cbiAgdmFyIGkgPSAxO1xuICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgdmFyIGxlbiA9IGFyZ3MubGVuZ3RoO1xuICB2YXIgc3RyID0gU3RyaW5nKGYpLnJlcGxhY2UoZm9ybWF0UmVnRXhwLCBmdW5jdGlvbih4KSB7XG4gICAgaWYgKHggPT09ICclJScpIHJldHVybiAnJSc7XG4gICAgaWYgKGkgPj0gbGVuKSByZXR1cm4geDtcbiAgICBzd2l0Y2ggKHgpIHtcbiAgICAgIGNhc2UgJyVzJzogcmV0dXJuIFN0cmluZyhhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWQnOiByZXR1cm4gTnVtYmVyKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclaic6XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGFyZ3NbaSsrXSk7XG4gICAgICAgIH0gY2F0Y2ggKF8pIHtcbiAgICAgICAgICByZXR1cm4gJ1tDaXJjdWxhcl0nO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4geDtcbiAgICB9XG4gIH0pO1xuICBmb3IgKHZhciB4ID0gYXJnc1tpXTsgaSA8IGxlbjsgeCA9IGFyZ3NbKytpXSkge1xuICAgIGlmIChpc051bGwoeCkgfHwgIWlzT2JqZWN0KHgpKSB7XG4gICAgICBzdHIgKz0gJyAnICsgeDtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyICs9ICcgJyArIGluc3BlY3QoeCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG5cbi8vIE1hcmsgdGhhdCBhIG1ldGhvZCBzaG91bGQgbm90IGJlIHVzZWQuXG4vLyBSZXR1cm5zIGEgbW9kaWZpZWQgZnVuY3Rpb24gd2hpY2ggd2FybnMgb25jZSBieSBkZWZhdWx0LlxuLy8gSWYgLS1uby1kZXByZWNhdGlvbiBpcyBzZXQsIHRoZW4gaXQgaXMgYSBuby1vcC5cbmV4cG9ydHMuZGVwcmVjYXRlID0gZnVuY3Rpb24oZm4sIG1zZykge1xuICAvLyBBbGxvdyBmb3IgZGVwcmVjYXRpbmcgdGhpbmdzIGluIHRoZSBwcm9jZXNzIG9mIHN0YXJ0aW5nIHVwLlxuICBpZiAoaXNVbmRlZmluZWQoZ2xvYmFsLnByb2Nlc3MpKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGV4cG9ydHMuZGVwcmVjYXRlKGZuLCBtc2cpLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChwcm9jZXNzLm5vRGVwcmVjYXRpb24gPT09IHRydWUpIHtcbiAgICByZXR1cm4gZm47XG4gIH1cblxuICB2YXIgd2FybmVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIGRlcHJlY2F0ZWQoKSB7XG4gICAgaWYgKCF3YXJuZWQpIHtcbiAgICAgIGlmIChwcm9jZXNzLnRocm93RGVwcmVjYXRpb24pIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKG1zZyk7XG4gICAgICB9IGVsc2UgaWYgKHByb2Nlc3MudHJhY2VEZXByZWNhdGlvbikge1xuICAgICAgICBjb25zb2xlLnRyYWNlKG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgICB9XG4gICAgICB3YXJuZWQgPSB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxuXG4gIHJldHVybiBkZXByZWNhdGVkO1xufTtcblxuXG52YXIgZGVidWdzID0ge307XG52YXIgZGVidWdFbnZpcm9uO1xuZXhwb3J0cy5kZWJ1Z2xvZyA9IGZ1bmN0aW9uKHNldCkge1xuICBpZiAoaXNVbmRlZmluZWQoZGVidWdFbnZpcm9uKSlcbiAgICBkZWJ1Z0Vudmlyb24gPSBwcm9jZXNzLmVudi5OT0RFX0RFQlVHIHx8ICcnO1xuICBzZXQgPSBzZXQudG9VcHBlckNhc2UoKTtcbiAgaWYgKCFkZWJ1Z3Nbc2V0XSkge1xuICAgIGlmIChuZXcgUmVnRXhwKCdcXFxcYicgKyBzZXQgKyAnXFxcXGInLCAnaScpLnRlc3QoZGVidWdFbnZpcm9uKSkge1xuICAgICAgdmFyIHBpZCA9IHByb2Nlc3MucGlkO1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG1zZyA9IGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJyVzICVkOiAlcycsIHNldCwgcGlkLCBtc2cpO1xuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVidWdzW3NldF0gPSBmdW5jdGlvbigpIHt9O1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVidWdzW3NldF07XG59O1xuXG5cbi8qKlxuICogRWNob3MgdGhlIHZhbHVlIG9mIGEgdmFsdWUuIFRyeXMgdG8gcHJpbnQgdGhlIHZhbHVlIG91dFxuICogaW4gdGhlIGJlc3Qgd2F5IHBvc3NpYmxlIGdpdmVuIHRoZSBkaWZmZXJlbnQgdHlwZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHByaW50IG91dC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIE9wdGlvbmFsIG9wdGlvbnMgb2JqZWN0IHRoYXQgYWx0ZXJzIHRoZSBvdXRwdXQuXG4gKi9cbi8qIGxlZ2FjeTogb2JqLCBzaG93SGlkZGVuLCBkZXB0aCwgY29sb3JzKi9cbmZ1bmN0aW9uIGluc3BlY3Qob2JqLCBvcHRzKSB7XG4gIC8vIGRlZmF1bHQgb3B0aW9uc1xuICB2YXIgY3R4ID0ge1xuICAgIHNlZW46IFtdLFxuICAgIHN0eWxpemU6IHN0eWxpemVOb0NvbG9yXG4gIH07XG4gIC8vIGxlZ2FjeS4uLlxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAzKSBjdHguZGVwdGggPSBhcmd1bWVudHNbMl07XG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDQpIGN0eC5jb2xvcnMgPSBhcmd1bWVudHNbM107XG4gIGlmIChpc0Jvb2xlYW4ob3B0cykpIHtcbiAgICAvLyBsZWdhY3kuLi5cbiAgICBjdHguc2hvd0hpZGRlbiA9IG9wdHM7XG4gIH0gZWxzZSBpZiAob3B0cykge1xuICAgIC8vIGdvdCBhbiBcIm9wdGlvbnNcIiBvYmplY3RcbiAgICBleHBvcnRzLl9leHRlbmQoY3R4LCBvcHRzKTtcbiAgfVxuICAvLyBzZXQgZGVmYXVsdCBvcHRpb25zXG4gIGlmIChpc1VuZGVmaW5lZChjdHguc2hvd0hpZGRlbikpIGN0eC5zaG93SGlkZGVuID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguZGVwdGgpKSBjdHguZGVwdGggPSAyO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmNvbG9ycykpIGN0eC5jb2xvcnMgPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jdXN0b21JbnNwZWN0KSkgY3R4LmN1c3RvbUluc3BlY3QgPSB0cnVlO1xuICBpZiAoY3R4LmNvbG9ycykgY3R4LnN0eWxpemUgPSBzdHlsaXplV2l0aENvbG9yO1xuICByZXR1cm4gZm9ybWF0VmFsdWUoY3R4LCBvYmosIGN0eC5kZXB0aCk7XG59XG5leHBvcnRzLmluc3BlY3QgPSBpbnNwZWN0O1xuXG5cbi8vIGh0dHA6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQU5TSV9lc2NhcGVfY29kZSNncmFwaGljc1xuaW5zcGVjdC5jb2xvcnMgPSB7XG4gICdib2xkJyA6IFsxLCAyMl0sXG4gICdpdGFsaWMnIDogWzMsIDIzXSxcbiAgJ3VuZGVybGluZScgOiBbNCwgMjRdLFxuICAnaW52ZXJzZScgOiBbNywgMjddLFxuICAnd2hpdGUnIDogWzM3LCAzOV0sXG4gICdncmV5JyA6IFs5MCwgMzldLFxuICAnYmxhY2snIDogWzMwLCAzOV0sXG4gICdibHVlJyA6IFszNCwgMzldLFxuICAnY3lhbicgOiBbMzYsIDM5XSxcbiAgJ2dyZWVuJyA6IFszMiwgMzldLFxuICAnbWFnZW50YScgOiBbMzUsIDM5XSxcbiAgJ3JlZCcgOiBbMzEsIDM5XSxcbiAgJ3llbGxvdycgOiBbMzMsIDM5XVxufTtcblxuLy8gRG9uJ3QgdXNlICdibHVlJyBub3QgdmlzaWJsZSBvbiBjbWQuZXhlXG5pbnNwZWN0LnN0eWxlcyA9IHtcbiAgJ3NwZWNpYWwnOiAnY3lhbicsXG4gICdudW1iZXInOiAneWVsbG93JyxcbiAgJ2Jvb2xlYW4nOiAneWVsbG93JyxcbiAgJ3VuZGVmaW5lZCc6ICdncmV5JyxcbiAgJ251bGwnOiAnYm9sZCcsXG4gICdzdHJpbmcnOiAnZ3JlZW4nLFxuICAnZGF0ZSc6ICdtYWdlbnRhJyxcbiAgLy8gXCJuYW1lXCI6IGludGVudGlvbmFsbHkgbm90IHN0eWxpbmdcbiAgJ3JlZ2V4cCc6ICdyZWQnXG59O1xuXG5cbmZ1bmN0aW9uIHN0eWxpemVXaXRoQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgdmFyIHN0eWxlID0gaW5zcGVjdC5zdHlsZXNbc3R5bGVUeXBlXTtcblxuICBpZiAoc3R5bGUpIHtcbiAgICByZXR1cm4gJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVswXSArICdtJyArIHN0ciArXG4gICAgICAgICAgICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMV0gKyAnbSc7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHN0cjtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIHN0eWxpemVOb0NvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHJldHVybiBzdHI7XG59XG5cblxuZnVuY3Rpb24gYXJyYXlUb0hhc2goYXJyYXkpIHtcbiAgdmFyIGhhc2ggPSB7fTtcblxuICBhcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaWR4KSB7XG4gICAgaGFzaFt2YWxdID0gdHJ1ZTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhhc2g7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0VmFsdWUoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzKSB7XG4gIC8vIFByb3ZpZGUgYSBob29rIGZvciB1c2VyLXNwZWNpZmllZCBpbnNwZWN0IGZ1bmN0aW9ucy5cbiAgLy8gQ2hlY2sgdGhhdCB2YWx1ZSBpcyBhbiBvYmplY3Qgd2l0aCBhbiBpbnNwZWN0IGZ1bmN0aW9uIG9uIGl0XG4gIGlmIChjdHguY3VzdG9tSW5zcGVjdCAmJlxuICAgICAgdmFsdWUgJiZcbiAgICAgIGlzRnVuY3Rpb24odmFsdWUuaW5zcGVjdCkgJiZcbiAgICAgIC8vIEZpbHRlciBvdXQgdGhlIHV0aWwgbW9kdWxlLCBpdCdzIGluc3BlY3QgZnVuY3Rpb24gaXMgc3BlY2lhbFxuICAgICAgdmFsdWUuaW5zcGVjdCAhPT0gZXhwb3J0cy5pbnNwZWN0ICYmXG4gICAgICAvLyBBbHNvIGZpbHRlciBvdXQgYW55IHByb3RvdHlwZSBvYmplY3RzIHVzaW5nIHRoZSBjaXJjdWxhciBjaGVjay5cbiAgICAgICEodmFsdWUuY29uc3RydWN0b3IgJiYgdmFsdWUuY29uc3RydWN0b3IucHJvdG90eXBlID09PSB2YWx1ZSkpIHtcbiAgICB2YXIgcmV0ID0gdmFsdWUuaW5zcGVjdChyZWN1cnNlVGltZXMsIGN0eCk7XG4gICAgaWYgKCFpc1N0cmluZyhyZXQpKSB7XG4gICAgICByZXQgPSBmb3JtYXRWYWx1ZShjdHgsIHJldCwgcmVjdXJzZVRpbWVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfVxuXG4gIC8vIFByaW1pdGl2ZSB0eXBlcyBjYW5ub3QgaGF2ZSBwcm9wZXJ0aWVzXG4gIHZhciBwcmltaXRpdmUgPSBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSk7XG4gIGlmIChwcmltaXRpdmUpIHtcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xuICB9XG5cbiAgLy8gTG9vayB1cCB0aGUga2V5cyBvZiB0aGUgb2JqZWN0LlxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKHZhbHVlKTtcbiAgdmFyIHZpc2libGVLZXlzID0gYXJyYXlUb0hhc2goa2V5cyk7XG5cbiAgaWYgKGN0eC5zaG93SGlkZGVuKSB7XG4gICAga2V5cyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHZhbHVlKTtcbiAgfVxuXG4gIC8vIElFIGRvZXNuJ3QgbWFrZSBlcnJvciBmaWVsZHMgbm9uLWVudW1lcmFibGVcbiAgLy8gaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2llL2R3dzUyc2J0KHY9dnMuOTQpLmFzcHhcbiAgaWYgKGlzRXJyb3IodmFsdWUpXG4gICAgICAmJiAoa2V5cy5pbmRleE9mKCdtZXNzYWdlJykgPj0gMCB8fCBrZXlzLmluZGV4T2YoJ2Rlc2NyaXB0aW9uJykgPj0gMCkpIHtcbiAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgLy8gU29tZSB0eXBlIG9mIG9iamVjdCB3aXRob3V0IHByb3BlcnRpZXMgY2FuIGJlIHNob3J0Y3V0dGVkLlxuICBpZiAoa2V5cy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICAgIHZhciBuYW1lID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tGdW5jdGlvbicgKyBuYW1lICsgJ10nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH1cbiAgICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKERhdGUucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAnZGF0ZScpO1xuICAgIH1cbiAgICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIGJhc2UgPSAnJywgYXJyYXkgPSBmYWxzZSwgYnJhY2VzID0gWyd7JywgJ30nXTtcblxuICAvLyBNYWtlIEFycmF5IHNheSB0aGF0IHRoZXkgYXJlIEFycmF5XG4gIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgIGFycmF5ID0gdHJ1ZTtcbiAgICBicmFjZXMgPSBbJ1snLCAnXSddO1xuICB9XG5cbiAgLy8gTWFrZSBmdW5jdGlvbnMgc2F5IHRoYXQgdGhleSBhcmUgZnVuY3Rpb25zXG4gIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgIHZhciBuID0gdmFsdWUubmFtZSA/ICc6ICcgKyB2YWx1ZS5uYW1lIDogJyc7XG4gICAgYmFzZSA9ICcgW0Z1bmN0aW9uJyArIG4gKyAnXSc7XG4gIH1cblxuICAvLyBNYWtlIFJlZ0V4cHMgc2F5IHRoYXQgdGhleSBhcmUgUmVnRXhwc1xuICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGRhdGVzIHdpdGggcHJvcGVydGllcyBmaXJzdCBzYXkgdGhlIGRhdGVcbiAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgRGF0ZS5wcm90b3R5cGUudG9VVENTdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIH1cblxuICAvLyBNYWtlIGVycm9yIHdpdGggbWVzc2FnZSBmaXJzdCBzYXkgdGhlIGVycm9yXG4gIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICBpZiAoa2V5cy5sZW5ndGggPT09IDAgJiYgKCFhcnJheSB8fCB2YWx1ZS5sZW5ndGggPT0gMCkpIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArIGJyYWNlc1sxXTtcbiAgfVxuXG4gIGlmIChyZWN1cnNlVGltZXMgPCAwKSB7XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbT2JqZWN0XScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG5cbiAgY3R4LnNlZW4ucHVzaCh2YWx1ZSk7XG5cbiAgdmFyIG91dHB1dDtcbiAgaWYgKGFycmF5KSB7XG4gICAgb3V0cHV0ID0gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cyk7XG4gIH0gZWxzZSB7XG4gICAgb3V0cHV0ID0ga2V5cy5tYXAoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSk7XG4gICAgfSk7XG4gIH1cblxuICBjdHguc2Vlbi5wb3AoKTtcblxuICByZXR1cm4gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKSB7XG4gIGlmIChpc1VuZGVmaW5lZCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCd1bmRlZmluZWQnLCAndW5kZWZpbmVkJyk7XG4gIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICB2YXIgc2ltcGxlID0gJ1xcJycgKyBKU09OLnN0cmluZ2lmeSh2YWx1ZSkucmVwbGFjZSgvXlwifFwiJC9nLCAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJykgKyAnXFwnJztcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoc2ltcGxlLCAnc3RyaW5nJyk7XG4gIH1cbiAgaWYgKGlzTnVtYmVyKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ251bWJlcicpO1xuICBpZiAoaXNCb29sZWFuKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJycgKyB2YWx1ZSwgJ2Jvb2xlYW4nKTtcbiAgLy8gRm9yIHNvbWUgcmVhc29uIHR5cGVvZiBudWxsIGlzIFwib2JqZWN0XCIsIHNvIHNwZWNpYWwgY2FzZSBoZXJlLlxuICBpZiAoaXNOdWxsKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ251bGwnLCAnbnVsbCcpO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEVycm9yKHZhbHVlKSB7XG4gIHJldHVybiAnWycgKyBFcnJvci5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgKyAnXSc7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0QXJyYXkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5cykge1xuICB2YXIgb3V0cHV0ID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsID0gdmFsdWUubGVuZ3RoOyBpIDwgbDsgKytpKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5KHZhbHVlLCBTdHJpbmcoaSkpKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIFN0cmluZyhpKSwgdHJ1ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXRwdXQucHVzaCgnJyk7XG4gICAgfVxuICB9XG4gIGtleXMuZm9yRWFjaChmdW5jdGlvbihrZXkpIHtcbiAgICBpZiAoIWtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAga2V5LCB0cnVlKSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KSB7XG4gIHZhciBuYW1lLCBzdHIsIGRlc2M7XG4gIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHZhbHVlLCBrZXkpIHx8IHsgdmFsdWU6IHZhbHVlW2tleV0gfTtcbiAgaWYgKGRlc2MuZ2V0KSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlci9TZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKGRlc2Muc2V0KSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5KHZpc2libGVLZXlzLCBrZXkpKSB7XG4gICAgbmFtZSA9ICdbJyArIGtleSArICddJztcbiAgfVxuICBpZiAoIXN0cikge1xuICAgIGlmIChjdHguc2Vlbi5pbmRleE9mKGRlc2MudmFsdWUpIDwgMCkge1xuICAgICAgaWYgKGlzTnVsbChyZWN1cnNlVGltZXMpKSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIHJlY3Vyc2VUaW1lcyAtIDEpO1xuICAgICAgfVxuICAgICAgaWYgKHN0ci5pbmRleE9mKCdcXG4nKSA+IC0xKSB7XG4gICAgICAgIGlmIChhcnJheSkge1xuICAgICAgICAgIHN0ciA9IHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKS5zdWJzdHIoMik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3RyID0gJ1xcbicgKyBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbQ2lyY3VsYXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKGlzVW5kZWZpbmVkKG5hbWUpKSB7XG4gICAgaWYgKGFycmF5ICYmIGtleS5tYXRjaCgvXlxcZCskLykpIHtcbiAgICAgIHJldHVybiBzdHI7XG4gICAgfVxuICAgIG5hbWUgPSBKU09OLnN0cmluZ2lmeSgnJyArIGtleSk7XG4gICAgaWYgKG5hbWUubWF0Y2goL15cIihbYS16QS1aX11bYS16QS1aXzAtOV0qKVwiJC8pKSB7XG4gICAgICBuYW1lID0gbmFtZS5zdWJzdHIoMSwgbmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnbmFtZScpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbmFtZS5yZXBsYWNlKC8nL2csIFwiXFxcXCdcIilcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvKF5cInxcIiQpL2csIFwiJ1wiKTtcbiAgICAgIG5hbWUgPSBjdHguc3R5bGl6ZShuYW1lLCAnc3RyaW5nJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWUgKyAnOiAnICsgc3RyO1xufVxuXG5cbmZ1bmN0aW9uIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKSB7XG4gIHZhciBudW1MaW5lc0VzdCA9IDA7XG4gIHZhciBsZW5ndGggPSBvdXRwdXQucmVkdWNlKGZ1bmN0aW9uKHByZXYsIGN1cikge1xuICAgIG51bUxpbmVzRXN0Kys7XG4gICAgaWYgKGN1ci5pbmRleE9mKCdcXG4nKSA+PSAwKSBudW1MaW5lc0VzdCsrO1xuICAgIHJldHVybiBwcmV2ICsgY3VyLnJlcGxhY2UoL1xcdTAwMWJcXFtcXGRcXGQ/bS9nLCAnJykubGVuZ3RoICsgMTtcbiAgfSwgMCk7XG5cbiAgaWYgKGxlbmd0aCA+IDYwKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArXG4gICAgICAgICAgIChiYXNlID09PSAnJyA/ICcnIDogYmFzZSArICdcXG4gJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBvdXRwdXQuam9pbignLFxcbiAgJykgK1xuICAgICAgICAgICAnICcgK1xuICAgICAgICAgICBicmFjZXNbMV07XG4gIH1cblxuICByZXR1cm4gYnJhY2VzWzBdICsgYmFzZSArICcgJyArIG91dHB1dC5qb2luKCcsICcpICsgJyAnICsgYnJhY2VzWzFdO1xufVxuXG5cbi8vIE5PVEU6IFRoZXNlIHR5cGUgY2hlY2tpbmcgZnVuY3Rpb25zIGludGVudGlvbmFsbHkgZG9uJ3QgdXNlIGBpbnN0YW5jZW9mYFxuLy8gYmVjYXVzZSBpdCBpcyBmcmFnaWxlIGFuZCBjYW4gYmUgZWFzaWx5IGZha2VkIHdpdGggYE9iamVjdC5jcmVhdGUoKWAuXG5mdW5jdGlvbiBpc0FycmF5KGFyKSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGFyKTtcbn1cbmV4cG9ydHMuaXNBcnJheSA9IGlzQXJyYXk7XG5cbmZ1bmN0aW9uIGlzQm9vbGVhbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJztcbn1cbmV4cG9ydHMuaXNCb29sZWFuID0gaXNCb29sZWFuO1xuXG5mdW5jdGlvbiBpc051bGwoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbCA9IGlzTnVsbDtcblxuZnVuY3Rpb24gaXNOdWxsT3JVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsT3JVbmRlZmluZWQgPSBpc051bGxPclVuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cbmV4cG9ydHMuaXNOdW1iZXIgPSBpc051bWJlcjtcblxuZnVuY3Rpb24gaXNTdHJpbmcoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3RyaW5nJztcbn1cbmV4cG9ydHMuaXNTdHJpbmcgPSBpc1N0cmluZztcblxuZnVuY3Rpb24gaXNTeW1ib2woYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnc3ltYm9sJztcbn1cbmV4cG9ydHMuaXNTeW1ib2wgPSBpc1N5bWJvbDtcblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbmV4cG9ydHMuaXNVbmRlZmluZWQgPSBpc1VuZGVmaW5lZDtcblxuZnVuY3Rpb24gaXNSZWdFeHAocmUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KHJlKSAmJiBvYmplY3RUb1N0cmluZyhyZSkgPT09ICdbb2JqZWN0IFJlZ0V4cF0nO1xufVxuZXhwb3J0cy5pc1JlZ0V4cCA9IGlzUmVnRXhwO1xuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNPYmplY3QgPSBpc09iamVjdDtcblxuZnVuY3Rpb24gaXNEYXRlKGQpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGQpICYmIG9iamVjdFRvU3RyaW5nKGQpID09PSAnW29iamVjdCBEYXRlXSc7XG59XG5leHBvcnRzLmlzRGF0ZSA9IGlzRGF0ZTtcblxuZnVuY3Rpb24gaXNFcnJvcihlKSB7XG4gIHJldHVybiBpc09iamVjdChlKSAmJlxuICAgICAgKG9iamVjdFRvU3RyaW5nKGUpID09PSAnW29iamVjdCBFcnJvcl0nIHx8IGUgaW5zdGFuY2VvZiBFcnJvcik7XG59XG5leHBvcnRzLmlzRXJyb3IgPSBpc0Vycm9yO1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cbmV4cG9ydHMuaXNGdW5jdGlvbiA9IGlzRnVuY3Rpb247XG5cbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnYm9vbGVhbicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdudW1iZXInIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3RyaW5nJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCcgfHwgIC8vIEVTNiBzeW1ib2xcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICd1bmRlZmluZWQnO1xufVxuZXhwb3J0cy5pc1ByaW1pdGl2ZSA9IGlzUHJpbWl0aXZlO1xuXG5leHBvcnRzLmlzQnVmZmVyID0gcmVxdWlyZSgnLi9zdXBwb3J0L2lzQnVmZmVyJyk7XG5cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKG8pIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKTtcbn1cblxuXG5mdW5jdGlvbiBwYWQobikge1xuICByZXR1cm4gbiA8IDEwID8gJzAnICsgbi50b1N0cmluZygxMCkgOiBuLnRvU3RyaW5nKDEwKTtcbn1cblxuXG52YXIgbW9udGhzID0gWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsXG4gICAgICAgICAgICAgICdPY3QnLCAnTm92JywgJ0RlYyddO1xuXG4vLyAyNiBGZWIgMTY6MTk6MzRcbmZ1bmN0aW9uIHRpbWVzdGFtcCgpIHtcbiAgdmFyIGQgPSBuZXcgRGF0ZSgpO1xuICB2YXIgdGltZSA9IFtwYWQoZC5nZXRIb3VycygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0TWludXRlcygpKSxcbiAgICAgICAgICAgICAgcGFkKGQuZ2V0U2Vjb25kcygpKV0uam9pbignOicpO1xuICByZXR1cm4gW2QuZ2V0RGF0ZSgpLCBtb250aHNbZC5nZXRNb250aCgpXSwgdGltZV0uam9pbignICcpO1xufVxuXG5cbi8vIGxvZyBpcyBqdXN0IGEgdGhpbiB3cmFwcGVyIHRvIGNvbnNvbGUubG9nIHRoYXQgcHJlcGVuZHMgYSB0aW1lc3RhbXBcbmV4cG9ydHMubG9nID0gZnVuY3Rpb24oKSB7XG4gIGNvbnNvbGUubG9nKCclcyAtICVzJywgdGltZXN0YW1wKCksIGV4cG9ydHMuZm9ybWF0LmFwcGx5KGV4cG9ydHMsIGFyZ3VtZW50cykpO1xufTtcblxuXG4vKipcbiAqIEluaGVyaXQgdGhlIHByb3RvdHlwZSBtZXRob2RzIGZyb20gb25lIGNvbnN0cnVjdG9yIGludG8gYW5vdGhlci5cbiAqXG4gKiBUaGUgRnVuY3Rpb24ucHJvdG90eXBlLmluaGVyaXRzIGZyb20gbGFuZy5qcyByZXdyaXR0ZW4gYXMgYSBzdGFuZGFsb25lXG4gKiBmdW5jdGlvbiAobm90IG9uIEZ1bmN0aW9uLnByb3RvdHlwZSkuIE5PVEU6IElmIHRoaXMgZmlsZSBpcyB0byBiZSBsb2FkZWRcbiAqIGR1cmluZyBib290c3RyYXBwaW5nIHRoaXMgZnVuY3Rpb24gbmVlZHMgdG8gYmUgcmV3cml0dGVuIHVzaW5nIHNvbWUgbmF0aXZlXG4gKiBmdW5jdGlvbnMgYXMgcHJvdG90eXBlIHNldHVwIHVzaW5nIG5vcm1hbCBKYXZhU2NyaXB0IGRvZXMgbm90IHdvcmsgYXNcbiAqIGV4cGVjdGVkIGR1cmluZyBib290c3RyYXBwaW5nIChzZWUgbWlycm9yLmpzIGluIHIxMTQ5MDMpLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gd2hpY2ggbmVlZHMgdG8gaW5oZXJpdCB0aGVcbiAqICAgICBwcm90b3R5cGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBzdXBlckN0b3IgQ29uc3RydWN0b3IgZnVuY3Rpb24gdG8gaW5oZXJpdCBwcm90b3R5cGUgZnJvbS5cbiAqL1xuZXhwb3J0cy5pbmhlcml0cyA9IHJlcXVpcmUoJ2luaGVyaXRzJyk7XG5cbmV4cG9ydHMuX2V4dGVuZCA9IGZ1bmN0aW9uKG9yaWdpbiwgYWRkKSB7XG4gIC8vIERvbid0IGRvIGFueXRoaW5nIGlmIGFkZCBpc24ndCBhbiBvYmplY3RcbiAgaWYgKCFhZGQgfHwgIWlzT2JqZWN0KGFkZCkpIHJldHVybiBvcmlnaW47XG5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhhZGQpO1xuICB2YXIgaSA9IGtleXMubGVuZ3RoO1xuICB3aGlsZSAoaS0tKSB7XG4gICAgb3JpZ2luW2tleXNbaV1dID0gYWRkW2tleXNbaV1dO1xuICB9XG4gIHJldHVybiBvcmlnaW47XG59O1xuXG5mdW5jdGlvbiBoYXNPd25Qcm9wZXJ0eShvYmosIHByb3ApIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApO1xufVxuIiwiIiwiLypcbm9iamVjdC1hc3NpZ25cbihjKSBTaW5kcmUgU29yaHVzXG5AbGljZW5zZSBNSVRcbiovXG5cbid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG52YXIgcHJvcElzRW51bWVyYWJsZSA9IE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGU7XG5cbmZ1bmN0aW9uIHRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignT2JqZWN0LmFzc2lnbiBjYW5ub3QgYmUgY2FsbGVkIHdpdGggbnVsbCBvciB1bmRlZmluZWQnKTtcblx0fVxuXG5cdHJldHVybiBPYmplY3QodmFsKTtcbn1cblxuZnVuY3Rpb24gc2hvdWxkVXNlTmF0aXZlKCkge1xuXHR0cnkge1xuXHRcdGlmICghT2JqZWN0LmFzc2lnbikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIERldGVjdCBidWdneSBwcm9wZXJ0eSBlbnVtZXJhdGlvbiBvcmRlciBpbiBvbGRlciBWOCB2ZXJzaW9ucy5cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTQxMThcblx0XHR2YXIgdGVzdDEgPSBuZXcgU3RyaW5nKCdhYmMnKTsgIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3LXdyYXBwZXJzXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGVycikge1xuXHRcdC8vIFdlIGRvbid0IGV4cGVjdCBhbnkgb2YgdGhlIGFib3ZlIHRvIHRocm93LCBidXQgYmV0dGVyIHRvIGJlIHNhZmUuXG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2hvdWxkVXNlTmF0aXZlKCkgPyBPYmplY3QuYXNzaWduIDogZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIgdG8gPSB0b09iamVjdCh0YXJnZXQpO1xuXHR2YXIgc3ltYm9scztcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBPYmplY3QoYXJndW1lbnRzW3NdKTtcblxuXHRcdGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG5cdFx0XHRpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG5cdFx0XHRcdHRvW2tleV0gPSBmcm9tW2tleV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGdldE93blByb3BlcnR5U3ltYm9scykge1xuXHRcdFx0c3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9faW1wb3J0RGVmYXVsdCA9ICh0aGlzICYmIHRoaXMuX19pbXBvcnREZWZhdWx0KSB8fCBmdW5jdGlvbiAobW9kKSB7XG4gICAgcmV0dXJuIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpID8gbW9kIDogeyBcImRlZmF1bHRcIjogbW9kIH07XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5jb21waWxlID0gZXhwb3J0cy5tYWtlTm9udGVybWluYWxDb252ZXJ0ZXJzID0gdm9pZCAwO1xuY29uc3QgdHlwZXNfMSA9IHJlcXVpcmUoXCIuL3R5cGVzXCIpO1xuY29uc3QgYXNzZXJ0XzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImFzc2VydFwiKSk7XG5jb25zdCBwYXJzZXJfMSA9IHJlcXVpcmUoXCIuL3BhcnNlclwiKTtcbi8qKlxuICogQ29udmVydHMgc3RyaW5nIHRvIG5vbnRlcm1pbmFsLlxuICogQHBhcmFtIDxOVD4gbm9udGVybWluYWwgZW51bWVyYXRpb25cbiAqIEBwYXJhbSBub250ZXJtaW5hbHMgcmVxdWlyZWQgdG8gYmUgdGhlIHJ1bnRpbWUgb2JqZWN0IGZvciB0aGUgPE5UPiB0eXBlIHBhcmFtZXRlclxuICogQHJldHVybiBhIHBhaXIgb2YgY29udmVydGVycyB7IG5vbnRlcm1pbmFsVG9TdHJpbmcsIHN0cmluZ1RvTm9udGVybWluYWwgfVxuICogICAgICAgICAgICAgIG9uZSB0YWtlcyBhIHN0cmluZyAoYW55IGFscGhhYmV0aWMgY2FzZSkgYW5kIHJldHVybnMgdGhlIG5vbnRlcm1pbmFsIGl0IG5hbWVzXG4gKiAgICAgICAgICAgICAgdGhlIG90aGVyIHRha2VzIGEgbm9udGVybWluYWwgYW5kIHJldHVybnMgaXRzIHN0cmluZyBuYW1lLCB1c2luZyB0aGUgVHlwZXNjcmlwdCBzb3VyY2UgY2FwaXRhbGl6YXRpb24uXG4gKiAgICAgICAgIEJvdGggY29udmVydGVycyB0aHJvdyBHcmFtbWFyRXJyb3IgaWYgdGhlIGNvbnZlcnNpb24gY2FuJ3QgYmUgZG9uZS5cbiAqIEB0aHJvd3MgR3JhbW1hckVycm9yIGlmIE5UIGhhcyBhIG5hbWUgY29sbGlzaW9uICh0d28gbm9udGVybWluYWwgbmFtZXMgdGhhdCBkaWZmZXIgb25seSBpbiBjYXBpdGFsaXphdGlvbixcbiAqICAgICAgIGUuZy4gUk9PVCBhbmQgcm9vdCkuXG4gKi9cbmZ1bmN0aW9uIG1ha2VOb250ZXJtaW5hbENvbnZlcnRlcnMobm9udGVybWluYWxzKSB7XG4gICAgLy8gXCJjYW5vbmljYWwgbmFtZVwiIGlzIGEgY2FzZS1pbmRlcGVuZGVudCBuYW1lIChjYW5vbmljYWxpemVkIHRvIGxvd2VyY2FzZSlcbiAgICAvLyBcInNvdXJjZSBuYW1lXCIgaXMgdGhlIG5hbWUgY2FwaXRhbGl6ZWQgYXMgaW4gdGhlIFR5cGVzY3JpcHQgc291cmNlIGRlZmluaXRpb24gb2YgTlRcbiAgICBjb25zdCBub250ZXJtaW5hbEZvckNhbm9uaWNhbE5hbWUgPSBuZXcgTWFwKCk7XG4gICAgY29uc3Qgc291cmNlTmFtZUZvck5vbnRlcm1pbmFsID0gbmV3IE1hcCgpO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKG5vbnRlcm1pbmFscykpIHtcbiAgICAgICAgLy8gaW4gVHlwZXNjcmlwdCwgdGhlIG5vbnRlcm1pbmFscyBvYmplY3QgY29tYmluZXMgYm90aCBhIE5ULT5uYW1lIG1hcHBpbmcgYW5kIG5hbWUtPk5UIG1hcHBpbmcuXG4gICAgICAgIC8vIGh0dHBzOi8vd3d3LnR5cGVzY3JpcHRsYW5nLm9yZy9kb2NzL2hhbmRib29rL2VudW1zLmh0bWwjZW51bXMtYXQtcnVudGltZVxuICAgICAgICAvLyBTbyBmaWx0ZXIganVzdCB0byBrZXlzIHRoYXQgYXJlIHZhbGlkIFBhcnNlcmxpYiBub250ZXJtaW5hbCBuYW1lc1xuICAgICAgICBpZiAoL15bYS16QS1aX11bYS16QS1aXzAtOV0qJC8udGVzdChrZXkpKSB7XG4gICAgICAgICAgICBjb25zdCBzb3VyY2VOYW1lID0ga2V5O1xuICAgICAgICAgICAgY29uc3QgY2Fub25pY2FsTmFtZSA9IGtleS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgY29uc3QgbnQgPSBub250ZXJtaW5hbHNbc291cmNlTmFtZV07XG4gICAgICAgICAgICBpZiAobm9udGVybWluYWxGb3JDYW5vbmljYWxOYW1lLmhhcyhjYW5vbmljYWxOYW1lKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyB0eXBlc18xLkdyYW1tYXJFcnJvcignbmFtZSBjb2xsaXNpb24gaW4gbm9udGVybWluYWwgZW51bWVyYXRpb246ICdcbiAgICAgICAgICAgICAgICAgICAgKyBzb3VyY2VOYW1lRm9yTm9udGVybWluYWwuZ2V0KG5vbnRlcm1pbmFsRm9yQ2Fub25pY2FsTmFtZS5nZXQoY2Fub25pY2FsTmFtZSkpXG4gICAgICAgICAgICAgICAgICAgICsgJyBhbmQgJyArIHNvdXJjZU5hbWVcbiAgICAgICAgICAgICAgICAgICAgKyAnIGFyZSB0aGUgc2FtZSB3aGVuIGNvbXBhcmVkIGNhc2UtaW5zZW5zaXRpdmVseScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbm9udGVybWluYWxGb3JDYW5vbmljYWxOYW1lLnNldChjYW5vbmljYWxOYW1lLCBudCk7XG4gICAgICAgICAgICBzb3VyY2VOYW1lRm9yTm9udGVybWluYWwuc2V0KG50LCBzb3VyY2VOYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvL2NvbnNvbGUuZXJyb3Ioc291cmNlTmFtZUZvck5vbnRlcm1pbmFsKTtcbiAgICBmdW5jdGlvbiBzdHJpbmdUb05vbnRlcm1pbmFsKG5hbWUpIHtcbiAgICAgICAgY29uc3QgY2Fub25pY2FsTmFtZSA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKCFub250ZXJtaW5hbEZvckNhbm9uaWNhbE5hbWUuaGFzKGNhbm9uaWNhbE5hbWUpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgdHlwZXNfMS5HcmFtbWFyRXJyb3IoJ2dyYW1tYXIgdXNlcyBub250ZXJtaW5hbCAnICsgbmFtZSArICcsIHdoaWNoIGlzIG5vdCBmb3VuZCBpbiB0aGUgbm9udGVybWluYWwgZW51bWVyYXRpb24gcGFzc2VkIHRvIGNvbXBpbGUoKScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub250ZXJtaW5hbEZvckNhbm9uaWNhbE5hbWUuZ2V0KGNhbm9uaWNhbE5hbWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBub250ZXJtaW5hbFRvU3RyaW5nKG50KSB7XG4gICAgICAgIGlmICghc291cmNlTmFtZUZvck5vbnRlcm1pbmFsLmhhcyhudCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyB0eXBlc18xLkdyYW1tYXJFcnJvcignbm9udGVybWluYWwgJyArIG50ICsgJyBpcyBub3QgZm91bmQgaW4gdGhlIG5vbnRlcm1pbmFsIGVudW1lcmF0aW9uIHBhc3NlZCB0byBjb21waWxlKCknKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc291cmNlTmFtZUZvck5vbnRlcm1pbmFsLmdldChudCk7XG4gICAgfVxuICAgIHJldHVybiB7IHN0cmluZ1RvTm9udGVybWluYWwsIG5vbnRlcm1pbmFsVG9TdHJpbmcgfTtcbn1cbmV4cG9ydHMubWFrZU5vbnRlcm1pbmFsQ29udmVydGVycyA9IG1ha2VOb250ZXJtaW5hbENvbnZlcnRlcnM7XG52YXIgR3JhbW1hck5UO1xuKGZ1bmN0aW9uIChHcmFtbWFyTlQpIHtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiR1JBTU1BUlwiXSA9IDBdID0gXCJHUkFNTUFSXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIlBST0RVQ1RJT05cIl0gPSAxXSA9IFwiUFJPRFVDVElPTlwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJTS0lQQkxPQ0tcIl0gPSAyXSA9IFwiU0tJUEJMT0NLXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIlVOSU9OXCJdID0gM10gPSBcIlVOSU9OXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIkNPTkNBVEVOQVRJT05cIl0gPSA0XSA9IFwiQ09OQ0FURU5BVElPTlwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJSRVBFVElUSU9OXCJdID0gNV0gPSBcIlJFUEVUSVRJT05cIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiUkVQRUFUT1BFUkFUT1JcIl0gPSA2XSA9IFwiUkVQRUFUT1BFUkFUT1JcIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiVU5JVFwiXSA9IDddID0gXCJVTklUXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIk5PTlRFUk1JTkFMXCJdID0gOF0gPSBcIk5PTlRFUk1JTkFMXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIlRFUk1JTkFMXCJdID0gOV0gPSBcIlRFUk1JTkFMXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIlFVT1RFRFNUUklOR1wiXSA9IDEwXSA9IFwiUVVPVEVEU1RSSU5HXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIk5VTUJFUlwiXSA9IDExXSA9IFwiTlVNQkVSXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIlJBTkdFXCJdID0gMTJdID0gXCJSQU5HRVwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJVUFBFUkJPVU5EXCJdID0gMTNdID0gXCJVUFBFUkJPVU5EXCI7XG4gICAgR3JhbW1hck5UW0dyYW1tYXJOVFtcIkxPV0VSQk9VTkRcIl0gPSAxNF0gPSBcIkxPV0VSQk9VTkRcIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiQ0hBUkFDVEVSU0VUXCJdID0gMTVdID0gXCJDSEFSQUNURVJTRVRcIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiQU5ZQ0hBUlwiXSA9IDE2XSA9IFwiQU5ZQ0hBUlwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJDSEFSQUNURVJDTEFTU1wiXSA9IDE3XSA9IFwiQ0hBUkFDVEVSQ0xBU1NcIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiV0hJVEVTUEFDRVwiXSA9IDE4XSA9IFwiV0hJVEVTUEFDRVwiO1xuICAgIEdyYW1tYXJOVFtHcmFtbWFyTlRbXCJPTkVMSU5FQ09NTUVOVFwiXSA9IDE5XSA9IFwiT05FTElORUNPTU1FTlRcIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiQkxPQ0tDT01NRU5UXCJdID0gMjBdID0gXCJCTE9DS0NPTU1FTlRcIjtcbiAgICBHcmFtbWFyTlRbR3JhbW1hck5UW1wiU0tJUFwiXSA9IDIxXSA9IFwiU0tJUFwiO1xufSkoR3JhbW1hck5UIHx8IChHcmFtbWFyTlQgPSB7fSkpO1xuO1xuZnVuY3Rpb24gbnR0KG5vbnRlcm1pbmFsKSB7XG4gICAgcmV0dXJuICgwLCBwYXJzZXJfMS5udCkobm9udGVybWluYWwsIEdyYW1tYXJOVFtub250ZXJtaW5hbF0pO1xufVxuY29uc3QgZ3JhbW1hckdyYW1tYXIgPSBuZXcgTWFwKCk7XG4vLyBncmFtbWFyIDo6PSAoIHByb2R1Y3Rpb24gfCBza2lwQmxvY2sgKStcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuR1JBTU1BUiwgKDAsIHBhcnNlcl8xLmNhdCkobnR0KEdyYW1tYXJOVC5TS0lQKSwgKDAsIHBhcnNlcl8xLnN0YXIpKCgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5vcikobnR0KEdyYW1tYXJOVC5QUk9EVUNUSU9OKSwgbnR0KEdyYW1tYXJOVC5TS0lQQkxPQ0spKSwgbnR0KEdyYW1tYXJOVC5TS0lQKSkpKSk7XG4vLyBza2lwQmxvY2sgOjo9ICdAc2tpcCcgbm9udGVybWluYWwgJ3snIHByb2R1Y3Rpb24qICd9J1xuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5TS0lQQkxPQ0ssICgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5zdHIpKFwiQHNraXBcIiksIG50dChHcmFtbWFyTlQuU0tJUCksICgwLCBwYXJzZXJfMS5mYWlsZmFzdCkobnR0KEdyYW1tYXJOVC5OT05URVJNSU5BTCkpLCBudHQoR3JhbW1hck5ULlNLSVApLCAoMCwgcGFyc2VyXzEuc3RyKSgneycpLCAoMCwgcGFyc2VyXzEuZmFpbGZhc3QpKCgwLCBwYXJzZXJfMS5jYXQpKG50dChHcmFtbWFyTlQuU0tJUCksICgwLCBwYXJzZXJfMS5zdGFyKSgoMCwgcGFyc2VyXzEuY2F0KShudHQoR3JhbW1hck5ULlBST0RVQ1RJT04pLCBudHQoR3JhbW1hck5ULlNLSVApKSksICgwLCBwYXJzZXJfMS5zdHIpKCd9JykpKSkpO1xuLy8gcHJvZHVjdGlvbiA6Oj0gbm9udGVybWluYWwgJzo6PScgdW5pb24gJzsnXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULlBST0RVQ1RJT04sICgwLCBwYXJzZXJfMS5jYXQpKG50dChHcmFtbWFyTlQuTk9OVEVSTUlOQUwpLCBudHQoR3JhbW1hck5ULlNLSVApLCAoMCwgcGFyc2VyXzEuc3RyKShcIjo6PVwiKSwgKDAsIHBhcnNlcl8xLmZhaWxmYXN0KSgoMCwgcGFyc2VyXzEuY2F0KShudHQoR3JhbW1hck5ULlNLSVApLCBudHQoR3JhbW1hck5ULlVOSU9OKSwgbnR0KEdyYW1tYXJOVC5TS0lQKSwgKDAsIHBhcnNlcl8xLnN0cikoJzsnKSkpKSk7XG4vLyB1bmlvbiA6OiA9IGNvbmNhdGVuYXRpb24gKCd8JyBjb25jYXRlbmF0aW9uKSpcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuVU5JT04sICgwLCBwYXJzZXJfMS5jYXQpKG50dChHcmFtbWFyTlQuQ09OQ0FURU5BVElPTiksICgwLCBwYXJzZXJfMS5zdGFyKSgoMCwgcGFyc2VyXzEuY2F0KShudHQoR3JhbW1hck5ULlNLSVApLCAoMCwgcGFyc2VyXzEuc3RyKSgnfCcpLCBudHQoR3JhbW1hck5ULlNLSVApLCBudHQoR3JhbW1hck5ULkNPTkNBVEVOQVRJT04pKSkpKTtcbi8vIGNvbmNhdGVuYXRpb24gOjogPSByZXBldGl0aW9uKiBcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuQ09OQ0FURU5BVElPTiwgKDAsIHBhcnNlcl8xLnN0YXIpKCgwLCBwYXJzZXJfMS5jYXQpKG50dChHcmFtbWFyTlQuUkVQRVRJVElPTiksIG50dChHcmFtbWFyTlQuU0tJUCkpKSk7XG4vLyByZXBldGl0aW9uIDo6PSB1bml0IHJlcGVhdE9wZXJhdG9yP1xuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5SRVBFVElUSU9OLCAoMCwgcGFyc2VyXzEuY2F0KShudHQoR3JhbW1hck5ULlVOSVQpLCBudHQoR3JhbW1hck5ULlNLSVApLCAoMCwgcGFyc2VyXzEub3B0aW9uKShudHQoR3JhbW1hck5ULlJFUEVBVE9QRVJBVE9SKSkpKTtcbi8vIHJlcGVhdE9wZXJhdG9yIDo6PSBbKis/XSB8ICd7JyAoIG51bWJlciB8IHJhbmdlIHwgdXBwZXJCb3VuZCB8IGxvd2VyQm91bmQgKSAnfSdcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuUkVQRUFUT1BFUkFUT1IsICgwLCBwYXJzZXJfMS5vcikoKDAsIHBhcnNlcl8xLnJlZ2V4KShcIlsqKz9dXCIpLCAoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEuc3RyKShcIntcIiksICgwLCBwYXJzZXJfMS5vcikobnR0KEdyYW1tYXJOVC5OVU1CRVIpLCBudHQoR3JhbW1hck5ULlJBTkdFKSwgbnR0KEdyYW1tYXJOVC5VUFBFUkJPVU5EKSwgbnR0KEdyYW1tYXJOVC5MT1dFUkJPVU5EKSksICgwLCBwYXJzZXJfMS5zdHIpKFwifVwiKSkpKTtcbi8vIG51bWJlciA6Oj0gWzAtOV0rXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULk5VTUJFUiwgKDAsIHBhcnNlcl8xLnBsdXMpKCgwLCBwYXJzZXJfMS5yZWdleCkoXCJbMC05XVwiKSkpO1xuLy8gcmFuZ2UgOjo9IG51bWJlciAnLCcgbnVtYmVyXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULlJBTkdFLCAoMCwgcGFyc2VyXzEuY2F0KShudHQoR3JhbW1hck5ULk5VTUJFUiksICgwLCBwYXJzZXJfMS5zdHIpKFwiLFwiKSwgbnR0KEdyYW1tYXJOVC5OVU1CRVIpKSk7XG4vLyB1cHBlckJvdW5kIDo6PSAnLCcgbnVtYmVyXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULlVQUEVSQk9VTkQsICgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5zdHIpKFwiLFwiKSwgbnR0KEdyYW1tYXJOVC5OVU1CRVIpKSk7XG4vLyBsb3dlckJvdW5kIDo6PSBudW1iZXIgJywnXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULkxPV0VSQk9VTkQsICgwLCBwYXJzZXJfMS5jYXQpKG50dChHcmFtbWFyTlQuTlVNQkVSKSwgKDAsIHBhcnNlcl8xLnN0cikoXCIsXCIpKSk7XG4vLyB1bml0IDo6PSBub250ZXJtaW5hbCB8IHRlcm1pbmFsIHwgJygnIHVuaW9uICcpJ1xuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5VTklULCAoMCwgcGFyc2VyXzEub3IpKG50dChHcmFtbWFyTlQuTk9OVEVSTUlOQUwpLCBudHQoR3JhbW1hck5ULlRFUk1JTkFMKSwgKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLnN0cikoJygnKSwgbnR0KEdyYW1tYXJOVC5TS0lQKSwgbnR0KEdyYW1tYXJOVC5VTklPTiksIG50dChHcmFtbWFyTlQuU0tJUCksICgwLCBwYXJzZXJfMS5zdHIpKCcpJykpKSk7XG4vLyBub250ZXJtaW5hbCA6Oj0gW2EtekEtWl9dW2EtekEtWl8wLTldKlxuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5OT05URVJNSU5BTCwgKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLnJlZ2V4KShcIlthLXpBLVpfXVwiKSwgKDAsIHBhcnNlcl8xLnN0YXIpKCgwLCBwYXJzZXJfMS5yZWdleCkoXCJbYS16QS1aXzAtOV1cIikpKSk7XG4vLyB0ZXJtaW5hbCA6Oj0gcXVvdGVkU3RyaW5nIHwgY2hhcmFjdGVyU2V0IHwgYW55Q2hhciB8IGNoYXJhY3RlckNsYXNzXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULlRFUk1JTkFMLCAoMCwgcGFyc2VyXzEub3IpKG50dChHcmFtbWFyTlQuUVVPVEVEU1RSSU5HKSwgbnR0KEdyYW1tYXJOVC5DSEFSQUNURVJTRVQpLCBudHQoR3JhbW1hck5ULkFOWUNIQVIpLCBudHQoR3JhbW1hck5ULkNIQVJBQ1RFUkNMQVNTKSkpO1xuLy8gcXVvdGVkU3RyaW5nIDo6PSBcIidcIiAoW14nXFxyXFxuXFxcXF0gfCAnXFxcXCcgLiApKiBcIidcIiB8ICdcIicgKFteXCJcXHJcXG5cXFxcXSB8ICdcXFxcJyAuICkqICdcIidcbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuUVVPVEVEU1RSSU5HLCAoMCwgcGFyc2VyXzEub3IpKCgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5zdHIpKFwiJ1wiKSwgKDAsIHBhcnNlcl8xLmZhaWxmYXN0KSgoMCwgcGFyc2VyXzEuc3RhcikoKDAsIHBhcnNlcl8xLm9yKSgoMCwgcGFyc2VyXzEucmVnZXgpKFwiW14nXFxyXFxuXFxcXFxcXFxdXCIpLCAoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEuc3RyKSgnXFxcXCcpLCAoMCwgcGFyc2VyXzEucmVnZXgpKFwiLlwiKSkpKSksICgwLCBwYXJzZXJfMS5zdHIpKFwiJ1wiKSksICgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5zdHIpKCdcIicpLCAoMCwgcGFyc2VyXzEuZmFpbGZhc3QpKCgwLCBwYXJzZXJfMS5zdGFyKSgoMCwgcGFyc2VyXzEub3IpKCgwLCBwYXJzZXJfMS5yZWdleCkoJ1teXCJcXHJcXG5cXFxcXFxcXF0nKSwgKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLnN0cikoJ1xcXFwnKSwgKDAsIHBhcnNlcl8xLnJlZ2V4KShcIi5cIikpKSkpLCAoMCwgcGFyc2VyXzEuc3RyKSgnXCInKSkpKTtcbi8vIGNoYXJhY3RlclNldCA6Oj0gJ1snIChbXlxcXVxcclxcblxcXFxdIHwgJ1xcXFwnIC4gKSsgJ10nXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULkNIQVJBQ1RFUlNFVCwgKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLnN0cikoJ1snKSwgKDAsIHBhcnNlcl8xLmZhaWxmYXN0KSgoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEucGx1cykoKDAsIHBhcnNlcl8xLm9yKSgoMCwgcGFyc2VyXzEucmVnZXgpKFwiW15cXFxcXVxcclxcblxcXFxcXFxcXVwiKSwgKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLnN0cikoJ1xcXFwnKSwgKDAsIHBhcnNlcl8xLnJlZ2V4KShcIi5cIikpKSkpKSwgKDAsIHBhcnNlcl8xLnN0cikoJ10nKSkpO1xuLy8gYW55Q2hhciA6Oj0gJy4nXG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULkFOWUNIQVIsICgwLCBwYXJzZXJfMS5zdHIpKCcuJykpO1xuLy8gY2hhcmFjdGVyQ2xhc3MgOjo9ICdcXFxcJyBbZHN3XVxuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5DSEFSQUNURVJDTEFTUywgKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLnN0cikoJ1xcXFwnKSwgKDAsIHBhcnNlcl8xLmZhaWxmYXN0KSgoMCwgcGFyc2VyXzEucmVnZXgpKFwiW2Rzd11cIikpKSk7XG4vLyB3aGl0ZXNwYWNlIDo6PSBbIFxcdFxcclxcbl1cbmdyYW1tYXJHcmFtbWFyLnNldChHcmFtbWFyTlQuV0hJVEVTUEFDRSwgKDAsIHBhcnNlcl8xLnJlZ2V4KShcIlsgXFx0XFxyXFxuXVwiKSk7XG5ncmFtbWFyR3JhbW1hci5zZXQoR3JhbW1hck5ULk9ORUxJTkVDT01NRU5ULCAoMCwgcGFyc2VyXzEuY2F0KSgoMCwgcGFyc2VyXzEuc3RyKShcIi8vXCIpLCAoMCwgcGFyc2VyXzEuc3RhcikoKDAsIHBhcnNlcl8xLnJlZ2V4KShcIlteXFxyXFxuXVwiKSksICgwLCBwYXJzZXJfMS5vcikoKDAsIHBhcnNlcl8xLnN0cikoXCJcXHJcXG5cIiksICgwLCBwYXJzZXJfMS5zdHIpKCdcXG4nKSwgKDAsIHBhcnNlcl8xLnN0cikoJ1xccicpKSkpO1xuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5CTE9DS0NPTU1FTlQsICgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5zdHIpKFwiLypcIiksICgwLCBwYXJzZXJfMS5jYXQpKCgwLCBwYXJzZXJfMS5zdGFyKSgoMCwgcGFyc2VyXzEucmVnZXgpKFwiW14qXVwiKSksICgwLCBwYXJzZXJfMS5zdHIpKCcqJykpLCAoMCwgcGFyc2VyXzEuc3RhcikoKDAsIHBhcnNlcl8xLmNhdCkoKDAsIHBhcnNlcl8xLnJlZ2V4KShcIlteL11cIiksICgwLCBwYXJzZXJfMS5zdGFyKSgoMCwgcGFyc2VyXzEucmVnZXgpKFwiW14qXVwiKSksICgwLCBwYXJzZXJfMS5zdHIpKCcqJykpKSwgKDAsIHBhcnNlcl8xLnN0cikoJy8nKSkpO1xuZ3JhbW1hckdyYW1tYXIuc2V0KEdyYW1tYXJOVC5TS0lQLCAoMCwgcGFyc2VyXzEuc3RhcikoKDAsIHBhcnNlcl8xLm9yKShudHQoR3JhbW1hck5ULldISVRFU1BBQ0UpLCBudHQoR3JhbW1hck5ULk9ORUxJTkVDT01NRU5UKSwgbnR0KEdyYW1tYXJOVC5CTE9DS0NPTU1FTlQpKSkpO1xuY29uc3QgZ3JhbW1hclBhcnNlciA9IG5ldyBwYXJzZXJfMS5JbnRlcm5hbFBhcnNlcihncmFtbWFyR3JhbW1hciwgbnR0KEdyYW1tYXJOVC5HUkFNTUFSKSwgKG50KSA9PiBHcmFtbWFyTlRbbnRdKTtcbi8qKlxuICogQ29tcGlsZSBhIFBhcnNlciBmcm9tIGEgZ3JhbW1hciByZXByZXNlbnRlZCBhcyBhIHN0cmluZy5cbiAqIEBwYXJhbSA8TlQ+IGEgVHlwZXNjcmlwdCBFbnVtIHdpdGggb25lIHN5bWJvbCBmb3IgZWFjaCBub250ZXJtaW5hbCB1c2VkIGluIHRoZSBncmFtbWFyLFxuICogICAgICAgIG1hdGNoaW5nIHRoZSBub250ZXJtaW5hbHMgd2hlbiBjb21wYXJlZCBjYXNlLWluc2Vuc2l0aXZlbHkgKHNvIFJPT1QgYW5kIFJvb3QgYW5kIHJvb3QgYXJlIHRoZSBzYW1lKS5cbiAqIEBwYXJhbSBncmFtbWFyIHRoZSBncmFtbWFyIHRvIHVzZVxuICogQHBhcmFtIG5vbnRlcm1pbmFscyB0aGUgcnVudGltZSBvYmplY3Qgb2YgdGhlIG5vbnRlcm1pbmFscyBlbnVtLiBGb3IgZXhhbXBsZSwgaWZcbiAqICAgICAgICAgICAgIGVudW0gTm9udGVybWluYWxzIHsgcm9vdCwgYSwgYiwgYyB9O1xuICogICAgICAgIHRoZW4gTm9udGVybWluYWxzIG11c3QgYmUgZXhwbGljaXRseSBwYXNzZWQgYXMgdGhpcyBydW50aW1lIHBhcmFtZXRlclxuICogICAgICAgICAgICAgIGNvbXBpbGUoZ3JhbW1hciwgTm9udGVybWluYWxzLCBOb250ZXJtaW5hbHMucm9vdCk7XG4gKiAgICAgICAgKGluIGFkZGl0aW9uIHRvIGJlaW5nIGltcGxpY2l0bHkgdXNlZCBmb3IgdGhlIHR5cGUgcGFyYW1ldGVyIE5UKVxuICogQHBhcmFtIHJvb3ROb250ZXJtaW5hbCB0aGUgZGVzaXJlZCByb290IG5vbnRlcm1pbmFsIGluIHRoZSBncmFtbWFyXG4gKiBAcmV0dXJuIGEgcGFyc2VyIGZvciB0aGUgZ2l2ZW4gZ3JhbW1hciB0aGF0IHdpbGwgc3RhcnQgcGFyc2luZyBhdCByb290Tm9udGVybWluYWwuXG4gKiBAdGhyb3dzIFBhcnNlRXJyb3IgaWYgdGhlIGdyYW1tYXIgaGFzIGEgc3ludGF4IGVycm9yXG4gKi9cbmZ1bmN0aW9uIGNvbXBpbGUoZ3JhbW1hciwgbm9udGVybWluYWxzLCByb290Tm9udGVybWluYWwpIHtcbiAgICBjb25zdCB7IHN0cmluZ1RvTm9udGVybWluYWwsIG5vbnRlcm1pbmFsVG9TdHJpbmcgfSA9IG1ha2VOb250ZXJtaW5hbENvbnZlcnRlcnMobm9udGVybWluYWxzKTtcbiAgICBjb25zdCBncmFtbWFyVHJlZSA9ICgoKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gZ3JhbW1hclBhcnNlci5wYXJzZShncmFtbWFyKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyb3cgKGUgaW5zdGFuY2VvZiB0eXBlc18xLkludGVybmFsUGFyc2VFcnJvcikgPyBuZXcgdHlwZXNfMS5HcmFtbWFyRXJyb3IoXCJncmFtbWFyIGRvZXNuJ3QgY29tcGlsZVwiLCBlKSA6IGU7XG4gICAgICAgIH1cbiAgICB9KSgpO1xuICAgIGNvbnN0IGRlZmluaXRpb25zID0gbmV3IE1hcCgpO1xuICAgIGNvbnN0IG5vbnRlcm1pbmFsc0RlZmluZWQgPSBuZXcgU2V0KCk7IC8vIG9uIGxlZnRoYW5kLXNpZGUgb2Ygc29tZSBwcm9kdWN0aW9uXG4gICAgY29uc3Qgbm9udGVybWluYWxzVXNlZCA9IG5ldyBTZXQoKTsgLy8gb24gcmlnaHRoYW5kLXNpZGUgb2Ygc29tZSBwcm9kdWN0aW9uXG4gICAgLy8gcHJvZHVjdGlvbnMgb3V0c2lkZSBAc2tpcCBibG9ja3NcbiAgICBtYWtlUHJvZHVjdGlvbnMoZ3JhbW1hclRyZWUuY2hpbGRyZW5CeU5hbWUoR3JhbW1hck5ULlBST0RVQ1RJT04pLCBudWxsKTtcbiAgICAvLyBwcm9kdWN0aW9ucyBpbnNpZGUgQHNraXAgYmxvY2tzXG4gICAgZm9yIChjb25zdCBza2lwQmxvY2sgb2YgZ3JhbW1hclRyZWUuY2hpbGRyZW5CeU5hbWUoR3JhbW1hck5ULlNLSVBCTE9DSykpIHtcbiAgICAgICAgbWFrZVNraXBCbG9jayhza2lwQmxvY2spO1xuICAgIH1cbiAgICBmb3IgKGNvbnN0IG50IG9mIG5vbnRlcm1pbmFsc1VzZWQpIHtcbiAgICAgICAgaWYgKCFub250ZXJtaW5hbHNEZWZpbmVkLmhhcyhudCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyB0eXBlc18xLkdyYW1tYXJFcnJvcihcImdyYW1tYXIgaXMgbWlzc2luZyBhIGRlZmluaXRpb24gZm9yIFwiICsgbm9udGVybWluYWxUb1N0cmluZyhudCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghbm9udGVybWluYWxzRGVmaW5lZC5oYXMocm9vdE5vbnRlcm1pbmFsKSkge1xuICAgICAgICB0aHJvdyBuZXcgdHlwZXNfMS5HcmFtbWFyRXJyb3IoXCJncmFtbWFyIGlzIG1pc3NpbmcgYSBkZWZpbml0aW9uIGZvciB0aGUgcm9vdCBub250ZXJtaW5hbCBcIiArIG5vbnRlcm1pbmFsVG9TdHJpbmcocm9vdE5vbnRlcm1pbmFsKSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgcGFyc2VyXzEuSW50ZXJuYWxQYXJzZXIoZGVmaW5pdGlvbnMsICgwLCBwYXJzZXJfMS5udCkocm9vdE5vbnRlcm1pbmFsLCBub250ZXJtaW5hbFRvU3RyaW5nKHJvb3ROb250ZXJtaW5hbCkpLCBub250ZXJtaW5hbFRvU3RyaW5nKTtcbiAgICBmdW5jdGlvbiBtYWtlUHJvZHVjdGlvbnMocHJvZHVjdGlvbnMsIHNraXApIHtcbiAgICAgICAgZm9yIChjb25zdCBwcm9kdWN0aW9uIG9mIHByb2R1Y3Rpb25zKSB7XG4gICAgICAgICAgICBjb25zdCBub250ZXJtaW5hbE5hbWUgPSBwcm9kdWN0aW9uLmNoaWxkcmVuQnlOYW1lKEdyYW1tYXJOVC5OT05URVJNSU5BTClbMF0udGV4dDtcbiAgICAgICAgICAgIGNvbnN0IG5vbnRlcm1pbmFsID0gc3RyaW5nVG9Ob250ZXJtaW5hbChub250ZXJtaW5hbE5hbWUpO1xuICAgICAgICAgICAgbm9udGVybWluYWxzRGVmaW5lZC5hZGQobm9udGVybWluYWwpO1xuICAgICAgICAgICAgbGV0IGV4cHJlc3Npb24gPSBtYWtlR3JhbW1hclRlcm0ocHJvZHVjdGlvbi5jaGlsZHJlbkJ5TmFtZShHcmFtbWFyTlQuVU5JT04pWzBdLCBza2lwKTtcbiAgICAgICAgICAgIGlmIChza2lwKVxuICAgICAgICAgICAgICAgIGV4cHJlc3Npb24gPSAoMCwgcGFyc2VyXzEuY2F0KShza2lwLCBleHByZXNzaW9uLCBza2lwKTtcbiAgICAgICAgICAgIGlmIChkZWZpbml0aW9ucy5oYXMobm9udGVybWluYWwpKSB7XG4gICAgICAgICAgICAgICAgLy8gZ3JhbW1hciBhbHJlYWR5IGhhcyBhIHByb2R1Y3Rpb24gZm9yIHRoaXMgbm9udGVybWluYWw7IG9yIGV4cHJlc3Npb24gb250byBpdFxuICAgICAgICAgICAgICAgIGRlZmluaXRpb25zLnNldChub250ZXJtaW5hbCwgKDAsIHBhcnNlcl8xLm9yKShkZWZpbml0aW9ucy5nZXQobm9udGVybWluYWwpLCBleHByZXNzaW9uKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWZpbml0aW9ucy5zZXQobm9udGVybWluYWwsIGV4cHJlc3Npb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIG1ha2VTa2lwQmxvY2soc2tpcEJsb2NrKSB7XG4gICAgICAgIGNvbnN0IG5vbnRlcm1pbmFsTmFtZSA9IHNraXBCbG9jay5jaGlsZHJlbkJ5TmFtZShHcmFtbWFyTlQuTk9OVEVSTUlOQUwpWzBdLnRleHQ7XG4gICAgICAgIGNvbnN0IG5vbnRlcm1pbmFsID0gc3RyaW5nVG9Ob250ZXJtaW5hbChub250ZXJtaW5hbE5hbWUpO1xuICAgICAgICBub250ZXJtaW5hbHNVc2VkLmFkZChub250ZXJtaW5hbCk7XG4gICAgICAgIGNvbnN0IHNraXBUZXJtID0gKDAsIHBhcnNlcl8xLnNraXApKCgwLCBwYXJzZXJfMS5udCkobm9udGVybWluYWwsIG5vbnRlcm1pbmFsTmFtZSkpO1xuICAgICAgICBtYWtlUHJvZHVjdGlvbnMoc2tpcEJsb2NrLmNoaWxkcmVuQnlOYW1lKEdyYW1tYXJOVC5QUk9EVUNUSU9OKSwgc2tpcFRlcm0pO1xuICAgIH1cbiAgICBmdW5jdGlvbiBtYWtlR3JhbW1hclRlcm0odHJlZSwgc2tpcCkge1xuICAgICAgICBzd2l0Y2ggKHRyZWUubmFtZSkge1xuICAgICAgICAgICAgY2FzZSBHcmFtbWFyTlQuVU5JT046IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGlsZGV4cHJzID0gdHJlZS5jaGlsZHJlbkJ5TmFtZShHcmFtbWFyTlQuQ09OQ0FURU5BVElPTikubWFwKGNoaWxkID0+IG1ha2VHcmFtbWFyVGVybShjaGlsZCwgc2tpcCkpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZGV4cHJzLmxlbmd0aCA9PSAxID8gY2hpbGRleHByc1swXSA6ICgwLCBwYXJzZXJfMS5vcikoLi4uY2hpbGRleHBycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIEdyYW1tYXJOVC5DT05DQVRFTkFUSU9OOiB7XG4gICAgICAgICAgICAgICAgbGV0IGNoaWxkZXhwcnMgPSB0cmVlLmNoaWxkcmVuQnlOYW1lKEdyYW1tYXJOVC5SRVBFVElUSU9OKS5tYXAoY2hpbGQgPT4gbWFrZUdyYW1tYXJUZXJtKGNoaWxkLCBza2lwKSk7XG4gICAgICAgICAgICAgICAgaWYgKHNraXApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaW5zZXJ0IHNraXAgYmV0d2VlbiBlYWNoIHBhaXIgb2YgY2hpbGRyZW5cbiAgICAgICAgICAgICAgICAgICAgbGV0IGNoaWxkcmVuV2l0aFNraXBzID0gW107XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgY2hpbGRleHBycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNoaWxkcmVuV2l0aFNraXBzLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW5XaXRoU2tpcHMucHVzaChza2lwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcmVuV2l0aFNraXBzLnB1c2goY2hpbGQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNoaWxkZXhwcnMgPSBjaGlsZHJlbldpdGhTa2lwcztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIChjaGlsZGV4cHJzLmxlbmd0aCA9PSAxKSA/IGNoaWxkZXhwcnNbMF0gOiAoMCwgcGFyc2VyXzEuY2F0KSguLi5jaGlsZGV4cHJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhc2UgR3JhbW1hck5ULlJFUEVUSVRJT046IHtcbiAgICAgICAgICAgICAgICBjb25zdCB1bml0ID0gbWFrZUdyYW1tYXJUZXJtKHRyZWUuY2hpbGRyZW5CeU5hbWUoR3JhbW1hck5ULlVOSVQpWzBdLCBza2lwKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvcCA9IHRyZWUuY2hpbGRyZW5CeU5hbWUoR3JhbW1hck5ULlJFUEVBVE9QRVJBVE9SKVswXTtcbiAgICAgICAgICAgICAgICBpZiAoIW9wKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bml0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdW5pdFdpdGhTa2lwID0gc2tpcCA/ICgwLCBwYXJzZXJfMS5jYXQpKHVuaXQsIHNraXApIDogdW5pdDtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnb3AgaXMnLCBvcCk7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAob3AudGV4dCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAnKic6IHJldHVybiAoMCwgcGFyc2VyXzEuc3RhcikodW5pdFdpdGhTa2lwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgJysnOiByZXR1cm4gKDAsIHBhcnNlcl8xLnBsdXMpKHVuaXRXaXRoU2tpcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlICc/JzogcmV0dXJuICgwLCBwYXJzZXJfMS5vcHRpb24pKHVuaXRXaXRoU2tpcCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb3AgaXMge24sbX0gb3Igb25lIG9mIGl0cyB2YXJpYW50c1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJhbmdlID0gb3AuY2hpbGRyZW5bMF07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChyYW5nZS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgR3JhbW1hck5ULk5VTUJFUjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgbiA9IHBhcnNlSW50KHJhbmdlLnRleHQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBwYXJzZXJfMS5yZXBlYXQpKHVuaXRXaXRoU2tpcCwgbmV3IHBhcnNlcl8xLkJldHdlZW4obiwgbikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBHcmFtbWFyTlQuUkFOR0U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG4gPSBwYXJzZUludChyYW5nZS5jaGlsZHJlblswXS50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG0gPSBwYXJzZUludChyYW5nZS5jaGlsZHJlblsxXS50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgcGFyc2VyXzEucmVwZWF0KSh1bml0V2l0aFNraXAsIG5ldyBwYXJzZXJfMS5CZXR3ZWVuKG4sIG0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgR3JhbW1hck5ULlVQUEVSQk9VTkQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG0gPSBwYXJzZUludChyYW5nZS5jaGlsZHJlblswXS50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgcGFyc2VyXzEucmVwZWF0KSh1bml0V2l0aFNraXAsIG5ldyBwYXJzZXJfMS5CZXR3ZWVuKDAsIG0pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgR3JhbW1hck5ULkxPV0VSQk9VTkQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG4gPSBwYXJzZUludChyYW5nZS5jaGlsZHJlblswXS50ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgcGFyc2VyXzEucmVwZWF0KSh1bml0V2l0aFNraXAsIG5ldyBwYXJzZXJfMS5BdExlYXN0KG4pKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludGVybmFsIGVycm9yOiB1bmtub3duIHJhbmdlOiAnICsgcmFuZ2UubmFtZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBHcmFtbWFyTlQuVU5JVDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbWFrZUdyYW1tYXJUZXJtKHRyZWUuY2hpbGRyZW5CeU5hbWUoR3JhbW1hck5ULk5PTlRFUk1JTkFMKVswXVxuICAgICAgICAgICAgICAgICAgICB8fCB0cmVlLmNoaWxkcmVuQnlOYW1lKEdyYW1tYXJOVC5URVJNSU5BTClbMF1cbiAgICAgICAgICAgICAgICAgICAgfHwgdHJlZS5jaGlsZHJlbkJ5TmFtZShHcmFtbWFyTlQuVU5JT04pWzBdLCBza2lwKTtcbiAgICAgICAgICAgIGNhc2UgR3JhbW1hck5ULk5PTlRFUk1JTkFMOiB7XG4gICAgICAgICAgICAgICAgY29uc3Qgbm9udGVybWluYWwgPSBzdHJpbmdUb05vbnRlcm1pbmFsKHRyZWUudGV4dCk7XG4gICAgICAgICAgICAgICAgbm9udGVybWluYWxzVXNlZC5hZGQobm9udGVybWluYWwpO1xuICAgICAgICAgICAgICAgIHJldHVybiAoMCwgcGFyc2VyXzEubnQpKG5vbnRlcm1pbmFsLCB0cmVlLnRleHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2FzZSBHcmFtbWFyTlQuVEVSTUlOQUw6XG4gICAgICAgICAgICAgICAgc3dpdGNoICh0cmVlLmNoaWxkcmVuWzBdLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBHcmFtbWFyTlQuUVVPVEVEU1RSSU5HOlxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuICgwLCBwYXJzZXJfMS5zdHIpKHN0cmlwUXVvdGVzQW5kUmVwbGFjZUVzY2FwZVNlcXVlbmNlcyh0cmVlLnRleHQpKTtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBHcmFtbWFyTlQuQ0hBUkFDVEVSU0VUOiAvLyBlLmcuIFthYmNdXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgR3JhbW1hck5ULkFOWUNIQVI6IC8vIGUuZy4gIC5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSBHcmFtbWFyTlQuQ0hBUkFDVEVSQ0xBU1M6IC8vIGUuZy4gIFxcZCAgXFxzICBcXHdcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAoMCwgcGFyc2VyXzEucmVnZXgpKHRyZWUudGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludGVybmFsIGVycm9yOiB1bmtub3duIGxpdGVyYWw6ICcgKyB0cmVlLmNoaWxkcmVuWzBdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW50ZXJuYWwgZXJyb3I6IHVua25vd24gZ3JhbW1hciBydWxlOiAnICsgdHJlZS5uYW1lKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdHJpcCBzdGFydGluZyBhbmQgZW5kaW5nIHF1b3Rlcy5cbiAgICAgKiBSZXBsYWNlIFxcdCwgXFxyLCBcXG4gd2l0aCB0aGVpciBjaGFyYWN0ZXIgY29kZXMuXG4gICAgICogUmVwbGFjZXMgYWxsIG90aGVyIFxceCB3aXRoIGxpdGVyYWwgeC5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBzdHJpcFF1b3Rlc0FuZFJlcGxhY2VFc2NhcGVTZXF1ZW5jZXMocykge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoc1swXSA9PSAnXCInIHx8IHNbMF0gPT0gXCInXCIpO1xuICAgICAgICBzID0gcy5zdWJzdHJpbmcoMSwgcy5sZW5ndGggLSAxKTtcbiAgICAgICAgcyA9IHMucmVwbGFjZSgvXFxcXCguKS9nLCAobWF0Y2gsIGVzY2FwZWRDaGFyKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGVzY2FwZWRDaGFyKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndCc6IHJldHVybiAnXFx0JztcbiAgICAgICAgICAgICAgICBjYXNlICdyJzogcmV0dXJuICdcXHInO1xuICAgICAgICAgICAgICAgIGNhc2UgJ24nOiByZXR1cm4gJ1xcbic7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIGVzY2FwZWRDaGFyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgfVxufVxuZXhwb3J0cy5jb21waWxlID0gY29tcGlsZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbXBpbGVyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5pbmRlbnQgPSBleHBvcnRzLnNuaXBwZXQgPSBleHBvcnRzLmVzY2FwZUZvclJlYWRpbmcgPSBleHBvcnRzLnRvQ29sdW1uID0gZXhwb3J0cy50b0xpbmUgPSBleHBvcnRzLmRlc2NyaWJlTG9jYXRpb24gPSBleHBvcnRzLm1ha2VFcnJvck1lc3NhZ2UgPSB2b2lkIDA7XG4vKipcbiAqIE1ha2UgYSBodW1hbi1yZWFkYWJsZSBlcnJvciBtZXNzYWdlIGV4cGxhaW5pbmcgYSBwYXJzZSBlcnJvciBhbmQgd2hlcmUgaXQgd2FzIGZvdW5kIGluIHRoZSBpbnB1dC5cbiAqIEBwYXJhbSBtZXNzYWdlIGJyaWVmIG1lc3NhZ2Ugc3RhdGluZyB3aGF0IGVycm9yIG9jY3VycmVkXG4gKiBAcGFyYW0gbm9udGVybWluYWxOYW1lIG5hbWUgb2YgZGVlcGVzdCBub250ZXJtaW5hbCB0aGF0IHBhcnNlciB3YXMgdHJ5aW5nIHRvIG1hdGNoIHdoZW4gcGFyc2UgZmFpbGVkXG4gKiBAcGFyYW0gZXhwZWN0ZWRUZXh0IGh1bWFuLXJlYWRhYmxlIGRlc2NyaXB0aW9uIG9mIHdoYXQgc3RyaW5nIGxpdGVyYWxzIHRoZSBwYXJzZXIgd2FzIGV4cGVjdGluZyB0aGVyZTtcbiAqICAgICAgICAgICAgZS5nLiBcIjtcIiwgXCJbIFxcclxcblxcdF1cIiwgXCIxfDJ8M1wiXG4gKiBAcGFyYW0gc3RyaW5nQmVpbmdQYXJzZWQgb3JpZ2luYWwgaW5wdXQgdG8gcGFyc2UoKVxuICogQHBhcmFtIHBvcyBvZmZzZXQgaW4gc3RyaW5nQmVpbmdQYXJzZWQgd2hlcmUgZXJyb3Igb2NjdXJyZWRcbiAqIEBwYXJhbSBuYW1lT2ZTdHJpbmdCZWluZ1BhcnNlZCBodW1hbi1yZWFkYWJsZSBkZXNjcmlwdGlvbiBvZiB3aGVyZSBzdHJpbmdCZWluZ1BhcnNlZCBjYW1lIGZyb207XG4gKiAgICAgICAgICAgICBlLmcuIFwiZ3JhbW1hclwiIGlmIHN0cmluZ0JlaW5nUGFyc2VkIHdhcyB0aGUgaW5wdXQgdG8gUGFyc2VyLmNvbXBpbGUoKSxcbiAqICAgICAgICAgICAgIG9yIFwic3RyaW5nIGJlaW5nIHBhcnNlZFwiIGlmIHN0cmluZ0JlaW5nUGFyc2VkIHdhcyB0aGUgaW5wdXQgdG8gUGFyc2VyLnBhcnNlKClcbiAqIEByZXR1cm4gYSBtdWx0aWxpbmUgaHVtYW4tcmVhZGFibGUgbWVzc2FnZSB0aGF0IHN0YXRlcyB0aGUgZXJyb3IsIGl0cyBsb2NhdGlvbiBpbiB0aGUgaW5wdXQsXG4gKiAgICAgICAgIHdoYXQgdGV4dCB3YXMgZXhwZWN0ZWQgYW5kIHdoYXQgdGV4dCB3YXMgYWN0dWFsbHkgZm91bmQuXG4gKi9cbmZ1bmN0aW9uIG1ha2VFcnJvck1lc3NhZ2UobWVzc2FnZSwgbm9udGVybWluYWxOYW1lLCBleHBlY3RlZFRleHQsIHN0cmluZ0JlaW5nUGFyc2VkLCBwb3MsIG5hbWVPZlN0cmluZ0JlaW5nUGFyc2VkKSB7XG4gICAgbGV0IHJlc3VsdCA9IG1lc3NhZ2U7XG4gICAgaWYgKHJlc3VsdC5sZW5ndGggPiAwKVxuICAgICAgICByZXN1bHQgKz0gXCJcXG5cIjtcbiAgICByZXN1bHQgKz1cbiAgICAgICAgXCJFcnJvciBhdCBcIiArIGRlc2NyaWJlTG9jYXRpb24oc3RyaW5nQmVpbmdQYXJzZWQsIHBvcykgKyBcIiBvZiBcIiArIG5hbWVPZlN0cmluZ0JlaW5nUGFyc2VkICsgXCJcXG5cIlxuICAgICAgICAgICAgKyBcIiAgdHJ5aW5nIHRvIG1hdGNoIFwiICsgbm9udGVybWluYWxOYW1lLnRvVXBwZXJDYXNlKCkgKyBcIlxcblwiXG4gICAgICAgICAgICArIFwiICBleHBlY3RlZCBcIiArIGVzY2FwZUZvclJlYWRpbmcoZXhwZWN0ZWRUZXh0LCBcIlwiKVxuICAgICAgICAgICAgKyAoKHN0cmluZ0JlaW5nUGFyc2VkLmxlbmd0aCA+IDApXG4gICAgICAgICAgICAgICAgPyBcIlxcbiAgIGJ1dCBzYXcgXCIgKyBzbmlwcGV0KHN0cmluZ0JlaW5nUGFyc2VkLCBwb3MpXG4gICAgICAgICAgICAgICAgOiBcIlwiKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0cy5tYWtlRXJyb3JNZXNzYWdlID0gbWFrZUVycm9yTWVzc2FnZTtcbi8qKlxuICogQHBhcmFtIHN0cmluZyB0byBkZXNjcmliZVxuICogQHBhcmFtIHBvcyBvZmZzZXQgaW4gc3RyaW5nLCAwPD1wb3M8c3RyaW5nLmxlbmd0aCgpXG4gKiBAcmV0dXJuIGEgaHVtYW4tcmVhZGFibGUgZGVzY3JpcHRpb24gb2YgdGhlIGxvY2F0aW9uIG9mIHRoZSBjaGFyYWN0ZXIgYXQgb2Zmc2V0IHBvcyBpbiBzdHJpbmdcbiAqICh1c2luZyBvZmZzZXQgYW5kL29yIGxpbmUvY29sdW1uIGlmIGFwcHJvcHJpYXRlKVxuICovXG5mdW5jdGlvbiBkZXNjcmliZUxvY2F0aW9uKHMsIHBvcykge1xuICAgIGxldCByZXN1bHQgPSBcIm9mZnNldCBcIiArIHBvcztcbiAgICBpZiAocy5pbmRleE9mKCdcXG4nKSAhPSAtMSkge1xuICAgICAgICByZXN1bHQgKz0gXCIgKGxpbmUgXCIgKyB0b0xpbmUocywgcG9zKSArIFwiIGNvbHVtbiBcIiArIHRvQ29sdW1uKHMsIHBvcykgKyBcIilcIjtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydHMuZGVzY3JpYmVMb2NhdGlvbiA9IGRlc2NyaWJlTG9jYXRpb247XG4vKipcbiAqIFRyYW5zbGF0ZXMgYSBzdHJpbmcgb2Zmc2V0IGludG8gYSBsaW5lIG51bWJlci5cbiAqIEBwYXJhbSBzdHJpbmcgaW4gd2hpY2ggb2Zmc2V0IG9jY3Vyc1xuICogQHBhcmFtIHBvcyBvZmZzZXQgaW4gc3RyaW5nLCAwPD1wb3M8c3RyaW5nLmxlbmd0aCgpXG4gKiBAcmV0dXJuIHRoZSAxLWJhc2VkIGxpbmUgbnVtYmVyIG9mIHRoZSBjaGFyYWN0ZXIgYXQgb2Zmc2V0IHBvcyBpbiBzdHJpbmcsXG4gKiBhcyBpZiBzdHJpbmcgd2VyZSBiZWluZyB2aWV3ZWQgaW4gYSB0ZXh0IGVkaXRvclxuICovXG5mdW5jdGlvbiB0b0xpbmUocywgcG9zKSB7XG4gICAgbGV0IGxpbmVDb3VudCA9IDE7XG4gICAgZm9yIChsZXQgbmV3bGluZSA9IHMuaW5kZXhPZignXFxuJyk7IG5ld2xpbmUgIT0gLTEgJiYgbmV3bGluZSA8IHBvczsgbmV3bGluZSA9IHMuaW5kZXhPZignXFxuJywgbmV3bGluZSArIDEpKSB7XG4gICAgICAgICsrbGluZUNvdW50O1xuICAgIH1cbiAgICByZXR1cm4gbGluZUNvdW50O1xufVxuZXhwb3J0cy50b0xpbmUgPSB0b0xpbmU7XG4vKipcbiAqIFRyYW5zbGF0ZXMgYSBzdHJpbmcgb2Zmc2V0IGludG8gYSBjb2x1bW4gbnVtYmVyLlxuICogQHBhcmFtIHN0cmluZyBpbiB3aGljaCBvZmZzZXQgb2NjdXJzXG4gKiBAcGFyYW0gcG9zIG9mZnNldCBpbiBzdHJpbmcsIDA8PXBvczxzdHJpbmcubGVuZ3RoKClcbiAqIEByZXR1cm4gdGhlIDEtYmFzZWQgY29sdW1uIG51bWJlciBvZiB0aGUgY2hhcmFjdGVyIGF0IG9mZnNldCBwb3MgaW4gc3RyaW5nLFxuICogYXMgaWYgc3RyaW5nIHdlcmUgYmVpbmcgdmlld2VkIGluIGEgdGV4dCBlZGl0b3Igd2l0aCB0YWIgc2l6ZSAxIChpLmUuIGEgdGFiIGlzIHRyZWF0ZWQgbGlrZSBhIHNwYWNlKVxuICovXG5mdW5jdGlvbiB0b0NvbHVtbihzLCBwb3MpIHtcbiAgICBjb25zdCBsYXN0TmV3bGluZUJlZm9yZVBvcyA9IHMubGFzdEluZGV4T2YoJ1xcbicsIHBvcyAtIDEpO1xuICAgIGNvbnN0IHRvdGFsU2l6ZU9mUHJlY2VkaW5nTGluZXMgPSAobGFzdE5ld2xpbmVCZWZvcmVQb3MgIT0gLTEpID8gbGFzdE5ld2xpbmVCZWZvcmVQb3MgKyAxIDogMDtcbiAgICByZXR1cm4gcG9zIC0gdG90YWxTaXplT2ZQcmVjZWRpbmdMaW5lcyArIDE7XG59XG5leHBvcnRzLnRvQ29sdW1uID0gdG9Db2x1bW47XG4vKipcbiogUmVwbGFjZSBjb21tb24gdW5wcmludGFibGUgY2hhcmFjdGVycyBieSB0aGVpciBlc2NhcGUgY29kZXMsIGZvciBodW1hbiByZWFkaW5nLlxuKiBTaG91bGQgYmUgaWRlbXBvdGVudCwgaS5lLiBpZiB4ID0gZXNjYXBlRm9yUmVhZGluZyh5KSwgdGhlbiB4LmVxdWFscyhlc2NhcGVGb3JSZWFkaW5nKHgpKS5cbiogQHBhcmFtIHN0cmluZyB0byBlc2NhcGVcbiogQHBhcmFtIHF1b3RlIHF1b3RlcyB0byBwdXQgYXJvdW5kIHN0cmluZywgb3IgXCJcIiBpZiBubyBxdW90ZXMgcmVxdWlyZWRcbiogQHJldHVybiBzdHJpbmcgd2l0aCBlc2NhcGUgY29kZXMgcmVwbGFjZWQsIHByZWNlZGVkIGFuZCBmb2xsb3dlZCBieSBxdW90ZSwgd2l0aCBhIGh1bWFuLXJlYWRhYmxlIGxlZ2VuZCBhcHBlbmRlZCB0byB0aGUgZW5kXG4qICAgICAgICAgZXhwbGFpbmluZyB3aGF0IHRoZSByZXBsYWNlbWVudCBjaGFyYWN0ZXJzIG1lYW4uXG4qL1xuZnVuY3Rpb24gZXNjYXBlRm9yUmVhZGluZyhzLCBxdW90ZSkge1xuICAgIGxldCByZXN1bHQgPSBzO1xuICAgIGNvbnN0IGxlZ2VuZCA9IFtdO1xuICAgIGZvciAoY29uc3QgeyB1bnByaW50YWJsZUNoYXIsIGh1bWFuUmVhZGFibGVWZXJzaW9uLCBkZXNjcmlwdGlvbiB9IG9mIEVTQ0FQRVMpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5pbmNsdWRlcyh1bnByaW50YWJsZUNoYXIpKSB7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZSh1bnByaW50YWJsZUNoYXIsIGh1bWFuUmVhZGFibGVWZXJzaW9uKTtcbiAgICAgICAgICAgIGxlZ2VuZC5wdXNoKGh1bWFuUmVhZGFibGVWZXJzaW9uICsgXCIgbWVhbnMgXCIgKyBkZXNjcmlwdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0ID0gcXVvdGUgKyByZXN1bHQgKyBxdW90ZTtcbiAgICBpZiAobGVnZW5kLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcmVzdWx0ICs9IFwiICh3aGVyZSBcIiArIGxlZ2VuZC5qb2luKFwiLCBcIikgKyBcIilcIjtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydHMuZXNjYXBlRm9yUmVhZGluZyA9IGVzY2FwZUZvclJlYWRpbmc7XG5jb25zdCBFU0NBUEVTID0gW1xuICAgIHtcbiAgICAgICAgdW5wcmludGFibGVDaGFyOiBcIlxcblwiLFxuICAgICAgICBodW1hblJlYWRhYmxlVmVyc2lvbjogXCJcXHUyNDI0XCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIm5ld2xpbmVcIlxuICAgIH0sXG4gICAge1xuICAgICAgICB1bnByaW50YWJsZUNoYXI6IFwiXFxyXCIsXG4gICAgICAgIGh1bWFuUmVhZGFibGVWZXJzaW9uOiBcIlxcdTI0MERcIixcbiAgICAgICAgZGVzY3JpcHRpb246IFwiY2FycmlhZ2UgcmV0dXJuXCJcbiAgICB9LFxuICAgIHtcbiAgICAgICAgdW5wcmludGFibGVDaGFyOiBcIlxcdFwiLFxuICAgICAgICBodW1hblJlYWRhYmxlVmVyc2lvbjogXCJcXHUyMUU1XCIsXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcInRhYlwiXG4gICAgfSxcbl07XG4vKipcbiAqIEBwYXJhbSBzdHJpbmcgdG8gc2hvcnRlblxuICogQHBhcmFtIHBvcyBvZmZzZXQgaW4gc3RyaW5nLCAwPD1wb3M8c3RyaW5nLmxlbmd0aCgpXG4gKiBAcmV0dXJuIGEgc2hvcnQgc25pcHBldCBvZiB0aGUgcGFydCBvZiBzdHJpbmcgc3RhcnRpbmcgYXQgb2Zmc2V0IHBvcyxcbiAqIGluIGh1bWFuLXJlYWRhYmxlIGZvcm1cbiAqL1xuZnVuY3Rpb24gc25pcHBldChzLCBwb3MpIHtcbiAgICBjb25zdCBtYXhDaGFyc1RvU2hvdyA9IDEwO1xuICAgIGNvbnN0IGVuZCA9IE1hdGgubWluKHBvcyArIG1heENoYXJzVG9TaG93LCBzLmxlbmd0aCk7XG4gICAgbGV0IHJlc3VsdCA9IHMuc3Vic3RyaW5nKHBvcywgZW5kKSArIChlbmQgPCBzLmxlbmd0aCA/IFwiLi4uXCIgOiBcIlwiKTtcbiAgICBpZiAocmVzdWx0Lmxlbmd0aCA9PSAwKVxuICAgICAgICByZXN1bHQgPSBcImVuZCBvZiBzdHJpbmdcIjtcbiAgICByZXR1cm4gZXNjYXBlRm9yUmVhZGluZyhyZXN1bHQsIFwiXCIpO1xufVxuZXhwb3J0cy5zbmlwcGV0ID0gc25pcHBldDtcbi8qKlxuICogSW5kZW50IGEgbXVsdGktbGluZSBzdHJpbmcgYnkgcHJlY2VkaW5nIGVhY2ggbGluZSB3aXRoIHByZWZpeC5cbiAqIEBwYXJhbSBzdHJpbmcgc3RyaW5nIHRvIGluZGVudFxuICogQHBhcmFtIHByZWZpeCBwcmVmaXggdG8gdXNlIGZvciBpbmRlbnRpbmdcbiAqIEByZXR1cm4gc3RyaW5nIHdpdGggcHJlZml4IGluc2VydGVkIGF0IHRoZSBzdGFydCBvZiBlYWNoIGxpbmVcbiAqL1xuZnVuY3Rpb24gaW5kZW50KHMsIHByZWZpeCkge1xuICAgIGxldCByZXN1bHQgPSBcIlwiO1xuICAgIGxldCBjaGFyc0NvcGllZCA9IDA7XG4gICAgZG8ge1xuICAgICAgICBjb25zdCBuZXdsaW5lID0gcy5pbmRleE9mKCdcXG4nLCBjaGFyc0NvcGllZCk7XG4gICAgICAgIGNvbnN0IGVuZE9mTGluZSA9IG5ld2xpbmUgIT0gLTEgPyBuZXdsaW5lICsgMSA6IHMubGVuZ3RoO1xuICAgICAgICByZXN1bHQgKz0gcHJlZml4ICsgcy5zdWJzdHJpbmcoY2hhcnNDb3BpZWQsIGVuZE9mTGluZSk7XG4gICAgICAgIGNoYXJzQ29waWVkID0gZW5kT2ZMaW5lO1xuICAgIH0gd2hpbGUgKGNoYXJzQ29waWVkIDwgcy5sZW5ndGgpO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnRzLmluZGVudCA9IGluZGVudDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRpc3BsYXkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlBhcnNlclN0YXRlID0gZXhwb3J0cy5GYWlsZWRQYXJzZSA9IGV4cG9ydHMuU3VjY2Vzc2Z1bFBhcnNlID0gZXhwb3J0cy5JbnRlcm5hbFBhcnNlciA9IGV4cG9ydHMuZmFpbGZhc3QgPSBleHBvcnRzLnNraXAgPSBleHBvcnRzLm9wdGlvbiA9IGV4cG9ydHMucGx1cyA9IGV4cG9ydHMuc3RhciA9IGV4cG9ydHMucmVwZWF0ID0gZXhwb3J0cy5aRVJPX09SX09ORSA9IGV4cG9ydHMuT05FX09SX01PUkUgPSBleHBvcnRzLlpFUk9fT1JfTU9SRSA9IGV4cG9ydHMuQmV0d2VlbiA9IGV4cG9ydHMuQXRMZWFzdCA9IGV4cG9ydHMub3IgPSBleHBvcnRzLmNhdCA9IGV4cG9ydHMuc3RyID0gZXhwb3J0cy5yZWdleCA9IGV4cG9ydHMubnQgPSB2b2lkIDA7XG5jb25zdCBhc3NlcnRfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwiYXNzZXJ0XCIpKTtcbmNvbnN0IHR5cGVzXzEgPSByZXF1aXJlKFwiLi90eXBlc1wiKTtcbmNvbnN0IHBhcnNldHJlZV8xID0gcmVxdWlyZShcIi4vcGFyc2V0cmVlXCIpO1xuZnVuY3Rpb24gbnQobm9udGVybWluYWwsIG5vbnRlcm1pbmFsTmFtZSkge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhcnNlKHMsIHBvcywgZGVmaW5pdGlvbnMsIHN0YXRlKSB7XG4gICAgICAgICAgICBjb25zdCBndCA9IGRlZmluaXRpb25zLmdldChub250ZXJtaW5hbCk7XG4gICAgICAgICAgICBpZiAoZ3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgdHlwZXNfMS5HcmFtbWFyRXJyb3IoXCJub250ZXJtaW5hbCBoYXMgbm8gZGVmaW5pdGlvbjogXCIgKyBub250ZXJtaW5hbE5hbWUpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihcImVudGVyaW5nXCIsIG5vbnRlcm1pbmFsTmFtZSk7XG4gICAgICAgICAgICBzdGF0ZS5lbnRlcihwb3MsIG5vbnRlcm1pbmFsKTtcbiAgICAgICAgICAgIGxldCBwciA9IGd0LnBhcnNlKHMsIHBvcywgZGVmaW5pdGlvbnMsIHN0YXRlKTtcbiAgICAgICAgICAgIHN0YXRlLmxlYXZlKG5vbnRlcm1pbmFsKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUuZXJyb3IoXCJsZWF2aW5nXCIsIG5vbnRlcm1pbmFsTmFtZSwgXCJ3aXRoIHJlc3VsdFwiLCBwcik7XG4gICAgICAgICAgICBpZiAoIXByLmZhaWxlZCAmJiAhc3RhdGUuaXNFbXB0eSgpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdHJlZSA9IHByLnRyZWU7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3VHJlZSA9IHN0YXRlLm1ha2VQYXJzZVRyZWUodHJlZS5zdGFydCwgdHJlZS50ZXh0LCBbdHJlZV0pO1xuICAgICAgICAgICAgICAgIHByID0gcHIucmVwbGFjZVRyZWUobmV3VHJlZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcHI7XG4gICAgICAgIH0sXG4gICAgICAgIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5vbnRlcm1pbmFsTmFtZTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLm50ID0gbnQ7XG5mdW5jdGlvbiByZWdleChyZWdleFNvdXJjZSkge1xuICAgIGxldCByZWdleCA9IG5ldyBSZWdFeHAoJ14nICsgcmVnZXhTb3VyY2UgKyAnJCcsICdzJyk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFyc2UocywgcG9zLCBkZWZpbml0aW9ucywgc3RhdGUpIHtcbiAgICAgICAgICAgIGlmIChwb3MgPj0gcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUubWFrZUZhaWxlZFBhcnNlKHBvcywgcmVnZXhTb3VyY2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgbCA9IHMuc3Vic3RyaW5nKHBvcywgcG9zICsgMSk7XG4gICAgICAgICAgICBpZiAocmVnZXgudGVzdChsKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZS5tYWtlU3VjY2Vzc2Z1bFBhcnNlKHBvcywgcG9zICsgMSwgbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RhdGUubWFrZUZhaWxlZFBhcnNlKHBvcywgcmVnZXhTb3VyY2UpO1xuICAgICAgICB9LFxuICAgICAgICB0b1N0cmluZygpIHtcbiAgICAgICAgICAgIHJldHVybiByZWdleFNvdXJjZTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLnJlZ2V4ID0gcmVnZXg7XG5mdW5jdGlvbiBzdHIoc3RyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFyc2UocywgcG9zLCBkZWZpbml0aW9ucywgc3RhdGUpIHtcbiAgICAgICAgICAgIGNvbnN0IG5ld3BvcyA9IHBvcyArIHN0ci5sZW5ndGg7XG4gICAgICAgICAgICBpZiAobmV3cG9zID4gcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGUubWFrZUZhaWxlZFBhcnNlKHBvcywgc3RyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGwgPSBzLnN1YnN0cmluZyhwb3MsIG5ld3Bvcyk7XG4gICAgICAgICAgICBpZiAobCA9PT0gc3RyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlLm1ha2VTdWNjZXNzZnVsUGFyc2UocG9zLCBuZXdwb3MsIGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLm1ha2VGYWlsZWRQYXJzZShwb3MsIHN0cik7XG4gICAgICAgIH0sXG4gICAgICAgIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgcmV0dXJuIFwiJ1wiICsgc3RyLnJlcGxhY2UoLydcXHJcXG5cXHRcXFxcLywgXCJcXFxcJCZcIikgKyBcIidcIjtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLnN0ciA9IHN0cjtcbmZ1bmN0aW9uIGNhdCguLi50ZXJtcykge1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhcnNlKHMsIHBvcywgZGVmaW5pdGlvbnMsIHN0YXRlKSB7XG4gICAgICAgICAgICBsZXQgcHJvdXQgPSBzdGF0ZS5tYWtlU3VjY2Vzc2Z1bFBhcnNlKHBvcywgcG9zKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZ3Qgb2YgdGVybXMpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwciA9IGd0LnBhcnNlKHMsIHBvcywgZGVmaW5pdGlvbnMsIHN0YXRlKTtcbiAgICAgICAgICAgICAgICBpZiAocHIuZmFpbGVkKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHI7XG4gICAgICAgICAgICAgICAgcG9zID0gcHIucG9zO1xuICAgICAgICAgICAgICAgIHByb3V0ID0gcHJvdXQubWVyZ2VSZXN1bHQocHIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHByb3V0O1xuICAgICAgICB9LFxuICAgICAgICB0b1N0cmluZygpIHtcbiAgICAgICAgICAgIHJldHVybiBcIihcIiArIHRlcm1zLm1hcCh0ZXJtID0+IHRlcm0udG9TdHJpbmcoKSkuam9pbihcIiBcIikgKyBcIilcIjtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLmNhdCA9IGNhdDtcbi8qKlxuICogQHBhcmFtIGNob2ljZXMgbXVzdCBiZSBub25lbXB0eVxuICovXG5mdW5jdGlvbiBvciguLi5jaG9pY2VzKSB7XG4gICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGNob2ljZXMubGVuZ3RoID4gMCk7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFyc2UocywgcG9zLCBkZWZpbml0aW9ucywgc3RhdGUpIHtcbiAgICAgICAgICAgIGNvbnN0IHN1Y2Nlc3NlcyA9IFtdO1xuICAgICAgICAgICAgY29uc3QgZmFpbHVyZXMgPSBbXTtcbiAgICAgICAgICAgIGNob2ljZXMuZm9yRWFjaCgoY2hvaWNlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gY2hvaWNlLnBhcnNlKHMsIHBvcywgZGVmaW5pdGlvbnMsIHN0YXRlKTtcbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0LmZhaWxlZCkge1xuICAgICAgICAgICAgICAgICAgICBmYWlsdXJlcy5wdXNoKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzZXMucHVzaChyZXN1bHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgaWYgKHN1Y2Nlc3Nlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbG9uZ2VzdFN1Y2Nlc3NlcyA9IGxvbmdlc3RSZXN1bHRzKHN1Y2Nlc3Nlcyk7XG4gICAgICAgICAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKGxvbmdlc3RTdWNjZXNzZXMubGVuZ3RoID4gMCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGxvbmdlc3RTdWNjZXNzZXNbMF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBsb25nZXN0RmFpbHVyZXMgPSBsb25nZXN0UmVzdWx0cyhmYWlsdXJlcyk7XG4gICAgICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkobG9uZ2VzdEZhaWx1cmVzLmxlbmd0aCA+IDApO1xuICAgICAgICAgICAgcmV0dXJuIHN0YXRlLm1ha2VGYWlsZWRQYXJzZShsb25nZXN0RmFpbHVyZXNbMF0ucG9zLCBsb25nZXN0RmFpbHVyZXMubWFwKChyZXN1bHQpID0+IHJlc3VsdC5leHBlY3RlZFRleHQpLmpvaW4oXCJ8XCIpKTtcbiAgICAgICAgfSxcbiAgICAgICAgdG9TdHJpbmcoKSB7XG4gICAgICAgICAgICByZXR1cm4gXCIoXCIgKyBjaG9pY2VzLm1hcChjaG9pY2UgPT4gY2hvaWNlLnRvU3RyaW5nKCkpLmpvaW4oXCJ8XCIpICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5vciA9IG9yO1xuY2xhc3MgQXRMZWFzdCB7XG4gICAgY29uc3RydWN0b3IobWluKSB7XG4gICAgICAgIHRoaXMubWluID0gbWluO1xuICAgIH1cbiAgICB0b29Mb3cobikgeyByZXR1cm4gbiA8IHRoaXMubWluOyB9XG4gICAgdG9vSGlnaChuKSB7IHJldHVybiBmYWxzZTsgfVxuICAgIHRvU3RyaW5nKCkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMubWluKSB7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBcIipcIjtcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIFwiK1wiO1xuICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIFwie1wiICsgdGhpcy5taW4gKyBcIix9XCI7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLkF0TGVhc3QgPSBBdExlYXN0O1xuY2xhc3MgQmV0d2VlbiB7XG4gICAgY29uc3RydWN0b3IobWluLCBtYXgpIHtcbiAgICAgICAgdGhpcy5taW4gPSBtaW47XG4gICAgICAgIHRoaXMubWF4ID0gbWF4O1xuICAgIH1cbiAgICB0b29Mb3cobikgeyByZXR1cm4gbiA8IHRoaXMubWluOyB9XG4gICAgdG9vSGlnaChuKSB7IHJldHVybiBuID4gdGhpcy5tYXg7IH1cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgaWYgKHRoaXMubWluID09IDApIHtcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5tYXggPT0gMSkgPyBcIj9cIiA6IFwieyxcIiArIHRoaXMubWF4ICsgXCJ9XCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gXCJ7XCIgKyB0aGlzLm1pbiArIFwiLFwiICsgdGhpcy5tYXggKyBcIn1cIjtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuQmV0d2VlbiA9IEJldHdlZW47XG5leHBvcnRzLlpFUk9fT1JfTU9SRSA9IG5ldyBBdExlYXN0KDApO1xuZXhwb3J0cy5PTkVfT1JfTU9SRSA9IG5ldyBBdExlYXN0KDEpO1xuZXhwb3J0cy5aRVJPX09SX09ORSA9IG5ldyBCZXR3ZWVuKDAsIDEpO1xuZnVuY3Rpb24gcmVwZWF0KGd0LCBob3dtYW55KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFyc2UocywgcG9zLCBkZWZpbml0aW9ucywgc3RhdGUpIHtcbiAgICAgICAgICAgIGxldCBwcm91dCA9IHN0YXRlLm1ha2VTdWNjZXNzZnVsUGFyc2UocG9zLCBwb3MpO1xuICAgICAgICAgICAgZm9yIChsZXQgdGltZXNNYXRjaGVkID0gMDsgaG93bWFueS50b29Mb3codGltZXNNYXRjaGVkKSB8fCAhaG93bWFueS50b29IaWdoKHRpbWVzTWF0Y2hlZCArIDEpOyArK3RpbWVzTWF0Y2hlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHByID0gZ3QucGFyc2UocywgcG9zLCBkZWZpbml0aW9ucywgc3RhdGUpO1xuICAgICAgICAgICAgICAgIGlmIChwci5mYWlsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gbm8gbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgaWYgKGhvd21hbnkudG9vTG93KHRpbWVzTWF0Y2hlZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBwcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvdXQuYWRkTGFzdEZhaWx1cmUocHIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHByLnBvcyA9PSBwb3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoZWQgdGhlIGVtcHR5IHN0cmluZywgYW5kIHdlIGFscmVhZHkgaGF2ZSBlbm91Z2guXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSBtYXkgZ2V0IGludG8gYW4gaW5maW5pdGUgbG9vcCBpZiBob3dtYW55LnRvb0hpZ2goKSBuZXZlciByZXR1cm5zIGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc28gcmV0dXJuIHN1Y2Nlc3NmdWwgbWF0Y2ggYXQgdGhpcyBwb2ludFxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3V0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIG90aGVyd2lzZSBhZHZhbmNlIHRoZSBwb3NpdGlvbiBhbmQgbWVyZ2UgcHIgaW50byBwcm91dFxuICAgICAgICAgICAgICAgICAgICBwb3MgPSBwci5wb3M7XG4gICAgICAgICAgICAgICAgICAgIHByb3V0ID0gcHJvdXQubWVyZ2VSZXN1bHQocHIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwcm91dDtcbiAgICAgICAgfSxcbiAgICAgICAgdG9TdHJpbmcoKSB7XG4gICAgICAgICAgICByZXR1cm4gZ3QudG9TdHJpbmcoKSArIGhvd21hbnkudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgIH07XG59XG5leHBvcnRzLnJlcGVhdCA9IHJlcGVhdDtcbmZ1bmN0aW9uIHN0YXIoZ3QpIHtcbiAgICByZXR1cm4gcmVwZWF0KGd0LCBleHBvcnRzLlpFUk9fT1JfTU9SRSk7XG59XG5leHBvcnRzLnN0YXIgPSBzdGFyO1xuZnVuY3Rpb24gcGx1cyhndCkge1xuICAgIHJldHVybiByZXBlYXQoZ3QsIGV4cG9ydHMuT05FX09SX01PUkUpO1xufVxuZXhwb3J0cy5wbHVzID0gcGx1cztcbmZ1bmN0aW9uIG9wdGlvbihndCkge1xuICAgIHJldHVybiByZXBlYXQoZ3QsIGV4cG9ydHMuWkVST19PUl9PTkUpO1xufVxuZXhwb3J0cy5vcHRpb24gPSBvcHRpb247XG5mdW5jdGlvbiBza2lwKG5vbnRlcm1pbmFsKSB7XG4gICAgY29uc3QgcmVwZXRpdGlvbiA9IHN0YXIobm9udGVybWluYWwpO1xuICAgIHJldHVybiB7XG4gICAgICAgIHBhcnNlKHMsIHBvcywgZGVmaW5pdGlvbnMsIHN0YXRlKSB7XG4gICAgICAgICAgICBzdGF0ZS5lbnRlclNraXAoKTtcbiAgICAgICAgICAgIGxldCBwciA9IHJlcGV0aXRpb24ucGFyc2UocywgcG9zLCBkZWZpbml0aW9ucywgc3RhdGUpO1xuICAgICAgICAgICAgc3RhdGUubGVhdmVTa2lwKCk7XG4gICAgICAgICAgICBpZiAocHIuZmFpbGVkKSB7XG4gICAgICAgICAgICAgICAgLy8gc3VjY2VlZCBhbnl3YXlcbiAgICAgICAgICAgICAgICBwciA9IHN0YXRlLm1ha2VTdWNjZXNzZnVsUGFyc2UocG9zLCBwb3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHByO1xuICAgICAgICB9LFxuICAgICAgICB0b1N0cmluZygpIHtcbiAgICAgICAgICAgIHJldHVybiBcIig/PHNraXA+XCIgKyByZXBldGl0aW9uICsgXCIpXCI7XG4gICAgICAgIH1cbiAgICB9O1xufVxuZXhwb3J0cy5za2lwID0gc2tpcDtcbmZ1bmN0aW9uIGZhaWxmYXN0KGd0KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcGFyc2UocywgcG9zLCBkZWZpbml0aW9ucywgc3RhdGUpIHtcbiAgICAgICAgICAgIGxldCBwciA9IGd0LnBhcnNlKHMsIHBvcywgZGVmaW5pdGlvbnMsIHN0YXRlKTtcbiAgICAgICAgICAgIGlmIChwci5mYWlsZWQpXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IHR5cGVzXzEuSW50ZXJuYWxQYXJzZUVycm9yKFwiXCIsIHByLm5vbnRlcm1pbmFsTmFtZSwgcHIuZXhwZWN0ZWRUZXh0LCBcIlwiLCBwci5wb3MpO1xuICAgICAgICAgICAgcmV0dXJuIHByO1xuICAgICAgICB9LFxuICAgICAgICB0b1N0cmluZygpIHtcbiAgICAgICAgICAgIHJldHVybiAnZmFpbGZhc3QoJyArIGd0ICsgJyknO1xuICAgICAgICB9XG4gICAgfTtcbn1cbmV4cG9ydHMuZmFpbGZhc3QgPSBmYWlsZmFzdDtcbmNsYXNzIEludGVybmFsUGFyc2VyIHtcbiAgICBjb25zdHJ1Y3RvcihkZWZpbml0aW9ucywgc3RhcnQsIG5vbnRlcm1pbmFsVG9TdHJpbmcpIHtcbiAgICAgICAgdGhpcy5kZWZpbml0aW9ucyA9IGRlZmluaXRpb25zO1xuICAgICAgICB0aGlzLnN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgIHRoaXMubm9udGVybWluYWxUb1N0cmluZyA9IG5vbnRlcm1pbmFsVG9TdHJpbmc7XG4gICAgICAgIHRoaXMuY2hlY2tSZXAoKTtcbiAgICB9XG4gICAgY2hlY2tSZXAoKSB7XG4gICAgfVxuICAgIHBhcnNlKHRleHRUb1BhcnNlKSB7XG4gICAgICAgIGxldCBwciA9ICgoKSA9PiB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN0YXJ0LnBhcnNlKHRleHRUb1BhcnNlLCAwLCB0aGlzLmRlZmluaXRpb25zLCBuZXcgUGFyc2VyU3RhdGUodGhpcy5ub250ZXJtaW5hbFRvU3RyaW5nKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgdHlwZXNfMS5JbnRlcm5hbFBhcnNlRXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0aHJvdyB0aGUgZXhjZXB0aW9uLCBhdWdtZW50ZWQgYnkgdGhlIG9yaWdpbmFsIHRleHQsIHNvIHRoYXQgdGhlIGVycm9yIG1lc3NhZ2UgaXMgYmV0dGVyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyB0eXBlc18xLkludGVybmFsUGFyc2VFcnJvcihcInN0cmluZyBkb2VzIG5vdCBtYXRjaCBncmFtbWFyXCIsIGUubm9udGVybWluYWxOYW1lLCBlLmV4cGVjdGVkVGV4dCwgdGV4dFRvUGFyc2UsIGUucG9zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KSgpO1xuICAgICAgICBpZiAocHIuZmFpbGVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgdHlwZXNfMS5JbnRlcm5hbFBhcnNlRXJyb3IoXCJzdHJpbmcgZG9lcyBub3QgbWF0Y2ggZ3JhbW1hclwiLCBwci5ub250ZXJtaW5hbE5hbWUsIHByLmV4cGVjdGVkVGV4dCwgdGV4dFRvUGFyc2UsIHByLnBvcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByLnBvcyA8IHRleHRUb1BhcnNlLmxlbmd0aCkge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9IFwib25seSBwYXJ0IG9mIHRoZSBzdHJpbmcgbWF0Y2hlcyB0aGUgZ3JhbW1hcjsgdGhlIHJlc3QgZGlkIG5vdCBwYXJzZVwiO1xuICAgICAgICAgICAgdGhyb3cgKHByLmxhc3RGYWlsdXJlXG4gICAgICAgICAgICAgICAgPyBuZXcgdHlwZXNfMS5JbnRlcm5hbFBhcnNlRXJyb3IobWVzc2FnZSwgcHIubGFzdEZhaWx1cmUubm9udGVybWluYWxOYW1lLCBwci5sYXN0RmFpbHVyZS5leHBlY3RlZFRleHQsIHRleHRUb1BhcnNlLCBwci5sYXN0RmFpbHVyZS5wb3MpXG4gICAgICAgICAgICAgICAgOiBuZXcgdHlwZXNfMS5JbnRlcm5hbFBhcnNlRXJyb3IobWVzc2FnZSwgdGhpcy5zdGFydC50b1N0cmluZygpLCBcImVuZCBvZiBzdHJpbmdcIiwgdGV4dFRvUGFyc2UsIHByLnBvcykpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwci50cmVlO1xuICAgIH1cbiAgICA7XG4gICAgdG9TdHJpbmcoKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuZGVmaW5pdGlvbnMsIChbbm9udGVybWluYWwsIHJ1bGVdKSA9PiB0aGlzLm5vbnRlcm1pbmFsVG9TdHJpbmcobm9udGVybWluYWwpICsgJzo6PScgKyBydWxlICsgJzsnKS5qb2luKFwiXFxuXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuSW50ZXJuYWxQYXJzZXIgPSBJbnRlcm5hbFBhcnNlcjtcbmNsYXNzIFN1Y2Nlc3NmdWxQYXJzZSB7XG4gICAgY29uc3RydWN0b3IocG9zLCB0cmVlLCBsYXN0RmFpbHVyZSkge1xuICAgICAgICB0aGlzLnBvcyA9IHBvcztcbiAgICAgICAgdGhpcy50cmVlID0gdHJlZTtcbiAgICAgICAgdGhpcy5sYXN0RmFpbHVyZSA9IGxhc3RGYWlsdXJlO1xuICAgICAgICB0aGlzLmZhaWxlZCA9IGZhbHNlO1xuICAgIH1cbiAgICByZXBsYWNlVHJlZSh0cmVlKSB7XG4gICAgICAgIHJldHVybiBuZXcgU3VjY2Vzc2Z1bFBhcnNlKHRoaXMucG9zLCB0cmVlLCB0aGlzLmxhc3RGYWlsdXJlKTtcbiAgICB9XG4gICAgbWVyZ2VSZXN1bHQodGhhdCkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkoIXRoYXQuZmFpbGVkKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnbWVyZ2luZycsIHRoaXMsICd3aXRoJywgdGhhdCk7XG4gICAgICAgIHJldHVybiBuZXcgU3VjY2Vzc2Z1bFBhcnNlKHRoYXQucG9zLCB0aGlzLnRyZWUuY29uY2F0KHRoYXQudHJlZSksIGxhdGVyUmVzdWx0KHRoaXMubGFzdEZhaWx1cmUsIHRoYXQubGFzdEZhaWx1cmUpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogS2VlcCB0cmFjayBvZiBhIGZhaWxpbmcgcGFyc2UgcmVzdWx0IHRoYXQgcHJldmVudGVkIHRoaXMgdHJlZSBmcm9tIG1hdGNoaW5nIG1vcmUgb2YgdGhlIGlucHV0IHN0cmluZy5cbiAgICAgKiBUaGlzIGRlZXBlciBmYWlsdXJlIGlzIHVzdWFsbHkgbW9yZSBpbmZvcm1hdGl2ZSB0byB0aGUgdXNlciwgc28gd2UnbGwgZGlzcGxheSBpdCBpbiB0aGUgZXJyb3IgbWVzc2FnZS5cbiAgICAgKiBAcGFyYW0gbmV3TGFzdEZhaWx1cmUgYSBmYWlsaW5nIFBhcnNlUmVzdWx0PE5UPiB0aGF0IHN0b3BwZWQgdGhpcyB0cmVlJ3MgcGFyc2UgKGJ1dCBkaWRuJ3QgcHJldmVudCB0aGlzIGZyb20gc3VjY2VlZGluZylcbiAgICAgKiBAcmV0dXJuIGEgbmV3IFBhcnNlUmVzdWx0PE5UPiBpZGVudGljYWwgdG8gdGhpcyBvbmUgYnV0IHdpdGggbGFzdEZhaWx1cmUgYWRkZWQgdG8gaXRcbiAgICAgKi9cbiAgICBhZGRMYXN0RmFpbHVyZShuZXdMYXN0RmFpbHVyZSkge1xuICAgICAgICAoMCwgYXNzZXJ0XzEuZGVmYXVsdCkobmV3TGFzdEZhaWx1cmUuZmFpbGVkKTtcbiAgICAgICAgcmV0dXJuIG5ldyBTdWNjZXNzZnVsUGFyc2UodGhpcy5wb3MsIHRoaXMudHJlZSwgbGF0ZXJSZXN1bHQodGhpcy5sYXN0RmFpbHVyZSwgbmV3TGFzdEZhaWx1cmUpKTtcbiAgICB9XG59XG5leHBvcnRzLlN1Y2Nlc3NmdWxQYXJzZSA9IFN1Y2Nlc3NmdWxQYXJzZTtcbmNsYXNzIEZhaWxlZFBhcnNlIHtcbiAgICBjb25zdHJ1Y3Rvcihwb3MsIG5vbnRlcm1pbmFsTmFtZSwgZXhwZWN0ZWRUZXh0KSB7XG4gICAgICAgIHRoaXMucG9zID0gcG9zO1xuICAgICAgICB0aGlzLm5vbnRlcm1pbmFsTmFtZSA9IG5vbnRlcm1pbmFsTmFtZTtcbiAgICAgICAgdGhpcy5leHBlY3RlZFRleHQgPSBleHBlY3RlZFRleHQ7XG4gICAgICAgIHRoaXMuZmFpbGVkID0gdHJ1ZTtcbiAgICB9XG59XG5leHBvcnRzLkZhaWxlZFBhcnNlID0gRmFpbGVkUGFyc2U7XG4vKipcbiAqIEBwYXJhbSByZXN1bHQxXG4gKiBAcGFyYW0gcmVzdWx0MlxuICogQHJldHVybiB3aGljaGV2ZXIgb2YgcmVzdWx0MSBvciByZXN1bHQyIGhhcyB0aGUgbXhpbXVtIHBvc2l0aW9uLCBvciB1bmRlZmluZWQgaWYgYm90aCBhcmUgdW5kZWZpbmVkXG4gKi9cbmZ1bmN0aW9uIGxhdGVyUmVzdWx0KHJlc3VsdDEsIHJlc3VsdDIpIHtcbiAgICBpZiAocmVzdWx0MSAmJiByZXN1bHQyKVxuICAgICAgICByZXR1cm4gcmVzdWx0MS5wb3MgPj0gcmVzdWx0Mi5wb3MgPyByZXN1bHQxIDogcmVzdWx0MjtcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiByZXN1bHQxIHx8IHJlc3VsdDI7XG59XG4vKipcbiAqIEBwYXJhbSByZXN1bHRzXG4gKiBAcmV0dXJuIHRoZSByZXN1bHRzIGluIHRoZSBsaXN0IHdpdGggbWF4aW11bSBwb3MuICBFbXB0eSBpZiBsaXN0IGlzIGVtcHR5LlxuICovXG5mdW5jdGlvbiBsb25nZXN0UmVzdWx0cyhyZXN1bHRzKSB7XG4gICAgcmV0dXJuIHJlc3VsdHMucmVkdWNlKChsb25nZXN0UmVzdWx0c1NvRmFyLCByZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKGxvbmdlc3RSZXN1bHRzU29GYXIubGVuZ3RoID09IDAgfHwgcmVzdWx0LnBvcyA+IGxvbmdlc3RSZXN1bHRzU29GYXJbMF0ucG9zKSB7XG4gICAgICAgICAgICAvLyByZXN1bHQgd2luc1xuICAgICAgICAgICAgcmV0dXJuIFtyZXN1bHRdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHJlc3VsdC5wb3MgPT0gbG9uZ2VzdFJlc3VsdHNTb0ZhclswXS5wb3MpIHtcbiAgICAgICAgICAgIC8vIHJlc3VsdCBpcyB0aWVkXG4gICAgICAgICAgICBsb25nZXN0UmVzdWx0c1NvRmFyLnB1c2gocmVzdWx0KTtcbiAgICAgICAgICAgIHJldHVybiBsb25nZXN0UmVzdWx0c1NvRmFyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gcmVzdWx0IGxvc2VzXG4gICAgICAgICAgICByZXR1cm4gbG9uZ2VzdFJlc3VsdHNTb0ZhcjtcbiAgICAgICAgfVxuICAgIH0sIFtdKTtcbn1cbmNsYXNzIFBhcnNlclN0YXRlIHtcbiAgICBjb25zdHJ1Y3Rvcihub250ZXJtaW5hbFRvU3RyaW5nKSB7XG4gICAgICAgIHRoaXMubm9udGVybWluYWxUb1N0cmluZyA9IG5vbnRlcm1pbmFsVG9TdHJpbmc7XG4gICAgICAgIHRoaXMuc3RhY2sgPSBbXTtcbiAgICAgICAgdGhpcy5maXJzdCA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5za2lwRGVwdGggPSAwO1xuICAgIH1cbiAgICBlbnRlcihwb3MsIG5vbnRlcm1pbmFsKSB7XG4gICAgICAgIGlmICghdGhpcy5maXJzdC5oYXMobm9udGVybWluYWwpKSB7XG4gICAgICAgICAgICB0aGlzLmZpcnN0LnNldChub250ZXJtaW5hbCwgW10pO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHMgPSB0aGlzLmZpcnN0LmdldChub250ZXJtaW5hbCk7XG4gICAgICAgIGlmIChzLmxlbmd0aCA+IDAgJiYgc1tzLmxlbmd0aCAtIDFdID09IHBvcykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IHR5cGVzXzEuR3JhbW1hckVycm9yKFwiZGV0ZWN0ZWQgbGVmdCByZWN1cnNpb24gaW4gcnVsZSBmb3IgXCIgKyB0aGlzLm5vbnRlcm1pbmFsVG9TdHJpbmcobm9udGVybWluYWwpKTtcbiAgICAgICAgfVxuICAgICAgICBzLnB1c2gocG9zKTtcbiAgICAgICAgdGhpcy5zdGFjay5wdXNoKG5vbnRlcm1pbmFsKTtcbiAgICB9XG4gICAgbGVhdmUobm9udGVybWluYWwpIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKHRoaXMuZmlyc3QuaGFzKG5vbnRlcm1pbmFsKSAmJiB0aGlzLmZpcnN0LmdldChub250ZXJtaW5hbCkubGVuZ3RoID4gMCk7XG4gICAgICAgIHRoaXMuZmlyc3QuZ2V0KG5vbnRlcm1pbmFsKS5wb3AoKTtcbiAgICAgICAgY29uc3QgbGFzdCA9IHRoaXMuc3RhY2sucG9wKCk7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KShsYXN0ID09PSBub250ZXJtaW5hbCk7XG4gICAgfVxuICAgIGVudGVyU2tpcCgpIHtcbiAgICAgICAgLy9jb25zb2xlLmVycm9yKCdlbnRlcmluZyBza2lwJyk7XG4gICAgICAgICsrdGhpcy5za2lwRGVwdGg7XG4gICAgfVxuICAgIGxlYXZlU2tpcCgpIHtcbiAgICAgICAgLy9jb25zb2xlLmVycm9yKCdsZWF2aW5nIHNraXAnKTtcbiAgICAgICAgLS10aGlzLnNraXBEZXB0aDtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKHRoaXMuc2tpcERlcHRoID49IDApO1xuICAgIH1cbiAgICBpc0VtcHR5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGFjay5sZW5ndGggPT0gMDtcbiAgICB9XG4gICAgZ2V0IGN1cnJlbnROb250ZXJtaW5hbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhY2tbdGhpcy5zdGFjay5sZW5ndGggLSAxXTtcbiAgICB9XG4gICAgZ2V0IGN1cnJlbnROb250ZXJtaW5hbE5hbWUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnROb250ZXJtaW5hbCAhPT0gdW5kZWZpbmVkID8gdGhpcy5ub250ZXJtaW5hbFRvU3RyaW5nKHRoaXMuY3VycmVudE5vbnRlcm1pbmFsKSA6IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gcmVxdWlyZXM6ICFpc0VtcHR5KClcbiAgICBtYWtlUGFyc2VUcmVlKHBvcywgdGV4dCA9ICcnLCBjaGlsZHJlbiA9IFtdKSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSghdGhpcy5pc0VtcHR5KCkpO1xuICAgICAgICByZXR1cm4gbmV3IHBhcnNldHJlZV8xLkludGVybmFsUGFyc2VUcmVlKHRoaXMuY3VycmVudE5vbnRlcm1pbmFsLCB0aGlzLmN1cnJlbnROb250ZXJtaW5hbE5hbWUsIHBvcywgdGV4dCwgY2hpbGRyZW4sIHRoaXMuc2tpcERlcHRoID4gMCk7XG4gICAgfVxuICAgIC8vIHJlcXVpcmVzICFpc0VtcHR5KClcbiAgICBtYWtlU3VjY2Vzc2Z1bFBhcnNlKGZyb21Qb3MsIHRvUG9zLCB0ZXh0ID0gJycsIGNoaWxkcmVuID0gW10pIHtcbiAgICAgICAgKDAsIGFzc2VydF8xLmRlZmF1bHQpKCF0aGlzLmlzRW1wdHkoKSk7XG4gICAgICAgIHJldHVybiBuZXcgU3VjY2Vzc2Z1bFBhcnNlKHRvUG9zLCB0aGlzLm1ha2VQYXJzZVRyZWUoZnJvbVBvcywgdGV4dCwgY2hpbGRyZW4pKTtcbiAgICB9XG4gICAgLy8gcmVxdWlyZXMgIWlzRW1wdHkoKVxuICAgIG1ha2VGYWlsZWRQYXJzZShhdFBvcywgZXhwZWN0ZWRUZXh0KSB7XG4gICAgICAgICgwLCBhc3NlcnRfMS5kZWZhdWx0KSghdGhpcy5pc0VtcHR5KCkpO1xuICAgICAgICByZXR1cm4gbmV3IEZhaWxlZFBhcnNlKGF0UG9zLCB0aGlzLmN1cnJlbnROb250ZXJtaW5hbE5hbWUsIGV4cGVjdGVkVGV4dCk7XG4gICAgfVxufVxuZXhwb3J0cy5QYXJzZXJTdGF0ZSA9IFBhcnNlclN0YXRlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2VyLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5JbnRlcm5hbFBhcnNlVHJlZSA9IHZvaWQgMDtcbmNvbnN0IGRpc3BsYXlfMSA9IHJlcXVpcmUoXCIuL2Rpc3BsYXlcIik7XG5jbGFzcyBJbnRlcm5hbFBhcnNlVHJlZSB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgbm9udGVybWluYWxOYW1lLCBzdGFydCwgdGV4dCwgYWxsQ2hpbGRyZW4sIGlzU2tpcHBlZCkge1xuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICB0aGlzLm5vbnRlcm1pbmFsTmFtZSA9IG5vbnRlcm1pbmFsTmFtZTtcbiAgICAgICAgdGhpcy5zdGFydCA9IHN0YXJ0O1xuICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xuICAgICAgICB0aGlzLmFsbENoaWxkcmVuID0gYWxsQ2hpbGRyZW47XG4gICAgICAgIHRoaXMuaXNTa2lwcGVkID0gaXNTa2lwcGVkO1xuICAgICAgICB0aGlzLmNoZWNrUmVwKCk7XG4gICAgICAgIE9iamVjdC5mcmVlemUodGhpcy5hbGxDaGlsZHJlbik7XG4gICAgICAgIC8vIGNhbid0IGZyZWV6ZSh0aGlzKSBiZWNhdXNlIG9mIGJlbmVmaWNlbnQgbXV0YXRpb24gZGVsYXllZCBjb21wdXRhdGlvbi13aXRoLWNhY2hpbmcgZm9yIGNoaWxkcmVuKCkgYW5kIGNoaWxkcmVuQnlOYW1lKClcbiAgICB9XG4gICAgY2hlY2tSZXAoKSB7XG4gICAgICAgIC8vIEZJWE1FXG4gICAgfVxuICAgIGdldCBlbmQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXJ0ICsgdGhpcy50ZXh0Lmxlbmd0aDtcbiAgICB9XG4gICAgY2hpbGRyZW5CeU5hbWUobmFtZSkge1xuICAgICAgICBpZiAoIXRoaXMuX2NoaWxkcmVuQnlOYW1lKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbkJ5TmFtZSA9IG5ldyBNYXAoKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGQgb2YgdGhpcy5hbGxDaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5fY2hpbGRyZW5CeU5hbWUuaGFzKGNoaWxkLm5hbWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuQnlOYW1lLnNldChjaGlsZC5uYW1lLCBbXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuX2NoaWxkcmVuQnlOYW1lLmdldChjaGlsZC5uYW1lKS5wdXNoKGNoaWxkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoY29uc3QgY2hpbGRMaXN0IG9mIHRoaXMuX2NoaWxkcmVuQnlOYW1lLnZhbHVlcygpKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZShjaGlsZExpc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuY2hlY2tSZXAoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuQnlOYW1lLmdldChuYW1lKSB8fCBbXTtcbiAgICB9XG4gICAgZ2V0IGNoaWxkcmVuKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2NoaWxkcmVuKSB7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZHJlbiA9IHRoaXMuYWxsQ2hpbGRyZW4uZmlsdGVyKGNoaWxkID0+ICFjaGlsZC5pc1NraXBwZWQpO1xuICAgICAgICAgICAgT2JqZWN0LmZyZWV6ZSh0aGlzLl9jaGlsZHJlbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGVja1JlcCgpO1xuICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW47XG4gICAgfVxuICAgIGNvbmNhdCh0aGF0KSB7XG4gICAgICAgIHJldHVybiBuZXcgSW50ZXJuYWxQYXJzZVRyZWUodGhpcy5uYW1lLCB0aGlzLm5vbnRlcm1pbmFsTmFtZSwgdGhpcy5zdGFydCwgdGhpcy50ZXh0ICsgdGhhdC50ZXh0LCB0aGlzLmFsbENoaWxkcmVuLmNvbmNhdCh0aGF0LmFsbENoaWxkcmVuKSwgdGhpcy5pc1NraXBwZWQgJiYgdGhhdC5pc1NraXBwZWQpO1xuICAgIH1cbiAgICB0b1N0cmluZygpIHtcbiAgICAgICAgbGV0IHMgPSAodGhpcy5pc1NraXBwZWQgPyBcIkBza2lwIFwiIDogXCJcIikgKyB0aGlzLm5vbnRlcm1pbmFsTmFtZTtcbiAgICAgICAgaWYgKHRoaXMuY2hpbGRyZW4ubGVuZ3RoID09IDApIHtcbiAgICAgICAgICAgIHMgKz0gXCI6XCIgKyAoMCwgZGlzcGxheV8xLmVzY2FwZUZvclJlYWRpbmcpKHRoaXMudGV4dCwgXCJcXFwiXCIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IHQgPSBcIlwiO1xuICAgICAgICAgICAgbGV0IG9mZnNldFJlYWNoZWRTb0ZhciA9IHRoaXMuc3RhcnQ7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHB0IG9mIHRoaXMuYWxsQ2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBpZiAob2Zmc2V0UmVhY2hlZFNvRmFyIDwgcHQuc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcHJldmlvdXMgY2hpbGQgYW5kIGN1cnJlbnQgY2hpbGQgaGF2ZSBhIGdhcCBiZXR3ZWVuIHRoZW0gdGhhdCBtdXN0IGhhdmUgYmVlbiBtYXRjaGVkIGFzIGEgdGVybWluYWxcbiAgICAgICAgICAgICAgICAgICAgLy8gaW4gdGhlIHJ1bGUgZm9yIHRoaXMgbm9kZS4gIEluc2VydCBpdCBhcyBhIHF1b3RlZCBzdHJpbmcuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHRlcm1pbmFsID0gdGhpcy50ZXh0LnN1YnN0cmluZyhvZmZzZXRSZWFjaGVkU29GYXIgLSB0aGlzLnN0YXJ0LCBwdC5zdGFydCAtIHRoaXMuc3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICB0ICs9IFwiXFxuXCIgKyAoMCwgZGlzcGxheV8xLmVzY2FwZUZvclJlYWRpbmcpKHRlcm1pbmFsLCBcIlxcXCJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHQgKz0gXCJcXG5cIiArIHB0O1xuICAgICAgICAgICAgICAgIG9mZnNldFJlYWNoZWRTb0ZhciA9IHB0LmVuZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChvZmZzZXRSZWFjaGVkU29GYXIgPCB0aGlzLmVuZCkge1xuICAgICAgICAgICAgICAgIC8vIGZpbmFsIGNoaWxkIGFuZCBlbmQgb2YgdGhpcyBub2RlIGhhdmUgYSBnYXAgLS0gdHJlYXQgaXQgdGhlIHNhbWUgYXMgYWJvdmUuXG4gICAgICAgICAgICAgICAgY29uc3QgdGVybWluYWwgPSB0aGlzLnRleHQuc3Vic3RyaW5nKG9mZnNldFJlYWNoZWRTb0ZhciAtIHRoaXMuc3RhcnQpO1xuICAgICAgICAgICAgICAgIHQgKz0gXCJcXG5cIiArICgwLCBkaXNwbGF5XzEuZXNjYXBlRm9yUmVhZGluZykodGVybWluYWwsIFwiXFxcIlwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHNtYWxsRW5vdWdoRm9yT25lTGluZSA9IDUwO1xuICAgICAgICAgICAgaWYgKHQubGVuZ3RoIDw9IHNtYWxsRW5vdWdoRm9yT25lTGluZSkge1xuICAgICAgICAgICAgICAgIHMgKz0gXCIgeyBcIiArIHQuc3Vic3RyaW5nKDEpIC8vIHJlbW92ZSBpbml0aWFsIG5ld2xpbmVcbiAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoXCJcXG5cIiwgXCIsIFwiKVxuICAgICAgICAgICAgICAgICAgICArIFwiIH1cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHMgKz0gXCIge1wiICsgKDAsIGRpc3BsYXlfMS5pbmRlbnQpKHQsIFwiICBcIikgKyBcIlxcbn1cIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcztcbiAgICB9XG59XG5leHBvcnRzLkludGVybmFsUGFyc2VUcmVlID0gSW50ZXJuYWxQYXJzZVRyZWU7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZXRyZWUuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkdyYW1tYXJFcnJvciA9IGV4cG9ydHMuSW50ZXJuYWxQYXJzZUVycm9yID0gZXhwb3J0cy5QYXJzZUVycm9yID0gdm9pZCAwO1xuY29uc3QgZGlzcGxheV8xID0gcmVxdWlyZShcIi4vZGlzcGxheVwiKTtcbi8qKlxuICogRXhjZXB0aW9uIHRocm93biB3aGVuIGEgc2VxdWVuY2Ugb2YgY2hhcmFjdGVycyBkb2Vzbid0IG1hdGNoIGEgZ3JhbW1hclxuICovXG5jbGFzcyBQYXJzZUVycm9yIGV4dGVuZHMgRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICAgICAgc3VwZXIobWVzc2FnZSk7XG4gICAgfVxufVxuZXhwb3J0cy5QYXJzZUVycm9yID0gUGFyc2VFcnJvcjtcbmNsYXNzIEludGVybmFsUGFyc2VFcnJvciBleHRlbmRzIFBhcnNlRXJyb3Ige1xuICAgIGNvbnN0cnVjdG9yKG1lc3NhZ2UsIG5vbnRlcm1pbmFsTmFtZSwgZXhwZWN0ZWRUZXh0LCB0ZXh0QmVpbmdQYXJzZWQsIHBvcykge1xuICAgICAgICBzdXBlcigoMCwgZGlzcGxheV8xLm1ha2VFcnJvck1lc3NhZ2UpKG1lc3NhZ2UsIG5vbnRlcm1pbmFsTmFtZSwgZXhwZWN0ZWRUZXh0LCB0ZXh0QmVpbmdQYXJzZWQsIHBvcywgXCJzdHJpbmcgYmVpbmcgcGFyc2VkXCIpKTtcbiAgICAgICAgdGhpcy5ub250ZXJtaW5hbE5hbWUgPSBub250ZXJtaW5hbE5hbWU7XG4gICAgICAgIHRoaXMuZXhwZWN0ZWRUZXh0ID0gZXhwZWN0ZWRUZXh0O1xuICAgICAgICB0aGlzLnRleHRCZWluZ1BhcnNlZCA9IHRleHRCZWluZ1BhcnNlZDtcbiAgICAgICAgdGhpcy5wb3MgPSBwb3M7XG4gICAgfVxufVxuZXhwb3J0cy5JbnRlcm5hbFBhcnNlRXJyb3IgPSBJbnRlcm5hbFBhcnNlRXJyb3I7XG5jbGFzcyBHcmFtbWFyRXJyb3IgZXh0ZW5kcyBQYXJzZUVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcihtZXNzYWdlLCBlKSB7XG4gICAgICAgIHN1cGVyKGUgPyAoMCwgZGlzcGxheV8xLm1ha2VFcnJvck1lc3NhZ2UpKG1lc3NhZ2UsIGUubm9udGVybWluYWxOYW1lLCBlLmV4cGVjdGVkVGV4dCwgZS50ZXh0QmVpbmdQYXJzZWQsIGUucG9zLCBcImdyYW1tYXJcIilcbiAgICAgICAgICAgIDogbWVzc2FnZSk7XG4gICAgfVxufVxuZXhwb3J0cy5HcmFtbWFyRXJyb3IgPSBHcmFtbWFyRXJyb3I7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10eXBlcy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudmlzdWFsaXplQXNIdG1sID0gZXhwb3J0cy52aXN1YWxpemVBc1VybCA9IHZvaWQgMDtcbmNvbnN0IGNvbXBpbGVyXzEgPSByZXF1aXJlKFwiLi9jb21waWxlclwiKTtcbmNvbnN0IHBhcnNlcmxpYl8xID0gcmVxdWlyZShcIi4uL3BhcnNlcmxpYlwiKTtcbmNvbnN0IGZzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImZzXCIpKTtcbmNvbnN0IHBhdGhfMSA9IF9faW1wb3J0RGVmYXVsdChyZXF1aXJlKFwicGF0aFwiKSk7XG5mdW5jdGlvbiBlbXB0eUl0ZXJhdG9yKCkge1xuICAgIHJldHVybiB7XG4gICAgICAgIG5leHQoKSB7IHJldHVybiB7IGRvbmU6IHRydWUgfTsgfVxuICAgIH07XG59XG5mdW5jdGlvbiBnZXRJdGVyYXRvcihsaXN0KSB7XG4gICAgcmV0dXJuIGxpc3RbU3ltYm9sLml0ZXJhdG9yXSgpO1xufVxuY29uc3QgTUFYX1VSTF9MRU5HVEhfRk9SX0RFU0tUT1BfQlJPV1NFID0gMjAyMDtcbi8qKlxuICogVmlzdWFsaXplcyBhIHBhcnNlIHRyZWUgdXNpbmcgYSBVUkwgdGhhdCBjYW4gYmUgcGFzdGVkIGludG8geW91ciB3ZWIgYnJvd3Nlci5cbiAqIEBwYXJhbSBwYXJzZVRyZWUgdHJlZSB0byB2aXN1YWxpemVcbiAqIEBwYXJhbSA8TlQ+IHRoZSBlbnVtZXJhdGlvbiBvZiBzeW1ib2xzIGluIHRoZSBwYXJzZSB0cmVlJ3MgZ3JhbW1hclxuICogQHJldHVybiB1cmwgdGhhdCBzaG93cyBhIHZpc3VhbGl6YXRpb24gb2YgdGhlIHBhcnNlIHRyZWVcbiAqL1xuZnVuY3Rpb24gdmlzdWFsaXplQXNVcmwocGFyc2VUcmVlLCBub250ZXJtaW5hbHMpIHtcbiAgICBjb25zdCBiYXNlID0gXCJodHRwOi8vd2ViLm1pdC5lZHUvNi4wMzEvd3d3L3BhcnNlcmxpYi9cIiArIHBhcnNlcmxpYl8xLlZFUlNJT04gKyBcIi92aXN1YWxpemVyLmh0bWxcIjtcbiAgICBjb25zdCBjb2RlID0gZXhwcmVzc2lvbkZvckRpc3BsYXkocGFyc2VUcmVlLCBub250ZXJtaW5hbHMpO1xuICAgIGNvbnN0IHVybCA9IGJhc2UgKyAnP2NvZGU9JyArIGZpeGVkRW5jb2RlVVJJQ29tcG9uZW50KGNvZGUpO1xuICAgIGlmICh1cmwubGVuZ3RoID4gTUFYX1VSTF9MRU5HVEhfRk9SX0RFU0tUT1BfQlJPV1NFKSB7XG4gICAgICAgIC8vIGRpc3BsYXkgYWx0ZXJuYXRlIGluc3RydWN0aW9ucyB0byB0aGUgY29uc29sZVxuICAgICAgICBjb25zb2xlLmVycm9yKCdWaXN1YWxpemF0aW9uIFVSTCBpcyB0b28gbG9uZyBmb3Igd2ViIGJyb3dzZXIgYW5kL29yIHdlYiBzZXJ2ZXIuXFxuJ1xuICAgICAgICAgICAgKyAnSW5zdGVhZCwgZ28gdG8gJyArIGJhc2UgKyAnXFxuJ1xuICAgICAgICAgICAgKyAnYW5kIGNvcHkgYW5kIHBhc3RlIHRoaXMgY29kZSBpbnRvIHRoZSB0ZXh0Ym94OlxcbidcbiAgICAgICAgICAgICsgY29kZSk7XG4gICAgfVxuICAgIHJldHVybiB1cmw7XG59XG5leHBvcnRzLnZpc3VhbGl6ZUFzVXJsID0gdmlzdWFsaXplQXNVcmw7XG5jb25zdCB2aXN1YWxpemVySHRtbEZpbGUgPSBwYXRoXzEuZGVmYXVsdC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uL3NyYy92aXN1YWxpemVyLmh0bWwnKTtcbi8qKlxuICogVmlzdWFsaXplcyBhIHBhcnNlIHRyZWUgYXMgYSBzdHJpbmcgb2YgSFRNTCB0aGF0IGNhbiBiZSBkaXNwbGF5ZWQgaW4gYSB3ZWIgYnJvd3Nlci5cbiAqIEBwYXJhbSBwYXJzZVRyZWUgdHJlZSB0byB2aXN1YWxpemVcbiAqIEBwYXJhbSA8TlQ+IHRoZSBlbnVtZXJhdGlvbiBvZiBzeW1ib2xzIGluIHRoZSBwYXJzZSB0cmVlJ3MgZ3JhbW1hclxuICogQHJldHVybiBzdHJpbmcgb2YgSFRNTCB0aGF0IHNob3dzIGEgdmlzdWFsaXphdGlvbiBvZiB0aGUgcGFyc2UgdHJlZVxuICovXG5mdW5jdGlvbiB2aXN1YWxpemVBc0h0bWwocGFyc2VUcmVlLCBub250ZXJtaW5hbHMpIHtcbiAgICBjb25zdCBodG1sID0gZnNfMS5kZWZhdWx0LnJlYWRGaWxlU3luYyh2aXN1YWxpemVySHRtbEZpbGUsICd1dGY4Jyk7XG4gICAgY29uc3QgY29kZSA9IGV4cHJlc3Npb25Gb3JEaXNwbGF5KHBhcnNlVHJlZSwgbm9udGVybWluYWxzKTtcbiAgICBjb25zdCByZXN1bHQgPSBodG1sLnJlcGxhY2UoL1xcL1xcL0NPREVIRVJFLywgXCJyZXR1cm4gJ1wiICsgZml4ZWRFbmNvZGVVUklDb21wb25lbnQoY29kZSkgKyBcIic7XCIpO1xuICAgIHJldHVybiByZXN1bHQ7XG59XG5leHBvcnRzLnZpc3VhbGl6ZUFzSHRtbCA9IHZpc3VhbGl6ZUFzSHRtbDtcbmZ1bmN0aW9uIGV4cHJlc3Npb25Gb3JEaXNwbGF5KHBhcnNlVHJlZSwgbm9udGVybWluYWxzKSB7XG4gICAgY29uc3QgeyBub250ZXJtaW5hbFRvU3RyaW5nIH0gPSAoMCwgY29tcGlsZXJfMS5tYWtlTm9udGVybWluYWxDb252ZXJ0ZXJzKShub250ZXJtaW5hbHMpO1xuICAgIHJldHVybiBmb3JEaXNwbGF5KHBhcnNlVHJlZSwgW10sIHBhcnNlVHJlZSk7XG4gICAgZnVuY3Rpb24gZm9yRGlzcGxheShub2RlLCBzaWJsaW5ncywgcGFyZW50KSB7XG4gICAgICAgIGNvbnN0IG5hbWUgPSBub250ZXJtaW5hbFRvU3RyaW5nKG5vZGUubmFtZSkudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgbGV0IHMgPSBcIm5kKFwiO1xuICAgICAgICBpZiAobm9kZS5jaGlsZHJlbi5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcyArPSBcIlxcXCJcIiArIG5hbWUgKyBcIlxcXCIsbmQoXFxcIidcIiArIGNsZWFuU3RyaW5nKG5vZGUudGV4dCkgKyBcIidcXFwiKSxcIjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHMgKz0gXCJcXFwiXCIgKyBuYW1lICsgXCJcXFwiLFwiO1xuICAgICAgICAgICAgY29uc3QgY2hpbGRyZW4gPSBub2RlLmFsbENoaWxkcmVuLnNsaWNlKCk7IC8vIG1ha2UgYSBjb3B5IGZvciBzaGlmdGluZ1xuICAgICAgICAgICAgY29uc3QgZmlyc3RDaGlsZCA9IGNoaWxkcmVuLnNoaWZ0KCk7XG4gICAgICAgICAgICBsZXQgY2hpbGRyZW5FeHByZXNzaW9uID0gZm9yRGlzcGxheShmaXJzdENoaWxkLCBjaGlsZHJlbiwgbm9kZSk7XG4gICAgICAgICAgICBpZiAobm9kZS5zdGFydCA8IGZpcnN0Q2hpbGQuc3RhcnQpIHtcbiAgICAgICAgICAgICAgICAvLyBub2RlIGFuZCBpdHMgZmlyc3QgY2hpbGQgaGF2ZSBhIGdhcCBiZXR3ZWVuIHRoZW0gdGhhdCBtdXN0IGhhdmUgYmVlbiBtYXRjaGVkIGFzIGEgdGVybWluYWxcbiAgICAgICAgICAgICAgICAvLyBpbiB0aGUgcnVsZSBmb3Igbm9kZS4gIEluc2VydCBpdCBhcyBhIHF1b3RlZCBzdHJpbmcuXG4gICAgICAgICAgICAgICAgY2hpbGRyZW5FeHByZXNzaW9uID0gcHJlY2VkZUJ5VGVybWluYWwobm9kZS50ZXh0LnN1YnN0cmluZygwLCBmaXJzdENoaWxkLnN0YXJ0IC0gbm9kZS5zdGFydCksIGNoaWxkcmVuRXhwcmVzc2lvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzICs9IGNoaWxkcmVuRXhwcmVzc2lvbiArIFwiLFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaWJsaW5ncy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBzaWJsaW5nID0gc2libGluZ3Muc2hpZnQoKTtcbiAgICAgICAgICAgIGxldCBzaWJsaW5nRXhwcmVzc2lvbiA9IGZvckRpc3BsYXkoc2libGluZywgc2libGluZ3MsIHBhcmVudCk7XG4gICAgICAgICAgICBpZiAobm9kZS5lbmQgPCBzaWJsaW5nLnN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgLy8gbm9kZSBhbmQgaXRzIHNpYmxpbmcgaGF2ZSBhIGdhcCBiZXR3ZWVuIHRoZW0gdGhhdCBtdXN0IGhhdmUgYmVlbiBtYXRjaGVkIGFzIGEgdGVybWluYWxcbiAgICAgICAgICAgICAgICAvLyBpbiB0aGUgcnVsZSBmb3IgcGFyZW50LiAgSW5zZXJ0IGl0IGFzIGEgcXVvdGVkIHN0cmluZy5cbiAgICAgICAgICAgICAgICBzaWJsaW5nRXhwcmVzc2lvbiA9IHByZWNlZGVCeVRlcm1pbmFsKHBhcmVudC50ZXh0LnN1YnN0cmluZyhub2RlLmVuZCAtIHBhcmVudC5zdGFydCwgc2libGluZy5zdGFydCAtIHBhcmVudC5zdGFydCksIHNpYmxpbmdFeHByZXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHMgKz0gc2libGluZ0V4cHJlc3Npb247XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBsZXQgc2libGluZ0V4cHJlc3Npb24gPSBcInV1XCI7XG4gICAgICAgICAgICBpZiAobm9kZS5lbmQgPCBwYXJlbnQuZW5kKSB7XG4gICAgICAgICAgICAgICAgLy8gVGhlcmUncyBhIGdhcCBiZXR3ZWVuIHRoZSBlbmQgb2Ygbm9kZSBhbmQgdGhlIGVuZCBvZiBpdHMgcGFyZW50LCB3aGljaCBtdXN0IGJlIGEgdGVybWluYWwgbWF0Y2hlZCBieSBwYXJlbnQuXG4gICAgICAgICAgICAgICAgLy8gSW5zZXJ0IGl0IGFzIGEgcXVvdGVkIHN0cmluZy5cbiAgICAgICAgICAgICAgICBzaWJsaW5nRXhwcmVzc2lvbiA9IHByZWNlZGVCeVRlcm1pbmFsKHBhcmVudC50ZXh0LnN1YnN0cmluZyhub2RlLmVuZCAtIHBhcmVudC5zdGFydCksIHNpYmxpbmdFeHByZXNzaW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHMgKz0gc2libGluZ0V4cHJlc3Npb247XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG5vZGUuaXNTa2lwcGVkKSB7XG4gICAgICAgICAgICBzICs9IFwiLHRydWVcIjtcbiAgICAgICAgfVxuICAgICAgICBzICs9IFwiKVwiO1xuICAgICAgICByZXR1cm4gcztcbiAgICB9XG4gICAgZnVuY3Rpb24gcHJlY2VkZUJ5VGVybWluYWwodGVybWluYWwsIGV4cHJlc3Npb24pIHtcbiAgICAgICAgcmV0dXJuIFwibmQoXFxcIidcIiArIGNsZWFuU3RyaW5nKHRlcm1pbmFsKSArIFwiJ1xcXCIsIHV1LCBcIiArIGV4cHJlc3Npb24gKyBcIilcIjtcbiAgICB9XG4gICAgZnVuY3Rpb24gY2xlYW5TdHJpbmcocykge1xuICAgICAgICBsZXQgcnZhbHVlID0gcy5yZXBsYWNlKC9cXFxcL2csIFwiXFxcXFxcXFxcIik7XG4gICAgICAgIHJ2YWx1ZSA9IHJ2YWx1ZS5yZXBsYWNlKC9cIi9nLCBcIlxcXFxcXFwiXCIpO1xuICAgICAgICBydmFsdWUgPSBydmFsdWUucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIik7XG4gICAgICAgIHJ2YWx1ZSA9IHJ2YWx1ZS5yZXBsYWNlKC9cXHIvZywgXCJcXFxcclwiKTtcbiAgICAgICAgcmV0dXJuIHJ2YWx1ZTtcbiAgICB9XG59XG4vLyBmcm9tIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL2VuY29kZVVSSUNvbXBvbmVudFxuZnVuY3Rpb24gZml4ZWRFbmNvZGVVUklDb21wb25lbnQocykge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQocykucmVwbGFjZSgvWyEnKCkqXS9nLCBjID0+ICclJyArIGMuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dmlzdWFsaXplci5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMudmlzdWFsaXplQXNIdG1sID0gZXhwb3J0cy52aXN1YWxpemVBc1VybCA9IGV4cG9ydHMuY29tcGlsZSA9IGV4cG9ydHMuUGFyc2VFcnJvciA9IGV4cG9ydHMuVkVSU0lPTiA9IHZvaWQgMDtcbmV4cG9ydHMuVkVSU0lPTiA9IFwiMy4yLjNcIjtcbnZhciB0eXBlc18xID0gcmVxdWlyZShcIi4vaW50ZXJuYWwvdHlwZXNcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJQYXJzZUVycm9yXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0eXBlc18xLlBhcnNlRXJyb3I7IH0gfSk7XG47XG52YXIgY29tcGlsZXJfMSA9IHJlcXVpcmUoXCIuL2ludGVybmFsL2NvbXBpbGVyXCIpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiY29tcGlsZVwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gY29tcGlsZXJfMS5jb21waWxlOyB9IH0pO1xudmFyIHZpc3VhbGl6ZXJfMSA9IHJlcXVpcmUoXCIuL2ludGVybmFsL3Zpc3VhbGl6ZXJcIik7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJ2aXN1YWxpemVBc1VybFwiLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdmlzdWFsaXplcl8xLnZpc3VhbGl6ZUFzVXJsOyB9IH0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwidmlzdWFsaXplQXNIdG1sXCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB2aXN1YWxpemVyXzEudmlzdWFsaXplQXNIdG1sOyB9IH0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2VybGliLmpzLm1hcCIsIi8vICdwYXRoJyBtb2R1bGUgZXh0cmFjdGVkIGZyb20gTm9kZS5qcyB2OC4xMS4xIChvbmx5IHRoZSBwb3NpeCBwYXJ0KVxuLy8gdHJhbnNwbGl0ZWQgd2l0aCBCYWJlbFxuXG4vLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBhc3NlcnRQYXRoKHBhdGgpIHtcbiAgaWYgKHR5cGVvZiBwYXRoICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1BhdGggbXVzdCBiZSBhIHN0cmluZy4gUmVjZWl2ZWQgJyArIEpTT04uc3RyaW5naWZ5KHBhdGgpKTtcbiAgfVxufVxuXG4vLyBSZXNvbHZlcyAuIGFuZCAuLiBlbGVtZW50cyBpbiBhIHBhdGggd2l0aCBkaXJlY3RvcnkgbmFtZXNcbmZ1bmN0aW9uIG5vcm1hbGl6ZVN0cmluZ1Bvc2l4KHBhdGgsIGFsbG93QWJvdmVSb290KSB7XG4gIHZhciByZXMgPSAnJztcbiAgdmFyIGxhc3RTZWdtZW50TGVuZ3RoID0gMDtcbiAgdmFyIGxhc3RTbGFzaCA9IC0xO1xuICB2YXIgZG90cyA9IDA7XG4gIHZhciBjb2RlO1xuICBmb3IgKHZhciBpID0gMDsgaSA8PSBwYXRoLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKGkgPCBwYXRoLmxlbmd0aClcbiAgICAgIGNvZGUgPSBwYXRoLmNoYXJDb2RlQXQoaSk7XG4gICAgZWxzZSBpZiAoY29kZSA9PT0gNDcgLyovKi8pXG4gICAgICBicmVhaztcbiAgICBlbHNlXG4gICAgICBjb2RlID0gNDcgLyovKi87XG4gICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICBpZiAobGFzdFNsYXNoID09PSBpIC0gMSB8fCBkb3RzID09PSAxKSB7XG4gICAgICAgIC8vIE5PT1BcbiAgICAgIH0gZWxzZSBpZiAobGFzdFNsYXNoICE9PSBpIC0gMSAmJiBkb3RzID09PSAyKSB7XG4gICAgICAgIGlmIChyZXMubGVuZ3RoIDwgMiB8fCBsYXN0U2VnbWVudExlbmd0aCAhPT0gMiB8fCByZXMuY2hhckNvZGVBdChyZXMubGVuZ3RoIC0gMSkgIT09IDQ2IC8qLiovIHx8IHJlcy5jaGFyQ29kZUF0KHJlcy5sZW5ndGggLSAyKSAhPT0gNDYgLyouKi8pIHtcbiAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgIHZhciBsYXN0U2xhc2hJbmRleCA9IHJlcy5sYXN0SW5kZXhPZignLycpO1xuICAgICAgICAgICAgaWYgKGxhc3RTbGFzaEluZGV4ICE9PSByZXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgICBpZiAobGFzdFNsYXNoSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmVzID0gJyc7XG4gICAgICAgICAgICAgICAgbGFzdFNlZ21lbnRMZW5ndGggPSAwO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlcyA9IHJlcy5zbGljZSgwLCBsYXN0U2xhc2hJbmRleCk7XG4gICAgICAgICAgICAgICAgbGFzdFNlZ21lbnRMZW5ndGggPSByZXMubGVuZ3RoIC0gMSAtIHJlcy5sYXN0SW5kZXhPZignLycpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGxhc3RTbGFzaCA9IGk7XG4gICAgICAgICAgICAgIGRvdHMgPSAwO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHJlcy5sZW5ndGggPT09IDIgfHwgcmVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmVzID0gJyc7XG4gICAgICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IDA7XG4gICAgICAgICAgICBsYXN0U2xhc2ggPSBpO1xuICAgICAgICAgICAgZG90cyA9IDA7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGFsbG93QWJvdmVSb290KSB7XG4gICAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwKVxuICAgICAgICAgICAgcmVzICs9ICcvLi4nO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlcyA9ICcuLic7XG4gICAgICAgICAgbGFzdFNlZ21lbnRMZW5ndGggPSAyO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDApXG4gICAgICAgICAgcmVzICs9ICcvJyArIHBhdGguc2xpY2UobGFzdFNsYXNoICsgMSwgaSk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXMgPSBwYXRoLnNsaWNlKGxhc3RTbGFzaCArIDEsIGkpO1xuICAgICAgICBsYXN0U2VnbWVudExlbmd0aCA9IGkgLSBsYXN0U2xhc2ggLSAxO1xuICAgICAgfVxuICAgICAgbGFzdFNsYXNoID0gaTtcbiAgICAgIGRvdHMgPSAwO1xuICAgIH0gZWxzZSBpZiAoY29kZSA9PT0gNDYgLyouKi8gJiYgZG90cyAhPT0gLTEpIHtcbiAgICAgICsrZG90cztcbiAgICB9IGVsc2Uge1xuICAgICAgZG90cyA9IC0xO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzO1xufVxuXG5mdW5jdGlvbiBfZm9ybWF0KHNlcCwgcGF0aE9iamVjdCkge1xuICB2YXIgZGlyID0gcGF0aE9iamVjdC5kaXIgfHwgcGF0aE9iamVjdC5yb290O1xuICB2YXIgYmFzZSA9IHBhdGhPYmplY3QuYmFzZSB8fCAocGF0aE9iamVjdC5uYW1lIHx8ICcnKSArIChwYXRoT2JqZWN0LmV4dCB8fCAnJyk7XG4gIGlmICghZGlyKSB7XG4gICAgcmV0dXJuIGJhc2U7XG4gIH1cbiAgaWYgKGRpciA9PT0gcGF0aE9iamVjdC5yb290KSB7XG4gICAgcmV0dXJuIGRpciArIGJhc2U7XG4gIH1cbiAgcmV0dXJuIGRpciArIHNlcCArIGJhc2U7XG59XG5cbnZhciBwb3NpeCA9IHtcbiAgLy8gcGF0aC5yZXNvbHZlKFtmcm9tIC4uLl0sIHRvKVxuICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKCkge1xuICAgIHZhciByZXNvbHZlZFBhdGggPSAnJztcbiAgICB2YXIgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuICAgIHZhciBjd2Q7XG5cbiAgICBmb3IgKHZhciBpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGkgPj0gLTEgJiYgIXJlc29sdmVkQWJzb2x1dGU7IGktLSkge1xuICAgICAgdmFyIHBhdGg7XG4gICAgICBpZiAoaSA+PSAwKVxuICAgICAgICBwYXRoID0gYXJndW1lbnRzW2ldO1xuICAgICAgZWxzZSB7XG4gICAgICAgIGlmIChjd2QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICBjd2QgPSBwcm9jZXNzLmN3ZCgpO1xuICAgICAgICBwYXRoID0gY3dkO1xuICAgICAgfVxuXG4gICAgICBhc3NlcnRQYXRoKHBhdGgpO1xuXG4gICAgICAvLyBTa2lwIGVtcHR5IGVudHJpZXNcbiAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgcmVzb2x2ZWRQYXRoID0gcGF0aCArICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICAgIHJlc29sdmVkQWJzb2x1dGUgPSBwYXRoLmNoYXJDb2RlQXQoMCkgPT09IDQ3IC8qLyovO1xuICAgIH1cblxuICAgIC8vIEF0IHRoaXMgcG9pbnQgdGhlIHBhdGggc2hvdWxkIGJlIHJlc29sdmVkIHRvIGEgZnVsbCBhYnNvbHV0ZSBwYXRoLCBidXRcbiAgICAvLyBoYW5kbGUgcmVsYXRpdmUgcGF0aHMgdG8gYmUgc2FmZSAobWlnaHQgaGFwcGVuIHdoZW4gcHJvY2Vzcy5jd2QoKSBmYWlscylcblxuICAgIC8vIE5vcm1hbGl6ZSB0aGUgcGF0aFxuICAgIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZVN0cmluZ1Bvc2l4KHJlc29sdmVkUGF0aCwgIXJlc29sdmVkQWJzb2x1dGUpO1xuXG4gICAgaWYgKHJlc29sdmVkQWJzb2x1dGUpIHtcbiAgICAgIGlmIChyZXNvbHZlZFBhdGgubGVuZ3RoID4gMClcbiAgICAgICAgcmV0dXJuICcvJyArIHJlc29sdmVkUGF0aDtcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuICcvJztcbiAgICB9IGVsc2UgaWYgKHJlc29sdmVkUGF0aC5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZWRQYXRoO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJy4nO1xuICAgIH1cbiAgfSxcblxuICBub3JtYWxpemU6IGZ1bmN0aW9uIG5vcm1hbGl6ZShwYXRoKSB7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcblxuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcuJztcblxuICAgIHZhciBpc0Fic29sdXRlID0gcGF0aC5jaGFyQ29kZUF0KDApID09PSA0NyAvKi8qLztcbiAgICB2YXIgdHJhaWxpbmdTZXBhcmF0b3IgPSBwYXRoLmNoYXJDb2RlQXQocGF0aC5sZW5ndGggLSAxKSA9PT0gNDcgLyovKi87XG5cbiAgICAvLyBOb3JtYWxpemUgdGhlIHBhdGhcbiAgICBwYXRoID0gbm9ybWFsaXplU3RyaW5nUG9zaXgocGF0aCwgIWlzQWJzb2x1dGUpO1xuXG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAwICYmICFpc0Fic29sdXRlKSBwYXRoID0gJy4nO1xuICAgIGlmIChwYXRoLmxlbmd0aCA+IDAgJiYgdHJhaWxpbmdTZXBhcmF0b3IpIHBhdGggKz0gJy8nO1xuXG4gICAgaWYgKGlzQWJzb2x1dGUpIHJldHVybiAnLycgKyBwYXRoO1xuICAgIHJldHVybiBwYXRoO1xuICB9LFxuXG4gIGlzQWJzb2x1dGU6IGZ1bmN0aW9uIGlzQWJzb2x1dGUocGF0aCkge1xuICAgIGFzc2VydFBhdGgocGF0aCk7XG4gICAgcmV0dXJuIHBhdGgubGVuZ3RoID4gMCAmJiBwYXRoLmNoYXJDb2RlQXQoMCkgPT09IDQ3IC8qLyovO1xuICB9LFxuXG4gIGpvaW46IGZ1bmN0aW9uIGpvaW4oKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gJy4nO1xuICAgIHZhciBqb2luZWQ7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyArK2kpIHtcbiAgICAgIHZhciBhcmcgPSBhcmd1bWVudHNbaV07XG4gICAgICBhc3NlcnRQYXRoKGFyZyk7XG4gICAgICBpZiAoYXJnLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKGpvaW5lZCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgIGpvaW5lZCA9IGFyZztcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGpvaW5lZCArPSAnLycgKyBhcmc7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChqb2luZWQgPT09IHVuZGVmaW5lZClcbiAgICAgIHJldHVybiAnLic7XG4gICAgcmV0dXJuIHBvc2l4Lm5vcm1hbGl6ZShqb2luZWQpO1xuICB9LFxuXG4gIHJlbGF0aXZlOiBmdW5jdGlvbiByZWxhdGl2ZShmcm9tLCB0bykge1xuICAgIGFzc2VydFBhdGgoZnJvbSk7XG4gICAgYXNzZXJ0UGF0aCh0byk7XG5cbiAgICBpZiAoZnJvbSA9PT0gdG8pIHJldHVybiAnJztcblxuICAgIGZyb20gPSBwb3NpeC5yZXNvbHZlKGZyb20pO1xuICAgIHRvID0gcG9zaXgucmVzb2x2ZSh0byk7XG5cbiAgICBpZiAoZnJvbSA9PT0gdG8pIHJldHVybiAnJztcblxuICAgIC8vIFRyaW0gYW55IGxlYWRpbmcgYmFja3NsYXNoZXNcbiAgICB2YXIgZnJvbVN0YXJ0ID0gMTtcbiAgICBmb3IgKDsgZnJvbVN0YXJ0IDwgZnJvbS5sZW5ndGg7ICsrZnJvbVN0YXJ0KSB7XG4gICAgICBpZiAoZnJvbS5jaGFyQ29kZUF0KGZyb21TdGFydCkgIT09IDQ3IC8qLyovKVxuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgdmFyIGZyb21FbmQgPSBmcm9tLmxlbmd0aDtcbiAgICB2YXIgZnJvbUxlbiA9IGZyb21FbmQgLSBmcm9tU3RhcnQ7XG5cbiAgICAvLyBUcmltIGFueSBsZWFkaW5nIGJhY2tzbGFzaGVzXG4gICAgdmFyIHRvU3RhcnQgPSAxO1xuICAgIGZvciAoOyB0b1N0YXJ0IDwgdG8ubGVuZ3RoOyArK3RvU3RhcnQpIHtcbiAgICAgIGlmICh0by5jaGFyQ29kZUF0KHRvU3RhcnQpICE9PSA0NyAvKi8qLylcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHZhciB0b0VuZCA9IHRvLmxlbmd0aDtcbiAgICB2YXIgdG9MZW4gPSB0b0VuZCAtIHRvU3RhcnQ7XG5cbiAgICAvLyBDb21wYXJlIHBhdGhzIHRvIGZpbmQgdGhlIGxvbmdlc3QgY29tbW9uIHBhdGggZnJvbSByb290XG4gICAgdmFyIGxlbmd0aCA9IGZyb21MZW4gPCB0b0xlbiA/IGZyb21MZW4gOiB0b0xlbjtcbiAgICB2YXIgbGFzdENvbW1vblNlcCA9IC0xO1xuICAgIHZhciBpID0gMDtcbiAgICBmb3IgKDsgaSA8PSBsZW5ndGg7ICsraSkge1xuICAgICAgaWYgKGkgPT09IGxlbmd0aCkge1xuICAgICAgICBpZiAodG9MZW4gPiBsZW5ndGgpIHtcbiAgICAgICAgICBpZiAodG8uY2hhckNvZGVBdCh0b1N0YXJ0ICsgaSkgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgICAgICAvLyBXZSBnZXQgaGVyZSBpZiBgZnJvbWAgaXMgdGhlIGV4YWN0IGJhc2UgcGF0aCBmb3IgYHRvYC5cbiAgICAgICAgICAgIC8vIEZvciBleGFtcGxlOiBmcm9tPScvZm9vL2Jhcic7IHRvPScvZm9vL2Jhci9iYXonXG4gICAgICAgICAgICByZXR1cm4gdG8uc2xpY2UodG9TdGFydCArIGkgKyAxKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGkgPT09IDApIHtcbiAgICAgICAgICAgIC8vIFdlIGdldCBoZXJlIGlmIGBmcm9tYCBpcyB0aGUgcm9vdFxuICAgICAgICAgICAgLy8gRm9yIGV4YW1wbGU6IGZyb209Jy8nOyB0bz0nL2ZvbydcbiAgICAgICAgICAgIHJldHVybiB0by5zbGljZSh0b1N0YXJ0ICsgaSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGZyb21MZW4gPiBsZW5ndGgpIHtcbiAgICAgICAgICBpZiAoZnJvbS5jaGFyQ29kZUF0KGZyb21TdGFydCArIGkpID09PSA0NyAvKi8qLykge1xuICAgICAgICAgICAgLy8gV2UgZ2V0IGhlcmUgaWYgYHRvYCBpcyB0aGUgZXhhY3QgYmFzZSBwYXRoIGZvciBgZnJvbWAuXG4gICAgICAgICAgICAvLyBGb3IgZXhhbXBsZTogZnJvbT0nL2Zvby9iYXIvYmF6JzsgdG89Jy9mb28vYmFyJ1xuICAgICAgICAgICAgbGFzdENvbW1vblNlcCA9IGk7XG4gICAgICAgICAgfSBlbHNlIGlmIChpID09PSAwKSB7XG4gICAgICAgICAgICAvLyBXZSBnZXQgaGVyZSBpZiBgdG9gIGlzIHRoZSByb290LlxuICAgICAgICAgICAgLy8gRm9yIGV4YW1wbGU6IGZyb209Jy9mb28nOyB0bz0nLydcbiAgICAgICAgICAgIGxhc3RDb21tb25TZXAgPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHZhciBmcm9tQ29kZSA9IGZyb20uY2hhckNvZGVBdChmcm9tU3RhcnQgKyBpKTtcbiAgICAgIHZhciB0b0NvZGUgPSB0by5jaGFyQ29kZUF0KHRvU3RhcnQgKyBpKTtcbiAgICAgIGlmIChmcm9tQ29kZSAhPT0gdG9Db2RlKVxuICAgICAgICBicmVhaztcbiAgICAgIGVsc2UgaWYgKGZyb21Db2RlID09PSA0NyAvKi8qLylcbiAgICAgICAgbGFzdENvbW1vblNlcCA9IGk7XG4gICAgfVxuXG4gICAgdmFyIG91dCA9ICcnO1xuICAgIC8vIEdlbmVyYXRlIHRoZSByZWxhdGl2ZSBwYXRoIGJhc2VkIG9uIHRoZSBwYXRoIGRpZmZlcmVuY2UgYmV0d2VlbiBgdG9gXG4gICAgLy8gYW5kIGBmcm9tYFxuICAgIGZvciAoaSA9IGZyb21TdGFydCArIGxhc3RDb21tb25TZXAgKyAxOyBpIDw9IGZyb21FbmQ7ICsraSkge1xuICAgICAgaWYgKGkgPT09IGZyb21FbmQgfHwgZnJvbS5jaGFyQ29kZUF0KGkpID09PSA0NyAvKi8qLykge1xuICAgICAgICBpZiAob3V0Lmxlbmd0aCA9PT0gMClcbiAgICAgICAgICBvdXQgKz0gJy4uJztcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG91dCArPSAnLy4uJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBMYXN0bHksIGFwcGVuZCB0aGUgcmVzdCBvZiB0aGUgZGVzdGluYXRpb24gKGB0b2ApIHBhdGggdGhhdCBjb21lcyBhZnRlclxuICAgIC8vIHRoZSBjb21tb24gcGF0aCBwYXJ0c1xuICAgIGlmIChvdXQubGVuZ3RoID4gMClcbiAgICAgIHJldHVybiBvdXQgKyB0by5zbGljZSh0b1N0YXJ0ICsgbGFzdENvbW1vblNlcCk7XG4gICAgZWxzZSB7XG4gICAgICB0b1N0YXJ0ICs9IGxhc3RDb21tb25TZXA7XG4gICAgICBpZiAodG8uY2hhckNvZGVBdCh0b1N0YXJ0KSA9PT0gNDcgLyovKi8pXG4gICAgICAgICsrdG9TdGFydDtcbiAgICAgIHJldHVybiB0by5zbGljZSh0b1N0YXJ0KTtcbiAgICB9XG4gIH0sXG5cbiAgX21ha2VMb25nOiBmdW5jdGlvbiBfbWFrZUxvbmcocGF0aCkge1xuICAgIHJldHVybiBwYXRoO1xuICB9LFxuXG4gIGRpcm5hbWU6IGZ1bmN0aW9uIGRpcm5hbWUocGF0aCkge1xuICAgIGFzc2VydFBhdGgocGF0aCk7XG4gICAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSByZXR1cm4gJy4nO1xuICAgIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KDApO1xuICAgIHZhciBoYXNSb290ID0gY29kZSA9PT0gNDcgLyovKi87XG4gICAgdmFyIGVuZCA9IC0xO1xuICAgIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICAgIGZvciAodmFyIGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMTsgLS1pKSB7XG4gICAgICBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xuICAgICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgICAgaWYgKCFtYXRjaGVkU2xhc2gpIHtcbiAgICAgICAgICAgIGVuZCA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yXG4gICAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlbmQgPT09IC0xKSByZXR1cm4gaGFzUm9vdCA/ICcvJyA6ICcuJztcbiAgICBpZiAoaGFzUm9vdCAmJiBlbmQgPT09IDEpIHJldHVybiAnLy8nO1xuICAgIHJldHVybiBwYXRoLnNsaWNlKDAsIGVuZCk7XG4gIH0sXG5cbiAgYmFzZW5hbWU6IGZ1bmN0aW9uIGJhc2VuYW1lKHBhdGgsIGV4dCkge1xuICAgIGlmIChleHQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZXh0ICE9PSAnc3RyaW5nJykgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJleHRcIiBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gICAgYXNzZXJ0UGF0aChwYXRoKTtcblxuICAgIHZhciBzdGFydCA9IDA7XG4gICAgdmFyIGVuZCA9IC0xO1xuICAgIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICAgIHZhciBpO1xuXG4gICAgaWYgKGV4dCAhPT0gdW5kZWZpbmVkICYmIGV4dC5sZW5ndGggPiAwICYmIGV4dC5sZW5ndGggPD0gcGF0aC5sZW5ndGgpIHtcbiAgICAgIGlmIChleHQubGVuZ3RoID09PSBwYXRoLmxlbmd0aCAmJiBleHQgPT09IHBhdGgpIHJldHVybiAnJztcbiAgICAgIHZhciBleHRJZHggPSBleHQubGVuZ3RoIC0gMTtcbiAgICAgIHZhciBmaXJzdE5vblNsYXNoRW5kID0gLTE7XG4gICAgICBmb3IgKGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xuICAgICAgICBpZiAoY29kZSA9PT0gNDcgLyovKi8pIHtcbiAgICAgICAgICAgIC8vIElmIHdlIHJlYWNoZWQgYSBwYXRoIHNlcGFyYXRvciB0aGF0IHdhcyBub3QgcGFydCBvZiBhIHNldCBvZiBwYXRoXG4gICAgICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcbiAgICAgICAgICAgIGlmICghbWF0Y2hlZFNsYXNoKSB7XG4gICAgICAgICAgICAgIHN0YXJ0ID0gaSArIDE7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGZpcnN0Tm9uU2xhc2hFbmQgPT09IC0xKSB7XG4gICAgICAgICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgcmVtZW1iZXIgdGhpcyBpbmRleCBpbiBjYXNlXG4gICAgICAgICAgICAvLyB3ZSBuZWVkIGl0IGlmIHRoZSBleHRlbnNpb24gZW5kcyB1cCBub3QgbWF0Y2hpbmdcbiAgICAgICAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgICAgICAgZmlyc3ROb25TbGFzaEVuZCA9IGkgKyAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZXh0SWR4ID49IDApIHtcbiAgICAgICAgICAgIC8vIFRyeSB0byBtYXRjaCB0aGUgZXhwbGljaXQgZXh0ZW5zaW9uXG4gICAgICAgICAgICBpZiAoY29kZSA9PT0gZXh0LmNoYXJDb2RlQXQoZXh0SWR4KSkge1xuICAgICAgICAgICAgICBpZiAoLS1leHRJZHggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgLy8gV2UgbWF0Y2hlZCB0aGUgZXh0ZW5zaW9uLCBzbyBtYXJrIHRoaXMgYXMgdGhlIGVuZCBvZiBvdXIgcGF0aFxuICAgICAgICAgICAgICAgIC8vIGNvbXBvbmVudFxuICAgICAgICAgICAgICAgIGVuZCA9IGk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIC8vIEV4dGVuc2lvbiBkb2VzIG5vdCBtYXRjaCwgc28gb3VyIHJlc3VsdCBpcyB0aGUgZW50aXJlIHBhdGhcbiAgICAgICAgICAgICAgLy8gY29tcG9uZW50XG4gICAgICAgICAgICAgIGV4dElkeCA9IC0xO1xuICAgICAgICAgICAgICBlbmQgPSBmaXJzdE5vblNsYXNoRW5kO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoc3RhcnQgPT09IGVuZCkgZW5kID0gZmlyc3ROb25TbGFzaEVuZDtlbHNlIGlmIChlbmQgPT09IC0xKSBlbmQgPSBwYXRoLmxlbmd0aDtcbiAgICAgIHJldHVybiBwYXRoLnNsaWNlKHN0YXJ0LCBlbmQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGkgPSBwYXRoLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIGlmIChwYXRoLmNoYXJDb2RlQXQoaSkgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgICAgICAvLyBJZiB3ZSByZWFjaGVkIGEgcGF0aCBzZXBhcmF0b3IgdGhhdCB3YXMgbm90IHBhcnQgb2YgYSBzZXQgb2YgcGF0aFxuICAgICAgICAgICAgLy8gc2VwYXJhdG9ycyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcsIHN0b3Agbm93XG4gICAgICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgICAgICBzdGFydCA9IGkgKyAxO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGVuZCA9PT0gLTEpIHtcbiAgICAgICAgICAvLyBXZSBzYXcgdGhlIGZpcnN0IG5vbi1wYXRoIHNlcGFyYXRvciwgbWFyayB0aGlzIGFzIHRoZSBlbmQgb2Ygb3VyXG4gICAgICAgICAgLy8gcGF0aCBjb21wb25lbnRcbiAgICAgICAgICBtYXRjaGVkU2xhc2ggPSBmYWxzZTtcbiAgICAgICAgICBlbmQgPSBpICsgMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZW5kID09PSAtMSkgcmV0dXJuICcnO1xuICAgICAgcmV0dXJuIHBhdGguc2xpY2Uoc3RhcnQsIGVuZCk7XG4gICAgfVxuICB9LFxuXG4gIGV4dG5hbWU6IGZ1bmN0aW9uIGV4dG5hbWUocGF0aCkge1xuICAgIGFzc2VydFBhdGgocGF0aCk7XG4gICAgdmFyIHN0YXJ0RG90ID0gLTE7XG4gICAgdmFyIHN0YXJ0UGFydCA9IDA7XG4gICAgdmFyIGVuZCA9IC0xO1xuICAgIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICAgIC8vIFRyYWNrIHRoZSBzdGF0ZSBvZiBjaGFyYWN0ZXJzIChpZiBhbnkpIHdlIHNlZSBiZWZvcmUgb3VyIGZpcnN0IGRvdCBhbmRcbiAgICAvLyBhZnRlciBhbnkgcGF0aCBzZXBhcmF0b3Igd2UgZmluZFxuICAgIHZhciBwcmVEb3RTdGF0ZSA9IDA7XG4gICAgZm9yICh2YXIgaSA9IHBhdGgubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgIHZhciBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xuICAgICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcbiAgICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcbiAgICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgICAgc3RhcnRQYXJ0ID0gaSArIDE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIGlmIChlbmQgPT09IC0xKSB7XG4gICAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yLCBtYXJrIHRoaXMgYXMgdGhlIGVuZCBvZiBvdXJcbiAgICAgICAgLy8gZXh0ZW5zaW9uXG4gICAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgICBlbmQgPSBpICsgMTtcbiAgICAgIH1cbiAgICAgIGlmIChjb2RlID09PSA0NiAvKi4qLykge1xuICAgICAgICAgIC8vIElmIHRoaXMgaXMgb3VyIGZpcnN0IGRvdCwgbWFyayBpdCBhcyB0aGUgc3RhcnQgb2Ygb3VyIGV4dGVuc2lvblxuICAgICAgICAgIGlmIChzdGFydERvdCA9PT0gLTEpXG4gICAgICAgICAgICBzdGFydERvdCA9IGk7XG4gICAgICAgICAgZWxzZSBpZiAocHJlRG90U3RhdGUgIT09IDEpXG4gICAgICAgICAgICBwcmVEb3RTdGF0ZSA9IDE7XG4gICAgICB9IGVsc2UgaWYgKHN0YXJ0RG90ICE9PSAtMSkge1xuICAgICAgICAvLyBXZSBzYXcgYSBub24tZG90IGFuZCBub24tcGF0aCBzZXBhcmF0b3IgYmVmb3JlIG91ciBkb3QsIHNvIHdlIHNob3VsZFxuICAgICAgICAvLyBoYXZlIGEgZ29vZCBjaGFuY2UgYXQgaGF2aW5nIGEgbm9uLWVtcHR5IGV4dGVuc2lvblxuICAgICAgICBwcmVEb3RTdGF0ZSA9IC0xO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdGFydERvdCA9PT0gLTEgfHwgZW5kID09PSAtMSB8fFxuICAgICAgICAvLyBXZSBzYXcgYSBub24tZG90IGNoYXJhY3RlciBpbW1lZGlhdGVseSBiZWZvcmUgdGhlIGRvdFxuICAgICAgICBwcmVEb3RTdGF0ZSA9PT0gMCB8fFxuICAgICAgICAvLyBUaGUgKHJpZ2h0LW1vc3QpIHRyaW1tZWQgcGF0aCBjb21wb25lbnQgaXMgZXhhY3RseSAnLi4nXG4gICAgICAgIHByZURvdFN0YXRlID09PSAxICYmIHN0YXJ0RG90ID09PSBlbmQgLSAxICYmIHN0YXJ0RG90ID09PSBzdGFydFBhcnQgKyAxKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHJldHVybiBwYXRoLnNsaWNlKHN0YXJ0RG90LCBlbmQpO1xuICB9LFxuXG4gIGZvcm1hdDogZnVuY3Rpb24gZm9ybWF0KHBhdGhPYmplY3QpIHtcbiAgICBpZiAocGF0aE9iamVjdCA9PT0gbnVsbCB8fCB0eXBlb2YgcGF0aE9iamVjdCAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcInBhdGhPYmplY3RcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgT2JqZWN0LiBSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2YgcGF0aE9iamVjdCk7XG4gICAgfVxuICAgIHJldHVybiBfZm9ybWF0KCcvJywgcGF0aE9iamVjdCk7XG4gIH0sXG5cbiAgcGFyc2U6IGZ1bmN0aW9uIHBhcnNlKHBhdGgpIHtcbiAgICBhc3NlcnRQYXRoKHBhdGgpO1xuXG4gICAgdmFyIHJldCA9IHsgcm9vdDogJycsIGRpcjogJycsIGJhc2U6ICcnLCBleHQ6ICcnLCBuYW1lOiAnJyB9O1xuICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHJldDtcbiAgICB2YXIgY29kZSA9IHBhdGguY2hhckNvZGVBdCgwKTtcbiAgICB2YXIgaXNBYnNvbHV0ZSA9IGNvZGUgPT09IDQ3IC8qLyovO1xuICAgIHZhciBzdGFydDtcbiAgICBpZiAoaXNBYnNvbHV0ZSkge1xuICAgICAgcmV0LnJvb3QgPSAnLyc7XG4gICAgICBzdGFydCA9IDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgdmFyIHN0YXJ0RG90ID0gLTE7XG4gICAgdmFyIHN0YXJ0UGFydCA9IDA7XG4gICAgdmFyIGVuZCA9IC0xO1xuICAgIHZhciBtYXRjaGVkU2xhc2ggPSB0cnVlO1xuICAgIHZhciBpID0gcGF0aC5sZW5ndGggLSAxO1xuXG4gICAgLy8gVHJhY2sgdGhlIHN0YXRlIG9mIGNoYXJhY3RlcnMgKGlmIGFueSkgd2Ugc2VlIGJlZm9yZSBvdXIgZmlyc3QgZG90IGFuZFxuICAgIC8vIGFmdGVyIGFueSBwYXRoIHNlcGFyYXRvciB3ZSBmaW5kXG4gICAgdmFyIHByZURvdFN0YXRlID0gMDtcblxuICAgIC8vIEdldCBub24tZGlyIGluZm9cbiAgICBmb3IgKDsgaSA+PSBzdGFydDsgLS1pKSB7XG4gICAgICBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xuICAgICAgaWYgKGNvZGUgPT09IDQ3IC8qLyovKSB7XG4gICAgICAgICAgLy8gSWYgd2UgcmVhY2hlZCBhIHBhdGggc2VwYXJhdG9yIHRoYXQgd2FzIG5vdCBwYXJ0IG9mIGEgc2V0IG9mIHBhdGhcbiAgICAgICAgICAvLyBzZXBhcmF0b3JzIGF0IHRoZSBlbmQgb2YgdGhlIHN0cmluZywgc3RvcCBub3dcbiAgICAgICAgICBpZiAoIW1hdGNoZWRTbGFzaCkge1xuICAgICAgICAgICAgc3RhcnRQYXJ0ID0gaSArIDE7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIGlmIChlbmQgPT09IC0xKSB7XG4gICAgICAgIC8vIFdlIHNhdyB0aGUgZmlyc3Qgbm9uLXBhdGggc2VwYXJhdG9yLCBtYXJrIHRoaXMgYXMgdGhlIGVuZCBvZiBvdXJcbiAgICAgICAgLy8gZXh0ZW5zaW9uXG4gICAgICAgIG1hdGNoZWRTbGFzaCA9IGZhbHNlO1xuICAgICAgICBlbmQgPSBpICsgMTtcbiAgICAgIH1cbiAgICAgIGlmIChjb2RlID09PSA0NiAvKi4qLykge1xuICAgICAgICAgIC8vIElmIHRoaXMgaXMgb3VyIGZpcnN0IGRvdCwgbWFyayBpdCBhcyB0aGUgc3RhcnQgb2Ygb3VyIGV4dGVuc2lvblxuICAgICAgICAgIGlmIChzdGFydERvdCA9PT0gLTEpIHN0YXJ0RG90ID0gaTtlbHNlIGlmIChwcmVEb3RTdGF0ZSAhPT0gMSkgcHJlRG90U3RhdGUgPSAxO1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXJ0RG90ICE9PSAtMSkge1xuICAgICAgICAvLyBXZSBzYXcgYSBub24tZG90IGFuZCBub24tcGF0aCBzZXBhcmF0b3IgYmVmb3JlIG91ciBkb3QsIHNvIHdlIHNob3VsZFxuICAgICAgICAvLyBoYXZlIGEgZ29vZCBjaGFuY2UgYXQgaGF2aW5nIGEgbm9uLWVtcHR5IGV4dGVuc2lvblxuICAgICAgICBwcmVEb3RTdGF0ZSA9IC0xO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdGFydERvdCA9PT0gLTEgfHwgZW5kID09PSAtMSB8fFxuICAgIC8vIFdlIHNhdyBhIG5vbi1kb3QgY2hhcmFjdGVyIGltbWVkaWF0ZWx5IGJlZm9yZSB0aGUgZG90XG4gICAgcHJlRG90U3RhdGUgPT09IDAgfHxcbiAgICAvLyBUaGUgKHJpZ2h0LW1vc3QpIHRyaW1tZWQgcGF0aCBjb21wb25lbnQgaXMgZXhhY3RseSAnLi4nXG4gICAgcHJlRG90U3RhdGUgPT09IDEgJiYgc3RhcnREb3QgPT09IGVuZCAtIDEgJiYgc3RhcnREb3QgPT09IHN0YXJ0UGFydCArIDEpIHtcbiAgICAgIGlmIChlbmQgIT09IC0xKSB7XG4gICAgICAgIGlmIChzdGFydFBhcnQgPT09IDAgJiYgaXNBYnNvbHV0ZSkgcmV0LmJhc2UgPSByZXQubmFtZSA9IHBhdGguc2xpY2UoMSwgZW5kKTtlbHNlIHJldC5iYXNlID0gcmV0Lm5hbWUgPSBwYXRoLnNsaWNlKHN0YXJ0UGFydCwgZW5kKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHN0YXJ0UGFydCA9PT0gMCAmJiBpc0Fic29sdXRlKSB7XG4gICAgICAgIHJldC5uYW1lID0gcGF0aC5zbGljZSgxLCBzdGFydERvdCk7XG4gICAgICAgIHJldC5iYXNlID0gcGF0aC5zbGljZSgxLCBlbmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0Lm5hbWUgPSBwYXRoLnNsaWNlKHN0YXJ0UGFydCwgc3RhcnREb3QpO1xuICAgICAgICByZXQuYmFzZSA9IHBhdGguc2xpY2Uoc3RhcnRQYXJ0LCBlbmQpO1xuICAgICAgfVxuICAgICAgcmV0LmV4dCA9IHBhdGguc2xpY2Uoc3RhcnREb3QsIGVuZCk7XG4gICAgfVxuXG4gICAgaWYgKHN0YXJ0UGFydCA+IDApIHJldC5kaXIgPSBwYXRoLnNsaWNlKDAsIHN0YXJ0UGFydCAtIDEpO2Vsc2UgaWYgKGlzQWJzb2x1dGUpIHJldC5kaXIgPSAnLyc7XG5cbiAgICByZXR1cm4gcmV0O1xuICB9LFxuXG4gIHNlcDogJy8nLFxuICBkZWxpbWl0ZXI6ICc6JyxcbiAgd2luMzI6IG51bGwsXG4gIHBvc2l4OiBudWxsXG59O1xuXG5wb3NpeC5wb3NpeCA9IHBvc2l4O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHBvc2l4O1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsImltcG9ydCB7UGFyc2VyLCBQYXJzZVRyZWUsIGNvbXBpbGV9IGZyb20gXCJwYXJzZXJsaWJcIjtcbmltcG9ydCB7IFB1enpsZSwgU3RhckJhdHRsZUNlbGwsIFBvc2l0aW9uIH0gZnJvbSBcIi4vUHV6emxlXCI7XG5pbXBvcnQgYXNzZXJ0IGZyb20gXCJhc3NlcnRcIjtcblxuY29uc3QgZ3JhbW1hciA9IGBcbkBza2lwIHdoaXRlc3BhY2Uge1xuICAgIHN0YXJCYXR0bGUgOjo9IChjb21tZW50IG5ld0xpbmUpKiBzaXplRXhwcmVzc2lvbiBuZXdMaW5lICgocmVnaW9uIHwgY29tbWVudCkgbmV3TGluZSkqO1xuICAgIHNpemVFeHByZXNzaW9uIDo6PSBudW1iZXIgJ3gnIG51bWJlciBjb21tZW50PztcbiAgICByZWdpb24gOjo9IChjb29yZFN0YXIpKiAnfCcgKGNvb3JkKSogY29tbWVudD87XG4gICAgY29vcmRTdGFyIDo6PSBudW1iZXIgJywnIG51bWJlcjtcbiAgICBjb29yZCA6Oj0gbnVtYmVyICcsJyBudW1iZXI7XG4gICAgY29tbWVudCA6Oj0gJyMnIFteXFxcXG5dKjtcbn1cbm51bWJlciA6Oj0gWzAtOV0rO1xud2hpdGVzcGFjZSA6Oj0gWyBcXFxcdFxcXFxyXSs7XG5uZXdMaW5lIDo6PSBbXFxcXG5dKztcbmA7XG5cbmVudW0gU3RhckJhdHRsZVN5bWJvbHMge1xuICAgIFN0YXJCYXR0bGUsXG4gICAgQ29tbWVudCxcbiAgICBTaXplRXhwcmVzc2lvbixcbiAgICBSZWdpb24sXG4gICAgQ29vcmRTdGFyLFxuICAgIENvb3JkLFxuICAgIE51bWJlcixcbiAgICBXaGl0ZXNwYWNlLFxuICAgIE5ld0xpbmVcbn1cblxuY29uc3QgcGFyc2VyOiBQYXJzZXI8U3RhckJhdHRsZVN5bWJvbHM+ID0gY29tcGlsZShncmFtbWFyLCBTdGFyQmF0dGxlU3ltYm9scywgU3RhckJhdHRsZVN5bWJvbHMuU3RhckJhdHRsZSk7XG5cbi8qKlxuICogUGFyc2UgYSBzdHJpbmcgaW50byBhIFN0YXJCYXR0bGVQdXp6bGUuXG4gKlxuICogQHBhcmFtIGlucHV0IHN0cmluZyB0byBwYXJzZVxuICogQHJldHVybnMgU3RhckJhdHRsZVB1enpsZSBwYXJzZWQgZnJvbSB0aGUgc3RyaW5nXG4gKiBAdGhyb3dzIEVycm9yIGlmIHRoZSBzdHJpbmcgZG9lc24ndCBtYXRjaCB0aGUgU3RhciBCYXR0bGUgZ3JhbW1hci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlKGlucHV0OiBzdHJpbmcpOiBQdXp6bGUge1xuICAgIGNvbnN0IHBhcnNlVHJlZSA9IHBhcnNlci5wYXJzZShpbnB1dCArICdcXG4nKTtcblxuICAgIGNvbnN0IHNpemVFeHByZXNzaW9uID0gcGFyc2VUcmVlLmNoaWxkcmVuQnlOYW1lKFN0YXJCYXR0bGVTeW1ib2xzLlNpemVFeHByZXNzaW9uKS5hdCgwKSA/PyBhc3NlcnQuZmFpbCgpO1xuXG4gICAgLy8gZ2V0IHRoZSBkaW1lbnNpb25zXG4gICAgY29uc3QgZGltcyA9IHNpemVFeHByZXNzaW9uXG4gICAgICAgICAgICAgICAgICAgIC5jaGlsZHJlbkJ5TmFtZShTdGFyQmF0dGxlU3ltYm9scy5OdW1iZXIpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAobm9kZSA9PiBub2RlLnRleHQpXG4gICAgICAgICAgICAgICAgICAgIC5tYXAobnVtID0+IHBhcnNlSW50KG51bSkpO1xuICAgXG4gICAgLy8gZ2V0IHRoZSBwb3NpdGlvbnMgb2YgdGhlIHN0YXJzXG4gICAgY29uc3Qgc3RhcnMgPSBwYXJzZVRyZWVcbiAgICAgICAgICAgICAgICAgICAgICAgIC5jaGlsZHJlbkJ5TmFtZShTdGFyQmF0dGxlU3ltYm9scy5SZWdpb24pXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmxhdE1hcChyZWdpb24gPT4gcmVnaW9uLmNoaWxkcmVuQnlOYW1lKFN0YXJCYXR0bGVTeW1ib2xzLkNvb3JkU3RhcikpO1xuICAgIFxuICAgIC8vIGdldCBlYWNoIGluZGl2aWR1YWwgcmVnaW9ucyBhcyBBcnJheTxBcnJheTxQb3NpdGlvbj4+XG4gICAgY29uc3QgcmVnaW9ucyA9IHBhcnNlVHJlZVxuICAgICAgICAgICAgICAgICAgICAgICAgLmNoaWxkcmVuQnlOYW1lKFN0YXJCYXR0bGVTeW1ib2xzLlJlZ2lvbilcbiAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAocmVnaW9uID0+IHJlZ2lvbi5jaGlsZHJlbi5maWx0ZXIoY2hpbGQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5uYW1lID09PSBTdGFyQmF0dGxlU3ltYm9scy5Db29yZCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfHwgY2hpbGQubmFtZSA9PT0gU3RhckJhdHRsZVN5bWJvbHMuQ29vcmRTdGFyO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKGV4dHJhY3RQb3NpdGlvbnMpO1xuXG4gICAgY29uc3QgW3Jvd3MsIGNvbHNdID0gZGltcztcbiAgICBhc3NlcnQocm93cyAhPT0gdW5kZWZpbmVkKTtcbiAgICBhc3NlcnQoY29scyAhPT0gdW5kZWZpbmVkKTtcbiAgICBcbiAgICAvLyBjcmVhdGUgYW4gZW1wdHkgYm9hcmRcbiAgICBjb25zdCBib2FyZCA9IG5ldyBBcnJheShyb3dzKS5maWxsKDApLm1hcChyb3cgPT4gbmV3IEFycmF5KGNvbHMpLmZpbGwoMCkubWFwKFxuICAgICAgICBjb2wgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBjb250YWluc1N0YXI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJlZ2lvbklkOiAwXG4gICAgICAgICAgICB9O1xuICAgICAgICB9IFxuICAgICkpO1xuXG4gICAgLy8gcHV0cyBzdGFycyBvbiB0aGUgZW1wdHkgYm9hcmRcbiAgICBleHRyYWN0UG9zaXRpb25zKHN0YXJzKS5tYXAocG9zaXRpb24gPT4ge1xuICAgICAgICBjb25zdCBib2FyZFJvdyA9IGJvYXJkW3Bvc2l0aW9uLnJvdyAtIDFdID8/IGFzc2VydC5mYWlsKCk7XG4gICAgICAgIGNvbnN0IGJvYXJkQ2VsbCA9IGJvYXJkUm93W3Bvc2l0aW9uLmNvbCAtIDFdID8/IGFzc2VydC5mYWlsKCk7XG4gICAgICAgIGJvYXJkQ2VsbC5jb250YWluc1N0YXIgPSB0cnVlO1xuICAgIH0pO1xuICAgIFxuICAgIC8vIGFzc2lnbiByZWdpb25zIG9uIHRoZSBlbXB0eSBib2FyZFxuICAgIHJlZ2lvbnMubWFwKChyZWdpb24sIGkpID0+IHtcbiAgICAgICAgcmVnaW9uLm1hcChwb3NpdGlvbiA9PiB7XG4gICAgICAgICAgICBjb25zdCBib2FyZFJvdyA9IGJvYXJkW3Bvc2l0aW9uLnJvdyAtIDFdID8/IGFzc2VydC5mYWlsKCk7XG4gICAgICAgICAgICBjb25zdCBib2FyZENlbGwgPSBib2FyZFJvd1twb3NpdGlvbi5jb2wgLSAxXSA/PyBhc3NlcnQuZmFpbCgpO1xuICAgICAgICAgICAgYm9hcmRDZWxsLnJlZ2lvbklkID0gaTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG5ldyBQdXp6bGUocm93cywgY29scywgYm9hcmQpO1xufVxuXG5cbi8qKlxuICogRnJvbSBhbiBhcnJheSBvZiBDb29yZCBvciBDb29yZFN0YXIgbm9kZXMsIGV4dHJhY3RzIGFsbCBwb3NpdGlvbnMgb2YgdGhlIGNvb3JkaW5hdGVzXG4gKiBhbmQgcmV0dXJucyB0aGVtIGFzIGFuIGFycmF5IG9mIFBvc2l0aW9uIG9iamVjdHNcbiAqIFxuICogQHBhcmFtIGxpbmUgdGhlIGFycmF5IG9mIENvb3JkIG9yIENvb3JkU3RhciBub2RlcyByZXByZXNlbnRpbmcgdGhlIGNvb3JkaW5hdGVzIGZvciBhIHBhcnRpY3VsYXIgcmVnaW9uXG4gKiBAcmV0dXJucyBhbiBhcnJheSBvZiBQb3NpdGlvbiBvYmplY3RzIHRoYXQgcmVwcmVzZW50cyB0aGUgc2FtZSBjb29yZGluYXRlcyBhcyBsaW5lXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RQb3NpdGlvbnMobGluZSA6IEFycmF5PFBhcnNlVHJlZTxTdGFyQmF0dGxlU3ltYm9scz4+KTogQXJyYXk8UG9zaXRpb24+IHtcbiAgICByZXR1cm4gbGluZS5tYXAoY29vcmQgPT4gY29vcmQuY2hpbGRyZW5CeU5hbWUoU3RhckJhdHRsZVN5bWJvbHMuTnVtYmVyKSlcbiAgICAgICAgICAgICAgIC5tYXAobm9kZSA9PiBub2RlLm1hcChudW1iZXIgPT4gcGFyc2VJbnQobnVtYmVyLnRleHQpKSlcbiAgICAgICAgICAgICAgIC5tYXAobnVtYmVycyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3c6IG51bWJlcnNbMF0gPz8gYXNzZXJ0LmZhaWwoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbDogbnVtYmVyc1sxXSA/PyBhc3NlcnQuZmFpbCgpXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICB9KTtcbn1cbiIsImltcG9ydCBhc3NlcnQgZnJvbSBcImFzc2VydFwiO1xuXG4vKipcbiAqIEltbXV0YWJsZSByZWNvcmQgdHlwZSByZXByZXNlbnRpbmcgYSBzaW5nbGUgY2VsbCBpbiBhIFN0YXIgQmF0dGxlIFB1enpsZS5cbiAqXG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGNvbnRhaW5zU3RhciAtIHdoZXRoZXIgdGhpcyBjZWxsIGlzIG1hcmtlZCB3aXRoIGEgc3Rhci5cbiAqIEBwcm9wZXJ0eSB7bnVtYmVyfSByZWdpb25JZC0gbnVtZXJpY2FsIGlkIGlkZW50aWZ5aW5nIHRoZSB1bmlxdWUgcmVnaW9uIGluIHRoZSBwdXp6bGUgdGhpcyBjZWxsIGJlbG9uZ3MgdG8uXG4gKi9cbmV4cG9ydCB0eXBlIFN0YXJCYXR0bGVDZWxsID0ge1xuICAgIHJlYWRvbmx5IGNvbnRhaW5zU3RhcjogYm9vbGVhbjtcbiAgICByZWFkb25seSByZWdpb25JZDogbnVtYmVyO1xufTtcblxuLyoqXG4gKiBJbW11dGFibGUgcmVjb3JkIHR5cGUgcmVwcmVzZW50aW5nIGEgcG9zaXRpb24gd2l0aCB4IGFuZCB5IHZhbHVlIHN1Y2ggdGhhdCBvbiBhIDJEIGFycmF5IGl0IHdvdWxkIHJlcHJlc2VudCB0aGUgcG9zaXRpb24gKHgseSkuXG4gKlxuICogQHByb3BlcnR5IHtudW1iZXJ9IHgtIHRoZSByb3cgbnVtYmVyXG4gKiBAcHJvcGVydHkge251bWJlcn0geS0gdGhlIGNvbCBudW1iZXJcbiAqL1xuZXhwb3J0IHR5cGUgUG9zaXRpb24gPSB7XG4gICAgcmVhZG9ubHkgcm93OiBudW1iZXI7XG4gICAgcmVhZG9ubHkgY29sOiBudW1iZXI7XG59O1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXJQdXp6bGUge1xuICAgIHJlYWRvbmx5IHJvd3M6IG51bWJlcjtcbiAgICByZWFkb25seSBjb2xzOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiBBdHRlbXB0cyB0byBmbGlwIHRoZSBzdGF0ZSBvZiB0aGUgY2VsbCBhdCB0aGlzIHBvc2l0aW9uLCB3aGVyZSBmbGlwcGluZyBhIGNlbGwgbWVhbnMgaXQgYmVjb21lcyB1bm1hcmtlZFxuICAgICAqIGlmIGl0IGFscmVhZHkgaXMgbWFya2VkIHdpdGggYSBzdGFyLCBhbmQgdmljZSB2ZXJzYS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwb3Mgd2hlcmVcbiAgICAgKiAgICAgICAgICAgICAgcG9zLnggaXMgdmFsdWUgb2YgdGhlIHBvc2l0aW9uLCBmcm9tIHRoZSBsZWZ0LiBNdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIGludGVnZXIuXG4gICAgICogICAgICAgICAgICAgIHBvcy55IGlzIHZhbHVlIG9mIHRoZSBwb3NpdGlvbiwgZnJvbSB0aGUgdG9wLiBNdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIGludGVnZXIuXG4gICAgICogQHJldHVybnMgbmV3IGBTdGFyUHV6emxlYGluc3RhbmNlIHJlZmxlY3RpbmcgdGhlIHVwZGF0ZWQgc3RhdGUgaWYgdGhpcyBvcGVyYXRpb24gc3VjY2VlZHMuXG4gICAgICogQHRocm93cyBFcnJvciBpZiBmbGlwcGluZyB0aGlzIGNlbGwgd291bGQgcmVzdWx0IGluIGFuIGludmFsaWQgc3RhdGUuXG4gICAgICovXG4gICAgZmxpcChwb3M6IFBvc2l0aW9uKTogU3RhclB1enpsZTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgcHV6emxlIGlzIGFscmVhZHkgaW4gYSBzb2x2ZWQgc3RhdGUuIEZhbHNlIG90aGVyd2lzZVxuICAgICAqXG4gICAgICogQHJldHVybnMgYSBib29sZWFuIHZhbHVlIGRlc2NyaWJlZCBhYm92ZS5cbiAgICAgKi9cbiAgICBpc1NvbHZlZCgpOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgU3RhckJhdHRsZUNlbGwgYXQgdGhlIHBvc2l0aW9uIHgseS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBwb3Mgd2hlcmVcbiAgICAgKiAgICAgICAgICAgICAgcG9zLnggaXMgdmFsdWUgb2YgdGhlIHBvc2l0aW9uLCBmcm9tIHRoZSBsZWZ0LiBNdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIGludGVnZXIuXG4gICAgICogICAgICAgICAgICAgIHBvcy55IGlzIHZhbHVlIG9mIHRoZSBwb3NpdGlvbiwgZnJvbSB0aGUgdG9wLiBNdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIGludGVnZXIuXG4gICAgICogQHJldHVybnMgYSBTdGFyQmF0dGxlQ2VsbCBhdCB0aGF0IHBvc2l0aW9uIG9uIHRoZSBib2FyZC5cbiAgICAgKi9cbiAgICBnZXRDZWxsKHBvczogUG9zaXRpb24pOiBTdGFyQmF0dGxlQ2VsbDtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIDJEIGJvYXJkIHRoYXQgcmVwcmVzZW50cyB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgYm9hcmQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBhIDJEIFN0YXJCYXR0bGVDZWxsIGRlc2NyaWJlZCBhYm92ZS5cbiAgICAgKi9cbiAgICBnZXRCb2FyZCgpOiBTdGFyQmF0dGxlQ2VsbFtdW107XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgcGFyc2FibGUgc3RyaW5nIHZlcnNpb24gb2YgdGhlIGJvYXJkIHNob3duIGluIHRoZSBwcm9qZWN0IGhhbmRvdXQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBhIHBhcnNhYmxlIHN0cmluZyBvZiB0aGUgYm9hcmRcbiAgICAgKi9cbiAgICB0b1N0cmluZygpOiBzdHJpbmc7XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIG90aGVyIHB1enpsZSBoYXMgdGhlIHNhbWUgbnVtYmVyIG9mIHJvd3MsIHNhbWUgbnVtYmVyIG9mIGNvbHMsXG4gICAgICogYW5kIHRoZSBzdGFycyBpbiB0aGUgZXhhY3Qgc2FtZSBwbGFjZSBhcyB0aGUgY3VycmVudCBib2FyZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBvdGhlciBvdGhlciBwdXp6bGUgdGhhdCB5b3Ugd2FudCB0byBjb21wYXJlIHRoZSBjdXJyZW50IHB1enpsZSB0b1xuICAgICAqL1xuICAgIGVxdWFsVmFsdWUob3RoZXI6IFN0YXJQdXp6bGUpOiBib29sZWFuO1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgYW5vdGhlciBib2FyZCB3aXRoIHRoZSBzYW1lIHJlZ2lvbnMgYW5kIGRpbWVuc2lvbnMgd2l0aG91dCB0aGUgc3RhcnMuXG4gICAgICovXG4gICAgY2xlYXJCb2FyZCgpOiBTdGFyUHV6emxlO1xufVxuXG5leHBvcnQgY2xhc3MgUHV6emxlIGltcGxlbWVudHMgU3RhclB1enpsZSB7XG4gICAgLyoqXG4gICAgICogQWJzdHJhY3Rpb24gRnVuY3Rpb246XG4gICAgICpcbiAgICAgKiAgICAgIEEgc3RhdGUgb2YgYSBgbmAgYnkgYG5gIFN0YXIgQmF0dGxlIHB1enpsZSB3aGVyZSBgbmAgaXMgcHV6emxlQ2VsbHMubGVuZ3RoLCB3aGVyZSB0aGUgZmlyc3QgaW5kZXhcbiAgICAgKiAgICAgIG9mIGVhY2ggc3F1YXJlIGNlbGwgY29ycmVzcG9uZHMgdG8gaXRzIHJvdyBmcm9tIHRoZSB0b3AgYW5kIHRoZSBzZWNvbmQgaW5kZXggY29ycmVzcG9uZHMgdG8gaXRzIGNvbHVtblxuICAgICAqICAgICAgZnJvbSB0aGUgbGVmdCwgYW5kIGNvbnRhaW5pbmcgcmVnaW9ucyBkZWZpbmVkIGFzIHRoZSBzZXQgb2YgY2VsbHMgaW4gcHV6emxlQ2VsbHMgc2hhcmluZyBhIGNvbW1vbiByZWdpb24gaWQuXG4gICAgICpcbiAgICAgKiBSZXAgSW52YXJpYW50czpcbiAgICAgKiAgICAgIC0+IHB1enpsZUNlbGxzIGlzIGEgc3F1YXJlIDJEIGFycmF5LlxuICAgICAqICAgICAgICAgICAgICB0aGlzLnJvdyA9PT0gdGhpcy5jb2xcbiAgICAgKiAgICAgIC0+IFRoZXJlIGFyZSBvbmx5IGBuYCB1bmlxdWUgcmVnaW9ucy5cbiAgICAgKiAgICAgIC0+IEFsbCByZWdpb25zIHNob3VsZCBiZSBjb250aWdpb3VzIG1lYW5pbmcgdGhhdCBmb3IgYSBzcGVjaWZpYyByZWdpb24sIGFsbCBjZWxscyBpbiB0aGF0IHJlZ2lvbiBhcmUgcmVhY2hhYmxlXG4gICAgICogICAgICAgICB0byBlYWNoIG90aGVyIGJ5IGdvaW5nIHVwLCBsZWZ0LCByaWdodCwgZG93blxuICAgICAqXG4gICAgICogRXhwb3N1cmUgU2FmZXR5OlxuICAgICAqICAgICAgLT4gaW1tdXRhYmxlIG9iamVjdHMgYXJlIHB1YmxpYyByZWFkb25seVxuICAgICAqICAgICAgLT4gYW55dGltZSB0aGVyZSBhcmUgbXV0YWJsZSBvYmplY3RzIGJlaW5nIHBhc3NlZCBpbnRvIGEgZnVuY3Rpb24sIHRoZXJlIHdpbGwgYmUgYSBkZWZlbnNpdmUgY29weSBjcmVhdGVkXG4gICAgICogICAgICAgICBhbmQgdGhlIGZ1bmN0aW9uIHdpbGwgd29yayBvZmYgb2YgdGhhdCBkZWZlbnNpdmUgY29weVxuICAgICAqICAgICAgLT4gYW55dGltZSB0aGUgZnVuY3Rpb24gcmV0dXJucyBhbiBpbnN0YW5jZSwgdGhlIGluc3RhbmNlIHdpbGwgZWl0aGVyIGJlIGltbXV0YWJsZSBkYXRhIHR5cGUgb3IgYSBjb3BpZWQgdmVyc2lvblxuICAgICAqXG4gICAgICovXG5cbiAgICBwcml2YXRlIHJlYWRvbmx5IGJvYXJkU3RhdGU6IFN0YXJCYXR0bGVDZWxsW11bXTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBQdXp6bGUgb2JqZWN0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gcm93cyB0aGUgbnVtYmVyIG9mIHJvd3MgdGhlIGJvYXJkIGhhc1xuICAgICAqIEBwYXJhbSBjb2xzIHRoZSBudW1iZXIgb2YgY29scyB0aGUgYm9hcmQgaGFzXG4gICAgICogQHBhcmFtIGJvYXJkIHRoZSBjdXJyZW50IHN0YXRlIG9mIHRoZSBib2FyZFxuICAgICAqL1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IHJvd3M6IG51bWJlcixcbiAgICAgICAgcHVibGljIHJlYWRvbmx5IGNvbHM6IG51bWJlcixcbiAgICAgICAgYm9hcmQ6IFN0YXJCYXR0bGVDZWxsW11bXVxuICAgICkge1xuICAgICAgICB0aGlzLmJvYXJkU3RhdGUgPSB0aGlzLmRlZXBDb3B5Qm9hcmQoYm9hcmQpO1xuICAgICAgICB0aGlzLmNoZWNrUmVwKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgdG90YWwgbnVtYmVyIG9mIGNlbGxzIHdpdGggdGhlIHNwZWNpZmljIHJlZ0lEXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVnSUQgdGhlIHJlZ2lvbklEIHRoYXQgeW91IHdhbnQgdG8gZ2V0IHRoZSBhcmVhXG4gICAgICogQHJldHVybnMgdGhlIHRvdGFsIG51bWJlciBvZiBjZWxscyB3aXRoIHRoYXQgc3BlY2lmaWMgcmVnSURcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldFJlZ2lvbkFyZWEocmVnSUQ6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGNvdW50OiBudW1iZXIgPSB0aGlzLmJvYXJkU3RhdGUucmVkdWNlKFxuICAgICAgICAgICAgKHRvdGFsQ291bnQ6IG51bWJlciwgY3VyclJvdzogU3RhckJhdHRsZUNlbGxbXSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJvd0NvdW50OiBudW1iZXIgPSBjdXJyUm93LnJlZHVjZShcbiAgICAgICAgICAgICAgICAgICAgKGN1cnJDb3VudDogbnVtYmVyLCBjZWxsOiBTdGFyQmF0dGxlQ2VsbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGNlbGwucmVnaW9uSWQgPT09IHJlZ0lEKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJDb3VudCArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VyckNvdW50O1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAwXG4gICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0b3RhbENvdW50ICsgcm93Q291bnQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgMFxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBjb3VudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgcG9zaXRpb24gb24gdGhlIGJvYXJkIG9mIHRoZSBjZWxsIHRoYXQgaGFzIHRoZSBzcGVjaWZpYyByZWdJRCBvciB1bmRlZmluZWRcbiAgICAgKiBpZiBubyBjZWxscyB3aXRoIHRoYXQgcmVnSUQgaGFzIGJlZW4gZm91bmQgaW4gdGhlIGN1cnJlbnQgYm9hcmQgc3RhdGUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVnSUQgdGhlIHJlZ2lvbklEIHlvdSB3YW50IHRvIGdldCBhIHBvc2l0aW9uIGF0XG4gICAgICogQHJldHVybnMgZGVzY3JpYmVkIGFib3ZlLlxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0UmVnSURQb3MocmVnSUQ6IG51bWJlcik6IFBvc2l0aW9uIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5yb3dzOyByb3crKykge1xuICAgICAgICAgICAgY29uc3QgY3VyclJvdzogU3RhckJhdHRsZUNlbGxbXSA9XG4gICAgICAgICAgICAgICAgdGhpcy5ib2FyZFN0YXRlW3Jvd10gPz8gYXNzZXJ0LmZhaWwoXCJJbnZhbGlkIHJvdyFcIik7XG4gICAgICAgICAgICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCB0aGlzLmNvbHM7IGNvbCsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VyckNlbGw6IFN0YXJCYXR0bGVDZWxsID1cbiAgICAgICAgICAgICAgICAgICAgY3VyclJvd1tjb2xdID8/IGFzc2VydC5mYWlsKFwiSW52YWxpZCBDb2whXCIpO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyQ2VsbC5yZWdpb25JZCA9PT0gcmVnSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgcm93OiByb3csIGNvbDogY29sIH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSByZWdJRCBhbmQgYSBzdGFyaW5nIGNlbGwgd2l0aCBhdCByZWdJRCwgcnVuIHRoZSBmbG9vZGZpbGwgYWxnIHRvIHNlZVxuICAgICAqIGhvdyBtYW55IGNlbGxzIHRoZSBmbG9vZGZpbGwgY2FuIGNvdmVyIGJ5IGdvaW5nIGxlZnQsIHJpZ2h0LCB1cCwgYW5kIGRvd24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVnSUQgdGhlIHNwZWNpZmljIHJlZ0lEIHRoYXQgd2UgYXJlIHJ1bm5pbmcgZmxvb2RmaWxsIG9uXG4gICAgICogQHBhcmFtIHN0YXJ0aW5nQ2VsbCB0aGUgc3RhcnRpbmcgY2VsbCB0aGF0IHNob3VsZCBiZSBhIHZhbGlkIGNlbGwgb24gdGhlIGJvYXJkIGFuZFxuICAgICAqICAgICAgICBzdGFydGluZ0NlbGwucmVnaW9uSUQgPT09IHJlZ0lEXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB0aGUgbnVtYmVyIG9mIHRpbGVzIHRoYXQgY2FuIGJlIGZsb29kZmlsbGVkIGZyb20gdGhlIHN0YXJ0aW5nQ2VsbCBieSBnb2luZ1xuICAgICAqICAgICAgICAgIGxlZnQsIHJpZ2h0LCB1cCwgZG93biB0byBvdGhlciBjZWxscyB0aGF0IGFsc28gY29udGFpbnMgdGhlIHNhbWUgcmVnSURcbiAgICAgKlxuICAgICAqL1xuICAgIHByaXZhdGUgZmxvb2RGaWxsKHJlZ0lEOiBudW1iZXIsIHN0YXJ0aW5nQ2VsbDogUG9zaXRpb24pOiBudW1iZXIge1xuICAgICAgICBsZXQgY2VsbENvdW50ID0gMDtcbiAgICAgICAgY29uc3QgZGlyZWN0aW9uczogbnVtYmVyW11bXSA9IFtcbiAgICAgICAgICAgIFsxLCAwXSxcbiAgICAgICAgICAgIFstMSwgMF0sXG4gICAgICAgICAgICBbMCwgKzFdLFxuICAgICAgICAgICAgWzAsIC0xXSxcbiAgICAgICAgXTtcblxuICAgICAgICBjb25zdCBzZWVuOiBQb3NpdGlvbltdID0gW3N0YXJ0aW5nQ2VsbF07XG4gICAgICAgIGNvbnN0IHF1ZXVlOiBQb3NpdGlvbltdID0gW3N0YXJ0aW5nQ2VsbF07XG5cbiAgICAgICAgd2hpbGUgKHF1ZXVlLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgY29uc3QgY3VyckNlbGw6IFBvc2l0aW9uID1cbiAgICAgICAgICAgICAgICBxdWV1ZS5zaGlmdCgpID8/IGFzc2VydC5mYWlsKFwiVGhlcmUgYXJlIG5vIGl0ZW1zIGluIHRoZSBxdWV1ZSFcIik7XG4gICAgICAgICAgICBjZWxsQ291bnQgKz0gMTtcbiAgICAgICAgICAgIGNvbnN0IG5laWdoYm9yczogUG9zaXRpb25bXSA9IHRoaXMuZ2V0TmVpZ2hib3JzKGN1cnJDZWxsLCBkaXJlY3Rpb25zKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmVpZ2hib3Igb2YgbmVpZ2hib3JzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmVpZ2hib3JDZWxsOiBTdGFyQmF0dGxlQ2VsbCA9IHRoaXMuZ2V0Q2VsbChuZWlnaGJvcik7XG4gICAgICAgICAgICAgICAgaWYgKFxuICAgICAgICAgICAgICAgICAgICAhdGhpcy5wb3NJbkFycmF5KHNlZW4sIG5laWdoYm9yKSAmJlxuICAgICAgICAgICAgICAgICAgICBuZWlnaGJvckNlbGwucmVnaW9uSWQgPT09IHJlZ0lEXG4gICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlZW4ucHVzaChuZWlnaGJvcik7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXVlLnB1c2gobmVpZ2hib3IpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2VsbENvdW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB0byBtYWtlIHN1cmUgdGhhdCB0aGUgY3VyclBvc2l0aW9uIGlzIGEgdmFsaWQgcG9zaXRpb24gaW5zaWRlIG9mIHRoZSAyRCBib2FyZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjdXJyUG9zaXRpb24gdGhlIHBvc2l0aW9uIHRoYXQgeW91IHdhbnQgdG8gY2hlY2tcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBjdXJyUG9zaXRpb24gaXMgYSB2YWxpZCBwb3NpdGlvbiBpbnNpZGUgb2YgdGhlIDJEIGJvYXJkXG4gICAgICogICAgICAgICAgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgcHJpdmF0ZSBpc1ZhbGlkUG9zaXRpb24oY3VyclBvc2l0aW9uOiBQb3NpdGlvbik6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBnb29kWDogYm9vbGVhbiA9IDAgPD0gY3VyclBvc2l0aW9uLnJvdyAmJiBjdXJyUG9zaXRpb24ucm93IDwgdGhpcy5yb3dzO1xuICAgICAgICBjb25zdCBnb29kWTogYm9vbGVhbiA9IDAgPD0gY3VyclBvc2l0aW9uLmNvbCAmJiBjdXJyUG9zaXRpb24uY29sIDwgdGhpcy5jb2xzO1xuICAgICAgICByZXR1cm4gZ29vZFggJiYgZ29vZFk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYSBwb3NpdGlvbiwgcmV0dXJuIHRoZSA0IG5laWdoYm9ycyB1cCwgZG93biwgbGVmdCwgYW5kIHJpZ2h0IHRoYXQgYXJlXG4gICAgICogdmFsaWQgd2l0aGluIHRoZSBkaW1lbnNpb25zIG9mIHRoZSBib2FyZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBjdXJyUG9zaXRpb24gdGhlIGN1cnJlbnQgcG9zaXRpb24gdGhhdCB5b3Ugd2FudCB0byBnZXQgdGhlIG5laWdoYm9yc1xuICAgICAqIEBwYXJhbSBkaXJlY3Rpb25zIGFsbCB0aGUgZGlyZWN0aW9ucyB0aGF0IHRoZSBuZWlnaGJvciBjYW4gYmUgZnJvbVxuICAgICAqIEByZXR1cm5zIGEgbGlzdCBvZiB2YWxpZCBuZWlnaGJvcnMgZm9yIHRoYXQgY3VycmVudCBwb3NpdGlvbiBmb3IgdGhpcy5ib2FyZFN0YXRlXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXROZWlnaGJvcnMoXG4gICAgICAgIGN1cnJQb3NpdGlvbjogUG9zaXRpb24sXG4gICAgICAgIGRpcmVjdGlvbnM6IG51bWJlcltdW11cbiAgICApOiBQb3NpdGlvbltdIHtcbiAgICAgICAgY29uc3QgbmVpZ2hib3JzOiBQb3NpdGlvbltdID0gW107XG5cbiAgICAgICAgZm9yIChjb25zdCBkaXJlY3Rpb24gb2YgZGlyZWN0aW9ucykge1xuICAgICAgICAgICAgY29uc3QgZGVsdGFYOiBudW1iZXIgPVxuICAgICAgICAgICAgICAgIGRpcmVjdGlvblswXSA/PyBhc3NlcnQuZmFpbChcIkRpcmVjdGlvbnMgbmVlZHMgYSBkZWx0YSBYXCIpO1xuICAgICAgICAgICAgY29uc3QgZGVsdGFZOiBudW1iZXIgPVxuICAgICAgICAgICAgICAgIGRpcmVjdGlvblsxXSA/PyBhc3NlcnQuZmFpbChcIkRpcmVjdGlvbnMgbmVlZHMgYSBkZWx0YSBZXCIpO1xuICAgICAgICAgICAgY29uc3QgbmV3UG9zOiBQb3NpdGlvbiA9IHtcbiAgICAgICAgICAgICAgICByb3c6IGN1cnJQb3NpdGlvbi5yb3cgKyBkZWx0YVgsXG4gICAgICAgICAgICAgICAgY29sOiBjdXJyUG9zaXRpb24uY29sICsgZGVsdGFZLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsaWRQb3NpdGlvbihuZXdQb3MpKSB7XG4gICAgICAgICAgICAgICAgbmVpZ2hib3JzLnB1c2gobmV3UG9zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZWlnaGJvcnM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogR2l2ZW4gYW4gYXJyYXkgb2YgcG9zaXRpb25zLCBjaGVjayB0byBzZWUgaWYgY2hlY2tQb3NpdGlvbiBpcyBhbHJlYWR5IGluIHRoZSBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcnJheSB0aGUgYXJyYXkgdG8gY2hlY2tcbiAgICAgKiBAcGFyYW0gY2hlY2tQb3NpdGlvbiB0aGUgcG9zaXRpb24gdG8gY2hlY2sgdG8gc2VlIGlmIHRoaXMgcG9zaXRpb24gYWxyZWFkeSBhcHBlYXJzIGluc2lkZSBvZiB0aGUgYXJyYXlcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIGNoZWNrUG9zaXRpb24gaW4gYXJyYXkuIEZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIHBvc0luQXJyYXkoYXJyYXk6IFBvc2l0aW9uW10sIGNoZWNrUG9zaXRpb246IFBvc2l0aW9uKTogYm9vbGVhbiB7XG4gICAgICAgIGZvciAoY29uc3QgcG9zIG9mIGFycmF5KSB7XG4gICAgICAgICAgICBjb25zdCBzYW1lWDogYm9vbGVhbiA9IGNoZWNrUG9zaXRpb24ucm93ID09PSBwb3Mucm93O1xuICAgICAgICAgICAgY29uc3Qgc2FtZVk6IGJvb2xlYW4gPSBjaGVja1Bvc2l0aW9uLmNvbCA9PT0gcG9zLmNvbDtcbiAgICAgICAgICAgIGlmIChzYW1lWCAmJiBzYW1lWSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgdG8gbWFrZSBzdXJlIGFsbCByZWdpb25zIGluc2lkZSBvZiB0aGUgYm9hcmQgYXJlIGNvbnRpZ2lvdXMuXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIGVycm9yIGlmIHRoZXkgYXJlIG5vdCBjb250aWdpb3VzIGFzIGRlc2NyaWJlZCBpbiB0aGUgcmVwIGludmFyaWFudFxuICAgICAqL1xuICAgIHByaXZhdGUgY2hlY2tDb250aWdpb3VzUmVnaW9uKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBhbGxSZWdpb25zOiBudW1iZXJbXSA9IFsuLi50aGlzLmdldEFsbFJlZ2lvbklEKCldO1xuICAgICAgICBmb3IgKGNvbnN0IHJlZ2lvbiBvZiBhbGxSZWdpb25zKSB7XG4gICAgICAgICAgICAvL2dldCB0aGUgcmVnaW9uIGFyZWFcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lvbkFyZWE6IG51bWJlciA9IHRoaXMuZ2V0UmVnaW9uQXJlYShyZWdpb24pO1xuXG4gICAgICAgICAgICAvL3J1biBmbG9vZCBmaWxsIHRvIHNlZSBob3cgbXVjaCBhcmVhIGZsb29kIGZpbGwgY2FuIGNvdmVyXG4gICAgICAgICAgICBjb25zdCByYW5kb21TdGFydENlbGw6IFBvc2l0aW9uID1cbiAgICAgICAgICAgICAgICB0aGlzLmdldFJlZ0lEUG9zKHJlZ2lvbikgPz9cbiAgICAgICAgICAgICAgICBhc3NlcnQuZmFpbChgVGhlcmUgYXJlIG5vIGNlbGxzIHdpdGggcmVnaW9uIGlkICR7cmVnaW9ufSFgKTtcblxuICAgICAgICAgICAgY29uc3QgZmxvb2RGaWxsQ291bnQ6IG51bWJlciA9IHRoaXMuZmxvb2RGaWxsKHJlZ2lvbiwgcmFuZG9tU3RhcnRDZWxsKTtcblxuICAgICAgICAgICAgLy9jb21wYXJlIHJlc3VsdHNcbiAgICAgICAgICAgIGFzc2VydChcbiAgICAgICAgICAgICAgICByZWdpb25BcmVhID09PSBmbG9vZEZpbGxDb3VudCxcbiAgICAgICAgICAgICAgICBgVGhlIHJlZ2lvbiAke3JlZ2lvbn0gaXMgbm90IGNvbnRpZ2lvdXMhYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB0byBtYWtlIHN1cmUgdGhhdCBhbGwgcmVnaW9ucyBoYXZlIDw9IDIgc3RhcnNcbiAgICAgKlxuICAgICAqIEB0aHJvd3MgZXJyb3IgaWYgYW55IHJlZ2lvbnMgdmlvbGF0ZXMgdGhlIHJlcCBpbnZhcmlhbnQgb2YgaGF2aW5nID4gMiBzdGFycy5cbiAgICAgKi9cbiAgICBwcml2YXRlIHJlZ2lvbkNoZWNrKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBhbGxSZWdpb25zOiBudW1iZXJbXSA9IFsuLi50aGlzLmdldEFsbFJlZ2lvbklEKCldO1xuICAgICAgICBmb3IgKGNvbnN0IHJlZ2lvbiBvZiBhbGxSZWdpb25zKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyU3RhckNvdW50OiBudW1iZXIgPSB0aGlzLnJlZ2lvblN0YXJDb3VudChyZWdpb24pO1xuICAgICAgICAgICAgYXNzZXJ0KFxuICAgICAgICAgICAgICAgIGN1cnJTdGFyQ291bnQgPD0gMixcbiAgICAgICAgICAgICAgICBgUmVnaW9uICR7cmVnaW9ufSBoYXZlICR7Y3VyclN0YXJDb3VudH0gc3RhcnMhYFxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB0byBtYWtlIHN1cmUgdGhhdCBhbGwgcm93cyBoYXZlIDw9IDIgc3RhcnNcbiAgICAgKlxuICAgICAqIEB0aHJvd3MgZXJyb3IgaWYgYW55IHJvd3MgdmlvbGF0ZXMgdGhlIHJlcCBpbnZhcmlhbnQgb2YgaGF2aW5nID4gMiBzdGFycy5cbiAgICAgKi9cbiAgICBwcml2YXRlIHJvd0NoZWNrKCk6IHZvaWQge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMucm93czsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBzdGFyQ291bnQ6IG51bWJlciA9IHRoaXMucm93U3RhckNvdW50KGkpO1xuICAgICAgICAgICAgYXNzZXJ0KHN0YXJDb3VudCA8PSAyLCBgUm93ICR7aX0gaGF2ZSAke3N0YXJDb3VudH0gc3RhcnMhYCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgdG8gbWFrZSBzdXJlIHRoYXQgYWxsIGNvbHMgaGF2ZSA8PSAyIHN0YXJzXG4gICAgICpcbiAgICAgKiBAdGhyb3dzIGVycm9yIGlmIGFueSBjb2xzIHZpb2xhdGVzIHRoZSByZXAgaW52YXJpYW50IG9mIGhhdmluZyA+IDIgc3RhcnMuXG4gICAgICovXG4gICAgcHJpdmF0ZSBjb2xDaGVjaygpOiB2b2lkIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvbHM7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgc3RhckNvdW50OiBudW1iZXIgPSB0aGlzLmNvbFN0YXJDb3VudChpKTtcbiAgICAgICAgICAgIGFzc2VydChzdGFyQ291bnQgPD0gMiwgYENvbCAke2l9IGhhdmUgJHtzdGFyQ291bnR9IHN0YXJzIWApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogTWFrZSBzdXJlIHRoYXQgdGhlIHJlcCBpbnZhcmlhbnQgaXMgYmVpbmcgZm9sbG93ZWRcbiAgICAgKi9cbiAgICBwcml2YXRlIGNoZWNrUmVwKCk6IHZvaWQge1xuICAgICAgICBhc3NlcnQodGhpcy5yb3dzID09PSB0aGlzLmNvbHMsIFwiVGhlIGJvYXJkIG11c3QgYmUgYSBzcXVhcmUhXCIpO1xuXG4gICAgICAgIGFzc2VydCh0aGlzLnJvd3MgPT09IHRoaXMuYm9hcmRTdGF0ZS5sZW5ndGgsIGBUaGUgYm9hcmQgbXVzdCBoYXZlICR7dGhpcy5yb3dzfSAjIG9mIHJvd3MhYCk7XG5cbiAgICAgICAgZm9yIChjb25zdCByb3cgb2YgdGhpcy5ib2FyZFN0YXRlKXtcbiAgICAgICAgICAgIGFzc2VydCh0aGlzLmNvbHMgPT09IHJvdy5sZW5ndGgsIGBFYWNoIHJvdyBtdXN0IGhhdmUgJHt0aGlzLmNvbHN9ICMgb2YgY29scyFgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlZ2lvbkNvdW50OiBudW1iZXIgPSB0aGlzLmdldEFsbFJlZ2lvbklEKCkuc2l6ZTtcbiAgICAgICAgYXNzZXJ0KFxuICAgICAgICAgICAgcmVnaW9uQ291bnQgPT09IHRoaXMucm93cyxcbiAgICAgICAgICAgIGBUaGVyZSBtdXN0IGJlICR7dGhpcy5yb3dzfSBkaWZmZXJlbnQgcmVnaW9ucyEgR290ICR7cmVnaW9uQ291bnR9YFxuICAgICAgICApO1xuXG4gICAgICAgIC8vY2hlY2sgY29udGlnaW91cyByZWdpb25cbiAgICAgICAgdGhpcy5jaGVja0NvbnRpZ2lvdXNSZWdpb24oKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIHBvc2l0aW9uIHdoZXJlIGFsbCBwb3NpdGlvbnMgYXJlIHZhbGlkIHBvc2l0aW9ucyBpbiB0aGUgYm9hcmRcbiAgICAgKiB0aGF0IGNvbnRhaW5zIHN0YXJzXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBhcyBkZXNjcmliZWQgYWJvdmUuXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXRTdGFyUG9zQXJyYXkoKTogUG9zaXRpb25bXSB7XG4gICAgICAgIGNvbnN0IHN0YXJQb3M6IFBvc2l0aW9uW10gPSBbXTtcblxuICAgICAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCB0aGlzLnJvd3M7IHJvdysrKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyUm93OiBTdGFyQmF0dGxlQ2VsbFtdID1cbiAgICAgICAgICAgICAgICB0aGlzLmJvYXJkU3RhdGVbcm93XSA/PyBhc3NlcnQuZmFpbChcIkludmFsaWQgcm93IVwiKTtcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuY29sczsgY29sKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyQ2VsbDogU3RhckJhdHRsZUNlbGwgPVxuICAgICAgICAgICAgICAgICAgICBjdXJyUm93W2NvbF0gPz8gYXNzZXJ0LmZhaWwoXCJJbnZhbGlkIENvbCFcIik7XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJDZWxsLmNvbnRhaW5zU3Rhcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBuZXdQb3M6IFBvc2l0aW9uID0geyByb3c6IHJvdywgY29sOiBjb2wgfTtcbiAgICAgICAgICAgICAgICAgICAgc3RhclBvcy5wdXNoKG5ld1Bvcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGFyUG9zO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyB0byBtYWtlIHN1cmUgdGhhdCBhbnkgY2VsbCB0aGF0IGNvbnRhaW5zIGEgc3RhciBkb2VzIG5vdCB0b3VjaCBhbnkgb3RoZXIgY2VsbFxuICAgICAqIHRoYXQgY29udGFpbnMgYSBzdGFyIHVwLCBkb3duLCBsZWZ0LCByaWdodCwgb3IgZGlhZ29uYWxseVxuICAgICAqXG4gICAgICogQHRocm93cyBlcnJvciBpZiBhIHN0YXIgdmlvbGF0ZXMgdGhlIGNvbmRpdGlvbiBkZXNjcmliZWQgYWJvdmUuXG4gICAgICovXG4gICAgcHJpdmF0ZSBzdXJyb3VuZENoZWNrUmVwKCk6IHZvaWQge1xuICAgICAgICAvL2dldCB0aGUgZGlyZWN0aW9ucyBvZiB0aGUgbmVpZ2hib3JzXG4gICAgICAgIGNvbnN0IGRpcmVjdGlvbnM6IG51bWJlcltdW10gPSBbXTtcbiAgICAgICAgZm9yIChsZXQgZGVsdGFYID0gLTE7IGRlbHRhWCA8PSAxOyBkZWx0YVgrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgZGVsdGFZID0gLTE7IGRlbHRhWSA8PSAxOyBkZWx0YVkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJEaXI6IG51bWJlcltdID0gW2RlbHRhWCwgZGVsdGFZXTtcbiAgICAgICAgICAgICAgICBpZiAoZGVsdGFYICE9PSAwIHx8IGRlbHRhWSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBkaXJlY3Rpb25zLnB1c2goY3VyckRpcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy9nZXQgdGhlIHBvc2l0aW9ucyB0aGF0IGNvbnRhaW5zIHN0YXJzXG4gICAgICAgIGNvbnN0IHN0YXJQb3NlczogUG9zaXRpb25bXSA9IHRoaXMuZ2V0U3RhclBvc0FycmF5KCk7XG4gICAgICAgIGZvciAoY29uc3QgcG9zIG9mIHN0YXJQb3Nlcykge1xuICAgICAgICAgICAgY29uc3QgbmVpZ2hib3JzOiBQb3NpdGlvbltdID0gdGhpcy5nZXROZWlnaGJvcnMocG9zLCBkaXJlY3Rpb25zKTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgbmVpZ2hib3Igb2YgbmVpZ2hib3JzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbmVpZ2hib3JDZWxsOiBTdGFyQmF0dGxlQ2VsbCA9IHRoaXMuZ2V0Q2VsbChuZWlnaGJvcik7XG4gICAgICAgICAgICAgICAgYXNzZXJ0KFxuICAgICAgICAgICAgICAgICAgICAhbmVpZ2hib3JDZWxsLmNvbnRhaW5zU3RhcixcbiAgICAgICAgICAgICAgICAgICAgYE5laWdoYm9yIGF0ICgke25laWdoYm9yLnJvd30sICR7bmVpZ2hib3IuY29sfSkgY29udGFpbnMgYSBzdGFyIWBcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIHRoZSBzdXJyb3VuZGluZyAzeDMgYXJlYSBvZiAoeCx5KSB3aXRoICh4LHkpIGFzIGl0cyBjZW50ZXIgdG8gbWFrZSBzdXJlIHRoYXRcbiAgICAgKiB0aGUgc3RhciB0aGF0IGlzIGdvaW5nIHRvIGJlIGFkZGVkIGF0IHRoaXMgcG9zaXRpb24gZG9lc24ndCB2aW9sYXRlIHRoZSByZXAgaW52YXJpYW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gcG9zIHdoZXJlXG4gICAgICogICAgICAgICAgICAgIHBvcy54IGlzIHZhbHVlIG9mIHRoZSBwb3NpdGlvbiwgZnJvbSB0aGUgbGVmdC4gTXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyLlxuICAgICAqICAgICAgICAgICAgICBwb3MueSBpcyB2YWx1ZSBvZiB0aGUgcG9zaXRpb24sIGZyb20gdGhlIHRvcC4gTXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyLlxuICAgICAqIEB0aHJvd3MgZXJyb3IgaWYgYW55IG9mIHRoZSBwb3NpdGlvbiBzdXJyb3VuZGluZyB0aGUgY2VsbCBjb250YWlucyBzdGFycy5cbiAgICAgKi9cbiAgICBwcml2YXRlIGNoZWNrU3Vycm91bmQocG9zOiBQb3NpdGlvbik6IHZvaWQge1xuICAgICAgICBjb25zdCBiZWdpblJvdzogbnVtYmVyID0gcG9zLnJvdyAtIDE7XG4gICAgICAgIGNvbnN0IGVuZFJvdzogbnVtYmVyID0gcG9zLnJvdyArIDI7XG4gICAgICAgIGNvbnN0IGJlZ2luQ29sOiBudW1iZXIgPSBwb3MuY29sIC0gMTtcbiAgICAgICAgY29uc3QgZW5kQ29sOiBudW1iZXIgPSBwb3MuY29sICsgMjtcblxuICAgICAgICBmb3IgKGxldCBpID0gYmVnaW5Sb3c7IGkgPCBlbmRSb3c7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgY3VyclJvdzogU3RhckJhdHRsZUNlbGxbXSB8IHVuZGVmaW5lZCA9IHRoaXMuYm9hcmRTdGF0ZVtpXTtcblxuICAgICAgICAgICAgaWYgKGN1cnJSb3cgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKGxldCBqID0gYmVnaW5Db2w7IGogPCBlbmRDb2w7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJDZWxsOiBTdGFyQmF0dGxlQ2VsbCB8IHVuZGVmaW5lZCA9IGN1cnJSb3dbal07XG4gICAgICAgICAgICAgICAgaWYgKGN1cnJDZWxsICE9PSB1bmRlZmluZWQgJiYgaSAhPT0gcG9zLnJvdyAmJiBqICE9PSBwb3MuY29sKSB7XG4gICAgICAgICAgICAgICAgICAgIGFzc2VydCghY3VyckNlbGwuY29udGFpbnNTdGFyLCBgKCR7aX0sICR7an0pIGNvbnRhaW5zIGEgc3RhciFgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBudW1iZXIgb2Ygc3RhcnMgd2l0aCB0aGUgcmVnaW9uSUQgdGhhdCBpcyBpbiB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgYm9hcmQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gcmVnaW9uSUQgYSBzcGVjaWZpYyByZWdpb25JRFxuICAgICAqIEByZXR1cm5zIGFzIGRlc2NyaWJlZCBhYm92ZVxuICAgICAqL1xuICAgIHByaXZhdGUgcmVnaW9uU3RhckNvdW50KHJlZ2lvbklEOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBzdGFyQ291bnQ6IG51bWJlciA9IHRoaXMuYm9hcmRTdGF0ZS5yZWR1Y2UoXG4gICAgICAgICAgICAodG90YWxQcmV2Q291bnQ6IG51bWJlciwgcm93OiBTdGFyQmF0dGxlQ2VsbFtdKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQcmV2Q291bnQgK1xuICAgICAgICAgICAgICAgICAgICByb3cucmVkdWNlKChyb3dQcmV2Q291bnQ6IG51bWJlciwgY2VsbDogU3RhckJhdHRsZUNlbGwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjZWxsLmNvbnRhaW5zU3RhciAmJiBjZWxsLnJlZ2lvbklkID09PSByZWdpb25JRCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByb3dQcmV2Q291bnQgKyAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJvd1ByZXZDb3VudDtcbiAgICAgICAgICAgICAgICAgICAgfSwgMClcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIDBcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gc3RhckNvdW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENvdW50cyB0aGUgbnVtYmVyIG9mIHN0YXJzIGluIHRoZSBnaXZlbiByb3dcbiAgICAgKlxuICAgICAqIEBwYXJhbSByb3cgdGhlIHJvdyB0aGF0IHlvdSBhcmUgY2hlY2tpbmdcbiAgICAgKiBAcmV0dXJucyB0aGUgbnVtYmVyIG9mIHN0YXJzIHRoYXQgcm93IGhhc1xuICAgICAqL1xuICAgIHByaXZhdGUgcm93U3RhckNvdW50KHJvdzogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgY3VyclJvdzogU3RhckJhdHRsZUNlbGxbXSA9XG4gICAgICAgICAgICB0aGlzLmJvYXJkU3RhdGVbcm93XSA/PyBhc3NlcnQuZmFpbChcIkludmFsaWQgcm93IVwiKTtcbiAgICAgICAgY29uc3Qgc3RhckNvdW50OiBudW1iZXIgPSBjdXJyUm93LnJlZHVjZShcbiAgICAgICAgICAgIChwcmV2Q291bnQ6IG51bWJlciwgY2VsbDogU3RhckJhdHRsZUNlbGwpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoY2VsbC5jb250YWluc1N0YXIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXZDb3VudCArIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBwcmV2Q291bnQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgMFxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBzdGFyQ291bnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ291bnRzIHRoZSBudW1iZXIgb2Ygc3RhcnMgaW4gdGhlIGdpdmVuIGNvbFxuICAgICAqXG4gICAgICogQHBhcmFtIGNvbCB0aGUgY29sIHRoYXQgeW91IGFyZSBjaGVja2luZ1xuICAgICAqIEByZXR1cm5zIHRoZSBudW1iZXIgb2Ygc3RhcnMgdGhhdCBjb2wgaGFzXG4gICAgICovXG4gICAgcHJpdmF0ZSBjb2xTdGFyQ291bnQoY29sOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBjdXJyQ29sOiBTdGFyQmF0dGxlQ2VsbFtdID0gdGhpcy5ib2FyZFN0YXRlLm1hcChcbiAgICAgICAgICAgIChyb3c6IFN0YXJCYXR0bGVDZWxsW10pID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBjb2xDZWxsOiBTdGFyQmF0dGxlQ2VsbCA9IHJvd1tjb2xdID8/IGFzc2VydC5mYWlsKFwiSW52YWxpZCBjb2whXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xDZWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHN0YXJDb3VudDogbnVtYmVyID0gY3VyckNvbC5yZWR1Y2UoXG4gICAgICAgICAgICAocHJldkNvdW50OiBudW1iZXIsIGNlbGw6IFN0YXJCYXR0bGVDZWxsKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGNlbGwuY29udGFpbnNTdGFyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2Q291bnQgKyAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gcHJldkNvdW50O1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIDBcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gc3RhckNvdW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBpbmhlcml0ZG9jXG4gICAgICovXG4gICAgcHVibGljIGZsaXAocG9zOiBQb3NpdGlvbik6IFB1enpsZSB7XG4gICAgICAgIGNvbnN0IGN1cnJDZWxsOiBTdGFyQmF0dGxlQ2VsbCA9IHRoaXMuZ2V0Q2VsbChwb3MpO1xuICAgICAgICBsZXQgZmxpcFRvU3RhciA9IGZhbHNlO1xuXG4gICAgICAgIC8vaWYgdGhlIGNlbGwgdHJ5aW5nIHRvIGZsaXAgb3ZlciBpcyBub3Qgc3RhciwgdGhlbiBmbGlwIGl0IG92ZXIgd2l0aCBjaGVja1xuICAgICAgICBpZiAoIWN1cnJDZWxsLmNvbnRhaW5zU3Rhcikge1xuICAgICAgICAgICAgLy8gLy9jaGVjayB0aGUgc3Vycm91bmQgdG8gbWFrZSBzdXJlIHRoYXQgaXQncyBub3QgdG91Y2hpbmcgYWRqYWNlbnQgc3RhcnNcbiAgICAgICAgICAgIC8vIHRoaXMuY2hlY2tTdXJyb3VuZChwb3MpO1xuXG4gICAgICAgICAgICAvLyAvL2NoZWNrIHRoZSByZWdpb24gc28gdGhhdCBpdCBkb2Vzbid0IGFscmVhZHkgY29udGFpbiAyIHN0YXJzXG4gICAgICAgICAgICAvLyBhc3NlcnQoXG4gICAgICAgICAgICAvLyAgICAgdGhpcy5yZWdpb25TdGFyQ291bnQoY3VyckNlbGwucmVnaW9uSWQpIDwgMixcbiAgICAgICAgICAgIC8vICAgICBgUmVnaW9uICR7Y3VyckNlbGwucmVnaW9uSWR9IGFscmVhZHkgY29udGFpbnMgMiBzdGFycyFgXG4gICAgICAgICAgICAvLyApO1xuXG4gICAgICAgICAgICAvLyAvL2NoZWNrIHRoZSByb3cgdG8gbWFrZSBzdXJlIHRoYXQgaXQgZG9lc24ndCBhbHJlYWR5IGNvbnRhaW4gMiBzdGFyc1xuICAgICAgICAgICAgLy8gYXNzZXJ0KFxuICAgICAgICAgICAgLy8gICAgIHRoaXMucm93U3RhckNvdW50KHBvcy54KSA8IDIsXG4gICAgICAgICAgICAvLyAgICAgYFJvdyAke3Bvcy54fSBhbHJlYWR5IGNvbnRhaW5zIDIgc3RhcnMhYFxuICAgICAgICAgICAgLy8gKTtcblxuICAgICAgICAgICAgLy8gLy9jaGVjayB0aGUgY29sIHRvIG1ha2Ugc3VyZSB0aGF0IGl0IGRvZXNuJ3QgYWxyZWFkeSBjb250YWluIDIgc3RhcnNcbiAgICAgICAgICAgIC8vIGFzc2VydChcbiAgICAgICAgICAgIC8vICAgICB0aGlzLmNvbFN0YXJDb3VudChwb3MueSkgPCAyLFxuICAgICAgICAgICAgLy8gICAgIGBDb2wgJHtwb3MueX0gYWxyZWFkeSBjb250YWlucyAyIHN0YXJzIWBcbiAgICAgICAgICAgIC8vICk7XG5cbiAgICAgICAgICAgIGZsaXBUb1N0YXIgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmxpcFRvU3RhciA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9jcmVhdGUgdGhlIG5ldyBjZWxsXG4gICAgICAgIGNvbnN0IG5ld0NlbGw6IFN0YXJCYXR0bGVDZWxsID0ge1xuICAgICAgICAgICAgY29udGFpbnNTdGFyOiBmbGlwVG9TdGFyLFxuICAgICAgICAgICAgcmVnaW9uSWQ6IGN1cnJDZWxsLnJlZ2lvbklkLFxuICAgICAgICB9O1xuXG4gICAgICAgIC8vY3JlYXRlIHRoZSBuZXcgYm9hcmRcbiAgICAgICAgY29uc3QgY29waWVkQm9hcmQ6IFN0YXJCYXR0bGVDZWxsW11bXSA9IHRoaXMuZGVlcENvcHlCb2FyZCh0aGlzLmJvYXJkU3RhdGUpO1xuICAgICAgICBjb25zdCBjaGFuZ2VSb3c6IFN0YXJCYXR0bGVDZWxsW10gPVxuICAgICAgICAgICAgY29waWVkQm9hcmRbcG9zLnJvd10gPz8gYXNzZXJ0LmZhaWwoXCJJbnZhbGlkIHJvdyFcIik7XG5cbiAgICAgICAgLy9hZGQgdGhlIG5ldyBjZWxsIGludG8gdGhlIG5ldyBib2FyZFxuICAgICAgICBpZiAoY2hhbmdlUm93W3Bvcy5jb2xdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGNoYW5nZVJvd1twb3MuY29sXSA9IG5ld0NlbGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIENvbCFcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV3IFB1enpsZSh0aGlzLnJvd3MsIHRoaXMuY29scywgY29waWVkQm9hcmQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYWxsIHRoZSByZWdpb25JRCBmb3VuZCBpbiB0aGUgY3VycmVudCBzdGF0ZSBvZiB0aGUgYm9hcmQgYXMgYSBzZXQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyBhcyBkZXNjcmliZWQgYWJvdmUuXG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXRBbGxSZWdpb25JRCgpOiBTZXQ8bnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IHJlZ0lEU2V0OiBTZXQ8bnVtYmVyPiA9IHRoaXMuYm9hcmRTdGF0ZS5yZWR1Y2UoXG4gICAgICAgICAgICAodG90YWxQcmV2U2V0OiBTZXQ8bnVtYmVyPiwgY3VyclJvdzogU3RhckJhdHRsZUNlbGxbXSkgPT4ge1xuICAgICAgICAgICAgICAgIC8vcmVkdWNlIGVhY2ggcm93IHRvIGEgc2V0IG9mIHJlZ0lEIHRoYXQgb25seSBhcHBlYXIgaW4gdGhhdCByb3dcbiAgICAgICAgICAgICAgICBjb25zdCByb3dTZXQ6IFNldDxudW1iZXI+ID0gY3VyclJvdy5yZWR1Y2UoXG4gICAgICAgICAgICAgICAgICAgIChyb3dQcmV2U2V0OiBTZXQ8bnVtYmVyPiwgY2VsbDogU3RhckJhdHRsZUNlbGwpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd1ByZXZTZXQgPSBuZXcgU2V0KFsuLi5yb3dQcmV2U2V0LCBjZWxsLnJlZ2lvbklkXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcm93UHJldlNldDtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbmV3IFNldDxudW1iZXI+KClcbiAgICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgICAgLy9hZGQgZWFjaCByZWdJRCBvZiBlYWNoIHJvdyBpbnRvIHRoZSB0b3RhbFByZXZTZXRcbiAgICAgICAgICAgICAgICB0b3RhbFByZXZTZXQgPSBuZXcgU2V0KFsuLi50b3RhbFByZXZTZXQsIC4uLnJvd1NldF0pO1xuICAgICAgICAgICAgICAgIHJldHVybiB0b3RhbFByZXZTZXQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmV3IFNldDxudW1iZXI+KClcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gcmVnSURTZXQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2hlY2tzIGFsbCB0aGUgcmVnaW9uIG9mIHRoZSBib2FyZCB0byBtYWtlIHN1cmUgYWxsIHJlZ2lvbnMgaGF2ZSBleGFjdGx5IDIgc3RhcnMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIGFsbCByZWdpb25zIGhhdmUgZXhhY3RseSAyIHN0YXJzLiBGYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJpdmF0ZSBjaGVja0FsbFJlZ2lvbigpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgYWxsUmVnaW9uczogbnVtYmVyW10gPSBbLi4udGhpcy5nZXRBbGxSZWdpb25JRCgpXTtcbiAgICAgICAgZm9yIChjb25zdCByZWdJRCBvZiBhbGxSZWdpb25zKSB7XG4gICAgICAgICAgICBjb25zdCBjdXJyU3RhckNvdW50OiBudW1iZXIgPSB0aGlzLnJlZ2lvblN0YXJDb3VudChyZWdJRCk7XG4gICAgICAgICAgICBpZiAoY3VyclN0YXJDb3VudCAhPT0gMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBDaGVja3MgYWxsIHRoZSByb3dzIG9mIHRoZSBib2FyZCB0byBtYWtlIHN1cmUgYWxsIHJlZ2lvbnMgaGF2ZSBleGFjdGx5IDIgc3RhcnMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIGFsbCByb3dzIGhhdmUgZXhhY3RseSAyIHN0YXJzLiBGYWxzZSBvdGhlcndpc2UuXG4gICAgICovXG4gICAgcHJpdmF0ZSBjaGVja0FsbFJvd3MoKTogYm9vbGVhbiB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5yb3dzOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJDb3VudDogbnVtYmVyID0gdGhpcy5yb3dTdGFyQ291bnQoaSk7XG4gICAgICAgICAgICBpZiAoc3RhckNvdW50ICE9PSAyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENoZWNrcyBhbGwgdGhlIGNvbHMgb2YgdGhlIGJvYXJkIHRvIG1ha2Ugc3VyZSBhbGwgcmVnaW9ucyBoYXZlIGV4YWN0bHkgMiBzdGFycy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgYWxsIGNvbHMgaGF2ZSBleGFjdGx5IDIgc3RhcnMuIEZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwcml2YXRlIGNoZWNrQWxsQ29scygpOiBib29sZWFuIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNvbHM7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgc3RhckNvdW50OiBudW1iZXIgPSB0aGlzLmNvbFN0YXJDb3VudChpKTtcbiAgICAgICAgICAgIGlmIChzdGFyQ291bnQgIT09IDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGluaGVyaXRkb2NcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNTb2x2ZWQoKTogYm9vbGVhbiB7XG4gICAgICAgIC8vY2hlY2sgdG8gbWFrZSBzdXJlIHRoYXQgYWxsIHJlZ2lvbnMgY29udGFpbiAyIHN0YXJzXG4gICAgICAgIGNvbnN0IGFsbFJlZ2lvbkdvb2Q6IGJvb2xlYW4gPSB0aGlzLmNoZWNrQWxsUmVnaW9uKCk7XG5cbiAgICAgICAgLy9jaGVjayB0byBtYWtlIHN1cmUgdGhhdCBhbGwgcm93cyBjb250YWluIDIgc3RhcnNcbiAgICAgICAgY29uc3QgYWxsUm93R29vZDogYm9vbGVhbiA9IHRoaXMuY2hlY2tBbGxSb3dzKCk7XG5cbiAgICAgICAgLy9jaGVjayB0byBtYWtlIHN1cmUgdGhhdCBhbGwgY29scyBjb250YWluIDIgc3RhcnNcbiAgICAgICAgY29uc3QgYWxsQ29sc0dvb2Q6IGJvb2xlYW4gPSB0aGlzLmNoZWNrQWxsQ29scygpO1xuXG4gICAgICAgIHJldHVybiBhbGxSZWdpb25Hb29kICYmIGFsbENvbHNHb29kICYmIGFsbFJvd0dvb2Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGluaGVyaXRkb2NcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0Q2VsbChwb3M6IFBvc2l0aW9uKTogU3RhckJhdHRsZUNlbGwge1xuICAgICAgICBjb25zdCBjZWxsUm93OiBTdGFyQmF0dGxlQ2VsbFtdID1cbiAgICAgICAgICAgIHRoaXMuYm9hcmRTdGF0ZVtwb3Mucm93XSA/PyBhc3NlcnQuZmFpbChcIkludmFsaWQgeCFcIik7XG4gICAgICAgIGNvbnN0IGNlbGw6IFN0YXJCYXR0bGVDZWxsID0gY2VsbFJvd1twb3MuY29sXSA/PyBhc3NlcnQuZmFpbChcIkludmFsaWQgWSFcIik7XG4gICAgICAgIHJldHVybiBjZWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBpbmhlcml0ZG9jXG4gICAgICovXG4gICAgcHVibGljIGdldEJvYXJkKCk6IFN0YXJCYXR0bGVDZWxsW11bXSB7XG4gICAgICAgIGNvbnN0IGNvcHlCb2FyZDogU3RhckJhdHRsZUNlbGxbXVtdID0gdGhpcy5kZWVwQ29weUJvYXJkKHRoaXMuYm9hcmRTdGF0ZSk7XG4gICAgICAgIHJldHVybiBjb3B5Qm9hcmQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuc1xuICAgICAqICAgICAgYW4gYXJyYXkgb2YgUG9zaXRpb25zIHdoZXJlIGVhY2ggcG9zaXRpb24gcmVwcmVzZW50cyBhIHN0YXIgaW5zaWRlIG9mIHRoYXQgc3BlY2lmaWMgcmVnaW9uLFxuICAgICAqICAgICAgYW5kIGFuIGFycmF5IG9mIHBvc2l0aW9ucyB3aGVyZSBlYWNoIHBvc2l0aW9uIGRvIG5vdCBjb250YWluIGEgc3RhciBpbnNpZGUgb2YgdGhhdCBzcGVjaWZpYyByZWdpb25cbiAgICAgKlxuICAgICAqIEBwYXJhbSByZWdJRCB0aGUgcmVnaW9uSUQgdGhhdCB5b3Ugd2FudCB0byBsb29rIGZvciB0aGUgc3RhciBjb29yZGluYXRlc1xuICAgICAqIEByZXR1cm5zIGFzIGRlc2NyaWJlZCBhYm92ZVxuICAgICAqL1xuICAgIHByaXZhdGUgZmluZFN0YXJDb29yZChyZWdJRDogbnVtYmVyKToge1xuICAgICAgICBzdGFyOiBQb3NpdGlvbltdO1xuICAgICAgICBub1N0YXI6IFBvc2l0aW9uW107XG4gICAgfSB7XG4gICAgICAgIGNvbnN0IHN0YXJDb29yZHM6IFBvc2l0aW9uW10gPSBbXTtcbiAgICAgICAgY29uc3Qgbm9TdGFyQ29vcmRzOiBQb3NpdGlvbltdID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgcm93ID0gMDsgcm93IDwgdGhpcy5yb3dzOyByb3crKykge1xuICAgICAgICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgdGhpcy5jb2xzOyBjb2wrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJQb3NpdGlvbjogUG9zaXRpb24gPSB7IHJvdzogcm93LCBjb2w6IGNvbCB9O1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJDZWxsOiBTdGFyQmF0dGxlQ2VsbCA9IHRoaXMuZ2V0Q2VsbChjdXJyUG9zaXRpb24pO1xuICAgICAgICAgICAgICAgIGlmIChjdXJyQ2VsbC5yZWdpb25JZCA9PT0gcmVnSUQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJDZWxsLmNvbnRhaW5zU3Rhcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhckNvb3Jkcy5wdXNoKGN1cnJQb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBub1N0YXJDb29yZHMucHVzaChjdXJyUG9zaXRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHN0YXI6IHN0YXJDb29yZHMsIG5vU3Rhcjogbm9TdGFyQ29vcmRzIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGluaGVyaXRkb2NcbiAgICAgKi9cbiAgICBwdWJsaWMgdG9TdHJpbmcoKTogc3RyaW5nIHtcbiAgICAgICAgbGV0IHBhcnNhYmxlU3RyaW5nID0gYCR7dGhpcy5yb3dzfXgke3RoaXMuY29sc31cXG5gO1xuXG4gICAgICAgIC8vZ2V0IGFsbCByZWdpb25zIHNvcnRlZFxuICAgICAgICBjb25zdCBhbGxSZWdpb25zOiBudW1iZXJbXSA9IFsuLi50aGlzLmdldEFsbFJlZ2lvbklEKCldLnNvcnQoXG4gICAgICAgICAgICAoYSwgYikgPT4gYSAtIGJcbiAgICAgICAgKTtcblxuICAgICAgICBmb3IgKGNvbnN0IHJlZ0lEIG9mIGFsbFJlZ2lvbnMpIHtcbiAgICAgICAgICAgIC8vZmluZCBhbGwgc3RhcnMgYW5kIG5vIHN0YXIgY29vcmRzXG4gICAgICAgICAgICBjb25zdCByZWdDb29yZHM6IHsgc3RhcjogUG9zaXRpb25bXTsgbm9TdGFyOiBQb3NpdGlvbltdIH0gPVxuICAgICAgICAgICAgICAgIHRoaXMuZmluZFN0YXJDb29yZChyZWdJRCk7XG4gICAgICAgICAgICBjb25zdCBzdGFyQ29vcmRzOiBQb3NpdGlvbltdID0gcmVnQ29vcmRzLnN0YXI7XG4gICAgICAgICAgICBjb25zdCBub1N0YXJDb29yZHM6IFBvc2l0aW9uW10gPSByZWdDb29yZHMubm9TdGFyO1xuXG4gICAgICAgICAgICAvL3RoZW4gY3JlYXRlIGEgc3RyaW5nIGZvciBlYWNoIHJlZ2lvblxuICAgICAgICAgICAgY29uc3Qgc3RhclN0cmluZzogc3RyaW5nID0gc3RhckNvb3Jkcy5yZWR1Y2UoXG4gICAgICAgICAgICAgICAgKGN1cnJTdHJpbmc6IHN0cmluZywgY3VyclBvc2l0aW9uOiBQb3NpdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY3VyclN0cmluZyArIGAke2N1cnJQb3NpdGlvbi5yb3cgKyAxfSwke2N1cnJQb3NpdGlvbi5jb2wgKyAxfSAgYDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vY3JlYXRlIG5vIHN0YXIgc3RyaW5nIGZvciBlYWNoIHJlZ2lvblxuICAgICAgICAgICAgY29uc3Qgbm9TdGFyU3RyaW5nOiBzdHJpbmcgPSBub1N0YXJDb29yZHMucmVkdWNlKFxuICAgICAgICAgICAgICAgIChjdXJyU3RyaW5nOiBzdHJpbmcsIGN1cnJQb3NpdGlvbjogUG9zaXRpb24pID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJTdHJpbmcgKyBgJHtjdXJyUG9zaXRpb24ucm93ICsgMX0sJHtjdXJyUG9zaXRpb24uY29sICsgMX0gYDtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIFwiXCJcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vYWRkIHRoZSBzdHJpbmdzIG9udG8gdGhlIHBhcnNhYmxlIHN0cmluZ1xuICAgICAgICAgICAgcGFyc2FibGVTdHJpbmcgKz0gYCR7c3RhclN0cmluZ318ICR7bm9TdGFyU3RyaW5nfVxcbmA7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcGFyc2FibGVTdHJpbmc7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQGluaGVyaXRkb2NcbiAgICAgKi9cbiAgICBwdWJsaWMgY2xlYXJCb2FyZCgpOiBQdXp6bGUge1xuICAgICAgICBjb25zdCBjbGVhckJvYXJkOiBTdGFyQmF0dGxlQ2VsbFtdW10gPSB0aGlzLmJvYXJkU3RhdGUubWFwKFxuICAgICAgICAgICAgKHJvdzogU3RhckJhdHRsZUNlbGxbXSkgPT5cbiAgICAgICAgICAgICAgICByb3cubWFwKChjZWxsOiBTdGFyQmF0dGxlQ2VsbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBub1N0YXI6IFN0YXJCYXR0bGVDZWxsID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbnNTdGFyOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlZ2lvbklkOiBjZWxsLnJlZ2lvbklkLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9TdGFyO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiBuZXcgUHV6emxlKHRoaXMucm93cywgdGhpcy5jb2xzLCBjbGVhckJvYXJkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAaW5oZXJpdGRvY1xuICAgICAqL1xuICAgIHB1YmxpYyBlcXVhbFZhbHVlKG90aGVyOiBTdGFyUHV6emxlKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHNhbWVSb3dzOiBib29sZWFuID0gdGhpcy5yb3dzID09PSBvdGhlci5yb3dzO1xuICAgICAgICBjb25zdCBzYW1lQ29sczogYm9vbGVhbiA9IHRoaXMuY29scyA9PT0gb3RoZXIuY29scztcblxuICAgICAgICBpZiAoIXNhbWVSb3dzIHx8ICFzYW1lQ29scykge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9jaGVjayB0aGUgZW50aXJlIGJvYXJkXG4gICAgICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IHRoaXMucm93czsgcm93KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IHRoaXMuY29sczsgY29sKyspIHtcbiAgICAgICAgICAgICAgICBjb25zdCBjdXJyUG9zaXRpb246IFBvc2l0aW9uID0geyByb3c6IHJvdywgY29sOiBjb2wgfTtcbiAgICAgICAgICAgICAgICBjb25zdCB0aGlzQ2VsbDogU3RhckJhdHRsZUNlbGwgPSB0aGlzLmdldENlbGwoY3VyclBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvdGhlckNlbGw6IFN0YXJCYXR0bGVDZWxsID0gb3RoZXIuZ2V0Q2VsbChjdXJyUG9zaXRpb24pO1xuXG4gICAgICAgICAgICAgICAgY29uc3Qgc2FtZVJlZ0lEOiBib29sZWFuID0gdGhpc0NlbGwucmVnaW9uSWQgPT09IG90aGVyQ2VsbC5yZWdpb25JZDtcbiAgICAgICAgICAgICAgICBjb25zdCBzYW1lU3RhcjogYm9vbGVhbiA9XG4gICAgICAgICAgICAgICAgICAgIHRoaXNDZWxsLmNvbnRhaW5zU3RhciA9PT0gb3RoZXJDZWxsLmNvbnRhaW5zU3RhcjtcbiAgICAgICAgICAgICAgICBpZiAoIXNhbWVSZWdJRCB8fCAhc2FtZVN0YXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpc0NlbGwsIG90aGVyQ2VsbCwgY3VyclBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIGEgZGVlcCBjb3B5IHZlcnNpb24gb2YgdGhlIGJvYXJkIHBhc3NlZCBpbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSBib2FyZCB0aGUgYm9hcmQgdGhhdCB5b3Ugd2FudCB0byBjcmVhdGUgYSBkZWVwIGNvcHkgZnJvbVxuICAgICAqIEByZXR1cm5zIGEgZGVlcCBjb3B5IHZlcnNpb24gb2YgYm9hcmRcbiAgICAgKi9cbiAgICBwcml2YXRlIGRlZXBDb3B5Qm9hcmQoYm9hcmQ6IFN0YXJCYXR0bGVDZWxsW11bXSk6IFN0YXJCYXR0bGVDZWxsW11bXSB7XG4gICAgICAgIGNvbnN0IGNvcHlCb2FyZDogU3RhckJhdHRsZUNlbGxbXVtdID0gYm9hcmQubWFwKChyb3c6IFN0YXJCYXR0bGVDZWxsW10pID0+XG4gICAgICAgICAgICByb3cubWFwKChjZWxsKSA9PiBjZWxsKVxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBjb3B5Qm9hcmQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IHtQdXp6bGV9IGZyb20gXCIuL1B1enpsZVwiO1xuLy8gaW1wb3J0IG9ubHkgdGhlIHR5cGVzIGZyb20gJ2NhbnZhcycsIG5vdCB0aGUgaW1wbGVtZW50YXRpb25zXG5pbXBvcnQgdHlwZSB7IENhbnZhcywgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGFzIE5vZGVDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfSBmcm9tICdjYW52YXMnO1xuaW1wb3J0IGFzc2VydCBmcm9tIFwiYXNzZXJ0XCI7XG5cbi8qKlxuICogRWl0aGVyOiBhIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBpbiB0aGUgd2ViIGJyb3dzZXIsXG4gKiAgICAgIG9yIGEgTm9kZUNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBpbiBOb2RlIChmb3IgdGVzdGluZylcbiAqL1xudHlwZSBXZWJPck5vZGVDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPSBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBOb2RlQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuXG4vKipcbiAqIEVpdGhlcjogYSBIVE1MQ2FudmFzRWxlbWVudCByZXByZXNlbnRpbmcgYSBgPGNhbnZhcz5gIG9uIHRoZSB3ZWIgcGFnZSxcbiAqICAgICAgb3IgYSBDYW52YXMgcmVwcmVzZW50aW5nIGEgY2FudmFzIGluIE5vZGUgKGZvciB0ZXN0aW5nKVxuICovXG50eXBlIFdlYk9yTm9kZUNhbnZhcyA9IE9taXQ8SFRNTENhbnZhc0VsZW1lbnQgfCBDYW52YXMsICdnZXRDb250ZXh0Jz4gJiB7XG4gICAgZ2V0Q29udGV4dChjb250ZXh0SWQ6ICcyZCcpOiBXZWJPck5vZGVDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBudWxsO1xufTtcblxuXG4vKipcbiAqIERyYXdzIHRoZSBzdGF0ZSBvZiBhIHB1enpsZSBvbnRvIGEgY2FudmFzLCB1c2luZyB0aGUgY2FudmFzJ3Mgd2lkdGggYW5kIGhlaWdodC5cbiAqIFRoZSBncmlkIGlzIGRyYXduIHdpdGggMXB4IGdyZXkgYm9yZGVyIG9uIHRoZSBjbG9zZXN0IHBpeGVsIHBvc2l0aW9uIG9uIHRoZSBjYW52YXNcbiAqIHRvIG1ha2UgdGhlIGdyaWQgbGluZXMgZXZlbmx5IHNwYWNlZC5cbiAqIEVhY2ggcmVnaW9uIGlzIGRyYXduIHdpdGggYSByYW5kb20gY29sb3Igb2YgYmFja2dyb3VuZC5cbiAqIEVhY2ggc3RhciBpcyBkcmF3biB3aXRoaW4gZWFjaCBjZWxsLlxuICpcbiAqIEBwYXJhbSBjYW52YXMgdGhlIGNhbnZhcyB0byBiZSBkcmF3biB1cG9uLlxuICogQHBhcmFtIHB1enpsZSB0aGUgcHV6emxlIHRvIGJlIGRyYXduLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZHJhd1B1enpsZShjYW52YXM6IFdlYk9yTm9kZUNhbnZhcywgcHV6emxlOiBQdXp6bGUpOiB2b2lkIHtcbiAgICAvLyBqdXN0IGdsdWUgY29kZSwgbm8gbmVlZCB0byB0ZXN0XG4gICAgZHJhd1B1enpsZVJlZ2lvbkJhY2tncm91bmRzKGNhbnZhcywgcHV6emxlKTtcbiAgICBkcmF3UHV6emxlR3JpZChjYW52YXMsIHB1enpsZSk7XG4gICAgZHJhd1B1enpsZVN0YXJzKGNhbnZhcywgcHV6emxlKTtcbiAgICBkcmF3UHV6emxlUmVnaW9uQm9yZGVycyhjYW52YXMsIHB1enpsZSk7XG59XG5cbi8qKlxuICogRHJhd3MgYSBncmlkIG9mIHRoZSBwdXp6bGUgb250byBhIGNhbnZhcywgdXNpbmcgdGhlIGNhbnZhcydzIHdpZHRoIGFuZCBoZWlnaHQuXG4gKiBNb3JlIHByZWNpc2VseSwgdGhlIGdyaWQgaXMgZHJhd24gd2l0aCAxcHggZ3JleSAoIzU1NTU1NSkgYm9yZGVyIG9uIHRoZSBjbG9zZXN0IHBpeGVsIHBvc2l0aW9uXG4gKiBvbiB0aGUgY2FudmFzIHRvIG1ha2UgdGhlIGdyaWQgbGluZXMgZXZlbmx5IHNwYWNlZC5cbiAqXG4gKiBAcGFyYW0gY2FudmFzIHRoZSBjYW52YXMgdG8gYmUgZHJhd24gdXBvbi5cbiAqIEBwYXJhbSBwdXp6bGUgdGhlIHB1enpsZSB0byBiZSBkcmF3bi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRyYXdQdXp6bGVHcmlkKGNhbnZhczogV2ViT3JOb2RlQ2FudmFzLCBwdXp6bGU6IFB1enpsZSk6IHZvaWQge1xuICAgIGNvbnN0IEZJTExfQ09MT1IgPSBcIiM1NTU1NTVcIjtcbiAgICBjb25zdCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKSA/PyBhc3NlcnQuZmFpbChcIm51bGwgY29udGV4dFwiKTtcbiAgICBjb250ZXh0LmZpbGxTdHlsZSA9IEZJTExfQ09MT1I7XG4gICAgZm9yIChsZXQgeCA9IDA7IHggPD0gcHV6emxlLmNvbHM7IHggKz0gMSkge1xuICAgICAgICBjb25zdCBjYW52YXNYID0gTWF0aC5yb3VuZCgoY2FudmFzLndpZHRoIC0gMSkgKiB4IC8gcHV6emxlLmNvbHMpO1xuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KGNhbnZhc1gsIDAsIDEsIGNhbnZhcy5oZWlnaHQpO1xuICAgIH1cbiAgICBmb3IgKGxldCB5ID0gMDsgeSA8PSBwdXp6bGUucm93czsgeSArPSAxKSB7XG4gICAgICAgIGNvbnN0IGNhbnZhc1kgPSBNYXRoLnJvdW5kKChjYW52YXMuaGVpZ2h0IC0gMSkgKiB5IC8gcHV6emxlLnJvd3MpO1xuICAgICAgICBjb250ZXh0LmZpbGxSZWN0KDAsIGNhbnZhc1ksIGNhbnZhcy53aWR0aCwgMSk7XG4gICAgfVxufVxuXG4vKipcbiAqIERyYXdzIHRoZSByZWdpb25zIG9mIHRoZSBwdXp6bGUgb250byBhIGNhbnZhcywgdXNpbmcgdGhlIGNhbnZhcydzIHdpZHRoIGFuZCBoZWlnaHQuXG4gKiBFYWNoIHJlZ2lvbiBpcyBhc3NpZ25lZCBhIHJhbmRvbSBjb2xvciB3aXRoIDc1JSBsaWdodG5lc3MsIFxuICogYW5kIHRoZSBiYWNrZ3JvdW5kcyBvZiBlYWNoIHNxdWFyZSBjZWxsIGluIGVhY2ggcmVnaW9uIGFyZSBjb2xvcmVkIHRoaXMgY29sb3IuXG4gKiBUaGUgYm91bmRzIG9mIHRoZSBzcXVhcmUgY2VsbHMgYXJlIGRldGVybWluZWQgdG8gbWFrZSBlYWNoIHNxdWFyZSBjZWxsIGhhdmUgYXMgY2xvc2UgdG8gaWRlbnRpY2FsXG4gKiB3aWR0aCBhbmQgaGVpZ2h0IGFzIHBvc3NpYmxlLlxuICpcbiAqIEBwYXJhbSBjYW52YXMgdGhlIGNhbnZhcyB0byBiZSBkcmF3biB1cG9uLlxuICogQHBhcmFtIHB1enpsZSB0aGUgcHV6emxlIHRvIGJlIGRyYXduLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZHJhd1B1enpsZVJlZ2lvbkJhY2tncm91bmRzKGNhbnZhczogV2ViT3JOb2RlQ2FudmFzLCBwdXp6bGU6IFB1enpsZSk6IHZvaWQge1xuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIGhleCBzdHJpbmcgb2YgYSByYW5kb20gSFNMIGNvbG9yLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIGdldFJhbmRvbUNvbG9yKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IGRlZ3JlZXMgPSAzNjA7XG4gICAgICAgIGNvbnN0IGxpZ2h0bmVzcyA9IDc1O1xuICAgICAgICBjb25zdCBwZXJjZW50ID0gMTAwO1xuICAgICAgICByZXR1cm4gYGhzbCgke01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDM2MCl9LCAke01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwMCl9JSwgJHtsaWdodG5lc3N9JSlgO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpID8/IGFzc2VydC5mYWlsKFwibnVsbCBjb250ZXh0XCIpO1xuICAgIGNvbnN0IHJlZ2lvbkNvbG9ycyA9IG5ldyBNYXA8bnVtYmVyLCBzdHJpbmc+KCk7XG5cbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IHB1enpsZS5jb2xzOyB4ICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCBwdXp6bGUucm93czsgeSArPSAxKSB7XG4gICAgICAgICAgICBjb25zdCBzcXVhcmVMZWZ0ID0gTWF0aC5yb3VuZCgoY2FudmFzLndpZHRoKSAqIHggLyBwdXp6bGUuY29scyk7XG4gICAgICAgICAgICBjb25zdCBzcXVhcmVSaWdodCA9IE1hdGgucm91bmQoKGNhbnZhcy53aWR0aCkgKiAoeCArIDEpIC8gcHV6emxlLmNvbHMpO1xuICAgICAgICAgICAgY29uc3Qgc3F1YXJlVG9wID0gTWF0aC5yb3VuZCgoY2FudmFzLmhlaWdodCkgKiB5IC8gcHV6emxlLnJvd3MpO1xuICAgICAgICAgICAgY29uc3Qgc3F1YXJlQm90dG9tID0gTWF0aC5yb3VuZCgoY2FudmFzLmhlaWdodCkgKiAoeSArIDEpLyBwdXp6bGUucm93cyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJlZ2lvbklkID0gcHV6emxlLmdldENlbGwoe2NvbDogeCwgcm93OiB5fSkucmVnaW9uSWQ7XG4gICAgICAgICAgICBjb25zdCByZWdpb25Db2xvciA9IHJlZ2lvbkNvbG9ycy5nZXQocmVnaW9uSWQpID8/IGdldFJhbmRvbUNvbG9yKCk7XG4gICAgICAgICAgICByZWdpb25Db2xvcnMuc2V0KHJlZ2lvbklkLCByZWdpb25Db2xvcik7XG5cbiAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gcmVnaW9uQ29sb3I7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGxSZWN0KHNxdWFyZUxlZnQsIHNxdWFyZVRvcCwgc3F1YXJlUmlnaHQgLSBzcXVhcmVMZWZ0LCBzcXVhcmVCb3R0b20gLSBzcXVhcmVUb3ApO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5cbi8qKlxuICogRHJhd3MgYm9yZGVyIGFyb3VuZCB0aGUgcmVnaW9ucyBvZiB0aGUgcHV6emxlLlxuICogRWFjaCBib3JkZXIgaXMgMyB1bml0cyB3aWRlIGFuZCBibGFjayBpbiBjb2xvci5cbiAqXG4gKiBAcGFyYW0gY2FudmFzIHRoZSBjYW52YXMgdG8gYmUgZHJhd24gdXBvbi5cbiAqIEBwYXJhbSBwdXp6bGUgdGhlIHB1enpsZSB0byBiZSBkcmF3bi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRyYXdQdXp6bGVSZWdpb25Cb3JkZXJzKGNhbnZhcyA6IFdlYk9yTm9kZUNhbnZhcywgcHV6emxlIDogUHV6emxlKSA6IHZvaWQge1xuICAgIGNvbnN0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSA/PyBhc3NlcnQuZmFpbCgnbnVsbCBjb250ZXh0Jyk7XG4gICAgY29udGV4dC5zYXZlKCk7XG4gICAgY29udGV4dC5zdHJva2VTdHlsZSA9ICdibGFjayc7XG4gICAgY29udGV4dC5saW5lV2lkdGggPSAzO1xuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgXG4gICAgLy8gY2hlY2sgdGhlIGNlbGxzIChpLCBqKSBhbmQgKGkgLSAxLCBqKSwgaWYgdGhleSBhcmUgbm90IFxuICAgIC8vIGZyb20gdGhlIHNhbWUgcmVnaW9uLCB0aGVuIGFkZCBhIGhvcml6b250YWwgYm9yZGVyIGJldHdlZW4gdGhlbVxuICAgIGZvcihsZXQgaSA9IDE7IGkgPCBwdXp6bGUucm93czsgaSsrKSB7XG4gICAgICAgIGZvcihsZXQgaiA9IDA7IGogPCBwdXp6bGUuY29sczsgaisrKSB7XG4gICAgICAgICAgICBjb25zdCBzdGFydFggPSBqICogY2FudmFzLndpZHRoIC8gcHV6emxlLmNvbHM7XG4gICAgICAgICAgICBjb25zdCBlbmRYID0gKGogKyAxKSAqIGNhbnZhcy53aWR0aCAvIHB1enpsZS5jb2xzO1xuICAgICAgICAgICAgY29uc3QgeSA9IGkgKiBjYW52YXMuaGVpZ2h0IC8gcHV6emxlLnJvd3M7XG4gICAgICAgICAgICBpZihwdXp6bGUuZ2V0Q2VsbCh7cm93OiBpIC0gMSwgY29sOiBqfSkucmVnaW9uSWQgIT09IHB1enpsZS5nZXRDZWxsKHtyb3c6IGksIGNvbDogan0pLnJlZ2lvbklkKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oc3RhcnRYLCB5KTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyhlbmRYLCB5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIGNoZWNrIHRoZSBjZWxscyAoaSwgaikgYW5kIChpLCBqIC0gMSksIGlmIHRoZXkgYXJlIG5vdCBcbiAgICAvLyBmcm9tIHRoZSBzYW1lIHJlZ2lvbiwgdGhlbiBhZGQgYSB2ZXJ0aWNhbCBib3JkZXIgYmV0d2VlbiB0aGVtXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IHB1enpsZS5yb3dzOyBpKyspIHtcbiAgICAgICAgZm9yKGxldCBqID0gMTsgaiA8IHB1enpsZS5jb2xzOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHggPSBqICogY2FudmFzLndpZHRoIC8gcHV6emxlLmNvbHM7XG4gICAgICAgICAgICBjb25zdCBzdGFydFkgPSBpICogY2FudmFzLmhlaWdodCAvIHB1enpsZS5yb3dzO1xuICAgICAgICAgICAgY29uc3QgZW5kWSA9IChpICsgMSkgKiBjYW52YXMuaGVpZ2h0IC8gcHV6emxlLnJvd3M7XG4gICAgICAgICAgICBpZihwdXp6bGUuZ2V0Q2VsbCh7cm93OiBpLCBjb2w6IGogLSAxfSkucmVnaW9uSWQgIT09IHB1enpsZS5nZXRDZWxsKHtyb3c6IGksIGNvbDogan0pLnJlZ2lvbklkKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8oeCwgc3RhcnRZKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmxpbmVUbyh4LCBlbmRZKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBhZGQgYm9yZGVycyBhcm91bmQgdGhlIHdob2xlIHB1enpsZVxuICAgIGNvbnRleHQubW92ZVRvKDAsIDApOyBcbiAgICBjb250ZXh0LmxpbmVUbygwLCBjYW52YXMuaGVpZ2h0KTtcbiAgICBjb250ZXh0LmxpbmVUbyhjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgIGNvbnRleHQubGluZVRvKGNhbnZhcy53aWR0aCwgMCk7XG4gICAgY29udGV4dC5saW5lVG8oMCwgMCk7XG4gICAgY29udGV4dC5zdHJva2UoKTtcbiAgICBjb250ZXh0LnJlc3RvcmUoKTtcbn1cblxuXG4vKipcbiAqIERyYXdzIHRoZSBzdGFycyBvZiB0aGUgcHV6emxlIG9udG8gYSBjYW52YXMsIHVzaW5nIGNhbnZhcydzIHdpZHRoIGFuZCBoZWlnaHQuXG4gKiBUaGUgc3RhciBpY29uIGlzIGRyYXduIHdpdGggYmxhY2sgY29sb3IgYW5kIHdpbGwgY292ZXIgdGhlIGNlbnRlciBwaXhlbCBvZiBlYWNoIHNxdWFyZSBjZWxsLlxuICpcbiAqIEBwYXJhbSBjYW52YXMgdGhlIGNhbnZhcyB0byBiZSBkcmF3biB1cG9uLlxuICogQHBhcmFtIHB1enpsZSB0aGUgcHV6emxlIHRvIGJlIGRyYXduIHVwb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkcmF3UHV6emxlU3RhcnMoY2FudmFzOiBXZWJPck5vZGVDYW52YXMsIHB1enpsZTogUHV6emxlKTogdm9pZCB7XG4gICAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIikgPz8gYXNzZXJ0LmZhaWwoXCJudWxsIGNvbnRleHRcIik7XG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcIiMwMDAwMDBcIjtcblxuICAgIC8qKlxuICAgICAqIERyYXdzIGEgc3RhciBzeW1ib2wgYXQgdGhlIHNwZWNpZmllZCBsb2NhdGlvbiBhbmQgd2l0aCB0aGUgc3BlY2lmaWVkIHNpemUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gbGVmdCB0aGUgbGVmdCBib3VuZCBvZiB0aGUgc3RhciBzeW1ib2wsIHBvc2l0aXZlIGludGVnZXJcbiAgICAgKiBAcGFyYW0gdG9wIHRoZSB0b3AgYm91bmQgb2YgdGhlIHN0YXIgc3ltYm9sLCBwb3NpdGl2ZSBpbnRlZ2VyXG4gICAgICogQHBhcmFtIHdpZHRoIHRoZSB3aWR0aCB0aGUgc3RhciBzeW1ib2wgb2NjdXBpZXMsIHBvc2l0aXZlIGludGVnZXJcbiAgICAgKiBAcGFyYW0gaGVpZ2h0IHRoZSBoZWlnaHQgdGhlIHN0YXIgc3ltYm9sIG9jY3VwaWVzLCBwb3NpdGl2ZSBpbnRlZ2VyXG4gICAgICovXG4gICAgZnVuY3Rpb24gZHJhd1N0YXIobGVmdDogbnVtYmVyLCB0b3A6IG51bWJlciwgd2lkdGg6IG51bWJlciwgaGVpZ2h0OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgTUlERExFID0gMC41O1xuICAgICAgICBjb25zdCBNQUpPUl9MRU5HVEggPSAwLjQ7XG4gICAgICAgIGNvbnN0IE1JTk9SX0xFTkdUSCA9IDAuMTU7XG4gICAgICAgIGNvbnN0IHN0YXJQYXRoczogW251bWJlciwgbnVtYmVyXVtdW10gPSBbXG4gICAgICAgICAgICBbW01JRERMRSwgTUlERExFIC0gTUFKT1JfTEVOR1RIXSwgW01JRERMRSAtIE1JTk9SX0xFTkdUSCwgTUlERExFXV0sXG4gICAgICAgICAgICBbW01JRERMRSArIE1BSk9SX0xFTkdUSCwgTUlERExFXSwgW01JRERMRSwgTUlERExFIC0gTUlOT1JfTEVOR1RIXV0sXG4gICAgICAgICAgICBbW01JRERMRSwgTUlERExFICsgTUFKT1JfTEVOR1RIXSwgW01JRERMRSArIE1JTk9SX0xFTkdUSCwgTUlERExFXV0sXG4gICAgICAgICAgICBbW01JRERMRSAtIE1BSk9SX0xFTkdUSCwgTUlERExFXSwgW01JRERMRSwgTUlERExFICsgTUlOT1JfTEVOR1RIXV0sXG4gICAgICAgIF07XG5cbiAgICAgICAgY29uc3QgcmVsYXRpdmVUb0Fic29sdXRlWCA9ICh4OiBudW1iZXIpOiBudW1iZXIgPT4gTWF0aC5yb3VuZChsZWZ0ICsgd2lkdGggKiB4KTtcbiAgICAgICAgY29uc3QgcmVsYXRpdmVUb0Fic29sdXRlWSA9ICh5OiBudW1iZXIpOiBudW1iZXIgPT4gTWF0aC5yb3VuZCh0b3AgKyBoZWlnaHQgKiB5KTtcblxuICAgICAgICBmb3IgKGNvbnN0IHBvbHlnb24gb2Ygc3RhclBhdGhzKSB7XG4gICAgICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgY29udGV4dC5tb3ZlVG8ocmVsYXRpdmVUb0Fic29sdXRlWChNSURETEUpLCByZWxhdGl2ZVRvQWJzb2x1dGVZKE1JRERMRSkpO1xuICAgICAgICAgICAgZm9yIChjb25zdCBwb3NpdGlvbiBvZiBwb2x5Z29uKSB7XG4gICAgICAgICAgICAgICAgY29udGV4dC5saW5lVG8ocmVsYXRpdmVUb0Fic29sdXRlWChwb3NpdGlvblswXSksIHJlbGF0aXZlVG9BYnNvbHV0ZVkocG9zaXRpb25bMV0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IHggPSAwOyB4IDwgcHV6emxlLmNvbHM7IHggKz0gMSkge1xuICAgICAgICBmb3IgKGxldCB5ID0gMDsgeSA8IHB1enpsZS5yb3dzOyB5ICs9IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IHNxdWFyZUxlZnQgPSBNYXRoLnJvdW5kKChjYW52YXMud2lkdGgpICogeCAvIHB1enpsZS5jb2xzKTtcbiAgICAgICAgICAgIGNvbnN0IHNxdWFyZVJpZ2h0ID0gTWF0aC5yb3VuZCgoY2FudmFzLndpZHRoKSAqICh4ICsgMSkgLyBwdXp6bGUuY29scyk7XG4gICAgICAgICAgICBjb25zdCBzcXVhcmVUb3AgPSBNYXRoLnJvdW5kKChjYW52YXMuaGVpZ2h0KSAqIHkgLyBwdXp6bGUucm93cyk7XG4gICAgICAgICAgICBjb25zdCBzcXVhcmVCb3R0b20gPSBNYXRoLnJvdW5kKChjYW52YXMuaGVpZ2h0KSAqICh5ICsgMSkvIHB1enpsZS5yb3dzKTtcblxuICAgICAgICAgICAgaWYgKHB1enpsZS5nZXRDZWxsKHtjb2w6IHgsIHJvdzogeX0pLmNvbnRhaW5zU3Rhcikge1xuICAgICAgICAgICAgICAgIGRyYXdTdGFyKHNxdWFyZUxlZnQsIHNxdWFyZVRvcCwgc3F1YXJlUmlnaHQgLSBzcXVhcmVMZWZ0LCBzcXVhcmVCb3R0b20gLSBzcXVhcmVUb3ApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiLyogQ29weXJpZ2h0IChjKSAyMDIxLTIzIE1JVCA2LjEwMi82LjAzMSBjb3Vyc2Ugc3RhZmYsIGFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKiBSZWRpc3RyaWJ1dGlvbiBvZiBvcmlnaW5hbCBvciBkZXJpdmVkIHdvcmsgcmVxdWlyZXMgcGVybWlzc2lvbiBvZiBjb3Vyc2Ugc3RhZmYuXG4gKi9cblxuLy8gVGhpcyBjb2RlIGlzIGxvYWRlZCBpbnRvIHN0YXJiLWNsaWVudC5odG1sLCBzZWUgdGhlIGBucG0gY29tcGlsZWAgYW5kXG4vLyAgIGBucG0gd2F0Y2hpZnktY2xpZW50YCBzY3JpcHRzLlxuLy8gUmVtZW1iZXIgdGhhdCB5b3Ugd2lsbCAqbm90KiBiZSBhYmxlIHRvIHVzZSBOb2RlIEFQSXMgbGlrZSBgZnNgIGluIHRoZSB3ZWIgYnJvd3Nlci5cblxuaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnO1xuaW1wb3J0IHsgV2ViQ2xpZW50IH0gZnJvbSAnLi9XZWJDbGllbnQnO1xuLyoqXG4gKiBQdXp6bGUgdG8gcmVxdWVzdCBhbmQgcGxheS5cbiAqIFByb2plY3QgaW5zdHJ1Y3Rpb25zOiB0aGlzIGNvbnN0YW50IGlzIGEgW2ZvciBub3ddIHJlcXVpcmVtZW50IGluIHRoZSBwcm9qZWN0IHNwZWMuXG4gKi9cbmNvbnN0IFBVWlpMRSA9IFwia2QtNi0zMS02XCI7XG4vLyBjb25zdCBQVVpaTEUgPSBcImtkLTEtMS0xXCI7XG5cbi8vIHNlZSBFeGFtcGxlUGFnZS50cyBmb3IgYW4gZXhhbXBsZSBvZiBhbiBpbnRlcmFjdGl2ZSB3ZWIgcGFnZVxuXG4vKipcbiAqIENsZWFyIHRoZSB0ZXh0IGZyb20gdGhlIGh0bWwgdGV4dEFyZWEgRWxlbWVudCBhbmQgZGlzcGxheSB0aGUgbmV3IG1lc3NhZ2VcbiAqIFxuICogQHBhcmFtIG1lc3NhZ2UgdGhlIG1lc3NhZ2UgdGhhdCB5b3Ugd2FudCB0byBkaXNwbGF5IG9uIHRoZSBodG1sIHBhZ2VcbiAqIEBwYXJhbSB0ZXh0QXJlYSB0aGUgSFRNTCBlbGVtZW50IHRoYXQgdGhlIG1lc3NhZ2Ugd2lsbCBiZSBkaXNwbGF5ZWQgb25cbiAqL1xuZnVuY3Rpb24gZGlzcGxheU1lc3NhZ2UobWVzc2FnZTpzdHJpbmcsIHRleHRBcmVhOiBIVE1MRWxlbWVudCk6IHZvaWQge1xuICAgIHRleHRBcmVhLmlubmVyVGV4dD0gbWVzc2FnZTtcbn1cblxuLyoqXG4gKiBCZWdpbnMgdGhlIGNsaWVudCBhbmQgdGhlIGdhbWUgb24gdGhlIGNhbnZhc1xuICovXG5hc3luYyBmdW5jdGlvbiBtYWluKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKSA/PyBhc3NlcnQuZmFpbCgpO1xuXG4gICAgLy9nZXQgYSB0ZXh0IGFyZWEgdGhhdCBpbmZvcm1zIHRoZSB1c2VyIHdoZW4gdGhlIGdhbWUgaXMgZmluaXNoZWRcbiAgICBjb25zdCBvdXRwdXRBcmVhOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdvdXRwdXRBcmVhJykgPz8gYXNzZXJ0LmZhaWwoJ21pc3Npbmcgb3V0cHV0IGFyZWEnKTtcblxuICAgIGNvbnN0IHdpbm5pbmdNZXNzYWdlID0gXCJUaGUgQm9hcmQgaGFzIGJlZW4gc29sdmVkISFcIjtcbiAgICBjb25zdCBzdGFydGluZ0RpcmVjdGlvbiA9IFwiQ2xpY2sgb24gYW55IGFyZWEgb24gdGhlIGJvYXJkIHRvIHBsYWNlIGEgc3RhciFcIjtcblxuXG4gICAgY29uc3Qgd2ViY2xpZW50ID0gYXdhaXQgV2ViQ2xpZW50LnJlcXVlc3QoUFVaWkxFLCBjYW52YXMgYXMgSFRNTENhbnZhc0VsZW1lbnQpO1xuICAgIC8vY2hlY2sgdG8gc2VlIGlmIHRoZSBib2FyZCBpcyBhbHJlYWR5IGEgc29sdmVkIGJvYXJkXG4gICAgaWYgKHdlYmNsaWVudC5pc0JvYXJkU29sdmVkKCkpe1xuICAgICAgICBjb25zb2xlLmxvZyhcImlzIHNvbHZlZCFcIik7XG4gICAgICAgIGRpc3BsYXlNZXNzYWdlKHdpbm5pbmdNZXNzYWdlLCBvdXRwdXRBcmVhKTtcbiAgICB9XG4gICAgZWxzZXtcbiAgICAgICAgZGlzcGxheU1lc3NhZ2Uoc3RhcnRpbmdEaXJlY3Rpb24sIG91dHB1dEFyZWEpO1xuICAgIH1cblxuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlIDogTW91c2VFdmVudCkgPT4ge1xuICAgICAgICB3ZWJjbGllbnQuY2xpY2soZS5vZmZzZXRYLCBlLm9mZnNldFkpO1xuICAgICAgICBjb25zb2xlLmxvZyh3ZWJjbGllbnQuaXNCb2FyZFNvbHZlZCgpKTtcbiAgICAgICAgaWYgKHdlYmNsaWVudC5pc0JvYXJkU29sdmVkKCkpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJpcyBzb2x2ZWQhXCIpO1xuICAgICAgICAgICAgZGlzcGxheU1lc3NhZ2Uod2lubmluZ01lc3NhZ2UsIG91dHB1dEFyZWEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBkaXNwbGF5TWVzc2FnZShcIlwiLCBvdXRwdXRBcmVhKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbn1cblxudm9pZCBtYWluKCk7XG4iLCJpbXBvcnQgeyBQdXp6bGUsIFBvc2l0aW9uIH0gZnJvbSBcIi4vUHV6emxlXCI7XG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gXCIuL1BhcnNlclwiO1xuaW1wb3J0IGFzc2VydCBmcm9tIFwiYXNzZXJ0XCI7XG5pbXBvcnQge2RyYXdQdXp6bGV9IGZyb20gXCIuL1B1enpsZURyYXdlclwiO1xuaW1wb3J0IHR5cGUgeyBDYW52YXMsIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCBhcyBOb2RlQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIH0gZnJvbSAnY2FudmFzJztcblxuLyoqXG4gKiBFaXRoZXI6IGEgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGluIHRoZSB3ZWIgYnJvd3NlcixcbiAqICAgICAgb3IgYSBOb2RlQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIGluIE5vZGUgKGZvciB0ZXN0aW5nKVxuICovXG50eXBlIFdlYk9yTm9kZUNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCA9IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IE5vZGVDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XG5cbi8qKlxuICogRWl0aGVyOiBhIEhUTUxDYW52YXNFbGVtZW50IHJlcHJlc2VudGluZyBhIGA8Y2FudmFzPmAgb24gdGhlIHdlYiBwYWdlLFxuICogICAgICBvciBhIENhbnZhcyByZXByZXNlbnRpbmcgYSBjYW52YXMgaW4gTm9kZSAoZm9yIHRlc3RpbmcpXG4gKi9cbnR5cGUgV2ViT3JOb2RlQ2FudmFzID0gT21pdDxIVE1MQ2FudmFzRWxlbWVudCB8IENhbnZhcywgJ2dldENvbnRleHQnPiAmIHtcbiAgICBnZXRDb250ZXh0KGNvbnRleHRJZDogJzJkJyk6IFdlYk9yTm9kZUNhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IG51bGw7XG59O1xuXG4vKipcbiAqIEFEVCByZXByZXNlbnRpbmcgdGhlIHN0YXRlIG9mIHRoZSB3ZWIgY2xpZW50IG9mIHRoZSBTdGFyIEJhdHRsZSBwdXp6bGUgd2ViIGludGVyZmFjZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFdlYkNsaWVudCB7XG4gICAgLyoqXG4gICAgICogQWJzdHJhY3Rpb24gRnVuY3Rpb246IHB1enpsZSByZXByZXNlbnRzIHRoZSBTdGFyIEJhdHRsZSBwdXp6bGUgdGhlIHVzZXIgaXMgaW50ZXJhY3Rpbmcgd2l0aCwgYW5kIFxuICAgICAqIHRoZSBjYW52YXMgb2JqZWN0IHRvIGRyYXcgdGhlIHB1enpsZVxuICAgICAqIFxuICAgICAqIFJlcCBpbnZhcmlhbnQ6IGNhbnZhcyBtdXN0IGhhdmUgcG9zaXRpdmUgd2lkdGggYW5kIGhlaWdodFxuICAgICAqIFxuICAgICAqIEV4cG9zdXJlOiBQdXp6bGUgaXMgYSBpbW11dGFibGUgb2JqZWN0LCBzbyB0aGVyZSBpcyBubyBwcm9ibGVtIGV2ZW4gaWYgaXQncyBhbGlhc2VkLlxuICAgICAqICAgICAgICAgICBjYW52YXMgaXMgbXV0YWJsZSBhbmQgY2FuIGJlIGFsaWFzZWQuIEhvd2V2ZXIsIHRoZSBkcmF3SW1hZ2UgZnVuY3Rpb24gcmVyZW5kZXJzXG4gICAgICogICAgICAgICAgIGNhbnZhcyBvYmplY3QgYXQgZWFjaCBzdGVwLCBzbyBvdXIgaW1wbGVtZW50YXRpb24gc3RpbGwgd29ya3MgaWYgaXQncyBhbGlhc2VkIGJ5XG4gICAgICogICAgICAgICAgIHRoZSBjbGllbnQuXG4gICAgICovXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgbmV3IHdlYiBjbGllbnQgb2JqZWN0XG4gICAgICpcbiAgICAgKiBAcGFyYW0gcHV6emxlIHB1enpsZSBvYmplY3QgdGhhdCB0aGUgY2xpZW50IGlzIHBsYXlpbmdcbiAgICAgKiBAcGFyYW0gY2FudmFzIGNhbnZhcyBvYmplY3QgdGhhdCByZW5kZXJzIHRoZSBwdXp6bGUgZHJhd2luZ1xuICAgICAqL1xuICAgIHByaXZhdGUgY29uc3RydWN0b3IocHJpdmF0ZSBwdXp6bGUgOiBQdXp6bGUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwcml2YXRlIHJlYWRvbmx5IGNhbnZhcyA6IFdlYk9yTm9kZUNhbnZhcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tSZXAoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRyYXdQdXp6bGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgIHByaXZhdGUgY2hlY2tSZXAoKSA6IHZvaWQge1xuICAgICAgICBhc3NlcnQodGhpcy5jYW52YXMud2lkdGggPiAwKTtcbiAgICAgICAgYXNzZXJ0KHRoaXMuY2FudmFzLmhlaWdodCA+IDApO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDcmVhdGVzIGEgV2ViQ2xpZW50IG9iamVjdCB0aGF0IFxuICAgICAqIFxuICAgICAqIEBwYXJhbSBmaWxlbmFtZSBuYW1lIG9mIHRoZSBmaWxlIHRvIGxvYWQgdGhlIHB1enpsZSBmcm9tXG4gICAgICogQHBhcmFtIGNhbnZhcyBjYW52YXMgb2JqZWN0IHRoYXQgZHJhd3MgdGhlIGdhbWVcbiAgICAgKiBAcmV0dXJucyBhIHdlYiBjbGllbnQgb2JqZWN0IHRoYXQgdGhlIGNsaWVudCBjYW4gaW50ZXJhY3Qgd2l0aFxuICAgICAqL1xuICAgIHB1YmxpYyBzdGF0aWMgYXN5bmMgcmVxdWVzdChmaWxlbmFtZSA6IHN0cmluZywgY2FudmFzIDogV2ViT3JOb2RlQ2FudmFzKSA6IFByb21pc2UgPFdlYkNsaWVudD4geyBcbiAgICAgICAgY29uc3QgdXJsID0gYGh0dHA6Ly9sb2NhbGhvc3Q6ODc4OS9wdXp6bGVzP25hbWU9JHtmaWxlbmFtZX1gO1xuICAgICAgICByZXR1cm4gZmV0Y2godXJsLCB7IG1ldGhvZDogJ2dldCcsIG1vZGU6ICdjb3JzJyB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS50ZXh0KCkpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHRleHQgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGV4dCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFdlYkNsaWVudChwYXJzZSh0ZXh0KSwgY2FudmFzKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIC8qKlxuICAgICAqIENhbGN1bGF0ZXMgdGhlIGhlaWdodCBvZiBlYWNoIHJvdyBpbiB0aGUgY2FudmFzIGRyYXdpbmdcbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHRoZSBoZWlnaHQgb2YgZWFjaCByb3dcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldCByb3dIZWlnaHQoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2FudmFzLmhlaWdodCAvIHRoaXMucHV6emxlLnJvd3M7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ2FsY3VsYXRlcyB0aGUgd2lkdGggb2YgZWFjaCBjb2x1bW4gaW4gdGhlIGNhbnZhcyBkcmF3aW5nXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB0aGUgd2lkdGggb2YgZWFjaCBjb2x1bW5cbiAgICAgKi9cbiAgICBwcml2YXRlIGdldCBjb2xXaWR0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5jYW52YXMud2lkdGgvIHRoaXMucHV6emxlLmNvbHM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBib2FyZCB0aGF0IHRoZSBjbGllbnQgaXMgcGxheWluZyB3aXRoIGlzIHNvbHZlZC5cbiAgICAgKiBGYWxzZSBvdGhlcndpc2VcbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyBhcyBkZXNjcmliZWQgYWJvdmUuXG4gICAgICovXG4gICAgcHVibGljIGlzQm9hcmRTb2x2ZWQoKTogYm9vbGVhbntcbiAgICAgICAgcmV0dXJuIHRoaXMucHV6emxlLmlzU29sdmVkKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBvciByZW1vdmVzIGEgc3RhciBmcm9tIHRoZSBjZWxsIHRoYXQgd2FzIGNsaWNrZWRcbiAgICAgKlxuICAgICAqIEBwYXJhbSBvZmZzZXRYIHggY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQgdGhhdCB3YXMgY2xpY2tlZFxuICAgICAqIEBwYXJhbSBvZmZzZXRZIHkgY29vcmRpbmF0ZSBvZiB0aGUgcG9pbnQgdGhhdCB3YXMgY2xpY2tlZFxuICAgICAqL1xuICAgIHB1YmxpYyBjbGljayhvZmZzZXRYIDogbnVtYmVyLCBvZmZzZXRZIDogbnVtYmVyKSA6IHZvaWQge1xuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHtcbiAgICAgICAgICAgIGNvbDogTWF0aC5mbG9vcihvZmZzZXRYIC8gdGhpcy5jb2xXaWR0aCksXG4gICAgICAgICAgICByb3c6IE1hdGguZmxvb3Iob2Zmc2V0WSAvIHRoaXMucm93SGVpZ2h0KVxuICAgICAgICB9O1xuICAgICAgICBjb25zb2xlLmxvZyhwb3NpdGlvbi5jb2wsIHBvc2l0aW9uLnJvdyk7XG4gICAgICAgIHRoaXMucHV6emxlID0gdGhpcy5wdXp6bGUuZmxpcChwb3NpdGlvbik7XG4gICAgICAgIHRoaXMuZHJhd1B1enpsZSgpO1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBkcmF3cyB0aGlzLnB1enpsZSB0byB0aGlzLmNhbnZhc1xuICAgICAqL1xuICAgIHByaXZhdGUgZHJhd1B1enpsZSgpOiB2b2lkIHtcbiAgICAgICAgZHJhd1B1enpsZSh0aGlzLmNhbnZhcywgdGhpcy5wdXp6bGUpO1xuICAgIH1cbn1cbiJdfQ==
