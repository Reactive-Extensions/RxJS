  /**
   *  Returns an observable sequence that produces a value after dueTime has elapsed and then after each period.
   *  
   * @example
   *  var res = Rx.Observable.timer(5000);
   *  var res = Rx.Observable.timer(5000, 1000);
   *  var res = Rx.Observable.timer(5000, Rx.Scheduler.timeout);
   *  var res = Rx.Observable.timer(5000, 1000, Rx.Scheduler.timeout);
   *  
   * @param {Number} dueTime Relative time (specified as an integer denoting milliseconds) at which to produce the first value.
   * @param {Mixed} [periodOrScheduler]  Period to produce subsequent values (specified as an integer denoting milliseconds), or the scheduler to run the timer on. If not specified, the resulting timer is not recurring.
   * @param {Scheduler} [scheduler]  Scheduler to run the timer on. If not specified, the timeout scheduler is used.
   * @returns {Observable} An observable sequence that produces a value after due time has elapsed and then each period.
   */
  var observableTimer = Observable.timer = function (dueTime, periodOrScheduler, scheduler) {
    var period;
    isScheduler(scheduler) || (scheduler = timeoutScheduler);
    if (typeof periodOrScheduler === 'number') {
      period = periodOrScheduler;
    } else if (typeof periodOrScheduler === 'object' && typeof periodOrScheduler.now === 'function') {
      scheduler = periodOrScheduler;
    }
    return notDefined(period) ?
      observableTimerTimeSpan(dueTime, scheduler) :
      observableTimerTimeSpanAndPeriod(dueTime, period, scheduler);
  };
