/// <reference path="../rx.js" />

/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

(function(window) {

    // Check if browser vs node
    var root = window.Rx;

    QUnit.module('SchedulerTest');

    var Scheduler = root.Scheduler;

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
            return this.scheduleWithRelativeAndState(state, dueTime - this.now(), action);
        }

        return function (now) {
            var nowFunc = now === undefined ? defaultNow : function () { return now; };
            var scheduler = new Scheduler(nowFunc, schedule, scheduleRelative, scheduleAbsolute);
            scheduler.waitCycles = 0;

            return scheduler;
        };
    }());

    test('Scheduler_ScheduleNonRecursive', function () {
	    var ms = new MyScheduler();
	    var res = false;
	    ms.scheduleRecursive(function (a) {
		    res = true;
	    });
	    ok(res);
    });

    test('Scheduler_ScheduleRecursive', function () {
	    var ms = new MyScheduler();
	    var i = 0;
	    ms.scheduleRecursive(function (a) {
		    if (++i < 10) {
		        a();
		    }
	    });
	    equal(10, i);
    });

    test('Scheduler_ScheduleWithTimeNonRecursive', function () {
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

    test('Scheduler_ScheduleWithTimeRecursive', function () {
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

    test('Scheduler_ScheduleWithTimeSpanNonRecursive', function () {
	    var now = new Date().getTime();
	    var ms = new MyScheduler(now);
	    ms.check = function (a, s, t) {
		    equal(t, 0);
	    };

	    var res = false;
	    ms.scheduleRecursiveWithRelative(0, function (a) {
		    res = true;
	    });

	    ok(res);
	    equal(ms.waitCycles, 0);
    });

    test('Scheduler_ScheduleWithTimeRecursive', function () {
	    var now = new Date().getTime();
	    var i = 0;
	    var ms = new MyScheduler(now);
	    ms.check = function (a, s, t) {
		    return ok(t < 10);
	    };

	    ms.scheduleRecursiveWithRelative(0, function (a) {
		    if (++i < 10) {
		        a(i);
		    }
	    });

	    equal(ms.waitCycles, 45);
	    equal(10, i);
    });

    test('Catch_Builtin_Swallow_Shallow', function () {
        var swallow = Scheduler.immediate.catchException(function () { return true; });
        swallow.schedule(function () { throw new Error('Should be swallowed'); });
        ok(true);
    });

    test('Catch_Builtin_Swallow_Recursive', function () {
        var swallow = Scheduler.immediate.catchException(function () { return true; });
        swallow.scheduleWithState(42, function (self, state) {
            return self.schedule(function () { new Error('Should be swallowed'); });
        });
        ok(true);
    });

    var disposableEmpty = root.Disposable.empty;
    function MyDisposable() {
        this.isDisposed = false;
    }
    MyDisposable.prototype.dispose = function () {
        this.isDisposed = true;
    };

    var MyExceptionScheduler = (function () {
        function getNow() {
            return new Date().getTime();
        }

        function scheduleNow(state, action) {
            try {
                return action(this, state);
            } catch (e) {
                this._onError(e);
                return disposableEmpty;
            }
        }

        function notSupported() {
            throw new Error('not supported');
        }

        function schedulePeriodic(state, period, action) {
            var b = new MyDisposable(), self = this;
            Scheduler.immediate.schedule(function () {
                try {
                    var s = state;
                    for(var i = 0; true; i++) {
                        if (i > 10) {
                            break;
                        }
                        s = action(s);
                    }
                } catch (e) {
                    self._onError(e);
                }
            });
        }

        return function (onError) {
            var scheduler = new Scheduler(getNow, scheduleNow, notSupported, notSupported);
            scheduler._onError = onError;
            scheduler.schedulePeriodicWithState = schedulePeriodic.bind(scheduler);
            return scheduler;
        };
    }());

    test('Catch_Custom_Unhandled', function () {
        var err;
        var scheduler = new MyExceptionScheduler(function (ex) { err = ex; });
        scheduler.catchException(function () { return true; }).schedule(function () {
            throw new Error('Should be caught');
        });
        ok(!err);

        var ex1 = 'error';
        scheduler.catchException(function () { return ex1 instanceof Error; }).schedule(function () {
            throw ex1;
        });
        equal(err, ex1);
    });

    test('Catch_Custom_Periodic_Caught', function () {
        var err;
        var scheduler = new MyExceptionScheduler(function (ex) { err = ex; });
        var catcher = scheduler.catchException(function () { return true; });
        catcher.schedulePeriodicWithState(42, 0, function () {
            throw new Error('Should be caught');
        });

        ok(!err);
    });

    test('Catch_Custom_Periodic_Uncaught1', function () {
        var ex = new Error('Error1');
        var err;
        var scheduler = new MyExceptionScheduler(function (e) { err = e; });
        var catcher = scheduler.catchException(function (e) { return e instanceof String; });
        catcher.schedulePeriodicWithState(42, 0, function () {
            throw ex;
        });

        equal(err, ex);
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    
}(typeof global == 'object' && global || this));
