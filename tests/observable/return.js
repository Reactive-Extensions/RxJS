QUnit.module('Return');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    SerialDisposable = Rx.SerialDisposable,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
	created = Rx.ReactiveTest.created,
	subscribed = Rx.ReactiveTest.subscribed,
	disposed = Rx.ReactiveTest.disposed;

test('Return_Basic', function () {
    var scheduler = new TestScheduler();

    var res = scheduler.startWithCreate(function () {
        return Observable.returnValue(42, scheduler)
    });

    res.messages.assertEqual(
        onNext(201, 42),
        onCompleted(201)
    );
});

test('Return_Disposed', function () {
    var scheduler = new TestScheduler();

    var res = scheduler.startWithDispose(function () {
        return Observable.returnValue(42, scheduler)
    }, 200);

    res.messages.assertEqual(
    );
});

test('Return_DisposedAfterNext', function () {
    var scheduler = new TestScheduler();

    var d = new SerialDisposable();

    var xs = Observable.returnValue(42, scheduler);

    var res = scheduler.createObserver();

    scheduler.scheduleAbsolute(100, function () {
        d.setDisposable(xs.subscribe(
            function (x) {
                d.dispose();
                res.onNext(x);
            },
            res.onError.bind(res),
            res.onCompleted.bind(res)
        ));
    });

    scheduler.start();

    res.messages.assertEqual(
        onNext(101, 42)
    );
});

test('Return_ObserverThrows', function () {
    var scheduler1, scheduler2, xs, ys;
    scheduler1 = new TestScheduler();
    xs = Observable.returnValue(1, scheduler1);
    xs.subscribe(function (x) {
        throw 'ex';
    });
    raises(function () {
        scheduler1.start();
    });
    scheduler2 = new TestScheduler();
    ys = Observable.returnValue(1, scheduler2);
    ys.subscribe(function (x) {

    }, function (ex) {

    }, function () {
        throw 'ex';
    });
    raises(function () {
        scheduler2.start();
    });
});