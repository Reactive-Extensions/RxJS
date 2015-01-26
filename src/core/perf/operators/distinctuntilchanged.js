  var DistinctUntilChangedObservable = (function(__super__) {
    inherits(DistinctUntilChangedObservable, __super__);
    function DistinctUntilChangedObservable(source, keySelector, comparer) {
      this.source = source;
      this.keySelector = keySelector;
      this.comparer = comparer;
      __super__.call(this);
    }

    DistinctUntilChangedObservable.prototype.subscribeCore = function (observer) {
      return this.source.subcribe(new DistinctUntilChangedObserver(observer, keySelector, comparer));
    };

    return DistinctUntilChangedObservable;
  }(ObservableBase));

  var DistinctUntilChangedObserver = (function(__super__) {
    inherits(DistinctUntilChangedObserver, __super__);
    function DistinctUntilChangedObserver(observer, keySelector, comparer) {
      this.observer = observer;
      this.keySelector = keySelector;
      this.comparer = comparer;
      this.hasCurrentKey = false;
      this.currentKey = null;
      __super__.call(this);
    }

    DistinctUntilChangedObserver.prototype.next = function (x) {
      var key = x;
      if (this.keySelector) {
        try {
          key = keySelector(x);
        } catch (e) {
          this.observer.onError(e);
          return;
        }
      }
      if (this.hasCurrentKey) {
        try {
          var comparerEquals = this.comparer(this.currentKey, key);
        } catch (e) {
          this.observer.onError(e);
          return;
        }
      }
      if (!this.hasCurrentKey || !comparerEquals) {
        this.hasCurrentKey = true;
        this.currentKey = key;
        this.observer.onNext(value);
      }
    };
    DistinctUntilChangedObserver.prototype.error = function(e) { this.observer.onError(e); };
    DistinctUntilChangedObserver.prototype.completed = function () { this.observer.onCompleted(); };

    return DistinctUntilChangedObserver;
  }(AbstractObserver));

  /**
  *  Returns an observable sequence that contains only distinct contiguous elements according to the keySelector and the comparer.
  * @param {Function} [keySelector] A function to compute the comparison key for each element. If not provided, it projects the value.
  * @param {Function} [comparer] Equality comparer for computed key values. If not provided, defaults to an equality comparer function.
  * @returns {Observable} An observable sequence only containing the distinct contiguous elements, based on a computed key value, from the source sequence.
  */
  observableProto.distinctUntilChanged = function (keySelector, comparer) {
    comparer || (comparer = defaultComparer);
    return new DistinctUntilChangedObservable(this, keySelector, comparer);
  };
