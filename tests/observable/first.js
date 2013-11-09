QUnit.module('First');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;


// First Async
test('FirstAsync_Empty', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.first();
    });
    res.messages.assertEqual(onError(250, function (e) {
        return e !== null;
    }));
    xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('FirstAsync_One', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.first();
    });
    res.messages.assertEqual(onNext(210, 2), onCompleted(210));
    xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('FirstAsync_Many', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.first();
    });
    res.messages.assertEqual(onNext(210, 2), onCompleted(210));
    xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('FirstAsync_Error', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
    res = scheduler.startWithCreate(function () {
        return xs.first();
    });
    res.messages.assertEqual(onError(210, ex));
    xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('FirstAsync_Predicate', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.first(function (x) {
            return x % 2 === 1;
        });
    });
    res.messages.assertEqual(onNext(220, 3), onCompleted(220));
    xs.subscriptions.assertEqual(subscribe(200, 220));
});

test('FirstAsync_Predicate_None', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.first(function (x) {
            return x > 10;
        });
    });
    res.messages.assertEqual(onError(250, function (e) {
        return e !== null;
    }));
    xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('FirstAsync_Predicate_Throw', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onError(220, ex));
    res = scheduler.startWithCreate(function () {
        return xs.first(function (x) {
            return x % 2 === 1;
        });
    });
    res.messages.assertEqual(onError(220, ex));
    xs.subscriptions.assertEqual(subscribe(200, 220));
});

test('FirstAsync_PredicateThrows', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.first(function (x) {
            if (x < 4) {
                return false;
            } else {
                throw ex;
            }
        });
    });
    res.messages.assertEqual(onError(230, ex));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});