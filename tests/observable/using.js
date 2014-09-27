QUnit.module('Using');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

test('Using_Null', function () {
    var createInvoked, disposable, disposeInvoked, results, scheduler, xs, _d;
    scheduler = new TestScheduler();
    disposeInvoked = 0;
    createInvoked = 0;
    results = scheduler.startWithCreate(function () {
        return Observable.using(function () {
            disposeInvoked++;
            disposable = null;
            return disposable;
        }, function (d) {
            _d = d;
            createInvoked++;
            xs = scheduler.createColdObservable(onNext(100, scheduler.clock), onCompleted(200));
            return xs;
        });
    });
    strictEqual(disposable, _d);
    results.messages.assertEqual(onNext(300, 200), onCompleted(400));
    equal(1, createInvoked);
    equal(1, disposeInvoked);
    xs.subscriptions.assertEqual(subscribe(200, 400));
    ok(disposable === null);
});

test('Using_Complete', function () {
    var createInvoked, disposable, disposeInvoked, results, scheduler, xs, _d;
    scheduler = new TestScheduler();
    disposeInvoked = 0;
    createInvoked = 0;
    results = scheduler.startWithCreate(function () {
        return Observable.using(function () {
            disposeInvoked++;
            disposable = new Rx.MockDisposable(scheduler);
            return disposable;
        }, function (d) {
            _d = d;
            createInvoked++;
            xs = scheduler.createColdObservable(onNext(100, scheduler.clock), onCompleted(200));
            return xs;
        });
    });
    strictEqual(disposable, _d);
    results.messages.assertEqual(onNext(300, 200), onCompleted(400));
    equal(1, createInvoked);
    equal(1, disposeInvoked);
    xs.subscriptions.assertEqual(subscribe(200, 400));
    disposable.disposes.assertEqual(200, 400);
});

test('Using_Error', function () {
    var createInvoked, disposable, disposeInvoked, ex, results, scheduler, xs, _d;
    scheduler = new TestScheduler();
    disposeInvoked = 0;
    createInvoked = 0;
    ex = 'ex';
    results = scheduler.startWithCreate(function () {
        return Observable.using(function () {
            disposeInvoked++;
            disposable = new Rx.MockDisposable(scheduler);
            return disposable;
        }, function (d) {
            _d = d;
            createInvoked++;
            xs = scheduler.createColdObservable(onNext(100, scheduler.clock), onError(200, ex));
            return xs;
        });
    });
    strictEqual(disposable, _d);
    results.messages.assertEqual(onNext(300, 200), onError(400, ex));
    equal(1, createInvoked);
    equal(1, disposeInvoked);
    xs.subscriptions.assertEqual(subscribe(200, 400));
    disposable.disposes.assertEqual(200, 400);
});

test('Using_Dispose', function () {
    var createInvoked, disposable, disposeInvoked, results, scheduler, xs, _d;
    scheduler = new TestScheduler();
    disposeInvoked = 0;
    createInvoked = 0;
    results = scheduler.startWithCreate(function () {
        return Observable.using(function () {
            disposeInvoked++;
            disposable = new Rx.MockDisposable(scheduler);
            return disposable;
        }, function (d) {
            _d = d;
            createInvoked++;
            xs = scheduler.createColdObservable(onNext(100, scheduler.clock), onNext(1000, scheduler.clock + 1));
            return xs;
        });
    });
    strictEqual(disposable, _d);
    results.messages.assertEqual(onNext(300, 200));
    equal(1, createInvoked);
    equal(1, disposeInvoked);
    xs.subscriptions.assertEqual(subscribe(200, 1000));
    disposable.disposes.assertEqual(200, 1000);
});

test('Using_ThrowResourceSelector', function () {
    var createInvoked, disposeInvoked, ex, results, scheduler;
    scheduler = new TestScheduler();
    disposeInvoked = 0;
    createInvoked = 0;
    ex = 'ex';
    results = scheduler.startWithCreate(function () {
        return Observable.using(function () {
            disposeInvoked++;
            throw ex;
        }, function (d) {
            createInvoked++;
            return Observable.never();
        });
    });
    results.messages.assertEqual(onError(200, ex));
    equal(0, createInvoked);
    return equal(1, disposeInvoked);
});

test('Using_ThrowResourceUsage', function () {
    var createInvoked, disposable, disposeInvoked, ex, results, scheduler;
    scheduler = new TestScheduler();
    disposeInvoked = 0;
    createInvoked = 0;
    ex = 'ex';
    disposable = void 0;
    results = scheduler.startWithCreate(function () {
        return Observable.using(function () {
            disposeInvoked++;
            disposable = new Rx.MockDisposable(scheduler);
            return disposable;
        }, function (d) {
            createInvoked++;
            throw ex;
        });
    });
    results.messages.assertEqual(onError(200, ex));
    equal(1, createInvoked);
    equal(1, disposeInvoked);
    return disposable.disposes.assertEqual(200, 200);
});
