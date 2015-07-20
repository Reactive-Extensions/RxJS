  var DistinctUntilChangedObservable = (function(__super__) {
    inherits(DistinctUntilChangedObservable, __super__);
    function DistinctUntilChangedObservable(source, keyFn, comparer) {
      this.source = source;
      this.keyFn = keyFn;
      this.comparer = comparer;
      __super__.call(this);
    }

    DistinctUntilChangedObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new DistinctUntilChangedObserver(o, this.keyFn, this.comparer));
    };

    return DistinctUntilChangedObservable;
  }(ObservableBase));

  function DistinctUntilChangedObserver(o, keyFn, comparer) {
    this.o = o;
    this.keyFn = keyFn;
    this.comparer = comparer;
    this.hasCurrentKey = false;
    this.currentKey = null;
    this.isStopped = false;
  }

  DistinctUntilChangedObserver.prototype.onNext = function (x) {
    if (this.isStopped) { return; }
    var key = x;
    if (isFunction(this.keyFn)) {
      key = tryCatch(this.keyFn)(x);
      if (key === errorObj) { return this.o.onError(key.e); }
    }
    if (this.hasCurrentKey) {
      comparerEquals = tryCatch(this.comparer)(this.currentKey, key);
      if (comparerEquals === errorObj) { return this.o.onError(comparerEquals.e); }
    }
    if (!this.hasCurrentKey || !comparerEquals) {
      this.hasCurrentKey = true;
      this.currentKey = key;
      this.o.onNext(x);
    }
  };
  DistinctUntilChangedObserver.prototype.onError = function(e) {
    if (!this.isStopped) {
      this.isStopped = true;
      this.o.onError(e);
    }
  };
  DistinctUntilChangedObserver.prototype.onCompleted = function () {
    if (!this.isStopped) {
      this.isStopped = true;
      this.o.onCompleted();
    }
  };
  DistinctUntilChangedObserver.prototype.dispose = function() { this.isStopped = true; };
  DistinctUntilChangedObserver.prototype.fail = function (e) {
    if (!this.isStopped) {
      this.isStopped = true;
      this.o.onError(e);
      return true;
    }

    return false;
  };

  /**
  *  Returns an observable sequence that contains only distinct contiguous elements according to the keyFn and the comparer.
  * @param {Function} [keyFn] A function to compute the comparison key for each element. If not provided, it projects the value.
  * @param {Function} [comparer] Equality comparer for computed key values. If not provided, defaults to an equality comparer function.
  * @returns {Observable} An observable sequence only containing the distinct contiguous elements, based on a computed key value, from the source sequence.
  */
  observableProto.distinctUntilChanged = function (keyFn, comparer) {
    comparer || (comparer = defaultComparer);
    return new DistinctUntilChangedObservable(this, keyFn, comparer);
  };
