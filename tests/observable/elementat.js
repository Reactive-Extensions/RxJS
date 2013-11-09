QUnit.module('ElementAt');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

// ElementAt
test('ElementAt_First', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onNext(470, 44), onCompleted(600));
    results = scheduler.startWithCreate(function () {
        return xs.elementAt(0);
    });
    results.messages.assertEqual(onNext(280, 42), onCompleted(280));
    xs.subscriptions.assertEqual(subscribe(200, 280));
});

test('ElementAt_Other', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onNext(470, 44), onCompleted(600));
    results = scheduler.startWithCreate(function () {
        return xs.elementAt(2);
    });
    results.messages.assertEqual(onNext(470, 44), onCompleted(470));
    xs.subscriptions.assertEqual(subscribe(200, 470));
});

test('ElementAt_OutOfRange', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onNext(470, 44), onCompleted(600));
    results = scheduler.startWithCreate(function () {
        return xs.elementAt(3);
    });
    equal(1, results.messages.length);
    equal(600, results.messages[0].time);
    equal('E', results.messages[0].value.kind);
    ok(results.messages[0].value.exception !== null);
});

test('ElementAt_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onError(420, ex));
    results = scheduler.startWithCreate(function () {
        return xs.elementAt(3);
    });
    results.messages.assertEqual(onError(420, ex));
    xs.subscriptions.assertEqual(subscribe(200, 420));
});