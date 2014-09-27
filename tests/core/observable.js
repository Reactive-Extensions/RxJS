QUnit.module('Observable');

var Scheduler = Rx.Scheduler,
    Observable = Rx.Observable;

test('Subscribe_None_Return', function () {
    Observable.returnValue(1, Scheduler.immediate).subscribe();
    ok(true);
});

test('Subscribe_None_Throw', function () {
    var e, ex;
    ex = 'ex';
    try {
        Observable.throwException(ex, Scheduler.immediate).subscribe();
    } catch (e1) {
        e = e1;
    }
    equal(e, ex);
});

test('Subscribe_None_Empty', function () {
    Observable.empty(Scheduler.immediate).subscribe(function () {
        ok(false);
    });
    ok(true);
});

test('Subscribe_OnNext_Return', function () {
    var x1 = -1;
    Observable.returnValue(42, Scheduler.immediate).subscribe(function (x) {
        x1 = x;
    });
    equal(42, x1);
});

test('Subscribe_OnNext_Throw', function () {
    var e, ex;
    ex = 'ex';
    try {
        Observable.throwException(ex, Scheduler.immediate).subscribe(function () {
            ok(false);
        });
    } catch (e1) {
        e = e1;
    }
    equal(e, ex);
});

test('Subscribe_OnNext_Empty', function () {
    Observable.empty(Scheduler.immediate).subscribe(function (x) {
        ok(false);
    });
    ok(true);
});

test('Subscribe_OnNext_Empty', function () {
    var finished = false, x1 = -1;
    Observable.returnValue(42, Scheduler.immediate).subscribe(function (x) {
        x1 = x;
    }, null, function () {
        finished = true;
    });
    equal(42, x1);
    ok(finished);
});

test('Subscribe_OnNextOnCompleted_Throw', function () {
  var e;
  var ex = 'ex';
  try {
    Observable.throwException(ex, Scheduler.immediate).subscribe(function () {
      ok(false);
    }, null, function () {
      ok(false);
    });
  } catch (e1) {
    e = e1;
  }
  equal(ex, e);
});

test('Subscribe_OnNextOnCompleted_Empty', function () {
  var finished = false;
  Observable.empty(Scheduler.immediate).subscribe(function () {
    ok(false);
  }, null, function () {
    finished = true;
  });
  ok(finished);
});

test('SubscribeNext_Empty', function () {
  Observable.empty(Scheduler.immediate).subscribeNext(function () {
    ok(false);
  });
  ok(true);
});

test('SubscribeNext_Throw', function () {
  var error = new Error(), e1;
  try {
    Observable.throwException(error, Scheduler.immediate).subscribeNext(function () {
      ok(false);
    });
  } catch (e) {
    e1 = e;
  }
  equal(error, e1);
});

test('SubscribeNext_Next', function () {
  var val;
  Observable.returnValue(42, Scheduler.immediate).subscribeNext(function (v) {
    val = v;
  });
  equal(42, val);
});

test('SubscribeNext_ThisArg', function () {
  var val, thisArg = 56;
  Observable.returnValue(42, Scheduler.immediate).subscribeNext(function (v) {
    val = v;
    equal(this, thisArg);
  }, thisArg);
  equal(42, val);
});

test('SubscribeError_Empty', function () {
  Observable.empty(Scheduler.immediate).subscribeError(function () {
    ok(false);
  });
  ok(true);
});

test('SubscribeError_Throw', function () {
  var error = new Error, err;
  Observable.throwException(error, Scheduler.immediate).subscribeError(function (e) {
    err = e;
  });
  equal(err, error);
});

test('SubscribeError_Next', function () {
  Observable.returnValue(42, Scheduler.immediate).subscribeError(function () {
    ok(false);
  });
  ok(true);
});

test('SubscribeError_ThisArg', function () {
  var thisArg = 56, that;
  Observable.throwException(new Error(), Scheduler.immediate).subscribeError(function () {
    that = this;;
  }, thisArg);
  equal(thisArg, that);
});

test('SubscribeCompleted_Empty', function () {
  var hit = false;
  Observable.empty(Scheduler.immediate).subscribeCompleted(function () {
    hit = true;
  });
  ok(hit);
});

test('SubscribeCompleted_Throw', function () {
  var error = new Error(), e1;
  try {
    Observable.throwException(error, Scheduler.immediate).subscribeCompleted(function () {
      ok(false);
    });
  } catch (e) {
    e1 = e;
  }
  equal(error, e1);
});

test('SubscribeCompleted_Next', function () {
  var hit = false;
  Observable.returnValue(42, Scheduler.immediate).subscribeCompleted(function () {
    hit = true;
  });
  ok(hit);
});

test('SubscribeCompleted_ThisArg', function () {
  var thisArg = 56, that;
  Observable.returnValue(42, Scheduler.immediate).subscribeCompleted(function () {
    that = this;
  }, thisArg);
  equal(that, thisArg);
});
