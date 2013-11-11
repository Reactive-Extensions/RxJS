QUnit.module('GenerateWithAbsoluteTime');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Generate_DateTimeOffset_Finite', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.generateWithAbsoluteTime(0, function (x) {
            return x <= 3;
        }, function (x) {
            return x + 1;
        }, function (x) {
            return x;
        }, function (x) {
            return scheduler.now() + x + 1;
        }, scheduler);
    });
    results.messages.assertEqual(onNext(202, 0), onNext(204, 1), onNext(207, 2), onNext(211, 3), onCompleted(211));
});

test('Generate_DateTimeOffset_Throw_Condition', function () {
    var ex, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.generateWithAbsoluteTime(0, function (x) {
            throw ex;
        }, function (x) {
            return x + 1;
        }, function (x) {
            return x;
        }, function (x) {
            return scheduler.now() + x + 1;
        }, scheduler);
    });
    results.messages.assertEqual(onError(201, ex));
});

test('Generate_DateTimeOffset_Throw_ResultSelector', function () {
    var ex, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.generateWithAbsoluteTime(0, function (x) {
            return true;
        }, function (x) {
            return x + 1;
        }, function (x) {
            throw ex;
        }, function (x) {
            return scheduler.now() + x + 1;
        }, scheduler);
    });
    results.messages.assertEqual(onError(201, ex));
});

test('Generate_DateTimeOffset_Throw_Iterate', function () {
    var ex, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.generateWithAbsoluteTime(0, function (x) {
            return true;
        }, function (x) {
            throw ex;
        }, function (x) {
            return x;
        }, function (x) {
            return scheduler.now() + x + 1;
        }, scheduler);
    });
    results.messages.assertEqual(onNext(202, 0), onError(202, ex));
});

test('Generate_DateTimeOffset_Throw_TimeSelector', function () {
    var ex, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.generateWithAbsoluteTime(0, function (x) {
            return true;
        }, function (x) {
            return x + 1;
        }, function (x) {
            return x;
        }, function (x) {
            throw ex;
        }, scheduler);
    });
    results.messages.assertEqual(onError(201, ex));
});

test('Generate_DateTimeOffset_Dispose', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithDispose(function () {
        return Rx.Observable.generateWithAbsoluteTime(0, function (x) {
            return true;
        }, function (x) {
            return x + 1;
        }, function (x) {
            return x;
        }, function (x) {
            return scheduler.now() + x + 1;
        }, scheduler);
    }, 210);
    results.messages.assertEqual(onNext(202, 0), onNext(204, 1), onNext(207, 2));
});