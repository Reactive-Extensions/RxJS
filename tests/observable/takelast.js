QUnit.module('TakeLast');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('TakeLast_Zero_Completed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
    results = scheduler.startWithCreate(function () {
        return xs.takeLast(0);
    });
    results.messages.assertEqual(onCompleted(650));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLast_Zero_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
    results = scheduler.startWithCreate(function () {
        return xs.takeLast(0);
    });
    results.messages.assertEqual(onError(650, ex));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLast_Zero_Disposed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
    results = scheduler.startWithCreate(function () {
        return xs.takeLast(0);
    });
    results.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});

test('TakeLast_One_Completed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
    results = scheduler.startWithCreate(function () {
        return xs.takeLast(1);
    });
    results.messages.assertEqual(onNext(650, 9), onCompleted(650));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLast_One_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
    results = scheduler.startWithCreate(function () {
        return xs.takeLast(1);
    });
    results.messages.assertEqual(onError(650, ex));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLast_One_Disposed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
    results = scheduler.startWithCreate(function () {
        return xs.takeLast(1);
    });
    results.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});

test('TakeLast_Three_Completed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
    results = scheduler.startWithCreate(function () {
        return xs.takeLast(3);
    });
    results.messages.assertEqual(onNext(650, 7), onNext(650, 8), onNext(650, 9), onCompleted(650));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLast_Three_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
    results = scheduler.startWithCreate(function () {
        return xs.takeLast(3);
    });
    results.messages.assertEqual(onError(650, ex));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLast_Three_Disposed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
    results = scheduler.startWithCreate(function () {
        return xs.takeLast(3);
    });
    results.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});
