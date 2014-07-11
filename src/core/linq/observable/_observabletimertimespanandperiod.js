  function observableTimerTimeSpanAndPeriod(dueTime, period, scheduler) {
    if (dueTime === period) {
      return new AnonymousObservable(function (observer) {
        return scheduler.schedulePeriodicWithState(0, period, function (count) {
          observer.onNext(count);
          return count + 1;
        });
      });
    }
    return observableDefer(function () {
      return observableTimerDateAndPeriod(scheduler.now() + dueTime, period, scheduler);
    });
  }
