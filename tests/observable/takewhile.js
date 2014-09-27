QUnit.module('TakeWhile');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    SerialDisposable = Rx.SerialDisposable,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

function isPrime(i) {
    if (i <= 1) {
        return false;
    }
    var max = Math.floor(Math.sqrt(i))
    for (var j = 2; j <= max; ++j) {
        if (i % j === 0) {
            return false;
        }
    }

    return true;
}

test('TakeWhile_Complete_Before', function () {
    var invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onCompleted(330), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
    invoked = 0;
    results = scheduler.startWithCreate(function () {
        return xs.takeWhile(function (x) {
            invoked++;
            return isPrime(x);
        });
    });
    results.messages.assertEqual(onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onCompleted(330));
    xs.subscriptions.assertEqual(subscribe(200, 330));
    equal(4, invoked);
});

test('TakeWhile_Complete_After', function () {
    var invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
    invoked = 0;
    results = scheduler.startWithCreate(function () {
        return xs.takeWhile(function (x) {
            invoked++;
            return isPrime(x);
        });
    });
    results.messages.assertEqual(onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onCompleted(390));
    xs.subscriptions.assertEqual(subscribe(200, 390));
    equal(6, invoked);
});

test('TakeWhile_Error_Before', function () {
    var ex, invoked, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onError(270, ex), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23));
    invoked = 0;
    results = scheduler.startWithCreate(function () {
        return xs.takeWhile(function (x) {
            invoked++;
            return isPrime(x);
        });
    });
    results.messages.assertEqual(onNext(210, 2), onNext(260, 5), onError(270, ex));
    xs.subscriptions.assertEqual(subscribe(200, 270));
    equal(2, invoked);
});

test('TakeWhile_Error_After', function () {
    var invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onError(600, 'ex'));
    invoked = 0;
    results = scheduler.startWithCreate(function () {
        return xs.takeWhile(function (x) {
            invoked++;
            return isPrime(x);
        });
    });
    results.messages.assertEqual(onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onCompleted(390));
    xs.subscriptions.assertEqual(subscribe(200, 390));
    equal(6, invoked);
});

test('TakeWhile_Dispose_Before', function () {
    var invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
    invoked = 0;
    results = scheduler.startWithDispose(function () {
        return xs.takeWhile(function (x) {
            invoked++;
            return isPrime(x);
        });
    }, 300);
    results.messages.assertEqual(onNext(210, 2), onNext(260, 5), onNext(290, 13));
    xs.subscriptions.assertEqual(subscribe(200, 300));
    equal(3, invoked);
});

test('TakeWhile_Dispose_After', function () {
    var invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
    invoked = 0;
    results = scheduler.startWithDispose(function () {
        return xs.takeWhile(function (x) {
            invoked++;
            return isPrime(x);
        });
    }, 400);
    results.messages.assertEqual(onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onCompleted(390));
    xs.subscriptions.assertEqual(subscribe(200, 390));
    equal(6, invoked);
});

test('TakeWhile_Zero', function () {
    var invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(205, 100), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
    invoked = 0;
    results = scheduler.startWithDispose(function () {
        return xs.takeWhile(function (x) {
            invoked++;
            return isPrime(x);
        });
    }, 300);
    results.messages.assertEqual(onCompleted(205));
    xs.subscriptions.assertEqual(subscribe(200, 205));
    equal(1, invoked);
});

test('TakeWhile_Throw', function () {
    var ex, invoked, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
    invoked = 0;
    results = scheduler.startWithCreate(function () {
        return xs.takeWhile(function (x) {
            invoked++;
            if (invoked === 3) {
                throw ex;
            }
            return isPrime(x);
        });
    });
    results.messages.assertEqual(onNext(210, 2), onNext(260, 5), onError(290, ex));
    xs.subscriptions.assertEqual(subscribe(200, 290));
    equal(3, invoked);
});

test('TakeWhile_Index', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(205, 100), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
    results = scheduler.startWithCreate(function () {
        return xs.takeWhile(function (x, i) {
            return i < 5;
        });
    });
    results.messages.assertEqual(onNext(205, 100), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onCompleted(350));
    xs.subscriptions.assertEqual(subscribe(200, 350));
});
