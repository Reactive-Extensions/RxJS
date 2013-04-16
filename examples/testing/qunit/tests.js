(function (global) {

    var root = global.Rx,
        TestScheduler = root.TestScheduler,
        Observable = root.Observable,

        // Assertions
        CollectionAssert = root.CollectionAssert,

        // Shortcuts for onNext/onError/onCompleted
        onNext = root.ReactiveTest.onNext,
        onError = root.ReactiveTest.onError,
        onCompleted = root.ReactiveTest.onCompleted,
        subscribe = root.ReactiveTest.subscribe;

    /* Tests returnValue basic behavior */
    test('returnValue Basic', function () {

        var scheduler = new TestScheduler();

        // Returns 42 at one tick after subscribe (200)
        var results = scheduler.startWithCreate(function () {
            return Observable.returnValue(42, scheduler);
        });

        // Expect a single onNext with 42 and an oncompleted one tick from subscribe
        var expectedMessages = [
            onNext(201, 42),
            onCompleted(201)
        ];

        CollectionAssert.assertEqual(expectedMessages, results.messages);
    });

    /* Tests select method basic behavior */
    test('select Basic', function () {

        var scheduler = new TestScheduler();

        // Creates a hot observable with two messages after subscribe
        var xs = scheduler.createHotObservable(
            onNext(150, 1),
            onNext(210, 2),
            onCompleted(220)
        );        

        // Project the hot observable via select without index
        var results = scheduler.startWithCreate(function () {
            return xs.select(function (x) { return x + x; });
        });

        // Should get one onNext with 4 and a completed
        var expectedMessages = [
            onNext(210, 4),
            onCompleted(220)
        ];

        CollectionAssert.assertEqual(expectedMessages, results.messages);

        // Should subscribe at 200 and unsubscribe at 220 at last message
        var expectedSubscriptions = [
            subscribe(200, 220)
        ];

        CollectionAssert.assertEqual(expectedSubscriptions, xs.subscriptions);
    });

    /* Tests select method basic behavior */
    test('select Multiple', function () {

        var scheduler = new TestScheduler();

        // Project forward two onNext messages after subscribe and one completed at 220
        var xs = scheduler.createHotObservable(
            onNext(150, 1),
            onNext(210, 2),
            onNext(215, 3),
            onCompleted(220)
        );        

        // Project the hot observable via select without index
        var results = scheduler.startWithCreate(function () {
            return xs.select(function (x) { return x + x; });
        });

        // Should get one at 210 for 4 and one at 215 for 6 until completed at 220
        var expectedMessages = [
            onNext(210, 4),
            onNext(215, 6),
            onCompleted(220)
        ];

        CollectionAssert.assertEqual(expectedMessages, results.messages);

        // Should subscribe at 200 and unsubscribe at 220 at last message
        var expectedSubscriptions = [
            subscribe(200, 220)
        ];

        CollectionAssert.assertEqual(expectedSubscriptions, xs.subscriptions);
    });    

    /* Tests select method empty behavior */
    test('select Empty', function () {

        var scheduler = new TestScheduler();

        // Project forward one onNext after subscribe and one completed at 220
        var xs = scheduler.createHotObservable(
            onNext(150, 1),
            onCompleted(220)
        );        

        // Project the hot observable via select without index
        var results = scheduler.startWithCreate(function () {
            return xs.select(function (x) { return x + x; });
        });

        var expectedMessages = [
            onCompleted(220)
        ];

        CollectionAssert.assertEqual(expectedMessages, results.messages);

        // Should subscribe at 200 and unsubscribe at 220 at last message
        var expectedSubscriptions = [
            subscribe(200, 220)
        ];

        CollectionAssert.assertEqual(expectedSubscriptions, xs.subscriptions);
    });

    /* Tests select method never firing behavior */
    test('select Never', function () {

        var scheduler = new TestScheduler();

        // Project no messages after subscribe at 200
        var xs = scheduler.createHotObservable(
            onNext(150, 1)
        );        

        // Project the hot observable via select without index
        var results = scheduler.startWithCreate(function () {
            return xs.select(function (x) { return x + x; });
        });

        // Should expect no messages
        var expectedMessages = [
        ];

        CollectionAssert.assertEqual(expectedMessages, results.messages);

        // Should subscribe at 200 and unsubscribe at 1000 (infinity)
        var expectedSubscriptions = [
            subscribe(200, 1000)
        ];

        CollectionAssert.assertEqual(expectedSubscriptions, xs.subscriptions);
    });        

    /* Tests select method where the observable throws an exception */
    test('select Throws', function () {
        var error = new Error('woops');
        var scheduler = new TestScheduler();

        // Project forward one onError after subscribe
        var xs = scheduler.createHotObservable(
            onNext(150, 1),
            onError(210, error)
        );        

        var results = scheduler.startWithCreate(function () {
            return xs.select(function (x) { return x + x; });
        });

        // Should expect only one message with an error at 210
        var expectedMessages = [
            onError(210, error)
        ];

        CollectionAssert.assertEqual(expectedMessages, results.messages);

        // Should subscribe at 200 and unsubscribe at 210 at point of error
        var expectedSubscriptions = [
            subscribe(200, 210)
        ];

        CollectionAssert.assertEqual(expectedSubscriptions, xs.subscriptions);
    });

    /* Tests select method where the observable throws an exception */
    test('select Selector Throws', function () {
        var error = new Error('woops');
        var scheduler = new TestScheduler();

        // Project forward one onNext after subscribe and one completed at 220
        var xs = scheduler.createHotObservable(
            onNext(150, 1),
            onNext(210, 2)
        );        

        var results = scheduler.startWithCreate(function () {
            return xs.select(function (x) { throw error; });
        });

        // Should expect only one message with an error at 210
        var expectedMessages = [
            onError(210, error)
        ];

        CollectionAssert.assertEqual(expectedMessages, results.messages);

        // Should subscribe at 200 and unsubscribe at 210 at point of error
        var expectedSubscriptions = [
            subscribe(200, 210)
        ];

        CollectionAssert.assertEqual(expectedSubscriptions, xs.subscriptions);
    });    

    /* Tests select method basic behavior */
    test('select With Index Basic', function () {

        var scheduler = new TestScheduler();

        // Project forward one onNext after subscribe and one completed at 220
        var xs = scheduler.createHotObservable(
            onNext(150, 1),
            onNext(210, 2),
            onCompleted(220)
        );        

        var results = scheduler.startWithCreate(function () {
            return xs.select(function (x, i) { return (x + x) * i; });
        });

        // Should expect one message with 0 and then complettion
        var expectedMessages = [
            onNext(210, 0),
            onCompleted(220)
        ];

        CollectionAssert.assertEqual(expectedMessages, results.messages);

        // Should subscribe at 200 and unsubscribe at 220 at last message
        var expectedSubscriptions = [
            subscribe(200, 220)
        ];

        CollectionAssert.assertEqual(expectedSubscriptions, xs.subscriptions);
    });

}(window));