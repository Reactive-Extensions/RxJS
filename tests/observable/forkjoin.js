QUnit.module('ForkJoin');

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

test('ForkJoin_NaryParams', function () {
    var o1, o2, o3, results, scheduler;
    scheduler = new TestScheduler();
    o1 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onNext(225, 4), onCompleted(230));
    o2 = scheduler.createHotObservable(onNext(150, 1), onNext(235, 6), onNext(240, 7), onCompleted(250));
    o3 = scheduler.createHotObservable(onNext(150, 1), onNext(230, 3), onNext(245, 5), onCompleted(270));
    results = scheduler.startWithCreate(function () {
        return Observable.forkJoin(o1, o2, o3);
    }).messages;
    ok(results[0].time === 270 && sequenceEqual(results[0].value.value, [4, 7, 5]));
    ok(results[1].time === 270 && results[1].value.kind === 'C');
    equal(2, results.length);
});


test('ForkJoin_NaryParamsEmpty', function () {
    var o1, o2, o3, results, scheduler;
    scheduler = new TestScheduler();
    o1 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onNext(225, 4), onCompleted(230));
    o2 = scheduler.createHotObservable(onNext(150, 1), onNext(235, 6), onNext(240, 7), onCompleted(250));
    o3 = scheduler.createHotObservable(onCompleted(270));
    results = scheduler.startWithCreate(function () {
        return Observable.forkJoin(o1, o2, o3);
    }).messages;
    ok(results[0].time === 270 && results[0].value.kind === 'C');
    equal(1, results.length);
});

test('ForkJoin_NaryParamsEmptyBeforeEnd', function () {
    var o1, o2, o3, results, scheduler;
    scheduler = new TestScheduler();
    o1 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onNext(225, 4), onCompleted(230));
    o2 = scheduler.createHotObservable(onCompleted(235));
    o3 = scheduler.createHotObservable(onNext(150, 1), onNext(230, 3), onNext(245, 5), onCompleted(270));
    results = scheduler.startWithCreate(function () {
        return Observable.forkJoin(o1, o2, o3);
    }).messages;
    equal(1, results.length);
    ok(results[0].time === 235 && results[0].value.kind === 'C');
});