QUnit.module('SelectMany');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    SerialDisposable = Rx.SerialDisposable,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

test('SelectMany_Then_Complete_Complete', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onNext(100, 4), onNext(200, 2), onNext(300, 3), onNext(400, 1), onCompleted(500));
    ys = scheduler.createColdObservable(onNext(50, "foo"), onNext(100, "bar"), onNext(150, "baz"), onNext(200, "qux"), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.selectMany(ys);
    });
    results.messages.assertEqual(onNext(350, "foo"), onNext(400, "bar"), onNext(450, "baz"), onNext(450, "foo"), onNext(500, "qux"), onNext(500, "bar"), onNext(550, "baz"), onNext(550, "foo"), onNext(600, "qux"), onNext(600, "bar"), onNext(650, "baz"), onNext(650, "foo"), onNext(700, "qux"), onNext(700, "bar"), onNext(750, "baz"), onNext(800, "qux"), onCompleted(850));
    xs.subscriptions.assertEqual(subscribe(200, 700));
    ys.subscriptions.assertEqual(subscribe(300, 550), subscribe(400, 650), subscribe(500, 750), subscribe(600, 850));
});

test('SelectMany_Then_Complete_Complete_2', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onNext(100, 4), onNext(200, 2), onNext(300, 3), onNext(400, 1), onCompleted(700));
    ys = scheduler.createColdObservable(onNext(50, "foo"), onNext(100, "bar"), onNext(150, "baz"), onNext(200, "qux"), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.selectMany(ys);
    });
    results.messages.assertEqual(onNext(350, "foo"), onNext(400, "bar"), onNext(450, "baz"), onNext(450, "foo"), onNext(500, "qux"), onNext(500, "bar"), onNext(550, "baz"), onNext(550, "foo"), onNext(600, "qux"), onNext(600, "bar"), onNext(650, "baz"), onNext(650, "foo"), onNext(700, "qux"), onNext(700, "bar"), onNext(750, "baz"), onNext(800, "qux"), onCompleted(900));
    xs.subscriptions.assertEqual(subscribe(200, 900));
    ys.subscriptions.assertEqual(subscribe(300, 550), subscribe(400, 650), subscribe(500, 750), subscribe(600, 850));
});

test('SelectMany_Then_Never_Complete', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onNext(100, 4), onNext(200, 2), onNext(300, 3), onNext(400, 1), onNext(500, 5), onNext(700, 0));
    ys = scheduler.createColdObservable(onNext(50, "foo"), onNext(100, "bar"), onNext(150, "baz"), onNext(200, "qux"), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.selectMany(ys);
    });
    results.messages.assertEqual(onNext(350, "foo"), onNext(400, "bar"), onNext(450, "baz"), onNext(450, "foo"), onNext(500, "qux"), onNext(500, "bar"), onNext(550, "baz"), onNext(550, "foo"), onNext(600, "qux"), onNext(600, "bar"), onNext(650, "baz"), onNext(650, "foo"), onNext(700, "qux"), onNext(700, "bar"), onNext(750, "baz"), onNext(750, "foo"), onNext(800, "qux"), onNext(800, "bar"), onNext(850, "baz"), onNext(900, "qux"), onNext(950, "foo"));
    xs.subscriptions.assertEqual(subscribe(200, 1000));
    ys.subscriptions.assertEqual(subscribe(300, 550), subscribe(400, 650), subscribe(500, 750), subscribe(600, 850), subscribe(700, 950), subscribe(900, 1000));
});

