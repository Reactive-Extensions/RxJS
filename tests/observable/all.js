QUnit.module('All');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('All_Empty', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.all(function (x) {
            return x > 0;
        });
    }).messages;
    res.assertEqual(onNext(250, true), onCompleted(250));
});

test('All_Return', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.all(function (x) {
            return x > 0;
        });
    }).messages;
    res.assertEqual(onNext(250, true), onCompleted(250));
});

test('All_ReturnNotMatch', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, -2), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.all(function (x) {
            return x > 0;
        });
    }).messages;
    res.assertEqual(onNext(210, false), onCompleted(210));
});

test('All_SomeNoneMatch', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, -2), onNext(220, -3), onNext(230, -4), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.all(function (x) {
            return x > 0;
        });
    }).messages;
    res.assertEqual(onNext(210, false), onCompleted(210));
});

test('All_SomeMatch', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, -2), onNext(220, 3), onNext(230, -4), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.all(function (x) {
            return x > 0;
        });
    }).messages;
    res.assertEqual(onNext(210, false), onCompleted(210));
});

test('All_SomeAllMatch', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.all(function (x) {
            return x > 0;
        });
    }).messages;
    res.assertEqual(onNext(250, true), onCompleted(250));
});

test('All_Throw', function () {
    var ex, msgs, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onError(210, ex)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.all(function (x) {
            return x > 0;
        });
    }).messages;
    res.assertEqual(onError(210, ex));
});

test('All_Never', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.all(function (x) {
            return x > 0;
        });
    }).messages;
    res.assertEqual();
});