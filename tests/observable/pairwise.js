QUnit.module('pairwise');

var TestScheduler = Rx.TestScheduler,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

test('pairwise_empty', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5), 
    onCompleted(210)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.pairwise();
  });

  results.messages.assertEqual(
    onCompleted(210)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 210)
  );
});

test('pairwise_single', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5), 
    onNext(210, 4), 
    onCompleted(220)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.pairwise();
  });

  results.messages.assertEqual(
    onCompleted(220)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 220)
  );  
});

test('pairwise_completed', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5), 
    onNext(210, 4), 
    onNext(240, 3), 
    onNext(290, 2), 
    onNext(350, 1),
    onCompleted(360)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.pairwise();
  });

  results.messages.assertEqual(
    onNext(240, [4,3]),
    onNext(290, [3, 2]),
    onNext(350, [2, 1]),
    onCompleted(360)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 360)
  );  
});

test('pairwise_not_completed', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5), 
    onNext(210, 4), 
    onNext(240, 3), 
    onNext(290, 2), 
    onNext(350, 1)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.pairwise();
  });

  results.messages.assertEqual(
    onNext(240, [4,3]),
    onNext(290, [3, 2]),
    onNext(350, [2, 1])
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 1000)
  );    
});

test('pairwise_error', function () {
  var error = new Error();
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5), 
    onNext(210, 4), 
    onNext(240, 3), 
    onError(290, error), 
    onNext(350, 1),
    onCompleted(360)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.pairwise();
  });

  results.messages.assertEqual(
    onNext(240, [4,3]),
    onError(290, error)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 290)
  );    
});

test('pairwise_disposed', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 5), 
    onNext(210, 4), 
    onNext(240, 3), 
    onNext(290, 2), 
    onNext(350, 1),
    onCompleted(360)
  );

  var results = scheduler.startWithDispose(function () {
    return xs.pairwise();
  }, 280);

  results.messages.assertEqual(
    onNext(240, [4,3])
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 280)
  );    
});