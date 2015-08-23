(function () {
  QUnit.module('GroupJoin');

  var TestScheduler = Rx.TestScheduler,
      Observable = Rx.Observable,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  function TimeInterval(value, interval) {
    this.value = value;
    this.interval = interval;
  }

  function newTimer(l, t, scheduler) {
    var timer = scheduler.createColdObservable(onNext(t, 0), onCompleted(t));
    l.push(timer);
    return timer;
  }

  test('GroupJoinOp_Normal_I', function () {
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

      var res = scheduler.startWithCreate(function (){
        return xs.groupJoin(
          ys,
          function (x) { return newTimer(xsd, x.interval, scheduler); },
          function (y) { return newTimer(ysd, y.interval, scheduler); },
          function (x, yy) { return yy.map(function (y) { return x.value + y.value; })})
        .mergeAll();
      });

      res.messages.assertEqual(
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
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 990)
      );

      ys.subscriptions.assertEqual(
        subscribe(200, 990)
      );
  });

  test('GroupJoinOp_Normal_II', function () {
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

    var res = scheduler.startWithCreate(function (){
      return xs.groupJoin(
        ys,
        function (x) { return newTimer(xsd, x.interval, scheduler); },
        function (y) { return newTimer(ysd, y.interval, scheduler); },
        function (x, yy) { return yy.map(function (y) { return x.value + y.value; })})
      .mergeAll();
    });

    res.messages.assertEqual(
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
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 910)
    );

    ys.subscriptions.assertEqual(
      subscribe(200, 910)
    );
  });

  test('GroupJoinOp_Normal_III', function () {
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

    var results = scheduler.startWithCreate(function () {
      return xs.groupJoin(ys, function (x) {
        return Observable.timer(x.interval, null, scheduler).filter(function () { return false; });
      }, function (y) {
        return Observable.timer(y.interval, null, scheduler).filter(function () { return false; });
      }, function (x, yy) {
        return yy.map(function (y) { return x.value + y.value; });
      }).mergeAll();
    });

    results.messages.assertEqual(
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
      onCompleted(990));
  });

  test('GroupJoinOp_Normal_IV', function () {
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

    var results = scheduler.startWithCreate(function () {
      return xs.groupJoin(ys, function (x) {
        return Observable.timer(x.interval, null, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, null, scheduler);
      }, function (x, yy) {
        return yy.map(function (y) { return x.value + y.value; });
      }).mergeAll();
    });

    results.messages.assertEqual(
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
      onCompleted(990));
  });

  test('GroupJoinOp_Normal_V', function () {
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

    var results = scheduler.startWithCreate(function () {
      return xs.groupJoin(ys, function (x) {
        return Observable.timer(x.interval, null, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, null, scheduler);
      }, function (x, yy) {
        return yy.map(function (y) { return x.value + y.value; });
      }).mergeAll();
    });

    results.messages.assertEqual(
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
      onCompleted(990));
  });

  test('GroupJoinOp_Normal_VI', function () {
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

    var results = scheduler.startWithCreate(function () {
      return xs.groupJoin(ys, function (x) {
        return Observable.timer(x.interval, null, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, null, scheduler);
      }, function (x, yy) {
        return yy.map(function (y) { return x.value + y.value; });
      }).mergeAll();
    });

    results.messages.assertEqual(
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
      onCompleted(920));
  });

  test('GroupJoinOp_Normal_VII', function () {
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
      onCompleted(900));

    var results = scheduler.startWithCreate(function () {
      return xs.groupJoin(ys, function (x) {
        return Observable.timer(x.interval, null, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, null, scheduler);
      }, function (x, yy) {
        return yy.map(function (y) { return x.value + y.value; });
      }).mergeAll();
    });

    results.messages.assertEqual(
      onCompleted(210));
  });

  test('GroupJoinOp_Normal_VIII', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, new TimeInterval(0, 200)));

    var ys = scheduler.createHotObservable(
      onNext(220, new TimeInterval('hat', 100)),
      onCompleted(230));

    var results = scheduler.startWithCreate(function () {
      return xs.groupJoin(ys, function (x) {
        return Observable.timer(x.interval, null, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, null, scheduler);
      }, function (x, yy) {
        return yy.map(function (y) { return x.value + y.value; });
      }).mergeAll();
    });

    results.messages.assertEqual(
      onNext(220, '0hat'));
  });

  test('GroupJoinOp_Normal_IX', function () {
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

    var results = scheduler.startWithDispose(function () {
      return xs.groupJoin(ys, function (x) {
        return Observable.timer(x.interval, null, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, null, scheduler);
      }, function (x, yy) {
        return yy.map(function (y) { return x.value + y.value; });
      }).mergeAll();
    }, 713);

    results.messages.assertEqual(
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
      onNext(712, '7man'));
  });

  test('GroupJoinOp_Error_I', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, new TimeInterval(0, 10)),
      onNext(219, new TimeInterval(1, 5)),
      onNext(240, new TimeInterval(2, 10)),
      onNext(300, new TimeInterval(3, 100)),
      onError(310, error));

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

    var results = scheduler.startWithCreate(function () {
      return xs.groupJoin(ys, function (x) {
        return Observable.timer(x.interval, null, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, null, scheduler);
      }, function (x, yy) {
        return yy.map(function (y) { return x.value + y.value; });
      }).mergeAll();
    });

    results.messages.assertEqual(
      onNext(215, '0hat'),
      onNext(217, '0bat'),
      onNext(219, '1hat'),
      onNext(300, '3wag'),
      onNext(300, '3pig'),
      onNext(305, '3cup'),
      onError(310, error));
  });

  test('GroupJoinOp_Error_II', function () {
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
      onError(722, error));

    var results = scheduler.startWithCreate(function () {
      return xs.groupJoin(ys, function (x) {
        return Observable.timer(x.interval, null, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, null, scheduler);
      }, function (x, yy) {
        return yy.map(function (y) { return x.value + y.value; });
      }).mergeAll();
    });

    results.messages.assertEqual(
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
      onError(722, error));
  });

  test('GroupJoinOp_Error_III', function () {
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

    var results = scheduler.startWithCreate(function () {
      return xs.groupJoin(ys, function (x) {
        return Observable.timer(x.interval, null, scheduler).flatMap(x.value === 6 ? Observable['throw'](error) : Observable.empty());
      }, function (y) {
        return Observable.timer(y.interval, null, scheduler);
      }, function (x, yy) {
        return yy.map(function (y) { return x.value + y.value; });
      }).mergeAll();
    });

    results.messages.assertEqual(
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
      onError(725, error));
  });

  test('GroupJoinOp_Error_IV', function () {
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
      onNext(702, new TimeInterval('tin', 19)),
      onNext(712, new TimeInterval('man', 10)),
      onNext(722, new TimeInterval('rat', 200)),
      onNext(732, new TimeInterval('wig', 5)),
      onCompleted(800));

    var results = scheduler.startWithCreate(function () {
      return xs.groupJoin(ys, function (x) {
        return Observable.timer(x.interval, null, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, null, scheduler).flatMap(y.value === 'tin' ? Observable['throw'](error) : Observable.empty());
      }, function (x, yy) {
        return yy.map(function (y) { return x.value + y.value; });
      }).mergeAll();
    });

    results.messages.assertEqual(
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
      onError(721, error));
  });

  test('GroupJoinOp_Error_V', function () {
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

    var results = scheduler.startWithCreate(function () {
      return xs.groupJoin(ys, function (x) {
        if (x.value >= 0) { throw error; }
        return Observable.empty();
      }, function (y) {
        return Observable.timer(y.interval, null, scheduler);
      }, function (x, yy) {
        return yy.map(function (y) { return x.value + y.value; });
      }).mergeAll();
    });

    results.messages.assertEqual(
      onError(210, error));
  });

  test('GroupJoinOp_Error_VI', function () {
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

    var results = scheduler.startWithCreate(function () {
      return xs.groupJoin(ys, function (x) {
        return Observable.timer(x.interval, null, scheduler);
      }, function (y) {
        if (y.value.length >= 0) { throw error; }
        return Observable.empty();
      }, function (x, yy) {
        return yy.map(function (y) { return x.value + y.value; });
      }).mergeAll();
    });

    results.messages.assertEqual(
      onError(215, error));
  });

  test('GroupJoinOp_Error_VII', function () {
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
      onCompleted(900));

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
      onCompleted(800));

    var results = scheduler.startWithCreate(function () {
      return xs.groupJoin(ys, function (x) {
        return Observable.timer(x.interval, null, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, null, scheduler);
      }, function (x, yy) {
        if (x.value >= 0) { throw error; }
        return yy.map(function (y) { return x.value + y.value; });
      }).mergeAll();
    });

    results.messages.assertEqual(
      onError(215, error));
  });

  test('GroupJoinOp_Error_VIII', function () {
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

    var results = scheduler.startWithCreate(function () {
      return xs.groupJoin(ys, function (x) {
        return Observable.timer(x.interval, null, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, null, scheduler);
      }, function (x, yy) {
        if (x.value >= 0) { throw error; }
        return yy.map(function (y) { return x.value + y.value; });
      }).mergeAll();
    });

    results.messages.assertEqual(
      onError(210, error));
  });

}());
