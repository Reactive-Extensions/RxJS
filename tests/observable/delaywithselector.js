QUnit.module('DelayWithSelector');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

// Delay with selector
test('Delay_Duration_Simple1', function () {
    var results, xs, scheduler;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 10), onNext(220, 30), onNext(230, 50), onNext(240, 35), onNext(250, 20), onCompleted(260));
    results = scheduler.startWithCreate(function () {
        return xs.delayWithSelector(function (x) {
            return scheduler.createColdObservable(onNext(x, '!'));
        });
    });
    results.messages.assertEqual(onNext(210 + 10, 10), onNext(220 + 30, 30), onNext(250 + 20, 20), onNext(240 + 35, 35), onNext(230 + 50, 50), onCompleted(280));
    xs.subscriptions.assertEqual(subscribe(200, 260));
});

test('Delay_Duration_Simple2', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onNext(250, 6), onCompleted(300));
    ys = scheduler.createColdObservable(onNext(10, '!'));
    results = scheduler.startWithCreate(function () {
        return xs.delayWithSelector(function () {
            return ys;
        });
    });
    results.messages.assertEqual(onNext(210 + 10, 2), onNext(220 + 10, 3), onNext(230 + 10, 4), onNext(240 + 10, 5), onNext(250 + 10, 6), onCompleted(300));
    xs.subscriptions.assertEqual(subscribe(200, 300));
    ys.subscriptions.assertEqual(subscribe(210, 220), subscribe(220, 230), subscribe(230, 240), subscribe(240, 250), subscribe(250, 260));
});

test('Delay_Duration_Simple3', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onNext(250, 6), onCompleted(300));
    ys = scheduler.createColdObservable(onNext(100, '!'));
    results = scheduler.startWithCreate(function () {
        return xs.delayWithSelector(function () {
            return ys;
        });
    });
    results.messages.assertEqual(onNext(210 + 100, 2), onNext(220 + 100, 3), onNext(230 + 100, 4), onNext(240 + 100, 5), onNext(250 + 100, 6), onCompleted(350));
    xs.subscriptions.assertEqual(subscribe(200, 300));
    ys.subscriptions.assertEqual(subscribe(210, 310), subscribe(220, 320), subscribe(230, 330), subscribe(240, 340), subscribe(250, 350));
});

test('Delay_Duration_Simple4_InnerEmpty', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onNext(250, 6), onCompleted(300));
    ys = scheduler.createColdObservable(onCompleted(100));
    results = scheduler.startWithCreate(function () {
        return xs.delayWithSelector(function () {
            return ys;
        });
    });
    results.messages.assertEqual(onNext(210 + 100, 2), onNext(220 + 100, 3), onNext(230 + 100, 4), onNext(240 + 100, 5), onNext(250 + 100, 6), onCompleted(350));
    xs.subscriptions.assertEqual(subscribe(200, 300));
    ys.subscriptions.assertEqual(subscribe(210, 310), subscribe(220, 320), subscribe(230, 330), subscribe(240, 340), subscribe(250, 350));
});

test('Delay_Duration_Dispose1', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onNext(250, 6), onCompleted(300));
    ys = scheduler.createColdObservable(onNext(200, '!'));
    results = scheduler.startWithDispose(function () {
        return xs.delayWithSelector(function () {
            return ys;
        });
    }, 425);
    results.messages.assertEqual(onNext(210 + 200, 2), onNext(220 + 200, 3));
    xs.subscriptions.assertEqual(subscribe(200, 300));
    ys.subscriptions.assertEqual(subscribe(210, 410), subscribe(220, 420), subscribe(230, 425), subscribe(240, 425), subscribe(250, 425));
});

test('Delay_Duration_Dispose2', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(400, 3), onCompleted(500));
    ys = scheduler.createColdObservable(onNext(50, '!'));
    results = scheduler.startWithDispose(function () {
        return xs.delayWithSelector(function () {
            return ys;
        });
    }, 300);
    results.messages.assertEqual(onNext(210 + 50, 2));
    xs.subscriptions.assertEqual(subscribe(200, 300));
    ys.subscriptions.assertEqual(subscribe(210, 260));
});
