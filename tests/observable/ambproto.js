(function () {
  QUnit.module('amb');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('amb never two', function () {
    var scheduler = new TestScheduler();

    var l = Observable.never();

    var r = Observable.never();

    var results = scheduler.startScheduler(function () { return l.amb(r); });

    results.messages.assertEqual();
  });

  test('amb never three', function () {
    var scheduler = new TestScheduler();

    var n1 = Observable.never();

    var n2 = Observable.never();

    var n3 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return Observable.amb(n1, n2, n3);
    });

    results.messages.assertEqual();
  });

  test('amb never empty', function () {
    var scheduler = new TestScheduler();

    var n = Observable.never();

    var e = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(225));

    var results = scheduler.startScheduler(function () { return n.amb(e); });

    results.messages.assertEqual(onCompleted(225));
  });

  test('amb empty never', function () {
    var scheduler = new TestScheduler();

    var n = Observable.never();

    var e = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(225));

    var results = scheduler.startScheduler(function () { return e.amb(n); });

    results.messages.assertEqual(onCompleted(225));
  });

  test('amb should dispose loser', function () {
    var scheduler = new TestScheduler();

    var sourceNotDisposed = false;

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(240));

    var o2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 3),
      onCompleted(250)
    ).tap(function () { sourceNotDisposed = true; });

    var results = scheduler.startScheduler(function () { return o1.amb(o2); });

    results.messages.assertEqual(
      onNext(210, 2),
      onCompleted(240));

    ok(!sourceNotDisposed);
  });

  test('amb winner throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var sourceNotDisposed = false;

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(220, error));

    var o2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 3),
      onCompleted(250)
    ).tap(function () { sourceNotDisposed = true; });

    var results = scheduler.startScheduler(function () { return o1.amb(o2); });

    results.messages.assertEqual(
      onNext(210, 2),
      onError(220, error));

    ok(!sourceNotDisposed);
  });

  test('amb loser throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var sourceNotDisposed = false;

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 2),
      onError(230, error)
    ).tap(function () { sourceNotDisposed = true; });

    var o2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 3),
      onCompleted(250));

    var results = scheduler.startScheduler(function () { return o1.amb(o2); });

    results.messages.assertEqual(
      onNext(210, 3),
      onCompleted(250));

    ok(!sourceNotDisposed);
  });

  test('amb throws before selection', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var sourceNotDisposed = false;

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error));

    var o2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 3),
      onCompleted(250)
    ).tap(function () { sourceNotDisposed = true; });

    var results = scheduler.startScheduler(function () { return o1.amb(o2); });

    results.messages.assertEqual(
      onError(210, error));

    ok(!sourceNotDisposed);
  });

}());
