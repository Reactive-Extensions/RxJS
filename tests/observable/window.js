(function () {
  QUnit.module('Window');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe,
      created = Rx.ReactiveTest.created,
      subscribed = Rx.ReactiveTest.subscribed,
      disposed = Rx.ReactiveTest.disposed;

  test('Window_Closings_Basic', function () {
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

    var results = scheduler.startWithCreate(function () {
      return xs.window(function () {
        return Observable.timer(window++ * 100, null, scheduler);
      }).map(function (w, i) {
        return w.map(function (x) { return i + ' ' + x; });
      }).mergeAll();
    });

    results.messages.assertEqual(
      onNext(250, '0 3'),
      onNext(260, '0 4'),
      onNext(310, '1 5'),
      onNext(340, '1 6'),
      onNext(410, '1 7'),
      onNext(420, '1 8'),
      onNext(470, '1 9'),
      onNext(550, '2 10'),
      onCompleted(590)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 590));
  });

  test('Window_Closings_Dispose', function () {
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
      onCompleted(590));

    var window = 1;

    var results = scheduler.startWithDispose(function () {
      return xs.window(function () {
        return Observable.timer(window++ * 100, null, scheduler);
      }).map(function (w, i) {
        return w.map(function (x) { return i + ' ' + x; });
      }).mergeAll();
    }, 400);

    results.messages.assertEqual(
      onNext(250, '0 3'),
      onNext(260, '0 4'),
      onNext(310, '1 5'),
      onNext(340, '1 6'));

    xs.subscriptions.assertEqual(
      subscribe(200, 400));
  });

  test('Window_Closings_Error', function () {
    var error = new Error();

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
      onError(590, error));

    var window = 1;

    var results = scheduler.startWithCreate(function () {
      return xs.window(function () {
        return Observable.timer(window++ * 100, null, scheduler);
      }).map(function (w, i) {
        return w.map(function (x) { return i + ' ' + x; });
      }).mergeAll();
    });

    results.messages.assertEqual(
      onNext(250, '0 3'),
      onNext(260, '0 4'),
      onNext(310, '1 5'),
      onNext(340, '1 6'),
      onNext(410, '1 7'),
      onNext(420, '1 8'),
      onNext(470, '1 9'),
      onNext(550, '2 10'),
      onError(590, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 590));
  });

  test('Window_Closings_Throw', function () {
    var error = new Error();

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
      onCompleted(590));

    var window = 1;

    var results = scheduler.startWithCreate(function () {
      return xs.window(function () { throw error; })
        .map(function (w, i) { return w.map(function (x) { return i + ' ' + x; }); })
        .mergeAll();
    });
    results.messages.assertEqual(
      onError(200, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 200));
  });

  test('Window_Closings_WindowClose_Error', function () {
    var error = new Error();

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
      onCompleted(590));

    var window = 1;

    var results = scheduler.startWithCreate(function () {
      return xs.window(function () {
        return Observable['throw'](error, scheduler);
      }).map(function (w, i) {
        return w.map(function (x) { return i + ' ' + x; });
      }).mergeAll();
    });

    results.messages.assertEqual
    (onError(201, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 201));
  });

  test('Window_Closings_Default', function () {
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
      onCompleted(590));

    var window = 1;

    var results = scheduler.startWithCreate(function () {
      return xs.window(function () {
        return Observable.timer(window++ * 100, null, scheduler);
      }).map(function (w, i) {
        return w.map(function (x) { return i + ' ' + x; });
      }).mergeAll();
    });

    results.messages.assertEqual(
      onNext(250, '0 3'),
      onNext(260, '0 4'),
      onNext(310, '1 5'),
      onNext(340, '1 6'),
      onNext(410, '1 7'),
      onNext(420, '1 8'),
      onNext(470, '1 9'),
      onNext(550, '2 10'),
      onCompleted(590));

    xs.subscriptions.assertEqual(
      subscribe(200, 590));
  });

  test('Window_OpeningClosings_Basic', function () {
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
      onCompleted(590));

    var ys = scheduler.createHotObservable(
      onNext(255, 50),
      onNext(330, 100),
      onNext(350, 50),
      onNext(400, 90),
      onCompleted(900));

    var results = scheduler.startWithCreate(function () {
      return xs.window(ys, function (x) {
        return Observable.timer(x, null, scheduler);
      }).map(function (w, i) {
        return w.map(function (x) { return i + ' ' + x; });
      }).mergeAll();
    });

    results.messages.assertEqual(
      onNext(260, '0 4'),
      onNext(340, '1 6'),
      onNext(410, '1 7'),
      onNext(410, '3 7'),
      onNext(420, '1 8'),
      onNext(420, '3 8'),
      onNext(470, '3 9'),
      onCompleted(900));

    xs.subscriptions.assertEqual(
      subscribe(200, 900));

    ys.subscriptions.assertEqual(
      subscribe(200, 900));
  });

  test('Window_OpeningClosings_Throw', function () {
    var error = new Error();

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
      onCompleted(590));

    var ys = scheduler.createHotObservable(
      onNext(255, 50),
      onNext(330, 100),
      onNext(350, 50),
      onNext(400, 90),
      onCompleted(900));

    var results = scheduler.startWithCreate(function () {
      return xs.window(ys, function (x) { throw error; })
        .map(function (w, i) { return w.map(function (x) { return i + ' ' + x; });
      }).mergeAll();
    });

    results.messages.assertEqual(
      onError(255, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 255));

    ys.subscriptions.assertEqual(
      subscribe(200, 255));
  });

  test('Window_OpeningClosings_Dispose', function () {
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
      onCompleted(590));

    var ys = scheduler.createHotObservable(
      onNext(255, 50),
      onNext(330, 100),
      onNext(350, 50),
      onNext(400, 90),
      onCompleted(900));

    var results = scheduler.startWithDispose(function () {
      return xs.window(ys, function (x) {
        return Observable.timer(x, null, scheduler);
      }).map(function (w, i) {
        return w.map(function (x) { return i + ' ' + x; });
      }).mergeAll();
    }, 415);

    results.messages.assertEqual(
      onNext(260, '0 4'),
      onNext(340, '1 6'),
      onNext(410, '1 7'),
      onNext(410, '3 7'));

    xs.subscriptions.assertEqual(
      subscribe(200, 415));

    ys.subscriptions.assertEqual(
      subscribe(200, 415));
  });

  test('Window_OpeningClosings_Data_Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, 1),
      onNext(180, 2),
      onNext(250, 3),
      onNext(260, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(410, 7),
      onError(415, error));

    var ys = scheduler.createHotObservable(
      onNext(255, 50),
      onNext(330, 100),
      onNext(350, 50),
      onNext(400, 90),
      onCompleted(900));

    var results = scheduler.startWithCreate(function () {
      return xs.window(ys, function (x) {
        return Observable.timer(x, null, scheduler);
      }).map(function (w, i) {
          return w.map(function (x) { return i + ' ' + x; });
      }).mergeAll();
    });

    results.messages.assertEqual(
      onNext(260, '0 4'),
      onNext(340, '1 6'),
      onNext(410, '1 7'),
      onNext(410, '3 7'),
      onError(415, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 415));

    ys.subscriptions.assertEqual(
      subscribe(200, 415));
  });

  test('Window_OpeningClosings_Window_Error', function () {
    var error = new Error();

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
      onCompleted(590));

    var ys = scheduler.createHotObservable(
      onNext(255, 50),
      onNext(330, 100),
      onNext(350, 50),
      onNext(400, 90),
      onError(415, error));

    var results = scheduler.startWithCreate(function () {
      return xs.window(ys, function (x) {
        return Observable.timer(x, null, scheduler);
      }).map(function (w, i) {
        return w.map(function (x) { return i + ' ' + x; });
      }).mergeAll();
    });

    results.messages.assertEqual(
      onNext(260, '0 4'),
      onNext(340, '1 6'),
      onNext(410, '1 7'),
      onNext(410, '3 7'),
      onError(415, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 415));

    ys.subscriptions.assertEqual(
      subscribe(200, 415));
  });

  test('Window_Boundaries_Simple', function () {
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
      return xs.window(ys).map(function (w, i) {
        return w.map(function (x) { return i + ' ' + x; })
      }).mergeAll();
    });

    res.messages.assertEqual(
      onNext(250, '0 3'),
      onNext(260, '1 4'),
      onNext(310, '1 5'),
      onNext(340, '2 6'),
      onNext(410, '4 7'),
      onNext(420, '4 8'),
      onNext(470, '4 9'),
      onNext(550, '5 10'),
      onCompleted(590)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 590)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 590)
    );
  });

  test('Window_Boundaries_onCompletedBoundaries', function () {
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
      return xs.window(ys).map(function (w, i) {
        return w.map(function (x) { return i + ' ' + x; });
      }).mergeAll();
    });

    res.messages.assertEqual(
            onNext(250, '0 3'),
            onNext(260, '1 4'),
            onNext(310, '1 5'),
            onNext(340, '2 6'),
            onCompleted(400)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 400)
    );
  });

  test('Window_Boundaries_onErrorSource', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, 1),
      onNext(180, 2),
      onNext(250, 3),
      onNext(260, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(380, 7),
      onError(400, error)
    );

    var ys = scheduler.createHotObservable(
      onNext(255, true),
      onNext(330, true),
      onNext(350, true),
      onCompleted(500)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.window(ys).map(function (w, i) {
        return w.map(function (x) { return i + ' ' + x; });
      }).mergeAll();
    });

    res.messages.assertEqual(
      onNext(250, '0 3'),
      onNext(260, '1 4'),
      onNext(310, '1 5'),
      onNext(340, '2 6'),
      onNext(380, '3 7'),
      onError(400, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 400)
    );
  });

  test('Window_Boundaries_onErrorBoundaries', function () {
    var error = new Error();

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
      onError(400, error)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.window(ys).map(function (w, i) {
        return w.map(function (x) {
          return i + ' ' + x;
        })
      }).mergeAll();
    });

    res.messages.assertEqual(
      onNext(250, '0 3'),
      onNext(260, '1 4'),
      onNext(310, '1 5'),
      onNext(340, '2 6'),
      onError(400, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 400)
    );
  });

}());
