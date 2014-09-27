QUnit.module('Max');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Max_Int32_Empty', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.max();
    }).messages;
    equal(1, res.length);
    ok(res[0].value.kind === 'E' && res[0].value.exception !== null);
    ok(res[0].time === 250);
});

test('Max_Int32_Return', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.max();
    }).messages;
    res.assertEqual(onNext(250, 2), onCompleted(250));
});

test('Max_Int32_Some', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, 3), onNext(220, 4), onNext(230, 2), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.max();
    }).messages;
    res.assertEqual(onNext(250, 4), onCompleted(250));
});

test('Max_Int32_Throw', function () {
    var ex, msgs, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onError(210, ex)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.max();
    }).messages;
    res.assertEqual(onError(210, ex));
});

test('Max_Int32_Never', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.max();
    }).messages;
    res.assertEqual();
});

test('MaxOfT_Comparer_Empty', function () {
    var msgs, res, reverseComparer, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onCompleted(250)];
    reverseComparer = function (a, b) {
        if (a > b) {
            return -1;
        }
        if (a < b) {
            return 1;
        }
        return 0;
    };
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.max(reverseComparer);
    }).messages;
    equal(1, res.length);
    ok(res[0].value.kind === 'E' && res[0].value.exception !== null);
    ok(res[0].time === 250);
});

test('MaxOfT_Comparer_Return', function () {
    var msgs, res, reverseComparer, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 'z'), onNext(210, 'a'), onCompleted(250)];
    reverseComparer = function (a, b) {
        if (a > b) {
            return -1;
        }
        if (a < b) {
            return 1;
        }
        return 0;
    };
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.max(reverseComparer);
    }).messages;
    res.assertEqual(onNext(250, 'a'), onCompleted(250));
});

test('MaxOfT_Comparer_Some', function () {
    var msgs, res, reverseComparer, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 'z'), onNext(210, 'b'), onNext(220, 'c'), onNext(230, 'a'), onCompleted(250)];
    reverseComparer = function (a, b) {
        if (a > b) {
            return -1;
        }
        if (a < b) {
            return 1;
        }
        return 0;
    };
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.max(reverseComparer);
    }).messages;
    res.assertEqual(onNext(250, 'a'), onCompleted(250));
});

test('MaxOfT_Comparer_Throw', function () {
    var ex, msgs, res, reverseComparer, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs = [onNext(150, 'z'), onError(210, ex)];
    reverseComparer = function (a, b) {
        if (a > b) {
            return -1;
        }
        if (a < b) {
            return 1;
        }
        return 0;
    };
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.max(reverseComparer);
    }).messages;
    res.assertEqual(onError(210, ex));
});

test('MaxOfT_Comparer_Never', function () {
    var msgs, res, reverseComparer, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 'z')];
    reverseComparer = function (a, b) {
        if (a > b) {
            return -1;
        }
        if (a < b) {
            return 1;
        }
        return 0;
    };
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.max(reverseComparer);
    }).messages;
    res.assertEqual();
});

test('MaxOfT_ComparerThrows', function () {
    var ex, msgs, res, reverseComparer, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs = [onNext(150, 'z'), onNext(210, 'b'), onNext(220, 'c'), onNext(230, 'a'), onCompleted(250)];
    reverseComparer = function (a, b) {
        throw ex;
    };
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.max(reverseComparer);
    }).messages;
    res.assertEqual(onError(220, ex));
});
