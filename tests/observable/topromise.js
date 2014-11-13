module('ToPromise');

var TestScheduler = Rx.TestScheduler,
    Observable = Rx.Observable;

asyncTest('Promise_Success', function () {
  var source = Rx.Observable.just(42);

  var promise = source.toPromise(RSVP.Promise);

  promise.then(
    function (value) {
      equal(42, value);
      start();
    },
    function (reason) {
      ok(false);
    }
  );
});

asyncTest('Promise_Failure', function () {
  var error = new Error('woops');

  var source = Rx.Observable.throwError(error);

  var promise = source.toPromise(RSVP.Promise);

  promise.then(
    function (value) {
      ok(false);
    },
    function (reason) {
      equal(error, reason);
      start();
    }
  );
});
