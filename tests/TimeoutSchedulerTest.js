/// <reference path="../rx.js" />

module('TimeoutSchedulerTest');

var root = Rx, TimeoutScheduler = root.Scheduler.timeout;

test('Timeout_Now', function () {
    var res;
    res = TimeoutScheduler.now() - new Date().getTime();
    ok(res < 1000);
});
asyncTest('Timeout_ScheduleAction', function () {
    var ran = false;
    TimeoutScheduler.schedule(function () {
        ran = true;
    });

    setTimeout(function () {
        ok(ran);
        start();
    }, 5);

});

asyncTest('ThreadPool_ScheduleActionDue', function () {
    var startTime = new Date().getTime(), endTime;
    TimeoutScheduler.scheduleWithRelative(200, function () {
        endTime = new Date().getTime();
    });

    setTimeout(function () {
        ok(endTime - startTime > 180, endTime - startTime);
        start();
    }, 400);
});

asyncTest('Timeout_ScheduleActionCancel', function () {
    var set = false
		            , d = TimeoutScheduler.scheduleWithRelative(200, function () {
		                set = true;
		            });
    d.dispose();
    setTimeout(function () {
        ok(!set);
        start();
    }, 400);
});