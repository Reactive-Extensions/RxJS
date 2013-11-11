QUnit.module('VirtualTimeScheduler');

var VirtualTimeScheduler = Rx.VirtualTimeScheduler;

var VirtualSchedulerTestScheduler = (function () {

    function comparer(a, b) {
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
        return 0;
    }

    function add(absolute, relative) {
        if (absolute === null) {
            absolute = '';
        }
        return absolute + relative;
    }

    function toDateTimeOffset(absolute) {
        if (absolute === null) {
            absolute = '';
        }
        return new Date(absolute.length);
    }

    function toRelative(timespan) {
        return String.fromCharCode(timeSpan % 65535);
    }

    return function () {
        var scheduler = new VirtualTimeScheduler(null, comparer);
        scheduler.add = add.bind(scheduler);
        scheduler.toDateTimeOffset = toDateTimeOffset.bind(scheduler);
        scheduler.toRelative = toRelative.bind(scheduler);
        return scheduler;
    };
}());

test('Virtual_Now', function () {
    var res;
    res = new VirtualSchedulerTestScheduler().now() - new Date().getTime();
    ok(res < 1000);
});

test('Virtual_ScheduleAction', function () {
    var ran, scheduler;
    ran = false;
    scheduler = new VirtualSchedulerTestScheduler();
    scheduler.schedule(function () {
        ran = true;
    });
    scheduler.start();
    ok(ran);
});

test('Virtual_ScheduleActionError', function () {
    var ex, scheduler;
    ex = 'ex';
    try {
        scheduler = new VirtualSchedulerTestScheduler();
        scheduler.schedule(function () {
            throw ex;
        });
        scheduler.start();
        ok(false);
    } catch (e) {
        equal(e, ex);
    }
});