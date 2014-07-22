var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe;

function noop() {}

QUnit.module('StartAsync');

asyncTest('StartAsync', function () {
  var source = Rx.Observable.startAsync(function () {
    return new RSVP.Promise(function (res) { res(42); })
  });

  source.subscribe(function (x) {
    equal(42, x);
    start();
  });
});

asyncTest('StartAsync_Error', function () {
  var source = Rx.Observable.startAsync(function () {
    return new RSVP.Promise(function (res, rej) { rej(42); })
  });

  source.subscribe(noop, function (err) {
    equal(42, err);
    start();
  });
});

QUnit.module('Start');

test('Start_Action2', function () {
  var scheduler = new TestScheduler();
  
  var done = false;
  
  var res = scheduler.startWithCreate(function () {
    return Observable.start(function () {
      done = true;
    }, null, scheduler);
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
    }, null, scheduler);
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
    }, null, scheduler);
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
    }, context, scheduler);
  });
  
  res.messages.assertEqual(
    onNext(200, 42),
    onCompleted(200)
  );
});