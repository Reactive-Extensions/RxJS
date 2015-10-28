
'use strict';
/* jshint undef: true, unused: true */
/* globals Promise */

var test = require('tape');
var Observable = require('../observable');
var isEqual = require('../internal/isequal');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe;

Observable.addToObject({
  fromArray: require('../observable/fromarray'),
  interval: require('../observable/interval')
});

Observable.addToPrototype({
  flatMap: require('../observable/flatmap'),
  map: require('../observable/map'),
  take: require('../observable/take')
});

// Polyfilling
require('lie/polyfill');

test('Observable#flatMap then complete promise', function (t) {
  var xs = Observable.fromArray([4,3,2,1]);

  var ys = Promise.resolve(42);

  var results = [];
  xs.flatMap(ys).subscribe(
    function (x) {
      results.push(x);
    },
    function () {
      t.ok(false);
      t.end();
    },
    function () {
      t.ok(isEqual([42,42,42,42], results));
      t.end();
    });
});

test('Observable#flatMap then error Promise', function (t) {
  var xs = Observable.fromArray([4,3,2,1]);

  var ys = Promise.reject(42);

  xs.flatMap(ys).subscribe(
    function () {
      t.ok(false);
      t.end();
    },
    function (err) {
      t.equal(err, 42);
      t.end();
    },
    function () {
      t.ok(false);
      t.end();
    });
});

test('Observable#flatMap selector complete Promise', function (t) {
  var xs = Observable.fromArray([4,3,2,1]);

  var results = [];
  xs.flatMap(function (x, i) {
    return Promise.resolve(x + i);
  }).subscribe(
    function (x) {
      results.push(x);
    },
    function () {
      t.ok(false);
      t.end();
    },
    function () {
      t.ok(isEqual([4, 4, 4, 4], results));
      t.end();
    });
});

test('Observable#flatMap Selector error Promise', function (t) {
  var xs = Observable.fromArray([4,3,2,1]);

  xs.flatMap(function (x, i) {
    return Promise.reject(x + i);
  }).subscribe(
    function () {
      t.ok(false);
      t.end();
    },
    function (err) {
      t.equal(err, 4);
      t.end();
    },
    function () {
      t.ok(false);
      t.end();
    });
});

test('Observable#flatMap result selector complete promise', function (t) {
  var xs = Observable.fromArray([4,3,2,1]);

  var results = [];
  xs.flatMap(
    function (x, i) {
      return Promise.resolve(x + i);
    },
    function (x, y, i) {
      return x + y + i;
    })
    .subscribe(
      function (x) {
        results.push(x);
      },
      function () {
        t.ok(false);
        t.end();
      },
      function () {
        t.ok(isEqual([8, 8, 8, 8], results));
        t.end();
      });
});

test('Observable#flatMap result selector error promise', function (t) {
  var xs = Observable.fromArray([4,3,2,1]);

  xs.flatMap(
    function (x, i) {
      return Promise.reject(x + i);
    },
    function (x, y, i) {
      return x + y + i;
    })
    .subscribe(
      function () {
        t.ok(false);
        t.end();
      },
      function (err) {
        t.equal(err, 4);
        t.end();
      },
      function () {
        t.ok(false);
        t.end();
      });
});

test('Observable#flatMap then complete complete', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 4),
    onNext(200, 2),
    onNext(300, 3),
    onNext(400, 1),
    onCompleted(500)
  );

  var ys = scheduler.createColdObservable(
    onNext(50, 'foo'),
    onNext(100, 'bar'),
    onNext(150, 'baz'),
    onNext(200, 'qux'),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return xs.flatMap(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(350, 'foo'),
    onNext(400, 'bar'),
    onNext(450, 'baz'),
    onNext(450, 'foo'),
    onNext(500, 'qux'),
    onNext(500, 'bar'),
    onNext(550, 'baz'),
    onNext(550, 'foo'),
    onNext(600, 'qux'),
    onNext(600, 'bar'),
    onNext(650, 'baz'),
    onNext(650, 'foo'),
    onNext(700, 'qux'),
    onNext(700, 'bar'),
    onNext(750, 'baz'),
    onNext(800, 'qux'),
    onCompleted(850)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 700)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(300, 550),
    subscribe(400, 650),
    subscribe(500, 750),
    subscribe(600, 850)
  ]);

  t.end();
});

