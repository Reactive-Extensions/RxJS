(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('BufferWithTime');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('BufferWithTime Basic', function () {
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
      return xs.bufferWithTime(100, 70, scheduler);
    });

    results.messages.assertEqual(
      onNext(300, [2,3,4]),
      onNext(370, [4,5,6]),
      onNext(440, [6,7,8]),
      onNext(510, [8,9]),
      onNext(580, []),
      onNext(600, []),
      onCompleted(600));
    xs.subscriptions.assertEqual(subscribe(200, 600));
  });

  test('BufferWithTime Error', function () {
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
      return xs.bufferWithTime(100, 70, scheduler);
    });

    results.messages.assertEqual(
      onNext(300, [2,3,4]),
      onNext(370, [4,5,6]),
      onNext(440, [6,7,8]),
      onNext(510, [8,9]),
      onNext(580, []),
      onError(600, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 600));
  });

  test('BufferWithTime Disposed', function () {
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
      return xs.bufferWithTime(100, 70, scheduler);
    }, {disposed: 370});

    results.messages.assertEqual(
      onNext(300, [2,3,4]));

    xs.subscriptions.assertEqual(
      subscribe(200, 370));
  });

  test('BufferWithTime Basic Same', function () {
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
      return xs.bufferWithTime(100, scheduler);
    });

    results.messages.assertEqual(
      onNext(300, [2,3,4]),
      onNext(400, [5,6,7]),
      onNext(500, [8,9]),
      onNext(600, []),
      onCompleted(600));

    xs.subscriptions.assertEqual(subscribe(200, 600));
  });

}());
