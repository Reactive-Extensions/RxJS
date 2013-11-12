QUnit.module('Distinct');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Distinct_DefaultComparer_AllDistinct', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(280, 4), onNext(300, 2), onNext(350, 1), onNext(380, 3), onNext(400, 5), onCompleted(420));
    results = scheduler.startWithCreate(function () {
        return xs.distinct();
    });
    results.messages.assertEqual(onNext(280, 4), onNext(300, 2), onNext(350, 1), onNext(380, 3), onNext(400, 5), onCompleted(420));
    xs.subscriptions.assertEqual(subscribe(200, 420));
});

test('Distinct_DefaultComparer_SomeDuplicates', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(280, 4), onNext(300, 2), onNext(350, 2), onNext(380, 3), onNext(400, 4), onCompleted(420));
    results = scheduler.startWithCreate(function () {
        return xs.distinct();
    });
    results.messages.assertEqual(onNext(280, 4), onNext(300, 2), onNext(380, 3), onCompleted(420));
    xs.subscriptions.assertEqual(subscribe(200, 420));
});

test('Distinct_KeySelectory_AllDistinct', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(280, 8), onNext(300, 4), onNext(350, 2), onNext(380, 6), onNext(400, 10), onCompleted(420));
    results = scheduler.startWithCreate(function () {
        return xs.distinct(function (x) {
            return x / 2;
        });
    });
    results.messages.assertEqual(onNext(280, 8), onNext(300, 4), onNext(350, 2), onNext(380, 6), onNext(400, 10), onCompleted(420));
    xs.subscriptions.assertEqual(subscribe(200, 420));
});

test('Distinct_KeySelector_SomeDuplicates', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(280, 4), onNext(300, 2), onNext(350, 3), onNext(380, 7), onNext(400, 5), onCompleted(420));
    results = scheduler.startWithCreate(function () {
        return xs.distinct(function (x) {
            return Math.floor(x / 2);
        });
    });
    results.messages.assertEqual(onNext(280, 4), onNext(300, 2), onNext(380, 7), onCompleted(420));
    xs.subscriptions.assertEqual(subscribe(200, 420));
});

test('Distinct_KeySelector_Throws', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(280, 3), onNext(300, 2), onNext(350, 1), onNext(380, 0), onNext(400, 4), onCompleted(420));
    results = scheduler.startWithCreate(function () {
        return xs.distinct(function (x) {
            if (x === 0) {
                throw ex;
            } else {
                return Math.floor(x / 2);
            }
        });
    });
    results.messages.assertEqual(onNext(280, 3), onNext(350, 1), onError(380, ex));
    xs.subscriptions.assertEqual(subscribe(200, 380));
});