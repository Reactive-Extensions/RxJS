QUnit.module('Replay');

var TestScheduler = Rx.TestScheduler,
    Observable = Rx.Observable,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    Subject = Rx.Subject,
    created = Rx.ReactiveTest.created,
    disposed = Rx.ReactiveTest.disposed,
    subscribed = Rx.ReactiveTest.subscribed,
    inherits = Rx.internals.inherits;

test('ReplayCount_Basic', function () {
    var connection, results, scheduler, subscription, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.replay(undefined, 3, undefined, scheduler);
    });
    scheduler.scheduleAbsolute(450, function () {
        subscription = ys.subscribe(results);
    });
    scheduler.scheduleAbsolute(disposed, function () {
        subscription.dispose();
    });
    scheduler.scheduleAbsolute(300, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(400, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(500, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(550, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(650, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(800, function () {
        connection.dispose();
    });
    scheduler.start();
    results.messages.assertEqual(onNext(451, 5), onNext(452, 6), onNext(453, 7), onNext(521, 11));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
});

test('ReplayCount_Error', function () {
    var connection, ex, results, scheduler, subscription, xs, ys;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
         ys = xs.replay(undefined, 3, undefined, scheduler);
    });
    scheduler.scheduleAbsolute(450, function () {
        subscription = ys.subscribe(results);
    });
    scheduler.scheduleAbsolute(disposed, function () {
        subscription.dispose();
    });
    scheduler.scheduleAbsolute(300, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(400, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(500, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(800, function () {
        connection.dispose();
    });
    scheduler.start();
    results.messages.assertEqual(onNext(451, 5), onNext(452, 6), onNext(453, 7), onNext(521, 11), onNext(561, 20), onError(601, ex));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
});

test('ReplayCount_Complete', function () {
    var connection, results, scheduler, subscription, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.replay(undefined, 3, undefined, scheduler);
    });
    scheduler.scheduleAbsolute(450, function () {
        subscription = ys.subscribe(results);
    });
    scheduler.scheduleAbsolute(disposed, function () {
        subscription.dispose();
    });
    scheduler.scheduleAbsolute(300, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(400, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(500, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(800, function () {
        connection.dispose();
    });
    scheduler.start();
    results.messages.assertEqual(onNext(451, 5), onNext(452, 6), onNext(453, 7), onNext(521, 11), onNext(561, 20), onCompleted(601));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
});

test('ReplayCount_Dispose', function () {
    var connection, results, scheduler, subscription, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.replay(undefined, 3, undefined, scheduler);
    });
    scheduler.scheduleAbsolute(450, function () {
        subscription = ys.subscribe(results);
    });
    scheduler.scheduleAbsolute(475, function () {
        subscription.dispose();
    });
    scheduler.scheduleAbsolute(300, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(400, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(500, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(550, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(650, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(800, function () {
        connection.dispose();
    });
    scheduler.start();
    results.messages.assertEqual(onNext(451, 5), onNext(452, 6), onNext(453, 7));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
});

test('ReplayCount_MultipleConnections', function () {
    var connection1, connection2, connection3, xs, ys;
    xs = Observable.never();
    ys = xs.replay(undefined, 3);
    connection1 = ys.connect();
    connection2 = ys.connect();
    ok(connection1 === connection2);
    connection1.dispose();
    connection2.dispose();
    connection3 = ys.connect();
    ok(connection1 !== connection3);
});

test('ReplayCountLambda_Zip_Complete', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.startWithDispose(function () {
        return xs.replay(function (_xs) {
            return _xs.take(6).repeat();
        }, 3, undefined, scheduler);
    }, 610);
    results.messages.assertEqual(onNext(221, 3), onNext(281, 4), onNext(291, 1), onNext(341, 8), onNext(361, 5), onNext(371, 6), onNext(372, 8), onNext(373, 5), onNext(374, 6), onNext(391, 7), onNext(411, 13), onNext(431, 2), onNext(432, 7), onNext(433, 13), onNext(434, 2), onNext(451, 9), onNext(521, 11), onNext(561, 20), onNext(562, 9), onNext(563, 11), onNext(564, 20), onNext(602, 9), onNext(603, 11), onNext(604, 20), onNext(606, 9), onNext(607, 11), onNext(608, 20));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('ReplayCountLambda_Zip_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
    results = scheduler.startWithCreate(function () {
        return xs.replay(function (_xs) {
            return _xs.take(6).repeat();
        }, 3, undefined, scheduler);
    });
    results.messages.assertEqual(onNext(221, 3), onNext(281, 4), onNext(291, 1), onNext(341, 8), onNext(361, 5), onNext(371, 6), onNext(372, 8), onNext(373, 5), onNext(374, 6), onNext(391, 7), onNext(411, 13), onNext(431, 2), onNext(432, 7), onNext(433, 13), onNext(434, 2), onNext(451, 9), onNext(521, 11), onNext(561, 20), onNext(562, 9), onNext(563, 11), onNext(564, 20), onError(601, ex));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('ReplayCountLambda_Zip_Dispose', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.startWithDispose(function () {
        return xs.replay(function (_xs) {
            return _xs.take(6).repeat();
        }, 3, undefined, scheduler);
    }, 470);
    results.messages.assertEqual(onNext(221, 3), onNext(281, 4), onNext(291, 1), onNext(341, 8), onNext(361, 5), onNext(371, 6), onNext(372, 8), onNext(373, 5), onNext(374, 6), onNext(391, 7), onNext(411, 13), onNext(431, 2), onNext(432, 7), onNext(433, 13), onNext(434, 2), onNext(451, 9));
    xs.subscriptions.assertEqual(subscribe(200, 470));
});

test('ReplayTime_Basic', function () {
    var connection, results, scheduler, subscription, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.replay(undefined, undefined, 150, scheduler);
    });
    scheduler.scheduleAbsolute(450, function () {
        subscription = ys.subscribe(results);
    });
    scheduler.scheduleAbsolute(disposed, function () {
        subscription.dispose();
    });
    scheduler.scheduleAbsolute(300, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(400, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(500, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(550, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(650, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(800, function () {
        connection.dispose();
    });
    scheduler.start();
    results.messages.assertEqual(onNext(451, 8), onNext(452, 5), onNext(453, 6), onNext(454, 7), onNext(521, 11));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
});

test('ReplayTime_Error', function () {
    var connection, ex, results, scheduler, subscription, xs, ys;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.replay(undefined, undefined, 75, scheduler);
    });
    scheduler.scheduleAbsolute(450, function () {
        subscription = ys.subscribe(results);
    });
    scheduler.scheduleAbsolute(disposed, function () {
        subscription.dispose();
    });
    scheduler.scheduleAbsolute(300, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(400, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(500, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(800, function () {
        connection.dispose();
    });
    scheduler.start();
    results.messages.assertEqual(onNext(451, 7), onNext(521, 11), onNext(561, 20), onError(601, ex));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
});

test('ReplayTime_Complete', function () {
    var connection, results, scheduler, subscription, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.replay(undefined, undefined, 85, scheduler);
    });
    scheduler.scheduleAbsolute(450, function () {
        subscription = ys.subscribe(results);
    });
    scheduler.scheduleAbsolute(disposed, function () {
        subscription.dispose();
    });
    scheduler.scheduleAbsolute(300, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(400, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(500, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(800, function () {
        connection.dispose();
    });
    scheduler.start();
    results.messages.assertEqual(onNext(451, 6), onNext(452, 7), onNext(521, 11), onNext(561, 20), onCompleted(601));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
});

test('ReplayTime_Dispose', function () {
    var connection, results, scheduler, subscription, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.replay(undefined, undefined, 100, scheduler);
    });
    scheduler.scheduleAbsolute(450, function () {
        subscription = ys.subscribe(results);
    });
    scheduler.scheduleAbsolute(475, function () {
        subscription.dispose();
    });
    scheduler.scheduleAbsolute(300, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(400, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(500, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(550, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(650, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(800, function () {
        connection.dispose();
    });
    scheduler.start();
    results.messages.assertEqual(onNext(451, 5), onNext(452, 6), onNext(453, 7));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
});

test('ReplayTime_MultipleConnections', function () {
    var connection1, connection2, connection3, xs, ys;
    xs = Observable.never();
    ys = xs.replay(undefined, undefined, 100);
    connection1 = ys.connect();
    connection2 = ys.connect();
    ok(connection1 === connection2);
    connection1.dispose();
    connection2.dispose();
    connection3 = ys.connect();
    ok(connection1 !== connection3);
});

test('ReplayTimeLambda_Zip_Complete', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.startWithDispose(function () {
        return xs.replay(function (_xs) {
            return _xs.take(6).repeat();
        }, undefined, 50, scheduler);
    }, 610);
    results.messages.assertEqual(onNext(221, 3), onNext(281, 4), onNext(291, 1), onNext(341, 8), onNext(361, 5), onNext(371, 6), onNext(372, 8), onNext(373, 5), onNext(374, 6), onNext(391, 7), onNext(411, 13), onNext(431, 2), onNext(432, 7), onNext(433, 13), onNext(434, 2), onNext(451, 9), onNext(521, 11), onNext(561, 20), onNext(562, 11), onNext(563, 20), onNext(602, 20), onNext(604, 20), onNext(606, 20), onNext(608, 20));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('ReplayTimeLambda_Zip_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
    results = scheduler.startWithCreate(function () {
        return xs.replay(function (_xs) {
            return _xs.take(6).repeat();
        }, undefined, 50, scheduler);
    });
    results.messages.assertEqual(onNext(221, 3), onNext(281, 4), onNext(291, 1), onNext(341, 8), onNext(361, 5), onNext(371, 6), onNext(372, 8), onNext(373, 5), onNext(374, 6), onNext(391, 7), onNext(411, 13), onNext(431, 2), onNext(432, 7), onNext(433, 13), onNext(434, 2), onNext(451, 9), onNext(521, 11), onNext(561, 20), onNext(562, 11), onNext(563, 20), onError(601, ex));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('ReplayTimeLambda_Zip_Dispose', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.startWithDispose(function () {
        return xs.replay(function (_xs) {
            return _xs.take(6).repeat();
        }, undefined, 50, scheduler);
    }, 470);
    results.messages.assertEqual(onNext(221, 3), onNext(281, 4), onNext(291, 1), onNext(341, 8), onNext(361, 5), onNext(371, 6), onNext(372, 8), onNext(373, 5), onNext(374, 6), onNext(391, 7), onNext(411, 13), onNext(431, 2), onNext(432, 7), onNext(433, 13), onNext(434, 2), onNext(451, 9));
    xs.subscriptions.assertEqual(subscribe(200, 470));
});