test('Observable#flatMap then complete complete 2', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 4),
    onNext(200, 2),
    onNext(300, 3),
    onNext(400, 1),
    onCompleted(700));

  var ys = scheduler.createColdObservable(
    onNext(50, 'foo'),
    onNext(100, 'bar'),
    onNext(150, 'baz'),
    onNext(200, 'qux'),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.flatMap(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(350, 'foo'),
    onNext(400, 'bar'),
    onNext(450, 'baz'),
    onNext(450, 'foo'),
    onNext(500, 'qux'),
    onNext(500, 'bar'),
    onNext(550, 'baz'),
    onNext(550, 'foo'),
    onNext(600, 'qux'),
    onNext(600, 'bar'),
    onNext(650, 'baz'),
    onNext(650, 'foo'),
    onNext(700, 'qux'),
    onNext(700, 'bar'),
    onNext(750, 'baz'),
    onNext(800, 'qux'),
    onCompleted(900)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 900)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(300, 550),
    subscribe(400, 650),
    subscribe(500, 750),
    subscribe(600, 850)
  ]);

  t.end();
});

test('Observable#flatMap then never complete', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 4),
    onNext(200, 2),
    onNext(300, 3),
    onNext(400, 1),
    onNext(500, 5),
    onNext(700, 0));

  var ys = scheduler.createColdObservable(
    onNext(50, 'foo'),
    onNext(100, 'bar'),
    onNext(150, 'baz'),
    onNext(200, 'qux'),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.flatMap(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(350, 'foo'),
    onNext(400, 'bar'),
    onNext(450, 'baz'),
    onNext(450, 'foo'),
    onNext(500, 'qux'),
    onNext(500, 'bar'),
    onNext(550, 'baz'),
    onNext(550, 'foo'),
    onNext(600, 'qux'),
    onNext(600, 'bar'),
    onNext(650, 'baz'),
    onNext(650, 'foo'),
    onNext(700, 'qux'),
    onNext(700, 'bar'),
    onNext(750, 'baz'),
    onNext(750, 'foo'),
    onNext(800, 'qux'),
    onNext(800, 'bar'),
    onNext(850, 'baz'),
    onNext(900, 'qux'),
    onNext(950, 'foo')
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 1000)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(300, 550),
    subscribe(400, 650),
    subscribe(500, 750),
    subscribe(600, 850),
    subscribe(700, 950),
    subscribe(900, 1000)
  ]);

  t.end();
});

test('Observable#flatMap then complete never', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 4),
    onNext(200, 2),
    onNext(300, 3),
    onNext(400, 1),
    onCompleted(500));

  var ys = scheduler.createColdObservable(
    onNext(50, 'foo'),
    onNext(100, 'bar'),
    onNext(150, 'baz'),
    onNext(200, 'qux'));

  var results = scheduler.startScheduler(function () {
    return xs.flatMap(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(350, 'foo'),
    onNext(400, 'bar'),
    onNext(450, 'baz'),
    onNext(450, 'foo'),
    onNext(500, 'qux'),
    onNext(500, 'bar'),
    onNext(550, 'baz'),
    onNext(550, 'foo'),
    onNext(600, 'qux'),
    onNext(600, 'bar'),
    onNext(650, 'baz'),
    onNext(650, 'foo'),
    onNext(700, 'qux'),
    onNext(700, 'bar'),
    onNext(750, 'baz'),
    onNext(800, 'qux')
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 700)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(300, 1000),
    subscribe(400, 1000),
    subscribe(500, 1000),
    subscribe(600, 1000)
  ]);

  t.end();
});

test('Observable#flatMap then complete Error', function (t) {
  var ex = new Error('ex');

  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 4),
    onNext(200, 2),
    onNext(300, 3),
    onNext(400, 1),
    onCompleted(500)
  );

  var ys = scheduler.createColdObservable(
    onNext(50, 'foo'),
    onNext(100, 'bar'),
    onNext(150, 'baz'),
    onNext(200, 'qux'),
    onError(300, ex)
  );

  var results = scheduler.startScheduler(function () {
      return xs.flatMap(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(350, 'foo'),
    onNext(400, 'bar'),
    onNext(450, 'baz'),
    onNext(450, 'foo'),
    onNext(500, 'qux'),
    onNext(500, 'bar'),
    onNext(550, 'baz'),
    onNext(550, 'foo'),
    onError(600, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(300, 600),
    subscribe(400, 600),
    subscribe(500, 600),
    subscribe(600, 600)
  ]);

  t.end();
});

