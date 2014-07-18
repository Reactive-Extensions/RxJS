  /**
   *  Takes elements for the specified duration until the specified end time, using the specified scheduler to run timers.
   *  
   * @example
   *  1 - res = source.takeUntilWithTime(new Date(), [optional scheduler]);
   *  2 - res = source.takeUntilWithTime(5000, [optional scheduler]);   
   * @param {Number | Date} endTime Time to stop taking elements from the source sequence. If this value is less than or equal to new Date(), the result stream will complete immediately.
   * @param {Scheduler} scheduler Scheduler to run the timer on.
   * @returns {Observable} An observable sequence with the elements taken until the specified end time.
   */
  observableProto.takeUntilWithTime = function (endTime, scheduler) {
    isScheduler(scheduler) || (scheduler = timeoutScheduler);
    var source = this, schedulerMethod = endTime instanceof Date ?
      'scheduleWithAbsolute' :
      'scheduleWithRelative';
    return new AnonymousObservable(function (observer) {
      return new CompositeDisposable(scheduler[schedulerMethod](endTime, function () {
        observer.onCompleted();
      }),  source.subscribe(observer));
    });
  };
