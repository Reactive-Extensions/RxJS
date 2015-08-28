(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('forkJoin');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  function add(x, y) { return x + y; }

  test('forkJoin n-ary parameters', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onNext(225, 4),
      onCompleted(230));

    var o2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(235, 6),
      onNext(240, 7),
      onCompleted(250));

    var o3 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(230, 3),
      onNext(245, 5),
      onCompleted(270));

    var results = scheduler.startScheduler(function () {
      return Observable.forkJoin(o1, o2, o3);
    });

    results.messages.assertEqual(
      onNext(270, [4,7,5]),
      onCompleted(270)
    );
  });

  test('forkJoin n-ary parameters empty', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onNext(225, 4),
      onCompleted(230));

    var o2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(235, 6),
      onNext(240, 7),
      onCompleted(250));

    var o3 = scheduler.createHotObservable(
      onCompleted(270));

    var results = scheduler.startScheduler(function () {
      return Observable.forkJoin(o1, o2, o3);
    });

    results.messages.assertEqual(
      onCompleted(270)
    );
  });

  test('forkJoin n-ary parameters empty before end', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onNext(225, 4),
      onCompleted(230));

    var o2 = scheduler.createHotObservable(
      onCompleted(235));

    var o3 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(230, 3),
      onNext(245, 5),
      onCompleted(270));

    var results = scheduler.startScheduler(function () {
      return Observable.forkJoin(o1, o2, o3);
    });

    results.messages.assertEqual(
      onCompleted(235)
    );
  });

  test('forkJoin empty empty', function () {
    var scheduler = new TestScheduler();

    var o = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(230));

    var e = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e.forkJoin(o, add);
    });

    results.messages.assertEqual(
      onCompleted(250));
  });

  test('forkJoin none', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startScheduler(function () {
      return Observable.forkJoin();
    });

    results.messages.assertEqual(
      onCompleted(200));
  });

  test('forkJoin empty return', function () {
    var scheduler = new TestScheduler();

    var o = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(230));

    var e = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e.forkJoin(o, add);
    });

    results.messages.assertEqual(
      onCompleted(250));
  });

  test('forkJoin return empty', function () {
    var scheduler = new TestScheduler();

    var o = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(230));

    var e = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e.forkJoin(o, add);
    });

    results.messages.assertEqual(
      onCompleted(250));
  });

  test('forkJoin return return', function () {
    var scheduler = new TestScheduler();

    var o = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(230));

    var e = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 3),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e.forkJoin(o, add);
    });

    results.messages.assertEqual(
      onNext(250, 2 + 3),
      onCompleted(250));
  });

  test('forkJoin empty throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var o = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(230));

    var e = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e.forkJoin(o, add);
    });

    results.messages.assertEqual(
      onError(210, error));
  });

  test('forkJoin throw empty', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var o = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error),
      onCompleted(230));

    var e = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e.forkJoin(o, add);
    });

    results.messages.assertEqual(
      onError(210, error));
  });

  test('forkJoin ReturnThrow', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var o = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(230));

    var e = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e.forkJoin(o, add);
    });

    results.messages.assertEqual(
      onError(220, error));
  });

  test('forkJoin ThrowReturn', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var o = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error),
      onCompleted(230));

    var e = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e.forkJoin(o, add);
    });

    results.messages.assertEqual(
      onError(220, error));
  });

  test('forkJoin binary', function () {
    var scheduler = new TestScheduler();

    var o = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onNext(225, 4),
      onCompleted(230));

    var e = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(235, 6),
      onNext(240, 7),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e.forkJoin(o, add);
    });

    results.messages.assertEqual(
      onNext(250, 4 + 7),
      onCompleted(250));
  });

}());
