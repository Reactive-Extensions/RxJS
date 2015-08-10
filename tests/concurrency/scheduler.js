(function () {
  QUnit.module('Scheduler');

  var Scheduler = Rx.Scheduler,
      isFunction = Rx.helpers.isFunction,
      inherits = Rx.internals.inherits,
      disposableEmpty = Rx.Disposable.empty;

  function defaultNow() {
    return isFunction(Date.now) ? Date.now() : +new Date;
  }

  var LocalScheduler = (function (__super__) {
    inherits(LocalScheduler, __super__);

    function LocalScheduler(now) {
      this.now = now != null ? function () { return now; } : +new Date();
      this.waitCycles = 0;
    }

    LocalScheduler.prototype.schedule = function (state, action) {
      return action(this, state);
    };

    LocalScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
      this.check(function (o) { return action(self, o); }, state, dueTime);
      this.waitCycles += dueTime;
      return action(this, state);
    };

    return LocalScheduler;
  }(Scheduler));

  test('schedule recursive non-recursive', function () {
    var ms = new LocalScheduler();

    var res = false;

    ms.scheduleRecursive(null, function (a) { res = true; });

    ok(res);
  });

  test('schedule recursive', function () {
    var ms = new LocalScheduler();

    var i = 0;

    ms.scheduleRecursive(null, function (_, a) { ++i < 10 && a(); });

    equal(10, i);
  });

  test('schedule absolute non-recursive', function () {
    var now = defaultNow();

    var ms = new LocalScheduler(now);

    var res = false;

    ms.check = function (a, s, t) { equal(t, 0); };

    ms.scheduleFuture(null, new Date(now), function () { res = true; });

    ok(res);

    equal(ms.waitCycles, 0);
  });

  test('schedule absolute recursive', function () {
    var now = defaultNow();

    var i = 0;

    var ms = new LocalScheduler(now);

    ms.check = function (a, s, t) { equal(t, 0); };

    ms.scheduleRecursiveFuture(new Date(now), function (a) { ++i < 10 && a(new Date(now)); });

    equal(ms.waitCycles, 0);
    equal(10, i);
  });

  test('schedule recursive relative non-recursive', function () {
    var now = defaultNow();

    var ms = new LocalScheduler(now);

    ms.check = function (a, s, t) { equal(t, 0); };

    var res = false;

    ms.scheduleRecursiveFuture(null, 0, function () { res = true; });

    ok(res);
    equal(ms.waitCycles, 0);
  });

  test('schedule relative recursive', function () {
    var now = defaultNow();

    var i = 0;

    var ms = new LocalScheduler(now);

    ms.check = function (a, s, t) { ok(t < 10); };

    ms.scheduleRecursiveFuture(null, 0, function (_, a) { ++i < 10 && a(i); });

    equal(ms.waitCycles, 45);
    equal(10, i);
  });

  test('catch swallows error', function () {
    var swallow = Scheduler.immediate['catch'](function () { return true; });

    swallow.schedule(null, function () { throw new Error('Should be swallowed'); });

    ok(true);
  });

  test('swallow recursive', function () {
    var swallow = Scheduler.immediate['catch'](function () { return true; });

    swallow.scheduler(42, function (self, state) {
      return self.schedule(null, function () { new Error('Should be swallowed'); });
    });

    ok(true);
  });

  var LocalExceptionScheduler = (function () {
    inherits(LocalExceptionScheduler, __super__);

    function LocalExceptionScheduler(onError) {
      this._onError = onError;
      __super__.call(this);
    }

    LocalExceptionScheduler.prototype.schedule = function (state, action) {
      try {
        return action(this, state);
      } catch (e) {
        this._onError(e);
        return disposableEmpty;
      }
    };

    LocalExceptionScheduler.prototype.schedulePeriodic = function (state, period, action) {
      var self = this;
      Scheduler.immediate.schedule(function () {
        try {
          var s = state;
          for(var i = 0; true; i++) {
            if (i > 10) { break; }
            s = action(s);
          }
        } catch (e) {
          self._onError(e);
        }
      });
    };

    return LocalExceptionScheduler;

  }(Scheduler));

  test('catch custom unhandled', function () {
    var err;

    var scheduler = new LocalExceptionScheduler(function (e) { err = e; });

    scheduler['catch'](function () { return true; }).schedule(function () {
      throw new Error('Should be caught');
    });

    ok(!err);

    var err1 = 'error';

    scheduler['catch'](function () { return ex1 instanceof Error; })
      .schedule(function () { throw ex1; });

    equal(err, err1);
  });

  test('catch custom schedule periodic caught', function () {
    var err;

    var scheduler = new LocalExceptionScheduler(function (e) { err = e; });

    var catcher = scheduler['catch'](function () { return true; });

    catcher.schedulePeriodic(42, 0, function () { throw new Error('Should be caught'); });

    ok(!err);
  });

  test('catch custom schedule periodic uncaught', function () {
    var error = new Error('Error1');

    var err;

    var scheduler = new LocalExceptionScheduler(function (e) { err = e; });

    var catcher = scheduler['catch'](function (e) { return e instanceof String; });

    catcher.schedulePeriodicWithState(42, 0, function () { throw error; });

    equal(err, error);
  });

}());
