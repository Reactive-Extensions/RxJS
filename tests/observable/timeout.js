QUnit.module('Timeout');

var Observable = Rx.Observable,
  TestScheduler = Rx.TestScheduler,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

test('Timeout_InTime', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(230, 3), 
    onNext(260, 4), 
    onNext(300, 5), 
    onNext(350, 6), 
    onCompleted(400)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.timeout(500, null, scheduler);
  });

  results.messages.assertEqual(
    onNext(210, 2), 
    onNext(230, 3), 
    onNext(260, 4), 
    onNext(300, 5), 
    onNext(350, 6), 
    onCompleted(400)
  );
});

test('Timeout_TimeSpan_TimeoutOccurs_WithDefaultException', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(410, 1)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.timeout(200, null, scheduler);
  });

  results.messages.assertEqual(
    onError(400, function (e) { return e.exception.message === 'Timeout'})
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 400)
  );
});

test('Timeout_TimeSpan_TimeoutOccurs_WithCustomtException', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(410, 1)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.timeout(200, 'Timeout has occurred', scheduler);
  });

  results.messages.assertEqual(
    onError(400, function (e) { return e.exception.message === 'Timeout has occurred'})
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 400)
  );
});

test('Timeout_Date_TimeoutOccurs_WithDefaultException', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(410, 1)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.timeout(new Date(400), null, scheduler);
  });

  results.messages.assertEqual(
    onError(400, function (e) { return e.exception.message === 'Timeout'})
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 400)
  );
});

test('Timeout_Date_TimeoutOccurs_WithCustomtException', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(410, 1)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.timeout(new Date(400), 'Timeout has occurred', scheduler);
  });

  results.messages.assertEqual(
    onError(400, function (e) { return e.exception.message === 'Timeout has occurred'})
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 400)
  );
});

test('Timeout_OutOfTime', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onNext(210, 2), 
    onNext(230, 3), 
    onNext(260, 4), 
    onNext(300, 5), 
    onNext(350, 6), 
    onCompleted(400)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.timeout(205, null, scheduler);
  });

  results.messages.assertEqual(
    onNext(210, 2), 
    onNext(230, 3), 
    onNext(260, 4), 
    onNext(300, 5), 
    onNext(350, 6), 
    onCompleted(400)
  );
});

test('Timeout_TimeoutOccurs_1', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(70, 1), 
    onNext(130, 2), 
    onNext(310, 3), 
    onNext(400, 4), 
    onCompleted(500)
  );

  var ys = scheduler.createColdObservable(
    onNext(50, -1), 
    onNext(200, -2), 
    onNext(310, -3), 
    onCompleted(320)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.timeout(100, ys, scheduler);
  });

  results.messages.assertEqual(
    onNext(350, -1), 
    onNext(500, -2), 
    onNext(610, -3), 
    onCompleted(620)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 300)
  );

  ys.subscriptions.assertEqual(
    subscribe(300, 620)
  );
});

test('Timeout_TimeoutOccurs_2', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(70, 1), 
    onNext(130, 2), 
    onNext(240, 3), 
    onNext(310, 4), 
    onNext(430, 5), 
    onCompleted(500)
  );

  var ys = scheduler.createColdObservable(
    onNext(50, -1), 
    onNext(200, -2), 
    onNext(310, -3), 
    onCompleted(320)
  );
  
  var results = scheduler.startWithCreate(function () {
    return xs.timeout(100, ys, scheduler);
  });

  results.messages.assertEqual(
    onNext(240, 3), 
    onNext(310, 4), 
    onNext(460, -1), 
    onNext(610, -2), 
    onNext(720, -3), 
    onCompleted(730)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 410)
  );

  ys.subscriptions.assertEqual(
    subscribe(410, 730)
  );
});

test('Timeout_TimeoutOccurs_Never', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(70, 1), 
    onNext(130, 2), 
    onNext(240, 3), 
    onNext(310, 4), 
    onNext(430, 5), 
    onCompleted(500)
  );

  var ys = scheduler.createColdObservable();

  var results = scheduler.startWithCreate(function () {
    return xs.timeout(100, ys, scheduler);
  });

  results.messages.assertEqual(
    onNext(240, 3), 
    onNext(310, 4)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 410)
  );

  ys.subscriptions.assertEqual(
    subscribe(410, 1000)
  );
});

