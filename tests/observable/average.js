QUnit.module('Average');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Average_Int32_Empty', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.average();
    }).messages;
    equal(1, res.length);
    ok(res[0].value.kind === 'E' && res[0].value.exception !== null);
    ok(res[0].time === 250);
});

test('Average_Int32_Return', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.average();
    }).messages;
    res.assertEqual(onNext(250, 2), onCompleted(250));
});

test('Average_Int32_Some', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(210, 3), onNext(220, 4), onNext(230, 2), onCompleted(250)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.average();
    }).messages;
    res.assertEqual(onNext(250, 3), onCompleted(250));
});

test('Average_Int32_Throw', function () {
    var ex, msgs, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onError(210, ex)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.average();
    }).messages;
    res.assertEqual(onError(210, ex));
});

test('Average_Int32_Never', function () {
    var msgs, res, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1)];
    xs = scheduler.createHotObservable(msgs);
    res = scheduler.startWithCreate(function () {
        return xs.average();
    }).messages;
    res.assertEqual();
});
test('Average_Selector_Regular_Int32', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, "b"), onNext(220, "fo"), onNext(230, "qux"), onCompleted(240));
    res = scheduler.startWithCreate(function () {
        return xs.average(function (x) {
            return x.length;
        });
    });
    res.messages.assertEqual(onNext(240, 2), onCompleted(240));
    xs.subscriptions.assertEqual(subscribe(200, 240));
});