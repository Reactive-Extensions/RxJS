(function(window) {

    var root = window.Rx;

    QUnit.module('ObservableCreationTest');

    var Observable = root.Observable,
        TestScheduler = root.TestScheduler,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe,
		created = root.ReactiveTest.created,
		subscribed = root.ReactiveTest.subscribed,
		disposed = root.ReactiveTest.disposed;

    var BooleanDisposable = (function () {
        function BooleanDisposable() {
            this.isDisposed = false;
        }
        BooleanDisposable.prototype.dispose = function () {
            return this.isDisposed = true;
        };
        return BooleanDisposable;
    })();

    test('Return_Basic', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.returnValue(42, scheduler);
        });
        results.messages.assertEqual(
						    onNext(201, 42),
						    onCompleted(201));
    });

    test('Return_Disposed', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithDispose(function () {
            return Observable.returnValue(42, scheduler);
        }, 200);
        results.messages.assertEqual();
    });

    test('Return_DisposedAfterNext', function () {
        var d, results, scheduler, xs;
        scheduler = new TestScheduler();
        d = new Rx.SerialDisposable();
        xs = Observable.returnValue(42, scheduler);
        results = scheduler.createObserver();
        scheduler.scheduleAbsolute(100, function () {
            return d.disposable(xs.subscribe(function (x) {
                d.dispose();
                results.onNext(x);
            }, function (e) {
                results.onError(e);
            }, function () {
                results.onCompleted();
            }));
        });
        scheduler.start();
        results.messages.assertEqual(onNext(101, 42));
    });

    test('Return_ObserverThrows', function () {
        var scheduler1, scheduler2, xs, ys;
        scheduler1 = new TestScheduler();
        xs = Observable.returnValue(1, scheduler1);
        xs.subscribe(function (x) {
            throw 'ex';
        });
        raises(function () {
            scheduler1.start();
        });
        scheduler2 = new TestScheduler();
        ys = Observable.returnValue(1, scheduler2);
        ys.subscribe(function (x) {

        }, function (ex) {

        }, function () {
            throw 'ex';
        });
        raises(function () {
            scheduler2.start();
        });
    });

    test('Never_Basic', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = Observable.never();
        results = scheduler.createObserver();
        xs.subscribe(results);
        scheduler.start();
        results.messages.assertEqual();
    });

    test('Throw_Basic', function () {
        var ex, results, scheduler;
        scheduler = new TestScheduler();
        ex = 'ex';
        results = scheduler.startWithCreate(function () {
            return Observable.throwException(ex, scheduler);
        });
        results.messages.assertEqual(onError(201, ex));
    });

    test('Throw_Disposed', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithDispose(function () {
            return Observable.throwException('ex', scheduler);
        }, 200);
        results.messages.assertEqual();
    });

    test('Throw_ObserverThrows', function () {
        var scheduler, xs;
        scheduler = new TestScheduler();
        xs = Observable.throwException('ex', scheduler);
        xs.subscribe(function (x) { }, function (ex) {
            throw 'ex';
        }, function () { });
        raises(function () {
            return scheduler.start();
        });
    });

    test('Empty_Basic', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.empty(scheduler);
        });
        results.messages.assertEqual(onCompleted(201));
    });

    test('Empty_Disposed', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithDispose(function () {
            return Observable.empty(scheduler);
        }, 200);
        results.messages.assertEqual();
    });

    test('Empty_ObserverThrows', function () {
        var scheduler, xs;
        scheduler = new TestScheduler();
        xs = Observable.empty(scheduler);
        xs.subscribe(function (x) { }, function (ex) { }, function () {
            throw 'ex';
        });
        raises(function () {
            return scheduler.start();
        });
    });

    test('SubscribeToEnumerable_Finite', function () {
        var enumerableFinite, results, scheduler;
        enumerableFinite = [1, 2, 3, 4, 5];
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.fromArray(enumerableFinite, scheduler);
        });
        results.messages.assertEqual(
                            onNext(201, 1),
                            onNext(202, 2),
                            onNext(203, 3),
                            onNext(204, 4),
                            onNext(205, 5),
                            onCompleted(206)
                        );
    });

    test('Generate_Finite', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.generate(0, function (x) {
                return x <= 3;
            }, function (x) {
                return x + 1;
            }, function (x) {
                return x;
            }, scheduler);
        });
        results.messages.assertEqual(
                            onNext(201, 0),
                            onNext(202, 1),
                            onNext(203, 2),
                            onNext(204, 3),
                            onCompleted(205)
                        );
    });

    test('Generate_Throw_Condition', function () {
        var ex, results, scheduler;
        scheduler = new TestScheduler();
        ex = 'ex';
        results = scheduler.startWithCreate(function () {
            return Observable.generate(0, function (x) {
                throw ex;
            }, function (x) {
                return x + 1;
            }, function (x) {
                return x;
            }, scheduler);
        });
        results.messages.assertEqual(onError(201, ex));
    });

    test('Generate_Throw_ResultSelector', function () {
        var ex, results, scheduler;
        scheduler = new TestScheduler();
        ex = 'ex';
        results = scheduler.startWithCreate(function () {
            return Observable.generate(0, function (x) {
                return true;
            }, function (x) {
                return x + 1;
            }, function (x) {
                throw ex;
            }, scheduler);
        });
        results.messages.assertEqual(onError(201, ex));
    });

    test('Generate_Throw_Iterate', function () {
        var ex, results, scheduler;
        scheduler = new TestScheduler();
        ex = 'ex';
        results = scheduler.startWithCreate(function () {
            return Observable.generate(0, function (x) {
                return true;
            }, function (x) {
                throw ex;
            }, function (x) {
                return x;
            }, scheduler);
        });
        results.messages.assertEqual(
                            onNext(201, 0),
                            onError(202, ex)
                        );
    });

    test('Generate_Dispose', function () {
        var ex, results, scheduler;
        scheduler = new TestScheduler();
        ex = 'ex';
        results = scheduler.startWithDispose(function () {
            return Observable.generate(0, function (x) {
                return true;
            }, function (x) {
                return x + 1;
            }, function (x) {
                return x;
            }, scheduler);
        }, 203);
        results.messages.assertEqual(
                            onNext(201, 0),
                            onNext(202, 1));
    });

    test('Defer_Complete', function () {
        var invoked, results, scheduler, xs;
        invoked = 0;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.defer(function () {
                invoked++;
                xs = scheduler.createColdObservable(
                                    onNext(100, scheduler.clock),
                                    onCompleted(200)
                                );
                return xs;
            });
        });
        results.messages.assertEqual(
                            onNext(300, 200),
                            onCompleted(400)
                        );
        equal(1, invoked);
        return xs.subscriptions.assertEqual(subscribe(200, 400));
    });

    test('Defer_Error', function () {
        var ex, invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        ex = 'ex';
        results = scheduler.startWithCreate(function () {
            return Observable.defer(function () {
                invoked++;
                xs = scheduler.createColdObservable(onNext(100, scheduler.clock), onError(200, ex));
                return xs;
            });
        });
        results.messages.assertEqual(onNext(300, 200), onError(400, ex));
        equal(1, invoked);
        return xs.subscriptions.assertEqual(subscribe(200, 400));
    });

    test('Defer_Dispose', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        invoked = 0;
        results = scheduler.startWithCreate(function () {
            return Observable.defer(function () {
                invoked++;
                xs = scheduler.createColdObservable(onNext(100, scheduler.clock), onNext(200, invoked), onNext(1100, 1000));
                return xs;
            });
        });
        results.messages.assertEqual(onNext(300, 200), onNext(400, 1));
        equal(1, invoked);
        return xs.subscriptions.assertEqual(subscribe(200, 1000));
    });

    test('Defer_Throw', function () {
        var ex, invoked, results, scheduler;
        scheduler = new TestScheduler();
        invoked = 0;
        ex = 'ex';
        results = scheduler.startWithCreate(function () {
            return Observable.defer(function () {
                invoked++;
                throw ex;
            });
        });
        results.messages.assertEqual(onError(200, ex));
        return equal(1, invoked);
    });

    test('Using_Null', function () {
        var createInvoked, disposable, disposeInvoked, results, scheduler, xs, _d;
        scheduler = new TestScheduler();
        disposeInvoked = 0;
        createInvoked = 0;
        results = scheduler.startWithCreate(function () {
            return Observable.using(function () {
                disposeInvoked++;
                disposable = null;
                return disposable;
            }, function (d) {
                _d = d;
                createInvoked++;
                xs = scheduler.createColdObservable(onNext(100, scheduler.clock), onCompleted(200));
                return xs;
            });
        });
        strictEqual(disposable, _d);
        results.messages.assertEqual(onNext(300, 200), onCompleted(400));
        equal(1, createInvoked);
        equal(1, disposeInvoked);
        xs.subscriptions.assertEqual(subscribe(200, 400));
        ok(disposable === null);
    });

    test('Using_Complete', function () {
        var createInvoked, disposable, disposeInvoked, results, scheduler, xs, _d;
        scheduler = new TestScheduler();
        disposeInvoked = 0;
        createInvoked = 0;
        results = scheduler.startWithCreate(function () {
            return Observable.using(function () {
                disposeInvoked++;
                disposable = new Rx.MockDisposable(scheduler);
                return disposable;
            }, function (d) {
                _d = d;
                createInvoked++;
                xs = scheduler.createColdObservable(onNext(100, scheduler.clock), onCompleted(200));
                return xs;
            });
        });
        strictEqual(disposable, _d);
        results.messages.assertEqual(onNext(300, 200), onCompleted(400));
        equal(1, createInvoked);
        equal(1, disposeInvoked);
        xs.subscriptions.assertEqual(subscribe(200, 400));
        disposable.disposes.assertEqual(200, 400);
    });

    test('Using_Error', function () {
        var createInvoked, disposable, disposeInvoked, ex, results, scheduler, xs, _d;
        scheduler = new TestScheduler();
        disposeInvoked = 0;
        createInvoked = 0;
        ex = 'ex';
        results = scheduler.startWithCreate(function () {
            return Observable.using(function () {
                disposeInvoked++;
                disposable = new Rx.MockDisposable(scheduler);
                return disposable;
            }, function (d) {
                _d = d;
                createInvoked++;
                xs = scheduler.createColdObservable(onNext(100, scheduler.clock), onError(200, ex));
                return xs;
            });
        });
        strictEqual(disposable, _d);
        results.messages.assertEqual(onNext(300, 200), onError(400, ex));
        equal(1, createInvoked);
        equal(1, disposeInvoked);
        xs.subscriptions.assertEqual(subscribe(200, 400));
        disposable.disposes.assertEqual(200, 400);
    });

    test('Using_Dispose', function () {
        var createInvoked, disposable, disposeInvoked, results, scheduler, xs, _d;
        scheduler = new TestScheduler();
        disposeInvoked = 0;
        createInvoked = 0;
        results = scheduler.startWithCreate(function () {
            return Observable.using(function () {
                disposeInvoked++;
                disposable = new Rx.MockDisposable(scheduler);
                return disposable;
            }, function (d) {
                _d = d;
                createInvoked++;
                xs = scheduler.createColdObservable(onNext(100, scheduler.clock), onNext(1000, scheduler.clock + 1));
                return xs;
            });
        });
        strictEqual(disposable, _d);
        results.messages.assertEqual(onNext(300, 200));
        equal(1, createInvoked);
        equal(1, disposeInvoked);
        xs.subscriptions.assertEqual(subscribe(200, 1000));
        disposable.disposes.assertEqual(200, 1000);
    });

    test('Using_ThrowResourceSelector', function () {
        var createInvoked, disposeInvoked, ex, results, scheduler;
        scheduler = new TestScheduler();
        disposeInvoked = 0;
        createInvoked = 0;
        ex = 'ex';
        results = scheduler.startWithCreate(function () {
            return Observable.using(function () {
                disposeInvoked++;
                throw ex;
            }, function (d) {
                createInvoked++;
                return Observable.never();
            });
        });
        results.messages.assertEqual(onError(200, ex));
        equal(0, createInvoked);
        return equal(1, disposeInvoked);
    });

    test('Using_ThrowResourceUsage', function () {
        var createInvoked, disposable, disposeInvoked, ex, results, scheduler;
        scheduler = new TestScheduler();
        disposeInvoked = 0;
        createInvoked = 0;
        ex = 'ex';
        disposable = void 0;
        results = scheduler.startWithCreate(function () {
            return Observable.using(function () {
                disposeInvoked++;
                disposable = new Rx.MockDisposable(scheduler);
                return disposable;
            }, function (d) {
                createInvoked++;
                throw ex;
            });
        });
        results.messages.assertEqual(onError(200, ex));
        equal(1, createInvoked);
        equal(1, disposeInvoked);
        return disposable.disposes.assertEqual(200, 200);
    });

    test('Create_Next', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.create(function (o) {
                o.onNext(1);
                o.onNext(2);
                return function () { };
            });
        });
        results.messages.assertEqual(onNext(200, 1), onNext(200, 2));
    });

    test('Create_Completed', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.create(function (o) {
                o.onCompleted();
                o.onNext(100);
                o.onError('ex');
                o.onCompleted();
                return function () { };
            });
        });
        results.messages.assertEqual(onCompleted(200));
    });

    test('Create_Error', function () {
        var ex, results, scheduler;
        scheduler = new TestScheduler();
        ex = 'ex';
        results = scheduler.startWithCreate(function () {
            return Observable.create(function (o) {
                o.onError(ex);
                o.onNext(100);
                o.onError('foo');
                o.onCompleted();
                return function () { };
            });
        });
        results.messages.assertEqual(onError(200, ex));
    });

    test('Create_Exception', function () {
        raises(function () {
            return Observable.create(function (o) {
                throw 'ex';
            }).subscribe();
        });
    });

    test('Create_Dispose', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.create(function (o) {
                var isStopped;
                isStopped = false;
                o.onNext(1);
                o.onNext(2);
                scheduler.scheduleWithRelative(600, function () {
                    if (!isStopped) {
                        return o.onNext(3);
                    }
                });
                scheduler.scheduleWithRelative(700, function () {
                    if (!isStopped) {
                        return o.onNext(4);
                    }
                });
                scheduler.scheduleWithRelative(900, function () {
                    if (!isStopped) {
                        return o.onNext(5);
                    }
                });
                scheduler.scheduleWithRelative(1100, function () {
                    if (!isStopped) {
                        return o.onNext(6);
                    }
                });
                return function () {
                    return isStopped = true;
                };
            });
        });
        results.messages.assertEqual(onNext(200, 1), onNext(200, 2), onNext(800, 3), onNext(900, 4));
    });

    test('Create_ObserverThrows', function () {
        raises(function () {
            return Observable.create(function (o) {
                o.onNext(1);
                return function () { };
            }).subscribe(function (x) {
                throw 'ex';
            });
        });
        raises(function () {
            return Observable.create(function (o) {
                o.onError('exception');
                return function () { };
            }).subscribe(function (x) { }, function (ex) {
                throw 'ex';
            });
        });
        raises(function () {
            return Observable.create(function (o) {
                o.onCompleted();
                return function () { };
            }).subscribe(function (x) { }, function (ex) { }, function () {
                throw 'ex';
            });
        });
    });

    test('CreateWithDisposable_Next', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.createWithDisposable(function (o) {
                o.onNext(1);
                o.onNext(2);
                return Rx.Disposable.empty;
            });
        });
        results.messages.assertEqual(onNext(200, 1), onNext(200, 2));
    });

    test('CreateWithDisposable_Completed', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.createWithDisposable(function (o) {
                o.onCompleted();
                o.onNext(100);
                o.onError('ex');
                o.onCompleted();
                return Rx.Disposable.empty;
            });
        });
        results.messages.assertEqual(onCompleted(200));
    });

    test('CreateWithDisposable_Error', function () {
        var ex, results, scheduler;
        scheduler = new TestScheduler();
        ex = 'ex';
        results = scheduler.startWithCreate(function () {
            return Observable.createWithDisposable(function (o) {
                o.onError(ex);
                o.onNext(100);
                o.onError('foo');
                o.onCompleted();
                return Rx.Disposable.empty;
            });
        });
        results.messages.assertEqual(onError(200, ex));
    });

    test('CreateWithDisposable_Exception', function () {
        raises(function () {
            return Observable.createWithDisposable(function (o) {
                throw 'ex';
            }).subscribe();
        });
    });

    test('CreateWithDisposable_Dispose', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.createWithDisposable(function (o) {
                var d;
                d = new BooleanDisposable();
                o.onNext(1);
                o.onNext(2);
                scheduler.scheduleWithRelative(600, function () {
                    if (!d.isDisposed) {
                        o.onNext(3);
                    }
                });
                scheduler.scheduleWithRelative(700, function () {
                    if (!d.isDisposed) {
                        o.onNext(4);
                    }
                });
                scheduler.scheduleWithRelative(900, function () {
                    if (!d.isDisposed) {
                        o.onNext(5);
                    }
                });
                scheduler.scheduleWithRelative(1100, function () {
                    if (!d.isDisposed) {
                        o.onNext(6);
                    }
                });
                return d;
            });
        });
        results.messages.assertEqual(onNext(200, 1), onNext(200, 2), onNext(800, 3), onNext(900, 4));
    });

    test('CreateWithDisposable_ObserverThrows', function () {
        raises(function () {
            return Observable.createWithDisposable(function (o) {
                o.onNext(1);
                return Rx.Disposable.empty;
            }).subscribe(function (x) {
                throw 'ex';
            });
        });
        raises(function () {
            return Observable.createWithDisposable(function (o) {
                o.onError('exception');
                return Rx.Disposable.empty;
            }).subscribe(function (x) { }, function (ex) {
                throw 'ex';
            });
        });
        raises(function () {
            return Observable.createWithDisposable(function (o) {
                o.onCompleted();
                return Rx.Disposable.empty;
            }).subscribe(function (x) { }, function (ex) { }, function () {
                throw 'ex';
            });
        });
    });

    test('Range_Zero', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.range(0, 0, scheduler);
        });
        results.messages.assertEqual(onCompleted(201));
    });

    test('Range_One', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.range(0, 1, scheduler);
        });
        results.messages.assertEqual(onNext(201, 0), onCompleted(202));
    });

    test('Range_Five', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.range(10, 5, scheduler);
        });
        results.messages.assertEqual(
                            onNext(201, 10),
                            onNext(202, 11),
                            onNext(203, 12),
                            onNext(204, 13),
                            onNext(205, 14),
                            onCompleted(206));
    });

    test('Range_Dispose', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithDispose(function () {
            return Observable.range(-10, 5, scheduler);
        }, 204);
        results.messages.assertEqual(onNext(201, -10), onNext(202, -9), onNext(203, -8));
    });

    test('Repeat_Observable_Basic', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(
                            onNext(100, 1),
                            onNext(150, 2),
                            onNext(200, 3),
                            onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.repeat();
        });
        results.messages.assertEqual(
                            onNext(300, 1),
                            onNext(350, 2),
                            onNext(400, 3),
                            onNext(550, 1),
                            onNext(600, 2),
                            onNext(650, 3),
                            onNext(800, 1),
                            onNext(850, 2),
                            onNext(900, 3));
        xs.subscriptions.assertEqual(
                            subscribe(200, 450),
                            subscribe(450, 700),
                            subscribe(700, 950),
                            subscribe(950, 1000));
    });

    test('Repeat_Observable_Infinite', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(100, 1), onNext(150, 2), onNext(200, 3));
        results = scheduler.startWithCreate(function () {
            return xs.repeat();
        });
        results.messages.assertEqual(onNext(300, 1), onNext(350, 2), onNext(400, 3));
        return xs.subscriptions.assertEqual(subscribe(200, 1000));
    });

    test('Repeat_Observable_Error', function () {
        var ex, results, scheduler, xs;
        scheduler = new TestScheduler();
        ex = 'ex';
        xs = scheduler.createColdObservable(onNext(100, 1), onNext(150, 2), onNext(200, 3), onError(250, ex));
        results = scheduler.startWithCreate(function () {
            return xs.repeat();
        });
        results.messages.assertEqual(onNext(300, 1), onNext(350, 2), onNext(400, 3), onError(450, ex));
        return xs.subscriptions.assertEqual(subscribe(200, 450));
    });

    test('Repeat_Observable_Throws', function () {
        var d, scheduler1, scheduler2, scheduler3, xs, xss, ys, zs;
        scheduler1 = new TestScheduler();
        xs = Observable.returnValue(1, scheduler1).repeat();
        xs.subscribe(function (x) {
            throw 'ex';
        });
        raises(function () {
            return scheduler1.start();
        });
        scheduler2 = new TestScheduler();
        ys = Observable.throwException('ex', scheduler2).repeat();
        ys.subscribe(function (x) { }, function (ex) {
            throw 'ex';
        });
        raises(function () {
            return scheduler2.start();
        });
        scheduler3 = new TestScheduler();
        zs = Observable.returnValue(1, scheduler3).repeat();
        d = zs.subscribe(function (x) { }, function (ex) { }, function () {
            throw 'ex';
        });
        scheduler3.scheduleAbsolute(210, function () {
            return d.dispose();
        });
        scheduler3.start();
        xss = Observable.create(function (o) {
            throw 'ex';
        }).repeat();
        raises(function () {
            return xss.subscribe();
        });
    });

    test('Repeat_Observable_RepeatCount_Basic', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(5, 1), onNext(10, 2), onNext(15, 3), onCompleted(20));
        results = scheduler.startWithCreate(function () {
            return xs.repeat(3);
        });
        results.messages.assertEqual(onNext(205, 1), onNext(210, 2), onNext(215, 3), onNext(225, 1), onNext(230, 2), onNext(235, 3), onNext(245, 1), onNext(250, 2), onNext(255, 3), onCompleted(260));
        xs.subscriptions.assertEqual(subscribe(200, 220), subscribe(220, 240), subscribe(240, 260));
    });

    test('Repeat_Observable_RepeatCount_Dispose', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(5, 1), onNext(10, 2), onNext(15, 3), onCompleted(20));
        results = scheduler.startWithDispose(function () {
            return xs.repeat(3);
        }, 231);
        results.messages.assertEqual(onNext(205, 1), onNext(210, 2), onNext(215, 3), onNext(225, 1), onNext(230, 2));
        return xs.subscriptions.assertEqual(subscribe(200, 220), subscribe(220, 231));
    });

    test('Repeat_Observable_RepeatCount_Infinite', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(100, 1), onNext(150, 2), onNext(200, 3));
        results = scheduler.startWithCreate(function () {
            return xs.repeat(3);
        });
        results.messages.assertEqual(onNext(300, 1), onNext(350, 2), onNext(400, 3));
        return xs.subscriptions.assertEqual(subscribe(200, 1000));
    });

    test('Repeat_Observable_RepeatCount_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(100, 1), onNext(150, 2), onNext(200, 3), onError(250, ex));
        results = scheduler.startWithCreate(function () {
            return xs.repeat(3);
        });
        results.messages.assertEqual(onNext(300, 1), onNext(350, 2), onNext(400, 3), onError(450, ex));
        return xs.subscriptions.assertEqual(subscribe(200, 450));
    });

    test('Repeat_Observable_RepeatCount_Throws', function () {
        var d, scheduler1, scheduler2, scheduler3, xs, xss, ys, zs;
        scheduler1 = new TestScheduler();
        xs = Observable.returnValue(1, scheduler1).repeat(3);
        xs.subscribe(function (x) {
            throw 'ex';
        });
        raises(function () {
            return scheduler1.start();
        });
        scheduler2 = new TestScheduler();
        ys = Observable.throwException('ex1', scheduler2).repeat(3);
        ys.subscribe(function () { }, function (ex) {
            throw 'ex2';
        });
        raises(function () {
            return scheduler2.start();
        });
        scheduler3 = new TestScheduler();
        zs = Observable.returnValue(1, scheduler3).repeat(100);
        d = zs.subscribe(function () { }, function (ex) { }, function () {
            throw 'ex3';
        });
        scheduler3.scheduleAbsolute(10, function () {
            return d.dispose();
        });
        scheduler3.start();
        xss = Observable.create(function (o) {
            throw 'ex4';
        }).repeat(3);
        raises(function () {
            return xss.subscribe();
        });
    });

    test('Retry_Observable_Basic', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(100, 1), onNext(150, 2), onNext(200, 3), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.retry();
        });
        results.messages.assertEqual(onNext(300, 1), onNext(350, 2), onNext(400, 3), onCompleted(450));
        xs.subscriptions.assertEqual(subscribe(200, 450));
    });

    test('Retry_Observable_Infinite', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(100, 1), onNext(150, 2), onNext(200, 3));
        results = scheduler.startWithCreate(function () {
            return xs.retry();
        });
        results.messages.assertEqual(onNext(300, 1), onNext(350, 2), onNext(400, 3));
        return xs.subscriptions.assertEqual(subscribe(200, 1000));
    });

    test('Retry_Observable_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createColdObservable(onNext(100, 1), onNext(150, 2), onNext(200, 3), onError(250, ex));
        results = scheduler.startWithDispose(function () {
            return xs.retry();
        }, 1100);
        results.messages.assertEqual(onNext(300, 1), onNext(350, 2), onNext(400, 3), onNext(550, 1), onNext(600, 2), onNext(650, 3), onNext(800, 1), onNext(850, 2), onNext(900, 3), onNext(1050, 1));
        return xs.subscriptions.assertEqual(subscribe(200, 450), subscribe(450, 700), subscribe(700, 950), subscribe(950, 1100));
    });

    test('Retry_Observable_Throws', function () {
        var d, scheduler1, scheduler2, scheduler3, xs, xss, ys, zs;
        scheduler1 = new TestScheduler();
        xs = Observable.returnValue(1, scheduler1).retry();
        xs.subscribe(function (x) {
            throw 'ex';
        });
        raises(function () {
            return scheduler1.start();
        });
        scheduler2 = new TestScheduler();
        ys = Observable.throwException('ex', scheduler2).retry();
        d = ys.subscribe(function (x) { }, function (ex) {
            throw 'ex';
        });
        scheduler2.scheduleAbsolute(210, function () {
            return d.dispose();
        });
        scheduler2.start();
        scheduler3 = new TestScheduler();
        zs = Observable.returnValue(1, scheduler3).retry();
        zs.subscribe(function (x) { }, function (ex) { }, function () {
            throw 'ex';
        });
        raises(function () {
            return scheduler3.start();
        });
        xss = Observable.create(function (o) {
            throw 'ex';
        }).retry();
        raises(function () {
            return xss.subscribe();
        });
    });

    test('Retry_Observable_RetryCount_Basic', function () {
        var ex, results, scheduler, xs;
        scheduler = new TestScheduler();
        ex = 'ex';
        xs = scheduler.createColdObservable(onNext(5, 1), onNext(10, 2), onNext(15, 3), onError(20, ex));
        results = scheduler.startWithCreate(function () {
            return xs.retry(3);
        });
        results.messages.assertEqual(onNext(205, 1), onNext(210, 2), onNext(215, 3), onNext(225, 1), onNext(230, 2), onNext(235, 3), onNext(245, 1), onNext(250, 2), onNext(255, 3), onError(260, ex));
        xs.subscriptions.assertEqual(subscribe(200, 220), subscribe(220, 240), subscribe(240, 260));
    });

    test('Retry_Observable_RetryCount_Dispose', function () {
        var ex, results, scheduler, xs;
        scheduler = new TestScheduler();
        ex = 'ex';
        xs = scheduler.createColdObservable(onNext(5, 1), onNext(10, 2), onNext(15, 3), onError(20, ex));
        results = scheduler.startWithDispose(function () {
            return xs.retry(3);
        }, 231);
        results.messages.assertEqual(onNext(205, 1), onNext(210, 2), onNext(215, 3), onNext(225, 1), onNext(230, 2));
        xs.subscriptions.assertEqual(subscribe(200, 220), subscribe(220, 231));
    });

    test('Retry_Observable_RetryCount_Dispose', function () {
        var ex, results, scheduler, xs;
        scheduler = new TestScheduler();
        ex = 'ex';
        xs = scheduler.createColdObservable(onNext(100, 1), onNext(150, 2), onNext(200, 3));
        results = scheduler.startWithCreate(function () {
            return xs.retry(3);
        });
        results.messages.assertEqual(onNext(300, 1), onNext(350, 2), onNext(400, 3));
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });

    test('Retry_Observable_RetryCount_Dispose', function () {
        var ex, results, scheduler, xs;
        scheduler = new TestScheduler();
        ex = 'ex';
        xs = scheduler.createColdObservable(onNext(100, 1), onNext(150, 2), onNext(200, 3), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.retry(3);
        });
        results.messages.assertEqual(onNext(300, 1), onNext(350, 2), onNext(400, 3), onCompleted(450));
        xs.subscriptions.assertEqual(subscribe(200, 450));
    });

    test('Retry_Observable_RetryCount_Throws', function () {
        var d, scheduler1, scheduler2, scheduler3, xs, xss, ys, zs;
        scheduler1 = new TestScheduler();
        xs = Observable.returnValue(1, scheduler1).retry(3);
        xs.subscribe(function (x) {
            throw 'ex';
        });
        raises(function () {
            return scheduler1.start();
        });
        scheduler2 = new TestScheduler();
        ys = Observable.throwException('ex', scheduler2).retry(100);
        d = ys.subscribe(function (x) { }, function (ex) {
            throw 'ex';
        });
        scheduler2.scheduleAbsolute(10, function () {
            return d.dispose();
        });
        scheduler2.start();
        scheduler3 = new TestScheduler();
        zs = Observable.returnValue(1, scheduler3).retry(100);
        zs.subscribe(function (x) { }, function (ex) { }, function () {
            throw 'ex';
        });
        raises(function () {
            return scheduler3.start();
        });
        xss = Observable.create(function (o) {
            throw 'ex';
        }).retry(100);
        raises(function () {
            return xss.subscribe();
        });
    });

    test('Repeat_Value_Count_Zero', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.repeat(42, 0, scheduler);
        });
        results.messages.assertEqual(onCompleted(200));
    });

    test('Repeat_Value_Count_One', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.repeat(42, 1, scheduler);
        });
        results.messages.assertEqual(onNext(201, 42), onCompleted(201));
    });

    test('Repeat_Value_Count_Ten', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Observable.repeat(42, 10, scheduler);
        });
        results.messages.assertEqual(onNext(201, 42), onNext(202, 42), onNext(203, 42), onNext(204, 42), onNext(205, 42), onNext(206, 42), onNext(207, 42), onNext(208, 42), onNext(209, 42), onNext(210, 42), onCompleted(210));
    });

    test('Repeat_Value_Count_Dispose', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithDispose(function () {
            return Observable.repeat(42, 10, scheduler);
        }, 207);
        results.messages.assertEqual(onNext(201, 42), onNext(202, 42), onNext(203, 42), onNext(204, 42), onNext(205, 42), onNext(206, 42));
    });

    test('Repeat_Value', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithDispose(function () {
            return Observable.repeat(42, -1, scheduler);
        }, 207);
        results.messages.assertEqual(onNext(201, 42), onNext(202, 42), onNext(203, 42), onNext(204, 42), onNext(205, 42), onNext(206, 42));
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    
}(typeof global == 'object' && global || this));