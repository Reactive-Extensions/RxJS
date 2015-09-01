(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal, ok */
  QUnit.module('Observer');

  var Observer = Rx.Observer;

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

  test('create onNext has error', function () {
    var e_;

    var err = new Error();

    var next = false;

    var res = Observer.create(function (x) {
      equal(42, x);
      next = true;
    });

    res.onNext(42);
    ok(next);

    try {
      res.onError(err);
      ok(false);
    } catch (e) {
      e_ = e;
    }
    equal(err, e_);
  });

  test('create onNext onCompleted', function () {
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

  test('create onNext onCompleted has error', function () {
    var e_;

    var err = new Error();

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

    try {
      res.onError(err);
      ok(false);
    } catch (e) {
      e_ = e;
    }

    equal(err, e_);
    ok(!completed);
  });

  test('create onNext onError', function () {
    var err = new Error();
    var next = true;
    var error = false;
    var res = Observer.create(function (x) {
      equal(42, x);
      next = true;
    }, function (e) {
      equal(err, e);
      error = true;
    });

    res.onNext(42);

    ok(next);
    ok(!error);

    res.onError(err);
    ok(error);
  });

  test('create onNext onError hit completed', function () {
    var err = new Error();

    var next = true;
    var error = false;

    var res = Observer.create(function (x) {
      equal(42, x);
      next = true;
    }, function (e) {
      equal(err, e);
      error = true;
    });

    res.onNext(42);

    ok(next);
    ok(!error);

    res.onCompleted();

    ok(!error);
  });

  test('create onNext onError onCompleted 1', function () {
    var err = new Error();

    var next = false;
    var error = false;
    var completed = false;

    var res = Observer.create(function (x) {
      equal(42, x);
      next = true;
    }, function (e) {
      equal(err, e);
      error = true;
    }, function () {
      completed = true;
    });

    res.onNext(42);

    ok(next);
    ok(!error);
    ok(!completed);

    res.onCompleted();

    ok(completed);
    ok(!error);
  });

  test('create onNext onError onCompleted 2', function () {
    var err = new Error();

    var next = false;
    var error = false;
    var completed = false;

    var res = Observer.create(function (x) {
      equal(42, x);
      next = true;
    }, function (e) {
      equal(err, e);
      error = true;
    }, function () {
      completed = true;
    });

    res.onNext(42);

    ok(next);
    ok(!error);
    ok(!completed);

    res.onError(err);

    ok(!completed);
    ok(error);
  });
}());
