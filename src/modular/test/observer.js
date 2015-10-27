'use strict';
/* jshint undef: true, unused: true */

var test = require('tape');
var Observer = require('../observer');
var Notification = require('../notification');

Observer.addToObject({
  create: require('../observer/create'),
  fromNotifier: require('../observer/fromnotifier'),
});

Observer.addToPrototype({
  asObserver: require('../observer/asobserver'),
  checked: require('../observer/checked'),
  toNotifier: require('../observer/tonotifier')
});

function createObserver() {
  var obs = new Observer();
  obs.onNext = function onNext(value) { this.hasOnNext = value; };
  obs.onError = function onError (err) { this.hasOnError = err; };
  obs.onCompleted = function onCompleted () { this.hasOnCompleted = true; };

  return obs;
}

test('fromNotifier notification onNext', function (t) {
  var i = 0;

  var next = function (n) {
    t.equal(i++, 0);
    t.equal(n.kind, 'N');
    t.equal(n.value, 42);
    t.end();
  };

  Observer.fromNotifier(next).onNext(42);
});

test('fromNotifier notification onError', function (t) {
  var error = new Error();

  var i = 0;

  var next = function (n) {
    t.equal(i++, 0);
    t.equal(n.kind, 'E');
    t.equal(n.error, error);
    t.end();
  };

  Observer.fromNotifier(next).onError(error);
});

test('fromNotifier Notification onCompleted', function (t) {
  var i = 0;

  var next = function (n) {
    t.equal(i++, 0);
    t.equal(n.kind, 'C');
    t.end();
  };

  Observer.fromNotifier(next).onCompleted();
});

test('toNotifier forwards', function (t) {
  var obsn = new createObserver();
  obsn.toNotifier()(Notification.createOnNext(42));
  t.equal(obsn.hasOnNext, 42);

  var error = new Error();
  var obse = new createObserver();
  obse.toNotifier()(Notification.createOnError(error));
  t.equal(error, obse.hasOnError);

  var obsc = new createObserver();
  obsc.toNotifier()(Notification.createOnCompleted());
  t.ok(obsc.hasOnCompleted);

  t.end();
});

test('Observer.create onNext', function (t) {
  var next = false;
  var res = Observer.create(function (x) {
    t.equal(42, x);
    next = true;
  });

  res.onNext(42);

  t.ok(next);
  t.end();

  res.onCompleted();
});

test('Observer.create OnNext has error', function (t) {
  var e_;
  var error = new Error();
  var next = false;
  var res = Observer.create(function (x) {
      t.equal(42, x);
      next = true;
  });

  res.onNext(42);
  t.ok(next);

  try {
    res.onError(error);
    t.ok(false);
  } catch (e) {
    e_  = e;
  }

  t.equal(error, e_);
  t.end();
});

test('Observer.create onNext onCompleted', function (t) {
  var next = false;

  var completed = false;

  var res = Observer.create(function (x) {
    t.equal(42, x);
    next = true;
  }, null, function () {
    completed = true;
  });

  res.onNext(42);

  t.ok(next);
  t.ok(!completed);

  res.onCompleted();

  t.ok(completed);
  t.end();
});

test('Observer.create onNext onCompleted has error', function (t) {
  var e_;
  var error = new Error();

  var next = false;

  var completed = false;

  var res = Observer.create(
    function (x) {
      t.equal(42, x);
      next = true;
    },
    null,
    function () {
      completed = true;
    }
  );

  res.onNext(42);
  t.ok(next);
  t.ok(!completed);

  try {
    res.onError(error);
    t.ok(false);
  } catch (e) {
    e_  = e;
  }

  t.equal(error, e_);
  t.ok(!completed);
  t.end();
});

test('Observer.create onNext onError', function (t) {
  var error = new Error();

  var next = true;

  var hasError = false;

  var res = Observer.create(function (x) {
    t.equal(42, x);
    next = true;
  }, function (e) {
    t.equal(error, e);
    hasError = true;
  });

  res.onNext(42);

  t.ok(next);
  t.ok(!hasError);

  res.onError(error);
  t.ok(hasError);
  t.end();
});

