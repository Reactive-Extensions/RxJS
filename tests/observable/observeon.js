QUnit.module('ObserveOn');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('ObserveOn_Normal', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
	                    onNext(150, 1),
	                    onNext(210, 2),
	                    onCompleted(250)
	                );

    var results = scheduler.startWithCreate(function () {
        return xs.observeOn(scheduler);
    });
    results.messages.assertEqual(onNext(211, 2), onCompleted(251));
    xs.subscriptions.assertEqual(subscribe(200, 251));
});

test('ObserveOn_Error', function () {
    var scheduler = new TestScheduler(), ex = 'ex';
    var xs = scheduler.createHotObservable(
	                    onNext(150, 1),
	                    onError(210, ex)
	                );

    var results = scheduler.startWithCreate(function () {
        return xs.observeOn(scheduler);
    });
    results.messages.assertEqual(onError(211, ex));
    xs.subscriptions.assertEqual(subscribe(200, 211));
});

test('ObserveOn_Empty', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
	                    onNext(150, 1),
	                    onCompleted(250)
	                );

    var results = scheduler.startWithCreate(function () {
        return xs.observeOn(scheduler);
    });
    results.messages.assertEqual(onCompleted(251));
    xs.subscriptions.assertEqual(subscribe(200, 251));
});

test('ObserveOn_Never', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
	                    onNext(150, 1)
	                );

    var results = scheduler.startWithCreate(function () {
        return xs.observeOn(scheduler);
    });
    results.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});
