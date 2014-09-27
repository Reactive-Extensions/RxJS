QUnit.module('Buffer');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

test('Buffer_Boundaries_Simple', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(90, 1),
        onNext(180, 2),
        onNext(250, 3),
        onNext(260, 4),
        onNext(310, 5),
        onNext(340, 6),
        onNext(410, 7),
        onNext(420, 8),
        onNext(470, 9),
        onNext(550, 10),
        onCompleted(590)
    );

    var ys = scheduler.createHotObservable(
        onNext(255, true),
        onNext(330, true),
        onNext(350, true),
        onNext(400, true),
        onNext(500, true),
        onCompleted(900)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.buffer(ys)
    });

    res.messages.assertEqual(
      onNext(255, [3]),
      onNext(330, [4, 5]),
      onNext(350, [6]),
      onNext(400, [ ]),
      onNext(500, [7, 8, 9]),
      onNext(590, [10]),
      onCompleted(590)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 590)
    );

    ys.subscriptions.assertEqual(
        subscribe(200, 590)
    );
});

test('Buffer_Boundaries_onCompletedBoundaries', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(90, 1),
        onNext(180, 2),
        onNext(250, 3),
        onNext(260, 4),
        onNext(310, 5),
        onNext(340, 6),
        onNext(410, 7),
        onNext(420, 8),
        onNext(470, 9),
        onNext(550, 10),
        onCompleted(590)
    );

    var ys = scheduler.createHotObservable(
        onNext(255, true),
        onNext(330, true),
        onNext(350, true),
        onCompleted(400)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.buffer(ys)
    });

    res.messages.assertEqual(
        onNext(255, [3]),
        onNext(330, [4, 5]),
        onNext(350, [6]),
        onNext(400, []),
        onCompleted(400)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 400)
    );

    ys.subscriptions.assertEqual(
        subscribe(200, 400)
    );
});

test('Buffer_Boundaries_onErrorSource', function () {
    var ex = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, 1),
      onNext(180, 2),
      onNext(250, 3),
      onNext(260, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(380, 7),
      onError(400, ex)
    );

    var ys = scheduler.createHotObservable(
      onNext(255, true),
      onNext(330, true),
      onNext(350, true),
      onCompleted(500)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.buffer(ys)
    });

    res.messages.assertEqual(
        onNext(255, [3]),
        onNext(330, [4, 5]),
        onNext(350, [6]),
        onError(400, ex)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 400)
    );

    ys.subscriptions.assertEqual(
        subscribe(200, 400)
    );
});

test('Buffer_Boundaries_onErrorBoundaries', function () {
    var ex = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, 1),
      onNext(180, 2),
      onNext(250, 3),
      onNext(260, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(410, 7),
      onNext(420, 8),
      onNext(470, 9),
      onNext(550, 10),
      onCompleted(590)
    );

    var ys = scheduler.createHotObservable(
      onNext(255, true),
      onNext(330, true),
      onNext(350, true),
      onError(400, ex)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.buffer(ys)
    });

    res.messages.assertEqual(
      onNext(255, [3]),
      onNext(330, [4, 5]),
      onNext(350, [6]),
      onError(400, ex)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 400)
    );
});

test('Buffer_Closings_Basic', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, 1),
      onNext(180, 2),
      onNext(250, 3),
      onNext(260, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(410, 7),
      onNext(420, 8),
      onNext(470, 9),
      onNext(550, 10),
      onCompleted(590)
    );

    var window = 1;

    var res = scheduler.startWithCreate(function () {
        return xs.buffer(function () { return Observable.timer((window++) * 100, scheduler); });
    });

    res.messages.assertEqual(
        onNext(300, [ 3, 4 ]),
        onNext(500, [ 5, 6, 7, 8, 9 ]),
        onNext(590, [ 10 ]),
        onCompleted(590)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 590)
    );
});

test('Buffer_Closings_InnerSubscriptions', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(90, 1),
        onNext(180, 2),
        onNext(250, 3),
        onNext(260, 4),
        onNext(310, 5),
        onNext(340, 6),
        onNext(410, 7),
        onNext(420, 8),
        onNext(470, 9),
        onNext(550, 10),
        onCompleted(590)
    );

    var closings = [
        scheduler.createHotObservable(
            onNext(300, true),
            onNext(350, false),
            onCompleted(380)
        ),
        scheduler.createHotObservable(
            onNext(400, true),
            onNext(510, false),
            onNext(620, false)
        ),
        scheduler.createHotObservable(
            onCompleted(500)
        ),
        scheduler.createHotObservable(
            onNext(600, true)
        )
    ];

    var window = 0;

    var res = scheduler.startWithCreate(function () {
        return xs.buffer(function () { return closings[window++]; });
    });

    res.messages.assertEqual(
        onNext(300, [3, 4 ]),
        onNext(400, [5, 6 ]),
        onNext(500, [7, 8, 9 ]),
        onNext(590, [10 ]),
        onCompleted(590)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 590)
    );

    closings[0].subscriptions.assertEqual(
        subscribe(200, 300)
    );

    closings[1].subscriptions.assertEqual(
        subscribe(300, 400)
    );

    closings[2].subscriptions.assertEqual(
        subscribe(400, 500)
    );

    closings[3].subscriptions.assertEqual(
        subscribe(500, 590)
    );
});

