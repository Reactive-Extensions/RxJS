(function(window) {

    var root = window.Rx;
    
    QUnit.module('ObservableExperimentalTest');

    var Observable = root.Observable,
	    TestScheduler = root.TestScheduler,
	    onNext = root.ReactiveTest.onNext,
	    onError = root.ReactiveTest.onError,
	    onCompleted = root.ReactiveTest.onCompleted,
	    subscribe = root.ReactiveTest.subscribe;

    function sequenceEqual(a1, a2) {
        if (a1.length !== a2.length) {
            return false;
        }
        for (var i = 0, len = a1.length; i < len; i++) {
            if (a1[i] !== a2[i]) {
                return false;
            }
        }
        return true;
    }

    test('ForkJoin_EmptyEmpty', function () {
        var e, o, results, scheduler;
        scheduler = new TestScheduler();
        o = scheduler.createHotObservable(onNext(150, 1), onCompleted(230));
        e = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return e.forkJoin(o, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onCompleted(250));
    });

    test('ForkJoin_None', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.forkJoin();
        });
        results.messages.assertEqual(onCompleted(200));
    });

    test('ForkJoin_EmptyReturn', function () {
        var e, o, results, scheduler;
        scheduler = new TestScheduler();
        o = scheduler.createHotObservable(onNext(150, 1), onCompleted(230));
        e = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return e.forkJoin(o, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onCompleted(250));
    });

    test('ForkJoin_ReturnEmpty', function () {
        var e, o, results, scheduler;
        scheduler = new TestScheduler();
        o = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(230));
        e = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return e.forkJoin(o, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onCompleted(250));
    });

    test('ForkJoin_ReturnReturn', function () {
        var e, o, results, scheduler;
        scheduler = new TestScheduler();
        o = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(230));
        e = scheduler.createHotObservable(onNext(150, 1), onNext(220, 3), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return e.forkJoin(o, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onNext(250, 2 + 3), onCompleted(250));
    });

    test('ForkJoin_EmptyThrow', function () {
        var e, ex, o, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        o = scheduler.createHotObservable(onNext(150, 1), onCompleted(230));
        e = scheduler.createHotObservable(onNext(150, 1), onError(210, ex), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return e.forkJoin(o, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(210, ex));
    });

    test('ForkJoin_ThrowEmpty', function () {
        var e, ex, o, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        o = scheduler.createHotObservable(onNext(150, 1), onError(210, ex), onCompleted(230));
        e = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return e.forkJoin(o, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(210, ex));
    });

    test('ForkJoin_ReturnThrow', function () {
        var e, ex, o, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        o = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(230));
        e = scheduler.createHotObservable(onNext(150, 1), onError(220, ex), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return e.forkJoin(o, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
    });

    test('ForkJoin_ThrowReturn', function () {
        var e, ex, o, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        o = scheduler.createHotObservable(onNext(150, 1), onError(220, ex), onCompleted(230));
        e = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return e.forkJoin(o, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onError(220, ex));
    });

    test('ForkJoin_Binary', function () {
        var e, o, results, scheduler;
        scheduler = new TestScheduler();
        o = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onNext(225, 4), onCompleted(230));
        e = scheduler.createHotObservable(onNext(150, 1), onNext(235, 6), onNext(240, 7), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return e.forkJoin(o, function (x, y) {
                return x + y;
            });
        });
        results.messages.assertEqual(onNext(250, 4 + 7), onCompleted(250));
    });

    test('ForkJoin_NaryParams', function () {
        var o1, o2, o3, results, scheduler;
        scheduler = new TestScheduler();
        o1 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onNext(225, 4), onCompleted(230));
        o2 = scheduler.createHotObservable(onNext(150, 1), onNext(235, 6), onNext(240, 7), onCompleted(250));
        o3 = scheduler.createHotObservable(onNext(150, 1), onNext(230, 3), onNext(245, 5), onCompleted(270));
        results = scheduler.startWithCreate(function () {
            return Observable.forkJoin(o1, o2, o3);
        }).messages;
        ok(results[0].time === 270 && sequenceEqual(results[0].value.value, [4, 7, 5]));
        ok(results[1].time === 270 && results[1].value.kind === 'C');
        equal(2, results.length);
    });


    test('ForkJoin_NaryParamsEmpty', function () {
        var o1, o2, o3, results, scheduler;
        scheduler = new TestScheduler();
        o1 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onNext(225, 4), onCompleted(230));
        o2 = scheduler.createHotObservable(onNext(150, 1), onNext(235, 6), onNext(240, 7), onCompleted(250));
        o3 = scheduler.createHotObservable(onCompleted(270));
        results = scheduler.startWithCreate(function () {
            return Observable.forkJoin(o1, o2, o3);
        }).messages;
        ok(results[0].time === 270 && results[0].value.kind === 'C');
        equal(1, results.length);
    });

    test('ForkJoin_NaryParamsEmptyBeforeEnd', function () {
        var o1, o2, o3, results, scheduler;
        scheduler = new TestScheduler();
        o1 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onNext(225, 4), onCompleted(230));
        o2 = scheduler.createHotObservable(onCompleted(235));
        o3 = scheduler.createHotObservable(onNext(150, 1), onNext(230, 3), onNext(245, 5), onCompleted(270));
        results = scheduler.startWithCreate(function () {
            return Observable.forkJoin(o1, o2, o3);
        }).messages;
        equal(1, results.length);
        ok(results[0].time === 235 && results[0].value.kind === 'C');
    });

    test('Expand_Empty', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onCompleted(300));
        results = scheduler.startWithCreate(function () {
            return xs.expand(function () {
                return scheduler.createColdObservable(onNext(100, 1), onNext(200, 2), onCompleted(300));
            }, scheduler);
        });
        results.messages.assertEqual(onCompleted(300));
        xs.subscriptions.assertEqual(subscribe(201, 300));
    });

    test('Expand_Error', function () {
        var ex, results, scheduler, xs;
        scheduler = new TestScheduler();
        ex = 'ex';
        xs = scheduler.createHotObservable(onError(300, ex));
        results = scheduler.startWithCreate(function () {
            return xs.expand(function (x) {
                return scheduler.createColdObservable(onNext(100 + x, 2 * x), onNext(200 + x, 3 * x), onCompleted(300 + x));
            }, scheduler);
        });
        results.messages.assertEqual(onError(300, ex));
        xs.subscriptions.assertEqual(subscribe(201, 300));
    });

    test('Expand_Never', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable();
        results = scheduler.startWithCreate(function () {
            return xs.expand(function (x) {
                return scheduler.createColdObservable(onNext(100 + x, 2 * x), onNext(200 + x, 3 * x), onCompleted(300 + x));
            }, scheduler);
        });
        results.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(201, 1000));
    });

    test('Expand_Basic', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(550, 1), onNext(850, 2), onCompleted(950));
        results = scheduler.startWithCreate(function () {
            return xs.expand(function (x) {
                return scheduler.createColdObservable(onNext(100, 2 * x), onNext(200, 3 * x), onCompleted(300));
            }, scheduler);
        });
        results.messages.assertEqual(onNext(550, 1), onNext(651, 2), onNext(751, 3), onNext(752, 4), onNext(850, 2), onNext(852, 6), onNext(852, 6), onNext(853, 8), onNext(951, 4), onNext(952, 9), onNext(952, 12), onNext(953, 12), onNext(953, 12), onNext(954, 16));
        xs.subscriptions.assertEqual(subscribe(201, 950));
    });

    test('Expand_Throw', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(550, 1), onNext(850, 2), onCompleted(950));
        results = scheduler.startWithCreate(function () {
            return xs.expand(function (x) {
                throw ex;
            }, scheduler);
        });
        results.messages.assertEqual(onNext(550, 1), onError(550, ex));
        xs.subscriptions.assertEqual(subscribe(201, 550));
    });

    test('Let_CallsFunctionImmediately', function () {
        var called = false;
        Observable.empty().letBind(function (x) {
            called = true;
            return x;
        });
        ok(called);
    });

    test('ManySelect_Basic', function () {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(100, 1),
            onNext(220, 2),
            onNext(270, 3),
            onNext(410, 4),
            onCompleted(500)
        );

        var res = scheduler.startWithCreate(function () { 
            return xs.manySelect(function (ys) { return ys.first(); }, scheduler);
        });

        res.messages.assertEqual(
            onNext(221, 2),
            onNext(271, 3),
            onNext(411, 4),
            onCompleted(501)
        );

        xs.subscriptions.assertEqual(
            subscribe(200, 500)
        );
    });

    test('ManySelect_Error', function () {
        var scheduler = new TestScheduler();

        var ex = new Error();

        var xs = scheduler.createHotObservable(
            onNext(100, 1),
            onNext(220, 2),
            onNext(270, 3),
            onNext(410, 4),
            onError(500, ex)
        );

        var res = scheduler.startWithCreate(function () { 
            return xs.manySelect(function (ys) { return ys.first(); }, scheduler);
        });

        res.messages.assertEqual(
            onNext(221, 2),
            onNext(271, 3),
            onNext(411, 4),
            onError(501, ex)
        );

        xs.subscriptions.assertEqual(
            subscribe(200, 500)
        );
    });

}(typeof global == 'object' && global || this));