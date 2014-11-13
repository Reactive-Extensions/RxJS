  function MockPromise(scheduler, messages) {
    var message, notification, observable = this;
    this.scheduler = scheduler;
    this.messages = messages;
    this.subscriptions = [];
    this.observers = [];
    for (var i = 0, len = this.messages.length; i < len; i++) {
      message = this.messages[i];
      notification = message.value;
      (function (innerNotification) {
        scheduler.scheduleAbsoluteWithState(null, message.time, function () {
          var obs = observable.observers.slice(0);

          for (var j = 0, jLen = obs.length; j < jLen; j++) {
            innerNotification.accept(obs[j]);
          }
          return disposableEmpty;
        });
      })(notification);
    }
  }

  MockPromise.prototype.then = function (onResolved, onRejected) {
    var self = this;

    var observer = Rx.Observer.create(
      function (x) {
        onResolved(x);
        var idx = self.observers.indexOf(observer);
        self.observers.splice(idx, 1);
      },
      function (err) {
        onRejected(err);
        var idx = self.observers.indexOf(observer);
        self.observers.splice(idx, 1);
      }
    );
    this.observers.push(observer);

    return new MockPromise(this.scheduler, []);
  }
