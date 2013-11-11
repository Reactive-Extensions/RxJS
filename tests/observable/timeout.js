QUnit.module('Timeout');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Timeout_InTime', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(230, 3), onNext(260, 4), onNext(300, 5), onNext(350, 6), onCompleted(400));
    results = scheduler.startWithCreate(function () {
        return xs.timeout(500, undefined, scheduler);
    });
    results.messages.assertEqual(onNext(210, 2), onNext(230, 3), onNext(260, 4), onNext(300, 5), onNext(350, 6), onCompleted(400));
});

test('Timeout_OutOfTime', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(230, 3), onNext(260, 4), onNext(300, 5), onNext(350, 6), onCompleted(400));
    results = scheduler.startWithCreate(function () {
        return xs.timeout(205, scheduler);
    });
    results.messages.assertEqual(onNext(210, 2), onNext(230, 3), onNext(260, 4), onNext(300, 5), onNext(350, 6), onCompleted(400));
});

test('Timeout_TimeoutOccurs_1', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(70, 1), onNext(130, 2), onNext(310, 3), onNext(400, 4), onCompleted(500));
    ys = scheduler.createColdObservable(onNext(50, -1), onNext(200, -2), onNext(310, -3), onCompleted(320));
    results = scheduler.startWithCreate(function () {
        return xs.timeout(100, ys, scheduler);
    });
    results.messages.assertEqual(onNext(350, -1), onNext(500, -2), onNext(610, -3), onCompleted(620));
    xs.subscriptions.assertEqual(subscribe(200, 300));
    ys.subscriptions.assertEqual(subscribe(300, 620));
});

test('Timeout_TimeoutOccurs_2', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(70, 1), onNext(130, 2), onNext(240, 3), onNext(310, 4), onNext(430, 5), onCompleted(500));
    ys = scheduler.createColdObservable(onNext(50, -1), onNext(200, -2), onNext(310, -3), onCompleted(320));
    results = scheduler.startWithCreate(function () {
        return xs.timeout(100, ys, scheduler);
    });
    results.messages.assertEqual(onNext(240, 3), onNext(310, 4), onNext(460, -1), onNext(610, -2), onNext(720, -3), onCompleted(730));
    xs.subscriptions.assertEqual(subscribe(200, 410));
    ys.subscriptions.assertEqual(subscribe(410, 730));
});

test('Timeout_TimeoutOccurs_Never', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(70, 1), onNext(130, 2), onNext(240, 3), onNext(310, 4), onNext(430, 5), onCompleted(500));
    ys = scheduler.createColdObservable();
    results = scheduler.startWithCreate(function () {
        return xs.timeout(100, ys, scheduler);
    });
    results.messages.assertEqual(onNext(240, 3), onNext(310, 4));
    xs.subscriptions.assertEqual(subscribe(200, 410));
    ys.subscriptions.assertEqual(subscribe(410, 1000));
});

test('Timeout_TimeoutOccurs_Completed', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onCompleted(500));
    ys = scheduler.createColdObservable(onNext(100, -1));
    results = scheduler.startWithCreate(function () {
        return xs.timeout(100, ys, scheduler);
    });
    results.messages.assertEqual(onNext(400, -1));
    xs.subscriptions.assertEqual(subscribe(200, 300));
    ys.subscriptions.assertEqual(subscribe(300, 1000));
});

test('Timeout_TimeoutOccurs_Error', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onError(500, 'ex'));
    ys = scheduler.createColdObservable(onNext(100, -1));
    results = scheduler.startWithCreate(function () {
        return xs.timeout(100, ys, scheduler);
    });
    results.messages.assertEqual(onNext(400, -1));
    xs.subscriptions.assertEqual(subscribe(200, 300));
    ys.subscriptions.assertEqual(subscribe(300, 1000));
});

test('Timeout_TimeoutNotOccurs_Completed', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onCompleted(250));
    ys = scheduler.createColdObservable(onNext(100, -1));
    results = scheduler.startWithCreate(function () {
        return xs.timeout(100, ys, scheduler);
    });
    results.messages.assertEqual(onCompleted(250));
    xs.subscriptions.assertEqual(subscribe(200, 250));
    ys.subscriptions.assertEqual();
});

test('Timeout_TimeoutNotOccurs_Error', function () {
    var ex, results, scheduler, xs, ys;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onError(250, ex));
    ys = scheduler.createColdObservable(onNext(100, -1));
    results = scheduler.startWithCreate(function () {
        return xs.timeout(100, ys, scheduler);
    });
    results.messages.assertEqual(onError(250, ex));
    xs.subscriptions.assertEqual(subscribe(200, 250));
    ys.subscriptions.assertEqual();
});

