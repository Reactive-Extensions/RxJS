(function () {
  QUnit.module('create');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe,
      created = Rx.ReactiveTest.created,
      subscribed = Rx.ReactiveTest.subscribed,
      disposed = Rx.ReactiveTest.disposed;

  function noop () { }

  test('create next', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.create(function (o) {
        o.onNext(1);
        o.onNext(2);
        return Rx.Disposable.empty;
      });
    });

    results.messages.assertEqual(
      onNext(200, 1),
      onNext(200, 2));
  });

  test('create completed', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.create(function (o) {
        o.onCompleted();
        o.onNext(100);
        o.onError(new Error(););
        o.onCompleted();
        return Rx.Disposable.empty;
      });
    });

    results.messages.assertEqual(
      onCompleted(200));
  });

  test('create Error', function () {
    var scheduler = new TestScheduler();

    var error = new Error();

    var results = scheduler.startScheduler(function () {
      return Observable.create(function (o) {
        o.onError(error);
        o.onNext(100);
        o.onError(new Error());
        o.onCompleted();
        return Rx.Disposable.empty;
      });
    });

    results.messages.assertEqual(
      onError(200, error));
  });

  test('create noop next', function () {

      var scheduler = new TestScheduler();
      var results = scheduler.startScheduler(function () {
        return Observable.create(function (o) {
          o.onNext(1);
          o.onNext(2);
          return noop;
        });
      });

      results.messages.assertEqual(onNext(200, 1), onNext(200, 2));
  });

  test('create no op completed', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.create(function (o) {
        o.onCompleted();
        o.onNext(100);
        o.onError(new Error(););
        o.onCompleted();
        return noop;
      });
    });

    results.messages.assertEqual(
      onCompleted(200));
  });

  test('create no op Error', function () {
    var scheduler = new TestScheduler();

    var error = new Error();

    var results = scheduler.startScheduler(function () {
      return Observable.create(function (o) {
        o.onError(error);
        o.onNext(100);
        o.onError('foo');
        o.onCompleted();
        return noop;
      });
    });

    results.messages.assertEqual(
      onError(200, error));
  });

  test('create throws errors', function () {
    raises(function () {
      Observable.create(function (o) { throw new Error(); }).subscribe();
    });
  });

  test('create dispose', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.create(function (o) {
        var isStopped = false;

        o.onNext(1);
        o.onNext(2);

        scheduler.scheduleFuture(null, 600, function () {
          !isStopped && o.onNext(3);
        });

        scheduler.scheduleFuture(null, 700, function () {
          !isStopped && o.onNext(4);
        });

        scheduler.scheduleFuture(null, 900, function () {
          !isStopped && o.onNext(5);
        });

        scheduler.scheduleWithRelative(1100, function () {
          !isStopped && o.onNext(6);
        });

        return function () { isStopped = true; };
      });
    });

    results.messages.assertEqual(
      onNext(200, 1),
      onNext(200, 2),
      onNext(800, 3),
      onNext(900, 4));
  });

  test('create observer does not catch', function () {
    raises(function () {
      Observable.create(function (o) { o.onNext(1); })
        .subscribe(function (x) { throw new Error(); });
    });

    raises(function () {
      Observable.create(function (o) { o.onError(new Error()); })
        .subscribe(noop, function () { throw new Error(); });
    });

    raises(function () {
      Observable.create(function (o) { o.onCompleted(); })
        .subscribe(noop, noop, function () { throw new Error(); });
    });
  });

}());
