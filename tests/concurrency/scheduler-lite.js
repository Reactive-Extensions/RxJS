(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, ok, equal */
  QUnit.module('Scheduler');

  var Scheduler = Rx.Scheduler;

  var MyScheduler = (function () {

    function defaultNow() {
      return new Date().getTime();
    }

    function schedule(state, action) {
      return action(this, state);
    }

    function scheduleRelative(state, dueTime, action) {
      var self = this;
      this.check(function (o) {
          return action(self, o);
      }, state, dueTime);
      this.waitCycles += dueTime;
      return action(this, state);
    }

    function scheduleAbsolute(state, dueTime, action) {
      return this.scheduleFuture(state, dueTime - this.now(), action);
    }

    return function (now) {
      var nowFunc = now === undefined ? defaultNow : function () { return now; };
      var scheduler = new Scheduler(nowFunc, schedule, scheduleRelative, scheduleAbsolute);
      scheduler.waitCycles = 0;

      return scheduler;
    };
  }());

  test('scheduler ScheduleNonRecursive', function () {
      var ms = new MyScheduler();
      var res = false;
      ms.scheduleRecursive(function () {
  	    res = true;
      });
      ok(res);
  });

  test('scheduler ScheduleRecursive', function () {
      var ms = new MyScheduler();
      var i = 0;
      ms.scheduleRecursive(function (a) {
  	    if (++i < 10) {
  	        a();
  	    }
      });
      equal(10, i);
  });

  test('scheduler ScheduleWithTimeNonRecursive', function () {
      var now = new Date().getTime();
      var ms = new MyScheduler(now);
      var res = false;
      ms.check = function (a, s, t) {
  	    equal(t, 0);
      };
      ms.scheduleWithAbsolute(now, function () {
  	    res = true;
      });
      ok(res);
      equal(ms.waitCycles, 0);
  });

  test('scheduler ScheduleWithTimeRecursive', function () {
      var now = new Date().getTime();
      var i = 0;
      var ms = new MyScheduler(now);
      ms.check = function (a, s, t) {
          equal(t, 0);
      };

      ms.scheduleRecursiveWithAbsolute(now, function (a) {
  	    if (++i < 10) {
  	        a(now);
  	    }
      });

      equal(ms.waitCycles, 0);
      equal(10, i);
  });

  test('scheduler ScheduleWithTimeSpanNonRecursive', function () {
      var now = new Date().getTime();
      var ms = new MyScheduler(now);
      ms.check = function (a, s, t) {
  	    equal(t, 0);
      };

      var res = false;
      ms.scheduleRecursiveWithRelative(0, function () {
  	    res = true;
      });

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

    ms.scheduleRecursiveWithRelative(0, function (a) {
	    if (++i < 10) { a(i); }
    });

    equal(ms.waitCycles, 45);
    equal(10, i);
  });

}());
