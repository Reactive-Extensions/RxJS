/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

(function(window) {

    // Check if browser vs node
    var root = window.Rx;

    QUnit.module('ImmediateSchedulerTest');

    var scheduler = root.Scheduler.immediate,
        disposableEmpty = root.Disposable.empty;

    test('Immediate_Now', function () {
        var res = scheduler.now() - new Date().getTime();
        ok(res < 1000);
    });

    test('Immediate_ScheduleAction', function () {
        var ran = false;
        scheduler.schedule(function () {
            ran = true;
        });
        ok(ran);
    });

    test('Immediate_ScheduleActionError', function () {
        var ex = 'ex';
        try {
            return scheduler.schedule(function () {
                throw ex;
            });
        } catch (e) {
            equal(e, ex);
        }
    });

    test('Immediate_Simple1', function () {
        var xx = 0;
        scheduler.scheduleWithState(42, function (self, x) { xx = x; return disposableEmpty; });
        equal(42, xx);
    });

    test('Immediate_Simple2', function () {
        var xx = 0;
        scheduler.scheduleWithAbsoluteAndState(42, new Date().getTime(), function (self, x) { xx = x; return disposableEmpty; });
        equal(42, xx);
    });

    test('Immediate_Simple3', function () {
        var xx = 0;
        scheduler.scheduleWithRelativeAndState(42, 0, function (self, x) { xx = x; return disposableEmpty; });
        equal(42, xx);
    });

    test('Immediate_Recursive1', function () {
        var xx = 0;
        var yy = 0;
        scheduler.scheduleWithState(42, function (self, x) {
            xx = x; 
            return self.scheduleWithState(43, function (self2, y) {
                yy = y;
                return disposableEmpty;
            })
        });
        equal(42, xx);
        equal(43, yy);
    });

    test('Immediate_Recursive2', function () {
        var xx = 0;
        var yy = 0;
        scheduler.scheduleWithAbsoluteAndState(42, new Date().getTime(), function (self, x) { 
            xx = x; 
            return self.scheduleWithAbsoluteAndState(43, new Date().getTime(), function (self2, y) {
                yy = y;
                return disposableEmpty;
            })
        });
        equal(42, xx);
        equal(43, yy);
    });

    test('Immediate_Recursive3', function () {
        var xx = 0;
        var yy = 0;
        scheduler.scheduleWithRelativeAndState(42, 0, function (self, x) { 
            xx = x; 
            return self.scheduleWithRelativeAndState(43, 0, function (self2, y) {
                yy = y;
                return disposableEmpty;
            })
        });
        equal(42, xx);
        equal(43, yy);
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    
}(typeof global == 'object' && global || this));
