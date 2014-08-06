QUnit.module('Scan');

var Observable = Rx.Observable,
  TestScheduler = Rx.TestScheduler,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

test('Scan_Seed_Never', function () {
  var scheduler = new TestScheduler();

  var seed = 42;

  var results = scheduler.startWithCreate(function () {
    return Rx.Observable.never().scan(seed, function (acc, x) {
      return acc + x;
    });
  });

  results.messages.assertEqual();
});

test('Scan_Seed_Empty', function () {
  var scheduler = new TestScheduler();

  var seed = 42;

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onCompleted(250)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.scan(seed, function (acc, x) {
      return acc + x;
    });
  });

  results.messages.assertEqual(
    onNext(250, 42),
    onCompleted(250)
  );
    
});

test('Scan_Seed_Return', function () {
  var scheduler = new TestScheduler();

  var seed = 42;

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(220, 2), 
    onCompleted(250)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.scan(seed, function (acc, x) {
      return acc + x;
    });
  });

  results.messages.assertEqual(
    onNext(220, seed + 2),
    onCompleted(250)
  );
});

test('Scan_Seed_Throw', function () {
  var error = new Error();

  var scheduler = new TestScheduler();
  
  var seed = 42;
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onError(250, error)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.scan(seed, function (acc, x) {
      return acc + x;
    });
  });

  results.messages.assertEqual(
    onError(250, error)
  );
});

test('Scan_Seed_SomeData', function () {
  var scheduler = new TestScheduler();

  var seed = 1;

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onNext(230, 4), 
    onNext(240, 5), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.scan(seed, function (acc, x) {
      return acc + x;
    });
  });

  results.messages.assertEqual(
    onNext(210, seed + 2),
    onNext(220, seed + 2 + 3),
    onNext(230, seed + 2 + 3 + 4),
    onNext(240, seed + 2 + 3 + 4 + 5),
    onCompleted(250)
  );
});

test('Scan_NoSeed_Never', function () {
  var scheduler = new TestScheduler();

  var results = scheduler.startWithCreate(function () {
    return Rx.Observable.never().scan(function (acc, x) {
      return acc + x;
    });
  });

  results.messages.assertEqual();
});

test('Scan_NoSeed_Empty', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
  
  var results = scheduler.startWithCreate(function () {
    return xs.scan(function (acc, x) {
      return acc + x;
    });
  });
  
  results.messages.assertEqual(onCompleted(250));
});

test('Scan_NoSeed_Return', function () {
    var scheduler = new TestScheduler();
    
    var xs = scheduler.createHotObservable(
      onNext(150, 1), 
      onNext(220, 2), 
      onCompleted(250)
    );
    
    var results = scheduler.startWithCreate(function () {
      return xs.scan(function (acc, x) {
        acc === undefined && (acc = 0);
        return acc + x;
      });
    });

    results.messages.assertEqual(
      onNext(220, 2),
      onCompleted(250)
    );
});

test('Scan_NoSeed_Throw', function () {
  var error = new Error();

  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onError(250, error)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.scan(function (acc, x) {
      acc === undefined && (acc = 0);
      return acc + x;
    });
  });

  results.messages.assertEqual(onError(250, error));
});

test('Scan_NoSeed_SomeData', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onNext(230, 4), 
    onNext(240, 5), 
    onCompleted(250));
  
  var results = scheduler.startWithCreate(function () {
    return xs.scan(function (acc, x) {
      acc === undefined && (acc = 0);
      return acc + x;
    });
  });

  results.messages.assertEqual(
    onNext(210, 2),
    onNext(220, 2 + 3),
    onNext(230, 2 + 3 + 4),
    onNext(240, 2 + 3 + 4 + 5),
    onCompleted(250));
});