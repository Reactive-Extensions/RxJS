QUnit.module('Throttle');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Throttle_TimeSpan_AllPass', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(200, 2), onNext(250, 3), onNext(300, 4), onNext(350, 5), onNext(400, 6), onNext(450, 7), onNext(500, 8), onCompleted(550));
    results = scheduler.startWithCreate(function () {
        return xs.throttle(40, scheduler);
    });
    results.messages.assertEqual(onNext(290, 3), onNext(340, 4), onNext(390, 5), onNext(440, 6), onNext(490, 7), onNext(540, 8), onCompleted(550));
});

test('Throttle_TimeSpan_AllPass_ErrorEnd', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(200, 2), onNext(250, 3), onNext(300, 4), onNext(350, 5), onNext(400, 6), onNext(450, 7), onNext(500, 8), onError(550, ex));
    results = scheduler.startWithCreate(function () {
        return xs.throttle(40, scheduler);
    });
    results.messages.assertEqual(onNext(290, 3), onNext(340, 4), onNext(390, 5), onNext(440, 6), onNext(490, 7), onNext(540, 8), onError(550, ex));
});

test('Throttle_TimeSpan_AllDrop', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(200, 2), onNext(250, 3), onNext(300, 4), onNext(350, 5), onNext(400, 6), onNext(450, 7), onNext(500, 8), onCompleted(550));
    results = scheduler.startWithCreate(function () {
        return xs.throttle(60, scheduler);
    });
    results.messages.assertEqual(onNext(550, 8), onCompleted(550));
});

test('Throttle_TimeSpan_AllDrop_ErrorEnd', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(200, 2), onNext(250, 3), onNext(300, 4), onNext(350, 5), onNext(400, 6), onNext(450, 7), onNext(500, 8), onError(550, ex));
    results = scheduler.startWithCreate(function () {
        return xs.throttle(60, scheduler);
    });
    results.messages.assertEqual(onError(550, ex));
});

test('Throttle_TimeSpan_SomeDrop', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(370, 4), onNext(421, 5), onNext(480, 6), onNext(490, 7), onNext(500, 8), onCompleted(600));
    results = scheduler.startWithCreate(function () {
        return xs.throttle(50, scheduler);
    });
    results.messages.assertEqual(onNext(300, 2), onNext(420, 4), onNext(471, 5), onNext(550, 8), onCompleted(600));
});

test('Throttle_Empty', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.empty(scheduler).throttle(10, scheduler);
    });
    results.messages.assertEqual(onCompleted(201));
});

test('Throttle_Error', function () {
    var ex, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.throwException(ex, scheduler).throttle(10, scheduler);
    });
    results.messages.assertEqual(onError(201, ex));
});

test('Throttle_Never', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.never().throttle(10, scheduler);
    });
    results.messages.assertEqual();
});

test('Throttle_Duration_DelayBehavior', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(
        onNext(150, -1), 
        onNext(250, 0), 
        onNext(280, 1), 
        onNext(310, 2), 
        onNext(350, 3), 
        onNext(400, 4), 
        onCompleted(550)
    );
    ys = [
        scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)), 
        scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)), 
        scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)), 
        scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)), 
        scheduler.createColdObservable(onNext(20, 42), onNext(25, 99))
    ];
    
    results = scheduler.startWithCreate(function () {
        return xs.throttleWithSelector((function (x) {
            return ys[x];
        }));
    });
    results.messages.assertEqual(
        onNext(250 + 20, 0), 
        onNext(280 + 20, 1), 
        onNext(310 + 20, 2), 
        onNext(350 + 20, 3), 
        onNext(400 + 20, 4), 
        onCompleted(550)
    );

    xs.subscriptions.assertEqual(subscribe(200, 550));
    ys[0].subscriptions.assertEqual(subscribe(250, 250 + 20));
    ys[1].subscriptions.assertEqual(subscribe(280, 280 + 20));
    ys[2].subscriptions.assertEqual(subscribe(310, 310 + 20));
    ys[3].subscriptions.assertEqual(subscribe(350, 350 + 20));
    ys[4].subscriptions.assertEqual(subscribe(400, 400 + 20));
});

