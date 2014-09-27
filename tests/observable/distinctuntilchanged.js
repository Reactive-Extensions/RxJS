QUnit.module('DistinctUntilChanged');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('DistinctUntilChanged_Never', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.never().distinctUntilChanged();
    });
    results.messages.assertEqual();
});

test('DistinctUntilChanged_Empty', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.distinctUntilChanged();
    }).messages;
    equal(1, results.length);
    ok(results[0].value.kind === 'C' && results[0].time === 250);
});

test('DistinctUntilChanged_Return', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(220, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.distinctUntilChanged();
    }).messages;
    equal(2, results.length);
    ok(results[0].value.kind === 'N' && results[0].time === 220 && results[0].value.value === 2);
    ok(results[1].value.kind === 'C' && results[1].time === 250);
});

test('DistinctUntilChanged_Throw', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onError(250, ex));
    results = scheduler.startWithCreate(function () {
        return xs.distinctUntilChanged();
    }).messages;
    equal(1, results.length);
    ok(results[0].value.kind === 'E' && results[0].time === 250 && results[0].value.exception === ex);
});

test('DistinctUntilChanged_AllChanges', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.distinctUntilChanged();
    }).messages;
    equal(5, results.length);
    ok(results[0].value.kind === 'N' && results[0].time === 210 && results[0].value.value === 2);
    ok(results[1].value.kind === 'N' && results[1].time === 220 && results[1].value.value === 3);
    ok(results[2].value.kind === 'N' && results[2].time === 230 && results[2].value.value === 4);
    ok(results[3].value.kind === 'N' && results[3].time === 240 && results[3].value.value === 5);
    ok(results[4].value.kind === 'C' && results[4].time === 250);
});

test('DistinctUntilChanged_AllSame', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onNext(220, 2),
        onNext(230, 2),
        onNext(240, 2),
        onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
        return xs.distinctUntilChanged();
    }).messages;

    equal(2, results.length);
    ok(results[0].value.kind === 'N' && results[0].time === 210 && results[0].value.value === 2);
    ok(results[1].value.kind === 'C' && results[1].time === 250);
});

test('DistinctUntilChanged_SomeChanges', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(215, 3), onNext(220, 3), onNext(225, 2), onNext(230, 2), onNext(230, 1), onNext(240, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.distinctUntilChanged();
    }).messages;
    equal(6, results.length);
    ok(results[0].value.kind === 'N' && results[0].time === 210 && results[0].value.value === 2);
    ok(results[1].value.kind === 'N' && results[1].time === 215 && results[1].value.value === 3);
    ok(results[2].value.kind === 'N' && results[2].time === 225 && results[2].value.value === 2);
    ok(results[3].value.kind === 'N' && results[3].time === 230 && results[3].value.value === 1);
    ok(results[4].value.kind === 'N' && results[4].time === 240 && results[4].value.value === 2);
    ok(results[5].value.kind === 'C' && results[5].time === 250);
});

test('DistinctUntilChanged_Comparer_AllEqual', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.distinctUntilChanged(void 0, function (x, y) {
            return true;
        });
    }).messages;
    equal(2, results.length);
    ok(results[0].value.kind === 'N' && results[0].time === 210 && results[0].value.value === 2);
    ok(results[1].value.kind === 'C' && results[1].time === 250);
});

test('DistinctUntilChanged_Comparer_AllDifferent', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 2), onNext(230, 2), onNext(240, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.distinctUntilChanged(void 0, function (x, y) {
            return false;
        });
    }).messages;
    equal(5, results.length);
    ok(results[0].value.kind === 'N' && results[0].time === 210 && results[0].value.value === 2);
    ok(results[1].value.kind === 'N' && results[1].time === 220 && results[1].value.value === 2);
    ok(results[2].value.kind === 'N' && results[2].time === 230 && results[2].value.value === 2);
    ok(results[3].value.kind === 'N' && results[3].time === 240 && results[3].value.value === 2);
    ok(results[4].value.kind === 'C' && results[4].time === 250);
});

test('DistinctUntilChanged_KeySelector_Div2', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 4), onNext(230, 3), onNext(240, 5), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.distinctUntilChanged(function (x) {
            return x % 2;
        });
    }).messages;
    equal(3, results.length);
    ok(results[0].value.kind === 'N' && results[0].time === 210 && results[0].value.value === 2);
    ok(results[1].value.kind === 'N' && results[1].time === 230 && results[1].value.value === 3);
    ok(results[2].value.kind === 'C' && results[2].time === 250);
});

test('DistinctUntilChanged_KeySelectorThrows', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.distinctUntilChanged(function (x) {
            throw ex;
        });
    });
    results.messages.assertEqual(onError(210, ex));
});

test('DistinctUntilChanged_ComparerThrows', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.distinctUntilChanged(void 0, function (x, y) {
            throw ex;
        });
    });
    results.messages.assertEqual(onNext(210, 2), onError(220, ex));
});
