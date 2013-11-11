QUnit.module('Throw');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

test('Throw_Basic', function () {
    var ex, results, scheduler;
    scheduler = new TestScheduler();
    ex = 'ex';
    results = scheduler.startWithCreate(function () {
        return Observable.throwException(ex, scheduler);
    });
    results.messages.assertEqual(onError(201, ex));
});

test('Throw_Disposed', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithDispose(function () {
        return Observable.throwException('ex', scheduler);
    }, 200);
    results.messages.assertEqual();
});

test('Throw_ObserverThrows', function () {
    var scheduler, xs;
    scheduler = new TestScheduler();
    xs = Observable.throwException('ex', scheduler);
    xs.subscribe(function (x) { }, function (ex) {
        throw 'ex';
    }, function () { });
    raises(function () {
        return scheduler.start();
    });
});