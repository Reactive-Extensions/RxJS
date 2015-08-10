(function () {
  QUnit.module('VirtualTimeScheduler');

  var VirtualTimeScheduler = Rx.VirtualTimeScheduler,
      inherits = Rx.internals.inherits;

  var VirtualSchedulerTestScheduler = (function (__super__) {
    inherits(VirtualSchedulerTestScheduler, __super__);

    function comparer(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    }

    function VirtualSchedulerTestScheduler() {
      __super__.call(null, comparer);
    }

    VirtualSchedulerTestScheduler.prototype.add = function (abs, rel) {
      abs == null && (abs = '');
      return abs + rel;
    };

    VirtualSchedulerTestScheduler.prototype.toAbsoluteTime = function (abs) {
      abs == null && (abs = '');
      return new Date(abs.length);
    };

    VirtualSchedulerTestScheduler.prototype.toRelative = function (ts) {
      return String.fromCharCode(ts % 65535);
    };

    return VirtualSchedulerTestScheduler;

  }(VirtualTimeScheduler));

  test('now', function () {
    var res = new VirtualSchedulerTestScheduler().now() - new Date().getTime();
    ok(res < 1000);
  });

  test('schedule', function () {
    var ran = false;

    var scheduler = new VirtualSchedulerTestScheduler();

    scheduler.schedule(null, function () { ran = true; });

    scheduler.start();

    ok(ran);
  });

  test('schedule error', function () {
    var error = new Error();

    try {
      var scheduler = new VirtualSchedulerTestScheduler();

      scheduler.schedule(null, function () { throw error; });

      scheduler.start();

      ok(false);
    } catch (e) {
      equal(e, error);
    }
  });

}());
