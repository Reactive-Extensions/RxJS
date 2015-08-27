(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal, notEqual */

  QUnit.module('ConnectableObservableTest');

  var Observable = Rx.Observable,
      Subject = Rx.Subject,
      inherits = Rx.internals.inherits,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  var ConnectableObservable = (function (__super__) {

    function subscribe(observer) {
      return this.o.subscribe(observer);
    }

    inherits(ConnectableObservable,  __super__);

    function ConnectableObservable(o, s) {
      __super__.call(this, subscribe);
      this.o = o.multicast(s);
    }

    ConnectableObservable.prototype.connect = function () {
      return this.o.connect();
    };

    ConnectableObservable.prototype.refCount = function () {
      return this.o.refCount();
    };

    return ConnectableObservable;
  }(Observable));

  var MySubject = (function (__super__) {
    inherits(MySubject, __super__);

    function subscribe(o) {
      var self = this;
      this.subscribeCount++;
      this.o = o;
      return Rx.Disposable.create(function () { self.disposed = true; });
    }

    function MySubject() {
      __super__.call(this, subscribe);
      this.disposeOnMap = {};
      this.subscribeCount = 0;
      this.disposed = false;
    }

    MySubject.prototype.disposeOn = function (value, disposable) {
      this.disposeOnMap[value] = disposable;
    };

    MySubject.prototype.onNext = function (value) {
      this.o.onNext(value);
      this.disposeOnMap[value] && this.disposeOnMap[value].dispose();
    };

    MySubject.prototype.onError = function (e) {
      this.o.onError(e);
    };

    MySubject.prototype.onCompleted = function () {
      this.o.onCompleted();
    };

    return MySubject;
  })(Observable);

  test('ConnectableObservable creation', function () {
    var y = 0;

    var s2 = new Subject();
    var co2 = new ConnectableObservable(Observable.just(1), s2);

    co2.subscribe(function (x) { y = x; });
    notEqual(1, y);

    co2.connect();
    equal(1, y);
  });

  test('ConnectableObservable connected', function () {
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
    conn.connect();

    var res = scheduler.startScheduler(function () { return conn; });

    res.messages.assertEqual(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onNext(240, 4),
      onCompleted(250)
    );
  });

  test('ConnectableObservable not connected', function () {
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

    var res = scheduler.startScheduler(function () { return conn; });

    res.messages.assertEqual();
  });

  test('ConnectableObservable disconnected', function () {
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
    var disconnect = conn.connect();
    disconnect.dispose();

    var res = scheduler.startScheduler(function () { return conn; });

    res.messages.assertEqual();
  });

  test('ConnectableObservable disconnect future', function () {
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
    subject.disposeOn(3, conn.connect());

    var res = scheduler.startScheduler(function () { return conn; });

    res.messages.assertEqual(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3)
    );
  });

  test('ConnectableObservable multiple non-overlapped connections', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 1),
      onNext(220, 2),
      onNext(230, 3),
      onNext(240, 4),
      onNext(250, 5),
      onNext(260, 6),
      onNext(270, 7),
      onNext(280, 8),
      onNext(290, 9),
      onCompleted(300)
    );

    var subject = new Subject();

    var conn = xs.multicast(subject);

    var c1;
    scheduler.scheduleAbsolute(null, 225, function () { c1 = conn.connect(); });
    scheduler.scheduleAbsolute(null, 241, function () { c1.dispose(); });
    scheduler.scheduleAbsolute(null, 245, function () { c1.dispose(); }); // idempotency test
    scheduler.scheduleAbsolute(null, 251, function () { c1.dispose(); }); // idempotency test
    scheduler.scheduleAbsolute(null, 260, function () { c1.dispose(); }); // idempotency test

    var c2;
    scheduler.scheduleAbsolute(null, 249, function () { c2 = conn.connect(); });
    scheduler.scheduleAbsolute(null, 255, function () { c2.dispose(); });
    scheduler.scheduleAbsolute(null, 265, function () { c2.dispose(); }); // idempotency test
    scheduler.scheduleAbsolute(null, 280, function () { c2.dispose(); }); // idempotency test

    var c3;
    scheduler.scheduleAbsolute(null, 275, function () { c3 = conn.connect(); });
    scheduler.scheduleAbsolute(null, 295, function () { c3.dispose(); });

    var res = scheduler.startScheduler(function () { return conn; });

    res.messages.assertEqual(
      onNext(230, 3),
      onNext(240, 4),
      onNext(250, 5),
      onNext(280, 8),
      onNext(290, 9)
    );

    xs.subscriptions.assertEqual(
      subscribe(225, 241),
      subscribe(249, 255),
      subscribe(275, 295)
    );
  });

}());
