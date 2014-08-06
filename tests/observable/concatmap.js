QUnit.module('ConcatMap');

var Observable = Rx.Observable,
    TestScheduler = Rx.TestScheduler,
    SerialDisposable = Rx.SerialDisposable,
    onNext = Rx.ReactiveTest.onNext,
    onError = Rx.ReactiveTest.onError,
    onCompleted = Rx.ReactiveTest.onCompleted,
    subscribe = Rx.ReactiveTest.subscribe,
    created = Rx.ReactiveTest.created,
    subscribed = Rx.ReactiveTest.subscribed,
    disposed = Rx.ReactiveTest.disposed,
    isEqual = Rx.internals.isEqual;

function noop () { }

asyncTest('ConcatMap_Then_Complete_Task', function () {
  var xs = Rx.Observable.fromArray([4,3,2,1]);

  var ys = new RSVP.Promise(function (res) { res(42); });

  var results = [];
  xs.concatMap(ys).subscribe(
    function (x) {
      results.push(x);
    }, 
    function (err) {
      ok(false);
      start();
    },
    function () {
      ok(isEqual([42,42,42,42], results));
      start();
    });
});

asyncTest('ConcatMap_Then_Error_Task', function () {
  var xs = Rx.Observable.fromArray([4,3,2,1]);

  var ys = new RSVP.Promise(function (res, rej) { rej(42); });

  xs.concatMap(ys).subscribe(
    function (x) {
      ok(false);
      start();
    }, 
    function (err) {
      equal(err, 42);
      start();
    },
    function () {
      ok(false);
      start();
    });
});

asyncTest('ConcatMap_Selector_Complete_Task', function () {
  var xs = Rx.Observable.fromArray([4,3,2,1]);

  var results = [];
  xs.concatMap(function (x, i) {
    return new RSVP.Promise(function (res) { res(x + i); });
  }).subscribe(
    function (x) {
      results.push(x);
    }, 
    function (err) {
      ok(false);
      start();
    },
    function () {
      ok(isEqual([4, 4, 4, 4], results));
      start();
    });
});

asyncTest('ConcatMap_Selector_Error_Task', function () {
  var xs = Rx.Observable.fromArray([4,3,2,1]);

  xs.concatMap(function (x, i) {
    return new RSVP.Promise(function (res, rej) { rej(x + i); })
  }).subscribe(
    function (x) {
      ok(false);
      start();
    }, 
    function (err) {
      equal(err, 4);
      start();
    },
    function () {
      ok(false);
      start();
    });
});

asyncTest('ConcatMap_ResultSelector_Complete_Task', function () {
  var xs = Rx.Observable.fromArray([4,3,2,1]);

  var results = [];
  xs.concatMap(
    function (x, i) {
      return new RSVP.Promise(function (res) { res(x + i); });
    },
    function (x, y, i) {
      return x + y + i;
    })
    .subscribe(
      function (x) {
        results.push(x);
      }, 
      function (err) {
        ok(false);
        start();
      },
      function () {
        ok(isEqual([8, 8, 8, 8], results));
        start();
      });
});

asyncTest('ConcatMap_ResultSelector_Error_Task', function () {
  var xs = Rx.Observable.fromArray([4,3,2,1]);

  xs.concatMap(
    function (x, i) {
      return new RSVP.Promise(function (res, rej) { rej(x + i); })
    },
    function (x, y, i) {
      return x + y + i;
    })
    .subscribe(
      function (x) {
        ok(false);
        start();
      }, 
      function (err) {
        equal(err, 4);
        start();
      },
      function () {
        ok(false);
        start();
      });
});

