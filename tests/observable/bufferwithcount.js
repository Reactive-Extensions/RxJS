(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('BufferWithCount');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;


  test('Buffer Count PartialWindow', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.bufferWithCount(5);
    });

    results.messages.assertEqual(
      onNext(250, [2,3,4,5]),
      onCompleted(250)
    );
  });

  test('Buffer Count FullWindows', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.bufferWithCount(2);
    });

    results.messages.assertEqual(
      onNext(220, [2,3]),
      onNext(240, [4,5]),
      onCompleted(250)
    );
  });

  test('Buffer Count FullAndPartialWindows', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.bufferWithCount(3);
    });

    results.messages.assertEqual(
      onNext(230, [2,3,4]),
      onNext(240, [5]),
      onCompleted(250)
    );
  });

  test('Buffer Count Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onError(250, error));

    var results = scheduler.startScheduler(function () {
      return xs.bufferWithCount(5);
    });

    results.messages.assertEqual(
      onError(250, error)
    );
  });

  test('Buffer Count Skip Less', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.bufferWithCount(3, 1);
    });

    results.messages.assertEqual(
      onNext(230, [2,3,4]),
      onNext(240, [3,4,5]),
      onNext(250, [4,5]),
      onNext(250, [5]),
      onCompleted(250)
    );
  });

  test('Buffer Count Skip More', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return xs.bufferWithCount(2, 3);
    });

    results.messages.assertEqual(
      onNext(220, [2,3]),
      onNext(250, [5]),
      onCompleted(250)
    );
  });

  test('BufferWithCount Basic', function () {
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
        return xs.bufferWithCount(3, 2);
    });

    results.messages.assertEqual(
      onNext(280, [2,3,4]),
      onNext(350, [4,5,6]),
      onNext(420, [6,7,8]),
      onNext(600, [8,9]),
      onCompleted(600));

    xs.subscriptions.assertEqual(subscribe(200, 600));
  });

  test('BufferWithCount Disposed', function () {
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
      return xs.bufferWithCount(3, 2);
    }, {disposed: 370 });

    results.messages.assertEqual(
      onNext(280, [2,3,4]),
      onNext(350, [4,5,6]));

    xs.subscriptions.assertEqual(
      subscribe(200, 370));
  });

}());
