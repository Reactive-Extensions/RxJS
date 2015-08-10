(function () {
  QUnit.module('immediate scheduler');

  var scheduler = Rx.Scheduler.immediate,
      disposableEmpty = Rx.Disposable.empty;

  test('immediate ', function () {
    var res = scheduler.now() - new Date().getTime();
    ok(res < 1000);
  });

  test('schedule', function () {
    var ran = false;
    scheduler.schedule(null, function () { ran = true; });
    ok(ran);
  });

  test('schedule error', function () {
    var err = new Error();
    try {
      return scheduler.schedule(null, function () { throw err; });
    } catch (e) {
      equal(e, err);
    }
  });

  test('schedule normal', function () {
    var xx = 0;
    scheduler.schedule(42, function (self, x) { xx = x; return disposableEmpty; });
    equal(42, xx);
  });

  test('schedule recursive', function () {
    var xx = 0;
    var yy = 0;

    scheduler.schedule(null, 42, function (self, x) {
      xx = x;
      return self.schedule(null, 43, function (self2, y) {
        yy = y;
        return disposableEmpty;
      });
    });
    
    equal(42, xx);
    equal(43, yy);
  });

}());
