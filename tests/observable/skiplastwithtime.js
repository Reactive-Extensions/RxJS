QUnit.module('SkipLastWithTime');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('SkipLast_Zero1', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.skipLastWithTime(0, scheduler);
    });
    res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('SkipLast_Zero2', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.skipLastWithTime(0, scheduler);
    });
    res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('SkipLast_Some1', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.skipLastWithTime(15, scheduler);
    });
    res.messages.assertEqual(onNext(230, 1), onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('SkipLast_Some2', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onNext(270, 7), onNext(280, 8), onNext(290, 9), onCompleted(300));
    res = scheduler.startWithCreate(function () {
        return xs.skipLastWithTime(45, scheduler);
    });
    res.messages.assertEqual(onNext(260, 1), onNext(270, 2), onNext(280, 3), onNext(290, 4), onNext(300, 5), onCompleted(300));
    xs.subscriptions.assertEqual(subscribe(200, 300));
});

test('SkipLast_All', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.skipLastWithTime(45, scheduler);
    });
    res.messages.assertEqual(onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('SkipLast_Error', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onError(210, ex));
    res = scheduler.startWithCreate(function () {
        return xs.skipLastWithTime(45, scheduler);
    });
    res.messages.assertEqual(onError(210, ex));
    xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('SkipLast_Never', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable();
    res = scheduler.startWithCreate(function () {
        return xs.skipLastWithTime(50, scheduler);
    });
    res.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});