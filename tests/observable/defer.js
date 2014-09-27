QUnit.module('Return');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

test('Defer_Complete', function () {
    var invoked, results, scheduler, xs;
    invoked = 0;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Observable.defer(function () {
            invoked++;
            xs = scheduler.createColdObservable(
                                onNext(100, scheduler.clock),
                                onCompleted(200)
                            );
            return xs;
        });
    });
    results.messages.assertEqual(
                        onNext(300, 200),
                        onCompleted(400)
                    );
    equal(1, invoked);
    return xs.subscriptions.assertEqual(subscribe(200, 400));
});

test('Defer_Error', function () {
    var ex, invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    invoked = 0;
    ex = 'ex';
    results = scheduler.startWithCreate(function () {
        return Observable.defer(function () {
            invoked++;
            xs = scheduler.createColdObservable(onNext(100, scheduler.clock), onError(200, ex));
            return xs;
        });
    });
    results.messages.assertEqual(onNext(300, 200), onError(400, ex));
    equal(1, invoked);
    return xs.subscriptions.assertEqual(subscribe(200, 400));
});

test('Defer_Dispose', function () {
    var invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    invoked = 0;
    results = scheduler.startWithCreate(function () {
        return Observable.defer(function () {
            invoked++;
            xs = scheduler.createColdObservable(onNext(100, scheduler.clock), onNext(200, invoked), onNext(1100, 1000));
            return xs;
        });
    });
    results.messages.assertEqual(onNext(300, 200), onNext(400, 1));
    equal(1, invoked);
    return xs.subscriptions.assertEqual(subscribe(200, 1000));
});

test('Defer_Throw', function () {
    var ex, invoked, results, scheduler;
    scheduler = new TestScheduler();
    invoked = 0;
    ex = 'ex';
    results = scheduler.startWithCreate(function () {
        return Observable.defer(function () {
            invoked++;
            throw ex;
        });
    });
    results.messages.assertEqual(onError(200, ex));
    return equal(1, invoked);
});
