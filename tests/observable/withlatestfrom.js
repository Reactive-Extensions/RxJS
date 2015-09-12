(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('withLatestFrom');

  var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted;

  function add (x, y) { return x + y; }

  test('withLatestFrom never never', function () {
    var scheduler = new TestScheduler();

    var e1 = Observable.never();
    var e2 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return e1.withLatestFrom(e2, add);
    });

    results.messages.assertEqual();
  });

  test('withLatestFrom never empty', function () {
    var scheduler = new TestScheduler();

    var e1 = Observable.never();

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );

    var results = scheduler.startScheduler(function () {
      return e1.withLatestFrom(e2, add);
    });

    results.messages.assertEqual();
  });

  test('withLatestFrom empty never', function () {
    var scheduler = new TestScheduler();

    var e1 = Observable.never();

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );

    var results = scheduler.startScheduler(function () {
      return e2.withLatestFrom(e1, add);
    });

    results.messages.assertEqual(
      onCompleted(210)
    );
  });

  test('withLatestFrom emptyempty', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );

    var results = scheduler.startScheduler(function () {
      return e2.withLatestFrom(e1, add);
    });

    results.messages.assertEqual(
      onCompleted(210)
    );
  });

  test('withLatestFrom empty return', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(220)
    );

    var results = scheduler.startScheduler(function () {
      return e1.withLatestFrom(e2, add);
    });

    results.messages.assertEqual(
      onCompleted(210)
    );
  });

  test('withLatestFrom return empty', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(220)
    );

    var results = scheduler.startScheduler(function () {
      return e2.withLatestFrom(e1, add);
    });

    results.messages.assertEqual(
      onCompleted(220)
    );
  });

  test('withLatestFrom never return', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(220)
    );

    var e2 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return e1.withLatestFrom(e2, add);
    });

    results.messages.assertEqual(
      onCompleted(220)
    );
  });

  test('withLatestFrom return never', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(210)
    );

    var e2 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return e2.withLatestFrom(e1, add);
    });

    results.messages.assertEqual();
  });

  test('withLatestFrom return return', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 2),
      onCompleted(230)
    );
    
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 3),
      onCompleted(240)
    );

    var results = scheduler.startScheduler(function () {
      return e1.withLatestFrom(e2, add);
    });

    results.messages.assertEqual(
      onNext(220, 2 + 3),
      onCompleted(230)
    );
  });

  test('withLatestFrom empty error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(230)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error)
    );

    var results = scheduler.startScheduler(function () {
      return e1.withLatestFrom(e2, add);
    });

    results.messages.assertEqual(onError(220, error));
  });

  test('withLatestFrom error empty', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(230)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error)
    );

    var results = scheduler.startScheduler(function () {
      return e2.withLatestFrom(e1, add);
    });

    results.messages.assertEqual(onError(220, error));
  });

  test('withLatestFrom return throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(230)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error)
    );

    var results = scheduler.startScheduler(function () {
      return e1.withLatestFrom(e2, add);
    });

    results.messages.assertEqual(
      onError(220, error)
    );
  });

  test('withLatestFrom throw return', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(230)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error)
    );

    var results = scheduler.startScheduler(function () {
      return e2.withLatestFrom(e1, add);
    });

    results.messages.assertEqual(
      onError(220, error)
    );
  });

  test('withLatestFrom throw throw', function () {
    var error1 = new Error('error1');
    var error2 = new Error('error2');

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error1)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(230, error2)
    );

    var results = scheduler.startScheduler(function () {
      return e1.withLatestFrom(e2, add);
    });

    results.messages.assertEqual(
      onError(220, error1)
    );
  });

  test('withLatestFrom error throw', function () {
    var error1 = new Error('error1');
    var error2 = new Error('error2');

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(220, error1)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(230, error2)
    );

    var results = scheduler.startScheduler(function () {
      return e1.withLatestFrom(e2, add);
    });

    results.messages.assertEqual(onError(220, error1));
  });

  test('withLatestFrom throw error', function () {
    var error1 = new Error('error1');
    var error2 = new Error('error2');

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(220, error1)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(230, error2)
    );

    var results = scheduler.startScheduler(function () {
      return e2.withLatestFrom(e1, add);
    });

    results.messages.assertEqual(
      onError(220, error1)
    );
  });

  test('withLatestFrom never throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = Observable.never();

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error)
    );

    var results = scheduler.startScheduler(function () {
      return e1.withLatestFrom(e2, add);
    });

    results.messages.assertEqual(onError(220, error));
  });

  test('withLatestFrom throw never', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = Observable.never();

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error)
    );

    var results = scheduler.startScheduler(function () {
      return e2.withLatestFrom(e1, add);
    });

    results.messages.assertEqual(
      onError(220, error)
    );
  });

  test('withLatestFrom some throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(230)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error)
    );

    var results = scheduler.startScheduler(function () {
      return e1.withLatestFrom(e2, add);
    });

    results.messages.assertEqual(
      onError(220, error)
    );
  });

  test('withLatestFrom throw some', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(230)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error)
    );

    var results = scheduler.startScheduler(function () {
      return e2.withLatestFrom(e1, add);
    });

    results.messages.assertEqual(
      onError(220, error)
    );
  });

  test('withLatestFrom throw after complete left', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(220)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(230, error)
    );

    var results = scheduler.startScheduler(function () {
      return e1.withLatestFrom(e2, add);
    });

    results.messages.assertEqual(
      onCompleted(220)
    );
  });

  test('withLatestFrom throw after complete right', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(220)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(230, error)
    );

    var results = scheduler.startScheduler(function () {
      return e2.withLatestFrom(e1, add);
    });

    results.messages.assertEqual(
      onError(230, error)
    );
  });

  test('withLatestFrom interleaved with tail', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 3),
      onNext(230, 5),
      onNext(235, 6),
      onNext(240, 7),
      onCompleted(250)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onNext(225, 4),
      onCompleted(230)
    );

    var results = scheduler.startScheduler(function () {
      return e1.withLatestFrom(e2, add);
    });

    results.messages.assertEqual(
      onNext(220, 3 + 2),
      onNext(230, 5 + 4),
      onNext(235, 6 + 4),
      onNext(240, 7 + 4),
      onCompleted(250)
    );
  });

  test('withLatestFrom consecutive', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onNext(235, 4),
      onCompleted(240)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(225, 6),
      onNext(240, 7),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return e1.withLatestFrom(e2, add);
    });

    results.messages.assertEqual(
      onNext(235, 4 + 6),
      onCompleted(240)
    );
  });

  test('withLatestFrom consecutiveEndWithErrorLeft', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onNext(225, 4),
      onError(230, error)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(235, 6),
      onNext(240, 7),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function () {
      return e1.withLatestFrom(e2, add);
    });

    results.messages.assertEqual(
      onError(230, error)
    );
  });

  test('withLatestFrom consecutiveEndWithErrorRight', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onNext(225, 4),
      onCompleted(230)
    );

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(235, 6),
      onNext(240, 7),
      onError(245, error)
    );

    var results = scheduler.startScheduler(function () {
      return e2.withLatestFrom(e1, add);
    });

    results.messages.assertEqual(
      onNext(235, 4 + 6),
      onNext(240, 4 + 7),
      onError(245, error)
    );
  });

  test('withLatestFrom selector throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 2),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 3),
      onCompleted(240));

    var results = scheduler.startScheduler(function () {
      return e1.withLatestFrom(e2, function () {
        throw error;
      });
    });

    results.messages.assertEqual(onError(220, error));
  });

}());
