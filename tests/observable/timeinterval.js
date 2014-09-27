QUnit.module('TimeInterval');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

var TimeInterval = (function () {
    function TimeInterval(value, interval) {
        this.value = value;
        this.interval = interval;
    }
    TimeInterval.prototype.toString = function () {
        return this.value + '@' + this.interval;
    };
    TimeInterval.prototype.Equals = function (other) {
        return other.interval === this.interval && other.value === this.value;
    };
    return TimeInterval;
})();

test('TimeInterval_Regular', function () {
    var results, scheduler, xs;
    scheduler = new TestScheduler();
    xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(230, 3), onNext(260, 4), onNext(300, 5), onNext(350, 6), onCompleted(400));
    results = scheduler.startWithCreate(function () {
        return xs.timeInterval(scheduler).select(function (x) {
            return new TimeInterval(x.value, x.interval);
        });
    });
    results.messages.assertEqual(onNext(210, new TimeInterval(2, 10)), onNext(230, new TimeInterval(3, 20)), onNext(260, new TimeInterval(4, 30)), onNext(300, new TimeInterval(5, 40)), onNext(350, new TimeInterval(6, 50)), onCompleted(400));
});

test('TimeInterval_Empty', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.empty(scheduler).timeInterval(scheduler);
    });
    results.messages.assertEqual(onCompleted(201));
});

test('TimeInterval_Error', function () {
    var ex, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.throwException(ex, scheduler).timeInterval(scheduler);
    });
    results.messages.assertEqual(onError(201, ex));
});
test('TimeInterval_Never', function () {
    var results, scheduler;
    scheduler = new TestScheduler();
    results = scheduler.startWithCreate(function () {
        return Rx.Observable.never().timeInterval(scheduler);
    });
    results.messages.assertEqual();
});
