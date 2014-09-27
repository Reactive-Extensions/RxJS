QUnit.module('Range');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

test('Range_Zero', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Observable.range(0, 0, scheduler);
    });
    results.messages.assertEqual(onCompleted(201));
});

test('Range_One', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Observable.range(0, 1, scheduler);
    });
    results.messages.assertEqual(onNext(201, 0), onCompleted(202));
});

test('Range_Five', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Observable.range(10, 5, scheduler);
    });
    results.messages.assertEqual(
                        onNext(201, 10),
                        onNext(202, 11),
                        onNext(203, 12),
                        onNext(204, 13),
                        onNext(205, 14),
                        onCompleted(206));
});

test('Range_Dispose', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithDispose(function () {
        return Observable.range(-10, 5, scheduler);
    }, 204);
    results.messages.assertEqual(onNext(201, -10), onNext(202, -9), onNext(203, -8));
});
