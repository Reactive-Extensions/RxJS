QUnit.module('ConcatProto');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Concat_EmptyEmpty', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(230)];
    msgs2 = [onNext(150, 1), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onCompleted(250));
});

test('Concat_EmptyNever', function () {
    var e1, e2, msgs1, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(230)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual();
});

test('Concat_NeverEmpty', function () {
    var e1, e2, msgs1, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(230)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return e2.concat(e1);
    });
    results.messages.assertEqual();
});

test('Concat_NeverNever', function () {
    var e1, e2, results, scheduler;
    scheduler = new TestScheduler();
    e1 = Observable.never();
    e2 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual();
});

test('Concat_EmptyThrow', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(230)];
    msgs2 = [onNext(150, 1), onError(250, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onError(250, ex));
});

test('Concat_ThrowEmpty', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onError(230, ex)];
    msgs2 = [onNext(150, 1), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onError(230, ex));
});

test('Concat_ThrowThrow', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onError(230, ex)];
    msgs2 = [onNext(150, 1), onError(250, 'ex2')];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onError(230, ex));
});

test('Concat_ReturnEmpty', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(230)];
    msgs2 = [onNext(150, 1), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onNext(210, 2), onCompleted(250));
});

test('Concat_EmptyReturn', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(230)];
    msgs2 = [onNext(150, 1), onNext(240, 2), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onNext(240, 2), onCompleted(250));
});

test('Concat_ReturnNever', function () {
    var e1, e2, msgs1, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(230)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onNext(210, 2));
});

test('Concat_NeverReturn', function () {
    var e1, e2, msgs1, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(230)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return e2.concat(e1);
    });
    results.messages.assertEqual();
});

test('Concat_ReturnReturn', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(220, 2), onCompleted(230)];
    msgs2 = [onNext(150, 1), onNext(240, 3), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onNext(220, 2), onNext(240, 3), onCompleted(250));
});

test('Concat_ThrowReturn', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onError(230, ex)];
    msgs2 = [onNext(150, 1), onNext(240, 2), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onError(230, ex));
});

test('Concat_ReturnThrow', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(220, 2), onCompleted(230)];
    msgs2 = [onNext(150, 1), onError(250, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onNext(220, 2), onError(250, ex));
});

test('Concat_SomeDataSomeData', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(225)];
    msgs2 = [onNext(150, 1), onNext(230, 4), onNext(240, 5), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
});

test('MergeConcat_Basic', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(120, 3), onCompleted(140))), onNext(260, scheduler.createColdObservable(onNext(20, 4), onNext(70, 5), onCompleted(200))), onNext(270, scheduler.createColdObservable(onNext(10, 6), onNext(90, 7), onNext(110, 8), onCompleted(130))), onNext(320, scheduler.createColdObservable(onNext(210, 9), onNext(240, 10), onCompleted(300))), onCompleted(400));
    results = scheduler.startWithCreate(function () {
        return xs.merge(2);
    });
    results.messages.assertEqual(onNext(260, 1), onNext(280, 4), onNext(310, 2), onNext(330, 3), onNext(330, 5), onNext(360, 6), onNext(440, 7), onNext(460, 8), onNext(670, 9), onNext(700, 10), onCompleted(760));
    xs.subscriptions.assertEqual(subscribe(200, 760));
});