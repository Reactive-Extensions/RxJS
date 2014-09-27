QUnit.module('IsEmpty');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('IsEmpty_Empty', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.isEmpty();
    }).messages;
    res.assertEqual(onNext(250, true), onCompleted(250));
    xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('IsEmpty_Return', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.isEmpty();
    }).messages;
    res.assertEqual(onNext(210, false), onCompleted(210));
    xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('IsEmpty_Throw', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
    res = scheduler.startWithCreate(function () {
        return xs.isEmpty();
    }).messages;
    res.assertEqual(onError(210, ex));
    xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('IsEmpty_Never', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1));
    res = scheduler.startWithCreate(function () {
        return xs.isEmpty();
    }).messages;
    res.assertEqual();
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});
