(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('reduce');

  function add(x, y) { return x + y; }

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('reduce with seed empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.reduce(add, 42);
    });

    results.messages.assertEqual(
      onNext(250, 42),
      onCompleted(250)
    );
  });

  test('reduce with seed return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 24),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.reduce(add, 42);
    });

    results.messages.assertEqual(
      onNext(250, 42 + 24),
      onCompleted(250)
    );
  });

  test('reduce with seed throws error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 24),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.reduce(function () { throw error; }, 42);
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('reduce with seed throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.reduce(add, 42);
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('reduce with seed never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.reduce(add, 42);
    });

    results.messages.assertEqual();
  });

  test('reduce with seed range', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 0),
      onNext(220, 1),
      onNext(230, 2),
      onNext(240, 3),
      onNext(250, 4),
      onCompleted(260)
    );

    var results = scheduler.startScheduler(function () {
      return xs.reduce(add, 42);
    });

    results.messages.assertEqual(
      onNext(260, 10 + 42),
      onCompleted(260)
    );
  });

  test('reduce without seed empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    var results = scheduler.startScheduler(function () {
      return xs.reduce(add);
    });

    results.messages.assertEqual(
      onError(250, function (n) { return n.exception instanceof Rx.EmptyError; })
    );
  });

  test('reduce without seed return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 24),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.reduce(add);
    });

    results.messages.assertEqual(
      onNext(250, 24),
      onCompleted(250)
    );
  });

  test('reduce without seed throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.reduce(add);
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('reduce without seed never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.reduce(add);
    });

    results.messages.assertEqual();
  });

  test('reduce without seed range', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 0),
      onNext(220, 1),
      onNext(230, 2),
      onNext(240, 3),
      onNext(250, 4), onCompleted(260)
    );

    var results = scheduler.startScheduler(function () {
      return xs.reduce(add);
    });

    results.messages.assertEqual(
      onNext(260, 10),
      onCompleted(260)
    );
  });

  test('reduce without seed throws error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 24),
      onNext(220, 1),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.reduce(function () { throw error; });
    });

    results.messages.assertEqual(
      onError(220, error)
    );
  });

}());
