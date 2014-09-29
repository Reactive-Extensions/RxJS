  /**
   * Determines whether an observable sequence contains a specified element with an optional equality comparer.
   * @param searchElement The value to locate in the source sequence.
   * @param {Number} [fromIndex] An equality comparer to compare elements.
   * @returns {Observable} An observable sequence containing a single element determining whether the source sequence contains an element that has the specified value from the given index.
   */
  observableProto.contains = function (searchElement, fromIndex) {
    var source = this;
    function comparer(a, b) {
      return (a === 0 && b === 0) || (a === b || (isNaN(a) && isNaN(b)));
    }
    return new AnonymousObservable(function (observer) {
      var i = 0, n = +fromIndex || 0;
      Math.abs(n) === Infinity && (n = 0);
      if (n < 0) {
        observer.onNext(false);
        observer.onCompleted();
        return disposableEmpty;
      }
      return source.subscribe(
        function (x) {
          if (i++ >= n && comparer(x, searchElement)) {
            observer.onNext(true);
            observer.onCompleted();
          }
        },
        observer.onError.bind(observer),
        function () {
          observer.onNext(false);
          observer.onCompleted();
        });
    });
  };
