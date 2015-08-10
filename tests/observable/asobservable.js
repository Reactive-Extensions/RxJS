(function () {
  QUnit.module('asObservable');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('asObservable hides', function () {
    var someObservable = Rx.Observable.empty();
    ok(someObservable.asObservable() !== someObservable);
  });

  test('asObservable never', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Rx.Observable.never().asObservable();
    });

    results.messages.assertEqual();
  });

  test('asObservable empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.asObservable();
    })

    results.messages.assertEqual(
      onCompleted(250)
    );
  });

  test('asObservable throws', function () {
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

  test('asObservable Return', function () {
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

    var xs = Rx.Observable.create(function (obs) {
      subscribed = true;

      var disp = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(220, 2),
        onCompleted(250))
      .subscribe(obs);

      return Rx.Disposable.create(function () { disp.dispose(); }};
    });

    xs.asObservable();
    ok(!subscribed);

    scheduler.startScheduler(function () {
      return xs.asObservable();
    });

    ok(subscribed);
  });

}());
