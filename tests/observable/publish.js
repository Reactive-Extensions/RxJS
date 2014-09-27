QUnit.module('Publish');

var TestScheduler = Rx.TestScheduler,
    Observable = Rx.Observable,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    Subject = Rx.Subject,
    created = Rx.ReactiveTest.created,
    disposed = Rx.ReactiveTest.disposed,
    subscribed = Rx.ReactiveTest.subscribed,
    inherits = Rx.internals.inherits;

test('Publish_Cold_Zip', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onCompleted(390));
    results = scheduler.startWithCreate(function () {
        return xs.publish(function (ys) {
            return ys.zip(ys, function (a, b) {
                return a + b;
            });
        });
    });
    results.messages.assertEqual(onNext(210, 6), onNext(240, 8), onNext(270, 10), onNext(330, 12), onNext(340, 14), onCompleted(390));
    xs.subscriptions.assertEqual(subscribe(200, 390));
});

var MySubject = (function (_super) {

    function subscribe(observer) {
        var self = this;
        this.subscribeCount++;
        this.observer = observer;
        return {
            dispose: function () {
                self.disposed = true;
            }
        };
    }

    inherits(MySubject, _super);
    function MySubject() {
        _super.call(this, subscribe);
        this.disposeOnMap = {};
        this.subscribeCount = 0;
        this.disposed = false;
    }
    MySubject.prototype.disposeOn = function (value, disposable) {
        this.disposeOnMap[value] = disposable;
    };
    MySubject.prototype.onNext = function (value) {
        this.observer.onNext(value);
        if (this.disposeOnMap[value] !== undefined) {
            this.disposeOnMap[value].dispose();
        }
    };
    MySubject.prototype.onError = function (exception) {
        this.observer.onError(exception);
    };
    MySubject.prototype.onCompleted = function () {
        this.observer.onCompleted();
    };

    return MySubject;
})(Observable);

var ConnectableObservable = (function (_super) {

    function subscribe(observer) {
        return this._o.subscribe(observer);
    }

    inherits(ConnectableObservable, _super);

    function ConnectableObservable(o, s) {
        _super.call(this, subscribe);
        this._o = o.multicast(s);
    }

    ConnectableObservable.prototype.connect = function () { return this._o.connect(); };
    ConnectableObservable.prototype.refCount = function () { return this._o.refCount(); };

    return ConnectableObservable;
}(Observable));

test('RefCount_ConnectsOnFirst', function () {
    var conn, res, scheduler, subject, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onCompleted(250));
    subject = new MySubject();
    conn = new ConnectableObservable(xs, subject);
    res = scheduler.startWithCreate(function () {
        return conn.refCount();
    });
    res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onCompleted(250));
    ok(subject.disposed);
});
test('RefCount_NotConnected', function () {
    var conn, count, dis1, dis2, dis3, disconnected, refd, subject, xs;
    disconnected = false;
    count = 0;
    xs = Observable.defer(function () {
        count++;
        return Observable.create(function (obs) {
            return function () {
                disconnected = true;
            };
        });
    });
    subject = new MySubject();
    conn = new ConnectableObservable(xs, subject);
    refd = conn.refCount();
    dis1 = refd.subscribe();
    equal(1, count);
    equal(1, subject.subscribeCount);
    ok(!disconnected);
    dis2 = refd.subscribe();
    equal(1, count);
    equal(2, subject.subscribeCount);
    ok(!disconnected);
    dis1.dispose();
    ok(!disconnected);
    dis2.dispose();
    ok(disconnected);
    disconnected = false;
    dis3 = refd.subscribe();
    equal(2, count);
    equal(3, subject.subscribeCount);
    ok(!disconnected);
    dis3.dispose();
    ok(disconnected);
});

