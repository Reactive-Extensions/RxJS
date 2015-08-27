(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('delay');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('delay relative time simple 1', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onCompleted(550));

    var results = scheduler.startScheduler(function () {
      return xs.delay(100, scheduler);
    });

    results.messages.assertEqual(
      onNext(350, 2),
      onNext(450, 3),
      onNext(550, 4),
      onCompleted(650));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay absolute time simple 1 implementation', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onCompleted(550));

    var results = scheduler.startScheduler(function () {
      return xs.delay(new Date(300), scheduler);
    });

    results.messages.assertEqual(
      onNext(350, 2),
      onNext(450, 3),
      onNext(550, 4),
      onCompleted(650));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay relative time simple 2 implementation', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onCompleted(550));

    var results = scheduler.startScheduler(function () {
      return xs.delay(50, scheduler);
    });

    results.messages.assertEqual(
      onNext(300, 2),
      onNext(400, 3),
      onNext(500, 4),
      onCompleted(600));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay absolute time simple 2 implementation', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onCompleted(550));

    var results = scheduler.startScheduler(function () {
      return xs.delay(new Date(250), scheduler);
    });

    results.messages.assertEqual(
      onNext(300, 2),
      onNext(400, 3),
      onNext(500, 4),
      onCompleted(600));

    xs.subscriptions.assertEqual(subscribe(200, 550));
  });

  test('delay relative time simple 3 implementation', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onCompleted(550));

    var results = scheduler.startScheduler(function () {
      return xs.delay(150, scheduler);
    });

    results.messages.assertEqual(
      onNext(400, 2),
      onNext(500, 3),
      onNext(600, 4),
      onCompleted(700));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay absolute time simple 3 implementation', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onCompleted(550));

    var results = scheduler.startScheduler(function () {
      return xs.delay(new Date(350), scheduler);
    });

    results.messages.assertEqual(
      onNext(400, 2),
      onNext(500, 3),
      onNext(600, 4),
      onCompleted(700));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay relative time error 1 implementation', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onError(550, error));

    var results = scheduler.startScheduler(function () {
      return xs.delay(50, scheduler);
    });

    results.messages.assertEqual(
      onNext(300, 2),
      onNext(400, 3),
      onNext(500, 4),
      onError(550, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay absolute time error 1 implementation', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onError(550, error));

    var results = scheduler.startScheduler(function () {
      return xs.delay(new Date(250), scheduler);
    });

    results.messages.assertEqual(
      onNext(300, 2),
      onNext(400, 3),
      onNext(500, 4),
      onError(550, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay relative time error 2 implementation', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onError(550, error));

    var results = scheduler.startScheduler(function () {
      return xs.delay(150, scheduler);
    });

    results.messages.assertEqual(
      onNext(400, 2),
      onNext(500, 3),
      onError(550, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay absolute time error 2 implementation', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onError(550, error));

    var results = scheduler.startScheduler(function () {
      return xs.delay(new Date(350), scheduler);
    });

    results.messages.assertEqual(
      onNext(400, 2),
      onNext(500, 3),
      onError(550, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(550));

    var results = scheduler.startScheduler(function () {
      return xs.delay(10, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(560));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(550, error));

    var results = scheduler.startScheduler(function () {
      return xs.delay(10, scheduler);
    });

    results.messages.assertEqual(
      onError(550, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('delay never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1));

    var results = scheduler.startScheduler(function () {
      return xs.delay(10, scheduler);
    });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(200, 1000));
  });

  // delay with selector
  test('delay duration simple 1', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 10),
      onNext(220, 30),
      onNext(230, 50),
      onNext(240, 35),
      onNext(250, 20),
      onCompleted(260));

    var results = scheduler.startScheduler(function () {
      return xs.delay(function (x) {
        return scheduler.createColdObservable(onNext(x, '!'));
      });
    });

    results.messages.assertEqual(
      onNext(210 + 10, 10),
      onNext(220 + 30, 30),
      onNext(250 + 20, 20),
      onNext(240 + 35, 35),
      onNext(230 + 50, 50),
      onCompleted(280));

    xs.subscriptions.assertEqual(subscribe(200, 260));
  });

  test('delay duration simple 2', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onNext(250, 6),
      onCompleted(300));

    var ys = scheduler.createColdObservable(
      onNext(10, '!'));

    var results = scheduler.startScheduler(function () {
      return xs.delay(function () { return ys; });
    });

    results.messages.assertEqual(
      onNext(210 + 10, 2),
      onNext(220 + 10, 3),
      onNext(230 + 10, 4),
      onNext(240 + 10, 5),
      onNext(250 + 10, 6),
      onCompleted(300));

    xs.subscriptions.assertEqual(
      subscribe(200, 300));

    ys.subscriptions.assertEqual(
      subscribe(210, 220),
      subscribe(220, 230),
      subscribe(230, 240),
      subscribe(240, 250),
      subscribe(250, 260));
  });

  test('delay duration simple 3', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onNext(250, 6),
      onCompleted(300));

    var ys = scheduler.createColdObservable(
      onNext(100, '!'));

    var results = scheduler.startScheduler(function () {
      return xs.delay(function () { return ys; });
    });

    results.messages.assertEqual(
      onNext(210 + 100, 2),
      onNext(220 + 100, 3),
      onNext(230 + 100, 4),
      onNext(240 + 100, 5),
      onNext(250 + 100, 6),
      onCompleted(350));

    xs.subscriptions.assertEqual(
      subscribe(200, 300));

    ys.subscriptions.assertEqual(
      subscribe(210, 310),
      subscribe(220, 320),
      subscribe(230, 330),
      subscribe(240, 340),
      subscribe(250, 350));
  });

  test('delay duration simple 4 inner empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onNext(250, 6),
      onCompleted(300));

    var ys = scheduler.createColdObservable(
      onCompleted(100));

    var results = scheduler.startScheduler(function () {
      return xs.delay(function () { return ys; });
    });

    results.messages.assertEqual(
      onNext(210 + 100, 2),
      onNext(220 + 100, 3),
      onNext(230 + 100, 4),
      onNext(240 + 100, 5),
      onNext(250 + 100, 6),
      onCompleted(350));

    xs.subscriptions.assertEqual(
      subscribe(200, 300));

    ys.subscriptions.assertEqual(
      subscribe(210, 310),
      subscribe(220, 320),
      subscribe(230, 330),
      subscribe(240, 340),
      subscribe(250, 350));
  });

  test('delay duration dispose 1', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onNext(250, 6),
      onCompleted(300));

    var ys = scheduler.createColdObservable(
      onNext(200, '!'));

    var results = scheduler.startScheduler(function () {
      return xs.delay(function () { return ys; });
    }, { disposed: 425 });

    results.messages.assertEqual(
      onNext(210 + 200, 2),
      onNext(220 + 200, 3));

    xs.subscriptions.assertEqual(
      subscribe(200, 300));

    ys.subscriptions.assertEqual(
      subscribe(210, 410),
      subscribe(220, 420),
      subscribe(230, 425),
      subscribe(240, 425),
      subscribe(250, 425));
  });

  test('delay duration dispose 2', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(400, 3),
      onCompleted(500));

    var ys = scheduler.createColdObservable(
      onNext(50, '!'));

    var results = scheduler.startScheduler(function () {
        return xs.delay(function () { return ys; });
    }, { disposed: 300 });

    results.messages.assertEqual(
      onNext(210 + 50, 2));

    xs.subscriptions.assertEqual(
      subscribe(200, 300));

    ys.subscriptions.assertEqual(
      subscribe(210, 260));
  });

}());
