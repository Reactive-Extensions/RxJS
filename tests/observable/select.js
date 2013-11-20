QUnit.module('Select');

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

test('Select_Throws', function () {

    raises(function () {
        Observable.returnValue(1).select(function (x) {
            return x;
        }).subscribe(function (x) {
            throw 'ex';
        });
    });

    raises(function () {
        Observable.throwException('ex').select(function (x) {
            return x;
        }).subscribe(function (x) { }, function (ex) {
            throw 'ex';
        });
    });

    raises(function () {
        Observable.empty().select(function (x) {
            return x;
        }).subscribe(function (x) { }, function (ex) { }, function () {
            throw 'ex';
        });
    });

    raises(function () {
        Observable.create(function (o) {
            throw 'ex';
        }).select(function (x) {
            return x;
        }).subscribe();
    });

});

test('Select_DisposeInsideSelector', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(100, 1),
        onNext(200, 2),
        onNext(500, 3),
        onNext(600, 4)
    );

    var invoked = 0;

    var res = scheduler.createObserver();

    var d = new SerialDisposable();
    d.setDisposable(xs.select(function (x) {
        invoked++;
        if (scheduler.clock > 400) {
            d.dispose();
        }
        return x;
    }).subscribe(res));

    scheduler.scheduleAbsolute(Rx.ReactiveTest.disposed, d.dispose.bind(d));

    scheduler.start();

    res.messages.assertEqual(
        onNext(100, 1),
        onNext(200, 2)
    );

    xs.subscriptions.assertEqual(
        subscribe(0, 500)
    );

    equal(3, invoked);
});

test('Select_Completed', function () {
    var invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    invoked = 0;
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(240, 3), onNext(290, 4), onNext(350, 5), onCompleted(400), onNext(410, -1), onCompleted(420), onError(430, 'ex'));
    results = scheduler.startWithCreate(function () {
        return xs.select(function (x) {
            invoked++;
            return x + 1;
        });
    });
    results.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(290, 5), onNext(350, 6), onCompleted(400));
    xs.subscriptions.assertEqual(subscribe(200, 400));
    equal(4, invoked);
});

test('Select_Completed_Two', function () {
    for (var i = 0; i < 100; i++) {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(240, 3), onNext(290, 4), onNext(350, 5), onCompleted(400), onNext(410, -1), onCompleted(420), onError(430, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.select(function (x) {
                invoked++;
                return x + 1;
            });
        });
        results.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(290, 5), onNext(350, 6), onCompleted(400));
        xs.subscriptions.assertEqual(subscribe(200, 400));
        equal(4, invoked);
    }
});

test('Select_NotCompleted', function () {
    var invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    invoked = 0;
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(240, 3), onNext(290, 4), onNext(350, 5));
    results = scheduler.startWithCreate(function () {
        return xs.select(function (x) {
            invoked++;
            return x + 1;
        });
    });
    results.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(290, 5), onNext(350, 6));
    xs.subscriptions.assertEqual(subscribe(200, 1000));
    equal(4, invoked);
});

test('Select_Error', function () {
    var ex, invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    ex = 'ex';
    invoked = 0;
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(240, 3), onNext(290, 4), onNext(350, 5), onError(400, ex), onNext(410, -1), onCompleted(420), onError(430, 'ex'));
    results = scheduler.startWithCreate(function () {
        return xs.select(function (x) {
            invoked++;
            return x + 1;
        });
    });
    results.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(290, 5), onNext(350, 6), onError(400, ex));
    xs.subscriptions.assertEqual(subscribe(200, 400));
    equal(4, invoked);
});

test('Select_SelectorThrows', function () {
    var ex, invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    invoked = 0;
    ex = 'ex';
    xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(240, 3), onNext(290, 4), onNext(350, 5), onCompleted(400), onNext(410, -1), onCompleted(420), onError(430, 'ex'));
    results = scheduler.startWithCreate(function () {
        return xs.select(function (x) {
            invoked++;
            if (invoked === 3) {
                throw ex;
            }
            return x + 1;
        });
    });
    results.messages.assertEqual(onNext(210, 3), onNext(240, 4), onError(290, ex));
    xs.subscriptions.assertEqual(subscribe(200, 290));
    equal(3, invoked);
});

