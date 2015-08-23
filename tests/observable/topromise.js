module('ToPromise');

var TestScheduler = Rx.TestScheduler,
    Observable = Rx.Observable;

asyncTest('Promise Success', function () {
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

asyncTest('Promise Failure', function () {
  var error = new Error('woops');

  var source = Rx.Observable['throw'](error);

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
