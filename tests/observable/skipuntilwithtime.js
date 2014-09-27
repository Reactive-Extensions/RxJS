QUnit.module('SkipUntilWithTime');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('SkipUntil_Zero', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.skipUntilWithTime(new Date(0), scheduler);
    });
    res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('SkipUntil_Late', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
    res = scheduler.startWithCreate(function () {
        return xs.skipUntilWithTime(new Date(250), scheduler);
    });
    res.messages.assertEqual(onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('SkipUntil_Error', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onError(210, ex));
    res = scheduler.startWithCreate(function () {
        return xs.skipUntilWithTime(new Date(250), scheduler);
    });
    res.messages.assertEqual(onError(210, ex));
    xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('SkipUntil_Never', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable();
    res = scheduler.startWithCreate(function () {
        return xs.skipUntilWithTime(new Date(250), scheduler);
    });
    res.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});

test('SkipUntil_Twice1', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
    res = scheduler.startWithCreate(function () {
        return xs.skipUntilWithTime(new Date(215), scheduler).skipUntilWithTime(new Date(230), scheduler);
    });
    res.messages.assertEqual(onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
    xs.subscriptions.assertEqual(subscribe(200, 270));
});

test('SkipUntil_Twice2', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
    res = scheduler.startWithCreate(function () {
        return xs.skipUntilWithTime(new Date(230), scheduler).skipUntilWithTime(new Date(215), scheduler);
    });
    res.messages.assertEqual(onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
    xs.subscriptions.assertEqual(subscribe(200, 270));
});
