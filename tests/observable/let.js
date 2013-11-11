QUnit.module('Let');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Let_CallsFunctionImmediately', function () {
    var called = false;
    Observable.empty().letBind(function (x) {
        called = true;
        return x;
    });
    ok(called);
});