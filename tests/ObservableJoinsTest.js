/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

(function(window) {

    // Check if browser vs node
    var root;
    if (!window.document) {
        root = require('../rx');
        require('../rx.joinpatterns');
        require('../rx.testing');
        require('./ReactiveAssert');
    } else {
        root = window.Rx;
    }

    // use a single load function
    var load = typeof require == 'function' ? require : window.load;

    // load QUnit and CLIB if needed
    var QUnit =
      window.QUnit || (
        window.setTimeout || (window.addEventListener = window.setTimeout = / /),
        window.QUnit = load('./vendor/qunit-1.9.0.js') || window.QUnit,
        load('./vendor/qunit-clib.js'),
        (window.addEventListener || 0).test && delete window.addEventListener,
        window.QUnit
      );

    QUnit.module('ObservableJoinsTest');

    var Observable = root.Observable,
        Observer = root.Observer,
        TestScheduler = root.TestScheduler,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe,
        created = root.ReactiveTest.created,
        subscribed = root.ReactiveTest.subscribed,
        disposed = root.ReactiveTest.disposed;

    test('Then1', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onCompleted(220));
        results = scheduler.startWithCreate(function () {
            return Observable.when(xs.then(function (a) {
                return a;
            }));
        });
        results.messages.assertEqual(onNext(210, 1), onCompleted(220));
    });
    test('Then1Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onError(210, ex));
        results = scheduler.startWithCreate(function () {
            return Observable.when(xs.then(function (a) {
                return a;
            }));
        });
        results.messages.assertEqual(onError(210, ex));
    });
    test('Then1Throws', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onCompleted(220));
        results = scheduler.startWithCreate(function () {
            return Observable.when(xs.then(function (a) {
                throw ex;
            }));
        });
        results.messages.assertEqual(onError(210, ex));
    });
    test('And2', function () {
        var N, i, obs, results, scheduler;
        N = 2;
        scheduler = new TestScheduler();
        obs = [];
        for (i = 0; i < N; i++) {
            obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
        }
        results = scheduler.startWithCreate(function () {
            return Observable.when(obs[0].and(obs[1]).then(function (a, b) {
                return a + b;
            }));
        });
        results.messages.assertEqual(onNext(210, N), onCompleted(220));
    });
    test('And2Error', function () {
        var N, ex, i, j, obs, results, scheduler;
        ex = 'ex';
        N = 2;
        for (i = 0; i < N; i++) {
            scheduler = new TestScheduler();
            obs = [];
            for (j = 0; j < N; j++) {
                if (j === i) {
                    obs.push(scheduler.createHotObservable(onError(210, ex)));
                } else {
                    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
                }
            }

            results = scheduler.startWithCreate(function () {
                return Observable.when(obs[0].and(obs[1]).then(function (a, b) {
                    return a + b;
                }));
            });
            results.messages.assertEqual(onError(210, ex));
        }
    });
    test('Then2Throws', function () {
        var N, ex, i, obs, results, scheduler;
        ex = 'ex';
        N = 2;
        scheduler = new TestScheduler();
        obs = [];
        for (i = 0; i < N; i++) {
            obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
        }
        results = scheduler.startWithCreate(function () {
            return Observable.when(obs[0].and(obs[1]).then(function (a, b) {
                throw ex;
            }));
        });
        results.messages.assertEqual(onError(210, ex));
    });
    test('And3', function () {
        var N, i, obs, results, scheduler;
        N = 3;
        scheduler = new TestScheduler();
        obs = [];
        for (i = 0; i < N; i++) {
            obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
        }
        results = scheduler.startWithCreate(function () {
            return Observable.when(obs[0].and(obs[1]).and(obs[2]).then(function (a, b, c) {
                return a + b + c;
            }));
        });
        results.messages.assertEqual(onNext(210, N), onCompleted(220));
    });
    test('And3Error', function () {
        var N, ex, i, j, obs, results, scheduler;
        ex = 'ex';
        N = 3;
        for (i = 0; i < N; i++) {
            scheduler = new TestScheduler();
            obs = [];
            for (j = 0; j < N; j++) {
                if (j === i) {
                    obs.push(scheduler.createHotObservable(onError(210, ex)));
                } else {
                    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
                }
            }

            results = scheduler.startWithCreate(function () {
                return Observable.when(obs[0].and(obs[1]).and(obs[2]).then(function (a, b, c) {
                    return a + b + c;
                }));
            });
            results.messages.assertEqual(onError(210, ex));
        }
    });
    test('Then3Throws', function () {
        var N, ex, i, obs, results, scheduler;
        ex = 'ex';
        N = 3;
        scheduler = new TestScheduler();
        obs = [];
        for (i = 0; i < N; i++) {
            obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
        }
        results = scheduler.startWithCreate(function () {
            return Observable.when(obs[0].and(obs[1]).and(obs[2]).then(function (a, b, c) {
                throw ex;
            }));
        });
        results.messages.assertEqual(onError(210, ex));
    });
    test('And4', function () {
        var N, i, obs, results, scheduler;
        N = 4;
        scheduler = new TestScheduler();
        obs = [];
        for (i = 0; i < N; i++) {
            obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
        }
        results = scheduler.startWithCreate(function () {
            return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).then(function (a, b, c, d) {
                return a + b + c + d;
            }));
        });
        results.messages.assertEqual(onNext(210, N), onCompleted(220));
    });
    test('And4Error', function () {
        var N, ex, i, j, obs, results, scheduler;
        ex = 'ex';
        N = 4;
        for (i = 0; i < N; i++) {
            scheduler = new TestScheduler();
            obs = [];
            for (j = 0; j < N; j++) {
                if (j === i) {
                    obs.push(scheduler.createHotObservable(onError(210, ex)));
                } else {
                    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
                }
            }

            results = scheduler.startWithCreate(function () {
                return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).then(function (a, b, c, d) {
                    return a + b + c + d;
                }));
            });
            results.messages.assertEqual(onError(210, ex));
        }
    });
    test('Then4Throws', function () {
        var N, ex, i, obs, results, scheduler;
        ex = 'ex';
        N = 4;
        scheduler = new TestScheduler();
        obs = [];
        for (i = 0; i < N; i++) {
            obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
        }
        results = scheduler.startWithCreate(function () {
            return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).then(function (a, b, c, d) {
                throw ex;
            }));
        });
        results.messages.assertEqual(onError(210, ex));
    });
    test('And5', function () {
        var N, i, obs, results, scheduler;
        N = 5;
        scheduler = new TestScheduler();
        obs = [];
        for (i = 0; i < N; i++) {
            obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
        }
        results = scheduler.startWithCreate(function () {
            return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).then(function (a, b, c, d, e) {
                return a + b + c + d + e;
            }));
        });
        results.messages.assertEqual(onNext(210, N), onCompleted(220));
    });
    test('And5Error', function () {
        var N, ex, i, j, obs, results, scheduler;
        ex = 'ex';
        N = 5;
        for (i = 0; i < N; i++) {
            scheduler = new TestScheduler();
            obs = [];
            for (j = 0; j < N; j++) {
                if (j === i) {
                    obs.push(scheduler.createHotObservable(onError(210, ex)));
                } else {
                    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
                }
            }

            results = scheduler.startWithCreate(function () {
                return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).then(function (a, b, c, d, e) {
                    return a + b + c + d + e;
                }));
            });
            results.messages.assertEqual(onError(210, ex));
        }
    });
    test('Then5Throws', function () {
        var N, ex, i, obs, results, scheduler;
        ex = 'ex';
        N = 5;
        scheduler = new TestScheduler();
        obs = [];
        for (i = 0; i < N; i++) {
            obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
        }
        results = scheduler.startWithCreate(function () {
            return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).then(function (a, b, c, d, e) {
                throw ex;
            }));
        });
        results.messages.assertEqual(onError(210, ex));
    });
    test('And6', function () {
        var N, i, obs, results, scheduler;
        N = 6;
        scheduler = new TestScheduler();
        obs = [];
        for (i = 0; i < N; i++) {
            obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
        }
        results = scheduler.startWithCreate(function () {
            return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).then(function (a, b, c, d, e, f) {
                return a + b + c + d + e + f;
            }));
        });
        results.messages.assertEqual(onNext(210, N), onCompleted(220));
    });
    test('And6Error', function () {
        var N, ex, i, j, obs, results, scheduler;
        ex = 'ex';
        N = 6;
        for (i = 0; i < N; i++) {
            scheduler = new TestScheduler();
            obs = [];
            for (j = 0; j < N; j++) {
                if (j === i) {
                    obs.push(scheduler.createHotObservable(onError(210, ex)));
                } else {
                    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
                }
            }

            results = scheduler.startWithCreate(function () {
                return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).then(function (a, b, c, d, e, f) {
                    return a + b + c + d + e + f;
                }));
            });
            results.messages.assertEqual(onError(210, ex));
        }
    });
    test('Then6Throws', function () {
        var N, ex, i, obs, results, scheduler;
        ex = 'ex';
        N = 6;
        scheduler = new TestScheduler();
        obs = [];
        for (i = 0; i < N; i++) {
            obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
        }
        results = scheduler.startWithCreate(function () {
            return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).then(function () {
                throw ex;
            }));
        });
        results.messages.assertEqual(onError(210, ex));
    });
    test('And7', function () {
        var N, i, obs, results, scheduler;
        N = 7;
        scheduler = new TestScheduler();
        obs = [];
        for (i = 0; i < N; i++) {
            obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
        }
        results = scheduler.startWithCreate(function () {
            return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).then(function (a, b, c, d, e, f, g) {
                return a + b + c + d + e + f + g;
            }));
        });
        results.messages.assertEqual(onNext(210, N), onCompleted(220));
    });
    test('And7Error', function () {
        var N, ex, i, j, obs, results, scheduler;
        ex = 'ex';
        N = 7;
        for (i = 0; i < N; i++) {
            scheduler = new TestScheduler();
            obs = [];
            for (j = 0; j < N; j++) {
                if (j === i) {
                    obs.push(scheduler.createHotObservable(onError(210, ex)));
                } else {
                    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
                }
            }

            results = scheduler.startWithCreate(function () {
                return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).then(function (a, b, c, d, e, f, g) {
                    return a + b + c + d + e + f + g;
                }));
            });
            results.messages.assertEqual(onError(210, ex));
        }
    });
    test('Then7Throws', function () {
        var N, ex, i, obs, results, scheduler;
        ex = 'ex';
        N = 7;
        scheduler = new TestScheduler();
        obs = [];
        for (i = 0; i < N; i++) {
            obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
        }
        results = scheduler.startWithCreate(function () {
            return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).then(function () {
                throw ex;
            }));
        });
        results.messages.assertEqual(onError(210, ex));
    });
    test('And8', function () {
        var N, i, obs, results, scheduler;
        N = 8;
        scheduler = new TestScheduler();
        obs = [];
        for (i = 0; i < N; i++) {
            obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
        }
        results = scheduler.startWithCreate(function () {
            return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).and(obs[7]).then(function (a, b, c, d, e, f, g, h) {
                return a + b + c + d + e + f + g + h;
            }));
        });
        results.messages.assertEqual(onNext(210, N), onCompleted(220));
    });
    test('And8Error', function () {
        var N, ex, i, j, obs, results, scheduler;
        ex = 'ex';
        N = 8;
        for (i = 0; i < N; i++) {
            scheduler = new TestScheduler();
            obs = [];
            for (j = 0; j < N; j++) {
                if (j === i) {
                    obs.push(scheduler.createHotObservable(onError(210, ex)));
                } else {
                    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
                }
            }

            results = scheduler.startWithCreate(function () {
                return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).and(obs[7]).then(function (a, b, c, d, e, f, g, h) {
                    return a + b + c + d + e + f + g + h;
                }));
            });
            results.messages.assertEqual(onError(210, ex));
        }
    });
    test('Then8Throws', function () {
        var N, ex, i, obs, results, scheduler;
        ex = 'ex';
        N = 8;
        scheduler = new TestScheduler();
        obs = [];
        for (i = 0; i < N; i++) {
            obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
        }
        results = scheduler.startWithCreate(function () {
            return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).and(obs[7]).then(function () {
                throw ex;
            }));
        });
        results.messages.assertEqual(onError(210, ex));
    });
    test('And9', function () {
        var N, i, obs, results, scheduler;
        N = 9;
        scheduler = new TestScheduler();
        obs = [];
        for (i = 0; i < N; i++) {
            obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
        }
        results = scheduler.startWithCreate(function () {
            return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).and(obs[7]).and(obs[8]).then(function (a, b, c, d, e, f, g, h, _i) {
                return a + b + c + d + e + f + g + h + _i;
            }));
        });
        results.messages.assertEqual(onNext(210, N), onCompleted(220));
    });
    test('And9Error', function () {
        var N, ex, i, j, obs, results, scheduler;
        ex = 'ex';
        N = 9;
        for (i = 0; i < N; i++) {
            scheduler = new TestScheduler();
            obs = [];
            for (j = 0; j < N; j++) {
                if (j === i) {
                    obs.push(scheduler.createHotObservable(onError(210, ex)));
                } else {
                    obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
                }
            }

            results = scheduler.startWithCreate(function () {
                return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).and(obs[7]).and(obs[8]).then(function (a, b, c, d, e, f, g, h, _i) {
                    return a + b + c + d + e + f + g + h + _i;
                }));
            });
            results.messages.assertEqual(onError(210, ex));
        }
    });
    test('Then9Throws', function () {
        var N, ex, i, obs, results, scheduler;
        ex = 'ex';
        N = 9;
        scheduler = new TestScheduler();
        obs = [];
        for (i = 0; i < N; i++) {
            obs.push(scheduler.createHotObservable(onNext(210, 1), onCompleted(220)));
        }
        results = scheduler.startWithCreate(function () {
            return Observable.when(obs[0].and(obs[1]).and(obs[2]).and(obs[3]).and(obs[4]).and(obs[5]).and(obs[6]).and(obs[7]).and(obs[8]).then(function () {
                throw ex;
            }));
        });
        results.messages.assertEqual(onError(210, ex));
    });
    test('WhenMultipleDataSymmetric', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(240));
        ys = scheduler.createHotObservable(onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
        results = scheduler.startWithCreate(function () {
            return Observable.when(xs.and(ys).then(function (x, y) {
                return x + y;
            }));
        });
        results.messages.assertEqual(onNext(240, 1 + 4), onNext(250, 2 + 5), onNext(260, 3 + 6), onCompleted(270));
    });
    test('WhenMultipleDataAsymmetric', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(240));
        ys = scheduler.createHotObservable(onNext(240, 4), onNext(250, 5), onCompleted(270));
        results = scheduler.startWithCreate(function () {
            return Observable.when(xs.and(ys).then(function (x, y) {
                return x + y;
            }));
        });
        results.messages.assertEqual(onNext(240, 1 + 4), onNext(250, 2 + 5), onCompleted(270));
    });
    test('WhenEmptyEmpty', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onCompleted(240));
        ys = scheduler.createHotObservable(onCompleted(270));
        results = scheduler.startWithCreate(function () {
            return Observable.when(xs.and(ys).then(function (x, y) {
                return x + y;
            }));
        });
        results.messages.assertEqual(onCompleted(270));
    });
    test('WhenNeverNever', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = Observable.never();
        ys = Observable.never();
        results = scheduler.startWithCreate(function () {
            return Observable.when(xs.and(ys).then(function (x, y) {
                return x + y;
            }));
        });
        results.messages.assertEqual();
    });
    test('WhenThrowNonEmpty', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onError(240, ex));
        ys = scheduler.createHotObservable(onCompleted(270));
        results = scheduler.startWithCreate(function () {
            return Observable.when(xs.and(ys).then(function (x, y) {
                return x + y;
            }));
        });
        results.messages.assertEqual(onError(240, ex));
    });
    test('ComplicatedWhen', function () {
        var results, scheduler, xs, ys, zs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(240));
        ys = scheduler.createHotObservable(onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
        zs = scheduler.createHotObservable(onNext(220, 7), onNext(230, 8), onNext(240, 9), onCompleted(300));
        results = scheduler.startWithCreate(function () {
            return Observable.when(xs.and(ys).then(function (x, y) {
                return x + y;
            }), xs.and(zs).then(function (x, z) {
                return x * z;
            }), ys.and(zs).then(function (y, z) {
                return y - z;
            }));
        });
        results.messages.assertEqual(onNext(220, 1 * 7), onNext(230, 2 * 8), onNext(240, 3 + 4), onNext(250, 5 - 9), onCompleted(300));
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    if (!window.document) {
        QUnit.start();
    }
}(typeof global == 'object' && global || this));