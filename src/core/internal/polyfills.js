    // Utilities
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (that) {
            var target = this,
                args = slice.call(arguments, 1);
            var bound = function () {
                if (this instanceof bound) {
                    function F() { }
                    F.prototype = target.prototype;
                    var self = new F();
                    var result = target.apply(self, args.concat(slice.call(arguments)));
                    if (Object(result) === result) {
                        return result;
                    }
                    return self;
                } else {
                    return target.apply(that, args.concat(slice.call(arguments)));
                }
            };

            return bound;
        };
    }
    var slice = Array.prototype.slice;
    function argsOrArray(args, idx) {
        return args.length === 1 && Array.isArray(args[idx]) ?
            args[idx] :
            slice.call(args);
    }
    var hasProp = {}.hasOwnProperty;
    var inherits = root.Internals.inherits = function (child, parent) {
        for (var key in parent) { // Enumerable bug in WebKit Mobile 4.0
            if (key !== 'prototype' && hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() { this.constructor = child; }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.super_ = parent.prototype;
        return child;
    };
    var addProperties = root.Internals.addProperties = function (obj) {
        var sources = slice.call(arguments, 1);
        for (var i = 0, len = sources.length; i < len; i++) {
            var source = sources[i];
            for (var prop in source) {
                obj[prop] = source[prop];
            }
        }
    };

    // Rx Utils
    var addRef = root.Internals.addRef = function (xs, r) {
        return new AnonymousObservable(function (observer) {
            return new CompositeDisposable(r.getDisposable(), xs.subscribe(observer));
        });
    };

    // Collection polyfills
    function arrayInitialize(count, factory) {
        var a = new Array(count);
        for (var i = 0; i < count; i++) {
            a[i] = factory();
        }
        return a;
    }

    var boxedString = Object("a"),
        splitString = boxedString[0] != "a" || !(0 in boxedString);
    if (!Array.prototype.every) {
        Array.prototype.every = function every(fun /*, thisp */) {
            var object = Object(this),
                self = splitString && {}.toString.call(this) == "[object String]" ?
                    this.split("") :
                    object,
                length = self.length >>> 0,
                thisp = arguments[1];

            if ({}.toString.call(fun) != "[object Function]") {
                throw new TypeError(fun + " is not a function");
            }

            for (var i = 0; i < length; i++) {
                if (i in self && !fun.call(thisp, self[i], i, object)) {
                    return false;
                }
            }
            return true;
        };
    }
    if (!Array.prototype.map) {
        Array.prototype.map = function map(fun /*, thisp*/) {
            var object = Object(this),
                self = splitString && {}.toString.call(this) == "[object String]" ?
                    this.split("") :
                    object,
                length = self.length >>> 0,
                result = Array(length),
                thisp = arguments[1];

            if ({}.toString.call(fun) != "[object Function]") {
                throw new TypeError(fun + " is not a function");
            }

            for (var i = 0; i < length; i++) {
                if (i in self)
                    result[i] = fun.call(thisp, self[i], i, object);
            }
            return result;
        };
    }
    if (!Array.prototype.filter) {
        Array.prototype.filter = function (predicate) {
            var results = [], item, t = new Object(this);
            for (var i = 0, len = t.length >>> 0; i < len; i++) {
                item = t[i];
                if (i in t && predicate.call(arguments[1], item, i, t)) {
                    results.push(item);
                }
            }
            return results;
        };
    }
    if (!Array.isArray) {
        Array.isArray = function (arg) {
            return Object.prototype.toString.call(arg) == '[object Array]';
        };
    }
    if (!Array.prototype.indexOf) {
        Array.prototype.indexOf = function indexOf(searchElement) {
            var t = Object(this);
            var len = t.length >>> 0;
            if (len === 0) {
                return -1;
            }
            var n = 0;
            if (arguments.length > 1) {
                n = Number(arguments[1]);
                if (n != n) {
                    n = 0;
                } else if (n != 0 && n != Infinity && n != -Infinity) {
                    n = (n > 0 || -1) * Math.floor(Math.abs(n));
                }
            }
            if (n >= len) {
                return -1;
            }
            var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
            for (; k < len; k++) {
                if (k in t && t[k] === searchElement) {
                    return k;
                }
            }
            return -1;
        };
    }
