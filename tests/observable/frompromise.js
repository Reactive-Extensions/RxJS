(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal, ok, asyncTest, start, RSVP */

  QUnit.module('fromPromise');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('FromPromise Success Mock', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createResolvedPromise(201, 1);

    var results = scheduler.startScheduler(function () {
      return Observable.fromPromise(xs);
    });

    results.messages.assertEqual(
      onNext(201, 1),
      onCompleted(201)
    );
  });

  test('fromPromise Failure Mock', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createRejectedPromise(201, error);

    var results = scheduler.startScheduler(function () {
      return Observable.fromPromise(xs);
    });

    results.messages.assertEqual(
      onError(201, error)
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
