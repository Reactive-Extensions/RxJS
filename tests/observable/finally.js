(function () {
  QUnit.module('finally');

  var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

  test('finally has orders of effects', function () {
    var results = [];
    function noop () {}

    var someObservable = Rx.Observable.empty()['finally'](function () {
      results.push('invoked');
    });

    var d = someObservable.subscribe(noop, noop, function () {
      results.push('completed');
    });

    equal(results[0], 'completed');
    equal(results[1], 'invoked');
  });

  test('finally calls finally before throwing', function () {
    var invoked = false;

    var someObservable = Rx.Observable['throw'](new Error())['finally'](function () {
      invoked = true;
    });

    throws(function () {
      someObservable.subscribe();
    });

    ok(invoked);
  });

  test('finally only called once on empty', function () {
    var invokeCount = 0;

    var someObservable = Rx.Observable.empty()['finally'](function () {
      invokeCount++;
    });

    var d = someObservable.subscribe();

    d.dispose();
    d.dispose();

    equal(1, invokeCount);
  });

  test('finally called with empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var invoked = false;

    var results = scheduler.startWithCreate(function () {
      return xs['finally'](function () {
        invoked = true;
      });
    }).messages;

    results.assertEqual(
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );

    ok(invoked);
  });

  test('finally called with single value', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var invoked = false;

    var results = scheduler.startWithCreate(function () {
      return xs['finally'](function () {
        invoked = true;
      });
    }).messages;

    results.assertEqual(
      onNext(210, 2),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );

    ok(invoked);
  });

  test('finally on throws', function () {
    var ex = new Error('ex');

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(250, ex)
    );

    var invoked = false;

    var results = scheduler.startWithCreate(function () {
      return xs['finally'](function () {
        invoked = true;
      });
    }).messages;

    results.assertEqual(
      onError(250, ex)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );

    ok(invoked);
  });

}());