test('Throttle_Duration_ThrottleBehavior', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, -1), onNext(250, 0), onNext(280, 1), onNext(310, 2), onNext(350, 3), onNext(400, 4), onCompleted(550));
    ys = [scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)), scheduler.createColdObservable(onNext(40, 42), onNext(45, 99)), scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)), scheduler.createColdObservable(onNext(60, 42), onNext(65, 99)), scheduler.createColdObservable(onNext(20, 42), onNext(25, 99))];
    results = scheduler.startWithCreate(function () {
        return xs.throttleWithSelector(function (x) {
            return ys[x];
        });
    });
    results.messages.assertEqual(onNext(250 + 20, 0), onNext(310 + 20, 2), onNext(400 + 20, 4), onCompleted(550));
    xs.subscriptions.assertEqual(subscribe(200, 550));
    ys[0].subscriptions.assertEqual(subscribe(250, 250 + 20));
    ys[1].subscriptions.assertEqual(subscribe(280, 310));
    ys[2].subscriptions.assertEqual(subscribe(310, 310 + 20));
    ys[3].subscriptions.assertEqual(subscribe(350, 400));
    ys[4].subscriptions.assertEqual(subscribe(400, 400 + 20));
});

test('Throttle_Duration_EarlyCompletion', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, -1), onNext(250, 0), onNext(280, 1), onNext(310, 2), onNext(350, 3), onNext(400, 4), onCompleted(410));
    ys = [scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)), scheduler.createColdObservable(onNext(40, 42), onNext(45, 99)), scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)), scheduler.createColdObservable(onNext(60, 42), onNext(65, 99)), scheduler.createColdObservable(onNext(20, 42), onNext(25, 99))];
    results = scheduler.startWithCreate(function () {
        return xs.throttleWithSelector(function (x) {
            return ys[x];
        });
    });
    results.messages.assertEqual(onNext(250 + 20, 0), onNext(310 + 20, 2), onNext(410, 4), onCompleted(410));
    xs.subscriptions.assertEqual(subscribe(200, 410));
    ys[0].subscriptions.assertEqual(subscribe(250, 250 + 20));
    ys[1].subscriptions.assertEqual(subscribe(280, 310));
    ys[2].subscriptions.assertEqual(subscribe(310, 310 + 20));
    ys[3].subscriptions.assertEqual(subscribe(350, 400));
    ys[4].subscriptions.assertEqual(subscribe(400, 410));
});

test('Throttle_Duration_InnerError', function () {
    var ex, results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
    ex = 'ex';
    results = scheduler.startWithCreate(function () {
        return xs.throttleWithSelector(function (x) {
            if (x < 4) {
                return scheduler.createColdObservable(onNext(x * 10, "Ignore"), onNext(x * 10 + 5, "Aargh!"));
            } else {
                return scheduler.createColdObservable(onError(x * 10, ex));
            }
        });
    });
    results.messages.assertEqual(onNext(250 + 2 * 10, 2), onNext(350 + 3 * 10, 3), onError(450 + 4 * 10, ex));
    xs.subscriptions.assertEqual(subscribe(200, 490));
});

test('Throttle_Duration_OuterError', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onError(460, ex));
    results = scheduler.startWithCreate(function () {
        return xs.throttleWithSelector(function (x) {
            return scheduler.createColdObservable(onNext(x * 10, "Ignore"), onNext(x * 10 + 5, "Aargh!"));
        });
    });
    results.messages.assertEqual(onNext(250 + 2 * 10, 2), onNext(350 + 3 * 10, 3), onError(460, ex));
    xs.subscriptions.assertEqual(subscribe(200, 460));
});

test('Throttle_Duration_SelectorThrows', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
    results = scheduler.startWithCreate(function () {
        return xs.throttleWithSelector(function (x) {
            if (x < 4) {
                return scheduler.createColdObservable(onNext(x * 10, "Ignore"), onNext(x * 10 + 5, "Aargh!"));
            } else {
                throw ex;
            }
        });
    });
    results.messages.assertEqual(onNext(250 + 2 * 10, 2), onNext(350 + 3 * 10, 3), onError(450, ex));
    xs.subscriptions.assertEqual(subscribe(200, 450));
});

test('Throttle_Duration_InnerDone_DelayBehavior', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
    results = scheduler.startWithCreate(function () {
        return xs.throttleWithSelector(function (x) {
            return scheduler.createColdObservable(onCompleted(x * 10));
        });
    });
    results.messages.assertEqual(onNext(250 + 2 * 10, 2), onNext(350 + 3 * 10, 3), onNext(450 + 4 * 10, 4), onCompleted(550));
    xs.subscriptions.assertEqual(subscribe(200, 550));
});

test('Throttle_Duration_InnerDone_ThrottleBehavior', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(280, 3), onNext(300, 4), onNext(400, 5), onNext(410, 6), onCompleted(550));
    results = scheduler.startWithCreate(function () {
        return xs.throttleWithSelector(function (x) {
            return scheduler.createColdObservable(onCompleted(x * 10));
        });
    });
    results.messages.assertEqual(onNext(250 + 2 * 10, 2), onNext(300 + 4 * 10, 4), onNext(410 + 6 * 10, 6), onCompleted(550));
    xs.subscriptions.assertEqual(subscribe(200, 550));
});