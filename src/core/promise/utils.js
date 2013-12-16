    var toString = Object.prototype.toString;
	var defaultNow = Date.now || function() { return +new Date() };

    function noop () { }
    function notImeplented () { throw new Error('Not implemented'); }
    function isFunction (fn) {
        return toString.call(fn) === '[object Function]';
    }

	function objectOrFunction(x) {
		return isFunction(x) || (typeof x === "object" && x !== null);
	}