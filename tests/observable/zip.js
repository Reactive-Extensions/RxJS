QUnit.module('Zip');

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
}

test('Zip_NAry_Symmetric', function () {
    var scheduler = new TestScheduler();

    var e0 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 1), onNext(250, 4), onCompleted(420));
    var e1 = scheduler.createHotObservable(onNext(150, 1), onNext(220, 2), onNext(240, 5), onCompleted(410));
    var e2 = scheduler.createHotObservable(onNext(150, 1), onNext(230, 3), onNext(260, 6), onCompleted(400));

    var res = scheduler.startWithCreate(function () {
        return Observable.zipArray(e0, e1, e2)
    });

    res.messages.assertEqual(
        onNext(230, function(l) { return sequenceEqual(l, [1, 2, 3 ]); }),
        onNext(260, function(l) { return sequenceEqual(l, [4, 5, 6 ]); }),
        onCompleted(420)
    );

    e0.subscriptions.assertEqual(
        subscribe(200, 420)
    );

    e1.subscriptions.assertEqual(
        subscribe(200, 420)
    );

    e2.subscriptions.assertEqual(
        subscribe(200, 420)
    );
});
