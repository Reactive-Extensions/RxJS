(function () {
  QUnit.module('Retry');

  function noop() { }

  var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

  test('Retry Observable Basic', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(100, 1),
      onNext(150, 2),
      onNext(200, 3),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.retry();
    });

    results.messages.assertEqual(
      onNext(300, 1),
      onNext(350, 2),
      onNext(400, 3),
      onCompleted(450)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 450)
    );
  });

  test('Retry Observable Infinite', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(100, 1),
      onNext(150, 2),
      onNext(200, 3)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.retry();
    });

    results.messages.assertEqual(
      onNext(300, 1),
      onNext(350, 2),
      onNext(400, 3)
    );

    return xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('Retry Observable Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(100, 1),
      onNext(150, 2),
      onNext(200, 3),
      onError(250, error)
    );

    var results = scheduler.startWithDispose(function () {
      return xs.retry();
    }, 1100);

    results.messages.assertEqual(
      onNext(300, 1),
      onNext(350, 2),
      onNext(400, 3),
      onNext(550, 1),
      onNext(600, 2),
      onNext(650, 3),
      onNext(800, 1),
      onNext(850, 2),
      onNext(900, 3),
      onNext(1050, 1)
    );

    return xs.subscriptions.assertEqual(
      subscribe(200, 450),
      subscribe(450, 700),
      subscribe(700, 950),
      subscribe(950, 1100)
    );
  });
/*
  test('Retry Observable Throws', function () {
    var scheduler1 = new TestScheduler();

    var xs = Observable.just(1, scheduler1).retry();

    xs.subscribe(function (x) {
      throw new Error();
    });

    raises(function () {
      return scheduler1.start();
    });

    var scheduler2 = new TestScheduler();

    var ys = Observable.throwError(new Error(), scheduler2).retry();

    var d = ys.subscribe(noop, function (err) { throw err; });

    scheduler2.scheduleAbsolute(210, function () {
      return d.dispose();
    });

    scheduler2.start();

    var scheduler3 = new TestScheduler();

    var zs = Observable.just(1, scheduler3).retry();

    zs.subscribe(noop, noop, function () { throw new Error(); });

    raises(function () {
      return scheduler3.start();
    });

    var xss = Observable.create(function () { throw new Error(); }).retry();

    raises(function () {
      return xss.subscribe();
    });
  });
*/
  test('Retry Observable RetryCount Basic', function () {
    var scheduler = new TestScheduler();

    var error = new Error();

    var xs = scheduler.createColdObservable(
      onNext(5, 1),
      onNext(10, 2),
      onNext(15, 3),
      onError(20, error)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.retry(3);
    });

    results.messages.assertEqual(
      onNext(205, 1),
      onNext(210, 2),
      onNext(215, 3),
      onNext(225, 1),
      onNext(230, 2),
      onNext(235, 3),
      onNext(245, 1),
      onNext(250, 2),
      onNext(255, 3),
      onError(260, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 220),
      subscribe(220, 240),
      subscribe(240, 260)
    );
  });

  test('Retry Observable RetryCount Dispose', function () {
    var scheduler = new TestScheduler();

    var error = new Error();

    var xs = scheduler.createColdObservable(
      onNext(5, 1),
      onNext(10, 2),
      onNext(15, 3),
      onError(20, error)
    );

    var results = scheduler.startWithDispose(function () {
      return xs.retry(3);
    }, 231);

    results.messages.assertEqual(
      onNext(205, 1),
      onNext(210, 2),
      onNext(215, 3),
      onNext(225, 1),
      onNext(230, 2)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 220),
      subscribe(220, 231)
    );
  });

  test('RetryObservable RetryCount_Dispose', function () {
    var scheduler = new TestScheduler();

    var error = new Error();

    var xs = scheduler.createColdObservable(
      onNext(100, 1),
      onNext(150, 2),
      onNext(200, 3)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.retry(3);
    });

    results.messages.assertEqual(
      onNext(300, 1),
      onNext(350, 2),
      onNext(400, 3)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('Retry Observable RetryCount Dispose', function () {
    var scheduler = new TestScheduler();

    var error = new Error();

    var xs = scheduler.createColdObservable(
      onNext(100, 1),
      onNext(150, 2),
      onNext(200, 3),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.retry(3);
    });

    results.messages.assertEqual(
      onNext(300, 1),
      onNext(350, 2),
      onNext(400, 3),
      onCompleted(450)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 450)
    );
  });

  test('Retry Observable RetryCount Throws', function () {
    var scheduler1 = new TestScheduler();

    var xs = Observable.just(1, scheduler1).retry(3);

    xs.subscribe(function (x) {
      throw new Error();
    });

    raises(function () {
      return scheduler1.start();
    });

    var scheduler2 = new TestScheduler();

    var ys = Observable.throwError(new Error(), scheduler2).retry(100);

    var d = ys.subscribe(noop, function (err) { throw err; });

    scheduler2.scheduleAbsolute(10, function () {
      return d.dispose();
    });

    scheduler2.start();

    var scheduler3 = new TestScheduler();

    var zs = Observable.just(1, scheduler3).retry(100);

    zs.subscribe(noop, noop, function () { throw new Error(); });

    raises(function () {
      return scheduler3.start();
    });

    xss = Observable.create(function () { throw new Error(); }).retry(100);

    raises(function () {
      return xss.subscribe();
    });
  });

}());
