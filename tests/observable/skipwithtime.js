QUnit.module('SkipWithTime');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Skip_Zero', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.skipWithTime(0, scheduler);
    });
    res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('Skip_Some', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.skipWithTime(15, scheduler);
    });
    res.messages.assertEqual(onNext(220, 2), onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('Skip_Late', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.skipWithTime(50, scheduler);
    });
    res.messages.assertEqual(onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('Skip_Error', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onError(210, ex));
    res = scheduler.startWithCreate(function () {
        return xs.skipWithTime(50, scheduler);
    });
    res.messages.assertEqual(onError(210, ex));
    xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('Skip_Never', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable();
    res = scheduler.startWithCreate(function () {
        return xs.skipWithTime(50, scheduler);
    });
    res.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});

test('Skip_Twice1', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
    res = scheduler.startWithCreate(function () {
        return xs.skipWithTime(15, scheduler).skipWithTime(30, scheduler);
    });
    res.messages.assertEqual(onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
    xs.subscriptions.assertEqual(subscribe(200, 270));
});

test('Skip_Twice2', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
    res = scheduler.startWithCreate(function () {
        return xs.skipWithTime(30, scheduler).skipWithTime(15, scheduler);
    });
    res.messages.assertEqual(onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
    xs.subscriptions.assertEqual(subscribe(200, 270));
});