test('SelectMany_Then_Complete_Never', function () {
    var results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onNext(100, 4), onNext(200, 2), onNext(300, 3), onNext(400, 1), onCompleted(500));
    ys = scheduler.createColdObservable(onNext(50, "foo"), onNext(100, "bar"), onNext(150, "baz"), onNext(200, "qux"));
    results = scheduler.startWithCreate(function () {
        return xs.selectMany(ys);
    });
    results.messages.assertEqual(onNext(350, "foo"), onNext(400, "bar"), onNext(450, "baz"), onNext(450, "foo"), onNext(500, "qux"), onNext(500, "bar"), onNext(550, "baz"), onNext(550, "foo"), onNext(600, "qux"), onNext(600, "bar"), onNext(650, "baz"), onNext(650, "foo"), onNext(700, "qux"), onNext(700, "bar"), onNext(750, "baz"), onNext(800, "qux"));
    xs.subscriptions.assertEqual(subscribe(200, 700));
    ys.subscriptions.assertEqual(subscribe(300, 1000), subscribe(400, 1000), subscribe(500, 1000), subscribe(600, 1000));
});

test('SelectMany_Then_Complete_Error', function () {
    var ex, results, scheduler, xs, ys;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onNext(100, 4), onNext(200, 2), onNext(300, 3), onNext(400, 1), onCompleted(500));
    ys = scheduler.createColdObservable(onNext(50, "foo"), onNext(100, "bar"), onNext(150, "baz"), onNext(200, "qux"), onError(300, ex));
    results = scheduler.startWithCreate(function () {
        return xs.selectMany(ys);
    });
    results.messages.assertEqual(onNext(350, "foo"), onNext(400, "bar"), onNext(450, "baz"), onNext(450, "foo"), onNext(500, "qux"), onNext(500, "bar"), onNext(550, "baz"), onNext(550, "foo"), onError(600, ex));
    xs.subscriptions.assertEqual(subscribe(200, 600));
    ys.subscriptions.assertEqual(subscribe(300, 600), subscribe(400, 600), subscribe(500, 600), subscribe(600, 600));
});

test('SelectMany_Then_Error_Complete', function () {
    var ex, results, scheduler, xs, ys;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onNext(100, 4), onNext(200, 2), onNext(300, 3), onNext(400, 1), onError(500, ex));
    ys = scheduler.createColdObservable(onNext(50, "foo"), onNext(100, "bar"), onNext(150, "baz"), onNext(200, "qux"), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.selectMany(ys);
    });
    results.messages.assertEqual(onNext(350, "foo"), onNext(400, "bar"), onNext(450, "baz"), onNext(450, "foo"), onNext(500, "qux"), onNext(500, "bar"), onNext(550, "baz"), onNext(550, "foo"), onNext(600, "qux"), onNext(600, "bar"), onNext(650, "baz"), onNext(650, "foo"), onError(700, ex));
    xs.subscriptions.assertEqual(subscribe(200, 700));
    ys.subscriptions.assertEqual(subscribe(300, 550), subscribe(400, 650), subscribe(500, 700), subscribe(600, 700));
});

test('SelectMany_Then_Error_Error', function () {
    var ex, results, scheduler, xs, ys;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onNext(100, 4), onNext(200, 2), onNext(300, 3), onNext(400, 1), onError(500, ex));
    ys = scheduler.createColdObservable(onNext(50, "foo"), onNext(100, "bar"), onNext(150, "baz"), onNext(200, "qux"), onError(250, ex));
    results = scheduler.startWithCreate(function () {
        return xs.selectMany(ys);
    });
    results.messages.assertEqual(onNext(350, "foo"), onNext(400, "bar"), onNext(450, "baz"), onNext(450, "foo"), onNext(500, "qux"), onNext(500, "bar"), onError(550, ex));
    xs.subscriptions.assertEqual(subscribe(200, 550));
    ys.subscriptions.assertEqual(subscribe(300, 550), subscribe(400, 550), subscribe(500, 550));
});

