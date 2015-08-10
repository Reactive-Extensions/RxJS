  function tick(o) {
    return function innerTick(count) {
      o.onNext(count);
      return count + 1;
    };
  }

  function invokeStart(o, period) {
    var pendingTickCount = 0, periodic;
    return function (count, self) {
      pendingTickCount = 1;
      var d = new SingleAssignmentDisposable();
      periodic = d;
      d.setDisposable(self.schedulePeriodic(1, period, function (c) {
        if (++pendingTickCount === 1) {
          o.onNext(c);
          --pendingTickCount;
        }
        return c + 1;
      }));

      o.onNext(0);

      if (--pendingTickCount > 0) {
        var c = new SingleAssignmentDisposable();
        c.setDisposable(self.scheduleRecursive(1, function (c, recurse) {
          o.onNext(c);
          if (--pendingTickCount > 0) {
            recurse(c + 1);
          }
        }));
        return new CompositeDisposable(c, d);
      }
      return d;
    };
  }

  function observableTimerTimeSpanAndPeriod(dueTime, period, scheduler) {
    return dueTime === period ?
      new AnonymousObservable(function (o) {
        return scheduler.schedulePeriodic(0, period, tick(o));
      }) :
      new AnonymousObservable(function (o) {
        return scheduler.scheduleFuture(0, dueTime, invokeStart(o, period));
      });
  }
