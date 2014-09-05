if (!!window.Map) {
  (function () {

    QUnit.module('ToMap');

    var TestScheduler = Rx.TestScheduler,
      onNext = Rx.ReactiveTest.onNext,
      onError = Rx.ReactiveTest.onError,
      onCompleted = Rx.ReactiveTest.onCompleted,
      subscribe = Rx.ReactiveTest.subscribe;

    function extractValues(x) {
      var arr = [];
      x.forEach(function (value, key) {
        arr.push(key, value);
      });
      return arr;
    }
          
    test('toMap_Completed', function () {
      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
        onNext(110, 1),
        onNext(220, 2),
        onNext(330, 3),
        onNext(440, 4),
        onNext(550, 5),
        onCompleted(660)
      );

      var res = scheduler.startWithCreate(function () {
        return xs.toMap(function (x){ return x * 2; }, function (x) { return x * 4; }).map(extractValues);
      });

      res.messages.assertEqual(
        onNext(660, [4, 8, 6, 12, 8, 16, 10, 20]),
        onCompleted(660)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 660)
      );
    });

    
    test('toMap_Error', function () {
      var scheduler = new TestScheduler();

      var ex = new Error();

      var xs = scheduler.createHotObservable(
        onNext(110, 1),
        onNext(220, 2),
        onNext(330, 3),
        onNext(440, 4),
        onNext(550, 5),
        onError(660, ex)
      );

      var res = scheduler.startWithCreate(function () {
        return xs.toMap(function (x) { return x * 2; }, function (x) { return x * 4; }).map(extractValues);
      });

      res.messages.assertEqual(
        onError(660, ex)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 660)
      );
    });

    
    test('toMap_KeySelectorThrows', function () {
      var scheduler = new TestScheduler();

      var ex = new Error();

      var xs = scheduler.createHotObservable(
        onNext(110, 1),
        onNext(220, 2),
        onNext(330, 3),
        onNext(440, 4),
        onNext(550, 5),
        onCompleted(600)
      );

      var res = scheduler.startWithCreate(function () {
        return xs.toMap(function (x) { if (x < 4) { return x * 2; } else { throw ex; } }, function (x) { return x * 4; }).map(extractValues);
      });

      res.messages.assertEqual(
        onError(440, ex)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 440)
      );
    });

    
    test('toMap_ElementSelectorThrows', function () {
      var scheduler = new TestScheduler();

      var ex = new Error();

      var xs = scheduler.createHotObservable(
          onNext(110, 1),
          onNext(220, 2),
          onNext(330, 3),
          onNext(440, 4),
          onNext(550, 5),
          onCompleted(600)
      );

      var res = scheduler.startWithCreate(function () {
        return xs.toMap(function (x) { return x * 2; }, function (x) { if (x < 4) { return x * 4; } else { throw ex; } }).map(extractValues);
      });

      res.messages.assertEqual(
        onError(440, ex)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 440)
      );
    });

    
    test('toMap_Disposed', function () {
      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
        onNext(110, 1),
        onNext(220, 2),
        onNext(330, 3),
        onNext(440, 4),
        onNext(550, 5)
      );

      var res = scheduler.startWithCreate(function () {
        return xs.toMap(function (x) { return x * 2; }, function (x) { return x * 4; }).map(extractValues);
      });

      res.messages.assertEqual(
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 1000)
      );
    });

  }());  
}