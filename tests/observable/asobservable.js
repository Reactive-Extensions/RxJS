QUnit.module('AsObservable');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

test('AsObservable_Hides', function () {
    var someObservable;
    someObservable = Rx.Observable.empty();
    ok(someObservable.asObservable() !== someObservable);
});

test('AsObservable_Never', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.never().asObservable();
    });
    results.messages.assertEqual();
});

test('AsObservable_Empty', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.asObservable();
    }).messages;
    equal(1, results.length);
    ok(results[0].value.kind === 'C' && results[0].time === 250);
});

test('AsObservable_Throw', function () {
    var ex, results, scheduler, xs;
    ex = 'ex';
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onError(250, ex));
    results = scheduler.startWithCreate(function () {
        return xs.asObservable();
    }).messages;
    equal(1, results.length);
    ok(results[0].value.kind === 'E' && results[0].value.exception === ex && results[0].time === 250);
});

test('AsObservable_Return', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(220, 2), onCompleted(250));
    results = scheduler.startWithCreate(function () {
        return xs.asObservable();
    }).messages;
    equal(2, results.length);
    ok(results[0].value.kind === 'N' && results[0].value.value === 2 && results[0].time === 220);
    ok(results[1].value.kind === 'C' && results[1].time === 250);
});

test('AsObservable_IsNotEager', function () {
    var scheduler, subscribed, xs;
    scheduler = new TestScheduler();
    subscribed = false;
    xs = Rx.Observable.create(function (obs) {
        var disp;
        subscribed = true;
        disp = scheduler.createHotObservable(onNext(150, 1), onNext(220, 2), onCompleted(250)).subscribe(obs);
        return function () {
            return disp.dispose();
        };
    });
    xs.asObservable();
    ok(!subscribed);
    scheduler.startWithCreate(function () {
        return xs.asObservable();
    });
    ok(subscribed);
});
