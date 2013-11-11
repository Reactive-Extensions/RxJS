QUnit.module('ForkJoinProto');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

function sequenceEqual(a1, a2) {
    if (a1.length !== a2.length) {
        return false;
    }
    for (var i = 0, len = a1.length; i < len; i++) {
        if (a1[i] !== a2[i]) {
            return false;
        }
    }
    return true;
}

test('ForkJoin_EmptyEmpty', function () {
    var e, o, results, scheduler;
    scheduler = new TestScheduler();
    o = scheduler.createHotObservable(onNext(150, 1), onCompleted(230));
    e = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return e.forkJoin(o, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onCompleted(250));
});

test('ForkJoin_None', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Observable.forkJoin();
    });
    results.messages.assertEqual(onCompleted(200));
});

test('ForkJoin_EmptyReturn', function () {
    var e, o, results, scheduler;
    scheduler = new TestScheduler();
    o = scheduler.createHotObservable(onNext(150, 1), onCompleted(230));
    e = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return e.forkJoin(o, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onCompleted(250));
});

test('ForkJoin_ReturnEmpty', function () {
    var e, o, results, scheduler;
    scheduler = new TestScheduler();
    o = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(230));
    e = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return e.forkJoin(o, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onCompleted(250));
});

test('ForkJoin_ReturnReturn', function () {
    var e, o, results, scheduler;
    scheduler = new TestScheduler();
    o = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(230));
    e = scheduler.createHotObservable(onNext(150, 1), onNext(220, 3), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return e.forkJoin(o, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onNext(250, 2 + 3), onCompleted(250));
});

test('ForkJoin_EmptyThrow', function () {
    var e, ex, o, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    o = scheduler.createHotObservable(onNext(150, 1), onCompleted(230));
    e = scheduler.createHotObservable(onNext(150, 1), onError(210, ex), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return e.forkJoin(o, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(210, ex));
});

test('ForkJoin_ThrowEmpty', function () {
    var e, ex, o, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    o = scheduler.createHotObservable(onNext(150, 1), onError(210, ex), onCompleted(230));
    e = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return e.forkJoin(o, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(210, ex));
});

test('ForkJoin_ReturnThrow', function () {
    var e, ex, o, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    o = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(230));
    e = scheduler.createHotObservable(onNext(150, 1), onError(220, ex), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return e.forkJoin(o, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
});

test('ForkJoin_ThrowReturn', function () {
    var e, ex, o, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    o = scheduler.createHotObservable(onNext(150, 1), onError(220, ex), onCompleted(230));
    e = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return e.forkJoin(o, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
});

test('ForkJoin_Binary', function () {
    var e, o, results, scheduler;
    scheduler = new TestScheduler();
    o = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onNext(225, 4), onCompleted(230));
    e = scheduler.createHotObservable(onNext(150, 1), onNext(235, 6), onNext(240, 7), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return e.forkJoin(o, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onNext(250, 4 + 7), onCompleted(250));
});