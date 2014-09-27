QUnit.module('ObserveOn');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('SubscribeOn_Normal', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
	                    onNext(150, 1),
	                    onNext(210, 2),
	                    onCompleted(250)
	                );

    var results = scheduler.startWithCreate(function () {
        return xs.subscribeOn(scheduler);
    });
    results.messages.assertEqual(onNext(210, 2), onCompleted(250));
    xs.subscriptions.assertEqual(subscribe(201, 251));
});

test('SubscribeOn_Error', function () {
    var scheduler = new TestScheduler(), ex = 'ex';
    var xs = scheduler.createHotObservable(
	                    onNext(150, 1),
	                    onError(210, ex)
	                );

    var results = scheduler.startWithCreate(function () {
        return xs.subscribeOn(scheduler);
    });
    results.messages.assertEqual(onError(210, ex));
    xs.subscriptions.assertEqual(subscribe(201, 211));
});

test('SubscribeOn_Empty', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
	                    onNext(150, 1),
	                    onCompleted(250)
	                );

    var results = scheduler.startWithCreate(function () {
        return xs.subscribeOn(scheduler);
    });
    results.messages.assertEqual(onCompleted(250));
    xs.subscriptions.assertEqual(subscribe(201, 251));
});

test('SubscribeOn_Never', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
	                    onNext(150, 1)
	                );

    var results = scheduler.startWithCreate(function () {
        return xs.subscribeOn(scheduler);
    });
    results.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(201, 1001));
});
