QUnit.module('For');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('For_Basic', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Observable.forIn([1, 2, 3], function (x) {
            return scheduler.createColdObservable(onNext(x * 100 + 10, x * 10 + 1), onNext(x * 100 + 20, x * 10 + 2), onNext(x * 100 + 30, x * 10 + 3), onCompleted(x * 100 + 40));
        });
    });
    results.messages.assertEqual(onNext(310, 11), onNext(320, 12), onNext(330, 13), onNext(550, 21), onNext(560, 22), onNext(570, 23), onNext(890, 31), onNext(900, 32), onNext(910, 33), onCompleted(920));
});

test('For_Throws', function () {
    var ex, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Observable.forIn([1, 2, 3], function () {
            throw ex;
        });
    });
    results.messages.assertEqual(onError(200, ex));
});