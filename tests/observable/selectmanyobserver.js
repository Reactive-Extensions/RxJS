QUnit.module('SelectManyObserver');

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

function throwError(err) {
  throw err;
}

test('SelectMany_Triple_Identity', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x) { return Observable.just(x, scheduler); },
      function (ex) { return Observable.throwException(ex, scheduler); },
      function () { return Observable.empty(scheduler); }
    );
  });

  res.messages.assertEqual(
    onNext(301, 0),
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(305, 4),
    onCompleted(306)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectMany_Triple_InnersWithTiming1', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var ysn = scheduler.createColdObservable(
    onNext(10, 10),
    onNext(20, 11),
    onNext(30, 12),
    onCompleted(40)
  );

  var yse = scheduler.createColdObservable(
    onNext(0, 99),
    onCompleted(10)
  );

  var ysc = scheduler.createColdObservable(
    onNext(10, 42),
    onCompleted(20)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x) { return ysn; },
      function (ex) { return yse; },
      function () { return ysc; }
    );
  });

  res.messages.assertEqual(
    onNext(310, 10),
    onNext(311, 10),
    onNext(312, 10),
    onNext(313, 10),
    onNext(314, 10),
    onNext(315, 42),
    onNext(320, 11),
    onNext(321, 11),
    onNext(322, 11),
    onNext(323, 11),
    onNext(324, 11),
    onNext(330, 12),
    onNext(331, 12),
    onNext(332, 12),
    onNext(333, 12),
    onNext(334, 12),
    onCompleted(344)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );

  ysn.subscriptions.assertEqual(
    subscribe(300, 340),
    subscribe(301, 341),
    subscribe(302, 342),
    subscribe(303, 343),
    subscribe(304, 344)
  );

  yse.subscriptions.assertEqual(
  );

  ysc.subscriptions.assertEqual(
    subscribe(305, 325)
  );
});

test('SelectMany_Triple_InnersWithTiming2', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var ysn = scheduler.createColdObservable(
    onNext(10, 10),
    onNext(20, 11),
    onNext(30, 12),
    onCompleted(40)
  );

  var yse = scheduler.createColdObservable(
    onNext(0, 99),
    onCompleted(10)
  );

  var ysc = scheduler.createColdObservable(
    onNext(10, 42),
    onCompleted(50)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x) { return ysn; },
      function (ex) { return yse; },
      function () { return ysc; }
    );
  });

  res.messages.assertEqual(
    onNext(310, 10),
    onNext(311, 10),
    onNext(312, 10),
    onNext(313, 10),
    onNext(314, 10),
    onNext(315, 42),
    onNext(320, 11),
    onNext(321, 11),
    onNext(322, 11),
    onNext(323, 11),
    onNext(324, 11),
    onNext(330, 12),
    onNext(331, 12),
    onNext(332, 12),
    onNext(333, 12),
    onNext(334, 12),
    onCompleted(355)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );

  ysn.subscriptions.assertEqual(
    subscribe(300, 340),
    subscribe(301, 341),
    subscribe(302, 342),
    subscribe(303, 343),
    subscribe(304, 344)
  );

  yse.subscriptions.assertEqual(
  );

  ysc.subscriptions.assertEqual(
    subscribe(305, 355)
  );
});

test('SelectMany_Triple_InnersWithTiming3', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(400, 1),
    onNext(500, 2),
    onNext(600, 3),
    onNext(700, 4),
    onCompleted(800)
  );

  var ysn = scheduler.createColdObservable(
    onNext(10, 10),
    onNext(20, 11),
    onNext(30, 12),
    onCompleted(40)
  );

  var yse = scheduler.createColdObservable(
    onNext(0, 99),
    onCompleted(10)
  );

  var ysc = scheduler.createColdObservable(
    onNext(10, 42),
    onCompleted(100)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x) { return ysn; },
      function (ex) { return yse; },
      function () { return ysc; }
    );
  });

  res.messages.assertEqual(
    onNext(310, 10),
    onNext(320, 11),
    onNext(330, 12),
    onNext(410, 10),
    onNext(420, 11),
    onNext(430, 12),
    onNext(510, 10),
    onNext(520, 11),
    onNext(530, 12),
    onNext(610, 10),
    onNext(620, 11),
    onNext(630, 12),
    onNext(710, 10),
    onNext(720, 11),
    onNext(730, 12),
    onNext(810, 42),
    onCompleted(900)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 800)
  );

  ysn.subscriptions.assertEqual(
    subscribe(300, 340),
    subscribe(400, 440),
    subscribe(500, 540),
    subscribe(600, 640),
    subscribe(700, 740)
  );

  yse.subscriptions.assertEqual(
  );

  ysc.subscriptions.assertEqual(
    subscribe(800, 900)
  );
});

