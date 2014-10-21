QUnit.module('Transduce');

var TestScheduler = Rx.TestScheduler,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe,
  t = transducers;

function even (x) { return x % 2 === 0; }
function mul10(x) { return x * 10; }

test('transduce never', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.transduce(t.comp(t.filter(even), t.map(mul10)));
  });

  results.messages.assertEqual();
});

test('transduce empty', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onCompleted(250)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.transduce(t.comp(t.filter(even), t.map(mul10)));
  });  

  results.messages.assertEqual(
    onCompleted(250)
  );
});

test('transduce some', function () {
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
    return xs.transduce(t.comp(t.filter(even), t.map(mul10)));
  });  

  results.messages.assertEqual(
    onNext(210, 20),
    onNext(230, 40),
    onCompleted(250)
  );
});

test('transduce error', function () {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1), 
    onError(210, error)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.transduce(t.comp(t.filter(even), t.map(mul10)));
  });

  results.messages.assertEqual(
    onError(210, error)
  );
});

test('transduce throw', function () {
  var error = new Error();

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
  var evenFilter = function (x) {
    if (i++ > 2) { throw error; } else { return x % 2 === 0; }
  };

  var results = scheduler.startWithCreate(function () {
    return xs.transduce(t.comp(t.filter(even), t.map(mul10)));
  });

  results.messages.assertEqual(
    onNext(210, 20),
    onNext(230, 40),
    onError(240, error)
  );
});