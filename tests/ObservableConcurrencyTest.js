/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

(function(window) {

    var root = window.Rx;

    QUnit.module('ObservableConcurrencyTest');

    var Observable = root.Observable,
        TestScheduler = root.TestScheduler,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe;

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

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    
}(typeof global == 'object' && global || this));