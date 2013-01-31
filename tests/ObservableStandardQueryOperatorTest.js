/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

(function(window) {

    // Check if browser vs node
    var root = window.Rx;

    QUnit.module('ObservableStandardQueryOperatorTest');

    var Observable = root.Observable,
        TestScheduler = root.TestScheduler,
        SerialDisposable = root.SerialDisposable,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe,
        created = root.ReactiveTest.created,
        subscribed = root.ReactiveTest.subscribed,
        disposed = root.ReactiveTest.disposed;

    test('Select_Throws', function () {
        raises(function () {
            return Observable.returnValue(1).select(function (x) {
                return x;
            }).subscribe(function (x) {
                throw 'ex';
            });
        });
        raises(function () {
            return Observable.throwException('ex').select(function (x) {
                return x;
            }).subscribe(function (x) { }, function (ex) {
                throw 'ex';
            });
        });
        raises(function () {
            return Observable.empty().select(function (x) {
                return x;
            }).subscribe(function (x) { }, function (ex) { }, function () {
                throw 'ex';
            });
        });
        return raises(function () {
            return Observable.create(function (o) {
                throw 'ex';
            }).select(function (x) {
                return x;
            }).subscribe();
        });

    });

    test('Select_DisposeInsideSelector', function () {
        var d, invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(100, 1), onNext(200, 2), onNext(500, 3), onNext(600, 4));
        invoked = 0;
        results = scheduler.createObserver();
        d = new SerialDisposable();
        d.disposable(xs.select(function (x) {
            invoked++;
            if (scheduler.clock > 400) {
                d.dispose();
            }
            return x;
        }).subscribe(results));
        scheduler.scheduleAbsolute(disposed, function () {
            return d.dispose();
        });
        scheduler.start();
        results.messages.assertEqual(onNext(100, 1), onNext(200, 2));
        xs.subscriptions.assertEqual(subscribe(0, 500));
        equal(3, invoked);
    });

    test('Select_Completed', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(240, 3), onNext(290, 4), onNext(350, 5), onCompleted(400), onNext(410, -1), onCompleted(420), onError(430, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.select(function (x) {
                invoked++;
                return x + 1;
            });
        });
        results.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(290, 5), onNext(350, 6), onCompleted(400));
        xs.subscriptions.assertEqual(subscribe(200, 400));
        equal(4, invoked);
    });

    test('Select_Completed_Two', function () {
        for (var i = 0; i < 100; i++) {
            var invoked, results, scheduler, xs;
            scheduler = new TestScheduler();
            invoked = 0;
            xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(240, 3), onNext(290, 4), onNext(350, 5), onCompleted(400), onNext(410, -1), onCompleted(420), onError(430, 'ex'));
            results = scheduler.startWithCreate(function () {
                return xs.select(function (x) {
                    invoked++;
                    return x + 1;
                });
            });
            results.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(290, 5), onNext(350, 6), onCompleted(400));
            xs.subscriptions.assertEqual(subscribe(200, 400));
            equal(4, invoked);
        }


    });

    test('Select_NotCompleted', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(240, 3), onNext(290, 4), onNext(350, 5));
        results = scheduler.startWithCreate(function () {
            return xs.select(function (x) {
                invoked++;
                return x + 1;
            });
        });
        results.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(290, 5), onNext(350, 6));
        xs.subscriptions.assertEqual(subscribe(200, 1000));
        equal(4, invoked);
    });

    test('Select_Error', function () {
        var ex, invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        ex = 'ex';
        invoked = 0;
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(240, 3), onNext(290, 4), onNext(350, 5), onError(400, ex), onNext(410, -1), onCompleted(420), onError(430, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.select(function (x) {
                invoked++;
                return x + 1;
            });
        });
        results.messages.assertEqual(onNext(210, 3), onNext(240, 4), onNext(290, 5), onNext(350, 6), onError(400, ex));
        xs.subscriptions.assertEqual(subscribe(200, 400));
        equal(4, invoked);
    });

    test('Select_SelectorThrows', function () {
        var ex, invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        ex = 'ex';
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(240, 3), onNext(290, 4), onNext(350, 5), onCompleted(400), onNext(410, -1), onCompleted(420), onError(430, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.select(function (x) {
                invoked++;
                if (invoked === 3) {
                    throw ex;
                }
                return x + 1;
            });
        });
        results.messages.assertEqual(onNext(210, 3), onNext(240, 4), onError(290, ex));
        xs.subscriptions.assertEqual(subscribe(200, 290));
        equal(3, invoked);
    });

    test('SelectWithIndex_Throws', function () {
        raises(function () {
            return Observable.returnValue(1).select(function (x, index) {
                return x;
            }).subscribe(function (x) {
                throw 'ex';
            });
        });
        raises(function () {
            return Observable.throwException('ex').select(function (x, index) {
                return x;
            }).subscribe(function (x) { }, function (ex) {
                throw 'ex';
            });
        });
        raises(function () {
            return Observable.empty().select(function (x, index) {
                return x;
            }).subscribe(function (x) { }, function (ex) { }, function () {
                throw 'ex';
            });
        });
        return raises(function () {
            return Observable.create(function (o) {
                throw 'ex';
            }).select(function (x, index) {
                return x;
            }).subscribe();
        });

    });

    test('SelectWithIndex_DisposeInsideSelector', function () {
        var d, invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(100, 4), onNext(200, 3), onNext(500, 2), onNext(600, 1));
        invoked = 0;
        results = scheduler.createObserver();
        d = new SerialDisposable();
        d.disposable(xs.select(function (x, index) {
            invoked++;
            if (scheduler.clock > 400) {
                d.dispose();
            }
            return x + index * 10;
        }).subscribe(results));
        scheduler.scheduleAbsolute(disposed, function () {
            return d.dispose();
        });
        scheduler.start();
        results.messages.assertEqual(onNext(100, 4), onNext(200, 13));
        xs.subscriptions.assertEqual(subscribe(0, 500));
        equal(3, invoked);
    });

    test('SelectWithIndex_Completed', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        xs = scheduler.createHotObservable(onNext(180, 5), onNext(210, 4), onNext(240, 3), onNext(290, 2), onNext(350, 1), onCompleted(400), onNext(410, -1), onCompleted(420), onError(430, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.select(function (x, index) {
                invoked++;
                return (x + 1) + (index * 10);
            });
        });
        results.messages.assertEqual(onNext(210, 5), onNext(240, 14), onNext(290, 23), onNext(350, 32), onCompleted(400));
        xs.subscriptions.assertEqual(subscribe(200, 400));
        equal(4, invoked);
    });

    test('SelectWithIndex_NotCompleted', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        xs = scheduler.createHotObservable(onNext(180, 5), onNext(210, 4), onNext(240, 3), onNext(290, 2), onNext(350, 1));
        results = scheduler.startWithCreate(function () {
            return xs.select(function (x, index) {
                invoked++;
                return (x + 1) + (index * 10);
            });
        });
        results.messages.assertEqual(onNext(210, 5), onNext(240, 14), onNext(290, 23), onNext(350, 32));
        xs.subscriptions.assertEqual(subscribe(200, 1000));
        equal(4, invoked);
    });

    test('SelectWithIndex_Error', function () {
        var ex, invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        ex = 'ex';
        invoked = 0;
        xs = scheduler.createHotObservable(onNext(180, 5), onNext(210, 4), onNext(240, 3), onNext(290, 2), onNext(350, 1), onError(400, ex), onNext(410, -1), onCompleted(420), onError(430, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.select(function (x, index) {
                invoked++;
                return (x + 1) + (index * 10);
            });
        });
        results.messages.assertEqual(onNext(210, 5), onNext(240, 14), onNext(290, 23), onNext(350, 32), onError(400, ex));
        xs.subscriptions.assertEqual(subscribe(200, 400));
        equal(4, invoked);
    });

    test('Select_SelectorThrows', function () {
        var ex, invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        ex = 'ex';
        xs = scheduler.createHotObservable(onNext(180, 5), onNext(210, 4), onNext(240, 3), onNext(290, 2), onNext(350, 1), onCompleted(400), onNext(410, -1), onCompleted(420), onError(430, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.select(function (x, index) {
                invoked++;
                if (invoked === 3) {
                    throw ex;
                }
                return (x + 1) + (index * 10);
            });
        });
        results.messages.assertEqual(onNext(210, 5), onNext(240, 14), onError(290, ex));
        xs.subscriptions.assertEqual(subscribe(200, 290));
        equal(3, invoked);
    });

    function isPrime(i) {
        var max, j;
        if (i <= 1) {
            return false;
        }
        max = Math.floor(Math.sqrt(i))
        for (j = 2; j <= max; ++j) {
            if (i % j === 0) {
                return false;
            }
        }

        return true;
    }

    test('Where_Complete', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(180, 2), onNext(230, 3), onNext(270, 4), onNext(340, 5), onNext(380, 6), onNext(390, 7), onNext(450, 8), onNext(470, 9), onNext(560, 10), onNext(580, 11), onCompleted(600), onNext(610, 12), onError(620, 'ex'), onCompleted(630));
        results = scheduler.startWithCreate(function () {
            return xs.where(function (x) {
                invoked++;
                return isPrime(x);
            });
        });
        results.messages.assertEqual(onNext(230, 3), onNext(340, 5), onNext(390, 7), onNext(580, 11), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
        equal(9, invoked);
    });

    test('Where_True', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(180, 2), onNext(230, 3), onNext(270, 4), onNext(340, 5), onNext(380, 6), onNext(390, 7), onNext(450, 8), onNext(470, 9), onNext(560, 10), onNext(580, 11), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.where(function (x) {
                invoked++;
                return true;
            });
        });
        results.messages.assertEqual(onNext(230, 3), onNext(270, 4), onNext(340, 5), onNext(380, 6), onNext(390, 7), onNext(450, 8), onNext(470, 9), onNext(560, 10), onNext(580, 11), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
        equal(9, invoked);
    });

    test('Where_False', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(180, 2), onNext(230, 3), onNext(270, 4), onNext(340, 5), onNext(380, 6), onNext(390, 7), onNext(450, 8), onNext(470, 9), onNext(560, 10), onNext(580, 11), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.where(function (x) {
                invoked++;
                return false;
            });
        });
        results.messages.assertEqual(onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
        equal(9, invoked);
    });

    test('Where_Dispose', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(180, 2), onNext(230, 3), onNext(270, 4), onNext(340, 5), onNext(380, 6), onNext(390, 7), onNext(450, 8), onNext(470, 9), onNext(560, 10), onNext(580, 11), onCompleted(600));
        results = scheduler.startWithDispose(function () {
            return xs.where(function (x) {
                invoked++;
                return isPrime(x);
            });
        }, 400);
        results.messages.assertEqual(onNext(230, 3), onNext(340, 5), onNext(390, 7));
        xs.subscriptions.assertEqual(subscribe(200, 400));
        equal(5, invoked);
    });

    test('Where_Error', function () {
        var ex, invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        ex = 'ex';
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(180, 2), onNext(230, 3), onNext(270, 4), onNext(340, 5), onNext(380, 6), onNext(390, 7), onNext(450, 8), onNext(470, 9), onNext(560, 10), onNext(580, 11), onError(600, ex), onNext(610, 12), onError(620, 'ex'), onCompleted(630));
        results = scheduler.startWithCreate(function () {
            return xs.where(function (x) {
                invoked++;
                return isPrime(x);
            });
        });
        results.messages.assertEqual(onNext(230, 3), onNext(340, 5), onNext(390, 7), onNext(580, 11), onError(600, ex));
        xs.subscriptions.assertEqual(subscribe(200, 600));
        equal(9, invoked);
    });

    test('Where_Throw', function () {
        var ex, invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        ex = 'ex';
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(180, 2), onNext(230, 3), onNext(270, 4), onNext(340, 5), onNext(380, 6), onNext(390, 7), onNext(450, 8), onNext(470, 9), onNext(560, 10), onNext(580, 11), onCompleted(600), onNext(610, 12), onError(620, 'ex'), onCompleted(630));
        results = scheduler.startWithCreate(function () {
            return xs.where(function (x) {
                invoked++;
                if (x > 5) {
                    throw ex;
                }
                return isPrime(x);
            });
        });
        results.messages.assertEqual(onNext(230, 3), onNext(340, 5), onError(380, ex));
        xs.subscriptions.assertEqual(subscribe(200, 380));
        equal(4, invoked);
    });

    test('Where_DisposeInPredicate', function () {
        var d, invoked, results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        invoked = 0;
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(180, 2), onNext(230, 3), onNext(270, 4), onNext(340, 5), onNext(380, 6), onNext(390, 7), onNext(450, 8), onNext(470, 9), onNext(560, 10), onNext(580, 11), onCompleted(600), onNext(610, 12), onError(620, 'ex'), onCompleted(630));
        results = scheduler.createObserver();
        d = new SerialDisposable();
        scheduler.scheduleAbsolute(created, function () {
            return ys = xs.where(function (x) {
                invoked++;
                if (x === 8) {
                    d.dispose();
                }
                return isPrime(x);
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            d.disposable(ys.subscribe(results));
        });
        scheduler.scheduleAbsolute(disposed, function () {
            d.dispose();
        });
        scheduler.start();
        results.messages.assertEqual(onNext(230, 3), onNext(340, 5), onNext(390, 7));
        xs.subscriptions.assertEqual(subscribe(200, 450));
        equal(6, invoked);
    });

    test('WhereIndex_Complete', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(180, 2), onNext(230, 3), onNext(270, 4), onNext(340, 5), onNext(380, 6), onNext(390, 7), onNext(450, 8), onNext(470, 9), onNext(560, 10), onNext(580, 11), onCompleted(600), onNext(610, 12), onError(620, 'ex'), onCompleted(630));
        results = scheduler.startWithCreate(function () {
            return xs.where(function (x, index) {
                invoked++;
                return isPrime(x + index * 10);
            });
        });
        results.messages.assertEqual(onNext(230, 3), onNext(390, 7), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
        equal(9, invoked);
    });

    test('WhereIndex_True', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(180, 2), onNext(230, 3), onNext(270, 4), onNext(340, 5), onNext(380, 6), onNext(390, 7), onNext(450, 8), onNext(470, 9), onNext(560, 10), onNext(580, 11), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.where(function (x, index) {
                invoked++;
                return true;
            });
        });
        results.messages.assertEqual(onNext(230, 3), onNext(270, 4), onNext(340, 5), onNext(380, 6), onNext(390, 7), onNext(450, 8), onNext(470, 9), onNext(560, 10), onNext(580, 11), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
        equal(9, invoked);
    });

    test('WhereIndex_False', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(180, 2), onNext(230, 3), onNext(270, 4), onNext(340, 5), onNext(380, 6), onNext(390, 7), onNext(450, 8), onNext(470, 9), onNext(560, 10), onNext(580, 11), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.where(function (x, index) {
                invoked++;
                return false;
            });
        });
        results.messages.assertEqual(onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
        equal(9, invoked);
    });

    test('WhereIndex_Dispose', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(180, 2), onNext(230, 3), onNext(270, 4), onNext(340, 5), onNext(380, 6), onNext(390, 7), onNext(450, 8), onNext(470, 9), onNext(560, 10), onNext(580, 11), onCompleted(600));
        results = scheduler.startWithDispose(function () {
            return xs.where(function (x, index) {
                invoked++;
                return isPrime(x + index * 10);
            });
        }, 400);
        results.messages.assertEqual(onNext(230, 3), onNext(390, 7));
        xs.subscriptions.assertEqual(subscribe(200, 400));
        equal(5, invoked);
    });

    test('WhereIndex_Error', function () {
        var ex, invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        ex = 'ex';
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(180, 2), onNext(230, 3), onNext(270, 4), onNext(340, 5), onNext(380, 6), onNext(390, 7), onNext(450, 8), onNext(470, 9), onNext(560, 10), onNext(580, 11), onError(600, ex), onNext(610, 12), onError(620, 'ex'), onCompleted(630));
        results = scheduler.startWithCreate(function () {
            return xs.where(function (x, index) {
                invoked++;
                return isPrime(x + index * 10);
            });
        });
        results.messages.assertEqual(onNext(230, 3), onNext(390, 7), onError(600, ex));
        xs.subscriptions.assertEqual(subscribe(200, 600));
        equal(9, invoked);
    });

    test('WhereIndex_Throw', function () {
        var ex, invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        ex = 'ex';
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(180, 2), onNext(230, 3), onNext(270, 4), onNext(340, 5), onNext(380, 6), onNext(390, 7), onNext(450, 8), onNext(470, 9), onNext(560, 10), onNext(580, 11), onCompleted(600), onNext(610, 12), onError(620, 'ex'), onCompleted(630));
        results = scheduler.startWithCreate(function () {
            return xs.where(function (x, index) {
                invoked++;
                if (x > 5) {
                    throw ex;
                }
                return isPrime(x + index * 10);
            });
        });
        results.messages.assertEqual(onNext(230, 3), onError(380, ex));
        xs.subscriptions.assertEqual(subscribe(200, 380));
        equal(4, invoked);
    });

    test('WhereIndex_DisposeInPredicate', function () {
        var d, invoked = 0, results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(180, 2), onNext(230, 3), onNext(270, 4), onNext(340, 5), onNext(380, 6), onNext(390, 7), onNext(450, 8), onNext(470, 9), onNext(560, 10), onNext(580, 11), onCompleted(600), onNext(610, 12), onError(620, 'ex'), onCompleted(630));
        results = scheduler.createObserver();
        d = new SerialDisposable();
        scheduler.scheduleAbsolute(created, function () {
            ys = xs.where(function (x, index) {
                invoked++;
                if (x === 8) {
                    d.dispose();
                }
                return isPrime(x + index * 10);
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            d.disposable(ys.subscribe(results));
        });
        scheduler.scheduleAbsolute(disposed, function () {
            d.dispose();
        });
        scheduler.start();
        results.messages.assertEqual(onNext(230, 3), onNext(390, 7));
        xs.subscriptions.assertEqual(subscribe(200, 450));
        equal(6, invoked);
    });

    String.prototype.reverse = function () {
        var result, i, len;
        result = '';
        len = this.length;
        for (i = len - 1; i >= 0; i--) {
            result += this.charAt(i);
        }

        return result;
    };

    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^\s+/, '').replace(/\s+$/, '');
        };
    }

    test('GroupBy_WithKeyComparer', function () {
        var keyInvoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        keyInvoked = 0;
        xs = scheduler.createHotObservable(
						    onNext(90, "error"),
						    onNext(110, "error"),
						    onNext(130, "error"),
						    onNext(220, "  foo"),
						    onNext(240, " FoO "),
						    onNext(270, "baR  "),
						    onNext(310, "foO "),
						    onNext(350, " Baz   "),
						    onNext(360, "  qux "),
						    onNext(390, "   bar"),
						    onNext(420, " BAR  "),
						    onNext(470, "FOO "),
						    onNext(480, "baz  "),
						    onNext(510, " bAZ "),
						    onNext(530, "    fOo    "),
						    onCompleted(570),
						    onNext(580, "error"),
						    onCompleted(600),
						    onError(650, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.groupBy(function (x) {
                keyInvoked++;
                return x.toLowerCase().trim();
            }, function (x) {
                return x;
            }).select(function (g) {
                return g.key;
            });
        });
        results.messages.assertEqual(onNext(220, "foo"), onNext(270, "bar"), onNext(350, "baz"), onNext(360, "qux"), onCompleted(570));
        xs.subscriptions.assertEqual(subscribe(200, 570));
        equal(12, keyInvoked);
    });

    test('GroupBy_Outer_Complete', function () {
        var eleInvoked, keyInvoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        keyInvoked = 0;
        eleInvoked = 0;
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.groupBy(function (x) {
                keyInvoked++;
                return x.toLowerCase().trim();
            }, function (x) {
                eleInvoked++;
                return x.reverse();
            }).select(function (g) {
                return g.key;
            });
        });
        results.messages.assertEqual(onNext(220, "foo"), onNext(270, "bar"), onNext(350, "baz"), onNext(360, "qux"), onCompleted(570));
        xs.subscriptions.assertEqual(subscribe(200, 570));
        equal(12, keyInvoked);
        equal(12, eleInvoked);
    });

    test('GroupBy_Outer_Error', function () {
        var eleInvoked, ex, keyInvoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        keyInvoked = 0;
        eleInvoked = 0;
        ex = 'ex';
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onError(570, ex), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.groupBy(function (x) {
                keyInvoked++;
                return x.toLowerCase().trim();
            }, function (x) {
                eleInvoked++;
                return x.reverse();
            }).select(function (g) {
                return g.key;
            });
        });
        results.messages.assertEqual(onNext(220, "foo"), onNext(270, "bar"), onNext(350, "baz"), onNext(360, "qux"), onError(570, ex));
        xs.subscriptions.assertEqual(subscribe(200, 570));
        equal(12, keyInvoked);
        equal(12, eleInvoked);
    });

    test('GroupBy_Outer_Dispose', function () {
        var eleInvoked, keyInvoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        keyInvoked = 0;
        eleInvoked = 0;
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        results = scheduler.startWithDispose(function () {
            return xs.groupBy(function (x) {
                keyInvoked++;
                return x.toLowerCase().trim();
            }, function (x) {
                eleInvoked++;
                return x.reverse();
            }).select(function (g) {
                return g.key;
            });
        }, 355);
        results.messages.assertEqual(onNext(220, "foo"), onNext(270, "bar"), onNext(350, "baz"));
        xs.subscriptions.assertEqual(subscribe(200, 355));
        equal(5, keyInvoked);
        equal(5, eleInvoked);
    });

    test('GroupBy_Outer_KeyThrow', function () {
        var eleInvoked, ex, keyInvoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        keyInvoked = 0;
        eleInvoked = 0;
        ex = 'ex';
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.groupBy(function (x) {
                keyInvoked++;
                if (keyInvoked === 10) {
                    throw ex;
                }
                return x.toLowerCase().trim();
            }, function (x) {
                eleInvoked++;
                return x.reverse();
            }).select(function (g) {
                return g.key;
            });
        });
        results.messages.assertEqual(onNext(220, "foo"), onNext(270, "bar"), onNext(350, "baz"), onNext(360, "qux"), onError(480, ex));
        xs.subscriptions.assertEqual(subscribe(200, 480));
        equal(10, keyInvoked);
        equal(9, eleInvoked);
    });

    test('GroupBy_Outer_EleThrow', function () {
        var eleInvoked, ex, keyInvoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        keyInvoked = 0;
        eleInvoked = 0;
        ex = 'ex';
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.groupBy(function (x) {
                keyInvoked++;
                return x.toLowerCase().trim();
            }, function (x) {
                eleInvoked++;
                if (eleInvoked === 10) {
                    throw ex;
                }
                return x.reverse();
            }).select(function (g) {
                return g.key;
            });
        });
        results.messages.assertEqual(onNext(220, "foo"), onNext(270, "bar"), onNext(350, "baz"), onNext(360, "qux"), onError(480, ex));
        xs.subscriptions.assertEqual(subscribe(200, 480));
        equal(10, keyInvoked);
        equal(10, eleInvoked);
    });

    var length;
    var __hasProp = Object.prototype.hasOwnProperty;
    length = function (obj) {
        var key, result, value;
        result = 0;
        for (key in obj) {
            if (!__hasProp.call(obj, key)) continue;
            value = obj[key];
            result++;
        }
        return result;
    };

    test('GroupBy_Inner_Complete', function () {
        var innerSubscriptions, inners, outer, outerSubscription, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        outerSubscription = null;
        inners = {};
        innerSubscriptions = {};
        results = {};
        scheduler.scheduleAbsolute(created, function () {
            outer = xs.groupBy(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            outerSubscription = outer.subscribe(function (group) {
                var result;
                result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                scheduler.scheduleRelative(100, function () {
                    innerSubscriptions[group.key] = group.subscribe(result);
                });
            });
        });
        scheduler.scheduleAbsolute(disposed, function () {
            outerSubscription.dispose();
            for (var i = 0; i < innerSubscriptions.length; i++) {
                innerSubscriptions[i].dispose();
            }
        });
        scheduler.start();
        equal(4, length(inners));
        results['foo'].messages.assertEqual(onNext(470, " OOF"), onNext(530, "    oOf    "), onCompleted(570));
        results['bar'].messages.assertEqual(onNext(390, "rab   "), onNext(420, "  RAB "), onCompleted(570));
        results['baz'].messages.assertEqual(onNext(480, "  zab"), onNext(510, " ZAb "), onCompleted(570));
        results['qux'].messages.assertEqual(onCompleted(570));
        xs.subscriptions.assertEqual(subscribe(200, 570));
    });

    test('GroupBy_Inner_Complete_All', function () {
        var innerSubscriptions, inners, outer, outerSubscription, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        outer = null;
        outerSubscription = null;
        inners = {};
        innerSubscriptions = {};
        results = {};
        scheduler.scheduleAbsolute(created, function () {
            outer = xs.groupBy(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            return outerSubscription = outer.subscribe(function (group) {
                var result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                innerSubscriptions[group.key] = group.subscribe(result);
            });
        });
        scheduler.scheduleAbsolute(disposed, function () {
            outerSubscription.dispose();
            for (var i = 0; i < innerSubscriptions.length; i++) {
                innerSubscriptions[i].dispose();
            }
        });
        scheduler.start();
        equal(4, length(inners));
        results['foo'].messages.assertEqual(onNext(220, "oof  "), onNext(240, " OoF "), onNext(310, " Oof"), onNext(470, " OOF"), onNext(530, "    oOf    "), onCompleted(570));
        results['bar'].messages.assertEqual(onNext(270, "  Rab"), onNext(390, "rab   "), onNext(420, "  RAB "), onCompleted(570));
        results['baz'].messages.assertEqual(onNext(350, "   zaB "), onNext(480, "  zab"), onNext(510, " ZAb "), onCompleted(570));
        results['qux'].messages.assertEqual(onNext(360, " xuq  "), onCompleted(570));
        xs.subscriptions.assertEqual(subscribe(200, 570));
    });

    test('GroupBy_Inner_Error', function () {
        var ex, innerSubscriptions, inners, outer, outerSubscription, results, scheduler, xs;
        ex = 'ex1';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onError(570, ex), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        outer = null;
        outerSubscription = null;
        inners = {};
        innerSubscriptions = {};
        results = {};
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupBy(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            return outerSubscription = outer.subscribe(function (group) {
                var result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                scheduler.scheduleRelative(100, function () {
                    innerSubscriptions[group.key] = group.subscribe(result);
                });
            }, function (e) { });
        });
        scheduler.scheduleAbsolute(disposed, function () {
            outerSubscription.dispose();
            for (var i = 0, len = innerSubscriptions.length; i < len; i++) {
                innerSubscriptions[i].dispose();
            }
        });
        scheduler.start();
        equal(4, length(inners));
        results['foo'].messages.assertEqual(onNext(470, " OOF"), onNext(530, "    oOf    "), onError(570, ex));
        results['bar'].messages.assertEqual(onNext(390, "rab   "), onNext(420, "  RAB "), onError(570, ex));
        results['baz'].messages.assertEqual(onNext(480, "  zab"), onNext(510, " ZAb "), onError(570, ex));
        results['qux'].messages.assertEqual(onError(570, ex));
        xs.subscriptions.assertEqual(subscribe(200, 570));
    });

    test('GroupBy_Inner_Dispose', function () {
        var innerSubscriptions, inners, outer, outerSubscription, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'exception'));
        outer = null;
        outerSubscription = null;
        inners = {};
        innerSubscriptions = {};
        results = {};
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupBy(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            return outerSubscription = outer.subscribe(function (group) {
                var result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                innerSubscriptions[group.key] = group.subscribe(result);
            });
        });
        scheduler.scheduleAbsolute(400, function () {
            var key, value;
            outerSubscription.dispose();
            for (key in innerSubscriptions) {
                if (!__hasProp.call(innerSubscriptions, key)) continue;
                value = innerSubscriptions[key];
                value.dispose();
            }
        });
        scheduler.start();
        equal(4, length(inners));
        results['foo'].messages.assertEqual(onNext(220, "oof  "), onNext(240, " OoF "), onNext(310, " Oof"));
        results['bar'].messages.assertEqual(onNext(270, "  Rab"), onNext(390, "rab   "));
        results['baz'].messages.assertEqual(onNext(350, "   zaB "));
        results['qux'].messages.assertEqual(onNext(360, " xuq  "));
        xs.subscriptions.assertEqual(subscribe(200, 400));
    });

    test('GroupBy_Inner_KeyThrow', function () {
        var ex, innerSubscriptions, inners, keyInvoked, outer, outerSubscription, results, scheduler, xs;
        keyInvoked = 0;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'exception'));
        outer = null;
        outerSubscription = null;
        inners = {};
        innerSubscriptions = {};
        results = {};
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupBy(function (x) {
                keyInvoked++;
                if (keyInvoked === 6) {
                    throw ex;
                }
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            return outerSubscription = outer.subscribe(function (group) {
                var result;
                result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                innerSubscriptions[group.key] = group.subscribe(result);
            }, function (e) { });
        });
        scheduler.scheduleAbsolute(disposed, function () {
            var key, value;
            outerSubscription.dispose();
            for (key in innerSubscriptions) {
                if (!__hasProp.call(innerSubscriptions, key)) continue;
                value = innerSubscriptions[key];
                value.dispose();
            }
        });
        scheduler.start();
        equal(3, length(inners));
        results['foo'].messages.assertEqual(onNext(220, "oof  "), onNext(240, " OoF "), onNext(310, " Oof"), onError(360, ex));
        results['bar'].messages.assertEqual(onNext(270, "  Rab"), onError(360, ex));
        results['baz'].messages.assertEqual(onNext(350, "   zaB "), onError(360, ex));
        xs.subscriptions.assertEqual(subscribe(200, 360));
    });

    test('GroupBy_Inner_EleThrow', function () {
        var eleInvoked, ex, innerSubscriptions, inners, outer, outerSubscription, results, scheduler, xs;
        eleInvoked = 0;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'exception'));
        outer = null;
        outerSubscription = null;
        inners = {};
        innerSubscriptions = {};
        results = {};
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupBy(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                eleInvoked++;
                if (eleInvoked === 6) {
                    throw ex;
                }
                return x.reverse();
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            return outerSubscription = outer.subscribe(function (group) {
                var result;
                result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                innerSubscriptions[group.key] = group.subscribe(result);
            }, function (e) { });
        });
        scheduler.scheduleAbsolute(disposed, function () {
            var key, value;
            outerSubscription.dispose();
            for (key in innerSubscriptions) {
                if (!__hasProp.call(innerSubscriptions, key)) continue;
                value = innerSubscriptions[key];
                value.dispose();
            }
        });
        scheduler.start();
        equal(4, length(inners));
        results['foo'].messages.assertEqual(onNext(220, "oof  "), onNext(240, " OoF "), onNext(310, " Oof"), onError(360, ex));
        results['bar'].messages.assertEqual(onNext(270, "  Rab"), onError(360, ex));
        results['baz'].messages.assertEqual(onNext(350, "   zaB "), onError(360, ex));
        results['qux'].messages.assertEqual(onError(360, ex));
        xs.subscriptions.assertEqual(subscribe(200, 360));
    });

    test('GroupBy_Outer_Independence', function () {
        var innerSubscriptions, inners, outer, outerResults, outerSubscription, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'exception'));
        outer = null;
        outerSubscription = null;
        inners = {};
        innerSubscriptions = {};
        results = {};
        outerResults = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupBy(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            return outerSubscription = outer.subscribe(function (group) {
                var result;
                outerResults.onNext(group.key);
                result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                innerSubscriptions[group.key] = group.subscribe(result);
            }, function (e) {
                outerResults.onError(e);
            }, function () {
                outerResults.onCompleted();
            });
        });
        scheduler.scheduleAbsolute(disposed, function () {
            var key, value;
            outerSubscription.dispose();
            for (key in innerSubscriptions) {
                if (!__hasProp.call(innerSubscriptions, key)) continue;
                value = innerSubscriptions[key];
                value.dispose();
            }
        });
        scheduler.scheduleAbsolute(320, function () {
            return outerSubscription.dispose();
        });
        scheduler.start();
        equal(2, length(inners));
        outerResults.messages.assertEqual(onNext(220, "foo"), onNext(270, "bar"));
        results['foo'].messages.assertEqual(onNext(220, "oof  "), onNext(240, " OoF "), onNext(310, " Oof"), onNext(470, " OOF"), onNext(530, "    oOf    "), onCompleted(570));
        results['bar'].messages.assertEqual(onNext(270, "  Rab"), onNext(390, "rab   "), onNext(420, "  RAB "), onCompleted(570));
        xs.subscriptions.assertEqual(subscribe(200, 570));
    });

    test('GroupBy_Inner_Independence', function () {
        var innerSubscriptions, inners, outer, outerResults, outerSubscription, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'exception'));
        outer = null;
        outerSubscription = null;
        inners = {};
        innerSubscriptions = {};
        results = {};
        outerResults = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupBy(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            return outerSubscription = outer.subscribe(function (group) {
                var result;
                outerResults.onNext(group.key);
                result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                innerSubscriptions[group.key] = group.subscribe(result);
            }, function (e) {
                return outerResults.onError(e);
            }, function () {
                return outerResults.onCompleted();
            });
        });
        scheduler.scheduleAbsolute(disposed, function () {
            var key, value;
            outerSubscription.dispose();
            for (key in innerSubscriptions) {
                if (!__hasProp.call(innerSubscriptions, key)) continue;
                value = innerSubscriptions[key];
                value.dispose();
            }
        });
        scheduler.scheduleAbsolute(320, function () {
            return innerSubscriptions['foo'].dispose();
        });
        scheduler.start();
        equal(4, length(inners));
        results['foo'].messages.assertEqual(onNext(220, "oof  "), onNext(240, " OoF "), onNext(310, " Oof"));
        results['bar'].messages.assertEqual(onNext(270, "  Rab"), onNext(390, "rab   "), onNext(420, "  RAB "), onCompleted(570));
        results["baz"].messages.assertEqual(onNext(350, "   zaB "), onNext(480, "  zab"), onNext(510, " ZAb "), onCompleted(570));
        results["qux"].messages.assertEqual(onNext(360, " xuq  "), onCompleted(570));
        xs.subscriptions.assertEqual(subscribe(200, 570));
    });

    test('GroupBy_Inner_Multiple_Independence', function () {
        var innerSubscriptions, inners, outer, outerResults, outerSubscription, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'exception'));
        outer = null;
        outerSubscription = null;
        inners = {};
        innerSubscriptions = {};
        results = {};
        outerResults = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupBy(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            outerSubscription = outer.subscribe(function (group) {
                var result;
                outerResults.onNext(group.key);
                result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                innerSubscriptions[group.key] = group.subscribe(result);
            }, function (e) {
                outerResults.onError(e);
            }, function () {
                outerResults.onCompleted();
            });
        });
        scheduler.scheduleAbsolute(disposed, function () {
            var key, value;
            outerSubscription.dispose();
            for (key in innerSubscriptions) {
                if (!__hasProp.call(innerSubscriptions, key)) continue;
                value = innerSubscriptions[key];
                value.dispose();
            }
        });
        scheduler.scheduleAbsolute(320, function () {
            innerSubscriptions['foo'].dispose();
        });
        scheduler.scheduleAbsolute(280, function () {
            innerSubscriptions['bar'].dispose();
        });
        scheduler.scheduleAbsolute(355, function () {
            innerSubscriptions['baz'].dispose();
        });
        scheduler.scheduleAbsolute(400, function () {
            innerSubscriptions['qux'].dispose();
        });
        scheduler.start();
        equal(4, length(inners));
        results['foo'].messages.assertEqual(onNext(220, "oof  "), onNext(240, " OoF "), onNext(310, " Oof"));
        results['bar'].messages.assertEqual(onNext(270, "  Rab"));
        results["baz"].messages.assertEqual(onNext(350, "   zaB "));
        results["qux"].messages.assertEqual(onNext(360, " xuq  "));
        xs.subscriptions.assertEqual(subscribe(200, 570));
    });

    test('GroupBy_Inner_Escape_Complete', function () {
        var inner, innerSubscription, outer, outerSubscription, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(220, "  foo"), onNext(240, " FoO "), onNext(310, "foO "), onNext(470, "FOO "), onNext(530, "    fOo    "), onCompleted(570));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            outer = xs.groupBy(function (x) {
                return x.toLowerCase().trim();
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            outerSubscription = outer.subscribe(function (group) {
                inner = group;
            });
        });
        scheduler.scheduleAbsolute(600, function () {
            return innerSubscription = inner.subscribe(results);
        });
        scheduler.scheduleAbsolute(disposed, function () {
            outerSubscription.dispose();
            innerSubscription.dispose();
        });
        scheduler.start();
        results.messages.assertEqual(onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 570));
    });

    test('GroupBy_Inner_Escape_Error', function () {
        var ex, inner, innerSubscription, outer, outerSubscription, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(220, "  foo"), onNext(240, " FoO "), onNext(310, "foO "), onNext(470, "FOO "), onNext(530, "    fOo    "), onError(570, ex));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            outer = xs.groupBy(function (x) {
                return x.toLowerCase().trim();
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            outerSubscription = outer.subscribe(function (group) {
                inner = group;
            }, function (e) { });
        });
        scheduler.scheduleAbsolute(600, function () {
            innerSubscription = inner.subscribe(results);
        });
        scheduler.scheduleAbsolute(disposed, function () {
            outerSubscription.dispose();
            innerSubscription.dispose();
        });
        scheduler.start();
        results.messages.assertEqual(onError(600, ex));
        xs.subscriptions.assertEqual(subscribe(200, 570));
    });

    test('GroupBy_Inner_Escape_Dispose', function () {
        var inner, innerSubscription, outer, outerSubscription, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(220, "  foo"), onNext(240, " FoO "), onNext(310, "foO "), onNext(470, "FOO "), onNext(530, "    fOo    "), onError(570, 'ex'));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            outer = xs.groupBy(function (x) {
                return x.toLowerCase().trim();
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            outerSubscription = outer.subscribe(function (group) {
                inner = group;
            }, function (e) { });
        });
        scheduler.scheduleAbsolute(400, function () {
            outerSubscription.dispose();
        });
        scheduler.scheduleAbsolute(600, function () {
            innerSubscription = inner.subscribe(results);
        });
        scheduler.scheduleAbsolute(disposed, function () {
            innerSubscription.dispose();
        });
        scheduler.start();
        results.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 400));
    });

    test('Take_Complete_After', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 6), onNext(150, 4), onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onCompleted(690));
        results = scheduler.startWithCreate(function () {
            return xs.take(20);
        });
        results.messages.assertEqual(onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onCompleted(690));
        xs.subscriptions.assertEqual(subscribe(200, 690));
    });

    test('Take_Complete_Same', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 6), onNext(150, 4), onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onCompleted(690));
        results = scheduler.startWithCreate(function () {
            return xs.take(17);
        });
        results.messages.assertEqual(onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onCompleted(630));
        xs.subscriptions.assertEqual(subscribe(200, 630));
    });

    test('Take_Complete_Before', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 6), onNext(150, 4), onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onCompleted(690));
        results = scheduler.startWithCreate(function () {
            return xs.take(10);
        });
        results.messages.assertEqual(onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onCompleted(415));
        xs.subscriptions.assertEqual(subscribe(200, 415));
    });

    test('Take_Error_After', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 6), onNext(150, 4), onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onError(690, ex));
        results = scheduler.startWithCreate(function () {
            return xs.take(20);
        });
        results.messages.assertEqual(onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onError(690, ex));
        xs.subscriptions.assertEqual(subscribe(200, 690));
    });

    test('Take_Error_Same', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 6), onNext(150, 4), onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onError(690, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.take(17);
        });
        results.messages.assertEqual(onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onCompleted(630));
        xs.subscriptions.assertEqual(subscribe(200, 630));
    });

    test('Take_Error_Before', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 6), onNext(150, 4), onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onError(690, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.take(3);
        });
        results.messages.assertEqual(onNext(210, 9), onNext(230, 13), onNext(270, 7), onCompleted(270));
        xs.subscriptions.assertEqual(subscribe(200, 270));
    });

    test('Take_Dispose_Before', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 6), onNext(150, 4), onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10));
        results = scheduler.startWithDispose(function () {
            return xs.take(3);
        }, 250);
        results.messages.assertEqual(onNext(210, 9), onNext(230, 13));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('Take_Dispose_After', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 6), onNext(150, 4), onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10));
        results = scheduler.startWithDispose(function () {
            return xs.take(3);
        }, 400);
        results.messages.assertEqual(onNext(210, 9), onNext(230, 13), onNext(270, 7), onCompleted(270));
        xs.subscriptions.assertEqual(subscribe(200, 270));
    });

    test('Skip_Complete_After', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 6), onNext(150, 4), onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onCompleted(690));
        results = scheduler.startWithCreate(function () {
            return xs.skip(20);
        });
        results.messages.assertEqual(onCompleted(690));
        xs.subscriptions.assertEqual(subscribe(200, 690));
    });

    test('Skip_Complete_Same', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 6), onNext(150, 4), onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onCompleted(690));
        results = scheduler.startWithCreate(function () {
            return xs.skip(17);
        });
        results.messages.assertEqual(onCompleted(690));
        xs.subscriptions.assertEqual(subscribe(200, 690));
    });

    test('Skip_Complete_Before', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 6), onNext(150, 4), onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onCompleted(690));
        results = scheduler.startWithCreate(function () {
            return xs.skip(10);
        });
        results.messages.assertEqual(onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onCompleted(690));
        xs.subscriptions.assertEqual(subscribe(200, 690));
    });

    test('Skip_Complete_Zero', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 6), onNext(150, 4), onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onCompleted(690));
        results = scheduler.startWithCreate(function () {
            return xs.skip(0);
        });
        results.messages.assertEqual(onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onCompleted(690));
        xs.subscriptions.assertEqual(subscribe(200, 690));
    });

    test('Skip_Error_After', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 6), onNext(150, 4), onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onError(690, ex));
        results = scheduler.startWithCreate(function () {
            return xs.skip(20);
        });
        results.messages.assertEqual(onError(690, ex));
        xs.subscriptions.assertEqual(subscribe(200, 690));
    });

    test('Skip_Error_Same', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 6), onNext(150, 4), onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onError(690, ex));
        results = scheduler.startWithCreate(function () {
            return xs.skip(17);
        });
        results.messages.assertEqual(onError(690, ex));
        xs.subscriptions.assertEqual(subscribe(200, 690));
    });

    test('Skip_Error_Before', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 6), onNext(150, 4), onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onError(690, ex));
        results = scheduler.startWithCreate(function () {
            return xs.skip(3);
        });
        results.messages.assertEqual(onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10), onError(690, ex));
        xs.subscriptions.assertEqual(subscribe(200, 690));
    });

    test('Skip_Dispose_Before', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 6), onNext(150, 4), onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10));
        results = scheduler.startWithDispose(function () {
            return xs.skip(3);
        }, 250);
        results.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('Skip_Dispose_After', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 6), onNext(150, 4), onNext(210, 9), onNext(230, 13), onNext(270, 7), onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11), onNext(410, 15), onNext(415, 16), onNext(460, 72), onNext(510, 76), onNext(560, 32), onNext(570, -100), onNext(580, -3), onNext(590, 5), onNext(630, 10));
        results = scheduler.startWithDispose(function () {
            return xs.skip(3);
        }, 400);
        results.messages.assertEqual(onNext(280, 1), onNext(300, -1), onNext(310, 3), onNext(340, 8), onNext(370, 11));
        xs.subscriptions.assertEqual(subscribe(200, 400));
    });

    test('TakeWhile_Complete_Before', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onCompleted(330), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        invoked = 0;
        results = scheduler.startWithCreate(function () {
            return xs.takeWhile(function (x) {
                invoked++;
                return isPrime(x);
            });
        });
        results.messages.assertEqual(onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onCompleted(330));
        xs.subscriptions.assertEqual(subscribe(200, 330));
        equal(4, invoked);
    });

    test('TakeWhile_Complete_After', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        invoked = 0;
        results = scheduler.startWithCreate(function () {
            return xs.takeWhile(function (x) {
                invoked++;
                return isPrime(x);
            });
        });
        results.messages.assertEqual(onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onCompleted(390));
        xs.subscriptions.assertEqual(subscribe(200, 390));
        equal(6, invoked);
    });

    test('TakeWhile_Error_Before', function () {
        var ex, invoked, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onError(270, ex), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23));
        invoked = 0;
        results = scheduler.startWithCreate(function () {
            return xs.takeWhile(function (x) {
                invoked++;
                return isPrime(x);
            });
        });
        results.messages.assertEqual(onNext(210, 2), onNext(260, 5), onError(270, ex));
        xs.subscriptions.assertEqual(subscribe(200, 270));
        equal(2, invoked);
    });

    test('TakeWhile_Error_After', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onError(600, 'ex'));
        invoked = 0;
        results = scheduler.startWithCreate(function () {
            return xs.takeWhile(function (x) {
                invoked++;
                return isPrime(x);
            });
        });
        results.messages.assertEqual(onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onCompleted(390));
        xs.subscriptions.assertEqual(subscribe(200, 390));
        equal(6, invoked);
    });

    test('TakeWhile_Dispose_Before', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        invoked = 0;
        results = scheduler.startWithDispose(function () {
            return xs.takeWhile(function (x) {
                invoked++;
                return isPrime(x);
            });
        }, 300);
        results.messages.assertEqual(onNext(210, 2), onNext(260, 5), onNext(290, 13));
        xs.subscriptions.assertEqual(subscribe(200, 300));
        equal(3, invoked);
    });

    test('TakeWhile_Dispose_After', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        invoked = 0;
        results = scheduler.startWithDispose(function () {
            return xs.takeWhile(function (x) {
                invoked++;
                return isPrime(x);
            });
        }, 400);
        results.messages.assertEqual(onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onCompleted(390));
        xs.subscriptions.assertEqual(subscribe(200, 390));
        equal(6, invoked);
    });

    test('TakeWhile_Zero', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(205, 100), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        invoked = 0;
        results = scheduler.startWithDispose(function () {
            return xs.takeWhile(function (x) {
                invoked++;
                return isPrime(x);
            });
        }, 300);
        results.messages.assertEqual(onCompleted(205));
        xs.subscriptions.assertEqual(subscribe(200, 205));
        equal(1, invoked);
    });

    test('TakeWhile_Throw', function () {
        var ex, invoked, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        invoked = 0;
        results = scheduler.startWithCreate(function () {
            return xs.takeWhile(function (x) {
                invoked++;
                if (invoked === 3) {
                    throw ex;
                }
                return isPrime(x);
            });
        });
        results.messages.assertEqual(onNext(210, 2), onNext(260, 5), onError(290, ex));
        xs.subscriptions.assertEqual(subscribe(200, 290));
        equal(3, invoked);
    });

    test('TakeWhile_Index', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(205, 100), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.takeWhile(function (x, i) {
                return i < 5;
            });
        });
        results.messages.assertEqual(onNext(205, 100), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onCompleted(350));
        xs.subscriptions.assertEqual(subscribe(200, 350));
    });

    test('SkipWhile_Complete_Before', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onCompleted(330), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        invoked = 0;
        results = scheduler.startWithCreate(function () {
            return xs.skipWhile(function (x) {
                invoked++;
                return isPrime(x);
            });
        });
        results.messages.assertEqual(onCompleted(330));
        xs.subscriptions.assertEqual(subscribe(200, 330));
        equal(4, invoked);
    });

    test('SkipWhile_Complete_After', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        invoked = 0;
        results = scheduler.startWithCreate(function () {
            return xs.skipWhile(function (x) {
                invoked++;
                return isPrime(x);
            });
        });
        results.messages.assertEqual(onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
        equal(6, invoked);
    });

    test('SkipWhile_Error_Before', function () {
        var ex, invoked, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onError(270, ex), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        invoked = 0;
        results = scheduler.startWithCreate(function () {
            return xs.skipWhile(function (x) {
                invoked++;
                return isPrime(x);
            });
        });
        results.messages.assertEqual(onError(270, ex));
        xs.subscriptions.assertEqual(subscribe(200, 270));
        equal(2, invoked);
    });

    test('SkipWhile_Error_After', function () {
        var ex, invoked, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onError(600, ex));
        invoked = 0;
        results = scheduler.startWithCreate(function () {
            return xs.skipWhile(function (x) {
                invoked++;
                return isPrime(x);
            });
        });
        results.messages.assertEqual(onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onError(600, ex));
        xs.subscriptions.assertEqual(subscribe(200, 600));
        equal(6, invoked);
    });

    test('SkipWhile_Dispose_Before', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        invoked = 0;
        results = scheduler.startWithDispose(function () {
            return xs.skipWhile(function (x) {
                invoked++;
                return isPrime(x);
            });
        }, 300);
        results.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 300));
        equal(3, invoked);
    });

    test('SkipWhile_Dispose_After', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        invoked = 0;
        results = scheduler.startWithDispose(function () {
            return xs.skipWhile(function (x) {
                invoked++;
                return isPrime(x);
            });
        }, 470);
        results.messages.assertEqual(onNext(390, 4), onNext(410, 17), onNext(450, 8));
        xs.subscriptions.assertEqual(subscribe(200, 470));
        equal(6, invoked);
    });

    test('SkipWhile_Zero', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(205, 100), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        invoked = 0;
        results = scheduler.startWithCreate(function () {
            return xs.skipWhile(function (x) {
                invoked++;
                return isPrime(x);
            });
        });
        results.messages.assertEqual(onNext(205, 100), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
        equal(1, invoked);
    });

    test('SkipWhile_Throw', function () {
        var ex, invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        ex = 'ex';
        invoked = 0;
        results = scheduler.startWithCreate(function () {
            return xs.skipWhile(function (x) {
                invoked++;
                if (invoked === 3) {
                    throw ex;
                }
                return isPrime(x);
            });
        });
        results.messages.assertEqual(onError(290, ex));
        xs.subscriptions.assertEqual(subscribe(200, 290));
        equal(3, invoked);
    });

    test('SkipWhile_Index', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, -1), onNext(110, -1), onNext(210, 2), onNext(260, 5), onNext(290, 13), onNext(320, 3), onNext(350, 7), onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.skipWhile(function (x, i) {
                return i < 5;
            });
        });
        results.messages.assertEqual(onNext(390, 4), onNext(410, 17), onNext(450, 8), onNext(500, 23), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });

    test('SelectMany_Then_Complete_Complete', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(100, 4), onNext(200, 2), onNext(300, 3), onNext(400, 1), onCompleted(500));
        ys = scheduler.createColdObservable(onNext(50, "foo"), onNext(100, "bar"), onNext(150, "baz"), onNext(200, "qux"), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.selectMany(ys);
        });
        results.messages.assertEqual(onNext(350, "foo"), onNext(400, "bar"), onNext(450, "baz"), onNext(450, "foo"), onNext(500, "qux"), onNext(500, "bar"), onNext(550, "baz"), onNext(550, "foo"), onNext(600, "qux"), onNext(600, "bar"), onNext(650, "baz"), onNext(650, "foo"), onNext(700, "qux"), onNext(700, "bar"), onNext(750, "baz"), onNext(800, "qux"), onCompleted(850));
        xs.subscriptions.assertEqual(subscribe(200, 700));
        ys.subscriptions.assertEqual(subscribe(300, 550), subscribe(400, 650), subscribe(500, 750), subscribe(600, 850));
    });

    test('SelectMany_Then_Complete_Complete_2', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(100, 4), onNext(200, 2), onNext(300, 3), onNext(400, 1), onCompleted(700));
        ys = scheduler.createColdObservable(onNext(50, "foo"), onNext(100, "bar"), onNext(150, "baz"), onNext(200, "qux"), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.selectMany(ys);
        });
        results.messages.assertEqual(onNext(350, "foo"), onNext(400, "bar"), onNext(450, "baz"), onNext(450, "foo"), onNext(500, "qux"), onNext(500, "bar"), onNext(550, "baz"), onNext(550, "foo"), onNext(600, "qux"), onNext(600, "bar"), onNext(650, "baz"), onNext(650, "foo"), onNext(700, "qux"), onNext(700, "bar"), onNext(750, "baz"), onNext(800, "qux"), onCompleted(900));
        xs.subscriptions.assertEqual(subscribe(200, 900));
        ys.subscriptions.assertEqual(subscribe(300, 550), subscribe(400, 650), subscribe(500, 750), subscribe(600, 850));
    });

    test('SelectMany_Then_Never_Complete', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(100, 4), onNext(200, 2), onNext(300, 3), onNext(400, 1), onNext(500, 5), onNext(700, 0));
        ys = scheduler.createColdObservable(onNext(50, "foo"), onNext(100, "bar"), onNext(150, "baz"), onNext(200, "qux"), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.selectMany(ys);
        });
        results.messages.assertEqual(onNext(350, "foo"), onNext(400, "bar"), onNext(450, "baz"), onNext(450, "foo"), onNext(500, "qux"), onNext(500, "bar"), onNext(550, "baz"), onNext(550, "foo"), onNext(600, "qux"), onNext(600, "bar"), onNext(650, "baz"), onNext(650, "foo"), onNext(700, "qux"), onNext(700, "bar"), onNext(750, "baz"), onNext(750, "foo"), onNext(800, "qux"), onNext(800, "bar"), onNext(850, "baz"), onNext(900, "qux"), onNext(950, "foo"));
        xs.subscriptions.assertEqual(subscribe(200, 1000));
        ys.subscriptions.assertEqual(subscribe(300, 550), subscribe(400, 650), subscribe(500, 750), subscribe(600, 850), subscribe(700, 950), subscribe(900, 1000));
    });

    test('SelectMany_Then_Complete_Never', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(100, 4), onNext(200, 2), onNext(300, 3), onNext(400, 1), onCompleted(500));
        ys = scheduler.createColdObservable(onNext(50, "foo"), onNext(100, "bar"), onNext(150, "baz"), onNext(200, "qux"));
        results = scheduler.startWithCreate(function () {
            return xs.selectMany(ys);
        });
        results.messages.assertEqual(onNext(350, "foo"), onNext(400, "bar"), onNext(450, "baz"), onNext(450, "foo"), onNext(500, "qux"), onNext(500, "bar"), onNext(550, "baz"), onNext(550, "foo"), onNext(600, "qux"), onNext(600, "bar"), onNext(650, "baz"), onNext(650, "foo"), onNext(700, "qux"), onNext(700, "bar"), onNext(750, "baz"), onNext(800, "qux"));
        xs.subscriptions.assertEqual(subscribe(200, 700));
        ys.subscriptions.assertEqual(subscribe(300, 1000), subscribe(400, 1000), subscribe(500, 1000), subscribe(600, 1000));
    });

    test('SelectMany_Then_Complete_Error', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(100, 4), onNext(200, 2), onNext(300, 3), onNext(400, 1), onCompleted(500));
        ys = scheduler.createColdObservable(onNext(50, "foo"), onNext(100, "bar"), onNext(150, "baz"), onNext(200, "qux"), onError(300, ex));
        results = scheduler.startWithCreate(function () {
            return xs.selectMany(ys);
        });
        results.messages.assertEqual(onNext(350, "foo"), onNext(400, "bar"), onNext(450, "baz"), onNext(450, "foo"), onNext(500, "qux"), onNext(500, "bar"), onNext(550, "baz"), onNext(550, "foo"), onError(600, ex));
        xs.subscriptions.assertEqual(subscribe(200, 600));
        ys.subscriptions.assertEqual(subscribe(300, 600), subscribe(400, 600), subscribe(500, 600), subscribe(600, 600));
    });

    test('SelectMany_Then_Error_Complete', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(100, 4), onNext(200, 2), onNext(300, 3), onNext(400, 1), onError(500, ex));
        ys = scheduler.createColdObservable(onNext(50, "foo"), onNext(100, "bar"), onNext(150, "baz"), onNext(200, "qux"), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.selectMany(ys);
        });
        results.messages.assertEqual(onNext(350, "foo"), onNext(400, "bar"), onNext(450, "baz"), onNext(450, "foo"), onNext(500, "qux"), onNext(500, "bar"), onNext(550, "baz"), onNext(550, "foo"), onNext(600, "qux"), onNext(600, "bar"), onNext(650, "baz"), onNext(650, "foo"), onError(700, ex));
        xs.subscriptions.assertEqual(subscribe(200, 700));
        ys.subscriptions.assertEqual(subscribe(300, 550), subscribe(400, 650), subscribe(500, 700), subscribe(600, 700));
    });

    test('SelectMany_Then_Error_Error', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(100, 4), onNext(200, 2), onNext(300, 3), onNext(400, 1), onError(500, ex));
        ys = scheduler.createColdObservable(onNext(50, "foo"), onNext(100, "bar"), onNext(150, "baz"), onNext(200, "qux"), onError(250, ex));
        results = scheduler.startWithCreate(function () {
            return xs.selectMany(ys);
        });
        results.messages.assertEqual(onNext(350, "foo"), onNext(400, "bar"), onNext(450, "baz"), onNext(450, "foo"), onNext(500, "qux"), onNext(500, "bar"), onError(550, ex));
        xs.subscriptions.assertEqual(subscribe(200, 550));
        ys.subscriptions.assertEqual(subscribe(300, 550), subscribe(400, 550), subscribe(500, 550));
    });

    test('SelectMany_Complete', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(5, scheduler.createColdObservable(onError(1, 'ex1'))), onNext(105, scheduler.createColdObservable(onError(1, 'ex2'))), onNext(300, scheduler.createColdObservable(onNext(10, 102), onNext(90, 103), onNext(110, 104), onNext(190, 105), onNext(440, 106), onCompleted(460))), onNext(400, scheduler.createColdObservable(onNext(180, 202), onNext(190, 203), onCompleted(205))), onNext(550, scheduler.createColdObservable(onNext(10, 301), onNext(50, 302), onNext(70, 303), onNext(260, 304), onNext(310, 305), onCompleted(410))), onNext(750, scheduler.createColdObservable(onCompleted(40))), onNext(850, scheduler.createColdObservable(onNext(80, 401), onNext(90, 402), onCompleted(100))), onCompleted(900));
        results = scheduler.startWithCreate(function () {
            return xs.selectMany(function (x) {
                return x;
            });
        });
        results.messages.assertEqual(onNext(310, 102), onNext(390, 103), onNext(410, 104), onNext(490, 105), onNext(560, 301), onNext(580, 202), onNext(590, 203), onNext(600, 302), onNext(620, 303), onNext(740, 106), onNext(810, 304), onNext(860, 305), onNext(930, 401), onNext(940, 402), onCompleted(960));
        xs.subscriptions.assertEqual(subscribe(200, 900));
        xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
        xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 605));
        xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 960));
        xs.messages[5].value.value.subscriptions.assertEqual(subscribe(750, 790));
        xs.messages[6].value.value.subscriptions.assertEqual(subscribe(850, 950));
    });

    test('SelectMany_Complete_InnerNotComplete', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(5, scheduler.createColdObservable(onError(1, 'ex1'))), onNext(105, scheduler.createColdObservable(onError(1, 'ex2'))), onNext(300, scheduler.createColdObservable(onNext(10, 102), onNext(90, 103), onNext(110, 104), onNext(190, 105), onNext(440, 106), onCompleted(460))), onNext(400, scheduler.createColdObservable(onNext(180, 202), onNext(190, 203))), onNext(550, scheduler.createColdObservable(onNext(10, 301), onNext(50, 302), onNext(70, 303), onNext(260, 304), onNext(310, 305), onCompleted(410))), onNext(750, scheduler.createColdObservable(onCompleted(40))), onNext(850, scheduler.createColdObservable(onNext(80, 401), onNext(90, 402), onCompleted(100))), onCompleted(900));
        results = scheduler.startWithCreate(function () {
            return xs.selectMany(function (x) {
                return x;
            });
        });
        results.messages.assertEqual(onNext(310, 102), onNext(390, 103), onNext(410, 104), onNext(490, 105), onNext(560, 301), onNext(580, 202), onNext(590, 203), onNext(600, 302), onNext(620, 303), onNext(740, 106), onNext(810, 304), onNext(860, 305), onNext(930, 401), onNext(940, 402));
        xs.subscriptions.assertEqual(subscribe(200, 900));
        xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
        xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 1000));
        xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 960));
        xs.messages[5].value.value.subscriptions.assertEqual(subscribe(750, 790));
        xs.messages[6].value.value.subscriptions.assertEqual(subscribe(850, 950));
    });

    test('SelectMany_Complete_OuterNotComplete', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(5, scheduler.createColdObservable(onError(1, 'ex1'))), onNext(105, scheduler.createColdObservable(onError(1, 'ex2'))), onNext(300, scheduler.createColdObservable(onNext(10, 102), onNext(90, 103), onNext(110, 104), onNext(190, 105), onNext(440, 106), onCompleted(460))), onNext(400, scheduler.createColdObservable(onNext(180, 202), onNext(190, 203), onCompleted(205))), onNext(550, scheduler.createColdObservable(onNext(10, 301), onNext(50, 302), onNext(70, 303), onNext(260, 304), onNext(310, 305), onCompleted(410))), onNext(750, scheduler.createColdObservable(onCompleted(40))), onNext(850, scheduler.createColdObservable(onNext(80, 401), onNext(90, 402), onCompleted(100))));
        results = scheduler.startWithCreate(function () {
            return xs.selectMany(function (x) {
                return x;
            });
        });
        results.messages.assertEqual(onNext(310, 102), onNext(390, 103), onNext(410, 104), onNext(490, 105), onNext(560, 301), onNext(580, 202), onNext(590, 203), onNext(600, 302), onNext(620, 303), onNext(740, 106), onNext(810, 304), onNext(860, 305), onNext(930, 401), onNext(940, 402));
        xs.subscriptions.assertEqual(subscribe(200, 1000));
        xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
        xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 605));
        xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 960));
        xs.messages[5].value.value.subscriptions.assertEqual(subscribe(750, 790));
        xs.messages[6].value.value.subscriptions.assertEqual(subscribe(850, 950));
    });

    test('SelectMany_Error_Outer', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(5, scheduler.createColdObservable(onError(1, 'ex1'))), onNext(105, scheduler.createColdObservable(onError(1, 'ex2'))), onNext(300, scheduler.createColdObservable(onNext(10, 102), onNext(90, 103), onNext(110, 104), onNext(190, 105), onNext(440, 106), onCompleted(460))), onNext(400, scheduler.createColdObservable(onNext(180, 202), onNext(190, 203), onCompleted(205))), onNext(550, scheduler.createColdObservable(onNext(10, 301), onNext(50, 302), onNext(70, 303), onNext(260, 304), onNext(310, 305), onCompleted(410))), onNext(750, scheduler.createColdObservable(onCompleted(40))), onNext(850, scheduler.createColdObservable(onNext(80, 401), onNext(90, 402), onCompleted(100))), onError(900, ex));
        results = scheduler.startWithCreate(function () {
            return xs.selectMany(function (x) {
                return x;
            });
        });
        results.messages.assertEqual(onNext(310, 102), onNext(390, 103), onNext(410, 104), onNext(490, 105), onNext(560, 301), onNext(580, 202), onNext(590, 203), onNext(600, 302), onNext(620, 303), onNext(740, 106), onNext(810, 304), onNext(860, 305), onError(900, ex));
        xs.subscriptions.assertEqual(subscribe(200, 900));
        xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
        xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 605));
        xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 900));
        xs.messages[5].value.value.subscriptions.assertEqual(subscribe(750, 790));
        xs.messages[6].value.value.subscriptions.assertEqual(subscribe(850, 900));
    });

    test('SelectMany_Error_Inner', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(5, scheduler.createColdObservable(onError(1, 'ex1'))), onNext(105, scheduler.createColdObservable(onError(1, 'ex2'))), onNext(300, scheduler.createColdObservable(onNext(10, 102), onNext(90, 103), onNext(110, 104), onNext(190, 105), onNext(440, 106), onError(460, ex))), onNext(400, scheduler.createColdObservable(onNext(180, 202), onNext(190, 203), onCompleted(205))), onNext(550, scheduler.createColdObservable(onNext(10, 301), onNext(50, 302), onNext(70, 303), onNext(260, 304), onNext(310, 305), onCompleted(410))), onNext(750, scheduler.createColdObservable(onCompleted(40))), onNext(850, scheduler.createColdObservable(onNext(80, 401), onNext(90, 402), onCompleted(100))), onCompleted(900));
        results = scheduler.startWithCreate(function () {
            return xs.selectMany(function (x) {
                return x;
            });
        });
        results.messages.assertEqual(onNext(310, 102), onNext(390, 103), onNext(410, 104), onNext(490, 105), onNext(560, 301), onNext(580, 202), onNext(590, 203), onNext(600, 302), onNext(620, 303), onNext(740, 106), onError(760, ex));
        xs.subscriptions.assertEqual(subscribe(200, 760));
        xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
        xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 605));
        xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 760));
        xs.messages[5].value.value.subscriptions.assertEqual(subscribe(750, 760));
        xs.messages[6].value.value.subscriptions.assertEqual();
    });

    test('SelectMany_Dispose', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(5, scheduler.createColdObservable(onError(1, 'ex1'))), onNext(105, scheduler.createColdObservable(onError(1, 'ex2'))), onNext(300, scheduler.createColdObservable(onNext(10, 102), onNext(90, 103), onNext(110, 104), onNext(190, 105), onNext(440, 106), onCompleted(460))), onNext(400, scheduler.createColdObservable(onNext(180, 202), onNext(190, 203), onCompleted(205))), onNext(550, scheduler.createColdObservable(onNext(10, 301), onNext(50, 302), onNext(70, 303), onNext(260, 304), onNext(310, 305), onCompleted(410))), onNext(750, scheduler.createColdObservable(onCompleted(40))), onNext(850, scheduler.createColdObservable(onNext(80, 401), onNext(90, 402), onCompleted(100))), onCompleted(900));
        results = scheduler.startWithDispose(function () {
            return xs.selectMany(function (x) {
                return x;
            });
        }, 700);
        results.messages.assertEqual(onNext(310, 102), onNext(390, 103), onNext(410, 104), onNext(490, 105), onNext(560, 301), onNext(580, 202), onNext(590, 203), onNext(600, 302), onNext(620, 303));
        xs.subscriptions.assertEqual(subscribe(200, 700));
        xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 700));
        xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 605));
        xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 700));
        xs.messages[5].value.value.subscriptions.assertEqual();
        xs.messages[6].value.value.subscriptions.assertEqual();
    });

    test('SelectMany_Throw', function () {
        var ex, invoked, results, scheduler, xs;
        invoked = 0;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(5, scheduler.createColdObservable(onError(1, 'ex1'))), onNext(105, scheduler.createColdObservable(onError(1, 'ex2'))), onNext(300, scheduler.createColdObservable(onNext(10, 102), onNext(90, 103), onNext(110, 104), onNext(190, 105), onNext(440, 106), onCompleted(460))), onNext(400, scheduler.createColdObservable(onNext(180, 202), onNext(190, 203), onCompleted(205))), onNext(550, scheduler.createColdObservable(onNext(10, 301), onNext(50, 302), onNext(70, 303), onNext(260, 304), onNext(310, 305), onCompleted(410))), onNext(750, scheduler.createColdObservable(onCompleted(40))), onNext(850, scheduler.createColdObservable(onNext(80, 401), onNext(90, 402), onCompleted(100))), onCompleted(900));
        results = scheduler.startWithCreate(function () {
            return xs.selectMany(function (x) {
                invoked++;
                if (invoked === 3) {
                    throw ex;
                }
                return x;
            });
        });
        results.messages.assertEqual(onNext(310, 102), onNext(390, 103), onNext(410, 104), onNext(490, 105), onError(550, ex));
        xs.subscriptions.assertEqual(subscribe(200, 550));
        xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 550));
        xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 550));
        xs.messages[4].value.value.subscriptions.assertEqual();
        xs.messages[5].value.value.subscriptions.assertEqual();
        xs.messages[6].value.value.subscriptions.assertEqual();
    });
    test('SelectMany_UseFunction', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 4), onNext(220, 3), onNext(250, 5), onNext(270, 1), onCompleted(290));
        results = scheduler.startWithCreate(function () {
            return xs.selectMany(function (x) {
                return Observable.interval(10, scheduler).select(function () {
                    return x;
                }).take(x);
            });
        });
        results.messages.assertEqual(onNext(220, 4), onNext(230, 3), onNext(230, 4), onNext(240, 3), onNext(240, 4), onNext(250, 3), onNext(250, 4), onNext(260, 5), onNext(270, 5), onNext(280, 1), onNext(280, 5), onNext(290, 5), onNext(300, 5), onCompleted(300));
        xs.subscriptions.assertEqual(subscribe(200, 290));
    });
    test('GroupByUntil_WithKeyComparer', function () {
        var keyInvoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        keyInvoked = 0;
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.groupByUntil(function (x) {
                keyInvoked++;
                return x.toLowerCase().trim();
            }, function (x) {
                return x;
            }, function (g) {
                return g.skip(2);
            }).select(function (x) {
                return x.key;
            });
        });
        results.messages.assertEqual(onNext(220, "foo"), onNext(270, "bar"), onNext(350, "baz"), onNext(360, "qux"), onNext(470, "foo"), onCompleted(570));
        xs.subscriptions.assertEqual(subscribe(200, 570));
        equal(12, keyInvoked);
    });
    test('GroupByUntil_Outer_Complete', function () {
        var eleInvoked, keyInvoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        keyInvoked = 0;
        eleInvoked = 0;
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.groupByUntil(function (x) {
                keyInvoked++;
                return x.toLowerCase().trim();
            }, function (x) {
                eleInvoked++;
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            }).select(function (x) {
                return x.key;
            });
        });
        results.messages.assertEqual(onNext(220, "foo"), onNext(270, "bar"), onNext(350, "baz"), onNext(360, "qux"), onNext(470, "foo"), onCompleted(570));
        xs.subscriptions.assertEqual(subscribe(200, 570));
        equal(12, keyInvoked);
        equal(12, eleInvoked);
    });
    test('GroupByUntil_Outer_Error', function () {
        var eleInvoked, ex, keyInvoked, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        keyInvoked = 0;
        eleInvoked = 0;
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onError(570, ex), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.groupByUntil(function (x) {
                keyInvoked++;
                return x.toLowerCase().trim();
            }, function (x) {
                eleInvoked++;
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            }).select(function (x) {
                return x.key;
            });
        });
        results.messages.assertEqual(onNext(220, "foo"), onNext(270, "bar"), onNext(350, "baz"), onNext(360, "qux"), onNext(470, "foo"), onError(570, ex));
        xs.subscriptions.assertEqual(subscribe(200, 570));
        equal(12, keyInvoked);
        equal(12, eleInvoked);
    });
    test('GroupByUntil_Outer_Dispose', function () {
        var eleInvoked, keyInvoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        keyInvoked = 0;
        eleInvoked = 0;
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        results = scheduler.startWithDispose(function () {
            return xs.groupByUntil(function (x) {
                keyInvoked++;
                return x.toLowerCase().trim();
            }, function (x) {
                eleInvoked++;
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            }).select(function (x) {
                return x.key;
            });
        }, 355);
        results.messages.assertEqual(onNext(220, "foo"), onNext(270, "bar"), onNext(350, "baz"));
        xs.subscriptions.assertEqual(subscribe(200, 355));
        equal(5, keyInvoked);
        equal(5, eleInvoked);
    });
    test('GroupByUntil_Outer_KeyThrow', function () {
        var eleInvoked, ex, keyInvoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        ex = 'ex';
        keyInvoked = 0;
        eleInvoked = 0;
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.groupByUntil(function (x) {
                keyInvoked++;
                if (keyInvoked === 10) {
                    throw ex;
                }
                return x.toLowerCase().trim();
            }, function (x) {
                eleInvoked++;
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            }).select(function (x) {
                return x.key;
            });
        });
        results.messages.assertEqual(onNext(220, "foo"), onNext(270, "bar"), onNext(350, "baz"), onNext(360, "qux"), onNext(470, "foo"), onError(480, ex));
        xs.subscriptions.assertEqual(subscribe(200, 480));
        equal(10, keyInvoked);
        equal(9, eleInvoked);
    });
    test('GroupByUntil_Outer_EleThrow', function () {
        var eleInvoked, ex, keyInvoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        ex = 'ex';
        keyInvoked = 0;
        eleInvoked = 0;
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.groupByUntil(function (x) {
                keyInvoked++;
                return x.toLowerCase().trim();
            }, function (x) {
                eleInvoked++;
                if (eleInvoked === 10) {
                    throw ex;
                }
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            }).select(function (x) {
                return x.key;
            });
        });
        results.messages.assertEqual(onNext(220, "foo"), onNext(270, "bar"), onNext(350, "baz"), onNext(360, "qux"), onNext(470, "foo"), onError(480, ex));
        xs.subscriptions.assertEqual(subscribe(200, 480));
        equal(10, keyInvoked);
        equal(10, eleInvoked);
    });
    test('GroupByUntil_Inner_Complete', function () {
        var innerSubscriptions, inners, outer, outerSubscription, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        inners = {};
        innerSubscriptions = {};
        results = {};
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupByUntil(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            outerSubscription = outer.subscribe(function (group) {
                var result;
                result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                scheduler.scheduleRelative(100, function () {
                    innerSubscriptions[group.key] = group.subscribe(result);
                });
            });
        });
        scheduler.scheduleAbsolute(disposed, function () {
            var key, value;
            outerSubscription.dispose();
            for (key in innerSubscriptions) {
                value = innerSubscriptions[key];
                value.dispose();
            }
        });
        scheduler.start();
        equal(4, length(inners));
        results["bar"].messages.assertEqual(onNext(390, "rab   "), onCompleted(420));
        results["baz"].messages.assertEqual(onNext(480, "  zab"), onCompleted(510));
        results["qux"].messages.assertEqual(onCompleted(570));
        results["foo"].messages.assertEqual(onCompleted(570));
        xs.subscriptions.assertEqual(subscribe(200, 570));
    });
    test('GroupByUntil_Inner_Complete_All', function () {
        var innerSubscriptions, inners, outer, outerSubscription, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        outer = null;
        outerSubscription = null;
        inners = {};
        innerSubscriptions = {};
        results = {};
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupByUntil(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            return outerSubscription = outer.subscribe(function (group) {
                var result;
                result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                innerSubscriptions[group.key] = group.subscribe(result);
            });
        });
        scheduler.scheduleAbsolute(disposed, function () {
            var key, value;
            outerSubscription.dispose();
            for (key in innerSubscriptions) {
                value = innerSubscriptions[key];
                value.dispose();
            }
        });
        scheduler.start();
        equal(4, length(inners));
        results["bar"].messages.assertEqual(onNext(270, "  Rab"), onNext(390, "rab   "), onNext(420, "  RAB "), onCompleted(420));
        results["baz"].messages.assertEqual(onNext(350, "   zaB "), onNext(480, "  zab"), onNext(510, " ZAb "), onCompleted(510));
        results["qux"].messages.assertEqual(onNext(360, " xuq  "), onCompleted(570));
        results["foo"].messages.assertEqual(onNext(470, " OOF"), onNext(530, "    oOf    "), onCompleted(570));
        xs.subscriptions.assertEqual(subscribe(200, 570));
    });
    test('GroupByUntil_Inner_Error', function () {
        var ex1, innerSubscriptions, inners, outer, outerSubscription, results, scheduler, xs;
        ex1 = 'ex1';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onError(570, ex1), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        inners = {};
        innerSubscriptions = {};
        results = {};
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupByUntil(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            return outerSubscription = outer.subscribe(function (group) {
                var result;
                result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                scheduler.scheduleRelative(100, function () {
                    innerSubscriptions[group.key] = group.subscribe(result);
                });
            }, function (e) { });
        });
        scheduler.scheduleAbsolute(disposed, function () {
            var key, value;
            outerSubscription.dispose();
            for (key in innerSubscriptions) {
                value = innerSubscriptions[key];
                value.dispose();
            }
        });
        scheduler.start();
        equal(4, length(inners));
        results["bar"].messages.assertEqual(onNext(390, "rab   "), onCompleted(420));
        results["baz"].messages.assertEqual(onNext(480, "  zab"), onCompleted(510));
        results["qux"].messages.assertEqual(onError(570, ex1));
        results["foo"].messages.assertEqual(onError(570, ex1));
        xs.subscriptions.assertEqual(subscribe(200, 570));
    });
    test('GroupByUntil_Inner_Dispose', function () {
        var innerSubscriptions, inners, outer, outerSubscription, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        outer = null;
        outerSubscription = null;
        inners = {};
        innerSubscriptions = {};
        results = {};
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupByUntil(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            return outerSubscription = outer.subscribe(function (group) {
                var result;
                result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                innerSubscriptions[group.key] = group.subscribe(result);
            });
        });
        scheduler.scheduleAbsolute(400, function () {
            var key, value;
            outerSubscription.dispose();
            for (key in innerSubscriptions) {
                value = innerSubscriptions[key];
                value.dispose();
            }
        });
        scheduler.start();
        equal(4, length(inners));
        results["bar"].messages.assertEqual(onNext(270, "  Rab"), onNext(390, "rab   "));
        results["baz"].messages.assertEqual(onNext(350, "   zaB "));
        results["qux"].messages.assertEqual(onNext(360, " xuq  "));
        results["foo"].messages.assertEqual(onNext(220, "oof  "), onNext(240, " OoF "), onNext(310, " Oof"), onCompleted(310));
        xs.subscriptions.assertEqual(subscribe(200, 400));
    });
    test('GroupByUntil_Inner_KeyThrow', function () {
        var ex, innerSubscriptions, inners, keyInvoked, outer, outerSubscription, results, scheduler, xs;
        ex = 'ex';
        keyInvoked = 0;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        outer = null;
        outerSubscription = null;
        inners = {};
        innerSubscriptions = {};
        results = {};
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupByUntil(function (x) {
                keyInvoked++;
                if (keyInvoked === 6) {
                    throw ex;
                }
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            return outerSubscription = outer.subscribe(function (group) {
                var result;
                result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                innerSubscriptions[group.key] = group.subscribe(result);
            }, function (e) { });
        });
        scheduler.scheduleAbsolute(disposed, function () {
            var key, value;
            outerSubscription.dispose();
            for (key in innerSubscriptions) {
                value = innerSubscriptions[key];
                value.dispose();
            }
        });
        scheduler.start();
        equal(3, length(inners));
        results["bar"].messages.assertEqual(onNext(270, "  Rab"), onError(360, ex));
        results["baz"].messages.assertEqual(onNext(350, "   zaB "), onError(360, ex));
        results["foo"].messages.assertEqual(onNext(220, "oof  "), onNext(240, " OoF "), onNext(310, " Oof"), onCompleted(310));
        xs.subscriptions.assertEqual(subscribe(200, 360));
    });
    test('GroupByUntil_Inner_EleThrow', function () {
        var eleInvoked, ex, innerSubscriptions, inners, outer, outerSubscription, results, scheduler, xs;
        ex = 'ex';
        eleInvoked = 0;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        outer = null;
        outerSubscription = null;
        inners = {};
        innerSubscriptions = {};
        results = {};
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupByUntil(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                eleInvoked++;
                if (eleInvoked === 6) {
                    throw ex;
                }
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            return outerSubscription = outer.subscribe(function (group) {
                var result;
                result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                innerSubscriptions[group.key] = group.subscribe(result);
            }, function (e) { });
        });
        scheduler.scheduleAbsolute(disposed, function () {
            var key, value;
            outerSubscription.dispose();
            for (key in innerSubscriptions) {
                value = innerSubscriptions[key];
                value.dispose();
            }
        });
        scheduler.start();
        equal(4, length(inners));
        results["bar"].messages.assertEqual(onNext(270, "  Rab"), onError(360, ex));
        results["baz"].messages.assertEqual(onNext(350, "   zaB "), onError(360, ex));
        results["qux"].messages.assertEqual(onError(360, ex));
        results["foo"].messages.assertEqual(onNext(220, "oof  "), onNext(240, " OoF "), onNext(310, " Oof"), onCompleted(310));
        xs.subscriptions.assertEqual(subscribe(200, 360));
    });
    test('GroupByUntil_Outer_Independence', function () {
        var innerSubscriptions, inners, outer, outerResults, outerSubscription, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        inners = {};
        innerSubscriptions = {};
        results = {};
        outerResults = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupByUntil(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            return outerSubscription = outer.subscribe(function (group) {
                var result;
                outerResults.onNext(group.key);
                result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                innerSubscriptions[group.key] = group.subscribe(result);
            }, function (e) {
                outerResults.onError(e);
            }, function () {
                outerResults.onCompleted();
            });
        });
        scheduler.scheduleAbsolute(disposed, function () {
            var key, value;
            outerSubscription.dispose();
            for (key in innerSubscriptions) {
                value = innerSubscriptions[key];
                value.dispose();
            }
        });
        scheduler.scheduleAbsolute(320, function () {
            outerSubscription.dispose();
        });
        scheduler.start();
        equal(2, length(inners));
        outerResults.messages.assertEqual(onNext(220, "foo"), onNext(270, "bar"));
        results["foo"].messages.assertEqual(onNext(220, "oof  "), onNext(240, " OoF "), onNext(310, " Oof"), onCompleted(310));
        results["bar"].messages.assertEqual(onNext(270, "  Rab"), onNext(390, "rab   "), onNext(420, "  RAB "), onCompleted(420));
        xs.subscriptions.assertEqual(subscribe(200, 420));
    });
    test('GroupByUntil_Inner_Independence', function () {
        var innerSubscriptions, inners, outer, outerResults, outerSubscription, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        outer = null;
        outerSubscription = null;
        inners = {};
        innerSubscriptions = {};
        results = {};
        outerResults = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupByUntil(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            return outerSubscription = outer.subscribe(function (group) {
                var result;
                outerResults.onNext(group.key);
                result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                innerSubscriptions[group.key] = group.subscribe(result);
            }, function (e) {
                outerResults.onError(e);
            }, function () {
                outerResults.onCompleted();
            });
        });
        scheduler.scheduleAbsolute(disposed, function () {
            var key, value;
            outerSubscription.dispose();
            for (key in innerSubscriptions) {
                value = innerSubscriptions[key];
                value.dispose();
            }
        });
        scheduler.scheduleAbsolute(320, function () {
            innerSubscriptions["foo"].dispose();
        });
        scheduler.start();
        equal(4, length(inners));
        results["bar"].messages.assertEqual(onNext(270, "  Rab"), onNext(390, "rab   "), onNext(420, "  RAB "), onCompleted(420));
        results["baz"].messages.assertEqual(onNext(350, "   zaB "), onNext(480, "  zab"), onNext(510, " ZAb "), onCompleted(510));
        results["qux"].messages.assertEqual(onNext(360, " xuq  "), onCompleted(570));
        results["foo"].messages.assertEqual(onNext(470, " OOF"), onNext(530, "    oOf    "), onCompleted(570));
        xs.subscriptions.assertEqual(subscribe(200, 570));
    });
    test('GroupByUntil_Inner_Multiple_Independence', function () {
        var innerSubscriptions, inners, outer, outerResults, outerSubscription, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        outer = null;
        outerSubscription = null;
        inners = {};
        innerSubscriptions = {};
        results = {};
        outerResults = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupByUntil(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            return outerSubscription = outer.subscribe(function (group) {
                var result;
                outerResults.onNext(group.key);
                result = scheduler.createObserver();
                inners[group.key] = group;
                results[group.key] = result;
                innerSubscriptions[group.key] = group.subscribe(result);
            }, function (e) {
                return outerResults.onError(e);
            }, function () {
                return outerResults.onCompleted();
            });
        });
        scheduler.scheduleAbsolute(disposed, function () {
            var key, value;
            outerSubscription.dispose();
            for (key in innerSubscriptions) {
                value = innerSubscriptions[key];
                value.dispose();
            }
        });
        scheduler.scheduleAbsolute(320, function () {
            innerSubscriptions["foo"].dispose();
        });
        scheduler.scheduleAbsolute(280, function () {
            innerSubscriptions["bar"].dispose();
        });
        scheduler.scheduleAbsolute(355, function () {
            innerSubscriptions["baz"].dispose();
        });
        scheduler.scheduleAbsolute(400, function () {
            innerSubscriptions["qux"].dispose();
        });
        scheduler.start();
        equal(4, length(inners));
        results["bar"].messages.assertEqual(onNext(270, "  Rab"));
        results["baz"].messages.assertEqual(onNext(350, "   zaB "));
        results["qux"].messages.assertEqual(onNext(360, " xuq  "));
        results["foo"].messages.assertEqual(onNext(470, " OOF"), onNext(530, "    oOf    "), onCompleted(570));
        xs.subscriptions.assertEqual(subscribe(200, 570));
    });
    test('GroupByUntil_Inner_Escape_Complete', function () {
        var inner, innerSubscription, outer, outerSubscription, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(220, "  foo"), onNext(240, " FoO "), onNext(310, "foO "), onNext(470, "FOO "), onNext(530, "    fOo    "), onCompleted(570));
        outer = null;
        outerSubscription = null;
        inner = null;
        innerSubscription = null;
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupByUntil(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            outerSubscription = outer.subscribe(function (group) {
                return inner = group;
            });
        });
        scheduler.scheduleAbsolute(600, function () {
            innerSubscription = inner.subscribe(results);
        });
        scheduler.scheduleAbsolute(disposed, function () {
            outerSubscription.dispose();
            innerSubscription.dispose();
        });
        scheduler.start();
        xs.subscriptions.assertEqual(subscribe(200, 570));
        results.messages.assertEqual(onCompleted(600));
    });
    test('GroupByUntil_Inner_Escape_Error', function () {
        var ex, inner, innerSubscription, outer, outerSubscription, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(220, "  foo"), onNext(240, " FoO "), onNext(310, "foO "), onNext(470, "FOO "), onNext(530, "    fOo    "), onError(570, ex));
        outer = null;
        outerSubscription = null;
        inner = null;
        innerSubscription = null;
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupByUntil(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            return outerSubscription = outer.subscribe(function (group) {
                inner = group;
            }, function (e) { });
        });
        scheduler.scheduleAbsolute(600, function () {
            innerSubscription = inner.subscribe(results);
        });
        scheduler.scheduleAbsolute(disposed, function () {
            outerSubscription.dispose();
            innerSubscription.dispose();
        });
        scheduler.start();
        xs.subscriptions.assertEqual(subscribe(200, 570));
        results.messages.assertEqual(onError(600, ex));
    });
    test('GroupByUntil_Inner_Escape_Dispose', function () {
        var inner, innerSubscription, outer, outerSubscription, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(220, "  foo"), onNext(240, " FoO "), onNext(310, "foO "), onNext(470, "FOO "), onNext(530, "    fOo    "), onError(570, 'ex'));
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(created, function () {
            return outer = xs.groupByUntil(function (x) {
                return x.toLowerCase().trim();
            }, function (x) {
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            });
        });
        scheduler.scheduleAbsolute(subscribed, function () {
            outerSubscription = outer.subscribe(function (group) {
                inner = group;
            });
        });
        scheduler.scheduleAbsolute(290, function () {
            outerSubscription.dispose();
        });
        scheduler.scheduleAbsolute(600, function () {
            innerSubscription = inner.subscribe(results);
        });
        scheduler.scheduleAbsolute(disposed, function () {
            outerSubscription.dispose();
        });
        scheduler.start();
        xs.subscriptions.assertEqual(subscribe(200, 290));
        results.messages.assertEqual();
    });
    test('GroupByUntil_Default', function () {
        var eleInvoked, keyInvoked, results, scheduler, xs;
        keyInvoked = 0;
        eleInvoked = 0;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(90, "error"), onNext(110, "error"), onNext(130, "error"), onNext(220, "  foo"), onNext(240, " FoO "), onNext(270, "baR  "), onNext(310, "foO "), onNext(350, " Baz   "), onNext(360, "  qux "), onNext(390, "   bar"), onNext(420, " BAR  "), onNext(470, "FOO "), onNext(480, "baz  "), onNext(510, " bAZ "), onNext(530, "    fOo    "), onCompleted(570), onNext(580, "error"), onCompleted(600), onError(650, 'ex'));
        results = scheduler.startWithCreate(function () {
            var outer;
            return outer = xs.groupByUntil(function (x) {
                keyInvoked++;
                return x.toLowerCase().trim();
            }, function (x) {
                eleInvoked++;
                return x.reverse();
            }, function (g) {
                return g.skip(2);
            }).select(function (x) {
                return x.key;
            });
        });
        results.messages.assertEqual(onNext(220, "foo"), onNext(270, "bar"), onNext(350, "baz"), onNext(360, "qux"), onNext(470, "foo"), onCompleted(570));
        xs.subscriptions.assertEqual(subscribe(200, 570));
        equal(12, keyInvoked);
        equal(12, eleInvoked);
    });
    test('GroupByUntil_DurationSelector_Throws', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, "foo"));
        results = scheduler.startWithCreate(function () {
            var outer;
            return outer = xs.groupByUntil(function (x) {
                return x;
            }, function (x) {
                return x;
            }, function (g) {
                throw ex;
            });
        });
        results.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    
}(typeof global == 'object' && global || this));