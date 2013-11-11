QUnit.module('PublishValue');

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
    inherits = Rx.Internals.inherits;

test('PublishWithInitialValue_Basic', function () {
    var connection, results, scheduler, subscription, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.publishValue(1979);
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
    results.messages.assertEqual(onNext(200, 1979), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(520, 11));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
});

test('PublishWithInitialValue_Error', function () {
    var connection, ex, results, scheduler, subscription, xs, ys;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.publishValue(1979);
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
    results.messages.assertEqual(onNext(200, 1979), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(520, 11), onNext(560, 20), onError(600, ex));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
});

test('PublishWithInitialValue_Complete', function () {
    var connection, results, scheduler, subscription, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.publishValue(1979);
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
    results.messages.assertEqual(onNext(200, 1979), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(520, 11), onNext(560, 20), onCompleted(600));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
});

test('PublishWithInitialValue_Dispose', function () {
    var connection, results, scheduler, subscription, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    ys = null;
    subscription = null;
    connection = null;
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.publishValue(1979);
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
    results.messages.assertEqual(onNext(200, 1979), onNext(340, 8));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
});

test('PublishWithInitialValue_MultipleConnections', function () {
    var connection1, connection2, connection3, xs, ys;
    xs = Observable.never();
    ys = xs.publishValue(1979);
    connection1 = ys.connect();
    connection2 = ys.connect();
    ok(connection1 === connection2);
    connection1.dispose();
    connection2.dispose();
    connection3 = ys.connect();
    ok(connection1 !== connection3);
});

test('PublishWithInitialValueLambda_Zip_Complete', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.startWithCreate(function () {
        return xs.publishValue(function (_xs) {
            return _xs.zip(_xs.skip(1), function (prev, cur) {
                return cur + prev;
            });
        }, 1979);
    });
    results.messages.assertEqual(onNext(220, 1982), onNext(280, 7), onNext(290, 5), onNext(340, 9), onNext(360, 13), onNext(370, 11), onNext(390, 13), onNext(410, 20), onNext(430, 15), onNext(450, 11), onNext(520, 20), onNext(560, 31), onCompleted(600));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('PublishWithInitialValueLambda_Zip_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
    results = scheduler.startWithCreate(function () {
        return xs.publishValue(function (_xs) {
            return _xs.zip(_xs.skip(1), function (prev, cur) {
                return cur + prev;
            });
        }, 1979);
    });
    results.messages.assertEqual(onNext(220, 1982), onNext(280, 7), onNext(290, 5), onNext(340, 9), onNext(360, 13), onNext(370, 11), onNext(390, 13), onNext(410, 20), onNext(430, 15), onNext(450, 11), onNext(520, 20), onNext(560, 31), onError(600, ex));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('PublishWithInitialValueLambda_Zip_Dispose', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.startWithDispose(function () {
        return xs.publishValue(function (_xs) {
            return _xs.zip(_xs.skip(1), function (prev, cur) {
                return cur + prev;
            });
        }, 1979);
    }, 470);
    results.messages.assertEqual(onNext(220, 1982), onNext(280, 7), onNext(290, 5), onNext(340, 9), onNext(360, 13), onNext(370, 11), onNext(390, 13), onNext(410, 20), onNext(430, 15), onNext(450, 11));
    xs.subscriptions.assertEqual(subscribe(200, 470));
});