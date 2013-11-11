QUnit.module('Merge');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Merge_Never2', function () {
    var scheduler = new TestScheduler();

    var n1 = Observable.never();
    var n2 = Observable.never();
    
    var results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, n1, n2);
    });

    results.messages.assertEqual();
});

test('Merge_Never3', function () {
    var scheduler = new TestScheduler();

    var n1 = Observable.never();
    var n2 = Observable.never();
    var n3 = Observable.never();
    
    var results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, n1, n2, n3);
    });

    results.messages.assertEqual();
});

test('Merge_Empty2', function () {
    var scheduler = new TestScheduler();

    var e1 = Observable.empty();
    var e2 = Observable.empty();

    var results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, e1, e2);
    });
    
    results.messages.assertEqual(onCompleted(203));
});

test('Merge_Empty3', function () {
    var scheduler = new TestScheduler();
    
    var e1 = Observable.empty();
    var e2 = Observable.empty();
    var e3 = Observable.empty();

    var results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, e1, e2, e3);
    });

    results.messages.assertEqual(onCompleted(204));
});

test('Merge_EmptyDelayed2_RightLast', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(240));
    var e2 = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    
    var results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, e1, e2);
    });

    results.messages.assertEqual(onCompleted(250));
});

test('Merge_EmptyDelayed2_LeftLast', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    var e2 = scheduler.createHotObservable(onNext(150, 1), onCompleted(240));
    
    var results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, e1, e2);
    });

    results.messages.assertEqual(onCompleted(250));
});

test('Merge_EmptyDelayed3_MiddleLast', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(245));
    var e2 = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    var e3 = scheduler.createHotObservable(onNext(150, 1), onCompleted(240));
    
    var results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, e1, e2, e3);
    });

    results.messages.assertEqual(onCompleted(250));
});

test('Merge_EmptyNever', function () {
    var scheduler = new TestScheduler();
    
    var e1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(245));
    var n1 = Observable.never();
    
    var results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, e1, n1);
    });

    results.messages.assertEqual();
});

test('Merge_NeverEmpty', function () {
    var scheduler = new TestScheduler();
    
    var e1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(245));
    var n1 = Observable.never();
    
    var results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, n1, e1);
    });
    
    results.messages.assertEqual();
});

test('Merge_ReturnNever', function () {
    var msgs1, n1, r1, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(245)];
    r1 = scheduler.createHotObservable(msgs1);
    n1 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, r1, n1);
    });
    results.messages.assertEqual(onNext(210, 2));
});

test('Merge_NeverReturn', function () {
    var msgs1, n1, r1, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(245)];
    r1 = scheduler.createHotObservable(msgs1);
    n1 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, n1, r1);
    });
    results.messages.assertEqual(onNext(210, 2));
});

test('Merge_ErrorNever', function () {
    var e1, ex, msgs1, n1, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onError(245, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    n1 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, e1, n1);
    });
    results.messages.assertEqual(onNext(210, 2), onError(245, ex));
});

test('Merge_NeverError', function () {
    var e1, ex, msgs1, n1, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onError(245, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    n1 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, n1, e1);
    });
    results.messages.assertEqual(onNext(210, 2), onError(245, ex));
});

test('Merge_EmptyReturn', function () {
    var e1, msgs1, msgs2, r1, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(245)];
    msgs2 = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    r1 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, e1, r1);
    });
    results.messages.assertEqual(onNext(210, 2), onCompleted(250));
});

test('Merge_ReturnEmpty', function () {
    var e1, msgs1, msgs2, r1, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(245)];
    msgs2 = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    r1 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, r1, e1);
    });
    results.messages.assertEqual(onNext(210, 2), onCompleted(250));
});

test('Merge_Lots2', function () {
    var i, msgs1, msgs2, o1, o2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 4), onNext(230, 6), onNext(240, 8), onCompleted(245)];
    msgs2 = [onNext(150, 1), onNext(215, 3), onNext(225, 5), onNext(235, 7), onNext(245, 9), onCompleted(250)];
    o1 = scheduler.createHotObservable(msgs1);
    o2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, o1, o2);
    }).messages;
    equal(9, results.length);
    for (i = 0; i < 8; i++) {
        ok(results[i].value.kind === 'N' && results[i].time === 210 + i * 5 && results[i].value.value === i + 2);
    }
    ok(results[8].value.kind === 'C' && results[8].time === 250);
});

test('Merge_Lots3', function () {
    var i, msgs1, msgs2, msgs3, o1, o2, o3, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onNext(225, 5), onNext(240, 8), onCompleted(245)];
    msgs2 = [onNext(150, 1), onNext(215, 3), onNext(230, 6), onNext(245, 9), onCompleted(250)];
    msgs3 = [onNext(150, 1), onNext(220, 4), onNext(235, 7), onCompleted(240)];
    o1 = scheduler.createHotObservable(msgs1);
    o2 = scheduler.createHotObservable(msgs2);
    o3 = scheduler.createHotObservable(msgs3);
    results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, o1, o2, o3);
    }).messages;
    equal(9, results.length);
    for (i = 0; i < 8; i++) {
        ok(results[i].value.kind === 'N' && results[i].time === 210 + i * 5 && results[i].value.value === i + 2);
    }
    ok(results[8].value.kind === 'C' && results[8].time === 250);
});

test('Merge_ErrorLeft', function () {
    var ex, msgs1, msgs2, o1, o2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onError(245, ex)];
    msgs2 = [onNext(150, 1), onNext(215, 3), onCompleted(250)];
    o1 = scheduler.createHotObservable(msgs1);
    o2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, o1, o2);
    });
    results.messages.assertEqual(onNext(210, 2), onNext(215, 3), onError(245, ex));
});

test('Merge_ErrorCausesDisposal', function () {
    var ex, msgs1, msgs2, o1, o2, results, scheduler, sourceNotDisposed;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onError(210, ex)];
    msgs2 = [onNext(150, 1), onNext(220, 1), onCompleted(250)];
    sourceNotDisposed = false;
    o1 = scheduler.createHotObservable(msgs1);
    o2 = scheduler.createHotObservable(msgs2).doAction(function () {
        return sourceNotDisposed = true;
    });
    results = scheduler.startWithCreate(function () {
        return Observable.merge(scheduler, o1, o2);
    });
    results.messages.assertEqual(onError(210, ex));
    ok(!sourceNotDisposed);
});