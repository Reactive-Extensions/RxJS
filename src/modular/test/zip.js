'use strict';
/* jshint undef: true, unused: true */

function add (x, y) { return x + y; }

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe;

Observable.addToObject({
  zip: require('../observable/zip')
});

Observable.addToPrototype({
  zip: require('../observable/zip'),
  zipIterable: require('../observable/zipiterable')
});

test('zip n-ary symmetric', function (t) {
  var scheduler = new TestScheduler();

  var e0 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 1),
    onNext(250, 4),
    onCompleted(420)
  );

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onNext(240, 5),
    onCompleted(410)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(230, 3),
    onNext(260, 6),
    onCompleted(400)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.zip(e0, e1, e2);
  });

  reactiveAssert(t, results.messages, [
    onNext(230, [1, 2, 3]),
    onNext(260, [4, 5, 6]),
    onCompleted(420)
  ]);

  reactiveAssert(t, e0.subscriptions, [
    subscribe(200, 420)
  ]);

  reactiveAssert(t, e1.subscriptions, [
    subscribe(200, 420)
  ]);

  reactiveAssert(t, e2.subscriptions, [
    subscribe(200, 420)
  ]);

  t.end();
});

test('zip n-ary symmetric selector', function (t) {
  var scheduler = new TestScheduler();

  var e0 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 1),
    onNext(250, 4),
    onCompleted(420)
  );

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onNext(240, 5),
    onCompleted(410)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(230, 3),
    onNext(260, 6),
    onCompleted(400)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.zip(e0, e1, e2, function (r0, r1, r2) { return [r0, r1, r2]; });
  });

  reactiveAssert(t, results.messages, [
    onNext(230, [1, 2, 3]),
    onNext(260, [4, 5, 6]),
    onCompleted(420)
  ]);

  reactiveAssert(t, e0.subscriptions, [
    subscribe(200, 420)
  ]);

  reactiveAssert(t, e1.subscriptions, [
    subscribe(200, 420)
  ]);

  reactiveAssert(t, e2.subscriptions, [
    subscribe(200, 420)
  ]);

  t.end();
});

test('zip n-ary array symmetric', function (t) {
  var scheduler = new TestScheduler();

  var e0 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 1),
    onNext(250, 4),
    onCompleted(420)
  );

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onNext(240, 5),
    onCompleted(410)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(230, 3),
    onNext(260, 6),
    onCompleted(400)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.zip(e0, e1, e2);
  });

  reactiveAssert(t, results.messages, [
    onNext(230, [1, 2, 3]),
    onNext(260, [4, 5, 6]),
    onCompleted(420)
  ]);

  reactiveAssert(t, e0.subscriptions, [
    subscribe(200, 420)
  ]);

  reactiveAssert(t, e1.subscriptions, [
    subscribe(200, 420)
  ]);

  reactiveAssert(t, e2.subscriptions, [
    subscribe(200, 420)
  ]);

  t.end();
});

test('zip n-ary symmetric array selector', function (t) {
  var scheduler = new TestScheduler();

  var e0 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 1),
    onNext(250, 4),
    onCompleted(420)
  );

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 2),
    onNext(240, 5),
    onCompleted(410)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(230, 3),
    onNext(260, 6),
    onCompleted(400)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.zip(e0, e1, e2, function (r0, r1, r2) { return [r0, r1, r2]; });
  });

  reactiveAssert(t, results.messages, [
    onNext(230, [1, 2, 3]),
    onNext(260, [4, 5, 6]),
    onCompleted(420)
  ]);

  reactiveAssert(t, e0.subscriptions, [
    subscribe(200, 420)
  ]);

  reactiveAssert(t, e1.subscriptions, [
    subscribe(200, 420)
  ]);

  reactiveAssert(t, e2.subscriptions, [
    subscribe(200, 420)
  ]);

  t.end();
});

