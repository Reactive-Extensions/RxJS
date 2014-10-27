QUnit.module('FlatMap');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    SerialDisposable = Rx.SerialDisposable,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed,
    isEqual = Rx.internals.isEqual;

function noop () { }

asyncTest('flatMap_Then_Complete_Task', function () {
  var xs = Rx.Observable.fromArray([4,3,2,1]);

  var ys = new RSVP.Promise(function (res) { res(42); });

  var results = [];
  xs.flatMap(ys).subscribe(
    function (x) {
      results.push(x);
    },
    function (err) {
      ok(false);
      start();
    },
    function () {
      ok(isEqual([42,42,42,42], results));
      start();
    });
});

asyncTest('flatMap_Then_Error_Task', function () {
  var xs = Rx.Observable.fromArray([4,3,2,1]);

  var ys = new RSVP.Promise(function (res, rej) { rej(42); });

  xs.flatMap(ys).subscribe(
    function (x) {
      ok(false);
      start();
    },
    function (err) {
      equal(err, 42);
      start();
    },
    function () {
      ok(false);
      start();
    });
});

asyncTest('flatMap_Selector_Complete_Task', function () {
  var xs = Rx.Observable.fromArray([4,3,2,1]);

  var results = [];
  xs.flatMap(function (x, i) {
    return new RSVP.Promise(function (res) { res(x + i); });
  }).subscribe(
    function (x) {
      results.push(x);
    },
    function (err) {
      ok(false);
      start();
    },
    function () {
      ok(isEqual([4, 4, 4, 4], results));
      start();
    });
});

asyncTest('flatMap_Selector_Error_Task', function () {
  var xs = Rx.Observable.fromArray([4,3,2,1]);

  xs.flatMap(function (x, i) {
    return new RSVP.Promise(function (res, rej) { rej(x + i); })
  }).subscribe(
    function (x) {
      ok(false);
      start();
    },
    function (err) {
      equal(err, 4);
      start();
    },
    function () {
      ok(false);
      start();
    });
});

asyncTest('flatMap_ResultSelector_Complete_Task', function () {
  var xs = Rx.Observable.fromArray([4,3,2,1]);

  var results = [];
  xs.flatMap(
    function (x, i) {
      return new RSVP.Promise(function (res) { res(x + i); });
    },
    function (x, y, i) {
      return x + y + i;
    })
    .subscribe(
      function (x) {
        results.push(x);
      },
      function (err) {
        ok(false);
        start();
      },
      function () {
        ok(isEqual([8, 8, 8, 8], results));
        start();
      });
});

asyncTest('flatMap_ResultSelector_Error_Task', function () {
  var xs = Rx.Observable.fromArray([4,3,2,1]);

  xs.flatMap(
    function (x, i) {
      return new RSVP.Promise(function (res, rej) { rej(x + i); })
    },
    function (x, y, i) {
      return x + y + i;
    })
    .subscribe(
      function (x) {
        ok(false);
        start();
      },
      function (err) {
        equal(err, 4);
        start();
      },
      function () {
        ok(false);
        start();
      });
});

test('flatMap_Then_Complete_Complete', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
        onNext(100, 4),
        onNext(200, 2),
        onNext(300, 3),
        onNext(400, 1),
        onCompleted(500));

    var ys = scheduler.createColdObservable(
        onNext(50, "foo"),
        onNext(100, "bar"),
        onNext(150, "baz"),
        onNext(200, "qux"),
        onCompleted(250));

    var results = scheduler.startWithCreate(function () {
        return xs.flatMap(ys);
    });

    results.messages.assertEqual(
        onNext(350, "foo"),
        onNext(400, "bar"),
        onNext(450, "baz"),
        onNext(450, "foo"),
        onNext(500, "qux"),
        onNext(500, "bar"),
        onNext(550, "baz"),
        onNext(550, "foo"),
        onNext(600, "qux"),
        onNext(600, "bar"),
        onNext(650, "baz"),
        onNext(650, "foo"),
        onNext(700, "qux"),
        onNext(700, "bar"),
        onNext(750, "baz"),
        onNext(800, "qux"),
        onCompleted(850));

    xs.subscriptions.assertEqual(subscribe(200, 700));

    ys.subscriptions.assertEqual(
        subscribe(300, 550),
        subscribe(400, 650),
        subscribe(500, 750),
        subscribe(600, 850));
});

