QUnit.module('TakeUntil');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('TakeUntil_Preempt_SomeData_Next', function () {
    var l, lMsgs, r, rMsgs, results, scheduler;
    scheduler = new TestScheduler();
    lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
    rMsgs = [onNext(150, 1), onNext(225, 99), onCompleted(230)];
    l = scheduler.createHotObservable(lMsgs);
    r = scheduler.createHotObservable(rMsgs);
    results = scheduler.startWithCreate(function () {
        return l.takeUntil(r);
    });
    results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onCompleted(225));
});

test('TakeUntil_Preempt_SomeData_Error', function () {
    var ex, l, lMsgs, r, rMsgs, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
    rMsgs = [onNext(150, 1), onError(225, ex)];
    l = scheduler.createHotObservable(lMsgs);
    r = scheduler.createHotObservable(rMsgs);
    results = scheduler.startWithCreate(function () {
        return l.takeUntil(r);
    });
    results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onError(225, ex));
});

test('TakeUntil_NoPreempt_SomeData_Empty', function () {
    var l, lMsgs, r, rMsgs, results, scheduler;
    scheduler = new TestScheduler();
    lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
    rMsgs = [onNext(150, 1), onCompleted(225)];
    l = scheduler.createHotObservable(lMsgs);
    r = scheduler.createHotObservable(rMsgs);
    results = scheduler.startWithCreate(function () {
        return l.takeUntil(r);
    });
    results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
});

test('TakeUntil_NoPreempt_SomeData_Never', function () {
    var l, lMsgs, r, results, scheduler;
    scheduler = new TestScheduler();
    lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
    l = scheduler.createHotObservable(lMsgs);
    r = Observable.never();
    results = scheduler.startWithCreate(function () {
        return l.takeUntil(r);
    });
    results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
});

test('TakeUntil_Preempt_Never_Next', function () {
    var l, r, rMsgs, results, scheduler;
    scheduler = new TestScheduler();
    rMsgs = [onNext(150, 1), onNext(225, 2), onCompleted(250)];
    l = Observable.never();
    r = scheduler.createHotObservable(rMsgs);
    results = scheduler.startWithCreate(function () {
        return l.takeUntil(r);
    });
    results.messages.assertEqual(onCompleted(225));
});

test('TakeUntil_Preempt_Never_Error', function () {
    var ex, l, r, rMsgs, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    rMsgs = [onNext(150, 1), onError(225, ex)];
    l = Observable.never();
    r = scheduler.createHotObservable(rMsgs);
    results = scheduler.startWithCreate(function () {
        return l.takeUntil(r);
    });
    results.messages.assertEqual(onError(225, ex));
});

test('TakeUntil_NoPreempt_Never_Empty', function () {
    var l, r, rMsgs, results, scheduler;
    scheduler = new TestScheduler();
    rMsgs = [onNext(150, 1), onCompleted(225)];
    l = Observable.never();
    r = scheduler.createHotObservable(rMsgs);
    results = scheduler.startWithCreate(function () {
        return l.takeUntil(r);
    });
    results.messages.assertEqual();
});

test('TakeUntil_NoPreempt_Never_Never', function () {
    var l, r, results, scheduler;
    scheduler = new TestScheduler();
    l = Observable.never();
    r = Observable.never();
    results = scheduler.startWithCreate(function () {
        return l.takeUntil(r);
    });
    results.messages.assertEqual();
});

test('TakeUntil_Preempt_BeforeFirstProduced', function () {
    var l, lMsgs, r, rMsgs, results, scheduler;
    scheduler = new TestScheduler();
    lMsgs = [onNext(150, 1), onNext(230, 2), onCompleted(240)];
    rMsgs = [onNext(150, 1), onNext(210, 2), onCompleted(220)];
    l = scheduler.createHotObservable(lMsgs);
    r = scheduler.createHotObservable(rMsgs);
    results = scheduler.startWithCreate(function () {
        return l.takeUntil(r);
    });
    results.messages.assertEqual(onCompleted(210));
});

test('TakeUntil_Preempt_BeforeFirstProduced_RemainSilentAndProperDisposed', function () {
    var l, lMsgs, r, rMsgs, results, scheduler, sourceNotDisposed;
    scheduler = new TestScheduler();
    lMsgs = [onNext(150, 1), onError(215, 'ex'), onCompleted(240)];
    rMsgs = [onNext(150, 1), onNext(210, 2), onCompleted(220)];
    sourceNotDisposed = false;
    l = scheduler.createHotObservable(lMsgs).doAction(function () {
        sourceNotDisposed = true;
    });
    r = scheduler.createHotObservable(rMsgs);
    results = scheduler.startWithCreate(function () {
        return l.takeUntil(r);
    });
    results.messages.assertEqual(onCompleted(210));
    ok(!sourceNotDisposed);
});

test('TakeUntil_NoPreempt_AfterLastProduced_ProperDisposedSignal', function () {
    var l, lMsgs, r, rMsgs, results, scheduler, signalNotDisposed;
    scheduler = new TestScheduler();
    lMsgs = [onNext(150, 1), onNext(230, 2), onCompleted(240)];
    rMsgs = [onNext(150, 1), onNext(250, 2), onCompleted(260)];
    signalNotDisposed = false;
    l = scheduler.createHotObservable(lMsgs);
    r = scheduler.createHotObservable(rMsgs).doAction(function () {
        signalNotDisposed = true;
    });
    results = scheduler.startWithCreate(function () {
        return l.takeUntil(r);
    });
    results.messages.assertEqual(onNext(230, 2), onCompleted(240));
    ok(!signalNotDisposed);
});