test('Timeout_TimeoutOccurs_Completed', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onCompleted(500)
  );

  var ys = scheduler.createColdObservable(
    onNext(100, -1)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.timeout(100, ys, scheduler);
  });

  results.messages.assertEqual(
    onNext(400, -1)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 300)
  );

  ys.subscriptions.assertEqual(
    subscribe(300, 1000)
  );
});

test('Timeout_TimeoutOccurs_Error', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onError(500, new Error())
  );

  var ys = scheduler.createColdObservable(
    onNext(100, -1)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.timeout(100, ys, scheduler);
  });

  results.messages.assertEqual(
    onNext(400, -1)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 300)
  );

  ys.subscriptions.assertEqual(
    subscribe(300, 1000)
  );
});

test('Timeout_TimeoutNotOccurs_Completed', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onCompleted(250)
  );

  var ys = scheduler.createColdObservable(
    onNext(100, -1)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.timeout(100, ys, scheduler);
  });

  results.messages.assertEqual(
    onCompleted(250)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 250)
  );

  ys.subscriptions.assertEqual();
});

test('Timeout_TimeoutNotOccurs_Error', function () {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onError(250, error)
  );

  var ys = scheduler.createColdObservable(
    onNext(100, -1)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.timeout(100, ys, scheduler);
  });

  results.messages.assertEqual(
    onError(250, error)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 250)
  );

  ys.subscriptions.assertEqual();
});

test('Timeout_TimeoutDoesNotOccur', function () {
  var scheduler = new TestScheduler();
  var xs = scheduler.createHotObservable(
    onNext(70, 1), 
    onNext(130, 2), 
    onNext(240, 3), 
    onNext(320, 4), 
    onNext(410, 5), 
    onCompleted(500)
  );

  var ys = scheduler.createColdObservable(
    onNext(50, -1), 
    onNext(200, -2), 
    onNext(310, -3), 
    onCompleted(320)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.timeout(100, ys, scheduler);
  });

  results.messages.assertEqual(
    onNext(240, 3), 
    onNext(320, 4), 
    onNext(410, 5), 
    onCompleted(500)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 500)
  );

  ys.subscriptions.assertEqual();
});

test('Timeout_DateTimeOffset_TimeoutOccurs', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(410, 1)
  );

  var ys = scheduler.createColdObservable(
    onNext(100, -1)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.timeout(new Date(400), ys, scheduler);
  });

  results.messages.assertEqual(
    onNext(500, -1)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 400)
  );

  ys.subscriptions.assertEqual(subscribe(400, 1000));
});

test('Timeout_DateTimeOffset_TimeoutDoesNotOccur_Completed', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(310, 1), 
    onCompleted(390)
  );

  var ys = scheduler.createColdObservable(
    onNext(100, -1)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.timeout(new Date(400), ys, scheduler);
  });

  results.messages.assertEqual(
    onNext(310, 1), onCompleted(390)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 390)
  );

  ys.subscriptions.assertEqual();
});

test('Timeout_DateTimeOffset_TimeoutDoesNotOccur_Error', function () {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(310, 1), 
    onError(390, error)
  );

  var ys = scheduler.createColdObservable(
    onNext(100, -1)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.timeout(new Date(400), ys, scheduler);
  });

  results.messages.assertEqual(
    onNext(310, 1), 
    onError(390, error)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 390)
  );

  ys.subscriptions.assertEqual();
});

test('Timeout_DateTimeOffset_TimeoutOccur_2', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(310, 1), 
    onNext(350, 2), 
    onNext(420, 3), 
    onCompleted(450)
  );

  var ys = scheduler.createColdObservable(
    onNext(100, -1)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.timeout(new Date(400), ys, scheduler);
  });

  results.messages.assertEqual(
    onNext(310, 1), 
    onNext(350, 2), 
    onNext(500, -1)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 400)
  );

  ys.subscriptions.assertEqual(
    subscribe(400, 1000)
  );
});

test('Timeout_DateTimeOffset_TimeoutOccur_3', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(310, 1), 
    onNext(350, 2), 
    onNext(420, 3), 
    onCompleted(450)
  );

  var ys = scheduler.createColdObservable();

  var results = scheduler.startWithCreate(function () {
    return xs.timeout(new Date(400), ys, scheduler);
  });

  results.messages.assertEqual(
    onNext(310, 1), 
    onNext(350, 2)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 400)
  );

  ys.subscriptions.assertEqual(
    subscribe(400, 1000)
  );
});
