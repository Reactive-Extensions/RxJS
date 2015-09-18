(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal */
  QUnit.module('last');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('last Empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.last();
    });

    results.messages.assertEqual(
      onError(250, function (n) { return n.error instanceof Rx.EmptyError; })
    );

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('last default value', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.last({defaultValue: 42});
    });

    results.messages.assertEqual(
      onNext(250, 42),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('last One', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.last();
    });

    results.messages.assertEqual(
      onNext(250, 2),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('last Many', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.last();
    });

    results.messages.assertEqual(
      onNext(250, 3),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('last Error', function () {
    var ex = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, ex)
    );

    var results = scheduler.startScheduler(function () {
      return xs.last();
    });

    results.messages.assertEqual(onError(210, ex));

    xs.subscriptions.assertEqual(subscribe(200, 210));
  });

  test('last predicate', function () {
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
      return xs.last(function (x) {
        return x % 2 === 1;
      });
    });

    results.messages.assertEqual(
      onNext(250, 5),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('last Obj predicate', function () {
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
      return xs.last({
        predicate: function (x) {
          return x % 2 === 1;
        }
      });
    });

    results.messages.assertEqual(
      onNext(250, 5),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('last predicate thisArg', function () {
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
      return xs.last(function (x) {
        equal(this, 42);
        return x % 2 === 1;
      }, 42);
    });

    results.messages.assertEqual(
      onNext(250, 5),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('last Obj predicate', function () {
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
      return xs.last({
        predicate: function (x) {
          equal(this, 42);
          return x % 2 === 1;
        },
        thisArg: 42
      });
    });

    results.messages.assertEqual(
      onNext(250, 5),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('last predicate None', function () {
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
      return xs.last(function (x) {
        return x > 10;
      });
    });

    results.messages.assertEqual(
      onError(250, function (n) { return n.error instanceof Rx.EmptyError; })
    );

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('last Obj predicate none default', function () {
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
      return xs.last({
        predicate: function (x) {
          return x > 10;
        },
        defaultValue: 42
      });
    });

    results.messages.assertEqual(
      onNext(250, 42),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('last predicate Throw', function () {
    var ex = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, ex)
    );

    var results = scheduler.startScheduler(function () {
      return xs.last(function (x) {
        return x % 2 === 1;
      });
    });

    results.messages.assertEqual(onError(210, ex));

    xs.subscriptions.assertEqual(subscribe(200, 210));
  });

  test('last predicate throws', function () {
    var ex = new Error();

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
      return xs.last(function (x) {
        if (x < 4) {
          return x % 2 === 1;
        }
        throw ex;
      });
    });

    results.messages.assertEqual(onError(230, ex));

    xs.subscriptions.assertEqual(subscribe(200, 230));
  });
}());
