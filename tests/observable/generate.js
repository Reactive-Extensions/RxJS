QUnit.module('Generate');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

test('Generate_Finite', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Observable.generate(0, function (x) {
            return x <= 3;
        }, function (x) {
            return x + 1;
        }, function (x) {
            return x;
        }, scheduler);
    });
    results.messages.assertEqual(
                        onNext(201, 0),
                        onNext(202, 1),
                        onNext(203, 2),
                        onNext(204, 3),
                        onCompleted(205)
                    );
});

test('Generate_Throw_Condition', function () {
    var ex, results, scheduler;
    scheduler = new TestScheduler();
    ex = 'ex';
    results = scheduler.startWithCreate(function () {
        return Observable.generate(0, function (x) {
            throw ex;
        }, function (x) {
            return x + 1;
        }, function (x) {
            return x;
        }, scheduler);
    });
    results.messages.assertEqual(onError(201, ex));
});

test('Generate_Throw_ResultSelector', function () {
    var ex, results, scheduler;
    scheduler = new TestScheduler();
    ex = 'ex';
    results = scheduler.startWithCreate(function () {
        return Observable.generate(0, function (x) {
            return true;
        }, function (x) {
            return x + 1;
        }, function (x) {
            throw ex;
        }, scheduler);
    });
    results.messages.assertEqual(onError(201, ex));
});

test('Generate_Throw_Iterate', function () {
    var ex, results, scheduler;
    scheduler = new TestScheduler();
    ex = 'ex';
    results = scheduler.startWithCreate(function () {
        return Observable.generate(0, function (x) {
            return true;
        }, function (x) {
            throw ex;
        }, function (x) {
            return x;
        }, scheduler);
    });
    results.messages.assertEqual(
                        onNext(201, 0),
                        onError(202, ex)
                    );
});

test('Generate_Dispose', function () {
    var ex, results, scheduler;
    scheduler = new TestScheduler();
    ex = 'ex';
    results = scheduler.startWithDispose(function () {
        return Observable.generate(0, function (x) {
            return true;
        }, function (x) {
            return x + 1;
        }, function (x) {
            return x;
        }, scheduler);
    }, 203);
    results.messages.assertEqual(
                        onNext(201, 0),
                        onNext(202, 1));
});
