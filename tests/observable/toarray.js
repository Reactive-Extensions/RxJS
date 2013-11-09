QUnit.module('ToArray');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('ToArray_Completed', function () {
    var msgs, results, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(110, 1), onNext(220, 2), onNext(330, 3), onNext(440, 4), onNext(550, 5), onCompleted(660)];
    xs = scheduler.createHotObservable(msgs);
    results = scheduler.startWithCreate(function () {
        return xs.toArray();
    }).messages;
    equal(2, results.length);
    equal(660, results[0].time);
    equal('N', results[0].value.kind);
    results[0].value.value.assertEqual(2, 3, 4, 5);
    ok(onCompleted(660).equals(results[1]));
    xs.subscriptions.assertEqual(subscribe(200, 660));
});

test('ToArray_Error', function () {
    var ex, msgs, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs = [onNext(110, 1), onNext(220, 2), onNext(330, 3), onNext(440, 4), onNext(550, 5), onError(660, ex)];
    xs = scheduler.createHotObservable(msgs);
    results = scheduler.startWithCreate(function () {
        return xs.toArray();
    }).messages;
    results.assertEqual(onError(660, ex));
    xs.subscriptions.assertEqual(subscribe(200, 660));
});

test('ToArray_Disposed', function () {
    var msgs, results, scheduler, xs;
    scheduler = new TestScheduler();
    msgs = [onNext(110, 1), onNext(220, 2), onNext(330, 3), onNext(440, 4), onNext(550, 5)];
    xs = scheduler.createHotObservable(msgs);
    results = scheduler.startWithCreate(function () {
        return xs.toArray();
    }).messages;
    results.assertEqual();
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});