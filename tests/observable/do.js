QUnit.module('Do');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Do_ShouldSeeAllValues', function () {
    var i, scheduler, sum, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    i = 0;
    sum = 2 + 3 + 4 + 5;
    scheduler.startWithCreate(function () {
        return xs.doAction(function (x) {
            i++;
            return sum -= x;
        });
    });
    equal(4, i);
    equal(0, sum);
});

test('Do_PlainAction', function () {
    var i, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    i = 0;
    scheduler.startWithCreate(function () {
        return xs.doAction(function (x) {
            return i++;
        });
    });
    equal(4, i);
});

test('Do_NextCompleted', function () {
    var completed, i, scheduler, sum, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    i = 0;
    sum = 2 + 3 + 4 + 5;
    completed = false;
    scheduler.startWithCreate(function () {
        return xs.doAction(function (x) {
            i++;
            sum -= x;
        }, undefined, function () {
            completed = true;
        });
    });
    equal(4, i);
    equal(0, sum);
    ok(completed);
});

test('Do_NextCompleted_Never', function () {
    var completed, i, scheduler;
    scheduler = new TestScheduler();
    i = 0;
    completed = false;
    scheduler.startWithCreate(function () {
        return Rx.Observable.never().doAction(function (x) {
            i++;
        }, undefined, function () {
            completed = true;
        });
    });
    equal(0, i);
    ok(!completed);
});

test('Do_NextError', function () {
    var ex, i, sawError, scheduler, sum, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onError(250, ex));
    i = 0;
    sum = 2 + 3 + 4 + 5;
    sawError = false;
    scheduler.startWithCreate(function () {
        return xs.doAction(function (x) {
            i++;
            sum -= x;
        }, function (e) {
            sawError = e === ex;
        });
    });
    equal(4, i);
    equal(0, sum);
    ok(sawError);
});

test('Do_NextErrorNot', function () {
    var i, sawError, scheduler, sum, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    i = 0;
    sum = 2 + 3 + 4 + 5;
    sawError = false;
    scheduler.startWithCreate(function () {
        return xs.doAction(function (x) {
            i++;
            sum -= x;
        }, function (e) {
            sawError = true;
        });
    });
    equal(4, i);
    equal(0, sum);
    ok(!sawError);
});

test('Do_NextErrorCompleted', function () {
    var hasCompleted, i, sawError, scheduler, sum, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    i = 0;
    sum = 2 + 3 + 4 + 5;
    sawError = false;
    hasCompleted = false;
    scheduler.startWithCreate(function () {
        return xs.doAction(function (x) {
            i++;
            sum -= x;
        }, function (e) {
            sawError = true;
        }, function () {
            hasCompleted = true;
        });
    });
    equal(4, i);
    equal(0, sum);
    ok(!sawError);
    ok(hasCompleted);
});

test('Do_NextErrorCompletedError', function () {
    var ex, hasCompleted, i, sawError, scheduler, sum, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onError(250, ex));
    i = 0;
    sum = 2 + 3 + 4 + 5;
    sawError = false;
    hasCompleted = false;
    scheduler.startWithCreate(function () {
        return xs.doAction(function (x) {
            i++;
            sum -= x;
        }, function (e) {
            sawError = ex === e;
        }, function () {
            hasCompleted = true;
        });
    });
    equal(4, i);
    equal(0, sum);
    ok(sawError);
    ok(!hasCompleted);
});

test('Do_NextErrorCompletedNever', function () {
    var hasCompleted, i, sawError, scheduler;
    scheduler = new TestScheduler();
    i = 0;
    sawError = false;
    hasCompleted = false;
    scheduler.startWithCreate(function () {
        return Rx.Observable.never().doAction(function (x) {
            i++;
        }, function (e) {
            sawError = true;
        }, function () {
            hasCompleted = true;
        });
    });
    equal(0, i);
    ok(!sawError);
    ok(!hasCompleted);
});

