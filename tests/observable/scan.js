(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('scan');

  function add(x, y) { return x + y; }

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted;

  test('scan with seed throws error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 24),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.scan(function () { throw error; }, 42);
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('scan with seed never', function () {
    var scheduler = new TestScheduler();

    var seed = 42;

    var results = scheduler.startScheduler(function () {
      return Rx.Observable.never().scan(add, seed);
    });

    results.messages.assertEqual();
  });

  test('scan with seed empty', function () {
    var scheduler = new TestScheduler();

    var seed = 42;

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.scan(add, seed);
    });

    results.messages.assertEqual(
      onNext(250, 42),
      onCompleted(250)
    );

  });

  test('scan with seed return', function () {
    var scheduler = new TestScheduler();

    var seed = 42;

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.scan(add, seed);
    });

    results.messages.assertEqual(
      onNext(220, seed + 2),
      onCompleted(250)
    );
  });

  test('scan with seed throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var seed = 42;

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(250, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.scan(add, seed);
    });

    results.messages.assertEqual(
      onError(250, error)
    );
  });

  test('scan with seed some data', function () {
    var scheduler = new TestScheduler();

    var seed = 1;

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.scan(add, seed);
    });

    results.messages.assertEqual(
      onNext(210, seed + 2),
      onNext(220, seed + 2 + 3),
      onNext(230, seed + 2 + 3 + 4),
      onNext(240, seed + 2 + 3 + 4 + 5),
      onCompleted(250)
    );
  });

  test('scan no seed never', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Rx.Observable.never().scan(function (acc, x) {
        return acc + x;
      });
    });

    results.messages.assertEqual();
  });

  test('scan no seed empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.scan(function (acc, x) {
        return acc + x;
      });
    });

    results.messages.assertEqual(onCompleted(250));
  });

  test('scan no seed return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.scan(function (acc, x) {
        acc === undefined && (acc = 0);
        return acc + x;
      });
    });

    results.messages.assertEqual(
      onNext(220, 2),
      onCompleted(250)
    );
  });

  test('scan no seed throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(250, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.scan(function (acc, x) {
        acc === undefined && (acc = 0);
        return acc + x;
      });
    });

    results.messages.assertEqual(onError(250, error));
  });

  test('scan no seed some data', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.scan(function (acc, x) {
        acc === undefined && (acc = 0);
        return acc + x;
      });
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(220, 2 + 3),
      onNext(230, 2 + 3 + 4),
      onNext(240, 2 + 3 + 4 + 5),
      onCompleted(250));
  });

  test('scan without seed throws error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.scan(function () { throw error; });
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onError(220, error)
    );
  });

}());
