'use strict';

var test = require('tape');
var HistoricalScheduler = require('../scheduler/historicalscheduler');
var reactiveAssert = require('../testing/reactiveassert');

function time(days) {
  var d = new Date(1979,10,31,4,30,15);
  d.setUTCDate(d.getDate() + days);
  return d.getTime();
}

function fromDays(days) {
  return 86400000 * days;
}

function Timestamped (value, timestamp) {
  this.value = value;
  this.timestamp = timestamp;
}

Timestamped.prototype.equals = function (other) {
  if (other == null) { return false; }
  return other.value === this.value && other.timestamp === this.timestamp;
};

test('HistoricalScheduler constructor', function (t) {
  var s = new HistoricalScheduler();
  
  t.equal(0, s.clock);
  t.equal(false, s.isEnabled);

  t.end();
});

test('HistoricalScheduler start and stop', function (t) {
  var s = new HistoricalScheduler();

  var list = [];

  s.scheduleAbsolute(null, time(0), function () { list.push(new Timestamped(1, s.now())); });
  s.scheduleAbsolute(null, time(1), function () { list.push(new Timestamped(2, s.now())); });
  s.scheduleAbsolute(null, time(2), function () { s.stop(); });
  s.scheduleAbsolute(null, time(3), function () { list.push(new Timestamped(3, s.now())); });
  s.scheduleAbsolute(null, time(4), function () { s.stop(); });
  s.scheduleAbsolute(null, time(5), function () { s.start(); });
  s.scheduleAbsolute(null, time(6), function () { list.push(new Timestamped(4, s.now())); });

  s.start();

  t.equal(time(2), s.now());
  t.equal(time(2), s.clock);

  s.start();

  t.equal(time(4), s.now());
  t.equal(time(4), s.clock);

  s.start();

  t.equal(time(6), s.now());
  t.equal(time(6), s.clock);

  s.start();

  t.equal(time(6), s.now());
  t.equal(time(6), s.clock);

  reactiveAssert(t, list, [
    new Timestamped(1, time(0)),
    new Timestamped(2, time(1)),
    new Timestamped(3, time(3)),
    new Timestamped(4, time(6))
  ]);

  t.end();
});

test('HistoricalScheduler order', function (t) {
  var s = new HistoricalScheduler();

  var list = [];

  s.scheduleAbsolute(null, time(2), function () { list.push(new Timestamped(2, s.now())); });

  s.scheduleAbsolute(null, time(3), function () { list.push(new Timestamped(3, s.now())); });

  s.scheduleAbsolute(null, time(1), function () { list.push(new Timestamped(0, s.now())); });
  s.scheduleAbsolute(null, time(1), function () { list.push(new Timestamped(1, s.now())); });

  s.start();

  reactiveAssert(t, list, [
    new Timestamped(0, time(1)),
    new Timestamped(1, time(1)),
    new Timestamped(2, time(2)),
    new Timestamped(3, time(3))
  ]);

  t.end();
});

test('HistoricalScheduler cancellation', function (t) {
  var s = new HistoricalScheduler();

  var list = [];

  var d = s.scheduleAbsolute(null, time(2), function () { list.push(new Timestamped(2, s.now())); });

  s.scheduleAbsolute(null, time(1), function () {
    list.push(new Timestamped(0, s.now()));
    d.dispose();
  });

  s.start();

  reactiveAssert(t, list, [
    new Timestamped(0, time(1))
  ]);

  t.end();
});

test('HistoricalScheduler advance to', function (t) {
  var s = new HistoricalScheduler();

  var list = [];

  s.scheduleAbsolute(null, time(0), function () { list.push(new Timestamped(0, s.now())); });
  s.scheduleAbsolute(null, time(1), function () { list.push(new Timestamped(1, s.now())); });
  s.scheduleAbsolute(null, time(2), function () { list.push(new Timestamped(2, s.now())); });
  s.scheduleAbsolute(null, time(10), function () { list.push(new Timestamped(10, s.now())); });
  s.scheduleAbsolute(null, time(11), function () { list.push(new Timestamped(11, s.now())); });

  s.advanceTo(time(8));

  t.equal(time(8), s.now());
  t.equal(time(8), s.clock);

  reactiveAssert(t, list, [
    new Timestamped(0, time(0)),
    new Timestamped(1, time(1)),
    new Timestamped(2, time(2))
  ]);

  s.advanceTo(time(8));

  t.equal(time(8), s.now());
  t.equal(time(8), s.clock);

  reactiveAssert(t, list, [
    new Timestamped(0, time(0)),
    new Timestamped(1, time(1)),
    new Timestamped(2, time(2))
  ]);

  s.scheduleAbsolute(null, time(7), function () { list.push(new Timestamped(7, s.now())); });
  s.scheduleAbsolute(null, time(8), function () { list.push(new Timestamped(8, s.now())); });

  t.equal(time(8), s.now());
  t.equal(time(8), s.clock);

  reactiveAssert(t, list, [
    new Timestamped(0, time(0)),
    new Timestamped(1, time(1)),
    new Timestamped(2, time(2))
  ]);

  s.advanceTo(time(10));

  t.equal(time(10), s.now());
  t.equal(time(10), s.clock);

  reactiveAssert(t, list, [
    new Timestamped(0, time(0)),
    new Timestamped(1, time(1)),
    new Timestamped(2, time(2)),
    new Timestamped(7, time(8)),
    new Timestamped(8, time(8)),
    new Timestamped(10, time(10))
  ]);

  s.advanceTo(time(100));

  t.equal(time(100), s.now());
  t.equal(time(100), s.clock);

  reactiveAssert(t, list, [
    new Timestamped(0, time(0)),
    new Timestamped(1, time(1)),
    new Timestamped(2, time(2)),
    new Timestamped(7, time(8)),
    new Timestamped(8, time(8)),
    new Timestamped(10, time(10)),
    new Timestamped(11, time(11))
  ]);

  t.end();
});

