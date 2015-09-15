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

}());
