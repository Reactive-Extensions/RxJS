  /**
   *  Converts an iterable into an Observable sequence
   *  
   * @example
   *  var res = Rx.Observable.fromGenerator(new Map());
   *  var res = Rx.Observable.fromArray(new Set(), Rx.Scheduler.timeout);
   * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
   * @returns {Observable} The observable sequence whose elements are pulled from the given generator sequence.
   */
  Observable.fromIterable = function (iterable, scheduler) {
    scheduler || (scheduler = currentThreadScheduler);
    return new AnonymousObservable(function (observer) {
      var iterator;
      try {
        iterator = iterable[$iterator$]();
      } catch (e) {
        observer.onError(e);
        return;
      }

      return scheduler.scheduleRecursive(function (self) {
        var next = iterator.next();
        if (next.done) {
          observer.onCompleted();
        } else {
          observer.onNext(next.value);
          self();
        }
      });
    });
  };
