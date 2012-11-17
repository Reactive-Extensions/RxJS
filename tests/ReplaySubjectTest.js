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

    QUnit.module('ReplaySubjectTest');

    var ReplaySubject = root.ReplaySubject,
        Observable = root.Observable,
        Observer = root.Observer,
        TestScheduler = root.TestScheduler,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe,
        created = root.ReactiveTest.created,
        subscribed = root.ReactiveTest.subscribed,
        disposed = root.ReactiveTest.disposed;

    test('Infinite', function () {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(70, 1),
            onNext(110, 2),
            onNext(220, 3),
            onNext(270, 4),
            onNext(340, 5),
            onNext(410, 6),
            onNext(520, 7),
            onNext(630, 8),
            onNext(710, 9),
            onNext(870, 10),
            onNext(940, 11),
            onNext(1020, 12)
        );

        var subject, subscription, subscription1, subscription2, subscription3;

        var results1 = scheduler.createObserver();
        var results2 = scheduler.createObserver();
        var results3 = scheduler.createObserver();

        scheduler.scheduleAbsolute(100, function () { subject = new ReplaySubject(3, 100, scheduler); });
        scheduler.scheduleAbsolute(200, function () { subscription = xs.subscribe(subject); });
        scheduler.scheduleAbsolute(1000, function () { subscription.dispose(); });

        scheduler.scheduleAbsolute(300, function () { subscription1 = subject.subscribe(results1); });
        scheduler.scheduleAbsolute(400, function () { subscription2 = subject.subscribe(results2); });
        scheduler.scheduleAbsolute(900, function () { subscription3 = subject.subscribe(results3); });

        scheduler.scheduleAbsolute(600, function () { subscription1.dispose(); });
        scheduler.scheduleAbsolute(700, function () { subscription2.dispose(); });
        scheduler.scheduleAbsolute(800, function () { subscription1.dispose(); });
        scheduler.scheduleAbsolute(950, function () { subscription3.dispose(); });

        scheduler.start();

        results1.messages.assertEqual(
            onNext(301, 3),
            onNext(302, 4),
            onNext(341, 5),
            onNext(411, 6),
            onNext(521, 7)
        );

        results2.messages.assertEqual(
            onNext(401, 5),
            onNext(411, 6),
            onNext(521, 7),
            onNext(631, 8)
        );

        results3.messages.assertEqual(
            onNext(901, 10),
            onNext(941, 11)
        );
    });

    test('Infinite2', function () {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(70, 1),
            onNext(110, 2),
            onNext(220, 3),
            onNext(270, 4),
            onNext(280, -1),
            onNext(290, -2),
            onNext(340, 5),
            onNext(410, 6),
            onNext(520, 7),
            onNext(630, 8),
            onNext(710, 9),
            onNext(870, 10),
            onNext(940, 11),
            onNext(1020, 12)
        );

        var subject, subscription, subscription1, subscription2, subscription3;

        var results1 = scheduler.createObserver();
        var results2 = scheduler.createObserver();
        var results3 = scheduler.createObserver();

        scheduler.scheduleAbsolute(100, function () { subject = new ReplaySubject(3, 100, scheduler); });
        scheduler.scheduleAbsolute(200, function () { subscription = xs.subscribe(subject); });
        scheduler.scheduleAbsolute(1000, function () { subscription.dispose(); });

        scheduler.scheduleAbsolute(300, function () { subscription1 = subject.subscribe(results1); });
        scheduler.scheduleAbsolute(400, function () { subscription2 = subject.subscribe(results2); });
        scheduler.scheduleAbsolute(900, function () { subscription3 = subject.subscribe(results3); });

        scheduler.scheduleAbsolute(600, function () { subscription1.dispose(); });
        scheduler.scheduleAbsolute(700, function () { subscription2.dispose(); });
        scheduler.scheduleAbsolute(800, function () { subscription1.dispose(); });
        scheduler.scheduleAbsolute(950, function () { subscription3.dispose(); });

        scheduler.start();

        results1.messages.assertEqual(
            onNext(301, 4),
            onNext(302, -1),
            onNext(303, -2),
            onNext(341, 5),
            onNext(411, 6),
            onNext(521, 7)
        );

        results2.messages.assertEqual(
            onNext(401, 5),
            onNext(411, 6),
            onNext(521, 7),
            onNext(631, 8)
        );

        results3.messages.assertEqual(
            onNext(901, 10),
            onNext(941, 11)
        );
    });

    test('Finite', function () {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(70, 1),
            onNext(110, 2),
            onNext(220, 3),
            onNext(270, 4),
            onNext(340, 5),
            onNext(410, 6),
            onNext(520, 7),
            onCompleted(630),
            onNext(640, 9),
            onCompleted(650),
            onError(660, 'ex')
        );

        var subject, subscription, subscription1, subscription2, subscription3;

        var results1 = scheduler.createObserver();
        var results2 = scheduler.createObserver();
        var results3 = scheduler.createObserver();

        scheduler.scheduleAbsolute(100, function () { subject = new ReplaySubject(3, 100, scheduler); });
        scheduler.scheduleAbsolute(200, function () { subscription = xs.subscribe(subject); });
        scheduler.scheduleAbsolute(1000, function () { subscription.dispose(); });

        scheduler.scheduleAbsolute(300, function () { subscription1 = subject.subscribe(results1); });
        scheduler.scheduleAbsolute(400, function () { subscription2 = subject.subscribe(results2); });
        scheduler.scheduleAbsolute(900, function () { subscription3 = subject.subscribe(results3); });

        scheduler.scheduleAbsolute(600, function () { subscription1.dispose(); });
        scheduler.scheduleAbsolute(700, function () { subscription2.dispose(); });
        scheduler.scheduleAbsolute(800, function () { subscription1.dispose(); });
        scheduler.scheduleAbsolute(950, function () { subscription3.dispose(); });

        scheduler.start();

        results1.messages.assertEqual(
            onNext(301, 3),
            onNext(302, 4),
            onNext(341, 5),
            onNext(411, 6),
            onNext(521, 7)
        );

        results2.messages.assertEqual(
            onNext(401, 5),
            onNext(411, 6),
            onNext(521, 7),
            onCompleted(631)
        );

        results3.messages.assertEqual(
            onCompleted(901)
        );
    });

    test('Error', function () {
        var scheduler = new TestScheduler();

        var ex = new Error('ex');

        var xs = scheduler.createHotObservable(
            onNext(70, 1),
            onNext(110, 2),
            onNext(220, 3),
            onNext(270, 4),
            onNext(340, 5),
            onNext(410, 6),
            onNext(520, 7),
            onError(630, ex),
            onNext(640, 9),
            onCompleted(650),
            onError(660, new Error('ex'))
        );

        var subject, subscription, subscription1, subscription2, subscription3;

        var results1 = scheduler.createObserver();
        var results2 = scheduler.createObserver();
        var results3 = scheduler.createObserver();

        scheduler.scheduleAbsolute(100, function () { subject = new ReplaySubject(3, 100, scheduler); });
        scheduler.scheduleAbsolute(200, function () { subscription = xs.subscribe(subject); });
        scheduler.scheduleAbsolute(1000, function () { subscription.dispose(); });

        scheduler.scheduleAbsolute(300, function () { subscription1 = subject.subscribe(results1); });
        scheduler.scheduleAbsolute(400, function () { subscription2 = subject.subscribe(results2); });
        scheduler.scheduleAbsolute(900, function () { subscription3 = subject.subscribe(results3); });

        scheduler.scheduleAbsolute(600, function () { subscription1.dispose(); });
        scheduler.scheduleAbsolute(700, function () { subscription2.dispose(); });
        scheduler.scheduleAbsolute(800, function () { subscription1.dispose(); });
        scheduler.scheduleAbsolute(950, function () { subscription3.dispose(); });

        scheduler.start();

        results1.messages.assertEqual(
            onNext(301, 3),
            onNext(302, 4),
            onNext(341, 5),
            onNext(411, 6),
            onNext(521, 7)
        );

        results2.messages.assertEqual(
            onNext(401, 5),
            onNext(411, 6),
            onNext(521, 7),
            onError(631, ex)
        );

        results3.messages.assertEqual(
            onError(901, ex)
        );
    });

    test('Canceled', function () {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onCompleted(630),
            onNext(640, 9),
            onCompleted(650),
            onError(660, new Error())
        );

        var subject, subscription, subscription1, subscription2, subscription3;

        var results1 = scheduler.createObserver();
        var results2 = scheduler.createObserver();
        var results3 = scheduler.createObserver();

        scheduler.scheduleAbsolute(100, function () { subject = new ReplaySubject(3, 100, scheduler); });
        scheduler.scheduleAbsolute(200, function () { subscription = xs.subscribe(subject); });
        scheduler.scheduleAbsolute(1000, function () { subscription.dispose(); });

        scheduler.scheduleAbsolute(300, function () { subscription1 = subject.subscribe(results1); });
        scheduler.scheduleAbsolute(400, function () { subscription2 = subject.subscribe(results2); });
        scheduler.scheduleAbsolute(900, function () { subscription3 = subject.subscribe(results3); });

        scheduler.scheduleAbsolute(600, function () { subscription1.dispose(); });
        scheduler.scheduleAbsolute(700, function () { subscription2.dispose(); });
        scheduler.scheduleAbsolute(800, function () { subscription1.dispose(); });
        scheduler.scheduleAbsolute(950, function () { subscription3.dispose(); });

        scheduler.start();

        results1.messages.assertEqual(
        );

        results2.messages.assertEqual(
            onCompleted(631)
        );

        results3.messages.assertEqual(
            onCompleted(901)
        );
    });

    test('SubjectDisposed', function () {
        var scheduler = new TestScheduler();

        var subject, subscription1, subscription2, subscription3;

        var results1 = scheduler.createObserver();
        var results2 = scheduler.createObserver();
        var results3 = scheduler.createObserver();

        scheduler.scheduleAbsolute(100, function () { subject = new ReplaySubject(undefined, undefined, scheduler); });
        scheduler.scheduleAbsolute(200, function () { subscription1 = subject.subscribe(results1); });
        scheduler.scheduleAbsolute(300, function () { subscription2 = subject.subscribe(results2); });
        scheduler.scheduleAbsolute(400, function () { subscription3 = subject.subscribe(results3); });
        scheduler.scheduleAbsolute(500, function () { subscription1.dispose(); });
        scheduler.scheduleAbsolute(600, function () { subject.dispose(); });
        scheduler.scheduleAbsolute(700, function () { subscription2.dispose(); });
        scheduler.scheduleAbsolute(800, function () { subscription3.dispose(); });

        scheduler.scheduleAbsolute(150, function () { subject.onNext(1); });
        scheduler.scheduleAbsolute(250, function () { subject.onNext(2); });
        scheduler.scheduleAbsolute(350, function () { subject.onNext(3); });
        scheduler.scheduleAbsolute(450, function () { subject.onNext(4); });
        scheduler.scheduleAbsolute(550, function () { subject.onNext(5); });
        scheduler.scheduleAbsolute(650, function () { raises(function () { subject.onNext(6); }); });
        scheduler.scheduleAbsolute(750, function () { raises(function () { subject.onCompleted(); }); });
        scheduler.scheduleAbsolute(850, function () { raises(function () { subject.onError(new Error()); }); });
        scheduler.scheduleAbsolute(950, function () { raises(function () { subject.subscribe(); }); });

        scheduler.start();

        results1.messages.assertEqual(
            onNext(201, 1),
            onNext(251, 2),
            onNext(351, 3),
            onNext(451, 4)
        );

        results2.messages.assertEqual(
            onNext(301, 1),
            onNext(302, 2),
            onNext(351, 3),
            onNext(451, 4),
            onNext(551, 5)
        );

        results3.messages.assertEqual(
            onNext(401, 1),
            onNext(402, 2),
            onNext(403, 3),
            onNext(451, 4),
            onNext(551, 5)
        );
    });

    test('ReplaySubjectDiesOut', function () {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(70, 1),
            onNext(110, 2),
            onNext(220, 3),
            onNext(270, 4),
            onNext(340, 5),
            onNext(410, 6),
            onNext(520, 7),
            onCompleted(580)
        );

        var subject;

        var results1 = scheduler.createObserver();
        var results2 = scheduler.createObserver();
        var results3 = scheduler.createObserver();
        var results4 = scheduler.createObserver();

        scheduler.scheduleAbsolute(100, function () { subject = new ReplaySubject(Number.MAX_VALUE, 100, scheduler); });
        scheduler.scheduleAbsolute(200, function () { xs.subscribe(subject); });

        scheduler.scheduleAbsolute(300, function () { subject.subscribe(results1); });
        scheduler.scheduleAbsolute(400, function () { subject.subscribe(results2); });
        scheduler.scheduleAbsolute(600, function () { subject.subscribe(results3); });
        scheduler.scheduleAbsolute(900, function () { subject.subscribe(results4); });

        scheduler.start();

        results1.messages.assertEqual(
            onNext(301, 3),
            onNext(302, 4),
            onNext(341, 5),
            onNext(411, 6),
            onNext(521, 7),
            onCompleted(581)
        );

        results2.messages.assertEqual(
            onNext(401, 5),
            onNext(411, 6),
            onNext(521, 7),
            onCompleted(581)
        );

        results3.messages.assertEqual(
            onNext(601, 7),
            onCompleted(602)
        );

        results4.messages.assertEqual(
            onCompleted(901)
        );
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    if (!window.document) {
        QUnit.start();
    }
}(typeof global == 'object' && global || this));