test('flatMap_Then_Complete_Complete_2', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(100, 4),
      onNext(200, 2),
      onNext(300, 3),
      onNext(400, 1),
      onCompleted(700));

    var ys = scheduler.createColdObservable(
      onNext(50, "foo"),
      onNext(100, "bar"),
      onNext(150, "baz"),
      onNext(200, "qux"),
      onCompleted(250));

    var results = scheduler.startWithCreate(function () {
        return xs.flatMap(ys);
    });

    results.messages.assertEqual(
      onNext(350, "foo"),
      onNext(400, "bar"),
      onNext(450, "baz"),
      onNext(450, "foo"),
      onNext(500, "qux"),
      onNext(500, "bar"),
      onNext(550, "baz"),
      onNext(550, "foo"),
      onNext(600, "qux"),
      onNext(600, "bar"),
      onNext(650, "baz"),
      onNext(650, "foo"),
      onNext(700, "qux"),
      onNext(700, "bar"),
      onNext(750, "baz"),
      onNext(800, "qux"),
      onCompleted(900));

    xs.subscriptions.assertEqual(subscribe(200, 900));

    ys.subscriptions.assertEqual(
      subscribe(300, 550),
      subscribe(400, 650),
      subscribe(500, 750),
      subscribe(600, 850));
});

test('flatMap_Then_Never_Complete', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(100, 4),
      onNext(200, 2),
      onNext(300, 3),
      onNext(400, 1),
      onNext(500, 5),
      onNext(700, 0));

    var ys = scheduler.createColdObservable(
      onNext(50, "foo"),
      onNext(100, "bar"),
      onNext(150, "baz"),
      onNext(200, "qux"),
      onCompleted(250));

    var results = scheduler.startWithCreate(function () {
        return xs.flatMap(ys);
    });

    results.messages.assertEqual(
      onNext(350, "foo"),
      onNext(400, "bar"),
      onNext(450, "baz"),
      onNext(450, "foo"),
      onNext(500, "qux"),
      onNext(500, "bar"),
      onNext(550, "baz"),
      onNext(550, "foo"),
      onNext(600, "qux"),
      onNext(600, "bar"),
      onNext(650, "baz"),
      onNext(650, "foo"),
      onNext(700, "qux"),
      onNext(700, "bar"),
      onNext(750, "baz"),
      onNext(750, "foo"),
      onNext(800, "qux"),
      onNext(800, "bar"),
      onNext(850, "baz"),
      onNext(900, "qux"),
      onNext(950, "foo"));

    xs.subscriptions.assertEqual(subscribe(200, 1000));

    ys.subscriptions.assertEqual(
      subscribe(300, 550),
      subscribe(400, 650),
      subscribe(500, 750),
      subscribe(600, 850),
      subscribe(700, 950),
      subscribe(900, 1000));
});

test('flatMap_Then_Complete_Never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(100, 4),
      onNext(200, 2),
      onNext(300, 3),
      onNext(400, 1),
      onCompleted(500));

    var ys = scheduler.createColdObservable(
      onNext(50, "foo"),
      onNext(100, "bar"),
      onNext(150, "baz"),
      onNext(200, "qux"));

    var results = scheduler.startWithCreate(function () {
      return xs.flatMap(ys);
    });

    results.messages.assertEqual(
      onNext(350, "foo"),
      onNext(400, "bar"),
      onNext(450, "baz"),
      onNext(450, "foo"),
      onNext(500, "qux"),
      onNext(500, "bar"),
      onNext(550, "baz"),
      onNext(550, "foo"),
      onNext(600, "qux"),
      onNext(600, "bar"),
      onNext(650, "baz"),
      onNext(650, "foo"),
      onNext(700, "qux"),
      onNext(700, "bar"),
      onNext(750, "baz"), onNext(800, "qux"));

    xs.subscriptions.assertEqual(subscribe(200, 700));

    ys.subscriptions.assertEqual(subscribe(300, 1000), subscribe(400, 1000), subscribe(500, 1000), subscribe(600, 1000));
});

