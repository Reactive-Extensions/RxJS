  var FilterObservable = (function (__super__) {
    inherits(FilterObservable, __super__);

    function FilterObservable(source, predicate, thisArg) {
      this.source = source;
      this.predicate = bindCallback(predicate, thisArg, 3);
      __super__.call(this);
    }

    FilterObservable.prototype.subscribeCore = function (observer) {
      return this.source.subscribe(new FilterObserver(observer, this.predicate, this));
    };

    FilterObservable.prototype.internalFilter = function(predicate, thisArg) {
      var self = this;
      return new FilterObservable(this.source, function(x, i, o) { return self.predciate(x, i, o) && predicate(x, i, o); }, thisArg);
    };

    return FilterObservable;

  }(ObservableBase));

  var FilterObserver = (function (__super__) {
    inherits(FilterObserver, __super__);

    function FilterObserver(observer, predicate, source) {
      this.observer = observer;
      this.predicate = predicate;
      this.source = source;
      this.index = 0;
      __super__.call(this);
    }

    FilterObserver.prototype.next = function(x) {
      try {
        var shouldYield = this.predicate(x, this.index++, this.source);
      } catch(e) {
        this.observer.onError(e);
        return;
      }
      shouldYield && this.observer.onNext(x);
    };

    FilterObserver.prototype.error = function (e) {
      this.observer.onError(e);
    };

    FilterObserver.prototype.completed = function () {
      this.observer.onCompleted();
    };

    return FilterObserver;
  }(AbstractObserver));

  /**
  *  Filters the elements of an observable sequence based on a predicate by incorporating the element's index.
  * @param {Function} predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
  * @param {Any} [thisArg] Object to use as this when executing callback.
  * @returns {Observable} An observable sequence that contains elements from the input sequence that satisfy the condition.
  */
  observableProto.filter = observableProto.where = function (predicate, thisArg) {
    return this instanceof FilterObservable ?
      this.internalFilter(predicate, thisArg) :
      new FilterObservable(this, predicate, thisArg);
  };
