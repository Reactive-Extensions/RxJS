QUnit.module('Throttle');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Throttle_Empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(150, 0),
        onCompleted(300)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.throttle(10, scheduler);
    });

    res.messages.assertEqual(
        onCompleted(300)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 300)
    );
});

test('Throttle_Error', function () {
    var scheduler = new TestScheduler();

    var ex = new Error();

    var xs = scheduler.createHotObservable(
        onNext(150, 0),
        onError(300, ex)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.throttle(10, scheduler); 
    });

    res.messages.assertEqual(
        onError(300, ex)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 300)
    );
});

test('Throttle_Never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(150, 0)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.throttle(10, scheduler);
    });

    res.messages.assertEqual(
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 1000)
    );
});

test('Throttle_All_Pass', function(){
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
        onNext(210, 1),
        onNext(300, 2),
        onNext(351, 3),
        onCompleted(400)
    );

    var results = scheduler.startWithCreate(function(){
        return xs.throttle(50, scheduler);
    });

    results.messages.assertEqual(
        onNext(260, 1),
        onNext(350, 2),
        onNext(400, 3),
        onCompleted(400)
    );

});