test('flatMap_Then_Complete_Error', function () {
    var ex = new Error('ex');

    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(100, 4),
      onNext(200, 2),
      onNext(300, 3),
      onNext(400, 1),
      onCompleted(500));

    var ys = scheduler.createColdObservable(
      onNext(50, "foo"),
      onNext(100, "bar"),
      onNext(150, "baz"),
      onNext(200, "qux"),
      onError(300, ex));

    var results = scheduler.startWithCreate(function () {
        return xs.flatMap(ys);
    });

    results.messages.assertEqual(
      onNext(350, "foo"),
      onNext(400, "bar"),
      onNext(450, "baz"),
      onNext(450, "foo"),
      onNext(500, "qux"),
      onNext(500, "bar"),
      onNext(550, "baz"),
      onNext(550, "foo"),
      onError(600, ex));

    xs.subscriptions.assertEqual(subscribe(200, 600));

    ys.subscriptions.assertEqual(subscribe(300, 600), subscribe(400, 600), subscribe(500, 600), subscribe(600, 600));
});

test('flatMap_Then_Error_Complete', function () {
    var ex = new Error('ex');

    var scheduler = new TestScheduler();

    var xs = scheduler.createColdObservable(
      onNext(100, 4),
      onNext(200, 2),
      onNext(300, 3),
      onNext(400, 1),
      onError(500, ex));

    var ys = scheduler.createColdObservable(
      onNext(50, "foo"),
      onNext(100, "bar"),
      onNext(150, "baz"),
      onNext(200, "qux"),
      onCompleted(250));

    var results = scheduler.startWithCreate(function () {
      return xs.flatMap(ys);
    });

    results.messages.assertEqual(
      onNext(350, "foo"),
      onNext(400, "bar"),
      onNext(450, "baz"),
      onNext(450, "foo"),
      onNext(500, "qux"),
      onNext(500, "bar"),
      onNext(550, "baz"),
      onNext(550, "foo"),
      onNext(600, "qux"),
      onNext(600, "bar"),
      onNext(650, "baz"),
      onNext(650, "foo"),
      onError(700, ex));

    xs.subscriptions.assertEqual(subscribe(200, 700));

    ys.subscriptions.assertEqual(
      subscribe(300, 550),
      subscribe(400, 650),
      subscribe(500, 700),
      subscribe(600, 700));
});

test('flatMap_Then_Error_Error', function () {
  var ex = new Error('ex');

  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 4),
    onNext(200, 2),
    onNext(300, 3),
    onNext(400, 1),
    onError(500, ex));

  var ys = scheduler.createColdObservable(
    onNext(50, "foo"),
    onNext(100, "bar"),
    onNext(150, "baz"),
    onNext(200, "qux"),
    onError(250, ex));

  var results = scheduler.startWithCreate(function () {
    return xs.flatMap(ys);
  });

  results.messages.assertEqual(
    onNext(350, "foo"),
    onNext(400, "bar"),
    onNext(450, "baz"),
    onNext(450, "foo"),
    onNext(500, "qux"),
    onNext(500, "bar"),
    onError(550, ex));

  xs.subscriptions.assertEqual(subscribe(200, 550));

  ys.subscriptions.assertEqual(
    subscribe(300, 550),
    subscribe(400, 550),
    subscribe(500, 550));
});

