QUnit.module('Observer');

var Observer = Rx.Observer,
    createOnNext = Rx.Notification.createOnNext,
    createOnError = Rx.Notification.createOnError,
    createOnCompleted = Rx.Notification.createOnCompleted;

test('ToObserver_NotificationOnNext', function () {
    var i = 0;
    var next = function (n) {
        equal(i++, 0);
        equal(n.kind, 'N');
        equal(n.value, 42);
        equal(n.exception, undefined);
        ok(n.hasValue);
    };
    Observer.fromNotifier(next).onNext(42);
});

test('ToObserver_NotificationOnError', function () {
    var ex = 'ex';
    var i = 0;
    var next = function (n) {
        equal(i++, 0);
        equal(n.kind, 'E');
        equal(n.exception, ex);
        ok(!n.hasValue);
    };
    Observer.fromNotifier(next).onError(ex);
});

test('ToObserver_NotificationOnCompleted', function () {
    var i = 0;
    var next = function (n) {
        equal(i++, 0);
        equal(n.kind, 'C');
        ok(!n.hasValue);
    };
    Observer.fromNotifier(next).onCompleted();
});

test('ToNotifier_Forwards', function () {
    var obsn = new MyObserver();
    obsn.toNotifier()(createOnNext(42));
    equal(obsn.hasOnNext, 42);

    var ex = 'ex';
    var obse = new MyObserver();
    obse.toNotifier()(createOnError(ex));
    equal(ex, obse.hasOnError);

    obsc = new MyObserver();
    obsc.toNotifier()(createOnCompleted());
    ok(obsc.hasOnCompleted);
});

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

var MyObserver = (function () {
    function onNext (value) {
        this.hasOnNext = value;
    }

    function onError (err) {
        this.hasOnError = err;
    }

    function onCompleted () {
        this.hasOnCompleted = true;
    }

    return function () {
        var obs = new Observer();
        obs.onNext = onNext.bind(obs);
        obs.onError = onError.bind(obs);
        obs.onCompleted = onCompleted.bind(obs);

        return obs;
    };
}());

test('AsObserver_Hides', function () {
    var obs, res;
    obs = new MyObserver();
    res = obs.asObserver();
    notDeepEqual(obs, res);
});

test('AsObserver_Forwards', function () {
    var obsn = new MyObserver();
    obsn.asObserver().onNext(42);
    equal(obsn.hasOnNext, 42);

    var ex = 'ex';
    obse = new MyObserver();
    obse.asObserver().onError(ex);
    equal(obse.hasOnError, ex);

    var obsc = new MyObserver();
    obsc.asObserver().onCompleted();
    ok(obsc.hasOnCompleted);
});
