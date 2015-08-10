(function () {
  module('DefaultScheduler');

  var DefaultScheduler = Rx.Scheduler.timeout;

  test('default now', function () {
    var res;
    res = DefaultScheduler.now() - new Date().getTime();
    ok(res < 1000);
  });

  asyncTest('default schedule', 1, function () {
    expect(1);
    DefaultScheduler.schedule(null, function () {
      ok(true);
      start();
    });
  });

  asyncTest('default schedule future', function () {
    expect(1);
    var startTime = new Date().getTime(), endTime;

    DefaultScheduler.scheduleFuture(null, 200, function () {
      endTime = new Date().getTime();
      ok(endTime - startTime > 180, endTime - startTime);
      start();
    });
  });

  asyncTest('Timeout_ScheduleActionCancel', 1, function () {
    var set = false;
    var d = DefaultScheduler.scheduleFuture(null, 200, function () { set = true; });

    d.dispose();

    setTimeout(function () {
      ok(!set);
      start();
    }, 400);
  });

}());﻿
