  var PairwiseObservable = (function (__super__) {
    inherits(PairwiseObservable, __super__);
    function PairwiseObservable(source) {
      this.source = source;
      __super__.call(this);
    }

    PairwiseObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new PairwiseObserver(o));
    };

    return PairwiseObservable;
  }(ObservableBase));

  var PairwiseObserver = (function(__super__) {
    inherits(PairwiseObserver, __super__);
    function PairwiseObserver(o) {
      this._o = o;
      this._p = null;
      this._hp = false;
      __super__.call(this);
    }

    PairwiseObserver.prototype.next = function (x) {
      if (this._hp) {
        this._o.onNext([this._p, x]);
      } else {
        this._hp = true;
      }
      this._p = x;
    };
    PairwiseObserver.prototype.error = function (err) { this._o.onError(err); };
    PairwiseObserver.prototype.completed = function () { this._o.onCompleted(); };

    return PairwiseObserver;
  }(AbstractObserver));

  /**
   * Returns a new observable that triggers on the second and subsequent triggerings of the input observable.
   * The Nth triggering of the input observable passes the arguments from the N-1th and Nth triggering as a pair.
   * The argument passed to the N-1th triggering is held in hidden internal state until the Nth triggering occurs.
   * @returns {Observable} An observable that triggers on successive pairs of observations from the input observable as an array.
   */
  observableProto.pairwise = function () {
    return new PairwiseObservable(this);
  };
