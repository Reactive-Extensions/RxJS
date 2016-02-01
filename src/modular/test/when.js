'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted;

Observable.addToObject({
  never: require('../observable/never'),
  when: require('../observable/when')
});

Observable.addToPrototype({
  and: require('../observable/and'),
  thenDo: require('../observable/thendo')
});

function throwError(error) { return function () { throw error; }; }
function multiply (x, y) { return x * y; }
function subtract (x, y) { return x - y; }
function add () {
  var sum = 0;
  for (var i = 0, len = arguments.length; i < len; i++) {
    sum += arguments[i];
  }
  return sum;
}

test('then 1', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onCompleted(220)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.when(xs.thenDo(function (a) {
      return a;
    }));
  });

  reactiveAssert(t, results.messages, [
    onNext(210, 1),
    onCompleted(220)
  ]);

  t.end();
});

test('then 1 error', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onError(210, error)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.when(xs.thenDo(function (a) {
      return a;
    }));
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('then 1 throws', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onCompleted(220)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.when(xs.thenDo(throwError(error)));
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('and 2', function (t) {
  var N = 2;

  var scheduler = new TestScheduler();

  var obs = [];
  for (var i = 0; i < N; i++) {
    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
  }

  var results = scheduler.startScheduler(function () {
    return Observable.when(obs[0].and(obs[1]).thenDo(add));
  });

  reactiveAssert(t, results.messages, [
    onNext(210, N),
    onCompleted(220)
  ]);

  t.end();
});

test('and 2 error', function (t) {
  var error = new Error();

  var N = 2;

  for (var i = 0; i < N; i++) {
    var scheduler = new TestScheduler();

    var obs = [];
    for (var j = 0; j < N; j++) {
      if (j === i) {
        obs.push(scheduler.createHotObservable(onError(210, error)));
      } else {
        obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
      }
    }

    var results = scheduler.startScheduler(function () {
      return Observable.when(obs[0].and(obs[1]).thenDo(add));
    });

    reactiveAssert(t, results.messages, [
      onError(210, error)
    ]);
  }

  t.end();
});

test('then 2 throws', function (t) {
  var error = new Error();

  var N = 2;

  var scheduler = new TestScheduler();

  var obs = [];
  for (var i = 0; i < N; i++) {
    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
  }

  var results = scheduler.startScheduler(function () {
    return Observable.when(obs[0].and(obs[1]).thenDo(throwError(error)));
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('and 3', function (t) {
  var N = 3;

  var scheduler = new TestScheduler();

  var obs = [];
  for (var i = 0; i < N; i++) {
    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
  }

  var results = scheduler.startScheduler(function () {
    return Observable.when(obs[0].and(obs[1]).and(obs[2]).thenDo(add));
  });

  reactiveAssert(t, results.messages, [
    onNext(210, N),
    onCompleted(220)
  ]);

  t.end();
});

test('and 3 error', function (t) {
  var error = new Error();

  var N = 3;

  for (var i = 0; i < N; i++) {
    var scheduler = new TestScheduler();

    var obs = [];
    for (var j = 0; j < N; j++) {
      if (j === i) {
        obs.push(scheduler.createHotObservable(onError(210, error)));
      } else {
        obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
      }
    }

    var results = scheduler.startScheduler(function () {
      return Observable.when(obs[0].and(obs[1]).and(obs[2]).thenDo(add));
    });

    reactiveAssert(t, results.messages, [
      onError(210, error)
    ]);
  }

  t.end();
});

test('then 3 throws', function (t) {
  var error = new Error();

  var N = 3;

  var scheduler = new TestScheduler();

  var obs = [];
  for (var i = 0; i < N; i++) {
    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
  }

  var results = scheduler.startScheduler(function () {
    return Observable.when(obs[0].and(obs[1]).and(obs[2]).thenDo(throwError(error)));
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('and 4', function (t) {
  var N = 4;
  var scheduler = new TestScheduler();
  var obs = [];
  for (var i = 0; i < N; i++) {
    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
  }

  var results = scheduler.startScheduler(function () {
    return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).thenDo(add));
  });

  reactiveAssert(t, results.messages, [
    onNext(210, N),
    onCompleted(220)
  ]);

  t.end();
});

test('and 4 error', function (t) {
  var error = new Error();

  var N = 4;

  for (var i = 0; i < N; i++) {
    var scheduler = new TestScheduler();

    var obs = [];
    for (var j = 0; j < N; j++) {
      if (j === i) {
        obs.push(scheduler.createHotObservable(onError(210, error)));
      } else {
        obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
      }
    }

    var results = scheduler.startScheduler(function () {
      return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).thenDo(add));
    });

    reactiveAssert(t, results.messages, [
      onError(210, error)
    ]);
  }

  t.end();
});

test('then 4 throws', function (t) {
  var error = new Error();

  var N = 4;

  var scheduler = new TestScheduler();

  var obs = [];
  for (var i = 0; i < N; i++) {
    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
  }

  var results = scheduler.startScheduler(function () {
    return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).thenDo(throwError(error)));
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('and 5', function (t) {
  var N = 5;

  var scheduler = new TestScheduler();

  var obs = [];
  for (var i = 0; i < N; i++) {
    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
  }

  var results = scheduler.startScheduler(function () {
    return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).thenDo(add));
  });

  reactiveAssert(t, results.messages, [
    onNext(210, N),
    onCompleted(220)
  ]);

  t.end();
});

test('and 5 error', function (t) {
  var error = new Error();
  var N = 5;
  for (var i = 0; i < N; i++) {
    var scheduler = new TestScheduler();
    var obs = [];
    for (var j = 0; j < N; j++) {
      if (j === i) {
        obs.push(scheduler.createHotObservable(onError(210, error)));
      } else {
        obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
      }
    }

    var results = scheduler.startScheduler(function () {
      return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).thenDo(add));
    });

    reactiveAssert(t, results.messages, [
      onError(210, error)
    ]);
  }

  t.end();
});

test('then 5 throws', function (t) {
  var error = new Error();

  var N = 5;

  var scheduler = new TestScheduler();

  var obs = [];
  for (var i = 0; i < N; i++) {
    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
  }

  var results = scheduler.startScheduler(function () {
    return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).thenDo(throwError(error)));
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('and 6', function (t) {
  var N = 6;

  var scheduler = new TestScheduler();

  var obs = [];
  for (var i = 0; i < N; i++) {
    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
  }

  var results = scheduler.startScheduler(function () {
    return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).thenDo(add));
  });

  reactiveAssert(t, results.messages, [
    onNext(210, N),
    onCompleted(220)
  ]);

  t.end();
});

test('and 6 error', function (t) {
  var error = new Error();

  var N = 6;

  for (var i = 0; i < N; i++) {
    var scheduler = new TestScheduler();

    var obs = [];
    for (var j = 0; j < N; j++) {
      if (j === i) {
        obs.push(scheduler.createHotObservable(onError(210, error)));
      } else {
        obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
      }
    }

    var results = scheduler.startScheduler(function () {
      return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).thenDo(add));
    });

    reactiveAssert(t, results.messages, [
      onError(210, error)
    ]);
  }

  t.end();
});

test('then 6 throws', function (t) {
  var error = new Error();

  var N = 6;

  var scheduler = new TestScheduler();

  var obs = [];
  for (var i = 0; i < N; i++) {
    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
  }

  var results = scheduler.startScheduler(function () {
    return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).thenDo(throwError(error)));
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('and 7', function (t) {
  var N = 7;

  var scheduler = new TestScheduler();

  var obs = [];
  for (var i = 0; i < N; i++) {
    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
  }

  var results = scheduler.startScheduler(function () {
    return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).thenDo(add));
  });

  reactiveAssert(t, results.messages, [
    onNext(210, N),
    onCompleted(220)
  ]);

  t.end();
});

test('and 7 error', function (t) {
  var error = new Error();

  var N = 7;

  for (var i = 0; i < N; i++) {
    var scheduler = new TestScheduler();

    var obs = [];
    for (var j = 0; j < N; j++) {
      if (j === i) {
        obs.push(scheduler.createHotObservable(onError(210, error)));
      } else {
        obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
      }
    }

    var results = scheduler.startScheduler(function () {
      return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).thenDo(add));
    });

    reactiveAssert(t, results.messages, [
      onError(210, error)
    ]);
  }

  t.end();
});

