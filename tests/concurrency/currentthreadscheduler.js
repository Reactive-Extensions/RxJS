(function () {
  QUnit.module('CurrentThreadScheduler');

  var Scheduler = Rx.Scheduler;

  Scheduler.currentThread.ensureTrampoline = function (action) {
    if (this.scheduleRequired()) { this.schedule(action); } else { action(); }
  };

  test('CurrentThread_Now', function () {
    var res = Scheduler.currentThread.now() - new Date().getTime();
    ok(res < 1000);
  });

  test('CurrentThread_ScheduleAction', function () {
    var ran = false;

    Scheduler.currentThread.schedule(function () { ran = true; });

    ok(ran);
  });

  test('CurrentThread_ScheduleActionError', function () {
    var error = new Error();

    try {
      Scheduler.currentThread.schedule(function () { throw error; });
      ok(false);
    } catch (e) {
      equal(e, error);
    }
  });

  test('CurrentThread_ScheduleActionNested', function () {
    var ran = false;

    Scheduler.currentThread.schedule(function () {
      Scheduler.currentThread.schedule(function () { ran = true; });
    });

    ok(ran);
  });

  test('CurrentThread_EnsureTrampoline', function () {
    var ran1 = false, ran2 = false;

    Scheduler.currentThread.ensureTrampoline(function () {
      Scheduler.currentThread.schedule(function () { ran1 = true; });
      Scheduler.currentThread.schedule(function () { ran2 = true; });
    });

    ok(ran1);
    ok(ran2);
  });

  test('CurrentThread_EnsureTrampoline_Nested', function () {
    var ran1 = false, ran2 = false;

    Scheduler.currentThread.ensureTrampoline(function () {
      Scheduler.currentThread.ensureTrampoline(function () { ran1 = true; });
      Scheduler.currentThread.ensureTrampoline(function () { ran2 = true; });
    });

    ok(ran1);
    ok(ran2);
  });

  test('CurrentThread_EnsureTrampolineAndCancel', function () {
    var ran1 = false, ran2 = false;

    Scheduler.currentThread.ensureTrampoline(function () {
      Scheduler.currentThread.schedule(function () {
        ran1 = true;
        var d = Scheduler.currentThread.schedule(function () { ran2 = true; });
        d.dispose();
      });
    });

    ok(ran1);
    ok(!ran2);
  });

}());
﻿
