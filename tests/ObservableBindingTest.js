(function(window) {

    var root = window.Rx;

    QUnit.module('ObservableBindingTest');

    var TestScheduler = root.TestScheduler,
        Observable = root.Observable,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe,
        Subject = root.Subject,
        created = root.ReactiveTest.created,
        disposed = root.ReactiveTest.disposed,
        subscribed = root.ReactiveTest.subscribed,
        inherits = root.Internals.inherits;

    test('Multicast_Hot_1', function () {
        var c, d1, d2, o, s, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onCompleted(390));
        s = new Subject();
        o = scheduler.createObserver();
        scheduler.scheduleAbsolute(50,function () {
            c = xs.multicast(s);
        });
        scheduler.scheduleAbsolute(100, function () {
            d1 = c.subscribe(o);
        });
        scheduler.scheduleAbsolute(200, function () {
            d2 = c.connect();
        });
        scheduler.scheduleAbsolute(300, function () {
            d1.dispose();
        });
        scheduler.start();
        o.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(270, 5));
        xs.subscriptions.assertEqual(subscribe(200, 390));
    });
    test('Multicast_Hot_2', function () {
        var c, d1, d2, o, s, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onCompleted(390));
        s = new Subject();
        o = scheduler.createObserver();
        scheduler.scheduleAbsolute(50, function () {
            c = xs.multicast(s);
        });
        scheduler.scheduleAbsolute(100, function () {
            d2 = c.connect();
        });
        scheduler.scheduleAbsolute(200, function () {
            d1 = c.subscribe(o);
        });
        scheduler.scheduleAbsolute(300, function () {
            return d1.dispose();
        });
        scheduler.start();
        o.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(270, 5));
        xs.subscriptions.assertEqual(subscribe(100, 390));
    });
    test('Multicast_Hot_2', function () {
        var c, d1, d2, o, s, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onCompleted(390));
        s = new Subject();
        o = scheduler.createObserver();
        scheduler.scheduleAbsolute(50, function () {
            c = xs.multicast(s);
        });
        scheduler.scheduleAbsolute(100, function () {
            d2 = c.connect();
        });
        scheduler.scheduleAbsolute(200, function () {
            d1 = c.subscribe(o);
        });
        scheduler.scheduleAbsolute(300, function () {
            return d1.dispose();
        });
        scheduler.start();
        o.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(270, 5));
        xs.subscriptions.assertEqual(subscribe(100, 390));
    });
    test('Multicast_Hot_3', function () {
        var c, d1, d2, o, s, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onCompleted(390));
        s = new Subject();
        o = scheduler.createObserver();
        scheduler.scheduleAbsolute(50, function () {
            c = xs.multicast(s);
        });
        scheduler.scheduleAbsolute(100, function () {
            d2 = c.connect();
        });
        scheduler.scheduleAbsolute(200, function () {
            d1 = c.subscribe(o);
        });
        scheduler.scheduleAbsolute(300, function () {
            d2.dispose();
        });
        scheduler.scheduleAbsolute(335, function () {
            d2 = c.connect();
        });
        scheduler.start();
        o.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(340, 7), onCompleted(390));
        xs.subscriptions.assertEqual(subscribe(100, 300), subscribe(335, 390));
    });
    test('Multicast_Hot_4', function () {
        var c, d1, d2, ex, o, s, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onError(390, ex));
        s = new Subject();
        o = scheduler.createObserver();
        scheduler.scheduleAbsolute(50, function () {
            c = xs.multicast(s);
        });
        scheduler.scheduleAbsolute(100, function () {
            d2 = c.connect();
        });
        scheduler.scheduleAbsolute(200, function () {
            d1 = c.subscribe(o);
        });
        scheduler.scheduleAbsolute(300, function () {
            d2.dispose();
        });
        scheduler.scheduleAbsolute(335, function () {
            d2 = c.connect();
        });
        scheduler.start();
        o.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(340, 7), onError(390, ex));
        xs.subscriptions.assertEqual(subscribe(100, 300), subscribe(335, 390));
    });
    test('Multicast_Hot_5', function () {
        var c, d1, d2, ex, o, s, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onError(390, ex));
        s = new Subject();
        o = scheduler.createObserver();
        scheduler.scheduleAbsolute(50, function () {
            c = xs.multicast(s);
        });
        scheduler.scheduleAbsolute(100, function () {
            d2 = c.connect();
        });
        scheduler.scheduleAbsolute(400, function () {
            d1 = c.subscribe(o);
        });
        scheduler.start();
        o.messages.assertEqual(onError(400, ex));
        xs.subscriptions.assertEqual(subscribe(100, 390));
    });
    test('Multicast_Hot_6', function () {
        var c, d1, d2, ex, o, s, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onCompleted(390));
        s = new Subject();
        o = scheduler.createObserver();
        scheduler.scheduleAbsolute(50, function () {
            c = xs.multicast(s);
        });
        scheduler.scheduleAbsolute(100, function () {
            d2 = c.connect();
        });
        scheduler.scheduleAbsolute(400, function () {
            d1 = c.subscribe(o);
        });
        scheduler.start();
        o.messages.assertEqual(onCompleted(400));
        xs.subscriptions.assertEqual(subscribe(100, 390));
    });
    test('Multicast_Cold_Completed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onCompleted(390));
        results = scheduler.startWithCreate(function () {
            return xs.multicast(function () {
                return new Subject();
            }, function (ys) {
                return ys;
            });
        });
        results.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onCompleted(390));
        xs.subscriptions.assertEqual(subscribe(200, 390));
    });
    test('Multicast_Cold_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onError(390, ex));
        results = scheduler.startWithCreate(function () {
            return xs.multicast(function () {
                return new Subject();
            }, function (ys) {
                return ys;
            });
        });
        results.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onError(390, ex));
        xs.subscriptions.assertEqual(subscribe(200, 390));
    });
    test('Multicast_Cold_Dispose', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7));
        results = scheduler.startWithCreate(function () {
            return xs.multicast(function () {
                return new Subject();
            }, function (ys) {
                return ys;
            });
        });
        results.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7));
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('Multicast_Cold_Zip', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(40, 0), onNext(90, 1), onNext(150, 2), onNext(210, 3), onNext(240, 4), onNext(270, 5), onNext(330, 6), onNext(340, 7), onCompleted(390));
        results = scheduler.startWithCreate(function () {
            return xs.multicast(function () {
                return new Subject();
            }, function (ys) {
                return ys.zip(ys, function (a, b) {
                    return a + b;
                });
            });
        });
        results.messages.assertEqual(onNext(210, 6), onNext(240, 8), onNext(270, 10), onNext(330, 12), onNext(340, 14), onCompleted(390));
        xs.subscriptions.assertEqual(subscribe(200, 390));
    });
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

    var MySubject = (function () {

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

        inherits(MySubject, Observable);
        function MySubject() {
            this.disposeOnMap = {};
            this.subscribeCount = 0;
            this.disposed = false;
            MySubject.super_.constructor.call(this, subscribe);
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
    })();

    var ConnectableObservable = (function () {

        function subscribe(observer) {
            return this._o.subscribe(observer);
        }

        inherits(ConnectableObservable, Observable);

        function ConnectableObservable(o, s) {
            this._o = o.multicast(s);
            ConnectableObservable.super_.constructor.call(this, subscribe);
        }

        ConnectableObservable.prototype.connect = function () { return this._o.connect(); };
        ConnectableObservable.prototype.refCount = function () { return this._o.refCount(); };

        return ConnectableObservable;
    }());

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
    test('Prune_Basic', function () {
        var connection, results, scheduler, subscription, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            ys = xs.publishLast();
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
        results.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
    });
    test('Prune_Error', function () {
        var connection, ex, results, scheduler, subscription, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            ys = xs.publishLast();
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
        results.messages.assertEqual(onError(600, ex));
        xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
    });
    test('Prune_Complete', function () {
        var connection, results, scheduler, subscription, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            ys = xs.publishLast();
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
        results.messages.assertEqual(onNext(600, 20), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
    });
    test('Prune_Dispose', function () {
        var connection, results, scheduler, subscription, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            ys = xs.publishLast();
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
        results.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
    });
    test('Prune_MultipleConnections', function () {
        var connection1, connection2, connection3, xs, ys;
        xs = Observable.never();
        ys = xs.publishLast();
        connection1 = ys.connect();
        connection2 = ys.connect();
        ok(connection1 === connection2);
        connection1.dispose();
        connection2.dispose();
        connection3 = ys.connect();
        ok(connection1 !== connection3);
    });
    test('PruneLambda_Zip_Complete', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.publishLast(function (_xs) {
                return _xs.zip(_xs, function (x, y) {
                    return x + y;
                });
            });
        });
        results.messages.assertEqual(onNext(600, 40), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('PruneLambda_Zip_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
        results = scheduler.startWithCreate(function () {
            return xs.publishLast(function (_xs) {
                return _xs.zip(_xs, function (x, y) {
                    return x + y;
                });
            });
        });
        results.messages.assertEqual(onError(600, ex));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('PruneLambda_Zip_Dispose', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.startWithDispose(function () {
            return xs.publishLast(function (_xs) {
                return _xs.zip(_xs, function (x, y) {
                    return x + y;
                });
            });
        }, 470);
        results.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 470));
    });
    test('ReplayCount_Basic', function () {
        var connection, results, scheduler, subscription, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            ys = xs.replay(undefined, 3, undefined, scheduler);
        });
        scheduler.scheduleAbsolute(450, function () {
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
        results.messages.assertEqual(onNext(451, 5), onNext(452, 6), onNext(453, 7), onNext(521, 11));
        xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
    });
    test('ReplayCount_Error', function () {
        var connection, ex, results, scheduler, subscription, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
             ys = xs.replay(undefined, 3, undefined, scheduler);
        });
        scheduler.scheduleAbsolute(450, function () {
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
        results.messages.assertEqual(onNext(451, 5), onNext(452, 6), onNext(453, 7), onNext(521, 11), onNext(561, 20), onError(601, ex));
        xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
    });
    test('ReplayCount_Complete', function () {
        var connection, results, scheduler, subscription, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            ys = xs.replay(undefined, 3, undefined, scheduler);
        });
        scheduler.scheduleAbsolute(450, function () {
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
        results.messages.assertEqual(onNext(451, 5), onNext(452, 6), onNext(453, 7), onNext(521, 11), onNext(561, 20), onCompleted(601));
        xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
    });
    test('ReplayCount_Dispose', function () {
        var connection, results, scheduler, subscription, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            ys = xs.replay(undefined, 3, undefined, scheduler);
        });
        scheduler.scheduleAbsolute(450, function () {
            subscription = ys.subscribe(results);
        });
        scheduler.scheduleAbsolute(475, function () {
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
        results.messages.assertEqual(onNext(451, 5), onNext(452, 6), onNext(453, 7));
        xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
    });
    test('ReplayCount_MultipleConnections', function () {
        var connection1, connection2, connection3, xs, ys;
        xs = Observable.never();
        ys = xs.replay(undefined, 3);
        connection1 = ys.connect();
        connection2 = ys.connect();
        ok(connection1 === connection2);
        connection1.dispose();
        connection2.dispose();
        connection3 = ys.connect();
        ok(connection1 !== connection3);
    });
    test('ReplayCountLambda_Zip_Complete', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.startWithDispose(function () {
            return xs.replay(function (_xs) {
                return _xs.take(6).repeat();
            }, 3, undefined, scheduler);
        }, 610);
        results.messages.assertEqual(onNext(221, 3), onNext(281, 4), onNext(291, 1), onNext(341, 8), onNext(361, 5), onNext(371, 6), onNext(372, 8), onNext(373, 5), onNext(374, 6), onNext(391, 7), onNext(411, 13), onNext(431, 2), onNext(432, 7), onNext(433, 13), onNext(434, 2), onNext(451, 9), onNext(521, 11), onNext(561, 20), onNext(562, 9), onNext(563, 11), onNext(564, 20), onNext(602, 9), onNext(603, 11), onNext(604, 20), onNext(606, 9), onNext(607, 11), onNext(608, 20));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('ReplayCountLambda_Zip_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
        results = scheduler.startWithCreate(function () {
            return xs.replay(function (_xs) {
                return _xs.take(6).repeat();
            }, 3, undefined, scheduler);
        });
        results.messages.assertEqual(onNext(221, 3), onNext(281, 4), onNext(291, 1), onNext(341, 8), onNext(361, 5), onNext(371, 6), onNext(372, 8), onNext(373, 5), onNext(374, 6), onNext(391, 7), onNext(411, 13), onNext(431, 2), onNext(432, 7), onNext(433, 13), onNext(434, 2), onNext(451, 9), onNext(521, 11), onNext(561, 20), onNext(562, 9), onNext(563, 11), onNext(564, 20), onError(601, ex));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('ReplayCountLambda_Zip_Dispose', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.startWithDispose(function () {
            return xs.replay(function (_xs) {
                return _xs.take(6).repeat();
            }, 3, undefined, scheduler);
        }, 470);
        results.messages.assertEqual(onNext(221, 3), onNext(281, 4), onNext(291, 1), onNext(341, 8), onNext(361, 5), onNext(371, 6), onNext(372, 8), onNext(373, 5), onNext(374, 6), onNext(391, 7), onNext(411, 13), onNext(431, 2), onNext(432, 7), onNext(433, 13), onNext(434, 2), onNext(451, 9));
        xs.subscriptions.assertEqual(subscribe(200, 470));
    });
    test('ReplayTime_Basic', function () {
        var connection, results, scheduler, subscription, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            ys = xs.replay(undefined, undefined, 150, scheduler);
        });
        scheduler.scheduleAbsolute(450, function () {
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
        results.messages.assertEqual(onNext(451, 8), onNext(452, 5), onNext(453, 6), onNext(454, 7), onNext(521, 11));
        xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
    });
    test('ReplayTime_Error', function () {
        var connection, ex, results, scheduler, subscription, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            ys = xs.replay(undefined, undefined, 75, scheduler);
        });
        scheduler.scheduleAbsolute(450, function () {
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
        results.messages.assertEqual(onNext(451, 7), onNext(521, 11), onNext(561, 20), onError(601, ex));
        xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
    });
    test('ReplayTime_Complete', function () {
        var connection, results, scheduler, subscription, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            ys = xs.replay(undefined, undefined, 85, scheduler);
        });
        scheduler.scheduleAbsolute(450, function () {
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
        results.messages.assertEqual(onNext(451, 6), onNext(452, 7), onNext(521, 11), onNext(561, 20), onCompleted(601));
        xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
    });
    test('ReplayTime_Dispose', function () {
        var connection, results, scheduler, subscription, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            ys = xs.replay(undefined, undefined, 100, scheduler);
        });
        scheduler.scheduleAbsolute(450, function () {
            subscription = ys.subscribe(results);
        });
        scheduler.scheduleAbsolute(475, function () {
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
        results.messages.assertEqual(onNext(451, 5), onNext(452, 6), onNext(453, 7));
        xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
    });
    test('ReplayTime_MultipleConnections', function () {
        var connection1, connection2, connection3, xs, ys;
        xs = Observable.never();
        ys = xs.replay(undefined, undefined, 100);
        connection1 = ys.connect();
        connection2 = ys.connect();
        ok(connection1 === connection2);
        connection1.dispose();
        connection2.dispose();
        connection3 = ys.connect();
        ok(connection1 !== connection3);
    });
    test('ReplayTimeLambda_Zip_Complete', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.startWithDispose(function () {
            return xs.replay(function (_xs) {
                return _xs.take(6).repeat();
            }, undefined, 50, scheduler);
        }, 610);
        results.messages.assertEqual(onNext(221, 3), onNext(281, 4), onNext(291, 1), onNext(341, 8), onNext(361, 5), onNext(371, 6), onNext(372, 8), onNext(373, 5), onNext(374, 6), onNext(391, 7), onNext(411, 13), onNext(431, 2), onNext(432, 7), onNext(433, 13), onNext(434, 2), onNext(451, 9), onNext(521, 11), onNext(561, 20), onNext(562, 11), onNext(563, 20), onNext(602, 20), onNext(604, 20), onNext(606, 20), onNext(608, 20));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('ReplayTimeLambda_Zip_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
        results = scheduler.startWithCreate(function () {
            return xs.replay(function (_xs) {
                return _xs.take(6).repeat();
            }, undefined, 50, scheduler);
        });
        results.messages.assertEqual(onNext(221, 3), onNext(281, 4), onNext(291, 1), onNext(341, 8), onNext(361, 5), onNext(371, 6), onNext(372, 8), onNext(373, 5), onNext(374, 6), onNext(391, 7), onNext(411, 13), onNext(431, 2), onNext(432, 7), onNext(433, 13), onNext(434, 2), onNext(451, 9), onNext(521, 11), onNext(561, 20), onNext(562, 11), onNext(563, 20), onError(601, ex));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('ReplayTimeLambda_Zip_Dispose', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.startWithDispose(function () {
            return xs.replay(function (_xs) {
                return _xs.take(6).repeat();
            }, undefined, 50, scheduler);
        }, 470);
        results.messages.assertEqual(onNext(221, 3), onNext(281, 4), onNext(291, 1), onNext(341, 8), onNext(361, 5), onNext(371, 6), onNext(372, 8), onNext(373, 5), onNext(374, 6), onNext(391, 7), onNext(411, 13), onNext(431, 2), onNext(432, 7), onNext(433, 13), onNext(434, 2), onNext(451, 9));
        xs.subscriptions.assertEqual(subscribe(200, 470));
    });
    test('PublishWithInitialValue_Basic', function () {
        var connection, results, scheduler, subscription, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            ys = xs.publishValue(1979);
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
        results.messages.assertEqual(onNext(200, 1979), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(520, 11));
        xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
    });
    test('PublishWithInitialValue_Error', function () {
        var connection, ex, results, scheduler, subscription, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            ys = xs.publishValue(1979);
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
        results.messages.assertEqual(onNext(200, 1979), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(520, 11), onNext(560, 20), onError(600, ex));
        xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
    });
    test('PublishWithInitialValue_Complete', function () {
        var connection, results, scheduler, subscription, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            ys = xs.publishValue(1979);
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
        results.messages.assertEqual(onNext(200, 1979), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(520, 11), onNext(560, 20), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 600));
    });
    test('PublishWithInitialValue_Dispose', function () {
        var connection, results, scheduler, subscription, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        ys = null;
        subscription = null;
        connection = null;
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            ys = xs.publishValue(1979);
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
        results.messages.assertEqual(onNext(200, 1979), onNext(340, 8));
        xs.subscriptions.assertEqual(subscribe(300, 400), subscribe(500, 550), subscribe(650, 800));
    });
    test('PublishWithInitialValue_MultipleConnections', function () {
        var connection1, connection2, connection3, xs, ys;
        xs = Observable.never();
        ys = xs.publishValue(1979);
        connection1 = ys.connect();
        connection2 = ys.connect();
        ok(connection1 === connection2);
        connection1.dispose();
        connection2.dispose();
        connection3 = ys.connect();
        ok(connection1 !== connection3);
    });
    test('PublishWithInitialValueLambda_Zip_Complete', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.publishValue(function (_xs) {
                return _xs.zip(_xs.skip(1), function (prev, cur) {
                    return cur + prev;
                });
            }, 1979);
        });
        results.messages.assertEqual(onNext(220, 1982), onNext(280, 7), onNext(290, 5), onNext(340, 9), onNext(360, 13), onNext(370, 11), onNext(390, 13), onNext(410, 20), onNext(430, 15), onNext(450, 11), onNext(520, 20), onNext(560, 31), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('PublishWithInitialValueLambda_Zip_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onError(600, ex));
        results = scheduler.startWithCreate(function () {
            return xs.publishValue(function (_xs) {
                return _xs.zip(_xs.skip(1), function (prev, cur) {
                    return cur + prev;
                });
            }, 1979);
        });
        results.messages.assertEqual(onNext(220, 1982), onNext(280, 7), onNext(290, 5), onNext(340, 9), onNext(360, 13), onNext(370, 11), onNext(390, 13), onNext(410, 20), onNext(430, 15), onNext(450, 11), onNext(520, 20), onNext(560, 31), onError(600, ex));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('PublishWithInitialValueLambda_Zip_Dispose', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 7), onNext(220, 3), onNext(280, 4), onNext(290, 1), onNext(340, 8), onNext(360, 5), onNext(370, 6), onNext(390, 7), onNext(410, 13), onNext(430, 2), onNext(450, 9), onNext(520, 11), onNext(560, 20), onCompleted(600));
        results = scheduler.startWithDispose(function () {
            return xs.publishValue(function (_xs) {
                return _xs.zip(_xs.skip(1), function (prev, cur) {
                    return cur + prev;
                });
            }, 1979);
        }, 470);
        results.messages.assertEqual(onNext(220, 1982), onNext(280, 7), onNext(290, 5), onNext(340, 9), onNext(360, 13), onNext(370, 11), onNext(390, 13), onNext(410, 20), onNext(430, 15), onNext(450, 11));
        xs.subscriptions.assertEqual(subscribe(200, 470));
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    
}(typeof global == 'object' && global || this));