QUnit.module('OnErrorResumeNextProto');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('OnErrorResumeNext_NoErrors', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(230));
    var o2 = scheduler.createHotObservable(onNext(240, 4), onCompleted(250));

    var results = scheduler.startWithCreate(function () {
        return o1.onErrorResumeNext(o2);
    });

    results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(240, 4), onCompleted(250));
});

test('OnErrorResumeNext_Error', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onError(230, 'ex'));
    var o2 = scheduler.createHotObservable(onNext(240, 4), onCompleted(250));

    var results = scheduler.startWithCreate(function () {
        return o1.onErrorResumeNext(o2);
    });

    results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(240, 4), onCompleted(250));
});

test('OnErrorResumeNext_EmptyReturnThrowAndMore', function () {
    var ex = 'ex';

    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(220));
    var o2 = scheduler.createHotObservable(onError(230, ex));

    var results = scheduler.startWithCreate(function () {
        return o1.onErrorResumeNext(o2);
    });

    results.messages.assertEqual(onNext(210, 2), onCompleted(230));
});
