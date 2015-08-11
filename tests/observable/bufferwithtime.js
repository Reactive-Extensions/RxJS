(function () {
  QUnit.module('bufferWithTime');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  function toString(s) { return s.toString(); }

    test('bufferWithTime Basic', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(100, 1),
      onNext(210, 2),
      onNext(240, 3),
      onNext(280, 4),
      onNext(320, 5),
      onNext(350, 6),
      onNext(380, 7),
      onNext(420, 8),
      onNext(470, 9),
      onCompleted(600));

    var results = scheduler.startScheduler(function () {
      return xs.bufferWithTime(100, 70, scheduler).map(toString);
    });

    results.messages.assertEqual(
      onNext(300, '2,3,4'),
      onNext(370, '4,5,6'),
      onNext(440, '6,7,8'),
      onNext(510, '8,9'),
      onNext(580, ''),
      onNext(600, ''),
      onCompleted(600));

    xs.subscriptions.assertEqual(
      subscribe(200, 600));
  });

  test('bufferWithTime Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(100, 1),
      onNext(210, 2),
      onNext(240, 3),
      onNext(280, 4),
      onNext(320, 5),
      onNext(350, 6),
      onNext(380, 7),
      onNext(420, 8),
      onNext(470, 9),
      onError(600, error));

    var results = scheduler.startScheduler(function () {
      return xs.bufferWithTime(100, 70, scheduler).map(toString);
    });

    results.messages.assertEqual(
      onNext(300, '2,3,4'),
      onNext(370, '4,5,6'),
      onNext(440, '6,7,8'),
      onNext(510, '8,9'),
      onNext(580, ''),
      onError(600, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 600));
  });

  test('bufferWithTime Disposed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(100, 1),
      onNext(210, 2),
      onNext(240, 3),
      onNext(280, 4),
      onNext(320, 5),
      onNext(350, 6),
      onNext(380, 7),
      onNext(420, 8),
      onNext(470, 9),
      onCompleted(600));

    var results = scheduler.startWithDispose(function () {
      return xs.bufferWithTime(100, 70, scheduler).map(toString);
    }, { disposed: 370 });

    results.messages.assertEqual(
      onNext(300, '2,3,4'));

    xs.subscriptions.assertEqual(
      subscribe(200, 370));
  });

  test('bufferWithTime Basic Same', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(100, 1),
      onNext(210, 2),
      onNext(240, 3),
      onNext(280, 4),
      onNext(320, 5),
      onNext(350, 6),
      onNext(380, 7),
      onNext(420, 8),
      onNext(470, 9),
      onCompleted(600));

    var results = scheduler.startScheduler(function () {
      return xs.bufferWithTime(100, scheduler).map(toString);
    });

    results.messages.assertEqual(
      onNext(300, '2,3,4'),
      onNext(400, '5,6,7'),
      onNext(500, '8,9'),
      onNext(600, ''),
      onCompleted(600));

    xs.subscriptions.assertEqual(subscribe(200, 600));
  });

}());
