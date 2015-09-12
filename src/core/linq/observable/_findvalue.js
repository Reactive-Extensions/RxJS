  function findValue (source, predicate, thisArg, yieldIndex) {
    var callback = bindCallback(predicate, thisArg, 3);
    return new AnonymousObservable(function (o) {
      var i = 0;
      return source.subscribe(function (x) {
        var shouldRun = tryCatch(callback)(x, i, source);
        if (shouldRun === errorObj) { return o.onError(shouldRun.e); }
        if (shouldRun) {
          o.onNext(yieldIndex ? i : x);
          o.onCompleted();
        } else {
          i++;
        }
      }, function (e) { o.onError(e); }, function () {
        yieldIndex && o.onNext(-1);
        o.onCompleted();
      });
    }, source);
  }
