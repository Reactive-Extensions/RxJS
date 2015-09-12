(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, ok */
  QUnit.module('publishLast');

  var TestScheduler = Rx.TestScheduler,
      Observable = Rx.Observable,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe,
      created = Rx.ReactiveTest.created,
      disposed = Rx.ReactiveTest.disposed,
      subscribed = Rx.ReactiveTest.subscribed;

  function add(x, y) { return x + y; }

  test('publishLast basic', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));

    var results = scheduler.createObserver();

    var ys;
    var subscription;
    var connection;

    scheduler.scheduleAbsolute(null, created, function () {
      ys = xs.publishLast();
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      subscription = ys.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      subscription.dispose();
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      connection.dispose();
    });

    scheduler.scheduleAbsolute(null, 500, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 550, function () {
      connection.dispose();
    });

    scheduler.scheduleAbsolute(null, 650, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 800, function () {
      connection.dispose();
    });

    scheduler.start();

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(300, 400),
      subscribe(500, 550),
      subscribe(650, 800)
    );
  });

  test('publishLast Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 7),
      onNext(220, 3),
      onNext(280, 4),
      onNext(290, 1),
      onNext(340, 8),
      onNext(360, 5),
      onNext(370, 6),
      onNext(390, 7),
      onNext(410, 13),
      onNext(430, 2),
      onNext(450, 9),
      onNext(520, 11),
      onNext(560, 20),
      onError(600, error)
    );

    var results = scheduler.createObserver();

    var ys;
    var subscription;
    var connection;

    scheduler.scheduleAbsolute(null, created, function () {
      ys = xs.publishLast();
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
        subscription = ys.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      subscription.dispose();
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      connection.dispose();
    });

    scheduler.scheduleAbsolute(null, 500, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 800, function () {
      connection.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onError(600, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(300, 400),
      subscribe(500, 600)
    );
  });

  test('publishLast complete', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 7),
      onNext(220, 3),
      onNext(280, 4),
      onNext(290, 1),
      onNext(340, 8),
      onNext(360, 5),
      onNext(370, 6),
      onNext(390, 7),
      onNext(410, 13),
      onNext(430, 2),
      onNext(450, 9),
      onNext(520, 11),
      onNext(560, 20),
      onCompleted(600)
    );

    var results = scheduler.createObserver();

    var ys;
    var subscription;
    var connection;

    scheduler.scheduleAbsolute(null, created, function () {
      ys = xs.publishLast();
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      subscription = ys.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      subscription.dispose();
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      connection.dispose();
    });

    scheduler.scheduleAbsolute(null, 500, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 800, function () {
      connection.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(600, 20),
      onCompleted(600)
    );

    xs.subscriptions.assertEqual(
      subscribe(300, 400),
      subscribe(500, 600)
    );
  });

  test('publishLast dispose', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 7),
      onNext(220, 3),
      onNext(280, 4),
      onNext(290, 1),
      onNext(340, 8),
      onNext(360, 5),
      onNext(370, 6),
      onNext(390, 7),
      onNext(410, 13),
      onNext(430, 2),
      onNext(450, 9),
      onNext(520, 11),
      onNext(560, 20),
      onCompleted(600)
    );

    var results = scheduler.createObserver();

    var ys;
    var subscription;
    var connection;

    scheduler.scheduleAbsolute(null, created, function () {
      ys = xs.publishLast();
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      subscription = ys.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, 350, function () {
      subscription.dispose();
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      connection.dispose();
    });

    scheduler.scheduleAbsolute(null, 500, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 550, function () {
      connection.dispose();
    });

    scheduler.scheduleAbsolute(null, 650, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 800, function () {
      connection.dispose();
    });

    scheduler.start();

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(300, 400),
      subscribe(500, 550),
      subscribe(650, 800)
    );
  });

  test('publishLast multiple connections', function () {
    var xs = Observable.never();
    var ys = xs.publishLast();

    var connection1 = ys.connect();
    var connection2 = ys.connect();
    ok(connection1 === connection2);

    connection1.dispose();
    connection2.dispose();

    var connection3 = ys.connect();
    ok(connection1 !== connection3);
  });

  test('publishLast zip complete', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 7),
      onNext(220, 3),
      onNext(280, 4),
      onNext(290, 1),
      onNext(340, 8),
      onNext(360, 5),
      onNext(370, 6),
      onNext(390, 7),
      onNext(410, 13),
      onNext(430, 2),
      onNext(450, 9),
      onNext(520, 11),
      onNext(560, 20),
      onCompleted(600)
    );

    var results = scheduler.startScheduler(function () {
      return xs.publishLast(function (_xs) {
        return _xs.zip(_xs, add);
      });
    });

    results.messages.assertEqual(
      onNext(600, 40),
      onCompleted(600)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );
  });

  test('publishLast zip Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 7),
      onNext(220, 3),
      onNext(280, 4),
      onNext(290, 1),
      onNext(340, 8),
      onNext(360, 5),
      onNext(370, 6),
      onNext(390, 7),
      onNext(410, 13),
      onNext(430, 2),
      onNext(450, 9),
      onNext(520, 11),
      onNext(560, 20),
      onError(600, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.publishLast(function (_xs) {
        return _xs.zip(_xs, add);
      });
    });

    results.messages.assertEqual(
      onError(600, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );
  });

  test('publishLast zip dispose', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 7),
      onNext(220, 3),
      onNext(280, 4),
      onNext(290, 1),
      onNext(340, 8),
      onNext(360, 5),
      onNext(370, 6),
      onNext(390, 7),
      onNext(410, 13),
      onNext(430, 2),
      onNext(450, 9),
      onNext(520, 11),
      onNext(560, 20),
      onCompleted(600)
    );

    var results = scheduler.startScheduler(function () {
      return xs.publishLast(function (_xs) {
        return _xs.zip(_xs, add);
      });
    }, { disposed: 470 });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(200, 470)
    );
  });

}());