test('then 7 throws', function (t) {
  var error = new Error();

  var N = 7;

  var scheduler = new TestScheduler();

  var obs = [];
  for (var i = 0; i < N; i++) {
    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
  }

  var results = scheduler.startScheduler(function () {
    return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).thenDo(throwError(error)));
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('and 8', function (t) {
  var N = 8;

  var scheduler = new TestScheduler();

  var obs = [];
  for (var i = 0; i < N; i++) {
    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
  }

  var results = scheduler.startScheduler(function () {
    return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).and(obs[7]).thenDo(add));
  });

  reactiveAssert(t, results.messages, [
    onNext(210, N),
    onCompleted(220)
  ]);

  t.end();
});

test('and 8 error', function (t) {
  var error = new Error();

  var N = 8;

  for (var i = 0; i < N; i++) {
    var scheduler = new TestScheduler();

    var obs = [];
    for (var j = 0; j < N; j++) {
      if (j === i) {
        obs.push(scheduler.createHotObservable(onError(210, error)));
      } else {
        obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
      }
    }

    var results = scheduler.startScheduler(function () {
      return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).and(obs[7]).thenDo(add));
    });

    reactiveAssert(t, results.messages, [
      onError(210, error)
    ]);
  }

  t.end();
});

test('then 8 throws', function (t) {
  var error = new Error();

  var N = 8;

  var scheduler = new TestScheduler();

  var obs = [];
  for (var i = 0; i < N; i++) {
    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
  }

  var results = scheduler.startScheduler(function () {
    return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).and(obs[7]).thenDo(throwError(error)));
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('and 9', function (t) {
  var N = 9;

  var scheduler = new TestScheduler();

  var obs = [];
  for (var i = 0; i < N; i++) {
    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
  }

  var results = scheduler.startScheduler(function () {
    return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).and(obs[7]).and(obs[8]).thenDo(add));
  });

  reactiveAssert(t, results.messages, [
    onNext(210, N),
    onCompleted(220)
  ]);

  t.end();
});