test('SelectMany_Complete', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(5, scheduler.createColdObservable(onError(1, 'ex1'))), onNext(105, scheduler.createColdObservable(onError(1, 'ex2'))), onNext(300, scheduler.createColdObservable(onNext(10, 102), onNext(90, 103), onNext(110, 104), onNext(190, 105), onNext(440, 106), onCompleted(460))), onNext(400, scheduler.createColdObservable(onNext(180, 202), onNext(190, 203), onCompleted(205))), onNext(550, scheduler.createColdObservable(onNext(10, 301), onNext(50, 302), onNext(70, 303), onNext(260, 304), onNext(310, 305), onCompleted(410))), onNext(750, scheduler.createColdObservable(onCompleted(40))), onNext(850, scheduler.createColdObservable(onNext(80, 401), onNext(90, 402), onCompleted(100))), onCompleted(900));
    results = scheduler.startWithCreate(function () {
        return xs.selectMany(function (x) {
            return x;
        });
    });
    results.messages.assertEqual(onNext(310, 102), onNext(390, 103), onNext(410, 104), onNext(490, 105), onNext(560, 301), onNext(580, 202), onNext(590, 203), onNext(600, 302), onNext(620, 303), onNext(740, 106), onNext(810, 304), onNext(860, 305), onNext(930, 401), onNext(940, 402), onCompleted(960));
    xs.subscriptions.assertEqual(subscribe(200, 900));
    xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
    xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 605));
    xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 960));
    xs.messages[5].value.value.subscriptions.assertEqual(subscribe(750, 790));
    xs.messages[6].value.value.subscriptions.assertEqual(subscribe(850, 950));
});

test('SelectMany_Complete_InnerNotComplete', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(5, scheduler.createColdObservable(onError(1, 'ex1'))), onNext(105, scheduler.createColdObservable(onError(1, 'ex2'))), onNext(300, scheduler.createColdObservable(onNext(10, 102), onNext(90, 103), onNext(110, 104), onNext(190, 105), onNext(440, 106), onCompleted(460))), onNext(400, scheduler.createColdObservable(onNext(180, 202), onNext(190, 203))), onNext(550, scheduler.createColdObservable(onNext(10, 301), onNext(50, 302), onNext(70, 303), onNext(260, 304), onNext(310, 305), onCompleted(410))), onNext(750, scheduler.createColdObservable(onCompleted(40))), onNext(850, scheduler.createColdObservable(onNext(80, 401), onNext(90, 402), onCompleted(100))), onCompleted(900));
    results = scheduler.startWithCreate(function () {
        return xs.selectMany(function (x) {
            return x;
        });
    });
    results.messages.assertEqual(onNext(310, 102), onNext(390, 103), onNext(410, 104), onNext(490, 105), onNext(560, 301), onNext(580, 202), onNext(590, 203), onNext(600, 302), onNext(620, 303), onNext(740, 106), onNext(810, 304), onNext(860, 305), onNext(930, 401), onNext(940, 402));
    xs.subscriptions.assertEqual(subscribe(200, 900));
    xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
    xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 1000));
    xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 960));
    xs.messages[5].value.value.subscriptions.assertEqual(subscribe(750, 790));
    xs.messages[6].value.value.subscriptions.assertEqual(subscribe(850, 950));
});

test('SelectMany_Complete_OuterNotComplete', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(5, scheduler.createColdObservable(onError(1, 'ex1'))), onNext(105, scheduler.createColdObservable(onError(1, 'ex2'))), onNext(300, scheduler.createColdObservable(onNext(10, 102), onNext(90, 103), onNext(110, 104), onNext(190, 105), onNext(440, 106), onCompleted(460))), onNext(400, scheduler.createColdObservable(onNext(180, 202), onNext(190, 203), onCompleted(205))), onNext(550, scheduler.createColdObservable(onNext(10, 301), onNext(50, 302), onNext(70, 303), onNext(260, 304), onNext(310, 305), onCompleted(410))), onNext(750, scheduler.createColdObservable(onCompleted(40))), onNext(850, scheduler.createColdObservable(onNext(80, 401), onNext(90, 402), onCompleted(100))));
    results = scheduler.startWithCreate(function () {
        return xs.selectMany(function (x) {
            return x;
        });
    });
    results.messages.assertEqual(onNext(310, 102), onNext(390, 103), onNext(410, 104), onNext(490, 105), onNext(560, 301), onNext(580, 202), onNext(590, 203), onNext(600, 302), onNext(620, 303), onNext(740, 106), onNext(810, 304), onNext(860, 305), onNext(930, 401), onNext(940, 402));
    xs.subscriptions.assertEqual(subscribe(200, 1000));
    xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
    xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 605));
    xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 960));
    xs.messages[5].value.value.subscriptions.assertEqual(subscribe(750, 790));
    xs.messages[6].value.value.subscriptions.assertEqual(subscribe(850, 950));
});

