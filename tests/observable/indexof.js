QUnit.module('IndexOf');

var TestScheduler = Rx.TestScheduler,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

test('indexOf empty', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.indexOf(42);
  });
  
  results.messages.assertEqual(
    onNext(250, -1), 
    onCompleted(250)
  );
});

test('indexOf return positive', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.indexOf(2);
  });

  results.messages.assertEqual(
    onNext(210, 0), 
    onCompleted(210)
  );
});

test('indexOf return negative', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.indexOf(-2);
  });
  
  results.messages.assertEqual(
    onNext(250, -1), 
    onCompleted(250)
  );
});

test('indexOf some positive', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onNext(230, 4), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.indexOf(3);
  });
  
  results.messages.assertEqual(
    onNext(220, 1), 
    onCompleted(220)
  );
});

test('indexOf some negative', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onNext(230, 4), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.indexOf(-3);
  });
  
  results.messages.assertEqual(
    onNext(250, -1), 
    onCompleted(250)
  );
});

test('indexOf throw', function () {
  var error = new Error();

  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onError(210, error)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.indexOf(42);
  });
  
  results.messages.assertEqual(
    onError(210, error)
  );
});

test('indexOf never', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.indexOf(42);
  });

  results.messages.assertEqual();
});

test('indexOf fromIndex less than zero', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.indexOf(42, -1);
  });

  results.messages.assertEqual(
    onNext(200, -1),
    onCompleted(200)
  );
});

test('indexOf fromIndex Infinity', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)    
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.indexOf(2, Infinity);
  });

  results.messages.assertEqual(
    onNext(210, 0),
    onCompleted(210)
  );
});

test('indexOf fromIndex zero', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.indexOf(2, 0);
  });

  results.messages.assertEqual(
    onNext(210, 0),
    onCompleted(210)
  );
});

test('indexOf fromIndex greater than zero misses', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.indexOf(2, 1);
  });

  results.messages.assertEqual(
    onNext(250, -1),
    onCompleted(250)
  );
});

test('indexOf fromIndex greater than zero no end', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.indexOf(2, 1);
  });

  results.messages.assertEqual(
  );
});

test('indexOf fromIndex greater than zero hits', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.indexOf(3, 1);
  });

  results.messages.assertEqual(
    onNext(220, 1),
    onCompleted(220)
  );
});

test('indexOf -0 equals 0', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, -0),
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.indexOf(0);
  });

  results.messages.assertEqual(
    onNext(210, 0),
    onCompleted(210)
  );
});

test('indexOf +0 equals 0', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, +0),
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.indexOf(0);
  });

  results.messages.assertEqual(
    onNext(210, 0),
    onCompleted(210)
  );
});
