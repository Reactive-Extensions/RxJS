(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal */

  QUnit.module('first');

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

  // First Async
  test('first empty', function () {

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var res = scheduler.startScheduler(function () {
      return xs.first();
    });

    res.messages.assertEqual(
      onError(250, function (n) { return n.error instanceof Rx.EmptyError; }));

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );
  });

  test('first default', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var res = scheduler.startScheduler(
      function () {
        return xs.first({defaultValue: 42});
      });

    res.messages.assertEqual(
      onNext(250, 42),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );
  });

  test('first one', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var res = scheduler.startScheduler(function () {
      return xs.first();
    });

    res.messages.assertEqual(
      onNext(210, 2),
      onCompleted(210));

    xs.subscriptions.assertEqual(
      subscribe(200, 210));
  });

  test('first many', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onCompleted(250)
    );

    var res = scheduler.startScheduler(function () {
      return xs.first();
    });

    res.messages.assertEqual(onNext(210, 2), onCompleted(210));
    xs.subscriptions.assertEqual(subscribe(200, 210));
  });

  test('first Error', function () {
    var ex = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, ex)
    );

    var res = scheduler.startScheduler(function () {
      return xs.first();
    });

    res.messages.assertEqual(onError(210, ex));

    xs.subscriptions.assertEqual(subscribe(200, 210));
  });

  test('first predicate', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var res = scheduler.startScheduler(function () {
      return xs.first(function (x) {
        return x % 2 === 1;
      });
    });

    res.messages.assertEqual(onNext(220, 3), onCompleted(220));

    xs.subscriptions.assertEqual(subscribe(200, 220));
  });

  test('first Predicate Obj', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var res = scheduler.startScheduler(function () {
      return xs.first({
        predicate: function (x) {
          return x % 2 === 1;
        }
      });
    });

    res.messages.assertEqual(onNext(220, 3), onCompleted(220));

    xs.subscriptions.assertEqual(subscribe(200, 220));
  });

  test('first Predicate thisArg', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var res = scheduler.startScheduler(function () {
      return xs.first(function (x) {
        equal(this, 42);
        return x % 2 === 1;
      }, 42);
    });

    res.messages.assertEqual(onNext(220, 3), onCompleted(220));

    xs.subscriptions.assertEqual(subscribe(200, 220));
  });

  test('first Predicate Obj thisArg', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var res = scheduler.startScheduler(function () {
      return xs.first({
        predicate: function (x) {
          equal(this, 42);
          return x % 2 === 1;
        },
        thisArg: 42
      });
    });

    res.messages.assertEqual(onNext(220, 3), onCompleted(220));

    xs.subscriptions.assertEqual(subscribe(200, 220));
  });

  test('first Predicate None', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var res = scheduler.startScheduler(function () {
      return xs.first(function (x) {
        return x > 10;
      });
    });

    res.messages.assertEqual(
      onError(250, function (n) { return n.error instanceof Rx.EmptyError; }));

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('first Predicate Obj None', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var res = scheduler.startScheduler(function () {
      return xs.first({
        predicate: function (x) {
          return x > 10;
        }
      });
    });

    res.messages.assertEqual(
      onError(250, function (n) { return n.error instanceof Rx.EmptyError; }));

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('first Predicate Obj None Default', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var res = scheduler.startScheduler(function () {
      return xs.first({
        predicate: function (x) {
          return x > 10;
        },
        defaultValue: 42
      });
    });

    res.messages.assertEqual(onNext(250, 42), onCompleted(250));

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('first Predicate Error', function () {
    var ex = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(220, ex)
    );

    var res = scheduler.startScheduler(function () {
      return xs.first(function (x) {
        return x % 2 === 1;
      });
    });

    res.messages.assertEqual(onError(220, ex));

    xs.subscriptions.assertEqual(subscribe(200, 220));
  });

  test('first PredicateThrows', function () {
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

    var res = scheduler.startScheduler(function () {
      return xs.first(function (x) {
        if (x < 4) {
          return false;
        } else {
          throw ex;
        }
      });
    });

    res.messages.assertEqual(onError(230, ex));

    xs.subscriptions.assertEqual(subscribe(200, 230));
  });

}());
