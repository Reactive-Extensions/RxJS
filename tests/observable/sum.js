QUnit.module('Sum');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Sum_Int32_Empty', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.sum();
    }).messages;
    res.assertEqual(onNext(250, 0), onCompleted(250));
});

test('Sum_Int32_Return', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.sum();
    }).messages;
    res.assertEqual(onNext(250, 2), onCompleted(250));
});

test('Sum_Int32_Some', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.sum();
    }).messages;
    res.assertEqual(onNext(250, 2 + 3 + 4), onCompleted(250));
});

test('Sum_Int32_Throw', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
    res = scheduler.startWithCreate(function () {
        return xs.sum();
    }).messages;
    res.assertEqual(onError(210, ex));
});

test('Sum_Int32_Never', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1));
    res = scheduler.startWithCreate(function () {
        return xs.sum();
    }).messages;
    res.assertEqual();
});

test('Sum_Selector_Regular_Int32', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, "fo"), onNext(220, "b"), onNext(230, "qux"), onCompleted(240));
    res = scheduler.startWithCreate(function () {
        return xs.sum(function (x) {
            return x.length;
        });
    });
    res.messages.assertEqual(onNext(240, 6), onCompleted(240));
    xs.subscriptions.assertEqual(subscribe(200, 240));
});
