(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx */

  QUnit.module('join');

  var TestScheduler = Rx.TestScheduler,
      Observable = Rx.Observable,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted;

  function TimeInterval(value, interval) {
    this.value = value;
    this.interval = interval;
  }

  test('join normal I', function () {
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
      return xs.join(ys, function (x) {
        return Observable.timer(x.interval, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, scheduler);
      }, function (x, y) {
        return x.value + y.value;
      });
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
      onCompleted(900));
  });

  test('join normal II', function () {
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
      onCompleted(721));

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
      onCompleted(990));

    var results = scheduler.startScheduler(function () {
      return xs.join(ys, function (x) {
        return Observable.timer(x.interval, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, scheduler);
      }, function (x, y) {
        return x.value + y.value;
      });
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
      onCompleted(910));
  });

  test('join normal III', function () {
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
      return xs.join(ys, function (x) {
        return Observable.timer(x.interval, null, scheduler).filter(function () {
          return false;
        });
      }, function (y) {
        return Observable.timer(y.interval, null, scheduler).filter(function () {
          return false;
        });
      }, function (x, y) {
        return x.value + y.value;
      });
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
      onCompleted(900));
  });

  test('join normal IV', function () {
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
      return xs.join(ys, function (x) {
        return Observable.timer(x.interval, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, scheduler);
      }, function (x, y) {
        return x.value + y.value;
      });
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
      onCompleted(980));
  });

  test('join normal V', function () {
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
      return xs.join(ys, function (x) {
        return Observable.timer(x.interval, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, scheduler);
      }, function (x, y) {
        return x.value + y.value;
      });
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
      onCompleted(922));
  });

  test('join normal VI', function () {
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
      return xs.join(ys, function (x) {
        return Observable.timer(x.interval, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, scheduler);
      }, function (x, y) {
        return x.value + y.value;
      });
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
      onCompleted(900));
  });

  test('join normal VII', function () {
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
      return xs.join(ys, function (x) {
        return Observable.timer(x.interval, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, scheduler);
      }, function (x, y) {
        return x.value + y.value;
      });
    }, { disposed: 713 });

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

  test('join error I', function () {
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

    var results = scheduler.startScheduler(function () {
      return xs.join(ys, function (x) {
        return Observable.timer(x.interval, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, scheduler);
      }, function (x, y) {
        return x.value + y.value;
      });
    }, { disposed: 713 });

    results.messages.assertEqual(
      onNext(215, '0hat'),
      onNext(217, '0bat'),
      onNext(219, '1hat'),
      onNext(300, '3wag'),
      onNext(300, '3pig'),
      onNext(305, '3cup'),
      onError(310, error));
  });

  test('join error II', function () {
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

    var results = scheduler.startScheduler(function () {
      return xs.join(ys, function (x) {
        return Observable.timer(x.interval, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, scheduler);
      }, function (x, y) {
        return x.value + y.value;
      });
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

  test('join error III', function () {
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
      return xs.join(ys, function (x) {
        return Observable.timer(x.interval, null, scheduler)
          .flatMap(x.value === 6 ? Observable['throw'](error) : Observable.empty());
      }, function (y) {
        return Observable.timer(y.interval, scheduler);
      }, function (x, y) {
        return x.value + y.value;
      });
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

  test('join error IV', function () {
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

    var results = scheduler.startScheduler(function () {
      return xs.join(ys, function (x) {
        return Observable.timer(x.interval, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, null, scheduler)
          .flatMap(y.value === 'tin' ? Observable['throw'](error) : Observable.empty());
      }, function (x, y) {
        return x.value + y.value;
      });
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

  test('join error V', function () {
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
      return xs.join(ys, function (x) {
        if (x.value >= 0) { throw error; }
        return Observable.empty();
      }, function (y) {
        return Observable.timer(y.interval, scheduler);
      }, function (x, y) {
        return x.value + y.value;
      });
    });

    results.messages.assertEqual(
      onError(210, error));
  });

  test('join error VI', function () {
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
      return xs.join(ys, function (x) {
        return Observable.timer(x.interval, scheduler);
      }, function (y) {
        if (y.value.length >= 0) { throw error; }
        return Observable.empty();
      }, function (x, y) {
        return x.value + y.value;
      });
    });

    results.messages.assertEqual(
      onError(215, error));
  });

  test('join error VII', function () {
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
      return xs.join(ys, function (x) {
        return Observable.timer(x.interval, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, scheduler);
      }, function (x, y) {
        if (x.value >= 0) { throw error; }
        return x.value + y.value;
      });
    });

    results.messages.assertEqual(
      onError(215, error));
  });

  test('join error VIII', function () {
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
      return xs.join(ys, function (x) {
        return Observable.timer(x.interval, scheduler);
      }, function (y) {
        return Observable.timer(y.interval, scheduler);
      }, function (x, y) {
        if (x.value >= 0) { throw error; }
        return x.value + y.value;
      });
    });

    results.messages.assertEqual(
      onError(215, error));
  });

}());