test('Buffer_Closings_Empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(90, 1),
        onNext(180, 2),
        onNext(250, 3),
        onNext(260, 4),
        onNext(310, 5),
        onNext(340, 6),
        onNext(410, 7),
        onNext(420, 8),
        onNext(470, 9),
        onNext(550, 10),
        onCompleted(590)
    );

    var window = 1;

    var res = scheduler.startWithCreate(function () {
        return xs.buffer(function () { return Observable.empty().delay((window++) * 100, scheduler); });
    });

    res.messages.assertEqual(
        onNext(300, [3, 4]),
        onNext(500, [5, 6, 7, 8, 9]),
        onNext(590, [10]),
        onCompleted(590)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 590)
    );
});

test('Buffer_Closings_Dispose', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(90, 1),
        onNext(180, 2),
        onNext(250, 3),
        onNext(260, 4),
        onNext(310, 5),
        onNext(340, 6),
        onNext(410, 7),
        onNext(420, 8),
        onNext(470, 9),
        onNext(550, 10),
        onCompleted(590)
    );

    var window = 1;

    var res = scheduler.startWithDispose(
        function () {
            return xs.buffer(function () { return Observable.timer((window++) * 100, scheduler); })
        },
        400
    );

    res.messages.assertEqual(
        onNext(300, [ 3, 4 ])
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 400)
    );
});

test('Buffer_Closings_Error', function () {
    var scheduler = new TestScheduler();

    var ex = new Error();

    var xs = scheduler.createHotObservable(
        onNext(90, 1),
        onNext(180, 2),
        onNext(250, 3),
        onNext(260, 4),
        onNext(310, 5),
        onNext(340, 6),
        onNext(410, 7),
        onNext(420, 8),
        onNext(470, 9),
        onNext(550, 10),
        onError(590, ex)
    );

    var window = 1;

    var res = scheduler.startWithCreate(function () {
        return xs.buffer(function () { return Observable.timer((window++) * 100, scheduler); });
    });

    res.messages.assertEqual(
        onNext(300, [ 3, 4 ]),
        onNext(500, [ 5, 6, 7, 8, 9 ]),
        onError(590, ex)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 590)
    );
});

test('Buffer_Closings_Throw', function () {
    var scheduler = new TestScheduler();

    var ex = new Error();

    var xs = scheduler.createHotObservable(
        onNext(90, 1),
        onNext(180, 2),
        onNext(250, 3),
        onNext(260, 4),
        onNext(310, 5),
        onNext(340, 6),
        onNext(410, 7),
        onNext(420, 8),
        onNext(470, 9),
        onNext(550, 10),
        onError(590, new Error())
    );

    var res = scheduler.startWithCreate(function () {
        return xs.buffer(function () { throw ex; });
    });

    res.messages.assertEqual(
        onError(200, ex)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 200)
    );
});

test('Buffer_Closings_WindowClose_Error', function () {
    var scheduler = new TestScheduler();

    var ex = new Error();

    var xs = scheduler.createHotObservable(
        onNext(90, 1),
        onNext(180, 2),
        onNext(250, 3),
        onNext(260, 4),
        onNext(310, 5),
        onNext(340, 6),
        onNext(410, 7),
        onNext(420, 8),
        onNext(470, 9),
        onNext(550, 10),
        onError(590, new Error())
    );

    var res = scheduler.startWithCreate(function () {
        return xs.buffer(function () { return Observable.throwException(ex, scheduler); });
    });

    res.messages.assertEqual(
        onError(201, ex)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 201)
    );
});

test('Buffer_OpeningClosings_Basic', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(90, 1),
        onNext(180, 2),
        onNext(250, 3),
        onNext(260, 4),
        onNext(310, 5),
        onNext(340, 6),
        onNext(410, 7),
        onNext(420, 8),
        onNext(470, 9),
        onNext(550, 10),
        onCompleted(590)
    );

    var ys = scheduler.createHotObservable(
        onNext(255, 50),
        onNext(330, 100),
        onNext(350, 50),
        onNext(400, 90),
        onCompleted(900)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.buffer(ys, function (x) { return Observable.timer(x, scheduler); });
    });

    res.messages.assertEqual(
        onNext(305, [4 ]),
        onNext(400, [ ]),
        onNext(430, [6, 7, 8]),
        onNext(490, [7, 8, 9]),
        onCompleted(900)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 900)
    );

    ys.subscriptions.assertEqual(
        subscribe(200, 900)
    );
});
