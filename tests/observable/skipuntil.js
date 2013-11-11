QUnit.module('SkipUntil');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;


test('SkipUntil_SomeData_Next', function () {
    var l, lMsgs, r, rMsgs, results, scheduler;
    scheduler = new TestScheduler();
    lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
    rMsgs = [onNext(150, 1), onNext(225, 99), onCompleted(230)];
    l = scheduler.createHotObservable(lMsgs);
    r = scheduler.createHotObservable(rMsgs);
    results = scheduler.startWithCreate(function () {
        return l.skipUntil(r);
    });
    results.messages.assertEqual(onNext(230, 4), onNext(240, 5), onCompleted(250));
});

test('SkipUntil_SomeData_Error', function () {
    var ex, l, lMsgs, r, rMsgs, results, scheduler;
    scheduler = new TestScheduler();
    ex = 'ex';
    lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
    rMsgs = [onNext(150, 1), onError(225, ex)];
    l = scheduler.createHotObservable(lMsgs);
    r = scheduler.createHotObservable(rMsgs);
    results = scheduler.startWithCreate(function () {
        return l.skipUntil(r);
    });
    results.messages.assertEqual(onError(225, ex));
});

test('SkipUntil_SomeData_Empty', function () {
    var l, lMsgs, r, rMsgs, results, scheduler;
    scheduler = new TestScheduler();
    lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
    rMsgs = [onNext(150, 1), onCompleted(225)];
    l = scheduler.createHotObservable(lMsgs);
    r = scheduler.createHotObservable(rMsgs);
    results = scheduler.startWithCreate(function () {
        return l.skipUntil(r);
    });
    results.messages.assertEqual();
});

test('SkipUntil_Never_Next', function () {
    var l, r, rMsgs, results, scheduler;
    scheduler = new TestScheduler();
    rMsgs = [onNext(150, 1), onNext(225, 2), onCompleted(250)];
    l = Observable.never();
    r = scheduler.createHotObservable(rMsgs);
    results = scheduler.startWithCreate(function () {
        return l.skipUntil(r);
    });
    results.messages.assertEqual();
});

test('SkipUntil_Never_Error', function () {
    var ex, l, r, rMsgs, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    rMsgs = [onNext(150, 1), onError(225, ex)];
    l = Observable.never();
    r = scheduler.createHotObservable(rMsgs);
    results = scheduler.startWithCreate(function () {
        return l.skipUntil(r);
    });
    results.messages.assertEqual(onError(225, ex));
});

test('SkipUntil_SomeData_Never', function () {
    var l, lMsgs, r, results, scheduler;
    scheduler = new TestScheduler();
    lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
    l = scheduler.createHotObservable(lMsgs);
    r = Observable.never();
    results = scheduler.startWithCreate(function () {
        return l.skipUntil(r);
    });
    results.messages.assertEqual();
});

test('SkipUntil_Never_Empty', function () {
    var l, r, rMsgs, results, scheduler;
    scheduler = new TestScheduler();
    rMsgs = [onNext(150, 1), onCompleted(225)];
    l = Observable.never();
    r = scheduler.createHotObservable(rMsgs);
    results = scheduler.startWithCreate(function () {
        return l.skipUntil(r);
    });
    results.messages.assertEqual();
});

test('SkipUntil_Never_Never', function () {
    var l, r, results, scheduler;
    scheduler = new TestScheduler();
    l = Observable.never();
    r = Observable.never();
    results = scheduler.startWithCreate(function () {
        return l.skipUntil(r);
    });
    results.messages.assertEqual();
});

test('SkipUntil_HasCompletedCausesDisposal', function () {
    var disposed, l, lMsgs, r, results, scheduler;
    scheduler = new TestScheduler();
    lMsgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250)];
    disposed = false;
    l = scheduler.createHotObservable(lMsgs);
    r = Observable.create(function () {
        return function () {
            disposed = true;
        };
    });
    results = scheduler.startWithCreate(function () {
        return l.skipUntil(r);
    });
    results.messages.assertEqual();
    ok(disposed);
});