test('Timeout_TimeoutDoesNotOccur', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(70, 1), onNext(130, 2), onNext(240, 3), onNext(320, 4), onNext(410, 5), onCompleted(500));
    ys = scheduler.createColdObservable(onNext(50, -1), onNext(200, -2), onNext(310, -3), onCompleted(320));
    results = scheduler.startWithCreate(function () {
        return xs.timeout(100, ys, scheduler);
    });
    results.messages.assertEqual(onNext(240, 3), onNext(320, 4), onNext(410, 5), onCompleted(500));
    xs.subscriptions.assertEqual(subscribe(200, 500));
    ys.subscriptions.assertEqual();
});

test('Timeout_DateTimeOffset_TimeoutOccurs', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(410, 1));
    ys = scheduler.createColdObservable(onNext(100, -1));
    results = scheduler.startWithCreate(function () {
        return xs.timeout(new Date(400), ys, scheduler);
    });
    results.messages.assertEqual(onNext(500, -1));
    xs.subscriptions.assertEqual(subscribe(200, 400));
    ys.subscriptions.assertEqual(subscribe(400, 1000));
});

test('Timeout_DateTimeOffset_TimeoutDoesNotOccur_Completed', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onCompleted(390));
    ys = scheduler.createColdObservable(onNext(100, -1));
    results = scheduler.startWithCreate(function () {
        return xs.timeout(new Date(400), ys, scheduler);
    });
    results.messages.assertEqual(onNext(310, 1), onCompleted(390));
    xs.subscriptions.assertEqual(subscribe(200, 390));
    ys.subscriptions.assertEqual();
});

test('Timeout_DateTimeOffset_TimeoutDoesNotOccur_Error', function () {
    var ex, results, scheduler, xs, ys;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onError(390, ex));
    ys = scheduler.createColdObservable(onNext(100, -1));
    results = scheduler.startWithCreate(function () {
        return xs.timeout(new Date(400), ys, scheduler);
    });
    results.messages.assertEqual(onNext(310, 1), onError(390, ex));
    xs.subscriptions.assertEqual(subscribe(200, 390));
    ys.subscriptions.assertEqual();
});

test('Timeout_DateTimeOffset_TimeoutOccur_2', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    ys = scheduler.createColdObservable(onNext(100, -1));
    results = scheduler.startWithCreate(function () {
        return xs.timeout(new Date(400), ys, scheduler);
    });
    results.messages.assertEqual(onNext(310, 1), onNext(350, 2), onNext(500, -1));
    xs.subscriptions.assertEqual(subscribe(200, 400));
    ys.subscriptions.assertEqual(subscribe(400, 1000));
});

test('Timeout_DateTimeOffset_TimeoutOccur_3', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    ys = scheduler.createColdObservable();
    results = scheduler.startWithCreate(function () {
        return xs.timeout(new Date(400), ys, scheduler);
    });
    results.messages.assertEqual(onNext(310, 1), onNext(350, 2));
    xs.subscriptions.assertEqual(subscribe(200, 400));
    ys.subscriptions.assertEqual(subscribe(400, 1000));
});

test('Timeout_Duration_Simple_Never', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    ys = scheduler.createColdObservable();
    results = scheduler.startWithCreate(function () {
        return xs.timeoutWithSelector(ys, function () {
            return ys;
        });
    });
    results.messages.assertEqual(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    xs.subscriptions.assertEqual(subscribe(200, 450));
    ys.subscriptions.assertEqual(subscribe(200, 310), subscribe(310, 350), subscribe(350, 420), subscribe(420, 450));
});

test('Timeout_Duration_Simple_TimeoutFirst', function () {
    var results, scheduler, xs, ys, zs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    ys = scheduler.createColdObservable(onNext(100, 'boo!'));
    zs = scheduler.createColdObservable();
    results = scheduler.startWithCreate(function () {
        return xs.timeoutWithSelector(ys, function () {
            return zs;
        });
    });
    equal(1, results.messages.length);
    ok(results.messages[0].time === 300 && results.messages[0].value.exception !== null);
    xs.subscriptions.assertEqual(subscribe(200, 300));
    ys.subscriptions.assertEqual(subscribe(200, 300));
    zs.subscriptions.assertEqual();
});

