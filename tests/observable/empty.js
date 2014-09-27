QUnit.module('Empty');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

test('Empty_Basic', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Observable.empty(scheduler);
    });
    results.messages.assertEqual(onCompleted(201));
});

test('Empty_Disposed', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithDispose(function () {
        return Observable.empty(scheduler);
    }, 200);
    results.messages.assertEqual();
});

test('Empty_ObserverThrows', function () {
    var scheduler, xs;
    scheduler = new TestScheduler();
    xs = Observable.empty(scheduler);
    xs.subscribe(function (x) { }, function (ex) { }, function () {
        throw 'ex';
    });
    raises(function () {
        scheduler.start();
    });
});
