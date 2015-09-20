(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal, ok */
  QUnit.module('publish');

  var TestScheduler = Rx.TestScheduler,
      Observable = Rx.Observable,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe,
      created = Rx.ReactiveTest.created,
      disposed = Rx.ReactiveTest.disposed,
      subscribed = Rx.ReactiveTest.subscribed,
      inherits = Rx.internals.inherits;

  function add(x, y) { return x + y; }

  test('publish Cold Zip', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(40, 0),
      onNext(90, 1),
      onNext(150, 2),
      onNext(210, 3),
      onNext(240, 4),
      onNext(270, 5),
      onNext(330, 6),
      onNext(340, 7),
      onCompleted(390)
    );

    var results = scheduler.startScheduler(function () {
      return xs.publish(function (ys) { return ys.zip(ys, add); });
    });

    results.messages.assertEqual(
      onNext(210, 6),
      onNext(240, 8),
      onNext(270, 10),
      onNext(330, 12),
      onNext(340, 14),
      onCompleted(390)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 390)
    );
  });

  var MySubject = (function (__super__) {
    inherits(MySubject, __super__);
    function MySubject() {
      __super__.call(this);
      this.disposeOnMap = {};
      this.subscribeCount = 0;
      this.disposed = false;
    }

    MySubject.prototype._subscribe = function (o) {
      this.subscribeCount++;
      this.observer = o;

      var self = this;
      return Rx.Disposable.create(function () { self.disposed = true; });
    };

    MySubject.prototype.disposeOn = function (value, disposable) {
      this.disposeOnMap[value] = disposable;
    };

    MySubject.prototype.onNext = function (value) {
      this.observer.onNext(value);
      this.disposeOnMap[value] && this.disposeOnMap[value].dispose();
    };

    MySubject.prototype.onError = function (exception) {
        this.observer.onError(exception);
    };

    MySubject.prototype.onCompleted = function () {
        this.observer.onCompleted();
    };

    return MySubject;
  })(Observable);

  var ConnectableObservable = (function (__super__) {
    inherits(ConnectableObservable, __super__);
    function ConnectableObservable(o, s) {
      __super__.call(this);
      this._o = o.multicast(s);
    }

    ConnectableObservable.prototype._subscribe = function (o) { return this._o.subscribe(o); };
    ConnectableObservable.prototype.connect = function () { return this._o.connect(); };
    ConnectableObservable.prototype.refCount = function () { return this._o.refCount(); };

    return ConnectableObservable;
  }(Observable));

  test('refCount connects on first', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onNext(240, 4),
      onCompleted(250)
    );

    var subject = new MySubject();

    var conn = new ConnectableObservable(xs, subject);

    var results = scheduler.startScheduler(function () {
      return conn.refCount();
    });

    results.messages.assertEqual(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onNext(240, 4),
      onCompleted(250)
    );

    ok(subject.disposed);
  });

  test('refCount not connected', function () {
    var disconnected = false;

    var count = 0;

    var xs = Observable.defer(function () {
      count++;
      return Observable.create(function () {
        return function () { disconnected = true; };
      });
    });

    var subject = new MySubject();
    var conn = new ConnectableObservable(xs, subject);

    var refd = conn.refCount();
    var dis1 = refd.subscribe();

    equal(1, count);
    equal(1, subject.subscribeCount);
    ok(!disconnected);

    var dis2 = refd.subscribe();
    equal(1, count);
    equal(2, subject.subscribeCount);
    ok(!disconnected);

    dis1.dispose();
    ok(!disconnected);

    dis2.dispose();
    ok(disconnected);

    disconnected = false;

    var dis3 = refd.subscribe();
    equal(2, count);
    equal(3, subject.subscribeCount);
    ok(!disconnected);

    dis3.dispose();
    ok(disconnected);
  });

  test('publish basic', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 7),
      onNext(220, 3),
      onNext(280, 4),
      onNext(290, 1),
      onNext(340, 8),
      onNext(360, 5),
      onNext(370, 6),
      onNext(390, 7),
      onNext(410, 13),
      onNext(430, 2),
      onNext(450, 9),
      onNext(520, 11),
      onNext(560, 20),
      onCompleted(600)
    );

    var ys;
    var subscription;
    var connection;

    var results = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, created, function () {
      ys = xs.publish();
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      subscription = ys.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      subscription.dispose();
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      connection.dispose();
    });

    scheduler.scheduleAbsolute(null, 500, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 550, function () {
      connection.dispose();
    });

    scheduler.scheduleAbsolute(null, 650, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 800, function () {
      connection.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(340, 8),
      onNext(360, 5),
      onNext(370, 6),
      onNext(390, 7),
      onNext(520, 11)
    );

    xs.subscriptions.assertEqual(
      subscribe(300, 400),
      subscribe(500, 550),
      subscribe(650, 800)
    );
  });

  test('publish Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 7),
      onNext(220, 3),
      onNext(280, 4),
      onNext(290, 1),
      onNext(340, 8),
      onNext(360, 5),
      onNext(370, 6),
      onNext(390, 7),
      onNext(410, 13),
      onNext(430, 2),
      onNext(450, 9),
      onNext(520, 11),
      onNext(560, 20),
      onError(600, error)
    );

    var results = scheduler.createObserver();

    var ys;
    var subscription;
    var connection;

    scheduler.scheduleAbsolute(null, created, function () {
      ys = xs.publish();
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      subscription = ys.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      subscription.dispose();
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      connection.dispose();
    });

    scheduler.scheduleAbsolute(null, 500, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 800, function () {
      connection.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(340, 8),
      onNext(360, 5),
      onNext(370, 6),
      onNext(390, 7),
      onNext(520, 11),
      onNext(560, 20),
      onError(600, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(300, 400),
      subscribe(500, 600)
    );
  });

  test('publish complete', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 7),
      onNext(220, 3),
      onNext(280, 4),
      onNext(290, 1),
      onNext(340, 8),
      onNext(360, 5),
      onNext(370, 6),
      onNext(390, 7),
      onNext(410, 13),
      onNext(430, 2),
      onNext(450, 9),
      onNext(520, 11),
      onNext(560, 20),
      onCompleted(600)
    );

    var results = scheduler.createObserver();

    var ys;
    var subscription;
    var connection;

    scheduler.scheduleAbsolute(null, created, function () {
      ys = xs.publish();
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      subscription = ys.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      subscription.dispose();
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      connection.dispose();
    });

    scheduler.scheduleAbsolute(null, 500, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 800, function () {
      connection.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(520, 11), onNext(560, 20), onCompleted(600));

    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
  });

  test('publish dispose', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 7),
      onNext(220, 3),
      onNext(280, 4),
      onNext(290, 1),
      onNext(340, 8),
      onNext(360, 5),
      onNext(370, 6),
      onNext(390, 7),
      onNext(410, 13),
      onNext(430, 2),
      onNext(450, 9),
      onNext(520, 11),
      onNext(560, 20),
      onCompleted(600)
    );

    var results = scheduler.createObserver();

    var ys;
    var subscription;
    var connection;

    scheduler.scheduleAbsolute(null, created, function () {
      ys = xs.publish();
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      subscription = ys.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, 350, function () {
      subscription.dispose();
    });

    scheduler.scheduleAbsolute(null, 300, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      connection.dispose();
    });

    scheduler.scheduleAbsolute(null, 500, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 550, function () {
      connection.dispose();
    });

    scheduler.scheduleAbsolute(null, 650, function () {
      connection = ys.connect();
    });

    scheduler.scheduleAbsolute(null, 800, function () {
      connection.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(340, 8)
    );

    xs.subscriptions.assertEqual(
      subscribe(300, 400),
      subscribe(500, 550),
      subscribe(650, 800)
    );
  });

  test('publish multiple connections', function () {
      var xs = Observable.never();

      var ys = xs.publish();

      var connection1 = ys.connect();
      var connection2 = ys.connect();

      ok(connection1 === connection2);

      connection1.dispose();
      connection2.dispose();

      var connection3 = ys.connect();

      ok(connection1 !== connection3);

      connection3.dispose();
  });

  test('publishLambda zip complete', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 7),
      onNext(220, 3),
      onNext(280, 4),
      onNext(290, 1),
      onNext(340, 8),
      onNext(360, 5),
      onNext(370, 6),
      onNext(390, 7),
      onNext(410, 13),
      onNext(430, 2),
      onNext(450, 9),
      onNext(520, 11),
      onNext(560, 20),
      onCompleted(600)
    );

    var results = scheduler.startScheduler(function () {
      return xs.publish(function (_xs) {
        return _xs.zip(_xs.skip(1), add);
      });
    });

    results.messages.assertEqual(onNext(280, 7), onNext(290, 5), onNext(340, 9), onNext(360, 13), onNext(370, 11), onNext(390, 13), onNext(410, 20), onNext(430, 15), onNext(450, 11), onNext(520, 20), onNext(560, 31), onCompleted(600));

    xs.subscriptions.assertEqual(subscribe(200, 600));
  });

  test('publishLambda zip error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 7),
      onNext(220, 3),
      onNext(280, 4),
      onNext(290, 1),
      onNext(340, 8),
      onNext(360, 5),
      onNext(370, 6),
      onNext(390, 7),
      onNext(410, 13),
      onNext(430, 2),
      onNext(450, 9),
      onNext(520, 11),
      onNext(560, 20),
      onError(600, error)
    );

    var results = scheduler.startScheduler(function () {
      return xs.publish(function (_xs) {
        return _xs.zip(_xs.skip(1), add);
      });
    });

    results.messages.assertEqual(
      onNext(280, 7),
      onNext(290, 5),
      onNext(340, 9),
      onNext(360, 13),
      onNext(370, 11),
      onNext(390, 13),
      onNext(410, 20),
      onNext(430, 15),
      onNext(450, 11),
      onNext(520, 20),
      onNext(560, 31),
      onError(600, error)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 600)
    );
  });

  test('publishLambda zip dispose', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(110, 7),
      onNext(220, 3),
      onNext(280, 4),
      onNext(290, 1),
      onNext(340, 8),
      onNext(360, 5),
      onNext(370, 6),
      onNext(390, 7),
      onNext(410, 13),
      onNext(430, 2),
      onNext(450, 9),
      onNext(520, 11),
      onNext(560, 20),
      onCompleted(600)
    );

    var results = scheduler.startScheduler(function () {
      return xs.publish(function (_xs) { return _xs.zip(_xs.skip(1), add); });
    }, { disposed: 470 });

    results.messages.assertEqual(
      onNext(280, 7),
      onNext(290, 5),
      onNext(340, 9),
      onNext(360, 13),
      onNext(370, 11),
      onNext(390, 13),
      onNext(410, 20),
      onNext(430, 15),
      onNext(450, 11)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 470)
    );
  });

}());
