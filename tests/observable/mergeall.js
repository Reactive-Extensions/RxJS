(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, RSVP, asyncTest, start, ok, equal */
  QUnit.module('mergeAll');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      isEqual = Rx.internals.isEqual;


  asyncTest('mergeAll Task', function () {
    var sources = Rx.Observable.fromArray([
      new RSVP.Promise(function (res) { res(0); }),
      new RSVP.Promise(function (res) { res(1); }),
      new RSVP.Promise(function (res) { res(2); }),
      new RSVP.Promise(function (res) { res(3); }),
    ]);

    var res = [];
    sources.mergeAll().subscribe(
      function (x) {
        res.push(x);
      },
      function () {
        ok(false);
        start();
      },
      function () {
        ok(isEqual([0,1,2,3], res));
        start();
      });
  });

  asyncTest('mergeAll Task Error', function () {
    var sources = Rx.Observable.fromArray([
      new RSVP.Promise(function (res) { res(0); }),
      new RSVP.Promise(function (res, rej) { rej(1); }),
      new RSVP.Promise(function (res) { res(2); }),
      new RSVP.Promise(function (res) { res(3); }),
    ]);

    var res = [];
    sources.mergeAll().subscribe(
      function (x) {
        res.push(x);
      },
      function (err) {
        ok(res.length === 1);
        equal(1, err);
        start();
      },
      function () {
        ok(false);
        start();
      });
  });

  test('mergeAll Observable of Observable data', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(300,
        scheduler.createColdObservable(
          onNext(10, 101),
          onNext(20, 102),
          onNext(110, 103),
          onNext(120, 104),
          onNext(210, 105),
          onNext(220, 106),
          onCompleted(230))),
      onNext(400,
        scheduler.createColdObservable(
          onNext(10, 201),
          onNext(20, 202),
          onNext(30, 203),
          onNext(40, 204),
          onCompleted(50))),
      onNext(500,
        scheduler.createColdObservable(
          onNext(10, 301),
          onNext(20, 302),
          onNext(30, 303),
          onNext(40, 304),
          onNext(120, 305),
          onCompleted(150))),
      onCompleted(600));

    var results = scheduler.startScheduler(function () {
      return xs.mergeAll();
    });

    results.messages.assertEqual(
      onNext(310, 101),
      onNext(320, 102),
      onNext(410, 103),
      onNext(410, 201),
      onNext(420, 104),
      onNext(420, 202),
      onNext(430, 203),
      onNext(440, 204),
      onNext(510, 105),
      onNext(510, 301),
      onNext(520, 106),
      onNext(520, 302),
      onNext(530, 303),
      onNext(540, 304),
      onNext(620, 305),
      onCompleted(650));
  });

  test('mergeAll Observable of Observable data non-overlapped', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(300,
        scheduler.createColdObservable(
          onNext(10, 101),
          onNext(20, 102),
          onCompleted(230))),
      onNext(400,
        scheduler.createColdObservable(
          onNext(10, 201),
          onNext(20, 202),
          onNext(30, 203),
          onNext(40, 204),
          onCompleted(50))),
      onNext(500,
        scheduler.createColdObservable(
          onNext(10, 301),
          onNext(20, 302),
          onNext(30, 303),
          onNext(40, 304),
          onCompleted(50))),
      onCompleted(600));

    var results = scheduler.startScheduler(function () {
      return xs.mergeAll();
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
      onCompleted(600));
  });

  test('mergeAll Observable of Observable inner throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(300,
        scheduler.createColdObservable(
          onNext(10, 101),
          onNext(20, 102),
          onCompleted(230))),
      onNext(400,
        scheduler.createColdObservable(
          onNext(10, 201),
          onNext(20, 202),
          onNext(30, 203),
          onNext(40, 204),
          onError(50, error))),
      onNext(500,
        scheduler.createColdObservable(
          onNext(10, 301),
          onNext(20, 302),
          onNext(30, 303),
          onNext(40, 304),
          onCompleted(50))),
      onCompleted(600));

    var results = scheduler.startScheduler(function () {
      return xs.mergeAll();
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

  test('mergeAll Observable of Observable outer throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(300,
        scheduler.createColdObservable(
          onNext(10, 101),
          onNext(20, 102),
          onCompleted(230))),
      onNext(400,
        scheduler.createColdObservable(
          onNext(10, 201),
          onNext(20, 202),
          onNext(30, 203),
          onNext(40, 204),
          onCompleted(50))),
      onError(500, error));

    var results = scheduler.startScheduler(function () {
      return xs.mergeAll();
    });

    results.messages.assertEqual(
      onNext(310, 101),
      onNext(320, 102),
      onNext(410, 201),
      onNext(420, 202),
      onNext(430, 203),
      onNext(440, 204),
      onError(500, error));
  });

}());
