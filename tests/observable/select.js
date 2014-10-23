(function () {
  QUnit.module('Select');

  var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    SerialDisposable = Rx.SerialDisposable,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

  // Function shortcuts
  function noop () { }
  function identity (x) { return x; }
  function throwError () { throw new Error(); }

  test('Select_Throws', function () {

    raises(function () {
      Observable.just(1)
        .map(identity)
        .subscribe(throwError);
    });

    raises(function () {
      Observable.throwError(new Error())
        .map(function (x) { return x; })
        .subscribe(noop, throwError);
    });

    raises(function () {
      Observable.empty()
        .map(function (x) { return x; })
        .subscribe(noop, noop, throwError);
    });

    raises(function () {
      Observable.create(throwError)
        .map(identity)
        .subscribe();
    });

  });

  test('SelectWithIndex_DisposeInsideSelector', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(100, 4),
      onNext(200, 3),
      onNext(500, 2),
      onNext(600, 1)
    );

    var invoked = 0;

    var results = scheduler.createObserver();

    var d = new SerialDisposable();
    d.setDisposable(
      xs.map(function(x, index) {
          invoked++;
          scheduler.clock > 400 && d.dispose();
          return x + index * 10;
        })
        .subscribe(results)
    );

    scheduler.scheduleAbsolute(disposed, d.dispose.bind(d));

    scheduler.start();

    results.messages.assertEqual(
      onNext(100, 4),
      onNext(200, 13)
    );

    xs.subscriptions.assertEqual(
      subscribe(0, 500)
    );

    equal(3, invoked);
  });

  test('SelectWithIndex_Completed', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(180, 5),
      onNext(210, 4),
      onNext(240, 3),
      onNext(290, 2),
      onNext(350, 1),
      onCompleted(400),
      onNext(410, -1),
      onCompleted(420),
      onError(430, new Error())
    );

    var results = scheduler.startWithCreate(function () {
      return xs.map(function (x, index) {
        invoked++;
        return (x + 1) + (index * 10);
      });
    });

    results.messages.assertEqual(
      onNext(210, 5),
      onNext(240, 14),
      onNext(290, 23),
      onNext(350, 32),
      onCompleted(400)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );

    equal(4, invoked);
  });

  test('SelectWithIndex_NotCompleted', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(180, 5),
      onNext(210, 4),
      onNext(240, 3),
      onNext(290, 2),
      onNext(350, 1)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.map(function (x, index) {
        invoked++;
        return (x + 1) + (index * 10);
      });
    });

    results.messages.assertEqual(
      onNext(210, 5),
      onNext(240, 14),
      onNext(290, 23),
      onNext(350, 32)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );

    equal(4, invoked);
  });

  test('SelectWithIndex_Error', function () {
    var scheduler = new TestScheduler();

    var error = new Error();

    var invoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(180, 5),
      onNext(210, 4),
      onNext(240, 3),
      onNext(290, 2),
      onNext(350, 1),
      onError(400, error),
      onNext(410, -1),
      onCompleted(420),
      onError(430, new Error())
    );

    var results = scheduler.startWithCreate(function () {
      return xs.map(function (x, index) {
        invoked++;
        return (x + 1) + (index * 10);
      });
    });

    results.messages.assertEqual(
      onNext(210, 5),
      onNext(240, 14),
      onNext(290, 23),
      onNext(350, 32),
      onError(400, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );

    equal(4, invoked);
  });

  test('Select_SelectorThrows', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var error = new Error();

    var xs = scheduler.createHotObservable(
      onNext(180, 5),
      onNext(210, 4),
      onNext(240, 3),
      onNext(290, 2),
      onNext(350, 1),
      onCompleted(400),
      onNext(410, -1),
      onCompleted(420),
      onError(430, new Error())
    );

    var results = scheduler.startWithCreate(function () {
      return xs.map(function (x, index) {
        invoked++;
        if (invoked === 3) { throw error; }
        return (x + 1) + (index * 10);
      });
    });

    results.messages.assertEqual(
      onNext(210, 5),
      onNext(240, 14),
      onError(290, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 290)
    );

    equal(3, invoked);
  });

  test('Select value', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.map(-1);
    });

    results.messages.assertEqual(
      onNext(210, -1),
      onNext(220, -1),
      onNext(230, -1),
      onNext(240, -1),
      onCompleted(250)
    );
  });

}());
