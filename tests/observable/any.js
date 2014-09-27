QUnit.module('Any');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Any_Empty', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.any();
    }).messages;
    res.assertEqual(onNext(250, false), onCompleted(250));
});

test('Any_Return', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.any();
    }).messages;
    res.assertEqual(onNext(210, true), onCompleted(210));
});

test('Any_Throw', function () {
    var ex, msgs, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onError(210, ex)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.any();
    }).messages;
    res.assertEqual(onError(210, ex));
});

test('Any_Never', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.any();
    }).messages;
    res.assertEqual();
});

test('Any_Predicate_Empty', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.any(function (x) {
            return x > 0;
        });
    }).messages;
    res.assertEqual(onNext(250, false), onCompleted(250));
});

test('Any_Predicate_Return', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.any(function (x) {
            return x > 0;
        });
    }).messages;
    res.assertEqual(onNext(210, true), onCompleted(210));
});

test('Any_Predicate_ReturnNotMatch', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, -2), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.any(function (x) {
            return x > 0;
        });
    }).messages;
    res.assertEqual(onNext(250, false), onCompleted(250));
});

test('Any_Predicate_SomeNoneMatch', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, -2), onNext(220, -3), onNext(230, -4), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.any(function (x) {
            return x > 0;
        });
    }).messages;
    res.assertEqual(onNext(250, false), onCompleted(250));
});

test('Any_Predicate_SomeMatch', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, -2), onNext(220, 3), onNext(230, -4), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.any(function (x) {
            return x > 0;
        });
    }).messages;
    res.assertEqual(onNext(220, true), onCompleted(220));
});

test('Any_Predicate_Throw', function () {
    var ex, msgs, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onError(210, ex)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.any(function (x) {
            return x > 0;
        });
    }).messages;
    res.assertEqual(onError(210, ex));
});

test('Any_Predicate_Never', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.any(function (x) {
            return x > 0;
        });
    }).messages;
    res.assertEqual();
});
