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

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    
}(typeof global == 'object' && global || this));