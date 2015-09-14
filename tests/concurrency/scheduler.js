(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, ok, equal */
  QUnit.module('Scheduler');

  var Scheduler = Rx.Scheduler;

  var MyScheduler = (function () {

    function defaultNow() {
      return new Date().getTime();
    }

    function schedule(state, action) {
      return action(this, state);
    }

    function scheduleRelative(state, dueTime, action) {
      var self = this;
      this.check(function (o) {
          return action(self, o);
      }, state, dueTime);
      this.waitCycles += dueTime;
      return action(this, state);
    }

    function scheduleAbsolute(state, dueTime, action) {
      return this.scheduleFuture(state, dueTime - this.now(), action);
    }

    return function (now) {
      var nowFunc = now === undefined ? defaultNow : function () { return now; };
      var scheduler = new Scheduler(nowFunc, schedule, scheduleRelative, scheduleAbsolute);
      scheduler.waitCycles = 0;

      return scheduler;
    };
  }());

  test('scheduler ScheduleNonRecursive', function () {
      var ms = new MyScheduler();
      var res = false;
      ms.scheduleRecursive(function () {
  	    res = true;
      });
      ok(res);
  });

  test('scheduler ScheduleRecursive', function () {
      var ms = new MyScheduler();
      var i = 0;
      ms.scheduleRecursive(function (a) {
  	    if (++i < 10) {
  	        a();
  	    }
      });
      equal(10, i);
  });

  test('scheduler ScheduleWithTimeNonRecursive', function () {
      var now = new Date().getTime();
      var ms = new MyScheduler(now);
      var res = false;
      ms.check = function (a, s, t) {
  	    equal(t, 0);
      };
      ms.scheduleWithAbsolute(now, function () {
  	    res = true;
      });
      ok(res);
      equal(ms.waitCycles, 0);
  });

  test('scheduler ScheduleWithTimeRecursive', function () {
      var now = new Date().getTime();
      var i = 0;
      var ms = new MyScheduler(now);
      ms.check = function (a, s, t) {
          equal(t, 0);
      };

      ms.scheduleRecursiveWithAbsolute(now, function (a) {
  	    if (++i < 10) {
  	        a(now);
  	    }
      });

      equal(ms.waitCycles, 0);
      equal(10, i);
  });

  test('scheduler ScheduleWithTimeSpanNonRecursive', function () {
      var now = new Date().getTime();
      var ms = new MyScheduler(now);
      ms.check = function (a, s, t) {
  	    equal(t, 0);
      };

      var res = false;
      ms.scheduleRecursiveWithRelative(0, function () {
  	    res = true;
      });

      ok(res);
      equal(ms.waitCycles, 0);
  });

  test('scheduler schedule with time recursive', function () {
    var now = new Date().getTime();
    var i = 0;
    var ms = new MyScheduler(now);
    ms.check = function (a, s, t) {
	    return ok(t < 10);
    };

    ms.scheduleRecursiveWithRelative(0, function (a) {
	    if (++i < 10) { a(i); }
    });

    equal(ms.waitCycles, 45);
    equal(10, i);
  });

  test('catch builtin swallow shallow', function () {
    var swallow = Scheduler.immediate.catchError(function () { return true; });
    swallow.schedule(null, function () { throw new Error('Should be swallowed'); });
    ok(true);
  });

  test('catch builtin swallow recursive', function () {
      var swallow = Scheduler.immediate.catchError(function () { return true; });
      swallow.schedule(42, function (self) {
        return self.schedule(null, function () { new Error('Should be swallowed'); });
      });
      ok(true);
  });

  var disposableEmpty = Rx.Disposable.empty;

  var MyExceptionScheduler = (function () {
    function getNow() {
      return new Date().getTime();
    }

    function scheduleNow(state, action) {
      try {
        return action(this, state);
      } catch (e) {
        this._onError(e);
        return disposableEmpty;
      }
    }

    function notSupported() {
      throw new Error('not supported');
    }

    function schedulePeriodic(state, period, action) {
      Scheduler.immediate.schedule(this, function (_, self) {
        try {
          var s = state;
          for(var i = 0; true; i++) {
            if (i > 10) { break; }
            s = action(s);
          }
        } catch (e) {
          self._onError(e);
        }
      });
    }

    return function (onError) {
      var scheduler = new Scheduler(getNow, scheduleNow, notSupported, notSupported);
      scheduler._onError = onError;
      scheduler.schedulePeriodicWithState = schedulePeriodic.bind(scheduler);
      return scheduler;
    };
  }());

  test('catch custom unhandled', function () {
    var err;
    var scheduler = new MyExceptionScheduler(function (ex) { err = ex; });

    scheduler
      .catchError(function () { return true; })
      .schedule(null, function () { throw new Error('Should be caught'); });

    ok(!err);

    var ex1 = 'error';
    scheduler
      .catchError(function () { return ex1 instanceof Error; })
      .schedule(null, function () { throw ex1; });

    equal(err, ex1);
  });

  test('catch custom periodic caught', function () {
    var err;

    var scheduler = new MyExceptionScheduler(function (ex) { err = ex; });

    var catcher = scheduler.catchError(function () { return true; });

    catcher.schedulePeriodicWithState(42, 0, function () {
      throw new Error('Should be caught');
    });

    ok(!err);
  });

  test('catch custom periodic uncaught', function () {
    var ex = new Error('Error1');

    var err;

    var scheduler = new MyExceptionScheduler(function (e) { err = e; });

    var catcher = scheduler.catchError(function (e) { return e instanceof String; });

    catcher.schedulePeriodicWithState(42, 0, function () { throw ex; });

    equal(err, ex);
  });

}());
