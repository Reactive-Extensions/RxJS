  function flatMap(source, selector, thisArg) {
    var selectorFn = isFunction(selector) ? bindCallback(selector, thisArg, 3) : function () { return selector; };
    return new AnonymousObservable(function(observer) {
      var sad = new SingleAssignmentDisposable();
      var g = new CompositeDisposable();
      g.add(sad);
      var isStopped = false;
      var i = 0;
      sad.setDisposable(source.subscribe(
        function (value) {
          try {
            var collection = selectorFn(value, i++, source);
          } catch (e) {
            return observer.onError(e);
          }

          isPromise(collection) && (collection = observableFromPromise(collection));
          (isArrayLike(collection) || isIterable(collection)) && (result = observableFrom(collection));

          var innerSad = new SingleAssignmentDisposable();
          g.add(innerSad);
          innerSad.setDisposable(collection.subscribe(
            function (x) {
              observer.onNext(x);
            },
            function (e) {
              observer.onError(e);
            },
            function () {
              g.length === 1 && isStopped && observer.onCompleted();
            }
          ));
        },
        function (e) {
          observer.onError(e);
        },
        function () {
          isStopped = true;
          g.length === 1 && observer.onCompleted();
        }
      ));

      return new CompositeDisposable(sad, g);
    });
  }

  /**
   *  One of the Following:
   *  Projects each element of an observable sequence to an observable sequence and merges the resulting observable sequences into one observable sequence.
   *
   * @example
   *  var res = source.selectMany(function (x) { return Rx.Observable.range(0, x); });
   *  Or:
   *  Projects each element of an observable sequence to an observable sequence, invokes the result selector for the source element and each of the corresponding inner sequence's elements, and merges the results into one observable sequence.
   *
   *  var res = source.selectMany(function (x) { return Rx.Observable.range(0, x); }, function (x, y) { return x + y; });
   *  Or:
   *  Projects each element of the source observable sequence to the other observable sequence and merges the resulting observable sequences into one observable sequence.
   *
   *  var res = source.selectMany(Rx.Observable.fromArray([1,2,3]));
   * @param {Function} selector A transform function to apply to each element or an observable sequence to project each element from the source sequence onto which could be either an observable or Promise.
   * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
   * @param {Any} [thisArg] Object to use as this when executing callback.
   * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.
   */
  observableProto.selectMany = observableProto.flatMap = function (selector, resultSelector, thisArg) {
    if (isFunction(selector) && isFunction(resultSelector)) {
      return this.flatMap(function (x, i) {
        var selectorResult = selector(x, i);
        isPromise(selectorResult) && (selectorResult = observableFromPromise(selectorResult));
        (isArrayLike(selectorResult) || isIterable(selectorResult)) && (selectorResult = observableFrom(selectorResult));

        return selectorResult.map(function (y, i2) {
          return resultSelector(x, y, i, i2);
        });
      }, thisArg);
    }
    return flatMap(this, selector, thisArg);
  };
