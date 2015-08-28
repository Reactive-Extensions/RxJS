(function () {

  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('fromArray');

  var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onCompleted = Rx.ReactiveTest.onCompleted;

  test('fromArray normal', function () {
    var array = [1, 2, 3, 4, 5];

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.fromArray(array, scheduler);
    });

    results.messages.assertEqual(
      onNext(201, 1),
      onNext(202, 2),
      onNext(203, 3),
      onNext(204, 4),
      onNext(205, 5),
      onCompleted(206)
    );
  });

  test('fromArray empty', function () {
    var array = [];

    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.fromArray(array, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(201)
    );
  });

}());
