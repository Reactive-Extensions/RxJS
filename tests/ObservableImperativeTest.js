/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

(function(window) {

    // Check if browser vs node
    var root;
    if (!window.document) {
        root = require('../rx.js');
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

    QUnit.module('ObservableImperativeTest');

    var Observable = root.Observable,
        TestScheduler = root.TestScheduler,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe;

    test('While_AlwaysFalse', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(150, 3), onNext(200, 4), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return Observable.whileDo(function () {
                return false;
            }, xs);
        });
        results.messages.assertEqual(onCompleted(200));
        xs.subscriptions.assertEqual();
    });

    test('While_AlwaysTrue', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(150, 3), onNext(200, 4), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return Observable.whileDo(function () {
                return true;
            }, xs);
        });
        results.messages.assertEqual(onNext(250, 1), onNext(300, 2), onNext(350, 3), onNext(400, 4), onNext(500, 1), onNext(550, 2), onNext(600, 3), onNext(650, 4), onNext(750, 1), onNext(800, 2), onNext(850, 3), onNext(900, 4));
        xs.subscriptions.assertEqual(subscribe(200, 450), subscribe(450, 700), subscribe(700, 950), subscribe(950, 1000));
    });

    test('While_AlwaysTrue_Throw', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onError(50, ex));
        results = scheduler.startWithCreate(function () {
            return Observable.whileDo(function () {
                return true;
            }, xs);
        });
        results.messages.assertEqual(onError(250, ex));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('While_AlwaysTrue_Infinite', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(50, 1));
        results = scheduler.startWithCreate(function () {
            return Observable.whileDo(function () {
                return true;
            }, xs);
        });
        results.messages.assertEqual(onNext(250, 1));
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });

    test('While_SometimesTrue', function () {
        var n, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(150, 3), onNext(200, 4), onCompleted(250));
        n = 0;
        results = scheduler.startWithCreate(function () {
            return Observable.whileDo(function () {
                return ++n < 3;
            }, xs);
        });
        results.messages.assertEqual(onNext(250, 1), onNext(300, 2), onNext(350, 3), onNext(400, 4), onNext(500, 1), onNext(550, 2), onNext(600, 3), onNext(650, 4), onCompleted(700));
        xs.subscriptions.assertEqual(subscribe(200, 450), subscribe(450, 700));
    });

    test('While_SometimesThrows', function () {
        var ex, n, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(150, 3), onNext(200, 4), onCompleted(250));
        n = 0;
        ex = 'ex';
        results = scheduler.startWithCreate(function () {
            return Observable.whileDo(function () {
                if (++n < 3) {
                    return true;
                } else {
                    throw ex;
                }
            }, xs);
        });
        results.messages.assertEqual(onNext(250, 1), onNext(300, 2), onNext(350, 3), onNext(400, 4), onNext(500, 1), onNext(550, 2), onNext(600, 3), onNext(650, 4), onError(700, ex));
        xs.subscriptions.assertEqual(subscribe(200, 450), subscribe(450, 700));
    });

    test('If_True', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(250, 2), onCompleted(300));
        ys = scheduler.createHotObservable(onNext(310, 3), onNext(350, 4), onCompleted(400));
        results = scheduler.startWithCreate(function () {
            return Observable.ifThen(function () {
                return true;
            }, xs, ys);
        });
        results.messages.assertEqual(onNext(210, 1), onNext(250, 2), onCompleted(300));
        xs.subscriptions.assertEqual(subscribe(200, 300));
        ys.subscriptions.assertEqual();
    });

    test('If_False', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(250, 2), onCompleted(300));
        ys = scheduler.createHotObservable(onNext(310, 3), onNext(350, 4), onCompleted(400));
        results = scheduler.startWithCreate(function () {
            return Observable.ifThen(function () {
                return false;
            }, xs, ys);
        });
        results.messages.assertEqual(onNext(310, 3), onNext(350, 4), onCompleted(400));
        xs.subscriptions.assertEqual();
        ys.subscriptions.assertEqual(subscribe(200, 400));
    });

    test('If_Throw', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(250, 2), onCompleted(300));
        ys = scheduler.createHotObservable(onNext(310, 3), onNext(350, 4), onCompleted(400));
        results = scheduler.startWithCreate(function () {
            return Observable.ifThen(function () {
                throw ex;
            }, xs, ys);
        });
        results.messages.assertEqual(onError(200, ex));
        xs.subscriptions.assertEqual();
        ys.subscriptions.assertEqual();
    });

    test('If_Dispose', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(250, 2));
        ys = scheduler.createHotObservable(onNext(310, 3), onNext(350, 4), onCompleted(400));
        results = scheduler.startWithCreate(function () {
            return Observable.ifThen(function () {
                return true;
            }, xs, ys);
        });
        results.messages.assertEqual(onNext(210, 1), onNext(250, 2));
        xs.subscriptions.assertEqual(subscribe(200, 1000));
        ys.subscriptions.assertEqual();
    });

    test('DoWhile_AlwaysFalse', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(150, 3), onNext(200, 4), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.doWhile(function () {
                return false;
            });
        });
        results.messages.assertEqual(onNext(250, 1), onNext(300, 2), onNext(350, 3), onNext(400, 4), onCompleted(450));
        xs.subscriptions.assertEqual(subscribe(200, 450));
    });

    test('DoWhile_AlwaysTrue', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(150, 3), onNext(200, 4), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.doWhile(function () {
                return true;
            });
        });
        results.messages.assertEqual(onNext(250, 1), onNext(300, 2), onNext(350, 3), onNext(400, 4), onNext(500, 1), onNext(550, 2), onNext(600, 3), onNext(650, 4), onNext(750, 1), onNext(800, 2), onNext(850, 3), onNext(900, 4));
        xs.subscriptions.assertEqual(subscribe(200, 450), subscribe(450, 700), subscribe(700, 950), subscribe(950, 1000));
    });

    test('DoWhile_AlwaysTrue_Throw', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onError(50, ex));
        results = scheduler.startWithCreate(function () {
            return xs.doWhile(function () {
                return true;
            });
        });
        results.messages.assertEqual(onError(250, ex));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('DoWhile_AlwaysTrue_Infinite', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(50, 1));
        results = scheduler.startWithCreate(function () {
            return xs.doWhile(function () {
                return true;
            });
        });
        results.messages.assertEqual(onNext(250, 1));
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });

    test('DoWhile_SometimesTrue', function () {
        var n, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(150, 3), onNext(200, 4), onCompleted(250));
        n = 0;
        results = scheduler.startWithCreate(function () {
            return xs.doWhile(function () {
                return ++n < 3;
            });
        });
        results.messages.assertEqual(onNext(250, 1), onNext(300, 2), onNext(350, 3), onNext(400, 4), onNext(500, 1), onNext(550, 2), onNext(600, 3), onNext(650, 4), onNext(750, 1), onNext(800, 2), onNext(850, 3), onNext(900, 4), onCompleted(950));
        xs.subscriptions.assertEqual(subscribe(200, 450), subscribe(450, 700), subscribe(700, 950));
    });

    test('DoWhile_SometimesThrows', function () {
        var ex, n, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(50, 1), onNext(100, 2), onNext(150, 3), onNext(200, 4), onCompleted(250));
        n = 0;
        results = scheduler.startWithCreate(function () {
            return xs.doWhile(function () {
                if (++n < 3) {
                    return true;
                } else {
                    throw ex;
                }
            });
        });
        results.messages.assertEqual(onNext(250, 1), onNext(300, 2), onNext(350, 3), onNext(400, 4), onNext(500, 1), onNext(550, 2), onNext(600, 3), onNext(650, 4), onNext(750, 1), onNext(800, 2), onNext(850, 3), onNext(900, 4), onError(950, ex));
        xs.subscriptions.assertEqual(subscribe(200, 450), subscribe(450, 700), subscribe(700, 950));
    });

    test('Case_One', function () {
        var map, results, scheduler, xs, ys, zs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
        ys = scheduler.createHotObservable(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
        zs = scheduler.createHotObservable(onNext(230, 21), onNext(240, 22), onNext(290, 23), onCompleted(320));
        map = {
            1: xs,
            2: ys
        };
        results = scheduler.startWithCreate(function () {
            return Observable.switchCase(function () {
                return 1;
            }, map, zs);
        });
        results.messages.assertEqual(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
        xs.subscriptions.assertEqual(subscribe(200, 300));
        ys.subscriptions.assertEqual();
        zs.subscriptions.assertEqual();
    });

    test('Case_Two', function () {
        var map, results, scheduler, xs, ys, zs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
        ys = scheduler.createHotObservable(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
        zs = scheduler.createHotObservable(onNext(230, 21), onNext(240, 22), onNext(290, 23), onCompleted(320));
        map = {
            1: xs,
            2: ys
        };
        results = scheduler.startWithCreate(function () {
            return Observable.switchCase(function () {
                return 2;
            }, map, zs);
        });
        results.messages.assertEqual(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
        xs.subscriptions.assertEqual();
        ys.subscriptions.assertEqual(subscribe(200, 310));
        zs.subscriptions.assertEqual();
    });

    test('Case_Three', function () {
        var map, results, scheduler, xs, ys, zs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
        ys = scheduler.createHotObservable(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
        zs = scheduler.createHotObservable(onNext(230, 21), onNext(240, 22), onNext(290, 23), onCompleted(320));
        map = {
            1: xs,
            2: ys
        };
        results = scheduler.startWithCreate(function () {
            return Observable.switchCase(function () {
                return 3;
            }, map, zs);
        });
        results.messages.assertEqual(onNext(230, 21), onNext(240, 22), onNext(290, 23), onCompleted(320));
        xs.subscriptions.assertEqual();
        ys.subscriptions.assertEqual();
        zs.subscriptions.assertEqual(subscribe(200, 320));
    });

    test('Case_Throw', function () {
        var ex, map, results, scheduler, xs, ys, zs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
        ys = scheduler.createHotObservable(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
        zs = scheduler.createHotObservable(onNext(230, 21), onNext(240, 22), onNext(290, 23), onCompleted(320));
        map = {
            1: xs,
            2: ys
        };
        results = scheduler.startWithCreate(function () {
            return Observable.switchCase(function () {
                throw ex;
            }, map, zs);
        });
        results.messages.assertEqual(onError(200, ex));
        xs.subscriptions.assertEqual();
        ys.subscriptions.assertEqual();
        zs.subscriptions.assertEqual();
    });

    test('CaseWithDefault_One', function () {
        var map, results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
        ys = scheduler.createHotObservable(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
        map = {
            1: xs,
            2: ys
        };
        results = scheduler.startWithCreate(function () {
            return Observable.switchCase(function () {
                return 1;
            }, map, scheduler);
        });
        results.messages.assertEqual(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
        xs.subscriptions.assertEqual(subscribe(200, 300));
        ys.subscriptions.assertEqual();
    });

    test('CaseWithDefault_Two', function () {
        var map, results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
        ys = scheduler.createHotObservable(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
        map = {
            1: xs,
            2: ys
        };
        results = scheduler.startWithCreate(function () {
            return Observable.switchCase(function () {
                return 2;
            }, map, scheduler);
        });
        results.messages.assertEqual(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
        xs.subscriptions.assertEqual();
        ys.subscriptions.assertEqual(subscribe(200, 310));
    });

    test('CaseWithDefault_Three', function () {
        var map, results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
        ys = scheduler.createHotObservable(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
        map = {
            1: xs,
            2: ys
        };
        results = scheduler.startWithCreate(function () {
            return Observable.switchCase(function () {
                return 3;
            }, map, scheduler);
        });
        results.messages.assertEqual(onCompleted(201));
        xs.subscriptions.assertEqual();
        ys.subscriptions.assertEqual();
    });

    test('CaseWithDefault_Throw', function () {
        var ex, map, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
        ys = scheduler.createHotObservable(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
        map = {
            1: xs,
            2: ys
        };
        results = scheduler.startWithCreate(function () {
            return Observable.switchCase(function () {
                throw ex;
            }, map, scheduler);
        });
        results.messages.assertEqual(onError(200, ex));
        xs.subscriptions.assertEqual();
        ys.subscriptions.assertEqual();
    });

    test('For_Basic', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.forIn([1, 2, 3], function (x) {
                return scheduler.createColdObservable(onNext(x * 100 + 10, x * 10 + 1), onNext(x * 100 + 20, x * 10 + 2), onNext(x * 100 + 30, x * 10 + 3), onCompleted(x * 100 + 40));
            });
        });
        results.messages.assertEqual(onNext(310, 11), onNext(320, 12), onNext(330, 13), onNext(550, 21), onNext(560, 22), onNext(570, 23), onNext(890, 31), onNext(900, 32), onNext(910, 33), onCompleted(920));
    });

    test('For_Throws', function () {
        var ex, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.forIn([1, 2, 3], function () {
                throw ex;
            });
        });
        results.messages.assertEqual(onError(200, ex));
    });

    test('If_Default_Completed', function () {
        var b, results, scheduler, xs;
        b = false;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(220, 2), onNext(330, 3), onCompleted(440));
        scheduler.scheduleAbsolute(150, function () {
            b = true;
        });
        results = scheduler.startWithCreate(function () {
            return Observable.ifThen(function () {
                return b;
            }, xs);
        });
        results.messages.assertEqual(onNext(220, 2), onNext(330, 3), onCompleted(440));
        xs.subscriptions.assertEqual(subscribe(200, 440));
    });

    test('If_Default_Error', function () {
        var b, ex, results, scheduler, xs;
        ex = 'ex';
        b = false;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(220, 2), onNext(330, 3), onError(440, ex));
        scheduler.scheduleAbsolute(150, function () {
            b = true;
        });
        results = scheduler.startWithCreate(function () {
            return Observable.ifThen(function () {
                return b;
            }, xs);
        });
        results.messages.assertEqual(onNext(220, 2), onNext(330, 3), onError(440, ex));
        xs.subscriptions.assertEqual(subscribe(200, 440));
    });

    test('If_Default_Never', function () {
        var b, results, scheduler, xs;
        b = false;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(220, 2), onNext(330, 3));
        scheduler.scheduleAbsolute(150, function () {
            b = true;
        });
        results = scheduler.startWithCreate(function () {
            return Observable.ifThen(function () {
                return b;
            }, xs);
        });
        results.messages.assertEqual(onNext(220, 2), onNext(330, 3));
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });

    test('If_Default_Other', function () {
        var b, results, scheduler, xs;
        b = true;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(220, 2), onNext(330, 3), onError(440, 'ex'));
        scheduler.scheduleAbsolute(150, function () {
            b = false;
        });
        results = scheduler.startWithCreate(function () {
            return Observable.ifThen(function () {
                return b;
            }, xs);
        });
        results.messages.assertEqual(onCompleted(200));
        xs.subscriptions.assertEqual();
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    if (!window.document) {
        QUnit.start();
    }
}(typeof global == 'object' && global || this));