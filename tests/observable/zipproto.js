QUnit.module('ZipProto');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Zip_NeverNever', function () {
    var o1, o2, results, scheduler;
    scheduler = new TestScheduler();
    o1 = Observable.never();
    o2 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return o1.zip(o2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual();
});

test('Zip_NeverEmpty', function () {
    var msgs, o1, o2, results, scheduler;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onCompleted(210)];
    o1 = Observable.never();
    o2 = scheduler.createHotObservable(msgs);
    results = scheduler.startWithCreate(function () {
        return o1.zip(o2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual();
});

test('Zip_EmptyEmpty', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(210)];
    msgs2 = [onNext(150, 1), onCompleted(210)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.zip(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onCompleted(210));
});

test('Zip_EmptyNonEmpty', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(210)];
    msgs2 = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.zip(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onCompleted(215));
});

test('Zip_NonEmptyEmpty', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(210)];
    msgs2 = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e2.zip(e1, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onCompleted(215));
});

test('Zip_NeverNonEmpty', function () {
    var e1, e2, msgs, results, scheduler;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
    e1 = scheduler.createHotObservable(msgs);
    e2 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return e2.zip(e1, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual();
});

test('Zip_NonEmptyNever', function () {
    var e1, e2, msgs, results, scheduler;
    scheduler = new TestScheduler();
    msgs = [onNext(150, 1), onNext(215, 2), onCompleted(220)];
    e1 = scheduler.createHotObservable(msgs);
    e2 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return e1.zip(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual();
});

test('Zip_NonEmptyNonEmpty', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(215, 2), onCompleted(230)];
    msgs2 = [onNext(150, 1), onNext(220, 3), onCompleted(240)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.zip(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onNext(220, 2 + 3), onCompleted(240));
});

test('Zip_EmptyError', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(230)];
    msgs2 = [onNext(150, 1), onError(220, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.zip(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
});

test('Zip_ErrorEmpty', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(230)];
    msgs2 = [onNext(150, 1), onError(220, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e2.zip(e1, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
});

test('Zip_NeverError', function () {
    var e1, e2, ex, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs2 = [onNext(150, 1), onError(220, ex)];
    e1 = Observable.never();
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.zip(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
});

test('Zip_ErrorNever', function () {
    var e1, e2, ex, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs2 = [onNext(150, 1), onError(220, ex)];
    e1 = Observable.never();
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e2.zip(e1, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
});

test('Zip_ErrorError', function () {
    var e1, e2, ex1, ex2, msgs1, msgs2, results, scheduler;
    ex1 = 'ex1';
    ex2 = 'ex2';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onError(230, ex1)];
    msgs2 = [onNext(150, 1), onError(220, ex2)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e2.zip(e1, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex2));
});

test('Zip_SomeError', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(215, 2), onCompleted(230)];
    msgs2 = [onNext(150, 1), onError(220, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.zip(e2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
});

test('Zip_ErrorSome', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(215, 2), onCompleted(230)];
    msgs2 = [onNext(150, 1), onError(220, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e2.zip(e1, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
});

test('Zip_SomeDataAsymmetric1', function () {
    var e1, e2, i, len, msgs1, msgs2, results, scheduler, sum, time;
    scheduler = new TestScheduler();
    msgs1 = (function () {
        var _results;
        _results = [];
        for (i = 0; i < 5; i++) {
            _results.push(onNext(205 + i * 5, i));
        }
        return _results;
    })();
    msgs2 = (function () {
        var _results;
        _results = [];
        for (i = 0; i < 10; i++) {
            _results.push(onNext(205 + i * 8, i));
        }
        return _results;
    })();
    len = Math.min(msgs1.length, msgs2.length);
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.zip(e2, function (x, y) {
            return x + y;
        });
    }).messages;
    equal(len, results.length);
    for (i = 0; i < len; i++) {
        sum = msgs1[i].value.value + msgs2[i].value.value;
        time = Math.max(msgs1[i].time, msgs2[i].time);
        ok(results[i].value.kind === 'N' && results[i].time === time && results[i].value.value === sum);
    }
});

test('Zip_SomeDataAsymmetric2', function () {
    var e1, e2, i, len, msgs1, msgs2, results, scheduler, sum, time;
    scheduler = new TestScheduler();
    msgs1 = (function () {
        var _results;
        _results = [];
        for (i = 0; i < 10; i++) {
            _results.push(onNext(205 + i * 5, i));
        }
        return _results;
    })();
    msgs2 = (function () {
        var _results;
        _results = [];
        for (i = 0; i < 5; i++) {
            _results.push(onNext(205 + i * 8, i));
        }
        return _results;
    })();
    len = Math.min(msgs1.length, msgs2.length);
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.zip(e2, function (x, y) {
            return x + y;
        });
    }).messages;
    equal(len, results.length);
    for (i = 0; i < len; i++) {
        sum = msgs1[i].value.value + msgs2[i].value.value;
        time = Math.max(msgs1[i].time, msgs2[i].time);
        ok(results[i].value.kind === 'N' && results[i].time === time && results[i].value.value === sum);
    }
});

test('Zip_SomeDataSymmetric', function () {
    var e1, e2, i, len, msgs1, msgs2, results, scheduler, sum, time;
    scheduler = new TestScheduler();
    msgs1 = (function () {
        var _results;
        _results = [];
        for (i = 0; i < 10; i++) {
            _results.push(onNext(205 + i * 5, i));
        }
        return _results;
    })();
    msgs2 = (function () {
        var _results;
        _results = [];
        for (i = 0; i < 10; i++) {
            _results.push(onNext(205 + i * 8, i));
        }
        return _results;
    })();
    len = Math.min(msgs1.length, msgs2.length);
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.zip(e2, function (x, y) {
            return x + y;
        });
    }).messages;
    equal(len, results.length);
    for (i = 0; i < len; i++) {
        sum = msgs1[i].value.value + msgs2[i].value.value;
        time = Math.max(msgs1[i].time, msgs2[i].time);
        ok(results[i].value.kind === 'N' && results[i].time === time && results[i].value.value === sum);
    }
});