test('SelectMany_Error_Outer', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(5, scheduler.createColdObservable(onError(1, 'ex1'))), onNext(105, scheduler.createColdObservable(onError(1, 'ex2'))), onNext(300, scheduler.createColdObservable(onNext(10, 102), onNext(90, 103), onNext(110, 104), onNext(190, 105), onNext(440, 106), onCompleted(460))), onNext(400, scheduler.createColdObservable(onNext(180, 202), onNext(190, 203), onCompleted(205))), onNext(550, scheduler.createColdObservable(onNext(10, 301), onNext(50, 302), onNext(70, 303), onNext(260, 304), onNext(310, 305), onCompleted(410))), onNext(750, scheduler.createColdObservable(onCompleted(40))), onNext(850, scheduler.createColdObservable(onNext(80, 401), onNext(90, 402), onCompleted(100))), onError(900, ex));
    results = scheduler.startWithCreate(function () {
        return xs.selectMany(function (x) {
            return x;
        });
    });
    results.messages.assertEqual(onNext(310, 102), onNext(390, 103), onNext(410, 104), onNext(490, 105), onNext(560, 301), onNext(580, 202), onNext(590, 203), onNext(600, 302), onNext(620, 303), onNext(740, 106), onNext(810, 304), onNext(860, 305), onError(900, ex));
    xs.subscriptions.assertEqual(subscribe(200, 900));
    xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
    xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 605));
    xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 900));
    xs.messages[5].value.value.subscriptions.assertEqual(subscribe(750, 790));
    xs.messages[6].value.value.subscriptions.assertEqual(subscribe(850, 900));
});

test('SelectMany_Error_Inner', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(5, scheduler.createColdObservable(onError(1, 'ex1'))), onNext(105, scheduler.createColdObservable(onError(1, 'ex2'))), onNext(300, scheduler.createColdObservable(onNext(10, 102), onNext(90, 103), onNext(110, 104), onNext(190, 105), onNext(440, 106), onError(460, ex))), onNext(400, scheduler.createColdObservable(onNext(180, 202), onNext(190, 203), onCompleted(205))), onNext(550, scheduler.createColdObservable(onNext(10, 301), onNext(50, 302), onNext(70, 303), onNext(260, 304), onNext(310, 305), onCompleted(410))), onNext(750, scheduler.createColdObservable(onCompleted(40))), onNext(850, scheduler.createColdObservable(onNext(80, 401), onNext(90, 402), onCompleted(100))), onCompleted(900));
    results = scheduler.startWithCreate(function () {
        return xs.selectMany(function (x) {
            return x;
        });
    });
    results.messages.assertEqual(onNext(310, 102), onNext(390, 103), onNext(410, 104), onNext(490, 105), onNext(560, 301), onNext(580, 202), onNext(590, 203), onNext(600, 302), onNext(620, 303), onNext(740, 106), onError(760, ex));
    xs.subscriptions.assertEqual(subscribe(200, 760));
    xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
    xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 605));
    xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 760));
    xs.messages[5].value.value.subscriptions.assertEqual(subscribe(750, 760));
    xs.messages[6].value.value.subscriptions.assertEqual();
});

