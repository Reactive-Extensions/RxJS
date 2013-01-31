/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

(function(window) {

    // Check if browser vs node
    var root = window.Rx;
    var Scheduler = root.Scheduler;

    QUnit.module('CurrentThreadSchedulerTest');

    test('CurrentThread_Now', function () {
        var res = Scheduler.currentThread.now() - new Date().getTime();
        ok(res < 1000);
    });

    test('CurrentThread_ScheduleAction', function () {
        var ran = false;
        Scheduler.currentThread.schedule(function () {
            ran = true;
        });
        ok(ran);
    });

    test('CurrentThread_ScheduleActionError', function () {
        var ex = 'ex';
        try {
            Scheduler.currentThread.schedule(function () {
                throw ex;
            });
            ok(false);
        } catch (e) {
            equal(e, ex);
        }
    });

    test('CurrentThread_ScheduleActionNested', function () {
        var ran = false;
        Scheduler.currentThread.schedule(function () {
            return Scheduler.currentThread.schedule(function () {
                ran = true;
            });
        });
        ok(ran);
    });

    test('CurrentThread_EnsureTrampoline', function () {
        var ran1 = false, ran2 = false;
        Scheduler.currentThread.ensureTrampoline(function () {
            Scheduler.currentThread.schedule(function () {
                ran1 = true;
            });
            return Scheduler.currentThread.schedule(function () {
                ran2 = true;
            });
        });
        ok(ran1);
        ok(ran2);
    });

    test('CurrentThread_EnsureTrampoline_Nested', function () {
        var ran1 = false, ran2 = false;
        Scheduler.currentThread.ensureTrampoline(function () {
            Scheduler.currentThread.ensureTrampoline(function () {
                ran1 = true;
            });
            return Scheduler.currentThread.ensureTrampoline(function () {
                ran2 = true;
            });
        });
        ok(ran1);
        ok(ran2);
    });

    test('CurrentThread_EnsureTrampolineAndCancel', function () {
        var ran1 = false, ran2 = false;
        Scheduler.currentThread.ensureTrampoline(function () {
            return Scheduler.currentThread.schedule(function () {
                var d;
                ran1 = true;
                d = Scheduler.currentThread.schedule(function () {
                    ran2 = true;
                });
                d.dispose();
            });
        });
        ok(ran1);
        ok(!ran2);
    });

    test('CurrentThread_EnsureTrampolineAndCancelTimed', function () {
        var ran1 = false, ran2 = false;
        Scheduler.currentThread.ensureTrampoline(function () {
            return Scheduler.currentThread.schedule(function () {
                ran1 = true;
                var d = Scheduler.currentThread.scheduleWithRelative(1000, function () {
                    ran2 = true;
                });
                d.dispose();
            });
        });
        ok(ran1);
        ok(!ran2);
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    
}(typeof global == 'object' && global || this));