    /**
     * Creates a sliding windowed observable based upon the window size.
     * @example
     * var
     * @param {Number} windowSize The number of items in the window
     * @param {Scheduler} [scheduler] Optional scheduler used for parameterization of concurrency. If not specified, defaults to Scheduler.timeout.
     * @returns {Observable} A windowed observable based upon the window size.
     */
    ControlledObservable.prototype.windowed = function (windowSize, scheduler) {
      return new WindowedObservable(this, windowSize, scheduler || Rx.Scheduler.currentThread);
    };