test('flatMap_Complete', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(5, scheduler.createColdObservable(onError(1, new Error('ex1')))),
    onNext(105, scheduler.createColdObservable(onError(1, new Error('ex2')))),
    onNext(300, scheduler.createColdObservable(
      onNext(10, 102),
      onNext(90, 103),
      onNext(110, 104),
      onNext(190, 105),
      onNext(440, 106),
      onCompleted(460))),
    onNext(400, scheduler.createColdObservable(
      onNext(180, 202),
      onNext(190, 203),
      onCompleted(205))),
    onNext(550, scheduler.createColdObservable(
      onNext(10, 301),
      onNext(50, 302),
      onNext(70, 303),
      onNext(260, 304),
      onNext(310, 305),
      onCompleted(410))),
    onNext(750, scheduler.createColdObservable(onCompleted(40))),
    onNext(850, scheduler.createColdObservable(
      onNext(80, 401),
      onNext(90, 402),
      onCompleted(100))),
    onCompleted(900));

  var results = scheduler.startWithCreate(function () {
    return xs.flatMap(function (x) {
      return x;
    });
  });

  results.messages.assertEqual(
    onNext(310, 102),
    onNext(390, 103),
    onNext(410, 104),
    onNext(490, 105),
    onNext(560, 301),
    onNext(580, 202),
    onNext(590, 203),
    onNext(600, 302),
    onNext(620, 303),
    onNext(740, 106),
    onNext(810, 304),
    onNext(860, 305),
    onNext(930, 401),
    onNext(940, 402),
    onCompleted(960));

  xs.subscriptions.assertEqual(subscribe(200, 900));

  xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
  xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 605));
  xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 960));
  xs.messages[5].value.value.subscriptions.assertEqual(subscribe(750, 790));
  xs.messages[6].value.value.subscriptions.assertEqual(subscribe(850, 950));
});

test('flatMap_Complete_InnerNotComplete', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(5, scheduler.createColdObservable(onError(1, new Error('ex1')))),
    onNext(105, scheduler.createColdObservable(onError(1, new Error('ex2')))),
    onNext(300, scheduler.createColdObservable(
      onNext(10, 102),
      onNext(90, 103),
      onNext(110, 104),
      onNext(190, 105),
      onNext(440, 106),
      onCompleted(460))),
    onNext(400, scheduler.createColdObservable(
      onNext(180, 202),
      onNext(190, 203))),
    onNext(550, scheduler.createColdObservable(
      onNext(10, 301),
      onNext(50, 302),
      onNext(70, 303),
      onNext(260, 304),
      onNext(310, 305),
      onCompleted(410))),
    onNext(750, scheduler.createColdObservable(onCompleted(40))),
    onNext(850, scheduler.createColdObservable(
      onNext(80, 401),
      onNext(90, 402),
      onCompleted(100))),
    onCompleted(900));

  var results = scheduler.startWithCreate(function () {
    return xs.flatMap(function (x) {
      return x;
    });
  });

  results.messages.assertEqual(
    onNext(310, 102),
    onNext(390, 103),
    onNext(410, 104),
    onNext(490, 105),
    onNext(560, 301),
    onNext(580, 202),
    onNext(590, 203),
    onNext(600, 302),
    onNext(620, 303),
    onNext(740, 106),
    onNext(810, 304),
    onNext(860, 305),
    onNext(930, 401),
    onNext(940, 402));

  xs.subscriptions.assertEqual(subscribe(200, 900));

  xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
  xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 1000));
  xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 960));
  xs.messages[5].value.value.subscriptions.assertEqual(subscribe(750, 790));
  xs.messages[6].value.value.subscriptions.assertEqual(subscribe(850, 950));
});

