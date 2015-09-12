(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, ok, equal */
  QUnit.module('currentThreadScheduler');

  var Scheduler = Rx.Scheduler;

  Scheduler.currentThread.ensureTrampoline = function (action) {
    if (this.scheduleRequired()) { this.schedule(null, action); } else { action(); }
  };

  test('current thread now', function () {
    var res = Scheduler.currentThread.now() - new Date().getTime();
    ok(res < 1000);
  });

  test('current thread schedule action', function () {
    var ran = false;

    Scheduler.currentThread.schedule(null, function () { ran = true; });

    ok(ran);
  });

  test('current thread schedule action error', function () {
    var error = new Error();

    try {
      Scheduler.currentThread.schedule(error, function (_, e) { throw e; });
      ok(false);
    } catch (e) {
      equal(e, error);
    }
  });

  test('current thread schedule nested', function () {
    var ran = false;

    Scheduler.currentThread.schedule(null, function () {
      Scheduler.currentThread.schedule(null, function () { ran = true; });
    });

    ok(ran);
  });

  test('current thread ensure trampoline', function () {
    var ran1 = false, ran2 = false;

    Scheduler.currentThread.ensureTrampoline(function () {
      Scheduler.currentThread.schedule(null, function () { ran1 = true; });
      Scheduler.currentThread.schedule(null, function () { ran2 = true; });
    });

    ok(ran1);
    ok(ran2);
  });

  test('current thread ensure trampoline nested', function () {
    var ran1 = false, ran2 = false;

    Scheduler.currentThread.ensureTrampoline(function () {
      Scheduler.currentThread.ensureTrampoline(function () { ran1 = true; });
      Scheduler.currentThread.ensureTrampoline(function () { ran2 = true; });
    });

    ok(ran1);
    ok(ran2);
  });

  test('current thread ensure trampoline and cancel', function () {
    var ran1 = false, ran2 = false;

    Scheduler.currentThread.ensureTrampoline(function () {
      Scheduler.currentThread.schedule(null, function () {
        ran1 = true;
        var d = Scheduler.currentThread.schedule(null, function () { ran2 = true; });
        d.dispose();
      });
    });

    ok(ran1);
    ok(!ran2);
  });

}());
