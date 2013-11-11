QUnit.module('Observable');

var Scheduler = Rx.Scheduler,
    Observable = Rx.Observable;

test('Subscribe_None_Return', function () {
    Observable.returnValue(1, Scheduler.immediate).subscribe();
    ok(true);
});

test('Subscribe_None_Throw', function () {
    var e, ex;
    ex = 'ex';
    try {
        Observable.throwException(ex, Scheduler.immediate).subscribe();
    } catch (e1) {
        e = e1;
    }
    equal(e, ex);
});

test('Subscribe_None_Empty', function () {
    Observable.empty(Scheduler.immediate).subscribe(function () {
        ok(false);
    });
    ok(true);
});

test('Subscribe_OnNext_Return', function () {
    var x1 = -1;
    Observable.returnValue(42, Scheduler.immediate).subscribe(function (x) {
        x1 = x;
    });
    equal(42, x1);
});

test('Subscribe_OnNext_Throw', function () {
    var e, ex;
    ex = 'ex';
    try {
        Observable.throwException(ex, Scheduler.immediate).subscribe(function () {
            ok(false);
        });
    } catch (e1) {
        e = e1;
    }
    equal(e, ex);
});

test('Subscribe_OnNext_Empty', function () {
    Observable.empty(Scheduler.immediate).subscribe(function (x) {
        ok(false);
    });
    ok(true);
});

test('Subscribe_OnNext_Empty', function () {
    var finished = false, x1 = -1;
    Observable.returnValue(42, Scheduler.immediate).subscribe(function (x) {
        x1 = x;
    }, null, function () {
        finished = true;
    });
    equal(42, x1);
    ok(finished);
});

test('Subscribe_OnNextOnCompleted_Throw', function () {
    var e, ex;
    ex = 'ex';
    try {
        Observable.throwException(ex, Scheduler.immediate).subscribe(function () {
            ok(false);
        }, null, function () {
            ok(false);
        });
    } catch (e1) {
        e = e1;
    }
    equal(ex, e);
});

test('Subscribe_OnNextOnCompleted_Empty', function () {
    var finished = false;
    Observable.empty(Scheduler.immediate).subscribe(function () {
        ok(false);
    }, null, function () {
        finished = true;
    });
    ok(finished);
});