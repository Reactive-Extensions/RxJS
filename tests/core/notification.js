(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal, ok */

  QUnit.module('Notification');

  var createOnNext = Rx.Notification.createOnNext,
      createOnError = Rx.Notification.createOnError,
      createOnCompleted = Rx.Notification.createOnCompleted,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      inherits = Rx.internals.inherits;

  test('onNext constructor and properties', function () {
    var n = createOnNext(42);

    equal('N', n.kind);

    equal(42, n.value);
  });

  test('onNext toString', function () {
      var n1 = createOnNext(42);

      ok(n1.toString().indexOf('OnNext') !== -1);
      ok(n1.toString().indexOf('42') !== -1);
  });

  var CheckOnNextObserver = (function (__super__) {
    inherits(CheckOnNextObserver, __super__);

    function CheckOnNextObserver() {
      __super__.call(this);
      this.value = null;
    }

    CheckOnNextObserver.prototype.onNext = function (value) {
      return this.value = value;
    };

    return CheckOnNextObserver;
  }(Rx.Observer));

  test('onNext acceptObserver', function () {
    var con = new CheckOnNextObserver();

    var n1 = createOnNext(42);
    n1.accept(con);

    equal(42, con.value);
  });

  var AcceptObserver = (function (__super__) {
    inherits(AcceptObserver, __super__);

    function AcceptObserver(onNext, onError, onCompleted) {
      __super__.call(this);
      this._onNext = onNext;
      this._onError = onError;
      this._onCompleted = onCompleted;
    }

    AcceptObserver.prototype.onNext = function (value) {
      return this._onNext(value);
    };

    AcceptObserver.prototype.onError = function (exception) {
      return this._onError(exception);
    };

    AcceptObserver.prototype.onCompleted = function () {
      return this._onCompleted();
    };

    return AcceptObserver;
  }(Rx.Observer));

  test('onNext accept Observer with result', function () {
    var n1 = createOnNext(42);

    var results = n1.accept(new AcceptObserver(
      function () {
        return 'OK';
      },
      function () {
        ok(false);
        return false;
      },
      function () {
        ok(false);
        return false;
    }));

    equal('OK', results);
  });

  test('onNext accept action', function () {
    var obs = false;

    var n1 = createOnNext(42);

    n1.accept(
      function () {
        obs = true;
      },
      function () {
        ok(false);
      },
      function () {
        ok(false);
      }
    );

    ok(obs);
  });

  test('onNext accept action with result', function () {
    var n1 = createOnNext(42);

    var results = n1.accept(
      function () {
        return 'OK';
      },
      function () {
        ok(false);
      },
      function () {
        ok(false);
      }
    );

    equal('OK', results);
  });

  test('onError constructor and properties', function () {
    var error = new Error();

    var n = createOnError(error);

    equal('E', n.kind);
    equal(error, n.error);
  });

  test('onError ToString', function () {
    var error = new Error('woops');

    var n1 = createOnError(error);

    ok(n1.toString().indexOf('OnError') !== -1);
    ok(n1.toString().indexOf('woops') !== -1);
  });

  var CheckOnErrorObserver = (function (__super__) {

    inherits(CheckOnErrorObserver, __super__);

    function CheckOnErrorObserver() {
      __super__.call(this);
      this.error = null;
    }

    CheckOnErrorObserver.prototype.onError = function (exception) {
      this.error = exception;
    };

    return CheckOnErrorObserver;

  }(Rx.Observer));

  test('onError accept observer', function () {
    var error = new Error();

    var obs = new CheckOnErrorObserver();

    var n1 = createOnError(error);

    n1.accept(obs);

    equal(error, obs.error);
  });

  test('onError accept observer with result', function () {
    var error = new Error();

    var n1 = createOnError(error);

    var results = n1.accept(new AcceptObserver(
      function () {
        ok(false);
      },
      function () {
        return 'OK';
      },
      function () {
        ok(false);
      }
    ));

    equal('OK', results);
  });

  test('onError accept action', function () {
    var error = new Error();

    var obs = false;

    var n1 = createOnError(error);

    n1.accept(
      function () {
        ok(false);
      },
      function () {
        obs = true;
      },
      function () {
        ok(false);
      }
    );

    ok(obs);
  });

  test('onError accept action with result', function () {
    var error = new Error();

    var n1 = createOnError(error);

    var results = n1.accept(
      function () {
        ok(false);
      },
      function () {
        return 'OK';
      },
      function () {
        ok(false);
      }
    );
    equal('OK', results);
  });

  test('onCompleted constructor and properties', function () {
    var n = createOnCompleted();

    equal('C', n.kind);
    equal(null, n.error);
    equal(null, n.value);
  });

  test('onCompleted toString', function () {
    var n1 = createOnCompleted();

    ok(n1.toString().indexOf('OnCompleted') !== -1);
  });

  var CheckOnCompletedObserver = (function (__super__) {

    inherits(CheckOnCompletedObserver, __super__);

    function CheckOnCompletedObserver() {
      __super__.call(this);
      this.completed = false;
    }

    CheckOnCompletedObserver.prototype.onCompleted = function () {
      this.completed = true;
    };

    return CheckOnCompletedObserver;
  }(Rx.Observer));

  test('onCompleted accept observer', function () {
    var obs = new CheckOnCompletedObserver();

    var n1 = createOnCompleted();

    n1.accept(obs);

    ok(obs.completed);
  });

  test('onCompleted accept observer with result', function () {
    var n1 = createOnCompleted();

    var results = n1.accept(new AcceptObserver(
      function () {
        ok(false);
      },
      function () {
        ok(false);
      },
      function () {
        return 'OK';
      }
    ));

    equal('OK', results);
  });

  test('onCompleted accept action', function () {
    var obs = false;

    var n1 = createOnCompleted();

    n1.accept(
      function () {
        ok(false);
      },
      function () {
        ok(false);
      },
      function () {
        obs = true;
      }
    );

    ok(obs);
  });

  test('onCompleted accept action with result', function () {
    var n1 = createOnCompleted();

    var results = n1.accept(
      function () {
        ok(false);
      },
      function () {
        ok(false);
      },
      function () {
        return 'OK';
      }
    );

    equal('OK', results);
  });

  test('toObservable empty', function () {
    var scheduler = new Rx.TestScheduler();

    var results = scheduler.startScheduler(function () {
      return createOnCompleted().toObservable(scheduler);
    });

    results.messages.assertEqual(
      onCompleted(201)
    );
  });

  test('toObservable just', function () {
    var scheduler = new Rx.TestScheduler();

    var results = scheduler.startScheduler(function () {
      return createOnNext(42).toObservable(scheduler);
    });

    results.messages.assertEqual(
      onNext(201, 42),
      onCompleted(201)
    );
  });

  test('toObservable throwError', function () {
    var error = new Error();

    var scheduler = new Rx.TestScheduler();

    var results = scheduler.startScheduler(function () {
      return createOnError(error).toObservable(scheduler);
    });

    results.messages.assertEqual(
      onError(201, error)
    );
  });

}());
