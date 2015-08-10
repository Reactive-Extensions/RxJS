  /**
   *  Generates an observable sequence of integral numbers within a specified range, using the specified scheduler to send out o messages.
   *
   * @example
   *  var res = Rx.Observable.range(0, 10);
   *  var res = Rx.Observable.range(0, 10, Rx.Scheduler.timeout);
   * @param {Number} start The value of the first integer in the sequence.
   * @param {Number} count The number of sequential integers to generate.
   * @param {Scheduler} [scheduler] Scheduler to run the generator loop on. If not specified, defaults to Scheduler.currentThread.
   * @returns {Observable} An observable sequence that contains a range of sequential integral numbers.
   */
  Observable.range = function (start, count, scheduler) {
    isScheduler(scheduler) || (scheduler = currentThreadScheduler);
    return new AnonymousObservable(function (o) {
      return scheduler.scheduleRecursive(0, function (i, self) {
        if (i < count) {
          o.onNext(start + i);
          self(i + 1);
        } else {
          o.onCompleted();
        }
      });
    });
  };
