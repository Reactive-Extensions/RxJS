QUnit.module('TakeUntilWithTime');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('TakeUntil_Zero', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.takeUntilWithTime(new Date(0), scheduler);
    });
    res.messages.assertEqual(onCompleted(201));
    xs.subscriptions.assertEqual(subscribe(200, 201));
});

test('TakeUntil_Late', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.takeUntilWithTime(new Date(250), scheduler);
    });
    res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('TakeUntil_Error', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onError(210, ex));
    res = scheduler.startWithCreate(function () {
        return xs.takeUntilWithTime(new Date(250), scheduler);
    });
    res.messages.assertEqual(onError(210, ex));
    xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('TakeUntil_Never', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable();
    res = scheduler.startWithCreate(function () {
        return xs.takeUntilWithTime(new Date(250), scheduler);
    });
    res.messages.assertEqual(onCompleted(250));
    xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('TakeUntil_Twice1', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
    res = scheduler.startWithCreate(function () {
        return xs.takeUntilWithTime(new Date(255), scheduler).takeUntilWithTime(new Date(235), scheduler);
    });
    res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(235));
    xs.subscriptions.assertEqual(subscribe(200, 235));
});

test('TakeUntil_Twice2', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
    res = scheduler.startWithCreate(function () {
        return xs.takeUntilWithTime(new Date(235), scheduler).takeUntilWithTime(new Date(255), scheduler);
    });
    res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(235));
    xs.subscriptions.assertEqual(subscribe(200, 235));
});