test('zip never never', function (t) {
  var scheduler = new TestScheduler();

  var o1 = Observable.never();
  var o2 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return o1.zip(o2, add);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('zip never empty', function (t) {
  var scheduler = new TestScheduler();

  var o1 = Observable.never();
  var o2 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(210)
  );

  var results = scheduler.startScheduler(function () {
    return o1.zip(o2, add);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('zip empty empty', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(210)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(210)
  );

  var results = scheduler.startScheduler(function () {
    return e1.zip(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(210)
  ]);

  t.end();
});

test('zip empty non-empty', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(210)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(220)
  );

  var results = scheduler.startScheduler(function () {
    return e1.zip(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(215)
  ]);

  t.end();
});

test('zip non-empty empty', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(210)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(220)
  );

  var results = scheduler.startScheduler(function () {
    return e2.zip(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(215)
  ]);

  t.end();
});

test('zip never non-empty', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(220)
  );

  var e2 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return e2.zip(e1, add);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('zip non-empty never', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(220)
  );

  var e2 = Observable.never();

  var results = scheduler.startScheduler(function () {
    return e1.zip(e2, add);
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('zip non-empty non-empty', function (t) {
  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 3),
    onCompleted(240)
  );

  var results = scheduler.startScheduler(function () {
    return e1.zip(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 2 + 3),
    onCompleted(240)
  ]);

  t.end();
});

test('zip empty error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1), onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error)
  );

  var results = scheduler.startScheduler(function () {
    return e1.zip(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('zip error empty', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error)
  );

  var results = scheduler.startScheduler(function () {
    return e2.zip(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('zip never error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = Observable.never();
  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error)
  );

  var results = scheduler.startScheduler(function () {
    return e1.zip(e2, add);
  });

  reactiveAssert(t, results.messages, [onError(220, error)]);

  t.end();
});

test('zip error never', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = Observable.never();
  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error)
  );

  var results = scheduler.startScheduler(function () {
      return e2.zip(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('zip error error', function (t) {
  var error1 = new Error();
  var error2 = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(230, error1)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error2)
  );

  var results = scheduler.startScheduler(function () {
    return e2.zip(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error2)
  ]);

  t.end();
});

test('zip some error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error)
  );

  var results = scheduler.startScheduler(function () {
    return e1.zip(e2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('zip error some', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(230)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error)
  );

  var results = scheduler.startScheduler(function () {
    return e2.zip(e1, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  t.end();
});

test('zip some data asymmetric 1', function (t) {
  var i;
  var scheduler = new TestScheduler();

  var msgs1 = (function () {
    var results = [];
    for (i = 0; i < 5; i++) {
      results.push(onNext(205 + i * 5, i));
    }
    return results;
  })();

  var msgs2 = (function () {
    var results = [];
    for (i = 0; i < 10; i++) {
      results.push(onNext(205 + i * 8, i));
    }
    return results;
  })();

  var len = Math.min(msgs1.length, msgs2.length);

  var e1 = scheduler.createHotObservable(msgs1);
  var e2 = scheduler.createHotObservable(msgs2);

  var results = scheduler.startScheduler(function () {
    return e1.zip(e2, add);
  }).messages;

  t.equal(len, results.length);

  for (i = 0; i < len; i++) {
    var sum = msgs1[i].value.value + msgs2[i].value.value;
    var time = Math.max(msgs1[i].time, msgs2[i].time);
    t.ok(results[i].value.kind === 'N' && results[i].time === time && results[i].value.value === sum);
  }

  t.end();
});

test('zip some data asymmetric 2', function (t) {
  var i;
  var scheduler = new TestScheduler();

  var msgs1 = (function () {
    var results = [];
    for (i = 0; i < 10; i++) {
      results.push(onNext(205 + i * 5, i));
    }
    return results;
  })();

  var msgs2 = (function () {
    var results = [];
    for (i = 0; i < 5; i++) {
      results.push(onNext(205 + i * 8, i));
    }
    return results;
  })();

  var len = Math.min(msgs1.length, msgs2.length);

  var e1 = scheduler.createHotObservable(msgs1);
  var e2 = scheduler.createHotObservable(msgs2);

  var results = scheduler.startScheduler(function () {
    return e1.zip(e2, add);
  }).messages;

  t.equal(len, results.length);

  for (i = 0; i < len; i++) {
    var sum = msgs1[i].value.value + msgs2[i].value.value;
    var time = Math.max(msgs1[i].time, msgs2[i].time);
    t.ok(results[i].value.kind === 'N' && results[i].time === time && results[i].value.value === sum);
  }

  t.end();
});

test('zip some data symmetric', function (t) {
  var i;

  var scheduler = new TestScheduler();

  var msgs1 = (function () {
    var results = [];
    for (i = 0; i < 10; i++) {
      results.push(onNext(205 + i * 5, i));
    }
    return results;
  })();

  var msgs2 = (function () {
    var results = [];
    for (i = 0; i < 10; i++) {
      results.push(onNext(205 + i * 8, i));
    }
    return results;
  })();

  var len = Math.min(msgs1.length, msgs2.length);

  var e1 = scheduler.createHotObservable(msgs1);
  var e2 = scheduler.createHotObservable(msgs2);

  var results = scheduler.startScheduler(function () {
    return e1.zip(e2, add);
  }).messages;

  t.equal(len, results.length);

  for (i = 0; i < len; i++) {
    var sum = msgs1[i].value.value + msgs2[i].value.value;
    var time = Math.max(msgs1[i].time, msgs2[i].time);
    t.ok(results[i].value.kind === 'N' && results[i].time === time && results[i].value.value === sum);
  }

  t.end();
});

test('zip selector throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var e1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onNext(225, 4),
    onCompleted(240)
  );

  var e2 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(220, 3),
    onNext(230, 5),
    onCompleted(250)
  );

  var results = scheduler.startScheduler(function () {
    return e1.zip(e2, function (x, y) {
      if (y === 5) {
        throw error;
      } else {
        return x + y;
      }
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 2 + 3),
    onError(230, error)
  ]);

  t.end();
});

test('zip right completes first', function (t) {
  var scheduler = new TestScheduler();

  var o = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 4),
    onCompleted(225)
  );

  var e = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onCompleted(220)
  );

  var results = scheduler.startScheduler(function () {
    return o.zip(e, add);
  });

  reactiveAssert(t, results.messages, [
    onNext(215, 6),
    onCompleted(225)
  ]);

  reactiveAssert(t, o.subscriptions, [
    subscribe(200, 225)
  ]);

  reactiveAssert(t, e.subscriptions, [
    subscribe(200, 225)
  ]);

  t.end();
});

test('zip with iterable never empty', function (t) {
  var scheduler = new TestScheduler();

  var n1 = scheduler.createHotObservable(
    onNext(150, 1)
  );

  var n2 = [];

  var results = scheduler.startScheduler(function () {
    return n1.zipIterable(n2, add);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, n1.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('zip with iterable empty empty', function (t) {
  var scheduler = new TestScheduler();

  var n1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(210)
  );
  var n2 = [];

  var results = scheduler.startScheduler(function () {
    return n1.zipIterable(n2, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(210)
  ]);

  reactiveAssert(t, n1.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('zip with iterable empty non-empty', function (t) {
  var scheduler = new TestScheduler();

  var n1 = scheduler.createHotObservable(
    onNext(150, 1),
    onCompleted(210)
  );

  var n2 = [2];

  var results = scheduler.startScheduler(function () {
    return n1.zipIterable(n2, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(210)
  ]);

  reactiveAssert(t, n1.subscriptions, [
    subscribe(200, 210)
  ]);

  t.end();
});

test('zip with iterable non-empty empty', function (t) {
  var scheduler = new TestScheduler();

  var n1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(220)
  );
  var n2 = [];

  var results = scheduler.startScheduler(function () {
    return n1.zipIterable(n2, add);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(215)
  ]);

  reactiveAssert(t, n1.subscriptions, [
    subscribe(200, 215)
  ]);

  t.end();
});

test('zip with iterable never non-empty', function (t) {
  var scheduler = new TestScheduler();

  var n1 = scheduler.createHotObservable(
    onNext(150, 1)
  );
  var n2 = [2];

  var results = scheduler.startScheduler(function () {
    return n1.zipIterable(n2, add);
  });

  reactiveAssert(t, results.messages, []);

  reactiveAssert(t, n1.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('zip with iterable non-empty non-empty', function (t) {
  var scheduler = new TestScheduler();

  var n1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onCompleted(230)
  );

  var n2 = [3];

  var results = scheduler.startScheduler(function () {
    return n1.zipIterable(n2, add);
  });

  reactiveAssert(t, results.messages, [
    onNext(215, 2 + 3),
    onCompleted(230)
  ]);

  reactiveAssert(t, n1.subscriptions, [
    subscribe(200, 230)
  ]);

  t.end();
});

test('zip with iterable error empty', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var n1 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error)
  );
  var n2 = [];

  var results = scheduler.startScheduler(function () {
    return n1.zipIterable(n2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  reactiveAssert(t, n1.subscriptions, [
    subscribe(200, 220)
  ]);

  t.end();
});

test('zip with iterable error some', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var n1 = scheduler.createHotObservable(
    onNext(150, 1),
    onError(220, error)
  );

  var n2 = [2];

  var results = scheduler.startScheduler(function () {
    return n1.zipIterable(n2, add);
  });

  reactiveAssert(t, results.messages, [
    onError(220, error)
  ]);

  reactiveAssert(t, n1.subscriptions, [
    subscribe(200, 220)
  ]);

  t.end();
});

test('zip with iterable some data both sides', function (t) {
  var scheduler = new TestScheduler();

  var n1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(220, 3),
    onNext(230, 4),
    onNext(240, 5)
  );

  var n2 = [5, 4, 3, 2];

  var results = scheduler.startScheduler(function () {
    return n1.zipIterable(n2, add);
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 7),
    onNext(220, 7),
    onNext(230, 7),
    onNext(240, 7)
  ]);

  reactiveAssert(t, n1.subscriptions, [
    subscribe(200, 1000)
  ]);

  t.end();
});

test('zip with iterable selector throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var n1 = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(215, 2),
    onNext(225, 4),
    onCompleted(240)
  );

  var n2 = [3, 5];

  var results = scheduler.startScheduler(function () {
    return n1.zipIterable(n2, function (x, y) {
      if (y === 5) { throw error; }
      return x + y;
    });
  });

  reactiveAssert(t, results.messages, [
    onNext(215, 2 + 3),
    onError(225, error)
  ]);

  reactiveAssert(t, n1.subscriptions, [
    subscribe(200, 225)
  ]);

  t.end();
});