test('Publish_Basic', function () {
    var connection, results, scheduler, subscription, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    ys = null;
    subscription = null;
    connection = null;
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.publish();
    });
    scheduler.scheduleAbsolute(subscribed, function () {
        subscription = ys.subscribe(results);
    });
    scheduler.scheduleAbsolute(disposed, function () {
        subscription.dispose();
    });
    scheduler.scheduleAbsolute(300, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(400, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(500, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(550, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(650, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(800, function () {
        connection.dispose();
    });
    scheduler.start();
    results.messages.assertEqual(onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(520, 11));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
});

test('Publish_Error', function () {
    var connection, ex, results, scheduler, subscription, xs, ys;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.publish();
    });
    scheduler.scheduleAbsolute(subscribed, function () {
        subscription = ys.subscribe(results);
    });
    scheduler.scheduleAbsolute(disposed, function () {
        subscription.dispose();
    });
    scheduler.scheduleAbsolute(300, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(400, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(500, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(800, function () {
        connection.dispose();
    });
    scheduler.start();
    results.messages.assertEqual(onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(520, 11), onNext(560, 20), onError(600, ex));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
});

test('Publish_Complete', function () {
    var connection, results, scheduler, subscription, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.publish();
    });
    scheduler.scheduleAbsolute(subscribed, function () {
        subscription = ys.subscribe(results);
    });
    scheduler.scheduleAbsolute(disposed, function () {
        subscription.dispose();
    });
    scheduler.scheduleAbsolute(300, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(400, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(500, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(800, function () {
        connection.dispose();
    });
    scheduler.start();
    results.messages.assertEqual(onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(520, 11), onNext(560, 20), onCompleted(600));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
});

test('Publish_Dispose', function () {
    var connection, results, scheduler, subscription, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.createObserver();
    scheduler.scheduleAbsolute(created, function () {
        ys = xs.publish();
    });
    scheduler.scheduleAbsolute(subscribed, function () {
        subscription = ys.subscribe(results);
    });
    scheduler.scheduleAbsolute(350, function () {
        subscription.dispose();
    });
    scheduler.scheduleAbsolute(300, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(400, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(500, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(550, function () {
        connection.dispose();
    });
    scheduler.scheduleAbsolute(650, function () {
        connection = ys.connect();
    });
    scheduler.scheduleAbsolute(800, function () {
        connection.dispose();
    });
    scheduler.start();
    results.messages.assertEqual(onNext(340, 8));
    xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
});

test('Publish_MultipleConnections', function () {
    var connection1, connection2, connection3, xs, ys;
    xs = Observable.never();
    ys = xs.publish();
    connection1 = ys.connect();
    connection2 = ys.connect();
    ok(connection1 === connection2);
    connection1.dispose();
    connection2.dispose();
    connection3 = ys.connect();
    ok(connection1 !== connection3);
    connection3.dispose();
});

test('PublishLambda_Zip_Complete', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.startWithCreate(function () {
        return xs.publish(function (_xs) {
            return _xs.zip(_xs.skip(1), function (prev, cur) {
                return cur + prev;
            });
        });
    });
    results.messages.assertEqual(onNext(280, 7), onNext(290, 5), onNext(340, 9), onNext(360, 13), onNext(370, 11), onNext(390, 13), onNext(410, 20), onNext(430, 15), onNext(450, 11), onNext(520, 20), onNext(560, 31), onCompleted(600));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('PublishLambda_Zip_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
    results = scheduler.startWithCreate(function () {
        return xs.publish(function (_xs) {
            return _xs.zip(_xs.skip(1), function (prev, cur) {
                return cur + prev;
            });
        });
    });
    results.messages.assertEqual(onNext(280, 7), onNext(290, 5), onNext(340, 9), onNext(360, 13), onNext(370, 11), onNext(390, 13), onNext(410, 20), onNext(430, 15), onNext(450, 11), onNext(520, 20), onNext(560, 31), onError(600, ex));
    xs.subscriptions.assertEqual(subscribe(200, 600));
});

test('PublishLambda_Zip_Dispose', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
    results = scheduler.startWithDispose(function () {
        return xs.publish(function (_xs) {
            return _xs.zip(_xs.skip(1), function (prev, cur) {
                return cur + prev;
            });
        });
    }, 470);
    results.messages.assertEqual(onNext(280, 7), onNext(290, 5), onNext(340, 9), onNext(360, 13), onNext(370, 11), onNext(390, 13), onNext(410, 20), onNext(430, 15), onNext(450, 11));
    xs.subscriptions.assertEqual(subscribe(200, 470));
});
