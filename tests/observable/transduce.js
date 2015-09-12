(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, transducers, raises, equal */
  QUnit.module('transduce');

  var TestScheduler = Rx.TestScheduler,
    Observable = Rx.Observable,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    t = transducers;

  function even (x) { return x % 2 === 0; }
  function mul10(x) { return x * 10; }
  function noop () { }
  function throwError () { throw new Error(); }

  test('transduce raises', function () {

    raises(function () {
      Observable['throw'](new Error())
        .transduce(t.comp(t.filter(even), t.map(mul10)))
        .subscribe(noop, throwError);
    });

    raises(function () {
      Observable.empty()
        .transduce(t.comp(t.filter(even), t.map(mul10)))
        .subscribe(noop, noop, throwError);
    });

    raises(function () {
      Observable.create(throwError)
        .transduce(t.comp(t.filter(even), t.map(mul10)))
        .subscribe();
    });

  });

  test('transduce never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1)
    );

    var results = scheduler.startScheduler(function () {
      return xs.transduce(t.comp(t.filter(even), t.map(mul10)));
    });

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('transduce empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(250)
    );

    var i = 0;
    var evenFilter = function (x) {
      i++; return x % 2 === 0;
    };

    var results = scheduler.startScheduler(function () {
      return xs.transduce(t.comp(t.filter(evenFilter), t.map(mul10)));
    });

    results.messages.assertEqual(
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );

    equal(i, 0);
  });

  test('transduce some', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var i = 0;
    var evenFilter = function (x) {
      i++; return x % 2 === 0;
    };

    var results = scheduler.startScheduler(function () {
      return xs.transduce(t.comp(t.filter(evenFilter), t.map(mul10)));
    });

    results.messages.assertEqual(
      onNext(210, 20),
      onNext(230, 40),
      onCompleted(250)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 250)
    );

    equal(4, i);
  });

  test('transduce ifinite', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5)
    );

    var i = 0;
    var evenFilter = function (x) {
      i++; return x % 2 === 0;
    };

    var results = scheduler.startScheduler(function () {
      return xs.transduce(t.comp(t.filter(evenFilter), t.map(mul10)));
    });

    results.messages.assertEqual(
      onNext(210, 20),
      onNext(230, 40)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );

    equal(4, i);
  });

  test('transduce error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onError(210, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.transduce(t.comp(t.filter(even), t.map(mul10)));
    });

    results.messages.assertEqual(
      onError(210, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 210)
    );
  });

  test('transduce throw', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5),
      onCompleted(250)
    );

    var i = 0;
    var evenFilter = function (x) {
      if (i++ > 2) { throw error; } else { return x % 2 === 0; }
    };

    var results = scheduler.startScheduler(function () {
      return xs.transduce(t.comp(t.filter(evenFilter), t.map(mul10)));
    });

    results.messages.assertEqual(
      onNext(210, 20),
      onNext(230, 40),
      onError(240, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 240)
    );
  });
}());
