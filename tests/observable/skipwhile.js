(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal */
  QUnit.module('skipWhile');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  function isPrime(i) {
    if (i <= 1) { return false; }
    var max = Math.floor(Math.sqrt(i));
    for (var j = 2; j <= max; ++j) {
      if (i % j === 0) { return false; }
    }
    return true;
  }

  test('skipWhile complete before', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, -1),
      onNext(110, -1),
      onNext(210, 2),
      onNext(260, 5),
      onNext(290, 13),
      onNext(320, 3),
      onCompleted(330),
      onNext(350, 7),
      onNext(390, 4),
      onNext(410, 17),
      onNext(450, 8),
      onNext(500, 23),
      onCompleted(600)
    );

    var invoked = 0;

    var results = scheduler.startScheduler(function () {
      return xs.skipWhile(function (x) {
        invoked++;
        return isPrime(x);
      });
    });

    results.messages.assertEqual(
      onCompleted(330)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 330)
    );

    equal(4, invoked);
  });

  test('skipWhile complete after', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, -1),
      onNext(110, -1),
      onNext(210, 2),
      onNext(260, 5),
      onNext(290, 13),
      onNext(320, 3),
      onNext(350, 7),
      onNext(390, 4),
      onNext(410, 17),
      onNext(450, 8),
      onNext(500, 23),
      onCompleted(600)
    );

    var invoked = 0;

    var results = scheduler.startScheduler(function () {
      return xs.skipWhile(function (x) {
          invoked++;
          return isPrime(x);
      });
    });

    results.messages.assertEqual(
      onNext(390, 4),
      onNext(410, 17),
      onNext(450, 8),
      onNext(500, 23),
      onCompleted(600)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );

    equal(6, invoked);
  });

  test('skipWhile error before', function () {
    var error = new Error();
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, -1), onNext(110, -1),
      onNext(210, 2),
      onNext(260, 5),
      onError(270, error),
      onNext(290, 13),
      onNext(320, 3),
      onNext(350, 7),
      onNext(390, 4),
      onNext(410, 17),
      onNext(450, 8),
      onNext(500, 23),
      onCompleted(600)
    );

    var invoked = 0;

    var results = scheduler.startScheduler(function () {
      return xs.skipWhile(function (x) {
        invoked++;
        return isPrime(x);
      });
    });

    results.messages.assertEqual(onError(270, error));
    xs.subscriptions.assertEqual(subscribe(200, 270));
    equal(2, invoked);
  });

  test('skipWhile error after', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, -1),
      onNext(110, -1),
      onNext(210, 2),
      onNext(260, 5),
      onNext(290, 13),
      onNext(320, 3),
      onNext(350, 7),
      onNext(390, 4),
      onNext(410, 17),
      onNext(450, 8),
      onNext(500, 23),
      onError(600, error)
    );

    var invoked = 0;

    var results = scheduler.startScheduler(function () {
      return xs.skipWhile(function (x) {
        invoked++;
        return isPrime(x);
      });
    });

    results.messages.assertEqual(
      onNext(390, 4),
      onNext(410, 17),
      onNext(450, 8),
      onNext(500, 23),
      onError(600, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );

    equal(6, invoked);
  });

  test('skipWhile dispose before', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, -1),
      onNext(110, -1),
      onNext(210, 2),
      onNext(260, 5),
      onNext(290, 13),
      onNext(320, 3),
      onNext(350, 7),
      onNext(390, 4),
      onNext(410, 17),
      onNext(450, 8),
      onNext(500, 23),
      onCompleted(600)
    );

    var invoked = 0;

    var results = scheduler.startScheduler(function () {
      return xs.skipWhile(function (x) {
        invoked++;
        return isPrime(x);
      });
    }, { disposed: 300 });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(200, 300)
    );

    equal(3, invoked);
  });

  test('skipWhile dispose after', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, -1),
      onNext(110, -1),
      onNext(210, 2),
      onNext(260, 5),
      onNext(290, 13),
      onNext(320, 3),
      onNext(350, 7),
      onNext(390, 4),
      onNext(410, 17),
      onNext(450, 8),
      onNext(500, 23),
      onCompleted(600)
    );

    var invoked = 0;

    var results = scheduler.startScheduler(function () {
      return xs.skipWhile(function (x) {
        invoked++;
        return isPrime(x);
      });
    }, { disposed: 470 });

    results.messages.assertEqual(
      onNext(390, 4),
      onNext(410, 17),
      onNext(450, 8)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 470)
    );

    equal(6, invoked);
  });

  test('skipWhile zero', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, -1),
      onNext(110, -1),
      onNext(205, 100),
      onNext(210, 2),
      onNext(260, 5),
      onNext(290, 13),
      onNext(320, 3),
      onNext(350, 7),
      onNext(390, 4),
      onNext(410, 17),
      onNext(450, 8),
      onNext(500, 23),
      onCompleted(600)
    );

    var invoked = 0;

    var results = scheduler.startScheduler(function () {
      return xs.skipWhile(function (x) {
        invoked++;
        return isPrime(x);
      });
    });

    results.messages.assertEqual(
      onNext(205, 100),
      onNext(210, 2),
      onNext(260, 5),
      onNext(290, 13),
      onNext(320, 3),
      onNext(350, 7),
      onNext(390, 4),
      onNext(410, 17),
      onNext(450, 8),
      onNext(500, 23),
      onCompleted(600)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );

    equal(1, invoked);
  });

  test('skipWhile throw', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, -1),
      onNext(110, -1),
      onNext(210, 2),
      onNext(260, 5),
      onNext(290, 13),
      onNext(320, 3),
      onNext(350, 7),
      onNext(390, 4),
      onNext(410, 17),
      onNext(450, 8),
      onNext(500, 23),
      onCompleted(600)
    );

    var error = new Error();

    var invoked = 0;

    var results = scheduler.startScheduler(function () {
      return xs.skipWhile(function (x) {
        invoked++;
        if (invoked === 3) { throw error; }
        return isPrime(x);
      });
    });

    results.messages.assertEqual(
      onError(290, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 290)
    );

    equal(3, invoked);
  });

  test('skipWhile index', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, -1),
      onNext(110, -1),
      onNext(210, 2),
      onNext(260, 5),
      onNext(290, 13),
      onNext(320, 3),
      onNext(350, 7),
      onNext(390, 4),
      onNext(410, 17),
      onNext(450, 8),
      onNext(500, 23),
      onCompleted(600)
    );

    var results = scheduler.startScheduler(function () {
      return xs.skipWhile(function (x, i) {
        return i < 5;
      });
    });

    results.messages.assertEqual(
      onNext(390, 4),
      onNext(410, 17),
      onNext(450, 8),
      onNext(500, 23),
      onCompleted(600)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );
  });

}());
