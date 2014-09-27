QUnit.module('TimeStamp');

if (!Rx.Observable.prototype.timeInterval) {
  // Add timeInterval for tests
  Rx.Observable.prototype.timeInterval = function (scheduler) {
    var source = this;
    Rx.helpers.isScheduler(scheduler) || (scheduler = Rx.Scheduler.timeout);
    return Rx.Observable.defer(function () {
      var last = scheduler.now();
      return source.map(function (x) {
        var now = scheduler.now(), span = now - last;
        last = now;
        return { value: x, interval: span };
      });
    });
  };
}

var Observable = Rx.Observable,
  TestScheduler = Rx.TestScheduler,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

function Timestamp(value, timestamp) {
    this.value = value;
    this.timestamp = timestamp;
}

Timestamp.prototype.toString = function () {
  return this.value + '@' + this.Timestamp;
};

Timestamp.prototype.equals = function (other) {
  if (other == null) { return false; }
  return this.toString() === other.toString();
};

test('Timestamp_Regular', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(230, 3),
    onNext(260, 4),
    onNext(300, 5),
    onNext(350, 6),
    onCompleted(400)
  );

  var results = scheduler.startWithCreate(function () {
    return xs.timestamp(scheduler).select(function (x) {
      return new Timestamp(x.value, x.timestamp);
    });
  });

  results.messages.assertEqual(
    onNext(210, new Timestamp(2, 210)),
    onNext(230, new Timestamp(3, 230)),
    onNext(260, new Timestamp(4, 260)),
    onNext(300, new Timestamp(5, 300)),
    onNext(350, new Timestamp(6, 350)),
    onCompleted(400)
  );
});

test('Timestamp_Empty', function () {
  var results, scheduler;
  scheduler = new TestScheduler();
  results = scheduler.startWithCreate(function () {
      return Rx.Observable.empty(scheduler).timeInterval(scheduler);
  });
  results.messages.assertEqual(onCompleted(201));
});

test('Timestamp_Error', function () {
  var ex, results, scheduler;
  ex = 'ex';
  scheduler = new TestScheduler();
  results = scheduler.startWithCreate(function () {
      return Rx.Observable.throwException(ex, scheduler).timeInterval(scheduler);
  });
  results.messages.assertEqual(onError(201, ex));
});

test('Timestamp_Never', function () {
  var results, scheduler;
  scheduler = new TestScheduler();
  results = scheduler.startWithCreate(function () {
      return Rx.Observable.never().timeInterval(scheduler);
  });
  results.messages.assertEqual();
});
