QUnit.module('SingleOrDefault');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;


// Single Or Default
test('SingleOrDefaultAsync_Empty', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.singleOrDefault(null, 0);
    });
    res.messages.assertEqual(onNext(250, 0), onCompleted(250));
    xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('SingleOrDefaultAsync_One', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.singleOrDefault(null, 0);
    });
    res.messages.assertEqual(onNext(250, 2), onCompleted(250));
    xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('SingleOrDefaultAsync_Many', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.singleOrDefault(null, 0);
    });
    res.messages.assertEqual(onError(220, function (e) {
        return e !== null;
    }));
    xs.subscriptions.assertEqual(subscribe(200, 220));
});

test('SingleOrDefaultAsync_Error', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
    res = scheduler.startWithCreate(function () {
        return xs.singleOrDefault(null, 0);
    });
    res.messages.assertEqual(onError(210, ex));
    xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('SingleOrDefaultAsync_Predicate', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.singleOrDefault(function (x) {
            return x % 2 === 1;
        }, 0);
    });
    res.messages.assertEqual(onError(240, function (e) {
        return e !== null;
    }));
    xs.subscriptions.assertEqual(subscribe(200, 240));
});

test('SingleOrDefaultAsync_Predicate_Empty', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.singleOrDefault(function (x) {
            return x % 2 === 1;
        }, 0);
    });
    res.messages.assertEqual(onNext(250, 0), onCompleted(250));
    xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('SingleOrDefaultAsync_Predicate_One', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.singleOrDefault(function (x) {
            return x === 4;
        }, 0);
    });
    res.messages.assertEqual(onNext(250, 4), onCompleted(250));
    xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('SingleOrDefaultAsync_Predicate_None', function () {
    var res, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.singleOrDefault(function (x) {
            return x > 10;
        }, 0);
    });
    res.messages.assertEqual(onNext(250, 0), onCompleted(250));
    xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('SingleOrDefaultAsync_Predicate_Throw', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
    res = scheduler.startWithCreate(function () {
        return xs.singleOrDefault(function (x) {
            return x > 10;
        }, 0);
    });
    res.messages.assertEqual(onError(210, ex));
    xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('SingleOrDefaultAsync_PredicateThrows', function () {
    var ex, res, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    res = scheduler.startWithCreate(function () {
        return xs.singleOrDefault(function (x) {
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