QUnit.module('Timeout');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Timeout_Duration_Simple_Never', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    ys = scheduler.createColdObservable();
    results = scheduler.startWithCreate(function () {
        return xs.timeoutWithSelector(ys, function () {
            return ys;
        });
    });
    results.messages.assertEqual(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    xs.subscriptions.assertEqual(subscribe(200, 450));
    ys.subscriptions.assertEqual(subscribe(200, 310), subscribe(310, 350), subscribe(350, 420), subscribe(420, 450));
});

test('Timeout_Duration_Simple_TimeoutFirst', function () {
    var results, scheduler, xs, ys, zs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    ys = scheduler.createColdObservable(onNext(100, 'boo!'));
    zs = scheduler.createColdObservable();
    results = scheduler.startWithCreate(function () {
        return xs.timeoutWithSelector(ys, function () {
            return zs;
        });
    });
    equal(1, results.messages.length);
    ok(results.messages[0].time === 300 && results.messages[0].value.exception !== null);
    xs.subscriptions.assertEqual(subscribe(200, 300));
    ys.subscriptions.assertEqual(subscribe(200, 300));
    zs.subscriptions.assertEqual();
});

test('Timeout_Duration_Simple_TimeoutLater', function () {
    var results, scheduler, xs, ys, zs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    ys = scheduler.createColdObservable();
    zs = scheduler.createColdObservable(onNext(50, 'boo!'));
    results = scheduler.startWithCreate(function () {
        return xs.timeoutWithSelector(ys, function () {
            return zs;
        });
    });
    equal(3, results.messages.length);
    ok(onNext(310, 1).equals(results.messages[0]));
    ok(onNext(350, 2).equals(results.messages[1]));
    ok(results.messages[2].time === 400 && results.messages[2].value.exception !== null);
    xs.subscriptions.assertEqual(subscribe(200, 400));
    ys.subscriptions.assertEqual(subscribe(200, 310));
    zs.subscriptions.assertEqual(subscribe(310, 350), subscribe(350, 400));
});

test('Timeout_Duration_Simple_TimeoutByCompletion', function () {
    var results, scheduler, xs, ys, zs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    ys = scheduler.createColdObservable();
    zs = scheduler.createColdObservable(onCompleted(50));
    results = scheduler.startWithCreate(function () {
        return xs.timeoutWithSelector(ys, function () {
            return zs;
        });
    });
    equal(3, results.messages.length);
    ok(onNext(310, 1).equals(results.messages[0]));
    ok(onNext(350, 2).equals(results.messages[1]));
    ok(results.messages[2].time === 400 && results.messages[2].value.exception !== null);
    xs.subscriptions.assertEqual(subscribe(200, 400));
    ys.subscriptions.assertEqual(subscribe(200, 310));
    zs.subscriptions.assertEqual(subscribe(310, 350), subscribe(350, 400));
});

test('Timeout_Duration_Simple_TimeoutByCompletion', function () {
    var ex, results, scheduler, xs, ys, zs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    ys = scheduler.createColdObservable();
    zs = scheduler.createColdObservable();
    results = scheduler.startWithCreate(function () {
        return xs.timeoutWithSelector(ys, function (x) {
            if (x < 3) {
                return zs;
            } else {
                throw ex;
            }
        });
    });
    results.messages.assertEqual(onNext(310, 1), onNext(350, 2), onNext(420, 3), onError(420, ex));
    xs.subscriptions.assertEqual(subscribe(200, 420));
    ys.subscriptions.assertEqual(subscribe(200, 310));
    zs.subscriptions.assertEqual(subscribe(310, 350), subscribe(350, 420));
});

test('Timeout_Duration_Simple_InnerThrows', function () {
    var ex, results, scheduler, xs, ys, zs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    ys = scheduler.createColdObservable();
    zs = scheduler.createColdObservable(onError(50, ex));
    results = scheduler.startWithCreate(function () {
        return xs.timeoutWithSelector(ys, function () {
            return zs;
        });
    });
    results.messages.assertEqual(onNext(310, 1), onNext(350, 2), onError(400, ex));
    xs.subscriptions.assertEqual(subscribe(200, 400));
    ys.subscriptions.assertEqual(subscribe(200, 310));
    zs.subscriptions.assertEqual(subscribe(310, 350), subscribe(350, 400));
});

test('Timeout_Duration_Simple_FirstThrows', function () {
    var ex, results, scheduler, xs, ys, zs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    ys = scheduler.createColdObservable(onError(50, ex));
    zs = scheduler.createColdObservable();
    results = scheduler.startWithCreate(function () {
        return xs.timeoutWithSelector(ys, function () {
            return zs;
        });
    });
    results.messages.assertEqual(onError(250, ex));
    xs.subscriptions.assertEqual(subscribe(200, 250));
    ys.subscriptions.assertEqual(subscribe(200, 250));
    zs.subscriptions.assertEqual();
});

test('Timeout_Duration_Simple_SourceThrows', function () {
    var ex, results, scheduler, xs, ys, zs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onError(450, ex));
    ys = scheduler.createColdObservable();
    zs = scheduler.createColdObservable();
    results = scheduler.startWithCreate(function () {
        return xs.timeoutWithSelector(ys, function () {
            return zs;
        });
    });
    results.messages.assertEqual(onNext(310, 1), onNext(350, 2), onNext(420, 3), onError(450, ex));
    xs.subscriptions.assertEqual(subscribe(200, 450));
    ys.subscriptions.assertEqual(subscribe(200, 310));
    zs.subscriptions.assertEqual(subscribe(310, 350), subscribe(350, 420), subscribe(420, 450));
});
