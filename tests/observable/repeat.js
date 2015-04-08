(function () {
  QUnit.module('Repeat');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe,
      created = Rx.ReactiveTest.created,
      subscribed = Rx.ReactiveTest.subscribed,
      disposed = Rx.ReactiveTest.disposed;

  test('Repeat_Value_Count_Zero', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startWithCreate(function () {
      return Observable.repeat(42, 0, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(201)
    );
  });

  test('Repeat_Value_Count_One', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startWithCreate(function () {
      return Observable.repeat(42, 1, scheduler);
    });

    results.messages.assertEqual(
      onNext(201, 42),
      onCompleted(201)
    );
  });

  test('Repeat_Value_Count_Ten', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startWithCreate(function () {
        return Observable.repeat(42, 10, scheduler);
    });

    results.messages.assertEqual(
      onNext(201, 42),
      onNext(202, 42),
      onNext(203, 42),
      onNext(204, 42),
      onNext(205, 42),
      onNext(206, 42),
      onNext(207, 42),
      onNext(208, 42),
      onNext(209, 42),
      onNext(210, 42),
      onCompleted(210)
    );
  });

  test('Repeat_Value_Count_Dispose', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startWithDispose(function () {
      return Observable.repeat(42, 10, scheduler);
    }, 207);

    results.messages.assertEqual(
      onNext(201, 42),
      onNext(202, 42),
      onNext(203, 42),
      onNext(204, 42),
      onNext(205, 42),
      onNext(206, 42)
    );
  });

  test('Repeat_Value', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startWithDispose(function () {
      return Observable.repeat(42, -1, scheduler);
    }, 207);

    results.messages.assertEqual(
      onNext(201, 42),
      onNext(202, 42),
      onNext(203, 42),
      onNext(204, 42),
      onNext(205, 42),
      onNext(206, 42)
    );
  });

}());
