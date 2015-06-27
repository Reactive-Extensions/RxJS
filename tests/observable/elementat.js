(function () {
  QUnit.module('elementAt');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('elementAt_First', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(280, 42),
      onNext(360, 43),
      onNext(470, 44),
      onCompleted(600)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.elementAt(0);
    });

    results.messages.assertEqual(
      onNext(280, 42),
      onCompleted(280)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 280)
    );
  });

  test('elementAt_Other', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(280, 42),
      onNext(360, 43),
      onNext(470, 44),
      onCompleted(600)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.elementAt(2);
    });

    results.messages.assertEqual(
      onNext(470, 44),
      onCompleted(470)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 470)
    );
  });

  test('elementAt_OutOfRange', function () {
      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
        onNext(280, 42),
        onNext(360, 43),
        onNext(470, 44),
        onCompleted(600)
      );

      var results = scheduler.startWithCreate(function () {
        return xs.elementAt(3);
      });

      results.messages.assertEqual(
        onNext(600, undefined),
        onCompleted(600)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 600)
      );
  });

}());
