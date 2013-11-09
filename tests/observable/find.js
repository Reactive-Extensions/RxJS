QUnit.module('Find');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;


test('find_Never', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
        onNext(150, 1)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.find(function () {
            return true;
        });
    });

    res.messages.assertEqual(

    );
});

test('find_Empty', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onCompleted(210)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.find(function () {
            return true;
        });
    });

    res.messages.assertEqual(
        onNext(210, undefined),
        onCompleted(210)
    );
});

test('find_Single', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onCompleted(220)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.find(function (x) {
            return x === 2;
        });
    });

    res.messages.assertEqual(
        onNext(210, 2),
        onCompleted(210)
    );
});

test('find_NotFound', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onCompleted(220)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.find(function (x) {
            return x === 3;
        });
    });

    res.messages.assertEqual(
        onNext(220, undefined),
        onCompleted(220)
    );
});     

test('find_Error', function () {
    var ex = new Error('error');
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onError(220, ex)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.find(function (x) {
            return x === 3;
        });
    });

    res.messages.assertEqual(
        onError(220, ex)
    );
});  

test('find_Throws', function () {
    var ex = new Error('error');
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onCompleted(220)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.find(function (x) {
            throw ex;
        });
    });

    res.messages.assertEqual(
        onError(210, ex)
    );
});