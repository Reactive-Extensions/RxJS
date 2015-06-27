  /**
   * Returns the last element of an observable sequence that satisfies the condition in the predicate if specified, else the last element.
   * @param {Function} [predicate] A predicate function to evaluate for elements in the source sequence.
   * @param {Any} [thisArg] Object to use as `this` when executing the predicate.
   * @returns {Observable} Sequence containing the last element in the observable sequence that satisfies the condition in the predicate.
   */
  observableProto.last = function (predicate, thisArg) {
    if (isFunction(predicate)) { return this.filter(predicate, thisArg).last(); }
    var source = this;
    return new AnonymousObservable(function (o) {
      var value, seenValue = false;
      return source.subscribe(function (x) {
        value = x;
      }, function (e) { o.onError(e); }, function () {
        o.onNext(value);
        o.onCompleted();
      });
    }, source);
  };