test('Observable#flatMap then error complete', function (t) {
  var ex = new Error('ex');

  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 4),
    onNext(200, 2),
    onNext(300, 3),
    onNext(400, 1),
    onError(500, ex));

  var ys = scheduler.createColdObservable(
    onNext(50, 'foo'),
    onNext(100, 'bar'),
    onNext(150, 'baz'),
    onNext(200, 'qux'),
    onCompleted(250));

  var results = scheduler.startScheduler(function () {
    return xs.flatMap(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(350, 'foo'),
    onNext(400, 'bar'),
    onNext(450, 'baz'),
    onNext(450, 'foo'),
    onNext(500, 'qux'),
    onNext(500, 'bar'),
    onNext(550, 'baz'),
    onNext(550, 'foo'),
    onNext(600, 'qux'),
    onNext(600, 'bar'),
    onNext(650, 'baz'),
    onNext(650, 'foo'),
    onError(700, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 700)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(300, 550),
    subscribe(400, 650),
    subscribe(500, 700),
    subscribe(600, 700)
  ]);

  t.end();
});

test('Observable#flatMap then error Error', function (t) {
  var ex = new Error('ex');

  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
    onNext(100, 4),
    onNext(200, 2),
    onNext(300, 3),
    onNext(400, 1),
    onError(500, ex));

  var ys = scheduler.createColdObservable(
    onNext(50, 'foo'),
    onNext(100, 'bar'),
    onNext(150, 'baz'),
    onNext(200, 'qux'),
    onError(250, ex));

  var results = scheduler.startScheduler(function () {
    return xs.flatMap(ys);
  });

  reactiveAssert(t, results.messages, [
    onNext(350, 'foo'),
    onNext(400, 'bar'),
    onNext(450, 'baz'),
    onNext(450, 'foo'),
    onNext(500, 'qux'),
    onNext(500, 'bar'),
    onError(550, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 550)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(300, 550),
    subscribe(400, 550),
    subscribe(500, 550)
  ]);

  t.end();
});

test('Observable#flatMap complete', function (t) {
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

  var results = scheduler.startScheduler(function () {
    return xs.flatMap(function (x) {
      return x;
    });
  });

  reactiveAssert(t, results.messages, [
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
    onCompleted(960)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 900)
  ]);

  reactiveAssert(t, xs.messages[2].value.value.subscriptions, [subscribe(300, 760)]);
  reactiveAssert(t, xs.messages[3].value.value.subscriptions, [subscribe(400, 605)]);
  reactiveAssert(t, xs.messages[4].value.value.subscriptions, [subscribe(550, 960)]);
  reactiveAssert(t, xs.messages[5].value.value.subscriptions, [subscribe(750, 790)]);
  reactiveAssert(t, xs.messages[6].value.value.subscriptions, [subscribe(850, 950)]);

  t.end();
});

test('Observable#flatMap complete innerNotcomplete', function (t) {
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

  var results = scheduler.startScheduler(function () {
    return xs.flatMap(function (x) {
      return x;
    });
  });

  reactiveAssert(t, results.messages, [
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
    onNext(940, 402)
  ]);

  reactiveAssert(t, xs.subscriptions, [subscribe(200, 900)]);

  reactiveAssert(t, xs.messages[2].value.value.subscriptions, [subscribe(300, 760)]);
  reactiveAssert(t, xs.messages[3].value.value.subscriptions, [subscribe(400, 1000)]);
  reactiveAssert(t, xs.messages[4].value.value.subscriptions, [subscribe(550, 960)]);
  reactiveAssert(t, xs.messages[5].value.value.subscriptions, [subscribe(750, 790)]);
  reactiveAssert(t, xs.messages[6].value.value.subscriptions, [subscribe(850, 950)]);

  t.end();
});

test('Observable#flatMap complete outerNotcomplete', function (t) {
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

  var results = scheduler.startScheduler(function () {
    return xs.flatMap(function (x) {
      return x;
    });
  });

  reactiveAssert(t, results.messages, [
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
    onNext(940, 402)
  ]);

  reactiveAssert(t, xs.subscriptions, [subscribe(200, 1000)]);
  reactiveAssert(t, xs.messages[2].value.value.subscriptions, [subscribe(300, 760)]);
  reactiveAssert(t, xs.messages[3].value.value.subscriptions, [subscribe(400, 605)]);
  reactiveAssert(t, xs.messages[4].value.value.subscriptions, [subscribe(550, 960)]);
  reactiveAssert(t, xs.messages[5].value.value.subscriptions, [subscribe(750, 790)]);
  reactiveAssert(t, xs.messages[6].value.value.subscriptions, [subscribe(850, 950)]);

  t.end();
});

