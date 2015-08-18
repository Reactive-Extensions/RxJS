(function () {
  QUnit.module('zip');

  function add (x, y) { return x + y; }

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('zip n-ary symmetric', function () {
    var scheduler = new TestScheduler();

    var e0 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 1),
      onNext(250, 4),
      onCompleted(420));

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 2),
      onNext(240, 5),
      onCompleted(410));

    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(230, 3),
      onNext(260, 6),
      onCompleted(400));

    var res = scheduler.startWithCreate(function () {
      return Observable.zip(e0, e1, e2)
    });

    res.messages.assertEqual(
      onNext(230, [1, 2, 3]),
      onNext(260, [4, 5, 6]),
      onCompleted(420)
    );

    e0.subscriptions.assertEqual(
      subscribe(200, 420)
    );

    e1.subscriptions.assertEqual(
      subscribe(200, 420)
    );

    e2.subscriptions.assertEqual(
      subscribe(200, 420)
    );
  });

  test('zip never never', function () {
    var scheduler = new TestScheduler();

    var o1 = Observable.never();
    var o2 = Observable.never();

    var results = scheduler.startWithCreate(function () {
      return o1.zip(o2, add);
    });

    results.messages.assertEqual();
  });

  test('zip never empty', function () {
    var scheduler = new TestScheduler();

    var o1 = Observable.never();
    var o2 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );

    var results = scheduler.startWithCreate(function () {
      return o1.zip(o2, add);
    });

    results.messages.assertEqual();
  });

  test('zip empty empty', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );

    var results = scheduler.startWithCreate(function () {
      return e1.zip(e2, add);
    });

    results.messages.assertEqual(
      onCompleted(210)
    );
  });

  test('zip empty non-empty', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(220)
    );

    var results = scheduler.startWithCreate(function () {
      return e1.zip(e2, add);
    });

    results.messages.assertEqual(
      onCompleted(215)
    );
  });

  test('zip non-empty empty', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(220)
    );

    var results = scheduler.startWithCreate(function () {
      return e2.zip(e1, add);
    });

    results.messages.assertEqual(
      onCompleted(215)
    );
  });

  test('zip never non-empty', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(220)
    );
    var e2 = Observable.never();

    var results = scheduler.startWithCreate(function () {
      return e2.zip(e1, add);
    });

    results.messages.assertEqual();
  });

  test('zip non-empty never', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(220)
    );
    var e2 = Observable.never();

    var results = scheduler.startWithCreate(function () {
      return e1.zip(e2, add);
    });

    results.messages.assertEqual();
  });

  test('zip non-empty non-empty', function () {
    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(230)
    );
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 3),
      onCompleted(240)
    );

    var results = scheduler.startWithCreate(function () {
      return e1.zip(e2, add);
    });

    results.messages.assertEqual(
      onNext(220, 2 + 3),
      onCompleted(240)
    );
  });

  test('zip empty error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1), onCompleted(230)
    );
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error)
    );

    var results = scheduler.startWithCreate(function () {
      return e1.zip(e2, add);
    });

    results.messages.assertEqual(
      onError(220, error)
    );
  });

  test('zip error empty', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(230)
    );
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error)
    );

    var results = scheduler.startWithCreate(function () {
      return e2.zip(e1, add);
    });

    results.messages.assertEqual(
      onError(220, error)
    );
  });

  test('zip never error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = Observable.never();
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error)
    );

    var results = scheduler.startWithCreate(function () {
      return e1.zip(e2, add);
    });

    results.messages.assertEqual(onError(220, error));
  });

  test('zip error never', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = Observable.never();
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error)
    );

    var results = scheduler.startWithCreate(function () {
        return e2.zip(e1, add);
    });

    results.messages.assertEqual(
      onError(220, error)
    );
  });

  test('zip error error', function () {
    var error1 = new Error();
    var error2 = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(230, error1)
    );
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error2)
    );

    var results = scheduler.startWithCreate(function () {
      return e2.zip(e1, add);
    });

    results.messages.assertEqual(
      onError(220, error2)
    );
  });

  test('zip some error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(230)
    );
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error)
    );

    var results = scheduler.startWithCreate(function () {
      return e1.zip(e2, add);
    });

    results.messages.assertEqual(
      onError(220, error)
    );
  });

  test('zip error some', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(230)
    );
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error)
    );

    var results = scheduler.startWithCreate(function () {
      return e2.zip(e1, add);
    });

    results.messages.assertEqual(
      onError(220, error)
    );
  });

  test('zip some data asymmetric 1', function () {
    var scheduler = new TestScheduler();

    var msgs1 = (function () {
      var results = [];
      for (i = 0; i < 5; i++) {
        results.push(onNext(205 + i * 5, i));
      }
      return results;
    })();

    var msgs2 = (function () {
      var results = [];
      for (i = 0; i < 10; i++) {
        results.push(onNext(205 + i * 8, i));
      }
      return results;
    })();

    var len = Math.min(msgs1.length, msgs2.length);

    var e1 = scheduler.createHotObservable(msgs1);
    var e2 = scheduler.createHotObservable(msgs2);

    var results = scheduler.startWithCreate(function () {
      return e1.zip(e2, add);
    }).messages;

    equal(len, results.length);

    for (i = 0; i < len; i++) {
      sum = msgs1[i].value.value + msgs2[i].value.value;
      time = Math.max(msgs1[i].time, msgs2[i].time);
      ok(results[i].value.kind === 'N' && results[i].time === time && results[i].value.value === sum);
    }
  });

  test('zip some data asymmetric 2', function () {
    var scheduler = new TestScheduler();

    var msgs1 = (function () {
      var results = [];
      for (i = 0; i < 10; i++) {
        results.push(onNext(205 + i * 5, i));
      }
      return results;
    })();

    var msgs2 = (function () {
      var results = [];
      for (i = 0; i < 5; i++) {
        results.push(onNext(205 + i * 8, i));
      }
      return results;
    })();

    var len = Math.min(msgs1.length, msgs2.length);

    var e1 = scheduler.createHotObservable(msgs1);
    var e2 = scheduler.createHotObservable(msgs2);

    var results = scheduler.startWithCreate(function () {
      return e1.zip(e2, add);
    }).messages;

    equal(len, results.length);

    for (i = 0; i < len; i++) {
      sum = msgs1[i].value.value + msgs2[i].value.value;
      time = Math.max(msgs1[i].time, msgs2[i].time);
      ok(results[i].value.kind === 'N' && results[i].time === time && results[i].value.value === sum);
    }
  });

  test('zip some data symmetric', function () {
    var scheduler = new TestScheduler();

    var msgs1 = (function () {
      var results = [];
      for (i = 0; i < 10; i++) {
        results.push(onNext(205 + i * 5, i));
      }
      return results;
    })();
    var msgs2 = (function () {
      var results = [];
      for (i = 0; i < 10; i++) {
        results.push(onNext(205 + i * 8, i));
      }
      return results;
    })();

    var len = Math.min(msgs1.length, msgs2.length);

    var e1 = scheduler.createHotObservable(msgs1);
    var e2 = scheduler.createHotObservable(msgs2);

    var results = scheduler.startWithCreate(function () {
      return e1.zip(e2, add);
    }).messages;

    equal(len, results.length);

    for (i = 0; i < len; i++) {
      sum = msgs1[i].value.value + msgs2[i].value.value;
      time = Math.max(msgs1[i].time, msgs2[i].time);
      ok(results[i].value.kind === 'N' && results[i].time === time && results[i].value.value === sum);
    }
  });

  test('zip selector throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var e1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onNext(225, 4),
      onCompleted(240)
    );
    var e2 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(220, 3),
      onNext(230, 5),
      onCompleted(250)
    );

    var results = scheduler.startWithCreate(function () {
      return e1.zip(e2, function (x, y) {
        if (y === 5) {
          throw error;
        } else {
          return x + y;
        }
      });
    });

    results.messages.assertEqual(
      onNext(220, 2 + 3),
      onError(230, error)
    );
  });

  test('zip right completes first', function () {
    var scheduler = new TestScheduler();

    var o = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 4),
      onCompleted(225)
    );

    var e = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onCompleted(220)
    );

    var res = scheduler.startWithCreate(function () {
      return o.zip(e, add)
    });

    res.messages.assertEqual(
      onNext(215, 6),
      onCompleted(225)
    );

    o.subscriptions.assertEqual(
      subscribe(200, 225)
    );

    e.subscriptions.assertEqual(
      subscribe(200, 225)
    );
  });

  test('zip with iterable never empty', function () {
    var scheduler = new TestScheduler();

    var n1 = scheduler.createHotObservable(
      onNext(150, 1)
    );
    var n2 = [];

    var results = scheduler.startWithCreate(function () {
      return n1.zip(n2, add);
    });

    results.messages.assertEqual();

    n1.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('zip with iterable empty empty', function () {
    var scheduler = new TestScheduler();

    var n1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );
    var n2 = [];

    var results = scheduler.startWithCreate(function () {
      return n1.zipIterable(n2, add);
    });

    results.messages.assertEqual(
      onCompleted(210)
    );

    n1.subscriptions.assertEqual(
      subscribe(200, 210)
    );
  });
  test('zip with iterable empty non-empty', function () {
    var scheduler = new TestScheduler();

    var n1 = scheduler.createHotObservable(
      onNext(150, 1),
      onCompleted(210)
    );
    var n2 = [2];

    var results = scheduler.startWithCreate(function () {
      return n1.zipIterable(n2, add);
    });

    results.messages.assertEqual(
      onCompleted(210)
    );

    n1.subscriptions.assertEqual(
      subscribe(200, 210)
    );
  });
  test('zip with iterable non-empty empty', function () {
    var scheduler = new TestScheduler();

    var n1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(220)
    );
    var n2 = [];

    var results = scheduler.startWithCreate(function () {
      return n1.zipIterable(n2, add);
    });

    results.messages.assertEqual(
      onCompleted(215)
    );

    n1.subscriptions.assertEqual(
      subscribe(200, 215)
    );
  });
  test('zip with iterable never non-empty', function () {
    var scheduler = new TestScheduler();

    var n1 = scheduler.createHotObservable(
      onNext(150, 1)
    );
    var n2 = [2];

    var results = scheduler.startWithCreate(function () {
      return n1.zipIterable(n2, add);
    });

    results.messages.assertEqual();

    n1.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });
  test('zip with iterable non-empty non-empty', function () {
    var scheduler = new TestScheduler();

    var n1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onCompleted(230)
    );
    var n2 = [3];

    var results = scheduler.startWithCreate(function () {
      return n1.zipIterable(n2, add);
    });

    results.messages.assertEqual(
      onNext(215, 2 + 3),
      onCompleted(230)
    );

    n1.subscriptions.assertEqual(
      subscribe(200, 230)
    );
  });

  test('zip with iterable error empty', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var n1 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error)
    );
    var n2 = [];

    var results = scheduler.startWithCreate(function () {
      return n1.zipIterable(n2, add);
    });

    results.messages.assertEqual(
      onError(220, error)
    );

    n1.subscriptions.assertEqual(
      subscribe(200, 220)
    );
  });

  test('zip with iterable error some', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var n1 = scheduler.createHotObservable(
      onNext(150, 1),
      onError(220, error)
    );
    var n2 = [2];

    var results = scheduler.startWithCreate(function () {
      return n1.zipIterable(n2, add);
    });

    results.messages.assertEqual(
      onError(220, error)
    );

    n1.subscriptions.assertEqual(
      subscribe(200, 220)
    );
  });

  test('zip with iterable some data both sides', function () {
    var scheduler = new TestScheduler();

    var n1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(210, 2),
      onNext(220, 3),
      onNext(230, 4),
      onNext(240, 5)
    );
    var n2 = [5, 4, 3, 2];

    var results = scheduler.startWithCreate(function () {
      return n1.zipIterable(n2, add);
    });

    results.messages.assertEqual(
      onNext(210, 7),
      onNext(220, 7),
      onNext(230, 7),
      onNext(240, 7)
    );

    n1.subscriptions.assertEqual(
      subscribe(200, 1000)
    );
  });

  test('zip with iterable selector throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var n1 = scheduler.createHotObservable(
      onNext(150, 1),
      onNext(215, 2),
      onNext(225, 4),
      onCompleted(240)
    );
    var n2 = [3, 5];

    var results = scheduler.startWithCreate(function () {
      return n1.zipIterable(n2, function (x, y) {
        if (y === 5) { throw error; }
        return x + y;
      });
    });

    results.messages.assertEqual(
      onNext(215, 2 + 3),
      onError(225, error)
    );

    n1.subscriptions.assertEqual(
      subscribe(200, 225)
    );
  });

}());
