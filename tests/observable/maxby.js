(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('maxBy');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;


  function reverseComparer(a, b) {
    return a > b ? -1 : a < b ? 1 : 0;
  }

  test('maxBy empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, { key: 1, value: 'z' }),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.maxBy(function (x) { return x.key; });
    });

    results.messages.assertEqual(
      onNext(250, []),
      onCompleted(250)
    );
  });

  test('maxBy return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, { key: 1, value: 'z' }),
      onNext(210, { key: 2, value: 'a' }),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.maxBy(function (x) { return x.key; });
    });

    results.messages.assertEqual(
      onNext(250, [{ key: 2, value: 'a' }]),
      onCompleted(250)
    );
  });

  test('maxBy some', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, { key: 1, value: 'z' }),
      onNext(210, { key: 3, value: 'b' }),
      onNext(220, { key: 4, value: 'c' }),
      onNext(230, { key: 2, value: 'a' }),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.maxBy(function (x) { return x.key; });
    });

    results.messages.assertEqual(
      onNext(250, [{ key: 4, value: 'c' }]),
      onCompleted(250)
    );
  });

  test('maxBy multiple', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, { key: 1, value: 'z' }),
      onNext(210, { key: 3, value: 'b' }),
      onNext(215, { key: 2, value: 'd' }),
      onNext(220, { key: 3, value: 'c' }),
      onNext(225, { key: 2, value: 'y' }),
      onNext(230, { key: 4, value: 'a' }),
      onNext(235, { key: 4, value: 'r' }),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.maxBy(function (x) { return x.key; });
    });

    results.messages.assertEqual(
      onNext(250, [{ key: 4, value: 'a' }, { key: 4, value: 'r' }]),
      onCompleted(250)
    );
  });

  test('maxBy throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, { key: 1, value: 'z' }),
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.maxBy(function (x) { return x.key; });
    });

    results.messages.assertEqual(
      onError(210, error));
  });

  test('maxBy never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, { key: 1, value: 'z' }));

    var results = scheduler.startScheduler(function () {
      return xs.maxBy(function (x) { return x.key; });
    });

    results.messages.assertEqual();
  });

  test('maxBy comparer empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, { key: 1, value: 'z' }),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.maxBy(function (x) { return x.key; }, reverseComparer);
    });

    results.messages.assertEqual(
      onNext(250, []),
      onCompleted(250)
    );
  });

  test('maxBy comparer return', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, { key: 1, value: 'z' }),
      onNext(210, { key: 2, value: 'a' }),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.maxBy(function (x) { return x.key; }, reverseComparer);
    });

    results.messages.assertEqual(
      onNext(250, [{ key: 2, value: 'a' }]),
      onCompleted(250)
    );
  });

  test('maxBy comparer some', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, { key: 1, value: 'z' }),
      onNext(210, { key: 3, value: 'b' }),
      onNext(220, { key: 4, value: 'c' }),
      onNext(230, { key: 2, value: 'a' }),
      onCompleted(250)
    );
    var results = scheduler.startScheduler(function () {
      return xs.maxBy(function (x) { return x.key; }, reverseComparer);
    });

    results.messages.assertEqual(
      onNext(250, [{ key: 2, value: 'a' }]),
      onCompleted(250)
    );
  });

  test('maxBy comparer throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, { key: 1, value: 'z' }),
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.maxBy(function (x) { return x.key; }, reverseComparer);
    });

    results.messages.assertEqual(
      onError(210, error));
  });

  test('maxBy comparer never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, { key: 1, value: 'z' }));

    var results = scheduler.startScheduler(function () {
      return xs.maxBy(function (x) { return x.key; }, reverseComparer);
    });

    results.messages.assertEqual();
  });

  test('maxBy selector throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, { key: 1, value: 'z' }),
      onNext(210, { key: 3, value: 'b' }),
      onNext(220, { key: 2, value: 'c' }),
      onNext(230, { key: 4, value: 'a' }),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.maxBy(function () { throw error; }, reverseComparer);
    });

    results.messages.assertEqual(
      onError(210, error));
  });

  test('maxBy comparer throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, { key: 1, value: 'z' }),
      onNext(210, { key: 3, value: 'b' }),
      onNext(220, { key: 2, value: 'c' }),
      onNext(230, { key: 4, value: 'a' }),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.maxBy(function (x) { return x.key; }, function () { throw error; });
    });

    results.messages.assertEqual(
      onError(220, error));
  });

}());
