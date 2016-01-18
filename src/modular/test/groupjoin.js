'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted,
  subscribe = ReactiveTest.subscribe;

Observable.addToPrototype({
  groupJoin: require('../observable/groupjoin'),
  map: require('../observable/map'),
  mergeAll: require('../observable/mergeall')
});

function TimeInterval(value, interval) {
  this.value = value;
  this.interval = interval;
}

function newTimer(l, t, scheduler) {
  var timer = scheduler.createColdObservable(onNext(t, 0), onCompleted(t));
  l.push(timer);
  return timer;
}

test('groupJoin normal I', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, new TimeInterval(0, 10)),
    onNext(219, new TimeInterval(1, 5)),
    onNext(240, new TimeInterval(2, 10)),
    onNext(300, new TimeInterval(3, 100)),
    onNext(310, new TimeInterval(4, 80)),
    onNext(500, new TimeInterval(5, 90)),
    onNext(700, new TimeInterval(6, 25)),
    onNext(710, new TimeInterval(7, 280)),
    onNext(720, new TimeInterval(8, 100)),
    onNext(830, new TimeInterval(9, 10)),
    onCompleted(900)
  );

  var ys = scheduler.createHotObservable(
    onNext(215, new TimeInterval('hat', 20)),
    onNext(217, new TimeInterval('bat', 1)),
    onNext(290, new TimeInterval('wag', 200)),
    onNext(300, new TimeInterval('pig', 10)),
    onNext(305, new TimeInterval('cup', 50)),
    onNext(600, new TimeInterval('yak', 90)),
    onNext(702, new TimeInterval('tin', 20)),
    onNext(712, new TimeInterval('man', 10)),
    onNext(722, new TimeInterval('rat', 200)),
    onNext(732, new TimeInterval('wig', 5)),
    onCompleted(800)
  );

  var xsd = [];
  var ysd = [];

  var results = scheduler.startScheduler(function (){
    return xs.groupJoin(
      ys,
      function (x) { return newTimer(xsd, x.interval, scheduler); },
      function (y) { return newTimer(ysd, y.interval, scheduler); },
      function (x, yy) { return yy.map(function (y) { return x.value + y.value; }); })
    .mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(215, '0hat'),
    onNext(217, '0bat'),
    onNext(219, '1hat'),
    onNext(300, '3wag'),
    onNext(300, '3pig'),
    onNext(305, '3cup'),
    onNext(310, '4wag'),
    onNext(310, '4pig'),
    onNext(310, '4cup'),
    onNext(702, '6tin'),
    onNext(710, '7tin'),
    onNext(712, '6man'),
    onNext(712, '7man'),
    onNext(720, '8tin'),
    onNext(720, '8man'),
    onNext(722, '6rat'),
    onNext(722, '7rat'),
    onNext(722, '8rat'),
    onNext(732, '7wig'),
    onNext(732, '8wig'),
    onNext(830, '9rat'),
    onCompleted(990)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 990)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 990)
  ]);

  t.end();
});

