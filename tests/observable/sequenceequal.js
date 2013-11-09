QUnit.module('SequenceEqual');

var TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

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