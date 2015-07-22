  /**
   * Returns the last element of an observable sequence that satisfies the condition in the predicate if specified, else the last element.
   * @returns {Observable} Sequence containing the last element in the observable sequence that satisfies the condition in the predicate.
   */
  observableProto.last = function () {
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
      var value, seenValue = false, i = 0;
      return source.subscribe(
        function (x) {
          if (obj.predicate) {
            var res = tryCatch(obj.predicate)(x, i++, source);
            if (res === errorObj) { return o.onError(res.e); }
            if (res) {
              seenValue = true;
              value = x;
            }
          } else if (!obj.predicate) {
            seenValue = true;
            value = x;
          }
        },
        function (e) { o.onError(e); },
        function () {
          if (seenValue) {
            o.onNext(value);
            o.onCompleted();
          }
          else if (obj.defaultValue === undefined) {
            o.onError(new EmptyError());
          } else {
            o.onNext(obj.defaultValue);
            o.onCompleted();
          }
        });
    }, source);
  };
