/// <reference path="../reactiveassert.js" />
/// <reference path="../rx.js" />
/// <reference path="../rx.testing.js" />

(function(window) {

    // Check if browser vs node
    var root;
    if (!window.document) {
        root = require('../rx.js');
        require('../rx.aggregates');
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

    QUnit.module('ObservableAggregatesTest');

    var TestScheduler = root.TestScheduler,
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe;

    test('AggregateWithSeed_Empty', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.aggregate(42, function (acc, x) {
                return acc + x;
            });
        }).messages;
        res.assertEqual(onNext(250, 42), onCompleted(250));
    });

    test('AggregateWithSeed_Return', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, 24), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.aggregate(42, function (acc, x) {
                return acc + x;
            });
        }).messages;
        res.assertEqual(onNext(250, 42 + 24), onCompleted(250));
    });

    test('AggregateWithSeed_Throw', function () {
        var ex, msgs, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onError(210, ex)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.aggregate(42, function (acc, x) {
                return acc + x;
            });
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('AggregateWithSeed_Never', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.aggregate(42, function (acc, x) {
                return acc + x;
            });
        }).messages;
        res.assertEqual();
    });

    test('AggregateWithSeed_Range', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, 0), onNext(220, 1), onNext(230, 2), onNext(240, 3), onNext(250, 4), onCompleted(260)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.aggregate(42, function (acc, x) {
                return acc + x;
            });
        }).messages;
        res.assertEqual(onNext(260, 10 + 42), onCompleted(260));
    });

    test('AggregateWithoutSeed_Empty', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.aggregate(function (acc, x) {
                return acc + x;
            });
        }).messages;
        equal(1, res.length);
        ok(res[0].value.kind === 'E' && res[0].value.exception !== undefined);
        equal(250, res[0].time);
    });

    test('AggregateWithoutSeed_Return', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, 24), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.aggregate(function (acc, x) {
                return acc + x;
            });
        }).messages;
        res.assertEqual(onNext(250, 24), onCompleted(250));
    });

    test('AggregateWithoutSeed_Throw', function () {
        var ex, msgs, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onError(210, ex)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.aggregate(function (acc, x) {
                return acc + x;
            });
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('AggregateWithoutSeed_Never', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.aggregate(function (acc, x) {
                return acc + x;
            });
        }).messages;
        res.assertEqual();
    });

    test('AggregateWithoutSeed_Range', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, 0), onNext(220, 1), onNext(230, 2), onNext(240, 3), onNext(250, 4), onCompleted(260)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.aggregate(function (acc, x) {
                return acc + x;
            });
        }).messages;
        res.assertEqual(onNext(260, 10), onCompleted(260));
    });

    test('Any_Empty', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.any();
        }).messages;
        res.assertEqual(onNext(250, false), onCompleted(250));
    });

    test('Any_Return', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.any();
        }).messages;
        res.assertEqual(onNext(210, true), onCompleted(210));
    });

    test('Any_Throw', function () {
        var ex, msgs, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onError(210, ex)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.any();
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('Any_Never', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.any();
        }).messages;
        res.assertEqual();
    });

    test('Any_Predicate_Empty', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.any(function (x) {
                return x > 0;
            });
        }).messages;
        res.assertEqual(onNext(250, false), onCompleted(250));
    });

    test('Any_Predicate_Return', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.any(function (x) {
                return x > 0;
            });
        }).messages;
        res.assertEqual(onNext(210, true), onCompleted(210));
    });

    test('Any_Predicate_ReturnNotMatch', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, -2), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.any(function (x) {
                return x > 0;
            });
        }).messages;
        res.assertEqual(onNext(250, false), onCompleted(250));
    });

    test('Any_Predicate_SomeNoneMatch', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, -2), onNext(220, -3), onNext(230, -4), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.any(function (x) {
                return x > 0;
            });
        }).messages;
        res.assertEqual(onNext(250, false), onCompleted(250));
    });

    test('Any_Predicate_SomeMatch', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, -2), onNext(220, 3), onNext(230, -4), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.any(function (x) {
                return x > 0;
            });
        }).messages;
        res.assertEqual(onNext(220, true), onCompleted(220));
    });

    test('Any_Predicate_Throw', function () {
        var ex, msgs, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onError(210, ex)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.any(function (x) {
                return x > 0;
            });
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('Any_Predicate_Never', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.any(function (x) {
                return x > 0;
            });
        }).messages;
        res.assertEqual();
    });

    test('All_Empty', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.all(function (x) {
                return x > 0;
            });
        }).messages;
        res.assertEqual(onNext(250, true), onCompleted(250));
    });

    test('All_Return', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.all(function (x) {
                return x > 0;
            });
        }).messages;
        res.assertEqual(onNext(250, true), onCompleted(250));
    });

    test('All_ReturnNotMatch', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, -2), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.all(function (x) {
                return x > 0;
            });
        }).messages;
        res.assertEqual(onNext(210, false), onCompleted(210));
    });

    test('All_SomeNoneMatch', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, -2), onNext(220, -3), onNext(230, -4), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.all(function (x) {
                return x > 0;
            });
        }).messages;
        res.assertEqual(onNext(210, false), onCompleted(210));
    });

    test('All_SomeMatch', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, -2), onNext(220, 3), onNext(230, -4), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.all(function (x) {
                return x > 0;
            });
        }).messages;
        res.assertEqual(onNext(210, false), onCompleted(210));
    });

    test('All_SomeAllMatch', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.all(function (x) {
                return x > 0;
            });
        }).messages;
        res.assertEqual(onNext(250, true), onCompleted(250));
    });

    test('All_Throw', function () {
        var ex, msgs, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onError(210, ex)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.all(function (x) {
                return x > 0;
            });
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('All_Never', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.all(function (x) {
                return x > 0;
            });
        }).messages;
        res.assertEqual();
    });

    test('Contains_Empty', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.contains(42);
        }).messages;
        res.assertEqual(onNext(250, false), onCompleted(250));
    });
    test('Contains_ReturnPositive', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.contains(2);
        }).messages;
        res.assertEqual(onNext(210, true), onCompleted(210));
    });

    test('Contains_ReturnNegative', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.contains(-2);
        }).messages;
        res.assertEqual(onNext(250, false), onCompleted(250));
    });

    test('Contains_SomePositive', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.contains(3);
        }).messages;
        res.assertEqual(onNext(220, true), onCompleted(220));
    });
    test('Contains_SomeNegative', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.contains(-3);
        }).messages;
        res.assertEqual(onNext(250, false), onCompleted(250));
    });

    test('Contains_Throw', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.contains(42);
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('Contains_Never', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.contains(42);
        }).messages;
        res.assertEqual();
    });

    test('Contains_ComparerThrows', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2));
        res = scheduler.startWithCreate(function () {
            return xs.contains(42, function (a, b) {
                throw ex;
            });
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('Contains_ComparerContainsValue', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 3), onNext(220, 4), onNext(230, 8), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.contains(42, function (a, b) {
                return a % 2 === b % 2;
            });
        }).messages;
        res.assertEqual(onNext(220, true), onCompleted(220));
    });

    test('Contains_ComparerDoesNotContainValue', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 4), onNext(230, 8), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.contains(21, function (a, b) {
                return a % 2 === b % 2;
            });
        }).messages;
        res.assertEqual(onNext(250, false), onCompleted(250));
    });

    test('Count_Empty', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.count();
        }).messages;
        res.assertEqual(onNext(250, 0), onCompleted(250));
    });

    test('Count_Empty', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.count();
        }).messages;
        res.assertEqual(onNext(250, 1), onCompleted(250));
    });

    test('Count_Some', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.count();
        }).messages;
        res.assertEqual(onNext(250, 3), onCompleted(250));
    });

    test('Count_Throw', function () {
        var ex, msgs, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.count();
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('Count_Never', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1));
        res = scheduler.startWithCreate(function () {
            return xs.count();
        }).messages;
        res.assertEqual();
    });

    test('Count_Predicate_Empty_True', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.count(function () {
                return true;
            });
        });
        res.messages.assertEqual(onNext(250, 0), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('Count_Predicate_Empty_False', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.count(function () {
                return false;
            });
        });
        res.messages.assertEqual(onNext(250, 0), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('Count_Predicate_Return_True', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.count(function () {
                return true;
            });
        });
        res.messages.assertEqual(onNext(250, 1), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('Count_Predicate_Return_False', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.count(function () {
                return false;
            });
        });
        res.messages.assertEqual(onNext(250, 0), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('Count_Predicate_Some_All', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.count(function (x) {
                return x < 10;
            });
        });
        res.messages.assertEqual(onNext(250, 3), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('Count_Predicate_Some_None', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.count(function (x) {
                return x > 10;
            });
        });
        res.messages.assertEqual(onNext(250, 0), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('Count_Predicate_Some_Even', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.count(function (x) {
                return x % 2 === 0;
            });
        });
        res.messages.assertEqual(onNext(250, 2), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('Count_Predicate_Throw_True', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.count(function () {
                return true;
            });
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('Count_Predicate_Throw_False', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.count(function () {
                return false;
            });
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('Count_Predicate_Never', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1));
        res = scheduler.startWithCreate(function () {
            return xs.count(function () {
                return true;
            });
        });
        res.messages.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });

    test('Count_Predicate_PredicateThrows', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(230, 3), onCompleted(240));
        res = scheduler.startWithCreate(function () {
            return xs.count(function (x) {
                if (x === 3) {
                    throw ex;
                } else {
                    return true;
                }
            });
        });
        res.messages.assertEqual(onError(230, ex));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });

    test('Sum_Int32_Empty', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.sum();
        }).messages;
        res.assertEqual(onNext(250, 0), onCompleted(250));
    });

    test('Sum_Int32_Return', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.sum();
        }).messages;
        res.assertEqual(onNext(250, 2), onCompleted(250));
    });

    test('Sum_Int32_Some', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.sum();
        }).messages;
        res.assertEqual(onNext(250, 2 + 3 + 4), onCompleted(250));
    });

    test('Sum_Int32_Throw', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.sum();
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('Sum_Int32_Never', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1));
        res = scheduler.startWithCreate(function () {
            return xs.sum();
        }).messages;
        res.assertEqual();
    });

    test('Sum_Selector_Regular_Int32', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, "fo"), onNext(220, "b"), onNext(230, "qux"), onCompleted(240));
        res = scheduler.startWithCreate(function () {
            return xs.sum(function (x) {
                return x.length;
            });
        });
        res.messages.assertEqual(onNext(240, 6), onCompleted(240));
        xs.subscriptions.assertEqual(subscribe(200, 240));
    });

    test('Min_Int32_Empty', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.min();
        }).messages;
        equal(1, res.length);
        ok(res[0].value.kind === 'E' && res[0].value.exception !== null);
        ok(res[0].time === 250);
    });

    test('Min_Int32_Return', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.min();
        }).messages;
        res.assertEqual(onNext(250, 2), onCompleted(250));
    });

    test('Min_Int32_Some', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.min();
        }).messages;
        res.assertEqual(onNext(250, 2), onCompleted(250));
    });

    test('Min_Int32_Throw', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.min();
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('Min_Int32_Never', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1));
        res = scheduler.startWithCreate(function () {
            return xs.min();
        }).messages;
        res.assertEqual();
    });

    test('MinOfT_Comparer_Empty', function () {
        var comparer, res, scheduler, xs;
        scheduler = new TestScheduler();
        comparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a === b) {
                return 0;
            }
            return 1;
        };
        xs = scheduler.createHotObservable(onNext(150, 'a'), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.min(comparer);
        }).messages;
        equal(1, res.length);
        ok(res[0].value.kind === 'E' && res[0].value.exception !== null);
        ok(res[0].time === 250);
    });

    test('MinOfT_Comparer_Empty', function () {
        var comparer, res, scheduler, xs;
        scheduler = new TestScheduler();
        comparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a === b) {
                return 0;
            }
            return 1;
        };
        xs = scheduler.createHotObservable(onNext(150, 'z'), onNext(210, "b"), onNext(220, "c"), onNext(230, "a"), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.min(comparer);
        }).messages;
        res.assertEqual(onNext(250, "c"), onCompleted(250));
    });

    test('MinOfT_Comparer_Throw', function () {
        var comparer, ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        comparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a === b) {
                return 0;
            }
            return 1;
        };
        xs = scheduler.createHotObservable(onNext(150, 'z'), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.min(comparer);
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('MinOfT_Comparer_Never', function () {
        var comparer, res, scheduler, xs;
        scheduler = new TestScheduler();
        comparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a === b) {
                return 0;
            }
            return 1;
        };
        xs = scheduler.createHotObservable(onNext(150, 'z'));
        res = scheduler.startWithCreate(function () {
            return xs.min(comparer);
        }).messages;
        res.assertEqual();
    });

    test('MinOfT_ComparerThrows', function () {
        var comparer, ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        comparer = function (a, b) {
            throw ex;
        };
        xs = scheduler.createHotObservable(onNext(150, 'z'), onNext(210, "b"), onNext(220, "c"), onNext(230, "a"), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.min(comparer);
        }).messages;
        res.assertEqual(onError(220, ex));
    });

    test('MinBy_Empty', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, { key: 1, value: 'z' }), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.minBy(function (x) {
                return x.key;
            });
        }).messages;
        equal(2, res.length);
        equal(0, res[0].value.value.length);
        ok(res[1].value.kind === 'C' && res[1].time === 250);
    });

    test('MinBy_Return', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable
            (onNext(150, { key: 1, value: 'z' }),
            onNext(210, { key: 2, value: 'a' }),
            onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.minBy(function (x) {
                return x.key;
            });
        }).messages;
        equal(2, res.length);
        ok(res[0].value.kind === 'N');
        equal(1, res[0].value.value.length);
        equal(2, res[0].value.value[0].key);
        equal('a', res[0].value.value[0].value);
        ok(res[1].value.kind === 'C' && res[1].time === 250);
    });

    test('MinBy_Some', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }), onNext(210, {
                key: 3,
                value: 'b'
            }), onNext(220, {
                key: 2,
                value: 'c'
            }), onNext(230, {
                key: 4,
                value: 'a'
            }), onCompleted(250)
        ];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.minBy(function (x) {
                return x.key;
            });
        }).messages;
        equal(2, res.length);
        ok(res[0].value.kind === 'N');
        equal(1, res[0].value.value.length);
        equal(2, res[0].value.value[0].key);
        equal('c', res[0].value.value[0].value);
        ok(res[1].value.kind === 'C' && res[1].time === 250);
    });

    test('MinBy_Multiple', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }), onNext(210, {
                key: 3,
                value: 'b'
            }), onNext(215, {
                key: 2,
                value: 'd'
            }), onNext(220, {
                key: 3,
                value: 'c'
            }), onNext(225, {
                key: 2,
                value: 'y'
            }), onNext(230, {
                key: 4,
                value: 'a'
            }), onNext(235, {
                key: 4,
                value: 'r'
            }), onCompleted(250)
        ];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.minBy(function (x) {
                return x.key;
            });
        }).messages;
        equal(2, res.length);
        ok(res[0].value.kind === 'N');
        equal(2, res[0].value.value.length);
        equal(2, res[0].value.value[0].key);
        equal('d', res[0].value.value[0].value);
        equal(2, res[0].value.value[1].key);
        equal('y', res[0].value.value[1].value);
        ok(res[1].value.kind === 'C' && res[1].time === 250);
    });

    test('MinBy_Throw', function () {
        var ex, msgs, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }), onError(210, ex)
        ];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.minBy(function (x) {
                return x.key;
            });
        }).messages;
        res.assertEqual(onError(210, ex));
    });
    test('MinBy_Never', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            })
        ];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.minBy(function (x) {
                return x.key;
            });
        }).messages;
        res.assertEqual();
    });

    test('MinBy_Comparer_Empty', function () {
        var msgs, res, reverseComparer, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }), onCompleted(250)
        ];
        reverseComparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a === b) {
                return 0;
            }
            return 1;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.minBy(function (x) {
                return x.key;
            }, reverseComparer);
        }).messages;
        equal(2, res.length);
        equal(0, res[0].value.value.length);
        ok(res[1].value.kind === 'C' && res[1].time === 250);
    });

    test('MinBy_Comparer_Return', function () {
        var msgs, res, reverseComparer, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }), onNext(210, {
                key: 2,
                value: 'a'
            }), onCompleted(250)
        ];
        reverseComparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a === b) {
                return 0;
            }
            return 1;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.minBy(function (x) {
                return x.key;
            }, reverseComparer);
        }).messages;
        equal(2, res.length);
        ok(res[0].value.kind === 'N');
        equal(1, res[0].value.value.length);
        equal(2, res[0].value.value[0].key);
        equal('a', res[0].value.value[0].value);
        ok(res[1].value.kind === 'C' && res[1].time === 250);
    });

    test('MinBy_Comparer_Some', function () {
        var msgs, res, reverseComparer, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }), onNext(210, {
                key: 3,
                value: 'b'
            }), onNext(220, {
                key: 20,
                value: 'c'
            }), onNext(230, {
                key: 4,
                value: 'a'
            }), onCompleted(250)
        ];
        reverseComparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a === b) {
                return 0;
            }
            return 1;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.minBy(function (x) {
                return x.key;
            }, reverseComparer);
        }).messages;
        equal(2, res.length);
        ok(res[0].value.kind === 'N');
        equal(1, res[0].value.value.length);
        equal(20, res[0].value.value[0].key);
        equal('c', res[0].value.value[0].value);
        ok(res[1].value.kind === 'C' && res[1].time === 250);
    });

    test('MinBy_Comparer_Throw', function () {
        var ex, msgs, res, reverseComparer, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }), onError(210, ex)
        ];
        reverseComparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a === b) {
                return 0;
            }
            return 1;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.minBy(function (x) {
                return x.key;
            }, reverseComparer);
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('MinBy_Comparer_Never', function () {
        var msgs, res, reverseComparer, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            })
        ];
        reverseComparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a === b) {
                return 0;
            }
            return 1;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.minBy(function (x) {
                return x.key;
            }, reverseComparer);
        }).messages;
        res.assertEqual();
    });

    test('MinBy_SelectorThrows', function () {
        var ex, msgs, res, reverseComparer, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }), onNext(210, {
                key: 3,
                value: 'b'
            }), onNext(220, {
                key: 2,
                value: 'c'
            }), onNext(230, {
                key: 4,
                value: 'a'
            }), onCompleted(250)
        ];
        reverseComparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a === b) {
                return 0;
            }
            return 1;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.minBy(function (x) {
                throw ex;
            }, reverseComparer);
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('MinBy_ComparerThrows', function () {
        var ex, msgs, res, reverseComparer, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }), onNext(210, {
                key: 3,
                value: 'b'
            }), onNext(220, {
                key: 2,
                value: 'c'
            }), onNext(230, {
                key: 4,
                value: 'a'
            }), onCompleted(250)
        ];
        reverseComparer = function (a, b) {
            throw ex;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.minBy(function (x) {
                return x.key;
            }, reverseComparer);
        }).messages;
        res.assertEqual(onError(220, ex));
    });

    test('Max_Int32_Empty', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.max();
        }).messages;
        equal(1, res.length);
        ok(res[0].value.kind === 'E' && res[0].value.exception !== null);
        ok(res[0].time === 250);
    });

    test('Max_Int32_Return', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.max();
        }).messages;
        res.assertEqual(onNext(250, 2), onCompleted(250));
    });

    test('Max_Int32_Some', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, 3), onNext(220, 4), onNext(230, 2), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.max();
        }).messages;
        res.assertEqual(onNext(250, 4), onCompleted(250));
    });

    test('Max_Int32_Throw', function () {
        var ex, msgs, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onError(210, ex)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.max();
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('Max_Int32_Never', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.max();
        }).messages;
        res.assertEqual();
    });

    test('MaxOfT_Comparer_Empty', function () {
        var msgs, res, reverseComparer, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onCompleted(250)];
        reverseComparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a < b) {
                return 1;
            }
            return 0;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.max(reverseComparer);
        }).messages;
        equal(1, res.length);
        ok(res[0].value.kind === 'E' && res[0].value.exception !== null);
        ok(res[0].time === 250);
    });

    test('MaxOfT_Comparer_Return', function () {
        var msgs, res, reverseComparer, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 'z'), onNext(210, 'a'), onCompleted(250)];
        reverseComparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a < b) {
                return 1;
            }
            return 0;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.max(reverseComparer);
        }).messages;
        res.assertEqual(onNext(250, 'a'), onCompleted(250));
    });

    test('MaxOfT_Comparer_Some', function () {
        var msgs, res, reverseComparer, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 'z'), onNext(210, 'b'), onNext(220, 'c'), onNext(230, 'a'), onCompleted(250)];
        reverseComparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a < b) {
                return 1;
            }
            return 0;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.max(reverseComparer);
        }).messages;
        res.assertEqual(onNext(250, 'a'), onCompleted(250));
    });

    test('MaxOfT_Comparer_Throw', function () {
        var ex, msgs, res, reverseComparer, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [onNext(150, 'z'), onError(210, ex)];
        reverseComparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a < b) {
                return 1;
            }
            return 0;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.max(reverseComparer);
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('MaxOfT_Comparer_Never', function () {
        var msgs, res, reverseComparer, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 'z')];
        reverseComparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a < b) {
                return 1;
            }
            return 0;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.max(reverseComparer);
        }).messages;
        res.assertEqual();
    });

    test('MaxOfT_ComparerThrows', function () {
        var ex, msgs, res, reverseComparer, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [onNext(150, 'z'), onNext(210, 'b'), onNext(220, 'c'), onNext(230, 'a'), onCompleted(250)];
        reverseComparer = function (a, b) {
            throw ex;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.max(reverseComparer);
        }).messages;
        res.assertEqual(onError(220, ex));
    });

    test('MaxBy_Empty', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, { key: 1, value: 'z' }),
            onCompleted(250)
        ];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.maxBy(function (x) {
                return x.key;
            });
        }).messages;
        equal(2, res.length);
        equal(0, res[0].value.value.length);
        ok(res[1].value.kind === 'C' && res[1].time === 250);
    });

    test('MaxBy_Return', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }), onNext(210, {
                key: 2,
                value: 'a'
            }), onCompleted(250)
        ];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.maxBy(function (x) {
                return x.key;
            });
        }).messages;
        equal(2, res.length);
        ok(res[0].value.kind === 'N');
        equal(1, res[0].value.value.length);
        equal(2, res[0].value.value[0].key);
        equal('a', res[0].value.value[0].value);
        ok(res[1].value.kind === 'C' && res[1].time === 250);
    });

    test('MaxBy_Some', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }), onNext(210, {
                key: 3,
                value: 'b'
            }), onNext(220, {
                key: 4,
                value: 'c'
            }), onNext(230, {
                key: 2,
                value: 'a'
            }), onCompleted(250)
        ];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.maxBy(function (x) {
                return x.key;
            });
        }).messages;
        equal(2, res.length);
        ok(res[0].value.kind === 'N');
        equal(1, res[0].value.value.length);
        equal(4, res[0].value.value[0].key);
        equal('c', res[0].value.value[0].value);
        ok(res[1].value.kind === 'C' && res[1].time === 250);
    });

    test('MaxBy_Multiple', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }),
            onNext(210, {
                key: 3,
                value: 'b'
            }),
            onNext(215, {
                key: 2,
                value: 'd'
            }),
            onNext(220, {
                key: 3,
                value: 'c'
            }),
            onNext(225, {
                key: 2,
                value: 'y'
            }),
            onNext(230, {
                key: 4,
                value: 'a'
            }),
            onNext(235, {
                key: 4,
                value: 'r'
            }),
            onCompleted(250)
        ];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.maxBy(function (x) {
                return x.key;
            });
        }).messages;
        equal(2, res.length);
        ok(res[0].value.kind === 'N');
        equal(2, res[0].value.value.length);
        equal(4, res[0].value.value[0].key);
        equal('a', res[0].value.value[0].value);
        equal(4, res[0].value.value[1].key);
        equal('r', res[0].value.value[1].value);
        ok(res[1].value.kind === 'C' && res[1].time === 250);
    });

    test('MaxBy_Throw', function () {
        var ex, msgs, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }),
            onError(210, ex)
        ];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.maxBy(function (x) {
                return x.key;
            });
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('MaxBy_Never', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            })
        ];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.maxBy(function (x) {
                return x.key;
            });
        }).messages;
        res.assertEqual();
    });

    test('MaxBy_Comparer_Empty', function () {
        var msgs, res, reverseComparer, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }),
            onCompleted(250)
        ];
        reverseComparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a < b) {
                return 1;
            }
            return 0;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.maxBy(function (x) {
                return x.key;
            }, reverseComparer);
        }).messages;
        equal(2, res.length);
        equal(0, res[0].value.value.length);
        ok(res[1].value.kind === 'C' && res[1].time === 250);
    });

    test('MaxBy_Comparer_Return', function () {
        var msgs, res, reverseComparer, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }), onNext(210, {
                key: 2,
                value: 'a'
            }), onCompleted(250)
        ];
        reverseComparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a < b) {
                return 1;
            }
            return 0;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.maxBy(function (x) {
                return x.key;
            }, reverseComparer);
        }).messages;
        equal(2, res.length);
        ok(res[0].value.kind === 'N');
        equal(1, res[0].value.value.length);
        equal(2, res[0].value.value[0].key);
        equal('a', res[0].value.value[0].value);
        ok(res[1].value.kind === 'C' && res[1].time === 250);
    });

    test('MaxBy_Comparer_Some', function () {
        var msgs, res, reverseComparer, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }), onNext(210, {
                key: 3,
                value: 'b'
            }), onNext(220, {
                key: 4,
                value: 'c'
            }), onNext(230, {
                key: 2,
                value: 'a'
            }), onCompleted(250)
        ];
        reverseComparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a < b) {
                return 1;
            }
            return 0;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.maxBy(function (x) {
                return x.key;
            }, reverseComparer);
        }).messages;
        equal(2, res.length);
        ok(res[0].value.kind === 'N');
        equal(1, res[0].value.value.length);
        equal(2, res[0].value.value[0].key);
        equal('a', res[0].value.value[0].value);
        ok(res[1].value.kind === 'C' && res[1].time === 250);
    });

    test('MaxBy_Comparer_Throw', function () {
        var ex, msgs, res, reverseComparer, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }), onError(210, ex)
        ];
        reverseComparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a < b) {
                return 1;
            }
            return 0;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.maxBy(function (x) {
                return x.key;
            }, reverseComparer);
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('MaxBy_Comparer_Never', function () {
        var msgs, res, reverseComparer, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            })
        ];
        reverseComparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a < b) {
                return 1;
            }
            return 0;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.maxBy(function (x) {
                return x.key;
            }, reverseComparer);
        }).messages;
        res.assertEqual();
    });

    test('MaxBy_SelectorThrows', function () {
        var ex, msgs, res, reverseComparer, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }), onNext(210, {
                key: 3,
                value: 'b'
            }), onNext(220, {
                key: 2,
                value: 'c'
            }), onNext(230, {
                key: 4,
                value: 'a'
            }), onCompleted(250)
        ];
        reverseComparer = function (a, b) {
            if (a > b) {
                return -1;
            }
            if (a < b) {
                return 1;
            }
            return 0;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.maxBy(function (x) {
                throw ex;
            }, reverseComparer);
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('MaxBy_ComparerThrows', function () {
        var ex, msgs, res, reverseComparer, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [
            onNext(150, {
                key: 1,
                value: 'z'
            }), onNext(210, {
                key: 3,
                value: 'b'
            }), onNext(220, {
                key: 2,
                value: 'c'
            }), onNext(230, {
                key: 4,
                value: 'a'
            }), onCompleted(250)
        ];
        reverseComparer = function (a, b) {
            throw ex;
        };
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.maxBy(function (x) {
                return x.key;
            }, reverseComparer);
        }).messages;
        res.assertEqual(onError(220, ex));
    });

    test('Average_Int32_Empty', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.average();
        }).messages;
        equal(1, res.length);
        ok(res[0].value.kind === 'E' && res[0].value.exception !== null);
        ok(res[0].time === 250);
    });

    test('Average_Int32_Return', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, 2), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.average();
        }).messages;
        res.assertEqual(onNext(250, 2), onCompleted(250));
    });

    test('Average_Int32_Some', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onNext(210, 3), onNext(220, 4), onNext(230, 2), onCompleted(250)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.average();
        }).messages;
        res.assertEqual(onNext(250, 3), onCompleted(250));
    });

    test('Average_Int32_Throw', function () {
        var ex, msgs, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1), onError(210, ex)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.average();
        }).messages;
        res.assertEqual(onError(210, ex));
    });

    test('Average_Int32_Never', function () {
        var msgs, res, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(150, 1)];
        xs = scheduler.createHotObservable(msgs);
        res = scheduler.startWithCreate(function () {
            return xs.average();
        }).messages;
        res.assertEqual();
    });
    test('Average_Selector_Regular_Int32', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(210, "b"), onNext(220, "fo"), onNext(230, "qux"), onCompleted(240));
        res = scheduler.startWithCreate(function () {
            return xs.average(function (x) {
                return x.length;
            });
        });
        res.messages.assertEqual(onNext(240, 2), onCompleted(240));
        xs.subscriptions.assertEqual(subscribe(200, 240));
    });

    test('ToArray_Completed', function () {
        var msgs, results, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(110, 1), onNext(220, 2), onNext(330, 3), onNext(440, 4), onNext(550, 5), onCompleted(660)];
        xs = scheduler.createHotObservable(msgs);
        results = scheduler.startWithCreate(function () {
            return xs.toArray();
        }).messages;
        equal(2, results.length);
        equal(660, results[0].time);
        equal('N', results[0].value.kind);
        results[0].value.value.assertEqual(2, 3, 4, 5);
        ok(onCompleted(660).equals(results[1]));
        xs.subscriptions.assertEqual(subscribe(200, 660));
    });

    test('ToArray_Error', function () {
        var ex, msgs, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs = [onNext(110, 1), onNext(220, 2), onNext(330, 3), onNext(440, 4), onNext(550, 5), onError(660, ex)];
        xs = scheduler.createHotObservable(msgs);
        results = scheduler.startWithCreate(function () {
            return xs.toArray();
        }).messages;
        results.assertEqual(onError(660, ex));
        xs.subscriptions.assertEqual(subscribe(200, 660));
    });

    test('ToArray_Disposed', function () {
        var msgs, results, scheduler, xs;
        scheduler = new TestScheduler();
        msgs = [onNext(110, 1), onNext(220, 2), onNext(330, 3), onNext(440, 4), onNext(550, 5)];
        xs = scheduler.createHotObservable(msgs);
        results = scheduler.startWithCreate(function () {
            return xs.toArray();
        }).messages;
        results.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });

    test('SequenceEqual_Equal', function () {
        var msgs1, msgs2, results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        msgs1 = [onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 5), onNext(340, 6), onNext(450, 7), onCompleted(510)];
        msgs2 = [onNext(90, 1), onNext(270, 3), onNext(280, 4), onNext(300, 5), onNext(330, 6), onNext(340, 7), onCompleted(720)];
        xs = scheduler.createHotObservable(msgs1);
        ys = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return xs.sequenceEqual(ys);
        });
        results.messages.assertEqual(onNext(720, true), onCompleted(720));
        xs.subscriptions.assertEqual(subscribe(200, 720));
        ys.subscriptions.assertEqual(subscribe(200, 720));
    });

    test('SequenceEqual_Equal_Sym', function () {
        var msgs1, msgs2, results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        msgs1 = [onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 5), onNext(340, 6), onNext(450, 7), onCompleted(510)];
        msgs2 = [onNext(90, 1), onNext(270, 3), onNext(280, 4), onNext(300, 5), onNext(330, 6), onNext(340, 7), onCompleted(720)];
        xs = scheduler.createHotObservable(msgs1);
        ys = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return ys.sequenceEqual(xs);
        });
        results.messages.assertEqual(onNext(720, true), onCompleted(720));
        xs.subscriptions.assertEqual(subscribe(200, 720));
        ys.subscriptions.assertEqual(subscribe(200, 720));
    });

    test('SequenceEqual_NotEqual_Left', function () {
        var msgs1, msgs2, results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        msgs1 = [onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 0), onNext(340, 6), onNext(450, 7), onCompleted(510)];
        msgs2 = [onNext(90, 1), onNext(270, 3), onNext(280, 4), onNext(300, 5), onNext(330, 6), onNext(340, 7), onCompleted(720)];
        xs = scheduler.createHotObservable(msgs1);
        ys = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return xs.sequenceEqual(ys);
        });
        results.messages.assertEqual(onNext(310, false), onCompleted(310));
        xs.subscriptions.assertEqual(subscribe(200, 310));
        ys.subscriptions.assertEqual(subscribe(200, 310));
    });

    test('SequenceEqual_NotEqual_Left_Sym', function () {
        var msgs1, msgs2, results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        msgs1 = [onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 0), onNext(340, 6), onNext(450, 7), onCompleted(510)];
        msgs2 = [onNext(90, 1), onNext(270, 3), onNext(280, 4), onNext(300, 5), onNext(330, 6), onNext(340, 7), onCompleted(720)];
        xs = scheduler.createHotObservable(msgs1);
        ys = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return ys.sequenceEqual(xs);
        });
        results.messages.assertEqual(onNext(310, false), onCompleted(310));
        xs.subscriptions.assertEqual(subscribe(200, 310));
        ys.subscriptions.assertEqual(subscribe(200, 310));
    });

    test('SequenceEqual_NotEqual_Right', function () {
        var msgs1, msgs2, results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        msgs1 = [onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 5), onNext(340, 6), onNext(450, 7), onCompleted(510)];
        msgs2 = [onNext(90, 1), onNext(270, 3), onNext(280, 4), onNext(300, 5), onNext(330, 6), onNext(340, 7), onNext(350, 8)];
        xs = scheduler.createHotObservable(msgs1);
        ys = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return xs.sequenceEqual(ys);
        });
        results.messages.assertEqual(onNext(510, false), onCompleted(510));
        xs.subscriptions.assertEqual(subscribe(200, 510));
        ys.subscriptions.assertEqual(subscribe(200, 510));
    });

    test('SequenceEqual_NotEqual_Right_Sym', function () {
        var msgs1, msgs2, results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        msgs1 = [onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 5), onNext(340, 6), onNext(450, 7), onCompleted(510)];
        msgs2 = [onNext(90, 1), onNext(270, 3), onNext(280, 4), onNext(300, 5), onNext(330, 6), onNext(340, 7), onNext(350, 8)];
        xs = scheduler.createHotObservable(msgs1);
        ys = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return ys.sequenceEqual(xs);
        });
        results.messages.assertEqual(onNext(510, false), onCompleted(510));
        xs.subscriptions.assertEqual(subscribe(200, 510));
        ys.subscriptions.assertEqual(subscribe(200, 510));
    });

    test('SequenceEqual_NotEqual_2', function () {
        var msgs1, msgs2, results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        msgs1 = [onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 5), onNext(340, 6), onNext(450, 7), onNext(490, 8), onNext(520, 9), onNext(580, 10), onNext(600, 11)];
        msgs2 = [onNext(90, 1), onNext(270, 3), onNext(280, 4), onNext(300, 5), onNext(330, 6), onNext(340, 7), onNext(350, 9), onNext(400, 9), onNext(410, 10), onNext(490, 11), onNext(550, 12), onNext(560, 13)];
        xs = scheduler.createHotObservable(msgs1);
        ys = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return xs.sequenceEqual(ys);
        });
        results.messages.assertEqual(onNext(490, false), onCompleted(490));
        xs.subscriptions.assertEqual(subscribe(200, 490));
        ys.subscriptions.assertEqual(subscribe(200, 490));
    });

    test('SequenceEqual_NotEqual_2_Sym', function () {
        var msgs1, msgs2, results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        msgs1 = [onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 5), onNext(340, 6), onNext(450, 7), onNext(490, 8), onNext(520, 9), onNext(580, 10), onNext(600, 11)];
        msgs2 = [onNext(90, 1), onNext(270, 3), onNext(280, 4), onNext(300, 5), onNext(330, 6), onNext(340, 7), onNext(350, 9), onNext(400, 9), onNext(410, 10), onNext(490, 11), onNext(550, 12), onNext(560, 13)];
        xs = scheduler.createHotObservable(msgs1);
        ys = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return ys.sequenceEqual(xs);
        });
        results.messages.assertEqual(onNext(490, false), onCompleted(490));
        xs.subscriptions.assertEqual(subscribe(200, 490));
        ys.subscriptions.assertEqual(subscribe(200, 490));
    });

    test('SequenceEqual_NotEqual_3', function () {
        var msgs1, msgs2, results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        msgs1 = [onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 5), onCompleted(330)];
        msgs2 = [onNext(90, 1), onNext(270, 3), onNext(400, 4), onCompleted(420)];
        xs = scheduler.createHotObservable(msgs1);
        ys = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return xs.sequenceEqual(ys);
        });
        results.messages.assertEqual(onNext(420, false), onCompleted(420));
        xs.subscriptions.assertEqual(subscribe(200, 420));
        ys.subscriptions.assertEqual(subscribe(200, 420));
    });

    test('SequenceEqual_NotEqual_3_Sym', function () {
        var msgs1, msgs2, results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        msgs1 = [onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 5), onCompleted(330)];
        msgs2 = [onNext(90, 1), onNext(270, 3), onNext(400, 4), onCompleted(420)];
        xs = scheduler.createHotObservable(msgs1);
        ys = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return ys.sequenceEqual(xs);
        });
        results.messages.assertEqual(onNext(420, false), onCompleted(420));
        xs.subscriptions.assertEqual(subscribe(200, 420));
        ys.subscriptions.assertEqual(subscribe(200, 420));
    });

    test('SequenceEqual_ComparerThrows', function () {
        var ex, msgs1, msgs2, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 5), onCompleted(330)];
        msgs2 = [onNext(90, 1), onNext(270, 3), onNext(400, 4), onCompleted(420)];
        xs = scheduler.createHotObservable(msgs1);
        ys = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return xs.sequenceEqual(ys, function (a, b) {
                throw ex;
            });
        });
        results.messages.assertEqual(onError(270, ex));
        xs.subscriptions.assertEqual(subscribe(200, 270));
        ys.subscriptions.assertEqual(subscribe(200, 270));
    });

    test('SequenceEqual_ComparerThrows_Sym', function () {
        var ex, msgs1, msgs2, results, scheduler, xs, ys;
        ex = 'ex';
        scheduler = new TestScheduler();
        msgs1 = [onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 5), onCompleted(330)];
        msgs2 = [onNext(90, 1), onNext(270, 3), onNext(400, 4), onCompleted(420)];
        xs = scheduler.createHotObservable(msgs1);
        ys = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return ys.sequenceEqual(xs, function (a, b) {
                throw ex;
            });
        });
        results.messages.assertEqual(onError(270, ex));
        xs.subscriptions.assertEqual(subscribe(200, 270));
        ys.subscriptions.assertEqual(subscribe(200, 270));
    });

    test('SequenceEqual_NotEqual_4', function () {
        var msgs1, msgs2, results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        msgs1 = [onNext(250, 1), onCompleted(300)];
        msgs2 = [onNext(290, 1), onNext(310, 2), onCompleted(350)];
        xs = scheduler.createHotObservable(msgs1);
        ys = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return xs.sequenceEqual(ys);
        });
        results.messages.assertEqual(onNext(310, false), onCompleted(310));
        xs.subscriptions.assertEqual(subscribe(200, 310));
        ys.subscriptions.assertEqual(subscribe(200, 310));
    });

    test('SequenceEqual_NotEqual_4_Sym', function () {
        var msgs1, msgs2, results, scheduler, xs, ys;
        scheduler = new TestScheduler();
        msgs1 = [onNext(250, 1), onCompleted(300)];
        msgs2 = [onNext(290, 1), onNext(310, 2), onCompleted(350)];
        xs = scheduler.createHotObservable(msgs1);
        ys = scheduler.createHotObservable(msgs2);
        results = scheduler.startWithCreate(function () {
            return ys.sequenceEqual(xs);
        });
        results.messages.assertEqual(onNext(310, false), onCompleted(310));
        xs.subscriptions.assertEqual(subscribe(200, 310));
        ys.subscriptions.assertEqual(subscribe(200, 310));
    });

    test('IsEmpty_Empty', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.isEmpty();
        }).messages;
        res.assertEqual(onNext(250, true), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('IsEmpty_Return', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.isEmpty();
        }).messages;
        res.assertEqual(onNext(210, false), onCompleted(210));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('IsEmpty_Throw', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.isEmpty();
        }).messages;
        res.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('IsEmpty_Never', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1));
        res = scheduler.startWithCreate(function () {
            return xs.isEmpty();
        }).messages;
        res.assertEqual();
        xs.subscriptions.assertEqual(subscribe(200, 1000));
    });

    // SequenceEqual Array
    test('SequenceEqual_Enumerable_Equal', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 5), onNext(340, 6), onNext(450, 7), onCompleted(510));
        res = scheduler.startWithCreate(function () {
            return xs.sequenceEqual([3, 4, 5, 6, 7]);
        });
        res.messages.assertEqual(onNext(510, true), onCompleted(510));
        xs.subscriptions.assertEqual(subscribe(200, 510));
    });

    test('SequenceEqual_Enumerable_NotEqual_Elements', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 5), onNext(340, 6), onNext(450, 7), onCompleted(510));
        res = scheduler.startWithCreate(function () {
            return xs.sequenceEqual([3, 4, 9, 6, 7]);
        });
        res.messages.assertEqual(onNext(310, false), onCompleted(310));
        xs.subscriptions.assertEqual(subscribe(200, 310));
    });

    test('SequenceEqual_Enumerable_Comparer_Equal', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 5), onNext(340, 6), onNext(450, 7), onCompleted(510));
        res = scheduler.startWithCreate(function () {
            return xs.sequenceEqual([3 - 2, 4, 5, 6 + 42, 7 - 6], function (x, y) {
                return x % 2 === y % 2;
            });
        });
        res.messages.assertEqual(onNext(510, true), onCompleted(510));
        xs.subscriptions.assertEqual(subscribe(200, 510));
    });

    test('SequenceEqual_Enumerable_Comparer_NotEqual', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 5), onNext(340, 6), onNext(450, 7), onCompleted(510));
        res = scheduler.startWithCreate(function () {
            return xs.sequenceEqual([3 - 2, 4, 5 + 9, 6 + 42, 7 - 6], function (x, y) {
                return x % 2 === y % 2;
            });
        });
        res.messages.assertEqual(onNext(310, false), onCompleted(310));
        xs.subscriptions.assertEqual(subscribe(200, 310));
    });

    function throwComparer(value, exn) {
        return function (x, y) {
            if (x === value) {
                throw exn;
            }
            return x === y;
        };
    }

    test('SequenceEqual_Enumerable_Comparer_Throws', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 5), onNext(340, 6), onNext(450, 7), onCompleted(510));
        res = scheduler.startWithCreate(function () {
            return xs.sequenceEqual([3, 4, 5, 6, 7], throwComparer(5, ex));
        });
        res.messages.assertEqual(onError(310, ex));
        xs.subscriptions.assertEqual(subscribe(200, 310));
    });

    test('SequenceEqual_Enumerable_NotEqual_TooLong', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 5), onNext(340, 6), onNext(450, 7), onCompleted(510));
        res = scheduler.startWithCreate(function () {
            return xs.sequenceEqual([3, 4, 5, 6, 7, 8]);
        });
        res.messages.assertEqual(onNext(510, false), onCompleted(510));
        xs.subscriptions.assertEqual(subscribe(200, 510));
    });

    test('SequenceEqual_Enumerable_NotEqual_TooShort', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onNext(310, 5), onNext(340, 6), onNext(450, 7), onCompleted(510));
        res = scheduler.startWithCreate(function () {
            return xs.sequenceEqual([3, 4, 5, 6]);
        });
        res.messages.assertEqual(onNext(450, false), onCompleted(450));
        xs.subscriptions.assertEqual(subscribe(200, 450));
    });

    test('SequenceEqual_Enumerable_OnError', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(110, 1), onNext(190, 2), onNext(240, 3), onNext(290, 4), onError(310, ex));
        res = scheduler.startWithCreate(function () {
            return xs.sequenceEqual([3, 4]);
        });
        res.messages.assertEqual(onError(310, ex));
        xs.subscriptions.assertEqual(subscribe(200, 310));
    });

    // ElementAt
    test('ElementAt_First', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onNext(470, 44), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.elementAt(0);
        });
        results.messages.assertEqual(onNext(280, 42), onCompleted(280));
        xs.subscriptions.assertEqual(subscribe(200, 280));
    });

    test('ElementAt_Other', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onNext(470, 44), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.elementAt(2);
        });
        results.messages.assertEqual(onNext(470, 44), onCompleted(470));
        xs.subscriptions.assertEqual(subscribe(200, 470));
    });

    test('ElementAt_OutOfRange', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onNext(470, 44), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.elementAt(3);
        });
        equal(1, results.messages.length);
        equal(600, results.messages[0].time);
        equal('E', results.messages[0].value.kind);
        ok(results.messages[0].value.exception !== null);
    });

    test('ElementAt_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onError(420, ex));
        results = scheduler.startWithCreate(function () {
            return xs.elementAt(3);
        });
        results.messages.assertEqual(onError(420, ex));
        xs.subscriptions.assertEqual(subscribe(200, 420));
    });

    test('ElementAtOrDefault_First', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onNext(470, 44), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.elementAtOrDefault(0);
        });
        results.messages.assertEqual(onNext(280, 42), onCompleted(280));
        xs.subscriptions.assertEqual(subscribe(200, 280));
    });

    test('ElementAtOrDefault_Other', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onNext(470, 44), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.elementAtOrDefault(2);
        });
        results.messages.assertEqual(onNext(470, 44), onCompleted(470));
        xs.subscriptions.assertEqual(subscribe(200, 470));
    });

    test('ElementAtOrDefault_OutOfRange', function () {
        var results, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onNext(470, 44), onCompleted(600));
        results = scheduler.startWithCreate(function () {
            return xs.elementAtOrDefault(3, 0);
        });
        results.messages.assertEqual(onNext(600, 0), onCompleted(600));
        xs.subscriptions.assertEqual(subscribe(200, 600));
    });

    test('ElementAtOrDefault_Error', function () {
        var ex, results, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(280, 42), onNext(360, 43), onError(420, ex));
        results = scheduler.startWithCreate(function () {
            return xs.elementAtOrDefault(3);
        });
        results.messages.assertEqual(onError(420, ex));
        xs.subscriptions.assertEqual(subscribe(200, 420));
    });

    // First Async
    test('FirstAsync_Empty', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.first();
        });
        res.messages.assertEqual(onError(250, function (e) {
            return e !== null;
        }));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('FirstAsync_One', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.first();
        });
        res.messages.assertEqual(onNext(210, 2), onCompleted(210));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('FirstAsync_Many', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.first();
        });
        res.messages.assertEqual(onNext(210, 2), onCompleted(210));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('FirstAsync_Error', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.first();
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('FirstAsync_Predicate', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.first(function (x) {
                return x % 2 === 1;
            });
        });
        res.messages.assertEqual(onNext(220, 3), onCompleted(220));
        xs.subscriptions.assertEqual(subscribe(200, 220));
    });

    test('FirstAsync_Predicate_None', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.first(function (x) {
                return x > 10;
            });
        });
        res.messages.assertEqual(onError(250, function (e) {
            return e !== null;
        }));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('FirstAsync_Predicate_Throw', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onError(220, ex));
        res = scheduler.startWithCreate(function () {
            return xs.first(function (x) {
                return x % 2 === 1;
            });
        });
        res.messages.assertEqual(onError(220, ex));
        xs.subscriptions.assertEqual(subscribe(200, 220));
    });

    test('FirstAsync_PredicateThrows', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.first(function (x) {
                if (x < 4) {
                    return false;
                } else {
                    throw ex;
                }
            });
        });
        res.messages.assertEqual(onError(230, ex));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });

    // First or default
    test('FirstOrDefaultAsync_Empty', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.firstOrDefault(null, 0);
        });
        res.messages.assertEqual(onNext(250, 0), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('FirstOrDefaultAsync_One', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.firstOrDefault(null, 0);
        });
        res.messages.assertEqual(onNext(210, 2), onCompleted(210));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('FirstOrDefaultAsync_Many', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.firstOrDefault(null, 0);
        });
        res.messages.assertEqual(onNext(210, 2), onCompleted(210));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('FirstOrDefaultAsync_Error', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.firstOrDefault(null, 0);
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('FirstOrDefaultAsync_Predicate', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.firstOrDefault(function (x) {
                return x % 2 === 1;
            }, 0);
        });
        res.messages.assertEqual(onNext(220, 3), onCompleted(220));
        xs.subscriptions.assertEqual(subscribe(200, 220));
    });

    test('FirstOrDefaultAsync_Predicate_None', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.firstOrDefault(function (x) {
                return x > 10;
            }, 0);
        });
        res.messages.assertEqual(onNext(250, 0), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('FirstOrDefaultAsync_Predicate_Throw', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onError(220, ex));
        res = scheduler.startWithCreate(function () {
            return xs.firstOrDefault(function (x) {
                return x % 2 === 1;
            }, 0);
        });
        res.messages.assertEqual(onError(220, ex));
        xs.subscriptions.assertEqual(subscribe(200, 220));
    });

    test('FirstOrDefaultAsync_PredicateThrows', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.firstOrDefault(function (x) {
                if (x < 4) {
                    return false;
                } else {
                    throw ex;
                }
            }, 0);
        });
        res.messages.assertEqual(onError(230, ex));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });

    // Last
    test('LastAsync_Empty', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.last();
        });
        res.messages.assertEqual(onError(250, function (e) {
            return e !== null;
        }));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('LastAsync_One', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.last();
        });
        res.messages.assertEqual(onNext(250, 2), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });
    test('LastAsync_Many', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.last();
        });
        res.messages.assertEqual(onNext(250, 3), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('LastAsync_Error', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.last();
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('LastAsync_Predicate', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.last(function (x) {
                return x % 2 === 1;
            });
        });
        res.messages.assertEqual(onNext(250, 5), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('LastAsync_Predicate_None', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.last(function (x) {
                return x > 10;
            });
        });
        res.messages.assertEqual(onError(250, function (e) {
            return e !== null;
        }));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('LastAsync_Predicate_Throw', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.last(function (x) {
                return x % 2 === 1;
            });
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('LastAsync_PredicateThrows', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.last(function (x) {
                if (x < 4) {
                    return x % 2 === 1;
                } else {
                    throw ex;
                }
            });
        });
        res.messages.assertEqual(onError(230, ex));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });

    // Last or Default
    test('LastOrDefaultAsync_Empty', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.lastOrDefault(null, 0);
        });
        res.messages.assertEqual(onNext(250, 0), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('LastOrDefaultAsync_One', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.lastOrDefault(null, 0);
        });
        res.messages.assertEqual(onNext(250, 2), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('LastOrDefaultAsync_Many', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.lastOrDefault(null, 0);
        });
        res.messages.assertEqual(onNext(250, 3), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('LastOrDefaultAsync_Error', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.lastOrDefault(null, 0);
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('LastOrDefaultAsync_Predicate', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.lastOrDefault(function (x) {
                return x % 2 === 1;
            }, 0);
        });
        res.messages.assertEqual(onNext(250, 5), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('LastOrDefaultAsync_Predicate_None', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.lastOrDefault(function (x) {
                return x > 10;
            }, 0);
        });
        res.messages.assertEqual(onNext(250, 0), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('LastOrDefaultAsync_Predicate_Throw', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.lastOrDefault(function (x) {
                return x > 10;
            }, 0);
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('LastOrDefaultAsync_PredicateThrows', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.lastOrDefault(function (x) {
                if (x < 4) {
                    return x % 2 === 1;
                } else {
                    throw ex;
                }
            }, 0);
        });
        res.messages.assertEqual(onError(230, ex));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });

    // Single
    test('SingleAsync_Empty', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.single();
        });
        res.messages.assertEqual(onError(250, function (e) {
            return e !== null;
        }));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('SingleAsync_One', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.single();
        });
        res.messages.assertEqual(onNext(250, 2), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('SingleAsync_Many', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.single();
        });
        res.messages.assertEqual(onError(220, function (e) {
            return e !== null;
        }));
        xs.subscriptions.assertEqual(subscribe(200, 220));
    });

    test('SingleAsync_Error', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.single();
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('SingleAsync_Predicate', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.single(function (x) {
                return x % 2 === 1;
            });
        });
        res.messages.assertEqual(onError(240, function (e) {
            return e !== null;
        }));
        xs.subscriptions.assertEqual(subscribe(200, 240));
    });

    test('SingleAsync_Predicate_Empty', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.single(function (x) {
                return x % 2 === 1;
            });
        });
        res.messages.assertEqual(onError(250, function (e) {
            return e !== null;
        }));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('SingleAsync_Predicate_One', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.single(function (x) {
                return x === 4;
            });
        });
        res.messages.assertEqual(onNext(250, 4), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('SingleAsync_Predicate_Throw', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.single(function (x) {
                return x > 10;
            });
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('SingleAsync_PredicateThrows', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.single(function (x) {
                if (x < 4) {
                    return false;
                } else {
                    throw ex;
                }
            });
        });
        res.messages.assertEqual(onError(230, ex));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });

    // Single Or Default
    test('SingleOrDefaultAsync_Empty', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.singleOrDefault(null, 0);
        });
        res.messages.assertEqual(onNext(250, 0), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('SingleOrDefaultAsync_One', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.singleOrDefault(null, 0);
        });
        res.messages.assertEqual(onNext(250, 2), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('SingleOrDefaultAsync_Many', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.singleOrDefault(null, 0);
        });
        res.messages.assertEqual(onError(220, function (e) {
            return e !== null;
        }));
        xs.subscriptions.assertEqual(subscribe(200, 220));
    });

    test('SingleOrDefaultAsync_Error', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.singleOrDefault(null, 0);
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('SingleOrDefaultAsync_Predicate', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.singleOrDefault(function (x) {
                return x % 2 === 1;
            }, 0);
        });
        res.messages.assertEqual(onError(240, function (e) {
            return e !== null;
        }));
        xs.subscriptions.assertEqual(subscribe(200, 240));
    });

    test('SingleOrDefaultAsync_Predicate_Empty', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.singleOrDefault(function (x) {
                return x % 2 === 1;
            }, 0);
        });
        res.messages.assertEqual(onNext(250, 0), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('SingleOrDefaultAsync_Predicate_One', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.singleOrDefault(function (x) {
                return x === 4;
            }, 0);
        });
        res.messages.assertEqual(onNext(250, 4), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('SingleOrDefaultAsync_Predicate_None', function () {
        var res, scheduler, xs;
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.singleOrDefault(function (x) {
                return x > 10;
            }, 0);
        });
        res.messages.assertEqual(onNext(250, 0), onCompleted(250));
        xs.subscriptions.assertEqual(subscribe(200, 250));
    });

    test('SingleOrDefaultAsync_Predicate_Throw', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onError(210, ex));
        res = scheduler.startWithCreate(function () {
            return xs.singleOrDefault(function (x) {
                return x > 10;
            }, 0);
        });
        res.messages.assertEqual(onError(210, ex));
        xs.subscriptions.assertEqual(subscribe(200, 210));
    });

    test('SingleOrDefaultAsync_PredicateThrows', function () {
        var ex, res, scheduler, xs;
        ex = 'ex';
        scheduler = new TestScheduler();
        xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
        res = scheduler.startWithCreate(function () {
            return xs.singleOrDefault(function (x) {
                if (x < 4) {
                    return false;
                } else {
                    throw ex;
                }
            }, 0);
        });
        res.messages.assertEqual(onError(230, ex));
        xs.subscriptions.assertEqual(subscribe(200, 230));
    });

    // must call `QUnit.start()` if using QUnit < 1.3.0 with Node.js or any
    // version of QUnit with Narwhal, Rhino, or RingoJS
    if (!window.document) {
        QUnit.start();
    }
}(typeof global == 'object' && global || this));