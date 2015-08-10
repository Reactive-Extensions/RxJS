(function () {
  QUnit.module('Scheduler');

  var Scheduler = Rx.Scheduler,
      isFunction = Rx.helpers.isFunction,
      inherits = Rx.internals.inherits;

  function defaultNow() {
    return isFunction(Date.now) ? Date.now() : +new Date;
  }

  var LocalScheduler = (function (__super__) {
    inherits(LocalScheduler, __super__);

    function LocalScheduler(now) {
      this.now = now != null ? function () { return now; } : +new Date();
      this.waitCycles = 0;
    }

    LocalScheduler.prototype.schedule = function (state, action) {
      return action(this, state);
    };

    LocalScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
      this.check(function (o) { return action(self, o); }, state, dueTime);
      this.waitCycles += dueTime;
      return action(this, state);
    };

    return LocalScheduler;
  }(Scheduler));

  test('schedule recursive non-recursive', function () {
    var ms = new LocalScheduler();

    var res = false;

    ms.scheduleRecursive(null, function () { res = true; });

    ok(res);
  });

  test('schedule recursive', function () {
    var ms = new LocalScheduler();

    var i = 0;

    ms.scheduleRecursive(null, function (_, a) { ++i < 10 && a(); });

    equal(10, i);
  });

  test('schedule absolute non-recursive', function () {
    var now = defaultNow();

    var ms = new LocalScheduler(now);

    var res = false;

    ms.check = function (a, s, t) { equal(t, 0); };

    ms.scheduleFuture(new Date(now), function () { res = true; });

    ok(res);

    equal(ms.waitCycles, 0);
  });

  test('Scheduler_ScheduleWithTimeSpanNonRecursive', function () {
    var now = defaultNow();

    var ms = new LocalScheduler(now);

    ms.check = function (a, s, t) { equal(t, 0); };

    var res = false;

    ms.scheduleRecursiveFuture(null, 0, function () { res = true; });

    ok(res);
    equal(ms.waitCycles, 0);
  });

  test('Scheduler_ScheduleWithTimeRecursive', function () {
    var now = defaultNow();

    var i = 0;

    var ms = new LocalScheduler(now);

    ms.check = function (a, s, t) {
	    return ok(t < 10);
    };

    ms.scheduleRecursiveFuture(null, 0, function (_, a) {
	    if (++i < 10) { a(i); }
    });

    equal(ms.waitCycles, 45);
    equal(10, i);
  });

}());
