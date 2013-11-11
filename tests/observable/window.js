QUnit.module('Window');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;        

function defaultEqualityComparer (x, y) {
    return Rx.Internals.isEqual(x, y);
}

function sequenceEqual(arr1, arr2, comparer) {
    comparer || (comparer = defaultEqualityComparer);
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (var i = 0, len = arr1.length; i < len; i++) {
        if (!comparer(arr1[i], arr2[i])) {
            return false;
        }
    }
    return true;
}

test('Window_Closings_Basic', function () {

    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
        onNext(90, 1), 
        onNext(180, 2), 
        onNext(250, 3), 
        onNext(260, 4), 
        onNext(310, 5), 
        onNext(340, 6), 
        onNext(410, 7), 
        onNext(420, 8), 
        onNext(470, 9), 
        onNext(550, 10), 
        onCompleted(590)
    );

    var window = 1;
    
    var results = scheduler.startWithCreate(function () {
        return xs.window(function () {
            return Observable.timer(window++ * 100, undefined, scheduler);
        }).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            });
        }).mergeObservable();
    });

    results.messages.assertEqual(
        onNext(250, "0 3"), 
        onNext(260, "0 4"), 
        onNext(310, "1 5"), 
        onNext(340, "1 6"), 
        onNext(410, "1 7"), 
        onNext(420, "1 8"), 
        onNext(470, "1 9"), 
        onNext(550, "2 10"), 
        onCompleted(590)
    );
    
    xs.subscriptions.assertEqual(subscribe(200, 590));
});

test('Window_Closings_Dispose', function () {
    var results, scheduler, window, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onCompleted(590));
    window = 1;
    results = scheduler.startWithDispose(function () {
        return xs.window(function () {
            return Observable.timer(window++ * 100, undefined, scheduler);
        }).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            });
        }).mergeObservable();
    }, 400);
    results.messages.assertEqual(onNext(250, "0 3"), onNext(260, "0 4"), onNext(310, "1 5"), onNext(340, "1 6"));
    xs.subscriptions.assertEqual(subscribe(200, 400));
});

test('Window_Closings_Error', function () {
    var ex, results, scheduler, window, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onError(590, ex));
    window = 1;
    results = scheduler.startWithCreate(function () {
        return xs.window(function () {
            return Observable.timer(window++ * 100, undefined, scheduler);
        }).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            });
        }).mergeObservable();
    });
    results.messages.assertEqual(onNext(250, "0 3"), onNext(260, "0 4"), onNext(310, "1 5"), onNext(340, "1 6"), onNext(410, "1 7"), onNext(420, "1 8"), onNext(470, "1 9"), onNext(550, "2 10"), onError(590, ex));
    xs.subscriptions.assertEqual(subscribe(200, 590));
});

test('Window_Closings_Throw', function () {
    var ex, results, scheduler, window, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onCompleted(590));
    window = 1;
    results = scheduler.startWithCreate(function () {
        return xs.window(function () {
            throw ex;
        }).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            });
        }).mergeObservable();
    });
    results.messages.assertEqual(onError(200, ex));
    xs.subscriptions.assertEqual(subscribe(200, 200));
});

test('Window_Closings_WindowClose_Error', function () {
    var ex, results, scheduler, window, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onCompleted(590));
    window = 1;
    results = scheduler.startWithCreate(function () {
        return xs.window(function () {
            return Observable.throwException(ex, scheduler);
        }).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            });
        }).mergeObservable();
    });
    results.messages.assertEqual(onError(201, ex));
    xs.subscriptions.assertEqual(subscribe(200, 201));
});

test('Window_Closings_Default', function () {
    var results, scheduler, window, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onCompleted(590));
    window = 1;
    results = scheduler.startWithCreate(function () {
        return xs.window(function () {
            return Observable.timer(window++ * 100, undefined, scheduler);
        }).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            });
        }).mergeObservable();
    });
    results.messages.assertEqual(onNext(250, "0 3"), onNext(260, "0 4"), onNext(310, "1 5"), onNext(340, "1 6"), onNext(410, "1 7"), onNext(420, "1 8"), onNext(470, "1 9"), onNext(550, "2 10"), onCompleted(590));
    xs.subscriptions.assertEqual(subscribe(200, 590));
});

