QUnit.module('FindIndex');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('findIndex_Never', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
        onNext(150, 1)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.findIndex(function () {
            return true;
        });
    });

    res.messages.assertEqual(
    );
});

test('findIndex_Empty', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onCompleted(210)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.findIndex(function () {
            return true;
        });
    });

    res.messages.assertEqual(
        onNext(210, -1),
        onCompleted(210)
    );
});

test('findIndex_Single', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onCompleted(220)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.findIndex(function (x) {
            return x === 2;
        });
    });

    res.messages.assertEqual(
        onNext(210, 0),
        onCompleted(210)
    );
});

test('findIndex_NotFound', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onCompleted(220)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.findIndex(function (x) {
            return x === 3;
        });
    });

    res.messages.assertEqual(
        onNext(220, -1),
        onCompleted(220)
    );
});     

test('findIndex_Error', function () {
    var ex = new Error('error');
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onError(220, ex)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.findIndex(function (x) {
            return x === 3;
        });
    });

    res.messages.assertEqual(
        onError(220, ex)
    );
});  

test('findIndex_Throws', function () {
    var ex = new Error('error');
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onCompleted(220)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.findIndex(function (x) {
            throw ex;
        });
    });

    res.messages.assertEqual(
        onError(210, ex)
    );
});