test('ConcatMap_Then_Complete_Complete', function () {
  var scheduler = new TestScheduler();

  var xs = scheduler.createColdObservable(
      onNext(100, 4), 
      onNext(200, 2), 
      onNext(300, 3), 
      onNext(400, 1), 
      onCompleted(500));

  var ys = scheduler.createColdObservable(
      onNext(50, "foo"), 
      onNext(100, "bar"), 
      onNext(150, "baz"), 
      onNext(200, "qux"), 
      onCompleted(250));

  var results = scheduler.startWithDispose(function () {
      return xs.concatMap(ys);
  }, 2000);

  results.messages.assertEqual(
      onNext(350, "foo"), 
      onNext(400, "bar"), 
      onNext(450, "baz"),  
      onNext(500, "qux"), 
      onNext(600, "foo"),  
      onNext(650, "bar"), 
      onNext(700, "baz"),
      onNext(750, "qux"), 
      onNext(850, "foo"),
      onNext(900, "bar"), 
      onNext(950, "baz"),
      onNext(1000, "qux"),
      onNext(1100, "foo"),
      onNext(1150, "bar"),
      onNext(1200, "baz"),
      onNext(1250, "qux"),
      onCompleted(1300));
  
  xs.subscriptions.assertEqual(subscribe(200, 700));
  
  ys.subscriptions.assertEqual(
      subscribe(300, 550), 
      subscribe(550, 800), 
      subscribe(800, 1050),
      subscribe(1050, 1300));
});

test('ConcatMap_Then_Complete_Complete_2', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createColdObservable(
    onNext(100, 4), 
    onNext(200, 2), 
    onNext(300, 3), 
    onNext(400, 1), 
    onCompleted(700));
  
  var ys = scheduler.createColdObservable(
    onNext(50, "foo"), 
    onNext(100, "bar"), 
    onNext(150, "baz"), 
    onNext(200, "qux"), 
    onCompleted(250));
  
  var results = scheduler.startWithDispose(function () {
      return xs.concatMap(ys);
  }, 2000);

  results.messages.assertEqual(
    onNext(350, "foo"), 
    onNext(400, "bar"), 
    onNext(450, "baz"), 
    onNext(500, "qux"), 
    onNext(600, "foo"), 
    onNext(650, "bar"), 
    onNext(700, "baz"), 
    onNext(750, "qux"), 
    onNext(850, "foo"), 
    onNext(900, "bar"), 
    onNext(950, "baz"), 
    onNext(1000, "qux"), 
    onNext(1100, "foo"), 
    onNext(1150, "bar"), 
    onNext(1200, "baz"), 
    onNext(1250, "qux"), 
    onCompleted(1300));
  
  xs.subscriptions.assertEqual(subscribe(200, 900));
  
  ys.subscriptions.assertEqual(
    subscribe(300, 550), 
    subscribe(550, 800), 
    subscribe(800, 1050), 
    subscribe(1050, 1300));
});

test('ConcatMap_Then_Never_Complete', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createColdObservable(
    onNext(100, 4), 
    onNext(200, 2), 
    onNext(300, 3), 
    onNext(400, 1), 
    onNext(500, 5), 
    onNext(700, 0));
  
  var ys = scheduler.createColdObservable(
    onNext(50, "foo"), 
    onNext(100, "bar"), 
    onNext(150, "baz"), 
    onNext(200, "qux"), 
    onCompleted(250));
  
  var results = scheduler.startWithDispose(function () {
      return xs.concatMap(ys);
  }, 2000);

  results.messages.assertEqual(
    onNext(350, "foo"), 
    onNext(400, "bar"), 
    onNext(450, "baz"), 
    onNext(500, "qux"), 
    onNext(600, "foo"), 
    onNext(650, "bar"), 
    onNext(700, "baz"), 
    onNext(750, "qux"), 
    onNext(850, "foo"), 
    onNext(900, "bar"), 
    onNext(950, "baz"), 
    onNext(1000, "qux"), 
    onNext(1100, "foo"), 
    onNext(1150, "bar"), 
    onNext(1200, "baz"), 
    onNext(1250, "qux"),
    onNext(1350, "foo"), 
    onNext(1400, "bar"), 
    onNext(1450, "baz"), 
    onNext(1500, "qux"),
    onNext(1600, "foo"), 
    onNext(1650, "bar"), 
    onNext(1700, "baz"), 
    onNext(1750, "qux"));
  
  xs.subscriptions.assertEqual(subscribe(200, 2000));
  
  ys.subscriptions.assertEqual(
    subscribe(300, 550), 
    subscribe(550, 800), 
    subscribe(800, 1050), 
    subscribe(1050, 1300),
    subscribe(1300, 1550), 
    subscribe(1550, 1800));
});

