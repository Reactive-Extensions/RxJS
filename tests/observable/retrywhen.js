QUnit.module('RetryWhen');


var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

test('RetryWhen_Observable_Cold_Basic', function () {
    var results, scheduler, xs, retry;
    scheduler = new TestScheduler();
    retry = new Subject();
    xs = scheduler.createColdObservable(onNext(100, 1), onNext(150, 2), onNext(200, 3), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.retryWhen(retry);
    });
    results.messages.assertEqual(onNext(300, 1), onNext(350, 2), onNext(400, 3), onCompleted(450));
    xs.subscriptions.assertEqual(subscribe(200, 450));
});

test('RetryWhen_Observable_Cold_Error_Continue', function () {
    var results, scheduler, xs, retry, ex;
    ex = 'ex';
    scheduler = new TestScheduler();
    retry = scheduler.createHotObservable(onNext(240));
    xs = scheduler.createColdObservable(onNext(10, 1), onNext(20, 2), onError(30, ex), onCompleted(40));
    results = scheduler.startWithCreate(function () {
        return xs.retryWhen(retry);
    });
    results.messages.assertEqual(onNext(210, 1), onNext(220, 2), onNext(250, 1), onNext(260, 2));
    xs.subscriptions.assertEqual(subscribe(200, 240), subscribe(240, 1000));
});


test('RetryWhen_Observable_Cold_Error_Complete', function () {
    var results, scheduler, xs, retry, ex;
    ex = 'ex';
    scheduler = new TestScheduler();
    retry = scheduler.createHotObservable(onCompleted(240));
    xs = scheduler.createColdObservable(onNext(10, 1), onNext(20, 2), onError(30, ex), onCompleted(40));
    results = scheduler.startWithCreate(function () {
        return xs.retryWhen(retry);
    });
    results.messages.assertEqual(onNext(210, 1), onNext(220, 2), onCompleted(240));
    xs.subscriptions.assertEqual(subscribe(200, 240));
});



test('RetryWhen_Observable_Cold_Error_Next_Complete', function () {
    var results, scheduler, xs, retry, ex;
    ex = 'ex';
    scheduler = new TestScheduler();
    retry = scheduler.createHotObservable(onNext(240), onCompleted(300));
    xs = scheduler.createColdObservable(onNext(10, 1), onNext(20, 2), onError(30, ex), onCompleted(40));
    results = scheduler.startWithCreate(function () {
        return xs.retryWhen(retry);
    });
    results.messages.assertEqual(onNext(210, 1), onNext(220, 2), onNext(250, 1), onNext(260, 2), onCompleted(300));
    xs.subscriptions.assertEqual(subscribe(200, 240), subscribe(240, 300));
});