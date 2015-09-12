(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('min');

  function reverseComparer(a, b) {
    return a > b ? -1 : a < b ? 1 : 0;
  }

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('min empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.min();
    });

    results.messages.assertEqual(
      onNext(250, function (n) { return n.exception instanceof Rx.EmptyError; })
    );
  });

  test('min return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.min();
    });

    results.messages.assertEqual(
      onNext(250, 2),
      onCompleted(250)
    );
  });

  test('min some', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.min();
    });

    results.messages.assertEqual(
      onNext(250, 2),
      onCompleted(250));
  });

  test('min throw', function () {
    var error = new Error();
    
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error));

    var results = scheduler.startScheduler(function () {
      return xs.min();
    });

    results.messages.assertEqual(
      onError(210, error));
  });

  test('min never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1));

    var results = scheduler.startScheduler(function () {
      return xs.min();
    });

    results.messages.assertEqual();
  });

  test('min with comparer empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 'a'),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
        return xs.min(reverseComparer);
    });

    results.messages.assertEqual(
      onNext(250, function (n) { return n.exception instanceof Rx.EmptyError; })
    );
  });

  test('min with comparer non-empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 'z'),
      onNext(210, 'b'),
      onNext(220, 'c'),
      onNext(230, 'a'),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.min(reverseComparer);
    });

    results.messages.assertEqual(onNext(250, 'c'), onCompleted(250));
  });

  test('min with comparer throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 'z'),
      onError(210, error));

    var results = scheduler.startScheduler(function () {
      return xs.min(reverseComparer);
    });

    results.messages.assertEqual(
      onError(210, error));
  });

  test('min with comparer never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 'z'));

    var results = scheduler.startScheduler(function () {
      return xs.min(reverseComparer);
    });

    results.messages.assertEqual();
  });

  test('min with comparer throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 'z'),
      onNext(210, 'b'),
      onNext(220, 'c'),
      onNext(230, 'a'),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.min(function () { throw error; });
    });

    results.messages.assertEqual(
      onError(220, error));
  });

}());
