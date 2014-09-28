QUnit.module('Do');

var Observable = Rx.Observable,
  TestScheduler = Rx.TestScheduler,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

function noop () { }

test('Do_ShouldSeeAllValues', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onNext(230, 4), 
    onNext(240, 5), 
    onCompleted(250)
  );
  
  var i = 0;
  var sum = 2 + 3 + 4 + 5;
  
  scheduler.startWithCreate(function () {
    return xs.tap(function (x) { i++; return sum -= x; });
  });

  equal(4, i);
  equal(0, sum);
});

test('Do_PlainAction', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onNext(230, 4), 
    onNext(240, 5), 
    onCompleted(250)
  );
  
  var i = 0;
  
  scheduler.startWithCreate(function () {
    return xs.tap(function (x) { return i++; });
  });
  
  equal(4, i);
});

test('Do_NextCompleted', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onNext(230, 4), 
    onNext(240, 5), 
    onCompleted(250)
  );
  
  var i = 0;
  var sum = 2 + 3 + 4 + 5;
  var completed = false;

  scheduler.startWithCreate(function () {
    return xs.tap(function (x) { i++; sum -= x; }, null, function () { completed = true; });
  });

  equal(4, i);
  equal(0, sum);
  ok(completed);
});

test('Do_NextCompleted_Never', function () {
  var scheduler = new TestScheduler();
  
  var i = 0;
  var completed = false;
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  scheduler.startWithCreate(function () {
    return xs.tap(function (x) { i++; }, null, function () { completed = true; });
  });

  equal(0, i);
  ok(!completed);
});

test('Do_NextError', function () {
  var error = new Error();
  
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onNext(230, 4), 
    onNext(240, 5), 
    onError(250, error)
  );
  
  var i = 0;
  var sum = 2 + 3 + 4 + 5;
  var sawError = false;
  
  scheduler.startWithCreate(function () {
    return xs.tap(function (x) { i++; sum -= x; }, function (e) { sawError = e === error; });
  });

  equal(4, i);
  equal(0, sum);
  ok(sawError);
});

test('Do_NextErrorNot', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onNext(230, 4), 
    onNext(240, 5), 
    onCompleted(250)
  );
  
  var i = 0;
  var sum = 2 + 3 + 4 + 5;
  var sawError = false;
  
  scheduler.startWithCreate(function () {
    return xs.tap(function (x) { i++; sum -= x; }, function () { sawError = true; });
  });

  equal(4, i);
  equal(0, sum);
  ok(!sawError);
});

test('Do_NextErrorCompleted', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onNext(230, 4), 
    onNext(240, 5), onCompleted(250)
  );
  
  var i = 0;
  var sum = 2 + 3 + 4 + 5;
  var sawError = false;
  var hasCompleted = false;
  
  scheduler.startWithCreate(function () {
    return xs.tap(function (x) { i++; sum -= x; }, function () { sawError = true; }, function () { hasCompleted = true; });
  });

  equal(4, i);
  equal(0, sum);
  ok(!sawError);
  ok(hasCompleted);
});

test('Do_NextErrorCompletedError', function () {
  var error = new Error();
  
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onNext(230, 4), 
    onNext(240, 5), 
    onError(250, error)
  );
  
  var i = 0;
  var sum = 2 + 3 + 4 + 5;
  var sawError = false;
  var hasCompleted = false;
  
  scheduler.startWithCreate(function () {
    return xs.tap(function (x) { i++; sum -= x; }, function () { sawError = true; }, function () { hasCompleted = true; });
  });

  equal(4, i);
  equal(0, sum);
  ok(sawError);
  ok(!hasCompleted);
});

test('Do_NextErrorCompletedNever', function () {
  var scheduler = new TestScheduler();
  
  var i = 0;
  var sawError = false;
  var hasCompleted = false;

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  scheduler.startWithCreate(function () {
    return xs.tap(function (x) { i++; }, function () { sawError = true; }, function () { hasCompleted = true; });
  });

  equal(0, i);
  ok(!sawError);
  ok(!hasCompleted);
});

test('Do_Observer_SomeDataWithError', function () {
  var error = new Error();

  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onNext(230, 4), 
    onNext(240, 5), 
    onError(250, error)
  );
  
  var i = 0;
  var sum = 2 + 3 + 4 + 5;
  var sawError = false;
  var hasCompleted = false;
  
  scheduler.startWithCreate(function () {
    return xs.tap(Rx.Observer.create(function (x) { i++; sum -= x; }, function (e) { sawError = e === error; }, function () { hasCompleted = true; }));
  });

  equal(4, i);
  equal(0, sum);
  ok(sawError);
  ok(!hasCompleted);
});

