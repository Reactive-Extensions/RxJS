'use strict';

var test = require('tape');
var Observable = require('../observable');
var TestScheduler = require('../testing/testscheduler');
var reactiveAssert = require('../testing/reactiveassert');
var ReactiveTest = require('../testing/reactivetest');
var onNext = ReactiveTest.onNext,
  onError = ReactiveTest.onError,
  onCompleted = ReactiveTest.onCompleted;

Observable.addToObject({
  'range': require('../observable/range'),
  'throw': require('../observable/throw')
});

Observable.addToPrototype({
  concat: require('../observable/concat'),
  controlled: require('../observable/controlled')
});

test('Observable#controlled gets some values', function (t) {
  var subscription;

  var scheduler = new TestScheduler();

  var results = scheduler.createObserver();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(230, 3),
    onNext(301, 4),
    onNext(350, 5),
    onNext(399, 6),
    onCompleted(500)
  );

  var controlled = xs.controlled();

  scheduler.scheduleAbsolute(null, 200, function () {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    controlled.request(5);
  });

  scheduler.scheduleAbsolute(null, 1000, function () {
      subscription.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(400, 2),
    onNext(400, 3),
    onNext(400, 4),
    onNext(400, 5),
    onNext(400, 6),
    onCompleted(500)
  ]);

  t.end();
});

test('Observable#controlled gets two sets of values', function (t) {
  var subscription;

  var scheduler = new TestScheduler();

  var results = scheduler.createObserver();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(230, 3),
    onNext(301, 4),
    onNext(350, 5),
    onNext(399, 6),
    onCompleted(500)
  );

  var controlled = xs.controlled();

  scheduler.scheduleAbsolute(null, 200, function () {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 400, function () {
    controlled.request(3);
  });

  scheduler.scheduleAbsolute(null, 450, function () {
    controlled.request(2);
  });

  scheduler.scheduleAbsolute(null, 1000, function () {
    subscription.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(400, 2),
    onNext(400, 3),
    onNext(400, 4),
    onNext(450, 5),
    onNext(450, 6),
    onCompleted(500)
  ]);

  t.end();
});

test('Observable#controlled fires on completed', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.createObserver();

  var source = Observable.range(1, 2).controlled();

  scheduler.scheduleAbsolute(null, 200, function(){
    source.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    source.request(3);
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(300, 1),
    onNext(300, 2),
    onCompleted(300)
  ]);

  t.end();
});

test('Observable#controlled cancels inflight request', function (t) {
  var scheduler = new TestScheduler();

  var source = scheduler.createHotObservable(
      onNext(400, 2),
      onNext(410, 3),
      onNext(420, 4)
  ).controlled();

  var results = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, 200, function(){
    source.request(3);
  });

  scheduler.scheduleAbsolute(null, 200, function(){
    source.request(2);
  });

  scheduler.scheduleAbsolute(null, 300, function(){
    source.subscribe(results);
  });

  scheduler.advanceBy(420);

  reactiveAssert(t, results.messages, [
    onNext(400, 2),
    onNext(410, 3)
  ]);

  t.end();
});

test('Observable#controlled fires onError', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.createObserver();

  var error = new Error('expected');
  var source = Observable.range(1, 2, scheduler)
    .concat(Observable['throw'](error, scheduler))
    .controlled();

  scheduler.scheduleAbsolute(null, 200, function(){
    source.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 300, function () {
    source.request(3);
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(300, 1),
    onNext(300, 2),
    onError(300, error)
  ]);

  t.end();
});

test('Observable#controlled drops messages with queue disabled', function (t) {
  var scheduler = new TestScheduler();

  var source = scheduler.createHotObservable(
    onNext(400, 1),
    onNext(410, 2),
    onNext(420, 3),
    onNext(430, 4),
    onCompleted(500)
  ).controlled(false);

  var results = scheduler.createObserver();

  scheduler.scheduleAbsolute(null, 415, function(){
    source.request(2);
  });

  scheduler.scheduleAbsolute(null, 200, function(){
    source.subscribe(results);
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(420, 3),
    onNext(430, 4),
    onCompleted(500)
  ]);

  t.end();
});

test('Observable#controlled requests are scheduled', function (t) {
  var scheduler = new TestScheduler();

  var results = scheduler.createObserver();

  var xs = scheduler.createHotObservable(
    onNext(210, 0),
    onNext(220, 1),
    onNext(230, 2),
    onNext(240, 3),
    onNext(250, 4),
    onNext(260, 5),
    onNext(270, 6),
    onCompleted(280)
  );

  var source = xs.controlled();

  // process one event at a time
  scheduler.scheduleAbsolute(null, 200, function() {
    source.subscribe(
      function (x) {
        // alternate between immediate and delayed request(1), causes hanging
        if (x % 2) {
          //Immediate
          source.request(1); // request next
        } else {
          //Delayed
          scheduler.schedule(source, function (_, source) {
            source.request(1); // request next
          });
        }
        results.onNext(x);
      },
      function (e) { results.onError(e); },
      function () { results.onCompleted(); }
    );
  });

  scheduler.scheduleAbsolute(null, 300, function() {
    source.request(1); // start by requesting first item
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(300, 0),
    onNext(301, 1),
    onNext(301, 2),
    onNext(302, 3),
    onNext(302, 4),
    onNext(303, 5),
    onNext(303, 6),
    onCompleted(303)
  ]);

  t.end();
});