test('Observable#flatMap error outer', function (t) {
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

    var results = scheduler.startScheduler(function () {
      return xs.flatMap(function (x) {
        return x;
      });
    });

    reactiveAssert(t, results.messages, [
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
      onError(900, ex)
    ]);

    reactiveAssert(t, xs.subscriptions, [subscribe(200, 900)]);

    reactiveAssert(t, xs.messages[2].value.value.subscriptions, [subscribe(300, 760)]);
    reactiveAssert(t, xs.messages[3].value.value.subscriptions, [subscribe(400, 605)]);
    reactiveAssert(t, xs.messages[4].value.value.subscriptions, [subscribe(550, 900)]);
    reactiveAssert(t, xs.messages[5].value.value.subscriptions, [subscribe(750, 790)]);
    reactiveAssert(t, xs.messages[6].value.value.subscriptions, [subscribe(850, 900)]);

    t.end();
});

test('Observable#flatMap error inner', function (t) {
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

    var results = scheduler.startScheduler(function () {
      return xs.flatMap(function (x) {
        return x;
      });
    });

    reactiveAssert(t, results.messages, [
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
      onError(760, ex)
    ]);

    reactiveAssert(t, xs.subscriptions, [subscribe(200, 760)]);

    reactiveAssert(t, xs.messages[2].value.value.subscriptions, [subscribe(300, 760)]);
    reactiveAssert(t, xs.messages[3].value.value.subscriptions, [subscribe(400, 605)]);
    reactiveAssert(t, xs.messages[4].value.value.subscriptions, [subscribe(550, 760)]);
    reactiveAssert(t, xs.messages[5].value.value.subscriptions, [subscribe(750, 760)]);
    reactiveAssert(t, xs.messages[6].value.value.subscriptions, []);

    t.end();
});

test('Observable#flatMap dispose', function (t) {
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

  var results = scheduler.startScheduler(function () {
      return xs.flatMap(function (x) { return x; });
  }, { disposed: 700 });

  reactiveAssert(t, results.messages, [
    onNext(310, 102),
    onNext(390, 103),
    onNext(410, 104),
    onNext(490, 105),
    onNext(560, 301),
    onNext(580, 202),
    onNext(590, 203),
    onNext(600, 302),
    onNext(620, 303)
  ]);

  reactiveAssert(t, xs.subscriptions, [subscribe(200, 700)]);

  reactiveAssert(t, xs.messages[2].value.value.subscriptions, [subscribe(300, 700)]);
  reactiveAssert(t, xs.messages[3].value.value.subscriptions, [subscribe(400, 605)]);
  reactiveAssert(t, xs.messages[4].value.value.subscriptions, [subscribe(550, 700)]);
  reactiveAssert(t, xs.messages[5].value.value.subscriptions, []);
  reactiveAssert(t, xs.messages[6].value.value.subscriptions, []);

  t.end();
});

test('Observable#flatMap Throw', function (t) {
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

  var results = scheduler.startScheduler(function () {
    return xs.flatMap(function (x) {
      invoked++;
      if (invoked === 3) { throw ex; }
      return x;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(310, 102),
    onNext(390, 103),
    onNext(410, 104),
    onNext(490, 105),
    onError(550, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [subscribe(200, 550)]);

  reactiveAssert(t, xs.messages[2].value.value.subscriptions, [
    subscribe(300, 550)
  ]);

  reactiveAssert(t, xs.messages[3].value.value.subscriptions, [
    subscribe(400, 550)
  ]);

  reactiveAssert(t, xs.messages[4].value.value.subscriptions, []);
  reactiveAssert(t, xs.messages[5].value.value.subscriptions, []);
  reactiveAssert(t, xs.messages[6].value.value.subscriptions, []);

  t.end();
});

test('Observable#flatMap use function', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 4),
    onNext(220, 3),
    onNext(250, 5),
    onNext(270, 1),
    onCompleted(290)
  );

  var results = scheduler.startScheduler(function () {
    return xs.flatMap(function (x) {
      return Observable.interval(10, scheduler).map(function () {
        return x;
      }).take(x);
    });
  });

  reactiveAssert(t, results.messages, [
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
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 290)
  ]);

  t.end();
});

function arrayRepeat(value, times) {
  var results = [];
  for(var i = 0; i < times; i++) {
    results.push(value);
  }
  return results;
}

