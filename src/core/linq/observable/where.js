  /**
   *  Filters the elements of an observable sequence based on a predicate by incorporating the element's index.
   *
   * @example
   *  var res = source.where(function (value) { return value < 10; });
   *  var res = source.where(function (value, index) { return value < 10 || index < 10; });
   * @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
   * @param {Any} [thisArg] Object to use as this when executing callback.
   * @returns {Observable} An observable sequence that contains elements from the input sequence that satisfy the condition.
   */
  observableProto.where = observableProto.filter = function (predicate, thisArg) {
    var source = this;
    return new AnonymousObservable(function (observer) {
      var count = 0;
      return source.subscribe(function (value) {
        var shouldRun;
        try {
          shouldRun = predicate.call(thisArg, value, count++, source);
        } catch (e) {
          observer.onError(e);
          return;
        }
        shouldRun && observer.onNext(value);
      }, observer.onError.bind(observer), observer.onCompleted.bind(observer));
    }, source);
  };
