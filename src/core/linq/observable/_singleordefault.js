  function singleOrDefaultAsync(source, hasDefault, defaultValue) {
    return new AnonymousObservable(function (observer) {
      var value = defaultValue, seenValue = false;
      return source.subscribe(function (x) {
        if (seenValue) {
          observer.onError(new Error('Sequence contains more than one element'));
        } else {
          value = x;
          seenValue = true;
        }
      }, observer.onError.bind(observer), function () {
        if (!seenValue && !hasDefault) {
          observer.onError(new Error(sequenceContainsNoElements));
        } else {
          observer.onNext(value);
          observer.onCompleted();
        }
      });
    }, source);
  }