test('SelectMany_Triple_Error_Identity', function () {
  var scheduler = new TestScheduler();

  var err = new Error();

  var xs = scheduler.createHotObservable(
      onNext(300, 0),
      onNext(301, 1),
      onNext(302, 2),
      onNext(303, 3),
      onNext(304, 4),
      onError(305, err)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x) { return Observable.just(x, scheduler); },
      function (ex1) { return Observable.throwException(ex1, scheduler); },
      function () { return Observable.empty(scheduler); }
    )
  });

  res.messages.assertEqual(
    onNext(301, 0),
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(305, 4),
    onError(306, err)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectMany_Triple_SelectMany', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x) { return Observable.repeat(x, x, scheduler); },
      function (ex) { return Observable.throwException(ex, scheduler); },
      function () { return Observable.empty(scheduler); }
    );
  });

  res.messages.assertEqual(
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(304, 2),
    onNext(305, 4),
    onNext(305, 3),
    onNext(306, 4),
    onNext(306, 3),
    onNext(307, 4),
    onNext(308, 4),
    onCompleted(308)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectMany_Triple_Concat', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x) { return Observable.just(x, scheduler); },
      function (ex) { return Observable.throwException(ex, scheduler); },
      function () { return Observable.range(1, 3, scheduler); }
    );
  });

  res.messages.assertEqual(
    onNext(301, 0),
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(305, 4),
    onNext(306, 1),
    onNext(307, 2),
    onNext(308, 3),
    onCompleted(309)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectMany_Triple_Catch', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x) { return Observable.just(x, scheduler); },
      function (ex) { return Observable.range(1, 3, scheduler); },
      function () { return Observable.empty(scheduler); }
    );
  });

  res.messages.assertEqual(
    onNext(301, 0),
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(305, 4),
    onCompleted(306)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectMany_Triple_Error_Catch', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
      onNext(300, 0),
      onNext(301, 1),
      onNext(302, 2),
      onNext(303, 3),
      onNext(304, 4),
      onError(305, new Error())
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x) { return Observable.just(x, scheduler); },
      function (ex) { return Observable.range(1, 3, scheduler); },
      function () { return Observable.empty(scheduler); }
    );
  });

  res.messages.assertEqual(
    onNext(301, 0),
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(305, 4),
    onNext(306, 1),
    onNext(307, 2),
    onNext(308, 3),
    onCompleted(309)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectMany_Triple_All', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x) { return Observable.repeat(x, x, scheduler); },
      function (ex) { return Observable.repeat(0, 2, scheduler); },
      function () { return Observable.repeat(-1, 2, scheduler); }
    );
  });

  res.messages.assertEqual(
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(304, 2),
    onNext(305, 4),
    onNext(305, 3),
    onNext(306, -1),
    onNext(306, 4),
    onNext(306, 3),
    onNext(307, -1),
    onNext(307, 4),
    onNext(308, 4),
    onCompleted(308)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectMany_Triple_Error_All', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onError(305, new Error())
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x) { return Observable.repeat(x, x, scheduler); },
      function (ex) { return Observable.repeat(0, 2, scheduler); },
      function () { return Observable.repeat(-1, 2, scheduler); }
    );
  });

  res.messages.assertEqual(
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(304, 2),
    onNext(305, 4),
    onNext(305, 3),
    onNext(306, 0),
    onNext(306, 4),
    onNext(306, 3),
    onNext(307, 0),
    onNext(307, 4),
    onNext(308, 4),
    onCompleted(308)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectMany_Triple_All_Dispose', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var res = scheduler.startWithDispose(function () {
    return xs.selectManyObserver(
      function (x) { return Observable.repeat(x, x, scheduler); },
      function (ex) { return Observable.repeat(0, 2, scheduler); },
      function () { return Observable.repeat(-1, 2, scheduler); }
    );
  }, 307);

  res.messages.assertEqual(
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(304, 2),
    onNext(305, 4),
    onNext(305, 3),
    onNext(306, -1),
    onNext(306, 4),
    onNext(306, 3)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectMany_Triple_All_Dispose_Before_First', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var res = scheduler.startWithDispose(function () {
    return xs.selectManyObserver(
      function (x) { return Observable.repeat(x, x, scheduler); },
      function (ex) { return Observable.repeat(0, 2, scheduler); },
      function () { return Observable.repeat(-1, 2, scheduler); }
    );
  }, 304);

  res.messages.assertEqual(
    onNext(302, 1),
    onNext(303, 2)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 304)
  );
});

