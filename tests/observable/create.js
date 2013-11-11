QUnit.module('Create');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

test('Create_Next', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Observable.create(function (o) {
            o.onNext(1);
            o.onNext(2);
        });
    });
    results.messages.assertEqual(onNext(200, 1), onNext(200, 2));
});

test('Create_Completed', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Observable.create(function (o) {
            o.onCompleted();
            o.onNext(100);
            o.onError('ex');
            o.onCompleted();
        });
    });
    results.messages.assertEqual(onCompleted(200));
});

test('Create_Error', function () {
    var ex, results, scheduler;
    scheduler = new TestScheduler();
    ex = 'ex';
    results = scheduler.startWithCreate(function () {
        return Observable.create(function (o) {
            o.onError(ex);
            o.onNext(100);
            o.onError('foo');
            o.onCompleted();
        });
    });
    results.messages.assertEqual(onError(200, ex));
});

test('Create_Noop_Next', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Observable.create(function (o) {
            o.onNext(1);
            o.onNext(2);
        });
    });
    results.messages.assertEqual(onNext(200, 1), onNext(200, 2));
});

test('Create_Noop_Completed', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Observable.create(function (o) {
            o.onCompleted();
            o.onNext(100);
            o.onError('ex');
            o.onCompleted();
        });
    });
    results.messages.assertEqual(onCompleted(200));
});

test('Create_Noop_Error', function () {
    var ex, results, scheduler;
    scheduler = new TestScheduler();
    ex = 'ex';
    results = scheduler.startWithCreate(function () {
        return Observable.create(function (o) {
            o.onError(ex);
            o.onNext(100);
            o.onError('foo');
            o.onCompleted();
        });
    });
    results.messages.assertEqual(onError(200, ex));
});    

test('Create_Exception', function () {
    raises(function () {
        return Observable.create(function (o) {
            throw 'ex';
        }).subscribe();
    });
});

test('Create_Dispose', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Observable.create(function (o) {
            var isStopped;
            isStopped = false;
            o.onNext(1);
            o.onNext(2);
            scheduler.scheduleWithRelative(600, function () {
                if (!isStopped) {
                    return o.onNext(3);
                }
            });
            scheduler.scheduleWithRelative(700, function () {
                if (!isStopped) {
                    return o.onNext(4);
                }
            });
            scheduler.scheduleWithRelative(900, function () {
                if (!isStopped) {
                    return o.onNext(5);
                }
            });
            scheduler.scheduleWithRelative(1100, function () {
                if (!isStopped) {
                    return o.onNext(6);
                }
            });
            return function () {
                return isStopped = true;
            };
        });
    });
    results.messages.assertEqual(onNext(200, 1), onNext(200, 2), onNext(800, 3), onNext(900, 4));
});

test('Create_ObserverThrows', function () {
    raises(function () {
        Observable.create(function (o) {
            o.onNext(1);
            return function () { };
        }).subscribe(function (x) {
            throw 'ex';
        });
    });
    raises(function () {
        Observable.create(function (o) {
            o.onError('exception');
            return function () { };
        }).subscribe(function (x) { }, function (ex) {
            throw 'ex';
        });
    });
    raises(function () {
        Observable.create(function (o) {
            o.onCompleted();
            return function () { };
        }).subscribe(function (x) { }, function (ex) { }, function () {
            throw 'ex';
        });
    });
});