test('Observer.create onNext onError hit completed', function (t) {
  var error = new Error();

  var next = true;

  var hasError = false;

  var res = Observer.create(function (x) {
    t.equal(42, x);
    next = true;
  }, function (e) {
    t.equal(error, e);
    hasError = true;
  });

  res.onNext(42);
  t.ok(next);
  t.ok(!hasError);

  res.onCompleted();

  t.ok(!hasError);
  t.end();
});

test('Observer.create onNext onError onCompleted 1', function (t) {
  var error = new Error();

  var next = true;

  var hasError = false;
  var completed = false;

  var res = Observer.create(function (x) {
    t.equal(42, x);
    next = true;
  }, function (e) {
    t.equal(error, e);
    hasError = true;
  }, function () {
    completed = true;
  });

  res.onNext(42);

  t.ok(next);
  t.ok(!hasError);
  t.ok(!completed);

  res.onCompleted();

  t.ok(completed);
  t.ok(!hasError);
  t.end();
});

test('Observer.create onNext onError onCompleted 2', function (t) {
  var error = new Error();

  var next = true;

  var hasError = false;

  var completed = false;

  var res = Observer.create(function (x) {
    t.equal(42, x);
    next = true;
  }, function (e) {
    t.equal(error, e);
    hasError = true;
  }, function () {
    completed = true;
  });

  res.onNext(42);

  t.ok(next);
  t.ok(!hasError);
  t.ok(!completed);

  res.onError(error);

  t.ok(!completed);
  t.ok(hasError);
  t.end();
});

test('Observer.asObserver hides', function (t) {
  var obs = new createObserver();

  var res = obs.asObserver();

  t.notEqual(obs, res);
  t.end();
});

test('asObserver Forwards', function (t) {
  var obsn = new createObserver();
  obsn.asObserver().onNext(42);
  t.equal(obsn.hasOnNext, 42);

  var error = new Error();
  var obse = new createObserver();
  obse.asObserver().onError(error);
  t.equal(obse.hasOnError, error);

  var obsc = new createObserver();
  obsc.asObserver().onCompleted();
  t.ok(obsc.hasOnCompleted);

  t.end();
});

test('Observer.checked already terminated completed', function (t) {
  var m = 0, n = 0;

  var o = Observer.create(function () {
    m++;
  }, function () {
    t.ok(false);
  }, function () {
    n++;
  }).checked();

  o.onNext(1);
  o.onNext(2);
  o.onCompleted();

  t.throws(function () { o.onCompleted(); });
  t.throws(function () { o.onError(new Error('error')); });
  t.equal(2, m);
  t.equal(1, n);

  t.end();
});

test('Observer.checked already terminated error', function (t) {
  var m = 0, n = 0;

  var o = Observer.create(function () {
    m++;
  }, function () {
    n++;
  }, function () {
    t.ok(false);
  }).checked();

  o.onNext(1);
  o.onNext(2);
  o.onError(new Error('error'));

  t.throws(function () { o.onCompleted(); });
  t.throws(function () { o.onError(new Error('error')); });

  t.equal(2, m);
  t.equal(1, n);
  t.end();
});

test('Observer.checked re-entrant next', function (t) {
  var n = 0;

  var o = Observer.create(function () {
    n++;
    t.throws(function () { o.onNext(9); });
    t.throws(function () { o.onError(new Error('error')); });
    t.throws(function () { o.onCompleted(); });
  }, function () {
    t.ok(false);
  }, function () {
    t.ok(false);
  }).checked();

  o.onNext(1);

  t.equal(1, n);
  t.end();
});

test('Observer.checked re-entrant error', function (t) {
  var n = 0;

  var o = Observer.create(function () {
    t.ok(false);
  }, function () {
    n++;
    t.throws(function () { o.onNext(9); });
    t.throws(function () { o.onError(new Error('error')); });
    t.throws(function () { o.onCompleted(); });
  }, function () {
    t.ok(false);
  }).checked();

  o.onError(new Error('error'));
  t.equal(1, n);
  
  t.end();
});

test('Observer.checked re-entrant completed', function (t) {
  var n = 0;

  var o = Observer.create(function () {
    t.ok(false);
  }, function () {
    t.ok(false);
  }, function () {
    n++;
    t.throws(function () { o.onNext(9); });
    t.throws(function () { o.onError(new Error('error')); });
    t.throws(function () { o.onCompleted(); });
  }).checked();

  o.onCompleted();

  t.equal(1, n);
  t.end();
});
