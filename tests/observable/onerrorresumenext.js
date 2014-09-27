QUnit.module('OnErrorResumeNext');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('OnErrorResumeNext_ErrorMultiple', function () {
    scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onError(220, 'ex'));
    var o2 = scheduler.createHotObservable(onNext(230, 4), onError(240, 'ex'));
    var o3 = scheduler.createHotObservable(onCompleted(250));

    var results = scheduler.startWithCreate(function () {
        return Observable.onErrorResumeNext(o1, o2, o3);
    });

    results.messages.assertEqual(onNext(210, 2), onNext(230, 4), onCompleted(250));
});

test('OnErrorResumeNext_EmptyReturnThrowAndMore', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(205));
    var o2 = scheduler.createHotObservable(onNext(215, 2), onCompleted(220));
    var o3 = scheduler.createHotObservable(onNext(225, 3), onNext(230, 4), onCompleted(235));
    var o4 = scheduler.createHotObservable(onError(240, 'ex'));
    var o5 = scheduler.createHotObservable(onNext(245, 5), onCompleted(250));

    var results = scheduler.startWithCreate(function () {
        return Observable.onErrorResumeNext(o1, o2, o3, o4, o5);
    });

    results.messages.assertEqual(onNext(215, 2), onNext(225, 3), onNext(230, 4), onNext(245, 5), onCompleted(250));
});

test('OnErrorResumeNext_SingleSourceThrows', function () {
    var ex, msgs1, o1, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onError(230, ex)];
    o1 = scheduler.createHotObservable(msgs1);
    results = scheduler.startWithCreate(function () {
        return Observable.onErrorResumeNext(o1);
    });
    results.messages.assertEqual(onCompleted(230));
});

test('OnErrorResumeNext_EndWithNever', function () {
    var msgs1, o1, o2, results, scheduler;
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(220));
    var o2 = Observable.never();

    var results = scheduler.startWithCreate(function () {
        return Observable.onErrorResumeNext(o1, o2);
    });

    results.messages.assertEqual(onNext(210, 2));
});

test('OnErrorResumeNext_StartWithNever', function () {
    var scheduler = new TestScheduler();

    var o1 = Observable.never();
    var o2 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(220));

    var results = scheduler.startWithCreate(function () {
        return Observable.onErrorResumeNext(o1, o2);
    });

    results.messages.assertEqual();
});
