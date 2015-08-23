(function () {
  QUnit.module('TimeInterval');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  function TimeInterval(value, interval) {
    this.value = value;
    this.interval = interval;
  }

  test('TimeInterval Regular', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onNext(260, 4),
      onNext(300, 5),
      onNext(350, 6),
      onCompleted(400));

    var results = scheduler.startWithCreate(function () {
      return xs.timeInterval(scheduler).map(function (x) {
        return new TimeInterval(x.value, x.interval);
      });
    });

    results.messages.assertEqual(
      onNext(210, new TimeInterval(2, 10)),
      onNext(230, new TimeInterval(3, 20)),
      onNext(260, new TimeInterval(4, 30)),
      onNext(300, new TimeInterval(5, 40)),
      onNext(350, new TimeInterval(6, 50)),
      onCompleted(400));
  });

  test('TimeInterval Empty', function () {
    var results, scheduler;

    var scheduler = new TestScheduler();

    var results = scheduler.startWithCreate(function () {
      return Rx.Observable.empty(scheduler).timeInterval(scheduler);
    });

    results.messages.assertEqual(
      onCompleted(201));
  });

  test('TimeInterval Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var results = scheduler.startWithCreate(function () {
      return Rx.Observable['throw'](error, scheduler).timeInterval(scheduler);
    });
    
    results.messages.assertEqual(
      onError(201, error));
  });

  test('TimeInterval Never', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startWithCreate(function () {
      return Rx.Observable.never().timeInterval(scheduler);
    });

    results.messages.assertEqual();
  });

}());
