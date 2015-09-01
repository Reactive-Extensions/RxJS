(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, ok, equal */
  QUnit.module('merge');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('merge never 2', function () {
    var scheduler = new TestScheduler();

    var n1 = Observable.never();
    var n2 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return Observable.merge(scheduler, n1, n2);
    });

    results.messages.assertEqual();
  });

  test('merge never 3', function () {
    var scheduler = new TestScheduler();

    var n1 = Observable.never();
    var n2 = Observable.never();
    var n3 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return Observable.merge(scheduler, n1, n2, n3);
    });

    results.messages.assertEqual();
  });

  test('merge empty2', function () {
    var scheduler = new TestScheduler();

    var e1 = Observable.empty();
    var e2 = Observable.empty();

    var results = scheduler.startScheduler(function () {
      return Observable.merge(scheduler, e1, e2);
    });

    results.messages.assertEqual(onCompleted(203));
  });

  test('merge empty3', function () {
    var scheduler = new TestScheduler();

    var e1 = Observable.empty();
    var e2 = Observable.empty();
    var e3 = Observable.empty();

    var results = scheduler.startScheduler(function () {
      return Observable.merge(scheduler, e1, e2, e3);
    });

    results.messages.assertEqual(onCompleted(204));
  });

  test('merge empty delayed 2 right last', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(240));
    var e2 = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return Observable.merge(scheduler, e1, e2);
    });

    results.messages.assertEqual(onCompleted(250));
  });

  test('merge empty delayed 2 left last', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    var e2 = scheduler.createHotObservable(onNext(150, 1), onCompleted(240));

    var results = scheduler.startScheduler(function () {
      return Observable.merge(scheduler, e1, e2);
    });

    results.messages.assertEqual(onCompleted(250));
  });

  test('merge empty delayed 3 Middle Last', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(245));
    var e2 = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    var e3 = scheduler.createHotObservable(onNext(150, 1), onCompleted(240));

    var results = scheduler.startScheduler(function () {
      return Observable.merge(scheduler, e1, e2, e3);
    });

    results.messages.assertEqual(onCompleted(250));
  });

  test('merge empty never ', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(245));
    var n1 = Observable.never();

    var results = scheduler.startScheduler(function () {
        return Observable.merge(scheduler, e1, n1);
    });

    results.messages.assertEqual();
  });

  test('merge never empty', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(245));
    var n1 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return Observable.merge(scheduler, n1, e1);
    });

    results.messages.assertEqual();
  });

  test('merge return never ', function () {
    var scheduler = new TestScheduler();

    var r1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(245)
    );
    var n1 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return Observable.merge(scheduler, r1, n1);
    });

    results.messages.assertEqual(onNext(210, 2));
  });

  test('merge never return', function () {
    var scheduler = new TestScheduler();

    var r1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(245)
    );

    var n1 = Observable.never();

    var results = scheduler.startScheduler(function () {
        return Observable.merge(scheduler, n1, r1);
    });

    results.messages.assertEqual(onNext(210, 2));
  });

  test('merge Error never ', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(245, error)
    );
    var n1 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return Observable.merge(scheduler, e1, n1);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onError(245, error)
    );
  });

  test('merge never Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onError(245, error));
    var n1 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return Observable.merge(scheduler, n1, e1);
    });

    results.messages.assertEqual(onNext(210, 2), onError(245, error));
  });

  test('merge emptyreturn', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(245));
    var r1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));

    var results = scheduler.startScheduler(function () {
        return Observable.merge(scheduler, e1, r1);
    });

    results.messages.assertEqual(onNext(210, 2), onCompleted(250));
  });

  test('merge return empty', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(245));
    var r1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));

    var results = scheduler.startScheduler(function () {
        return Observable.merge(scheduler, r1, e1);
    });

    results.messages.assertEqual(onNext(210, 2), onCompleted(250));
  });

  test('merge lots 2', function () {
      var scheduler = new TestScheduler();

      var o1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 4), onNext(230, 6), onNext(240, 8), onCompleted(245));
      var o2 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 3), onNext(225, 5), onNext(235, 7), onNext(245, 9), onCompleted(250));
      var results = scheduler.startScheduler(function () {
          return Observable.merge(scheduler, o1, o2);
      }).messages;

      equal(9, results.length);
      for (var i = 0; i < 8; i++) {
        ok(results[i].value.kind === 'N' && results[i].time === 210 + i * 5 && results[i].value.value === i + 2);
      }
      ok(results[8].value.kind === 'C' && results[8].time === 250);
  });

  test('merge lots 3', function () {
      var scheduler = new TestScheduler();

      var o1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(225, 5), onNext(240, 8), onCompleted(245));
      var o2 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 3), onNext(230, 6), onNext(245, 9), onCompleted(250));
      var o3 = scheduler.createHotObservable(onNext(150, 1), onNext(220, 4), onNext(235, 7), onCompleted(240));

      var results = scheduler.startScheduler(function () {
        return Observable.merge(scheduler, o1, o2, o3);
      }).messages;

      equal(9, results.length);
      for (var i = 0; i < 8; i++) {
        ok(results[i].value.kind === 'N' && results[i].time === 210 + i * 5 && results[i].value.value === i + 2);
      }
      ok(results[8].value.kind === 'C' && results[8].time === 250);
  });

  test('merge Error left', function () {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onError(245, error));
  var o2 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 3), onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return Observable.merge(scheduler, o1, o2);
  });

  results.messages.assertEqual(onNext(210, 2), onNext(215, 3), onError(245, error));
  });

  test('merge Error causes disposal', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var sourceNotDisposed = false;

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );
    var o2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 1),
      onCompleted(250))
      .tap(function () {
        return sourceNotDisposed = true;
    });

    var results = scheduler.startScheduler(function () {
      return Observable.merge(scheduler, o1, o2);
    });

    results.messages.assertEqual(onError(210, error));
    ok(!sourceNotDisposed);
  });

}());
