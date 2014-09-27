QUnit.module('CatchExceptionProto');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Catch_NoErrors', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(230));
    var o2 = scheduler.createHotObservable(onNext(240, 5), onCompleted(250));

    var results = scheduler.startWithCreate(function () {
        return o1.catchException(o2);
    });

    results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onCompleted(230));
});

test('Catch_Never', function () {
    var scheduler = new TestScheduler();

    var o1 = Observable.never();
    var o2 = scheduler.createHotObservable(onNext(240, 5), onCompleted(250));

    var results = scheduler.startWithCreate(function () {
        return o1.catchException(o2);
    });

    results.messages.assertEqual();
});

test('Catch_Empty', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(230));
    var o2 = scheduler.createHotObservable(onNext(240, 5), onCompleted(250));

    var results = scheduler.startWithCreate(function () {
        return o1.catchException(o2);
    });

    results.messages.assertEqual(onCompleted(230));
});

test('Catch_Return', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(230));
    var o2 = scheduler.createHotObservable(onNext(240, 5), onCompleted(250));

    var results = scheduler.startWithCreate(function () {
        return o1.catchException(o2);
    });

    results.messages.assertEqual(onNext(210, 2), onCompleted(230));
});

test('Catch_Error', function () {
    var ex, msgs1, msgs2, o1, o2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onError(230, ex)];
    msgs2 = [onNext(240, 5), onCompleted(250)];
    o1 = scheduler.createHotObservable(msgs1);
    o2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return o1.catchException(o2);
    });
    results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(240, 5), onCompleted(250));
});

test('Catch_Error_Never', function () {
    var ex, msgs1, o1, o2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onError(230, ex)];
    o1 = scheduler.createHotObservable(msgs1);
    o2 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return o1.catchException(o2);
    });
    results.messages.assertEqual(onNext(210, 2), onNext(220, 3));
});

test('Catch_Error_Error', function () {
    var ex, msgs1, msgs2, o1, o2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onError(230, 'ex1')];
    msgs2 = [onNext(240, 4), onError(250, ex)];
    o1 = scheduler.createHotObservable(msgs1);
    o2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return o1.catchException(o2);
    });
    results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(240, 4), onError(250, ex));
});

test('Catch_Multiple', function () {
    var ex, msgs1, msgs2, msgs3, o1, o2, o3, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onError(215, ex)];
    msgs2 = [onNext(220, 3), onError(225, ex)];
    msgs3 = [onNext(230, 4), onCompleted(235)];
    o1 = scheduler.createHotObservable(msgs1);
    o2 = scheduler.createHotObservable(msgs2);
    o3 = scheduler.createHotObservable(msgs3);
    results = scheduler.startWithCreate(function () {
        return Observable.catchException(o1, o2, o3);
    });
    results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(235));
});

test('Catch_ErrorSpecific_Caught', function () {
    var ex, handlerCalled, msgs1, msgs2, o1, o2, results, scheduler;
    ex = 'ex';
    handlerCalled = false;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onError(230, ex)];
    msgs2 = [onNext(240, 4), onCompleted(250)];
    o1 = scheduler.createHotObservable(msgs1);
    o2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return o1.catchException(function (e) {
            handlerCalled = true;
            return o2;
        });
    });
    results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(240, 4), onCompleted(250));
    ok(handlerCalled);
});

test('Catch_ErrorSpecific_CaughtImmediate', function () {
    var ex, handlerCalled, msgs2, o2, results, scheduler;
    ex = 'ex';
    handlerCalled = false;
    scheduler = new TestScheduler();
    msgs2 = [onNext(240, 4), onCompleted(250)];
    o2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return Observable.throwException('ex').catchException(function (e) {
            handlerCalled = true;
            return o2;
        });
    });
    results.messages.assertEqual(onNext(240, 4), onCompleted(250));
    ok(handlerCalled);
});

