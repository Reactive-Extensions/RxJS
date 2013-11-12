QUnit.module('Finally');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Finally_OnlyCalledOnce_Empty', function () {
    var d, invokeCount, someObservable;
    invokeCount = 0;
    someObservable = Rx.Observable.empty().finallyAction(function () {
        return invokeCount++;
    });
    d = someObservable.subscribe();
    d.dispose();
    d.dispose();
    equal(1, invokeCount);
});

test('Finally_Empty', function () {
    var invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    invoked = false;
    results = scheduler.startWithCreate(function () {
        return xs.finallyAction(function () {
            return invoked = true;
        });
    }).messages;
    equal(1, results.length);
    ok(results[0].value.kind === 'C' && results[0].time === 250);
    ok(invoked);
});

test('Finally_Return', function () {
    var invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
    invoked = false;
    results = scheduler.startWithCreate(function () {
        return xs.finallyAction(function () {
            return invoked = true;
        });
    }).messages;
    equal(2, results.length);
    ok(results[0].value.kind === 'N' && results[0].time === 210 && results[0].value.value === 2);
    ok(results[1].value.kind === 'C' && results[1].time === 250);
    ok(invoked);
});

test('Finally_Throw', function () {
    var ex, invoked, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onError(250, ex));
    invoked = false;
    results = scheduler.startWithCreate(function () {
        return xs.finallyAction(function () {
            return invoked = true;
        });
    }).messages;
    equal(1, results.length);
    ok(results[0].value.kind === 'E' && results[0].time === 250 && results[0].value.exception === ex);
    ok(invoked);
});