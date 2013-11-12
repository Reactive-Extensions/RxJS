QUnit.module('StartWith');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('StartWith', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(220, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.startWith(1);
    }).messages;

    equal(3, results.length);
    ok(results[0].value.kind === 'N' && results[0].value.value === 1 && results[0].time === 200);
    ok(results[1].value.kind === 'N' && results[1].value.value === 2 && results[1].time === 220);
    ok(results[2].value.kind === 'C');
});