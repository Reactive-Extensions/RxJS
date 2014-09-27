  /**
   *  Converts an array to an observable sequence, using an optional scheduler to enumerate the array.
   *
   * @example
   *  var res = Rx.Observable.fromArray([1,2,3]);
   *  var res = Rx.Observable.fromArray([1,2,3], Rx.Scheduler.timeout);
   * @param {Scheduler} [scheduler] Scheduler to run the enumeration of the input sequence on.
   * @returns {Observable} The observable sequence whose elements are pulled from the given enumerable sequence.
   */
  var observableFromArray = Observable.fromArray = function (array, scheduler) {
    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
    return new AnonymousObservable(function (observer) {
      var count = 0, len = array.length;
      return scheduler.scheduleRecursive(function (self) {
        if (count < len) {
          observer.onNext(array[count++]);
          self();
        } else {
          observer.onCompleted();
        }
      });
    });
  };
