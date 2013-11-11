QUnit.module('Never');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
	created = Rx.ReactiveTest.created,
	subscribed = Rx.ReactiveTest.subscribed,
	disposed = Rx.ReactiveTest.disposed;

test('Never_Basic', function () {
    var scheduler = new TestScheduler();
    
    var xs = Observable.never();
    
    var results = scheduler.createObserver();
    
    xs.subscribe(results);
    
    scheduler.start();
    
    results.messages.assertEqual();
});