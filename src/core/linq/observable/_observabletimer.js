  function _observableTimer(dueTime, scheduler) {
    return new AnonymousObservable(function (observer) {
      return scheduler.scheduleFuture(null, dueTime, function () {
        observer.onNext(0);
        observer.onCompleted();
      });
    });
  }
