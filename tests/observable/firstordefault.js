QUnit.module('FirstOrDefault');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

// First or default
test('FirstOrDefaultAsync_Empty', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.firstOrDefault(null, 0);
    });
    res.messages.assertEqual(onNext(250, 0), onCompleted(250));
    xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('FirstOrDefaultAsync_One', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.firstOrDefault(null, 0);
    });
    res.messages.assertEqual(onNext(210, 2), onCompleted(210));
    xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('FirstOrDefaultAsync_Many', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.firstOrDefault(null, 0);
    });
    res.messages.assertEqual(onNext(210, 2), onCompleted(210));
    xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('FirstOrDefaultAsync_Error', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
    res = scheduler.startWithCreate(function () {
        return xs.firstOrDefault(null, 0);
    });
    res.messages.assertEqual(onError(210, ex));
    xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('FirstOrDefaultAsync_Predicate', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.firstOrDefault(function (x) {
            return x % 2 === 1;
        }, 0);
    });
    res.messages.assertEqual(onNext(220, 3), onCompleted(220));
    xs.subscriptions.assertEqual(subscribe(200, 220));
});

test('FirstOrDefaultAsync_Predicate_None', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.firstOrDefault(function (x) {
            return x > 10;
        }, 0);
    });
    res.messages.assertEqual(onNext(250, 0), onCompleted(250));
    xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('FirstOrDefaultAsync_Predicate_Throw', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onError(220, ex));
    res = scheduler.startWithCreate(function () {
        return xs.firstOrDefault(function (x) {
            return x % 2 === 1;
        }, 0);
    });
    res.messages.assertEqual(onError(220, ex));
    xs.subscriptions.assertEqual(subscribe(200, 220));
});

test('FirstOrDefaultAsync_PredicateThrows', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.firstOrDefault(function (x) {
            if (x < 4) {
                return false;
            } else {
                throw ex;
            }
        }, 0);
    });
    res.messages.assertEqual(onError(230, ex));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});
