(function () {
  QUnit.module('pairs');

  var TestScheduler = Rx.TestScheduler,
    Observable = Rx.Observable;
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

  test('pairs empty', function () {
    var scheduler = new TestScheduler();

    var xs = {};

    var results = scheduler.startWithCreate(function () {
      return Observable.pairs(xs, scheduler);
    });

    results.messages.assertEqual(
      onCompleted(201)
    );
  });

  test('pairs normal', function () {
    var scheduler = new TestScheduler();

    var xs = {foo: 42, bar: 56, baz: 78};

    var results = scheduler.startWithCreate(function () {
      return Observable.pairs(xs, scheduler);
    });

    results.messages.assertEqual(
      onNext(201, ['foo', 42]),
      onNext(202, ['bar', 56]),
      onNext(203, ['baz', 78]),
      onCompleted(204)
    );
  });

}());
