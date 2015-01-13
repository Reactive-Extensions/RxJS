(function () {
  QUnit.module('WithLatestFrom');

  var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

  test('WithLatestFrom_NeverNever', function () {
    var scheduler = new TestScheduler();

    var e1 = Observable.never();
    var e2 = Observable.never();

    var results = scheduler.startWithCreate(function () {
      return e1.withLatestFrom(e2, function (x, y) {
        return x + y;
      });
    });

    results.messages.assertEqual();
  });

  test('WithLatestFrom_NeverEmpty', function () {
    var scheduler = new TestScheduler();

    var e1 = Observable.never();
    var e2 = scheduler.createHotObservable(onNext(150, 1), onCompleted(210));
    var results = scheduler.startWithCreate(function () {
      return e1.withLatestFrom(e2, function (x, y) {
        return x + y;
      });
    });

    results.messages.assertEqual();
  });

  test('WithLatestFrom_EmptyNever', function () {
    var scheduler = new TestScheduler();

    var e1 = Observable.never();
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );

    var results = scheduler.startWithCreate(function () {
      return e2.withLatestFrom(e1, function (x, y) {
        return x + y;
      });
    });

    results.messages.assertEqual(
      onCompleted(210)
    );
  });

  test('WithLatestFrom_EmptyEmpty', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );

    var results = scheduler.startWithCreate(function () {
      return e2.withLatestFrom(e1, function (x, y) {
        return x + y;
      });
    });

    results.messages.assertEqual(
      onCompleted(210)
    );
  });

  test('WithLatestFrom_EmptyReturn', function () {
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

    var results = scheduler.startWithCreate(function () {
      return e1.withLatestFrom(e2, function (x, y) {
        return x + y;
      });
    });

    results.messages.assertEqual(
      onCompleted(210)
    );
  });

  test('WithLatestFrom_ReturnEmpty', function () {
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

    var results = scheduler.startWithCreate(function () {
      return e2.withLatestFrom(e1, function (x, y) {
        return x + y;
      });
    });

    results.messages.assertEqual(
      onCompleted(220)
    );
  });

  test('WithLatestFrom_NeverReturn', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(220)
    );
    var e2 = Observable.never();

    var results = scheduler.startWithCreate(function () {
      return e1.withLatestFrom(e2, function (x, y) {
        return x + y;
      });
    });

    results.messages.assertEqual(
      onCompleted(220)
    );
  });

  test('WithLatestFrom_ReturnNever', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(210)
    );
    var e2 = Observable.never();

    var results = scheduler.startWithCreate(function () {
      return e2.withLatestFrom(e1, function (x, y) {
        return x + y;
      });
    });
    results.messages.assertEqual();
  });

  test('WithLatestFrom_ReturnReturn', function () {
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

      var results = scheduler.startWithCreate(function () {
        return e1.withLatestFrom(e2, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(
        onNext(220, 2 + 3),
        onCompleted(230)
      );
    });

    test('WithLatestFrom_EmptyError', function () {
      var error = new Error();

      var scheduler = new TestScheduler();

      var e1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(230));
      var e2 = scheduler.createHotObservable(onNext(150, 1), onError(220, error));

      var results = scheduler.startWithCreate(function () {
        return e1.withLatestFrom(e2, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(onError(220, error));
    });

    test('WithLatestFrom_ErrorEmpty', function () {
      var error = new Error();

      var scheduler = new TestScheduler();

      var e1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(230));
      var e2 = scheduler.createHotObservable(onNext(150, 1), onError(220, error));

      var results = scheduler.startWithCreate(function () {
        return e2.withLatestFrom(e1, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(onError(220, error));
    });

    test('WithLatestFrom_ReturnThrow', function () {
      var error = new Error();

      var scheduler = new TestScheduler();

      var e1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(230));
      var e2 = scheduler.createHotObservable(onNext(150, 1), onError(220, error));

      var results = scheduler.startWithCreate(function () {
        return e1.withLatestFrom(e2, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(onError(220, error));
    });

    test('WithLatestFrom_ThrowReturn', function () {
      var error = new Error();

      var scheduler = new TestScheduler();

      var e1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(230));
      var e2 = scheduler.createHotObservable(onNext(150, 1), onError(220, error));

      var results = scheduler.startWithCreate(function () {
        return e2.withLatestFrom(e1, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(onError(220, error));
    });

    test('WithLatestFrom_ThrowThrow', function () {
      var error1 = new Error('error1');
      var error2 = new Error('error2');

      var scheduler = new TestScheduler();

      var e1 = scheduler.createHotObservable(onNext(150, 1), onError(220, error1));
      var e2 = scheduler.createHotObservable(onNext(150, 1), onError(230, error2));

      var results = scheduler.startWithCreate(function () {
        return e1.withLatestFrom(e2, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(onError(220, error1));
    });

    test('WithLatestFrom_ErrorThrow', function () {
      var error1 = new Error('error1');
      var error2 = new Error('error2');

      var scheduler = new TestScheduler();

      var e1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onError(220, error1));
      var e2 = scheduler.createHotObservable(onNext(150, 1), onError(230, error2));

      var results = scheduler.startWithCreate(function () {
        return e1.withLatestFrom(e2, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(onError(220, error1));
    });

    test('WithLatestFrom_ThrowError', function () {
      var error1 = new Error('error1');
      var error2 = new Error('error2');

      var scheduler = new TestScheduler();

      var e1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onError(220, error1));
      var e2 = scheduler.createHotObservable(onNext(150, 1), onError(230, error2));
      var results = scheduler.startWithCreate(function () {
        return e2.withLatestFrom(e1, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(onError(220, error1));
    });

    test('WithLatestFrom_NeverThrow', function () {
      var error = new Error();

      var scheduler = new TestScheduler();

      var e1 = Observable.never();
      var e2 = scheduler.createHotObservable(onNext(150, 1), onError(220, error));

      var results = scheduler.startWithCreate(function () {
        return e1.withLatestFrom(e2, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(onError(220, error));
    });

    test('WithLatestFrom_ThrowNever', function () {
      var error = new Error();

      var scheduler = new TestScheduler();

      var e1 = Observable.never();
      var e2 = scheduler.createHotObservable(onNext(150, 1), onError(220, error));

      var results = scheduler.startWithCreate(function () {
        return e2.withLatestFrom(e1, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(onError(220, error));
    });

    test('WithLatestFrom_SomeThrow', function () {
      var error = new Error();

      var scheduler = new TestScheduler();

      var e1 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onCompleted(230));
      var e2 = scheduler.createHotObservable(onNext(150, 1), onError(220, error));

      var results = scheduler.startWithCreate(function () {
        return e1.withLatestFrom(e2, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(onError(220, error));
    });

    test('WithLatestFrom_ThrowSome', function () {
      var error = new Error();

      var scheduler = new TestScheduler();

      var e1 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onCompleted(230));
      var e2 = scheduler.createHotObservable(onNext(150, 1), onError(220, error));

      var results = scheduler.startWithCreate(function () {
        return e2.withLatestFrom(e1, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(onError(220, error));
    });

    test('WithLatestFrom_ThrowAfterCompleteLeft', function () {
      var error = new Error();

      var scheduler = new TestScheduler();

      var e1 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onCompleted(220));
      var e2 = scheduler.createHotObservable(onNext(150, 1), onError(230, error));

      var results = scheduler.startWithCreate(function () {
        return e1.withLatestFrom(e2, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(onCompleted(220));
    });

    test('WithLatestFrom_ThrowAfterCompleteRight', function () {
      var error = new Error();

      var scheduler = new TestScheduler();

      var e1 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onCompleted(220));
      var e2 = scheduler.createHotObservable(onNext(150, 1), onError(230, error));

      var results = scheduler.startWithCreate(function () {
        return e2.withLatestFrom(e1, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(onError(230, error));
    });

    test('WithLatestFrom_InterleavedWithTail', function () {
      var scheduler = new TestScheduler();

      var e1 = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(220, 3),
        onNext(230, 5),
        onNext(235, 6),
        onNext(240, 7),
        onCompleted(250));
      var e2 = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(215, 2),
        onNext(225, 4),
        onCompleted(230));

      var results = scheduler.startWithCreate(function () {
        return e1.withLatestFrom(e2, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(
        onNext(220, 3 + 2),
        onNext(230, 5 + 4),
        onNext(235, 6 + 4),
        onNext(240, 7 + 4),
        onCompleted(250));
    });

    test('WithLatestFrom_Consecutive', function () {
      var scheduler = new TestScheduler();

      var e1 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onNext(235, 4), onCompleted(240));
      var e2 = scheduler.createHotObservable(onNext(150, 1), onNext(225, 6), onNext(240, 7), onCompleted(250));

      var results = scheduler.startWithCreate(function () {
        return e1.withLatestFrom(e2, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(onNext(235, 4 + 6), onCompleted(240));
    });

    test('WithLatestFrom_ConsecutiveEndWithErrorLeft', function () {
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

      var results = scheduler.startWithCreate(function () {
        return e1.withLatestFrom(e2, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(onError(230, error));
    });

    test('WithLatestFrom_ConsecutiveEndWithErrorRight', function () {
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

      var results = scheduler.startWithCreate(function () {
        return e2.withLatestFrom(e1, function (x, y) {
          return x + y;
        });
      });

      results.messages.assertEqual(
        onNext(235, 4 + 6),
        onNext(240, 4 + 7),
        onError(245, error));
    });

    test('WithLatestFrom_SelectorThrows', function () {
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

      var results = scheduler.startWithCreate(function () {
        return e1.withLatestFrom(e2, function () {
          throw error;
        });
      });

      results.messages.assertEqual(onError(220, error));
    });

}());
