(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('mergeDelayError');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('mergeDelayError never never', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1)
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o1, o2);
    });

    results.messages.assertEqual();
  });

  test('mergeDelayError empty right', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1),
      onCompleted(260)
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o1, o2);
    });

    results.messages.assertEqual(
      onCompleted(260)
    );
  });

  test('mergeDelayError empty left', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(260)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1),
      onCompleted(250)
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o1, o2);
    });

    results.messages.assertEqual(
      onCompleted(260)
    );
  });

  test('mergeDelayError empty middle', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(260)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1),
      onCompleted(250)
    );
    var o3 = scheduler.createHotObservable(
      onNext(160, 1),
      onCompleted(270)
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o1, o2, o3);
    });

    results.messages.assertEqual(
      onCompleted(270)
    );
  });

  test('mergeDelayError empty never', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(260)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1)
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o1, o2);
    });

    results.messages.assertEqual();
  });

  test('mergeDelayError never empty', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1),
      onCompleted(260)
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o1, o2);
    });

    results.messages.assertEqual();
  });

  test('mergeDelayError return never', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1)
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o1, o2);
    });

    results.messages.assertEqual(
      onNext(210, 2)
    );
  });

  test('mergeDelayError never return', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1)
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o2, o1);
    });

    results.messages.assertEqual(
      onNext(210, 2)
    );
  });

  test('mergeDelayError error never', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(250, error) // error dropped
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1)
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o1, o2);
    });

    results.messages.assertEqual(
      onNext(210, 2)
    );
  });

  test('mergeDelayError never error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(250, error) // error dropped
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1)
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o2, o1);
    });

    results.messages.assertEqual(
      onNext(210, 2)
    );
  });

  test('mergeDelayError error empty', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(250, error)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1),
      onCompleted(260)
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o1, o2);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onError(260, error)
    );
  });

  test('mergeDelayError empty error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(250, error)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1),
      onCompleted(260)
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o2, o1);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onError(260, error)
    );
  });

  test('mergeDelayError no errors', function () {
    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1),
      onNext(215, 2),
      onCompleted(260)
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o1, o2);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(215, 2),
      onCompleted(260)
    );
  });

  test('mergeDelayError error error', function () {
    var error1 = new Error();
    var error2 = new Error();
    var composite = new Rx.CompositeError([error1, error2]);

    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(250, error1)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1),
      onNext(215, 2),
      onError(260, error2)
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o2, o1);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(215, 2),
      onError(260, composite)
    );
  });

  test('mergeDelayError error left', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(250, error),
      onNext(270, 3),
      onCompleted(280)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1),
      onNext(215, 2),
      onCompleted(260)
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o1, o2);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(215, 2),
      onError(260, error)
    );
  });

  test('mergeDelayError error right', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onError(250, error),
      onNext(270, 3),
      onCompleted(280)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1),
      onNext(215, 2),
      onCompleted(260)
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o2, o1);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(215, 2),
      onError(260, error)
    );
  });

  test('mergeDelayError infinite left error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1),
      onNext(215, 2),
      onNext(225, 3),
      onError(260, error) // Error dropped
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o1, o2);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(215, 2),
      onNext(220, 3),
      onNext(225, 3),
      onNext(230, 4)
    );
  });

  test('mergeDelayError infinite right error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var o1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4)
    );
    var o2 = scheduler.createHotObservable(
      onNext(160, 1),
      onNext(215, 2),
      onNext(225, 3),
      onError(260, error) // Error dropped
    );

    var results = scheduler.startScheduler(function() {
      return Observable.mergeDelayError(o2, o1);
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(215, 2),
      onNext(220, 3),
      onNext(225, 3),
      onNext(230, 4)
    );
  });

}());
