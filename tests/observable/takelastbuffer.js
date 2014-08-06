QUnit.module('TakeLastBuffer');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('TakeLastBuffer_Zero_Completed', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(180, 1), 
    onNext(210, 2), 
    onNext(250, 3), 
    onNext(270, 4), 
    onNext(310, 5), 
    onNext(360, 6), 
    onNext(380, 7), 
    onNext(410, 8), 
    onNext(590, 9), 
    onCompleted(650)
  );
  
  var res = scheduler.startWithCreate(function () {
      return xs.takeLastBuffer(0);
  });

  res.messages.assertEqual(
    onNext(650, []), 
    onCompleted(650)
  );

  xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLastBuffer_Zero_Error', function () {
  var ex = new Error();

  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(180, 1), 
    onNext(210, 2), 
    onNext(250, 3), 
    onNext(270, 4), 
    onNext(310, 5), 
    onNext(360, 6), 
    onNext(380, 7), 
    onNext(410, 8), 
    onNext(590, 9), 
    onError(650, ex)
  );
  
  var res = scheduler.startWithCreate(function () {
    return xs.takeLastBuffer(0);
  });

  res.messages.assertEqual(onError(650, ex));
  
  xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLastBuffer_Zero_Disposed', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(180, 1), 
    onNext(210, 2), 
    onNext(250, 3), 
    onNext(270, 4), 
    onNext(310, 5), 
    onNext(360, 6), 
    onNext(380, 7), 
    onNext(410, 8), 
    onNext(590, 9)
  );
  
  var res = scheduler.startWithCreate(function () {
    return xs.takeLastBuffer(0);
  });
  
  res.messages.assertEqual();
  
  xs.subscriptions.assertEqual(subscribe(200, 1000));
});

test('TakeLastBuffer_One_Completed', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(180, 1), 
    onNext(210, 2), 
    onNext(250, 3), 
    onNext(270, 4), 
    onNext(310, 5), 
    onNext(360, 6), 
    onNext(380, 7), 
    onNext(410, 8), 
    onNext(590, 9), 
    onCompleted(650)
  );
  
  var res = scheduler.startWithCreate(function () {
    return xs.takeLastBuffer(1);
  });

  res.messages.assertEqual(
    onNext(650, [9]), 
    onCompleted(650)
  );
  
  xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLastBuffer_One_Error', function () {
  var ex = new Error();

  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(180, 1), 
    onNext(210, 2), 
    onNext(250, 3), 
    onNext(270, 4), 
    onNext(310, 5), 
    onNext(360, 6), 
    onNext(380, 7), 
    onNext(410, 8), 
    onNext(590, 9), 
    onError(650, ex)
  );
  
  var res = scheduler.startWithCreate(function () {
      return xs.takeLastBuffer(1);
  });
  
  res.messages.assertEqual(onError(650, ex));
  
  xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLastBuffer_One_Disposed', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 1), 
    onNext(210, 2), 
    onNext(250, 3), 
    onNext(270, 4), 
    onNext(310, 5), 
    onNext(360, 6), 
    onNext(380, 7), 
    onNext(410, 8), 
    onNext(590, 9)
  );
  
  var res = scheduler.startWithCreate(function () {
    return xs.takeLastBuffer(1);
  });
  
  res.messages.assertEqual();
  
  xs.subscriptions.assertEqual(subscribe(200, 1000));
});

test('TakeLastBuffer_Three_Completed', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(180, 1), 
    onNext(210, 2), 
    onNext(250, 3), 
    onNext(270, 4), 
    onNext(310, 5), 
    onNext(360, 6), 
    onNext(380, 7), 
    onNext(410, 8), 
    onNext(590, 9), 
    onCompleted(650)
  );
  
  var res = scheduler.startWithCreate(function () {
    return xs.takeLastBuffer(3);
  });

  res.messages.assertEqual(
    onNext(650, [7, 8, 9]),
    onCompleted(650)
  );

  xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLastBuffer_Three_Error', function () {
  var ex = new Error();
  
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(180, 1), 
    onNext(210, 2), 
    onNext(250, 3), 
    onNext(270, 4), 
    onNext(310, 5), 
    onNext(360, 6), 
    onNext(380, 7), 
    onNext(410, 8), 
    onNext(590, 9), 
    onError(650, ex)
  );
  
  var res = scheduler.startWithCreate(function () {
      return xs.takeLastBuffer(3);
  });

  res.messages.assertEqual(onError(650, ex));
  
  xs.subscriptions.assertEqual(subscribe(200, 650));
});

test('TakeLastBuffer_Three_Disposed', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(180, 1), 
    onNext(210, 2), 
    onNext(250, 3), 
    onNext(270, 4), 
    onNext(310, 5), 
    onNext(360, 6), 
    onNext(380, 7), 
    onNext(410, 8), 
    onNext(590, 9)
  );
  
  var res = scheduler.startWithCreate(function () {
      return xs.takeLastBuffer(3);
  });
  
  res.messages.assertEqual();
  
  xs.subscriptions.assertEqual(subscribe(200, 1000));
});