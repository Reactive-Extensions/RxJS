QUnit.module('Min');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Min_Int32_Empty', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.min();
    }).messages;
    equal(1, res.length);
    ok(res[0].value.kind === 'E' && res[0].value.exception !== null);
    ok(res[0].time === 250);
});

test('Min_Int32_Return', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.min();
    }).messages;
    res.assertEqual(onNext(250, 2), onCompleted(250));
});

test('Min_Int32_Some', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.min();
    }).messages;
    res.assertEqual(onNext(250, 2), onCompleted(250));
});

test('Min_Int32_Throw', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
    res = scheduler.startWithCreate(function () {
        return xs.min();
    }).messages;
    res.assertEqual(onError(210, ex));
});

test('Min_Int32_Never', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1));
    res = scheduler.startWithCreate(function () {
        return xs.min();
    }).messages;
    res.assertEqual();
});

test('MinOfT_Comparer_Empty', function () {
    var comparer, res, scheduler, xs;
    scheduler = new TestScheduler();
    comparer = function (a, b) {
        if (a > b) {
            return -1;
        }
        if (a === b) {
            return 0;
        }
        return 1;
    };
    xs = scheduler.createHotObservable(onNext(150, 'a'), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.min(comparer);
    }).messages;
    equal(1, res.length);
    ok(res[0].value.kind === 'E' && res[0].value.exception !== null);
    ok(res[0].time === 250);
});

test('MinOfT_Comparer_Empty', function () {
    var comparer, res, scheduler, xs;
    scheduler = new TestScheduler();
    comparer = function (a, b) {
        if (a > b) {
            return -1;
        }
        if (a === b) {
            return 0;
        }
        return 1;
    };
    xs = scheduler.createHotObservable(onNext(150, 'z'), onNext(210, "b"), onNext(220, "c"), onNext(230, "a"), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.min(comparer);
    }).messages;
    res.assertEqual(onNext(250, "c"), onCompleted(250));
});

test('MinOfT_Comparer_Throw', function () {
    var comparer, ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    comparer = function (a, b) {
        if (a > b) {
            return -1;
        }
        if (a === b) {
            return 0;
        }
        return 1;
    };
    xs = scheduler.createHotObservable(onNext(150, 'z'), onError(210, ex));
    res = scheduler.startWithCreate(function () {
        return xs.min(comparer);
    }).messages;
    res.assertEqual(onError(210, ex));
});

test('MinOfT_Comparer_Never', function () {
    var comparer, res, scheduler, xs;
    scheduler = new TestScheduler();
    comparer = function (a, b) {
        if (a > b) {
            return -1;
        }
        if (a === b) {
            return 0;
        }
        return 1;
    };
    xs = scheduler.createHotObservable(onNext(150, 'z'));
    res = scheduler.startWithCreate(function () {
        return xs.min(comparer);
    }).messages;
    res.assertEqual();
});

test('MinOfT_ComparerThrows', function () {
    var comparer, ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    comparer = function (a, b) {
        throw ex;
    };
    xs = scheduler.createHotObservable(onNext(150, 'z'), onNext(210, "b"), onNext(220, "c"), onNext(230, "a"), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.min(comparer);
    }).messages;
    res.assertEqual(onError(220, ex));
});