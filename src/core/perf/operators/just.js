  var JustObservable = (function(__super__) {
    inherits(JustObservable, __super__);
    function JustObservable(value, scheduler) {
      this.value = value;
      this.scheduler = scheduler;
      __super__.call(this);
    }

    JustObservable.prototype.subscribeCore = function (observer) {
      var sink = new FromArraySink(observer, this);
      return sink.run();
    };

    return JustObservable;
  }(ObservableBase));

  function JustSink(observer, parent) {
    this.observer = observer;
    this.parent = parent;
  }

  JustSink.prototype.run = function () {
    var observer = this.observer;
    function schedule(s, state) {
      observer.onNext(state);
      observer.onCompleted();
    }

    return this.parent.scheduler.scheduleWithState(this.parent.value, schedule);
  };
