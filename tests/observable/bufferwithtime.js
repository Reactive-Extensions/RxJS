QUnit.module('BufferWithTime');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('BufferWithTime_Basic', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
    results = scheduler.startWithCreate(function () {
        return xs.bufferWithTime(100, 70, scheduler).select(function (x) {
            return x.toString();
        });
    });
    results.messages.assertEqual(onNext(300, "2,3,4"), onNext(370, "4,5,6"), onNext(440, "6,7,8"), onNext(510, "8,9"), onNext(580, ""), onNext(600, ""), onCompleted(600));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('BufferWithTime_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onError(600, ex));
    results = scheduler.startWithCreate(function () {
        return xs.bufferWithTime(100, 70, scheduler).select(function (x) {
            return x.toString();
        });
    });
    results.messages.assertEqual(onNext(300, "2,3,4"), onNext(370, "4,5,6"), onNext(440, "6,7,8"), onNext(510, "8,9"), onNext(580, ""), onError(600, ex));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('BufferWithTime_Disposed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
    results = scheduler.startWithDispose(function () {
        return xs.bufferWithTime(100, 70, scheduler).select(function (x) {
            return x.toString();
        });
    }, 370);
    results.messages.assertEqual(onNext(300, "2,3,4"));
    xs.subscriptions.assertEqual(subscribe(200, 370));
});

test('BufferWithTime_Basic_Same', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
    results = scheduler.startWithCreate(function () {
        return xs.bufferWithTime(100, scheduler).select(function (x) {
            return x.toString();
        });
    });
    results.messages.assertEqual(onNext(300, "2,3,4"), onNext(400, "5,6,7"), onNext(500, "8,9"), onNext(600, ""), onCompleted(600));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});
