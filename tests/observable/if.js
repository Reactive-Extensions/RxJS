QUnit.module('If');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('If_True', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(250, 2), onCompleted(300));
    ys = scheduler.createHotObservable(onNext(310, 3), onNext(350, 4), onCompleted(400));
    results = scheduler.startWithCreate(function () {
        return Observable.ifThen(function () {
            return true;
        }, xs, ys);
    });
    results.messages.assertEqual(onNext(210, 1), onNext(250, 2), onCompleted(300));
    xs.subscriptions.assertEqual(subscribe(200, 300));
    ys.subscriptions.assertEqual();
});

test('If_False', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(250, 2), onCompleted(300));
    ys = scheduler.createHotObservable(onNext(310, 3), onNext(350, 4), onCompleted(400));
    results = scheduler.startWithCreate(function () {
        return Observable.ifThen(function () {
            return false;
        }, xs, ys);
    });
    results.messages.assertEqual(onNext(310, 3), onNext(350, 4), onCompleted(400));
    xs.subscriptions.assertEqual();
    ys.subscriptions.assertEqual(subscribe(200, 400));
});

test('If_Throw', function () {
    var ex, results, scheduler, xs, ys;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(250, 2), onCompleted(300));
    ys = scheduler.createHotObservable(onNext(310, 3), onNext(350, 4), onCompleted(400));
    results = scheduler.startWithCreate(function () {
        return Observable.ifThen(function () {
            throw ex;
        }, xs, ys);
    });
    results.messages.assertEqual(onError(200, ex));
    xs.subscriptions.assertEqual();
    ys.subscriptions.assertEqual();
});

test('If_Dispose', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(250, 2));
    ys = scheduler.createHotObservable(onNext(310, 3), onNext(350, 4), onCompleted(400));
    results = scheduler.startWithCreate(function () {
        return Observable.ifThen(function () {
            return true;
        }, xs, ys);
    });
    results.messages.assertEqual(onNext(210, 1), onNext(250, 2));
    xs.subscriptions.assertEqual(subscribe(200, 1000));
    ys.subscriptions.assertEqual();
});

test('If_Default_Completed', function () {
    var b, results, scheduler, xs;
    b = false;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 1), onNext(220, 2), onNext(330, 3), onCompleted(440));
    scheduler.scheduleAbsolute(150, function () {
        b = true;
    });
    results = scheduler.startWithCreate(function () {
        return Observable.ifThen(function () {
            return b;
        }, xs);
    });
    results.messages.assertEqual(onNext(220, 2), onNext(330, 3), onCompleted(440));
    xs.subscriptions.assertEqual(subscribe(200, 440));
});

test('If_Default_Error', function () {
    var b, ex, results, scheduler, xs;
    ex = 'ex';
    b = false;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 1), onNext(220, 2), onNext(330, 3), onError(440, ex));
    scheduler.scheduleAbsolute(150, function () {
        b = true;
    });
    results = scheduler.startWithCreate(function () {
        return Observable.ifThen(function () {
            return b;
        }, xs);
    });
    results.messages.assertEqual(onNext(220, 2), onNext(330, 3), onError(440, ex));
    xs.subscriptions.assertEqual(subscribe(200, 440));
});

test('If_Default_Never', function () {
    var b, results, scheduler, xs;
    b = false;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 1), onNext(220, 2), onNext(330, 3));
    scheduler.scheduleAbsolute(150, function () {
        b = true;
    });
    results = scheduler.startWithCreate(function () {
        return Observable.ifThen(function () {
            return b;
        }, xs);
    });
    results.messages.assertEqual(onNext(220, 2), onNext(330, 3));
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});

test('If_Default_Other', function () {
    var b, results, scheduler, xs;
    b = true;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 1), onNext(220, 2), onNext(330, 3), onError(440, 'ex'));
    scheduler.scheduleAbsolute(150, function () {
        b = false;
    });
    results = scheduler.startWithCreate(function () {
        return Observable.ifThen(function () {
            return b;
        }, xs);
    });
    results.messages.assertEqual(onCompleted(200));
    xs.subscriptions.assertEqual();
});
