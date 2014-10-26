QUnit.module('Observable');

var Scheduler = Rx.Scheduler,
    Observable = Rx.Observable;

test('Subscribe_None_Return', function () {
  Observable.just(1, Scheduler.immediate).subscribe();

  ok(true);
});

test('Subscribe_None_Throw', function () {
  var e, error = new Error();

  try {
    Observable.throwError(error, Scheduler.immediate).subscribe();
  } catch (e1) {
    e = e1;
  }

  equal(e, error);
});

test('Subscribe_None_Empty', function () {
  Observable.empty(Scheduler.immediate).subscribe(function () {
    ok(false);
  });

  ok(true);
});

test('Subscribe_OnNext_Return', function () {
  var x1;
  Observable.just(42, Scheduler.immediate).subscribe(function (x) { x1 = x; });
  equal(42, x1);
});

test('Subscribe_OnNext_Throw', function () {
  var e;
  var error = new Error();

  try {
    Observable.throwError(error, Scheduler.immediate).subscribe(function () { ok(false); });
  } catch (e1) {
    e = e1;
  }

  equal(e, error);
});

test('Subscribe_OnNext_Empty', function () {
  Observable.empty(Scheduler.immediate).subscribe(function (x) {
    ok(false);
  });

  ok(true);
});

test('Subscribe_OnNext_Empty', function () {
  var finished = false, x1 = -1;

  Observable.just(42, Scheduler.immediate).subscribe(
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
    Observable.throwError(error, Scheduler.immediate).subscribe(
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
  Observable.empty(Scheduler.immediate).subscribe(
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
  Observable.empty(Scheduler.immediate).subscribeOnNext(function () {
    ok(false);
  });

  ok(true);
});

test('SubscribeNext_Throw', function () {
  var error = new Error(), e1;

  try {
    Observable.throwError(error, Scheduler.immediate).subscribeOnNext(function () {
      ok(false);
    });
  } catch (e) {
    e1 = e;
  }

  equal(error, e1);
});

test('SubscribeNext_Next', function () {
  var val;
  Observable.just(42, Scheduler.immediate).subscribeOnNext(function (v) {
    val = v;
  });
  equal(42, val);
});

test('SubscribeNext_ThisArg', function () {
  var val, thisArg = 56;

  Observable.just(42, Scheduler.immediate).subscribeOnNext(function (v) {
    val = v;
    equal(this, thisArg);
  }, thisArg);

  equal(42, val);
});

test('SubscribeError_Empty', function () {
  Observable.empty(Scheduler.immediate).subscribeOnError(function () {
    ok(false);
  });

  ok(true);
});

test('SubscribeError_Throw', function () {
  var error = new Error, err;

  Observable.throwError(error, Scheduler.immediate).subscribeOnError(function (e) {
    err = e;
  });

  equal(err, error);
});

test('SubscribeError_Next', function () {
  Observable.just(42, Scheduler.immediate).subscribeOnError(function () {
    ok(false);
  });

  ok(true);
});

test('SubscribeError_ThisArg', function () {
  var thisArg = 56, that;
  Observable.throwError(new Error(), Scheduler.immediate).subscribeOnError(function () {
    that = this;;
  }, thisArg);

  equal(thisArg, that);
});

test('SubscribeCompleted_Empty', function () {
  var hit = false;
  Observable.empty(Scheduler.immediate).subscribeOnCompleted(function () {
    hit = true;
  });

  ok(hit);
});

test('SubscribeCompleted_Throw', function () {
  var error = new Error(), e1;
  try {
    Observable.throwError(error, Scheduler.immediate).subscribeOnCompleted(function () {
      ok(false);
    });
  } catch (e) {
    e1 = e;
  }
  equal(error, e1);
});

test('SubscribeCompleted_Next', function () {
  var hit = false;
  Observable.just(42, Scheduler.immediate).subscribeOnCompleted(function () {
    hit = true;
  });
  ok(hit);
});

test('SubscribeCompleted_ThisArg', function () {
  var thisArg = 56, that;
  Observable.just(42, Scheduler.immediate).subscribeOnCompleted(function () {
    that = this;
  }, thisArg);
  equal(that, thisArg);
});
