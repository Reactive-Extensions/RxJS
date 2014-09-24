QUnit.module('WindowWithTimeOrCount');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

var toString = function(x) {
    return x.toString();
}

test('BufferWithTimeOrCount_Basic', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(205, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(370, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
    results = scheduler.startWithCreate(function () {
        return xs.bufferWithTimeOrCount(70, 3, scheduler).select(toString);
    });
    results.messages.assertEqual(onNext(240, "1,2,3"), onNext(310, "4"), onNext(370, "5,6,7"), onNext(440, "8"), onNext(510, "9"), onNext(580, ""), onNext(600, ""), onCompleted(600));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('BufferWithTimeOrCount_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(205, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(370, 7), onNext(420, 8), onNext(470, 9), onError(600, ex));
    results = scheduler.startWithCreate(function () {
        return xs.bufferWithTimeOrCount(70, 3, scheduler).select(toString);
    });
    results.messages.assertEqual(onNext(240, "1,2,3"), onNext(310, "4"), onNext(370, "5,6,7"), onNext(440, "8"), onNext(510, "9"), onNext(580, ""), onError(600, ex));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('BufferWithTimeOrCount_Disposed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(205, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(370, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
    results = scheduler.startWithDispose(function () {
        return xs.bufferWithTimeOrCount(70, 3, scheduler).select(toString);
    }, 370);
    results.messages.assertEqual(onNext(240, "1,2,3"), onNext(310, "4"), onNext(370, "5,6,7"));
    xs.subscriptions.assertEqual(subscribe(200, 370));
});

test('multiple bufferWithTimeOrCounts', function(){
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs1 = scheduler.createHotObservable(onCompleted(700))
        .bufferWithTimeOrCount(100, 3, scheduler).map(toString);
    xs2 = scheduler.createHotObservable(onCompleted(700))
        .bufferWithTimeOrCount(150, 4, scheduler).map(toString);
    results1 = scheduler.createObserver();
    results2 = scheduler.createObserver();

    scheduler.scheduleAbsolute(370, function(){
        xs1.subscribe(results1);
        xs2.subscribe(results2);
    });
    scheduler.start();

    results1.messages.assertEqual(onNext(470, ''), onNext(570, ''), onNext(670, ''), onNext(700, ''), onCompleted(700));
    results2.messages.assertEqual(onNext(520, ''), onNext(670, ''), onNext(700, ''), onCompleted(700));
});