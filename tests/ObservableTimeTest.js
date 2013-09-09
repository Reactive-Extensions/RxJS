/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

(function(window) {

    // Check if browser vs node
    var root = window.Rx;

    QUnit.module('ObservableTimeTest');

    var Observable = root.Observable,
        TestScheduler = root.TestScheduler,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe;

    test('WindowWithTimeOrCount_Basic', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(205, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(370, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.windowWithTimeOrCount(70, 3, scheduler).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(205, "0 1"), onNext(210, "0 2"), onNext(240, "0 3"), onNext(280, "1 4"), onNext(320, "2 5"), onNext(350, "2 6"), onNext(370, "2 7"), onNext(420, "3 8"), onNext(470, "4 9"), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('WindowWithTimeOrCount_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(205, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(370, 7), onNext(420, 8), onNext(470, 9), onError(600, ex));
        results = scheduler.startWithCreate(function () {
            return xs.windowWithTimeOrCount(70, 3, scheduler).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(205, "0 1"), onNext(210, "0 2"), onNext(240, "0 3"), onNext(280, "1 4"), onNext(320, "2 5"), onNext(350, "2 6"), onNext(370, "2 7"), onNext(420, "3 8"), onNext(470, "4 9"), onError(600, ex));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('WindowWithTimeOrCount_Disposed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(205, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(370, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
        results = scheduler.startWithDispose(function () {
            return xs.windowWithTimeOrCount(70, 3, scheduler).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                });
            }).mergeObservable();
        }, 370);
        results.messages.assertEqual(onNext(205, "0 1"), onNext(210, "0 2"), onNext(240, "0 3"), onNext(280, "1 4"), onNext(320, "2 5"), onNext(350, "2 6"), onNext(370, "2 7"));
        xs.subscriptions.assertEqual(subscribe(200, 370));
    });
    test('BufferWithTimeOrCount_Basic', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(205, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(370, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.bufferWithTimeOrCount(70, 3, scheduler).select(function (x) {
                return x.toString();
            });
        });
        results.messages.assertEqual(onNext(240, "1,2,3"), onNext(310, "4"), onNext(370, "5,6,7"), onNext(440, "8"), onNext(510, "9"), onNext(580, ""), onNext(600, ""), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('BufferWithTimeOrCount_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(205, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(370, 7), onNext(420, 8), onNext(470, 9), onError(600, ex));
        results = scheduler.startWithCreate(function () {
            return xs.bufferWithTimeOrCount(70, 3, scheduler).select(function (x) {
                return x.toString();
            });
        });
        results.messages.assertEqual(onNext(240, "1,2,3"), onNext(310, "4"), onNext(370, "5,6,7"), onNext(440, "8"), onNext(510, "9"), onNext(580, ""), onError(600, ex));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('BufferWithTimeOrCount_Disposed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(205, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(370, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
        results = scheduler.startWithDispose(function () {
            return xs.bufferWithTimeOrCount(70, 3, scheduler).select(function (x) {
                return x.toString();
            });
        }, 370);
        results.messages.assertEqual(onNext(240, "1,2,3"), onNext(310, "4"), onNext(370, "5,6,7"));
        xs.subscriptions.assertEqual(subscribe(200, 370));
    });

    test('OneShotTimer_TimeSpan_Basic', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.timer(300, scheduler);
        });
        results.messages.assertEqual(onNext(500, 0), onCompleted(500));
    });
    test('OneShotTimer_TimeSpan_Zero', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.timer(0, scheduler);
        });
        results.messages.assertEqual(onNext(201, 0), onCompleted(201));
    });
    test('OneShotTimer_TimeSpan_Negative', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.timer(-1, scheduler);
        });
        results.messages.assertEqual(onNext(201, 0), onCompleted(201));
    });
    test('OneShotTimer_TimeSpan_Disposed', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.timer(1000, scheduler);
        });
        results.messages.assertEqual();
    });
    test('OneShotTimer_TimeSpan_ObserverThrows', function () {
        var scheduler1, scheduler2, xs, ys;
        scheduler1 = new TestScheduler();
        xs = Rx.Observable.timer(1, scheduler1);
        xs.subscribe(function (x) {
            throw 'ex';
        });
        raises(function () {
            return scheduler1.start();
        });
        scheduler2 = new TestScheduler();
        ys = Rx.Observable.timer(1, undefined, scheduler2);
        ys.subscribe(function (x) { }, function (ex) { }, function () {
            throw 'ex';
        });
        raises(function () {
            return scheduler2.start();
        });
    });
    test('Interval_TimeSpan_Basic', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.interval(100, scheduler);
        });
        results.messages.assertEqual(onNext(300, 0), onNext(400, 1), onNext(500, 2), onNext(600, 3), onNext(700, 4), onNext(800, 5), onNext(900, 6));
    });
    test('Interval_TimeSpan_Zero', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithDispose(function () {
            return Rx.Observable.interval(0, scheduler);
        }, 210);
        results.messages.assertEqual(onNext(201, 0), onNext(202, 1), onNext(203, 2), onNext(204, 3), onNext(205, 4), onNext(206, 5), onNext(207, 6), onNext(208, 7), onNext(209, 8));
    });
    test('Interval_TimeSpan_Negative', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithDispose(function () {
            return Rx.Observable.interval(-1, scheduler);
        }, 210);
        results.messages.assertEqual(onNext(201, 0), onNext(202, 1), onNext(203, 2), onNext(204, 3), onNext(205, 4), onNext(206, 5), onNext(207, 6), onNext(208, 7), onNext(209, 8));
    });
    test('Interval_TimeSpan_Disposed', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.interval(1000, scheduler);
        });
        results.messages.assertEqual();
    });
    test('Interval_TimeSpan_ObserverThrows', function () {
        var scheduler, xs;
        scheduler = new TestScheduler();
        xs = Rx.Observable.interval(1, scheduler);
        xs.subscribe(function (x) {
            throw ex;
        });
        raises(function () {
            return scheduler.start();
        });
    });
    test('Delay_TimeSpan_Simple1', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
        results = scheduler.startWithCreate(function () {
            return xs.delay(100, scheduler);
        });
        results.messages.assertEqual(onNext(350, 2), onNext(450, 3), onNext(550, 4), onCompleted(650));
        xs.subscriptions.assertEqual(subscribe(200, 550));
    });
    test('Delay_DateTimeOffset_Simple1_Impl', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
        results = scheduler.startWithCreate(function () {
            return xs.delay(new Date(300), scheduler);
        });
        results.messages.assertEqual(onNext(350, 2), onNext(450, 3), onNext(550, 4), onCompleted(650));
        xs.subscriptions.assertEqual(subscribe(200, 550));
    });
    test('Delay_TimeSpan_Simple2_Impl', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
        results = scheduler.startWithCreate(function () {
            return xs.delay(50, scheduler);
        });
        results.messages.assertEqual(onNext(300, 2), onNext(400, 3), onNext(500, 4), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 550));
    });
    test('Delay_DateTimeOffset_Simple2_Impl', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
        results = scheduler.startWithCreate(function () {
            return xs.delay(new Date(250), scheduler);
        });
        results.messages.assertEqual(onNext(300, 2), onNext(400, 3), onNext(500, 4), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 550));
    });
    test('Delay_TimeSpan_Simple3_Impl', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
        results = scheduler.startWithCreate(function () {
            return xs.delay(150, scheduler);
        });
        results.messages.assertEqual(onNext(400, 2), onNext(500, 3), onNext(600, 4), onCompleted(700));
        xs.subscriptions.assertEqual(subscribe(200, 550));
    });
    test('Delay_DateTimeOffset_Simple3_Impl', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
        results = scheduler.startWithCreate(function () {
            return xs.delay(new Date(350), scheduler);
        });
        results.messages.assertEqual(onNext(400, 2), onNext(500, 3), onNext(600, 4), onCompleted(700));
        xs.subscriptions.assertEqual(subscribe(200, 550));
    });
    test('Delay_TimeSpan_Error1_Impl', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onError(550, ex));
        results = scheduler.startWithCreate(function () {
            return xs.delay(50, scheduler);
        });
        results.messages.assertEqual(onNext(300, 2), onNext(400, 3), onNext(500, 4), onError(550, ex));
        xs.subscriptions.assertEqual(subscribe(200, 550));
    });
    test('Delay_DateTimeOffset_Error1_Impl', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onError(550, ex));
        results = scheduler.startWithCreate(function () {
            return xs.delay(new Date(250), scheduler);
        });
        results.messages.assertEqual(onNext(300, 2), onNext(400, 3), onNext(500, 4), onError(550, ex));
        xs.subscriptions.assertEqual(subscribe(200, 550));
    });
    test('Delay_TimeSpan_Error2_Impl', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onError(550, ex));
        results = scheduler.startWithCreate(function () {
            return xs.delay(150, scheduler);
        });
        results.messages.assertEqual(onNext(400, 2), onNext(500, 3), onError(550, ex));
        xs.subscriptions.assertEqual(subscribe(200, 550));
    });
    test('Delay_DateTimeOffset_Error2_Impl', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onError(550, ex));
        results = scheduler.startWithCreate(function () {
            return xs.delay(new Date(350), scheduler);
        });
        results.messages.assertEqual(onNext(400, 2), onNext(500, 3), onError(550, ex));
        xs.subscriptions.assertEqual(subscribe(200, 550));
    });
    test('Delay_Empty', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(550));
        results = scheduler.startWithCreate(function () {
            return xs.delay(10, scheduler);
        });
        results.messages.assertEqual(onCompleted(560));
        xs.subscriptions.assertEqual(subscribe(200, 550));
    });
    test('Delay_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(550, ex));
        results = scheduler.startWithCreate(function () {
            return xs.delay(10, scheduler);
        });
        results.messages.assertEqual(onError(550, ex));
        xs.subscriptions.assertEqual(subscribe(200, 550));
    });
    test('Delay_Never', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1));
        results = scheduler.startWithCreate(function () {
            return xs.delay(10, scheduler);
        });
        results.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('Throttle_TimeSpan_AllPass', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(200, 2), onNext(250, 3), onNext(300, 4), onNext(350, 5), onNext(400, 6), onNext(450, 7), onNext(500, 8), onCompleted(550));
        results = scheduler.startWithCreate(function () {
            return xs.throttle(40, scheduler);
        });
        return results.messages.assertEqual(onNext(290, 3), onNext(340, 4), onNext(390, 5), onNext(440, 6), onNext(490, 7), onNext(540, 8), onCompleted(550));
    });
    test('Throttle_TimeSpan_AllPass_ErrorEnd', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(200, 2), onNext(250, 3), onNext(300, 4), onNext(350, 5), onNext(400, 6), onNext(450, 7), onNext(500, 8), onError(550, ex));
        results = scheduler.startWithCreate(function () {
            return xs.throttle(40, scheduler);
        });
        return results.messages.assertEqual(onNext(290, 3), onNext(340, 4), onNext(390, 5), onNext(440, 6), onNext(490, 7), onNext(540, 8), onError(550, ex));
    });
    test('Throttle_TimeSpan_AllDrop', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(200, 2), onNext(250, 3), onNext(300, 4), onNext(350, 5), onNext(400, 6), onNext(450, 7), onNext(500, 8), onCompleted(550));
        results = scheduler.startWithCreate(function () {
            return xs.throttle(60, scheduler);
        });
        return results.messages.assertEqual(onNext(550, 8), onCompleted(550));
    });
    test('Throttle_TimeSpan_AllDrop_ErrorEnd', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(200, 2), onNext(250, 3), onNext(300, 4), onNext(350, 5), onNext(400, 6), onNext(450, 7), onNext(500, 8), onError(550, ex));
        results = scheduler.startWithCreate(function () {
            return xs.throttle(60, scheduler);
        });
        return results.messages.assertEqual(onError(550, ex));
    });
    test('Throttle_TimeSpan_SomeDrop', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(370, 4), onNext(421, 5), onNext(480, 6), onNext(490, 7), onNext(500, 8), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.throttle(50, scheduler);
        });
        return results.messages.assertEqual(onNext(300, 2), onNext(420, 4), onNext(471, 5), onNext(550, 8), onCompleted(600));
    });
    test('Throttle_Empty', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.empty(scheduler).throttle(10, scheduler);
        });
        results.messages.assertEqual(onCompleted(201));
    });
    test('Throttle_Error', function () {
        var ex, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.throwException(ex, scheduler).throttle(10, scheduler);
        });
        results.messages.assertEqual(onError(201, ex));
    });
    test('Throttle_Never', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.never().throttle(10, scheduler);
        });
        results.messages.assertEqual();
    });
    test('Throttle_Duration_DelayBehavior', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(
            onNext(150, -1), 
            onNext(250, 0), 
            onNext(280, 1), 
            onNext(310, 2), 
            onNext(350, 3), 
            onNext(400, 4), 
            onCompleted(550)
        );
        ys = [
            scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)), 
            scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)), 
            scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)), 
            scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)), 
            scheduler.createColdObservable(onNext(20, 42), onNext(25, 99))
        ];
        
        results = scheduler.startWithCreate(function () {
            return xs.throttleWithSelector((function (x) {
                return ys[x];
            }));
        });
        results.messages.assertEqual(
            onNext(250 + 20, 0), 
            onNext(280 + 20, 1), 
            onNext(310 + 20, 2), 
            onNext(350 + 20, 3), 
            onNext(400 + 20, 4), 
            onCompleted(550)
        );

        xs.subscriptions.assertEqual(subscribe(200, 550));
        ys[0].subscriptions.assertEqual(subscribe(250, 250 + 20));
        ys[1].subscriptions.assertEqual(subscribe(280, 280 + 20));
        ys[2].subscriptions.assertEqual(subscribe(310, 310 + 20));
        ys[3].subscriptions.assertEqual(subscribe(350, 350 + 20));
        ys[4].subscriptions.assertEqual(subscribe(400, 400 + 20));
    });
    test('Throttle_Duration_ThrottleBehavior', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, -1), onNext(250, 0), onNext(280, 1), onNext(310, 2), onNext(350, 3), onNext(400, 4), onCompleted(550));
        ys = [scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)), scheduler.createColdObservable(onNext(40, 42), onNext(45, 99)), scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)), scheduler.createColdObservable(onNext(60, 42), onNext(65, 99)), scheduler.createColdObservable(onNext(20, 42), onNext(25, 99))];
        results = scheduler.startWithCreate(function () {
            return xs.throttleWithSelector(function (x) {
                return ys[x];
            });
        });
        results.messages.assertEqual(onNext(250 + 20, 0), onNext(310 + 20, 2), onNext(400 + 20, 4), onCompleted(550));
        xs.subscriptions.assertEqual(subscribe(200, 550));
        ys[0].subscriptions.assertEqual(subscribe(250, 250 + 20));
        ys[1].subscriptions.assertEqual(subscribe(280, 310));
        ys[2].subscriptions.assertEqual(subscribe(310, 310 + 20));
        ys[3].subscriptions.assertEqual(subscribe(350, 400));
        ys[4].subscriptions.assertEqual(subscribe(400, 400 + 20));
    });
    test('Throttle_Duration_EarlyCompletion', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, -1), onNext(250, 0), onNext(280, 1), onNext(310, 2), onNext(350, 3), onNext(400, 4), onCompleted(410));
        ys = [scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)), scheduler.createColdObservable(onNext(40, 42), onNext(45, 99)), scheduler.createColdObservable(onNext(20, 42), onNext(25, 99)), scheduler.createColdObservable(onNext(60, 42), onNext(65, 99)), scheduler.createColdObservable(onNext(20, 42), onNext(25, 99))];
        results = scheduler.startWithCreate(function () {
            return xs.throttleWithSelector(function (x) {
                return ys[x];
            });
        });
        results.messages.assertEqual(onNext(250 + 20, 0), onNext(310 + 20, 2), onNext(410, 4), onCompleted(410));
        xs.subscriptions.assertEqual(subscribe(200, 410));
        ys[0].subscriptions.assertEqual(subscribe(250, 250 + 20));
        ys[1].subscriptions.assertEqual(subscribe(280, 310));
        ys[2].subscriptions.assertEqual(subscribe(310, 310 + 20));
        ys[3].subscriptions.assertEqual(subscribe(350, 400));
        ys[4].subscriptions.assertEqual(subscribe(400, 410));
    });

    test('Throttle_Duration_InnerError', function () {
        var ex, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
        ex = 'ex';
        results = scheduler.startWithCreate(function () {
            return xs.throttleWithSelector(function (x) {
                if (x < 4) {
                    return scheduler.createColdObservable(onNext(x * 10, "Ignore"), onNext(x * 10 + 5, "Aargh!"));
                } else {
                    return scheduler.createColdObservable(onError(x * 10, ex));
                }
            });
        });
        results.messages.assertEqual(onNext(250 + 2 * 10, 2), onNext(350 + 3 * 10, 3), onError(450 + 4 * 10, ex));
        xs.subscriptions.assertEqual(subscribe(200, 490));
    });
    test('Throttle_Duration_OuterError', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onError(460, ex));
        results = scheduler.startWithCreate(function () {
            return xs.throttleWithSelector(function (x) {
                return scheduler.createColdObservable(onNext(x * 10, "Ignore"), onNext(x * 10 + 5, "Aargh!"));
            });
        });
        results.messages.assertEqual(onNext(250 + 2 * 10, 2), onNext(350 + 3 * 10, 3), onError(460, ex));
        xs.subscriptions.assertEqual(subscribe(200, 460));
    });
    test('Throttle_Duration_SelectorThrows', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
        results = scheduler.startWithCreate(function () {
            return xs.throttleWithSelector(function (x) {
                if (x < 4) {
                    return scheduler.createColdObservable(onNext(x * 10, "Ignore"), onNext(x * 10 + 5, "Aargh!"));
                } else {
                    throw ex;
                }
            });
        });
        results.messages.assertEqual(onNext(250 + 2 * 10, 2), onNext(350 + 3 * 10, 3), onError(450, ex));
        xs.subscriptions.assertEqual(subscribe(200, 450));
    });
    test('Throttle_Duration_InnerDone_DelayBehavior', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
        results = scheduler.startWithCreate(function () {
            return xs.throttleWithSelector(function (x) {
                return scheduler.createColdObservable(onCompleted(x * 10));
            });
        });
        results.messages.assertEqual(onNext(250 + 2 * 10, 2), onNext(350 + 3 * 10, 3), onNext(450 + 4 * 10, 4), onCompleted(550));
        xs.subscriptions.assertEqual(subscribe(200, 550));
    });
    test('Throttle_Duration_InnerDone_ThrottleBehavior', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(280, 3), onNext(300, 4), onNext(400, 5), onNext(410, 6), onCompleted(550));
        results = scheduler.startWithCreate(function () {
            return xs.throttleWithSelector(function (x) {
                return scheduler.createColdObservable(onCompleted(x * 10));
            });
        });
        results.messages.assertEqual(onNext(250 + 2 * 10, 2), onNext(300 + 4 * 10, 4), onNext(410 + 6 * 10, 6), onCompleted(550));
        xs.subscriptions.assertEqual(subscribe(200, 550));
    });
    test('Window_Time_Basic', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(240, 3), onNext(270, 4), onNext(320, 5), onNext(360, 6), onNext(390, 7), onNext(410, 8), onNext(460, 9), onNext(470, 10), onCompleted(490));
        results = scheduler.startWithCreate(function () {
            return xs.windowWithTime(100, scheduler).select(function (ys, i) {
                return ys.select(function (y) {
                    return i + ' ' + y;
                }).concat(Rx.Observable.returnValue(i + ' end'));
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(210, "0 2"), onNext(240, "0 3"), onNext(270, "0 4"), onNext(300, "0 end"), onNext(320, "1 5"), onNext(360, "1 6"), onNext(390, "1 7"), onNext(400, "1 end"), onNext(410, "2 8"), onNext(460, "2 9"), onNext(470, "2 10"), onNext(490, "2 end"), onCompleted(490));
        xs.subscriptions.assertEqual(subscribe(200, 490));
    });
    test('Window_Time_Basic_Both', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(240, 3), onNext(270, 4), onNext(320, 5), onNext(360, 6), onNext(390, 7), onNext(410, 8), onNext(460, 9), onNext(470, 10), onCompleted(490));
        results = scheduler.startWithCreate(function () {
            return xs.windowWithTime(100, 50, scheduler).select(function (ys, i) {
                return ys.select(function (y) {
                    return i + " " + y;
                }).concat(Rx.Observable.returnValue(i + " end"));
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(210, "0 2"), onNext(240, "0 3"), onNext(270, "0 4"), onNext(270, "1 4"), onNext(300, "0 end"), onNext(320, "1 5"), onNext(320, "2 5"), onNext(350, "1 end"), onNext(360, "2 6"), onNext(360, "3 6"), onNext(390, "2 7"), onNext(390, "3 7"), onNext(400, "2 end"), onNext(410, "3 8"), onNext(410, "4 8"), onNext(450, "3 end"), onNext(460, "4 9"), onNext(460, "5 9"), onNext(470, "4 10"), onNext(470, "5 10"), onNext(490, "4 end"), onNext(490, "5 end"), onCompleted(490));
        xs.subscriptions.assertEqual(subscribe(200, 490));
    });
    var TimeInterval;
    TimeInterval = (function () {
        function TimeInterval(value, interval) {
            this.value = value;
            this.interval = interval;
        }
        TimeInterval.prototype.toString = function () {
            return this.value + '@' + this.interval;
        };
        TimeInterval.prototype.Equals = function (other) {
            return other.interval === this.interval && other.value === this.value;
        };
        return TimeInterval;
    })();
    test('TimeInterval_Regular', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(230, 3), onNext(260, 4), onNext(300, 5), onNext(350, 6), onCompleted(400));
        results = scheduler.startWithCreate(function () {
            return xs.timeInterval(scheduler).select(function (x) {
                return new TimeInterval(x.value, x.interval);
            });
        });
        results.messages.assertEqual(onNext(210, new TimeInterval(2, 10)), onNext(230, new TimeInterval(3, 20)), onNext(260, new TimeInterval(4, 30)), onNext(300, new TimeInterval(5, 40)), onNext(350, new TimeInterval(6, 50)), onCompleted(400));
    });
    test('TimeInterval_Empty', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.empty(scheduler).timeInterval(scheduler);
        });
        results.messages.assertEqual(onCompleted(201));
    });
    test('TimeInterval_Error', function () {
        var ex, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.throwException(ex, scheduler).timeInterval(scheduler);
        });
        results.messages.assertEqual(onError(201, ex));
    });
    test('TimeInterval_Never', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.never().timeInterval(scheduler);
        });
        results.messages.assertEqual();
    });
    var Timestamp;
    Timestamp = (function () {
        function Timestamp(value, timestamp) {
            this.value = value;
            this.Timestamp = timestamp;
        }
        Timestamp.prototype.toString = function () {
            return this.value + '@' + this.Timestamp;
        };
        Timestamp.prototype.Equals = function (other) {
            return other.Timestamp === this.Timestamp && other.value === this.value;
        };
        return Timestamp;
    })();
    test('Timestamp_Regular', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(230, 3), onNext(260, 4), onNext(300, 5), onNext(350, 6), onCompleted(400));
        results = scheduler.startWithCreate(function () {
            return xs.timestamp(scheduler).select(function (x) {
                return new Timestamp(x.value, x.timestamp);
            });
        });
        results.messages.assertEqual(onNext(210, new Timestamp(2, 210)), onNext(230, new Timestamp(3, 230)), onNext(260, new Timestamp(4, 260)), onNext(300, new Timestamp(5, 300)), onNext(350, new Timestamp(6, 350)), onCompleted(400));
    });
    test('Timestamp_Empty', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.empty(scheduler).timeInterval(scheduler);
        });
        results.messages.assertEqual(onCompleted(201));
    });
    test('Timestamp_Error', function () {
        var ex, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.throwException(ex, scheduler).timeInterval(scheduler);
        });
        results.messages.assertEqual(onError(201, ex));
    });
    test('Timestamp_Never', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.never().timeInterval(scheduler);
        });
        results.messages.assertEqual();
    });
    test('Sample_Regular', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(230, 3), onNext(260, 4), onNext(300, 5), onNext(350, 6), onNext(380, 7), onCompleted(390));
        results = scheduler.startWithCreate(function () {
            return xs.sample(50, scheduler);
        });
        results.messages.assertEqual(onNext(250, 3), onNext(300, 5), onNext(350, 6), onNext(400, 7), onCompleted(400));
    });
    test('Sample_ErrorInFlight', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(230, 3), onNext(260, 4), onNext(300, 5), onNext(310, 6), onError(330, ex));
        results = scheduler.startWithCreate(function () {
            return xs.sample(50, scheduler);
        });
        results.messages.assertEqual(onNext(250, 3), onNext(300, 5), onError(330, ex));
    });
    test('Sample_Empty', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.empty(scheduler).sample(0, scheduler);
        });
        results.messages.assertEqual(onCompleted(201));
    });
    test('Sample_Error', function () {
        var ex, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.throwException(ex, scheduler).sample(0, scheduler);
        });
        results.messages.assertEqual(onError(201, ex));
    });
    test('Sample_Never', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.never().sample(0, scheduler);
        });
        results.messages.assertEqual();
    });
    test('Timeout_InTime', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(230, 3), onNext(260, 4), onNext(300, 5), onNext(350, 6), onCompleted(400));
        results = scheduler.startWithCreate(function () {
            return xs.timeout(500, undefined, scheduler);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(230, 3), onNext(260, 4), onNext(300, 5), onNext(350, 6), onCompleted(400));
    });
    test('Timeout_OutOfTime', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(230, 3), onNext(260, 4), onNext(300, 5), onNext(350, 6), onCompleted(400));
        results = scheduler.startWithCreate(function () {
            return xs.timeout(205, scheduler);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(230, 3), onNext(260, 4), onNext(300, 5), onNext(350, 6), onCompleted(400));
    });
    test('Timeout_TimeoutOccurs_1', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 1), onNext(130, 2), onNext(310, 3), onNext(400, 4), onCompleted(500));
        ys = scheduler.createColdObservable(onNext(50, -1), onNext(200, -2), onNext(310, -3), onCompleted(320));
        results = scheduler.startWithCreate(function () {
            return xs.timeout(100, ys, scheduler);
        });
        results.messages.assertEqual(onNext(350, -1), onNext(500, -2), onNext(610, -3), onCompleted(620));
        xs.subscriptions.assertEqual(subscribe(200, 300));
        ys.subscriptions.assertEqual(subscribe(300, 620));
    });
    test('Timeout_TimeoutOccurs_2', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 1), onNext(130, 2), onNext(240, 3), onNext(310, 4), onNext(430, 5), onCompleted(500));
        ys = scheduler.createColdObservable(onNext(50, -1), onNext(200, -2), onNext(310, -3), onCompleted(320));
        results = scheduler.startWithCreate(function () {
            return xs.timeout(100, ys, scheduler);
        });
        results.messages.assertEqual(onNext(240, 3), onNext(310, 4), onNext(460, -1), onNext(610, -2), onNext(720, -3), onCompleted(730));
        xs.subscriptions.assertEqual(subscribe(200, 410));
        ys.subscriptions.assertEqual(subscribe(410, 730));
    });
    test('Timeout_TimeoutOccurs_Never', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 1), onNext(130, 2), onNext(240, 3), onNext(310, 4), onNext(430, 5), onCompleted(500));
        ys = scheduler.createColdObservable();
        results = scheduler.startWithCreate(function () {
            return xs.timeout(100, ys, scheduler);
        });
        results.messages.assertEqual(onNext(240, 3), onNext(310, 4));
        xs.subscriptions.assertEqual(subscribe(200, 410));
        ys.subscriptions.assertEqual(subscribe(410, 1000));
    });
    test('Timeout_TimeoutOccurs_Completed', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onCompleted(500));
        ys = scheduler.createColdObservable(onNext(100, -1));
        results = scheduler.startWithCreate(function () {
            return xs.timeout(100, ys, scheduler);
        });
        results.messages.assertEqual(onNext(400, -1));
        xs.subscriptions.assertEqual(subscribe(200, 300));
        ys.subscriptions.assertEqual(subscribe(300, 1000));
    });
    test('Timeout_TimeoutOccurs_Error', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onError(500, 'ex'));
        ys = scheduler.createColdObservable(onNext(100, -1));
        results = scheduler.startWithCreate(function () {
            return xs.timeout(100, ys, scheduler);
        });
        results.messages.assertEqual(onNext(400, -1));
        xs.subscriptions.assertEqual(subscribe(200, 300));
        ys.subscriptions.assertEqual(subscribe(300, 1000));
    });
    test('Timeout_TimeoutNotOccurs_Completed', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onCompleted(250));
        ys = scheduler.createColdObservable(onNext(100, -1));
        results = scheduler.startWithCreate(function () {
            return xs.timeout(100, ys, scheduler);
        });
        results.messages.assertEqual(onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
        ys.subscriptions.assertEqual();
    });
    test('Timeout_TimeoutNotOccurs_Error', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onError(250, ex));
        ys = scheduler.createColdObservable(onNext(100, -1));
        results = scheduler.startWithCreate(function () {
            return xs.timeout(100, ys, scheduler);
        });
        results.messages.assertEqual(onError(250, ex));
        xs.subscriptions.assertEqual(subscribe(200, 250));
        ys.subscriptions.assertEqual();
    });
    test('Timeout_TimeoutDoesNotOccur', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(70, 1), onNext(130, 2), onNext(240, 3), onNext(320, 4), onNext(410, 5), onCompleted(500));
        ys = scheduler.createColdObservable(onNext(50, -1), onNext(200, -2), onNext(310, -3), onCompleted(320));
        results = scheduler.startWithCreate(function () {
            return xs.timeout(100, ys, scheduler);
        });
        results.messages.assertEqual(onNext(240, 3), onNext(320, 4), onNext(410, 5), onCompleted(500));
        xs.subscriptions.assertEqual(subscribe(200, 500));
        ys.subscriptions.assertEqual();
    });
    test('Timeout_DateTimeOffset_TimeoutOccurs', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(410, 1));
        ys = scheduler.createColdObservable(onNext(100, -1));
        results = scheduler.startWithCreate(function () {
            return xs.timeout(new Date(400), ys, scheduler);
        });
        results.messages.assertEqual(onNext(500, -1));
        xs.subscriptions.assertEqual(subscribe(200, 400));
        ys.subscriptions.assertEqual(subscribe(400, 1000));
    });
    test('Timeout_DateTimeOffset_TimeoutDoesNotOccur_Completed', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(310, 1), onCompleted(390));
        ys = scheduler.createColdObservable(onNext(100, -1));
        results = scheduler.startWithCreate(function () {
            return xs.timeout(new Date(400), ys, scheduler);
        });
        results.messages.assertEqual(onNext(310, 1), onCompleted(390));
        xs.subscriptions.assertEqual(subscribe(200, 390));
        ys.subscriptions.assertEqual();
    });
    test('Timeout_DateTimeOffset_TimeoutDoesNotOccur_Error', function () {
        var ex, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(310, 1), onError(390, ex));
        ys = scheduler.createColdObservable(onNext(100, -1));
        results = scheduler.startWithCreate(function () {
            return xs.timeout(new Date(400), ys, scheduler);
        });
        results.messages.assertEqual(onNext(310, 1), onError(390, ex));
        xs.subscriptions.assertEqual(subscribe(200, 390));
        ys.subscriptions.assertEqual();
    });
    test('Timeout_DateTimeOffset_TimeoutOccur_2', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
        ys = scheduler.createColdObservable(onNext(100, -1));
        results = scheduler.startWithCreate(function () {
            return xs.timeout(new Date(400), ys, scheduler);
        });
        results.messages.assertEqual(onNext(310, 1), onNext(350, 2), onNext(500, -1));
        xs.subscriptions.assertEqual(subscribe(200, 400));
        ys.subscriptions.assertEqual(subscribe(400, 1000));
    });
    test('Timeout_DateTimeOffset_TimeoutOccur_3', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
        ys = scheduler.createColdObservable();
        results = scheduler.startWithCreate(function () {
            return xs.timeout(new Date(400), ys, scheduler);
        });
        results.messages.assertEqual(onNext(310, 1), onNext(350, 2));
        xs.subscriptions.assertEqual(subscribe(200, 400));
        ys.subscriptions.assertEqual(subscribe(400, 1000));
    });
    test('Timeout_Duration_Simple_Never', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
        ys = scheduler.createColdObservable();
        results = scheduler.startWithCreate(function () {
            return xs.timeoutWithSelector(ys, function () {
                return ys;
            });
        });
        results.messages.assertEqual(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
        xs.subscriptions.assertEqual(subscribe(200, 450));
        ys.subscriptions.assertEqual(subscribe(200, 310), subscribe(310, 350), subscribe(350, 420), subscribe(420, 450));
    });
    test('Timeout_Duration_Simple_TimeoutFirst', function () {
        var results, scheduler, xs, ys, zs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
        ys = scheduler.createColdObservable(onNext(100, 'boo!'));
        zs = scheduler.createColdObservable();
        results = scheduler.startWithCreate(function () {
            return xs.timeoutWithSelector(ys, function () {
                return zs;
            });
        });
        equal(1, results.messages.length);
        ok(results.messages[0].time === 300 && results.messages[0].value.exception !== null);
        xs.subscriptions.assertEqual(subscribe(200, 300));
        ys.subscriptions.assertEqual(subscribe(200, 300));
        zs.subscriptions.assertEqual();
    });
    test('Timeout_Duration_Simple_TimeoutLater', function () {
        var results, scheduler, xs, ys, zs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
        ys = scheduler.createColdObservable();
        zs = scheduler.createColdObservable(onNext(50, 'boo!'));
        results = scheduler.startWithCreate(function () {
            return xs.timeoutWithSelector(ys, function () {
                return zs;
            });
        });
        equal(3, results.messages.length);
        ok(onNext(310, 1).equals(results.messages[0]));
        ok(onNext(350, 2).equals(results.messages[1]));
        ok(results.messages[2].time === 400 && results.messages[2].value.exception !== null);
        xs.subscriptions.assertEqual(subscribe(200, 400));
        ys.subscriptions.assertEqual(subscribe(200, 310));
        zs.subscriptions.assertEqual(subscribe(310, 350), subscribe(350, 400));
    });
    test('Timeout_Duration_Simple_TimeoutByCompletion', function () {
        var results, scheduler, xs, ys, zs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
        ys = scheduler.createColdObservable();
        zs = scheduler.createColdObservable(onCompleted(50));
        results = scheduler.startWithCreate(function () {
            return xs.timeoutWithSelector(ys, function () {
                return zs;
            });
        });
        equal(3, results.messages.length);
        ok(onNext(310, 1).equals(results.messages[0]));
        ok(onNext(350, 2).equals(results.messages[1]));
        ok(results.messages[2].time === 400 && results.messages[2].value.exception !== null);
        xs.subscriptions.assertEqual(subscribe(200, 400));
        ys.subscriptions.assertEqual(subscribe(200, 310));
        zs.subscriptions.assertEqual(subscribe(310, 350), subscribe(350, 400));
    });
    test('Timeout_Duration_Simple_TimeoutByCompletion', function () {
        var ex, results, scheduler, xs, ys, zs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
        ys = scheduler.createColdObservable();
        zs = scheduler.createColdObservable();
        results = scheduler.startWithCreate(function () {
            return xs.timeoutWithSelector(ys, function (x) {
                if (x < 3) {
                    return zs;
                } else {
                    throw ex;
                }
            });
        });
        results.messages.assertEqual(onNext(310, 1), onNext(350, 2), onNext(420, 3), onError(420, ex));
        xs.subscriptions.assertEqual(subscribe(200, 420));
        ys.subscriptions.assertEqual(subscribe(200, 310));
        zs.subscriptions.assertEqual(subscribe(310, 350), subscribe(350, 420));
    });
    test('Timeout_Duration_Simple_InnerThrows', function () {
        var ex, results, scheduler, xs, ys, zs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
        ys = scheduler.createColdObservable();
        zs = scheduler.createColdObservable(onError(50, ex));
        results = scheduler.startWithCreate(function () {
            return xs.timeoutWithSelector(ys, function () {
                return zs;
            });
        });
        results.messages.assertEqual(onNext(310, 1), onNext(350, 2), onError(400, ex));
        xs.subscriptions.assertEqual(subscribe(200, 400));
        ys.subscriptions.assertEqual(subscribe(200, 310));
        zs.subscriptions.assertEqual(subscribe(310, 350), subscribe(350, 400));
    });
    test('Timeout_Duration_Simple_FirstThrows', function () {
        var ex, results, scheduler, xs, ys, zs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onCompleted(450));
        ys = scheduler.createColdObservable(onError(50, ex));
        zs = scheduler.createColdObservable();
        results = scheduler.startWithCreate(function () {
            return xs.timeoutWithSelector(ys, function () {
                return zs;
            });
        });
        results.messages.assertEqual(onError(250, ex));
        xs.subscriptions.assertEqual(subscribe(200, 250));
        ys.subscriptions.assertEqual(subscribe(200, 250));
        zs.subscriptions.assertEqual();
    });
    test('Timeout_Duration_Simple_SourceThrows', function () {
        var ex, results, scheduler, xs, ys, zs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(310, 1), onNext(350, 2), onNext(420, 3), onError(450, ex));
        ys = scheduler.createColdObservable();
        zs = scheduler.createColdObservable();
        results = scheduler.startWithCreate(function () {
            return xs.timeoutWithSelector(ys, function () {
                return zs;
            });
        });
        results.messages.assertEqual(onNext(310, 1), onNext(350, 2), onNext(420, 3), onError(450, ex));
        xs.subscriptions.assertEqual(subscribe(200, 450));
        ys.subscriptions.assertEqual(subscribe(200, 310));
        zs.subscriptions.assertEqual(subscribe(310, 350), subscribe(350, 420), subscribe(420, 450));
    });
    test('Generate_TimeSpan_Finite', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.generateWithRelativeTime(0, function (x) {
                return x <= 3;
            }, function (x) {
                return x + 1;
            }, function (x) {
                return x;
            }, function (x) {
                return x + 1;
            }, scheduler);
        });
        results.messages.assertEqual(onNext(202, 0), onNext(204, 1), onNext(207, 2), onNext(211, 3), onCompleted(211));
    });
    test('Generate_TimeSpan_Throw_Condition', function () {
        var ex, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.generateWithRelativeTime(0, function (x) {
                throw ex;
            }, function (x) {
                return x + 1;
            }, function (x) {
                return x;
            }, function (x) {
                return x + 1;
            }, scheduler);
        });
        results.messages.assertEqual(onError(201, ex));
    });
    test('Generate_TimeSpan_Throw_ResultSelector', function () {
        var ex, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.generateWithRelativeTime(0, function (x) {
                return true;
            }, function (x) {
                return x + 1;
            }, function (x) {
                throw ex;
            }, function (x) {
                return x + 1;
            }, scheduler);
        });
        results.messages.assertEqual(onError(201, ex));
    });
    test('Generate_TimeSpan_Throw_Iterate', function () {
        var ex, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.generateWithRelativeTime(0, function (x) {
                return true;
            }, function (x) {
                throw ex;
            }, function (x) {
                return x;
            }, function (x) {
                return x + 1;
            }, scheduler);
        });
        results.messages.assertEqual(onNext(202, 0), onError(202, ex));
    });
    test('Generate_TimeSpan_Throw_TimeSelector', function () {
        var ex, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.generateWithRelativeTime(0, function (x) {
                return true;
            }, function (x) {
                return x + 1;
            }, function (x) {
                return x;
            }, function (x) {
                throw ex;
            }, scheduler);
        });
        results.messages.assertEqual(onError(201, ex));
    });
    test('Generate_TimeSpan_Dispose', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithDispose(function () {
            return Rx.Observable.generateWithRelativeTime(0, function (x) {
                return true;
            }, function (x) {
                return x + 1;
            }, function (x) {
                return x;
            }, function (x) {
                return x + 1;
            }, scheduler);
        }, 210);
        results.messages.assertEqual(onNext(202, 0), onNext(204, 1), onNext(207, 2));
    });
    test('Generate_DateTimeOffset_Finite', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.generateWithAbsoluteTime(0, function (x) {
                return x <= 3;
            }, function (x) {
                return x + 1;
            }, function (x) {
                return x;
            }, function (x) {
                return scheduler.now() + x + 1;
            }, scheduler);
        });
        results.messages.assertEqual(onNext(202, 0), onNext(204, 1), onNext(207, 2), onNext(211, 3), onCompleted(211));
    });
    test('Generate_DateTimeOffset_Throw_Condition', function () {
        var ex, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.generateWithAbsoluteTime(0, function (x) {
                throw ex;
            }, function (x) {
                return x + 1;
            }, function (x) {
                return x;
            }, function (x) {
                return scheduler.now() + x + 1;
            }, scheduler);
        });
        results.messages.assertEqual(onError(201, ex));
    });
    test('Generate_DateTimeOffset_Throw_ResultSelector', function () {
        var ex, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.generateWithAbsoluteTime(0, function (x) {
                return true;
            }, function (x) {
                return x + 1;
            }, function (x) {
                throw ex;
            }, function (x) {
                return scheduler.now() + x + 1;
            }, scheduler);
        });
        results.messages.assertEqual(onError(201, ex));
    });
    test('Generate_DateTimeOffset_Throw_Iterate', function () {
        var ex, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.generateWithAbsoluteTime(0, function (x) {
                return true;
            }, function (x) {
                throw ex;
            }, function (x) {
                return x;
            }, function (x) {
                return scheduler.now() + x + 1;
            }, scheduler);
        });
        results.messages.assertEqual(onNext(202, 0), onError(202, ex));
    });
    test('Generate_DateTimeOffset_Throw_TimeSelector', function () {
        var ex, results, scheduler;
        ex = 'ex';
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.generateWithAbsoluteTime(0, function (x) {
                return true;
            }, function (x) {
                return x + 1;
            }, function (x) {
                return x;
            }, function (x) {
                throw ex;
            }, scheduler);
        });
        results.messages.assertEqual(onError(201, ex));
    });
    test('Generate_DateTimeOffset_Dispose', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithDispose(function () {
            return Rx.Observable.generateWithAbsoluteTime(0, function (x) {
                return true;
            }, function (x) {
                return x + 1;
            }, function (x) {
                return x;
            }, function (x) {
                return scheduler.now() + x + 1;
            }, scheduler);
        }, 210);
        results.messages.assertEqual(onNext(202, 0), onNext(204, 1), onNext(207, 2));
    });
    test('WindowWithTime_Basic', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.windowWithTime(100, 70, scheduler).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + " " + x.toString();
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(210, "0 2"), onNext(240, "0 3"), onNext(280, "0 4"), onNext(280, "1 4"), onNext(320, "1 5"), onNext(350, "1 6"), onNext(350, "2 6"), onNext(380, "2 7"), onNext(420, "2 8"), onNext(420, "3 8"), onNext(470, "3 9"), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('WindowWithTime_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onError(600, ex));
        results = scheduler.startWithCreate(function () {
            return xs.windowWithTime(100, 70, scheduler).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + " " + x.toString();
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(210, "0 2"), onNext(240, "0 3"), onNext(280, "0 4"), onNext(280, "1 4"), onNext(320, "1 5"), onNext(350, "1 6"), onNext(350, "2 6"), onNext(380, "2 7"), onNext(420, "2 8"), onNext(420, "3 8"), onNext(470, "3 9"), onError(600, ex));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('WindowWithTime_Disposed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
        results = scheduler.startWithDispose(function () {
            return xs.windowWithTime(100, 70, scheduler).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + " " + x.toString();
                });
            }).mergeObservable();
        }, 370);
        results.messages.assertEqual(onNext(210, "0 2"), onNext(240, "0 3"), onNext(280, "0 4"), onNext(280, "1 4"), onNext(320, "1 5"), onNext(350, "1 6"), onNext(350, "2 6"));
        xs.subscriptions.assertEqual(subscribe(200, 370));
    });
    test('WindowWithTime_Basic_Same', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.windowWithTime(100, scheduler).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + " " + x.toString();
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(210, "0 2"), onNext(240, "0 3"), onNext(280, "0 4"), onNext(320, "1 5"), onNext(350, "1 6"), onNext(380, "1 7"), onNext(420, "2 8"), onNext(470, "2 9"), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('BufferWithTime_Basic', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.bufferWithTime(100, 70, scheduler).select(function (x) {
                return x.toString();
            });
        });
        results.messages.assertEqual(onNext(300, "2,3,4"), onNext(370, "4,5,6"), onNext(440, "6,7,8"), onNext(510, "8,9"), onNext(580, ""), onNext(600, ""), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('BufferWithTime_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onError(600, ex));
        results = scheduler.startWithCreate(function () {
            return xs.bufferWithTime(100, 70, scheduler).select(function (x) {
                return x.toString();
            });
        });
        results.messages.assertEqual(onNext(300, "2,3,4"), onNext(370, "4,5,6"), onNext(440, "6,7,8"), onNext(510, "8,9"), onNext(580, ""), onError(600, ex));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('BufferWithTime_Disposed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
        results = scheduler.startWithDispose(function () {
            return xs.bufferWithTime(100, 70, scheduler).select(function (x) {
                return x.toString();
            });
        }, 370);
        results.messages.assertEqual(onNext(300, "2,3,4"));
        xs.subscriptions.assertEqual(subscribe(200, 370));
    });
    test('BufferWithTime_Basic_Same', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.bufferWithTime(100, scheduler).select(function (x) {
                return x.toString();
            });
        });
        results.messages.assertEqual(onNext(300, "2,3,4"), onNext(400, "5,6,7"), onNext(500, "8,9"), onNext(600, ""), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });

    // Delay with selector
    test('Delay_Duration_Simple1', function () {
        var results, xs, scheduler;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 10), onNext(220, 30), onNext(230, 50), onNext(240, 35), onNext(250, 20), onCompleted(260));
        results = scheduler.startWithCreate(function () {
            return xs.delayWithSelector(function (x) {
                return scheduler.createColdObservable(onNext(x, '!'));
            });
        });
        results.messages.assertEqual(onNext(210 + 10, 10), onNext(220 + 30, 30), onNext(250 + 20, 20), onNext(240 + 35, 35), onNext(230 + 50, 50), onCompleted(280));
        xs.subscriptions.assertEqual(subscribe(200, 260));
    });
    test('Delay_Duration_Simple2', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onNext(250, 6), onCompleted(300));
        ys = scheduler.createColdObservable(onNext(10, '!'));
        results = scheduler.startWithCreate(function () {
            return xs.delayWithSelector(function () {
                return ys;
            });
        });
        results.messages.assertEqual(onNext(210 + 10, 2), onNext(220 + 10, 3), onNext(230 + 10, 4), onNext(240 + 10, 5), onNext(250 + 10, 6), onCompleted(300));
        xs.subscriptions.assertEqual(subscribe(200, 300));
        ys.subscriptions.assertEqual(subscribe(210, 220), subscribe(220, 230), subscribe(230, 240), subscribe(240, 250), subscribe(250, 260));
    });
    test('Delay_Duration_Simple3', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onNext(250, 6), onCompleted(300));
        ys = scheduler.createColdObservable(onNext(100, '!'));
        results = scheduler.startWithCreate(function () {
            return xs.delayWithSelector(function () {
                return ys;
            });
        });
        results.messages.assertEqual(onNext(210 + 100, 2), onNext(220 + 100, 3), onNext(230 + 100, 4), onNext(240 + 100, 5), onNext(250 + 100, 6), onCompleted(350));
        xs.subscriptions.assertEqual(subscribe(200, 300));
        ys.subscriptions.assertEqual(subscribe(210, 310), subscribe(220, 320), subscribe(230, 330), subscribe(240, 340), subscribe(250, 350));
    });
    test('Delay_Duration_Simple4_InnerEmpty', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onNext(250, 6), onCompleted(300));
        ys = scheduler.createColdObservable(onCompleted(100));
        results = scheduler.startWithCreate(function () {
            return xs.delayWithSelector(function () {
                return ys;
            });
        });
        results.messages.assertEqual(onNext(210 + 100, 2), onNext(220 + 100, 3), onNext(230 + 100, 4), onNext(240 + 100, 5), onNext(250 + 100, 6), onCompleted(350));
        xs.subscriptions.assertEqual(subscribe(200, 300));
        ys.subscriptions.assertEqual(subscribe(210, 310), subscribe(220, 320), subscribe(230, 330), subscribe(240, 340), subscribe(250, 350));
    });
    test('Delay_Duration_Dispose1', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onNext(250, 6), onCompleted(300));
        ys = scheduler.createColdObservable(onNext(200, '!'));
        results = scheduler.startWithDispose(function () {
            return xs.delayWithSelector(function () {
                return ys;
            });
        }, 425);
        results.messages.assertEqual(onNext(210 + 200, 2), onNext(220 + 200, 3));
        xs.subscriptions.assertEqual(subscribe(200, 300));
        ys.subscriptions.assertEqual(subscribe(210, 410), subscribe(220, 420), subscribe(230, 425), subscribe(240, 425), subscribe(250, 425));
    });
    test('Delay_Duration_Dispose2', function () {
        var results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(400, 3), onCompleted(500));
        ys = scheduler.createColdObservable(onNext(50, '!'));
        results = scheduler.startWithDispose(function () {
            return xs.delayWithSelector(function () {
                return ys;
            });
        }, 300);
        results.messages.assertEqual(onNext(210 + 50, 2));
        xs.subscriptions.assertEqual(subscribe(200, 300));
        ys.subscriptions.assertEqual(subscribe(210, 260));
    });

    // TakeLastBuffer
    test('takeLastBufferWithTime_Zero1', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBufferWithTime(0, scheduler);
        });
        res.messages.assertEqual(onNext(230, function (lst) {
            return lst.length === 0;
        }), onCompleted(230));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('takeLastBufferWithTime_Zero2', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBufferWithTime(0, scheduler);
        });
        res.messages.assertEqual(onNext(230, function (lst) {
            return lst.length === 0;
        }), onCompleted(230));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });

    function arrayEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (var i = 0, len = arr1.length; i < len; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    test('takeLastBufferWithTime_Some1', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(240));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBufferWithTime(25, scheduler);
        });
        res.messages.assertEqual(onNext(240, function (lst) {
            return arrayEqual(lst, [2, 3]);
        }), onCompleted(240));
        xs.subscriptions.assertEqual(subscribe(200, 240));
    });
    test('takeLastBufferWithTime_Some2', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(300));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBufferWithTime(25, scheduler);
        });
        res.messages.assertEqual(onNext(300, function (lst) {
            return lst.length === 0;
        }), onCompleted(300));
        xs.subscriptions.assertEqual(subscribe(200, 300));
    });
    test('takeLastBufferWithTime_Some3', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onNext(270, 7), onNext(280, 8), onNext(290, 9), onCompleted(300));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBufferWithTime(45, scheduler);
        });
        res.messages.assertEqual(onNext(300, function (lst) {
            return arrayEqual(lst, [6, 7, 8, 9]);
        }), onCompleted(300));
        xs.subscriptions.assertEqual(subscribe(200, 300));
    });
    test('takeLastBufferWithTime_Some4', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(250, 3), onNext(280, 4), onNext(290, 5), onNext(300, 6), onCompleted(350));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBufferWithTime(25, scheduler);
        });
        res.messages.assertEqual(onNext(350, function (lst) {
            return lst.length === 0;
        }), onCompleted(350));
        xs.subscriptions.assertEqual(subscribe(200, 350));
    });
    test('takeLastBufferWithTime_All', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBufferWithTime(50, scheduler);
        });
        res.messages.assertEqual(onNext(230, function (lst) {
            return arrayEqual(lst, [1, 2]);
        }), onCompleted(230));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('takeLastBufferWithTime_Error', function () {
        var ex, res, scheduler, xs;
        scheduler = new TestScheduler();
        ex = 'ex';
        xs = scheduler.createHotObservable(onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBufferWithTime(50, scheduler);
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });
    test('takeLastBufferWithTime_Never', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable();
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBufferWithTime(50, scheduler);
        });
        res.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('Take_Zero', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.takeWithTime(0, scheduler);
        });
        res.messages.assertEqual(onCompleted(201));
        xs.subscriptions.assertEqual(subscribe(200, 201));
    });
    test('Take_Some', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(240));
        res = scheduler.startWithCreate(function () {
            return xs.takeWithTime(25, scheduler);
        });
        res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onCompleted(225));
        xs.subscriptions.assertEqual(subscribe(200, 225));
    });
    test('Take_Late', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.takeWithTime(50, scheduler);
        });
        res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onCompleted(230));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('Take_Error', function () {
        var ex, res, scheduler, xs;
        scheduler = new TestScheduler();
        ex = 'ex';
        xs = scheduler.createHotObservable(onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.takeWithTime(50, scheduler);
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });
    test('Take_Never', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable();
        res = scheduler.startWithCreate(function () {
            return xs.takeWithTime(50, scheduler);
        });
        res.messages.assertEqual(onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });
    test('Take_Twice1', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
        res = scheduler.startWithCreate(function () {
            return xs.takeWithTime(55, scheduler).takeWithTime(35, scheduler);
        });
        res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(235));
        xs.subscriptions.assertEqual(subscribe(200, 235));
    });
    test('Take_Twice2', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
        res = scheduler.startWithCreate(function () {
            return xs.takeWithTime(35, scheduler).takeWithTime(55, scheduler);
        });
        res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(235));
        xs.subscriptions.assertEqual(subscribe(200, 235));
    });

    // Skip
    test('Skip_Zero', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.skipWithTime(0, scheduler);
        });
        res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onCompleted(230));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('Skip_Some', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.skipWithTime(15, scheduler);
        });
        res.messages.assertEqual(onNext(220, 2), onCompleted(230));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('Skip_Late', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.skipWithTime(50, scheduler);
        });
        res.messages.assertEqual(onCompleted(230));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('Skip_Error', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.skipWithTime(50, scheduler);
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });
    test('Skip_Never', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable();
        res = scheduler.startWithCreate(function () {
            return xs.skipWithTime(50, scheduler);
        });
        res.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('Skip_Twice1', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
        res = scheduler.startWithCreate(function () {
            return xs.skipWithTime(15, scheduler).skipWithTime(30, scheduler);
        });
        res.messages.assertEqual(onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
        xs.subscriptions.assertEqual(subscribe(200, 270));
    });
    test('Skip_Twice2', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
        res = scheduler.startWithCreate(function () {
            return xs.skipWithTime(30, scheduler).skipWithTime(15, scheduler);
        });
        res.messages.assertEqual(onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
        xs.subscriptions.assertEqual(subscribe(200, 270));
    });

    // TakeLast
    test('TakeLast_Zero1', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(0, scheduler);
        });
        res.messages.assertEqual(onCompleted(230));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('TakeLast_Zero1_WithLoopScheduler', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(0, scheduler, scheduler);
        });
        res.messages.assertEqual(onCompleted(231));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('TakeLast_Zero2', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(0, scheduler);
        });
        res.messages.assertEqual(onCompleted(230));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('TakeLast_Zero2_WithLoopScheduler', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(0, scheduler, scheduler);
        });
        res.messages.assertEqual(onCompleted(231));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('TakeLast_Some1', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(240));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(25, scheduler);
        });
        res.messages.assertEqual(onNext(240, 2), onNext(240, 3), onCompleted(240));
        xs.subscriptions.assertEqual(subscribe(200, 240));
    });

    test('TakeLast_Some1_WithLoopScheduler', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(240));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(25, scheduler, scheduler);
        });
        res.messages.assertEqual(onNext(241, 2), onNext(242, 3), onCompleted(243));
        xs.subscriptions.assertEqual(subscribe(200, 240));
    });
    test('TakeLast_Some2', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(300));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(25, scheduler);
        });
        res.messages.assertEqual(onCompleted(300));
        xs.subscriptions.assertEqual(subscribe(200, 300));
    });

    test('TakeLast_Some2_WithLoopScheduler', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(300));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(25, scheduler, scheduler);
        });
        res.messages.assertEqual(onCompleted(301));
        xs.subscriptions.assertEqual(subscribe(200, 300));
    });

    test('TakeLast_Some3', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onNext(270, 7), onNext(280, 8), onNext(290, 9), onCompleted(300));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(45, scheduler);
        });
        res.messages.assertEqual(onNext(300, 6), onNext(300, 7), onNext(300, 8), onNext(300, 9), onCompleted(300));
        xs.subscriptions.assertEqual(subscribe(200, 300));
    });
    test('TakeLast_Some3_WithLoopScheduler', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onNext(270, 7), onNext(280, 8), onNext(290, 9), onCompleted(300));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(45, scheduler, scheduler);
        });
        res.messages.assertEqual(onNext(301, 6), onNext(302, 7), onNext(303, 8), onNext(304, 9), onCompleted(305));
        xs.subscriptions.assertEqual(subscribe(200, 300));
    });
    test('TakeLast_Some4', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(250, 3), onNext(280, 4), onNext(290, 5), onNext(300, 6), onCompleted(350));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(25, scheduler);
        });
        res.messages.assertEqual(onCompleted(350));
        xs.subscriptions.assertEqual(subscribe(200, 350));
    });
    test('TakeLast_Some4_WithLoopScheduler', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(250, 3), onNext(280, 4), onNext(290, 5), onNext(300, 6), onCompleted(350));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(25, scheduler, scheduler);
        });
        res.messages.assertEqual(onCompleted(351));
        xs.subscriptions.assertEqual(subscribe(200, 350));
    });
    test('TakeLast_All', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(50, scheduler);
        });
        res.messages.assertEqual(onNext(230, 1), onNext(230, 2), onCompleted(230));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });

    test('TakeLast_All_WithLoopScheduler', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(50, scheduler, scheduler);
        });
        res.messages.assertEqual(onNext(231, 1), onNext(232, 2), onCompleted(233));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('TakeLast_Error', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(50, scheduler);
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });
    test('TakeLast_Error_WithLoopScheduler', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(50, scheduler, scheduler);
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });
    test('TakeLast_Never', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable();
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(50, scheduler);
        });
        res.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('TakeLast_Never_WithLoopScheduler', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable();
        res = scheduler.startWithCreate(function () {
            return xs.takeLastWithTime(50, scheduler, scheduler);
        });
        res.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });

    // Skiplast
    test('SkipLast_Zero1', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.skipLastWithTime(0, scheduler);
        });
        res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onCompleted(230));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('SkipLast_Zero2', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.skipLastWithTime(0, scheduler);
        });
        res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(230));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('SkipLast_Some1', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.skipLastWithTime(15, scheduler);
        });
        res.messages.assertEqual(onNext(230, 1), onCompleted(230));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('SkipLast_Some2', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onNext(270, 7), onNext(280, 8), onNext(290, 9), onCompleted(300));
        res = scheduler.startWithCreate(function () {
            return xs.skipLastWithTime(45, scheduler);
        });
        res.messages.assertEqual(onNext(260, 1), onNext(270, 2), onNext(280, 3), onNext(290, 4), onNext(300, 5), onCompleted(300));
        xs.subscriptions.assertEqual(subscribe(200, 300));
    });
    test('SkipLast_All', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.skipLastWithTime(45, scheduler);
        });
        res.messages.assertEqual(onCompleted(230));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('SkipLast_Error', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.skipLastWithTime(45, scheduler);
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });
    test('SkipLast_Never', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable();
        res = scheduler.startWithCreate(function () {
            return xs.skipLastWithTime(50, scheduler);
        });
        res.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });

    // SkipUntil
    test('SkipUntil_Zero', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.skipUntilWithTime(new Date(0), scheduler);
        });
        res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onCompleted(230));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('SkipUntil_Late', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.skipUntilWithTime(new Date(250), scheduler);
        });
        res.messages.assertEqual(onCompleted(230));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('SkipUntil_Error', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.skipUntilWithTime(new Date(250), scheduler);
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });
    test('SkipUntil_Never', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable();
        res = scheduler.startWithCreate(function () {
            return xs.skipUntilWithTime(new Date(250), scheduler);
        });
        res.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('SkipUntil_Twice1', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
        res = scheduler.startWithCreate(function () {
            return xs.skipUntilWithTime(new Date(215), scheduler).skipUntilWithTime(new Date(230), scheduler);
        });
        res.messages.assertEqual(onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
        xs.subscriptions.assertEqual(subscribe(200, 270));
    });
    test('SkipUntil_Twice2', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
        res = scheduler.startWithCreate(function () {
            return xs.skipUntilWithTime(new Date(230), scheduler).skipUntilWithTime(new Date(215), scheduler);
        });
        res.messages.assertEqual(onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
        xs.subscriptions.assertEqual(subscribe(200, 270));
    });

    // TakeUntil
    test('TakeUntil_Zero', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.takeUntilWithTime(new Date(0), scheduler);
        });
        res.messages.assertEqual(onCompleted(201));
        xs.subscriptions.assertEqual(subscribe(200, 201));
    });
    test('TakeUntil_Late', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onCompleted(230));
        res = scheduler.startWithCreate(function () {
            return xs.takeUntilWithTime(new Date(250), scheduler);
        });
        res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onCompleted(230));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });
    test('TakeUntil_Error', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.takeUntilWithTime(new Date(250), scheduler);
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('TakeUntil_Never', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable();
        res = scheduler.startWithCreate(function () {
            return xs.takeUntilWithTime(new Date(250), scheduler);
        });
        res.messages.assertEqual(onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });
    test('TakeUntil_Twice1', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
        res = scheduler.startWithCreate(function () {
            return xs.takeUntilWithTime(new Date(255), scheduler).takeUntilWithTime(new Date(235), scheduler);
        });
        res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(235));
        xs.subscriptions.assertEqual(subscribe(200, 235));
    });
    test('TakeUntil_Twice2', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, 1), onNext(220, 2), onNext(230, 3), onNext(240, 4), onNext(250, 5), onNext(260, 6), onCompleted(270));
        res = scheduler.startWithCreate(function () {
            return xs.takeUntilWithTime(new Date(235), scheduler).takeUntilWithTime(new Date(255), scheduler);
        });
        res.messages.assertEqual(onNext(210, 1), onNext(220, 2), onNext(230, 3), onCompleted(235));
        xs.subscriptions.assertEqual(subscribe(200, 235));
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    
}(typeof global == 'object' && global || this));