(function () {
  QUnit.module('Where');

  var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    SerialDisposable = Rx.SerialDisposable,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

  function isPrime(i) {
    if (i <= 1) {
      return false;
    }
    var max = Math.floor(Math.sqrt(i))
    for (var j = 2; j <= max; ++j) {
      if (i % j === 0) {
        return false;
      }
    }

    return true;
  }

  test('Where_Complete', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(180, 2),
      onNext(230, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(380, 6),
      onNext(390, 7),
      onNext(450, 8),
      onNext(470, 9),
      onNext(560, 10),
      onNext(580, 11),
      onCompleted(600),
      onNext(610, 12),
      onError(620, new Error()),
      onCompleted(630));

    var results = scheduler.startWithCreate(function () {
      return xs.filter(function (x) {
        invoked++;
        return isPrime(x);
      });
    });

    results.messages.assertEqual(
      onNext(230, 3),
      onNext(340, 5),
      onNext(390, 7),
      onNext(580, 11),
      onCompleted(600)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );

    equal(9, invoked);
  });

  test('Where_True', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(180, 2),
      onNext(230, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(380, 6),
      onNext(390, 7),
      onNext(450, 8),
      onNext(470, 9),
      onNext(560, 10),
      onNext(580, 11),
      onCompleted(600)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.filter(function (x) {
        invoked++;
        return true;
      });
    });

    results.messages.assertEqual(
      onNext(230, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(380, 6),
      onNext(390, 7),
      onNext(450, 8),
      onNext(470, 9),
      onNext(560, 10),
      onNext(580, 11),
      onCompleted(600)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );

    equal(9, invoked);
  });

  test('Where_False', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(180, 2),
      onNext(230, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(380, 6),
      onNext(390, 7),
      onNext(450, 8),
      onNext(470, 9),
      onNext(560, 10),
      onNext(580, 11),
      onCompleted(600)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.filter(function (x) {
        invoked++;
        return false;
      });
    });

    results.messages.assertEqual(
      onCompleted(600)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );

    equal(9, invoked);
  });

  test('Where_Dispose', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(180, 2),
      onNext(230, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(380, 6),
      onNext(390, 7),
      onNext(450, 8),
      onNext(470, 9),
      onNext(560, 10),
      onNext(580, 11),
      onCompleted(600)
    );

    var results = scheduler.startWithDispose(function () {
      return xs.filter(function (x) {
        invoked++;
        return isPrime(x);
      });
    }, 400);

    results.messages.assertEqual(
      onNext(230, 3),
      onNext(340, 5),
      onNext(390, 7)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );

    equal(5, invoked);
  });

  test('Where_Error', function () {
    var scheduler = new TestScheduler();
    var invoked = 0;

    var error = new Error();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(180, 2),
      onNext(230, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(380, 6),
      onNext(390, 7),
      onNext(450, 8),
      onNext(470, 9),
      onNext(560, 10),
      onNext(580, 11),
      onError(600, error),
      onNext(610, 12),
      onError(620, new Error()),
      onCompleted(630)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.filter(function (x) {
        invoked++;
        return isPrime(x);
      });
    });

    results.messages.assertEqual(
      onNext(230, 3),
      onNext(340, 5),
      onNext(390, 7),
      onNext(580, 11),
      onError(600, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );

    equal(9, invoked);
  });

  test('Where_Throw', function () {
    var scheduler = new TestScheduler();
    var invoked = 0;

    var error = new Error();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(180, 2),
      onNext(230, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(380, 6),
      onNext(390, 7),
      onNext(450, 8),
      onNext(470, 9),
      onNext(560, 10),
      onNext(580, 11),
      onCompleted(600),
      onNext(610, 12),
      onError(620, new Error()),
      onCompleted(630)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.filter(function (x) {
        invoked++;
        if (x > 5) {
          throw error;
        }
        return isPrime(x);
      });
    });

    results.messages.assertEqual(
      onNext(230, 3),
      onNext(340, 5),
      onError(380, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 380)
    );

    equal(4, invoked);
  });

  test('Where_DisposeInPredicate', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(180, 2),
      onNext(230, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(380, 6),
      onNext(390, 7),
      onNext(450, 8),
      onNext(470, 9),
      onNext(560, 10),
      onNext(580, 11),
      onCompleted(600),
      onNext(610, 12),
      onError(620, new Error()),
      onCompleted(630)
    );

    var results = scheduler.createObserver();

    var d = new SerialDisposable();

    var ys;
    scheduler.scheduleAbsolute(created, function () {
      return ys = xs.filter(function (x) {
        invoked++;
        if (x === 8) {
          d.dispose();
        }
        return isPrime(x);
      });
    });

    scheduler.scheduleAbsolute(subscribed, function () {
      d.setDisposable(ys.subscribe(results));
    });

    scheduler.scheduleAbsolute(disposed, function () {
      d.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(230, 3),
      onNext(340, 5),
      onNext(390, 7)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 450)
    );

    equal(6, invoked);
  });

  test('WhereIndex_Complete', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(180, 2),
      onNext(230, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(380, 6),
      onNext(390, 7),
      onNext(450, 8),
      onNext(470, 9),
      onNext(560, 10),
      onNext(580, 11),
      onCompleted(600),
      onNext(610, 12),
      onError(620, new Error()),
      onCompleted(630)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.filter(function (x, index) {
        invoked++;
        return isPrime(x + index * 10);
      });
    });

    results.messages.assertEqual(
      onNext(230, 3),
      onNext(390, 7),
      onCompleted(600)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );

    equal(9, invoked);
  });

  test('WhereIndex_True', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(180, 2),
      onNext(230, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(380, 6),
      onNext(390, 7),
      onNext(450, 8),
      onNext(470, 9),
      onNext(560, 10),
      onNext(580, 11),
      onCompleted(600)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.filter(function (x, index) {
        invoked++;
        return true;
      });
    });

    results.messages.assertEqual(
      onNext(230, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(380, 6),
      onNext(390, 7),
      onNext(450, 8),
      onNext(470, 9),
      onNext(560, 10),
      onNext(580, 11),
      onCompleted(600)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );

    equal(9, invoked);
  });

  test('WhereIndex_False', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(180, 2),
      onNext(230, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(380, 6),
      onNext(390, 7),
      onNext(450, 8),
      onNext(470, 9),
      onNext(560, 10),
      onNext(580, 11),
      onCompleted(600)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.filter(function (x, index) {
        invoked++;
        return false;
      });
    });

    results.messages.assertEqual(
      onCompleted(600)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );

    equal(9, invoked);
  });

  test('WhereIndex_Dispose', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(180, 2),
      onNext(230, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(380, 6),
      onNext(390, 7),
      onNext(450, 8),
      onNext(470, 9),
      onNext(560, 10),
      onNext(580, 11),
      onCompleted(600)
    );

    var results = scheduler.startWithDispose(function () {
      return xs.filter(function (x, index) {
        invoked++;
        return isPrime(x + index * 10);
      });
    }, 400);

    results.messages.assertEqual(
      onNext(230, 3),
      onNext(390, 7)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );

    equal(5, invoked);
  });

  test('WhereIndex_Error', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var error = new Error();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(180, 2),
      onNext(230, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(380, 6),
      onNext(390, 7),
      onNext(450, 8),
      onNext(470, 9),
      onNext(560, 10),
      onNext(580, 11),
      onError(600, error),
      onNext(610, 12),
      onError(620, new Error()),
      onCompleted(630)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.filter(function (x, index) {
        invoked++;
        return isPrime(x + index * 10);
      });
    });

    results.messages.assertEqual(
      onNext(230, 3),
      onNext(390, 7),
      onError(600, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );

    equal(9, invoked);
  });

  test('WhereIndex_Throw', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var error = new Error();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(180, 2),
      onNext(230, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(380, 6),
      onNext(390, 7),
      onNext(450, 8),
      onNext(470, 9),
      onNext(560, 10),
      onNext(580, 11),
      onCompleted(600),
      onNext(610, 12),
      onError(620, new Error()),
      onCompleted(630)
    );

    var results = scheduler.startWithCreate(function () {
      return xs.filter(function (x, index) {
        invoked++;
        if (x > 5) {
          throw error;
        }
        return isPrime(x + index * 10);
      });
    });

    results.messages.assertEqual(
      onNext(230, 3),
      onError(380, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 380)
    );

    equal(4, invoked);
  });

  test('WhereIndex_DisposeInPredicate', function () {
    var scheduler = new TestScheduler();

    var invoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(180, 2),
      onNext(230, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(380, 6),
      onNext(390, 7),
      onNext(450, 8),
      onNext(470, 9),
      onNext(560, 10),
      onNext(580, 11),
      onCompleted(600),
      onNext(610, 12),
      onError(620, new Error()),
      onCompleted(630)
    );

    var results = scheduler.createObserver();

    var d = new SerialDisposable();

    var ys;
    scheduler.scheduleAbsolute(created, function () {
      ys = xs.filter(function (x, index) {
        invoked++;
        if (x === 8) {
          d.dispose();
        }
        return isPrime(x + index * 10);
      });
    });

    scheduler.scheduleAbsolute(subscribed, function () {
      d.setDisposable(ys.subscribe(results));
    });

    scheduler.scheduleAbsolute(disposed, function () {
      d.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(230, 3),
      onNext(390, 7)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 450)
    );

    equal(6, invoked);
  });

  test('Where multiple subscribers', function () {
    var s = new TestScheduler();

    var xs = s.createHotObservable(onCompleted(100)).filter(function () { return true; });

    var o1 = s.createObserver();
    var o2 = s.createObserver();

    xs.subscribe(o1);
    xs.subscribe(o2);

    s.start();

    equal(o1.messages.length, 1);
    equal(o2.messages.length, 1);
  });

}());
