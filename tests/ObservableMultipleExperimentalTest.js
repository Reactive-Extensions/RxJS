/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

(function(window) {

    // Check if browser vs node
    var root;
    if (!window.document) {
        root = require('../rx.js');
        require('../rx.testing');
        require('./ReactiveAssert');
    } else {
        root = window.Rx;
    }

    // use a single load function
    var load = typeof require == 'function' ? require : window.load;

    // load QUnit and CLIB if needed
    var QUnit =
      window.QUnit || (
        window.setTimeout || (window.addEventListener = window.setTimeout = / /),
        window.QUnit = load('./vendor/qunit-1.9.0.js') || window.QUnit,
        load('./vendor/qunit-clib.js'),
        (window.addEventListener || 0).test && delete window.addEventListener,
        window.QUnit
      );

    QUnit.module('ObservableMultipleExperimentalTest');

    var Observable = root.Observable,
        TestScheduler = root.TestScheduler,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe;

    var sequenceEqual = function (a1, a2) {
        if (a1.length !== a2.length) {
            return false;
        }
        for (var i = 0, len = a1.length; i < len; i++) {
            if (a1[i] !== a2[i]) {
                return false;
            }
        }
        return true;
    };

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

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    if (!window.document) {
        QUnit.start();
    }
}(typeof global == 'object' && global || this));