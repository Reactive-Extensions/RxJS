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

    QUnit.module('AsyncSubjectTest');

    var AsyncSubject = root.AsyncSubject,
	    TestScheduler = root.TestScheduler,
	    onNext = root.ReactiveTest.onNext,
	    onError = root.ReactiveTest.onError,
	    onCompleted = root.ReactiveTest.onCompleted,
	    subscribe = root.ReactiveTest.subscribe;

    test('Infinite', function () {
        var results1, results2, results3, scheduler, subject, subscription, subscription1, subscription2, subscription3, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(
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
        results1 = scheduler.createObserver();
        results2 = scheduler.createObserver();
        results3 = scheduler.createObserver();
        scheduler.scheduleAbsolute(100, function () {
            subject = new AsyncSubject();
        });
        scheduler.scheduleAbsolute(200, function () {
            subscription = xs.subscribe(subject);
        });
        scheduler.scheduleAbsolute(1000, function () {
            subscription.dispose();
        });
        scheduler.scheduleAbsolute(300, function () {
            subscription1 = subject.subscribe(results1);
        });
        scheduler.scheduleAbsolute(400, function () {
            subscription2 = subject.subscribe(results2);
        });
        scheduler.scheduleAbsolute(900, function () {
            subscription3 = subject.subscribe(results3);
        });
        scheduler.scheduleAbsolute(600, function () {
            subscription1.dispose();
        });
        scheduler.scheduleAbsolute(700, function () {
            subscription2.dispose();
        });
        scheduler.scheduleAbsolute(800, function () {
            subscription1.dispose();
        });
        scheduler.scheduleAbsolute(950, function () {
            subscription3.dispose();
        });
        scheduler.start();
        results1.messages.assertEqual();
        results2.messages.assertEqual();
        results3.messages.assertEqual();
    });

    test('Finite', function () {
        var results1, results2, results3, scheduler, subject, subscription, subscription1, subscription2, subscription3, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(
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
        results1 = scheduler.createObserver();
        results2 = scheduler.createObserver();
        results3 = scheduler.createObserver();
        scheduler.scheduleAbsolute(100, function () {
            subject = new AsyncSubject();
        });
        scheduler.scheduleAbsolute(200, function () {
            subscription = xs.subscribe(subject);
        });
        scheduler.scheduleAbsolute(1000, function () {
            subscription.dispose();
        });
        scheduler.scheduleAbsolute(300, function () {
            subscription1 = subject.subscribe(results1);
        });
        scheduler.scheduleAbsolute(400, function () {
            subscription2 = subject.subscribe(results2);
        });
        scheduler.scheduleAbsolute(900, function () {
            subscription3 = subject.subscribe(results3);
        });
        scheduler.scheduleAbsolute(600, function () {
            subscription1.dispose();
        });
        scheduler.scheduleAbsolute(700, function () {
            subscription2.dispose();
        });
        scheduler.scheduleAbsolute(800, function () {
            subscription1.dispose();
        });
        scheduler.scheduleAbsolute(950, function () {
            subscription3.dispose();
        });
        scheduler.start();
        results1.messages.assertEqual();
        results2.messages.assertEqual(onNext(630, 7), onCompleted(630));
        results3.messages.assertEqual(onNext(900, 7), onCompleted(900));
    });

    test('Error', function () {
        var ex, results1, results2, results3, scheduler, subject, subscription, subscription1, subscription2, subscription3, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(
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
            onError(660, 'ex2')
        );
        results1 = scheduler.createObserver();
        results2 = scheduler.createObserver();
        results3 = scheduler.createObserver();
        scheduler.scheduleAbsolute(100, function () {
            subject = new AsyncSubject();
        });
        scheduler.scheduleAbsolute(200, function () {
            subscription = xs.subscribe(subject);
        });
        scheduler.scheduleAbsolute(1000, function () {
            subscription.dispose();
        });
        scheduler.scheduleAbsolute(300, function () {
            subscription1 = subject.subscribe(results1);
        });
        scheduler.scheduleAbsolute(400, function () {
            subscription2 = subject.subscribe(results2);
        });
        scheduler.scheduleAbsolute(900, function () {
            subscription3 = subject.subscribe(results3);
        });
        scheduler.scheduleAbsolute(600, function () {
            subscription1.dispose();
        });
        scheduler.scheduleAbsolute(700, function () {
            subscription2.dispose();
        });
        scheduler.scheduleAbsolute(800, function () {
            subscription1.dispose();
        });
        scheduler.scheduleAbsolute(950, function () {
            subscription3.dispose();
        });
        scheduler.start();
        results1.messages.assertEqual();
        results2.messages.assertEqual(onError(630, ex));
        results3.messages.assertEqual(onError(900, ex));
    });

    test('Canceled', function () {
        var results1, results2, results3, scheduler, subject, subscription, subscription1, subscription2, subscription3, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(
            onCompleted(630),
            onNext(640, 9),
            onCompleted(650),
            onError(660, 'ex')
            );
        results1 = scheduler.createObserver();
        results2 = scheduler.createObserver();
        results3 = scheduler.createObserver();
        scheduler.scheduleAbsolute(100, function () {
            subject = new AsyncSubject();
        });
        scheduler.scheduleAbsolute(200, function () {
            subscription = xs.subscribe(subject);
        });
        scheduler.scheduleAbsolute(1000, function () {
            subscription.dispose();
        });
        scheduler.scheduleAbsolute(300, function () {
            subscription1 = subject.subscribe(results1);
        });
        scheduler.scheduleAbsolute(400, function () {
            subscription2 = subject.subscribe(results2);
        });
        scheduler.scheduleAbsolute(900, function () {
            subscription3 = subject.subscribe(results3);
        });
        scheduler.scheduleAbsolute(600, function () {
            subscription1.dispose();
        });
        scheduler.scheduleAbsolute(700, function () {
            subscription2.dispose();
        });
        scheduler.scheduleAbsolute(800, function () {
            subscription1.dispose();
        });
        scheduler.scheduleAbsolute(950, function () {
            subscription3.dispose();
        });
        scheduler.start();
        results1.messages.assertEqual();
        results2.messages.assertEqual(onCompleted(630));
        results3.messages.assertEqual(onCompleted(900));
    });

    test('SubjectDisposed', function () {
        var results1, results2, results3, scheduler, subject, subscription1, subscription2, subscription3;
        scheduler = new TestScheduler();
        results1 = scheduler.createObserver();
        results2 = scheduler.createObserver();
        results3 = scheduler.createObserver();
        scheduler.scheduleAbsolute(100, function () {
            subject = new AsyncSubject();
        });
        scheduler.scheduleAbsolute(200, function () {
            subscription1 = subject.subscribe(results1);
        });
        scheduler.scheduleAbsolute(300, function () {
            subscription2 = subject.subscribe(results2);
        });
        scheduler.scheduleAbsolute(400, function () {
            subscription3 = subject.subscribe(results3);
        });
        scheduler.scheduleAbsolute(500, function () {
            subscription1.dispose();
        });
        scheduler.scheduleAbsolute(600, function () {
            subject.dispose();
        });
        scheduler.scheduleAbsolute(700, function () {
            subscription2.dispose();
        });
        scheduler.scheduleAbsolute(800, function () {
            subscription3.dispose();
        });
        scheduler.scheduleAbsolute(150, function () {
            subject.onNext(1);
        });
        scheduler.scheduleAbsolute(250, function () {
            subject.onNext(2);
        });
        scheduler.scheduleAbsolute(350, function () {
            subject.onNext(3);
        });
        scheduler.scheduleAbsolute(450, function () {
            subject.onNext(4);
        });
        scheduler.scheduleAbsolute(550, function () {
            subject.onNext(5);
        });
        scheduler.scheduleAbsolute(650, function () {
            raises(function () {
                subject.onNext(6);
            });
        });
        scheduler.scheduleAbsolute(750, function () {
            raises(function () {
                subject.onCompleted();
            });
        });
        scheduler.scheduleAbsolute(850, function () {
            raises(function () {
                subject.onError('ex');
            });
        });
        scheduler.scheduleAbsolute(950, function () {
            raises(function () {
                subject.subscribe();
            });
        });
        scheduler.start();
        results1.messages.assertEqual();
        results2.messages.assertEqual();
        results3.messages.assertEqual();
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    if (!window.document) {
        QUnit.start();
    }
}(typeof global == 'object' && global || this));