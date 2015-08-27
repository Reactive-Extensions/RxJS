(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('count');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('count empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250));

    var res = scheduler.startScheduler(function () {
      return xs.count();
    });

    res.messages.assertEqual(
      onNext(250, 0),
      onCompleted(250));
  });

  test('count some', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onCompleted(250));

    var res = scheduler.startScheduler(function () {
      return xs.count();
    });

    res.messages.assertEqual(
      onNext(250, 3),
      onCompleted(250));
  });

  test('count throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error));

    var res = scheduler.startScheduler(function () {
      return xs.count();
    });

    res.messages.assertEqual(
      onError(210, error));
  });

  test('count never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1));

    var res = scheduler.startScheduler(function () {
      return xs.count();
    });

    res.messages.assertEqual();
  });

  test('count predicate empty true', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250));

    var res = scheduler.startScheduler(function () {
      return xs.count(function () { return true; });
    });

    res.messages.assertEqual(
      onNext(250, 0),
      onCompleted(250));

    xs.subscriptions.assertEqual(
      subscribe(200, 250));
  });

  test('count predicate empty false', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250));

    var res = scheduler.startScheduler(function () {
      return xs.count(function () { return false; });
    });

    res.messages.assertEqual(
      onNext(250, 0),
      onCompleted(250));

    xs.subscriptions.assertEqual(
      subscribe(200, 250));
  });

  test('count predicate return true', function () {

      var scheduler = new TestScheduler();
      var xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
      var res = scheduler.startScheduler(function () {
          return xs.count(function () {
              return true;
          });
      });
      res.messages.assertEqual(onNext(250, 1), onCompleted(250));
      xs.subscriptions.assertEqual(subscribe(200, 250));
  });

  test('count predicate return false', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(250));

    var res = scheduler.startScheduler(function () {
      return xs.count(function () { return false; });
    });

    res.messages.assertEqual(
      onNext(250, 0),
      onCompleted(250));

    xs.subscriptions.assertEqual(
      subscribe(200, 250));
  });

  test('count predicate all matched', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onCompleted(250));

    var res = scheduler.startScheduler(function () {
      return xs.count(function (x) { return x < 10; });
    });

    res.messages.assertEqual(
      onNext(250, 3),
      onCompleted(250));

    xs.subscriptions.assertEqual(
      subscribe(200, 250));
  });

  test('count predicate none matched', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onCompleted(250));

    var res = scheduler.startScheduler(function () {
      return xs.count(function (x) { return x > 10; });
    });

    res.messages.assertEqual(
      onNext(250, 0),
      onCompleted(250));

    xs.subscriptions.assertEqual(
      subscribe(200, 250));
  });

  test('count predicate some even', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onCompleted(250));

    var res = scheduler.startScheduler(function () {
      return xs.count(function (x) { return x % 2 === 0; });
    });

    res.messages.assertEqual(
      onNext(250, 2), onCompleted(250));

    xs.subscriptions.assertEqual(
      subscribe(200, 250));
  });

  test('count predicate throw true', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error));

    var res = scheduler.startScheduler(function () {
      return xs.count(function () { return true; });
    });

    res.messages.assertEqual(
      onError(210, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 210));
  });

  test('count predicate throw false', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error));

    var res = scheduler.startScheduler(function () {
      return xs.count(function () { return false; });
    });

    res.messages.assertEqual(
      onError(210, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 210));
  });

  test('count predicate never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1));

    var res = scheduler.startScheduler(function () {
      return xs.count(function () { return true; });
    });

    res.messages.assertEqual();

    xs.subscriptions.assertEqual(subscribe(200, 1000));
  });

  test('count predicate throws error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(230, 3),
      onCompleted(240));

    var res = scheduler.startScheduler(function () {
      return xs.count(function (x) {
        if (x === 3) { throw error; }
        return true;
      });
    });

    res.messages.assertEqual(
      onError(230, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 230));
  });

  test('count after range', function() {
    var scheduler = new TestScheduler();

    var xs = Rx.Observable.range(1, 10, scheduler);

    var result = scheduler.startScheduler(function(){
      return xs.count();
    });

    result.messages.assertEqual(onNext(211, 10), onCompleted(211));
  });

  test('count After Skip', function() {
    var scheduler = new TestScheduler();

    var xs = Rx.Observable.range(1, 10, scheduler).skip(1);

    var result = scheduler.startScheduler(function(){
      return xs.count();
    });

    result.messages.assertEqual(onNext(211, 9), onCompleted(211));
  });

  test('count After Take', function() {
    var scheduler = new TestScheduler();

    var xs = Rx.Observable.range(1, 10, scheduler).take(1);

    var result = scheduler.startScheduler(function(){
      return xs.count();
    });

    result.messages.assertEqual(onNext(201, 1), onCompleted(201));
  });

}());