test('flatMap_Complete_OuterNotComplete', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(5, scheduler.createColdObservable(onError(1, new Error('ex1')))),
      onNext(105, scheduler.createColdObservable(onError(1, new Error('ex2')))),
      onNext(300, scheduler.createColdObservable(
        onNext(10, 102),
        onNext(90, 103),
        onNext(110, 104),
        onNext(190, 105),
        onNext(440, 106),
        onCompleted(460))),
      onNext(400, scheduler.createColdObservable(
        onNext(180, 202),
        onNext(190, 203),
        onCompleted(205))),
      onNext(550, scheduler.createColdObservable(
        onNext(10, 301),
        onNext(50, 302),
        onNext(70, 303),
        onNext(260, 304),
        onNext(310, 305),
        onCompleted(410))),
      onNext(750, scheduler.createColdObservable(onCompleted(40))),
      onNext(850, scheduler.createColdObservable(
        onNext(80, 401),
        onNext(90, 402),
        onCompleted(100))));

    var results = scheduler.startWithCreate(function () {
      return xs.flatMap(function (x) {
        return x;
      });
    });

    results.messages.assertEqual(
      onNext(310, 102),
      onNext(390, 103),
      onNext(410, 104),
      onNext(490, 105),
      onNext(560, 301),
      onNext(580, 202),
      onNext(590, 203),
      onNext(600, 302),
      onNext(620, 303),
      onNext(740, 106),
      onNext(810, 304),
      onNext(860, 305),
      onNext(930, 401),
      onNext(940, 402));

    xs.subscriptions.assertEqual(subscribe(200, 1000));
    xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
    xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 605));
    xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 960));
    xs.messages[5].value.value.subscriptions.assertEqual(subscribe(750, 790));
    xs.messages[6].value.value.subscriptions.assertEqual(subscribe(850, 950));
});

test('flatMap_Error_Outer', function () {
    var ex = new Error('ex');

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(5, scheduler.createColdObservable(onError(1, new Error('ex1')))),
      onNext(105, scheduler.createColdObservable(onError(1, new Error('ex2')))),
      onNext(300, scheduler.createColdObservable(
        onNext(10, 102),
        onNext(90, 103),
        onNext(110, 104),
        onNext(190, 105),
        onNext(440, 106),
        onCompleted(460))),
      onNext(400, scheduler.createColdObservable(
        onNext(180, 202),
        onNext(190, 203),
        onCompleted(205))),
      onNext(550, scheduler.createColdObservable(
        onNext(10, 301),
        onNext(50, 302),
        onNext(70, 303),
        onNext(260, 304),
        onNext(310, 305),
        onCompleted(410))),
      onNext(750, scheduler.createColdObservable(onCompleted(40))),
      onNext(850, scheduler.createColdObservable(
        onNext(80, 401),
        onNext(90, 402),
        onCompleted(100))),
      onError(900, ex));

    var results = scheduler.startWithCreate(function () {
      return xs.flatMap(function (x) {
        return x;
      });
    });

    results.messages.assertEqual(
      onNext(310, 102),
      onNext(390, 103),
      onNext(410, 104),
      onNext(490, 105),
      onNext(560, 301),
      onNext(580, 202),
      onNext(590, 203),
      onNext(600, 302),
      onNext(620, 303),
      onNext(740, 106),
      onNext(810, 304),
      onNext(860, 305),
      onError(900, ex));

    xs.subscriptions.assertEqual(subscribe(200, 900));

    xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
    xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 605));
    xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 900));
    xs.messages[5].value.value.subscriptions.assertEqual(subscribe(750, 790));
    xs.messages[6].value.value.subscriptions.assertEqual(subscribe(850, 900));
});

