QUnit.module('IgnoreValues');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('IgnoreValues_Basic', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
    results = scheduler.startWithCreate(function () {
        return xs.ignoreElements();
    });
    results.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});

test('IgnoreValues_Completed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(610));
    results = scheduler.startWithCreate(function () {
        return xs.ignoreElements();
    });
    results.messages.assertEqual(onCompleted(610));
    xs.subscriptions.assertEqual(subscribe(200, 610));
});

test('IgnoreValues_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(610, ex));
    results = scheduler.startWithCreate(function () {
        return xs.ignoreElements();
    });
    results.messages.assertEqual(onError(610, ex));
    xs.subscriptions.assertEqual(subscribe(200, 610));
});
