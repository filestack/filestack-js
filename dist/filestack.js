/* v0.1.6 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.filestack = factory());
}(this, (function () { 'use strict';

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _global = createCommonjsModule(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
});

var _core = createCommonjsModule(function (module) {
  var core = module.exports = { version: '2.4.0' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
});

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
  return null !== u && "object" === ("undefined" == typeof u ? "undefined" : _typeof$1(u));
}function RequestBase(u) {
  if (u) return mixin(u);
}function mixin(u) {
  for (var e in RequestBase.prototype) {
    u[e] = RequestBase.prototype[e];
  }return u;
}function isFunction(u) {
  var e = isObject$2$1(u) ? Object.prototype.toString.call(u) : "";return "[object Function]" === e;
}function ResponseBase(u) {
  if (u) return mixin$1(u);
}function mixin$1(u) {
  for (var e in ResponseBase.prototype) {
    u[e] = ResponseBase.prototype[e];
  }return u;
}function replacer(u, e) {
  return "function" == typeof e ? getFunctionName(e) : e;
}function assert(u, e) {
  u !== !0 && (isFunction$1(e) ? e = e() : isNil(e) && (e = 'Assert failed (turn on "Pause on exceptions" in your Source panel)'), assert.fail(e));
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
    var r = create(u, e, t);return r;
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
          A = create$7(s, c, null);r = r && c === A, i.push(A);
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
        var a = Function.prototype.bind.apply(t, [this].concat(r)),
            s = func(u.slice(o), e);return s.of(a, !0);
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
      if (r = t[n], r === e || r.fn === e) {
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
  return u && "object" === ("undefined" == typeof u ? "undefined" : _typeof$1(u)) ? ("undefined" != typeof u.deadline && (this._timeout = u.deadline), "undefined" != typeof u.response && (this._responseTimeout = u.response), this) : (this._timeout = u, this._responseTimeout = 0, this);
}, RequestBase.prototype.retry = function (u) {
  return 0 !== arguments.length && u !== !0 || (u = 1), u <= 0 && (u = 0), this._maxRetries = u, this._retries = 0, this;
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
  } else "string" == typeof u ? (t || this.type("form"), t = this._header["content-type"], "application/x-www-form-urlencoded" == t ? this._data = this._data ? this._data + "&" + u : u : this._data = (this._data || "") + u) : this._data = u;return !e || this._isHost(u) ? this : (t || this.type("json"), this);
}, RequestBase.prototype.sortQuery = function (u) {
  return this._sort = "undefined" == typeof u || u, this;
}, RequestBase.prototype._timeoutError = function (u, e) {
  if (!this._aborted) {
    var t = new Error(u + e + "ms exceeded");t.timeout = e, t.code = "ECONNABORTED", this.timedout = !0, this.abort(), this.callback(t);
  }
}, RequestBase.prototype._setTimeouts = function () {
  var u = this;this._timeout && !this._timer && (this._timer = setTimeout(function () {
    u._timeoutError("Timeout of ", u._timeout);
  }, this._timeout)), this._responseTimeout && !this._responseTimeoutTimer && (this._responseTimeoutTimer = setTimeout(function () {
    u._timeoutError("Response timeout of ", u._responseTimeout);
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
        r = t[0].slice(1, -1),
        n = t[1].split(/ *= */)[1].slice(1, -1);return u[n] = r, u;
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
  return !!(u && u.code && ~ERROR_CODES.indexOf(u.code)) || !!(e && e.status && e.status >= 500) || !!(u && "timeout" in u && "ECONNABORTED" == u.code);
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
      e = n[i], t = e.indexOf("="), t == -1 ? r[decodeURIComponent(e)] = "" : r[decodeURIComponent(e.slice(0, t))] = decodeURIComponent(e.slice(t + 1));
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
    this.req = u, this.xhr = this.req.xhr, this.text = "HEAD" != this.req.method && ("" === this.xhr.responseType || "text" === this.xhr.responseType) || "undefined" == typeof this.xhr.responseType ? this.xhr.responseText : null, this.statusText = this.req.xhr.statusText;var e = this.xhr.status;1223 === e && (e = 204), this._setStatusProperties(e), this.header = this.headers = o(this.xhr.getAllResponseHeaders()), this.header["content-type"] = this.xhr.getResponseHeader("content-type"), this._setHeaderProperties(this.header), null === this.text && u._responseType ? this.body = this.xhr.response : this.body = "HEAD" != this.req.method ? this._parseBody(this.text ? this.text : this.xhr.response) : null;
  }function c(u, e) {
    var t = this;this._query = this._query || [], this.method = u, this.url = e, this.header = {}, this._header = {}, this.on("end", function () {
      var u = null,
          e = null;try {
        e = new s(t);
      } catch (e) {
        return u = new Error("Parser is unable to parse the response"), u.parse = !0, u.original = e, t.xhr ? (u.rawResponse = "undefined" == typeof t.xhr.responseType ? t.xhr.responseText : t.xhr.response, u.status = t.xhr.status ? t.xhr.status : null, u.statusCode = u.status) : (u.rawResponse = null, u.status = null), t.callback(u);
      }t.emit("response", e);var r;try {
        t._isResponseOK(e) || (r = new Error(e.statusText || "Unsuccessful HTTP response"), r.original = u, r.response = e, r.status = e.status);
      } catch (u) {
        r = u;
      }r ? t.callback(r, e) : t.callback(null, e);
    });
  }function A(u, e, t) {
    var r = h("DELETE", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }var l;"undefined" != typeof window ? l = window : "undefined" != typeof self ? l = self : (console.warn("Using browser-only version of superagent in non-browser environment"), l = commonjsGlobal$1);var p = index,
      E = requestBase,
      f = isObject_1,
      d = isFunction_1,
      C = responseBase,
      F = shouldRetry,
      h = e = u.exports = function (u, t) {
    return "function" == typeof t ? new e.Request("GET", u).end(t) : 1 == arguments.length ? new e.Request("GET", u) : new e.Request(u, t);
  };e.Request = c, h.getXHR = function () {
    if (!(!l.XMLHttpRequest || l.location && "file:" == l.location.protocol && l.ActiveXObject)) return new XMLHttpRequest();try {
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
    switch ("object" === ("undefined" == typeof e ? "undefined" : _typeof$1(e)) && null !== e && (t = e), t || (t = { type: "function" == typeof btoa ? "basic" : "auto" }), t.type) {case "basic":
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
    return this._formData || (this._formData = new l.FormData()), this._formData;
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
    return u && "object" === ("undefined" == typeof u ? "undefined" : _typeof$1(u)) && !Array.isArray(u) && "[object Object]" !== Object.prototype.toString.call(u);
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
      null != this.header[o] && e.setRequestHeader(o, this.header[o]);
    }return this._responseType && (e.responseType = this._responseType), this.emit("request", this), e.send("undefined" != typeof t ? t : null), this;
  }, h.get = function (u, e, t) {
    var r = h("GET", u);return "function" == typeof e && (t = e, e = null), e && r.query(e), t && r.end(t), r;
  }, h.head = function (u, e, t) {
    var r = h("HEAD", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }, h.options = function (u, e, t) {
    var r = h("OPTIONS", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }, h.del = A, h.delete = A, h.patch = function (u, e, t) {
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
  return !isNil$3(u) && "object" === ("undefined" == typeof u ? "undefined" : _typeof$1(u)) && !isArray(u);
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
  return u === !0 || u === !1;
}; var irreducible$4 = irreducible$1; var isBoolean = isBoolean$1; var _Boolean = irreducible$4("Boolean", isBoolean); var irreducible$5 = irreducible$1; var _Date = irreducible$5("Date", function (u) {
  return u instanceof Date;
}); var irreducible$6 = irreducible$1; var _Error = irreducible$6("Error", function (u) {
  return u instanceof Error;
}); var irreducible$7 = irreducible$1; var isFunction$6 = isFunction$2; var _Function = irreducible$7("Function", isFunction$6); var irreducible$8 = irreducible$1; var isNil$4 = isNil$1; var Nil = irreducible$8("Nil", isNil$4); var isNumber$1 = function isNumber$1(u) {
  return "number" == typeof u && isFinite(u) && !isNaN(u);
}; var irreducible$9 = irreducible$1; var isNumber = isNumber$1; var _Number = irreducible$9("Number", isNumber); var isType$3 = isType$1; var isIdentity$1 = function isIdentity$1(u) {
  return !isType$3(u) || u.meta.identity;
}; var isType$4 = isType$1; var create$1 = function create$1(u, e, t) {
  return isType$4(u) ? u.meta.identity || "object" !== ("undefined" == typeof e ? "undefined" : _typeof$1(e)) || null === e ? u(e, t) : new u(e, t) : e;
}; var isType$5 = isType$1; var is$1 = function is$1(u, e) {
  return isType$5(e) ? e.is(u) : u instanceof e;
}; var assert$3 = assert_1; var isIdentity = isIdentity$1; var create = create$1; var is$1$1 = is$1; var getTypeName$3 = getTypeName$1; var getFunctionName$4 = getFunctionName$1;refinement$1.getDefaultName = getDefaultName;var refinement_1 = refinement$1; var refinement = refinement_1; var Number$1 = _Number; var Integer = refinement(Number$1, function (u) {
  return u % 1 === 0;
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
      var c = u[s];void 0 === c && (c = a[s]);var A = recurse(c, o[s], r.concat(s), n);i.value[s] = A.value, i.errors = i.errors.concat(A.errors);
    }
  }var l = n.hasOwnProperty("strict") ? n.strict : e.meta.strict;if (l) for (var p in u) {
    u.hasOwnProperty(p) && !o.hasOwnProperty(p) && i.errors.push(ValidationError.of(u[p], t.Nil, r.concat(p), n.context));
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
  }var c = n.hasOwnProperty("strict") ? n.strict : e.meta.strict;if (c) for (var A in u) {
    o.hasOwnProperty(A) || t.Nil.is(u[A]) || i.errors.push(ValidationError.of(u[A], t.Nil, r.concat(A), n.context));
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
    var e = t[u.name];if (e) {
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
  var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};if (!e || "string" != typeof e) throw new Error("url is required for store");var r = [{ name: "filename", type: index$2.String }, { name: "location", type: index$2.enums.of("s3 gcs rackspace azure dropbox") }, { name: "mimetype", type: index$2.String }, { name: "path", type: index$2.String }, { name: "container", type: index$2.String }, { name: "access", type: index$2.enums.of("public private") }, { name: "base64decode", type: index$2.Boolean }];checkOptions("store", r, t);var n = t.location || "s3",
      i = removeEmpty(t);u.policy && u.signature && (i.policy = u.policy, i.signature = u.signature);var o = storeApiUrl + "/" + n;return new Promise(function (t, r) {
    client$1.post(o).query({ key: u.apikey }).query(i).send("url=" + e).end(function (u, e) {
      u ? r(u) : t(e.body);
    });
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
      return "object" === ("undefined" == typeof u ? "undefined" : _typeof$1(u)) ? JSON.stringify(u, function (u, e) {
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
};initializeGlobalNamespace();var log = logger.context("api-client"); var cloudApiUrl = ENV.cloudApiUrl; var _cloud = function _cloud(u, e) {
  var t = function t(_t) {
    var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};return log("cloud.list() called:", _t), new Promise(function (n, i) {
      var o = client$1.get(cloudApiUrl + "/" + e + "/folder/list" + _t).query({ apikey: u.apikey }).withCredentials().end(function (u, e) {
        u ? i(u) : (log("cloud.list() responded:", e.body), n(e.body));
      });r.cancel = function () {
        o.abort(), i(new Error("Cancelled"));
      };
    });
  },
      r = function r(t) {
    var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
        n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};log("cloud.store() called:", t, r);var i = [{ name: "location", type: index$2.enums.of("S3 gcs rackspace azure dropbox") }, { name: "region", type: index$2.String }, { name: "path", type: index$2.String }, { name: "container", type: index$2.String }, { name: "access", type: index$2.enums.of("public private") }];checkOptions("cloud.store", i, r);var o = snakeKeys(r, "store");return new Promise(function (r, i) {
      var a = client$1.get(cloudApiUrl + "/" + e + "/store" + t).query({ apikey: u.apikey }).query(removeEmpty(o)).withCredentials().end(function (u, e) {
        u ? i(u) : (log("cloud.store() responded:", e.body), r(e.body));
      });n.cancel = function () {
        a.abort(), i(new Error("Cancelled"));
      };
    });
  },
      n = function n(t) {
    var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};return log("cloud.link() called:", t), new Promise(function (n, i) {
      var o = client$1.get(cloudApiUrl + "/" + e + "/link" + t).query({ apikey: u.apikey }).withCredentials().end(function (u, e) {
        u ? i(u) : (log("cloud.link() responded:", e.body), n(e.body));
      });r.cancel = function () {
        o.abort(), i(new Error("Cancelled"));
      };
    });
  },
      i = function i(e) {
    log("cloud.logout() called:", e);var t = e ? cloudApiUrl + "/" + e : cloudApiUrl;return new Promise(function (e, r) {
      client$1.get(t + "/auth/logout").query({ apikey: u.apikey }).withCredentials().end(function (u, t) {
        u ? r(u) : (log("cloud.logout() responded:", t.body), e(t.body));
      });
    });
  };return { name: e, list: t, store: r, link: n, logout: i };
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
      t = [{ name: "deg", type: index$2.union([numberRange(0, 359), index$2.enums.of("exif")]) }, { name: "exif", type: index$2.Boolean }, { name: "background", type: index$2.String }],
      r = checkOptions("rotate", t, e);if (r.length < 1) throw new Error("Rotate options must contain either deg or exif");var n = formatOptions("rotate", t, e);return u.concat(n);
}; var resize = function resize() {
  var u = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
      e = arguments[1],
      t = [{ name: "width", type: numberRange(0, 1e4) }, { name: "height", type: numberRange(0, 1e4) }, { name: "fit", type: index$2.enums.of("clip crop scale max") }, { name: "align", type: index$2.union([index$2.enums.of("center top bottom left right faces"), alignPair]) }],
      r = checkOptions("resize", t, e);if (r.length < 1) throw new Error("Resize options must contain either width, height, fit, or align");var n = formatOptions("resize", t, e);return u.concat(n);
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
    var o = "security=policy:" + u.policy + ",signature:" + u.signature,
        a = processURL + "/" + u.apikey + "/" + o,
        s = i().join("/");return a + "/" + s + "/" + e;
  }var c = processURL + "/" + u.apikey,
      A = i().join("/");return c + "/" + A + "/" + e;
}; var sparkMd5 = createCommonjsModule$1(function (u, e) {
  !function (e) {
    u.exports = e();
  }(function (u) {
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
          A = [1732584193, -271733879, -1732584194, 271733878];for (r = 64; r <= c; r += 64) {
        e(A, t(u.substring(r - 64, r)));
      }for (u = u.substring(r - 64), n = u.length, i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], r = 0; r < n; r += 1) {
        i[r >> 2] |= u.charCodeAt(r) << (r % 4 << 3);
      }if (i[r >> 2] |= 128 << (r % 4 << 3), r > 55) for (e(A, i), r = 0; r < 16; r += 1) {
        i[r] = 0;
      }return o = 8 * c, o = o.toString(16).match(/(.*?)(.{0,8})$/), a = parseInt(o[2], 16), s = parseInt(o[1], 16) || 0, i[14] = a, i[15] = s, e(A, i), A;
    }function i(u) {
      var t,
          n,
          i,
          o,
          a,
          s,
          c = u.length,
          A = [1732584193, -271733879, -1732584194, 271733878];for (t = 64; t <= c; t += 64) {
        e(A, r(u.subarray(t - 64, t)));
      }for (u = t - 64 < c ? u.subarray(t - 64) : new Uint8Array(0), n = u.length, i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], t = 0; t < n; t += 1) {
        i[t >> 2] |= u[t] << (t % 4 << 3);
      }if (i[t >> 2] |= 128 << (t % 4 << 3), t > 55) for (e(A, i), t = 0; t < 16; t += 1) {
        i[t] = 0;
      }return o = 8 * c, o = o.toString(16).match(/(.*?)(.{0,8})$/), a = parseInt(o[2], 16), s = parseInt(o[1], 16) || 0, i[14] = a, i[15] = s, e(A, i), A;
    }function o(u) {
      var e,
          t = "";for (e = 0; e < 4; e += 1) {
        t += d[u >> 8 * e + 4 & 15] + d[u >> 8 * e & 15];
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
    }function A(u) {
      return String.fromCharCode.apply(null, new Uint8Array(u));
    }function l(u, e, t) {
      var r = new Uint8Array(u.byteLength + e.byteLength);return r.set(new Uint8Array(u)), r.set(new Uint8Array(e), u.byteLength), t ? r : r.buffer;
    }function p(u) {
      var e,
          t = [],
          r = u.length;for (e = 0; e < r - 1; e += 2) {
        t.push(parseInt(u.substr(e, 2), 16));
      }return String.fromCharCode.apply(String, t);
    }function E() {
      this.reset();
    }var f = function f(u, e) {
      return u + e & 4294967295;
    },
        d = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];return "5d41402abc4b2a76b9719d911017c592" !== a(n("hello")) && (f = function f(u, e) {
      var t = (65535 & u) + (65535 & e),
          r = (u >> 16) + (e >> 16) + (t >> 16);return r << 16 | 65535 & t;
    }), "undefined" == typeof ArrayBuffer || ArrayBuffer.prototype.slice || !function () {
      function e(u, e) {
        return u = 0 | u || 0, u < 0 ? Math.max(u + e, 0) : Math.min(u, e);
      }ArrayBuffer.prototype.slice = function (t, r) {
        var n,
            i,
            o,
            a,
            s = this.byteLength,
            c = e(t, s),
            A = s;return r !== u && (A = e(r, s)), c > A ? new ArrayBuffer(0) : (n = A - c, i = new ArrayBuffer(n), o = new Uint8Array(i), a = new Uint8Array(this, c, n), o.set(a), i);
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
          n = l(this._buff.buffer, u, !0),
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
      var u = E.prototype.getState.call(this);return u.buff = A(u.buff), u;
    }, E.ArrayBuffer.prototype.setState = function (u) {
      return u.buff = c(u.buff, !0), E.prototype.setState.call(this, u);
    }, E.ArrayBuffer.prototype.destroy = E.prototype.destroy, E.ArrayBuffer.prototype._finish = E.prototype._finish, E.ArrayBuffer.hash = function (u, e) {
      var t = i(new Uint8Array(u)),
          r = a(t);return e ? p(r) : r;
    }, E;
  });
}); var uploadURL = ENV.uploadApiUrl; var parseStoreOpts = function parseStoreOpts(u, e) {
  var t = [{ name: "location", type: index$2.enums.of("s3 gcs rackspace azure dropbox") }, { name: "region", type: index$2.String }, { name: "path", type: index$2.String }, { name: "container", type: index$2.String }, { name: "access", type: index$2.enums.of("public private") }];checkOptions("upload (storeParams)", t, e);var r = snakeKeys(e, "store");return u.policy && u.signature ? Object.assign({}, r, { signature: u.signature, policy: u.policy }) : r;
}; var Uploader = function Uploader(u, e, t) {
  function r(u) {
    return btoa(sparkMd5.ArrayBuffer.hash(u, !0));
  }this.config = Object.assign({}, { host: uploadURL, apikey: u.apikey, partSize: 5242880, maxConcurrentUploads: 5, cryptoMd5Method: r, retryOptions: { retries: 10, factor: 2, minTimeout: 1e3, maxTimeout: 6e4 }, onStart: null, onRetry: null, onUploadStart: null, onProgress: null, onUploadCompleteFunction: null, onCompleteFunction: null, onUploadFailedFunction: null }, e), void 0 !== t && (this.storeParams = Object.assign({}, { store_location: "", store_region: "", store_container: "", store_path: "", store_access: "" }, parseStoreOpts(u, t))), this.parts = {}, this.file = null, this.currentUploads = 0, this.uploadData = null, this.uploadFailed = null, this.attempts = 0;
};Uploader.prototype.slice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice, Uploader.prototype.multipartUpload = function (u) {
  var e = this;e.file = u, e.parts.reader = new FileReader(), e.parts.current = 0, e.parts.total = Math.ceil(e.file.size / e.config.partSize), e.parts.uploaded = [], e.parts.failures = [], null !== e.config.onProgress && (e.parts.progress = Array.apply(void 0, toConsumableArray$1(Array(e.parts.total))).map(Number.prototype.valueOf, 0)), e.parts.reader.onload = function (u) {
    e.onPartLoad(u);
  }, e.initUpload();
}, Uploader.prototype.initUpload = function () {
  var u = this;u.start(function (e, t) {
    t && t.ok ? u.loadNextPart() : u.processRetries();
  });
}, Uploader.prototype.start = function (u) {
  var e = this;null !== e.config.onStart && e.config.onStart();var t = { filename: e.file.name, mimetype: e.file.type || "application/octet-stream", size: e.file.size },
      r = e.createUploadFormData(t),
      n = new XMLHttpRequest();n.onreadystatechange = function () {
    if (4 === n.readyState) if (200 === n.status) {
      var t = { ok: !0 };e.uploadData = JSON.parse(n.response), u(null, t);
    } else {
      var r = JSON.parse(n.response).status;r ? e.config.onUploadFailedFunction(new Error(r)) : e.config.onUploadFailedFunction(new Error(n.statusText));
    }
  }, n.onerror = function (e) {
    u(e, null);
  }, n.open("POST", e.config.host + "/multipart/start", !0), n.send(r);
}, Uploader.prototype.loadNextPart = function () {
  var u = this;if (u.currentUploads >= u.config.maxConcurrentUploads) return void setTimeout(function () {
    u.loadNextPart();
  }, 100);u.currentUploads += 1;var e = u.parts.current * u.config.partSize,
      t = e + u.config.partSize >= u.file.size ? u.file.size : e + u.config.partSize;u.parts.reader.readAsArrayBuffer(u.slice.call(u.file, e, t));
}, Uploader.prototype.onPartLoad = function (u) {
  var e = this,
      t = 0,
      r = !1;for (t = 0; t < e.parts.uploaded.length; t += 1) {
    var n = e.parts.uploaded[t].split(":", 1),
        i = parseInt(n[0], 10);if (i === e.parts.current + 1) {
      r = !0;break;
    }
  }if (e.parts.current += 1, r) e.currentUploads -= 1;else {
    var o = e.config.cryptoMd5Method(u.target.result);e.getUploadData(u.target.result, e.parts.current, u.total, o);
  }e.parts.current < e.parts.total ? e.loadNextPart() : e.waitForAllPartsAttempted();
}, Uploader.prototype.getUploadData = function (u, e, t, r) {
  var n = this;if (null !== n.uploadFailed) return void n.config.onUploadFailedFunction(n.uploadFailed);if (null === n.uploadData) return void setTimeout(function () {
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
  var r = this;r.uploadPart(u, e, t);
}, Uploader.prototype.uploadPart = function (u, e, t) {
  var r = this;null !== r.config.onUploadStart && (r.config.onUploadStart(), r.config.onUploadStart = null);var n = new XMLHttpRequest();n.onreadystatechange = function () {
    if (4 === n.readyState && 200 === n.status) {
      r.currentUploads -= 1;var u = n.getResponseHeader("ETag");r.parts.uploaded.push(t + ":" + u);
    }
  }, null !== r.config.onProgress && (n.upload.onprogress = function (e) {
    r.updateProgress(e.loaded, t, u.byteLength);
  }), n.onerror = function (e) {
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
  var r = this;r.parts.failures.indexOf(e) > -1 || (r.updateProgress(0, e, t), r.currentUploads -= 1, r.parts.failures.push(e));
}, Uploader.prototype.waitForAllPartsAttempted = function () {
  var u = this;return u.parts.uploaded.length + u.parts.failures.length < u.parts.total ? void setTimeout(function () {
    u.waitForAllPartsAttempted();
  }, 100) : void (u.allPartsLoaded() ? u.complete() : u.processRetries());
}, Uploader.prototype.backOffWait = function () {
  var u = this;return 0 === u.attempts ? u.config.retryOptions.minTimeout : Math.min(u.config.retryOptions.maxTimeout, 1e3 * Math.pow(u.config.retryOptions.factor, u.attempts));
}, Uploader.prototype.processRetries = function () {
  var u = this;if (u.config.retryOptions && u.attempts < u.config.retryOptions.retries) {
    var e = u.backOffWait();u.currentUploads = 0, u.parts.current = 0, u.parts.failures = [], u.attempts += 1, null !== u.config.onRetry && u.config.onRetry(u.attempts, e), u.uploadData ? setTimeout(function () {
      u.loadNextPart();
    }, e) : setTimeout(function () {
      u.initUpload();
    }, e);
  } else u.uploadFailed = !0, u.config.onUploadFailedFunction(new Error("Failed to upload after " + u.attempts + " attempt(s)."));
}, Uploader.prototype.complete = function () {
  var u = this;null !== u.config.onUploadCompleteFunction && u.config.onUploadCompleteFunction();var e = { size: u.file.size, filename: u.file.name, mimetype: u.file.type || "application/octet-stream", parts: u.parts.uploaded.join(";") },
      t = u.createUploadFormData(e),
      r = new XMLHttpRequest();r.onreadystatechange = function () {
    4 === r.readyState && 200 === r.status && null !== u.config.onCompleteFunction && u.config.onCompleteFunction(JSON.parse(r.response));
  }, r.onerror = function (e) {
    u.config.onUploadFailedFunction(e);
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
};var _upload = function _upload(u, e) {
  var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
      r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};return new Promise(function (n, i) {
    var o = Object.assign({}, t, { onCompleteFunction: function onCompleteFunction(u) {
        return n(u);
      }, onUploadFailedFunction: function onUploadFailedFunction(u) {
        return i(u);
      } }),
        a = new Uploader(u, o, r);a.multipartUpload(e);
  });
}; var init$1 = function init(u, e) {
  if (!u || "string" != typeof u) throw new Error("apikey is required to initialize the Filestack client");if (e && (!e.policy || !e.signature)) throw new Error("signature and policy are both required for security");var t = Object.assign({}, e, { apikey: u });return { _security: e, storeURL: function storeURL(u, e) {
      return _storeURL(t, u, e);
    }, retrieve: function retrieve(u, e) {
      return _retrieve(t, u, e);
    }, remove: function remove(u, e) {
      return _remove(t, u, e);
    }, metadata: function metadata(u, e) {
      return _metadata(t, u, e);
    }, cloud: function cloud(u) {
      return _cloud(t, u);
    }, transform: function transform(u, e) {
      return _transform(t, u, e);
    }, upload: function upload(u, e, r) {
      return _upload(t, u, e, r);
    } };
}; var client = { version: "0.1.3", init: init$1 };

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

var ENV$1 = {
  pickerUis: {
    default: '//static.filestackapi.com/picker/v3/picker-0.2.8.js'
  }
};

// -----------------------------------------------------------------------------
// Init

var initializeGlobalNamespace$2 = function initializeGlobalNamespace() {
  var namespace = void 0;
  if ((typeof window === 'undefined' ? 'undefined' : _typeof(window)) === 'object') {
    namespace = window.filestackInternals;
    if (!namespace) {
      namespace = {};
      window.filestackInternals = namespace;
    }
    if (!namespace.loader) {
      namespace.loader = {
        modules: {}
      };
    }
  }
  return namespace;
};

var filestackInternals = initializeGlobalNamespace$2();

// -----------------------------------------------------------------------------
// Modules loading

// All modules share global "register", so different instances of loader can
// communicate which modules were already loaded and which not.
var modules = filestackInternals.loader.modules;

var loadModule = function loadModule(url) {
  var moduleDefinition = modules[url];
  if (!moduleDefinition) {
    modules[url] = {};
    moduleDefinition = modules[url];
  }

  if (moduleDefinition.instance) {
    return Promise.resolve(moduleDefinition.instance);
  }

  if (moduleDefinition.promise) {
    return moduleDefinition.promise;
  }

  var promise = new Promise(function (resolve) {
    var embedScript = function embedScript() {
      moduleDefinition.resolvePromise = resolve;
      var script = document.createElement('script');
      script.src = url;
      document.body.appendChild(script);
    };

    var checkIfDomReady = function checkIfDomReady() {
      if (document.readyState === 'complete') {
        embedScript();
      } else {
        setTimeout(checkIfDomReady, 50);
      }
    };

    checkIfDomReady();
  });

  moduleDefinition.promise = promise;

  return promise;
};

var registerReadyModule = function registerReadyModule(instance) {
  var scriptTags = document.getElementsByTagName('script');
  var thisScript = scriptTags[scriptTags.length - 1];
  var url = thisScript.getAttribute('src');
  var moduleDefinition = modules[url];
  if (moduleDefinition.resolvePromise) {
    moduleDefinition.instance = instance;
    moduleDefinition.resolvePromise(instance);
    delete moduleDefinition.promise;
    delete moduleDefinition.resolvePromise;
  }
};

// -----------------------------------------------------------------------------
// CSS loading

var loadCss = function loadCss(url) {
  var alreadyAddedThisTag = document.querySelector('link[href="' + url + '"]');
  if (alreadyAddedThisTag !== null) {
    return Promise.resolve();
  }

  return new Promise(function (resolve) {
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');

    var loaded = function loaded() {
      resolve();
      link.removeEventListener('load', loaded);
    };

    link.rel = 'stylesheet';
    link.href = url;
    link.addEventListener('load', loaded);
    head.appendChild(link);
  });
};

var index$1 = {
  registerReadyModule: registerReadyModule,
  loadModule: loadModule,
  loadCss: loadCss
};

var uis = ENV$1.pickerUis;

var _pick = (function (client) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var moduleOverrides = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var loader = moduleOverrides.loader || index$1;

  var pickerUi = config.ui || 'default';
  if (typeof pickerUi === 'string') {
    var pickerUrl = uis[pickerUi] || config.ui;
    return loader.loadModule(pickerUrl).then(function (pickerConstructor) {
      return pickerConstructor(client, config);
    });
  } else if (typeof pickerUi === 'function') {
    // Because loading scripts (in case above) is asynchronous, we also make
    // function call asynchronous to be consistent.
    return setTimeout(function () {
      return pickerUi(client, config);
    }, 0);
  }
  throw new Error('"ui" parameter must be a function or one of strings: ' + Object.keys(uis).toString());
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
    pick: function pick(config) {
      return _pick(client$$1, config, moduleOverrides);
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

var init = function init(apikey, config) {
  return api(apikey, config);
};

var filestack = {
  version: '0.1.6',
  init: init
};

return filestack;

})));
//# sourceMappingURL=filestack.js.map