test('flatMap_Error_Inner', function () {
    var ex = new Error('ex');

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(5, scheduler.createColdObservable(onError(1, new Error('ex1')))),
      onNext(105, scheduler.createColdObservable(onError(1, new Error('ex2')))),
      onNext(300, scheduler.createColdObservable(
        onNext(10, 102),
        onNext(90, 103),
        onNext(110, 104),
        onNext(190, 105),
        onNext(440, 106),
        onError(460, ex))),
      onNext(400, scheduler.createColdObservable(
        onNext(180, 202),
        onNext(190, 203),
        onCompleted(205))),
      onNext(550, scheduler.createColdObservable(
        onNext(10, 301),
        onNext(50, 302),
        onNext(70, 303),
        onNext(260, 304),
        onNext(310, 305),
        onCompleted(410))),
      onNext(750, scheduler.createColdObservable(onCompleted(40))),
      onNext(850, scheduler.createColdObservable(
        onNext(80, 401),
        onNext(90, 402),
        onCompleted(100))),
      onCompleted(900));

    var results = scheduler.startWithCreate(function () {
      return xs.flatMap(function (x) {
        return x;
      });
    });

    results.messages.assertEqual(
      onNext(310, 102),
      onNext(390, 103),
      onNext(410, 104),
      onNext(490, 105),
      onNext(560, 301),
      onNext(580, 202),
      onNext(590, 203),
      onNext(600, 302),
      onNext(620, 303),
      onNext(740, 106),
      onError(760, ex));

    xs.subscriptions.assertEqual(subscribe(200, 760));

    xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
    xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 605));
    xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 760));
    xs.messages[5].value.value.subscriptions.assertEqual(subscribe(750, 760));
    xs.messages[6].value.value.subscriptions.assertEqual();
});

test('flatMap_Dispose', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(5, scheduler.createColdObservable(onError(1, new Error('ex1')))),
    onNext(105, scheduler.createColdObservable(onError(1, new Error('ex2')))),
    onNext(300, scheduler.createColdObservable(
      onNext(10, 102),
      onNext(90, 103),
      onNext(110, 104),
      onNext(190, 105),
      onNext(440, 106),
      onCompleted(460))),
    onNext(400, scheduler.createColdObservable(
      onNext(180, 202),
      onNext(190, 203),
      onCompleted(205))),
    onNext(550, scheduler.createColdObservable(
      onNext(10, 301),
      onNext(50, 302),
      onNext(70, 303),
      onNext(260, 304),
      onNext(310, 305),
      onCompleted(410))),
    onNext(750, scheduler.createColdObservable(onCompleted(40))),
    onNext(850, scheduler.createColdObservable(
      onNext(80, 401),
      onNext(90, 402),
      onCompleted(100))),
    onCompleted(900));

  var results = scheduler.startWithDispose(function () {
      return xs.flatMap(function (x) { return x; });
  }, 700);

  results.messages.assertEqual(
    onNext(310, 102),
    onNext(390, 103),
    onNext(410, 104),
    onNext(490, 105),
    onNext(560, 301),
    onNext(580, 202),
    onNext(590, 203),
    onNext(600, 302),
    onNext(620, 303));

  xs.subscriptions.assertEqual(subscribe(200, 700));

  xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 700));
  xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 605));
  xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 700));
  xs.messages[5].value.value.subscriptions.assertEqual();
  xs.messages[6].value.value.subscriptions.assertEqual();
});

test('flatMap_Throw', function () {
  var invoked = 0;
  var ex = new Error('ex');

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(5, scheduler.createColdObservable(onError(1, new Error('ex1')))),
    onNext(105, scheduler.createColdObservable(onError(1, new Error('ex2')))),
    onNext(300, scheduler.createColdObservable(
      onNext(10, 102),
      onNext(90, 103),
      onNext(110, 104),
      onNext(190, 105),
      onNext(440, 106),
      onCompleted(460))),
    onNext(400, scheduler.createColdObservable(
      onNext(180, 202),
      onNext(190, 203),
      onCompleted(205))),
    onNext(550, scheduler.createColdObservable(
      onNext(10, 301),
      onNext(50, 302),
      onNext(70, 303),
      onNext(260, 304),
      onNext(310, 305),
      onCompleted(410))),
    onNext(750, scheduler.createColdObservable(
      onCompleted(40))),
    onNext(850, scheduler.createColdObservable(
      onNext(80, 401),
      onNext(90, 402),
      onCompleted(100))),
    onCompleted(900));

  var results = scheduler.startWithCreate(function () {
    return xs.flatMap(function (x) {
      invoked++;
      if (invoked === 3) { throw ex; }
      return x;
    });
  });

  results.messages.assertEqual(
    onNext(310, 102),
    onNext(390, 103),
    onNext(410, 104),
    onNext(490, 105),
    onError(550, ex)
  );

  xs.subscriptions.assertEqual(subscribe(200, 550));

  xs.messages[2].value.value.subscriptions.assertEqual(
    subscribe(300, 550)
  );

  xs.messages[3].value.value.subscriptions.assertEqual(
    subscribe(400, 550)
  );

  xs.messages[4].value.value.subscriptions.assertEqual();
  xs.messages[5].value.value.subscriptions.assertEqual();
  xs.messages[6].value.value.subscriptions.assertEqual();
});

