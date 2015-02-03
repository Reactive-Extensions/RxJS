  var FlatMapObservable = (function(__super__) {
    inherits(FlatMapObservable, __super__)
    function FlatMapObservable(source, selector, thisArg) {
      this.source = source;
      this._selector = isFunction(selector) ? bindCallback(selector, thisArg, 3) : function () { return selector; };
      __super__.call(this);
    }

    FlatMapObservable.prototype.subscribeCore = function(observer) {
      var g = new CompositeDisposable(), sad = new SingleAssignmentDisposable();
      g.add(sad);
      sad.setDisposable(this.source.subscribe(new FlatMapObserver(this, g, observer)));
      return g;
    };

    return FlatMapObservable;
  }(ObservableBase));

  var FlatMapObserver = (function(__super__) {
    inherits(FlatMapObserver, __super__);
    function FlatMapObserver(parent, g, observer) {
      this._parent = parent;
      this._g = g;
      this._observer = observer;
      this._stopped = false;
      this._index = 0;
      __super__.call(this);
    }

    FlatMapObserver.prototype.next = function(outer) {
      try {
        var collection = this._parent._selector(outer, this._index++, this._parent);
      } catch(e) {
        return this._observer.onError(e);
      }

      isPromise(collection) && (collection = observableFromPromise(collection));
      (isArrayLike(collection) || isIterable(collection)) && (collection = observableFrom(collection));

      var sad = new SingleAssignmentDisposable();
      this._g.add(sad);
      var self = this;
      sad.setDisposable(collection.subscribe(
        function(inner) {
          self._observer.onNext(inner);
        },
        function(e) { self._observer.onError(e); },
        function() {
          self._g.remove(sad);
          self._stopped && self._g.length === 1 && self._observer.onCompleted();
        }
      ));
    };
    FlatMapObserver.prototype.error = function(e) {
      this._observer.onError(e);
    };
    FlatMapObserver.prototype.completed = function() {
      this._stopped = true;
      this._g.length === 1 && this._observer.onCompleted();
    };

    return FlatMapObserver;
  }(AbstractObserver));

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
    return new FlatMapObservable(this, selector, thisArg);
  };
