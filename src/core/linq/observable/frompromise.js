  /**
   * Converts a Promise to an Observable sequence
   * @param {Promise} An ES6 Compliant promise.
   * @returns {Observable} An Observable sequence which wraps the existing promise success and failure.
   */
  var observableFromPromise = Observable.fromPromise = function (promise) {
    return new AnonymousObservable(function (observer) {
      promise.then(
        function (value) {
          observer.onNext(value);
          observer.onCompleted();
        }, 
        function (reason) {
          observer.onError(reason);
        });

      return function () {
        if (promise && promise.abort) {
          promise.abort();
        }
      }
    });
  };