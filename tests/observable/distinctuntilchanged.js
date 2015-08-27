(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('distinctUntilChanged');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('distinctUntilChanged never', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Rx.Observable.never().distinctUntilChanged();
    });

    results.messages.assertEqual();
  });

  test('distinctUntilChanged empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.distinctUntilChanged();
    });

    results.messages.assertEqual(
      onCompleted(250));
  });

  test('distinctUntilChanged return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 2),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.distinctUntilChanged();
    });

    results.messages.assertEqual(
      onNext(220, 2),
      onCompleted(250));
  });

  test('distinctUntilChanged throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(250, error));

    var results = scheduler.startScheduler(function () {
      return xs.distinctUntilChanged();
    });

    results.messages.assertEqual(
      onError(250, error));
  });

  test('distinctUntilChanged all changes', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.distinctUntilChanged();
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250));
  });

  test('distinctUntilChanged all same', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onNext(220, 2),
        onNext(230, 2),
        onNext(240, 2),
        onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.distinctUntilChanged();
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onCompleted(250));
  });

  test('distinctUntilChanged some changes', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(215, 3),
      onNext(220, 3),
      onNext(225, 2),
      onNext(230, 2),
      onNext(230, 1),
      onNext(240, 2),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.distinctUntilChanged();
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(215, 3),
      onNext(225, 2),
      onNext(230, 1),
      onNext(240, 2),
      onCompleted(250));
  });

  test('distinctUntilChanged comparer all equal', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.distinctUntilChanged(null, function () { return true; });
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onCompleted(250));
  });

  test('distinctUntilChanged comparer all different', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 2),
      onNext(230, 2),
      onNext(240, 2),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.distinctUntilChanged(null, function () { return false; });
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(220, 2),
      onNext(230, 2),
      onNext(240, 2),
      onCompleted(250));
  });

  test('distinctUntilChanged key selector evens', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 4),
      onNext(230, 3),
      onNext(240, 5),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.distinctUntilChanged(function (x) { return x % 2; });
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(220, 4),
      onCompleted(250));
  });

  test('distinctUntilChanged key selector throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.distinctUntilChanged(function () { throw error; });
    });

    results.messages.assertEqual(
      onError(210, error));
  });

  test('distinctUntilChanged comparer throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.distinctUntilChanged(null, function () { throw error; });
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onError(220, error));
  });

}());
