(function () {

  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal, ok */

  QUnit.module('VirtualTimeScheduler');

  var VirtualTimeScheduler = Rx.VirtualTimeScheduler;

  var VirtualSchedulerTestScheduler = (function () {

    function comparer(a, b) {
      return a > b ? 1 : a < b ? -1 : 0;
    }

    function add(absolute, relative) {
      absolute == null && (absolute = '');
      return absolute + relative;
    }

    function toAbsoluteTime(absolute) {
      absolute == null && (absolute = '');
      return new Date(absolute.length);
    }

    function toRelative (timeSpan) {
      return String.fromCharCode(timeSpan % 65535);
    }

    return function () {
      var scheduler = new VirtualTimeScheduler(null, comparer);
      scheduler.add = add;
      scheduler.toAbsoluteTime = toAbsoluteTime;
      scheduler.toRelative = toRelative;
      return scheduler;
    };
  }());

  test('Virtual Now', function () {
    var res = new VirtualSchedulerTestScheduler().now() - new Date().getTime();
    ok(res < 1000);
  });

  test('Virtual Schedule Action', function () {
    var ran = false;

    var scheduler = new VirtualSchedulerTestScheduler();

    scheduler.schedule(null, function () { ran = true; });

    scheduler.start();

    ok(ran);
  });

  test('Virtual Schedule Action Error', function () {
    var error = new Error();

    try {
      var scheduler = new VirtualSchedulerTestScheduler();

      scheduler.schedule(error, function (_, e) {
        throw e;
      });

      scheduler.start();
      ok(false);
    } catch (e) {
      equal(e, error);
    }
  });

}());