test('and 9 error', function (t) {
  var error = new Error();

  var N = 9;

  for (var i = 0; i < N; i++) {
    var scheduler = new TestScheduler();

    var obs = [];
    for (var j = 0; j < N; j++) {
      if (j === i) {
        obs.push(scheduler.createHotObservable(onError(210, error)));
      } else {
        obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
      }
    }

    var results = scheduler.startScheduler(function () {
      return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).and(obs[7]).and(obs[8]).thenDo(add));
    });

    reactiveAssert(t, results.messages, [
      onError(210, error)
    ]);
  }

  t.end();
});

test('then 9 throws', function (t) {
  var error = new Error();

  var N = 9;

  var scheduler = new TestScheduler();

  var obs = [];
  for (var i = 0; i < N; i++) {
    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
  }

  var results = scheduler.startScheduler(function () {
    return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).and(obs[7]).and(obs[8]).thenDo(throwError(error)));
  });

  reactiveAssert(t, results.messages, [
    onError(210, error)
  ]);

  t.end();
});

test('when multiple data symmetric', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onCompleted(240)
  );

  var ys = scheduler.createHotObservable(
    onNext(240, 4),
    onNext(250, 5),
    onNext(260, 6),
    onCompleted(270)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.when(xs.and(ys).thenDo(add));
  });

  reactiveAssert(t, results.messages, [
    onNext(240, 1 + 4),
    onNext(250, 2 + 5),
    onNext(260, 3 + 6),
    onCompleted(270)
  ]);

  t.end();
});

test('when multiple data asymmetric', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onCompleted(240)
  );

  var ys = scheduler.createHotObservable(
    onNext(240, 4),
    onNext(250, 5),
    onCompleted(270)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.when(xs.and(ys).thenDo(add));
  });

  reactiveAssert(t, results.messages, [
    onNext(240, 1 + 4),
    onNext(250, 2 + 5),
    onCompleted(270)
  ]);

  t.end();
});

test('when empty empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onCompleted(240)
  );

  var ys = scheduler.createHotObservable(
    onCompleted(270)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.when(xs.and(ys).thenDo(add));
  });

  reactiveAssert(t, results.messages, [
    onCompleted(270)
  ]);

  t.end();
});

test('when never never', function (t) {
  var scheduler = new TestScheduler();

  var xs = Observable.never();

  var ys = Observable.never();

  var results = scheduler.startScheduler(function () {
    return Observable.when(xs.and(ys).thenDo(add));
  });

  reactiveAssert(t, results.messages, []);

  t.end();
});

test('when throw non-empty', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onError(240, error)
  );

  var ys = scheduler.createHotObservable(
    onCompleted(270)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.when(xs.and(ys).thenDo(add));
  });

  reactiveAssert(t, results.messages, [
    onError(240, error)
  ]);

  t.end();
});

test('complicated when', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(210, 1),
    onNext(220, 2),
    onNext(230, 3),
    onCompleted(240)
  );

  var ys = scheduler.createHotObservable(
    onNext(240, 4),
    onNext(250, 5),
    onNext(260, 6),
    onCompleted(270)
  );

  var zs = scheduler.createHotObservable(
    onNext(220, 7),
    onNext(230, 8),
    onNext(240, 9),
    onCompleted(300)
  );

  var results = scheduler.startScheduler(function () {
    return Observable.when(
      xs.and(ys).thenDo(add),
      xs.and(zs).thenDo(multiply),
      ys.and(zs).thenDo(subtract)
    );
  });

  reactiveAssert(t, results.messages, [
    onNext(220, 1 * 7),
    onNext(230, 2 * 8),
    onNext(240, 3 + 4),
    onNext(250, 5 - 9),
    onCompleted(300)
  ]);

  t.end();
});
