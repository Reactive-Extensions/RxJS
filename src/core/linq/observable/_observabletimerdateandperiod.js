  function observableTimerDateAndPeriod(dueTime, period, scheduler) {
    var p = normalizeTime(period);
    return new AnonymousObservable(function (observer) {
      var count = 0, d = dueTime;
      return scheduler.scheduleRecursiveWithAbsolute(d, function (self) {
        var now;
        if (p > 0) {
          now = scheduler.now();
          d = d + p;
          if (d <= now) {
            d = now + p;
          }
        }
        observer.onNext(count++);
        self(d);
      });
    });
  }