test('Timeout_Duration_Simple_TimeoutLater', function () {
    var results, scheduler, xs, ys, zs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    ys = scheduler.createColdObservable();
    zs = scheduler.createColdObservable(onNext(50, 'boo!'));
    results = scheduler.startWithCreate(function () {
        return xs.timeoutWithSelector(ys, function () {
            return zs;
        });
    });
    equal(3, results.messages.length);
    ok(onNext(310, 1).equals(results.messages[0]));
    ok(onNext(350, 2).equals(results.messages[1]));
    ok(results.messages[2].time === 400 && results.messages[2].value.exception !== null);
    xs.subscriptions.assertEqual(subscribe(200, 400));
    ys.subscriptions.assertEqual(subscribe(200, 310));
    zs.subscriptions.assertEqual(subscribe(310, 350), subscribe(350, 400));
});

test('Timeout_Duration_Simple_TimeoutByCompletion', function () {
    var results, scheduler, xs, ys, zs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    ys = scheduler.createColdObservable();
    zs = scheduler.createColdObservable(onCompleted(50));
    results = scheduler.startWithCreate(function () {
        return xs.timeoutWithSelector(ys, function () {
            return zs;
        });
    });
    equal(3, results.messages.length);
    ok(onNext(310, 1).equals(results.messages[0]));
    ok(onNext(350, 2).equals(results.messages[1]));
    ok(results.messages[2].time === 400 && results.messages[2].value.exception !== null);
    xs.subscriptions.assertEqual(subscribe(200, 400));
    ys.subscriptions.assertEqual(subscribe(200, 310));
    zs.subscriptions.assertEqual(subscribe(310, 350), subscribe(350, 400));
});

test('Timeout_Duration_Simple_TimeoutByCompletion', function () {
    var ex, results, scheduler, xs, ys, zs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    ys = scheduler.createColdObservable();
    zs = scheduler.createColdObservable();
    results = scheduler.startWithCreate(function () {
        return xs.timeoutWithSelector(ys, function (x) {
            if (x < 3) {
                return zs;
            } else {
                throw ex;
            }
        });
    });
    results.messages.assertEqual(onNext(310, 1), onNext(350, 2), onNext(420, 3), onError(420, ex));
    xs.subscriptions.assertEqual(subscribe(200, 420));
    ys.subscriptions.assertEqual(subscribe(200, 310));
    zs.subscriptions.assertEqual(subscribe(310, 350), subscribe(350, 420));
});

test('Timeout_Duration_Simple_InnerThrows', function () {
    var ex, results, scheduler, xs, ys, zs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    ys = scheduler.createColdObservable();
    zs = scheduler.createColdObservable(onError(50, ex));
    results = scheduler.startWithCreate(function () {
        return xs.timeoutWithSelector(ys, function () {
            return zs;
        });
    });
    results.messages.assertEqual(onNext(310, 1), onNext(350, 2), onError(400, ex));
    xs.subscriptions.assertEqual(subscribe(200, 400));
    ys.subscriptions.assertEqual(subscribe(200, 310));
    zs.subscriptions.assertEqual(subscribe(310, 350), subscribe(350, 400));
});

test('Timeout_Duration_Simple_FirstThrows', function () {
    var ex, results, scheduler, xs, ys, zs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
    ys = scheduler.createColdObservable(onError(50, ex));
    zs = scheduler.createColdObservable();
    results = scheduler.startWithCreate(function () {
        return xs.timeoutWithSelector(ys, function () {
            return zs;
        });
    });
    results.messages.assertEqual(onError(250, ex));
    xs.subscriptions.assertEqual(subscribe(200, 250));
    ys.subscriptions.assertEqual(subscribe(200, 250));
    zs.subscriptions.assertEqual();
});

test('Timeout_Duration_Simple_SourceThrows', function () {
    var ex, results, scheduler, xs, ys, zs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onError(450, ex));
    ys = scheduler.createColdObservable();
    zs = scheduler.createColdObservable();
    results = scheduler.startWithCreate(function () {
        return xs.timeoutWithSelector(ys, function () {
            return zs;
        });
    });
    results.messages.assertEqual(onNext(310, 1), onNext(350, 2), onNext(420, 3), onError(450, ex));
    xs.subscriptions.assertEqual(subscribe(200, 450));
    ys.subscriptions.assertEqual(subscribe(200, 310));
    zs.subscriptions.assertEqual(subscribe(310, 350), subscribe(350, 420), subscribe(420, 450));
});