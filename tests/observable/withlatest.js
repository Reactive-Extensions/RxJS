QUnit.module('WithLatest');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('WithLatest_NeverNever', function () {
    var e1, e2, results, scheduler;
    scheduler = new TestScheduler();
    e1 = Observable.never();
    e2 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return e1.withLatest(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual();
});

test('WithLatest_NeverEmpty', function () {
    var e1, e2, msgs, results, scheduler;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onCompleted(210)];
    e1 = Observable.never();
    e2 = scheduler.createHotObservable(msgs);
    results = scheduler.startWithCreate(function () {
        return e1.withLatest(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual();
});

test('WithLatest_EmptyNever', function () {
    var e1, e2, msgs, results, scheduler;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onCompleted(210)];
    e1 = Observable.never();
    e2 = scheduler.createHotObservable(msgs);
    results = scheduler.startWithCreate(function () {
        return e2.withLatest(e1, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onCompleted(210));
});

test('WithLatest_EmptyEmpty', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(210)];
    msgs2 = [onNext(150, 1), onCompleted(210)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e2.withLatest(e1, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onCompleted(210));
});

test('WithLatest_EmptyReturn', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(210)];
    msgs2 = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.withLatest(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onCompleted(210));
});

test('WithLatest_ReturnEmpty', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(210)];
    msgs2 = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e2.withLatest(e1, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onCompleted(220));
});

test('WithLatest_NeverReturn', function () {
    var e1, e2, msgs, results, scheduler;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
    e1 = scheduler.createHotObservable(msgs);
    e2 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return e1.withLatest(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onCompleted(220));
});

test('WithLatest_ReturnNever', function () {
    var e1, e2, msgs, results, scheduler;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(215, 2), onCompleted(210)];
    e1 = scheduler.createHotObservable(msgs);
    e2 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return e2.withLatest(e1, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual();
});
test(
    'WithLatest_ReturnReturn', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(220, 2), onCompleted(230)];
    msgs2 = [onNext(150, 1), onNext(215, 3), onCompleted(240)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.withLatest(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onNext(220, 2 + 3), onCompleted(230));
});

test('WithLatest_EmptyError', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(230)];
    msgs2 = [onNext(150, 1), onError(220, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.withLatest(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
});

test('WithLatest_ErrorEmpty', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(230)];
    msgs2 = [onNext(150, 1), onError(220, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e2.withLatest(e1, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
});

test('WithLatest_ReturnThrow', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(230)];
    msgs2 = [onNext(150, 1), onError(220, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.withLatest(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
});

test('WithLatest_ThrowReturn', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(230)];
    msgs2 = [onNext(150, 1), onError(220, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e2.withLatest(e1, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
});

test('WithLatest_ThrowThrow', function () {
    var e1, e2, ex1, ex2, msgs1, msgs2, results, scheduler;
    ex1 = 'ex1';
    ex2 = 'ex2';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onError(220, ex1)];
    msgs2 = [onNext(150, 1), onError(230, ex2)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.withLatest(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex1));
});

test('WithLatest_ErrorThrow', function () {
    var e1, e2, ex1, ex2, msgs1, msgs2, results, scheduler;
    ex1 = 'ex1';
    ex2 = 'ex2';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onError(220, ex1)];
    msgs2 = [onNext(150, 1), onError(230, ex2)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.withLatest(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex1));
});

test('WithLatest_ThrowError', function () {
    var e1, e2, ex1, ex2, msgs1, msgs2, results, scheduler;
    ex1 = 'ex1';
    ex2 = 'ex2';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onError(220, ex1)];
    msgs2 = [onNext(150, 1), onError(230, ex2)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e2.withLatest(e1, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex1));
});

test('WithLatest_NeverThrow', function () {
    var e1, e2, ex, msgs, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onError(220, ex)];
    e1 = Observable.never();
    e2 = scheduler.createHotObservable(msgs);
    results = scheduler.startWithCreate(function () {
        return e1.withLatest(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
});

test('WithLatest_ThrowNever', function () {
    var e1, e2, ex, msgs, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onError(220, ex)];
    e1 = Observable.never();
    e2 = scheduler.createHotObservable(msgs);
    results = scheduler.startWithCreate(function () {
        return e2.withLatest(e1, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
});

test('WithLatest_SomeThrow', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(215, 2), onCompleted(230)];
    msgs2 = [onNext(150, 1), onError(220, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.withLatest(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
});

test('WithLatest_ThrowSome', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(215, 2), onCompleted(230)];
    msgs2 = [onNext(150, 1), onError(220, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e2.withLatest(e1, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
});

test('WithLatest_ThrowAfterCompleteLeft', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
    msgs2 = [onNext(150, 1), onError(230, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.withLatest(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onCompleted(220));
});

test('WithLatest_ThrowAfterCompleteRight', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
    msgs2 = [onNext(150, 1), onError(230, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e2.withLatest(e1, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(230, ex));
});

test('WithLatest_InterleavedWithTail', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(220, 3), onNext(230, 5), onNext(235, 6), onNext(240, 7), onCompleted(250)];
    msgs2 = [onNext(150, 1), onNext(215, 2), onNext(225, 4), onCompleted(230)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.withLatest(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onNext(220, 3 + 2), onNext(230, 5 + 4), onNext(235, 6 + 4), onNext(240, 7 + 4), onCompleted(250));
});

test('WithLatest_Consecutive', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(215, 2), onNext(235, 4), onCompleted(240)];
    msgs2 = [onNext(150, 1), onNext(225, 6), onNext(240, 7), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.withLatest(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onNext(235, 4 + 6), onCompleted(240));
});

test('WithLatest_ConsecutiveEndWithErrorLeft', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(215, 2), onNext(225, 4), onError(230, ex)];
    msgs2 = [onNext(150, 1), onNext(235, 6), onNext(240, 7), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.withLatest(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(230, ex));
});

test('WithLatest_ConsecutiveEndWithErrorRight', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(215, 2), onNext(225, 4), onCompleted(230)];
    msgs2 = [onNext(150, 1), onNext(235, 6), onNext(240, 7), onError(245, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e2.withLatest(e1, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onNext(235, 4 + 6), onNext(240, 4 + 7), onError(245, ex));
});

test('WithLatest_SelectorThrows', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(220, 2), onCompleted(230)];
    msgs2 = [onNext(150, 1), onNext(215, 3), onCompleted(240)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.withLatest(e2, function () {
            throw ex;
        });
    });
    results.messages.assertEqual(onError(220, ex));
});
