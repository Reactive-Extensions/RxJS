    function concatMap(selector) {
      return this.map(function (x, i) {
        var result = selector(x, i);
        return isPromise(result) ? observableFromPromise(result) : result;
      }).concatAll();
    }

    function concatMapObserver(onNext, onError, onCompleted) {
      var source = this;
      return new AnonymousObservable(function (observer) {
        var index = 0;

        return source.subscribe(
          function (x) {
            observer.onNext(onNext(x, index++));
          },
          function (err) {
            observer.onNext(onError(err));
            observer.completed();
          }, 
          function () {
            observer.onNext(onCompleted());
            observer.onCompleted();
          });
      }).concatAll();
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
     * @param selector A transform function to apply to each element or an observable sequence to project each element from the 
     * source sequence onto which could be either an observable or Promise.
     * @param {Function} [resultSelector]  A transform function to apply to each element of the intermediate sequence.
     * @returns {Observable} An observable sequence whose elements are the result of invoking the one-to-many transform function collectionSelector on each element of the input sequence and then mapping each of those sequence elements and their corresponding source element to a result element.   
     */
    observableProto.selectConcat = observableProto.concatMap = function (selector, resultSelector) {
      if (resultSelector) {
          return this.concatMap(function (x, i) {
            var selectorResult = selector(x, i),
              result = isPromise(selectorResult) ? observableFromPromise(selectorResult) : selectorResult;

            return result.map(function (y) {
              return resultSelector(x, y, i);
            });
          });
      }
      if (typeof selector === 'function') {
        return concatMap.call(this, selector);
      }
      return concatMap.call(this, function () {
        return selector;
      });
    };
