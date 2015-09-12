(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('take');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('take complete after', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(70, 6),
      onNext(150, 4),
      onNext(210, 9),
      onNext(230, 13),
      onNext(270, 7),
      onNext(280, 1),
      onNext(300, -1),
      onNext(310, 3),
      onNext(340, 8),
      onNext(370, 11),
      onNext(410, 15),
      onNext(415, 16),
      onNext(460, 72),
      onNext(510, 76),
      onNext(560, 32),
      onNext(570, -100),
      onNext(580, -3),
      onNext(590, 5),
      onNext(630, 10),
      onCompleted(690)
    );

    var results = scheduler.startScheduler(function () {
      return xs.take(20);
    });

    results.messages.assertEqual(
      onNext(210, 9),
      onNext(230, 13),
      onNext(270, 7),
      onNext(280, 1),
      onNext(300, -1),
      onNext(310, 3),
      onNext(340, 8),
      onNext(370, 11),
      onNext(410, 15),
      onNext(415, 16),
      onNext(460, 72),
      onNext(510, 76),
      onNext(560, 32),
      onNext(570, -100),
      onNext(580, -3),
      onNext(590, 5),
      onNext(630, 10),
      onCompleted(690)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 690)
    );
  });

  test('take complete same', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(70, 6),
      onNext(150, 4),
      onNext(210, 9),
      onNext(230, 13),
      onNext(270, 7),
      onNext(280, 1),
      onNext(300, -1),
      onNext(310, 3),
      onNext(340, 8),
      onNext(370, 11),
      onNext(410, 15),
      onNext(415, 16),
      onNext(460, 72),
      onNext(510, 76),
      onNext(560, 32),
      onNext(570, -100),
      onNext(580, -3),
      onNext(590, 5),
      onNext(630, 10),
      onCompleted(690)
    );

    var results = scheduler.startScheduler(function () {
      return xs.take(17);
    });

    results.messages.assertEqual(
      onNext(210, 9),
      onNext(230, 13),
      onNext(270, 7),
      onNext(280, 1),
      onNext(300, -1),
      onNext(310, 3),
      onNext(340, 8),
      onNext(370, 11), 
      onNext(410, 15),
      onNext(415, 16),
      onNext(460, 72),
      onNext(510, 76),
      onNext(560, 32),
      onNext(570, -100),
      onNext(580, -3),
      onNext(590, 5),
      onNext(630, 10),
      onCompleted(630)
    );

    xs.subscriptions.assertEqual(subscribe(200, 630));
  });

  test('take complete before', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(70, 6),
      onNext(150, 4),
      onNext(210, 9),
      onNext(230, 13),
      onNext(270, 7),
      onNext(280, 1),
      onNext(300, -1),
      onNext(310, 3),
      onNext(340, 8),
      onNext(370, 11),
      onNext(410, 15),
      onNext(415, 16),
      onNext(460, 72),
      onNext(510, 76),
      onNext(560, 32),
      onNext(570, -100),
      onNext(580, -3),
      onNext(590, 5),
      onNext(630, 10),
      onCompleted(690)
    );

    var results = scheduler.startScheduler(function () {
      return xs.take(10);
    });

    results.messages.assertEqual(
      onNext(210, 9),
      onNext(230, 13),
      onNext(270, 7),
      onNext(280, 1),
      onNext(300, -1),
      onNext(310, 3),
      onNext(340, 8),
      onNext(370, 11),
      onNext(410, 15),
      onNext(415, 16),
      onCompleted(415)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 415)
    );
  });

  test('take error after', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(70, 6),
      onNext(150, 4),
      onNext(210, 9),
      onNext(230, 13),
      onNext(270, 7),
      onNext(280, 1),
      onNext(300, -1),
      onNext(310, 3),
      onNext(340, 8),
      onNext(370, 11),
      onNext(410, 15),
      onNext(415, 16),
      onNext(460, 72),
      onNext(510, 76),
      onNext(560, 32),
      onNext(570, -100),
      onNext(580, -3),
      onNext(590, 5),
      onNext(630, 10),
      onError(690, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.take(20);
    });

    results.messages.assertEqual(
      onNext(210, 9),
      onNext(230, 13),
      onNext(270, 7),
      onNext(280, 1),
      onNext(300, -1),
      onNext(310, 3),
      onNext(340, 8),
      onNext(370, 11),
      onNext(410, 15),
      onNext(415, 16),
      onNext(460, 72),
      onNext(510, 76),
      onNext(560, 32),
      onNext(570, -100),
      onNext(580, -3),
      onNext(590, 5),
      onNext(630, 10),
      onError(690, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 690)
    );
  });

  test('take error same', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(70, 6),
      onNext(150, 4),
      onNext(210, 9),
      onNext(230, 13),
      onNext(270, 7),
      onNext(280, 1),
      onNext(300, -1),
      onNext(310, 3),
      onNext(340, 8),
      onNext(370, 11),
      onNext(410, 15),
      onNext(415, 16),
      onNext(460, 72),
      onNext(510, 76),
      onNext(560, 32),
      onNext(570, -100),
      onNext(580, -3),
      onNext(590, 5),
      onNext(630, 10),
      onError(690, new Error())
    );

    var results = scheduler.startScheduler(function () {
      return xs.take(17);
    });

    results.messages.assertEqual(
      onNext(210, 9),
      onNext(230, 13),
      onNext(270, 7),
      onNext(280, 1),
      onNext(300, -1),
      onNext(310, 3),
      onNext(340, 8),
      onNext(370, 11),
      onNext(410, 15),
      onNext(415, 16),
      onNext(460, 72),
      onNext(510, 76),
      onNext(560, 32),
      onNext(570, -100),
      onNext(580, -3),
      onNext(590, 5),
      onNext(630, 10),
      onCompleted(630)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 630)
    );
  });

  test('take error before', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(70, 6),
      onNext(150, 4),
      onNext(210, 9),
      onNext(230, 13),
      onNext(270, 7),
      onNext(280, 1),
      onNext(300, -1),
      onNext(310, 3),
      onNext(340, 8),
      onNext(370, 11),
      onNext(410, 15),
      onNext(415, 16),
      onNext(460, 72),
      onNext(510, 76),
      onNext(560, 32),
      onNext(570, -100),
      onNext(580, -3),
      onNext(590, 5),
      onNext(630, 10),
      onError(690, new Error()));

    var results = scheduler.startScheduler(function () {
      return xs.take(3);
    });

    results.messages.assertEqual(
      onNext(210, 9),
      onNext(230, 13),
      onNext(270, 7),
      onCompleted(270)
    );

    xs.subscriptions.assertEqual(subscribe(200, 270));
  });

  test('take dispose before', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(70, 6),
      onNext(150, 4),
      onNext(210, 9),
      onNext(230, 13),
      onNext(270, 7),
      onNext(280, 1),
      onNext(300, -1),
      onNext(310, 3),
      onNext(340, 8),
      onNext(370, 11),
      onNext(410, 15),
      onNext(415, 16),
      onNext(460, 72),
      onNext(510, 76),
      onNext(560, 32),
      onNext(570, -100),
      onNext(580, -3),
      onNext(590, 5),
      onNext(630, 10)
    );

    var results = scheduler.startScheduler(function () {
      return xs.take(3);
    }, { disposed: 250 });

    results.messages.assertEqual(
      onNext(210, 9),
      onNext(230, 13)
    );

    xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('take dispose after', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(70, 6),
      onNext(150, 4),
      onNext(210, 9),
      onNext(230, 13),
      onNext(270, 7),
      onNext(280, 1),
      onNext(300, -1),
      onNext(310, 3),
      onNext(340, 8),
      onNext(370, 11),
      onNext(410, 15),
      onNext(415, 16),
      onNext(460, 72),
      onNext(510, 76),
      onNext(560, 32),
      onNext(570, -100),
      onNext(580, -3),
      onNext(590, 5),
      onNext(630, 10)
    );

    var results = scheduler.startScheduler(function () {
      return xs.take(3);
    }, { disposed: 400 });

    results.messages.assertEqual(
      onNext(210, 9),
      onNext(230, 13),
      onNext(270, 7),
      onCompleted(270)
    );

    xs.subscriptions.assertEqual(subscribe(200, 270));
  });

}());
