(function () {
  QUnit.module('First');

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

  // First Async
  test('FirstAsync Empty', function () {
    var res, scheduler, xs;
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.first();
    });

    ok(res.messages[0].time === 250 && res.messages[0].value.exception !== null);

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('FirstAsync Default', function () {
    var res, scheduler, xs;
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.first({defaultValue: 42});
    });

    res.messages.assertEqual(onNext(250, 42), onCompleted(250));

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('FirstAsync One', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.first();
    });

    res.messages.assertEqual(onNext(210, 2), onCompleted(210));

    xs.subscriptions.assertEqual(subscribe(200, 210));
  });

  test('FirstAsync Many', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.first();
    });

    res.messages.assertEqual(onNext(210, 2), onCompleted(210));
    xs.subscriptions.assertEqual(subscribe(200, 210));
  });

  test('FirstAsync Error', function () {
    var ex = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, ex)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.first();
    });

    res.messages.assertEqual(onError(210, ex));

    xs.subscriptions.assertEqual(subscribe(200, 210));
  });

  test('FirstAsync Predicate', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.first(function (x) {
        return x % 2 === 1;
      });
    });

    res.messages.assertEqual(onNext(220, 3), onCompleted(220));

    xs.subscriptions.assertEqual(subscribe(200, 220));
  });

  test('FirstAsync Predicate Obj', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.first({
        predicate: function (x) {
          return x % 2 === 1;
        }
      });
    });

    res.messages.assertEqual(onNext(220, 3), onCompleted(220));

    xs.subscriptions.assertEqual(subscribe(200, 220));
  });

  test('FirstAsync Predicate thisArg', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.first(function (x) {
        equal(this, 42);
        return x % 2 === 1;
      }, 42);
    });

    res.messages.assertEqual(onNext(220, 3), onCompleted(220));

    xs.subscriptions.assertEqual(subscribe(200, 220));
  });

  test('FirstAsync Predicate Obj thisArg', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.first({
        predicate: function (x) {
          equal(this, 42);
          return x % 2 === 1;
        },
        thisArg: 42
      });
    });

    res.messages.assertEqual(onNext(220, 3), onCompleted(220));

    xs.subscriptions.assertEqual(subscribe(200, 220));
  });

  test('FirstAsync Predicate None', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.first(function (x) {
        return x > 10;
      });
    });

    ok(res.messages[0].time === 250 && res.messages[0].value.exception !== null);

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('FirstAsync Predicate Obj None', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.first({
        predicate: function (x) {
          return x > 10;
        }
      });
    });

    ok(res.messages[0].time === 250 && res.messages[0].value.exception !== null);

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('FirstAsync Predicate Obj None Default', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.first({
        predicate: function (x) {
          return x > 10;
        },
        defaultValue: 42
      });
    });

    res.messages.assertEqual(onNext(250, 42), onCompleted(250));

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('FirstAsync Predicate Error', function () {
    var ex = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(220, ex)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.first(function (x) {
        return x % 2 === 1;
      });
    });

    res.messages.assertEqual(onError(220, ex));

    xs.subscriptions.assertEqual(subscribe(200, 220));
  });

  test('FirstAsync PredicateThrows', function () {
    var ex = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var res = scheduler.startWithCreate(function () {
      return xs.first(function (x) {
        if (x < 4) {
          return false;
        } else {
          throw ex;
        }
      });
    });

    res.messages.assertEqual(onError(230, ex));

    xs.subscriptions.assertEqual(subscribe(200, 230));
  });

}());
