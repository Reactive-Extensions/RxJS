QUnit.module('TakeWithTime');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Take_Zero', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.takeWithTime(0, scheduler);
    });
    res.messages.assertEqual(onCompleted(201));
    xs.subscriptions.assertEqual(subscribe(200, 201));
});

test('Take_Some', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(240));
    res = scheduler.startWithCreate(function () {
        return xs.takeWithTime(25, scheduler);
    });
    res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onCompleted(225));
    xs.subscriptions.assertEqual(subscribe(200, 225));
});

test('Take_Late', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.takeWithTime(50, scheduler);
    });
    res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('Take_Error', function () {
    var ex, res, scheduler, xs;
    scheduler = new TestScheduler();
    ex = 'ex';
    xs = scheduler.createHotObservable(onError(210, ex));
    res = scheduler.startWithCreate(function () {
        return xs.takeWithTime(50, scheduler);
    });
    res.messages.assertEqual(onError(210, ex));
    xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('Take_Never', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable();
    res = scheduler.startWithCreate(function () {
        return xs.takeWithTime(50, scheduler);
    });
    res.messages.assertEqual(onCompleted(250));
    xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('Take_Twice1', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
    res = scheduler.startWithCreate(function () {
        return xs.takeWithTime(55, scheduler).takeWithTime(35, scheduler);
    });
    res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(235));
    xs.subscriptions.assertEqual(subscribe(200, 235));
});

test('Take_Twice2', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
    res = scheduler.startWithCreate(function () {
        return xs.takeWithTime(35, scheduler).takeWithTime(55, scheduler);
    });
    res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(235));
    xs.subscriptions.assertEqual(subscribe(200, 235));
});