(function () {
  QUnit.module('Observer');

  var Observer = Rx.Observer,
    createOnNext = Rx.Notification.createOnNext,
    createOnError = Rx.Notification.createOnError,
    createOnCompleted = Rx.Notification.createOnCompleted;

  test('Create_OnNext', function () {
    var next, res;
    next = false;
    res = Observer.create(function (x) {
      equal(42, x);
      next = true;
    });
    res.onNext(42);
    ok(next);
    return res.onCompleted();
  });

  test('Create_OnNext_HasError', function () {
    var e_;
    var ex = 'ex';
    var next = false;
    var res = Observer.create(function (x) {
      equal(42, x);
      next = true;
    });

    res.onNext(42);
    ok(next);

    try {
      res.onError(ex);
      ok(false);
    } catch (e) {
      e_ = e;
    }
    equal(ex, e_);
  });

  test('Create_OnNextOnCompleted', function () {
    var next = false;
    var completed = false;
    var res = Observer.create(function (x) {
      equal(42, x);
      return next = true;
    }, undefined, function () {
      return completed = true;
    });

    res.onNext(42);

    ok(next);
    ok(!completed);

    res.onCompleted();

    ok(completed);
  });

  test('Create_OnNextOnCompleted_HasError', function () {
    var e_;
    var ex = 'ex';
    var next = false;
    var completed = false;
    var res = Observer.create(function (x) {
      equal(42, x);
      next = true;
    }, undefined, function () {
      completed = true;
    });
    res.onNext(42);
    ok(next);
    ok(!completed);
    try {
      res.onError(ex);
      ok(false);
    } catch (e) {
      e_ = e;
    }
    equal(ex, e_);
    ok(!completed);
  });

  test('Create_OnNextOnError', function () {
    var ex = 'ex';
    var next = true;
    var error = false;
    var res = Observer.create(function (x) {
      equal(42, x);
      next = true;
    }, function (e) {
      equal(ex, e);
      error = true;
    });

    res.onNext(42);

    ok(next);
    ok(!error);

    res.onError(ex);
    ok(error);
  });

  test('Create_OnNextOnError_HitCompleted', function () {
    var ex = 'ex';
    var next = true;
    var error = false;
    var res = Observer.create(function (x) {
      equal(42, x);
      next = true;
    }, function (e) {
      equal(ex, e);
      error = true;
    });

    res.onNext(42);
    ok(next);
    ok(!error);

    res.onCompleted();

    ok(!error);
  });

  test('Create_OnNextOnErrorOnCompleted1', function () {
    var ex = 'ex';
    var next = true;
    var error = false;
    var completed = false;
    var res = Observer.create(function (x) {
      equal(42, x);
      next = true;
    }, function (e) {
      equal(ex, e);
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

  test('Create_OnNextOnErrorOnCompleted2', function () {
    var ex = 'ex';
    var next = true;
    var error = false;
    var completed = false;
    var res = Observer.create(function (x) {
      equal(42, x);
      next = true;
    }, function (e) {
      equal(ex, e);
      error = true;
    }, function () {
      completed = true;
    });

    res.onNext(42);

    ok(next);
    ok(!error);
    ok(!completed);

    res.onError(ex);

    ok(!completed);
    ok(error);
  });
}());
