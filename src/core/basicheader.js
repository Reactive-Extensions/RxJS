    // Defaults
    function noop() { }
    function identity(x) { return x; }
    var defaultNow = (function () { return !!Date.now ? Date.now : function () { return +new Date; }; }());
    function defaultComparer(x, y) { return isEqual(x, y); }
    function defaultSubComparer(x, y) { return x - y; }
    function defaultKeySerializer(x) { return x.toString(); }
    function defaultError(err) { throw err; }
    function isPromise(p) { return typeof p.then === 'function'; }

    // Errors
    var sequenceContainsNoElements = 'Sequence contains no elements.';
    var argumentOutOfRange = 'Argument out of range';
    var objectDisposed = 'Object has been disposed';
    function checkDisposed() {
        if (this.isDisposed) {
            throw new Error(objectDisposed);
        }
    }

    // Shim in iterator support
    var $iterator$ = (typeof Symbol === 'object' && Symbol.iterator) ||
      '_es6shim_iterator_';
    // Firefox ships a partial implementation using the name @@iterator.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=907077#c14
    // So use that name if we detect it.
    if (window.Set && typeof new window.Set()['@@iterator'] === 'function') {
      $iterator$ = '@@iterator';
    }    
    