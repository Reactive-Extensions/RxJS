(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal, notEqual, ok */

  QUnit.module('do/tap');

  var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted;

  function noop () { }

  test('do should see all values', function () {
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
    var sum = 2 + 3 + 4 + 5;

    scheduler.startScheduler(function () {
      return xs.tap(function (x) { i++; return sum -= x; });
    });

    equal(4, i);
    equal(0, sum);
  });

  test('do plain action', function () {
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

    scheduler.startScheduler(function () {
      return xs.tap(function () { return i++; });
    });

    equal(4, i);
  });

  test('do next completed', function () {
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
    var sum = 2 + 3 + 4 + 5;
    var completed = false;

    scheduler.startScheduler(function () {
      return xs.tap(function (x) { i++; sum -= x; }, null, function () { completed = true; });
    });

    equal(4, i);
    equal(0, sum);
    ok(completed);
  });

  test('do next completed never', function () {
    var scheduler = new TestScheduler();

    var i = 0;
    var completed = false;

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    scheduler.startScheduler(function () {
      return xs.tap(function () { i++; }, null, function () { completed = true; });
    });

    equal(0, i);
    ok(!completed);
  });

  test('do next error', function () {
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

    var i = 0;
    var sum = 2 + 3 + 4 + 5;
    var sawError = false;

    scheduler.startScheduler(function () {
      return xs.tap(function (x) { i++; sum -= x; }, function (e) { sawError = e === error; });
    });

    equal(4, i);
    equal(0, sum);
    ok(sawError);
  });

  test('do next error not', function () {
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
    var sum = 2 + 3 + 4 + 5;
    var sawError = false;

    scheduler.startScheduler(function () {
      return xs.tap(function (x) { i++; sum -= x; }, function () { sawError = true; });
    });

    equal(4, i);
    equal(0, sum);
    ok(!sawError);
  });

  test('do next error completed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5), onCompleted(250)
    );

    var i = 0;
    var sum = 2 + 3 + 4 + 5;
    var sawError = false;
    var hasCompleted = false;

    scheduler.startScheduler(function () {
      return xs.tap(function (x) { i++; sum -= x; }, function () { sawError = true; }, function () { hasCompleted = true; });
    });

    equal(4, i);
    equal(0, sum);
    ok(!sawError);
    ok(hasCompleted);
  });

  test('do next completed error', function () {
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

    var i = 0;
    var sum = 2 + 3 + 4 + 5;
    var sawError = false;
    var hasCompleted = false;

    scheduler.startScheduler(function () {
      return xs.tap(function (x) { i++; sum -= x; }, function () { sawError = true; }, function () { hasCompleted = true; });
    });

    equal(4, i);
    equal(0, sum);
    ok(sawError);
    ok(!hasCompleted);
  });

  test('do next error completed never', function () {
    var scheduler = new TestScheduler();

    var i = 0;
    var sawError = false;
    var hasCompleted = false;

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    scheduler.startScheduler(function () {
      return xs.tap(function () { i++; }, function () { sawError = true; }, function () { hasCompleted = true; });
    });

    equal(0, i);
    ok(!sawError);
    ok(!hasCompleted);
  });

  test('do observer some data with error', function () {
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

    var i = 0;
    var sum = 2 + 3 + 4 + 5;
    var sawError = false;
    var hasCompleted = false;

    scheduler.startScheduler(function () {
      return xs.tap(Rx.Observer.create(function (x) { i++; sum -= x; }, function (e) { sawError = e === error; }, function () { hasCompleted = true; }));
    });

    equal(4, i);
    equal(0, sum);
    ok(sawError);
    ok(!hasCompleted);
  });

  test('do next throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.tap(function () { throw error; });
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('do next completed next throws', function () {
    var error = new Error();
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    var results = scheduler.startScheduler(function () {
      return xs.tap(function () { throw error; }, null, noop);
    });
    results.messages.assertEqual(onError(210, error));
  });

  test('do next competed completed throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
        return xs.tap(noop, null, function () { throw error; });
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onError(250, error)
    );
  });

  test('do next error next throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.tap(function () { throw error; }, noop);
    });

    results.messages.assertEqual(onError(210, error));
  });

  test('do next error error throws', function () {
    var error1 = new Error();
    var error2 = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.tap(noop, function () { throw error2; });
    });

    results.messages.assertEqual(
      onError(210, error2)
    );
  });

  test('do next error completed next throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.tap(function () { throw error; }, noop, noop);
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('do next error completed error throws', function () {
    var error1 = new Error();
    var error2 = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.tap(noop, function () { throw error2; }, noop);
    });

    results.messages.assertEqual(
      onError(210, error2)
    );
  });

  test('do next error completed completed throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.tap(noop, noop, function () { throw error; });
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onError(250, error)
    );
  });

  test('do observer next throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.tap(Rx.Observer.create(function () { throw error;  }, noop, noop));
    });

    results.messages.assertEqual(
      onError(210, error)
    );
  });

  test('do observer error throws', function () {
    var error1 = new Error();
    var error2 = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.tap(Rx.Observer.create(noop, function () { throw error2; }, noop));
    });

    results.messages.assertEqual(
      onError(210, error2)
    );
  });

  test('do observer completed throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return xs.tap(Rx.Observer.create(noop, noop, function () { throw error; }));
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onError(250, error)
    );
  });

  test('doOnNext no thisArg', function () {
    var scheduler = new TestScheduler();

    var self = this, that;

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    scheduler.startScheduler(function () {
      return xs.doOnNext(function () { that = this; });
    });

    notEqual(that, self);
  });

  test('doOnNext thisArg', function () {
    var scheduler = new TestScheduler();

    var self = 42, that;

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );

    scheduler.startScheduler(function () {
      return xs.doOnNext(function () { that = this; }, self);
    });

    equal(that, self);
  });

  test('doOnError no thisArg', function () {
    var scheduler = new TestScheduler();

    var self = this, that;

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, new Error())
    );

    scheduler.startScheduler(function () {
      return xs.doOnError(function () { that = this; });
    });

    notEqual(that, self);
  });

  test('doOnError thisArg', function () {
    var scheduler = new TestScheduler();

    var self = 42, that;

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, new Error())
    );

    scheduler.startScheduler(function () {
      return xs.doOnError(function () { that = this; }, self);
    });

    equal(that, self);
  });

  test('doOnCompleted no thisArg', function () {
    var scheduler = new TestScheduler();

    var self = this, that;

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    scheduler.startScheduler(function () {
      return xs.doOnCompleted(function () { that = this; });
    });

    notEqual(that, self);
  });

  test('doOnCompleted thisArg', function () {
    var scheduler = new TestScheduler();

    var self = 42, that;

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    scheduler.startScheduler(function () {
      return xs.doOnCompleted(function () { that = this; }, self);
    });

    equal(that, self);
  });

}());