test('Zip_SelectorThrows', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(215, 2), onNext(225, 4), onCompleted(240)];
    msgs2 = [onNext(150, 1), onNext(220, 3), onNext(230, 5), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.zip(e2, function (x, y) {
            if (y === 5) {
                throw ex;
            } else {
                return x + y;
            }
        });
    });
    results.messages.assertEqual(onNext(220, 2 + 3), onError(230, ex));
});

test('Zip_RightCompletesFirst', function () {
    var scheduler = new TestScheduler();

    var o = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(215, 4),
        onCompleted(225)
    );

    var e = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onCompleted(220)
    );

    var res = scheduler.startWithCreate(function () {
        return o.zip(e, function (x, y) { return x + y; })
    });

    res.messages.assertEqual(
        onNext(215, 6),
        onCompleted(225)
    );

    o.subscriptions.assertEqual(
        subscribe(200, 225)
    );

    e.subscriptions.assertEqual(
        subscribe(200, 225)
    );
});

test('ZipWithEnumerable_NeverEmpty', function () {
    var n1, n2, results, scheduler;
    scheduler = new TestScheduler();
    n1 = scheduler.createHotObservable(onNext(150, 1));
    n2 = [];
    results = scheduler.startWithCreate(function () {
        return n1.zip(n2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual();
    n1.subscriptions.assertEqual(subscribe(200, 1000));
});

test('ZipWithEnumerable_EmptyEmpty', function () {
    var n1, n2, results, scheduler;
    scheduler = new TestScheduler();
    n1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(210));
    n2 = [];
    results = scheduler.startWithCreate(function () {
        return n1.zip(n2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onCompleted(210));
    n1.subscriptions.assertEqual(subscribe(200, 210));
});
test('ZipWithEnumerable_EmptyNonEmpty', function () {
    var n1, n2, results, scheduler;
    scheduler = new TestScheduler();
    n1 = scheduler.createHotObservable(onNext(150, 1), onCompleted(210));
    n2 = [2];
    results = scheduler.startWithCreate(function () {
        return n1.zip(n2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onCompleted(210));
    n1.subscriptions.assertEqual(subscribe(200, 210));
});
test('ZipWithEnumerable_NonEmptyEmpty', function () {
    var n1, n2, results, scheduler;
    scheduler = new TestScheduler();
    n1 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onCompleted(220));
    n2 = [];
    results = scheduler.startWithCreate(function () {
        return n1.zip(n2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onCompleted(215));
    n1.subscriptions.assertEqual(subscribe(200, 215));
});
test('ZipWithEnumerable_NeverNonEmpty', function () {
    var n1, n2, results, scheduler;
    scheduler = new TestScheduler();
    n1 = scheduler.createHotObservable(onNext(150, 1));
    n2 = [2];
    results = scheduler.startWithCreate(function () {
        return n1.zip(n2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual();
    n1.subscriptions.assertEqual(subscribe(200, 1000));
});
test('ZipWithEnumerable_NonEmptyNonEmpty', function () {
    var n1, n2, results, scheduler;
    scheduler = new TestScheduler();
    n1 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onCompleted(230));
    n2 = [3];
    results = scheduler.startWithCreate(function () {
        return n1.zip(n2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onNext(215, 2 + 3), onCompleted(230));
    n1.subscriptions.assertEqual(subscribe(200, 230));
});
test('ZipWithEnumerable_ErrorEmpty', function () {
    var ex, n1, n2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    n1 = scheduler.createHotObservable(onNext(150, 1), onError(220, ex));
    n2 = [];
    results = scheduler.startWithCreate(function () {
        return n1.zip(n2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
    n1.subscriptions.assertEqual(subscribe(200, 220));
});

test('ZipWithEnumerable_ErrorSome', function () {
    var ex, n1, n2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    n1 = scheduler.createHotObservable(onNext(150, 1), onError(220, ex));
    n2 = [2];
    results = scheduler.startWithCreate(function () {
        return n1.zip(n2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onError(220, ex));
    n1.subscriptions.assertEqual(subscribe(200, 220));
});

test('ZipWithEnumerable_SomeDataBothSides', function () {
    var n1, n2, results, scheduler;
    scheduler = new TestScheduler();
    n1 = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5));
    n2 = [5, 4, 3, 2];
    results = scheduler.startWithCreate(function () {
        return n1.zip(n2, function (x, y) {
            return x + y;
        });
    });
    results.messages.assertEqual(onNext(210, 7), onNext(220, 7), onNext(230, 7), onNext(240, 7));
    n1.subscriptions.assertEqual(subscribe(200, 1000));
});

test('ZipWithEnumerable_SelectorThrows', function () {
    var ex, n1, n2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    n1 = scheduler.createHotObservable(onNext(150, 1), onNext(215, 2), onNext(225, 4), onCompleted(240));
    n2 = [3, 5];
    results = scheduler.startWithCreate(function () {
        return n1.zip(n2, function (x, y) {
            if (y === 5) {
                throw ex;
            }
            return x + y;
        });
    });
    results.messages.assertEqual(onNext(215, 2 + 3), onError(225, ex));
    n1.subscriptions.assertEqual(subscribe(200, 225));
});