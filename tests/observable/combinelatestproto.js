(function () {
  QUnit.module('combineLatest');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  function add(x, y) { return x + y; }

  test('combineLatest never never', function () {
    var scheduler = new TestScheduler();

    var e1 = Observable.never();
    var e2 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return e1.combineLatest(e2, add);
    });

    results.messages.assertEqual();
  });

  test('combineLatest never empty', function () {
    var scheduler = new TestScheduler();

    var e1 = Observable.never();
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210));

    var results = scheduler.startScheduler(function () {
      return e1.combineLatest(e2, add);
    });
    results.messages.assertEqual();
  });

  test('combineLatest empty never', function () {
    var scheduler = new TestScheduler();

    var e1 = Observable.never();
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210));

    var results = scheduler.startScheduler(function () {
      return e2.combineLatest(e1, add);
    });

    results.messages.assertEqual();
  });

  test('combineLatest empty empty', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210));

    var results = scheduler.startScheduler(function () {
      return e2.combineLatest(e1, add);
    });

    results.messages.assertEqual(
      onCompleted(210));
  });

  test('combineLatest empty return', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(220));

    var results = scheduler.startScheduler(function () {
      return e1.combineLatest(e2, add);
    });

    results.messages.assertEqual(
      onCompleted(215));
  });

  test('combineLatest return empty', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(220));

    var results = scheduler.startScheduler(function () {
      return e2.combineLatest(e1, add);
    });

    results.messages.assertEqual(
      onCompleted(215));
  });

  test('combineLatest never return', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(220));
    var e2 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return e1.combineLatest(e2, add);
    });

    results.messages.assertEqual();
  });

  test('combineLatest return never', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(210));
    var e2 = Observable.never();

    var results = scheduler.startScheduler(function () {
      return e2.combineLatest(e1, add);
    });

    results.messages.assertEqual();
  });

  test('combineLatest return return', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 3),
      onCompleted(240));

    var results = scheduler.startScheduler(function () {
      return e1.combineLatest(e2, add);
    });

    results.messages.assertEqual(
      onNext(220, 2 + 3),
      onCompleted(240));
  });

  test('combineLatest empty error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error));

    var results = scheduler.startScheduler(function () {
      return e1.combineLatest(e2, add);
    });

    results.messages.assertEqual(
      onError(220, error));
  });

  test('combineLatest error empty', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error));

    var results = scheduler.startScheduler(function () {
      return e2.combineLatest(e1, add);
    });

    results.messages.assertEqual(
      onError(220, error));
  });

  test('combineLatest return throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error));

    var results = scheduler.startScheduler(function () {
      return e1.combineLatest(e2, add);
    });

    results.messages.assertEqual(
      onError(220, error));
  });

  test('combineLatest throw return', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error));

    var results = scheduler.startScheduler(function () {
      return e2.combineLatest(e1, add);
    });

    results.messages.assertEqual(
      onError(220, error));
  });

  test('combineLatest throw throw', function () {
    var error1 = new Error();
    var error2 = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error1));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(230, error2));

    var results = scheduler.startScheduler(function () {
      return e1.combineLatest(e2, add);
    });

    results.messages.assertEqual(
      onError(220, error1));
  });

  test('combineLatest ErrorThrow', function () {
    var error1 = new Error();
    var error2 = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(220, error1));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(230, error2));

    var results = scheduler.startScheduler(function () {
      return e1.combineLatest(e2, add);
    });

    results.messages.assertEqual(
      onError(220, error1));
  });

  test('combineLatest throw error', function () {
    var error1 = new Error();
    var error2 = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(220, error1));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(230, error2));

    var results = scheduler.startScheduler(function () {
      return e2.combineLatest(e1, add);
    });

    results.messages.assertEqual(
      onError(220, error1));
  });

  test('combineLatest never throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = Observable.never();
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error));

    var results = scheduler.startScheduler(function () {
      return e1.combineLatest(e2, add);
    });

    results.messages.assertEqual(
      onError(220, error));
  });

  test('combineLatest throw never', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = Observable.never();
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error));

    var results = scheduler.startScheduler(function () {
      return e2.combineLatest(e1, add);
    });

    results.messages.assertEqual(
      onError(220, error));
  });

  test('combineLatest some throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error));

    var results = scheduler.startScheduler(function () {
      return e1.combineLatest(e2, add);
    });

    results.messages.assertEqual(
      onError(220, error));
  });

  test('combineLatest throw some', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error));

    var results = scheduler.startScheduler(function () {
      return e2.combineLatest(e1, add);
    });

    results.messages.assertEqual(
      onError(220, error));
  });

  test('combineLatest throw after complete left', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(220));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(230, error));

    var results = scheduler.startScheduler(function () {
      return e1.combineLatest(e2, add);
    });

    results.messages.assertEqual(
      onError(230, error));
  });

  test('combineLatest throw after complete right', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(220));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(230, error));

    var results = scheduler.startScheduler(function () {
      return e2.combineLatest(e1, add);
    });

    results.messages.assertEqual(
      onError(230, error));
  });

  test('combineLatest interleaved with tail', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onNext(225, 4),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 3),
      onNext(230, 5),
      onNext(235, 6),
      onNext(240, 7),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e1.combineLatest(e2, add);
    });

    results.messages.assertEqual(
      onNext(220, 2 + 3),
      onNext(225, 3 + 4),
      onNext(230, 4 + 5),
      onNext(235, 4 + 6),
      onNext(240, 4 + 7),
      onCompleted(250));
  });

  test('combineLatest consecutive', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onNext(225, 4),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(235, 6),
      onNext(240, 7),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e1.combineLatest(e2, add);
    });

    results.messages.assertEqual(
      onNext(235, 4 + 6),
      onNext(240, 4 + 7),
      onCompleted(250));
  });

  test('combineLatest consecutive end with error left', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onNext(225, 4),
      onError(230, error));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(235, 6),
      onNext(240, 7),
      onCompleted(250));

    var results = scheduler.startScheduler(function () {
      return e1.combineLatest(e2, add);
    });

    results.messages.assertEqual(
      onError(230, error));
  });

  test('combineLatest consecutive end with error right', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onNext(225, 4),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(235, 6),
      onNext(240, 7),
      onError(245, error));

    var results = scheduler.startScheduler(function () {
      return e2.combineLatest(e1, add);
    });

    results.messages.assertEqual(
      onNext(235, 4 + 6),
      onNext(240, 4 + 7),
      onError(245, error));
  });

  test('combineLatest selector throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(230));
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 3),
      onCompleted(240));

    var results = scheduler.startScheduler(function () {
      return e1.combineLatest(e2, function () { throw error; });
    });

    results.messages.assertEqual(
      onError(220, error));
  });

}());