test('SelectWithIndex_Throws', function () {
    raises(function () {
        return Observable.returnValue(1).select(function (x, index) {
            return x;
        }).subscribe(function (x) {
            throw 'ex';
        });
    });
    raises(function () {
        return Observable.throwException('ex').select(function (x, index) {
            return x;
        }).subscribe(function (x) { }, function (ex) {
            throw 'ex';
        });
    });
    raises(function () {
        return Observable.empty().select(function (x, index) {
            return x;
        }).subscribe(function (x) { }, function (ex) { }, function () {
            throw 'ex';
        });
    });
    raises(function () {
        return Observable.create(function (o) {
            throw 'ex';
        }).select(function (x, index) {
            return x;
        }).subscribe();
    });

});

test('SelectWithIndex_DisposeInsideSelector', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(100, 4),
        onNext(200, 3),
        onNext(500, 2),
        onNext(600, 1)
    );

    var invoked = 0;

    var res = scheduler.createObserver();

    var d = new SerialDisposable();
    d.setDisposable(xs.select(function(x, index) {
        invoked++;
        if (scheduler.clock > 400) {
            d.dispose();
        }
        return x + index * 10;
    }).subscribe(res));

    scheduler.scheduleAbsolute(Rx.ReactiveTest.disposed, d.dispose.bind(d));

    scheduler.start();

    res.messages.assertEqual(
        onNext(100, 4),
        onNext(200, 13)
    );

    xs.subscriptions.assertEqual(
        subscribe(0, 500)
    );

    equal(3, invoked);
});

test('SelectWithIndex_Completed', function () {
    var invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    invoked = 0;
    xs = scheduler.createHotObservable(onNext(180, 5), onNext(210, 4), onNext(240, 3), onNext(290, 2), onNext(350, 1), onCompleted(400), onNext(410, -1), onCompleted(420), onError(430, 'ex'));
    results = scheduler.startWithCreate(function () {
        return xs.select(function (x, index) {
            invoked++;
            return (x + 1) + (index * 10);
        });
    });
    results.messages.assertEqual(onNext(210, 5), onNext(240, 14), onNext(290, 23), onNext(350, 32), onCompleted(400));
    xs.subscriptions.assertEqual(subscribe(200, 400));
    equal(4, invoked);
});

test('SelectWithIndex_NotCompleted', function () {
    var invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    invoked = 0;
    xs = scheduler.createHotObservable(onNext(180, 5), onNext(210, 4), onNext(240, 3), onNext(290, 2), onNext(350, 1));
    results = scheduler.startWithCreate(function () {
        return xs.select(function (x, index) {
            invoked++;
            return (x + 1) + (index * 10);
        });
    });
    results.messages.assertEqual(onNext(210, 5), onNext(240, 14), onNext(290, 23), onNext(350, 32));
    xs.subscriptions.assertEqual(subscribe(200, 1000));
    equal(4, invoked);
});

test('SelectWithIndex_Error', function () {
    var ex, invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    ex = 'ex';
    invoked = 0;
    xs = scheduler.createHotObservable(onNext(180, 5), onNext(210, 4), onNext(240, 3), onNext(290, 2), onNext(350, 1), onError(400, ex), onNext(410, -1), onCompleted(420), onError(430, 'ex'));
    results = scheduler.startWithCreate(function () {
        return xs.select(function (x, index) {
            invoked++;
            return (x + 1) + (index * 10);
        });
    });
    results.messages.assertEqual(onNext(210, 5), onNext(240, 14), onNext(290, 23), onNext(350, 32), onError(400, ex));
    xs.subscriptions.assertEqual(subscribe(200, 400));
    equal(4, invoked);
});

test('Select_SelectorThrows', function () {
    var ex, invoked, results, scheduler, xs;
    scheduler = new TestScheduler();
    invoked = 0;
    ex = 'ex';
    xs = scheduler.createHotObservable(onNext(180, 5), onNext(210, 4), onNext(240, 3), onNext(290, 2), onNext(350, 1), onCompleted(400), onNext(410, -1), onCompleted(420), onError(430, 'ex'));
    results = scheduler.startWithCreate(function () {
        return xs.select(function (x, index) {
            invoked++;
            if (invoked === 3) {
                throw ex;
            }
            return (x + 1) + (index * 10);
        });
    });
    results.messages.assertEqual(onNext(210, 5), onNext(240, 14), onError(290, ex));
    xs.subscriptions.assertEqual(subscribe(200, 290));
    equal(3, invoked);
});