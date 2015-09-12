(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, ok */

  QUnit.module('replay');

  var TestScheduler = Rx.TestScheduler,
      Observable = Rx.Observable,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe,
      created = Rx.ReactiveTest.created,
      disposed = Rx.ReactiveTest.disposed;

  test('replay count basic', function () {
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
      ys = xs.replay(null, 3, null, scheduler);
    });

    scheduler.scheduleAbsolute(null, 450, function () {
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

    results.messages.assertEqual(
      onNext(451, 5),
      onNext(452, 6),
      onNext(453, 7),
      onNext(521, 11)
    );

    xs.subscriptions.assertEqual(
      subscribe(300, 400),
      subscribe(500, 550),
      subscribe(650, 800)
    );
  });

  test('replay count error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, error));

    var results = scheduler.createObserver();

    var ys;
    var subscription;
    var connection;

    scheduler.scheduleAbsolute(null, created, function () {
       ys = xs.replay(null, 3, null, scheduler);
    });

    scheduler.scheduleAbsolute(null, 450, function () {
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
      onNext(451, 5),
      onNext(452, 6),
      onNext(453, 7),
      onNext(521, 11),
      onNext(561, 20),
      onError(601, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(300, 400),
      subscribe(500, 600)
    );
  });

  test('replay count complete', function () {
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
      ys = xs.replay(null, 3, null, scheduler);
    });

    scheduler.scheduleAbsolute(null, 450, function () {
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
      onNext(451, 5),
      onNext(452, 6),
      onNext(453, 7),
      onNext(521, 11),
      onNext(561, 20),
      onCompleted(601)
    );

    xs.subscriptions.assertEqual(
      subscribe(300, 400),
      subscribe(500, 600)
    );
  });

  test('replay count dispose', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));

    var results = scheduler.createObserver();

    var ys;
    var subscription;
    var connection;

    scheduler.scheduleAbsolute(null, created, function () {
      ys = xs.replay(null, 3, null, scheduler);
    });

    scheduler.scheduleAbsolute(null, 450, function () {
      subscription = ys.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, 475, function () {
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

    results.messages.assertEqual(
      onNext(451, 5),
      onNext(452, 6),
      onNext(453, 7)
    );

    xs.subscriptions.assertEqual(
      subscribe(300, 400),
      subscribe(500, 550),
      subscribe(650, 800)
    );
  });

  test('replay count multiple connections', function () {
    var xs = Observable.never();
    var ys = xs.replay(null, 3);

    var connection1 = ys.connect();
    var connection2 = ys.connect();
    ok(connection1 === connection2);

    connection1.dispose();
    connection2.dispose();

    var connection3 = ys.connect();
    ok(connection1 !== connection3);
  });

  test('replay count function zip complete', function () {
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
      return xs.replay(function (_xs) {
        return _xs.take(6).repeat();
      }, 3, null, scheduler);
    }, {disposed: 610 });

    results.messages.assertEqual(
      onNext(221, 3),
      onNext(281, 4),
      onNext(291, 1),
      onNext(341, 8),
      onNext(361, 5),
      onNext(371, 6),
      onNext(372, 8),
      onNext(373, 5),
      onNext(374, 6),
      onNext(391, 7),
      onNext(411, 13),
      onNext(431, 2),
      onNext(432, 7),
      onNext(433, 13),
      onNext(434, 2),
      onNext(451, 9),
      onNext(521, 11),
      onNext(561, 20),
      onNext(562, 9),
      onNext(563, 11),
      onNext(564, 20),
      onNext(602, 9),
      onNext(603, 11),
      onNext(604, 20),
      onNext(606, 9),
      onNext(607, 11),
      onNext(608, 20)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );
  });

  test('replay count function zip error', function () {
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
      return xs.replay(function (_xs) {
        return _xs.take(6).repeat();
      }, 3, null, scheduler);
    });

    results.messages.assertEqual(
      onNext(221, 3),
      onNext(281, 4),
      onNext(291, 1),
      onNext(341, 8),
      onNext(361, 5),
      onNext(371, 6),
      onNext(372, 8),
      onNext(373, 5),
      onNext(374, 6),
      onNext(391, 7),
      onNext(411, 13),
      onNext(431, 2),
      onNext(432, 7),
      onNext(433, 13),
      onNext(434, 2),
      onNext(451, 9),
      onNext(521, 11),
      onNext(561, 20),
      onNext(562, 9),
      onNext(563, 11),
      onNext(564, 20),
      onError(601, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );
  });

  test('replay count function zip dispose', function () {
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
      return xs.replay(function (_xs) {
        return _xs.take(6).repeat();
      }, 3, null, scheduler);
    }, { disposed: 470 });

    results.messages.assertEqual(
      onNext(221, 3),
      onNext(281, 4),
      onNext(291, 1),
      onNext(341, 8),
      onNext(361, 5),
      onNext(371, 6),
      onNext(372, 8),
      onNext(373, 5),
      onNext(374, 6),
      onNext(391, 7),
      onNext(411, 13),
      onNext(431, 2),
      onNext(432, 7),
      onNext(433, 13),
      onNext(434, 2),
      onNext(451, 9)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 470)
    );
  });

  test('replay time basic', function () {
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
      ys = xs.replay(null, null, 150, scheduler);
    });

    scheduler.scheduleAbsolute(null, 450, function () {
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

    results.messages.assertEqual(
      onNext(451, 8),
      onNext(452, 5),
      onNext(453, 6),
      onNext(454, 7), onNext(521, 11)
    );

    xs.subscriptions.assertEqual(
      subscribe(300, 400),
      subscribe(500, 550),
      subscribe(650, 800)
    );
  });

  test('replay time error', function () {
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
      ys = xs.replay(null, null, 75, scheduler);
    });

    scheduler.scheduleAbsolute(null, 450, function () {
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
      onNext(451, 7),
      onNext(521, 11),
      onNext(561, 20),
      onError(601, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(300, 400),
      subscribe(500, 600)
    );
  });

  test('replay time complete', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));

    var results = scheduler.createObserver();

    var ys;
    var subscription;
    var connection;

    scheduler.scheduleAbsolute(null, created, function () {
      ys = xs.replay(null, null, 85, scheduler);
    });

    scheduler.scheduleAbsolute(null, 450, function () {
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
      onNext(451, 6),
      onNext(452, 7),
      onNext(521, 11),
      onNext(561, 20),
      onCompleted(601)
    );

    xs.subscriptions.assertEqual(
      subscribe(300, 400),
      subscribe(500, 600)
    );
  });

  test('replay time dispose', function () {
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
        ys = xs.replay(null, null, 100, scheduler);
    });

    scheduler.scheduleAbsolute(null, 450, function () {
      subscription = ys.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, 475, function () {
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

    results.messages.assertEqual(
      onNext(451, 5),
      onNext(452, 6),
      onNext(453, 7)
    );

    xs.subscriptions.assertEqual(
      subscribe(300, 400),
      subscribe(500, 550),
      subscribe(650, 800)
    );
  });

  test('replay time multiple connections', function () {
    var xs = Observable.never();
    var ys = xs.replay(null, null, 100);

    var connection1 = ys.connect();
    var connection2 = ys.connect();
    ok(connection1 === connection2);

    connection1.dispose();
    connection2.dispose();

    var connection3 = ys.connect();
    ok(connection1 !== connection3);
  });

  test('replay time function zip complete', function () {
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
      return xs.replay(function (_xs) {
        return _xs.take(6).repeat();
      }, null, 50, scheduler);
    }, { disposed: 610 });

    results.messages.assertEqual(
      onNext(221, 3),
      onNext(281, 4),
      onNext(291, 1),
      onNext(341, 8),
      onNext(361, 5),
      onNext(371, 6),
      onNext(372, 8),
      onNext(373, 5),
      onNext(374, 6),
      onNext(391, 7),
      onNext(411, 13),
      onNext(431, 2),
      onNext(432, 7),
      onNext(433, 13),
      onNext(434, 2),
      onNext(451, 9),
      onNext(521, 11),
      onNext(561, 20),
      onNext(562, 11),
      onNext(563, 20),
      onNext(602, 20),
      onNext(604, 20),
      onNext(606, 20),
      onNext(608, 20)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );
  });

  test('replay time function zip error', function () {
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
      return xs.replay(function (_xs) {
        return _xs.take(6).repeat();
      }, null, 50, scheduler);
    });

    results.messages.assertEqual(
      onNext(221, 3),
      onNext(281, 4),
      onNext(291, 1),
      onNext(341, 8),
      onNext(361, 5),
      onNext(371, 6),
      onNext(372, 8),
      onNext(373, 5),
      onNext(374, 6),
      onNext(391, 7),
      onNext(411, 13),
      onNext(431, 2),
      onNext(432, 7),
      onNext(433, 13),
      onNext(434, 2),
      onNext(451, 9),
      onNext(521, 11),
      onNext(561, 20),
      onNext(562, 11),
      onNext(563, 20),
      onError(601, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );
  });

  test('replay time function zip dispose', function () {
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
      return xs.replay(function (_xs) {
        return _xs.take(6).repeat();
      }, null, 50, scheduler);
    }, { disposed: 470 });

    results.messages.assertEqual(
      onNext(221, 3),
      onNext(281, 4),
      onNext(291, 1),
      onNext(341, 8),
      onNext(361, 5),
      onNext(371, 6),
      onNext(372, 8),
      onNext(373, 5),
      onNext(374, 6),
      onNext(391, 7),
      onNext(411, 13),
      onNext(431, 2),
      onNext(432, 7),
      onNext(433, 13),
      onNext(434, 2),
      onNext(451, 9)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 470)
    );
  });

}());
