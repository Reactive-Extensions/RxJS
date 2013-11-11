QUnit.module('Switch');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;


test('Switch_Data', function () {
    var scheduler = new TestScheduler();
    
    var xs = scheduler.createHotObservable(onNext(300, scheduler.createColdObservable(onNext(10, 101), onNext(20, 102), onNext(110, 103), onNext(120, 104), onNext(210, 105), onNext(220, 106), onCompleted(230))), onNext(400, scheduler.createColdObservable(onNext(10, 201), onNext(20, 202), onNext(30, 203), onNext(40, 204), onCompleted(50))), onNext(500, scheduler.createColdObservable(onNext(10, 301), onNext(20, 302), onNext(30, 303), onNext(40, 304), onCompleted(150))), onCompleted(600));
    
    var results = scheduler.startWithCreate(function () {
        return xs.switchLatest();
    });

    results.messages.assertEqual(onNext(310, 101), onNext(320, 102), onNext(410, 201), onNext(420, 202), onNext(430, 203), onNext(440, 204), onNext(510, 301), onNext(520, 302), onNext(530, 303), onNext(540, 304), onCompleted(650));
});

test('Switch_InnerThrows', function () {
    var ex, results, scheduler, xs;
    var ex = 'ex';

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(onNext(300, scheduler.createColdObservable(onNext(10, 101), onNext(20, 102), onNext(110, 103), onNext(120, 104), onNext(210, 105), onNext(220, 106), onCompleted(230))), onNext(400, scheduler.createColdObservable(onNext(10, 201), onNext(20, 202), onNext(30, 203), onNext(40, 204), onError(50, ex))), onNext(500, scheduler.createColdObservable(onNext(10, 301), onNext(20, 302), onNext(30, 303), onNext(40, 304), onCompleted(150))), onCompleted(600));
    
    var results = scheduler.startWithCreate(function () {
        return xs.switchLatest();
    });

    results.messages.assertEqual(onNext(310, 101), onNext(320, 102), onNext(410, 201), onNext(420, 202), onNext(430, 203), onNext(440, 204), onError(450, ex));
});

test('Switch_OuterThrows', function () {
    var ex = 'ex';
    
    var scheduler = new TestScheduler();
    
    var xs = scheduler.createHotObservable(onNext(300, scheduler.createColdObservable(onNext(10, 101), onNext(20, 102), onNext(110, 103), onNext(120, 104), onNext(210, 105), onNext(220, 106), onCompleted(230))), onNext(400, scheduler.createColdObservable(onNext(10, 201), onNext(20, 202), onNext(30, 203), onNext(40, 204), onCompleted(50))), onError(500, ex));
    
    var results = scheduler.startWithCreate(function () {
        return xs.switchLatest();
    });

    results.messages.assertEqual(onNext(310, 101), onNext(320, 102), onNext(410, 201), onNext(420, 202), onNext(430, 203), onNext(440, 204), onError(500, ex));
});

test('Switch_NoInner', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(onCompleted(500));

    var results = scheduler.startWithCreate(function () {
        return xs.switchLatest();
    });

    results.messages.assertEqual(onCompleted(500));
});

test('Switch_InnerCompletes', function () {
    var scheduler = new TestScheduler();
    
    var xs = scheduler.createHotObservable(onNext(300, scheduler.createColdObservable(onNext(10, 101), onNext(20, 102), onNext(110, 103), onNext(120, 104), onNext(210, 105), onNext(220, 106), onCompleted(230))), onCompleted(540));
    
    var results = scheduler.startWithCreate(function () {
        return xs.switchLatest();
    });

    results.messages.assertEqual(onNext(310, 101), onNext(320, 102), onNext(410, 103), onNext(420, 104), onNext(510, 105), onNext(520, 106), onCompleted(540));
});