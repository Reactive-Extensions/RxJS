(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('jorSort');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('jortSort never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(180, 1)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.jortSort();
    });

    results.messages.assertEqual();
  });

  test('jortSort empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(180, 1),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.jortSort();
    });

    results.messages.assertEqual(
      onNext(250, true),
      onCompleted(250)
    );
  });

  test('jortSort error', function () {
    var scheduler = new TestScheduler();
    var error = new Error();

    var xs = scheduler.createHotObservable(
      onNext(180, 1),
      onError(250, error)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.jortSort();
    });

    results.messages.assertEqual(
      onError(250, error)
    );
  });

  test('jortSort returns true', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(180, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.jortSort();
    });

    results.messages.assertEqual(
      onNext(250, true),
      onCompleted(250)
    );
  });

  test('jortSort returns false', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(180, 1),
      onNext(210, 5),
      onNext(220, 3),
      onNext(230, 2),
      onNext(240, 4),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.jortSort();
    });

    results.messages.assertEqual(
      onNext(250, false),
      onCompleted(250)
    );
  });

}());
