QUnit.module('WindowWithTimeOrCount');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Interval_TimeSpan_Basic', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.interval(100, scheduler);
    });
    results.messages.assertEqual(onNext(300, 0), onNext(400, 1), onNext(500, 2), onNext(600, 3), onNext(700, 4), onNext(800, 5), onNext(900, 6));
});

test('Interval_TimeSpan_Zero', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithDispose(function () {
        return Rx.Observable.interval(0, scheduler);
    }, 210);
    results.messages.assertEqual(onNext(201, 0), onNext(202, 1), onNext(203, 2), onNext(204, 3), onNext(205, 4), onNext(206, 5), onNext(207, 6), onNext(208, 7), onNext(209, 8));
});

test('Interval_TimeSpan_Negative', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithDispose(function () {
        return Rx.Observable.interval(-1, scheduler);
    }, 210);
    results.messages.assertEqual(onNext(201, 0), onNext(202, 1), onNext(203, 2), onNext(204, 3), onNext(205, 4), onNext(206, 5), onNext(207, 6), onNext(208, 7), onNext(209, 8));
});

test('Interval_TimeSpan_Disposed', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.interval(1000, scheduler);
    });
    results.messages.assertEqual();
});

test('Interval_TimeSpan_ObserverThrows', function () {
    var scheduler, xs;
    scheduler = new TestScheduler();
    xs = Rx.Observable.interval(1, scheduler);
    xs.subscribe(function (x) {
        throw ex;
    });
    raises(function () {
        return scheduler.start();
    });
});