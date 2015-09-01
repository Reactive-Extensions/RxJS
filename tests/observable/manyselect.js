(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, ok */
  QUnit.module('manySelect');

  var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

  test('manySelect Law 1', function () {
    var xs = Observable.range(1, 0);

    var left = xs.manySelect(function (x) { return x.first(); });
    var right = xs;

    left.sequenceEqual(right).first().subscribe(ok);
  });

  test('manySelect Basic', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(100, 1),
      onNext(220, 2),
      onNext(270, 3),
      onNext(410, 4),
      onCompleted(500)
    );

    var res = scheduler.startScheduler(function () {
      return xs.manySelect(function (ys) { return ys.first(); }, scheduler).mergeAll();
    });

    res.messages.assertEqual(
      onNext(221, 2),
      onNext(271, 3),
      onNext(411, 4),
      onCompleted(501)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 500)
    );
  });

  test('manySelect Error', function () {
    var scheduler = new TestScheduler();

    var ex = new Error();

    var xs = scheduler.createHotObservable(
      onNext(100, 1),
      onNext(220, 2),
      onNext(270, 3),
      onNext(410, 4),
      onError(500, ex)
    );

    var res = scheduler.startScheduler(function () {
      return xs.manySelect(function (ys) { return ys.first(); }, scheduler).mergeAll();
    });

    res.messages.assertEqual(
      onNext(221, 2),
      onNext(271, 3),
      onNext(411, 4),
      onError(501, ex)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 500)
    );
  });

}());
