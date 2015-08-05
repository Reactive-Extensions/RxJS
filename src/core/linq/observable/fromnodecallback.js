  /**
   * Converts a Node.js callback style function to an observable sequence.  This must be in function (err, ...) format.
   * @param {Function} func The function to call
   * @param {Mixed} [ctx] The context for the func parameter to be executed.  If not specified, defaults to undefined.
   * @param {Function} [selector] A selector which takes the arguments from the callback minus the error to produce a single item to yield on next.
   * @returns {Function} An async function which when applied, returns an observable sequence with the callback arguments as an array.
   */
  Observable.fromNodeCallback = function (func, ctx, selector) {
    return function () {
      typeof ctx === 'undefined' && (ctx = this);

      var len = arguments.length, args = new Array(len);
      for(var i = 0; i < len; i++) { args[i] = arguments[i]; }

      var o = new AsyncSubject();

      function handler() {
        var err = arguments[0];
        if (err) { return o.onError(err); }

        var len = arguments.length, results = [];
        for(var i = 1; i < len; i++) { results[i - 1] = arguments[i]; }

        if (isFunction(selector)) {
          var results = tryCatch(selector).apply(ctx, results);
          if (results === errorObj) { return o.onError(results.e); }
          o.onNext(results);
        } else {
          if (results.length <= 1) {
            o.onNext(results[0]);
          } else {
            o.onNext(results);
          }
        }

        o.onCompleted();
      }

      args.push(handler);
      func.apply(ctx, args);

      return o.asObservable();
    };
  };
