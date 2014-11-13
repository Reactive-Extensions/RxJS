(function () {
  module('FromPromise');

  var TestScheduler = Rx.TestScheduler,
    Observable = Rx.Observable;

  test('FromPromise Success Mock', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createResolvedPromise(201, 1);

    var results = scheduler.startWithCreate(function () {
      return Observable.fromPromise(xs);
    });

    results.messages.assertEqual(
      onNext(201, 1),
      onCompleted(201)
    );
  });

  test('FromPromise Failure Mock', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createRejectedPromise(201, error);

    var results = scheduler.startWithCreate(function () {
      return Observable.fromPromise(xs);
    });

    results.messages.assertEqual(
      onError(201, error)
    );
  });

  asyncTest('Promise_Success', function () {
    var promise = new RSVP.Promise(function (resolve, reject) {
      resolve(42);
    });

    var source = Observable.fromPromise(promise);

    var subscription = source.subscribe(
      function (x) {
        equal(42, x);
      },
      function (err) {
        ok(false);
      },
      function () {
        ok(true);
        start();
      });
  });

  asyncTest('Promise_Failure', function () {
    var error = new Error('woops');

    var promise = new RSVP.Promise(function (resolve, reject) {
      reject(error);
    });

    var source = Observable.fromPromise(promise);

    var subscription = source.subscribe(
      function (x) {
        ok(false);
      },
      function (err) {
        strictEqual(err, error);
        start();
      },
      function () {
        ok(false);
      });
  });
}());