test('flatMap_UseFunction', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 4),
    onNext(220, 3),
    onNext(250, 5),
    onNext(270, 1),
    onCompleted(290)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.flatMap(function (x) {
      return Observable.interval(10, scheduler).select(function () {
        return x;
      }).take(x);
    });
  });

  results.messages.assertEqual(
    onNext(220, 4),
    onNext(230, 3),
    onNext(230, 4),
    onNext(240, 3),
    onNext(240, 4),
    onNext(250, 3),
    onNext(250, 4),
    onNext(260, 5),
    onNext(270, 5),
    onNext(280, 1),
    onNext(280, 5),
    onNext(290, 5),
    onNext(300, 5),
    onCompleted(300)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 290)
  );
});

function arrayRepeat(value, times) {
  var results = [];
  for(var i = 0; i < times; i++) {
    results.push(value);
  }
  return results;
}

test('flatMap_Iterable_Complete', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 2),
    onNext(340, 4),
    onNext(420, 3),
    onNext(510, 2),
    onCompleted(600)
  );

  var inners = [];

  var res = scheduler.startWithCreate(function () {
    return xs.flatMap(function (x) {
      var ys = arrayRepeat(x, x);
      inners.push(ys);
      return ys;
    });
  });

  res.messages.assertEqual(
    onNext(210, 2),
    onNext(210, 2),
    onNext(340, 4),
    onNext(340, 4),
    onNext(340, 4),
    onNext(340, 4),
    onNext(420, 3),
    onNext(420, 3),
    onNext(420, 3),
    onNext(510, 2),
    onNext(510, 2),
    onCompleted(600)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 600)
  );

  equal(4, inners.length);
});

test('flatMap_Iterable_Complete_ResultSelector', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 2),
    onNext(340, 4),
    onNext(420, 3),
    onNext(510, 2),
    onCompleted(600)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.flatMap(function (x) { return arrayRepeat(x, x); }, function (x, y) { return x + y; });
  });

  res.messages.assertEqual(
    onNext(210, 4),
    onNext(210, 4),
    onNext(340, 8),
    onNext(340, 8),
    onNext(340, 8),
    onNext(340, 8),
    onNext(420, 6),
    onNext(420, 6),
    onNext(420, 6),
    onNext(510, 4),
    onNext(510, 4),
    onCompleted(600)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 600)
  );
});

test('flatMap_Iterable_Error', function () {
  var scheduler = new TestScheduler();

  var ex = new Error();

  var xs = scheduler.createHotObservable(
    onNext(210, 2),
    onNext(340, 4),
    onNext(420, 3),
    onNext(510, 2),
    onError(600, ex)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.flatMap(function (x) { return arrayRepeat(x, x); })
  });

  res.messages.assertEqual(
    onNext(210, 2),
    onNext(210, 2),
    onNext(340, 4),
    onNext(340, 4),
    onNext(340, 4),
    onNext(340, 4),
    onNext(420, 3),
    onNext(420, 3),
    onNext(420, 3),
    onNext(510, 2),
    onNext(510, 2),
    onError(600, ex)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 600)
  );
});

