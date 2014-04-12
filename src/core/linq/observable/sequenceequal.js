  function sequenceEqualArray(first, second, comparer) {
      return new AnonymousObservable(function (observer) {
        var count = 0, len = second.length;
        return first.subscribe(function (value) {
          var equal = false;
          try {
            if (count < len) {
              equal = comparer(value, second[count++]);
            }
          } catch (e) {
            observer.onError(e);
            return;
          }
          if (!equal) {
            observer.onNext(false);
            observer.onCompleted();
          }
        }, observer.onError.bind(observer), function () {
          observer.onNext(count === len);
          observer.onCompleted();
        });
      });
  }

  /**
   *  Determines whether two sequences are equal by comparing the elements pairwise using a specified equality comparer.
   * 
   * @example
   * var res = res = source.sequenceEqual([1,2,3]);
   * var res = res = source.sequenceEqual([{ value: 42 }], function (x, y) { return x.value === y.value; });
   * 3 - res = source.sequenceEqual(Rx.Observable.returnValue(42));
   * 4 - res = source.sequenceEqual(Rx.Observable.returnValue({ value: 42 }), function (x, y) { return x.value === y.value; });
   * @param {Observable} second Second observable sequence or array to compare.
   * @param {Function} [comparer] Comparer used to compare elements of both sequences.
   * @returns {Observable} An observable sequence that contains a single element which indicates whether both sequences are of equal length and their corresponding elements are equal according to the specified equality comparer.
   */
  observableProto.sequenceEqual = function (second, comparer) {
    var first = this;
    comparer || (comparer = defaultComparer);
    if (Array.isArray(second)) {
      return sequenceEqualArray(first, second, comparer);
    }
    return new AnonymousObservable(function (observer) {
      var donel = false, doner = false, ql = [], qr = [];
      var subscription1 = first.subscribe(function (x) {
        var equal, v;
        if (qr.length > 0) {
            v = qr.shift();
            try {
              equal = comparer(v, x);
            } catch (e) {
              observer.onError(e);
              return;
            }
            if (!equal) {
              observer.onNext(false);
              observer.onCompleted();
            }
        } else if (doner) {
          observer.onNext(false);
          observer.onCompleted();
        } else {
          ql.push(x);
        }
      }, observer.onError.bind(observer), function () {
        donel = true;
        if (ql.length === 0) {
          if (qr.length > 0) {
            observer.onNext(false);
            observer.onCompleted();
          } else if (doner) {
            observer.onNext(true);
            observer.onCompleted();
          }
        }
      });

      isPromise(second) && (second = observableFromPromise(second));
      var subscription2 = second.subscribe(function (x) {
        var equal, v;
        if (ql.length > 0) {
          v = ql.shift();
          try {
            equal = comparer(v, x);
          } catch (exception) {
            observer.onError(exception);
            return;
          }
          if (!equal) {
            observer.onNext(false);
            observer.onCompleted();
          }
        } else if (donel) {
          observer.onNext(false);
          observer.onCompleted();
        } else {
          qr.push(x);
        }
      }, observer.onError.bind(observer), function () {
        doner = true;
        if (qr.length === 0) {
          if (ql.length > 0) {
            observer.onNext(false);
            observer.onCompleted();
          } else if (donel) {
            observer.onNext(true);
            observer.onCompleted();
          }
        }
      });
      return new CompositeDisposable(subscription1, subscription2);
    });
  };
