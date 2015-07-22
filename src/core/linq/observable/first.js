  /**
   * Returns the first element of an observable sequence that satisfies the condition in the predicate if present else the first item in the sequence.
   * @returns {Observable} Sequence containing the first element in the observable sequence that satisfies the condition in the predicate if provided, else the first item in the sequence.
   */
  observableProto.first = function () {
    var obj = {}, source = this;
    if (typeof arguments[0] === 'object') {
      obj = arguments[0];
    } else {
      obj = {
        predicate: arguments[0],
        thisArg: arguments[1],
        defaultValue: arguments[2]
      };
    }
    if (isFunction (obj.predicate)) {
      var fn = obj.predicate;
      obj.predicate = bindCallback(fn, obj.thisArg, 3);
    }
    return new AnonymousObservable(function (o) {
      var i = 0;
      return source.subscribe(
        function (x) {
          if (obj.predicate) {
            var res = tryCatch(obj.predicate)(x, i++, source);
            if (res === errorObj) { return o.onError(res.e); }
            if (res) {
              o.onNext(x);
              o.onCompleted();
            }
          } else if (!obj.predicate) {
            o.onNext(x);
            o.onCompleted();
          }
        },
        function (e) { o.onError(e); },
        function () {
          if (obj.defaultValue === undefined) {
            o.onError(new EmptyError());
          } else {
            o.onNext(obj.defaultValue);
            o.onCompleted();
          }
        });
    }, source);
  };