test('Window_OpeningClosings_Basic', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onCompleted(590));
    ys = scheduler.createHotObservable(onNext(255, 50), onNext(330, 100), onNext(350, 50), onNext(400, 90), onCompleted(900));
    results = scheduler.startWithCreate(function () {
        return xs.window(ys, function (x) {
            return Observable.timer(x, undefined, scheduler);
        }).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            });
        }).mergeObservable();
    });
    results.messages.assertEqual(onNext(260, "0 4"), onNext(340, "1 6"), onNext(410, "1 7"), onNext(410, "3 7"), onNext(420, "1 8"), onNext(420, "3 8"), onNext(470, "3 9"), onCompleted(900));
    xs.subscriptions.assertEqual(subscribe(200, 900));
    ys.subscriptions.assertEqual(subscribe(200, 900));
});

test('Window_OpeningClosings_Throw', function () {
    var ex, results, scheduler, xs, ys;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onCompleted(590));
    ys = scheduler.createHotObservable(onNext(255, 50), onNext(330, 100), onNext(350, 50), onNext(400, 90), onCompleted(900));
    results = scheduler.startWithCreate(function () {
        return xs.window(ys, function (x) {
            throw ex;
        }).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            });
        }).mergeObservable();
    });
    results.messages.assertEqual(onError(255, ex));
    xs.subscriptions.assertEqual(subscribe(200, 255));
    ys.subscriptions.assertEqual(subscribe(200, 255));
});

test('Window_OpeningClosings_Dispose', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onCompleted(590));
    ys = scheduler.createHotObservable(onNext(255, 50), onNext(330, 100), onNext(350, 50), onNext(400, 90), onCompleted(900));
    results = scheduler.startWithDispose(function () {
        return xs.window(ys, function (x) {
            return Observable.timer(x, undefined, scheduler);
        }).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            });
        }).mergeObservable();
    }, 415);
    results.messages.assertEqual(onNext(260, "0 4"), onNext(340, "1 6"), onNext(410, "1 7"), onNext(410, "3 7"));
    xs.subscriptions.assertEqual(subscribe(200, 415));
    ys.subscriptions.assertEqual(subscribe(200, 415));
});

test('Window_OpeningClosings_Data_Error', function () {
    var ex, results, scheduler, xs, ys;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onError(415, ex));
    ys = scheduler.createHotObservable(onNext(255, 50), onNext(330, 100), onNext(350, 50), onNext(400, 90), onCompleted(900));
    results = scheduler.startWithCreate(function () {
        return xs.window(ys, function (x) {
            return Observable.timer(x, undefined, scheduler);
        }).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            });
        }).mergeObservable();
    });
    results.messages.assertEqual(onNext(260, "0 4"), onNext(340, "1 6"), onNext(410, "1 7"), onNext(410, "3 7"), onError(415, ex));
    xs.subscriptions.assertEqual(subscribe(200, 415));
    ys.subscriptions.assertEqual(subscribe(200, 415));
});

test('Window_OpeningClosings_Window_Error', function () {
    var ex, results, scheduler, xs, ys;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onCompleted(590));
    ys = scheduler.createHotObservable(onNext(255, 50), onNext(330, 100), onNext(350, 50), onNext(400, 90), onError(415, ex));
    results = scheduler.startWithCreate(function () {
        return xs.window(ys, function (x) {
            return Observable.timer(x, undefined, scheduler);
        }).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            });
        }).mergeObservable();
    });
    results.messages.assertEqual(onNext(260, "0 4"), onNext(340, "1 6"), onNext(410, "1 7"), onNext(410, "3 7"), onError(415, ex));
    xs.subscriptions.assertEqual(subscribe(200, 415));
    ys.subscriptions.assertEqual(subscribe(200, 415));
});

