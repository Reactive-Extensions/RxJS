QUnit.module('WindowWithTimeOrCount');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('WindowWithTimeOrCount_Basic', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(205, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(370, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
    results = scheduler.startWithCreate(function () {
        return xs.windowWithTimeOrCount(70, 3, scheduler).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            });
        }).mergeObservable();
    });
    results.messages.assertEqual(onNext(205, "0 1"), onNext(210, "0 2"), onNext(240, "0 3"), onNext(280, "1 4"), onNext(320, "2 5"), onNext(350, "2 6"), onNext(370, "2 7"), onNext(420, "3 8"), onNext(470, "4 9"), onCompleted(600));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('WindowWithTimeOrCount_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(205, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(370, 7), onNext(420, 8), onNext(470, 9), onError(600, ex));
    results = scheduler.startWithCreate(function () {
        return xs.windowWithTimeOrCount(70, 3, scheduler).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            });
        }).mergeObservable();
    });
    results.messages.assertEqual(onNext(205, "0 1"), onNext(210, "0 2"), onNext(240, "0 3"), onNext(280, "1 4"), onNext(320, "2 5"), onNext(350, "2 6"), onNext(370, "2 7"), onNext(420, "3 8"), onNext(470, "4 9"), onError(600, ex));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('WindowWithTimeOrCount_Disposed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(205, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(370, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
    results = scheduler.startWithDispose(function () {
        return xs.windowWithTimeOrCount(70, 3, scheduler).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            });
        }).mergeObservable();
    }, 370);
    results.messages.assertEqual(onNext(205, "0 1"), onNext(210, "0 2"), onNext(240, "0 3"), onNext(280, "1 4"), onNext(320, "2 5"), onNext(350, "2 6"), onNext(370, "2 7"));
    xs.subscriptions.assertEqual(subscribe(200, 370));
});
