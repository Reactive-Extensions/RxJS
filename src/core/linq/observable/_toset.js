  function toSet(source, type) {
    return new AnonymousObservable(function (observer) {
      var s = new type();
      return source.subscribe(
        s.add.bind(s),
        observer.onError.bind(observer),
        function () {
          observer.onNext(s);
          observer.onCompleted();
        });
    });
  }