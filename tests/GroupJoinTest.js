/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

(function(window) {

    var root = window.Rx;

    QUnit.module('GroupJoinTest');

    var TestScheduler = root.TestScheduler,
        Observable = root.Observable,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe;

    var TimeSpan = {
        fromTicks: function (value) {
            return value;
        }
    };

    var TimeInterval = (function () {
        function TimeInterval(value, interval) {
            this.value = value;
            this.interval = interval;
        }
        TimeInterval.prototype.toString = function () {
            return this.value + '@' + this.interval;
        };
        TimeInterval.prototype.Equals = function (other) {
            return this.toString() === other.toString();
        };
        TimeInterval.prototype.getHashCode = function () {
            return this.value.getHashCode() ^ this.interval.getHashCode();
        };
        return TimeInterval;
    })();

    test('JoinOp_Normal_I', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, 10)), onNext(219, new TimeInterval(1, 5)), onNext(240, new TimeInterval(2, 10)), onNext(300, new TimeInterval(3, 100)), onNext(310, new TimeInterval(4, 80)), onNext(500, new TimeInterval(5, 90)), onNext(700, new TimeInterval(6, 25)), onNext(710, new TimeInterval(7, 300)), onNext(720, new TimeInterval(8, 100)), onNext(830, new TimeInterval(9, 10)), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", 20)), onNext(217, new TimeInterval("bat", 1)), onNext(290, new TimeInterval("wag", 200)), onNext(300, new TimeInterval("pig", 10)), onNext(305, new TimeInterval("cup", 50)), onNext(600, new TimeInterval("yak", 90)), onNext(702, new TimeInterval("tin", 20)), onNext(712, new TimeInterval("man", 10)), onNext(722, new TimeInterval("rat", 200)), onNext(732, new TimeInterval("wig", 5)), onCompleted(800));
        results = scheduler.startWithCreate(function () {
            return xs.join(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, y) {
                return x.value + y.value;
            });
        });
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"), onNext(720, "8tin"), onNext(720, "8man"), onNext(722, "7rat"), onNext(722, "6rat"), onNext(722, "8rat"), onNext(732, "7wig"), onNext(732, "8wig"), onNext(830, "9rat"), onCompleted(900));
    });

    test('JoinOp_Normal_II', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, 10)), onNext(219, new TimeInterval(1, 5)), onNext(240, new TimeInterval(2, 10)), onNext(300, new TimeInterval(3, 100)), onNext(310, new TimeInterval(4, 80)), onNext(500, new TimeInterval(5, 90)), onNext(700, new TimeInterval(6, 25)), onNext(710, new TimeInterval(7, 200)), onNext(720, new TimeInterval(8, 100)), onCompleted(721));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", 20)), onNext(217, new TimeInterval("bat", 1)), onNext(290, new TimeInterval("wag", 200)), onNext(300, new TimeInterval("pig", 10)), onNext(305, new TimeInterval("cup", 50)), onNext(600, new TimeInterval("yak", 90)), onNext(702, new TimeInterval("tin", 20)), onNext(712, new TimeInterval("man", 10)), onNext(722, new TimeInterval("rat", 200)), onNext(732, new TimeInterval("wig", 5)), onCompleted(990));
        results = scheduler.startWithCreate(function () {
            return xs.join(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, y) {
                return x.value + y.value;
            });
        });
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"), onNext(720, "8tin"), onNext(720, "8man"), onNext(722, "7rat"), onNext(722, "6rat"), onNext(722, "8rat"), onNext(732, "7wig"), onNext(732, "8wig"), onCompleted(910));
    });

    test('JoinOp_Normal_III', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, 10)), onNext(219, new TimeInterval(1, 5)), onNext(240, new TimeInterval(2, 10)), onNext(300, new TimeInterval(3, 100)), onNext(310, new TimeInterval(4, 80)), onNext(500, new TimeInterval(5, 90)), onNext(700, new TimeInterval(6, 25)), onNext(710, new TimeInterval(7, 300)), onNext(720, new TimeInterval(8, 100)), onNext(830, new TimeInterval(9, 10)), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", 20)), onNext(217, new TimeInterval("bat", 1)), onNext(290, new TimeInterval("wag", 200)), onNext(300, new TimeInterval("pig", 10)), onNext(305, new TimeInterval("cup", 50)), onNext(600, new TimeInterval("yak", 90)), onNext(702, new TimeInterval("tin", 20)), onNext(712, new TimeInterval("man", 10)), onNext(722, new TimeInterval("rat", 200)), onNext(732, new TimeInterval("wig", 5)), onCompleted(800));
        results = scheduler.startWithCreate(function () {
            return xs.join(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler).where(function () {
                    return false;
                });
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler).where(function () {
                    return false;
                });
            }, function (x, y) {
                return x.value + y.value;
            });
        });
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"), onNext(720, "8tin"), onNext(720, "8man"), onNext(722, "7rat"), onNext(722, "6rat"), onNext(722, "8rat"), onNext(732, "7wig"), onNext(732, "8wig"), onNext(830, "9rat"), onCompleted(900));
    });

    test('JoinOp_Normal_IV', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, 10)), onNext(219, new TimeInterval(1, 5)), onNext(240, new TimeInterval(2, 10)), onNext(300, new TimeInterval(3, 100)), onNext(310, new TimeInterval(4, 80)), onNext(500, new TimeInterval(5, 90)), onNext(700, new TimeInterval(6, 25)), onNext(710, new TimeInterval(7, 200)), onNext(720, new TimeInterval(8, 100)), onCompleted(990));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", 20)), onNext(217, new TimeInterval("bat", 1)), onNext(290, new TimeInterval("wag", 200)), onNext(300, new TimeInterval("pig", 10)), onNext(305, new TimeInterval("cup", 50)), onNext(600, new TimeInterval("yak", 90)), onNext(702, new TimeInterval("tin", 20)), onNext(712, new TimeInterval("man", 10)), onNext(722, new TimeInterval("rat", 200)), onNext(732, new TimeInterval("wig", 5)), onCompleted(980));
        results = scheduler.startWithCreate(function () {
            return xs.join(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, y) {
                return x.value + y.value;
            });
        });
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"), onNext(720, "8tin"), onNext(720, "8man"), onNext(722, "7rat"), onNext(722, "6rat"), onNext(722, "8rat"), onNext(732, "7wig"), onNext(732, "8wig"), onCompleted(980));
    });

    test('JoinOp_Normal_V', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, 10)), onNext(219, new TimeInterval(1, 5)), onNext(240, new TimeInterval(2, 10)), onNext(300, new TimeInterval(3, 100)), onNext(310, new TimeInterval(4, 80)), onNext(500, new TimeInterval(5, 90)), onNext(700, new TimeInterval(6, 25)), onNext(710, new TimeInterval(7, 200)), onNext(720, new TimeInterval(8, 100)), onCompleted(990));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", 20)), onNext(217, new TimeInterval("bat", 1)), onNext(290, new TimeInterval("wag", 200)), onNext(300, new TimeInterval("pig", 10)), onNext(305, new TimeInterval("cup", 50)), onNext(600, new TimeInterval("yak", 90)), onNext(702, new TimeInterval("tin", 20)), onNext(712, new TimeInterval("man", 10)), onNext(722, new TimeInterval("rat", 200)), onNext(732, new TimeInterval("wig", 5)), onCompleted(900));
        results = scheduler.startWithCreate(function () {
            return xs.join(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, y) {
                return x.value + y.value;
            });
        });
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"), onNext(720, "8tin"), onNext(720, "8man"), onNext(722, "7rat"), onNext(722, "6rat"), onNext(722, "8rat"), onNext(732, "7wig"), onNext(732, "8wig"), onCompleted(922));
    });

    test('JoinOp_Normal_VI', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, 10)), onNext(219, new TimeInterval(1, 5)), onNext(240, new TimeInterval(2, 10)), onNext(300, new TimeInterval(3, 100)), onNext(310, new TimeInterval(4, 80)), onNext(500, new TimeInterval(5, 90)), onNext(700, new TimeInterval(6, 25)), onNext(710, new TimeInterval(7, 30)), onNext(720, new TimeInterval(8, 200)), onNext(830, new TimeInterval(9, 10)), onCompleted(850));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", 20)), onNext(217, new TimeInterval("bat", 1)), onNext(290, new TimeInterval("wag", 200)), onNext(300, new TimeInterval("pig", 10)), onNext(305, new TimeInterval("cup", 50)), onNext(600, new TimeInterval("yak", 90)), onNext(702, new TimeInterval("tin", 20)), onNext(712, new TimeInterval("man", 10)), onNext(722, new TimeInterval("rat", 20)), onNext(732, new TimeInterval("wig", 5)), onCompleted(900));
        results = scheduler.startWithCreate(function () {
            return xs.join(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, y) {
                return x.value + y.value;
            });
        });
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"), onNext(720, "8tin"), onNext(720, "8man"), onNext(722, "7rat"), onNext(722, "6rat"), onNext(722, "8rat"), onNext(732, "7wig"), onNext(732, "8wig"), onCompleted(900));
    });

    test('JoinOp_Normal_VII', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, 10)), onNext(219, new TimeInterval(1, 5)), onNext(240, new TimeInterval(2, 10)), onNext(300, new TimeInterval(3, 100)), onNext(310, new TimeInterval(4, 80)), onNext(500, new TimeInterval(5, 90)), onNext(700, new TimeInterval(6, 25)), onNext(710, new TimeInterval(7, 300)), onNext(720, new TimeInterval(8, 100)), onNext(830, new TimeInterval(9, 10)), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", 20)), onNext(217, new TimeInterval("bat", 1)), onNext(290, new TimeInterval("wag", 200)), onNext(300, new TimeInterval("pig", 10)), onNext(305, new TimeInterval("cup", 50)), onNext(600, new TimeInterval("yak", 90)), onNext(702, new TimeInterval("tin", 20)), onNext(712, new TimeInterval("man", 10)), onNext(722, new TimeInterval("rat", 200)), onNext(732, new TimeInterval("wig", 5)), onCompleted(800));
        results = scheduler.startWithDispose(function () {
            return xs.join(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, y) {
                return x.value + y.value;
            });
        }, 713);
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"));
    });
    test('JoinOp_Error_I', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, 10)), onNext(219, new TimeInterval(1, 5)), onNext(240, new TimeInterval(2, 10)), onNext(300, new TimeInterval(3, 100)), onError(310, ex));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", 20)), onNext(217, new TimeInterval("bat", 1)), onNext(290, new TimeInterval("wag", 200)), onNext(300, new TimeInterval("pig", 10)), onNext(305, new TimeInterval("cup", 50)), onNext(600, new TimeInterval("yak", 90)), onNext(702, new TimeInterval("tin", 20)), onNext(712, new TimeInterval("man", 10)), onNext(722, new TimeInterval("rat", 200)), onNext(732, new TimeInterval("wig", 5)), onCompleted(800));
        results = scheduler.startWithDispose(function () {
            return xs.join(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, y) {
                return x.value + y.value;
            });
        }, 713);
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onError(310, ex));
    });
    test('JoinOp_Error_II', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, 10)), onNext(219, new TimeInterval(1, 5)), onNext(240, new TimeInterval(2, 10)), onNext(300, new TimeInterval(3, 100)), onNext(310, new TimeInterval(4, 80)), onNext(500, new TimeInterval(5, 90)), onNext(700, new TimeInterval(6, 25)), onNext(710, new TimeInterval(7, 300)), onNext(720, new TimeInterval(8, 100)), onNext(830, new TimeInterval(9, 10)), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", 20)), onNext(217, new TimeInterval("bat", 1)), onNext(290, new TimeInterval("wag", 200)), onNext(300, new TimeInterval("pig", 10)), onNext(305, new TimeInterval("cup", 50)), onNext(600, new TimeInterval("yak", 90)), onNext(702, new TimeInterval("tin", 20)), onNext(712, new TimeInterval("man", 10)), onError(722, ex));
        results = scheduler.startWithCreate(function () {
            return xs.join(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, y) {
                return x.value + y.value;
            });
        });
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"), onNext(720, "8tin"), onNext(720, "8man"), onError(722, ex));
    });
    test('JoinOp_Error_III', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, 10)), onNext(219, new TimeInterval(1, 5)), onNext(240, new TimeInterval(2, 10)), onNext(300, new TimeInterval(3, 100)), onNext(310, new TimeInterval(4, 80)), onNext(500, new TimeInterval(5, 90)), onNext(700, new TimeInterval(6, 25)), onNext(710, new TimeInterval(7, 300)), onNext(720, new TimeInterval(8, 100)), onNext(830, new TimeInterval(9, 10)), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", 20)), onNext(217, new TimeInterval("bat", 1)), onNext(290, new TimeInterval("wag", 200)), onNext(300, new TimeInterval("pig", 10)), onNext(305, new TimeInterval("cup", 50)), onNext(600, new TimeInterval("yak", 90)), onNext(702, new TimeInterval("tin", 20)), onNext(712, new TimeInterval("man", 10)), onNext(722, new TimeInterval("rat", 200)), onNext(732, new TimeInterval("wig", 5)), onCompleted(800));
        results = scheduler.startWithCreate(function () {
            return xs.join(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler).selectMany(x.value === 6 ? Observable.throwException(ex) : Observable.empty());
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, y) {
                return x.value + y.value;
            });
        });
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"), onNext(720, "8tin"), onNext(720, "8man"), onNext(722, "7rat"), onNext(722, "6rat"), onNext(722, "8rat"), onError(725, ex));
    });
    test('JoinOp_Error_IV', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, 10)), onNext(219, new TimeInterval(1, 5)), onNext(240, new TimeInterval(2, 10)), onNext(300, new TimeInterval(3, 100)), onNext(310, new TimeInterval(4, 80)), onNext(500, new TimeInterval(5, 90)), onNext(700, new TimeInterval(6, 25)), onNext(710, new TimeInterval(7, 300)), onNext(720, new TimeInterval(8, 100)), onNext(830, new TimeInterval(9, 10)), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", 20)), onNext(217, new TimeInterval("bat", 1)), onNext(290, new TimeInterval("wag", 200)), onNext(300, new TimeInterval("pig", 10)), onNext(305, new TimeInterval("cup", 50)), onNext(600, new TimeInterval("yak", 90)), onNext(702, new TimeInterval("tin", 19)), onNext(712, new TimeInterval("man", 10)), onNext(722, new TimeInterval("rat", 200)), onNext(732, new TimeInterval("wig", 5)), onCompleted(800));
        results = scheduler.startWithCreate(function () {
            return xs.join(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler).selectMany(y.value === "tin" ? Observable.throwException(ex) : Observable.empty());
            }, function (x, y) {
                return x.value + y.value;
            });
        });
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"), onNext(720, "8tin"), onNext(720, "8man"), onError(721, ex));
    });
    test('JoinOp_Error_V', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, 10)), onNext(219, new TimeInterval(1, 5)), onNext(240, new TimeInterval(2, 10)), onNext(300, new TimeInterval(3, 100)), onNext(310, new TimeInterval(4, 80)), onNext(500, new TimeInterval(5, 90)), onNext(700, new TimeInterval(6, 25)), onNext(710, new TimeInterval(7, 300)), onNext(720, new TimeInterval(8, 100)), onNext(830, new TimeInterval(9, 10)), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", 20)), onNext(217, new TimeInterval("bat", 1)), onNext(290, new TimeInterval("wag", 200)), onNext(300, new TimeInterval("pig", 10)), onNext(305, new TimeInterval("cup", 50)), onNext(600, new TimeInterval("yak", 90)), onNext(702, new TimeInterval("tin", 20)), onNext(712, new TimeInterval("man", 10)), onNext(722, new TimeInterval("rat", 200)), onNext(732, new TimeInterval("wig", 5)), onCompleted(800));
        results = scheduler.startWithCreate(function () {
            return xs.join(ys, function (x) {
                if (x.value >= 0) {
                    throw ex;
                } else {
                    return Observable.empty();
                }
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, y) {
                return x.value + y.value;
            });
        });
        results.messages.assertEqual(onError(210, ex));
    });
    test('JoinOp_Error_VI', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, 10)), onNext(219, new TimeInterval(1, 5)), onNext(240, new TimeInterval(2, 10)), onNext(300, new TimeInterval(3, 100)), onNext(310, new TimeInterval(4, 80)), onNext(500, new TimeInterval(5, 90)), onNext(700, new TimeInterval(6, 25)), onNext(710, new TimeInterval(7, 300)), onNext(720, new TimeInterval(8, 100)), onNext(830, new TimeInterval(9, 10)), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", 20)), onNext(217, new TimeInterval("bat", 1)), onNext(290, new TimeInterval("wag", 200)), onNext(300, new TimeInterval("pig", 10)), onNext(305, new TimeInterval("cup", 50)), onNext(600, new TimeInterval("yak", 90)), onNext(702, new TimeInterval("tin", 20)), onNext(712, new TimeInterval("man", 10)), onNext(722, new TimeInterval("rat", 200)), onNext(732, new TimeInterval("wig", 5)), onCompleted(800));
        results = scheduler.startWithCreate(function () {
            return xs.join(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                if (y.value.length >= 0) {
                    throw ex;
                } else {
                    return Observable.empty();
                }
            }, function (x, y) {
                return x.value + y.value;
            });
        });
        results.messages.assertEqual(onError(215, ex));
    });
    test('JoinOp_Error_VII', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, 10)), onNext(219, new TimeInterval(1, 5)), onNext(240, new TimeInterval(2, 10)), onNext(300, new TimeInterval(3, 100)), onNext(310, new TimeInterval(4, 80)), onNext(500, new TimeInterval(5, 90)), onNext(700, new TimeInterval(6, 25)), onNext(710, new TimeInterval(7, 300)), onNext(720, new TimeInterval(8, 100)), onNext(830, new TimeInterval(9, 10)), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", 20)), onNext(217, new TimeInterval("bat", 1)), onNext(290, new TimeInterval("wag", 200)), onNext(300, new TimeInterval("pig", 10)), onNext(305, new TimeInterval("cup", 50)), onNext(600, new TimeInterval("yak", 90)), onNext(702, new TimeInterval("tin", 20)), onNext(712, new TimeInterval("man", 10)), onNext(722, new TimeInterval("rat", 200)), onNext(732, new TimeInterval("wig", 5)), onCompleted(800));
        results = scheduler.startWithCreate(function () {
            return xs.join(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, y) {
                if (x.value >= 0) {
                    throw ex;
                } else {
                    return x.value + y.value;
                }
            });
        });
        results.messages.assertEqual(onError(215, ex));
    });
    test('JoinOp_Error_VIII', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, 10)), onNext(219, new TimeInterval(1, 5)), onNext(240, new TimeInterval(2, 10)), onNext(300, new TimeInterval(3, 100)), onNext(310, new TimeInterval(4, 80)), onNext(500, new TimeInterval(5, 90)), onNext(700, new TimeInterval(6, 25)), onNext(710, new TimeInterval(7, 300)), onNext(720, new TimeInterval(8, 100)), onNext(830, new TimeInterval(9, 10)), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", 20)), onNext(217, new TimeInterval("bat", 1)), onNext(290, new TimeInterval("wag", 200)), onNext(300, new TimeInterval("pig", 10)), onNext(305, new TimeInterval("cup", 50)), onNext(600, new TimeInterval("yak", 90)), onNext(702, new TimeInterval("tin", 20)), onNext(712, new TimeInterval("man", 10)), onNext(722, new TimeInterval("rat", 200)), onNext(732, new TimeInterval("wig", 5)), onCompleted(800));
        results = scheduler.startWithCreate(function () {
            return xs.join(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, y) {
                if (x.value >= 0) {
                    throw ex;
                } else {
                    return x.value + y.value;
                }
            });
        });
        results.messages.assertEqual(onError(215, ex));
    });

    function newTimer(l, t, scheduler) {
        var timer = scheduler.createColdObservable(onNext(t, 0), onCompleted(t));
        l.push(timer);
        return timer;        
    }

    test('GroupJoinOp_Normal_I', function () {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(210, new TimeInterval(0, 10)),
            onNext(219, new TimeInterval(1, 5)),
            onNext(240, new TimeInterval(2, 10)),
            onNext(300, new TimeInterval(3, 100)),
            onNext(310, new TimeInterval(4, 80)),
            onNext(500, new TimeInterval(5, 90)),
            onNext(700, new TimeInterval(6, 25)),
            onNext(710, new TimeInterval(7, 280)),
            onNext(720, new TimeInterval(8, 100)),
            onNext(830, new TimeInterval(9, 10)),
            onCompleted(900)
        );

        var ys = scheduler.createHotObservable(
            onNext(215, new TimeInterval("hat", 20)),
            onNext(217, new TimeInterval("bat", 1)),
            onNext(290, new TimeInterval("wag", 200)),
            onNext(300, new TimeInterval("pig", 10)),
            onNext(305, new TimeInterval("cup", 50)),
            onNext(600, new TimeInterval("yak", 90)),
            onNext(702, new TimeInterval("tin", 20)),
            onNext(712, new TimeInterval("man", 10)),
            onNext(722, new TimeInterval("rat", 200)),
            onNext(732, new TimeInterval("wig", 5)),
            onCompleted(800)
        );

        var xsd = [];
        var ysd = [];

        var res = scheduler.startWithCreate(function (){
            return xs.groupJoin(
                ys, 
                function (x) { return newTimer(xsd, x.interval, scheduler); }, 
                function (y) { return newTimer(ysd, y.interval, scheduler); }, 
                function (x, yy) { return yy.select(function (y) { return x.value + y.value; })})
            .mergeObservable();
        });

        res.messages.assertEqual(
            onNext(215, "0hat"),
            onNext(217, "0bat"),
            onNext(219, "1hat"),
            onNext(300, "3wag"),
            onNext(300, "3pig"),
            onNext(305, "3cup"),
            onNext(310, "4wag"),
            onNext(310, "4pig"),
            onNext(310, "4cup"),
            onNext(702, "6tin"),
            onNext(710, "7tin"),
            onNext(712, "7man"),
            onNext(712, "6man"),
            onNext(720, "8tin"),
            onNext(720, "8man"),
            onNext(722, "7rat"),
            onNext(722, "6rat"),
            onNext(722, "8rat"),
            onNext(732, "7wig"),
            onNext(732, "8wig"),
            onNext(830, "9rat"),
            onCompleted(990)
        );

        xs.subscriptions.assertEqual(
            subscribe(200, 990)
        );

        ys.subscriptions.assertEqual(
            subscribe(200, 990)
        );                    
    });

    test('GroupJoinOp_Normal_II', function () {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(210, new TimeInterval(0, 10)),
            onNext(219, new TimeInterval(1, 5)),
            onNext(240, new TimeInterval(2, 10)),
            onNext(300, new TimeInterval(3, 100)),
            onNext(310, new TimeInterval(4, 80)),
            onNext(500, new TimeInterval(5, 90)),
            onNext(700, new TimeInterval(6, 25)),
            onNext(710, new TimeInterval(7, 200)),
            onNext(720, new TimeInterval(8, 100)),
            onCompleted(721)
        );

        var ys = scheduler.createHotObservable(
            onNext(215, new TimeInterval("hat", (20))),
            onNext(217, new TimeInterval("bat", (1))),
            onNext(290, new TimeInterval("wag", (200))),
            onNext(300, new TimeInterval("pig", (10))),
            onNext(305, new TimeInterval("cup", (50))),
            onNext(600, new TimeInterval("yak", (90))),
            onNext(702, new TimeInterval("tin", (20))),
            onNext(712, new TimeInterval("man", (10))),
            onNext(722, new TimeInterval("rat", (200))),
            onNext(732, new TimeInterval("wig", (5))),
            onCompleted(990)
        );

        var xsd = [];
        var ysd = [];

        var res = scheduler.startWithCreate(function (){
            return xs.groupJoin(
                ys, 
                function (x) { return newTimer(xsd, x.interval, scheduler); }, 
                function (y) { return newTimer(ysd, y.interval, scheduler); }, 
                function (x, yy) { return yy.select(function (y) { return x.value + y.value; })})
            .mergeObservable();
        });

        res.messages.assertEqual(
            onNext(215, "0hat"),
            onNext(217, "0bat"),
            onNext(219, "1hat"),
            onNext(300, "3wag"),
            onNext(300, "3pig"),
            onNext(305, "3cup"),
            onNext(310, "4wag"),
            onNext(310, "4pig"),
            onNext(310, "4cup"),
            onNext(702, "6tin"),
            onNext(710, "7tin"),
            onNext(712, "7man"),
            onNext(712, "6man"),
            onNext(720, "8tin"),
            onNext(720, "8man"),
            onNext(722, "7rat"),
            onNext(722, "6rat"),
            onNext(722, "8rat"),
            onNext(732, "7wig"),
            onNext(732, "8wig"),
            onCompleted(910)
        );

        xs.subscriptions.assertEqual(
            subscribe(200, 910)
        );

        ys.subscriptions.assertEqual(
            subscribe(200, 910)
        );          
    });

    test('GroupJoinOp_Normal_III', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, 10)), onNext(219, new TimeInterval(1, 5)), onNext(240, new TimeInterval(2, 10)), onNext(300, new TimeInterval(3, 100)), onNext(310, new TimeInterval(4, 80)), onNext(500, new TimeInterval(5, 90)), onNext(700, new TimeInterval(6, 25)), onNext(710, new TimeInterval(7, 280)), onNext(720, new TimeInterval(8, 100)), onNext(830, new TimeInterval(9, 10)), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", 20)), onNext(217, new TimeInterval("bat", 1)), onNext(290, new TimeInterval("wag", 200)), onNext(300, new TimeInterval("pig", 10)), onNext(305, new TimeInterval("cup", 50)), onNext(600, new TimeInterval("yak", 90)), onNext(702, new TimeInterval("tin", 20)), onNext(712, new TimeInterval("man", 10)), onNext(722, new TimeInterval("rat", 200)), onNext(732, new TimeInterval("wig", 5)), onCompleted(800));
        results = scheduler.startWithCreate(function () {
            return xs.groupJoin(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler).where(function () {
                    return false;
                });
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler).where(function () {
                    return false;
                });
            }, function (x, yy) {
                return yy.select(function (y) {
                    return x.value + y.value;
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"), onNext(720, "8tin"), onNext(720, "8man"), onNext(722, "7rat"), onNext(722, "6rat"), onNext(722, "8rat"), onNext(732, "7wig"), onNext(732, "8wig"), onNext(830, "9rat"), onCompleted(990));
    });

    test('GroupJoinOp_Normal_IV', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, TimeSpan.fromTicks(10))), onNext(219, new TimeInterval(1, TimeSpan.fromTicks(5))), onNext(240, new TimeInterval(2, TimeSpan.fromTicks(10))), onNext(300, new TimeInterval(3, TimeSpan.fromTicks(100))), onNext(310, new TimeInterval(4, TimeSpan.fromTicks(80))), onNext(500, new TimeInterval(5, TimeSpan.fromTicks(90))), onNext(700, new TimeInterval(6, TimeSpan.fromTicks(25))), onNext(710, new TimeInterval(7, TimeSpan.fromTicks(200))), onNext(720, new TimeInterval(8, TimeSpan.fromTicks(100))), onCompleted(990));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", TimeSpan.fromTicks(20))), onNext(217, new TimeInterval("bat", TimeSpan.fromTicks(1))), onNext(290, new TimeInterval("wag", TimeSpan.fromTicks(200))), onNext(300, new TimeInterval("pig", TimeSpan.fromTicks(10))), onNext(305, new TimeInterval("cup", TimeSpan.fromTicks(50))), onNext(600, new TimeInterval("yak", TimeSpan.fromTicks(90))), onNext(702, new TimeInterval("tin", TimeSpan.fromTicks(20))), onNext(712, new TimeInterval("man", TimeSpan.fromTicks(10))), onNext(722, new TimeInterval("rat", TimeSpan.fromTicks(200))), onNext(732, new TimeInterval("wig", TimeSpan.fromTicks(5))), onCompleted(980));
        results = scheduler.startWithCreate(function () {
            return xs.groupJoin(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, yy) {
                return yy.select(function (y) {
                    return x.value + y.value;
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"), onNext(720, "8tin"), onNext(720, "8man"), onNext(722, "7rat"), onNext(722, "6rat"), onNext(722, "8rat"), onNext(732, "7wig"), onNext(732, "8wig"), onCompleted(990));
    });

    test('GroupJoinOp_Normal_V', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, TimeSpan.fromTicks(10))), onNext(219, new TimeInterval(1, TimeSpan.fromTicks(5))), onNext(240, new TimeInterval(2, TimeSpan.fromTicks(10))), onNext(300, new TimeInterval(3, TimeSpan.fromTicks(100))), onNext(310, new TimeInterval(4, TimeSpan.fromTicks(80))), onNext(500, new TimeInterval(5, TimeSpan.fromTicks(90))), onNext(700, new TimeInterval(6, TimeSpan.fromTicks(25))), onNext(710, new TimeInterval(7, TimeSpan.fromTicks(200))), onNext(720, new TimeInterval(8, TimeSpan.fromTicks(100))), onCompleted(990));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", TimeSpan.fromTicks(20))), onNext(217, new TimeInterval("bat", TimeSpan.fromTicks(1))), onNext(290, new TimeInterval("wag", TimeSpan.fromTicks(200))), onNext(300, new TimeInterval("pig", TimeSpan.fromTicks(10))), onNext(305, new TimeInterval("cup", TimeSpan.fromTicks(50))), onNext(600, new TimeInterval("yak", TimeSpan.fromTicks(90))), onNext(702, new TimeInterval("tin", TimeSpan.fromTicks(20))), onNext(712, new TimeInterval("man", TimeSpan.fromTicks(10))), onNext(722, new TimeInterval("rat", TimeSpan.fromTicks(200))), onNext(732, new TimeInterval("wig", TimeSpan.fromTicks(5))), onCompleted(900));
        results = scheduler.startWithCreate(function () {
            return xs.groupJoin(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, yy) {
                return yy.select(function (y) {
                    return x.value + y.value;
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"), onNext(720, "8tin"), onNext(720, "8man"), onNext(722, "7rat"), onNext(722, "6rat"), onNext(722, "8rat"), onNext(732, "7wig"), onNext(732, "8wig"), onCompleted(990));
    });

    test('GroupJoinOp_Normal_VI', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, TimeSpan.fromTicks(10))), onNext(219, new TimeInterval(1, TimeSpan.fromTicks(5))), onNext(240, new TimeInterval(2, TimeSpan.fromTicks(10))), onNext(300, new TimeInterval(3, TimeSpan.fromTicks(100))), onNext(310, new TimeInterval(4, TimeSpan.fromTicks(80))), onNext(500, new TimeInterval(5, TimeSpan.fromTicks(90))), onNext(700, new TimeInterval(6, TimeSpan.fromTicks(25))), onNext(710, new TimeInterval(7, TimeSpan.fromTicks(30))), onNext(720, new TimeInterval(8, TimeSpan.fromTicks(200))), onNext(830, new TimeInterval(9, TimeSpan.fromTicks(10))), onCompleted(850));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", TimeSpan.fromTicks(20))), onNext(217, new TimeInterval("bat", TimeSpan.fromTicks(1))), onNext(290, new TimeInterval("wag", TimeSpan.fromTicks(200))), onNext(300, new TimeInterval("pig", TimeSpan.fromTicks(10))), onNext(305, new TimeInterval("cup", TimeSpan.fromTicks(50))), onNext(600, new TimeInterval("yak", TimeSpan.fromTicks(90))), onNext(702, new TimeInterval("tin", TimeSpan.fromTicks(20))), onNext(712, new TimeInterval("man", TimeSpan.fromTicks(10))), onNext(722, new TimeInterval("rat", TimeSpan.fromTicks(20))), onNext(732, new TimeInterval("wig", TimeSpan.fromTicks(5))), onCompleted(900));
        results = scheduler.startWithCreate(function () {
            return xs.groupJoin(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, yy) {
                return yy.select(function (y) {
                    return x.value + y.value;
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"), onNext(720, "8tin"), onNext(720, "8man"), onNext(722, "7rat"), onNext(722, "6rat"), onNext(722, "8rat"), onNext(732, "7wig"), onNext(732, "8wig"), onCompleted(920));
    });

    test('GroupJoinOp_Normal_VII', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onCompleted(210));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", TimeSpan.fromTicks(20))), onNext(217, new TimeInterval("bat", TimeSpan.fromTicks(1))), onNext(290, new TimeInterval("wag", TimeSpan.fromTicks(200))), onNext(300, new TimeInterval("pig", TimeSpan.fromTicks(10))), onNext(305, new TimeInterval("cup", TimeSpan.fromTicks(50))), onNext(600, new TimeInterval("yak", TimeSpan.fromTicks(90))), onNext(702, new TimeInterval("tin", TimeSpan.fromTicks(20))), onNext(712, new TimeInterval("man", TimeSpan.fromTicks(10))), onNext(722, new TimeInterval("rat", TimeSpan.fromTicks(20))), onNext(732, new TimeInterval("wig", TimeSpan.fromTicks(5))), onCompleted(900));
        results = scheduler.startWithCreate(function () {
            return xs.groupJoin(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, yy) {
                return yy.select(function (y) {
                    return x.value + y.value;
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onCompleted(210));
    });

    test('GroupJoinOp_Normal_VIII', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, TimeSpan.fromTicks(200))));
        ys = scheduler.createHotObservable(onNext(220, new TimeInterval("hat", TimeSpan.fromTicks(100))), onCompleted(230));
        results = scheduler.startWithCreate(function () {
            return xs.groupJoin(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, yy) {
                return yy.select(function (y) {
                    return x.value + y.value;
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(220, "0hat"));
    });

    test('GroupJoinOp_Normal_IX', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, TimeSpan.fromTicks(10))), onNext(219, new TimeInterval(1, TimeSpan.fromTicks(5))), onNext(240, new TimeInterval(2, TimeSpan.fromTicks(10))), onNext(300, new TimeInterval(3, TimeSpan.fromTicks(100))), onNext(310, new TimeInterval(4, TimeSpan.fromTicks(80))), onNext(500, new TimeInterval(5, TimeSpan.fromTicks(90))), onNext(700, new TimeInterval(6, TimeSpan.fromTicks(25))), onNext(710, new TimeInterval(7, TimeSpan.fromTicks(300))), onNext(720, new TimeInterval(8, TimeSpan.fromTicks(100))), onNext(830, new TimeInterval(9, TimeSpan.fromTicks(10))), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", TimeSpan.fromTicks(20))), onNext(217, new TimeInterval("bat", TimeSpan.fromTicks(1))), onNext(290, new TimeInterval("wag", TimeSpan.fromTicks(200))), onNext(300, new TimeInterval("pig", TimeSpan.fromTicks(10))), onNext(305, new TimeInterval("cup", TimeSpan.fromTicks(50))), onNext(600, new TimeInterval("yak", TimeSpan.fromTicks(90))), onNext(702, new TimeInterval("tin", TimeSpan.fromTicks(20))), onNext(712, new TimeInterval("man", TimeSpan.fromTicks(10))), onNext(722, new TimeInterval("rat", TimeSpan.fromTicks(200))), onNext(732, new TimeInterval("wig", TimeSpan.fromTicks(5))), onCompleted(800));
        results = scheduler.startWithDispose(function () {
            return xs.groupJoin(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, yy) {
                return yy.select(function (y) {
                    return x.value + y.value;
                });
            }).mergeObservable();
        }, 713);
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"));
    });

    test('GroupJoinOp_Error_I', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, TimeSpan.fromTicks(10))), onNext(219, new TimeInterval(1, TimeSpan.fromTicks(5))), onNext(240, new TimeInterval(2, TimeSpan.fromTicks(10))), onNext(300, new TimeInterval(3, TimeSpan.fromTicks(100))), onError(310, ex));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", TimeSpan.fromTicks(20))), onNext(217, new TimeInterval("bat", TimeSpan.fromTicks(1))), onNext(290, new TimeInterval("wag", TimeSpan.fromTicks(200))), onNext(300, new TimeInterval("pig", TimeSpan.fromTicks(10))), onNext(305, new TimeInterval("cup", TimeSpan.fromTicks(50))), onNext(600, new TimeInterval("yak", TimeSpan.fromTicks(90))), onNext(702, new TimeInterval("tin", TimeSpan.fromTicks(20))), onNext(712, new TimeInterval("man", TimeSpan.fromTicks(10))), onNext(722, new TimeInterval("rat", TimeSpan.fromTicks(200))), onNext(732, new TimeInterval("wig", TimeSpan.fromTicks(5))), onCompleted(800));
        results = scheduler.startWithCreate(function () {
            return xs.groupJoin(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, yy) {
                return yy.select(function (y) {
                    return x.value + y.value;
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onError(310, ex));
    });

    test('GroupJoinOp_Error_II', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, TimeSpan.fromTicks(10))), onNext(219, new TimeInterval(1, TimeSpan.fromTicks(5))), onNext(240, new TimeInterval(2, TimeSpan.fromTicks(10))), onNext(300, new TimeInterval(3, TimeSpan.fromTicks(100))), onNext(310, new TimeInterval(4, TimeSpan.fromTicks(80))), onNext(500, new TimeInterval(5, TimeSpan.fromTicks(90))), onNext(700, new TimeInterval(6, TimeSpan.fromTicks(25))), onNext(710, new TimeInterval(7, TimeSpan.fromTicks(300))), onNext(720, new TimeInterval(8, TimeSpan.fromTicks(100))), onNext(830, new TimeInterval(9, TimeSpan.fromTicks(10))), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", TimeSpan.fromTicks(20))), onNext(217, new TimeInterval("bat", TimeSpan.fromTicks(1))), onNext(290, new TimeInterval("wag", TimeSpan.fromTicks(200))), onNext(300, new TimeInterval("pig", TimeSpan.fromTicks(10))), onNext(305, new TimeInterval("cup", TimeSpan.fromTicks(50))), onNext(600, new TimeInterval("yak", TimeSpan.fromTicks(90))), onNext(702, new TimeInterval("tin", TimeSpan.fromTicks(20))), onNext(712, new TimeInterval("man", TimeSpan.fromTicks(10))), onError(722, ex));
        results = scheduler.startWithCreate(function () {
            return xs.groupJoin(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, yy) {
                return yy.select(function (y) {
                    return x.value + y.value;
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"), onNext(720, "8tin"), onNext(720, "8man"), onError(722, ex));
    });

    test('GroupJoinOp_Error_III', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, TimeSpan.fromTicks(10))), onNext(219, new TimeInterval(1, TimeSpan.fromTicks(5))), onNext(240, new TimeInterval(2, TimeSpan.fromTicks(10))), onNext(300, new TimeInterval(3, TimeSpan.fromTicks(100))), onNext(310, new TimeInterval(4, TimeSpan.fromTicks(80))), onNext(500, new TimeInterval(5, TimeSpan.fromTicks(90))), onNext(700, new TimeInterval(6, TimeSpan.fromTicks(25))), onNext(710, new TimeInterval(7, TimeSpan.fromTicks(300))), onNext(720, new TimeInterval(8, TimeSpan.fromTicks(100))), onNext(830, new TimeInterval(9, TimeSpan.fromTicks(10))), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", TimeSpan.fromTicks(20))), onNext(217, new TimeInterval("bat", TimeSpan.fromTicks(1))), onNext(290, new TimeInterval("wag", TimeSpan.fromTicks(200))), onNext(300, new TimeInterval("pig", TimeSpan.fromTicks(10))), onNext(305, new TimeInterval("cup", TimeSpan.fromTicks(50))), onNext(600, new TimeInterval("yak", TimeSpan.fromTicks(90))), onNext(702, new TimeInterval("tin", TimeSpan.fromTicks(20))), onNext(712, new TimeInterval("man", TimeSpan.fromTicks(10))), onNext(722, new TimeInterval("rat", TimeSpan.fromTicks(200))), onNext(732, new TimeInterval("wig", TimeSpan.fromTicks(5))), onCompleted(800));
        results = scheduler.startWithCreate(function () {
            return xs.groupJoin(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler).selectMany(x.value === 6 ? Observable.throwException(ex) : Observable.empty());
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, yy) {
                return yy.select(function (y) {
                    return x.value + y.value;
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"), onNext(720, "8tin"), onNext(720, "8man"), onNext(722, "7rat"), onNext(722, "6rat"), onNext(722, "8rat"), onError(725, ex));
    });

    test('GroupJoinOp_Error_IV', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, TimeSpan.fromTicks(10))), onNext(219, new TimeInterval(1, TimeSpan.fromTicks(5))), onNext(240, new TimeInterval(2, TimeSpan.fromTicks(10))), onNext(300, new TimeInterval(3, TimeSpan.fromTicks(100))), onNext(310, new TimeInterval(4, TimeSpan.fromTicks(80))), onNext(500, new TimeInterval(5, TimeSpan.fromTicks(90))), onNext(700, new TimeInterval(6, TimeSpan.fromTicks(25))), onNext(710, new TimeInterval(7, TimeSpan.fromTicks(300))), onNext(720, new TimeInterval(8, TimeSpan.fromTicks(100))), onNext(830, new TimeInterval(9, TimeSpan.fromTicks(10))), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", TimeSpan.fromTicks(20))), onNext(217, new TimeInterval("bat", TimeSpan.fromTicks(1))), onNext(290, new TimeInterval("wag", TimeSpan.fromTicks(200))), onNext(300, new TimeInterval("pig", TimeSpan.fromTicks(10))), onNext(305, new TimeInterval("cup", TimeSpan.fromTicks(50))), onNext(600, new TimeInterval("yak", TimeSpan.fromTicks(90))), onNext(702, new TimeInterval("tin", TimeSpan.fromTicks(19))), onNext(712, new TimeInterval("man", TimeSpan.fromTicks(10))), onNext(722, new TimeInterval("rat", TimeSpan.fromTicks(200))), onNext(732, new TimeInterval("wig", TimeSpan.fromTicks(5))), onCompleted(800));
        results = scheduler.startWithCreate(function () {
            return xs.groupJoin(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler).selectMany(y.value === "tin" ? Observable.throwException(ex) : Observable.empty());
            }, function (x, yy) {
                return yy.select(function (y) {
                    return x.value + y.value;
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(215, "0hat"), onNext(217, "0bat"), onNext(219, "1hat"), onNext(300, "3wag"), onNext(300, "3pig"), onNext(305, "3cup"), onNext(310, "4wag"), onNext(310, "4pig"), onNext(310, "4cup"), onNext(702, "6tin"), onNext(710, "7tin"), onNext(712, "7man"), onNext(712, "6man"), onNext(720, "8tin"), onNext(720, "8man"), onError(721, ex));
    });

    test('GroupJoinOp_Error_V', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, TimeSpan.fromTicks(10))), onNext(219, new TimeInterval(1, TimeSpan.fromTicks(5))), onNext(240, new TimeInterval(2, TimeSpan.fromTicks(10))), onNext(300, new TimeInterval(3, TimeSpan.fromTicks(100))), onNext(310, new TimeInterval(4, TimeSpan.fromTicks(80))), onNext(500, new TimeInterval(5, TimeSpan.fromTicks(90))), onNext(700, new TimeInterval(6, TimeSpan.fromTicks(25))), onNext(710, new TimeInterval(7, TimeSpan.fromTicks(300))), onNext(720, new TimeInterval(8, TimeSpan.fromTicks(100))), onNext(830, new TimeInterval(9, TimeSpan.fromTicks(10))), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", TimeSpan.fromTicks(20))), onNext(217, new TimeInterval("bat", TimeSpan.fromTicks(1))), onNext(290, new TimeInterval("wag", TimeSpan.fromTicks(200))), onNext(300, new TimeInterval("pig", TimeSpan.fromTicks(10))), onNext(305, new TimeInterval("cup", TimeSpan.fromTicks(50))), onNext(600, new TimeInterval("yak", TimeSpan.fromTicks(90))), onNext(702, new TimeInterval("tin", TimeSpan.fromTicks(20))), onNext(712, new TimeInterval("man", TimeSpan.fromTicks(10))), onNext(722, new TimeInterval("rat", TimeSpan.fromTicks(200))), onNext(732, new TimeInterval("wig", TimeSpan.fromTicks(5))), onCompleted(800));
        results = scheduler.startWithCreate(function () {
            return xs.groupJoin(ys, function (x) {
                if (x.value >= 0) {
                    throw ex;
                } else {
                    return Observable.empty();
                }
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, yy) {
                return yy.select(function (y) {
                    return x.value + y.value;
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onError(210, ex));
    });

    test('GroupJoinOp_Error_VI', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, TimeSpan.fromTicks(10))), onNext(219, new TimeInterval(1, TimeSpan.fromTicks(5))), onNext(240, new TimeInterval(2, TimeSpan.fromTicks(10))), onNext(300, new TimeInterval(3, TimeSpan.fromTicks(100))), onNext(310, new TimeInterval(4, TimeSpan.fromTicks(80))), onNext(500, new TimeInterval(5, TimeSpan.fromTicks(90))), onNext(700, new TimeInterval(6, TimeSpan.fromTicks(25))), onNext(710, new TimeInterval(7, TimeSpan.fromTicks(300))), onNext(720, new TimeInterval(8, TimeSpan.fromTicks(100))), onNext(830, new TimeInterval(9, TimeSpan.fromTicks(10))), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", TimeSpan.fromTicks(20))), onNext(217, new TimeInterval("bat", TimeSpan.fromTicks(1))), onNext(290, new TimeInterval("wag", TimeSpan.fromTicks(200))), onNext(300, new TimeInterval("pig", TimeSpan.fromTicks(10))), onNext(305, new TimeInterval("cup", TimeSpan.fromTicks(50))), onNext(600, new TimeInterval("yak", TimeSpan.fromTicks(90))), onNext(702, new TimeInterval("tin", TimeSpan.fromTicks(20))), onNext(712, new TimeInterval("man", TimeSpan.fromTicks(10))), onNext(722, new TimeInterval("rat", TimeSpan.fromTicks(200))), onNext(732, new TimeInterval("wig", TimeSpan.fromTicks(5))), onCompleted(800));
        results = scheduler.startWithCreate(function () {
            return xs.groupJoin(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                if (y.value.length >= 0) {
                    throw ex;
                } else {
                    return Observable.empty();
                }
            }, function (x, yy) {
                return yy.select(function (y) {
                    return x.value + y.value;
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onError(215, ex));
    });

    test('GroupJoinOp_Error_VII', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(215, new TimeInterval(0, TimeSpan.fromTicks(10))), onNext(219, new TimeInterval(1, TimeSpan.fromTicks(5))), onNext(240, new TimeInterval(2, TimeSpan.fromTicks(10))), onNext(300, new TimeInterval(3, TimeSpan.fromTicks(100))), onNext(310, new TimeInterval(4, TimeSpan.fromTicks(80))), onNext(500, new TimeInterval(5, TimeSpan.fromTicks(90))), onNext(700, new TimeInterval(6, TimeSpan.fromTicks(25))), onNext(710, new TimeInterval(7, TimeSpan.fromTicks(300))), onNext(720, new TimeInterval(8, TimeSpan.fromTicks(100))), onNext(830, new TimeInterval(9, TimeSpan.fromTicks(10))), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(210, new TimeInterval("hat", TimeSpan.fromTicks(20))), onNext(217, new TimeInterval("bat", TimeSpan.fromTicks(1))), onNext(290, new TimeInterval("wag", TimeSpan.fromTicks(200))), onNext(300, new TimeInterval("pig", TimeSpan.fromTicks(10))), onNext(305, new TimeInterval("cup", TimeSpan.fromTicks(50))), onNext(600, new TimeInterval("yak", TimeSpan.fromTicks(90))), onNext(702, new TimeInterval("tin", TimeSpan.fromTicks(20))), onNext(712, new TimeInterval("man", TimeSpan.fromTicks(10))), onNext(722, new TimeInterval("rat", TimeSpan.fromTicks(200))), onNext(732, new TimeInterval("wig", TimeSpan.fromTicks(5))), onCompleted(800));
        results = scheduler.startWithCreate(function () {
            return xs.groupJoin(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, yy) {
                if (x.value >= 0) {
                    throw ex;
                } else {
                    return yy.select(function (y) {
                        return x.value + y.value;
                    });
                }
            }).mergeObservable();
        });
        results.messages.assertEqual(onError(215, ex));
    });

    test('GroupJoinOp_Error_VIII', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, new TimeInterval(0, TimeSpan.fromTicks(10))), onNext(219, new TimeInterval(1, TimeSpan.fromTicks(5))), onNext(240, new TimeInterval(2, TimeSpan.fromTicks(10))), onNext(300, new TimeInterval(3, TimeSpan.fromTicks(100))), onNext(310, new TimeInterval(4, TimeSpan.fromTicks(80))), onNext(500, new TimeInterval(5, TimeSpan.fromTicks(90))), onNext(700, new TimeInterval(6, TimeSpan.fromTicks(25))), onNext(710, new TimeInterval(7, TimeSpan.fromTicks(300))), onNext(720, new TimeInterval(8, TimeSpan.fromTicks(100))), onNext(830, new TimeInterval(9, TimeSpan.fromTicks(10))), onCompleted(900));
        ys = scheduler.createHotObservable(onNext(215, new TimeInterval("hat", TimeSpan.fromTicks(20))), onNext(217, new TimeInterval("bat", TimeSpan.fromTicks(1))), onNext(290, new TimeInterval("wag", TimeSpan.fromTicks(200))), onNext(300, new TimeInterval("pig", TimeSpan.fromTicks(10))), onNext(305, new TimeInterval("cup", TimeSpan.fromTicks(50))), onNext(600, new TimeInterval("yak", TimeSpan.fromTicks(90))), onNext(702, new TimeInterval("tin", TimeSpan.fromTicks(20))), onNext(712, new TimeInterval("man", TimeSpan.fromTicks(10))), onNext(722, new TimeInterval("rat", TimeSpan.fromTicks(200))), onNext(732, new TimeInterval("wig", TimeSpan.fromTicks(5))), onCompleted(800));
        results = scheduler.startWithCreate(function () {
            return xs.groupJoin(ys, function (x) {
                return Observable.timer(x.interval, undefined, scheduler);
            }, function (y) {
                return Observable.timer(y.interval, undefined, scheduler);
            }, function (x, yy) {
                if (x.value >= 0) {
                    throw ex;
                } else {
                    return yy.select(function (y) {
                        return x.value + y.value;
                    });
                }
            }).mergeObservable();
        });
        results.messages.assertEqual(onError(210, ex));
    });

    test('Window_Closings_Basic', function () {
        var scheduler, results, window, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onCompleted(590));
        window = 1;
        results = scheduler.startWithCreate(function () {
            return xs.window(function () {
                return Observable.timer(window++ * 100, undefined, scheduler);
            }).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(250, "0 3"), onNext(260, "0 4"), onNext(310, "1 5"), onNext(340, "1 6"), onNext(410, "1 7"), onNext(420, "1 8"), onNext(470, "1 9"), onNext(550, "2 10"), onCompleted(590));
        xs.subscriptions.assertEqual(subscribe(200, 590));
    });

    test('Window_Closings_Dispose', function () {
        var results, scheduler, window, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onCompleted(590));
        window = 1;
        results = scheduler.startWithDispose(function () {
            return xs.window(function () {
                return Observable.timer(window++ * 100, undefined, scheduler);
            }).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                });
            }).mergeObservable();
        }, 400);
        results.messages.assertEqual(onNext(250, "0 3"), onNext(260, "0 4"), onNext(310, "1 5"), onNext(340, "1 6"));
        xs.subscriptions.assertEqual(subscribe(200, 400));
    });

    test('Window_Closings_Error', function () {
        var ex, results, scheduler, window, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onError(590, ex));
        window = 1;
        results = scheduler.startWithCreate(function () {
            return xs.window(function () {
                return Observable.timer(window++ * 100, undefined, scheduler);
            }).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(250, "0 3"), onNext(260, "0 4"), onNext(310, "1 5"), onNext(340, "1 6"), onNext(410, "1 7"), onNext(420, "1 8"), onNext(470, "1 9"), onNext(550, "2 10"), onError(590, ex));
        xs.subscriptions.assertEqual(subscribe(200, 590));
    });

    test('Window_Closings_Throw', function () {
        var ex, results, scheduler, window, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onCompleted(590));
        window = 1;
        results = scheduler.startWithCreate(function () {
            return xs.window(function () {
                throw ex;
            }).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onError(200, ex));
        xs.subscriptions.assertEqual(subscribe(200, 200));
    });

    test('Window_Closings_WindowClose_Error', function () {
        var ex, results, scheduler, window, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onCompleted(590));
        window = 1;
        results = scheduler.startWithCreate(function () {
            return xs.window(function () {
                return Observable.throwException(ex, scheduler);
            }).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onError(201, ex));
        xs.subscriptions.assertEqual(subscribe(200, 201));
    });

    test('Window_Closings_Default', function () {
        var results, scheduler, window, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onCompleted(590));
        window = 1;
        results = scheduler.startWithCreate(function () {
            return xs.window(function () {
                return Observable.timer(window++ * 100, undefined, scheduler);
            }).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(250, "0 3"), onNext(260, "0 4"), onNext(310, "1 5"), onNext(340, "1 6"), onNext(410, "1 7"), onNext(420, "1 8"), onNext(470, "1 9"), onNext(550, "2 10"), onCompleted(590));
        xs.subscriptions.assertEqual(subscribe(200, 590));
    });

    test('Window_OpeningClosings_Basic', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onCompleted(590));
        ys = scheduler.createHotObservable(onNext(255, 50), onNext(330, 100), onNext(350, 50), onNext(400, 90), onCompleted(900));
        results = scheduler.startWithCreate(function () {
            return xs.window(ys, function (x) {
                return Observable.timer(x, undefined, scheduler);
            }).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(260, "0 4"), onNext(340, "1 6"), onNext(410, "1 7"), onNext(410, "3 7"), onNext(420, "1 8"), onNext(420, "3 8"), onNext(470, "3 9"), onCompleted(900));
        xs.subscriptions.assertEqual(subscribe(200, 900));
        ys.subscriptions.assertEqual(subscribe(200, 900));
    });

    test('Window_OpeningClosings_Throw', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onCompleted(590));
        ys = scheduler.createHotObservable(onNext(255, 50), onNext(330, 100), onNext(350, 50), onNext(400, 90), onCompleted(900));
        results = scheduler.startWithCreate(function () {
            return xs.window(ys, function (x) {
                throw ex;
            }).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onError(255, ex));
        xs.subscriptions.assertEqual(subscribe(200, 255));
        ys.subscriptions.assertEqual(subscribe(200, 255));
    });

    test('Window_OpeningClosings_Dispose', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onCompleted(590));
        ys = scheduler.createHotObservable(onNext(255, 50), onNext(330, 100), onNext(350, 50), onNext(400, 90), onCompleted(900));
        results = scheduler.startWithDispose(function () {
            return xs.window(ys, function (x) {
                return Observable.timer(x, undefined, scheduler);
            }).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                });
            }).mergeObservable();
        }, 415);
        results.messages.assertEqual(onNext(260, "0 4"), onNext(340, "1 6"), onNext(410, "1 7"), onNext(410, "3 7"));
        xs.subscriptions.assertEqual(subscribe(200, 415));
        ys.subscriptions.assertEqual(subscribe(200, 415));
    });

    test('Window_OpeningClosings_Data_Error', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onError(415, ex));
        ys = scheduler.createHotObservable(onNext(255, 50), onNext(330, 100), onNext(350, 50), onNext(400, 90), onCompleted(900));
        results = scheduler.startWithCreate(function () {
            return xs.window(ys, function (x) {
                return Observable.timer(x, undefined, scheduler);
            }).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(260, "0 4"), onNext(340, "1 6"), onNext(410, "1 7"), onNext(410, "3 7"), onError(415, ex));
        xs.subscriptions.assertEqual(subscribe(200, 415));
        ys.subscriptions.assertEqual(subscribe(200, 415));
    });

    test('Window_OpeningClosings_Window_Error', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, 1), onNext(180, 2), onNext(250, 3), onNext(260, 4), onNext(310, 5), onNext(340, 6), onNext(410, 7), onNext(420, 8), onNext(470, 9), onNext(550, 10), onCompleted(590));
        ys = scheduler.createHotObservable(onNext(255, 50), onNext(330, 100), onNext(350, 50), onNext(400, 90), onError(415, ex));
        results = scheduler.startWithCreate(function () {
            return xs.window(ys, function (x) {
                return Observable.timer(x, undefined, scheduler);
            }).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(260, "0 4"), onNext(340, "1 6"), onNext(410, "1 7"), onNext(410, "3 7"), onError(415, ex));
        xs.subscriptions.assertEqual(subscribe(200, 415));
        ys.subscriptions.assertEqual(subscribe(200, 415));
    });

    test('Window_Boundaries_Simple', function () {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(90, 1),
            onNext(180, 2),
            onNext(250, 3),
            onNext(260, 4),
            onNext(310, 5),
            onNext(340, 6),
            onNext(410, 7),
            onNext(420, 8),
            onNext(470, 9),
            onNext(550, 10),
            onCompleted(590)
        );

        var ys = scheduler.createHotObservable(
            onNext(255, true),
            onNext(330, true),
            onNext(350, true),
            onNext(400, true),
            onNext(500, true),
            onCompleted(900)
        );

        var res = scheduler.startWithCreate(function () {
            return xs.window(ys).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                })
            }).mergeObservable();
        });

        res.messages.assertEqual(
            onNext(250, "0 3"),
            onNext(260, "1 4"),
            onNext(310, "1 5"),
            onNext(340, "2 6"),
            onNext(410, "4 7"),
            onNext(420, "4 8"),
            onNext(470, "4 9"),
            onNext(550, "5 10"),
            onCompleted(590)
        );

        xs.subscriptions.assertEqual(
            subscribe(200, 590)
        );

        ys.subscriptions.assertEqual(
            subscribe(200, 590)
        );
    });

    test('Window_Boundaries_onCompletedBoundaries', function () {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
                onNext(90, 1),
                onNext(180, 2),
                onNext(250, 3),
                onNext(260, 4),
                onNext(310, 5),
                onNext(340, 6),
                onNext(410, 7),
                onNext(420, 8),
                onNext(470, 9),
                onNext(550, 10),
                onCompleted(590)
        );

        var ys = scheduler.createHotObservable(
                onNext(255, true),
                onNext(330, true),
                onNext(350, true),
                onCompleted(400)
        );

        var res = scheduler.startWithCreate(function () {
            return xs.window(ys).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                })
            }).mergeObservable();
        });

        res.messages.assertEqual(
                onNext(250, "0 3"),
                onNext(260, "1 4"),
                onNext(310, "1 5"),
                onNext(340, "2 6"),
                onCompleted(400)
        );

        xs.subscriptions.assertEqual(
            subscribe(200, 400)
        );

        ys.subscriptions.assertEqual(
            subscribe(200, 400)
        );
    });

    test('Window_Boundaries_onErrorSource', function () {
        var ex = 'ex'
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
                onNext(90, 1),
                onNext(180, 2),
                onNext(250, 3),
                onNext(260, 4),
                onNext(310, 5),
                onNext(340, 6),
                onNext(380, 7),
                onError(400, ex)
        );

        var ys = scheduler.createHotObservable(
                onNext(255, true),
                onNext(330, true),
                onNext(350, true),
                onCompleted(500)
        );

        var res = scheduler.startWithCreate(function () {
            return xs.window(ys).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                })
            }).mergeObservable();
        });

        res.messages.assertEqual(
                onNext(250, "0 3"),
                onNext(260, "1 4"),
                onNext(310, "1 5"),
                onNext(340, "2 6"),
                onNext(380, "3 7"),
                onError(400, ex)
        );

        xs.subscriptions.assertEqual(
            subscribe(200, 400)
        );

        ys.subscriptions.assertEqual(
            subscribe(200, 400)
        );
    });

    test('Window_Boundaries_onErrorBoundaries', function () {
        var ex = 'ex'
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
                onNext(90, 1),
                onNext(180, 2),
                onNext(250, 3),
                onNext(260, 4),
                onNext(310, 5),
                onNext(340, 6),
                onNext(410, 7),
                onNext(420, 8),
                onNext(470, 9),
                onNext(550, 10),
                onCompleted(590)
        );

        var ys = scheduler.createHotObservable(
                onNext(255, true),
                onNext(330, true),
                onNext(350, true),
                onError(400, ex)
        );

        var res = scheduler.startWithCreate(function () {
            return xs.window(ys).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                })
            }).mergeObservable();
        });

        res.messages.assertEqual(
                onNext(250, "0 3"),
                onNext(260, "1 4"),
                onNext(310, "1 5"),
                onNext(340, "2 6"),
                onError(400, ex)
        );

        xs.subscriptions.assertEqual(
            subscribe(200, 400)
        );

        ys.subscriptions.assertEqual(
            subscribe(200, 400)
        );
    });

    function arrayEqual (arr1, arr2) {
        if (arr1.length !== arr2.length) { return false; }
        for (var i = 0, len = arr1.length; i < len; i++) {
            if (arr1[i] !== arr2[i]) { return false; }
        }
        return true;
    }

    test('Buffer_Boundaries_Simple', function () {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(90, 1),
            onNext(180, 2),
            onNext(250, 3),
            onNext(260, 4),
            onNext(310, 5),
            onNext(340, 6),
            onNext(410, 7),
            onNext(420, 8),
            onNext(470, 9),
            onNext(550, 10),
            onCompleted(590)
        );

        var ys = scheduler.createHotObservable(
            onNext(255, true),
            onNext(330, true),
            onNext(350, true),
            onNext(400, true),
            onNext(500, true),
            onCompleted(900)
        );

        var res = scheduler.startWithCreate(function () {
            return xs.buffer(ys)
        });

        res.messages.assertEqual(
            onNext(255, function (b) { return arrayEqual(b, [3]); }),
            onNext(330, function (b) { return arrayEqual(b, [4, 5]); }),
            onNext(350, function (b) { return arrayEqual(b, [6]); }),
            onNext(400, function (b) { return arrayEqual(b, [ ]); }),
            onNext(500, function (b) { return arrayEqual(b, [7, 8, 9]); }),
            onNext(590, function (b) { return arrayEqual(b, [10]); }),
            onCompleted(590)
        );

        xs.subscriptions.assertEqual(
            subscribe(200, 590)
        );

        ys.subscriptions.assertEqual(
            subscribe(200, 590)
        );
    });

    test('Buffer_Boundaries_onCompletedBoundaries', function () {
        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
            onNext(90, 1),
            onNext(180, 2),
            onNext(250, 3),
            onNext(260, 4),
            onNext(310, 5),
            onNext(340, 6),
            onNext(410, 7),
            onNext(420, 8),
            onNext(470, 9),
            onNext(550, 10),
            onCompleted(590)
        );

        var ys = scheduler.createHotObservable(
            onNext(255, true),
            onNext(330, true),
            onNext(350, true),
            onCompleted(400)
        );

        var res = scheduler.startWithCreate(function () {
            return xs.buffer(ys)
        });

        res.messages.assertEqual(
            onNext(255, function (b) { return arrayEqual(b, [3]); }),
            onNext(330, function (b) { return arrayEqual(b, [4, 5]); }),
            onNext(350, function (b) { return arrayEqual(b, [6]); }),
            onNext(400, function (b) { return arrayEqual(b, []); }),
            onCompleted(400)
        );

        xs.subscriptions.assertEqual(
            subscribe(200, 400)
        );

        ys.subscriptions.assertEqual(
            subscribe(200, 400)
        );
    });

    test('Buffer_Boundaries_onErrorSource', function () {
        var ex = 'ex';

        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
                onNext(90, 1),
                onNext(180, 2),
                onNext(250, 3),
                onNext(260, 4),
                onNext(310, 5),
                onNext(340, 6),
                onNext(380, 7),
                onError(400, ex)
        );

        var ys = scheduler.createHotObservable(
                onNext(255, true),
                onNext(330, true),
                onNext(350, true),
                onCompleted(500)
        );

        var res = scheduler.startWithCreate(function () {
            return xs.buffer(ys)
        });

        res.messages.assertEqual(
            onNext(255, function (b) { return arrayEqual(b, [3]); }),
            onNext(330, function (b) { return arrayEqual(b, [4, 5]); }),
            onNext(350, function (b) { return arrayEqual(b, [6]); }),
            onError(400, ex)
        );

        xs.subscriptions.assertEqual(
            subscribe(200, 400)
        );

        ys.subscriptions.assertEqual(
            subscribe(200, 400)
        );
    });

    test('Buffer_Boundaries_onErrorBoundaries', function () {
        var ex = 'ex';

        var scheduler = new TestScheduler();

        var xs = scheduler.createHotObservable(
                onNext(90, 1),
                onNext(180, 2),
                onNext(250, 3),
                onNext(260, 4),
                onNext(310, 5),
                onNext(340, 6),
                onNext(410, 7),
                onNext(420, 8),
                onNext(470, 9),
                onNext(550, 10),
                onCompleted(590)
        );

        var ys = scheduler.createHotObservable(
                onNext(255, true),
                onNext(330, true),
                onNext(350, true),
                onError(400, ex)
        );

        var res = scheduler.startWithCreate(function () {
            return xs.buffer(ys)
        });

        res.messages.assertEqual(
            onNext(255, function (b) { return arrayEqual(b, [3]); }),
            onNext(330, function (b) { return arrayEqual(b, [4, 5]); }),
            onNext(350, function (b) { return arrayEqual(b, [6]); }),
            onError(400, ex)
        );

        xs.subscriptions.assertEqual(
            subscribe(200, 400)
        );

        ys.subscriptions.assertEqual(
            subscribe(200, 400)
        );
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    
}(typeof global == 'object' && global || this));