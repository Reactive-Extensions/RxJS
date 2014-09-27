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
