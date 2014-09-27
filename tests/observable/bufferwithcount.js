QUnit.module('BufferWithCount');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

function sequenceEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (var i = 0, len = arr1.length; i < len; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
};

test('Buffer_Count_PartialWindow', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.bufferWithCount(5);
    }).messages;
    equal(2, results.length);
    ok(sequenceEqual(results[0].value.value, [2, 3, 4, 5]) && results[0].time === 250);
    ok(results[1].value.kind === 'C' && results[1].time === 250);
});

test('Buffer_Count_FullWindows', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.bufferWithCount(2);
    }).messages;
    equal(3, results.length);
    ok(sequenceEqual(results[0].value.value, [2, 3]) && results[0].time === 220);
    ok(sequenceEqual(results[1].value.value, [4, 5]) && results[1].time === 240);
    ok(results[2].value.kind === 'C' && results[2].time === 250);
});

test('Buffer_Count_FullAndPartialWindows', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.bufferWithCount(3);
    }).messages;
    equal(3, results.length);
    ok(sequenceEqual(results[0].value.value, [2, 3, 4]) && results[0].time === 230);
    ok(sequenceEqual(results[1].value.value, [5]) && results[1].time === 250);
    ok(results[2].value.kind === 'C' && results[2].time === 250);
});

test('Buffer_Count_Error', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onError(250, 'ex'));
    results = scheduler.startWithCreate(function () {
        return xs.bufferWithCount(5);
    }).messages;
    equal(1, results.length);
    ok(results[0].value.kind === 'E' && results[0].time === 250);
});

test('Buffer_Count_Skip_Less', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.bufferWithCount(3, 1);
    }).messages;
    equal(5, results.length);
    ok(sequenceEqual(results[0].value.value, [2, 3, 4]) && results[0].time === 230);
    ok(sequenceEqual(results[1].value.value, [3, 4, 5]) && results[1].time === 240);
    ok(sequenceEqual(results[2].value.value, [4, 5]) && results[2].time === 250);
    ok(sequenceEqual(results[3].value.value, [5]) && results[3].time === 250);
    ok(results[4].value.kind === 'C' && results[4].time === 250);
});

test('Buffer_Count_Skip_More', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.bufferWithCount(2, 3);
    }).messages;
    equal(3, results.length);
    ok(sequenceEqual(results[0].value.value, [2, 3]) && results[0].time === 220);
    ok(sequenceEqual(results[1].value.value, [5]) && results[1].time === 250);
    ok(results[2].value.kind === 'C' && results[2].time === 250);
});

test('BufferWithCount_Basic', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
    results = scheduler.startWithCreate(function () {
        return xs.bufferWithCount(3, 2).select(function (x) {
            return x.toString();
        });
    });
    results.messages.assertEqual(onNext(280, "2,3,4"), onNext(350, "4,5,6"), onNext(420, "6,7,8"), onNext(600, "8,9"), onCompleted(600));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('BufferWithCount_Disposed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
    results = scheduler.startWithDispose(function () {
        return xs.bufferWithCount(3, 2).select(function (x) {
            return x.toString();
        });
    }, 370);
    results.messages.assertEqual(onNext(280, "2,3,4"), onNext(350, "4,5,6"));
    xs.subscriptions.assertEqual(subscribe(200, 370));
});