test('Observable#flatMap iterable complete', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 2),
    onNext(340, 4),
    onNext(420, 3),
    onNext(510, 2),
    onCompleted(600)
  );

  var inners = [];

  var results = scheduler.startScheduler(function () {
    return xs.flatMap(function (x) {
      var ys = arrayRepeat(x, x);
      inners.push(ys);
      return ys;
    });
  });

  reactiveAssert(t, results.messages, [
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
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.equal(4, inners.length);

  t.end();
});

test('Observable#flatMap Iterable complete result selector', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 2),
    onNext(340, 4),
    onNext(420, 3),
    onNext(510, 2),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(function () {
    return xs.flatMap(function (x) { return arrayRepeat(x, x); }, function (x, y) { return x + y; });
  });

  reactiveAssert(t, results.messages, [
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
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});

test('Observable#flatMap iterable Error', function (t) {
  var scheduler = new TestScheduler();

  var ex = new Error();

  var xs = scheduler.createHotObservable(
    onNext(210, 2),
    onNext(340, 4),
    onNext(420, 3),
    onNext(510, 2),
    onError(600, ex)
  );

  var results = scheduler.startScheduler(function () {
    return xs.flatMap(function (x) { return arrayRepeat(x, x); });
  });

  reactiveAssert(t, results.messages, [
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
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});

test('Observable#flatMap Iterable error result selector', function (t) {
  var scheduler = new TestScheduler();

  var ex = new Error();

  var xs = scheduler.createHotObservable(
    onNext(210, 2),
    onNext(340, 4),
    onNext(420, 3),
    onNext(510, 2),
    onError(600, ex)
  );

  var results = scheduler.startScheduler(function () {
    return xs.flatMap(function (x) { return arrayRepeat(x, x); }, function (x, y) { return x + y; });
  });

  reactiveAssert(t, results.messages, [
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
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 600)
  ]);

  t.end();
});

test('Observable#flatMap iterable dispose', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 2),
    onNext(340, 4),
    onNext(420, 3),
    onNext(510, 2),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(
    function () {
      return xs.flatMap(function (x) { return arrayRepeat(x, x); });
    },
    { disposed: 350 }
  );

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(210, 2),
    onNext(340, 4),
    onNext(340, 4),
    onNext(340, 4),
    onNext(340, 4)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 350)
  ]);

  t.end();
});

test('Observable#flatMap iterable dispose result selector', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 2),
    onNext(340, 4),
    onNext(420, 3),
    onNext(510, 2),
    onCompleted(600)
  );

  var results = scheduler.startScheduler(
    function () {
      return xs.flatMap(function (x) { return arrayRepeat(x, x); }, function (x, y) { return x + y; });
    },
    { disposed: 350 }
  );

  reactiveAssert(t, results.messages, [
    onNext(210, 4),
    onNext(210, 4),
    onNext(340, 8),
    onNext(340, 8),
    onNext(340, 8),
    onNext(340, 8)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 350)
  ]);

  t.end();
});

test('Observable#flatMap iterable selector throws', function (t) {
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

  var results = scheduler.startScheduler(function () {
    return xs.flatMap(function (x) {
      invoked++;
      if (invoked === 3) { throw ex; }
      return arrayRepeat(x, x);
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 2),
    onNext(210, 2),
    onNext(340, 4),
    onNext(340, 4),
    onNext(340, 4),
    onNext(340, 4),
    onError(420, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 420)
  ]);

  t.equal(3, invoked);

  t.end();
});

test('Observable#flatMap iterable result selector throws', function (t) {
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

  var results = scheduler.startScheduler(function () {
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

  reactiveAssert(t, results.messages, [
    onNext(210, 4),
    onNext(210, 4),
    onNext(340, 8),
    onNext(340, 8),
    onNext(340, 8),
    onNext(340, 8),
    onError(420, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 420)
  ]);

  t.equal(3, inners.length);

  t.end();
});

test('Observable#flatMap iterable selector throws result selector', function (t) {
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

  var results = scheduler.startScheduler(function () {
    return xs.flatMap(
      function (x) {
        invoked++;
        if (invoked === 3) { throw ex; }
        return arrayRepeat(x, x);
      },
      function (x, y) { return x + y; }
    );
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 4),
    onNext(210, 4),
    onNext(340, 8),
    onNext(340, 8),
    onNext(340, 8),
    onNext(340, 8),
    onError(420, ex)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 420)
  ]);

  t.equal(3, invoked);

  t.end();
});
