  /**
   * Returns the first index at which a given element can be found in the observable sequence, or -1 if it is not present.
   * @param {Any} searchElement Element to locate in the array.
   * @param {Number} [fromIndex] The index to start the search.  If not specified, defaults to 0.
   * @returns {Observable} And observable sequence containing the first index at which a given element can be found in the observable sequence, or -1 if it is not present.
   */
  observableProto.indexOf = function(searchElement, fromIndex) {
    var source = this;
    return new AnonymousObservable(function (observer) {
      var i = 0, n = +fromIndex || 0;
      Math.abs(n) === Infinity && (n = 0);
      if (n < 0) {
        observer.onNext(-1);
        observer.onCompleted();
        return disposableEmpty;
      }
      return source.subscribe(
        function (x) {
          if (i >= n && x === searchElement) {
            observer.onNext(i);
            observer.onCompleted();
          }
          i++;
        },
        observer.onError.bind(observer),
        function () {
          observer.onNext(-1);
          observer.onCompleted();
        });
    });
  };