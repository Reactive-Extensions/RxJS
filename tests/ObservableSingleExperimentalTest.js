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

    QUnit.module('ObservableSingleExperimentalTest');

    var Observable = root.Observable,
        TestScheduler = root.TestScheduler,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe;

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

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    if (!window.document) {
        QUnit.start();
    }
}(typeof global == 'object' && global || this));