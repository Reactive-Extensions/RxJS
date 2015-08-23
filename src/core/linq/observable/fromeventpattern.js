  /**
   * Creates an observable sequence from an event emitter via an addHandler/removeHandler pair.
   * @param {Function} addHandler The function to add a handler to the emitter.
   * @param {Function} [removeHandler] The optional function to remove a handler from an emitter.
   * @param {Function} [selector] A selector which takes the arguments from the event handler to produce a single item to yield on next.
   * @param {Scheduler} [scheduler] A scheduler used to schedule the remove handler.
   * @returns {Observable} An observable sequence which wraps an event from an event emitter
   */
  var fromEventPattern = Observable.fromEventPattern = function (addHandler, removeHandler, selector, scheduler) {
    isScheduler(scheduler) || (scheduler = immediateScheduler);
    return new AnonymousObservable(function (o) {
      function innerHandler () {
        var result = arguments[0];
        if (isFunction(selector)) {
          result = tryCatch(selector).apply(null, arguments);
          if (result === errorObj) { return o.onError(result.e); }
        }
        o.onNext(result);
      }

      var returnValue = addHandler(innerHandler);
      return disposableCreate(function () {
        isFunction(removeHandler) && removeHandler(innerHandler, returnValue);
      });
    }).publish().refCount();
  };
