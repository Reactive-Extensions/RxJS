/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

(function(window) {

    // Check if browser vs node
    var root = window.Rx;

    QUnit.module('NotificationTest');

    var createOnNext = root.Notification.createOnNext,
        createOnError = root.Notification.createOnError,
        createOnCompleted = root.Notification.createOnCompleted;

    var hasProperty = {}.hasOwnProperty,
	    inherits = function (child, parent) {
	        for (var key in parent) {
	            if (hasProperty.call(parent, key)) {
	                child[key] = parent[key];
	            }
	        }
	        function ctor() { this.constructor = child; }
	        ctor.prototype = parent.prototype;
	        child.prototype = new ctor;
	        child.base = parent.prototype;
	        return child;
	    };

    test('OnNext_CtorAndProps', function () {
        var n = createOnNext(42);
        equal('N', n.kind);
        ok(n.hasValue);
        equal(42, n.value);
        ok(n.exception === undefined);
    });

    test('OnNext_Equality', function () {
        var n1, n2, n3, n4;
        n1 = createOnNext(42);
        n2 = createOnNext(42);
        n3 = createOnNext(24);
        n4 = createOnCompleted();
        ok(n1.equals(n1));
        ok(n1.equals(n2));
        ok(n2.equals(n1));
        ok(!n1.equals(null));
        ok(!n1.equals(n3));
        ok(!n3.equals(n1));
        ok(!n1.equals(n4));
        ok(!n4.equals(n1));
    });

    test('OnNext_ToString', function () {
        var n1;
        n1 = createOnNext(42);
        ok(n1.toString().indexOf('OnNext') !== -1);
        return ok(n1.toString().indexOf('42') !== -1);
    });

    var CheckOnNextObserver = (function () {
        inherits(CheckOnNextObserver, Rx.Observer);
        function CheckOnNextObserver() {
            CheckOnNextObserver.base.constructor.apply(this, arguments);
        }
        CheckOnNextObserver.prototype.Value = null;
        CheckOnNextObserver.prototype.onNext = function (value) {
            return this.Value = value;
        };
        CheckOnNextObserver.prototype.onError = function () {
            throw new Error('not implemented');
        };
        CheckOnNextObserver.prototype.onCompleted = function () {
            return function () {
                throw new Error('not implemented');
            };
        };
        return CheckOnNextObserver;
    })();

    test('OnNext_AcceptObserver', function () {
        var con, n1;
        con = new CheckOnNextObserver();
        n1 = createOnNext(42);
        n1.accept(con);
        equal(42, con.Value);
    });

    var AcceptObserver = (function () {
        inherits(AcceptObserver, Rx.Observer);
        function AcceptObserver(onNext, onError, onCompleted) {
            this._onNext = onNext;
            this._onError = onError;
            this._onCompleted = onCompleted;
        }
        AcceptObserver.prototype.onNext = function (value) {
            return this._onNext(value);
        };
        AcceptObserver.prototype.onError = function (exception) {
            return this._onError(exception);
        };
        AcceptObserver.prototype.onCompleted = function () {
            return this._onCompleted();
        };
        return AcceptObserver;
    })();

    test('OnNext_AcceptObserverWithResult', function () {
        var n1, res;
        n1 = createOnNext(42);
        res = n1.accept(new AcceptObserver(function (x) {
            return 'OK';
        }, function () {
            ok(false);
            return false;
        }, function () {
            ok(false);
            return false;
        }));
        equal('OK', res);
    });

    test('OnNext_AcceptAction', function () {
        var n1, obs;
        obs = false;
        n1 = createOnNext(42);
        n1.accept(function () {
            return obs = true;
        }, function () {
            return ok(false);
        }, function () {
            return ok(false);
        });
        ok(obs);
    });

    test('OnNext_AcceptActionWithResult', function () {
        var n1, res;
        n1 = createOnNext(42);
        res = n1.accept(function (x) {
            return 'OK';
        }, function (_) {
            return ok(false);
        }, function () {
            return ok(false);
        });
        equal('OK', res);
    });

    test('OnError_CtorAndProps', function () {
        var e, n;
        e = 'e';
        n = createOnError(e);
        equal('E', n.kind);
        ok(!n.hasValue);
        equal(e, n.exception);
    });

    test('OnError_Equality', function () {
        var ex1, ex2, n1, n2, n3, n4;
        ex1 = 'ex1';
        ex2 = 'ex2';
        n1 = createOnError(ex1);
        n2 = createOnError(ex1);
        n3 = createOnError(ex2);
        n4 = createOnCompleted();
        ok(n1.equals(n1));
        ok(n1.equals(n2));
        ok(n2.equals(n1));
        ok(!n1.equals(null));
        ok(!n1.equals(n3));
        ok(!n3.equals(n1));
        ok(!n1.equals(n4));
        ok(!n4.equals(n1));
    });

    test('OnError_ToString', function () {
        var ex, n1;
        ex = 'ex';
        n1 = createOnError(ex);
        ok(n1.toString().indexOf('OnError') !== -1);
        return ok(n1.toString().indexOf('ex') !== -1);
    });

    var CheckOnErrorObserver;
    CheckOnErrorObserver = (function () {
        inherits(CheckOnErrorObserver, Rx.Observer);
        function CheckOnErrorObserver() {
            CheckOnErrorObserver.base.constructor.apply(this, arguments);
        }
        CheckOnErrorObserver.prototype.Error = null;
        CheckOnErrorObserver.prototype.onNext = function (value) {
            throw new Error('not implemented');
        };
        CheckOnErrorObserver.prototype.onError = function (exception) {
            this.Error = exception;
        };
        CheckOnErrorObserver.prototype.onCompleted = function () {
            throw new Error('not implemented');
        };
        return CheckOnErrorObserver;
    })();

    test('OnError_AcceptObserver', function () {
        var ex, n1, obs;
        ex = 'ex';
        obs = new CheckOnErrorObserver();
        n1 = createOnError(ex);
        n1.accept(obs);
        equal(ex, obs.Error);
    });

    test('OnError_AcceptObserverWithResult', function () {
        var ex, n1, res;
        ex = 'ex';
        n1 = createOnError(ex);
        res = n1.accept(new AcceptObserver(function (x) {
            ok(false);
            return null;
        }, function () {
            return 'OK';
        }, function () {
            ok(false);
            return null;
        }));
        equal('OK', res);
    });

    test('OnError_AcceptAction', function () {
        var ex, n1, obs;
        ex = 'ex';
        obs = false;
        n1 = createOnError(ex);
        n1.accept(function () {
            return ok(false);
        }, function () {
            return obs = true;
        }, function () {
            return ok(false);
        });
        ok(obs);
    });

    test('OnError_AcceptActionWithResult', function () {
        var ex, n1, res;
        ex = 'ex';
        n1 = createOnError(ex);
        res = n1.accept(function () {
            ok(false);
            return null;
        }, function () {
            return 'OK';
        }, function () {
            ok(false);
            return null;
        });
        equal('OK', res);
    });

    test('OnCompleted_CtorAndProps', function () {
        var n;
        n = createOnCompleted();
        equal('C', n.kind);
        ok(!n.hasValue);
        ok(n.exception === undefined);
    });

    test('OnCompleted_Equality', function () {
        var n1, n2, n3;
        n1 = createOnCompleted();
        n2 = createOnCompleted();
        n3 = createOnNext(2);
        ok(n1.equals(n1));
        ok(n1.equals(n2));
        ok(n2.equals(n1));
        ok(!n1.equals(null));
        ok(!n1.equals(n3));
        ok(!n3.equals(n1));
    });

    test('OnCompleted_ToString', function () {
        var n1;
        n1 = createOnCompleted();
        ok(n1.toString().indexOf('OnCompleted') !== -1);
    });

    var CheckOnCompletedObserver = (function () {
        inherits(CheckOnCompletedObserver, Rx.Observer);
        function CheckOnCompletedObserver() {
            CheckOnCompletedObserver.base.constructor.apply(this, arguments);
        }
        CheckOnCompletedObserver.prototype.Completed = false;
        CheckOnCompletedObserver.prototype.onNext = function () {
            throw new Error('not implemented');
        };
        CheckOnCompletedObserver.prototype.onError = function () {
            throw new Error('not implemented');
        };
        CheckOnCompletedObserver.prototype.onCompleted = function () {
            return this.Completed = true;
        };
        return CheckOnCompletedObserver;
    })();

    test('OnCompleted_AcceptObserver', function () {
        var n1, obs;
        obs = new CheckOnCompletedObserver();
        n1 = createOnCompleted();
        n1.accept(obs);
        ok(obs.Completed);
    });

    test('OnCompleted_AcceptObserverWithResult', function () {
        var n1, res;
        n1 = createOnCompleted();
        res = n1.accept(new AcceptObserver(function (x) {
            return ok(false);
        }, function (e) {
            return ok(false);
        }, function () {
            return 'OK';
        }));
        equal('OK', res);
    });

    test('OnCompleted_AcceptAction', function () {
        var n1, obs;
        obs = false;
        n1 = createOnCompleted();
        n1.accept(function (x) {
            return ok(false);
        }, function (e) {
            return ok(false);
        }, function () {
            return obs = true;
        });
        ok(obs);
    });

    test('OnCompleted_AcceptActionWithResult', function () {
        var n1, res;
        n1 = createOnCompleted();
        res = n1.accept(function (x) {
            return ok(false);
        }, function (e) {
            return ok(false);
        }, function () {
            return 'OK';
        });
        equal('OK', res);
    });

    test('ToObservable_Empty', function () {
        var res, scheduler;
        scheduler = new Rx.TestScheduler();
        res = scheduler.startWithCreate(function () {
            return createOnCompleted().toObservable(scheduler);
        });
        res.messages.assertEqual(Rx.ReactiveTest.onCompleted(201));
    });

    test('ToObservable_Return', function () {
        var res, scheduler;
        scheduler = new Rx.TestScheduler();
        res = scheduler.startWithCreate(function () {
            return createOnNext(42).toObservable(scheduler);
        });
        res.messages.assertEqual(Rx.ReactiveTest.onNext(201, 42), Rx.ReactiveTest.onCompleted(201));
    });

    test('ToObservable_Throw', function () {
        var ex, res, scheduler;
        ex = 'ex';
        scheduler = new Rx.TestScheduler();
        res = scheduler.startWithCreate(function () {
            return createOnError(ex).toObservable(scheduler);
        });
        res.messages.assertEqual(Rx.ReactiveTest.onError(201, ex));
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    
}(typeof global == 'object' && global || this));