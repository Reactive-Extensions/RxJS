(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('mergeConcat');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('merge basic', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))),
      onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(200))),
      onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))),
      onNext(320, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))),
      onCompleted(400));

    var results = scheduler.startScheduler(function () {
      return xs.merge(2);
    });

    results.messages.assertEqual(
      onNext(260, 1),
      onNext(280, 4),
      onNext(310, 2),
      onNext(330, 3),
      onNext(330, 5),
      onNext(360, 6),
      onNext(440, 7),
      onNext(460, 8),
      onNext(670, 9),
      onNext(700, 10),
      onCompleted(760));

    xs.subscriptions.assertEqual(subscribe(200, 760));
  });

  test('merge basic Long', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))),
      onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(300))),
      onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))),
      onNext(320, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))),
      onCompleted(400));

    var results = scheduler.startScheduler(function () {
      return xs.merge(2);
    });

    results.messages.assertEqual(
      onNext(260, 1),
      onNext(280, 4),
      onNext(310, 2),
      onNext(330, 3),
      onNext(330, 5),
      onNext(360, 6),
      onNext(440, 7),
      onNext(460, 8),
      onNext(690, 9),
      onNext(720, 10),
      onCompleted(780));

    xs.subscriptions.assertEqual(subscribe(200, 780));
  });

  test('merge basic Wide', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))),
      onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(300))),
      onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))),
      onNext(420, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))),
      onCompleted(450));

    var results = scheduler.startScheduler(function () {
      return xs.merge(3);
    });

    results.messages.assertEqual(
      onNext(260, 1),
      onNext(280, 4),
      onNext(280, 6),
      onNext(310, 2),
      onNext(330, 3),
      onNext(330, 5),
      onNext(360, 7),
      onNext(380, 8),
      onNext(630, 9),
      onNext(660, 10),
      onCompleted(720));

    xs.subscriptions.assertEqual(subscribe(200, 720));
  });

  test('merge basic late', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))),
      onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(300))),
      onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))),
      onNext(420, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))),
      onCompleted(750));

    var results = scheduler.startScheduler(function () {
        return xs.merge(3);
    });

    results.messages.assertEqual(
      onNext(260, 1),
      onNext(280, 4),
      onNext(280, 6),
      onNext(310, 2),
      onNext(330, 3),
      onNext(330, 5),
      onNext(360, 7),
      onNext(380, 8),
      onNext(630, 9),
      onNext(660, 10),
      onCompleted(750));

    xs.subscriptions.assertEqual(
      subscribe(200, 750));
  });

  test('merge disposed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))),
      onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(200))),
      onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))),
      onNext(320, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))),
      onCompleted(400));

    var results = scheduler.startScheduler(function () {
        return xs.merge(2);
    }, { disposed: 450 });

    results.messages.assertEqual(
      onNext(260, 1),
      onNext(280, 4),
      onNext(310, 2),
      onNext(330, 3),
      onNext(330, 5),
      onNext(360, 6),
      onNext(440, 7));

    xs.subscriptions.assertEqual(
      subscribe(200, 450));
  });

  test('merge inner error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))),
      onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(200))),
      onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))),
      onNext(320, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))),
      onError(400, error));

    var results = scheduler.startScheduler(function () {
      return xs.merge(2);
    });

    results.messages.assertEqual(
      onNext(260, 1),
      onNext(280, 4),
      onNext(310, 2),
      onNext(330, 3),
      onNext(330, 5),
      onNext(360, 6),
      onError(400, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 400));
  });

  test('merge outer error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))),
      onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(200))),
      onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onError(140, error))),
      onNext(320, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))),
      onCompleted(400));

    var results = scheduler.startScheduler(function () {
      return xs.merge(2);
    });

    results.messages.assertEqual(
      onNext(260, 1),
      onNext(280, 4),
      onNext(310, 2),
      onNext(330, 3),
      onNext(330, 5),
      onNext(360, 6),
      onNext(440, 7),
      onNext(460, 8),
      onError(490, error));

    xs.subscriptions.assertEqual(subscribe(200, 490));
  });

}());
