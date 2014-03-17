QUnit.module('ConcatProto');

var Observable = Rx.Observable,
  TestScheduler = Rx.TestScheduler,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe,
  isEqual = Rx.internals.isEqual;

asyncTest('ConcatAll_Task', function () {
  var sources = Rx.Observable.fromArray([
    new RSVP.Promise(function (res) { res(0); }),
    new RSVP.Promise(function (res) { res(1); }),
    new RSVP.Promise(function (res) { res(2); }),
    new RSVP.Promise(function (res) { res(3); }), 
  ]);

  var res = [];
  sources.concatAll().subscribe(
    function (x) {
      res.push(x);
    },
    function (err) {
      ok(false);
      start();
    }, 
    function () {
      ok(isEqual([0,1,2,3], res));
      start();
    });
});

asyncTest('ConcatAll_Task_Error', function () {
  var sources = Rx.Observable.fromArray([
    new RSVP.Promise(function (res) { res(0); }),
    new RSVP.Promise(function (res, rej) { rej(1); }),
    new RSVP.Promise(function (res) { res(2); }),
    new RSVP.Promise(function (res) { res(3); }), 
  ]);

  var res = [];
  sources.concatAll().subscribe(
    function (x) {
      res.push(x);
    },
    function (err) {
      ok(res.length === 1);
      equal(1, err);
      start();
    }, 
    function () {
      ok(false);
      start();
    });
});

test('Concat_EmptyEmpty', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(230)];
    msgs2 = [onNext(150, 1), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onCompleted(250));
});

test('Concat_EmptyNever', function () {
    var e1, e2, msgs1, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(230)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual();
});

test('Concat_NeverEmpty', function () {
    var e1, e2, msgs1, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(230)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return e2.concat(e1);
    });
    results.messages.assertEqual();
});

test('Concat_NeverNever', function () {
    var e1, e2, results, scheduler;
    scheduler = new TestScheduler();
    e1 = Observable.never();
    e2 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual();
});

test('Concat_EmptyThrow', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(230)];
    msgs2 = [onNext(150, 1), onError(250, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onError(250, ex));
});

test('Concat_ThrowEmpty', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onError(230, ex)];
    msgs2 = [onNext(150, 1), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onError(230, ex));
});

test('Concat_ThrowThrow', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onError(230, ex)];
    msgs2 = [onNext(150, 1), onError(250, 'ex2')];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onError(230, ex));
});

test('Concat_ReturnEmpty', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(230)];
    msgs2 = [onNext(150, 1), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onNext(210, 2), onCompleted(250));
});

test('Concat_EmptyReturn', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onCompleted(230)];
    msgs2 = [onNext(150, 1), onNext(240, 2), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onNext(240, 2), onCompleted(250));
});

test('Concat_ReturnNever', function () {
    var e1, e2, msgs1, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(230)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onNext(210, 2));
});

test('Concat_NeverReturn', function () {
    var e1, e2, msgs1, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onCompleted(230)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = Observable.never();
    results = scheduler.startWithCreate(function () {
        return e2.concat(e1);
    });
    results.messages.assertEqual();
});

test('Concat_ReturnReturn', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(220, 2), onCompleted(230)];
    msgs2 = [onNext(150, 1), onNext(240, 3), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onNext(220, 2), onNext(240, 3), onCompleted(250));
});

test('Concat_ThrowReturn', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onError(230, ex)];
    msgs2 = [onNext(150, 1), onNext(240, 2), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onError(230, ex));
});

test('Concat_ReturnThrow', function () {
    var e1, e2, ex, msgs1, msgs2, results, scheduler;
    ex = 'ex';
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(220, 2), onCompleted(230)];
    msgs2 = [onNext(150, 1), onError(250, ex)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onNext(220, 2), onError(250, ex));
});

test('Concat_SomeDataSomeData', function () {
    var e1, e2, msgs1, msgs2, results, scheduler;
    scheduler = new TestScheduler();
    msgs1 = [onNext(150, 1), onNext(210, 2), onNext(220, 3), onCompleted(225)];
    msgs2 = [onNext(150, 1), onNext(230, 4), onNext(240, 5), onCompleted(250)];
    e1 = scheduler.createHotObservable(msgs1);
    e2 = scheduler.createHotObservable(msgs2);
    results = scheduler.startWithCreate(function () {
        return e1.concat(e2);
    });
    results.messages.assertEqual(onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onCompleted(250));
});

