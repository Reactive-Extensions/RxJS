QUnit.module('CreateWithDisposable');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

test('CreateWithDisposable_Next', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Observable.createWithDisposable(function (o) {
            o.onNext(1);
            o.onNext(2);
            return Rx.Disposable.empty;
        });
    });
    results.messages.assertEqual(onNext(200, 1), onNext(200, 2));
});

test('CreateWithDisposable_Completed', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Observable.createWithDisposable(function (o) {
            o.onCompleted();
            o.onNext(100);
            o.onError('ex');
            o.onCompleted();
            return Rx.Disposable.empty;
        });
    });
    results.messages.assertEqual(onCompleted(200));
});

test('CreateWithDisposable_Error', function () {
    var ex, results, scheduler;
    scheduler = new TestScheduler();
    ex = 'ex';
    results = scheduler.startWithCreate(function () {
        return Observable.createWithDisposable(function (o) {
            o.onError(ex);
            o.onNext(100);
            o.onError('foo');
            o.onCompleted();
            return Rx.Disposable.empty;
        });
    });
    results.messages.assertEqual(onError(200, ex));
});

test('CreateWithDisposable_Exception', function () {
    raises(function () {
        return Observable.createWithDisposable(function (o) {
            throw 'ex';
        }).subscribe();
    });
});

var BooleanDisposable = (function () {
    function BooleanDisposable() {
        this.isDisposed = false;
    }
    BooleanDisposable.prototype.dispose = function () {
        return this.isDisposed = true;
    };
    return BooleanDisposable;
})();

test('CreateWithDisposable_Dispose', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Observable.createWithDisposable(function (o) {
            var d;
            d = new BooleanDisposable();
            o.onNext(1);
            o.onNext(2);
            scheduler.scheduleWithRelative(600, function () {
                if (!d.isDisposed) {
                    o.onNext(3);
                }
            });
            scheduler.scheduleWithRelative(700, function () {
                if (!d.isDisposed) {
                    o.onNext(4);
                }
            });
            scheduler.scheduleWithRelative(900, function () {
                if (!d.isDisposed) {
                    o.onNext(5);
                }
            });
            scheduler.scheduleWithRelative(1100, function () {
                if (!d.isDisposed) {
                    o.onNext(6);
                }
            });
            return d;
        });
    });
    results.messages.assertEqual(onNext(200, 1), onNext(200, 2), onNext(800, 3), onNext(900, 4));
});

test('CreateWithDisposable_ObserverThrows', function () {
    raises(function () {
        return Observable.createWithDisposable(function (o) {
            o.onNext(1);
            return Rx.Disposable.empty;
        }).subscribe(function (x) {
            throw 'ex';
        });
    });
    raises(function () {
        return Observable.createWithDisposable(function (o) {
            o.onError('exception');
            return Rx.Disposable.empty;
        }).subscribe(function (x) { }, function (ex) {
            throw 'ex';
        });
    });
    raises(function () {
        return Observable.createWithDisposable(function (o) {
            o.onCompleted();
            return Rx.Disposable.empty;
        }).subscribe(function (x) { }, function (ex) { }, function () {
            throw 'ex';
        });
    });
});
