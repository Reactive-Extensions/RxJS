QUnit.module('Timer');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('OneShotTimer_TimeSpan_Basic', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.timer(300, scheduler);
    });
    results.messages.assertEqual(onNext(500, 0), onCompleted(500));
});

test('OneShotTimer_TimeSpan_Zero', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.timer(0, scheduler);
    });
    results.messages.assertEqual(onNext(201, 0), onCompleted(201));
});

test('OneShotTimer_TimeSpan_Negative', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.timer(-1, scheduler);
    });
    results.messages.assertEqual(onNext(201, 0), onCompleted(201));
});

test('OneShotTimer_TimeSpan_Disposed', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.timer(1000, scheduler);
    });
    results.messages.assertEqual();
});

test('OneShotTimer_TimeSpan_ObserverThrows', function () {
    var scheduler1, scheduler2, xs, ys;
    scheduler1 = new TestScheduler();
    xs = Rx.Observable.timer(1, scheduler1);
    xs.subscribe(function (x) {
        throw 'ex';
    });
    raises(function () {
        scheduler1.start();
    });
    scheduler2 = new TestScheduler();
    ys = Rx.Observable.timer(1, undefined, scheduler2);
    ys.subscribe(function (x) { }, function (ex) { }, function () {
        throw 'ex';
    });
    raises(function () {
        scheduler2.start();
    });
});
