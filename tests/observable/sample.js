QUnit.module('Sample');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Sample_Regular', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(230, 3), onNext(260, 4), onNext(300, 5), onNext(350, 6), onNext(380, 7), onCompleted(390));
    results = scheduler.startWithCreate(function () {
        return xs.sample(50, scheduler);
    });
    results.messages.assertEqual(onNext(250, 3), onNext(300, 5), onNext(350, 6), onNext(400, 7), onCompleted(400));
});

test('Sample_ErrorInFlight', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(230, 3), onNext(260, 4), onNext(300, 5), onNext(310, 6), onError(330, ex));
    results = scheduler.startWithCreate(function () {
        return xs.sample(50, scheduler);
    });
    results.messages.assertEqual(onNext(250, 3), onNext(300, 5), onError(330, ex));
});

test('Sample_Empty', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.empty(scheduler).sample(0, scheduler);
    });
    results.messages.assertEqual(onCompleted(201));
});

test('Sample_Error', function () {
    var ex, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.throwException(ex, scheduler).sample(0, scheduler);
    });
    results.messages.assertEqual(onError(201, ex));
});

test('Sample_Never', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.never().sample(0, scheduler);
    });
    results.messages.assertEqual();
});
