QUnit.module('Expand');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

function sequenceEqual(a1, a2) {
    if (a1.length !== a2.length) {
        return false;
    }
    for (var i = 0, len = a1.length; i < len; i++) {
        if (a1[i] !== a2[i]) {
            return false;
        }
    }
    return true;
}

test('Expand_Empty', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onCompleted(300));
    results = scheduler.startWithCreate(function () {
        return xs.expand(function () {
            return scheduler.createColdObservable(onNext(100, 1), onNext(200, 2), onCompleted(300));
        }, scheduler);
    });
    results.messages.assertEqual(onCompleted(300));
    xs.subscriptions.assertEqual(subscribe(201, 300));
});

test('Expand_Error', function () {
    var ex, results, scheduler, xs;
    scheduler = new TestScheduler();
    ex = 'ex';
    xs = scheduler.createHotObservable(onError(300, ex));
    results = scheduler.startWithCreate(function () {
        return xs.expand(function (x) {
            return scheduler.createColdObservable(onNext(100 + x, 2 * x), onNext(200 + x, 3 * x), onCompleted(300 + x));
        }, scheduler);
    });
    results.messages.assertEqual(onError(300, ex));
    xs.subscriptions.assertEqual(subscribe(201, 300));
});

test('Expand_Never', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable();
    results = scheduler.startWithCreate(function () {
        return xs.expand(function (x) {
            return scheduler.createColdObservable(onNext(100 + x, 2 * x), onNext(200 + x, 3 * x), onCompleted(300 + x));
        }, scheduler);
    });
    results.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(201, 1000));
});

test('Expand_Basic', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(550, 1), onNext(850, 2), onCompleted(950));
    results = scheduler.startWithCreate(function () {
        return xs.expand(function (x) {
            return scheduler.createColdObservable(onNext(100, 2 * x), onNext(200, 3 * x), onCompleted(300));
        }, scheduler);
    });
    results.messages.assertEqual(onNext(550, 1), onNext(651, 2), onNext(751, 3), onNext(752, 4), onNext(850, 2), onNext(852, 6), onNext(852, 6), onNext(853, 8), onNext(951, 4), onNext(952, 9), onNext(952, 12), onNext(953, 12), onNext(953, 12), onNext(954, 16));
    xs.subscriptions.assertEqual(subscribe(201, 950));
});

test('Expand_Throw', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(550, 1), onNext(850, 2), onCompleted(950));
    results = scheduler.startWithCreate(function () {
        return xs.expand(function (x) {
            throw ex;
        }, scheduler);
    });
    results.messages.assertEqual(onNext(550, 1), onError(550, ex));
    xs.subscriptions.assertEqual(subscribe(201, 550));
});
