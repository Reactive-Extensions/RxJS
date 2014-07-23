  /**
   *  Returns an observable sequence that produces a value after dueTime has elapsed and then after each period.
   *  
   * @example
   *  1 - res = Rx.Observable.timer(new Date());
   *  2 - res = Rx.Observable.timer(new Date(), 1000);
   *  3 - res = Rx.Observable.timer(new Date(), Rx.Scheduler.timeout);
   *  4 - res = Rx.Observable.timer(new Date(), 1000, Rx.Scheduler.timeout);
   *  
   *  5 - res = Rx.Observable.timer(5000);
   *  6 - res = Rx.Observable.timer(5000, 1000);
   *  7 - res = Rx.Observable.timer(5000, Rx.Scheduler.timeout);
   *  8 - res = Rx.Observable.timer(5000, 1000, Rx.Scheduler.timeout);
   *  
   * @param {Number} dueTime Absolute (specified as a Date object) or relative time (specified as an integer denoting milliseconds) at which to produce the first value.
   * @param {Mixed} [periodOrScheduler]  Period to produce subsequent values (specified as an integer denoting milliseconds), or the scheduler to run the timer on. If not specified, the resulting timer is not recurring.
   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, the timeout scheduler is used.
   * @returns {Observable} An observable sequence that produces a value after due time has elapsed and then each period.
   */
  var observableTimer = Observable.timer = function (dueTime, periodOrScheduler, scheduler) {
    var period;
    isScheduler(scheduler) || (scheduler = timeoutScheduler);
    if (periodOrScheduler !== undefined && typeof periodOrScheduler === 'number') {
      period = periodOrScheduler;
    } else if (periodOrScheduler !== undefined && typeof periodOrScheduler === 'object') {
      scheduler = periodOrScheduler;
    }
    if (dueTime instanceof Date && period === undefined) {
      return observableTimerDate(dueTime.getTime(), scheduler);
    }
    if (dueTime instanceof Date && period !== undefined) {
      period = periodOrScheduler;
      return observableTimerDateAndPeriod(dueTime.getTime(), period, scheduler);
    }
    return period === undefined ?
      observableTimerTimeSpan(dueTime, scheduler) :
      observableTimerTimeSpanAndPeriod(dueTime, period, scheduler);
  };
