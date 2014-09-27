QUnit.module('Case');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Case_One', function () {
    var map, results, scheduler, xs, ys, zs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
    ys = scheduler.createHotObservable(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
    zs = scheduler.createHotObservable(onNext(230, 21), onNext(240, 22), onNext(290, 23), onCompleted(320));
    map = {
        1: xs,
        2: ys
    };
    results = scheduler.startWithCreate(function () {
        return Observable.switchCase(function () {
            return 1;
        }, map, zs);
    });
    results.messages.assertEqual(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
    xs.subscriptions.assertEqual(subscribe(200, 300));
    ys.subscriptions.assertEqual();
    zs.subscriptions.assertEqual();
});

test('Case_Two', function () {
    var map, results, scheduler, xs, ys, zs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
    ys = scheduler.createHotObservable(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
    zs = scheduler.createHotObservable(onNext(230, 21), onNext(240, 22), onNext(290, 23), onCompleted(320));
    map = {
        1: xs,
        2: ys
    };
    results = scheduler.startWithCreate(function () {
        return Observable.switchCase(function () {
            return 2;
        }, map, zs);
    });
    results.messages.assertEqual(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
    xs.subscriptions.assertEqual();
    ys.subscriptions.assertEqual(subscribe(200, 310));
    zs.subscriptions.assertEqual();
});

test('Case_Three', function () {
    var map, results, scheduler, xs, ys, zs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
    ys = scheduler.createHotObservable(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
    zs = scheduler.createHotObservable(onNext(230, 21), onNext(240, 22), onNext(290, 23), onCompleted(320));
    map = {
        1: xs,
        2: ys
    };
    results = scheduler.startWithCreate(function () {
        return Observable.switchCase(function () {
            return 3;
        }, map, zs);
    });
    results.messages.assertEqual(onNext(230, 21), onNext(240, 22), onNext(290, 23), onCompleted(320));
    xs.subscriptions.assertEqual();
    ys.subscriptions.assertEqual();
    zs.subscriptions.assertEqual(subscribe(200, 320));
});

test('Case_Throw', function () {
    var ex, map, results, scheduler, xs, ys, zs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
    ys = scheduler.createHotObservable(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
    zs = scheduler.createHotObservable(onNext(230, 21), onNext(240, 22), onNext(290, 23), onCompleted(320));
    map = {
        1: xs,
        2: ys
    };
    results = scheduler.startWithCreate(function () {
        return Observable.switchCase(function () {
            throw ex;
        }, map, zs);
    });
    results.messages.assertEqual(onError(200, ex));
    xs.subscriptions.assertEqual();
    ys.subscriptions.assertEqual();
    zs.subscriptions.assertEqual();
});

test('CaseWithDefault_One', function () {
    var map, results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
    ys = scheduler.createHotObservable(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
    map = {
        1: xs,
        2: ys
    };
    results = scheduler.startWithCreate(function () {
        return Observable.switchCase(function () {
            return 1;
        }, map, scheduler);
    });
    results.messages.assertEqual(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
    xs.subscriptions.assertEqual(subscribe(200, 300));
    ys.subscriptions.assertEqual();
});

test('CaseWithDefault_Two', function () {
    var map, results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
    ys = scheduler.createHotObservable(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
    map = {
        1: xs,
        2: ys
    };
    results = scheduler.startWithCreate(function () {
        return Observable.switchCase(function () {
            return 2;
        }, map, scheduler);
    });
    results.messages.assertEqual(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
    xs.subscriptions.assertEqual();
    ys.subscriptions.assertEqual(subscribe(200, 310));
});

test('CaseWithDefault_Three', function () {
    var map, results, scheduler, xs, ys;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
    ys = scheduler.createHotObservable(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
    map = {
        1: xs,
        2: ys
    };
    results = scheduler.startWithCreate(function () {
        return Observable.switchCase(function () {
            return 3;
        }, map, scheduler);
    });
    results.messages.assertEqual(onCompleted(201));
    xs.subscriptions.assertEqual();
    ys.subscriptions.assertEqual();
});

test('CaseWithDefault_Throw', function () {
    var ex, map, results, scheduler, xs, ys;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(210, 1), onNext(240, 2), onNext(270, 3), onCompleted(300));
    ys = scheduler.createHotObservable(onNext(220, 11), onNext(250, 12), onNext(280, 13), onCompleted(310));
    map = {
        1: xs,
        2: ys
    };
    results = scheduler.startWithCreate(function () {
        return Observable.switchCase(function () {
            throw ex;
        }, map, scheduler);
    });
    results.messages.assertEqual(onError(200, ex));
    xs.subscriptions.assertEqual();
    ys.subscriptions.assertEqual();
});
