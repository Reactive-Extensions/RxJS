QUnit.module('ElementAtOrDefault');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;


test('ElementAtOrDefault_First', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onNext(470, 44), onCompleted(600));
    results = scheduler.startWithCreate(function () {
        return xs.elementAtOrDefault(0);
    });
    results.messages.assertEqual(onNext(280, 42), onCompleted(280));
    xs.subscriptions.assertEqual(subscribe(200, 280));
});

test('ElementAtOrDefault_Other', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onNext(470, 44), onCompleted(600));
    results = scheduler.startWithCreate(function () {
        return xs.elementAtOrDefault(2);
    });
    results.messages.assertEqual(onNext(470, 44), onCompleted(470));
    xs.subscriptions.assertEqual(subscribe(200, 470));
});

test('ElementAtOrDefault_OutOfRange', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onNext(470, 44), onCompleted(600));
    results = scheduler.startWithCreate(function () {
        return xs.elementAtOrDefault(3, 0);
    });
    results.messages.assertEqual(onNext(600, 0), onCompleted(600));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('ElementAtOrDefault_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onError(420, ex));
    results = scheduler.startWithCreate(function () {
        return xs.elementAtOrDefault(3);
    });
    results.messages.assertEqual(onError(420, ex));
    xs.subscriptions.assertEqual(subscribe(200, 420));
});