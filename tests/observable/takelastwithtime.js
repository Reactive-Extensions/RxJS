QUnit.module('TakeLastWithTime');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('TakeLast_Zero1', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastWithTime(0, scheduler);
    });
    res.messages.assertEqual(onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('TakeLast_Zero2', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastWithTime(0, scheduler);
    });
    res.messages.assertEqual(onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('TakeLast_Some1', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(240));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastWithTime(25, scheduler);
    });
    res.messages.assertEqual(onNext(240, 2), onNext(240, 3), onCompleted(240));
    xs.subscriptions.assertEqual(subscribe(200, 240));
});

test('TakeLast_Some2', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(300));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastWithTime(25, scheduler);
    });
    res.messages.assertEqual(onCompleted(300));
    xs.subscriptions.assertEqual(subscribe(200, 300));
});

test('TakeLast_Some3', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onNext(270, 7), onNext(280, 8), onNext(290, 9), onCompleted(300));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastWithTime(45, scheduler);
    });
    res.messages.assertEqual(onNext(300, 6), onNext(300, 7), onNext(300, 8), onNext(300, 9), onCompleted(300));
    xs.subscriptions.assertEqual(subscribe(200, 300));
});

test('TakeLast_Some4', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(250, 3), onNext(280, 4), onNext(290, 5), onNext(300, 6), onCompleted(350));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastWithTime(25, scheduler);
    });
    res.messages.assertEqual(onCompleted(350));
    xs.subscriptions.assertEqual(subscribe(200, 350));
});

test('TakeLast_All', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastWithTime(50, scheduler);
    });
    res.messages.assertEqual(onNext(230, 1), onNext(230, 2), onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('TakeLast_Error', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onError(210, ex));
    res = scheduler.startWithCreate(function () {
        return xs.takeLastWithTime(50, scheduler);
    });
    res.messages.assertEqual(onError(210, ex));
    xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('TakeLast_Never', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable();
    res = scheduler.startWithCreate(function () {
        return xs.takeLastWithTime(50, scheduler);
    });
    res.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});