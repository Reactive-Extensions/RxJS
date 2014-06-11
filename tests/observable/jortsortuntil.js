QUnit.module('Jort Sort Until');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('jortSortUntil never never', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 1)
  );

  var ys = scheduler.createHotObservable(
    onNext(190, 1)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.jortSortUntil(ys);
  });

  results.messages.assertEqual();
});

// TODO: Is empty really sorted or is it a headfake?
test('jortSortUntil empty never', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onCompleted(250)
  );

  var ys = scheduler.createHotObservable(
    onNext(190, 1)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.jortSortUntil(ys);
  });

  results.messages.assertEqual(
    onNext(true),
    onCompleted(250)
  );
});

test('jortSortUntil error never', function () {
  var scheduler = new TestScheduler();
  var error = new Error();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onError(250, error)
  );

  var ys = scheduler.createHotObservable(
    onNext(190, 1)
  );  

  var results = scheduler.startWithCreate(function () {
    return xs.jortSortUntil(ys);
  });

  results.messages.assertEqual(
    onError(250, error)
  );
});

test('jortSortUntil error empty', function () {
  var scheduler = new TestScheduler();
  var error = new Error();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 2)
    onError(250, error)
  );

  var ys = scheduler.createHotObservable(
    onNext(190, 1)
  );  

  var results = scheduler.startWithCreate(function () {
    return xs.jortSortUntil(ys);
  });

  results.messages.assertEqual(
    onError(250, error)
  );
});

test('jortSortUntil error pre-empted', function () {
  var scheduler = new TestScheduler();
  var error = new Error();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onError(250, error)
  );

  var ys = scheduler.createHotObservable(
    onNext(190, 1),
    onNext(245, 2),
    onCompleted(255)
  );  

  var results = scheduler.startWithCreate(function () {
    return xs.jortSortUntil(ys);
  });

  results.messages.assertEqual(
    onNext(245, true);
    onCompleted(245)
  );
});

test('jortSortUntil pre-empted true', function () {
  var scheduler = new TestScheduler();
  var error = new Error();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var ys = scheduler.createHotObservable(
    onNext(190, 1),
    onNext(245, 2),
    onCompleted(255)
  );  

  var results = scheduler.startWithCreate(function () {
    return xs.jortSortUntil(ys);
  });

  results.messages.assertEqual(
    onNext(245, true);
    onCompleted(245)
  );
});


test('jortSortUntil pre-empted false', function () {
  var scheduler = new TestScheduler();
  var error = new Error();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 4),
    onNext(220, 3),
    onNext(230, 2),
    onNext(240, 5),
    onCompleted(250)
  );

  var ys = scheduler.createHotObservable(
    onNext(190, 1),
    onNext(245, 2),
    onCompleted(255)
  );  

  var results = scheduler.startWithCreate(function () {
    return xs.jortSortUntil(ys);
  });

  results.messages.assertEqual(
    onNext(245, false);
    onCompleted(245)
  );
});

test('jortSortUntil not pre-empted true', function () {
  var scheduler = new TestScheduler();
  var error = new Error();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5),
    onCompleted(250)
  );

  var ys = scheduler.createHotObservable(
    onNext(190, 1),
    onNext(255, 2),
    onCompleted(265)
  );  

  var results = scheduler.startWithCreate(function () {
    return xs.jortSortUntil(ys);
  });

  results.messages.assertEqual(
    onNext(250, true);
    onCompleted(250)
  );
});


test('jortSortUntil not pre-empted false', function () {
  var scheduler = new TestScheduler();
  var error = new Error();

  var xs = scheduler.createHotObservable(
    onNext(180, 1),
    onNext(210, 4),
    onNext(220, 3),
    onNext(230, 2),
    onNext(240, 5),
    onCompleted(250)
  );

  var ys = scheduler.createHotObservable(
    onNext(190, 1),
    onNext(255, 2),
    onCompleted(265)
  );   

  var results = scheduler.startWithCreate(function () {
    return xs.jortSortUntil(ys);
  });

  results.messages.assertEqual(
    onNext(250, false);
    onCompleted(250)
  );
});