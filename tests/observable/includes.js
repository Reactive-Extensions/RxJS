(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('Includes');

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted;

  test('includes Empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.includes(42);
    });

    results.messages.assertEqual(
      onNext(250, false),
      onCompleted(250)
    );
  });

  test('includes return positive', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.includes(2);
    });

    results.messages.assertEqual(
      onNext(210, true),
      onCompleted(210)
    );
  });

  test('includes return negative', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.includes(-2);
    });

    results.messages.assertEqual(
      onNext(250, false),
      onCompleted(250)
    );
  });

  test('includes some positive', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.includes(3);
    });

    results.messages.assertEqual(
      onNext(220, true),
      onCompleted(220)
    );
  });

  test('includes some negative', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.includes(-3);
    });

    results.messages.assertEqual(
      onNext(250, false),
      onCompleted(250)
    );
  });

  test('includes throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.includes(42);
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('includes never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.includes(42);
    });

    results.messages.assertEqual();
  });

  test('includes fromIndex less than zero', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.includes(42, -1);
    });

    results.messages.assertEqual(
      onNext(200, false),
      onCompleted(200)
    );
  });

  test('includes fromIndex Infinity', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.includes(2, Infinity);
    });

    results.messages.assertEqual(
      onNext(210, true),
      onCompleted(210)
    );
  });

  test('includes fromIndex zero', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.includes(2, 0);
    });

    results.messages.assertEqual(
      onNext(210, true),
      onCompleted(210)
    );
  });

  test('includes fromIndex greater than zero misses', function () {
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
      return xs.includes(2, 1);
    });

    results.messages.assertEqual(
      onNext(250, false),
      onCompleted(250)
    );
  });

  test('includes fromIndex greater than zero no end', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5)
    );

    var results = scheduler.startScheduler(function () {
      return xs.includes(2, 1);
    });

    results.messages.assertEqual(
    );
  });

  test('includes fromIndex greater than zero hits', function () {
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
      return xs.includes(3, 1);
    });

    results.messages.assertEqual(
      onNext(220, true),
      onCompleted(220)
    );
  });

  test('includes -0 equals 0', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, -0),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.includes(0);
    });

    results.messages.assertEqual(
      onNext(210, true),
      onCompleted(210)
    );
  });

  test('includes +0 equals 0', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, +0),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.includes(0);
    });

    results.messages.assertEqual(
      onNext(210, true),
      onCompleted(210)
    );
  });

  test('includes NaN equals NaN', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, NaN),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.includes(NaN);
    });

    results.messages.assertEqual(
      onNext(210, true),
      onCompleted(210)
    );
  });

}());
