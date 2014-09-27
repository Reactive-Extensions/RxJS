QUnit.module('MaxBy');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

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
