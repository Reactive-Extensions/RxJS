QUnit.module('TakeLastBufferWithTime');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

// TakeLastBuffer
test('takeLastBufferWithTime_Zero1', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBufferWithTime(0, scheduler);
    });
    res.messages.assertEqual(onNext(230, function (lst) {
        return lst.length === 0;
    }), onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('takeLastBufferWithTime_Zero2', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBufferWithTime(0, scheduler);
    });
    res.messages.assertEqual(onNext(230, function (lst) {
        return lst.length === 0;
    }), onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

function arrayEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (var i = 0, len = arr1.length; i < len; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

test('takeLastBufferWithTime_Some1', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(240));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBufferWithTime(25, scheduler);
    });
    res.messages.assertEqual(onNext(240, function (lst) {
        return arrayEqual(lst, [2, 3]);
    }), onCompleted(240));
    xs.subscriptions.assertEqual(subscribe(200, 240));
});

test('takeLastBufferWithTime_Some2', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(300));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBufferWithTime(25, scheduler);
    });
    res.messages.assertEqual(onNext(300, function (lst) {
        return lst.length === 0;
    }), onCompleted(300));
    xs.subscriptions.assertEqual(subscribe(200, 300));
});

test('takeLastBufferWithTime_Some3', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onNext(270, 7), onNext(280, 8), onNext(290, 9), onCompleted(300));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBufferWithTime(45, scheduler);
    });
    res.messages.assertEqual(onNext(300, function (lst) {
        return arrayEqual(lst, [6, 7, 8, 9]);
    }), onCompleted(300));
    xs.subscriptions.assertEqual(subscribe(200, 300));
});

test('takeLastBufferWithTime_Some4', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(250, 3), onNext(280, 4), onNext(290, 5), onNext(300, 6), onCompleted(350));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBufferWithTime(25, scheduler);
    });
    res.messages.assertEqual(onNext(350, function (lst) {
        return lst.length === 0;
    }), onCompleted(350));
    xs.subscriptions.assertEqual(subscribe(200, 350));
});

test('takeLastBufferWithTime_All', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBufferWithTime(50, scheduler);
    });
    res.messages.assertEqual(onNext(230, function (lst) {
        return arrayEqual(lst, [1, 2]);
    }), onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('takeLastBufferWithTime_Error', function () {
    var ex, res, scheduler, xs;
    scheduler = new TestScheduler();
    ex = 'ex';
    xs = scheduler.createHotObservable(onError(210, ex));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBufferWithTime(50, scheduler);
    });
    res.messages.assertEqual(onError(210, ex));
    xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('takeLastBufferWithTime_Never', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable();
    res = scheduler.startWithCreate(function () {
        return xs.takeLastBufferWithTime(50, scheduler);
    });
    res.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});