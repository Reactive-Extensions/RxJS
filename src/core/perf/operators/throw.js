  var ThrowObservable = (function(__super__) {
    inherits(ThrowObservable, __super__);
    function ThrowObservable(error, scheduler) {
      this.error = error;
      this.scheduler = scheduler;
      __super__.call(this);
    }

    ThrowObservable.prototype.subscribeCore = function (o) {
      var sink = new ThrowSink(o, this);
      return sink.run();
    };

    function ThrowSink(o, p) {
      this.o = o;
      this.p = p;
    }

    function scheduleItem(s, state) {
      var e = state[0], o = state[1];
      o.onError(e);
    }

    ThrowSink.prototype.run = function () {
      return this.p.scheduler.scheduleWithState([this.p.error, this.o], scheduleItem);
    };

    return ThrowObservable;
  }(ObservableBase));

  /**
   *  Returns an observable sequence that terminates with an exception, using the specified scheduler to send out the single onError message.
   *  There is an alias to this method called 'throwError' for browsers <IE9.
   * @param {Mixed} error An object used for the sequence's termination.
   * @param {Scheduler} scheduler Scheduler to send the exceptional termination call on. If not specified, defaults to Scheduler.immediate.
   * @returns {Observable} The observable sequence that terminates exceptionally with the specified exception object.
   */
  var observableThrow = Observable['throw'] = Observable.throwError = Observable.throwException = function (error, scheduler) {
    isScheduler(scheduler) || (scheduler = immediateScheduler);
    return new ThrowObservable(error, scheduler);
  };
