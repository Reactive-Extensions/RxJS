QUnit.module('SkipLast');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('SkipLast_Zero_Completed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
    results = scheduler.startWithCreate(function () {
        return xs.skipLast(0);
    });
    results.messages.assertEqual(onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('SkipLast_Zero_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
    results = scheduler.startWithCreate(function () {
        return xs.skipLast(0);
    });
    results.messages.assertEqual(onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('SkipLast_Zero_Disposed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
    results = scheduler.startWithCreate(function () {
        return xs.skipLast(0);
    });
    results.messages.assertEqual(onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});

test('SkipLast_One_Completed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
    results = scheduler.startWithCreate(function () {
        return xs.skipLast(1);
    });
    results.messages.assertEqual(onNext(250, 2), onNext(270, 3), onNext(310, 4), onNext(360, 5), onNext(380, 6), onNext(410, 7), onNext(590, 8), onCompleted(650));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('SkipLast_One_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
    results = scheduler.startWithCreate(function () {
        return xs.skipLast(1);
    });
    results.messages.assertEqual(onNext(250, 2), onNext(270, 3), onNext(310, 4), onNext(360, 5), onNext(380, 6), onNext(410, 7), onNext(590, 8), onError(650, ex));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('SkipLast_One_Disposed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
    results = scheduler.startWithCreate(function () {
        return xs.skipLast(1);
    });
    results.messages.assertEqual(onNext(250, 2), onNext(270, 3), onNext(310, 4), onNext(360, 5), onNext(380, 6), onNext(410, 7), onNext(590, 8));
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});

test('SkipLast_Three_Completed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
    results = scheduler.startWithCreate(function () {
        return xs.skipLast(3);
    });
    results.messages.assertEqual(onNext(310, 2), onNext(360, 3), onNext(380, 4), onNext(410, 5), onNext(590, 6), onCompleted(650));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('SkipLast_Three_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
    results = scheduler.startWithCreate(function () {
        return xs.skipLast(3);
    });
    results.messages.assertEqual(onNext(310, 2), onNext(360, 3), onNext(380, 4), onNext(410, 5), onNext(590, 6), onError(650, ex));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('SkipLast_Three_Disposed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
    results = scheduler.startWithCreate(function () {
        return xs.skipLast(3);
    });
    results.messages.assertEqual(onNext(310, 2), onNext(360, 3), onNext(380, 4), onNext(410, 5), onNext(590, 6));
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});
