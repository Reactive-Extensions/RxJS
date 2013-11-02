/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

(function(window) {

    // Check if browser vs node
    var root = window.Rx;

    QUnit.module('ObservableSingleTest');

    var Observable = root.Observable,
        TestScheduler = root.TestScheduler,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe;

    test('Materialize_Never', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.never().materialize();
        });
        results.messages.assertEqual();
    });

    test('Materialize_Empty', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.materialize();
        }).messages;
        equal(2, results.length);
        ok(results[0].value.kind === 'N' && results[0].value.value.kind === 'C' && results[0].time === 250);
        ok(results[1].value.kind === 'C' && results[1].time === 250);
    });

    test('Materialize_Return', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.materialize();
        }).messages;
        equal(3, results.length);
        ok(results[0].value.kind === 'N' && results[0].value.value.kind === 'N' && results[0].value.value.value === 2 && results[0].time === 210);
        ok(results[1].value.kind === 'N' && results[1].value.value.kind === 'C' && results[1].time === 250);
        ok(results[2].value.kind === 'C' && results[1].time === 250);
    });

    test('Materialize_Throw', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(250, ex));
        results = scheduler.startWithCreate(function () {
            return xs.materialize();
        }).messages;
        equal(2, results.length);
        ok(results[0].value.kind === 'N' && results[0].value.value.kind === 'E' && results[0].value.value.exception === ex);
        ok(results[1].value.kind === 'C');
    });

    test('Materialize_Dematerialize_Never', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.never().materialize().dematerialize();
        });
        results.messages.assertEqual();
    });

    test('Materialize_Dematerialize_Empty', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.materialize().dematerialize();
        }).messages;
        equal(1, results.length);
        ok(results[0].value.kind === 'C' && results[0].time === 250);
    });

    test('Materialize_Dematerialize_Return', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.materialize().dematerialize();
        }).messages;
        equal(2, results.length);
        ok(results[0].value.kind === 'N' && results[0].value.value === 2 && results[0].time === 210);
        ok(results[1].value.kind === 'C');
    });

    test('Materialize_Dematerialize_Throw', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(250, ex));
        results = scheduler.startWithCreate(function () {
            return xs.materialize().dematerialize();
        }).messages;
        equal(1, results.length);
        ok(results[0].value.kind === 'E' && results[0].value.exception === ex && results[0].time === 250);
    });

    test('StartWith', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(220, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.startWith(1);
        }).messages;
        equal(3, results.length);
        ok(results[0].value.kind === 'N' && results[0].value.value === 1 && results[0].time === 200);
        ok(results[1].value.kind === 'N' && results[1].value.value === 2 && results[1].time === 220);
        ok(results[2].value.kind === 'C');
    });

    var sequenceEqual;
    sequenceEqual = function (arr1, arr2) {
        var i;
        if (arr1.length !== arr2.length) {
            return false;
        }
        for (i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
                return false;
            }
        }
        return true;
    };

    test('Buffer_Count_PartialWindow', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.bufferWithCount(5);
        }).messages;
        equal(2, results.length);
        ok(sequenceEqual(results[0].value.value, [2, 3, 4, 5]) && results[0].time === 250);
        ok(results[1].value.kind === 'C' && results[1].time === 250);
    });

    test('Buffer_Count_FullWindows', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.bufferWithCount(2);
        }).messages;
        equal(3, results.length);
        ok(sequenceEqual(results[0].value.value, [2, 3]) && results[0].time === 220);
        ok(sequenceEqual(results[1].value.value, [4, 5]) && results[1].time === 240);
        ok(results[2].value.kind === 'C' && results[2].time === 250);
    });

    test('Buffer_Count_FullAndPartialWindows', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.bufferWithCount(3);
        }).messages;
        equal(3, results.length);
        ok(sequenceEqual(results[0].value.value, [2, 3, 4]) && results[0].time === 230);
        ok(sequenceEqual(results[1].value.value, [5]) && results[1].time === 250);
        ok(results[2].value.kind === 'C' && results[2].time === 250);
    });

    test('Buffer_Count_Error', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onError(250, 'ex'));
        results = scheduler.startWithCreate(function () {
            return xs.bufferWithCount(5);
        }).messages;
        equal(1, results.length);
        ok(results[0].value.kind === 'E' && results[0].time === 250);
    });

    test('Buffer_Count_Skip_Less', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.bufferWithCount(3, 1);
        }).messages;
        equal(5, results.length);
        ok(sequenceEqual(results[0].value.value, [2, 3, 4]) && results[0].time === 230);
        ok(sequenceEqual(results[1].value.value, [3, 4, 5]) && results[1].time === 240);
        ok(sequenceEqual(results[2].value.value, [4, 5]) && results[2].time === 250);
        ok(sequenceEqual(results[3].value.value, [5]) && results[3].time === 250);
        ok(results[4].value.kind === 'C' && results[4].time === 250);
    });

    test('Buffer_Count_Skip_More', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.bufferWithCount(2, 3);
        }).messages;
        equal(3, results.length);
        ok(sequenceEqual(results[0].value.value, [2, 3]) && results[0].time === 220);
        ok(sequenceEqual(results[1].value.value, [5]) && results[1].time === 250);
        ok(results[2].value.kind === 'C' && results[2].time === 250);
    });

    test('AsObservable_Hides', function () {
        var someObservable;
        someObservable = Rx.Observable.empty();
        ok(someObservable.asObservable() !== someObservable);
    });

    test('AsObservable_Never', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.never().asObservable();
        });
        results.messages.assertEqual();
    });

    test('AsObservable_Empty', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.asObservable();
        }).messages;
        equal(1, results.length);
        ok(results[0].value.kind === 'C' && results[0].time === 250);
    });

    test('AsObservable_Throw', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(250, ex));
        results = scheduler.startWithCreate(function () {
            return xs.asObservable();
        }).messages;
        equal(1, results.length);
        ok(results[0].value.kind === 'E' && results[0].value.exception === ex && results[0].time === 250);
    });

    test('AsObservable_Return', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(220, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.asObservable();
        }).messages;
        equal(2, results.length);
        ok(results[0].value.kind === 'N' && results[0].value.value === 2 && results[0].time === 220);
        ok(results[1].value.kind === 'C' && results[1].time === 250);
    });

    test('AsObservable_IsNotEager', function () {
        var scheduler, subscribed, xs;
        scheduler = new TestScheduler();
        subscribed = false;
        xs = Rx.Observable.create(function (obs) {
            var disp;
            subscribed = true;
            disp = scheduler.createHotObservable(onNext(150, 1), onNext(220, 2), onCompleted(250)).subscribe(obs);
            return function () {
                return disp.dispose();
            };
        });
        xs.asObservable();
        ok(!subscribed);
        scheduler.startWithCreate(function () {
            return xs.asObservable();
        });
        ok(subscribed);
    });
    
    test('Scan_Seed_Never', function () {
        var results, scheduler, seed;
        scheduler = new TestScheduler();
        seed = 42;
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.never().scan(seed, function (acc, x) {
                return acc + x;
            });
        });
        results.messages.assertEqual();
    });
    test('Scan_Seed_Empty', function () {
        var results, scheduler, seed, xs;
        scheduler = new TestScheduler();
        seed = 42;
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.scan(seed, function (acc, x) {
                return acc + x;
            });
        }).messages;
        equal(1, results.length);
        ok(results[0].value.kind === 'C' && results[0].time === 250);
    });
    test('Scan_Seed_Return', function () {
        var results, scheduler, seed, xs;
        scheduler = new TestScheduler();
        seed = 42;
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(220, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.scan(seed, function (acc, x) {
                return acc + x;
            });
        }).messages;
        equal(2, results.length);
        ok(results[0].value.kind === 'N' && results[0].value.value === seed + 2 && results[0].time === 220);
        ok(results[1].value.kind === 'C' && results[1].time === 250);
    });
    test('Scan_Seed_Throw', function () {
        var ex, results, scheduler, seed, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        seed = 42;
        xs = scheduler.createHotObservable(onNext(150, 1), onError(250, ex));
        results = scheduler.startWithCreate(function () {
            return xs.scan(seed, function (acc, x) {
                return acc + x;
            });
        }).messages;
        equal(1, results.length);
        ok(results[0].value.kind === 'E' && results[0].value.exception === ex && results[0].time === 250);
    });
    test('Scan_Seed_SomeData', function () {
        var results, scheduler, seed, xs;
        scheduler = new TestScheduler();
        seed = 1;
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.scan(seed, function (acc, x) {
                return acc + x;
            });
        }).messages;
        equal(5, results.length);
        ok(results[0].value.kind === 'N' && results[0].value.value === seed + 2 && results[0].time === 210);
        ok(results[1].value.kind === 'N' && results[1].value.value === seed + 2 + 3 && results[1].time === 220);
        ok(results[2].value.kind === 'N' && results[2].value.value === seed + 2 + 3 + 4 && results[2].time === 230);
        ok(results[3].value.kind === 'N' && results[3].value.value === seed + 2 + 3 + 4 + 5 && results[3].time === 240);
        ok(results[4].value.kind === 'C' && results[4].time === 250);
    });
    test('Scan_NoSeed_Never', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.never().scan(function (acc, x) {
                return acc + x;
            });
        });
        results.messages.assertEqual();
    });
    test('Scan_NoSeed_Empty', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.scan(function (acc, x) {
                return acc + x;
            });
        }).messages;
        equal(1, results.length);
        ok(results[0].value.kind === 'C' && results[0].time === 250);
    });
    test('Scan_NoSeed_Return', function () {
        var results, scheduler, xs, _undefined;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(220, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.scan(function (acc, x) {
                if (acc === _undefined) {
                    acc = 0;
                }
                return acc + x;
            });
        }).messages;
        equal(2, results.length);
        ok(results[0].value.kind === 'N' && results[0].time === 220 && results[0].value.value === 2);
        ok(results[1].value.kind === 'C' && results[1].time === 250);
    });
    test('Scan_NoSeed_Throw', function () {
        var ex, results, scheduler, xs, _undefined;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(250, ex));
        results = scheduler.startWithCreate(function () {
            return xs.scan(function (acc, x) {
                if (acc === _undefined) {
                    acc = 0;
                }
                return acc + x;
            });
        }).messages;
        equal(1, results.length);
        ok(results[0].value.kind === 'E' && results[0].time === 250 && results[0].value.exception === ex);
    });
    test('Scan_NoSeed_SomeData', function () {
        var results, scheduler, xs, _undefined;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.scan(function (acc, x) {
                if (acc === _undefined) {
                    acc = 0;
                }
                return acc + x;
            });
        }).messages;
        equal(5, results.length);
        ok(results[0].value.kind === 'N' && results[0].time === 210 && results[0].value.value === 2);
        ok(results[1].value.kind === 'N' && results[1].time === 220 && results[1].value.value === 2 + 3);
        ok(results[2].value.kind === 'N' && results[2].time === 230 && results[2].value.value === 2 + 3 + 4);
        ok(results[3].value.kind === 'N' && results[3].time === 240 && results[3].value.value === 2 + 3 + 4 + 5);
        ok(results[4].value.kind === 'C' && results[4].time === 250);
    });
    test('DistinctUntilChanged_Never', function () {
        var results, scheduler;
        scheduler = new TestScheduler();
        results = scheduler.startWithCreate(function () {
            return Rx.Observable.never().distinctUntilChanged();
        });
        results.messages.assertEqual();
    });
    test('DistinctUntilChanged_Empty', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.distinctUntilChanged();
        }).messages;
        equal(1, results.length);
        ok(results[0].value.kind === 'C' && results[0].time === 250);
    });
    test('DistinctUntilChanged_Return', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(220, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.distinctUntilChanged();
        }).messages;
        equal(2, results.length);
        ok(results[0].value.kind === 'N' && results[0].time === 220 && results[0].value.value === 2);
        ok(results[1].value.kind === 'C' && results[1].time === 250);
    });
    test('DistinctUntilChanged_Throw', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(250, ex));
        results = scheduler.startWithCreate(function () {
            return xs.distinctUntilChanged();
        }).messages;
        equal(1, results.length);
        ok(results[0].value.kind === 'E' && results[0].time === 250 && results[0].value.exception === ex);
    });
    test('DistinctUntilChanged_AllChanges', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.distinctUntilChanged();
        }).messages;
        equal(5, results.length);
        ok(results[0].value.kind === 'N' && results[0].time === 210 && results[0].value.value === 2);
        ok(results[1].value.kind === 'N' && results[1].time === 220 && results[1].value.value === 3);
        ok(results[2].value.kind === 'N' && results[2].time === 230 && results[2].value.value === 4);
        ok(results[3].value.kind === 'N' && results[3].time === 240 && results[3].value.value === 5);
        ok(results[4].value.kind === 'C' && results[4].time === 250);
    });

    test('DistinctUntilChanged_AllSame', function () {
        var scheduler = new TestScheduler();
        
        var xs = scheduler.createHotObservable(
            onNext(150, 1), 
            onNext(210, 2), 
            onNext(220, 2), 
            onNext(230, 2), 
            onNext(240, 2), 
            onCompleted(250)
        );
        
        var results = scheduler.startWithCreate(function () {
            return xs.distinctUntilChanged();
        }).messages;
        
        equal(2, results.length);
        ok(results[0].value.kind === 'N' && results[0].time === 210 && results[0].value.value === 2);
        ok(results[1].value.kind === 'C' && results[1].time === 250);
    });

    test('DistinctUntilChanged_SomeChanges', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(215, 3), onNext(220, 3), onNext(225, 2), onNext(230, 2), onNext(230, 1), onNext(240, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.distinctUntilChanged();
        }).messages;
        equal(6, results.length);
        ok(results[0].value.kind === 'N' && results[0].time === 210 && results[0].value.value === 2);
        ok(results[1].value.kind === 'N' && results[1].time === 215 && results[1].value.value === 3);
        ok(results[2].value.kind === 'N' && results[2].time === 225 && results[2].value.value === 2);
        ok(results[3].value.kind === 'N' && results[3].time === 230 && results[3].value.value === 1);
        ok(results[4].value.kind === 'N' && results[4].time === 240 && results[4].value.value === 2);
        ok(results[5].value.kind === 'C' && results[5].time === 250);
    });
    test('DistinctUntilChanged_Comparer_AllEqual', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.distinctUntilChanged(void 0, function (x, y) {
                return true;
            });
        }).messages;
        equal(2, results.length);
        ok(results[0].value.kind === 'N' && results[0].time === 210 && results[0].value.value === 2);
        ok(results[1].value.kind === 'C' && results[1].time === 250);
    });
    test('DistinctUntilChanged_Comparer_AllDifferent', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 2), onNext(230, 2), onNext(240, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.distinctUntilChanged(void 0, function (x, y) {
                return false;
            });
        }).messages;
        equal(5, results.length);
        ok(results[0].value.kind === 'N' && results[0].time === 210 && results[0].value.value === 2);
        ok(results[1].value.kind === 'N' && results[1].time === 220 && results[1].value.value === 2);
        ok(results[2].value.kind === 'N' && results[2].time === 230 && results[2].value.value === 2);
        ok(results[3].value.kind === 'N' && results[3].time === 240 && results[3].value.value === 2);
        ok(results[4].value.kind === 'C' && results[4].time === 250);
    });
    test('DistinctUntilChanged_KeySelector_Div2', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 4), onNext(230, 3), onNext(240, 5), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.distinctUntilChanged(function (x) {
                return x % 2;
            });
        }).messages;
        equal(3, results.length);
        ok(results[0].value.kind === 'N' && results[0].time === 210 && results[0].value.value === 2);
        ok(results[1].value.kind === 'N' && results[1].time === 230 && results[1].value.value === 3);
        ok(results[2].value.kind === 'C' && results[2].time === 250);
    });
    test('DistinctUntilChanged_KeySelectorThrows', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.distinctUntilChanged(function (x) {
                throw ex;
            });
        });
        results.messages.assertEqual(onError(210, ex));
    });
    test('DistinctUntilChanged_ComparerThrows', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.distinctUntilChanged(void 0, function (x, y) {
                throw ex;
            });
        });
        results.messages.assertEqual(onNext(210, 2), onError(220, ex));
    });
    test('Finally_OnlyCalledOnce_Empty', function () {
        var d, invokeCount, someObservable;
        invokeCount = 0;
        someObservable = Rx.Observable.empty().finallyAction(function () {
            return invokeCount++;
        });
        d = someObservable.subscribe();
        d.dispose();
        d.dispose();
        equal(1, invokeCount);
    });
    test('Finally_Empty', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        invoked = false;
        results = scheduler.startWithCreate(function () {
            return xs.finallyAction(function () {
                return invoked = true;
            });
        }).messages;
        equal(1, results.length);
        ok(results[0].value.kind === 'C' && results[0].time === 250);
        ok(invoked);
    });
    test('Finally_Return', function () {
        var invoked, results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        invoked = false;
        results = scheduler.startWithCreate(function () {
            return xs.finallyAction(function () {
                return invoked = true;
            });
        }).messages;
        equal(2, results.length);
        ok(results[0].value.kind === 'N' && results[0].time === 210 && results[0].value.value === 2);
        ok(results[1].value.kind === 'C' && results[1].time === 250);
        ok(invoked);
    });
    test('Finally_Throw', function () {
        var ex, invoked, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(250, ex));
        invoked = false;
        results = scheduler.startWithCreate(function () {
            return xs.finallyAction(function () {
                return invoked = true;
            });
        }).messages;
        equal(1, results.length);
        ok(results[0].value.kind === 'E' && results[0].time === 250 && results[0].value.exception === ex);
        ok(invoked);
    });
    test('Do_ShouldSeeAllValues', function () {
        var i, scheduler, sum, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        i = 0;
        sum = 2 + 3 + 4 + 5;
        scheduler.startWithCreate(function () {
            return xs.doAction(function (x) {
                i++;
                return sum -= x;
            });
        });
        equal(4, i);
        equal(0, sum);
    });
    test('Do_PlainAction', function () {
        var i, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        i = 0;
        scheduler.startWithCreate(function () {
            return xs.doAction(function (x) {
                return i++;
            });
        });
        equal(4, i);
    });
    test('Do_NextCompleted', function () {
        var completed, i, scheduler, sum, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        i = 0;
        sum = 2 + 3 + 4 + 5;
        completed = false;
        scheduler.startWithCreate(function () {
            return xs.doAction(function (x) {
                i++;
                sum -= x;
            }, undefined, function () {
                completed = true;
            });
        });
        equal(4, i);
        equal(0, sum);
        ok(completed);
    });
    test('Do_NextCompleted_Never', function () {
        var completed, i, scheduler;
        scheduler = new TestScheduler();
        i = 0;
        completed = false;
        scheduler.startWithCreate(function () {
            return Rx.Observable.never().doAction(function (x) {
                i++;
            }, undefined, function () {
                completed = true;
            });
        });
        equal(0, i);
        ok(!completed);
    });
    test('Do_NextError', function () {
        var ex, i, sawError, scheduler, sum, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onError(250, ex));
        i = 0;
        sum = 2 + 3 + 4 + 5;
        sawError = false;
        scheduler.startWithCreate(function () {
            return xs.doAction(function (x) {
                i++;
                sum -= x;
            }, function (e) {
                sawError = e === ex;
            });
        });
        equal(4, i);
        equal(0, sum);
        ok(sawError);
    });
    test('Do_NextErrorNot', function () {
        var i, sawError, scheduler, sum, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        i = 0;
        sum = 2 + 3 + 4 + 5;
        sawError = false;
        scheduler.startWithCreate(function () {
            return xs.doAction(function (x) {
                i++;
                sum -= x;
            }, function (e) {
                sawError = true;
            });
        });
        equal(4, i);
        equal(0, sum);
        ok(!sawError);
    });
    test('Do_NextErrorCompleted', function () {
        var hasCompleted, i, sawError, scheduler, sum, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        i = 0;
        sum = 2 + 3 + 4 + 5;
        sawError = false;
        hasCompleted = false;
        scheduler.startWithCreate(function () {
            return xs.doAction(function (x) {
                i++;
                sum -= x;
            }, function (e) {
                sawError = true;
            }, function () {
                hasCompleted = true;
            });
        });
        equal(4, i);
        equal(0, sum);
        ok(!sawError);
        ok(hasCompleted);
    });
    test('Do_NextErrorCompletedError', function () {
        var ex, hasCompleted, i, sawError, scheduler, sum, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onError(250, ex));
        i = 0;
        sum = 2 + 3 + 4 + 5;
        sawError = false;
        hasCompleted = false;
        scheduler.startWithCreate(function () {
            return xs.doAction(function (x) {
                i++;
                sum -= x;
            }, function (e) {
                sawError = ex === e;
            }, function () {
                hasCompleted = true;
            });
        });
        equal(4, i);
        equal(0, sum);
        ok(sawError);
        ok(!hasCompleted);
    });
    test('Do_NextErrorCompletedNever', function () {
        var hasCompleted, i, sawError, scheduler;
        scheduler = new TestScheduler();
        i = 0;
        sawError = false;
        hasCompleted = false;
        scheduler.startWithCreate(function () {
            return Rx.Observable.never().doAction(function (x) {
                i++;
            }, function (e) {
                sawError = true;
            }, function () {
                hasCompleted = true;
            });
        });
        equal(0, i);
        ok(!sawError);
        ok(!hasCompleted);
    });
    test('Do_Observer_SomeDataWithError', function () {
        var ex, hasCompleted, i, sawError, scheduler, sum, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onError(250, ex));
        i = 0;
        sum = 2 + 3 + 4 + 5;
        sawError = false;
        hasCompleted = false;
        scheduler.startWithCreate(function () {
            return xs.doAction(Rx.Observer.create(function (x) {
                i++;
                sum -= x;
            }, function (e) {
                sawError = e === ex;
            }, function () {
                hasCompleted = true;
            }));
        });
        equal(4, i);
        equal(0, sum);
        ok(sawError);
        ok(!hasCompleted);
    });
    test('Do_Observer_SomeDataWithError', function () {
        var hasCompleted, i, sawError, scheduler, sum, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        i = 0;
        sum = 2 + 3 + 4 + 5;
        sawError = false;
        hasCompleted = false;
        scheduler.startWithCreate(function () {
            return xs.doAction(Rx.Observer.create(function (x) {
                i++;
                sum -= x;
            }, function (e) {
                sawError = true;
            }, function () {
                hasCompleted = true;
            }));
        });
        equal(4, i);
        equal(0, sum);
        ok(!sawError);
        ok(hasCompleted);
    });
    test('Do1422_Next_NextThrows', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.doAction(function () {
                throw ex;
            });
        });
        results.messages.assertEqual(onError(210, ex));
    });
    test('Do1422_NextCompleted_NextThrows', function () {
        var ex, results, scheduler, xs, _undefined;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.doAction(function () {
                throw ex;
            }, _undefined, function () { });
        });
        results.messages.assertEqual(onError(210, ex));
    });
    test('Do1422_NextCompleted_CompletedThrows', function () {
        var ex, results, scheduler, xs, _undefined;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.doAction(function () { }, _undefined, function () {
                throw ex;
            });
        });
        results.messages.assertEqual(onNext(210, 2), onError(250, ex));
    });
    test('Do1422_NextError_NextThrows', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.doAction(function () {
                throw ex;
            }, function () { });
        });
        results.messages.assertEqual(onError(210, ex));
    });
    test('Do1422_NextError_NextThrows', function () {
        var ex1, ex2, results, scheduler, xs;
        ex1 = 'ex1';
        ex2 = 'ex2';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex1));
        results = scheduler.startWithCreate(function () {
            return xs.doAction(function () { }, function () {
                throw ex2;
            });
        });
        results.messages.assertEqual(onError(210, ex2));
    });
    test('Do1422_NextErrorCompleted_NextThrows', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.doAction(function () {
                throw ex;
            }, function () { }, function () { });
        });
        results.messages.assertEqual(onError(210, ex));
    });
    test('Do1422_NextErrorCompleted_ErrorThrows', function () {
        var ex1, ex2, results, scheduler, xs;
        ex1 = 'ex1';
        ex2 = 'ex2';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex1));
        results = scheduler.startWithCreate(function () {
            return xs.doAction(function () { }, function () {
                throw ex2;
            }, function () { });
        });
        results.messages.assertEqual(onError(210, ex2));
    });
    test('Do1422_NextErrorCompleted_CompletedThrows', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.doAction(function () { }, function () { }, function () {
                throw ex;
            });
        });
        results.messages.assertEqual(onNext(210, 2), onError(250, ex));
    });
    test('Do1422_Observer_NextThrows', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.doAction(Rx.Observer.create(function () {
                throw ex;
            }, function () { }, function () { }));
        });
        results.messages.assertEqual(onError(210, ex));
    });
    test('Do1422_Observer_ErrorThrows', function () {
        var ex1, ex2, results, scheduler, xs;
        ex1 = 'ex1';
        ex2 = 'ex2';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex1));
        results = scheduler.startWithCreate(function () {
            return xs.doAction(Rx.Observer.create(function () { }, function () {
                throw ex2;
            }, function () { }));
        });
        results.messages.assertEqual(onError(210, ex2));
    });
    test('Do1422_Observer_CompletedThrows', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        results = scheduler.startWithCreate(function () {
            return xs.doAction(Rx.Observer.create(function () { }, function () { }, function () {
                throw ex;
            }));
        });
        results.messages.assertEqual(onNext(210, 2), onError(250, ex));
    });
    test('TakeLast_Zero_Completed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
        results = scheduler.startWithCreate(function () {
            return xs.takeLast(0);
        });
        results.messages.assertEqual(onCompleted(650));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('TakeLast_Zero_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
        results = scheduler.startWithCreate(function () {
            return xs.takeLast(0);
        });
        results.messages.assertEqual(onError(650, ex));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('TakeLast_Zero_Disposed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
        results = scheduler.startWithCreate(function () {
            return xs.takeLast(0);
        });
        results.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('TakeLast_One_Completed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
        results = scheduler.startWithCreate(function () {
            return xs.takeLast(1);
        });
        results.messages.assertEqual(onNext(650, 9), onCompleted(650));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('TakeLast_One_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
        results = scheduler.startWithCreate(function () {
            return xs.takeLast(1);
        });
        results.messages.assertEqual(onError(650, ex));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('TakeLast_One_Disposed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
        results = scheduler.startWithCreate(function () {
            return xs.takeLast(1);
        });
        results.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('TakeLast_Three_Completed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
        results = scheduler.startWithCreate(function () {
            return xs.takeLast(3);
        });
        results.messages.assertEqual(onNext(650, 7), onNext(650, 8), onNext(650, 9), onCompleted(650));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('TakeLast_Three_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
        results = scheduler.startWithCreate(function () {
            return xs.takeLast(3);
        });
        results.messages.assertEqual(onError(650, ex));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('TakeLast_Three_Disposed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
        results = scheduler.startWithCreate(function () {
            return xs.takeLast(3);
        });
        results.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('SkipLast_Zero_Completed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
        results = scheduler.startWithCreate(function () {
            return xs.skipLast(0);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('SkipLast_Zero_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
        results = scheduler.startWithCreate(function () {
            return xs.skipLast(0);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('SkipLast_Zero_Disposed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
        results = scheduler.startWithCreate(function () {
            return xs.skipLast(0);
        });
        results.messages.assertEqual(onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('SkipLast_One_Completed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
        results = scheduler.startWithCreate(function () {
            return xs.skipLast(1);
        });
        results.messages.assertEqual(onNext(250, 2), onNext(270, 3), onNext(310, 4), onNext(360, 5), onNext(380, 6), onNext(410, 7), onNext(590, 8), onCompleted(650));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('SkipLast_One_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
        results = scheduler.startWithCreate(function () {
            return xs.skipLast(1);
        });
        results.messages.assertEqual(onNext(250, 2), onNext(270, 3), onNext(310, 4), onNext(360, 5), onNext(380, 6), onNext(410, 7), onNext(590, 8), onError(650, ex));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('SkipLast_One_Disposed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
        results = scheduler.startWithCreate(function () {
            return xs.skipLast(1);
        });
        results.messages.assertEqual(onNext(250, 2), onNext(270, 3), onNext(310, 4), onNext(360, 5), onNext(380, 6), onNext(410, 7), onNext(590, 8));
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('SkipLast_Three_Completed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
        results = scheduler.startWithCreate(function () {
            return xs.skipLast(3);
        });
        results.messages.assertEqual(onNext(310, 2), onNext(360, 3), onNext(380, 4), onNext(410, 5), onNext(590, 6), onCompleted(650));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('SkipLast_Three_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
        results = scheduler.startWithCreate(function () {
            return xs.skipLast(3);
        });
        results.messages.assertEqual(onNext(310, 2), onNext(360, 3), onNext(380, 4), onNext(410, 5), onNext(590, 6), onError(650, ex));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('SkipLast_Three_Disposed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
        results = scheduler.startWithCreate(function () {
            return xs.skipLast(3);
        });
        results.messages.assertEqual(onNext(310, 2), onNext(360, 3), onNext(380, 4), onNext(410, 5), onNext(590, 6));
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('IgnoreValues_Basic', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
        results = scheduler.startWithCreate(function () {
            return xs.ignoreElements();
        });
        results.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('IgnoreValues_Completed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(610));
        results = scheduler.startWithCreate(function () {
            return xs.ignoreElements();
        });
        results.messages.assertEqual(onCompleted(610));
        xs.subscriptions.assertEqual(subscribe(200, 610));
    });
    test('IgnoreValues_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(610, ex));
        results = scheduler.startWithCreate(function () {
            return xs.ignoreElements();
        });
        results.messages.assertEqual(onError(610, ex));
        xs.subscriptions.assertEqual(subscribe(200, 610));
    });
    test('WindowWithCount_Basic', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.windowWithCount(3, 2).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(210, "0 2"), onNext(240, "0 3"), onNext(280, "0 4"), onNext(280, "1 4"), onNext(320, "1 5"), onNext(350, "1 6"), onNext(350, "2 6"), onNext(380, "2 7"), onNext(420, "2 8"), onNext(420, "3 8"), onNext(470, "3 9"), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('WindowWithCount_Disposed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
        results = scheduler.startWithDispose(function () {
            return xs.windowWithCount(3, 2).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                });
            }).mergeObservable();
        }, 370);
        results.messages.assertEqual(onNext(210, "0 2"), onNext(240, "0 3"), onNext(280, "0 4"), onNext(280, "1 4"), onNext(320, "1 5"), onNext(350, "1 6"), onNext(350, "2 6"));
        xs.subscriptions.assertEqual(subscribe(200, 370));
    });
    test('WindowWithCount_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onError(600, ex));
        results = scheduler.startWithCreate(function () {
            return xs.windowWithCount(3, 2).select(function (w, i) {
                return w.select(function (x) {
                    return i.toString() + ' ' + x.toString();
                });
            }).mergeObservable();
        });
        results.messages.assertEqual(onNext(210, "0 2"), onNext(240, "0 3"), onNext(280, "0 4"), onNext(280, "1 4"), onNext(320, "1 5"), onNext(350, "1 6"), onNext(350, "2 6"), onNext(380, "2 7"), onNext(420, "2 8"), onNext(420, "3 8"), onNext(470, "3 9"), onError(600, ex));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('BufferWithCount_Basic', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.bufferWithCount(3, 2).select(function (x) {
                return x.toString();
            });
        });
        results.messages.assertEqual(onNext(280, "2,3,4"), onNext(350, "4,5,6"), onNext(420, "6,7,8"), onNext(600, "8,9"), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });
    test('BufferWithCount_Disposed', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(100, 1), onNext(210, 2), onNext(240, 3), onNext(280, 4), onNext(320, 5), onNext(350, 6), onNext(380, 7), onNext(420, 8), onNext(470, 9), onCompleted(600));
        results = scheduler.startWithDispose(function () {
            return xs.bufferWithCount(3, 2).select(function (x) {
                return x.toString();
            });
        }, 370);
        results.messages.assertEqual(onNext(280, "2,3,4"), onNext(350, "4,5,6"));
        xs.subscriptions.assertEqual(subscribe(200, 370));
    });
    test('DefaultIfEmpty_NonEmpty1', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onCompleted(420));
        results = scheduler.startWithCreate(function () {
            return xs.defaultIfEmpty();
        });
        results.messages.assertEqual(onNext(280, 42), onNext(360, 43), onCompleted(420));
        xs.subscriptions.assertEqual(subscribe(200, 420));
    });
    test('DefaultIfEmpty_NonEmpty2', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onCompleted(420));
        results = scheduler.startWithCreate(function () {
            return xs.defaultIfEmpty(-1);
        });
        results.messages.assertEqual(onNext(280, 42), onNext(360, 43), onCompleted(420));
        xs.subscriptions.assertEqual(subscribe(200, 420));
    });
    test('DefaultIfEmpty_Empty1', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onCompleted(420));
        results = scheduler.startWithCreate(function () {
            return xs.defaultIfEmpty(null);
        });
        results.messages.assertEqual(onNext(420, null), onCompleted(420));
        xs.subscriptions.assertEqual(subscribe(200, 420));
    });
    test('DefaultIfEmpty_Empty2', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onCompleted(420));
        results = scheduler.startWithCreate(function () {
            return xs.defaultIfEmpty(-1);
        });
        results.messages.assertEqual(onNext(420, -1), onCompleted(420));
        xs.subscriptions.assertEqual(subscribe(200, 420));
    });
    test('Distinct_DefaultComparer_AllDistinct', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(280, 4), onNext(300, 2), onNext(350, 1), onNext(380, 3), onNext(400, 5), onCompleted(420));
        results = scheduler.startWithCreate(function () {
            return xs.distinct();
        });
        results.messages.assertEqual(onNext(280, 4), onNext(300, 2), onNext(350, 1), onNext(380, 3), onNext(400, 5), onCompleted(420));
        xs.subscriptions.assertEqual(subscribe(200, 420));
    });
    test('Distinct_DefaultComparer_SomeDuplicates', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(280, 4), onNext(300, 2), onNext(350, 2), onNext(380, 3), onNext(400, 4), onCompleted(420));
        results = scheduler.startWithCreate(function () {
            return xs.distinct();
        });
        results.messages.assertEqual(onNext(280, 4), onNext(300, 2), onNext(380, 3), onCompleted(420));
        xs.subscriptions.assertEqual(subscribe(200, 420));
    });
    test('Distinct_KeySelectory_AllDistinct', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(280, 8), onNext(300, 4), onNext(350, 2), onNext(380, 6), onNext(400, 10), onCompleted(420));
        results = scheduler.startWithCreate(function () {
            return xs.distinct(function (x) {
                return x / 2;
            });
        });
        results.messages.assertEqual(onNext(280, 8), onNext(300, 4), onNext(350, 2), onNext(380, 6), onNext(400, 10), onCompleted(420));
        xs.subscriptions.assertEqual(subscribe(200, 420));
    });
    test('Distinct_KeySelector_SomeDuplicates', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(280, 4), onNext(300, 2), onNext(350, 3), onNext(380, 7), onNext(400, 5), onCompleted(420));
        results = scheduler.startWithCreate(function () {
            return xs.distinct(function (x) {
                return Math.floor(x / 2);
            });
        });
        results.messages.assertEqual(onNext(280, 4), onNext(300, 2), onNext(380, 7), onCompleted(420));
        xs.subscriptions.assertEqual(subscribe(200, 420));
    });
    test('Distinct_KeySelector_Throws', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(280, 3), onNext(300, 2), onNext(350, 1), onNext(380, 0), onNext(400, 4), onCompleted(420));
        results = scheduler.startWithCreate(function () {
            return xs.distinct(function (x) {
                if (x === 0) {
                    throw ex;
                } else {
                    return Math.floor(x / 2);
                }
            });
        });
        results.messages.assertEqual(onNext(280, 3), onNext(350, 1), onError(380, ex));
        xs.subscriptions.assertEqual(subscribe(200, 380));
    });

    // TakeLastBuffer

    function arrayEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) return false;
        for (var i = 0, len = arr1.length; i < len; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
        return true;
    }

    test('TakeLastBuffer_Zero_Completed', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBuffer(0);
        });
        res.messages.assertEqual(onNext(650, function (lst) {
            return lst.length === 0;
        }), onCompleted(650));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('TakeLastBuffer_Zero_Error', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBuffer(0);
        });
        res.messages.assertEqual(onError(650, ex));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('TakeLastBuffer_Zero_Disposed', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBuffer(0);
        });
        res.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('TakeLastBuffer_One_Completed', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBuffer(1);
        });
        res.messages.assertEqual(onNext(650, function (lst) {
            return arrayEqual(lst, [9]);
        }), onCompleted(650));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('TakeLastBuffer_One_Error', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBuffer(1);
        });
        res.messages.assertEqual(onError(650, ex));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('TakeLastBuffer_One_Disposed', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBuffer(1);
        });
        res.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });
    test('TakeLastBuffer_Three_Completed', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onCompleted(650));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBuffer(3);
        });
        res.messages.assertEqual(onNext(650, function (lst) {
            return arrayEqual(lst, [7, 8, 9]);
        }), onCompleted(650));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('TakeLastBuffer_Three_Error', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9), onError(650, ex));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBuffer(3);
        });
        res.messages.assertEqual(onError(650, ex));
        xs.subscriptions.assertEqual(subscribe(200, 650));
    });
    test('TakeLastBuffer_Three_Disposed', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(180, 1), onNext(210, 2), onNext(250, 3), onNext(270, 4), onNext(310, 5), onNext(360, 6), onNext(380, 7), onNext(410, 8), onNext(590, 9));
        res = scheduler.startWithCreate(function () {
            return xs.takeLastBuffer(3);
        });
        res.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    
}(typeof global == 'object' && global || this));