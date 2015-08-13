(function () {
  QUnit.module('concat');

  var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    isEqual = Rx.internals.isEqual;

  asyncTest('concatAll promises', function () {
    var sources = Rx.Observable.fromArray([
      new RSVP.Promise(function (res) { res(0); }),
      new RSVP.Promise(function (res) { res(1); }),
      new RSVP.Promise(function (res) { res(2); }),
      new RSVP.Promise(function (res) { res(3); }),
    ]);

    var res = [];
    sources.concatAll().subscribe(
      function (x) {
        res.push(x);
      },
      function (err) {
        ok(false);
        start();
      },
      function () {
        ok(isEqual([0,1,2,3], res));
        start();
      });
  });

  asyncTest('concatAll some errors', function () {
    var sources = Rx.Observable.fromArray([
      new RSVP.Promise(function (res) { res(0); }),
      new RSVP.Promise(function (res, rej) { rej(1); }),
      new RSVP.Promise(function (res) { res(2); }),
      new RSVP.Promise(function (res) { res(3); }),
    ]);

    var res = [];
    sources.concatAll().subscribe(
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

  test('concat empty empty', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e1.concat(e2);
    });

    results.messages.assertEqual(
      onCompleted(250));
  });

  test('concat empty never', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(230));
    var e2 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return e1.concat(e2);
    });

    results.messages.assertEqual();
  });

  test('concat never empty', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(230));
    var e2 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return e2.concat(e1);
    });

    results.messages.assertEqual();
  });

  test('concat never never', function () {
    var scheduler = new TestScheduler();

    var e1 = Observable.never();
    var e2 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return e1.concat(e2);
    });

    results.messages.assertEqual();
  });

  test('concat EmptyThrow', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(250, error));

    var results = scheduler.startScheduler(function () {
      return e1.concat(e2);
    });

    results.messages.assertEqual(
      onError(250, error));
  });

  test('concat ThrowEmpty', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(230, error));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
        return e1.concat(e2);
    });

    results.messages.assertEqual(
      onError(230, error));
  });

  test('concat throw throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(230, error));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(250, new Error()));

    var results = scheduler.startScheduler(function () {
      return e1.concat(e2);
    });

    results.messages.assertEqual(
      onError(230, error));
  });

  test('concat ReturnEmpty', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e1.concat(e2);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onCompleted(250));
  });

  test('concat empty return', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(240, 2),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e1.concat(e2);
    });

    results.messages.assertEqual(
      onNext(240, 2),
      onCompleted(250));
  });

  test('concat return never', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(230));
    var e2 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return e1.concat(e2);
    });

    results.messages.assertEqual(
      onNext(210, 2));
  });

  test('concat never return', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(230));
    var e2 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return e2.concat(e1);
    });

    results.messages.assertEqual();
  });

  test('concat return return', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 2),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(240, 3),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e1.concat(e2);
    });

    results.messages.assertEqual(
      onNext(220, 2),
      onNext(240, 3),
      onCompleted(250));
  });

  test('concat throw return', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(230, error));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(240, 2),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e1.concat(e2);
    });

    results.messages.assertEqual(
      onError(230, error));
  });

  test('concat return throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 2),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(250, error));

    var results = scheduler.startScheduler(function () {
      return e1.concat(e2);
    });

    results.messages.assertEqual(
      onNext(220, 2),
      onError(250, error));
  });

  test('concat some data on both sides', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onCompleted(225));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e1.concat(e2);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250));
  });

  test('concat as arguments', function () {
    var scheduler = new TestScheduler();

    var xs1 = scheduler.createColdObservable(
        onNext(10, 1),
        onNext(20, 2),
        onNext(30, 3),
        onCompleted(40)
    );

    var xs2 = scheduler.createColdObservable(
      onNext(10, 4),
      onNext(20, 5),
      onCompleted(30)
    );

    var xs3 = scheduler.createColdObservable(
      onNext(10, 6),
      onNext(20, 7),
      onNext(30, 8),
      onNext(40, 9),
      onCompleted(50)
    );

    var res = scheduler.startScheduler(function () {
      return Observable.concat(xs1, xs2, xs3);
    });

    res.messages.assertEqual(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onNext(250, 4),
      onNext(260, 5),
      onNext(280, 6),
      onNext(290, 7),
      onNext(300, 8),
      onNext(310, 9),
      onCompleted(320)
    );

    xs1.subscriptions.assertEqual(
      subscribe(200, 240)
    );

    xs2.subscriptions.assertEqual(
      subscribe(240, 270)
    );

    xs3.subscriptions.assertEqual(
      subscribe(270, 320)
    );
  });


}());
