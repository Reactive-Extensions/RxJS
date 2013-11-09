QUnit.module('Aggregate');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('AggregateWithSeed_Empty', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.aggregate(42, function (acc, x) {
            return acc + x;
        });
    }).messages;
    res.assertEqual(onNext(250, 42), onCompleted(250));
});

test('AggregateWithSeed_Return', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, 24), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.aggregate(42, function (acc, x) {
            return acc + x;
        });
    }).messages;
    res.assertEqual(onNext(250, 42 + 24), onCompleted(250));
});

test('AggregateWithSeed_Throw', function () {
    var ex, msgs, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onError(210, ex)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.aggregate(42, function (acc, x) {
            return acc + x;
        });
    }).messages;
    res.assertEqual(onError(210, ex));
});

test('AggregateWithSeed_Never', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.aggregate(42, function (acc, x) {
            return acc + x;
        });
    }).messages;
    res.assertEqual();
});

test('AggregateWithSeed_Range', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, 0), onNext(220, 1), onNext(230, 2), onNext(240, 3), onNext(250, 4), onCompleted(260)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.aggregate(42, function (acc, x) {
            return acc + x;
        });
    }).messages;
    res.assertEqual(onNext(260, 10 + 42), onCompleted(260));
});

test('AggregateWithoutSeed_Empty', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.aggregate(function (acc, x) {
            return acc + x;
        });
    }).messages;
    equal(1, res.length);
    ok(res[0].value.kind === 'E' && res[0].value.exception !== undefined);
    equal(250, res[0].time);
});

test('AggregateWithoutSeed_Return', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, 24), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.aggregate(function (acc, x) {
            return acc + x;
        });
    }).messages;
    res.assertEqual(onNext(250, 24), onCompleted(250));
});

test('AggregateWithoutSeed_Throw', function () {
    var ex, msgs, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onError(210, ex)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.aggregate(function (acc, x) {
            return acc + x;
        });
    }).messages;
    res.assertEqual(onError(210, ex));
});

test('AggregateWithoutSeed_Never', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.aggregate(function (acc, x) {
            return acc + x;
        });
    }).messages;
    res.assertEqual();
});

test('AggregateWithoutSeed_Range', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, 0), onNext(220, 1), onNext(230, 2), onNext(240, 3), onNext(250, 4), onCompleted(260)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.aggregate(function (acc, x) {
            return acc + x;
        });
    }).messages;
    res.assertEqual(onNext(260, 10), onCompleted(260));
});