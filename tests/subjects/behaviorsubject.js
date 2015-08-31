(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, raises */

  QUnit.module('BehaviorSubject');

  var BehaviorSubject = Rx.BehaviorSubject,
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

      var subject, subscription, subscription1, subscription2, subscription3;

      var results1 = scheduler.createObserver();
      var results2 = scheduler.createObserver();
      var results3 = scheduler.createObserver();

      scheduler.scheduleAbsolute(null, 100, function () { subject = new BehaviorSubject(100); });
      scheduler.scheduleAbsolute(null, 200, function () { subscription = xs.subscribe(subject); });
      scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

      scheduler.scheduleAbsolute(null, 300, function () { subscription1 = subject.subscribe(results1); });
      scheduler.scheduleAbsolute(null, 400, function () { subscription2 = subject.subscribe(results2); });
      scheduler.scheduleAbsolute(null, 900, function () { subscription3 = subject.subscribe(results3); });

      scheduler.scheduleAbsolute(null, 600, function () { subscription1.dispose(); });
      scheduler.scheduleAbsolute(null, 700, function () { subscription2.dispose(); });
      scheduler.scheduleAbsolute(null, 800, function () { subscription1.dispose(); });
      scheduler.scheduleAbsolute(null, 950, function () { subscription3.dispose(); });

      scheduler.start();

      results1.messages.assertEqual(
          onNext(300, 4),
          onNext(340, 5),
          onNext(410, 6),
          onNext(520, 7)
      );

      results2.messages.assertEqual(
          onNext(400, 5),
          onNext(410, 6),
          onNext(520, 7),
          onNext(630, 8)
      );

      results3.messages.assertEqual(
          onNext(900, 10),
          onNext(940, 11)
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
          onError(660, new Error())
      );

      var subject, subscription, subscription1, subscription2, subscription3;

      var results1 = scheduler.createObserver();
      var results2 = scheduler.createObserver();
      var results3 = scheduler.createObserver();

      scheduler.scheduleAbsolute(null, 100, function () { subject = new BehaviorSubject(100); });
      scheduler.scheduleAbsolute(null, 200, function () { subscription = xs.subscribe(subject); });
      scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

      scheduler.scheduleAbsolute(null, 300, function () { subscription1 = subject.subscribe(results1); });
      scheduler.scheduleAbsolute(null, 400, function () { subscription2 = subject.subscribe(results2); });
      scheduler.scheduleAbsolute(null, 900, function () { subscription3 = subject.subscribe(results3); });

      scheduler.scheduleAbsolute(null, 600, function () { subscription1.dispose(); });
      scheduler.scheduleAbsolute(null, 700, function () { subscription2.dispose(); });
      scheduler.scheduleAbsolute(null, 800, function () { subscription1.dispose(); });
      scheduler.scheduleAbsolute(null, 950, function () { subscription3.dispose(); });

      scheduler.start();

      results1.messages.assertEqual(
          onNext(300, 4),
          onNext(340, 5),
          onNext(410, 6),
          onNext(520, 7)
      );

      results2.messages.assertEqual(
          onNext(400, 5),
          onNext(410, 6),
          onNext(520, 7),
          onCompleted(630)
      );

      results3.messages.assertEqual(
          onCompleted(900)
      );
  });

  test('Error', function () {
      var scheduler = new TestScheduler();

      var ex = new Error();

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
          onError(660, new Error())
      );

      var subject, subscription, subscription1, subscription2, subscription3;

      var results1 = scheduler.createObserver();
      var results2 = scheduler.createObserver();
      var results3 = scheduler.createObserver();

      scheduler.scheduleAbsolute(null, 100, function () { subject = new BehaviorSubject(100); });
      scheduler.scheduleAbsolute(null, 200, function () { subscription = xs.subscribe(subject); });
      scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

      scheduler.scheduleAbsolute(null, 300, function () { subscription1 = subject.subscribe(results1); });
      scheduler.scheduleAbsolute(null, 400, function () { subscription2 = subject.subscribe(results2); });
      scheduler.scheduleAbsolute(null, 900, function () { subscription3 = subject.subscribe(results3); });

      scheduler.scheduleAbsolute(null, 600, function () { subscription1.dispose(); });
      scheduler.scheduleAbsolute(null, 700, function () { subscription2.dispose(); });
      scheduler.scheduleAbsolute(null, 800, function () { subscription1.dispose(); });
      scheduler.scheduleAbsolute(null, 950, function () { subscription3.dispose(); });

      scheduler.start();

      results1.messages.assertEqual(
          onNext(300, 4),
          onNext(340, 5),
          onNext(410, 6),
          onNext(520, 7)
      );

      results2.messages.assertEqual(
          onNext(400, 5),
          onNext(410, 6),
          onNext(520, 7),
          onError(630, ex)
      );

      results3.messages.assertEqual(
          onError(900, ex)
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

      scheduler.scheduleAbsolute(null, 100, function () { subject = new BehaviorSubject(100); });
      scheduler.scheduleAbsolute(null, 200, function () { subscription = xs.subscribe(subject); });
      scheduler.scheduleAbsolute(null, 1000, function () { subscription.dispose(); });

      scheduler.scheduleAbsolute(null, 300, function () { subscription1 = subject.subscribe(results1); });
      scheduler.scheduleAbsolute(null, 400, function () { subscription2 = subject.subscribe(results2); });
      scheduler.scheduleAbsolute(null, 900, function () { subscription3 = subject.subscribe(results3); });

      scheduler.scheduleAbsolute(null, 600, function () { subscription1.dispose(); });
      scheduler.scheduleAbsolute(null, 700, function () { subscription2.dispose(); });
      scheduler.scheduleAbsolute(null, 800, function () { subscription1.dispose(); });
      scheduler.scheduleAbsolute(null, 950, function () { subscription3.dispose(); });

      scheduler.start();

      results1.messages.assertEqual(
          onNext(300, 100)
      );

      results2.messages.assertEqual(
          onNext(400, 100),
          onCompleted(630)
      );

      results3.messages.assertEqual(
          onCompleted(900)
      );
  });

  test('SubjectDisposed', function () {
      var scheduler = new TestScheduler();

      var subject;

      var results1 = scheduler.createObserver();
      var subscription1;

      var results2 = scheduler.createObserver();
      var subscription2;

      var results3 = scheduler.createObserver();
      var subscription3;

      scheduler.scheduleAbsolute(null, 100, function () { subject = new BehaviorSubject(0); });
      scheduler.scheduleAbsolute(null, 200, function () { subscription1 = subject.subscribe(results1); });
      scheduler.scheduleAbsolute(null, 300, function () { subscription2 = subject.subscribe(results2); });
      scheduler.scheduleAbsolute(null, 400, function () { subscription3 = subject.subscribe(results3); });
      scheduler.scheduleAbsolute(null, 500, function () { subscription1.dispose(); });
      scheduler.scheduleAbsolute(null, 600, function () { subject.dispose(); });
      scheduler.scheduleAbsolute(null, 700, function () { subscription2.dispose(); });
      scheduler.scheduleAbsolute(null, 800, function () { subscription3.dispose(); });

      scheduler.scheduleAbsolute(null, 150, function () { subject.onNext(1); });
      scheduler.scheduleAbsolute(null, 250, function () { subject.onNext(2); });
      scheduler.scheduleAbsolute(null, 350, function () { subject.onNext(3); });
      scheduler.scheduleAbsolute(null, 450, function () { subject.onNext(4); });
      scheduler.scheduleAbsolute(null, 550, function () { subject.onNext(5); });
      scheduler.scheduleAbsolute(null, 650, function () { raises(function () { subject.onNext(6); }); });
      scheduler.scheduleAbsolute(null, 750, function () { raises(function () { subject.onCompleted(); }); });
      scheduler.scheduleAbsolute(null, 850, function () { raises(function () { subject.onError(new Error()); }); });
      scheduler.scheduleAbsolute(null, 950, function () { raises(function () { subject.subscribe(); }); });

      scheduler.start();

      results1.messages.assertEqual(
          onNext(200, 1),
          onNext(250, 2),
          onNext(350, 3),
          onNext(450, 4)
      );

      results2.messages.assertEqual(
          onNext(300, 2),
          onNext(350, 3),
          onNext(450, 4),
          onNext(550, 5)
      );

      results3.messages.assertEqual(
          onNext(400, 3),
          onNext(450, 4),
          onNext(550, 5)
      );
  });

  test('value vs getValue()', function () {
      var scheduler = new TestScheduler();

      var subject;

      var resultsGetValue = scheduler.createObserver();
      var resultsValue = scheduler.createObserver();

      // create and dispose
      scheduler.scheduleAbsolute(null, 100, function () { subject = new BehaviorSubject(0); });
      scheduler.scheduleAbsolute(null, 650, function () { subject.dispose(); });

      // fill the subject with values
      scheduler.scheduleAbsolute(null, 150, function () { subject.onNext(1); });
      scheduler.scheduleAbsolute(null, 250, function () { subject.onNext(2); });
      scheduler.scheduleAbsolute(null, 350, function () { subject.onNext(3); });
      scheduler.scheduleAbsolute(null, 450, function () { subject.onNext(4); });
      scheduler.scheduleAbsolute(null, 550, function () { subject.onError(new Error('Subject onError() method has been called')); });

      // getValue()
      scheduler.scheduleAbsolute(null, 200, function () { resultsGetValue.onNext(subject.getValue()); });
      scheduler.scheduleAbsolute(null, 300, function () { resultsGetValue.onNext(subject.getValue()); });
      scheduler.scheduleAbsolute(null, 400, function () { resultsGetValue.onNext(subject.getValue()); });
      scheduler.scheduleAbsolute(null, 500, function () { resultsGetValue.onNext(subject.getValue()); });
      scheduler.scheduleAbsolute(null, 600, function () { raises(function () { resultsGetValue.onNext(subject.getValue()); }); });
      scheduler.scheduleAbsolute(null, 700, function () { raises(function () { resultsGetValue.onNext(subject.getValue()); }); });

      // value
      scheduler.scheduleAbsolute(null, 200, function () { resultsValue.onNext(subject.value); });
      scheduler.scheduleAbsolute(null, 300, function () { resultsValue.onNext(subject.value); });
      scheduler.scheduleAbsolute(null, 400, function () { resultsValue.onNext(subject.value); });
      scheduler.scheduleAbsolute(null, 500, function () { resultsValue.onNext(subject.value); });
      scheduler.scheduleAbsolute(null, 600, function () { resultsValue.onNext(subject.value); });
      scheduler.scheduleAbsolute(null, 700, function () { resultsValue.onNext(subject.value); });

      scheduler.start();

      resultsGetValue.messages.assertEqual(
          onNext(200, 1),
          onNext(300, 2),
          onNext(400, 3),
          onNext(500, 4)

          // getValue() throws an exception if BehaviorSubject.onError() has been called
          //onNext(600)

          // getValue() throws an exception if BehaviorSubject has been disposed
          //onNext(700)
      );

      resultsValue.messages.assertEqual(
          onNext(200, 1),
          onNext(300, 2),
          onNext(400, 3),
          onNext(500, 4),

          // value is frozen if BehaviorSubject.onError() has been called
          onNext(600, 4),

          // value returns null if BehaviorSubject has been disposed
          onNext(700, null)
      );
  });

}());
