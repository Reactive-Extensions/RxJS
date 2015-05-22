  var TakeObservable = (function(__super__) {
    inherits(TakeObservable, __super__);
    
    function TakeObservable(source, count) {
      this.source = source;
      this.takeCount = count;
      __super__.call(this);
    }
    
    TakeObservable.prototype.subscribeCore = function (o) {
      return this.source.subscribe(new InnerObserver(o, this.takeCount));
    };
    
    function InnerObserver(o, c) {
      this.o = o;
      this.c = c;
      this.r = c;
      this.isStopped = false;
    }
    InnerObserver.prototype = {
      onNext: function (x) {
        if (this.isStopped) { return; }
        if (this.r-- > 0) {
          this.o.onNext(x);
          this.r <= 0 && this.o.onCompleted();
        }
      },
      onError: function (err) {
        if (!this.isStopped) {
          this.isStopped = true;
          this.o.onError(err);
        }
      },
      onCompleted: function () {
        if (!this.isStopped) {
          this.isStopped = true;
          this.o.onCompleted();
        }
      },
      dispose: function () { this.isStopped = true; },
      fail: function (e) {
        if (!this.isStopped) {
          this.isStopped = true;
          this.o.onError(e);
          return true;
        }
        return false;
      }
    };
    
    return TakeObservable;
  }(ObservableBase));  
  
  /**
   *  Returns a specified number of contiguous elements from the start of an observable sequence, using the specified scheduler for the edge case of take(0).
   * @param {Number} count The number of elements to return.
   * @param {Scheduler} [scheduler] Scheduler used to produce an OnCompleted message in case <paramref name="count count</paramref> is set to 0.
   * @returns {Observable} An observable sequence that contains the specified number of elements from the start of the input sequence.
   */
  observableProto.take = function (count, scheduler) {
    if (count < 0) { throw new ArgumentOutOfRangeError(); }
    if (count === 0) { return observableEmpty(scheduler); }
    return new TakeObservable(this, count);
  };
