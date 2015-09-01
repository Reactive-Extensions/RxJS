(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, raises */

  QUnit.module('interval');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext;

  test('interval relative time basic', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.interval(100, scheduler);
    });

    results.messages.assertEqual(
      onNext(300, 0),
      onNext(400, 1),
      onNext(500, 2),
      onNext(600, 3),
      onNext(700, 4),
      onNext(800, 5),
      onNext(900, 6));
  });

  test('interval relative time zero', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.interval(0, scheduler);
    }, { disposed: 210 });

    results.messages.assertEqual(
      onNext(201, 0),
      onNext(202, 1),
      onNext(203, 2),
      onNext(204, 3),
      onNext(205, 4),
      onNext(206, 5),
      onNext(207, 6),
      onNext(208, 7),
      onNext(209, 8));
  });

  test('interval relative time Negative', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.interval(-1, scheduler);
    }, {disposed: 210 });

    results.messages.assertEqual(
      onNext(201, 0),
      onNext(202, 1),
      onNext(203, 2),
      onNext(204, 3),
      onNext(205, 4),
      onNext(206, 5),
      onNext(207, 6),
      onNext(208, 7),
      onNext(209, 8));
  });

  test('interval relative time disposed', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.interval(1000, scheduler);
    });

    results.messages.assertEqual();
  });

  test('interval relative time observer throws', function () {
    var scheduler = new TestScheduler();

    var xs = Observable.interval(1, scheduler);

    xs.subscribe(function () { throw new Error(); });

    raises(function () { return scheduler.start(); });
  });

}());
