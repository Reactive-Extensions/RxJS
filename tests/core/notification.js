QUnit.module('NotificationTest');

var createOnNext = Rx.Notification.createOnNext,
    createOnError = Rx.Notification.createOnError,
    createOnCompleted = Rx.Notification.createOnCompleted;

var inherits = Rx.internals.inherits;

test('OnNext_CtorAndProps', function () {
    var n = createOnNext(42);
    equal('N', n.kind);
    ok(n.hasValue);
    equal(42, n.value);
    ok(n.exception === undefined);
});

test('OnNext_ToString', function () {
    var n1 = createOnNext(42);
    ok(n1.toString().indexOf('OnNext') !== -1);
    ok(n1.toString().indexOf('42') !== -1);
});

var CheckOnNextObserver = (function (super_) {

    inherits(CheckOnNextObserver, super_);

    function CheckOnNextObserver() {
        super_.call(this);
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
}(Rx.Observer));

test('OnNext_AcceptObserver', function () {
    var con, n1;
    con = new CheckOnNextObserver();
    n1 = createOnNext(42);
    n1.accept(con);
    equal(42, con.Value);
});

var AcceptObserver = (function (super_) {

    inherits(AcceptObserver, super_);

    function AcceptObserver(onNext, onError, onCompleted) {
        super_.call(this);
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
}(Rx.Observer));

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

test('OnError_ToString', function () {
    var ex, n1;
    ex = 'ex';
    n1 = createOnError(ex);
    ok(n1.toString().indexOf('OnError') !== -1);
    return ok(n1.toString().indexOf('ex') !== -1);
});

var CheckOnErrorObserver = (function (super_) {

    inherits(CheckOnErrorObserver, super_);

    function CheckOnErrorObserver() {
        super_.call(this);
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

}(Rx.Observer));

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

test('OnCompleted_ToString', function () {
    var n1;
    n1 = createOnCompleted();
    ok(n1.toString().indexOf('OnCompleted') !== -1);
});

var CheckOnCompletedObserver = (function (super_) {

    inherits(CheckOnCompletedObserver, super_);

    function CheckOnCompletedObserver() {
        super_.call(this);
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
}(Rx.Observer));

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