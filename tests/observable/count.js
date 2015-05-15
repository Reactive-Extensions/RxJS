QUnit.module('Count');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

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

test('Count_After_Range', function() {

    var scheduler = new TestScheduler();
    var xs = Rx.Observable.range(1, 10, scheduler);

    var result = scheduler.startWithCreate(function(){
        return xs.count();
    });

    result.messages.assertEqual(onNext(211, 10), onCompleted(211));
});

test('Count_After_Skip', function() {

    var scheduler = new TestScheduler();
    var xs = Rx.Observable.range(1, 10, scheduler).skip(1);

    var result = scheduler.startWithCreate(function(){
        return xs.count();
    });

    result.messages.assertEqual(onNext(211, 9), onCompleted(211));
});

test('Count_After_Take', function() {

    var scheduler = new TestScheduler();
    var xs = Rx.Observable.range(1, 10, scheduler).take(1);

    var result = scheduler.startWithCreate(function(){
        return xs.count();
    });

    result.messages.assertEqual(onNext(201, 1), onCompleted(201));
});
