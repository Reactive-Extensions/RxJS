(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, ok, asyncTest, start */

  QUnit.module('defaultScheduler');

  var DefaultScheduler = Rx.Scheduler['default'];

  test('default now', function () {
    var res = DefaultScheduler.now() - new Date().getTime();
    ok(res < 1000);
  });

  asyncTest('default schedule action', 1, function () {
    DefaultScheduler.schedule(null, function () {
      ok(true);
      start();
    });
  });

  asyncTest('default schedule relative', 1, function () {
    var startTime = +new Date();

    DefaultScheduler.scheduleFuture(null, 200, function () {
      var endTime = +new Date();
      ok(endTime - startTime > 180, endTime - startTime);
      start();
    });
  });

  asyncTest('default schedule action cancel', 1, function () {
    var set = false;
    var d = DefaultScheduler.scheduleFuture(null, 200, function () { set = true; });

    d.dispose();

    setTimeout(function () {
      ok(!set);
      start();
    }, 400);
  });

}());﻿
