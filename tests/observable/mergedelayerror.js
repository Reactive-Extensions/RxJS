(function () {
  QUnit.module('MergeDelayError');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('mergeDelayError never never', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1)
    );

    var results = scheduler.startWithCreate(function() {
      return Observable.mergeDelayError(o1, o2);
    });

    results.messages.assertEqual();
  });

  test('mergeDelayError empty right', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1),
      onCompleted(260)
    );

    var results = scheduler.startWithCreate(function() {
      return Observable.mergeDelayError(o1, o2);
    });

    results.messages.assertEqual(
      onCompleted(260)
    );
  });

  test('mergeDelayError empty left', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(260)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function() {
      return Observable.mergeDelayError(o1, o2);
    });

    results.messages.assertEqual(
      onCompleted(260)
    );
  });
}());
