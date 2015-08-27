(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, raises */

  QUnit.module('empty');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('empty basic', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.empty(scheduler);
    });

    results.messages.assertEqual(
      onCompleted(201));
  });

  test('empty disposed', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.empty(scheduler);
    }, { disposed: 200 });

    results.messages.assertEqual();
  });

  function noop () { }

  test('empty observer throws', function () {
    var scheduler = new TestScheduler();

    var xs = Observable.empty(scheduler);

    xs.subscribe(noop, noop, function () { throw new Error(); });

    raises(function () {
      scheduler.start();
    });
  });

}());
