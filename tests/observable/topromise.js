(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, Rx, asyncTest, start, equal, ok, RSVP */
  QUnit.module('toPromise');

  var Observable = Rx.Observable;

  asyncTest('promise Success', function () {
    var source = Observable.just(42);

    var promise = source.toPromise(RSVP.Promise);

    promise.then(
      function (value) {
        equal(42, value);
        start();
      },
      function () {
        ok(false);
      }
    );
  });

  asyncTest('Promise Failure', function () {
    var error = new Error('woops');

    var source = Rx.Observable['throw'](error);

    var promise = source.toPromise(RSVP.Promise);

    promise.then(
      function () {
        ok(false);
      },
      function (reason) {
        equal(error, reason);
        start();
      }
    );
  });

}());
