  /**
   * Converts a callback function to an observable sequence.
   *
   * @param {Function} function Function with a callback as the last parameter to convert to an Observable sequence.
   * @param {Mixed} [context] The context for the func parameter to be executed.  If not specified, defaults to undefined.
   * @param {Function} [selector] A selector which takes the arguments from the callback to produce a single item to yield on next.
   * @returns {Function} A function, when executed with the required parameters minus the callback, produces an Observable sequence with a single value of the arguments to the callback as an array.
   */
  Observable.fromCallback = function (func, context, selector) {
    return function () {
      var len = arguments.length, args = new Array(len)
      for(var i = 0; i < len; i++) { args[i] = arguments[i]; }

      var subject = new AsyncSubject();

      function handler() {
        var len = arguments.length, results = new Array(len);
        for(var i = 0; i < len; i++) { results[i] = arguments[i]; }

        if (selector) {
          try {
            results = selector.apply(context, results);
          } catch (e) {
            return subject.onError(e);
          }

          subject.onNext(results);
        } else {
          if (results.length <= 1) {
            subject.onNext.apply(subject, results);
          } else {
            subject.onNext(results);
          }
        }

        subject.onCompleted();
      }

      args.push(handler);
      func.apply(context, args);

      return subject.asObservable();
    };
  };