test('SelectMany_Triple_OnNextThrow', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var err = new Error();

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x) { return throwError(err); },
      function (ex1) { return Observable.repeat(0, 2, scheduler); },
      function () { return Observable.repeat(-1, 2, scheduler); }
    );
  });

  res.messages.assertEqual(
    onError(300, err)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 300)
  );
});

test('SelectMany_Triple_OnErrorThrow', function () {
  var scheduler = new TestScheduler();

  var err = new Error();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onError(305, new Error())
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x) { return Observable.repeat(x, x, scheduler); },
      function (ex1) { throw err; },
      function () { return Observable.repeat(-1, 2, scheduler); }
    );
  });

  res.messages.assertEqual(
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(304, 2),
    onError(305, err)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectMany_Triple_OnCompletedThrow', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
      onNext(300, 0),
      onNext(301, 1),
      onNext(302, 2),
      onNext(303, 3),
      onNext(304, 4),
      onCompleted(305)
  );

  var err = new Error();

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x) { return Observable.repeat(x, x, scheduler); },
      function (ex1) { return Observable.repeat(0, 2, scheduler); },
      function () { throw err; }
    );
  });

  res.messages.assertEqual(
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(304, 2),
    onError(305, err)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectManyWithIndex_Triple_Identity', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x, _) { return Observable.just(x, scheduler); },
      function (ex) { return Observable.throwException(ex, scheduler); },
      function () { return Observable.empty(scheduler); }
    );
  });

  res.messages.assertEqual(
    onNext(301, 0),
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(305, 4),
    onCompleted(306)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectManyWithIndex_Triple_InnersWithTiming1', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var ysn = scheduler.createColdObservable(
    onNext(10, 10),
    onNext(20, 11),
    onNext(30, 12),
    onCompleted(40)
  );

  var yse = scheduler.createColdObservable(
    onNext(0, 99),
    onCompleted(10)
  );

  var ysc = scheduler.createColdObservable(
    onNext(10, 42),
    onCompleted(20)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x, _) { return  ysn; },
      function (ex) { return yse; },
      function () { return ysc; }
    );
  });

  res.messages.assertEqual(
    onNext(310, 10),
    onNext(311, 10),
    onNext(312, 10),
    onNext(313, 10),
    onNext(314, 10),
    onNext(315, 42),
    onNext(320, 11),
    onNext(321, 11),
    onNext(322, 11),
    onNext(323, 11),
    onNext(324, 11),
    onNext(330, 12),
    onNext(331, 12),
    onNext(332, 12),
    onNext(333, 12),
    onNext(334, 12),
    onCompleted(344)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );

  ysn.subscriptions.assertEqual(
    subscribe(300, 340),
    subscribe(301, 341),
    subscribe(302, 342),
    subscribe(303, 343),
    subscribe(304, 344)
  );

  yse.subscriptions.assertEqual(
  );

  ysc.subscriptions.assertEqual(
    subscribe(305, 325)
  );
});

