QUnit.module('TakeLastBufferWithTime');

var Observable = Rx.Observable,
  TestScheduler = Rx.TestScheduler,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

// TakeLastBuffer
test('takeLastBufferWithTime_Zero1', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.takeLastBufferWithTime(0, scheduler);
  });

  res.messages.assertEqual(
    onNext(230, []),
    onCompleted(230));

  xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('takeLastBufferWithTime_Zero2', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onCompleted(230)
  );

  var res = scheduler.startWithCreate(function () {
      return xs.takeLastBufferWithTime(0, scheduler);
  });

  res.messages.assertEqual(
    onNext(230, []),
    onCompleted(230)
  );

  xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('takeLastBufferWithTime_Some1', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onCompleted(240)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.takeLastBufferWithTime(25, scheduler);
  });

  res.messages.assertEqual(
    onNext(240, [2,3]),
    onCompleted(240)
  );

  xs.subscriptions.assertEqual(subscribe(200, 240));
});

test('takeLastBufferWithTime_Some2', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onCompleted(300)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.takeLastBufferWithTime(25, scheduler);
  });

  res.messages.assertEqual(
    onNext(300, []),
    onCompleted(300)
  );

  xs.subscriptions.assertEqual(subscribe(200, 300));
});

test('takeLastBufferWithTime_Some3', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onNext(240, 4),
    onNext(250, 5),
    onNext(260, 6),
    onNext(270, 7),
    onNext(280, 8),
    onNext(290, 9),
    onCompleted(300)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.takeLastBufferWithTime(45, scheduler);
  });

  res.messages.assertEqual(
    onNext(300, [6,7,8,9]),
    onCompleted(300)
  );

  xs.subscriptions.assertEqual(subscribe(200, 300));
});

test('takeLastBufferWithTime_Some4', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(240, 2),
    onNext(250, 3),
    onNext(280, 4),
    onNext(290, 5),
    onNext(300, 6),
    onCompleted(350)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.takeLastBufferWithTime(25, scheduler);
  });

  res.messages.assertEqual(
    onNext(350, []),
    onCompleted(350)
  );

  xs.subscriptions.assertEqual(subscribe(200, 350));
});

test('takeLastBufferWithTime_All', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onCompleted(230)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.takeLastBufferWithTime(50, scheduler);
  });

  res.messages.assertEqual(
    onNext(230, [1,2]),
    onCompleted(230)
  );

  xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('takeLastBufferWithTime_Error', function () {
  var scheduler = new TestScheduler();

  var ex = new Error();

  var xs = scheduler.createHotObservable(onError(210, ex));

  var res = scheduler.startWithCreate(function () {
    return xs.takeLastBufferWithTime(50, scheduler);
  });

  res.messages.assertEqual(onError(210, ex));

  xs.subscriptions.assertEqual(subscribe(200, 210));
});

test('takeLastBufferWithTime_Never', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable();

  var res = scheduler.startWithCreate(function () {
    return xs.takeLastBufferWithTime(50, scheduler);
  });

  res.messages.assertEqual();

  xs.subscriptions.assertEqual(subscribe(200, 1000));
});
