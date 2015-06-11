(function () {
  QUnit.module('RetryWhen');

  var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

  test('RetryWhen Never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.retryWhen(function (attempts) {
        return Observable.empty(scheduler);
      });
    });

    results.messages.assertEqual(
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );
  });

  test('RetryWhen Observable Never', function () {
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

    var results = scheduler.startWithCreate(function () {
      return xs.retryWhen(function (attempts) {
        return Observable.never();
      });
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('RetryWhen Observable Never Complete', function () {
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
      return xs.retryWhen(function (attempts) {
        return Observable.never();
      });
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );
  });

  test('RetryWhen Observable Empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(100, 1),
      onNext(150, 2),
      onNext(200, 3),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.retryWhen(function(attempts) {
        return Observable.empty(scheduler);
      });
    });

    results.messages.assertEqual(
      onNext(300, 1),
      onNext(350, 2),
      onNext(400, 3),
      onCompleted(450)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 450)
    );
  });

  test('RetryWhen Observable Next Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(10, 1),
      onNext(20, 2),
      onError(30, error),
      onCompleted(40)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.retryWhen(function(attempts) {
        return attempts.scan(function(count, ex) {
          if(++count === 2) {
            throw error;
          }
          return count;
        }, 0); // returning any nexting observable should cause a continue
      });
    });

    results.messages.assertEqual(
      onNext(210, 1),
      onNext(220, 2),
      onNext(240, 1),
      onNext(250, 2),
      onError(260, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 230),
      subscribe(230, 260)
    );
  });

  test('RetryWhen Observable Complete', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(10, 1),
      onNext(20, 2),
      onError(30, error),
      onCompleted(40)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.retryWhen(function(attempts) {
        return Observable.empty(scheduler); // a completing observable completes
      });
    });

    results.messages.assertEqual(
      onNext(210, 1),
      onNext(220, 2),
      onCompleted(230)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 230)
    );
  });

  test('RetryWhen Observable Next Complete', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(10, 1),
      onNext(20, 2),
      onError(30, error),
      onCompleted(40)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.retryWhen(function(attempts) {
        return attempts.scan(function(count, error) {
          return count + 1;
        }, 0).takeWhile(function(count) {
          return count < 2;
        }); // returning any nexting observable should cause a continue
      });
    });

    results.messages.assertEqual(
      onNext(210, 1),
      onNext(220, 2),
      onNext(240, 1),
      onNext(250, 2),
      onCompleted(260)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 230),
      subscribe(230, 260)
    );
  });

  test('RetryWhen Observable Infinite', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(10, 1),
      onNext(20, 2),
      onError(30, error),
      onCompleted(40)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.retryWhen(function(){
        return Observable.never();
      });
    });

    results.messages.assertEqual(
      onNext(210, 1),
      onNext(220, 2)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

}());
