QUnit.module('Throw');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

function noop () { }

test('Throw_Basic', function () {
  var scheduler = new TestScheduler();

  var error = new Error();

  var results = scheduler.startWithCreate(function () {
    return Observable.throwError(error, scheduler);
  });

  results.messages.assertEqual(
    onError(201, error));
});

test('Throw_Disposed', function () {
  var scheduler = new TestScheduler();

  var results = scheduler.startWithDispose(function () {
    return Observable.throwError(new Error(), scheduler);
  }, 200);

  results.messages.assertEqual();
});

test('Throw_ObserverThrows', function () {
  var scheduler = new TestScheduler();

  var xs = Observable.throwError(new Error(), scheduler);

  xs.subscribe(noop, function () { throw new Error(); });

  raises(function () {
    scheduler.start();
  });
});
