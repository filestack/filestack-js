/* v0.4.2 */
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
  return r = r || {}, new ValidationResult(recurse(u, e, t.Array.is(r) ? r : r.path || [], r));
}function recurse(u, e, r, n) {
  return t.isType(e) ? validators[e.meta.kind](u, e, r, n) : validators.es6classes(u, e, r, n);
}function debounce(u, e, t) {
  function r(e) {
    var t = p,
        r = f;return p = f = void 0, y = e, d = u.apply(r, t);
  }function n(u) {
    return y = u, h = setTimeout(a, e), F ? r(u) : d;
  }function i(u) {
    var t = u - C,
        r = u - y,
        n = e - t;return m ? nativeMin(n, E - r) : n;
  }function o(u) {
    var t = u - C,
        r = u - y;return void 0 === C || t >= e || t < 0 || m && r >= E;
  }function a() {
    var u = now();if (o(u)) return s(u);h = setTimeout(a, i(u));
  }function s(u) {
    return h = void 0, g && p ? r(u) : (p = f = void 0, d);
  }function c() {
    void 0 !== h && clearTimeout(h), y = 0, p = C = f = h = void 0;
  }function l() {
    return void 0 === h ? d : s(now());
  }function A() {
    var u = now(),
        t = o(u);if (p = arguments, f = this, C = u, t) {
      if (void 0 === h) return n(C);if (m) return h = setTimeout(a, e), r(C);
    }return void 0 === h && (h = setTimeout(a, e)), d;
  }var p,
      f,
      E,
      d,
      h,
      C,
      y = 0,
      F = !1,
      m = !1,
      g = !0;if ("function" != typeof u) throw new TypeError(FUNC_ERROR_TEXT);return e = toNumber(e) || 0, isObject$14(t) && (F = !!t.leading, m = "maxWait" in t, E = m ? nativeMax(toNumber(t.maxWait) || 0, e) : E, g = "trailing" in t ? !!t.trailing : g), A.cancel = c, A.flush = l, A;
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
    if (!E(u)) return u;var e = [];for (var t in u) {
      n(e, t, u[t]);
    }return e.join("&");
  }function n(u, e, t) {
    if (null != t) {
      if (Array.isArray(t)) t.forEach(function (t) {
        n(u, e, t);
      });else if (E(t)) for (var r in t) {
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
      t = i[a], e = t.indexOf(":"), r = t.slice(0, e).toLowerCase(), n = F(t.slice(e + 1)), o[r] = n;
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
    var r = y("DELETE", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }var A;"undefined" != typeof window ? A = window : "undefined" != typeof self ? A = self : (console.warn("Using browser-only version of superagent in non-browser environment"), A = commonjsGlobal$1);var p = index,
      f = requestBase,
      E = isObject_1,
      d = isFunction_1,
      h = responseBase,
      C = shouldRetry,
      y = e = u.exports = function (u, t) {
    return "function" == typeof t ? new e.Request("GET", u).end(t) : 1 == arguments.length ? new e.Request("GET", u) : new e.Request(u, t);
  };e.Request = c, y.getXHR = function () {
    if (!(!A.XMLHttpRequest || A.location && "file:" == A.location.protocol && A.ActiveXObject)) return new XMLHttpRequest();try {
      return new ActiveXObject("Microsoft.XMLHTTP");
    } catch (u) {}try {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    } catch (u) {}try {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    } catch (u) {}try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (u) {}throw Error("Browser-only verison of superagent could not find XHR");
  };var F = "".trim ? function (u) {
    return u.trim();
  } : function (u) {
    return u.replace(/(^\s*|\s*$)/g, "");
  };y.serializeObject = r, y.parseString = i, y.types = { html: "text/html", json: "application/json", xml: "application/xml", urlencoded: "application/x-www-form-urlencoded", form: "application/x-www-form-urlencoded", "form-data": "application/x-www-form-urlencoded" }, y.serialize = { "application/x-www-form-urlencoded": r, "application/json": JSON.stringify }, y.parse = { "application/x-www-form-urlencoded": i, "application/json": JSON.parse }, h(s.prototype), s.prototype._parseBody = function (u) {
    var e = y.parse[this.type];return this.req._parser ? this.req._parser(this, u) : (!e && a(this.type) && (e = y.parse["application/json"]), e && u && (u.length || u instanceof Object) ? e(u) : null);
  }, s.prototype.toError = function () {
    var u = this.req,
        e = u.method,
        t = u.url,
        r = "cannot " + e + " " + t + " (" + this.status + ")",
        n = new Error(r);return n.status = this.status, n.method = e, n.url = t, n;
  }, y.Response = s, p(c.prototype), f(c.prototype), c.prototype.type = function (u) {
    return this.set("Content-Type", y.types[u] || u), this;
  }, c.prototype.accept = function (u) {
    return this.set("Accept", y.types[u] || u), this;
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
    if (this._maxRetries && this._retries++ < this._maxRetries && C(u, e)) return this._retry();var t = this._callback;this.clearTimeout(), u && (this._maxRetries && (u.retries = this._retries - 1), this.emit("error", u)), t(u, e);
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
        e = this.xhr = y.getXHR(),
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
          i = this._serializer || y.serialize[n ? n.split(";")[0] : ""];!i && a(n) && (i = y.serialize["application/json"]), i && (t = i(t));
    }for (var o in this.header) {
      null != this.header[o] && e.setRequestHeader(o, this.header[o]);
    }return this._responseType && (e.responseType = this._responseType), this.emit("request", this), e.send(void 0 !== t ? t : null), this;
  }, y.get = function (u, e, t) {
    var r = y("GET", u);return "function" == typeof e && (t = e, e = null), e && r.query(e), t && r.end(t), r;
  }, y.head = function (u, e, t) {
    var r = y("HEAD", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }, y.options = function (u, e, t) {
    var r = y("OPTIONS", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }, y.del = l, y.delete = l, y.patch = function (u, e, t) {
    var r = y("PATCH", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }, y.post = function (u, e, t) {
    var r = y("POST", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
  }, y.put = function (u, e, t) {
    var r = y("PUT", u);return "function" == typeof e && (t = e, e = null), e && r.send(e), t && r.end(t), r;
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
  var t = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};if (!e || "string" != typeof e) throw new Error("url is required for store");checkOptions("store", [{ name: "filename", type: index$2.String }, { name: "location", type: index$2.enums.of("s3 gcs rackspace azure dropbox") }, { name: "mimetype", type: index$2.String }, { name: "path", type: index$2.String }, { name: "region", type: index$2.String }, { name: "container", type: index$2.String }, { name: "access", type: index$2.enums.of("public private") }], t);var r = t.location || "s3",
      n = removeEmpty(t);u.policy && u.signature && (n.policy = u.policy, n.signature = u.signature);var i = storeApiUrl + "/" + r;return new Promise(function (t, r) {
    client$1.post(i).query({ key: u.apikey }).query(n).send("url=" + e).end(function (u, e) {
      if (u) r(u);else if (e.body && e.body.url) {
        var n = e.body.url.split("/").pop(),
            i = Object.assign({}, e.body, { handle: n });t(i);
      } else t(e.body);
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
          t += E[u >> 8 * e + 4 & 15] + E[u >> 8 * e & 15];
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
      }function f() {
        this.reset();
      }var E = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];return "5d41402abc4b2a76b9719d911017c592" !== a(n("hello")) && function (u, e) {
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
      }(), f.prototype.append = function (u) {
        return this.appendBinary(s(u)), this;
      }, f.prototype.appendBinary = function (u) {
        this._buff += u, this._length += u.length;var r,
            n = this._buff.length;for (r = 64; r <= n; r += 64) {
          e(this._hash, t(this._buff.substring(r - 64, r)));
        }return this._buff = this._buff.substring(r - 64), this;
      }, f.prototype.end = function (u) {
        var e,
            t,
            r = this._buff,
            n = r.length,
            i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];for (e = 0; e < n; e += 1) {
          i[e >> 2] |= r.charCodeAt(e) << (e % 4 << 3);
        }return this._finish(i, n), t = a(this._hash), u && (t = p(t)), this.reset(), t;
      }, f.prototype.reset = function () {
        return this._buff = "", this._length = 0, this._hash = [1732584193, -271733879, -1732584194, 271733878], this;
      }, f.prototype.getState = function () {
        return { buff: this._buff, length: this._length, hash: this._hash };
      }, f.prototype.setState = function (u) {
        return this._buff = u.buff, this._length = u.length, this._hash = u.hash, this;
      }, f.prototype.destroy = function () {
        delete this._hash, delete this._buff, delete this._length;
      }, f.prototype._finish = function (u, t) {
        var r,
            n,
            i,
            o = t;if (u[o >> 2] |= 128 << (o % 4 << 3), o > 55) for (e(this._hash, u), o = 0; o < 16; o += 1) {
          u[o] = 0;
        }r = 8 * this._length, r = r.toString(16).match(/(.*?)(.{0,8})$/), n = parseInt(r[2], 16), i = parseInt(r[1], 16) || 0, u[14] = n, u[15] = i, e(this._hash, u);
      }, f.hash = function (u, e) {
        return f.hashBinary(s(u), e);
      }, f.hashBinary = function (u, e) {
        var t = n(u),
            r = a(t);return e ? p(r) : r;
      }, f.ArrayBuffer = function () {
        this.reset();
      }, f.ArrayBuffer.prototype.append = function (u) {
        var t,
            n = A(this._buff.buffer, u, !0),
            i = n.length;for (this._length += u.byteLength, t = 64; t <= i; t += 64) {
          e(this._hash, r(n.subarray(t - 64, t)));
        }return this._buff = t - 64 < i ? new Uint8Array(n.buffer.slice(t - 64)) : new Uint8Array(0), this;
      }, f.ArrayBuffer.prototype.end = function (u) {
        var e,
            t,
            r = this._buff,
            n = r.length,
            i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];for (e = 0; e < n; e += 1) {
          i[e >> 2] |= r[e] << (e % 4 << 3);
        }return this._finish(i, n), t = a(this._hash), u && (t = p(t)), this.reset(), t;
      }, f.ArrayBuffer.prototype.reset = function () {
        return this._buff = new Uint8Array(0), this._length = 0, this._hash = [1732584193, -271733879, -1732584194, 271733878], this;
      }, f.ArrayBuffer.prototype.getState = function () {
        var u = f.prototype.getState.call(this);return u.buff = l(u.buff), u;
      }, f.ArrayBuffer.prototype.setState = function (u) {
        return u.buff = c(u.buff, !0), f.prototype.setState.call(this, u);
      }, f.ArrayBuffer.prototype.destroy = f.prototype.destroy, f.ArrayBuffer.prototype._finish = f.prototype._finish, f.ArrayBuffer.hash = function (u, e) {
        var t = i(new Uint8Array(u)),
            r = a(t);return e ? p(r) : r;
      }, f;
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
        t += E[u >> 8 * e + 4 & 15] + E[u >> 8 * e & 15];
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
    }function f() {
      this.reset();
    }var E = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];return "5d41402abc4b2a76b9719d911017c592" !== a(n("hello")) && function (u, e) {
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
    }(), f.prototype.append = function (u) {
      return this.appendBinary(s(u)), this;
    }, f.prototype.appendBinary = function (u) {
      this._buff += u, this._length += u.length;var r,
          n = this._buff.length;for (r = 64; r <= n; r += 64) {
        e(this._hash, t(this._buff.substring(r - 64, r)));
      }return this._buff = this._buff.substring(r - 64), this;
    }, f.prototype.end = function (u) {
      var e,
          t,
          r = this._buff,
          n = r.length,
          i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];for (e = 0; e < n; e += 1) {
        i[e >> 2] |= r.charCodeAt(e) << (e % 4 << 3);
      }return this._finish(i, n), t = a(this._hash), u && (t = p(t)), this.reset(), t;
    }, f.prototype.reset = function () {
      return this._buff = "", this._length = 0, this._hash = [1732584193, -271733879, -1732584194, 271733878], this;
    }, f.prototype.getState = function () {
      return { buff: this._buff, length: this._length, hash: this._hash };
    }, f.prototype.setState = function (u) {
      return this._buff = u.buff, this._length = u.length, this._hash = u.hash, this;
    }, f.prototype.destroy = function () {
      delete this._hash, delete this._buff, delete this._length;
    }, f.prototype._finish = function (u, t) {
      var r,
          n,
          i,
          o = t;if (u[o >> 2] |= 128 << (o % 4 << 3), o > 55) for (e(this._hash, u), o = 0; o < 16; o += 1) {
        u[o] = 0;
      }r = 8 * this._length, r = r.toString(16).match(/(.*?)(.{0,8})$/), n = parseInt(r[2], 16), i = parseInt(r[1], 16) || 0, u[14] = n, u[15] = i, e(this._hash, u);
    }, f.hash = function (u, e) {
      return f.hashBinary(s(u), e);
    }, f.hashBinary = function (u, e) {
      var t = n(u),
          r = a(t);return e ? p(r) : r;
    }, f.ArrayBuffer = function () {
      this.reset();
    }, f.ArrayBuffer.prototype.append = function (u) {
      var t,
          n = A(this._buff.buffer, u, !0),
          i = n.length;for (this._length += u.byteLength, t = 64; t <= i; t += 64) {
        e(this._hash, r(n.subarray(t - 64, t)));
      }return this._buff = t - 64 < i ? new Uint8Array(n.buffer.slice(t - 64)) : new Uint8Array(0), this;
    }, f.ArrayBuffer.prototype.end = function (u) {
      var e,
          t,
          r = this._buff,
          n = r.length,
          i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];for (e = 0; e < n; e += 1) {
        i[e >> 2] |= r[e] << (e % 4 << 3);
      }return this._finish(i, n), t = a(this._hash), u && (t = p(t)), this.reset(), t;
    }, f.ArrayBuffer.prototype.reset = function () {
      return this._buff = new Uint8Array(0), this._length = 0, this._hash = [1732584193, -271733879, -1732584194, 271733878], this;
    }, f.ArrayBuffer.prototype.getState = function () {
      var u = f.prototype.getState.call(this);return u.buff = l(u.buff), u;
    }, f.ArrayBuffer.prototype.setState = function (u) {
      return u.buff = c(u.buff, !0), f.prototype.setState.call(this, u);
    }, f.ArrayBuffer.prototype.destroy = f.prototype.destroy, f.ArrayBuffer.prototype._finish = f.prototype._finish, f.ArrayBuffer.hash = function (u, e) {
      var t = i(new Uint8Array(u)),
          r = a(t);return e ? p(r) : r;
    }, f;
  });
}); var FUNC_ERROR_TEXT = "Expected a function"; var NAN = NaN; var symbolTag = "[object Symbol]"; var reTrim = /^\s+|\s+$/g; var reIsBadHex = /^[-+]0x[0-9a-f]+$/i; var reIsBinary = /^0b[01]+$/i; var reIsOctal = /^0o[0-7]+$/i; var freeParseInt = parseInt; var freeGlobal = "object" == _typeof$1(commonjsGlobal$1) && commonjsGlobal$1 && commonjsGlobal$1.Object === Object && commonjsGlobal$1; var freeSelf = "object" == ("undefined" == typeof self ? "undefined" : _typeof$1(self)) && self && self.Object === Object && self; var root = freeGlobal || freeSelf || Function("return this")(); var objectProto = Object.prototype; var objectToString = objectProto.toString; var nativeMax = Math.max; var nativeMin = Math.min; var now = function now() {
  return root.Date.now();
}; var index$5 = throttle; var log$1 = logger.context("api-client"); var uploadURL = ENV.uploadApiUrl; var parseStoreOpts = function parseStoreOpts(u, e) {
  checkOptions("upload (storeParams)", [{ name: "location", type: index$2.enums.of("s3 gcs rackspace azure dropbox") }, { name: "region", type: index$2.String }, { name: "path", type: index$2.String }, { name: "container", type: index$2.String }, { name: "access", type: index$2.enums.of("public private") }], e);var t = snakeKeys(e, "store");return u.policy && u.signature ? Object.assign({}, t, { signature: u.signature, policy: u.policy }) : t;
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
    }, upload: function upload(u, e, r, n) {
      return _upload(t, u, e, r, n);
    } };
}; var client = { version: "0.3.4", init: init$1 };

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
  /* v0.4.1 */
  !function (e, t) {
    module.exports = t();
  }(commonjsGlobal, function () {
    function e(e) {
      return null == e ? "" : "object" === (void 0 === e ? "undefined" : un(e)) ? JSON.stringify(e, null, 2) : String(e);
    }function t(e) {
      var t = parseFloat(e);return isNaN(t) ? e : t;
    }function i(e, t) {
      for (var i = Object.create(null), n = e.split(","), o = 0; o < n.length; o++) {
        i[n[o]] = !0;
      }return t ? function (e) {
        return i[e.toLowerCase()];
      } : function (e) {
        return i[e];
      };
    }function n(e, t) {
      if (e.length) {
        var i = e.indexOf(t);if (i > -1) return e.splice(i, 1);
      }
    }function o(e, t) {
      return mn.call(e, t);
    }function r(e) {
      return "string" == typeof e || "number" == typeof e;
    }function s(e) {
      var t = Object.create(null);return function (i) {
        return t[i] || (t[i] = e(i));
      };
    }function a(e, t) {
      function i(i) {
        var n = arguments.length;return n ? n > 1 ? e.apply(t, arguments) : e.call(t, i) : e.call(t);
      }return i._length = e.length, i;
    }function l(e, t) {
      t = t || 0;for (var i = e.length - t, n = new Array(i); i--;) {
        n[i] = e[i + t];
      }return n;
    }function c(e, t) {
      for (var i in t) {
        e[i] = t[i];
      }return e;
    }function u(e) {
      return null !== e && "object" === (void 0 === e ? "undefined" : un(e));
    }function d(e) {
      return _n.call(e) === yn;
    }function f(e) {
      for (var t = {}, i = 0; i < e.length; i++) {
        e[i] && c(t, e[i]);
      }return t;
    }function p() {}function m(e, t) {
      var i = u(e),
          n = u(t);if (!i || !n) return !i && !n && String(e) === String(t);try {
        return JSON.stringify(e) === JSON.stringify(t);
      } catch (i) {
        return e === t;
      }
    }function h(e, t) {
      for (var i = 0; i < e.length; i++) {
        if (m(e[i], t)) return i;
      }return -1;
    }function v(e) {
      var t = !1;return function () {
        t || (t = !0, e());
      };
    }function g(e) {
      var t = (e + "").charCodeAt(0);return 36 === t || 95 === t;
    }function _(e, t, i, n) {
      Object.defineProperty(e, t, { value: i, enumerable: !!n, writable: !0, configurable: !0 });
    }function y(e) {
      if (!wn.test(e)) {
        var t = e.split(".");return function (e) {
          for (var i = 0; i < t.length; i++) {
            if (!e) return;e = e[t[i]];
          }return e;
        };
      }
    }function b(e) {
      return (/native code/.test(e.toString())
      );
    }function C(e) {
      zn.target && jn.push(zn.target), zn.target = e;
    }function E() {
      zn.target = jn.pop();
    }function S(e, t) {
      e.__proto__ = t;
    }function w(e, t, i) {
      for (var n = 0, o = i.length; n < o; n++) {
        var r = i[n];_(e, r, t[r]);
      }
    }function T(e, t) {
      if (u(e)) {
        var i;return o(e, "__ob__") && e.__ob__ instanceof Bn ? i = e.__ob__ : Hn.shouldConvert && !In() && (Array.isArray(e) || d(e)) && Object.isExtensible(e) && !e._isVue && (i = new Bn(e)), t && i && i.vmCount++, i;
      }
    }function A(e, t, i, n) {
      var o = new zn(),
          r = Object.getOwnPropertyDescriptor(e, t);if (!r || r.configurable !== !1) {
        var s = r && r.get,
            a = r && r.set,
            l = T(i);Object.defineProperty(e, t, { enumerable: !0, configurable: !0, get: function get$$1() {
            var t = s ? s.call(e) : i;return zn.target && (o.depend(), l && l.dep.depend(), Array.isArray(t) && R(t)), t;
          }, set: function set$$1(t) {
            var n = s ? s.call(e) : i;t === n || t !== t && n !== n || (a ? a.call(e, t) : i = t, l = T(t), o.notify());
          } });
      }
    }function F(e, t, i) {
      if (Array.isArray(e)) return e.length = Math.max(e.length, t), e.splice(t, 1, i), i;if (o(e, t)) return e[t] = i, i;var n = e.__ob__;return e._isVue || n && n.vmCount ? i : n ? (A(n.value, t, i), n.dep.notify(), i) : (e[t] = i, i);
    }function k(e, t) {
      if (Array.isArray(e)) return void e.splice(t, 1);var i = e.__ob__;e._isVue || i && i.vmCount || o(e, t) && (delete e[t], i && i.dep.notify());
    }function R(e) {
      for (var t = void 0, i = 0, n = e.length; i < n; i++) {
        t = e[i], t && t.__ob__ && t.__ob__.dep.depend(), Array.isArray(t) && R(t);
      }
    }function O(e, t) {
      if (!t) return e;for (var i, n, r, s = Object.keys(t), a = 0; a < s.length; a++) {
        i = s[a], n = e[i], r = t[i], o(e, i) ? d(n) && d(r) && O(n, r) : F(e, i, r);
      }return e;
    }function L(e, t) {
      return t ? e ? e.concat(t) : Array.isArray(t) ? t : [t] : e;
    }function N(e, t) {
      var i = Object.create(e || null);return t ? c(i, t) : i;
    }function x(e) {
      var t = e.props;if (t) {
        var i,
            n,
            o,
            r = {};if (Array.isArray(t)) for (i = t.length; i--;) {
          "string" == typeof (n = t[i]) && (o = hn(n), r[o] = { type: null });
        } else if (d(t)) for (var s in t) {
          n = t[s], o = hn(s), r[o] = d(n) ? n : { type: n };
        }e.props = r;
      }
    }function I(e) {
      var t = e.directives;if (t) for (var i in t) {
        var n = t[i];"function" == typeof n && (t[i] = { bind: n, update: n });
      }
    }function D(e, t, i) {
      function n(n) {
        var o = Yn[n] || Xn;u[n] = o(e[n], t[n], i, n);
      }x(t), I(t);var r = t.extends;if (r && (e = "function" == typeof r ? D(e, r.options, i) : D(e, r, i)), t.mixins) for (var s = 0, a = t.mixins.length; s < a; s++) {
        var l = t.mixins[s];l.prototype instanceof tt && (l = l.options), e = D(e, l, i);
      }var c,
          u = {};for (c in e) {
        n(c);
      }for (c in t) {
        o(e, c) || n(c);
      }return u;
    }function $(e, t, i, n) {
      if ("string" == typeof i) {
        var r = e[t];if (o(r, i)) return r[i];var s = hn(i);if (o(r, s)) return r[s];var a = vn(s);if (o(r, a)) return r[a];var l = r[i] || r[s] || r[a];return l;
      }
    }function U(e, t, i, n) {
      var r = t[e],
          s = !o(i, e),
          a = i[e];if (z(Boolean, r.type) && (s && !o(r, "default") ? a = !1 : z(String, r.type) || "" !== a && a !== gn(e) || (a = !0)), void 0 === a) {
        a = M(n, r, e);var l = Hn.shouldConvert;Hn.shouldConvert = !0, T(a), Hn.shouldConvert = l;
      }return a;
    }function M(e, t, i) {
      if (o(t, "default")) {
        var n = t.default;return e && e.$options.propsData && void 0 === e.$options.propsData[i] && void 0 !== e._props[i] ? e._props[i] : "function" == typeof n && "Function" !== P(t.type) ? n.call(e) : n;
      }
    }function P(e) {
      var t = e && e.toString().match(/^\s*function (\w+)/);return t && t[1];
    }function z(e, t) {
      if (!Array.isArray(t)) return P(t) === P(e);for (var i = 0, n = t.length; i < n; i++) {
        if (P(t[i]) === P(e)) return !0;
      }return !1;
    }function j(e, t, i) {
      if (En.errorHandler) En.errorHandler.call(null, e, t, i);else {
        if (!An || "undefined" == typeof console) throw e;console.error(e);
      }
    }function V(e) {
      return new qn(void 0, void 0, void 0, String(e));
    }function G(e) {
      var t = new qn(e.tag, e.data, e.children, e.text, e.elm, e.context, e.componentOptions);return t.ns = e.ns, t.isStatic = e.isStatic, t.key = e.key, t.isCloned = !0, t;
    }function W(e) {
      for (var t = e.length, i = new Array(t), n = 0; n < t; n++) {
        i[n] = G(e[n]);
      }return i;
    }function H(e) {
      function t() {
        var e = arguments,
            i = t.fns;if (!Array.isArray(i)) return i.apply(null, arguments);for (var n = 0; n < i.length; n++) {
          i[n].apply(null, e);
        }
      }return t.fns = e, t;
    }function B(e, t, i, n, o) {
      var r, s, a, l;for (r in e) {
        s = e[r], a = t[r], l = Jn(r), s && (a ? s !== a && (a.fns = s, e[r] = a) : (s.fns || (s = e[r] = H(s)), i(l.name, s, l.once, l.capture)));
      }for (r in t) {
        e[r] || (l = Jn(r), n(l.name, t[r], l.capture));
      }
    }function Y(e, t, i) {
      function o() {
        i.apply(this, arguments), n(r.fns, o);
      }var r,
          s = e[t];s ? s.fns && s.merged ? (r = s, r.fns.push(o)) : r = H([s, o]) : r = H([o]), r.merged = !0, e[t] = r;
    }function X(e) {
      for (var t = 0; t < e.length; t++) {
        if (Array.isArray(e[t])) return Array.prototype.concat.apply([], e);
      }return e;
    }function q(e) {
      return r(e) ? [V(e)] : Array.isArray(e) ? K(e) : void 0;
    }function K(e, t) {
      var i,
          n,
          o,
          s = [];for (i = 0; i < e.length; i++) {
        null != (n = e[i]) && "boolean" != typeof n && (o = s[s.length - 1], Array.isArray(n) ? s.push.apply(s, K(n, (t || "") + "_" + i)) : r(n) ? o && o.text ? o.text += String(n) : "" !== n && s.push(V(n)) : n.text && o && o.text ? s[s.length - 1] = V(o.text + n.text) : (n.tag && null == n.key && null != t && (n.key = "__vlist" + t + "_" + i + "__"), s.push(n)));
      }return s;
    }function Z(e) {
      return e && e.filter(function (e) {
        return e && e.componentOptions;
      })[0];
    }function Q(e) {
      e._events = Object.create(null), e._hasHookEvent = !1;var t = e.$options._parentListeners;t && te(e, t);
    }function J(e, t, i) {
      i ? Zn.$once(e, t) : Zn.$on(e, t);
    }function ee(e, t) {
      Zn.$off(e, t);
    }function te(e, t, i) {
      Zn = e, B(t, i || {}, J, ee, e);
    }function ie(e, t) {
      var i = {};if (!e) return i;for (var n, o, r = [], s = 0, a = e.length; s < a; s++) {
        if (o = e[s], (o.context === t || o.functionalContext === t) && o.data && (n = o.data.slot)) {
          var l = i[n] || (i[n] = []);"template" === o.tag ? l.push.apply(l, o.children) : l.push(o);
        } else r.push(o);
      }return r.every(ne) || (i.default = r), i;
    }function ne(e) {
      return e.isComment || " " === e.text;
    }function oe(e) {
      for (var t = {}, i = 0; i < e.length; i++) {
        t[e[i][0]] = e[i][1];
      }return t;
    }function re(e) {
      var t = e.$options,
          i = t.parent;if (i && !t.abstract) {
        for (; i.$options.abstract && i.$parent;) {
          i = i.$parent;
        }i.$children.push(e);
      }e.$parent = i, e.$root = i ? i.$root : e, e.$children = [], e.$refs = {}, e._watcher = null, e._inactive = null, e._directInactive = !1, e._isMounted = !1, e._isDestroyed = !1, e._isBeingDestroyed = !1;
    }function se(e, t, i) {
      e.$el = t, e.$options.render || (e.$options.render = Qn), de(e, "beforeMount");var n;return n = function n() {
        e._update(e._render(), i);
      }, e._watcher = new ao(e, n, p), i = !1, null == e.$vnode && (e._isMounted = !0, de(e, "mounted")), e;
    }function ae(e, t, i, n, o) {
      var r = !!(o || e.$options._renderChildren || n.data.scopedSlots || e.$scopedSlots !== Sn);if (e.$options._parentVnode = n, e.$vnode = n, e._vnode && (e._vnode.parent = n), e.$options._renderChildren = o, t && e.$options.props) {
        Hn.shouldConvert = !1;for (var s = e._props, a = e.$options._propKeys || [], l = 0; l < a.length; l++) {
          var c = a[l];s[c] = U(c, e.$options.props, t, e);
        }Hn.shouldConvert = !0, e.$options.propsData = t;
      }if (i) {
        var u = e.$options._parentListeners;e.$options._parentListeners = i, te(e, i, u);
      }r && (e.$slots = ie(o, n.context), e.$forceUpdate());
    }function le(e) {
      for (; e && (e = e.$parent);) {
        if (e._inactive) return !0;
      }return !1;
    }function ce(e, t) {
      if (t) {
        if (e._directInactive = !1, le(e)) return;
      } else if (e._directInactive) return;if (e._inactive || null == e._inactive) {
        e._inactive = !1;for (var i = 0; i < e.$children.length; i++) {
          ce(e.$children[i]);
        }de(e, "activated");
      }
    }function ue(e, t) {
      if (!(t && (e._directInactive = !0, le(e)) || e._inactive)) {
        e._inactive = !0;for (var i = 0; i < e.$children.length; i++) {
          ue(e.$children[i]);
        }de(e, "deactivated");
      }
    }function de(e, t) {
      var i = e.$options[t];if (i) for (var n = 0, o = i.length; n < o; n++) {
        try {
          i[n].call(e);
        } catch (i) {
          j(i, e, t + " hook");
        }
      }e._hasHookEvent && e.$emit("hook:" + t);
    }function fe() {
      to.length = 0, io = {}, no = oo = !1;
    }function pe() {
      oo = !0;var e, t, i;for (to.sort(function (e, t) {
        return e.id - t.id;
      }), ro = 0; ro < to.length; ro++) {
        e = to[ro], t = e.id, io[t] = null, e.run();
      }for (ro = to.length; ro--;) {
        e = to[ro], i = e.vm, i._watcher === e && i._isMounted && de(i, "updated");
      }Dn && En.devtools && Dn.emit("flush"), fe();
    }function me(e) {
      var t = e.id;if (null == io[t]) {
        if (io[t] = !0, oo) {
          for (var i = to.length - 1; i >= 0 && to[i].id > e.id;) {
            i--;
          }to.splice(Math.max(i, ro) + 1, 0, e);
        } else to.push(e);no || (no = !0, Un(pe));
      }
    }function he(e) {
      lo.clear(), ve(e, lo);
    }function ve(e, t) {
      var i,
          n,
          o = Array.isArray(e);if ((o || u(e)) && Object.isExtensible(e)) {
        if (e.__ob__) {
          var r = e.__ob__.dep.id;if (t.has(r)) return;t.add(r);
        }if (o) for (i = e.length; i--;) {
          ve(e[i], t);
        } else for (n = Object.keys(e), i = n.length; i--;) {
          ve(e[n[i]], t);
        }
      }
    }function ge(e, t, i) {
      co.get = function () {
        return this[t][i];
      }, co.set = function (e) {
        this[t][i] = e;
      }, Object.defineProperty(e, i, co);
    }function _e(e) {
      e._watchers = [];var t = e.$options;t.props && ye(e, t.props), t.methods && we(e, t.methods), t.data ? be(e) : T(e._data = {}, !0), t.computed && Ce(e, t.computed), t.watch && Te(e, t.watch);
    }function ye(e, t) {
      var i = e.$options.propsData || {},
          n = e._props = {},
          o = e.$options._propKeys = [],
          r = !e.$parent;Hn.shouldConvert = r;for (var s in t) {
        !function (r) {
          o.push(r), A(n, r, U(r, t, i, e)), r in e || ge(e, "_props", r);
        }(s);
      }Hn.shouldConvert = !0;
    }function be(e) {
      var t = e.$options.data;t = e._data = "function" == typeof t ? t.call(e) : t || {}, d(t) || (t = {});for (var i = Object.keys(t), n = e.$options.props, r = i.length; r--;) {
        n && o(n, i[r]) || g(i[r]) || ge(e, "_data", i[r]);
      }T(t, !0);
    }function Ce(e, t) {
      var i = e._computedWatchers = Object.create(null);for (var n in t) {
        var o = t[n],
            r = "function" == typeof o ? o : o.get;i[n] = new ao(e, r, p, uo), n in e || Ee(e, n, o);
      }
    }function Ee(e, t, i) {
      "function" == typeof i ? (co.get = Se(t), co.set = p) : (co.get = i.get ? i.cache !== !1 ? Se(t) : i.get : p, co.set = i.set ? i.set : p), Object.defineProperty(e, t, co);
    }function Se(e) {
      return function () {
        var t = this._computedWatchers && this._computedWatchers[e];if (t) return t.dirty && t.evaluate(), zn.target && t.depend(), t.value;
      };
    }function we(e, t) {
      e.$options.props;for (var i in t) {
        e[i] = null == t[i] ? p : a(t[i], e);
      }
    }function Te(e, t) {
      for (var i in t) {
        var n = t[i];if (Array.isArray(n)) for (var o = 0; o < n.length; o++) {
          Ae(e, i, n[o]);
        } else Ae(e, i, n);
      }
    }function Ae(e, t, i) {
      var n;d(i) && (n = i, i = i.handler), "string" == typeof i && (i = e[i]), e.$watch(t, i, n);
    }function Fe(e, t, i, n, o) {
      if (e) {
        var r = i.$options._base;if (u(e) && (e = r.extend(e)), "function" == typeof e) {
          if (!e.cid) if (e.resolved) e = e.resolved;else if (!(e = Oe(e, r, function () {
            i.$forceUpdate();
          }))) return;Qe(e), t = t || {}, t.model && De(e.options, t);var s = Le(t, e);if (e.options.functional) return ke(e, s, t, i, n);var a = t.on;t.on = t.nativeOn, e.options.abstract && (t = {}), xe(t);var l = e.options.name || o;return new qn("vue-component-" + e.cid + (l ? "-" + l : ""), t, void 0, void 0, void 0, i, { Ctor: e, propsData: s, listeners: a, tag: o, children: n });
        }
      }
    }function ke(e, t, i, n, o) {
      var r = {},
          s = e.options.props;if (s) for (var a in s) {
        r[a] = U(a, s, t);
      }var l = Object.create(n),
          c = function c(e, t, i, n) {
        return $e(l, e, t, i, n, !0);
      },
          u = e.options.render.call(null, c, { props: r, data: i, parent: n, children: o, slots: function slots() {
          return ie(o, n);
        } });return u instanceof qn && (u.functionalContext = n, i.slot && ((u.data || (u.data = {})).slot = i.slot)), u;
    }function Re(e, t, i, n) {
      var o = e.componentOptions,
          r = { _isComponent: !0, parent: t, propsData: o.propsData, _componentTag: o.tag, _parentVnode: e, _parentListeners: o.listeners, _renderChildren: o.children, _parentElm: i || null, _refElm: n || null },
          s = e.data.inlineTemplate;return s && (r.render = s.render, r.staticRenderFns = s.staticRenderFns), new o.Ctor(r);
    }function Oe(e, t, i) {
      if (!e.requested) {
        e.requested = !0;var n = e.pendingCallbacks = [i],
            o = !0,
            r = function r(i) {
          if (u(i) && (i = t.extend(i)), e.resolved = i, !o) for (var r = 0, s = n.length; r < s; r++) {
            n[r](i);
          }
        },
            s = function s(e) {},
            a = e(r, s);return a && "function" == typeof a.then && !e.resolved && a.then(r, s), o = !1, e.resolved;
      }e.pendingCallbacks.push(i);
    }function Le(e, t) {
      var i = t.options.props;if (i) {
        var n = {},
            o = e.attrs,
            r = e.props,
            s = e.domProps;if (o || r || s) for (var a in i) {
          var l = gn(a);Ne(n, r, a, l, !0) || Ne(n, o, a, l) || Ne(n, s, a, l);
        }return n;
      }
    }function Ne(e, t, i, n, r) {
      if (t) {
        if (o(t, i)) return e[i] = t[i], r || delete t[i], !0;if (o(t, n)) return e[i] = t[n], r || delete t[n], !0;
      }return !1;
    }function xe(e) {
      e.hook || (e.hook = {});for (var t = 0; t < po.length; t++) {
        var i = po[t],
            n = e.hook[i],
            o = fo[i];e.hook[i] = n ? Ie(o, n) : o;
      }
    }function Ie(e, t) {
      return function (i, n, o, r) {
        e(i, n, o, r), t(i, n, o, r);
      };
    }function De(e, t) {
      var i = e.model && e.model.prop || "value",
          n = e.model && e.model.event || "input";(t.props || (t.props = {}))[i] = t.model.value;var o = t.on || (t.on = {});o[n] ? o[n] = [t.model.callback].concat(o[n]) : o[n] = t.model.callback;
    }function $e(e, t, i, n, o, s) {
      return (Array.isArray(i) || r(i)) && (o = n, n = i, i = void 0), s && (o = ho), Ue(e, t, i, n, o);
    }function Ue(e, t, i, n, o) {
      if (i && i.__ob__) return Qn();if (!t) return Qn();Array.isArray(n) && "function" == typeof n[0] && (i = i || {}, i.scopedSlots = { default: n[0] }, n.length = 0), o === ho ? n = q(n) : o === mo && (n = X(n));var r, s;if ("string" == typeof t) {
        var a;s = En.getTagNamespace(t), r = En.isReservedTag(t) ? new qn(En.parsePlatformTagName(t), i, n, void 0, void 0, e) : (a = $(e.$options, "components", t)) ? Fe(a, i, e, n, t) : new qn(t, i, n, void 0, void 0, e);
      } else r = Fe(t, i, e, n);return r ? (s && Me(r, s), r) : Qn();
    }function Me(e, t) {
      if (e.ns = t, "foreignObject" !== e.tag && e.children) for (var i = 0, n = e.children.length; i < n; i++) {
        var o = e.children[i];o.tag && !o.ns && Me(o, t);
      }
    }function Pe(e, t) {
      var i, n, o, r, s;if (Array.isArray(e) || "string" == typeof e) for (i = new Array(e.length), n = 0, o = e.length; n < o; n++) {
        i[n] = t(e[n], n);
      } else if ("number" == typeof e) for (i = new Array(e), n = 0; n < e; n++) {
        i[n] = t(n + 1, n);
      } else if (u(e)) for (r = Object.keys(e), i = new Array(r.length), n = 0, o = r.length; n < o; n++) {
        s = r[n], i[n] = t(e[s], s, n);
      }return i;
    }function ze(e, t, i, n) {
      var o = this.$scopedSlots[e];if (o) return i = i || {}, n && c(i, n), o(i) || t;var r = this.$slots[e];return r || t;
    }function je(e) {
      return $(this.$options, "filters", e, !0) || Cn;
    }function Ve(e, t, i) {
      var n = En.keyCodes[t] || i;return Array.isArray(n) ? n.indexOf(e) === -1 : n !== e;
    }function Ge(e, t, i, n) {
      if (i) if (u(i)) {
        Array.isArray(i) && (i = f(i));var o;for (var r in i) {
          if ("class" === r || "style" === r) o = e;else {
            var s = e.attrs && e.attrs.type;o = n || En.mustUseProp(t, s, r) ? e.domProps || (e.domProps = {}) : e.attrs || (e.attrs = {});
          }r in o || (o[r] = i[r]);
        }
      } else ;return e;
    }function We(e, t) {
      var i = this._staticTrees[e];return i && !t ? Array.isArray(i) ? W(i) : G(i) : (i = this._staticTrees[e] = this.$options.staticRenderFns[e].call(this._renderProxy), Be(i, "__static__" + e, !1), i);
    }function He(e, t, i) {
      return Be(e, "__once__" + t + (i ? "_" + i : ""), !0), e;
    }function Be(e, t, i) {
      if (Array.isArray(e)) for (var n = 0; n < e.length; n++) {
        e[n] && "string" != typeof e[n] && Ye(e[n], t + "_" + n, i);
      } else Ye(e, t, i);
    }function Ye(e, t, i) {
      e.isStatic = !0, e.key = t, e.isOnce = i;
    }function Xe(e) {
      e.$vnode = null, e._vnode = null, e._staticTrees = null;var t = e.$options._parentVnode,
          i = t && t.context;e.$slots = ie(e.$options._renderChildren, i), e.$scopedSlots = Sn, e._c = function (t, i, n, o) {
        return $e(e, t, i, n, o, !1);
      }, e.$createElement = function (t, i, n, o) {
        return $e(e, t, i, n, o, !0);
      };
    }function qe(e) {
      var t = e.$options.provide;t && (e._provided = "function" == typeof t ? t.call(e) : t);
    }function Ke(e) {
      var t = e.$options.inject;if (t) for (var i = Array.isArray(t), n = i ? t : $n ? Reflect.ownKeys(t) : Object.keys(t), o = 0; o < n.length; o++) {
        for (var r = n[o], s = i ? r : t[r], a = e; a;) {
          if (a._provided && s in a._provided) {
            e[r] = a._provided[s];break;
          }a = a.$parent;
        }
      }
    }function Ze(e, t) {
      var i = e.$options = Object.create(e.constructor.options);i.parent = t.parent, i.propsData = t.propsData, i._parentVnode = t._parentVnode, i._parentListeners = t._parentListeners, i._renderChildren = t._renderChildren, i._componentTag = t._componentTag, i._parentElm = t._parentElm, i._refElm = t._refElm, t.render && (i.render = t.render, i.staticRenderFns = t.staticRenderFns);
    }function Qe(e) {
      var t = e.options;if (e.super) {
        var i = Qe(e.super);if (i !== e.superOptions) {
          e.superOptions = i;var n = Je(e);n && c(e.extendOptions, n), t = e.options = D(i, e.extendOptions), t.name && (t.components[t.name] = e);
        }
      }return t;
    }function Je(e) {
      var t,
          i = e.options,
          n = e.sealedOptions;for (var o in i) {
        i[o] !== n[o] && (t || (t = {}), t[o] = et(i[o], n[o]));
      }return t;
    }function et(e, t) {
      if (Array.isArray(e)) {
        var i = [];t = Array.isArray(t) ? t : [t];for (var n = 0; n < e.length; n++) {
          t.indexOf(e[n]) < 0 && i.push(e[n]);
        }return i;
      }return e;
    }function tt(e) {
      this._init(e);
    }function it(e) {
      e.use = function (e) {
        if (!e.installed) {
          var t = l(arguments, 1);return t.unshift(this), "function" == typeof e.install ? e.install.apply(e, t) : "function" == typeof e && e.apply(null, t), e.installed = !0, this;
        }
      };
    }function nt(e) {
      e.mixin = function (e) {
        this.options = D(this.options, e);
      };
    }function ot(e) {
      e.cid = 0;var t = 1;e.extend = function (e) {
        e = e || {};var i = this,
            n = i.cid,
            o = e._Ctor || (e._Ctor = {});if (o[n]) return o[n];var r = e.name || i.options.name,
            s = function s(e) {
          this._init(e);
        };return s.prototype = Object.create(i.prototype), s.prototype.constructor = s, s.cid = t++, s.options = D(i.options, e), s.super = i, s.options.props && rt(s), s.options.computed && st(s), s.extend = i.extend, s.mixin = i.mixin, s.use = i.use, En._assetTypes.forEach(function (e) {
          s[e] = i[e];
        }), r && (s.options.components[r] = s), s.superOptions = i.options, s.extendOptions = e, s.sealedOptions = c({}, s.options), o[n] = s, s;
      };
    }function rt(e) {
      var t = e.options.props;for (var i in t) {
        ge(e.prototype, "_props", i);
      }
    }function st(e) {
      var t = e.options.computed;for (var i in t) {
        Ee(e.prototype, i, t[i]);
      }
    }function at(e) {
      En._assetTypes.forEach(function (t) {
        e[t] = function (e, i) {
          return i ? ("component" === t && d(i) && (i.name = i.name || e, i = this.options._base.extend(i)), "directive" === t && "function" == typeof i && (i = { bind: i, update: i }), this.options[t + "s"][e] = i, i) : this.options[t + "s"][e];
        };
      });
    }function lt(e) {
      return e && (e.Ctor.options.name || e.tag);
    }function ct(e, t) {
      return "string" == typeof e ? e.split(",").indexOf(t) > -1 : e instanceof RegExp && e.test(t);
    }function ut(e, t) {
      for (var i in e) {
        var n = e[i];if (n) {
          var o = lt(n.componentOptions);o && !t(o) && (dt(n), e[i] = null);
        }
      }
    }function dt(e) {
      e && (e.componentInstance._inactive || de(e.componentInstance, "deactivated"), e.componentInstance.$destroy());
    }function ft(e) {
      for (var t = e.data, i = e, n = e; n.componentInstance;) {
        n = n.componentInstance._vnode, n.data && (t = pt(n.data, t));
      }for (; i = i.parent;) {
        i.data && (t = pt(t, i.data));
      }return mt(t);
    }function pt(e, t) {
      return { staticClass: ht(e.staticClass, t.staticClass), class: e.class ? [e.class, t.class] : t.class };
    }function mt(e) {
      var t = e.class,
          i = e.staticClass;return i || t ? ht(i, vt(t)) : "";
    }function ht(e, t) {
      return e ? t ? e + " " + t : e : t || "";
    }function vt(e) {
      var t = "";if (!e) return t;if ("string" == typeof e) return e;if (Array.isArray(e)) {
        for (var i, n = 0, o = e.length; n < o; n++) {
          e[n] && (i = vt(e[n])) && (t += i + " ");
        }return t.slice(0, -1);
      }if (u(e)) {
        for (var r in e) {
          e[r] && (t += r + " ");
        }return t.slice(0, -1);
      }return t;
    }function gt(e) {
      return No(e) ? "svg" : "math" === e ? "math" : void 0;
    }function _t(e) {
      if (!An) return !0;if (xo(e)) return !1;if (e = e.toLowerCase(), null != Io[e]) return Io[e];var t = document.createElement(e);return e.indexOf("-") > -1 ? Io[e] = t.constructor === window.HTMLUnknownElement || t.constructor === window.HTMLElement : Io[e] = /HTMLUnknownElement/.test(t.toString());
    }function yt(e) {
      if ("string" == typeof e) {
        var t = document.querySelector(e);return t ? t : document.createElement("div");
      }return e;
    }function bt(e, t) {
      var i = document.createElement(e);return "select" !== e ? i : (t.data && t.data.attrs && void 0 !== t.data.attrs.multiple && i.setAttribute("multiple", "multiple"), i);
    }function Ct(e, t) {
      return document.createElementNS(Oo[e], t);
    }function Et(e) {
      return document.createTextNode(e);
    }function St(e) {
      return document.createComment(e);
    }function wt(e, t, i) {
      e.insertBefore(t, i);
    }function Tt(e, t) {
      e.removeChild(t);
    }function At(e, t) {
      e.appendChild(t);
    }function Ft(e) {
      return e.parentNode;
    }function kt(e) {
      return e.nextSibling;
    }function Rt(e) {
      return e.tagName;
    }function Ot(e, t) {
      e.textContent = t;
    }function Lt(e, t, i) {
      e.setAttribute(t, i);
    }function Nt(e, t) {
      var i = e.data.ref;if (i) {
        var o = e.context,
            r = e.componentInstance || e.elm,
            s = o.$refs;t ? Array.isArray(s[i]) ? n(s[i], r) : s[i] === r && (s[i] = void 0) : e.data.refInFor ? Array.isArray(s[i]) && s[i].indexOf(r) < 0 ? s[i].push(r) : s[i] = [r] : s[i] = r;
      }
    }function xt(e) {
      return null == e;
    }function It(e) {
      return null != e;
    }function Dt(e, t) {
      return e.key === t.key && e.tag === t.tag && e.isComment === t.isComment && !e.data == !t.data;
    }function $t(e, t, i) {
      var n,
          o,
          r = {};for (n = t; n <= i; ++n) {
        o = e[n].key, It(o) && (r[o] = n);
      }return r;
    }function Ut(e, t) {
      (e.data.directives || t.data.directives) && Mt(e, t);
    }function Mt(e, t) {
      var i,
          n,
          o,
          r = e === Uo,
          s = t === Uo,
          a = Pt(e.data.directives, e.context),
          l = Pt(t.data.directives, t.context),
          c = [],
          u = [];for (i in l) {
        n = a[i], o = l[i], n ? (o.oldValue = n.value, jt(o, "update", t, e), o.def && o.def.componentUpdated && u.push(o)) : (jt(o, "bind", t, e), o.def && o.def.inserted && c.push(o));
      }if (c.length) {
        var d = function d() {
          for (var i = 0; i < c.length; i++) {
            jt(c[i], "inserted", t, e);
          }
        };r ? Y(t.data.hook || (t.data.hook = {}), "insert", d) : d();
      }if (u.length && Y(t.data.hook || (t.data.hook = {}), "postpatch", function () {
        for (var i = 0; i < u.length; i++) {
          jt(u[i], "componentUpdated", t, e);
        }
      }), !r) for (i in a) {
        l[i] || jt(a[i], "unbind", e, e, s);
      }
    }function Pt(e, t) {
      var i = Object.create(null);if (!e) return i;var n, o;for (n = 0; n < e.length; n++) {
        o = e[n], o.modifiers || (o.modifiers = zo), i[zt(o)] = o, o.def = $(t.$options, "directives", o.name, !0);
      }return i;
    }function zt(e) {
      return e.rawName || e.name + "." + Object.keys(e.modifiers || {}).join(".");
    }function jt(e, t, i, n, o) {
      var r = e.def && e.def[t];r && r(i.elm, e, i, n, o);
    }function Vt(e, t) {
      if (e.data.attrs || t.data.attrs) {
        var i,
            n,
            o = t.elm,
            r = e.data.attrs || {},
            s = t.data.attrs || {};s.__ob__ && (s = t.data.attrs = c({}, s));for (i in s) {
          n = s[i], r[i] !== n && Gt(o, i, n);
        }Rn && s.value !== r.value && Gt(o, "value", s.value);for (i in r) {
          null == s[i] && (Fo(i) ? o.removeAttributeNS(Ao, ko(i)) : wo(i) || o.removeAttribute(i));
        }
      }
    }function Gt(e, t, i) {
      To(t) ? Ro(i) ? e.removeAttribute(t) : e.setAttribute(t, t) : wo(t) ? e.setAttribute(t, Ro(i) || "false" === i ? "false" : "true") : Fo(t) ? Ro(i) ? e.removeAttributeNS(Ao, ko(t)) : e.setAttributeNS(Ao, t, i) : Ro(i) ? e.removeAttribute(t) : e.setAttribute(t, i);
    }function Wt(e, t) {
      var i = t.elm,
          n = t.data,
          o = e.data;if (n.staticClass || n.class || o && (o.staticClass || o.class)) {
        var r = ft(t),
            s = i._transitionClasses;s && (r = ht(r, vt(s))), r !== i._prevClass && (i.setAttribute("class", r), i._prevClass = r);
      }
    }function Ht(e) {
      var t;e[Wo] && (t = kn ? "change" : "input", e[t] = [].concat(e[Wo], e[t] || []), delete e[Wo]), e[Ho] && (t = xn ? "click" : "change", e[t] = [].concat(e[Ho], e[t] || []), delete e[Ho]);
    }function Bt(e, _t2, i, n) {
      if (i) {
        var o = _t2,
            r = bo;_t2 = function t(i) {
          null !== (1 === arguments.length ? o(i) : o.apply(null, arguments)) && Yt(e, _t2, n, r);
        };
      }bo.addEventListener(e, _t2, n);
    }function Yt(e, t, i, n) {
      (n || bo).removeEventListener(e, t, i);
    }function Xt(e, t) {
      if (e.data.on || t.data.on) {
        var i = t.data.on || {},
            n = e.data.on || {};bo = t.elm, Ht(i), B(i, n, Bt, Yt, t.context);
      }
    }function qt(e, t) {
      if (e.data.domProps || t.data.domProps) {
        var i,
            n,
            o = t.elm,
            r = e.data.domProps || {},
            s = t.data.domProps || {};s.__ob__ && (s = t.data.domProps = c({}, s));for (i in r) {
          null == s[i] && (o[i] = "");
        }for (i in s) {
          if (n = s[i], "textContent" !== i && "innerHTML" !== i || (t.children && (t.children.length = 0), n !== r[i])) if ("value" === i) {
            o._value = n;var a = null == n ? "" : String(n);Kt(o, t, a) && (o.value = a);
          } else o[i] = n;
        }
      }
    }function Kt(e, t, i) {
      return !e.composing && ("option" === t.tag || Zt(e, i) || Qt(e, i));
    }function Zt(e, t) {
      return document.activeElement !== e && e.value !== t;
    }function Qt(e, i) {
      var n = e.value,
          o = e._vModifiers;return o && o.number || "number" === e.type ? t(n) !== t(i) : o && o.trim ? n.trim() !== i.trim() : n !== i;
    }function Jt(e) {
      var t = ei(e.style);return e.staticStyle ? c(e.staticStyle, t) : t;
    }function ei(e) {
      return Array.isArray(e) ? f(e) : "string" == typeof e ? Xo(e) : e;
    }function ti(e, t) {
      var i,
          n = {};if (t) for (var o = e; o.componentInstance;) {
        o = o.componentInstance._vnode, o.data && (i = Jt(o.data)) && c(n, i);
      }(i = Jt(e.data)) && c(n, i);for (var r = e; r = r.parent;) {
        r.data && (i = Jt(r.data)) && c(n, i);
      }return n;
    }function ii(e, t) {
      var i = t.data,
          n = e.data;if (i.staticStyle || i.style || n.staticStyle || n.style) {
        var o,
            r,
            s = t.elm,
            a = e.data.staticStyle,
            l = e.data.style || {},
            u = a || l,
            d = ei(t.data.style) || {};t.data.style = d.__ob__ ? c({}, d) : d;var f = ti(t, !0);for (r in u) {
          null == f[r] && Zo(s, r, "");
        }for (r in f) {
          (o = f[r]) !== u[r] && Zo(s, r, null == o ? "" : o);
        }
      }
    }function ni(e, t) {
      if (t && (t = t.trim())) if (e.classList) t.indexOf(" ") > -1 ? t.split(/\s+/).forEach(function (t) {
        return e.classList.add(t);
      }) : e.classList.add(t);else {
        var i = " " + (e.getAttribute("class") || "") + " ";i.indexOf(" " + t + " ") < 0 && e.setAttribute("class", (i + t).trim());
      }
    }function oi(e, t) {
      if (t && (t = t.trim())) if (e.classList) t.indexOf(" ") > -1 ? t.split(/\s+/).forEach(function (t) {
        return e.classList.remove(t);
      }) : e.classList.remove(t);else {
        for (var i = " " + (e.getAttribute("class") || "") + " ", n = " " + t + " "; i.indexOf(n) >= 0;) {
          i = i.replace(n, " ");
        }e.setAttribute("class", i.trim());
      }
    }function ri(e) {
      if (e) {
        if ("object" === (void 0 === e ? "undefined" : un(e))) {
          var t = {};return e.css !== !1 && c(t, tr(e.name || "v")), c(t, e), t;
        }return "string" == typeof e ? tr(e) : void 0;
      }
    }function si(e) {
      cr(function () {
        cr(e);
      });
    }function ai(e, t) {
      (e._transitionClasses || (e._transitionClasses = [])).push(t), ni(e, t);
    }function li(e, t) {
      e._transitionClasses && n(e._transitionClasses, t), oi(e, t);
    }function ci(e, t, i) {
      var n = ui(e, t),
          o = n.type,
          r = n.timeout,
          s = n.propCount;if (!o) return i();var a = o === nr ? sr : lr,
          l = 0,
          c = function c() {
        e.removeEventListener(a, u), i();
      },
          u = function u(t) {
        t.target === e && ++l >= s && c();
      };setTimeout(function () {
        l < s && c();
      }, r + 1), e.addEventListener(a, u);
    }function ui(e, t) {
      var i,
          n = window.getComputedStyle(e),
          o = n[rr + "Delay"].split(", "),
          r = n[rr + "Duration"].split(", "),
          s = di(o, r),
          a = n[ar + "Delay"].split(", "),
          l = n[ar + "Duration"].split(", "),
          c = di(a, l),
          u = 0,
          d = 0;return t === nr ? s > 0 && (i = nr, u = s, d = r.length) : t === or ? c > 0 && (i = or, u = c, d = l.length) : (u = Math.max(s, c), i = u > 0 ? s > c ? nr : or : null, d = i ? i === nr ? r.length : l.length : 0), { type: i, timeout: u, propCount: d, hasTransform: i === nr && ur.test(n[rr + "Property"]) };
    }function di(e, t) {
      for (; e.length < t.length;) {
        e = e.concat(e);
      }return Math.max.apply(null, t.map(function (t, i) {
        return fi(t) + fi(e[i]);
      }));
    }function fi(e) {
      return 1e3 * Number(e.slice(0, -1));
    }function pi(e, i) {
      var n = e.elm;n._leaveCb && (n._leaveCb.cancelled = !0, n._leaveCb());var o = ri(e.data.transition);if (o && !n._enterCb && 1 === n.nodeType) {
        for (var r = o.css, s = o.type, a = o.enterClass, l = o.enterToClass, c = o.enterActiveClass, d = o.appearClass, f = o.appearToClass, p = o.appearActiveClass, m = o.beforeEnter, h = o.enter, g = o.afterEnter, _ = o.enterCancelled, y = o.beforeAppear, b = o.appear, C = o.afterAppear, E = o.appearCancelled, S = o.duration, w = eo, T = eo.$vnode; T && T.parent;) {
          T = T.parent, w = T.context;
        }var A = !w._isMounted || !e.isRootInsert;if (!A || b || "" === b) {
          var F = A && d ? d : a,
              k = A && p ? p : c,
              R = A && f ? f : l,
              O = A ? y || m : m,
              L = A && "function" == typeof b ? b : h,
              N = A ? C || g : g,
              x = A ? E || _ : _,
              I = t(u(S) ? S.enter : S),
              D = r !== !1 && !Rn,
              $ = vi(L),
              U = n._enterCb = v(function () {
            D && (li(n, R), li(n, k)), U.cancelled ? (D && li(n, F), x && x(n)) : N && N(n), n._enterCb = null;
          });e.data.show || Y(e.data.hook || (e.data.hook = {}), "insert", function () {
            var t = n.parentNode,
                i = t && t._pending && t._pending[e.key];i && i.tag === e.tag && i.elm._leaveCb && i.elm._leaveCb(), L && L(n, U);
          }), O && O(n), D && (ai(n, F), ai(n, k), si(function () {
            ai(n, R), li(n, F), U.cancelled || $ || (hi(I) ? setTimeout(U, I) : ci(n, s, U));
          })), e.data.show && (i && i(), L && L(n, U)), D || $ || U();
        }
      }
    }function mi(e, i) {
      function n() {
        E.cancelled || (e.data.show || ((o.parentNode._pending || (o.parentNode._pending = {}))[e.key] = e), f && f(o), y && (ai(o, l), ai(o, d), si(function () {
          ai(o, c), li(o, l), E.cancelled || b || (hi(C) ? setTimeout(E, C) : ci(o, a, E));
        })), p && p(o, E), y || b || E());
      }var o = e.elm;o._enterCb && (o._enterCb.cancelled = !0, o._enterCb());var r = ri(e.data.transition);if (!r) return i();if (!o._leaveCb && 1 === o.nodeType) {
        var s = r.css,
            a = r.type,
            l = r.leaveClass,
            c = r.leaveToClass,
            d = r.leaveActiveClass,
            f = r.beforeLeave,
            p = r.leave,
            m = r.afterLeave,
            h = r.leaveCancelled,
            g = r.delayLeave,
            _ = r.duration,
            y = s !== !1 && !Rn,
            b = vi(p),
            C = t(u(_) ? _.leave : _),
            E = o._leaveCb = v(function () {
          o.parentNode && o.parentNode._pending && (o.parentNode._pending[e.key] = null), y && (li(o, c), li(o, d)), E.cancelled ? (y && li(o, l), h && h(o)) : (i(), m && m(o)), o._leaveCb = null;
        });g ? g(n) : n();
      }
    }function hi(e) {
      return "number" == typeof e && !isNaN(e);
    }function vi(e) {
      if (!e) return !1;var t = e.fns;return t ? vi(Array.isArray(t) ? t[0] : t) : (e._length || e.length) > 1;
    }function gi(e, t) {
      t.data.show || pi(t);
    }function _i(e, t, i) {
      var n = t.value,
          o = e.multiple;if (!o || Array.isArray(n)) {
        for (var r, s, a = 0, l = e.options.length; a < l; a++) {
          if (s = e.options[a], o) r = h(n, bi(s)) > -1, s.selected !== r && (s.selected = r);else if (m(bi(s), n)) return void (e.selectedIndex !== a && (e.selectedIndex = a));
        }o || (e.selectedIndex = -1);
      }
    }function yi(e, t) {
      for (var i = 0, n = t.length; i < n; i++) {
        if (m(bi(t[i]), e)) return !1;
      }return !0;
    }function bi(e) {
      return "_value" in e ? e._value : e.value;
    }function Ci(e) {
      e.target.composing = !0;
    }function Ei(e) {
      e.target.composing = !1, Si(e.target, "input");
    }function Si(e, t) {
      var i = document.createEvent("HTMLEvents");i.initEvent(t, !0, !0), e.dispatchEvent(i);
    }function wi(e) {
      return !e.componentInstance || e.data && e.data.transition ? e : wi(e.componentInstance._vnode);
    }function Ti(e) {
      var t = e && e.componentOptions;return t && t.Ctor.options.abstract ? Ti(Z(t.children)) : e;
    }function Ai(e) {
      var t = {},
          i = e.$options;for (var n in i.propsData) {
        t[n] = e[n];
      }var o = i._parentListeners;for (var r in o) {
        t[hn(r)] = o[r];
      }return t;
    }function Fi(e, t) {
      return (/\d-keep-alive$/.test(t.tag) ? e("keep-alive") : null
      );
    }function ki(e) {
      for (; e = e.parent;) {
        if (e.data.transition) return !0;
      }
    }function Ri(e, t) {
      return t.key === e.key && t.tag === e.tag;
    }function Oi(e) {
      e.elm._moveCb && e.elm._moveCb(), e.elm._enterCb && e.elm._enterCb();
    }function Li(e) {
      e.data.newPos = e.elm.getBoundingClientRect();
    }function Ni(e) {
      var t = e.data.pos,
          i = e.data.newPos,
          n = t.left - i.left,
          o = t.top - i.top;if (n || o) {
        e.data.moved = !0;var r = e.elm.style;r.transform = r.WebkitTransform = "translate(" + n + "px," + o + "px)", r.transitionDuration = "0s";
      }
    }function xi(e) {
      Ir && (e._devtoolHook = Ir, Ir.emit("vuex:init", e), Ir.on("vuex:travel-to-state", function (t) {
        e.replaceState(t);
      }), e.subscribe(function (e, t) {
        Ir.emit("vuex:mutation", e, t);
      }));
    }function Ii(e, t) {
      Object.keys(e).forEach(function (i) {
        return t(e[i], i);
      });
    }function Di(e) {
      return null !== e && "object" === (void 0 === e ? "undefined" : un(e));
    }function $i(e) {
      return e && "function" == typeof e.then;
    }function Ui(e, t) {
      if (!e) throw new Error("[vuex] " + t);
    }function Mi(e, t) {
      if (e.update(t), t.modules) for (var i in t.modules) {
        if (!e.getChild(i)) return void console.warn("[vuex] trying to add a new module '" + i + "' on hot reloading, manual reload is needed");Mi(e.getChild(i), t.modules[i]);
      }
    }function Pi(e, t) {
      e._actions = Object.create(null), e._mutations = Object.create(null), e._wrappedGetters = Object.create(null), e._modulesNamespaceMap = Object.create(null);var i = e.state;ji(e, i, [], e._modules.root, !0), zi(e, i, t);
    }function zi(e, t, i) {
      var n = e._vm;e.getters = {};var o = e._wrappedGetters,
          r = {};Ii(o, function (t, i) {
        r[i] = function () {
          return t(e);
        }, Object.defineProperty(e.getters, i, { get: function get$$1() {
            return e._vm[i];
          }, enumerable: !0 });
      });var s = Mr.config.silent;Mr.config.silent = !0, e._vm = new Mr({ data: { $$state: t }, computed: r }), Mr.config.silent = s, e.strict && Yi(e), n && (i && e._withCommit(function () {
        n._data.$$state = null;
      }), Mr.nextTick(function () {
        return n.$destroy();
      }));
    }function ji(e, t, i, n, o) {
      var r = !i.length,
          s = e._modules.getNamespace(i);if (s && (e._modulesNamespaceMap[s] = n), !r && !o) {
        var a = Xi(t, i.slice(0, -1)),
            l = i[i.length - 1];e._withCommit(function () {
          Mr.set(a, l, n.state);
        });
      }var c = n.context = Vi(e, s, i);n.forEachMutation(function (t, i) {
        Wi(e, s + i, t, c);
      }), n.forEachAction(function (t, i) {
        Hi(e, s + i, t, c);
      }), n.forEachGetter(function (t, i) {
        Bi(e, s + i, t, c);
      }), n.forEachChild(function (n, r) {
        ji(e, t, i.concat(r), n, o);
      });
    }function Vi(e, t, i) {
      var n = "" === t,
          o = { dispatch: n ? e.dispatch : function (i, n, o) {
          var r = qi(i, n, o),
              s = r.payload,
              a = r.options,
              l = r.type;return a && a.root || (l = t + l, e._actions[l]) ? e.dispatch(l, s) : void console.error("[vuex] unknown local action type: " + r.type + ", global type: " + l);
        }, commit: n ? e.commit : function (i, n, o) {
          var r = qi(i, n, o),
              s = r.payload,
              a = r.options,
              l = r.type;if (!(a && a.root || (l = t + l, e._mutations[l]))) return void console.error("[vuex] unknown local mutation type: " + r.type + ", global type: " + l);e.commit(l, s, a);
        } };return Object.defineProperties(o, { getters: { get: n ? function () {
            return e.getters;
          } : function () {
            return Gi(e, t);
          } }, state: { get: function get$$1() {
            return Xi(e.state, i);
          } } }), o;
    }function Gi(e, t) {
      var i = {},
          n = t.length;return Object.keys(e.getters).forEach(function (o) {
        if (o.slice(0, n) === t) {
          var r = o.slice(n);Object.defineProperty(i, r, { get: function get$$1() {
              return e.getters[o];
            }, enumerable: !0 });
        }
      }), i;
    }function Wi(e, t, i, n) {
      (e._mutations[t] || (e._mutations[t] = [])).push(function (e) {
        i(n.state, e);
      });
    }function Hi(e, t, i, n) {
      (e._actions[t] || (e._actions[t] = [])).push(function (t, o) {
        var r = i({ dispatch: n.dispatch, commit: n.commit, getters: n.getters, state: n.state, rootGetters: e.getters, rootState: e.state }, t, o);return $i(r) || (r = Promise.resolve(r)), e._devtoolHook ? r.catch(function (t) {
          throw e._devtoolHook.emit("vuex:error", t), t;
        }) : r;
      });
    }function Bi(e, t, i, n) {
      if (e._wrappedGetters[t]) return void console.error("[vuex] duplicate getter key: " + t);e._wrappedGetters[t] = function (e) {
        return i(n.state, n.getters, e.state, e.getters);
      };
    }function Yi(e) {
      e._vm.$watch(function () {
        return this._data.$$state;
      }, function () {
        Ui(e._committing, "Do not mutate vuex store state outside mutation handlers.");
      }, { deep: !0, sync: !0 });
    }function Xi(e, t) {
      return t.length ? t.reduce(function (e, t) {
        return e[t];
      }, e) : e;
    }function qi(e, t, i) {
      return Di(e) && e.type && (i = t, t = e, e = e.type), Ui("string" == typeof e, "Expects string as the type, but found " + (void 0 === e ? "undefined" : un(e)) + "."), { type: e, payload: t, options: i };
    }function Ki(e) {
      if (Mr) return void console.error("[vuex] already installed. Vue.use(Vuex) should be called only once.");Mr = e, xr(Mr);
    }function Zi(e) {
      return Array.isArray(e) ? e.map(function (e) {
        return { key: e, val: e };
      }) : Object.keys(e).map(function (t) {
        return { key: t, val: e[t] };
      });
    }function Qi(e) {
      return function (t, i) {
        return "string" != typeof t ? (i = t, t = "") : "/" !== t.charAt(t.length - 1) && (t += "/"), e(t, i);
      };
    }function Ji(e, t, i) {
      var n = e._modulesNamespaceMap[i];return n || console.error("[vuex] module namespace not found in " + t + "(): " + i), n;
    }function en(e, t, i) {
      function n(t) {
        var i = f,
            n = p;return f = p = void 0, _ = t, h = e.apply(n, i);
      }function o(e) {
        return _ = e, v = setTimeout(a, t), y ? n(e) : h;
      }function r(e) {
        var i = e - g,
            n = e - _,
            o = t - i;return b ? ua(o, m - n) : o;
      }function s(e) {
        var i = e - g,
            n = e - _;return void 0 === g || i >= t || i < 0 || b && n >= m;
      }function a() {
        var e = da();if (s(e)) return l(e);v = setTimeout(a, r(e));
      }function l(e) {
        return v = void 0, C && f ? n(e) : (f = p = void 0, h);
      }function c() {
        void 0 !== v && clearTimeout(v), _ = 0, f = g = p = v = void 0;
      }function u() {
        return void 0 === v ? h : l(da());
      }function d() {
        var e = da(),
            i = s(e);if (f = arguments, p = this, g = e, i) {
          if (void 0 === v) return o(g);if (b) return v = setTimeout(a, t), n(g);
        }return void 0 === v && (v = setTimeout(a, t)), h;
      }var f,
          p,
          m,
          h,
          v,
          g,
          _ = 0,
          y = !1,
          b = !1,
          C = !0;if ("function" != typeof e) throw new TypeError(Ks);return t = sn(t) || 0, nn(i) && (y = !!i.leading, b = "maxWait" in i, m = b ? ca(sn(i.maxWait) || 0, t) : m, C = "trailing" in i ? !!i.trailing : C), d.cancel = c, d.flush = u, d;
    }function tn(e, t, i) {
      var n = !0,
          o = !0;if ("function" != typeof e) throw new TypeError(Ks);return nn(i) && (n = "leading" in i ? !!i.leading : n, o = "trailing" in i ? !!i.trailing : o), en(e, t, { leading: n, maxWait: t, trailing: o });
    }function nn(e) {
      var t = void 0 === e ? "undefined" : un(e);return !!e && ("object" == t || "function" == t);
    }function on(e) {
      return !!e && "object" == (void 0 === e ? "undefined" : un(e));
    }function rn(e) {
      return "symbol" == (void 0 === e ? "undefined" : un(e)) || on(e) && la.call(e) == Qs;
    }function sn(e) {
      if ("number" == typeof e) return e;if (rn(e)) return Zs;if (nn(e)) {
        var t = "function" == typeof e.valueOf ? e.valueOf() : e;e = nn(t) ? t + "" : t;
      }if ("string" != typeof e) return 0 === e ? e : +e;e = e.replace(Js, "");var i = ta.test(e);return i || ia.test(e) ? na(e.slice(2), i ? 2 : 8) : ea.test(e) ? Zs : +e;
    }!function (e) {
      function t() {}function i(e, t) {
        return function () {
          e.apply(t, arguments);
        };
      }function n(e) {
        if ("object" != _typeof(this)) throw new TypeError("Promises must be constructed via new");if ("function" != typeof e) throw new TypeError("not a function");this._state = 0, this._handled = !1, this._value = void 0, this._deferreds = [], c(e, this);
      }function o(e, t) {
        for (; 3 === e._state;) {
          e = e._value;
        }if (0 === e._state) return void e._deferreds.push(t);e._handled = !0, n._immediateFn(function () {
          var i = 1 === e._state ? t.onFulfilled : t.onRejected;if (null === i) return void (1 === e._state ? r : s)(t.promise, e._value);var n;try {
            n = i(e._value);
          } catch (e) {
            return void s(t.promise, e);
          }r(t.promise, n);
        });
      }function r(e, t) {
        try {
          if (t === e) throw new TypeError("A promise cannot be resolved with itself.");if (t && ("object" == (typeof t === 'undefined' ? 'undefined' : _typeof(t)) || "function" == typeof t)) {
            var o = t.then;if (t instanceof n) return e._state = 3, e._value = t, void a(e);if ("function" == typeof o) return void c(i(o, t), e);
          }e._state = 1, e._value = t, a(e);
        } catch (t) {
          s(e, t);
        }
      }function s(e, t) {
        e._state = 2, e._value = t, a(e);
      }function a(e) {
        2 === e._state && 0 === e._deferreds.length && n._immediateFn(function () {
          e._handled || n._unhandledRejectionFn(e._value);
        });for (var t = 0, i = e._deferreds.length; t < i; t++) {
          o(e, e._deferreds[t]);
        }e._deferreds = null;
      }function l(e, t, i) {
        this.onFulfilled = "function" == typeof e ? e : null, this.onRejected = "function" == typeof t ? t : null, this.promise = i;
      }function c(e, t) {
        var i = !1;try {
          e(function (e) {
            i || (i = !0, r(t, e));
          }, function (e) {
            i || (i = !0, s(t, e));
          });
        } catch (e) {
          if (i) return;i = !0, s(t, e);
        }
      }var u = setTimeout;n.prototype.catch = function (e) {
        return this.then(null, e);
      }, n.prototype.then = function (e, i) {
        var n = new this.constructor(t);return o(this, new l(e, i, n)), n;
      }, n.all = function (e) {
        var t = Array.prototype.slice.call(e);return new n(function (e, i) {
          function n(r, s) {
            try {
              if (s && ("object" == (typeof s === 'undefined' ? 'undefined' : _typeof(s)) || "function" == typeof s)) {
                var a = s.then;if ("function" == typeof a) return void a.call(s, function (e) {
                  n(r, e);
                }, i);
              }t[r] = s, 0 == --o && e(t);
            } catch (e) {
              i(e);
            }
          }if (0 === t.length) return e([]);for (var o = t.length, r = 0; r < t.length; r++) {
            n(r, t[r]);
          }
        });
      }, n.resolve = function (e) {
        return e && "object" == (typeof e === 'undefined' ? 'undefined' : _typeof(e)) && e.constructor === n ? e : new n(function (t) {
          t(e);
        });
      }, n.reject = function (e) {
        return new n(function (t, i) {
          i(e);
        });
      }, n.race = function (e) {
        return new n(function (t, i) {
          for (var n = 0, o = e.length; n < o; n++) {
            e[n].then(t, i);
          }
        });
      }, n._immediateFn = "function" == typeof setImmediate && function (e) {
        setImmediate(e);
      } || function (e) {
        u(e, 0);
      }, n._unhandledRejectionFn = function (e) {
        "undefined" != typeof console && console && console.warn("Possible Unhandled Promise Rejection:", e);
      }, n._setImmediateFn = function (e) {
        n._immediateFn = e;
      }, n._setUnhandledRejectionFn = function (e) {
        n._unhandledRejectionFn = e;
      }, "undefined" != 'object' && module.exports ? module.exports = n : e.Promise || (e.Promise = n);
    }(this);var an,
        ln,
        cn = { css: { main: "https://static.filestackapi.com/picker/v3/0.4.1/main.css" } },
        un = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
      return typeof e === 'undefined' ? 'undefined' : _typeof(e);
    } : function (e) {
      return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === 'undefined' ? 'undefined' : _typeof(e);
    },
        dn = function dn(e, t, i) {
      return t in e ? Object.defineProperty(e, t, { value: i, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = i, e;
    },
        fn = Object.assign || function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var i = arguments[t];for (var n in i) {
          Object.prototype.hasOwnProperty.call(i, n) && (e[n] = i[n]);
        }
      }return e;
    },
        pn = function pn(e) {
      if (Array.isArray(e)) {
        for (var t = 0, i = Array(e.length); t < e.length; t++) {
          i[t] = e[t];
        }return i;
      }return Array.from(e);
    },
        mn = (i("slot,component", !0), Object.prototype.hasOwnProperty),
        hn = s(function (e) {
      return e.replace(/-(\w)/g, function (e, t) {
        return t ? t.toUpperCase() : "";
      });
    }),
        vn = s(function (e) {
      return e.charAt(0).toUpperCase() + e.slice(1);
    }),
        gn = s(function (e) {
      return e.replace(/([^-])([A-Z])/g, "$1-$2").replace(/([^-])([A-Z])/g, "$1-$2").toLowerCase();
    }),
        _n = Object.prototype.toString,
        yn = "[object Object]",
        bn = function bn() {
      return !1;
    },
        Cn = function Cn(e) {
      return e;
    },
        En = { optionMergeStrategies: Object.create(null), silent: !1, productionTip: !1, devtools: !1, performance: !1, errorHandler: null, ignoredElements: [], keyCodes: Object.create(null), isReservedTag: bn, isUnknownElement: bn, getTagNamespace: p, parsePlatformTagName: Cn, mustUseProp: bn, _assetTypes: ["component", "directive", "filter"], _lifecycleHooks: ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestroy", "destroyed", "activated", "deactivated"], _maxUpdateCount: 100 },
        Sn = Object.freeze({}),
        wn = /[^\w.$]/,
        Tn = "__proto__" in {},
        An = "undefined" != typeof window,
        Fn = An && window.navigator.userAgent.toLowerCase(),
        kn = Fn && /msie|trident/.test(Fn),
        Rn = Fn && Fn.indexOf("msie 9.0") > 0,
        On = Fn && Fn.indexOf("edge/") > 0,
        Ln = Fn && Fn.indexOf("android") > 0,
        Nn = Fn && /iphone|ipad|ipod|ios/.test(Fn),
        xn = Fn && /chrome\/\d+/.test(Fn) && !On,
        In = function In() {
      return void 0 === an && (an = !An && "undefined" != typeof commonjsGlobal && "server" === commonjsGlobal.process.env.VUE_ENV), an;
    },
        Dn = An && window.__VUE_DEVTOOLS_GLOBAL_HOOK__,
        $n = "undefined" != typeof Symbol && b(Symbol) && "undefined" != typeof Reflect && b(Reflect.ownKeys),
        Un = function () {
      function e() {
        n = !1;var e = i.slice(0);i.length = 0;for (var t = 0; t < e.length; t++) {
          e[t]();
        }
      }var t,
          i = [],
          n = !1;if ("undefined" != typeof Promise && b(Promise)) {
        var o = Promise.resolve(),
            r = function r(e) {
          console.error(e);
        };t = function t() {
          o.then(e).catch(r), Nn && setTimeout(p);
        };
      } else if ("undefined" == typeof MutationObserver || !b(MutationObserver) && "[object MutationObserverConstructor]" !== MutationObserver.toString()) t = function t() {
        setTimeout(e, 0);
      };else {
        var s = 1,
            a = new MutationObserver(e),
            l = document.createTextNode(String(s));a.observe(l, { characterData: !0 }), t = function t() {
          s = (s + 1) % 2, l.data = String(s);
        };
      }return function (e, o) {
        var r;if (i.push(function () {
          e && e.call(o), r && r(o);
        }), n || (n = !0, t()), !e && "undefined" != typeof Promise) return new Promise(function (e) {
          r = e;
        });
      };
    }();ln = "undefined" != typeof Set && b(Set) ? Set : function () {
      function e() {
        this.set = Object.create(null);
      }return e.prototype.has = function (e) {
        return this.set[e] === !0;
      }, e.prototype.add = function (e) {
        this.set[e] = !0;
      }, e.prototype.clear = function () {
        this.set = Object.create(null);
      }, e;
    }();var Mn = p,
        Pn = 0,
        zn = function zn() {
      this.id = Pn++, this.subs = [];
    };zn.prototype.addSub = function (e) {
      this.subs.push(e);
    }, zn.prototype.removeSub = function (e) {
      n(this.subs, e);
    }, zn.prototype.depend = function () {
      zn.target && zn.target.addDep(this);
    }, zn.prototype.notify = function () {
      for (var e = this.subs.slice(), t = 0, i = e.length; t < i; t++) {
        e[t].update();
      }
    }, zn.target = null;var jn = [],
        Vn = Array.prototype,
        Gn = Object.create(Vn);["push", "pop", "shift", "unshift", "splice", "sort", "reverse"].forEach(function (e) {
      var t = Vn[e];_(Gn, e, function () {
        for (var i = arguments, n = arguments.length, o = new Array(n); n--;) {
          o[n] = i[n];
        }var r,
            s = t.apply(this, o),
            a = this.__ob__;switch (e) {case "push":
            r = o;break;case "unshift":
            r = o;break;case "splice":
            r = o.slice(2);}return r && a.observeArray(r), a.dep.notify(), s;
      });
    });var Wn = Object.getOwnPropertyNames(Gn),
        Hn = { shouldConvert: !0, isSettingProps: !1 },
        Bn = function Bn(e) {
      if (this.value = e, this.dep = new zn(), this.vmCount = 0, _(e, "__ob__", this), Array.isArray(e)) {
        (Tn ? S : w)(e, Gn, Wn), this.observeArray(e);
      } else this.walk(e);
    };Bn.prototype.walk = function (e) {
      for (var t = Object.keys(e), i = 0; i < t.length; i++) {
        A(e, t[i], e[t[i]]);
      }
    }, Bn.prototype.observeArray = function (e) {
      for (var t = 0, i = e.length; t < i; t++) {
        T(e[t]);
      }
    };var Yn = En.optionMergeStrategies;Yn.data = function (e, t, i) {
      return i ? e || t ? function () {
        var n = "function" == typeof t ? t.call(i) : t,
            o = "function" == typeof e ? e.call(i) : void 0;return n ? O(n, o) : o;
      } : void 0 : t ? "function" != typeof t ? e : e ? function () {
        return O(t.call(this), e.call(this));
      } : t : e;
    }, En._lifecycleHooks.forEach(function (e) {
      Yn[e] = L;
    }), En._assetTypes.forEach(function (e) {
      Yn[e + "s"] = N;
    }), Yn.watch = function (e, t) {
      if (!t) return Object.create(e || null);if (!e) return t;var i = {};c(i, e);for (var n in t) {
        var o = i[n],
            r = t[n];o && !Array.isArray(o) && (o = [o]), i[n] = o ? o.concat(r) : [r];
      }return i;
    }, Yn.props = Yn.methods = Yn.computed = function (e, t) {
      if (!t) return Object.create(e || null);if (!e) return t;var i = Object.create(null);return c(i, e), c(i, t), i;
    };var Xn = function Xn(e, t) {
      return void 0 === t ? e : t;
    },
        qn = function qn(e, t, i, n, o, r, s) {
      this.tag = e, this.data = t, this.children = i, this.text = n, this.elm = o, this.ns = void 0, this.context = r, this.functionalContext = void 0, this.key = t && t.key, this.componentOptions = s, this.componentInstance = void 0, this.parent = void 0, this.raw = !1, this.isStatic = !1, this.isRootInsert = !0, this.isComment = !1, this.isCloned = !1, this.isOnce = !1;
    },
        Kn = { child: {} };Kn.child.get = function () {
      return this.componentInstance;
    }, Object.defineProperties(qn.prototype, Kn);var Zn,
        Qn = function Qn() {
      var e = new qn();return e.text = "", e.isComment = !0, e;
    },
        Jn = s(function (e) {
      var t = "~" === e.charAt(0);e = t ? e.slice(1) : e;var i = "!" === e.charAt(0);return e = i ? e.slice(1) : e, { name: e, once: t, capture: i };
    }),
        eo = null,
        to = [],
        io = {},
        no = !1,
        oo = !1,
        ro = 0,
        so = 0,
        ao = function ao(e, t, i, n) {
      this.vm = e, e._watchers.push(this), n ? (this.deep = !!n.deep, this.user = !!n.user, this.lazy = !!n.lazy, this.sync = !!n.sync) : this.deep = this.user = this.lazy = this.sync = !1, this.cb = i, this.id = ++so, this.active = !0, this.dirty = this.lazy, this.deps = [], this.newDeps = [], this.depIds = new ln(), this.newDepIds = new ln(), this.expression = "", "function" == typeof t ? this.getter = t : (this.getter = y(t), this.getter || (this.getter = function () {})), this.value = this.lazy ? void 0 : this.get();
    };ao.prototype.get = function () {
      C(this);var e,
          t = this.vm;if (this.user) try {
        e = this.getter.call(t, t);
      } catch (e) {
        j(e, t, 'getter for watcher "' + this.expression + '"');
      } else e = this.getter.call(t, t);return this.deep && he(e), E(), this.cleanupDeps(), e;
    }, ao.prototype.addDep = function (e) {
      var t = e.id;this.newDepIds.has(t) || (this.newDepIds.add(t), this.newDeps.push(e), this.depIds.has(t) || e.addSub(this));
    }, ao.prototype.cleanupDeps = function () {
      for (var e = this, t = this.deps.length; t--;) {
        var i = e.deps[t];e.newDepIds.has(i.id) || i.removeSub(e);
      }var n = this.depIds;this.depIds = this.newDepIds, this.newDepIds = n, this.newDepIds.clear(), n = this.deps, this.deps = this.newDeps, this.newDeps = n, this.newDeps.length = 0;
    }, ao.prototype.update = function () {
      this.lazy ? this.dirty = !0 : this.sync ? this.run() : me(this);
    }, ao.prototype.run = function () {
      if (this.active) {
        var e = this.get();if (e !== this.value || u(e) || this.deep) {
          var t = this.value;if (this.value = e, this.user) try {
            this.cb.call(this.vm, e, t);
          } catch (e) {
            j(e, this.vm, 'callback for watcher "' + this.expression + '"');
          } else this.cb.call(this.vm, e, t);
        }
      }
    }, ao.prototype.evaluate = function () {
      this.value = this.get(), this.dirty = !1;
    }, ao.prototype.depend = function () {
      for (var e = this, t = this.deps.length; t--;) {
        e.deps[t].depend();
      }
    }, ao.prototype.teardown = function () {
      var e = this;if (this.active) {
        this.vm._isBeingDestroyed || n(this.vm._watchers, this);for (var t = this.deps.length; t--;) {
          e.deps[t].removeSub(e);
        }this.active = !1;
      }
    };var lo = new ln(),
        co = { enumerable: !0, configurable: !0, get: p, set: p },
        uo = { lazy: !0 },
        fo = { init: function init(e, t, i, n) {
        if (!e.componentInstance || e.componentInstance._isDestroyed) {
          (e.componentInstance = Re(e, eo, i, n)).$mount(t ? e.elm : void 0, t);
        } else if (e.data.keepAlive) {
          var o = e;fo.prepatch(o, o);
        }
      }, prepatch: function prepatch(e, t) {
        var i = t.componentOptions;ae(t.componentInstance = e.componentInstance, i.propsData, i.listeners, t, i.children);
      }, insert: function insert(e) {
        e.componentInstance._isMounted || (e.componentInstance._isMounted = !0, de(e.componentInstance, "mounted")), e.data.keepAlive && ce(e.componentInstance, !0);
      }, destroy: function destroy(e) {
        e.componentInstance._isDestroyed || (e.data.keepAlive ? ue(e.componentInstance, !0) : e.componentInstance.$destroy());
      } },
        po = Object.keys(fo),
        mo = 1,
        ho = 2,
        vo = 0;!function (e) {
      e.prototype._init = function (e) {
        var t = this;t._uid = vo++, t._isVue = !0, e && e._isComponent ? Ze(t, e) : t.$options = D(Qe(t.constructor), e || {}, t), t._renderProxy = t, t._self = t, re(t), Q(t), Xe(t), de(t, "beforeCreate"), Ke(t), _e(t), qe(t), de(t, "created"), t.$options.el && t.$mount(t.$options.el);
      };
    }(tt), function (e) {
      var t = {};t.get = function () {
        return this._data;
      };var i = {};i.get = function () {
        return this._props;
      }, Object.defineProperty(e.prototype, "$data", t), Object.defineProperty(e.prototype, "$props", i), e.prototype.$set = F, e.prototype.$delete = k, e.prototype.$watch = function (e, t, i) {
        var n = this;i = i || {}, i.user = !0;var o = new ao(n, e, t, i);return i.immediate && t.call(n, o.value), function () {
          o.teardown();
        };
      };
    }(tt), function (e) {
      var t = /^hook:/;e.prototype.$on = function (e, i) {
        var n = this,
            o = this;if (Array.isArray(e)) for (var r = 0, s = e.length; r < s; r++) {
          n.$on(e[r], i);
        } else (o._events[e] || (o._events[e] = [])).push(i), t.test(e) && (o._hasHookEvent = !0);return o;
      }, e.prototype.$once = function (e, t) {
        function i() {
          n.$off(e, i), t.apply(n, arguments);
        }var n = this;return i.fn = t, n.$on(e, i), n;
      }, e.prototype.$off = function (e, t) {
        var i = this,
            n = this;if (!arguments.length) return n._events = Object.create(null), n;if (Array.isArray(e)) {
          for (var o = 0, r = e.length; o < r; o++) {
            i.$off(e[o], t);
          }return n;
        }var s = n._events[e];if (!s) return n;if (1 === arguments.length) return n._events[e] = null, n;for (var a, l = s.length; l--;) {
          if ((a = s[l]) === t || a.fn === t) {
            s.splice(l, 1);break;
          }
        }return n;
      }, e.prototype.$emit = function (e) {
        var t = this,
            i = t._events[e];if (i) {
          i = i.length > 1 ? l(i) : i;for (var n = l(arguments, 1), o = 0, r = i.length; o < r; o++) {
            i[o].apply(t, n);
          }
        }return t;
      };
    }(tt), function (e) {
      e.prototype._update = function (e, t) {
        var i = this;i._isMounted && de(i, "beforeUpdate");var n = i.$el,
            o = i._vnode,
            r = eo;eo = i, i._vnode = e, i.$el = o ? i.__patch__(o, e) : i.__patch__(i.$el, e, t, !1, i.$options._parentElm, i.$options._refElm), eo = r, n && (n.__vue__ = null), i.$el && (i.$el.__vue__ = i), i.$vnode && i.$parent && i.$vnode === i.$parent._vnode && (i.$parent.$el = i.$el);
      }, e.prototype.$forceUpdate = function () {
        var e = this;e._watcher && e._watcher.update();
      }, e.prototype.$destroy = function () {
        var e = this;if (!e._isBeingDestroyed) {
          de(e, "beforeDestroy"), e._isBeingDestroyed = !0;var t = e.$parent;!t || t._isBeingDestroyed || e.$options.abstract || n(t.$children, e), e._watcher && e._watcher.teardown();for (var i = e._watchers.length; i--;) {
            e._watchers[i].teardown();
          }e._data.__ob__ && e._data.__ob__.vmCount--, e._isDestroyed = !0, de(e, "destroyed"), e.$off(), e.$el && (e.$el.__vue__ = null), e.__patch__(e._vnode, null);
        }
      };
    }(tt), function (i) {
      i.prototype.$nextTick = function (e) {
        return Un(e, this);
      }, i.prototype._render = function () {
        var e = this,
            t = e.$options,
            i = t.render,
            n = t.staticRenderFns,
            o = t._parentVnode;if (e._isMounted) for (var r in e.$slots) {
          e.$slots[r] = W(e.$slots[r]);
        }e.$scopedSlots = o && o.data.scopedSlots || Sn, n && !e._staticTrees && (e._staticTrees = []), e.$vnode = o;var s;try {
          s = i.call(e._renderProxy, e.$createElement);
        } catch (t) {
          j(t, e, "render function"), s = e._vnode;
        }return s instanceof qn || (s = Qn()), s.parent = o, s;
      }, i.prototype._o = He, i.prototype._n = t, i.prototype._s = e, i.prototype._l = Pe, i.prototype._t = ze, i.prototype._q = m, i.prototype._i = h, i.prototype._m = We, i.prototype._f = je, i.prototype._k = Ve, i.prototype._b = Ge, i.prototype._v = V, i.prototype._e = Qn, i.prototype._u = oe;
    }(tt);var go = [String, RegExp],
        _o = { name: "keep-alive", abstract: !0, props: { include: go, exclude: go }, created: function created() {
        this.cache = Object.create(null);
      }, destroyed: function destroyed() {
        var e = this;for (var t in e.cache) {
          dt(e.cache[t]);
        }
      }, watch: { include: function include(e) {
          ut(this.cache, function (t) {
            return ct(e, t);
          });
        }, exclude: function exclude(e) {
          ut(this.cache, function (t) {
            return !ct(e, t);
          });
        } }, render: function render() {
        var e = Z(this.$slots.default),
            t = e && e.componentOptions;if (t) {
          var i = lt(t);if (i && (this.include && !ct(this.include, i) || this.exclude && ct(this.exclude, i))) return e;var n = null == e.key ? t.Ctor.cid + (t.tag ? "::" + t.tag : "") : e.key;this.cache[n] ? e.componentInstance = this.cache[n].componentInstance : this.cache[n] = e, e.data.keepAlive = !0;
        }return e;
      } },
        yo = { KeepAlive: _o };!function (e) {
      var t = {};t.get = function () {
        return En;
      }, Object.defineProperty(e, "config", t), e.util = { warn: Mn, extend: c, mergeOptions: D, defineReactive: A }, e.set = F, e.delete = k, e.nextTick = Un, e.options = Object.create(null), En._assetTypes.forEach(function (t) {
        e.options[t + "s"] = Object.create(null);
      }), e.options._base = e, c(e.options.components, yo), it(e), nt(e), ot(e), at(e);
    }(tt), Object.defineProperty(tt.prototype, "$isServer", { get: In }), tt.version = "2.2.4";var bo,
        Co,
        Eo = i("input,textarea,option,select"),
        So = function So(e, t, i) {
      return "value" === i && Eo(e) && "button" !== t || "selected" === i && "option" === e || "checked" === i && "input" === e || "muted" === i && "video" === e;
    },
        wo = i("contenteditable,draggable,spellcheck"),
        To = i("allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,default,defaultchecked,defaultmuted,defaultselected,defer,disabled,enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,required,reversed,scoped,seamless,selected,sortable,translate,truespeed,typemustmatch,visible"),
        Ao = "http://www.w3.org/1999/xlink",
        Fo = function Fo(e) {
      return ":" === e.charAt(5) && "xlink" === e.slice(0, 5);
    },
        ko = function ko(e) {
      return Fo(e) ? e.slice(6, e.length) : "";
    },
        Ro = function Ro(e) {
      return null == e || e === !1;
    },
        Oo = { svg: "http://www.w3.org/2000/svg", math: "http://www.w3.org/1998/Math/MathML" },
        Lo = i("html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,menuitem,summary,content,element,shadow,template"),
        No = i("svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view", !0),
        xo = function xo(e) {
      return Lo(e) || No(e);
    },
        Io = Object.create(null),
        Do = Object.freeze({ createElement: bt, createElementNS: Ct, createTextNode: Et, createComment: St, insertBefore: wt, removeChild: Tt, appendChild: At, parentNode: Ft, nextSibling: kt, tagName: Rt, setTextContent: Ot, setAttribute: Lt }),
        $o = { create: function create(e, t) {
        Nt(t);
      }, update: function update(e, t) {
        e.data.ref !== t.data.ref && (Nt(e, !0), Nt(t));
      }, destroy: function destroy(e) {
        Nt(e, !0);
      } },
        Uo = new qn("", {}, []),
        Mo = ["create", "activate", "update", "remove", "destroy"],
        Po = { create: Ut, update: Ut, destroy: function destroy(e) {
        Ut(e, Uo);
      } },
        zo = Object.create(null),
        jo = [$o, Po],
        Vo = { create: Vt, update: Vt },
        Go = { create: Wt, update: Wt },
        Wo = "__r",
        Ho = "__c",
        Bo = { create: Xt, update: Xt },
        Yo = { create: qt, update: qt },
        Xo = s(function (e) {
      var t = {};return e.split(/;(?![^(]*\))/g).forEach(function (e) {
        if (e) {
          var i = e.split(/:(.+)/);i.length > 1 && (t[i[0].trim()] = i[1].trim());
        }
      }), t;
    }),
        qo = /^--/,
        Ko = /\s*!important$/,
        Zo = function Zo(e, t, i) {
      qo.test(t) ? e.style.setProperty(t, i) : Ko.test(i) ? e.style.setProperty(t, i.replace(Ko, ""), "important") : e.style[Jo(t)] = i;
    },
        Qo = ["Webkit", "Moz", "ms"],
        Jo = s(function (e) {
      if (Co = Co || document.createElement("div"), "filter" !== (e = hn(e)) && e in Co.style) return e;for (var t = e.charAt(0).toUpperCase() + e.slice(1), i = 0; i < Qo.length; i++) {
        var n = Qo[i] + t;if (n in Co.style) return n;
      }
    }),
        er = { create: ii, update: ii },
        tr = s(function (e) {
      return { enterClass: e + "-enter", enterToClass: e + "-enter-to", enterActiveClass: e + "-enter-active", leaveClass: e + "-leave", leaveToClass: e + "-leave-to", leaveActiveClass: e + "-leave-active" };
    }),
        ir = An && !Rn,
        nr = "transition",
        or = "animation",
        rr = "transition",
        sr = "transitionend",
        ar = "animation",
        lr = "animationend";ir && (void 0 === window.ontransitionend && void 0 !== window.onwebkittransitionend && (rr = "WebkitTransition", sr = "webkitTransitionEnd"), void 0 === window.onanimationend && void 0 !== window.onwebkitanimationend && (ar = "WebkitAnimation", lr = "webkitAnimationEnd"));var cr = An && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : setTimeout,
        ur = /\b(transform|all)(,|$)/,
        dr = An ? { create: gi, activate: gi, remove: function remove(e, t) {
        e.data.show ? t() : mi(e, t);
      } } : {},
        fr = [Vo, Go, Bo, Yo, er, dr],
        pr = fr.concat(jo),
        mr = function (e) {
      function t(e) {
        return new qn(F.tagName(e).toLowerCase(), {}, [], void 0, e);
      }function n(e, t) {
        function i() {
          0 == --i.listeners && o(e);
        }return i.listeners = t, i;
      }function o(e) {
        var t = F.parentNode(e);t && F.removeChild(t, e);
      }function s(e, t, i, n, o) {
        if (e.isRootInsert = !o, !a(e, t, i, n)) {
          var r = e.data,
              s = e.children,
              l = e.tag;It(l) ? (e.elm = e.ns ? F.createElementNS(e.ns, l) : F.createElement(l, e), m(e), d(e, s, t), It(r) && p(e, t), u(i, e.elm, n)) : e.isComment ? (e.elm = F.createComment(e.text), u(i, e.elm, n)) : (e.elm = F.createTextNode(e.text), u(i, e.elm, n));
        }
      }function a(e, t, i, n) {
        var o = e.data;if (It(o)) {
          var r = It(e.componentInstance) && o.keepAlive;if (It(o = o.hook) && It(o = o.init) && o(e, !1, i, n), It(e.componentInstance)) return l(e, t), r && c(e, t, i, n), !0;
        }
      }function l(e, t) {
        e.data.pendingInsert && t.push.apply(t, e.data.pendingInsert), e.elm = e.componentInstance.$el, f(e) ? (p(e, t), m(e)) : (Nt(e), t.push(e));
      }function c(e, t, i, n) {
        for (var o, r = e; r.componentInstance;) {
          if (r = r.componentInstance._vnode, It(o = r.data) && It(o = o.transition)) {
            for (o = 0; o < T.activate.length; ++o) {
              T.activate[o](Uo, r);
            }t.push(r);break;
          }
        }u(i, e.elm, n);
      }function u(e, t, i) {
        e && (i ? F.insertBefore(e, t, i) : F.appendChild(e, t));
      }function d(e, t, i) {
        if (Array.isArray(t)) for (var n = 0; n < t.length; ++n) {
          s(t[n], i, e.elm, null, !0);
        } else r(e.text) && F.appendChild(e.elm, F.createTextNode(e.text));
      }function f(e) {
        for (; e.componentInstance;) {
          e = e.componentInstance._vnode;
        }return It(e.tag);
      }function p(e, t) {
        for (var i = 0; i < T.create.length; ++i) {
          T.create[i](Uo, e);
        }S = e.data.hook, It(S) && (S.create && S.create(Uo, e), S.insert && t.push(e));
      }function m(e) {
        for (var t, i = e; i;) {
          It(t = i.context) && It(t = t.$options._scopeId) && F.setAttribute(e.elm, t, ""), i = i.parent;
        }It(t = eo) && t !== e.context && It(t = t.$options._scopeId) && F.setAttribute(e.elm, t, "");
      }function h(e, t, i, n, o, r) {
        for (; n <= o; ++n) {
          s(i[n], r, e, t);
        }
      }function v(e) {
        var t,
            i,
            n = e.data;if (It(n)) for (It(t = n.hook) && It(t = t.destroy) && t(e), t = 0; t < T.destroy.length; ++t) {
          T.destroy[t](e);
        }if (It(t = e.children)) for (i = 0; i < e.children.length; ++i) {
          v(e.children[i]);
        }
      }function g(e, t, i, n) {
        for (; i <= n; ++i) {
          var r = t[i];It(r) && (It(r.tag) ? (_(r), v(r)) : o(r.elm));
        }
      }function _(e, t) {
        if (t || It(e.data)) {
          var i = T.remove.length + 1;for (t ? t.listeners += i : t = n(e.elm, i), It(S = e.componentInstance) && It(S = S._vnode) && It(S.data) && _(S, t), S = 0; S < T.remove.length; ++S) {
            T.remove[S](e, t);
          }It(S = e.data.hook) && It(S = S.remove) ? S(e, t) : t();
        } else o(e.elm);
      }function y(e, t, i, n, o) {
        for (var r, a, l, c, u = 0, d = 0, f = t.length - 1, p = t[0], m = t[f], v = i.length - 1, _ = i[0], y = i[v], C = !o; u <= f && d <= v;) {
          xt(p) ? p = t[++u] : xt(m) ? m = t[--f] : Dt(p, _) ? (b(p, _, n), p = t[++u], _ = i[++d]) : Dt(m, y) ? (b(m, y, n), m = t[--f], y = i[--v]) : Dt(p, y) ? (b(p, y, n), C && F.insertBefore(e, p.elm, F.nextSibling(m.elm)), p = t[++u], y = i[--v]) : Dt(m, _) ? (b(m, _, n), C && F.insertBefore(e, m.elm, p.elm), m = t[--f], _ = i[++d]) : (xt(r) && (r = $t(t, u, f)), a = It(_.key) ? r[_.key] : null, xt(a) ? (s(_, n, e, p.elm), _ = i[++d]) : (l = t[a], Dt(l, _) ? (b(l, _, n), t[a] = void 0, C && F.insertBefore(e, _.elm, p.elm), _ = i[++d]) : (s(_, n, e, p.elm), _ = i[++d])));
        }u > f ? (c = xt(i[v + 1]) ? null : i[v + 1].elm, h(e, c, i, d, v, n)) : d > v && g(e, t, u, f);
      }function b(e, t, i, n) {
        if (e !== t) {
          if (t.isStatic && e.isStatic && t.key === e.key && (t.isCloned || t.isOnce)) return t.elm = e.elm, void (t.componentInstance = e.componentInstance);var o,
              r = t.data,
              s = It(r);s && It(o = r.hook) && It(o = o.prepatch) && o(e, t);var a = t.elm = e.elm,
              l = e.children,
              c = t.children;if (s && f(t)) {
            for (o = 0; o < T.update.length; ++o) {
              T.update[o](e, t);
            }It(o = r.hook) && It(o = o.update) && o(e, t);
          }xt(t.text) ? It(l) && It(c) ? l !== c && y(a, l, c, i, n) : It(c) ? (It(e.text) && F.setTextContent(a, ""), h(a, null, c, 0, c.length - 1, i)) : It(l) ? g(a, l, 0, l.length - 1) : It(e.text) && F.setTextContent(a, "") : e.text !== t.text && F.setTextContent(a, t.text), s && It(o = r.hook) && It(o = o.postpatch) && o(e, t);
        }
      }function C(e, t, i) {
        if (i && e.parent) e.parent.data.pendingInsert = t;else for (var n = 0; n < t.length; ++n) {
          t[n].data.hook.insert(t[n]);
        }
      }function E(e, t, i) {
        t.elm = e;var n = t.tag,
            o = t.data,
            r = t.children;if (It(o) && (It(S = o.hook) && It(S = S.init) && S(t, !0), It(S = t.componentInstance))) return l(t, i), !0;if (It(n)) {
          if (It(r)) if (e.hasChildNodes()) {
            for (var s = !0, a = e.firstChild, c = 0; c < r.length; c++) {
              if (!a || !E(a, r[c], i)) {
                s = !1;break;
              }a = a.nextSibling;
            }if (!s || a) return !1;
          } else d(t, r, i);if (It(o)) for (var u in o) {
            if (!k(u)) {
              p(t, i);break;
            }
          }
        } else e.data !== t.text && (e.data = t.text);return !0;
      }var S,
          w,
          T = {},
          A = e.modules,
          F = e.nodeOps;for (S = 0; S < Mo.length; ++S) {
        for (T[Mo[S]] = [], w = 0; w < A.length; ++w) {
          void 0 !== A[w][Mo[S]] && T[Mo[S]].push(A[w][Mo[S]]);
        }
      }var k = i("attrs,style,class,staticClass,staticStyle,key");return function (e, i, n, o, r, a) {
        if (!i) return void (e && v(e));var l = !1,
            c = [];if (e) {
          var u = It(e.nodeType);if (!u && Dt(e, i)) b(e, i, c, o);else {
            if (u) {
              if (1 === e.nodeType && e.hasAttribute("server-rendered") && (e.removeAttribute("server-rendered"), n = !0), n && E(e, i, c)) return C(i, c, !0), e;e = t(e);
            }var d = e.elm,
                p = F.parentNode(d);if (s(i, c, d._leaveCb ? null : p, F.nextSibling(d)), i.parent) {
              for (var m = i.parent; m;) {
                m.elm = i.elm, m = m.parent;
              }if (f(i)) for (var h = 0; h < T.create.length; ++h) {
                T.create[h](Uo, i.parent);
              }
            }null !== p ? g(p, [e], 0, 0) : It(e.tag) && v(e);
          }
        } else l = !0, s(i, c, r, a);return C(i, c, l), i.elm;
      };
    }({ nodeOps: Do, modules: pr });Rn && document.addEventListener("selectionchange", function () {
      var e = document.activeElement;e && e.vmodel && Si(e, "input");
    });var hr = { inserted: function inserted(e, t, i) {
        if ("select" === i.tag) {
          var n = function n() {
            _i(e, t, i.context);
          };n(), (kn || On) && setTimeout(n, 0);
        } else "textarea" !== i.tag && "text" !== e.type || (e._vModifiers = t.modifiers, t.modifiers.lazy || (Ln || (e.addEventListener("compositionstart", Ci), e.addEventListener("compositionend", Ei)), Rn && (e.vmodel = !0)));
      }, componentUpdated: function componentUpdated(e, t, i) {
        if ("select" === i.tag) {
          _i(e, t, i.context);(e.multiple ? t.value.some(function (t) {
            return yi(t, e.options);
          }) : t.value !== t.oldValue && yi(t.value, e.options)) && Si(e, "change");
        }
      } },
        vr = { bind: function bind(e, t, i) {
        var n = t.value;i = wi(i);var o = i.data && i.data.transition,
            r = e.__vOriginalDisplay = "none" === e.style.display ? "" : e.style.display;n && o && !Rn ? (i.data.show = !0, pi(i, function () {
          e.style.display = r;
        })) : e.style.display = n ? r : "none";
      }, update: function update(e, t, i) {
        var n = t.value;n !== t.oldValue && (i = wi(i), i.data && i.data.transition && !Rn ? (i.data.show = !0, n ? pi(i, function () {
          e.style.display = e.__vOriginalDisplay;
        }) : mi(i, function () {
          e.style.display = "none";
        })) : e.style.display = n ? e.__vOriginalDisplay : "none");
      }, unbind: function unbind(e, t, i, n, o) {
        o || (e.style.display = e.__vOriginalDisplay);
      } },
        gr = { model: hr, show: vr },
        _r = { name: String, appear: Boolean, css: Boolean, mode: String, type: String, enterClass: String, leaveClass: String, enterToClass: String, leaveToClass: String, enterActiveClass: String, leaveActiveClass: String, appearClass: String, appearActiveClass: String, appearToClass: String, duration: [Number, String, Object] },
        yr = { name: "transition", props: _r, abstract: !0, render: function render(e) {
        var t = this,
            i = this.$slots.default;if (i && (i = i.filter(function (e) {
          return e.tag;
        }), i.length)) {
          var n = this.mode,
              o = i[0];if (ki(this.$vnode)) return o;var s = Ti(o);if (!s) return o;if (this._leaving) return Fi(e, o);var a = "__transition-" + this._uid + "-";s.key = null == s.key ? a + s.tag : r(s.key) ? 0 === String(s.key).indexOf(a) ? s.key : a + s.key : s.key;var l = (s.data || (s.data = {})).transition = Ai(this),
              u = this._vnode,
              d = Ti(u);if (s.data.directives && s.data.directives.some(function (e) {
            return "show" === e.name;
          }) && (s.data.show = !0), d && d.data && !Ri(s, d)) {
            var f = d && (d.data.transition = c({}, l));if ("out-in" === n) return this._leaving = !0, Y(f, "afterLeave", function () {
              t._leaving = !1, t.$forceUpdate();
            }), Fi(e, o);if ("in-out" === n) {
              var p,
                  m = function m() {
                p();
              };Y(l, "afterEnter", m), Y(l, "enterCancelled", m), Y(f, "delayLeave", function (e) {
                p = e;
              });
            }
          }return o;
        }
      } },
        br = c({ tag: String, moveClass: String }, _r);delete br.mode;var Cr = { props: br, render: function render(e) {
        for (var t = this.tag || this.$vnode.data.tag || "span", i = Object.create(null), n = this.prevChildren = this.children, o = this.$slots.default || [], r = this.children = [], s = Ai(this), a = 0; a < o.length; a++) {
          var l = o[a];l.tag && null != l.key && 0 !== String(l.key).indexOf("__vlist") && (r.push(l), i[l.key] = l, (l.data || (l.data = {})).transition = s);
        }if (n) {
          for (var c = [], u = [], d = 0; d < n.length; d++) {
            var f = n[d];f.data.transition = s, f.data.pos = f.elm.getBoundingClientRect(), i[f.key] ? c.push(f) : u.push(f);
          }this.kept = e(t, null, c), this.removed = u;
        }return e(t, null, r);
      }, beforeUpdate: function beforeUpdate() {
        this.__patch__(this._vnode, this.kept, !1, !0), this._vnode = this.kept;
      }, updated: function updated() {
        var e = this.prevChildren,
            t = this.moveClass || (this.name || "v") + "-move";if (e.length && this.hasMove(e[0].elm, t)) {
          e.forEach(Oi), e.forEach(Li), e.forEach(Ni);var i = document.body;i.offsetHeight;e.forEach(function (e) {
            if (e.data.moved) {
              var i = e.elm,
                  n = i.style;ai(i, t), n.transform = n.WebkitTransform = n.transitionDuration = "", i.addEventListener(sr, i._moveCb = function e(n) {
                n && !/transform$/.test(n.propertyName) || (i.removeEventListener(sr, e), i._moveCb = null, li(i, t));
              });
            }
          });
        }
      }, methods: { hasMove: function hasMove(e, t) {
          if (!ir) return !1;if (null != this._hasMove) return this._hasMove;var i = e.cloneNode();e._transitionClasses && e._transitionClasses.forEach(function (e) {
            oi(i, e);
          }), ni(i, t), i.style.display = "none", this.$el.appendChild(i);var n = ui(i);return this.$el.removeChild(i), this._hasMove = n.hasTransform;
        } } },
        Er = { Transition: yr, TransitionGroup: Cr };tt.config.mustUseProp = So, tt.config.isReservedTag = xo, tt.config.getTagNamespace = gt, tt.config.isUnknownElement = _t, c(tt.options.directives, gr), c(tt.options.components, Er), tt.prototype.__patch__ = An ? mr : p, tt.prototype.$mount = function (e, t) {
      return e = e && An ? yt(e) : void 0, se(this, e, t);
    }, setTimeout(function () {
      En.devtools && Dn && Dn.emit("init", tt);
    }, 0);var Sr = "undefined" != typeof window ? window : "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : {},
        wr = function (e, t) {
      return t = { exports: {} }, e(t, t.exports), t.exports;
    }(function (e, t) {
      "use strict";
      var i = null,
          n = { install: function install(e) {
          var t,
              n = e.version[0];i || (i = new e({ data: function data() {
              return { current: "", locales: {} };
            }, computed: { lang: function lang() {
                return this.current;
              }, locale: function locale() {
                return this.locales[this.current] ? this.locales[this.current] : null;
              } }, methods: { setLang: function setLang(e) {
                this.current !== e && ("" === this.current ? this.$emit("language:init", e) : this.$emit("language:changed", e)), this.current = e, this.$emit("language:modified", e);
              }, setLocales: function setLocales(t) {
                if (t) {
                  var i = Object.create(this.locales);for (var n in t) {
                    i[n] || (i[n] = {}), e.util.extend(i[n], t[n]);
                  }this.locales = Object.create(i), this.$emit("locales:loaded", t);
                }
              }, text: function text(e) {
                return this.locale && this.locale[e] ? this.locale[e] : e;
              } } }), e.prototype.$translate = i), e.mixin((t = {}, t["1" === n ? "init" : "beforeCreate"] = function () {
            this.$translate.setLocales(this.$options.locales);
          }, t.methods = { t: function t(e) {
              return this.$translate.text(e);
            } }, t.directives = { translate: function (e) {
              e.$translateKey || (e.$translateKey = e.innerText);var t = this.$translate.text(e.$translateKey);e.innerText = t;
            }.bind(i) }, t)), e.locales = function (e) {
            i.$translate.setLocales(e);
          };
        } };e.exports = n;
    }),
        Tr = { init: function init() {
        window.filestackInternals.logger.working = !1;
      }, isWorking: function isWorking() {
        return window.filestackInternals.logger.working;
      }, on: function on() {
        window.filestackInternals.logger.working = !0;
      }, off: function off() {
        window.filestackInternals.logger.working = !1;
      } },
        Ar = function e(t, i) {
      var n = function n() {
        for (var e = arguments.length, n = Array(e), o = 0; o < e; o++) {
          n[o] = arguments[o];
        }var r = [].concat(n).map(function (e) {
          return "object" === (void 0 === e ? "undefined" : un(e)) ? JSON.stringify(e, function (e, t) {
            if ("function" == typeof t) {
              if ("json" === e) try {
                return t();
              } catch (e) {}return "[Function]";
            }return t instanceof File ? "[File name: " + t.name + ", mimetype: " + t.type + ", size: " + t.size + "]" : t;
          }, 2) : e;
        });if (i.isWorking()) {
          var s;(s = console).log.apply(s, ["[" + t + "]"].concat(pn(r)));
        }
      };return n.context = function (n) {
        return e(t + "][" + n, i);
      }, n.on = i.on, n.off = i.off, n;
    }("filestack", Tr);!function () {
      var e = void 0;"object" === ("undefined" == typeof window ? "undefined" : un(window)) && (e = window.filestackInternals, e || (e = {}, window.filestackInternals = e), e.logger || (e.logger = Ar, Tr.init())), e;
    }();var Fr = function () {
      var e = void 0;return "object" === ("undefined" == typeof window ? "undefined" : un(window)) && (e = window.filestackInternals, e || (e = {}, window.filestackInternals = e), e.loader || (e.loader = { modules: {} })), e;
    }(),
        kr = Fr.loader.modules,
        Rr = function Rr(e) {
      var t = kr[e];if (t || (kr[e] = {}, t = kr[e]), t.instance) return Promise.resolve(t.instance);if (t.promise) return t.promise;var i = new Promise(function (i) {
        var n = function n() {
          t.resolvePromise = i;var n = document.createElement("script");n.src = e, document.body.appendChild(n);
        };!function e() {
          "complete" === document.readyState ? n() : setTimeout(e, 50);
        }();
      });return t.promise = i, i;
    },
        Or = function Or(e) {
      var t = document.getElementsByTagName("script"),
          i = t[t.length - 1],
          n = i.getAttribute("src"),
          o = kr[n];o.resolvePromise && (o.instance = e, o.resolvePromise(e), delete o.promise, delete o.resolvePromise);
    },
        Lr = function Lr(e) {
      return null !== document.querySelector('link[href="' + e + '"]') ? Promise.resolve() : new Promise(function (t) {
        var i = document.getElementsByTagName("head")[0],
            n = document.createElement("link"),
            o = function e() {
          t(), n.removeEventListener("load", e);
        };n.rel = "stylesheet", n.href = e, n.addEventListener("load", o), i.appendChild(n);
      });
    },
        Nr = { registerReadyModule: Or, loadModule: Rr, loadCss: Lr },
        xr = function xr(e) {
      function t() {
        var e = this.$options;e.store ? this.$store = e.store : e.parent && e.parent.$store && (this.$store = e.parent.$store);
      }if (Number(e.version.split(".")[0]) >= 2) {
        var i = e.config._lifecycleHooks.indexOf("init") > -1;e.mixin(i ? { init: t } : { beforeCreate: t });
      } else {
        var n = e.prototype._init;e.prototype._init = function (e) {
          void 0 === e && (e = {}), e.init = e.init ? [t].concat(e.init) : t, n.call(this, e);
        };
      }
    },
        Ir = "undefined" != typeof window && window.__VUE_DEVTOOLS_GLOBAL_HOOK__,
        Dr = function Dr(e, t) {
      this.runtime = t, this._children = Object.create(null), this._rawModule = e;
    },
        $r = { state: {}, namespaced: {} };$r.state.get = function () {
      return this._rawModule.state || {};
    }, $r.namespaced.get = function () {
      return !!this._rawModule.namespaced;
    }, Dr.prototype.addChild = function (e, t) {
      this._children[e] = t;
    }, Dr.prototype.removeChild = function (e) {
      delete this._children[e];
    }, Dr.prototype.getChild = function (e) {
      return this._children[e];
    }, Dr.prototype.update = function (e) {
      this._rawModule.namespaced = e.namespaced, e.actions && (this._rawModule.actions = e.actions), e.mutations && (this._rawModule.mutations = e.mutations), e.getters && (this._rawModule.getters = e.getters);
    }, Dr.prototype.forEachChild = function (e) {
      Ii(this._children, e);
    }, Dr.prototype.forEachGetter = function (e) {
      this._rawModule.getters && Ii(this._rawModule.getters, e);
    }, Dr.prototype.forEachAction = function (e) {
      this._rawModule.actions && Ii(this._rawModule.actions, e);
    }, Dr.prototype.forEachMutation = function (e) {
      this._rawModule.mutations && Ii(this._rawModule.mutations, e);
    }, Object.defineProperties(Dr.prototype, $r);var Ur = function Ur(e) {
      var t = this;this.root = new Dr(e, !1), e.modules && Ii(e.modules, function (e, i) {
        t.register([i], e, !1);
      });
    };Ur.prototype.get = function (e) {
      return e.reduce(function (e, t) {
        return e.getChild(t);
      }, this.root);
    }, Ur.prototype.getNamespace = function (e) {
      var t = this.root;return e.reduce(function (e, i) {
        return t = t.getChild(i), e + (t.namespaced ? i + "/" : "");
      }, "");
    }, Ur.prototype.update = function (e) {
      Mi(this.root, e);
    }, Ur.prototype.register = function (e, t, i) {
      var n = this;void 0 === i && (i = !0);var o = this.get(e.slice(0, -1)),
          r = new Dr(t, i);o.addChild(e[e.length - 1], r), t.modules && Ii(t.modules, function (t, o) {
        n.register(e.concat(o), t, i);
      });
    }, Ur.prototype.unregister = function (e) {
      var t = this.get(e.slice(0, -1)),
          i = e[e.length - 1];t.getChild(i).runtime && t.removeChild(i);
    };var Mr,
        Pr = function Pr(e) {
      var t = this;void 0 === e && (e = {}), Ui(Mr, "must call Vue.use(Vuex) before creating a store instance."), Ui("undefined" != typeof Promise, "vuex requires a Promise polyfill in this browser.");var i = e.state;void 0 === i && (i = {});var n = e.plugins;void 0 === n && (n = []);var o = e.strict;void 0 === o && (o = !1), this._committing = !1, this._actions = Object.create(null), this._mutations = Object.create(null), this._wrappedGetters = Object.create(null), this._modules = new Ur(e), this._modulesNamespaceMap = Object.create(null), this._subscribers = [], this._watcherVM = new Mr();var r = this,
          s = this,
          a = s.dispatch,
          l = s.commit;this.dispatch = function (e, t) {
        return a.call(r, e, t);
      }, this.commit = function (e, t, i) {
        return l.call(r, e, t, i);
      }, this.strict = o, ji(this, i, [], this._modules.root), zi(this, i), n.concat(xi).forEach(function (e) {
        return e(t);
      });
    },
        zr = { state: {} };zr.state.get = function () {
      return this._vm._data.$$state;
    }, zr.state.set = function (e) {
      Ui(!1, "Use store.replaceState() to explicit replace store state.");
    }, Pr.prototype.commit = function (e, t, i) {
      var n = this,
          o = qi(e, t, i),
          r = o.type,
          s = o.payload,
          a = o.options,
          l = { type: r, payload: s },
          c = this._mutations[r];if (!c) return void console.error("[vuex] unknown mutation type: " + r);this._withCommit(function () {
        c.forEach(function (e) {
          e(s);
        });
      }), this._subscribers.forEach(function (e) {
        return e(l, n.state);
      }), a && a.silent && console.warn("[vuex] mutation type: " + r + ". Silent option has been removed. Use the filter functionality in the vue-devtools");
    }, Pr.prototype.dispatch = function (e, t) {
      var i = qi(e, t),
          n = i.type,
          o = i.payload,
          r = this._actions[n];return r ? r.length > 1 ? Promise.all(r.map(function (e) {
        return e(o);
      })) : r[0](o) : void console.error("[vuex] unknown action type: " + n);
    }, Pr.prototype.subscribe = function (e) {
      var t = this._subscribers;return t.indexOf(e) < 0 && t.push(e), function () {
        var i = t.indexOf(e);i > -1 && t.splice(i, 1);
      };
    }, Pr.prototype.watch = function (e, t, i) {
      var n = this;return Ui("function" == typeof e, "store.watch only accepts a function."), this._watcherVM.$watch(function () {
        return e(n.state, n.getters);
      }, t, i);
    }, Pr.prototype.replaceState = function (e) {
      var t = this;this._withCommit(function () {
        t._vm._data.$$state = e;
      });
    }, Pr.prototype.registerModule = function (e, t) {
      "string" == typeof e && (e = [e]), Ui(Array.isArray(e), "module path must be a string or an Array."), this._modules.register(e, t), ji(this, this.state, e, this._modules.get(e)), zi(this, this.state);
    }, Pr.prototype.unregisterModule = function (e) {
      var t = this;"string" == typeof e && (e = [e]), Ui(Array.isArray(e), "module path must be a string or an Array."), this._modules.unregister(e), this._withCommit(function () {
        var i = Xi(t.state, e.slice(0, -1));Mr.delete(i, e[e.length - 1]);
      }), Pi(this);
    }, Pr.prototype.hotUpdate = function (e) {
      this._modules.update(e), Pi(this, !0);
    }, Pr.prototype._withCommit = function (e) {
      var t = this._committing;this._committing = !0, e(), this._committing = t;
    }, Object.defineProperties(Pr.prototype, zr), "undefined" != typeof window && window.Vue && Ki(window.Vue);var jr = Qi(function (e, t) {
      var i = {};return Zi(t).forEach(function (t) {
        var n = t.key,
            o = t.val;i[n] = function () {
          var t = this.$store.state,
              i = this.$store.getters;if (e) {
            var n = Ji(this.$store, "mapState", e);if (!n) return;t = n.context.state, i = n.context.getters;
          }return "function" == typeof o ? o.call(this, t, i) : t[o];
        }, i[n].vuex = !0;
      }), i;
    }),
        Vr = Qi(function (e, t) {
      var i = {};return Zi(t).forEach(function (t) {
        var n = t.key,
            o = t.val;o = e + o, i[n] = function () {
          for (var t = [], i = arguments.length; i--;) {
            t[i] = arguments[i];
          }if (!e || Ji(this.$store, "mapMutations", e)) return this.$store.commit.apply(this.$store, [o].concat(t));
        };
      }), i;
    }),
        Gr = Qi(function (e, t) {
      var i = {};return Zi(t).forEach(function (t) {
        var n = t.key,
            o = t.val;o = e + o, i[n] = function () {
          if (!e || Ji(this.$store, "mapGetters", e)) return o in this.$store.getters ? this.$store.getters[o] : void console.error("[vuex] unknown getter: " + o);
        }, i[n].vuex = !0;
      }), i;
    }),
        Wr = Qi(function (e, t) {
      var i = {};return Zi(t).forEach(function (t) {
        var n = t.key,
            o = t.val;o = e + o, i[n] = function () {
          for (var t = [], i = arguments.length; i--;) {
            t[i] = arguments[i];
          }if (!e || Ji(this.$store, "mapActions", e)) return this.$store.dispatch.apply(this.$store, [o].concat(t));
        };
      }), i;
    }),
        Hr = { Store: Pr, install: Ki, version: "2.2.1", mapState: jr, mapMutations: Vr, mapGetters: Gr, mapActions: Wr },
        Br = function Br(e) {
      return "function" == typeof e.getAsEntry ? e.getAsEntry() : "function" == typeof e.webkitGetAsEntry ? e.webkitGetAsEntry() : void 0;
    },
        Yr = function Yr(e) {
      return [".DS_Store"].indexOf(e) === -1;
    },
        Xr = function Xr(e) {
      for (var t = [], i = [], n = 0; n < e.length; n += 1) {
        var o = e[n];if ("file" === o.kind && o.type && "application/x-moz-file" !== o.type) {
          var r = o.getAsFile();r && (t.push(r), i.push(Promise.resolve()));
        } else if ("file" === o.kind) {
          var s = Br(o);s && i.push(function e(i) {
            return new Promise(function (n) {
              i.isDirectory ? i.createReader().readEntries(function (t) {
                var i = t.map(function (t) {
                  return e(t);
                });Promise.all(i).then(n);
              }) : i.isFile && i.file(function (e) {
                Yr(e.name) && t.push(e), n();
              });
            });
          }(s));
        } else "string" === o.kind && "text/uri-list" === o.type && i.push(function (e) {
          return new Promise(function (i) {
            e.getAsString(function (e) {
              t.push({ url: e, source: "dragged-from-web" }), i();
            });
          });
        }(o));
      }return Promise.all(i).then(function () {
        return t;
      });
    },
        qr = function qr(e) {
      return new Promise(function (t) {
        for (var i = [], n = 0; n < e.length; n += 1) {
          i.push(e[n]);
        }t(i);
      });
    },
        Kr = function Kr(e) {
      return e.items ? Xr(e.items) : e.files ? qr(e.files) : Promise.resolve([]);
    },
        Zr = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { directives: [{ name: "show", rawName: "v-show", value: e.fileAboutToBeDropped, expression: "fileAboutToBeDropped" }], ref: "dropZone", staticClass: "fsp-dropzone-overlay" }, [i("div", { staticClass: "fsp-dropzone-overlay__text" })]);
      }, staticRenderFns: [], data: function data() {
        return { fileAboutToBeDropped: !1 };
      }, methods: fn({}, Hr.mapActions(["addFile", "updateSelectLabelActive"]), { dragenter: function dragenter(e) {
          e.preventDefault(), this.fileAboutToBeDropped = !0, this.updateSelectLabelActive(!0);
        }, dragover: function dragover(e) {
          e.preventDefault();
        }, dragleave: function dragleave() {
          this.fileAboutToBeDropped = !1, this.updateSelectLabelActive(!1);
        }, drop: function drop(e) {
          var t = this;e.preventDefault(), this.fileAboutToBeDropped = !1, Kr(e.dataTransfer).then(function (e) {
            e.forEach(function (e) {
              t.addFile(e);
            });
          });
        }, paste: function paste(e) {
          var t = this;Kr(e.clipboardData).then(function (e) {
            e.forEach(function (e) {
              e.name = "pasted file", t.addFile(e);
            });
          });
        } }), mounted: function mounted() {
        var e = this.$root.$el,
            t = this.$refs.dropZone;e.addEventListener("dragenter", this.dragenter, !1), t.addEventListener("dragover", this.dragover, !1), t.addEventListener("dragleave", this.dragleave, !1), t.addEventListener("drop", this.drop, !1), e.addEventListener("paste", this.paste, !1);
      } },
        Qr = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return e.notifications.length > 0 ? i("div", { staticClass: "fsp-notifications__container" }, [i("div", { staticClass: "fsp-notifications__message" }, [e._v(e._s(e.mostRecentNotification.message))]), i("span", { staticClass: "fsp-icon fsp-notifications__close-button", on: { click: e.removeAllNotifications } })]) : e._e();
      }, staticRenderFns: [], computed: fn({}, Hr.mapGetters(["notifications"]), { mostRecentNotification: function mostRecentNotification() {
          return this.notifications[this.notifications.length - 1];
        } }), methods: fn({}, Hr.mapActions(["removeAllNotifications"])) },
        Jr = [{ name: "local_file_system", label: "My Device", ui: "local" }, { name: "dropbox", label: "Dropbox", ui: "cloud" }, { name: "evernote", label: "Evernote", ui: "cloud" }, { name: "facebook", label: "Facebook", ui: "cloud" }, { name: "flickr", label: "Flickr", ui: "cloud" }, { name: "instagram", label: "Instagram", ui: "cloud" }, { name: "box", label: "Box", ui: "cloud" }, { name: "googledrive", label: "Google Drive", ui: "cloud" }, { name: "github", label: "Github", ui: "cloud" }, { name: "gmail", label: "Gmail", ui: "cloud" }, { name: "picasa", label: "Google Photos", ui: "cloud" }, { name: "onedrive", label: "OneDrive", ui: "cloud" }, { name: "clouddrive", label: "Cloud Drive", ui: "cloud" }, { name: "imagesearch", label: "Web Search", ui: "imagesearch" }, { name: "source-url", label: "Link (URL)", ui: "source-url", layout_view: "list" }],
        es = function es(e) {
      var t = void 0;if (Jr.forEach(function (i) {
        i.name === e && (t = i);
      }), !t) throw new Error('Unknown source "' + e + '"');return t;
    },
        ts = { render: function render() {
        var e = this,
            t = e.$createElement;return (e._self._c || t)("span", { staticClass: "fsp-picker__close-button fsp-icon--close-modal", on: { click: e.closePicker } });
      }, staticRenderFns: [], methods: { closePicker: function closePicker() {
          this.$root.$destroy();
        } } },
        is = function is(e) {
      return e.indexOf("/") !== -1;
    },
        ns = function ns(e, t) {
      return e.mimetype && "image/*" === t ? e.mimetype.indexOf("image/") !== -1 : e.mimetype && "video/*" === t ? e.mimetype.indexOf("video/") !== -1 : e.mimetype && "audio/*" === t ? e.mimetype.indexOf("audio/") !== -1 : e.mimetype === t;
    },
        os = function os(e) {
      return (/\.\w+$/.exec(e)[0]
      );
    },
        rs = function rs(e) {
      return e.replace(".", "");
    },
        ss = function ss(e, t) {
      return rs(os(e.name)) === rs(t);
    },
        as = function as(e, t) {
      return void 0 === t || t.some(function (t) {
        return is(t) ? ns(e, t) : ss(e, t);
      });
    },
        ls = function ls(e) {
      var t = { filename: e.name, mimetype: e.mimetype || e.type, size: e.size, source: e.source, url: e.url, handle: e.handle };return e.status && (t.status = e.status), e.key && (t.key = e.key), e.container && (t.container = e.container), t;
    },
        cs = function cs(e) {
      return e.map(ls);
    },
        us = function us(e) {
      return e >= 1048576 ? Math.round(e / 1048576) + "MB" : e >= 1024 ? Math.round(e / 1024) + "KB" : e + "B";
    },
        ds = function ds(e) {
      if (e.name.length < 45) return e.name;var t = e.name.split(".");if (2 === t.length) {
        return t[0].substring(0, 42) + ".." + "." + t[1];
      }if (t.length > 2) {
        return e.name.substring(0, 42) + ".." + "." + t[t.length - 1];
      }return e.name.substring(0, 42) + "...";
    },
        fs = function fs() {
      return Math.round(255 * Math.random()).toString(16);
    },
        ps = function ps(e) {
      for (var t = ""; t.length < 2 * e;) {
        t += fs();
      }return t;
    },
        ms = { Add: "Tilføj", My: "Min", Connect: "Forbind", View: "Vis", Upload: "Upload", Filter: "Filtrer", Images: "Billeder", of: "af", Loading: "Indlæser", Revert: "Gør om", Edit: "Rediger", More: "Mere", Uploaded: "Uploaded", "A new page will open to connect your account.": "En ny side vil åbne for at forbinde med din konto", "My Device": "Min enhed", "or Drag and Drop, Copy and Paste Files": "Eller træk og slip, kopier og indsæt filer", "Pick Your Files": "Vælg dine filer", "Select Files to Upload": "Vælg filer til upload", "Selected Files": "Valgte filer", "Select Files from": "Vælg filer fra", "We only extract images and never modify or delete them.": "Vi hiver kun billeder og modificerer eller sletter dem aldrig", "You need to authenticate with ": "Du skal godkende med ", "Search images": "Søg billeder", "Sign Out": "Log ud", "Select From": "Vælg fra", "View/Edit Selected": "Vis/rediger valgte", "Deselect All": "Fravælg alle", "Files & Folders": "Filer og foldere", "Edited Images": "Redigerede filer", "Go Back": "Gå tilbage", "No search results found for": "Ingen resultater fundet for", "Please select": "Vælg venligst", "more file": "fil mere", "more files": "flere filer", "File {displayName} is not an accepted file type. The accepted file types are {types}": "Filen {displayName} er ikke i et acceptabelt format. De accepterede formater er {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": " Filen {displayName} er for stor. Den accepterede filstørrelse er {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": " Vores filstørrelse er begrænset til {maxFiles} {filesText}" },
        hs = { Add: "Hinzufügen", My: "Mein", Connect: "Verbinden mit", View: "Aussicht", Upload: "Hochladen", Filter: "Filtern", Images: "Bilder", of: "von", Loading: "Laden", Revert: "Rückgängig", Edit: "Bearbeiten", More: "Mehr", Uploaded: "Hochgeladen", "A new page will open to connect your account.": "Eine neue Seite wird geöffnet, um Ihr Konto zu verbinden", "My Device": "Mein Gerät", "or Drag and Drop, Copy and Paste Files": "oder ziehen, kopieren und Einfügen von Dateien", "Pick Your Files": "Wählen Sie Ihre Dateien", "Select Files to Upload": "Wählen Sie Dateien hochladen", "Selected Files": "Ausgewählten Dateien", "Select Files from": "Wählen Sie Dateien aus", "We only extract images and never modify or delete them.": "Wir extrahieren Bilder nur und modifizieren oder löschen sie niemals", "You need to authenticate with ": "Sie müssen sich mit anmelden ", "Search images": "Suche bilder", "Sign Out": "Abmelden", "Select From": "Wählen Sie aus", "View/Edit Selected": "Anzeigen/Bearbeiten ausgewählt", "Deselect All": "Deaktivieren Sie alle", "Files & Folders": "Dateien und Ordner", "Edited Images": "Bearbeitete Bilder", "Go Back": "Zurück", "No search results found for": "Keine Suchergebnisse gefunden für", "Please select": "Bitte wählen Sie", "more file": "weitere Datei", "more files": "weitere Dateien", "File {displayName} is not an accepted file type. The accepted file types are {types}": "Datei-{displayName} ist keine anerkannte Dateityp. Die akzeptierten Dateitypen sind {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "{displayName} Datei ist zu groß. Die akzeptierten Dateigröße beträgt {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "Unser Dateigrößenlimit ist {maxFiles} {filesText}" },
        vs = { "File {displayName} is not an accepted file type. The accepted file types are {types}": "File {displayName} is not an accepted file type. The accepted file types are {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "File {displayName} is too big. The accepted file size is less than {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "Our file upload limit is {maxFiles} {filesText}" },
        gs = { Add: "Añadir", My: "Mi", Connect: "Conectar", View: "Ver", Upload: "Subir", Filter: "Filtrar", Images: "Imágenes", of: "de", Loading: "Cargando", Revert: "Deshacer", Edit: "Editar", More: "Mas", Uploaded: "Subido", "A new page will open to connect your account.": "Se abrirá una nueva página para conectar tu cuenta.", "My Device": "Mi Dispositivo", "or Drag and Drop, Copy and Paste Files": "O arrastrar y soltar, copiar y pegar archivos", "Pick Your Files": "Elige tus archivos", "Select Files to Upload": "Seleccionar archivos para cargar", "Selected Files": "Archivos seleccionados", "Select Files from": "Seleccione Archivos de", "We only extract images and never modify or delete them.": "Sólo extraemos imágenes y nunca las modificamos o eliminamos", "You need to authenticate with ": "Debe autenticarse con", "Search images": "Búsqueda de imágenes", "Sign Out": "Desconectar", "Select From": "Seleccione de", "View/Edit Selected": "Ver/Editar Seleccionado", "Deselect All": "Deseleccionar Todo", "Files & Folders": "Archivos y Carpetas", "Edited Images": "Imágenes editadas", "Go Back": "Volver", "No search results found for": "No hay resultados de búsqueda para", "Please select": "Por favor, seleccione", "more file": "el archivo más", "more files": "el archivo más", "File {displayName} is not an accepted file type. The accepted file types are {types}": "Archivo {displayName} no es un tipo de archivo aceptado. Los tipos de archivo aceptados son {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "{displayName} De archivo es demasiado grande. El tamaño aceptado es {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "Nuestro límite de upload de archivo es {maxFiles} {filesText}" },
        _s = { Add: "Ajouter", My: "Ma", Connect: "Relier", View: "Vue", Upload: "Télécharger", Filter: "Filtrer", Images: "Images", of: "sur", Loading: "Chargement", Revert: "Annuler", Edit: "Modifier", More: "Plus", Uploaded: "Téléchargées", "A new page will open to connect your account.": "Une nouvelle page s'ouvrira pour connecter votre compte.", "My Device": "Mon appareil", "or Drag and Drop, Copy and Paste Files": "ou faites glisser, copier et coller des fichiers", "Pick Your Files": "Choisissez vos fichiers", "Select Files to Upload": "Sélectionnez les fichiers à télécharger", "Selected Files": "Fichiers sélectionnés", "Select Files from": "Sélectionnez les fichiers à partir de", "We only extract images and never modify or delete them.": "Nous ne faisons qu'extraire les images, et ne les modifions ou supprimons jamais.", "You need to authenticate with ": "Vous devez vous authentifier avec ", "Search images": "Rechercher des images", "Sign Out": "Déconnecter", "Select From": "Sélectionnez dans", "View/Edit Selected": "Afficher/modifier sélectionnée", "Deselect All": "Désélectionner tout", "Files & Folders": "Fichiers et dossiers", "Edited Images": "Images éditées", "Go Back": "Retour", "No search results found for": "Aucun résultat de recherche trouvé pour", "Please select": "Veuillez sélectionner", "more file": "plus de fichier", "more files": "plus de fichiers", "File {displayName} is not an accepted file type. The accepted file types are {types}": "{displayName} De fichier n’est pas un type de fichier accepté. Les types de fichiers acceptés sont {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "Le fichier {displayName} est trop grand. La taille de fichier acceptée est {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "Notre limite de téléchargement de fichier est {maxFiles} {filesText}" },
        ys = { Add: "Aggiungere", My: "Mio", Connect: "Collegare", View: "Visualizza", Upload: "Caricare", Filter: "Filtrare", Images: "Immagini", of: "di", Loading: "Caricamento", Revert: "Annulla", Edit: "Modifica", More: "Più", Uploaded: "Caricato", "A new page will open to connect your account.": "Si aprirà una nuova pagina per collegare il tuo account", "My Device": "Il mio dispositivo", "or Drag and Drop, Copy and Paste Files": "o trascinare, copiare e incollare file", "Pick Your Files": "Selezionare i file", "Select Files to Upload": "Selezionare i file da caricare", "Selected Files": "File selezionati", "Select Files from": "Selezionare i file da", "We only extract images and never modify or delete them.": "Abbiamo estratto solo immagini e non modificarli o cancellarli.", "You need to authenticate with": "È necessario autenticarsi con", "Search images": "Ricerca immagini", "Sign Out": "Esci", "Select From": "Selezionare da", "View/Edit Selected": "Visualizza/Modifica selezionato", "Deselect All": "Deselezionare tutto", "Files & Folders": "File e cartelle", "Edited Images": "Immagini Modificate", "Go Back": "Indietro", "No search results found for": "È il nostro limite di upload di file", "Please select": "Si prega di selezionare", "more file": "più file", "more files": "più file", "File {displayName} is not an accepted file type. The accepted file types are {types}": "{displayName} File non è un tipo di file accettato. I tipi di file accettati sono {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "{displayName} Arquivo é muito grande. O tamanho de arquivo aceito é {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "È il nostro limite di upload di file {maxFiles} {filesText}" },
        bs = { Add: "Toevoegen", My: "Mijn", Connect: "Verbinding maken", View: "Bekijken", Upload: "Uploaden", Filter: "Filtreren", Images: "Afbeeldingen", of: "van de", Loading: "Laden", Revert: "Ongedaan maken", Edit: "Bewerken", More: "Meer", Uploaded: "Geüpload", "A new page will open to connect your account.": "Een nieuwe pagina wordt geopend om verbinding maken met uw account", "My Device": "Mijn apparaat", "or Drag and Drop, Copy and Paste Files": "of slepen, kopiëren en plakken van bestanden", "Pick Your Files": "Kies uw bestanden", "Select Files to Upload": "Selecteer bestanden om te uploaden", "Selected Files": "Geselecteerde bestanden", "Select Files from": "Selecteer bestanden uit", "We only extract images and never modify or delete them.": "We halen alleen afbeeldingen en nooit wijzigen of verwijderen", "You need to authenticate with ": "U moet verifiëren bij ", "Search images": "Zoek beelden", "Sign Out": "Afmelden", "Select From": "Selecteren", "View/Edit Selected": "Bekijken/bewerken geselecteerd", "Deselect All": "Deselecteer alles", "Files & Folders": "Bestanden en mappen", "Edited Images": "Bewerkte Afbeeldingen", "Go Back": "Ga Bacl", "No search results found for": "Geen zoekresultaten gevonden voor", "Please select": "Gelieve te selecteren", "more file": "meer bestand", "more files": "meer bestanden", "File {displayName} is not an accepted file type. The accepted file types are {types}": "Bestand {displayName} is niet een geaccepteerde bestandstype. De geaccepteerde bestandstypen zijn {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "Bestand {displayName} is te groot. De aanvaarde vijl spanwijdte zit {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "Onze bestand uploaden limiet is {maxFiles} {filesText}" },
        Cs = { Add: "Dodaj", My: "Mój", Connect: "Połączyć", View: "Widok", Upload: "Prześlij pliki", Filter: "Szukaj", Images: "Obrazy", of: "z", Loading: "Ładowanie", Revert: "Cofnij", Edit: "Edytuj", More: "Więcej", Uploaded: "Przesłany", "A new page will open to connect your account.": "Nowa strona zostanie otwarta w celu połączenia z Twoim kontem.", "My Device": "Moje urządzenie", "or Drag and Drop, Copy and Paste Files": "lub przeciągnij i upuść, kopiować i wklejać pliki", "Pick Your Files": "Wybierz swoje pliki", "Select Files to Upload": "Wybierz pliki do przesłania", "Selected Files": "Wybrane pliki", "Select Files from": "Wybierz pliki z", "We only extract images and never modify or delete them.": "Mamy tylko wyodrębnić obrazy i nigdy zmodyfikować lub usunąć je", "You need to authenticate with ": "Musisz uwierzytelnić", "Search images": "Szukaj obrazów", "Sign Out": "Wyloguj się", "Select From": "Wybierz z", "View/Edit Selected": "Wyświetl/Edytuj zaznaczone", "Deselect All": "Odznacz wszystko", "Files & Folders": "Pliki i Foldery", "Edited Images": "Edytowane obrazy", "Go Back": "Przejdź wstecz", "No search results found for": "Brak wyników wyszukiwania", "Please select": "Proszę wybrać", "more file": "więcej plików", "more files": "więcej plików", "File {displayName} is not an accepted file type. The accepted file types are {types}": "{displayName} Plik nie jest typem plików akceptowane. Typy plików akceptowane są {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "{displayName} Plik jest zbyt duże. Rozmiar plików akceptowane jest {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "Nasz limit uploadu pliku jest {maxFiles} {filesText}" },
        Es = { Add: "Adicionar", My: "Meu", Connect: "Conectar-se", View: "Ver", Upload: "Carregar", Filter: "Ordenar", Images: "Imagens", of: "de", Loading: "Carregamento", Revert: "Desfazer", Edit: "Editar", More: "Mais", Uploaded: "Carregado", "A new page will open to connect your account.": "Uma nova página será aberta para conectar a sua conta.", "My Device": "Meu dispositivo", "or Drag and Drop, Copy and Paste Files": "ou arrastar, copiar e colar arquivos", "Pick Your Files": "Selecione seus arquivos", "Select Files to Upload": "Selecionar arquivos para upload", "Selected Files": "Arquivos selecionados", "Select Files from": "Selecione arquivos de", "We only extract images and never modify or delete them.": "Nós apenas extraímos as imagens e nunca a modificamos ou a removemos.", "You need to authenticate with ": "Você precisar se autenticar com", "Search images": "Procurar fotos", "Sign Out": "Desconectar", "Select From": "Selecione de", "View/Edit Selected": "Exibir/Editar selecionada", "Deselect All": "Desmarcar todos", "Files & Folders": "Arquivos e pastas", "Edited Images": "Imagens editadas", "Go Back": "Voltar", "No search results found for": "Nenhum resultado de pesquisa encontrado para", "Please select": "Por favor selecione", "more file": "arquivo mais", "more files": "mais arquivos", "File {displayName} is not an accepted file type. The accepted file types are {types}": " Arquivo {displayName} não é um tipo de arquivo aceitos. Os tipos de arquivo aceitos são {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "{displayName} Arquivo é muito grande. O tamanho de arquivo aceito é {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "É o nosso limite de upload de arquivo {maxFiles} {filesText}" },
        Ss = { Add: "Добавить", My: "Мой", Connect: "подключить", View: "просмотреть", Upload: "загрузить", Filter: "сортировать по дате", Images: "фото", of: "из", Loading: "загрузки", Revert: "Отменить", Edit: "Изменить", More: "больше", Uploaded: "загружены", "A new page will open to connect your account.": "Новая страница открывается чтобы подключить ваш аккаунт", "My Device": "Моё устройство", "or Drag and Drop, Copy and Paste Files": "или перетаскивать, копировать и вставлять файлы", "Pick Your Files": "Выберите файлы", "Select Files to Upload": "Выберите файлы для загрузки", "Selected Files": "Выбранные файлы", "Select Files from": "Выбрать файлы", "We only extract images and never modify or delete them.": "Мы просто извлекаем фото, а никогда не их изменяем или удалим", "You need to authenticate with ": "Требуется аутентификация аккаунта с ", "Search images": "поиск фото", "Sign Out": "выйти", "Select From": "выбрать в...", "View/Edit Selected": "просмотреть/редактировать", "Deselect All": "отмена", "Files & Folders": "файлы и папки", "Edited Images": "Отредактированные изображения", "Go Back": "Вернуться", "No search results found for": "Нет результатов поиска найдено для", "Please select": "Пожалуйста, выберите", "more file": "более файла", "more files": "больше файлов", "File {displayName} is not an accepted file type. The accepted file types are {types}": "{displayName} Файлов не является типом прикладываемых файлов. Типы прикладываемых файлов являются {types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": "{displayName} Файл слишком большой. Признанных файл имеет размер {roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "Наш предел загрузки файлов {maxFiles} {filesText}" },
        ws = { Add: "再添加", My: "我的", Connect: "连接", View: "看", Upload: "上传", Filter: "过滤", Images: "图片", of: "/", Loading: "载入中", Revert: "还原", Edit: "编辑", More: "更多", Uploaded: "已上传", "A new page will open to connect your account.": "一个新页面会打开以关联您的帐户", "My Device": "我的设备", "or Drag and Drop, Copy and Paste Files": "或拖放，复制和粘贴文件", "Pick Your Files": "选择您的文件", "Select Files to Upload": "选择要上传的文件", "Selected Files": "所选文件", "Select Files from": "从中选择文件", "We only extract images and never modify or delete them.": "我们只提取图像，从不修改或删除它们", "You need to authenticate with": "您需要验证", "Search images": "搜索图像", "Sign Out": "登出", "Select From": "选择自", "View/Edit Selected": "查看/编辑所选项", "Deselect All": "取消选择全部", "Files & Folders": "文件和文件夹", "Edited Images": "编辑的图像", "Go Back": "返回", "No search results found for": "未找到搜索结果", "Please select": "请选择", "more file": "更多文件", "more files": "更多文件", "File {displayName} is not an accepted file type. The accepted file types are {types}": " 文件{displayName}不是可接受的文件类型。 可接受的文件类型为{types}", "File {displayName} is too big. The accepted file size is less than {roundFileSize}": " 文件{displayName}太大。 可接受的文件大小为{roundFileSize}", "Our file upload limit is {maxFiles} {filesText}": "我们的文件上传限制为 {maxFiles} {filesText}" },
        Ts = { da: ms, de: hs, en: vs, es: gs, fr: _s, it: ys, nl: bs, pl: Cs, pt: Es, ru: Ss, zh: ws },
        As = function As() {
      var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "en",
          t = Ts[e];return { ERROR_FILE_NOT_ACCEPTABLE: t["File {displayName} is not an accepted file type. The accepted file types are {types}"], ERROR_FILE_TOO_BIG: t["File {displayName} is too big. The accepted file size is less than {roundFileSize}"], ERROR_MAX_FILES_REACHED: t["Our file upload limit is {maxFiles} {filesText}"] };
    },
        Fs = Ar.context("picker"),
        ks = function ks(e) {
      return e.source + e.path;
    },
        Rs = function Rs(e, t) {
      return e.map(function (e) {
        return ks(e);
      }).indexOf(ks(t));
    },
        Os = function Os(e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          i = 0,
          n = function n(e) {
        if ((e instanceof File || e instanceof Blob) && (e = { source: "local_file_system", mimetype: e.type, name: e.name, path: e.name, size: e.size, originalFile: e }), "dragged-from-web" === e.source) {
          e.name = e.url.split("/").pop(), e.path = e.url, e.mimetype = "text/html";var t = e.url.split(".").pop(),
              i = ["jpg", "jpeg", "png", "tiff", "gif", "bmp"];t && i.indexOf(t.toLowerCase()) !== -1 && (e.thumbnail = e.url, e.mimetype = "image/" + t);
        }return e.uploadToken = ps(16), e.progress = 0, e.progressSize = 0, e;
      },
          o = function o(e, t) {
        var i = function i(e) {
          var i = void 0;return e.some(function (e) {
            return e.uploadToken === t && (i = e, !0);
          }), i;
        };return i(e.waiting) || i(e.uploading) || i(e.done) || i(e.failed);
      },
          r = function r(e, t) {
        if (Rs(e.getters.filesWaiting, t) !== -1) return e.commit("CANCEL_UPLOAD", t.uploadToken), void e.commit("DESELECT_FILE", t);if (t.folder) return void e.dispatch("addCloudFolder", { name: t.source, path: t.path });if (!function () {
          if (e.getters.allFilesInQueueCount === e.getters.maxFiles) {
            var t = 1 === e.getters.maxFiles ? "file" : "files",
                i = As(e.getters.lang).ERROR_MAX_FILES_REACHED.replace("{maxFiles}", e.getters.maxFiles).replace("{filesText}", t);return e.dispatch("showNotification", i), !0;
          }return !1;
        }()) {
          var i = n(t);(function (t) {
            if (as(t, e.getters.accept)) return !0;var i = As(e.getters.lang).ERROR_FILE_NOT_ACCEPTABLE.replace("{displayName}", ds(t)).replace("{types}", e.getters.accept);return e.dispatch("showNotification", i), !1;
          })(i) && function (t) {
            if (void 0 !== e.getters.onFileSelected) try {
              var i = e.getters.onFileSelected(ls(t));return i && "string" == typeof i.name && (t.originalFile && (t.originalFile.newName = i.name), t.name = i.name), !0;
            } catch (t) {
              return e.dispatch("showNotification", t.message), !1;
            }return !0;
          }(i) && function (t) {
            if (void 0 === e.getters.maxSize) return !0;if (t.size < e.getters.maxSize) return !0;if (!t.size) return !0;var i = As(e.getters.lang).ERROR_FILE_TOO_BIG.replace("{displayName}", ds(t)).replace("{roundFileSize}", us(e.getters.maxSize));return e.dispatch("showNotification", i), !1;
          }(i) && (Fs("Selected file:", t), e.commit("MARK_FILE_AS_WAITING", i), function () {
            e.getters.startUploadingWhenMaxFilesReached === !0 && e.getters.filesWaiting.length === e.getters.maxFiles ? e.dispatch("startUploading", !0) : e.getters.uploadInBackground && e.dispatch("startUploading");
          }(), e.getters.allFilesInQueueCount === e.getters.maxFiles && (e.commit("CHANGE_ROUTE", ["summary"]), e.commit("UPDATE_MOBILE_NAV_ACTIVE", !1)));
        }
      },
          s = function s(t) {
        var n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
            o = function o() {
          return i < 4 && t.state.waiting.length > 0;
        },
            r = function r() {
          return 0 === i && 0 === t.state.waiting.length && 0 === t.state.uploading.length;
        },
            s = function s() {
          var n = t.state.waiting[0],
              o = {},
              r = void 0;if (n.tempStorage && !n.transformed) r = Promise.resolve(n.tempStorage);else if (n.transformed && !n.transformedFile) r = e.storeURL(n.transformed, fn({}, t.getters.storeTo, { filename: n.name }));else if (n.transformedFile) r = Promise.resolve(n.transformedFile);else if ("local_file_system" === n.source) {
            var s = { retryOptions: null, onProgress: function onProgress(e) {
                t.getters.uploadStarted && (t.commit("SET_FILE_UPLOAD_PROGRESS", { uploadToken: n.uploadToken, progress: e.totalProgressPercent, progressSize: us(e.progressTotal) }), void 0 !== t.getters.onFileUploadProgress && t.getters.onFileUploadProgress(ls(n), e));
              } };r = e.upload(n.originalFile, s, t.getters.storeTo, o);
          } else if ("source-url" === n.source || "dragged-from-web" === n.source) r = e.storeURL(n.path, fn({}, t.getters.storeTo, { filename: n.name }));else {
            if ("cloud" !== n.sourceKind) throw new Error("Can't upload this file");r = t.getters.preferLinkOverStore ? e.cloud(n.source).link(n.path) : e.cloud(n.source).store(n.path, t.getters.storeTo, o);
          }return i += 1, t.commit("MARK_FILE_AS_UPLOADING", n), o.cancel && t.commit("SET_CANCEL_TOKEN", { uploadToken: n.uploadToken, token: o }), Fs("Upload started:", n), void 0 !== t.getters.onFileUploadStarted && t.getters.onFileUploadStarted(ls(n)), r.then(function (e) {
            var o = fn({}, n, e);i -= 1, t.commit("MARK_FILE_AS_DONE", { file: n, uploadMetadata: o }), t.commit("REMOVE_CANCEL_TOKEN", n.uploadToken), void 0 !== t.getters.onFileUploadFinished && t.getters.onFileUploadFinished(ls(o)), Fs("Upload done:", n);
          }).catch(function (e) {
            i -= 1, t.commit("MARK_FILE_AS_FAILED", n), t.commit("REMOVE_CANCEL_TOKEN", n.uploadToken), void 0 !== t.getters.onFileUploadFailed && t.getters.onFileUploadFailed(ls(n), e), e instanceof Error ? Fs("Upload failed:", n, e.message) : Fs("Upload failed:", n, e);
          }), r;
        };t.getters.uploadStarted || (n && (t.commit("SET_UPLOAD_STARTED", !0), t.commit("UPDATE_MOBILE_NAV_ACTIVE", !1), t.commit("CHANGE_ROUTE", ["summary"])), function e() {
          o() ? (s().then(e).catch(e), e()) : r() && t.getters.uploadStarted && t.dispatch("allUploadsDone");
        }());
      },
          a = function a(t, i) {
        if ("local_file_system" === t.source) return e.upload(t.originalFile, i.getters.storeTo);if ("cloud" === t.sourceKind) return e.cloud(t.source).store(t.path, i.getters.storeTo);throw new Error("Can't upload this file");
      },
          l = function l(e, t) {
        return new Promise(function (i, n) {
          var r = o(e.state, t),
              s = e.state.uploading.map(function (e) {
            return e.uploadToken;
          }),
              l = s.indexOf(t) !== -1;if (r.tempStorage) i(r.tempStorage);else if (l) {
            !function s() {
              var a = o(e.state, t);if (a) {
                if (void 0 !== a.tempStorage) i(a.tempStorage);else {
                  var l = e.state.failed.map(function (e) {
                    return e.uploadToken;
                  }),
                      c = l.indexOf(t) !== -1;c ? (n(), e.dispatch("showNotification", r.name + " failed to upload. Please try again or check your network log.")) : setTimeout(s, 100);
                }
              } else i(null);
            }();
          } else a(r, e).then(function (n) {
            o(e.state, t) && (e.commit("SET_FILE_TEMPORARY_STORAGE", { uploadToken: t, metadata: n }), n.uploadToken = t, i(n));
          }).catch(function () {
            n(), e.dispatch("showNotification", r.name + " failed to upload. Please try again or check your network log.");
          });
        });
      };return t = fn({ uploadStarted: !1, waiting: [], uploading: [], done: [], failed: [], stagedForTransform: null, pendingTokens: {} }, t), { state: t, mutations: { SET_UPLOAD_STARTED: function SET_UPLOAD_STARTED(e, t) {
            e.uploadStarted = t;
          }, MARK_FILE_AS_WAITING: function MARK_FILE_AS_WAITING(e, t) {
            e.waiting.push(t);
          }, DESELECT_FILE: function DESELECT_FILE(e, t) {
            var i = Rs(e.waiting, t),
                n = Rs(e.uploading, t),
                o = Rs(e.done, t),
                r = Rs(e.failed, t);switch ([i >= 0, n >= 0, o >= 0, r >= 0].indexOf(!0)) {case -1:
                throw new Error("Illegal operation for given file");case 0:
                e.waiting.splice(i, 1);break;case 1:
                e.uploading.splice(n, 1);break;case 2:
                e.done.splice(o, 1);break;case 3:
                e.failed.splice(r, 1);}
          }, DESELECT_FOLDER: function DESELECT_FOLDER(e, t) {
            var i = function i(e) {
              return e.filter(function (e) {
                return "cloud" !== e.sourceKind || e.path.indexOf(t.path) < 0;
              });
            };e.waiting = i(e.waiting), e.uploading = i(e.uploading), e.done = i(e.done), e.failed = i(e.failed);
          }, DESELECT_ALL_FILES: function DESELECT_ALL_FILES(e) {
            e.waiting.splice(0, e.waiting.length), e.uploading.splice(0, e.uploading.length), e.done.splice(0, e.done.length), e.failed.splice(0, e.failed.length);
          }, MARK_FILE_AS_UPLOADING: function MARK_FILE_AS_UPLOADING(e, t) {
            var i = Rs(e.waiting, t);if (i === -1) throw new Error("Illegal operation for given file");e.waiting.splice(i, 1), e.uploading.push(t);
          }, MARK_FILE_AS_DONE: function MARK_FILE_AS_DONE(e, t) {
            var i = t.file,
                n = t.uploadMetadata,
                o = Rs(e.uploading, i);o >= 0 && (e.uploading.splice(o, 1), e.done.push(i), i.transformed ? tt.set(i, "transformedFile", n) : tt.set(i, "tempStorage", n), Object.keys(n).forEach(function (e) {
              tt.set(i, e, n[e]);
            }));
          }, MARK_FILE_AS_FAILED: function MARK_FILE_AS_FAILED(e, t) {
            var i = Rs(e.uploading, t);i >= 0 && (e.uploading.splice(i, 1), e.failed.push(t));
          }, SET_FILE_UPLOAD_PROGRESS: function SET_FILE_UPLOAD_PROGRESS(e, t) {
            var i = t.uploadToken,
                n = t.progress,
                r = t.progressSize,
                s = o(e, i);tt.set(s, "progress", n), tt.set(s, "progressSize", r);
          }, SET_FILE_TEMPORARY_STORAGE: function SET_FILE_TEMPORARY_STORAGE(e, t) {
            var i = t.uploadToken,
                n = t.metadata,
                r = o(e, i);tt.set(r, "tempStorage", n);
          }, SET_FILE_FOR_TRANSFORM: function SET_FILE_FOR_TRANSFORM(e, t) {
            e.stagedForTransform = t;
          }, SET_FILE_TRANSFORMATION: function SET_FILE_TRANSFORMATION(e, t) {
            var i = t.uploadToken,
                n = t.transformedUrl,
                r = o(e, i);tt.set(r, "transformed", n);var s = Rs(e.done, r),
                a = Rs(e.failed, r),
                l = Rs(e.uploading, r),
                c = Rs(e.waiting, r);s >= 0 ? e.done.splice(s, 1) : l >= 0 ? e.uploading.splice(l, 1) : a >= 0 && e.failed.splice(s, 1), c < 0 && e.waiting.push(r);
          }, REMOVE_FILE_TRANSFORMATION: function REMOVE_FILE_TRANSFORMATION(e, t) {
            var i = o(e, t);tt.delete(i, "transformed"), tt.delete(i, "transformedFile"), i.originalFile && i.originalFile.size && tt.set(i, "size", i.originalFile.size);var n = Rs(e.done, i),
                r = Rs(e.failed, i),
                s = Rs(e.uploading, i),
                a = Rs(e.waiting, i);n >= 0 ? e.done.splice(n, 1) : s >= 0 ? e.uploading.splice(s, 1) : r >= 0 && e.failed.splice(n, 1), a < 0 && e.waiting.push(i);
          }, REMOVE_SOURCE_FROM_WAITING: function REMOVE_SOURCE_FROM_WAITING(e, t) {
            var i = e.waiting.filter(function (e) {
              return e.source !== t;
            });e.waiting = i;
          }, REMOVE_CLOUDS_FROM_WAITING: function REMOVE_CLOUDS_FROM_WAITING(e) {
            var t = e.waiting.filter(function (e) {
              return "cloud" !== e.sourceKind;
            });e.waiting = t;
          }, SET_CANCEL_TOKEN: function SET_CANCEL_TOKEN(e, t) {
            var i = t.uploadToken,
                n = t.token;e.pendingTokens[i] = n;
          }, REMOVE_CANCEL_TOKEN: function REMOVE_CANCEL_TOKEN(e, t) {
            delete e.pendingTokens[t];
          }, CANCEL_UPLOAD: function CANCEL_UPLOAD(e, t) {
            var i = e.pendingTokens[t];i && i.cancel && (i.cancel(), delete e.pendingTokens[t]);
          }, CANCEL_FOLDER_UPLOAD: function CANCEL_FOLDER_UPLOAD(e, t) {
            e.waiting.concat(e.uploading).filter(function (e) {
              return "cloud" !== e.sourceKind || e.path.indexOf(t.path) >= 0;
            }).map(function (e) {
              return e.uploadToken;
            }).forEach(function (t) {
              var i = e.pendingTokens[t];i && i.cancel && (i.cancel(), delete e.pendingTokens[t]);
            });
          }, CANCEL_ALL_UPLOADS: function CANCEL_ALL_UPLOADS(e) {
            Object.keys(e.pendingTokens).forEach(function (t) {
              var i = e.pendingTokens[t];i && i.cancel && i.cancel();
            }), e.pendingTokens = {};
          } }, actions: { addFile: r, startUploading: s, uploadFileToTemporaryLocation: l, removeTransformation: function removeTransformation(e, t) {
            e.commit("REMOVE_FILE_TRANSFORMATION", t.uploadToken);
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
        Ls = function Ls(e) {
      var t = e.path.split("/");return t.pop(), e.folder ? e.path : t.join("/");
    },
        Ns = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return e.files.length > 0 ? i("div", { staticClass: "fsp-grid" }, [i("div", { staticClass: "fsp-grid__label" }, [e._v(e._s(e.t("Files & Folders")))]), e._l(e.onlyFolders, function (t) {
          return i("div", { staticClass: "fsp-grid__cell", class: { "fsp-grid__cell--selected": e.isSelected(t) }, on: { click: function click(i) {
                e.handleFolderClick(t);
              } } }, [e.isSelected(t) ? i("span", { staticClass: "fsp-badge fsp-badge--bright fsp-badge--file" }, [e._v(e._s(e.getFileCount(t)))]) : i("span", { staticClass: "fsp-grid__icon", class: e.getIconClass("fsp-grid__icon-folder", t) }), e._v(" "), i("span", { staticClass: "fsp-grid__text", class: { "fsp-grid__text--selected": e.isSelected(t) } }, [e._v(e._s(t.name))]), e._v(" "), e.isSelected(t) ? i("span", { staticClass: "fsp-grid__icon--selected", attrs: { title: "Deselect folder" }, on: { click: function click(i) {
                i.stopPropagation(), e.deselectFolder(t);
              } } }) : e._e(), e._v(" "), e.isLoading(t) || e.isSelected(t) ? e._e() : i("span", { staticClass: "fsp-grid__icon-folder-add", attrs: { title: "Add folder" }, on: { click: function click(i) {
                i.stopPropagation(), e.addFile(t);
              } } }), e.isLoading(t) ? i("div", { staticClass: "fsp-loading--folder" }) : e._e()]);
        }), e._l(e.onlyFiles, function (t) {
          return i("div", { staticClass: "fsp-grid__cell", class: { "fsp-grid__cell--selected": e.isSelected(t) }, on: { click: function click(i) {
                e.addFile(t);
              } } }, [e.isAudio(t) ? i("span", { staticClass: "fsp-grid__icon", class: e.getIconClass("fsp-grid__icon-audio", t) }) : "application/pdf" === t.mimetype ? i("span", { staticClass: "fsp-grid__icon", class: e.getIconClass("fsp-grid__icon-pdf", t) }) : "application/zip" === t.mimetype ? i("span", { staticClass: "fsp-grid__icon", class: e.getIconClass("fsp-grid__icon-zip", t) }) : i("span", { staticClass: "fsp-grid__icon", class: e.getIconClass("fsp-grid__icon-file", t) }), e._v(" "), i("span", { staticClass: "fsp-grid__text", class: { "fsp-grid__text--selected": e.isSelected(t) } }, [e._v(e._s(t.name))]), e._v(" "), e.isSelected(t) ? i("span", { staticClass: "fsp-grid__icon--selected" }) : e._e()]);
        })], 2) : e._e();
      }, staticRenderFns: [], computed: fn({}, Hr.mapGetters(["cloudFolders", "filesWaiting"]), { onlyFolders: function onlyFolders() {
          return this.files.filter(function (e) {
            return e.folder;
          });
        }, onlyFiles: function onlyFiles() {
          return this.files.filter(function (e) {
            return !e.folder;
          });
        } }), methods: fn({}, Hr.mapActions(["addFile", "deselectFolder", "goToDirectory"]), { handleFolderClick: function handleFolderClick(e) {
          this.goToDirectory(e);
        }, getIconClass: function getIconClass(e, t) {
          var i;return i = {}, dn(i, e, !this.isSelected(t)), dn(i, e + "--selected", this.isSelected(t)), i;
        }, isAudio: function isAudio(e) {
          return e && e.mimetype && e.mimetype.indexOf("audio/") !== -1;
        }, isLoading: function isLoading(e) {
          return !!e.folder && this.cloudFolders[e.path] && this.cloudFolders[e.path].loading;
        }, isSelected: function isSelected(e) {
          return e.folder ? this.filesWaiting.filter(function (t) {
            return Ls(t) === e.path;
          }).length > 0 : Rs(this.filesWaiting, e) !== -1;
        }, getFileCount: function getFileCount(e) {
          return this.filesWaiting.filter(function (t) {
            return Ls(t) === e.path;
          }).length;
        } }), props: ["files"] },
        xs = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return e.images && e.images.length > 0 ? i("div", { staticClass: "fsp-grid" }, [i("div", { staticClass: "fsp-grid__label" }, [e._v(e._s(e.t("Images")))]), e._l(e.images, function (t) {
          return i("div", { key: t.path, staticClass: "fsp-image-grid__cell", class: { "fsp-image-grid__cell--selected": e.isSelected(t) }, on: { click: function click(i) {
                e.addFile(t);
              } } }, [e.isSelected(t) ? i("span", { staticClass: "fsp-image-grid__icon--selected" }) : e._e(), e._v(" "), i("img", { staticClass: "fsp-image-grid__image", class: { "fsp-image-grid__image--selected": e.isSelected(t) }, attrs: { src: t.thumbnail, alt: t.name } }), e.isSelected(t) ? i("div", { staticClass: "fsp-image-grid__cell--dark" }) : e._e()]);
        })], 2) : e._e();
      }, staticRenderFns: [], computed: fn({}, Hr.mapGetters(["filesWaiting"])), methods: fn({}, Hr.mapActions(["addFile"]), { isSelected: function isSelected(e) {
          return Rs(this.filesWaiting, e) !== -1;
        } }), props: ["images"] },
        Is = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", [i("file-array", { attrs: { files: e.arrayOfFiles } }), e.arrayOfFiles.length && e.arrayOfImages.length ? i("hr", { staticClass: "fsp-grid__separator" }) : e._e(), i("image-array", { attrs: { images: e.arrayOfImages } })], 1);
      }, staticRenderFns: [], components: { FileArray: Ns, ImageArray: xs }, computed: fn({}, Hr.mapGetters(["listForCurrentCloudPath"]), { arrayOfImages: function arrayOfImages() {
          return this.listForCurrentCloudPath.filter(this.isImage);
        }, arrayOfFiles: function arrayOfFiles() {
          var e = this;return this.listForCurrentCloudPath.filter(function (t) {
            return !e.isImage(t);
          });
        } }), methods: { isImage: function isImage(e) {
          return e && e.mimetype && e.mimetype.indexOf("image/") !== -1;
        } } },
        Ds = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fsp-breadcrumb__container" }, [e.crumbs.length < 3 ? i("span", e._l(e.crumbs, function (t) {
          return i("span", { staticClass: "fsp-breadcrumb__label", on: { click: function click(i) {
                e.handleClick(t);
              } } }, [e._v(e._s(t.label) + " ")]);
        })) : i("span", e._l(e.truncateCrumbs(e.crumbs), function (t) {
          return i("span", { staticClass: "fsp-breadcrumb__label", on: { click: function click(i) {
                e.handleClick(t);
              } } }, [e._v(e._s(t.label))]);
        }))]);
      }, staticRenderFns: [], props: ["crumbs", "onClick"], methods: { truncateCrumbs: function truncateCrumbs(e) {
          var t = [e[0]],
              i = e.filter(function (t, i) {
            return i >= e.length - 2;
          });return t.push.apply(t, [{ path: "", label: "..." }].concat(pn(i))), t;
        }, handleClick: function handleClick(e) {
          e.path && e.label && this.onClick(e);
        } } },
        $s = { render: function render() {
        var e = this,
            t = e.$createElement;return (e._self._c || t)("div", { staticClass: "fsp-loading" });
      }, staticRenderFns: [] },
        Us = function Us(e) {
      var t = null == e ? 0 : e.length;return t ? e[t - 1] : void 0;
    },
        Ms = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fsp-cloud", class: { "fsp-content--selected-items": e.filesWaiting.length } }, [e.cloudLoading || e.isPrefetching ? i("loading") : e._e(), e.currentCloudAuthorized !== !0 ? i("div", { staticClass: "fsp-source-auth__wrapper" }, [i("span", { staticClass: "fsp-icon-auth fsp-icon fsp-source-auth__el", class: "fsp-icon--" + e.currentCloudName }), i("div", { staticClass: "fsp-text__title fsp-source-auth__el" }, [e._v(e._s(e.t("Select Files from")) + " " + e._s(e.currentDisplay.label))]), i("div", { staticClass: "fsp-source-auth__el" }, [i("span", { staticClass: "fsp-text__subheader" }, [e._v(e._s(e.t("You need to authenticate with ")) + " "), i("span", { staticClass: "fsp-cloudname" }, [e._v(e._s(e.currentDisplay.label))]), e._v(". " + e._s(e.t("We only extract images and never modify or delete them.")))])]), i("button", { staticClass: "fsp-button__auth fsp-source-auth__el", attrs: { type: "button" }, on: { click: e.authorize } }, [e._v(e._s(e.t("Connect")) + " "), i("span", { staticClass: "fsp-cloudname" }, [e._v(e._s(e.currentDisplay.label))])]), i("div", { staticClass: "fsp-source-auth__el" }, [i("span", { staticClass: "fsp-text__subheader" }, [e._v(e._s(e.t("A new page will open to connect your account.")))])])]) : e._e(), e.currentCloudAuthorized === !0 ? i("div", [e.currentCrumbs.length > 1 ? i("div", { staticClass: "fsp-cloud-breadcrumbs" }, [i("breadcrumbs", { attrs: { crumbs: e.currentCrumbs, "on-click": e.updatePath } })], 1) : e._e(), i("cloud-grid")], 1) : e._e()], 1);
      }, staticRenderFns: [], components: { CloudGrid: Is, Breadcrumbs: Ds, Loading: $s }, computed: fn({}, Hr.mapGetters(["route", "currentCloudAuthorized", "currentCloudName", "currentCloudPath", "listForCurrentCloudPath", "cloudFolders", "cloudLoading", "cloudsPrefetching", "filesWaiting"]), { isPrefetching: function isPrefetching() {
          var e = this.currentCloudPath,
              t = e.length > 0 ? Us(e) : e,
              i = this.currentCloudName + t;return this.cloudsPrefetching[i];
        }, currentDisplay: function currentDisplay() {
          return es(this.route[1]);
        }, currentCrumbs: function currentCrumbs() {
          var e = this,
              t = [{ label: this.currentDisplay.label, path: "root" }];return this.currentCloudPath.length ? t.concat(this.currentCloudPath.map(function (t) {
            return { label: e.cloudFolders[t].name, path: t };
          })) : t;
        } }), methods: fn({}, Hr.mapActions(["showCloudPath"]), { authorize: function authorize() {
          var e = this,
              t = window.open(this.currentCloudAuthorized.authUrl, "_blank");!function i() {
            t.closed !== !0 ? setTimeout(i, 10) : e.showCloudPath({ name: e.route[1], path: e.route[2] });
          }();
        }, updatePath: function updatePath(e) {
          var t = this.currentCloudPath.indexOf(e.path),
              i = this.currentCloudPath.filter(function (e, i) {
            return i <= t;
          }),
              n = ["source", this.currentCloudName];"root" === e.path ? this.$store.commit("CHANGE_ROUTE", n) : (n.push(i), this.$store.commit("CHANGE_ROUTE", n));
        } }), watch: { route: { deep: !0, immediate: !0, handler: function handler(e) {
            var t = e[1],
                i = e[2];this.showCloudPath({ name: t, path: i });
          } } } },
        Ps = function Ps(e) {
      return new RegExp("Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile", "i").test(e);
    },
        zs = function zs(e) {
      return JSON.parse(JSON.stringify(e));
    },
        js = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fsp-mobile-menu", on: { click: function click(t) {
              e.toggleNav();
            } } }, [i("div", { staticClass: "fsp-nav__menu-toggle" })]);
      }, staticRenderFns: [], computed: fn({}, Hr.mapGetters(["mobileNavActive", "route"]), { hideLocalOnMobile: function hideLocalOnMobile() {
          var e = zs(this.route),
              t = e.pop();return !(!Ps(navigator.userAgent) || t.indexOf("local_file_system") === -1) || !this.mobileNavActive;
        } }), methods: fn({}, Hr.mapActions(["updateMobileNavActive"]), { toggleNav: function toggleNav() {
          this.updateMobileNavActive(this.hideLocalOnMobile);
        } }) },
        Vs = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fsp-header", class: { "fsp-hide-header": e.hideHeader } }, [e.sourceName && !e.mobileNavActive ? i("span", { staticClass: "fsp-header-icon", class: "fsp-navbar--" + e.sourceName }) : e._e(), e._v(" "), e.mobileNavActive ? i("span", { staticClass: "fsp-header-text" }, [e._v(e._s(e.t("Select From")))]) : e._e(), e._t("default"), i("mobile-menu-button")], 2);
      }, staticRenderFns: [], computed: fn({}, Hr.mapGetters(["mobileNavActive"])), components: { MobileMenuButton: js }, props: ["sourceName", "hideHeader"] },
        Gs = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fsp-footer", class: { "fsp-footer--appeared": e.isVisible } }, [i("div", { staticClass: "fsp-nav" }, [i("span", { staticClass: "fsp-nav__left" }, [e._t("nav-left")], 2), i("span", { staticClass: "fsp-nav__center" }, [e._t("nav-center")], 2), i("span", { staticClass: "fsp-nav__right" }, [e._t("nav-right")], 2)])]);
      }, staticRenderFns: [], props: ["isVisible"] },
        Ws = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fsp-image-search", class: { "fsp-image-search--results": e.resultsFound } }, [i("div", { staticClass: "fsp-image-search__form-container" }, [i("form", { staticClass: "fsp-image-search__form", on: { submit: function submit(t) {
              t.preventDefault(), e.focusAndFetch(t);
            } } }, [i("input", { ref: "searchInput", staticClass: "fsp-image-search__input", attrs: { placeholder: e.placeholderText, disabled: e.isSearching }, domProps: { value: e.imageSearchInput }, on: { input: e.updateInput } }), e._v(" "), e.imageSearchInput === e.imageSearchName ? i("button", { staticClass: "fsp-image-search__submit", on: { click: function click(t) {
              t.preventDefault(), e.clearSearch(t);
            } } }, [i("span", { staticClass: "fsp-image-search__icon--reset" })]) : e._e(), e._v(" "), e.imageSearchInput !== e.imageSearchName ? i("button", { staticClass: "fsp-image-search__submit", attrs: { type: "submit" } }, [i("span", { class: { "fsp-image-search__icon--search": !0, "fsp-image-search__icon--searching": e.isSearching } })]) : e._e()])]), i("div", { staticClass: "fsp-image-search__results", class: { "fsp-content--selected-items": e.filesWaiting.length } }, [i("image-array", { attrs: { images: e.imageSearchResults } })], 1)]);
      }, staticRenderFns: [], components: { ImageArray: xs }, computed: fn({}, Hr.mapGetters(["isSearching", "noResultsFound", "resultsFound", "imageSearchName", "imageSearchInput", "imageSearchResults", "filesWaiting"]), { placeholderText: function placeholderText() {
          return this.t("Search images") + "...";
        } }), methods: fn({}, Hr.mapActions(["updateSearchInput", "fetchImages"]), { focusAndFetch: function focusAndFetch() {
          this.fetchImages(), this.$refs.searchInput.focus();
        }, updateInput: function updateInput(e) {
          this.updateSearchInput(e.target.value);
        }, clearSearch: function clearSearch() {
          this.updateSearchInput(""), this.$refs.searchInput.focus();
        } }) },
        Hs = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fsp-select-labels", class: { active: e.selectLabelIsActive } }, [i("div", { staticClass: "fsp-drop-area__title fsp-text__title" }, [e._v(e._s(e.t("Select Files to Upload")))]), i("div", { staticClass: "fsp-drop-area__subtitle fsp-text__subheader" }, [e._v(e._s(e.t("or Drag and Drop, Copy and Paste Files")))])]);
      }, staticRenderFns: [], computed: fn({}, Hr.mapGetters(["selectLabelIsActive"])) },
        Bs = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", [i("div", { ref: "dropArea", staticClass: "fsp-drop-area", on: { click: e.openSelectFile } }, [i("select-files-label"), i("input", { ref: "fileUploadInput", staticClass: "fsp-local-source__fileinput", attrs: { type: "file", id: "fsp-fileUpload", accept: e.acceptStr, multiple: e.multiple, disabled: !e.canAddMoreFiles }, on: { change: function change(t) {
              e.onFilesSelected(t);
            }, click: function click(t) {
              e.clearEvent(t);
            } } })], 1)]);
      }, staticRenderFns: [], components: { SelectFilesLabel: Hs }, computed: fn({}, Hr.mapGetters(["accept", "canAddMoreFiles", "maxFiles"]), { acceptStr: function acceptStr() {
          if (this.accept) return this.accept.join(",");
        }, multiple: function multiple() {
          return this.maxFiles > 1;
        } }), methods: fn({}, Hr.mapActions(["addFile", "updateSelectLabelActive"]), { clearEvent: function clearEvent(e) {
          e.target.value = null;
        }, onMouseover: function onMouseover() {
          this.updateSelectLabelActive(!0);
        }, onMouseout: function onMouseout() {
          this.updateSelectLabelActive(!1);
        }, onFilesSelected: function onFilesSelected(e) {
          for (var t = e.target.files, i = 0; i < t.length; i += 1) {
            this.addFile(t[i]);
          }
        }, openSelectFile: function openSelectFile() {
          this.$refs.fileUploadInput.click();
        } }), mounted: function mounted() {
        var e = this.$refs.dropArea;e.addEventListener("mouseover", this.onMouseover), e.addEventListener("mouseout", this.onMouseout);
      } },
        Ys = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fsp-source-list__item", class: { active: e.isSelectedSource, hidden: e.isHidden, disabled: e.uploadStarted }, on: { click: function click(t) {
              e.onNavClick(e.sourceName);
            } } }, [e.sourceSelectedCount(e.filesWaiting) ? i("span", { staticClass: "fsp-badge--source" }, [e._v(e._s(e.sourceSelectedCount(e.filesWaiting)))]) : e._e(), e._v(" "), i("span", { staticClass: "fsp-source-list__icon fsp-icon", class: "fsp-icon--" + e.sourceName }), e._v(" "), i("span", { staticClass: "fsp-source-list__label" }, [e._v(e._s(e.sourceLabel))]), e._v(" "), e.isAuthorized ? i("span", { staticClass: "fsp-source-list__logout", on: { click: function click(t) {
              t.stopPropagation(), e.logout(e.sourceName);
            } } }, [e._v(e._s(e.t("Sign Out")))]) : e._e(), e._v(" "), e.isMobileLocal ? i("input", { ref: "mobileLocaInput", staticClass: "fsp-local-source__fileinput", attrs: { type: "file" }, on: { change: function change(t) {
              e.onFilesSelected(t);
            } } }) : e._e()]);
      }, staticRenderFns: [], props: ["sourceName", "sourceLabel", "isHidden"], computed: fn({}, Hr.mapGetters(["filesWaiting", "route", "uploadStarted", "cloudsAuthorized", "mobileNavActive", "maxFiles", "accept"]), { isSelectedSource: function isSelectedSource() {
          return "summary" !== this.route[0] && (this.route.length > 1 ? this.route[1] : "local_file_system") === this.sourceName;
        }, isAuthorized: function isAuthorized() {
          return this.cloudsAuthorized[this.sourceName];
        }, isMobileLocal: function isMobileLocal() {
          return this.mobileNavActive && "local_file_system" === this.sourceName;
        } }), methods: fn({}, Hr.mapActions(["updateMobileNavActive", "addFile", "logout"]), { onNavClick: function onNavClick(e) {
          this.isMobileLocal ? this.openSelectFile() : (this.updateMobileNavActive(!1), this.$store.commit("CHANGE_ROUTE", ["source", e]));
        }, sourceSelectedCount: function sourceSelectedCount(e) {
          var t = this;return e.filter(function (e) {
            return e.source === t.sourceName;
          }).length;
        }, openSelectFile: function openSelectFile() {
          this.$refs.mobileLocaInput.click();
        }, onFilesSelected: function onFilesSelected(e) {
          for (var t = e.target.files, i = 0; i < t.length; i += 1) {
            this.addFile(t[i]);
          }
        } }) },
        Xs = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fsp-modal__sidebar", class: { "fsp-mobile-nav-active": e.mobileNavActive } }, [i("div", { staticClass: "fsp-source-list" }, [e._l(e.paginatedSources, function (e) {
          return i("source-nav-item", { key: e.name, attrs: { "is-hidden": e.isHidden, "source-name": e.name, "source-label": e.label } });
        }), e.fromSources.length > this.offset + 1 ? i("div", { staticClass: "fsp-source-list__item fsp-source-list__more", on: { click: e.updateIndex } }, [i("span", { staticClass: "fsp-source-list__icon fsp-source-list__more-icon" }), e._v(" "), i("span", { staticClass: "fsp-source-list__label" }, [e._v("More")])]) : e._e()], 2)]);
      }, staticRenderFns: [], components: { SourceNavItem: Ys }, computed: fn({}, Hr.mapGetters(["fromSources", "mobileNavActive"]), { paginatedSources: function paginatedSources() {
          var e = this;return this.fromSources.map(function (t, i) {
            return i >= e.index && i <= e.index + e.offset ? t : fn({}, t, { isHidden: !0 });
          });
        } }), data: function data() {
        return { offset: 7, index: 0 };
      }, methods: { updateIndex: function updateIndex() {
          this.paginatedSources.filter(function (e) {
            return !e.isHidden;
          }).length <= this.offset ? this.index = 0 : this.index = this.index + (this.offset + 1);
        } } },
        qs = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fsp-picker" }, [i("close-button"), i("div", { staticClass: "fsp-modal" }, [i("sidebar"), i("div", { staticClass: "fsp-modal__body" }, [i("div", { staticClass: "fsp-container" }, [e.isInsideCloudFolder ? i("div", { staticClass: "fsp-summary__go-back", attrs: { title: "Go back" }, on: { click: e.goBack } }) : e._e(), i("content-header", { attrs: { "source-name": e.currentSource.name, "hide-header": e.showsHeaderIcon } }), i("div", { staticClass: "fsp-content" }, ["local" === e.currentSource.ui ? i("local") : e._e(), "cloud" === e.currentSource.ui ? i("cloud") : e._e(), "imagesearch" === e.currentSource.ui ? i("image-search") : e._e()], 1)], 1), i("footer-nav", { attrs: { "is-visible": e.filesWaiting.length > 0 } }, [i("span", { staticClass: "fsp-footer-text", slot: "nav-left" }, [e._v(e._s(e.t("Selected Files")) + ": " + e._s(e.filesWaiting.length))]), e._v(" "), e.canStartUpload || 0 === e.filesWaiting.length ? e._e() : i("span", { slot: "nav-center" }, [e._v(e._s(e.getMinFilesMessage) + " ")]), i("span", { staticClass: "fsp-button fsp-button--primary", class: { "fsp-button--disabled": !e.canStartUpload }, attrs: { title: "Next" }, on: { click: e.goToSummary }, slot: "nav-right" }, [e._v(e._s(e.t("View/Edit Selected")))])])], 1)], 1), e._m(0)], 1);
      }, staticRenderFns: [function () {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fsp-picker__footer" }, [e._v("Powered by "), i("span", { staticClass: "fsp-icon--filestack" }), e._v(" Filestack")]);
      }], components: { CloseButton: ts, Cloud: Ms, ContentHeader: Vs, FooterNav: Gs, ImageSearch: Ws, Local: Bs, Sidebar: Xs }, computed: fn({}, Hr.mapGetters(["route", "filesWaiting", "cloudLoading", "currentCloudPath", "currentCloudAuthorized", "minFiles", "canStartUpload", "filesNeededCount", "mobileNavActive"]), { currentSource: function currentSource() {
          return es(this.route[1]);
        }, getMinFilesMessage: function getMinFilesMessage() {
          return 1 === this.filesNeededCount ? this.t("Add") + " 1 " + this.t("more file") : this.filesNeededCount > 1 ? this.t("Add") + " " + this.filesNeededCount + " " + this.t("more files") : null;
        }, showsHeaderIcon: function showsHeaderIcon() {
          return "imagesearch" !== this.currentSource.ui && "source-url" !== this.currentSource.ui && ("local" === this.currentSource.ui || this.currentCloudAuthorized !== !0);
        }, isInsideCloudFolder: function isInsideCloudFolder() {
          return "cloud" === this.currentSource.ui && void 0 !== this.currentCloudPath && 0 !== this.currentCloudPath.length && !this.mobileNavActive;
        } }), methods: fn({}, Hr.mapActions(["deselectAllFiles", "goBack", "updateMobileNavActive"]), { goToSummary: function goToSummary() {
          this.canStartUpload && (this.$store.commit("CHANGE_ROUTE", ["summary"]), this.updateMobileNavActive(!1));
        } }) },
        Ks = "Expected a function",
        Zs = NaN,
        Qs = "[object Symbol]",
        Js = /^\s+|\s+$/g,
        ea = /^[-+]0x[0-9a-f]+$/i,
        ta = /^0b[01]+$/i,
        ia = /^0o[0-7]+$/i,
        na = parseInt,
        oa = "object" == un(Sr) && Sr && Sr.Object === Object && Sr,
        ra = "object" == ("undefined" == typeof self ? "undefined" : un(self)) && self && self.Object === Object && self,
        sa = oa || ra || Function("return this")(),
        aa = Object.prototype,
        la = aa.toString,
        ca = Math.max,
        ua = Math.min,
        da = function da() {
      return sa.Date.now();
    },
        fa = tn,
        pa = Ar.context("transformer"),
        ma = function ma(e) {
      return e + "px";
    },
        ha = { topLeftX: "bottomRightX", topLeftY: "bottomRightY", bottomRightX: "topLeftX", bottomRightY: "topLeftY" },
        va = function va(e, t, i, n) {
      var o = e.imageNaturalWidth / (t.imageWidth - t.imageX),
          r = e.imageNaturalHeight / (t.imageHeight - t.imageY),
          s = { x: Math.round((i.topLeftX - t.imageX) * o), y: Math.round((i.topLeftY - t.imageY) * r), width: Math.round((i.bottomRightX - i.topLeftX) * o), height: Math.round((i.bottomRightY - i.topLeftY) * r) };i.topLeftX === t.imageX && i.topLeftY === t.imageY && i.bottomRightX === t.imageWidth && i.bottomRightY === t.imageHeight ? n.commit("REMOVE_TRANSFORMATION", "crop") : n.commit("SET_TRANSFORMATION", { type: "crop", options: { dim: s } });
    },
        ga = fa(function (e, t, i, n) {
      return va(e, t, i, n);
    }, 500),
        _a = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", [i("div", { directives: [{ name: "show", rawName: "v-show", value: !e.cachedCropRectangle && !e.imageLoading, expression: "!cachedCropRectangle && !imageLoading" }], staticStyle: { position: "absolute", top: "0", left: "0" } }, [i("div", { ref: "cropArea", staticClass: "fst-crop__area", style: e.cropAreaStyle }, [i("div", { staticClass: "fst-crop__area-line--right" }), i("div", { staticClass: "fst-crop__area-line--left" }), i("div", { staticClass: "fst-crop__area-line--top" }), i("div", { staticClass: "fst-crop__area-line--bottom" })]), i("div", { ref: "topLeftMarker", staticClass: "fst-crop__marker fst-crop__marker--top-left", style: e.topLeftStyle }), i("div", { ref: "topRightMarker", staticClass: "fst-crop__marker fst-crop__marker--top-right", style: e.topRightStyle }), i("div", { ref: "bottomLeftMarker", staticClass: "fst-crop__marker fst-crop__marker--bottom-left", style: e.bottomLeftStyle }), i("div", { ref: "bottomRightMarker", staticClass: "fst-crop__marker fst-crop__marker--bottom-right", style: e.bottomRightStyle })]), !e.imageLoading && e.cachedCropRectangle ? i("div", { staticClass: "fst-options-bar" }, [i("div", { staticClass: "fst-options__option" }, [i("div", { staticClass: "fst-button fst-button--cancel", staticStyle: { "font-weight": "500" }, on: { click: e.undoCrop } }, [e._v("Undo Crop")])])]) : e._e()]);
      }, staticRenderFns: [], props: { imageWidth: Number, imageHeight: Number, imageX: Number, imageY: Number }, data: function data() {
        return { cropRectangle: { topLeftX: 0, topLeftY: 0, bottomRightX: 0, bottomRightY: 0 } };
      }, computed: fn({}, Hr.mapGetters(["imageNaturalWidth", "imageNaturalHeight", "cachedCropRectangle", "imageLoading"]), { aspectRatio: function aspectRatio() {
          return this.$store.getters.cropAspectRatio;
        }, topLeftStyle: function topLeftStyle() {
          var e = this.$refs.topLeftMarker && this.$refs.topLeftMarker.getBoundingClientRect().width / 2,
              t = this.cropRectangle.topLeftX - e;return { top: ma(this.cropRectangle.topLeftY - e), left: ma(t) };
        }, topRightStyle: function topRightStyle() {
          var e = this.$refs.topRightMarker && this.$refs.topRightMarker.getBoundingClientRect().width / 2,
              t = this.cropRectangle.bottomRightX - e;return { top: ma(this.cropRectangle.topLeftY - e), left: ma(t) };
        }, bottomLeftStyle: function bottomLeftStyle() {
          var e = this.$refs.bottomLeftMarker && this.$refs.bottomLeftMarker.getBoundingClientRect().width / 2,
              t = this.cropRectangle.topLeftX - e;return { top: ma(this.cropRectangle.bottomRightY - e), left: ma(t) };
        }, bottomRightStyle: function bottomRightStyle() {
          var e = this.$refs.bottomRightMarker && this.$refs.bottomRightMarker.getBoundingClientRect().width / 2,
              t = this.cropRectangle.bottomRightX - e;return { top: ma(this.cropRectangle.bottomRightY - e), left: ma(t) };
        }, cropAreaStyle: function cropAreaStyle() {
          var e = this.cropRectangle.topLeftX,
              t = this.cropRectangle.topLeftY,
              i = this.cropRectangle.bottomRightX - this.cropRectangle.topLeftX,
              n = this.cropRectangle.bottomRightY - this.cropRectangle.topLeftY;return { left: ma(e), top: ma(t), width: ma(i), height: ma(n) };
        } }), watch: { imageLoading: { handler: function handler(e) {
            var t = this;e || this.cachedCropRectangle || this.$nextTick(function () {
              t.addMarkerBehaviour(t.$refs.topLeftMarker, "topLeftX", "topLeftY"), t.addMarkerBehaviour(t.$refs.topRightMarker, "bottomRightX", "topLeftY"), t.addMarkerBehaviour(t.$refs.bottomLeftMarker, "topLeftX", "bottomRightY"), t.addMarkerBehaviour(t.$refs.bottomRightMarker, "bottomRightX", "bottomRightY"), t.addMoveSelectionBehaviour(), t.initialize();
            });
          } }, cropRectangle: { deep: !0, handler: function handler() {
            ga({ imageNaturalWidth: this.imageNaturalWidth, imageNaturalHeight: this.imageNaturalHeight }, { imageWidth: this.imageWidth, imageHeight: this.imageHeight, imageX: this.imageX, imageY: this.imageY }, this.cropRectangle, this.$store);
          } } }, methods: fn({}, Hr.mapActions(["performTransformations"]), { calculateRectangleMaintainingAspectRatio: function calculateRectangleMaintainingAspectRatio(e, t) {
          var i = { w: e, h: e / this.aspectRatio },
              n = { w: t * this.aspectRatio, h: t };return Math.sqrt(i.w * i.w + i.h * i.h) < Math.sqrt(n.w * n.w + n.h * n.h) ? i : n;
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
        }, addMarkerBehaviour: function addMarkerBehaviour(e, t, i) {
          var n = this,
              o = function o(e) {
            e.preventDefault();var o = e.touches ? e.touches[0] : e,
                r = o.clientX - n.cropRectangle[t],
                s = o.clientY - n.cropRectangle[i],
                a = function a(e) {
              var o = e.touches ? e.touches[0] : e,
                  a = void 0,
                  l = void 0,
                  c = n.ensurePointWithinBoundsX(o.clientX - r, t),
                  u = n.ensurePointWithinBoundsY(o.clientY - s, i),
                  d = ha[t],
                  f = ha[i],
                  p = Math.abs(c - n.cropRectangle[d]),
                  m = Math.abs(u - n.cropRectangle[f]);p < 40 && (p = 40), m < 40 && (m = 40);var h = { w: p, h: m };void 0 !== n.aspectRatio && (h = n.calculateRectangleMaintainingAspectRatio(p, m)), a = c < n.cropRectangle[d] ? n.cropRectangle[d] - h.w : n.cropRectangle[d] + h.w, l = u < n.cropRectangle[f] ? n.cropRectangle[f] - h.h : n.cropRectangle[f] + h.h, n.cropRectangle[t] = a, n.cropRectangle[i] = l;
            },
                l = function e() {
              document.documentElement.removeEventListener("mousemove", a, !1), document.documentElement.removeEventListener("mouseup", e, !1), document.documentElement.removeEventListener("mouseleave", e, !1), document.documentElement.removeEventListener("touchmove", a, !1), document.documentElement.removeEventListener("touchend", e, !1), document.documentElement.removeEventListener("touchleave", e, !1);
            };document.documentElement.addEventListener("mousemove", a, !1), document.documentElement.addEventListener("mouseup", l, !1), document.documentElement.addEventListener("mouseleave", l, !1), document.documentElement.addEventListener("touchmove", a, !1), document.documentElement.addEventListener("touchend", l, !1), document.documentElement.addEventListener("touchleave", l, !1);
          };e.addEventListener("mousedown", o, !1), e.addEventListener("touchstart", o, !1);
        }, addMoveSelectionBehaviour: function addMoveSelectionBehaviour() {
          var e = this,
              t = function t(_t3) {
            _t3.preventDefault();var i = _t3.touches ? _t3.touches[0] : _t3,
                n = i.clientX - e.cropRectangle.topLeftX,
                o = i.clientY - e.cropRectangle.topLeftY,
                r = e.cropRectangle.bottomRightX - e.cropRectangle.topLeftX,
                s = e.cropRectangle.bottomRightY - e.cropRectangle.topLeftY,
                a = function a(t) {
              var i = t.touches ? t.touches[0] : t,
                  a = i.clientX - n,
                  l = i.clientY - o;a < e.imageX ? a = e.imageX : a + r > e.imageWidth && (a = e.imageWidth - r), l < e.imageY ? l = e.imageY : l + s > e.imageHeight && (l = e.imageHeight - s), e.cropRectangle.topLeftX = a, e.cropRectangle.topLeftY = l, e.cropRectangle.bottomRightX = a + r, e.cropRectangle.bottomRightY = l + s;
            },
                l = function e() {
              document.documentElement.removeEventListener("mousemove", a, !1), document.documentElement.removeEventListener("mouseup", e, !1), document.documentElement.removeEventListener("mouseleave", e, !1), document.documentElement.removeEventListener("touchmove", a, !1), document.documentElement.removeEventListener("touchend", e, !1), document.documentElement.removeEventListener("touchleave", e, !1);
            };document.documentElement.addEventListener("mousemove", a, !1), document.documentElement.addEventListener("mouseup", l, !1), document.documentElement.addEventListener("mouseleave", l, !1), document.documentElement.addEventListener("touchmove", a, !1), document.documentElement.addEventListener("touchend", l, !1), document.documentElement.addEventListener("touchleave", l, !1);
          };this.$refs.cropArea.addEventListener("mousedown", t, !1), this.$refs.cropArea.addEventListener("touchstart", t, !1);
        }, initialize: function initialize() {
          if (void 0 !== this.aspectRatio) {
            var e = this.calculateRectangleMaintainingAspectRatio(this.imageWidth - this.imageX, this.imageHeight - this.imageY);this.cropRectangle.topLeftX = (this.imageWidth + this.imageX - e.w) / 2, this.cropRectangle.topLeftY = (this.imageHeight + this.imageY - e.h) / 2, this.cropRectangle.bottomRightX = this.cropRectangle.topLeftX + e.w, this.cropRectangle.bottomRightY = this.cropRectangle.topLeftY + e.h;
          } else this.cropRectangle.topLeftX = this.imageX, this.cropRectangle.topLeftY = this.imageY, this.cropRectangle.bottomRightX = this.imageWidth, this.cropRectangle.bottomRightY = this.imageHeight, pa("crop initialized", this.cropRectangle);
        }, undoCrop: function undoCrop() {
          this.$store.commit("SET_CROP_RECTANGLE", null), this.$store.commit("REMOVE_TRANSFORMATION", "crop"), this.performTransformations();
        } }), mounted: function mounted() {
        pa("crop mounted"), this.imageLoading || this.cachedCropRectangle || (this.addMarkerBehaviour(this.$refs.topLeftMarker, "topLeftX", "topLeftY"), this.addMarkerBehaviour(this.$refs.topRightMarker, "bottomRightX", "topLeftY"), this.addMarkerBehaviour(this.$refs.bottomLeftMarker, "topLeftX", "bottomRightY"), this.addMarkerBehaviour(this.$refs.bottomRightMarker, "bottomRightX", "bottomRightY"), this.addMoveSelectionBehaviour(), this.initialize());
      }, destroyed: function destroyed() {
        this.performTransformations();
      } },
        ya = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fst-options-bar" }, [i("div", { staticClass: "fst-options__option" }, [i("div", { staticClass: "fst-radio-check-container" }, [i("label", { attrs: { for: "on" } }, [e._v("On:")]), i("input", { directives: [{ name: "model", rawName: "v-model", value: e.on, expression: "on" }], attrs: { id: "on", type: "radio", value: "true" }, domProps: { checked: e._q(e.on, "true") }, on: { change: e.applyTransform, __c: function __c(t) {
              e.on = "true";
            } } }), i("div", { staticClass: "fst-radio-check" })]), i("div", { staticClass: "fst-radio-check-container" }, [i("label", { attrs: { for: "off" } }, [e._v("Off:")]), i("input", { directives: [{ name: "model", rawName: "v-model", value: e.on, expression: "on" }], attrs: { id: "off", type: "radio", value: "false" }, domProps: { checked: e._q(e.on, "false") }, on: { change: e.applyTransform, __c: function __c(t) {
              e.on = "false";
            } } }), i("div", { staticClass: "fst-radio-check" })])])]);
      }, staticRenderFns: [], computed: fn({}, Hr.mapGetters(["transformations"])), data: function data() {
        return { on: !1 };
      }, methods: fn({}, Hr.mapActions(["performTransformations"]), { applyTransform: function applyTransform() {
          "true" !== this.on ? this.$store.commit("REMOVE_TRANSFORMATION", "circle") : this.$store.commit("SET_TRANSFORMATION", { type: "circle", options: {} }), this.performTransformations();
        } }), mounted: function mounted() {
        this.on = !!this.transformations.circle || !1;
      } },
        ba = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { directives: [{ name: "show", rawName: "v-show", value: e.show, expression: "show" }], ref: "wrap", class: ["vue-slider-wrap", e.flowDirection, e.disabledClass], style: e.wrapStyles, on: { click: e.wrapClick } }, [i("div", { ref: "elem", staticClass: "vue-slider", style: [e.elemStyles, e.bgStyle] }, [e.isMoblie ? [e.isRange ? [i("div", { ref: "dot0", class: [e.tooltipStatus, "vue-slider-dot"], style: [e.sliderStyles[0], e.dotStyles], on: { touchstart: function touchstart(t) {
              e.moveStart(0);
            } } }, [i("span", { class: ["vue-slider-tooltip-" + e.tooltipDirection[0], "vue-slider-tooltip"], style: e.tooltipStyles[0] }, [e._v(e._s(e.formatter ? e.formatting(e.val[0]) : e.val[0]))])]), i("div", { ref: "dot1", class: [e.tooltipStatus, "vue-slider-dot"], style: [e.sliderStyles[1], e.dotStyles], on: { touchstart: function touchstart(t) {
              e.moveStart(1);
            } } }, [i("span", { class: ["vue-slider-tooltip-" + e.tooltipDirection[1], "vue-slider-tooltip"], style: e.tooltipStyles[1] }, [e._v(e._s(e.formatter ? e.formatting(e.val[1]) : e.val[1]))])])] : [i("div", { ref: "dot", class: [e.tooltipStatus, "vue-slider-dot"], style: [e.sliderStyles, e.dotStyles], on: { touchstart: e.moveStart } }, [i("span", { class: ["vue-slider-tooltip-" + e.tooltipDirection, "vue-slider-tooltip"], style: e.tooltipStyles }, [e._v(e._s(e.formatter ? e.formatting(e.val) : e.val))])])]] : [e.isRange ? [i("div", { ref: "dot0", class: [e.tooltipStatus, "vue-slider-dot"], style: [e.sliderStyles[0], e.dotStyles], on: { mousedown: function mousedown(t) {
              e.moveStart(0);
            } } }, [i("span", { class: ["vue-slider-tooltip-" + e.tooltipDirection[0], "vue-slider-tooltip"], style: e.tooltipStyles[0] }, [e._v(e._s(e.formatter ? e.formatting(e.val[0]) : e.val[0]))])]), i("div", { ref: "dot1", class: [e.tooltipStatus, "vue-slider-dot"], style: [e.sliderStyles[1], e.dotStyles], on: { mousedown: function mousedown(t) {
              e.moveStart(1);
            } } }, [i("span", { class: ["vue-slider-tooltip-" + e.tooltipDirection[1], "vue-slider-tooltip"], style: e.tooltipStyles[1] }, [e._v(e._s(e.formatter ? e.formatting(e.val[1]) : e.val[1]))])])] : [i("div", { ref: "dot", class: [e.tooltipStatus, "vue-slider-dot"], style: [e.sliderStyles, e.dotStyles], on: { mousedown: e.moveStart } }, [i("span", { class: ["vue-slider-tooltip-" + e.tooltipDirection, "vue-slider-tooltip"], style: e.tooltipStyles }, [e._v(e._s(e.formatter ? e.formatting(e.val) : e.val))])])]], e.piecewise ? [i("ul", { staticClass: "vue-slider-piecewise" }, e._l(e.piecewiseDotPos, function (t) {
          return i("li", { style: [e.piecewiseStyles, e.piecewiseStyle, t] });
        }))] : e._e(), i("div", { ref: "process", staticClass: "vue-slider-process", style: e.processStyle })], 2)]);
      }, staticRenderFns: [], data: function data() {
        return { flag: !1, size: 0, currentValue: 0, currentSlider: 0 };
      }, props: { width: { type: [Number, String], default: "auto" }, height: { type: [Number, String], default: 6 }, data: { type: Array, default: null }, dotSize: { type: Number, default: 16 }, min: { type: Number, default: 0 }, max: { type: Number, default: 100 }, interval: { type: Number, default: 1 }, show: { type: Boolean, default: !0 }, disabled: { type: Boolean, default: !1 }, piecewise: { type: Boolean, default: !1 }, tooltip: { type: [String, Boolean], default: "always" }, eventType: { type: String, default: "auto" }, direction: { type: String, default: "horizontal" }, reverse: { type: Boolean, default: !1 }, lazy: { type: Boolean, default: !1 }, clickable: { type: Boolean, default: !0 }, speed: { type: Number, default: .5 }, realTime: { type: Boolean, default: !1 }, value: { type: [String, Number, Array], default: 0 }, sliderStyle: [Array, Object], tooltipDir: [Array, String], formatter: [String, Function], piecewiseStyle: Object, processStyle: Object, bgStyle: Object, tooltipStyle: [Array, Object] }, computed: { flowDirection: function flowDirection() {
          return "vue-slider-" + this.direction + (this.reverse ? "-reverse" : "");
        }, tooltipDirection: function tooltipDirection() {
          var e = this.tooltipDir || ("vertical" === this.direction ? "left" : "top");return Array.isArray(e) ? this.isRange ? e : e[1] : this.isRange ? [e, e] : e;
        }, tooltipStatus: function tooltipStatus() {
          return "hover" === this.tooltip && this.flag ? "vue-slider-always" : this.tooltip ? "vue-slider-" + this.tooltip : "";
        }, tooltipClass: function tooltipClass() {
          return ["vue-slider-tooltip-" + this.tooltipDirection, "vue-slider-tooltip"];
        }, isMoblie: function isMoblie() {
          return "touch" === this.eventType || "mouse" !== this.eventType && /(iPhone|iPad|iPod|iOS|Android|SymbianOS|Windows Phone|Mobile)/i.test(navigator.userAgent);
        }, isDisabled: function isDisabled() {
          return "none" === this.eventType || this.disabled;
        }, disabledClass: function disabledClass() {
          return this.disabled ? "vue-slider-disabled" : "";
        }, isRange: function isRange() {
          return Array.isArray(this.value);
        }, slider: function slider() {
          return this.isRange ? [this.$refs.dot0, this.$refs.dot1] : this.$refs.dot;
        }, minimum: function minimum() {
          return this.data ? 0 : this.min;
        }, val: { get: function get$$1() {
            return this.data ? this.isRange ? [this.data[this.currentValue[0]], this.data[this.currentValue[1]]] : this.data[this.currentValue] : this.currentValue;
          }, set: function set$$1(e) {
            if (this.data) {
              if (this.isRange) {
                var t = this.data.indexOf(e[0]),
                    i = this.data.indexOf(e[1]);t > -1 && i > -1 && (this.currentValue = [t, i]);
              } else {
                var n = this.data.indexOf(e);n > -1 && (this.currentValue = n);
              }
            } else this.currentValue = e;
          } }, maximum: function maximum() {
          return this.data ? this.data.length - 1 : this.max;
        }, multiple: function multiple() {
          var e = ("" + this.interval).split(".")[1];return e ? Math.pow(10, e.length) : 1;
        }, spacing: function spacing() {
          return this.data ? 1 : this.interval;
        }, total: function total() {
          return this.data ? this.data.length - 1 : (~~((this.maximum - this.minimum) * this.multiple) % (this.interval * this.multiple) != 0 && console.error("[Vue-slider warn]: Prop[interval] is illegal, Please make sure that the interval can be divisible"), (this.maximum - this.minimum) / this.interval);
        }, gap: function gap() {
          return this.size / this.total;
        }, position: function position() {
          return this.isRange ? [(this.currentValue[0] - this.minimum) / this.spacing * this.gap, (this.currentValue[1] - this.minimum) / this.spacing * this.gap] : (this.currentValue - this.minimum) / this.spacing * this.gap;
        }, limit: function limit() {
          return this.isRange ? [[0, this.position[1]], [this.position[0], this.size]] : [0, this.size];
        }, valueLimit: function valueLimit() {
          return this.isRange ? [[this.minimum, this.currentValue[1]], [this.currentValue[0], this.maximum]] : [this.minimum, this.maximum];
        }, wrapStyles: function wrapStyles() {
          return "vertical" === this.direction ? { height: "number" == typeof this.height ? this.height + "px" : this.height, padding: this.dotSize / 2 + "px" } : { width: "number" == typeof this.width ? this.width + "px" : this.width, padding: this.dotSize / 2 + "px" };
        }, sliderStyles: function sliderStyles() {
          return Array.isArray(this.sliderStyle) ? this.isRange ? this.sliderStyle : this.sliderStyle[1] : this.isRange ? [this.sliderStyle, this.sliderStyle] : this.sliderStyle;
        }, tooltipStyles: function tooltipStyles() {
          return Array.isArray(this.tooltipStyle) ? this.isRange ? this.tooltipStyle : this.tooltipStyle[1] : this.isRange ? [this.tooltipStyle, this.tooltipStyle] : this.tooltipStyle;
        }, elemStyles: function elemStyles() {
          return "vertical" === this.direction ? { width: this.width + "px", height: "100%" } : { height: this.height + "px" };
        }, dotStyles: function dotStyles() {
          return "vertical" === this.direction ? { width: this.dotSize + "px", height: this.dotSize + "px", left: -(this.dotSize - this.width) / 2 + "px" } : { width: this.dotSize + "px", height: this.dotSize + "px", top: -(this.dotSize - this.height) / 2 + "px" };
        }, piecewiseStyles: function piecewiseStyles() {
          return "vertical" === this.direction ? { width: this.width + "px", height: this.width + "px" } : { width: this.height + "px", height: this.height + "px" };
        }, piecewiseDotPos: function piecewiseDotPos() {
          for (var e = [], t = 1; t < this.total; t++) {
            e.push("vertical" === this.direction ? { bottom: this.gap * t - this.width / 2 + "px", left: "0" } : { left: this.gap * t - this.height / 2 + "px", top: "0" });
          }return e;
        } }, watch: { value: function value(e) {
          this.flag || this.setValue(e);
        }, show: function show(e) {
          var t = this;e && !this.size && this.$nextTick(function () {
            t.refresh();
          });
        } }, methods: { bindEvents: function bindEvents() {
          this.isMoblie ? (document.addEventListener("touchmove", this.moving), document.addEventListener("touchend", this.moveEnd)) : (document.addEventListener("mousemove", this.moving), document.addEventListener("mouseup", this.moveEnd), document.addEventListener("mouseleave", this.moveEnd));
        }, unbindEvents: function unbindEvents() {
          window.removeEventListener("resize", this.refresh), this.isMoblie ? (document.removeEventListener("touchmove", this.moving), document.removeEventListener("touchend", this.moveEnd)) : (document.removeEventListener("mousemove", this.moving), document.removeEventListener("mouseup", this.moveEnd), document.removeEventListener("mouseleave", this.moveEnd));
        }, formatting: function formatting(e) {
          return "string" == typeof this.formatter ? this.formatter.replace(/\{value\}/, e) : this.formatter(e);
        }, getPos: function getPos(e) {
          return this.realTime && this.getStaticData(), "vertical" === this.direction ? this.reverse ? e.pageY - this.offset : this.size - (e.pageY - this.offset) : this.reverse ? this.size - (e.clientX - this.offset) : e.clientX - this.offset;
        }, wrapClick: function wrapClick(e) {
          if (this.isDisabled || !this.clickable) return !1;var t = this.getPos(e);this.isRange && (this.currentSlider = t > (this.position[1] - this.position[0]) / 2 + this.position[0] ? 1 : 0), this.setValueOnPos(t);
        }, moveStart: function moveStart(e) {
          if (this.isDisabled) return !1;this.isRange && (this.currentSlider = e), this.flag = !0, this.$emit("drag-start", this);
        }, moving: function moving(e) {
          if (!this.flag) return !1;e.preventDefault(), this.isMoblie && (e = e.targetTouches[0]), this.setValueOnPos(this.getPos(e), !0);
        }, moveEnd: function moveEnd(e) {
          if (!this.flag) return !1;this.$emit("drag-end", this), this.lazy && this.isDiff(this.val, this.value) && (this.$emit("callback", this.val), this.$emit("input", this.isRange ? this.val.slice() : this.val)), this.flag = !1, this.setPosition();
        }, setValueOnPos: function setValueOnPos(e, t) {
          var i = this.isRange ? this.limit[this.currentSlider] : this.limit,
              n = this.isRange ? this.valueLimit[this.currentSlider] : this.valueLimit;if (e >= i[0] && e <= i[1]) {
            this.setTransform(e);var o = (Math.round(e / this.gap) * (this.spacing * this.multiple) + this.minimum * this.multiple) / this.multiple;this.setCurrentValue(o, t);
          } else e < i[0] ? (this.setTransform(i[0]), this.setCurrentValue(n[0]), 1 === this.currentSlider && (this.currentSlider = 0)) : (this.setTransform(i[1]), this.setCurrentValue(n[1]), 0 === this.currentSlider && (this.currentSlider = 1));
        }, isDiff: function isDiff(e, t) {
          return Object.prototype.toString.call(e) !== Object.prototype.toString.call(t) || (Array.isArray(e) && e.length === t.length ? e.some(function (e, i) {
            return e !== t[i];
          }) : e !== t);
        }, setCurrentValue: function setCurrentValue(e, t) {
          if (e < this.minimum || e > this.maximum) return !1;this.isRange ? this.isDiff(this.currentValue[this.currentSlider], e) && (this.currentValue.splice(this.currentSlider, 1, e), this.lazy && this.flag || (this.$emit("callback", this.val), this.$emit("input", this.isRange ? this.val.slice() : this.val))) : this.isDiff(this.currentValue, e) && (this.currentValue = e, this.lazy && this.flag || (this.$emit("callback", this.val), this.$emit("input", this.isRange ? this.val.slice() : this.val))), t || this.setPosition();
        }, setIndex: function setIndex(e) {
          if (Array.isArray(e) && this.isRange) {
            var t = void 0;t = this.data ? [this.data[e[0]], this.data[e[1]]] : [this.spacing * e[0] + this.minimum, this.spacing * e[1] + this.minimum], this.setValue(t);
          } else e = this.spacing * e + this.minimum, this.isRange && (this.currentSlider = e > (this.currentValue[1] - this.currentValue[0]) / 2 + this.currentValue[0] ? 1 : 0), this.setCurrentValue(e);
        }, setValue: function setValue(e, t) {
          var i = this;this.isDiff(this.val, e) && (this.val = e, this.$emit("callback", this.val), this.$emit("input", this.isRange ? this.val.slice() : this.val)), this.$nextTick(function () {
            i.setPosition(t);
          });
        }, setPosition: function setPosition(e) {
          this.flag || this.setTransitionTime(void 0 === e ? this.speed : e), this.isRange ? (this.currentSlider = 0, this.setTransform(this.position[this.currentSlider]), this.currentSlider = 1, this.setTransform(this.position[this.currentSlider])) : this.setTransform(this.position), this.flag || this.setTransitionTime(0);
        }, setTransform: function setTransform(e) {
          var t = ("vertical" === this.direction ? this.dotSize / 2 - e : e - this.dotSize / 2) * (this.reverse ? -1 : 1),
              i = "vertical" === this.direction ? "translateY(" + t + "px)" : "translateX(" + t + "px)",
              n = (0 === this.currentSlider ? this.position[1] - e : e - this.position[0]) + "px",
              o = (0 === this.currentSlider ? e : this.position[0]) + "px";this.isRange ? (this.slider[this.currentSlider].style.transform = i, this.slider[this.currentSlider].style.WebkitTransform = i, this.slider[this.currentSlider].style.msTransform = i, "vertical" === this.direction ? (this.$refs.process.style.height = n, this.$refs.process.style[this.reverse ? "top" : "bottom"] = o) : (this.$refs.process.style.width = n, this.$refs.process.style[this.reverse ? "right" : "left"] = o)) : (this.slider.style.transform = i, this.slider.style.WebkitTransform = i, this.slider.style.msTransform = i, "vertical" === this.direction ? (this.$refs.process.style.height = e + "px", this.$refs.process.style[this.reverse ? "top" : "bottom"] = 0) : (this.$refs.process.style.width = e + "px", this.$refs.process.style[this.reverse ? "right" : "left"] = 0));
        }, setTransitionTime: function setTransitionTime(e) {
          if (e || this.$refs.process.offsetWidth, this.isRange) {
            for (var t = 0; t < this.slider.length; t++) {
              this.slider[t].style.transitionDuration = e + "s", this.slider[t].style.WebkitTransitionDuration = e + "s";
            }this.$refs.process.style.transitionDuration = e + "s", this.$refs.process.style.WebkitTransitionDuration = e + "s";
          } else this.slider.style.transitionDuration = e + "s", this.slider.style.WebkitTransitionDuration = e + "s", this.$refs.process.style.transitionDuration = e + "s", this.$refs.process.style.WebkitTransitionDuration = e + "s";
        }, getValue: function getValue() {
          return this.val;
        }, getIndex: function getIndex() {
          return Array.isArray(this.currentValue) ? this.data ? this.currentValue : [(this.currentValue[0] - this.minimum) / this.spacing, (this.currentValue[1] - this.minimum) / this.spacing] : (this.currentValue - this.minimum) / this.spacing;
        }, getStaticData: function getStaticData() {
          this.$refs.elem && (this.size = "vertical" === this.direction ? this.$refs.elem.offsetHeight : this.$refs.elem.offsetWidth, this.offset = "vertical" === this.direction ? this.$refs.elem.getBoundingClientRect().top + window.pageYOffset || document.documentElement.scrollTop : this.$refs.elem.getBoundingClientRect().left);
        }, refresh: function refresh() {
          this.$refs.elem && (this.getStaticData(), this.setPosition());
        } }, created: function created() {
        window.addEventListener("resize", this.refresh);
      }, mounted: function mounted() {
        var e = this;this.$nextTick(function () {
          e.getStaticData(), e.setValue(e.value, 0), e.bindEvents();
        });
      }, beforeDestroy: function beforeDestroy() {
        this.unbindEvents();
      } },
        Ca = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fst-options-bar" }, [i("div", { staticClass: "fst-options__option" }, [i("vue-slider", { ref: "slider", attrs: { min: 0, max: 360, interval: 15, piecewise: !0, formatter: function formatter(e) {
              return e + "°";
            }, "process-style": { "background-color": "rgb(46, 104, 251)" }, "tooltip-style": { "background-color": "rgb(46, 104, 251)", border: "1px solid rgb(46, 104, 251)" } }, model: { value: e.options.deg, callback: function callback(t) {
              e.options.deg = t;
            }, expression: "options.deg" } })], 1)]);
      }, staticRenderFns: [], components: { vueSlider: ba }, computed: fn({}, Hr.mapGetters(["transformations"])), data: function data() {
        return { options: { deg: 0 } };
      }, methods: fn({}, Hr.mapActions(["performTransformations"]), { applyTransform: function applyTransform() {
          var e = fn({}, this.options);this.options.exif && delete e.deg, 0 === this.options.deg || 360 === this.options.deg ? this.$store.commit("REMOVE_TRANSFORMATION", "rotate") : this.$store.commit("SET_TRANSFORMATION", { type: "rotate", options: e }), this.performTransformations();
        } }), mounted: function mounted() {
        this.options = fn({}, this.options, this.transformations.rotate);
      }, watch: { options: { deep: !0, handler: function handler() {
            this.applyTransform();
          } } } },
        Ea = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fst-options-bar" }, [i("div", { staticClass: "fst-options__option" }, [i("label", { attrs: { for: "deg" } }, [e._v("Threshold:")]), i("input", { directives: [{ name: "model", rawName: "v-model.number", value: e.options.threshold, expression: "options.threshold", modifiers: { number: !0 } }], attrs: { id: "deg", type: "range", min: "0", max: "100" }, domProps: { value: e.options.threshold }, on: { change: e.applyTransform, __r: function __r(t) {
              e.options.threshold = e._n(t.target.value);
            }, blur: function blur(t) {
              e.$forceUpdate();
            } } }), i("div", { staticClass: "fst-options__option" }, [i("input", { directives: [{ name: "model", rawName: "v-model.number", value: e.options.threshold, expression: "options.threshold", modifiers: { number: !0 } }], attrs: { type: "number", min: "0", max: "100" }, domProps: { value: e.options.threshold }, on: { change: e.applyTransform, input: function input(t) {
              t.target.composing || (e.options.threshold = e._n(t.target.value));
            }, blur: function blur(t) {
              e.$forceUpdate();
            } } })])])]);
      }, staticRenderFns: [], computed: fn({}, Hr.mapGetters(["transformations"])), data: function data() {
        return { options: { threshold: 0 } };
      }, methods: fn({}, Hr.mapActions(["performTransformations"]), { applyTransform: function applyTransform() {
          this.$store.commit("SET_TRANSFORMATION", { type: "blackwhite", options: this.options }), this.performTransformations();
        } }), mounted: function mounted() {
        this.options = fn({}, this.options, this.transformations.blackwhite);
      } },
        Sa = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fst-options-bar" }, [i("div", { staticClass: "fst-options__option" }, [i("div", { staticClass: "fst-radio-check-container" }, [i("label", { attrs: { for: "on" } }, [e._v("On:")]), i("input", { directives: [{ name: "model", rawName: "v-model", value: e.on, expression: "on" }], attrs: { id: "on", type: "radio", value: "true" }, domProps: { checked: e._q(e.on, "true") }, on: { change: e.applyTransform, __c: function __c(t) {
              e.on = "true";
            } } }), i("div", { staticClass: "fst-radio-check" })]), i("div", { staticClass: "fst-radio-check-container" }, [i("label", { attrs: { for: "off" } }, [e._v("Off:")]), i("input", { directives: [{ name: "model", rawName: "v-model", value: e.on, expression: "on" }], attrs: { id: "off", type: "radio", value: "false" }, domProps: { checked: e._q(e.on, "false") }, on: { change: e.applyTransform, __c: function __c(t) {
              e.on = "false";
            } } }), i("div", { staticClass: "fst-radio-check" })])])]);
      }, staticRenderFns: [], computed: fn({}, Hr.mapGetters(["transformations"])), data: function data() {
        return { on: !1 };
      }, methods: fn({}, Hr.mapActions(["performTransformations"]), { applyTransform: function applyTransform() {
          var e = !("true" !== this.on);this.$store.commit("SET_TRANSFORMATION", { type: "monochrome", options: e }), this.performTransformations();
        } }), mounted: function mounted() {
        this.on = this.transformations.monochrome || !1;
      } },
        wa = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fst-options-bar" }, [i("div", { staticClass: "fst-options__option" }, [i("vue-slider", { ref: "slider", attrs: { min: 0, max: 100, formatter: function formatter(e) {
              return "Tone: " + e;
            }, "process-style": { "background-color": "rgb(46, 104, 251)" }, "tooltip-style": { "background-color": "rgb(46, 104, 251)", border: "1px solid rgb(46, 104, 251)" } }, model: { value: e.options.tone, callback: function callback(t) {
              e.options.tone = t;
            }, expression: "options.tone" } })], 1)]);
      }, staticRenderFns: [], components: { vueSlider: ba }, computed: fn({}, Hr.mapGetters(["transformations"])), data: function data() {
        return { options: { tone: 0 } };
      }, methods: fn({}, Hr.mapActions(["performTransformations"]), { applyTransform: function applyTransform() {
          0 === this.options.tone ? this.$store.commit("REMOVE_TRANSFORMATION", "sepia") : this.$store.commit("SET_TRANSFORMATION", { type: "sepia", options: this.options }), this.performTransformations();
        } }), mounted: function mounted() {
        this.options = fn({}, this.options, this.transformations.sepia);
      }, watch: { options: { deep: !0, handler: function handler() {
            this.applyTransform();
          } } } },
        Ta = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fst-sidebar" }, e._l(e.enabled, function (t) {
          return i("div", { staticClass: "fst-sidebar__option", class: { "fst-sidebar__option--active": t === e.activeTransform }, on: { click: function click(i) {
                e.handleClick(t);
              } } }, [i("span", { staticClass: "fst-icon", class: e.genIconClass(t) }), e._v(" " + e._s(t))]);
        }));
      }, staticRenderFns: [], computed: fn({}, Hr.mapGetters(["enabled", "activeTransform"])), methods: { handleClick: function handleClick(e) {
          this.$store.commit("SET_ACTIVE_TRANSFORM", e);
        }, genIconClass: function genIconClass(e) {
          return this.activeTransform === e ? "fst-icon--" + e + "-white" : "fst-icon--" + e + "-black";
        } } },
        Aa = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fst-transform" }, [i("div", { staticClass: "fst-modal" }, [i("transforms"), i("div", { staticClass: "fst-modal__body" }, [i("div", { staticClass: "fst-container" }, [i("div", { staticClass: "fst-content" }, [i("img", { ref: "image", staticClass: "fst-image", attrs: { src: e.imageUrl }, on: { load: e.imageLoaded } }), e.imageLoading ? i("div", { staticClass: "fst-image-loader" }) : e._e(), "crop" === e.activeTransform ? i("crop", { attrs: { "image-width": e.imageWidth, "image-height": e.imageHeight, "image-x": e.imageX, "image-y": e.imageY } }) : e._e(), "rotate" === e.activeTransform ? i("rotate") : e._e(), "blackwhite" === e.activeTransform ? i("black-white") : e._e(), "monochrome" === e.activeTransform ? i("monochrome") : e._e(), "circle" === e.activeTransform ? i("circle-view") : e._e(), "sepia" === e.activeTransform ? i("sepia") : e._e()], 1)]), i("div", { staticClass: "fst-footer" }, [i("div", { staticClass: "fst-button fst-button--cancel", on: { click: e.cancel } }, [e._v("Cancel")]), i("div", { staticClass: "fst-button fst-button--primary", on: { click: e.done } }, [e._v("Done")])])])], 1)]);
      }, staticRenderFns: [], components: { "circle-view": ya, Crop: _a, Rotate: Ca, BlackWhite: Ea, Monochrome: Sa, Sepia: wa, Transforms: Ta }, data: function data() {
        return { imageWidth: 0, imageHeight: 0 };
      }, computed: fn({}, Hr.mapGetters(["imageUrl", "activeTransform", "imageLoading"])), methods: fn({}, Hr.mapActions(["performTransformations"]), { imageLoaded: function imageLoaded() {
          if (this.$refs.image) {
            var e = this.$refs.image.offsetLeft,
                t = this.$refs.image.offsetTop;this.imageWidth = this.$refs.image.offsetWidth + e, this.imageHeight = this.$refs.image.offsetHeight + t, this.imageX = e, this.imageY = t;var i = this.$refs.image.naturalWidth,
                n = this.$refs.image.naturalHeight;this.$store.commit("SET_IMAGE_NATURAL_SIZE", { w: i, h: n }), this.$store.commit("SET_IMAGE_LOADING", !1);
          }
        }, cancel: function cancel() {
          this.$root.$destroy();
        }, done: function done() {
          this.performTransformations({ done: !0 }), this.$root.$destroy();
        } }) };tt.use(Hr);var Fa = { imageNaturalWidth: 0, imageNaturalHeight: 0, imageLoading: !0, transformations: {}, cropRectangle: null, activeTransform: null },
        ka = function ka(e, t, i) {
      var n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
          o = function o(t) {
        var i = e.getSecurity();return i && i.policy && i.signature && t.indexOf("https://process.filestackapi.com") === -1 && t.indexOf("https://process-stage.filestackapi.com") === -1 ? t + "?policy=" + i.policy + "&signature=" + i.signature : t;
      };return new Hr.Store({ state: fn({}, Fa, { config: t }, n), mutations: { SET_IMAGE_NATURAL_SIZE: function SET_IMAGE_NATURAL_SIZE(e, t) {
            e.imageNaturalWidth = t.w, e.imageNaturalHeight = t.h;
          }, SET_CROP_RECTANGLE: function SET_CROP_RECTANGLE(e, t) {
            e.cropRectangle = t;
          }, SET_ACTIVE_TRANSFORM: function SET_ACTIVE_TRANSFORM(e, t) {
            e.activeTransform = t;
          }, SET_NEW_URL: function SET_NEW_URL(e, t) {
            var i = o(t);e.config.imageUrl = i;
          }, SET_TRANSFORMATION: function SET_TRANSFORMATION(e, t) {
            var i = t.type,
                n = t.options;tt.set(e.transformations, i, n);
          }, REMOVE_TRANSFORMATION: function REMOVE_TRANSFORMATION(e, t) {
            tt.delete(e.transformations, t);
          }, SET_IMAGE_LOADING: function SET_IMAGE_LOADING(e, t) {
            e.imageLoading = t;
          } }, actions: { performTransformations: function performTransformations(t) {
            var n = arguments.length > 1 && void 0 !== arguments[1] && arguments[1],
                o = t.state,
                r = fn({}, o.transformations);if (o.transformations.crop) {
              var s = o.transformations.crop.dim;t.commit("SET_CROP_RECTANGLE", s), o.config.minDimensions && (o.config.minDimensions[0] > s.width || o.config.minDimensions[1] > s.height) && (r.resize = {}, r.resize.width = o.config.minDimensions[0], r.resize.height = o.config.minDimensions[1]), o.config.maxDimensions && (o.config.maxDimensions[0] < s.width || o.config.maxDimensions[1] < s.height) && (r.resize = {}, r.resize.width = o.config.maxDimensions[0], r.resize.height = o.config.maxDimensions[1]);
            } else o.config.minDimensions && (o.config.minDimensions[0] > o.imageNaturalWidth || o.config.minDimensions[1] > o.imageNaturalHeight) && (r.resize = {}, r.resize.width = o.config.minDimensions[0], r.resize.height = o.config.minDimensions[1]), o.config.maxDimensions && (o.config.maxDimensions[0] < o.imageNaturalWidth || o.config.maxDimensions[1] < o.imageNaturalHeight) && (r.resize = {}, r.resize.width = o.config.maxDimensions[0], r.resize.height = o.config.maxDimensions[1]);if (n) try {
              if (Object.keys(r).length) {
                i(e.transform(t.getters.originalUrl, r));
              } else i(null);
            } catch (e) {
              console.log(e);
            } else {
              var a = e.transform(t.getters.originalUrl, r);t.getters.imageUrl !== a && (t.commit("SET_NEW_URL", a), t.commit("SET_IMAGE_LOADING", !0));
            }
          } }, getters: { imageUrl: function imageUrl(e) {
            return o(e.config.imageUrl);
          }, imageLoading: function imageLoading(e) {
            return e.imageLoading;
          }, originalUrl: function originalUrl(e) {
            return e.config.originalUrl;
          }, cachedCropRectangle: function cachedCropRectangle(e) {
            return e.cropRectangle;
          }, transformations: function transformations(e) {
            return e.transformations;
          }, imageNaturalWidth: function imageNaturalWidth(e) {
            return e.imageNaturalWidth;
          }, imageNaturalHeight: function imageNaturalHeight(e) {
            return e.imageNaturalHeight;
          }, enabled: function enabled(e) {
            return Object.keys(e.config.transformations).filter(function (t) {
              return e.config.transformations[t];
            });
          }, activeTransform: function activeTransform(e) {
            return e.activeTransform;
          }, cropAspectRatio: function cropAspectRatio(e) {
            return e.config.transformations.crop && e.config.transformations.crop.aspectRatio;
          } } });
    },
        Ra = function Ra(e) {
      return "object" === (void 0 === e ? "undefined" : un(e)) && null !== e && Array.isArray(e) === !1 && e instanceof HTMLElement == !1;
    },
        Oa = function Oa(e) {
      return "number" == typeof e;
    },
        La = { imageUrl: function imageUrl(e) {
        return e;
      }, container: function container(e) {
        if (e instanceof HTMLElement) return e;throw new Error('Invalid value for "container" config option');
      }, minDimensions: function minDimensions(e) {
        if (Array.isArray(e)) {
          if (2 === e.length) {
            if (!e.some(function (e) {
              return "number" != typeof e;
            })) return e;throw new Error('Option "minDimensions" requires array of numbers');
          }throw new Error('Option "minDimensions" requires array with exactly two elements: [width, height]');
        }throw new Error('Invalid value for "minDimensions" config option');
      }, maxDimensions: function maxDimensions(e) {
        if (Array.isArray(e)) {
          if (2 === e.length) {
            if (!e.some(function (e) {
              return "number" != typeof e;
            })) return e;throw new Error('Option "maxDimensions" requires array of numbers');
          }throw new Error('Option "maxDimensions" requires array with exactly two elements: [width, height]');
        }throw new Error('Invalid value for "maxDimensions" config option');
      }, transformations: function transformations(e) {
        if (Ra(e)) return e;throw new Error('Invalid value for "transformations" config option');
      }, "transformations.crop": function transformationsCrop(e) {
        if (Ra(e)) return e;if (e === !0) return {};if (e === !1) return !1;throw new Error('Invalid value for "transformations.crop" config option');
      }, "transformations.crop.aspectRatio": function transformationsCropAspectRatio(e) {
        if (Oa(e)) return e;throw new Error('Invalid value for "transformations.crop.aspectRatio" config option');
      }, "transformations.rotate": function transformationsRotate(e) {
        if ("boolean" == typeof e) return e;throw new Error('Invalid value for "transformations.rotate" config option');
      }, "transformations.blackwhite": function transformationsBlackwhite(e) {
        if ("boolean" == typeof e) return e;throw new Error('Invalid value for "transformations.blackwhite" config option');
      }, "transformations.monochrome": function transformationsMonochrome(e) {
        if ("boolean" == typeof e) return e;throw new Error('Invalid value for "transformations.monochrome" config option');
      }, "transformations.circle": function transformationsCircle(e) {
        if ("boolean" == typeof e) return e;throw new Error('Invalid value for "transformations.circle" config option');
      }, "transformations.sepia": function transformationsSepia(e) {
        if ("boolean" == typeof e) return e;throw new Error('Invalid value for "transformations.sepia" config option');
      } },
        Na = function Na(e) {
      return void 0 === e.transformations && (e.transformations = { crop: !0 }), e;
    },
        xa = function e(t, i) {
      var n = {};return Object.keys(t).forEach(function (o) {
        var r = o;i && (r = i + "." + o);var s = La[r];if (!s) throw new Error('Unknown config option "' + r + '"');var a = s(t[o]);Ra(a) ? n[o] = e(a, r) : n[o] = a;
      }), n;
    },
        Ia = Ar.context("transformer"),
        Da = function Da(e, t, i) {
      return new Promise(function (n) {
        var o = function o(e) {
          n(e);
        },
            r = document.body;t.container && (r = t.container);var s = document.createElement("div");r.appendChild(s);var a = new tt({ el: s, store: ka(e, t, o, i), render: function render(e) {
            return e(Aa);
          }, destroyed: function destroyed() {
            return a.$el.parentNode.removeChild(a.$el), o();
          } });
      });
    },
        $a = function $a(e, t) {
      var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
          n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {};return Ia("Starting transformer v0.4.1 with config:", i), i = fn({ imageUrl: t }, i), i = xa(Na(i)), i.originalUrl = t, Nr.loadCss(cn.css.main).then(function () {
        return Da(e, i, n);
      });
    },
        Ua = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fsp-picker" }, [i("div", { ref: "container" }), e._m(0)]);
      }, staticRenderFns: [function () {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fsp-picker__footer" }, [e._v("Powered by "), i("span", { staticClass: "fsp-icon--filestack" }), e._v(" Filestack")]);
      }], computed: fn({}, Hr.mapGetters(["apiClient", "stagedForTransform", "transformOptions", "uploadInBackground"])), methods: fn({}, Hr.mapActions(["startUploading"]), { showInTransformer: function showInTransformer(e) {
          var t = this;$a(this.apiClient, e.url, fn({}, this.transformOptions, { container: this.$refs.container }), { transformations: {} }).then(function (i) {
            t.$store.commit("SET_FILE_TRANSFORMATION", { uploadToken: e.uploadToken, transformedUrl: i });
          }).then(function () {
            t.$store.commit("GO_BACK_WITH_ROUTE"), t.uploadInBackground && t.startUploading();
          });
        } }), mounted: function mounted() {
        this.showInTransformer(this.stagedForTransform);
      } },
        Ma = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fsp-picker" }, [i("close-button"), i("div", { staticClass: "fsp-modal" }, [i("sidebar"), i("div", { staticClass: "fsp-modal__body" }, [i("div", { staticClass: "fsp-container" }, [e.uploadStarted || e.mobileNavActive ? e._e() : i("div", { staticClass: "fsp-summary__go-back", attrs: { title: "Go back" }, on: { click: e.goBack } }), i("content-header", [e.mobileNavActive ? e._e() : i("span", { staticClass: "fsp-header-text--visible" }, [e._v(e._s(e.headerText))])]), i("div", { staticClass: "fsp-content fsp-content--selected-items" }, [i("div", { staticClass: "fsp-summary" }, [i("div", { staticClass: "fsp-summary__header" }, [i("div", { staticClass: "fsp-summary__filter" }, [i("input", { attrs: { placeholder: e.placeholderText }, on: { input: e.updateFilter } }), e._v(" "), i("span", { staticClass: "fsp-summary__filter-icon" })])]), i("div", { staticClass: "fsp-summary__body" }, [e.onlyTransformedImages.length ? i("div", { staticClass: "fsp-grid__label" }, [e._v(e._s(e.t("Edited Images")))]) : e._e(), e.onlyTransformedImages.length ? i("div", { staticClass: "fsp-summary__images-container" }, e._l(e.onlyTransformedImages, function (t) {
          return i("div", { key: t.uploadToken, staticClass: "fsp-summary__item" }, ["local_file_system" === t.source ? i("img", { ref: t.uploadToken, refInFor: !0, staticClass: "fsp-summary__thumbnail", attrs: { src: e.generateThumbnail(t) }, on: { load: function load(i) {
                e.revokeURL(t);
              } } }) : i("div", [i("img", { staticClass: "fsp-summary__thumbnail", attrs: { src: t.transformed || t.thumbnail } })]), i("span", { staticClass: "fsp-summary__item-name" }, [e._v(e._s(t.name) + " "), "local_file_system" === t.source ? i("span", { staticClass: "fsp-summary__size" }, [e.uploadStarted ? i("span", { staticClass: "fsp-summary__size-progress" }, [e._v(e._s(t.progressSize) + " " + e._s(e.t("of")) + " ")]) : e._e(), e._v(e._s(e.translatedFileSize(t.size)))]) : e._e()]), i("div", { staticClass: "fsp-summary__item-progress", style: { width: t.progress + "%" } }), e.uploadStarted ? e._e() : i("div", { staticClass: "fsp-summary__actions-container" }, [e.disableTransformer || e.isLoading(t.uploadToken) ? e._e() : i("span", [i("span", { staticClass: "fsp-summary__action fsp-summary__action--button", on: { click: function click(i) {
                e.removeTransformation(t);
              } } }, [e._v(e._s(e.t("Revert")))])]), i("span", { staticClass: "fsp-summary__action-separator" }), e._v(" "), i("span", { staticClass: "fsp-summary__action fsp-summary__action--remove", on: { click: function click(i) {
                e.addFile(t);
              } } })])]);
        })) : e._e(), e.onlyImages.length ? i("div", { staticClass: "fsp-grid__label" }, [e._v(e._s(e.t("Images")))]) : e._e(), e.onlyImages.length ? i("div", { staticClass: "fsp-summary__images-container" }, e._l(e.onlyImages, function (t) {
          return i("div", { key: t.uploadToken, staticClass: "fsp-summary__item" }, ["local_file_system" === t.source ? i("img", { ref: t.uploadToken, refInFor: !0, staticClass: "fsp-summary__thumbnail", attrs: { src: e.generateThumbnail(t) }, on: { load: function load(i) {
                e.revokeURL(t);
              } } }) : i("div", [i("img", { staticClass: "fsp-summary__thumbnail", attrs: { src: t.transformed || t.thumbnail } })]), i("span", { staticClass: "fsp-summary__item-name" }, [e._v(e._s(t.name) + " "), "local_file_system" === t.source ? i("span", { staticClass: "fsp-summary__size" }, [e.uploadStarted ? i("span", { staticClass: "fsp-summary__size-progress" }, [e._v(e._s(t.progressSize) + " " + e._s(e.t("of")) + " ")]) : e._e(), e._v(e._s(e.translatedFileSize(t.size)))]) : e._e()]), i("div", { staticClass: "fsp-summary__item-progress", style: { width: t.progress + "%" } }), e.uploadStarted ? e._e() : i("div", { staticClass: "fsp-summary__actions-container" }, [e.isLoading(t.uploadToken) ? i("span", { staticClass: "fsp-summary__action fsp-summary__action--button fsp-summary__action--disabled fsp-summary__action--loading" }, [e._v("Loading... "), i("span", { staticClass: "fsp-loading--folder" })]) : e._e(), e.disableTransformer || e.isLoading(t.uploadToken) ? e._e() : i("span", [i("span", { staticClass: "fsp-summary__action fsp-summary__action--button", on: { click: function click(i) {
                e.transformImage(t);
              } } }, [e._v(e._s(e.t("Edit")))])]), i("span", { staticClass: "fsp-summary__action-separator" }), e._v(" "), i("span", { staticClass: "fsp-summary__action fsp-summary__action--remove", on: { click: function click(i) {
                e.addFile(t);
              } } })])]);
        })) : e._e(), e.onlyFiles.length ? i("div", { staticClass: "fsp-grid__label" }, [e._v(e._s(e.t("Files")))]) : e._e(), e._l(e.onlyFiles, function (t) {
          return i("div", { key: t.uploadToken, staticClass: "fsp-summary__item" }, [i("div", { staticClass: "fsp-summary__thumbnail-container" }, [i("span", { class: e.generateClass(t) })]), i("span", { staticClass: "fsp-summary__item-name" }, [e._v(e._s(t.name) + " "), "local_file_system" === t.source ? i("span", { staticClass: "fsp-summary__size" }, [e.uploadStarted ? i("span", { staticClass: "fsp-summary__size-progress" }, [e._v(e._s(t.progressSize) + " " + e._s(e.t("of")) + " ")]) : e._e(), e._v(e._s(e.translatedFileSize(t.size)))]) : e._e()]), i("div", { staticClass: "fsp-summary__item-progress", style: { width: t.progress + "%" } }), e.uploadStarted ? e._e() : i("div", { staticClass: "fsp-summary__actions-container" }, [i("div", { staticClass: "fsp-summary__action", on: { click: function click(i) {
                e.addFile(t);
              } } }, [i("span", { staticClass: "fsp-summary__action--remove" })])])]);
        }), e.hideMinFilesNotification ? e._e() : i("div", { staticClass: "fsp-notifications__container" }, [i("div", { staticClass: "fsp-notifications__message" }, [i("span", { staticClass: "fsp-label" }, [e._v(e._s(e.getMinFilesNotification))])]), i("span", { staticClass: "fsp-notifications__back-button", on: { click: e.goBack } }, [e._v(e._s(e.t("Go Back")))])])], 2)])])], 1), i("footer-nav", { attrs: { "is-visible": !e.uploadStarted } }, [i("span", { staticClass: "fsp-button fsp-button--flat fsp-button__deselect", on: { click: e.deselectAllFiles }, slot: "nav-left" }, [e._v(e._s(e.t("Deselect All")))]), e._v(" "), i("span", { staticClass: "fsp-button fsp-button--primary", class: { "fsp-button--disabled": !e.canStartUpload }, attrs: { title: "Upload" }, on: { click: e.startUploadMaybe }, slot: "nav-right" }, [e._v(e._s(e.t("Upload")) + " "), i("span", { staticClass: "fsp-badge fsp-badge--bright" }, [e._v(e._s(e.allFiles.length))])])])], 1)], 1), e._m(0)], 1);
      }, staticRenderFns: [function () {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return i("div", { staticClass: "fsp-picker__footer" }, [e._v("Powered by "), i("span", { staticClass: "fsp-icon--filestack" }), e._v(" Filestack")]);
      }], components: { CloseButton: ts, ContentHeader: Vs, Sidebar: Xs, FooterNav: Gs }, computed: fn({}, Hr.mapGetters(["allFilesInQueueCount", "filesWaiting", "filesUploading", "filesDone", "filesFailed", "route", "routesHistory", "uploadStarted", "minFiles", "canStartUpload", "filesNeededCount", "disableTransformer", "mobileNavActive"]), { allFiles: function allFiles() {
          return this.filesUploading.concat(this.filesWaiting);
        }, getMinFilesNotification: function getMinFilesNotification() {
          return 1 === this.filesNeededCount ? this.t("Please select") + " 1 " + this.t("more file") : this.filesNeededCount > 1 ? this.t("Please select") + " " + this.filesNeededCount + " " + this.t("more files") : null;
        }, hideMinFilesNotification: function hideMinFilesNotification() {
          return this.uploadStarted || this.canStartUpload;
        }, onlyFiles: function onlyFiles() {
          var e = this,
              t = new RegExp(this.filter, "i");return this.allFiles.filter(function (t) {
            return !e.isImage(t);
          }).filter(function (e) {
            return t.test(e.name);
          });
        }, onlyImages: function onlyImages() {
          var e = this,
              t = new RegExp(this.filter, "i");return this.allFiles.filter(function (t) {
            return e.isImage(t);
          }).filter(function (e) {
            return !e.transformed;
          }).filter(function (e) {
            return t.test(e.name);
          });
        }, onlyTransformedImages: function onlyTransformedImages() {
          var e = this,
              t = new RegExp(this.filter, "i");return this.allFiles.filter(function (t) {
            return e.isImage(t);
          }).filter(function (e) {
            return e.transformed;
          }).filter(function (e) {
            return t.test(e.name);
          });
        }, headerText: function headerText() {
          return this.uploadStarted ? this.t("Uploaded") + " " + this.filesDone.concat(this.filesFailed).length + " " + this.t("of") + " " + this.allFilesInQueueCount : this.t("Selected Files");
        }, atLeastOneLoading: function atLeastOneLoading() {
          var e = this;return !!Object.keys(this.loading).filter(function (t) {
            return e.loading[t];
          }).length;
        }, placeholderText: function placeholderText() {
          return this.t("Filter");
        } }), created: function created() {
        this.$store.commit("CANCEL_ALL_PENDING_REQUESTS");
      }, data: function data() {
        return { blobURLs: {}, currentPath: null, currentSource: null, filter: "", loading: {} };
      }, methods: fn({}, Hr.mapActions(["addFile", "deselectAllFiles", "deselectFolder", "removeTransformation", "startUploading", "uploadFileToTemporaryLocation", "goBack"]), { isImage: function isImage(e) {
          return e.mimetype && e.mimetype.indexOf("image/") !== -1;
        }, isAudio: function isAudio(e) {
          return e.mimetype && e.mimetype.indexOf("audio/") !== -1;
        }, isLoading: function isLoading(e) {
          return this.loading[e];
        }, fileOrFiles: function fileOrFiles(e) {
          return 1 === this.getFileCount(e) ? "File" : "Files";
        }, generateClass: function generateClass(e) {
          return this.isAudio(e) ? "fsp-grid__icon-audio" : "application/pdf" === e.mimetype ? "fsp-grid__icon-pdf" : "fsp-grid__icon-file";
        }, translatedFileSize: function translatedFileSize(e) {
          return us(e);
        }, generateThumbnail: function generateThumbnail(e) {
          if (e.transformed) return e.transformed;var t = window.URL.createObjectURL(e.originalFile);return this.blobURLs[e.uploadToken] = t, t;
        }, revokeURL: function revokeURL(e) {
          var t = this.blobURLs[e.uploadToken];window.URL.revokeObjectURL(t);
        }, updateFilter: function updateFilter(e) {
          this.filter = e.target.value;
        }, startUploadMaybe: function startUploadMaybe() {
          this.canStartUpload && this.startUploading(!0);
        }, transformImage: function transformImage(e) {
          var t = this;if (!this.atLeastOneLoading) {
            var i = e.uploadToken;this.loading = fn({}, this.loading, dn({}, i, !0)), this.uploadFileToTemporaryLocation(i).then(function (e) {
              e ? (t.loading = fn({}, t.loading, dn({}, i, !1)), t.$store.commit("SET_FILE_FOR_TRANSFORM", e), t.$store.commit("CHANGE_ROUTE", ["transform"])) : t.loading = fn({}, t.loading, dn({}, i, !1));
            }).catch(function () {
              t.loading = fn({}, t.loading, dn({}, i, !1));
            });
          }
        } }), watch: { allFiles: { handler: function handler(e) {
            0 === e.length && this.$store.commit("GO_BACK_WITH_ROUTE");
          } } } },
        Pa = { render: function render() {
        var e = this,
            t = e.$createElement,
            i = e._self._c || t;return e.uiVisible ? i("div", [e.isRootRoute("source") ? i("pick-from-source") : e._e(), e.isRootRoute("summary") ? i("upload-summary") : e._e(), e.isRootRoute("transform") ? i("transform") : e._e(), i("notifications"), e.localPickingAllowed ? i("drag-and-drop") : e._e()], 1) : e._e();
      }, staticRenderFns: [], components: { DragAndDrop: Zr, Notifications: Qr, PickFromSource: qs, Transform: Ua, UploadSummary: Ma }, computed: fn({}, Hr.mapGetters(["uiVisible", "route", "fromSources", "pendingReqs"]), { localPickingAllowed: function localPickingAllowed() {
          return this.fromSources.some(function (e) {
            return "local_file_system" === e.name;
          });
        } }), methods: fn({}, Hr.mapActions(["prefetchClouds"]), { isRootRoute: function isRootRoute(e) {
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
        za = function za(e) {
      var t = void 0,
          i = function i(e, t) {
        return fn({ source: t, sourceKind: "cloud" }, e);
      };return { state: { currentCloudAuthorized: !0, currentCloudName: void 0, currentCloudPath: void 0, listForCurrentCloudPath: [], cache: {}, cloudFolders: {}, cloudsAuthorized: {}, cloudsPrefetching: {}, loading: !1, pendingReqs: [], pendingTokens: [] }, mutations: { SET_CURRENT_CLOUD_AUTHORIZED: function SET_CURRENT_CLOUD_AUTHORIZED(e, t) {
            e.currentCloudAuthorized = t;
          }, SET_CURRENT_CLOUD_NAME: function SET_CURRENT_CLOUD_NAME(e, t) {
            e.currentCloudName = t;
          }, SET_CLOUD_AUTHORIZED: function SET_CLOUD_AUTHORIZED(e, t) {
            var i = t.key,
                n = t.value;tt.set(e.cloudsAuthorized, i, n);
          }, RESET_CLOUD_AUTHORIZED: function RESET_CLOUD_AUTHORIZED(e) {
            e.cloudsAuthorized = {};
          }, SET_CURRENT_CLOUD_PATH: function SET_CURRENT_CLOUD_PATH(e, t) {
            var i = t.length > 0 ? Us(t) : t,
                n = e.currentCloudName + i,
                o = e.cache[n];o && (e.listForCurrentCloudPath = o), e.currentCloudPath = t;
          }, SET_LIST_FOR_CURRENT_CLOUD_PATH: function SET_LIST_FOR_CURRENT_CLOUD_PATH(e, t) {
            var i = e.currentCloudPath,
                n = i.length > 0 ? Us(i) : i,
                o = e.currentCloudName + n;e.cache[o] = t, e.listForCurrentCloudPath = t;
          }, RESET_LIST_CURRENT_CLOUD_PATH: function RESET_LIST_CURRENT_CLOUD_PATH(e) {
            e.listForCurrentCloudPath = [];
          }, SET_CLOUD_FOLDERS: function SET_CLOUD_FOLDERS(e, t) {
            t.forEach(function (t) {
              e.cloudFolders[t.path] = fn({}, e.cloudFolders[t.path], { name: t.name });
            });
          }, SET_CLOUD_FOLDER_LOADING: function SET_CLOUD_FOLDER_LOADING(e, t) {
            var i = t.path,
                n = t.value;e.cloudFolders = fn({}, e.cloudFolders, dn({}, i, fn({}, e.cloudFolders[i], { loading: n })));
          }, SET_CLOUD_LOADING: function SET_CLOUD_LOADING(e, t) {
            e.loading = t;
          }, SET_CLOUD_PREFETCHING: function SET_CLOUD_PREFETCHING(e, t) {
            var i = t.key,
                n = t.value;tt.set(e.cloudsPrefetching, i, n);
          }, SET_CACHE: function SET_CACHE(e, t) {
            var i = t.key,
                n = t.value;e.cache[i] = n;
          }, RESET_CACHE: function RESET_CACHE(e) {
            e.cache = {};
          }, ADD_PENDING_REQUEST: function ADD_PENDING_REQUEST(e, t) {
            var i = t.request,
                n = t.token;e.pendingReqs.push({ request: i, token: n });
          }, EXECUTE_PENDING_REQUEST: function EXECUTE_PENDING_REQUEST(e) {
            var t = e.pendingReqs.pop();t && t.request && t.token && (t.request(), e.pendingTokens.push(t.token));
          }, CANCEL_ALL_PENDING_REQUESTS: function CANCEL_ALL_PENDING_REQUESTS(e) {
            e.pendingTokens.forEach(function (e) {
              e.cancel();
            }), e.pendingReqs = [], e.pendingTokens = [], e.cloudsPrefetching = {};
          } }, actions: { goToDirectory: function goToDirectory(e, t) {
            if (t.path !== e.getters.currentCloudPath.join("")) {
              var i = zs(e.getters.currentCloudPath);i.push(t.path);var n = ["source", e.getters.currentCloudName, i];e.commit("CHANGE_ROUTE", n);
            }
          }, logout: function logout(t, i) {
            i ? e.cloud().logout(i).then(function () {
              t.commit("CANCEL_ALL_PENDING_REQUESTS"), t.commit("SET_CLOUD_AUTHORIZED", { key: i, value: !1 }), t.commit("REMOVE_SOURCE_FROM_WAITING", i), Object.keys(t.state.cache).filter(function (e) {
                return e.indexOf(i) >= 0;
              }).forEach(function (e) {
                t.commit("SET_CACHE", { key: e, value: null });
              }), i === t.state.currentCloudName && (t.commit("SET_CURRENT_CLOUD_AUTHORIZED", !1), t.commit("RESET_LIST_CURRENT_CLOUD_PATH"), t.commit("CHANGE_ROUTE", ["source", i]));
            }) : e.cloud().logout().then(function () {
              t.commit("RESET_CLOUD_AUTHORIZED"), t.commit("SET_CURRENT_CLOUD_AUTHORIZED", !1), t.commit("RESET_CACHE"), t.commit("RESET_LIST_CURRENT_CLOUD_PATH"), t.commit("REMOVE_CLOUDS_FROM_WAITING"), t.commit("CANCEL_ALL_PENDING_REQUESTS");
            });
          }, prefetchClouds: function prefetchClouds(t) {
            t.getters.fromSources.filter(function (e) {
              return "cloud" === e.ui;
            }).map(function (e) {
              return e.name;
            }).forEach(function (n) {
              t.commit("SET_CLOUD_PREFETCHING", { key: n, value: !0 });var o = e.cloud(n),
                  r = {},
                  s = function s() {
                return o.list([], r).then(function (e) {
                  t.commit("SET_CLOUD_PREFETCHING", { key: n, value: !1 }), t.commit("SET_CLOUD_AUTHORIZED", { key: n, value: !0 });var r = e.contents.map(function (e) {
                    return i(e, n);
                  }),
                      s = r.filter(function (e) {
                    return e.folder;
                  });t.commit("SET_CLOUD_FOLDERS", s), t.commit("SET_CACHE", { key: n, value: r }), t.getters.currentCloudName === n && (t.commit("SET_LIST_FOR_CURRENT_CLOUD_PATH", r), t.dispatch("prefetchFolders", { client: o, name: n, folders: s }));
                }).catch(function (e) {
                  t.commit("SET_CLOUD_PREFETCHING", { key: n, value: !1 }), t.getters.currentCloudName === n && 401 === e.status && t.commit("SET_CURRENT_CLOUD_AUTHORIZED", { status: "unauthorized", authUrl: e.response.body.redirect_url });
                });
              };t.commit("ADD_PENDING_REQUEST", { request: s, token: r });
            });
          }, prefetchFolders: function prefetchFolders(e, t) {
            var n = t.client,
                o = t.name;t.folders.forEach(function (t) {
              var r = o + t.path;if (!e.state.cache[r]) {
                var s = {},
                    a = function a() {
                  return e.commit("SET_CLOUD_PREFETCHING", { key: r, value: !0 }), n.list(t.path, s).then(function (s) {
                    var a = e.getters.currentCloudPath,
                        l = a.length > 0 ? Us(a) : a,
                        c = s.contents.map(function (e) {
                      return i(e, o);
                    }),
                        u = c.filter(function (e) {
                      return e.folder;
                    });e.commit("SET_CLOUD_PREFETCHING", { key: r, value: !1 }), e.commit("SET_CLOUD_FOLDERS", u), e.commit("SET_CACHE", { key: r, value: c }), t.path === l && (e.commit("SET_LIST_FOR_CURRENT_CLOUD_PATH", c), e.dispatch("prefetchFolders", { client: n, name: o, folders: u }));
                  }).catch(function (i) {
                    e.commit("SET_CLOUD_PREFETCHING", { key: r, value: !1 });var n = e.getters.currentCloudPath,
                        o = n.length > 0 ? Us(n) : n;t.path === o && 401 === i.status && e.commit("SET_CURRENT_CLOUD_AUTHORIZED", { status: "unauthorized", authUrl: i.response.body.redirect_url });
                  });
                };e.commit("ADD_PENDING_REQUEST", { request: a, token: s });
              }
            });
          }, addCloudFolder: function addCloudFolder(n, o) {
            var r = o.name,
                s = o.path,
                a = void 0,
                l = r + s,
                c = n.state.cache[l];c ? a = Promise.resolve(c) : (t = e.cloud(r), a = t.list(s), n.commit("SET_CLOUD_FOLDER_LOADING", { path: s, value: !0 })), a.then(function (e) {
              if (c) return void e.filter(function (e) {
                return !e.folder;
              }).forEach(function (e) {
                return n.dispatch("addFile", e);
              });n.commit("SET_CLOUD_FOLDER_LOADING", { path: s, value: !1 });var t = e.contents.map(function (e) {
                return i(e, r);
              });n.commit("SET_CACHE", { key: l, value: t }), t.filter(function (e) {
                return !e.folder;
              }).forEach(function (e) {
                return n.dispatch("addFile", e);
              });
            }).catch(function (e) {
              n.commit("SET_CLOUD_FOLDER_LOADING", { path: s, value: !1 }), n.dispatch("showNotification", e.message);
            });
          }, showCloudPath: function showCloudPath(n, o) {
            var r = o.name,
                s = o.path,
                a = void 0 === s ? [] : s;n.getters.currentCloudName !== r && (t = e.cloud(r), n.commit("SET_CURRENT_CLOUD_NAME", r)), n.getters.currentCloudAuthorized !== !0 && n.commit("SET_CURRENT_CLOUD_AUTHORIZED", !0);var l = a.length > 0 ? Us(a) : a,
                c = r + l,
                u = n.state.cache[c];if (n.commit("RESET_LIST_CURRENT_CLOUD_PATH"), n.commit("SET_CURRENT_CLOUD_PATH", a), n.commit("CANCEL_ALL_PENDING_REQUESTS"), u) {
              var d = u.filter(function (e) {
                return e.folder;
              });return void n.dispatch("prefetchFolders", { client: t, name: r, folders: d });
            }n.getters.cloudsPrefetching[c] || function (e) {
              n.commit("SET_CLOUD_LOADING", !0), t.list(e).then(function (e) {
                if (n.getters.currentCloudPath === a) {
                  var o = e.contents.map(function (e) {
                    return i(e, r);
                  }),
                      s = o.filter(function (e) {
                    return e.folder;
                  });n.dispatch("prefetchFolders", { client: t, name: r, folders: s }), n.commit("SET_CLOUD_FOLDERS", s), n.commit("SET_LIST_FOR_CURRENT_CLOUD_PATH", o), n.commit("SET_CLOUD_LOADING", !1), n.commit("SET_CLOUD_AUTHORIZED", { key: r, value: !0 });
                }
              }).catch(function (e) {
                n.commit("SET_CLOUD_LOADING", !1), n.getters.currentCloudPath === a && (401 === e.status ? n.commit("SET_CURRENT_CLOUD_AUTHORIZED", { status: "unauthorized", authUrl: e.response.body.redirect_url }) : n.dispatch("showNotification", e.response.body.status));
              });
            }(l);
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
        ja = function ja(e) {
      var t = function t(e) {
        return fn({ source: "imagesearch", sourceKind: "cloud" }, e);
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
          }, fetchImages: function fetchImages(i) {
            if (!i.getters.isSearching) {
              var n = i.getters.imageSearchInput;n && (i.commit("FETCH_IMAGES_BEGIN"), e.cloud("imagesearch").list("/" + n).then(function (e) {
                0 === e.contents.length && i.dispatch("showNotification", "No search results found for " + n), e.contents = e.contents.map(t), i.commit("FETCH_IMAGES_SUCCESS", e);
              }).catch(function (e) {
                i.commit("FETCH_IMAGES_ERROR", e), i.dispatch("showNotification", e.message);
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
        Va = { ADD_NOTIFICATION: function ADD_NOTIFICATION(e, t) {
        e.notifications.push(t);
      }, REMOVE_NOTIFICATION: function REMOVE_NOTIFICATION(e, t) {
        e.notifications = e.notifications.filter(function (e) {
          return e !== t;
        });
      }, REMOVE_ALL_NOTIFICATIONS: function REMOVE_ALL_NOTIFICATIONS(e) {
        e.notifications.splice(0, e.notifications.length);
      } },
        Ga = { showNotification: function showNotification(e, t, i) {
        var n = fn({ message: t }, i);e.getters.notifications.map(function (e) {
          return e.message;
        }).indexOf(t) < 0 && (e.commit("ADD_NOTIFICATION", n), setTimeout(function () {
          e.commit("REMOVE_NOTIFICATION", n);
        }, 5e3));
      }, removeAllNotifications: function removeAllNotifications(e) {
        e.commit("REMOVE_ALL_NOTIFICATIONS");
      } },
        Wa = { notifications: function notifications(e) {
        return e.notifications;
      } },
        Ha = { state: { notifications: [] }, mutations: Va, actions: Ga, getters: Wa };tt.use(Hr);var Ba = function Ba(e, t, i, n) {
      return n = fn({ apiClient: e, config: t, route: ["source", t.fromSources[0].name], routesHistory: [] }, n, { mobileNavActive: Ps(navigator.userAgent), selectLabelIsActive: !1 }), new Hr.Store({ state: n, modules: { uploadQueue: Os(e, n.uploadQueue), cloud: za(e), imageSearch: ja(e), notifications: Ha }, mutations: { CHANGE_ROUTE: function CHANGE_ROUTE(e, t) {
            Ps(navigator.userAgent) && t.indexOf("local_file_system") !== -1 && (e.mobileNavActive = !0), e.routesHistory.push(e.route), e.route = t;
          }, GO_BACK_WITH_ROUTE: function GO_BACK_WITH_ROUTE(e) {
            var t = e.routesHistory.pop();Ps(navigator.userAgent) && t.indexOf("local_file_system") !== -1 && (e.mobileNavActive = !0), e.route = t;
          }, UPDATE_MOBILE_NAV_ACTIVE: function UPDATE_MOBILE_NAV_ACTIVE(e, t) {
            e.mobileNavActive = t;
          }, UPDATE_SELECT_LABEL_ACTIVE: function UPDATE_SELECT_LABEL_ACTIVE(e, t) {
            e.selectLabelIsActive = t;
          } }, actions: { allUploadsDone: function allUploadsDone(e) {
            e.commit("CHANGE_ROUTE", ["done"]), i({ filesUploaded: cs(e.getters.filesDone), filesFailed: cs(e.getters.filesFailed) });
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
          }, transformOptions: function transformOptions(e) {
            return e.config.transformOptions;
          }, lang: function lang(e) {
            return e.config.lang;
          } } });
    },
        Ya = function Ya(e) {
      return "object" === (void 0 === e ? "undefined" : un(e)) && null !== e && Array.isArray(e) === !1;
    },
        Xa = function Xa(e) {
      return e % 1 == 0;
    },
        qa = { fromSources: function fromSources(e) {
        return "string" == typeof e && (e = [e]), e.map(es);
      }, accept: function accept(e) {
        return "string" == typeof e && (e = [e]), e.forEach(function (e) {
          if ("string" != typeof e) throw new Error('Invalid value for "accept" config option');
        }), e;
      }, preferLinkOverStore: function preferLinkOverStore(e) {
        if ("boolean" != typeof e) throw new Error('Invalid value for "preferLinkOverStore" config option');return e;
      }, maxSize: function maxSize(e) {
        if ("number" != typeof e || !Xa(e) || e < 0) throw new Error('Invalid value for "maxSize" config option');return e;
      }, minFiles: function minFiles(e) {
        if ("number" != typeof e || !Xa(e) || e < 0) throw new Error('Invalid value for "minFiles" config option');return e;
      }, maxFiles: function maxFiles(e) {
        if ("number" != typeof e || !Xa(e) || e < 0) throw new Error('Invalid value for "maxFiles" config option');return e;
      }, startUploadingWhenMaxFilesReached: function startUploadingWhenMaxFilesReached(e) {
        if ("boolean" != typeof e) throw new Error('Invalid value for "startUploadingWhenMaxFilesReached" config option');return e;
      }, loadCss: function loadCss(e) {
        if ("boolean" == typeof e && e === !1 || "string" == typeof e) return e;throw new Error('Invalid value for "loadCss" config option');
      }, lang: function lang(e) {
        if ("boolean" == typeof e && e === !1 || "string" == typeof e) return e;throw new Error('Invalid value for "lang" config option');
      }, storeTo: function storeTo(e) {
        if (Ya(e)) return e;throw new Error('Invalid value for "storeTo" config option');
      }, transformOptions: function transformOptions(e) {
        if (Ya(e)) return e;throw new Error('Invalid value for "transformOptions" config option');
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
      } },
        Ka = function Ka(e, t) {
      return void 0 === e.fromSources && (e.fromSources = ["local_file_system", "imagesearch", "facebook", "instagram", "googledrive", "dropbox"]), void 0 === e.preferLinkOverStore && (e.preferLinkOverStore = !1), void 0 === e.minFiles && (e.minFiles = 1), void 0 === e.maxFiles && (e.maxFiles = 1), void 0 === e.startUploadingWhenMaxFilesReached && (e.startUploadingWhenMaxFilesReached = !1), void 0 === e.loadCss && (e.loadCss = t.css.main), void 0 === e.hideWhenUploading && (e.hideWhenUploading = !1), void 0 === e.lang && (e.lang = "en"), void 0 === e.uploadInBackground && (e.uploadInBackground = !0), void 0 === e.disableTransformer && (e.disableTransformer = !1), e;
    },
        Za = function Za(e) {
      var t = {};if (Object.keys(e).forEach(function (i) {
        var n = qa[i];if (!n) throw new Error('Unknown config option "' + i + '"');t[i] = n(e[i]);
      }), void 0 !== t.minFiles && void 0 !== t.maxFiles && t.minFiles > t.maxFiles) throw new Error('Config option "minFiles" must be smaller or equal to "maxFiles"');return t;
    },
        Qa = Ar.context("picker"),
        Ja = function Ja(e, t, i) {
      return new Promise(function (n) {
        var o = function o(e) {
          n(e);
        };tt.use(wr), tt.locales(Ts);var r = document.createElement("div");document.body.appendChild(r);var s = new tt({ el: r, store: Ba(e, t, o, i), render: function render(e) {
            return e(Pa);
          }, created: function created() {
            this.$translate.setLang(t.lang), document.body.classList.add("fsp-picker-open");
          }, destroyed: function destroyed() {
            s.$el.parentNode.removeChild(s.$el), document.body.classList.remove("fsp-picker-open");
          } });
      });
    },
        el = function el(e) {
      return e.loadCss === !1 ? Promise.resolve() : Nr.loadCss(e.loadCss);
    };return function (e) {
      var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};return Qa("Starting picker v0.4.1 with config:", t), t = Za(Ka(t, cn)), el(t).then(function () {
        return Ja(e, t, i);
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

var init = function init(apikey, security) {
  return api(apikey, security);
};

var filestack = {
  version: '0.4.2',
  init: init
};

export default filestack;
//# sourceMappingURL=filestack.es2015.js.map
