  var PausableObservable = (function (_super) {

    inherits(PausableObservable, _super);

    function subscribe(observer) {
      var conn = this.source.publish(),
        subscription = conn.subscribe(observer),
        connection = disposableEmpty;

      var pausable = this.subject.distinctUntilChanged().subscribe(function (b) {
        if (b) {
          connection = conn.connect();
        } else {
          connection.dispose();
          connection = disposableEmpty;
        }
      });

      return new CompositeDisposable(subscription, connection, pausable);
    }

    function PausableObservable(source, subject) {
      this.source = source;
      this.subject = subject || new Subject();
      this.isPaused = true;
      _super.call(this, subscribe);
    }

    PausableObservable.prototype.pause = function () {
      if (this.isPaused === true){
        return;
      }
      this.isPaused = true;
      this.subject.onNext(false);
    };

    PausableObservable.prototype.resume = function () {
      if (this.isPaused === false){
        return;
      }
      this.isPaused = false;
      this.subject.onNext(true);
    };

    return PausableObservable;

  }(Observable));

  /**
   * Pauses the underlying observable sequence based upon the observable sequence which yields true/false.
   * @example
   * var pauser = new Rx.Subject();
   * var source = Rx.Observable.interval(100).pausable(pauser);
   * @param {Observable} pauser The observable sequence used to pause the underlying sequence.
   * @returns {Observable} The observable sequence which is paused based upon the pauser.
   */
  observableProto.pausable = function (pauser) {
    return new PausableObservable(this, pauser);
  };