test('Do_Observer_SomeDataWithError', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(220, 3), 
    onNext(230, 4), 
    onNext(240, 5), 
    onCompleted(250)
  );
  
  var i = 0;
  var sum = 2 + 3 + 4 + 5;
  var sawError = false;
  var hasCompleted = false;
  
  scheduler.startWithCreate(function () {
    return xs.tap(Rx.Observer.create(function (x) { i++; sum -= x; }, function () { sawError = true; }, function () { hasCompleted = true; }));
  });

  equal(4, i);
  equal(0, sum);
  ok(!sawError);
  ok(hasCompleted);
});

test('Do1422_Next_NextThrows', function () {
  var error = new Error();

  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.tap(function () { throw error; });
  });

  results.messages.assertEqual(
    onError(210, error)
  );
});

test('Do1422_NextCompleted_NextThrows', function () {
  var error = new Error();
  var scheduler = new TestScheduler();
  var xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
  var results = scheduler.startWithCreate(function () {
    return xs.tap(function () { throw error; }, null, noop);
  });
  results.messages.assertEqual(onError(210, error));
});

test('Do1422_NextCompleted_CompletedThrows', function () {
  var error = new Error();
  
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
      return xs.tap(noop, null, function () { throw error; });
  });

  results.messages.assertEqual(
    onNext(210, 2), 
    onError(250, error)
  );
});

test('Do1422_NextError_NextThrows', function () {
  var error = new Error();

  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.tap(function () { throw error; }, noop);
  });

  results.messages.assertEqual(onError(210, error));
});

test('Do1422_NextError_NextThrows', function () {
  var error1 = new Error();
  var error2 = new Error();

  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onError(210, error1)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.tap(noop, function () { throw error2; });
  });

  results.messages.assertEqual(
    onError(210, error2)
  );
});

test('Do1422_NextErrorCompleted_NextThrows', function () {
  var error = new Error();
  
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.tap(function () { throw error; }, noop, noop);
  });
  
  results.messages.assertEqual(
    onError(210, error)
  );
});

test('Do1422_NextErrorCompleted_ErrorThrows', function () {
  var error1 = new Error();
  var error2 = new Error();

  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onError(210, error1)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.tap(noop, function () { throw error2; }, noop);
  });

  results.messages.assertEqual(
    onError(210, error2)
  );
});

test('Do1422_NextErrorCompleted_CompletedThrows', function () {
  var error = new Error();
  
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.tap(noop, noop, function () { throw error; });
  });

  results.messages.assertEqual(
    onNext(210, 2), 
    onError(250, error)
  );
});

test('Do1422_Observer_NextThrows', function () {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.tap(Rx.Observer.create(function () { throw error;  }, noop, noop));
  });

  results.messages.assertEqual(
    onError(210, error)
  );
});

test('Do1422_Observer_ErrorThrows', function () {
  var error1 = new Error();
  var error2 = new Error();
  
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onError(210, error1)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.tap(Rx.Observer.create(noop, function () { throw error2; }, noop));
  });

  results.messages.assertEqual(
    onError(210, error2)
  );
});

test('Do1422_Observer_CompletedThrows', function () {
  var error = new Error();
  
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onCompleted(250)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.tap(Rx.Observer.create(noop, noop, function () { throw error; }));
  });

  results.messages.assertEqual(
    onNext(210, 2), 
    onError(250, error)
  );
});

test('doNext no thisArg', function () {
  var scheduler = new TestScheduler();

  var self = this, that;

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onCompleted(250)
  );

  scheduler.startWithCreate(function () {
    return xs.doNext(function () { that = this; });
  });

  notEqual(that, self);
});

test('doNext thisArg', function () {
  var scheduler = new TestScheduler();

  var self = 42, that;

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onCompleted(250)
  );

  scheduler.startWithCreate(function () {
    return xs.doNext(function () { that = this; }, self);
  });

  equal(that, self);
});

test('doError no thisArg', function () {
  var scheduler = new TestScheduler();

  var self = this, that;

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onError(210, new Error())
  );

  scheduler.startWithCreate(function () {
    return xs.doError(function () { that = this; });
  });

  notEqual(that, self);
});

test('doError thisArg', function () {
  var scheduler = new TestScheduler();

  var self = 42, that;

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onError(210, new Error())
  );

  scheduler.startWithCreate(function () {
    return xs.doError(function () { that = this; }, self);
  });

  equal(that, self);
});

test('doCompleted no thisArg', function () {
  var scheduler = new TestScheduler();

  var self = this, that;

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onCompleted(250)
  );

  scheduler.startWithCreate(function () {
    return xs.doCompleted(function () { that = this; });
  });

  notEqual(that, self);
});

test('doCompleted thisArg', function () {
  var scheduler = new TestScheduler();

  var self = 42, that;

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onCompleted(250)
  );


  scheduler.startWithCreate(function () {
    return xs.doCompleted(function () { that = this; }, self);
  });

  equal(that, self);
});