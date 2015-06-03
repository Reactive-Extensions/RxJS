QUnit.module('catchErrorProto');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Catch_NoErrors', function () {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onCompleted(230));
  var o2 = scheduler.createHotObservable(
    onNext(240, 5),
    onCompleted(250));

  var results = scheduler.startWithCreate(function () {
      return o1.catchError(o2);
  });

  results.messages.assertEqual(
    onNext(210, 2),
    onNext(220, 3),
    onCompleted(230));
});

test('Catch_Never', function () {
  var scheduler = new TestScheduler();

  var o1 = Observable.never();
  var o2 = scheduler.createHotObservable(
    onNext(240, 5),
    onCompleted(250));

  var results = scheduler.startWithCreate(function () {
    return o1.catchError(o2);
  });

  results.messages.assertEqual();
});

test('Catch_Empty', function () {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(230));
  var o2 = scheduler.createHotObservable(
    onNext(240, 5),
    onCompleted(250));

  var results = scheduler.startWithCreate(function () {
      return o1.catchError(o2);
  });

  results.messages.assertEqual(
    onCompleted(230));
});

test('Catch_Return', function () {
  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(230));

  var o2 = scheduler.createHotObservable(
    onNext(240, 5),
    onCompleted(250));

  var results = scheduler.startWithCreate(function () {
    return o1.catchError(o2);
  });

  results.messages.assertEqual(
    onNext(210, 2),
    onCompleted(230));
});

test('Catch_Error', function () {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onError(230, error));

  var o2 = scheduler.createHotObservable(
    onNext(240, 5),
    onCompleted(250));

  var results = scheduler.startWithCreate(function () {
    return o1.catchError(o2);
  });

  results.messages.assertEqual(
    onNext(210, 2),
    onNext(220, 3),
    onNext(240, 5),
    onCompleted(250));
});

test('Catch_Error_Never', function () {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onError(230, error));

  var o2 = Observable.never();

  var results = scheduler.startWithCreate(function () {
    return o1.catchError(o2);
  });

  results.messages.assertEqual(
    onNext(210, 2),
    onNext(220, 3));
});

test('Catch_Error_Error', function () {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onError(230, new Error()));
  var o2 = scheduler.createHotObservable(onNext(240, 4), onError(250, error));

  var results = scheduler.startWithCreate(function () {
    return o1.catchError(o2);
  });

  results.messages.assertEqual(
    onNext(210, 2),
    onNext(220, 3),
    onNext(240, 4),
    onError(250, error)
  );
});

test('Catch_Multiple', function () {
  var error = new Error();

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(215, error));

  var o2 = scheduler.createHotObservable(
    onNext(220, 3),
    onError(225, error));

  var o3 = scheduler.createHotObservable(
    onNext(230, 4),
    onCompleted(235));

  var results = scheduler.startWithCreate(function () {
    return Observable.catchError(o1, o2, o3);
  });

  results.messages.assertEqual(
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onCompleted(235)
  );
});

test('Catch_ErrorSpecific_Caught', function () {
  var error = new Error();

  var handlerCalled = false;

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onError(230, error)
  );
  var o2 = scheduler.createHotObservable(
    onNext(240, 4),
    onCompleted(250)
  );

  var results = scheduler.startWithCreate(function () {
    return o1.catchError(function () {
      handlerCalled = true;
      return o2;
    });
  });

  results.messages.assertEqual(
    onNext(210, 2),
    onNext(220, 3),
    onNext(240, 4),
    onCompleted(250)
  );

  ok(handlerCalled);
});

test('Catch_ErrorSpecific_CaughtImmediate', function () {
  var error = new Error();

  var handlerCalled = false;

  var scheduler = new TestScheduler();

  var o2 = scheduler.createHotObservable(
    onNext(240, 4),
    onCompleted(250));

  var results = scheduler.startWithCreate(function () {
    return Observable.throwError(new Error()).catchError(function () {
      handlerCalled = true;
      return o2;
    });
  });

  results.messages.assertEqual(onNext(240, 4), onCompleted(250));
  ok(handlerCalled);
});

