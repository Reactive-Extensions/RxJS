(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('sample');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('sample regular', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(260, 4),
      onNext(300, 5),
      onNext(350, 6),
      onNext(380, 7),
      onCompleted(390)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sample(50, scheduler);
    });

    results.messages.assertEqual(
      onNext(250, 3),
      onNext(300, 5),
      onNext(350, 6),
      onNext(400, 7),
      onCompleted(400)
    );
  });

  test('sample error in flight', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(260, 4),
      onNext(300, 5),
      onNext(310, 6),
      onError(330, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sample(50, scheduler);
    });

    results.messages.assertEqual(
      onNext(250, 3),
      onNext(300, 5),
      onError(330, error)
    );
  });

  test('sample Empty', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Rx.Observable.empty(scheduler).sample(0, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(201)
    );
  });

  test('sample Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Rx.Observable['throw'](error, scheduler).sample(0, scheduler);
    });

    results.messages.assertEqual(
      onError(201, error)
    );
  });

  test('sample never', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Rx.Observable.never().sample(0, scheduler);
    });

    results.messages.assertEqual();
  });

  test('sample sampler simple 1', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(300, 5),
      onNext(310, 6),
      onCompleted(400)
    );

    var ys = scheduler.createHotObservable(
      onNext(150, ''),
      onNext(210, 'bar'),
      onNext(250, 'foo'),
      onNext(260, 'qux'),
      onNext(320, 'baz'),
      onCompleted(500)
    );

    var res = scheduler.startScheduler(function () {
      return xs.sample(ys);
    });

    res.messages.assertEqual(
      onNext(250, 3),
      onNext(320, 6),
      onCompleted(500 /* on sampling boundaries only */)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 500)
    );
  });

  test('sample sampler simple 2', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(300, 5),
      onNext(310, 6),
      onNext(360, 7),
      onCompleted(400)
    );

    var ys = scheduler.createHotObservable(
      onNext(150, ''),
      onNext(210, 'bar'),
      onNext(250, 'foo'),
      onNext(260, 'qux'),
      onNext(320, 'baz'),
      onCompleted(500)
    );

    var res = scheduler.startScheduler(function () {
      return xs.sample(ys);
    });

    res.messages.assertEqual(
      onNext(250, 3),
      onNext(320, 6),
      onNext(500, 7),
      onCompleted(500 /* on sampling boundaries only */)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 500)
    );
  });

  test('sample sampler simple 3', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 2),
      onNext(240, 3),
      onNext(290, 4),
      onCompleted(300)
     );

    var ys = scheduler.createHotObservable(
      onNext(150, ''),
      onNext(210, 'bar'),
      onNext(250, 'foo'),
      onNext(260, 'qux'),
      onNext(320, 'baz'),
      onCompleted(500)
    );

    var res = scheduler.startScheduler(function () {
      return xs.sample(ys);
    });

    res.messages.assertEqual(
      onNext(250, 3),
      onNext(320, 4),
      onCompleted(320 /* on sampling boundaries only */)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 300)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 320)
    );
  });

  test('sample completes if earlier completes', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 2),
      onNext(240, 3),
      onNext(290, 4),
      onCompleted(300)
     );

    var ys = scheduler.createHotObservable(
      onNext(150, ''),
      onCompleted(210)
    );

    var res = scheduler.startScheduler(function () {
      return xs.sample(ys);
    });

    res.messages.assertEqual(
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 300)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('sample sampler source throws', function() {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(300, 5),
      onNext(310, 6),
      onError(320, error)
    );

    var ys = scheduler.createHotObservable(
      onNext(150, ''),
      onNext(210, 'bar'),
      onNext(250, 'foo'),
      onNext(260, 'qux'),
      onNext(330, 'baz'),
      onCompleted(400)
    );

    var res = scheduler.startScheduler(function () {
      return xs.sample(ys);
    });

    res.messages.assertEqual(
      onNext(250, 3),
      onError(320, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 320)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 320)
    );
  });

}());
