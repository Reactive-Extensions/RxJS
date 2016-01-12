'use strict';
/* jshint undef: true, unused: true */

var Notification = require('../notification');
var Observer = require('../observer');
var test = require('tape');
var inherits = require('inherits');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
    onError = ReactiveTest.onError,
    onCompleted = ReactiveTest.onCompleted;

test('Notification.createOnNextc.constructor', function (t) {
  var n = Notification.createOnNext(42);

  t.equal('N', n.kind);
  t.equal(42, n.value);
  t.end();
});

test('Notification.createOnNext#toString', function (t) {
  var n1 = Notification.createOnNext(42);

  t.ok(n1.toString().indexOf('OnNext') !== -1);
  t.ok(n1.toString().indexOf('42') !== -1);
  t.end();
});

function CheckOnNextObserver() {
  Observer.call(this);
  this.value = null;
}

inherits(CheckOnNextObserver, Observer);

CheckOnNextObserver.prototype.onNext = function (value) {
  return this.value = value;
};

test('Notification.createOnNext#accept Observer', function (t) {
  var con = new CheckOnNextObserver();

  var n1 = Notification.createOnNext(42);
  n1.accept(con);

  t.equal(42, con.value);
  t.end();
});

function AcceptObserver(onNext, onError, onCompleted) {
  Observer.call(this);
  this._onNext = onNext;
  this._onError = onError;
  this._onCompleted = onCompleted;
}

inherits(AcceptObserver, Observer);

AcceptObserver.prototype.onNext = function (value) {
  return this._onNext(value);
};

AcceptObserver.prototype.onError = function (exception) {
  return this._onError(exception);
};

AcceptObserver.prototype.onCompleted = function () {
  return this._onCompleted();
};

test('Notification.createOnNext#accept Observer with result', function (t) {
  var n1 = Notification.createOnNext(42);

  var results = n1.accept(new AcceptObserver(
    function () {
      return 'OK';
    },
    function () {
      t.ok(false);
      return false;
    },
    function () {
      t.ok(false);
      return false;
  }));

  t.equal('OK', results);
  t.end();
});

test('Notification.createOnNext#accept action', function (t) {
  var obs = false;

  var n1 = Notification.createOnNext(42);

  n1.accept(
    function () {
      obs = true;
    },
    function () {
      t.ok(false);
    },
    function () {
      t.ok(false);
    }
  );

  t.ok(obs);
  t.end();
});

test('Notification.createOnNext#accept action with result', function (t) {
  var n1 = Notification.createOnNext(42);

  var results = n1.accept(
    function () {
      return 'OK';
    },
    function () {
      t.ok(false);
    },
    function () {
      t.ok(false);
    }
  );

  t.equal('OK', results);
  t.end();
});

test('Notification.createOnError.constructor', function (t) {
  var error = new Error();

  var n = Notification.createOnError(error);

  t.equal('E', n.kind);
  t.equal(error, n.error);
  t.end();
});

test('Notification.createOnError#toString', function (t) {
  var error = new Error('woops');

  var n1 = Notification.createOnError(error);

  t.ok(n1.toString().indexOf('OnError') !== -1);
  t.ok(n1.toString().indexOf('woops') !== -1);
  t.end();
});


function CheckOnErrorObserver() {
  Observer.call(this);
  this.error = null;
}

inherits(CheckOnErrorObserver, Observer);

CheckOnErrorObserver.prototype.onError = function (err) {
  this.error = err;
};

test('Notification.createOnError#accept(observer)', function (t) {
  var error = new Error();

  var obs = new CheckOnErrorObserver();

  var n1 = Notification.createOnError(error);

  n1.accept(obs);

  t.equal(error, obs.error);
  t.end();
});

test('Notification.createOnError#accept(observer) with result', function (t) {
  var error = new Error();

  var n1 = Notification.createOnError(error);

  var results = n1.accept(new AcceptObserver(
    function () {
      t.ok(false);
    },
    function () {
      return 'OK';
    },
    function () {
      t.ok(false);
    }
  ));

  t.equal('OK', results);
  t.end();
});

test('Notification.createOnError#accept(action)', function (t) {
  var error = new Error();

  var obs = false;

  var n1 = Notification.createOnError(error);

  n1.accept(
    function () {
      t.ok(false);
    },
    function () {
      obs = true;
    },
    function () {
      t.ok(false);
    }
  );

  t.ok(obs);
  t.end();
});

test('Notification.createOnError#accept(action) with result', function (t) {
  var error = new Error();

  var n1 = Notification.createOnError(error);

  var results = n1.accept(
    function () {
      t.ok(false);
    },
    function () {
      return 'OK';
    },
    function () {
      t.ok(false);
    }
  );

  t.equal('OK', results);
  t.end();
});

test('Notification.createOnCompleted.constructor', function (t) {
  var n = Notification.createOnCompleted();

  t.equal('C', n.kind);
  t.end();
});

test('Notification.createOnCompleted toString', function (t) {
  var n1 = Notification.createOnCompleted();

  t.ok(n1.toString().indexOf('OnCompleted') !== -1);
  t.end();
});

function CheckOnCompletedObserver() {
  Observer.call(this);
  this.completed = false;
}

inherits(CheckOnCompletedObserver, Observer);

CheckOnCompletedObserver.prototype.onCompleted = function () {
  this.completed = true;
};

test('Notification.createOnCompleted#accept(observer)', function (t) {
  var obs = new CheckOnCompletedObserver();

  var n1 = Notification.createOnCompleted();

  n1.accept(obs);

  t.ok(obs.completed);
  t.end();
});

test('Notification.createOnCompleted#accept(observer) with result', function (t) {
  var n1 = Notification.createOnCompleted();

  var results = n1.accept(new AcceptObserver(
    function () {
      t.ok(false);
    },
    function () {
      t.ok(false);
    },
    function () {
      return 'OK';
    }
  ));

  t.equal('OK', results);
  t.end();
});

test('Notification.createOnCompleted#accept(action)', function (t) {
  var obs = false;

  var n1 = Notification.createOnCompleted();

  n1.accept(
    function () {
      t.ok(false);
    },
    function () {
      t.ok(false);
    },
    function () {
      obs = true;
    }
  );

  t.ok(obs);
  t.end();
});

test('Notification.createOnCompleted#accept(action) with result', function (t) {
  var n1 = Notification.createOnCompleted();

  var results = n1.accept(
    function () {
      t.ok(false);
    },
    function () {
      t.ok(false);
    },
    function () {
      return 'OK';
    }
  );

  t.equal('OK', results);
  t.end();
});

test('toObservable empty', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Notification.createOnCompleted().toObservable(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onCompleted(201)
  ]);

  t.end();
});

test('Notification#toObservable just', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Notification.createOnNext(42).toObservable(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onNext(201, 42),
    onCompleted(201)
  ]);

  t.end();
});

test('Notification#toObservable throwError', function (t) {
  var error = new Error();

  var scheduler = new TestScheduler();

  var results = scheduler.startScheduler(function () {
    return Notification.createOnError(error).toObservable(scheduler);
  });

  reactiveAssert(t, results.messages, [
    onError(201, error)
  ]);

  t.end();
});
