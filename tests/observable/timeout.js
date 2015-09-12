(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, ok, equal */
  QUnit.module('timeout');

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

  test('timeout in time', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(260, 4),
      onNext(300, 5),
      onNext(350, 6),
      onCompleted(400)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timeout(500, scheduler);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onNext(260, 4),
      onNext(300, 5),
      onNext(350, 6),
      onCompleted(400)
    );
  });

  test('timeout relative time timeout occurs with default error', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(410, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timeout(200, scheduler);
    });

    results.messages.assertEqual(
      onError(400, function (e) { return e.exception instanceof Rx.TimeoutError; })
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );
  });

  test('timeout relative time timeout occurs with custom error', function () {
    var error = new Error('custom');

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(410, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timeout(200, error, scheduler);
    });

    results.messages.assertEqual(
      onError(400, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );
  });

  test('timeout absolute time timeout occurs with default error', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(410, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timeout(new Date(400), scheduler);
    });

    results.messages.assertEqual(
      onError(400, function (e) { return e.exception instanceof Rx.TimeoutError; })
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );
  });

  test('timeout absolute time timeout occurs with custom error', function () {
    var error = new Error('custom');

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(410, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timeout(new Date(400), error, scheduler);
    });

    results.messages.assertEqual(
      onError(400, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );
  });

  test('timeout out of time', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(260, 4),
      onNext(300, 5),
      onNext(350, 6),
      onCompleted(400)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timeout(205, scheduler);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(230, 3),
      onNext(260, 4),
      onNext(300, 5),
      onNext(350, 6),
      onCompleted(400)
    );
  });

  test('timeout timeout occurs 1', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(70, 1),
      onNext(130, 2),
      onNext(310, 3),
      onNext(400, 4),
      onCompleted(500)
    );

    var ys = scheduler.createColdObservable(
      onNext(50, -1),
      onNext(200, -2),
      onNext(310, -3),
      onCompleted(320)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timeout(100, ys, scheduler);
    });

    results.messages.assertEqual(
      onNext(350, -1),
      onNext(500, -2),
      onNext(610, -3),
      onCompleted(620)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 300)
    );

    ys.subscriptions.assertEqual(
      subscribe(300, 620)
    );
  });

  test('timeout timeout occurs 2', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(70, 1),
      onNext(130, 2),
      onNext(240, 3),
      onNext(310, 4),
      onNext(430, 5),
      onCompleted(500)
    );

    var ys = scheduler.createColdObservable(
      onNext(50, -1),
      onNext(200, -2),
      onNext(310, -3),
      onCompleted(320)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timeout(100, ys, scheduler);
    });

    results.messages.assertEqual(
      onNext(240, 3),
      onNext(310, 4),
      onNext(460, -1),
      onNext(610, -2),
      onNext(720, -3),
      onCompleted(730)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 410)
    );

    ys.subscriptions.assertEqual(
      subscribe(410, 730)
    );
  });

  test('timeout timeout occurs Never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(70, 1),
      onNext(130, 2),
      onNext(240, 3),
      onNext(310, 4),
      onNext(430, 5),
      onCompleted(500)
    );

    var ys = scheduler.createColdObservable();

    var results = scheduler.startScheduler(function () {
      return xs.timeout(100, ys, scheduler);
    });

    results.messages.assertEqual(
      onNext(240, 3),
      onNext(310, 4)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 410)
    );

    ys.subscriptions.assertEqual(
      subscribe(410, 1000)
    );
  });

  test('timeout timeout occurs completed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onCompleted(500)
    );

    var ys = scheduler.createColdObservable(
      onNext(100, -1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timeout(100, ys, scheduler);
    });

    results.messages.assertEqual(
      onNext(400, -1)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 300)
    );

    ys.subscriptions.assertEqual(
      subscribe(300, 1000)
    );
  });

  test('timeout timeout occurs Error', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onError(500, new Error())
    );

    var ys = scheduler.createColdObservable(
      onNext(100, -1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timeout(100, ys, scheduler);
    });

    results.messages.assertEqual(
      onNext(400, -1)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 300)
    );

    ys.subscriptions.assertEqual(
      subscribe(300, 1000)
    );
  });

  test('timeout timeout does not occur completed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onCompleted(250)
    );

    var ys = scheduler.createColdObservable(
      onNext(100, -1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timeout(100, ys, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );

    ys.subscriptions.assertEqual();
  });

  test('timeout timeout does not occur Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onError(250, error)
    );

    var ys = scheduler.createColdObservable(
      onNext(100, -1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timeout(100, ys, scheduler);
    });

    results.messages.assertEqual(
      onError(250, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );

    ys.subscriptions.assertEqual();
  });

  test('timeout timeout does not occur', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
      onNext(70, 1),
      onNext(130, 2),
      onNext(240, 3),
      onNext(320, 4),
      onNext(410, 5),
      onCompleted(500)
    );

    var ys = scheduler.createColdObservable(
      onNext(50, -1),
      onNext(200, -2),
      onNext(310, -3),
      onCompleted(320)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timeout(100, ys, scheduler);
    });

    results.messages.assertEqual(
      onNext(240, 3),
      onNext(320, 4),
      onNext(410, 5),
      onCompleted(500)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 500)
    );

    ys.subscriptions.assertEqual();
  });

  test('timeout absolute time timeout occurs', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(410, 1)
    );

    var ys = scheduler.createColdObservable(
      onNext(100, -1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timeout(new Date(400), ys, scheduler);
    });

    results.messages.assertEqual(
      onNext(500, -1)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );

    ys.subscriptions.assertEqual(subscribe(400, 1000));
  });

  test('timeout absolute time timeout does not occur completed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(310, 1),
      onCompleted(390)
    );

    var ys = scheduler.createColdObservable(
      onNext(100, -1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timeout(new Date(400), ys, scheduler);
    });

    results.messages.assertEqual(
      onNext(310, 1), onCompleted(390)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 390)
    );

    ys.subscriptions.assertEqual();
  });

  test('timeout absolute time timeout does not occur Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(310, 1),
      onError(390, error)
    );

    var ys = scheduler.createColdObservable(
      onNext(100, -1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timeout(new Date(400), ys, scheduler);
    });

    results.messages.assertEqual(
      onNext(310, 1),
      onError(390, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 390)
    );

    ys.subscriptions.assertEqual();
  });

  test('timeout absolute time timeoutOccur 2', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(310, 1),
      onNext(350, 2),
      onNext(420, 3),
      onCompleted(450)
    );

    var ys = scheduler.createColdObservable(
      onNext(100, -1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.timeout(new Date(400), ys, scheduler);
    });

    results.messages.assertEqual(
      onNext(310, 1),
      onNext(350, 2),
      onNext(500, -1)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );

    ys.subscriptions.assertEqual(
      subscribe(400, 1000)
    );
  });

  test('timeout absolute time timeoutOccur 3', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(310, 1),
      onNext(350, 2),
      onNext(420, 3),
      onCompleted(450)
    );

    var ys = scheduler.createColdObservable();

    var results = scheduler.startScheduler(function () {
      return xs.timeout(new Date(400), ys, scheduler);
    });

    results.messages.assertEqual(
      onNext(310, 1),
      onNext(350, 2)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );

    ys.subscriptions.assertEqual(
      subscribe(400, 1000)
    );
  });

  test('timeout duration simple never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(310, 1),
      onNext(350, 2),
      onNext(420, 3),
      onCompleted(450));

    var ys = scheduler.createColdObservable();

    var results = scheduler.startScheduler(function () {
      return xs.timeout(ys, function () { return ys; });
    });

    results.messages.assertEqual(
      onNext(310, 1),
      onNext(350, 2),
      onNext(420, 3),
      onCompleted(450));

    xs.subscriptions.assertEqual(
      subscribe(200, 450));

    ys.subscriptions.assertEqual(
      subscribe(200, 310),
      subscribe(310, 350),
      subscribe(350, 420),
      subscribe(420, 450));
  });

  test('timeout duration simple timeout first', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(310, 1),
      onNext(350, 2),
      onNext(420, 3),
      onCompleted(450));

    var ys = scheduler.createColdObservable(
      onNext(100, 'boo!'));

    var zs = scheduler.createColdObservable();

    var results = scheduler.startScheduler(function () {
      return xs.timeout(ys, function () { return zs; });
    });

    equal(1, results.messages.length);
    ok(results.messages[0].time === 300 && results.messages[0].value.exception !== null);

    xs.subscriptions.assertEqual(
      subscribe(200, 300));

    ys.subscriptions.assertEqual(
      subscribe(200, 300));

    zs.subscriptions.assertEqual();
  });

  test('timeout duration simple timeout later', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(310, 1),
      onNext(350, 2),
      onNext(420, 3),
      onCompleted(450));

    var ys = scheduler.createColdObservable();

    var zs = scheduler.createColdObservable(onNext(50, 'boo!'));

    var results = scheduler.startScheduler(function () {
      return xs.timeout(ys, function () { return zs; });
    });

    equal(3, results.messages.length);
    ok(onNext(310, 1).equals(results.messages[0]));
    ok(onNext(350, 2).equals(results.messages[1]));
    ok(results.messages[2].time === 400 && results.messages[2].value.exception !== null);

    xs.subscriptions.assertEqual(
      subscribe(200, 400));

    ys.subscriptions.assertEqual(
      subscribe(200, 310));

    zs.subscriptions.assertEqual(
      subscribe(310, 350),
      subscribe(350, 400));
  });

  test('timeout duration simple timeoutByCompletion', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(310, 1),
      onNext(350, 2),
      onNext(420, 3),
      onCompleted(450));

    var ys = scheduler.createColdObservable();

    var zs = scheduler.createColdObservable(
      onCompleted(50));

    var results = scheduler.startScheduler(function () {
      return xs.timeout(ys, function () { return zs; });
    });

    equal(3, results.messages.length);

    ok(onNext(310, 1).equals(results.messages[0]));
    ok(onNext(350, 2).equals(results.messages[1]));
    ok(results.messages[2].time === 400 && results.messages[2].value.exception !== null);

    xs.subscriptions.assertEqual(
      subscribe(200, 400));

    ys.subscriptions.assertEqual(
      subscribe(200, 310));

    zs.subscriptions.assertEqual(
      subscribe(310, 350),
      subscribe(350, 400));
  });

  test('timeout duration simple timeoutByCompletion', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(310, 1),
      onNext(350, 2),
      onNext(420, 3),
      onCompleted(450));

    var ys = scheduler.createColdObservable();

    var zs = scheduler.createColdObservable();

    var results = scheduler.startScheduler(function () {
      return xs.timeout(ys, function (x) {
        if (x < 3) { return zs; }
        throw error;
      });
    });

    results.messages.assertEqual(
      onNext(310, 1),
      onNext(350, 2),
      onNext(420, 3),
      onError(420, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 420));

    ys.subscriptions.assertEqual(
      subscribe(200, 310));

    zs.subscriptions.assertEqual(
      subscribe(310, 350),
      subscribe(350, 420));
  });

  test('timeout duration simple inner throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(310, 1),
      onNext(350, 2),
      onNext(420, 3),
      onCompleted(450));

    var ys = scheduler.createColdObservable();

    var zs = scheduler.createColdObservable(
      onError(50, error));

    var results = scheduler.startScheduler(function () {
      return xs.timeout(ys, function () { return zs; });
    });

    results.messages.assertEqual(
      onNext(310, 1),
      onNext(350, 2),
      onError(400, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 400));

    ys.subscriptions.assertEqual(
      subscribe(200, 310));

    zs.subscriptions.assertEqual(
      subscribe(310, 350),
      subscribe(350, 400));
  });

  test('timeout duration simple first throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(310, 1),
      onNext(350, 2),
      onNext(420, 3),
      onCompleted(450));

    var ys = scheduler.createColdObservable(
      onError(50, error));

    var zs = scheduler.createColdObservable();

    var results = scheduler.startScheduler(function () {
      return xs.timeout(ys, function () { return zs; });
    });

    results.messages.assertEqual(onError(250, error));
    xs.subscriptions.assertEqual(subscribe(200, 250));
    ys.subscriptions.assertEqual(subscribe(200, 250));
    zs.subscriptions.assertEqual();
  });

  test('timeout duration simple source throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(310, 1),
      onNext(350, 2),
      onNext(420, 3),
      onError(450, error));

    var ys = scheduler.createColdObservable();

    var zs = scheduler.createColdObservable();

    var results = scheduler.startScheduler(function () {
      return xs.timeout(ys, function () { return zs; });
    });

    results.messages.assertEqual(
      onNext(310, 1),
      onNext(350, 2),
      onNext(420, 3),
      onError(450, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 450));

    ys.subscriptions.assertEqual(
      subscribe(200, 310));

    zs.subscriptions.assertEqual(
      subscribe(310, 350),
      subscribe(350, 420),
      subscribe(420, 450));
  });

}());
