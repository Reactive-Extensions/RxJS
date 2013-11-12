QUnit.module('AsObservable');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Scan_Seed_Never', function () {
    var results, scheduler, seed;
    scheduler = new TestScheduler();
    seed = 42;
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.never().scan(seed, function (acc, x) {
            return acc + x;
        });
    });
    results.messages.assertEqual();
});
test('Scan_Seed_Empty', function () {
    scheduler = new TestScheduler();

    var seed = 42;
    var xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));

    var results = scheduler.startWithCreate(function () {
        return xs.scan(seed, function (acc, x) {
            return acc + x;
        });
    });

    results.messages.assertEqual(
        onNext(250, 0),
        onCompleted(250)
    );
    
});

test('Scan_Seed_Return', function () {
    var results, scheduler, seed, xs;
    scheduler = new TestScheduler();
    seed = 42;
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(220, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.scan(seed, function (acc, x) {
            return acc + x;
        });
    }).messages;
    equal(2, results.length);
    ok(results[0].value.kind === 'N' && results[0].value.value === seed + 2 && results[0].time === 220);
    ok(results[1].value.kind === 'C' && results[1].time === 250);
});

test('Scan_Seed_Throw', function () {
    var ex, results, scheduler, seed, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    seed = 42;
    xs = scheduler.createHotObservable(onNext(150, 1), onError(250, ex));
    results = scheduler.startWithCreate(function () {
        return xs.scan(seed, function (acc, x) {
            return acc + x;
        });
    }).messages;
    equal(1, results.length);
    ok(results[0].value.kind === 'E' && results[0].value.exception === ex && results[0].time === 250);
});

test('Scan_Seed_SomeData', function () {
    var results, scheduler, seed, xs;
    scheduler = new TestScheduler();
    seed = 1;
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.scan(seed, function (acc, x) {
            return acc + x;
        });
    }).messages;
    equal(5, results.length);
    ok(results[0].value.kind === 'N' && results[0].value.value === seed + 2 && results[0].time === 210);
    ok(results[1].value.kind === 'N' && results[1].value.value === seed + 2 + 3 && results[1].time === 220);
    ok(results[2].value.kind === 'N' && results[2].value.value === seed + 2 + 3 + 4 && results[2].time === 230);
    ok(results[3].value.kind === 'N' && results[3].value.value === seed + 2 + 3 + 4 + 5 && results[3].time === 240);
    ok(results[4].value.kind === 'C' && results[4].time === 250);
});

test('Scan_NoSeed_Never', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.never().scan(function (acc, x) {
            return acc + x;
        });
    });
    results.messages.assertEqual();
});

test('Scan_NoSeed_Empty', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.scan(function (acc, x) {
            return acc + x;
        });
    }).messages;
    equal(1, results.length);
    ok(results[0].value.kind === 'C' && results[0].time === 250);
});

test('Scan_NoSeed_Return', function () {
    var results, scheduler, xs, _undefined;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(220, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.scan(function (acc, x) {
            if (acc === _undefined) {
                acc = 0;
            }
            return acc + x;
        });
    }).messages;
    equal(2, results.length);
    ok(results[0].value.kind === 'N' && results[0].time === 220 && results[0].value.value === 2);
    ok(results[1].value.kind === 'C' && results[1].time === 250);
});

test('Scan_NoSeed_Throw', function () {
    var ex, results, scheduler, xs, _undefined;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onError(250, ex));
    results = scheduler.startWithCreate(function () {
        return xs.scan(function (acc, x) {
            if (acc === _undefined) {
                acc = 0;
            }
            return acc + x;
        });
    }).messages;
    equal(1, results.length);
    ok(results[0].value.kind === 'E' && results[0].time === 250 && results[0].value.exception === ex);
});

test('Scan_NoSeed_SomeData', function () {
    var results, scheduler, xs, _undefined;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.scan(function (acc, x) {
            if (acc === _undefined) {
                acc = 0;
            }
            return acc + x;
        });
    }).messages;
    equal(5, results.length);
    ok(results[0].value.kind === 'N' && results[0].time === 210 && results[0].value.value === 2);
    ok(results[1].value.kind === 'N' && results[1].time === 220 && results[1].value.value === 2 + 3);
    ok(results[2].value.kind === 'N' && results[2].time === 230 && results[2].value.value === 2 + 3 + 4);
    ok(results[3].value.kind === 'N' && results[3].time === 240 && results[3].value.value === 2 + 3 + 4 + 5);
    ok(results[4].value.kind === 'C' && results[4].time === 250);
});