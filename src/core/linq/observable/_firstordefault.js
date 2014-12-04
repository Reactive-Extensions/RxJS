  function firstOrDefaultAsync(source, hasDefault, defaultValue) {
    return new AnonymousObservable(function (observer) {
      return source.subscribe(function (x) {
        observer.onNext(x);
        observer.onCompleted();
      }, observer.onError.bind(observer), function () {
        if (!hasDefault) {
          observer.onError(new Error(sequenceContainsNoElements));
        } else {
          observer.onNext(defaultValue);
          observer.onCompleted();
        }
      });
    }, source);
  }
