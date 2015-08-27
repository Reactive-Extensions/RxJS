(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('case');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('case One', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(240, 2),
      onNext(270, 3),
      onCompleted(300));

    var ys = scheduler.createHotObservable(
      onNext(220, 11),
      onNext(250, 12),
      onNext(280, 13),
      onCompleted(310));

    var zs = scheduler.createHotObservable(
      onNext(230, 21),
      onNext(240, 22),
      onNext(290, 23),
      onCompleted(320));

    var map = {
      1: xs,
      2: ys
    };

    var results = scheduler.startScheduler(function () {
      return Observable['case'](function () { return 1; }, map, zs);
    });

    results.messages.assertEqual(
      onNext(210, 1),
      onNext(240, 2),
      onNext(270, 3),
      onCompleted(300));

    xs.subscriptions.assertEqual(
      subscribe(200, 300));

    ys.subscriptions.assertEqual();

    zs.subscriptions.assertEqual();
  });

  test('case Two', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(240, 2),
      onNext(270, 3),
      onCompleted(300));

    var ys = scheduler.createHotObservable(
      onNext(220, 11),
      onNext(250, 12),
      onNext(280, 13),
      onCompleted(310));

    var zs = scheduler.createHotObservable(
      onNext(230, 21),
      onNext(240, 22),
      onNext(290, 23),
      onCompleted(320));

    var map = {
      1: xs,
      2: ys
    };

    var results = scheduler.startScheduler(function () {
      return Observable['case'](function () { return 2; }, map, zs);
    });

    results.messages.assertEqual(
      onNext(220, 11),
      onNext(250, 12),
      onNext(280, 13),
      onCompleted(310));

    xs.subscriptions.assertEqual();

    ys.subscriptions.assertEqual(
      subscribe(200, 310));

    zs.subscriptions.assertEqual();
  });

  test('case Three', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(240, 2),
      onNext(270, 3),
      onCompleted(300));

    var ys = scheduler.createHotObservable(
      onNext(220, 11),
      onNext(250, 12),
      onNext(280, 13),
      onCompleted(310));

    var zs = scheduler.createHotObservable(
      onNext(230, 21),
      onNext(240, 22),
      onNext(290, 23),
      onCompleted(320));

    var map = {
      1: xs,
      2: ys
    };

    var results = scheduler.startScheduler(function () {
      return Observable['case'](function () { return 3; }, map, zs);
    });

    results.messages.assertEqual(
      onNext(230, 21),
      onNext(240, 22),
      onNext(290, 23),
      onCompleted(320));

    xs.subscriptions.assertEqual();

    ys.subscriptions.assertEqual();

    zs.subscriptions.assertEqual(
      subscribe(200, 320));
  });

  test('case Throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(240, 2),
      onNext(270, 3),
      onCompleted(300));

    var ys = scheduler.createHotObservable(
      onNext(220, 11),
      onNext(250, 12),
      onNext(280, 13),
      onCompleted(310));

    var zs = scheduler.createHotObservable(
      onNext(230, 21),
      onNext(240, 22),
      onNext(290, 23),
      onCompleted(320));

    var map = {
      1: xs,
      2: ys
    };

    var results = scheduler.startScheduler(function () {
      return Observable['case'](function () { throw error; }, map, zs);
    });

    results.messages.assertEqual(
      onError(200, error));

    xs.subscriptions.assertEqual();

    ys.subscriptions.assertEqual();

    zs.subscriptions.assertEqual();
  });

  test('caseWithDefault One', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(240, 2),
      onNext(270, 3),
      onCompleted(300));

    var ys = scheduler.createHotObservable(
      onNext(220, 11),
      onNext(250, 12),
      onNext(280, 13),
      onCompleted(310));

    var map = {
      1: xs,
      2: ys
    };

    var results = scheduler.startScheduler(function () {
      return Observable['case'](function () { return 1; }, map, scheduler);
    });

    results.messages.assertEqual(
      onNext(210, 1),
      onNext(240, 2),
      onNext(270, 3),
      onCompleted(300));

    xs.subscriptions.assertEqual(
      subscribe(200, 300));

    ys.subscriptions.assertEqual();
  });

  test('caseWithDefault Two', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(240, 2),
      onNext(270, 3),
      onCompleted(300));

    var ys = scheduler.createHotObservable(
      onNext(220, 11),
      onNext(250, 12),
      onNext(280, 13),
      onCompleted(310));

    var map = {
      1: xs,
      2: ys
    };

    var results = scheduler.startScheduler(function () {
      return Observable['case'](function () { return 2; }, map, scheduler);
    });

    results.messages.assertEqual(
      onNext(220, 11),
      onNext(250, 12),
      onNext(280, 13),
      onCompleted(310));

    xs.subscriptions.assertEqual();

    ys.subscriptions.assertEqual(
      subscribe(200, 310));
  });

  test('caseWithDefault Three', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(240, 2),
      onNext(270, 3),
      onCompleted(300));

    var ys = scheduler.createHotObservable(
      onNext(220, 11),
      onNext(250, 12),
      onNext(280, 13),
      onCompleted(310));

    var map = {
      1: xs,
      2: ys
    };

    var results = scheduler.startScheduler(function () {
      return Observable['case'](function () { return 3; }, map, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(201));

    xs.subscriptions.assertEqual();

    ys.subscriptions.assertEqual();
  });

  test('caseWithDefault Throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(240, 2),
      onNext(270, 3),
      onCompleted(300));

    var ys = scheduler.createHotObservable(
      onNext(220, 11),
      onNext(250, 12),
      onNext(280, 13),
      onCompleted(310));

    var map = {
      1: xs,
      2: ys
    };
    var results = scheduler.startScheduler(function () {
      return Observable['case'](function () { throw error; }, map, scheduler);
    });

    results.messages.assertEqual(
      onError(200, error));

    xs.subscriptions.assertEqual();

    ys.subscriptions.assertEqual();
  });

}());
