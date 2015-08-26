(function () {
  QUnit.module('Delay');

  var Observable = Rx.Observable,
      TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

  test('Delay_TimeSpan_Simple1', function () {
      var results, scheduler, xs;
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
      results = scheduler.startWithCreate(function () {
          return xs.delay(100, scheduler);
      });
      results.messages.assertEqual(onNext(350, 2), onNext(450, 3), onNext(550, 4), onCompleted(650));
      xs.subscriptions.assertEqual(subscribe(200, 550));
  });

  test('Delay_DateTimeOffset_Simple1_Impl', function () {
      var results, scheduler, xs;
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
      results = scheduler.startWithCreate(function () {
          return xs.delay(new Date(300), scheduler);
      });
      results.messages.assertEqual(onNext(350, 2), onNext(450, 3), onNext(550, 4), onCompleted(650));
      xs.subscriptions.assertEqual(subscribe(200, 550));
  });

  test('Delay_TimeSpan_Simple2_Impl', function () {
      var results, scheduler, xs;
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
      results = scheduler.startWithCreate(function () {
          return xs.delay(50, scheduler);
      });
      results.messages.assertEqual(onNext(300, 2), onNext(400, 3), onNext(500, 4), onCompleted(600));
      xs.subscriptions.assertEqual(subscribe(200, 550));
  });

  test('Delay_DateTimeOffset_Simple2_Impl', function () {
      var results, scheduler, xs;
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
      results = scheduler.startWithCreate(function () {
          return xs.delay(new Date(250), scheduler);
      });
      results.messages.assertEqual(onNext(300, 2), onNext(400, 3), onNext(500, 4), onCompleted(600));
      xs.subscriptions.assertEqual(subscribe(200, 550));
  });

  test('Delay_TimeSpan_Simple3_Impl', function () {
      var results, scheduler, xs;
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
      results = scheduler.startWithCreate(function () {
          return xs.delay(150, scheduler);
      });
      results.messages.assertEqual(onNext(400, 2), onNext(500, 3), onNext(600, 4), onCompleted(700));
      xs.subscriptions.assertEqual(subscribe(200, 550));
  });

  test('Delay_DateTimeOffset_Simple3_Impl', function () {
      var results, scheduler, xs;
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onCompleted(550));
      results = scheduler.startWithCreate(function () {
          return xs.delay(new Date(350), scheduler);
      });
      results.messages.assertEqual(onNext(400, 2), onNext(500, 3), onNext(600, 4), onCompleted(700));
      xs.subscriptions.assertEqual(subscribe(200, 550));
  });

  test('Delay_TimeSpan_Error1_Impl', function () {
      var ex, results, scheduler, xs;
      ex = 'ex';
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onError(550, ex));
      results = scheduler.startWithCreate(function () {
          return xs.delay(50, scheduler);
      });
      results.messages.assertEqual(onNext(300, 2), onNext(400, 3), onNext(500, 4), onError(550, ex));
      xs.subscriptions.assertEqual(subscribe(200, 550));
  });

  test('Delay_DateTimeOffset_Error1_Impl', function () {
      var ex, results, scheduler, xs;
      ex = 'ex';
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onError(550, ex));
      results = scheduler.startWithCreate(function () {
          return xs.delay(new Date(250), scheduler);
      });
      results.messages.assertEqual(onNext(300, 2), onNext(400, 3), onNext(500, 4), onError(550, ex));
      xs.subscriptions.assertEqual(subscribe(200, 550));
  });

  test('Delay_TimeSpan_Error2_Impl', function () {
      var ex, results, scheduler, xs;
      ex = 'ex';
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onError(550, ex));
      results = scheduler.startWithCreate(function () {
          return xs.delay(150, scheduler);
      });
      results.messages.assertEqual(onNext(400, 2), onNext(500, 3), onError(550, ex));
      xs.subscriptions.assertEqual(subscribe(200, 550));
  });

  test('Delay_DateTimeOffset_Error2_Impl', function () {
      var ex, results, scheduler, xs;
      ex = 'ex';
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onNext(250, 2), onNext(350, 3), onNext(450, 4), onError(550, ex));
      results = scheduler.startWithCreate(function () {
          return xs.delay(new Date(350), scheduler);
      });
      results.messages.assertEqual(onNext(400, 2), onNext(500, 3), onError(550, ex));
      xs.subscriptions.assertEqual(subscribe(200, 550));
  });

  test('Delay_Empty', function () {
      var results, scheduler, xs;
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onCompleted(550));
      results = scheduler.startWithCreate(function () {
          return xs.delay(10, scheduler);
      });
      results.messages.assertEqual(onCompleted(560));
      xs.subscriptions.assertEqual(subscribe(200, 550));
  });

  test('Delay_Error', function () {
      var ex, results, scheduler, xs;
      ex = 'ex';
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onError(550, ex));
      results = scheduler.startWithCreate(function () {
          return xs.delay(10, scheduler);
      });
      results.messages.assertEqual(onError(550, ex));
      xs.subscriptions.assertEqual(subscribe(200, 550));
  });

  test('Delay_Never', function () {
      var results, scheduler, xs;
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1));
      results = scheduler.startWithCreate(function () {
          return xs.delay(10, scheduler);
      });
      results.messages.assertEqual();
      xs.subscriptions.assertEqual(subscribe(200, 1000));
  });

  // Delay with selector
  test('Delay_Duration_Simple1', function () {
      var results, xs, scheduler;
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 10), onNext(220, 30), onNext(230, 50), onNext(240, 35), onNext(250, 20), onCompleted(260));
      results = scheduler.startWithCreate(function () {
          return xs.delay(function (x) {
              return scheduler.createColdObservable(onNext(x, '!'));
          });
      });
      results.messages.assertEqual(onNext(210 + 10, 10), onNext(220 + 30, 30), onNext(250 + 20, 20), onNext(240 + 35, 35), onNext(230 + 50, 50), onCompleted(280));
      xs.subscriptions.assertEqual(subscribe(200, 260));
  });

  test('Delay_Duration_Simple2', function () {
      var results, scheduler, xs, ys;
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onNext(250, 6), onCompleted(300));
      ys = scheduler.createColdObservable(onNext(10, '!'));
      results = scheduler.startWithCreate(function () {
          return xs.delay(function () {
              return ys;
          });
      });
      results.messages.assertEqual(onNext(210 + 10, 2), onNext(220 + 10, 3), onNext(230 + 10, 4), onNext(240 + 10, 5), onNext(250 + 10, 6), onCompleted(300));
      xs.subscriptions.assertEqual(subscribe(200, 300));
      ys.subscriptions.assertEqual(subscribe(210, 220), subscribe(220, 230), subscribe(230, 240), subscribe(240, 250), subscribe(250, 260));
  });

  test('Delay_Duration_Simple3', function () {
      var results, scheduler, xs, ys;
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onNext(250, 6), onCompleted(300));
      ys = scheduler.createColdObservable(onNext(100, '!'));
      results = scheduler.startWithCreate(function () {
          return xs.delay(function () {
              return ys;
          });
      });
      results.messages.assertEqual(onNext(210 + 100, 2), onNext(220 + 100, 3), onNext(230 + 100, 4), onNext(240 + 100, 5), onNext(250 + 100, 6), onCompleted(350));
      xs.subscriptions.assertEqual(subscribe(200, 300));
      ys.subscriptions.assertEqual(subscribe(210, 310), subscribe(220, 320), subscribe(230, 330), subscribe(240, 340), subscribe(250, 350));
  });

  test('Delay_Duration_Simple4_InnerEmpty', function () {
      var results, scheduler, xs, ys;
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onNext(250, 6), onCompleted(300));
      ys = scheduler.createColdObservable(onCompleted(100));
      results = scheduler.startWithCreate(function () {
          return xs.delay(function () {
              return ys;
          });
      });
      results.messages.assertEqual(onNext(210 + 100, 2), onNext(220 + 100, 3), onNext(230 + 100, 4), onNext(240 + 100, 5), onNext(250 + 100, 6), onCompleted(350));
      xs.subscriptions.assertEqual(subscribe(200, 300));
      ys.subscriptions.assertEqual(subscribe(210, 310), subscribe(220, 320), subscribe(230, 330), subscribe(240, 340), subscribe(250, 350));
  });

  test('Delay_Duration_Dispose1', function () {
      var results, scheduler, xs, ys;
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(220, 3), onNext(230, 4), onNext(240, 5), onNext(250, 6), onCompleted(300));
      ys = scheduler.createColdObservable(onNext(200, '!'));
      results = scheduler.startWithDispose(function () {
          return xs.delay(function () {
              return ys;
          });
      }, 425);
      results.messages.assertEqual(onNext(210 + 200, 2), onNext(220 + 200, 3));
      xs.subscriptions.assertEqual(subscribe(200, 300));
      ys.subscriptions.assertEqual(subscribe(210, 410), subscribe(220, 420), subscribe(230, 425), subscribe(240, 425), subscribe(250, 425));
  });

  test('Delay_Duration_Dispose2', function () {
      var results, scheduler, xs, ys;
      scheduler = new TestScheduler();
      xs = scheduler.createHotObservable(onNext(150, 1), onNext(210, 2), onNext(400, 3), onCompleted(500));
      ys = scheduler.createColdObservable(onNext(50, '!'));
      results = scheduler.startWithDispose(function () {
          return xs.delay(function () {
              return ys;
          });
      }, 300);
      results.messages.assertEqual(onNext(210 + 50, 2));
      xs.subscriptions.assertEqual(subscribe(200, 300));
      ys.subscriptions.assertEqual(subscribe(210, 260));
  });

}());
