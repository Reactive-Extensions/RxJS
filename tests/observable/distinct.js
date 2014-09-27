QUnit.module('Distinct');

var Observable = Rx.Observable,
  TestScheduler = Rx.TestScheduler,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

test('Distinct_DefaultComparer_AllDistinct', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(280, 4),
    onNext(300, 2),
    onNext(350, 1),
    onNext(380, 3),
    onNext(400, 5),
    onCompleted(420)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.distinct();
  });

  results.messages.assertEqual(
    onNext(280, 4),
    onNext(300, 2),
    onNext(350, 1),
    onNext(380, 3),
    onNext(400, 5),
    onCompleted(420)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 420)
  );
});

test('Distinct_DefaultComparer_SomeDuplicates', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(280, 4),
    onNext(300, 2),
    onNext(350, 2),
    onNext(380, 3),
    onNext(400, 4),
    onCompleted(420)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.distinct();
  });

  results.messages.assertEqual(
    onNext(280, 4),
    onNext(300, 2),
    onNext(380, 3),
    onCompleted(420)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 420)
  );
});

function modComparer(mod) {
  return function (x, y) {
    return Rx.helpers.defaultComparer(x % mod, y % mod);
  };
}

test('Distinct_CustomComparer_AllDistinct', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(280, 4),
    onNext(300, 2),
    onNext(350, 1),
    onNext(380, 3),
    onNext(400, 5),
    onCompleted(420)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.distinct(null, modComparer(10));
  });

  res.messages.assertEqual(
    onNext(280, 4),
    onNext(300, 2),
    onNext(350, 1),
    onNext(380, 3),
    onNext(400, 5),
    onCompleted(420)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 420)
  );
});

test('Distinct_CustomComparer_SomeDuplicates', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(280, 4),
    onNext(300, 2),
    onNext(350, 12),
    onNext(380, 3),
    onNext(400, 24),
    onCompleted(420)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.distinct(null, modComparer(10));
  });

  res.messages.assertEqual(
    onNext(280, 4),
    onNext(300, 2),
    onNext(380, 3),
    onCompleted(420)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 420)
  );
});
