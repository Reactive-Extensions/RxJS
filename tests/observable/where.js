(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal */
  QUnit.module('filter');

  var TestScheduler = Rx.TestScheduler,
    SerialDisposable = Rx.SerialDisposable,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

  function isPrime(i) {
    if (i <= 1) { return false; }
    var max = Math.floor(Math.sqrt(i));
    for (var j = 2; j <= max; ++j) {
      if (i % j === 0) { return false; }
    }
    return true;
  }

  test('filter complete', function () {
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

    var results = scheduler.startScheduler(function () {
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

  test('filter True', function () {
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

    var results = scheduler.startScheduler(function () {
      return xs.filter(function () {
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

  test('filter False', function () {
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

    var results = scheduler.startScheduler(function () {
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

  test('filter dispose', function () {
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

    var results = scheduler.startScheduler(function () {
      return xs.filter(function (x) {
        invoked++;
        return isPrime(x);
      });
    }, { disposed: 400 });

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

  test('filter error', function () {
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

    var results = scheduler.startScheduler(function () {
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

  test('filter Throw', function () {
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

    var results = scheduler.startScheduler(function () {
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

  test('filter DisposeInPredicate', function () {
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
    scheduler.scheduleAbsolute(null, created, function () {
      return ys = xs.filter(function (x) {
        invoked++;
        if (x === 8) {
          d.dispose();
        }
        return isPrime(x);
      });
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      d.setDisposable(ys.subscribe(results));
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
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

  test('filter with index complete', function () {
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

    var results = scheduler.startScheduler(function () {
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

  test('filter with index True', function () {
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

    var results = scheduler.startScheduler(function () {
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

  test('filter with index False', function () {
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

    var results = scheduler.startScheduler(function () {
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

  test('filter with index dispose', function () {
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

    var results = scheduler.startScheduler(function () {
      return xs.filter(function (x, index) {
        invoked++;
        return isPrime(x + index * 10);
      });
    }, { disposed: 400 });

    results.messages.assertEqual(
      onNext(230, 3),
      onNext(390, 7)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );

    equal(5, invoked);
  });

  test('filter with index error', function () {
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

    var results = scheduler.startScheduler(function () {
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

  test('filter with index Throw', function () {
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

    var results = scheduler.startScheduler(function () {
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

  test('filter with index dispose in predicate', function () {
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
    scheduler.scheduleAbsolute(null, created, function () {
      ys = xs.filter(function (x, index) {
        invoked++;
        if (x === 8) {
          d.dispose();
        }
        return isPrime(x + index * 10);
      });
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      d.setDisposable(ys.subscribe(results));
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
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

  test('filter multiple subscribers', function () {
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

  test('Filter and Filter Optimization', function () {
    var scheduler = new TestScheduler();

    var invoked1 = 0;
    var invoked2 = 0;

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

    var results = scheduler.startScheduler(function () {
      return xs
        .filter(function(x) { invoked1++; return x % 2 === 0; })
        .filter(function(x) { invoked2++; return x % 3 === 0; });
    });

    results.messages.assertEqual(
      onNext(380, 6),
      onCompleted(600)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );

    equal(9, invoked1);
    equal(4, invoked2);
  });

  test('Filter and Filter ThisArg', function() {
    var scheduler = new TestScheduler();

    function Filterer() {
      this.filter1 = function(item) { return item % 2 === 0; };
      this.filter2 = function(item) { return item % 3 === 0; };
    }

    var filterer = new Filterer();

    var xs = scheduler.createColdObservable(
        onNext(10, 1),
        onNext(20, 2),
        onNext(30, 3),
        onNext(40, 4),
        onNext(50, 5),
        onNext(60, 6),
        onNext(70, 7),
        onNext(80, 8),
        onNext(90, 9),
        onCompleted(100)
    );

    var results = scheduler.startScheduler(function() {
      return xs
        .filter(function(x){ return this.filter1(x);}, filterer)
        .filter(function(x){ return this.filter2(x);}, filterer)
        .filter(function(x){ return this.filter1(x);}, filterer);
    });

    results.messages.assertEqual(onNext(260, 6), onCompleted(300));

  });

  test('filter and map optimization', function () {
    var scheduler = new TestScheduler();

    var invoked1 = 0;
    var invoked2 = 0;

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

    var results = scheduler.startScheduler(function () {
      return xs
      .filter(function(x) { invoked1++; return x % 2 === 0; })
      .map(function(x) { invoked2++; return x * x; });
    });

    results.messages.assertEqual(
      onNext(270, 16),
      onNext(380, 36),
      onNext(450, 64),
      onNext(560, 100),
      onCompleted(600)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );

    equal(9, invoked1);
    equal(4, invoked2);
  });

}());
