/* v0.2.1 */
var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





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
  return r = r || {}, new ValidationResult(recurse(u, e, t.Array.is(r) ? r : r.path || [], r));
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
      t = i[a], e = t.indexOf(":"), r = t.slice(0, e).toLowerCase(), n = y(t.slice(e + 1)), o[r] = n;
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
  }function A(u, e, t) {
    var r = F("DELETE", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }var l;"undefined" != typeof window ? l = window : "undefined" != typeof self ? l = self : (console.warn("Using browser-only version of superagent in non-browser environment"), l = commonjsGlobal$1);var p = index,
      E = requestBase,
      f = isObject_1,
      d = isFunction_1,
      C = responseBase,
      h = shouldRetry,
      F = e = u.exports = function (u, t) {
    return "function" == typeof t ? new e.Request("GET", u).end(t) : 1 == arguments.length ? new e.Request("GET", u) : new e.Request(u, t);
  };e.Request = c, F.getXHR = function () {
    if (!(!l.XMLHttpRequest || l.location && "file:" == l.location.protocol && l.ActiveXObject)) return new XMLHttpRequest();try {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (u) {}try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (u) {}try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch (u) {}try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (u) {}throw Error("Browser-only verison of superagent could not find XHR");
  };var y = "".trim ? function (u) {
    return u.trim();
  } : function (u) {
    return u.replace(/(^\s*|\s*$)/g, "");
  };F.serializeObject = r, F.parseString = i, F.types = { html: "text/html", json: "application/json", xml: "application/xml", urlencoded: "application/x-www-form-urlencoded", form: "application/x-www-form-urlencoded", "form-data": "application/x-www-form-urlencoded" }, F.serialize = { "application/x-www-form-urlencoded": r, "application/json": JSON.stringify }, F.parse = { "application/x-www-form-urlencoded": i, "application/json": JSON.parse }, C(s.prototype), s.prototype._parseBody = function (u) {
    var e = F.parse[this.type];return this.req._parser ? this.req._parser(this, u) : (!e && a(this.type) && (e = F.parse["application/json"]), e && u && (u.length || u instanceof Object) ? e(u) : null);
  }, s.prototype.toError = function () {
    var u = this.req,
        e = u.method,
        t = u.url,
        r = "cannot " + e + " " + t + " (" + this.status + ")",
        n = new Error(r);return n.status = this.status, n.method = e, n.url = t, n;
  }, F.Response = s, p(c.prototype), E(c.prototype), c.prototype.type = function (u) {
    return this.set("Content-Type", F.types[u] || u), this;
  }, c.prototype.accept = function (u) {
    return this.set("Accept", F.types[u] || u), this;
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
    return this._formData || (this._formData = new l.FormData()), this._formData;
  }, c.prototype.callback = function (u, e) {
    if (this._maxRetries && this._retries++ < this._maxRetries && h(u, e)) return this._retry();var t = this._callback;this.clearTimeout(), u && (this._maxRetries && (u.retries = this._retries - 1), this.emit("error", u)), t(u, e);
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
        e = this.xhr = F.getXHR(),
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
          i = this._serializer || F.serialize[n ? n.split(";")[0] : ""];!i && a(n) && (i = F.serialize["application/json"]), i && (t = i(t));
    }for (var o in this.header) {
      null != this.header[o] && e.setRequestHeader(o, this.header[o]);
    }return this._responseType && (e.responseType = this._responseType), this.emit("request", this), e.send(void 0 !== t ? t : null), this;
  }, F.get = function (u, e, t) {
    var r = F("GET", u);return "function" == typeof e && (t = e, e = null), e && r.query(e), t && r.end(t), r;
  }, F.head = function (u, e, t) {
    var r = F("HEAD", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }, F.options = function (u, e, t) {
    var r = F("OPTIONS", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }, F.del = A, F.delete = A, F.patch = function (u, e, t) {
    var r = F("PATCH", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }, F.post = function (u, e, t) {
    var r = F("POST", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }, F.put = function (u, e, t) {
    var r = F("PUT", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
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
      var c = u[s];void 0 === c && (c = a[s]);var A = recurse(c, o[s], r.concat(s), n);i.value[s] = A.value, i.errors = i.errors.concat(A.errors);
    }
  }if (n.hasOwnProperty("strict") ? n.strict : e.meta.strict) for (var l in u) {
    u.hasOwnProperty(l) && !o.hasOwnProperty(l) && i.errors.push(ValidationError.of(u[l], t.Nil, r.concat(l), n.context));
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
  var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};if (!e || "string" != typeof e) throw new Error("url is required for store");checkOptions("store", [{ name: "filename", type: index$2.String }, { name: "location", type: index$2.enums.of("s3 gcs rackspace azure dropbox") }, { name: "mimetype", type: index$2.String }, { name: "path", type: index$2.String }, { name: "container", type: index$2.String }, { name: "access", type: index$2.enums.of("public private") }, { name: "base64decode", type: index$2.Boolean }], t);var r = t.location || "s3",
      n = removeEmpty(t);u.policy && u.signature && (n.policy = u.policy, n.signature = u.signature);var i = storeApiUrl + "/" + r;return new Promise(function (t, r) {
    client$1.post(i).query({ key: u.apikey }).query(n).send("url=" + e).end(function (u, e) {
      u ? r(u) : t(e.body);
    });
  });
}; var fileApiUrl = ENV.fileApiUrl; var _retrieve = function _retrieve(u, e) {
  var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};if (!e || "string" != typeof e) throw new Error("handle is required for retrieve");checkOptions("retrieve", [{ name: "metadata", type: index$2.Boolean }, { name: "head", type: index$2.Boolean }, { name: "cache", type: index$2.Boolean }, { name: "dl", type: index$2.Boolean }, { name: "extension", type: index$2.String }], t);var r = fileApiUrl + "/" + e,
      n = removeEmpty(t);return n.extension && (r += "+" + n.extension, delete n.extension), n.metadata && (r += "/metadata"), u.policy && u.signature && (n.policy = u.policy, n.signature = u.signature), n.head ? (delete n.head, new Promise(function (u, e) {
    client$1.head(r).query(n).end(function (t, r) {
      t ? e(t) : u(r.headers);
    });
  })) : new Promise(function (u, e) {
    var t = n.metadata ? "json" : "blob";delete n.metadata, client$1.get(r).query(n).responseType(t).end(function (t, r) {
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
  var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};if (!e || "string" != typeof e) throw new Error("handle is required for metadata");checkOptions("retrieve", [{ name: "size", type: index$2.Boolean }, { name: "mimetype", type: index$2.Boolean }, { name: "filename", type: index$2.Boolean }, { name: "width", type: index$2.Boolean }, { name: "height", type: index$2.Boolean }, { name: "uploaded", type: index$2.Boolean }, { name: "writeable", type: index$2.Boolean }, { name: "cloud", type: index$2.Boolean }, { name: "sourceUrl", type: index$2.Boolean }, { name: "md5", type: index$2.Boolean }, { name: "sha1", type: index$2.Boolean }, { name: "sha224", type: index$2.Boolean }, { name: "sha256", type: index$2.Boolean }, { name: "sha384", type: index$2.Boolean }, { name: "sha512", type: index$2.Boolean }, { name: "location", type: index$2.Boolean }, { name: "path", type: index$2.Boolean }, { name: "container", type: index$2.Boolean }, { name: "exif", type: index$2.Boolean }], t);var r = removeEmpty(snakeKeys(t));u.policy && u.signature && (r.policy = u.policy, r.signature = u.signature);var n = fileApiUrl + "/" + e + "/metadata";return new Promise(function (u, e) {
    client$1.get(n).query(r).end(function (t, r) {
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
}; var logger = context("filestack", onOff);!function () {
  var u = void 0;"object" === ("undefined" == typeof window ? "undefined" : _typeof$1(window)) && (u = window.filestackInternals, u || (u = {}, window.filestackInternals = u), u.logger || (u.logger = logger, onOff.init())), u;
}();var log = logger.context("api-client"); var cloudApiUrl = ENV.cloudApiUrl; var _cloud = function _cloud(u, e, t) {
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
          n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};log("cloud.store() called:", u, e), checkOptions("cloud.store", [{ name: "location", type: index$2.enums.of("s3 gcs rackspace azure dropbox") }, { name: "region", type: index$2.String }, { name: "path", type: index$2.String }, { name: "container", type: index$2.String }, { name: "access", type: index$2.enums.of("public private") }], e);var i = snakeKeys(e, "store");return new Promise(function (e, o) {
        var a = client$1.get(cloudApiUrl + "/" + t + "/store" + u).query(r).query(removeEmpty(i)).withCredentials().end(function (u, t) {
          u ? o(u) : (log("cloud.store() responded:", t.body), e(t.body));
        });n.cancel = function () {
          a.abort(), o(new Error("Cancelled"));
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
      e = arguments[1];checkOptions("crop", [{ name: "dim", type: index$2.struct({ x: index$2.Integer, y: index$2.Integer, width: index$2.Integer, height: index$2.Integer }) }], e);var t = e.dim,
      r = "crop=dim:[" + t.x + "," + t.y + "," + t.width + "," + t.height + "]";return u.concat(r);
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
  }return processURL + "/" + u.apikey + "/" + i().join("/") + "/" + e;
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
    }();
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
  checkOptions("upload (storeParams)", [{ name: "location", type: index$2.enums.of("s3 gcs rackspace azure dropbox") }, { name: "region", type: index$2.String }, { name: "path", type: index$2.String }, { name: "container", type: index$2.String }, { name: "access", type: index$2.enums.of("public private") }], e);var t = snakeKeys(e, "store");return u.policy && u.signature ? Object.assign({}, t, { signature: u.signature, policy: u.policy }) : t;
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
  var e = this;null !== e.config.onStart && e.config.onStart();var t = { filename: e.file.newName || e.file.name, mimetype: e.file.type || "application/octet-stream", size: e.file.size },
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
    var n = e.parts.uploaded[t].split(":", 1);if (parseInt(n[0], 10) === e.parts.current + 1) {
      r = !0;break;
    }
  }if (e.parts.current += 1, r) e.currentUploads -= 1;else {
    var i = e.config.cryptoMd5Method(u.target.result);e.getUploadData(u.target.result, e.parts.current, u.total, i);
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
  this.uploadPart(u, e, t);
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
  var u = this;if (u.parts.uploaded.length + u.parts.failures.length < u.parts.total) return void setTimeout(function () {
    u.waitForAllPartsAttempted();
  }, 100);u.allPartsLoaded() ? u.complete() : u.processRetries();
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
  var u = this;null !== u.config.onUploadCompleteFunction && u.config.onUploadCompleteFunction();var e = { size: u.file.size, filename: u.file.newName || u.file.name, mimetype: u.file.type || "application/octet-stream", parts: u.parts.uploaded.join(";") },
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
    new Uploader(u, Object.assign({}, t, { onCompleteFunction: function onCompleteFunction(u) {
        return n(u);
      }, onUploadFailedFunction: function onUploadFailedFunction(u) {
        return i(u);
      } }), r).multipartUpload(e);
  });
}; var init$1 = function init(u, e) {
  if (!u || "string" != typeof u) throw new Error("apikey is required to initialize the Filestack client");if (e && (!e.policy || !e.signature)) throw new Error("signature and policy are both required for security");var t = Object.assign({}, e, { apikey: u });return { getSecurity: function getSecurity() {
      return { policy: t.policy, signature: t.signature };
    }, setSecurity: function setSecurity(u) {
      if (u && (!u.policy || !u.signature)) throw new Error("signature and policy are both required for security");return t.policy = u.policy, t.signature = u.signature, t;
    }, storeURL: function storeURL(u, e) {
      return _storeURL(t, u, e);
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
    }, upload: function upload(u, e, r) {
      return _upload(t, u, e, r);
    } };
}; var client = { version: "0.2.3", init: init$1 };

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

var initializeGlobalNamespace = function initializeGlobalNamespace() {
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

initializeGlobalNamespace();

var picker = createCommonjsModule(function (module, exports) {
  /* v0.3.1 */
  !function (t, e) {
    module.exports = e();
  }(commonjsGlobal, function () {
    function t(t, e) {
      return e = { exports: {} }, t(e, e.exports), e.exports;
    }function e(t) {
      return null == t ? "" : "object" === ("undefined" == typeof t ? "undefined" : Tr(t)) ? JSON.stringify(t, null, 2) : String(t);
    }function n(t) {
      var e = parseFloat(t);return isNaN(e) ? t : e;
    }function r(t, e) {
      for (var n = Object.create(null), r = t.split(","), i = 0; i < r.length; i++) {
        n[r[i]] = !0;
      }return e ? function (t) {
        return n[t.toLowerCase()];
      } : function (t) {
        return n[t];
      };
    }function i(t, e) {
      if (t.length) {
        var n = t.indexOf(e);if (n > -1) return t.splice(n, 1);
      }
    }function o(t, e) {
      return Or.call(t, e);
    }function s(t) {
      return "string" == typeof t || "number" == typeof t;
    }function a(t) {
      var e = Object.create(null);return function (n) {
        var r = e[n];return r || (e[n] = t(n));
      };
    }function c(t, e) {
      function n(n) {
        var r = arguments.length;return r ? r > 1 ? t.apply(e, arguments) : t.call(e, n) : t.call(e);
      }return n._length = t.length, n;
    }function u(t, e) {
      e = e || 0;for (var n = t.length - e, r = new Array(n); n--;) {
        r[n] = t[n + e];
      }return r;
    }function l(t, e) {
      for (var n in e) {
        t[n] = e[n];
      }return t;
    }function f(t) {
      return null !== t && "object" === ("undefined" == typeof t ? "undefined" : Tr(t));
    }function p(t) {
      return Nr.call(t) === Ur;
    }function d(t) {
      for (var e = {}, n = 0; n < t.length; n++) {
        t[n] && l(e, t[n]);
      }return e;
    }function h() {}function m(t) {
      return t.reduce(function (t, e) {
        return t.concat(e.staticKeys || []);
      }, []).join(",");
    }function v(t, e) {
      var n = f(t),
          r = f(e);return n && r ? JSON.stringify(t) === JSON.stringify(e) : !n && !r && String(t) === String(e);
    }function _(t, e) {
      for (var n = 0; n < t.length; n++) {
        if (v(t[n], e)) return n;
      }return -1;
    }function g(t) {
      var e = (t + "").charCodeAt(0);return 36 === e || 95 === e;
    }function y(t, e, n, r) {
      Object.defineProperty(t, e, { value: n, enumerable: !!r, writable: !0, configurable: !0 });
    }function b(t) {
      if (!Hr.test(t)) {
        var e = t.split(".");return function (t) {
          for (var n = 0; n < e.length; n++) {
            if (!t) return;t = t[e[n]];
          }return t;
        };
      }
    }function C(t) {
      return (/native code/.test(t.toString())
      );
    }function E(t) {
      ii.target && oi.push(ii.target), ii.target = t;
    }function w() {
      ii.target = oi.pop();
    }function k(t, e) {
      t.__proto__ = e;
    }function T(t, e, n) {
      for (var r = 0, i = n.length; r < i; r++) {
        var o = n[r];y(t, o, e[o]);
      }
    }function A(t, e) {
      if (f(t)) {
        var n;return o(t, "__ob__") && t.__ob__ instanceof li ? n = t.__ob__ : ui.shouldConvert && !Kr() && (Array.isArray(t) || p(t)) && Object.isExtensible(t) && !t._isVue && (n = new li(t)), e && n && n.vmCount++, n;
      }
    }function S(t, e, n, r) {
      var i = new ii(),
          o = Object.getOwnPropertyDescriptor(t, e);if (!o || o.configurable !== !1) {
        var s = o && o.get,
            a = o && o.set,
            c = A(n);Object.defineProperty(t, e, { enumerable: !0, configurable: !0, get: function get$$1() {
            var e = s ? s.call(t) : n;return ii.target && (i.depend(), c && c.dep.depend(), Array.isArray(e) && O(e)), e;
          }, set: function set$$1(e) {
            var r = s ? s.call(t) : n;e === r || e !== e && r !== r || (a ? a.call(t, e) : n = e, c = A(e), i.notify());
          } });
      }
    }function R(t, e, n) {
      if (Array.isArray(t)) return t.length = Math.max(t.length, e), t.splice(e, 1, n), n;if (o(t, e)) return void (t[e] = n);var r = t.__ob__;if (!(t._isVue || r && r.vmCount)) return r ? (S(r.value, e, n), r.dep.notify(), n) : void (t[e] = n);
    }function F(t, e) {
      var n = t.__ob__;t._isVue || n && n.vmCount || o(t, e) && (delete t[e], n && n.dep.notify());
    }function O(t) {
      for (var e = void 0, n = 0, r = t.length; n < r; n++) {
        e = t[n], e && e.__ob__ && e.__ob__.dep.depend(), Array.isArray(e) && O(e);
      }
    }function L(t, e) {
      if (!e) return t;for (var n, r, i, s = Object.keys(e), a = 0; a < s.length; a++) {
        n = s[a], r = t[n], i = e[n], o(t, n) ? p(r) && p(i) && L(r, i) : R(t, n, i);
      }return t;
    }function x(t, e) {
      return e ? t ? t.concat(e) : Array.isArray(e) ? e : [e] : t;
    }function I(t, e) {
      var n = Object.create(t || null);return e ? l(n, e) : n;
    }function P(t) {
      var e = t.props;if (e) {
        var n,
            r,
            i,
            o = {};if (Array.isArray(e)) for (n = e.length; n--;) {
          r = e[n], "string" == typeof r && (i = xr(r), o[i] = { type: null });
        } else if (p(e)) for (var s in e) {
          r = e[s], i = xr(s), o[i] = p(r) ? r : { type: r };
        }t.props = o;
      }
    }function j(t) {
      var e = t.directives;if (e) for (var n in e) {
        var r = e[n];"function" == typeof r && (e[n] = { bind: r, update: r });
      }
    }function N(t, e, n) {
      function r(r) {
        var i = fi[r] || pi;l[r] = i(t[r], e[r], n, r);
      }P(e), j(e);var i = e.extends;if (i && (t = "function" == typeof i ? N(t, i.options, n) : N(t, i, n)), e.mixins) for (var s = 0, a = e.mixins.length; s < a; s++) {
        var c = e.mixins[s];c.prototype instanceof Wt && (c = c.options), t = N(t, c, n);
      }var u,
          l = {};for (u in t) {
        r(u);
      }for (u in e) {
        o(t, u) || r(u);
      }return l;
    }function U(t, e, n, r) {
      if ("string" == typeof n) {
        var i = t[e];if (o(i, n)) return i[n];var s = xr(n);if (o(i, s)) return i[s];var a = Ir(s);if (o(i, a)) return i[a];var c = i[n] || i[s] || i[a];return c;
      }
    }function D(t, e, n, r) {
      var i = e[t],
          s = !o(n, t),
          a = n[t];if (H(Boolean, i.type) && (s && !o(i, "default") ? a = !1 : H(String, i.type) || "" !== a && a !== jr(t) || (a = !0)), void 0 === a) {
        a = $(r, i, t);var c = ui.shouldConvert;ui.shouldConvert = !0, A(a), ui.shouldConvert = c;
      }return a;
    }function $(t, e, n) {
      if (o(e, "default")) {
        var r = e.default;return f(r), t && t.$options.propsData && void 0 === t.$options.propsData[n] && void 0 !== t[n] ? t[n] : "function" == typeof r && e.type !== Function ? r.call(t) : r;
      }
    }function M(t) {
      var e = t && t.toString().match(/^\s*function (\w+)/);return e && e[1];
    }function H(t, e) {
      if (!Array.isArray(e)) return M(e) === M(t);for (var n = 0, r = e.length; n < r; n++) {
        if (M(e[n]) === M(t)) return !0;
      }return !1;
    }function W(t) {
      return new hi(void 0, void 0, void 0, String(t));
    }function z(t) {
      var e = new hi(t.tag, t.data, t.children, t.text, t.elm, t.context, t.componentOptions);return e.ns = t.ns, e.isStatic = t.isStatic, e.key = t.key, e.isCloned = !0, e;
    }function V(t) {
      for (var e = new Array(t.length), n = 0; n < t.length; n++) {
        e[n] = z(t[n]);
      }return e;
    }function B(t, e, n, r, i) {
      if (t) {
        var o = n.$options._base;if (f(t) && (t = o.extend(t)), "function" == typeof t) {
          if (!t.cid) if (t.resolved) t = t.resolved;else if (t = J(t, o, function () {
            n.$forceUpdate();
          }), !t) return;Ht(t), e = e || {};var s = Z(e, t);if (t.options.functional) return G(t, s, e, n, r);var a = e.on;e.on = e.nativeOn, t.options.abstract && (e = {}), et(e);var c = t.options.name || i,
              u = new hi("vue-component-" + t.cid + (c ? "-" + c : ""), e, void 0, void 0, void 0, n, { Ctor: t, propsData: s, listeners: a, tag: i, children: r });return u;
        }
      }
    }function G(t, e, n, r, i) {
      var o = {},
          s = t.options.props;if (s) for (var a in s) {
        o[a] = D(a, s, e);
      }var c = Object.create(r),
          u = function u(t, e, n, r) {
        return lt(c, t, e, n, r, !0);
      },
          l = t.options.render.call(null, u, { props: o, data: n, parent: r, children: i, slots: function slots() {
          return mt(i, r);
        } });return l instanceof hi && (l.functionalContext = r, n.slot && ((l.data || (l.data = {})).slot = n.slot)), l;
    }function Y(t, e, n, r) {
      var i = t.componentOptions,
          o = { _isComponent: !0, parent: e, propsData: i.propsData, _componentTag: i.tag, _parentVnode: t, _parentListeners: i.listeners, _renderChildren: i.children, _parentElm: n || null, _refElm: r || null },
          s = t.data.inlineTemplate;return s && (o.render = s.render, o.staticRenderFns = s.staticRenderFns), new i.Ctor(o);
    }function X(t, e, n, r) {
      if (!t.componentInstance || t.componentInstance._isDestroyed) {
        var i = t.componentInstance = Y(t, wi, n, r);i.$mount(e ? t.elm : void 0, e);
      } else if (t.data.keepAlive) {
        var o = t;q(o, o);
      }
    }function q(t, e) {
      var n = e.componentOptions,
          r = e.componentInstance = t.componentInstance;r._updateFromParent(n.propsData, n.listeners, e, n.children);
    }function Q(t) {
      t.componentInstance._isMounted || (t.componentInstance._isMounted = !0, wt(t.componentInstance, "mounted")), t.data.keepAlive && (t.componentInstance._inactive = !1, wt(t.componentInstance, "activated"));
    }function K(t) {
      t.componentInstance._isDestroyed || (t.data.keepAlive ? (t.componentInstance._inactive = !0, wt(t.componentInstance, "deactivated")) : t.componentInstance.$destroy());
    }function J(t, e, n) {
      if (!t.requested) {
        t.requested = !0;var r = t.pendingCallbacks = [n],
            i = !0,
            o = function o(n) {
          if (f(n) && (n = e.extend(n)), t.resolved = n, !i) for (var o = 0, s = r.length; o < s; o++) {
            r[o](n);
          }
        },
            s = function s(t) {},
            a = t(o, s);return a && "function" == typeof a.then && !t.resolved && a.then(o, s), i = !1, t.resolved;
      }t.pendingCallbacks.push(n);
    }function Z(t, e) {
      var n = e.options.props;if (n) {
        var r = {},
            i = t.attrs,
            o = t.props,
            s = t.domProps;if (i || o || s) for (var a in n) {
          var c = jr(a);tt(r, o, a, c, !0) || tt(r, i, a, c) || tt(r, s, a, c);
        }return r;
      }
    }function tt(t, e, n, r, i) {
      if (e) {
        if (o(e, n)) return t[n] = e[n], i || delete e[n], !0;if (o(e, r)) return t[n] = e[r], i || delete e[r], !0;
      }return !1;
    }function et(t) {
      t.hook || (t.hook = {});for (var e = 0; e < gi.length; e++) {
        var n = gi[e],
            r = t.hook[n],
            i = _i[n];t.hook[n] = r ? nt(i, r) : i;
      }
    }function nt(t, e) {
      return function (n, r, i, o) {
        t(n, r, i, o), e(n, r, i, o);
      };
    }function rt(t, e, n, r) {
      r += e;var i = t.__injected || (t.__injected = {});if (!i[r]) {
        i[r] = !0;var o = t[e];o ? t[e] = function () {
          o.apply(this, arguments), n.apply(this, arguments);
        } : t[e] = n;
      }
    }function it(t) {
      var e = { fn: t, invoker: function invoker() {
          var t = arguments,
              n = e.fn;if (Array.isArray(n)) for (var r = 0; r < n.length; r++) {
            n[r].apply(null, t);
          } else n.apply(null, arguments);
        } };return e;
    }function ot(t, e, n, r, i) {
      var o, s, a, c;for (o in t) {
        s = t[o], a = e[o], c = yi(o), s && (a ? s !== a && (a.fn = s, t[o] = a) : (s.invoker || (s = t[o] = it(s)), n(c.name, s.invoker, c.once, c.capture)));
      }for (o in e) {
        t[o] || (c = yi(o), r(c.name, e[o].invoker, c.capture));
      }
    }function st(t) {
      for (var e = 0; e < t.length; e++) {
        if (Array.isArray(t[e])) return Array.prototype.concat.apply([], t);
      }return t;
    }function at(t) {
      return s(t) ? [W(t)] : Array.isArray(t) ? ct(t) : void 0;
    }function ct(t, e) {
      var n,
          r,
          i,
          o = [];for (n = 0; n < t.length; n++) {
        r = t[n], null != r && "boolean" != typeof r && (i = o[o.length - 1], Array.isArray(r) ? o.push.apply(o, ct(r, (e || "") + "_" + n)) : s(r) ? i && i.text ? i.text += String(r) : "" !== r && o.push(W(r)) : r.text && i && i.text ? o[o.length - 1] = W(i.text + r.text) : (r.tag && null == r.key && null != e && (r.key = "__vlist" + e + "_" + n + "__"), o.push(r)));
      }return o;
    }function ut(t) {
      return t && t.filter(function (t) {
        return t && t.componentOptions;
      })[0];
    }function lt(t, e, n, r, i, o) {
      return (Array.isArray(n) || s(n)) && (i = r, r = n, n = void 0), o && (i = Ci), ft(t, e, n, r, i);
    }function ft(t, e, n, r, i) {
      if (n && n.__ob__) return vi();if (!e) return vi();Array.isArray(r) && "function" == typeof r[0] && (n = n || {}, n.scopedSlots = { default: r[0] }, r.length = 0), i === Ci ? r = at(r) : i === bi && (r = st(r));var o, s;if ("string" == typeof e) {
        var a;s = Mr.getTagNamespace(e), o = Mr.isReservedTag(e) ? new hi(Mr.parsePlatformTagName(e), n, r, void 0, void 0, t) : (a = U(t.$options, "components", e)) ? B(a, n, t, r, e) : new hi(e, n, r, void 0, void 0, t);
      } else o = B(e, n, t, r);return o ? (s && pt(o, s), o) : vi();
    }function pt(t, e) {
      if (t.ns = e, "foreignObject" !== t.tag && t.children) for (var n = 0, r = t.children.length; n < r; n++) {
        var i = t.children[n];i.tag && !i.ns && pt(i, e);
      }
    }function dt(t) {
      t.$vnode = null, t._vnode = null, t._staticTrees = null;var e = t.$options._parentVnode,
          n = e && e.context;t.$slots = mt(t.$options._renderChildren, n), t.$scopedSlots = {}, t._c = function (e, n, r, i) {
        return lt(t, e, n, r, i, !1);
      }, t.$createElement = function (e, n, r, i) {
        return lt(t, e, n, r, i, !0);
      };
    }function ht(t) {
      function r(t, e, n) {
        if (Array.isArray(t)) for (var r = 0; r < t.length; r++) {
          t[r] && "string" != typeof t[r] && i(t[r], e + "_" + r, n);
        } else i(t, e, n);
      }function i(t, e, n) {
        t.isStatic = !0, t.key = e, t.isOnce = n;
      }t.prototype.$nextTick = function (t) {
        return Zr(t, this);
      }, t.prototype._render = function () {
        var t = this,
            e = t.$options,
            n = e.render,
            r = e.staticRenderFns,
            i = e._parentVnode;if (t._isMounted) for (var o in t.$slots) {
          t.$slots[o] = V(t.$slots[o]);
        }i && i.data.scopedSlots && (t.$scopedSlots = i.data.scopedSlots), r && !t._staticTrees && (t._staticTrees = []), t.$vnode = i;var s;try {
          s = n.call(t._renderProxy, t.$createElement);
        } catch (e) {
          if (!Mr.errorHandler) throw e;Mr.errorHandler.call(null, e, t), s = t._vnode;
        }return s instanceof hi || (s = vi()), s.parent = i, s;
      }, t.prototype._s = e, t.prototype._v = W, t.prototype._n = n, t.prototype._e = vi, t.prototype._q = v, t.prototype._i = _, t.prototype._m = function (t, e) {
        var n = this._staticTrees[t];return n && !e ? Array.isArray(n) ? V(n) : z(n) : (n = this._staticTrees[t] = this.$options.staticRenderFns[t].call(this._renderProxy), r(n, "__static__" + t, !1), n);
      }, t.prototype._o = function (t, e, n) {
        return r(t, "__once__" + e + (n ? "_" + n : ""), !0), t;
      }, t.prototype._f = function (t) {
        return U(this.$options, "filters", t, !0) || $r;
      }, t.prototype._l = function (t, e) {
        var n, r, i, o, s;if (Array.isArray(t) || "string" == typeof t) for (n = new Array(t.length), r = 0, i = t.length; r < i; r++) {
          n[r] = e(t[r], r);
        } else if ("number" == typeof t) for (n = new Array(t), r = 0; r < t; r++) {
          n[r] = e(r + 1, r);
        } else if (f(t)) for (o = Object.keys(t), n = new Array(o.length), r = 0, i = o.length; r < i; r++) {
          s = o[r], n[r] = e(t[s], s, r);
        }return n;
      }, t.prototype._t = function (t, e, n, r) {
        var i = this.$scopedSlots[t];if (i) return n = n || {}, r && l(n, r), i(n) || e;var o = this.$slots[t];return o || e;
      }, t.prototype._b = function (t, e, n, r) {
        if (n) if (f(n)) {
          Array.isArray(n) && (n = d(n));for (var i in n) {
            if ("class" === i || "style" === i) t[i] = n[i];else {
              var o = t.attrs && t.attrs.type,
                  s = r || Mr.mustUseProp(e, o, i) ? t.domProps || (t.domProps = {}) : t.attrs || (t.attrs = {});s[i] = n[i];
            }
          }
        } else ;return t;
      }, t.prototype._k = function (t, e, n) {
        var r = Mr.keyCodes[e] || n;return Array.isArray(r) ? r.indexOf(t) === -1 : r !== t;
      };
    }function mt(t, e) {
      var n = {};if (!t) return n;for (var r, i, o = [], s = 0, a = t.length; s < a; s++) {
        if (i = t[s], (i.context === e || i.functionalContext === e) && i.data && (r = i.data.slot)) {
          var c = n[r] || (n[r] = []);"template" === i.tag ? c.push.apply(c, i.children) : c.push(i);
        } else o.push(i);
      }return o.length && (1 !== o.length || " " !== o[0].text && !o[0].isComment) && (n.default = o), n;
    }function vt(t) {
      t._events = Object.create(null), t._hasHookEvent = !1;var e = t.$options._parentListeners;e && yt(t, e);
    }function _t(t, e, n) {
      n ? Ei.$once(t, e) : Ei.$on(t, e);
    }function gt(t, e) {
      Ei.$off(t, e);
    }function yt(t, e, n) {
      Ei = t, ot(e, n || {}, _t, gt, t);
    }function bt(t) {
      var e = /^hook:/;t.prototype.$on = function (t, n) {
        var r = this;return (r._events[t] || (r._events[t] = [])).push(n), e.test(t) && (r._hasHookEvent = !0), r;
      }, t.prototype.$once = function (t, e) {
        function n() {
          r.$off(t, n), e.apply(r, arguments);
        }var r = this;return n.fn = e, r.$on(t, n), r;
      }, t.prototype.$off = function (t, e) {
        var n = this;if (!arguments.length) return n._events = Object.create(null), n;var r = n._events[t];if (!r) return n;if (1 === arguments.length) return n._events[t] = null, n;for (var i, o = r.length; o--;) {
          if (i = r[o], i === e || i.fn === e) {
            r.splice(o, 1);break;
          }
        }return n;
      }, t.prototype.$emit = function (t) {
        var e = this,
            n = e._events[t];if (n) {
          n = n.length > 1 ? u(n) : n;for (var r = u(arguments, 1), i = 0, o = n.length; i < o; i++) {
            n[i].apply(e, r);
          }
        }return e;
      };
    }function Ct(t) {
      var e = t.$options,
          n = e.parent;if (n && !e.abstract) {
        for (; n.$options.abstract && n.$parent;) {
          n = n.$parent;
        }n.$children.push(t);
      }t.$parent = n, t.$root = n ? n.$root : t, t.$children = [], t.$refs = {}, t._watcher = null, t._inactive = !1, t._isMounted = !1, t._isDestroyed = !1, t._isBeingDestroyed = !1;
    }function Et(t) {
      t.prototype._mount = function (t, e) {
        var n = this;return n.$el = t, n.$options.render || (n.$options.render = vi), wt(n, "beforeMount"), n._watcher = new Li(n, function () {
          n._update(n._render(), e);
        }, h), e = !1, null == n.$vnode && (n._isMounted = !0, wt(n, "mounted")), n;
      }, t.prototype._update = function (t, e) {
        var n = this;n._isMounted && wt(n, "beforeUpdate");var r = n.$el,
            i = n._vnode,
            o = wi;wi = n, n._vnode = t, i ? n.$el = n.__patch__(i, t) : n.$el = n.__patch__(n.$el, t, e, !1, n.$options._parentElm, n.$options._refElm), wi = o, r && (r.__vue__ = null), n.$el && (n.$el.__vue__ = n), n.$vnode && n.$parent && n.$vnode === n.$parent._vnode && (n.$parent.$el = n.$el);
      }, t.prototype._updateFromParent = function (t, e, n, r) {
        var i = this,
            o = !(!i.$options._renderChildren && !r);if (i.$options._parentVnode = n, i.$vnode = n, i._vnode && (i._vnode.parent = n), i.$options._renderChildren = r, t && i.$options.props) {
          ui.shouldConvert = !1;for (var s = i.$options._propKeys || [], a = 0; a < s.length; a++) {
            var c = s[a];i[c] = D(c, i.$options.props, t, i);
          }ui.shouldConvert = !0, i.$options.propsData = t;
        }if (e) {
          var u = i.$options._parentListeners;i.$options._parentListeners = e, yt(i, e, u);
        }o && (i.$slots = mt(r, n.context), i.$forceUpdate());
      }, t.prototype.$forceUpdate = function () {
        var t = this;t._watcher && t._watcher.update();
      }, t.prototype.$destroy = function () {
        var t = this;if (!t._isBeingDestroyed) {
          wt(t, "beforeDestroy"), t._isBeingDestroyed = !0;var e = t.$parent;!e || e._isBeingDestroyed || t.$options.abstract || i(e.$children, t), t._watcher && t._watcher.teardown();for (var n = t._watchers.length; n--;) {
            t._watchers[n].teardown();
          }t._data.__ob__ && t._data.__ob__.vmCount--, t._isDestroyed = !0, wt(t, "destroyed"), t.$off(), t.$el && (t.$el.__vue__ = null), t.__patch__(t._vnode, null);
        }
      };
    }function wt(t, e) {
      var n = t.$options[e];if (n) for (var r = 0, i = n.length; r < i; r++) {
        n[r].call(t);
      }t._hasHookEvent && t.$emit("hook:" + e);
    }function kt() {
      ki.length = 0, Ti = {}, Si = Ri = !1;
    }function Tt() {
      Ri = !0;var t, e, n;for (ki.sort(function (t, e) {
        return t.id - e.id;
      }), Fi = 0; Fi < ki.length; Fi++) {
        t = ki[Fi], e = t.id, Ti[e] = null, t.run();
      }for (Fi = ki.length; Fi--;) {
        t = ki[Fi], n = t.vm, n._watcher === t && n._isMounted && wt(n, "updated");
      }Jr && Mr.devtools && Jr.emit("flush"), kt();
    }function At(t) {
      var e = t.id;if (null == Ti[e]) {
        if (Ti[e] = !0, Ri) {
          for (var n = ki.length - 1; n >= 0 && ki[n].id > t.id;) {
            n--;
          }ki.splice(Math.max(n, Fi) + 1, 0, t);
        } else ki.push(t);Si || (Si = !0, Zr(Tt));
      }
    }function St(t) {
      xi.clear(), Rt(t, xi);
    }function Rt(t, e) {
      var n,
          r,
          i = Array.isArray(t);if ((i || f(t)) && Object.isExtensible(t)) {
        if (t.__ob__) {
          var o = t.__ob__.dep.id;if (e.has(o)) return;e.add(o);
        }if (i) for (n = t.length; n--;) {
          Rt(t[n], e);
        } else for (r = Object.keys(t), n = r.length; n--;) {
          Rt(t[r[n]], e);
        }
      }
    }function Ft(t) {
      t._watchers = [];var e = t.$options;e.props && Ot(t, e.props), e.methods && Pt(t, e.methods), e.data ? Lt(t) : A(t._data = {}, !0), e.computed && xt(t, e.computed), e.watch && jt(t, e.watch);
    }function Ot(t, e) {
      var n = t.$options.propsData || {},
          r = t.$options._propKeys = Object.keys(e),
          i = !t.$parent;ui.shouldConvert = i;for (var o = function o(i) {
        var o = r[i];S(t, o, D(o, e, n, t));
      }, s = 0; s < r.length; s++) {
        o(s);
      }ui.shouldConvert = !0;
    }function Lt(t) {
      var e = t.$options.data;e = t._data = "function" == typeof e ? e.call(t) : e || {}, p(e) || (e = {});for (var n = Object.keys(e), r = t.$options.props, i = n.length; i--;) {
        r && o(r, n[i]) || Dt(t, n[i]);
      }A(e, !0);
    }function xt(t, e) {
      for (var n in e) {
        var r = e[n];"function" == typeof r ? (Ii.get = It(r, t), Ii.set = h) : (Ii.get = r.get ? r.cache !== !1 ? It(r.get, t) : c(r.get, t) : h, Ii.set = r.set ? c(r.set, t) : h), Object.defineProperty(t, n, Ii);
      }
    }function It(t, e) {
      var n = new Li(e, t, h, { lazy: !0 });return function () {
        return n.dirty && n.evaluate(), ii.target && n.depend(), n.value;
      };
    }function Pt(t, e) {
      for (var n in e) {
        t[n] = null == e[n] ? h : c(e[n], t);
      }
    }function jt(t, e) {
      for (var n in e) {
        var r = e[n];if (Array.isArray(r)) for (var i = 0; i < r.length; i++) {
          Nt(t, n, r[i]);
        } else Nt(t, n, r);
      }
    }function Nt(t, e, n) {
      var r;p(n) && (r = n, n = n.handler), "string" == typeof n && (n = t[n]), t.$watch(e, n, r);
    }function Ut(t) {
      var e = {};e.get = function () {
        return this._data;
      }, Object.defineProperty(t.prototype, "$data", e), t.prototype.$set = R, t.prototype.$delete = F, t.prototype.$watch = function (t, e, n) {
        var r = this;n = n || {}, n.user = !0;var i = new Li(r, t, e, n);return n.immediate && e.call(r, i.value), function () {
          i.teardown();
        };
      };
    }function Dt(t, e) {
      g(e) || Object.defineProperty(t, e, { configurable: !0, enumerable: !0, get: function get$$1() {
          return t._data[e];
        }, set: function set$$1(n) {
          t._data[e] = n;
        } });
    }function $t(t) {
      t.prototype._init = function (t) {
        var e = this;e._uid = Pi++, e._isVue = !0, t && t._isComponent ? Mt(e, t) : e.$options = N(Ht(e.constructor), t || {}, e), e._renderProxy = e, e._self = e, Ct(e), vt(e), dt(e), wt(e, "beforeCreate"), Ft(e), wt(e, "created"), e.$options.el && e.$mount(e.$options.el);
      };
    }function Mt(t, e) {
      var n = t.$options = Object.create(t.constructor.options);n.parent = e.parent, n.propsData = e.propsData, n._parentVnode = e._parentVnode, n._parentListeners = e._parentListeners, n._renderChildren = e._renderChildren, n._componentTag = e._componentTag, n._parentElm = e._parentElm, n._refElm = e._refElm, e.render && (n.render = e.render, n.staticRenderFns = e.staticRenderFns);
    }function Ht(t) {
      var e = t.options;if (t.super) {
        var n = t.super.options,
            r = t.superOptions,
            i = t.extendOptions;n !== r && (t.superOptions = n, i.render = e.render, i.staticRenderFns = e.staticRenderFns, i._scopeId = e._scopeId, e = t.options = N(n, i), e.name && (e.components[e.name] = t));
      }return e;
    }function Wt(t) {
      this._init(t);
    }function zt(t) {
      t.use = function (t) {
        if (!t.installed) {
          var e = u(arguments, 1);return e.unshift(this), "function" == typeof t.install ? t.install.apply(t, e) : t.apply(null, e), t.installed = !0, this;
        }
      };
    }function Vt(t) {
      t.mixin = function (t) {
        this.options = N(this.options, t);
      };
    }function Bt(t) {
      t.cid = 0;var e = 1;t.extend = function (t) {
        t = t || {};var n = this,
            r = n.cid,
            i = t._Ctor || (t._Ctor = {});if (i[r]) return i[r];var o = t.name || n.options.name,
            s = function s(t) {
          this._init(t);
        };return s.prototype = Object.create(n.prototype), s.prototype.constructor = s, s.cid = e++, s.options = N(n.options, t), s.super = n, s.extend = n.extend, s.mixin = n.mixin, s.use = n.use, Mr._assetTypes.forEach(function (t) {
          s[t] = n[t];
        }), o && (s.options.components[o] = s), s.superOptions = n.options, s.extendOptions = t, i[r] = s, s;
      };
    }function Gt(t) {
      Mr._assetTypes.forEach(function (e) {
        t[e] = function (t, n) {
          return n ? ("component" === e && p(n) && (n.name = n.name || t, n = this.options._base.extend(n)), "directive" === e && "function" == typeof n && (n = { bind: n, update: n }), this.options[e + "s"][t] = n, n) : this.options[e + "s"][t];
        };
      });
    }function Yt(t) {
      return t && (t.Ctor.options.name || t.tag);
    }function Xt(t, e) {
      return "string" == typeof t ? t.split(",").indexOf(e) > -1 : t.test(e);
    }function qt(t, e) {
      for (var n in t) {
        var r = t[n];if (r) {
          var i = Yt(r.componentOptions);i && !e(i) && (Qt(r), t[n] = null);
        }
      }
    }function Qt(t) {
      t && (t.componentInstance._inactive || wt(t.componentInstance, "deactivated"), t.componentInstance.$destroy());
    }function Kt(t) {
      var e = {};e.get = function () {
        return Mr;
      }, Object.defineProperty(t, "config", e), t.util = di, t.set = R, t.delete = F, t.nextTick = Zr, t.options = Object.create(null), Mr._assetTypes.forEach(function (e) {
        t.options[e + "s"] = Object.create(null);
      }), t.options._base = t, l(t.options.components, Ui), zt(t), Vt(t), Bt(t), Gt(t);
    }function Jt(t) {
      for (var e = t.data, n = t, r = t; r.componentInstance;) {
        r = r.componentInstance._vnode, r.data && (e = Zt(r.data, e));
      }for (; n = n.parent;) {
        n.data && (e = Zt(e, n.data));
      }return te(e);
    }function Zt(t, e) {
      return { staticClass: ee(t.staticClass, e.staticClass), class: t.class ? [t.class, e.class] : e.class };
    }function te(t) {
      var e = t.class,
          n = t.staticClass;return n || e ? ee(n, ne(e)) : "";
    }function ee(t, e) {
      return t ? e ? t + " " + e : t : e || "";
    }function ne(t) {
      var e = "";if (!t) return e;if ("string" == typeof t) return t;if (Array.isArray(t)) {
        for (var n, r = 0, i = t.length; r < i; r++) {
          t[r] && (n = ne(t[r])) && (e += n + " ");
        }return e.slice(0, -1);
      }if (f(t)) {
        for (var o in t) {
          t[o] && (e += o + " ");
        }return e.slice(0, -1);
      }return e;
    }function re(t) {
      return Xi(t) ? "svg" : "math" === t ? "math" : void 0;
    }function ie(t) {
      if (!zr) return !0;if (qi(t)) return !1;if (t = t.toLowerCase(), null != Qi[t]) return Qi[t];var e = document.createElement(t);return t.indexOf("-") > -1 ? Qi[t] = e.constructor === window.HTMLUnknownElement || e.constructor === window.HTMLElement : Qi[t] = /HTMLUnknownElement/.test(e.toString());
    }function oe(t) {
      if ("string" == typeof t) {
        if (t = document.querySelector(t), !t) return document.createElement("div");
      }return t;
    }function se(t, e) {
      var n = document.createElement(t);return "select" !== t ? n : (e.data && e.data.attrs && "multiple" in e.data.attrs && n.setAttribute("multiple", "multiple"), n);
    }function ae(t, e) {
      return document.createElementNS(Gi[t], e);
    }function ce(t) {
      return document.createTextNode(t);
    }function ue(t) {
      return document.createComment(t);
    }function le(t, e, n) {
      t.insertBefore(e, n);
    }function fe(t, e) {
      t.removeChild(e);
    }function pe(t, e) {
      t.appendChild(e);
    }function de(t) {
      return t.parentNode;
    }function he(t) {
      return t.nextSibling;
    }function me(t) {
      return t.tagName;
    }function ve(t, e) {
      t.textContent = e;
    }function _e(t, e, n) {
      t.setAttribute(e, n);
    }function ge(t, e) {
      var n = t.data.ref;if (n) {
        var r = t.context,
            o = t.componentInstance || t.elm,
            s = r.$refs;e ? Array.isArray(s[n]) ? i(s[n], o) : s[n] === o && (s[n] = void 0) : t.data.refInFor ? Array.isArray(s[n]) && s[n].indexOf(o) < 0 ? s[n].push(o) : s[n] = [o] : s[n] = o;
      }
    }function ye(t) {
      return null == t;
    }function be(t) {
      return null != t;
    }function Ce(t, e) {
      return t.key === e.key && t.tag === e.tag && t.isComment === e.isComment && !t.data == !e.data;
    }function Ee(t, e, n) {
      var r,
          i,
          o = {};for (r = e; r <= n; ++r) {
        i = t[r].key, be(i) && (o[i] = r);
      }return o;
    }function we(t) {
      function e(t) {
        return new hi(S.tagName(t).toLowerCase(), {}, [], void 0, t);
      }function n(t, e) {
        function n() {
          0 === --n.listeners && i(t);
        }return n.listeners = e, n;
      }function i(t) {
        var e = S.parentNode(t);e && S.removeChild(e, t);
      }function o(t, e, n, r, i) {
        if (t.isRootInsert = !i, !a(t, e, n, r)) {
          var o = t.data,
              s = t.children,
              c = t.tag;be(c) ? (t.elm = t.ns ? S.createElementNS(t.ns, c) : S.createElement(c, t), h(t), f(t, s, e), be(o) && d(t, e), l(n, t.elm, r)) : t.isComment ? (t.elm = S.createComment(t.text), l(n, t.elm, r)) : (t.elm = S.createTextNode(t.text), l(n, t.elm, r));
        }
      }function a(t, e, n, r) {
        var i = t.data;if (be(i)) {
          var o = be(t.componentInstance) && i.keepAlive;if (be(i = i.hook) && be(i = i.init) && i(t, !1, n, r), be(t.componentInstance)) return c(t, e), o && u(t, e, n, r), !0;
        }
      }function c(t, e) {
        t.data.pendingInsert && e.push.apply(e, t.data.pendingInsert), t.elm = t.componentInstance.$el, p(t) ? (d(t, e), h(t)) : (ge(t), e.push(t));
      }function u(t, e, n, r) {
        for (var i, o = t; o.componentInstance;) {
          if (o = o.componentInstance._vnode, be(i = o.data) && be(i = i.transition)) {
            for (i = 0; i < T.activate.length; ++i) {
              T.activate[i](Zi, o);
            }e.push(o);break;
          }
        }l(n, t.elm, r);
      }function l(t, e, n) {
        t && (n ? S.insertBefore(t, e, n) : S.appendChild(t, e));
      }function f(t, e, n) {
        if (Array.isArray(e)) for (var r = 0; r < e.length; ++r) {
          o(e[r], n, t.elm, null, !0);
        } else s(t.text) && S.appendChild(t.elm, S.createTextNode(t.text));
      }function p(t) {
        for (; t.componentInstance;) {
          t = t.componentInstance._vnode;
        }return be(t.tag);
      }function d(t, e) {
        for (var n = 0; n < T.create.length; ++n) {
          T.create[n](Zi, t);
        }w = t.data.hook, be(w) && (w.create && w.create(Zi, t), w.insert && e.push(t));
      }function h(t) {
        var e;be(e = t.context) && be(e = e.$options._scopeId) && S.setAttribute(t.elm, e, ""), be(e = wi) && e !== t.context && be(e = e.$options._scopeId) && S.setAttribute(t.elm, e, "");
      }function m(t, e, n, r, i, s) {
        for (; r <= i; ++r) {
          o(n[r], s, t, e);
        }
      }function v(t) {
        var e,
            n,
            r = t.data;if (be(r)) for (be(e = r.hook) && be(e = e.destroy) && e(t), e = 0; e < T.destroy.length; ++e) {
          T.destroy[e](t);
        }if (be(e = t.children)) for (n = 0; n < t.children.length; ++n) {
          v(t.children[n]);
        }
      }function _(t, e, n, r) {
        for (; n <= r; ++n) {
          var o = e[n];be(o) && (be(o.tag) ? (g(o), v(o)) : i(o.elm));
        }
      }function g(t, e) {
        if (e || be(t.data)) {
          var r = T.remove.length + 1;for (e ? e.listeners += r : e = n(t.elm, r), be(w = t.componentInstance) && be(w = w._vnode) && be(w.data) && g(w, e), w = 0; w < T.remove.length; ++w) {
            T.remove[w](t, e);
          }be(w = t.data.hook) && be(w = w.remove) ? w(t, e) : e();
        } else i(t.elm);
      }function y(t, e, n, r, i) {
        for (var s, a, c, u, l = 0, f = 0, p = e.length - 1, d = e[0], h = e[p], v = n.length - 1, g = n[0], y = n[v], C = !i; l <= p && f <= v;) {
          ye(d) ? d = e[++l] : ye(h) ? h = e[--p] : Ce(d, g) ? (b(d, g, r), d = e[++l], g = n[++f]) : Ce(h, y) ? (b(h, y, r), h = e[--p], y = n[--v]) : Ce(d, y) ? (b(d, y, r), C && S.insertBefore(t, d.elm, S.nextSibling(h.elm)), d = e[++l], y = n[--v]) : Ce(h, g) ? (b(h, g, r), C && S.insertBefore(t, h.elm, d.elm), h = e[--p], g = n[++f]) : (ye(s) && (s = Ee(e, l, p)), a = be(g.key) ? s[g.key] : null, ye(a) ? (o(g, r, t, d.elm), g = n[++f]) : (c = e[a], Ce(c, g) ? (b(c, g, r), e[a] = void 0, C && S.insertBefore(t, g.elm, d.elm), g = n[++f]) : (o(g, r, t, d.elm), g = n[++f])));
        }l > p ? (u = ye(n[v + 1]) ? null : n[v + 1].elm, m(t, u, n, f, v, r)) : f > v && _(t, e, l, p);
      }function b(t, e, n, r) {
        if (t !== e) {
          if (e.isStatic && t.isStatic && e.key === t.key && (e.isCloned || e.isOnce)) return e.elm = t.elm, void (e.componentInstance = t.componentInstance);var i,
              o = e.data,
              s = be(o);s && be(i = o.hook) && be(i = i.prepatch) && i(t, e);var a = e.elm = t.elm,
              c = t.children,
              u = e.children;if (s && p(e)) {
            for (i = 0; i < T.update.length; ++i) {
              T.update[i](t, e);
            }be(i = o.hook) && be(i = i.update) && i(t, e);
          }ye(e.text) ? be(c) && be(u) ? c !== u && y(a, c, u, n, r) : be(u) ? (be(t.text) && S.setTextContent(a, ""), m(a, null, u, 0, u.length - 1, n)) : be(c) ? _(a, c, 0, c.length - 1) : be(t.text) && S.setTextContent(a, "") : t.text !== e.text && S.setTextContent(a, e.text), s && be(i = o.hook) && be(i = i.postpatch) && i(t, e);
        }
      }function C(t, e, n) {
        if (n && t.parent) t.parent.data.pendingInsert = e;else for (var r = 0; r < e.length; ++r) {
          e[r].data.hook.insert(e[r]);
        }
      }function E(t, e, n) {
        e.elm = t;var r = e.tag,
            i = e.data,
            o = e.children;if (be(i) && (be(w = i.hook) && be(w = w.init) && w(e, !0), be(w = e.componentInstance))) return c(e, n), !0;if (be(r)) {
          if (be(o)) if (t.hasChildNodes()) {
            for (var s = !0, a = t.firstChild, u = 0; u < o.length; u++) {
              if (!a || !E(a, o[u], n)) {
                s = !1;break;
              }a = a.nextSibling;
            }if (!s || a) return !1;
          } else f(e, o, n);if (be(i)) for (var l in i) {
            if (!R(l)) {
              d(e, n);break;
            }
          }
        } else t.data !== e.text && (t.data = e.text);return !0;
      }var w,
          k,
          T = {},
          A = t.modules,
          S = t.nodeOps;for (w = 0; w < to.length; ++w) {
        for (T[to[w]] = [], k = 0; k < A.length; ++k) {
          void 0 !== A[k][to[w]] && T[to[w]].push(A[k][to[w]]);
        }
      }var R = r("attrs,style,class,staticClass,staticStyle,key");return function (t, n, r, i, s, a) {
        if (!n) return void (t && v(t));var c = !1,
            u = [];if (t) {
          var l = be(t.nodeType);if (!l && Ce(t, n)) b(t, n, u, i);else {
            if (l) {
              if (1 === t.nodeType && t.hasAttribute("server-rendered") && (t.removeAttribute("server-rendered"), r = !0), r && E(t, n, u)) return C(n, u, !0), t;t = e(t);
            }var f = t.elm,
                d = S.parentNode(f);if (o(n, u, f._leaveCb ? null : d, S.nextSibling(f)), n.parent) {
              for (var h = n.parent; h;) {
                h.elm = n.elm, h = h.parent;
              }if (p(n)) for (var m = 0; m < T.create.length; ++m) {
                T.create[m](Zi, n.parent);
              }
            }null !== d ? _(d, [t], 0, 0) : be(t.tag) && v(t);
          }
        } else c = !0, o(n, u, s, a);return C(n, u, c), n.elm;
      };
    }function ke(t, e) {
      (t.data.directives || e.data.directives) && Te(t, e);
    }function Te(t, e) {
      var n,
          r,
          i,
          o = t === Zi,
          s = e === Zi,
          a = Ae(t.data.directives, t.context),
          c = Ae(e.data.directives, e.context),
          u = [],
          l = [];for (n in c) {
        r = a[n], i = c[n], r ? (i.oldValue = r.value, Re(i, "update", e, t), i.def && i.def.componentUpdated && l.push(i)) : (Re(i, "bind", e, t), i.def && i.def.inserted && u.push(i));
      }if (u.length) {
        var f = function f() {
          for (var n = 0; n < u.length; n++) {
            Re(u[n], "inserted", e, t);
          }
        };o ? rt(e.data.hook || (e.data.hook = {}), "insert", f, "dir-insert") : f();
      }if (l.length && rt(e.data.hook || (e.data.hook = {}), "postpatch", function () {
        for (var n = 0; n < l.length; n++) {
          Re(l[n], "componentUpdated", e, t);
        }
      }, "dir-postpatch"), !o) for (n in a) {
        c[n] || Re(a[n], "unbind", t, t, s);
      }
    }function Ae(t, e) {
      var n = Object.create(null);if (!t) return n;var r, i;for (r = 0; r < t.length; r++) {
        i = t[r], i.modifiers || (i.modifiers = no), n[Se(i)] = i, i.def = U(e.$options, "directives", i.name, !0);
      }return n;
    }function Se(t) {
      return t.rawName || t.name + "." + Object.keys(t.modifiers || {}).join(".");
    }function Re(t, e, n, r, i) {
      var o = t.def && t.def[e];o && o(n.elm, t, n, r, i);
    }function Fe(t, e) {
      if (t.data.attrs || e.data.attrs) {
        var n,
            r,
            i,
            o = e.elm,
            s = t.data.attrs || {},
            a = e.data.attrs || {};a.__ob__ && (a = e.data.attrs = l({}, a));for (n in a) {
          r = a[n], i = s[n], i !== r && Oe(o, n, r);
        }Gr && a.value !== s.value && Oe(o, "value", a.value);for (n in s) {
          null == a[n] && (zi(n) ? o.removeAttributeNS(Wi, Vi(n)) : Mi(n) || o.removeAttribute(n));
        }
      }
    }function Oe(t, e, n) {
      Hi(e) ? Bi(n) ? t.removeAttribute(e) : t.setAttribute(e, e) : Mi(e) ? t.setAttribute(e, Bi(n) || "false" === n ? "false" : "true") : zi(e) ? Bi(n) ? t.removeAttributeNS(Wi, Vi(e)) : t.setAttributeNS(Wi, e, n) : Bi(n) ? t.removeAttribute(e) : t.setAttribute(e, n);
    }function Le(t, e) {
      var n = e.elm,
          r = e.data,
          i = t.data;if (r.staticClass || r.class || i && (i.staticClass || i.class)) {
        var o = Jt(e),
            s = n._transitionClasses;s && (o = ee(o, ne(s))), o !== n._prevClass && (n.setAttribute("class", o), n._prevClass = o);
      }
    }function xe(t, _e2, n, r) {
      if (n) {
        var i = _e2,
            o = so;_e2 = function e(n) {
          Ie(t, _e2, r, o), 1 === arguments.length ? i(n) : i.apply(null, arguments);
        };
      }so.addEventListener(t, _e2, r);
    }function Ie(t, e, n, r) {
      (r || so).removeEventListener(t, e, n);
    }function Pe(t, e) {
      if (t.data.on || e.data.on) {
        var n = e.data.on || {},
            r = t.data.on || {};so = e.elm, ot(n, r, xe, Ie, e.context);
      }
    }function je(t, e) {
      if (t.data.domProps || e.data.domProps) {
        var n,
            r,
            i = e.elm,
            o = t.data.domProps || {},
            s = e.data.domProps || {};s.__ob__ && (s = e.data.domProps = l({}, s));for (n in o) {
          null == s[n] && (i[n] = "");
        }for (n in s) {
          if (r = s[n], "textContent" !== n && "innerHTML" !== n || (e.children && (e.children.length = 0), r !== o[n])) if ("value" === n) {
            i._value = r;var a = null == r ? "" : String(r);Ne(i, e, a) && (i.value = a);
          } else i[n] = r;
        }
      }
    }function Ne(t, e, n) {
      return !t.composing && ("option" === e.tag || Ue(t, n) || De(e, n));
    }function Ue(t, e) {
      return document.activeElement !== t && t.value !== e;
    }function De(t, e) {
      var r = t.elm.value,
          i = t.elm._vModifiers;return i && i.number || "number" === t.elm.type ? n(r) !== n(e) : i && i.trim ? r.trim() !== e.trim() : r !== e;
    }function $e(t) {
      var e = Me(t.style);return t.staticStyle ? l(t.staticStyle, e) : e;
    }function Me(t) {
      return Array.isArray(t) ? d(t) : "string" == typeof t ? uo(t) : t;
    }function He(t, e) {
      var n,
          r = {};if (e) for (var i = t; i.componentInstance;) {
        i = i.componentInstance._vnode, i.data && (n = $e(i.data)) && l(r, n);
      }(n = $e(t.data)) && l(r, n);for (var o = t; o = o.parent;) {
        o.data && (n = $e(o.data)) && l(r, n);
      }return r;
    }function We(t, e) {
      var n = e.data,
          r = t.data;if (n.staticStyle || n.style || r.staticStyle || r.style) {
        var i,
            o,
            s = e.elm,
            a = t.data.staticStyle,
            c = t.data.style || {},
            u = a || c,
            f = Me(e.data.style) || {};e.data.style = f.__ob__ ? l({}, f) : f;var p = He(e, !0);for (o in u) {
          null == p[o] && po(s, o, "");
        }for (o in p) {
          i = p[o], i !== u[o] && po(s, o, null == i ? "" : i);
        }
      }
    }function ze(t, e) {
      if (e && e.trim()) if (t.classList) e.indexOf(" ") > -1 ? e.split(/\s+/).forEach(function (e) {
        return t.classList.add(e);
      }) : t.classList.add(e);else {
        var n = " " + t.getAttribute("class") + " ";n.indexOf(" " + e + " ") < 0 && t.setAttribute("class", (n + e).trim());
      }
    }function Ve(t, e) {
      if (e && e.trim()) if (t.classList) e.indexOf(" ") > -1 ? e.split(/\s+/).forEach(function (e) {
        return t.classList.remove(e);
      }) : t.classList.remove(e);else {
        for (var n = " " + t.getAttribute("class") + " ", r = " " + e + " "; n.indexOf(r) >= 0;) {
          n = n.replace(r, " ");
        }t.setAttribute("class", n.trim());
      }
    }function Be(t) {
      To(function () {
        To(t);
      });
    }function Ge(t, e) {
      (t._transitionClasses || (t._transitionClasses = [])).push(e), ze(t, e);
    }function Ye(t, e) {
      t._transitionClasses && i(t._transitionClasses, e), Ve(t, e);
    }function Xe(t, e, n) {
      var r = qe(t, e),
          i = r.type,
          o = r.timeout,
          s = r.propCount;if (!i) return n();var a = i === yo ? Eo : ko,
          c = 0,
          u = function u() {
        t.removeEventListener(a, l), n();
      },
          l = function l(e) {
        e.target === t && ++c >= s && u();
      };setTimeout(function () {
        c < s && u();
      }, o + 1), t.addEventListener(a, l);
    }function qe(t, e) {
      var n,
          r = window.getComputedStyle(t),
          i = r[Co + "Delay"].split(", "),
          o = r[Co + "Duration"].split(", "),
          s = Qe(i, o),
          a = r[wo + "Delay"].split(", "),
          c = r[wo + "Duration"].split(", "),
          u = Qe(a, c),
          l = 0,
          f = 0;e === yo ? s > 0 && (n = yo, l = s, f = o.length) : e === bo ? u > 0 && (n = bo, l = u, f = c.length) : (l = Math.max(s, u), n = l > 0 ? s > u ? yo : bo : null, f = n ? n === yo ? o.length : c.length : 0);
      var p = n === yo && Ao.test(r[Co + "Property"]);return { type: n, timeout: l, propCount: f, hasTransform: p };
    }function Qe(t, e) {
      for (; t.length < e.length;) {
        t = t.concat(t);
      }return Math.max.apply(null, e.map(function (e, n) {
        return Ke(e) + Ke(t[n]);
      }));
    }function Ke(t) {
      return 1e3 * Number(t.slice(0, -1));
    }function Je(t, e) {
      var n = t.elm;n._leaveCb && (n._leaveCb.cancelled = !0, n._leaveCb());var r = tn(t.data.transition);if (r && !n._enterCb && 1 === n.nodeType) {
        for (var i = r.css, o = r.type, s = r.enterClass, a = r.enterToClass, c = r.enterActiveClass, u = r.appearClass, l = r.appearToClass, f = r.appearActiveClass, p = r.beforeEnter, d = r.enter, h = r.afterEnter, m = r.enterCancelled, v = r.beforeAppear, _ = r.appear, g = r.afterAppear, y = r.appearCancelled, b = wi, C = wi.$vnode; C && C.parent;) {
          C = C.parent, b = C.context;
        }var E = !b._isMounted || !t.isRootInsert;if (!E || _ || "" === _) {
          var w = E ? u : s,
              k = E ? f : c,
              T = E ? l : a,
              A = E ? v || p : p,
              S = E && "function" == typeof _ ? _ : d,
              R = E ? g || h : h,
              F = E ? y || m : m,
              O = i !== !1 && !Gr,
              L = S && (S._length || S.length) > 1,
              x = n._enterCb = en(function () {
            O && (Ye(n, T), Ye(n, k)), x.cancelled ? (O && Ye(n, w), F && F(n)) : R && R(n), n._enterCb = null;
          });t.data.show || rt(t.data.hook || (t.data.hook = {}), "insert", function () {
            var e = n.parentNode,
                r = e && e._pending && e._pending[t.key];r && r.tag === t.tag && r.elm._leaveCb && r.elm._leaveCb(), S && S(n, x);
          }, "transition-insert"), A && A(n), O && (Ge(n, w), Ge(n, k), Be(function () {
            Ge(n, T), Ye(n, w), x.cancelled || L || Xe(n, o, x);
          })), t.data.show && (e && e(), S && S(n, x)), O || L || x();
        }
      }
    }function Ze(t, e) {
      function n() {
        _.cancelled || (t.data.show || ((r.parentNode._pending || (r.parentNode._pending = {}))[t.key] = t), l && l(r), m && (Ge(r, a), Ge(r, u), Be(function () {
          Ge(r, c), Ye(r, a), _.cancelled || v || Xe(r, s, _);
        })), f && f(r, _), m || v || _());
      }var r = t.elm;r._enterCb && (r._enterCb.cancelled = !0, r._enterCb());var i = tn(t.data.transition);if (!i) return e();if (!r._leaveCb && 1 === r.nodeType) {
        var o = i.css,
            s = i.type,
            a = i.leaveClass,
            c = i.leaveToClass,
            u = i.leaveActiveClass,
            l = i.beforeLeave,
            f = i.leave,
            p = i.afterLeave,
            d = i.leaveCancelled,
            h = i.delayLeave,
            m = o !== !1 && !Gr,
            v = f && (f._length || f.length) > 1,
            _ = r._leaveCb = en(function () {
          r.parentNode && r.parentNode._pending && (r.parentNode._pending[t.key] = null), m && (Ye(r, c), Ye(r, u)), _.cancelled ? (m && Ye(r, a), d && d(r)) : (e(), p && p(r)), r._leaveCb = null;
        });h ? h(n) : n();
      }
    }function tn(t) {
      if (t) {
        if ("object" === ("undefined" == typeof t ? "undefined" : Tr(t))) {
          var e = {};return t.css !== !1 && l(e, So(t.name || "v")), l(e, t), e;
        }return "string" == typeof t ? So(t) : void 0;
      }
    }function en(t) {
      var e = !1;return function () {
        e || (e = !0, t());
      };
    }function nn(t, e) {
      e.data.show || Je(e);
    }function rn(t, e, n) {
      var r = e.value,
          i = t.multiple;if (!i || Array.isArray(r)) {
        for (var o, s, a = 0, c = t.options.length; a < c; a++) {
          if (s = t.options[a], i) o = _(r, sn(s)) > -1, s.selected !== o && (s.selected = o);else if (v(sn(s), r)) return void (t.selectedIndex !== a && (t.selectedIndex = a));
        }i || (t.selectedIndex = -1);
      }
    }function on(t, e) {
      for (var n = 0, r = e.length; n < r; n++) {
        if (v(sn(e[n]), t)) return !1;
      }return !0;
    }function sn(t) {
      return "_value" in t ? t._value : t.value;
    }function an(t) {
      t.target.composing = !0;
    }function cn(t) {
      t.target.composing = !1, un(t.target, "input");
    }function un(t, e) {
      var n = document.createEvent("HTMLEvents");n.initEvent(e, !0, !0), t.dispatchEvent(n);
    }function ln(t) {
      return !t.componentInstance || t.data && t.data.transition ? t : ln(t.componentInstance._vnode);
    }function fn(t) {
      var e = t && t.componentOptions;return e && e.Ctor.options.abstract ? fn(ut(e.children)) : t;
    }function pn(t) {
      var e = {},
          n = t.$options;for (var r in n.propsData) {
        e[r] = t[r];
      }var i = n._parentListeners;for (var o in i) {
        e[xr(o)] = i[o].fn;
      }return e;
    }function dn(t, e) {
      return (/\d-keep-alive$/.test(e.tag) ? t("keep-alive") : null
      );
    }function hn(t) {
      for (; t = t.parent;) {
        if (t.data.transition) return !0;
      }
    }function mn(t, e) {
      return e.key === t.key && e.tag === t.tag;
    }function vn(t) {
      t.elm._moveCb && t.elm._moveCb(), t.elm._enterCb && t.elm._enterCb();
    }function _n(t) {
      t.data.newPos = t.elm.getBoundingClientRect();
    }function gn(t) {
      var e = t.data.pos,
          n = t.data.newPos,
          r = e.left - n.left,
          i = e.top - n.top;if (r || i) {
        t.data.moved = !0;var o = t.elm.style;o.transform = o.WebkitTransform = "translate(" + r + "px," + i + "px)", o.transitionDuration = "0s";
      }
    }function yn(t) {
      ts && (t._devtoolHook = ts, ts.emit("vuex:init", t), ts.on("vuex:travel-to-state", function (e) {
        t.replaceState(e);
      }), t.subscribe(function (t, e) {
        ts.emit("vuex:mutation", t, e);
      }));
    }function bn(t, e) {
      Object.keys(t).forEach(function (n) {
        return e(t[n], n);
      });
    }function Cn(t) {
      return null !== t && "object" === ("undefined" == typeof t ? "undefined" : Tr(t));
    }function En(t) {
      return t && "function" == typeof t.then;
    }function wn(t, e) {
      if (!t) throw new Error("[vuex] " + e);
    }function kn(t, e) {
      if (t.update(e), e.modules) for (var n in e.modules) {
        if (!t.getChild(n)) return void console.warn("[vuex] trying to add a new module '" + n + "' on hot reloading, manual reload is needed");kn(t.getChild(n), e.modules[n]);
      }
    }function Tn(t, e) {
      t._actions = Object.create(null), t._mutations = Object.create(null), t._wrappedGetters = Object.create(null), t._modulesNamespaceMap = Object.create(null);var n = t.state;Sn(t, n, [], t._modules.root, !0), An(t, n, e);
    }function An(t, e, n) {
      var r = t._vm;t.getters = {};var i = t._wrappedGetters,
          o = {};bn(i, function (e, n) {
        o[n] = function () {
          return e(t);
        }, Object.defineProperty(t.getters, n, { get: function get$$1() {
            return t._vm[n];
          }, enumerable: !0 });
      });var s = is.config.silent;is.config.silent = !0, t._vm = new is({ data: { $$state: e }, computed: o }), is.config.silent = s, t.strict && In(t), r && (n && t._withCommit(function () {
        r._data.$$state = null;
      }), is.nextTick(function () {
        return r.$destroy();
      }));
    }function Sn(t, e, n, r, i) {
      var o = !n.length,
          s = t._modules.getNamespace(n);if (s && (t._modulesNamespaceMap[s] = r), !o && !i) {
        var a = Pn(e, n.slice(0, -1)),
            c = n[n.length - 1];t._withCommit(function () {
          is.set(a, c, r.state);
        });
      }var u = r.context = Rn(t, s, n);r.forEachMutation(function (e, n) {
        var r = s + n;On(t, r, e, u);
      }), r.forEachAction(function (e, n) {
        var r = s + n;Ln(t, r, e, u);
      }), r.forEachGetter(function (e, n) {
        var r = s + n;xn(t, r, e, u);
      }), r.forEachChild(function (r, o) {
        Sn(t, e, n.concat(o), r, i);
      });
    }function Rn(t, e, n) {
      var r = "" === e,
          i = { dispatch: r ? t.dispatch : function (n, r, i) {
          var o = jn(n, r, i),
              s = o.payload,
              a = o.options,
              c = o.type;return a && a.root || (c = e + c, t._actions[c]) ? t.dispatch(c, s) : void console.error("[vuex] unknown local action type: " + o.type + ", global type: " + c);
        }, commit: r ? t.commit : function (n, r, i) {
          var o = jn(n, r, i),
              s = o.payload,
              a = o.options,
              c = o.type;return a && a.root || (c = e + c, t._mutations[c]) ? void t.commit(c, s, a) : void console.error("[vuex] unknown local mutation type: " + o.type + ", global type: " + c);
        } };return Object.defineProperties(i, { getters: { get: r ? function () {
            return t.getters;
          } : function () {
            return Fn(t, e);
          } }, state: { get: function get$$1() {
            return Pn(t.state, n);
          } } }), i;
    }function Fn(t, e) {
      var n = {},
          r = e.length;return Object.keys(t.getters).forEach(function (i) {
        if (i.slice(0, r) === e) {
          var o = i.slice(r);Object.defineProperty(n, o, { get: function get$$1() {
              return t.getters[i];
            }, enumerable: !0 });
        }
      }), n;
    }function On(t, e, n, r) {
      var i = t._mutations[e] || (t._mutations[e] = []);i.push(function (t) {
        n(r.state, t);
      });
    }function Ln(t, e, n, r) {
      var i = t._actions[e] || (t._actions[e] = []);i.push(function (e, i) {
        var o = n({ dispatch: r.dispatch, commit: r.commit, getters: r.getters, state: r.state, rootGetters: t.getters, rootState: t.state }, e, i);return En(o) || (o = Promise.resolve(o)), t._devtoolHook ? o.catch(function (e) {
          throw t._devtoolHook.emit("vuex:error", e), e;
        }) : o;
      });
    }function xn(t, e, n, r) {
      return t._wrappedGetters[e] ? void console.error("[vuex] duplicate getter key: " + e) : void (t._wrappedGetters[e] = function (t) {
        return n(r.state, r.getters, t.state, t.getters);
      });
    }function In(t) {
      t._vm.$watch(function () {
        return this._data.$$state;
      }, function () {
        wn(t._committing, "Do not mutate vuex store state outside mutation handlers.");
      }, { deep: !0, sync: !0 });
    }function Pn(t, e) {
      return e.length ? e.reduce(function (t, e) {
        return t[e];
      }, t) : t;
    }function jn(t, e, n) {
      return Cn(t) && t.type && (n = e, e = t, t = t.type), wn("string" == typeof t, "Expects string as the type, but found " + ("undefined" == typeof t ? "undefined" : Tr(t)) + "."), { type: t, payload: e, options: n };
    }function Nn(t) {
      return is ? void console.error("[vuex] already installed. Vue.use(Vuex) should be called only once.") : (is = t, void Zo(is));
    }function Un(t) {
      return Array.isArray(t) ? t.map(function (t) {
        return { key: t, val: t };
      }) : Object.keys(t).map(function (e) {
        return { key: e, val: t[e] };
      });
    }function Dn(t) {
      return function (e, n) {
        return "string" != typeof e ? (n = e, e = "") : "/" !== e.charAt(e.length - 1) && (e += "/"), t(e, n);
      };
    }function $n(t, e, n) {
      var r = t._modulesNamespaceMap[n];return r || console.error("[vuex] module namespace not found in " + e + "(): " + n), r;
    }function Mn(t, e, n) {
      function r(e) {
        var n = p,
            r = d;return p = d = void 0, g = e, m = t.apply(r, n);
      }function i(t) {
        return g = t, v = setTimeout(a, e), y ? r(t) : m;
      }function o(t) {
        var n = t - _,
            r = t - g,
            i = e - n;return b ? va(i, h - r) : i;
      }function s(t) {
        var n = t - _,
            r = t - g;return void 0 === _ || n >= e || n < 0 || b && r >= h;
      }function a() {
        var t = _a();return s(t) ? c(t) : void (v = setTimeout(a, o(t)));
      }function c(t) {
        return v = void 0, C && p ? r(t) : (p = d = void 0, m);
      }function u() {
        void 0 !== v && clearTimeout(v), g = 0, p = _ = d = v = void 0;
      }function l() {
        return void 0 === v ? m : c(_a());
      }function f() {
        var t = _a(),
            n = s(t);if (p = arguments, d = this, _ = t, n) {
          if (void 0 === v) return i(_);if (b) return v = setTimeout(a, e), r(_);
        }return void 0 === v && (v = setTimeout(a, e)), m;
      }var p,
          d,
          h,
          m,
          v,
          _,
          g = 0,
          y = !1,
          b = !1,
          C = !0;if ("function" != typeof t) throw new TypeError(na);return e = Bn(e) || 0, Wn(n) && (y = !!n.leading, b = "maxWait" in n, h = b ? ma(Bn(n.maxWait) || 0, e) : h, C = "trailing" in n ? !!n.trailing : C), f.cancel = u, f.flush = l, f;
    }function Hn(t, e, n) {
      var r = !0,
          i = !0;if ("function" != typeof t) throw new TypeError(na);return Wn(n) && (r = "leading" in n ? !!n.leading : r, i = "trailing" in n ? !!n.trailing : i), Mn(t, e, { leading: r, maxWait: e, trailing: i });
    }function Wn(t) {
      var e = "undefined" == typeof t ? "undefined" : Tr(t);return !!t && ("object" == e || "function" == e);
    }function zn(t) {
      return !!t && "object" == ("undefined" == typeof t ? "undefined" : Tr(t));
    }function Vn(t) {
      return "symbol" == ("undefined" == typeof t ? "undefined" : Tr(t)) || zn(t) && ha.call(t) == ia;
    }function Bn(t) {
      if ("number" == typeof t) return t;if (Vn(t)) return ra;if (Wn(t)) {
        var e = "function" == typeof t.valueOf ? t.valueOf() : t;t = Wn(e) ? e + "" : e;
      }if ("string" != typeof t) return 0 === t ? t : +t;t = t.replace(oa, "");var n = aa.test(t);return n || ca.test(t) ? ua(t.slice(2), n ? 2 : 8) : sa.test(t) ? ra : +t;
    }function Gn() {
      try {
        var t = Za;return Za = null, t.apply(this, arguments);
      } catch (t) {
        return Ja.e = t, Ja;
      }
    }function Yn(t) {
      return Za = t, Gn;
    }function Xn(t) {
      return null == t || t === !0 || t === !1 || "string" == typeof t || "number" == typeof t;
    }function qn(t) {
      return !Xn(t);
    }function Qn(t) {
      return Xn(t) ? new Error(or(t)) : t;
    }function Kn(t, e) {
      var n,
          r = t.length,
          i = new Array(r + 1);for (n = 0; n < r; ++n) {
        i[n] = t[n];
      }return i[n] = e, i;
    }function Jn(t, e, n) {
      if (!qa.isES5) return {}.hasOwnProperty.call(t, e) ? t[e] : void 0;var r = Object.getOwnPropertyDescriptor(t, e);return null != r ? null == r.get && null == r.set ? r.value : n : void 0;
    }function Zn(t, e, n) {
      if (Xn(t)) return t;var r = { value: n, configurable: !0, enumerable: !1, writable: !0 };return qa.defineProperty(t, e, r), t;
    }function tr(t) {
      throw t;
    }function er(t) {
      try {
        if ("function" == typeof t) {
          var e = qa.names(t.prototype),
              n = qa.isES5 && e.length > 1,
              r = e.length > 0 && !(1 === e.length && "constructor" === e[0]),
              i = nc.test(t + "") && qa.names(t).length > 0;if (n || r || i) return !0;
        }return !1;
      } catch (t) {
        return !1;
      }
    }function nr(t) {
      function e() {}e.prototype = t;for (var n = 8; n--;) {
        new e();
      }return t;
    }function rr(t) {
      return rc.test(t);
    }function ir(t, e, n) {
      for (var r = new Array(t), i = 0; i < t; ++i) {
        r[i] = e + i + n;
      }return r;
    }function or(t) {
      try {
        return t + "";
      } catch (t) {
        return "[no string representation]";
      }
    }function sr(t) {
      try {
        Zn(t, "isOperational", !0);
      } catch (t) {}
    }function ar(t) {
      return null != t && (t instanceof Error.__BluebirdErrorTypes__.OperationalError || t.isOperational === !0);
    }function cr(t) {
      return t instanceof Error && qa.propertyIsWritable(t, "stack");
    }function ur(t) {
      return {}.toString.call(t);
    }function lr(t, e, n) {
      for (var r = qa.names(t), i = 0; i < r.length; ++i) {
        var o = r[i];if (n(o)) try {
          qa.defineProperty(e, o, qa.getDescriptor(t, o));
        } catch (t) {}
      }
    }function fr(t, e, n, r, i) {
      for (var o = 0; o < i; ++o) {
        n[o + r] = t[o + e], t[o + e] = void 0;
      }
    }function pr(t) {
      this._capacity = t, this._length = 0, this._front = 0;
    }function dr() {
      this._isTickUsed = !1, this._lateQueue = new vc(16), this._normalQueue = new vc(16), this._trampolineEnabled = !0;var t = this;this.drainQueues = function () {
        t._drainQueues();
      }, this._schedule = mc.isStatic ? mc(this.drainQueues) : mc;
    }function hr(t, e, n) {
      this._lateQueue.push(t, e, n), this._queueTick();
    }function mr(t, e, n) {
      this._normalQueue.push(t, e, n), this._queueTick();
    }function vr(t) {
      this._normalQueue._pushOne(t), this._queueTick();
    }function _r(t, e) {
      function n(r) {
        return this instanceof n ? (kc(this, "message", "string" == typeof r ? r : e), kc(this, "name", t), void (Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : Error.call(this))) : new n(r);
      }return wc(n, Error), n;
    }function gr(t) {
      return this instanceof gr ? (kc(this, "name", "OperationalError"), kc(this, "message", t), this.cause = t, this.isOperational = !0, void (t instanceof Error ? (kc(this, "message", t.message), kc(this, "stack", t.stack)) : Error.captureStackTrace && Error.captureStackTrace(this, this.constructor))) : new gr(t);
    }function yr(t) {
      return t instanceof Error && Xc.getPrototypeOf(t) === Error.prototype;
    }function br(t) {
      var e;if (yr(t)) {
        e = new Gc(t), e.name = t.name, e.message = t.message, e.stack = t.stack;for (var n = Xc.keys(t), r = 0; r < n.length; ++r) {
          var i = n[r];qc.test(i) || (e[i] = t[i]);
        }return e;
      }return Wc.markAsOriginatingFromRejection(t), t;
    }function Cr(t) {
      return function (e, n) {
        if (null !== t) {
          if (e) {
            var r = br(zc(e));t._attachExtraTrace(r), t._reject(r);
          } else if (arguments.length > 2) {
            for (var i = arguments.length, o = new Array(i - 1), s = 1; s < i; ++s) {
              o[s - 1] = arguments[s];
            }t._fulfill(o);
          } else t._fulfill(n);t = null;
        }
      };
    }function Er() {
      try {
        Promise === Fu && (Promise = Ru);
      } catch (t) {}return Fu;
    }!function (t) {
      function e() {}function n(t, e) {
        return function () {
          t.apply(e, arguments);
        };
      }function r(t) {
        if ("object" != _typeof(this)) throw new TypeError("Promises must be constructed via new");if ("function" != typeof t) throw new TypeError("not a function");this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], u(t, this);
      }function i(t, e) {
        for (; 3 === t._state;) {
          t = t._value;
        }return 0 === t._state ? void t._deferreds.push(e) : (t._handled = !0, void r._immediateFn(function () {
          var n = 1 === t._state ? e.onFulfilled : e.onRejected;if (null === n) return void (1 === t._state ? o : s)(e.promise, t._value);var r;try {
            r = n(t._value);
          } catch (t) {
            return void s(e.promise, t);
          }o(e.promise, r);
        }));
      }function o(t, e) {
        try {
          if (e === t) throw new TypeError("A promise cannot be resolved with itself.");if (e && ("object" == (typeof e === 'undefined' ? 'undefined' : _typeof(e)) || "function" == typeof e)) {
            var i = e.then;if (e instanceof r) return t._state = 3, t._value = e, void a(t);if ("function" == typeof i) return void u(n(i, e), t);
          }t._state = 1, t._value = e, a(t);
        } catch (e) {
          s(t, e);
        }
      }function s(t, e) {
        t._state = 2, t._value = e, a(t);
      }function a(t) {
        2 === t._state && 0 === t._deferreds.length && r._immediateFn(function () {
          t._handled || r._unhandledRejectionFn(t._value);
        });for (var e = 0, n = t._deferreds.length; e < n; e++) {
          i(t, t._deferreds[e]);
        }t._deferreds = null;
      }function c(t, e, n) {
        this.onFulfilled = "function" == typeof t ? t : null, this.onRejected = "function" == typeof e ? e : null, this.promise = n;
      }function u(t, e) {
        var n = !1;try {
          t(function (t) {
            n || (n = !0, o(e, t));
          }, function (t) {
            n || (n = !0, s(e, t));
          });
        } catch (t) {
          if (n) return;n = !0, s(e, t);
        }
      }var l = setTimeout;r.prototype.catch = function (t) {
        return this.then(null, t);
      }, r.prototype.then = function (t, n) {
        var r = new this.constructor(e);return i(this, new c(t, n, r)), r;
      }, r.all = function (t) {
        var e = Array.prototype.slice.call(t);return new r(function (t, n) {
          function r(o, s) {
            try {
              if (s && ("object" == (typeof s === 'undefined' ? 'undefined' : _typeof(s)) || "function" == typeof s)) {
                var a = s.then;if ("function" == typeof a) return void a.call(s, function (t) {
                  r(o, t);
                }, n);
              }e[o] = s, 0 === --i && t(e);
            } catch (t) {
              n(t);
            }
          }if (0 === e.length) return t([]);for (var i = e.length, o = 0; o < e.length; o++) {
            r(o, e[o]);
          }
        });
      }, r.resolve = function (t) {
        return t && "object" == (typeof t === 'undefined' ? 'undefined' : _typeof(t)) && t.constructor === r ? t : new r(function (e) {
          e(t);
        });
      }, r.reject = function (t) {
        return new r(function (e, n) {
          n(t);
        });
      }, r.race = function (t) {
        return new r(function (e, n) {
          for (var r = 0, i = t.length; r < i; r++) {
            t[r].then(e, n);
          }
        });
      }, r._immediateFn = "function" == typeof setImmediate && function (t) {
        setImmediate(t);
      } || function (t) {
        l(t, 0);
      }, r._unhandledRejectionFn = function (t) {
        "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", t);
      }, r._setImmediateFn = function (t) {
        r._immediateFn = t;
      }, r._setUnhandledRejectionFn = function (t) {
        r._unhandledRejectionFn = t;
      }, "undefined" != 'object' && module.exports ? module.exports = r : t.Promise || (t.Promise = r);
    }(this);var wr = { css: { main: "https://static.filestackapi.com/picker/v3/0.3.1/main.css" } },
        kr = "undefined" != typeof window ? window : "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : {},
        Tr = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (t) {
      return typeof t === 'undefined' ? 'undefined' : _typeof(t);
    } : function (t) {
      return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t === 'undefined' ? 'undefined' : _typeof(t);
    },
        Ar = function Ar(t, e, n) {
      return e in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
    },
        Sr = Object.assign || function (t) {
      for (var e = 1; e < arguments.length; e++) {
        var n = arguments[e];for (var r in n) {
          Object.prototype.hasOwnProperty.call(n, r) && (t[r] = n[r]);
        }
      }return t;
    },
        Rr = function Rr(t) {
      if (Array.isArray(t)) {
        for (var e = 0, n = Array(t.length); e < t.length; e++) {
          n[e] = t[e];
        }return n;
      }return Array.from(t);
    },
        Fr = r("slot,component", !0),
        Or = Object.prototype.hasOwnProperty,
        Lr = /-(\w)/g,
        xr = a(function (t) {
      return t.replace(Lr, function (t, e) {
        return e ? e.toUpperCase() : "";
      });
    }),
        Ir = a(function (t) {
      return t.charAt(0).toUpperCase() + t.slice(1);
    }),
        Pr = /([^-])([A-Z])/g,
        jr = a(function (t) {
      return t.replace(Pr, "$1-$2").replace(Pr, "$1-$2").toLowerCase();
    }),
        Nr = Object.prototype.toString,
        Ur = "[object Object]",
        Dr = function Dr() {
      return !1;
    },
        $r = function $r(t) {
      return t;
    },
        Mr = { optionMergeStrategies: Object.create(null), silent: !1, devtools: !1, errorHandler: null, ignoredElements: [], keyCodes: Object.create(null), isReservedTag: Dr, isUnknownElement: Dr, getTagNamespace: h, parsePlatformTagName: $r, mustUseProp: Dr, _assetTypes: ["component", "directive", "filter"], _lifecycleHooks: ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestroy", "destroyed", "activated", "deactivated"], _maxUpdateCount: 100 },
        Hr = /[^\w.$]/,
        Wr = "__proto__" in {},
        zr = "undefined" != typeof window,
        Vr = zr && window.navigator.userAgent.toLowerCase(),
        Br = Vr && /msie|trident/.test(Vr),
        Gr = Vr && Vr.indexOf("msie 9.0") > 0,
        Yr = Vr && Vr.indexOf("edge/") > 0,
        Xr = Vr && Vr.indexOf("android") > 0,
        qr = Vr && /iphone|ipad|ipod|ios/.test(Vr),
        Qr,
        Kr = function Kr() {
      return void 0 === Qr && (Qr = !zr && "undefined" != typeof kr && "server" === kr.process.env.VUE_ENV), Qr;
    },
        Jr = zr && window.__VUE_DEVTOOLS_GLOBAL_HOOK__,
        Zr = function () {
      function t() {
        r = !1;var t = n.slice(0);n.length = 0;for (var e = 0; e < t.length; e++) {
          t[e]();
        }
      }var e,
          n = [],
          r = !1;if ("undefined" != typeof Promise && C(Promise)) {
        var i = Promise.resolve(),
            o = function o(t) {
          console.error(t);
        };e = function e() {
          i.then(t).catch(o), qr && setTimeout(h);
        };
      } else if ("undefined" == typeof MutationObserver || !C(MutationObserver) && "[object MutationObserverConstructor]" !== MutationObserver.toString()) e = function e() {
        setTimeout(t, 0);
      };else {
        var s = 1,
            a = new MutationObserver(t),
            c = document.createTextNode(String(s));a.observe(c, { characterData: !0 }), e = function e() {
          s = (s + 1) % 2, c.data = String(s);
        };
      }return function (t, i) {
        var o;if (n.push(function () {
          t && t.call(i), o && o(i);
        }), r || (r = !0, e()), !t && "undefined" != typeof Promise) return new Promise(function (t) {
          o = t;
        });
      };
    }(),
        ti;ti = "undefined" != typeof Set && C(Set) ? Set : function () {
      function t() {
        this.set = Object.create(null);
      }return t.prototype.has = function (t) {
        return this.set[t] === !0;
      }, t.prototype.add = function (t) {
        this.set[t] = !0;
      }, t.prototype.clear = function () {
        this.set = Object.create(null);
      }, t;
    }();var ei = h,
        ni,
        ri = 0,
        ii = function ii() {
      this.id = ri++, this.subs = [];
    };ii.prototype.addSub = function (t) {
      this.subs.push(t);
    }, ii.prototype.removeSub = function (t) {
      i(this.subs, t);
    }, ii.prototype.depend = function () {
      ii.target && ii.target.addDep(this);
    }, ii.prototype.notify = function () {
      for (var t = this.subs.slice(), e = 0, n = t.length; e < n; e++) {
        t[e].update();
      }
    }, ii.target = null;var oi = [],
        si = Array.prototype,
        ai = Object.create(si);["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(function (t) {
      var e = si[t];y(ai, t, function () {
        for (var n = arguments, r = arguments.length, i = new Array(r); r--;) {
          i[r] = n[r];
        }var o,
            s = e.apply(this, i),
            a = this.__ob__;switch (t) {case "push":
            o = i;break;case "unshift":
            o = i;break;case "splice":
            o = i.slice(2);}return o && a.observeArray(o), a.dep.notify(), s;
      });
    });var ci = Object.getOwnPropertyNames(ai),
        ui = { shouldConvert: !0, isSettingProps: !1 },
        li = function li(t) {
      if (this.value = t, this.dep = new ii(), this.vmCount = 0, y(t, "__ob__", this), Array.isArray(t)) {
        var e = Wr ? k : T;e(t, ai, ci), this.observeArray(t);
      } else this.walk(t);
    };li.prototype.walk = function (t) {
      for (var e = Object.keys(t), n = 0; n < e.length; n++) {
        S(t, e[n], t[e[n]]);
      }
    }, li.prototype.observeArray = function (t) {
      for (var e = 0, n = t.length; e < n; e++) {
        A(t[e]);
      }
    };var fi = Mr.optionMergeStrategies;fi.data = function (t, e, n) {
      return n ? t || e ? function () {
        var r = "function" == typeof e ? e.call(n) : e,
            i = "function" == typeof t ? t.call(n) : void 0;return r ? L(r, i) : i;
      } : void 0 : e ? "function" != typeof e ? t : t ? function () {
        return L(e.call(this), t.call(this));
      } : e : t;
    }, Mr._lifecycleHooks.forEach(function (t) {
      fi[t] = x;
    }), Mr._assetTypes.forEach(function (t) {
      fi[t + "s"] = I;
    }), fi.watch = function (t, e) {
      if (!e) return t;if (!t) return e;var n = {};l(n, t);for (var r in e) {
        var i = n[r],
            o = e[r];i && !Array.isArray(i) && (i = [i]), n[r] = i ? i.concat(o) : [o];
      }return n;
    }, fi.props = fi.methods = fi.computed = function (t, e) {
      if (!e) return t;if (!t) return e;var n = Object.create(null);return l(n, t), l(n, e), n;
    };var pi = function pi(t, e) {
      return void 0 === e ? t : e;
    },
        di = Object.freeze({ defineReactive: S, _toString: e, toNumber: n, makeMap: r, isBuiltInTag: Fr, remove: i, hasOwn: o, isPrimitive: s, cached: a, camelize: xr, capitalize: Ir, hyphenate: jr, bind: c, toArray: u, extend: l, isObject: f, isPlainObject: p, toObject: d, noop: h, no: Dr, identity: $r, genStaticKeys: m, looseEqual: v, looseIndexOf: _, isReserved: g, def: y, parsePath: b, hasProto: Wr, inBrowser: zr, UA: Vr, isIE: Br, isIE9: Gr, isEdge: Yr, isAndroid: Xr, isIOS: qr, isServerRendering: Kr, devtools: Jr, nextTick: Zr, get _Set() {
        return ti;
      }, mergeOptions: N, resolveAsset: U, get warn() {
        return ei;
      }, get formatComponentName() {
        return ni;
      }, validateProp: D }),
        hi = function hi(t, e, n, r, i, o, s) {
      this.tag = t, this.data = e, this.children = n, this.text = r, this.elm = i, this.ns = void 0, this.context = o, this.functionalContext = void 0, this.key = e && e.key, this.componentOptions = s, this.componentInstance = void 0, this.parent = void 0, this.raw = !1, this.isStatic = !1, this.isRootInsert = !0, this.isComment = !1, this.isCloned = !1, this.isOnce = !1;
    },
        mi = { child: {} };mi.child.get = function () {
      return this.componentInstance;
    }, Object.defineProperties(hi.prototype, mi);var vi = function vi() {
      var t = new hi();return t.text = "", t.isComment = !0, t;
    },
        _i = { init: X, prepatch: q, insert: Q, destroy: K },
        gi = Object.keys(_i),
        yi = a(function (t) {
      var e = "~" === t.charAt(0);t = e ? t.slice(1) : t;var n = "!" === t.charAt(0);return t = n ? t.slice(1) : t, { name: t, once: e, capture: n };
    }),
        bi = 1,
        Ci = 2,
        Ei,
        wi = null,
        ki = [],
        Ti = {},
        Ai = {},
        Si = !1,
        Ri = !1,
        Fi = 0,
        Oi = 0,
        Li = function Li(t, e, n, r) {
      this.vm = t, t._watchers.push(this), r ? (this.deep = !!r.deep, this.user = !!r.user, this.lazy = !!r.lazy, this.sync = !!r.sync) : this.deep = this.user = this.lazy = this.sync = !1, this.cb = n, this.id = ++Oi, this.active = !0, this.dirty = this.lazy, this.deps = [], this.newDeps = [], this.depIds = new ti(), this.newDepIds = new ti(), this.expression = "", "function" == typeof e ? this.getter = e : (this.getter = b(e), this.getter || (this.getter = function () {})), this.value = this.lazy ? void 0 : this.get();
    };Li.prototype.get = function () {
      E(this);var t = this.getter.call(this.vm, this.vm);return this.deep && St(t), w(), this.cleanupDeps(), t;
    }, Li.prototype.addDep = function (t) {
      var e = t.id;this.newDepIds.has(e) || (this.newDepIds.add(e), this.newDeps.push(t), this.depIds.has(e) || t.addSub(this));
    }, Li.prototype.cleanupDeps = function () {
      for (var t = this, e = this.deps.length; e--;) {
        var n = t.deps[e];t.newDepIds.has(n.id) || n.removeSub(t);
      }var r = this.depIds;this.depIds = this.newDepIds, this.newDepIds = r, this.newDepIds.clear(), r = this.deps, this.deps = this.newDeps, this.newDeps = r, this.newDeps.length = 0;
    }, Li.prototype.update = function () {
      this.lazy ? this.dirty = !0 : this.sync ? this.run() : At(this);
    }, Li.prototype.run = function () {
      if (this.active) {
        var t = this.get();if (t !== this.value || f(t) || this.deep) {
          var e = this.value;if (this.value = t, this.user) try {
            this.cb.call(this.vm, t, e);
          } catch (t) {
            if (!Mr.errorHandler) throw t;Mr.errorHandler.call(null, t, this.vm);
          } else this.cb.call(this.vm, t, e);
        }
      }
    }, Li.prototype.evaluate = function () {
      this.value = this.get(), this.dirty = !1;
    }, Li.prototype.depend = function () {
      for (var t = this, e = this.deps.length; e--;) {
        t.deps[e].depend();
      }
    }, Li.prototype.teardown = function () {
      var t = this;if (this.active) {
        this.vm._isBeingDestroyed || i(this.vm._watchers, this);for (var e = this.deps.length; e--;) {
          t.deps[e].removeSub(t);
        }this.active = !1;
      }
    };var xi = new ti(),
        Ii = { enumerable: !0, configurable: !0, get: h, set: h },
        Pi = 0;$t(Wt), Ut(Wt), bt(Wt), Et(Wt), ht(Wt);var ji = [String, RegExp],
        Ni = { name: "keep-alive", abstract: !0, props: { include: ji, exclude: ji }, created: function created() {
        this.cache = Object.create(null);
      }, destroyed: function destroyed() {
        var t = this;for (var e in this.cache) {
          Qt(t.cache[e]);
        }
      }, watch: { include: function include(t) {
          qt(this.cache, function (e) {
            return Xt(t, e);
          });
        }, exclude: function exclude(t) {
          qt(this.cache, function (e) {
            return !Xt(t, e);
          });
        } }, render: function render() {
        var t = ut(this.$slots.default),
            e = t && t.componentOptions;if (e) {
          var n = Yt(e);if (n && (this.include && !Xt(this.include, n) || this.exclude && Xt(this.exclude, n))) return t;var r = null == t.key ? e.Ctor.cid + (e.tag ? "::" + e.tag : "") : t.key;this.cache[r] ? t.componentInstance = this.cache[r].componentInstance : this.cache[r] = t, t.data.keepAlive = !0;
        }return t;
      } },
        Ui = { KeepAlive: Ni };Kt(Wt), Object.defineProperty(Wt.prototype, "$isServer", { get: Kr }), Wt.version = "2.1.10";var Di = r("input,textarea,option,select"),
        $i = function $i(t, e, n) {
      return "value" === n && Di(t) && "button" !== e || "selected" === n && "option" === t || "checked" === n && "input" === t || "muted" === n && "video" === t;
    },
        Mi = r("contenteditable,draggable,spellcheck"),
        Hi = r("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),
        Wi = "http://www.w3.org/1999/xlink",
        zi = function zi(t) {
      return ":" === t.charAt(5) && "xlink" === t.slice(0, 5);
    },
        Vi = function Vi(t) {
      return zi(t) ? t.slice(6, t.length) : "";
    },
        Bi = function Bi(t) {
      return null == t || t === !1;
    },
        Gi = { svg: "http://www.w3.org/2000/svg", math: "http://www.w3.org/1998/Math/MathML" },
        Yi = r("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template"),
        Xi = r("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view", !0),
        qi = function qi(t) {
      return Yi(t) || Xi(t);
    },
        Qi = Object.create(null),
        Ki = Object.freeze({ createElement: se, createElementNS: ae, createTextNode: ce, createComment: ue, insertBefore: le, removeChild: fe, appendChild: pe, parentNode: de, nextSibling: he, tagName: me, setTextContent: ve, setAttribute: _e }),
        Ji = { create: function create(t, e) {
        ge(e);
      }, update: function update(t, e) {
        t.data.ref !== e.data.ref && (ge(t, !0), ge(e));
      }, destroy: function destroy(t) {
        ge(t, !0);
      } },
        Zi = new hi("", {}, []),
        to = ["create", "activate", "update", "remove", "destroy"],
        eo = { create: ke, update: ke, destroy: function destroy(t) {
        ke(t, Zi);
      } },
        no = Object.create(null),
        ro = [Ji, eo],
        io = { create: Fe, update: Fe },
        oo = { create: Le, update: Le },
        so,
        ao = { create: Pe, update: Pe },
        co = { create: je, update: je },
        uo = a(function (t) {
      var e = {},
          n = /;(?![^(]*\))/g,
          r = /:(.+)/;return t.split(n).forEach(function (t) {
        if (t) {
          var n = t.split(r);n.length > 1 && (e[n[0].trim()] = n[1].trim());
        }
      }), e;
    }),
        lo = /^--/,
        fo = /\s*!important$/,
        po = function po(t, e, n) {
      lo.test(e) ? t.style.setProperty(e, n) : fo.test(n) ? t.style.setProperty(e, n.replace(fo, ""), "important") : t.style[vo(e)] = n;
    },
        ho = ["Webkit", "Moz", "ms"],
        mo,
        vo = a(function (t) {
      if (mo = mo || document.createElement("div"), t = xr(t), "filter" !== t && t in mo.style) return t;for (var e = t.charAt(0).toUpperCase() + t.slice(1), n = 0; n < ho.length; n++) {
        var r = ho[n] + e;if (r in mo.style) return r;
      }
    }),
        _o = { create: We, update: We },
        go = zr && !Gr,
        yo = "transition",
        bo = "animation",
        Co = "transition",
        Eo = "transitionend",
        wo = "animation",
        ko = "animationend";go && (void 0 === window.ontransitionend && void 0 !== window.onwebkittransitionend && (Co = "WebkitTransition", Eo = "webkitTransitionEnd"), void 0 === window.onanimationend && void 0 !== window.onwebkitanimationend && (wo = "WebkitAnimation", ko = "webkitAnimationEnd"));var To = zr && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout,
        Ao = /\b(transform|all)(,|$)/,
        So = a(function (t) {
      return { enterClass: t + "-enter", leaveClass: t + "-leave", appearClass: t + "-enter", enterToClass: t + "-enter-to", leaveToClass: t + "-leave-to", appearToClass: t + "-enter-to", enterActiveClass: t + "-enter-active", leaveActiveClass: t + "-leave-active", appearActiveClass: t + "-enter-active" };
    }),
        Ro = zr ? { create: nn, activate: nn, remove: function remove(t, e) {
        t.data.show ? e() : Ze(t, e);
      } } : {},
        Fo = [io, oo, ao, co, _o, Ro],
        Oo = Fo.concat(ro),
        Lo = we({ nodeOps: Ki, modules: Oo });Gr && document.addEventListener("selectionchange", function () {
      var t = document.activeElement;t && t.vmodel && un(t, "input");
    });var xo = { inserted: function inserted(t, e, n) {
        if ("select" === n.tag) {
          var r = function r() {
            rn(t, e, n.context);
          };r(), (Br || Yr) && setTimeout(r, 0);
        } else "textarea" !== n.tag && "text" !== t.type || (t._vModifiers = e.modifiers, e.modifiers.lazy || (Xr || (t.addEventListener("compositionstart", an), t.addEventListener("compositionend", cn)), Gr && (t.vmodel = !0)));
      }, componentUpdated: function componentUpdated(t, e, n) {
        if ("select" === n.tag) {
          rn(t, e, n.context);var r = t.multiple ? e.value.some(function (e) {
            return on(e, t.options);
          }) : e.value !== e.oldValue && on(e.value, t.options);r && un(t, "change");
        }
      } },
        Io = { bind: function bind(t, e, n) {
        var r = e.value;n = ln(n);var i = n.data && n.data.transition,
            o = t.__vOriginalDisplay = "none" === t.style.display ? "" : t.style.display;r && i && !Gr ? (n.data.show = !0, Je(n, function () {
          t.style.display = o;
        })) : t.style.display = r ? o : "none";
      }, update: function update(t, e, n) {
        var r = e.value,
            i = e.oldValue;if (r !== i) {
          n = ln(n);var o = n.data && n.data.transition;o && !Gr ? (n.data.show = !0, r ? Je(n, function () {
            t.style.display = t.__vOriginalDisplay;
          }) : Ze(n, function () {
            t.style.display = "none";
          })) : t.style.display = r ? t.__vOriginalDisplay : "none";
        }
      }, unbind: function unbind(t, e, n, r, i) {
        i || (t.style.display = t.__vOriginalDisplay);
      } },
        Po = { model: xo, show: Io },
        jo = { name: String, appear: Boolean, css: Boolean, mode: String, type: String, enterClass: String, leaveClass: String, enterToClass: String, leaveToClass: String, enterActiveClass: String, leaveActiveClass: String, appearClass: String, appearActiveClass: String, appearToClass: String },
        No = { name: "transition", props: jo, abstract: !0, render: function render(t) {
        var e = this,
            n = this.$slots.default;if (n && (n = n.filter(function (t) {
          return t.tag;
        }), n.length)) {
          var r = this.mode,
              i = n[0];if (hn(this.$vnode)) return i;var o = fn(i);if (!o) return i;if (this._leaving) return dn(t, i);var a = "__transition-" + this._uid + "-",
              c = o.key = null == o.key ? a + o.tag : s(o.key) ? 0 === String(o.key).indexOf(a) ? o.key : a + o.key : o.key,
              u = (o.data || (o.data = {})).transition = pn(this),
              f = this._vnode,
              p = fn(f);if (o.data.directives && o.data.directives.some(function (t) {
            return "show" === t.name;
          }) && (o.data.show = !0), p && p.data && !mn(o, p)) {
            var d = p && (p.data.transition = l({}, u));if ("out-in" === r) return this._leaving = !0, rt(d, "afterLeave", function () {
              e._leaving = !1, e.$forceUpdate();
            }, c), dn(t, i);if ("in-out" === r) {
              var h,
                  m = function m() {
                h();
              };rt(u, "afterEnter", m, c), rt(u, "enterCancelled", m, c), rt(d, "delayLeave", function (t) {
                h = t;
              }, c);
            }
          }return i;
        }
      } },
        Uo = l({ tag: String, moveClass: String }, jo);delete Uo.mode;var Do = { props: Uo, render: function render(t) {
        for (var e = this.tag || this.$vnode.data.tag || "span", n = Object.create(null), r = this.prevChildren = this.children, i = this.$slots.default || [], o = this.children = [], s = pn(this), a = 0; a < i.length; a++) {
          var c = i[a];c.tag && null != c.key && 0 !== String(c.key).indexOf("__vlist") && (o.push(c), n[c.key] = c, (c.data || (c.data = {})).transition = s);
        }if (r) {
          for (var u = [], l = [], f = 0; f < r.length; f++) {
            var p = r[f];p.data.transition = s, p.data.pos = p.elm.getBoundingClientRect(), n[p.key] ? u.push(p) : l.push(p);
          }this.kept = t(e, null, u), this.removed = l;
        }return t(e, null, o);
      }, beforeUpdate: function beforeUpdate() {
        this.__patch__(this._vnode, this.kept, !1, !0), this._vnode = this.kept;
      }, updated: function updated() {
        var t = this.prevChildren,
            e = this.moveClass || (this.name || "v") + "-move";if (t.length && this.hasMove(t[0].elm, e)) {
          t.forEach(vn), t.forEach(_n), t.forEach(gn);document.body.offsetHeight;t.forEach(function (t) {
            if (t.data.moved) {
              var n = t.elm,
                  r = n.style;Ge(n, e), r.transform = r.WebkitTransform = r.transitionDuration = "", n.addEventListener(Eo, n._moveCb = function t(r) {
                r && !/transform$/.test(r.propertyName) || (n.removeEventListener(Eo, t), n._moveCb = null, Ye(n, e));
              });
            }
          });
        }
      }, methods: { hasMove: function hasMove(t, e) {
          if (!go) return !1;if (null != this._hasMove) return this._hasMove;
          Ge(t, e);var n = qe(t);return Ye(t, e), this._hasMove = n.hasTransform;
        } } },
        $o = { Transition: No, TransitionGroup: Do };Wt.config.isUnknownElement = ie, Wt.config.isReservedTag = qi, Wt.config.getTagNamespace = re, Wt.config.mustUseProp = $i, l(Wt.options.directives, Po), l(Wt.options.components, $o), Wt.prototype.__patch__ = zr ? Lo : h, Wt.prototype.$mount = function (t, e) {
      return t = t && zr ? oe(t) : void 0, this._mount(t, e);
    }, setTimeout(function () {
      Mr.devtools && Jr && Jr.emit("init", Wt);
    }, 0);var Mo = Wt,
        Ho = t(function (t, e) {
      "use strict";
      var n = null,
          r = { install: function install(t) {
          var e,
              r = t.version[0];n || (n = new t({ data: function data() {
              return { current: "", locales: {} };
            }, computed: { lang: function lang() {
                return this.current;
              }, locale: function locale() {
                return this.locales[this.current] ? this.locales[this.current] : null;
              } }, methods: { setLang: function setLang(t) {
                this.current !== t && ("" === this.current ? this.$emit("language:init", t) : this.$emit("language:changed", t)), this.current = t, this.$emit("language:modified", t);
              }, setLocales: function setLocales(e) {
                if (e) {
                  var n = Object.create(this.locales);for (var r in e) {
                    n[r] || (n[r] = {}), t.util.extend(n[r], e[r]);
                  }this.locales = Object.create(n), this.$emit("locales:loaded", e);
                }
              }, text: function text(t) {
                return this.locale && this.locale[t] ? this.locale[t] : t;
              } } }), t.prototype.$translate = n), t.mixin((e = {}, e["1" === r ? "init" : "beforeCreate"] = function () {
            this.$translate.setLocales(this.$options.locales);
          }, e.methods = { t: function t(_t2) {
              return this.$translate.text(_t2);
            } }, e.directives = { translate: function (t) {
              t.$translateKey || (t.$translateKey = t.innerText);var e = this.$translate.text(t.$translateKey);t.innerText = e;
            }.bind(n) }, e)), t.locales = function (t) {
            n.$translate.setLocales(t);
          };
        } };t.exports = r;
    }),
        Wo = { init: function init() {
        window.filestackInternals.logger.working = !1;
      }, isWorking: function isWorking() {
        return window.filestackInternals.logger.working;
      }, on: function on() {
        window.filestackInternals.logger.working = !0;
      }, off: function off() {
        window.filestackInternals.logger.working = !1;
      } },
        zo = function t(e, n) {
      var r = function r() {
        for (var t = arguments.length, r = Array(t), i = 0; i < t; i++) {
          r[i] = arguments[i];
        }var o = [].concat(r).map(function (t) {
          return "object" === ("undefined" == typeof t ? "undefined" : Tr(t)) ? JSON.stringify(t, function (t, e) {
            if ("function" == typeof e) {
              if ("json" === t) try {
                return e();
              } catch (t) {}return "[Function]";
            }return e instanceof File ? "[File name: " + e.name + ", mimetype: " + e.type + ", size: " + e.size + "]" : e;
          }, 2) : t;
        });if (n.isWorking()) {
          var s;(s = console).log.apply(s, ["[" + e + "]"].concat(Rr(o)));
        }
      };return r.context = function (r) {
        return t(e + "][" + r, n);
      }, r.on = n.on, r.off = n.off, r;
    },
        Vo = zo("filestack", Wo),
        Bo = function Bo() {
      var t = void 0;return "object" === ("undefined" == typeof window ? "undefined" : Tr(window)) && (t = window.filestackInternals, t || (t = {}, window.filestackInternals = t), t.logger || (t.logger = Vo, Wo.init())), t;
    };Bo();var Go = function Go() {
      var t = void 0;return "object" === ("undefined" == typeof window ? "undefined" : Tr(window)) && (t = window.filestackInternals, t || (t = {}, window.filestackInternals = t), t.loader || (t.loader = { modules: {} })), t;
    },
        Yo = Go(),
        Xo = Yo.loader.modules,
        qo = function qo(t) {
      var e = Xo[t];if (e || (Xo[t] = {}, e = Xo[t]), e.instance) return Promise.resolve(e.instance);if (e.promise) return e.promise;var n = new Promise(function (n) {
        var r = function r() {
          e.resolvePromise = n;var r = document.createElement("script");r.src = t, document.body.appendChild(r);
        },
            i = function t() {
          "complete" === document.readyState ? r() : setTimeout(t, 50);
        };i();
      });return e.promise = n, n;
    },
        Qo = function Qo(t) {
      var e = document.getElementsByTagName("script"),
          n = e[e.length - 1],
          r = n.getAttribute("src"),
          i = Xo[r];i.resolvePromise && (i.instance = t, i.resolvePromise(t), delete i.promise, delete i.resolvePromise);
    },
        Ko = function Ko(t) {
      var e = document.querySelector('link[href="' + t + '"]');return null !== e ? Promise.resolve() : new Promise(function (e) {
        var n = document.getElementsByTagName("head")[0],
            r = document.createElement("link"),
            i = function t() {
          e(), r.removeEventListener("load", t);
        };r.rel = "stylesheet", r.href = t, r.addEventListener("load", i), n.appendChild(r);
      });
    },
        Jo = { registerReadyModule: Qo, loadModule: qo, loadCss: Ko },
        Zo = function Zo(t) {
      function e() {
        var t = this.$options;t.store ? this.$store = t.store : t.parent && t.parent.$store && (this.$store = t.parent.$store);
      }var n = Number(t.version.split(".")[0]);if (n >= 2) {
        var r = t.config._lifecycleHooks.indexOf("init") > -1;t.mixin(r ? { init: e } : { beforeCreate: e });
      } else {
        var i = t.prototype._init;t.prototype._init = function (t) {
          void 0 === t && (t = {}), t.init = t.init ? [e].concat(t.init) : e, i.call(this, t);
        };
      }
    },
        ts = "undefined" != typeof window && window.__VUE_DEVTOOLS_GLOBAL_HOOK__,
        es = function es(t, e) {
      this.runtime = e, this._children = Object.create(null), this._rawModule = t;
    },
        ns = { state: {}, namespaced: {} };ns.state.get = function () {
      return this._rawModule.state || {};
    }, ns.namespaced.get = function () {
      return !!this._rawModule.namespaced;
    }, es.prototype.addChild = function (t, e) {
      this._children[t] = e;
    }, es.prototype.removeChild = function (t) {
      delete this._children[t];
    }, es.prototype.getChild = function (t) {
      return this._children[t];
    }, es.prototype.update = function (t) {
      this._rawModule.namespaced = t.namespaced, t.actions && (this._rawModule.actions = t.actions), t.mutations && (this._rawModule.mutations = t.mutations), t.getters && (this._rawModule.getters = t.getters);
    }, es.prototype.forEachChild = function (t) {
      bn(this._children, t);
    }, es.prototype.forEachGetter = function (t) {
      this._rawModule.getters && bn(this._rawModule.getters, t);
    }, es.prototype.forEachAction = function (t) {
      this._rawModule.actions && bn(this._rawModule.actions, t);
    }, es.prototype.forEachMutation = function (t) {
      this._rawModule.mutations && bn(this._rawModule.mutations, t);
    }, Object.defineProperties(es.prototype, ns);var rs = function rs(t) {
      var e = this;this.root = new es(t, !1), t.modules && bn(t.modules, function (t, n) {
        e.register([n], t, !1);
      });
    };rs.prototype.get = function (t) {
      return t.reduce(function (t, e) {
        return t.getChild(e);
      }, this.root);
    }, rs.prototype.getNamespace = function (t) {
      var e = this.root;return t.reduce(function (t, n) {
        return e = e.getChild(n), t + (e.namespaced ? n + "/" : "");
      }, "");
    }, rs.prototype.update = function (t) {
      kn(this.root, t);
    }, rs.prototype.register = function (t, e, n) {
      var r = this;void 0 === n && (n = !0);var i = this.get(t.slice(0, -1)),
          o = new es(e, n);i.addChild(t[t.length - 1], o), e.modules && bn(e.modules, function (e, i) {
        r.register(t.concat(i), e, n);
      });
    }, rs.prototype.unregister = function (t) {
      var e = this.get(t.slice(0, -1)),
          n = t[t.length - 1];e.getChild(n).runtime && e.removeChild(n);
    };var is,
        os = function os(t) {
      var e = this;void 0 === t && (t = {}), wn(is, "must call Vue.use(Vuex) before creating a store instance."), wn("undefined" != typeof Promise, "vuex requires a Promise polyfill in this browser.");var n = t.state;void 0 === n && (n = {});var r = t.plugins;void 0 === r && (r = []);var i = t.strict;void 0 === i && (i = !1), this._committing = !1, this._actions = Object.create(null), this._mutations = Object.create(null), this._wrappedGetters = Object.create(null), this._modules = new rs(t), this._modulesNamespaceMap = Object.create(null), this._subscribers = [], this._watcherVM = new is();var o = this,
          s = this,
          a = s.dispatch,
          c = s.commit;this.dispatch = function (t, e) {
        return a.call(o, t, e);
      }, this.commit = function (t, e, n) {
        return c.call(o, t, e, n);
      }, this.strict = i, Sn(this, n, [], this._modules.root), An(this, n), r.concat(yn).forEach(function (t) {
        return t(e);
      });
    },
        ss = { state: {} };ss.state.get = function () {
      return this._vm._data.$$state;
    }, ss.state.set = function (t) {
      wn(!1, "Use store.replaceState() to explicit replace store state.");
    }, os.prototype.commit = function (t, e, n) {
      var r = this,
          i = jn(t, e, n),
          o = i.type,
          s = i.payload,
          a = i.options,
          c = { type: o, payload: s },
          u = this._mutations[o];return u ? (this._withCommit(function () {
        u.forEach(function (t) {
          t(s);
        });
      }), this._subscribers.forEach(function (t) {
        return t(c, r.state);
      }), void (a && a.silent && console.warn("[vuex] mutation type: " + o + ". Silent option has been removed. Use the filter functionality in the vue-devtools"))) : void console.error("[vuex] unknown mutation type: " + o);
    }, os.prototype.dispatch = function (t, e) {
      var n = jn(t, e),
          r = n.type,
          i = n.payload,
          o = this._actions[r];return o ? o.length > 1 ? Promise.all(o.map(function (t) {
        return t(i);
      })) : o[0](i) : void console.error("[vuex] unknown action type: " + r);
    }, os.prototype.subscribe = function (t) {
      var e = this._subscribers;return e.indexOf(t) < 0 && e.push(t), function () {
        var n = e.indexOf(t);n > -1 && e.splice(n, 1);
      };
    }, os.prototype.watch = function (t, e, n) {
      var r = this;return wn("function" == typeof t, "store.watch only accepts a function."), this._watcherVM.$watch(function () {
        return t(r.state, r.getters);
      }, e, n);
    }, os.prototype.replaceState = function (t) {
      var e = this;this._withCommit(function () {
        e._vm._data.$$state = t;
      });
    }, os.prototype.registerModule = function (t, e) {
      "string" == typeof t && (t = [t]), wn(Array.isArray(t), "module path must be a string or an Array."), this._modules.register(t, e), Sn(this, this.state, t, this._modules.get(t)), An(this, this.state);
    }, os.prototype.unregisterModule = function (t) {
      var e = this;"string" == typeof t && (t = [t]), wn(Array.isArray(t), "module path must be a string or an Array."), this._modules.unregister(t), this._withCommit(function () {
        var n = Pn(e.state, t.slice(0, -1));is.delete(n, t[t.length - 1]);
      }), Tn(this);
    }, os.prototype.hotUpdate = function (t) {
      this._modules.update(t), Tn(this, !0);
    }, os.prototype._withCommit = function (t) {
      var e = this._committing;this._committing = !0, t(), this._committing = e;
    }, Object.defineProperties(os.prototype, ss), "undefined" != typeof window && window.Vue && Nn(window.Vue);var as = Dn(function (t, e) {
      var n = {};return Un(e).forEach(function (e) {
        var r = e.key,
            i = e.val;n[r] = function () {
          var e = this.$store.state,
              n = this.$store.getters;if (t) {
            var r = $n(this.$store, "mapState", t);if (!r) return;e = r.context.state, n = r.context.getters;
          }return "function" == typeof i ? i.call(this, e, n) : e[i];
        }, n[r].vuex = !0;
      }), n;
    }),
        cs = Dn(function (t, e) {
      var n = {};return Un(e).forEach(function (e) {
        var r = e.key,
            i = e.val;i = t + i, n[r] = function () {
          for (var e = [], n = arguments.length; n--;) {
            e[n] = arguments[n];
          }if (!t || $n(this.$store, "mapMutations", t)) return this.$store.commit.apply(this.$store, [i].concat(e));
        };
      }), n;
    }),
        us = Dn(function (t, e) {
      var n = {};return Un(e).forEach(function (e) {
        var r = e.key,
            i = e.val;i = t + i, n[r] = function () {
          if (!t || $n(this.$store, "mapGetters", t)) return i in this.$store.getters ? this.$store.getters[i] : void console.error("[vuex] unknown getter: " + i);
        }, n[r].vuex = !0;
      }), n;
    }),
        ls = Dn(function (t, e) {
      var n = {};return Un(e).forEach(function (e) {
        var r = e.key,
            i = e.val;i = t + i, n[r] = function () {
          for (var e = [], n = arguments.length; n--;) {
            e[n] = arguments[n];
          }if (!t || $n(this.$store, "mapActions", t)) return this.$store.dispatch.apply(this.$store, [i].concat(e));
        };
      }), n;
    }),
        fs = { Store: os, install: Nn, version: "2.2.1", mapState: as, mapMutations: cs, mapGetters: us, mapActions: ls },
        ps = function ps(t) {
      return "function" == typeof t.getAsEntry ? t.getAsEntry() : "function" == typeof t.webkitGetAsEntry ? t.webkitGetAsEntry() : void 0;
    },
        ds = function ds(t) {
      var e = [".DS_Store"];return e.indexOf(t) === -1;
    },
        hs = function hs(t) {
      for (var e = [], n = function t(n) {
        return new Promise(function (r) {
          n.isDirectory ? n.createReader().readEntries(function (e) {
            var n = e.map(function (e) {
              return t(e);
            });Promise.all(n).then(r);
          }) : n.isFile && n.file(function (t) {
            ds(t.name) && e.push(t), r();
          });
        });
      }, r = function r(t) {
        return new Promise(function (n) {
          t.getAsString(function (t) {
            e.push({ url: t }), n();
          });
        });
      }, i = [], o = 0; o < t.length; o += 1) {
        var s = t[o];if ("file" === s.kind) {
          var a = s.getAsFile();a ? (e.push(a), i.push(Promise.resolve())) : (a = ps(s), a && i.push(n(a)));
        } else "string" === s.kind && "text/uri-list" === s.type && i.push(r(s));
      }return Promise.all(i).then(function () {
        return e;
      });
    },
        ms = function ms(t) {
      return new Promise(function (e) {
        for (var n = [], r = 0; r < t.length; r += 1) {
          n.push(t[r]);
        }e(n);
      });
    },
        vs = function vs(t) {
      return t.items ? hs(t.items) : t.files ? ms(t.files) : Promise.resolve([]);
    },
        _s = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { directives: [{ name: "show", rawName: "v-show", value: t.fileAboutToBeDropped, expression: "fileAboutToBeDropped" }], ref: "dropZone", staticClass: "fsp-dropzone-overlay" }, [n("div", { staticClass: "fsp-dropzone-overlay__text" })]);
      }, staticRenderFns: [], data: function data() {
        return { fileAboutToBeDropped: !1 };
      }, methods: Sr({}, fs.mapActions(["addFile", "updateSelectLabelActive"]), { dragenter: function dragenter(t) {
          t.preventDefault(), this.fileAboutToBeDropped = !0, this.updateSelectLabelActive(!0);
        }, dragover: function dragover(t) {
          t.preventDefault();
        }, dragleave: function dragleave() {
          this.fileAboutToBeDropped = !1, this.updateSelectLabelActive(!1);
        }, drop: function drop(t) {
          var e = this;t.preventDefault(), this.fileAboutToBeDropped = !1, vs(t.dataTransfer).then(function (t) {
            t.forEach(function (t) {
              (t instanceof File || t instanceof Blob) && e.addFile(t);
            });
          });
        }, paste: function paste(t) {
          var e = this;vs(t.clipboardData).then(function (t) {
            t.forEach(function (t) {
              t.name = "pasted file", e.addFile(t);
            });
          });
        } }), mounted: function mounted() {
        var t = this.$root.$el,
            e = this.$refs.dropZone;t.addEventListener("dragenter", this.dragenter, !1), e.addEventListener("dragover", this.dragover, !1), e.addEventListener("dragleave", this.dragleave, !1), e.addEventListener("drop", this.drop, !1), t.addEventListener("paste", this.paste, !1);
      } },
        gs = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return t.notifications.length > 0 ? n("div", { staticClass: "fsp-notifications__container" }, [n("div", { staticClass: "fsp-notifications__message" }, [n("span", { staticClass: "fsp-label" }, [t._v("Oops!")]), t._v(" " + t._s(t.mostRecentNotification.message) + "\n  ")]), t._v(" "), n("span", { staticClass: "fsp-icon fsp-notifications__close-button", on: { click: t.removeAllNotifications } })]) : t._e();
      }, staticRenderFns: [], computed: Sr({}, fs.mapGetters(["notifications"]), { mostRecentNotification: function mostRecentNotification() {
          return this.notifications[this.notifications.length - 1];
        } }), methods: Sr({}, fs.mapActions(["removeAllNotifications"])) },
        ys = [{ name: "local_file_system", label: "My Device", ui: "local" }, { name: "dropbox", label: "Dropbox", ui: "cloud" }, { name: "evernote", label: "Evernote", ui: "cloud" }, { name: "facebook", label: "Facebook", ui: "cloud" }, { name: "flickr", label: "Flickr", ui: "cloud" }, { name: "instagram", label: "Instagram", ui: "cloud" }, { name: "box", label: "Box", ui: "cloud" }, { name: "googledrive", label: "Google Drive", ui: "cloud" }, { name: "github", label: "Github", ui: "cloud" }, { name: "gmail", label: "Gmail", ui: "cloud" }, { name: "picasa", label: "Google Photos", ui: "cloud" }, { name: "onedrive", label: "OneDrive", ui: "cloud" }, { name: "clouddrive", label: "Cloud Drive", ui: "cloud" }, { name: "imagesearch", label: "Web Search", ui: "imagesearch" }, { name: "source-url", label: "Link (URL)", ui: "source-url", layout_view: "list" }],
        bs = function bs(t) {
      var e = void 0;if (ys.forEach(function (n) {
        n.name === t && (e = n);
      }), !e) throw new Error('Unknown source "' + t + '"');return e;
    },
        Cs = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("span", { staticClass: "fsp-picker__close-button fsp-icon--close-modal", on: { click: t.closePicker } });
      }, staticRenderFns: [], methods: { closePicker: function closePicker() {
          this.$root.$destroy();
        } } },
        Es = function Es(t) {
      return t.indexOf("/") !== -1;
    },
        ws = function ws(t, e) {
      return t.mimetype && "image/*" === e ? t.mimetype.indexOf("image/") !== -1 : t.mimetype && "video/*" === e ? t.mimetype.indexOf("video/") !== -1 : t.mimetype && "audio/*" === e ? t.mimetype.indexOf("audio/") !== -1 : t.mimetype === e;
    },
        ks = function ks(t) {
      return (/\.\w+$/.exec(t)[0]
      );
    },
        Ts = function Ts(t) {
      return t.replace(".", "");
    },
        As = function As(t, e) {
      var n = Ts(ks(t.name)),
          r = Ts(e);return n === r;
    },
        Ss = function Ss(t, e) {
      return void 0 === e || e.some(function (e) {
        return Es(e) ? ws(t, e) : As(t, e);
      });
    },
        Rs = function Rs(t) {
      var e = { name: t.name, mimetype: t.mimetype, size: t.size, source: t.source, url: t.url, handle: t.handle };return t.status && (e.status = t.status), e;
    },
        Fs = function Fs(t) {
      return t.map(Rs);
    },
        Os = function Os() {
      return Math.round(255 * Math.random()).toString(16);
    },
        Ls = function Ls(t) {
      for (var e = ""; e.length < 2 * t;) {
        e += Os();
      }return e;
    },
        xs = function xs(t) {
      if (t.name.length < 45) return t.name;var e = t.name.split(".");if (2 === e.length) {
        var n = e[0].substring(0, 42) + "..",
            r = e[1];return n + "." + r;
      }return t.name.substring(0, 42) + "...";
    },
        Is = Vo.context("picker"),
        Ps = function Ps(t) {
      return t.source + t.path;
    },
        js = function js(t, e) {
      return t.map(function (t) {
        return Ps(t);
      }).indexOf(Ps(e));
    },
        Ns = function Ns(t) {
      var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = 4,
          r = 0,
          i = function i(t) {
        return (t instanceof File || t instanceof Blob) && (t = { source: "local_file_system", mimetype: t.type, name: t.name, path: t.name, size: t.size, originalFile: t }), t.uploadToken = Ls(16), t.progress = 0, t;
      },
          o = function o(t, e) {
        var n = function n(t) {
          var n = void 0;return t.some(function (t) {
            return t.uploadToken === e && (n = t, !0);
          }), n;
        };return n(t.waiting) || n(t.uploading) || n(t.done) || n(t.failed);
      },
          s = function s(t, e) {
        if (js(t.getters.filesWaiting, e) !== -1) return void t.commit("DESELECT_FILE", e);if (e.folder) return void t.dispatch("addCloudFolder", { name: e.source, path: e.path });var n = function n() {
          return t.getters.allFilesInQueueCount === t.getters.maxFiles && (t.dispatch("showNotification", "Our file upload limit is " + t.getters.maxFiles + " files"), t.commit("CHANGE_ROUTE", ["summary"]), !0);
        },
            r = function r(e) {
          return void 0 === t.getters.maxSize || e.size < t.getters.maxSize || !e.size || (t.dispatch("showNotification", "File " + xs(e) + " is too big. The accepted file size is less than " + t.getters.maxSize / 1e6 + " MB"), !1);
        },
            o = function o(e) {
          return !!Ss(e, t.getters.accept) || (t.dispatch("showNotification", "File " + xs(e) + " is not an accepted file type. The accepted file types are " + t.getters.accept), !1);
        },
            s = function s(e) {
          if (void 0 !== t.getters.onFileSelected) try {
            var n = t.getters.onFileSelected(Rs(e));return n && "string" == typeof n.name && (e.originalFile && (e.originalFile.newName = n.name), e.name = n.name), !0;
          } catch (e) {
            return t.dispatch("showNotification", e.message), !1;
          }return !0;
        },
            a = function a() {
          t.getters.startUploadingWhenMaxFilesReached === !0 && t.getters.filesWaiting.length === t.getters.maxFiles ? t.dispatch("startUploading", !0) : t.getters.uploadInBackground && t.dispatch("startUploading");
        };if (!n()) {
          var c = i(e);o(c) && s(c) && r(c) && (Is("Selected file:", e), t.commit("MARK_FILE_AS_WAITING", c), a());
        }
      },
          a = function a(e) {
        var i = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            o = function o() {
          return r < n && e.state.waiting.length > 0;
        },
            s = function s() {
          return 0 === r && 0 === e.state.waiting.length && 0 === e.state.uploading.length;
        },
            a = function a() {
          var n = e.state.waiting[0],
              i = void 0;if (n.tempStorage && !n.transformed) i = Promise.resolve(n.tempStorage);else if (n.transformed && !n.transformedFile) i = t.storeURL(n.transformed, e.getters.storeTo);else if (n.transformedFile) i = Promise.resolve(n.transformedFile);else if ("local_file_system" === n.source) {
            var o = { onProgress: function onProgress(t) {
                e.getters.uploadStarted && (e.commit("SET_FILE_UPLOAD_PROGRESS", { uploadToken: n.uploadToken, progress: t.totalProgressPercent }), void 0 !== e.getters.onFileUploadProgress && e.getters.onFileUploadProgress(Rs(n), t));
              } };i = t.upload(n.originalFile, o, e.getters.storeTo);
          } else if ("source-url" === n.source) i = t.storeURL(n.path, e.getters.storeTo);else {
            if ("cloud" !== n.sourceKind) throw new Error("Can't upload this file");i = e.getters.preferLinkOverStore ? t.cloud(n.source).link(n.path) : t.cloud(n.source).store(n.path, e.getters.storeTo);
          }return r += 1, e.commit("MARK_FILE_AS_UPLOADING", n), Is("Upload started:", n), void 0 !== e.getters.onFileUploadStarted && e.getters.onFileUploadStarted(Rs(n)), i.then(function (t) {
            var i = Sr({}, n, t);r -= 1, e.commit("MARK_FILE_AS_DONE", { file: n, uploadMetadata: i }), void 0 !== e.getters.onFileUploadFinished && e.getters.onFileUploadFinished(Rs(i)), Is("Upload done:", n);
          }).catch(function (t) {
            r -= 1, e.commit("MARK_FILE_AS_FAILED", n), void 0 !== e.getters.onFileUploadFailed && e.getters.onFileUploadFailed(Rs(n), t), t instanceof Error ? Is("Upload failed:", n, t.message) : Is("Upload failed:", n, t);
          }), i;
        },
            c = function t() {
          o() ? (a().then(t).catch(t), t()) : s() && e.getters.uploadStarted && e.dispatch("allUploadsDone");
        };e.getters.uploadStarted || (i && (e.commit("SET_UPLOAD_STARTED", !0), e.commit("CHANGE_ROUTE", ["summary"])), c());
      },
          c = function c(e, n) {
        if ("local_file_system" === e.source) return t.upload(e.originalFile, n.getters.storeTo);if ("cloud" === e.sourceKind) return t.cloud(e.source).store(e.path, n.getters.storeTo);throw new Error("Can't upload this file");
      },
          u = function u(t, e) {
        return new Promise(function (n) {
          var r = o(t.state, e),
              i = t.state.uploading.map(function (t) {
            return t.uploadToken;
          }),
              s = i.indexOf(e) !== -1;r.tempStorage ? n(r.tempStorage) : s ? !function () {
            var r = function r() {
              var i = o(t.state, e);if (i) {
                if (void 0 !== i.tempStorage) n(i.tempStorage);else {
                  var s = t.state.failed.map(function (t) {
                    return t.uploadToken;
                  }),
                      a = s.indexOf(e) !== -1;a || setTimeout(r, 100);
                }
              } else n(null);
            };r();
          }() : c(r, t).then(function (r) {
            var i = o(t.state, e);i && (t.commit("SET_FILE_TEMPORARY_STORAGE", { uploadToken: e, metadata: r }), r.uploadToken = e, n(r));
          });
        });
      };e = Sr({ uploadStarted: !1, waiting: [], uploading: [], done: [], failed: [], stagedForTransform: null }, e);var l = { SET_UPLOAD_STARTED: function SET_UPLOAD_STARTED(t, e) {
          t.uploadStarted = e;
        }, MARK_FILE_AS_WAITING: function MARK_FILE_AS_WAITING(t, e) {
          t.waiting.push(e);
        }, DESELECT_FILE: function DESELECT_FILE(t, e) {
          var n = js(t.waiting, e),
              r = js(t.uploading, e),
              i = js(t.done, e),
              o = js(t.failed, e),
              s = [n >= 0, r >= 0, i >= 0, o >= 0].indexOf(!0);switch (s) {case -1:
              throw new Error("Illegal operation for given file");case 0:
              t.waiting.splice(n, 1);break;case 1:
              t.uploading.splice(r, 1);break;case 2:
              t.done.splice(i, 1);break;case 3:
              t.failed.splice(o, 1);}
        }, DESELECT_FOLDER: function DESELECT_FOLDER(t, e) {
          var n = function n(t) {
            return t.filter(function (t) {
              return "cloud" !== t.sourceKind || t.path.indexOf(e.path) < 0;
            });
          };t.waiting = n(t.waiting), t.uploading = n(t.uploading), t.done = n(t.done), t.failed = n(t.failed);
        }, DESELECT_ALL_FILES: function DESELECT_ALL_FILES(t) {
          t.waiting.splice(0, t.waiting.length), t.uploading.splice(0, t.uploading.length), t.done.splice(0, t.done.length), t.failed.splice(0, t.failed.length);
        }, MARK_FILE_AS_UPLOADING: function MARK_FILE_AS_UPLOADING(t, e) {
          var n = js(t.waiting, e);if (n === -1) throw new Error("Illegal operation for given file");t.waiting.splice(n, 1), t.uploading.push(e);
        }, MARK_FILE_AS_DONE: function MARK_FILE_AS_DONE(t, e) {
          var n = e.file,
              r = e.uploadMetadata,
              i = js(t.uploading, n);i >= 0 && (t.uploading.splice(i, 1), t.done.push(n), n.transformed ? Mo.set(n, "transformedFile", r) : Mo.set(n, "tempStorage", r), Object.keys(r).forEach(function (t) {
            Mo.set(n, t, r[t]);
          }));
        }, MARK_FILE_AS_FAILED: function MARK_FILE_AS_FAILED(t, e) {
          var n = js(t.uploading, e);n >= 0 && (t.uploading.splice(n, 1), t.failed.push(e));
        }, SET_FILE_UPLOAD_PROGRESS: function SET_FILE_UPLOAD_PROGRESS(t, e) {
          var n = e.uploadToken,
              r = e.progress,
              i = o(t, n);Mo.set(i, "progress", r);
        }, SET_FILE_TEMPORARY_STORAGE: function SET_FILE_TEMPORARY_STORAGE(t, e) {
          var n = e.uploadToken,
              r = e.metadata,
              i = o(t, n);Mo.set(i, "tempStorage", r);
        }, SET_FILE_FOR_TRANSFORM: function SET_FILE_FOR_TRANSFORM(t, e) {
          t.stagedForTransform = e;
        }, SET_FILE_TRANSFORMATION: function SET_FILE_TRANSFORMATION(t, e) {
          var n = e.uploadToken,
              r = e.transformedUrl,
              i = o(t, n);Mo.set(i, "transformed", r);var s = js(t.done, i),
              a = js(t.failed, i),
              c = js(t.uploading, i),
              u = js(t.waiting, i);s >= 0 ? t.done.splice(s, 1) : c >= 0 ? t.uploading.splice(c, 1) : a >= 0 && t.failed.splice(s, 1), u < 0 && t.waiting.push(i);
        }, REMOVE_FILE_TRANSFORMATION: function REMOVE_FILE_TRANSFORMATION(t, e) {
          var n = o(t, e);Mo.delete(n, "transformed"), Mo.delete(n, "transformedFile");var r = js(t.done, n),
              i = js(t.failed, n),
              s = js(t.uploading, n),
              a = js(t.waiting, n);r >= 0 ? t.done.splice(r, 1) : s >= 0 ? t.uploading.splice(s, 1) : i >= 0 && t.failed.splice(r, 1), a < 0 && t.waiting.push(n);
        }, REMOVE_SOURCE_FROM_WAITING: function REMOVE_SOURCE_FROM_WAITING(t, e) {
          var n = t.waiting.filter(function (t) {
            return t.source !== e;
          });t.waiting = n;
        }, REMOVE_CLOUDS_FROM_WAITING: function REMOVE_CLOUDS_FROM_WAITING(t) {
          var e = t.waiting.filter(function (t) {
            return "cloud" !== t.sourceKind;
          });t.waiting = e;
        } },
          f = { addFile: s, startUploading: a, uploadFileToTemporaryLocation: u, removeTransformation: function removeTransformation(t, e) {
          t.commit("REMOVE_FILE_TRANSFORMATION", e.uploadToken);
        }, deselectAllFiles: function deselectAllFiles(t) {
          t.commit("DESELECT_ALL_FILES");
        }, deselectFolder: function deselectFolder(t, e) {
          t.commit("DESELECT_FOLDER", e);
        } },
          p = { filesWaiting: function filesWaiting(t, e) {
          return e.uploadStarted ? t.waiting : [].concat(t.waiting, t.uploading, t.done, t.failed).sort(function (t, e) {
            return t.size - e.size;
          });
        }, filesUploading: function filesUploading(t, e) {
          return e.uploadStarted ? t.uploading : [];
        }, filesDone: function filesDone(t) {
          return t.done;
        }, filesFailed: function filesFailed(t) {
          return t.failed;
        }, allFilesInQueue: function allFilesInQueue(t, e) {
          return e.uploadStarted ? [].concat(e.filesWaiting, e.filesUploading, e.filesDone, e.filesFailed) : e.filesWaiting;
        }, allFilesInQueueCount: function allFilesInQueueCount(t, e) {
          return e.uploadStarted ? e.filesWaiting.length + e.filesUploading.length + e.filesDone.length + e.filesFailed.length : e.filesWaiting.length;
        }, filesNeededCount: function filesNeededCount(t, e) {
          return e.minFiles - e.filesWaiting.length;
        }, uploadStarted: function uploadStarted(t) {
          return t.uploadStarted;
        }, canStartUpload: function canStartUpload(t, e) {
          return e.filesWaiting.length >= e.minFiles;
        }, canAddMoreFiles: function canAddMoreFiles(t, e) {
          return e.filesWaiting.length < e.maxFiles;
        }, stagedForTransform: function stagedForTransform(t) {
          return t.stagedForTransform;
        } };return { state: e, mutations: l, actions: f, getters: p };
    },
        Us = function Us(t) {
      var e = t.path.split("/");return e.pop(), t.folder ? t.path : e.join("/");
    },
        Ds = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return t.files.length > 0 ? n("div", { staticClass: "fsp-grid" }, [n("div", { staticClass: "fsp-grid__label" }, [t._v("Files & Folders")]), t._v(" "), t._l(t.onlyFolders, function (e) {
          return n("div", { staticClass: "fsp-grid__cell", class: { "fsp-grid__cell--selected": t.isSelected(e) }, on: { click: function click(n) {
                t.handleFolderClick(e);
              } } }, [t.isSelected(e) ? n("span", { staticClass: "fsp-badge fsp-badge--bright fsp-badge--file" }, [t._v(t._s(t.getFileCount(e)))]) : n("span", { staticClass: "fsp-grid__icon", class: t.getIconClass("fsp-grid__icon-folder", e) }), t._v(" "), n("span", { staticClass: "fsp-grid__text", class: { "fsp-grid__text--selected": t.isSelected(e) } }, [t._v(t._s(e.name))]), t._v(" "), t.isSelected(e) ? n("span", { staticClass: "fsp-grid__icon--selected", attrs: { title: "Deselect folder" }, on: { click: function click(n) {
                n.stopPropagation(), t.deselectFolder(e);
              } } }) : t._e(), t._v(" "), t.isLoading(e) || t.isSelected(e) ? t._e() : n("span", { staticClass: "fsp-grid__icon-folder-add", attrs: { title: "Add folder" }, on: { click: function click(n) {
                n.stopPropagation(), t.addFile(e);
              } } }), t._v(" "), t.isLoading(e) ? n("div", { staticClass: "fsp-loading--folder" }) : t._e()]);
        }), t._v(" "), t._l(t.onlyFiles, function (e) {
          return n("div", { staticClass: "fsp-grid__cell", class: { "fsp-grid__cell--selected": t.isSelected(e) }, on: { click: function click(n) {
                t.addFile(e);
              } } }, [t.isAudio(e) ? n("span", { staticClass: "fsp-grid__icon", class: t.getIconClass("fsp-grid__icon-audio", e) }) : "application/pdf" === e.mimetype ? n("span", { staticClass: "fsp-grid__icon", class: t.getIconClass("fsp-grid__icon-pdf", e) }) : "application/zip" === e.mimetype ? n("span", { staticClass: "fsp-grid__icon", class: t.getIconClass("fsp-grid__icon-zip", e) }) : n("span", { staticClass: "fsp-grid__icon", class: t.getIconClass("fsp-grid__icon-file", e) }), t._v(" "), n("span", { staticClass: "fsp-grid__text", class: { "fsp-grid__text--selected": t.isSelected(e) } }, [t._v(t._s(e.name))]), t._v(" "), t.isSelected(e) ? n("span", { staticClass: "fsp-grid__icon--selected" }) : t._e()]);
        })], 2) : t._e();
      }, staticRenderFns: [], computed: Sr({}, fs.mapGetters(["cloudFolders", "filesWaiting"]), { onlyFolders: function onlyFolders() {
          return this.files.filter(function (t) {
            return t.folder;
          });
        }, onlyFiles: function onlyFiles() {
          return this.files.filter(function (t) {
            return !t.folder;
          });
        } }), methods: Sr({}, fs.mapActions(["addFile", "deselectFolder", "goToDirectory"]), { handleFolderClick: function handleFolderClick(t) {
          this.goToDirectory(t);
        }, getIconClass: function getIconClass(t, e) {
          var n;return n = {}, Ar(n, t, !this.isSelected(e)), Ar(n, t + "--selected", this.isSelected(e)), n;
        }, isAudio: function isAudio(t) {
          return t && t.mimetype && t.mimetype.indexOf("audio/") !== -1;
        }, isLoading: function isLoading(t) {
          return !!t.folder && this.cloudFolders[t.path] && this.cloudFolders[t.path].loading;
        }, isSelected: function isSelected(t) {
          return t.folder ? this.filesWaiting.filter(function (e) {
            return Us(e) === t.path;
          }).length > 0 : js(this.filesWaiting, t) !== -1;
        }, getFileCount: function getFileCount(t) {
          return this.filesWaiting.filter(function (e) {
            return Us(e) === t.path;
          }).length;
        } }), props: ["files"] },
        $s = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return t.images && t.images.length > 0 ? n("div", { staticClass: "fsp-grid" }, [n("div", { staticClass: "fsp-grid__label" }, [t._v("Images")]), t._v(" "), t._l(t.images, function (e) {
          return n("div", { key: e.path, staticClass: "fsp-image-grid__cell", class: { "fsp-image-grid__cell--selected": t.isSelected(e) }, on: { click: function click(n) {
                t.addFile(e);
              } } }, [t.isSelected(e) ? n("span", { staticClass: "fsp-image-grid__icon--selected" }) : t._e(), t._v(" "), n("img", { staticClass: "fsp-image-grid__image", class: { "fsp-image-grid__image--selected": t.isSelected(e) }, attrs: { src: e.thumbnail, alt: e.name } }), t._v(" "), t.isSelected(e) ? n("div", { staticClass: "fsp-image-grid__cell--dark" }) : t._e()]);
        })], 2) : t._e();
      }, staticRenderFns: [], computed: Sr({}, fs.mapGetters(["filesWaiting"])), methods: Sr({}, fs.mapActions(["addFile"]), { isSelected: function isSelected(t) {
          return js(this.filesWaiting, t) !== -1;
        } }), props: ["images"] },
        Ms = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", [n("file-array", { attrs: { files: t.arrayOfFiles } }), t._v(" "), t.arrayOfFiles.length && t.arrayOfImages.length ? n("hr", { staticClass: "fsp-grid__separator" }) : t._e(), t._v(" "), n("image-array", { attrs: { images: t.arrayOfImages } })], 1);
      }, staticRenderFns: [], components: { FileArray: Ds, ImageArray: $s }, computed: Sr({}, fs.mapGetters(["listForCurrentCloudPath"]), { arrayOfImages: function arrayOfImages() {
          return this.listForCurrentCloudPath.filter(this.isImage);
        }, arrayOfFiles: function arrayOfFiles() {
          var t = this;return this.listForCurrentCloudPath.filter(function (e) {
            return !t.isImage(e);
          });
        } }), methods: { isImage: function isImage(t) {
          return t && t.mimetype && t.mimetype.indexOf("image/") !== -1;
        } } },
        Hs = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fsp-breadcrumb__container" }, [t.crumbs.length < 3 ? n("span", t._l(t.crumbs, function (e) {
          return n("span", { staticClass: "fsp-breadcrumb__label", on: { click: function click(n) {
                t.handleClick(e);
              } } }, [t._v("\n      " + t._s(e.label) + "\n    ")]);
        })) : n("span", t._l(t.truncateCrumbs(t.crumbs), function (e) {
          return n("span", { staticClass: "fsp-breadcrumb__label", on: { click: function click(n) {
                t.handleClick(e);
              } } }, [t._v("\n      " + t._s(e.label) + "\n    ")]);
        }))]);
      }, staticRenderFns: [], props: ["crumbs", "onClick"], methods: { truncateCrumbs: function truncateCrumbs(t) {
          var e = [t[0]],
              n = t.filter(function (e, n) {
            return n >= t.length - 2;
          });return e.push.apply(e, [{ path: "", label: "..." }].concat(Rr(n))), e;
        }, handleClick: function handleClick(t) {
          t.path && t.label && this.onClick(t);
        } } },
        Ws = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fsp-loading" });
      }, staticRenderFns: [] },
        zs = function zs(t) {
      var e = null == t ? 0 : t.length;return e ? t[e - 1] : void 0;
    },
        Vs = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fsp-cloud", class: { "fsp-content--selected-items": t.filesWaiting.length } }, [t.cloudLoading || t.isPrefetching ? n("loading") : t._e(), t._v(" "), t.currentCloudAuthorized !== !0 ? n("div", { staticClass: "fsp-source-auth__wrapper" }, [n("span", { staticClass: "fsp-icon-auth fsp-icon fsp-source-auth__el", class: "fsp-icon--" + t.currentCloudName }), t._v(" "), n("div", { staticClass: "fsp-text__title fsp-source-auth__el" }, [t._v(t._s(t.t("Select Files from")) + " " + t._s(t.currentDisplay.label))]), t._v(" "), n("div", { staticClass: "fsp-source-auth__el" }, [n("span", { staticClass: "fsp-text__subheader" }, [t._v("\n        " + t._s(t.t("You need to authenticate with ")) + "\n        "), n("span", { staticClass: "fsp-cloudname" }, [t._v(t._s(t.currentDisplay.label))]), t._v(".\n        " + t._s(t.t("We only extract images and never modify or delete them.")) + "\n      ")])]), t._v(" "), n("button", { staticClass: "fsp-button__auth fsp-source-auth__el", attrs: { type: "button" }, on: { click: t.authorize } }, [t._v("\n      " + t._s(t.t("Connect")) + " "), n("span", { staticClass: "fsp-cloudname" }, [t._v(t._s(t.currentDisplay.label))])]), t._v(" "), n("div", { staticClass: "fsp-source-auth__el" }, [n("span", { staticClass: "fsp-text__subheader" }, [t._v("\n        " + t._s(t.t("A new page will open to connect your account.")) + "\n      ")])])]) : t._e(), t._v(" "), t.currentCloudAuthorized === !0 ? n("div", [t.currentCrumbs.length > 1 ? n("div", { staticClass: "fsp-cloud-breadcrumbs" }, [n("breadcrumbs", { attrs: { crumbs: t.currentCrumbs, onClick: t.updatePath } })], 1) : t._e(), t._v(" "), n("cloud-grid")], 1) : t._e()], 1);
      }, staticRenderFns: [], components: { CloudGrid: Ms, Breadcrumbs: Hs, Loading: Ws }, computed: Sr({}, fs.mapGetters(["route", "currentCloudAuthorized", "currentCloudName", "currentCloudPath", "listForCurrentCloudPath", "cloudFolders", "cloudLoading", "cloudPrefetching", "filesWaiting"]), { isPrefetching: function isPrefetching() {
          var t = this.currentCloudPath,
              e = t.length > 0 ? zs(t) : t,
              n = this.currentCloudName + e;return this.cloudPrefetching[n];
        }, currentDisplay: function currentDisplay() {
          var t = this.route[1];return bs(t);
        }, currentCrumbs: function currentCrumbs() {
          var t = this,
              e = [{ label: this.currentDisplay.label, path: "root" }];return this.currentCloudPath.length ? e.concat(this.currentCloudPath.map(function (e) {
            return { label: t.cloudFolders[e].name, path: e };
          })) : e;
        } }), methods: Sr({}, fs.mapActions(["showCloudPath"]), { authorize: function authorize() {
          var t = this,
              e = window.open(this.currentCloudAuthorized.authUrl, "_blank"),
              n = function n() {
            e.closed !== !0 ? setTimeout(n, 10) : t.showCloudPath({ name: t.route[1], path: t.route[2] });
          };n();
        }, updatePath: function updatePath(t) {
          var e = this.currentCloudPath.indexOf(t.path),
              n = this.currentCloudPath.filter(function (t, n) {
            return n <= e;
          }),
              r = ["source", this.currentCloudName];"root" === t.path ? this.$store.commit("CHANGE_ROUTE", r) : (r.push(n), this.$store.commit("CHANGE_ROUTE", r));
        } }), watch: { route: { deep: !0, immediate: !0, handler: function handler(t) {
            var e = t[1],
                n = t[2];this.showCloudPath({ name: e, path: n });
          } } } },
        Bs = function Bs(t) {
      var e = new RegExp("Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile", "i");
      return e.test(t);
    },
        Gs = function Gs(t) {
      return JSON.parse(JSON.stringify(t));
    },
        Ys = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fsp-mobile-menu", on: { click: function click(e) {
              t.toggleNav();
            } } }, [n("div", { staticClass: "fsp-nav__menu-toggle" })]);
      }, staticRenderFns: [], computed: Sr({}, fs.mapGetters(["mobileNavActive", "route"]), { hideLocalOnMobile: function hideLocalOnMobile() {
          var t = Gs(this.route),
              e = t.pop();return !(!Bs(navigator.userAgent) || e.indexOf("local_file_system") === -1) || !this.mobileNavActive;
        } }), methods: Sr({}, fs.mapActions(["updateMobileNavActive"]), { toggleNav: function toggleNav() {
          this.updateMobileNavActive(this.hideLocalOnMobile);
        } }) },
        Xs = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fsp-header", class: { "fsp-hide-header": t.hideHeader } }, [t.sourceName && !t.mobileNavActive ? n("span", { staticClass: "fsp-header-icon", class: "fsp-navbar--" + t.sourceName }) : t._e(), t._v(" "), t.mobileNavActive ? n("span", { staticClass: "fsp-header-text" }, [t._v(" Select From ")]) : t._e(), t._v(" "), t._t("default"), t._v(" "), n("mobile-menu-button")], 2);
      }, staticRenderFns: [], computed: Sr({}, fs.mapGetters(["mobileNavActive"])), components: { MobileMenuButton: Ys }, props: ["sourceName", "hideHeader"] },
        qs = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fsp-footer", class: { "fsp-footer--appeared": t.isVisible } }, [n("div", { staticClass: "fsp-nav" }, [n("span", { staticClass: "fsp-nav__left" }, [t._t("nav-left")], 2), t._v(" "), n("span", { staticClass: "fsp-nav__center" }, [t._t("nav-center")], 2), t._v(" "), n("span", { staticClass: "fsp-nav__right" }, [t._t("nav-right")], 2)])]);
      }, staticRenderFns: [], props: ["isVisible"] },
        Qs = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fsp-image-search", class: { "fsp-image-search--results": t.resultsFound } }, [n("div", { staticClass: "fsp-image-search__form-container" }, [n("form", { staticClass: "fsp-image-search__form", on: { submit: function submit(e) {
              e.preventDefault(), t.focusAndFetch(e);
            } } }, [n("input", { ref: "searchInput", staticClass: "fsp-image-search__input", attrs: { placeholder: t.placeholderText, autofocus: "", disabled: t.isSearching }, domProps: { value: t.imageSearchInput }, on: { input: t.updateInput } }), t._v(" "), t.imageSearchInput === t.imageSearchName ? n("button", { staticClass: "fsp-image-search__submit", on: { click: function click(e) {
              e.preventDefault(), t.clearSearch(e);
            } } }, [n("span", { staticClass: "fsp-image-search__icon--reset" })]) : t._e(), t._v(" "), t.imageSearchInput !== t.imageSearchName ? n("button", { staticClass: "fsp-image-search__submit", attrs: { type: "submit" } }, [n("span", { class: { "fsp-image-search__icon--search": !0, "fsp-image-search__icon--searching": t.isSearching } })]) : t._e()])]), t._v(" "), n("div", { staticClass: "fsp-image-search__results", class: { "fsp-content--selected-items": t.filesWaiting.length } }, [n("image-array", { attrs: { images: t.imageSearchResults } })], 1)]);
      }, staticRenderFns: [], components: { ImageArray: $s }, computed: Sr({}, fs.mapGetters(["isSearching", "noResultsFound", "resultsFound", "imageSearchName", "imageSearchInput", "imageSearchResults", "filesWaiting"]), { placeholderText: function placeholderText() {
          return this.t("Search images") + "...";
        } }), methods: Sr({}, fs.mapActions(["updateSearchInput", "fetchImages"]), { focusAndFetch: function focusAndFetch() {
          this.fetchImages(), this.$refs.searchInput.focus();
        }, updateInput: function updateInput(t) {
          this.updateSearchInput(t.target.value);
        }, clearSearch: function clearSearch() {
          this.updateSearchInput(""), this.$refs.searchInput.focus();
        } }) },
        Ks = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fsp-select-labels", class: { active: t.selectLabelIsActive } }, [n("div", { staticClass: "fsp-drop-area__title fsp-text__title" }, [t._v("\n      " + t._s(t.t("Select Files to Upload")) + "\n  ")]), t._v(" "), n("div", { staticClass: "fsp-drop-area__subtitle fsp-text__subheader" }, [t._v("\n      " + t._s(t.t("or Drag and Drop, Copy and Paste Files")) + "\n  ")])]);
      }, staticRenderFns: [], computed: Sr({}, fs.mapGetters(["selectLabelIsActive"])) },
        Js = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", [n("div", { ref: "dropArea", staticClass: "fsp-drop-area", on: { click: t.openSelectFile } }, [n("select-files-label"), t._v(" "), n("input", { ref: "fileUploadInput", staticClass: "fsp-local-source__fileinput", attrs: { type: "file", id: "fsp-fileUpload", accept: t.acceptStr, multiple: t.multiple, disabled: !t.canAddMoreFiles }, on: { change: function change(e) {
              t.onFilesSelected(e);
            }, click: function click(e) {
              t.clearEvent(e);
            } } })], 1)]);
      }, staticRenderFns: [], components: { SelectFilesLabel: Ks }, computed: Sr({}, fs.mapGetters(["accept", "canAddMoreFiles", "maxFiles"]), { acceptStr: function acceptStr() {
          if (this.accept) return this.accept.join(",");
        }, multiple: function multiple() {
          return this.maxFiles > 1;
        } }), methods: Sr({}, fs.mapActions(["addFile", "updateSelectLabelActive"]), { clearEvent: function clearEvent(t) {
          t.target.value = null;
        }, onMouseover: function onMouseover() {
          this.updateSelectLabelActive(!0);
        }, onMouseout: function onMouseout() {
          this.updateSelectLabelActive(!1);
        }, onFilesSelected: function onFilesSelected(t) {
          for (var e = t.target.files, n = 0; n < e.length; n += 1) {
            this.addFile(e[n]);
          }
        }, openSelectFile: function openSelectFile() {
          this.$refs.fileUploadInput.click();
        } }), mounted: function mounted() {
        var t = this.$refs.dropArea;t.addEventListener("mouseover", this.onMouseover), t.addEventListener("mouseout", this.onMouseout);
      } },
        Zs = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fsp-source-list__item", class: { active: t.isSelectedSource, hidden: t.isHidden, disabled: t.uploadStarted }, on: { click: function click(e) {
              t.onNavClick(t.sourceName);
            } } }, [t.sourceSelectedCount(t.filesWaiting) ? n("span", { staticClass: "fsp-badge--source" }, [t._v(t._s(t.sourceSelectedCount(t.filesWaiting)))]) : t._e(), t._v(" "), n("span", { staticClass: "fsp-source-list__icon fsp-icon", class: "fsp-icon--" + t.sourceName }), t._v(" "), n("span", { staticClass: "fsp-source-list__label" }, [t._v(t._s(t.sourceLabel))]), t._v(" "), t.isAuthorized ? n("span", { staticClass: "fsp-source-list__logout", on: { click: function click(e) {
              e.stopPropagation(), t.logout(t.sourceName);
            } } }, [t._v(" Sign Out")]) : t._e(), t._v(" "), t.isMobileLocal ? n("input", { ref: "mobileLocaInput", staticClass: "fsp-local-source__fileinput", attrs: { type: "file" }, on: { change: function change(e) {
              t.onFilesSelected(e);
            } } }) : t._e()]);
      }, staticRenderFns: [], props: ["sourceName", "sourceLabel", "isHidden"], computed: Sr({}, fs.mapGetters(["filesWaiting", "route", "uploadStarted", "cloudsAuthorized", "mobileNavActive", "maxFiles", "accept"]), { isSelectedSource: function isSelectedSource() {
          if ("summary" === this.route[0]) return !1;var t = this.route.length > 1 ? this.route[1] : "local_file_system";return t === this.sourceName;
        }, isAuthorized: function isAuthorized() {
          return this.cloudsAuthorized[this.sourceName];
        }, isMobileLocal: function isMobileLocal() {
          return this.mobileNavActive && "local_file_system" === this.sourceName;
        } }), methods: Sr({}, fs.mapActions(["updateMobileNavActive", "addFile", "logout"]), { onNavClick: function onNavClick(t) {
          this.isMobileLocal ? this.openSelectFile() : (this.updateMobileNavActive(!1), this.$store.commit("CHANGE_ROUTE", ["source", t]));
        }, sourceSelectedCount: function sourceSelectedCount(t) {
          var e = this,
              n = t.filter(function (t) {
            return t.source === e.sourceName;
          });return n.length;
        }, openSelectFile: function openSelectFile() {
          this.$refs.mobileLocaInput.click();
        }, onFilesSelected: function onFilesSelected(t) {
          for (var e = t.target.files, n = 0; n < e.length; n += 1) {
            this.addFile(e[n]);
          }
        } }) },
        ta = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fsp-modal__sidebar", class: { "fsp-mobile-nav-active": t.mobileNavActive } }, [n("div", { staticClass: "fsp-source-list" }, [t._l(t.paginatedSources, function (t, e) {
          return n("source-nav-item", { key: t.name, attrs: { isHidden: t.isHidden, sourceName: t.name, sourceLabel: t.label } });
        }), t._v(" "), t.fromSources.length > 8 ? n("div", { staticClass: "fsp-source-list__item fsp-source-list__more", on: { click: t.updateIndex } }, [n("span", { staticClass: "fsp-source-list__icon fsp-source-list__more-icon" }), t._v(" "), n("span", { staticClass: "fsp-source-list__label" }, [t._v("More")])]) : t._e()], 2)]);
      }, staticRenderFns: [], components: { SourceNavItem: Zs }, computed: Sr({}, fs.mapGetters(["fromSources", "mobileNavActive"]), { paginatedSources: function paginatedSources() {
          var t = this;return this.fromSources.map(function (e, n) {
            return n >= t.index && n <= t.index + t.offset ? e : Sr({}, e, { isHidden: !0 });
          });
        } }), data: function data() {
        return { offset: 7, index: 0 };
      }, methods: { updateIndex: function updateIndex() {
          var t = this.paginatedSources.filter(function (t) {
            return !t.isHidden;
          });t.length <= this.offset ? this.index = 0 : this.index = this.index + (this.offset + 1);
        } } },
        ea = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fsp-picker" }, [n("close-button"), t._v(" "), n("div", { staticClass: "fsp-modal" }, [n("sidebar"), t._v(" "), n("div", { staticClass: "fsp-modal__body" }, [n("div", { staticClass: "fsp-container" }, [t.isInsideCloudFolder ? n("div", { staticClass: "fsp-summary__go-back", attrs: { title: "Go back" }, on: { click: t.goBack } }) : t._e(), t._v(" "), n("content-header", { attrs: { sourceName: t.currentSource.name, hideHeader: t.showsHeaderIcon } }), t._v(" "), n("div", { staticClass: "fsp-content" }, ["local" === t.currentSource.ui ? n("local") : t._e(), t._v(" "), "cloud" === t.currentSource.ui ? n("cloud") : t._e(), t._v(" "), "imagesearch" === t.currentSource.ui ? n("image-search") : t._e()], 1)], 1), t._v(" "), n("footer-nav", { attrs: { isVisible: t.filesWaiting.length > 0 } }, [n("span", { staticClass: "fsp-footer-text", slot: "nav-left" }, [t._v("Selected Files: " + t._s(t.filesWaiting.length))]), t._v(" "), t.canStartUpload || 0 === t.filesWaiting.length ? t._e() : n("span", { slot: "nav-center" }, [t._v(" " + t._s(t.getMinFilesMessage) + " ")]), t._v(" "), n("span", { staticClass: "fsp-button fsp-button--primary", class: { "fsp-button--disabled": !t.canStartUpload }, attrs: { title: "Next" }, on: { click: t.goToSummary }, slot: "nav-right" }, [t._v("\n            View/Edit Selected\n        ")])])], 1)], 1), t._v(" "), t._m(0)], 1);
      }, staticRenderFns: [function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fsp-picker__footer" }, [t._v("\n    Powered by "), n("span", { staticClass: "fsp-icon--filestack" }), t._v(" Filestack\n  ")]);
      }], components: { CloseButton: Cs, Cloud: Vs, ContentHeader: Xs, FooterNav: qs, ImageSearch: Qs, Local: Js, Sidebar: ta }, computed: Sr({}, fs.mapGetters(["route", "filesWaiting", "cloudLoading", "currentCloudPath", "currentCloudAuthorized", "minFiles", "canStartUpload", "filesNeededCount", "mobileNavActive"]), { currentSource: function currentSource() {
          var t = this.route[1];return bs(t);
        }, getMinFilesMessage: function getMinFilesMessage() {
          return 1 === this.filesNeededCount ? "Add 1 more file" : this.filesNeededCount > 1 ? "Add " + this.filesNeededCount + " more files" : null;
        }, showsHeaderIcon: function showsHeaderIcon() {
          return "imagesearch" !== this.currentSource.ui && "source-url" !== this.currentSource.ui && ("local" === this.currentSource.ui || this.currentCloudAuthorized !== !0);
        }, isInsideCloudFolder: function isInsideCloudFolder() {
          return "cloud" === this.currentSource.ui && void 0 !== this.currentCloudPath && 0 !== this.currentCloudPath.length && !this.mobileNavActive;
        } }), methods: Sr({}, fs.mapActions(["deselectAllFiles", "goBack", "updateMobileNavActive"]), { goToSummary: function goToSummary() {
          this.canStartUpload && (this.$store.commit("CHANGE_ROUTE", ["summary"]), this.updateMobileNavActive(!1));
        } }) },
        na = "Expected a function",
        ra = NaN,
        ia = "[object Symbol]",
        oa = /^\s+|\s+$/g,
        sa = /^[-+]0x[0-9a-f]+$/i,
        aa = /^0b[01]+$/i,
        ca = /^0o[0-7]+$/i,
        ua = parseInt,
        la = "object" == Tr(kr) && kr && kr.Object === Object && kr,
        fa = "object" == ("undefined" == typeof self ? "undefined" : Tr(self)) && self && self.Object === Object && self,
        pa = la || fa || Function("return this")(),
        da = Object.prototype,
        ha = da.toString,
        ma = Math.max,
        va = Math.min,
        _a = function _a() {
      return pa.Date.now();
    },
        ga = Hn,
        ya = Vo.context("transformer"),
        ba = function ba(t) {
      return t + "px";
    },
        Ca = { topLeftX: "bottomRightX", topLeftY: "bottomRightY", bottomRightX: "topLeftX", bottomRightY: "topLeftY" },
        Ea = 40,
        wa = function wa(t, e, n, r) {
      var i = t.imageNaturalWidth / (e.imageWidth - e.imageX),
          o = t.imageNaturalHeight / (e.imageHeight - e.imageY),
          s = { x: Math.round((n.topLeftX - e.imageX) * i), y: Math.round((n.topLeftY - e.imageY) * o), width: Math.round((n.bottomRightX - n.topLeftX) * i), height: Math.round((n.bottomRightY - n.topLeftY) * o) };n.topLeftX === e.imageX && n.topLeftY === e.imageY && n.bottomRightX === e.imageWidth && n.bottomRightY === e.imageHeight || r.commit("SET_TRANSFORMATION", { type: "crop", options: { dim: s } });
    },
        ka = ga(function (t, e, n, r) {
      return wa(t, e, n, r);
    }, 500),
        Ta = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", [n("div", { directives: [{ name: "show", rawName: "v-show", value: !t.cachedCropRectangle, expression: "!cachedCropRectangle" }], staticStyle: { position: "absolute", top: "0", left: "0" } }, [n("div", { ref: "cropArea", staticClass: "fst-crop__area", style: t.cropAreaStyle }, [n("div", { staticClass: "fst-crop__area-line--right" }), t._v(" "), n("div", { staticClass: "fst-crop__area-line--left" }), t._v(" "), n("div", { staticClass: "fst-crop__area-line--top" }), t._v(" "), n("div", { staticClass: "fst-crop__area-line--bottom" })]), t._v(" "), n("div", { ref: "topLeftMarker", staticClass: "fst-crop__marker fst-crop__marker--top-left", style: t.topLeftStyle }), t._v(" "), n("div", { ref: "topRightMarker", staticClass: "fst-crop__marker fst-crop__marker--top-right", style: t.topRightStyle }), t._v(" "), n("div", { ref: "bottomLeftMarker", staticClass: "fst-crop__marker fst-crop__marker--bottom-left", style: t.bottomLeftStyle }), t._v(" "), n("div", { ref: "bottomRightMarker", staticClass: "fst-crop__marker fst-crop__marker--bottom-right", style: t.bottomRightStyle })]), t._v(" "), t.cachedCropRectangle ? n("div", { staticClass: "fst-options-bar", staticStyle: { left: "0", "padding-bottom": "20px" } }, [n("div", { staticClass: "fst-options__option" }, [n("div", { staticClass: "fst-button fst-button--cancel", staticStyle: { "font-weight": "500" }, on: { click: t.undoCrop } }, [t._v("Undo Crop")])])]) : t._e()]);
      }, staticRenderFns: [], props: { imageWidth: Number, imageHeight: Number, imageX: Number, imageY: Number }, data: function data() {
        return { cropRectangle: { topLeftX: 0, topLeftY: 0, bottomRightX: 0, bottomRightY: 0 } };
      }, computed: Sr({}, fs.mapGetters(["imageNaturalWidth", "imageNaturalHeight", "cachedCropRectangle"]), { aspectRatio: function aspectRatio() {
          return this.$store.getters.cropAspectRatio;
        }, topLeftStyle: function topLeftStyle() {
          var t = this.$refs.topLeftMarker && this.$refs.topLeftMarker.getBoundingClientRect().width / 2,
              e = this.cropRectangle.topLeftX - t,
              n = this.cropRectangle.topLeftY - t;return { top: ba(n), left: ba(e) };
        }, topRightStyle: function topRightStyle() {
          var t = this.$refs.topRightMarker && this.$refs.topRightMarker.getBoundingClientRect().width / 2,
              e = this.cropRectangle.bottomRightX - t,
              n = this.cropRectangle.topLeftY - t;return { top: ba(n), left: ba(e) };
        }, bottomLeftStyle: function bottomLeftStyle() {
          var t = this.$refs.bottomLeftMarker && this.$refs.bottomLeftMarker.getBoundingClientRect().width / 2,
              e = this.cropRectangle.topLeftX - t,
              n = this.cropRectangle.bottomRightY - t;return { top: ba(n), left: ba(e) };
        }, bottomRightStyle: function bottomRightStyle() {
          var t = this.$refs.bottomRightMarker && this.$refs.bottomRightMarker.getBoundingClientRect().width / 2,
              e = this.cropRectangle.bottomRightX - t,
              n = this.cropRectangle.bottomRightY - t;return { top: ba(n), left: ba(e) };
        }, cropAreaStyle: function cropAreaStyle() {
          var t = this.cropRectangle.topLeftX,
              e = this.cropRectangle.topLeftY,
              n = this.cropRectangle.bottomRightX - this.cropRectangle.topLeftX,
              r = this.cropRectangle.bottomRightY - this.cropRectangle.topLeftY;return { left: ba(t), top: ba(e), width: ba(n), height: ba(r) };
        } }), watch: { imageWidth: function imageWidth() {
          this.imageWidth > 0 && this.imageHeight > 0 && this.initialize();
        }, imageHeight: function imageHeight() {
          this.imageWidth > 0 && this.imageHeight > 0 && this.initialize();
        }, cropRectangle: { deep: !0, handler: function handler() {
            var t = { imageNaturalWidth: this.imageNaturalWidth, imageNaturalHeight: this.imageNaturalHeight },
                e = { imageWidth: this.imageWidth, imageHeight: this.imageHeight, imageX: this.imageX, imageY: this.imageY };ka(t, e, this.cropRectangle, this.$store);
          } } }, methods: Sr({}, fs.mapActions(["performTransformations"]), { calculateRectangleMaintainingAspectRatio: function calculateRectangleMaintainingAspectRatio(t, e) {
          var n = { w: t, h: t / this.aspectRatio },
              r = { w: e * this.aspectRatio, h: e },
              i = Math.sqrt(n.w * n.w + n.h * n.h),
              o = Math.sqrt(r.w * r.w + r.h * r.h);return i < o ? n : r;
        }, ensurePointWithinBoundsX: function ensurePointWithinBoundsX(t, e) {
          if ("topLeftX" === e) {
            if (t < this.imageX) return this.imageX;if (t >= this.cropRectangle.bottomRightX) return this.cropRectangle.bottomRightX - 1;
          } else if ("bottomRightX" === e) {
            if (t <= this.cropRectangle.topLeftX) return this.cropRectangle.topLeftX + 1;if (t > this.imageWidth) return this.imageWidth;
          }return t;
        }, ensurePointWithinBoundsY: function ensurePointWithinBoundsY(t, e) {
          if ("topLeftY" === e) {
            if (t < this.imageY) return this.imageY;if (t >= this.cropRectangle.bottomRightY) return this.cropRectangle.bottomRightY - 1;
          } else if ("bottomRightY" === e) {
            if (t <= this.cropRectangle.topLeftY) return this.cropRectangle.topLeftY + 1;if (t > this.imageHeight) return this.imageHeight;
          }return t;
        }, addMarkerBehaviour: function addMarkerBehaviour(t, e, n) {
          var r = this,
              i = function i(t) {
            t.preventDefault();var i = t.touches ? t.touches[0] : t,
                o = i.clientX - r.cropRectangle[e],
                s = i.clientY - r.cropRectangle[n],
                a = function a(t) {
              var i = t.touches ? t.touches[0] : t,
                  a = void 0,
                  c = void 0,
                  u = r.ensurePointWithinBoundsX(i.clientX - o, e),
                  l = r.ensurePointWithinBoundsY(i.clientY - s, n),
                  f = Ca[e],
                  p = Ca[n],
                  d = Math.abs(u - r.cropRectangle[f]),
                  h = Math.abs(l - r.cropRectangle[p]);d < Ea && (d = Ea), h < Ea && (h = Ea);var m = { w: d, h: h };void 0 !== r.aspectRatio && (m = r.calculateRectangleMaintainingAspectRatio(d, h)), a = u < r.cropRectangle[f] ? r.cropRectangle[f] - m.w : r.cropRectangle[f] + m.w, c = l < r.cropRectangle[p] ? r.cropRectangle[p] - m.h : r.cropRectangle[p] + m.h, r.cropRectangle[e] = a, r.cropRectangle[n] = c;
            },
                c = function t() {
              document.documentElement.removeEventListener("mousemove", a, !1), document.documentElement.removeEventListener("mouseup", t, !1), document.documentElement.removeEventListener("mouseleave", t, !1), document.documentElement.removeEventListener("touchmove", a, !1), document.documentElement.removeEventListener("touchend", t, !1), document.documentElement.removeEventListener("touchleave", t, !1);
            };document.documentElement.addEventListener("mousemove", a, !1), document.documentElement.addEventListener("mouseup", c, !1), document.documentElement.addEventListener("mouseleave", c, !1), document.documentElement.addEventListener("touchmove", a, !1), document.documentElement.addEventListener("touchend", c, !1), document.documentElement.addEventListener("touchleave", c, !1);
          };t.addEventListener("mousedown", i, !1), t.addEventListener("touchstart", i, !1);
        }, addMoveSelectionBehaviour: function addMoveSelectionBehaviour() {
          var t = this,
              e = function e(_e3) {
            _e3.preventDefault();var n = _e3.touches ? _e3.touches[0] : _e3,
                r = n.clientX - t.cropRectangle.topLeftX,
                i = n.clientY - t.cropRectangle.topLeftY,
                o = t.cropRectangle.bottomRightX - t.cropRectangle.topLeftX,
                s = t.cropRectangle.bottomRightY - t.cropRectangle.topLeftY,
                a = function a(e) {
              var n = e.touches ? e.touches[0] : e,
                  a = n.clientX - r,
                  c = n.clientY - i;a < t.imageX ? a = t.imageX : a + o > t.imageWidth && (a = t.imageWidth - o), c < t.imageY ? c = t.imageY : c + s > t.imageHeight && (c = t.imageHeight - s), t.cropRectangle.topLeftX = a, t.cropRectangle.topLeftY = c, t.cropRectangle.bottomRightX = a + o, t.cropRectangle.bottomRightY = c + s;
            },
                c = function t() {
              document.documentElement.removeEventListener("mousemove", a, !1), document.documentElement.removeEventListener("mouseup", t, !1), document.documentElement.removeEventListener("mouseleave", t, !1), document.documentElement.removeEventListener("touchmove", a, !1), document.documentElement.removeEventListener("touchend", t, !1), document.documentElement.removeEventListener("touchleave", t, !1);
            };document.documentElement.addEventListener("mousemove", a, !1), document.documentElement.addEventListener("mouseup", c, !1), document.documentElement.addEventListener("mouseleave", c, !1), document.documentElement.addEventListener("touchmove", a, !1), document.documentElement.addEventListener("touchend", c, !1), document.documentElement.addEventListener("touchleave", c, !1);
          };this.$refs.cropArea.addEventListener("mousedown", e, !1), this.$refs.cropArea.addEventListener("touchstart", e, !1);
        }, initialize: function initialize() {
          if (void 0 !== this.aspectRatio) {
            var t = this.calculateRectangleMaintainingAspectRatio(this.imageWidth - this.imageX, this.imageHeight - this.imageY);this.cropRectangle.topLeftX = (this.imageWidth + this.imageX - t.w) / 2, this.cropRectangle.topLeftY = (this.imageHeight + this.imageY - t.h) / 2, this.cropRectangle.bottomRightX = this.cropRectangle.topLeftX + t.w, this.cropRectangle.bottomRightY = this.cropRectangle.topLeftY + t.h;
          } else this.cropRectangle.topLeftX = this.imageX, this.cropRectangle.topLeftY = this.imageY, this.cropRectangle.bottomRightX = this.imageWidth, this.cropRectangle.bottomRightY = this.imageHeight, ya("crop initialized", this.cropRectangle);
        }, undoCrop: function undoCrop() {
          this.$store.commit("SET_CROP_RECTANGLE", null), this.$store.commit("REMOVE_TRANSFORMATION", "crop"), this.performTransformations();
        } }), mounted: function mounted() {
        var t = this;this.addMarkerBehaviour(this.$refs.topLeftMarker, "topLeftX", "topLeftY"), this.addMarkerBehaviour(this.$refs.topRightMarker, "bottomRightX", "topLeftY"), this.addMarkerBehaviour(this.$refs.bottomLeftMarker, "topLeftX", "bottomRightY"), this.addMarkerBehaviour(this.$refs.bottomRightMarker, "bottomRightX", "bottomRightY"), this.addMoveSelectionBehaviour(), this.$nextTick(function () {
          return t.initialize();
        }), ya("crop mounted");
      }, destroyed: function destroyed() {
        this.performTransformations();
      } },
        Aa = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fst-options-bar" }, [n("div", { staticClass: "fst-options__option" }, [n("label", { attrs: { for: "on" } }, [t._v("On:")]), t._v(" "), n("input", { directives: [{ name: "model", rawName: "v-model", value: t.on, expression: "on" }], attrs: { id: "on", type: "radio", value: "true" }, domProps: { checked: t._q(t.on, "true") }, on: { change: t.applyTransform, click: function click(e) {
              t.on = "true";
            } } })]), t._v(" "), n("div", { staticClass: "fst-options__option" }, [n("label", { attrs: { for: "on" } }, [t._v("Off:")]), t._v(" "), n("input", { directives: [{ name: "model", rawName: "v-model", value: t.on, expression: "on" }], attrs: { id: "off", type: "radio", value: "false" }, domProps: { checked: t._q(t.on, "false") }, on: { change: t.applyTransform, click: function click(e) {
              t.on = "false";
            } } })])]);
      }, staticRenderFns: [], computed: Sr({}, fs.mapGetters(["transformations"])), data: function data() {
        return { on: !1 };
      }, methods: Sr({}, fs.mapActions(["performTransformations"]), { applyTransform: function applyTransform() {
          var t = !("true" !== this.on);t ? this.$store.commit("SET_TRANSFORMATION", { type: "circle", options: {} }) : this.$store.commit("REMOVE_TRANSFORMATION", "circle"), this.performTransformations();
        } }), mounted: function mounted() {
        this.on = !!this.transformations.circle || !1;
      } },
        Sa = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fst-options-bar" }, [n("div", { staticClass: "fst-options__option" }, [n("label", { attrs: { for: "deg" } }, [t._v("Degree:")]), t._v(" "), n("input", { directives: [{ name: "model", rawName: "v-model.number", value: t.options.deg, expression: "options.deg", modifiers: { number: !0 } }], attrs: { id: "deg", type: "range", min: "0", max: "359" }, domProps: { value: t._s(t.options.deg) }, on: { change: t.applyTransform, input: function input(e) {
              t.options.deg = t._n(e.target.value);
            }, blur: function blur(e) {
              t.$forceUpdate();
            } } }), t._v(" "), n("div", { staticClass: "fst-options__option" }, [n("input", { directives: [{ name: "model", rawName: "v-model.number", value: t.options.deg, expression: "options.deg", modifiers: { number: !0 } }], attrs: { type: "number", min: "0", max: "359" }, domProps: { value: t._s(t.options.deg) }, on: { change: t.applyTransform, input: function input(e) {
              e.target.composing || (t.options.deg = t._n(e.target.value));
            }, blur: function blur(e) {
              t.$forceUpdate();
            } } })])])]);
      }, staticRenderFns: [], computed: Sr({}, fs.mapGetters(["transformations"])), data: function data() {
        return { options: { deg: 0 } };
      }, methods: Sr({}, fs.mapActions(["performTransformations"]), { applyTransform: function applyTransform() {
          var t = Sr({}, this.options);this.options.exif && delete t.deg, this.$store.commit("SET_TRANSFORMATION", { type: "rotate", options: t }), this.performTransformations();
        } }), mounted: function mounted() {
        this.options = Sr({}, this.options, this.transformations.rotate);
      } },
        Ra = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fst-options-bar" }, [n("div", { staticClass: "fst-options__option" }, [n("label", { attrs: { for: "deg" } }, [t._v("Threshold:")]), t._v(" "), n("input", { directives: [{ name: "model", rawName: "v-model.number", value: t.options.threshold, expression: "options.threshold", modifiers: { number: !0 } }], attrs: { id: "deg", type: "range", min: "0", max: "100" }, domProps: { value: t._s(t.options.threshold) }, on: { change: t.applyTransform, input: function input(e) {
              t.options.threshold = t._n(e.target.value);
            }, blur: function blur(e) {
              t.$forceUpdate();
            } } }), t._v(" "), n("div", { staticClass: "fst-options__option" }, [n("input", { directives: [{ name: "model", rawName: "v-model.number", value: t.options.threshold, expression: "options.threshold", modifiers: { number: !0 } }], attrs: { type: "number", min: "0", max: "100" }, domProps: { value: t._s(t.options.threshold) }, on: { change: t.applyTransform, input: function input(e) {
              e.target.composing || (t.options.threshold = t._n(e.target.value));
            }, blur: function blur(e) {
              t.$forceUpdate();
            } } })])])]);
      }, staticRenderFns: [], computed: Sr({}, fs.mapGetters(["transformations"])), data: function data() {
        return { options: { threshold: 0 } };
      }, methods: Sr({}, fs.mapActions(["performTransformations"]), { applyTransform: function applyTransform() {
          this.$store.commit("SET_TRANSFORMATION", { type: "blackwhite", options: this.options }), this.performTransformations();
        } }), mounted: function mounted() {
        this.options = Sr({}, this.options, this.transformations.blackwhite);
      } },
        Fa = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fst-options-bar" }, [n("div", { staticClass: "fst-options__option" }, [n("label", { attrs: { for: "on" } }, [t._v("On:")]), t._v(" "), n("input", { directives: [{ name: "model", rawName: "v-model", value: t.on, expression: "on" }], attrs: { id: "on", type: "radio", value: "true" }, domProps: { checked: t._q(t.on, "true") }, on: { change: t.applyTransform, click: function click(e) {
              t.on = "true";
            } } })]), t._v(" "), n("div", { staticClass: "fst-options__option" }, [n("label", { attrs: { for: "on" } }, [t._v("Off:")]), t._v(" "), n("input", { directives: [{ name: "model", rawName: "v-model", value: t.on, expression: "on" }], attrs: { id: "off", type: "radio", value: "false" }, domProps: { checked: t._q(t.on, "false") }, on: { change: t.applyTransform, click: function click(e) {
              t.on = "false";
            } } })])]);
      }, staticRenderFns: [], computed: Sr({}, fs.mapGetters(["transformations"])), data: function data() {
        return { on: !1 };
      }, methods: Sr({}, fs.mapActions(["performTransformations"]), { applyTransform: function applyTransform() {
          var t = !("true" !== this.on);this.$store.commit("SET_TRANSFORMATION", { type: "monochrome", options: t }), this.performTransformations();
        } }), mounted: function mounted() {
        this.on = this.transformations.monochrome || !1;
      } },
        Oa = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fst-options-bar" }, [n("div", { staticClass: "fst-options__option" }, [n("label", { attrs: { for: "tone" } }, [t._v("Tone:")]), t._v(" "), n("input", { directives: [{ name: "model", rawName: "v-model.number", value: t.options.tone, expression: "options.tone", modifiers: { number: !0 } }], attrs: { id: "tone", type: "range", min: "0", max: "100" }, domProps: { value: t._s(t.options.tone) }, on: { change: t.applyTransform, input: function input(e) {
              t.options.tone = t._n(e.target.value);
            }, blur: function blur(e) {
              t.$forceUpdate();
            } } }), t._v(" "), n("div", { staticClass: "fst-options__option" }, [n("input", { directives: [{ name: "model", rawName: "v-model.number", value: t.options.tone, expression: "options.tone", modifiers: { number: !0 } }], attrs: { type: "number", min: "0", max: "100" }, domProps: { value: t._s(t.options.tone) }, on: { change: t.applyTransform, input: function input(e) {
              e.target.composing || (t.options.tone = t._n(e.target.value));
            }, blur: function blur(e) {
              t.$forceUpdate();
            } } })])])]);
      }, staticRenderFns: [], computed: Sr({}, fs.mapGetters(["transformations"])), data: function data() {
        return { options: { tone: 0 } };
      }, methods: Sr({}, fs.mapActions(["performTransformations"]), { applyTransform: function applyTransform() {
          0 === this.options.tone ? this.$store.commit("REMOVE_TRANSFORMATION", "sepia") : this.$store.commit("SET_TRANSFORMATION", { type: "sepia", options: this.options }), this.performTransformations();
        } }), mounted: function mounted() {
        this.options = Sr({}, this.options, this.transformations.sepia);
      } },
        La = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fst-sidebar" }, t._l(t.enabled, function (e) {
          return n("div", { staticClass: "fst-sidebar__option", class: { "fst-sidebar__option--active": e === t.activeTransform }, on: { click: function click(n) {
                t.handleClick(e);
              } } }, [n("span", { staticClass: "fst-icon", class: t.genIconClass(e) }), t._v("\n    " + t._s(e) + "\n  ")]);
        }));
      }, staticRenderFns: [], computed: Sr({}, fs.mapGetters(["enabled", "activeTransform"])), methods: { handleClick: function handleClick(t) {
          this.$store.commit("SET_ACTIVE_TRANSFORM", t);
        }, genIconClass: function genIconClass(t) {
          return this.activeTransform === t ? "fst-icon--" + t + "-white" : "fst-icon--" + t + "-black";
        } } },
        xa = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fst-transform" }, [n("div", { staticClass: "fst-modal" }, [n("transforms"), t._v(" "), n("div", { staticClass: "fst-modal__body" }, [n("div", { staticClass: "fst-container" }, [n("div", { staticClass: "fst-content" }, [n("img", { ref: "image", staticClass: "fst-image", attrs: { src: t.imageUrl }, on: { load: t.imageLoaded } }), t._v(" "), "crop" === t.activeTransform ? n("crop", { attrs: { "image-width": t.imageWidth, "image-height": t.imageHeight, "image-x": t.imageX, "image-y": t.imageY } }) : t._e(), t._v(" "), "rotate" === t.activeTransform ? n("rotate") : t._e(), t._v(" "), "blackwhite" === t.activeTransform ? n("black-white") : t._e(), t._v(" "), "monochrome" === t.activeTransform ? n("monochrome") : t._e(), t._v(" "), "circle" === t.activeTransform ? n("circle-view") : t._e(), t._v(" "), "sepia" === t.activeTransform ? n("sepia") : t._e()], 1)]), t._v(" "), n("div", { staticClass: "fst-footer" }, [n("div", { staticClass: "fst-button fst-button--cancel", on: { click: t.cancel } }, [t._v("Cancel")]), t._v(" "), n("div", { staticClass: "fst-button fst-button--primary", on: { click: t.done } }, [t._v("Done")])])])], 1)]);
      }, staticRenderFns: [], components: { "circle-view": Aa, Crop: Ta, Rotate: Sa, BlackWhite: Ra, Monochrome: Fa, Sepia: Oa, Transforms: La }, data: function data() {
        return { imageWidth: 0, imageHeight: 0 };
      }, computed: Sr({}, fs.mapGetters(["imageUrl", "activeTransform"])), methods: Sr({}, fs.mapActions(["performTransformations"]), { imageLoaded: function imageLoaded() {
          if (this.$refs.image) {
            var t = this.$refs.image.offsetLeft,
                e = this.$refs.image.offsetTop;this.imageWidth = this.$refs.image.offsetWidth + t, this.imageHeight = this.$refs.image.offsetHeight + e, this.imageX = t, this.imageY = e;var n = this.$refs.image.naturalWidth,
                r = this.$refs.image.naturalHeight;this.$store.commit("SET_IMAGE_NATURAL_SIZE", { w: n, h: r });
          }
        }, cancel: function cancel() {
          this.$root.$destroy();
        }, done: function done() {
          this.performTransformations({ done: !0 }), this.$root.$destroy();
        } }) };Mo.use(fs);var Ia = { imageNaturalWidth: 0, imageNaturalHeight: 0, transformations: {}, cropRectangle: null, activeTransform: null },
        Pa = function Pa(t, e, n) {
      var r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
          i = function i(e) {
        var n = t.getSecurity();return n && n.policy && n.signature ? e + "?policy=" + n.policy + "&signature=" + n.signature : e;
      };return new fs.Store({ state: Sr({}, Ia, { config: e }, r), mutations: { SET_IMAGE_NATURAL_SIZE: function SET_IMAGE_NATURAL_SIZE(t, e) {
            t.imageNaturalWidth = e.w, t.imageNaturalHeight = e.h;
          }, SET_CROP_RECTANGLE: function SET_CROP_RECTANGLE(t, e) {
            t.cropRectangle = e;
          }, SET_ACTIVE_TRANSFORM: function SET_ACTIVE_TRANSFORM(t, e) {
            t.activeTransform = e;
          }, SET_NEW_URL: function SET_NEW_URL(t, e) {
            var n = i(e);t.config.imageUrl = n;
          }, SET_TRANSFORMATION: function SET_TRANSFORMATION(t, e) {
            var n = e.type,
                r = e.options;Mo.set(t.transformations, n, r);
          }, REMOVE_TRANSFORMATION: function REMOVE_TRANSFORMATION(t, e) {
            Mo.delete(t.transformations, e);
          } }, actions: { performTransformations: function performTransformations(e) {
            var r = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
                i = e.state,
                o = Sr({}, i.transformations);if (i.transformations.crop) {
              var s = i.transformations.crop.dim;e.commit("SET_CROP_RECTANGLE", s), i.config.minDimensions && (i.config.minDimensions[0] > s.width || i.config.minDimensions[1] > s.height) && (o.resize = {}, o.resize.width = i.config.minDimensions[0], o.resize.height = i.config.minDimensions[1]), i.config.maxDimensions && (i.config.maxDimensions[0] < s.width || i.config.maxDimensions[1] < s.height) && (o.resize = {}, o.resize.width = i.config.maxDimensions[0], o.resize.height = i.config.maxDimensions[1]);
            } else i.config.minDimensions && (i.config.minDimensions[0] > i.imageNaturalWidth || i.config.minDimensions[1] > i.imageNaturalHeight) && (o.resize = {}, o.resize.width = i.config.minDimensions[0], o.resize.height = i.config.minDimensions[1]), i.config.maxDimensions && (i.config.maxDimensions[0] < i.imageNaturalWidth || i.config.maxDimensions[1] < i.imageNaturalHeight) && (o.resize = {}, o.resize.width = i.config.maxDimensions[0], o.resize.height = i.config.maxDimensions[1]);if (r) try {
              var a = t.transform(e.getters.originalUrl, o);n(a);
            } catch (t) {
              console.log(t);
            } else {
              var c = t.transform(e.getters.originalUrl, o);e.commit("SET_NEW_URL", c);
            }
          } }, getters: { imageUrl: function imageUrl(t) {
            return i(t.config.imageUrl);
          }, originalUrl: function originalUrl(t) {
            return t.config.originalUrl;
          }, cachedCropRectangle: function cachedCropRectangle(t) {
            return t.cropRectangle;
          }, transformations: function transformations(t) {
            return t.transformations;
          }, imageNaturalWidth: function imageNaturalWidth(t) {
            return t.imageNaturalWidth;
          }, imageNaturalHeight: function imageNaturalHeight(t) {
            return t.imageNaturalHeight;
          }, enabled: function enabled(t) {
            return Object.keys(t.config.transformations).filter(function (e) {
              return t.config.transformations[e];
            });
          }, activeTransform: function activeTransform(t) {
            return t.activeTransform;
          }, cropAspectRatio: function cropAspectRatio(t) {
            return t.config.transformations.crop && t.config.transformations.crop.aspectRatio;
          } } });
    },
        ja = function ja(t) {
      return "object" === ("undefined" == typeof t ? "undefined" : Tr(t)) && null !== t && Array.isArray(t) === !1 && t instanceof HTMLElement == !1;
    },
        Na = function Na(t) {
      return "number" == typeof t;
    },
        Ua = { imageUrl: function imageUrl(t) {
        return t;
      }, container: function container(t) {
        if (t instanceof HTMLElement) return t;throw new Error('Invalid value for "container" config option');
      }, minDimensions: function minDimensions(t) {
        if (Array.isArray(t)) {
          if (2 === t.length) {
            var e = t.some(function (t) {
              return "number" != typeof t;
            });if (!e) return t;throw new Error('Option "minDimensions" requires array of numbers');
          }throw new Error('Option "minDimensions" requires array with exactly two elements: [width, height]');
        }throw new Error('Invalid value for "minDimensions" config option');
      }, maxDimensions: function maxDimensions(t) {
        if (Array.isArray(t)) {
          if (2 === t.length) {
            var e = t.some(function (t) {
              return "number" != typeof t;
            });if (!e) return t;throw new Error('Option "maxDimensions" requires array of numbers');
          }throw new Error('Option "maxDimensions" requires array with exactly two elements: [width, height]');
        }throw new Error('Invalid value for "maxDimensions" config option');
      }, transformations: function transformations(t) {
        if (ja(t)) return t;throw new Error('Invalid value for "transformations" config option');
      }, "transformations.crop": function transformationsCrop(t) {
        if (ja(t)) return t;if (t === !0) return {};if (t === !1) return !1;throw new Error('Invalid value for "transformations.crop" config option');
      }, "transformations.crop.aspectRatio": function transformationsCropAspectRatio(t) {
        if (Na(t)) return t;throw new Error('Invalid value for "transformations.crop.aspectRatio" config option');
      }, "transformations.rotate": function transformationsRotate(t) {
        if ("boolean" == typeof t) return t;throw new Error('Invalid value for "transformations.rotate" config option');
      }, "transformations.blackwhite": function transformationsBlackwhite(t) {
        if ("boolean" == typeof t) return t;throw new Error('Invalid value for "transformations.blackwhite" config option');
      }, "transformations.monochrome": function transformationsMonochrome(t) {
        if ("boolean" == typeof t) return t;throw new Error('Invalid value for "transformations.monochrome" config option');
      }, "transformations.circle": function transformationsCircle(t) {
        if ("boolean" == typeof t) return t;throw new Error('Invalid value for "transformations.circle" config option');
      }, "transformations.sepia": function transformationsSepia(t) {
        if ("boolean" == typeof t) return t;throw new Error('Invalid value for "transformations.sepia" config option');
      } },
        Da = function Da(t) {
      return void 0 === t.transformations && (t.transformations = { crop: !0 }), t;
    },
        $a = function t(e, n) {
      var r = {};return Object.keys(e).forEach(function (i) {
        var o = i;n && (o = n + "." + i);var s = Ua[o];if (!s) throw new Error('Unknown config option "' + o + '"');var a = s(e[i]);ja(a) ? r[i] = t(a, o) : r[i] = a;
      }), r;
    },
        Ma = Vo.context("transformer"),
        Ha = function Ha(t, e, n) {
      return new Promise(function (r) {
        var i = function i(t) {
          r(t);
        },
            o = document.body;e.container && (o = e.container);var s = document.createElement("div");o.appendChild(s);var a = new Mo({ el: s, store: Pa(t, e, i, n), render: function render(t) {
            return t(xa);
          }, destroyed: function destroyed() {
            return a.$el.parentNode.removeChild(a.$el), i();
          } });
      });
    },
        Wa = function Wa(t, e) {
      var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
          r = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};return Ma("Starting transformer v0.3.1 with config:", n), n = Sr({ imageUrl: e }, n), n = $a(Da(n)), n.originalUrl = e, Jo.loadCss(wr.css.main).then(function () {
        return Ha(t, n, r);
      });
    },
        za = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fsp-picker" }, [n("close-button"), t._v(" "), n("div", { ref: "container" })], 1);
      }, staticRenderFns: [], components: { CloseButton: Cs }, computed: Sr({}, fs.mapGetters(["apiClient", "stagedForTransform", "transformOptions", "uploadInBackground"])), methods: Sr({}, fs.mapActions(["startUploading"]), { showInTransformer: function showInTransformer(t) {
          var e = this;Wa(this.apiClient, t.url, Sr({}, this.transformOptions, { container: this.$refs.container }), { transformations: {} }).then(function (n) {
            e.$store.commit("SET_FILE_TRANSFORMATION", { uploadToken: t.uploadToken, transformedUrl: n });
          }).then(function () {
            e.$store.commit("GO_BACK_WITH_ROUTE"), e.uploadInBackground && e.startUploading();
          });
        } }), mounted: function mounted() {
        this.showInTransformer(this.stagedForTransform);
      } },
        Va = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fsp-picker" }, [n("close-button"), t._v(" "), n("div", { staticClass: "fsp-modal" }, [n("sidebar"), t._v(" "), n("div", { staticClass: "fsp-modal__body" }, [n("div", { staticClass: "fsp-container" }, [t.uploadStarted || t.mobileNavActive ? t._e() : n("div", { staticClass: "fsp-summary__go-back", attrs: { title: "Go back" }, on: { click: t.goBack } }), t._v(" "), n("content-header", [t.mobileNavActive ? t._e() : n("span", { staticClass: "fsp-header-text--visible" }, [t._v(t._s(t.headerText))])]), t._v(" "), n("div", { staticClass: "fsp-content fsp-content--selected-items" }, [n("div", { staticClass: "fsp-summary" }, [n("div", { staticClass: "fsp-summary__header" }, [n("div", { staticClass: "fsp-summary__filter" }, [n("input", { attrs: { placeholder: "Filter" }, on: { input: t.updateFilter } }), t._v(" "), n("span", { staticClass: "fsp-summary__filter-icon" })])]), t._v(" "), n("div", { staticClass: "fsp-summary__body" }, [t.onlyTransformedImages.length ? n("div", { staticClass: "fsp-grid__label" }, [t._v("Edited Images")]) : t._e(), t._v(" "), t.onlyTransformedImages.length ? n("div", { staticClass: "fsp-summary__images-container" }, t._l(t.onlyTransformedImages, function (e) {
          return n("div", { key: e.uploadToken, staticClass: "fsp-summary__item" }, ["local_file_system" === e.source ? n("img", { ref: e.uploadToken, refInFor: !0, staticClass: "fsp-summary__thumbnail", attrs: { src: t.generateThumbnail(e) }, on: { load: function load(n) {
                t.revokeURL(e);
              } } }) : n("div", [n("img", { staticClass: "fsp-summary__thumbnail", attrs: { src: e.transformed || e.thumbnail } })]), t._v(" "), n("span", { staticClass: "fsp-summary__item-name" }, [t._v("\n                    " + t._s(e.name) + "\n                  ")]), t._v(" "), n("div", { staticClass: "fsp-summary__item-progress", style: { width: e.progress + "%" } }), t._v(" "), t.uploadStarted ? t._e() : n("div", { staticClass: "fsp-summary__actions-container" }, [t.isLoading(e.uploadToken) ? n("span", { staticClass: "fsp-summary__action fsp-summary__action--disabled" }, [t._v("Loading...")]) : t._e(), t._v(" "), t.disableTransformer || t.isLoading(e.uploadToken) ? t._e() : n("span", [n("span", { staticClass: "fsp-summary__action fsp-summary__action--button", on: { click: function click(n) {
                t.removeTransformation(e);
              } } }, [t._v("Revert")])]), t._v(" "), n("span", { staticClass: "fsp-summary__action-separator" }), t._v(" "), n("span", { staticClass: "fsp-summary__action fsp-summary__action--remove", on: { click: function click(n) {
                t.addFile(e);
              } } })])]);
        })) : t._e(), t._v(" "), t.onlyImages.length ? n("div", { staticClass: "fsp-grid__label" }, [t._v("Images")]) : t._e(), t._v(" "), t.onlyImages.length ? n("div", { staticClass: "fsp-summary__images-container" }, t._l(t.onlyImages, function (e) {
          return n("div", { key: e.uploadToken, staticClass: "fsp-summary__item" }, ["local_file_system" === e.source ? n("img", { ref: e.uploadToken, refInFor: !0, staticClass: "fsp-summary__thumbnail", attrs: { src: t.generateThumbnail(e) }, on: { load: function load(n) {
                t.revokeURL(e);
              } } }) : n("div", [n("img", { staticClass: "fsp-summary__thumbnail", attrs: { src: e.transformed || e.thumbnail } })]), t._v(" "), n("span", { staticClass: "fsp-summary__item-name" }, [t._v("\n                    " + t._s(e.name) + "\n                  ")]), t._v(" "), n("div", { staticClass: "fsp-summary__item-progress", style: { width: e.progress + "%" } }), t._v(" "), t.uploadStarted ? t._e() : n("div", { staticClass: "fsp-summary__actions-container" }, [t.isLoading(e.uploadToken) ? n("span", { staticClass: "fsp-summary__action fsp-summary__action--disabled" }, [t._v("Loading...")]) : t._e(), t._v(" "), t.disableTransformer || t.isLoading(e.uploadToken) ? t._e() : n("span", [n("span", { staticClass: "fsp-summary__action fsp-summary__action--button", on: { click: function click(n) {
                t.transformImage(e);
              } } }, [t._v("Edit")])]), t._v(" "), n("span", { staticClass: "fsp-summary__action-separator" }), t._v(" "), n("span", { staticClass: "fsp-summary__action fsp-summary__action--remove", on: { click: function click(n) {
                t.addFile(e);
              } } })])]);
        })) : t._e(), t._v(" "), t.onlyFiles.length ? n("div", { staticClass: "fsp-grid__label" }, [t._v("Files")]) : t._e(), t._v(" "), t._l(t.onlyFiles, function (e) {
          return n("div", { key: e.uploadToken, staticClass: "fsp-summary__item" }, [n("div", { staticClass: "fsp-summary__thumbnail-container" }, [n("span", { class: t.generateClass(e) })]), t._v(" "), n("span", { staticClass: "fsp-summary__item-name" }, [t._v("\n                  " + t._s(e.name) + "\n                ")]), t._v(" "), n("div", { staticClass: "fsp-summary__item-progress", style: { width: e.progress + "%" } }), t._v(" "), t.uploadStarted ? t._e() : n("div", { staticClass: "fsp-summary__actions-container" }, [n("div", { staticClass: "fsp-summary__action", on: { click: function click(n) {
                t.addFile(e);
              } } }, [n("span", { staticClass: "fsp-summary__action--remove" })])])]);
        }), t._v(" "), t.hideMinFilesNotification ? t._e() : n("div", { staticClass: "fsp-notifications__container" }, [n("div", { staticClass: "fsp-notifications__message" }, [n("span", { staticClass: "fsp-label" }, [t._v(" " + t._s(t.getMinFilesNotification) + " ")])]), t._v(" "), n("span", { staticClass: "fsp-notifications__back-button", on: { click: t.goBack } }, [t._v("Go Back")])])], 2)])])], 1), t._v(" "), n("footer-nav", { attrs: { isVisible: !t.uploadStarted } }, [n("span", { staticClass: "fsp-button fsp-button--flat fsp-button__deselect", on: { click: t.deselectAllFiles }, slot: "nav-left" }, [t._v("Deselect All")]), t._v(" "), n("span", { staticClass: "fsp-button fsp-button--primary", class: { "fsp-button--disabled": !t.canStartUpload }, attrs: { title: "Upload" }, on: { click: t.startUploadMaybe }, slot: "nav-right" }, [t._v("\n          Upload\n          "), n("span", { staticClass: "fsp-badge fsp-badge--bright" }, [t._v(t._s(t.allFiles.length))])])])], 1)], 1), t._v(" "), t._m(0)], 1);
      }, staticRenderFns: [function () {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return n("div", { staticClass: "fsp-picker__footer" }, [t._v("\n    Powered by "), n("span", { staticClass: "fsp-icon--filestack" }), t._v(" Filestack\n  ")]);
      }], components: { CloseButton: Cs, ContentHeader: Xs, Sidebar: ta, FooterNav: qs }, computed: Sr({}, fs.mapGetters(["filesWaiting", "filesUploading", "route", "routesHistory", "uploadStarted", "minFiles", "canStartUpload", "filesNeededCount", "disableTransformer", "mobileNavActive"]), { allFiles: function allFiles() {
          return this.filesWaiting.concat(this.filesUploading);
        }, getMinFilesNotification: function getMinFilesNotification() {
          return 1 === this.filesNeededCount ? "Please select 1 more file" : this.filesNeededCount > 1 ? "Please select " + this.filesNeededCount + " more files" : null;
        }, hideMinFilesNotification: function hideMinFilesNotification() {
          return this.uploadStarted || this.canStartUpload;
        }, onlyFiles: function onlyFiles() {
          var t = this,
              e = new RegExp(this.filter, "i");return this.allFiles.filter(function (e) {
            return !t.isImage(e);
          }).filter(function (t) {
            return e.test(t.name);
          });
        }, onlyImages: function onlyImages() {
          var t = this,
              e = new RegExp(this.filter, "i");return this.allFiles.filter(function (e) {
            return t.isImage(e);
          }).filter(function (t) {
            return !t.transformed;
          }).filter(function (t) {
            return e.test(t.name);
          });
        }, onlyTransformedImages: function onlyTransformedImages() {
          var t = this,
              e = new RegExp(this.filter, "i");return this.allFiles.filter(function (e) {
            return t.isImage(e);
          }).filter(function (t) {
            return t.transformed;
          }).filter(function (t) {
            return e.test(t.name);
          });
        }, headerText: function headerText() {
          return this.uploadStarted ? "Uploading " + this.filesUploading.length + " of " + this.allFiles.length : this.t("Selected Files");
        }, atLeastOneLoading: function atLeastOneLoading() {
          var t = this;return !!Object.keys(this.loading).filter(function (e) {
            return t.loading[e];
          }).length;
        } }), created: function created() {
        this.resetCloudLimiter();
      }, data: function data() {
        return { blobURLs: {}, currentPath: null, currentSource: null, filter: "", loading: {} };
      }, methods: Sr({}, fs.mapActions(["addFile", "deselectAllFiles", "deselectFolder", "removeTransformation", "resetCloudLimiter", "startUploading", "uploadFileToTemporaryLocation", "goBack"]), { isImage: function isImage(t) {
          return t.mimetype && t.mimetype.indexOf("image/") !== -1;
        }, isAudio: function isAudio(t) {
          return t.mimetype && t.mimetype.indexOf("audio/") !== -1;
        }, isLoading: function isLoading(t) {
          return this.loading[t];
        }, fileOrFiles: function fileOrFiles(t) {
          return 1 === this.getFileCount(t) ? "File" : "Files";
        }, generateClass: function generateClass(t) {
          return this.isAudio(t) ? "fsp-grid__icon-audio" : "application/pdf" === t.mimetype ? "fsp-grid__icon-pdf" : "fsp-grid__icon-file";
        }, generateThumbnail: function generateThumbnail(t) {
          if (t.transformed) return t.transformed;var e = window.URL.createObjectURL(t.originalFile);return this.blobURLs[t.uploadToken] = e, e;
        }, revokeURL: function revokeURL(t) {
          var e = this.blobURLs[t.uploadToken];window.URL.revokeObjectURL(e);
        }, updateFilter: function updateFilter(t) {
          this.filter = t.target.value;
        }, startUploadMaybe: function startUploadMaybe() {
          this.canStartUpload && this.startUploading(!0);
        }, transformImage: function transformImage(t) {
          var e = this;if (!this.atLeastOneLoading) {
            var n = t.uploadToken;this.loading = Sr({}, this.loading, Ar({}, n, !0)), this.uploadFileToTemporaryLocation(n).then(function (t) {
              t ? (e.loading = Sr({}, e.loading, Ar({}, n, !1)), e.$store.commit("SET_FILE_FOR_TRANSFORM", t), e.$store.commit("CHANGE_ROUTE", ["transform"])) : e.loading = Sr({}, e.loading, Ar({}, n, !1));
            });
          }
        } }), watch: { allFiles: { handler: function handler(t) {
            0 === t.length && this.$store.commit("GO_BACK_WITH_ROUTE");
          } } } },
        Ba = { render: function render() {
        var t = this,
            e = t.$createElement,
            n = t._self._c || e;return t.uiVisible ? n("div", [t.isRootRoute("source") ? n("pick-from-source") : t._e(), t._v(" "), t.isRootRoute("summary") ? n("upload-summary") : t._e(), t._v(" "), t.isRootRoute("transform") ? n("transform") : t._e(), t._v(" "), n("notifications"), t._v(" "), t.localPickingAllowed ? n("drag-and-drop") : t._e()], 1) : t._e();
      }, staticRenderFns: [], components: { DragAndDrop: _s, Notifications: gs, PickFromSource: ea, Transform: za, UploadSummary: Va }, computed: Sr({}, fs.mapGetters(["uiVisible", "route", "fromSources"]), { localPickingAllowed: function localPickingAllowed() {
          return this.fromSources.some(function (t) {
            return "local_file_system" === t.name;
          });
        } }), methods: Sr({}, fs.mapActions(["prefetchClouds", "resetCloudLimiter"]), { isRootRoute: function isRootRoute(t) {
          return this.route[0] === t;
        }, detectEscPressed: function detectEscPressed(t) {
          27 === t.keyCode && this.$root.$destroy();
        } }), created: function created() {
        window.addEventListener("keyup", this.detectEscPressed), this.prefetchClouds();
      }, destroyed: function destroyed() {
        window.removeEventListener("keyup", this.detectEscPressed), this.resetCloudLimiter(!0);
      }, watch: { route: { immediate: !0, deep: !0, handler: function handler(t) {
            "done" === t[0] && this.$root.$destroy();
          } } } },
        Ga = t(function (t) {
      (function () {
        var e,
            n = {}.hasOwnProperty;e = function () {
          function t(t, e, n, r, i) {
            this.maxNb = t, this.minTime = e, this.highWater = n, this.strategy = r, this.rejectOnDrop = i, this.limiters = {}, this.Bottleneck = Lu, this.startAutoCleanup();
          }return t.prototype.key = function (t) {
            var e;return null == t && (t = ""), null != (e = this.limiters[t]) ? e : this.limiters[t] = new this.Bottleneck(this.maxNb, this.minTime, this.highWater, this.strategy, this.rejectOnDrop);
          }, t.prototype.deleteKey = function (t) {
            return null == t && (t = ""), delete this.limiters[t];
          }, t.prototype.all = function (t) {
            var e, r, i, o;r = this.limiters, i = [];for (e in r) {
              n.call(r, e) && (o = r[e], i.push(t(o)));
            }return i;
          }, t.prototype.keys = function () {
            return Object.keys(this.limiters);
          }, t.prototype.startAutoCleanup = function () {
            var t;return this.stopAutoCleanup(), "function" == typeof (t = this.interval = setInterval(function (t) {
              return function () {
                var e, n, r, i, o;i = Date.now(), n = t.limiters, r = [];for (e in n) {
                  o = n[e], o._nextRequest + 3e5 < i ? r.push(t.deleteKey(e)) : r.push(void 0);
                }return r;
              };
            }(this), 3e4)).unref ? t.unref() : void 0;
          }, t.prototype.stopAutoCleanup = function () {
            return clearInterval(this.interval);
          }, t;
        }(), t.exports = e;
      }).call(kr);
    }),
        Ya = t(function (t) {
      (function () {
        var e;e = function () {
          function t() {
            this._first = null, this._last = null, this.length = 0;
          }return t.prototype.push = function (t) {
            var e;this.length++, e = { value: t, next: null }, null != this._last ? (this._last.next = e, this._last = e) : this._first = this._last = e;
          }, t.prototype.shift = function () {
            var t, e;if (null != this._first) return this.length--, e = this._first.value, this._first = null != (t = this._first.next) ? t : this._last = null, e;
          }, t.prototype.getArray = function () {
            var t, e, n;for (t = this._first, n = []; null != t;) {
              n.push((e = t, t = t.next, e.value));
            }return n;
          }, t;
        }(), t.exports = e;
      }).call(kr);
    }),
        Xa = t(function (t) {
      var e = function () {
        "use strict";
        return void 0 === this;
      }();if (e) t.exports = { freeze: Object.freeze, defineProperty: Object.defineProperty, getDescriptor: Object.getOwnPropertyDescriptor, keys: Object.keys, names: Object.getOwnPropertyNames, getPrototypeOf: Object.getPrototypeOf, isArray: Array.isArray, isES5: e, propertyIsWritable: function propertyIsWritable(t, e) {
          var n = Object.getOwnPropertyDescriptor(t, e);return !(n && !n.writable && !n.set);
        } };else {
        var n = {}.hasOwnProperty,
            r = {}.toString,
            i = {}.constructor.prototype,
            o = function o(t) {
          var e = [];for (var r in t) {
            n.call(t, r) && e.push(r);
          }return e;
        },
            s = function s(t, e) {
          return { value: t[e] };
        },
            a = function a(t, e, n) {
          return t[e] = n.value, t;
        },
            c = function c(t) {
          return t;
        },
            u = function u(t) {
          try {
            return Object(t).constructor.prototype;
          } catch (t) {
            return i;
          }
        },
            l = function l(t) {
          try {
            return "[object Array]" === r.call(t);
          } catch (t) {
            return !1;
          }
        };t.exports = { isArray: l, keys: o, names: o, defineProperty: a, getDescriptor: s, freeze: c, getPrototypeOf: u, isES5: e, propertyIsWritable: function propertyIsWritable() {
            return !0;
          } };
      }
    }),
        qa = Xa,
        Qa = "undefined" == typeof navigator,
        Ka = function () {
      try {
        var t = {};return qa.defineProperty(t, "f", { get: function get$$1() {
            return 3;
          } }), 3 === t.f;
      } catch (t) {
        return !1;
      }
    }(),
        Ja = { e: {} },
        Za,
        tc = function tc(t, e) {
      function n() {
        this.constructor = t, this.constructor$ = e;for (var n in e.prototype) {
          r.call(e.prototype, n) && "$" !== n.charAt(n.length - 1) && (this[n + "$"] = e.prototype[n]);
        }
      }var r = {}.hasOwnProperty;return n.prototype = e.prototype, t.prototype = new n(), t.prototype;
    },
        ec = function () {
      var t = [Array.prototype, Object.prototype, Function.prototype],
          e = function e(_e4) {
        for (var n = 0; n < t.length; ++n) {
          if (t[n] === _e4) return !0;
        }return !1;
      };if (qa.isES5) {
        var n = Object.getOwnPropertyNames;return function (t) {
          for (var r = [], i = Object.create(null); null != t && !e(t);) {
            var o;try {
              o = n(t);
            } catch (t) {
              return r;
            }for (var s = 0; s < o.length; ++s) {
              var a = o[s];if (!i[a]) {
                i[a] = !0;var c = Object.getOwnPropertyDescriptor(t, a);null != c && null == c.get && null == c.set && r.push(a);
              }
            }t = qa.getPrototypeOf(t);
          }return r;
        };
      }var r = {}.hasOwnProperty;return function (n) {
        if (e(n)) return [];var i = [];t: for (var o in n) {
          if (r.call(n, o)) i.push(o);else {
            for (var s = 0; s < t.length; ++s) {
              if (r.call(t[s], o)) continue t;
            }i.push(o);
          }
        }return i;
      };
    }(),
        nc = /this\s*\.\s*\S+\s*=/,
        rc = /^[a-z$_][a-z$_0-9]*$/i,
        ic = function () {
      return "stack" in new Error() ? function (t) {
        return cr(t) ? t : new Error(or(t));
      } : function (t) {
        if (cr(t)) return t;try {
          throw new Error(or(t));
        } catch (t) {
          return t;
        }
      };
    }(),
        oc = { isClass: er, isIdentifier: rr, inheritedDataKeys: ec, getDataPropertyOrDefault: Jn, thrower: tr, isArray: qa.isArray, haveGetters: Ka, notEnumerableProp: Zn, isPrimitive: Xn, isObject: qn, canEvaluate: Qa, errorObj: Ja, tryCatch: Yn, inherits: tc, withAppended: Kn, maybeWrapAsError: Qn, toFastProperties: nr, filledRange: ir, toString: or, canAttachTrace: cr, ensureErrorObject: ic, originatesFromRejection: ar, markAsOriginatingFromRejection: sr, classString: ur, copyDescriptors: lr, hasDevTools: "undefined" != typeof chrome && chrome && "function" == typeof chrome.loadTimes, isNode: "undefined" != typeof process && "[object process]" === ur(process).toLowerCase() };oc.isRecentNode = oc.isNode && function () {
      var t = process.versions.node.split(".").map(Number);return 0 === t[0] && t[1] > 10 || t[0] > 0;
    }(), oc.isNode && oc.toFastProperties(process);try {
      throw new Error();
    } catch (t) {
      oc.lastLineError = t;
    }var sc = oc,
        ac,
        cc = sc,
        uc = function uc() {
      throw new Error("No async scheduler available\n\n    See http://goo.gl/m3OTXk\n");
    };if (cc.isNode && "undefined" == typeof MutationObserver) {
      var lc = kr.setImmediate,
          fc = process.nextTick;ac = cc.isRecentNode ? function (t) {
        lc.call(kr, t);
      } : function (t) {
        fc.call(process, t);
      };
    } else "undefined" == typeof MutationObserver || "undefined" != typeof window && window.navigator && window.navigator.standalone ? ac = "undefined" != typeof setImmediate ? function (t) {
      setImmediate(t);
    } : "undefined" != typeof setTimeout ? function (t) {
      setTimeout(t, 0);
    } : uc : (ac = function ac(t) {
      var e = document.createElement("div"),
          n = new MutationObserver(t);return n.observe(e, { attributes: !0 }), function () {
        e.classList.toggle("foo");
      };
    }, ac.isStatic = !0);var pc = ac;pr.prototype._willBeOverCapacity = function (t) {
      return this._capacity < t;
    }, pr.prototype._pushOne = function (t) {
      var e = this.length();this._checkCapacity(e + 1);var n = this._front + e & this._capacity - 1;this[n] = t, this._length = e + 1;
    }, pr.prototype._unshiftOne = function (t) {
      var e = this._capacity;this._checkCapacity(this.length() + 1);var n = this._front,
          r = (n - 1 & e - 1 ^ e) - e;this[r] = t, this._front = r, this._length = this.length() + 1;
    }, pr.prototype.unshift = function (t, e, n) {
      this._unshiftOne(n), this._unshiftOne(e), this._unshiftOne(t);
    }, pr.prototype.push = function (t, e, n) {
      var r = this.length() + 3;if (this._willBeOverCapacity(r)) return this._pushOne(t), this._pushOne(e), void this._pushOne(n);var i = this._front + r - 3;this._checkCapacity(r);var o = this._capacity - 1;this[i + 0 & o] = t, this[i + 1 & o] = e, this[i + 2 & o] = n, this._length = r;
    }, pr.prototype.shift = function () {
      var t = this._front,
          e = this[t];return this[t] = void 0, this._front = t + 1 & this._capacity - 1, this._length--, e;
    }, pr.prototype.length = function () {
      return this._length;
    }, pr.prototype._checkCapacity = function (t) {
      this._capacity < t && this._resizeTo(this._capacity << 1);
    }, pr.prototype._resizeTo = function (t) {
      var e = this._capacity;this._capacity = t;var n = this._front,
          r = this._length,
          i = n + r & e - 1;fr(this, 0, this, e, i);
    };var dc = pr,
        hc;try {
      throw new Error();
    } catch (t) {
      hc = t;
    }var mc = pc,
        vc = dc,
        _c = sc;dr.prototype.disableTrampolineIfNecessary = function () {
      _c.hasDevTools && (this._trampolineEnabled = !1);
    }, dr.prototype.enableTrampoline = function () {
      this._trampolineEnabled || (this._trampolineEnabled = !0, this._schedule = function (t) {
        setTimeout(t, 0);
      });
    }, dr.prototype.haveItemsQueued = function () {
      return this._normalQueue.length() > 0;
    }, dr.prototype.throwLater = function (t, e) {
      if (1 === arguments.length && (e = t, t = function t() {
        throw e;
      }), "undefined" != typeof setTimeout) setTimeout(function () {
        t(e);
      }, 0);else try {
        this._schedule(function () {
          t(e);
        });
      } catch (t) {
        throw new Error("No async scheduler available\n\n    See http://goo.gl/m3OTXk\n");
      }
    }, _c.hasDevTools ? (mc.isStatic && (mc = function mc(t) {
      setTimeout(t, 0);
    }), dr.prototype.invokeLater = function (t, e, n) {
      this._trampolineEnabled ? hr.call(this, t, e, n) : this._schedule(function () {
        setTimeout(function () {
          t.call(e, n);
        }, 100);
      });
    }, dr.prototype.invoke = function (t, e, n) {
      this._trampolineEnabled ? mr.call(this, t, e, n) : this._schedule(function () {
        t.call(e, n);
      });
    }, dr.prototype.settlePromises = function (t) {
      this._trampolineEnabled ? vr.call(this, t) : this._schedule(function () {
        t._settlePromises();
      });
    }) : (dr.prototype.invokeLater = hr, dr.prototype.invoke = mr, dr.prototype.settlePromises = vr), dr.prototype.invokeFirst = function (t, e, n) {
      this._normalQueue.unshift(t, e, n), this._queueTick();
    }, dr.prototype._drainQueue = function (t) {
      for (; t.length() > 0;) {
        var e = t.shift();if ("function" == typeof e) {
          var n = t.shift(),
              r = t.shift();e.call(n, r);
        } else e._settlePromises();
      }
    }, dr.prototype._drainQueues = function () {
      this._drainQueue(this._normalQueue), this._reset(), this._drainQueue(this._lateQueue);
    }, dr.prototype._queueTick = function () {
      this._isTickUsed || (this._isTickUsed = !0, this._schedule(this.drainQueues));
    }, dr.prototype._reset = function () {
      this._isTickUsed = !1;
    };var gc = new dr(),
        yc = hc;gc.firstLineError = yc;var bc = Xa,
        Cc = bc.freeze,
        Ec = sc,
        wc = Ec.inherits,
        kc = Ec.notEnumerableProp,
        Tc,
        Ac,
        Sc = _r("Warning", "warning"),
        Rc = _r("CancellationError", "cancellation error"),
        Fc = _r("TimeoutError", "timeout error"),
        Oc = _r("AggregateError", "aggregate error");try {
      Tc = TypeError, Ac = RangeError;
    } catch (t) {
      Tc = _r("TypeError", "type error"), Ac = _r("RangeError", "range error");
    }for (var Lc = "join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" "), xc = 0; xc < Lc.length; ++xc) {
      "function" == typeof Array.prototype[Lc[xc]] && (Oc.prototype[Lc[xc]] = Array.prototype[Lc[xc]]);
    }bc.defineProperty(Oc.prototype, "length", { value: 0, configurable: !1, writable: !0, enumerable: !0 }), Oc.prototype.isOperational = !0;var Ic = 0;Oc.prototype.toString = function () {
      var t = Array(4 * Ic + 1).join(" "),
          e = "\n" + t + "AggregateError of:\n";Ic++, t = Array(4 * Ic + 1).join(" ");for (var n = 0; n < this.length; ++n) {
        for (var r = this[n] === this ? "[Circular AggregateError]" : this[n] + "", i = r.split("\n"), o = 0; o < i.length; ++o) {
          i[o] = t + i[o];
        }r = i.join("\n"), e += r + "\n";
      }return Ic--, e;
    }, wc(gr, Error);var Pc = Error.__BluebirdErrorTypes__;Pc || (Pc = Cc({ CancellationError: Rc, TimeoutError: Fc, OperationalError: gr, RejectionError: gr, AggregateError: Oc }), kc(Error, "__BluebirdErrorTypes__", Pc));var jc = { Error: Error, TypeError: Tc, RangeError: Ac, CancellationError: Pc.CancellationError, OperationalError: Pc.OperationalError, TimeoutError: Pc.TimeoutError, AggregateError: Pc.AggregateError, Warning: Sc },
        Nc = function Nc(t, e) {
      function n(n, u) {
        if (c(n)) {
          if (n instanceof t) return n;if (i(n)) {
            var l = new t(e);return n._then(l._fulfillUnchecked, l._rejectUncheckedCheckError, l._progressUnchecked, l, null), l;
          }var f = s.tryCatch(r)(n);if (f === a) {
            u && u._pushContext();var l = t.reject(f.e);return u && u._popContext(), l;
          }if ("function" == typeof f) return o(n, f, u);
        }return n;
      }function r(t) {
        return t.then;
      }function i(t) {
        return u.call(t, "_promise0");
      }function o(n, r, i) {
        function o(t) {
          l && (l._resolveCallback(t), l = null);
        }function c(t) {
          l && (l._rejectCallback(t, p, !0), l = null);
        }function u(t) {
          l && "function" == typeof l._progress && l._progress(t);
        }var l = new t(e),
            f = l;i && i._pushContext(), l._captureStackTrace(), i && i._popContext();var p = !0,
            d = s.tryCatch(r).call(n, o, c, u);return p = !1, l && d === a && (l._rejectCallback(d.e, !0, !0), l = null), f;
      }var s = sc,
          a = s.errorObj,
          c = s.isObject,
          u = {}.hasOwnProperty;return n;
    },
        Uc = function Uc(t, e, n, r) {
      function i(t) {
        switch (t) {case -2:
            return [];case -3:
            return {};}
      }function o(n) {
        var r,
            i = this._promise = new t(e);n instanceof t && (r = n, i._propagateFrom(r, 5)), this._values = n, this._length = 0, this._totalResolved = 0, this._init(void 0, -2);
      }var s = sc,
          a = s.isArray;return o.prototype.length = function () {
        return this._length;
      }, o.prototype.promise = function () {
        return this._promise;
      }, o.prototype._init = function e(o, s) {
        var c = n(this._values, this._promise);if (c instanceof t) {
          if (c = c._target(), this._values = c, !c._isFulfilled()) return c._isPending() ? void c._then(e, this._reject, void 0, this, s) : void this._reject(c._reason());if (c = c._value(), !a(c)) {
            var u = new t.TypeError("expecting an array, a promise or a thenable\n\n    See http://goo.gl/s8MMhc\n");return void this.__hardReject__(u);
          }
        } else if (!a(c)) return void this._promise._reject(r("expecting an array, a promise or a thenable\n\n    See http://goo.gl/s8MMhc\n")._reason());if (0 === c.length) return void (s === -5 ? this._resolveEmptyArray() : this._resolve(i(s)));var l = this.getActualLength(c.length);this._length = l, this._values = this.shouldCopyValues() ? new Array(l) : this._values;for (var f = this._promise, p = 0; p < l; ++p) {
          var d = this._isResolved(),
              h = n(c[p], f);h instanceof t ? (h = h._target(), d ? h._ignoreRejections() : h._isPending() ? h._proxyPromiseArray(this, p) : h._isFulfilled() ? this._promiseFulfilled(h._value(), p) : this._promiseRejected(h._reason(), p)) : d || this._promiseFulfilled(h, p);
        }
      }, o.prototype._isResolved = function () {
        return null === this._values;
      }, o.prototype._resolve = function (t) {
        this._values = null, this._promise._fulfill(t);
      }, o.prototype.__hardReject__ = o.prototype._reject = function (t) {
        this._values = null, this._promise._rejectCallback(t, !1, !0);
      }, o.prototype._promiseProgressed = function (t, e) {
        this._promise._progress({ index: e, value: t });
      }, o.prototype._promiseFulfilled = function (t, e) {
        this._values[e] = t;var n = ++this._totalResolved;n >= this._length && this._resolve(this._values);
      }, o.prototype._promiseRejected = function (t, e) {
        this._totalResolved++, this._reject(t);
      }, o.prototype.shouldCopyValues = function () {
        return !0;
      }, o.prototype.getActualLength = function (t) {
        return t;
      }, o;
    },
        Dc = function Dc() {
      function t(e) {
        this._parent = e;var n = this._length = 1 + (void 0 === e ? 0 : e._length);y(this, t), n > 32 && this.uncycle();
      }function e(t, e) {
        for (var n = 0; n < e.length - 1; ++n) {
          e[n].push("From previous event:"), e[n] = e[n].join("\n");
        }return n < e.length && (e[n] = e[n].join("\n")), t + "\n" + e.join("\n");
      }function n(t) {
        for (var e = 0; e < t.length; ++e) {
          (0 === t[e].length || e + 1 < t.length && t[e][0] === t[e + 1][0]) && (t.splice(e, 1), e--);
        }
      }function r(t) {
        for (var e = t[0], n = 1; n < t.length; ++n) {
          for (var r = t[n], i = e.length - 1, o = e[i], s = -1, a = r.length - 1; a >= 0; --a) {
            if (r[a] === o) {
              s = a;break;
            }
          }for (var a = s; a >= 0; --a) {
            var c = r[a];if (e[i] !== c) break;e.pop(), i--;
          }e = r;
        }
      }function i(t) {
        for (var e = [], n = 0; n < t.length; ++n) {
          var r = t[n],
              i = d.test(r) || "    (No stack trace)" === r,
              o = i && v(r);i && !o && (m && " " !== r.charAt(0) && (r = "    " + r), e.push(r));
        }return e;
      }function o(t) {
        for (var e = t.stack.replace(/\s+$/g, "").split("\n"), n = 0; n < e.length; ++n) {
          var r = e[n];if ("    (No stack trace)" === r || d.test(r)) break;
        }return n > 0 && (e = e.slice(n)), e;
      }function s(t) {
        var e;if ("function" == typeof t) e = "[function " + (t.name || "anonymous") + "]";else {
          e = t.toString();var n = /\[object [a-zA-Z0-9$_]+\]/;if (n.test(e)) try {
            var r = JSON.stringify(t);e = r;
          } catch (t) {}0 === e.length && (e = "(empty array)");
        }return "(<" + a(e) + ">, no stack trace)";
      }function a(t) {
        var e = 41;return t.length < e ? t : t.substr(0, e - 3) + "...";
      }function c(t) {
        var e = t.match(_);if (e) return { fileName: e[1], line: parseInt(e[2], 10) };
      }var u,
          l = gc,
          f = sc,
          p = /[\\\/]bluebird[\\\/]js[\\\/](main|debug|zalgo|instrumented)/,
          d = null,
          h = null,
          m = !1;f.inherits(t, Error), t.prototype.uncycle = function () {
        var t = this._length;if (!(t < 2)) {
          for (var e = [], n = {}, r = 0, i = this; void 0 !== i; ++r) {
            e.push(i), i = i._parent;
          }t = this._length = r;for (var r = t - 1; r >= 0; --r) {
            var o = e[r].stack;void 0 === n[o] && (n[o] = r);
          }for (var r = 0; r < t; ++r) {
            var s = e[r].stack,
                a = n[s];if (void 0 !== a && a !== r) {
              a > 0 && (e[a - 1]._parent = void 0, e[a - 1]._length = 1), e[r]._parent = void 0, e[r]._length = 1;var c = r > 0 ? e[r - 1] : this;a < t - 1 ? (c._parent = e[a + 1], c._parent.uncycle(), c._length = c._parent._length + 1) : (c._parent = void 0, c._length = 1);for (var u = c._length + 1, l = r - 2; l >= 0; --l) {
                e[l]._length = u, u++;
              }return;
            }
          }
        }
      }, t.prototype.parent = function () {
        return this._parent;
      }, t.prototype.hasParent = function () {
        return void 0 !== this._parent;
      }, t.prototype.attachExtraTrace = function (o) {
        if (!o.__stackCleaned__) {
          this.uncycle();for (var s = t.parseStackAndMessage(o), a = s.message, c = [s.stack], u = this; void 0 !== u;) {
            c.push(i(u.stack.split("\n"))), u = u._parent;
          }r(c), n(c), f.notEnumerableProp(o, "stack", e(a, c)), f.notEnumerableProp(o, "__stackCleaned__", !0);
        }
      }, t.parseStackAndMessage = function (t) {
        var e = t.stack,
            n = t.toString();return e = "string" == typeof e && e.length > 0 ? o(t) : ["    (No stack trace)"], { message: n, stack: i(e) };
      }, t.formatAndLogError = function (t, e) {
        if ("undefined" != typeof console) {
          var n;if ("object" === ("undefined" == typeof t ? "undefined" : Tr(t)) || "function" == typeof t) {
            var r = t.stack;n = e + h(r, t);
          } else n = e + String(t);"function" == typeof u ? u(n) : "function" != typeof console.log && "object" !== Tr(console.log) || console.log(n);
        }
      }, t.unhandledRejection = function (e) {
        t.formatAndLogError(e, "^--- With additional stack trace: ");
      }, t.isSupported = function () {
        return "function" == typeof y;
      }, t.fireRejectionEvent = function (e, n, r, i) {
        var o = !1;try {
          "function" == typeof n && (o = !0, "rejectionHandled" === e ? n(i) : n(r, i));
        } catch (t) {
          l.throwLater(t);
        }var s = !1;try {
          s = b(e, r, i);
        } catch (t) {
          s = !0, l.throwLater(t);
        }var a = !1;if (g) try {
          a = g(e.toLowerCase(), { reason: r, promise: i });
        } catch (t) {
          a = !0, l.throwLater(t);
        }s || o || a || "unhandledRejection" !== e || t.formatAndLogError(r, "Unhandled rejection ");
      };var v = function v() {
        return !1;
      },
          _ = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;t.setBounds = function (e, n) {
        if (t.isSupported()) {
          for (var r, i, o = e.stack.split("\n"), s = n.stack.split("\n"), a = -1, u = -1, l = 0; l < o.length; ++l) {
            var f = c(o[l]);if (f) {
              r = f.fileName, a = f.line;break;
            }
          }for (var l = 0; l < s.length; ++l) {
            var f = c(s[l]);if (f) {
              i = f.fileName, u = f.line;break;
            }
          }a < 0 || u < 0 || !r || !i || r !== i || a >= u || (v = function v(t) {
            if (p.test(t)) return !0;var e = c(t);return !!(e && e.fileName === r && a <= e.line && e.line <= u);
          });
        }
      };var g,
          y = function () {
        var t = /^\s*at\s*/,
            e = function e(t, _e5) {
          return "string" == typeof t ? t : void 0 !== _e5.name && void 0 !== _e5.message ? _e5.toString() : s(_e5);
        };if ("number" == typeof Error.stackTraceLimit && "function" == typeof Error.captureStackTrace) {
          Error.stackTraceLimit = Error.stackTraceLimit + 6, d = t, h = e;var n = Error.captureStackTrace;return v = function v(t) {
            return p.test(t);
          }, function (t, e) {
            Error.stackTraceLimit = Error.stackTraceLimit + 6, n(t, e), Error.stackTraceLimit = Error.stackTraceLimit - 6;
          };
        }var r = new Error();if ("string" == typeof r.stack && r.stack.split("\n")[0].indexOf("stackDetection@") >= 0) return d = /@/, h = e, m = !0, function (t) {
          t.stack = new Error().stack;
        };var i;try {
          throw new Error();
        } catch (t) {
          i = "stack" in t;
        }return "stack" in r || !i || "number" != typeof Error.stackTraceLimit ? (h = function h(t, e) {
          return "string" == typeof t ? t : "object" !== ("undefined" == typeof e ? "undefined" : Tr(e)) && "function" != typeof e || void 0 === e.name || void 0 === e.message ? s(e) : e.toString();
        }, null) : (d = t, h = e, function (t) {
          Error.stackTraceLimit = Error.stackTraceLimit + 6;try {
            throw new Error();
          } catch (e) {
            t.stack = e.stack;
          }Error.stackTraceLimit = Error.stackTraceLimit - 6;
        });
      }([]),
          b = function () {
        if (f.isNode) return function (t, e, n) {
          return "rejectionHandled" === t ? process.emit(t, n) : process.emit(t, e, n);
        };var t = !1,
            e = !0;try {
          var n = new self.CustomEvent("test");t = n instanceof CustomEvent;
        } catch (t) {}if (!t) try {
          var r = document.createEvent("CustomEvent");r.initCustomEvent("testingtheevent", !1, !0, {}), self.dispatchEvent(r);
        } catch (t) {
          e = !1;
        }e && (g = function g(e, n) {
          var r;return t ? r = new self.CustomEvent(e, { detail: n, bubbles: !1, cancelable: !0 }) : self.dispatchEvent && (r = document.createEvent("CustomEvent"), r.initCustomEvent(e, !1, !0, n)), !!r && !self.dispatchEvent(r);
        });var i = {};return i.unhandledRejection = "onunhandledRejection".toLowerCase(), i.rejectionHandled = "onrejectionHandled".toLowerCase(), function (t, e, n) {
          var r = i[t],
              o = self[r];return !!o && ("rejectionHandled" === t ? o.call(self, n) : o.call(self, e, n), !0);
        };
      }();return "undefined" != typeof console && "undefined" != typeof console.warn && (u = function u(t) {
        console.warn(t);
      }, f.isNode && process.stderr.isTTY ? u = function u(t) {
        process.stderr.write("[31m" + t + "[39m\n");
      } : f.isNode || "string" != typeof new Error().stack || (u = function u(t) {
        console.warn("%c" + t, "color: red");
      })), t;
    },
        $c = function $c(t, e) {
      var n,
          r,
          i = t._getDomain,
          o = gc,
          s = jc.Warning,
          a = sc,
          c = a.canAttachTrace,
          u = a.isNode && (!!process.env.BLUEBIRD_DEBUG || "development" === process.env.NODE_ENV);return a.isNode && 0 == process.env.BLUEBIRD_DEBUG && (u = !1), u && o.disableTrampolineIfNecessary(), t.prototype._ignoreRejections = function () {
        this._unsetRejectionIsUnhandled(), this._bitField = 16777216 | this._bitField;
      }, t.prototype._ensurePossibleRejectionHandled = function () {
        0 === (16777216 & this._bitField) && (this._setRejectionIsUnhandled(), o.invokeLater(this._notifyUnhandledRejection, this, void 0));
      }, t.prototype._notifyUnhandledRejectionIsHandled = function () {
        e.fireRejectionEvent("rejectionHandled", n, void 0, this);
      }, t.prototype._notifyUnhandledRejection = function () {
        if (this._isRejectionUnhandled()) {
          var t = this._getCarriedStackTrace() || this._settledValue;this._setUnhandledRejectionIsNotified(), e.fireRejectionEvent("unhandledRejection", r, t, this);
        }
      }, t.prototype._setUnhandledRejectionIsNotified = function () {
        this._bitField = 524288 | this._bitField;
      }, t.prototype._unsetUnhandledRejectionIsNotified = function () {
        this._bitField = this._bitField & -524289;
      }, t.prototype._isUnhandledRejectionNotified = function () {
        return (524288 & this._bitField) > 0;
      }, t.prototype._setRejectionIsUnhandled = function () {
        this._bitField = 2097152 | this._bitField;
      }, t.prototype._unsetRejectionIsUnhandled = function () {
        this._bitField = this._bitField & -2097153, this._isUnhandledRejectionNotified() && (this._unsetUnhandledRejectionIsNotified(), this._notifyUnhandledRejectionIsHandled());
      }, t.prototype._isRejectionUnhandled = function () {
        return (2097152 & this._bitField) > 0;
      }, t.prototype._setCarriedStackTrace = function (t) {
        this._bitField = 1048576 | this._bitField, this._fulfillmentHandler0 = t;
      }, t.prototype._isCarryingStackTrace = function () {
        return (1048576 & this._bitField) > 0;
      }, t.prototype._getCarriedStackTrace = function () {
        return this._isCarryingStackTrace() ? this._fulfillmentHandler0 : void 0;
      }, t.prototype._captureStackTrace = function () {
        return u && (this._trace = new e(this._peekContext())), this;
      }, t.prototype._attachExtraTrace = function (t, n) {
        if (u && c(t)) {
          var r = this._trace;if (void 0 !== r && n && (r = r._parent), void 0 !== r) r.attachExtraTrace(t);else if (!t.__stackCleaned__) {
            var i = e.parseStackAndMessage(t);a.notEnumerableProp(t, "stack", i.message + "\n" + i.stack.join("\n")), a.notEnumerableProp(t, "__stackCleaned__", !0);
          }
        }
      }, t.prototype._warn = function (t) {
        var n = new s(t),
            r = this._peekContext();if (r) r.attachExtraTrace(n);else {
          var i = e.parseStackAndMessage(n);n.stack = i.message + "\n" + i.stack.join("\n");
        }e.formatAndLogError(n, "");
      }, t.onPossiblyUnhandledRejection = function (t) {
        var e = i();r = "function" == typeof t ? null === e ? t : e.bind(t) : void 0;
      }, t.onUnhandledRejectionHandled = function (t) {
        var e = i();n = "function" == typeof t ? null === e ? t : e.bind(t) : void 0;
      }, t.longStackTraces = function () {
        if (o.haveItemsQueued() && u === !1) throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/DT1qyG\n");u = e.isSupported(), u && o.disableTrampolineIfNecessary();
      }, t.hasLongStackTraces = function () {
        return u && e.isSupported();
      }, e.isSupported() || (t.longStackTraces = function () {}, u = !1), function () {
        return u;
      };
    },
        Mc = function Mc(t, e, n) {
      function r() {
        this._trace = new e(o());
      }function i() {
        if (n()) return new r();
      }function o() {
        var t = s.length - 1;if (t >= 0) return s[t];
      }var s = [];return r.prototype._pushContext = function () {
        n() && void 0 !== this._trace && s.push(this._trace);
      }, r.prototype._popContext = function () {
        n() && void 0 !== this._trace && s.pop();
      }, t.prototype._peekContext = o, t.prototype._pushContext = r.prototype._pushContext, t.prototype._popContext = r.prototype._popContext, i;
    },
        Hc = function Hc(t) {
      function e(t, e, n) {
        this._instances = t, this._callback = e, this._promise = n;
      }function n(t, e) {
        var n = {},
            r = o(t).call(n, e);if (r === s) return r;var i = a(n);return i.length ? (s.e = new c("Catch filter must inherit from Error or be a simple predicate function\n\n    See http://goo.gl/o84o68\n"), s) : r;
      }var r = sc,
          i = jc,
          o = r.tryCatch,
          s = r.errorObj,
          a = Xa.keys,
          c = i.TypeError;return e.prototype.doFilter = function (e) {
        for (var r = this._callback, i = this._promise, a = i._boundValue(), c = 0, u = this._instances.length; c < u; ++c) {
          var l = this._instances[c],
              f = l === Error || null != l && l.prototype instanceof Error;if (f && e instanceof l) {
            var p = o(r).call(a, e);return p === s ? (t.e = p.e, t) : p;
          }if ("function" == typeof l && !f) {
            var d = n(l, e);if (d === s) {
              e = s.e;break;
            }if (d) {
              var p = o(r).call(a, e);return p === s ? (t.e = p.e, t) : p;
            }
          }
        }return t.e = e, t;
      }, e;
    },
        Wc = sc,
        zc = Wc.maybeWrapAsError,
        Vc = jc,
        Bc = Vc.TimeoutError,
        Gc = Vc.OperationalError,
        Yc = Wc.haveGetters,
        Xc = Xa,
        qc = /^(?:name|message|stack|cause)$/,
        Qc;if (Qc = Yc ? function (t) {
      this.promise = t;
    } : function (t) {
      this.promise = t, this.asCallback = Cr(t), this.callback = this.asCallback;
    }, Yc) {
      var Kc = { get: function get$$1() {
          return Cr(this.promise);
        } };Xc.defineProperty(Qc.prototype, "asCallback", Kc), Xc.defineProperty(Qc.prototype, "callback", Kc);
    }Qc._nodebackForPromise = Cr, Qc.prototype.toString = function () {
      return "[object PromiseResolver]";
    }, Qc.prototype.resolve = Qc.prototype.fulfill = function (t) {
      if (!(this instanceof Qc)) throw new TypeError("Illegal invocation, resolver resolve/reject must be called within a resolver context. Consider using the promise constructor instead.\n\n    See http://goo.gl/sdkXL9\n");this.promise._resolveCallback(t);
    }, Qc.prototype.reject = function (t) {
      if (!(this instanceof Qc)) throw new TypeError("Illegal invocation, resolver resolve/reject must be called within a resolver context. Consider using the promise constructor instead.\n\n    See http://goo.gl/sdkXL9\n");this.promise._rejectCallback(t);
    }, Qc.prototype.progress = function (t) {
      if (!(this instanceof Qc)) throw new TypeError("Illegal invocation, resolver resolve/reject must be called within a resolver context. Consider using the promise constructor instead.\n\n    See http://goo.gl/sdkXL9\n");this.promise._progress(t);
    }, Qc.prototype.cancel = function (t) {
      this.promise.cancel(t);
    }, Qc.prototype.timeout = function () {
      this.reject(new Bc("timeout"));
    }, Qc.prototype.isResolved = function () {
      return this.promise.isResolved();
    }, Qc.prototype.toJSON = function () {
      return this.promise.toJSON();
    };var Jc = Qc,
        Zc = function Zc(t, e) {
      var n = sc,
          r = gc,
          i = n.tryCatch,
          o = n.errorObj;t.prototype.progressed = function (t) {
        return this._then(void 0, void 0, t, void 0, void 0);
      }, t.prototype._progress = function (t) {
        this._isFollowingOrFulfilledOrRejected() || this._target()._progressUnchecked(t);
      }, t.prototype._progressHandlerAt = function (t) {
        return 0 === t ? this._progressHandler0 : this[(t << 2) + t - 5 + 2];
      }, t.prototype._doProgressWith = function (e) {
        var r = e.value,
            s = e.handler,
            a = e.promise,
            c = e.receiver,
            u = i(s).call(c, r);if (u === o) {
          if (null != u.e && "StopProgressPropagation" !== u.e.name) {
            var l = n.canAttachTrace(u.e) ? u.e : new Error(n.toString(u.e));a._attachExtraTrace(l), a._progress(u.e);
          }
        } else u instanceof t ? u._then(a._progress, null, null, a, void 0) : a._progress(u);
      }, t.prototype._progressUnchecked = function (n) {
        for (var i = this._length(), o = this._progress, s = 0; s < i; s++) {
          var a = this._progressHandlerAt(s),
              c = this._promiseAt(s);if (c instanceof t) "function" == typeof a ? r.invoke(this._doProgressWith, this, { handler: a, promise: c, receiver: this._receiverAt(s), value: n }) : r.invoke(o, c, n);else {
            var u = this._receiverAt(s);"function" == typeof a ? a.call(u, n, c) : u instanceof e && !u._isResolved() && u._promiseProgressed(n, c);
          }
        }
      };
    },
        tu = function tu(t, e, n, r) {
      var i = sc,
          o = i.tryCatch;t.method = function (n) {
        if ("function" != typeof n) throw new t.TypeError("fn must be a function\n\n    See http://goo.gl/916lJJ\n");return function () {
          var r = new t(e);r._captureStackTrace(), r._pushContext();var i = o(n).apply(this, arguments);return r._popContext(), r._resolveFromSyncValue(i), r;
        };
      }, t.attempt = t.try = function (n, s, a) {
        if ("function" != typeof n) return r("fn must be a function\n\n    See http://goo.gl/916lJJ\n");var c = new t(e);c._captureStackTrace(), c._pushContext();var u = i.isArray(s) ? o(n).apply(a, s) : o(n).call(a, s);return c._popContext(), c._resolveFromSyncValue(u), c;
      }, t.prototype._resolveFromSyncValue = function (t) {
        t === i.errorObj ? this._rejectCallback(t.e, !1, !0) : this._resolveCallback(t, !0);
      };
    },
        eu = function eu(t, e, n) {
      var r = function r(t, e) {
        this._reject(e);
      },
          i = function i(t, e) {
        e.promiseRejectionQueued = !0, e.bindingPromise._then(r, r, null, this, t);
      },
          o = function o(t, e) {
        this._isPending() && this._resolveCallback(e.target);
      },
          s = function s(t, e) {
        e.promiseRejectionQueued || this._reject(t);
      };t.prototype.bind = function (r) {
        var a = n(r),
            c = new t(e);c._propagateFrom(this, 1);var u = this._target();if (c._setBoundTo(a), a instanceof t) {
          var l = { promiseRejectionQueued: !1, promise: c, target: u, bindingPromise: a };u._then(e, i, c._progress, c, l), a._then(o, s, c._progress, c, l);
        } else c._resolveCallback(u);return c;
      }, t.prototype._setBoundTo = function (t) {
        void 0 !== t ? (this._bitField = 131072 | this._bitField, this._boundTo = t) : this._bitField = this._bitField & -131073;
      }, t.prototype._isBound = function () {
        return 131072 === (131072 & this._bitField);
      }, t.bind = function (r, i) {
        var o = n(r),
            s = new t(e);return s._setBoundTo(o), o instanceof t ? o._then(function () {
          s._resolveCallback(i);
        }, s._reject, s._progress, s, null) : s._resolveCallback(i), s;
      };
    },
        nu = function nu(t, e, n) {
      function r() {
        return this;
      }function i() {
        throw this;
      }function o(t) {
        return function () {
          return t;
        };
      }function s(t) {
        return function () {
          throw t;
        };
      }function a(t, e, n) {
        var a;return a = f(e) ? n ? o(e) : s(e) : n ? r : i, t._then(a, p, void 0, e, void 0);
      }function c(r) {
        var i = this.promise,
            o = this.handler,
            s = i._isBound() ? o.call(i._boundValue()) : o();if (void 0 !== s) {
          var c = n(s, i);if (c instanceof t) return c = c._target(), a(c, r, i.isFulfilled());
        }return i.isRejected() ? (e.e = r, e) : r;
      }function u(e) {
        var r = this.promise,
            i = this.handler,
            o = r._isBound() ? i.call(r._boundValue(), e) : i(e);if (void 0 !== o) {
          var s = n(o, r);if (s instanceof t) return s = s._target(), a(s, e, !0);
        }return e;
      }var l = sc,
          f = l.isPrimitive,
          p = l.thrower;t.prototype._passThroughHandler = function (t, e) {
        if ("function" != typeof t) return this.then();var n = { promise: this, handler: t };return this._then(e ? c : u, e ? c : void 0, void 0, n, void 0);
      }, t.prototype.lastly = t.prototype.finally = function (t) {
        return this._passThroughHandler(t, !0);
      }, t.prototype.tap = function (t) {
        return this._passThroughHandler(t, !1);
      };
    },
        ru = sc,
        iu = ru.isPrimitive,
        ou = function ou(t) {
      var e = function e() {
        return this;
      },
          n = function n() {
        throw this;
      },
          r = function r() {},
          i = function i() {
        throw void 0;
      },
          o = function o(t, e) {
        return 1 === e ? function () {
          throw t;
        } : 2 === e ? function () {
          return t;
        } : void 0;
      };t.prototype.return = t.prototype.thenReturn = function (n) {
        return void 0 === n ? this.then(r) : iu(n) ? this._then(o(n, 2), void 0, void 0, void 0, void 0) : (n instanceof t && n._ignoreRejections(), this._then(e, void 0, void 0, n, void 0));
      }, t.prototype.throw = t.prototype.thenThrow = function (t) {
        return void 0 === t ? this.then(i) : iu(t) ? this._then(o(t, 1), void 0, void 0, void 0, void 0) : this._then(n, void 0, void 0, t, void 0);
      };
    },
        su = function su(t) {
      function e(t) {
        void 0 !== t ? (t = t._target(), this._bitField = t._bitField, this._settledValue = t._settledValue) : (this._bitField = 0, this._settledValue = void 0);
      }e.prototype.value = function () {
        if (!this.isFulfilled()) throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/hc1DLj\n");return this._settledValue;
      }, e.prototype.error = e.prototype.reason = function () {
        if (!this.isRejected()) throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/hPuiwB\n");return this._settledValue;
      }, e.prototype.isFulfilled = t.prototype._isFulfilled = function () {
        return (268435456 & this._bitField) > 0;
      }, e.prototype.isRejected = t.prototype._isRejected = function () {
        return (134217728 & this._bitField) > 0;
      }, e.prototype.isPending = t.prototype._isPending = function () {
        return 0 === (402653184 & this._bitField);
      }, e.prototype.isResolved = t.prototype._isResolved = function () {
        return (402653184 & this._bitField) > 0;
      }, t.prototype.isPending = function () {
        return this._target()._isPending();
      }, t.prototype.isRejected = function () {
        return this._target()._isRejected();
      }, t.prototype.isFulfilled = function () {
        return this._target()._isFulfilled();
      }, t.prototype.isResolved = function () {
        return this._target()._isResolved();
      }, t.prototype._value = function () {
        return this._settledValue;
      }, t.prototype._reason = function () {
        return this._unsetRejectionIsUnhandled(), this._settledValue;
      }, t.prototype.value = function () {
        var t = this._target();if (!t.isFulfilled()) throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/hc1DLj\n");return t._settledValue;
      }, t.prototype.reason = function () {
        var t = this._target();if (!t.isRejected()) throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/hPuiwB\n");return t._unsetRejectionIsUnhandled(), t._settledValue;
      }, t.PromiseInspection = e;
    },
        au = function au(t, e, n, r) {
      var i,
          o = sc,
          s = o.canEvaluate,
          a = o.tryCatch,
          c = o.errorObj;if (s) {
        for (var u = function u(t) {
          return new Function("value", "holder", "                             \n            'use strict';                                                    \n            holder.pIndex = value;                                           \n            holder.checkFulfillment(this);                                   \n            ".replace(/Index/g, t));
        }, l = function l(t) {
          for (var e = [], n = 1; n <= t; ++n) {
            e.push("holder.p" + n);
          }return new Function("holder", "                                      \n            'use strict';                                                    \n            var callback = holder.fn;                                        \n            return callback(values);                                         \n            ".replace(/values/g, e.join(", ")));
        }, f = [], p = [void 0], d = 1; d <= 5; ++d) {
          f.push(u(d)), p.push(l(d));
        }var h = function h(t, e) {
          this.p1 = this.p2 = this.p3 = this.p4 = this.p5 = null, this.fn = e, this.total = t, this.now = 0;
        };h.prototype.callers = p, h.prototype.checkFulfillment = function (t) {
          var e = this.now;e++;var n = this.total;if (e >= n) {
            var r = this.callers[n];t._pushContext();var i = a(r)(this);t._popContext(), i === c ? t._rejectCallback(i.e, !1, !0) : t._resolveCallback(i);
          } else this.now = e;
        };var i = function i(t) {
          this._reject(t);
        };
      }t.join = function () {
        var o,
            a = arguments.length - 1;if (a > 0 && "function" == typeof arguments[a] && (o = arguments[a], a < 6 && s)) {
          var c = new t(r);c._captureStackTrace();for (var u = new h(a, o), l = f, p = 0; p < a; ++p) {
            var d = n(arguments[p], c);d instanceof t ? (d = d._target(), d._isPending() ? d._then(l[p], i, void 0, c, u) : d._isFulfilled() ? l[p].call(c, d._value(), u) : c._reject(d._reason())) : l[p].call(c, d, u);
          }return c;
        }for (var m = arguments.length, v = new Array(m), _ = 0; _ < m; ++_) {
          v[_] = arguments[_];
        }o && v.pop();var c = new e(v).promise();return void 0 !== o ? c.spread(o) : c;
      };
    },
        cu = function t(e, n, r, i, o) {
      function s(t, e, n, r) {
        this.constructor$(t), this._promise._captureStackTrace();var i = c();this._callback = null === i ? e : i.bind(e), this._preservedValues = r === o ? new Array(this.length()) : null, this._limit = n, this._inFlight = 0, this._queue = n >= 1 ? [] : h, u.invoke(a, this, void 0);
      }function a() {
        this._init$(void 0, -2);
      }function t(t, e, n, r) {
        var i = "object" === ("undefined" == typeof n ? "undefined" : Tr(n)) && null !== n ? n.concurrency : 0;return i = "number" == typeof i && isFinite(i) && i >= 1 ? i : 0, new s(t, e, i, r);
      }var c = e._getDomain,
          u = gc,
          l = sc,
          f = l.tryCatch,
          p = l.errorObj,
          d = {},
          h = [];l.inherits(s, n), s.prototype._init = function () {}, s.prototype._promiseFulfilled = function (t, n) {
        var r = this._values,
            o = this.length(),
            s = this._preservedValues,
            a = this._limit;if (r[n] === d) {
          if (r[n] = t, a >= 1 && (this._inFlight--, this._drainQueue(), this._isResolved())) return;
        } else {
          if (a >= 1 && this._inFlight >= a) return r[n] = t, void this._queue.push(n);null !== s && (s[n] = t);var c = this._callback,
              u = this._promise._boundValue();this._promise._pushContext();var l = f(c).call(u, t, n, o);if (this._promise._popContext(), l === p) return this._reject(l.e);var h = i(l, this._promise);if (h instanceof e) {
            if (h = h._target(), h._isPending()) return a >= 1 && this._inFlight++, r[n] = d, h._proxyPromiseArray(this, n);if (!h._isFulfilled()) return this._reject(h._reason());l = h._value();
          }r[n] = l;
        }var m = ++this._totalResolved;m >= o && (null !== s ? this._filter(r, s) : this._resolve(r));
      }, s.prototype._drainQueue = function () {
        for (var t = this._queue, e = this._limit, n = this._values; t.length > 0 && this._inFlight < e;) {
          if (this._isResolved()) return;var r = t.pop();this._promiseFulfilled(n[r], r);
        }
      }, s.prototype._filter = function (t, e) {
        for (var n = e.length, r = new Array(n), i = 0, o = 0; o < n; ++o) {
          t[o] && (r[i++] = e[o]);
        }r.length = i, this._resolve(r);
      }, s.prototype.preservedValues = function () {
        return this._preservedValues;
      }, e.prototype.map = function (e, n) {
        return "function" != typeof e ? r("fn must be a function\n\n    See http://goo.gl/916lJJ\n") : t(this, e, n, null).promise();
      }, e.map = function (e, n, i, o) {
        return "function" != typeof n ? r("fn must be a function\n\n    See http://goo.gl/916lJJ\n") : t(e, n, i, o).promise();
      };
    },
        uu = function uu(t) {
      var e = jc,
          n = gc,
          r = e.CancellationError;t.prototype._cancel = function (t) {
        if (!this.isCancellable()) return this;for (var e, n = this; void 0 !== (e = n._cancellationParent) && e.isCancellable();) {
          n = e;
        }this._unsetCancellable(), n._target()._rejectCallback(t, !1, !0);
      }, t.prototype.cancel = function (t) {
        return this.isCancellable() ? (void 0 === t && (t = new r()), n.invokeLater(this._cancel, this, t), this) : this;
      }, t.prototype.cancellable = function () {
        return this._cancellable() ? this : (n.enableTrampoline(), this._setCancellable(), this._cancellationParent = void 0, this);
      }, t.prototype.uncancellable = function () {
        var t = this.then();return t._unsetCancellable(), t;
      }, t.prototype.fork = function (t, e, n) {
        var r = this._then(t, e, n, void 0, void 0);return r._setCancellable(), r._cancellationParent = void 0, r;
      };
    },
        lu = function lu(t, e, n, r) {
      function i(e) {
        for (var n = e.length, r = 0; r < n; ++r) {
          var i = e[r];if (i.isRejected()) return t.reject(i.error());e[r] = i._settledValue;
        }return e;
      }function o(t) {
        setTimeout(function () {
          throw t;
        }, 0);
      }function s(t) {
        var e = n(t);return e !== t && "function" == typeof t._isDisposable && "function" == typeof t._getDisposer && t._isDisposable() && e._setDisposable(t._getDisposer()), e;
      }function a(e, r) {
        function i() {
          if (a >= c) return u.resolve();var l = s(e[a++]);if (l instanceof t && l._isDisposable()) {
            try {
              l = n(l._getDisposer().tryDispose(r), e.promise);
            } catch (t) {
              return o(t);
            }if (l instanceof t) return l._then(i, o, null, null, null);
          }i();
        }var a = 0,
            c = e.length,
            u = t.defer();return i(), u.promise;
      }function c(t) {
        var e = new m();return e._settledValue = t, e._bitField = 268435456, a(this, e).thenReturn(t);
      }function u(t) {
        var e = new m();return e._settledValue = t, e._bitField = 134217728, a(this, e).thenThrow(t);
      }function l(t, e, n) {
        this._data = t, this._promise = e, this._context = n;
      }function f(t, e, n) {
        this.constructor$(t, e, n);
      }function p(t) {
        return l.isDisposer(t) ? (this.resources[this.index]._setDisposable(t), t.promise()) : t;
      }var d = jc.TypeError,
          h = sc.inherits,
          m = t.PromiseInspection;l.prototype.data = function () {
        return this._data;
      }, l.prototype.promise = function () {
        return this._promise;
      }, l.prototype.resource = function () {
        return this.promise().isFulfilled() ? this.promise().value() : null;
      }, l.prototype.tryDispose = function (t) {
        var e = this.resource(),
            n = this._context;void 0 !== n && n._pushContext();var r = null !== e ? this.doDispose(e, t) : null;return void 0 !== n && n._popContext(), this._promise._unsetDisposable(), this._data = null, r;
      }, l.isDisposer = function (t) {
        return null != t && "function" == typeof t.resource && "function" == typeof t.tryDispose;
      }, h(f, l), f.prototype.doDispose = function (t, e) {
        var n = this.data();return n.call(t, t, e);
      }, t.using = function () {
        var r = arguments.length;if (r < 2) return e("you must pass at least 2 arguments to Promise.using");var o = arguments[r - 1];if ("function" != typeof o) return e("fn must be a function\n\n    See http://goo.gl/916lJJ\n");var s,
            a = !0;2 === r && Array.isArray(arguments[0]) ? (s = arguments[0], r = s.length, a = !1) : (s = arguments, r--);for (var f = new Array(r), d = 0; d < r; ++d) {
          var h = s[d];if (l.isDisposer(h)) {
            var m = h;h = h.promise(), h._setDisposable(m);
          } else {
            var v = n(h);v instanceof t && (h = v._then(p, null, null, { resources: f, index: d }, void 0));
          }f[d] = h;
        }var _ = t.settle(f).then(i).then(function (t) {
          _._pushContext();var e;try {
            e = a ? o.apply(void 0, t) : o.call(void 0, t);
          } finally {
            _._popContext();
          }return e;
        })._then(c, u, void 0, f, void 0);return f.promise = _, _;
      }, t.prototype._setDisposable = function (t) {
        this._bitField = 262144 | this._bitField, this._disposer = t;
      }, t.prototype._isDisposable = function () {
        return (262144 & this._bitField) > 0;
      }, t.prototype._getDisposer = function () {
        return this._disposer;
      }, t.prototype._unsetDisposable = function () {
        this._bitField = this._bitField & -262145, this._disposer = void 0;
      }, t.prototype.disposer = function (t) {
        if ("function" == typeof t) return new f(t, this, r());throw new d();
      };
    },
        fu = function fu(t, e, n, r) {
      function i(e, n, i) {
        for (var o = 0; o < n.length; ++o) {
          i._pushContext();var s = l(n[o])(e);if (i._popContext(), s === u) {
            i._pushContext();var a = t.reject(u.e);return i._popContext(), a;
          }var c = r(s, i);if (c instanceof t) return c;
        }return null;
      }function o(e, r, i, o) {
        var s = this._promise = new t(n);s._captureStackTrace(), this._stack = o, this._generatorFunction = e, this._receiver = r, this._generator = void 0, this._yieldHandlers = "function" == typeof i ? [i].concat(f) : f;
      }var s = jc,
          a = s.TypeError,
          c = sc,
          u = c.errorObj,
          l = c.tryCatch,
          f = [];o.prototype.promise = function () {
        return this._promise;
      }, o.prototype._run = function () {
        this._generator = this._generatorFunction.call(this._receiver), this._receiver = this._generatorFunction = void 0, this._next(void 0);
      }, o.prototype._continue = function (e) {
        if (e === u) return this._promise._rejectCallback(e.e, !1, !0);var n = e.value;if (e.done === !0) this._promise._resolveCallback(n);else {
          var o = r(n, this._promise);if (!(o instanceof t) && (o = i(o, this._yieldHandlers, this._promise), null === o)) return void this._throw(new a("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/4Y4pDk\n\n".replace("%s", n) + "From coroutine:\n" + this._stack.split("\n").slice(1, -7).join("\n")));o._then(this._next, this._throw, void 0, this, null);
        }
      }, o.prototype._throw = function (t) {
        this._promise._attachExtraTrace(t), this._promise._pushContext();var e = l(this._generator.throw).call(this._generator, t);this._promise._popContext(), this._continue(e);
      }, o.prototype._next = function (t) {
        this._promise._pushContext();var e = l(this._generator.next).call(this._generator, t);this._promise._popContext(), this._continue(e);
      }, t.coroutine = function (t, e) {
        if ("function" != typeof t) throw new a("generatorFunction must be a function\n\n    See http://goo.gl/6Vqhm0\n");var n = Object(e).yieldHandler,
            r = o,
            i = new Error().stack;return function () {
          var e = t.apply(this, arguments),
              o = new r(void 0, void 0, n, i);return o._generator = e, o._next(void 0), o.promise();
        };
      }, t.coroutine.addYieldHandler = function (t) {
        if ("function" != typeof t) throw new a("fn must be a function\n\n    See http://goo.gl/916lJJ\n");f.push(t);
      }, t.spawn = function (n) {
        if ("function" != typeof n) return e("generatorFunction must be a function\n\n    See http://goo.gl/6Vqhm0\n");var r = new o(n, this),
            i = r.promise();return r._run(t.spawn), i;
      };
    },
        pu = function pu(t) {
      function e(t, e) {
        var r = this;if (!i.isArray(t)) return n.call(r, t, e);var c = s(e).apply(r._boundValue(), [null].concat(t));c === a && o.throwLater(c.e);
      }function n(t, e) {
        var n = this,
            r = n._boundValue(),
            i = void 0 === t ? s(e).call(r, null) : s(e).call(r, null, t);i === a && o.throwLater(i.e);
      }function r(t, e) {
        var n = this;if (!t) {
          var r = n._target(),
              i = r._getCarriedStackTrace();i.cause = t, t = i;
        }var c = s(e).call(n._boundValue(), t);c === a && o.throwLater(c.e);
      }var i = sc,
          o = gc,
          s = i.tryCatch,
          a = i.errorObj;t.prototype.asCallback = t.prototype.nodeify = function (t, i) {
        if ("function" == typeof t) {
          var o = n;void 0 !== i && Object(i).spread && (o = e), this._then(o, r, void 0, this, t);
        }return this;
      };
    },
        du = Object.create;if (du) {
      var hu = du(null),
          mu = du(null);hu[" size"] = mu[" size"] = 0;
    }var vu = function vu(t) {
      function e(e, n) {
        var r;if (null != e && (r = e[n]), "function" != typeof r) {
          var i = "Object " + a.classString(e) + " has no method '" + a.toString(n) + "'";throw new t.TypeError(i);
        }return r;
      }function n(t) {
        var n = this.pop(),
            r = e(t, n);return r.apply(t, this);
      }function r(t) {
        return t[this];
      }function i(t) {
        var e = +this;return e < 0 && (e = Math.max(0, e + t.length)), t[e];
      }var o,
          s,
          a = sc,
          c = a.canEvaluate,
          u = a.isIdentifier,
          l = function l(t) {
        return new Function("ensureMethod", "                                    \n        return function(obj) {                                               \n            'use strict'                                                     \n            var len = this.length;                                           \n            ensureMethod(obj, 'methodName');                                 \n            switch(len) {                                                    \n                case 1: return obj.methodName(this[0]);                      \n                case 2: return obj.methodName(this[0], this[1]);             \n                case 3: return obj.methodName(this[0], this[1], this[2]);    \n                case 0: return obj.methodName();                             \n                default:                                                     \n                    return obj.methodName.apply(obj, this);                  \n            }                                                                \n        };                                                                   \n        ".replace(/methodName/g, t))(e);
      },
          f = function f(t) {
        return new Function("obj", "                                             \n        'use strict';                                                        \n        return obj.propertyName;                                             \n        ".replace("propertyName", t));
      },
          p = function p(t, e, n) {
        var r = n[t];if ("function" != typeof r) {
          if (!u(t)) return null;if (r = e(t), n[t] = r, n[" size"]++, n[" size"] > 512) {
            for (var i = Object.keys(n), o = 0; o < 256; ++o) {
              delete n[i[o]];
            }n[" size"] = i.length - 256;
          }
        }return r;
      };o = function o(t) {
        return p(t, l, hu);
      }, s = function s(t) {
        return p(t, f, mu);
      }, t.prototype.call = function (t) {
        for (var e = arguments.length, r = new Array(e - 1), i = 1; i < e; ++i) {
          r[i - 1] = arguments[i];
        }if (c) {
          var s = o(t);if (null !== s) return this._then(s, void 0, void 0, r, void 0);
        }return r.push(t), this._then(n, void 0, void 0, r, void 0);
      }, t.prototype.get = function (t) {
        var e,
            n = "number" == typeof t;if (n) e = i;else if (c) {
          var o = s(t);e = null !== o ? o : r;
        } else e = r;return this._then(e, void 0, void 0, t, void 0);
      };
    },
        _u = function t(e, n, r, i) {
      function o(t) {
        for (var e = c.keys(t), n = e.length, r = new Array(2 * n), i = 0; i < n; ++i) {
          var o = e[i];r[i] = t[o], r[i + n] = o;
        }this.constructor$(r);
      }function t(t) {
        var n,
            s = r(t);return a(s) ? (n = s instanceof e ? s._then(e.props, void 0, void 0, void 0, void 0) : new o(s).promise(), s instanceof e && n._propagateFrom(s, 4), n) : i("cannot await properties of a non-object\n\n    See http://goo.gl/OsFKC8\n");
      }var s = sc,
          a = s.isObject,
          c = Xa;s.inherits(o, n), o.prototype._init = function () {
        this._init$(void 0, -3);
      }, o.prototype._promiseFulfilled = function (t, e) {
        this._values[e] = t;var n = ++this._totalResolved;if (n >= this._length) {
          for (var r = {}, i = this.length(), o = 0, s = this.length(); o < s; ++o) {
            r[this._values[o + i]] = this._values[o];
          }this._resolve(r);
        }
      }, o.prototype._promiseProgressed = function (t, e) {
        this._promise._progress({ key: this._values[e + this.length()], value: t });
      }, o.prototype.shouldCopyValues = function () {
        return !1;
      }, o.prototype.getActualLength = function (t) {
        return t >> 1;
      }, e.prototype.props = function () {
        return t(this);
      }, e.props = function (e) {
        return t(e);
      };
    },
        gu = function t(e, n, r, i) {
      function t(t, a) {
        var c = r(t);if (c instanceof e) return s(c);if (!o(t)) return i("expecting an array, a promise or a thenable\n\n    See http://goo.gl/s8MMhc\n");var u = new e(n);void 0 !== a && u._propagateFrom(a, 5);for (var l = u._fulfill, f = u._reject, p = 0, d = t.length; p < d; ++p) {
          var h = t[p];(void 0 !== h || p in t) && e.cast(h)._then(l, f, void 0, u, null);
        }return u;
      }var o = sc.isArray,
          s = function s(e) {
        return e.then(function (n) {
          return t(n, e);
        });
      };e.race = function (e) {
        return t(e, void 0);
      }, e.prototype.race = function () {
        return t(this, void 0);
      };
    },
        yu = function t(e, n, r, i, o) {
      function s(t, n, r, s) {
        this.constructor$(t), this._promise._captureStackTrace(), this._preservedValues = s === o ? [] : null, this._zerothIsAccum = void 0 === r, this._gotAccum = !1, this._reducingIndex = this._zerothIsAccum ? 1 : 0, this._valuesPhase = void 0;var l = i(r, this._promise),
            f = !1,
            p = l instanceof e;p && (l = l._target(), l._isPending() ? l._proxyPromiseArray(this, -1) : l._isFulfilled() ? (r = l._value(), this._gotAccum = !0) : (this._reject(l._reason()), f = !0)), p || this._zerothIsAccum || (this._gotAccum = !0);var d = c();this._callback = null === d ? n : d.bind(n), this._accum = r, f || u.invoke(a, this, void 0);
      }function a() {
        this._init$(void 0, -5);
      }function t(t, e, n, i) {
        if ("function" != typeof e) return r("fn must be a function\n\n    See http://goo.gl/916lJJ\n");var o = new s(t, e, n, i);return o.promise();
      }var c = e._getDomain,
          u = gc,
          l = sc,
          f = l.tryCatch,
          p = l.errorObj;l.inherits(s, n), s.prototype._init = function () {}, s.prototype._resolveEmptyArray = function () {
        (this._gotAccum || this._zerothIsAccum) && this._resolve(null !== this._preservedValues ? [] : this._accum);
      }, s.prototype._promiseFulfilled = function (t, n) {
        var r = this._values;r[n] = t;var o,
            s = this.length(),
            a = this._preservedValues,
            c = null !== a,
            u = this._gotAccum,
            l = this._valuesPhase;if (!l) for (l = this._valuesPhase = new Array(s), o = 0; o < s; ++o) {
          l[o] = 0;
        }if (o = l[n], 0 === n && this._zerothIsAccum ? (this._accum = t, this._gotAccum = u = !0, l[n] = 0 === o ? 1 : 2) : n === -1 ? (this._accum = t, this._gotAccum = u = !0) : 0 === o ? l[n] = 1 : (l[n] = 2, this._accum = t), u) {
          for (var d, h = this._callback, m = this._promise._boundValue(), v = this._reducingIndex; v < s; ++v) {
            if (o = l[v], 2 !== o) {
              if (1 !== o) return;if (t = r[v], this._promise._pushContext(), c ? (a.push(t), d = f(h).call(m, t, v, s)) : d = f(h).call(m, this._accum, t, v, s), this._promise._popContext(), d === p) return this._reject(d.e);var _ = i(d, this._promise);if (_ instanceof e) {
                if (_ = _._target(), _._isPending()) return l[v] = 4, _._proxyPromiseArray(this, v);if (!_._isFulfilled()) return this._reject(_._reason());d = _._value();
              }this._reducingIndex = v + 1, this._accum = d;
            } else this._reducingIndex = v + 1;
          }this._resolve(c ? a : this._accum);
        }
      }, e.prototype.reduce = function (e, n) {
        return t(this, e, n, null);
      }, e.reduce = function (e, n, r, i) {
        return t(e, n, r, i);
      };
    },
        bu = function bu(t, e) {
      function n(t) {
        this.constructor$(t);
      }var r = t.PromiseInspection,
          i = sc;i.inherits(n, e), n.prototype._promiseResolved = function (t, e) {
        this._values[t] = e;var n = ++this._totalResolved;n >= this._length && this._resolve(this._values);
      }, n.prototype._promiseFulfilled = function (t, e) {
        var n = new r();n._bitField = 268435456, n._settledValue = t, this._promiseResolved(e, n);
      }, n.prototype._promiseRejected = function (t, e) {
        var n = new r();n._bitField = 134217728, n._settledValue = t, this._promiseResolved(e, n);
      }, t.settle = function (t) {
        return new n(t).promise();
      }, t.prototype.settle = function () {
        return new n(this).promise();
      };
    },
        Cu = function t(e, n, r) {
      function i(t) {
        this.constructor$(t), this._howMany = 0, this._unwrap = !1, this._initialized = !1;
      }function t(t, e) {
        if ((0 | e) !== e || e < 0) return r("expecting a positive integer\n\n    See http://goo.gl/1wAmHx\n");var n = new i(t),
            o = n.promise();return n.setHowMany(e), n.init(), o;
      }var o = sc,
          s = jc.RangeError,
          a = jc.AggregateError,
          c = o.isArray;o.inherits(i, n), i.prototype._init = function () {
        if (this._initialized) {
          if (0 === this._howMany) return void this._resolve([]);this._init$(void 0, -5);var t = c(this._values);!this._isResolved() && t && this._howMany > this._canPossiblyFulfill() && this._reject(this._getRangeError(this.length()));
        }
      }, i.prototype.init = function () {
        this._initialized = !0, this._init();
      }, i.prototype.setUnwrap = function () {
        this._unwrap = !0;
      }, i.prototype.howMany = function () {
        return this._howMany;
      }, i.prototype.setHowMany = function (t) {
        this._howMany = t;
      }, i.prototype._promiseFulfilled = function (t) {
        this._addFulfilled(t), this._fulfilled() === this.howMany() && (this._values.length = this.howMany(), 1 === this.howMany() && this._unwrap ? this._resolve(this._values[0]) : this._resolve(this._values));
      }, i.prototype._promiseRejected = function (t) {
        if (this._addRejected(t), this.howMany() > this._canPossiblyFulfill()) {
          for (var e = new a(), n = this.length(); n < this._values.length; ++n) {
            e.push(this._values[n]);
          }this._reject(e);
        }
      }, i.prototype._fulfilled = function () {
        return this._totalResolved;
      }, i.prototype._rejected = function () {
        return this._values.length - this.length();
      }, i.prototype._addRejected = function (t) {
        this._values.push(t);
      }, i.prototype._addFulfilled = function (t) {
        this._values[this._totalResolved++] = t;
      }, i.prototype._canPossiblyFulfill = function () {
        return this.length() - this._rejected();
      }, i.prototype._getRangeError = function (t) {
        var e = "Input array must contain at least " + this._howMany + " items but contains only " + t + " items";return new s(e);
      }, i.prototype._resolveEmptyArray = function () {
        this._reject(this._getRangeError(0));
      }, e.some = function (e, n) {
        return t(e, n);
      }, e.prototype.some = function (e) {
        return t(this, e);
      }, e._SomePromiseArray = i;
    },
        Eu = function t(e, n) {
      function r(t) {
        return !C.test(t);
      }function i(t) {
        try {
          return t.__isPromisified__ === !0;
        } catch (t) {
          return !1;
        }
      }function o(t, e, n) {
        var r = p.getDataPropertyOrDefault(t, e + n, y);return !!r && i(r);
      }function s(t, e, n) {
        for (var r = 0; r < t.length; r += 2) {
          var i = t[r];if (n.test(i)) for (var o = i.replace(n, ""), s = 0; s < t.length; s += 2) {
            if (t[s] === o) throw new _("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/iWrZbw\n".replace("%s", e));
          }
        }
      }function a(t, e, n, r) {
        for (var a = p.inheritedDataKeys(t), c = [], u = 0; u < a.length; ++u) {
          var l = a[u],
              f = t[l],
              d = r === E || E(l, f, t);"function" != typeof f || i(f) || o(t, l, e) || !r(l, f, t, d) || c.push(l, f);
        }return s(c, e, n), c;
      }function c(t, r, i, o) {
        function s() {
          var i = r;r === f && (i = this);var o = new e(n);o._captureStackTrace();var s = "string" == typeof c && this !== a ? this[c] : t,
              u = d(o);try {
            s.apply(i, h(arguments, u));
          } catch (t) {
            o._rejectCallback(m(t), !0, !0);
          }return o;
        }var a = function () {
          return this;
        }(),
            c = t;return "string" == typeof c && (t = o), p.notEnumerableProp(s, "__isPromisified__", !0), s;
      }function u(t, e, n, r) {
        for (var i = new RegExp(w(e) + "$"), o = a(t, e, i, n), s = 0, c = o.length; s < c; s += 2) {
          var u = o[s],
              l = o[s + 1],
              d = u + e;if (r === R) t[d] = R(u, f, u, l, e);else {
            var h = r(l, function () {
              return R(u, f, u, l, e);
            });p.notEnumerableProp(h, "__isPromisified__", !0), t[d] = h;
          }
        }return p.toFastProperties(t), t;
      }function t(t, e) {
        return R(t, e, void 0, t);
      }var l,
          f = {},
          p = sc,
          d = Jc._nodebackForPromise,
          h = p.withAppended,
          m = p.maybeWrapAsError,
          v = p.canEvaluate,
          _ = jc.TypeError,
          g = "Async",
          y = { __isPromisified__: !0 },
          b = ["arity", "length", "name", "arguments", "caller", "callee", "prototype", "__isPromisified__"],
          C = new RegExp("^(?:" + b.join("|") + ")$"),
          E = function E(t) {
        return p.isIdentifier(t) && "_" !== t.charAt(0) && "constructor" !== t;
      },
          w = function w(t) {
        return t.replace(/([$])/, "\\$");
      },
          k = function k(t) {
        for (var e = [t], n = Math.max(0, t - 1 - 3), r = t - 1; r >= n; --r) {
          e.push(r);
        }for (var r = t + 1; r <= 3; ++r) {
          e.push(r);
        }return e;
      },
          T = function T(t) {
        return p.filledRange(t, "_arg", "");
      },
          A = function A(t) {
        return p.filledRange(Math.max(t, 3), "_arg", "");
      },
          S = function S(t) {
        return "number" == typeof t.length ? Math.max(Math.min(t.length, 1024), 0) : 0;
      };l = function l(t, r, i, o) {
        function s(t) {
          var e,
              n = T(t).join(", "),
              i = t > 0 ? ", " : "";return e = l ? "ret = callback.call(this, {{args}}, nodeback); break;\n" : void 0 === r ? "ret = callback({{args}}, nodeback); break;\n" : "ret = callback.call(receiver, {{args}}, nodeback); break;\n", e.replace("{{args}}", n).replace(", ", i);
        }function a() {
          for (var t = "", e = 0; e < u.length; ++e) {
            t += "case " + u[e] + ":" + s(u[e]);
          }return t += "                                                             \n        default:                                                             \n            var args = new Array(len + 1);                                   \n            var i = 0;                                                       \n            for (var i = 0; i < len; ++i) {                                  \n               args[i] = arguments[i];                                       \n            }                                                                \n            args[i] = nodeback;                                              \n            [CodeForCall]                                                    \n            break;                                                           \n        ".replace("[CodeForCall]", l ? "ret = callback.apply(this, args);\n" : "ret = callback.apply(receiver, args);\n");
        }var c = Math.max(0, S(o) - 1),
            u = k(c),
            l = "string" == typeof t || r === f,
            v = "string" == typeof t ? "this != null ? this['" + t + "'] : fn" : "fn";return new Function("Promise", "fn", "receiver", "withAppended", "maybeWrapAsError", "nodebackForPromise", "tryCatch", "errorObj", "notEnumerableProp", "INTERNAL", "'use strict';                            \n        var ret = function (Parameters) {                                    \n            'use strict';                                                    \n            var len = arguments.length;                                      \n            var promise = new Promise(INTERNAL);                             \n            promise._captureStackTrace();                                    \n            var nodeback = nodebackForPromise(promise);                      \n            var ret;                                                         \n            var callback = tryCatch([GetFunctionCode]);                      \n            switch(len) {                                                    \n                [CodeForSwitchCase]                                          \n            }                                                                \n            if (ret === errorObj) {                                          \n                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n            }                                                                \n            return promise;                                                  \n        };                                                                   \n        notEnumerableProp(ret, '__isPromisified__', true);                   \n        return ret;                                                          \n        ".replace("Parameters", A(c)).replace("[CodeForSwitchCase]", a()).replace("[GetFunctionCode]", v))(e, o, r, h, m, d, p.tryCatch, p.errorObj, p.notEnumerableProp, n);
      };var R = v ? l : c;e.promisify = function (e, n) {
        if ("function" != typeof e) throw new _("fn must be a function\n\n    See http://goo.gl/916lJJ\n");if (i(e)) return e;var o = t(e, arguments.length < 2 ? f : n);return p.copyDescriptors(e, o, r), o;
      }, e.promisifyAll = function (t, e) {
        if ("function" != typeof t && "object" !== ("undefined" == typeof t ? "undefined" : Tr(t))) throw new _("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/9ITlV0\n");e = Object(e);var n = e.suffix;"string" != typeof n && (n = g);var r = e.filter;"function" != typeof r && (r = E);var i = e.promisifier;if ("function" != typeof i && (i = R), !p.isIdentifier(n)) throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/8FZo5V\n");for (var o = p.inheritedDataKeys(t), s = 0; s < o.length; ++s) {
          var a = t[o[s]];"constructor" !== o[s] && p.isClass(a) && (u(a.prototype, n, r, i), u(a, n, r, i));
        }return u(t, n, r, i);
      };
    },
        wu = function t(e) {
      function t(t) {
        var e = new n(t),
            r = e.promise();return e.setHowMany(1), e.setUnwrap(), e.init(), r;
      }var n = e._SomePromiseArray;e.any = function (e) {
        return t(e);
      }, e.prototype.any = function () {
        return t(this);
      };
    },
        ku = function ku(t, e) {
      var n = t.reduce;t.prototype.each = function (t) {
        return n(this, t, null, e);
      }, t.each = function (t, r) {
        return n(t, r, null, e);
      };
    },
        Tu = function Tu(t, e) {
      function n(t) {
        var e = this;return e instanceof Number && (e = +e), clearTimeout(e), t;
      }function r(t) {
        var e = this;throw e instanceof Number && (e = +e), clearTimeout(e), t;
      }var i = sc,
          o = t.TimeoutError,
          s = function s(t, e) {
        if (t.isPending()) {
          var n;!i.isPrimitive(e) && e instanceof Error ? n = e : ("string" != typeof e && (e = "operation timed out"), n = new o(e)), i.markAsOriginatingFromRejection(n), t._attachExtraTrace(n), t._cancel(n);
        }
      },
          a = function a(t) {
        return c(+this).thenReturn(t);
      },
          c = t.delay = function (n, r) {
        if (void 0 === r) {
          r = n, n = void 0;var i = new t(e);return setTimeout(function () {
            i._fulfill();
          }, r), i;
        }return r = +r, t.resolve(n)._then(a, null, null, r, void 0);
      };t.prototype.delay = function (t) {
        return c(this, t);
      }, t.prototype.timeout = function (t, e) {
        t = +t;var i = this.then().cancellable();i._cancellationParent = this;var o = setTimeout(function () {
          s(i, e);
        }, t);return i._then(n, r, void 0, o, void 0);
      };
    },
        Au = function Au(t, e) {
      var n = t.map;t.prototype.filter = function (t, r) {
        return n(this, t, r, e);
      }, t.filter = function (t, r, i) {
        return n(t, r, i, e);
      };
    },
        Su = t(function (t) {
      "use strict";
      t.exports = function () {
        function e(t) {
          if ("function" != typeof t) throw new f("the promise constructor requires a resolver function\n\n    See http://goo.gl/EC22Yn\n");if (this.constructor !== e) throw new f("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/KsIlge\n");this._bitField = 0, this._fulfillmentHandler0 = void 0, this._rejectionHandler0 = void 0, this._progressHandler0 = void 0, this._promise0 = void 0, this._receiver0 = void 0, this._settledValue = void 0, t !== p && this._resolveFromResolver(t);
        }function n(t) {
          var n = new e(p);n._fulfillmentHandler0 = t, n._rejectionHandler0 = t, n._progressHandler0 = t, n._promise0 = t, n._receiver0 = t, n._settledValue = t;
        }var r,
            i = function i() {
          return new f("circular promise resolution chain\n\n    See http://goo.gl/LhFpo0\n");
        },
            o = function o() {
          return new e.PromiseInspection(this._target());
        },
            s = function s(t) {
          return e.reject(new f(t));
        },
            a = sc;r = a.isNode ? function () {
          var t = process.domain;return void 0 === t && (t = null), t;
        } : function () {
          return null;
        }, a.notEnumerableProp(e, "_getDomain", r);var c = {},
            u = gc,
            l = jc,
            f = e.TypeError = l.TypeError;e.RangeError = l.RangeError, e.CancellationError = l.CancellationError, e.TimeoutError = l.TimeoutError, e.OperationalError = l.OperationalError, e.RejectionError = l.OperationalError, e.AggregateError = l.AggregateError;var p = function p() {},
            d = {},
            h = { e: null },
            m = Nc(e, p),
            v = Uc(e, p, m, s),
            _ = Dc(),
            g = $c(e, _),
            y = Mc(e, _, g),
            b = Hc(h),
            C = Jc,
            E = C._nodebackForPromise,
            w = a.errorObj,
            k = a.tryCatch;return e.prototype.toString = function () {
          return "[object Promise]";
        }, e.prototype.caught = e.prototype.catch = function (t) {
          var n = arguments.length;if (n > 1) {
            var r,
                i = new Array(n - 1),
                o = 0;for (r = 0; r < n - 1; ++r) {
              var s = arguments[r];if ("function" != typeof s) return e.reject(new f("Catch filter must inherit from Error or be a simple predicate function\n\n    See http://goo.gl/o84o68\n"));i[o++] = s;
            }i.length = o, t = arguments[r];var a = new b(i, t, this);return this._then(void 0, a.doFilter, void 0, a, void 0);
          }return this._then(void 0, t, void 0, void 0, void 0);
        }, e.prototype.reflect = function () {
          return this._then(o, o, void 0, this, void 0);
        }, e.prototype.then = function (t, e, n) {
          if (g() && arguments.length > 0 && "function" != typeof t && "function" != typeof e) {
            var r = ".then() only accepts functions but was passed: " + a.classString(t);arguments.length > 1 && (r += ", " + a.classString(e)), this._warn(r);
          }return this._then(t, e, n, void 0, void 0);
        }, e.prototype.done = function (t, e, n) {
          var r = this._then(t, e, n, void 0, void 0);r._setIsFinal();
        }, e.prototype.spread = function (t, e) {
          return this.all()._then(t, e, void 0, d, void 0);
        }, e.prototype.isCancellable = function () {
          return !this.isResolved() && this._cancellable();
        }, e.prototype.toJSON = function () {
          var t = { isFulfilled: !1, isRejected: !1, fulfillmentValue: void 0, rejectionReason: void 0 };return this.isFulfilled() ? (t.fulfillmentValue = this.value(), t.isFulfilled = !0) : this.isRejected() && (t.rejectionReason = this.reason(), t.isRejected = !0), t;
        }, e.prototype.all = function () {
          return new v(this).promise();
        }, e.prototype.error = function (t) {
          return this.caught(a.originatesFromRejection, t);
        }, e.getNewLibraryCopy = t.exports, e.is = function (t) {
          return t instanceof e;
        }, e.fromNode = function (t) {
          var n = new e(p),
              r = k(t)(E(n));return r === w && n._rejectCallback(r.e, !0, !0), n;
        }, e.all = function (t) {
          return new v(t).promise();
        }, e.defer = e.pending = function () {
          var t = new e(p);return new C(t);
        }, e.cast = function (t) {
          var n = m(t);if (!(n instanceof e)) {
            var r = n;n = new e(p), n._fulfillUnchecked(r);
          }return n;
        }, e.resolve = e.fulfilled = e.cast, e.reject = e.rejected = function (t) {
          var n = new e(p);return n._captureStackTrace(), n._rejectCallback(t, !0), n;
        }, e.setScheduler = function (t) {
          if ("function" != typeof t) throw new f("fn must be a function\n\n    See http://goo.gl/916lJJ\n");var e = u._schedule;return u._schedule = t, e;
        }, e.prototype._then = function (t, n, i, o, s) {
          var a = void 0 !== s,
              c = a ? s : new e(p);a || (c._propagateFrom(this, 5), c._captureStackTrace());var l = this._target();l !== this && (void 0 === o && (o = this._boundTo), a || c._setIsMigrated());var f = l._addCallbacks(t, n, i, c, o, r());return l._isResolved() && !l._isSettlePromisesQueued() && u.invoke(l._settlePromiseAtPostResolution, l, f), c;
        }, e.prototype._settlePromiseAtPostResolution = function (t) {
          this._isRejectionUnhandled() && this._unsetRejectionIsUnhandled(), this._settlePromiseAt(t);
        }, e.prototype._length = function () {
          return 131071 & this._bitField;
        }, e.prototype._isFollowingOrFulfilledOrRejected = function () {
          return (939524096 & this._bitField) > 0;
        }, e.prototype._isFollowing = function () {
          return 536870912 === (536870912 & this._bitField);
        }, e.prototype._setLength = function (t) {
          this._bitField = this._bitField & -131072 | 131071 & t;
        }, e.prototype._setFulfilled = function () {
          this._bitField = 268435456 | this._bitField;
        }, e.prototype._setRejected = function () {
          this._bitField = 134217728 | this._bitField;
        }, e.prototype._setFollowing = function () {
          this._bitField = 536870912 | this._bitField;
        }, e.prototype._setIsFinal = function () {
          this._bitField = 33554432 | this._bitField;
        }, e.prototype._isFinal = function () {
          return (33554432 & this._bitField) > 0;
        }, e.prototype._cancellable = function () {
          return (67108864 & this._bitField) > 0;
        }, e.prototype._setCancellable = function () {
          this._bitField = 67108864 | this._bitField;
        }, e.prototype._unsetCancellable = function () {
          this._bitField = this._bitField & -67108865;
        }, e.prototype._setIsMigrated = function () {
          this._bitField = 4194304 | this._bitField;
        }, e.prototype._unsetIsMigrated = function () {
          this._bitField = this._bitField & -4194305;
        }, e.prototype._isMigrated = function () {
          return (4194304 & this._bitField) > 0;
        }, e.prototype._receiverAt = function (t) {
          var e = 0 === t ? this._receiver0 : this[5 * t - 5 + 4];if (e !== c) return void 0 === e && this._isBound() ? this._boundValue() : e;
        }, e.prototype._promiseAt = function (t) {
          return 0 === t ? this._promise0 : this[5 * t - 5 + 3];
        }, e.prototype._fulfillmentHandlerAt = function (t) {
          return 0 === t ? this._fulfillmentHandler0 : this[5 * t - 5 + 0];
        }, e.prototype._rejectionHandlerAt = function (t) {
          return 0 === t ? this._rejectionHandler0 : this[5 * t - 5 + 1];
        }, e.prototype._boundValue = function () {
          var t = this._boundTo;return void 0 !== t && t instanceof e ? t.isFulfilled() ? t.value() : void 0 : t;
        }, e.prototype._migrateCallbacks = function (t, n) {
          var r = t._fulfillmentHandlerAt(n),
              i = t._rejectionHandlerAt(n),
              o = t._progressHandlerAt(n),
              s = t._promiseAt(n),
              a = t._receiverAt(n);s instanceof e && s._setIsMigrated(), void 0 === a && (a = c), this._addCallbacks(r, i, o, s, a, null);
        }, e.prototype._addCallbacks = function (t, e, n, r, i, o) {
          var s = this._length();if (s >= 131066 && (s = 0, this._setLength(0)), 0 === s) this._promise0 = r, void 0 !== i && (this._receiver0 = i), "function" != typeof t || this._isCarryingStackTrace() || (this._fulfillmentHandler0 = null === o ? t : o.bind(t)), "function" == typeof e && (this._rejectionHandler0 = null === o ? e : o.bind(e)), "function" == typeof n && (this._progressHandler0 = null === o ? n : o.bind(n));else {
            var a = 5 * s - 5;this[a + 3] = r, this[a + 4] = i, "function" == typeof t && (this[a + 0] = null === o ? t : o.bind(t)), "function" == typeof e && (this[a + 1] = null === o ? e : o.bind(e)), "function" == typeof n && (this[a + 2] = null === o ? n : o.bind(n));
          }return this._setLength(s + 1), s;
        }, e.prototype._setProxyHandlers = function (t, e) {
          var n = this._length();if (n >= 131066 && (n = 0, this._setLength(0)), 0 === n) this._promise0 = e, this._receiver0 = t;else {
            var r = 5 * n - 5;this[r + 3] = e, this[r + 4] = t;
          }this._setLength(n + 1);
        }, e.prototype._proxyPromiseArray = function (t, e) {
          this._setProxyHandlers(t, e);
        }, e.prototype._resolveCallback = function (t, n) {
          if (!this._isFollowingOrFulfilledOrRejected()) {
            if (t === this) return this._rejectCallback(i(), !1, !0);var r = m(t, this);if (!(r instanceof e)) return this._fulfill(t);var o = 1 | (n ? 4 : 0);this._propagateFrom(r, o);var s = r._target();if (s._isPending()) {
              for (var a = this._length(), c = 0; c < a; ++c) {
                s._migrateCallbacks(this, c);
              }this._setFollowing(), this._setLength(0), this._setFollowee(s);
            } else s._isFulfilled() ? this._fulfillUnchecked(s._value()) : this._rejectUnchecked(s._reason(), s._getCarriedStackTrace());
          }
        }, e.prototype._rejectCallback = function (t, e, n) {
          n || a.markAsOriginatingFromRejection(t);var r = a.ensureErrorObject(t),
              i = r === t;this._attachExtraTrace(r, !!e && i), this._reject(t, i ? void 0 : r);
        }, e.prototype._resolveFromResolver = function (t) {
          var e = this;this._captureStackTrace(), this._pushContext();var n = !0,
              r = k(t)(function (t) {
            null !== e && (e._resolveCallback(t), e = null);
          }, function (t) {
            null !== e && (e._rejectCallback(t, n), e = null);
          });n = !1, this._popContext(), void 0 !== r && r === w && null !== e && (e._rejectCallback(r.e, !0, !0), e = null);
        }, e.prototype._settlePromiseFromHandler = function (t, e, n, r) {
          if (!r._isRejected()) {
            r._pushContext();var o;if (o = e !== d || this._isRejected() ? k(t).call(e, n) : k(t).apply(this._boundValue(), n), r._popContext(), o === w || o === r || o === h) {
              var s = o === r ? i() : o.e;r._rejectCallback(s, !1, !0);
            } else r._resolveCallback(o);
          }
        }, e.prototype._target = function () {
          for (var t = this; t._isFollowing();) {
            t = t._followee();
          }return t;
        }, e.prototype._followee = function () {
          return this._rejectionHandler0;
        }, e.prototype._setFollowee = function (t) {
          this._rejectionHandler0 = t;
        }, e.prototype._cleanValues = function () {
          this._cancellable() && (this._cancellationParent = void 0);
        }, e.prototype._propagateFrom = function (t, e) {
          (1 & e) > 0 && t._cancellable() && (this._setCancellable(), this._cancellationParent = t), (4 & e) > 0 && t._isBound() && this._setBoundTo(t._boundTo);
        }, e.prototype._fulfill = function (t) {
          this._isFollowingOrFulfilledOrRejected() || this._fulfillUnchecked(t);
        }, e.prototype._reject = function (t, e) {
          this._isFollowingOrFulfilledOrRejected() || this._rejectUnchecked(t, e);
        }, e.prototype._settlePromiseAt = function (t) {
          var n = this._promiseAt(t),
              r = n instanceof e;if (r && n._isMigrated()) return n._unsetIsMigrated(), u.invoke(this._settlePromiseAt, this, t);var i = this._isFulfilled() ? this._fulfillmentHandlerAt(t) : this._rejectionHandlerAt(t),
              o = this._isCarryingStackTrace() ? this._getCarriedStackTrace() : void 0,
              s = this._settledValue,
              a = this._receiverAt(t);this._clearCallbackDataAtIndex(t), "function" == typeof i ? r ? this._settlePromiseFromHandler(i, a, s, n) : i.call(a, s, n) : a instanceof v ? a._isResolved() || (this._isFulfilled() ? a._promiseFulfilled(s, n) : a._promiseRejected(s, n)) : r && (this._isFulfilled() ? n._fulfill(s) : n._reject(s, o)), t >= 4 && 4 === (31 & t) && u.invokeLater(this._setLength, this, 0);
        }, e.prototype._clearCallbackDataAtIndex = function (t) {
          if (0 === t) this._isCarryingStackTrace() || (this._fulfillmentHandler0 = void 0), this._rejectionHandler0 = this._progressHandler0 = this._receiver0 = this._promise0 = void 0;else {
            var e = 5 * t - 5;this[e + 3] = this[e + 4] = this[e + 0] = this[e + 1] = this[e + 2] = void 0;
          }
        }, e.prototype._isSettlePromisesQueued = function () {
          return (this._bitField & -1073741824) === -1073741824;
        }, e.prototype._setSettlePromisesQueued = function () {
          this._bitField = this._bitField | -1073741824;
        }, e.prototype._unsetSettlePromisesQueued = function () {
          this._bitField = 1073741823 & this._bitField;
        }, e.prototype._queueSettlePromises = function () {
          u.settlePromises(this), this._setSettlePromisesQueued();
        }, e.prototype._fulfillUnchecked = function (t) {
          if (t === this) {
            var e = i();return this._attachExtraTrace(e), this._rejectUnchecked(e, void 0);
          }this._setFulfilled(), this._settledValue = t, this._cleanValues(), this._length() > 0 && this._queueSettlePromises();
        }, e.prototype._rejectUncheckedCheckError = function (t) {
          var e = a.ensureErrorObject(t);this._rejectUnchecked(t, e === t ? void 0 : e);
        }, e.prototype._rejectUnchecked = function (t, e) {
          if (t === this) {
            var n = i();return this._attachExtraTrace(n), this._rejectUnchecked(n);
          }return this._setRejected(), this._settledValue = t, this._cleanValues(), this._isFinal() ? void u.throwLater(function (t) {
            throw "stack" in t && u.invokeFirst(_.unhandledRejection, void 0, t), t;
          }, void 0 === e ? t : e) : (void 0 !== e && e !== t && this._setCarriedStackTrace(e), void (this._length() > 0 ? this._queueSettlePromises() : this._ensurePossibleRejectionHandled()));
        }, e.prototype._settlePromises = function () {
          this._unsetSettlePromisesQueued();for (var t = this._length(), e = 0; e < t; e++) {
            this._settlePromiseAt(e);
          }
        }, a.notEnumerableProp(e, "_makeSelfResolutionError", i), Zc(e, v), tu(e, p, m, s), eu(e, p, m), nu(e, h, m), ou(e), su(e), au(e, v, m, p), e.version = "2.11.0", e.Promise = e, cu(e, v, s, m, p), uu(e), lu(e, s, m, y), fu(e, s, p, m), pu(e), vu(e), _u(e, v, m, s), gu(e, p, m, s), yu(e, v, s, m, p), bu(e, v), Cu(e, v, s), Eu(e, p), wu(e), ku(e, p), Tu(e, p), Au(e, p), a.toFastProperties(e), a.toFastProperties(e.prototype), n({ a: 1 }), n({ b: 2 }), n({ c: 3 }), n(1), n(function () {}), n(void 0), n(!1), n(new e(p)), _.setBounds(u.firstLineError, a.lastLineError), e;
      };
    }),
        Ru;"undefined" != typeof Promise && (Ru = Promise);var Fu = Su();Fu.noConflict = Er;var Ou = Fu,
        Lu = t(function (t) {
      (function () {
        var e,
            n,
            r,
            i = function i(t, e) {
          return function () {
            return t.apply(e, arguments);
          };
        },
            o = [].slice;r = 10, n = 5, e = function () {
          function t(e, n, r, o, s) {
            this.maxNb = null != e ? e : 0, this.minTime = null != n ? n : 0, this.highWater = null != r ? r : -1, this.strategy = null != o ? o : t.prototype.strategy.LEAK, this.rejectOnDrop = null != s && s, this.schedulePriority = i(this.schedulePriority, this), this.submitPriority = i(this.submitPriority, this), this.submit = i(this.submit, this), this._nextRequest = Date.now(), this._nbRunning = 0, this._queues = this._makeQueues(), this._running = {}, this._nextIndex = 0, this._unblockTime = 0, this.penalty = 15 * this.minTime || 5e3, this.interrupt = !1, this.reservoir = null, this.limiter = null, this.events = {};
          }var e;return t.strategy = t.prototype.strategy = { LEAK: 1, OVERFLOW: 2, OVERFLOW_PRIORITY: 4, BLOCK: 3 }, t.Cluster = t.prototype.Cluster = Ga, t.DLList = t.prototype.DLList = Ya, t.Promise = t.prototype.Promise = function () {
            try {
              return Ou;
            } catch (t) {
              return e = t, "undefined" != typeof Promise && null !== Promise ? Promise : function () {
                throw new Error("Bottleneck: install 'bluebird' or use Node 0.12 or higher for Promise support");
              };
            }
          }(), t.prototype._trigger = function (t, e) {
            return this.rejectOnDrop && "dropped" === t && e[0].cb.apply({}, [new Error("This job has been dropped by Bottleneck")]), setTimeout(function (n) {
              return function () {
                var r;return null != (r = n.events[t]) ? r.forEach(function (t) {
                  return t.apply({}, e);
                }) : void 0;
              };
            }(this), 0);
          }, t.prototype._makeQueues = function () {
            var e, n, i, o;for (o = [], e = n = 1, i = r; 1 <= i ? n <= i : n >= i; e = 1 <= i ? ++n : --n) {
              o.push(new t.prototype.DLList());
            }return o;
          }, t.prototype.chain = function (t) {
            return this.limiter = t, this;
          }, t.prototype.isBlocked = function () {
            return this._unblockTime >= Date.now();
          }, t.prototype._sanitizePriority = function (t) {
            var e;return e = ~~t !== t ? n : t, e < 0 ? 0 : e > r - 1 ? r - 1 : e;
          }, t.prototype._find = function (t, e) {
            var n, r, i, o;for (n = r = 0, i = t.length; r < i; n = ++r) {
              if (o = t[n], e(o)) return o;
            }return [];
          }, t.prototype.nbQueued = function (t) {
            return null != t ? this._queues[this._sanitizePriority(t)].length : this._queues.reduce(function (t, e) {
              return t + e.length;
            }, 0);
          }, t.prototype.nbRunning = function () {
            return this._nbRunning;
          }, t.prototype._getFirst = function (t) {
            return this._find(t, function (t) {
              return t.length > 0;
            });
          }, t.prototype._conditionsCheck = function () {
            return (this.nbRunning() < this.maxNb || this.maxNb <= 0) && (null == this.reservoir || this.reservoir > 0);
          }, t.prototype.check = function () {
            return this._conditionsCheck() && this._nextRequest - Date.now() <= 0;
          }, t.prototype._tryToRun = function () {
            var t, e, n, r, i;return !!(this._conditionsCheck() && (r = this.nbQueued()) > 0) && (this._nbRunning++, null != this.reservoir && this.reservoir--, i = Math.max(this._nextRequest - Date.now(), 0), this._nextRequest = Date.now() + i + this.minTime, n = this._getFirst(this._queues).shift(), 1 === r && this._trigger("empty", []), t = !1, e = this._nextIndex++, this._running[e] = { timeout: setTimeout(function (r) {
                return function () {
                  var i;return i = function i() {
                    var i;if (!t && (t = !0, delete r._running[e], r._nbRunning--, r._tryToRun(), 0 === r.nbRunning() && 0 === r.nbQueued() && r._trigger("idle", []), !r.interrupt)) return null != (i = n.cb) ? i.apply({}, Array.prototype.slice.call(arguments, 0)) : void 0;
                  }, null != r.limiter ? r.limiter.submit.apply(r.limiter, Array.prototype.concat(n.task, n.args, i)) : n.task.apply({}, n.args.concat(i));
                };
              }(this), i), job: n }, !0);
          }, t.prototype.submit = function () {
            var t;return t = 1 <= arguments.length ? o.call(arguments, 0) : [], this.submitPriority.apply({}, Array.prototype.concat(n, t));
          }, t.prototype.submitPriority = function () {
            var e, n, r, i, s, a, c, u;return s = arguments[0], u = arguments[1], e = 4 <= arguments.length ? o.call(arguments, 2, r = arguments.length - 1) : (r = 2, []), n = arguments[r++], i = { task: u, args: e, cb: n }, s = this._sanitizePriority(s), a = this.highWater >= 0 && this.nbQueued() === this.highWater && !this.check(), this.strategy === t.prototype.strategy.BLOCK && (a || this.isBlocked()) ? (this._unblockTime = Date.now() + this.penalty, this._nextRequest = this._unblockTime + this.minTime, this._queues = this._makeQueues(), this._trigger("dropped", [i]), !0) : a && (c = this.strategy === t.prototype.strategy.LEAK ? this._getFirst(this._queues.slice(s).reverse()).shift() : this.strategy === t.prototype.strategy.OVERFLOW_PRIORITY ? this._getFirst(this._queues.slice(s + 1).reverse()).shift() : this.strategy === t.prototype.strategy.OVERFLOW ? i : void 0, null != c && this._trigger("dropped", [c]), null == c || this.strategy === t.prototype.strategy.OVERFLOW) ? a : (this._queues[s].push(i), this._tryToRun(), a);
          }, t.prototype.schedule = function () {
            var t;return t = 1 <= arguments.length ? o.call(arguments, 0) : [], this.schedulePriority.apply({}, Array.prototype.concat(n, t));
          }, t.prototype.schedulePriority = function () {
            var e, n, r, i;return n = arguments[0], r = arguments[1], e = 3 <= arguments.length ? o.call(arguments, 2) : [], i = function i() {
              var t, e, n;return t = 2 <= arguments.length ? o.call(arguments, 0, n = arguments.length - 1) : (n = 0, []), e = arguments[n++], r.apply({}, t).then(function () {
                var t;return t = 1 <= arguments.length ? o.call(arguments, 0) : [], e.apply({}, Array.prototype.concat(null, t));
              }).catch(function () {
                var t;return t = 1 <= arguments.length ? o.call(arguments, 0) : [], e.apply({}, t);
              });
            }, new t.prototype.Promise(function (t) {
              return function (r, s) {
                return t.submitPriority.apply({}, Array.prototype.concat(n, i, e, function () {
                  var t;return t = 1 <= arguments.length ? o.call(arguments, 0) : [], (null != t[0] ? s : (t.shift(), r)).apply({}, t);
                }));
              };
            }(this));
          }, t.prototype.changeSettings = function (t, e, n, r, i) {
            for (this.maxNb = null != t ? t : this.maxNb, this.minTime = null != e ? e : this.minTime, this.highWater = null != n ? n : this.highWater, this.strategy = null != r ? r : this.strategy, this.rejectOnDrop = null != i ? i : this.rejectOnDrop; this._tryToRun();) {}return this;
          }, t.prototype.changePenalty = function (t) {
            return this.penalty = null != t ? t : this.penalty, this;
          }, t.prototype.changeReservoir = function (t) {
            for (this.reservoir = t; this._tryToRun();) {}return this;
          }, t.prototype.incrementReservoir = function (t) {
            return null == t && (t = 0), this.changeReservoir(this.reservoir + t), this;
          }, t.prototype.on = function (t, e) {
            return null != this.events[t] ? this.events[t].push(e) : this.events[t] = [e], this;
          }, t.prototype.removeAllListeners = function (t) {
            return null == t && (t = null), null != t ? delete this.events[t] : this.events = {}, this;
          }, t.prototype.stopAll = function (t) {
            var e, n, r, i, s, a, c;for (this.interrupt = null != t ? t : this.interrupt, i = Object.keys(this._running), e = 0, a = i.length; e < a; e++) {
              r = i[e], clearTimeout(this._running[r].timeout);
            }if (this._tryToRun = function () {}, this.check = function () {
              return !1;
            }, this.submit = this.submitPriority = function () {
              var t, e, n;return t = 2 <= arguments.length ? o.call(arguments, 0, n = arguments.length - 1) : (n = 0, []), (e = arguments[n++])(new Error("This limiter is stopped"));
            }, this.schedule = this.schedulePriority = function () {
              return Promise.reject(new Error("This limiter is stopped"));
            }, this.interrupt) for (s = 0, c = i.length; s < c; s++) {
              r = i[s], this._trigger("dropped", [this._running[r].job]);
            }for (; n = this._getFirst(this._queues).shift();) {
              this._trigger("dropped", [n]);
            }return this._trigger("empty", []), 0 === this.nbRunning() && this._trigger("idle", []), this;
          }, t;
        }(), t.exports = e;
      }).call(kr);
    }),
        xu = t(function (t) {
      (function () {
        t.exports = Lu, null != kr.window && (kr.window.Bottleneck = t.exports);
      }).call(kr);
    }),
        Iu = function Iu(t) {
      var e = void 0,
          n = new xu(3, 0),
          r = function r(t, e) {
        var n = Sr({ source: e, sourceKind: "cloud" }, t);return n;
      },
          i = { currentCloudAuthorized: !0, currentCloudName: void 0, currentCloudPath: void 0, listForCurrentCloudPath: [], cache: {}, cloudPrefetching: {}, cloudFolders: {}, cloudsAuthorized: {}, loading: !1, limiter: n },
          o = { RESET_LIMITER: function RESET_LIMITER(t) {
          t.limiter = new xu(3, 0);
        }, SET_CURRENT_CLOUD_AUTHORIZED: function SET_CURRENT_CLOUD_AUTHORIZED(t, e) {
          t.currentCloudAuthorized = e;
        }, SET_CURRENT_CLOUD_NAME: function SET_CURRENT_CLOUD_NAME(t, e) {
          t.currentCloudName = e;
        }, SET_CLOUD_AUTHORIZED: function SET_CLOUD_AUTHORIZED(t, e) {
          var n = e.key,
              r = e.value;Mo.set(t.cloudsAuthorized, n, r);
        }, RESET_CLOUD_AUTHORIZED: function RESET_CLOUD_AUTHORIZED(t) {
          t.cloudsAuthorized = {};
        }, SET_CURRENT_CLOUD_PATH: function SET_CURRENT_CLOUD_PATH(t, e) {
          var n = e.length > 0 ? zs(e) : e,
              r = t.currentCloudName + n,
              i = t.cache[r];i && (t.listForCurrentCloudPath = i), t.currentCloudPath = e;
        }, SET_LIST_FOR_CURRENT_CLOUD_PATH: function SET_LIST_FOR_CURRENT_CLOUD_PATH(t, e) {
          var n = t.currentCloudPath,
              r = n.length > 0 ? zs(n) : n,
              i = t.currentCloudName + r;t.cache[i] = e, t.listForCurrentCloudPath = e;
        }, RESET_LIST_CURRENT_CLOUD_PATH: function RESET_LIST_CURRENT_CLOUD_PATH(t) {
          t.listForCurrentCloudPath = [];
        }, SET_CLOUD_FOLDERS: function SET_CLOUD_FOLDERS(t, e) {
          e.forEach(function (e) {
            t.cloudFolders[e.path] = Sr({}, t.cloudFolders[e.path], { name: e.name });
          });
        }, SET_CLOUD_FOLDER_LOADING: function SET_CLOUD_FOLDER_LOADING(t, e) {
          var n = e.path,
              r = e.value;t.cloudFolders = Sr({}, t.cloudFolders, Ar({}, n, Sr({}, t.cloudFolders[n], { loading: r })));
        }, SET_CLOUD_LOADING: function SET_CLOUD_LOADING(t, e) {
          t.loading = e;
        }, SET_CLOUD_PREFETCHING: function SET_CLOUD_PREFETCHING(t, e) {
          var n = e.key,
              r = e.value;Mo.set(t.cloudPrefetching, n, r);
        }, SET_CACHE: function SET_CACHE(t, e) {
          var n = e.key,
              r = e.value;t.cache[n] = r;
        }, RESET_CACHE: function RESET_CACHE(t) {
          t.cache = {};
        } },
          s = { goToDirectory: function goToDirectory(t, e) {
          if (e.path !== t.getters.currentCloudPath.join("")) {
            var n = Gs(t.getters.currentCloudPath);n.push(e.path);var r = ["source", t.getters.currentCloudName, n];t.commit("CHANGE_ROUTE", r);
          }
        }, logout: function logout(e, n) {
          n ? t.cloud().logout(n).then(function () {
            e.commit("SET_CLOUD_AUTHORIZED", { key: n, value: !1 }), e.commit("REMOVE_SOURCE_FROM_WAITING", n);var t = Object.keys(e.state.cache).filter(function (t) {
              return t.indexOf(n) >= 0;
            });t.forEach(function (t) {
              e.commit("SET_CACHE", { key: t, value: null });
            }), n === e.state.currentCloudName && (e.commit("SET_CURRENT_CLOUD_AUTHORIZED", !1), e.commit("RESET_LIST_CURRENT_CLOUD_PATH"));
          }) : t.cloud().logout().then(function () {
            e.commit("RESET_CLOUD_AUTHORIZED"), e.commit("SET_CURRENT_CLOUD_AUTHORIZED", !1), e.commit("RESET_CACHE"), e.commit("RESET_LIST_CURRENT_CLOUD_PATH"), e.commit("REMOVE_CLOUDS_FROM_WAITING");
          });
        }, prefetchClouds: function prefetchClouds(e) {
          var n = e.getters.fromSources.filter(function (t) {
            return "cloud" === t.ui;
          }).map(function (t) {
            return t.name;
          });n.forEach(function (n) {
            e.commit("SET_CLOUD_PREFETCHING", { key: n, value: !0 });var i = t.cloud(n),
                o = function o() {
              return i.list([]).then(function (t) {
                e.commit("SET_CLOUD_PREFETCHING", { key: n, value: !1 }), e.commit("SET_CLOUD_AUTHORIZED", { key: n, value: !0 });var o = t.contents.map(function (t) {
                  return r(t, n);
                }),
                    s = o.filter(function (t) {
                  return t.folder;
                });e.commit("SET_CLOUD_FOLDERS", s), e.commit("SET_CACHE", { key: n, value: o });var a = e.getters.currentCloudName;a === n && (e.commit("SET_LIST_FOR_CURRENT_CLOUD_PATH", o), e.dispatch("prefetchFolders", { client: i, name: n, folders: s }));
              }).catch(function (t) {
                e.commit("SET_CLOUD_PREFETCHING", { key: n, value: !1 }), e.getters.currentCloudName === n && (401 === t.status ? e.commit("SET_CURRENT_CLOUD_AUTHORIZED", { status: "unauthorized", authUrl: t.response.body.redirect_url }) : e.dispatch("showNotification", t.response.body.status));
              });
            };e.state.limiter.schedule(o).catch(function () {});
          });
        }, prefetchFolders: function prefetchFolders(t, e) {
          var n = e.client,
              i = e.name,
              o = e.folders;o.forEach(function (e) {
            var o = i + e.path;if (!t.state.cache[o]) {
              var s = function s() {
                return t.commit("SET_CLOUD_PREFETCHING", { key: o, value: !0 }), n.list(e.path).then(function (s) {
                  var a = t.getters.currentCloudPath,
                      c = a.length > 0 ? zs(a) : a,
                      u = s.contents.map(function (t) {
                    return r(t, i);
                  }),
                      l = u.filter(function (t) {
                    return t.folder;
                  });t.commit("SET_CLOUD_PREFETCHING", { key: o, value: !1 }), t.commit("SET_CLOUD_FOLDERS", l), t.commit("SET_CACHE", { key: o, value: u }), e.path === c && (t.commit("SET_LIST_FOR_CURRENT_CLOUD_PATH", u), t.dispatch("prefetchFolders", { client: n, name: i, folders: l }));
                }).catch(function (n) {
                  t.commit("SET_CLOUD_PREFETCHING", { key: o, value: !1 });var r = t.getters.currentCloudPath,
                      i = r.length > 0 ? zs(r) : r;e.path === i && 401 === n.status && t.commit("SET_CURRENT_CLOUD_AUTHORIZED", { status: "unauthorized", authUrl: n.response.body.redirect_url });
                });
              };t.state.limiter.schedule(s).catch(function () {});
            }
          });
        }, addCloudFolder: function addCloudFolder(n, i) {
          var o = i.name,
              s = i.path,
              a = void 0,
              c = o + s,
              u = n.state.cache[c];u ? a = Promise.resolve(u) : (e = t.cloud(o), a = e.list(s), n.commit("SET_CLOUD_FOLDER_LOADING", { path: s, value: !0 })), a.then(function (t) {
            if (u) {
              var e = t.filter(function (t) {
                return !t.folder;
              });return void e.forEach(function (t) {
                return n.dispatch("addFile", t);
              });
            }n.commit("SET_CLOUD_FOLDER_LOADING", { path: s, value: !1 });var i = t.contents.map(function (t) {
              return r(t, o);
            });n.commit("SET_CACHE", { key: c, value: i }), i.filter(function (t) {
              return !t.folder;
            }).forEach(function (t) {
              return n.dispatch("addFile", t);
            });
          }).catch(function (t) {
            n.commit("SET_CLOUD_FOLDER_LOADING", { path: s, value: !1 }), n.dispatch("showNotification", t.message);
          });
        }, showCloudPath: function showCloudPath(n, i) {
          var o = i.name,
              s = i.path,
              a = void 0 === s ? [] : s;n.getters.currentCloudName !== o && (e = t.cloud(o), n.commit("SET_CURRENT_CLOUD_NAME", o)), n.getters.currentCloudAuthorized !== !0 && n.commit("SET_CURRENT_CLOUD_AUTHORIZED", !0);var c = a.length > 0 ? zs(a) : a,
              u = o + c,
              l = n.state.cache[u];if (n.commit("RESET_LIST_CURRENT_CLOUD_PATH"), n.commit("SET_CURRENT_CLOUD_PATH", a), l) {
            var f = l.filter(function (t) {
              return t.folder;
            });return void n.dispatch("prefetchFolders", { client: e, name: o, folders: f });
          }if (!n.getters.cloudPrefetching[u]) {
            var p = function p(t) {
              return n.commit("SET_CLOUD_LOADING", !0), e.list(t).then(function (t) {
                if (n.getters.currentCloudPath === a) {
                  var i = t.contents.map(function (t) {
                    return r(t, o);
                  }),
                      s = i.filter(function (t) {
                    return t.folder;
                  });n.dispatch("prefetchFolders", { client: e, name: o, folders: s }), n.commit("SET_CLOUD_FOLDERS", s), n.commit("SET_LIST_FOR_CURRENT_CLOUD_PATH", i), n.commit("SET_CLOUD_LOADING", !1), n.commit("SET_CLOUD_AUTHORIZED", { key: o, value: !0 });
                }
              }).catch(function (t) {
                n.commit("SET_CLOUD_LOADING", !1), n.getters.currentCloudPath === a && (401 === t.status ? n.commit("SET_CURRENT_CLOUD_AUTHORIZED", { status: "unauthorized", authUrl: t.response.body.redirect_url }) : n.dispatch("showNotification", t.response.body.status));
              });
            };n.state.limiter.schedulePriority(0, p, c).catch(function () {});
          }
        }, resetCloudLimiter: function resetCloudLimiter(t) {
          var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];t.state.limiter.stopAll(e), e || t.commit("RESET_LIMITER");
        } },
          a = { currentCloudAuthorized: function currentCloudAuthorized(t) {
          return t.currentCloudAuthorized;
        }, currentCloudName: function currentCloudName(t) {
          return t.currentCloudName;
        }, currentCloudPath: function currentCloudPath(t) {
          return t.currentCloudPath;
        }, listForCurrentCloudPath: function listForCurrentCloudPath(t) {
          return t.listForCurrentCloudPath;
        }, cloudFolders: function cloudFolders(t) {
          return t.cloudFolders;
        }, cloudLoading: function cloudLoading(t) {
          return t.loading;
        }, cloudPrefetching: function cloudPrefetching(t) {
          return t.cloudPrefetching;
        }, cloudsAuthorized: function cloudsAuthorized(t) {
          return t.cloudsAuthorized;
        } };return { state: i, mutations: o, actions: s, getters: a };
    },
        Pu = function Pu(t) {
      var e = function e(t) {
        var e = Sr({ source: "imagesearch", sourceKind: "cloud" }, t);return e;
      },
          n = { input: "", isSearching: !1, result: null, error: null },
          r = { UPDATE_INPUT: function UPDATE_INPUT(t, e) {
          t.input = e;
        }, FETCH_IMAGES_BEGIN: function FETCH_IMAGES_BEGIN(t) {
          t.isSearching = !0;
        }, FETCH_IMAGES_SUCCESS: function FETCH_IMAGES_SUCCESS(t, e) {
          t.result = e, t.isSearching = !1;
        }, FETCH_IMAGES_ERROR: function FETCH_IMAGES_ERROR(t, e) {
          t.error = e, t.isSearching = !1;
        }, CLEAR_RESULT_NAME: function CLEAR_RESULT_NAME(t) {
          t.result && (t.result.name = null);
        } },
          i = { updateSearchInput: function updateSearchInput(t, e) {
          "" !== e && e !== t.getters.imageSearchName || t.commit("CLEAR_RESULT_NAME"), t.commit("UPDATE_INPUT", e);
        }, fetchImages: function fetchImages(n) {
          if (!n.getters.isSearching) {
            var r = n.getters.imageSearchInput;r && (n.commit("FETCH_IMAGES_BEGIN"), t.cloud("imagesearch").list("/" + r).then(function (t) {
              0 === t.contents.length && n.dispatch("showNotification", "No search results found for " + r), t.contents = t.contents.map(e), n.commit("FETCH_IMAGES_SUCCESS", t);
            }).catch(function (t) {
              n.commit("FETCH_IMAGES_ERROR", t), n.dispatch("showNotification", t.message);
            }));
          }
        } },
          o = { isSearching: function isSearching(t) {
          return t.isSearching;
        }, noResultsFound: function noResultsFound(t) {
          return t.result && 0 === t.result.contents.length;
        }, resultsFound: function resultsFound(t) {
          return t.result && t.result.contents.length > 0;
        }, imageSearchInput: function imageSearchInput(t) {
          return t.input;
        }, imageSearchName: function imageSearchName(t) {
          return t.result && t.result.name;
        }, imageSearchResults: function imageSearchResults(t) {
          return t.result && t.result.contents;
        }, imageSearchError: function imageSearchError(t) {
          return t.error;
        } };return { state: n, mutations: r, actions: i, getters: o };
    },
        ju = 5e3,
        Nu = { ADD_NOTIFICATION: function ADD_NOTIFICATION(t, e) {
        t.notifications.push(e);
      }, REMOVE_NOTIFICATION: function REMOVE_NOTIFICATION(t, e) {
        t.notifications = t.notifications.filter(function (t) {
          return t !== e;
        });
      }, REMOVE_ALL_NOTIFICATIONS: function REMOVE_ALL_NOTIFICATIONS(t) {
        t.notifications.splice(0, t.notifications.length);
      } },
        Uu = { showNotification: function showNotification(t, e, n) {
        var r = Sr({ message: e }, n),
            i = t.getters.notifications.map(function (t) {
          return t.message;
        });i.indexOf(e) < 0 && (t.commit("ADD_NOTIFICATION", r), setTimeout(function () {
          t.commit("REMOVE_NOTIFICATION", r);
        }, ju));
      }, removeAllNotifications: function removeAllNotifications(t) {
        t.commit("REMOVE_ALL_NOTIFICATIONS");
      } },
        Du = { notifications: function notifications(t) {
        return t.notifications;
      } },
        $u = { state: { notifications: [] }, mutations: Nu, actions: Uu, getters: Du };Mo.use(fs);var Mu = function Mu(t, e, n, r) {
      var i = e.fromSources[0],
          o = ["source", i.name];return r = Sr({ apiClient: t, config: e, route: o, routesHistory: [] }, r, { mobileNavActive: Bs(navigator.userAgent), selectLabelIsActive: !1 }), new fs.Store({ state: r, modules: { uploadQueue: Ns(t, r.uploadQueue), cloud: Iu(t), imageSearch: Pu(t), notifications: $u }, mutations: { CHANGE_ROUTE: function CHANGE_ROUTE(t, e) {
            Bs(navigator.userAgent) && e.indexOf("local_file_system") !== -1 && (t.mobileNavActive = !0), t.routesHistory.push(t.route), t.route = e;
          }, GO_BACK_WITH_ROUTE: function GO_BACK_WITH_ROUTE(t) {
            var e = t.routesHistory.pop();Bs(navigator.userAgent) && e.indexOf("local_file_system") !== -1 && (t.mobileNavActive = !0), t.route = e;
          }, UPDATE_MOBILE_NAV_ACTIVE: function UPDATE_MOBILE_NAV_ACTIVE(t, e) {
            t.mobileNavActive = e;
          }, UPDATE_SELECT_LABEL_ACTIVE: function UPDATE_SELECT_LABEL_ACTIVE(t, e) {
            t.selectLabelIsActive = e;
          } }, actions: { allUploadsDone: function allUploadsDone(t) {
            t.commit("CHANGE_ROUTE", ["done"]);var e = Fs(t.getters.filesDone),
                r = Fs(t.getters.filesFailed);n({ filesUploaded: e, filesFailed: r });
          }, goBack: function goBack(t) {
            t.commit("GO_BACK_WITH_ROUTE");
          }, updateMobileNavActive: function updateMobileNavActive(t, e) {
            t.commit("UPDATE_MOBILE_NAV_ACTIVE", e);
          }, updateSelectLabelActive: function updateSelectLabelActive(t, e) {
            t.commit("UPDATE_SELECT_LABEL_ACTIVE", e);
          } }, getters: { apiClient: function apiClient(t) {
            return t.apiClient;
          }, uiVisible: function uiVisible(t, e) {
            return !e.uploadStarted || !t.config.hideWhenUploading;
          }, route: function route(t) {
            return t.route;
          }, routesHistory: function routesHistory(t) {
            return t.routesHistory;
          }, fromSources: function fromSources(t) {
            return t.config.fromSources;
          }, accept: function accept(t) {
            return t.config.accept;
          }, preferLinkOverStore: function preferLinkOverStore(t) {
            return t.config.preferLinkOverStore;
          }, maxSize: function maxSize(t) {
            return t.config.maxSize;
          }, minFiles: function minFiles(t) {
            return t.config.minFiles;
          }, maxFiles: function maxFiles(t) {
            return t.config.maxFiles;
          }, startUploadingWhenMaxFilesReached: function startUploadingWhenMaxFilesReached(t) {
            return t.config.startUploadingWhenMaxFilesReached;
          }, storeTo: function storeTo(t) {
            return t.config.storeTo;
          }, uploadInBackground: function uploadInBackground(t) {
            return t.config.uploadInBackground;
          }, onFileSelected: function onFileSelected(t) {
            return t.config.onFileSelected;
          }, onFileUploadStarted: function onFileUploadStarted(t) {
            return t.config.onFileUploadStarted;
          }, onFileUploadProgress: function onFileUploadProgress(t) {
            return t.config.onFileUploadProgress;
          }, onFileUploadFinished: function onFileUploadFinished(t) {
            return t.config.onFileUploadFinished;
          }, onFileUploadFailed: function onFileUploadFailed(t) {
            return t.config.onFileUploadFailed;
          }, mobileNavActive: function mobileNavActive(t) {
            return t.mobileNavActive;
          }, selectLabelIsActive: function selectLabelIsActive(t) {
            return t.selectLabelIsActive;
          }, disableTransformer: function disableTransformer(t) {
            return t.config.disableTransformer;
          }, transformOptions: function transformOptions(t) {
            return t.config.transformOptions;
          } } });
    },
        Hu = function Hu(t) {
      return "object" === ("undefined" == typeof t ? "undefined" : Tr(t)) && null !== t && Array.isArray(t) === !1;
    },
        Wu = function Wu(t) {
      return t % 1 === 0;
    },
        zu = { fromSources: function fromSources(t) {
        return "string" == typeof t && (t = [t]), t.map(bs);
      }, accept: function accept(t) {
        return "string" == typeof t && (t = [t]), t.forEach(function (t) {
          if ("string" != typeof t) throw new Error('Invalid value for "accept" config option');
        }), t;
      }, preferLinkOverStore: function preferLinkOverStore(t) {
        if ("boolean" != typeof t) throw new Error('Invalid value for "preferLinkOverStore" config option');return t;
      }, maxSize: function maxSize(t) {
        if ("number" != typeof t || !Wu(t) || t < 0) throw new Error('Invalid value for "maxSize" config option');return t;
      }, minFiles: function minFiles(t) {
        if ("number" != typeof t || !Wu(t) || t < 0) throw new Error('Invalid value for "minFiles" config option');return t;
      }, maxFiles: function maxFiles(t) {
        if ("number" != typeof t || !Wu(t) || t < 0) throw new Error('Invalid value for "maxFiles" config option');return t;
      }, startUploadingWhenMaxFilesReached: function startUploadingWhenMaxFilesReached(t) {
        if ("boolean" != typeof t) throw new Error('Invalid value for "startUploadingWhenMaxFilesReached" config option');return t;
      }, loadCss: function loadCss(t) {
        if ("boolean" == typeof t && t === !1 || "string" == typeof t) return t;throw new Error('Invalid value for "loadCss" config option');
      }, lang: function lang(t) {
        if ("boolean" == typeof t && t === !1 || "string" == typeof t) return t;throw new Error('Invalid value for "lang" config option');
      }, storeTo: function storeTo(t) {
        if (Hu(t)) return t;throw new Error('Invalid value for "storeTo" config option');
      }, transformOptions: function transformOptions(t) {
        if (Hu(t)) return t;throw new Error('Invalid value for "transformOptions" config option');
      }, hideWhenUploading: function hideWhenUploading(t) {
        if ("boolean" != typeof t) throw new Error('Invalid value for "hideWhenUploading" config option');return t;
      }, uploadInBackground: function uploadInBackground(t) {
        if ("boolean" != typeof t) throw new Error('Invalid value for "uploadInBackground" config option');return t;
      }, disableTransformer: function disableTransformer(t) {
        if ("boolean" != typeof t) throw new Error('Invalid value for "disableTransformer" config option');return t;
      }, onFileSelected: function onFileSelected(t) {
        if ("function" != typeof t) throw new Error('Invalid value for "onFileSelected" config option');return t;
      }, onFileUploadStarted: function onFileUploadStarted(t) {
        if ("function" != typeof t) throw new Error('Invalid value for "onFileUploadStarted" config option');return t;
      }, onFileUploadProgress: function onFileUploadProgress(t) {
        if ("function" != typeof t) throw new Error('Invalid value for "onFileUploadProgress" config option');return t;
      }, onFileUploadFinished: function onFileUploadFinished(t) {
        if ("function" != typeof t) throw new Error('Invalid value for "onFileUploadFinished" config option');return t;
      }, onFileUploadFailed: function onFileUploadFailed(t) {
        if ("function" != typeof t) throw new Error('Invalid value for "onFileUploadFailed" config option');return t;
      } },
        Vu = function Vu(t, e) {
      return void 0 === t.fromSources && (t.fromSources = ["local_file_system", "imagesearch", "facebook", "instagram", "googledrive", "dropbox"]), void 0 === t.preferLinkOverStore && (t.preferLinkOverStore = !1), void 0 === t.minFiles && (t.minFiles = 1), void 0 === t.maxFiles && (t.maxFiles = 1), void 0 === t.startUploadingWhenMaxFilesReached && (t.startUploadingWhenMaxFilesReached = !1), void 0 === t.loadCss && (t.loadCss = e.css.main), void 0 === t.hideWhenUploading && (t.hideWhenUploading = !1), void 0 === t.lang && (t.lang = !1), void 0 === t.uploadInBackground && (t.uploadInBackground = !0), void 0 === t.disableTransformer && (t.disableTransformer = !1), t;
    },
        Bu = function Bu(t) {
      var e = {};if (Object.keys(t).forEach(function (n) {
        var r = zu[n];if (!r) throw new Error('Unknown config option "' + n + '"');e[n] = r(t[n]);
      }), void 0 !== e.minFiles && void 0 !== e.maxFiles && e.minFiles > e.maxFiles) throw new Error('Config option "minFiles" must be smaller or equal to "maxFiles"');return e;
    },
        Gu = function Gu(t) {
      var e = {};return "es" === t ? e.es = { My: "Mi", Connect: "Conectar", View: "Ver", "A new page will open to connect your account": "Se abrirá una nueva página para conectar tu cuenta", "My Device": "Mi Dispositivo", "or Drag and Drop, Copy and Paste Files": "O arrastrar y soltar, copiar y pegar archivos", "Pick Your Files": "Elige tus archivos", "Select Files to Upload": "Seleccionar archivos para cargar", "Selected Files": "Archivos seleccionados", "Select Files from": "Seleccione Archivos de", "We only extract images and never modify or delete them": "Sólo extraemos imágenes y nunca las modificamos o eliminamos", "You need to authenticate with": "Debe autenticarse con" } : "pl" === t && (e.pl = { My: "Mój", Connect: "Połączyć", View: "Widok", "A new page will open to connect your account": "Nowa strona otworzy się połączyć swoje konto", "My Device": "Moje urządzenie", "or Drag and Drop, Copy and Paste Files": "lub przeciągnij i upuść, kopiować i wklejać pliki", "Pick Your Files": "Wybierz pliki", "Select Files to Upload": "Wybierz pliki do przesłania", "Selected Files": "Wybrane pliki", "Select Files from": "Wybierz pliki z", "We only extract images and never modify or delete them": "Mamy tylko wyodrębnić obrazy i nigdy zmodyfikować lub usunąć je", "You need to authenticate with": "Musisz uwierzytelnić" }), e;
    },
        Yu = Vo.context("picker"),
        Xu = function Xu(t, e, n) {
      return new Promise(function (r) {
        var i = function i(t) {
          r(t);
        };Mo.use(Ho), Mo.locales(Gu(e.lang));var o = document.createElement("div");document.body.appendChild(o);var s = new Mo({ el: o, store: Mu(t, e, i, n), render: function render(t) {
            return t(Ba);
          }, created: function created() {
            this.$translate.setLang(e.lang), document.body.classList.add("fsp-picker-open");
          }, destroyed: function destroyed() {
            s.$el.parentNode.removeChild(s.$el), document.body.classList.remove("fsp-picker-open");
          } });
      });
    },
        qu = function qu(t) {
      return t.loadCss === !1 ? Promise.resolve() : Jo.loadCss(t.loadCss);
    },
        Qu = function Qu(t) {
      var e = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};return Yu("Starting picker v0.3.1 with config:", e), e = Bu(Vu(e, wr)), qu(e).then(function () {
        return Xu(t, e, n);
      });
    };return Qu;
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

var init = function init(apikey, security) {
  return api(apikey, security);
};

var filestack = {
  version: '0.2.1',
  init: init
};

export default filestack;
//# sourceMappingURL=filestack.es2015.js.map
