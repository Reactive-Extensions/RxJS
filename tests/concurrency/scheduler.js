(function () {
  'use strict';
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, ok, equal */
  QUnit.module('Scheduler');

  var Scheduler = Rx.Scheduler,
      inherits = Rx.internals.inherits;

  var MyScheduler = (function (__super__) {
    inherits(MyScheduler, __super__);
    function MyScheduler(now) {
      if (now !== undefined) { this.now = function () { return now; }; }
      this.waitCycles = 0;
      __super__.call(this);
    }

    MyScheduler.prototype.schedule = function (state, action) {
      return action(this, state);
    };

    MyScheduler.prototype._scheduleFuture = function (state, dueTime, action) {
      var self = this;
      this.check(function (o) { return action(self, o); }, state, dueTime);
      this.waitCycles += dueTime;
      return action(this, state);
    };

    return MyScheduler;
  }(Scheduler));

  test('scheduler schedule non-recursive', function () {
      var ms = new MyScheduler();
      var res = false;
      ms.scheduleRecursive(null, function () {
  	    res = true;
      });
      ok(res);
  });

  test('scheduler schedule recursive', function () {
      var ms = new MyScheduler();
      var i = 0;
      ms.scheduleRecursive(null, function (_, a) {
  	    if (++i < 10) {
  	        a();
  	    }
      });
      equal(10, i);
  });

  test('scheduler schedule with time non-recursive', function () {
    var now = new Date();

    var ms = new MyScheduler(now);

    var res = false;

    ms.check = function (a, s, t) { equal(t, 0); };
    ms.scheduleFuture(null, now, function () { res = true; });

    ok(res);

    equal(ms.waitCycles, 0);
  });

  test('scheduler schedule with absolute time recursive', function () {
      var now = new Date();

      var i = 0;

      var ms = new MyScheduler(now);

      ms.check = function (a, s, t) { equal(t, 0); };

      ms.scheduleRecursiveFuture(null, now, function (_, a) {
  	    if (++i < 10) { a(null, now); }
      });

      equal(ms.waitCycles, 0);
      equal(10, i);
  });

  test('scheduler schedule with relative time non-recursive', function () {
      var now = new Date().getTime();

      var ms = new MyScheduler(now);

      ms.check = function (a, s, t) { equal(t, 0);   };

      var res = false;
      ms.scheduleRecursiveFuture(null, 0, function () { res = true; });

      ok(res);
      equal(ms.waitCycles, 0);
  });

  test('scheduler schedule with time recursive', function () {
    var now = new Date().getTime();

    var i = 0;

    var ms = new MyScheduler(now);

    ms.check = function (a, s, t) {
	    return ok(t < 10);
    };

    ms.scheduleRecursiveFuture(null, 0, function (_, a) {
	    if (++i < 10) { a(null, i); }
    });

    equal(ms.waitCycles, 45);
    equal(10, i);
  });

  test('catch builtin swallow shallow', function () {
    var swallow = Scheduler.immediate.catchError(function () { return true; });
    swallow.schedule(null, function () { throw new Error('Should be swallowed'); });
    ok(true);
  });

  test('catch builtin swallow recursive', function () {
      var swallow = Scheduler.immediate.catchError(function () { return true; });
      swallow.schedule(42, function (self) {
        return self.schedule(null, function () { new Error('Should be swallowed'); });
      });
      ok(true);
  });

  var disposableEmpty = Rx.Disposable.empty;

  var MyErrorScheduler = (function (__super__) {
    inherits(MyErrorScheduler, __super__);
    function MyErrorScheduler(onError) {
      this._onError = onError;
      __super__.call(this);
    }

    MyErrorScheduler.prototype.schedule = function (state, action) {
      try {
        return action(this, state);
      } catch (e) {
        this._onError(e);
        return disposableEmpty;
      }
    };

    MyErrorScheduler.prototype.schedulePeriodic = function (state, period, action) {
      Scheduler.immediate.schedule(this, function (_, self) {
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

    return MyErrorScheduler;
  }(Scheduler));

  test('catch custom unhandled', function () {
    var err;
    var scheduler = new MyErrorScheduler(function (ex) { err = ex; });

    scheduler
      .catchError(function () { return true; })
      .schedule(null, function () { throw new Error('Should be caught'); });

    ok(!err);

    var ex1 = 'error';
    scheduler
      .catchError(function () { return ex1 instanceof Error; })
      .schedule(null, function () { throw ex1; });

    equal(err, ex1);
  });

  test('catch custom periodic caught', function () {
    var err;

    var scheduler = new MyErrorScheduler(function (ex) { err = ex; });

    var catcher = scheduler.catchError(function () { return true; });

    catcher.schedulePeriodic(42, 0, function () {
      throw new Error('Should be caught');
    });

    ok(!err);
  });

  test('catch custom periodic uncaught', function () {
    var ex = new Error('Error1');

    var err;

    var scheduler = new MyErrorScheduler(function (e) { err = e; });

    var catcher = scheduler.catchError(function (e) { return e instanceof String; });

    catcher.schedulePeriodic(42, 0, function () { throw ex; });

    equal(err, ex);
  });

}());