test('Catch_HandlerThrows', function () {
    var ex, ex2, handlerCalled, msgs1, o1, results, scheduler;
    ex = 'ex';
    ex2 = 'ex2';
    handlerCalled = false;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onError(230, ex)];
    o1 = scheduler.createHotObservable(msgs1);
    results = scheduler.startWithCreate(function () {
        return o1.catchException(function (e) {
            handlerCalled = true;
            throw ex2;
        });
    });
    results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onError(230, ex2));
    ok(handlerCalled);
});

test('Catch_Nested_OuterCatches', function () {
    var ex, firstHandlerCalled, msgs1, msgs2, msgs3, o1, o2, o3, results, scheduler, secondHandlerCalled;
    ex = 'ex';
    firstHandlerCalled = false;
    secondHandlerCalled = false;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onError(215, ex)];
    msgs2 = [onNext(220, 3), onCompleted(225)];
    msgs3 = [onNext(220, 4), onCompleted(225)];
    o1 = scheduler.createHotObservable(msgs1);
    o2 = scheduler.createHotObservable(msgs2);
    o3 = scheduler.createHotObservable(msgs3);
    results = scheduler.startWithCreate(function () {
        return o1.catchException(function (e) {
            firstHandlerCalled = true;
            return o2;
        }).catchException(function (e) {
            secondHandlerCalled = true;
            return o3;
        });
    });
    results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onCompleted(225));
    ok(firstHandlerCalled);
    ok(!secondHandlerCalled);
});

test('Catch_ThrowFromNestedCatch', function () {
    var ex, ex2, firstHandlerCalled, msgs1, msgs2, msgs3, o1, o2, o3, results, scheduler, secondHandlerCalled;
    ex = 'ex';
    ex2 = 'ex';
    firstHandlerCalled = false;
    secondHandlerCalled = false;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onError(215, ex)];
    msgs2 = [onNext(220, 3), onError(225, ex2)];
    msgs3 = [onNext(230, 4), onCompleted(235)];
    o1 = scheduler.createHotObservable(msgs1);
    o2 = scheduler.createHotObservable(msgs2);
    o3 = scheduler.createHotObservable(msgs3);
    results = scheduler.startWithCreate(function () {
        return o1.catchException(function (e) {
            firstHandlerCalled = true;
            equal(e, ex);
            return o2;
        }).catchException(function (e) {
            secondHandlerCalled = true;
            equal(e, ex2);
            return o3;
        });
    });
    results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(235));
    ok(firstHandlerCalled);
    ok(secondHandlerCalled);
});

test("Rx.Observable.catchException() does not lose subscription to underlying observable", 12, function () {
    var subscribes = 0,
            unsubscribes = 0,
            tracer = Rx.Observable.create(function (observer) { ++subscribes; return function () { ++unsubscribes; }; }),
            s;

    // Try it without catchException()
    s = tracer.subscribe();
    strictEqual(subscribes, 1, "1 subscribes");
    strictEqual(unsubscribes, 0, "0 unsubscribes");
    s.dispose();
    strictEqual(subscribes, 1, "After dispose: 1 subscribes");
    strictEqual(unsubscribes, 1, "After dispose: 1 unsubscribes");

    // Now try again with catchException(Observable):
    subscribes = unsubscribes = 0;
    s = tracer.catchException(Rx.Observable.never()).subscribe();
    strictEqual(subscribes, 1, "catchException(Observable): 1 subscribes");
    strictEqual(unsubscribes, 0, "catchException(Observable): 0 unsubscribes");
    s.dispose();
    strictEqual(subscribes, 1, "catchException(Observable): After dispose: 1 subscribes");
    strictEqual(unsubscribes, 1, "catchException(Observable): After dispose: 1 unsubscribes");

    // And now try again with catchException(function()):
    subscribes = unsubscribes = 0;
    s = tracer.catchException(function () { return Rx.Observable.never(); }).subscribe();
    strictEqual(subscribes, 1, "catchException(function): 1 subscribes");
    strictEqual(unsubscribes, 0, "catchException(function): 0 unsubscribes");
    s.dispose();
    strictEqual(subscribes, 1, "catchException(function): After dispose: 1 subscribes");
    strictEqual(unsubscribes, 1, "catchException(function): After dispose: 1 unsubscribes"); // this one FAILS (unsubscribes is 0)
});
