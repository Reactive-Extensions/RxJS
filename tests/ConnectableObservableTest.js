/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

(function(window) {

    // Check if browser vs node
    var root = window.Rx;

    QUnit.module('ConnectableObservableTest');

    var Observable = root.Observable,
        Subject = root.Subject,
        inherits = root.Internals.inherits,
        TestScheduler = root.TestScheduler,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe;

    var ConnectableObservable = (function () {

        function subscribe(observer) {
            return this._o.subscribe(observer);
        }

        inherits(ConnectableObservable, Observable);

        function ConnectableObservable(o, s) {
            this._o = o.multicast(s);
            ConnectableObservable.super_.constructor.call(this, subscribe);
        }

        ConnectableObservable.prototype.connect = function () {
            return this._o.connect();
        };

        ConnectableObservable.prototype.refCount = function () {
            return this._o.refCount();
        };

        return ConnectableObservable;
    }());

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

    test('ConnectableObservable_Creation', function () {
        var y = 0;

        var s2 = new Subject();
        var co2 = new ConnectableObservable(Observable.returnValue(1), s2);

        co2.subscribe(function (x) { y = x; });
        notEqual(1, y);
            
        co2.connect();
        equal(1, y);
    });

    test('ConnectableObservable_Connected', function () {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(210, 1),
            onNext(220, 2),
            onNext(230, 3),
            onNext(240, 4),
            onCompleted(250)
        );

        var subject = new MySubject();

        var conn = new ConnectableObservable(xs, subject);
        var disconnect = conn.connect();

        var res = scheduler.startWithCreate(function () { return conn; });

        res.messages.assertEqual(
            onNext(210, 1),
            onNext(220, 2),
            onNext(230, 3),
            onNext(240, 4),
            onCompleted(250)
        );
    });

    test('ConnectableObservable_NotConnected', function () {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(210, 1),
            onNext(220, 2),
            onNext(230, 3),
            onNext(240, 4),
            onCompleted(250)
        );

        var subject = new MySubject();

        var conn = new ConnectableObservable(xs, subject);

        var res = scheduler.startWithCreate(function () { return conn; });

        res.messages.assertEqual(
        );
    });

    test('ConnectableObservable_Disconnected', function () {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(210, 1),
            onNext(220, 2),
            onNext(230, 3),
            onNext(240, 4),
            onCompleted(250)
        );

        var subject = new MySubject();

        var conn = new ConnectableObservable(xs, subject);
        var disconnect = conn.connect();
        disconnect.dispose();

        var res = scheduler.startWithCreate(function () { return conn; });

        res.messages.assertEqual(
        );
    });

    test('ConnectableObservable_DisconnectFuture', function () {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(210, 1),
            onNext(220, 2),
            onNext(230, 3),
            onNext(240, 4),
            onCompleted(250)
        );

        var subject = new MySubject();

        var conn = new ConnectableObservable(xs, subject);
        subject.disposeOn(3, conn.connect());

        var res = scheduler.startWithCreate(function () { return conn; });

        res.messages.assertEqual(
            onNext(210, 1),
            onNext(220, 2),
            onNext(230, 3)
        );
    });

    test('ConnectableObservable_MultipleNonOverlappedConnections', function () {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(210, 1),
            onNext(220, 2),
            onNext(230, 3),
            onNext(240, 4),
            onNext(250, 5),
            onNext(260, 6),
            onNext(270, 7),
            onNext(280, 8),
            onNext(290, 9),
            onCompleted(300)
        );

        var subject = new Subject();

        var conn = xs.multicast(subject);

        var c1;
        scheduler.scheduleAbsolute(225, function () { c1 = conn.connect(); });
        scheduler.scheduleAbsolute(241, function () { c1.dispose(); });
        scheduler.scheduleAbsolute(245, function () { c1.dispose(); }); // idempotency test
        scheduler.scheduleAbsolute(251, function () { c1.dispose(); }); // idempotency test
        scheduler.scheduleAbsolute(260, function () { c1.dispose(); }); // idempotency test

        var c2;
        scheduler.scheduleAbsolute(249, function () { c2 = conn.connect(); });
        scheduler.scheduleAbsolute(255, function () { c2.dispose(); });
        scheduler.scheduleAbsolute(265, function () { c2.dispose(); }); // idempotency test
        scheduler.scheduleAbsolute(280, function () { c2.dispose(); }); // idempotency test

        var c3;
        scheduler.scheduleAbsolute(275, function () { c3 = conn.connect(); });
        scheduler.scheduleAbsolute(295, function () { c3.dispose(); });

        var res = scheduler.startWithCreate(function () { return conn; });

        res.messages.assertEqual(
            onNext(230, 3),
            onNext(240, 4),
            onNext(250, 5),
            onNext(280, 8),
            onNext(290, 9)
        );

        xs.subscriptions.assertEqual(
            subscribe(225, 241),
            subscribe(249, 255),
            subscribe(275, 295)
        );
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    
}(typeof global == 'object' && global || this));