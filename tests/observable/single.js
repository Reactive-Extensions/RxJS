QUnit.module('Single');

var TestScheduler = Rx.TestScheduler,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

// Single
test('SingleAsync_Empty', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(250));
  
  var res = scheduler.startWithCreate(function () {
    return xs.single();
  });
  
  ok(res.messages[0].time === 250 && res.messages[0].value.exception !== null);
  
  xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('SingleAsync_One', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onCompleted(250)
  );
  
  var res = scheduler.startWithCreate(function () {
    return xs.single();
  });
  
  res.messages.assertEqual(
    onNext(250, 2), 
    onCompleted(250)
  );
  
  xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('SingleAsync_Many', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onCompleted(250)
  );
  
  var res = scheduler.startWithCreate(function () {
    return xs.single();
  });
  
  ok(res.messages[0].time === 220 && res.messages[0].value.exception !== null);
  
  xs.subscriptions.assertEqual(subscribe(200, 220));
});

test('SingleAsync_Error', function () {
  var ex = new Error();
  
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onError(210, ex)
  );
  
  var res = scheduler.startWithCreate(function () {
    return xs.single();
  });

  res.messages.assertEqual(onError(210, ex));
  
  xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('SingleAsync_Predicate', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onNext(230, 4), 
    onNext(240, 5), 
    onCompleted(250)
  );
  
  var res = scheduler.startWithCreate(function () {
    return xs.single(function (x) {
      return x % 2 === 1;
    });
  });
  
  ok(res.messages[0].time === 240 && res.messages[0].value.exception !== null);
  
  xs.subscriptions.assertEqual(subscribe(200, 240));
});

test('SingleAsync_Predicate_Empty', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
  
  var res = scheduler.startWithCreate(function () {
    return xs.single(function (x) {
      return x % 2 === 1;
    });
  });
  
  ok(res.messages[0].time === 250 && res.messages[0].value.exception !== null);
  
  xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('SingleAsync_Predicate_One', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onNext(230, 4), 
    onNext(240, 5), 
    onCompleted(250)
  );
  
  var res = scheduler.startWithCreate(function () {
    return xs.single(function (x) {
      return x === 4;
    });
  });
  
  res.messages.assertEqual(
    onNext(250, 4), 
    onCompleted(250)
  );

  xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('SingleAsync_Predicate_Throw', function () {
  var ex = new Error();
  
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onError(210, ex)
  );
  
  var res = scheduler.startWithCreate(function () {
    return xs.single(function (x) {
      return x > 10;
    });
  });
  
  res.messages.assertEqual(onError(210, ex));
  
  xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('SingleAsync_PredicateThrows', function () {
  var ex = new Error();
  
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onNext(230, 4), 
    onNext(240, 5), 
    onCompleted(250)
  );
  
  var res = scheduler.startWithCreate(function () {
    return xs.single(function (x) {
      if (x < 4) {
        return false;
      } else {
        throw ex;
      }
    });
  });
  
  res.messages.assertEqual(onError(230, ex));
  
  xs.subscriptions.assertEqual(subscribe(200, 230));
});