  function toMap(source, type, keySelector, elementSelector) {
    return new AnonymousObservable(function (observer) {
      var m = new type();
      return source.subscribe(
        function (x) {
          var key;
          try {
            key = keySelector(x);
          } catch (e) {
            observer.onError(e);
            return;
          }

          var element = x;
          if (elementSelector) {
            try {
              element = elementSelector(x);
            } catch (e) {
              observer.onError(e);
              return;
            }              
          }

          m.set(key, element);
        },
        observer.onError.bind(observer),
        function () {
          observer.onNext(m);
          observer.onCompleted();
        });
    });
  }
