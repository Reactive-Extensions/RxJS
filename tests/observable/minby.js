QUnit.module('MinBy');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

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
