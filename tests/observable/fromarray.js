QUnit.module('FromArray');

var Observable = Rx.Observable,
  TestScheduler = Rx.TestScheduler,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe,
  created = Rx.ReactiveTest.created,
  subscribed = Rx.ReactiveTest.subscribed,
  disposed = Rx.ReactiveTest.disposed;


test('SubscribeToEnumerable_Finite', function () {
  var enumerableFinite = [1, 2, 3, 4, 5];
  
  var scheduler = new TestScheduler();
  
  var results = scheduler.startWithCreate(function () {
    return Observable.fromArray(enumerableFinite, scheduler);
  });

  results.messages.assertEqual(
    onNext(201, 1),
    onNext(202, 2),
    onNext(203, 3),
    onNext(204, 4),
    onNext(205, 5),
    onCompleted(206)
  );
});

test('SubscribeToEnumerable_Empty', function () {
  var enumerableFinite = [];
  
  var scheduler = new TestScheduler();
  
  var results = scheduler.startWithCreate(function () {
    return Observable.fromArray(enumerableFinite, scheduler);
  });

  results.messages.assertEqual(
    onCompleted(201)
  );
});