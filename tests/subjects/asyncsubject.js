(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, raises */

  QUnit.module('AsyncSubject');

  var AsyncSubject = Rx.AsyncSubject,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

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

    var results1 = scheduler.createObserver();
    var results2 = scheduler.createObserver();
    var results3 = scheduler.createObserver();
    var subject;

    var subscription, subscription1, subscription2, subscription3;

    scheduler.scheduleAbsolute(null, 100, function () {
        subject = new AsyncSubject();
    });
    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = xs.subscribe(subject);
    });
    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      subscription1 = subject.subscribe(results1);
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      subscription2 = subject.subscribe(results2);
    });

    scheduler.scheduleAbsolute(null, 900, function () {
      subscription3 = subject.subscribe(results3);
    });

    scheduler.scheduleAbsolute(null, 600, function () {
      subscription1.dispose();
    });

    scheduler.scheduleAbsolute(null, 700, function () {
      subscription2.dispose();
    });

    scheduler.scheduleAbsolute(null, 800, function () {
      subscription1.dispose();
    });

    scheduler.scheduleAbsolute(null, 950, function () {
      subscription3.dispose();
    });

    scheduler.start();

    results1.messages.assertEqual();

    results2.messages.assertEqual();

    results3.messages.assertEqual();
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
        onError(660, new Error())
      );

      var results1 = scheduler.createObserver();
      var results2 = scheduler.createObserver();
      var results3 = scheduler.createObserver();
      var subject;

      var subscription, subscription1, subscription2, subscription3;

      scheduler.scheduleAbsolute(null, 100, function () {
        subject = new AsyncSubject();
      });
      scheduler.scheduleAbsolute(null, 200, function () {
        subscription = xs.subscribe(subject);
      });
      scheduler.scheduleAbsolute(null, 1000, function () {
        subscription.dispose();
      });
      scheduler.scheduleAbsolute(null, 300, function () {
        subscription1 = subject.subscribe(results1);
      });
      scheduler.scheduleAbsolute(null, 400, function () {
        subscription2 = subject.subscribe(results2);
      });
      scheduler.scheduleAbsolute(null, 900, function () {
        subscription3 = subject.subscribe(results3);
      });
      scheduler.scheduleAbsolute(null, 600, function () {
        subscription1.dispose();
      });
      scheduler.scheduleAbsolute(null, 700, function () {
        subscription2.dispose();
      });
      scheduler.scheduleAbsolute(null, 800, function () {
        subscription1.dispose();
      });
      scheduler.scheduleAbsolute(null, 950, function () {
        subscription3.dispose();
      });
      scheduler.start();
      results1.messages.assertEqual();
      results2.messages.assertEqual(onNext(630, 7), onCompleted(630));
      results3.messages.assertEqual(onNext(900, 7), onCompleted(900));
  });

  test('Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(70, 1),
      onNext(110, 2),
      onNext(220, 3),
      onNext(270, 4),
      onNext(340, 5),
      onNext(410, 6),
      onNext(520, 7),
      onError(630, error),
      onNext(640, 9),
      onCompleted(650),
      onError(660, new Error())
    );

    var results1 = scheduler.createObserver();
    var results2 = scheduler.createObserver();
    var results3 = scheduler.createObserver();
    var subject;

    var subscription, subscription1, subscription2, subscription3;

    scheduler.scheduleAbsolute(null, 100, function () {
      subject = new AsyncSubject();
    });

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = xs.subscribe(subject);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      subscription1 = subject.subscribe(results1);
    });
    scheduler.scheduleAbsolute(null, 400, function () {
      subscription2 = subject.subscribe(results2);
    });

    scheduler.scheduleAbsolute(null, 900, function () {
      subscription3 = subject.subscribe(results3);
    });

    scheduler.scheduleAbsolute(null, 600, function () {
      subscription1.dispose();
    });

    scheduler.scheduleAbsolute(null, 700, function () {
      subscription2.dispose();
    });

    scheduler.scheduleAbsolute(null, 800, function () {
      subscription1.dispose();
    });

    scheduler.scheduleAbsolute(null, 950, function () {
      subscription3.dispose();
    });

    scheduler.start();

    results1.messages.assertEqual();
    results2.messages.assertEqual(onError(630, error));
    results3.messages.assertEqual(onError(900, error));
  });

  test('cancelled', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
      onCompleted(630),
      onNext(640, 9),
      onCompleted(650),
      onError(660, new Error()));

    var results1 = scheduler.createObserver();
    var results2 = scheduler.createObserver();
    var results3 = scheduler.createObserver();
    var subject;

    var subscription, subscription1, subscription2, subscription3;

    scheduler.scheduleAbsolute(null, 100, function () {
      subject = new AsyncSubject();
    });

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription = xs.subscribe(subject);
    });

    scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      subscription1 = subject.subscribe(results1);
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      subscription2 = subject.subscribe(results2);
    });

    scheduler.scheduleAbsolute(null, 900, function () {
      subscription3 = subject.subscribe(results3);
    });

    scheduler.scheduleAbsolute(null, 600, function () {
      subscription1.dispose();
    });

    scheduler.scheduleAbsolute(null, 700, function () {
      subscription2.dispose();
    });

    scheduler.scheduleAbsolute(null, 800, function () {
      subscription1.dispose();
    });

    scheduler.scheduleAbsolute(null, 950, function () {
      subscription3.dispose();
    });

    scheduler.start();

    results1.messages.assertEqual();
    results2.messages.assertEqual(onCompleted(630));
    results3.messages.assertEqual(onCompleted(900));
  });

  test('disposed', function () {
    var scheduler = new TestScheduler();

    var results1 = scheduler.createObserver();
    var results2 = scheduler.createObserver();
    var results3 = scheduler.createObserver();
    var subject;

    var subscription1, subscription2, subscription3;

    scheduler.scheduleAbsolute(null, 100, function () {
      subject = new AsyncSubject();
    });

    scheduler.scheduleAbsolute(null, 200, function () {
      subscription1 = subject.subscribe(results1);
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      subscription2 = subject.subscribe(results2);
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      subscription3 = subject.subscribe(results3);
    });

    scheduler.scheduleAbsolute(null, 500, function () {
      subscription1.dispose();
    });

    scheduler.scheduleAbsolute(null, 600, function () {
      subject.dispose();
    });

    scheduler.scheduleAbsolute(null, 700, function () {
      subscription2.dispose();
    });

    scheduler.scheduleAbsolute(null, 800, function () {
      subscription3.dispose();
    });

    scheduler.scheduleAbsolute(null, 150, function () {
      subject.onNext(1);
    });

    scheduler.scheduleAbsolute(null, 250, function () {
      subject.onNext(2);
    });

    scheduler.scheduleAbsolute(null, 350, function () {
      subject.onNext(3);
    });

    scheduler.scheduleAbsolute(null, 450, function () {
      subject.onNext(4);
    });

    scheduler.scheduleAbsolute(null, 550, function () {
      subject.onNext(5);
    });

    scheduler.scheduleAbsolute(null, 650, function () {
      raises(function () { subject.onNext(6); });
    });

    scheduler.scheduleAbsolute(null, 750, function () {
      raises(function () { subject.onCompleted(); });
    });

    scheduler.scheduleAbsolute(null, 850, function () {
        raises(function () { subject.onError(new Error()); });
    });

    scheduler.scheduleAbsolute(null, 950, function () {
        raises(function () { subject.subscribe(); });
    });

    scheduler.start();

    results1.messages.assertEqual();
    results2.messages.assertEqual();
    results3.messages.assertEqual();
  });

}());
