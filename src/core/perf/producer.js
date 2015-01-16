  var Producer = Rx.internals.Producer = (function (__super__) {

    inherits(Producer, __super__);

    function subscribe(observer) {
      this.subscribeRaw(observer, true);
    }

    function Producer() {
      __super__.call(this, subscribe);
    }

    Producer.prototype.subscribeRaw = function (observer, enableSafeguard) {
      var sink = new SingleAssignmentDisposable(),
        subscription = new SingleAssignmentDisposable(),
        d = new CompositeDisposable(sink, subscription);

      function setDisposable(s) {
        sink.setDisposable(s);
      }

      enableSafeguard && (observer = SafeObserver.create(observer, d));

      if (currentThreadScheduler.scheduleRequired()) {
        currentThreadScheduler.scheduleWithState(this, function (_, me) {
          subscription.setDisposable(me.run(observer, subscription, setDisposable));
        });
      } else {
        subscription.setDisposable(this.run(observer, subscription, setDisposable));
      }

      return d;
    };

    return Producer;

  }(Observable));
