  /**
   *  Projects each element of an observable sequence into zero or more windows which are produced based on timing information.
   *  
   * @example
   *  1 - res = xs.windowWithTime(1000, scheduler); // non-overlapping segments of 1 second
   *  2 - res = xs.windowWithTime(1000, 500 , scheduler); // segments of 1 second with time shift 0.5 seconds
   *      
   * @param {Number} timeSpan Length of each window (specified as an integer denoting milliseconds).
   * @param {Mixed} [timeShiftOrScheduler]  Interval between creation of consecutive windows (specified as an integer denoting milliseconds), or an optional scheduler parameter. If not specified, the time shift corresponds to the timeSpan parameter, resulting in non-overlapping adjacent windows.
   * @param {Scheduler} [scheduler]  Scheduler to run windowing timers on. If not specified, the timeout scheduler is used.
   * @returns {Observable} An observable sequence of windows.
   */
  observableProto.windowWithTime = function (timeSpan, timeShiftOrScheduler, scheduler) {
    var source = this, timeShift;
    if (timeShiftOrScheduler === undefined) {
      timeShift = timeSpan;
    }
    isScheduler(scheduler) || (scheduler = timeoutScheduler);
    if (typeof timeShiftOrScheduler === 'number') {
      timeShift = timeShiftOrScheduler;
    } else if (isScheduler(timeShiftOrScheduler)) {
      timeShift = timeSpan;
      scheduler = timeShiftOrScheduler;
    }
    return new AnonymousObservable(function (observer) {
      var groupDisposable,
          nextShift = timeShift,
          nextSpan = timeSpan,
          q = [],
          refCountDisposable,
          timerD = new SerialDisposable(),
          totalTime = 0;
          groupDisposable = new CompositeDisposable(timerD),
          refCountDisposable = new RefCountDisposable(groupDisposable);

       function createTimer () {
        var m = new SingleAssignmentDisposable(),
            isSpan = false,
            isShift = false;
        timerD.setDisposable(m);
        if (nextSpan === nextShift) {
          isSpan = true;
          isShift = true;
        } else if (nextSpan < nextShift) {
            isSpan = true;
        } else {
          isShift = true;
        }
        var newTotalTime = isSpan ? nextSpan : nextShift,
            ts = newTotalTime - totalTime;
        totalTime = newTotalTime;
        if (isSpan) {
          nextSpan += timeShift;
        }
        if (isShift) {
          nextShift += timeShift;
        }
        m.setDisposable(scheduler.scheduleWithRelative(ts, function () {
          var s;
          if (isShift) {
            s = new Subject();
            q.push(s);
            observer.onNext(addRef(s, refCountDisposable));
          }
          if (isSpan) {
            s = q.shift();
            s.onCompleted();
          }
          createTimer();
        }));
      };
      q.push(new Subject());
      observer.onNext(addRef(q[0], refCountDisposable));
      createTimer();
      groupDisposable.add(source.subscribe(function (x) {
        for (var i = 0, len = q.length; i < len; i++) {
          q[i].onNext(x);
        }
      }, function (e) {
        for (var i = 0, len = q.length; i < len; i++) {
          q[i].onError(e);
        }
        observer.onError(e);
      }, function () {
        for (var i = 0, len = q.length; i < len; i++) {
          q[i].onCompleted();
        }
        observer.onCompleted();
      }));
      return refCountDisposable;
    });
  };