    var toString = Object.prototype.toString;
    function noop () { }
    function isFunction (fn) {
        return toString.call(fn) === '[object Function]';
    }

    function objectOrFunction(x) {
        return isFunction(x) || (typeof x === "object" && x !== null);
    }