test('Window_Boundaries_Simple', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(90, 1),
        onNext(180, 2),
        onNext(250, 3),
        onNext(260, 4),
        onNext(310, 5),
        onNext(340, 6),
        onNext(410, 7),
        onNext(420, 8),
        onNext(470, 9),
        onNext(550, 10),
        onCompleted(590)
    );

    var ys = scheduler.createHotObservable(
        onNext(255, true),
        onNext(330, true),
        onNext(350, true),
        onNext(400, true),
        onNext(500, true),
        onCompleted(900)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.window(ys).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            })
        }).mergeObservable();
    });

    res.messages.assertEqual(
        onNext(250, "0 3"),
        onNext(260, "1 4"),
        onNext(310, "1 5"),
        onNext(340, "2 6"),
        onNext(410, "4 7"),
        onNext(420, "4 8"),
        onNext(470, "4 9"),
        onNext(550, "5 10"),
        onCompleted(590)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 590)
    );

    ys.subscriptions.assertEqual(
        subscribe(200, 590)
    );
});

test('Window_Boundaries_onCompletedBoundaries', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
            onNext(90, 1),
            onNext(180, 2),
            onNext(250, 3),
            onNext(260, 4),
            onNext(310, 5),
            onNext(340, 6),
            onNext(410, 7),
            onNext(420, 8),
            onNext(470, 9),
            onNext(550, 10),
            onCompleted(590)
    );

    var ys = scheduler.createHotObservable(
            onNext(255, true),
            onNext(330, true),
            onNext(350, true),
            onCompleted(400)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.window(ys).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            })
        }).mergeObservable();
    });

    res.messages.assertEqual(
            onNext(250, "0 3"),
            onNext(260, "1 4"),
            onNext(310, "1 5"),
            onNext(340, "2 6"),
            onCompleted(400)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 400)
    );

    ys.subscriptions.assertEqual(
        subscribe(200, 400)
    );
});

test('Window_Boundaries_onErrorSource', function () {
    var ex = 'ex'
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
            onNext(90, 1),
            onNext(180, 2),
            onNext(250, 3),
            onNext(260, 4),
            onNext(310, 5),
            onNext(340, 6),
            onNext(380, 7),
            onError(400, ex)
    );

    var ys = scheduler.createHotObservable(
            onNext(255, true),
            onNext(330, true),
            onNext(350, true),
            onCompleted(500)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.window(ys).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            })
        }).mergeObservable();
    });

    res.messages.assertEqual(
            onNext(250, "0 3"),
            onNext(260, "1 4"),
            onNext(310, "1 5"),
            onNext(340, "2 6"),
            onNext(380, "3 7"),
            onError(400, ex)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 400)
    );

    ys.subscriptions.assertEqual(
        subscribe(200, 400)
    );
});

test('Window_Boundaries_onErrorBoundaries', function () {
    var ex = 'ex'
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
            onNext(90, 1),
            onNext(180, 2),
            onNext(250, 3),
            onNext(260, 4),
            onNext(310, 5),
            onNext(340, 6),
            onNext(410, 7),
            onNext(420, 8),
            onNext(470, 9),
            onNext(550, 10),
            onCompleted(590)
    );

    var ys = scheduler.createHotObservable(
            onNext(255, true),
            onNext(330, true),
            onNext(350, true),
            onError(400, ex)
    );

    var res = scheduler.startWithCreate(function () {
        return xs.window(ys).select(function (w, i) {
            return w.select(function (x) {
                return i.toString() + ' ' + x.toString();
            })
        }).mergeObservable();
    });

    res.messages.assertEqual(
            onNext(250, "0 3"),
            onNext(260, "1 4"),
            onNext(310, "1 5"),
            onNext(340, "2 6"),
            onError(400, ex)
    );

    xs.subscriptions.assertEqual(
        subscribe(200, 400)
    );

    ys.subscriptions.assertEqual(
        subscribe(200, 400)
    );
});