test('Catch_HandlerThrows', function () {
  var error = new Error();

  var error2 = new Error();

  var handlerCalled = false;

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onError(230, error));

  var results = scheduler.startWithCreate(function () {
    return o1.catchError(function (e) {
      handlerCalled = true;
      throw error2;
    });
  });

  results.messages.assertEqual(
    onNext(210, 2),
    onNext(220, 3),
    onError(230, error2));

  ok(handlerCalled);
});

test('Catch_Nested_OuterCatches', function () {
  var error = new Error();

  var firstHandlerCalled = false;
  var secondHandlerCalled = false;

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(215, error));

  var o2 = scheduler.createHotObservable(
    onNext(220, 3),
    onCompleted(225));

  var o3 = scheduler.createHotObservable(
    onNext(220, 4),
    onCompleted(225));

  var results = scheduler.startWithCreate(function () {
    return o1.catchError(function (e) {
      firstHandlerCalled = true;
      return o2;
    }).catchError(function (e) {
      secondHandlerCalled = true;
      return o3;
    });
  });

  results.messages.assertEqual
  (onNext(210, 2),
  onNext(220, 3),
  onCompleted(225));

  ok(firstHandlerCalled);
  ok(!secondHandlerCalled);
});

test('Catch_ThrowFromNestedCatch', function () {
  var error = new Error();

  var error2 = new Error();

  var firstHandlerCalled = false;
  var secondHandlerCalled = false;

  var scheduler = new TestScheduler();

  var o1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onError(215, error));

  var o2 = scheduler.createHotObservable(
    onNext(220, 3),
    onError(225, error2));

  var o3 = scheduler.createHotObservable(
    onNext(230, 4),
    onCompleted(235));

  var results = scheduler.startWithCreate(function () {
    return o1.catchError(function (e) {
      firstHandlerCalled = true;
      equal(e, error);
      return o2;
    }).catchError(function (e) {
      secondHandlerCalled = true;
      equal(e, error2);
      return o3;
    });
  });

  results.messages.assertEqual(
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onCompleted(235));

  ok(firstHandlerCalled);
  ok(secondHandlerCalled);
});

test("Rx.Observable.catchError() does not lose subscription to underlying observable", 12, function () {
    var subscribes = 0,
      unsubscribes = 0,
      tracer = Rx.Observable.create(function (observer) { ++subscribes; return function () { ++unsubscribes; }; }),
      s;

    // Try it without catchError()
    s = tracer.subscribe();
    strictEqual(subscribes, 1, "1 subscribes");
    strictEqual(unsubscribes, 0, "0 unsubscribes");
    s.dispose();
    strictEqual(subscribes, 1, "After dispose: 1 subscribes");
    strictEqual(unsubscribes, 1, "After dispose: 1 unsubscribes");

    // Now try again with catchError(Observable):
    subscribes = unsubscribes = 0;
    s = tracer.catchError(Rx.Observable.never()).subscribe();
    strictEqual(subscribes, 1, "catchError(Observable): 1 subscribes");
    strictEqual(unsubscribes, 0, "catchError(Observable): 0 unsubscribes");
    s.dispose();
    strictEqual(subscribes, 1, "catchError(Observable): After dispose: 1 subscribes");
    strictEqual(unsubscribes, 1, "catchError(Observable): After dispose: 1 unsubscribes");

    // And now try again with catchError(function()):
    subscribes = unsubscribes = 0;
    s = tracer.catchError(function () { return Rx.Observable.never(); }).subscribe();
    strictEqual(subscribes, 1, "catchError(function): 1 subscribes");
    strictEqual(unsubscribes, 0, "catchError(function): 0 unsubscribes");
    s.dispose();
    strictEqual(subscribes, 1, "catchError(function): After dispose: 1 subscribes");
    strictEqual(unsubscribes, 1, "catchError(function): After dispose: 1 unsubscribes"); // this one FAILS (unsubscribes is 0)
});