test('Observable#controlled can request queued values passing true during construction', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(230, 3),
    onNext(301, 4),
    onNext(350, 5),
    onNext(399, 6),
    onCompleted(500)
  );

  var controlled = xs.controlled(true);

  var results = scheduler.createObserver();

  var subscription;
  scheduler.scheduleAbsolute(null, 200, function() {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 400, function() {
    controlled.request(5);
  });

  scheduler.scheduleAbsolute(null, 1000, function() {
    subscription.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(400, 2),
    onNext(400, 3),
    onNext(400, 4),
    onNext(400, 5),
    onNext(400, 6),
    onCompleted(500)
  ]);

  t.end();
});

test('Observable#controlled discards all values that occurred prior to calling request when passing false during construction', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(230, 3),
    onNext(301, 4),
    onNext(350, 5),
    onNext(399, 6),
    onNext(450, 7),
    onCompleted(500)
  );

  var controlled = xs.controlled(false);

  var results = scheduler.createObserver();

  var subscription;
  scheduler.scheduleAbsolute(null, 200, function() {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 300, function() {
    controlled.request(2);
  });

  scheduler.scheduleAbsolute(null, 1000, function() {
    subscription.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(301, 4),
    onNext(350, 5),
    onCompleted(500)
  ]);

  t.end();
});

test('Observable#controlled does not dequeue any values when requesting null, 0, or -1, or -5 items', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(230, 3),
    onNext(301, 4),
    onNext(350, 5),
    onNext(399, 6),
    onCompleted(500)
  );

  var controlled = xs.controlled();

  var results = scheduler.createObserver();

  var subscription;
  scheduler.scheduleAbsolute(null, 200, function() {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 400, function() {
    controlled.request(null);
  });

  scheduler.scheduleAbsolute(null, 410, function() {
    controlled.request(0);
  });

  scheduler.scheduleAbsolute(null, 420, function() {
    controlled.request(-1);
  });

  scheduler.scheduleAbsolute(null, 430, function() {
    controlled.request(-5);
  });

  scheduler.scheduleAbsolute(null, 440, function() {
    controlled.request(1);
  });

  scheduler.scheduleAbsolute(null, 1000, function() {
    subscription.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(440, 2)
  ]);

  t.end();
});

test('Observable#controlled relays requested values when only some of them are queued up', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(230, 3),
    onNext(301, 4),
    onNext(350, 5),
    onNext(399, 6),
    onCompleted(500)
  );

  var controlled = xs.controlled();

  var results = scheduler.createObserver();

  var subscription;
  scheduler.scheduleAbsolute(null, 200, function() {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 300, function() {
    controlled.request(4);
  });

  scheduler.scheduleAbsolute(null, 1000, function() {
    subscription.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(300, 2),
    onNext(300, 3),
    onNext(301, 4),
    onNext(350, 5)
  ]);

  t.end();
});

test('Observable#controlled can terminate the request via dispose when it is partially delivered', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(230, 3),
    onNext(301, 4),
    onNext(350, 5),
    onNext(399, 6),
    onCompleted(500)
  );

  var controlled = xs.controlled();

  var results = scheduler.createObserver();

  var subscription;
  scheduler.scheduleAbsolute(null, 200, function() {
    subscription = controlled.subscribe(results);
  });

  var theRequest;
  scheduler.scheduleAbsolute(null, 300, function() {
    theRequest = controlled.request(4);
  });

  scheduler.scheduleAbsolute(null, 310, function() {
    theRequest.dispose();
  });

  scheduler.scheduleAbsolute(null, 1000, function() {
    subscription.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(300, 2),
    onNext(300, 3),
    onNext(301, 4)
  ]);

  t.end();
});

test('Observable#controlled relays queued values, non-queued values, and then a queued value again', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(230, 3),
    onNext(320, 4),
    onNext(350, 5),
    onNext(399, 6),
    onNext(450, 7),
    onCompleted(500)
  );

  var controlled = xs.controlled();

  var results = scheduler.createObserver();

  var subscription;
  scheduler.scheduleAbsolute(null, 200, function() {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 300, function() {
    controlled.request(2);
    // queued values
  });

  scheduler.scheduleAbsolute(null, 310, function() {
    controlled.request(2);
    // values that haven't arrived yet
  });

  scheduler.scheduleAbsolute(null, 400, function() {
    controlled.request(1);
    // queued value again
  });

  scheduler.scheduleAbsolute(null, 1000, function() {
    subscription.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(300, 2),
    onNext(300, 3),
    onNext(320, 4),
    onNext(350, 5),
    onNext(400, 6)
  ]);

  t.end();
});