test('ConcatMap_Then_Complete_Never', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createColdObservable(
    onNext(100, 4), 
    onNext(200, 2), 
    onNext(300, 3), 
    onNext(400, 1), 
    onCompleted(500));
  
  var ys = scheduler.createColdObservable(
    onNext(50, "foo"), 
    onNext(100, "bar"), 
    onNext(150, "baz"), 
    onNext(200, "qux"));
  
  var results = scheduler.startWithCreate(function () {
    return xs.concatMap(ys);
  });
  
  results.messages.assertEqual(
    onNext(350, "foo"), 
    onNext(400, "bar"), 
    onNext(450, "baz"), 
    onNext(500, "qux")
  );
  
  xs.subscriptions.assertEqual(subscribe(200, 700));
  
  ys.subscriptions.assertEqual(
    subscribe(300, 1000));
});

test('ConcatMap_Then_Complete_Error', function () {
  var ex = new Error('ex');
  
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createColdObservable(
    onNext(100, 4), 
    onNext(200, 2), 
    onNext(300, 3), 
    onNext(400, 1), 
    onCompleted(500));
  
  var ys = scheduler.createColdObservable(
    onNext(50, "foo"), 
    onNext(100, "bar"), 
    onNext(150, "baz"), 
    onNext(200, "qux"), 
    onError(300, ex));
  
  var results = scheduler.startWithCreate(function () {
      return xs.concatMap(ys);
  });

  results.messages.assertEqual(
    onNext(350, "foo"), 
    onNext(400, "bar"), 
    onNext(450, "baz"), 
    onNext(500, "qux"),  
    onError(600, ex));
  
  xs.subscriptions.assertEqual(
    subscribe(200, 600));
  
  ys.subscriptions.assertEqual(
    subscribe(300, 600));
});

test('ConcatMap_Then_Error_Complete', function () {
  var ex = new Error('ex');

  var scheduler = new TestScheduler();
  
  var xs = scheduler.createColdObservable(
    onNext(100, 4), 
    onNext(200, 2), 
    onNext(300, 3), 
    onNext(400, 1), 
    onError(500, ex));
  
  var ys = scheduler.createColdObservable(
    onNext(50, "foo"), 
    onNext(100, "bar"), 
    onNext(150, "baz"), 
    onNext(200, "qux"), 
    onCompleted(250));
  
  var results = scheduler.startWithCreate(function () {
    return xs.concatMap(ys);
  });
  
  results.messages.assertEqual(
    onNext(350, "foo"), 
    onNext(400, "bar"), 
    onNext(450, "baz"),  
    onNext(500, "qux"), 
    onNext(600, "foo"), 
    onNext(650, "bar"), 
    onError(700, ex));
  
  xs.subscriptions.assertEqual(subscribe(200, 700));
  
  ys.subscriptions.assertEqual(
    subscribe(300, 550), 
    subscribe(550, 700));
});

test('ConcatMap_Then_Error_Error', function () {
  var ex = new Error('ex');
  
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createColdObservable(
    onNext(100, 4), 
    onNext(200, 2), 
    onNext(300, 3), 
    onNext(400, 1), 
    onError(500, ex));
  
  var ys = scheduler.createColdObservable(
    onNext(50, "foo"), 
    onNext(100, "bar"), 
    onNext(150, "baz"), 
    onNext(200, "qux"), 
    onError(250, ex));
  
  var results = scheduler.startWithCreate(function () {
    return xs.concatMap(ys);
  });
  
  results.messages.assertEqual(
    onNext(350, "foo"), 
    onNext(400, "bar"), 
    onNext(450, "baz"), 
    onNext(500, "qux"), 
    onError(550, ex));
  
  xs.subscriptions.assertEqual(subscribe(200, 550));
  
  ys.subscriptions.assertEqual(
    subscribe(300, 550));
});