test('Do_Observer_SomeDataWithError', function () {
    var ex, hasCompleted, i, sawError, scheduler, sum, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onError(250, ex));
    i = 0;
    sum = 2 + 3 + 4 + 5;
    sawError = false;
    hasCompleted = false;
    scheduler.startWithCreate(function () {
        return xs.doAction(Rx.Observer.create(function (x) {
            i++;
            sum -= x;
        }, function (e) {
            sawError = e === ex;
        }, function () {
            hasCompleted = true;
        }));
    });
    equal(4, i);
    equal(0, sum);
    ok(sawError);
    ok(!hasCompleted);
});

test('Do_Observer_SomeDataWithError', function () {
    var hasCompleted, i, sawError, scheduler, sum, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    i = 0;
    sum = 2 + 3 + 4 + 5;
    sawError = false;
    hasCompleted = false;
    scheduler.startWithCreate(function () {
        return xs.doAction(Rx.Observer.create(function (x) {
            i++;
            sum -= x;
        }, function (e) {
            sawError = true;
        }, function () {
            hasCompleted = true;
        }));
    });
    equal(4, i);
    equal(0, sum);
    ok(!sawError);
    ok(hasCompleted);
});

test('Do1422_Next_NextThrows', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.doAction(function () {
            throw ex;
        });
    });
    results.messages.assertEqual(onError(210, ex));
});

test('Do1422_NextCompleted_NextThrows', function () {
    var ex, results, scheduler, xs, _undefined;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.doAction(function () {
            throw ex;
        }, _undefined, function () { });
    });
    results.messages.assertEqual(onError(210, ex));
});

test('Do1422_NextCompleted_CompletedThrows', function () {
    var ex, results, scheduler, xs, _undefined;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.doAction(function () { }, _undefined, function () {
            throw ex;
        });
    });
    results.messages.assertEqual(onNext(210, 2), onError(250, ex));
});

test('Do1422_NextError_NextThrows', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.doAction(function () {
            throw ex;
        }, function () { });
    });
    results.messages.assertEqual(onError(210, ex));
});

test('Do1422_NextError_NextThrows', function () {
    var ex1, ex2, results, scheduler, xs;
    ex1 = 'ex1';
    ex2 = 'ex2';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex1));
    results = scheduler.startWithCreate(function () {
        return xs.doAction(function () { }, function () {
            throw ex2;
        });
    });
    results.messages.assertEqual(onError(210, ex2));
});

test('Do1422_NextErrorCompleted_NextThrows', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.doAction(function () {
            throw ex;
        }, function () { }, function () { });
    });
    results.messages.assertEqual(onError(210, ex));
});

test('Do1422_NextErrorCompleted_ErrorThrows', function () {
    var ex1, ex2, results, scheduler, xs;
    ex1 = 'ex1';
    ex2 = 'ex2';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex1));
    results = scheduler.startWithCreate(function () {
        return xs.doAction(function () { }, function () {
            throw ex2;
        }, function () { });
    });
    results.messages.assertEqual(onError(210, ex2));
});

test('Do1422_NextErrorCompleted_CompletedThrows', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.doAction(function () { }, function () { }, function () {
            throw ex;
        });
    });
    results.messages.assertEqual(onNext(210, 2), onError(250, ex));
});

test('Do1422_Observer_NextThrows', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.doAction(Rx.Observer.create(function () {
            throw ex;
        }, function () { }, function () { }));
    });
    results.messages.assertEqual(onError(210, ex));
});

test('Do1422_Observer_ErrorThrows', function () {
    var ex1, ex2, results, scheduler, xs;
    ex1 = 'ex1';
    ex2 = 'ex2';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex1));
    results = scheduler.startWithCreate(function () {
        return xs.doAction(Rx.Observer.create(function () { }, function () {
            throw ex2;
        }, function () { }));
    });
    results.messages.assertEqual(onError(210, ex2));
});

test('Do1422_Observer_CompletedThrows', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.doAction(Rx.Observer.create(function () { }, function () { }, function () {
            throw ex;
        }));
    });
    results.messages.assertEqual(onNext(210, 2), onError(250, ex));
});