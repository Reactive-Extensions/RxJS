  /**
   * Attaches a stop and wait observable to the current observable.
   * @param {Scheduler} [scheduler] Optional scheduler used for yielding values.
   * @returns {Observable} A stop and wait observable.
   */
  ControlledObservable.prototype.stopAndWait = function (scheduler) {
    return new StopAndWaitObservable(this, scheduler || Rx.Scheduler.currentThread);
  };
