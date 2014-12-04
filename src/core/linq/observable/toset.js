
  /**
   * Converts the observable sequence to a Set if it exists.
   * @returns {Observable} An observable sequence with a single value of a Set containing the values from the observable sequence.
   */
  observableProto.toSet = function () {
    if (typeof root.Set === 'undefined') { throw new TypeError(); }
    var source = this;
    return new AnonymousObservable(function (observer) {
      var s = new root.Set();
      return source.subscribe(
        s.add.bind(s),
        observer.onError.bind(observer),
        function () {
          observer.onNext(s);
          observer.onCompleted();
        });
    }, source);
  };
