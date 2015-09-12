(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('never');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler;

  test('never basic', function () {
    var scheduler = new TestScheduler();

    var xs = Observable.never();

    var results = scheduler.createObserver();

    xs.subscribe(results);

    scheduler.start();

    results.messages.assertEqual();
  });

}());