test('groupJoin normal II', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, new TimeInterval(0, 10)),
    onNext(219, new TimeInterval(1, 5)),
    onNext(240, new TimeInterval(2, 10)),
    onNext(300, new TimeInterval(3, 100)),
    onNext(310, new TimeInterval(4, 80)),
    onNext(500, new TimeInterval(5, 90)),
    onNext(700, new TimeInterval(6, 25)),
    onNext(710, new TimeInterval(7, 200)),
    onNext(720, new TimeInterval(8, 100)),
    onCompleted(721)
  );

  var ys = scheduler.createHotObservable(
    onNext(215, new TimeInterval('hat', (20))),
    onNext(217, new TimeInterval('bat', (1))),
    onNext(290, new TimeInterval('wag', (200))),
    onNext(300, new TimeInterval('pig', (10))),
    onNext(305, new TimeInterval('cup', (50))),
    onNext(600, new TimeInterval('yak', (90))),
    onNext(702, new TimeInterval('tin', (20))),
    onNext(712, new TimeInterval('man', (10))),
    onNext(722, new TimeInterval('rat', (200))),
    onNext(732, new TimeInterval('wig', (5))),
    onCompleted(990)
  );

  var xsd = [];
  var ysd = [];

  var results = scheduler.startScheduler(function (){
    return xs.groupJoin(
      ys,
      function (x) { return newTimer(xsd, x.interval, scheduler); },
      function (y) { return newTimer(ysd, y.interval, scheduler); },
      function (x, yy) { return yy.map(function (y) { return x.value + y.value; }); })
    .mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(215, '0hat'),
    onNext(217, '0bat'),
    onNext(219, '1hat'),
    onNext(300, '3wag'),
    onNext(300, '3pig'),
    onNext(305, '3cup'),
    onNext(310, '4wag'),
    onNext(310, '4pig'),
    onNext(310, '4cup'),
    onNext(702, '6tin'),
    onNext(710, '7tin'),
    onNext(712, '6man'),
    onNext(712, '7man'),
    onNext(720, '8tin'),
    onNext(720, '8man'),
    onNext(722, '6rat'),
    onNext(722, '7rat'),
    onNext(722, '8rat'),
    onNext(732, '7wig'),
    onNext(732, '8wig'),
    onCompleted(910)
  ]);

  reactiveAssert(t, xs.subscriptions, [
    subscribe(200, 910)
  ]);

  reactiveAssert(t, ys.subscriptions, [
    subscribe(200, 910)
  ]);

  t.end();
});

