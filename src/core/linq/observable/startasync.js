  /**
   * Invokes the asynchronous function, surfacing the result through an observable sequence.
   * @param {Function} asyncFn Asynchronous function which returns a Promise to run.
   * @returns {Observable} An observable sequence exposing the function's result value, or an exception.
   */
  Observable.startAsync = function (asyncFn) {
    var promise = tryCatch(asyncFn)();
    if (promise === errorObj) { return observableThrow(promise.e); }
    return observableFromPromise(promise);
  }
