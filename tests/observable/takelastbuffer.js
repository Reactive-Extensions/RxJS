QUnit.module('TakeLastBuffer');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

function arrayEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (var i = 0, len = arr1.length; i < len; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

test('TakeLastBuffer_Zero_Completed', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBuffer(0);
    });
    res.messages.assertEqual(onNext(650, function (lst) {
        return lst.length === 0;
    }), onCompleted(650));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLastBuffer_Zero_Error', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBuffer(0);
    });
    res.messages.assertEqual(onError(650, ex));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLastBuffer_Zero_Disposed', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBuffer(0);
    });
    res.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});

test('TakeLastBuffer_One_Completed', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBuffer(1);
    });
    res.messages.assertEqual(onNext(650, function (lst) {
        return arrayEqual(lst, [9]);
    }), onCompleted(650));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLastBuffer_One_Error', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBuffer(1);
    });
    res.messages.assertEqual(onError(650, ex));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLastBuffer_One_Disposed', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBuffer(1);
    });
    res.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});

test('TakeLastBuffer_Three_Completed', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBuffer(3);
    });
    res.messages.assertEqual(onNext(650, function (lst) {
        return arrayEqual(lst, [7, 8, 9]);
    }), onCompleted(650));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLastBuffer_Three_Error', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBuffer(3);
    });
    res.messages.assertEqual(onError(650, ex));
    xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLastBuffer_Three_Disposed', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBuffer(3);
    });
    res.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});