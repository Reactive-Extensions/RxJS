QUnit.module('Controlled');

var TestScheduler = Rx.TestScheduler,
  onNext = Rx.ReactiveTest.onNext,
  onError = Rx.ReactiveTest.onError,
  onCompleted = Rx.ReactiveTest.onCompleted,
  subscribe = Rx.ReactiveTest.subscribe;

test('controlled gets some values', function () {
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

  scheduler.scheduleAbsolute(200, function () {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(400, function () {
    controlled.request(5);
  });

  scheduler.scheduleAbsolute(1000, function () {
      subscription.dispose();
  });

  scheduler.start();

  results.messages.assertEqual(
    onNext(400, 2),
    onNext(400, 3),
    onNext(400, 4),
    onNext(400, 5),
    onNext(400, 6),
    onCompleted(500)
  );
});

test('controlled gets two sets of values', function () {
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

  scheduler.scheduleAbsolute(200, function () {
    subscription = controlled.subscribe(results);
  });

  scheduler.scheduleAbsolute(400, function () {
    controlled.request(3);
  });

  scheduler.scheduleAbsolute(450, function () {
    controlled.request(2);
  });

  scheduler.scheduleAbsolute(1000, function () {
      subscription.dispose();
  });

  scheduler.start();

  results.messages.assertEqual(
    onNext(400, 2),
    onNext(400, 3),
    onNext(400, 4),
    onNext(450, 5),
    onNext(450, 6),
    onCompleted(500)
  );
});

test('controlled fires on completed', function(){

    var scheduler = new TestScheduler();
    var results = scheduler.createObserver();

    var source = Rx.Observable.range(1, 2).controlled();

    scheduler.scheduleAbsolute(200, function(){
        source.subscribe(results);
    });

    scheduler.scheduleAbsolute(300, function () {
        source.request(3);
    });

    scheduler.start();

    results.messages.assertEqual(
        onNext(300, 1),
        onNext(300, 2),
        onCompleted(300)
    );
});

test('controlled cancels inflight request', function(){

    var scheduler = new TestScheduler();

    var source = scheduler.createHotObservable(
        onNext(400, 2),
        onNext(410, 3),
        onNext(420, 4)
    ).controlled();

    var results = scheduler.createObserver();

    scheduler.scheduleAbsolute(200, function(){
        source.request(3);
    });

    scheduler.scheduleAbsolute(200, function(){
        source.request(2);
    });

    scheduler.scheduleAbsolute(300, function(){
        source.subscribe(results);
    });

    scheduler.advanceBy(420);


    results.messages.assertEqual(
        onNext(400, 2),
        onNext(410, 3)
    );


});

test('controlled fires onError', function(){

    var scheduler = new TestScheduler();
    var results = scheduler.createObserver();

    var error = new Error("expected");
    var source = Rx.Observable.range(1, 2, scheduler)
        .concat(Rx.Observable.throwError(error, scheduler))
        .controlled();

    scheduler.scheduleAbsolute(200, function(){
        source.subscribe(results);
    });


    scheduler.scheduleAbsolute(300, function () {
        source.request(3);
    });

    scheduler.start();

    results.messages.assertEqual(
        onNext(300, 1),
        onNext(300, 2),
        onError(300, error)
    );

});

test('controlled drops messages with queue disabled', function(){

    var scheduler = new TestScheduler();

    var source = scheduler.createHotObservable(
        onNext(400, 1),
        onNext(410, 2),
        onNext(420, 3),
        onNext(430, 4),
        onCompleted(500)
    ).controlled(false);

    var results = scheduler.createObserver();


    scheduler.scheduleAbsolute(415, function(){
        source.request(2);
    });

    scheduler.scheduleAbsolute(200, function(){
        source.subscribe(results);
    });

    scheduler.start();

    results.messages.assertEqual(
      onNext(420, 3),
      onNext(430, 4),
      onCompleted(500)
    );


});

test('controlled requests are scheduled', function() {
    var scheduler = new TestScheduler();
    var results = scheduler.createObserver();

    var xs = scheduler
        .createHotObservable(
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
    scheduler.scheduleAbsolute(200, function() {
        var subscription =
            source.subscribe(
            function (x) {
                // alternate between immediate and delayed request(1), causes hanging
                if (x % 2) {
                    //Immediate
                    source.request(1); // request next
                } else {
                    //Delayed
                    scheduler.schedule(function () {
                        source.request(1); // request next
                    });
                }
                results.onNext(x);
            },
            results.onError.bind(results),
            results.onCompleted.bind(results)
        );
    });

    scheduler.scheduleAbsolute(300, function() {
        source.request(1); // start by requesting first item
    });

    scheduler.start();

    results.messages.assertEqual(
        onNext(300, 0),
        onNext(301, 1),
        onNext(301, 2),
        onNext(302, 3),
        onNext(302, 4),
        onNext(303, 5),
        onNext(303, 6),
        onCompleted(303)
    );
});

test('controlled can request queued values passing true during construction', function() {

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
    scheduler.scheduleAbsolute(200, function() {
        subscription = controlled.subscribe(results);
    });

    scheduler.scheduleAbsolute(400, function() {
        controlled.request(5);
    });

    scheduler.scheduleAbsolute(1000, function() {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
        onNext(400, 2),
        onNext(400, 3),
        onNext(400, 4),
        onNext(400, 5),
        onNext(400, 6),
        onCompleted(500)
    );

});

test('controlled discards all values that occurred prior to calling request when passing false during construction', function() {

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
    scheduler.scheduleAbsolute(200, function() {
        subscription = controlled.subscribe(results);
    });

    scheduler.scheduleAbsolute(300, function() {
        controlled.request(2);
    });

    scheduler.scheduleAbsolute(1000, function() {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
        onNext(301, 4),
        onNext(350, 5),
        onCompleted(500)
    );

});

test("controlled doesn't dequeue any values when requesting null, 0, or -1, or -5 items", function() {

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
    scheduler.scheduleAbsolute(200, function() {
        subscription = controlled.subscribe(results);
    });

    scheduler.scheduleAbsolute(400, function() {
        controlled.request(null);
    });

    scheduler.scheduleAbsolute(410, function() {
        controlled.request(0);
    });

    scheduler.scheduleAbsolute(420, function() {
        controlled.request(-1);
    });

    scheduler.scheduleAbsolute(430, function() {
        controlled.request(-5);
    });

    scheduler.scheduleAbsolute(440, function() {
        controlled.request(1);
    });

    scheduler.scheduleAbsolute(1000, function() {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
        onNext(440, 2)
    );

});

test('controlled relays requested values when only some of them are queued up', function() {

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
    scheduler.scheduleAbsolute(200, function() {
        subscription = controlled.subscribe(results);
    });

    scheduler.scheduleAbsolute(300, function() {
        controlled.request(4);
    });

    scheduler.scheduleAbsolute(1000, function() {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
        onNext(300, 2),
        onNext(300, 3),
        onNext(301, 4),
        onNext(350, 5)
    );

});

/*
test('controlled can terminate the request via dispose when it is partially delivered', function() {

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
    scheduler.scheduleAbsolute(200, function() {
        subscription = controlled.subscribe(results);
    });

    var theRequest;
    scheduler.scheduleAbsolute(300, function() {
        theRequest = controlled.request(4);
    });

    scheduler.scheduleAbsolute(310, function() {
        theRequest.dispose();
    });

    scheduler.scheduleAbsolute(1000, function() {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
        onNext(300, 2),
        onNext(300, 3),
        onNext(301, 4)
    );

});
*/

test('controlled relays queued values, non-queued values, and then a queued value again', function() {

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
    scheduler.scheduleAbsolute(200, function() {
        subscription = controlled.subscribe(results);
    });

    scheduler.scheduleAbsolute(300, function() {
        controlled.request(2);
            // queued values
    });

    scheduler.scheduleAbsolute(310, function() {
        controlled.request(2);
            // values that haven't arrived yet
    });

    scheduler.scheduleAbsolute(400, function() {
        controlled.request(1);
            // queued value again
    });

    scheduler.scheduleAbsolute(1000, function() {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
        onNext(300, 2),
        onNext(300, 3),
        onNext(320, 4),
        onNext(350, 5),
        onNext(400, 6)
    );

});

test('controlled relays requested values that occured before an error occured', function() {

    var scheduler = new TestScheduler();

    var error = new Error("expected");

    var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onNext(230, 3),
        onError(250, error)
    );

    var controlled = xs.controlled();

    var results = scheduler.createObserver();

    var subscription;
    scheduler.scheduleAbsolute(200, function() {
        subscription = controlled.subscribe(results);
    });

    scheduler.scheduleAbsolute(500, function() {
        controlled.request(2);
    });

    scheduler.scheduleAbsolute(1000, function() {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
        onNext(500, 2),
        onNext(500, 3),
        onError(500, error)
    );

});

test('controlled relays error immediately when requesting values after an error has occured when queue is empty', function() {

    var scheduler = new TestScheduler();

    var error = new Error("expected");

    var xs = scheduler.createHotObservable(
        onNext(150, 1),
        onNext(210, 2),
        onNext(300, 3),
        onError(400, error)
    );

    var controlled = xs.controlled();

    var results = scheduler.createObserver();

    var subscription;
    scheduler.scheduleAbsolute(200, function() {
        subscription = controlled.subscribe(results);
    });

    scheduler.scheduleAbsolute(350, function() {
        controlled.request(2);
    });

    scheduler.scheduleAbsolute(1000, function() {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
        onNext(350, 2),
        onNext(350, 3),
        onError(400, error)
    );

});

test('controlled relays completion immediately when requesting values after completion has occured when queue is empty', function() {

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
    scheduler.scheduleAbsolute(200, function() {
        subscription = controlled.subscribe(results);
    });

    scheduler.scheduleAbsolute(350, function() {
        controlled.request(2);
    });

    scheduler.scheduleAbsolute(1000, function() {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
        onNext(350, 2),
        onNext(350, 3),
        onCompleted(400)
    );

});

test("controlled doesn't relay error when requesting values after an error has occured when queue is not empty", function() {

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
    scheduler.scheduleAbsolute(200, function() {
        subscription = controlled.subscribe(results);
    });

    scheduler.scheduleAbsolute(350, function() {
        controlled.request(1);
    });

    scheduler.scheduleAbsolute(1000, function() {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
        onNext(350, 2)
    );

});

test("controlled doesn't relay completion when requesting values after completion has occured when queue is not empty", function() {

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
    scheduler.scheduleAbsolute(200, function() {
        subscription = controlled.subscribe(results);
    });

    scheduler.scheduleAbsolute(350, function() {
        controlled.request(1);
    });

    scheduler.scheduleAbsolute(1000, function() {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
        onNext(350, 2)
    );

});

test('controlled ignores all values when queue is disabled but delivers completion immediately when it occurs', function() {

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
    scheduler.scheduleAbsolute(200, function() {
        subscription = controlled.subscribe(results);
    });

    scheduler.scheduleAbsolute(400, function() {
        controlled.request(5);
    });

    scheduler.scheduleAbsolute(1000, function() {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
        onCompleted(500)
    );

});

test('controlled ignores all values when queue is disabled but delivers error immediately when it occurs', function() {

    var scheduler = new TestScheduler();

    var error = new Error("expected");

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
    scheduler.scheduleAbsolute(200, function() {
        subscription = controlled.subscribe(results);
    });

    scheduler.scheduleAbsolute(400, function() {
        controlled.request(5);
    });

    scheduler.scheduleAbsolute(1000, function() {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
        onError(500, error)
    );

});


test('controlled disposes partially delivered request when issuing a new one', function() {

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
    scheduler.scheduleAbsolute(200, function() {
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

    scheduler.scheduleAbsolute(400, function() {

        controlled.request(5);

        controlled.request(1);
            // cause the previous request that hasn't completed yet to get discarded

    });

    scheduler.scheduleAbsolute(1000, function() {
        subscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual(
        onNext(400, 2),
        onNext(400, 3),
        onNext(400, 4),
        onNext(450, 5)
    );

});
