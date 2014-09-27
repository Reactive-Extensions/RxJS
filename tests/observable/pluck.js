QUnit.module('Pluck');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    SerialDisposable = Rx.SerialDisposable,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

test('Pluck_Completed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(180, {prop: 1}),
        onNext(210, {prop: 2}),
        onNext(240, {prop: 3}),
        onNext(290, {prop: 4}),
        onNext(350, {prop: 5}),
        onCompleted(400),
        onNext(410, {prop: -1}),
        onCompleted(420),
        onError(430, new Error('ex'))
    );

    var results = scheduler.startWithCreate(function () {
        return xs.pluck('prop');
    });

    results.messages.assertEqual(
        onNext(210, 2),
        onNext(240, 3),
        onNext(290, 4),
        onNext(350, 5),
        onCompleted(400)
    );

    xs.subscriptions.assertEqual(subscribe(200, 400));
});
