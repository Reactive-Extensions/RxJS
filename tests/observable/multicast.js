QUnit.module('Multicast');

var TestScheduler = Rx.TestScheduler,
  Observable = Rx.Observable,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe,
  Subject = Rx.Subject,
  created = Rx.ReactiveTest.created,
  disposed = Rx.ReactiveTest.disposed,
  subscribed = Rx.ReactiveTest.subscribed,
  inherits = Rx.internals.inherits;

test('Multicast_Hot_1', function () {

  var scheduler = new TestScheduler();

  var s = new Subject();

  var xs = scheduler.createHotObservable(
    onNext(40, 0),
    onNext(90, 1),
    onNext(150, 2),
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5),
    onNext(330, 6),
    onNext(340, 7),
    onCompleted(390));

  var c;
  var o = scheduler.createObserver();
  var d1;
  var d2;

  scheduler.scheduleAbsolute(50,function () {
    c = xs.multicast(s);
  });

  scheduler.scheduleAbsolute(100, function () {
    d1 = c.subscribe(o);
  });

  scheduler.scheduleAbsolute(200, function () {
    d2 = c.connect();
  });

  scheduler.scheduleAbsolute(300, function () {
    d1.dispose();
  });

  scheduler.start();

  o.messages.assertEqual(
    onNext(210, 3),
    onNext(240, 4),
    onNext(270, 5)
  );

  xs.subscriptions.assertEqual(subscribe(200, 390));
});

test('Multicast_Hot_2', function () {
    var c, d1, d2, o, s, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onCompleted(390));
    s = new Subject();
    o = scheduler.createObserver();
    scheduler.scheduleAbsolute(50, function () {
        c = xs.multicast(s);
    });
    scheduler.scheduleAbsolute(100, function () {
        d2 = c.connect();
    });
    scheduler.scheduleAbsolute(200, function () {
        d1 = c.subscribe(o);
    });
    scheduler.scheduleAbsolute(300, function () {
        return d1.dispose();
    });
    scheduler.start();
    o.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(270, 5));
    xs.subscriptions.assertEqual(subscribe(100, 390));
});

test('Multicast_Hot_2', function () {
    var c, d1, d2, o, s, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onCompleted(390));
    s = new Subject();
    o = scheduler.createObserver();
    scheduler.scheduleAbsolute(50, function () {
        c = xs.multicast(s);
    });
    scheduler.scheduleAbsolute(100, function () {
        d2 = c.connect();
    });
    scheduler.scheduleAbsolute(200, function () {
        d1 = c.subscribe(o);
    });
    scheduler.scheduleAbsolute(300, function () {
        return d1.dispose();
    });
    scheduler.start();
    o.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(270, 5));
    xs.subscriptions.assertEqual(subscribe(100, 390));
});

test('Multicast_Hot_3', function () {
    var c, d1, d2, o, s, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onCompleted(390));
    s = new Subject();
    o = scheduler.createObserver();
    scheduler.scheduleAbsolute(50, function () {
        c = xs.multicast(s);
    });
    scheduler.scheduleAbsolute(100, function () {
        d2 = c.connect();
    });
    scheduler.scheduleAbsolute(200, function () {
        d1 = c.subscribe(o);
    });
    scheduler.scheduleAbsolute(300, function () {
        d2.dispose();
    });
    scheduler.scheduleAbsolute(335, function () {
        d2 = c.connect();
    });
    scheduler.start();
    o.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(340, 7), onCompleted(390));
    xs.subscriptions.assertEqual(subscribe(100, 300), subscribe(335, 390));
});

test('Multicast_Hot_4', function () {
    var c, d1, d2, ex, o, s, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onError(390, ex));
    s = new Subject();
    o = scheduler.createObserver();
    scheduler.scheduleAbsolute(50, function () {
        c = xs.multicast(s);
    });
    scheduler.scheduleAbsolute(100, function () {
        d2 = c.connect();
    });
    scheduler.scheduleAbsolute(200, function () {
        d1 = c.subscribe(o);
    });
    scheduler.scheduleAbsolute(300, function () {
        d2.dispose();
    });
    scheduler.scheduleAbsolute(335, function () {
        d2 = c.connect();
    });
    scheduler.start();
    o.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(340, 7), onError(390, ex));
    xs.subscriptions.assertEqual(subscribe(100, 300), subscribe(335, 390));
});

test('Multicast_Hot_5', function () {
    var c, d1, d2, ex, o, s, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onError(390, ex));
    s = new Subject();
    o = scheduler.createObserver();
    scheduler.scheduleAbsolute(50, function () {
        c = xs.multicast(s);
    });
    scheduler.scheduleAbsolute(100, function () {
        d2 = c.connect();
    });
    scheduler.scheduleAbsolute(400, function () {
        d1 = c.subscribe(o);
    });
    scheduler.start();
    o.messages.assertEqual(onError(400, ex));
    xs.subscriptions.assertEqual(subscribe(100, 390));
});

test('Multicast_Hot_6', function () {
    var c, d1, d2, ex, o, s, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onCompleted(390));
    s = new Subject();
    o = scheduler.createObserver();
    scheduler.scheduleAbsolute(50, function () {
        c = xs.multicast(s);
    });
    scheduler.scheduleAbsolute(100, function () {
        d2 = c.connect();
    });
    scheduler.scheduleAbsolute(400, function () {
        d1 = c.subscribe(o);
    });
    scheduler.start();
    o.messages.assertEqual(onCompleted(400));
    xs.subscriptions.assertEqual(subscribe(100, 390));
});

test('Multicast_Cold_Completed', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onCompleted(390));
    results = scheduler.startWithCreate(function () {
        return xs.multicast(function () {
            return new Subject();
        }, function (ys) {
            return ys;
        });
    });
    results.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onCompleted(390));
    xs.subscriptions.assertEqual(subscribe(200, 390));
});

test('Multicast_Cold_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onError(390, ex));
    results = scheduler.startWithCreate(function () {
        return xs.multicast(function () {
            return new Subject();
        }, function (ys) {
            return ys;
        });
    });
    results.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onError(390, ex));
    xs.subscriptions.assertEqual(subscribe(200, 390));
});

test('Multicast_Cold_Dispose', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7));
    results = scheduler.startWithCreate(function () {
        return xs.multicast(function () {
            return new Subject();
        }, function (ys) {
            return ys;
        });
    });
    results.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7));
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});

test('Multicast_Cold_Zip', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onCompleted(390));
    results = scheduler.startWithCreate(function () {
        return xs.multicast(function () {
            return new Subject();
        }, function (ys) {
            return ys.zip(ys, function (a, b) {
                return a + b;
            });
        });
    });
    results.messages.assertEqual(onNext(210, 6), onNext(240, 8), onNext(270, 10), onNext(330, 12), onNext(340, 14), onCompleted(390));
    xs.subscriptions.assertEqual(subscribe(200, 390));
});
