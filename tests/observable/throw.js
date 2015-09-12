(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, raises */
  QUnit.module('throw');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onError = Rx.ReactiveTest.onError;

  function noop () { }

  test('throw basic', function () {
    var scheduler = new TestScheduler();

    var error = new Error();

    var results = scheduler.startScheduler(function () {
      return Observable['throw'](error, scheduler);
    });

    results.messages.assertEqual(
      onError(201, error)
    );
  });

  test('throw disposed', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable['throw'](new Error(), scheduler);
    }, { disposed: 200 });

    results.messages.assertEqual();
  });

  test('throw observer throws', function () {
    var scheduler = new TestScheduler();

    var xs = Observable['throw'](new Error(), scheduler);

    xs.subscribe(noop, function () { throw new Error(); });

    raises(function () { scheduler.start(); });
  });

}());
