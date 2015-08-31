(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal */

  QUnit.module('GroupByUntil');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe,
      created = Rx.ReactiveTest.created,
      subscribed = Rx.ReactiveTest.subscribed,
      disposed = Rx.ReactiveTest.disposed;

  function noop () { }

  String.prototype.reverse = function () {
    return this.split('').reverse().join('');
  };

  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
  }

  test('GroupByUntil WithKeyComparer', function () {
    var scheduler = new TestScheduler();

    var keyInvoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(90, new Error()),
      onNext(110, new Error()),
      onNext(130, new Error()),
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(270, 'baR  '),
      onNext(310, 'foO '),
      onNext(350, ' Baz   '),
      onNext(360, '  qux '),
      onNext(390, '   bar'),
      onNext(420, ' BAR  '),
      onNext(470, 'FOO '),
      onNext(480, 'baz  '),
      onNext(510, ' bAZ '),
      onNext(530, '    fOo    '),
      onCompleted(570),
      onNext(580, new Error()),
      onCompleted(600),
      onError(650, new Error()));

    var results = scheduler.startScheduler(function () {
      return xs.groupByUntil(function (x) {
        keyInvoked++;
        return x.toLowerCase().trim();
      }, function (x) {
        return x;
      }, function (g) {
        return g.skip(2);
      }).map(function (x) {
        return x.key;
      });
    });

    results.messages.assertEqual(
      onNext(220, 'foo'),
      onNext(270, 'bar'),
      onNext(350, 'baz'),
      onNext(360, 'qux'),
      onNext(470, 'foo'),
      onCompleted(570));

    xs.subscriptions.assertEqual(subscribe(200, 570));

    equal(12, keyInvoked);
  });

  test('GroupByUntil Outer Complete', function () {
    var scheduler = new TestScheduler();

    var keyInvoked = 0;
    var eleInvoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(90, new Error()),
      onNext(110, new Error()),
      onNext(130, new Error()),
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(270, 'baR  '),
      onNext(310, 'foO '),
      onNext(350, ' Baz   '),
      onNext(360, '  qux '),
      onNext(390, '   bar'),
      onNext(420, ' BAR  '),
      onNext(470, 'FOO '),
      onNext(480, 'baz  '),
      onNext(510, ' bAZ '),
      onNext(530, '    fOo    '),
      onCompleted(570),
      onNext(580, new Error()),
      onCompleted(600),
      onError(650, new Error()));

    var results = scheduler.startScheduler(function () {
      return xs.groupByUntil(function (x) {
        keyInvoked++;
        return x.toLowerCase().trim();
      }, function (x) {
        eleInvoked++;
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      }).map(function (x) {
        return x.key;
      });
    });

    results.messages.assertEqual(
      onNext(220, 'foo'),
      onNext(270, 'bar'),
      onNext(350, 'baz'),
      onNext(360, 'qux'),
      onNext(470, 'foo'),
      onCompleted(570));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));

    equal(12, keyInvoked);
    equal(12, eleInvoked);
  });

  test('GroupByUntil Outer Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var keyInvoked = 0;
    var eleInvoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(90, new Error()),
      onNext(110, new Error()),
      onNext(130, new Error()),
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(270, 'baR  '),
      onNext(310, 'foO '),
      onNext(350, ' Baz   '),
      onNext(360, '  qux '),
      onNext(390, '   bar'),
      onNext(420, ' BAR  '),
      onNext(470, 'FOO '),
      onNext(480, 'baz  '),
      onNext(510, ' bAZ '),
      onNext(530, '    fOo    '),
      onError(570, error),
      onNext(580, new Error()),
      onCompleted(600),
      onError(650, new Error()));

    var results = scheduler.startScheduler(function () {
      return xs.groupByUntil(function (x) {
        keyInvoked++;
        return x.toLowerCase().trim();
      }, function (x) {
        eleInvoked++;
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      }).map(function (x) {
        return x.key;
      });
    });

    results.messages.assertEqual(
      onNext(220, 'foo'),
      onNext(270, 'bar'),
      onNext(350, 'baz'),
      onNext(360, 'qux'),
      onNext(470, 'foo'),
      onError(570, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));

    equal(12, keyInvoked);
    equal(12, eleInvoked);
  });

  test('GroupByUntil Outer Dispose', function () {
    var scheduler = new TestScheduler();

    var keyInvoked = 0;
    var eleInvoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(90, new Error()),
      onNext(110, new Error()),
      onNext(130, new Error()),
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(270, 'baR  '),
      onNext(310, 'foO '),
      onNext(350, ' Baz   '),
      onNext(360, '  qux '),
      onNext(390, '   bar'),
      onNext(420, ' BAR  '),
      onNext(470, 'FOO '),
      onNext(480, 'baz  '),
      onNext(510, ' bAZ '),
      onNext(530, '    fOo    '),
      onCompleted(570),
      onNext(580, new Error()),
      onCompleted(600),
      onError(650, new Error()));

    var results = scheduler.startScheduler(function () {
      return xs.groupByUntil(function (x) {
        keyInvoked++;
        return x.toLowerCase().trim();
      }, function (x) {
        eleInvoked++;
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      }).map(function (x) {
        return x.key;
      });
    }, { disposed: 355 });

    results.messages.assertEqual(
      onNext(220, 'foo'),
      onNext(270, 'bar'),
      onNext(350, 'baz'));

    xs.subscriptions.assertEqual(
      subscribe(200, 355));

    equal(5, keyInvoked);
    equal(5, eleInvoked);
  });

  test('GroupByUntil Outer KeyThrow', function () {
    var scheduler = new TestScheduler();

    var error = new Error();

    var keyInvoked = 0;
    var eleInvoked = 0;

    var xs = scheduler.createHotObservable(onNext(90, new Error()), onNext(110, new Error()), onNext(130, new Error()), onNext(220, '  foo'), onNext(240, ' FoO '), onNext(270, 'baR  '), onNext(310, 'foO '), onNext(350, ' Baz   '), onNext(360, '  qux '), onNext(390, '   bar'), onNext(420, ' BAR  '), onNext(470, 'FOO '), onNext(480, 'baz  '), onNext(510, ' bAZ '), onNext(530, '    fOo    '), onCompleted(570), onNext(580, new Error()), onCompleted(600), onError(650, new Error()));

    var results = scheduler.startScheduler(function () {
      return xs.groupByUntil(function (x) {
        keyInvoked++;
        if (keyInvoked === 10) { throw error; }
        return x.toLowerCase().trim();
      }, function (x) {
        eleInvoked++;
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      }).map(function (x) {
        return x.key;
      });
    });

    results.messages.assertEqual(
      onNext(220, 'foo'),
      onNext(270, 'bar'),
      onNext(350, 'baz'),
      onNext(360, 'qux'),
      onNext(470, 'foo'),
      onError(480, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 480));

    equal(10, keyInvoked);
    equal(9, eleInvoked);
  });

  test('GroupByUntil Outer EleThrow', function () {
    var scheduler = new TestScheduler();

    var error = new Error();

    var keyInvoked = 0;
    var eleInvoked = 0;

    var xs = scheduler.createHotObservable(
      onNext(90, new Error()),
      onNext(110, new Error()),
      onNext(130, new Error()),
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(270, 'baR  '),
      onNext(310, 'foO '),
      onNext(350, ' Baz   '),
      onNext(360, '  qux '),
      onNext(390, '   bar'),
      onNext(420, ' BAR  '),
      onNext(470, 'FOO '),
      onNext(480, 'baz  '),
      onNext(510, ' bAZ '),
      onNext(530, '    fOo    '),
      onCompleted(570),
      onNext(580, new Error()),
      onCompleted(600),
      onError(650, new Error()));

    var results = scheduler.startScheduler(function () {
      return xs.groupByUntil(function (x) {
        keyInvoked++;
        return x.toLowerCase().trim();
      }, function (x) {
        eleInvoked++;
        if (eleInvoked === 10) { throw error; }
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      }).map(function (x) {
        return x.key;
      });
    });

    results.messages.assertEqual(
      onNext(220, 'foo'),
      onNext(270, 'bar'),
      onNext(350, 'baz'),
      onNext(360, 'qux'),
      onNext(470, 'foo'),
      onError(480, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 480));

    equal(10, keyInvoked);
    equal(10, eleInvoked);
  });

  test('GroupByUntil Inner Complete', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, new Error()),
      onNext(110, new Error()),
      onNext(130, new Error()),
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(270, 'baR  '),
      onNext(310, 'foO '),
      onNext(350, ' Baz   '),
      onNext(360, '  qux '),
      onNext(390, '   bar'),
      onNext(420, ' BAR  '),
      onNext(470, 'FOO '),
      onNext(480, 'baz  '),
      onNext(510, ' bAZ '),
      onNext(530, '    fOo    '),
      onCompleted(570),
      onNext(580, new Error()),
      onCompleted(600),
      onError(650, new Error()));

    var inners = {};
    var innerSubscriptions = {};
    var results = {};
    var outer;
    var outerSubscription;

    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupByUntil(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      });
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      outerSubscription = outer.subscribe(function (group) {
        var result = scheduler.createObserver();

        inners[group.key] = group;
        results[group.key] = result;

        scheduler.scheduleRelative(null, 100, function () {
          innerSubscriptions[group.key] = group.subscribe(result);
        });
      });
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      outerSubscription.dispose();
      for (var key in innerSubscriptions) {
        innerSubscriptions[key].dispose();
      }
    });

    scheduler.start();

    equal(4, Object.keys(inners).length);

    results['bar'].messages.assertEqual(
      onNext(390, 'rab   '),
      onCompleted(420));

    results['baz'].messages.assertEqual(
      onNext(480, '  zab'),
      onCompleted(510));

    results['qux'].messages.assertEqual(
      onCompleted(570));

    results['foo'].messages.assertEqual(
      onCompleted(570));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));
  });

  test('GroupByUntil Inner Complete All', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, new Error()),
      onNext(110, new Error()),
      onNext(130, new Error()),
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(270, 'baR  '),
      onNext(310, 'foO '),
      onNext(350, ' Baz   '),
      onNext(360, '  qux '),
      onNext(390, '   bar'),
      onNext(420, ' BAR  '),
      onNext(470, 'FOO '),
      onNext(480, 'baz  '),
      onNext(510, ' bAZ '),
      onNext(530, '    fOo    '),
      onCompleted(570),
      onNext(580, new Error()),
      onCompleted(600),
      onError(650, new Error()));

    var outer = null;
    var outerSubscription = null;
    var inners = {};
    var innerSubscriptions = {};
    var results = {};

    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupByUntil(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      });
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      outerSubscription = outer.subscribe(function (group) {
        var result = scheduler.createObserver();

        inners[group.key] = group;
        results[group.key] = result;

        innerSubscriptions[group.key] = group.subscribe(result);
      });
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      outerSubscription.dispose();
      for (var key in innerSubscriptions) {
        innerSubscriptions[key].dispose();
      }
    });

    scheduler.start();

    equal(4, Object.keys(inners).length);

    results['bar'].messages.assertEqual(
      onNext(270, '  Rab'),
      onNext(390, 'rab   '),
      onNext(420, '  RAB '),
      onCompleted(420));

    results['baz'].messages.assertEqual(
      onNext(350, '   zaB '),
      onNext(480, '  zab'),
      onNext(510, ' ZAb '),
      onCompleted(510));

    results['qux'].messages.assertEqual(
      onNext(360, ' xuq  '),
      onCompleted(570));

    results['foo'].messages.assertEqual(
      onNext(470, ' OOF'),
      onNext(530, '    oOf    '),
      onCompleted(570));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));
  });

  test('GroupByUntil Inner Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, new Error()),
      onNext(110, new Error()),
      onNext(130, new Error()),
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(270, 'baR  '),
      onNext(310, 'foO '),
      onNext(350, ' Baz   '),
      onNext(360, '  qux '),
      onNext(390, '   bar'),
      onNext(420, ' BAR  '),
      onNext(470, 'FOO '),
      onNext(480, 'baz  '),
      onNext(510, ' bAZ '),
      onNext(530, '    fOo    '),
      onError(570, error),
      onNext(580, new Error()),
      onCompleted(600),
      onError(650, new Error()));

    var outer = null;
    var outerSubscription = null;
    var inners = {};
    var innerSubscriptions = {};
    var results = {};

    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupByUntil(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      });
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      outerSubscription = outer.subscribe(function (group) {
        var result = scheduler.createObserver();

        inners[group.key] = group;
        results[group.key] = result;

        scheduler.scheduleRelative(null, 100, function () {
          innerSubscriptions[group.key] = group.subscribe(result);
        });
      }, noop);
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      outerSubscription.dispose();
      for (var key in innerSubscriptions) {
        innerSubscriptions[key].dispose();
      }
    });

    scheduler.start();

    equal(4, Object.keys(inners).length);

    results['bar'].messages.assertEqual(
      onNext(390, 'rab   '),
      onCompleted(420));

    results['baz'].messages.assertEqual(
      onNext(480, '  zab'),
      onCompleted(510));

    results['qux'].messages.assertEqual(
      onError(570, error));

    results['foo'].messages.assertEqual(
      onError(570, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));
  });

  test('GroupByUntil Inner Dispose', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, new Error()),
      onNext(110, new Error()),
      onNext(130, new Error()),
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(270, 'baR  '),
      onNext(310, 'foO '),
      onNext(350, ' Baz   '),
      onNext(360, '  qux '),
      onNext(390, '   bar'),
      onNext(420, ' BAR  '),
      onNext(470, 'FOO '),
      onNext(480, 'baz  '),
      onNext(510, ' bAZ '),
      onNext(530, '    fOo    '),
      onCompleted(570),
      onNext(580, new Error()),
      onCompleted(600),
      onError(650, new Error()));

    var inners = {};
    var innerSubscriptions = {};
    var results = {};
    var outer;
    var outerSubscription;

    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupByUntil(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      });
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      outerSubscription = outer.subscribe(function (group) {
        var result = scheduler.createObserver();

        inners[group.key] = group;
        results[group.key] = result;

        innerSubscriptions[group.key] = group.subscribe(result);
      });
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      outerSubscription.dispose();
      for (var key in innerSubscriptions) {
        innerSubscriptions[key].dispose();
      }
    });

    scheduler.start();

    equal(4, Object.keys(inners).length);

    results['bar'].messages.assertEqual(
      onNext(270, '  Rab'),
      onNext(390, 'rab   '));

    results['baz'].messages.assertEqual(
      onNext(350, '   zaB '));

    results['qux'].messages.assertEqual(
      onNext(360, ' xuq  '));

    results['foo'].messages.assertEqual(
      onNext(220, 'oof  '),
      onNext(240, ' OoF '),
      onNext(310, ' Oof'),
      onCompleted(310));

    xs.subscriptions.assertEqual(
      subscribe(200, 400));
  });

  test('GroupByUntil Inner KeyThrow', function () {
    var error = new Error();

    var keyInvoked = 0;

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, new Error()),
      onNext(110, new Error()),
      onNext(130, new Error()),
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(270, 'baR  '),
      onNext(310, 'foO '),
      onNext(350, ' Baz   '),
      onNext(360, '  qux '),
      onNext(390, '   bar'),
      onNext(420, ' BAR  '),
      onNext(470, 'FOO '),
      onNext(480, 'baz  '),
      onNext(510, ' bAZ '),
      onNext(530, '    fOo    '),
      onCompleted(570),
      onNext(580, new Error()),
      onCompleted(600),
      onError(650, new Error()));

    var inners = {};
    var innerSubscriptions = {};
    var results = {};
    var outer;
    var outerSubscription;

    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupByUntil(function (x) {
        keyInvoked++;
        if (keyInvoked === 6) { throw error; }
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      });
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      outerSubscription = outer.subscribe(function (group) {
        var result = scheduler.createObserver();

        inners[group.key] = group;
        results[group.key] = result;

        innerSubscriptions[group.key] = group.subscribe(result);
      }, noop);
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      outerSubscription.dispose();
      for (var key in innerSubscriptions) {
        innerSubscriptions[key].dispose();
      }
    });

    scheduler.start();

    equal(3, Object.keys(inners).length);

    results['bar'].messages.assertEqual(
      onNext(270, '  Rab'),
      onError(360, error));
    results['baz'].messages.assertEqual(
      onNext(350, '   zaB '),
      onError(360, error));

    results['foo'].messages.assertEqual(
      onNext(220, 'oof  '),
      onNext(240, ' OoF '),
      onNext(310, ' Oof'),
      onCompleted(310));

    xs.subscriptions.assertEqual(
      subscribe(200, 360));
  });

  test('GroupByUntil Inner EleThrow', function () {
    var error = new Error();

    var eleInvoked = 0;

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, new Error()),
      onNext(110, new Error()),
      onNext(130, new Error()),
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(270, 'baR  '),
      onNext(310, 'foO '),
      onNext(350, ' Baz   '),
      onNext(360, '  qux '),
      onNext(390, '   bar'),
      onNext(420, ' BAR  '),
      onNext(470, 'FOO '),
      onNext(480, 'baz  '),
      onNext(510, ' bAZ '),
      onNext(530, '    fOo    '),
      onCompleted(570),
      onNext(580, new Error()),
      onCompleted(600),
      onError(650, new Error()));

    var inners = {};
    var innerSubscriptions = {};
    var results = {};
    var outer;
    var outerSubscription;

    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupByUntil(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        eleInvoked++;
        if (eleInvoked === 6) { throw error; }
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      });
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      outerSubscription = outer.subscribe(function (group) {
        var result = scheduler.createObserver();

        inners[group.key] = group;
        results[group.key] = result;

        innerSubscriptions[group.key] = group.subscribe(result);
      }, noop);
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      outerSubscription.dispose();
      for (var key in innerSubscriptions) {
        innerSubscriptions[key].dispose();
      }
    });

    scheduler.start();

    equal(4, Object.keys(inners).length);

    results['bar'].messages.assertEqual(
      onNext(270, '  Rab'),
      onError(360, error));

    results['baz'].messages.assertEqual(
      onNext(350, '   zaB '),
      onError(360, error));

    results['qux'].messages.assertEqual(
      onError(360, error));

    results['foo'].messages.assertEqual(
      onNext(220, 'oof  '),
      onNext(240, ' OoF '),
      onNext(310, ' Oof'),
      onCompleted(310));

    xs.subscriptions.assertEqual(
      subscribe(200, 360));
  });

  test('GroupByUntil Outer Independence', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, new Error()),
      onNext(110, new Error()),
      onNext(130, new Error()),
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(270, 'baR  '),
      onNext(310, 'foO '),
      onNext(350, ' Baz   '),
      onNext(360, '  qux '),
      onNext(390, '   bar'),
      onNext(420, ' BAR  '),
      onNext(470, 'FOO '),
      onNext(480, 'baz  '),
      onNext(510, ' bAZ '),
      onNext(530, '    fOo    '),
      onCompleted(570),
      onNext(580, new Error()),
      onCompleted(600),
      onError(650, new Error()));

    var inners = {};
    var innerSubscriptions = {};
    var results = {};
    var outer;
    var outerSubscription;
    var outerResults = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupByUntil(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      });
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      outerSubscription = outer.subscribe(function (group) {
        outerResults.onNext(group.key);

        var result = scheduler.createObserver();

        inners[group.key] = group;
        results[group.key] = result;

        innerSubscriptions[group.key] = group.subscribe(result);
      }, function (e) {
        outerResults.onError(e);
      }, function () {
        outerResults.onCompleted();
      });
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      outerSubscription.dispose();
      for (var key in innerSubscriptions) {
        innerSubscriptions[key].dispose();
      }
    });

    scheduler.scheduleAbsolute(null, 320, function () {
      outerSubscription.dispose();
    });

    scheduler.start();

    equal(2, Object.keys(inners).length);

    outerResults.messages.assertEqual(
      onNext(220, 'foo'),
      onNext(270, 'bar'));

    results['foo'].messages.assertEqual(
      onNext(220, 'oof  '),
      onNext(240, ' OoF '),
      onNext(310, ' Oof'),
      onCompleted(310));

    results['bar'].messages.assertEqual(
      onNext(270, '  Rab'),
      onNext(390, 'rab   '),
      onNext(420, '  RAB '),
      onCompleted(420));

    xs.subscriptions.assertEqual(
      subscribe(200, 420));
  });

  test('GroupByUntil Inner Independence', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, new Error()),
      onNext(110, new Error()),
      onNext(130, new Error()),
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(270, 'baR  '),
      onNext(310, 'foO '),
      onNext(350, ' Baz   '),
      onNext(360, '  qux '),
      onNext(390, '   bar'),
      onNext(420, ' BAR  '),
      onNext(470, 'FOO '),
      onNext(480, 'baz  '),
      onNext(510, ' bAZ '),
      onNext(530, '    fOo    '),
      onCompleted(570),
      onNext(580, new Error()),
      onCompleted(600),
      onError(650, new Error()));

    var inners = {};
    var innerSubscriptions = {};
    var results = {};
    var outer;
    var outerSubscription;
    var outerResults = scheduler.createObserver();

    outerResults = scheduler.createObserver();
    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupByUntil(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      });
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      outerSubscription = outer.subscribe(function (group) {
        outerResults.onNext(group.key);

        var result = scheduler.createObserver();

        inners[group.key] = group;
        results[group.key] = result;

        innerSubscriptions[group.key] = group.subscribe(result);
      }, function (e) {
        outerResults.onError(e);
      }, function () {
        outerResults.onCompleted();
      });
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      outerSubscription.dispose();
      for (var key in innerSubscriptions) {
        innerSubscriptions[key].dispose();
      }
    });

    scheduler.scheduleAbsolute(null, 320, function () {
      innerSubscriptions['foo'].dispose();
    });

    scheduler.start();

    equal(4, Object.keys(inners).length);

    results['bar'].messages.assertEqual(
      onNext(270, '  Rab'),
      onNext(390, 'rab   '),
      onNext(420, '  RAB '),
      onCompleted(420));

    results['baz'].messages.assertEqual(
      onNext(350, '   zaB '),
      onNext(480, '  zab'),
      onNext(510, ' ZAb '),
      onCompleted(510));

    results['qux'].messages.assertEqual(
      onNext(360, ' xuq  '),
      onCompleted(570));

    results['foo'].messages.assertEqual(
      onNext(470, ' OOF'),
      onNext(530, '    oOf    '),
      onCompleted(570));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));
  });

  test('GroupByUntil Inner Multiple Independence', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, new Error()),
      onNext(110, new Error()),
      onNext(130, new Error()),
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(270, 'baR  '),
      onNext(310, 'foO '),
      onNext(350, ' Baz   '),
      onNext(360, '  qux '),
      onNext(390, '   bar'),
      onNext(420, ' BAR  '),
      onNext(470, 'FOO '),
      onNext(480, 'baz  '),
      onNext(510, ' bAZ '),
      onNext(530, '    fOo    '),
      onCompleted(570),
      onNext(580, new Error()),
      onCompleted(600),
      onError(650, new Error()));

    var results = scheduler.createObserver();
    var inners = {};
    var innerSubscriptions = {};
    var outer;
    var outerSubscription;
    var outerResults = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupByUntil(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      });
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      outerSubscription = outer.subscribe(function (group) {
        outerResults.onNext(group.key);

        var result = scheduler.createObserver();

        inners[group.key] = group;
        results[group.key] = result;

        innerSubscriptions[group.key] = group.subscribe(result);
      }, function (e) {
        return outerResults.onError(e);
      }, function () {
        return outerResults.onCompleted();
      });
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      outerSubscription.dispose();
      for (var key in innerSubscriptions) {
        innerSubscriptions[key].dispose();
      }
    });

    scheduler.scheduleAbsolute(null, 320, function () {
      innerSubscriptions['foo'].dispose();
    });

    scheduler.scheduleAbsolute(null, 280, function () {
      innerSubscriptions['bar'].dispose();
    });

    scheduler.scheduleAbsolute(null, 355, function () {
      innerSubscriptions['baz'].dispose();
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      innerSubscriptions['qux'].dispose();
    });

    scheduler.start();

    equal(4, Object.keys(inners).length);

    results['bar'].messages.assertEqual(
      onNext(270, '  Rab'));

    results['baz'].messages.assertEqual(
      onNext(350, '   zaB '));

    results['qux'].messages.assertEqual(
      onNext(360, ' xuq  '));

    results['foo'].messages.assertEqual(
      onNext(470, ' OOF'),
      onNext(530, '    oOf    '),
      onCompleted(570));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));
});

  test('GroupByUntil Inner Escape Complete', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(310, 'foO '),
      onNext(470, 'FOO '),
      onNext(530, '    fOo    '),
      onCompleted(570));

    var results = scheduler.createObserver();
    var inner;
    var innerSubscription;
    var outer;
    var outerSubscription;

    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupByUntil(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      });
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      outerSubscription = outer.subscribe(function (group) {
        return inner = group;
      });
    });

    scheduler.scheduleAbsolute(null, 600, function () {
      innerSubscription = inner.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      outerSubscription.dispose();
      innerSubscription.dispose();
    });

    scheduler.start();
    xs.subscriptions.assertEqual(subscribe(200, 570));
    results.messages.assertEqual(onCompleted(600));
  });

  test('GroupByUntil Inner Escape Error', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(310, 'foO '),
      onNext(470, 'FOO '),
      onNext(530, '    fOo    '),
      onError(570, error));

    var results = scheduler.createObserver();
    var inner;
    var innerSubscription;
    var outer;
    var outerSubscription;

    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupByUntil(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      });
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      outerSubscription = outer.subscribe(function (group) {
        inner = group;
      }, noop);
    });

    scheduler.scheduleAbsolute(null, 600, function () {
      innerSubscription = inner.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      outerSubscription.dispose();
      innerSubscription.dispose();
    });

    scheduler.start();

    xs.subscriptions.assertEqual(
      subscribe(200, 570));

    results.messages.assertEqual(
      onError(600, error));
  });

  test('GroupByUntil Inner Escape Dispose', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(310, 'foO '),
      onNext(470, 'FOO '),
      onNext(530, '    fOo    '),
      onError(570, new Error()));

    var results = scheduler.createObserver();
    var inner;
    var innerSubscription;
    var outer;
    var outerSubscription;

    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupByUntil(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      });
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      outerSubscription = outer.subscribe(function (group) {
        inner = group;
      });
    });

    scheduler.scheduleAbsolute(null, 290, function () {
      outerSubscription.dispose();
    });

    scheduler.scheduleAbsolute(null, 600, function () {
      innerSubscription = inner.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      outerSubscription.dispose();
    });

    scheduler.start();

    xs.subscriptions.assertEqual(
      subscribe(200, 290));

    results.messages.assertEqual();
  });

  test('GroupByUntil Default', function () {
    var keyInvoked = 0;
    var eleInvoked = 0;

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(90, new Error()),
      onNext(110, new Error()),
      onNext(130, new Error()),
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(270, 'baR  '),
      onNext(310, 'foO '),
      onNext(350, ' Baz   '),
      onNext(360, '  qux '),
      onNext(390, '   bar'),
      onNext(420, ' BAR  '),
      onNext(470, 'FOO '),
      onNext(480, 'baz  '),
      onNext(510, ' bAZ '),
      onNext(530, '    fOo    '),
      onCompleted(570),
      onNext(580, new Error()),
      onCompleted(600),
      onError(650, new Error()));

    var results = scheduler.startScheduler(function () {
      return xs.groupByUntil(function (x) {
        keyInvoked++;
        return x.toLowerCase().trim();
      }, function (x) {
        eleInvoked++;
        return x.reverse();
      }, function (g) {
        return g.skip(2);
      }).map(function (x) {
        return x.key;
      });
    });

    results.messages.assertEqual(
      onNext(220, 'foo'),
      onNext(270, 'bar'),
      onNext(350, 'baz'),
      onNext(360, 'qux'),
      onNext(470, 'foo'),
      onCompleted(570));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));

    equal(12, keyInvoked);
    equal(12, eleInvoked);
  });

  test('GroupByUntil DurationSelector Throws', function () {
    var error = new Error();

    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(onNext(210, 'foo'));

    var results = scheduler.startScheduler(function () {
      return xs.groupByUntil(function (x) {
        return x;
      }, function (x) {
        return x;
      }, function () {
        throw error;
      });
    });

    results.messages.assertEqual(
      onError(210, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 210));
  });

}());
