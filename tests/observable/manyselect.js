QUnit.module('ManySelect');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('ManySelect_Basic', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(100, 1),
        onNext(220, 2),
        onNext(270, 3),
        onNext(410, 4),
        onCompleted(500)
    );

    var res = scheduler.startWithCreate(function () { 
        return xs.manySelect(function (ys) { return ys.first(); }, scheduler);
    });

    res.messages.assertEqual(
        onNext(221, 2),
        onNext(271, 3),
        onNext(411, 4),
        onCompleted(501)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 500)
    );
});

test('ManySelect_Error', function () {
    var scheduler = new TestScheduler();

    var ex = new Error();

    var xs = scheduler.createHotObservable(
        onNext(100, 1),
        onNext(220, 2),
        onNext(270, 3),
        onNext(410, 4),
        onError(500, ex)
    );

    var res = scheduler.startWithCreate(function () { 
        return xs.manySelect(function (ys) { return ys.first(); }, scheduler);
    });

    res.messages.assertEqual(
        onNext(221, 2),
        onNext(271, 3),
        onNext(411, 4),
        onError(501, ex)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 500)
    );
});