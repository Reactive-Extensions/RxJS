(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal, ok  */
  QUnit.module('Observer');

  var Observer = Rx.Observer,
    createOnNext = Rx.Notification.createOnNext,
    createOnError = Rx.Notification.createOnError,
    createOnCompleted = Rx.Notification.createOnCompleted;

  test('toObserver notificiation onNext', function () {
    var i = 0;
    var next = function (n) {
      equal(i++, 0);
      equal(n.kind, 'N');
      equal(n.value, 42);
    };
    Observer.fromNotifier(next).onNext(42);
  });

  test('toObserver notificiation onError', function () {
    var error = new Error();

    var i = 0;

    var next = function (n) {
      equal(i++, 0);
      equal(n.kind, 'E');
      equal(n.error, error);
    };
    Observer.fromNotifier(next).onError(error);
  });

  test('toObserver notificiation onCompleted', function () {
    var i = 0;

    var next = function (n) {
      equal(i++, 0);
      equal(n.kind, 'C');
    };

    Observer.fromNotifier(next).onCompleted();
  });

  test('toNotifier forwards', function () {
    var obsn = new MyObserver();
    obsn.toNotifier()(createOnNext(42));
    equal(obsn.hasOnNext, 42);

    var error = new Error();
    var obse = new MyObserver();
    obse.toNotifier()(createOnError(error));
    equal(error, obse.hasOnError);

    var obsc = new MyObserver();
    obsc.toNotifier()(createOnCompleted());
    ok(obsc.hasOnCompleted);
  });

  test('asObserver hides', function () {
    var obs = new MyObserver();

    var res = obs.asObserver();

    ok(obs !== res);
  });

  test('asObserver forwards', function () {
    var obsn = new MyObserver();
    obsn.asObserver().onNext(42);
    equal(obsn.hasOnNext, 42);

    var error = new Error();
    var obse = new MyObserver();
    obse.asObserver().onError(error);
    equal(obse.hasOnError, error);

    var obsc = new MyObserver();
    obsc.asObserver().onCompleted();
    ok(obsc.hasOnCompleted);
  });

  var MyObserver = (function (__super__) {
    Rx.internals.inherits(MyObserver, __super__);
    function MyObserver() {
      __super__.call(this);
    }

    MyObserver.prototype.onNext = function (value) {
      this.hasOnNext = value;
    };

    MyObserver.prototype.onError = function (err) {
      this.hasOnError = err;
    };

    MyObserver.prototype.onCompleted = function () {
      this.hasOnCompleted = true;
    };

    return MyObserver;
  }(Rx.internals.AbstractObserver));

}());
