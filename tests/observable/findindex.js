(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('findIndex');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  test('findIndex never', function () {
    var scheduler = new TestScheduler();
    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var res = scheduler.startScheduler(function () {
      return xs.findIndex(function () { return true; });
    });

    res.messages.assertEqual(
    );
  });

  test('findIndex empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );

    var res = scheduler.startScheduler(function () {
      return xs.findIndex(function () { return true; });
    });

    res.messages.assertEqual(
      onNext(210, -1),
      onCompleted(210)
    );
  });

  test('findIndex single', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(220)
    );

    var res = scheduler.startScheduler(function () {
      return xs.findIndex(function (x) { return x === 2; });
    });

    res.messages.assertEqual(
      onNext(210, 0),
      onCompleted(210)
    );
  });

  test('findIndex_NotFound', function () {
      var scheduler = new TestScheduler();
      var xs = scheduler.createHotObservable(
          onNext(150, 1),
          onNext(210, 2),
          onCompleted(220)
      );

      var res = scheduler.startScheduler(function () {
          return xs.findIndex(function (x) {
              return x === 3;
          });
      });

      res.messages.assertEqual(
          onNext(220, -1),
          onCompleted(220)
      );
  });

  test('findIndex_Error', function () {
      var error = new Error();
      var scheduler = new TestScheduler();
      var xs = scheduler.createHotObservable(
          onNext(150, 1),
          onNext(210, 2),
          onError(220, error)
      );

      var res = scheduler.startScheduler(function () {
          return xs.findIndex(function (x) {
              return x === 3;
          });
      });

      res.messages.assertEqual(
          onError(220, error)
      );
  });

  test('findIndex_Throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(220)
    );

    var res = scheduler.startScheduler(function () {
      return xs.findIndex(function () { throw error; });
    });

    res.messages.assertEqual(
      onError(210, error)
    );
  });

}());
