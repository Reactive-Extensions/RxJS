(function (window) {
    module('TimeoutSchedulerTest');

    var root = window.Rx, TimeoutScheduler = root.Scheduler.timeout;

    test('Timeout_Now', function () {
        var res;
        res = TimeoutScheduler.now() - new Date().getTime();
        ok(res < 1000);
    });

    asyncTest('Timeout_ScheduleAction', 1, function () {
        expect(1);
        TimeoutScheduler.schedule(function () {
            ok(true);
            start();            
        });
    });

    asyncTest('ThreadPool_ScheduleActionDue', function () {
        expect(1);
        var startTime = new Date().getTime(), endTime;

        TimeoutScheduler.scheduleWithRelative(200, function () {
            endTime = new Date().getTime();
            ok(endTime - startTime > 180, endTime - startTime);
            start();
        });
    });

    asyncTest('Timeout_ScheduleActionCancel', 1, function () {
        var set = false;
        var d = TimeoutScheduler.scheduleWithRelative(200, function () {
            set = true;         
        });

        d.dispose();

        setTimeout(function () {
            ok(!set);
            start();
        }, 400);        
    });

    
}(this));
