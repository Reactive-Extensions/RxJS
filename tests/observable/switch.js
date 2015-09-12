(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, asyncTest, start, equal, RSVP */
  QUnit.module('switch');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  asyncTest('switch Promise', function () {
    var sources = Rx.Observable.fromArray([
      new RSVP.Promise(function (res) { res(0); }),
      new RSVP.Promise(function (res) { res(1); }),
      new RSVP.Promise(function (res) { res(2); }),
      new RSVP.Promise(function (res) { res(3); })
    ]);

    sources['switch']().subscribe(function (x) {
      equal(3, x);
      start();
    });
  });

  asyncTest('switch Promise error', function () {
    var sources = Rx.Observable.fromArray([
      new RSVP.Promise(function (res) { res(0); }),
      new RSVP.Promise(function (res) { res(1); }),
      new RSVP.Promise(function (res, rej) { rej(2); }),
      new RSVP.Promise(function (res) { res(3); })
    ]);

    sources['switch']().subscribe(function (x) {
      equal(3, x);
      start();
    }, function (err) {
      equal(2, err);
      start();
    });
  });

  test('switch Data', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(300, scheduler.createColdObservable(
        onNext(10, 101),
        onNext(20, 102),
        onNext(110, 103),
        onNext(120, 104),
        onNext(210, 105),
        onNext(220, 106),
        onCompleted(230))),
      onNext(400, scheduler.createColdObservable(
        onNext(10, 201),
        onNext(20, 202),
        onNext(30, 203),
        onNext(40, 204),
        onCompleted(50))),
      onNext(500, scheduler.createColdObservable(
        onNext(10, 301),
        onNext(20, 302),
        onNext(30, 303),
        onNext(40, 304),
        onCompleted(150))),
      onCompleted(600));

    var results = scheduler.startScheduler(function () {
      return xs['switch']();
    });

    results.messages.assertEqual(
      onNext(310, 101),
      onNext(320, 102),
      onNext(410, 201),
      onNext(420, 202),
      onNext(430, 203),
      onNext(440, 204),
      onNext(510, 301),
      onNext(520, 302),
      onNext(530, 303),
      onNext(540, 304),
      onCompleted(650)
    );
  });

  test('switch inner throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(300, scheduler.createColdObservable(
        onNext(10, 101),
        onNext(20, 102),
        onNext(110, 103),
        onNext(120, 104),
        onNext(210, 105),
        onNext(220, 106),
        onCompleted(230))),
      onNext(400, scheduler.createColdObservable(
        onNext(10, 201),
        onNext(20, 202),
        onNext(30, 203),
        onNext(40, 204),
        onError(50, error))),
      onNext(500, scheduler.createColdObservable(
        onNext(10, 301),
        onNext(20, 302),
        onNext(30, 303),
        onNext(40, 304),
        onCompleted(150))),
      onCompleted(600)
    );

    var results = scheduler.startScheduler(function () {
      return xs['switch']();
    });

    results.messages.assertEqual(
      onNext(310, 101),
      onNext(320, 102),
      onNext(410, 201),
      onNext(420, 202),
      onNext(430, 203),
      onNext(440, 204),
      onError(450, error));
  });

  test('switch outer throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(300, scheduler.createColdObservable(
        onNext(10, 101),
        onNext(20, 102),
        onNext(110, 103),
        onNext(120, 104),
        onNext(210, 105),
        onNext(220, 106),
        onCompleted(230))),
      onNext(400, scheduler.createColdObservable(
        onNext(10, 201),
        onNext(20, 202),
        onNext(30, 203),
        onNext(40, 204),
        onCompleted(50))),
      onError(500, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs['switch']();
    });

    results.messages.assertEqual(
      onNext(310, 101),
      onNext(320, 102),
      onNext(410, 201),
      onNext(420, 202),
      onNext(430, 203),
      onNext(440, 204),
      onError(500, error)
    );
  });

  test('switch no inner', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onCompleted(500)
    );

    var results = scheduler.startScheduler(function () {
      return xs['switch']();
    });

    results.messages.assertEqual(
      onCompleted(500)
    );
  });

  test('switch inner completes', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(300, scheduler.createColdObservable(
        onNext(10, 101),
        onNext(20, 102),
        onNext(110, 103),
        onNext(120, 104),
        onNext(210, 105),
        onNext(220, 106),
        onCompleted(230))),
      onCompleted(540)
    );

    var results = scheduler.startScheduler(function () {
      return xs['switch']();
    });

    results.messages.assertEqual(
      onNext(310, 101),
      onNext(320, 102),
      onNext(410, 103),
      onNext(420, 104),
      onNext(510, 105),
      onNext(520, 106),
      onCompleted(540)
    );
  });

}());
