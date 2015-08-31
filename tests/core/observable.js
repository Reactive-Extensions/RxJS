(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal, ok */

  QUnit.module('Observable');

  var Observable = Rx.Observable;

  test('subscribe none return', function () {
    Observable.just(1).subscribe();

    ok(true);
  });

  test('subscribe none throw', function () {
    var e, error = new Error();

    try {
      Observable['throw'](error).subscribe();
    } catch (e1) {
      e = e1;
    }

    equal(e, error);
  });

  test('subscribe none return', function () {
    Observable.empty().subscribe(function () {
      ok(false);
    });

    ok(true);
  });

  test('subscribe onNext return', function () {
    var x1;
    Observable.just(42).subscribe(function (x) { x1 = x; });
    equal(42, x1);
  });

  test('subscribe onNext throw', function () {
    var e;
    var error = new Error();

    try {
      Observable['throw'](error).subscribe(function () { ok(false); });
    } catch (e1) {
      e = e1;
    }

    equal(e, error);
  });

  test('subscribe onNext empty', function () {
    Observable.empty().subscribe(function () {
      ok(false);
    });

    ok(true);
  });

  test('subscribe onNext empty finished', function () {
    var finished = false, x1 = -1;

    Observable.just(42).subscribe(
      function (x) {
        x1 = x;
      },
      null,
      function () {
        finished = true;
      });

    equal(42, x1);
    ok(finished);
  });

  test('subscribe onNext, onCompleted throw', function () {
    var e;
    var error = new Error();

    try {
      Observable['throw'](error).subscribe(
        function () {
          ok(false);
        },
        null,
        function () {
          ok(false);
        });
    } catch (e1) {
      e = e1;
    }

    equal(error, e);
  });

  test('subscribe onNext onCompleted empty', function () {
    var finished = false;
    Observable.empty().subscribe(
      function () {
        ok(false);
      },
      null,
      function () {
        finished = true;
      });

    ok(finished);
  });

  test('subscribeOnNext next empty', function () {
    Observable.empty().subscribeOnNext(function () {
      ok(false);
    });

    ok(true);
  });

  test('SubscribeNext_Throw', function () {
    var error = new Error(), e1;

    try {
      Observable['throw'](error).subscribeOnNext(function () {
        ok(false);
      });
    } catch (e) {
      e1 = e;
    }

    equal(error, e1);
  });

  test('subscribeOnNext return', function () {
    var val;

    Observable.just(42).subscribeOnNext(function (v) {
      val = v;
    });

    equal(42, val);
  });

  test('subscribeonNext thisArg', function () {
    var val, thisArg = 56;

    Observable.just(42).subscribeOnNext(function (v) {
      val = v;
      equal(this, thisArg);
    }, thisArg);

    equal(42, val);
  });

  test('subscribeOnError empty', function () {
    Observable.empty().subscribeOnError(function () {
      ok(false);
    });

    ok(true);
  });

  test('subscribeOnError throw', function () {
    var error = new Error(), err;

    Observable['throw'](error).subscribeOnError(function (e) {
      err = e;
    });

    equal(err, error);
  });

  test('subscirbeOnError next', function () {
    Observable.just(42).subscribeOnError(function () {
      ok(false);
    });

    ok(true);
  });

  test('subscribeOnError thisArg', function () {
    var thisArg = 56, that;
    Observable['throw'](new Error()).subscribeOnError(function () {
      that = this;
    }, thisArg);

    equal(thisArg, that);
  });

  test('subscribeOnCompleted empty', function () {
    var hit = false;
    Observable.empty().subscribeOnCompleted(function () {
      hit = true;
    });

    ok(hit);
  });

  test('subscribeOnCompleted throw', function () {
    var error = new Error(), e1;
    try {
      Observable['throw'](error).subscribeOnCompleted(function () {
        ok(false);
      });
    } catch (e) {
      e1 = e;
    }
    equal(error, e1);
  });

  test('subscribeOnCompleted completed', function () {
    var hit = false;

    Observable.just(42).subscribeOnCompleted(function () {
      hit = true;
    });

    ok(hit);
  });

  test('subscribeOnCompleted thisArg', function () {
    var thisArg = 56, that;

    Observable.just(42).subscribeOnCompleted(function () {
      that = this;
    }, thisArg);

    equal(that, thisArg);
  });

}());
