QUnit.module('RetryWhen');


var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed;

test('RetryWhen_Observable_Basic', function () {
    var results, scheduler, xs, retry;
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onNext(100, 1), onNext(150, 2), onNext(200, 3), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.retryWhen(function(attempts) {
            return Observable.empty();
        });
    });
    results.messages.assertEqual(onNext(300, 1), onNext(350, 2), onNext(400, 3), onCompleted(450));
    xs.subscriptions.assertEqual(subscribe(200, 450));
});

test('RetryWhen_Observable_Next_Error', function () {
    var results, scheduler, xs, retry, ex;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onNext(10, 1), onNext(20, 2), onError(30, ex), onCompleted(40));
    results = scheduler.startWithCreate(function () {
        return xs.retryWhen(function(attempts) {
            return attempts.scan(0, function(count, ex) {
                if(++count === 2) {
                    throw ex;
                }
                return count;
            }); // returning any nexting observable should cause a continue
        });
    });
    results.messages.assertEqual(onNext(210, 1), onNext(220, 2), onNext(240, 1), onNext(250, 2), onError(260, ex));
    xs.subscriptions.assertEqual(subscribe(200, 230), subscribe(230, 260));
});

test('RetryWhen_Observable_Complete', function () {
    var results, scheduler, xs, retry, ex;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onNext(10, 1), onNext(20, 2), onError(30, ex), onCompleted(40));
    results = scheduler.startWithCreate(function () {
        return xs.retryWhen(function(attempts) {
            return Observable.empty(); // a completing observable completes
        });
    });
    results.messages.assertEqual(onNext(210, 1), onNext(220, 2), onCompleted(230));
    xs.subscriptions.assertEqual(subscribe(200, 230));
});

test('RetryWhen_Observable_Next_Complete', function () {
    var results, scheduler, xs, retry, ex;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onNext(10, 1), onNext(20, 2), onError(30, ex), onCompleted(40));
    results = scheduler.startWithCreate(function () {
        return xs.retryWhen(function(attempts) {
            return attempts.scan(0, function(count, ex) {
                return count + 1;
            }).takeWhile(function(count) {
                return count < 2;
            }); // returning any nexting observable should cause a continue
        });
    });
    results.messages.assertEqual(onNext(210, 1), onNext(220, 2), onNext(240, 1), onNext(250, 2), onCompleted(260));
    xs.subscriptions.assertEqual(subscribe(200, 230), subscribe(230, 260));
});

test('RetryWhen_Observable_Infinite', function () {
    var results, scheduler, xs, retry, ex;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createColdObservable(onNext(10, 1), onNext(20, 2), onError(30, ex), onCompleted(40));
    results = scheduler.startWithCreate(function () {
        return xs.retryWhen(function(){
            return Observable.never();
        });
    });
    results.messages.assertEqual(onNext(210, 1), onNext(220, 2));
    xs.subscriptions.assertEqual(subscribe(200, 1000));
});

