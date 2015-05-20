QUnit.module('Sample');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Sample_Regular', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(230, 3), onNext(260, 4), onNext(300, 5), onNext(350, 6), onNext(380, 7), onCompleted(390));
    results = scheduler.startWithCreate(function () {
        return xs.sample(50, scheduler);
    });
    results.messages.assertEqual(onNext(250, 3), onNext(300, 4), onNext(350, 5), onNext(400, 7), onCompleted(400));
});

test('Sample_ErrorInFlight', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(230, 3), onNext(260, 4), onNext(300, 5), onNext(310, 6), onError(330, ex));
    results = scheduler.startWithCreate(function () {
        return xs.sample(50, scheduler);
    });
    results.messages.assertEqual(onNext(250, 3), onNext(300, 4), onError(330, ex));
});

test('Sample_Empty', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.empty(scheduler).sample(0, scheduler);
    });
    results.messages.assertEqual(onCompleted(202));
});

test('Sample_Error', function () {
    var ex, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.throwException(ex, scheduler).sample(0, scheduler);
    });
    results.messages.assertEqual(onError(201, ex));
});

test('Sample_Never', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.never().sample(0, scheduler);
    });
    results.messages.assertEqual();
});

test('Sample_Other_Regular', function(){

    var results,
        scheduler = new TestScheduler(),
        xs = scheduler.createHotObservable(
            onNext(210, 1),
            onNext(230, 2),
            onNext(300, 3),
            onNext(350, 4),
            onCompleted(800)
        ),
        other = scheduler.createHotObservable(
            onNext(220, 0),
            onNext(310, 0),
            onNext(800, 0),
            onNext(810, 0)
        );


    results = scheduler.startWithCreate(function() {
        return xs.sample(other);
    });

    results.messages.assertEqual(onNext(220, 1), onNext(310, 3), onNext(800, 4), onCompleted(800));

});

test("Sample_Other_Never", function() {

    var results,
        scheduler = new TestScheduler(),
        xs = scheduler.createHotObservable(
            onNext(210, 1),
            onNext(230, 2),
            onNext(300, 3),
            onNext(350, 4),
            onCompleted(800)
        );

    results = scheduler.startWithCreate(function(){
        return xs.sample(Rx.Observable.empty(scheduler));
    });

    results.messages.assertEqual(onCompleted(800));

});

test("Sample_Other_Error", function(){

    var results,
        scheduler = new TestScheduler(),
        xs = scheduler.createHotObservable(
            onNext(210, 1),
            onNext(230, 2),
            onNext(300, 3),
            onNext(350, 4),
            onCompleted(800)
        ),
        error = new Error("failed to sample");

    results = scheduler.startWithCreate(function() {
        return xs.sample(Rx.Observable.throwError(error, scheduler));
    });

    results.messages.assertEqual(onError(201, error));

});

test("Sample_Other_ErrorInFlight", function() {
    var ex = 'ex',
    scheduler = new TestScheduler(),
    xs = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onNext(230, 3),
        onNext(260, 4),
        onNext(300, 5),
        onNext(310, 6),
        onCompleted(330)),
    other = scheduler.createHotObservable(
        onNext(250, 0),
        onNext(300, 0),
        onError(310, ex)
    ),
    results = scheduler.startWithCreate(function () {
        return xs.sample(other);
    });

    results.messages.assertEqual(onNext(250, 3), onNext(300, 5), onError(310, ex));
});