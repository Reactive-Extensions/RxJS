QUnit.module('Last');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;


// Last
test('LastAsync_Empty', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onCompleted(250)
  );
  
  var res = scheduler.startWithCreate(function () {
    return xs.last();
  });
  
  ok(res.messages[0].time === 250 && res.messages[0].value.exception !== null);
  
  xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('LastAsync_One', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onCompleted(250)
  );
  
  var res = scheduler.startWithCreate(function () {
    return xs.last();
  });
  
  res.messages.assertEqual(
    onNext(250, 2), 
    onCompleted(250)
  );
  
  xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('LastAsync_Many', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onCompleted(250)
  );
  
  var res = scheduler.startWithCreate(function () {
    return xs.last();
  });
  
  res.messages.assertEqual(
    onNext(250, 3), 
    onCompleted(250)
  );
  
  xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('LastAsync_Error', function () {
  var ex = new Error();
  
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onError(210, ex)
  );
  
  var res = scheduler.startWithCreate(function () {
    return xs.last();
  });
  
  res.messages.assertEqual(onError(210, ex));
  
  xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('LastAsync_Predicate', function () {
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
    return xs.last(function (x) {
      return x % 2 === 1;
    });
  });

  res.messages.assertEqual(
    onNext(250, 5), 
    onCompleted(250)
  );
  
  xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('LastAsync_Predicate_None', function () {
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
    return xs.last(function (x) {
      return x > 10;
    });
  });
  
  ok(res.messages[0].time === 250 && res.messages[0].value.exception !== null);
  
  xs.subscriptions.assertEqual(subscribe(200, 250));
});

test('LastAsync_Predicate_Throw', function () {
  var ex = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onError(210, ex)
  );
  
  var res = scheduler.startWithCreate(function () {
    return xs.last(function (x) {
      return x % 2 === 1;
    });
  });
  
  res.messages.assertEqual(onError(210, ex));
  
  xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('LastAsync_PredicateThrows', function () {
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
    return xs.last(function (x) {
      if (x < 4) {
        return x % 2 === 1;
      } else {
        throw ex;
      }
    });
  });
  
  res.messages.assertEqual(onError(230, ex));
  
  xs.subscriptions.assertEqual(subscribe(200, 230));
});