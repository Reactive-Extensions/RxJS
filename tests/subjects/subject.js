(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal, ok */

  QUnit.module('Subject');

  var Subject = Rx.Subject,
      Observable = Rx.Observable,
      Observer = Rx.Observer,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('Infinite', function () {
    var s, subscription, subscription1, subscription2, subscription3;

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(70, 1),
      onNext(110, 2),
      onNext(220, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(410, 6),
      onNext(520, 7),
      onNext(630, 8),
      onNext(710, 9),
      onNext(870, 10),
      onNext(940, 11),
      onNext(1020, 12)
    );

    var results1 = scheduler.createObserver();
    var results2 = scheduler.createObserver();
    var results3 = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () {
      s = new Subject();
    });

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = xs.subscribe(s);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      subscription1 = s.subscribe(results1);
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      subscription2 = s.subscribe(results2);
    });

    scheduler.scheduleAbsolute(null, 900, function () {
      subscription3 = s.subscribe(results3);
    });

    scheduler.scheduleAbsolute(null, 600, function () {
      subscription1.dispose();
    });

    scheduler.scheduleAbsolute(null, 700, function () {
      subscription2.dispose();
    });

    scheduler.scheduleAbsolute(null, 800, function () {
      subscription1.dispose();
    });

    scheduler.scheduleAbsolute(null, 950, function () {
      subscription3.dispose();
    });

    scheduler.start();

    results1.messages.assertEqual(
      onNext(340, 5),
      onNext(410, 6),
      onNext(520, 7)
    );
    
    results2.messages.assertEqual(
      onNext(410, 6),
      onNext(520, 7),
      onNext(630, 8)
    );

    results3.messages.assertEqual(
      onNext(940, 11)
    );
  });

  test('Finite', function () {
    var s, subscription, subscription1, subscription2, subscription3;

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(70, 1),
      onNext(110, 2),
      onNext(220, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(410, 6),
      onNext(520, 7),
      onCompleted(630),
      onNext(640, 9),
      onCompleted(650),
      onError(660, new Error())
    );

    var results1 = scheduler.createObserver();
    var results2 = scheduler.createObserver();
    var results3 = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () {
      s = new Subject();
    });

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = xs.subscribe(s);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      subscription1 = s.subscribe(results1);
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      subscription2 = s.subscribe(results2);
    });

    scheduler.scheduleAbsolute(null, 900, function () {
      subscription3 = s.subscribe(results3);
    });

    scheduler.scheduleAbsolute(null, 600, function () {
      subscription1.dispose();
    });

    scheduler.scheduleAbsolute(null, 700, function () {
      subscription2.dispose();
    });

    scheduler.scheduleAbsolute(null, 800, function () {
      subscription1.dispose();
    });

    scheduler.scheduleAbsolute(null, 950, function () {
      subscription3.dispose();
    });

    scheduler.start();

    results1.messages.assertEqual(
        onNext(340, 5),
        onNext(410, 6),
        onNext(520, 7)
    );

    results2.messages.assertEqual(
        onNext(410, 6),
        onNext(520, 7),
        onCompleted(630)
    );

    results3.messages.assertEqual(
        onCompleted(900)
    );
  });

  test(new Error(), function () {
    var s, subscription, subscription1, subscription2, subscription3;

    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(70, 1),
      onNext(110, 2),
      onNext(220, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(410, 6),
      onNext(520, 7),
      onError(630, error),
      onNext(640, 9),
      onCompleted(650),
      onError(660, 'foo')
    );

    var results1 = scheduler.createObserver();
    var results2 = scheduler.createObserver();
    var results3 = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () {
      s = new Subject();
    });

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = xs.subscribe(s);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      subscription1 = s.subscribe(results1);
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      subscription2 = s.subscribe(results2);
    });

    scheduler.scheduleAbsolute(null, 900, function () {
      subscription3 = s.subscribe(results3);
    });

    scheduler.scheduleAbsolute(null, 600, function () {
      subscription1.dispose();
    });

    scheduler.scheduleAbsolute(null, 700, function () {
      subscription2.dispose();
    });

    scheduler.scheduleAbsolute(null, 800, function () {
      subscription1.dispose();
    });

    scheduler.scheduleAbsolute(null, 950, function () {
      subscription3.dispose();
    });

    scheduler.start();

    results1.messages.assertEqual(
      onNext(340, 5),
      onNext(410, 6),
      onNext(520, 7));

    results2.messages.assertEqual(
      onNext(410, 6),
      onNext(520, 7),
      onError(630, error));

    results3.messages.assertEqual(
      onError(900, error));
  });

  test('Canceled', function () {
    var s, subscription, subscription1, subscription2, subscription3;

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onCompleted(630),
      onNext(640, 9),
      onCompleted(650),
      onError(660, new Error())
    );

    var results1 = scheduler.createObserver();
    var results2 = scheduler.createObserver();
    var results3 = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 100, function () {
      s = new Subject();
    });

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = xs.subscribe(s);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      subscription1 = s.subscribe(results1);
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      subscription2 = s.subscribe(results2);
    });

    scheduler.scheduleAbsolute(null, 900, function () {
      subscription3 = s.subscribe(results3);
    });

    scheduler.scheduleAbsolute(null, 600, function () {
      subscription1.dispose();
    });

    scheduler.scheduleAbsolute(null, 700, function () {
      subscription2.dispose();
    });

    scheduler.scheduleAbsolute(null, 800, function () {
      subscription1.dispose();
    });

    scheduler.scheduleAbsolute(null, 950, function () {
      subscription3.dispose();
    });

    scheduler.start();

    results1.messages.assertEqual();
    results2.messages.assertEqual(onCompleted(630));
    results3.messages.assertEqual(onCompleted(900));
  });

  test('Subject_Create', function () {
    var _x, _ex, done = false;

    var v = Observer.create(
      function (x) { _x = x; },
      function (ex) { _ex = ex; },
      function () { done = true; });

    var o = Observable.just(42);

    var s = Subject.create(v, o);
    s.subscribe(function (x) { _x = x; });

    equal(42, _x);
    s.onNext(21);

    var e = new Error();
    s.onError(e);

    equal(e, _ex);

    s.onCompleted();
    ok(!done);
  });

}());