test('SelectMany_Dispose', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(5, scheduler.createColdObservable(onError(1, 'ex1'))), onNext(105, scheduler.createColdObservable(onError(1, 'ex2'))), onNext(300, scheduler.createColdObservable(onNext(10, 102), onNext(90, 103), onNext(110, 104), onNext(190, 105), onNext(440, 106), onCompleted(460))), onNext(400, scheduler.createColdObservable(onNext(180, 202), onNext(190, 203), onCompleted(205))), onNext(550, scheduler.createColdObservable(onNext(10, 301), onNext(50, 302), onNext(70, 303), onNext(260, 304), onNext(310, 305), onCompleted(410))), onNext(750, scheduler.createColdObservable(onCompleted(40))), onNext(850, scheduler.createColdObservable(onNext(80, 401), onNext(90, 402), onCompleted(100))), onCompleted(900));
    results = scheduler.startWithDispose(function () {
        return xs.selectMany(function (x) {
            return x;
        });
    }, 700);
    results.messages.assertEqual(onNext(310, 102), onNext(390, 103), onNext(410, 104), onNext(490, 105), onNext(560, 301), onNext(580, 202), onNext(590, 203), onNext(600, 302), onNext(620, 303));
    xs.subscriptions.assertEqual(subscribe(200, 700));
    xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 700));
    xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 605));
    xs.messages[4].value.value.subscriptions.assertEqual(subscribe(550, 700));
    xs.messages[5].value.value.subscriptions.assertEqual();
    xs.messages[6].value.value.subscriptions.assertEqual();
});

test('SelectMany_Throw', function () {
    var ex, invoked, results, scheduler, xs;
    invoked = 0;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(5, scheduler.createColdObservable(onError(1, 'ex1'))), onNext(105, scheduler.createColdObservable(onError(1, 'ex2'))), onNext(300, scheduler.createColdObservable(onNext(10, 102), onNext(90, 103), onNext(110, 104), onNext(190, 105), onNext(440, 106), onCompleted(460))), onNext(400, scheduler.createColdObservable(onNext(180, 202), onNext(190, 203), onCompleted(205))), onNext(550, scheduler.createColdObservable(onNext(10, 301), onNext(50, 302), onNext(70, 303), onNext(260, 304), onNext(310, 305), onCompleted(410))), onNext(750, scheduler.createColdObservable(onCompleted(40))), onNext(850, scheduler.createColdObservable(onNext(80, 401), onNext(90, 402), onCompleted(100))), onCompleted(900));
    results = scheduler.startWithCreate(function () {
        return xs.selectMany(function (x) {
            invoked++;
            if (invoked === 3) {
                throw ex;
            }
            return x;
        });
    });
    results.messages.assertEqual(onNext(310, 102), onNext(390, 103), onNext(410, 104), onNext(490, 105), onError(550, ex));
    xs.subscriptions.assertEqual(subscribe(200, 550));
    xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 550));
    xs.messages[3].value.value.subscriptions.assertEqual(subscribe(400, 550));
    xs.messages[4].value.value.subscriptions.assertEqual();
    xs.messages[5].value.value.subscriptions.assertEqual();
    xs.messages[6].value.value.subscriptions.assertEqual();
});

test('SelectMany_UseFunction', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 4), onNext(220, 3), onNext(250, 5), onNext(270, 1), onCompleted(290));
    results = scheduler.startWithCreate(function () {
        return xs.selectMany(function (x) {
            return Observable.interval(10, scheduler).select(function () {
                return x;
            }).take(x);
        });
    });
    results.messages.assertEqual(onNext(220, 4), onNext(230, 3), onNext(230, 4), onNext(240, 3), onNext(240, 4), onNext(250, 3), onNext(250, 4), onNext(260, 5), onNext(270, 5), onNext(280, 1), onNext(280, 5), onNext(290, 5), onNext(300, 5), onCompleted(300));
    xs.subscriptions.assertEqual(subscribe(200, 290));
});