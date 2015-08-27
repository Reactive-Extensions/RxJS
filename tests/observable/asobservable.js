(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, notEqual, ok */

  QUnit.module('asObservable');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('asObservable Hides', function () {
    var someObservable = Observable.empty();
    notEqual(someObservable.asObservable(), someObservable);
  });

  test('asObservable Never', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.never().asObservable();
    });

    results.messages.assertEqual();
  });

  test('asObservable Empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
        return xs.asObservable();
    });

    results.messages.assertEqual(
      onCompleted(250));
  });

  test('asObservable throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(250, error));

    var results = scheduler.startScheduler(function () {
      return xs.asObservable();
    });

    results.messages.assertEqual(
      onError(250, error));
  });

  test('asObservable just', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 2),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.asObservable();
    });

    results.messages.assertEqual(
      onNext(220, 2),
      onCompleted(250));
  });

  test('asObservable is not eager', function () {
    var scheduler = new TestScheduler();

    var subscribed = false;

    var xs = Observable.create(function (obs) {
      subscribed = true;
      var disp = scheduler.createHotObservable(
          onNext(150, 1),
          onNext(220, 2),
          onCompleted(250)
        ).subscribe(obs);
      return function () { return disp.dispose(); };
    });
    xs.asObservable();

    ok(!subscribed);

    scheduler.startScheduler(function () {
      return xs.asObservable();
    });

    ok(subscribed);
  });

}());
