QUnit.module('Delay');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Delay_TimeSpan_Simple1', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
    results = scheduler.startWithCreate(function () {
        return xs.delay(100, scheduler);
    });
    results.messages.assertEqual(onNext(350, 2), onNext(450, 3), onNext(550, 4), onCompleted(650));
    xs.subscriptions.assertEqual(subscribe(200, 550));
});

test('Delay_DateTimeOffset_Simple1_Impl', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
    results = scheduler.startWithCreate(function () {
        return xs.delay(new Date(300), scheduler);
    });
    results.messages.assertEqual(onNext(350, 2), onNext(450, 3), onNext(550, 4), onCompleted(650));
    xs.subscriptions.assertEqual(subscribe(200, 550));
});

test('Delay_TimeSpan_Simple2_Impl', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
    results = scheduler.startWithCreate(function () {
        return xs.delay(50, scheduler);
    });
    results.messages.assertEqual(onNext(300, 2), onNext(400, 3), onNext(500, 4), onCompleted(600));
    xs.subscriptions.assertEqual(subscribe(200, 550));
});

test('Delay_DateTimeOffset_Simple2_Impl', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
    results = scheduler.startWithCreate(function () {
        return xs.delay(new Date(250), scheduler);
    });
    results.messages.assertEqual(onNext(300, 2), onNext(400, 3), onNext(500, 4), onCompleted(600));
    xs.subscriptions.assertEqual(subscribe(200, 550));
});

test('Delay_TimeSpan_Simple3_Impl', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
    results = scheduler.startWithCreate(function () {
        return xs.delay(150, scheduler);
    });
    results.messages.assertEqual(onNext(400, 2), onNext(500, 3), onNext(600, 4), onCompleted(700));
    xs.subscriptions.assertEqual(subscribe(200, 550));
});

test('Delay_DateTimeOffset_Simple3_Impl', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
    results = scheduler.startWithCreate(function () {
        return xs.delay(new Date(350), scheduler);
    });
    results.messages.assertEqual(onNext(400, 2), onNext(500, 3), onNext(600, 4), onCompleted(700));
    xs.subscriptions.assertEqual(subscribe(200, 550));
});

test('Delay_TimeSpan_Error1_Impl', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onError(550, ex));
    results = scheduler.startWithCreate(function () {
        return xs.delay(50, scheduler);
    });
    results.messages.assertEqual(onNext(300, 2), onNext(400, 3), onNext(500, 4), onError(550, ex));
    xs.subscriptions.assertEqual(subscribe(200, 550));
});

test('Delay_DateTimeOffset_Error1_Impl', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onError(550, ex));
    results = scheduler.startWithCreate(function () {
        return xs.delay(new Date(250), scheduler);
    });
    results.messages.assertEqual(onNext(300, 2), onNext(400, 3), onNext(500, 4), onError(550, ex));
    xs.subscriptions.assertEqual(subscribe(200, 550));
});

test('Delay_TimeSpan_Error2_Impl', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onError(550, ex));
    results = scheduler.startWithCreate(function () {
        return xs.delay(150, scheduler);
    });
    results.messages.assertEqual(onNext(400, 2), onNext(500, 3), onError(550, ex));
    xs.subscriptions.assertEqual(subscribe(200, 550));
});

test('Delay_DateTimeOffset_Error2_Impl', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onError(550, ex));
    results = scheduler.startWithCreate(function () {
        return xs.delay(new Date(350), scheduler);
    });
    results.messages.assertEqual(onNext(400, 2), onNext(500, 3), onError(550, ex));
    xs.subscriptions.assertEqual(subscribe(200, 550));
});

test('Delay_Empty', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(550));
    results = scheduler.startWithCreate(function () {
        return xs.delay(10, scheduler);
    });
    results.messages.assertEqual(onCompleted(560));
    xs.subscriptions.assertEqual(subscribe(200, 550));
});

test('Delay_Error', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onError(550, ex));
    results = scheduler.startWithCreate(function () {
        return xs.delay(10, scheduler);
    });
    results.messages.assertEqual(onError(550, ex));
    xs.subscriptions.assertEqual(subscribe(200, 550));
});

test('Delay_Never', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1));
    results = scheduler.startWithCreate(function () {
        return xs.delay(10, scheduler);
    });
    results.messages.assertEqual();
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});