if (!!window.WeakMap && typeof window.WeakMap.prototype.forEach === 'function') {
  (function () {

    QUnit.module('ToWeakMap');

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

    function createLineItem(text) {
      var li = document.createElement('li');
      li.textContent = text;
      return li;
    }
          
    test('toWeakMap_Completed', function () {
      var scheduler = new TestScheduler();

      var l1 = createLineItem(1),
          l2 = createLineItem(2),
          l3 = createLineItem(3),
          l4 = createLineItem(4),
          l5 = createLineItem(5);

      var xs = scheduler.createHotObservable(
        onNext(110, l1),
        onNext(220, l2),
        onNext(330, l3),
        onNext(440, l4),
        onNext(550, l5),
        onCompleted(660)
      );

      var res = scheduler.startWithCreate(function () {
        return xs.toWeakMap(function (x){ return x; }, function (x) { return x; }).map(extractValues);
      });

      res.messages.assertEqual(
        onNext(660, [4, 8, 6, 12, 8, 16, 10, 20]),
        onCompleted(660)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 660)
      );
    });

    
    test('toWeakMap_Error', function () {
      var scheduler = new TestScheduler();

      var ex = new Error();

      var xs = scheduler.createHotObservable(
        onNext(110, window),
        onNext(220, window),
        onNext(330, window),
        onNext(440, window),
        onNext(550, window),
        onError(660, ex)
      );

      var res = scheduler.startWithCreate(function () {
        return xs.toWeakMap(function (x) { return window.document; }, function (x) { return x * 4; }).map(extractValues);
      });

      res.messages.assertEqual(
        onError(660, ex)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 660)
      );
    });

    
    test('toWeakMap_KeySelectorThrows', function () {
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
        return xs.toWeakMap(function (x) { if (x < 4) { return x * 2; } else { throw ex; } }, function (x) { return x * 4; }).map(extractValues);
      });

      res.messages.assertEqual(
        onError(440, ex)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 440)
      );
    });

    
    test('toWeakMap_ElementSelectorThrows', function () {
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
        return xs.toWeakMap(function (x) { return x * 2; }, function (x) { if (x < 4) { return x * 4; } else { throw ex; } }).map(extractValues);
      });

      res.messages.assertEqual(
        onError(440, ex)
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 440)
      );
    });

    
    test('toWeakMap_Disposed', function () {
      var scheduler = new TestScheduler();

      var xs = scheduler.createHotObservable(
        onNext(110, 1),
        onNext(220, 2),
        onNext(330, 3),
        onNext(440, 4),
        onNext(550, 5)
      );

      var res = scheduler.startWithCreate(function () {
        return xs.toWeakMap(function (x) { return x * 2; }, function (x) { return x * 4; }).map(extractValues);
      });

      res.messages.assertEqual(
      );

      xs.subscriptions.assertEqual(
        subscribe(200, 1000)
      );
    });
  }());  
}