test('flatMap_Iterable_Error_ResultSelector', function () {
  var scheduler = new TestScheduler();

  var ex = new Error();

  var xs = scheduler.createHotObservable(
    onNext(210, 2),
    onNext(340, 4),
    onNext(420, 3),
    onNext(510, 2),
    onError(600, ex)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.flatMap(function (x) { return arrayRepeat(x, x); }, function (x, y) { return x + y; });
  });

  res.messages.assertEqual(
    onNext(210, 4),
    onNext(210, 4),
    onNext(340, 8),
    onNext(340, 8),
    onNext(340, 8),
    onNext(340, 8),
    onNext(420, 6),
    onNext(420, 6),
    onNext(420, 6),
    onNext(510, 4),
    onNext(510, 4),
    onError(600, ex)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 600)
  );
});

test('flatMap_Iterable_Dispose', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 2),
    onNext(340, 4),
    onNext(420, 3),
    onNext(510, 2),
    onCompleted(600)
  );

  var res = scheduler.startWithDispose(
    function () {
      return xs.flatMap(function (x) { return arrayRepeat(x, x); })
    },
    350
  );

  res.messages.assertEqual(
    onNext(210, 2),
    onNext(210, 2),
    onNext(340, 4),
    onNext(340, 4),
    onNext(340, 4),
    onNext(340, 4)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 350)
  );
});

test('flatMap_Iterable_Dispose_ResultSelector', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 2),
    onNext(340, 4),
    onNext(420, 3),
    onNext(510, 2),
    onCompleted(600)
  );

  var res = scheduler.startWithDispose(
    function () {
      return xs.flatMap(function (x) { return arrayRepeat(x, x); }, function (x, y) { return x + y; });
    },
    350
  );

  res.messages.assertEqual(
    onNext(210, 4),
    onNext(210, 4),
    onNext(340, 8),
    onNext(340, 8),
    onNext(340, 8),
    onNext(340, 8)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 350)
  );
});

test('flatMap_Iterable_SelectorThrows', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 2),
    onNext(340, 4),
    onNext(420, 3),
    onNext(510, 2),
    onCompleted(600)
  );

  var invoked = 0;
  var ex = new Error();

  var res = scheduler.startWithCreate(function () {
    return xs.flatMap(function (x) {
      invoked++;
      if (invoked === 3) { throw ex; }
      return arrayRepeat(x, x);
    });
  });

  res.messages.assertEqual(
      onNext(210, 2),
      onNext(210, 2),
      onNext(340, 4),
      onNext(340, 4),
      onNext(340, 4),
      onNext(340, 4),
      onError(420, ex)
  );

  xs.subscriptions.assertEqual(
      subscribe(200, 420)
  );

  equal(3, invoked);
});

test('flatMap_Iterable_ResultSelectorThrows', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 2),
    onNext(340, 4),
    onNext(420, 3),
    onNext(510, 2),
    onCompleted(600)
  );

  var ex = new Error();

  var inners = [];

  var res = scheduler.startWithCreate(function () {
    return xs.flatMap(
      function (x) {
        var ys = arrayRepeat(x, x);
        inners.push(ys);
        return ys;
      },
      function (x, y) {
        if (x === 3) { throw ex; }
        return x + y;
      }
    );
  });

  res.messages.assertEqual(
    onNext(210, 4),
    onNext(210, 4),
    onNext(340, 8),
    onNext(340, 8),
    onNext(340, 8),
    onNext(340, 8),
    onError(420, ex)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 420)
  );

  equal(3, inners.length);
});

test('flatMap_Iterable_SelectorThrows_ResultSelector', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 2),
    onNext(340, 4),
    onNext(420, 3),
    onNext(510, 2),
    onCompleted(600)
  );

  var invoked = 0;
  var ex = new Error();

  var res = scheduler.startWithCreate(function () {
    return xs.flatMap(
      function (x) {
        invoked++;
        if (invoked === 3) { throw ex; }
        return arrayRepeat(x, x);
      },
      function (x, y) { return x + y; }
    );
  });

  res.messages.assertEqual(
    onNext(210, 4),
    onNext(210, 4),
    onNext(340, 8),
    onNext(340, 8),
    onNext(340, 8),
    onNext(340, 8),
    onError(420, ex)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 420)
  );

  equal(3, invoked);
});
