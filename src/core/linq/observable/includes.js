  var IncludesObservable = (function (__super__) {
    inherits(IncludesObservable, __super__);
    function IncludesObservable(source, elem, idx) {
      var n = +idx || 0;
      Math.abs(n) === Infinity && (n = 0);

      this.source = source;
      this._elem = elem;
      this._n = n;
      __super__.call(this);
    }

    IncludesObservable.prototype.subscribeCore = function (o) {
      if (this._n < 0) {
        o.onNext(false);
        o.onCompleted();
        return disposableEmpty;
      }

      return this.source.subscribe(new IncludesObserver(o, this._elem, this._n));
    };

    return IncludesObservable;
  }(ObservableBase));

  var IncludesObserver = (function (__super__) {
    inherits(IncludesObserver, __super__);
    function IncludesObserver(o, elem, n) {
      this._o = o;
      this._elem = elem;
      this._n = n;
      this._i = 0;
      __super__.call(this);
    }

    function comparer(a, b) {
      return (a === 0 && b === 0) || (a === b || (isNaN(a) && isNaN(b)));
    }

    IncludesObserver.prototype.next = function (x) {
      if (this._i++ >= this._n && comparer(x, this._elem)) {
        this._o.onNext(true);
        this._o.onCompleted();
      }
    };
    IncludesObserver.prototype.error = function (e) { this._o.onError(e); };
    IncludesObserver.prototype.completed = function () { this._o.onNext(false); this._o.onCompleted(); };

    return IncludesObserver;
  }(AbstractObserver));

  /**
   * Determines whether an observable sequence includes a specified element with an optional equality comparer.
   * @param searchElement The value to locate in the source sequence.
   * @param {Number} [fromIndex] An equality comparer to compare elements.
   * @returns {Observable} An observable sequence containing a single element determining whether the source sequence includes an element that has the specified value from the given index.
   */
  observableProto.includes = function (searchElement, fromIndex) {
    return new IncludesObservable(this, searchElement, fromIndex);
  };
