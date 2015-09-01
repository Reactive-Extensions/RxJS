(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('max');

  function reverseComparer(a, b) {
    return a > b ? -1 : a < b ? 1 : 0;
  }

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('max number empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.max();
    });

    results.messages.assertEqual(
      onError(250, function (n) { return n.exception instanceof Rx.EmptyError; })
    );
  });

  test('max number Return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.max();
    });

    results.messages.assertEqual(
      onNext(250, 2),
      onCompleted(250));
  });

  test('max number Some', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 3),
      onNext(220, 4),
      onNext(230, 2),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.max();
    });

    results.messages.assertEqual(
      onNext(250, 4),
      onCompleted(250));
  });

  test('max number throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error));

    var results = scheduler.startScheduler(function () {
      return xs.max();
    });

    results.messages.assertEqual(
      onError(210, error));
  });

  test('max number Never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1));

    var results = scheduler.startScheduler(function () {
        return xs.max();
    });

    results.messages.assertEqual();
  });

  test('max comparer empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.max(reverseComparer);
    });

    results.messages.assertEqual(
      onError(250, function (n) { return n.exception instanceof Rx.EmptyError; })
    );
  });

  test('max comparer return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 'z'),
      onNext(210, 'a'),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.max(reverseComparer);
    });

    results.messages.assertEqual(
      onNext(250, 'a'),
      onCompleted(250));
  });

  test('max comparer some', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 'z'),
      onNext(210, 'b'),
      onNext(220, 'c'),
      onNext(230, 'a'),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.max(reverseComparer);
    });

    results.messages.assertEqual(
      onNext(250, 'a'),
      onCompleted(250));
  });

  test('max comparer throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 'z'),
      onError(210, error));

    var results = scheduler.startScheduler(function () {
      return xs.max(reverseComparer);
    });

    results.messages.assertEqual(
      onError(210, error));
  });

  test('max comparer never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 'z'));

    var results = scheduler.startScheduler(function () {
      return xs.max(reverseComparer);
    });

    results.messages.assertEqual();
  });

  test('max comparer throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 'z'),
      onNext(210, 'b'),
      onNext(220, 'c'),
      onNext(230, 'a'),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.max(function () { throw error; });
    });

    results.messages.assertEqual(
      onError(220, error));
  });

}());
