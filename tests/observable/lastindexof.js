(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('lastIndexOf');

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted;

  test('lastIndexOf empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.lastIndexOf(42);
    });

    results.messages.assertEqual(
      onNext(250, -1),
      onCompleted(250)
    );
  });

  test('lastIndexOf return positive', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.lastIndexOf(2);
    });

    results.messages.assertEqual(
      onNext(250, 0),
      onCompleted(250)
    );
  });

  test('lastIndexOf return negative', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.lastIndexOf(-2);
    });

    results.messages.assertEqual(
      onNext(250, -1),
      onCompleted(250)
    );
  });

  test('lastIndexOf some positive', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.lastIndexOf(3);
    });

    results.messages.assertEqual(
      onNext(250, 1),
      onCompleted(250)
    );
  });

  test('lastIndexOf some negative', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.lastIndexOf(-3);
    });

    results.messages.assertEqual(
      onNext(250, -1),
      onCompleted(250)
    );
  });

  test('lastIndexOf throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.lastIndexOf(42);
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('lastIndexOf never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.lastIndexOf(42);
    });

    results.messages.assertEqual();
  });

  test('lastIndexOf fromIndex less than zero', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.lastIndexOf(42, -1);
    });

    results.messages.assertEqual(
      onNext(200, -1),
      onCompleted(200)
    );
  });

  test('lastIndexOf fromIndex Infinity', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.lastIndexOf(2, Infinity);
    });

    results.messages.assertEqual(
      onNext(250, 0),
      onCompleted(250)
    );
  });

  test('lastIndexOf fromIndex zero', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.lastIndexOf(2, 0);
    });

    results.messages.assertEqual(
      onNext(250, 0),
      onCompleted(250)
    );
  });

  test('lastIndexOf fromIndex greater than zero misses', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.lastIndexOf(2, 1);
    });

    results.messages.assertEqual(
      onNext(250, -1),
      onCompleted(250)
    );
  });

  test('lastIndexOf fromIndex greater than zero no end', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5)
    );

    var results = scheduler.startScheduler(function () {
      return xs.lastIndexOf(2, 1);
    });

    results.messages.assertEqual(
    );
  });

  test('lastIndexOf fromIndex greater than zero hits', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.lastIndexOf(3, 1);
    });

    results.messages.assertEqual(
      onNext(250, 1),
      onCompleted(250)
    );
  });

  test('lastIndexOf -0 equals 0', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, -0),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.lastIndexOf(0);
    });

    results.messages.assertEqual(
      onNext(250, 0),
      onCompleted(250)
    );
  });

  test('lastIndexOf +0 equals 0', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, +0),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.lastIndexOf(0);
    });

    results.messages.assertEqual(
      onNext(250, 0),
      onCompleted(250)
    );
  });

  test('lastIndexOf hits the last without end', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 2),
      onNext(240, 3),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.lastIndexOf(2);
    });

    results.messages.assertEqual(
      onNext(250, 2),
      onCompleted(250)
    );
  });

  test('lastIndexOf hits the last with end', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 2),
      onNext(240, 3),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.lastIndexOf(2, 2);
    });

    results.messages.assertEqual(
      onNext(250, 2),
      onCompleted(250)
    );
  });

}());