test('HistoricalScheduler advance by', function (t) {
  var s = new HistoricalScheduler();

  var list = [];

  s.scheduleAbsolute(null, time(0), function () { list.push(new Timestamped(0, s.now())); });
  s.scheduleAbsolute(null, time(1), function () { list.push(new Timestamped(1, s.now())); });
  s.scheduleAbsolute(null, time(2), function () { list.push(new Timestamped(2, s.now())); });
  s.scheduleAbsolute(null, time(10), function () { list.push(new Timestamped(10, s.now())); });
  s.scheduleAbsolute(null, time(11), function () { list.push(new Timestamped(11, s.now())); });

  s.advanceBy(time(8) - s.now());

  t.equal(time(8), s.now());
  t.equal(time(8), s.clock);

  reactiveAssert(t, list, [
    new Timestamped(0, time(0)),
    new Timestamped(1, time(1)),
    new Timestamped(2, time(2))
  ]);

  s.scheduleAbsolute(null, time(7), function () { list.push(new Timestamped(7, s.now())); });
  s.scheduleAbsolute(null, time(8), function () { list.push(new Timestamped(8, s.now())); });

  t.equal(time(8), s.now());
  t.equal(time(8), s.clock);

  reactiveAssert(t, list, [
    new Timestamped(0, time(0)),
    new Timestamped(1, time(1)),
    new Timestamped(2, time(2))
  ]);

  s.advanceBy(0);

  t.equal(time(8), s.now());
  t.equal(time(8), s.clock);

  reactiveAssert(t, list, [
    new Timestamped(0, time(0)),
    new Timestamped(1, time(1)),
    new Timestamped(2, time(2))
  ]);

  s.advanceBy(fromDays(2));

  t.equal(time(10), s.now());
  t.equal(time(10), s.clock);

  reactiveAssert(t, list, [
    new Timestamped(0, time(0)),
    new Timestamped(1, time(1)),
    new Timestamped(2, time(2)),
    new Timestamped(7, time(8)),
    new Timestamped(8, time(8)),
    new Timestamped(10, time(10))
  ]);

  s.advanceBy(fromDays(90));

  t.equal(time(100), s.now());
  t.equal(time(100), s.clock);

  reactiveAssert(t, list, [
    new Timestamped(0, time(0)),
    new Timestamped(1, time(1)),
    new Timestamped(2, time(2)),
    new Timestamped(7, time(8)),
    new Timestamped(8, time(8)),
    new Timestamped(10, time(10)),
    new Timestamped(11, time(11))
  ]);

  t.end();
});

test('HistoricalScheduler is enabled', function (t) {
  var s = new HistoricalScheduler();

  t.equal(false, s.isEnabled);

  s.schedule(s, function (s) {
    t.equal(true, s.isEnabled);
    s.stop();
    t.equal(false, s.isEnabled);
  });

  t.equal(false, s.isEnabled);

  s.start();

  t.equal(false, s.isEnabled);

  t.end();
});

test('HistoricalScheduler Sleep 1', function (t) {
  var now = new Date(1983, 2, 11, 12, 0, 0).getTime();

  var s = new HistoricalScheduler(now);

  s.sleep(fromDays(1));

  t.equal(now + fromDays(1), s.clock);

  t.end();
});

test('HistoricalScheduler sleep 2', function (t) {
  var s = new HistoricalScheduler();

  var n = 0;

  s.scheduleRecursiveFuture(null, new Date(s.now() + 6000), function (_, rec) {
    s.sleep(3 * 6000);
    n++;

    rec(null, new Date(s.now() + 6000));
  });

  s.advanceTo(s.now() + (5 * 6000));

  t.equal(2, n);

  t.end();
});

function reverseComparer (x, y) {
  return y - x;
}

test('HistoricalScheduler with comparer', function (t) {
  var now = new Date();

  var s = new HistoricalScheduler(now, reverseComparer);

  var list = [];

  s.scheduleAbsolute(null, now - 1000, function () { list.push(1); });
  s.scheduleAbsolute(null, now - 2000, function () { list.push(2); });

  s.start();

  reactiveAssert(t, list, [
    1,
    2
  ]);

  t.end();
});
