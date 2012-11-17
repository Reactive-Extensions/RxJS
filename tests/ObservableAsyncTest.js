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

    QUnit.module('ObservableAsyncTest');

    var Observable = root.Observable,
        TestScheduler = root.TestScheduler,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe;

    test('ToAsync0', function () {
        var res, scheduler;
        scheduler = new TestScheduler();
        res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function () {
                return 0;
            }, scheduler)();
        });
        res.messages.assertEqual(onNext(200, 0), onCompleted(200));
    });

    test('ToAsync1', function () {
        var res, scheduler;
        scheduler = new TestScheduler();
        res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function (x) {
                return x;
            }, scheduler)(1);
        });
        res.messages.assertEqual(onNext(200, 1), onCompleted(200));
    });

    test('ToAsync2', function () {
        var res, scheduler;
        scheduler = new TestScheduler();
        res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function (x, y) {
                return x + y;
            }, scheduler)(1, 2);
        });
        res.messages.assertEqual(onNext(200, 3), onCompleted(200));
    });

    test('ToAsync3', function () {
        var res, scheduler;
        scheduler = new TestScheduler();
        res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function (x, y, z) {
                return x + y + z;
            }, scheduler)(1, 2, 3);
        });
        res.messages.assertEqual(onNext(200, 6), onCompleted(200));
    });

    test('ToAsync4', function () {
        var res, scheduler;
        scheduler = new TestScheduler();
        res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function (a, b, c, d) {
                return a + b + c + d;
            }, scheduler)(1, 2, 3, 4);
        });
        res.messages.assertEqual(onNext(200, 10), onCompleted(200));
    });

    test('ToAsync_Error0', function () {
        var ex, res, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function () {
                throw ex;
            }, scheduler)();
        });
        res.messages.assertEqual(onError(200, ex));
    });

    test('ToAsync_Error1', function () {
        var ex, res, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function (a) {
                throw ex;
            }, scheduler)(1);
        });
        res.messages.assertEqual(onError(200, ex));
    });

    test('ToAsync_Error2', function () {
        var ex, res, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function (a, b) {
                throw ex;
            }, scheduler)(1, 2);
        });
        res.messages.assertEqual(onError(200, ex));
    });

    test('ToAsync_Error3', function () {
        var ex, res, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function (a, b, c) {
                throw ex;
            }, scheduler)(1, 2, 3);
        });
        res.messages.assertEqual(onError(200, ex));
    });

    test('ToAsync_Error4', function () {
        var ex, res, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        res = scheduler.startWithCreate(function () {
            return Observable.toAsync(function (a, b, c, d) {
                throw ex;
            }, scheduler)(1, 2, 3, 4);
        });
        res.messages.assertEqual(onError(200, ex));
    });

    test('Start_Action2', function () {
        var done, res, scheduler, source;
        source = this;
        scheduler = new TestScheduler();
        done = false;
        res = scheduler.startWithCreate(function () {
            return Observable.start(function () {
                done = true;
            }, scheduler);
        });
        res.messages.assertEqual(onNext(200, undefined), onCompleted(200));
        ok(done);
    });

    test('Start_Func2', function () {
        var res, scheduler, source;
        source = this;
        scheduler = new TestScheduler();
        res = scheduler.startWithCreate(function () {
            return Observable.start(function () {
                return 1;
            }, scheduler);
        });
        res.messages.assertEqual(onNext(200, 1), onCompleted(200));
    });

    test('Start_FuncError', function () {
        var ex, res, scheduler, source;
        ex = 'ex';
        source = this;
        scheduler = new TestScheduler();
        res = scheduler.startWithCreate(function () {
            return Observable.start(function () {
                throw ex;
            }, scheduler);
        });
        res.messages.assertEqual(onError(200, ex));
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    if (!window.document) {
        QUnit.start();
    }
}(typeof global == 'object' && global || this));