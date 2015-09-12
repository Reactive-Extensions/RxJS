(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('bufferWithTimeOrCount');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('bufferWithTimeOrCount basic', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(205, 1),
      onNext(210, 2),
      onNext(240, 3),
      onNext(280, 4),
      onNext(320, 5),
      onNext(350, 6),
      onNext(370, 7),
      onNext(420, 8),
      onNext(470, 9),
      onCompleted(600)
    );

    var results = scheduler.startScheduler(function () {
      return xs.bufferWithTimeOrCount(70, 3, scheduler);
    });

    results.messages.assertEqual(
      onNext(240, [1,2,3]),
      onNext(310, [4]),
      onNext(370, [5,6,7]),
      onNext(440, [8]),
      onNext(510, [9]),
      onNext(580, []),
      onNext(600, []),
      onCompleted(600)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );
  });

  test('bufferWithTimeOrCount error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(205, 1),
      onNext(210, 2),
      onNext(240, 3),
      onNext(280, 4),
      onNext(320, 5),
      onNext(350, 6),
      onNext(370, 7),
      onNext(420, 8),
      onNext(470, 9),
      onError(600, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.bufferWithTimeOrCount(70, 3, scheduler);
    });

    results.messages.assertEqual(
      onNext(240, [1,2,3]),
      onNext(310, [4]),
      onNext(370, [5,6,7]),
      onNext(440, [8]),
      onNext(510, [9]),
      onNext(580, []),
      onError(600, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );
  });

  test('bufferWithTimeOrCount disposed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(205, 1),
      onNext(210, 2),
      onNext(240, 3),
      onNext(280, 4),
      onNext(320, 5),
      onNext(350, 6),
      onNext(370, 7),
      onNext(420, 8),
      onNext(470, 9),
      onCompleted(600)
    );

    var results = scheduler.startScheduler(function () {
      return xs.bufferWithTimeOrCount(70, 3, scheduler);
    }, { disposed: 370 });

    results.messages.assertEqual(
      onNext(240, [1,2,3]),
      onNext(310, [4]),
      onNext(370, [5,6,7])
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 370)
    );
  });

  test('multiple bufferWithTimeOrCounts', function(){
    var scheduler = new TestScheduler();

    var xs1 = scheduler.createHotObservable(onCompleted(700))
        .bufferWithTimeOrCount(100, 3, scheduler);

    var xs2 = scheduler.createHotObservable(onCompleted(700))
        .bufferWithTimeOrCount(150, 4, scheduler);

    var results1 = scheduler.createObserver();
    var results2 = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, 370, function (){
      xs1.subscribe(results1);
      xs2.subscribe(results2);
    });

    scheduler.start();

    results1.messages.assertEqual(
      onNext(470, []),
      onNext(570, []),
      onNext(670, []),
      onNext(700, []),
      onCompleted(700)
    );

    results2.messages.assertEqual(
      onNext(520, []),
      onNext(670, []),
      onNext(700, []),
      onCompleted(700)
    );
  });

}());
