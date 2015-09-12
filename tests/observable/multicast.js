(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('multicast');

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    Subject = Rx.Subject;

  test('multicast hot 1', function () {
    var scheduler = new TestScheduler();

    var s = new Subject();

    var xs = scheduler.createHotObservable(
      onNext(40, 0),
      onNext(90, 1),
      onNext(150, 2),
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5),
      onNext(330, 6),
      onNext(340, 7),
      onCompleted(390));

    var c;
    var o = scheduler.createObserver();
    var d1;
    var d2;

    scheduler.scheduleAbsolute(null, 50, function () {
      c = xs.multicast(s);
    });

    scheduler.scheduleAbsolute(null, 100, function () {
      d1 = c.subscribe(o);
    });

    scheduler.scheduleAbsolute(null, 200, function () {
      d2 = c.connect();
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      d1.dispose();
    });

    scheduler.start();

    o.messages.assertEqual(
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5)
    );

    xs.subscriptions.assertEqual(subscribe(200, 390));
  });

  test('multicast hot 2', function () {
    var scheduler = new TestScheduler();

    var s = new Subject();

    var xs = scheduler.createHotObservable(
      onNext(40, 0),
      onNext(90, 1),
      onNext(150, 2),
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5),
      onNext(330, 6),
      onNext(340, 7),
      onCompleted(390));

    var c;
    var o = scheduler.createObserver();
    var d1;
    var d2;

    scheduler.scheduleAbsolute(null, 50, function () {
      c = xs.multicast(s);
    });

    scheduler.scheduleAbsolute(null, 100, function () {
      d2 = c.connect();
    });

    scheduler.scheduleAbsolute(null, 200, function () {
      d1 = c.subscribe(o);
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      d1.dispose();
    });

    scheduler.start();

    o.messages.assertEqual(
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5));

    xs.subscriptions.assertEqual(
      subscribe(100, 390));
  });

  test('multicast hot 2', function () {
    var scheduler = new TestScheduler();

    var s = new Subject();

    var xs = scheduler.createHotObservable(
      onNext(40, 0),
      onNext(90, 1),
      onNext(150, 2),
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5),
      onNext(330, 6),
      onNext(340, 7),
      onCompleted(390));

    var c;
    var o = scheduler.createObserver();
    var d1;
    var d2;

    scheduler.scheduleAbsolute(null, 50, function () {
      c = xs.multicast(s);
    });

    scheduler.scheduleAbsolute(null, 100, function () {
      d2 = c.connect();
    });

    scheduler.scheduleAbsolute(null, 200, function () {
      d1 = c.subscribe(o);
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      d1.dispose();
    });

    scheduler.start();

    o.messages.assertEqual(
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5));

    xs.subscriptions.assertEqual(subscribe(100, 390));
  });

  test('multicast hot 3', function () {
    var scheduler = new TestScheduler();

    var s = new Subject();

    var xs = scheduler.createHotObservable(
      onNext(40, 0),
      onNext(90, 1),
      onNext(150, 2),
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5),
      onNext(330, 6),
      onNext(340, 7),
      onCompleted(390));

    var c;
    var o = scheduler.createObserver();
    var d1;
    var d2;

    scheduler.scheduleAbsolute(null, 50, function () {
      c = xs.multicast(s);
    });

    scheduler.scheduleAbsolute(null, 100, function () {
      d2 = c.connect();
    });

    scheduler.scheduleAbsolute(null, 200, function () {
      d1 = c.subscribe(o);
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      d2.dispose();
    });

    scheduler.scheduleAbsolute(null, 335, function () {
      d2 = c.connect();
    });

    scheduler.start();

    o.messages.assertEqual(
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5),
      onNext(340, 7),
      onCompleted(390));

    xs.subscriptions.assertEqual(
      subscribe(100, 300),
      subscribe(335, 390));
  });

  test('multicast hot 4', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var s = new Subject();

    var xs = scheduler.createHotObservable(
      onNext(40, 0),
      onNext(90, 1),
      onNext(150, 2),
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5),
      onNext(330, 6),
      onNext(340, 7),
      onError(390, error));

    var c;
    var o = scheduler.createObserver();
    var d1;
    var d2;

    scheduler.scheduleAbsolute(null, 50, function () {
      c = xs.multicast(s);
    });

    scheduler.scheduleAbsolute(null, 100, function () {
      d2 = c.connect();
    });

    scheduler.scheduleAbsolute(null, 200, function () {
      d1 = c.subscribe(o);
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      d2.dispose();
    });

    scheduler.scheduleAbsolute(null, 335, function () {
      d2 = c.connect();
    });

    scheduler.start();

    o.messages.assertEqual(
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5),
      onNext(340, 7),
      onError(390, error));

    xs.subscriptions.assertEqual(
      subscribe(100, 300),
      subscribe(335, 390));
  });

  test('multicast hot 5', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var s = new Subject();

    var xs = scheduler.createHotObservable(
      onNext(40, 0),
      onNext(90, 1),
      onNext(150, 2),
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5),
      onNext(330, 6),
      onNext(340, 7),
      onError(390, error));

    var c;
    var o = scheduler.createObserver();
    var d1;
    var d2;

    scheduler.scheduleAbsolute(null, 50, function () {
      c = xs.multicast(s);
    });

    scheduler.scheduleAbsolute(null, 100, function () {
      d2 = c.connect();
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      d1 = c.subscribe(o);
    });

    scheduler.start();

    o.messages.assertEqual(
      onError(400, error));

    xs.subscriptions.assertEqual(
      subscribe(100, 390));
  });

  test('multicast hot 6', function () {
    var scheduler = new TestScheduler();

    var s = new Subject();

    var xs = scheduler.createHotObservable(
      onNext(40, 0),
      onNext(90, 1),
      onNext(150, 2),
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5),
      onNext(330, 6),
      onNext(340, 7),
      onCompleted(390));

    var c;
    var o = scheduler.createObserver();
    var d1;
    var d2;

    scheduler.scheduleAbsolute(null, 50, function () {
      c = xs.multicast(s);
    });

    scheduler.scheduleAbsolute(null, 100, function () {
      d2 = c.connect();
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      d1 = c.subscribe(o);
    });

    scheduler.start();

    o.messages.assertEqual(
      onCompleted(400));

    xs.subscriptions.assertEqual(
      subscribe(100, 390));
  });

  test('multicast cold completed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(40, 0),
      onNext(90, 1),
      onNext(150, 2),
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5),
      onNext(330, 6),
      onNext(340, 7),
      onCompleted(390));

    var results = scheduler.startScheduler(function () {
      return xs.multicast(function () { return new Subject(); }, function (ys) { return ys; });
    });

    results.messages.assertEqual(
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5),
      onNext(330, 6),
      onNext(340, 7),
      onCompleted(390));

    xs.subscriptions.assertEqual(subscribe(200, 390));
  });

  test('multicast cold Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(40, 0),
      onNext(90, 1),
      onNext(150, 2),
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5),
      onNext(330, 6),
      onNext(340, 7),
      onError(390, error));

    var results = scheduler.startScheduler(function () {
      return xs.multicast(
        function () { return new Subject(); },
        function (ys) { return ys; });
    });

    results.messages.assertEqual(
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5),
      onNext(330, 6),
      onNext(340, 7),
      onError(390, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 390));
  });

  test('multicast cold dispose', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(40, 0),
      onNext(90, 1),
      onNext(150, 2),
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5),
      onNext(330, 6),
      onNext(340, 7));

    var results = scheduler.startScheduler(function () {
      return xs.multicast(function () { return new Subject(); }, function (ys) { return ys; });
    });

    results.messages.assertEqual(
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5),
      onNext(330, 6),
      onNext(340, 7));

    xs.subscriptions.assertEqual(
      subscribe(200, 1000));
  });

  test('multicast cold zip', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(40, 0),
      onNext(90, 1),
      onNext(150, 2),
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5),
      onNext(330, 6),
      onNext(340, 7),
      onCompleted(390));

    var results = scheduler.startScheduler(function () {
      return xs.multicast(function () {
        return new Subject();
      }, function (ys) {
        return ys.zip(ys, function (a, b) { return a + b; });
      });
    });

    results.messages.assertEqual(
      onNext(210, 6),
      onNext(240, 8),
      onNext(270, 10),
      onNext(330, 12),
      onNext(340, 14),
      onCompleted(390));

    xs.subscriptions.assertEqual(
      subscribe(200, 390));
  });

}());
