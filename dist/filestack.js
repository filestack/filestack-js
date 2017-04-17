/* v0.5.1 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.filestack = factory());
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}



function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};























































var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var es6Promise = createCommonjsModule(function (module, exports) {
  /*!
   * @overview es6-promise - a tiny implementation of Promises/A+.
   * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
   * @license   Licensed under MIT license
   *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
   * @version   4.1.0
   */

  (function (global, factory) {
    module.exports = factory();
  })(commonjsGlobal, function () {
    'use strict';

    function objectOrFunction(x) {
      return typeof x === 'function' || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) === 'object' && x !== null;
    }

    function isFunction(x) {
      return typeof x === 'function';
    }

    var _isArray = undefined;
    if (!Array.isArray) {
      _isArray = function _isArray(x) {
        return Object.prototype.toString.call(x) === '[object Array]';
      };
    } else {
      _isArray = Array.isArray;
    }

    var isArray = _isArray;

    var len = 0;
    var vertxNext = undefined;
    var customSchedulerFn = undefined;

    var asap = function asap(callback, arg) {
      queue[len] = callback;
      queue[len + 1] = arg;
      len += 2;
      if (len === 2) {
        // If len is 2, that means that we need to schedule an async flush.
        // If additional callbacks are queued before the queue is flushed, they
        // will be processed by this flush that we are scheduling.
        if (customSchedulerFn) {
          customSchedulerFn(flush);
        } else {
          scheduleFlush();
        }
      }
    };

    function setScheduler(scheduleFn) {
      customSchedulerFn = scheduleFn;
    }

    function setAsap(asapFn) {
      asap = asapFn;
    }

    var browserWindow = typeof window !== 'undefined' ? window : undefined;
    var browserGlobal = browserWindow || {};
    var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
    var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

    // test for web worker but not in IE10
    var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

    // node
    function useNextTick() {
      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
      // see https://github.com/cujojs/when/issues/410 for details
      return function () {
        return process.nextTick(flush);
      };
    }

    // vertx
    function useVertxTimer() {
      if (typeof vertxNext !== 'undefined') {
        return function () {
          vertxNext(flush);
        };
      }

      return useSetTimeout();
    }

    function useMutationObserver() {
      var iterations = 0;
      var observer = new BrowserMutationObserver(flush);
      var node = document.createTextNode('');
      observer.observe(node, { characterData: true });

      return function () {
        node.data = iterations = ++iterations % 2;
      };
    }

    // web worker
    function useMessageChannel() {
      var channel = new MessageChannel();
      channel.port1.onmessage = flush;
      return function () {
        return channel.port2.postMessage(0);
      };
    }

    function useSetTimeout() {
      // Store setTimeout reference so es6-promise will be unaffected by
      // other code modifying setTimeout (like sinon.useFakeTimers())
      var globalSetTimeout = setTimeout;
      return function () {
        return globalSetTimeout(flush, 1);
      };
    }

    var queue = new Array(1000);
    function flush() {
      for (var i = 0; i < len; i += 2) {
        var callback = queue[i];
        var arg = queue[i + 1];

        callback(arg);

        queue[i] = undefined;
        queue[i + 1] = undefined;
      }

      len = 0;
    }

    function attemptVertx() {
      try {
        var r = commonjsRequire;
        var vertx = r('vertx');
        vertxNext = vertx.runOnLoop || vertx.runOnContext;
        return useVertxTimer();
      } catch (e) {
        return useSetTimeout();
      }
    }

    var scheduleFlush = undefined;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (isNode) {
      scheduleFlush = useNextTick();
    } else if (BrowserMutationObserver) {
      scheduleFlush = useMutationObserver();
    } else if (isWorker) {
      scheduleFlush = useMessageChannel();
    } else if (browserWindow === undefined && typeof commonjsRequire === 'function') {
      scheduleFlush = attemptVertx();
    } else {
      scheduleFlush = useSetTimeout();
    }

    function then(onFulfillment, onRejection) {
      var _arguments = arguments;

      var parent = this;

      var child = new this.constructor(noop);

      if (child[PROMISE_ID] === undefined) {
        makePromise(child);
      }

      var _state = parent._state;

      if (_state) {
        (function () {
          var callback = _arguments[_state - 1];
          asap(function () {
            return invokeCallback(_state, child, callback, parent._result);
          });
        })();
      } else {
        subscribe(parent, child, onFulfillment, onRejection);
      }

      return child;
    }

    /**
      `Promise.resolve` returns a promise that will become resolved with the
      passed `value`. It is shorthand for the following:
    
      ```javascript
      let promise = new Promise(function(resolve, reject){
        resolve(1);
      });
    
      promise.then(function(value){
        // value === 1
      });
      ```
    
      Instead of writing the above, your code now simply becomes the following:
    
      ```javascript
      let promise = Promise.resolve(1);
    
      promise.then(function(value){
        // value === 1
      });
      ```
    
      @method resolve
      @static
      @param {Any} value value that the returned promise will be resolved with
      Useful for tooling.
      @return {Promise} a promise that will become fulfilled with the given
      `value`
    */
    function resolve(object) {
      /*jshint validthis:true */
      var Constructor = this;

      if (object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object.constructor === Constructor) {
        return object;
      }

      var promise = new Constructor(noop);
      _resolve(promise, object);
      return promise;
    }

    var PROMISE_ID = Math.random().toString(36).substring(16);

    function noop() {}

    var PENDING = void 0;
    var FULFILLED = 1;
    var REJECTED = 2;

    var GET_THEN_ERROR = new ErrorObject();

    function selfFulfillment() {
      return new TypeError("You cannot resolve a promise with itself");
    }

    function cannotReturnOwn() {
      return new TypeError('A promises callback cannot return that same promise.');
    }

    function getThen(promise) {
      try {
        return promise.then;
      } catch (error) {
        GET_THEN_ERROR.error = error;
        return GET_THEN_ERROR;
      }
    }

    function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
      try {
        then.call(value, fulfillmentHandler, rejectionHandler);
      } catch (e) {
        return e;
      }
    }

    function handleForeignThenable(promise, thenable, then) {
      asap(function (promise) {
        var sealed = false;
        var error = tryThen(then, thenable, function (value) {
          if (sealed) {
            return;
          }
          sealed = true;
          if (thenable !== value) {
            _resolve(promise, value);
          } else {
            fulfill(promise, value);
          }
        }, function (reason) {
          if (sealed) {
            return;
          }
          sealed = true;

          _reject(promise, reason);
        }, 'Settle: ' + (promise._label || ' unknown promise'));

        if (!sealed && error) {
          sealed = true;
          _reject(promise, error);
        }
      }, promise);
    }

    function handleOwnThenable(promise, thenable) {
      if (thenable._state === FULFILLED) {
        fulfill(promise, thenable._result);
      } else if (thenable._state === REJECTED) {
        _reject(promise, thenable._result);
      } else {
        subscribe(thenable, undefined, function (value) {
          return _resolve(promise, value);
        }, function (reason) {
          return _reject(promise, reason);
        });
      }
    }

    function handleMaybeThenable(promise, maybeThenable, then$$) {
      if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
        handleOwnThenable(promise, maybeThenable);
      } else {
        if (then$$ === GET_THEN_ERROR) {
          _reject(promise, GET_THEN_ERROR.error);
          GET_THEN_ERROR.error = null;
        } else if (then$$ === undefined) {
          fulfill(promise, maybeThenable);
        } else if (isFunction(then$$)) {
          handleForeignThenable(promise, maybeThenable, then$$);
        } else {
          fulfill(promise, maybeThenable);
        }
      }
    }

    function _resolve(promise, value) {
      if (promise === value) {
        _reject(promise, selfFulfillment());
      } else if (objectOrFunction(value)) {
        handleMaybeThenable(promise, value, getThen(value));
      } else {
        fulfill(promise, value);
      }
    }

    function publishRejection(promise) {
      if (promise._onerror) {
        promise._onerror(promise._result);
      }

      publish(promise);
    }

    function fulfill(promise, value) {
      if (promise._state !== PENDING) {
        return;
      }

      promise._result = value;
      promise._state = FULFILLED;

      if (promise._subscribers.length !== 0) {
        asap(publish, promise);
      }
    }

    function _reject(promise, reason) {
      if (promise._state !== PENDING) {
        return;
      }
      promise._state = REJECTED;
      promise._result = reason;

      asap(publishRejection, promise);
    }

    function subscribe(parent, child, onFulfillment, onRejection) {
      var _subscribers = parent._subscribers;
      var length = _subscribers.length;

      parent._onerror = null;

      _subscribers[length] = child;
      _subscribers[length + FULFILLED] = onFulfillment;
      _subscribers[length + REJECTED] = onRejection;

      if (length === 0 && parent._state) {
        asap(publish, parent);
      }
    }

    function publish(promise) {
      var subscribers = promise._subscribers;
      var settled = promise._state;

      if (subscribers.length === 0) {
        return;
      }

      var child = undefined,
          callback = undefined,
          detail = promise._result;

      for (var i = 0; i < subscribers.length; i += 3) {
        child = subscribers[i];
        callback = subscribers[i + settled];

        if (child) {
          invokeCallback(settled, child, callback, detail);
        } else {
          callback(detail);
        }
      }

      promise._subscribers.length = 0;
    }

    function ErrorObject() {
      this.error = null;
    }

    var TRY_CATCH_ERROR = new ErrorObject();

    function tryCatch(callback, detail) {
      try {
        return callback(detail);
      } catch (e) {
        TRY_CATCH_ERROR.error = e;
        return TRY_CATCH_ERROR;
      }
    }

    function invokeCallback(settled, promise, callback, detail) {
      var hasCallback = isFunction(callback),
          value = undefined,
          error = undefined,
          succeeded = undefined,
          failed = undefined;

      if (hasCallback) {
        value = tryCatch(callback, detail);

        if (value === TRY_CATCH_ERROR) {
          failed = true;
          error = value.error;
          value.error = null;
        } else {
          succeeded = true;
        }

        if (promise === value) {
          _reject(promise, cannotReturnOwn());
          return;
        }
      } else {
        value = detail;
        succeeded = true;
      }

      if (promise._state !== PENDING) {
        // noop
      } else if (hasCallback && succeeded) {
        _resolve(promise, value);
      } else if (failed) {
        _reject(promise, error);
      } else if (settled === FULFILLED) {
        fulfill(promise, value);
      } else if (settled === REJECTED) {
        _reject(promise, value);
      }
    }

    function initializePromise(promise, resolver) {
      try {
        resolver(function resolvePromise(value) {
          _resolve(promise, value);
        }, function rejectPromise(reason) {
          _reject(promise, reason);
        });
      } catch (e) {
        _reject(promise, e);
      }
    }

    var id = 0;
    function nextId() {
      return id++;
    }

    function makePromise(promise) {
      promise[PROMISE_ID] = id++;
      promise._state = undefined;
      promise._result = undefined;
      promise._subscribers = [];
    }

    function Enumerator(Constructor, input) {
      this._instanceConstructor = Constructor;
      this.promise = new Constructor(noop);

      if (!this.promise[PROMISE_ID]) {
        makePromise(this.promise);
      }

      if (isArray(input)) {
        this._input = input;
        this.length = input.length;
        this._remaining = input.length;

        this._result = new Array(this.length);

        if (this.length === 0) {
          fulfill(this.promise, this._result);
        } else {
          this.length = this.length || 0;
          this._enumerate();
          if (this._remaining === 0) {
            fulfill(this.promise, this._result);
          }
        }
      } else {
        _reject(this.promise, validationError());
      }
    }

    function validationError() {
      return new Error('Array Methods must be provided an Array');
    }

    Enumerator.prototype._enumerate = function () {
      var length = this.length;
      var _input = this._input;

      for (var i = 0; this._state === PENDING && i < length; i++) {
        this._eachEntry(_input[i], i);
      }
    };

    Enumerator.prototype._eachEntry = function (entry, i) {
      var c = this._instanceConstructor;
      var resolve$$ = c.resolve;

      if (resolve$$ === resolve) {
        var _then = getThen(entry);

        if (_then === then && entry._state !== PENDING) {
          this._settledAt(entry._state, i, entry._result);
        } else if (typeof _then !== 'function') {
          this._remaining--;
          this._result[i] = entry;
        } else if (c === Promise) {
          var promise = new c(noop);
          handleMaybeThenable(promise, entry, _then);
          this._willSettleAt(promise, i);
        } else {
          this._willSettleAt(new c(function (resolve$$) {
            return resolve$$(entry);
          }), i);
        }
      } else {
        this._willSettleAt(resolve$$(entry), i);
      }
    };

    Enumerator.prototype._settledAt = function (state, i, value) {
      var promise = this.promise;

      if (promise._state === PENDING) {
        this._remaining--;

        if (state === REJECTED) {
          _reject(promise, value);
        } else {
          this._result[i] = value;
        }
      }

      if (this._remaining === 0) {
        fulfill(promise, this._result);
      }
    };

    Enumerator.prototype._willSettleAt = function (promise, i) {
      var enumerator = this;

      subscribe(promise, undefined, function (value) {
        return enumerator._settledAt(FULFILLED, i, value);
      }, function (reason) {
        return enumerator._settledAt(REJECTED, i, reason);
      });
    };

    /**
      `Promise.all` accepts an array of promises, and returns a new promise which
      is fulfilled with an array of fulfillment values for the passed promises, or
      rejected with the reason of the first passed promise to be rejected. It casts all
      elements of the passed iterable to promises as it runs this algorithm.
    
      Example:
    
      ```javascript
      let promise1 = resolve(1);
      let promise2 = resolve(2);
      let promise3 = resolve(3);
      let promises = [ promise1, promise2, promise3 ];
    
      Promise.all(promises).then(function(array){
        // The array here would be [ 1, 2, 3 ];
      });
      ```
    
      If any of the `promises` given to `all` are rejected, the first promise
      that is rejected will be given as an argument to the returned promises's
      rejection handler. For example:
    
      Example:
    
      ```javascript
      let promise1 = resolve(1);
      let promise2 = reject(new Error("2"));
      let promise3 = reject(new Error("3"));
      let promises = [ promise1, promise2, promise3 ];
    
      Promise.all(promises).then(function(array){
        // Code here never runs because there are rejected promises!
      }, function(error) {
        // error.message === "2"
      });
      ```
    
      @method all
      @static
      @param {Array} entries array of promises
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise} promise that is fulfilled when all `promises` have been
      fulfilled, or rejected if any of them become rejected.
      @static
    */
    function all(entries) {
      return new Enumerator(this, entries).promise;
    }

    /**
      `Promise.race` returns a new promise which is settled in the same way as the
      first passed promise to settle.
    
      Example:
    
      ```javascript
      let promise1 = new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 1');
        }, 200);
      });
    
      let promise2 = new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 2');
        }, 100);
      });
    
      Promise.race([promise1, promise2]).then(function(result){
        // result === 'promise 2' because it was resolved before promise1
        // was resolved.
      });
      ```
    
      `Promise.race` is deterministic in that only the state of the first
      settled promise matters. For example, even if other promises given to the
      `promises` array argument are resolved, but the first settled promise has
      become rejected before the other promises became fulfilled, the returned
      promise will become rejected:
    
      ```javascript
      let promise1 = new Promise(function(resolve, reject){
        setTimeout(function(){
          resolve('promise 1');
        }, 200);
      });
    
      let promise2 = new Promise(function(resolve, reject){
        setTimeout(function(){
          reject(new Error('promise 2'));
        }, 100);
      });
    
      Promise.race([promise1, promise2]).then(function(result){
        // Code here never runs
      }, function(reason){
        // reason.message === 'promise 2' because promise 2 became rejected before
        // promise 1 became fulfilled
      });
      ```
    
      An example real-world use case is implementing timeouts:
    
      ```javascript
      Promise.race([ajax('foo.json'), timeout(5000)])
      ```
    
      @method race
      @static
      @param {Array} promises array of promises to observe
      Useful for tooling.
      @return {Promise} a promise which settles in the same way as the first passed
      promise to settle.
    */
    function race(entries) {
      /*jshint validthis:true */
      var Constructor = this;

      if (!isArray(entries)) {
        return new Constructor(function (_, reject) {
          return reject(new TypeError('You must pass an array to race.'));
        });
      } else {
        return new Constructor(function (resolve, reject) {
          var length = entries.length;
          for (var i = 0; i < length; i++) {
            Constructor.resolve(entries[i]).then(resolve, reject);
          }
        });
      }
    }

    /**
      `Promise.reject` returns a promise rejected with the passed `reason`.
      It is shorthand for the following:
    
      ```javascript
      let promise = new Promise(function(resolve, reject){
        reject(new Error('WHOOPS'));
      });
    
      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```
    
      Instead of writing the above, your code now simply becomes the following:
    
      ```javascript
      let promise = Promise.reject(new Error('WHOOPS'));
    
      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```
    
      @method reject
      @static
      @param {Any} reason value that the returned promise will be rejected with.
      Useful for tooling.
      @return {Promise} a promise rejected with the given `reason`.
    */
    function reject(reason) {
      /*jshint validthis:true */
      var Constructor = this;
      var promise = new Constructor(noop);
      _reject(promise, reason);
      return promise;
    }

    function needsResolver() {
      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    }

    function needsNew() {
      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise's eventual value or the reason
      why the promise cannot be fulfilled.
    
      Terminology
      -----------
    
      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.
    
      A promise can be in one of three states: pending, fulfilled, or rejected.
    
      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.
    
      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.
    
    
      Basic Usage:
      ------------
    
      ```js
      let promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);
    
        // on failure
        reject(reason);
      });
    
      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```
    
      Advanced Usage:
      ---------------
    
      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.
    
      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          let xhr = new XMLHttpRequest();
    
          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();
    
          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
              }
            }
          };
        });
      }
    
      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```
    
      Unlike callbacks, promises are great composable primitives.
    
      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON
    
        return values;
      });
      ```
    
      @class Promise
      @param {function} resolver
      Useful for tooling.
      @constructor
    */
    function Promise(resolver) {
      this[PROMISE_ID] = nextId();
      this._result = this._state = undefined;
      this._subscribers = [];

      if (noop !== resolver) {
        typeof resolver !== 'function' && needsResolver();
        this instanceof Promise ? initializePromise(this, resolver) : needsNew();
      }
    }

    Promise.all = all;
    Promise.race = race;
    Promise.resolve = resolve;
    Promise.reject = reject;
    Promise._setScheduler = setScheduler;
    Promise._setAsap = setAsap;
    Promise._asap = asap;

    Promise.prototype = {
      constructor: Promise,

      /**
        The primary way of interacting with a promise is through its `then` method,
        which registers callbacks to receive either a promise's eventual value or the
        reason why the promise cannot be fulfilled.
      
        ```js
        findUser().then(function(user){
          // user is available
        }, function(reason){
          // user is unavailable, and you are given the reason why
        });
        ```
      
        Chaining
        --------
      
        The return value of `then` is itself a promise.  This second, 'downstream'
        promise is resolved with the return value of the first promise's fulfillment
        or rejection handler, or rejected if the handler throws an exception.
      
        ```js
        findUser().then(function (user) {
          return user.name;
        }, function (reason) {
          return 'default name';
        }).then(function (userName) {
          // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
          // will be `'default name'`
        });
      
        findUser().then(function (user) {
          throw new Error('Found user, but still unhappy');
        }, function (reason) {
          throw new Error('`findUser` rejected and we're unhappy');
        }).then(function (value) {
          // never reached
        }, function (reason) {
          // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
          // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
        });
        ```
        If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
      
        ```js
        findUser().then(function (user) {
          throw new PedagogicalException('Upstream error');
        }).then(function (value) {
          // never reached
        }).then(function (value) {
          // never reached
        }, function (reason) {
          // The `PedgagocialException` is propagated all the way down to here
        });
        ```
      
        Assimilation
        ------------
      
        Sometimes the value you want to propagate to a downstream promise can only be
        retrieved asynchronously. This can be achieved by returning a promise in the
        fulfillment or rejection handler. The downstream promise will then be pending
        until the returned promise is settled. This is called *assimilation*.
      
        ```js
        findUser().then(function (user) {
          return findCommentsByAuthor(user);
        }).then(function (comments) {
          // The user's comments are now available
        });
        ```
      
        If the assimliated promise rejects, then the downstream promise will also reject.
      
        ```js
        findUser().then(function (user) {
          return findCommentsByAuthor(user);
        }).then(function (comments) {
          // If `findCommentsByAuthor` fulfills, we'll have the value here
        }, function (reason) {
          // If `findCommentsByAuthor` rejects, we'll have the reason here
        });
        ```
      
        Simple Example
        --------------
      
        Synchronous Example
      
        ```javascript
        let result;
      
        try {
          result = findResult();
          // success
        } catch(reason) {
          // failure
        }
        ```
      
        Errback Example
      
        ```js
        findResult(function(result, err){
          if (err) {
            // failure
          } else {
            // success
          }
        });
        ```
      
        Promise Example;
      
        ```javascript
        findResult().then(function(result){
          // success
        }, function(reason){
          // failure
        });
        ```
      
        Advanced Example
        --------------
      
        Synchronous Example
      
        ```javascript
        let author, books;
      
        try {
          author = findAuthor();
          books  = findBooksByAuthor(author);
          // success
        } catch(reason) {
          // failure
        }
        ```
      
        Errback Example
      
        ```js
      
        function foundBooks(books) {
      
        }
      
        function failure(reason) {
      
        }
      
        findAuthor(function(author, err){
          if (err) {
            failure(err);
            // failure
          } else {
            try {
              findBoooksByAuthor(author, function(books, err) {
                if (err) {
                  failure(err);
                } else {
                  try {
                    foundBooks(books);
                  } catch(reason) {
                    failure(reason);
                  }
                }
              });
            } catch(error) {
              failure(err);
            }
            // success
          }
        });
        ```
      
        Promise Example;
      
        ```javascript
        findAuthor().
          then(findBooksByAuthor).
          then(function(books){
            // found books
        }).catch(function(reason){
          // something went wrong
        });
        ```
      
        @method then
        @param {Function} onFulfilled
        @param {Function} onRejected
        Useful for tooling.
        @return {Promise}
      */
      then: then,

      /**
        `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
        as the catch block of a try/catch statement.
      
        ```js
        function findAuthor(){
          throw new Error('couldn't find that author');
        }
      
        // synchronous
        try {
          findAuthor();
        } catch(reason) {
          // something went wrong
        }
      
        // async with promises
        findAuthor().catch(function(reason){
          // something went wrong
        });
        ```
      
        @method catch
        @param {Function} onRejection
        Useful for tooling.
        @return {Promise}
      */
      'catch': function _catch(onRejection) {
        return this.then(null, onRejection);
      }
    };

    function polyfill() {
      var local = undefined;

      if (typeof commonjsGlobal !== 'undefined') {
        local = commonjsGlobal;
      } else if (typeof self !== 'undefined') {
        local = self;
      } else {
        try {
          local = Function('return this')();
        } catch (e) {
          throw new Error('polyfill failed because global object is unavailable in this environment');
        }
      }

      var P = local.Promise;

      if (P) {
        var promiseToString = null;
        try {
          promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
          // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
          return;
        }
      }

      local.Promise = Promise;
    }

    // Strange compat..
    Promise.polyfill = polyfill;
    Promise.Promise = Promise;

    return Promise;
  });
  
});

var auto = es6Promise.polyfill();

var _global = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
  var core = module.exports = { version: '2.4.0' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

var _isObject = function _isObject(it) {
  return (typeof it === 'undefined' ? 'undefined' : _typeof(it)) === 'object' ? it !== null : typeof it === 'function';
};

var isObject = _isObject;
var _anObject = function _anObject(it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

var _fails = function _fails(exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var _descriptors = !_fails(function () {
  return Object.defineProperty({}, 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

var isObject$1 = _isObject;
var document$1 = _global.document;
var is = isObject$1(document$1) && isObject$1(document$1.createElement);
var _domCreate = function _domCreate(it) {
  return is ? document$1.createElement(it) : {};
};

var _ie8DomDefine = !_descriptors && !_fails(function () {
  return Object.defineProperty(_domCreate('div'), 'a', { get: function get() {
      return 7;
    } }).a != 7;
});

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject$2 = _isObject;
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var _toPrimitive = function _toPrimitive(it, S) {
  if (!isObject$2(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject$2(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject$2(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject$2(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var anObject = _anObject;
var IE8_DOM_DEFINE = _ie8DomDefine;
var toPrimitive = _toPrimitive;
var dP$1 = Object.defineProperty;

var f = _descriptors ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP$1(O, P, Attributes);
  } catch (e) {/* empty */}
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var _objectDp = {
  f: f
};

var _propertyDesc = function _propertyDesc(bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var dP = _objectDp;
var createDesc = _propertyDesc;
var _hide = _descriptors ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var hasOwnProperty = {}.hasOwnProperty;
var _has = function _has(it, key) {
  return hasOwnProperty.call(it, key);
};

var id = 0;
var px = Math.random();
var _uid = function _uid(key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

var _redefine = createCommonjsModule(function (module) {
  var global = _global,
      hide = _hide,
      has = _has,
      SRC = _uid('src'),
      TO_STRING = 'toString',
      $toString = Function[TO_STRING],
      TPL = ('' + $toString).split(TO_STRING);

  _core.inspectSource = function (it) {
    return $toString.call(it);
  };

  (module.exports = function (O, key, val, safe) {
    var isFunction = typeof val == 'function';
    if (isFunction) has(val, 'name') || hide(val, 'name', key);
    if (O[key] === val) return;
    if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
    if (O === global) {
      O[key] = val;
    } else {
      if (!safe) {
        delete O[key];
        hide(O, key, val);
      } else {
        if (O[key]) O[key] = val;else hide(O, key, val);
      }
    }
    // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, TO_STRING, function toString() {
    return typeof this == 'function' && this[SRC] || $toString.call(this);
  });
});

var _aFunction = function _aFunction(it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

// optional / simple context binding
var aFunction = _aFunction;
var _ctx = function _ctx(fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1:
      return function (a) {
        return fn.call(that, a);
      };
    case 2:
      return function (a, b) {
        return fn.call(that, a, b);
      };
    case 3:
      return function (a, b, c) {
        return fn.call(that, a, b, c);
      };
  }
  return function () /* ...args */{
    return fn.apply(that, arguments);
  };
};

var global$1 = _global;
var core = _core;
var hide = _hide;
var redefine = _redefine;
var ctx = _ctx;
var PROTOTYPE = 'prototype';

var $export$1 = function $export(type, name, source) {
  var IS_FORCED = type & $export.F,
      IS_GLOBAL = type & $export.G,
      IS_STATIC = type & $export.S,
      IS_PROTO = type & $export.P,
      IS_BIND = type & $export.B,
      target = IS_GLOBAL ? global$1 : IS_STATIC ? global$1[name] || (global$1[name] = {}) : (global$1[name] || {})[PROTOTYPE],
      exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
      expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {}),
      key,
      own,
      out,
      exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global$1) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global$1.core = core;
// type bitmap
$export$1.F = 1; // forced
$export$1.G = 2; // global
$export$1.S = 4; // static
$export$1.P = 8; // proto
$export$1.B = 16; // bind
$export$1.W = 32; // wrap
$export$1.U = 64; // safe
$export$1.R = 128; // real proto method for `library` 
var _export = $export$1;

var toString = {}.toString;

var _cof = function _cof(it) {
  return toString.call(it).slice(8, -1);
};

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = _cof;
var _iobject = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

// 7.2.1 RequireObjectCoercible(argument)
var _defined = function _defined(it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject$1 = _iobject;
var defined = _defined;
var _toIobject = function _toIobject(it) {
  return IObject$1(defined(it));
};

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
var _toInteger = function _toInteger(it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

// 7.1.15 ToLength
var toInteger = _toInteger;
var min = Math.min;
var _toLength = function _toLength(it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

var toInteger$1 = _toInteger;
var max = Math.max;
var min$1 = Math.min;
var _toIndex = function _toIndex(index, length) {
  index = toInteger$1(index);
  return index < 0 ? max(index + length, 0) : min$1(index, length);
};

// false -> Array#indexOf
// true  -> Array#includes
var toIObject$1 = _toIobject;
var toLength = _toLength;
var toIndex = _toIndex;
var _arrayIncludes = function _arrayIncludes(IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject$1($this),
        length = toLength(O.length),
        index = toIndex(fromIndex, length),
        value;
    // Array#includes uses SameValueZero equality algorithm
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      if (value != value) return true;
      // Array#toIndex ignores holes, Array#includes - not
    } else for (; length > index; index++) {
      if (IS_INCLUDES || index in O) {
        if (O[index] === el) return IS_INCLUDES || index || 0;
      }
    }return !IS_INCLUDES && -1;
  };
};

var global$2 = _global;
var SHARED = '__core-js_shared__';
var store = global$2[SHARED] || (global$2[SHARED] = {});
var _shared = function _shared(key) {
  return store[key] || (store[key] = {});
};

var shared = _shared('keys');
var uid = _uid;
var _sharedKey = function _sharedKey(key) {
  return shared[key] || (shared[key] = uid(key));
};

var has = _has;
var toIObject = _toIobject;
var arrayIndexOf = _arrayIncludes(false);
var IE_PROTO = _sharedKey('IE_PROTO');

var _objectKeysInternal = function _objectKeysInternal(object, names) {
  var O = toIObject(object),
      i = 0,
      result = [],
      key;
  for (key in O) {
    if (key != IE_PROTO) has(O, key) && result.push(key);
  } // Don't enum bug & hidden keys
  while (names.length > i) {
    if (has(O, key = names[i++])) {
      ~arrayIndexOf(result, key) || result.push(key);
    }
  }return result;
};

// IE 8- don't enum bug keys
var _enumBugKeys = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = _objectKeysInternal;
var enumBugKeys = _enumBugKeys;

var _objectKeys = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

var f$1 = Object.getOwnPropertySymbols;

var _objectGops = {
	f: f$1
};

var f$2 = {}.propertyIsEnumerable;

var _objectPie = {
	f: f$2
};

// 7.1.13 ToObject(argument)
var defined$1 = _defined;
var _toObject = function _toObject(it) {
  return Object(defined$1(it));
};

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = _objectKeys;
var gOPS = _objectGops;
var pIE = _objectPie;
var toObject = _toObject;
var IObject = _iobject;
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
var _objectAssign = !$assign || _fails(function () {
  var A = {},
      B = {},
      S = Symbol(),
      K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) {
    B[k] = k;
  });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) {
  // eslint-disable-line no-unused-vars
  var T = toObject(target),
      aLen = arguments.length,
      index = 1,
      getSymbols = gOPS.f,
      isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]),
        keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S),
        length = keys.length,
        j = 0,
        key;
    while (length > j) {
      if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
    }
  }return T;
} : $assign;

// 19.1.3.1 Object.assign(target, source)
var $export = _export;

$export($export.S + $export.F, 'Object', { assign: _objectAssign });

function createCommonjsModule$1(u, e) {
  return e = { exports: {} }, u(e, e.exports), e.exports;
}function isObject$1$1(u) {
  return null !== u && "object" === (void 0 === u ? "undefined" : _typeof$1(u));
}function RequestBase(u) {
  if (u) return mixin(u);
}function mixin(u) {
  for (var e in RequestBase.prototype) {
    u[e] = RequestBase.prototype[e];
  }return u;
}function isFunction(u) {
  return "[object Function]" === (isObject$2$1(u) ? Object.prototype.toString.call(u) : "");
}function ResponseBase(u) {
  if (u) return mixin$1(u);
}function mixin$1(u) {
  for (var e in ResponseBase.prototype) {
    u[e] = ResponseBase.prototype[e];
  }return u;
}function replacer(u, e) {
  return "function" == typeof e ? getFunctionName(e) : e;
}function assert(u, e) {
  !0 !== u && (isFunction$1(e) ? e = e() : isNil(e) && (e = 'Assert failed (turn on "Pause on exceptions" in your Source panel)'), assert.fail(e));
}function defaultSetTimout() {
  throw new Error("setTimeout has not been defined");
}function defaultClearTimeout() {
  throw new Error("clearTimeout has not been defined");
}function runTimeout(u) {
  if (cachedSetTimeout === setTimeout) return setTimeout(u, 0);if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) return cachedSetTimeout = setTimeout, setTimeout(u, 0);try {
    return cachedSetTimeout(u, 0);
  } catch (e) {
    try {
      return cachedSetTimeout.call(null, u, 0);
    } catch (e) {
      return cachedSetTimeout.call(this, u, 0);
    }
  }
}function runClearTimeout(u) {
  if (cachedClearTimeout === clearTimeout) return clearTimeout(u);if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) return cachedClearTimeout = clearTimeout, clearTimeout(u);try {
    return cachedClearTimeout(u);
  } catch (e) {
    try {
      return cachedClearTimeout.call(null, u);
    } catch (e) {
      return cachedClearTimeout.call(this, u);
    }
  }
}function cleanUpNextTick() {
  draining && currentQueue && (draining = !1, currentQueue.length ? queue = currentQueue.concat(queue) : queueIndex = -1, queue.length && drainQueue());
}function drainQueue() {
  if (!draining) {
    var u = runTimeout(cleanUpNextTick);draining = !0;for (var e = queue.length; e;) {
      for (currentQueue = queue, queue = []; ++queueIndex < e;) {
        currentQueue && currentQueue[queueIndex].run();
      }queueIndex = -1, e = queue.length;
    }currentQueue = null, draining = !1, runClearTimeout(u);
  }
}function getDefaultName(u, e) {
  return "{" + getTypeName$3(u) + " | " + getFunctionName$4(e) + "}";
}function refinement$1(u, e, t) {
  function r(e, t) {
    return create(u, e, t);
  }var n = t || getDefaultName(u, e),
      i = isIdentity(u);return r.meta = { kind: "subtype", type: u, predicate: e, name: t, identity: i }, r.displayName = n, r.is = function (t) {
    return is$1$1(t, u) && e(t);
  }, r.update = function (u, e) {
    return r(assert$3.update(u, e));
  }, r;
}function getDefaultName$1(u, e) {
  return "{[key: " + getTypeName$5(u) + "]: " + getTypeName$5(e) + "}";
}function dict(u, e, t) {
  function r(t, r) {
    if (i) return t;var n = !0,
        o = {};for (var a in t) {
      if (t.hasOwnProperty(a)) {
        a = create$3(u, a, null);var s = t[a],
            c = create$3(e, s, null);n = n && s === c, o[a] = c;
      }
    }return n && (o = t), o;
  }var n = t || getDefaultName$1(u, e),
      i = (getTypeName$5(u), getTypeName$5(e), isIdentity$3(u) && isIdentity$3(e));return r.meta = { kind: "dict", domain: u, codomain: e, name: t, identity: i }, r.displayName = n, r.is = function (t) {
    if (!isObject$7(t)) return !1;for (var r in t) {
      if (t.hasOwnProperty(r) && (!is$3(r, u) || !is$3(t[r], e))) return !1;
    }return !0;
  }, r.update = function (u, e) {
    return r(assert$6.update(u, e));
  }, r;
}function getDefaultName$2(u) {
  return Object.keys(u).map(function (u) {
    return assert$9.stringify(u);
  }).join(" | ");
}function enums(u, e) {
  function t(u, e) {
    return u;
  }var r = e || getDefaultName$2(u);return t.meta = { kind: "enums", map: u, name: e, identity: !0 }, t.displayName = r, t.is = function (e) {
    return u.hasOwnProperty(e);
  }, t;
}function getDefaultName$3(u) {
  return "Array<" + getTypeName$7(u) + ">";
}function list(u, e) {
  function t(e, t) {
    if (n) return e;for (var r = !0, i = [], o = 0, a = e.length; o < a; o++) {
      var s = e[o],
          c = create$4(u, s, null);r = r && s === c, i.push(c);
    }return r && (i = e), i;
  }var r = e || getDefaultName$3(u),
      n = (getTypeName$7(u), isIdentity$4(u));return t.meta = { kind: "list", type: u, name: e, identity: n }, t.displayName = r, t.is = function (e) {
    return isArray$4(e) && e.every(function (e) {
      return is$4(e, u);
    });
  }, t.update = function (u, e) {
    return t(assert$10.update(u, e));
  }, t;
}function getDefaultName$4(u) {
  return "?" + getTypeName$8(u);
}function maybe(u, e) {
  function t(e, t) {
    return Nil$2.is(e) ? e : create$5(u, e, t);
  }if (isMaybe(u) || u === Any$2 || u === Nil$2) return u;var r = e || getDefaultName$4(u),
      n = isIdentity$5(u);return t.meta = { kind: "maybe", type: u, name: e, identity: n }, t.displayName = r, t.is = function (e) {
    return Nil$2.is(e) || is$5(e, u);
  }, t;
}function getDefaultInterfaceName$1(u) {
  return "{" + Object.keys(u).map(function (e) {
    return e + ": " + getTypeName$10(u[e]);
  }).join(", ") + "}";
}function isRefinement(u) {
  return isType$12(u) && "subtype" === u.meta.kind;
}function getPredicates(u) {
  return isRefinement(u) ? [u.meta.predicate].concat(getPredicates(u.meta.type)) : [];
}function getUnrefinedType(u) {
  return isRefinement(u) ? getUnrefinedType(u.meta.type) : u;
}function decompose$1(u) {
  return { predicates: getPredicates(u), unrefinedType: getUnrefinedType(u) };
}function compose(u, e) {
  return u.reduce(function (u, e) {
    return refinement$2(u, e);
  }, e);
}function getProps(u) {
  return isObject$10(u) ? u : u.meta.props;
}function getDefaultProps(u) {
  return isObject$10(u) ? null : u.meta.defaultProps;
}function pushAll(u, e) {
  Array.prototype.push.apply(u, e);
}function extend$1(u, e, t) {
  var r = {},
      n = {},
      i = [],
      o = {};e.forEach(function (u, e) {
    var t = decompose(u),
        a = t.unrefinedType;pushAll(i, t.predicates), mixin$5(r, getProps(a)), mixin$5(n, a.prototype), mixin$5(o, getDefaultProps(a), !0);
  }), t = u.getOptions(t), t.defaultProps = mixin$5(o, t.defaultProps, !0);var a = compose(i, u(r, t));return mixin$5(a.prototype, n), a;
}function getDefaultName$5(u) {
  return "Struct" + getDefaultInterfaceName(u);
}function extendStruct(u, e) {
  return extend(struct, u, e);
}function getOptions(u) {
  return isObject$9(u) || (u = isNil$8(u) ? {} : { name: u }), u.hasOwnProperty("strict") || (u.strict = struct.strict), u.hasOwnProperty("defaultProps") || (u.defaultProps = {}), u;
}function struct(u, e) {
  function t(e, r) {
    if (t.is(e)) return e;if (!(this instanceof t)) return new t(e, r);for (var n in u) {
      if (u.hasOwnProperty(n)) {
        var o = u[n],
            a = e[n];void 0 === a && (a = i[n]), this[n] = create$6(o, a, null);
      }
    }
  }e = getOptions(e);var r = e.name,
      n = e.strict,
      i = e.defaultProps,
      o = r || getDefaultName$5(u);return t.meta = { kind: "struct", props: u, name: r, identity: !1, strict: n, defaultProps: i }, t.displayName = o, t.is = function (u) {
    return u instanceof t;
  }, t.update = function (u, e) {
    return new t(assert$12.update(u, e));
  }, t.extend = function (u, e) {
    return extendStruct([t].concat(u), e);
  }, t;
}function getDefaultName$6(u) {
  return "[" + u.map(getTypeName$11).join(", ") + "]";
}function tuple(u, e) {
  function t(e, t) {
    if (n) return e;for (var r = !0, i = [], o = 0, a = u.length; o < a; o++) {
      var s = u[o],
          c = e[o],
          l = create$7(s, c, null);r = r && c === l, i.push(l);
    }return r && (i = e), i;
  }var r = e || getDefaultName$6(u),
      n = u.every(isIdentity$6);return t.meta = { kind: "tuple", types: u, name: e, identity: n }, t.displayName = r, t.is = function (e) {
    return isArray$6(e) && e.length === u.length && u.every(function (u, t) {
      return is$6(e[t], u);
    });
  }, t.update = function (u, e) {
    return t(assert$14.update(u, e));
  }, t;
}function getDefaultName$7(u) {
  return u.map(getTypeName$12).join(" | ");
}function union(u, e) {
  function t(u, e) {
    if (n) return u;var r = t.dispatch(u);return !r && t.is(u) ? u : create$8(r, u, e);
  }var r = e || getDefaultName$7(u),
      n = u.every(isIdentity$7);return t.meta = { kind: "union", types: u, name: e, identity: n }, t.displayName = r, t.is = function (e) {
    return u.some(function (u) {
      return is$7(e, u);
    });
  }, t.dispatch = function (e) {
    for (var t = 0, r = u.length; t < r; t++) {
      var n = u[t];if (isUnion$3(n)) {
        var i = n.dispatch(e);if (!isNil$9(i)) return i;
      } else if (is$7(e, n)) return n;
    }
  }, t.update = function (u, e) {
    return t(assert$15.update(u, e));
  }, t;
}function getDefaultName$8(u, e) {
  return "(" + u.map(getTypeName$13).join(", ") + ") => " + getTypeName$13(e);
}function isInstrumented(u) {
  return FunctionType.is(u) && isObject$11(u.instrumentation);
}function getOptionalArgumentsIndex(u) {
  for (var e = u.length, t = !1, r = e - 1; r >= 0; r--) {
    var n = u[r];if (!isType$13(n) || "maybe" !== n.meta.kind) return r + 1;t = !0;
  }return t ? 0 : e;
}function func(u, e, t) {
  function r(u, e) {
    return isInstrumented(u) ? u : r.of(u);
  }u = isArray$8(u) ? u : [u];var n = t || getDefaultName$8(u, e),
      i = u.length;getOptionalArgumentsIndex(u);return r.meta = { kind: "func", domain: u, codomain: e, name: t, identity: !0 }, r.displayName = n, r.is = function (t) {
    return isInstrumented(t) && t.instrumentation.domain.length === i && t.instrumentation.domain.every(function (e, t) {
      return e === u[t];
    }) && t.instrumentation.codomain === e;
  }, r.of = function (t, n) {
    function o() {
      var r = Array.prototype.slice.call(arguments),
          o = r.length;if (n && o < i) {
        var a = Function.prototype.bind.apply(t, [this].concat(r));return func(u.slice(o), e).of(a, !0);
      }return create$9(e, t.apply(this, r));
    }return r.is(t) ? t : (o.instrumentation = { domain: u, codomain: e, f: t }, o.displayName = getFunctionName$6(t), o);
  }, r;
}function getDefaultName$9(u) {
  return u.map(getTypeName$14).join(" & ");
}function intersection(u, e) {
  function t(u, e) {
    return u;
  }var r = e || getDefaultName$9(u),
      n = u.every(isIdentity$8);return t.meta = { kind: "intersection", types: u, name: e, identity: n }, t.displayName = r, t.is = function (e) {
    return u.every(function (u) {
      return is$8(e, u);
    });
  }, t.update = function (u, e) {
    return t(assert$17.update(u, e));
  }, t;
}function assign$1$1(u, e) {
  for (var t in e) {
    e.hasOwnProperty(t) && (u[t] = e[t]);
  }return u;
}function extendInterface(u, e) {
  return extend$2(inter, u, e);
}function getOptions$1(u) {
  return isObject$12(u) || (u = isNil$11(u) ? {} : { name: u }), u.hasOwnProperty("strict") || (u.strict = inter.strict), u;
}function inter(u, e) {
  function t(e, t) {
    if (o) return e;var r = !0,
        n = o ? {} : assign$2({}, e);for (var i in u) {
      var a = u[i],
          s = e[i],
          c = create$10(a, s, null);r = r && s === c, n[i] = c;
    }return r && (n = e), n;
  }e = getOptions$1(e);var r = e.name,
      n = e.strict,
      i = r || getDefaultInterfaceName$2(u),
      o = Object.keys(u).map(function (e) {
    return u[e];
  }).every(isIdentity$9);return t.meta = { kind: "interface", props: u, name: r, identity: o, strict: n }, t.displayName = i, t.is = function (e) {
    if (isNil$11(e)) return !1;if (n) for (var t in e) {
      if (!u.hasOwnProperty(t)) return !1;
    }for (var r in u) {
      if (!is$9(e[r], u[r])) return !1;
    }return !0;
  }, t.update = function (u, e) {
    return t(assert$18.update(u, e));
  }, t.extend = function (u, e) {
    return extendInterface([t].concat(u), e);
  }, t;
}function getShallowCopy(u) {
  return isObject$13(u) ? u instanceof Date || u instanceof RegExp ? u : assign$2$1({}, u) : isArray$10(u) ? u.concat() : u;
}function isCommand(u) {
  return update.commands.hasOwnProperty(u);
}function getCommand(u) {
  return update.commands[u];
}function update(u, e) {
  var t,
      r = u,
      n = !1;for (var i in e) {
    e.hasOwnProperty(i) && (isCommand(i) ? (t = getCommand(i)(e[i], r), t !== u ? (n = !0, r = t) : r = u) : (r === u && (r = getShallowCopy(u)), t = update(r[i], e[i]), n = n || t !== r[i], r[i] = t));
  }return n ? r : u;
}function $apply(u, e) {
  return u(e);
}function $push(u, e) {
  return u.length > 0 ? e.concat(u) : e;
}function $remove(u, e) {
  if (u.length > 0) {
    e = getShallowCopy(e);for (var t = 0, r = u.length; t < r; t++) {
      delete e[u[t]];
    }
  }return e;
}function $set(u) {
  return u;
}function $splice(u, e) {
  return u.length > 0 ? (e = getShallowCopy(e), u.reduce(function (u, e) {
    return u.splice.apply(u, e), u;
  }, e)) : e;
}function $swap(u, e) {
  if (u.from !== u.to) {
    e = getShallowCopy(e);var t = e[u.to];e[u.to] = e[u.from], e[u.from] = t;
  }return e;
}function $unshift(u, e) {
  return u.length > 0 ? u.concat(e) : e;
}function $merge(u, e) {
  var t = !1,
      r = getShallowCopy(e);for (var n in u) {
    u.hasOwnProperty(n) && (r[n] = u[n], t = t || r[n] !== e[n]);
  }return t ? r : e;
}function getDefaultValidationErrorMessage(u, e, r) {
  var n = t.getTypeName(e),
      i = r.length ? "/" + r.join("/") + ": " + n : n;return "Invalid value " + stringify(u) + " supplied to " + i;
}function getValidationErrorMessage(u, e, r, n) {
  return t.Function.is(e.getValidationErrorMessage) ? e.getValidationErrorMessage(u, r, n) : getDefaultValidationErrorMessage(u, e, r);
}function validate(u, e, r) {
  r = r || {};var n = t.Array.is(r) ? r : r.path || [];return new ValidationResult(recurse(u, e, n, r));
}function recurse(u, e, r, n) {
  return t.isType(e) ? validators[e.meta.kind](u, e, r, n) : validators.es6classes(u, e, r, n);
}function debounce(u, e, t) {
  function r(e) {
    var t = p,
        r = E;return p = E = void 0, h = e, d = u.apply(r, t);
  }function n(u) {
    return h = u, C = setTimeout(a, e), m ? r(u) : d;
  }function i(u) {
    var t = u - F,
        r = u - h,
        n = e - t;return y ? nativeMin(n, f - r) : n;
  }function o(u) {
    var t = u - F,
        r = u - h;return void 0 === F || t >= e || t < 0 || y && r >= f;
  }function a() {
    var u = now();if (o(u)) return s(u);C = setTimeout(a, i(u));
  }function s(u) {
    return C = void 0, D && p ? r(u) : (p = E = void 0, d);
  }function c() {
    void 0 !== C && clearTimeout(C), h = 0, p = F = E = C = void 0;
  }function l() {
    return void 0 === C ? d : s(now());
  }function A() {
    var u = now(),
        t = o(u);if (p = arguments, E = this, F = u, t) {
      if (void 0 === C) return n(F);if (y) return C = setTimeout(a, e), r(F);
    }return void 0 === C && (C = setTimeout(a, e)), d;
  }var p,
      E,
      f,
      d,
      C,
      F,
      h = 0,
      m = !1,
      y = !1,
      D = !0;if ("function" != typeof u) throw new TypeError(FUNC_ERROR_TEXT);return e = toNumber(e) || 0, isObject$14(t) && (m = !!t.leading, y = "maxWait" in t, f = y ? nativeMax(toNumber(t.maxWait) || 0, e) : f, D = "trailing" in t ? !!t.trailing : D), A.cancel = c, A.flush = l, A;
}function throttle(u, e, t) {
  var r = !0,
      n = !0;if ("function" != typeof u) throw new TypeError(FUNC_ERROR_TEXT);return isObject$14(t) && (r = "leading" in t ? !!t.leading : r, n = "trailing" in t ? !!t.trailing : n), debounce(u, e, { leading: r, maxWait: e, trailing: n });
}function isObject$14(u) {
  var e = void 0 === u ? "undefined" : _typeof$1(u);return !!u && ("object" == e || "function" == e);
}function isObjectLike(u) {
  return !!u && "object" == (void 0 === u ? "undefined" : _typeof$1(u));
}function isSymbol(u) {
  return "symbol" == (void 0 === u ? "undefined" : _typeof$1(u)) || isObjectLike(u) && objectToString.call(u) == symbolTag;
}function toNumber(u) {
  if ("number" == typeof u) return u;if (isSymbol(u)) return NAN;if (isObject$14(u)) {
    var e = "function" == typeof u.valueOf ? u.valueOf() : u;u = isObject$14(e) ? e + "" : e;
  }if ("string" != typeof u) return 0 === u ? u : +u;u = u.replace(reTrim, "");var t = reIsBinary.test(u);return t || reIsOctal.test(u) ? freeParseInt(u.slice(2), t ? 2 : 8) : reIsBadHex.test(u) ? NAN : +u;
}var ENV = { storeApiUrl: "https://www.filestackapi.com/api/store", fileApiUrl: "https://www.filestackapi.com/api/file", uploadApiUrl: "https://upload.filestackapi.com", cloudApiUrl: "https://cloud.filestackapi.com", processApiUrl: "https://process.filestackapi.com" };
var commonjsGlobal$1 = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
var index = createCommonjsModule$1(function (u) {
  function e(u) {
    if (u) return t(u);
  }function t(u) {
    for (var t in e.prototype) {
      u[t] = e.prototype[t];
    }return u;
  }u.exports = e, e.prototype.on = e.prototype.addEventListener = function (u, e) {
    return this._callbacks = this._callbacks || {}, (this._callbacks["$" + u] = this._callbacks["$" + u] || []).push(e), this;
  }, e.prototype.once = function (u, e) {
    function t() {
      this.off(u, t), e.apply(this, arguments);
    }return t.fn = e, this.on(u, t), this;
  }, e.prototype.off = e.prototype.removeListener = e.prototype.removeAllListeners = e.prototype.removeEventListener = function (u, e) {
    if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;var t = this._callbacks["$" + u];if (!t) return this;if (1 == arguments.length) return delete this._callbacks["$" + u], this;for (var r, n = 0; n < t.length; n++) {
      if ((r = t[n]) === e || r.fn === e) {
        t.splice(n, 1);break;
      }
    }return this;
  }, e.prototype.emit = function (u) {
    this._callbacks = this._callbacks || {};var e = [].slice.call(arguments, 1),
        t = this._callbacks["$" + u];if (t) {
      t = t.slice(0);for (var r = 0, n = t.length; r < n; ++r) {
        t[r].apply(this, e);
      }
    }return this;
  }, e.prototype.listeners = function (u) {
    return this._callbacks = this._callbacks || {}, this._callbacks["$" + u] || [];
  }, e.prototype.hasListeners = function (u) {
    return !!this.listeners(u).length;
  };
});
var _typeof$1 = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (u) {
  return typeof u === "undefined" ? "undefined" : _typeof(u);
} : function (u) {
  return u && "function" == typeof Symbol && u.constructor === Symbol && u !== Symbol.prototype ? "symbol" : typeof u === "undefined" ? "undefined" : _typeof(u);
};
var toConsumableArray$1 = function toConsumableArray$$1(u) {
  if (Array.isArray(u)) {
    for (var e = 0, t = Array(u.length); e < u.length; e++) {
      t[e] = u[e];
    }return t;
  }return Array.from(u);
};
var isObject_1 = isObject$1$1;
var isObject$3 = isObject_1;
var requestBase = RequestBase;RequestBase.prototype.clearTimeout = function () {
  return clearTimeout(this._timer), clearTimeout(this._responseTimeoutTimer), delete this._timer, delete this._responseTimeoutTimer, this;
}, RequestBase.prototype.parse = function (u) {
  return this._parser = u, this;
}, RequestBase.prototype.responseType = function (u) {
  return this._responseType = u, this;
}, RequestBase.prototype.serialize = function (u) {
  return this._serializer = u, this;
}, RequestBase.prototype.timeout = function (u) {
  if (!u || "object" !== (void 0 === u ? "undefined" : _typeof$1(u))) return this._timeout = u, this._responseTimeout = 0, this;for (var e in u) {
    switch (e) {case "deadline":
        this._timeout = u.deadline;break;case "response":
        this._responseTimeout = u.response;break;default:
        console.warn("Unknown timeout option", e);}
  }return this;
}, RequestBase.prototype.retry = function (u) {
  return 0 !== arguments.length && !0 !== u || (u = 1), u <= 0 && (u = 0), this._maxRetries = u, this._retries = 0, this;
}, RequestBase.prototype._retry = function () {
  return this.clearTimeout(), this.req && (this.req = null, this.req = this.request()), this._aborted = !1, this.timedout = !1, this._end();
}, RequestBase.prototype.then = function (u, e) {
  if (!this._fullfilledPromise) {
    var t = this;this._endCalled && console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises"), this._fullfilledPromise = new Promise(function (u, e) {
      t.end(function (t, r) {
        t ? e(t) : u(r);
      });
    });
  }return this._fullfilledPromise.then(u, e);
}, RequestBase.prototype.catch = function (u) {
  return this.then(void 0, u);
}, RequestBase.prototype.use = function (u) {
  return u(this), this;
}, RequestBase.prototype.ok = function (u) {
  if ("function" != typeof u) throw Error("Callback required");return this._okCallback = u, this;
}, RequestBase.prototype._isResponseOK = function (u) {
  return !!u && (this._okCallback ? this._okCallback(u) : u.status >= 200 && u.status < 300);
}, RequestBase.prototype.get = function (u) {
  return this._header[u.toLowerCase()];
}, RequestBase.prototype.getHeader = RequestBase.prototype.get, RequestBase.prototype.set = function (u, e) {
  if (isObject$3(u)) {
    for (var t in u) {
      this.set(t, u[t]);
    }return this;
  }return this._header[u.toLowerCase()] = e, this.header[u] = e, this;
}, RequestBase.prototype.unset = function (u) {
  return delete this._header[u.toLowerCase()], delete this.header[u], this;
}, RequestBase.prototype.field = function (u, e) {
  if (null === u || void 0 === u) throw new Error(".field(name, val) name can not be empty");if (this._data && console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()"), isObject$3(u)) {
    for (var t in u) {
      this.field(t, u[t]);
    }return this;
  }if (Array.isArray(e)) {
    for (var r in e) {
      this.field(u, e[r]);
    }return this;
  }if (null === e || void 0 === e) throw new Error(".field(name, val) val can not be empty");return "boolean" == typeof e && (e = "" + e), this._getFormData().append(u, e), this;
}, RequestBase.prototype.abort = function () {
  return this._aborted ? this : (this._aborted = !0, this.xhr && this.xhr.abort(), this.req && this.req.abort(), this.clearTimeout(), this.emit("abort"), this);
}, RequestBase.prototype.withCredentials = function (u) {
  return void 0 == u && (u = !0), this._withCredentials = u, this;
}, RequestBase.prototype.redirects = function (u) {
  return this._maxRedirects = u, this;
}, RequestBase.prototype.toJSON = function () {
  return { method: this.method, url: this.url, data: this._data, headers: this._header };
}, RequestBase.prototype.send = function (u) {
  var e = isObject$3(u),
      t = this._header["content-type"];if (this._formData && console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()"), e && !this._data) Array.isArray(u) ? this._data = [] : this._isHost(u) || (this._data = {});else if (u && this._data && this._isHost(this._data)) throw Error("Can't merge these send calls");if (e && isObject$3(this._data)) for (var r in u) {
    this._data[r] = u[r];
  } else "string" == typeof u ? (t || this.type("form"), t = this._header["content-type"], this._data = "application/x-www-form-urlencoded" == t ? this._data ? this._data + "&" + u : u : (this._data || "") + u) : this._data = u;return !e || this._isHost(u) ? this : (t || this.type("json"), this);
}, RequestBase.prototype.sortQuery = function (u) {
  return this._sort = void 0 === u || u, this;
}, RequestBase.prototype._timeoutError = function (u, e, t) {
  if (!this._aborted) {
    var r = new Error(u + e + "ms exceeded");r.timeout = e, r.code = "ECONNABORTED", r.errno = t, this.timedout = !0, this.abort(), this.callback(r);
  }
}, RequestBase.prototype._setTimeouts = function () {
  var u = this;this._timeout && !this._timer && (this._timer = setTimeout(function () {
    u._timeoutError("Timeout of ", u._timeout, "ETIME");
  }, this._timeout)), this._responseTimeout && !this._responseTimeoutTimer && (this._responseTimeoutTimer = setTimeout(function () {
    u._timeoutError("Response timeout of ", u._responseTimeout, "ETIMEDOUT");
  }, this._responseTimeout));
};var isObject$2$1 = isObject_1; var isFunction_1 = isFunction; var type = function type(u) {
  return u.split(/ *; */).shift();
}; var params = function params(u) {
  return u.split(/ *; */).reduce(function (u, e) {
    var t = e.split(/ *= */),
        r = t.shift(),
        n = t.shift();return r && n && (u[r] = n), u;
  }, {});
}; var parseLinks = function parseLinks(u) {
  return u.split(/ *, */).reduce(function (u, e) {
    var t = e.split(/ *; */),
        r = t[0].slice(1, -1);return u[t[1].split(/ *= */)[1].slice(1, -1)] = r, u;
  }, {});
}; var cleanHeader = function cleanHeader(u, e) {
  return delete u["content-type"], delete u["content-length"], delete u["transfer-encoding"], delete u.host, e && delete u.cookie, u;
}; var utils$1 = { type: type, params: params, parseLinks: parseLinks, cleanHeader: cleanHeader }; var utils = utils$1; var responseBase = ResponseBase;ResponseBase.prototype.get = function (u) {
  return this.header[u.toLowerCase()];
}, ResponseBase.prototype._setHeaderProperties = function (u) {
  var e = u["content-type"] || "";this.type = utils.type(e);var t = utils.params(e);for (var r in t) {
    this[r] = t[r];
  }this.links = {};try {
    u.link && (this.links = utils.parseLinks(u.link));
  } catch (u) {}
}, ResponseBase.prototype._setStatusProperties = function (u) {
  var e = u / 100 | 0;this.status = this.statusCode = u, this.statusType = e, this.info = 1 == e, this.ok = 2 == e, this.redirect = 3 == e, this.clientError = 4 == e, this.serverError = 5 == e, this.error = (4 == e || 5 == e) && this.toError(), this.accepted = 202 == u, this.noContent = 204 == u, this.badRequest = 400 == u, this.unauthorized = 401 == u, this.notAcceptable = 406 == u, this.forbidden = 403 == u, this.notFound = 404 == u;
};var ERROR_CODES = ["ECONNRESET", "ETIMEDOUT", "EADDRINFO", "ESOCKETTIMEDOUT"]; var shouldRetry = function shouldRetry(u, e) {
  return !!(u && u.code && ~ERROR_CODES.indexOf(u.code)) || !!(e && e.status && e.status >= 500) || !!(u && "timeout" in u && "ECONNABORTED" == u.code) || !!(u && "crossDomain" in u);
}; var client$1 = createCommonjsModule$1(function (u, e) {
  function t() {}function r(u) {
    if (!f(u)) return u;var e = [];for (var t in u) {
      n(e, t, u[t]);
    }return e.join("&");
  }function n(u, e, t) {
    if (null != t) {
      if (Array.isArray(t)) t.forEach(function (t) {
        n(u, e, t);
      });else if (f(t)) for (var r in t) {
        n(u, e + "[" + r + "]", t[r]);
      } else u.push(encodeURIComponent(e) + "=" + encodeURIComponent(t));
    } else null === t && u.push(encodeURIComponent(e));
  }function i(u) {
    for (var e, t, r = {}, n = u.split("&"), i = 0, o = n.length; i < o; ++i) {
      e = n[i], t = e.indexOf("="), -1 == t ? r[decodeURIComponent(e)] = "" : r[decodeURIComponent(e.slice(0, t))] = decodeURIComponent(e.slice(t + 1));
    }return r;
  }function o(u) {
    var e,
        t,
        r,
        n,
        i = u.split(/\r?\n/),
        o = {};i.pop();for (var a = 0, s = i.length; a < s; ++a) {
      t = i[a], e = t.indexOf(":"), r = t.slice(0, e).toLowerCase(), n = m(t.slice(e + 1)), o[r] = n;
    }return o;
  }function a(u) {
    return (/[\/+]json\b/.test(u)
    );
  }function s(u) {
    this.req = u, this.xhr = this.req.xhr, this.text = "HEAD" != this.req.method && ("" === this.xhr.responseType || "text" === this.xhr.responseType) || void 0 === this.xhr.responseType ? this.xhr.responseText : null, this.statusText = this.req.xhr.statusText;var e = this.xhr.status;1223 === e && (e = 204), this._setStatusProperties(e), this.header = this.headers = o(this.xhr.getAllResponseHeaders()), this.header["content-type"] = this.xhr.getResponseHeader("content-type"), this._setHeaderProperties(this.header), null === this.text && u._responseType ? this.body = this.xhr.response : this.body = "HEAD" != this.req.method ? this._parseBody(this.text ? this.text : this.xhr.response) : null;
  }function c(u, e) {
    var t = this;this._query = this._query || [], this.method = u, this.url = e, this.header = {}, this._header = {}, this.on("end", function () {
      var u = null,
          e = null;try {
        e = new s(t);
      } catch (e) {
        return u = new Error("Parser is unable to parse the response"), u.parse = !0, u.original = e, t.xhr ? (u.rawResponse = void 0 === t.xhr.responseType ? t.xhr.responseText : t.xhr.response, u.status = t.xhr.status ? t.xhr.status : null, u.statusCode = u.status) : (u.rawResponse = null, u.status = null), t.callback(u);
      }t.emit("response", e);var r;try {
        t._isResponseOK(e) || (r = new Error(e.statusText || "Unsuccessful HTTP response"), r.original = u, r.response = e, r.status = e.status);
      } catch (u) {
        r = u;
      }r ? t.callback(r, e) : t.callback(null, e);
    });
  }function l(u, e, t) {
    var r = h("DELETE", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }var A;"undefined" != typeof window ? A = window : "undefined" != typeof self ? A = self : (console.warn("Using browser-only version of superagent in non-browser environment"), A = commonjsGlobal$1);var p = index,
      E = requestBase,
      f = isObject_1,
      d = isFunction_1,
      C = responseBase,
      F = shouldRetry,
      h = e = u.exports = function (u, t) {
    return "function" == typeof t ? new e.Request("GET", u).end(t) : 1 == arguments.length ? new e.Request("GET", u) : new e.Request(u, t);
  };e.Request = c, h.getXHR = function () {
    if (!(!A.XMLHttpRequest || A.location && "file:" == A.location.protocol && A.ActiveXObject)) return new XMLHttpRequest();try {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (u) {}try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (u) {}try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch (u) {}try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (u) {}throw Error("Browser-only verison of superagent could not find XHR");
  };var m = "".trim ? function (u) {
    return u.trim();
  } : function (u) {
    return u.replace(/(^\s*|\s*$)/g, "");
  };h.serializeObject = r, h.parseString = i, h.types = { html: "text/html", json: "application/json", xml: "application/xml", urlencoded: "application/x-www-form-urlencoded", form: "application/x-www-form-urlencoded", "form-data": "application/x-www-form-urlencoded" }, h.serialize = { "application/x-www-form-urlencoded": r, "application/json": JSON.stringify }, h.parse = { "application/x-www-form-urlencoded": i, "application/json": JSON.parse }, C(s.prototype), s.prototype._parseBody = function (u) {
    var e = h.parse[this.type];return this.req._parser ? this.req._parser(this, u) : (!e && a(this.type) && (e = h.parse["application/json"]), e && u && (u.length || u instanceof Object) ? e(u) : null);
  }, s.prototype.toError = function () {
    var u = this.req,
        e = u.method,
        t = u.url,
        r = "cannot " + e + " " + t + " (" + this.status + ")",
        n = new Error(r);return n.status = this.status, n.method = e, n.url = t, n;
  }, h.Response = s, p(c.prototype), E(c.prototype), c.prototype.type = function (u) {
    return this.set("Content-Type", h.types[u] || u), this;
  }, c.prototype.accept = function (u) {
    return this.set("Accept", h.types[u] || u), this;
  }, c.prototype.auth = function (u, e, t) {
    switch ("object" === (void 0 === e ? "undefined" : _typeof$1(e)) && null !== e && (t = e), t || (t = { type: "function" == typeof btoa ? "basic" : "auto" }), t.type) {case "basic":
        this.set("Authorization", "Basic " + btoa(u + ":" + e));break;case "auto":
        this.username = u, this.password = e;break;case "bearer":
        this.set("Authorization", "Bearer " + u);}return this;
  }, c.prototype.query = function (u) {
    return "string" != typeof u && (u = r(u)), u && this._query.push(u), this;
  }, c.prototype.attach = function (u, e, t) {
    if (e) {
      if (this._data) throw Error("superagent can't mix .send() and .attach()");this._getFormData().append(u, e, t || e.name);
    }return this;
  }, c.prototype._getFormData = function () {
    return this._formData || (this._formData = new A.FormData()), this._formData;
  }, c.prototype.callback = function (u, e) {
    if (this._maxRetries && this._retries++ < this._maxRetries && F(u, e)) return this._retry();var t = this._callback;this.clearTimeout(), u && (this._maxRetries && (u.retries = this._retries - 1), this.emit("error", u)), t(u, e);
  }, c.prototype.crossDomainError = function () {
    var u = new Error("Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.");u.crossDomain = !0, u.status = this.status, u.method = this.method, u.url = this.url, this.callback(u);
  }, c.prototype.buffer = c.prototype.ca = c.prototype.agent = function () {
    return console.warn("This is not supported in browser version of superagent"), this;
  }, c.prototype.pipe = c.prototype.write = function () {
    throw Error("Streaming is not supported in browser version of superagent");
  }, c.prototype._appendQueryString = function () {
    var u = this._query.join("&");if (u && (this.url += (this.url.indexOf("?") >= 0 ? "&" : "?") + u), this._sort) {
      var e = this.url.indexOf("?");if (e >= 0) {
        var t = this.url.substring(e + 1).split("&");d(this._sort) ? t.sort(this._sort) : t.sort(), this.url = this.url.substring(0, e) + "?" + t.join("&");
      }
    }
  }, c.prototype._isHost = function (u) {
    return u && "object" === (void 0 === u ? "undefined" : _typeof$1(u)) && !Array.isArray(u) && "[object Object]" !== Object.prototype.toString.call(u);
  }, c.prototype.end = function (u) {
    return this._endCalled && console.warn("Warning: .end() was called twice. This is not supported in superagent"), this._endCalled = !0, this._callback = u || t, this._appendQueryString(), this._end();
  }, c.prototype._end = function () {
    var u = this,
        e = this.xhr = h.getXHR(),
        t = this._formData || this._data;this._setTimeouts(), e.onreadystatechange = function () {
      var t = e.readyState;if (t >= 2 && u._responseTimeoutTimer && clearTimeout(u._responseTimeoutTimer), 4 == t) {
        var r;try {
          r = e.status;
        } catch (u) {
          r = 0;
        }if (!r) {
          if (u.timedout || u._aborted) return;return u.crossDomainError();
        }u.emit("end");
      }
    };var r = function r(e, t) {
      t.total > 0 && (t.percent = t.loaded / t.total * 100), t.direction = e, u.emit("progress", t);
    };if (this.hasListeners("progress")) try {
      e.onprogress = r.bind(null, "download"), e.upload && (e.upload.onprogress = r.bind(null, "upload"));
    } catch (u) {}try {
      this.username && this.password ? e.open(this.method, this.url, !0, this.username, this.password) : e.open(this.method, this.url, !0);
    } catch (u) {
      return this.callback(u);
    }if (this._withCredentials && (e.withCredentials = !0), !this._formData && "GET" != this.method && "HEAD" != this.method && "string" != typeof t && !this._isHost(t)) {
      var n = this._header["content-type"],
          i = this._serializer || h.serialize[n ? n.split(";")[0] : ""];!i && a(n) && (i = h.serialize["application/json"]), i && (t = i(t));
    }for (var o in this.header) {
      null != this.header[o] && this.header.hasOwnProperty(o) && e.setRequestHeader(o, this.header[o]);
    }return this._responseType && (e.responseType = this._responseType), this.emit("request", this), e.send(void 0 !== t ? t : null), this;
  }, h.get = function (u, e, t) {
    var r = h("GET", u);return "function" == typeof e && (t = e, e = null), e && r.query(e), t && r.end(t), r;
  }, h.head = function (u, e, t) {
    var r = h("HEAD", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }, h.options = function (u, e, t) {
    var r = h("OPTIONS", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }, h.del = l, h.delete = l, h.patch = function (u, e, t) {
    var r = h("PATCH", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }, h.post = function (u, e, t) {
    var r = h("POST", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }, h.put = function (u, e, t) {
    var r = h("PUT", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  };
}); var isFunction$2 = function isFunction$2(u) {
  return "function" == typeof u;
}; var isNil$1 = function isNil$1(u) {
  return null === u || void 0 === u;
}; var fail$1 = function fail$1(u) {
  throw new TypeError("[tcomb] " + u);
}; var getFunctionName$1 = function getFunctionName$1(u) {
  return u.displayName || u.name || "<function" + u.length + ">";
}; var getFunctionName = getFunctionName$1; var stringify$2 = function stringify$2(u) {
  try {
    return JSON.stringify(u, replacer, 2);
  } catch (e) {
    return String(u);
  }
}; var isFunction$1 = isFunction$2; var isNil = isNil$1; var fail = fail$1; var stringify$1 = stringify$2;assert.fail = fail, assert.stringify = stringify$1;var assert_1 = assert; var global$1$1 = "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {}; var cachedSetTimeout = defaultSetTimout; var cachedClearTimeout = defaultClearTimeout;"function" == typeof global$1$1.setTimeout && (cachedSetTimeout = setTimeout), "function" == typeof global$1$1.clearTimeout && (cachedClearTimeout = clearTimeout);var currentQueue; var queue = []; var draining = !1; var queueIndex = -1; var performance = global$1$1.performance || {}; var performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function () {
  return new Date().getTime();
}; var isString$1 = function isString$1(u) {
  return "string" == typeof u;
}; var isArray$1 = function isArray$1(u) {
  return Array.isArray ? Array.isArray(u) : u instanceof Array;
}; var isNil$3 = isNil$1; var isArray = isArray$1; var isObject$4 = function isObject$4(u) {
  return !isNil$3(u) && "object" === (void 0 === u ? "undefined" : _typeof$1(u)) && !isArray(u);
}; var isFunction$5 = isFunction$2; var isObject$3$1 = isObject$4; var isType$1 = function isType$1(u) {
  return isFunction$5(u) && isObject$3$1(u.meta);
}; var isType = isType$1; var getFunctionName$3 = getFunctionName$1; var getTypeName$1 = function getTypeName$1(u) {
  return isType(u) ? u.displayName : getFunctionName$3(u);
}; var irreducible$1 = function irreducible$1(u, e) {
  function t(u, e) {
    return u;
  }return t.meta = { kind: "irreducible", name: u, predicate: e, identity: !0 }, t.displayName = u, t.is = e, t;
}; var irreducible = irreducible$1; var Any = irreducible("Any", function () {
  return !0;
}); var irreducible$3 = irreducible$1; var isArray$3 = isArray$1; var _Array = irreducible$3("Array", isArray$3); var isBoolean$1 = function isBoolean$1(u) {
  return !0 === u || !1 === u;
}; var irreducible$4 = irreducible$1; var isBoolean = isBoolean$1; var _Boolean = irreducible$4("Boolean", isBoolean); var irreducible$5 = irreducible$1; var _Date = irreducible$5("Date", function (u) {
  return u instanceof Date;
}); var irreducible$6 = irreducible$1; var _Error = irreducible$6("Error", function (u) {
  return u instanceof Error;
}); var irreducible$7 = irreducible$1; var isFunction$6 = isFunction$2; var _Function = irreducible$7("Function", isFunction$6); var irreducible$8 = irreducible$1; var isNil$4 = isNil$1; var Nil = irreducible$8("Nil", isNil$4); var isNumber$1 = function isNumber$1(u) {
  return "number" == typeof u && isFinite(u) && !isNaN(u);
}; var irreducible$9 = irreducible$1; var isNumber = isNumber$1; var _Number = irreducible$9("Number", isNumber); var isType$3 = isType$1; var isIdentity$1 = function isIdentity$1(u) {
  return !isType$3(u) || u.meta.identity;
}; var isType$4 = isType$1; var create$1 = function create$1(u, e, t) {
  return isType$4(u) ? u.meta.identity || "object" !== (void 0 === e ? "undefined" : _typeof$1(e)) || null === e ? u(e, t) : new u(e, t) : e;
}; var isType$5 = isType$1; var is$1 = function is$1(u, e) {
  return isType$5(e) ? e.is(u) : u instanceof e;
}; var assert$3 = assert_1; var isIdentity = isIdentity$1; var create = create$1; var is$1$1 = is$1; var getTypeName$3 = getTypeName$1; var getFunctionName$4 = getFunctionName$1;refinement$1.getDefaultName = getDefaultName;var refinement_1 = refinement$1; var refinement = refinement_1; var Number$1 = _Number; var Integer = refinement(Number$1, function (u) {
  return u % 1 == 0;
}, "Integer"); var irreducible$10 = irreducible$1; var isObject$6 = isObject$4; var _Object = irreducible$10("Object", isObject$6); var irreducible$11 = irreducible$1; var _RegExp = irreducible$11("RegExp", function (u) {
  return u instanceof RegExp;
}); var irreducible$12 = irreducible$1; var isString$4 = isString$1; var _String = irreducible$12("String", isString$4); var irreducible$13 = irreducible$1; var isType$6 = isType$1; var Type = irreducible$13("Type", isType$6); var assert$6 = assert_1; var getTypeName$5 = getTypeName$1; var isIdentity$3 = isIdentity$1; var isObject$7 = isObject$4; var create$3 = create$1; var is$3 = is$1;dict.getDefaultName = getDefaultName$1;var dict_1 = dict; var isNil$7 = isNil$1; var mixin$3 = function mixin$3(u, e, t) {
  if (isNil$7(e)) return u;for (var r in e) {
    e.hasOwnProperty(r) && (u[r] = e[r]);
  }return u;
}; var isType$8 = isType$1; var isUnion$1 = function isUnion$1(u) {
  return isType$8(u) && "union" === u.meta.kind;
}; var mixin$2 = mixin$3; var getTypeName$6 = getTypeName$1; var isUnion = isUnion$1; var nextDeclareUniqueId = 1; var declare = function declare(u) {
  function e(u, e) {
    return t(u, e);
  }var t;return e.define = function (r) {
    return isUnion(r) && e.hasOwnProperty("dispatch") && (r.dispatch = e.dispatch), t = r, mixin$2(e, t, !0), u && (t.displayName = e.displayName = u, e.meta.name = u), e.meta.identity = t.meta.identity, e.prototype = t.prototype, e;
  }, e.displayName = u || getTypeName$6(e) + "$" + nextDeclareUniqueId++, e.meta = { identity: !1 }, e.prototype = null, e;
}; var assert$9 = assert_1; var isString$5 = isString$1;enums.of = function (u, e) {
  u = isString$5(u) ? u.split(" ") : u;var t = {};return u.forEach(function (u) {
    t[u] = u;
  }), enums(t, e);
}, enums.getDefaultName = getDefaultName$2;var enums_1 = enums; var assert$10 = assert_1; var getTypeName$7 = getTypeName$1; var isIdentity$4 = isIdentity$1; var create$4 = create$1; var is$4 = is$1; var isArray$4 = isArray$1;list.getDefaultName = getDefaultName$3;var list_1 = list; var isType$9 = isType$1; var isMaybe$1 = function isMaybe$1(u) {
  return isType$9(u) && "maybe" === u.meta.kind;
}; var isMaybe = isMaybe$1; var isIdentity$5 = isIdentity$1; var Any$2 = Any; var create$5 = create$1; var Nil$2 = Nil; var is$5 = is$1; var getTypeName$8 = getTypeName$1;maybe.getDefaultName = getDefaultName$4;var maybe_1 = maybe; var getTypeName$10 = getTypeName$1; var getDefaultInterfaceName_1 = getDefaultInterfaceName$1; var isType$12 = isType$1; var decompose_1 = decompose$1; var mixin$5 = mixin$3; var isObject$10 = isObject$4; var refinement$2 = refinement_1; var decompose = decompose_1; var extend_1 = extend$1; var assert$12 = assert_1; var isObject$9 = isObject$4; var isNil$8 = isNil$1; var create$6 = create$1; var getDefaultInterfaceName = getDefaultInterfaceName_1; var extend = extend_1;struct.strict = !1, struct.getOptions = getOptions, struct.getDefaultName = getDefaultName$5, struct.extend = extendStruct;var struct_1 = struct; var assert$14 = assert_1; var getTypeName$11 = getTypeName$1; var isIdentity$6 = isIdentity$1; var isArray$6 = isArray$1; var create$7 = create$1; var is$6 = is$1;tuple.getDefaultName = getDefaultName$6;var tuple_1 = tuple; var assert$15 = assert_1; var getTypeName$12 = getTypeName$1; var isIdentity$7 = isIdentity$1; var create$8 = create$1; var is$7 = is$1; var isUnion$3 = isUnion$1; var isNil$9 = isNil$1;union.getDefaultName = getDefaultName$7;var union_1 = union; var FunctionType = _Function; var isArray$8 = isArray$1; var isObject$11 = isObject$4; var create$9 = create$1; var getFunctionName$6 = getFunctionName$1; var getTypeName$13 = getTypeName$1; var isType$13 = isType$1;func.getDefaultName = getDefaultName$8, func.getOptionalArgumentsIndex = getOptionalArgumentsIndex;var func_1 = func; var assert$17 = assert_1; var is$8 = is$1; var getTypeName$14 = getTypeName$1; var isIdentity$8 = isIdentity$1;intersection.getDefaultName = getDefaultName$9;var intersection_1 = intersection; var assign_1 = assign$1$1; var assert$18 = assert_1; var isObject$12 = isObject$4; var isNil$11 = isNil$1; var create$10 = create$1; var getDefaultInterfaceName$2 = getDefaultInterfaceName_1; var isIdentity$9 = isIdentity$1; var is$9 = is$1; var extend$2 = extend_1; var assign$2 = assign_1;inter.strict = !1, inter.getOptions = getOptions$1, inter.getDefaultName = getDefaultInterfaceName$2, inter.extend = extendInterface;var _interface = inter; var isObject$13 = isObject$4; var isArray$10 = isArray$1; var assign$2$1 = assign_1;update.commands = { $apply: $apply, $push: $push, $remove: $remove, $set: $set, $splice: $splice, $swap: $swap, $unshift: $unshift, $merge: $merge };var update_1 = update; var assert$20 = assert_1; var isFunction$16 = isFunction$2; var isType$14 = isType$1; var Any$3 = Any; var match = function match(u) {
  for (var e, t, r, n = 1, i = arguments.length; n < i;) {
    if (e = arguments[n], t = arguments[n + 1], r = arguments[n + 2], isFunction$16(r) && !isType$14(r) ? n += 3 : (r = t, t = Any$3.is, n += 2), e.is(u) && t(u)) return r(u);
  }assert$20.fail("Match error");
}; var t$2 = assert_1;t$2.Any = Any, t$2.Array = _Array, t$2.Boolean = _Boolean, t$2.Date = _Date, t$2.Error = _Error, t$2.Function = _Function, t$2.Nil = Nil, t$2.Number = _Number, t$2.Integer = Integer, t$2.IntegerT = t$2.Integer, t$2.Object = _Object, t$2.RegExp = _RegExp, t$2.String = _String, t$2.Type = Type, t$2.TypeT = t$2.Type, t$2.Arr = t$2.Array, t$2.Bool = t$2.Boolean, t$2.Dat = t$2.Date, t$2.Err = t$2.Error, t$2.Func = t$2.Function, t$2.Num = t$2.Number, t$2.Obj = t$2.Object, t$2.Re = t$2.RegExp, t$2.Str = t$2.String, t$2.dict = dict_1, t$2.declare = declare, t$2.enums = enums_1, t$2.irreducible = irreducible$1, t$2.list = list_1, t$2.maybe = maybe_1, t$2.refinement = refinement_1, t$2.struct = struct_1, t$2.tuple = tuple_1, t$2.union = union_1, t$2.func = func_1, t$2.intersection = intersection_1, t$2.subtype = t$2.refinement, t$2.inter = _interface, t$2.interface = t$2.inter, t$2.assert = t$2, t$2.update = update_1, t$2.mixin = mixin$3, t$2.isType = isType$1, t$2.is = is$1, t$2.getTypeName = getTypeName$1, t$2.match = match;var index$3 = t$2; var t = index$3; var stringify = t.stringify; var noobj = {}; var ValidationError = t.struct({ message: t.Any, actual: t.Any, expected: t.Any, path: t.list(t.union([t.String, t.Number])) }, "ValidationError");ValidationError.of = function (u, e, t, r) {
  return new ValidationError({ message: getValidationErrorMessage(u, e, t, r), actual: u, expected: e, path: t });
};var ValidationResult = t.struct({ errors: t.list(ValidationError), value: t.Any }, "ValidationResult");ValidationResult.prototype.isValid = function () {
  return !this.errors.length;
}, ValidationResult.prototype.firstError = function () {
  return this.isValid() ? null : this.errors[0];
}, ValidationResult.prototype.toString = function () {
  return this.isValid() ? "[ValidationResult, true, " + stringify(this.value) + "]" : "[ValidationResult, false, (" + this.errors.map(function (u) {
    return stringify(u.message);
  }).join(", ") + ")]";
};var validators = validate.validators = {};validators.es6classes = function (u, e, t, r) {
  return { value: u, errors: u instanceof e ? [] : [ValidationError.of(u, e, t, r.context)] };
}, validators.irreducible = validators.enums = function (u, e, t, r) {
  return { value: u, errors: e.is(u) ? [] : [ValidationError.of(u, e, t, r.context)] };
}, validators.list = function (u, e, r, n) {
  if (!t.Array.is(u)) return { value: u, errors: [ValidationError.of(u, e, r, n.context)] };for (var i = { value: [], errors: [] }, o = 0, a = u.length; o < a; o++) {
    var s = recurse(u[o], e.meta.type, r.concat(o), n);i.value[o] = s.value, i.errors = i.errors.concat(s.errors);
  }return i;
}, validators.subtype = function (u, e, t, r) {
  var n = recurse(u, e.meta.type, t, r);return n.errors.length ? n : (e.meta.predicate(n.value) || (n.errors = [ValidationError.of(u, e, t, r.context)]), n);
}, validators.maybe = function (u, e, r, n) {
  return t.Nil.is(u) ? { value: u, errors: [] } : recurse(u, e.meta.type, r, n);
}, validators.struct = function (u, e, r, n) {
  if (!t.Object.is(u)) return { value: u, errors: [ValidationError.of(u, e, r, n.context)] };if (e.is(u)) return { value: u, errors: [] };var i = { value: {}, errors: [] },
      o = e.meta.props,
      a = e.meta.defaultProps || noobj;for (var s in o) {
    if (o.hasOwnProperty(s)) {
      var c = u[s];void 0 === c && (c = a[s]);var l = recurse(c, o[s], r.concat(s), n);i.value[s] = l.value, i.errors = i.errors.concat(l.errors);
    }
  }if (n.hasOwnProperty("strict") ? n.strict : e.meta.strict) for (var A in u) {
    u.hasOwnProperty(A) && !o.hasOwnProperty(A) && i.errors.push(ValidationError.of(u[A], t.Nil, r.concat(A), n.context));
  }return i.errors.length || (i.value = new e(i.value)), i;
}, validators.tuple = function (u, e, r, n) {
  var i = e.meta.types,
      o = i.length;if (!t.Array.is(u) || u.length > o) return { value: u, errors: [ValidationError.of(u, e, r, n.context)] };for (var a = { value: [], errors: [] }, s = 0; s < o; s++) {
    var c = recurse(u[s], i[s], r.concat(s), n);a.value[s] = c.value, a.errors = a.errors.concat(c.errors);
  }return a;
}, validators.dict = function (u, e, r, n) {
  if (!t.Object.is(u)) return { value: u, errors: [ValidationError.of(u, e, r, n.context)] };var i = { value: {}, errors: [] };for (var o in u) {
    if (u.hasOwnProperty(o)) {
      var a = r.concat(o),
          s = recurse(o, e.meta.domain, a, n),
          c = recurse(u[o], e.meta.codomain, a, n);i.value[o] = c.value, i.errors = i.errors.concat(s.errors, c.errors);
    }
  }return i;
}, validators.union = function (u, e, r, n) {
  var i = e.dispatch(u);return t.Function.is(i) ? recurse(u, i, r.concat(e.meta.types.indexOf(i)), n) : { value: u, errors: [ValidationError.of(u, e, r, n.context)] };
}, validators.intersection = function (u, e, t, r) {
  for (var n = e.meta.types, i = n.length, o = { value: u, errors: [] }, a = 0, s = 0; s < i; s++) {
    "struct" === n[s].meta.kind && a++;var c = recurse(u, n[s], t, r);o.errors = o.errors.concat(c.errors);
  }return a > 1 && o.errors.push(ValidationError.of(u, e, t, r.context)), o;
}, validators.interface = function (u, e, r, n) {
  if (!t.Object.is(u)) return { value: u, errors: [ValidationError.of(u, e, r, n.context)] };var i = { value: {}, errors: [] },
      o = e.meta.props;for (var a in o) {
    var s = recurse(u[a], o[a], r.concat(a), n);i.value[a] = s.value, i.errors = i.errors.concat(s.errors);
  }if (n.hasOwnProperty("strict") ? n.strict : e.meta.strict) for (var c in u) {
    o.hasOwnProperty(c) || t.Nil.is(u[c]) || i.errors.push(ValidationError.of(u[c], t.Nil, r.concat(c), n.context));
  }return i;
}, t.mixin(t, { ValidationError: ValidationError, ValidationResult: ValidationResult, validate: validate });var index$2 = t; var LANGUAGES = { tr: { regexp: /\u0130|\u0049|\u0049\u0307/g, map: { "İ": "i", I: "ı", "İ": "i" } }, az: { regexp: /[\u0130]/g, map: { "İ": "i", I: "ı", "İ": "i" } }, lt: { regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g, map: { I: "i̇", J: "j̇", "Į": "į̇", "Ì": "i̇̀", "Í": "i̇́", "Ĩ": "i̇̃" } } }; var lowerCase$1 = function lowerCase$1(u, e) {
  var t = LANGUAGES[e];return u = null == u ? "" : String(u), t && (u = u.replace(t.regexp, function (u) {
    return t.map[u];
  })), u.toLowerCase();
}; var nonWordRegexp = /[^A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g; var camelCaseRegexp = /([a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])/g; var camelCaseUpperRegexp = /([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A]+)([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A][a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])/g; var lowerCase = lowerCase$1; var NON_WORD_REGEXP = nonWordRegexp; var CAMEL_CASE_REGEXP = camelCaseRegexp; var CAMEL_CASE_UPPER_REGEXP = camelCaseUpperRegexp; var noCase$1 = function noCase$1(u, e, t) {
  function r(u, e, r) {
    return 0 === e || e === r.length - u.length ? "" : t;
  }return null == u ? "" : (t = "string" != typeof t ? " " : t, u = String(u).replace(CAMEL_CASE_REGEXP, "$1 $2").replace(CAMEL_CASE_UPPER_REGEXP, "$1 $2").replace(NON_WORD_REGEXP, r), lowerCase(u, e));
}; var noCase = noCase$1; var snakeCase = function snakeCase(u, e) {
  return noCase(u, e, "_");
}; var validate$1 = index$2.validate; var checkOptions = function checkOptions(u, e, t) {
  var r = Object.keys(t),
      n = e.map(function (u) {
    return u.name;
  }),
      i = n.join(", ");return r.forEach(function (e) {
    if (n.indexOf(e) < 0) throw new Error(e + " is not a valid option for " + u + ". Valid options are: " + i);
  }), e.forEach(function (u) {
    var e = t[u.name];if ("location" === u.name && "string" == typeof e && (e = e.toLowerCase()), e) {
      var r = validate$1(e, u.type);if (!r.isValid()) throw new Error(r.firstError().message);
    }
  }), r;
}; var removeEmpty = function removeEmpty(u) {
  var e = Object.assign({}, u);return Object.keys(e).forEach(function (u) {
    return !e[u] && void 0 !== e[u] && delete e[u];
  }), e;
}; var snakeKeys = function snakeKeys(u) {
  var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
      t = Object.assign({}, u);return Object.keys(t).reduce(function (u, r) {
    return u[snakeCase(e + "-" + r)] = t[r], delete t[r], u;
  }, {});
}; var storeApiUrl = ENV.storeApiUrl; var _storeURL = function _storeURL(u, e) {
  var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
      r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};if (!e || "string" != typeof e) throw new Error("url is required for storeURL");var n = [{ name: "filename", type: index$2.String }, { name: "location", type: index$2.enums.of("s3 gcs rackspace azure dropbox") }, { name: "mimetype", type: index$2.String }, { name: "path", type: index$2.String }, { name: "region", type: index$2.String }, { name: "container", type: index$2.String }, { name: "access", type: index$2.enums.of("public private") }];checkOptions("storeURL", n, t);var i = t.location || "s3",
      o = removeEmpty(t);u.policy && u.signature && (o.policy = u.policy, o.signature = u.signature);var a = storeApiUrl + "/" + i;return new Promise(function (t, n) {
    var i = client$1.post(a).query({ key: u.apikey }).query(o).send("url=" + e).end(function (u, e) {
      if (u) n(u);else if (e.body && e.body.url) {
        var r = e.body.url.split("/").pop(),
            i = Object.assign({}, e.body, { handle: r });t(i);
      } else t(e.body);
    });r.cancel = function () {
      i.abort(), n(new Error("Upload cancelled"));
    };
  });
}; var fileApiUrl = ENV.fileApiUrl; var _retrieve = function _retrieve(u, e) {
  var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};if (!e || "string" != typeof e) throw new Error("handle is required for retrieve");var r = [{ name: "metadata", type: index$2.Boolean }, { name: "head", type: index$2.Boolean }, { name: "cache", type: index$2.Boolean }, { name: "dl", type: index$2.Boolean }, { name: "extension", type: index$2.String }];checkOptions("retrieve", r, t);var n = fileApiUrl + "/" + e,
      i = removeEmpty(t);return i.extension && (n += "+" + i.extension, delete i.extension), i.metadata && (n += "/metadata"), u.policy && u.signature && (i.policy = u.policy, i.signature = u.signature), i.head ? (delete i.head, new Promise(function (u, e) {
    client$1.head(n).query(i).end(function (t, r) {
      t ? e(t) : u(r.headers);
    });
  })) : new Promise(function (u, e) {
    var t = i.metadata ? "json" : "blob";delete i.metadata, client$1.get(n).query(i).responseType(t).end(function (t, r) {
      t ? e(t) : u(r.body);
    });
  });
}; var _remove = function _remove(u, e) {
  if (!e || "string" != typeof e) throw new Error("handle is required for remove");if (!u.policy || !u.signature) throw new Error("security policy and signature are required for remove");var t = fileApiUrl + "/" + e;return new Promise(function (e, r) {
    client$1.delete(t).query({ key: u.apikey }).query({ policy: u.policy, signature: u.signature }).end(function (u, t) {
      u ? r(u) : e(t.body);
    });
  });
}; var _metadata = function _metadata(u, e) {
  var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};if (!e || "string" != typeof e) throw new Error("handle is required for metadata");var r = [{ name: "size", type: index$2.Boolean }, { name: "mimetype", type: index$2.Boolean }, { name: "filename", type: index$2.Boolean }, { name: "width", type: index$2.Boolean }, { name: "height", type: index$2.Boolean }, { name: "uploaded", type: index$2.Boolean }, { name: "writeable", type: index$2.Boolean }, { name: "cloud", type: index$2.Boolean }, { name: "sourceUrl", type: index$2.Boolean }, { name: "md5", type: index$2.Boolean }, { name: "sha1", type: index$2.Boolean }, { name: "sha224", type: index$2.Boolean }, { name: "sha256", type: index$2.Boolean }, { name: "sha384", type: index$2.Boolean }, { name: "sha512", type: index$2.Boolean }, { name: "location", type: index$2.Boolean }, { name: "path", type: index$2.Boolean }, { name: "container", type: index$2.Boolean }, { name: "exif", type: index$2.Boolean }];checkOptions("retrieve", r, t);var n = removeEmpty(snakeKeys(t));u.policy && u.signature && (n.policy = u.policy, n.signature = u.signature);var i = fileApiUrl + "/" + e + "/metadata";return new Promise(function (u, e) {
    client$1.get(i).query(n).end(function (t, r) {
      t ? e(t) : u(r.body);
    });
  });
}; var onOff = { init: function init() {
    window.filestackInternals.logger.working = !1;
  }, isWorking: function isWorking() {
    return window.filestackInternals.logger.working;
  }, on: function on() {
    window.filestackInternals.logger.working = !0;
  }, off: function off() {
    window.filestackInternals.logger.working = !1;
  } }; var context = function u(e, t) {
  var r = function r() {
    for (var u = arguments.length, r = Array(u), n = 0; n < u; n++) {
      r[n] = arguments[n];
    }var i = [].concat(r).map(function (u) {
      return "object" === (void 0 === u ? "undefined" : _typeof$1(u)) ? JSON.stringify(u, function (u, e) {
        if ("function" == typeof e) {
          if ("json" === u) try {
            return e();
          } catch (u) {}return "[Function]";
        }return e instanceof File ? "[File name: " + e.name + ", mimetype: " + e.type + ", size: " + e.size + "]" : e;
      }, 2) : u;
    });if (t.isWorking()) {
      var o;(o = console).log.apply(o, ["[" + e + "]"].concat(toConsumableArray$1(i)));
    }
  };return r.context = function (r) {
    return u(e + "][" + r, t);
  }, r.on = t.on, r.off = t.off, r;
}; var logger = context("filestack", onOff); var initializeGlobalNamespace = function initializeGlobalNamespace() {
  var u = void 0;return "object" === ("undefined" == typeof window ? "undefined" : _typeof$1(window)) && (u = window.filestackInternals, u || (u = {}, window.filestackInternals = u), u.logger || (u.logger = logger, onOff.init())), u;
};initializeGlobalNamespace();var log = logger.context("api-client"); var cloudApiUrl = ENV.cloudApiUrl; var _cloud = function _cloud(u, e, t) {
  var r = { apikey: u.apikey };return e && e.policy && e.signature && (r.policy = e.policy, r.signature = e.signature), { name: t, list: function list(u) {
      var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};return log("cloud.list() called:", u), new Promise(function (n, i) {
        var o = client$1.get(cloudApiUrl + "/" + t + "/folder/list" + u).query(r).withCredentials().end(function (u, e) {
          u ? i(u) : (log("cloud.list() responded:", e.body), n(e.body));
        });e.cancel = function () {
          o.abort(), i(new Error("Cancelled"));
        };
      });
    }, store: function store(u) {
      var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};log("cloud.store() called:", u, e);var i = [{ name: "location", type: index$2.enums.of("s3 gcs rackspace azure dropbox") }, { name: "region", type: index$2.String }, { name: "path", type: index$2.String }, { name: "container", type: index$2.String }, { name: "access", type: index$2.enums.of("public private") }];checkOptions("cloud.store", i, e);var o = snakeKeys(e, "store");return new Promise(function (e, i) {
        var a = client$1.get(cloudApiUrl + "/" + t + "/store" + u).query(r).query(removeEmpty(o)).withCredentials().end(function (u, t) {
          u ? i(u) : (log("cloud.store() responded:", t.body), e(t.body));
        });n.cancel = function () {
          a.abort(), i(new Error("Cancelled"));
        };
      });
    }, link: function link(u) {
      var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};return log("cloud.link() called:", u), new Promise(function (n, i) {
        var o = client$1.get(cloudApiUrl + "/" + t + "/link" + u).query(r).withCredentials().end(function (u, e) {
          u ? i(u) : (log("cloud.link() responded:", e.body), n(e.body));
        });e.cancel = function () {
          o.abort(), i(new Error("Cancelled"));
        };
      });
    }, logout: function logout(e) {
      log("cloud.logout() called:", e);var t = e ? cloudApiUrl + "/" + e : cloudApiUrl;return new Promise(function (e, r) {
        client$1.get(t + "/auth/logout").query({ apikey: u.apikey }).withCredentials().end(function (u, t) {
          u ? r(u) : (log("cloud.logout() responded:", t.body), e(t.body));
        });
      });
    } };
}; var processURL = ENV.processApiUrl; var numberRange = function numberRange(u, e) {
  return index$2.refinement(index$2.Number, function (t) {
    return t >= u && t <= e;
  });
}; var min$2 = function min(u) {
  return index$2.refinement(index$2.Integer, function (e) {
    return e >= u;
  });
}; var max$1 = function max(u) {
  return index$2.refinement(index$2.Integer, function (e) {
    return e <= u;
  });
}; var range = function range(u, e) {
  return index$2.tuple([min$2(u), max$1(e)], "range");
}; var alignment = index$2.enums.of("top left right bottom"); var alignPair = index$2.refinement(index$2.tuple([alignment, alignment]), function (u) {
  return u[0] !== u[1];
}, "pair"); var formatOption = function formatOption(u, e) {
  var t = snakeCase(u.name),
      r = e[u.name];return Array.isArray(r) ? t + ":[" + r + "]" : r ? t + ":" + r : null;
}; var formatOptions = function formatOptions(u, e, t) {
  var r = e.map(function (u) {
    return formatOption(u, t);
  }).filter(function (u) {
    return u;
  }).join(","),
      n = snakeCase(u);return r.length ? n + "=" + r : n;
}; var sepia = function sepia() {
  var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      e = arguments[1],
      t = [{ name: "tone", type: numberRange(0, 100) }];checkOptions("sepia", t, e);var r = formatOptions("sepia", t, e);return u.concat(r);
}; var blackwhite = function blackwhite() {
  var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      e = arguments[1],
      t = [{ name: "threshold", type: numberRange(0, 100) }];checkOptions("blackwhite", t, e);var r = formatOptions("blackwhite", t, e);return u.concat(r);
}; var border = function border() {
  var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      e = arguments[1],
      t = [{ name: "width", type: numberRange(1, 1e3) }, { name: "color", type: index$2.String }, { name: "background", type: index$2.String }];checkOptions("border", t, e);var r = formatOptions("border", t, e);return u.concat(r);
}; var circle = function circle() {
  var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      e = arguments[1],
      t = [{ name: "background", type: index$2.String }];checkOptions("circle", t, e);var r = formatOptions("circle", t, e);return u.concat(r);
}; var shadow = function shadow() {
  var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      e = arguments[1],
      t = [{ name: "blur", type: numberRange(0, 20) }, { name: "opacity", type: numberRange(0, 100) }, { name: "vector", type: range(-1e3, 1e3) }, { name: "color", type: index$2.String }, { name: "background", type: index$2.String }];checkOptions("shadow", t, e);var r = formatOptions("shadow", t, e);return u.concat(r);
}; var tornEdges = function tornEdges() {
  var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      e = arguments[1],
      t = [{ name: "spread", type: range(1, 1e4) }, { name: "background", type: index$2.String }];checkOptions("tornEdges", t, e);var r = formatOptions("tornEdges", t, e);return u.concat(r);
}; var polaroid = function polaroid() {
  var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      e = arguments[1],
      t = [{ name: "color", type: index$2.String }, { name: "rotate", type: numberRange(0, 359) }, { name: "background", type: index$2.String }];checkOptions("polaroid", t, e);var r = formatOptions("polaroid", t, e);return u.concat(r);
}; var vignette = function vignette() {
  var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      e = arguments[1],
      t = [{ name: "amount", type: numberRange(0, 100) }, { name: "blurmode", type: index$2.enums.of("linear gaussian") }, { name: "background", type: index$2.String }];checkOptions("vignette", t, e);var r = formatOptions("vignette", t, e);return u.concat(r);
}; var roundedCorners = function roundedCorners() {
  var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      e = arguments[1],
      t = [{ name: "radius", type: index$2.union([numberRange(1, 1e4), index$2.enums.of("max")]) }, { name: "blur", type: numberRange(0, 20) }, { name: "background", type: index$2.String }];checkOptions("roundedCorners", t, e);var r = formatOptions("roundedCorners", t, e);return u.concat(r);
}; var rotate = function rotate() {
  var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      e = arguments[1],
      t = [{ name: "deg", type: index$2.union([numberRange(0, 359), index$2.enums.of("exif")]) }, { name: "exif", type: index$2.Boolean }, { name: "background", type: index$2.String }];if (checkOptions("rotate", t, e).length < 1) throw new Error("Rotate options must contain either deg or exif");var r = formatOptions("rotate", t, e);return u.concat(r);
}; var resize = function resize() {
  var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      e = arguments[1],
      t = [{ name: "width", type: numberRange(0, 1e4) }, { name: "height", type: numberRange(0, 1e4) }, { name: "fit", type: index$2.enums.of("clip crop scale max") }, { name: "align", type: index$2.union([index$2.enums.of("center top bottom left right faces"), alignPair]) }];if (checkOptions("resize", t, e).length < 1) throw new Error("Resize options must contain either width, height, fit, or align");var r = formatOptions("resize", t, e);return u.concat(r);
}; var flip = function flip() {
  var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      e = arguments[1];if ("boolean" != typeof e) throw Error("flip must be a Boolean value");return e ? u.concat("flip") : u;
}; var flop = function flop() {
  var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      e = arguments[1];if ("boolean" != typeof e) throw Error("flop must be a Boolean value");return e ? u.concat("flop") : u;
}; var monochrome = function monochrome() {
  var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      e = arguments[1];if ("boolean" != typeof e) throw Error("monochrome must be a Boolean value");return e ? u.concat("monochrome") : u;
}; var crop = function crop() {
  var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      e = arguments[1],
      t = [{ name: "dim", type: index$2.struct({ x: index$2.Integer, y: index$2.Integer, width: index$2.Integer, height: index$2.Integer }) }];checkOptions("crop", t, e);var r = e.dim,
      n = "crop=dim:[" + r.x + "," + r.y + "," + r.width + "," + r.height + "]";return u.concat(n);
}; var transformers = { crop: crop, resize: resize, rotate: rotate, roundedCorners: roundedCorners, vignette: vignette, polaroid: polaroid, tornEdges: tornEdges, shadow: shadow, circle: circle, border: border, flip: flip, flop: flop, blackwhite: blackwhite, monochrome: monochrome, sepia: sepia }; var _transform = function _transform(u, e, t) {
  var r = Object.keys(transformers),
      n = Object.keys(t);n.forEach(function (u) {
    if (r.indexOf(u) < 0) throw new Error("Invalid option specified: " + u + " is not a valid transform option.");
  });var i = function u() {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
        r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;if (r === n.length) return e;var i = n[r],
        o = t[i],
        a = transformers[i],
        s = r + 1;return u(a(e, o), s);
  };if (u.policy && u.signature) {
    var o = "security=policy:" + u.policy + ",signature:" + u.signature;return processURL + "/" + u.apikey + "/" + o + "/" + i().join("/") + "/" + e;
  }var a = processURL + "/" + u.apikey;if (i().length) return a + "/" + i().join("/") + "/" + e;return e;
}; var sparkMd5 = createCommonjsModule$1(function (u, e) {
  !function (e) {
    u.exports = function (u) {
      "use strict";
      function e(u, e) {
        var t = u[0],
            r = u[1],
            n = u[2],
            i = u[3];t += (r & n | ~r & i) + e[0] - 680876936 | 0, t = (t << 7 | t >>> 25) + r | 0, i += (t & r | ~t & n) + e[1] - 389564586 | 0, i = (i << 12 | i >>> 20) + t | 0, n += (i & t | ~i & r) + e[2] + 606105819 | 0, n = (n << 17 | n >>> 15) + i | 0, r += (n & i | ~n & t) + e[3] - 1044525330 | 0, r = (r << 22 | r >>> 10) + n | 0, t += (r & n | ~r & i) + e[4] - 176418897 | 0, t = (t << 7 | t >>> 25) + r | 0, i += (t & r | ~t & n) + e[5] + 1200080426 | 0, i = (i << 12 | i >>> 20) + t | 0, n += (i & t | ~i & r) + e[6] - 1473231341 | 0, n = (n << 17 | n >>> 15) + i | 0, r += (n & i | ~n & t) + e[7] - 45705983 | 0, r = (r << 22 | r >>> 10) + n | 0, t += (r & n | ~r & i) + e[8] + 1770035416 | 0, t = (t << 7 | t >>> 25) + r | 0, i += (t & r | ~t & n) + e[9] - 1958414417 | 0, i = (i << 12 | i >>> 20) + t | 0, n += (i & t | ~i & r) + e[10] - 42063 | 0, n = (n << 17 | n >>> 15) + i | 0, r += (n & i | ~n & t) + e[11] - 1990404162 | 0, r = (r << 22 | r >>> 10) + n | 0, t += (r & n | ~r & i) + e[12] + 1804603682 | 0, t = (t << 7 | t >>> 25) + r | 0, i += (t & r | ~t & n) + e[13] - 40341101 | 0, i = (i << 12 | i >>> 20) + t | 0, n += (i & t | ~i & r) + e[14] - 1502002290 | 0, n = (n << 17 | n >>> 15) + i | 0, r += (n & i | ~n & t) + e[15] + 1236535329 | 0, r = (r << 22 | r >>> 10) + n | 0, t += (r & i | n & ~i) + e[1] - 165796510 | 0, t = (t << 5 | t >>> 27) + r | 0, i += (t & n | r & ~n) + e[6] - 1069501632 | 0, i = (i << 9 | i >>> 23) + t | 0, n += (i & r | t & ~r) + e[11] + 643717713 | 0, n = (n << 14 | n >>> 18) + i | 0, r += (n & t | i & ~t) + e[0] - 373897302 | 0, r = (r << 20 | r >>> 12) + n | 0, t += (r & i | n & ~i) + e[5] - 701558691 | 0, t = (t << 5 | t >>> 27) + r | 0, i += (t & n | r & ~n) + e[10] + 38016083 | 0, i = (i << 9 | i >>> 23) + t | 0, n += (i & r | t & ~r) + e[15] - 660478335 | 0, n = (n << 14 | n >>> 18) + i | 0, r += (n & t | i & ~t) + e[4] - 405537848 | 0, r = (r << 20 | r >>> 12) + n | 0, t += (r & i | n & ~i) + e[9] + 568446438 | 0, t = (t << 5 | t >>> 27) + r | 0, i += (t & n | r & ~n) + e[14] - 1019803690 | 0, i = (i << 9 | i >>> 23) + t | 0, n += (i & r | t & ~r) + e[3] - 187363961 | 0, n = (n << 14 | n >>> 18) + i | 0, r += (n & t | i & ~t) + e[8] + 1163531501 | 0, r = (r << 20 | r >>> 12) + n | 0, t += (r & i | n & ~i) + e[13] - 1444681467 | 0, t = (t << 5 | t >>> 27) + r | 0, i += (t & n | r & ~n) + e[2] - 51403784 | 0, i = (i << 9 | i >>> 23) + t | 0, n += (i & r | t & ~r) + e[7] + 1735328473 | 0, n = (n << 14 | n >>> 18) + i | 0, r += (n & t | i & ~t) + e[12] - 1926607734 | 0, r = (r << 20 | r >>> 12) + n | 0, t += (r ^ n ^ i) + e[5] - 378558 | 0, t = (t << 4 | t >>> 28) + r | 0, i += (t ^ r ^ n) + e[8] - 2022574463 | 0, i = (i << 11 | i >>> 21) + t | 0, n += (i ^ t ^ r) + e[11] + 1839030562 | 0, n = (n << 16 | n >>> 16) + i | 0, r += (n ^ i ^ t) + e[14] - 35309556 | 0, r = (r << 23 | r >>> 9) + n | 0, t += (r ^ n ^ i) + e[1] - 1530992060 | 0, t = (t << 4 | t >>> 28) + r | 0, i += (t ^ r ^ n) + e[4] + 1272893353 | 0, i = (i << 11 | i >>> 21) + t | 0, n += (i ^ t ^ r) + e[7] - 155497632 | 0, n = (n << 16 | n >>> 16) + i | 0, r += (n ^ i ^ t) + e[10] - 1094730640 | 0, r = (r << 23 | r >>> 9) + n | 0, t += (r ^ n ^ i) + e[13] + 681279174 | 0, t = (t << 4 | t >>> 28) + r | 0, i += (t ^ r ^ n) + e[0] - 358537222 | 0, i = (i << 11 | i >>> 21) + t | 0, n += (i ^ t ^ r) + e[3] - 722521979 | 0, n = (n << 16 | n >>> 16) + i | 0, r += (n ^ i ^ t) + e[6] + 76029189 | 0, r = (r << 23 | r >>> 9) + n | 0, t += (r ^ n ^ i) + e[9] - 640364487 | 0, t = (t << 4 | t >>> 28) + r | 0, i += (t ^ r ^ n) + e[12] - 421815835 | 0, i = (i << 11 | i >>> 21) + t | 0, n += (i ^ t ^ r) + e[15] + 530742520 | 0, n = (n << 16 | n >>> 16) + i | 0, r += (n ^ i ^ t) + e[2] - 995338651 | 0, r = (r << 23 | r >>> 9) + n | 0, t += (n ^ (r | ~i)) + e[0] - 198630844 | 0, t = (t << 6 | t >>> 26) + r | 0, i += (r ^ (t | ~n)) + e[7] + 1126891415 | 0, i = (i << 10 | i >>> 22) + t | 0, n += (t ^ (i | ~r)) + e[14] - 1416354905 | 0, n = (n << 15 | n >>> 17) + i | 0, r += (i ^ (n | ~t)) + e[5] - 57434055 | 0, r = (r << 21 | r >>> 11) + n | 0, t += (n ^ (r | ~i)) + e[12] + 1700485571 | 0, t = (t << 6 | t >>> 26) + r | 0, i += (r ^ (t | ~n)) + e[3] - 1894986606 | 0, i = (i << 10 | i >>> 22) + t | 0, n += (t ^ (i | ~r)) + e[10] - 1051523 | 0, n = (n << 15 | n >>> 17) + i | 0, r += (i ^ (n | ~t)) + e[1] - 2054922799 | 0, r = (r << 21 | r >>> 11) + n | 0, t += (n ^ (r | ~i)) + e[8] + 1873313359 | 0, t = (t << 6 | t >>> 26) + r | 0, i += (r ^ (t | ~n)) + e[15] - 30611744 | 0, i = (i << 10 | i >>> 22) + t | 0, n += (t ^ (i | ~r)) + e[6] - 1560198380 | 0, n = (n << 15 | n >>> 17) + i | 0, r += (i ^ (n | ~t)) + e[13] + 1309151649 | 0, r = (r << 21 | r >>> 11) + n | 0, t += (n ^ (r | ~i)) + e[4] - 145523070 | 0, t = (t << 6 | t >>> 26) + r | 0, i += (r ^ (t | ~n)) + e[11] - 1120210379 | 0, i = (i << 10 | i >>> 22) + t | 0, n += (t ^ (i | ~r)) + e[2] + 718787259 | 0, n = (n << 15 | n >>> 17) + i | 0, r += (i ^ (n | ~t)) + e[9] - 343485551 | 0, r = (r << 21 | r >>> 11) + n | 0, u[0] = t + u[0] | 0, u[1] = r + u[1] | 0, u[2] = n + u[2] | 0, u[3] = i + u[3] | 0;
      }function t(u) {
        var e,
            t = [];for (e = 0; e < 64; e += 4) {
          t[e >> 2] = u.charCodeAt(e) + (u.charCodeAt(e + 1) << 8) + (u.charCodeAt(e + 2) << 16) + (u.charCodeAt(e + 3) << 24);
        }return t;
      }function r(u) {
        var e,
            t = [];for (e = 0; e < 64; e += 4) {
          t[e >> 2] = u[e] + (u[e + 1] << 8) + (u[e + 2] << 16) + (u[e + 3] << 24);
        }return t;
      }function n(u) {
        var r,
            n,
            i,
            o,
            a,
            s,
            c = u.length,
            l = [1732584193, -271733879, -1732584194, 271733878];for (r = 64; r <= c; r += 64) {
          e(l, t(u.substring(r - 64, r)));
        }for (u = u.substring(r - 64), n = u.length, i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], r = 0; r < n; r += 1) {
          i[r >> 2] |= u.charCodeAt(r) << (r % 4 << 3);
        }if (i[r >> 2] |= 128 << (r % 4 << 3), r > 55) for (e(l, i), r = 0; r < 16; r += 1) {
          i[r] = 0;
        }return o = 8 * c, o = o.toString(16).match(/(.*?)(.{0,8})$/), a = parseInt(o[2], 16), s = parseInt(o[1], 16) || 0, i[14] = a, i[15] = s, e(l, i), l;
      }function i(u) {
        var t,
            n,
            i,
            o,
            a,
            s,
            c = u.length,
            l = [1732584193, -271733879, -1732584194, 271733878];for (t = 64; t <= c; t += 64) {
          e(l, r(u.subarray(t - 64, t)));
        }for (u = t - 64 < c ? u.subarray(t - 64) : new Uint8Array(0), n = u.length, i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], t = 0; t < n; t += 1) {
          i[t >> 2] |= u[t] << (t % 4 << 3);
        }if (i[t >> 2] |= 128 << (t % 4 << 3), t > 55) for (e(l, i), t = 0; t < 16; t += 1) {
          i[t] = 0;
        }return o = 8 * c, o = o.toString(16).match(/(.*?)(.{0,8})$/), a = parseInt(o[2], 16), s = parseInt(o[1], 16) || 0, i[14] = a, i[15] = s, e(l, i), l;
      }function o(u) {
        var e,
            t = "";for (e = 0; e < 4; e += 1) {
          t += f[u >> 8 * e + 4 & 15] + f[u >> 8 * e & 15];
        }return t;
      }function a(u) {
        var e;for (e = 0; e < u.length; e += 1) {
          u[e] = o(u[e]);
        }return u.join("");
      }function s(u) {
        return (/[\u0080-\uFFFF]/.test(u) && (u = unescape(encodeURIComponent(u))), u
        );
      }function c(u, e) {
        var t,
            r = u.length,
            n = new ArrayBuffer(r),
            i = new Uint8Array(n);for (t = 0; t < r; t += 1) {
          i[t] = u.charCodeAt(t);
        }return e ? i : n;
      }function l(u) {
        return String.fromCharCode.apply(null, new Uint8Array(u));
      }function A(u, e, t) {
        var r = new Uint8Array(u.byteLength + e.byteLength);return r.set(new Uint8Array(u)), r.set(new Uint8Array(e), u.byteLength), t ? r : r.buffer;
      }function p(u) {
        var e,
            t = [],
            r = u.length;for (e = 0; e < r - 1; e += 2) {
          t.push(parseInt(u.substr(e, 2), 16));
        }return String.fromCharCode.apply(String, t);
      }function E() {
        this.reset();
      }var f = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];return "5d41402abc4b2a76b9719d911017c592" !== a(n("hello")) && function (u, e) {
        var t = (65535 & u) + (65535 & e);return (u >> 16) + (e >> 16) + (t >> 16) << 16 | 65535 & t;
      }, "undefined" == typeof ArrayBuffer || ArrayBuffer.prototype.slice || function () {
        function e(u, e) {
          return u = 0 | u || 0, u < 0 ? Math.max(u + e, 0) : Math.min(u, e);
        }ArrayBuffer.prototype.slice = function (t, r) {
          var n,
              i,
              o,
              a,
              s = this.byteLength,
              c = e(t, s),
              l = s;return r !== u && (l = e(r, s)), c > l ? new ArrayBuffer(0) : (n = l - c, i = new ArrayBuffer(n), o = new Uint8Array(i), a = new Uint8Array(this, c, n), o.set(a), i);
        };
      }(), E.prototype.append = function (u) {
        return this.appendBinary(s(u)), this;
      }, E.prototype.appendBinary = function (u) {
        this._buff += u, this._length += u.length;var r,
            n = this._buff.length;for (r = 64; r <= n; r += 64) {
          e(this._hash, t(this._buff.substring(r - 64, r)));
        }return this._buff = this._buff.substring(r - 64), this;
      }, E.prototype.end = function (u) {
        var e,
            t,
            r = this._buff,
            n = r.length,
            i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];for (e = 0; e < n; e += 1) {
          i[e >> 2] |= r.charCodeAt(e) << (e % 4 << 3);
        }return this._finish(i, n), t = a(this._hash), u && (t = p(t)), this.reset(), t;
      }, E.prototype.reset = function () {
        return this._buff = "", this._length = 0, this._hash = [1732584193, -271733879, -1732584194, 271733878], this;
      }, E.prototype.getState = function () {
        return { buff: this._buff, length: this._length, hash: this._hash };
      }, E.prototype.setState = function (u) {
        return this._buff = u.buff, this._length = u.length, this._hash = u.hash, this;
      }, E.prototype.destroy = function () {
        delete this._hash, delete this._buff, delete this._length;
      }, E.prototype._finish = function (u, t) {
        var r,
            n,
            i,
            o = t;if (u[o >> 2] |= 128 << (o % 4 << 3), o > 55) for (e(this._hash, u), o = 0; o < 16; o += 1) {
          u[o] = 0;
        }r = 8 * this._length, r = r.toString(16).match(/(.*?)(.{0,8})$/), n = parseInt(r[2], 16), i = parseInt(r[1], 16) || 0, u[14] = n, u[15] = i, e(this._hash, u);
      }, E.hash = function (u, e) {
        return E.hashBinary(s(u), e);
      }, E.hashBinary = function (u, e) {
        var t = n(u),
            r = a(t);return e ? p(r) : r;
      }, E.ArrayBuffer = function () {
        this.reset();
      }, E.ArrayBuffer.prototype.append = function (u) {
        var t,
            n = A(this._buff.buffer, u, !0),
            i = n.length;for (this._length += u.byteLength, t = 64; t <= i; t += 64) {
          e(this._hash, r(n.subarray(t - 64, t)));
        }return this._buff = t - 64 < i ? new Uint8Array(n.buffer.slice(t - 64)) : new Uint8Array(0), this;
      }, E.ArrayBuffer.prototype.end = function (u) {
        var e,
            t,
            r = this._buff,
            n = r.length,
            i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];for (e = 0; e < n; e += 1) {
          i[e >> 2] |= r[e] << (e % 4 << 3);
        }return this._finish(i, n), t = a(this._hash), u && (t = p(t)), this.reset(), t;
      }, E.ArrayBuffer.prototype.reset = function () {
        return this._buff = new Uint8Array(0), this._length = 0, this._hash = [1732584193, -271733879, -1732584194, 271733878], this;
      }, E.ArrayBuffer.prototype.getState = function () {
        var u = E.prototype.getState.call(this);return u.buff = l(u.buff), u;
      }, E.ArrayBuffer.prototype.setState = function (u) {
        return u.buff = c(u.buff, !0), E.prototype.setState.call(this, u);
      }, E.ArrayBuffer.prototype.destroy = E.prototype.destroy, E.ArrayBuffer.prototype._finish = E.prototype._finish, E.ArrayBuffer.hash = function (u, e) {
        var t = i(new Uint8Array(u)),
            r = a(t);return e ? p(r) : r;
      }, E;
    }();
  }();
}); var FUNC_ERROR_TEXT = "Expected a function"; var NAN = NaN; var symbolTag = "[object Symbol]"; var reTrim = /^\s+|\s+$/g; var reIsBadHex = /^[-+]0x[0-9a-f]+$/i; var reIsBinary = /^0b[01]+$/i; var reIsOctal = /^0o[0-7]+$/i; var freeParseInt = parseInt; var freeGlobal = "object" == _typeof$1(commonjsGlobal$1) && commonjsGlobal$1 && commonjsGlobal$1.Object === Object && commonjsGlobal$1; var freeSelf = "object" == ("undefined" == typeof self ? "undefined" : _typeof$1(self)) && self && self.Object === Object && self; var root = freeGlobal || freeSelf || Function("return this")(); var objectProto = Object.prototype; var objectToString = objectProto.toString; var nativeMax = Math.max; var nativeMin = Math.min; var now = function now() {
  return root.Date.now();
}; var index$5 = throttle; var log$1 = logger.context("api-client"); var uploadURL = ENV.uploadApiUrl; var parseStoreOpts = function parseStoreOpts(u, e) {
  var t = [{ name: "location", type: index$2.enums.of("s3 gcs rackspace azure dropbox") }, { name: "region", type: index$2.String }, { name: "path", type: index$2.String }, { name: "container", type: index$2.String }, { name: "access", type: index$2.enums.of("public private") }];checkOptions("upload (storeParams)", t, e);var r = snakeKeys(e, "store");return u.policy && u.signature ? Object.assign({}, r, { signature: u.signature, policy: u.policy }) : r;
}; var Uploader = function Uploader(u, e, t) {
  function r(u) {
    return btoa(sparkMd5.ArrayBuffer.hash(u, !0));
  }this.config = Object.assign({}, { host: uploadURL, apikey: u.apikey, partSize: 5242880, maxConcurrentUploads: 5, cryptoMd5Method: r, retryOptions: { retries: 10, factor: 2, minTimeout: 1e3, maxTimeout: 6e4 }, onStart: null, onRetry: null, onUploadStart: null, onProgress: null, onPaused: null, onUploadCompleteFunction: null, onCompleteFunction: null, onUploadFailedFunction: null }, e), void 0 !== t && (this.storeParams = Object.assign({}, { store_location: "", store_region: "", store_container: "", store_path: "", store_access: "" }, parseStoreOpts(u, t))), this.parts = {}, this.file = null, this.currentUploads = 0, this.uploadData = null, this.uploadFailed = null, this.attempts = 0, this.cancelRequested = !1, this.pauseRequested = !1;
};Uploader.prototype.slice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice, Uploader.prototype.multipartUpload = function (u) {
  var e = this;e.file = u, e.parts.reader = new FileReader(), e.parts.current = 0, e.parts.total = Math.ceil(e.file.size / e.config.partSize), e.parts.uploaded = [], e.parts.failures = [], null !== e.config.onProgress && (e.parts.progress = Array.apply(void 0, toConsumableArray$1(Array(e.parts.total))).map(Number.prototype.valueOf, 0)), e.parts.reader.onload = function (u) {
    e.onPartLoad(u);
  }, e.initUpload();
}, Uploader.prototype.initUpload = function () {
  var u = this;u.start(function (e, t) {
    t && t.ok ? u.loadNextPart() : u.processRetries();
  });
}, Uploader.prototype.start = function (u) {
  var e = this;null !== e.config.onStart && e.config.onStart();var t = { filename: e.file.newName || e.file.name, mimetype: e.file.type || "application/octet-stream", size: e.file.size },
      r = e.createUploadFormData(t),
      n = new XMLHttpRequest();n.onreadystatechange = function () {
    if (4 === n.readyState) if (200 === n.status) {
      var t = { ok: !0 };e.uploadData = JSON.parse(n.response), u(null, t);
    } else {
      var r = n.response || "no response. Please check your browser network log for more info";e.config.onUploadFailedFunction(new Error('Upload "start" failed with response: ' + r));
    }
  }, n.onerror = function (e) {
    u(e, null);
  }, n.open("POST", e.config.host + "/multipart/start", !0), n.send(r);
}, Uploader.prototype.loadNextPart = function () {
  var u = this;if (u.pauseRequested || u.currentUploads >= u.config.maxConcurrentUploads) return void setTimeout(function () {
    u.loadNextPart();
  }, 100);u.currentUploads += 1;var e = u.parts.current * u.config.partSize,
      t = e + u.config.partSize >= u.file.size ? u.file.size : e + u.config.partSize;u.parts.reader.readAsArrayBuffer(u.slice.call(u.file, e, t));
}, Uploader.prototype.onPartLoad = function (u) {
  var e = this;log$1("Loading part: ", e.parts.current);var t = 0,
      r = !1;for (t = 0; t < e.parts.uploaded.length; t += 1) {
    var n = e.parts.uploaded[t].split(":", 1);if (parseInt(n[0], 10) === e.parts.current + 1) {
      r = !0;break;
    }
  }if (e.parts.current += 1, r || e.cancelRequested) e.handleError(new Error("Upload cancelled"), e.parts.current, u.total);else {
    var i = e.config.cryptoMd5Method(u.target.result);e.getUploadData(u.target.result, e.parts.current, u.total, i);
  }e.parts.current < e.parts.total ? e.loadNextPart() : e.waitForAllPartsAttempted();
}, Uploader.prototype.getUploadData = function (u, e, t, r) {
  var n = this;if (null !== n.uploadFailed) return void n.config.onUploadFailedFunction(new Error("Upload failed loading a chunk. Please check your network log."));if (null === n.uploadData) return void setTimeout(function () {
    n.getUploadData(u, e, t, r);
  }, 100);var i = { part: e, size: t, md5: r },
      o = n.createUploadFormData(i),
      a = new XMLHttpRequest();a.onreadystatechange = function () {
    4 === a.readyState && 200 === a.status && n.uploadNextPart(u, JSON.parse(a.response), e);
  }, a.onerror = function (t) {
    n.handleError(t, e, u.byteLength);
  }, a.open("POST", n.config.host + "/multipart/upload", !0), a.send(o);
}, Uploader.prototype.allPartsLoaded = function () {
  var u = this;return u.parts.uploaded.length === u.parts.total;
}, Uploader.prototype.uploadNextPart = function (u, e, t) {
  this.uploadPart(u, e, t);
}, Uploader.prototype.uploadPart = function (u, e, t) {
  var r = this;null !== r.config.onUploadStart && (r.config.onUploadStart(), r.config.onUploadStart = null);var n = new XMLHttpRequest();if (n.onreadystatechange = function () {
    if (4 === n.readyState && 200 === n.status) {
      r.currentUploads -= 1;var u = n.getResponseHeader("ETag");r.parts.uploaded.push(t + ":" + u);
    }
  }, null !== r.config.onProgress) {
    var i = index$5(function (e) {
      r.updateProgress(e.loaded, t, u.byteLength), r.cancelRequested && (n.abort(), r.handleError(new Error("Upload cancelled"), t, u.byteLength));
    }, 1e3);n.upload.onprogress = i;
  }n.onerror = function (e) {
    r.handleError(e, t, u.byteLength);
  }, n.open("PUT", e.url, !0), Object.keys(e.headers).forEach(function (u) {
    n.setRequestHeader(u, e.headers[u]);
  }), n.send(new Uint8Array(u));
}, Uploader.prototype.updateProgress = function (u, e, t) {
  var r = this;if (null !== r.config.onProgress) {
    r.parts.progress[e] = u;var n = r.parts.progress.reduce(function (u, e) {
      return u + e;
    }, 0),
        i = Math.round(n / r.file.size * 100);r.config.onProgress({ totalProgressPercent: i, progressTotal: n, part: e, loaded: u, byteLength: t });
  }
}, Uploader.prototype.handleError = function (u, e, t) {
  var r = this;log$1("handleError: ", e), r.parts.failures.indexOf(e) > -1 || (r.updateProgress(0, e, t), r.currentUploads -= 1, r.parts.failures.push(e));
}, Uploader.prototype.waitForAllPartsAttempted = function () {
  var u = this;if (u.parts.uploaded.length + u.parts.failures.length < u.parts.total) return void setTimeout(function () {
    u.waitForAllPartsAttempted();
  }, 100);u.allPartsLoaded() ? u.complete() : u.processRetries();
}, Uploader.prototype.backOffWait = function () {
  var u = this;return 0 === u.attempts ? u.config.retryOptions.minTimeout : Math.min(u.config.retryOptions.maxTimeout, 1e3 * Math.pow(u.config.retryOptions.factor, u.attempts));
}, Uploader.prototype.processRetries = function () {
  var u = this;if (!u.cancelRequested && u.config.retryOptions && u.attempts < u.config.retryOptions.retries) {
    log$1("processRetries called");var e = u.backOffWait();u.currentUploads = 0, u.parts.current = 0, u.parts.failures = [], u.attempts += 1, null !== u.config.onRetry && u.config.onRetry(u.attempts, e), u.uploadData ? setTimeout(function () {
      u.loadNextPart();
    }, e) : setTimeout(function () {
      u.initUpload();
    }, e);
  } else u.cancelRequested ? u.config.onUploadFailedFunction(new Error("Upload cancelled")) : (u.uploadFailed = !0, u.config.onUploadFailedFunction(new Error("Failed to upload after " + u.attempts + " attempt(s).")));
}, Uploader.prototype.complete = function () {
  var u = this;null !== u.config.onUploadCompleteFunction && u.config.onUploadCompleteFunction();var e = { size: u.file.size, filename: u.file.newName || u.file.name, mimetype: u.file.type || "application/octet-stream", parts: u.parts.uploaded.join(";") },
      t = u.createUploadFormData(e),
      r = new XMLHttpRequest();r.onreadystatechange = function () {
    if (4 === r.readyState) if (200 === r.status) null !== u.config.onCompleteFunction && u.config.onCompleteFunction(JSON.parse(r.response));else {
      var e = r.response || "no response. Please check your browser network log for more info";u.config.onUploadFailedFunction(new Error('Upload "complete" failed with API response: ' + e));
    }
  }, r.onerror = function (e) {
    u.config.onUploadFailedFunction(new Error('Upload "complete" failed with network error: ' + e.message));
  }, r.open("POST", u.config.host + "/multipart/complete", !0), r.send(t);
}, Uploader.prototype.createUploadFormData = function (u) {
  var e = this,
      t = new FormData();return t.append("apikey", e.config.apikey), null !== e.storeParams && Object.keys(e.storeParams).forEach(function (u) {
    "" !== e.storeParams[u] && t.append(u, e.storeParams[u]);
  }), null !== e.uploadData && Object.keys(e.uploadData).forEach(function (u) {
    t.append(u, e.uploadData[u]);
  }), u && Object.keys(u).forEach(function (e) {
    t.append(e, u[e]);
  }), t;
}, Uploader.prototype.cancel = function () {
  log$1("upload.cancel() called");var u = this;u.uploadFailed = !0, u.cancelRequested = !0;
}, Uploader.prototype.waitForAllPartsPaused = function () {
  var u = this;if (0 !== u.currentUploads) return void setTimeout(function () {
    u.waitForAllPartsPaused();
  }, 100);null === u.config.onPaused || u.uploadFailed || u.config.onPaused();
}, Uploader.prototype.pause = function () {
  log$1("upload.pause() called");var u = this;u.pauseRequested = !0, null !== u.config.onPaused && setTimeout(function () {
    u.waitForAllPartsPaused();
  }, 100);
}, Uploader.prototype.resume = function () {
  log$1("upload.resume() called"), this.pauseRequested = !1;
};var _upload = function _upload(u, e) {
  var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
      r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
      n = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : {};return log$1("cloud.upload() called:", e), new Promise(function (i, o) {
    var a = Object.assign({}, t, { onCompleteFunction: function onCompleteFunction(u) {
        return i(u);
      }, onUploadFailedFunction: function onUploadFailedFunction(u) {
        return o(u);
      } }),
        s = new Uploader(u, a, r);s.multipartUpload(e), n.cancel = function () {
      s.cancel();
    }, n.pause = function () {
      s.pause();
    }, n.resume = function () {
      s.resume();
    };
  });
}; var init$1 = function init(u, e) {
  if (!u || "string" != typeof u) throw new Error("apikey is required to initialize the Filestack client");if (e && (!e.policy || !e.signature)) throw new Error("signature and policy are both required for security");var t = Object.assign({}, e, { apikey: u });return { getSecurity: function getSecurity() {
      return { policy: t.policy, signature: t.signature };
    }, setSecurity: function setSecurity(u) {
      if (u && (!u.policy || !u.signature)) throw new Error("signature and policy are both required for security");return t.policy = u.policy, t.signature = u.signature, t;
    }, storeURL: function storeURL(u, e, r) {
      return _storeURL(t, u, e, r);
    }, retrieve: function retrieve(u, e) {
      return _retrieve(t, u, e);
    }, remove: function remove(u, e) {
      return _remove(t, u, e);
    }, metadata: function metadata(u, e) {
      return _metadata(t, u, e);
    }, cloud: function cloud(u) {
      return _cloud(t, e, u);
    }, transform: function transform(u, e) {
      return _transform(t, u, e);
    }, upload: function upload(u, e, r, n) {
      return _upload(t, u, e, r, n);
    } };
}; var client = { version: "0.3.5", init: init$1 };

// Logger can be used and required from many places.
// This is global on / off switch for it, which all
// created logger contexts respect.

var onOff$1 = {
  init: function init() {
    window.filestackInternals.logger.working = false;
  },
  isWorking: function isWorking() {
    return window.filestackInternals.logger.working;
  },
  on: function on() {
    window.filestackInternals.logger.working = true;
  },
  off: function off() {
    window.filestackInternals.logger.working = false;
  }
};

/* eslint no-console:0 */

var context$1 = function context(contextName, onOff) {
  var api = function log() {
    for (var _len = arguments.length, stuff = Array(_len), _key = 0; _key < _len; _key++) {
      stuff[_key] = arguments[_key];
    }

    var convertedToStrings = [].concat(stuff).map(function (thing) {
      if ((typeof thing === 'undefined' ? 'undefined' : _typeof(thing)) === 'object') {
        return JSON.stringify(thing, function (key, value) {
          if (typeof value === 'function') {
            // If any function named json is found then call that function to get the json object.
            if (key === 'json') {
              try {
                return value();
              } catch (err) {
                // Throws? No worries. Just go on and return string.
              }
            }
            return '[Function]';
          }
          if (value instanceof File) {
            return '[File name: ' + value.name + ', mimetype: ' + value.type + ', size: ' + value.size + ']';
          }
          return value;
        }, 2);
      }
      return thing;
    });
    if (onOff.isWorking()) {
      var _console;

      (_console = console).log.apply(_console, ['[' + contextName + ']'].concat(toConsumableArray(convertedToStrings)));
    }
  };

  api.context = function (subContextName) {
    return context(contextName + '][' + subContextName, onOff);
  };

  api.on = onOff.on;
  api.off = onOff.off;

  return api;
};

var logger$1 = context$1('filestack', onOff$1);

var initializeGlobalNamespace$1 = function initializeGlobalNamespace() {
  var namespace = void 0;
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
    namespace = window.filestackInternals;
    if (!namespace) {
      namespace = {};
      window.filestackInternals = namespace;
    }
    if (!namespace.logger) {
      namespace.logger = logger$1;
      onOff$1.init();
    }
  }
  return namespace;
};

initializeGlobalNamespace$1();

var picker = createCommonjsModule(function (module, exports) {
  /* v0.5.3 */
  !function (e, t) {
    module.exports = t();
  }(commonjsGlobal, function () {
    function e(e) {
      return null == e ? "" : "object" === (void 0 === e ? "undefined" : pi(e)) ? JSON.stringify(e, null, 2) : String(e);
    }function t(e) {
      var t = parseFloat(e);return isNaN(t) ? e : t;
    }function n(e, t) {
      for (var n = Object.create(null), i = e.split(","), o = 0; o < i.length; o++) {
        n[i[o]] = !0;
      }return t ? function (e) {
        return n[e.toLowerCase()];
      } : function (e) {
        return n[e];
      };
    }function i(e, t) {
      if (e.length) {
        var n = e.indexOf(t);if (n > -1) return e.splice(n, 1);
      }
    }function o(e, t) {
      return vi.call(e, t);
    }function r(e) {
      return "string" == typeof e || "number" == typeof e;
    }function a(e) {
      var t = Object.create(null);return function (n) {
        return t[n] || (t[n] = e(n));
      };
    }function s(e, t) {
      function n(n) {
        var i = arguments.length;return i ? i > 1 ? e.apply(t, arguments) : e.call(t, n) : e.call(t);
      }return n._length = e.length, n;
    }function c(e, t) {
      t = t || 0;for (var n = e.length - t, i = new Array(n); n--;) {
        i[n] = e[n + t];
      }return i;
    }function l(e, t) {
      for (var n in t) {
        e[n] = t[n];
      }return e;
    }function u(e) {
      return null !== e && "object" === (void 0 === e ? "undefined" : pi(e));
    }function d(e) {
      return bi.call(e) === Ci;
    }function f(e) {
      for (var t = {}, n = 0; n < e.length; n++) {
        e[n] && l(t, e[n]);
      }return t;
    }function p() {}function m(e, t) {
      var n = u(e),
          i = u(t);if (!n || !i) return !n && !i && String(e) === String(t);try {
        return JSON.stringify(e) === JSON.stringify(t);
      } catch (n) {
        return e === t;
      }
    }function h(e, t) {
      for (var n = 0; n < e.length; n++) {
        if (m(e[n], t)) return n;
      }return -1;
    }function g(e) {
      var t = !1;return function () {
        t || (t = !0, e());
      };
    }function v(e) {
      var t = (e + "").charCodeAt(0);return 36 === t || 95 === t;
    }function _(e, t, n, i) {
      Object.defineProperty(e, t, { value: n, enumerable: !!i, writable: !0, configurable: !0 });
    }function y(e) {
      if (!wi.test(e)) {
        var t = e.split(".");return function (e) {
          for (var n = 0; n < t.length; n++) {
            if (!e) return;e = e[t[n]];
          }return e;
        };
      }
    }function E(e) {
      return (/native code/.test(e.toString())
      );
    }function b(e) {
      Wi.target && Hi.push(Wi.target), Wi.target = e;
    }function C() {
      Wi.target = Hi.pop();
    }function S(e, t) {
      e.__proto__ = t;
    }function T(e, t, n) {
      for (var i = 0, o = n.length; i < o; i++) {
        var r = n[i];_(e, r, t[r]);
      }
    }function A(e, t) {
      if (u(e)) {
        var n;return o(e, "__ob__") && e.__ob__ instanceof qi ? n = e.__ob__ : Xi.shouldConvert && !Mi() && (Array.isArray(e) || d(e)) && Object.isExtensible(e) && !e._isVue && (n = new qi(e)), t && n && n.vmCount++, n;
      }
    }function F(e, t, n, i) {
      var o = new Wi(),
          r = Object.getOwnPropertyDescriptor(e, t);if (!r || !1 !== r.configurable) {
        var a = r && r.get,
            s = r && r.set,
            c = A(n);Object.defineProperty(e, t, { enumerable: !0, configurable: !0, get: function get$$1() {
            var t = a ? a.call(e) : n;return Wi.target && (o.depend(), c && c.dep.depend(), Array.isArray(t) && O(t)), t;
          }, set: function set$$1(t) {
            var i = a ? a.call(e) : n;t === i || t !== t && i !== i || (s ? s.call(e, t) : n = t, c = A(t), o.notify());
          } });
      }
    }function w(e, t, n) {
      if (Array.isArray(e) && "number" == typeof t) return e.length = Math.max(e.length, t), e.splice(t, 1, n), n;if (o(e, t)) return e[t] = n, n;var i = e.__ob__;return e._isVue || i && i.vmCount ? n : i ? (F(i.value, t, n), i.dep.notify(), n) : (e[t] = n, n);
    }function R(e, t) {
      if (Array.isArray(e) && "number" == typeof t) return void e.splice(t, 1);var n = e.__ob__;e._isVue || n && n.vmCount || o(e, t) && (delete e[t], n && n.dep.notify());
    }function O(e) {
      for (var t = void 0, n = 0, i = e.length; n < i; n++) {
        t = e[n], t && t.__ob__ && t.__ob__.dep.depend(), Array.isArray(t) && O(t);
      }
    }function k(e, t) {
      if (!t) return e;for (var n, i, r, a = Object.keys(t), s = 0; s < a.length; s++) {
        n = a[s], i = e[n], r = t[n], o(e, n) ? d(i) && d(r) && k(i, r) : w(e, n, r);
      }return e;
    }function N(e, t) {
      return t ? e ? e.concat(t) : Array.isArray(t) ? t : [t] : e;
    }function L(e, t) {
      var n = Object.create(e || null);return t ? l(n, t) : n;
    }function I(e) {
      var t = e.props;if (t) {
        var n,
            i,
            o,
            r = {};if (Array.isArray(t)) for (n = t.length; n--;) {
          "string" == typeof (i = t[n]) && (o = _i(i), r[o] = { type: null });
        } else if (d(t)) for (var a in t) {
          i = t[a], o = _i(a), r[o] = d(i) ? i : { type: i };
        }e.props = r;
      }
    }function x(e) {
      var t = e.directives;if (t) for (var n in t) {
        var i = t[n];"function" == typeof i && (t[n] = { bind: i, update: i });
      }
    }function D(e, t, n) {
      function i(i) {
        var o = Ki[i] || Zi;u[i] = o(e[i], t[i], n, i);
      }I(t), x(t);var r = t.extends;if (r && (e = "function" == typeof r ? D(e, r.options, n) : D(e, r, n)), t.mixins) for (var a = 0, s = t.mixins.length; a < s; a++) {
        var c = t.mixins[a];c.prototype instanceof nt && (c = c.options), e = D(e, c, n);
      }var l,
          u = {};for (l in e) {
        i(l);
      }for (l in t) {
        o(e, l) || i(l);
      }return u;
    }function U(e, t, n, i) {
      if ("string" == typeof n) {
        var r = e[t];if (o(r, n)) return r[n];var a = _i(n);if (o(r, a)) return r[a];var s = yi(a);if (o(r, s)) return r[s];var c = r[n] || r[a] || r[s];return c;
      }
    }function M(e, t, n, i) {
      var r = t[e],
          a = !o(n, e),
          s = n[e];if (z(Boolean, r.type) && (a && !o(r, "default") ? s = !1 : z(String, r.type) || "" !== s && s !== Ei(e) || (s = !0)), void 0 === s) {
        s = $(i, r, e);var c = Xi.shouldConvert;Xi.shouldConvert = !0, A(s), Xi.shouldConvert = c;
      }return s;
    }function $(e, t, n) {
      if (o(t, "default")) {
        var i = t.default;return e && e.$options.propsData && void 0 === e.$options.propsData[n] && void 0 !== e._props[n] ? e._props[n] : "function" == typeof i && "Function" !== P(t.type) ? i.call(e) : i;
      }
    }function P(e) {
      var t = e && e.toString().match(/^\s*function (\w+)/);return t && t[1];
    }function z(e, t) {
      if (!Array.isArray(t)) return P(t) === P(e);for (var n = 0, i = t.length; n < i; n++) {
        if (P(t[n]) === P(e)) return !0;
      }return !1;
    }function G(e, t, n) {
      if (Ai.errorHandler) Ai.errorHandler.call(null, e, t, n);else {
        if (!Oi || "undefined" == typeof console) throw e;console.error(e);
      }
    }function j(e) {
      return new Qi(void 0, void 0, void 0, String(e));
    }function W(e) {
      var t = new Qi(e.tag, e.data, e.children, e.text, e.elm, e.context, e.componentOptions);return t.ns = e.ns, t.isStatic = e.isStatic, t.key = e.key, t.isCloned = !0, t;
    }function H(e) {
      for (var t = e.length, n = new Array(t), i = 0; i < t; i++) {
        n[i] = W(e[i]);
      }return n;
    }function B(e) {
      function t() {
        var e = arguments,
            n = t.fns;if (!Array.isArray(n)) return n.apply(null, arguments);for (var i = 0; i < n.length; i++) {
          n[i].apply(null, e);
        }
      }return t.fns = e, t;
    }function V(e, t, n, i, o) {
      var r, a, s, c;for (r in e) {
        a = e[r], s = t[r], c = no(r), a && (s ? a !== s && (s.fns = a, e[r] = s) : (a.fns || (a = e[r] = B(a)), n(c.name, a, c.once, c.capture)));
      }for (r in t) {
        e[r] || (c = no(r), i(c.name, t[r], c.capture));
      }
    }function Y(e, t, n) {
      function o() {
        n.apply(this, arguments), i(r.fns, o);
      }var r,
          a = e[t];a ? a.fns && a.merged ? (r = a, r.fns.push(o)) : r = B([a, o]) : r = B([o]), r.merged = !0, e[t] = r;
    }function X(e) {
      for (var t = 0; t < e.length; t++) {
        if (Array.isArray(e[t])) return Array.prototype.concat.apply([], e);
      }return e;
    }function q(e) {
      return r(e) ? [j(e)] : Array.isArray(e) ? K(e) : void 0;
    }function K(e, t) {
      var n,
          i,
          o,
          a = [];for (n = 0; n < e.length; n++) {
        null != (i = e[n]) && "boolean" != typeof i && (o = a[a.length - 1], Array.isArray(i) ? a.push.apply(a, K(i, (t || "") + "_" + n)) : r(i) ? o && o.text ? o.text += String(i) : "" !== i && a.push(j(i)) : i.text && o && o.text ? a[a.length - 1] = j(o.text + i.text) : (i.tag && null == i.key && null != t && (i.key = "__vlist" + t + "_" + n + "__"), a.push(i)));
      }return a;
    }function Z(e) {
      return e && e.filter(function (e) {
        return e && e.componentOptions;
      })[0];
    }function Q(e) {
      e._events = Object.create(null), e._hasHookEvent = !1;var t = e.$options._parentListeners;t && te(e, t);
    }function J(e, t, n) {
      n ? eo.$once(e, t) : eo.$on(e, t);
    }function ee(e, t) {
      eo.$off(e, t);
    }function te(e, t, n) {
      eo = e, V(t, n || {}, J, ee, e);
    }function ne(e, t) {
      var n = {};if (!e) return n;for (var i, o, r = [], a = 0, s = e.length; a < s; a++) {
        if (o = e[a], (o.context === t || o.functionalContext === t) && o.data && (i = o.data.slot)) {
          var c = n[i] || (n[i] = []);"template" === o.tag ? c.push.apply(c, o.children) : c.push(o);
        } else r.push(o);
      }return r.every(ie) || (n.default = r), n;
    }function ie(e) {
      return e.isComment || " " === e.text;
    }function oe(e) {
      for (var t = {}, n = 0; n < e.length; n++) {
        t[e[n][0]] = e[n][1];
      }return t;
    }function re(e) {
      var t = e.$options,
          n = t.parent;if (n && !t.abstract) {
        for (; n.$options.abstract && n.$parent;) {
          n = n.$parent;
        }n.$children.push(e);
      }e.$parent = n, e.$root = n ? n.$root : e, e.$children = [], e.$refs = {}, e._watcher = null, e._inactive = null, e._directInactive = !1, e._isMounted = !1, e._isDestroyed = !1, e._isBeingDestroyed = !1;
    }function ae(e, t, n) {
      e.$el = t, e.$options.render || (e.$options.render = to), de(e, "beforeMount");var i;return i = function i() {
        e._update(e._render(), n);
      }, e._watcher = new uo(e, i, p), n = !1, null == e.$vnode && (e._isMounted = !0, de(e, "mounted")), e;
    }function se(e, t, n, i, o) {
      var r = !!(o || e.$options._renderChildren || i.data.scopedSlots || e.$scopedSlots !== Fi);if (e.$options._parentVnode = i, e.$vnode = i, e._vnode && (e._vnode.parent = i), e.$options._renderChildren = o, t && e.$options.props) {
        Xi.shouldConvert = !1;for (var a = e._props, s = e.$options._propKeys || [], c = 0; c < s.length; c++) {
          var l = s[c];a[l] = M(l, e.$options.props, t, e);
        }Xi.shouldConvert = !0, e.$options.propsData = t;
      }if (n) {
        var u = e.$options._parentListeners;e.$options._parentListeners = n, te(e, n, u);
      }r && (e.$slots = ne(o, i.context), e.$forceUpdate());
    }function ce(e) {
      for (; e && (e = e.$parent);) {
        if (e._inactive) return !0;
      }return !1;
    }function le(e, t) {
      if (t) {
        if (e._directInactive = !1, ce(e)) return;
      } else if (e._directInactive) return;if (e._inactive || null == e._inactive) {
        e._inactive = !1;for (var n = 0; n < e.$children.length; n++) {
          le(e.$children[n]);
        }de(e, "activated");
      }
    }function ue(e, t) {
      if (!(t && (e._directInactive = !0, ce(e)) || e._inactive)) {
        e._inactive = !0;for (var n = 0; n < e.$children.length; n++) {
          ue(e.$children[n]);
        }de(e, "deactivated");
      }
    }function de(e, t) {
      var n = e.$options[t];if (n) for (var i = 0, o = n.length; i < o; i++) {
        try {
          n[i].call(e);
        } catch (n) {
          G(n, e, t + " hook");
        }
      }e._hasHookEvent && e.$emit("hook:" + t);
    }function fe() {
      oo.length = 0, ro = {}, ao = so = !1;
    }function pe() {
      so = !0;var e, t, n;for (oo.sort(function (e, t) {
        return e.id - t.id;
      }), co = 0; co < oo.length; co++) {
        e = oo[co], t = e.id, ro[t] = null, e.run();
      }var i = oo.slice();for (fe(), co = i.length; co--;) {
        e = i[co], n = e.vm, n._watcher === e && n._isMounted && de(n, "updated");
      }$i && Ai.devtools && $i.emit("flush");
    }function me(e) {
      var t = e.id;if (null == ro[t]) {
        if (ro[t] = !0, so) {
          for (var n = oo.length - 1; n >= 0 && oo[n].id > e.id;) {
            n--;
          }oo.splice(Math.max(n, co) + 1, 0, e);
        } else oo.push(e);ao || (ao = !0, zi(pe));
      }
    }function he(e) {
      fo.clear(), ge(e, fo);
    }function ge(e, t) {
      var n,
          i,
          o = Array.isArray(e);if ((o || u(e)) && Object.isExtensible(e)) {
        if (e.__ob__) {
          var r = e.__ob__.dep.id;if (t.has(r)) return;t.add(r);
        }if (o) for (n = e.length; n--;) {
          ge(e[n], t);
        } else for (i = Object.keys(e), n = i.length; n--;) {
          ge(e[i[n]], t);
        }
      }
    }function ve(e, t, n) {
      po.get = function () {
        return this[t][n];
      }, po.set = function (e) {
        this[t][n] = e;
      }, Object.defineProperty(e, n, po);
    }function _e(e) {
      e._watchers = [];var t = e.$options;t.props && ye(e, t.props), t.methods && Ae(e, t.methods), t.data ? Ee(e) : A(e._data = {}, !0), t.computed && Ce(e, t.computed), t.watch && Fe(e, t.watch);
    }function ye(e, t) {
      var n = e.$options.propsData || {},
          i = e._props = {},
          o = e.$options._propKeys = [],
          r = !e.$parent;Xi.shouldConvert = r;for (var a in t) {
        !function (r) {
          o.push(r);var a = M(r, t, n, e);F(i, r, a), r in e || ve(e, "_props", r);
        }(a);
      }Xi.shouldConvert = !0;
    }function Ee(e) {
      var t = e.$options.data;t = e._data = "function" == typeof t ? be(t, e) : t || {}, d(t) || (t = {});for (var n = Object.keys(t), i = e.$options.props, r = n.length; r--;) {
        i && o(i, n[r]) || v(n[r]) || ve(e, "_data", n[r]);
      }A(t, !0);
    }function be(e, t) {
      try {
        return e.call(t);
      } catch (e) {
        return G(e, t, "data()"), {};
      }
    }function Ce(e, t) {
      var n = e._computedWatchers = Object.create(null);for (var i in t) {
        var o = t[i],
            r = "function" == typeof o ? o : o.get;n[i] = new uo(e, r, p, mo), i in e || Se(e, i, o);
      }
    }function Se(e, t, n) {
      "function" == typeof n ? (po.get = Te(t), po.set = p) : (po.get = n.get ? !1 !== n.cache ? Te(t) : n.get : p, po.set = n.set ? n.set : p), Object.defineProperty(e, t, po);
    }function Te(e) {
      return function () {
        var t = this._computedWatchers && this._computedWatchers[e];if (t) return t.dirty && t.evaluate(), Wi.target && t.depend(), t.value;
      };
    }function Ae(e, t) {
      e.$options.props;for (var n in t) {
        e[n] = null == t[n] ? p : s(t[n], e);
      }
    }function Fe(e, t) {
      for (var n in t) {
        var i = t[n];if (Array.isArray(i)) for (var o = 0; o < i.length; o++) {
          we(e, n, i[o]);
        } else we(e, n, i);
      }
    }function we(e, t, n) {
      var i;d(n) && (i = n, n = n.handler), "string" == typeof n && (n = e[n]), e.$watch(t, n, i);
    }function Re(e, t, n, i, o) {
      if (e) {
        var r = n.$options._base;if (u(e) && (e = r.extend(e)), "function" == typeof e) {
          if (!e.cid) if (e.resolved) e = e.resolved;else if (!(e = Ne(e, r, function () {
            n.$forceUpdate();
          }))) return;Je(e), t = t || {}, t.model && Ue(e.options, t);var a = Le(t, e, o);if (e.options.functional) return Oe(e, a, t, n, i);var s = t.on;t.on = t.nativeOn, e.options.abstract && (t = {}), xe(t);var c = e.options.name || o;return new Qi("vue-component-" + e.cid + (c ? "-" + c : ""), t, void 0, void 0, void 0, n, { Ctor: e, propsData: a, listeners: s, tag: o, children: i });
        }
      }
    }function Oe(e, t, n, i, o) {
      var r = {},
          a = e.options.props;if (a) for (var s in a) {
        r[s] = M(s, a, t);
      }var c = Object.create(i),
          l = function l(e, t, n, i) {
        return Me(c, e, t, n, i, !0);
      },
          u = e.options.render.call(null, l, { props: r, data: n, parent: i, children: o, slots: function slots() {
          return ne(o, i);
        } });return u instanceof Qi && (u.functionalContext = i, n.slot && ((u.data || (u.data = {})).slot = n.slot)), u;
    }function ke(e, t, n, i) {
      var o = e.componentOptions,
          r = { _isComponent: !0, parent: t, propsData: o.propsData, _componentTag: o.tag, _parentVnode: e, _parentListeners: o.listeners, _renderChildren: o.children, _parentElm: n || null, _refElm: i || null },
          a = e.data.inlineTemplate;return a && (r.render = a.render, r.staticRenderFns = a.staticRenderFns), new o.Ctor(r);
    }function Ne(e, t, n) {
      if (!e.requested) {
        e.requested = !0;var i = e.pendingCallbacks = [n],
            o = !0,
            r = function r(n) {
          if (u(n) && (n = t.extend(n)), e.resolved = n, !o) for (var r = 0, a = i.length; r < a; r++) {
            i[r](n);
          }
        },
            a = function a(e) {},
            s = e(r, a);return s && "function" == typeof s.then && !e.resolved && s.then(r, a), o = !1, e.resolved;
      }e.pendingCallbacks.push(n);
    }function Le(e, t, n) {
      var i = t.options.props;if (i) {
        var o = {},
            r = e.attrs,
            a = e.props,
            s = e.domProps;if (r || a || s) for (var c in i) {
          var l = Ei(c);Ie(o, a, c, l, !0) || Ie(o, r, c, l) || Ie(o, s, c, l);
        }return o;
      }
    }function Ie(e, t, n, i, r) {
      if (t) {
        if (o(t, n)) return e[n] = t[n], r || delete t[n], !0;if (o(t, i)) return e[n] = t[i], r || delete t[i], !0;
      }return !1;
    }function xe(e) {
      e.hook || (e.hook = {});for (var t = 0; t < go.length; t++) {
        var n = go[t],
            i = e.hook[n],
            o = ho[n];e.hook[n] = i ? De(o, i) : o;
      }
    }function De(e, t) {
      return function (n, i, o, r) {
        e(n, i, o, r), t(n, i, o, r);
      };
    }function Ue(e, t) {
      var n = e.model && e.model.prop || "value",
          i = e.model && e.model.event || "input";(t.props || (t.props = {}))[n] = t.model.value;var o = t.on || (t.on = {});o[i] ? o[i] = [t.model.callback].concat(o[i]) : o[i] = t.model.callback;
    }function Me(e, t, n, i, o, a) {
      return (Array.isArray(n) || r(n)) && (o = i, i = n, n = void 0), a && (o = _o), $e(e, t, n, i, o);
    }function $e(e, t, n, i, o) {
      if (n && n.__ob__) return to();if (!t) return to();Array.isArray(i) && "function" == typeof i[0] && (n = n || {}, n.scopedSlots = { default: i[0] }, i.length = 0), o === _o ? i = q(i) : o === vo && (i = X(i));var r, a;if ("string" == typeof t) {
        var s;a = Ai.getTagNamespace(t), r = Ai.isReservedTag(t) ? new Qi(Ai.parsePlatformTagName(t), n, i, void 0, void 0, e) : (s = U(e.$options, "components", t)) ? Re(s, n, e, i, t) : new Qi(t, n, i, void 0, void 0, e);
      } else r = Re(t, n, e, i);return r ? (a && Pe(r, a), r) : to();
    }function Pe(e, t) {
      if (e.ns = t, "foreignObject" !== e.tag && e.children) for (var n = 0, i = e.children.length; n < i; n++) {
        var o = e.children[n];o.tag && !o.ns && Pe(o, t);
      }
    }function ze(e, t) {
      var n, i, o, r, a;if (Array.isArray(e) || "string" == typeof e) for (n = new Array(e.length), i = 0, o = e.length; i < o; i++) {
        n[i] = t(e[i], i);
      } else if ("number" == typeof e) for (n = new Array(e), i = 0; i < e; i++) {
        n[i] = t(i + 1, i);
      } else if (u(e)) for (r = Object.keys(e), n = new Array(r.length), i = 0, o = r.length; i < o; i++) {
        a = r[i], n[i] = t(e[a], a, i);
      }return n;
    }function Ge(e, t, n, i) {
      var o = this.$scopedSlots[e];if (o) return n = n || {}, i && l(n, i), o(n) || t;var r = this.$slots[e];return r || t;
    }function je(e) {
      return U(this.$options, "filters", e, !0) || Ti;
    }function We(e, t, n) {
      var i = Ai.keyCodes[t] || n;return Array.isArray(i) ? -1 === i.indexOf(e) : i !== e;
    }function He(e, t, n, i) {
      if (n) if (u(n)) {
        Array.isArray(n) && (n = f(n));var o;for (var r in n) {
          if ("class" === r || "style" === r) o = e;else {
            var a = e.attrs && e.attrs.type;o = i || Ai.mustUseProp(t, a, r) ? e.domProps || (e.domProps = {}) : e.attrs || (e.attrs = {});
          }r in o || (o[r] = n[r]);
        }
      } else ;return e;
    }function Be(e, t) {
      var n = this._staticTrees[e];return n && !t ? Array.isArray(n) ? H(n) : W(n) : (n = this._staticTrees[e] = this.$options.staticRenderFns[e].call(this._renderProxy), Ye(n, "__static__" + e, !1), n);
    }function Ve(e, t, n) {
      return Ye(e, "__once__" + t + (n ? "_" + n : ""), !0), e;
    }function Ye(e, t, n) {
      if (Array.isArray(e)) for (var i = 0; i < e.length; i++) {
        e[i] && "string" != typeof e[i] && Xe(e[i], t + "_" + i, n);
      } else Xe(e, t, n);
    }function Xe(e, t, n) {
      e.isStatic = !0, e.key = t, e.isOnce = n;
    }function qe(e) {
      e.$vnode = null, e._vnode = null, e._staticTrees = null;var t = e.$options._parentVnode,
          n = t && t.context;e.$slots = ne(e.$options._renderChildren, n), e.$scopedSlots = Fi, e._c = function (t, n, i, o) {
        return Me(e, t, n, i, o, !1);
      }, e.$createElement = function (t, n, i, o) {
        return Me(e, t, n, i, o, !0);
      };
    }function Ke(e) {
      var t = e.$options.provide;t && (e._provided = "function" == typeof t ? t.call(e) : t);
    }function Ze(e) {
      var t = e.$options.inject;if (t) for (var n = Array.isArray(t), i = n ? t : Pi ? Reflect.ownKeys(t) : Object.keys(t), o = 0; o < i.length; o++) {
        !function (o) {
          for (var r = i[o], a = n ? r : t[r], s = e; s;) {
            if (s._provided && a in s._provided) {
              F(e, r, s._provided[a]);break;
            }s = s.$parent;
          }
        }(o);
      }
    }function Qe(e, t) {
      var n = e.$options = Object.create(e.constructor.options);n.parent = t.parent, n.propsData = t.propsData, n._parentVnode = t._parentVnode, n._parentListeners = t._parentListeners, n._renderChildren = t._renderChildren, n._componentTag = t._componentTag, n._parentElm = t._parentElm, n._refElm = t._refElm, t.render && (n.render = t.render, n.staticRenderFns = t.staticRenderFns);
    }function Je(e) {
      var t = e.options;if (e.super) {
        var n = Je(e.super);if (n !== e.superOptions) {
          e.superOptions = n;var i = et(e);i && l(e.extendOptions, i), t = e.options = D(n, e.extendOptions), t.name && (t.components[t.name] = e);
        }
      }return t;
    }function et(e) {
      var t,
          n = e.options,
          i = e.sealedOptions;for (var o in n) {
        n[o] !== i[o] && (t || (t = {}), t[o] = tt(n[o], i[o]));
      }return t;
    }function tt(e, t) {
      if (Array.isArray(e)) {
        var n = [];t = Array.isArray(t) ? t : [t];for (var i = 0; i < e.length; i++) {
          t.indexOf(e[i]) < 0 && n.push(e[i]);
        }return n;
      }return e;
    }function nt(e) {
      this._init(e);
    }function it(e) {
      e.use = function (e) {
        if (!e.installed) {
          var t = c(arguments, 1);return t.unshift(this), "function" == typeof e.install ? e.install.apply(e, t) : "function" == typeof e && e.apply(null, t), e.installed = !0, this;
        }
      };
    }function ot(e) {
      e.mixin = function (e) {
        this.options = D(this.options, e);
      };
    }function rt(e) {
      e.cid = 0;var t = 1;e.extend = function (e) {
        e = e || {};var n = this,
            i = n.cid,
            o = e._Ctor || (e._Ctor = {});if (o[i]) return o[i];var r = e.name || n.options.name,
            a = function a(e) {
          this._init(e);
        };return a.prototype = Object.create(n.prototype), a.prototype.constructor = a, a.cid = t++, a.options = D(n.options, e), a.super = n, a.options.props && at(a), a.options.computed && st(a), a.extend = n.extend, a.mixin = n.mixin, a.use = n.use, Ai._assetTypes.forEach(function (e) {
          a[e] = n[e];
        }), r && (a.options.components[r] = a), a.superOptions = n.options, a.extendOptions = e, a.sealedOptions = l({}, a.options), o[i] = a, a;
      };
    }function at(e) {
      var t = e.options.props;for (var n in t) {
        ve(e.prototype, "_props", n);
      }
    }function st(e) {
      var t = e.options.computed;for (var n in t) {
        Se(e.prototype, n, t[n]);
      }
    }function ct(e) {
      Ai._assetTypes.forEach(function (t) {
        e[t] = function (e, n) {
          return n ? ("component" === t && d(n) && (n.name = n.name || e, n = this.options._base.extend(n)), "directive" === t && "function" == typeof n && (n = { bind: n, update: n }), this.options[t + "s"][e] = n, n) : this.options[t + "s"][e];
        };
      });
    }function lt(e) {
      return e && (e.Ctor.options.name || e.tag);
    }function ut(e, t) {
      return "string" == typeof e ? e.split(",").indexOf(t) > -1 : e instanceof RegExp && e.test(t);
    }function dt(e, t) {
      for (var n in e) {
        var i = e[n];if (i) {
          var o = lt(i.componentOptions);o && !t(o) && (ft(i), e[n] = null);
        }
      }
    }function ft(e) {
      e && (e.componentInstance._inactive || de(e.componentInstance, "deactivated"), e.componentInstance.$destroy());
    }function pt(e) {
      for (var t = e.data, n = e, i = e; i.componentInstance;) {
        i = i.componentInstance._vnode, i.data && (t = mt(i.data, t));
      }for (; n = n.parent;) {
        n.data && (t = mt(t, n.data));
      }return ht(t);
    }function mt(e, t) {
      return { staticClass: gt(e.staticClass, t.staticClass), class: e.class ? [e.class, t.class] : t.class };
    }function ht(e) {
      var t = e.class,
          n = e.staticClass;return n || t ? gt(n, vt(t)) : "";
    }function gt(e, t) {
      return e ? t ? e + " " + t : e : t || "";
    }function vt(e) {
      var t = "";if (!e) return t;if ("string" == typeof e) return e;if (Array.isArray(e)) {
        for (var n, i = 0, o = e.length; i < o; i++) {
          e[i] && (n = vt(e[i])) && (t += n + " ");
        }return t.slice(0, -1);
      }if (u(e)) {
        for (var r in e) {
          e[r] && (t += r + " ");
        }return t.slice(0, -1);
      }return t;
    }function _t(e) {
      return Do(e) ? "svg" : "math" === e ? "math" : void 0;
    }function yt(e) {
      if (!Oi) return !0;if (Uo(e)) return !1;if (e = e.toLowerCase(), null != Mo[e]) return Mo[e];var t = document.createElement(e);return e.indexOf("-") > -1 ? Mo[e] = t.constructor === window.HTMLUnknownElement || t.constructor === window.HTMLElement : Mo[e] = /HTMLUnknownElement/.test(t.toString());
    }function Et(e) {
      if ("string" == typeof e) {
        var t = document.querySelector(e);return t || document.createElement("div");
      }return e;
    }function bt(e, t) {
      var n = document.createElement(e);return "select" !== e ? n : (t.data && t.data.attrs && void 0 !== t.data.attrs.multiple && n.setAttribute("multiple", "multiple"), n);
    }function Ct(e, t) {
      return document.createElementNS(Io[e], t);
    }function St(e) {
      return document.createTextNode(e);
    }function Tt(e) {
      return document.createComment(e);
    }function At(e, t, n) {
      e.insertBefore(t, n);
    }function Ft(e, t) {
      e.removeChild(t);
    }function wt(e, t) {
      e.appendChild(t);
    }function Rt(e) {
      return e.parentNode;
    }function Ot(e) {
      return e.nextSibling;
    }function kt(e) {
      return e.tagName;
    }function Nt(e, t) {
      e.textContent = t;
    }function Lt(e, t, n) {
      e.setAttribute(t, n);
    }function It(e, t) {
      var n = e.data.ref;if (n) {
        var o = e.context,
            r = e.componentInstance || e.elm,
            a = o.$refs;t ? Array.isArray(a[n]) ? i(a[n], r) : a[n] === r && (a[n] = void 0) : e.data.refInFor ? Array.isArray(a[n]) && a[n].indexOf(r) < 0 ? a[n].push(r) : a[n] = [r] : a[n] = r;
      }
    }function xt(e) {
      return void 0 === e || null === e;
    }function Dt(e) {
      return void 0 !== e && null !== e;
    }function Ut(e) {
      return !0 === e;
    }function Mt(e, t) {
      return e.key === t.key && e.tag === t.tag && e.isComment === t.isComment && Dt(e.data) === Dt(t.data) && $t(e, t);
    }function $t(e, t) {
      if ("input" !== e.tag) return !0;var n;return (Dt(n = e.data) && Dt(n = n.attrs) && n.type) === (Dt(n = t.data) && Dt(n = n.attrs) && n.type);
    }function Pt(e, t, n) {
      var i,
          o,
          r = {};for (i = t; i <= n; ++i) {
        o = e[i].key, Dt(o) && (r[o] = i);
      }return r;
    }function zt(e, t) {
      (e.data.directives || t.data.directives) && Gt(e, t);
    }function Gt(e, t) {
      var n,
          i,
          o,
          r = e === zo,
          a = t === zo,
          s = jt(e.data.directives, e.context),
          c = jt(t.data.directives, t.context),
          l = [],
          u = [];for (n in c) {
        i = s[n], o = c[n], i ? (o.oldValue = i.value, Ht(o, "update", t, e), o.def && o.def.componentUpdated && u.push(o)) : (Ht(o, "bind", t, e), o.def && o.def.inserted && l.push(o));
      }if (l.length) {
        var d = function d() {
          for (var n = 0; n < l.length; n++) {
            Ht(l[n], "inserted", t, e);
          }
        };r ? Y(t.data.hook || (t.data.hook = {}), "insert", d) : d();
      }if (u.length && Y(t.data.hook || (t.data.hook = {}), "postpatch", function () {
        for (var n = 0; n < u.length; n++) {
          Ht(u[n], "componentUpdated", t, e);
        }
      }), !r) for (n in s) {
        c[n] || Ht(s[n], "unbind", e, e, a);
      }
    }function jt(e, t) {
      var n = Object.create(null);if (!e) return n;var i, o;for (i = 0; i < e.length; i++) {
        o = e[i], o.modifiers || (o.modifiers = Wo), n[Wt(o)] = o, o.def = U(t.$options, "directives", o.name, !0);
      }return n;
    }function Wt(e) {
      return e.rawName || e.name + "." + Object.keys(e.modifiers || {}).join(".");
    }function Ht(e, t, n, i, o) {
      var r = e.def && e.def[t];r && r(n.elm, e, n, i, o);
    }function Bt(e, t) {
      if (e.data.attrs || t.data.attrs) {
        var n,
            i,
            o = t.elm,
            r = e.data.attrs || {},
            a = t.data.attrs || {};a.__ob__ && (a = t.data.attrs = l({}, a));for (n in a) {
          i = a[n], r[n] !== i && Vt(o, n, i);
        }Li && a.value !== r.value && Vt(o, "value", a.value);for (n in r) {
          null == a[n] && (ko(n) ? o.removeAttributeNS(Oo, No(n)) : wo(n) || o.removeAttribute(n));
        }
      }
    }function Vt(e, t, n) {
      Ro(t) ? Lo(n) ? e.removeAttribute(t) : e.setAttribute(t, t) : wo(t) ? e.setAttribute(t, Lo(n) || "false" === n ? "false" : "true") : ko(t) ? Lo(n) ? e.removeAttributeNS(Oo, No(t)) : e.setAttributeNS(Oo, t, n) : Lo(n) ? e.removeAttribute(t) : e.setAttribute(t, n);
    }function Yt(e, t) {
      var n = t.elm,
          i = t.data,
          o = e.data;if (i.staticClass || i.class || o && (o.staticClass || o.class)) {
        var r = pt(t),
            a = n._transitionClasses;a && (r = gt(r, vt(a))), r !== n._prevClass && (n.setAttribute("class", r), n._prevClass = r);
      }
    }function Xt(e) {
      var t;e[Yo] && (t = Ni ? "change" : "input", e[t] = [].concat(e[Yo], e[t] || []), delete e[Yo]), e[Xo] && (t = Ui ? "click" : "change", e[t] = [].concat(e[Xo], e[t] || []), delete e[Xo]);
    }function qt(e, _t2, n, i) {
      if (n) {
        var o = _t2,
            r = So;_t2 = function t(n) {
          null !== (1 === arguments.length ? o(n) : o.apply(null, arguments)) && Kt(e, _t2, i, r);
        };
      }So.addEventListener(e, _t2, i);
    }function Kt(e, t, n, i) {
      (i || So).removeEventListener(e, t, n);
    }function Zt(e, t) {
      if (e.data.on || t.data.on) {
        var n = t.data.on || {},
            i = e.data.on || {};So = t.elm, Xt(n), V(n, i, qt, Kt, t.context);
      }
    }function Qt(e, t) {
      if (e.data.domProps || t.data.domProps) {
        var n,
            i,
            o = t.elm,
            r = e.data.domProps || {},
            a = t.data.domProps || {};a.__ob__ && (a = t.data.domProps = l({}, a));for (n in r) {
          null == a[n] && (o[n] = "");
        }for (n in a) {
          if (i = a[n], "textContent" !== n && "innerHTML" !== n || (t.children && (t.children.length = 0), i !== r[n])) if ("value" === n) {
            o._value = i;var s = null == i ? "" : String(i);Jt(o, t, s) && (o.value = s);
          } else o[n] = i;
        }
      }
    }function Jt(e, t, n) {
      return !e.composing && ("option" === t.tag || en(e, n) || tn(e, n));
    }function en(e, t) {
      return document.activeElement !== e && e.value !== t;
    }function tn(e, n) {
      var i = e.value,
          o = e._vModifiers;return o && o.number || "number" === e.type ? t(i) !== t(n) : o && o.trim ? i.trim() !== n.trim() : i !== n;
    }function nn(e) {
      var t = on(e.style);return e.staticStyle ? l(e.staticStyle, t) : t;
    }function on(e) {
      return Array.isArray(e) ? f(e) : "string" == typeof e ? Zo(e) : e;
    }function rn(e, t) {
      var n,
          i = {};if (t) for (var o = e; o.componentInstance;) {
        o = o.componentInstance._vnode, o.data && (n = nn(o.data)) && l(i, n);
      }(n = nn(e.data)) && l(i, n);for (var r = e; r = r.parent;) {
        r.data && (n = nn(r.data)) && l(i, n);
      }return i;
    }function an(e, t) {
      var n = t.data,
          i = e.data;if (n.staticStyle || n.style || i.staticStyle || i.style) {
        var o,
            r,
            a = t.elm,
            s = e.data.staticStyle,
            c = e.data.style || {},
            u = s || c,
            d = on(t.data.style) || {};t.data.style = d.__ob__ ? l({}, d) : d;var f = rn(t, !0);for (r in u) {
          null == f[r] && er(a, r, "");
        }for (r in f) {
          (o = f[r]) !== u[r] && er(a, r, null == o ? "" : o);
        }
      }
    }function sn(e, t) {
      if (t && (t = t.trim())) if (e.classList) t.indexOf(" ") > -1 ? t.split(/\s+/).forEach(function (t) {
        return e.classList.add(t);
      }) : e.classList.add(t);else {
        var n = " " + (e.getAttribute("class") || "") + " ";n.indexOf(" " + t + " ") < 0 && e.setAttribute("class", (n + t).trim());
      }
    }function cn(e, t) {
      if (t && (t = t.trim())) if (e.classList) t.indexOf(" ") > -1 ? t.split(/\s+/).forEach(function (t) {
        return e.classList.remove(t);
      }) : e.classList.remove(t);else {
        for (var n = " " + (e.getAttribute("class") || "") + " ", i = " " + t + " "; n.indexOf(i) >= 0;) {
          n = n.replace(i, " ");
        }e.setAttribute("class", n.trim());
      }
    }function ln(e) {
      if (e) {
        if ("object" === (void 0 === e ? "undefined" : pi(e))) {
          var t = {};return !1 !== e.css && l(t, or(e.name || "v")), l(t, e), t;
        }return "string" == typeof e ? or(e) : void 0;
      }
    }function un(e) {
      fr(function () {
        fr(e);
      });
    }function dn(e, t) {
      (e._transitionClasses || (e._transitionClasses = [])).push(t), sn(e, t);
    }function fn(e, t) {
      e._transitionClasses && i(e._transitionClasses, t), cn(e, t);
    }function pn(e, t, n) {
      var i = mn(e, t),
          o = i.type,
          r = i.timeout,
          a = i.propCount;if (!o) return n();var s = o === ar ? lr : dr,
          c = 0,
          l = function l() {
        e.removeEventListener(s, u), n();
      },
          u = function u(t) {
        t.target === e && ++c >= a && l();
      };setTimeout(function () {
        c < a && l();
      }, r + 1), e.addEventListener(s, u);
    }function mn(e, t) {
      var n,
          i = window.getComputedStyle(e),
          o = i[cr + "Delay"].split(", "),
          r = i[cr + "Duration"].split(", "),
          a = hn(o, r),
          s = i[ur + "Delay"].split(", "),
          c = i[ur + "Duration"].split(", "),
          l = hn(s, c),
          u = 0,
          d = 0;return t === ar ? a > 0 && (n = ar, u = a, d = r.length) : t === sr ? l > 0 && (n = sr, u = l, d = c.length) : (u = Math.max(a, l), n = u > 0 ? a > l ? ar : sr : null, d = n ? n === ar ? r.length : c.length : 0), { type: n, timeout: u, propCount: d, hasTransform: n === ar && pr.test(i[cr + "Property"]) };
    }function hn(e, t) {
      for (; e.length < t.length;) {
        e = e.concat(e);
      }return Math.max.apply(null, t.map(function (t, n) {
        return gn(t) + gn(e[n]);
      }));
    }function gn(e) {
      return 1e3 * Number(e.slice(0, -1));
    }function vn(e, n) {
      var i = e.elm;i._leaveCb && (i._leaveCb.cancelled = !0, i._leaveCb());var o = ln(e.data.transition);if (o && !i._enterCb && 1 === i.nodeType) {
        for (var r = o.css, a = o.type, s = o.enterClass, c = o.enterToClass, l = o.enterActiveClass, d = o.appearClass, f = o.appearToClass, p = o.appearActiveClass, m = o.beforeEnter, h = o.enter, v = o.afterEnter, _ = o.enterCancelled, y = o.beforeAppear, E = o.appear, b = o.afterAppear, C = o.appearCancelled, S = o.duration, T = io, A = io.$vnode; A && A.parent;) {
          A = A.parent, T = A.context;
        }var F = !T._isMounted || !e.isRootInsert;if (!F || E || "" === E) {
          var w = F && d ? d : s,
              R = F && p ? p : l,
              O = F && f ? f : c,
              k = F ? y || m : m,
              N = F && "function" == typeof E ? E : h,
              L = F ? b || v : v,
              I = F ? C || _ : _,
              x = t(u(S) ? S.enter : S),
              D = !1 !== r && !Li,
              U = En(N),
              M = i._enterCb = g(function () {
            D && (fn(i, O), fn(i, R)), M.cancelled ? (D && fn(i, w), I && I(i)) : L && L(i), i._enterCb = null;
          });e.data.show || Y(e.data.hook || (e.data.hook = {}), "insert", function () {
            var t = i.parentNode,
                n = t && t._pending && t._pending[e.key];n && n.tag === e.tag && n.elm._leaveCb && n.elm._leaveCb(), N && N(i, M);
          }), k && k(i), D && (dn(i, w), dn(i, R), un(function () {
            dn(i, O), fn(i, w), M.cancelled || U || (yn(x) ? setTimeout(M, x) : pn(i, a, M));
          })), e.data.show && (n && n(), N && N(i, M)), D || U || M();
        }
      }
    }function _n(e, n) {
      function i() {
        C.cancelled || (e.data.show || ((o.parentNode._pending || (o.parentNode._pending = {}))[e.key] = e), f && f(o), y && (dn(o, c), dn(o, d), un(function () {
          dn(o, l), fn(o, c), C.cancelled || E || (yn(b) ? setTimeout(C, b) : pn(o, s, C));
        })), p && p(o, C), y || E || C());
      }var o = e.elm;o._enterCb && (o._enterCb.cancelled = !0, o._enterCb());var r = ln(e.data.transition);if (!r) return n();if (!o._leaveCb && 1 === o.nodeType) {
        var a = r.css,
            s = r.type,
            c = r.leaveClass,
            l = r.leaveToClass,
            d = r.leaveActiveClass,
            f = r.beforeLeave,
            p = r.leave,
            m = r.afterLeave,
            h = r.leaveCancelled,
            v = r.delayLeave,
            _ = r.duration,
            y = !1 !== a && !Li,
            E = En(p),
            b = t(u(_) ? _.leave : _),
            C = o._leaveCb = g(function () {
          o.parentNode && o.parentNode._pending && (o.parentNode._pending[e.key] = null), y && (fn(o, l), fn(o, d)), C.cancelled ? (y && fn(o, c), h && h(o)) : (n(), m && m(o)), o._leaveCb = null;
        });v ? v(i) : i();
      }
    }function yn(e) {
      return "number" == typeof e && !isNaN(e);
    }function En(e) {
      if (!e) return !1;var t = e.fns;return t ? En(Array.isArray(t) ? t[0] : t) : (e._length || e.length) > 1;
    }function bn(e, t) {
      t.data.show || vn(t);
    }function Cn(e, t, n) {
      var i = t.value,
          o = e.multiple;if (!o || Array.isArray(i)) {
        for (var r, a, s = 0, c = e.options.length; s < c; s++) {
          if (a = e.options[s], o) r = h(i, Tn(a)) > -1, a.selected !== r && (a.selected = r);else if (m(Tn(a), i)) return void (e.selectedIndex !== s && (e.selectedIndex = s));
        }o || (e.selectedIndex = -1);
      }
    }function Sn(e, t) {
      for (var n = 0, i = t.length; n < i; n++) {
        if (m(Tn(t[n]), e)) return !1;
      }return !0;
    }function Tn(e) {
      return "_value" in e ? e._value : e.value;
    }function An(e) {
      e.target.composing = !0;
    }function Fn(e) {
      e.target.composing = !1, wn(e.target, "input");
    }function wn(e, t) {
      var n = document.createEvent("HTMLEvents");n.initEvent(t, !0, !0), e.dispatchEvent(n);
    }function Rn(e) {
      return !e.componentInstance || e.data && e.data.transition ? e : Rn(e.componentInstance._vnode);
    }function On(e) {
      var t = e && e.componentOptions;return t && t.Ctor.options.abstract ? On(Z(t.children)) : e;
    }function kn(e) {
      var t = {},
          n = e.$options;for (var i in n.propsData) {
        t[i] = e[i];
      }var o = n._parentListeners;for (var r in o) {
        t[_i(r)] = o[r];
      }return t;
    }function Nn(e, t) {
      return (/\d-keep-alive$/.test(t.tag) ? e("keep-alive") : null
      );
    }function Ln(e) {
      for (; e = e.parent;) {
        if (e.data.transition) return !0;
      }
    }function In(e, t) {
      return t.key === e.key && t.tag === e.tag;
    }function xn(e) {
      e.elm._moveCb && e.elm._moveCb(), e.elm._enterCb && e.elm._enterCb();
    }function Dn(e) {
      e.data.newPos = e.elm.getBoundingClientRect();
    }function Un(e) {
      var t = e.data.pos,
          n = e.data.newPos,
          i = t.left - n.left,
          o = t.top - n.top;if (i || o) {
        e.data.moved = !0;var r = e.elm.style;r.transform = r.WebkitTransform = "translate(" + i + "px," + o + "px)", r.transitionDuration = "0s";
      }
    }function Mn(e) {
      Mr && (e._devtoolHook = Mr, Mr.emit("vuex:init", e), Mr.on("vuex:travel-to-state", function (t) {
        e.replaceState(t);
      }), e.subscribe(function (e, t) {
        Mr.emit("vuex:mutation", e, t);
      }));
    }function $n(e, t) {
      Object.keys(e).forEach(function (n) {
        return t(e[n], n);
      });
    }function Pn(e) {
      return null !== e && "object" === (void 0 === e ? "undefined" : pi(e));
    }function zn(e) {
      return e && "function" == typeof e.then;
    }function Gn(e, t) {
      if (!e) throw new Error("[vuex] " + t);
    }function jn(e, t) {
      if (e.update(t), t.modules) for (var n in t.modules) {
        if (!e.getChild(n)) return void console.warn("[vuex] trying to add a new module '" + n + "' on hot reloading, manual reload is needed");jn(e.getChild(n), t.modules[n]);
      }
    }function Wn(e, t) {
      e._actions = Object.create(null), e._mutations = Object.create(null), e._wrappedGetters = Object.create(null), e._modulesNamespaceMap = Object.create(null);var n = e.state;Bn(e, n, [], e._modules.root, !0), Hn(e, n, t);
    }function Hn(e, t, n) {
      var i = e._vm;e.getters = {};var o = e._wrappedGetters,
          r = {};$n(o, function (t, n) {
        r[n] = function () {
          return t(e);
        }, Object.defineProperty(e.getters, n, { get: function get$$1() {
            return e._vm[n];
          }, enumerable: !0 });
      });var a = Gr.config.silent;Gr.config.silent = !0, e._vm = new Gr({ data: { $$state: t }, computed: r }), Gr.config.silent = a, e.strict && Zn(e), i && (n && e._withCommit(function () {
        i._data.$$state = null;
      }), Gr.nextTick(function () {
        return i.$destroy();
      }));
    }function Bn(e, t, n, i, o) {
      var r = !n.length,
          a = e._modules.getNamespace(n);if (i.namespaced && (e._modulesNamespaceMap[a] = i), !r && !o) {
        var s = Qn(t, n.slice(0, -1)),
            c = n[n.length - 1];e._withCommit(function () {
          Gr.set(s, c, i.state);
        });
      }var l = i.context = Vn(e, a, n);i.forEachMutation(function (t, n) {
        Xn(e, a + n, t, l);
      }), i.forEachAction(function (t, n) {
        qn(e, a + n, t, l);
      }), i.forEachGetter(function (t, n) {
        Kn(e, a + n, t, l);
      }), i.forEachChild(function (i, r) {
        Bn(e, t, n.concat(r), i, o);
      });
    }function Vn(e, t, n) {
      var i = "" === t,
          o = { dispatch: i ? e.dispatch : function (n, i, o) {
          var r = Jn(n, i, o),
              a = r.payload,
              s = r.options,
              c = r.type;return s && s.root || (c = t + c, e._actions[c]) ? e.dispatch(c, a) : void console.error("[vuex] unknown local action type: " + r.type + ", global type: " + c);
        }, commit: i ? e.commit : function (n, i, o) {
          var r = Jn(n, i, o),
              a = r.payload,
              s = r.options,
              c = r.type;if (!(s && s.root || (c = t + c, e._mutations[c]))) return void console.error("[vuex] unknown local mutation type: " + r.type + ", global type: " + c);e.commit(c, a, s);
        } };return Object.defineProperties(o, { getters: { get: i ? function () {
            return e.getters;
          } : function () {
            return Yn(e, t);
          } }, state: { get: function get$$1() {
            return Qn(e.state, n);
          } } }), o;
    }function Yn(e, t) {
      var n = {},
          i = t.length;return Object.keys(e.getters).forEach(function (o) {
        if (o.slice(0, i) === t) {
          var r = o.slice(i);Object.defineProperty(n, r, { get: function get$$1() {
              return e.getters[o];
            }, enumerable: !0 });
        }
      }), n;
    }function Xn(e, t, n, i) {
      (e._mutations[t] || (e._mutations[t] = [])).push(function (e) {
        n(i.state, e);
      });
    }function qn(e, t, n, i) {
      (e._actions[t] || (e._actions[t] = [])).push(function (t, o) {
        var r = n({ dispatch: i.dispatch, commit: i.commit, getters: i.getters, state: i.state, rootGetters: e.getters, rootState: e.state }, t, o);return zn(r) || (r = Promise.resolve(r)), e._devtoolHook ? r.catch(function (t) {
          throw e._devtoolHook.emit("vuex:error", t), t;
        }) : r;
      });
    }function Kn(e, t, n, i) {
      if (e._wrappedGetters[t]) return void console.error("[vuex] duplicate getter key: " + t);e._wrappedGetters[t] = function (e) {
        return n(i.state, i.getters, e.state, e.getters);
      };
    }function Zn(e) {
      e._vm.$watch(function () {
        return this._data.$$state;
      }, function () {
        Gn(e._committing, "Do not mutate vuex store state outside mutation handlers.");
      }, { deep: !0, sync: !0 });
    }function Qn(e, t) {
      return t.length ? t.reduce(function (e, t) {
        return e[t];
      }, e) : e;
    }function Jn(e, t, n) {
      return Pn(e) && e.type && (n = t, t = e, e = e.type), Gn("string" == typeof e, "Expects string as the type, but found " + (void 0 === e ? "undefined" : pi(e)) + "."), { type: e, payload: t, options: n };
    }function ei(e) {
      if (Gr) return void console.error("[vuex] already installed. Vue.use(Vuex) should be called only once.");Gr = e, Ur(Gr);
    }function ti(e) {
      return Array.isArray(e) ? e.map(function (e) {
        return { key: e, val: e };
      }) : Object.keys(e).map(function (t) {
        return { key: t, val: e[t] };
      });
    }function ni(e) {
      return function (t, n) {
        return "string" != typeof t ? (n = t, t = "") : "/" !== t.charAt(t.length - 1) && (t += "/"), e(t, n);
      };
    }function ii(e, t, n) {
      var i = e._modulesNamespaceMap[n];return i || console.error("[vuex] module namespace not found in " + t + "(): " + n), i;
    }function oi(e, t, n) {
      function i(t) {
        var n = f,
            i = p;return f = p = void 0, _ = t, h = e.apply(i, n);
      }function o(e) {
        return _ = e, g = setTimeout(s, t), y ? i(e) : h;
      }function r(e) {
        var n = e - v,
            i = e - _,
            o = t - n;return E ? vs(o, m - i) : o;
      }function a(e) {
        var n = e - v,
            i = e - _;return void 0 === v || n >= t || n < 0 || E && i >= m;
      }function s() {
        var e = _s();if (a(e)) return c(e);g = setTimeout(s, r(e));
      }function c(e) {
        return g = void 0, b && f ? i(e) : (f = p = void 0, h);
      }function l() {
        void 0 !== g && clearTimeout(g), _ = 0, f = v = p = g = void 0;
      }function u() {
        return void 0 === g ? h : c(_s());
      }function d() {
        var e = _s(),
            n = a(e);if (f = arguments, p = this, v = e, n) {
          if (void 0 === g) return o(v);if (E) return g = setTimeout(s, t), i(v);
        }return void 0 === g && (g = setTimeout(s, t)), h;
      }var f,
          p,
          m,
          h,
          g,
          v,
          _ = 0,
          y = !1,
          E = !1,
          b = !0;if ("function" != typeof e) throw new TypeError(is);return t = li(t) || 0, ai(n) && (y = !!n.leading, E = "maxWait" in n, m = E ? gs(li(n.maxWait) || 0, t) : m, b = "trailing" in n ? !!n.trailing : b), d.cancel = l, d.flush = u, d;
    }function ri(e, t, n) {
      var i = !0,
          o = !0;if ("function" != typeof e) throw new TypeError(is);return ai(n) && (i = "leading" in n ? !!n.leading : i, o = "trailing" in n ? !!n.trailing : o), oi(e, t, { leading: i, maxWait: t, trailing: o });
    }function ai(e) {
      var t = void 0 === e ? "undefined" : pi(e);return !!e && ("object" == t || "function" == t);
    }function si(e) {
      return !!e && "object" == (void 0 === e ? "undefined" : pi(e));
    }function ci(e) {
      return "symbol" == (void 0 === e ? "undefined" : pi(e)) || si(e) && hs.call(e) == rs;
    }function li(e) {
      if ("number" == typeof e) return e;if (ci(e)) return os;if (ai(e)) {
        var t = "function" == typeof e.valueOf ? e.valueOf() : e;e = ai(t) ? t + "" : t;
      }if ("string" != typeof e) return 0 === e ? e : +e;e = e.replace(as, "");var n = cs.test(e);return n || ls.test(e) ? us(e.slice(2), n ? 2 : 8) : ss.test(e) ? os : +e;
    }var ui,
        di,
        fi = { css: { main: "https://static.filestackapi.com/picker/v3/0.5.3/main.css" } },
        pi = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
      return typeof e === 'undefined' ? 'undefined' : _typeof(e);
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === 'undefined' ? 'undefined' : _typeof(e);
    },
        mi = function mi(e, t, n) {
      return t in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
    },
        hi = Object.assign || function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];for (var i in n) {
          Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
        }
      }return e;
    },
        gi = function gi(e) {
      if (Array.isArray(e)) {
        for (var t = 0, n = Array(e.length); t < e.length; t++) {
          n[t] = e[t];
        }return n;
      }return Array.from(e);
    },
        vi = (n("slot,component", !0), Object.prototype.hasOwnProperty),
        _i = a(function (e) {
      return e.replace(/-(\w)/g, function (e, t) {
        return t ? t.toUpperCase() : "";
      });
    }),
        yi = a(function (e) {
      return e.charAt(0).toUpperCase() + e.slice(1);
    }),
        Ei = a(function (e) {
      return e.replace(/([^-])([A-Z])/g, "$1-$2").replace(/([^-])([A-Z])/g, "$1-$2").toLowerCase();
    }),
        bi = Object.prototype.toString,
        Ci = "[object Object]",
        Si = function Si() {
      return !1;
    },
        Ti = function Ti(e) {
      return e;
    },
        Ai = { optionMergeStrategies: Object.create(null), silent: !1, productionTip: !1, devtools: !1, performance: !1, errorHandler: null, ignoredElements: [], keyCodes: Object.create(null), isReservedTag: Si, isUnknownElement: Si, getTagNamespace: p, parsePlatformTagName: Ti, mustUseProp: Si, _assetTypes: ["component", "directive", "filter"], _lifecycleHooks: ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestroy", "destroyed", "activated", "deactivated"], _maxUpdateCount: 100 },
        Fi = Object.freeze({}),
        wi = /[^\w.$]/,
        Ri = "__proto__" in {},
        Oi = "undefined" != typeof window,
        ki = Oi && window.navigator.userAgent.toLowerCase(),
        Ni = ki && /msie|trident/.test(ki),
        Li = ki && ki.indexOf("msie 9.0") > 0,
        Ii = ki && ki.indexOf("edge/") > 0,
        xi = ki && ki.indexOf("android") > 0,
        Di = ki && /iphone|ipad|ipod|ios/.test(ki),
        Ui = ki && /chrome\/\d+/.test(ki) && !Ii,
        Mi = function Mi() {
      return void 0 === ui && (ui = !Oi && "undefined" != typeof commonjsGlobal && "server" === commonjsGlobal.process.env.VUE_ENV), ui;
    },
        $i = Oi && window.__VUE_DEVTOOLS_GLOBAL_HOOK__,
        Pi = "undefined" != typeof Symbol && E(Symbol) && "undefined" != typeof Reflect && E(Reflect.ownKeys),
        zi = function () {
      function e() {
        i = !1;var e = n.slice(0);n.length = 0;for (var t = 0; t < e.length; t++) {
          e[t]();
        }
      }var t,
          n = [],
          i = !1;if ("undefined" != typeof Promise && E(Promise)) {
        var o = Promise.resolve(),
            r = function r(e) {
          console.error(e);
        };t = function t() {
          o.then(e).catch(r), Di && setTimeout(p);
        };
      } else if ("undefined" == typeof MutationObserver || !E(MutationObserver) && "[object MutationObserverConstructor]" !== MutationObserver.toString()) t = function t() {
        setTimeout(e, 0);
      };else {
        var a = 1,
            s = new MutationObserver(e),
            c = document.createTextNode(String(a));s.observe(c, { characterData: !0 }), t = function t() {
          a = (a + 1) % 2, c.data = String(a);
        };
      }return function (e, o) {
        var r;if (n.push(function () {
          e && e.call(o), r && r(o);
        }), i || (i = !0, t()), !e && "undefined" != typeof Promise) return new Promise(function (e) {
          r = e;
        });
      };
    }();di = "undefined" != typeof Set && E(Set) ? Set : function () {
      function e() {
        this.set = Object.create(null);
      }return e.prototype.has = function (e) {
        return !0 === this.set[e];
      }, e.prototype.add = function (e) {
        this.set[e] = !0;
      }, e.prototype.clear = function () {
        this.set = Object.create(null);
      }, e;
    }();var Gi = p,
        ji = 0,
        Wi = function Wi() {
      this.id = ji++, this.subs = [];
    };Wi.prototype.addSub = function (e) {
      this.subs.push(e);
    }, Wi.prototype.removeSub = function (e) {
      i(this.subs, e);
    }, Wi.prototype.depend = function () {
      Wi.target && Wi.target.addDep(this);
    }, Wi.prototype.notify = function () {
      for (var e = this.subs.slice(), t = 0, n = e.length; t < n; t++) {
        e[t].update();
      }
    }, Wi.target = null;var Hi = [],
        Bi = Array.prototype,
        Vi = Object.create(Bi);["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(function (e) {
      var t = Bi[e];_(Vi, e, function () {
        for (var n = arguments, i = arguments.length, o = new Array(i); i--;) {
          o[i] = n[i];
        }var r,
            a = t.apply(this, o),
            s = this.__ob__;switch (e) {case "push":case "unshift":
            r = o;break;case "splice":
            r = o.slice(2);}return r && s.observeArray(r), s.dep.notify(), a;
      });
    });var Yi = Object.getOwnPropertyNames(Vi),
        Xi = { shouldConvert: !0, isSettingProps: !1 },
        qi = function qi(e) {
      if (this.value = e, this.dep = new Wi(), this.vmCount = 0, _(e, "__ob__", this), Array.isArray(e)) {
        (Ri ? S : T)(e, Vi, Yi), this.observeArray(e);
      } else this.walk(e);
    };qi.prototype.walk = function (e) {
      for (var t = Object.keys(e), n = 0; n < t.length; n++) {
        F(e, t[n], e[t[n]]);
      }
    }, qi.prototype.observeArray = function (e) {
      for (var t = 0, n = e.length; t < n; t++) {
        A(e[t]);
      }
    };var Ki = Ai.optionMergeStrategies;Ki.data = function (e, t, n) {
      return n ? e || t ? function () {
        var i = "function" == typeof t ? t.call(n) : t,
            o = "function" == typeof e ? e.call(n) : void 0;return i ? k(i, o) : o;
      } : void 0 : t ? "function" != typeof t ? e : e ? function () {
        return k(t.call(this), e.call(this));
      } : t : e;
    }, Ai._lifecycleHooks.forEach(function (e) {
      Ki[e] = N;
    }), Ai._assetTypes.forEach(function (e) {
      Ki[e + "s"] = L;
    }), Ki.watch = function (e, t) {
      if (!t) return Object.create(e || null);if (!e) return t;var n = {};l(n, e);for (var i in t) {
        var o = n[i],
            r = t[i];o && !Array.isArray(o) && (o = [o]), n[i] = o ? o.concat(r) : [r];
      }return n;
    }, Ki.props = Ki.methods = Ki.computed = function (e, t) {
      if (!t) return Object.create(e || null);if (!e) return t;var n = Object.create(null);return l(n, e), l(n, t), n;
    };var Zi = function Zi(e, t) {
      return void 0 === t ? e : t;
    },
        Qi = function Qi(e, t, n, i, o, r, a) {
      this.tag = e, this.data = t, this.children = n, this.text = i, this.elm = o, this.ns = void 0, this.context = r, this.functionalContext = void 0, this.key = t && t.key, this.componentOptions = a, this.componentInstance = void 0, this.parent = void 0, this.raw = !1, this.isStatic = !1, this.isRootInsert = !0, this.isComment = !1, this.isCloned = !1, this.isOnce = !1;
    },
        Ji = { child: {} };Ji.child.get = function () {
      return this.componentInstance;
    }, Object.defineProperties(Qi.prototype, Ji);var eo,
        to = function to() {
      var e = new Qi();return e.text = "", e.isComment = !0, e;
    },
        no = a(function (e) {
      var t = "~" === e.charAt(0);e = t ? e.slice(1) : e;var n = "!" === e.charAt(0);return e = n ? e.slice(1) : e, { name: e, once: t, capture: n };
    }),
        io = null,
        oo = [],
        ro = {},
        ao = !1,
        so = !1,
        co = 0,
        lo = 0,
        uo = function uo(e, t, n, i) {
      this.vm = e, e._watchers.push(this), i ? (this.deep = !!i.deep, this.user = !!i.user, this.lazy = !!i.lazy, this.sync = !!i.sync) : this.deep = this.user = this.lazy = this.sync = !1, this.cb = n, this.id = ++lo, this.active = !0, this.dirty = this.lazy, this.deps = [], this.newDeps = [], this.depIds = new di(), this.newDepIds = new di(), this.expression = "", "function" == typeof t ? this.getter = t : (this.getter = y(t), this.getter || (this.getter = function () {})), this.value = this.lazy ? void 0 : this.get();
    };uo.prototype.get = function () {
      b(this);var e,
          t = this.vm;if (this.user) try {
        e = this.getter.call(t, t);
      } catch (e) {
        G(e, t, 'getter for watcher "' + this.expression + '"');
      } else e = this.getter.call(t, t);return this.deep && he(e), C(), this.cleanupDeps(), e;
    }, uo.prototype.addDep = function (e) {
      var t = e.id;this.newDepIds.has(t) || (this.newDepIds.add(t), this.newDeps.push(e), this.depIds.has(t) || e.addSub(this));
    }, uo.prototype.cleanupDeps = function () {
      for (var e = this, t = this.deps.length; t--;) {
        var n = e.deps[t];e.newDepIds.has(n.id) || n.removeSub(e);
      }var i = this.depIds;this.depIds = this.newDepIds, this.newDepIds = i, this.newDepIds.clear(), i = this.deps, this.deps = this.newDeps, this.newDeps = i, this.newDeps.length = 0;
    }, uo.prototype.update = function () {
      this.lazy ? this.dirty = !0 : this.sync ? this.run() : me(this);
    }, uo.prototype.run = function () {
      if (this.active) {
        var e = this.get();if (e !== this.value || u(e) || this.deep) {
          var t = this.value;if (this.value = e, this.user) try {
            this.cb.call(this.vm, e, t);
          } catch (e) {
            G(e, this.vm, 'callback for watcher "' + this.expression + '"');
          } else this.cb.call(this.vm, e, t);
        }
      }
    }, uo.prototype.evaluate = function () {
      this.value = this.get(), this.dirty = !1;
    }, uo.prototype.depend = function () {
      for (var e = this, t = this.deps.length; t--;) {
        e.deps[t].depend();
      }
    }, uo.prototype.teardown = function () {
      var e = this;if (this.active) {
        this.vm._isBeingDestroyed || i(this.vm._watchers, this);for (var t = this.deps.length; t--;) {
          e.deps[t].removeSub(e);
        }this.active = !1;
      }
    };var fo = new di(),
        po = { enumerable: !0, configurable: !0, get: p, set: p },
        mo = { lazy: !0 },
        ho = { init: function init(e, t, n, i) {
        if (!e.componentInstance || e.componentInstance._isDestroyed) {
          (e.componentInstance = ke(e, io, n, i)).$mount(t ? e.elm : void 0, t);
        } else if (e.data.keepAlive) {
          var o = e;ho.prepatch(o, o);
        }
      }, prepatch: function prepatch(e, t) {
        var n = t.componentOptions;se(t.componentInstance = e.componentInstance, n.propsData, n.listeners, t, n.children);
      }, insert: function insert(e) {
        e.componentInstance._isMounted || (e.componentInstance._isMounted = !0, de(e.componentInstance, "mounted")), e.data.keepAlive && le(e.componentInstance, !0);
      }, destroy: function destroy(e) {
        e.componentInstance._isDestroyed || (e.data.keepAlive ? ue(e.componentInstance, !0) : e.componentInstance.$destroy());
      } },
        go = Object.keys(ho),
        vo = 1,
        _o = 2,
        yo = 0;!function (e) {
      e.prototype._init = function (e) {
        var t = this;t._uid = yo++, t._isVue = !0, e && e._isComponent ? Qe(t, e) : t.$options = D(Je(t.constructor), e || {}, t), t._renderProxy = t, t._self = t, re(t), Q(t), qe(t), de(t, "beforeCreate"), Ze(t), _e(t), Ke(t), de(t, "created"), t.$options.el && t.$mount(t.$options.el);
      };
    }(nt), function (e) {
      var t = {};t.get = function () {
        return this._data;
      };var n = {};n.get = function () {
        return this._props;
      }, Object.defineProperty(e.prototype, "$data", t), Object.defineProperty(e.prototype, "$props", n), e.prototype.$set = w, e.prototype.$delete = R, e.prototype.$watch = function (e, t, n) {
        var i = this;n = n || {}, n.user = !0;var o = new uo(i, e, t, n);return n.immediate && t.call(i, o.value), function () {
          o.teardown();
        };
      };
    }(nt), function (e) {
      var t = /^hook:/;e.prototype.$on = function (e, n) {
        var i = this,
            o = this;if (Array.isArray(e)) for (var r = 0, a = e.length; r < a; r++) {
          i.$on(e[r], n);
        } else (o._events[e] || (o._events[e] = [])).push(n), t.test(e) && (o._hasHookEvent = !0);return o;
      }, e.prototype.$once = function (e, t) {
        function n() {
          i.$off(e, n), t.apply(i, arguments);
        }var i = this;return n.fn = t, i.$on(e, n), i;
      }, e.prototype.$off = function (e, t) {
        var n = this,
            i = this;if (!arguments.length) return i._events = Object.create(null), i;if (Array.isArray(e)) {
          for (var o = 0, r = e.length; o < r; o++) {
            n.$off(e[o], t);
          }return i;
        }var a = i._events[e];if (!a) return i;if (1 === arguments.length) return i._events[e] = null, i;for (var s, c = a.length; c--;) {
          if ((s = a[c]) === t || s.fn === t) {
            a.splice(c, 1);break;
          }
        }return i;
      }, e.prototype.$emit = function (e) {
        var t = this,
            n = t._events[e];if (n) {
          n = n.length > 1 ? c(n) : n;for (var i = c(arguments, 1), o = 0, r = n.length; o < r; o++) {
            n[o].apply(t, i);
          }
        }return t;
      };
    }(nt), function (e) {
      e.prototype._update = function (e, t) {
        var n = this;n._isMounted && de(n, "beforeUpdate");var i = n.$el,
            o = n._vnode,
            r = io;io = n, n._vnode = e, n.$el = o ? n.__patch__(o, e) : n.__patch__(n.$el, e, t, !1, n.$options._parentElm, n.$options._refElm), io = r, i && (i.__vue__ = null), n.$el && (n.$el.__vue__ = n), n.$vnode && n.$parent && n.$vnode === n.$parent._vnode && (n.$parent.$el = n.$el);
      }, e.prototype.$forceUpdate = function () {
        var e = this;e._watcher && e._watcher.update();
      }, e.prototype.$destroy = function () {
        var e = this;if (!e._isBeingDestroyed) {
          de(e, "beforeDestroy"), e._isBeingDestroyed = !0;var t = e.$parent;!t || t._isBeingDestroyed || e.$options.abstract || i(t.$children, e), e._watcher && e._watcher.teardown();for (var n = e._watchers.length; n--;) {
            e._watchers[n].teardown();
          }e._data.__ob__ && e._data.__ob__.vmCount--, e._isDestroyed = !0, e.__patch__(e._vnode, null), de(e, "destroyed"), e.$off(), e.$el && (e.$el.__vue__ = null), e.$options._parentElm = e.$options._refElm = null;
        }
      };
    }(nt), function (n) {
      n.prototype.$nextTick = function (e) {
        return zi(e, this);
      }, n.prototype._render = function () {
        var e = this,
            t = e.$options,
            n = t.render,
            i = t.staticRenderFns,
            o = t._parentVnode;if (e._isMounted) for (var r in e.$slots) {
          e.$slots[r] = H(e.$slots[r]);
        }e.$scopedSlots = o && o.data.scopedSlots || Fi, i && !e._staticTrees && (e._staticTrees = []), e.$vnode = o;var a;try {
          a = n.call(e._renderProxy, e.$createElement);
        } catch (t) {
          G(t, e, "render function"), a = e._vnode;
        }return a instanceof Qi || (a = to()), a.parent = o, a;
      }, n.prototype._o = Ve, n.prototype._n = t, n.prototype._s = e, n.prototype._l = ze, n.prototype._t = Ge, n.prototype._q = m, n.prototype._i = h, n.prototype._m = Be, n.prototype._f = je, n.prototype._k = We, n.prototype._b = He, n.prototype._v = j, n.prototype._e = to, n.prototype._u = oe;
    }(nt);var Eo = [String, RegExp],
        bo = { name: "keep-alive", abstract: !0, props: { include: Eo, exclude: Eo }, created: function created() {
        this.cache = Object.create(null);
      }, destroyed: function destroyed() {
        var e = this;for (var t in e.cache) {
          ft(e.cache[t]);
        }
      }, watch: { include: function include(e) {
          dt(this.cache, function (t) {
            return ut(e, t);
          });
        }, exclude: function exclude(e) {
          dt(this.cache, function (t) {
            return !ut(e, t);
          });
        } }, render: function render() {
        var e = Z(this.$slots.default),
            t = e && e.componentOptions;if (t) {
          var n = lt(t);if (n && (this.include && !ut(this.include, n) || this.exclude && ut(this.exclude, n))) return e;var i = null == e.key ? t.Ctor.cid + (t.tag ? "::" + t.tag : "") : e.key;this.cache[i] ? e.componentInstance = this.cache[i].componentInstance : this.cache[i] = e, e.data.keepAlive = !0;
        }return e;
      } },
        Co = { KeepAlive: bo };!function (e) {
      var t = {};t.get = function () {
        return Ai;
      }, Object.defineProperty(e, "config", t), e.util = { warn: Gi, extend: l, mergeOptions: D, defineReactive: F }, e.set = w, e.delete = R, e.nextTick = zi, e.options = Object.create(null), Ai._assetTypes.forEach(function (t) {
        e.options[t + "s"] = Object.create(null);
      }), e.options._base = e, l(e.options.components, Co), it(e), ot(e), rt(e), ct(e);
    }(nt), Object.defineProperty(nt.prototype, "$isServer", { get: Mi }), nt.version = "2.2.6";var So,
        To,
        Ao = n("input,textarea,option,select"),
        Fo = function Fo(e, t, n) {
      return "value" === n && Ao(e) && "button" !== t || "selected" === n && "option" === e || "checked" === n && "input" === e || "muted" === n && "video" === e;
    },
        wo = n("contenteditable,draggable,spellcheck"),
        Ro = n("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),
        Oo = "http://www.w3.org/1999/xlink",
        ko = function ko(e) {
      return ":" === e.charAt(5) && "xlink" === e.slice(0, 5);
    },
        No = function No(e) {
      return ko(e) ? e.slice(6, e.length) : "";
    },
        Lo = function Lo(e) {
      return null == e || !1 === e;
    },
        Io = { svg: "http://www.w3.org/2000/svg", math: "http://www.w3.org/1998/Math/MathML" },
        xo = n("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template"),
        Do = n("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view", !0),
        Uo = function Uo(e) {
      return xo(e) || Do(e);
    },
        Mo = Object.create(null),
        $o = Object.freeze({ createElement: bt, createElementNS: Ct, createTextNode: St, createComment: Tt, insertBefore: At, removeChild: Ft, appendChild: wt, parentNode: Rt, nextSibling: Ot, tagName: kt, setTextContent: Nt, setAttribute: Lt }),
        Po = { create: function create(e, t) {
        It(t);
      }, update: function update(e, t) {
        e.data.ref !== t.data.ref && (It(e, !0), It(t));
      }, destroy: function destroy(e) {
        It(e, !0);
      } },
        zo = new Qi("", {}, []),
        Go = ["create", "activate", "update", "remove", "destroy"],
        jo = { create: zt, update: zt, destroy: function destroy(e) {
        zt(e, zo);
      } },
        Wo = Object.create(null),
        Ho = [Po, jo],
        Bo = { create: Bt, update: Bt },
        Vo = { create: Yt, update: Yt },
        Yo = "__r",
        Xo = "__c",
        qo = { create: Zt, update: Zt },
        Ko = { create: Qt, update: Qt },
        Zo = a(function (e) {
      var t = {};return e.split(/;(?![^(]*\))/g).forEach(function (e) {
        if (e) {
          var n = e.split(/:(.+)/);n.length > 1 && (t[n[0].trim()] = n[1].trim());
        }
      }), t;
    }),
        Qo = /^--/,
        Jo = /\s*!important$/,
        er = function er(e, t, n) {
      Qo.test(t) ? e.style.setProperty(t, n) : Jo.test(n) ? e.style.setProperty(t, n.replace(Jo, ""), "important") : e.style[nr(t)] = n;
    },
        tr = ["Webkit", "Moz", "ms"],
        nr = a(function (e) {
      if (To = To || document.createElement("div"), "filter" !== (e = _i(e)) && e in To.style) return e;for (var t = e.charAt(0).toUpperCase() + e.slice(1), n = 0; n < tr.length; n++) {
        var i = tr[n] + t;if (i in To.style) return i;
      }
    }),
        ir = { create: an, update: an },
        or = a(function (e) {
      return { enterClass: e + "-enter", enterToClass: e + "-enter-to", enterActiveClass: e + "-enter-active", leaveClass: e + "-leave", leaveToClass: e + "-leave-to", leaveActiveClass: e + "-leave-active" };
    }),
        rr = Oi && !Li,
        ar = "transition",
        sr = "animation",
        cr = "transition",
        lr = "transitionend",
        ur = "animation",
        dr = "animationend";rr && (void 0 === window.ontransitionend && void 0 !== window.onwebkittransitionend && (cr = "WebkitTransition", lr = "webkitTransitionEnd"), void 0 === window.onanimationend && void 0 !== window.onwebkitanimationend && (ur = "WebkitAnimation", dr = "webkitAnimationEnd"));var fr = Oi && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout,
        pr = /\b(transform|all)(,|$)/,
        mr = Oi ? { create: bn, activate: bn, remove: function remove(e, t) {
        e.data.show ? t() : _n(e, t);
      } } : {},
        hr = [Bo, Vo, qo, Ko, ir, mr],
        gr = hr.concat(Ho),
        vr = function (e) {
      function t(e) {
        return new Qi(w.tagName(e).toLowerCase(), {}, [], void 0, e);
      }function i(e, t) {
        function n() {
          0 == --n.listeners && o(e);
        }return n.listeners = t, n;
      }function o(e) {
        var t = w.parentNode(e);Dt(t) && w.removeChild(t, e);
      }function a(e, t, n, i, o) {
        if (e.isRootInsert = !o, !s(e, t, n, i)) {
          var r = e.data,
              a = e.children,
              c = e.tag;Dt(c) ? (e.elm = e.ns ? w.createElementNS(e.ns, c) : w.createElement(c, e), m(e), d(e, a, t), Dt(r) && p(e, t), u(n, e.elm, i)) : Ut(e.isComment) ? (e.elm = w.createComment(e.text), u(n, e.elm, i)) : (e.elm = w.createTextNode(e.text), u(n, e.elm, i));
        }
      }function s(e, t, n, i) {
        var o = e.data;if (Dt(o)) {
          var r = Dt(e.componentInstance) && o.keepAlive;if (Dt(o = o.hook) && Dt(o = o.init) && o(e, !1, n, i), Dt(e.componentInstance)) return c(e, t), Ut(r) && l(e, t, n, i), !0;
        }
      }function c(e, t) {
        Dt(e.data.pendingInsert) && t.push.apply(t, e.data.pendingInsert), e.elm = e.componentInstance.$el, f(e) ? (p(e, t), m(e)) : (It(e), t.push(e));
      }function l(e, t, n, i) {
        for (var o, r = e; r.componentInstance;) {
          if (r = r.componentInstance._vnode, Dt(o = r.data) && Dt(o = o.transition)) {
            for (o = 0; o < A.activate.length; ++o) {
              A.activate[o](zo, r);
            }t.push(r);break;
          }
        }u(n, e.elm, i);
      }function u(e, t, n) {
        Dt(e) && (Dt(n) ? w.insertBefore(e, t, n) : w.appendChild(e, t));
      }function d(e, t, n) {
        if (Array.isArray(t)) for (var i = 0; i < t.length; ++i) {
          a(t[i], n, e.elm, null, !0);
        } else r(e.text) && w.appendChild(e.elm, w.createTextNode(e.text));
      }function f(e) {
        for (; e.componentInstance;) {
          e = e.componentInstance._vnode;
        }return Dt(e.tag);
      }function p(e, t) {
        for (var n = 0; n < A.create.length; ++n) {
          A.create[n](zo, e);
        }S = e.data.hook, Dt(S) && (Dt(S.create) && S.create(zo, e), Dt(S.insert) && t.push(e));
      }function m(e) {
        for (var t, n = e; n;) {
          Dt(t = n.context) && Dt(t = t.$options._scopeId) && w.setAttribute(e.elm, t, ""), n = n.parent;
        }Dt(t = io) && t !== e.context && Dt(t = t.$options._scopeId) && w.setAttribute(e.elm, t, "");
      }function h(e, t, n, i, o, r) {
        for (; i <= o; ++i) {
          a(n[i], r, e, t);
        }
      }function g(e) {
        var t,
            n,
            i = e.data;if (Dt(i)) for (Dt(t = i.hook) && Dt(t = t.destroy) && t(e), t = 0; t < A.destroy.length; ++t) {
          A.destroy[t](e);
        }if (Dt(t = e.children)) for (n = 0; n < e.children.length; ++n) {
          g(e.children[n]);
        }
      }function v(e, t, n, i) {
        for (; n <= i; ++n) {
          var r = t[n];Dt(r) && (Dt(r.tag) ? (_(r), g(r)) : o(r.elm));
        }
      }function _(e, t) {
        if (Dt(t) || Dt(e.data)) {
          var n = A.remove.length + 1;for (Dt(t) ? t.listeners += n : t = i(e.elm, n), Dt(S = e.componentInstance) && Dt(S = S._vnode) && Dt(S.data) && _(S, t), S = 0; S < A.remove.length; ++S) {
            A.remove[S](e, t);
          }Dt(S = e.data.hook) && Dt(S = S.remove) ? S(e, t) : t();
        } else o(e.elm);
      }function y(e, t, n, i, o) {
        for (var r, s, c, l, u = 0, d = 0, f = t.length - 1, p = t[0], m = t[f], g = n.length - 1, _ = n[0], y = n[g], b = !o; u <= f && d <= g;) {
          xt(p) ? p = t[++u] : xt(m) ? m = t[--f] : Mt(p, _) ? (E(p, _, i), p = t[++u], _ = n[++d]) : Mt(m, y) ? (E(m, y, i), m = t[--f], y = n[--g]) : Mt(p, y) ? (E(p, y, i), b && w.insertBefore(e, p.elm, w.nextSibling(m.elm)), p = t[++u], y = n[--g]) : Mt(m, _) ? (E(m, _, i), b && w.insertBefore(e, m.elm, p.elm), m = t[--f], _ = n[++d]) : (xt(r) && (r = Pt(t, u, f)), s = Dt(_.key) ? r[_.key] : null, xt(s) ? (a(_, i, e, p.elm), _ = n[++d]) : (c = t[s], Mt(c, _) ? (E(c, _, i), t[s] = void 0, b && w.insertBefore(e, _.elm, p.elm), _ = n[++d]) : (a(_, i, e, p.elm), _ = n[++d])));
        }u > f ? (l = xt(n[g + 1]) ? null : n[g + 1].elm, h(e, l, n, d, g, i)) : d > g && v(e, t, u, f);
      }function E(e, t, n, i) {
        if (e !== t) {
          if (Ut(t.isStatic) && Ut(e.isStatic) && t.key === e.key && (Ut(t.isCloned) || Ut(t.isOnce))) return t.elm = e.elm, void (t.componentInstance = e.componentInstance);var o,
              r = t.data;Dt(r) && Dt(o = r.hook) && Dt(o = o.prepatch) && o(e, t);var a = t.elm = e.elm,
              s = e.children,
              c = t.children;if (Dt(r) && f(t)) {
            for (o = 0; o < A.update.length; ++o) {
              A.update[o](e, t);
            }Dt(o = r.hook) && Dt(o = o.update) && o(e, t);
          }xt(t.text) ? Dt(s) && Dt(c) ? s !== c && y(a, s, c, n, i) : Dt(c) ? (Dt(e.text) && w.setTextContent(a, ""), h(a, null, c, 0, c.length - 1, n)) : Dt(s) ? v(a, s, 0, s.length - 1) : Dt(e.text) && w.setTextContent(a, "") : e.text !== t.text && w.setTextContent(a, t.text), Dt(r) && Dt(o = r.hook) && Dt(o = o.postpatch) && o(e, t);
        }
      }function b(e, t, n) {
        if (Ut(n) && Dt(e.parent)) e.parent.data.pendingInsert = t;else for (var i = 0; i < t.length; ++i) {
          t[i].data.hook.insert(t[i]);
        }
      }function C(e, t, n) {
        t.elm = e;var i = t.tag,
            o = t.data,
            r = t.children;if (Dt(o) && (Dt(S = o.hook) && Dt(S = S.init) && S(t, !0), Dt(S = t.componentInstance))) return c(t, n), !0;if (Dt(i)) {
          if (Dt(r)) if (e.hasChildNodes()) {
            for (var a = !0, s = e.firstChild, l = 0; l < r.length; l++) {
              if (!s || !C(s, r[l], n)) {
                a = !1;break;
              }s = s.nextSibling;
            }if (!a || s) return !1;
          } else d(t, r, n);if (Dt(o)) for (var u in o) {
            if (!R(u)) {
              p(t, n);break;
            }
          }
        } else e.data !== t.text && (e.data = t.text);return !0;
      }var S,
          T,
          A = {},
          F = e.modules,
          w = e.nodeOps;for (S = 0; S < Go.length; ++S) {
        for (A[Go[S]] = [], T = 0; T < F.length; ++T) {
          Dt(F[T][Go[S]]) && A[Go[S]].push(F[T][Go[S]]);
        }
      }var R = n("attrs,style,class,staticClass,staticStyle,key");return function (e, n, i, o, r, s) {
        if (xt(n)) return void (Dt(e) && g(e));var c = !1,
            l = [];if (xt(e)) c = !0, a(n, l, r, s);else {
          var u = Dt(e.nodeType);if (!u && Mt(e, n)) E(e, n, l, o);else {
            if (u) {
              if (1 === e.nodeType && e.hasAttribute("server-rendered") && (e.removeAttribute("server-rendered"), i = !0), Ut(i) && C(e, n, l)) return b(n, l, !0), e;e = t(e);
            }var d = e.elm,
                p = w.parentNode(d);if (a(n, l, d._leaveCb ? null : p, w.nextSibling(d)), Dt(n.parent)) {
              for (var m = n.parent; m;) {
                m.elm = n.elm, m = m.parent;
              }if (f(n)) for (var h = 0; h < A.create.length; ++h) {
                A.create[h](zo, n.parent);
              }
            }Dt(p) ? v(p, [e], 0, 0) : Dt(e.tag) && g(e);
          }
        }return b(n, l, c), n.elm;
      };
    }({ nodeOps: $o, modules: gr });Li && document.addEventListener("selectionchange", function () {
      var e = document.activeElement;e && e.vmodel && wn(e, "input");
    });var _r = { inserted: function inserted(e, t, n) {
        if ("select" === n.tag) {
          var i = function i() {
            Cn(e, t, n.context);
          };i(), (Ni || Ii) && setTimeout(i, 0);
        } else "textarea" !== n.tag && "text" !== e.type && "password" !== e.type || (e._vModifiers = t.modifiers, t.modifiers.lazy || (xi || (e.addEventListener("compositionstart", An), e.addEventListener("compositionend", Fn)), Li && (e.vmodel = !0)));
      }, componentUpdated: function componentUpdated(e, t, n) {
        if ("select" === n.tag) {
          Cn(e, t, n.context);(e.multiple ? t.value.some(function (t) {
            return Sn(t, e.options);
          }) : t.value !== t.oldValue && Sn(t.value, e.options)) && wn(e, "change");
        }
      } },
        yr = { bind: function bind(e, t, n) {
        var i = t.value;n = Rn(n);var o = n.data && n.data.transition,
            r = e.__vOriginalDisplay = "none" === e.style.display ? "" : e.style.display;i && o && !Li ? (n.data.show = !0, vn(n, function () {
          e.style.display = r;
        })) : e.style.display = i ? r : "none";
      }, update: function update(e, t, n) {
        var i = t.value;i !== t.oldValue && (n = Rn(n), n.data && n.data.transition && !Li ? (n.data.show = !0, i ? vn(n, function () {
          e.style.display = e.__vOriginalDisplay;
        }) : _n(n, function () {
          e.style.display = "none";
        })) : e.style.display = i ? e.__vOriginalDisplay : "none");
      }, unbind: function unbind(e, t, n, i, o) {
        o || (e.style.display = e.__vOriginalDisplay);
      } },
        Er = { model: _r, show: yr },
        br = { name: String, appear: Boolean, css: Boolean, mode: String, type: String, enterClass: String, leaveClass: String, enterToClass: String, leaveToClass: String, enterActiveClass: String, leaveActiveClass: String, appearClass: String, appearActiveClass: String, appearToClass: String, duration: [Number, String, Object] },
        Cr = { name: "transition", props: br, abstract: !0, render: function render(e) {
        var t = this,
            n = this.$slots.default;if (n && (n = n.filter(function (e) {
          return e.tag;
        }), n.length)) {
          var i = this.mode,
              o = n[0];if (Ln(this.$vnode)) return o;var a = On(o);if (!a) return o;if (this._leaving) return Nn(e, o);var s = "__transition-" + this._uid + "-";a.key = null == a.key ? s + a.tag : r(a.key) ? 0 === String(a.key).indexOf(s) ? a.key : s + a.key : a.key;var c = (a.data || (a.data = {})).transition = kn(this),
              u = this._vnode,
              d = On(u);if (a.data.directives && a.data.directives.some(function (e) {
            return "show" === e.name;
          }) && (a.data.show = !0), d && d.data && !In(a, d)) {
            var f = d && (d.data.transition = l({}, c));if ("out-in" === i) return this._leaving = !0, Y(f, "afterLeave", function () {
              t._leaving = !1, t.$forceUpdate();
            }), Nn(e, o);if ("in-out" === i) {
              var p,
                  m = function m() {
                p();
              };Y(c, "afterEnter", m), Y(c, "enterCancelled", m), Y(f, "delayLeave", function (e) {
                p = e;
              });
            }
          }return o;
        }
      } },
        Sr = l({ tag: String, moveClass: String }, br);delete Sr.mode;var Tr = { props: Sr, render: function render(e) {
        for (var t = this.tag || this.$vnode.data.tag || "span", n = Object.create(null), i = this.prevChildren = this.children, o = this.$slots.default || [], r = this.children = [], a = kn(this), s = 0; s < o.length; s++) {
          var c = o[s];c.tag && null != c.key && 0 !== String(c.key).indexOf("__vlist") && (r.push(c), n[c.key] = c, (c.data || (c.data = {})).transition = a);
        }if (i) {
          for (var l = [], u = [], d = 0; d < i.length; d++) {
            var f = i[d];f.data.transition = a, f.data.pos = f.elm.getBoundingClientRect(), n[f.key] ? l.push(f) : u.push(f);
          }this.kept = e(t, null, l), this.removed = u;
        }return e(t, null, r);
      }, beforeUpdate: function beforeUpdate() {
        this.__patch__(this._vnode, this.kept, !1, !0), this._vnode = this.kept;
      }, updated: function updated() {
        var e = this.prevChildren,
            t = this.moveClass || (this.name || "v") + "-move";if (e.length && this.hasMove(e[0].elm, t)) {
          e.forEach(xn), e.forEach(Dn), e.forEach(Un);var n = document.body;n.offsetHeight;e.forEach(function (e) {
            if (e.data.moved) {
              var n = e.elm,
                  i = n.style;dn(n, t), i.transform = i.WebkitTransform = i.transitionDuration = "", n.addEventListener(lr, n._moveCb = function e(i) {
                i && !/transform$/.test(i.propertyName) || (n.removeEventListener(lr, e), n._moveCb = null, fn(n, t));
              });
            }
          });
        }
      }, methods: { hasMove: function hasMove(e, t) {
          if (!rr) return !1;if (null != this._hasMove) return this._hasMove;var n = e.cloneNode();e._transitionClasses && e._transitionClasses.forEach(function (e) {
            cn(n, e);
          }), sn(n, t), n.style.display = "none", this.$el.appendChild(n);var i = mn(n);return this.$el.removeChild(n), this._hasMove = i.hasTransform;
        } } },
        Ar = { Transition: Cr, TransitionGroup: Tr };nt.config.mustUseProp = Fo, nt.config.isReservedTag = Uo, nt.config.getTagNamespace = _t, nt.config.isUnknownElement = yt, l(nt.options.directives, Er), l(nt.options.components, Ar), nt.prototype.__patch__ = Oi ? vr : p, nt.prototype.$mount = function (e, t) {
      return e = e && Oi ? Et(e) : void 0, ae(this, e, t);
    }, setTimeout(function () {
      Ai.devtools && $i && $i.emit("init", nt);
    }, 0);var Fr = "undefined" != typeof window ? window : "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : {},
        wr = function (e, t) {
      return t = { exports: {} }, e(t, t.exports), t.exports;
    }(function (e, t) {
      "use strict";
      var n = null,
          i = { install: function install(e) {
          var t,
              i = e.version[0];n || (n = new e({ data: function data() {
              return { current: "", locales: {} };
            }, computed: { lang: function lang() {
                return this.current;
              }, locale: function locale() {
                return this.locales[this.current] ? this.locales[this.current] : null;
              } }, methods: { setLang: function setLang(e) {
                this.current !== e && ("" === this.current ? this.$emit("language:init", e) : this.$emit("language:changed", e)), this.current = e, this.$emit("language:modified", e);
              }, setLocales: function setLocales(t) {
                if (t) {
                  var n = Object.create(this.locales);for (var i in t) {
                    n[i] || (n[i] = {}), e.util.extend(n[i], t[i]);
                  }this.locales = Object.create(n), this.$emit("locales:loaded", t);
                }
              }, text: function text(e) {
                return this.locale && this.locale[e] ? this.locale[e] : e;
              } } }), e.prototype.$translate = n), e.mixin((t = {}, t["1" === i ? "init" : "beforeCreate"] = function () {
            this.$translate.setLocales(this.$options.locales);
          }, t.methods = { t: function t(e) {
              return this.$translate.text(e);
            } }, t.directives = { translate: function (e) {
              e.$translateKey || (e.$translateKey = e.innerText);var t = this.$translate.text(e.$translateKey);e.innerText = t;
            }.bind(n) }, t)), e.locales = function (e) {
            n.$translate.setLocales(e);
          };
        } };e.exports = i;
    }),
        Rr = { init: function init() {
        window.filestackInternals.logger.working = !1;
      }, isWorking: function isWorking() {
        return window.filestackInternals.logger.working;
      }, on: function on() {
        window.filestackInternals.logger.working = !0;
      }, off: function off() {
        window.filestackInternals.logger.working = !1;
      } },
        Or = function e(t, n) {
      var i = function i() {
        for (var e = arguments.length, i = Array(e), o = 0; o < e; o++) {
          i[o] = arguments[o];
        }var r = [].concat(i).map(function (e) {
          return "object" === (void 0 === e ? "undefined" : pi(e)) ? JSON.stringify(e, function (e, t) {
            if ("function" == typeof t) {
              if ("json" === e) try {
                return t();
              } catch (e) {}return "[Function]";
            }return t instanceof File ? "[File name: " + t.name + ", mimetype: " + t.type + ", size: " + t.size + "]" : t;
          }, 2) : e;
        });if (n.isWorking()) {
          var a;(a = console).log.apply(a, ["[" + t + "]"].concat(gi(r)));
        }
      };return i.context = function (i) {
        return e(t + "][" + i, n);
      }, i.on = n.on, i.off = n.off, i;
    }("filestack", Rr);!function () {
      var e = void 0;"object" === ("undefined" == typeof window ? "undefined" : pi(window)) && (e = window.filestackInternals, e || (e = {}, window.filestackInternals = e), e.logger || (e.logger = Or, Rr.init()));
    }();var kr = function () {
      var e = void 0;return "object" === ("undefined" == typeof window ? "undefined" : pi(window)) && (e = window.filestackInternals, e || (e = {}, window.filestackInternals = e), e.loader || (e.loader = { modules: {} })), e;
    }(),
        Nr = kr.loader.modules,
        Lr = function Lr(e) {
      var t = Nr[e];if (t || (Nr[e] = {}, t = Nr[e]), t.instance) return Promise.resolve(t.instance);if (t.promise) return t.promise;var n = new Promise(function (n) {
        var i = function i() {
          t.resolvePromise = n;var i = document.createElement("script");i.src = e, document.body.appendChild(i);
        };!function e() {
          "complete" === document.readyState ? i() : setTimeout(e, 50);
        }();
      });return t.promise = n, n;
    },
        Ir = function Ir(e) {
      var t = document.getElementsByTagName("script"),
          n = t[t.length - 1],
          i = n.getAttribute("src"),
          o = Nr[i];o.resolvePromise && (o.instance = e, o.resolvePromise(e), delete o.promise, delete o.resolvePromise);
    },
        xr = function xr(e) {
      return null !== document.querySelector('link[href="' + e + '"]') ? Promise.resolve() : new Promise(function (t) {
        var n = document.getElementsByTagName("head")[0],
            i = document.createElement("link"),
            o = function e() {
          t(), i.removeEventListener("load", e);
        };i.rel = "stylesheet", i.href = e, i.addEventListener("load", o), n.appendChild(i);
      });
    },
        Dr = { registerReadyModule: Ir, loadModule: Lr, loadCss: xr },
        Ur = function Ur(e) {
      function t() {
        var e = this.$options;e.store ? this.$store = e.store : e.parent && e.parent.$store && (this.$store = e.parent.$store);
      }if (Number(e.version.split(".")[0]) >= 2) {
        var n = e.config._lifecycleHooks.indexOf("init") > -1;e.mixin(n ? { init: t } : { beforeCreate: t });
      } else {
        var i = e.prototype._init;e.prototype._init = function (e) {
          void 0 === e && (e = {}), e.init = e.init ? [t].concat(e.init) : t, i.call(this, e);
        };
      }
    },
        Mr = "undefined" != typeof window && window.__VUE_DEVTOOLS_GLOBAL_HOOK__,
        $r = function $r(e, t) {
      this.runtime = t, this._children = Object.create(null), this._rawModule = e;var n = e.state;this.state = ("function" == typeof n ? n() : n) || {};
    },
        Pr = { namespaced: {} };Pr.namespaced.get = function () {
      return !!this._rawModule.namespaced;
    }, $r.prototype.addChild = function (e, t) {
      this._children[e] = t;
    }, $r.prototype.removeChild = function (e) {
      delete this._children[e];
    }, $r.prototype.getChild = function (e) {
      return this._children[e];
    }, $r.prototype.update = function (e) {
      this._rawModule.namespaced = e.namespaced, e.actions && (this._rawModule.actions = e.actions), e.mutations && (this._rawModule.mutations = e.mutations), e.getters && (this._rawModule.getters = e.getters);
    }, $r.prototype.forEachChild = function (e) {
      $n(this._children, e);
    }, $r.prototype.forEachGetter = function (e) {
      this._rawModule.getters && $n(this._rawModule.getters, e);
    }, $r.prototype.forEachAction = function (e) {
      this._rawModule.actions && $n(this._rawModule.actions, e);
    }, $r.prototype.forEachMutation = function (e) {
      this._rawModule.mutations && $n(this._rawModule.mutations, e);
    }, Object.defineProperties($r.prototype, Pr);var zr = function zr(e) {
      var t = this;this.root = new $r(e, !1), e.modules && $n(e.modules, function (e, n) {
        t.register([n], e, !1);
      });
    };zr.prototype.get = function (e) {
      return e.reduce(function (e, t) {
        return e.getChild(t);
      }, this.root);
    }, zr.prototype.getNamespace = function (e) {
      var t = this.root;return e.reduce(function (e, n) {
        return t = t.getChild(n), e + (t.namespaced ? n + "/" : "");
      }, "");
    }, zr.prototype.update = function (e) {
      jn(this.root, e);
    }, zr.prototype.register = function (e, t, n) {
      var i = this;void 0 === n && (n = !0);var o = this.get(e.slice(0, -1)),
          r = new $r(t, n);o.addChild(e[e.length - 1], r), t.modules && $n(t.modules, function (t, o) {
        i.register(e.concat(o), t, n);
      });
    }, zr.prototype.unregister = function (e) {
      var t = this.get(e.slice(0, -1)),
          n = e[e.length - 1];t.getChild(n).runtime && t.removeChild(n);
    };var Gr,
        jr = function jr(e) {
      var t = this;void 0 === e && (e = {}), Gn(Gr, "must call Vue.use(Vuex) before creating a store instance."), Gn("undefined" != typeof Promise, "vuex requires a Promise polyfill in this browser.");var n = e.state;void 0 === n && (n = {});var i = e.plugins;void 0 === i && (i = []);var o = e.strict;void 0 === o && (o = !1), this._committing = !1, this._actions = Object.create(null), this._mutations = Object.create(null), this._wrappedGetters = Object.create(null), this._modules = new zr(e), this._modulesNamespaceMap = Object.create(null), this._subscribers = [], this._watcherVM = new Gr();var r = this,
          a = this,
          s = a.dispatch,
          c = a.commit;this.dispatch = function (e, t) {
        return s.call(r, e, t);
      }, this.commit = function (e, t, n) {
        return c.call(r, e, t, n);
      }, this.strict = o, Bn(this, n, [], this._modules.root), Hn(this, n), i.concat(Mn).forEach(function (e) {
        return e(t);
      });
    },
        Wr = { state: {} };Wr.state.get = function () {
      return this._vm._data.$$state;
    }, Wr.state.set = function (e) {
      Gn(!1, "Use store.replaceState() to explicit replace store state.");
    }, jr.prototype.commit = function (e, t, n) {
      var i = this,
          o = Jn(e, t, n),
          r = o.type,
          a = o.payload,
          s = o.options,
          c = { type: r, payload: a },
          l = this._mutations[r];if (!l) return void console.error("[vuex] unknown mutation type: " + r);this._withCommit(function () {
        l.forEach(function (e) {
          e(a);
        });
      }), this._subscribers.forEach(function (e) {
        return e(c, i.state);
      }), s && s.silent && console.warn("[vuex] mutation type: " + r + ". Silent option has been removed. Use the filter functionality in the vue-devtools");
    }, jr.prototype.dispatch = function (e, t) {
      var n = Jn(e, t),
          i = n.type,
          o = n.payload,
          r = this._actions[i];return r ? r.length > 1 ? Promise.all(r.map(function (e) {
        return e(o);
      })) : r[0](o) : void console.error("[vuex] unknown action type: " + i);
    }, jr.prototype.subscribe = function (e) {
      var t = this._subscribers;return t.indexOf(e) < 0 && t.push(e), function () {
        var n = t.indexOf(e);n > -1 && t.splice(n, 1);
      };
    }, jr.prototype.watch = function (e, t, n) {
      var i = this;return Gn("function" == typeof e, "store.watch only accepts a function."), this._watcherVM.$watch(function () {
        return e(i.state, i.getters);
      }, t, n);
    }, jr.prototype.replaceState = function (e) {
      var t = this;this._withCommit(function () {
        t._vm._data.$$state = e;
      });
    }, jr.prototype.registerModule = function (e, t) {
      "string" == typeof e && (e = [e]), Gn(Array.isArray(e), "module path must be a string or an Array."), this._modules.register(e, t), Bn(this, this.state, e, this._modules.get(e)), Hn(this, this.state);
    }, jr.prototype.unregisterModule = function (e) {
      var t = this;"string" == typeof e && (e = [e]), Gn(Array.isArray(e), "module path must be a string or an Array."), this._modules.unregister(e), this._withCommit(function () {
        var n = Qn(t.state, e.slice(0, -1));Gr.delete(n, e[e.length - 1]);
      }), Wn(this);
    }, jr.prototype.hotUpdate = function (e) {
      this._modules.update(e), Wn(this, !0);
    }, jr.prototype._withCommit = function (e) {
      var t = this._committing;this._committing = !0, e(), this._committing = t;
    }, Object.defineProperties(jr.prototype, Wr), "undefined" != typeof window && window.Vue && ei(window.Vue);var Hr = ni(function (e, t) {
      var n = {};return ti(t).forEach(function (t) {
        var i = t.key,
            o = t.val;n[i] = function () {
          var t = this.$store.state,
              n = this.$store.getters;if (e) {
            var i = ii(this.$store, "mapState", e);if (!i) return;t = i.context.state, n = i.context.getters;
          }return "function" == typeof o ? o.call(this, t, n) : t[o];
        }, n[i].vuex = !0;
      }), n;
    }),
        Br = ni(function (e, t) {
      var n = {};return ti(t).forEach(function (t) {
        var i = t.key,
            o = t.val;o = e + o, n[i] = function () {
          for (var t = [], n = arguments.length; n--;) {
            t[n] = arguments[n];
          }if (!e || ii(this.$store, "mapMutations", e)) return this.$store.commit.apply(this.$store, [o].concat(t));
        };
      }), n;
    }),
        Vr = ni(function (e, t) {
      var n = {};return ti(t).forEach(function (t) {
        var i = t.key,
            o = t.val;o = e + o, n[i] = function () {
          if (!e || ii(this.$store, "mapGetters", e)) return o in this.$store.getters ? this.$store.getters[o] : void console.error("[vuex] unknown getter: " + o);
        }, n[i].vuex = !0;
      }), n;
    }),
        Yr = ni(function (e, t) {
      var n = {};return ti(t).forEach(function (t) {
        var i = t.key,
            o = t.val;o = e + o, n[i] = function () {
          for (var t = [], n = arguments.length; n--;) {
            t[n] = arguments[n];
          }if (!e || ii(this.$store, "mapActions", e)) return this.$store.dispatch.apply(this.$store, [o].concat(t));
        };
      }), n;
    }),
        Xr = { Store: jr, install: ei, version: "2.3.0", mapState: Hr, mapMutations: Br, mapGetters: Vr, mapActions: Yr },
        qr = function qr(e) {
      return "function" == typeof e.getAsEntry ? e.getAsEntry() : "function" == typeof e.webkitGetAsEntry ? e.webkitGetAsEntry() : void 0;
    },
        Kr = function Kr(e) {
      return -1 === [".DS_Store"].indexOf(e);
    },
        Zr = function Zr(e) {
      for (var t = [], n = [], i = 0; i < e.length; i += 1) {
        var o = e[i];if ("file" === o.kind && o.type && "application/x-moz-file" !== o.type) {
          var r = o.getAsFile();r && (t.push(r), n.push(Promise.resolve()));
        } else if ("file" === o.kind) {
          var a = qr(o);a && n.push(function e(n) {
            return new Promise(function (i) {
              n.isDirectory ? n.createReader().readEntries(function (t) {
                var n = t.map(function (t) {
                  return e(t);
                });Promise.all(n).then(i);
              }) : n.isFile && n.file(function (e) {
                Kr(e.name) && t.push(e), i();
              });
            });
          }(a));
        } else "string" === o.kind && "text/uri-list" === o.type && n.push(function (e) {
          return new Promise(function (n) {
            e.getAsString(function (e) {
              t.push({ url: e, source: "dragged-from-web" }), n();
            });
          });
        }(o));
      }return Promise.all(n).then(function () {
        return t;
      });
    },
        Qr = function Qr(e) {
      return new Promise(function (t) {
        for (var n = [], i = 0; i < e.length; i += 1) {
          n.push(e[i]);
        }t(n);
      });
    },
        Jr = function Jr(e) {
      return e.items ? Zr(e.items) : e.files ? Qr(e.files) : Promise.resolve([]);
    },
        ea = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", { directives: [{ name: "show", rawName: "v-show", value: e.fileAboutToBeDropped, expression: "fileAboutToBeDropped" }], ref: "dropZone", staticClass: "fsp-dropzone-overlay" }, [n("div", { staticClass: "fsp-dropzone-overlay__text" })]);
      }, staticRenderFns: [], data: function data() {
        return { fileAboutToBeDropped: !1 };
      }, methods: hi({}, Xr.mapActions(["addFile", "updateSelectLabelActive"]), { dragenter: function dragenter(e) {
          e.preventDefault(), this.fileAboutToBeDropped = !0, this.updateSelectLabelActive(!0);
        }, dragover: function dragover(e) {
          e.preventDefault();
        }, dragleave: function dragleave() {
          this.fileAboutToBeDropped = !1, this.updateSelectLabelActive(!1);
        }, drop: function drop(e) {
          var t = this;e.preventDefault(), this.fileAboutToBeDropped = !1, Jr(e.dataTransfer).then(function (e) {
            e.forEach(function (e) {
              t.addFile(e);
            });
          });
        }, paste: function paste(e) {
          var t = this;Jr(e.clipboardData).then(function (e) {
            e.forEach(function (e) {
              e.name = "pasted file", t.addFile(e);
            });
          });
        } }), mounted: function mounted() {
        var e = this.$root.$el,
            t = this.$refs.dropZone;e.addEventListener("dragenter", this.dragenter, !1), t.addEventListener("dragover", this.dragover, !1), t.addEventListener("dragleave", this.dragleave, !1), t.addEventListener("drop", this.drop, !1), e.addEventListener("paste", this.paste, !1);
      } },
        ta = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return e.notifications.length > 0 ? n("div", { staticClass: "fsp-notifications__container" }, [n("div", { staticClass: "fsp-notifications__message" }, [e._v(e._s(e.mostRecentNotification.message))]), n("span", { staticClass: "fsp-icon fsp-notifications__close-button", on: { click: e.removeAllNotifications } })]) : e._e();
      }, staticRenderFns: [], computed: hi({}, Xr.mapGetters(["notifications"]), { mostRecentNotification: function mostRecentNotification() {
          return this.notifications[this.notifications.length - 1];
        } }), methods: hi({}, Xr.mapActions(["removeAllNotifications"])) },
        na = [{ name: "local_file_system", label: "My Device", ui: "local" }, { name: "dropbox", label: "Dropbox", ui: "cloud" }, { name: "evernote", label: "Evernote", ui: "cloud" }, { name: "facebook", label: "Facebook", ui: "cloud" }, { name: "flickr", label: "Flickr", ui: "cloud" }, { name: "instagram", label: "Instagram", ui: "cloud" }, { name: "box", label: "Box", ui: "cloud" }, { name: "googledrive", label: "Google Drive", ui: "cloud" }, { name: "github", label: "Github", ui: "cloud" }, { name: "gmail", label: "Gmail", ui: "cloud" }, { name: "picasa", label: "Google Photos", ui: "cloud" }, { name: "onedrive", label: "OneDrive", ui: "cloud" }, { name: "clouddrive", label: "Cloud Drive", ui: "cloud" }, { name: "imagesearch", label: "Web Search", ui: "imagesearch" }, { name: "source-url", label: "Link (URL)", ui: "source-url" }],
        ia = function ia(e) {
      var t = void 0;if (na.forEach(function (n) {
        n.name === e && (t = n);
      }), !t) throw new Error('Unknown source "' + e + '"');return t;
    },
        oa = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", { staticClass: "fsp-source-list__item", class: { active: e.isSelectedSource, hidden: e.isHidden, disabled: e.uploadStarted }, on: { click: function click(t) {
              e.onNavClick(e.sourceName);
            } } }, [e.sourceSelectedCount(e.filesWaiting) ? n("span", { staticClass: "fsp-badge--source" }, [e._v(e._s(e.sourceSelectedCount(e.filesWaiting)))]) : e._e(), e._v(" "), n("span", { staticClass: "fsp-source-list__icon fsp-icon", class: "fsp-icon--" + e.sourceName }), e._v(" "), n("span", { staticClass: "fsp-source-list__label" }, [e._v(e._s(e.t(e.sourceLabel)))]), e._v(" "), e.isAuthorized ? n("span", { staticClass: "fsp-source-list__logout", on: { click: function click(t) {
              t.stopPropagation(), e.logout(e.sourceName);
            } } }, [e._v(e._s(e.t("Sign Out")))]) : e._e(), e._v(" "), e.isMobileLocal ? n("input", { ref: "mobileLocaInput", staticClass: "fsp-local-source__fileinput", attrs: { type: "file" }, on: { change: function change(t) {
              e.onFilesSelected(t);
            } } }) : e._e()]);
      }, staticRenderFns: [], props: ["sourceName", "sourceLabel", "isHidden"], computed: hi({}, Xr.mapGetters(["filesWaiting", "route", "uploadStarted", "cloudsAuthorized", "mobileNavActive", "maxFiles", "accept"]), { isSelectedSource: function isSelectedSource() {
          return "summary" !== this.route[0] && (this.route.length > 1 ? this.route[1] : "local_file_system") === this.sourceName;
        }, isAuthorized: function isAuthorized() {
          return this.cloudsAuthorized[this.sourceName];
        }, isMobileLocal: function isMobileLocal() {
          return this.mobileNavActive && "local_file_system" === this.sourceName;
        } }), methods: hi({}, Xr.mapActions(["updateMobileNavActive", "addFile", "logout"]), { onNavClick: function onNavClick(e) {
          this.isMobileLocal ? this.openSelectFile() : (this.updateMobileNavActive(!1), this.$store.commit("CHANGE_ROUTE", ["source", e]));
        }, sourceSelectedCount: function sourceSelectedCount(e) {
          var t = this;return e.filter(function (e) {
            return e.source === t.sourceName;
          }).length;
        }, openSelectFile: function openSelectFile() {
          this.$refs.mobileLocaInput.click();
        }, onFilesSelected: function onFilesSelected(e) {
          for (var t = e.target.files, n = 0; n < t.length; n += 1) {
            this.addFile(t[n]);
          }
        } }) },
        ra = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", { staticClass: "fsp-modal__sidebar", class: { "fsp-mobile-nav-active": e.mobileNavActive } }, [n("div", { staticClass: "fsp-source-list" }, [e._l(e.paginatedSources, function (e) {
          return n("source-nav-item", { key: e.name, attrs: { "is-hidden": e.isHidden, "source-name": e.name, "source-label": e.label } });
        }), e.fromSources.length > this.offset + 1 ? n("div", { staticClass: "fsp-source-list__item fsp-source-list__more", on: { click: e.updateIndex } }, [n("span", { staticClass: "fsp-source-list__icon fsp-source-list__more-icon" }), e._v(" "), n("span", { staticClass: "fsp-source-list__label" }, [e._v("More")])]) : e._e()], 2)]);
      }, staticRenderFns: [], components: { SourceNavItem: oa }, computed: hi({}, Xr.mapGetters(["fromSources", "mobileNavActive"]), { paginatedSources: function paginatedSources() {
          var e = this;return this.fromSources.map(function (t, n) {
            return n >= e.index && n <= e.index + e.offset ? t : hi({}, t, { isHidden: !0 });
          });
        } }), data: function data() {
        return { offset: 7, index: 0 };
      }, methods: { updateIndex: function updateIndex() {
          this.paginatedSources.filter(function (e) {
            return !e.isHidden;
          }).length <= this.offset ? this.index = 0 : this.index = this.index + (this.offset + 1);
        } } },
        aa = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", { staticClass: "fsp-picker" }, [n("div", { staticClass: "fsp-modal" }, [e.isTransformer ? e._e() : n("sidebar"), e._t("sidebar"), n("div", { staticClass: "fsp-modal__body", class: e.getModalClasses }, [e._t("header"), n("div", { staticClass: "fsp-content", class: e.getContentClasses }, [e._t("body")], 2), e._t("footer")], 2)], 2), e._m(0)]);
      }, staticRenderFns: [function () {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", { staticClass: "fsp-picker__footer" }, [e._v("Powered by "), n("span", { staticClass: "fsp-icon--filestack" }), e._v(" Filestack")]);
      }], components: { Sidebar: ra }, computed: hi({}, Xr.mapGetters(["cropEnabled", "filtersEnabled", "filesWaiting", "route", "uploadStarted"]), { isTransformer: function isTransformer() {
          return "transform" === this.route[0];
        }, isTransformerDisabled: function isTransformerDisabled() {
          return !this.cropEnabled && !this.filtersEnabled;
        }, getContentClasses: function getContentClasses() {
          return { "fsp-content--selected-items": this.filesWaiting.length > 0 || this.uploadStarted };
        }, getModalClasses: function getModalClasses() {
          return { "fsp-modal__body--transformer": this.isTransformer, "fsp-modal__body--transformer-disabled": this.isTransformer && this.isTransformerDisabled };
        } }) },
        sa = function sa(e) {
      return -1 !== e.indexOf("/");
    },
        ca = function ca(e, t) {
      return e.mimetype && "image/*" === t ? -1 !== e.mimetype.indexOf("image/") : e.mimetype && "video/*" === t ? -1 !== e.mimetype.indexOf("video/") : e.mimetype && "audio/*" === t ? -1 !== e.mimetype.indexOf("audio/") : e.mimetype && "application/*" === t ? -1 !== e.mimetype.indexOf("application/") : e.mimetype && "text/*" === t ? -1 !== e.mimetype.indexOf("text/") : e.mimetype === t;
    },
        la = function la(e) {
      return (/\.\w+$/.exec(e)[0]
      );
    },
        ua = function ua(e) {
      return e.replace(".", "");
    },
        da = function da(e, t) {
      return ua(la(e.name)) === ua(t);
    },
        fa = function fa(e, t) {
      return void 0 === t || t.some(function (t) {
        return sa(t) ? ca(e, t) : da(e, t);
      });
    },
        pa = function pa(e) {
      var t = { filename: e.name, mimetype: e.mimetype || e.type, size: e.size, source: e.source, url: e.url, handle: e.handle };return e.status && (t.status = e.status), e.key && (t.key = e.key), e.container && (t.container = e.container), t;
    },
        ma = function ma(e) {
      return e.map(pa);
    },
        ha = function ha(e) {
      return e >= 1048576 ? Math.round(e / 1048576) + "MB" : e >= 1024 ? Math.round(e / 1024) + "KB" : e + "B";
    },
        ga = function ga(e) {
      if (e.name.length < 45) return e.name;var t = e.name.split(".");if (2 === t.length) {
        return t[0].substring(0, 42) + ".." + "." + t[1];
      }if (t.length > 2) {
        return e.name.substring(0, 42) + ".." + "." + t[t.length - 1];
      }return e.name.substring(0, 42) + "...";
    },
        va = function va(e) {
      return e.mimetype && -1 !== e.mimetype.indexOf("image/");
    },
        _a = function _a(e) {
      return e.mimetype && -1 !== e.mimetype.indexOf("audio/");
    },
        ya = function ya() {
      return Math.round(255 * Math.random()).toString(16);
    },
        Ea = function Ea(e) {
      for (var t = ""; t.length < 2 * e;) {
        t += ya();
      }return t;
    },
        ba = { Add: "Tilføj", My: "Min", Connect: "Forbind", View: "Vis", Upload: "Upload", Filter: "Filtrer", Images: "Billeder", of: "af", Loading: "Indlæser", Revert: "Gør om", Edit: "Rediger", More: "Mere", Uploaded: "Uploaded", "Web Search": "søgning på internettet", "Take Picture": "Tage billede", "A new page will open to connect your account.": "En ny side vil åbne for at forbinde med din konto", "My Device": "Min enhed", "or Drag and Drop, Copy and Paste Files": "Eller træk og slip, kopier og indsæt filer", "Pick Your Files": "Vælg dine filer", "Select Files to Upload": "Vælg filer til upload", "Selected Files": "Valgte filer", "Select Files from": "Vælg filer fra", "We only extract images and never modify or delete them.": "Vi hiver kun billeder og modificerer eller sletter dem aldrig", "You need to authenticate with ": "Du skal godkende med ", "Search images": "Søg billeder", "Sign Out": "Log ud", "Select From": "Vælg fra", "View/Edit Selected": "Vis/rediger valgte", "Deselect All": "Fravælg alle", "Files & Folders": "Filer og foldere", "Edited Images": "Redigerede filer", "Go Back": "Gå tilbage", "No search results found for": "Ingen resultater fundet for", "Please select": "Vælg venligst", "more file": "fil mere", "more files": "flere filer", "File {displayName} is not an accepted file type. The accepted file types are {types}": "Filen {displayName} er ikke i et acceptabelt format. De accepterede formater er {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": " Filen {displayName} er for stor. Den accepterede filstørrelse er {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": " Vores filstørrelse er begrænset til {maxFiles} {filesText}" },
        Ca = { Add: "Hinzufügen", My: "Mein", Connect: "Verbinden mit", View: "Aussicht", Upload: "Hochladen", Filter: "Filtern", Images: "Bilder", of: "von", Loading: "Laden", Revert: "Rückgängig", Edit: "Bearbeiten", More: "Mehr", Uploaded: "Hochgeladen", "Web Search": "Internetsuche", "Take Picture": "Foto machen", "A new page will open to connect your account.": "Eine neue Seite wird geöffnet, um Ihr Konto zu verbinden", "My Device": "Mein Gerät", "or Drag and Drop, Copy and Paste Files": "oder ziehen, kopieren und Einfügen von Dateien", "Pick Your Files": "Wählen Sie Ihre Dateien", "Select Files to Upload": "Wählen Sie Dateien hochladen", "Selected Files": "Ausgewählten Dateien", "Select Files from": "Wählen Sie Dateien aus", "We only extract images and never modify or delete them.": "Wir extrahieren Bilder nur und modifizieren oder löschen sie niemals", "You need to authenticate with ": "Sie müssen sich mit anmelden ", "Search images": "Suche bilder", "Sign Out": "Abmelden", "Select From": "Wählen Sie aus", "View/Edit Selected": "Anzeigen/Bearbeiten ausgewählt", "Deselect All": "Deaktivieren Sie alle", "Files & Folders": "Dateien und Ordner", "Edited Images": "Bearbeitete Bilder", "Go Back": "Zurück", "No search results found for": "Keine Suchergebnisse gefunden für", "Please select": "Bitte wählen Sie", "more file": "weitere Datei", "more files": "weitere Dateien", "File {displayName} is not an accepted file type. The accepted file types are {types}": "Datei-{displayName} ist keine anerkannte Dateityp. Die akzeptierten Dateitypen sind {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "{displayName} Datei ist zu groß. Die akzeptierten Dateigröße beträgt {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "Unser Dateigrößenlimit ist {maxFiles} {filesText}" },
        Sa = { "File {displayName} is not an accepted file type. The accepted file types are {types}": "File {displayName} is not an accepted file type. The accepted file types are {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "File {displayName} is too big. The accepted file size is less than {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "Our file upload limit is {maxFiles} {filesText}" },
        Ta = { Add: "Añadir", My: "Mi", Connect: "Conectar", View: "Ver", Upload: "Subir", Filter: "Filtrar", Images: "Imágenes", of: "de", Loading: "Cargando", Revert: "Deshacer", Edit: "Editar", More: "Mas", Uploaded: "Subido", "Web Search": "Búsqueda de Internet", "Take Picture": "Tomar la foto", "A new page will open to connect your account.": "Se abrirá una nueva página para conectar tu cuenta.", "My Device": "Mi Dispositivo", "or Drag and Drop, Copy and Paste Files": "O arrastrar y soltar, copiar y pegar archivos", "Pick Your Files": "Elige tus archivos", "Select Files to Upload": "Seleccionar archivos para cargar", "Selected Files": "Archivos seleccionados", "Select Files from": "Seleccione Archivos de", "We only extract images and never modify or delete them.": "Sólo extraemos imágenes y nunca las modificamos o eliminamos", "You need to authenticate with ": "Debe autenticarse con", "Search images": "Búsqueda de imágenes", "Sign Out": "Desconectar", "Select From": "Seleccione de", "View/Edit Selected": "Ver/Editar Seleccionado", "Deselect All": "Deseleccionar Todo", "Files & Folders": "Archivos y Carpetas", "Edited Images": "Imágenes editadas", "Go Back": "Volver", "No search results found for": "No hay resultados de búsqueda para", "Please select": "Por favor, seleccione", "more file": "el archivo más", "more files": "el archivo más", "File {displayName} is not an accepted file type. The accepted file types are {types}": "Archivo {displayName} no es un tipo de archivo aceptado. Los tipos de archivo aceptados son {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "{displayName} De archivo es demasiado grande. El tamaño aceptado es {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "Nuestro límite de upload de archivo es {maxFiles} {filesText}" },
        Aa = { Add: "Ajouter", My: "Ma", Connect: "Relier", View: "Vue", Upload: "Télécharger", Filter: "Filtrer", Images: "Images", of: "sur", Loading: "Chargement", Revert: "Annuler", Edit: "Modifier", More: "Plus", Uploaded: "Téléchargées", "Web Search": "Recherche Internet", "Take Picture": "Prendre une Photo", "A new page will open to connect your account.": "Une nouvelle page s'ouvrira pour connecter votre compte.", "My Device": "Mon appareil", "or Drag and Drop, Copy and Paste Files": "ou faites glisser, copier et coller des fichiers", "Pick Your Files": "Choisissez vos fichiers", "Select Files to Upload": "Sélectionnez les fichiers à télécharger", "Selected Files": "Fichiers sélectionnés", "Select Files from": "Sélectionnez les fichiers à partir de", "We only extract images and never modify or delete them.": "Nous ne faisons qu'extraire les images, et ne les modifions ou supprimons jamais.", "You need to authenticate with ": "Vous devez vous authentifier avec ", "Search images": "Rechercher des images", "Sign Out": "Déconnecter", "Select From": "Sélectionnez dans", "View/Edit Selected": "Afficher/modifier sélectionnée", "Deselect All": "Désélectionner tout", "Files & Folders": "Fichiers et dossiers", "Edited Images": "Images éditées", "Go Back": "Retour", "No search results found for": "Aucun résultat de recherche trouvé pour", "Please select": "Veuillez sélectionner", "more file": "plus de fichier", "more files": "plus de fichiers", "File {displayName} is not an accepted file type. The accepted file types are {types}": "{displayName} De fichier n’est pas un type de fichier accepté. Les types de fichiers acceptés sont {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "Le fichier {displayName} est trop grand. La taille de fichier acceptée est {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "Notre limite de téléchargement de fichier est {maxFiles} {filesText}" },
        Fa = { Add: "Aggiungere", My: "Mio", Connect: "Collegare", View: "Visualizza", Upload: "Caricare", Filter: "Filtrare", Images: "Immagini", of: "di", Loading: "Caricamento", Revert: "Annulla", Edit: "Modifica", More: "Più", Uploaded: "Caricato", "Web Search": "Scatta Foto", "Take Picture": "Fare una foto", "A new page will open to connect your account.": "Si aprirà una nuova pagina per collegare il tuo account", "My Device": "Il mio dispositivo", "or Drag and Drop, Copy and Paste Files": "o trascinare, copiare e incollare file", "Pick Your Files": "Selezionare i file", "Select Files to Upload": "Selezionare i file da caricare", "Selected Files": "File selezionati", "Select Files from": "Selezionare i file da", "We only extract images and never modify or delete them.": "Abbiamo estratto solo immagini e non modificarli o cancellarli.", "You need to authenticate with": "È necessario autenticarsi con", "Search images": "Ricerca immagini", "Sign Out": "Esci", "Select From": "Selezionare da", "View/Edit Selected": "Visualizza/Modifica selezionato", "Deselect All": "Deselezionare tutto", "Files & Folders": "File e cartelle", "Edited Images": "Immagini Modificate", "Go Back": "Indietro", "No search results found for": "È il nostro limite di upload di file", "Please select": "Si prega di selezionare", "more file": "più file", "more files": "più file", "File {displayName} is not an accepted file type. The accepted file types are {types}": "{displayName} File non è un tipo di file accettato. I tipi di file accettati sono {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "{displayName} Arquivo é muito grande. O tamanho de arquivo aceito é {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "È il nostro limite di upload di file {maxFiles} {filesText}" },
        wa = { Add: "追加", My: "私の", Connect: "接続", View: "閲覧", Upload: "アップロード", Filter: "フィルター", Images: "画像", of: "の", Loading: "ロード中", Revert: "元に戻す", Edit: "編集", More: "詳細", Uploaded: "アップロード完了", "Web Search": "ウェブ検索", "Take Picture": "写真を撮る", "A new page will open to connect your account.": "マイページに移動します", "My Device": "マイデバイス", "or Drag and Drop, Copy and Paste Files": "または、ファイルをドラッグ・アンド・ドロップ、コピー・アンド・ペーストする", "Pick Your Files": "ファイルを選択", "Select Files to Upload": "アップロードするファイルを選択", "Selected Files": "選択済のファイル", "Select Files from": "からファイルを選択", "We only extract images and never modify or delete them.": "画像の抽出だけを行い、修正や削除をすることはありません", "You need to authenticate with ": "を認証してください ", "Search images": "画像を検索", "Sign Out": "サインアウト", "Select From": "から選択", "View/Edit Selected": "選択したファイルを閲覧/編集", "Deselect All": "選択を全て解除", "Files & Folders": "ファイルとフォルダー", "Edited Images": "編集された画像", "Go Back": "戻る", "No search results found for": "に対する検索結果は見つかりませんでした", "Please select": "選択してください", "more file": "追加ファイル", "more files": "追加ファイル", "File {displayName} is not an accepted file type. The accepted file types are {types}": "ファイル名{displayName}は、送受信可能なファイル形式ではありません。受け入れ可能なファイル形式は{types}です", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "ファイル名{displayName}の容量が大きすぎます。送受信可能なファイルのサイズは{roundFileSize}です", "Our file upload limit is {maxFiles} {filesText}": "一度にアップロードできるファイルの上限は {maxFiles} {filesText}" },
        Ra = { Add: "Toevoegen", My: "Mijn", Connect: "Verbinding maken", View: "Bekijken", Upload: "Uploaden", Filter: "Filtreren", Images: "Afbeeldingen", of: "van de", Loading: "Laden", Revert: "Ongedaan maken", Edit: "Bewerken", More: "Meer", Uploaded: "Geüpload", "Web Search": "Zoeken op het web", "Take Picture": "Foto nemen", "A new page will open to connect your account.": "Een nieuwe pagina wordt geopend om verbinding maken met uw account", "My Device": "Mijn apparaat", "or Drag and Drop, Copy and Paste Files": "of slepen, kopiëren en plakken van bestanden", "Pick Your Files": "Kies uw bestanden", "Select Files to Upload": "Selecteer bestanden om te uploaden", "Selected Files": "Geselecteerde bestanden", "Select Files from": "Selecteer bestanden uit", "We only extract images and never modify or delete them.": "We halen alleen afbeeldingen en nooit wijzigen of verwijderen", "You need to authenticate with ": "U moet verifiëren bij ", "Search images": "Zoek beelden", "Sign Out": "Afmelden", "Select From": "Selecteren", "View/Edit Selected": "Bekijken/bewerken geselecteerd", "Deselect All": "Deselecteer alles", "Files & Folders": "Bestanden en mappen", "Edited Images": "Bewerkte Afbeeldingen", "Go Back": "Ga Bacl", "No search results found for": "Geen zoekresultaten gevonden voor", "Please select": "Gelieve te selecteren", "more file": "meer bestand", "more files": "meer bestanden", "File {displayName} is not an accepted file type. The accepted file types are {types}": "Bestand {displayName} is niet een geaccepteerde bestandstype. De geaccepteerde bestandstypen zijn {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "Bestand {displayName} is te groot. De aanvaarde vijl spanwijdte zit {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "Onze bestand uploaden limiet is {maxFiles} {filesText}" },
        Oa = { Add: "Dodaj", My: "Mój", Connect: "Połączyć", View: "Widok", Upload: "Prześlij pliki", Filter: "Szukaj", Images: "Obrazy", of: "z", Loading: "Ładowanie", Revert: "Cofnij", Edit: "Edytuj", More: "Więcej", Uploaded: "Przesłany", "Web Search": "Grafika z internetu", "Take Picture": "Zrób zdjęcie", "A new page will open to connect your account.": "Nowa strona zostanie otwarta w celu połączenia z Twoim kontem.", "My Device": "Moje urządzenie", "or Drag and Drop, Copy and Paste Files": "lub przeciągnij i upuść, kopiować i wklejać pliki", "Pick Your Files": "Wybierz swoje pliki", "Select Files to Upload": "Wybierz pliki do przesłania", "Selected Files": "Wybrane pliki", "Select Files from": "Wybierz pliki z", "We only extract images and never modify or delete them.": "Mamy tylko wyodrębnić obrazy i nigdy zmodyfikować lub usunąć je", "You need to authenticate with ": "Musisz uwierzytelnić", "Search images": "Szukaj obrazów", "Sign Out": "Wyloguj się", "Select From": "Wybierz z", "View/Edit Selected": "Wyświetl/Edytuj zaznaczone", "Deselect All": "Odznacz wszystko", "Files & Folders": "Pliki i Foldery", "Edited Images": "Edytowane obrazy", "Go Back": "Przejdź wstecz", "No search results found for": "Brak wyników wyszukiwania", "Please select": "Proszę wybrać", "more file": "więcej plików", "more files": "więcej plików", "File {displayName} is not an accepted file type. The accepted file types are {types}": "{displayName} Plik nie jest typem plików akceptowane. Typy plików akceptowane są {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "{displayName} Plik jest zbyt duże. Rozmiar plików akceptowane jest {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "Nasz limit uploadu pliku jest {maxFiles} {filesText}" },
        ka = { Add: "Adicionar", My: "Meu", Connect: "Conectar-se", View: "Ver", Upload: "Carregar", Filter: "Ordenar", Images: "Imagens", of: "de", Loading: "Carregamento", Revert: "Desfazer", Edit: "Editar", More: "Mais", Uploaded: "Carregado", "Web Search": "Buscar imagens na Web", "Take Picture": "Tire uma foto", "A new page will open to connect your account.": "Uma nova página será aberta para conectar a sua conta.", "My Device": "Meu dispositivo", "or Drag and Drop, Copy and Paste Files": "ou arrastar, copiar e colar arquivos", "Pick Your Files": "Selecione seus arquivos", "Select Files to Upload": "Selecionar arquivos para upload", "Selected Files": "Arquivos selecionados", "Select Files from": "Selecione arquivos de", "We only extract images and never modify or delete them.": "Nós apenas extraímos as imagens e nunca a modificamos ou a removemos.", "You need to authenticate with ": "Você precisar se autenticar com", "Search images": "Procurar fotos", "Sign Out": "Desconectar", "Select From": "Selecione de", "View/Edit Selected": "Exibir/Editar selecionada", "Deselect All": "Desmarcar todos", "Files & Folders": "Arquivos e pastas", "Edited Images": "Imagens editadas", "Go Back": "Voltar", "No search results found for": "Nenhum resultado de pesquisa encontrado para", "Please select": "Por favor selecione", "more file": "arquivo mais", "more files": "mais arquivos", "File {displayName} is not an accepted file type. The accepted file types are {types}": " Arquivo {displayName} não é um tipo de arquivo aceitos. Os tipos de arquivo aceitos são {types}",
      "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "{displayName} Arquivo é muito grande. O tamanho de arquivo aceito é {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "É o nosso limite de upload de arquivo {maxFiles} {filesText}" },
        Na = { Add: "Добавить", My: "Мой", Connect: "подключить", View: "просмотреть", Upload: "загрузить", Filter: "сортировать по дате", Images: "фото", of: "из", Loading: "загрузки", Revert: "Отменить", Edit: "Изменить", More: "больше", Uploaded: "загружены", "Web Search": "Поиск изображений в сети", "Take Picture": "Фотографировать", "A new page will open to connect your account.": "Новая страница открывается чтобы подключить ваш аккаунт", "My Device": "Моё устройство", "or Drag and Drop, Copy and Paste Files": "или перетаскивать, копировать и вставлять файлы", "Pick Your Files": "Выберите файлы", "Select Files to Upload": "Выберите файлы для загрузки", "Selected Files": "Выбранные файлы", "Select Files from": "Выбрать файлы", "We only extract images and never modify or delete them.": "Мы просто извлекаем фото, а никогда не их изменяем или удалим", "You need to authenticate with ": "Требуется аутентификация аккаунта с ", "Search images": "поиск фото", "Sign Out": "выйти", "Select From": "выбрать в...", "View/Edit Selected": "просмотреть/редактировать", "Deselect All": "отмена", "Files & Folders": "файлы и папки", "Edited Images": "Отредактированные изображения", "Go Back": "Вернуться", "No search results found for": "Нет результатов поиска найдено для", "Please select": "Пожалуйста, выберите", "more file": "более файла", "more files": "больше файлов", "File {displayName} is not an accepted file type. The accepted file types are {types}": "{displayName} Файлов не является типом прикладываемых файлов. Типы прикладываемых файлов являются {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "{displayName} Файл слишком большой. Признанных файл имеет размер {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "Наш предел загрузки файлов {maxFiles} {filesText}" },
        La = { Add: "再添加", My: "我的", Connect: "连接", View: "看", Upload: "上传", Filter: "过滤", Images: "图片", of: "/", Loading: "载入中", Revert: "还原", Edit: "编辑", More: "更多", Uploaded: "已上传", "Web Search": "为图片搜索网络", "Take Picture": "拍照", "A new page will open to connect your account.": "一个新页面会打开以关联您的帐户", "My Device": "我的设备", "or Drag and Drop, Copy and Paste Files": "或拖放，复制和粘贴文件", "Pick Your Files": "选择您的文件", "Select Files to Upload": "选择要上传的文件", "Selected Files": "所选文件", "Select Files from": "从中选择文件", "We only extract images and never modify or delete them.": "我们只提取图像，从不修改或删除它们", "You need to authenticate with": "您需要验证", "Search images": "搜索图像", "Sign Out": "登出", "Select From": "选择自", "View/Edit Selected": "查看/编辑所选项", "Deselect All": "取消选择全部", "Files & Folders": "文件和文件夹", "Edited Images": "编辑的图像", "Go Back": "返回", "No search results found for": "未找到搜索结果", "Please select": "请选择", "more file": "更多文件", "more files": "更多文件", "File {displayName} is not an accepted file type. The accepted file types are {types}": " 文件{displayName}不是可接受的文件类型。 可接受的文件类型为{types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": " 文件{displayName}太大。 可接受的文件大小为{roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "我们的文件上传限制为 {maxFiles} {filesText}" },
        Ia = { da: ba, de: Ca, en: Sa, es: Ta, fr: Aa, it: Fa, ja: wa, nl: Ra, pl: Oa, pt: ka, ru: Na, zh: La },
        xa = function xa() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "en",
          t = Ia[e];return { ERROR_FILE_NOT_ACCEPTABLE: t["File {displayName} is not an accepted file type. The accepted file types are {types}"], ERROR_FILE_TOO_BIG: t["File {displayName} is too big. The accepted file size is less than {roundFileSize}"], ERROR_MAX_FILES_REACHED: t["Our file upload limit is {maxFiles} {filesText}"] };
    },
        Da = Or.context("picker"),
        Ua = function Ua(e) {
      return e.source + e.path;
    },
        Ma = function Ma(e, t) {
      return e.map(function (e) {
        return Ua(e);
      }).indexOf(Ua(t));
    },
        $a = function $a(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = 0,
          i = function i(e) {
        if ((e instanceof File || e instanceof Blob) && (e = { source: "local_file_system", mimetype: e.type, name: e.name, path: e.name, size: e.size, originalFile: e }), "dragged-from-web" === e.source) {
          e.name = e.url.split("/").pop(), e.path = e.url, e.mimetype = "text/html";var t = e.url.split(".").pop(),
              n = ["jpg", "jpeg", "png", "tiff", "gif", "bmp"];t && -1 !== n.indexOf(t.toLowerCase()) && (e.thumbnail = e.url, e.mimetype = "image/" + t);
        }return e.uploadToken = Ea(16), e.progress = 0, e.progressSize = 0, e;
      },
          o = function o(e, t) {
        var n = function n(e) {
          var n = void 0;return e.some(function (e) {
            return e.uploadToken === t && (n = e, !0);
          }), n;
        };return n(e.waiting) || n(e.uploading) || n(e.done) || n(e.failed);
      },
          r = function r(e, t) {
        if (-1 !== Ma(e.getters.filesWaiting, t)) return e.commit("CANCEL_UPLOAD", t.uploadToken), void e.commit("DESELECT_FILE", t);if (t.folder) return void e.dispatch("addCloudFolder", { name: t.source, path: t.path });if (!function () {
          if (e.getters.allFilesInQueueCount === e.getters.maxFiles) {
            var t = 1 === e.getters.maxFiles ? "file" : "files",
                n = xa(e.getters.lang).ERROR_MAX_FILES_REACHED.replace("{maxFiles}", e.getters.maxFiles).replace("{filesText}", t);return e.dispatch("showNotification", n), !0;
          }return !1;
        }()) {
          var n = i(t);(function (t) {
            if (fa(t, e.getters.accept)) return !0;var n = xa(e.getters.lang).ERROR_FILE_NOT_ACCEPTABLE.replace("{displayName}", ga(t)).replace("{types}", e.getters.accept);return e.dispatch("showNotification", n), !1;
          })(n) && function (t) {
            if (void 0 !== e.getters.onFileSelected) try {
              var n = e.getters.onFileSelected(pa(t));return n && "string" == typeof n.name && (t.originalFile && (t.originalFile.newName = n.name), t.name = n.name), !0;
            } catch (t) {
              return e.dispatch("showNotification", t.message), !1;
            }return !0;
          }(n) && function (t) {
            if (void 0 === e.getters.maxSize) return !0;if (t.size < e.getters.maxSize) return !0;if (!t.size) return !0;var n = xa(e.getters.lang).ERROR_FILE_TOO_BIG.replace("{displayName}", ga(t)).replace("{roundFileSize}", ha(e.getters.maxSize));return e.dispatch("showNotification", n), !1;
          }(n) && (Da("Selected file:", t), e.commit("MARK_FILE_AS_WAITING", n), function () {
            !0 === e.getters.startUploadingWhenMaxFilesReached && e.getters.filesWaiting.length === e.getters.maxFiles ? e.dispatch("startUploading", !0) : e.getters.uploadInBackground && e.dispatch("startUploading");
          }(), !va(n) || 1 !== e.getters.maxFiles || e.getters.disableTransformer || e.getters.uploadStarted ? 1 === e.getters.maxFiles ? (e.commit("CHANGE_ROUTE", ["summary"]), e.commit("UPDATE_MOBILE_NAV_ACTIVE", !1)) : e.getters.maxFiles > 1 && e.getters.allFilesInQueueCount === e.getters.maxFiles && "summary" !== e.getters.route[0] ? (e.commit("CHANGE_ROUTE", ["summary"]), e.commit("UPDATE_MOBILE_NAV_ACTIVE", !1)) : e.getters.maxFiles > 1 && "local_file_system" === n.source && "summary" !== e.getters.route[0] && (e.commit("CHANGE_ROUTE", ["summary"]), e.commit("UPDATE_MOBILE_NAV_ACTIVE", !1)) : e.dispatch("stageForTransform", n));
        }
      },
          a = function a(e, t) {
        if ("local_file_system" === t.source) {
          var n = window.URL.createObjectURL(t.originalFile);e.commit("SET_FILE_FOR_TRANSFORM", t), e.commit("SET_IMAGE_URL", n);
        }e.commit("SET_IMAGE_UPLOADING", !0), e.commit("SET_FILE_FOR_TRANSFORM", t), e.dispatch("uploadFileToTemporaryLocation", t.uploadToken).then(function (t) {
          e.commit("SET_IMAGE_UPLOADING", !1), e.getters.originalUrl !== t.url && (e.commit("SET_ORIGINAL_URL", t.url), e.commit("SET_IMAGE_URL", t.url));
        }).catch(function () {
          e.commit("SET_IMAGE_UPLOADING", !1);
        }), e.commit("CHANGE_ROUTE", ["transform", t.uploadToken]), e.commit("UPDATE_MOBILE_NAV_ACTIVE", !1);
      },
          s = function s(t) {
        var i = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            o = function o(e) {
          var n = function n(e, t, _n2) {
            return e < t ? t : e > _n2 ? _n2 : e;
          },
              i = function i() {
            var i = e.progress / 100,
                o = void 0;i > 1 || (o = i >= 0 && i < .2 ? .1 : i >= .2 && i < .5 ? .04 : i >= .5 && i < .8 ? .02 : i >= .8 && i < .99 ? .005 : 0, i = n(i + o, 0, .994), t.commit("SET_FILE_UPLOAD_PROGRESS", { uploadToken: e.uploadToken, progress: Math.round(100 * i) }));
          };return function t() {
            setTimeout(function () {
              100 !== e.progress && (i(), t());
            }, 200);
          }();
        },
            r = function r() {
          return n < 4 && t.state.waiting.length > 0;
        },
            a = function a() {
          return 0 === n && 0 === t.state.waiting.length && 0 === t.state.uploading.length;
        },
            s = function s() {
          var i = t.state.waiting[0],
              r = {},
              a = void 0;if (i.tempStorage && !i.transformed) t.getters.uploadStarted && t.commit("SET_FILE_UPLOAD_PROGRESS", { uploadToken: i.uploadToken, progress: 100 }), a = Promise.resolve(i.tempStorage);else if (i.transformed && !i.transformedFile) a = e.storeURL(i.transformed, hi({}, t.getters.storeTo, { filename: i.name }), r);else if (i.transformedFile) t.getters.uploadStarted && t.commit("SET_FILE_UPLOAD_PROGRESS", { uploadToken: i.uploadToken, progress: 100 }), a = Promise.resolve(i.transformedFile);else if ("local_file_system" === i.source) {
            var s = { retryOptions: null, onProgress: function onProgress(e) {
                t.getters.uploadStarted && (t.commit("SET_FILE_UPLOAD_PROGRESS", { uploadToken: i.uploadToken, progress: e.totalProgressPercent, progressSize: ha(e.progressTotal) }), void 0 !== t.getters.onFileUploadProgress && t.getters.onFileUploadProgress(pa(i), e));
              } };a = e.upload(i.originalFile, s, t.getters.storeTo, r);
          } else if ("source-url" === i.source || "dragged-from-web" === i.source) a = e.storeURL(i.path, hi({}, t.getters.storeTo, { filename: i.name }), r);else {
            if ("cloud" !== i.sourceKind) throw new Error("Can't upload this file");a = t.getters.preferLinkOverStore ? e.cloud(i.source).link(i.path) : e.cloud(i.source).store(i.path, t.getters.storeTo, r);
          }return n += 1, t.commit("MARK_FILE_AS_UPLOADING", i), r.cancel && t.commit("SET_CANCEL_TOKEN", { uploadToken: i.uploadToken, token: r }), Da("Upload started:", i), void 0 !== t.getters.onFileUploadStarted && t.getters.onFileUploadStarted(pa(i)), t.getters.uploadStarted && (i.transformed || "cloud" === i.sourceKind || "dragged-from-web" === i.source) && o(i), a.then(function (e) {
            t.getters.uploadStarted && (i.transformed || "cloud" === i.sourceKind || "dragged-from-web" === i.source) && t.commit("SET_FILE_UPLOAD_PROGRESS", { uploadToken: i.uploadToken, progress: 100 });var o = hi({}, i, e);n -= 1, t.commit("MARK_FILE_AS_DONE", { file: i, uploadMetadata: o }), t.commit("REMOVE_CANCEL_TOKEN", i.uploadToken), void 0 !== t.getters.onFileUploadFinished && t.getters.onFileUploadFinished(pa(o)), Da("Upload done:", i);
          }).catch(function (e) {
            t.commit("SET_FILE_UPLOAD_PROGRESS", { uploadToken: i.uploadToken, progress: 100 }), n -= 1, t.commit("MARK_FILE_AS_FAILED", i), t.commit("REMOVE_CANCEL_TOKEN", i.uploadToken), void 0 !== t.getters.onFileUploadFailed && t.getters.onFileUploadFailed(pa(i), e), e instanceof Error ? Da("Upload failed:", i, e.message) : Da("Upload failed:", i, e);
          }), a;
        };t.getters.uploadStarted || (i && (t.commit("SET_UPLOAD_STARTED", !0), t.commit("UPDATE_MOBILE_NAV_ACTIVE", !1), "transform" !== t.getters.route[0] && t.commit("CHANGE_ROUTE", ["summary"])), function e() {
          r() ? (s().then(e).catch(e), e()) : a() && t.getters.uploadStarted && t.dispatch("allUploadsDone");
        }());
      },
          c = function c(t, n) {
        var i = {},
            o = { retryOptions: null };return n.commit("SET_CANCEL_TOKEN", { uploadToken: t.uploadToken, token: i }), "local_file_system" === t.source ? e.upload(t.originalFile, o, {}, i) : "cloud" === t.sourceKind ? e.cloud(t.source).store(t.path, {}, i) : "dragged-from-web" === t.source ? e.storeURL(t.url, {}, i) : Promise.reject();
      },
          l = function l(e, t) {
        return new Promise(function (n, i) {
          var r = o(e.state, t),
              a = -1 !== Object.keys(e.state.pendingTokens).indexOf(t);if (r.tempStorage) n(r.tempStorage);else if (a) {
            !function r() {
              var a = o(e.state, t);if (a) {
                if (void 0 !== a.tempStorage) n(a.tempStorage);else {
                  var s = e.getters.filesFailed.map(function (e) {
                    return e.uploadToken;
                  });-1 !== s.indexOf(t) ? i() : setTimeout(r, 100);
                }
              } else n(null);
            }();
          } else c(r, e).then(function (i) {
            e.commit("REMOVE_CANCEL_TOKEN", t), o(e.state, t) && (e.commit("SET_FILE_TEMPORARY_STORAGE", { uploadToken: t, metadata: i }), i.uploadToken = t, n(i));
          }).catch(function () {
            i(), e.commit("REMOVE_CANCEL_TOKEN", t), e.dispatch("showNotification", r.name + " failed to upload. Please try again or check your network log.");
          });
        });
      };return t = hi({ uploadStarted: !1, waiting: [], uploading: [], done: [], failed: [], stagedForTransform: {}, pendingTokens: {} }, t), { state: t, mutations: { SET_UPLOAD_STARTED: function SET_UPLOAD_STARTED(e, t) {
            e.uploadStarted = t;
          }, MARK_FILE_AS_WAITING: function MARK_FILE_AS_WAITING(e, t) {
            e.waiting.push(t);
          }, DESELECT_FILE: function DESELECT_FILE(e, t) {
            var n = Ma(e.waiting, t),
                i = Ma(e.uploading, t),
                o = Ma(e.done, t),
                r = Ma(e.failed, t);switch ([n >= 0, i >= 0, o >= 0, r >= 0].indexOf(!0)) {case -1:
                throw new Error("Illegal operation for given file");case 0:
                e.waiting.splice(n, 1);break;case 1:
                e.uploading.splice(i, 1);break;case 2:
                e.done.splice(o, 1);break;case 3:
                e.failed.splice(r, 1);}
          }, DESELECT_FOLDER: function DESELECT_FOLDER(e, t) {
            var n = function n(e) {
              return e.filter(function (e) {
                return "cloud" !== e.sourceKind || e.path.indexOf(t.path) < 0;
              });
            };e.waiting = n(e.waiting), e.uploading = n(e.uploading), e.done = n(e.done), e.failed = n(e.failed);
          }, DESELECT_ALL_FILES: function DESELECT_ALL_FILES(e) {
            e.waiting.splice(0, e.waiting.length), e.uploading.splice(0, e.uploading.length), e.done.splice(0, e.done.length), e.failed.splice(0, e.failed.length);
          }, MARK_FILE_AS_UPLOADING: function MARK_FILE_AS_UPLOADING(e, t) {
            var n = Ma(e.waiting, t);if (-1 === n) throw new Error("Illegal operation for given file");e.waiting.splice(n, 1), e.uploading.push(t);
          }, MARK_FILE_AS_DONE: function MARK_FILE_AS_DONE(e, t) {
            var n = t.file,
                i = t.uploadMetadata,
                o = Ma(e.uploading, n);o >= 0 && (e.uploading.splice(o, 1), e.done.push(n), n.transformed ? nt.set(n, "transformedFile", i) : nt.set(n, "tempStorage", i), Object.keys(i).forEach(function (e) {
              nt.set(n, e, i[e]);
            }));
          }, MARK_FILE_AS_FAILED: function MARK_FILE_AS_FAILED(e, t) {
            var n = Ma(e.uploading, t);n >= 0 && (e.uploading.splice(n, 1), e.failed.push(t));
          }, SET_FILE_UPLOAD_PROGRESS: function SET_FILE_UPLOAD_PROGRESS(e, t) {
            var n = t.uploadToken,
                i = t.progress,
                r = t.progressSize,
                a = o(e, n);a && (nt.delete(a, "progress"), nt.set(a, "progress", i), nt.set(a, "progressSize", r));
          }, SET_FILE_TEMPORARY_STORAGE: function SET_FILE_TEMPORARY_STORAGE(e, t) {
            var n = t.uploadToken,
                i = t.metadata,
                r = o(e, n);nt.set(r, "tempStorage", i);
          }, SET_FILE_FOR_TRANSFORM: function SET_FILE_FOR_TRANSFORM(e, t) {
            e.stagedForTransform = t;
          }, SET_FILE_TRANSFORMATION: function SET_FILE_TRANSFORMATION(e, t) {
            var n = e.stagedForTransform;nt.set(n, "transformed", t);var i = Ma(e.done, n),
                o = Ma(e.failed, n),
                r = Ma(e.uploading, n),
                a = Ma(e.waiting, n);i >= 0 ? e.done.splice(i, 1) : r >= 0 ? e.uploading.splice(r, 1) : o >= 0 && e.failed.splice(i, 1), a < 0 && e.waiting.push(n);
          }, REMOVE_FILE_TRANSFORMATION: function REMOVE_FILE_TRANSFORMATION(e, t) {
            var n = o(e, t);nt.delete(n, "transformed"), nt.delete(n, "transformedFile"), n.originalFile && n.originalFile.size && nt.set(n, "size", n.originalFile.size);var i = Ma(e.done, n),
                r = Ma(e.failed, n),
                a = Ma(e.uploading, n),
                s = Ma(e.waiting, n);i >= 0 ? e.done.splice(i, 1) : a >= 0 ? e.uploading.splice(a, 1) : r >= 0 && e.failed.splice(i, 1), s < 0 && e.waiting.push(n);
          }, REMOVE_SOURCE_FROM_WAITING: function REMOVE_SOURCE_FROM_WAITING(e, t) {
            var n = e.waiting.filter(function (e) {
              return e.source !== t;
            });e.waiting = n;
          }, REMOVE_CLOUDS_FROM_WAITING: function REMOVE_CLOUDS_FROM_WAITING(e) {
            var t = e.waiting.filter(function (e) {
              return "cloud" !== e.sourceKind;
            });e.waiting = t;
          }, SET_CANCEL_TOKEN: function SET_CANCEL_TOKEN(e, t) {
            var n = t.uploadToken,
                i = t.token;e.pendingTokens[n] = i;
          }, REMOVE_CANCEL_TOKEN: function REMOVE_CANCEL_TOKEN(e, t) {
            delete e.pendingTokens[t];
          }, CANCEL_UPLOAD: function CANCEL_UPLOAD(e, t) {
            var n = e.pendingTokens[t];n && n.cancel && (n.cancel(), delete e.pendingTokens[t]);
          }, CANCEL_FOLDER_UPLOAD: function CANCEL_FOLDER_UPLOAD(e, t) {
            e.waiting.concat(e.uploading).filter(function (e) {
              return "cloud" !== e.sourceKind || e.path.indexOf(t.path) >= 0;
            }).map(function (e) {
              return e.uploadToken;
            }).forEach(function (t) {
              var n = e.pendingTokens[t];n && n.cancel && (n.cancel(), delete e.pendingTokens[t]);
            });
          }, CANCEL_ALL_UPLOADS: function CANCEL_ALL_UPLOADS(e) {
            Object.keys(e.pendingTokens).forEach(function (t) {
              var n = e.pendingTokens[t];n && n.cancel && n.cancel();
            }), e.pendingTokens = {};
          } }, actions: { addFile: r, startUploading: s, stageForTransform: a, uploadFileToTemporaryLocation: l, removeTransformation: function removeTransformation(e, t) {
            e.commit("REMOVE_FILE_TRANSFORMATION", t.uploadToken), e.commit("RESET_TRANSFORMATIONS");
          }, deselectAllFiles: function deselectAllFiles(e) {
            e.commit("CANCEL_ALL_UPLOADS"), e.commit("DESELECT_ALL_FILES");
          }, deselectFolder: function deselectFolder(e, t) {
            e.commit("CANCEL_FOLDER_UPLOAD", t), e.commit("DESELECT_FOLDER", t);
          } }, getters: { filesWaiting: function filesWaiting(e, t) {
            return t.uploadStarted ? e.waiting : [].concat(e.waiting, e.uploading, e.done, e.failed).sort(function (e, t) {
              return e.size - t.size;
            });
          }, filesUploading: function filesUploading(e, t) {
            return t.uploadStarted ? e.uploading : [];
          }, filesDone: function filesDone(e) {
            return e.done;
          }, filesFailed: function filesFailed(e) {
            return e.failed;
          }, allFilesInQueue: function allFilesInQueue(e, t) {
            return t.uploadStarted ? [].concat(t.filesWaiting, t.filesUploading, t.filesDone, t.filesFailed) : t.filesWaiting;
          }, allFilesInQueueCount: function allFilesInQueueCount(e, t) {
            return t.uploadStarted ? t.filesWaiting.length + t.filesUploading.length + t.filesDone.length + t.filesFailed.length : t.filesWaiting.length;
          }, filesNeededCount: function filesNeededCount(e, t) {
            return t.minFiles - t.filesWaiting.length;
          }, uploadStarted: function uploadStarted(e) {
            return e.uploadStarted;
          }, canStartUpload: function canStartUpload(e, t) {
            return t.filesWaiting.length >= t.minFiles;
          }, canAddMoreFiles: function canAddMoreFiles(e, t) {
            return t.filesWaiting.length < t.maxFiles;
          }, stagedForTransform: function stagedForTransform(e) {
            return e.stagedForTransform;
          } } };
    },
        Pa = function Pa(e) {
      var t = e.path.split("/");return t.pop(), e.folder ? e.path : t.join("/");
    },
        za = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return e.files.length > 0 ? n("div", { staticClass: "fsp-grid" }, [n("div", { staticClass: "fsp-grid__label" }, [e._v(e._s(e.t("Files & Folders")))]), e._l(e.onlyFolders, function (t) {
          return n("div", { staticClass: "fsp-grid__cell", class: { "fsp-grid__cell--selected": e.isSelected(t) }, on: { click: function click(n) {
                e.handleFolderClick(t);
              } } }, [e.isSelected(t) ? n("span", { staticClass: "fsp-badge fsp-badge--bright fsp-badge--file" }, [e._v(e._s(e.getFileCount(t)))]) : n("span", { staticClass: "fsp-grid__icon", class: e.getIconClass("fsp-grid__icon-folder", t) }), e._v(" "), n("span", { staticClass: "fsp-grid__text", class: { "fsp-grid__text--selected": e.isSelected(t) } }, [e._v(e._s(t.name))]), e._v(" "), e.isSelected(t) ? n("span", { staticClass: "fsp-grid__icon--selected", attrs: { title: "Deselect folder" }, on: { click: function click(n) {
                n.stopPropagation(), e.deselectFolder(t);
              } } }) : e._e(), e._v(" "), e.isLoading(t) || e.isSelected(t) ? e._e() : n("span", { staticClass: "fsp-grid__icon-folder-add", attrs: { title: "Add folder" }, on: { click: function click(n) {
                n.stopPropagation(), e.addFile(t);
              } } }), e.isLoading(t) ? n("div", { staticClass: "fsp-loading--folder" }) : e._e()]);
        }), e._l(e.onlyFiles, function (t) {
          return n("div", { staticClass: "fsp-grid__cell", class: { "fsp-grid__cell--selected": e.isSelected(t) }, on: { click: function click(n) {
                e.addFile(t);
              } } }, [e.isAudio(t) ? n("span", { staticClass: "fsp-grid__icon", class: e.getIconClass("fsp-grid__icon-audio", t) }) : "application/pdf" === t.mimetype ? n("span", { staticClass: "fsp-grid__icon", class: e.getIconClass("fsp-grid__icon-pdf", t) }) : "application/zip" === t.mimetype ? n("span", { staticClass: "fsp-grid__icon", class: e.getIconClass("fsp-grid__icon-zip", t) }) : n("span", { staticClass: "fsp-grid__icon", class: e.getIconClass("fsp-grid__icon-file", t) }), e._v(" "), n("span", { staticClass: "fsp-grid__text", class: { "fsp-grid__text--selected": e.isSelected(t) } }, [e._v(e._s(t.name))]), e._v(" "), e.isSelected(t) ? n("span", { staticClass: "fsp-grid__icon--selected" }) : e._e()]);
        })], 2) : e._e();
      }, staticRenderFns: [], computed: hi({}, Xr.mapGetters(["cloudFolders", "filesWaiting"]), { onlyFolders: function onlyFolders() {
          return this.files.filter(function (e) {
            return e.folder;
          });
        }, onlyFiles: function onlyFiles() {
          return this.files.filter(function (e) {
            return !e.folder;
          });
        } }), methods: hi({}, Xr.mapActions(["addFile", "deselectFolder", "goToDirectory"]), { handleFolderClick: function handleFolderClick(e) {
          this.goToDirectory(e);
        }, getIconClass: function getIconClass(e, t) {
          var n;return n = {}, mi(n, e, !this.isSelected(t)), mi(n, e + "--selected", this.isSelected(t)), n;
        }, isAudio: function isAudio(e) {
          return e && e.mimetype && -1 !== e.mimetype.indexOf("audio/");
        }, isLoading: function isLoading(e) {
          return !!e.folder && this.cloudFolders[e.path] && this.cloudFolders[e.path].loading;
        }, isSelected: function isSelected(e) {
          return e.folder ? this.filesWaiting.filter(function (t) {
            return Pa(t) === e.path;
          }).length > 0 : -1 !== Ma(this.filesWaiting, e);
        }, getFileCount: function getFileCount(e) {
          return this.filesWaiting.filter(function (t) {
            return Pa(t) === e.path;
          }).length;
        } }), props: ["files"] },
        Ga = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return e.images && e.images.length > 0 ? n("div", { staticClass: "fsp-grid" }, [n("div", { staticClass: "fsp-grid__label" }, [e._v(e._s(e.t("Images")))]), e._l(e.images, function (t) {
          return n("div", { key: t.path, staticClass: "fsp-image-grid__cell", class: { "fsp-image-grid__cell--selected": e.isSelected(t) }, on: { click: function click(n) {
                e.addFile(t);
              } } }, [e.isSelected(t) ? n("span", { staticClass: "fsp-image-grid__icon--selected" }) : e._e(), e._v(" "), n("img", { staticClass: "fsp-image-grid__image", class: { "fsp-image-grid__image--selected": e.isSelected(t) }, attrs: { src: t.thumbnail, alt: t.name } }), e.isSelected(t) ? n("div", { staticClass: "fsp-image-grid__cell--dark" }) : e._e()]);
        })], 2) : e._e();
      }, staticRenderFns: [], computed: hi({}, Xr.mapGetters(["filesWaiting"])), methods: hi({}, Xr.mapActions(["addFile"]), { isSelected: function isSelected(e) {
          return -1 !== Ma(this.filesWaiting, e);
        } }), props: ["images"] },
        ja = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", [n("file-array", { attrs: { files: e.arrayOfFiles } }), e.arrayOfFiles.length && e.arrayOfImages.length ? n("hr", { staticClass: "fsp-grid__separator" }) : e._e(), n("image-array", { attrs: { images: e.arrayOfImages } })], 1);
      }, staticRenderFns: [], components: { FileArray: za, ImageArray: Ga }, computed: hi({}, Xr.mapGetters(["listForCurrentCloudPath"]), { arrayOfImages: function arrayOfImages() {
          return this.listForCurrentCloudPath.filter(va);
        }, arrayOfFiles: function arrayOfFiles() {
          return this.listForCurrentCloudPath.filter(function (e) {
            return !va(e);
          });
        } }) },
        Wa = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", { staticClass: "fsp-breadcrumb__container" }, [e.crumbs.length < 3 ? n("span", e._l(e.crumbs, function (t) {
          return n("span", { staticClass: "fsp-breadcrumb__label", on: { click: function click(n) {
                e.handleClick(t);
              } } }, [e._v(e._s(t.label) + " ")]);
        })) : n("span", e._l(e.truncateCrumbs(e.crumbs), function (t) {
          return n("span", { staticClass: "fsp-breadcrumb__label", on: { click: function click(n) {
                e.handleClick(t);
              } } }, [e._v(e._s(t.label))]);
        }))]);
      }, staticRenderFns: [], props: ["crumbs", "onClick"], methods: { truncateCrumbs: function truncateCrumbs(e) {
          var t = [e[0]],
              n = e.filter(function (t, n) {
            return n >= e.length - 2;
          });return t.push.apply(t, [{ path: "", label: "..." }].concat(gi(n))), t;
        }, handleClick: function handleClick(e) {
          e.path && e.label && this.onClick(e);
        } } },
        Ha = { render: function render() {
        var e = this,
            t = e.$createElement;return (e._self._c || t)("div", { staticClass: "fsp-loading" });
      }, staticRenderFns: [] },
        Ba = function Ba(e) {
      var t = null == e ? 0 : e.length;return t ? e[t - 1] : void 0;
    },
        Va = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", { staticClass: "fsp-cloud" }, [e.cloudLoading || e.isPrefetching ? n("loading") : e._e(), !0 !== e.currentCloudAuthorized ? n("div", { staticClass: "fsp-source-auth__wrapper" }, [n("span", { staticClass: "fsp-icon-auth fsp-icon fsp-source-auth__el", class: "fsp-icon--" + e.currentCloudName }), n("div", { staticClass: "fsp-text__title fsp-source-auth__el" }, [e._v(e._s(e.t("Select Files from")) + " " + e._s(e.currentDisplay.label))]), n("div", { staticClass: "fsp-source-auth__el" }, [n("span", { staticClass: "fsp-text__subheader" }, [e._v(e._s(e.t("You need to authenticate with ")) + " "), n("span", { staticClass: "fsp-cloudname" }, [e._v(e._s(e.currentDisplay.label))]), e._v("."), n("div", [e._v(e._s(e.t("We only extract images and never modify or delete them.")))])])]), n("button", { staticClass: "fsp-button__auth fsp-source-auth__el", attrs: { type: "button" }, on: { click: e.authorize } }, [e._v(e._s(e.t("Connect")) + " "), n("span", { staticClass: "fsp-cloudname" }, [e._v(e._s(e.currentDisplay.label))])]), n("div", { staticClass: "fsp-source-auth__el" }, [n("span", { staticClass: "fsp-text__subheader" }, [e._v(e._s(e.t("A new page will open to connect your account.")))])])]) : e._e(), !0 === e.currentCloudAuthorized ? n("div", [e.currentCrumbs.length > 1 ? n("div", { staticClass: "fsp-cloud-breadcrumbs" }, [n("breadcrumbs", { attrs: { crumbs: e.currentCrumbs, "on-click": e.updatePath } })], 1) : e._e(), n("cloud-grid")], 1) : e._e()], 1);
      }, staticRenderFns: [], components: { CloudGrid: ja, Breadcrumbs: Wa, Loading: Ha }, computed: hi({}, Xr.mapGetters(["route", "currentCloudAuthorized", "currentCloudName", "currentCloudPath", "listForCurrentCloudPath", "cloudFolders", "cloudLoading", "cloudsPrefetching"]), { isPrefetching: function isPrefetching() {
          var e = this.currentCloudPath,
              t = e.length > 0 ? Ba(e) : e,
              n = this.currentCloudName + t;return this.cloudsPrefetching[n];
        }, currentDisplay: function currentDisplay() {
          var e = this.route[1];return ia(e);
        }, currentCrumbs: function currentCrumbs() {
          var e = this,
              t = [{ label: this.currentDisplay.label, path: "root" }];return this.currentCloudPath.length ? t.concat(this.currentCloudPath.map(function (t) {
            return { label: e.cloudFolders[t].name, path: t };
          })) : t;
        } }), methods: hi({}, Xr.mapActions(["showCloudPath"]), { authorize: function authorize() {
          var e = this,
              t = window.open(this.currentCloudAuthorized.authUrl, "_blank");!function n() {
            !0 !== t.closed ? setTimeout(n, 10) : e.showCloudPath({ name: e.route[1], path: e.route[2] });
          }();
        }, updatePath: function updatePath(e) {
          var t = this.currentCloudPath.indexOf(e.path),
              n = this.currentCloudPath.filter(function (e, n) {
            return n <= t;
          }),
              i = ["source", this.currentCloudName];"root" === e.path ? this.$store.commit("CHANGE_ROUTE", i) : (i.push(n), this.$store.commit("CHANGE_ROUTE", i));
        } }), watch: { route: { deep: !0, immediate: !0, handler: function handler(e) {
            var t = e[1],
                n = e[2];this.showCloudPath({ name: t, path: n });
          } } } },
        Ya = function Ya(e) {
      return new RegExp("Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile", "i").test(e);
    },
        Xa = function Xa(e) {
      return JSON.parse(JSON.stringify(e));
    },
        qa = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", { staticClass: "fsp-mobile-menu", on: { click: function click(t) {
              e.toggleNav();
            } } }, [n("div", { staticClass: "fsp-nav__menu-toggle" })]);
      }, staticRenderFns: [], computed: hi({}, Xr.mapGetters(["mobileNavActive", "route"]), { hideLocalOnMobile: function hideLocalOnMobile() {
          var e = Xa(this.route),
              t = e.pop();return !(!Ya(navigator.userAgent) || -1 === t.indexOf("local_file_system")) || !this.mobileNavActive;
        } }), methods: hi({}, Xr.mapActions(["updateMobileNavActive"]), { toggleNav: function toggleNav() {
          this.updateMobileNavActive(this.hideLocalOnMobile);
        } }) },
        Ka = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", { staticClass: "fsp-header", class: { "fsp-hide-header": e.hideHeader } }, [e.sourceName && !e.mobileNavActive ? n("span", { staticClass: "fsp-header-icon", class: "fsp-navbar--" + e.sourceName }) : e._e(), e._v(" "), e.mobileNavActive ? n("span", { staticClass: "fsp-header-text" }, [e._v(e._s(e.t("Select From")))]) : e._e(), e.mobileNavActive ? e._e() : e._t("default"), e.hideMenu ? e._e() : n("mobile-menu-button"), n("span", { staticClass: "fsp-picker__close-button fsp-icon--close-modal", on: { click: e.closePicker } })], 2);
      }, staticRenderFns: [], computed: hi({}, Xr.mapGetters(["mobileNavActive"])), components: { MobileMenuButton: qa }, methods: { closePicker: function closePicker() {
          this.$root.$destroy();
        } }, props: ["sourceName", "hideHeader", "hideMenu"] },
        Za = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", { staticClass: "fsp-footer", class: { "fsp-footer--appeared": e.isVisible } }, [n("div", { staticClass: "fsp-nav" }, [n("span", { staticClass: "fsp-nav__left" }, [e._t("nav-left")], 2), n("span", { staticClass: "fsp-nav__center", style: { width: e.fullWidth ? "100%" : null } }, [e._t("nav-center")], 2), n("span", { staticClass: "fsp-nav__right" }, [e._t("nav-right")], 2)])]);
      }, staticRenderFns: [], props: ["isVisible", "fullWidth"] },
        Qa = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", { staticClass: "fsp-image-search", class: { "fsp-image-search--results": e.resultsFound } }, [n("div", { staticClass: "fsp-image-search__form-container" }, [n("form", { staticClass: "fsp-image-search__form", on: { submit: function submit(t) {
              t.preventDefault(), e.focusAndFetch(t);
            } } }, [n("input", { ref: "searchInput", staticClass: "fsp-image-search__input", attrs: { placeholder: e.placeholderText, disabled: e.isSearching }, domProps: { value: e.imageSearchInput }, on: { input: e.updateInput } }), e._v(" "), e.imageSearchInput === e.imageSearchName ? n("button", { staticClass: "fsp-image-search__submit", on: { click: function click(t) {
              t.preventDefault(), e.clearSearch(t);
            } } }, [n("span", { staticClass: "fsp-image-search__icon--reset" })]) : e._e(), e._v(" "), e.imageSearchInput !== e.imageSearchName ? n("button", { staticClass: "fsp-image-search__submit", attrs: { type: "submit" } }, [n("span", { class: { "fsp-image-search__icon--search": !0, "fsp-image-search__icon--searching": e.isSearching } })]) : e._e()])]), n("div", { staticClass: "fsp-image-search__results", class: { "fsp-content--selected-items": e.filesWaiting.length } }, [n("image-array", { attrs: { images: e.imageSearchResults } })], 1)]);
      }, staticRenderFns: [], components: { ImageArray: Ga }, computed: hi({}, Xr.mapGetters(["isSearching", "noResultsFound", "resultsFound", "imageSearchName", "imageSearchInput", "imageSearchResults", "filesWaiting"]), { placeholderText: function placeholderText() {
          return this.t("Search images") + "...";
        } }), methods: hi({}, Xr.mapActions(["updateSearchInput", "fetchImages"]), { focusAndFetch: function focusAndFetch() {
          this.fetchImages(), this.$refs.searchInput.focus();
        }, updateInput: function updateInput(e) {
          this.updateSearchInput(e.target.value);
        }, clearSearch: function clearSearch() {
          this.updateSearchInput(""), this.$refs.searchInput.focus();
        } }) },
        Ja = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", { staticClass: "fsp-select-labels", class: { active: e.selectLabelIsActive } }, [n("div", { staticClass: "fsp-drop-area__title fsp-text__title" }, [e._v(e._s(e.t("Select Files to Upload")))]), n("div", { staticClass: "fsp-drop-area__subtitle fsp-text__subheader" }, [e._v(e._s(e.t("or Drag and Drop, Copy and Paste Files")))])]);
      }, staticRenderFns: [], computed: hi({}, Xr.mapGetters(["selectLabelIsActive"])) },
        es = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", [n("div", { ref: "dropArea", staticClass: "fsp-drop-area", on: { click: e.openSelectFile } }, [n("select-files-label"), n("input", { ref: "fileUploadInput", staticClass: "fsp-local-source__fileinput", attrs: { type: "file", id: "fsp-fileUpload", accept: e.acceptStr, multiple: e.multiple, disabled: !e.canAddMoreFiles }, on: { change: function change(t) {
              e.onFilesSelected(t);
            }, click: function click(t) {
              e.clearEvent(t);
            } } })], 1)]);
      }, staticRenderFns: [], components: { SelectFilesLabel: Ja }, computed: hi({}, Xr.mapGetters(["accept", "canAddMoreFiles", "filesWaiting", "maxFiles"]), { acceptStr: function acceptStr() {
          if (this.accept) return this.accept.join(",");
        }, selectedImages: function selectedImages() {
          return this.filesWaiting.filter(function (e) {
            return "local_file_system" === e.source;
          }).filter(va);
        }, multiple: function multiple() {
          return this.maxFiles > 1;
        } }), methods: hi({}, Xr.mapActions(["addFile", "updateSelectLabelActive"]), { clearEvent: function clearEvent(e) {
          e.target.value = null;
        }, onMouseover: function onMouseover() {
          this.updateSelectLabelActive(!0);
        }, onMouseout: function onMouseout() {
          this.updateSelectLabelActive(!1);
        }, onFilesSelected: function onFilesSelected(e) {
          for (var t = e.target.files, n = 0; n < t.length; n += 1) {
            this.addFile(t[n]);
          }
        }, openSelectFile: function openSelectFile() {
          this.$refs.fileUploadInput.click();
        } }), mounted: function mounted() {
        var e = this.$refs.dropArea;e && (e.addEventListener("mouseover", this.onMouseover), e.addEventListener("mouseout", this.onMouseout));
      } },
        ts = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("modal", [n("div", { slot: "header" }, [e.isInsideCloudFolder ? n("div", { staticClass: "fsp-summary__go-back", attrs: { title: "Go back" }, on: { click: e.goBack } }) : e._e(), n("content-header", { attrs: { "source-name": e.currentSource.name } })], 1), "local" === e.currentSource.ui ? n("local", { slot: "body" }) : e._e(), "cloud" === e.currentSource.ui ? n("cloud", { slot: "body" }) : e._e(), "imagesearch" === e.currentSource.ui ? n("image-search", { slot: "body" }) : e._e(), n("footer-nav", { attrs: { "is-visible": e.filesWaiting.length > 0 }, slot: "footer" }, [n("span", { staticClass: "fsp-footer-text", slot: "nav-left" }, [e._v(e._s(e.t("Selected Files")) + ": " + e._s(e.filesWaiting.length))]), e._v(" "), e.canStartUpload || 0 === e.filesWaiting.length ? e._e() : n("span", { slot: "nav-center" }, [e._v(e._s(e.getMinFilesMessage) + " ")]), n("span", { staticClass: "fsp-button fsp-button--primary", class: { "fsp-button--disabled": !e.canStartUpload }, attrs: { title: "Next" }, on: { click: e.goToSummary }, slot: "nav-right" }, [e._v(e._s(e.t("View/Edit Selected")))])])], 1);
      }, staticRenderFns: [], components: { Cloud: Va, ContentHeader: Ka, FooterNav: Za, ImageSearch: Qa, Local: es, Modal: aa }, computed: hi({}, Xr.mapGetters(["route", "filesWaiting", "cloudLoading", "currentCloudPath", "currentCloudAuthorized", "minFiles", "canStartUpload", "filesNeededCount", "mobileNavActive"]), { currentSource: function currentSource() {
          var e = this.route[1];return ia(e);
        }, getMinFilesMessage: function getMinFilesMessage() {
          return 1 === this.filesNeededCount ? this.t("Add") + " 1 " + this.t("more file") : this.filesNeededCount > 1 ? this.t("Add") + " " + this.filesNeededCount + " " + this.t("more files") : null;
        }, isInsideCloudFolder: function isInsideCloudFolder() {
          return "cloud" === this.currentSource.ui && this.currentCloudPath && 0 !== this.currentCloudPath.length && !this.mobileNavActive;
        } }), methods: hi({}, Xr.mapActions(["deselectAllFiles", "goBack", "updateMobileNavActive"]), { goToSummary: function goToSummary() {
          this.canStartUpload && (this.$store.commit("CHANGE_ROUTE", ["summary"]), this.updateMobileNavActive(!1));
        } }) },
        ns = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", { staticClass: "fsp-progress-bar" }, [n("div", { staticClass: "fsp-progress-bar__container" }, [n("div", { staticClass: "fsp-progress-bar__bar", style: e.styles })])]);
      },
      staticRenderFns: [], computed: { styles: function styles() {
          return { width: this.progress + "%" };
        } }, props: ["progress"] },
        is = "Expected a function",
        os = NaN,
        rs = "[object Symbol]",
        as = /^\s+|\s+$/g,
        ss = /^[-+]0x[0-9a-f]+$/i,
        cs = /^0b[01]+$/i,
        ls = /^0o[0-7]+$/i,
        us = parseInt,
        ds = "object" == pi(Fr) && Fr && Fr.Object === Object && Fr,
        fs = "object" == ("undefined" == typeof self ? "undefined" : pi(self)) && self && self.Object === Object && self,
        ps = ds || fs || Function("return this")(),
        ms = Object.prototype,
        hs = ms.toString,
        gs = Math.max,
        vs = Math.min,
        _s = function _s() {
      return ps.Date.now();
    },
        ys = ri,
        Es = Or.context("transformer"),
        bs = function bs(e) {
      return e + "px";
    },
        Cs = { topLeftX: "bottomRightX", topLeftY: "bottomRightY", bottomRightX: "topLeftX", bottomRightY: "topLeftY" },
        Ss = function Ss(e, t, n, i, o) {
      var r = e.imageNaturalWidth / (t.imageWidth - t.imageX),
          a = e.imageNaturalHeight / (t.imageHeight - t.imageY),
          s = { x: Math.round((n.topLeftX - t.imageX) * r), y: Math.round((n.topLeftY - t.imageY) * a), width: Math.round((n.bottomRightX - n.topLeftX) * r), height: Math.round((n.bottomRightY - n.topLeftY) * a) };n.topLeftX === t.imageX && n.topLeftY === t.imageY && n.bottomRightX === t.imageWidth && n.bottomRightY === t.imageHeight ? i.commit("REMOVE_TRANSFORMATION", "crop") : (i.commit("SET_TRANSFORMATION", { type: "crop", options: { dim: s } }), i.commit("SET_CROP_RECTANGLE", n)), o && (i.commit("REMOVE_TRANSFORMATION", "circle"), i.commit("SET_TRANSFORMATION", { type: "circle", options: {} }));
    },
        Ts = ys(function (e, t, n, i, o) {
      return Ss(e, t, n, i, o);
    }, 500),
        As = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("div", [n("div", { directives: [{ name: "show", rawName: "v-show", value: !e.imageLoading, expression: "!imageLoading" }], staticStyle: { position: "absolute", top: "0", left: "0" } }, [n("div", { ref: "cropArea", staticClass: "fst-crop__area", class: { "fst-crop__area--circle": e.hasCircle } }), n("div", { ref: "topLeftMarker", staticClass: "fst-crop__marker fst-crop__marker--top-left" }), n("div", { ref: "topRightMarker", staticClass: "fst-crop__marker fst-crop__marker--top-right" }), n("div", { ref: "bottomLeftMarker", staticClass: "fst-crop__marker fst-crop__marker--bottom-left" }), n("div", { ref: "bottomRightMarker", staticClass: "fst-crop__marker fst-crop__marker--bottom-right" })]), n("div", { staticClass: "fst-filters__container" }, [n("span", { staticClass: "fst-filters__option", on: { click: e.rotate } }, [n("span", { staticClass: "fst-rotate-right", attrs: { title: "Rotate 90°" } }), e._v(" Rotate ")]), e.cropCircleEnabled ? n("span", { staticClass: "fst-filters__option", class: { "fst-filters__option--active": e.hasCircle }, on: { click: e.applyCircle } }, [n("span", { staticClass: "fst-circle", class: { "fst-circle--active": e.hasCircle }, attrs: { title: "Toggle Circle" } }), e._v(" Circle")]) : e._e()])]);
      }, staticRenderFns: [], props: { imageWidth: Number, imageHeight: Number, imageX: Number, imageY: Number }, data: function data() {
        return { deg: 0, hasCircle: !1, cropRectangle: { topLeftX: 0, topLeftY: 0, bottomRightX: 0, bottomRightY: 0 } };
      }, computed: hi({}, Xr.mapGetters(["cachedCropRectangle", "cropAspectRatio", "cropCircleEnabled", "imageNaturalWidth", "imageNaturalHeight", "imageLoading", "transformations"]), { aspectRatio: function aspectRatio() {
          return this.hasCircle ? 1 : this.cropAspectRatio;
        } }), watch: { imageLoading: function imageLoading() {
          var e = this;this.$nextTick(function () {
            e.addMarkerBehaviour(e.$refs.topLeftMarker, "topLeftX", "topLeftY"), e.addMarkerBehaviour(e.$refs.topRightMarker, "bottomRightX", "topLeftY"), e.addMarkerBehaviour(e.$refs.bottomLeftMarker, "topLeftX", "bottomRightY"), e.addMarkerBehaviour(e.$refs.bottomRightMarker, "bottomRightX", "bottomRightY"), e.addMoveSelectionBehaviour(), e.initialize();
          });
        }, cropRectangle: { deep: !0, handler: function handler() {
            this.imageLoading || this.calculateAndSetRectangle();
          } } }, methods: hi({}, Xr.mapActions(["performTransformations"]), { repositionMarkers: function repositionMarkers() {
          var e = this.$refs.topLeftMarker.getBoundingClientRect().width / 2;this.$refs.topLeftMarker.style.left = bs(this.cropRectangle.topLeftX - e), this.$refs.topLeftMarker.style.top = bs(this.cropRectangle.topLeftY - e);var t = this.$refs.topRightMarker.getBoundingClientRect().width / 2;this.$refs.topRightMarker.style.left = bs(this.cropRectangle.bottomRightX - t), this.$refs.topRightMarker.style.top = bs(this.cropRectangle.topLeftY - t);var n = this.$refs.bottomLeftMarker.getBoundingClientRect().width / 2;this.$refs.bottomLeftMarker.style.left = bs(this.cropRectangle.topLeftX - n), this.$refs.bottomLeftMarker.style.top = bs(this.cropRectangle.bottomRightY - n);var i = this.$refs.bottomRightMarker.getBoundingClientRect().width / 2;this.$refs.bottomRightMarker.style.left = bs(this.cropRectangle.bottomRightX - i), this.$refs.bottomRightMarker.style.top = bs(this.cropRectangle.bottomRightY - i), this.$refs.cropArea.style.left = bs(this.cropRectangle.topLeftX), this.$refs.cropArea.style.top = bs(this.cropRectangle.topLeftY), this.$refs.cropArea.style.width = bs(this.cropRectangle.bottomRightX - this.cropRectangle.topLeftX), this.$refs.cropArea.style.height = bs(this.cropRectangle.bottomRightY - this.cropRectangle.topLeftY);
        }, calculateAndSetRectangle: function calculateAndSetRectangle() {
          var e = { imageNaturalWidth: this.imageNaturalWidth, imageNaturalHeight: this.imageNaturalHeight },
              t = { imageWidth: this.imageWidth, imageHeight: this.imageHeight, imageX: this.imageX, imageY: this.imageY };Ts(e, t, this.cropRectangle, this.$store, this.hasCircle);
        }, calculateRectangleMaintainingAspectRatio: function calculateRectangleMaintainingAspectRatio(e, t) {
          var n = { w: e, h: e / this.aspectRatio },
              i = { w: t * this.aspectRatio, h: t };return Math.sqrt(n.w * n.w + n.h * n.h) < Math.sqrt(i.w * i.w + i.h * i.h) ? n : i;
        }, ensurePointWithinBoundsX: function ensurePointWithinBoundsX(e, t) {
          if ("topLeftX" === t) {
            if (e < this.imageX) return this.imageX;if (e >= this.cropRectangle.bottomRightX) return this.cropRectangle.bottomRightX - 1;
          } else if ("bottomRightX" === t) {
            if (e <= this.cropRectangle.topLeftX) return this.cropRectangle.topLeftX + 1;if (e > this.imageWidth) return this.imageWidth;
          }return e;
        }, ensurePointWithinBoundsY: function ensurePointWithinBoundsY(e, t) {
          if ("topLeftY" === t) {
            if (e < this.imageY) return this.imageY;if (e >= this.cropRectangle.bottomRightY) return this.cropRectangle.bottomRightY - 1;
          } else if ("bottomRightY" === t) {
            if (e <= this.cropRectangle.topLeftY) return this.cropRectangle.topLeftY + 1;if (e > this.imageHeight) return this.imageHeight;
          }return e;
        }, addMarkerBehaviour: function addMarkerBehaviour(e, t, n) {
          var i = this,
              o = function o(e) {
            e.preventDefault();var o = e.touches ? e.touches[0] : e,
                r = o.clientX - i.cropRectangle[t],
                a = o.clientY - i.cropRectangle[n],
                s = function s(e) {
              var o = e.touches ? e.touches[0] : e,
                  s = void 0,
                  c = void 0,
                  l = i.ensurePointWithinBoundsX(o.clientX - r, t),
                  u = i.ensurePointWithinBoundsY(o.clientY - a, n),
                  d = Cs[t],
                  f = Cs[n],
                  p = Math.abs(l - i.cropRectangle[d]),
                  m = Math.abs(u - i.cropRectangle[f]);p < 40 && (p = 40), m < 40 && (m = 40);var h = { w: p, h: m };void 0 !== i.aspectRatio && (h = i.calculateRectangleMaintainingAspectRatio(p, m)), s = l < i.cropRectangle[d] ? i.cropRectangle[d] - h.w : i.cropRectangle[d] + h.w, c = u < i.cropRectangle[f] ? i.cropRectangle[f] - h.h : i.cropRectangle[f] + h.h, i.cropRectangle[t] = s, i.cropRectangle[n] = c, i.repositionMarkers();
            },
                c = function e() {
              document.documentElement.removeEventListener("mousemove", s, !1), document.documentElement.removeEventListener("mouseup", e, !1), document.documentElement.removeEventListener("mouseleave", e, !1), document.documentElement.removeEventListener("touchmove", s, !1), document.documentElement.removeEventListener("touchend", e, !1), document.documentElement.removeEventListener("touchleave", e, !1);
            };document.documentElement.addEventListener("mousemove", s, !1), document.documentElement.addEventListener("mouseup", c, !1), document.documentElement.addEventListener("mouseleave", c, !1), document.documentElement.addEventListener("touchmove", s, !1), document.documentElement.addEventListener("touchend", c, !1), document.documentElement.addEventListener("touchleave", c, !1);
          };e.addEventListener("mousedown", o, !1), e.addEventListener("touchstart", o, !1);
        }, addMoveSelectionBehaviour: function addMoveSelectionBehaviour() {
          var e = this,
              t = function t(_t3) {
            _t3.preventDefault();var n = _t3.touches ? _t3.touches[0] : _t3,
                i = n.clientX - e.cropRectangle.topLeftX,
                o = n.clientY - e.cropRectangle.topLeftY,
                r = e.cropRectangle.bottomRightX - e.cropRectangle.topLeftX,
                a = e.cropRectangle.bottomRightY - e.cropRectangle.topLeftY,
                s = function s(t) {
              var n = t.touches ? t.touches[0] : t,
                  s = n.clientX - i,
                  c = n.clientY - o;s < e.imageX ? s = e.imageX : s + r > e.imageWidth && (s = e.imageWidth - r), c < e.imageY ? c = e.imageY : c + a > e.imageHeight && (c = e.imageHeight - a), e.cropRectangle.topLeftX = s, e.cropRectangle.topLeftY = c, e.cropRectangle.bottomRightX = s + r, e.cropRectangle.bottomRightY = c + a, e.repositionMarkers();
            },
                c = function e() {
              document.documentElement.removeEventListener("mousemove", s, !1), document.documentElement.removeEventListener("mouseup", e, !1), document.documentElement.removeEventListener("mouseleave", e, !1), document.documentElement.removeEventListener("touchmove", s, !1), document.documentElement.removeEventListener("touchend", e, !1), document.documentElement.removeEventListener("touchleave", e, !1);
            };document.documentElement.addEventListener("mousemove", s, !1), document.documentElement.addEventListener("mouseup", c, !1), document.documentElement.addEventListener("mouseleave", c, !1), document.documentElement.addEventListener("touchmove", s, !1), document.documentElement.addEventListener("touchend", c, !1), document.documentElement.addEventListener("touchleave", c, !1);
          };this.$refs.cropArea.addEventListener("mousedown", t, !1), this.$refs.cropArea.addEventListener("touchstart", t, !1);
        }, initialize: function initialize() {
          if (this.cachedCropRectangle) return this.cropRectangle = this.cachedCropRectangle, void this.repositionMarkers();if (void 0 !== this.aspectRatio) {
            var e = this.calculateRectangleMaintainingAspectRatio(this.imageWidth - this.imageX, this.imageHeight - this.imageY);this.cropRectangle.topLeftX = (this.imageWidth + this.imageX - e.w) / 2, this.cropRectangle.topLeftY = (this.imageHeight + this.imageY - e.h) / 2, this.cropRectangle.bottomRightX = this.cropRectangle.topLeftX + e.w, this.cropRectangle.bottomRightY = this.cropRectangle.topLeftY + e.h;
          } else this.cropRectangle.topLeftX = this.imageX, this.cropRectangle.topLeftY = this.imageY, this.cropRectangle.bottomRightX = this.imageWidth, this.cropRectangle.bottomRightY = this.imageHeight;Es("crop initialized", this.cropRectangle), this.repositionMarkers();
        }, rotate: function rotate() {
          this.deg = this.deg + 90, this.deg < 0 && (this.deg = 360 - Math.abs(this.deg)), this.deg > 360 && (this.deg = 90), 0 === this.deg || 360 === this.deg ? this.$store.commit("REMOVE_TRANSFORMATION", "rotate") : this.$store.commit("SET_TRANSFORMATION", { type: "rotate", options: { deg: this.deg } }), this.$store.commit("REMOVE_TRANSFORMATION", "circle"), this.$store.commit("REMOVE_TRANSFORMATION", "crop"), this.$store.commit("SET_CROP_RECTANGLE", null), this.performTransformations();
        }, applyCircle: function applyCircle() {
          this.hasCircle ? this.$store.commit("REMOVE_TRANSFORMATION", "circle") : this.$store.commit("SET_TRANSFORMATION", { type: "circle", options: {} }), this.$store.commit("SET_CROP_RECTANGLE", null), this.hasCircle = !this.hasCircle, this.initialize();
        } }), mounted: function mounted() {
        var e = this;Es("crop mounted"), this.transformations.crop && (this.$store.commit("REMOVE_TRANSFORMATION", "crop"), this.performTransformations()), this.transformations.circle && (this.hasCircle = !0, this.$store.commit("REMOVE_TRANSFORMATION", "circle"), this.performTransformations(), this.$store.commit("SET_TRANSFORMATION", { type: "circle", options: {} })), this.transformations.rotate && (this.deg = this.transformations.rotate.deg), this.$nextTick(function () {
          e.addMarkerBehaviour(e.$refs.topLeftMarker, "topLeftX", "topLeftY"), e.addMarkerBehaviour(e.$refs.topRightMarker, "bottomRightX", "topLeftY"), e.addMarkerBehaviour(e.$refs.bottomLeftMarker, "topLeftX", "bottomRightY"), e.addMarkerBehaviour(e.$refs.bottomRightMarker, "bottomRightX", "bottomRightY"), e.addMoveSelectionBehaviour(), e.initialize();
        });
      }, destroyed: function destroyed() {
        this.calculateAndSetRectangle(), this.performTransformations();
      } },
        Fs = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("modal", [n("content-header", { attrs: { "hide-menu": !0 }, slot: "header" }, [n("span", { staticClass: "fsp-header-text--visible" }, [e._v(e._s(e.headerText))])]), e.isDisabled ? e._e() : n("div", { staticClass: "fst-sidebar", slot: "sidebar" }, e._l(e.options, function (t) {
          return n("div", { staticClass: "fst-sidebar__option", class: e.getSidebarClasses(t), attrs: { title: e.capitalize(t) }, on: { click: function click(n) {
                e.handleClick(t);
              } } }, [n("span", { staticClass: "fst-icon", class: e.genIconClass(t) }), e._v(" " + e._s(e.formatOption(t)))]);
        })), n("div", { staticClass: "fsp-transformer", class: e.transformerClasses, slot: "body" }, [n("img", { ref: "image", staticClass: "fst-image", attrs: { src: e.imageUrl }, on: { load: e.imageLoaded, error: e.imageError } }), e.imageLoading || !e.isLocal && e.imageUploading ? n("div", { staticClass: "fst-image-loader__container" }, [n("div", { staticClass: "fst-image-loader__background" }, [n("div", { staticClass: "fst-image-loader__spinner" })])]) : e._e(), "crop" === e.activeTransform ? n("crop", { attrs: { "image-width": e.imageWidth, "image-height": e.imageHeight, "image-x": e.imageX, "image-y": e.imageY } }) : e._e(), "filters" === e.activeTransform ? n("div", { staticClass: "fst-filters__container" }, e._l(e.filtersEnabled, function (t) {
          return n("div", { staticClass: "fst-filters__option", class: { "fst-filters__option--active": e.isFilterEnabled(t) }, on: { click: function click(n) {
                e.handleFilterClick(t);
              } } }, [n("span", { staticClass: "fst-icon", class: e.genFilterIconClass(t) }), e._v(" " + e._s(e.formatOption(t)))]);
        })) : e._e(), n("footer-nav", { attrs: { "is-visible": !e.uploadStarted }, slot: "footer" }, [n("span", { staticClass: "fsp-button fsp-button--cancel", on: { click: e.goBack }, slot: "nav-left" }, [e._v(e._s(e.t("Cancel")) + " ")]), 1 === e.maxFiles ? n("span", { staticClass: "fsp-button fsp-button--primary", class: { "fsp-button--disabled": !e.canStartUpload }, attrs: { title: "Upload" }, on: { click: e.applyAndUpload }, slot: "nav-right" }, [e._v(e._s(e.t("Upload")) + " ")]) : n("span", { staticClass: "fsp-button fsp-button--primary", class: { "fsp-button--disabled": !e.canStartUpload }, attrs: { title: "Done" }, on: { click: e.applyAndGoBack }, slot: "nav-right" }, [e._v(e._s(e.t("Done")))])]), n("footer-nav", { attrs: { "is-visible": e.uploadStarted || e.uploading, "full-width": !0 }, slot: "footer" }, [n("span", { slot: "nav-center" }, [n("progress-bar", { attrs: { progress: e.fileProgress } })], 1)])], 1)], 1);
      }, staticRenderFns: [], components: { ContentHeader: Ka, Crop: As, FooterNav: Za, Modal: aa, ProgressBar: ns }, computed: hi({}, Xr.mapGetters(["activeTransform", "cropEnabled", "filtersEnabled", "imageLoading", "imageUploading", "imageUrl", "maxFiles", "originalUrl", "route", "stagedForTransform", "transformations", "uploadStarted"]), { canStartUpload: function canStartUpload() {
          return !0;
        }, headerText: function headerText() {
          return this.maxFiles > 1 ? "Edit Image" : "Upload Image";
        }, fileProgress: function fileProgress() {
          return this.stagedForTransform.progress;
        }, isLocal: function isLocal() {
          return "local_file_system" === this.stagedForTransform.source;
        }, isDisabled: function isDisabled() {
          return !this.cropEnabled && !this.filtersEnabled;
        }, options: function options() {
          var e = [];return this.cropEnabled && e.push("crop"), this.filtersEnabled && this.filtersEnabled.length && e.push("filters"), e;
        }, transformerClasses: function transformerClasses() {
          return { "fsp-transformer--controls": !this.isDisabled, "fsp-transformer--disabled": this.isDisabled };
        } }), data: function data() {
        return { imageWidth: 0, imageHeight: 0, imageX: 0, imageY: 0, uploading: !1 };
      }, methods: hi({}, Xr.mapActions(["deselectAllFiles", "startUploading", "performTransformations", "updateMobileNavActive", "uploadFileToTemporaryLocation"]), { applyAndGoBack: function applyAndGoBack() {
          this.performTransformations(!0), this.goBack();
        }, applyAndUpload: function applyAndUpload() {
          var e = this;this.uploading = !0, this.performTransformations(!0).then(function () {
            e.startUploading(!0);
          });
        }, capitalize: function capitalize(e) {
          return e && e[0].toUpperCase() + e.slice(1);
        }, formatOption: function formatOption(e) {
          return "monochrome" === e ? "Mono" : this.capitalize(e);
        }, handleClick: function handleClick(e) {
          this.$store.commit("SET_ACTIVE_TRANSFORM", e);
        }, handleFilterClick: function handleFilterClick(e) {
          this.isFilterEnabled(e) ? this.$store.commit("REMOVE_TRANSFORMATION", e) : this.$store.commit("SET_TRANSFORMATION", { type: e, options: !0 }), this.performTransformations();
        }, imageError: function imageError() {
          this.$store.commit("SET_IMAGE_LOADING", !1);
        }, isFilterEnabled: function isFilterEnabled(e) {
          return -1 !== Object.keys(this.transformations).indexOf(e);
        }, getSidebarClasses: function getSidebarClasses(e) {
          return { "fst-sidebar__option--active": e === this.activeTransform, "fst-sidebar__option--disabled": this.uploadStarted || this.uploading };
        }, genIconClass: function genIconClass(e) {
          return this.activeTransform !== e || this.uploadStarted || this.uploading ? "fst-icon--" + e + "-black" : "fst-icon--" + e + "-blue";
        }, genFilterIconClass: function genFilterIconClass(e) {
          return this.isFilterEnabled(e) ? "fst-icon--" + e + "-blue" : "fst-icon--" + e + "-black";
        }, goBack: function goBack() {
          var e = this;1 === this.maxFiles && this.deselectAllFiles(), this.$store.commit("SET_IMAGE_LOADING", !1), this.$store.commit("GO_BACK_WITH_ROUTE"), this.$nextTick(function () {
            return e.$store.commit("RESET_TRANSFORMATIONS");
          });
        }, imageLoaded: function imageLoaded() {
          if (this.$refs.image) {
            var e = this.$refs.image.offsetLeft,
                t = this.$refs.image.offsetTop;this.imageWidth = this.$refs.image.offsetWidth + e, this.imageHeight = this.$refs.image.offsetHeight + t, this.imageX = e, this.imageY = t;var n = this.$refs.image.naturalWidth,
                i = this.$refs.image.naturalHeight;this.$store.commit("SET_IMAGE_NATURAL_SIZE", { w: n, h: i });
          }this.$store.commit("SET_IMAGE_LOADING", !1);
        } }), mounted: function mounted() {
        this.$store.commit("SET_IMAGE_LOADING", !0), this.$store.commit("SET_CROP_RECTANGLE", null), this.cropEnabled && this.$store.commit("SET_ACTIVE_TRANSFORM", "crop"), this.$store.commit("CANCEL_ALL_PENDING_REQUESTS");
      } },
        ws = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return n("modal", [n("div", { slot: "header" }, [e.uploadStarted || e.mobileNavActive ? e._e() : n("div", { staticClass: "fsp-summary__go-back", attrs: { title: "Go back" }, on: { click: e.goBack } }), n("content-header", [e.mobileNavActive ? e._e() : n("span", { staticClass: "fsp-header-text--visible" }, [e._v(e._s(e.headerText))])])], 1), n("div", { staticClass: "fsp-summary", slot: "body" }, [n("div", { staticClass: "fsp-summary__header" }, [n("div", { staticClass: "fsp-summary__filter" }, [n("input", { attrs: { placeholder: e.placeholderText }, on: { input: e.updateFilter } }), e._v(" "), n("span", { staticClass: "fsp-summary__filter-icon" })])]), n("div", { staticClass: "fsp-summary__body" }, [e.onlyTransformedImages.length ? n("div", { staticClass: "fsp-grid__label" }, [e._v(e._s(e.t("Edited Images")))]) : e._e(), e.onlyTransformedImages.length ? n("div", { staticClass: "fsp-summary__images-container" }, e._l(e.onlyTransformedImages, function (t) {
          return n("div", { key: t.uploadToken, staticClass: "fsp-summary__item" }, ["local_file_system" === t.source ? n("img", { ref: t.uploadToken, refInFor: !0, staticClass: "fsp-summary__thumbnail", attrs: { src: e.generateThumbnail(t) }, on: { load: function load(n) {
                e.revokeURL(t);
              } } }) : n("div", [n("img", { staticClass: "fsp-summary__thumbnail", attrs: { src: t.transformed || t.thumbnail } })]), n("span", { staticClass: "fsp-summary__item-name" }, [e._v(e._s(t.name) + " "), "local_file_system" !== t.source || t.transformed ? e._e() : n("span", { staticClass: "fsp-summary__size" }, [e.uploadStarted ? n("span", { staticClass: "fsp-summary__size-progress" }, [e._v(e._s(t.progressSize) + " " + e._s(e.t("of")) + " ")]) : e._e(), e._v(e._s(e.translatedFileSize(t.size)))])]), e.uploadStarted ? n("div", { staticClass: "fsp-summary__item-progress", style: { width: t.progress + "%" } }) : e._e(), e.uploadStarted ? e._e() : n("div", { staticClass: "fsp-summary__actions-container" }, [e.disableTransformer ? e._e() : n("span", [n("span", { staticClass: "fsp-summary__action fsp-summary__action--button", on: { click: function click(n) {
                e.removeTransformation(t);
              } } }, [e._v(e._s(e.t("Revert")))])]), n("span", { staticClass: "fsp-summary__action-separator" }), e._v(" "), n("span", { staticClass: "fsp-summary__action fsp-summary__action--remove", on: { click: function click(n) {
                e.addFile(t);
              } } })])]);
        })) : e._e(), e.onlyImages.length ? n("div", { staticClass: "fsp-grid__label" }, [e._v(e._s(e.t("Images")))]) : e._e(), e.onlyImages.length ? n("div", { staticClass: "fsp-summary__images-container" }, e._l(e.onlyImages, function (t) {
          return n("div", { key: t.uploadToken, staticClass: "fsp-summary__item" }, ["local_file_system" === t.source ? n("img", { ref: t.uploadToken, refInFor: !0, staticClass: "fsp-summary__thumbnail", attrs: { src: e.generateThumbnail(t) }, on: { load: function load(n) {
                e.revokeURL(t);
              } } }) : n("div", [n("img", { staticClass: "fsp-summary__thumbnail", attrs: { src: t.transformed || t.thumbnail } })]), n("span", { staticClass: "fsp-summary__item-name" }, [e._v(e._s(t.name) + " "), "local_file_system" !== t.source || t.transformed ? e._e() : n("span", { staticClass: "fsp-summary__size" }, [e.uploadStarted ? n("span", { staticClass: "fsp-summary__size-progress" }, [e._v(e._s(t.progressSize) + " " + e._s(e.t("of")) + " ")]) : e._e(), e._v(e._s(e.translatedFileSize(t.size)))])]), e.uploadStarted ? n("div", { staticClass: "fsp-summary__item-progress", style: { width: t.progress + "%" } }) : e._e(), e.uploadStarted ? e._e() : n("div", { staticClass: "fsp-summary__actions-container" }, [e.disableTransformer ? e._e() : n("span", [n("span", { staticClass: "fsp-summary__action fsp-summary__action--button", on: { click: function click(n) {
                e.transformImage(t);
              } } }, [e._v(e._s(e.t("Edit")))])]), n("span", { staticClass: "fsp-summary__action-separator" }), e._v(" "), n("span", { staticClass: "fsp-summary__action fsp-summary__action--remove", on: { click: function click(n) {
                e.addFile(t);
              } } })])]);
        })) : e._e(), e.onlyFiles.length ? n("div", { staticClass: "fsp-grid__label" }, [e._v(e._s(e.t("Files")))]) : e._e(), e._l(e.onlyFiles, function (t) {
          return n("div", { key: t.uploadToken, staticClass: "fsp-summary__item" }, [n("div", { staticClass: "fsp-summary__thumbnail-container" }, [n("span", { class: e.generateClass(t) })]), n("span", { staticClass: "fsp-summary__item-name" }, [e._v(e._s(t.name) + " "), "local_file_system" !== t.source || t.transformed ? e._e() : n("span", { staticClass: "fsp-summary__size" }, [e.uploadStarted ? n("span", { staticClass: "fsp-summary__size-progress" }, [e._v(e._s(t.progressSize) + " " + e._s(e.t("of")) + " ")]) : e._e(), e._v(e._s(e.translatedFileSize(t.size)))])]), e.uploadStarted ? n("div", { staticClass: "fsp-summary__item-progress", style: { width: t.progress + "%" } }) : e._e(), e.uploadStarted ? e._e() : n("div", { staticClass: "fsp-summary__actions-container" }, [n("div", { staticClass: "fsp-summary__action", on: { click: function click(n) {
                e.addFile(t);
              } } }, [n("span", { staticClass: "fsp-summary__action--remove" })])])]);
        }), e.hideMinFilesNotification ? e._e() : n("div", { staticClass: "fsp-notifications__container" }, [n("div", { staticClass: "fsp-notifications__message" }, [n("span", { staticClass: "fsp-label" }, [e._v(e._s(e.getMinFilesNotification))])]), n("span", { staticClass: "fsp-notifications__back-button", on: { click: e.goBack } }, [e._v(e._s(e.t("Go Back")))])])], 2)]), n("footer-nav", { attrs: { "is-visible": !e.uploadStarted }, slot: "footer" }, [n("span", { staticClass: "fsp-button fsp-button--cancel", on: { click: e.deselectAllFiles }, slot: "nav-left" }, [e._v(e._s(e.t("Deselect All")) + " ")]), n("span", { staticClass: "fsp-button fsp-button--primary", class: { "fsp-button--disabled": !e.canStartUpload }, attrs: { title: "Upload" }, on: { click: e.startUploadMaybe }, slot: "nav-right" }, [e._v(e._s(e.t("Upload")) + " "), e.allFiles.length > 1 ? n("span", { staticClass: "fsp-badge fsp-badge--bright" }, [e._v(e._s(e.allFiles.length))]) : e._e()])])], 1);
      }, staticRenderFns: [], components: { ContentHeader: Ka, FooterNav: Za, Modal: aa }, computed: hi({}, Xr.mapGetters(["allFilesInQueueCount", "canStartUpload", "disableTransformer", "filesDone", "filesFailed", "filesNeededCount", "filesUploading", "filesWaiting", "minFiles", "mobileNavActive", "route", "routesHistory", "uploadInBackground", "uploadStarted"]), { allFiles: function allFiles() {
          return this.filesUploading.concat(this.filesWaiting);
        }, getMinFilesNotification: function getMinFilesNotification() {
          return 1 === this.filesNeededCount ? this.t("Please select") + " 1 " + this.t("more file") : this.filesNeededCount > 1 ? this.t("Please select") + " " + this.filesNeededCount + " " + this.t("more files") : null;
        }, hideMinFilesNotification: function hideMinFilesNotification() {
          return this.uploadStarted || this.canStartUpload;
        }, onlyFiles: function onlyFiles() {
          var e = new RegExp(this.filter, "i");return this.allFiles.filter(function (e) {
            return !va(e);
          }).filter(function (t) {
            return e.test(t.name);
          });
        }, onlyImages: function onlyImages() {
          var e = new RegExp(this.filter, "i");return this.allFiles.filter(function (e) {
            return va(e);
          }).filter(function (e) {
            return !e.transformed;
          }).filter(function (t) {
            return e.test(t.name);
          });
        }, onlyTransformedImages: function onlyTransformedImages() {
          var e = new RegExp(this.filter, "i");return this.allFiles.filter(function (e) {
            return va(e);
          }).filter(function (e) {
            return e.transformed;
          }).filter(function (t) {
            return e.test(t.name);
          });
        }, headerText: function headerText() {
          return this.uploadStarted ? this.t("Uploaded") + " " + this.filesDone.concat(this.filesFailed).length + " " + this.t("of") + " " + this.allFilesInQueueCount : this.t("Selected Files");
        }, placeholderText: function placeholderText() {
          return this.t("Filter");
        } }), created: function created() {
        this.$store.commit("CANCEL_ALL_PENDING_REQUESTS");
      }, data: function data() {
        return { blobURLs: {}, currentPath: null, currentSource: null, filter: "" };
      }, methods: hi({}, Xr.mapActions(["addFile", "deselectAllFiles", "deselectFolder", "goBack", "removeTransformation", "startUploading", "stageForTransform", "uploadFileToTemporaryLocation"]), { fileOrFiles: function fileOrFiles(e) {
          return 1 === this.getFileCount(e) ? "File" : "Files";
        }, generateClass: function generateClass(e) {
          return _a(e) ? "fsp-grid__icon-audio" : "application/pdf" === e.mimetype ? "fsp-grid__icon-pdf" : "fsp-grid__icon-file";
        }, translatedFileSize: function translatedFileSize(e) {
          return ha(e);
        }, generateThumbnail: function generateThumbnail(e) {
          if (e.transformed) return e.transformed;var t = window.URL.createObjectURL(e.originalFile);return this.blobURLs[e.uploadToken] = t, t;
        }, revokeURL: function revokeURL(e) {
          var t = this.blobURLs[e.uploadToken];window.URL.revokeObjectURL(t);
        }, updateFilter: function updateFilter(e) {
          this.filter = e.target.value;
        }, startUploadMaybe: function startUploadMaybe() {
          this.canStartUpload && this.startUploading(!0);
        }, transformImage: function transformImage(e) {
          this.stageForTransform(e);
        } }), mounted: function mounted() {
        this.uploadInBackground && this.startUploading();
      }, watch: { allFiles: { immediate: !0, handler: function handler(e) {
            0 !== e.length || this.uploadStarted || this.$store.commit("GO_BACK_WITH_ROUTE");
          } } } },
        Rs = { render: function render() {
        var e = this,
            t = e.$createElement,
            n = e._self._c || t;return e.uiVisible ? n("div", [e.isRootRoute("source") ? n("pick-from-source") : e._e(), e.isRootRoute("summary") ? n("upload-summary") : e._e(), e.isRootRoute("transform") ? n("transform") : e._e(), n("notifications"), e.localPickingAllowed && !e.isRootRoute("transform") ? n("drag-and-drop") : e._e()], 1) : e._e();
      }, staticRenderFns: [], components: { DragAndDrop: ea, Notifications: ta, PickFromSource: ts, Transform: Fs, UploadSummary: ws }, computed: hi({}, Xr.mapGetters(["uiVisible", "route", "fromSources", "pendingReqs"]), { localPickingAllowed: function localPickingAllowed() {
          return this.fromSources.some(function (e) {
            return "local_file_system" === e.name;
          });
        } }), methods: hi({}, Xr.mapActions(["prefetchClouds"]), { isRootRoute: function isRootRoute(e) {
          return this.route[0] === e;
        }, detectEscPressed: function detectEscPressed(e) {
          27 === e.keyCode && this.$root.$destroy();
        } }), created: function created() {
        var e = this;window.addEventListener("keyup", this.detectEscPressed), this.prefetchClouds(), this.interval = setInterval(function () {
          e.pendingReqs.length && e.$store.commit("EXECUTE_PENDING_REQUEST");
        }, 500);
      }, destroyed: function destroyed() {
        window.removeEventListener("keyup", this.detectEscPressed), clearInterval(this.interval), this.$store.commit("CANCEL_ALL_PENDING_REQUESTS");
      }, watch: { route: { immediate: !0, deep: !0, handler: function handler(e) {
            "done" === e[0] && this.$root.$destroy();
          } } } },
        Os = function Os(e) {
      var t = void 0,
          n = function n(e, t) {
        return hi({ source: t, sourceKind: "cloud" }, e);
      };return { state: { currentCloudAuthorized: !0, currentCloudName: void 0, currentCloudPath: void 0, listForCurrentCloudPath: [], cache: {}, cloudFolders: {}, cloudsAuthorized: {}, cloudsPrefetching: {}, loading: !1, pendingReqs: [], pendingTokens: [] }, mutations: { SET_CURRENT_CLOUD_AUTHORIZED: function SET_CURRENT_CLOUD_AUTHORIZED(e, t) {
            e.currentCloudAuthorized = t;
          }, SET_CURRENT_CLOUD_NAME: function SET_CURRENT_CLOUD_NAME(e, t) {
            e.currentCloudName = t;
          }, SET_CLOUD_AUTHORIZED: function SET_CLOUD_AUTHORIZED(e, t) {
            var n = t.key,
                i = t.value;nt.set(e.cloudsAuthorized, n, i);
          }, RESET_CLOUD_AUTHORIZED: function RESET_CLOUD_AUTHORIZED(e) {
            e.cloudsAuthorized = {};
          }, SET_CURRENT_CLOUD_PATH: function SET_CURRENT_CLOUD_PATH(e, t) {
            var n = t.length > 0 ? Ba(t) : t,
                i = e.currentCloudName + n,
                o = e.cache[i];o && (e.listForCurrentCloudPath = o), e.currentCloudPath = t;
          }, SET_LIST_FOR_CURRENT_CLOUD_PATH: function SET_LIST_FOR_CURRENT_CLOUD_PATH(e, t) {
            var n = e.currentCloudPath,
                i = n.length > 0 ? Ba(n) : n,
                o = e.currentCloudName + i;e.cache[o] = t, e.listForCurrentCloudPath = t;
          }, RESET_LIST_CURRENT_CLOUD_PATH: function RESET_LIST_CURRENT_CLOUD_PATH(e) {
            e.listForCurrentCloudPath = [];
          }, SET_CLOUD_FOLDERS: function SET_CLOUD_FOLDERS(e, t) {
            t.forEach(function (t) {
              e.cloudFolders[t.path] = hi({}, e.cloudFolders[t.path], { name: t.name });
            });
          }, SET_CLOUD_FOLDER_LOADING: function SET_CLOUD_FOLDER_LOADING(e, t) {
            var n = t.path,
                i = t.value;e.cloudFolders = hi({}, e.cloudFolders, mi({}, n, hi({}, e.cloudFolders[n], { loading: i })));
          }, SET_CLOUD_LOADING: function SET_CLOUD_LOADING(e, t) {
            e.loading = t;
          }, SET_CLOUD_PREFETCHING: function SET_CLOUD_PREFETCHING(e, t) {
            var n = t.key,
                i = t.value;nt.set(e.cloudsPrefetching, n, i);
          }, SET_CACHE: function SET_CACHE(e, t) {
            var n = t.key,
                i = t.value;e.cache[n] = i;
          }, RESET_CACHE: function RESET_CACHE(e) {
            e.cache = {};
          }, ADD_PENDING_REQUEST: function ADD_PENDING_REQUEST(e, t) {
            var n = t.request,
                i = t.token;e.pendingReqs.push({ request: n, token: i });
          }, EXECUTE_PENDING_REQUEST: function EXECUTE_PENDING_REQUEST(e) {
            var t = e.pendingReqs.pop();t && t.request && t.token && (t.request(), e.pendingTokens.push(t.token));
          }, CANCEL_ALL_PENDING_REQUESTS: function CANCEL_ALL_PENDING_REQUESTS(e) {
            e.pendingTokens.forEach(function (e) {
              e.cancel();
            }), e.pendingReqs = [], e.pendingTokens = [], e.cloudsPrefetching = {};
          } }, actions: { goToDirectory: function goToDirectory(e, t) {
            if (t.path !== e.getters.currentCloudPath.join("")) {
              var n = Xa(e.getters.currentCloudPath);n.push(t.path);var i = ["source", e.getters.currentCloudName, n];e.commit("CHANGE_ROUTE", i);
            }
          }, logout: function logout(t, n) {
            n ? e.cloud().logout(n).then(function () {
              t.commit("CANCEL_ALL_PENDING_REQUESTS"), t.commit("SET_CLOUD_AUTHORIZED", { key: n, value: !1 }), t.commit("REMOVE_SOURCE_FROM_WAITING", n), Object.keys(t.state.cache).filter(function (e) {
                return e.indexOf(n) >= 0;
              }).forEach(function (e) {
                t.commit("SET_CACHE", { key: e, value: null });
              }), n === t.state.currentCloudName && (t.commit("SET_CURRENT_CLOUD_AUTHORIZED", !1), t.commit("RESET_LIST_CURRENT_CLOUD_PATH"), t.commit("CHANGE_ROUTE", ["source", n]));
            }) : e.cloud().logout().then(function () {
              t.commit("RESET_CLOUD_AUTHORIZED"), t.commit("SET_CURRENT_CLOUD_AUTHORIZED", !1), t.commit("RESET_CACHE"), t.commit("RESET_LIST_CURRENT_CLOUD_PATH"), t.commit("REMOVE_CLOUDS_FROM_WAITING"), t.commit("CANCEL_ALL_PENDING_REQUESTS");
            });
          }, prefetchClouds: function prefetchClouds(t) {
            t.getters.fromSources.filter(function (e) {
              return "cloud" === e.ui;
            }).map(function (e) {
              return e.name;
            }).forEach(function (i) {
              t.commit("SET_CLOUD_PREFETCHING", { key: i, value: !0 });var o = e.cloud(i),
                  r = {},
                  a = function a() {
                return o.list([], r).then(function (e) {
                  t.commit("SET_CLOUD_PREFETCHING", { key: i, value: !1 }), t.commit("SET_CLOUD_AUTHORIZED", { key: i, value: !0 });var r = e.contents.map(function (e) {
                    return n(e, i);
                  }),
                      a = r.filter(function (e) {
                    return e.folder;
                  });t.commit("SET_CLOUD_FOLDERS", a), t.commit("SET_CACHE", { key: i, value: r }), t.getters.currentCloudName === i && (t.commit("SET_LIST_FOR_CURRENT_CLOUD_PATH", r), t.dispatch("prefetchFolders", { client: o, name: i, folders: a }));
                }).catch(function (e) {
                  t.commit("SET_CLOUD_PREFETCHING", { key: i, value: !1 }), t.getters.currentCloudName === i && 401 === e.status && t.commit("SET_CURRENT_CLOUD_AUTHORIZED", { status: "unauthorized", authUrl: e.response.body.redirect_url });
                });
              };t.commit("ADD_PENDING_REQUEST", { request: a, token: r });
            });
          }, prefetchFolders: function prefetchFolders(e, t) {
            var i = t.client,
                o = t.name;t.folders.forEach(function (t) {
              var r = o + t.path;if (!e.state.cache[r]) {
                var a = {},
                    s = function s() {
                  return e.commit("SET_CLOUD_PREFETCHING", { key: r, value: !0 }), i.list(t.path, a).then(function (a) {
                    var s = e.getters.currentCloudPath,
                        c = s.length > 0 ? Ba(s) : s,
                        l = a.contents.map(function (e) {
                      return n(e, o);
                    }),
                        u = l.filter(function (e) {
                      return e.folder;
                    });e.commit("SET_CLOUD_PREFETCHING", { key: r, value: !1 }), e.commit("SET_CLOUD_FOLDERS", u), e.commit("SET_CACHE", { key: r, value: l }), t.path === c && (e.commit("SET_LIST_FOR_CURRENT_CLOUD_PATH", l), e.dispatch("prefetchFolders", { client: i, name: o, folders: u }));
                  }).catch(function (n) {
                    e.commit("SET_CLOUD_PREFETCHING", { key: r, value: !1 });var i = e.getters.currentCloudPath,
                        o = i.length > 0 ? Ba(i) : i;t.path === o && 401 === n.status && e.commit("SET_CURRENT_CLOUD_AUTHORIZED", { status: "unauthorized", authUrl: n.response.body.redirect_url });
                  });
                };e.commit("ADD_PENDING_REQUEST", { request: s, token: a });
              }
            });
          }, addCloudFolder: function addCloudFolder(i, o) {
            var r = o.name,
                a = o.path,
                s = void 0,
                c = r + a,
                l = i.state.cache[c];l ? s = Promise.resolve(l) : (t = e.cloud(r), s = t.list(a), i.commit("SET_CLOUD_FOLDER_LOADING", { path: a, value: !0 })), s.then(function (e) {
              if (l) return void e.filter(function (e) {
                return !e.folder;
              }).forEach(function (e) {
                return i.dispatch("addFile", e);
              });i.commit("SET_CLOUD_FOLDER_LOADING", { path: a, value: !1 });var t = e.contents.map(function (e) {
                return n(e, r);
              });i.commit("SET_CACHE", { key: c, value: t }), t.filter(function (e) {
                return !e.folder;
              }).forEach(function (e) {
                return i.dispatch("addFile", e);
              });
            }).catch(function (e) {
              i.commit("SET_CLOUD_FOLDER_LOADING", { path: a, value: !1 }), i.dispatch("showNotification", e.message);
            });
          }, showCloudPath: function showCloudPath(i, o) {
            var r = o.name,
                a = o.path,
                s = void 0 === a ? [] : a;i.getters.currentCloudName !== r && (t = e.cloud(r), i.commit("SET_CURRENT_CLOUD_NAME", r)), !0 !== i.getters.currentCloudAuthorized && i.commit("SET_CURRENT_CLOUD_AUTHORIZED", !0);var c = s.length > 0 ? Ba(s) : s,
                l = r + c,
                u = i.state.cache[l];if (i.commit("RESET_LIST_CURRENT_CLOUD_PATH"), i.commit("SET_CURRENT_CLOUD_PATH", s), i.commit("CANCEL_ALL_PENDING_REQUESTS"), u) {
              var d = u.filter(function (e) {
                return e.folder;
              });return void i.dispatch("prefetchFolders", { client: t, name: r, folders: d });
            }i.getters.cloudsPrefetching[l] || function (e) {
              i.commit("SET_CLOUD_LOADING", !0), t.list(e).then(function (e) {
                if (i.getters.currentCloudPath === s) {
                  var o = e.contents.map(function (e) {
                    return n(e, r);
                  }),
                      a = o.filter(function (e) {
                    return e.folder;
                  });i.dispatch("prefetchFolders", { client: t, name: r, folders: a }), i.commit("SET_CLOUD_FOLDERS", a), i.commit("SET_LIST_FOR_CURRENT_CLOUD_PATH", o), i.commit("SET_CLOUD_LOADING", !1), i.commit("SET_CLOUD_AUTHORIZED", { key: r, value: !0 });
                }
              }).catch(function (e) {
                i.commit("SET_CLOUD_LOADING", !1), i.getters.currentCloudPath === s && (401 === e.status ? i.commit("SET_CURRENT_CLOUD_AUTHORIZED", { status: "unauthorized", authUrl: e.response.body.redirect_url }) : i.dispatch("showNotification", e.response.body.status));
              });
            }(c);
          } }, getters: { currentCloudAuthorized: function currentCloudAuthorized(e) {
            return e.currentCloudAuthorized;
          }, currentCloudName: function currentCloudName(e) {
            return e.currentCloudName;
          }, currentCloudPath: function currentCloudPath(e) {
            return e.currentCloudPath;
          }, listForCurrentCloudPath: function listForCurrentCloudPath(e) {
            return e.listForCurrentCloudPath;
          }, cloudFolders: function cloudFolders(e) {
            return e.cloudFolders;
          }, cloudLoading: function cloudLoading(e) {
            return e.loading;
          }, cloudsPrefetching: function cloudsPrefetching(e) {
            return e.cloudsPrefetching;
          }, cloudsAuthorized: function cloudsAuthorized(e) {
            return e.cloudsAuthorized;
          }, pendingReqs: function pendingReqs(e) {
            return e.pendingReqs;
          } } };
    },
        ks = function ks(e) {
      var t = function t(e) {
        return hi({ source: "imagesearch", sourceKind: "cloud" }, e);
      };return { state: { input: "", isSearching: !1, result: null, error: null }, mutations: { UPDATE_INPUT: function UPDATE_INPUT(e, t) {
            e.input = t;
          }, FETCH_IMAGES_BEGIN: function FETCH_IMAGES_BEGIN(e) {
            e.isSearching = !0;
          }, FETCH_IMAGES_SUCCESS: function FETCH_IMAGES_SUCCESS(e, t) {
            e.result = t, e.isSearching = !1;
          }, FETCH_IMAGES_ERROR: function FETCH_IMAGES_ERROR(e, t) {
            e.error = t, e.isSearching = !1;
          }, CLEAR_RESULT_NAME: function CLEAR_RESULT_NAME(e) {
            e.result && (e.result.name = null);
          } }, actions: { updateSearchInput: function updateSearchInput(e, t) {
            "" !== t && t !== e.getters.imageSearchName || e.commit("CLEAR_RESULT_NAME"), e.commit("UPDATE_INPUT", t);
          }, fetchImages: function fetchImages(n) {
            if (!n.getters.isSearching) {
              var i = n.getters.imageSearchInput;i && (n.commit("FETCH_IMAGES_BEGIN"), e.cloud("imagesearch").list("/" + i).then(function (e) {
                0 === e.contents.length && n.dispatch("showNotification", "No search results found for " + i), e.contents = e.contents.map(t), n.commit("FETCH_IMAGES_SUCCESS", e);
              }).catch(function (e) {
                n.commit("FETCH_IMAGES_ERROR", e), n.dispatch("showNotification", e.message);
              }));
            }
          } }, getters: { isSearching: function isSearching(e) {
            return e.isSearching;
          }, noResultsFound: function noResultsFound(e) {
            return e.result && 0 === e.result.contents.length;
          }, resultsFound: function resultsFound(e) {
            return e.result && e.result.contents.length > 0;
          }, imageSearchInput: function imageSearchInput(e) {
            return e.input;
          }, imageSearchName: function imageSearchName(e) {
            return e.result && e.result.name;
          }, imageSearchResults: function imageSearchResults(e) {
            return e.result && e.result.contents;
          }, imageSearchError: function imageSearchError(e) {
            return e.error;
          } } };
    },
        Ns = { ADD_NOTIFICATION: function ADD_NOTIFICATION(e, t) {
        e.notifications.push(t);
      }, REMOVE_NOTIFICATION: function REMOVE_NOTIFICATION(e, t) {
        e.notifications = e.notifications.filter(function (e) {
          return e !== t;
        });
      }, REMOVE_ALL_NOTIFICATIONS: function REMOVE_ALL_NOTIFICATIONS(e) {
        e.notifications.splice(0, e.notifications.length);
      } },
        Ls = { showNotification: function showNotification(e, t, n) {
        var i = hi({ message: t }, n);e.getters.notifications.map(function (e) {
          return e.message;
        }).indexOf(t) < 0 && (e.commit("ADD_NOTIFICATION", i), setTimeout(function () {
          e.commit("REMOVE_NOTIFICATION", i);
        }, 5e3));
      }, removeAllNotifications: function removeAllNotifications(e) {
        e.commit("REMOVE_ALL_NOTIFICATIONS");
      } },
        Is = { notifications: function notifications(e) {
        return e.notifications;
      } },
        xs = { state: { notifications: [] }, mutations: Ns, actions: Ls, getters: Is },
        Ds = function Ds(e, t, n) {
      var i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
          o = { imageUrl: null, imageNaturalWidth: 0, imageNaturalHeight: 0, originalUrl: null, imageLoading: !0, imageUploading: !1, transformations: {}, cropRectangle: null, activeTransform: null },
          r = function r(t) {
        if (t) {
          var n = e.getSecurity();if (n && n.policy && n.signature && -1 === t.indexOf("https://process.filestackapi.com") && -1 === t.indexOf("https://process-stage.filestackapi.com") && -1 === t.indexOf("blob:") && -1 === t.indexOf("?policy=")) return t + "?policy=" + n.policy + "&signature=" + n.signature;
        }return t;
      },
          a = { SET_IMAGE_NATURAL_SIZE: function SET_IMAGE_NATURAL_SIZE(e, t) {
          e.imageNaturalWidth = t.w, e.imageNaturalHeight = t.h;
        }, SET_CROP_RECTANGLE: function SET_CROP_RECTANGLE(e, t) {
          e.cropRectangle = t;
        }, SET_ACTIVE_TRANSFORM: function SET_ACTIVE_TRANSFORM(e, t) {
          e.activeTransform = t;
        }, SET_ORIGINAL_URL: function SET_ORIGINAL_URL(e, t) {
          e.originalUrl = t;
        }, SET_IMAGE_URL: function SET_IMAGE_URL(e, t) {
          var n = r(t);e.originalUrl = e.originalUrl || t, e.imageUrl = n;
        }, SET_TRANSFORMATION: function SET_TRANSFORMATION(e, t) {
          var n = t.type,
              i = t.options;nt.set(e.transformations, n, i);
        }, REMOVE_TRANSFORMATION: function REMOVE_TRANSFORMATION(e, t) {
          nt.delete(e.transformations, t);
        }, SET_IMAGE_LOADING: function SET_IMAGE_LOADING(e, t) {
          e.imageLoading = t;
        }, SET_IMAGE_UPLOADING: function SET_IMAGE_UPLOADING(e, t) {
          e.imageUploading = t;
        }, RESET_TRANSFORMATIONS: function RESET_TRANSFORMATIONS(e) {
          e.transformations = {}, e.cropRectangle = null, e.activeTransform = null, e.imageUrl = null, e.originalUrl = null;
        } },
          s = { performTransformations: function performTransformations(t) {
          var n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
              i = t.state,
              o = hi({}, i.transformations);if (i.transformations.crop) {
            var r = i.transformations.crop.dim;i.config.minDimensions && (i.config.minDimensions[0] > r.width || i.config.minDimensions[1] > r.height) && (o.resize = {}, o.resize.width = i.config.minDimensions[0], o.resize.height = i.config.minDimensions[1]), i.config.maxDimensions && (i.config.maxDimensions[0] < r.width || i.config.maxDimensions[1] < r.height) && (o.resize = {}, o.resize.width = i.config.maxDimensions[0], o.resize.height = i.config.maxDimensions[1]);
          } else i.config.minDimensions && (i.config.minDimensions[0] > i.imageNaturalWidth || i.config.minDimensions[1] > i.imageNaturalHeight) && (o.resize = {}, o.resize.width = i.config.minDimensions[0], o.resize.height = i.config.minDimensions[1]), i.config.maxDimensions && (i.config.maxDimensions[0] < i.imageNaturalWidth || i.config.maxDimensions[1] < i.imageNaturalHeight) && (o.resize = {}, o.resize.width = i.config.maxDimensions[0], o.resize.height = i.config.maxDimensions[1]);if (i.imageUploading) return new Promise(function (e) {
            if (n && !Object.keys(o).length) return void e();!function r() {
              var a = setTimeout(function () {
                i.imageUploading ? (r(), !n && Object.keys(o).length && t.commit("SET_IMAGE_LOADING", !0)) : (clearTimeout(a), t.dispatch("performTransformations", n), e());
              }, 200);
            }();
          });if (n) try {
            if (Object.keys(o).length) {
              var a = e.transform(t.getters.originalUrl, o);t.commit("SET_FILE_TRANSFORMATION", a);
            }
          } catch (e) {
            console.log(e);
          } else if (delete o.resize, Object.keys(o).length) {
            var s = e.transform(t.getters.originalUrl, o);t.getters.imageUrl !== s && (t.commit("SET_IMAGE_URL", s), t.commit("SET_IMAGE_LOADING", !0));
          }return Promise.resolve();
        } },
          c = { imageUrl: function imageUrl(e) {
          return r(e.imageUrl);
        }, originalUrl: function originalUrl(e) {
          return e.originalUrl;
        }, imageNaturalWidth: function imageNaturalWidth(e) {
          return e.imageNaturalWidth;
        }, imageNaturalHeight: function imageNaturalHeight(e) {
          return e.imageNaturalHeight;
        }, imageLoading: function imageLoading(e) {
          return e.imageLoading;
        }, imageUploading: function imageUploading(e) {
          return e.imageUploading;
        }, cachedCropRectangle: function cachedCropRectangle(e) {
          return e.cropRectangle;
        }, transformations: function transformations(e) {
          return e.transformations;
        }, cropEnabled: function cropEnabled(e) {
          return e.config.crop;
        }, cropCircleEnabled: function cropCircleEnabled(e) {
          return e.config.crop && e.config.crop.circle && (!e.config.crop.aspectRatio || 1 === e.config.crop.aspectRatio);
        }, filtersEnabled: function filtersEnabled(e) {
          return !(!e.config.filters || !e.config.filters.length) && e.config.filters;
        }, activeTransform: function activeTransform(e) {
          return e.activeTransform;
        }, cropAspectRatio: function cropAspectRatio(e) {
          return e.config.crop && e.config.crop.aspectRatio;
        } };return { state: hi({}, o, { config: t }, i), mutations: a, actions: s, getters: c };
    };nt.use(Xr);var Us = function Us(e, t, n, i) {
      var o = t.fromSources[0],
          r = ["source", o.name];return i = hi({ apiClient: e, config: t, route: r, routesHistory: [], mobileNavActive: Ya(navigator.userAgent), selectLabelIsActive: !1 }, i), new Xr.Store({ state: i, modules: { uploadQueue: $a(e, i.uploadQueue), cloud: Os(e), imageSearch: ks(e), transformer: Ds(e, t.transformations), notifications: xs }, mutations: { CHANGE_ROUTE: function CHANGE_ROUTE(e, t) {
            Ya(navigator.userAgent) && -1 !== t.indexOf("local_file_system") && (e.mobileNavActive = !0), e.routesHistory.push(e.route), e.route = t;
          }, GO_BACK_WITH_ROUTE: function GO_BACK_WITH_ROUTE(e) {
            var t = e.routesHistory.pop();Ya(navigator.userAgent) && -1 !== t.indexOf("local_file_system") && (e.mobileNavActive = !0), e.route = t;
          }, UPDATE_MOBILE_NAV_ACTIVE: function UPDATE_MOBILE_NAV_ACTIVE(e, t) {
            e.mobileNavActive = t;
          }, UPDATE_SELECT_LABEL_ACTIVE: function UPDATE_SELECT_LABEL_ACTIVE(e, t) {
            e.selectLabelIsActive = t;
          } }, actions: { allUploadsDone: function allUploadsDone(e) {
            e.commit("CHANGE_ROUTE", ["done"]);var t = ma(e.getters.filesDone),
                i = ma(e.getters.filesFailed);n({ filesUploaded: t, filesFailed: i });
          }, goBack: function goBack(e) {
            e.commit("GO_BACK_WITH_ROUTE");
          }, updateMobileNavActive: function updateMobileNavActive(e, t) {
            e.commit("UPDATE_MOBILE_NAV_ACTIVE", t);
          }, updateSelectLabelActive: function updateSelectLabelActive(e, t) {
            e.commit("UPDATE_SELECT_LABEL_ACTIVE", t);
          } }, getters: { apiClient: function apiClient(e) {
            return e.apiClient;
          }, uiVisible: function uiVisible(e, t) {
            return !t.uploadStarted || !e.config.hideWhenUploading;
          }, route: function route(e) {
            return e.route;
          }, routesHistory: function routesHistory(e) {
            return e.routesHistory;
          }, fromSources: function fromSources(e) {
            return e.config.fromSources;
          }, accept: function accept(e) {
            return e.config.accept;
          }, preferLinkOverStore: function preferLinkOverStore(e) {
            return e.config.preferLinkOverStore;
          }, maxSize: function maxSize(e) {
            return e.config.maxSize;
          }, minFiles: function minFiles(e) {
            return e.config.minFiles;
          }, maxFiles: function maxFiles(e) {
            return e.config.maxFiles;
          }, startUploadingWhenMaxFilesReached: function startUploadingWhenMaxFilesReached(e) {
            return e.config.startUploadingWhenMaxFilesReached;
          }, storeTo: function storeTo(e) {
            return e.config.storeTo;
          }, uploadInBackground: function uploadInBackground(e) {
            return e.config.uploadInBackground;
          }, onFileSelected: function onFileSelected(e) {
            return e.config.onFileSelected;
          }, onFileUploadStarted: function onFileUploadStarted(e) {
            return e.config.onFileUploadStarted;
          }, onFileUploadProgress: function onFileUploadProgress(e) {
            return e.config.onFileUploadProgress;
          }, onFileUploadFinished: function onFileUploadFinished(e) {
            return e.config.onFileUploadFinished;
          }, onFileUploadFailed: function onFileUploadFailed(e) {
            return e.config.onFileUploadFailed;
          }, mobileNavActive: function mobileNavActive(e) {
            return e.mobileNavActive;
          }, selectLabelIsActive: function selectLabelIsActive(e) {
            return e.selectLabelIsActive;
          }, disableTransformer: function disableTransformer(e) {
            return e.config.disableTransformer;
          }, lang: function lang(e) {
            return e.config.lang;
          } } });
    },
        Ms = function Ms(e) {
      return "number" == typeof e;
    },
        $s = function $s(e) {
      return "object" === (void 0 === e ? "undefined" : pi(e)) && null !== e && !1 === Array.isArray(e);
    },
        Ps = function Ps(e) {
      return e % 1 == 0;
    },
        zs = { fromSources: function fromSources(e) {
        return "string" == typeof e && (e = [e]), e.map(ia);
      }, accept: function accept(e) {
        return "string" == typeof e && (e = [e]), e.forEach(function (e) {
          if ("string" != typeof e) throw new Error('Invalid value for "accept" config option');
        }), e;
      }, preferLinkOverStore: function preferLinkOverStore(e) {
        if ("boolean" != typeof e) throw new Error('Invalid value for "preferLinkOverStore" config option');return e;
      }, maxSize: function maxSize(e) {
        if ("number" != typeof e || !Ps(e) || e < 0) throw new Error('Invalid value for "maxSize" config option');return e;
      }, minFiles: function minFiles(e) {
        if ("number" != typeof e || !Ps(e) || e < 0) throw new Error('Invalid value for "minFiles" config option');return e;
      }, maxFiles: function maxFiles(e) {
        if ("number" != typeof e || !Ps(e) || e < 0) throw new Error('Invalid value for "maxFiles" config option');return e;
      }, startUploadingWhenMaxFilesReached: function startUploadingWhenMaxFilesReached(e) {
        if ("boolean" != typeof e) throw new Error('Invalid value for "startUploadingWhenMaxFilesReached" config option');return e;
      }, loadCss: function loadCss(e) {
        if ("boolean" == typeof e && !1 === e || "string" == typeof e) return e;throw new Error('Invalid value for "loadCss" config option');
      }, lang: function lang(e) {
        if ("boolean" == typeof e && !1 === e || "string" == typeof e) return e;throw new Error('Invalid value for "lang" config option');
      }, storeTo: function storeTo(e) {
        if ($s(e)) return e;throw new Error('Invalid value for "storeTo" config option');
      }, hideWhenUploading: function hideWhenUploading(e) {
        if ("boolean" != typeof e) throw new Error('Invalid value for "hideWhenUploading" config option');return e;
      }, uploadInBackground: function uploadInBackground(e) {
        if ("boolean" != typeof e) throw new Error('Invalid value for "uploadInBackground" config option');return e;
      }, disableTransformer: function disableTransformer(e) {
        if ("boolean" != typeof e) throw new Error('Invalid value for "disableTransformer" config option');return e;
      }, onFileSelected: function onFileSelected(e) {
        if ("function" != typeof e) throw new Error('Invalid value for "onFileSelected" config option');return e;
      }, onFileUploadStarted: function onFileUploadStarted(e) {
        if ("function" != typeof e) throw new Error('Invalid value for "onFileUploadStarted" config option');return e;
      }, onFileUploadProgress: function onFileUploadProgress(e) {
        if ("function" != typeof e) throw new Error('Invalid value for "onFileUploadProgress" config option');return e;
      }, onFileUploadFinished: function onFileUploadFinished(e) {
        if ("function" != typeof e) throw new Error('Invalid value for "onFileUploadFinished" config option');return e;
      }, onFileUploadFailed: function onFileUploadFailed(e) {
        if ("function" != typeof e) throw new Error('Invalid value for "onFileUploadFailed" config option');return e;
      }, transformations: function transformations(e) {
        if ($s(e)) return e;throw new Error('Invalid value for "transformations" config option');
      }, "transformations.crop": function transformationsCrop(e) {
        if ($s(e)) return e;if (!0 === e) return {};if (!1 === e) return !1;throw new Error('Invalid value for "transformations.crop" config option');
      }, "transformations.crop.aspectRatio": function transformationsCropAspectRatio(e) {
        if (Ms(e)) return e;throw new Error('Invalid value for "transformations.crop.aspectRatio" config option');
      }, "transformations.crop.circle": function transformationsCropCircle(e) {
        if ("boolean" != typeof e) throw new Error('Invalid value for "transformations.crop.circle" config option');return e;
      }, "transformations.filters": function transformationsFilters(e) {
        var t = ["sepia", "monochrome"];if (!Array.isArray(e)) throw new Error('Option "transformations.filters" must be an array of strings');return e.forEach(function (e) {
          if (t.indexOf(e) < 0) throw new Error(e + ' is not a valid option for "transformations.filters"');if ("string" != typeof e) throw new Error('Option "transformations.filters" must be an array of strings');
        }), e;
      }, "transformations.minDimensions": function transformationsMinDimensions(e) {
        if (Array.isArray(e)) {
          if (2 === e.length) {
            if (!e.some(function (e) {
              return "number" != typeof e;
            })) return e;throw new Error('Option "transformations.minDimensions" requires array of numbers');
          }throw new Error('Option "transformations.minDimensions" requires array with exactly two elements: [width, height]');
        }throw new Error('Invalid value for "transformations.minDimensions" config option');
      }, "transformations.maxDimensions": function transformationsMaxDimensions(e) {
        if (Array.isArray(e)) {
          if (2 === e.length) {
            if (!e.some(function (e) {
              return "number" != typeof e;
            })) return e;throw new Error('Option "transformations.maxDimensions" requires array of numbers');
          }throw new Error('Option "transformations.maxDimensions" requires array with exactly two elements: [width, height]');
        }throw new Error('Invalid value for "transformations.maxDimensions" config option');
      } },
        Gs = function Gs(e, t) {
      return void 0 === e.fromSources && (e.fromSources = ["local_file_system", "imagesearch", "facebook", "instagram", "googledrive", "dropbox"]), void 0 === e.preferLinkOverStore && (e.preferLinkOverStore = !1), void 0 === e.minFiles && (e.minFiles = 1), void 0 === e.maxFiles && (e.maxFiles = 1), void 0 === e.startUploadingWhenMaxFilesReached && (e.startUploadingWhenMaxFilesReached = !1), void 0 === e.loadCss && (e.loadCss = t.css.main), void 0 === e.hideWhenUploading && (e.hideWhenUploading = !1), void 0 === e.lang && (e.lang = "en"), void 0 === e.uploadInBackground && (e.uploadInBackground = !0), void 0 === e.disableTransformer && (e.disableTransformer = !1), void 0 === e.transformations && (e.transformations = { crop: {}, filters: ["sepia", "monochrome"] }), void 0 !== e.transformations.crop && !0 !== e.transformations.crop || (e.transformations.crop = {}), void 0 === e.transformations.crop.circle && (e.transformations.crop.circle = !0), void 0 === e.transformations.filters && (e.transformations.filters = ["sepia", "monochrome"]), e;
    },
        js = function e(t, n) {
      var i = {};if (Object.keys(t).forEach(function (o) {
        var r = o;n && (r = n + "." + o);var a = zs[r];if (!a) throw new Error('Unknown config option "' + r + '"');var s = a(t[o]);$s(s) && -1 !== r.indexOf("transformations") ? i[o] = e(s, r) : i[o] = s;
      }), void 0 !== i.minFiles && void 0 !== i.maxFiles && i.minFiles > i.maxFiles) throw new Error('Config option "minFiles" must be smaller or equal to "maxFiles"');return i;
    },
        Ws = Or.context("picker"),
        Hs = function Hs(e, t, n) {
      return new Promise(function (i) {
        var o = function o(e) {
          i(e);
        };nt.use(wr), nt.locales(Ia);var r = document.createElement("div");document.body.appendChild(r);var a = new nt({ el: r, store: Us(e, t, o, n), render: function render(e) {
            return e(Rs);
          }, created: function created() {
            this.$translate.setLang(t.lang), document.body.classList.add("fsp-picker-open");
          }, destroyed: function destroyed() {
            a.$el.parentNode.removeChild(a.$el), document.body.classList.remove("fsp-picker-open");
          } });
      });
    },
        Bs = function Bs(e) {
      return !1 === e.loadCss ? Promise.resolve() : Dr.loadCss(e.loadCss);
    };return function (e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};return Ws("Starting picker v0.5.3 with config:", t), t = js(Gs(t, fi)), Bs(t).then(function () {
        return Hs(e, t, n);
      });
    };
  });
});

var api = (function (apikey, security) {
  var moduleOverrides = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (typeof apikey !== 'string') {
    throw new Error('No apikey specified');
  }

  if (security && !(security.policy && security.signature)) {
    throw new Error('signature and policy are both required for security');
  }

  var client$$1 = moduleOverrides.apiClient || client.init(apikey, security);

  logger$1('Initiated with apikey ' + apikey);

  return {
    getSecurity: function getSecurity() {
      return client$$1.getSecurity();
    },
    setSecurity: function setSecurity(sec) {
      return client$$1.setSecurity(sec);
    },
    pick: function pick(options) {
      return picker(client$$1, options);
    },
    storeURL: function storeURL(url, options) {
      return client$$1.storeURL(url, options);
    },
    transform: function transform(url, options) {
      return client$$1.transform(url, options);
    },
    upload: function upload(file, uploadOptions, storeOptions) {
      return client$$1.upload(file, uploadOptions, storeOptions);
    },
    retrieve: function retrieve(handle, options) {
      return client$$1.retrieve(handle, options);
    },
    remove: function remove(handle) {
      return client$$1.remove(handle);
    },
    metadata: function metadata(handle, options) {
      return client$$1.metadata(handle, options);
    }
  };
});

// -- <Polyfills> --
// -- </Polyfills> --
var init = function init(apikey, security) {
  return api(apikey, security);
};

var filestack = {
  version: '0.5.1',
  init: init
};

return filestack;

})));
//# sourceMappingURL=filestack.js.map
