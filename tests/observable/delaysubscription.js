(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('delaySubsription');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('delay subscription relative', function() {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(50, 42),
      onNext(60, 43),
      onCompleted(70)
    );

    var results = scheduler.startScheduler(function() {
      return xs.delaySubscription(30, scheduler);
    });

    results.messages.assertEqual(
      onNext(280, 42),
      onNext(290, 43),
      onCompleted(300)
    );

    xs.subscriptions.assertEqual(
      subscribe(230, 300)
    );
  });

  test('delaySubscription relative hot', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function() {
      return xs.delaySubscription(20, scheduler);
    });

    results.messages.assertEqual(
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(220, 250)
    );
  });

  test('delaySubscription relative hot misses all', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function() {
      return xs.delaySubscription(200, scheduler);
    });

    results.messages.assertEqual(
    );

    xs.subscriptions.assertEqual(
      subscribe(400, 1000)
    );
  });

  test('delaySubscription relative hot cancel', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function() {
      return xs.delaySubscription(20, scheduler);
    }, { disposed: 210 });

    results.messages.assertEqual(
    );

    xs.subscriptions.assertEqual(
    );
  });

  test('delaySubscription relative error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(50, 42),
      onNext(60, 43),
      onError(70, error)
    );

    var results = scheduler.startScheduler(function() {
      return xs.delaySubscription(30, scheduler);
    });

    results.messages.assertEqual(
      onNext(280, 42),
      onNext(290, 43),
      onError(300, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(230, 300)
    );
  });

  test('delay subscription absolute', function() {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(50, 42),
      onNext(60, 43),
      onCompleted(70)
    );

    var results = scheduler.startScheduler(function() {
      return xs.delaySubscription(new Date(230), scheduler);
    });

    results.messages.assertEqual(
      onNext(280, 42),
      onNext(290, 43),
      onCompleted(300)
    );

    xs.subscriptions.assertEqual(
      subscribe(230, 300)
    );
  });

  test('delaySubscription absolute hot', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function() {
      return xs.delaySubscription(new Date(220), scheduler);
    });

    results.messages.assertEqual(
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(220, 250)
    );
  });

  test('delaySubscription relative hot misses all', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function() {
      return xs.delaySubscription(new Date(400), scheduler);
    });

    results.messages.assertEqual(
    );

    xs.subscriptions.assertEqual(
      subscribe(400, 1000)
    );
  });

  test('delaySubscription relative hot cancel', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function() {
      return xs.delaySubscription(new Date(220), scheduler);
    }, { disposed: 210 });

    results.messages.assertEqual(
    );

    xs.subscriptions.assertEqual(
    );
  });

  test('delaySubscription absolute error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(50, 42),
      onNext(60, 43),
      onError(70, error)
    );

    var results = scheduler.startScheduler(function() {
      return xs.delaySubscription(new Date(230), scheduler);
    });

    results.messages.assertEqual(
      onNext(280, 42),
      onNext(290, 43),
      onError(300, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(230, 300)
    );
  });
}());
