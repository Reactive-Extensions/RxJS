(function () {
  /* jshint undef: true, unused: true */
  /* globals QUnit, test, Rx, equal */
  QUnit.module('GroupBy');

  var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe,
      created = Rx.ReactiveTest.created,
      subscribed = Rx.ReactiveTest.subscribed,
      disposed = Rx.ReactiveTest.disposed;

  if (!String.prototype.trim) {
    String.prototype.trim = function () {
      return this.replace(/^\s+/, '').replace(/\s+$/, '');
    };
  }

  String.prototype.reverse = function () {
    return this.split('').reverse().join('');
  };

  function noop() { }

  test('groupBy with key comparer', function () {
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
      return xs.groupBy(function (x) {
        keyInvoked++;
        return x.toLowerCase().trim();
      }).map(function (g) { return g.key; });
    });

    results.messages.assertEqual(
      onNext(220, 'foo'),
      onNext(270, 'bar'),
      onNext(350, 'baz'),
      onNext(360, 'qux'),
      onCompleted(570));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));

    equal(12, keyInvoked);
  });

  test('groupBy outer complete', function () {
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
      return xs.groupBy(function (x) {
        keyInvoked++;
        return x.toLowerCase().trim();
      }, function (x) {
        eleInvoked++;
        return x.reverse();
      }).map(function (g) {
        return g.key;
      });
    });

    results.messages.assertEqual(
      onNext(220, 'foo'),
      onNext(270, 'bar'),
      onNext(350, 'baz'),
      onNext(360, 'qux'),
      onCompleted(570));

    xs.subscriptions.assertEqual(subscribe(200, 570));

    equal(12, keyInvoked);
    equal(12, eleInvoked);
  });

  test('groupBy outer error', function () {
    var scheduler = new TestScheduler();

    var keyInvoked = 0;
    var eleInvoked = 0;

    var error = new Error();

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
      return xs.groupBy(function (x) {
        keyInvoked++;
        return x.toLowerCase().trim();
      }, function (x) {
        eleInvoked++;
        return x.reverse();
      }).map(function (g) {
        return g.key;
      });
    });

    results.messages.assertEqual(
      onNext(220, 'foo'),
      onNext(270, 'bar'),
      onNext(350, 'baz'),
      onNext(360, 'qux'),
      onError(570, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));

    equal(12, keyInvoked);
    equal(12, eleInvoked);
  });

  test('groupBy outer dispose', function () {
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
      return xs.groupBy(function (x) {
        keyInvoked++;
        return x.toLowerCase().trim();
      }, function (x) {
        eleInvoked++;
        return x.reverse();
      }).map(function (g) {
        return g.key;
      });
    }, {disposed: 355 });

    results.messages.assertEqual(
      onNext(220, 'foo'),
      onNext(270, 'bar'),
      onNext(350, 'baz'));

    xs.subscriptions.assertEqual(
      subscribe(200, 355));

    equal(5, keyInvoked);
    equal(5, eleInvoked);
  });

  test('groupBy outer key throw', function () {
    var scheduler = new TestScheduler();

    var keyInvoked = 0;
    var eleInvoked = 0;

    var error = new Error();

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
      return xs.groupBy(function (x) {
        keyInvoked++;
        if (keyInvoked === 10) { throw error; }
        return x.toLowerCase().trim();
      }, function (x) {
        eleInvoked++;
        return x.reverse();
      }).map(function (g) {
        return g.key;
      });
    });

    results.messages.assertEqual(
      onNext(220, 'foo'),
      onNext(270, 'bar'),
      onNext(350, 'baz'),
      onNext(360, 'qux'),
      onError(480, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 480));

    equal(10, keyInvoked);
    equal(9, eleInvoked);
  });

  test('groupBy outer element throw', function () {
    var scheduler = new TestScheduler();

    var keyInvoked = 0;
    var eleInvoked = 0;

    var error = new Error();

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
      return xs.groupBy(function (x) {
        keyInvoked++;
        return x.toLowerCase().trim();
      }, function (x) {
        eleInvoked++;
        if (eleInvoked === 10) { throw error; }
        return x.reverse();
      }).map(function (g) {
        return g.key;
      });
    });

    results.messages.assertEqual(
      onNext(220, 'foo'),
      onNext(270, 'bar'),
      onNext(350, 'baz'),
      onNext(360, 'qux'),
      onError(480, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 480));

    equal(10, keyInvoked);
    equal(10, eleInvoked);
  });

  test('groupBy inner complete', function () {
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
      outer = xs.groupBy(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
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
      for (var i = 0; i < innerSubscriptions.length; i++) {
        innerSubscriptions[i].dispose();
      }
    });

    scheduler.start();

    equal(4, Object.keys(inners).length);

    results['foo'].messages.assertEqual(
      onNext(470, ' OOF'),
      onNext(530, '    oOf    '),
      onCompleted(570));

    results['bar'].messages.assertEqual(
      onNext(390, 'rab   '),
      onNext(420, '  RAB '),
      onCompleted(570));

    results['baz'].messages.assertEqual(
      onNext(480, '  zab'),
      onNext(510, ' ZAb '),
      onCompleted(570));

    results['qux'].messages.assertEqual(
      onCompleted(570));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));
  });

  test('groupBy inner complete all', function () {
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
      outer = xs.groupBy(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
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
      for (var i = 0; i < innerSubscriptions.length; i++) {
        innerSubscriptions[i].dispose();
      }
    });

    scheduler.start();

    equal(4, Object.keys(inners).length);

    results['foo'].messages.assertEqual(
      onNext(220, 'oof  '),
      onNext(240, ' OoF '),
      onNext(310, ' Oof'),
      onNext(470, ' OOF'),
      onNext(530, '    oOf    '),
      onCompleted(570));

    results['bar'].messages.assertEqual(
      onNext(270, '  Rab'),
      onNext(390, 'rab   '),
      onNext(420, '  RAB '),
      onCompleted(570));

    results['baz'].messages.assertEqual(
      onNext(350, '   zaB '),
      onNext(480, '  zab'),
      onNext(510, ' ZAb '),
      onCompleted(570));

    results['qux'].messages.assertEqual(
      onNext(360, ' xuq  '),
      onCompleted(570));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));
  });

  test('groupBy inner error', function () {
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
      outer = xs.groupBy(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
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
      for (var i = 0, len = innerSubscriptions.length; i < len; i++) {
        innerSubscriptions[i].dispose();
      }
    });

    scheduler.start();

    equal(4, Object.keys(inners).length);

    results['foo'].messages.assertEqual(
      onNext(470, ' OOF'),
      onNext(530, '    oOf    '),
      onError(570, error));

    results['bar'].messages.assertEqual(
      onNext(390, 'rab   '),
      onNext(420, '  RAB '),
      onError(570, error));

    results['baz'].messages.assertEqual(
      onNext(480, '  zab'),
      onNext(510, ' ZAb '),
      onError(570, error));

    results['qux'].messages.assertEqual(
      onError(570, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));
  });

  test('groupBy inner dispose', function () {
      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(onNext(90, new Error()), onNext(110, new Error()), onNext(130, new Error()), onNext(220, '  foo'), onNext(240, ' FoO '), onNext(270, 'baR  '), onNext(310, 'foO '), onNext(350, ' Baz   '), onNext(360, '  qux '), onNext(390, '   bar'), onNext(420, ' BAR  '), onNext(470, 'FOO '), onNext(480, 'baz  '), onNext(510, ' bAZ '), onNext(530, '    fOo    '), onCompleted(570), onNext(580, new Error()), onCompleted(600), onError(650, new Error()));
      var outer = null;
      var outerSubscription = null;
      var inners = {};
      var innerSubscriptions = {};
      var results = {};

      scheduler.scheduleAbsolute(null, created, function () {
        outer = xs.groupBy(function (x) {
          return x.toLowerCase().trim();
        }, function (x) {
          return x.reverse();
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
          if (!Object.prototype.hasOwnProperty.call(innerSubscriptions, key)) { continue; }
          innerSubscriptions[key].dispose();
        }
      });

      scheduler.start();

      equal(4, Object.keys(inners).length);

      results['foo'].messages.assertEqual(
        onNext(220, 'oof  '),
        onNext(240, ' OoF '),
        onNext(310, ' Oof'));

      results['bar'].messages.assertEqual(
        onNext(270, '  Rab'),
        onNext(390, 'rab   '));

      results['baz'].messages.assertEqual(
        onNext(350, '   zaB '));

      results['qux'].messages.assertEqual(
        onNext(360, ' xuq  '));

      xs.subscriptions.assertEqual(
        subscribe(200, 400));
  });

  test('groupBy inner key throw', function () {
    var keyInvoked = 0;

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
      outer = xs.groupBy(function (x) {
        keyInvoked++;
        if (keyInvoked === 6) { throw error; }
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
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
        if (!Object.prototype.hasOwnProperty.call(innerSubscriptions, key)) { continue; }
        innerSubscriptions[key].dispose();
      }
    });

    scheduler.start();

    equal(3, Object.keys(inners).length);

    results['foo'].messages.assertEqual(
      onNext(220, 'oof  '),
      onNext(240, ' OoF '),
      onNext(310, ' Oof'),
      onError(360, error));

    results['bar'].messages.assertEqual(
      onNext(270, '  Rab'),
      onError(360, error));

    results['baz'].messages.assertEqual(
      onNext(350, '   zaB '),
      onError(360, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 360));
  });

  test('groupBy inner element throw', function () {
    var eleInvoked = 0;

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
      outer = xs.groupBy(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        eleInvoked++;
        if (eleInvoked === 6) { throw error; }
        return x.reverse();
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
        if (!Object.prototype.hasOwnProperty.call(innerSubscriptions, key)) { continue; }
        innerSubscriptions[key].dispose();
      }
    });

    scheduler.start();

    equal(4, Object.keys(inners).length);

    results['foo'].messages.assertEqual(
      onNext(220, 'oof  '),
      onNext(240, ' OoF '),
      onNext(310, ' Oof'),
      onError(360, error));

    results['bar'].messages.assertEqual(
      onNext(270, '  Rab'),
      onError(360, error));

    results['baz'].messages.assertEqual(
      onNext(350, '   zaB '),
      onError(360, error));

    results['qux'].messages.assertEqual(
      onError(360, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 360));
  });

  test('groupBy outer independence', function () {
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
    var outerResults = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupBy(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
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
        if (!Object.prototype.hasOwnProperty.call(innerSubscriptions, key)) { continue; }
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
      onNext(470, ' OOF'),
      onNext(530, '    oOf    '),
      onCompleted(570));

    results['bar'].messages.assertEqual(
      onNext(270, '  Rab'),
      onNext(390, 'rab   '),
      onNext(420, '  RAB '),
      onCompleted(570));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));
  });

  test('groupBy inner independence', function () {
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
    var outerResults = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupBy(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
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
        if (!Object.prototype.hasOwnProperty.call(innerSubscriptions, key)) { continue; }
        innerSubscriptions[key].dispose();
      }
    });

    scheduler.scheduleAbsolute(null, 320, function () {
      innerSubscriptions['foo'].dispose();
    });

    scheduler.start();

    equal(4, Object.keys(inners).length);

    results['foo'].messages.assertEqual(
      onNext(220, 'oof  '),
      onNext(240, ' OoF '),
      onNext(310, ' Oof'));

    results['bar'].messages.assertEqual(
      onNext(270, '  Rab'),
      onNext(390, 'rab   '),
      onNext(420, '  RAB '),
      onCompleted(570));

    results['baz'].messages.assertEqual(
      onNext(350, '   zaB '),
      onNext(480, '  zab'),
      onNext(510, ' ZAb '),
      onCompleted(570));

    results['qux'].messages.assertEqual(
      onNext(360, ' xuq  '),
      onCompleted(570));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));
  });

  test('groupBy inner multiple independence', function () {
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
    var outerResults = scheduler.createObserver();

    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupBy(function (x) {
        return x.toLowerCase().trim();
      }, function (x) {
        return x.reverse();
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
        if (!Object.prototype.hasOwnProperty.call(innerSubscriptions, key)) { continue; }
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

    results['foo'].messages.assertEqual(
      onNext(220, 'oof  '),
      onNext(240, ' OoF '),
      onNext(310, ' Oof'));

    results['bar'].messages.assertEqual(
      onNext(270, '  Rab'));

    results['baz'].messages.assertEqual(
      onNext(350, '   zaB '));

    results['qux'].messages.assertEqual(
      onNext(360, ' xuq  '));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));
  });

  test('groupBy inner escape complete', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(310, 'foO '),
      onNext(470, 'FOO '),
      onNext(530, '    fOo    '),
      onCompleted(570));

    var results = scheduler.createObserver();
    var outer = null;
    var outerSubscription = null;
    var inner = null;
    var innerSubscription = null;

    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupBy(function (x) {
        return x.toLowerCase().trim();
      });
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      outerSubscription = outer.subscribe(function (group) {
        inner = group;
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
    results.messages.assertEqual(
      onCompleted(600));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));
  });

  test('groupBy inner escape error', function () {
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
    var outer = null;
    var outerSubscription = null;
    var inner = null;
    var innerSubscription = null;

    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupBy(function (x) {
        return x.toLowerCase().trim();
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

    results.messages.assertEqual(
      onError(600, error));

    xs.subscriptions.assertEqual(
      subscribe(200, 570));
  });

  test('groupBy inner escape dispose', function () {
    var scheduler = new TestScheduler();

    var xs = scheduler.createHotObservable(
      onNext(220, '  foo'),
      onNext(240, ' FoO '),
      onNext(310, 'foO '),
      onNext(470, 'FOO '),
      onNext(530, '    fOo    '),
      onError(570, new Error()));

    var results = scheduler.createObserver();
    var outer = null;
    var outerSubscription = null;
    var inner = null;
    var innerSubscription = null;

    scheduler.scheduleAbsolute(null, created, function () {
      outer = xs.groupBy(function (x) {
        return x.toLowerCase().trim();
      });
    });

    scheduler.scheduleAbsolute(null, subscribed, function () {
      outerSubscription = outer.subscribe(function (group) {
        inner = group;
      }, noop);
    });

    scheduler.scheduleAbsolute(null, 400, function () {
      outerSubscription.dispose();
    });

    scheduler.scheduleAbsolute(null, 600, function () {
      innerSubscription = inner.subscribe(results);
    });

    scheduler.scheduleAbsolute(null, disposed, function () {
      innerSubscription.dispose();
    });

    scheduler.start();

    results.messages.assertEqual();

    xs.subscriptions.assertEqual(
      subscribe(200, 400));
  });

}());
