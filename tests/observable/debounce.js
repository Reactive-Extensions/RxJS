/* jshint undef: true, unused: true */
/* globals QUnit, test, Rx */

(function () {
  QUnit.module('debounce');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('debounce empty', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 0),
      onCompleted(300)
    );

    var res = scheduler.startScheduler(function () {
      return xs.debounce(10, scheduler);
    });

    res.messages.assertEqual(
      onCompleted(300)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 300)
    );
  });

  test('debounce Error', function () {
    var scheduler = new TestScheduler();

    var error = new Error();

    var xs = scheduler.createHotObservable(
      onNext(150, 0),
      onError(300, error)
    );

    var res = scheduler.startScheduler(function () {
      return xs.debounce(10, scheduler);
    });

    res.messages.assertEqual(
      onError(300, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 300)
    );
  });

  test('debounce Never', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 0)
    );

    var res = scheduler.startScheduler(function () {
      return xs.debounce(10, scheduler);
    });

    res.messages.assertEqual(
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('debounce all pass', function(){
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(300, 2),
      onNext(351, 3),
      onCompleted(400)
    );

    var results = scheduler.startScheduler(function(){
      return xs.debounce(50, scheduler);
    });

    results.messages.assertEqual(
      onNext(260, 1),
      onNext(350, 2),
      onNext(400, 3),
      onCompleted(400)
    );
  });

  test('debounce time span all pass', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(150, 0),
        onNext(210, 1),
        onNext(240, 2),
        onNext(270, 3),
        onNext(300, 4),
        onCompleted(400)
    );

    var res = scheduler.startScheduler(function () {
      return xs.debounce(function () { return Observable.timer(20, scheduler); });
    });

    res.messages.assertEqual(
      onNext(230, 1),
      onNext(260, 2),
      onNext(290, 3),
      onNext(320, 4),
      onCompleted(400)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
      );
  });

  test('debounce relative time AllPass ErrorEnd', function () {
      var error = new Error();

      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
          onNext(150, 0),
          onNext(210, 1),
          onNext(240, 2),
          onNext(270, 3),
          onNext(300, 4),
          onError(400, error)
      );

      var res = scheduler.startScheduler(function () {
          return xs.debounce(function () { return Observable.timer(20, scheduler); });
      });

      res.messages.assertEqual(
          onNext(230, 1),
          onNext(260, 2),
          onNext(290, 3),
          onNext(320, 4),
          onError(400, error)
      );

      xs.subscriptions.assertEqual(
          subscribe(200, 400)
      );
  });

  test('debounce relative time all drop', function () {
      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
        onNext(150, 0),
        onNext(210, 1),
        onNext(240, 2),
        onNext(270, 3),
        onNext(300, 4),
        onNext(330, 5),
        onNext(360, 6),
        onNext(390, 7),
        onCompleted(400)
      );

      var res = scheduler.startScheduler(function () {
        return xs.debounce(function () { return Observable.timer(40, scheduler); });
      });

      res.messages.assertEqual(
        onNext(400, 7),
        onCompleted(400)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 400)
      );
  });

  test('debounce relative time all drop error end', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
        onNext(150, 0),
        onNext(210, 1),
        onNext(240, 2),
        onNext(270, 3),
        onNext(300, 4),
        onNext(330, 5),
        onNext(360, 6),
        onNext(390, 7),
        onError(400, error)
    );

    var res = scheduler.startScheduler(function () {
      return xs.debounce(40, scheduler);
    });

    res.messages.assertEqual(
      onError(400, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 400)
    );
  });

  test('debounce duration DelayBehavior', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, -1),
      onNext(250, 0),
      onNext(280, 1),
      onNext(310, 2),
      onNext(350, 3),
      onNext(400, 4),
      onCompleted(550)
    );

    var ys = [
      scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)),
      scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)),
      scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)),
      scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)),
      scheduler.createColdObservable(onNext(20, 42), onNext(25, 99))
    ];

    var results = scheduler.startScheduler(function () {
      return xs.debounce(function (x) { return ys[x]; });
    });

    results.messages.assertEqual(
      onNext(250 + 20, 0),
      onNext(280 + 20, 1),
      onNext(310 + 20, 2),
      onNext(350 + 20, 3),
      onNext(400 + 20, 4),
      onCompleted(550)
    );

    xs.subscriptions.assertEqual(subscribe(200, 550));
    ys[0].subscriptions.assertEqual(subscribe(250, 250 + 20));
    ys[1].subscriptions.assertEqual(subscribe(280, 280 + 20));
    ys[2].subscriptions.assertEqual(subscribe(310, 310 + 20));
    ys[3].subscriptions.assertEqual(subscribe(350, 350 + 20));
    ys[4].subscriptions.assertEqual(subscribe(400, 400 + 20));
  });

  test('debounce duration debounce behavior', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, -1),
      onNext(250, 0),
      onNext(280, 1),
      onNext(310, 2),
      onNext(350, 3),
      onNext(400, 4),
      onCompleted(550));

    var ys = [
      scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)),
      scheduler.createColdObservable(onNext(40, 42), onNext(45, 99)),
      scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)),
      scheduler.createColdObservable(onNext(60, 42), onNext(65, 99)),
      scheduler.createColdObservable(onNext(20, 42), onNext(25, 99))];

    var results = scheduler.startScheduler(function () {
      return xs.debounce(function (x) {
        return ys[x];
      });
    });

    results.messages.assertEqual(
      onNext(250 + 20, 0),
      onNext(310 + 20, 2),
      onNext(400 + 20, 4),
      onCompleted(550));

    xs.subscriptions.assertEqual(subscribe(200, 550));

    ys[0].subscriptions.assertEqual(subscribe(250, 250 + 20));
    ys[1].subscriptions.assertEqual(subscribe(280, 310));
    ys[2].subscriptions.assertEqual(subscribe(310, 310 + 20));
    ys[3].subscriptions.assertEqual(subscribe(350, 400));
    ys[4].subscriptions.assertEqual(subscribe(400, 400 + 20));
  });

  test('debounce duration early completion', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, -1),
      onNext(250, 0),
      onNext(280, 1),
      onNext(310, 2),
      onNext(350, 3),
      onNext(400, 4),
      onCompleted(410));

    var ys = [
      scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)),
      scheduler.createColdObservable(onNext(40, 42), onNext(45, 99)),
      scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)),
      scheduler.createColdObservable(onNext(60, 42), onNext(65, 99)),
      scheduler.createColdObservable(onNext(20, 42), onNext(25, 99))];

    var results = scheduler.startScheduler(function () {
      return xs.debounce(function (x) { return ys[x]; });
    });

    results.messages.assertEqual(
      onNext(250 + 20, 0),
      onNext(310 + 20, 2),
      onNext(410, 4),
      onCompleted(410));

    xs.subscriptions.assertEqual(subscribe(200, 410));
    ys[0].subscriptions.assertEqual(subscribe(250, 250 + 20));
    ys[1].subscriptions.assertEqual(subscribe(280, 310));
    ys[2].subscriptions.assertEqual(subscribe(310, 310 + 20));
    ys[3].subscriptions.assertEqual(subscribe(350, 400));
    ys[4].subscriptions.assertEqual(subscribe(400, 410));
  });

  test('debounce duration inner error', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onCompleted(550));

    var error = new Error();

    var results = scheduler.startScheduler(function () {
      return xs.debounce(function (x) {
        if (x < 4) {
          return scheduler.createColdObservable(onNext(x * 10, 'Ignore'), onNext(x * 10 + 5, 'Aargh!'));
        } else {
          return scheduler.createColdObservable(onError(x * 10, error));
        }
      });
    });

    results.messages.assertEqual(
      onNext(250 + 2 * 10, 2),
      onNext(350 + 3 * 10, 3),
       onError(450 + 4 * 10, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 490));
  });

  test('debounce duration outer error', function () {
      var error = new Error();

      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(250, 2),
        onNext(350, 3),
        onNext(450, 4),
        onError(460, error));

      var results = scheduler.startScheduler(function () {
        return xs.debounce(function (x) {
          return scheduler.createColdObservable(onNext(x * 10, 'Ignore'), onNext(x * 10 + 5, 'Aargh!'));
        });
      });

      results.messages.assertEqual(
        onNext(250 + 2 * 10, 2),
        onNext(350 + 3 * 10, 3),
        onError(460, error));

      xs.subscriptions.assertEqual(
        subscribe(200, 460));
  });

  test('debounce duration selector throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));

    var results = scheduler.startScheduler(function () {
      return xs.debounce(function (x) {
        if (x < 4) {
          return scheduler.createColdObservable(
            onNext(x * 10, 'Ignore'),
            onNext(x * 10 + 5, 'Aargh!'));
        }
        throw error;
      });
    });

    results.messages.assertEqual(
      onNext(250 + 2 * 10, 2),
      onNext(350 + 3 * 10, 3),
      onError(450, error));

    xs.subscriptions.assertEqual(subscribe(200, 450));
  });

  test('debounce duration InnerDone delay behavior', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(350, 3),
      onNext(450, 4),
      onCompleted(550));

    var results = scheduler.startScheduler(function () {
      return xs.debounce(function (x) {
        return scheduler.createColdObservable(onCompleted(x * 10));
      });
    });
    results.messages.assertEqual(
      onNext(250 + 2 * 10, 2),
      onNext(350 + 3 * 10, 3),
      onNext(450 + 4 * 10, 4),
      onCompleted(550));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

  test('debounce duration inner done debounce behavior', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(250, 2),
      onNext(280, 3),
      onNext(300, 4),
      onNext(400, 5),
      onNext(410, 6),
      onCompleted(550));

    var results = scheduler.startScheduler(function () {
      return xs.debounce(function (x) {
        return scheduler.createColdObservable(onCompleted(x * 10));
      });
    });

    results.messages.assertEqual(
      onNext(250 + 2 * 10, 2),
      onNext(300 + 4 * 10, 4),
      onNext(410 + 6 * 10, 6),
      onCompleted(550));

    xs.subscriptions.assertEqual(
      subscribe(200, 550));
  });

}());
