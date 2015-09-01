(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal, notDeepEqual, ok, raises */

  QUnit.module('Observer');

  var Observer = Rx.Observer,
      createOnNext = Rx.Notification.createOnNext,
      createOnError = Rx.Notification.createOnError,
      createOnCompleted = Rx.Notification.createOnCompleted;

  test('fromNotifier notification onNext', function () {
    var i = 0;

    var next = function (n) {
      equal(i++, 0);
      equal(n.kind, 'N');
      equal(n.value, 42);
      equal(n.exception, undefined);
    };

    Observer.fromNotifier(next).onNext(42);
  });

  test('fromNotifier notification onError', function () {
    var error = new Error();

    var i = 0;

    var next = function (n) {
      equal(i++, 0);
      equal(n.kind, 'E');
      equal(n.exception, error);
    };

    Observer.fromNotifier(next).onError(error);
  });

  test('fromNotifier NotificationOnCompleted', function () {
    var i = 0;

    var next = function (n) {
      equal(i++, 0);
      equal(n.kind, 'C');
      ok(!n.hasValue);
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

  test('create onNext', function () {
    var next = false;
    var res = Observer.create(function (x) {
      equal(42, x);
      next = true;
    });

    res.onNext(42);

    ok(next);

    res.onCompleted();
  });

  test('create OnNext has error', function () {
    var e_;
    var error = new Error();
    var next = false;
    var res = Observer.create(function (x) {
        equal(42, x);
        next = true;
    });

    res.onNext(42);
    ok(next);

    try {
        res.onError(error);
        ok(false);
    } catch (e) {
        e_ = e;
    }
    equal(error, e_);
  });

  test('create OnNext OnCompleted', function () {
    var next = false;

    var completed = false;

    var res = Observer.create(function (x) {
        equal(42, x);
        next = true;
    }, null, function () {
        completed = true;
    });

    res.onNext(42);

    ok(next);
    ok(!completed);

    res.onCompleted();

    ok(completed);
  });

  test('Create OnNext OnCompleted Has Error', function () {
    var e_;
    var error = new Error();

    var next = false;

    var completed = false;

    var res = Observer.create(
      function (x) {
        equal(42, x);
        next = true;
      },
      null,
      function () {
        completed = true;
      }
    );

    res.onNext(42);
    ok(next);
    ok(!completed);

    try {
      res.onError(error);
      ok(false);
    } catch (e) {
      e_ = e;
    }

    equal(error, e_);
    ok(!completed);
  });

  test('Create OnNext OnError', function () {
    var error = new Error();

    var next = true;

    var hasError = false;

    var res = Observer.create(function (x) {
      equal(42, x);
      next = true;
    }, function (e) {
      equal(error, e);
      hasError = true;
    });

    res.onNext(42);

    ok(next);
    ok(!hasError);

    res.onError(error);
    ok(hasError);
  });

  test('Create OnNext OnError Hit Completed', function () {
    var error = new Error();

    var next = true;

    var hasError = false;

    var res = Observer.create(function (x) {
      equal(42, x);
      next = true;
    }, function (e) {
      equal(error, e);
      hasError = true;
    });

    res.onNext(42);
    ok(next);
    ok(!hasError);

    res.onCompleted();

    ok(!hasError);
  });

  test('Create OnNext OnError OnCompleted 1', function () {
    var error = new Error();

    var next = true;

    var hasError = false;
    var completed = false;

    var res = Observer.create(function (x) {
      equal(42, x);
      next = true;
    }, function (e) {
      equal(error, e);
      hasError = true;
    }, function () {
      completed = true;
    });

    res.onNext(42);

    ok(next);
    ok(!hasError);
    ok(!completed);

    res.onCompleted();

    ok(completed);
    ok(!hasError);
  });

  test('Create OnNext OnError OnCompleted 2', function () {
    var error = new Error();

    var next = true;

    var hasError = false;

    var completed = false;

    var res = Observer.create(function (x) {
      equal(42, x);
      next = true;
    }, function (e) {
      equal(error, e);
      hasError = true;
    }, function () {
      completed = true;
    });

    res.onNext(42);

    ok(next);
    ok(!hasError);
    ok(!completed);

    res.onError(error);

    ok(!completed);
    ok(hasError);
  });

  function MyObserver() {
    var obs = new Observer();
    obs.onNext = function onNext(value) { this.hasOnNext = value; };
    obs.onError = function onError (err) { this.hasOnError = err; };
    obs.onCompleted = function onCompleted () { this.hasOnCompleted = true; };

    return obs;
  }

  test('AsObserver Hides', function () {
      var obs, res;
      obs = new MyObserver();
      res = obs.asObserver();
      notDeepEqual(obs, res);
  });

  test('AsObserver Forwards', function () {
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

  test('Observer Checked Already Terminated Completed', function () {
    var m = 0, n = 0;
    var o = Observer.create(function () {
      m++;
    }, function () {
      ok(false);
    }, function () {
      n++;
    }).checked();

    o.onNext(1);
    o.onNext(2);
    o.onCompleted();

    raises(function () { o.onCompleted(); });
    raises(function () { on.onError(new Error('error')); });
    equal(2, m);
    equal(1, n);
  });

  test('Observer_Checked_AlreadyTerminated_Error', function () {
      var m = 0, n = 0;
      var o = Observer.create(function () {
          m++;
      }, function () {
          n++;
      }, function () {
          ok(false);
      }).checked();

      o.onNext(1);
      o.onNext(2);
      o.onError(new Error('error'));

      raises(function () { o.onCompleted(); });
      raises(function () { o.onError(new Error('error')); });

      equal(2, m);
      equal(1, n);
  });

  test('Observer_Checked_Reentrant_Next', function () {
      var n = 0;
      var o;
      o = Observer.create(function () {
          n++;
          raises(function () { o.onNext(9); });
          raises(function () { o.onError(new Error('error')); });
          raises(function () { o.onCompleted(); });
      }, function () {
          ok(false);
      }, function () {
          ok(false);
      }).checked();

      o.onNext(1);
      equal(1, n);
  });

  test('Observer_Checked_Reentrant_Error', function () {
      var n = 0;
      var o;
      o = Observer.create(function () {
          ok(false);
      }, function () {
          n++;
          raises(function () { o.onNext(9); });
          raises(function () { o.onError(new Error('error')); });
          raises(function () { o.onCompleted(); });
      }, function () {
          ok(false);
      }).checked();

      o.onError(new Error('error'));
      equal(1, n);
  });

  test('Observer_Checked_Reentrant_Completed', function () {
      var n = 0;
      var o = Observer.create(function () {
          ok(false);
      }, function () {
          ok(false);
      }, function () {
          n++;
          raises(function () { o.onNext(9); });
          raises(function () { o.onError(new Error('error')); });
          raises(function () { o.onCompleted(); });
      }).checked();

      o.onCompleted();
      equal(1, n);
  });

}());
