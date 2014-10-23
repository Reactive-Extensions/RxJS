  function MockPromise(scheduler, messages) {
    var promise = this;
    this.scheduler = scheduler;
    this.messages = messages;
    this.resolvers = [];

    for (var i = 0, len = this.messages.length; i < len; i++) {
      var message = this.messages[i],
        notification = message.value;
      (function (innerNotification) {
        scheduler.scheduleAbsoluteWithState(null, message.time, function () {
          var resolvers = promise.resolvers.slice(0);

          for (var j = 0, jLen = resolvers.length; j < jLen; j++) {
            innerNotification.accept(resolvers[j]);
          }
          return disposableEmpty;
        });
      })(notification);
    }
  }

  MockPromise.prototype.then = function (onResolved, onRejected) {
    this.resolvers.push({onResolved: onResolved, onRejected: onRejected});
    return new MockPromise(this.scheduler, []);
  };  
