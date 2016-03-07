(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal, ok, asyncTest, start, RSVP */

  QUnit.module('fromPromise');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('FromPromise Success Factory Mock', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createResolvedPromise(201, 1);

    var results = scheduler.startScheduler(function () {
      return Observable.fromPromise(function () { return xs; }, scheduler);
    });

    results.messages.assertEqual(
      onNext(202, 1),
      onCompleted(202)
    );
  });

  test('fromPromise Failure Mock', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createRejectedPromise(201, error);

    var results = scheduler.startScheduler(function () {
      return Observable.fromPromise(function () { return xs; }, scheduler);
    });

    results.messages.assertEqual(
      onError(202, error)
    );
  });

  test('fromPromise Failure Factory throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.fromPromise(function () { throw error; }, scheduler);
    });

    results.messages.assertEqual(
      onError(200, error)
    );
  });

  test('FromPromise Success Mock', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createResolvedPromise(201, 1);

    var results = scheduler.startScheduler(function () {
      return Observable.fromPromise(xs, scheduler);
    });

    results.messages.assertEqual(
      onNext(202, 1),
      onCompleted(202)
    );
  });

  test('fromPromise Failure Mock', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createRejectedPromise(201, error);

    var results = scheduler.startScheduler(function () {
      return Observable.fromPromise(xs, scheduler);
    });

    results.messages.assertEqual(
      onError(202, error)
    );
  });

  asyncTest('fromPromise Success', function () {
    var promise = new RSVP.Promise(function (resolve) {
      resolve(42);
    });

    var source = Observable.fromPromise(promise);

    source.subscribe(
      function (x) {
        equal(42, x);
      },
      function () {
        ok(false);
      },
      function () {
        ok(true);
        start();
      });
  });

  asyncTest('promise Failure', function () {
    var error = new Error('woops');

    var promise = new RSVP.Promise(function (resolve, reject) {
      reject(error);
    });

    var source = Observable.fromPromise(promise);

    source.subscribe(
      function () {
        ok(false);
      },
      function (err) {
        equal(err, error);
        start();
      },
      function () {
        ok(false);
      });
  });
}());
