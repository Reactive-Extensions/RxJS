  function falseFactory() { return false; }

  /**
   * Merges the specified observable sequences into one observable sequence by using the selector function only when the (first) source observable sequence produces an element.
   * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
   */
  observableProto.withLatestFrom = function () {
    var len = arguments.length, args = new Array(len)
    for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
    var resultSelector = args.pop(), source = this;
    Array.isArray(args[0]) && (args = args[0]);

    return new AnonymousObservable(function (observer) {
      var n = args.length,
        hasValue = arrayInitialize(n, falseFactory),
        hasValueAll = false,
        values = new Array(n);

      var subscriptions = new Array(n + 1);
      for (var idx = 0; idx < n; idx++) {
        (function (i) {
          var other = args[i], sad = new SingleAssignmentDisposable();
          isPromise(other) && (other = observableFromPromise(other));
          sad.setDisposable(other.subscribe(function (x) {
            values[i] = x;
            hasValue[i] = true;
            hasValueAll = hasValue.every(identity);
          }, function (e) { observer.onError(e); }, noop));
          subscriptions[i] = sad;
        }(idx));
      }

      var sad = new SingleAssignmentDisposable();
      sad.setDisposable(source.subscribe(function (x) {
        var allValues = [x].concat(values);
        if (!hasValueAll) { return; }
        var res = tryCatch(resultSelector).apply(null, allValues);
        if (res === errorObj) { return observer.onError(res.e); }
        observer.onNext(res);
      }, function (e) { observer.onError(e); }, function () {
        observer.onCompleted();
      }));
      subscriptions[n] = sad;

      return new CompositeDisposable(subscriptions);
    }, this);
  };