test('SelectManyWithIndex_Triple_InnersWithTiming2', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var ysn = scheduler.createColdObservable(
    onNext(10, 10),
    onNext(20, 11),
    onNext(30, 12),
    onCompleted(40)
  );

  var yse = scheduler.createColdObservable(
    onNext(0, 99),
    onCompleted(10)
  );

  var ysc = scheduler.createColdObservable(
    onNext(10, 42),
    onCompleted(50)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x, _) { return ysn; },
      function (ex) { return yse; },
      function () { return ysc; }
    );
  });

  res.messages.assertEqual(
    onNext(310, 10),
    onNext(311, 10),
    onNext(312, 10),
    onNext(313, 10),
    onNext(314, 10),
    onNext(315, 42),
    onNext(320, 11),
    onNext(321, 11),
    onNext(322, 11),
    onNext(323, 11),
    onNext(324, 11),
    onNext(330, 12),
    onNext(331, 12),
    onNext(332, 12),
    onNext(333, 12),
    onNext(334, 12),
    onCompleted(355)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );

  ysn.subscriptions.assertEqual(
    subscribe(300, 340),
    subscribe(301, 341),
    subscribe(302, 342),
    subscribe(303, 343),
    subscribe(304, 344)
  );

  yse.subscriptions.assertEqual(
  );

  ysc.subscriptions.assertEqual(
    subscribe(305, 355)
  );
});

test('SelectManyWithIndex_Triple_InnersWithTiming3', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(400, 1),
    onNext(500, 2),
    onNext(600, 3),
    onNext(700, 4),
    onCompleted(800)
  );

  var ysn = scheduler.createColdObservable(
    onNext(10, 10),
    onNext(20, 11),
    onNext(30, 12),
    onCompleted(40)
  );

  var yse = scheduler.createColdObservable(
    onNext(0, 99),
    onCompleted(10)
  );

  var ysc = scheduler.createColdObservable(
    onNext(10, 42),
    onCompleted(100)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x, _) { return ysn; },
      function (ex) { return yse; },
      function () { return ysc; }
    );
  });

  res.messages.assertEqual(
    onNext(310, 10),
    onNext(320, 11),
    onNext(330, 12),
    onNext(410, 10),
    onNext(420, 11),
    onNext(430, 12),
    onNext(510, 10),
    onNext(520, 11),
    onNext(530, 12),
    onNext(610, 10),
    onNext(620, 11),
    onNext(630, 12),
    onNext(710, 10),
    onNext(720, 11),
    onNext(730, 12),
    onNext(810, 42),
    onCompleted(900)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 800)
  );

  ysn.subscriptions.assertEqual(
    subscribe(300, 340),
    subscribe(400, 440),
    subscribe(500, 540),
    subscribe(600, 640),
    subscribe(700, 740)
  );

  yse.subscriptions.assertEqual(
  );

  ysc.subscriptions.assertEqual(
    subscribe(800, 900)
  );
});

