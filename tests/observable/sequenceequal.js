(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */
  QUnit.module('sequenceEqual');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('sequenceEqual equal', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(450, 7),
      onCompleted(510)
    );

    var ys = scheduler.createHotObservable(
      onNext(90, 1), onNext(270, 3), onNext(280, 4), onNext(300, 5), onNext(330, 6), onNext(340, 7), onCompleted(720)
    );

    var results = scheduler.startScheduler(function () {
        return xs.sequenceEqual(ys);
    });
    results.messages.assertEqual(
      onNext(720, true),
      onCompleted(720)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 720)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 720)
    );
  });

  test('sequenceEqual equal sym', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(450, 7),
      onCompleted(510)
    );

    var ys = scheduler.createHotObservable(
      onNext(90, 1),
      onNext(270, 3),
      onNext(280, 4),
      onNext(300, 5),
      onNext(330, 6),
      onNext(340, 7),
      onCompleted(720)
    );
    var results = scheduler.startScheduler(function () {
        return ys.sequenceEqual(xs);
    });
    results.messages.assertEqual(
      onNext(720, true),
      onCompleted(720)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 720)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 720)
    );
  });

  test('sequenceEqual not equal Left', function () {
      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
        onNext(110, 1),
        onNext(190, 2),
        onNext(240, 3),
        onNext(290, 4), onNext(310, 0), onNext(340, 6), onNext(450, 7), onCompleted(510)
      );

      var ys = scheduler.createHotObservable(
        onNext(90, 1),
        onNext(270, 3),
        onNext(280, 4),
        onNext(300, 5),
        onNext(330, 6),
        onNext(340, 7),
        onCompleted(720)
      );

      var results = scheduler.startScheduler(function () {
          return xs.sequenceEqual(ys);
      });

      results.messages.assertEqual(
        onNext(310, false),
        onCompleted(310)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 310)
      );

      ys.subscriptions.assertEqual(
        subscribe(200, 310)
      );
  });

  test('sequenceEqual not equal left sym', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 0),
      onNext(340, 6),
      onNext(450, 7),
      onCompleted(510)
    );

    var ys = scheduler.createHotObservable(
      onNext(90, 1),
      onNext(270, 3),
      onNext(280, 4),
      onNext(300, 5),
      onNext(330, 6),
      onNext(340, 7),
      onCompleted(720)
    );

    var results = scheduler.startScheduler(function () {
      return ys.sequenceEqual(xs);
    });

    results.messages.assertEqual(
      onNext(310, false),
      onCompleted(310)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 310)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 310)
    );
  });

  test('sequenceEqual not equal right', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(450, 7),
      onCompleted(510)
    );

    var ys = scheduler.createHotObservable(
      onNext(90, 1),
      onNext(270, 3),
      onNext(280, 4),
      onNext(300, 5),
      onNext(330, 6),
      onNext(340, 7),
      onNext(350, 8)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sequenceEqual(ys);
    });

    results.messages.assertEqual(
      onNext(510, false),
      onCompleted(510)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 510)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 510)
    );
  });

  test('sequenceEqual not equal right sym', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(450, 7),
      onCompleted(510)
    );

    var ys = scheduler.createHotObservable(
      onNext(90, 1),
      onNext(270, 3),
      onNext(280, 4),
      onNext(300, 5),
      onNext(330, 6),
      onNext(340, 7),
      onNext(350, 8)
    );

    var results = scheduler.startScheduler(function () {
      return ys.sequenceEqual(xs);
    });

    results.messages.assertEqual(
      onNext(510, false),
      onCompleted(510)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 510)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 510)
    );
  });

  test('sequenceEqual not equal 2', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(450, 7),
      onNext(490, 8),
      onNext(520, 9),
      onNext(580, 10),
      onNext(600, 11)
    );

    var ys = scheduler.createHotObservable(
      onNext(90, 1),
      onNext(270, 3),
      onNext(280, 4),
      onNext(300, 5),
      onNext(330, 6),
      onNext(340, 7),
      onNext(350, 9),
      onNext(400, 9),
      onNext(410, 10),
      onNext(490, 11),
      onNext(550, 12),
      onNext(560, 13)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sequenceEqual(ys);
    });

    results.messages.assertEqual(
      onNext(490, false),
      onCompleted(490)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 490)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 490)
    );
  });

  test('sequenceEqual not equal 2 sym', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(450, 7),
      onNext(490, 8),
      onNext(520, 9),
      onNext(580, 10),
      onNext(600, 11)
    );

    var ys = scheduler.createHotObservable(
      onNext(90, 1),
      onNext(270, 3),
      onNext(280, 4),
      onNext(300, 5),
      onNext(330, 6),
      onNext(340, 7),
      onNext(350, 9),
      onNext(400, 9),
      onNext(410, 10),
      onNext(490, 11),
      onNext(550, 12),
      onNext(560, 13)
    );

    var results = scheduler.startScheduler(function () {
      return ys.sequenceEqual(xs);
    });

    results.messages.assertEqual(
      onNext(490, false),
      onCompleted(490)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 490)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 490)
    );
  });

  test('sequenceEqual not equal 3', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 5),
      onCompleted(330)
    );

    var ys = scheduler.createHotObservable(
      onNext(90, 1),
      onNext(270, 3),
      onNext(400, 4),
      onCompleted(420)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sequenceEqual(ys);
    });

    results.messages.assertEqual(
      onNext(420, false),
      onCompleted(420)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 420)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 420)
    );
  });

  test('sequenceEqual not equal 3 sym', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 5),
      onCompleted(330)
    );

    var ys = scheduler.createHotObservable(
      onNext(90, 1),
      onNext(270, 3),
      onNext(400, 4),
      onCompleted(420)
    );

    var results = scheduler.startScheduler(function () {
      return ys.sequenceEqual(xs);
    });

    results.messages.assertEqual(
      onNext(420, false),
      onCompleted(420)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 420)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 420)
    );
  });

  test('sequenceEqual comparer throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 5),
      onCompleted(330)
    );
    var ys = scheduler.createHotObservable(
      onNext(90, 1),
      onNext(270, 3),
      onNext(400, 4),
      onCompleted(420)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sequenceEqual(ys, function () { throw error; });
    });

    results.messages.assertEqual(
      onError(270, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 270)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 270)
    );
  });

  test('sequenceEqual comparer throws sym', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 5),
      onCompleted(330)
    );
    var ys = scheduler.createHotObservable(
      onNext(90, 1),
      onNext(270, 3),
      onNext(400, 4),
      onCompleted(420)
    );

    var results = scheduler.startScheduler(function () {
      return ys.sequenceEqual(xs, function () { throw error; });
    });

    results.messages.assertEqual(
      onError(270, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 270)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 270)
    );
  });

  test('sequenceEqual not equal 4', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(250, 1),
      onCompleted(300)
    );

    var ys = scheduler.createHotObservable(
      onNext(290, 1),
      onNext(310, 2),
      onCompleted(350)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sequenceEqual(ys);
    });

    results.messages.assertEqual(
      onNext(310, false),
      onCompleted(310)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 310)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 310)
    );
  });

  test('sequenceEqual not equal 4 sym', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(250, 1),
      onCompleted(300)
    );

    var ys = scheduler.createHotObservable(
      onNext(290, 1),
      onNext(310, 2),
      onCompleted(350)
    );

    var results = scheduler.startScheduler(function () {
      return ys.sequenceEqual(xs);
    });

    results.messages.assertEqual(
      onNext(310, false),
      onCompleted(310)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 310)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 310)
    );
  });

  // SequenceEqual Array
  test('sequenceEqual iterable equal', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(450, 7),
      onCompleted(510)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sequenceEqual([3, 4, 5, 6, 7]);
    });

    results.messages.assertEqual(
      onNext(510, true),
      onCompleted(510)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 510)
    );
  });

  test('sequenceEqual iterable not equal elements', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(450, 7),
      onCompleted(510)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sequenceEqual([3, 4, 9, 6, 7]);
    });

    results.messages.assertEqual(
      onNext(310, false),
      onCompleted(310)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 310)
    );
  });

  test('sequenceEqual iterable comparer equal', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(450, 7),
      onCompleted(510)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sequenceEqual([3 - 2, 4, 5, 6 + 42, 7 - 6], function (x, y) {
        return x % 2 === y % 2;
      });
    });

    results.messages.assertEqual(
      onNext(510, true),
      onCompleted(510)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 510)
    );
  });

  test('sequenceEqual iterable comparer not equal', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(450, 7),
      onCompleted(510)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sequenceEqual([3 - 2, 4, 5 + 9, 6 + 42, 7 - 6], function (x, y) {
        return x % 2 === y % 2;
      });
    });

    results.messages.assertEqual(
      onNext(310, false),
      onCompleted(310)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 310)
    );
  });

  function throwComparer(value, exn) {
    return function (x, y) {
      if (x === value) { throw exn; }
      return x === y;
    };
  }

  test('sequenceEqual iterable comparer throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(450, 7),
      onCompleted(510)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sequenceEqual([3, 4, 5, 6, 7], throwComparer(5, error));
    });

    results.messages.assertEqual(
      onError(310, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 310)
    );
  });

  test('sequenceEqual iterable not equal too long', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(450, 7),
      onCompleted(510)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sequenceEqual([3, 4, 5, 6, 7, 8]);
    });

    results.messages.assertEqual(
      onNext(510, false),
      onCompleted(510)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 510)
    );
  });

  test('sequenceEqual iterable not equal too short', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onNext(310, 5),
      onNext(340, 6),
      onNext(450, 7),
      onCompleted(510)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sequenceEqual([3, 4, 5, 6]);
    });

    results.messages.assertEqual(
      onNext(450, false),
      onCompleted(450)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 450)
    );
  });

  test('sequenceEqual iterable on error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 1),
      onNext(190, 2),
      onNext(240, 3),
      onNext(290, 4),
      onError(310, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.sequenceEqual([3, 4]);
    });

    results.messages.assertEqual(
      onError(310, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 310)
    );
  });

}());