test('ConcatMap_Complete', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(5, scheduler.createColdObservable(onError(1, new Error('ex1')))), 
    onNext(105, scheduler.createColdObservable(onError(1, new Error('ex2')))), 
    onNext(300, scheduler.createColdObservable(
      onNext(10, 102), 
      onNext(90, 103), 
      onNext(110, 104), 
      onNext(190, 105), 
      onNext(440, 106), 
      onCompleted(460))), 
    onNext(400, scheduler.createColdObservable(
      onNext(180, 202), 
      onNext(190, 203), 
      onCompleted(205))), 
    onNext(550, scheduler.createColdObservable(
      onNext(10, 301), 
      onNext(50, 302), 
      onNext(70, 303), 
      onNext(260, 304), 
      onNext(310, 305), 
      onCompleted(410))), 
    onNext(750, scheduler.createColdObservable(onCompleted(40))), 
    onNext(850, scheduler.createColdObservable(
      onNext(80, 401), 
      onNext(90, 402), 
      onCompleted(100))), 
    onCompleted(900));
  
  var results = scheduler.startWithCreate(function () {
    return xs.concatMap(function (x) {
      return x;
    });
  });
  
  results.messages.assertEqual(
    onNext(310, 102), 
    onNext(390, 103), 
    onNext(410, 104), 
    onNext(490, 105),  
    onNext(740, 106), 
    onNext(940, 202), 
    onNext(950, 203), 
    onNext(975, 301));
  
  xs.subscriptions.assertEqual(subscribe(200, 900));
  
  xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
  xs.messages[3].value.value.subscriptions.assertEqual(subscribe(760, 965));
  xs.messages[4].value.value.subscriptions.assertEqual(subscribe(965, 1000));
  xs.messages[5].value.value.subscriptions.assertEqual();
  xs.messages[6].value.value.subscriptions.assertEqual();
});

test('ConcatMap_Complete_InnerNotComplete', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(5, scheduler.createColdObservable(onError(1, new Error('ex1')))), 
    onNext(105, scheduler.createColdObservable(onError(1, new Error('ex2')))), 
    onNext(300, scheduler.createColdObservable(
      onNext(10, 102), 
      onNext(90, 103), 
      onNext(110, 104), 
      onNext(190, 105), 
      onNext(440, 106), 
      onCompleted(460))), 
    onNext(400, scheduler.createColdObservable(
      onNext(180, 202), 
      onNext(190, 203))), 
    onNext(550, scheduler.createColdObservable(
      onNext(10, 301), 
      onNext(50, 302), 
      onNext(70, 303), 
      onNext(260, 304), 
      onNext(310, 305), 
      onCompleted(410))), 
    onNext(750, scheduler.createColdObservable(onCompleted(40))), 
    onNext(850, scheduler.createColdObservable(
      onNext(80, 401), 
      onNext(90, 402), 
      onCompleted(100))), 
    onCompleted(900));
  
  var results = scheduler.startWithCreate(function () {
    return xs.concatMap(function (x) {
      return x;
    });
  });

  results.messages.assertEqual(
    onNext(310, 102), 
    onNext(390, 103), 
    onNext(410, 104), 
    onNext(490, 105), 
    onNext(740, 106), 
    onNext(940, 202), 
    onNext(950, 203));
  
  xs.subscriptions.assertEqual(subscribe(200, 900));
  
  xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
  xs.messages[3].value.value.subscriptions.assertEqual(subscribe(760, 1000));
  xs.messages[4].value.value.subscriptions.assertEqual();
  xs.messages[5].value.value.subscriptions.assertEqual();
  xs.messages[6].value.value.subscriptions.assertEqual();
});

test('ConcatMap_Complete_OuterNotComplete', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(5, scheduler.createColdObservable(onError(1, new Error('ex1')))), 
    onNext(105, scheduler.createColdObservable(onError(1, new Error('ex2')))), 
    onNext(300, scheduler.createColdObservable(
      onNext(10, 102), 
      onNext(90, 103), 
      onNext(110, 104), 
      onNext(190, 105), 
      onNext(440, 106), 
      onCompleted(460))), 
    onNext(400, scheduler.createColdObservable(
      onNext(180, 202), 
      onNext(190, 203), 
      onCompleted(205))), 
    onNext(550, scheduler.createColdObservable(
      onNext(10, 301), 
      onNext(50, 302), 
      onNext(70, 303), 
      onNext(260, 304), 
      onNext(310, 305), 
      onCompleted(410))), 
    onNext(750, scheduler.createColdObservable(onCompleted(40))), 
    onNext(850, scheduler.createColdObservable(
      onNext(80, 401), 
      onNext(90, 402), 
      onCompleted(100))));
  
  var results = scheduler.startWithCreate(function () {
    return xs.concatMap(function (x) {
      return x;
    });
  });
  
  results.messages.assertEqual(
    onNext(310, 102), 
    onNext(390, 103), 
    onNext(410, 104), 
    onNext(490, 105),   
    onNext(740, 106), 
    onNext(940, 202), 
    onNext(950, 203), 
    onNext(975, 301));
  
  xs.subscriptions.assertEqual(subscribe(200, 1000));
  xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
  xs.messages[3].value.value.subscriptions.assertEqual(subscribe(760, 965));
  xs.messages[4].value.value.subscriptions.assertEqual(subscribe(965, 1000));
  xs.messages[5].value.value.subscriptions.assertEqual();
  xs.messages[6].value.value.subscriptions.assertEqual();
});