test('SelectManyWithIndex_Triple_Error_Identity', function () {
  var scheduler = new TestScheduler();

  var err = new Error();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onError(305, err)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x, _) { return Observable.just(x, scheduler); },
      function (ex1) { return Observable.throwException(ex1, scheduler); },
      function () { return Observable.empty(scheduler); }
    );
  });

  res.messages.assertEqual(
    onNext(301, 0),
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(305, 4),
    onError(306, err)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectManyWithIndex_Triple_SelectMany', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x, _) { return Observable.repeat(x, x, scheduler); },
      function (ex) { return Observable.throwException(ex, scheduler); },
      function () { return Observable.empty(scheduler); }
    );
  });

  res.messages.assertEqual(
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(304, 2),
    onNext(305, 4),
    onNext(305, 3),
    onNext(306, 4),
    onNext(306, 3),
    onNext(307, 4),
    onNext(308, 4),
    onCompleted(308)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectManyWithIndex_Triple_Concat', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x, _) { return  Observable.just(x, scheduler); },
      function (ex) { return Observable.throwException(ex, scheduler); },
      function () { return Observable.range(1, 3, scheduler); }
    );
  });

  res.messages.assertEqual(
    onNext(301, 0),
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(305, 4),
    onNext(306, 1),
    onNext(307, 2),
    onNext(308, 3),
    onCompleted(309)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectManyWithIndex_Triple_Catch', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x, _) { return  Observable.just(x, scheduler); },
      function (ex) { return Observable.range(1, 3, scheduler); },
      function () { return Observable.empty(scheduler); }
    );
  });

  res.messages.assertEqual(
    onNext(301, 0),
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(305, 4),
    onCompleted(306)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectManyWithIndex_Triple_Error_Catch', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onError(305, new Error())
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x, _) { return  Observable.just(x, scheduler); },
      function (ex) { return Observable.range(1, 3, scheduler); },
      function () { return Observable.empty(scheduler); }
    );
  });

  res.messages.assertEqual(
    onNext(301, 0),
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(305, 4),
    onNext(306, 1),
    onNext(307, 2),
    onNext(308, 3),
    onCompleted(309)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectManyWithIndex_Triple_All', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
        function (x, _) { return Observable.repeat(x, x, scheduler); },
        function (ex) { return Observable.repeat(0, 2, scheduler); },
        function () { return Observable.repeat(-1, 2, scheduler); }
    );
  });

  res.messages.assertEqual(
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(304, 2),
    onNext(305, 4),
    onNext(305, 3),
    onNext(306, -1),
    onNext(306, 4),
    onNext(306, 3),
    onNext(307, -1),
    onNext(307, 4),
    onNext(308, 4),
    onCompleted(308)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectManyWithIndex_Triple_Error_All', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onError(305, new Error())
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x, _) { return Observable.repeat(x, x, scheduler); },
      function (ex) { return Observable.repeat(0, 2, scheduler); },
      function () { return Observable.repeat(-1, 2, scheduler); }
    );
  });

  res.messages.assertEqual(
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(304, 2),
    onNext(305, 4),
    onNext(305, 3),
    onNext(306, 0),
    onNext(306, 4),
    onNext(306, 3),
    onNext(307, 0),
    onNext(307, 4),
    onNext(308, 4),
    onCompleted(308)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectManyWithIndex_Triple_All_Dispose', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var res = scheduler.startWithDispose(function () {
    return xs.selectManyObserver(
      function (x, _) { return Observable.repeat(x, x, scheduler); },
      function (ex) { return Observable.repeat(0, 2, scheduler); },
      function () { return Observable.repeat(-1, 2, scheduler); }
    );
  }, 307);

  res.messages.assertEqual(
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(304, 2),
    onNext(305, 4),
    onNext(305, 3),
    onNext(306, -1),
    onNext(306, 4),
    onNext(306, 3)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectManyWithIndex_Triple_All_Dispose_Before_First', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var res = scheduler.startWithDispose(function () {
    return xs.selectManyObserver(
      function (x, _) { return Observable.repeat(x, x, scheduler); },
      function (ex) { return Observable.repeat(0, 2, scheduler); },
      function () { return Observable.repeat(-1, 2, scheduler); }
    );
  }, 304);

  res.messages.assertEqual(
    onNext(302, 1),
    onNext(303, 2)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 304)
  );
});

test('SelectManyWithIndex_Triple_OnNextThrow', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var err = new Error();

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x, _) { throw err; },
      function (ex1) { Observable.repeat(0, 2, scheduler); },
      function () { return Observable.repeat(-1, 2, scheduler); }
    );
  });

  res.messages.assertEqual(
    onError(300, err)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 300)
  );
});

test('SelectManyWithIndex_Triple_OnErrorThrow', function () {
  var scheduler = new TestScheduler();

  var err = new Error();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onError(305, new Error())
  );

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x, _) { return Observable.repeat(x, x, scheduler); },
      function (ex1) { throw err; },
      function () { return Observable.repeat(-1, 2, scheduler); }
    );
  });

  res.messages.assertEqual(
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(304, 2),
    onError(305, err)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});

test('SelectManyWithIndex_Triple_OnCompletedThrow', function () {
    var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(300, 0),
    onNext(301, 1),
    onNext(302, 2),
    onNext(303, 3),
    onNext(304, 4),
    onCompleted(305)
  );

  var err = new Error();

  var res = scheduler.startWithCreate(function () {
    return xs.selectManyObserver(
      function (x, _) { return Observable.repeat(x, x, scheduler); },
      function (ex1) { return Observable.repeat(0, 2, scheduler); },
      function () { throw err; }
    );
  });

  res.messages.assertEqual(
    onNext(302, 1),
    onNext(303, 2),
    onNext(304, 3),
    onNext(304, 2),
    onError(305, err)
  );

  xs.subscriptions.assertEqual(
    subscribe(200, 305)
  );
});
