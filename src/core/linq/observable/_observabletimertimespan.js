  function observableTimerTimeSpan(dueTime, scheduler) {
    return new AnonymousObservable(function (observer) {
      return scheduler.scheduleFuture(dueTime, function () {
        observer.onNext(0);
        observer.onCompleted();
      });
    });
  }
