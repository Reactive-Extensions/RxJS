(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, raises */
  QUnit.module('just');

  var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    SerialDisposable = Rx.SerialDisposable,
    onNext = Rx.ReactiveTest.onNext,
    onCompleted = Rx.ReactiveTest.onCompleted;

  test('just basic', function () {
    var scheduler = new TestScheduler();

    var res = scheduler.startScheduler(function () {
      return Observable.just(42, scheduler);
    });

    res.messages.assertEqual(
      onNext(201, 42),
      onCompleted(201)
    );
  });

  test('just disposed', function () {
    var scheduler = new TestScheduler();

    var res = scheduler.startScheduler(function () {
      return Observable.just(42, scheduler);
    }, { disposed: 200 });

    res.messages.assertEqual();
  });

  test('just disposed after next', function () {
    var scheduler = new TestScheduler();

    var d = new SerialDisposable();

    var xs = Observable.just(42, scheduler);

    var res = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () {
      d.setDisposable(xs.subscribe(
        function (x) {
          d.dispose();
          res.onNext(x);
        },
        function (e) { res.onError(e); },
        function () { res.onCompleted(); }
      ));
    });

    scheduler.start();

    res.messages.assertEqual(
      onNext(101, 42)
    );
  });

  function noop () { }

  test('just Observer throws', function () {
    var scheduler1 = new TestScheduler();

    var xs = Observable.just(1, scheduler1);

    xs.subscribe(function () { throw new Error(); });

    raises(function () { scheduler1.start(); });

    var scheduler2 = new TestScheduler();

    var ys = Observable.just(1, scheduler2);

    ys.subscribe(noop, noop, function () { throw new Error(); });

    raises(function () { scheduler2.start(); });
  });

}());
