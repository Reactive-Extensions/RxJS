(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, ok, equal */

  QUnit.module('immediateScheduler');

  var scheduler = Rx.Scheduler.immediate,
      disposableEmpty = Rx.Disposable.empty;

  test('immediateScheduler now', function () {
    var res = scheduler.now() - new Date().getTime();
    ok(res < 1000);
  });

  test('immediateScheduler schedule', function () {
    var ran = false;
    scheduler.schedule(function () { ran = true; });
    ok(ran);
  });

  test('immediateScheduler schedule error', function () {
    var ex = new Error();
    try {
      return scheduler.schedule(function () { throw ex; });
    } catch (e) {
      equal(e, ex);
    }
  });

  test('immediateScheduler schedule with state', function () {
    var xx = 0;
    scheduler.scheduleWithState(42, function (self, x) { xx = x; return disposableEmpty; });
    equal(42, xx);
  });

  test('immediateScheduler recursive', function () {
    var xx = 0;
    var yy = 0;
    scheduler.scheduleWithState(42, function (self, x) {
      xx = x;
      return self.scheduleWithState(43, function (self2, y) {
        yy = y;
        return disposableEmpty;
      });
    });
    equal(42, xx);
    equal(43, yy);
  });

}());
