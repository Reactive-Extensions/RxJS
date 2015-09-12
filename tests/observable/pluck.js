(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('pluck');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('pluck completed', function () {
      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
        onNext(180, {prop: 1}),
        onNext(210, {prop: 2}),
        onNext(240, {prop: 3}),
        onNext(290, {prop: 4}),
        onNext(350, {prop: 5}),
        onCompleted(400),
        onNext(410, {prop: -1}),
        onCompleted(420),
        onError(430, new Error('ex'))
      );

      var results = scheduler.startScheduler(function () {
        return xs.pluck('prop');
      });

      results.messages.assertEqual(
        onNext(210, 2),
        onNext(240, 3),
        onNext(290, 4),
        onNext(350, 5),
        onCompleted(400)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 400)
      );
  });

  test('deep pluck nested completed', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(180, {a: {b: {c: 1}}}),
      onNext(210, {a: {b: {c: 2}}}),
      onNext(240, {a: {b: {c: 3}}}),
      onNext(290, {a: {b: {c: 4}}}),
      onNext(350, {a: {b: {c: 5}}}),
      onCompleted(400),
      onNext(410, {a: {b: {c: -1}}}),
      onCompleted(420),
      onError(430, new Error('ex'))
    );

    var results = scheduler.startScheduler(function () {
      return xs.pluck('a', 'b', 'c');
    });

    results.messages.assertEqual(
      onNext(210, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(350, 5),
      onCompleted(400)
    );

    xs.subscriptions.assertEqual(subscribe(200, 400));
  });

  test('deep pluck nested edge cases', function () {
      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
        onNext(180, {a: {b: {c: 1}}}),
        onNext(210, {a: {b: 2}}),
        onNext(240, {a: {c: {c: 3}}}),
        onNext(290, {}),
        onNext(350, {a: {b: {c: 5}}}),
        onCompleted(400),
        onNext(410, {a: {b: {c: -1}}}),
        onCompleted(420),
        onError(430, new Error('ex'))
      );

      var results = scheduler.startScheduler(function () {
          return xs.pluck('a', 'b', 'c');
      });

      results.messages.assertEqual(
        onNext(210, undefined),
        onNext(240, undefined),
        onNext(290, undefined),
        onNext(350, 5),
        onCompleted(400)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 400)
      );
  });

}());
