(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('If');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('If True', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(250, 2),
      onCompleted(300));

    var ys = scheduler.createHotObservable(
      onNext(310, 3),
      onNext(350, 4),
      onCompleted(400));

    var results = scheduler.startScheduler(function () {
      return Observable['if'](function () { return true; }, xs, ys);
    });

    results.messages.assertEqual(
      onNext(210, 1),
      onNext(250, 2),
      onCompleted(300));

    xs.subscriptions.assertEqual(
      subscribe(200, 300));

    ys.subscriptions.assertEqual();
  });

  test('If False', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(250, 2),
      onCompleted(300));

    var ys = scheduler.createHotObservable(
      onNext(310, 3),
      onNext(350, 4),
      onCompleted(400));

    var results = scheduler.startScheduler(function () {
      return Observable['if'](function () { return false; }, xs, ys);
    });

    results.messages.assertEqual(
      onNext(310, 3),
      onNext(350, 4),
      onCompleted(400));

    xs.subscriptions.assertEqual();

    ys.subscriptions.assertEqual(
      subscribe(200, 400));
  });

  test('If Throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(250, 2),
      onCompleted(300));

    var ys = scheduler.createHotObservable(
      onNext(310, 3),
      onNext(350, 4),
      onCompleted(400));

    var results = scheduler.startScheduler(function () {
      return Observable['if'](function () { throw error; }, xs, ys);
    });

    results.messages.assertEqual(
      onError(200, error));

    xs.subscriptions.assertEqual();

    ys.subscriptions.assertEqual();
  });

  test('If Dispose', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(250, 2));

    var ys = scheduler.createHotObservable(
      onNext(310, 3),
      onNext(350, 4),
      onCompleted(400));

    var results = scheduler.startScheduler(function () {
      return Observable['if'](function () { return true; }, xs, ys);
    });

    results.messages.assertEqual(
      onNext(210, 1),
      onNext(250, 2));

    xs.subscriptions.assertEqual(
      subscribe(200, 1000));

    ys.subscriptions.assertEqual();
  });

  test('If Default Completed', function () {
    var b = false;

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(220, 2),
      onNext(330, 3),
      onCompleted(440));

    scheduler.scheduleAbsolute(null, 150, function () {
      b = true;
    });

    var results = scheduler.startScheduler(function () {
      return Observable['if'](function () { return b; }, xs);
    });

    results.messages.assertEqual(
      onNext(220, 2),
      onNext(330, 3),
      onCompleted(440));

    xs.subscriptions.assertEqual(
      subscribe(200, 440));
  });

  test('If Default Error', function () {
    var error = new Error();

    var b = false;

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(220, 2),
      onNext(330, 3),
      onError(440, error));

    scheduler.scheduleAbsolute(null, 150, function () {
      b = true;
    });

    var results = scheduler.startScheduler(function () {
      return Observable['if'](function () { return b; }, xs);
    });

    results.messages.assertEqual(
      onNext(220, 2),
      onNext(330, 3),
      onError(440, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 440));
  });

  test('If Default Never', function () {
    var b = false;

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(220, 2),
      onNext(330, 3));

    scheduler.scheduleAbsolute(null, 150, function () {
      b = true;
    });

    var results = scheduler.startScheduler(function () {
      return Observable['if'](function () { return b; }, xs);
    });

    results.messages.assertEqual(
      onNext(220, 2),
      onNext(330, 3));

    xs.subscriptions.assertEqual(
      subscribe(200, 1000));
  });

  test('If Default Other', function () {
    var b = true;

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(220, 2),
      onNext(330, 3),
      onError(440, new Error()));

    scheduler.scheduleAbsolute(null, 150, function () {
      b = false;
    });

    var results = scheduler.startScheduler(function () {
      return Observable['if'](function () { return b; }, xs);
    });

    results.messages.assertEqual(
      onCompleted(200));

    xs.subscriptions.assertEqual();
  });

}());
