(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('single');

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

  // Single Or Default
  test('single empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.single();
    });

    results.messages.assertEqual(
      onError(250, function (n) { return n.exception instanceof Rx.EmptyError; })
    );

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('single empty default value', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.single({defaultValue: 42});
    });

    results.messages.assertEqual(
      onNext(250, 42),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('single one', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.single();
    });

    results.messages.assertEqual(
      onNext(250, 2),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );
  });

  test('single many', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.single();
    });

    results.messages.assertEqual(
      onError(220, function (n) { return n.exception instanceof Error; })
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 220)
    );
  });

  test('single Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.single();
    });

    results.messages.assertEqual(
      onError(210, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 210)
    );
  });

  test('single predicate', function () {
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
      return xs.single(function (x) {
        return x % 2 === 1;
      });
    });

    results.messages.assertEqual(
      onError(240, function (n) { return n.exception instanceof Error; })
    );

    xs.subscriptions.assertEqual(subscribe(200, 240));
  });

  test('single predicate empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.single(function (x) { return x % 2 === 1; });
    });

    results.messages.assertEqual(
      onError(250, function (n) { return n.exception instanceof Rx.EmptyError; })
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );
  });

  test('single predicate empty default value', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.single({
        predicate: function (x) { return x % 2 === 1; },
        defaultValue: 42
      });
    });

    results.messages.assertEqual(
      onNext(250, 42),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );
  });

  test('single predicate one', function () {
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
      return xs.single(function (x) { return x === 4; });
    });

    results.messages.assertEqual(
      onNext(250, 4),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );
  });

  test('single predicate none', function () {
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
      return xs.single(function (x) { return x > 10; });
    });

    results.messages.assertEqual(
      onError(250, function (n) { return n.exception instanceof Rx.EmptyError; })
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );
  });

  test('single predicate none default value', function () {
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
      return xs.single({
        predicate: function (x) { return x > 10; },
        defaultValue: 42
      });
    });

    results.messages.assertEqual(
      onNext(250, 42),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );
  });

  test('single predicate throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.single(function (x) { return x > 10; });
    });

    results.messages.assertEqual(
      onError(210, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 210)
    );
  });

  test('single predicate throws', function () {
    var error = new Error();

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
      return xs.single(function (x) {
        if (x < 4) { return false; }
        throw error;
      });
    });

    results.messages.assertEqual(
      onError(230, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 230)
    );
  });

}());
