QUnit.module('Contains');

var TestScheduler = Rx.TestScheduler,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

test('Contains_Empty', function () {
  var msgs, res, scheduler, xs;
  scheduler = new TestScheduler();
  msgs = [onNext(150, 1), onCompleted(250)];
  xs = scheduler.createHotObservable(msgs);
  res = scheduler.startWithCreate(function () {
      return xs.contains(42);
  }).messages;
  res.assertEqual(onNext(250, false), onCompleted(250));
});
test('Contains_ReturnPositive', function () {
  var msgs, res, scheduler, xs;
  scheduler = new TestScheduler();
  msgs = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
  xs = scheduler.createHotObservable(msgs);
  res = scheduler.startWithCreate(function () {
      return xs.contains(2);
  }).messages;
  res.assertEqual(onNext(210, true), onCompleted(210));
});

test('Contains_ReturnNegative', function () {
  var msgs, res, scheduler, xs;
  scheduler = new TestScheduler();
  msgs = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
  xs = scheduler.createHotObservable(msgs);
  res = scheduler.startWithCreate(function () {
      return xs.contains(-2);
  }).messages;
  res.assertEqual(onNext(250, false), onCompleted(250));
});

test('Contains_SomePositive', function () {
  var msgs, res, scheduler, xs;
  scheduler = new TestScheduler();
  msgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(250)];
  xs = scheduler.createHotObservable(msgs);
  res = scheduler.startWithCreate(function () {
      return xs.contains(3);
  }).messages;
  res.assertEqual(onNext(220, true), onCompleted(220));
});
test('Contains_SomeNegative', function () {
  var msgs, res, scheduler, xs;
  scheduler = new TestScheduler();
  msgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(250)];
  xs = scheduler.createHotObservable(msgs);
  res = scheduler.startWithCreate(function () {
      return xs.contains(-3);
  }).messages;
  res.assertEqual(onNext(250, false), onCompleted(250));
});

test('Contains_Throw', function () {
  var ex, res, scheduler, xs;
  ex = 'ex';
  scheduler = new TestScheduler();
  xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
  res = scheduler.startWithCreate(function () {
      return xs.contains(42);
  }).messages;
  res.assertEqual(onError(210, ex));
});

test('Contains_Never', function () {
  var msgs, res, scheduler, xs;
  scheduler = new TestScheduler();
  msgs = [onNext(150, 1)];
  xs = scheduler.createHotObservable(msgs);
  res = scheduler.startWithCreate(function () {
      return xs.contains(42);
  }).messages;
  res.assertEqual();
});

