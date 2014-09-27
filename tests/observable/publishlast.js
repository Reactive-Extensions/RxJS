QUnit.module('PublishLast');

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

test('Prune_Basic', function () {
    var connection, results, scheduler, subscription, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.publishLast();
    });
    scheduler.scheduleAbsolute(subscribed, function () {
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
    results.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
});

test('Prune_Error', function () {
    var connection, ex, results, scheduler, subscription, xs, ys;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.publishLast();
    });
    scheduler.scheduleAbsolute(subscribed, function () {
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
    results.messages.assertEqual(onError(600, ex));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
});

test('Prune_Complete', function () {
    var connection, results, scheduler, subscription, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.publishLast();
    });
    scheduler.scheduleAbsolute(subscribed, function () {
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
    results.messages.assertEqual(onNext(600, 20), onCompleted(600));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
});

test('Prune_Dispose', function () {
    var connection, results, scheduler, subscription, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.publishLast();
    });
    scheduler.scheduleAbsolute(subscribed, function () {
        subscription = ys.subscribe(results);
    });
    scheduler.scheduleAbsolute(350, function () {
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
    results.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
});
test('Prune_MultipleConnections', function () {
    var connection1, connection2, connection3, xs, ys;
    xs = Observable.never();
    ys = xs.publishLast();
    connection1 = ys.connect();
    connection2 = ys.connect();
    ok(connection1 === connection2);
    connection1.dispose();
    connection2.dispose();
    connection3 = ys.connect();
    ok(connection1 !== connection3);
});
test('PruneLambda_Zip_Complete', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.startWithCreate(function () {
        return xs.publishLast(function (_xs) {
            return _xs.zip(_xs, function (x, y) {
                return x + y;
            });
        });
    });
    results.messages.assertEqual(onNext(600, 40), onCompleted(600));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('PruneLambda_Zip_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
    results = scheduler.startWithCreate(function () {
        return xs.publishLast(function (_xs) {
            return _xs.zip(_xs, function (x, y) {
                return x + y;
            });
        });
    });
    results.messages.assertEqual(onError(600, ex));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('PruneLambda_Zip_Dispose', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.startWithDispose(function () {
        return xs.publishLast(function (_xs) {
            return _xs.zip(_xs, function (x, y) {
                return x + y;
            });
        });
    }, 470);
    results.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(200, 470));
});
