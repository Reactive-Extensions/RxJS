(function () {
  QUnit.module('Observable');

  var Scheduler = Rx.Scheduler,
      Observable = Rx.Observable;

  test('Subscribe_None_Return', function () {
    Observable.just(1).subscribe();

    ok(true);
  });

  test('Subscribe_None_Throw', function () {
    var e, error = new Error();

    try {
      Observable['throw'](error).subscribe();
    } catch (e1) {
      e = e1;
    }

    equal(e, error);
  });

  test('Subscribe_None_Empty', function () {
    Observable.empty().subscribe(function () {
      ok(false);
    });

    ok(true);
  });

  test('Subscribe_OnNext_Return', function () {
    var x1;
    Observable.just(42).subscribe(function (x) { x1 = x; });
    equal(42, x1);
  });

  test('Subscribe_OnNext_Throw', function () {
    var e;
    var error = new Error();

    try {
      Observable['throw'](error).subscribe(function () { ok(false); });
    } catch (e1) {
      e = e1;
    }

    equal(e, error);
  });

  test('Subscribe_OnNext_Empty', function () {
    Observable.empty().subscribe(function (x) {
      ok(false);
    });

    ok(true);
  });

  test('Subscribe_OnNext_Empty', function () {
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

  test('Subscribe_OnNextOnCompleted_Throw', function () {
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

  test('Subscribe_OnNextOnCompleted_Empty', function () {
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

  test('SubscribeNext_Empty', function () {
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

  test('SubscribeNext_Next', function () {
    var val;
    Observable.just(42).subscribeOnNext(function (v) {
      val = v;
    });
    equal(42, val);
  });

  test('SubscribeNext_ThisArg', function () {
    var val, thisArg = 56;

    Observable.just(42).subscribeOnNext(function (v) {
      val = v;
      equal(this, thisArg);
    }, thisArg);

    equal(42, val);
  });

  test('SubscribeError_Empty', function () {
    Observable.empty().subscribeOnError(function () {
      ok(false);
    });

    ok(true);
  });

  test('SubscribeError_Throw', function () {
    var error = new Error, err;

    Observable['throw'](error).subscribeOnError(function (e) {
      err = e;
    });

    equal(err, error);
  });

  test('SubscribeError_Next', function () {
    Observable.just(42).subscribeOnError(function () {
      ok(false);
    });

    ok(true);
  });

  test('SubscribeError_ThisArg', function () {
    var thisArg = 56, that;
    Observable['throw'](new Error()).subscribeOnError(function () {
      that = this;;
    }, thisArg);

    equal(thisArg, that);
  });

  test('SubscribeCompleted_Empty', function () {
    var hit = false;
    Observable.empty().subscribeOnCompleted(function () {
      hit = true;
    });

    ok(hit);
  });

  test('SubscribeCompleted_Throw', function () {
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

  test('SubscribeCompleted_Next', function () {
    var hit = false;
    Observable.just(42).subscribeOnCompleted(function () {
      hit = true;
    });
    ok(hit);
  });

  test('SubscribeCompleted_ThisArg', function () {
    var thisArg = 56, that;
    Observable.just(42).subscribeOnCompleted(function () {
      that = this;
    }, thisArg);
    equal(that, thisArg);
  });

}());