test('ConcatMap_Error_Outer', function () {
  var ex = new Error('ex');

  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(5, scheduler.createColdObservable(onError(1, new Error('ex1')))), 
    onNext(105, scheduler.createColdObservable(onError(1, new Error('ex2')))), 
    onNext(300, scheduler.createColdObservable(
      onNext(10, 102), 
      onNext(90, 103), 
      onNext(110, 104), 
      onNext(190, 105), 
      onNext(440, 106), 
      onCompleted(460))), 
    onNext(400, scheduler.createColdObservable(
      onNext(180, 202), 
      onNext(190, 203), 
      onCompleted(205))), 
    onNext(550, scheduler.createColdObservable(
      onNext(10, 301), 
      onNext(50, 302), 
      onNext(70, 303), 
      onNext(260, 304), 
      onNext(310, 305), 
      onCompleted(410))), 
    onNext(750, scheduler.createColdObservable(onCompleted(40))), 
    onNext(850, scheduler.createColdObservable(
      onNext(80, 401), 
      onNext(90, 402), 
      onCompleted(100))), 
    onError(900, ex));
  
  var results = scheduler.startWithCreate(function () {
    return xs.concatMap(function (x) {
      return x;
    });
  });
  
  results.messages.assertEqual(
    onNext(310, 102), 
    onNext(390, 103), 
    onNext(410, 104), 
    onNext(490, 105), 
    onNext(740, 106), 
    onError(900, ex));

  xs.subscriptions.assertEqual(subscribe(200, 900));
  
  xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
  xs.messages[3].value.value.subscriptions.assertEqual(subscribe(760, 900));
  xs.messages[4].value.value.subscriptions.assertEqual();
  xs.messages[5].value.value.subscriptions.assertEqual();
  xs.messages[6].value.value.subscriptions.assertEqual();
});

test('ConcatMap_Error_Inner', function () {
  var ex = new Error('ex');
  
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(5, scheduler.createColdObservable(onError(1, new Error('ex1')))), 
    onNext(105, scheduler.createColdObservable(onError(1, new Error('ex2')))), 
    onNext(300, scheduler.createColdObservable(
      onNext(10, 102), 
      onNext(90, 103), 
      onNext(110, 104), 
      onNext(190, 105), 
      onNext(440, 106), 
      onError(460, ex))), 
    onNext(400, scheduler.createColdObservable(
      onNext(180, 202), 
      onNext(190, 203), 
      onCompleted(205))), 
    onNext(550, scheduler.createColdObservable(
      onNext(10, 301), 
      onNext(50, 302), 
      onNext(70, 303), 
      onNext(260, 304), 
      onNext(310, 305), 
      onCompleted(410))), 
    onNext(750, scheduler.createColdObservable(onCompleted(40))), 
    onNext(850, scheduler.createColdObservable(
      onNext(80, 401), 
      onNext(90, 402), 
      onCompleted(100))), 
    onCompleted(900));
  
  var results = scheduler.startWithCreate(function () {
    return xs.concatMap(function (x) {
      return x;
    });
  });
  
  results.messages.assertEqual(
    onNext(310, 102), 
    onNext(390, 103), 
    onNext(410, 104), 
    onNext(490, 105), 

    onNext(740, 106), 
    onError(760, ex));
  
  xs.subscriptions.assertEqual(subscribe(200, 760));
  
  xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 760));
  xs.messages[3].value.value.subscriptions.assertEqual();
  xs.messages[4].value.value.subscriptions.assertEqual();
  xs.messages[5].value.value.subscriptions.assertEqual();
  xs.messages[6].value.value.subscriptions.assertEqual();
});

