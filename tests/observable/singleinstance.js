QUnit.module('SingleInstance');

var TestScheduler = Rx.TestScheduler,
    Observable = Rx.Observable,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    Subject = Rx.Subject,
    created = Rx.ReactiveTest.created,
    disposed = Rx.ReactiveTest.disposed,
    subscribed = Rx.ReactiveTest.subscribed,
    inherits = Rx.internals.inherits;

test('SingleInstance_Basic', function () {
    var scheduler = new TestScheduler();
    
    var counter = 0;

    var xs = scheduler.createColdObservable(
      onNext(100, 1),
      onNext(150, 2),
      onNext(200, 3),
      onCompleted(250)
    );

    var ys = null;
    var results1 = scheduler.createObserver();
    var results2 = scheduler.createObserver();
    var disposable = null;

    scheduler.scheduleAbsolute(created, function() {
        ys = xs.singleInstance();
    });

    scheduler.scheduleAbsolute(subscribed, function() {
        disposable = new Rx.CompositeDisposable(
            ys.subscribe(results1),
            ys.subscribe(results2)
        );
    });

    scheduler.scheduleAbsolute(disposed, function() {
        disposable.dispose();
    });

    scheduler.start();

    results1.messages.assertEqual(
        onNext(300, 1),
        onNext(350, 2),
        onNext(400, 3),
        onCompleted(450)
    );

    results2.messages.assertEqual(
        onNext(300, 1),
        onNext(350, 2),
        onNext(400, 3),
        onCompleted(450)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 450)
    );
});

test('SingleInstance_Can_Resubscribe_After_Stopped', function () {
    var scheduler = new TestScheduler();
    
    var counter = 0;

    var xs = scheduler.createColdObservable(
      onNext(100, 1),
      onNext(150, 2),
      onNext(200, 3),
      onCompleted(250)
    );

    var ys = null;
    var results1 = scheduler.createObserver();
    var results2 = scheduler.createObserver();
    var disposable = new Rx.SerialDisposable();

    scheduler.scheduleAbsolute(100, function() {
        ys = xs.singleInstance();
    });

    scheduler.scheduleAbsolute(200, function() {
        disposable.setDisposable(ys.subscribe(results1));
    });

    scheduler.scheduleAbsolute(600, function() {
        disposable.setDisposable(ys.subscribe(results2));
    });

    scheduler.scheduleAbsolute(900, function(){
        disposable.dispose();
    });

    scheduler.start();

    results1.messages.assertEqual(
        onNext(300, 1),
        onNext(350, 2),
        onNext(400, 3),
        onCompleted(450)
    );

    results2.messages.assertEqual(
        onNext(700, 1),
        onNext(750, 2),
        onNext(800, 3),
        onCompleted(850)
    );

    xs.subscriptions.assertEqual(
      subscribe(200, 450),
      subscribe(600, 850)
    );
});