test('groupJoin normal III', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, new TimeInterval(0, 10)),
    onNext(219, new TimeInterval(1, 5)),
    onNext(240, new TimeInterval(2, 10)),
    onNext(300, new TimeInterval(3, 100)),
    onNext(310, new TimeInterval(4, 80)),
    onNext(500, new TimeInterval(5, 90)),
    onNext(700, new TimeInterval(6, 25)),
    onNext(710, new TimeInterval(7, 280)),
    onNext(720, new TimeInterval(8, 100)),
    onNext(830, new TimeInterval(9, 10)),
    onCompleted(900));

  var ys = scheduler.createHotObservable(
    onNext(215, new TimeInterval('hat', 20)),
    onNext(217, new TimeInterval('bat', 1)),
    onNext(290, new TimeInterval('wag', 200)),
    onNext(300, new TimeInterval('pig', 10)),
    onNext(305, new TimeInterval('cup', 50)),
    onNext(600, new TimeInterval('yak', 90)),
    onNext(702, new TimeInterval('tin', 20)),
    onNext(712, new TimeInterval('man', 10)),
    onNext(722, new TimeInterval('rat', 200)),
    onNext(732, new TimeInterval('wig', 5)),
    onCompleted(800));

  var results = scheduler.startScheduler(function () {
    return xs.groupJoin(ys, function (x) {
      return Observable.timer(x.interval, null, scheduler).filter(function () { return false; });
    }, function (y) {
      return Observable.timer(y.interval, null, scheduler).filter(function () { return false; });
    }, function (x, yy) {
      return yy.map(function (y) { return x.value + y.value; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(215, '0hat'),
    onNext(217, '0bat'),
    onNext(219, '1hat'),
    onNext(300, '3wag'),
    onNext(300, '3pig'),
    onNext(305, '3cup'),
    onNext(310, '4wag'),
    onNext(310, '4pig'),
    onNext(310, '4cup'),
    onNext(702, '6tin'),
    onNext(710, '7tin'),
    onNext(712, '6man'),
    onNext(712, '7man'),
    onNext(720, '8tin'),
    onNext(720, '8man'),
    onNext(722, '6rat'),
    onNext(722, '7rat'),
    onNext(722, '8rat'),
    onNext(732, '7wig'),
    onNext(732, '8wig'),
    onNext(830, '9rat'),
    onCompleted(990)
  ]);

  t.end();
});

test('groupJoin normal IV', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, new TimeInterval(0, 10)),
    onNext(219, new TimeInterval(1, 5)),
    onNext(240, new TimeInterval(2, 10)),
    onNext(300, new TimeInterval(3, 100)),
    onNext(310, new TimeInterval(4, 80)),
    onNext(500, new TimeInterval(5, 90)),
    onNext(700, new TimeInterval(6, 25)),
    onNext(710, new TimeInterval(7, 200)),
    onNext(720, new TimeInterval(8, 100)),
    onCompleted(990));

  var ys = scheduler.createHotObservable(
    onNext(215, new TimeInterval('hat', 20)),
    onNext(217, new TimeInterval('bat', 1)),
    onNext(290, new TimeInterval('wag', 200)),
    onNext(300, new TimeInterval('pig', 10)),
    onNext(305, new TimeInterval('cup', 50)),
    onNext(600, new TimeInterval('yak', 90)),
    onNext(702, new TimeInterval('tin', 20)),
    onNext(712, new TimeInterval('man', 10)),
    onNext(722, new TimeInterval('rat', 200)),
    onNext(732, new TimeInterval('wig', 5)),
    onCompleted(980));

  var results = scheduler.startScheduler(function () {
    return xs.groupJoin(ys, function (x) {
      return Observable.timer(x.interval, null, scheduler);
    }, function (y) {
      return Observable.timer(y.interval, null, scheduler);
    }, function (x, yy) {
      return yy.map(function (y) { return x.value + y.value; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(215, '0hat'),
    onNext(217, '0bat'),
    onNext(219, '1hat'),
    onNext(300, '3wag'),
    onNext(300, '3pig'),
    onNext(305, '3cup'),
    onNext(310, '4wag'),
    onNext(310, '4pig'),
    onNext(310, '4cup'),
    onNext(702, '6tin'),
    onNext(710, '7tin'),
    onNext(712, '6man'),
    onNext(712, '7man'),
    onNext(720, '8tin'),
    onNext(720, '8man'),
    onNext(722, '6rat'),
    onNext(722, '7rat'),
    onNext(722, '8rat'),
    onNext(732, '7wig'),
    onNext(732, '8wig'),
    onCompleted(990)
  ]);

  t.end();
});

test('groupJoin normal V', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, new TimeInterval(0, 10)),
    onNext(219, new TimeInterval(1, 5)),
    onNext(240, new TimeInterval(2, 10)),
    onNext(300, new TimeInterval(3, 100)),
    onNext(310, new TimeInterval(4, 80)),
    onNext(500, new TimeInterval(5, 90)),
    onNext(700, new TimeInterval(6, 25)),
    onNext(710, new TimeInterval(7, 200)),
    onNext(720, new TimeInterval(8, 100)),
    onCompleted(990));

  var ys = scheduler.createHotObservable(
    onNext(215, new TimeInterval('hat', 20)),
    onNext(217, new TimeInterval('bat', 1)),
    onNext(290, new TimeInterval('wag', 200)),
    onNext(300, new TimeInterval('pig', 10)),
    onNext(305, new TimeInterval('cup', 50)),
    onNext(600, new TimeInterval('yak', 90)),
    onNext(702, new TimeInterval('tin', 20)),
    onNext(712, new TimeInterval('man', 10)),
    onNext(722, new TimeInterval('rat', 200)),
    onNext(732, new TimeInterval('wig', 5)),
    onCompleted(900));

  var results = scheduler.startScheduler(function () {
    return xs.groupJoin(ys, function (x) {
      return Observable.timer(x.interval, null, scheduler);
    }, function (y) {
      return Observable.timer(y.interval, null, scheduler);
    }, function (x, yy) {
      return yy.map(function (y) { return x.value + y.value; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(215, '0hat'),
    onNext(217, '0bat'),
    onNext(219, '1hat'),
    onNext(300, '3wag'),
    onNext(300, '3pig'),
    onNext(305, '3cup'),
    onNext(310, '4wag'),
    onNext(310, '4pig'),
    onNext(310, '4cup'),
    onNext(702, '6tin'),
    onNext(710, '7tin'),
    onNext(712, '6man'),
    onNext(712, '7man'),
    onNext(720, '8tin'),
    onNext(720, '8man'),
    onNext(722, '6rat'),
    onNext(722, '7rat'),
    onNext(722, '8rat'),
    onNext(732, '7wig'),
    onNext(732, '8wig'),
    onCompleted(990)
  ]);

  t.end();
});

test('groupJoin normal VI', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, new TimeInterval(0, 10)),
    onNext(219, new TimeInterval(1, 5)),
    onNext(240, new TimeInterval(2, 10)),
    onNext(300, new TimeInterval(3, 100)),
    onNext(310, new TimeInterval(4, 80)),
    onNext(500, new TimeInterval(5, 90)),
    onNext(700, new TimeInterval(6, 25)),
    onNext(710, new TimeInterval(7, 30)),
    onNext(720, new TimeInterval(8, 200)),
    onNext(830, new TimeInterval(9, 10)),
    onCompleted(850));

  var ys = scheduler.createHotObservable(
    onNext(215, new TimeInterval('hat', 20)),
    onNext(217, new TimeInterval('bat', 1)),
    onNext(290, new TimeInterval('wag', 200)),
    onNext(300, new TimeInterval('pig', 10)),
    onNext(305, new TimeInterval('cup', 50)),
    onNext(600, new TimeInterval('yak', 90)),
    onNext(702, new TimeInterval('tin', 20)),
    onNext(712, new TimeInterval('man', 10)),
    onNext(722, new TimeInterval('rat', 20)),
    onNext(732, new TimeInterval('wig', 5)),
    onCompleted(900));

  var results = scheduler.startScheduler(function () {
    return xs.groupJoin(ys, function (x) {
      return Observable.timer(x.interval, null, scheduler);
    }, function (y) {
      return Observable.timer(y.interval, null, scheduler);
    }, function (x, yy) {
      return yy.map(function (y) { return x.value + y.value; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(215, '0hat'),
    onNext(217, '0bat'),
    onNext(219, '1hat'),
    onNext(300, '3wag'),
    onNext(300, '3pig'),
    onNext(305, '3cup'),
    onNext(310, '4wag'),
    onNext(310, '4pig'),
    onNext(310, '4cup'),
    onNext(702, '6tin'),
    onNext(710, '7tin'),
    onNext(712, '6man'),
    onNext(712, '7man'),
    onNext(720, '8tin'),
    onNext(720, '8man'),
    onNext(722, '6rat'),
    onNext(722, '7rat'),
    onNext(722, '8rat'),
    onNext(732, '7wig'),
    onNext(732, '8wig'),
    onCompleted(920)
  ]);

  t.end();
});

test('groupJoin normal VII', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onCompleted(210));

  var ys = scheduler.createHotObservable(
    onNext(215, new TimeInterval('hat', 20)),
    onNext(217, new TimeInterval('bat', 1)),
    onNext(290, new TimeInterval('wag', 200)),
    onNext(300, new TimeInterval('pig', 10)),
    onNext(305, new TimeInterval('cup', 50)),
    onNext(600, new TimeInterval('yak', 90)),
    onNext(702, new TimeInterval('tin', 20)),
    onNext(712, new TimeInterval('man', 10)),
    onNext(722, new TimeInterval('rat', 20)),
    onNext(732, new TimeInterval('wig', 5)),
    onCompleted(900)
  );

  var results = scheduler.startScheduler(function () {
    return xs.groupJoin(ys, function (x) {
      return Observable.timer(x.interval, null, scheduler);
    }, function (y) {
      return Observable.timer(y.interval, null, scheduler);
    }, function (x, yy) {
      return yy.map(function (y) { return x.value + y.value; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onCompleted(210)
  ]);

  t.end();
});

test('groupJoin normal VIII', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, new TimeInterval(0, 200))
  );

  var ys = scheduler.createHotObservable(
    onNext(220, new TimeInterval('hat', 100)),
    onCompleted(230)
  );

  var results = scheduler.startScheduler(function () {
    return xs.groupJoin(ys, function (x) {
      return Observable.timer(x.interval, null, scheduler);
    }, function (y) {
      return Observable.timer(y.interval, null, scheduler);
    }, function (x, yy) {
      return yy.map(function (y) { return x.value + y.value; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(220, '0hat')
  ]);

  t.end();
});

test('groupJoin normal IX', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, new TimeInterval(0, 10)),
    onNext(219, new TimeInterval(1, 5)),
    onNext(240, new TimeInterval(2, 10)),
    onNext(300, new TimeInterval(3, 100)),
    onNext(310, new TimeInterval(4, 80)),
    onNext(500, new TimeInterval(5, 90)),
    onNext(700, new TimeInterval(6, 25)),
    onNext(710, new TimeInterval(7, 300)),
    onNext(720, new TimeInterval(8, 100)),
    onNext(830, new TimeInterval(9, 10)),
    onCompleted(900));

  var ys = scheduler.createHotObservable(
    onNext(215, new TimeInterval('hat', 20)),
    onNext(217, new TimeInterval('bat', 1)),
    onNext(290, new TimeInterval('wag', 200)),
    onNext(300, new TimeInterval('pig', 10)),
    onNext(305, new TimeInterval('cup', 50)),
    onNext(600, new TimeInterval('yak', 90)),
    onNext(702, new TimeInterval('tin', 20)),
    onNext(712, new TimeInterval('man', 10)),
    onNext(722, new TimeInterval('rat', 200)),
    onNext(732, new TimeInterval('wig', 5)),
    onCompleted(800)
  );

  var results = scheduler.startScheduler(function () {
    return xs.groupJoin(ys, function (x) {
      return Observable.timer(x.interval, null, scheduler);
    }, function (y) {
      return Observable.timer(y.interval, null, scheduler);
    }, function (x, yy) {
      return yy.map(function (y) { return x.value + y.value; });
    }).mergeAll();
  }, { disposed: 713 });

  reactiveAssert(t, results.messages, [
    onNext(215, '0hat'),
    onNext(217, '0bat'),
    onNext(219, '1hat'),
    onNext(300, '3wag'),
    onNext(300, '3pig'),
    onNext(305, '3cup'),
    onNext(310, '4wag'),
    onNext(310, '4pig'),
    onNext(310, '4cup'),
    onNext(702, '6tin'),
    onNext(710, '7tin'),
    onNext(712, '6man'),
    onNext(712, '7man')
  ]);

  t.end();
});

test('groupJoin Error I', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, new TimeInterval(0, 10)),
    onNext(219, new TimeInterval(1, 5)),
    onNext(240, new TimeInterval(2, 10)),
    onNext(300, new TimeInterval(3, 100)),
    onError(310, error)
  );

  var ys = scheduler.createHotObservable(
    onNext(215, new TimeInterval('hat', 20)),
    onNext(217, new TimeInterval('bat', 1)),
    onNext(290, new TimeInterval('wag', 200)),
    onNext(300, new TimeInterval('pig', 10)),
    onNext(305, new TimeInterval('cup', 50)),
    onNext(600, new TimeInterval('yak', 90)),
    onNext(702, new TimeInterval('tin', 20)),
    onNext(712, new TimeInterval('man', 10)),
    onNext(722, new TimeInterval('rat', 200)),
    onNext(732, new TimeInterval('wig', 5)),
    onCompleted(800)
  );

  var results = scheduler.startScheduler(function () {
    return xs.groupJoin(ys, function (x) {
      return Observable.timer(x.interval, null, scheduler);
    }, function (y) {
      return Observable.timer(y.interval, null, scheduler);
    }, function (x, yy) {
      return yy.map(function (y) { return x.value + y.value; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(215, '0hat'),
    onNext(217, '0bat'),
    onNext(219, '1hat'),
    onNext(300, '3wag'),
    onNext(300, '3pig'),
    onNext(305, '3cup'),
    onError(310, error)
  ]);

  t.end();
});

test('groupJoin Error II', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, new TimeInterval(0, 10)),
    onNext(219, new TimeInterval(1, 5)),
    onNext(240, new TimeInterval(2, 10)),
    onNext(300, new TimeInterval(3, 100)),
    onNext(310, new TimeInterval(4, 80)),
    onNext(500, new TimeInterval(5, 90)),
    onNext(700, new TimeInterval(6, 25)),
    onNext(710, new TimeInterval(7, 300)),
    onNext(720, new TimeInterval(8, 100)),
    onNext(830, new TimeInterval(9, 10)),
    onCompleted(900)
  );

  var ys = scheduler.createHotObservable(
    onNext(215, new TimeInterval('hat', 20)),
    onNext(217, new TimeInterval('bat', 1)),
    onNext(290, new TimeInterval('wag', 200)),
    onNext(300, new TimeInterval('pig', 10)),
    onNext(305, new TimeInterval('cup', 50)),
    onNext(600, new TimeInterval('yak', 90)),
    onNext(702, new TimeInterval('tin', 20)),
    onNext(712, new TimeInterval('man', 10)),
    onError(722, error)
  );

  var results = scheduler.startScheduler(function () {
    return xs.groupJoin(ys, function (x) {
      return Observable.timer(x.interval, null, scheduler);
    }, function (y) {
      return Observable.timer(y.interval, null, scheduler);
    }, function (x, yy) {
      return yy.map(function (y) { return x.value + y.value; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(215, '0hat'),
    onNext(217, '0bat'),
    onNext(219, '1hat'),
    onNext(300, '3wag'),
    onNext(300, '3pig'),
    onNext(305, '3cup'),
    onNext(310, '4wag'),
    onNext(310, '4pig'),
    onNext(310, '4cup'),
    onNext(702, '6tin'),
    onNext(710, '7tin'),
    onNext(712, '6man'),
    onNext(712, '7man'),
    onNext(720, '8tin'),
    onNext(720, '8man'),
    onError(722, error)
  ]);

  t.end();
});

test('groupJoin Error III', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, new TimeInterval(0, 10)),
    onNext(219, new TimeInterval(1, 5)),
    onNext(240, new TimeInterval(2, 10)),
    onNext(300, new TimeInterval(3, 100)),
    onNext(310, new TimeInterval(4, 80)),
    onNext(500, new TimeInterval(5, 90)),
    onNext(700, new TimeInterval(6, 25)),
    onNext(710, new TimeInterval(7, 300)),
    onNext(720, new TimeInterval(8, 100)),
    onNext(830, new TimeInterval(9, 10)),
    onCompleted(900));

  var ys = scheduler.createHotObservable(
    onNext(215, new TimeInterval('hat', 20)),
    onNext(217, new TimeInterval('bat', 1)),
    onNext(290, new TimeInterval('wag', 200)),
    onNext(300, new TimeInterval('pig', 10)),
    onNext(305, new TimeInterval('cup', 50)),
    onNext(600, new TimeInterval('yak', 90)),
    onNext(702, new TimeInterval('tin', 20)),
    onNext(712, new TimeInterval('man', 10)),
    onNext(722, new TimeInterval('rat', 200)),
    onNext(732, new TimeInterval('wig', 5)),
    onCompleted(800));

  var results = scheduler.startScheduler(function () {
    return xs.groupJoin(ys, function (x) {
      return Observable.timer(x.interval, null, scheduler).flatMap(x.value === 6 ? Observable['throw'](error) : Observable.empty());
    }, function (y) {
      return Observable.timer(y.interval, null, scheduler);
    }, function (x, yy) {
      return yy.map(function (y) { return x.value + y.value; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(215, '0hat'),
    onNext(217, '0bat'),
    onNext(219, '1hat'),
    onNext(300, '3wag'),
    onNext(300, '3pig'),
    onNext(305, '3cup'),
    onNext(310, '4wag'),
    onNext(310, '4pig'),
    onNext(310, '4cup'),
    onNext(702, '6tin'),
    onNext(710, '7tin'),
    onNext(712, '6man'),
    onNext(712, '7man'),
    onNext(720, '8tin'),
    onNext(720, '8man'),
    onNext(722, '6rat'),
    onNext(722, '7rat'),
    onNext(722, '8rat'),
    onError(725, error)
  ]);

  t.end();
});

test('groupJoin Error IV', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, new TimeInterval(0, 10)),
    onNext(219, new TimeInterval(1, 5)),
    onNext(240, new TimeInterval(2, 10)),
    onNext(300, new TimeInterval(3, 100)),
    onNext(310, new TimeInterval(4, 80)),
    onNext(500, new TimeInterval(5, 90)),
    onNext(700, new TimeInterval(6, 25)),
    onNext(710, new TimeInterval(7, 300)),
    onNext(720, new TimeInterval(8, 100)),
    onNext(830, new TimeInterval(9, 10)),
    onCompleted(900)
  );

  var ys = scheduler.createHotObservable(
    onNext(215, new TimeInterval('hat', 20)),
    onNext(217, new TimeInterval('bat', 1)),
    onNext(290, new TimeInterval('wag', 200)),
    onNext(300, new TimeInterval('pig', 10)),
    onNext(305, new TimeInterval('cup', 50)),
    onNext(600, new TimeInterval('yak', 90)),
    onNext(702, new TimeInterval('tin', 19)),
    onNext(712, new TimeInterval('man', 10)),
    onNext(722, new TimeInterval('rat', 200)),
    onNext(732, new TimeInterval('wig', 5)),
    onCompleted(800)
  );

  var results = scheduler.startScheduler(function () {
    return xs.groupJoin(ys, function (x) {
      return Observable.timer(x.interval, null, scheduler);
    }, function (y) {
      return Observable.timer(y.interval, null, scheduler).flatMap(y.value === 'tin' ? Observable['throw'](error) : Observable.empty());
    }, function (x, yy) {
      return yy.map(function (y) { return x.value + y.value; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onNext(215, '0hat'),
    onNext(217, '0bat'),
    onNext(219, '1hat'),
    onNext(300, '3wag'),
    onNext(300, '3pig'),
    onNext(305, '3cup'),
    onNext(310, '4wag'),
    onNext(310, '4pig'),
    onNext(310, '4cup'),
    onNext(702, '6tin'),
    onNext(710, '7tin'),
    onNext(712, '6man'),
    onNext(712, '7man'),
    onNext(720, '8tin'),
    onNext(720, '8man'),
    onError(721, error)
  ]);

  t.end();
});

test('groupJoin Error V', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, new TimeInterval(0, 10)),
    onNext(219, new TimeInterval(1, 5)),
    onNext(240, new TimeInterval(2, 10)),
    onNext(300, new TimeInterval(3, 100)),
    onNext(310, new TimeInterval(4, 80)),
    onNext(500, new TimeInterval(5, 90)),
    onNext(700, new TimeInterval(6, 25)),
    onNext(710, new TimeInterval(7, 300)),
    onNext(720, new TimeInterval(8, 100)),
    onNext(830, new TimeInterval(9, 10)),
    onCompleted(900)
  );

  var ys = scheduler.createHotObservable(
    onNext(215, new TimeInterval('hat', 20)),
    onNext(217, new TimeInterval('bat', 1)),
    onNext(290, new TimeInterval('wag', 200)),
    onNext(300, new TimeInterval('pig', 10)),
    onNext(305, new TimeInterval('cup', 50)),
    onNext(600, new TimeInterval('yak', 90)),
    onNext(702, new TimeInterval('tin', 20)),
    onNext(712, new TimeInterval('man', 10)),
    onNext(722, new TimeInterval('rat', 200)),
    onNext(732, new TimeInterval('wig', 5)),
    onCompleted(800)
  );

  var results = scheduler.startScheduler(function () {
    return xs.groupJoin(ys, function (x) {
      if (x.value >= 0) { throw error; }
      return Observable.empty();
    }, function (y) {
      return Observable.timer(y.interval, null, scheduler);
    }, function (x, yy) {
      return yy.map(function (y) { return x.value + y.value; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('groupJoin Error VI', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, new TimeInterval(0, 10)),
    onNext(219, new TimeInterval(1, 5)),
    onNext(240, new TimeInterval(2, 10)),
    onNext(300, new TimeInterval(3, 100)),
    onNext(310, new TimeInterval(4, 80)),
    onNext(500, new TimeInterval(5, 90)),
    onNext(700, new TimeInterval(6, 25)),
    onNext(710, new TimeInterval(7, 300)),
    onNext(720, new TimeInterval(8, 100)),
    onNext(830, new TimeInterval(9, 10)),
    onCompleted(900)
  );

  var ys = scheduler.createHotObservable(
    onNext(215, new TimeInterval('hat', 20)),
    onNext(217, new TimeInterval('bat', 1)),
    onNext(290, new TimeInterval('wag', 200)),
    onNext(300, new TimeInterval('pig', 10)),
    onNext(305, new TimeInterval('cup', 50)),
    onNext(600, new TimeInterval('yak', 90)),
    onNext(702, new TimeInterval('tin', 20)),
    onNext(712, new TimeInterval('man', 10)),
    onNext(722, new TimeInterval('rat', 200)),
    onNext(732, new TimeInterval('wig', 5)),
    onCompleted(800)
  );

  var results = scheduler.startScheduler(function () {
    return xs.groupJoin(ys, function (x) {
      return Observable.timer(x.interval, null, scheduler);
    }, function (y) {
      if (y.value.length >= 0) { throw error; }
      return Observable.empty();
    }, function (x, yy) {
      return yy.map(function (y) { return x.value + y.value; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onError(215, error)
  ]);

  t.end();
});

test('groupJoin Error VII', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(215, new TimeInterval(0, 10)),
    onNext(219, new TimeInterval(1, 5)),
    onNext(240, new TimeInterval(2, 10)),
    onNext(300, new TimeInterval(3, 100)),
    onNext(310, new TimeInterval(4, 80)),
    onNext(500, new TimeInterval(5, 90)),
    onNext(700, new TimeInterval(6, 25)),
    onNext(710, new TimeInterval(7, 300)),
    onNext(720, new TimeInterval(8, 100)),
    onNext(830, new TimeInterval(9, 10)),
    onCompleted(900)
  );

  var ys = scheduler.createHotObservable(
    onNext(210, new TimeInterval('hat', 20)),
    onNext(217, new TimeInterval('bat', 1)),
    onNext(290, new TimeInterval('wag', 200)),
    onNext(300, new TimeInterval('pig', 10)),
    onNext(305, new TimeInterval('cup', 50)),
    onNext(600, new TimeInterval('yak', 90)),
    onNext(702, new TimeInterval('tin', 20)),
    onNext(712, new TimeInterval('man', 10)),
    onNext(722, new TimeInterval('rat', 200)),
    onNext(732, new TimeInterval('wig', 5)),
    onCompleted(800)
  );

  var results = scheduler.startScheduler(function () {
    return xs.groupJoin(ys, function (x) {
      return Observable.timer(x.interval, null, scheduler);
    }, function (y) {
      return Observable.timer(y.interval, null, scheduler);
    }, function (x, yy) {
      if (x.value >= 0) { throw error; }
      return yy.map(function (y) { return x.value + y.value; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onError(215, error)
  ]);

  t.end();
});

test('groupJoin Error VIII', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, new TimeInterval(0, 10)),
    onNext(219, new TimeInterval(1, 5)),
    onNext(240, new TimeInterval(2, 10)),
    onNext(300, new TimeInterval(3, 100)),
    onNext(310, new TimeInterval(4, 80)),
    onNext(500, new TimeInterval(5, 90)),
    onNext(700, new TimeInterval(6, 25)),
    onNext(710, new TimeInterval(7, 300)),
    onNext(720, new TimeInterval(8, 100)),
    onNext(830, new TimeInterval(9, 10)),
    onCompleted(900)
  );

  var ys = scheduler.createHotObservable(
    onNext(215, new TimeInterval('hat', 20)),
    onNext(217, new TimeInterval('bat', 1)),
    onNext(290, new TimeInterval('wag', 200)),
    onNext(300, new TimeInterval('pig', 10)),
    onNext(305, new TimeInterval('cup', 50)),
    onNext(600, new TimeInterval('yak', 90)),
    onNext(702, new TimeInterval('tin', 20)),
    onNext(712, new TimeInterval('man', 10)),
    onNext(722, new TimeInterval('rat', 200)),
    onNext(732, new TimeInterval('wig', 5)),
    onCompleted(800)
  );

  var results = scheduler.startScheduler(function () {
    return xs.groupJoin(ys, function (x) {
      return Observable.timer(x.interval, null, scheduler);
    }, function (y) {
      return Observable.timer(y.interval, null, scheduler);
    }, function (x, yy) {
      if (x.value >= 0) { throw error; }
      return yy.map(function (y) { return x.value + y.value; });
    }).mergeAll();
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});
