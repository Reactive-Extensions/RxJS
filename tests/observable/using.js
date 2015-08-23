(function () {
  QUnit.module('Using');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe,
      created = Rx.ReactiveTest.created,
      subscribed = Rx.ReactiveTest.subscribed,
      disposed = Rx.ReactiveTest.disposed;

  test('using Null', function () {
    var xs, _d, disposable;

    var scheduler = new TestScheduler();

    var disposeInvoked = 0;
    var createInvoked = 0;

    var results = scheduler.startWithCreate(function () {
      return Observable.using(function () {
        disposeInvoked++;
        disposable = null;
        return disposable;
      }, function (d) {
        _d = d;
        createInvoked++;

        xs = scheduler.createColdObservable(
          onNext(100, scheduler.clock),
          onCompleted(200));

        return xs;
      });
    });

    equal(disposable, _d);

    results.messages.assertEqual(
      onNext(300, 200),
      onCompleted(400));

    equal(1, createInvoked);
    equal(1, disposeInvoked);

    xs.subscriptions.assertEqual(
      subscribe(200, 400));

    equal(disposable, null);
  });

  test('using Complete', function () {
    var disposable, xs, _d;

    var scheduler = new TestScheduler();

    var disposeInvoked = 0;
    var createInvoked = 0;

    var results = scheduler.startWithCreate(function () {
      return Observable.using(function () {
        disposeInvoked++;
        disposable = new Rx.MockDisposable(scheduler);
        return disposable;
      }, function (d) {
        _d = d;
        createInvoked++;
        xs = scheduler.createColdObservable(onNext(100, scheduler.clock), onCompleted(200));
        return xs;
      });
    });

    equal(disposable, _d);

    results.messages.assertEqual(
      onNext(300, 200),
      onCompleted(400));

    equal(1, createInvoked);
    equal(1, disposeInvoked);

    xs.subscriptions.assertEqual(
      subscribe(200, 400));

    disposable.disposes.assertEqual(200, 400);
  });

  test('using Error', function () {
    var disposable, xs, _d;

    var scheduler = new TestScheduler();

    var disposeInvoked = 0;
    var createInvoked = 0;

    var error = new Error();

    var results = scheduler.startWithCreate(function () {
      return Observable.using(function () {
        disposeInvoked++;
        disposable = new Rx.MockDisposable(scheduler);
        return disposable;
      }, function (d) {
        _d = d;
        createInvoked++;
        xs = scheduler.createColdObservable(
          onNext(100, scheduler.clock),
          onError(200, error));

        return xs;
      });
    });

    equal(disposable, _d);

    results.messages.assertEqual(
      onNext(300, 200),
      onError(400, error));

    equal(1, createInvoked);
    equal(1, disposeInvoked);

    xs.subscriptions.assertEqual(
      subscribe(200, 400));

    disposable.disposes.assertEqual(200, 400);
  });

  test('using Dispose', function () {
    var disposable, xs, _d;

    var scheduler = new TestScheduler();

    var disposeInvoked = 0;
    var createInvoked = 0;

    var results = scheduler.startWithCreate(function () {
      return Observable.using(function () {
        disposeInvoked++;
        disposable = new Rx.MockDisposable(scheduler);
        return disposable;
      }, function (d) {
        _d = d;
        createInvoked++;
        xs = scheduler.createColdObservable(
          onNext(100, scheduler.clock),
          onNext(1000, scheduler.clock + 1));

        return xs;
      });
    });

    equal(disposable, _d);

    results.messages.assertEqual(
      onNext(300, 200));

    equal(1, createInvoked);
    equal(1, disposeInvoked);

    xs.subscriptions.assertEqual(
      subscribe(200, 1000));

    disposable.disposes.assertEqual(200, 1000);
  });

  test('using ThrowResourceSelector', function () {
    var scheduler = new TestScheduler();

    var disposeInvoked = 0;
    var createInvoked = 0;

    var error = new Error();

    var results = scheduler.startWithCreate(function () {
      return Observable.using(function () {
        disposeInvoked++;
        throw error;
      }, function (d) {
        createInvoked++;
        return Observable.never();
      });
    });

    results.messages.assertEqual(
      onError(200, error));

    equal(0, createInvoked);
    equal(1, disposeInvoked);
  });

  test('using ThrowResourceUsage', function () {
    var disposable;

    var scheduler = new TestScheduler();

    var disposeInvoked = 0;
    var createInvoked = 0;

    var error = new Error();

    var results = scheduler.startWithCreate(function () {
      return Observable.using(function () {
        disposeInvoked++;
        disposable = new Rx.MockDisposable(scheduler);
        return disposable;
      }, function (d) {
        createInvoked++;
        throw error;
      });
    });

    results.messages.assertEqual(
      onError(200, error));

    equal(1, createInvoked);
    equal(1, disposeInvoked);

    disposable.disposes.assertEqual(200, 200);
  });

}());
