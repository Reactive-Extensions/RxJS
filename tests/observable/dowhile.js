QUnit.module('DoWhile');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('DoWhile_AlwaysFalse', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(150, 3), onNext(200, 4), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.doWhile(function () {
            return false;
        });
    });
    results.messages.assertEqual(onNext(250, 1), onNext(300, 2), onNext(350, 3), onNext(400, 4), onCompleted(450));
    xs.subscriptions.assertEqual(subscribe(200, 450));
});

test('DoWhile_AlwaysTrue', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(150, 3), onNext(200, 4), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.doWhile(function () {
            return true;
        });
    });
    results.messages.assertEqual(onNext(250, 1), onNext(300, 2), onNext(350, 3), onNext(400, 4), onNext(500, 1), onNext(550, 2), onNext(600, 3), onNext(650, 4), onNext(750, 1), onNext(800, 2), onNext(850, 3), onNext(900, 4));
    xs.subscriptions.assertEqual(subscribe(200, 450), subscribe(450, 700), subscribe(700, 950), subscribe(950, 1000));
});

test('DoWhile_AlwaysTrue_Throw', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onError(50, ex));
    results = scheduler.startWithCreate(function () {
        return xs.doWhile(function () {
            return true;
        });
    });
    results.messages.assertEqual(onError(250, ex));
    xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('DoWhile_AlwaysTrue_Infinite', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onNext(50, 1));
    results = scheduler.startWithCreate(function () {
        return xs.doWhile(function () {
            return true;
        });
    });
    results.messages.assertEqual(onNext(250, 1));
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});

test('DoWhile_SometimesTrue', function () {
    var n, results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(150, 3), onNext(200, 4), onCompleted(250));
    n = 0;
    results = scheduler.startWithCreate(function () {
        return xs.doWhile(function () {
            return ++n < 3;
        });
    });
    results.messages.assertEqual(onNext(250, 1), onNext(300, 2), onNext(350, 3), onNext(400, 4), onNext(500, 1), onNext(550, 2), onNext(600, 3), onNext(650, 4), onNext(750, 1), onNext(800, 2), onNext(850, 3), onNext(900, 4), onCompleted(950));
    xs.subscriptions.assertEqual(subscribe(200, 450), subscribe(450, 700), subscribe(700, 950));
});

test('DoWhile_SometimesThrows', function () {
    var ex, n, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(150, 3), onNext(200, 4), onCompleted(250));
    n = 0;
    results = scheduler.startWithCreate(function () {
        return xs.doWhile(function () {
            if (++n < 3) {
                return true;
            } else {
                throw ex;
            }
        });
    });
    results.messages.assertEqual(onNext(250, 1), onNext(300, 2), onNext(350, 3), onNext(400, 4), onNext(500, 1), onNext(550, 2), onNext(600, 3), onNext(650, 4), onNext(750, 1), onNext(800, 2), onNext(850, 3), onNext(900, 4), onError(950, ex));
    xs.subscriptions.assertEqual(subscribe(200, 450), subscribe(450, 700), subscribe(700, 950));
});