test('Observable#controlled relays requested values that occured before an error occured', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error('expected');

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(230, 3),
    onError(250, error)
  );

  var controlled = xs.controlled();

  var results = scheduler.createObserver();

  var subscription;
  scheduler.scheduleAbsolute(null, 200, function() {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 500, function() {
    controlled.request(2);
  });

  scheduler.scheduleAbsolute(null, 1000, function() {
    subscription.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(500, 2),
    onNext(500, 3),
    onError(500, error)
  ]);

  t.end();
});

test('Observable#controlled relays error immediately when requesting values after an error has occured when queue is empty', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error('expected');

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(300, 3),
    onError(400, error)
  );

  var controlled = xs.controlled();

  var results = scheduler.createObserver();

  var subscription;
  scheduler.scheduleAbsolute(null, 200, function() {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 350, function() {
    controlled.request(2);
  });

  scheduler.scheduleAbsolute(null, 1000, function() {
    subscription.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(350, 2),
    onNext(350, 3),
    onError(400, error)
  ]);

  t.end();
});

test('Observable#controlled relays completion immediately when requesting values after completion has occured when queue is empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(300, 3),
      onCompleted(400)
  );

  var controlled = xs.controlled();

  var results = scheduler.createObserver();

  var subscription;
  scheduler.scheduleAbsolute(null, 200, function() {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 350, function() {
    controlled.request(2);
  });

  scheduler.scheduleAbsolute(null, 1000, function() {
    subscription.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(350, 2),
    onNext(350, 3),
    onCompleted(400)
  ]);

  t.end();
});

test('Observable#controlled does not relay error when requesting values after an error has occured when queue is not empty', function (t) {
  var scheduler = new TestScheduler();

  var unexpectedError = new Error('unexpected');

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(300, 3),
    onError(400, unexpectedError)
  );

  var controlled = xs.controlled();

  var results = scheduler.createObserver();

  var subscription;
  scheduler.scheduleAbsolute(null, 200, function() {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 350, function() {
    controlled.request(1);
  });

  scheduler.scheduleAbsolute(null, 1000, function() {
    subscription.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(350, 2)
  ]);

  t.end();
});

test('Observable#controlled does not relay completion when requesting values after completion has occured when queue is not empty', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(300, 3),
    onCompleted(400)
  );

  var controlled = xs.controlled();

  var results = scheduler.createObserver();

  var subscription;
  scheduler.scheduleAbsolute(null, 200, function() {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 350, function() {
    controlled.request(1);
  });

  scheduler.scheduleAbsolute(null, 1000, function() {
    subscription.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(350, 2)
  ]);

  t.end();
});

test('Observable#controlled ignores all values when queue is disabled but delivers completion immediately when it occurs', function (t) {
  var scheduler = new TestScheduler();

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(230, 3),
    onNext(301, 4),
    onNext(350, 5),
    onNext(399, 6),
    onCompleted(500)
  );

  var controlled = xs.controlled(false);

  var results = scheduler.createObserver();

  var subscription;
  scheduler.scheduleAbsolute(null, 200, function() {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 400, function() {
    controlled.request(5);
  });

  scheduler.scheduleAbsolute(null, 1000, function() {
    subscription.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onCompleted(500)
  ]);

  t.end();
});

test('Observable#controlled ignores all values when queue is disabled but delivers error immediately when it occurs', function (t) {
  var scheduler = new TestScheduler();

  var error = new Error('expected');

  var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(230, 3),
    onNext(301, 4),
    onNext(350, 5),
    onNext(399, 6),
    onError(500, error)
  );

  var controlled = xs.controlled(false);

  var results = scheduler.createObserver();

  var subscription;
  scheduler.scheduleAbsolute(null, 200, function() {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(null, 400, function() {
    controlled.request(5);
  });

  scheduler.scheduleAbsolute(null, 1000, function() {
    subscription.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onError(500, error)
  ]);

  t.end();
});


test('Observable#controlled disposes partially delivered request when issuing a new one', function (t) {
 var scheduler = new TestScheduler();

 var xs = scheduler.createHotObservable(
    onNext(150, 1),
    onNext(210, 2),
    onNext(230, 3),
    onNext(301, 4),
    onNext(450, 5),
    onNext(460, 6),
    onCompleted(500)
  );

  var controlled = xs.controlled();

  var results = scheduler.createObserver();

  var subscription;
  scheduler.scheduleAbsolute(null, 200, function() {
    subscription = controlled.subscribe(
      function(x) {
        results.onNext(x);
      },
      function(err) {
        results.onError(err);
      },
      function() {
        results.onCompleted();
      }
    );
  });

  scheduler.scheduleAbsolute(null, 400, function() {

    controlled.request(5);

    controlled.request(1);
    // cause the previous request that hasn't completed yet to get discarded

  });

  scheduler.scheduleAbsolute(null, 1000, function() {
    subscription.dispose();
  });

  scheduler.start();

  reactiveAssert(t, results.messages, [
    onNext(400, 2),
    onNext(400, 3),
    onNext(400, 4),
    onNext(450, 5)
  ]);

  t.end();
});
