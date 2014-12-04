  function elementAtOrDefault(source, index, hasDefault, defaultValue) {
    if (index < 0) { throw new Error(argumentOutOfRange); }
    return new AnonymousObservable(function (observer) {
      var i = index;
      return source.subscribe(function (x) {
        if (i-- === 0) {
          observer.onNext(x);
          observer.onCompleted();
        }
      }, observer.onError.bind(observer), function () {
        if (!hasDefault) {
          observer.onError(new Error(argumentOutOfRange));
        } else {
          observer.onNext(defaultValue);
          observer.onCompleted();
        }
      });
    }, source);
  }