test('ConcatMap_Dispose', function () {
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(5, scheduler.createColdObservable(onError(1, new Error('ex1')))), 
    onNext(105, scheduler.createColdObservable(onError(1, new Error('ex2')))), 
    onNext(300, scheduler.createColdObservable(
      onNext(10, 102), 
      onNext(90, 103), 
      onNext(110, 104), 
      onNext(190, 105), 
      onNext(440, 106), 
      onCompleted(460))), 
    onNext(400, scheduler.createColdObservable(
      onNext(180, 202), 
      onNext(190, 203), 
      onCompleted(205))), 
    onNext(550, scheduler.createColdObservable(
      onNext(10, 301), 
      onNext(50, 302), 
      onNext(70, 303), 
      onNext(260, 304), 
      onNext(310, 305), 
      onCompleted(410))), 
    onNext(750, scheduler.createColdObservable(onCompleted(40))), 
    onNext(850, scheduler.createColdObservable(
      onNext(80, 401), 
      onNext(90, 402), 
      onCompleted(100))), 
    onCompleted(900));
  
  var results = scheduler.startWithDispose(function () {
    return xs.concatMap(function (x) {
      return x;
    });
  }, 700);

  results.messages.assertEqual(
    onNext(310, 102), 
    onNext(390, 103), 
    onNext(410, 104), 
    onNext(490, 105));

  xs.subscriptions.assertEqual(subscribe(200, 700));
  
  xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 700));
  xs.messages[3].value.value.subscriptions.assertEqual();
  xs.messages[4].value.value.subscriptions.assertEqual();
  xs.messages[5].value.value.subscriptions.assertEqual();
  xs.messages[6].value.value.subscriptions.assertEqual();
});

test('ConcatMap_Throw', function () {
  var invoked = 0;
  var ex = new Error('ex');
  
  var scheduler = new TestScheduler();
  
  var xs = scheduler.createHotObservable(
    onNext(5, scheduler.createColdObservable(onError(1, new Error('ex1')))), 
    onNext(105, scheduler.createColdObservable(onError(1, new Error('ex2')))), 
    onNext(300, scheduler.createColdObservable(
      onNext(10, 102), 
      onNext(90, 103), 
      onNext(110, 104), 
      onNext(190, 105), 
      onNext(440, 106), 
      onCompleted(460))), 
    onNext(400, scheduler.createColdObservable(
      onNext(180, 202), 
      onNext(190, 203), 
      onCompleted(205))), 
    onNext(550, scheduler.createColdObservable(
      onNext(10, 301), 
      onNext(50, 302), 
      onNext(70, 303), 
      onNext(260, 304), 
      onNext(310, 305), 
      onCompleted(410))), 
    onNext(750, scheduler.createColdObservable(
      onCompleted(40))), 
    onNext(850, scheduler.createColdObservable(
      onNext(80, 401), 
      onNext(90, 402), 
      onCompleted(100))), 
    onCompleted(900));
  
  var results = scheduler.startWithCreate(function () {
      return xs.concatMap(function (x) {
          invoked++;
          if (invoked === 3) {
              throw ex;
          }
          return x;
      });
  });
  results.messages.assertEqual(onNext(310, 102), onNext(390, 103), onNext(410, 104), onNext(490, 105), onError(550, ex));
  xs.subscriptions.assertEqual(subscribe(200, 550));
  xs.messages[2].value.value.subscriptions.assertEqual(subscribe(300, 550));
  xs.messages[3].value.value.subscriptions.assertEqual();
  xs.messages[4].value.value.subscriptions.assertEqual();
  xs.messages[5].value.value.subscriptions.assertEqual();
  xs.messages[6].value.value.subscriptions.assertEqual();
});

test('ConcatMap_UseFunction', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(210, 4), 
      onNext(220, 3), 
      onNext(250, 5), 
      onNext(270, 1), 
      onCompleted(290));
    
    var results = scheduler.startWithCreate(function () {
      return xs.concatMap(function (x) {
        return Observable.interval(10, scheduler).select(function () {
          return x;
        }).take(x);
      });
    });
    
    results.messages.assertEqual(
      onNext(220, 4), 
      onNext(230, 4), 
      onNext(240, 4), 
      onNext(250, 4), 
      onNext(260, 3), 
      onNext(270, 3), 
      onNext(280, 3), 
      onNext(290, 5), 
      onNext(300, 5), 
      onNext(310, 5), 
      onNext(320, 5), 
      onNext(330, 5), 
      onNext(340, 1), 
      onCompleted(340));

    xs.subscriptions.assertEqual(subscribe(200, 290));
});