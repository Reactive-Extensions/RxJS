QUnit.module('AmbProto');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Amb_Never2', function () {
    var scheduler = new TestScheduler();

    var l = Observable.never();
    var r = Observable.never();

    var results = scheduler.startWithCreate(function () {
        return l.amb(r);
    });

    results.messages.assertEqual();
});

test('Amb_Never3', function () {
    var scheduler = new TestScheduler();

    var n1 = Observable.never();
    var n2 = Observable.never();
    var n3 = Observable.never();
    var results = scheduler.startWithCreate(function () {
        return Observable.amb(n1, n2, n3);
    });

    results.messages.assertEqual();
});
test('Amb_NeverEmpty', function () {
    var e, n, rMsgs, results, scheduler;
    var scheduler = new TestScheduler();

    var n = Observable.never();
    var e = scheduler.createHotObservable(onNext(150, 1), onCompleted(225));

    var results = scheduler.startWithCreate(function () {
        return n.amb(e);
    });

    results.messages.assertEqual(onCompleted(225));
});

test('Amb_EmptyNever', function () {
    var scheduler = new TestScheduler();

    var n = Observable.never();
    var e = scheduler.createHotObservable(onNext(150, 1), onCompleted(225));

    var results = scheduler.startWithCreate(function () {
        return e.amb(n);
    });

    results.messages.assertEqual(onCompleted(225));
});

test('Amb_RegularShouldDisposeLoser', function () {
    var scheduler = new TestScheduler();

    var sourceNotDisposed = false;

    var o1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(240));
    var o2 = scheduler.createHotObservable(onNext(150, 1), onNext(220, 3), onCompleted(250)).doAction(function () {
        return sourceNotDisposed = true;
    });

    var results = scheduler.startWithCreate(function () {
        return o1.amb(o2);
    });

    results.messages.assertEqual(onNext(210, 2), onCompleted(240));
    ok(!sourceNotDisposed);
});

test('Amb_WinnerThrows', function () {
    var ex = 'ex';

    var scheduler = new TestScheduler();

    var sourceNotDisposed = false;

    var o1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onError(220, ex));
    var o2 = scheduler.createHotObservable(onNext(150, 1), onNext(220, 3), onCompleted(250)).doAction(function () {
        return sourceNotDisposed = true;
    });

    var results = scheduler.startWithCreate(function () {
        return o1.amb(o2);
    });

    results.messages.assertEqual(onNext(210, 2), onError(220, ex));
    ok(!sourceNotDisposed);
});

test('Amb_LoserThrows', function () {
    var ex = 'ex';

    var scheduler = new TestScheduler();

    var sourceNotDisposed = false;

    var o1 = scheduler.createHotObservable(onNext(150, 1), onNext(220, 2), onError(230, ex)).doAction(function () {
        return sourceNotDisposed = true;
    });

    var o2 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 3), onCompleted(250));

    var results = scheduler.startWithCreate(function () {
        return o1.amb(o2);
    });

    results.messages.assertEqual(onNext(210, 3), onCompleted(250));
    ok(!sourceNotDisposed);
});

test('Amb_ThrowsBeforeElection', function () {
    var ex = 'ex';

    var scheduler = new TestScheduler();

    var sourceNotDisposed = false;

    var o1 = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
    var o2 = scheduler.createHotObservable(onNext(150, 1), onNext(220, 3), onCompleted(250)).doAction(function () {
        return sourceNotDisposed = true;
    });

    var results = scheduler.startWithCreate(function () {
        return o1.amb(o2);
    });

    results.messages.assertEqual(onError(210, ex));

    ok(!sourceNotDisposed);
});
