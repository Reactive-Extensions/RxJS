(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, asyncTest, start, equal, ok, RSVP */
  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  function noop() {}

  QUnit.module('startAsync');

  asyncTest('StartAsync', function () {
    var source = Rx.Observable.startAsync(function () {
      return new RSVP.Promise(function (res) { res(42); });
    });

    source.subscribe(function (x) {
      equal(42, x);
      start();
    });
  });

  asyncTest('StartAsync_Error', function () {
    var source = Rx.Observable.startAsync(function () {
      return new RSVP.Promise(function (res, rej) { rej(42); });
    });

    source.subscribe(noop, function (err) {
      equal(42, err);
      start();
    });
  });

  test('start action 2', function () {
    var scheduler = new TestScheduler();

    var done = false;

    var res = scheduler.startScheduler(function () {
      return Observable.start(function () {
        done = true;
      }, null, scheduler);
    });

    res.messages.assertEqual(
      onNext(200, undefined),
      onCompleted(200)
    );

    ok(done);
  });

  test('start function 2', function () {
    var scheduler = new TestScheduler();

    var res = scheduler.startScheduler(function () {
      return Observable.start(function () {
        return 1;
      }, null, scheduler);
    });

    res.messages.assertEqual(
      onNext(200, 1),
      onCompleted(200)
    );
  });

  test('start with error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var res = scheduler.startScheduler(function () {
      return Observable.start(function () {
        throw error;
      }, null, scheduler);
    });

    res.messages.assertEqual(
      onError(200, error)
    );
  });

  test('start with context', function () {
    var context = { value: 42 };

    var scheduler = new TestScheduler();

    var res = scheduler.startScheduler(function () {
      return Observable.start(function () {
        return this.value;
      }, context, scheduler);
    });

    res.messages.assertEqual(
      onNext(200, 42),
      onCompleted(200)
    );
  });

}());
