(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, raises */

  QUnit.module('slice');

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted;

  test('slice arguments', function () {
    raises(function () {
      Rx.Observable.of(1,2,3).slice(-1);
    });

    raises(function () {
      Rx.Observable.of(1,2,3).slice(0, -1);
    });

    raises(function () {
      Rx.Observable.of(1,2,3).slice(25, 1);
    });
  });

  test('slice never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.slice(0);
    });

    results.messages.assertEqual(

    );
  });

  test('slice empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.slice(0);
    });

    results.messages.assertEqual(
      onCompleted(250)
    );
  });

  test('slice error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(250, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.slice(0);
    });

    results.messages.assertEqual(
      onError(250, error)
    );
  });

  test('slice single no end', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.slice(0);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onCompleted(250)
    );
  });

  test('slice single end', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.slice(0, 1);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onCompleted(220)
    );
  });

  test('slice multiple no end', function () {
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
      return xs.slice(0);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );
  });

  test('slice multiple one no end', function () {
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
      return xs.slice(1);
    });

    results.messages.assertEqual(
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );
  });

  test('slice multiple no end error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onError(230, error),
      onNext(240, 5),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.slice(0);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(220, 3),
      onError(230, error)
    );
  });

  test('slice multiple end', function () {
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
      return xs.slice(0, 3);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onCompleted(240)
    );
  });

  test('slice multiple one end', function () {
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
      return xs.slice(1, 3);
    });

    results.messages.assertEqual(
      onNext(220, 3),
      onNext(230, 4),
      onCompleted(240)
    );
  });

  test('slice multiple end error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onError(230, error),
      onNext(240, 5),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.slice(0, 3);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(220, 3),
      onError(230, error)
    );
  });

}());
