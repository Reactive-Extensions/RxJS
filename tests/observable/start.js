QUnit.module('Start');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('Start_Action2', function () {
    var scheduler = new TestScheduler();
    
    var done = false;
    
    var res = scheduler.startWithCreate(function () {
        return Observable.start(function () {
            done = true;
        }, scheduler);
    });
    
    res.messages.assertEqual(
        onNext(200, undefined), 
        onCompleted(200)
    );

    ok(done);
});

test('Start_Func2', function () { 
    var scheduler = new TestScheduler();

    var res = scheduler.startWithCreate(function () {
        return Observable.start(function () {
            return 1;
        }, scheduler);
    });

    res.messages.assertEqual(
        onNext(200, 1), 
        onCompleted(200)
    );
});

test('Start_FuncError', function () {
    var ex = new Error();

    var scheduler = new TestScheduler();
    
    var res = scheduler.startWithCreate(function () {
        return Observable.start(function () {
            throw ex;
        }, scheduler);
    });
    
    res.messages.assertEqual(
        onError(200, ex)
    );
});

test('Start_FuncContext', function () {
    var context = { value: 42 };

    var scheduler = new TestScheduler();
    
    var res = scheduler.startWithCreate(function () {
        return Observable.start(function () {
            return this.value;
        }, scheduler, context);
    });
    
    res.messages.assertEqual(
        onNext(200, 42),
        onCompleted(200)
    );
});