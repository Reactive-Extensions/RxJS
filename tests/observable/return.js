QUnit.module('Return');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
	created = Rx.ReactiveTest.created,
	subscribed = Rx.ReactiveTest.subscribed,
	disposed = Rx.ReactiveTest.disposed;

test('Return_Basic', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startWithCreate(function () {
        return Observable.returnValue(42, scheduler);
    });

    results.messages.assertEqual(
					    onNext(201, 42),
					    onCompleted(201));
});

test('Return_Disposed', function () {
    var scheduler = new TestScheduler();

    var results = scheduler.startWithDispose(function () {
        return Observable.returnValue(42, scheduler);
    }, 200);
    
    results.messages.assertEqual();
});

test('Return_DisposedAfterNext', function () {
    var d, results, scheduler, xs;
    scheduler = new TestScheduler();
    d = new Rx.SerialDisposable();
    xs = Observable.returnValue(42, scheduler);
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(100, function () {
        return d.disposable(xs.subscribe(function (x) {
            d.dispose();
            results.onNext(x);
        }, function (e) {
            results.onError(e);
        }, function () {
            results.onCompleted();
        }));
    });
    scheduler.start();
    results.messages.assertEqual(onNext(101, 42));
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