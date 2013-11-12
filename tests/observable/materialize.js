QUnit.module('Materialize');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Materialize_Never', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.never().materialize();
    });
    results.messages.assertEqual();
});

test('Materialize_Empty', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.materialize();
    }).messages;
    equal(2, results.length);
    ok(results[0].value.kind === 'N' && results[0].value.value.kind === 'C' && results[0].time === 250);
    ok(results[1].value.kind === 'C' && results[1].time === 250);
});

test('Materialize_Return', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.materialize();
    }).messages;
    equal(3, results.length);
    ok(results[0].value.kind === 'N' && results[0].value.value.kind === 'N' && results[0].value.value.value === 2 && results[0].time === 210);
    ok(results[1].value.kind === 'N' && results[1].value.value.kind === 'C' && results[1].time === 250);
    ok(results[2].value.kind === 'C' && results[1].time === 250);
});

test('Materialize_Throw', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onError(250, ex));
    results = scheduler.startWithCreate(function () {
        return xs.materialize();
    }).messages;
    equal(2, results.length);
    ok(results[0].value.kind === 'N' && results[0].value.value.kind === 'E' && results[0].value.value.exception === ex);
    ok(results[1].value.kind === 'C');
});

test('Materialize_Dematerialize_Never', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.never().materialize().dematerialize();
    });
    results.messages.assertEqual();
});

test('Materialize_Dematerialize_Empty', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.materialize().dematerialize();
    }).messages;
    equal(1, results.length);
    ok(results[0].value.kind === 'C' && results[0].time === 250);
});

test('Materialize_Dematerialize_Return', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.materialize().dematerialize();
    }).messages;
    equal(2, results.length);
    ok(results[0].value.kind === 'N' && results[0].value.value === 2 && results[0].time === 210);
    ok(results[1].value.kind === 'C');
});

test('Materialize_Dematerialize_Throw', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onError(250, ex));
    results = scheduler.startWithCreate(function () {
        return xs.materialize().dematerialize();
    }).messages;
    equal(1, results.length);
    ok(results[0].value.kind === 'E' && results[0].value.exception === ex && results[0].time === 250);
});
